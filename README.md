# Gestão Oficina

Sistema de gestão para a oficina do pai da Rafaela — feito aos poucos, por nós dois.

## Sobre

Projeto pessoal: **Rafaela** e **Rodrigo** montando algo de verdade, no ritmo que der. A Rafaela conhece a oficina por dentro; os dois codam, decidem e testam juntos.

Sem pressa, sem escopo fechado — a ideia é ir descobrindo o que faz sentido conversando com quem trabalha lá e implementando uma coisa de cada vez.

**Combinado do projeto:** código em inglês (classes, tabelas, campos do JSON); telas e mensagens de erro em português.

---

## Como a gente avança

1. **Ouvir a oficina** — como funciona hoje, o que incomoda, o que ajudaria de verdade.
2. **Escolher uma coisa pequena** — uma funcionalidade por vez.
3. **Fazer e mostrar** — codar, testar, ver se serve.
4. **Anotar aqui** — o que ficou pronto e o que vem depois.

Quando uma funcionalidade estiver clara, ela entra no [documento de requisitos](./docs/requirements.md) com problema, fluxo e critérios de aceite.

**Requisitos:** [docs/requirements.md](./docs/requirements.md) — MVP RF-01 a RF-16 com dados reais (sem mocks).

---

## Documentação

| Documento | Pra que serve |
|-----------|----------------|
| [docs/setup.md](./docs/setup.md) | Instalar Docker, subir o app, resolver pepino comum |
| [docs/requirements.md](./docs/requirements.md) | O que o sistema precisa fazer (requisitos) |
| [docs/architecture.md](./docs/architecture.md) | Como o código está organizado — **leia antes de codar** |
| Swagger admin | http://localhost:8080/swagger-ui.html |
| Swagger portal | http://localhost:8081/swagger-ui.html |

---

## Estrutura do repositório

```
gestao-oficina/
├── database/                   # SQL compartilhado + fn_* admin/web
│   ├── create-database.sh      # Entrypoint idempotente (shared → admin → web)
│   ├── shared/                 # Domínios, tabelas de negócio, seed
│   ├── admin/                  # Funções do server-admin
│   ├── web/                    # Funções do portal
│   └── init/                   # Hook do Postgres no Docker
├── docs/
├── server-admin/               # API staff (Spring Boot :8080)
├── server-web/                 # API portal (Spring Boot :8081)
├── gestao-oficina-admin-web/   # Front staff (React)
├── gestao-oficina-web/         # Front portal (React)
└── docker-compose.yml
```

Padrão de backend (referência ecommerce):

```
controller/  →  service/  →  repository/ + repository/jdbc/
                  ↑
               model/dto/
                  ↑
         database/**/FN_*.sql  (fn_*)
```

---

## Stack

| Parte | Tecnologia |
|-------|------------|
| API | Java 11, Spring Boot 2.7, Maven |
| Banco | PostgreSQL 15 (JDBC + funções `fn_*`) |
| Login | JWT + BCrypt |
| Front | React 18 + Vite + Tailwind |

---

## Como rodar

### Stack completa (Docker) — recomendado

```bash
docker compose down -v   # se precisar recriar o banco do zero
docker compose up --build --force-recreate --remove-orphans
```

| O quê | URL |
|-------|-----|
| Sistema interno (staff) | http://localhost:3000 |
| Portal do cliente | http://localhost:3001 |
| API admin / Swagger | http://localhost:8080 / swagger-ui.html |
| API portal / Swagger | http://localhost:8081 / swagger-ui.html |

**Staff:** `admin@oficina.com` / `admin123` · `atendente@oficina.com` / `attn123` · `mecanico@oficina.com` / `mech123`

**Portal:** `roberto@email.com` / `ana@email.com` / `marcos@email.com` — senha `123456`

Consulta pública (sem login): número da OS + placa (ex.: `OS-2026-0001` + placa do seed).

### Fronts em modo dev (API via Docker ou local)

```bash
# staff
cd gestao-oficina-admin-web && npm install && npm run dev   # :5173 → proxy /api → :8080

# portal
cd gestao-oficina-web && npm install && npm run dev         # :5174 → proxy /api → :8081
```

### Banco só (local)

```bash
./database/create-database.sh
# reset manual: psql … -f database/shared/V000_drop_all.sql && ./database/create-database.sh
```

Passo a passo: **[docs/setup.md](./docs/setup.md)**.

---

## Padrão de código

Detalhes em **[docs/architecture.md](./docs/architecture.md)**:

- Tabelas de domínio com FK (nada de status/role em VARCHAR solto)
- `JdbcProcedureExecutor` + `fn_*` com params posicionais
- Constraints nomeadas e SQL comentado
- Fronts sem mock — só HTTP
