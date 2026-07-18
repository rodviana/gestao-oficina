-- =============================================================================
-- Tabelas de domínio (enums relacionais)
-- PK surrogate SMALLINT + code único. FKs de negócio apontam para o id.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Perfis de usuário do sistema (admin / balcão / oficina)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_role (
    id            SMALLINT GENERATED ALWAYS AS IDENTITY,
    code          VARCHAR(20)  NOT NULL,
    label         VARCHAR(40)  NOT NULL,
    display_order SMALLINT     NOT NULL DEFAULT 0,
    CONSTRAINT pk_user_role PRIMARY KEY (id),
    CONSTRAINT uk_user_role_code UNIQUE (code)
);

-- -----------------------------------------------------------------------------
-- Situações da ordem de serviço
-- is_active_stage = true → entra no panorama de OS em andamento (RF-14)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_order_status (
    id              SMALLINT GENERATED ALWAYS AS IDENTITY,
    code            VARCHAR(20)  NOT NULL,
    label           VARCHAR(40)  NOT NULL,
    is_active_stage BOOLEAN      NOT NULL DEFAULT TRUE,
    display_order   SMALLINT     NOT NULL DEFAULT 0,
    CONSTRAINT pk_work_order_status PRIMARY KEY (id),
    CONSTRAINT uk_work_order_status_code UNIQUE (code)
);

-- -----------------------------------------------------------------------------
-- Situação de pagamento da OS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_status (
    id            SMALLINT GENERATED ALWAYS AS IDENTITY,
    code          VARCHAR(20)  NOT NULL,
    label         VARCHAR(40)  NOT NULL,
    display_order SMALLINT     NOT NULL DEFAULT 0,
    CONSTRAINT pk_payment_status PRIMARY KEY (id),
    CONSTRAINT uk_payment_status_code UNIQUE (code)
);

-- -----------------------------------------------------------------------------
-- Tipo de item lançado na OS (serviço ou peça)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_order_item_type (
    id            SMALLINT GENERATED ALWAYS AS IDENTITY,
    code          VARCHAR(20)  NOT NULL,
    label         VARCHAR(40)  NOT NULL,
    display_order SMALLINT     NOT NULL DEFAULT 0,
    CONSTRAINT pk_work_order_item_type PRIMARY KEY (id),
    CONSTRAINT uk_work_order_item_type_code UNIQUE (code)
);

-- -----------------------------------------------------------------------------
-- Seed idempotente dos domínios
-- -----------------------------------------------------------------------------
INSERT INTO user_role (code, label, display_order)
SELECT 'ADMIN', 'Administrador', 1
WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE code = 'ADMIN');

INSERT INTO user_role (code, label, display_order)
SELECT 'ATTENDANT', 'Atendente', 2
WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE code = 'ATTENDANT');

INSERT INTO user_role (code, label, display_order)
SELECT 'MECHANIC', 'Mecânico', 3
WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE code = 'MECHANIC');

INSERT INTO work_order_status (code, label, is_active_stage, display_order)
SELECT 'OPEN', 'Aberta', TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM work_order_status WHERE code = 'OPEN');

INSERT INTO work_order_status (code, label, is_active_stage, display_order)
SELECT 'IN_PROGRESS', 'Em andamento', TRUE, 2
WHERE NOT EXISTS (SELECT 1 FROM work_order_status WHERE code = 'IN_PROGRESS');

INSERT INTO work_order_status (code, label, is_active_stage, display_order)
SELECT 'WAITING_PARTS', 'Aguardando peça', TRUE, 3
WHERE NOT EXISTS (SELECT 1 FROM work_order_status WHERE code = 'WAITING_PARTS');

INSERT INTO work_order_status (code, label, is_active_stage, display_order)
SELECT 'READY', 'Pronta', TRUE, 4
WHERE NOT EXISTS (SELECT 1 FROM work_order_status WHERE code = 'READY');

INSERT INTO work_order_status (code, label, is_active_stage, display_order)
SELECT 'DELIVERED', 'Entregue', FALSE, 5
WHERE NOT EXISTS (SELECT 1 FROM work_order_status WHERE code = 'DELIVERED');

INSERT INTO work_order_status (code, label, is_active_stage, display_order)
SELECT 'CANCELLED', 'Cancelada', FALSE, 6
WHERE NOT EXISTS (SELECT 1 FROM work_order_status WHERE code = 'CANCELLED');

INSERT INTO payment_status (code, label, display_order)
SELECT 'UNPAID', 'Não pago', 1
WHERE NOT EXISTS (SELECT 1 FROM payment_status WHERE code = 'UNPAID');

INSERT INTO payment_status (code, label, display_order)
SELECT 'WAITING_PAYMENT', 'Aguardando pagamento', 2
WHERE NOT EXISTS (SELECT 1 FROM payment_status WHERE code = 'WAITING_PAYMENT');

INSERT INTO payment_status (code, label, display_order)
SELECT 'PAID', 'Pago', 3
WHERE NOT EXISTS (SELECT 1 FROM payment_status WHERE code = 'PAID');

INSERT INTO work_order_item_type (code, label, display_order)
SELECT 'SERVICE', 'Serviço', 1
WHERE NOT EXISTS (SELECT 1 FROM work_order_item_type WHERE code = 'SERVICE');

INSERT INTO work_order_item_type (code, label, display_order)
SELECT 'PART', 'Peça', 2
WHERE NOT EXISTS (SELECT 1 FROM work_order_item_type WHERE code = 'PART');
