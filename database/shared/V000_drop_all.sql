-- =============================================================================
-- Reset completo do schema Gestão Oficina (shared + objetos admin/web)
-- Use apenas em ambiente de desenvolvimento.
-- =============================================================================

-- Funções admin (users)
DROP FUNCTION IF EXISTS fn_user_find_by_email(VARCHAR);
DROP FUNCTION IF EXISTS fn_user_create(VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS fn_user_count_filtered(VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS fn_user_find_filtered(VARCHAR, VARCHAR, VARCHAR, VARCHAR, INT, INT);

-- Funções admin (customers / vehicles / catalogs / OS)
DROP FUNCTION IF EXISTS fn_customer_find_by_id(BIGINT);
DROP FUNCTION IF EXISTS fn_customer_search(VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS fn_customer_count_search(VARCHAR);
DROP FUNCTION IF EXISTS fn_customer_insert(VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS fn_customer_update(BIGINT, VARCHAR, VARCHAR, VARCHAR, BOOLEAN);
DROP FUNCTION IF EXISTS fn_customer_find_by_phone(VARCHAR);
-- vehicle_count foi adicionado ao retorno; DROP acima garante recriação limpa

DROP FUNCTION IF EXISTS fn_vehicle_find_by_id(BIGINT);
DROP FUNCTION IF EXISTS fn_vehicle_find_by_plate(VARCHAR);
DROP FUNCTION IF EXISTS fn_vehicle_find_by_customer(BIGINT);
DROP FUNCTION IF EXISTS fn_vehicle_find_by_customer(BIGINT, INT, INT);
DROP FUNCTION IF EXISTS fn_vehicle_count_by_customer(BIGINT);
DROP FUNCTION IF EXISTS fn_vehicle_search(VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS fn_vehicle_count_search(VARCHAR);
DROP FUNCTION IF EXISTS fn_vehicle_insert(BIGINT, VARCHAR, VARCHAR, VARCHAR, INT);
DROP FUNCTION IF EXISTS fn_vehicle_update(BIGINT, BIGINT, VARCHAR, VARCHAR, VARCHAR, INT, BOOLEAN);

DROP FUNCTION IF EXISTS fn_service_catalog_list(BOOLEAN);
DROP FUNCTION IF EXISTS fn_service_catalog_list(BOOLEAN, VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS fn_service_catalog_count(BOOLEAN, VARCHAR);
DROP FUNCTION IF EXISTS fn_service_catalog_find_by_id(BIGINT);
DROP FUNCTION IF EXISTS fn_service_catalog_insert(VARCHAR, NUMERIC, BOOLEAN);
DROP FUNCTION IF EXISTS fn_service_catalog_update(BIGINT, VARCHAR, NUMERIC, BOOLEAN);

DROP FUNCTION IF EXISTS fn_part_catalog_list(BOOLEAN);
DROP FUNCTION IF EXISTS fn_part_catalog_list(BOOLEAN, VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS fn_part_catalog_count(BOOLEAN, VARCHAR);
DROP FUNCTION IF EXISTS fn_part_catalog_find_by_id(BIGINT);
DROP FUNCTION IF EXISTS fn_part_catalog_insert(VARCHAR, BOOLEAN);
DROP FUNCTION IF EXISTS fn_part_catalog_update(BIGINT, VARCHAR, BOOLEAN);

DROP FUNCTION IF EXISTS fn_work_order_total(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_find_by_id(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_list(VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS fn_work_order_list(VARCHAR, VARCHAR, VARCHAR, BIGINT, INT, INT);
DROP FUNCTION IF EXISTS fn_work_order_count(VARCHAR);
DROP FUNCTION IF EXISTS fn_work_order_count(VARCHAR, VARCHAR, VARCHAR, BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_insert(BIGINT, BIGINT, TEXT, BIGINT, BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_update_status(BIGINT, VARCHAR, BIGINT, TEXT);
DROP FUNCTION IF EXISTS fn_work_order_update_payment(BIGINT, VARCHAR);
DROP FUNCTION IF EXISTS fn_work_order_assign_mechanic(BIGINT, BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_items_by_order(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_item_insert(BIGINT, VARCHAR, BIGINT, BIGINT, VARCHAR, NUMERIC, NUMERIC);
DROP FUNCTION IF EXISTS fn_work_order_item_update(BIGINT, NUMERIC, NUMERIC, VARCHAR);
DROP FUNCTION IF EXISTS fn_work_order_item_delete(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_history(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_by_vehicle(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_by_vehicle(BIGINT, INT, INT);
DROP FUNCTION IF EXISTS fn_work_order_count_by_vehicle(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_panorama();
DROP FUNCTION IF EXISTS fn_quick_search(VARCHAR);
DROP FUNCTION IF EXISTS fn_quick_search(VARCHAR, INT, INT);
DROP FUNCTION IF EXISTS fn_quick_search_count(VARCHAR);

-- Funções web (portal)
DROP FUNCTION IF EXISTS fn_customer_account_find_by_login(VARCHAR);
DROP FUNCTION IF EXISTS fn_customer_me_orders(BIGINT);
DROP FUNCTION IF EXISTS fn_customer_me_orders(BIGINT, VARCHAR, BIGINT, INT, INT);
DROP FUNCTION IF EXISTS fn_customer_me_orders_count(BIGINT, VARCHAR, BIGINT);
DROP FUNCTION IF EXISTS fn_customer_me_vehicles(BIGINT);
DROP FUNCTION IF EXISTS fn_customer_me_vehicles(BIGINT, INT, INT);
DROP FUNCTION IF EXISTS fn_customer_me_vehicles_count(BIGINT);
DROP FUNCTION IF EXISTS fn_customer_me_summary(BIGINT);
DROP FUNCTION IF EXISTS fn_work_order_track(VARCHAR, VARCHAR);

-- Tabelas de negócio (ordem: filhos → pais)
DROP TABLE IF EXISTS work_order_status_history CASCADE;
DROP TABLE IF EXISTS work_order_items CASCADE;
DROP TABLE IF EXISTS work_orders CASCADE;
DROP TABLE IF EXISTS part_catalog CASCADE;
DROP TABLE IF EXISTS service_catalog CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS customer_account CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabelas de domínio
DROP TABLE IF EXISTS work_order_item_type CASCADE;
DROP TABLE IF EXISTS payment_status CASCADE;
DROP TABLE IF EXISTS work_order_status CASCADE;
DROP TABLE IF EXISTS user_role CASCADE;
