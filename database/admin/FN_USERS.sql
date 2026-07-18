-- =============================================================================
-- Funções de usuários do sistema (admin)
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_user_find_by_email(p_email VARCHAR)
RETURNS TABLE (
    id       BIGINT,
    email    VARCHAR,
    password VARCHAR,
    name     VARCHAR,
    role     VARCHAR,
    active   BOOLEAN
)
LANGUAGE sql
STABLE
AS $$
    SELECT u.id, u.email, u.password, u.name, r.code AS role, u.active
    FROM users u
    INNER JOIN user_role r ON r.id = u.role_id
    WHERE LOWER(u.email) = LOWER(TRIM(p_email))
      AND u.active = TRUE;
$$;

CREATE OR REPLACE FUNCTION fn_user_create(
    p_email VARCHAR,
    p_password VARCHAR,
    p_name VARCHAR,
    p_role_code VARCHAR
)
RETURNS TABLE (
    user_id BIGINT,
    error_code INT,
    error_message VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
    v_role_id SMALLINT;
BEGIN
    IF p_email IS NULL OR TRIM(p_email) = '' THEN
        RETURN QUERY SELECT NULL::BIGINT, 3, 'Email is required.'::VARCHAR;
        RETURN;
    END IF;

    IF EXISTS (SELECT 1 FROM users WHERE LOWER(email) = LOWER(TRIM(p_email))) THEN
        RETURN QUERY SELECT NULL::BIGINT, 1, 'Email already registered.'::VARCHAR;
        RETURN;
    END IF;

    SELECT id INTO v_role_id FROM user_role WHERE code = UPPER(TRIM(p_role_code));
    IF v_role_id IS NULL THEN
        RETURN QUERY SELECT NULL::BIGINT, 2, 'Invalid role.'::VARCHAR;
        RETURN;
    END IF;

    INSERT INTO users (email, password, name, role_id)
    VALUES (LOWER(TRIM(p_email)), p_password, TRIM(p_name), v_role_id)
    RETURNING id INTO v_id;

    RETURN QUERY SELECT v_id, 0, NULL::VARCHAR;
END;
$$;

CREATE OR REPLACE FUNCTION fn_user_count_filtered(
    p_role VARCHAR,
    p_active_filter VARCHAR,
    p_search_field VARCHAR,
    p_search_text VARCHAR
)
RETURNS BIGINT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_search TEXT;
BEGIN
    v_search := NULLIF(TRIM(p_search_text), '');

    RETURN (
        SELECT COUNT(*)
        FROM users u
        INNER JOIN user_role r ON r.id = u.role_id
        WHERE (p_role IS NULL OR TRIM(p_role) = '' OR UPPER(TRIM(p_role)) = 'ALL' OR r.code = UPPER(TRIM(p_role)))
          AND (
              p_active_filter IS NULL
              OR TRIM(p_active_filter) = ''
              OR UPPER(TRIM(p_active_filter)) = 'ALL'
              OR (UPPER(TRIM(p_active_filter)) = 'ACTIVE' AND u.active = TRUE)
              OR (UPPER(TRIM(p_active_filter)) = 'INACTIVE' AND u.active = FALSE)
          )
          AND (
              v_search IS NULL
              OR (
                  UPPER(COALESCE(TRIM(p_search_field), 'NAME')) = 'EMAIL'
                  AND LOWER(u.email) LIKE '%' || LOWER(v_search) || '%'
              )
              OR (
                  UPPER(COALESCE(TRIM(p_search_field), 'NAME')) <> 'EMAIL'
                  AND LOWER(u.name) LIKE '%' || LOWER(v_search) || '%'
              )
          )
    );
END;
$$;

CREATE OR REPLACE FUNCTION fn_user_find_filtered(
    p_role VARCHAR,
    p_active_filter VARCHAR,
    p_search_field VARCHAR,
    p_search_text VARCHAR,
    p_page INT,
    p_page_size INT
)
RETURNS TABLE (
    id BIGINT,
    email VARCHAR,
    name VARCHAR,
    role VARCHAR,
    active BOOLEAN,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_search TEXT;
    v_page INT;
    v_page_size INT;
    v_offset INT;
BEGIN
    v_search := NULLIF(TRIM(p_search_text), '');
    v_page := GREATEST(COALESCE(p_page, 0), 0);
    v_page_size := COALESCE(p_page_size, 20);
    IF v_page_size < 1 THEN
        v_page_size := 1;
    ELSIF v_page_size > 100 THEN
        v_page_size := 100;
    END IF;
    v_offset := v_page * v_page_size;

    RETURN QUERY
    SELECT u.id, u.email, u.name, r.code AS role, u.active, u.created_at
    FROM users u
    INNER JOIN user_role r ON r.id = u.role_id
    WHERE (p_role IS NULL OR TRIM(p_role) = '' OR UPPER(TRIM(p_role)) = 'ALL' OR r.code = UPPER(TRIM(p_role)))
      AND (
          p_active_filter IS NULL
          OR TRIM(p_active_filter) = ''
          OR UPPER(TRIM(p_active_filter)) = 'ALL'
          OR (UPPER(TRIM(p_active_filter)) = 'ACTIVE' AND u.active = TRUE)
          OR (UPPER(TRIM(p_active_filter)) = 'INACTIVE' AND u.active = FALSE)
      )
      AND (
          v_search IS NULL
          OR (
              UPPER(COALESCE(TRIM(p_search_field), 'NAME')) = 'EMAIL'
              AND LOWER(u.email) LIKE '%' || LOWER(v_search) || '%'
          )
          OR (
              UPPER(COALESCE(TRIM(p_search_field), 'NAME')) <> 'EMAIL'
              AND LOWER(u.name) LIKE '%' || LOWER(v_search) || '%'
          )
      )
    ORDER BY u.name ASC, u.id ASC
    OFFSET v_offset
    LIMIT v_page_size;
END;
$$;
