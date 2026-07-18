-- =============================================================================
-- Seed MVP: clientes, contas portal, veículos, catálogos e ~480 OS (24 meses)
-- Idempotente: só roda a geração em massa se ainda não houver OS suficientes.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Clientes demo (protótipo) + contas do portal
-- -----------------------------------------------------------------------------
INSERT INTO customers (name, document, phone)
SELECT 'Roberto Silva', '123.456.789-00', '11987654321'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE phone = '11987654321' AND name = 'Roberto Silva');

INSERT INTO customers (name, document, phone)
SELECT 'Ana Paula Costa', NULL, '11999887766'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE phone = '11999887766' AND name = 'Ana Paula Costa');

INSERT INTO customers (name, document, phone)
SELECT 'Marcos Oliveira', '98.765.432/0001-10', '21988776655'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE phone = '21988776655' AND name = 'Marcos Oliveira');

INSERT INTO customer_account (customer_id, email, password)
SELECT c.id, 'roberto@email.com', crypt('123456', gen_salt('bf', 10))
FROM customers c
WHERE c.phone = '11987654321' AND c.name = 'Roberto Silva'
  AND NOT EXISTS (SELECT 1 FROM customer_account WHERE LOWER(email) = 'roberto@email.com');

INSERT INTO customer_account (customer_id, email, password)
SELECT c.id, 'ana@email.com', crypt('123456', gen_salt('bf', 10))
FROM customers c
WHERE c.phone = '11999887766' AND c.name = 'Ana Paula Costa'
  AND NOT EXISTS (SELECT 1 FROM customer_account WHERE LOWER(email) = 'ana@email.com');

INSERT INTO customer_account (customer_id, email, password)
SELECT c.id, 'marcos@email.com', crypt('123456', gen_salt('bf', 10))
FROM customers c
WHERE c.phone = '21988776655' AND c.name = 'Marcos Oliveira'
  AND NOT EXISTS (SELECT 1 FROM customer_account WHERE LOWER(email) = 'marcos@email.com');

-- -----------------------------------------------------------------------------
-- Veículos demo
-- -----------------------------------------------------------------------------
INSERT INTO vehicles (customer_id, plate, brand, model, year)
SELECT c.id, 'ABC1D23', 'Volkswagen', 'Gol', 2018
FROM customers c WHERE c.phone = '11987654321'
  AND NOT EXISTS (SELECT 1 FROM vehicles WHERE plate = 'ABC1D23');

INSERT INTO vehicles (customer_id, plate, brand, model, year)
SELECT c.id, 'XYZ9K88', 'Fiat', 'Strada', 2021
FROM customers c WHERE c.phone = '11987654321'
  AND NOT EXISTS (SELECT 1 FROM vehicles WHERE plate = 'XYZ9K88');

INSERT INTO vehicles (customer_id, plate, brand, model, year)
SELECT c.id, 'QWE4R56', 'Chevrolet', 'Onix', 2020
FROM customers c WHERE c.phone = '11999887766'
  AND NOT EXISTS (SELECT 1 FROM vehicles WHERE plate = 'QWE4R56');

INSERT INTO vehicles (customer_id, plate, brand, model, year)
SELECT c.id, 'JKL7M89', 'Toyota', 'Corolla', 2019
FROM customers c WHERE c.phone = '21988776655'
  AND NOT EXISTS (SELECT 1 FROM vehicles WHERE plate = 'JKL7M89');

-- -----------------------------------------------------------------------------
-- Catálogos
-- -----------------------------------------------------------------------------
INSERT INTO service_catalog (name, default_price, active)
SELECT v.name, v.price, TRUE
FROM (VALUES
    ('Troca de óleo', 120.00),
    ('Alinhamento e balanceamento', 180.00),
    ('Revisão completa', 450.00),
    ('Diagnóstico eletrônico', 150.00),
    ('Troca de correia dentada', 650.00),
    ('Troca de amortecedor', 280.00),
    ('Troca de bateria', 50.00),
    ('Limpeza de bicos', 220.00)
) AS v(name, price)
WHERE NOT EXISTS (SELECT 1 FROM service_catalog s WHERE s.name = v.name);

INSERT INTO part_catalog (name, active)
SELECT v.name, TRUE
FROM (VALUES
    ('Filtro de óleo'),
    ('Pastilha de freio (jogo)'),
    ('Vela de ignição (unidade)'),
    ('Correia dentada'),
    ('Filtro de ar'),
    ('Óleo 5W30 (litro)'),
    ('Bateria 60Ah'),
    ('Kit correia dentada'),
    ('Amortecedor (unidade)'),
    ('Filtro de combustível')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM part_catalog p WHERE p.name = v.name);

-- -----------------------------------------------------------------------------
-- Clientes/veículos extras + ~480 OS em 24 meses
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    v_wo_count BIGINT;
    v_admin_id BIGINT;
    v_attn_id BIGINT;
    v_mech_id BIGINT;
    v_status_open SMALLINT;
    v_status_progress SMALLINT;
    v_status_waiting SMALLINT;
    v_status_ready SMALLINT;
    v_status_delivered SMALLINT;
    v_status_cancelled SMALLINT;
    v_pay_unpaid SMALLINT;
    v_pay_waiting SMALLINT;
    v_pay_paid SMALLINT;
    v_type_service SMALLINT;
    v_type_part SMALLINT;
    v_month INT;
    v_i INT;
    v_customer_id BIGINT;
    v_vehicle_id BIGINT;
    v_wo_id BIGINT;
    v_number VARCHAR;
    v_created TIMESTAMP;
    v_status_id SMALLINT;
    v_pay_id SMALLINT;
    v_svc_id BIGINT;
    v_part_id BIGINT;
    v_svc_price NUMERIC;
    v_desc TEXT;
    v_brands TEXT[] := ARRAY['Volkswagen','Fiat','Chevrolet','Toyota','Honda','Hyundai','Renault','Ford'];
    v_models TEXT[] := ARRAY['Gol','Uno','Onix','Corolla','Civic','HB20','Sandero','Ka'];
    v_first TEXT[] := ARRAY['Carlos','Maria','Pedro','Juliana','Fernando','Patricia','Lucas','Camila','Rafael','Beatriz'];
    v_last TEXT[] := ARRAY['Souza','Lima','Alves','Ferreira','Rodrigues','Pereira','Gomes','Martins','Rocha','Dias'];
    v_plate VARCHAR;
    v_name VARCHAR;
    v_phone VARCHAR;
    v_day INT;
    v_status_codes TEXT[];
    v_pay_codes TEXT[];
    v_hist_status SMALLINT;
BEGIN
    SELECT COUNT(*) INTO v_wo_count FROM work_orders;
    IF v_wo_count >= 400 THEN
        RAISE NOTICE 'Seed OS já aplicado (% OS existentes). Pulando geração em massa.', v_wo_count;
        RETURN;
    END IF;

    SELECT id INTO v_admin_id FROM users WHERE email = 'admin@oficina.com';
    SELECT id INTO v_attn_id FROM users WHERE email = 'atendente@oficina.com';
    SELECT id INTO v_mech_id FROM users WHERE email = 'mecanico@oficina.com';

    SELECT id INTO v_status_open FROM work_order_status WHERE code = 'OPEN';
    SELECT id INTO v_status_progress FROM work_order_status WHERE code = 'IN_PROGRESS';
    SELECT id INTO v_status_waiting FROM work_order_status WHERE code = 'WAITING_PARTS';
    SELECT id INTO v_status_ready FROM work_order_status WHERE code = 'READY';
    SELECT id INTO v_status_delivered FROM work_order_status WHERE code = 'DELIVERED';
    SELECT id INTO v_status_cancelled FROM work_order_status WHERE code = 'CANCELLED';

    SELECT id INTO v_pay_unpaid FROM payment_status WHERE code = 'UNPAID';
    SELECT id INTO v_pay_waiting FROM payment_status WHERE code = 'WAITING_PAYMENT';
    SELECT id INTO v_pay_paid FROM payment_status WHERE code = 'PAID';

    SELECT id INTO v_type_service FROM work_order_item_type WHERE code = 'SERVICE';
    SELECT id INTO v_type_part FROM work_order_item_type WHERE code = 'PART';

    -- ~40 clientes extras com 1 veículo cada
    FOR v_i IN 1..40 LOOP
        v_name := v_first[1 + ((v_i - 1) % 10)] || ' ' || v_last[1 + ((v_i - 1) % 10)];
        v_phone := '1199' || LPAD((100000 + v_i)::TEXT, 6, '0');
        v_plate := 'SEED' || LPAD(v_i::TEXT, 3, '0');

        IF NOT EXISTS (SELECT 1 FROM vehicles WHERE plate = v_plate) THEN
            INSERT INTO customers (name, phone, document)
            VALUES (v_name, v_phone, NULL)
            RETURNING id INTO v_customer_id;

            INSERT INTO vehicles (customer_id, plate, brand, model, year)
            VALUES (
                v_customer_id,
                v_plate,
                v_brands[1 + ((v_i - 1) % 8)],
                v_models[1 + ((v_i - 1) % 8)],
                2015 + (v_i % 10)
            );
        END IF;
    END LOOP;

    -- 24 meses × 20 OS ≈ 480
    FOR v_month IN 0..23 LOOP
        FOR v_i IN 1..20 LOOP
            -- escolhe cliente/veículo aleatório existente
            SELECT v.id, v.customer_id
            INTO v_vehicle_id, v_customer_id
            FROM vehicles v
            ORDER BY md5(v.id::TEXT || v_month::TEXT || v_i::TEXT)
            LIMIT 1;

            v_day := 1 + ((v_i * 3) % 28);
            v_created := (DATE_TRUNC('month', NOW()) - (v_month || ' months')::INTERVAL)
                         + (v_day || ' days')::INTERVAL
                         + ((8 + (v_i % 8)) || ' hours')::INTERVAL;

            -- distribuição de status: maioria entregue no passado; recentes ativas
            IF v_month = 0 AND v_i <= 8 THEN
                v_status_codes := ARRAY['OPEN','IN_PROGRESS','WAITING_PARTS','READY'];
                v_status_id := CASE (v_i % 4)
                    WHEN 0 THEN v_status_open
                    WHEN 1 THEN v_status_progress
                    WHEN 2 THEN v_status_waiting
                    ELSE v_status_ready END;
                v_pay_id := CASE WHEN v_status_id = v_status_ready THEN v_pay_waiting ELSE v_pay_unpaid END;
            ELSIF v_i = 20 AND v_month % 5 = 0 THEN
                v_status_id := v_status_cancelled;
                v_pay_id := v_pay_unpaid;
            ELSE
                v_status_id := v_status_delivered;
                v_pay_id := v_pay_paid;
            END IF;

            v_number := 'OS-' || TO_CHAR(v_created, 'YYYY') || '-'
                        || LPAD(((v_month * 20) + v_i)::TEXT, 4, '0');

            IF EXISTS (SELECT 1 FROM work_orders WHERE number = v_number) THEN
                CONTINUE;
            END IF;

            v_desc := CASE (v_i % 6)
                WHEN 0 THEN 'Troca de óleo e filtros.'
                WHEN 1 THEN 'Barulho no motor / diagnóstico.'
                WHEN 2 THEN 'Freios rangendo.'
                WHEN 3 THEN 'Alinhamento e balanceamento.'
                WHEN 4 THEN 'Revisão periódica.'
                ELSE 'Troca de peça sob demanda.'
            END;

            INSERT INTO work_orders (
                number, customer_id, vehicle_id, description,
                status_id, payment_status_id, mechanic_id, created_by_id,
                created_at, updated_at
            )
            VALUES (
                v_number, v_customer_id, v_vehicle_id, v_desc,
                v_status_id, v_pay_id, v_mech_id,
                CASE WHEN v_i % 3 = 0 THEN v_admin_id ELSE v_attn_id END,
                v_created,
                v_created + ((1 + (v_i % 3)) || ' days')::INTERVAL
            )
            RETURNING id INTO v_wo_id;

            -- histórico coerente
            INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id, changed_at)
            VALUES (v_wo_id, v_status_open, 'OS aberta no balcão.', v_attn_id, v_created);

            IF v_status_id <> v_status_open AND v_status_id <> v_status_cancelled THEN
                INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id, changed_at)
                VALUES (v_wo_id, v_status_progress, 'Serviço iniciado.', v_mech_id, v_created + INTERVAL '4 hours');
            END IF;

            IF v_status_id = v_status_waiting THEN
                INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id, changed_at)
                VALUES (v_wo_id, v_status_waiting, 'Aguardando peça.', v_mech_id, v_created + INTERVAL '1 day');
            ELSIF v_status_id IN (v_status_ready, v_status_delivered) THEN
                INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id, changed_at)
                VALUES (v_wo_id, v_status_ready, 'Veículo pronto.', v_mech_id, v_created + INTERVAL '1 day');
            END IF;

            IF v_status_id = v_status_delivered THEN
                INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id, changed_at)
                VALUES (v_wo_id, v_status_delivered, 'Veículo entregue.', v_attn_id, v_created + INTERVAL '2 days');
            END IF;

            IF v_status_id = v_status_cancelled THEN
                INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id, changed_at)
                VALUES (v_wo_id, v_status_cancelled, 'OS cancelada.', v_admin_id, v_created + INTERVAL '1 day');
            END IF;

            -- itens
            SELECT id, default_price INTO v_svc_id, v_svc_price
            FROM service_catalog
            ORDER BY md5(id::TEXT || v_wo_id::TEXT)
            LIMIT 1;

            INSERT INTO work_order_items (work_order_id, item_type_id, service_id, description, quantity, unit_price, created_at)
            VALUES (v_wo_id, v_type_service, v_svc_id,
                    (SELECT name FROM service_catalog WHERE id = v_svc_id),
                    1, v_svc_price, v_created);

            IF v_i % 2 = 0 THEN
                SELECT id INTO v_part_id
                FROM part_catalog
                ORDER BY md5(id::TEXT || v_wo_id::TEXT || 'p')
                LIMIT 1;

                INSERT INTO work_order_items (work_order_id, item_type_id, part_id, description, quantity, unit_price, created_at)
                VALUES (
                    v_wo_id, v_type_part, v_part_id,
                    (SELECT name FROM part_catalog WHERE id = v_part_id),
                    1 + (v_i % 3),
                    40 + (v_i * 7) % 200,
                    v_created
                );
            END IF;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Seed OS concluído.';
END $$;
