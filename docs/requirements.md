# Requisitos do sistema

Aqui ficam anotadas as funcionalidades do **Gestão Oficina**. Vai crescendo aos poucos — não precisa fechar tudo antes de codar.

---

## Como isso funciona na prática

Seguimos o fluxo do [README](../README.md#como-a-gente-avança):

1. **Ouvir a oficina** — entender como é o dia a dia de verdade.
2. **Escolher algo pequeno** — uma feature por vez.
3. **Fazer e mostrar** — implementar, testar, ver se faz sentido.
4. **Anotar aqui** — registrar o que ficou pronto e o que vem depois.

Quando uma ideia estiver madura o suficiente, ela vira um **RF-XX** (requisito funcional) com problema, fluxo e critérios de aceite. Aí sim entra no código.

---

## Status (o que cada palavra significa)

| Status | Em português claro |
|--------|---------------------|
| **Ideia** | Só anotado, ainda sem conversa |
| **Em discussão** | Conversando com a oficina ou entre devs |
| **Aprovado** | Todo mundo concordou no que fazer |
| **Em desenvolvimento** | Alguém está codando |
| **Concluído** | Funcionando e validado (demo ou uso real) |

---

## Backlog

| ID | O quê | Status |
|----|-------|--------|
| [RF-01](#rf-01--login-e-acesso) | Login e acesso ao sistema | Concluído |
| [RF-02](#rf-02--cadastro-de-usuários-admin) | Cadastro de usuários (admin) | Concluído |
| [RF-03](#rf-03--listagem-de-usuários) | Listagem com filtros e páginas | Concluído |
| — | *Próximo requisito* | Ideia |

---

## RF-01 — Login e acesso

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** A oficina precisa saber quem está entrando no sistema.
- **Quem usa:** Admin, atendente e mecânico.
- **Fluxo:**
  1. Pessoa abre a tela de login.
  2. Digita e-mail e senha.
  3. Sistema valida e devolve um token (JWT).
  4. Vai pra tela inicial logada.
- **Pra considerar pronto:**
  - [x] Login certo devolve JWT.
  - [x] Login errado mostra erro claro na tela.
  - [x] Rotas protegidas pedem token.
  - [x] Sessão fica no navegador até logout.
- **No código:** JWT + BCrypt; perfis `ADMIN`, `ATTENDANT`, `MECHANIC`.

---

## RF-02 — Cadastro de usuários (admin)

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** O admin precisa cadastrar quem vai usar o sistema (balcão, oficina).
- **Quem usa:** Só administrador.
- **Fluxo:**
  1. Admin vai em **Novo usuário**.
  2. Preenche nome, e-mail, senha e perfil (atendente ou mecânico).
  3. Sistema salva e confirma.
- **Fora por enquanto:** Criar admin por essa tela; editar ou apagar usuário.
- **Pra considerar pronto:**
  - [x] Só `ADMIN` acessa.
  - [x] Perfis permitidos: `ATTENDANT` e `MECHANIC`.
  - [x] E-mail repetido dá erro.
  - [x] Senha com no mínimo 6 caracteres (validado no back).
- **No código:** Procedure `p_create_user`; tela `/admin/users/new`.

---

## RF-03 — Listagem de usuários

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** Admin precisa ver quem está cadastrado sem abrir o banco na mão.
- **Quem usa:** Só administrador.
- **Fluxo:**
  1. Admin abre **Usuários**.
  2. Vê tabela com páginas.
  3. Filtra por perfil, status ativo/inativo, nome ou e-mail.
  4. Navega entre as páginas.
- **Pra considerar pronto:**
  - [x] Lista paginada (`page` / `pageSize`).
  - [x] Filtros de role, ativo/inativo e busca.
  - [x] Só `ADMIN` acessa.
  - [x] Tem link pra cadastrar novo usuário.
- **No código:** Procedures `p_count_users_filtered` e `p_find_users_filtered`; tela `/admin/users`.

---

## Modelo — próximo requisito

Quando aprovar um requisito novo, copia, preenche e adiciona uma linha no [backlog](#backlog):

```markdown
## RF-XX — Título

- **Status:** Aprovado
- **Prioridade:** Alta | Média | Baixa
- **Problema:** …
- **Quem usa:** …
- **Fluxo:**
  1. …
- **Fora por enquanto:** …
- **Pra considerar pronto:**
  - [ ] …
- **No código:** …
- **Validado com a oficina em:** DD/MM/AAAA
```
