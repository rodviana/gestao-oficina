-- =============================================================================
-- Funções de veículos (admin)
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_vehicle_find_by_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    customer_id BIGINT,
    customer_name VARCHAR,
    plate VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    year INT,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT v.id, v.customer_id, c.name AS customer_name, v.plate, v.brand, v.model,
           v.year, v.active, v.created_at
    FROM vehicles v
    INNER JOIN customers c ON c.id = v.customer_id
    WHERE v.id = p_id;
$$;

CREATE OR REPLACE FUNCTION fn_vehicle_find_by_plate(p_plate VARCHAR)
RETURNS TABLE (
    id BIGINT,
    customer_id BIGINT,
    customer_name VARCHAR,
    plate VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    year INT,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT v.id, v.customer_id, c.name AS customer_name, v.plate, v.brand, v.model,
           v.year, v.active, v.created_at
    FROM vehicles v
    INNER JOIN customers c ON c.id = v.customer_id
    WHERE UPPER(REPLACE(v.plate, '-', '')) = UPPER(REPLACE(TRIM(p_plate), '-', ''))
      AND v.active = TRUE;
$$;

DROP FUNCTION IF EXISTS fn_vehicle_find_by_customer(BIGINT);

CREATE OR REPLACE FUNCTION fn_vehicle_count_by_customer(p_customer_id BIGINT)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM vehicles v
    WHERE v.customer_id = p_customer_id;
$$;

CREATE OR REPLACE FUNCTION fn_vehicle_find_by_customer(
    p_customer_id BIGINT,
    p_page INT,
    p_page_size INT
)
RETURNS TABLE (
    id BIGINT,
    customer_id BIGINT,
    customer_name VARCHAR,
    plate VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    year INT,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_page INT := GREATEST(COALESCE(p_page, 0), 0);
    v_size INT := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
BEGIN
    RETURN QUERY
    SELECT v.id, v.customer_id, c.name AS customer_name, v.plate, v.brand, v.model,
           v.year, v.active, v.created_at
    FROM vehicles v
    INNER JOIN customers c ON c.id = v.customer_id
    WHERE v.customer_id = p_customer_id
    ORDER BY v.plate
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;

CREATE OR REPLACE FUNCTION fn_vehicle_count_search(p_search VARCHAR)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM vehicles v
    INNER JOIN customers c ON c.id = v.customer_id
    WHERE NULLIF(TRIM(p_search), '') IS NULL
       OR UPPER(v.plate) LIKE '%' || UPPER(TRIM(p_search)) || '%'
       OR LOWER(v.brand) LIKE '%' || LOWER(TRIM(p_search)) || '%'
       OR LOWER(v.model) LIKE '%' || LOWER(TRIM(p_search)) || '%'
       OR LOWER(c.name) LIKE '%' || LOWER(TRIM(p_search)) || '%';
$$;

CREATE OR REPLACE FUNCTION fn_vehicle_search(p_search VARCHAR, p_page INT, p_page_size INT)
RETURNS TABLE (
    id BIGINT,
    customer_id BIGINT,
    customer_name VARCHAR,
    plate VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    year INT,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_page INT := GREATEST(COALESCE(p_page, 0), 0);
    v_size INT := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
BEGIN
    RETURN QUERY
    SELECT v.id, v.customer_id, c.name AS customer_name, v.plate, v.brand, v.model,
           v.year, v.active, v.created_at
    FROM vehicles v
    INNER JOIN customers c ON c.id = v.customer_id
    WHERE NULLIF(TRIM(p_search), '') IS NULL
       OR UPPER(v.plate) LIKE '%' || UPPER(TRIM(p_search)) || '%'
       OR LOWER(v.brand) LIKE '%' || LOWER(TRIM(p_search)) || '%'
       OR LOWER(v.model) LIKE '%' || LOWER(TRIM(p_search)) || '%'
       OR LOWER(c.name) LIKE '%' || LOWER(TRIM(p_search)) || '%'
    ORDER BY v.plate ASC
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;

CREATE OR REPLACE FUNCTION fn_vehicle_insert(
    p_customer_id BIGINT,
    p_plate VARCHAR,
    p_brand VARCHAR,
    p_model VARCHAR,
    p_year INT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
    v_plate VARCHAR := UPPER(REPLACE(TRIM(p_plate), '-', ''));
BEGIN
    INSERT INTO vehicles (customer_id, plate, brand, model, year)
    VALUES (p_customer_id, v_plate, TRIM(p_brand), TRIM(p_model), p_year)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_vehicle_update(
    p_id BIGINT,
    p_customer_id BIGINT,
    p_plate VARCHAR,
    p_brand VARCHAR,
    p_model VARCHAR,
    p_year INT,
    p_active BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE vehicles
    SET customer_id = p_customer_id,
        plate = UPPER(REPLACE(TRIM(p_plate), '-', '')),
        brand = TRIM(p_brand),
        model = TRIM(p_model),
        year = p_year,
        active = COALESCE(p_active, active)
    WHERE id = p_id;
END;
$$;
