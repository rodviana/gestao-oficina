# Como o código está organizado

Este doc explica **como o Gestão Oficina funciona por dentro**. Padrão alinhado ao projeto de referência **ecommerce**: Controller → Service → Repository (JDBC nativo via `fn_*`) + SQL comentado com constraints nomeadas.

**Combinado do projeto:**

- Código (classes, tabelas, JSON): **inglês**
- Telas e mensagens de erro pro usuário: **português**

---

## Visão geral — o caminho de uma requisição

```
React (tela)
    → Controller (recebe HTTP)
        → Service (regras + validação)
            → Repository (interface + jdbc/*)
                → PostgreSQL (tabelas + funções fn_*)
```

Cada camada faz **uma coisa só**. Controller não valida regra de negócio; service não monta SQL na mão; repository não decide se o usuário é admin.

Há **dois servers** independentes compartilhando o mesmo banco:

| Server | Porta | Quem usa |
|--------|-------|----------|
| `server-admin` | 8080 | Sistema interno (staff) |
| `server-web` | 8081 | Portal do cliente |

---

## Estrutura Java (padrão ecommerce)

```
com.gestaooficina/
├── controller/              # REST + BaseController
├── service/                 # Regras de negócio
├── model/
│   ├── dto/                 # Request / Detail / List / HttpResponseEntityDTO
│   ├── enums/               # Constantes tipadas (quando fizer sentido)
│   ├── record/              # Linha interna do banco (ex.: UserRecord)
│   ├── request/             # DTOs legados de auth/users (RF-01–03)
│   └── response/            # DTOs legados de auth/users (RF-01–03)
├── repository/              # Interfaces
│   └── jdbc/                # Implementações JDBC
│       └── core/
│           └── JdbcProcedureExecutor.java
├── exception/               # GestaoOficinaGenericException / ForbiddenException
├── config/
├── security/                # JWT, AuthenticatedUser
└── utils/
```

| Pasta | Responsabilidade |
|-------|------------------|
| `controller/` | Endpoints; `try/catch` → `ok` / `genericError` / `forbidden` / `internalError` |
| `service/` | Validação, autorização, orquestração |
| `model/dto/` | Contrato JSON (preferido para código novo) |
| `repository/` | Interface da entidade |
| `repository/jdbc/` | SQL em constantes + `JdbcProcedureExecutor` (params posicionais `?`) |
| `exception/` | Mensagens em string (PT) — sem enum central obrigatório |

Rotas centralizadas em `GestaoOficinaControllerMapping` (admin) e `GestaoOficinaWebControllerMapping` (web).

---

## Controller

Estende `BaseController` e usa o envelope `HttpResponseEntityDTO`:

```java
@GetMapping("/{id}")
public ResponseEntity<HttpResponseEntityDTO<?>> getById(@PathVariable Long id) {
    try {
        return ok(customerService.getById(id));
    } catch (GestaoOficinaGenericException e) {
        return genericError(e);
    } catch (Exception e) {
        return internalError(e);
    }
}
```

---

## Service

- Valida entrada e lança `GestaoOficinaGenericException("mensagem em português")`
- Autoriza (`GestaoOficinaForbiddenException` quando for 403)
- Chama o repository e monta DTOs

---

## Repository (native query)

```java
private static final String SQL_FIND = "SELECT * FROM fn_customer_find_by_id(?)";

public Optional<CustomerDTO> findById(Long id) {
    return executor.queryOptional(SQL_FIND, rowMapper(), id);
}
```

`JdbcProcedureExecutor` encapsula `JdbcTemplate`: `query`, `queryOptional`, `queryScalar`, `execute`.

---

## Banco de dados

Scripts em `database/`, aplicados por `database/create-database.sh` na ordem **shared → admin → web**:

```
database/
├── create-database.sh
├── init/01-migrate.sh          # Docker entrypoint → chama create-database.sh
├── shared/
│   ├── V000_drop_all.sql       # reset manual
│   ├── V001_schema_domain.sql  # tabelas de domínio (enums)
│   ├── V002_schema_business.sql
│   ├── V003_seed_staff.sql
│   └── V004_seed_mvp.sql       # clientes, catálogos, ~480 OS / 24 meses
├── admin/                      # fn_* do server-admin
│   ├── FN_USERS.sql
│   ├── FN_CUSTOMERS.sql
│   ├── FN_VEHICLES.sql
│   ├── FN_CATALOGS.sql
│   └── FN_WORK_ORDERS.sql
└── web/
    └── FN_PORTAL.sql           # fn_* do portal
```

### Tabelas de domínio (sem VARCHAR solto)

| Tabela | Códigos |
|--------|---------|
| `user_role` | ADMIN, ATTENDANT, MECHANIC |
| `work_order_status` | OPEN, IN_PROGRESS, WAITING_PARTS, READY, DELIVERED, CANCELLED |
| `payment_status` | UNPAID, WAITING_PAYMENT, PAID |
| `work_order_item_type` | SERVICE, PART |

Formato: `id SMALLINT GENERATED ALWAYS AS IDENTITY` + `code` único + `label` + `display_order`. FKs guardam o **id**; as `fn_*` fazem join e devolvem `code`/`label`.

### Tabelas de negócio

- `users` (`role_id` → `user_role`)
- `customers` (cadastro de balcão)
- `customer_account` (login do portal, 1:1 com customer)
- `vehicles` (placa única)
- `service_catalog` / `part_catalog`
- `work_orders` / `work_order_items` / `work_order_status_history`

Constraints nomeadas (`pk_`, `uk_`, `fk_`, `chk_`). Total da OS é **derivado** (`fn_work_order_total`), não armazenado.

---

## Erros e mensagens

```
Service lança GestaoOficinaGenericException("…")
    → Controller devolve JSON { success:false, message }
        → apiClient.js → Toast
```

- 400 → `GestaoOficinaGenericException`
- 403 → `GestaoOficinaForbiddenException`
- 500 → `internalError` (mensagem genérica; detalhe no log)

---

## Front (React)

```
gestao-oficina-admin-web/src/
├── pages/
├── components/
├── services/     # apiClient + customerService, workOrderService…
├── constants/    # labels de status/pagamento/tipo
├── hooks/
└── utils/

gestao-oficina-web/src/
├── features/     # auth, account, tracking
└── data/         # api.js, auth.js, tracking.js, labels.js, demo.js
```

Sem mocks: ambos os fronts consomem as APIs reais.

---

## Checklist — feature nova

- [ ] Tabela/domínio com constraints nomeadas em `database/shared/`
- [ ] Função `fn_*` em `database/admin/` ou `database/web/`
- [ ] Entrada no `create-database.sh`
- [ ] `repository/` + `repository/jdbc/`
- [ ] `service/` + `controller/`
- [ ] Rota no `*ControllerMapping`
- [ ] DTO em `model/dto/`
- [ ] Service HTTP no front correspondente
- [ ] RF atualizado em [requirements.md](./requirements.md)

---

## Onde olhar no código

| O quê | Caminho |
|-------|---------|
| Login staff | `LoginController` → `LoginService` → `AuthJdbcRepository` |
| Clientes | `CustomerController` → `CustomerService` → `CustomerJdbcRepository` |
| OS | `WorkOrderController` → `WorkOrderService` → `WorkOrderJdbcRepository` |
| Portal login | `WebLoginController` → `WebLoginService` → `CustomerAuthJdbcRepository` |
| Tracking público | `WebTrackingController` → `WebTrackingService` |
| Executor JDBC | `repository/jdbc/core/JdbcProcedureExecutor` |
