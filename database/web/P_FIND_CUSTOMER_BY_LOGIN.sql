-- Finds an active customer by email (case-insensitive) or phone.
-- Phone match compares the last 8 digits so it works with or without area code.
CREATE OR REPLACE FUNCTION p_find_customer_by_login(p_login VARCHAR)
RETURNS TABLE (
    id       BIGINT,
    name     VARCHAR,
    email    VARCHAR,
    phone    VARCHAR,
    password VARCHAR,
    active   BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_digits VARCHAR := regexp_replace(COALESCE(p_login, ''), '\D', '', 'g');
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.email, c.phone, c.password, c.active
    FROM customers c
    WHERE c.active = TRUE
      AND (
          LOWER(c.email) = LOWER(TRIM(p_login))
          OR (
              LENGTH(v_digits) >= 8
              AND RIGHT(regexp_replace(c.phone, '\D', '', 'g'), 8) = RIGHT(v_digits, 8)
          )
      );
END;
$$;
