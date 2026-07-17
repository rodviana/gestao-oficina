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

Quando uma funcionalidade estiver clara, ela entra no [documento de requisitos](./docs/requirements.md) com problema, fluxo e critérios de aceite. Nada de burocracia antes da hora.

**Requisitos:** [docs/requirements.md](./docs/requirements.md) — MVP (RF-01 a RF-14); RF-01 a RF-03 concluídos.

---

## Documentação

| Documento | Pra que serve |
|-----------|----------------|
| [docs/setup.md](./docs/setup.md) | Instalar Docker, subir o app, resolver pepino comum |
| [docs/requirements.md](./docs/requirements.md) | O que o sistema precisa fazer (requisitos) |
| [docs/architecture.md](./docs/architecture.md) | Como o código está organizado — **leia antes de codar** |
| [Swagger UI](http://localhost:3000/swagger-ui/index.html) | Testar a API no navegador (com o app rodando) |

---

## Estrutura do repositório

```
gestao-oficina/
├── docs/           # Documentação
├── server/         # API Java (Spring Boot)
├── client/         # Telas React
└── docker-compose.yml
```

Dentro do server, a ideia é simples: **controller** recebe a requisição, **service** pensa na regra, **repository** fala com o banco.

```
controller/  →  service/  →  repository/
                  ↑
               model/  (Request, Response, enums)
```

---

## Stack

| Parte | Tecnologia |
|-------|------------|
| API | Java 11, Spring Boot 2.7, Maven |
| Banco | PostgreSQL 15 (via JDBC + procedures) |
| Login | JWT + BCrypt |
| Front | React 18 + Vite + Tailwind |

---

## Como rodar

Tudo roda no **Docker** — você não precisa instalar Java nem Node na máquina.

Passo a passo completo: **[docs/setup.md](./docs/setup.md)**

Resumo rápido:

```bash
docker compose up --build --force-recreate --remove-orphans
```

| O quê | Onde abrir |
|-------|------------|
| Telas do sistema | http://localhost:3000 |
| Swagger (testar API) | http://localhost:3000/swagger-ui/index.html |

**Login de teste:** `admin@oficina.com` / `admin123`

---

## Padrão de código

Tudo explicado em detalhe em **[docs/architecture.md](./docs/architecture.md)**.

Se você está começando no projeto, esse é o segundo arquivo depois do setup.
