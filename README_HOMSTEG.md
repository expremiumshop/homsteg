# HOMSTEG STORE

O HOMSTEG é uma base de produto para uma plataforma SaaS de comércio electrónico multi-tenant: cada merchant pode criar uma loja, escolher um plano, personalizar o design, gerir produtos e publicar uma storefront própria.

## O que está implementado

A aplicação inclui uma landing page orientada a conversão, galeria de lojas demo originais, templates, pricing em MZN, FAQ e microinterações. O fluxo público inclui storefronts demo em `/store/:slug` com pesquisa de produtos, carrinho, favoritos, checkout inicial e estados de produto.

A área merchant em `/app` mantém exactamente cinco áreas principais — Início, Produtos, Design, Domínio e Configurações — com encomendas, clientes, analytics, inventário e atalhos organizados contextualmente. A área de produtos inclui pesquisa, estados de stock, import/export contextual, categorias, coleções, inventário e criação/arquivo de produtos com validação no formulário. O editor de Design inclui preview desktop/tablet/mobile, template, cores, tipografia, secções e toggles. O painel central em `/admin` apresenta lojas, MRR, subscrições, receita, saúde do sistema e tickets.

A camada server inclui autenticação Manus já existente, schema Drizzle para utilizadores, planos, lojas, membros e produtos, além de procedimentos tRPC protegidos para listar stores, listar/criar/arquivar produtos e validar acesso por tenant antes de qualquer operação. Não são incluídas credenciais reais nem gateways de pagamento fictícios.

## Arquitectura

```text
client/
  src/pages/       Landing, Dashboard, Storefront, Admin, 404
  src/data.ts      Dados visuais demo e configuração central de planos
  src/index.css    Tokens, tipografia e microinterações
server/
  db.ts            Queries Drizzle e validação de membership
  routers.ts       Contratos tRPC protegidos
  homsteg.logic.test.ts  Testes de entitlements e isolamento
shared/
  homsteg.ts       Regras de planos, features e tenant boundary
drizzle/
  schema.ts        users, plans, stores, storeMembers, products
  0001_*.sql       Migration gerada com Drizzle Kit
```

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, Wouter, tRPC 11, Drizzle ORM, MySQL/TiDB no scaffold WebDev e Manus OAuth. A UI não depende de credenciais externas para o fluxo de demonstração. Imagens de demonstração usam URLs de fotografia do Unsplash para facilitar substituição por assets próprios ou storage S3 antes do lançamento.

## Ambiente e desenvolvimento

1. Copie as variáveis disponíveis no ambiente WebDev para um `.env` local. Nunca commit chaves reais.
2. Instale as dependências com `pnpm install`.
3. Execute `pnpm dev` para desenvolvimento.
4. Execute `pnpm test`, `pnpm run check` e `pnpm run build` antes de fazer deploy.

Variáveis relevantes do scaffold: `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID` e `OWNER_NAME`. O servidor usa `server/_core/env.ts` como fonte dos nomes disponíveis.

## Base de dados e multi-tenancy

Cada entidade de negócio inclui `storeId`. A autorização server-side usa a relação `storeMembers` e a role do utilizador. Merchants só podem consultar ou alterar stores onde possuem membership; admins passam por uma rota controlada. O browser não é uma fonte confiável para decidir permissões. A camada compartilhada também expõe `assertTenantAccess`, `sanitizeStoreId`, `canCreateProduct` e `canUseFeature`.

Antes de um ambiente de produção, adicionar foreign keys, RLS equivalente no provider PostgreSQL/Supabase alvo, auditoria completa, storage por `storeId`, rate limiting e uma suite de integração contra a base de dados real. A migration gerada é aditiva e não contém `DROP`.

## Planos e entitlements

Os planos estão centralizados em `shared/homsteg.ts` e `client/src/data.ts`. O limite de produtos é: Free 10, Starter 100, Business 1.000, Pro 5.000 e Enterprise ilimitado. Funcionalidades como domínio próprio, analytics avançado, equipa e marketing são verificadas por entitlement, não espalhadas por componentes.

## Pagamentos, domínios e localização

A experiência usa MZN, WhatsApp e referências de entrega nacional de Moçambique. Os pagamentos reais e a verificação DNS não são inventados: a UI representa a arquitectura e estados que precisam de credenciais/provider antes de serem ligados. O checkout demo explica o próximo passo sem afirmar transacções reais.

## Deploy

O scaffold está preparado para GitHub/Vercel via build de produção. Configure primeiro base de dados, OAuth, storage e providers de pagamento no ambiente de deploy. Reveja os headers, domínio, políticas de storage e migrações antes de publicar a primeira loja real.
