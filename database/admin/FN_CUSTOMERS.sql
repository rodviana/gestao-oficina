-- =============================================================================
-- Funções de clientes (admin)
-- =============================================================================

DROP FUNCTION IF EXISTS fn_customer_find_by_id(BIGINT);
DROP FUNCTION IF EXISTS fn_customer_search(VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS fn_customer_find_by_phone(VARCHAR);
DROP FUNCTION IF EXISTS fn_customer_insert(VARCHAR, VARCHAR, VARCHAR);

CREATE OR REPLACE FUNCTION fn_customer_find_by_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    document VARCHAR,
    phone VARCHAR,
    active BOOLEAN,
    created_at TIMESTAMP,
    has_account BOOLEAN,
    vehicle_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT c.id, c.name, c.document, c.phone, c.active, c.created_at,
           EXISTS (SELECT 1 FROM customer_account a WHERE a.customer_id = c.id) AS has_account,
           (SELECT COUNT(*) FROM vehicles v WHERE v.customer_id = c.id) AS vehicle_count
    FROM customers c
    WHERE c.id = p_id;
$$;

CREATE OR REPLACE FUNCTION fn_customer_count_search(p_search VARCHAR)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM customers c
    WHERE NULLIF(TRIM(p_search), '') IS NULL
       OR LOWER(c.name) LIKE '%' || LOWER(TRIM(p_search)) || '%'
       OR c.phone LIKE '%' || regexp_replace(TRIM(p_search), '\D', '', 'g') || '%'
       OR COALESCE(c.document, '') LIKE '%' || TRIM(p_search) || '%';
$$;

CREATE OR REPLACE FUNCTION fn_customer_search(p_search VARCHAR, p_page INT, p_page_size INT)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    document VARCHAR,
    phone VARCHAR,
    active BOOLEAN,
    created_at TIMESTAMP,
    has_account BOOLEAN,
    vehicle_count BIGINT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_page INT := GREATEST(COALESCE(p_page, 0), 0);
    v_size INT := LEAST(GREATEST(COALESCE(p_page_size, 20), 1), 100);
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.document, c.phone, c.active, c.created_at,
           EXISTS (SELECT 1 FROM customer_account a WHERE a.customer_id = c.id) AS has_account,
           (SELECT COUNT(*) FROM vehicles v WHERE v.customer_id = c.id) AS vehicle_count
    FROM customers c
    WHERE NULLIF(TRIM(p_search), '') IS NULL
       OR LOWER(c.name) LIKE '%' || LOWER(TRIM(p_search)) || '%'
       OR c.phone LIKE '%' || regexp_replace(TRIM(p_search), '\D', '', 'g') || '%'
       OR COALESCE(c.document, '') LIKE '%' || TRIM(p_search) || '%'
    ORDER BY c.name ASC, c.id ASC
    OFFSET v_page * v_size
    LIMIT v_size;
END;
$$;

CREATE OR REPLACE FUNCTION fn_customer_find_by_phone(p_phone VARCHAR)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR,
    document VARCHAR,
    phone VARCHAR,
    active BOOLEAN,
    created_at TIMESTAMP,
    has_account BOOLEAN,
    vehicle_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT c.id, c.name, c.document, c.phone, c.active, c.created_at,
           EXISTS (SELECT 1 FROM customer_account a WHERE a.customer_id = c.id) AS has_account,
           (SELECT COUNT(*) FROM vehicles v WHERE v.customer_id = c.id) AS vehicle_count
    FROM customers c
    WHERE c.active = TRUE
      AND RIGHT(regexp_replace(c.phone, '\D', '', 'g'), 8)
          = RIGHT(regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g'), 8)
      AND LENGTH(regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g')) >= 8;
$$;

-- Cria o cliente e a conta do portal (customer_account) na mesma transação.
CREATE OR REPLACE FUNCTION fn_customer_insert(
    p_name VARCHAR,
    p_document VARCHAR,
    p_phone VARCHAR,
    p_email VARCHAR,
    p_password_hash VARCHAR
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
BEGIN
    IF EXISTS (SELECT 1 FROM customer_account a WHERE LOWER(a.email) = LOWER(TRIM(p_email))) THEN
        RAISE EXCEPTION 'E-mail já cadastrado para outro cliente.';
    END IF;

    INSERT INTO customers (name, document, phone)
    VALUES (TRIM(p_name), NULLIF(TRIM(p_document), ''), TRIM(p_phone))
    RETURNING id INTO v_id;

    INSERT INTO customer_account (customer_id, email, password)
    VALUES (v_id, LOWER(TRIM(p_email)), p_password_hash);

    RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_customer_update(
    p_id BIGINT,
    p_name VARCHAR,
    p_document VARCHAR,
    p_phone VARCHAR,
    p_active BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE customers
    SET name = TRIM(p_name),
        document = NULLIF(TRIM(p_document), ''),
        phone = TRIM(p_phone),
        active = COALESCE(p_active, active)
    WHERE id = p_id;
END;
$$;
