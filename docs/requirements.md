# Requisitos do sistema

Aqui ficam anotadas as capacidades que o **Gestão Oficina** precisa atender. Escritos no **infinitivo** e de forma **genérica** — o detalhe de tela/fluxo entra quando o RF for aprovado e for pra desenvolvimento.

Vai crescendo aos poucos — não precisa fechar tudo antes de codar.

---

## Como isso funciona na prática

Seguimos o fluxo do [README](../README.md#como-a-gente-avança):

1. **Ouvir a oficina** — entender como é o dia a dia de verdade.
2. **Escolher algo pequeno** — um requisito (ou fatia dele) por vez.
3. **Fazer e mostrar** — implementar, testar, ver se faz sentido.
4. **Anotar aqui** — registrar o que ficou pronto e o que vem depois.

Quando uma ideia estiver madura, vira um **RF-XX** com problema, o que o sistema deve fazer e critérios de aceite. Aí sim entra no código.

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

## MVP

**Pronto quando:** for possível registrar cliente e veículo, abrir e conduzir uma ordem de serviço, lançar itens, saber valor e pagamento, e consultar o histórico do veículo.

**Dados reais:** schema compartilhado + APIs nos dois servers + fronts sem mock. Seed com ~480 OS em 24 meses.

**Fora do MVP:** controlar estoque, compras, emissão fiscal, agenda, comissões, app mobile, integrações externas (WhatsApp etc.), multilojas, indicadores avançados.

---

## Backlog

| ID | Requisito | Status |
|----|-----------|--------|
| [RF-01](#rf-01--autenticar-usuários-e-controlar-o-acesso-ao-sistema) | Autenticar usuários e controlar o acesso ao sistema | Concluído |
| [RF-02](#rf-02--cadastrar-e-administrar-usuários-do-sistema) | Cadastrar e administrar usuários do sistema | Concluído |
| [RF-03](#rf-03--consultar-usuários-com-filtros-e-paginação) | Consultar usuários com filtros e paginação | Concluído |
| [RF-04](#rf-04--gerenciar-clientes-da-oficina) | Gerenciar clientes da oficina | Concluído |
| [RF-05](#rf-05--gerenciar-veículos-atendidos-pela-oficina) | Gerenciar veículos atendidos pela oficina | Concluído |
| [RF-06](#rf-06--localizar-clientes-e-veículos-de-forma-rápida) | Localizar clientes e veículos de forma rápida | Concluído |
| [RF-07](#rf-07--registrar-e-acompanhar-ordens-de-serviço) | Registrar e acompanhar ordens de serviço | Concluído |
| [RF-08](#rf-08--controlar-o-andamento-das-ordens-de-serviço) | Controlar o andamento das ordens de serviço | Concluído |
| [RF-09](#rf-09--lançar-serviços-e-peças-nas-ordens-de-serviço) | Lançar serviços e peças nas ordens de serviço | Concluído |
| [RF-10](#rf-10--calcular-valores-e-controlar-o-pagamento-das-ordens) | Calcular valores e controlar o pagamento das ordens | Concluído |
| [RF-11](#rf-11--consultar-o-histórico-de-atendimentos-por-veículo) | Consultar o histórico de atendimentos por veículo | Concluído |
| [RF-12](#rf-12--manter-catálogos-de-serviços-e-peças) | Manter catálogos de serviços e peças | Concluído |
| [RF-13](#rf-13--emitir-comprovante-ou-orçamento-da-ordem-de-serviço) | Emitir comprovante ou orçamento da ordem de serviço | Concluído |
| [RF-14](#rf-14--visualizar-o-panorama-das-ordens-em-andamento) | Visualizar o panorama das ordens em andamento | Concluído |
| [RF-15](#rf-15--permitir-ao-cliente-acompanhar-a-ordem-de-serviço) | Permitir ao cliente acompanhar a ordem de serviço | Concluído |
| [RF-16](#rf-16--permitir-ao-cliente-acessar-conta-com-histórico-de-atendimentos) | Permitir ao cliente acessar conta com histórico de atendimentos | Concluído |

---

## RF-01 — Autenticar usuários e controlar o acesso ao sistema

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** A oficina precisa saber quem está entrando no sistema.
- **Quem usa:** Admin, atendente e mecânico.
- **O sistema deve:** autenticar o usuário e restringir o uso às áreas permitidas ao seu perfil.
- **Fluxo (implementado):**
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

## RF-02 — Cadastrar e administrar usuários do sistema

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** É preciso definir quem usa o sistema (balcão, oficina).
- **Quem usa:** Administrador.
- **O sistema deve:** permitir cadastrar usuários com perfil adequado ao trabalho na oficina.
- **Fluxo (implementado):**
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

## RF-03 — Consultar usuários com filtros e paginação

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** Admin precisa ver quem está cadastrado sem abrir o banco na mão.
- **Quem usa:** Administrador.
- **O sistema deve:** permitir consultar a lista de usuários com filtros e paginação.
- **Fluxo (implementado):**
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

## RF-04 — Gerenciar clientes da oficina

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** A oficina precisa manter o cadastro de quem leva o veículo.
- **Quem usa:** Quem atende no balcão e administra o sistema.
- **O sistema deve:** permitir criar, atualizar e consultar clientes com os dados mínimos necessários ao atendimento.
- **Fora por enquanto:** exigência fiscal completa; exclusão definitiva complexa.
- **Pra considerar pronto:**
  - [x] Criar e atualizar cliente.
  - [x] Consultar clientes.
  - [x] Dados mínimos validados (ex.: nome e telefone).
- **No código:** API `/api/v1/customers` (server-admin) + telas Customer*
- **Validado com a oficina em:** —

---

## RF-05 — Gerenciar veículos atendidos pela oficina

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** O atendimento gira em torno do veículo, não só da pessoa.
- **Quem usa:** Quem atende no balcão e administra o sistema.
- **O sistema deve:** permitir cadastrar e vincular veículos a clientes, identificando-os de forma única (ex.: placa).
- **Fora por enquanto:** múltiplos donos; fotos; chassi obrigatório.
- **Pra considerar pronto:**
  - [x] Criar e atualizar veículo vinculado a cliente.
  - [x] Identificação única do veículo.
  - [x] Consultar veículos de um cliente.
- **No código:** API `/api/v1/vehicles` (server-admin) + telas Vehicle*
- **Validado com a oficina em:** —

---

## RF-06 — Localizar clientes e veículos de forma rápida

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** No atendimento diário, achar o registro certo precisa ser imediato.
- **Quem usa:** Quem atende no balcão (e consulta na oficina, se fizer sentido).
- **O sistema deve:** permitir localizar cliente e veículo por identificadores comuns (telefone, placa, etc.) e seguir para o atendimento.
- **Fora por enquanto:** busca avançada; OCR de placa.
- **Pra considerar pronto:**
  - [x] Localizar por placa e por telefone.
  - [x] Resultado leva ao atendimento (ex.: nova OS).
  - [x] Sem resultado, mensagem clara.
- **No código:** API `/api/v1/search` + by-phone/by-plate
- **Validado com a oficina em:** —

---

## RF-07 — Registrar e acompanhar ordens de serviço

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** A oficina precisa formalizar cada atendimento.
- **Quem usa:** Quem atende no balcão e administra o sistema; mecânico consulta.
- **O sistema deve:** permitir abrir, listar e detalhar ordens de serviço ligadas a cliente e veículo, com o relato do problema.
- **Fora por enquanto:** orçamento separado da OS; fotos; assinatura.
- **Pra considerar pronto:**
  - [x] Abrir OS com cliente, veículo e descrição.
  - [x] Listar e detalhar OS.
  - [x] Registrar responsável pela criação e data/hora.
- **No código:** API `/api/v1/work-orders` CRUD básico
- **Validado com a oficina em:** —

---

## RF-08 — Controlar o andamento das ordens de serviço

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** É preciso saber em que etapa está cada atendimento.
- **Quem usa:** Admin, atendente e mecânico (com regras por perfil).
- **O sistema deve:** permitir evoluir a OS pelos estados do ciclo de atendimento (aberta, em execução, aguardando, pronta, entregue, cancelada), conforme o perfil do usuário.
- **Fora por enquanto:** workflow configurável; aprovação do cliente por status.
- **Pra considerar pronto:**
  - [x] Estados do ciclo definidos e aplicados.
  - [x] Transições respeitam o perfil do usuário.
  - [x] Situação inválida é rejeitada com erro claro.
- **No código:** PUT `/work-orders/{id}/status` + `work_order_status_history`
- **Validado com a oficina em:** —

---

## RF-09 — Lançar serviços e peças nas ordens de serviço

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** O atendimento precisa registrar o que foi feito e o que foi aplicado.
- **Quem usa:** Quem atende no balcão e administra o sistema.
- **O sistema deve:** permitir incluir, alterar e remover itens de mão de obra e peças na OS enquanto ela estiver aberta a alteração. Para peças, o preço cobrado é informado na hora do lançamento (pode variar por OS).
- **Fora por enquanto:** baixa automática de estoque; kits; markup.
- **Pra considerar pronto:**
  - [x] Lançar itens de serviço e de peça.
  - [x] Informar preço da peça no lançamento da OS.
  - [x] Alterar e remover itens quando permitido.
  - [x] Impedir alteração em OS encerrada/cancelada.
- **No código:** POST/PUT/DELETE itens da OS
- **Validado com a oficina em:** —

---

## RF-10 — Calcular valores e controlar o pagamento das ordens

- **Status:** Concluído
- **Prioridade:** Alta
- **Problema:** A oficina precisa saber quanto cobrar e se foi pago.
- **Quem usa:** Quem atende no balcão e administra o sistema.
- **O sistema deve:** calcular o total a partir dos itens e registrar a situação de pagamento, sem módulo financeiro completo.
- **Fora por enquanto:** parcelas, formas de pagamento detalhadas, caixa do dia, NF.
- **Pra considerar pronto:**
  - [x] Total calculado a partir dos itens.
  - [x] Situação de pagamento registrável e consultável.
- **No código:** Total derivado + PUT payment
- **Validado com a oficina em:** —

---

## RF-11 — Consultar o histórico de atendimentos por veículo

- **Status:** Concluído
- **Prioridade:** Média
- **Problema:** Atendimentos anteriores importam na próxima visita.
- **Quem usa:** Quem atende e quem executa o serviço.
- **O sistema deve:** permitir consultar o histórico de ordens de serviço de um veículo.
- **Fora por enquanto:** comparativo de gastos; recomendações automáticas.
- **Pra considerar pronto:**
  - [x] Listar atendimentos anteriores do veículo.
  - [x] Acesso a partir do veículo / localização rápida.
- **No código:** GET `/vehicles/{id}/history`
- **Validado com a oficina em:** —

---

## RF-12 — Manter catálogos de serviços e peças

- **Status:** Concluído
- **Prioridade:** Média
- **Problema:** Itens recorrentes não devem ser redigitados do zero.
- **Quem usa:** Admin/atendente mantém; balcão usa no lançamento.
- **O sistema deve:** permitir manter listas de serviços e de peças. Em serviços, valor de referência pode pré-preencher o lançamento. Em peças, o catálogo guarda só o nome; o preço cobrado é informado na OS.
- **Fora por enquanto:** estoque; fornecedor; tabela por modelo de carro.
- **Pra considerar pronto:**
  - [x] Manter catálogo de serviços.
  - [x] Manter módulo/cadastro de peças.
  - [x] Usar o catálogo ao lançar item na OS.
- **No código:** API `/api/v1/catalogs/services|parts`
- **Validado com a oficina em:** —

---

## RF-13 — Emitir comprovante ou orçamento da ordem de serviço

- **Status:** Concluído
- **Prioridade:** Média
- **Problema:** Cliente e oficina precisam de um registro imprimível ou compartilhável.
- **Quem usa:** Quem atende no balcão e administra o sistema.
- **O sistema deve:** permitir gerar visão imprimível ou PDF da OS com dados essenciais e totais.
- **Fora por enquanto:** layout gráfico elaborado; assinatura digital.
- **Pra considerar pronto:**
  - [x] Emitir comprovante/orçamento com cliente, veículo, itens e total.
- **No código:** Tela WorkOrderPrint via detalhe da OS
- **Validado com a oficina em:** —

---

## RF-14 — Visualizar o panorama das ordens em andamento

- **Status:** Concluído
- **Prioridade:** Média
- **Problema:** A oficina precisa de uma visão do que está acontecendo agora.
- **Quem usa:** Todos os perfis (visão conforme o papel).
- **O sistema deve:** apresentar um resumo das ordens ativas agrupadas por situação.
- **Fora por enquanto:** Kanban avançado; TV da oficina.
- **Pra considerar pronto:**
  - [x] Visão das OS ativas por situação.
  - [x] Acesso rápido ao detalhe da OS.
- **No código:** GET `/work-orders/panorama` + Home/Kanban
- **Validado com a oficina em:** —

---

## RF-15 — Permitir ao cliente acompanhar a ordem de serviço

- **Status:** Concluído
- **Prioridade:** Média
- **Problema:** O cliente quer saber em que pé está o carro sem ligar o tempo todo.
- **Quem usa:** Cliente da oficina (com ou sem conta).
- **O sistema deve:** permitir consultar o andamento da OS de forma simples, sem login, a partir de identificadores do atendimento (ex.: número da OS + placa, ou telefone).
- **Fora por enquanto:** chat, pagamento online, push notification, alteração de dados pelo cliente.
- **Pra considerar pronto:**
  - [x] Consulta sem autenticação.
  - [x] Exibir status, veículo, relato, itens/total e histórico de andamento.
  - [x] Não expor dados de outros clientes.
- **No código:** GET `/api/v1/web/tracking` (público)
- **Validado com a oficina em:** —

---

## RF-16 — Permitir ao cliente acessar conta com histórico de atendimentos

- **Status:** Concluído
- **Prioridade:** Média
- **Problema:** O cliente quer ver tudo o que já fez na oficina (todas as OS e veículos), não só a OS da vez.
- **Quem usa:** Cliente da oficina com conta.
- **O sistema deve:** autenticar o cliente (e-mail/telefone + senha) e exibir painel com OS em andamento, histórico completo e veículos vinculados.
- **Fora por enquanto:** cadastro self-service, recuperação de senha, chat, pagamento online, push.
- **Pra considerar pronto:**
  - [x] Login com e-mail ou telefone + senha (protótipo mock).
  - [x] Painel com OS ativas e resumo do histórico.
  - [x] Histórico completo com filtros (status / veículo).
  - [x] Lista de veículos do cliente.
  - [x] Detalhe da OS só se pertencer à conta (quando logado).
  - [x] Conta e senha reais no backend (hoje só mock no portal).
- **No código:** Login `customer_account` + `/api/v1/web/me/*`
- **Validado com a oficina em:** —

---

## Modelo — próximo requisito

Título no **infinitivo** (capacidade do sistema). Quando aprovar, copia, preenche e adiciona uma linha no [backlog](#backlog):

```markdown
## RF-XX — Verbo no infinitivo + capacidade

- **Status:** Aprovado
- **Prioridade:** Alta | Média | Baixa
- **Problema:** …
- **Quem usa:** …
- **O sistema deve:** …
- **Fora por enquanto:** …
- **Pra considerar pronto:**
  - [ ] …
- **No código:** …
- **Validado com a oficina em:** DD/MM/AAAA
```
