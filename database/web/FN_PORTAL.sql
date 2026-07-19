-- =============================================================================
-- Funções do portal do cliente (server-web)
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_customer_account_find_by_login(p_login VARCHAR)
RETURNS TABLE (
    account_id  BIGINT,
    customer_id BIGINT,
    name        VARCHAR,
    email       VARCHAR,
    phone       VARCHAR,
    password    VARCHAR,
    active      BOOLEAN
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_digits VARCHAR := regexp_replace(COALESCE(p_login, ''), '\D', '', 'g');
BEGIN
    RETURN QUERY
    SELECT a.id, c.id, c.name, a.email, c.phone, a.password, a.active
    FROM customer_account a
    INNER JOIN customers c ON c.id = a.customer_id
    WHERE a.active = TRUE
      AND c.active = TRUE
      AND (
          LOWER(a.email) = LOWER(TRIM(p_login))
          OR (
              LENGTH(v_digits) >= 8
              AND RIGHT(regexp_replace(c.phone, '\D', '', 'g'), 8) = RIGHT(v_digits, 8)
          )
      );
END;
$$;

DROP FUNCTION IF EXISTS fn_customer_me_vehicles(BIGINT);
DROP FUNCTION IF EXISTS fn_customer_me_orders(BIGINT);

CREATE OR REPLACE FUNCTION fn_customer_me_vehicles_count(p_customer_id BIGINT)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM vehicles v
    WHERE v.customer_id = p_customer_id;
$$;

CREATE OR REPLACE FUNCTION fn_customer_me_vehicles(
    p_customer_id BIGINT,
    p_page INT,
    p_page_size INT
)
RETURNS TABLE (
    id BIGINT,
    plate VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    year INT,
    active BOOLEAN,
    created_at TIMESTAMP,
    order_count BIGINT,
    last_order_number VARCHAR,
    last_order_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_page INT := GREATEST(COALESCE(p_page, 0), 0);
    v_size INT := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
BEGIN
    RETURN QUERY
    SELECT v.id, v.plate, v.brand, v.model, v.year, v.active, v.created_at,
           (SELECT COUNT(*) FROM work_orders wo WHERE wo.vehicle_id = v.id) AS order_count,
           (
               SELECT wo.number
               FROM work_orders wo
               WHERE wo.vehicle_id = v.id
               ORDER BY wo.created_at DESC
               LIMIT 1
           ) AS last_order_number,
           (
               SELECT wo.created_at
               FROM work_orders wo
               WHERE wo.vehicle_id = v.id
               ORDER BY wo.created_at DESC
               LIMIT 1
           ) AS last_order_at
    FROM vehicles v
    WHERE v.customer_id = p_customer_id
    ORDER BY v.plate
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;

-- p_status_group: ALL | ACTIVE | HISTORY (ACTIVE = not DELIVERED/CANCELLED)
CREATE OR REPLACE FUNCTION fn_customer_me_orders_count(
    p_customer_id BIGINT,
    p_status_group VARCHAR,
    p_vehicle_id BIGINT
)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM work_orders wo
    INNER JOIN work_order_status st ON st.id = wo.status_id
    WHERE wo.customer_id = p_customer_id
      AND (p_vehicle_id IS NULL OR wo.vehicle_id = p_vehicle_id)
      AND (
          p_status_group IS NULL
          OR UPPER(TRIM(p_status_group)) IN ('', 'ALL')
          OR (UPPER(TRIM(p_status_group)) = 'ACTIVE'
              AND st.code NOT IN ('DELIVERED', 'CANCELLED'))
          OR (UPPER(TRIM(p_status_group)) = 'HISTORY'
              AND st.code IN ('DELIVERED', 'CANCELLED'))
      );
$$;

CREATE OR REPLACE FUNCTION fn_customer_me_orders(
    p_customer_id BIGINT,
    p_status_group VARCHAR,
    p_vehicle_id BIGINT,
    p_page INT,
    p_page_size INT
)
RETURNS TABLE (
    id BIGINT,
    number VARCHAR,
    vehicle_id BIGINT,
    vehicle_plate VARCHAR,
    vehicle_brand VARCHAR,
    vehicle_model VARCHAR,
    description TEXT,
    status_code VARCHAR,
    status_label VARCHAR,
    payment_status_code VARCHAR,
    payment_status_label VARCHAR,
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
    SELECT wo.id, wo.number, wo.vehicle_id, v.plate, v.brand, v.model,
           wo.description,
           st.code, st.label, ps.code, ps.label,
           fn_work_order_total(wo.id),
           wo.created_at, wo.updated_at
    FROM work_orders wo
    INNER JOIN vehicles v ON v.id = wo.vehicle_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    INNER JOIN payment_status ps ON ps.id = wo.payment_status_id
    WHERE wo.customer_id = p_customer_id
      AND (p_vehicle_id IS NULL OR wo.vehicle_id = p_vehicle_id)
      AND (
          p_status_group IS NULL
          OR UPPER(TRIM(p_status_group)) IN ('', 'ALL')
          OR (UPPER(TRIM(p_status_group)) = 'ACTIVE'
              AND st.code NOT IN ('DELIVERED', 'CANCELLED'))
          OR (UPPER(TRIM(p_status_group)) = 'HISTORY'
              AND st.code IN ('DELIVERED', 'CANCELLED'))
      )
    ORDER BY wo.created_at DESC
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;

CREATE OR REPLACE FUNCTION fn_customer_me_summary(p_customer_id BIGINT)
RETURNS TABLE (
    vehicle_count BIGINT,
    active_order_count BIGINT,
    history_order_count BIGINT,
    total_order_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        (SELECT COUNT(*) FROM vehicles v WHERE v.customer_id = p_customer_id) AS vehicle_count,
        (
            SELECT COUNT(*)
            FROM work_orders wo
            INNER JOIN work_order_status st ON st.id = wo.status_id
            WHERE wo.customer_id = p_customer_id
              AND st.code NOT IN ('DELIVERED', 'CANCELLED')
        ) AS active_order_count,
        (
            SELECT COUNT(*)
            FROM work_orders wo
            INNER JOIN work_order_status st ON st.id = wo.status_id
            WHERE wo.customer_id = p_customer_id
              AND st.code IN ('DELIVERED', 'CANCELLED')
        ) AS history_order_count,
        (SELECT COUNT(*) FROM work_orders wo WHERE wo.customer_id = p_customer_id) AS total_order_count;
$$;

CREATE OR REPLACE FUNCTION fn_work_order_track(p_number VARCHAR, p_plate VARCHAR)
RETURNS TABLE (
    id BIGINT,
    number VARCHAR,
    customer_name VARCHAR,
    vehicle_plate VARCHAR,
    vehicle_brand VARCHAR,
    vehicle_model VARCHAR,
    vehicle_year INT,
    description TEXT,
    status_code VARCHAR,
    status_label VARCHAR,
    payment_status_code VARCHAR,
    payment_status_label VARCHAR,
    total NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT wo.id, wo.number, c.name, v.plate, v.brand, v.model, v.year,
           wo.description,
           st.code, st.label, ps.code, ps.label,
           fn_work_order_total(wo.id),
           wo.created_at, wo.updated_at
    FROM work_orders wo
    INNER JOIN customers c ON c.id = wo.customer_id
    INNER JOIN vehicles v ON v.id = wo.vehicle_id
    INNER JOIN work_order_status st ON st.id = wo.status_id
    INNER JOIN payment_status ps ON ps.id = wo.payment_status_id
    WHERE UPPER(TRIM(wo.number)) = UPPER(TRIM(p_number))
      AND UPPER(REPLACE(v.plate, '-', '')) = UPPER(REPLACE(TRIM(p_plate), '-', ''));
$$;
