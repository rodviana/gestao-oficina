-- Manual schema reset (run via psql when you need a clean database)
DROP FUNCTION IF EXISTS p_find_users_filtered(VARCHAR, VARCHAR, VARCHAR, VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS p_count_users_filtered(VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS p_create_user(VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS p_find_user_by_email(VARCHAR);
DROP TABLE IF EXISTS users CASCADE;
