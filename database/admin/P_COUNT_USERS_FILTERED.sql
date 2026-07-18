-- Count users matching filters
CREATE OR REPLACE FUNCTION p_count_users_filtered(
    p_role VARCHAR,
    p_active_filter VARCHAR,
    p_search_field VARCHAR,
    p_search_text VARCHAR
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_search TEXT;
BEGIN
    v_search := NULLIF(TRIM(p_search_text), '');

    RETURN (
        SELECT COUNT(*)
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
    );
END;
$$;
