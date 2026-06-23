CREATE OR REPLACE FUNCTION p_find_user_by_email(p_email VARCHAR)
RETURNS TABLE (
    id       BIGINT,
    email    VARCHAR,
    password VARCHAR,
    name     VARCHAR,
    role     VARCHAR,
    active   BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.password, u.name, u.role, u.active
    FROM users u
    WHERE LOWER(u.email) = LOWER(TRIM(p_email))
      AND u.active = TRUE;
END;
$$;
