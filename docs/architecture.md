# Como o código está organizado

Este doc explica **como o Gestão Oficina funciona por dentro**. Se você está começando, leia com calma — não precisa decorar tudo de uma vez. Use como consulta quando for implementar algo novo.

**Combinado do projeto:**

- Código (classes, tabelas, JSON): **inglês**
- Telas e mensagens de erro pro usuário: **português** (`ValidationMessageEnum.descriptionPt`)

---

## Visão geral — o caminho de uma requisição

Quando alguém clica em algo no front, a requisição passa por estas camadas, nesta ordem:

```
React (tela)
    → Controller (recebe HTTP)
        → Service (regras + validação)
            → Repository (acesso ao banco)
                → PostgreSQL (tabelas + procedures)
```

Cada camada faz **uma coisa só**. Controller não valida regra de negócio; service não monta SQL na mão; repository não decide se o usuário é admin.

As pastas seguem **camada técnica** (`controller`, `service`, `repository`…), não uma pasta por tela.

---

## Onde fica cada coisa

```
com.gestaooficina/
├── controller/     # Endpoints REST (API)
├── service/        # Regras de negócio
├── model/
│   ├── request/    # O que chega da API (ex.: LoginRequest)
│   ├── response/   # O que volta (ex.: LoginResponse)
│   ├── enums/      # Constantes tipadas (roles, mensagens…)
│   └── record/     # Representação de linha do banco (uso interno)
├── repository/
│   ├── impl/       # Código JDBC de verdade
│   ├── filter/     # Parâmetros pras consultas
│   └── mapper/     # Converte resultado do banco em objetos Java
├── exception/      # GlobalException
├── config/         # Configuração Spring
├── security/       # JWT, login
└── utils/          # Validação, helpers
```

| Pasta | O que tem lá |
|-------|----------------|
| `controller/` | `LoginController`, `HomeController`, `BaseController`… |
| `service/` | `LoginService`, `AdminUserListService`… |
| `model/request/` | DTO de entrada — o JSON que o front manda |
| `model/response/` | DTO de saída — o JSON que volta |
| `model/enums/` | `UserRoleEnum`, `ValidationMessageEnum`… |
| `model/record/` | `UserRecord` — dado cru do banco, não vai pro front |
| `repository/` | Interfaces + `impl/` com JDBC |
| `repository/filter/` | `UserListFilter`, `CreateUserFilter`… |

> Por que `enums` e não `enum`? Porque `enum` é palavra reservada em Java.

As URLs da API ficam centralizadas em `GestaoOficinaControllerMapping` — um lugar só pra ver todas as rotas.

---

## Controller — a porta da API

**Papel:** receber a requisição HTTP, chamar o service e devolver JSON.

**O que ele faz:**

- Expõe os endpoints (`GET`, `POST`…)
- Recebe o body como um `*Request` (um DTO por endpoint)
- Pega o usuário logado com `requireEmail(authentication)` quando precisa
- Chama o **service** e monta a resposta em `HttpResponseEntityDTO`
- Trata erro com `try/catch`: `GlobalException` → `badRequest()`, resto → `internalServerError()`

**Exemplo real (listagem de usuários):**

```java
try {
    String email = requireEmail(authentication);
    UserListResponse data = adminUserListService.getList(email, request);
    response.setData(data);
    response.setSuccess(true);
    response.setStatus(HttpStatus.OK.value());
    response.setMessage("User list loaded.");
    return ResponseEntity.ok(response);
} catch (GlobalException e) {
    return badRequest(e);
} catch (Exception e) {
    return internalServerError(e, ValidationMessageEnum.UNEXPECTED_ERROR_USER_LIST);
}
```

**Dicas:**

- Estenda `BaseController`
- Rotas em `GestaoOficinaControllerMapping`
- Validação fica no **service**, não aqui
- Injeção por construtor (passa dependência no `public MeuController(...)`)

---

## Service — onde mora a regra

**Papel:** pensar. Validar, autorizar, montar filtros, chamar o banco, devolver response.

**O que ele faz:**

- Valida campos (`UserValidationUtils` + `GlobalException`)
- Checa permissão (ex.: só admin lista usuários)
- Transforma `Request` em `Filter` (objeto que o repository entende)
- Transforma `UserRecord` em `*Response` (o que o front vai ver)
- Lança `GlobalException.of(ValidationMessageEnum.ALGUMA_COISA)` quando algo está errado

**Exemplo — montar filtro antes de consultar:**

```java
UserListRequest source = request != null ? request : new UserListRequest();
UserValidationUtils.validatePagination(page, pageSize);

UserListFilter filter = new UserListFilter(
        UserValidationUtils.normalizeRoleFilter(source.getRole()),
        UserValidationUtils.normalizeActiveFilter(source.getActiveFilter()),
        // ...
);
long total = adminUserListJdbcRepository.countUsers(filter);
```

| Service | Como monta o Filter |
|---------|---------------------|
| `LoginService` | `new UserEmailFilter(email)` depois de validar |
| `AdminUserRegisterService` | `new CreateUserFilter(...)` depois de validar |
| `AdminUserListService` | `new UserListFilter(...)` com campos já normalizados |

---

## Model — os tipos de dado

| Tipo | Pasta | Pra quê |
|------|-------|---------|
| `*Request` | `model/request/` | O que o front **manda** |
| `*Response` | `model/response/` | O que o back **devolve** |
| `*Enum` | `model/enums/` | Valores fixos com `code` + descrição |
| `*Record` | `model/record/` | Linha do banco — **só uso interno** |

---

## Request vs Filter — qual a diferença?

Isso confunde no começo, então vamos direto:

| | **Request** (`model/`) | **Filter** (`repository/filter/`) |
|--|------------------------|-----------------------------------|
| **O quê é** | Contrato da API (JSON) | Pacote de parâmetros pro JDBC |
| **Quem cria** | Spring deserializa no controller | Service, depois de validar |
| **Quem usa** | Controller e service | Service e repository |
| **Nome** | `UserListRequest` | `UserListFilter` |

O repository **sempre** recebe um `Filter`, nunca um monte de `String` e `int` soltos.

---

## Repository — falar com o banco

**Papel:** executar SQL (via procedures) e devolver dados pro service.

- Interface em `repository/` (ex.: `AuthJdbcRepository`)
- Implementação em `repository/impl/` (ex.: `AuthJdbcRepositoryImpl`)
- SQL das procedures como constante na interface
- Usa `NamedParameterJdbcTemplate` + `MapSqlParameterSource`
- Converte linhas com classes em `repository/mapper/`
- Se o JDBC quebrar, lança `GlobalException` com mensagem do enum

**Exemplo:**

```java
try {
    List<UserRecord> rows = jdbc.query(P_FIND_USER_BY_EMAIL, params, UserRowMapper.INSTANCE);
    return rows.stream().findFirst();
} catch (DataAccessException e) {
    log.error("[auth] JDBC error email={}: {}", filter.getEmail(), e.getMessage(), e);
    throw GlobalException.of(ValidationMessageEnum.FAILED_LOAD_USER);
}
```

`UserRecord` fica no service/repository — o controller nunca vê isso. O service converte pra `*Response`.

---

## Banco de dados

Scripts em `server/src/main/resources/database/`:

- `V001_schema_users.sql` — tabelas
- `V002_seed_admin.sql` — usuário admin inicial
- `P_*.sql` — stored procedures (lógica de consulta fica aqui)
- `V000_drop_all.sql` — reset manual se precisar zerar tudo

No Docker, na **primeira vez** que o Postgres sobe, o script `docker/postgres/init/01-migrate.sh` roda tudo na ordem certa.

Acesso ao banco: **JDBC + procedures** (sem JPA/Hibernate).

---

## Erros e mensagens na tela

Quando algo dá errado, o fluxo é este:

```
Service lança GlobalException
    → Controller devolve JSON com message em português
        → apiClient.js lê o message
            → Toast no canto da tela
```

### ValidationMessageEnum — um lugar pra todas as mensagens

Toda mensagem que o usuário vai ler fica em `ValidationMessageEnum`:

| Campo | Pra quê |
|-------|---------|
| `code` | Identificador fixo (`EMAIL_REQUIRED`) |
| `descriptionPt` | Texto que aparece no toast (**português**) |
| `descriptionEng` | Mesma ideia em inglês (referência, logs, futuro) |

**No service:**

```java
throw GlobalException.of(ValidationMessageEnum.EMAIL_REQUIRED);
// API devolve: "E-mail é obrigatório."
```

**No controller:**

```java
} catch (GlobalException e) {
    return badRequest(e);
} catch (Exception e) {
    return internalServerError(e, ValidationMessageEnum.UNEXPECTED_ERROR_USER_LIST);
}
```

Vários erros de uma vez (quando fizer sentido):

```java
throw GlobalException.of(
    ValidationMessageEnum.INVALID_DATA,
    List.of(ValidationMessageEnum.EMAIL_REQUIRED, ValidationMessageEnum.PASSWORD_REQUIRED));
```

**Resumo:**

- Mensagem nova? Adiciona no enum com PT e EN.
- Erro 500: mensagem genérica pro usuário; detalhe técnico só no log do server.

### No front (React)

O `apiClient.js` já cuida de mostrar erro na maioria dos casos:

```json
{
  "success": false,
  "status": 400,
  "message": "E-mail é obrigatório.",
  "errors": null
}
```

- `message` → texto do toast
- `errors` → lista no toast (se tiver)
- Sem internet → `"Não foi possível conectar ao servidor."`

Formulários usam `noValidate` — **não validam no browser**. O usuário manda o que digitou; o back valida e devolve a mensagem.

```javascript
try {
  await createUser(payload, token);
  showSuccess('Usuário cadastrado com sucesso.');
} catch {
  // apiClient já mostrou o toast de erro
}
```

---

## Front (React) — estrutura

```
gestao-oficina-admin-web/src/
├── pages/       # Uma tela principal por arquivo
├── components/  # Pedacinhos reutilizáveis (layout, toast…)
├── services/    # Chamadas HTTP (apiClient, authService…)
├── context/     # Estado global (ex.: login)
└── constants/   # Labels e enums do front
```

- HTTP centralizado em `apiClient.js`
- Um `*Service.js` por área (ex.: `authService.js`)
- POST manda JSON igual ao `*Request` do back
- Feedback com toast (canto da tela), sem modal bloqueante

---

## Checklist — implementando algo novo

Use como cola na parede:

- [ ] Arquivos nas pastas certas (`controller`, `service`, `model`, `repository`)
- [ ] Rota em `GestaoOficinaControllerMapping`
- [ ] `*Request` e `*Response` em `model/`
- [ ] Controller fino: recebe body, chama service, trata exceção
- [ ] Service valida, aplica regra, monta `*Filter`
- [ ] `*Filter` em `repository/filter/`
- [ ] Interface + `*JdbcRepositoryImpl` se tiver banco
- [ ] Procedure SQL em `resources/database/` se precisar
- [ ] Mensagem nova em `ValidationMessageEnum` (PT + EN)
- [ ] Tela em `gestao-oficina-admin-web/src/pages/` + chamada em `services/`
- [ ] Requisito anotado em [requirements.md](./requirements.md)

---

## Onde olhar no código (exemplos)

| O quê | Caminho no código |
|-------|-------------------|
| Login | `LoginController` → `LoginService` → `AuthJdbcRepository` |
| Tela inicial | `HomeController` → `HomeService` |
| Cadastrar usuário | `AdminUserRegisterController` → `AdminUserRegisterService` → `UserJdbcRepository` |
| Listar usuários | `AdminUserListController` → `AdminUserListService` → `AdminUserListJdbcRepository` |
| Montar Filter | `AdminUserListService.getList` → `UserListFilter` |
| Formato da resposta HTTP | `HttpResponseEntityDTO`, `BaseController` |

---

Dúvida sobre uma camada? Abre um dos exemplos da tabela acima e segue o fluxo com o debugger ou com `grep`. Com o tempo o padrão fica automático.
