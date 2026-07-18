-- Paginated user list with filters
CREATE OR REPLACE FUNCTION p_find_users_filtered(
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
    SELECT u.id, u.email, u.name, u.role, u.active, u.created_at
    FROM users u
    WHERE (p_role IS NULL OR TRIM(p_role) = '' OR UPPER(TRIM(p_role)) = 'ALL' OR u.role = UPPER(TRIM(p_role)))
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
