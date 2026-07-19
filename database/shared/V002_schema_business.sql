-- =============================================================================
-- Tabelas de negócio do Gestão Oficina
-- Constraints nomeadas (pk_/uk_/fk_/chk_), índices e comentários de seção.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- Usuários do sistema (admin / atendente / mecânico)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT GENERATED ALWAYS AS IDENTITY,
    email      VARCHAR(150) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    name       VARCHAR(100) NOT NULL,
    role_id    SMALLINT     NOT NULL,
    active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES user_role (id)
);

CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role_id);

-- -----------------------------------------------------------------------------
-- Clientes da oficina (cadastro de balcão — sem credencial)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id         BIGINT GENERATED ALWAYS AS IDENTITY,
    name       VARCHAR(100) NOT NULL,
    document   VARCHAR(20),
    phone      VARCHAR(20)  NOT NULL,
    active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_customers PRIMARY KEY (id),
    CONSTRAINT chk_customers_name CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT chk_customers_phone CHECK (LENGTH(TRIM(phone)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers (phone);
CREATE INDEX IF NOT EXISTS idx_customers_name_lower ON customers (LOWER(name));

-- -----------------------------------------------------------------------------
-- Conta do portal do cliente (1:1 com customers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer_account (
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    customer_id BIGINT       NOT NULL,
    email       VARCHAR(150) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_customer_account PRIMARY KEY (id),
    CONSTRAINT uk_customer_account_customer UNIQUE (customer_id),
    CONSTRAINT uk_customer_account_email UNIQUE (email),
    CONSTRAINT fk_customer_account_customer FOREIGN KEY (customer_id)
        REFERENCES customers (id)
);

CREATE INDEX IF NOT EXISTS idx_customer_account_email_lower ON customer_account (LOWER(email));

-- -----------------------------------------------------------------------------
-- Veículos vinculados a clientes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    customer_id BIGINT      NOT NULL,
    plate       VARCHAR(10) NOT NULL,
    brand       VARCHAR(60) NOT NULL,
    model       VARCHAR(60) NOT NULL,
    year        INT,
    active      BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_vehicles PRIMARY KEY (id),
    CONSTRAINT uk_vehicles_plate UNIQUE (plate),
    CONSTRAINT fk_vehicles_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT chk_vehicles_plate CHECK (LENGTH(TRIM(plate)) >= 7),
    CONSTRAINT chk_vehicles_year CHECK (year IS NULL OR (year >= 1950 AND year <= 2100))
);

CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles (customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_upper ON vehicles (UPPER(plate));

-- -----------------------------------------------------------------------------
-- Catálogo de serviços (preço de referência)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_catalog (
    id            BIGINT GENERATED ALWAYS AS IDENTITY,
    name          VARCHAR(120)  NOT NULL,
    default_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    active        BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_service_catalog PRIMARY KEY (id),
    CONSTRAINT uk_service_catalog_name UNIQUE (name),
    CONSTRAINT chk_service_catalog_price CHECK (default_price >= 0)
);

-- -----------------------------------------------------------------------------
-- Catálogo de peças (sem preço — preço é lançado na OS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS part_catalog (
    id         BIGINT GENERATED ALWAYS AS IDENTITY,
    name       VARCHAR(120) NOT NULL,
    active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_part_catalog PRIMARY KEY (id),
    CONSTRAINT uk_part_catalog_name UNIQUE (name)
);

-- -----------------------------------------------------------------------------
-- Ordens de serviço
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_orders (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY,
    number             VARCHAR(20)  NOT NULL,
    customer_id        BIGINT       NOT NULL,
    vehicle_id         BIGINT       NOT NULL,
    description        TEXT         NOT NULL,
    status_id          SMALLINT     NOT NULL,
    payment_status_id  SMALLINT     NOT NULL,
    mechanic_id        BIGINT,
    created_by_id      BIGINT       NOT NULL,
    created_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_work_orders PRIMARY KEY (id),
    CONSTRAINT uk_work_orders_number UNIQUE (number),
    CONSTRAINT fk_wo_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_wo_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT fk_wo_status FOREIGN KEY (status_id) REFERENCES work_order_status (id),
    CONSTRAINT fk_wo_payment FOREIGN KEY (payment_status_id) REFERENCES payment_status (id),
    CONSTRAINT fk_wo_mechanic FOREIGN KEY (mechanic_id) REFERENCES users (id),
    CONSTRAINT fk_wo_created_by FOREIGN KEY (created_by_id) REFERENCES users (id),
    CONSTRAINT chk_wo_description CHECK (LENGTH(TRIM(description)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_wo_customer ON work_orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_wo_vehicle ON work_orders (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_wo_status ON work_orders (status_id);
CREATE INDEX IF NOT EXISTS idx_wo_payment ON work_orders (payment_status_id);
CREATE INDEX IF NOT EXISTS idx_wo_mechanic ON work_orders (mechanic_id);
CREATE INDEX IF NOT EXISTS idx_wo_created_by ON work_orders (created_by_id);
CREATE INDEX IF NOT EXISTS idx_wo_created_at ON work_orders (created_at);
CREATE INDEX IF NOT EXISTS idx_wo_number ON work_orders (number);

-- -----------------------------------------------------------------------------
-- Itens da OS (serviço ou peça)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_order_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY,
    work_order_id   BIGINT         NOT NULL,
    item_type_id    SMALLINT       NOT NULL,
    service_id      BIGINT,
    part_id         BIGINT,
    description     VARCHAR(200)   NOT NULL,
    quantity        NUMERIC(12,3)  NOT NULL DEFAULT 1,
    unit_price      NUMERIC(12,2)  NOT NULL DEFAULT 0,
    created_at      TIMESTAMP      NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_work_order_items PRIMARY KEY (id),
    CONSTRAINT fk_woi_order FOREIGN KEY (work_order_id) REFERENCES work_orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_woi_type FOREIGN KEY (item_type_id) REFERENCES work_order_item_type (id),
    CONSTRAINT fk_woi_service FOREIGN KEY (service_id) REFERENCES service_catalog (id),
    CONSTRAINT fk_woi_part FOREIGN KEY (part_id) REFERENCES part_catalog (id),
    CONSTRAINT chk_woi_quantity CHECK (quantity > 0),
    CONSTRAINT chk_woi_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_woi_description CHECK (LENGTH(TRIM(description)) > 0),
    -- Um item referencia catálogo de serviço OU de peça, nunca os dois.
    CONSTRAINT chk_woi_single_ref CHECK (service_id IS NULL OR part_id IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_woi_order ON work_order_items (work_order_id);
CREATE INDEX IF NOT EXISTS idx_woi_type ON work_order_items (item_type_id);
CREATE INDEX IF NOT EXISTS idx_woi_service ON work_order_items (service_id);
CREATE INDEX IF NOT EXISTS idx_woi_part ON work_order_items (part_id);

-- -----------------------------------------------------------------------------
-- Histórico de mudanças de status da OS (timeline)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_order_status_history (
    id            BIGINT GENERATED ALWAYS AS IDENTITY,
    work_order_id BIGINT      NOT NULL,
    status_id     SMALLINT    NOT NULL,
    note          TEXT,
    changed_by_id BIGINT,
    changed_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_work_order_status_history PRIMARY KEY (id),
    CONSTRAINT fk_wosh_order FOREIGN KEY (work_order_id) REFERENCES work_orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_wosh_status FOREIGN KEY (status_id) REFERENCES work_order_status (id),
    CONSTRAINT fk_wosh_user FOREIGN KEY (changed_by_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_wosh_order ON work_order_status_history (work_order_id);
CREATE INDEX IF NOT EXISTS idx_wosh_status ON work_order_status_history (status_id);
CREATE INDEX IF NOT EXISTS idx_wosh_changed_by ON work_order_status_history (changed_by_id);
CREATE INDEX IF NOT EXISTS idx_wosh_changed_at ON work_order_status_history (changed_at);
