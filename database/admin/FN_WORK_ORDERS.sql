-- =============================================================================
-- Funções de ordens de serviço (admin)
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_work_order_total(p_work_order_id BIGINT)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(SUM(quantity * unit_price), 0)
    FROM work_order_items
    WHERE work_order_id = p_work_order_id;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_find_by_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    number VARCHAR,
    customer_id BIGINT,
    customer_name VARCHAR,
    customer_phone VARCHAR,
    vehicle_id BIGINT,
    vehicle_plate VARCHAR,
    vehicle_brand VARCHAR,
    vehicle_model VARCHAR,
    vehicle_year INT,
    description TEXT,
    status_code VARCHAR,
    status_label VARCHAR,
    payment_status_code VARCHAR,
    payment_status_label VARCHAR,
    mechanic_id BIGINT,
    mechanic_name VARCHAR,
    created_by_id BIGINT,
    created_by_name VARCHAR,
    total NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT wo.id, wo.number, wo.customer_id, c.name, c.phone,
           wo.vehicle_id, v.plate, v.brand, v.model, v.year,
           wo.description,
           st.code, st.label,
           ps.code, ps.label,
           wo.mechanic_id, m.name,
           wo.created_by_id, cb.name,
           fn_work_order_total(wo.id),
           wo.created_at, wo.updated_at
    FROM work_orders wo
    INNER JOIN customers c ON c.id = wo.customer_id
    INNER JOIN vehicles v ON v.id = wo.vehicle_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    INNER JOIN payment_status ps ON ps.id = wo.payment_status_id
    LEFT JOIN users m ON m.id = wo.mechanic_id
    INNER JOIN users cb ON cb.id = wo.created_by_id
    WHERE wo.id = p_id;
$$;

-- Assinaturas antigas (só status) — removidas para evitar overload
DROP FUNCTION IF EXISTS fn_work_order_count(VARCHAR);
DROP FUNCTION IF EXISTS fn_work_order_list(VARCHAR, INT, INT);

CREATE OR REPLACE FUNCTION fn_work_order_count(
    p_status_code VARCHAR,
    p_payment_status_code VARCHAR,
    p_search VARCHAR,
    p_customer_id BIGINT
)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM work_orders wo
    INNER JOIN customers c ON c.id = wo.customer_id
    INNER JOIN vehicles v ON v.id = wo.vehicle_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    INNER JOIN payment_status ps ON ps.id = wo.payment_status_id
    WHERE (p_status_code IS NULL
           OR TRIM(p_status_code) = ''
           OR UPPER(TRIM(p_status_code)) = 'ALL'
           OR st.code = UPPER(TRIM(p_status_code)))
      AND (p_payment_status_code IS NULL
           OR TRIM(p_payment_status_code) = ''
           OR UPPER(TRIM(p_payment_status_code)) = 'ALL'
           OR ps.code = UPPER(TRIM(p_payment_status_code)))
      AND (p_customer_id IS NULL OR wo.customer_id = p_customer_id)
      AND (NULLIF(TRIM(p_search), '') IS NULL
           OR LOWER(wo.number) LIKE '%' || LOWER(TRIM(p_search)) || '%'
           OR LOWER(wo.description) LIKE '%' || LOWER(TRIM(p_search)) || '%'
           OR UPPER(v.plate) LIKE '%' || UPPER(TRIM(p_search)) || '%'
           OR LOWER(c.name) LIKE '%' || LOWER(TRIM(p_search)) || '%');
$$;

CREATE OR REPLACE FUNCTION fn_work_order_list(
    p_status_code VARCHAR,
    p_payment_status_code VARCHAR,
    p_search VARCHAR,
    p_customer_id BIGINT,
    p_page INT,
    p_page_size INT
)
RETURNS TABLE (
    id BIGINT,
    number VARCHAR,
    customer_id BIGINT,
    customer_name VARCHAR,
    vehicle_id BIGINT,
    vehicle_plate VARCHAR,
    description TEXT,
    status_code VARCHAR,
    status_label VARCHAR,
    payment_status_code VARCHAR,
    payment_status_label VARCHAR,
    mechanic_id BIGINT,
    mechanic_name VARCHAR,
    total NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_page INT := GREATEST(COALESCE(p_page, 0), 0);
    v_size INT := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
BEGIN
    RETURN QUERY
    SELECT wo.id, wo.number, wo.customer_id, c.name,
           wo.vehicle_id, v.plate, wo.description,
           st.code, st.label, ps.code, ps.label,
           wo.mechanic_id, m.name,
           fn_work_order_total(wo.id),
           wo.created_at, wo.updated_at
    FROM work_orders wo
    INNER JOIN customers c ON c.id = wo.customer_id
    INNER JOIN vehicles v ON v.id = wo.vehicle_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    INNER JOIN payment_status ps ON ps.id = wo.payment_status_id
    LEFT JOIN users m ON m.id = wo.mechanic_id
    WHERE (p_status_code IS NULL
           OR TRIM(p_status_code) = ''
           OR UPPER(TRIM(p_status_code)) = 'ALL'
           OR st.code = UPPER(TRIM(p_status_code)))
      AND (p_payment_status_code IS NULL
           OR TRIM(p_payment_status_code) = ''
           OR UPPER(TRIM(p_payment_status_code)) = 'ALL'
           OR ps.code = UPPER(TRIM(p_payment_status_code)))
      AND (p_customer_id IS NULL OR wo.customer_id = p_customer_id)
      AND (NULLIF(TRIM(p_search), '') IS NULL
           OR LOWER(wo.number) LIKE '%' || LOWER(TRIM(p_search)) || '%'
           OR LOWER(wo.description) LIKE '%' || LOWER(TRIM(p_search)) || '%'
           OR UPPER(v.plate) LIKE '%' || UPPER(TRIM(p_search)) || '%'
           OR LOWER(c.name) LIKE '%' || LOWER(TRIM(p_search)) || '%')
    ORDER BY wo.created_at DESC, wo.id DESC
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_insert(
    p_customer_id BIGINT,
    p_vehicle_id BIGINT,
    p_description TEXT,
    p_created_by_id BIGINT,
    p_mechanic_id BIGINT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
    v_number VARCHAR;
    v_status_id SMALLINT;
    v_payment_id SMALLINT;
    v_year INT := EXTRACT(YEAR FROM NOW())::INT;
    v_seq INT;
BEGIN
    SELECT id INTO v_status_id FROM work_order_status WHERE code = 'OPEN';
    SELECT id INTO v_payment_id FROM payment_status WHERE code = 'UNPAID';

    SELECT COALESCE(MAX(
        CASE WHEN number ~ ('^OS-' || v_year::TEXT || '-[0-9]+$')
             THEN SUBSTRING(number FROM LENGTH('OS-' || v_year::TEXT || '-') + 1)::INT
             ELSE 0 END
    ), 0) + 1
    INTO v_seq
    FROM work_orders;

    v_number := 'OS-' || v_year::TEXT || '-' || LPAD(v_seq::TEXT, 3, '0');

    INSERT INTO work_orders (
        number, customer_id, vehicle_id, description,
        status_id, payment_status_id, mechanic_id, created_by_id
    )
    VALUES (
        v_number, p_customer_id, p_vehicle_id, TRIM(p_description),
        v_status_id, v_payment_id, p_mechanic_id, p_created_by_id
    )
    RETURNING id INTO v_id;

    INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id)
    VALUES (v_id, v_status_id, 'OS aberta no balcão.', p_created_by_id);

    RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_update_status(
    p_id BIGINT,
    p_status_code VARCHAR,
    p_changed_by_id BIGINT,
    p_note TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_status_id SMALLINT;
    v_current VARCHAR;
BEGIN
    SELECT id INTO v_status_id FROM work_order_status WHERE code = UPPER(TRIM(p_status_code));
    IF v_status_id IS NULL THEN
        RAISE EXCEPTION 'Invalid status code: %', p_status_code;
    END IF;

    SELECT st.code INTO v_current
    FROM work_orders wo
    INNER JOIN work_order_status st ON st.id = wo.status_id
    WHERE wo.id = p_id;

    IF v_current IS NULL THEN
        RAISE EXCEPTION 'Work order not found: %', p_id;
    END IF;

    IF v_current IN ('DELIVERED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Cannot change status of closed work order';
    END IF;

    UPDATE work_orders
    SET status_id = v_status_id,
        updated_at = NOW()
    WHERE id = p_id;

    INSERT INTO work_order_status_history (work_order_id, status_id, note, changed_by_id)
    VALUES (p_id, v_status_id, NULLIF(TRIM(p_note), ''), p_changed_by_id);
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_update_payment(p_id BIGINT, p_payment_code VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_payment_id SMALLINT;
BEGIN
    SELECT id INTO v_payment_id FROM payment_status WHERE code = UPPER(TRIM(p_payment_code));
    IF v_payment_id IS NULL THEN
        RAISE EXCEPTION 'Invalid payment status: %', p_payment_code;
    END IF;

    UPDATE work_orders
    SET payment_status_id = v_payment_id,
        updated_at = NOW()
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_assign_mechanic(p_id BIGINT, p_mechanic_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE work_orders
    SET mechanic_id = p_mechanic_id,
        updated_at = NOW()
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_items_by_order(p_work_order_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    work_order_id BIGINT,
    item_type_code VARCHAR,
    item_type_label VARCHAR,
    service_id BIGINT,
    part_id BIGINT,
    description VARCHAR,
    quantity NUMERIC,
    unit_price NUMERIC,
    line_total NUMERIC,
    created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT i.id, i.work_order_id, t.code, t.label, i.service_id, i.part_id,
           i.description, i.quantity, i.unit_price,
           (i.quantity * i.unit_price) AS line_total,
           i.created_at
    FROM work_order_items i
    INNER JOIN work_order_item_type t ON t.id = i.item_type_id
    WHERE i.work_order_id = p_work_order_id
    ORDER BY i.id;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_item_insert(
    p_work_order_id BIGINT,
    p_item_type_code VARCHAR,
    p_service_id BIGINT,
    p_part_id BIGINT,
    p_description VARCHAR,
    p_quantity NUMERIC,
    p_unit_price NUMERIC
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
    v_type_id SMALLINT;
    v_status VARCHAR;
BEGIN
    SELECT st.code INTO v_status
    FROM work_orders wo
    INNER JOIN work_order_status st ON st.id = wo.status_id
    WHERE wo.id = p_work_order_id;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Work order not found';
    END IF;
    IF v_status IN ('DELIVERED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Cannot add items to closed work order';
    END IF;

    SELECT id INTO v_type_id FROM work_order_item_type WHERE code = UPPER(TRIM(p_item_type_code));
    IF v_type_id IS NULL THEN
        RAISE EXCEPTION 'Invalid item type';
    END IF;

    INSERT INTO work_order_items (
        work_order_id, item_type_id, service_id, part_id,
        description, quantity, unit_price
    )
    VALUES (
        p_work_order_id, v_type_id, p_service_id, p_part_id,
        TRIM(p_description), COALESCE(p_quantity, 1), COALESCE(p_unit_price, 0)
    )
    RETURNING id INTO v_id;

    UPDATE work_orders SET updated_at = NOW() WHERE id = p_work_order_id;
    RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_item_update(
    p_id BIGINT,
    p_quantity NUMERIC,
    p_unit_price NUMERIC,
    p_description VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_wo_id BIGINT;
    v_status VARCHAR;
BEGIN
    SELECT i.work_order_id, st.code
    INTO v_wo_id, v_status
    FROM work_order_items i
    INNER JOIN work_orders wo ON wo.id = i.work_order_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    WHERE i.id = p_id;

    IF v_wo_id IS NULL THEN
        RAISE EXCEPTION 'Item not found';
    END IF;
    IF v_status IN ('DELIVERED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Cannot update items of closed work order';
    END IF;

    UPDATE work_order_items
    SET quantity = COALESCE(p_quantity, quantity),
        unit_price = COALESCE(p_unit_price, unit_price),
        description = COALESCE(NULLIF(TRIM(p_description), ''), description)
    WHERE id = p_id;

    UPDATE work_orders SET updated_at = NOW() WHERE id = v_wo_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_item_delete(p_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_wo_id BIGINT;
    v_status VARCHAR;
BEGIN
    SELECT i.work_order_id, st.code
    INTO v_wo_id, v_status
    FROM work_order_items i
    INNER JOIN work_orders wo ON wo.id = i.work_order_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    WHERE i.id = p_id;

    IF v_wo_id IS NULL THEN
        RAISE EXCEPTION 'Item not found';
    END IF;
    IF v_status IN ('DELIVERED', 'CANCELLED') THEN
        RAISE EXCEPTION 'Cannot delete items of closed work order';
    END IF;

    DELETE FROM work_order_items WHERE id = p_id;
    UPDATE work_orders SET updated_at = NOW() WHERE id = v_wo_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_history(p_work_order_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    status_code VARCHAR,
    status_label VARCHAR,
    note TEXT,
    changed_by_id BIGINT,
    changed_by_name VARCHAR,
    changed_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT h.id, st.code, st.label, h.note, h.changed_by_id, u.name, h.changed_at
    FROM work_order_status_history h
    INNER JOIN work_order_status st ON st.id = h.status_id
    LEFT JOIN users u ON u.id = h.changed_by_id
    WHERE h.work_order_id = p_work_order_id
    ORDER BY h.changed_at ASC, h.id ASC;
$$;

DROP FUNCTION IF EXISTS fn_work_order_by_vehicle(BIGINT);

CREATE OR REPLACE FUNCTION fn_work_order_count_by_vehicle(p_vehicle_id BIGINT)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM work_orders wo
    WHERE wo.vehicle_id = p_vehicle_id;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_by_vehicle(
    p_vehicle_id BIGINT,
    p_page INT,
    p_page_size INT
)
RETURNS TABLE (
    id BIGINT,
    number VARCHAR,
    customer_id BIGINT,
    customer_name VARCHAR,
    vehicle_id BIGINT,
    vehicle_plate VARCHAR,
    description TEXT,
    status_code VARCHAR,
    status_label VARCHAR,
    payment_status_code VARCHAR,
    payment_status_label VARCHAR,
    mechanic_id BIGINT,
    mechanic_name VARCHAR,
    total NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_page INT := GREATEST(COALESCE(p_page, 0), 0);
    v_size INT := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
BEGIN
    RETURN QUERY
    SELECT wo.id, wo.number, wo.customer_id, c.name,
           wo.vehicle_id, v.plate, wo.description,
           st.code, st.label, ps.code, ps.label,
           wo.mechanic_id, m.name,
           fn_work_order_total(wo.id),
           wo.created_at, wo.updated_at
    FROM work_orders wo
    INNER JOIN customers c ON c.id = wo.customer_id
    INNER JOIN vehicles v ON v.id = wo.vehicle_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    INNER JOIN payment_status ps ON ps.id = wo.payment_status_id
    LEFT JOIN users m ON m.id = wo.mechanic_id
    WHERE wo.vehicle_id = p_vehicle_id
    ORDER BY wo.created_at DESC
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_panorama()
RETURNS TABLE (
    status_code VARCHAR,
    status_label VARCHAR,
    display_order SMALLINT,
    order_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT st.code, st.label, st.display_order,
           COUNT(wo.id) AS order_count
    FROM work_order_status st
    LEFT JOIN work_orders wo ON wo.status_id = st.id
    WHERE st.is_active_stage = TRUE
    GROUP BY st.id, st.code, st.label, st.display_order
    ORDER BY st.display_order;
$$;

DROP FUNCTION IF EXISTS fn_quick_search(VARCHAR);

CREATE OR REPLACE FUNCTION fn_quick_search_count(p_query VARCHAR)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM (
        SELECT c.id
        FROM customers c
        WHERE c.active = TRUE
          AND (
              LOWER(c.name) LIKE '%' || LOWER(TRIM(p_query)) || '%'
              OR c.phone LIKE '%' || regexp_replace(TRIM(p_query), '\D', '', 'g') || '%'
              OR RIGHT(regexp_replace(c.phone, '\D', '', 'g'), 8)
                 = RIGHT(regexp_replace(TRIM(p_query), '\D', '', 'g'), 8)
          )
        UNION ALL
        SELECT v.id
        FROM vehicles v
        INNER JOIN customers c ON c.id = v.customer_id
        WHERE v.active = TRUE
          AND (
              UPPER(v.plate) LIKE '%' || UPPER(TRIM(p_query)) || '%'
              OR LOWER(v.brand || ' ' || v.model) LIKE '%' || LOWER(TRIM(p_query)) || '%'
          )
    ) q;
$$;

CREATE OR REPLACE FUNCTION fn_quick_search(p_query VARCHAR, p_page INT, p_page_size INT)
RETURNS TABLE (
    result_type VARCHAR,
    id BIGINT,
    label VARCHAR,
    subtitle VARCHAR,
    customer_id BIGINT,
    vehicle_id BIGINT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_page INT := GREATEST(COALESCE(p_page, 0), 0);
    v_size INT := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
BEGIN
    RETURN QUERY
    SELECT q.result_type, q.id, q.label, q.subtitle, q.customer_id, q.vehicle_id
    FROM (
        SELECT 'CUSTOMER'::VARCHAR AS result_type,
               c.id,
               c.name AS label,
               c.phone AS subtitle,
               c.id AS customer_id,
               NULL::BIGINT AS vehicle_id
        FROM customers c
        WHERE c.active = TRUE
          AND (
              LOWER(c.name) LIKE '%' || LOWER(TRIM(p_query)) || '%'
              OR c.phone LIKE '%' || regexp_replace(TRIM(p_query), '\D', '', 'g') || '%'
              OR RIGHT(regexp_replace(c.phone, '\D', '', 'g'), 8)
                 = RIGHT(regexp_replace(TRIM(p_query), '\D', '', 'g'), 8)
          )
        UNION ALL
        SELECT 'VEHICLE'::VARCHAR,
               v.id,
               v.plate,
               (v.brand || ' ' || v.model || ' — ' || c.name)::VARCHAR,
               v.customer_id,
               v.id
        FROM vehicles v
        INNER JOIN customers c ON c.id = v.customer_id
        WHERE v.active = TRUE
          AND (
              UPPER(v.plate) LIKE '%' || UPPER(TRIM(p_query)) || '%'
              OR LOWER(v.brand || ' ' || v.model) LIKE '%' || LOWER(TRIM(p_query)) || '%'
          )
    ) q
    ORDER BY q.result_type, q.label
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;
