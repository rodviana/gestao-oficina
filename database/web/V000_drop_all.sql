-- Manual schema reset (run via psql when you need a clean database)
DROP FUNCTION IF EXISTS p_find_customer_by_login(VARCHAR);
DROP TABLE IF EXISTS customers CASCADE;
