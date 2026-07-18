-- =============================================================================
-- Funções de catálogos de serviços e peças (admin)
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_service_catalog_list(p_only_active BOOLEAN)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    default_price NUMERIC,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT s.id, s.name, s.default_price, s.active, s.created_at
    FROM service_catalog s
    WHERE COALESCE(p_only_active, FALSE) = FALSE OR s.active = TRUE
    ORDER BY s.name;
$$;

CREATE OR REPLACE FUNCTION fn_service_catalog_find_by_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    default_price NUMERIC,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT s.id, s.name, s.default_price, s.active, s.created_at
    FROM service_catalog s
    WHERE s.id = p_id;
$$;

CREATE OR REPLACE FUNCTION fn_service_catalog_insert(
    p_name VARCHAR,
    p_default_price NUMERIC,
    p_active BOOLEAN
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
BEGIN
    INSERT INTO service_catalog (name, default_price, active)
    VALUES (TRIM(p_name), COALESCE(p_default_price, 0), COALESCE(p_active, TRUE))
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_service_catalog_update(
    p_id BIGINT,
    p_name VARCHAR,
    p_default_price NUMERIC,
    p_active BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE service_catalog
    SET name = TRIM(p_name),
        default_price = COALESCE(p_default_price, default_price),
        active = COALESCE(p_active, active)
    WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_part_catalog_list(p_only_active BOOLEAN)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT p.id, p.name, p.active, p.created_at
    FROM part_catalog p
    WHERE COALESCE(p_only_active, FALSE) = FALSE OR p.active = TRUE
    ORDER BY p.name;
$$;

CREATE OR REPLACE FUNCTION fn_part_catalog_find_by_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
    SELECT p.id, p.name, p.active, p.created_at
    FROM part_catalog p
    WHERE p.id = p_id;
$$;

CREATE OR REPLACE FUNCTION fn_part_catalog_insert(p_name VARCHAR, p_active BOOLEAN)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
BEGIN
    INSERT INTO part_catalog (name, active)
    VALUES (TRIM(p_name), COALESCE(p_active, TRUE))
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_part_catalog_update(
    p_id BIGINT,
    p_name VARCHAR,
    p_active BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE part_catalog
    SET name = TRIM(p_name),
        active = COALESCE(p_active, active)
    WHERE id = p_id;
END;
$$;
