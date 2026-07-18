# Como subir o projeto na sua máquina

Guia passo a passo para rodar o **Gestão Oficina** pela primeira vez. A ideia é: instalar o Docker, rodar um comando, abrir o navegador.

---

## O que você precisa

| Item | Observação |
|------|------------|
| **Docker Desktop** | Versão recente |
| **Git** | Só se for clonar o repo (se já tem a pasta, pula) |
| **Navegador** | Chrome, Firefox ou Edge |

Você **não** precisa instalar Java, Node ou PostgreSQL — o Docker cuida disso.

---

## 1. Instalar o Docker Desktop

### Windows

1. Baixe em [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/).
2. Instale e aceite usar **WSL 2** se pedir (é o recomendado).
3. Reinicie o PC se o instalador pedir.
4. Abra o **Docker Desktop** e espere ficar verde/pronto.

### macOS

1. Baixe o Docker Desktop pro seu Mac (Intel ou Apple Silicon).
2. Arraste pra pasta Applications e abra.
3. Espere terminar de iniciar.

---

## 2. Ver se o Docker está ok

Abra o terminal (PowerShell no Windows) e rode:

```bash
docker version
```

Tem que aparecer **Client** e **Server**. Se der erro de "pipe" ou "daemon", o Docker Desktop não está aberto — abre o app e tenta de novo.

Teste básico:

```bash
docker run hello-world
```

Se aparecer mensagem de sucesso, tá pronto.

---

## 3. Pegar o código

Se ainda não tem o projeto:

```bash
git clone <url-do-repositorio>
cd gestao-oficina
```

Já está na pasta? Pula pro próximo passo.

---

## 4. Subir tudo

Na pasta onde está o `docker-compose.yml`:

```bash
docker compose up --build --force-recreate --remove-orphans
```

O que acontece:

- Sobe o **PostgreSQL** e aplica `database/create-database.sh` (schema shared + funções admin/web + seed).
- Monta as APIs **server-admin** (:8080) e **server-web** (:8081).
- Monta os fronts **admin** (:3000) e **portal** (:3001).

A primeira vez pode demorar uns minutos (baixar imagens + build). Funciona em Mac (Intel e Apple Silicon), Windows e Linux.

**Rodar em segundo plano** (libera o terminal):

```bash
docker compose up --build --force-recreate --remove-orphans -d
```

**Parar tudo:**

```bash
docker compose down
```

**Zerar o banco e começar do zero** (apaga dados):

```bash
docker compose down -v
docker compose up --build --force-recreate --remove-orphans
```

---

## 5. Abrir o sistema

Com os containers rodando:

| O quê | URL |
|-------|-----|
| **Staff** (sistema interno) | http://localhost:3000 |
| **Portal do cliente** | http://localhost:3001 |
| **API admin** | http://localhost:8080 |
| **API portal** | http://localhost:8081 |
| **Swagger admin** | http://localhost:8080/swagger-ui.html |
| **Swagger portal** | http://localhost:8081/swagger-ui.html |

### Login de teste (staff)

| Campo | Valor |
|-------|-------|
| E-mail | `admin@oficina.com` |
| Senha | `admin123` |

Outros: `atendente@oficina.com` / `attn123` · `mecanico@oficina.com` / `mech123`

### Login de teste (portal)

| Campo | Valor |
|-------|-------|
| E-mail | `roberto@email.com` (ou ana@ / marcos@) |
| Senha | `123456` |

---

## 6. Testar a API no Swagger (opcional)

Útil pra ver se o back está respondendo sem depender do front.

1. Abra http://localhost:8080/swagger-ui.html
2. Vá em **Login** → **POST /api/v1/auth/login**
3. **Try it out**, coloque e-mail e senha, execute.
4. Copie o `token` da resposta (`data.token`).
5. Clique no **cadeado Authorize** e cole: `Bearer <token>`
6. Teste os outros endpoints (customers, vehicles, work-orders…).

---

## 7. Conectar no banco (pgAdmin, DBeaver, etc.)

Com o Docker rodando, o Postgres fica na porta **5432** da sua máquina:

| Campo | Valor |
|-------|-------|
| Host | `localhost` |
| Porta | `5432` |
| Banco | `gestao_oficina` |
| Usuário | `postgres` |
| Senha | `postgres` |

Esses valores vêm do `docker-compose.yml`. Se mudar lá, muda na ferramenta também.

### pgAdmin (resumido)

1. **Add New Server** → nome qualquer (ex.: Gestão Oficina).
2. Aba **Connection**: host `localhost`, porta `5432`, database `gestao_oficina`, user/senha `postgres`.
3. Salvar. As tabelas ficam em **Databases → gestao_oficina → Schemas → public → Tables**.

### DBeaver (resumido)

1. Nova conexão PostgreSQL.
2. Mesmos dados da tabela acima.
3. **Test Connection** → **Finish**.

### IntelliJ / DataGrip (resumido)

1. Janela **Database** → **+** → PostgreSQL.
2. Mesmos dados → **Test Connection** → **OK**.

**Não conectou?** Confere se o container `gestao-oficina-db` está up (`docker compose ps`) e se outro Postgres local não está usando a porta 5432.

---

## Deu ruim? Coisas comuns

### `Failed to read artifact descriptor` / Maven BUILD FAILURE no Docker

Rede flaky ao baixar dependências do Maven Central. Roda de novo:

```bash
docker compose up --build --force-recreate --remove-orphans
```

### `dockerDesktopLinuxEngine` pipe not found (Windows)

O Docker Desktop não está aberto. Abre o app e espera ficar pronto.

### Porta 3000, 3001 ou 8080 em uso

Outro programa está usando a porta. Fecha ele ou muda o mapeamento no `docker-compose.yml` (formato `porta-do-pc:porta-do-container`).

### API reiniciando / erro de banco

Espera o Postgres ficar saudável. Se continuar:

```bash
docker compose down
docker compose up --build --force-recreate --remove-orphans
```

### Mudei o código e não apareceu

Roda de novo com `--build` pra reconstruir as imagens:

```bash
docker compose up --build --force-recreate --remove-orphans
```

---

## E agora?

- Ver o que o sistema faz: [requirements.md](./requirements.md)
- Entender como o código está organizado: [architecture.md](./architecture.md)
- Visão geral do repo: [README.md](../README.md)
