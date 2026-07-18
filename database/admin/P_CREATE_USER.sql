CREATE OR REPLACE FUNCTION p_create_user(
    p_email VARCHAR,
    p_password VARCHAR,
    p_name VARCHAR,
    p_role VARCHAR
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
BEGIN
    IF p_email IS NULL OR TRIM(p_email) = '' THEN
        RETURN QUERY SELECT NULL::BIGINT, 3, 'Email is required.'::VARCHAR;
        RETURN;
    END IF;

    IF EXISTS (SELECT 1 FROM users WHERE LOWER(email) = LOWER(TRIM(p_email))) THEN
        RETURN QUERY SELECT NULL::BIGINT, 1, 'Email already registered.'::VARCHAR;
        RETURN;
    END IF;

    IF p_role NOT IN ('ADMIN', 'ATTENDANT', 'MECHANIC') THEN
        RETURN QUERY SELECT NULL::BIGINT, 2, 'Invalid role.'::VARCHAR;
        RETURN;
    END IF;

    INSERT INTO users (email, password, name, role)
    VALUES (LOWER(TRIM(p_email)), p_password, TRIM(p_name), p_role)
    RETURNING id INTO v_id;

    RETURN QUERY SELECT v_id, 0, NULL::VARCHAR;
END;
$$;
