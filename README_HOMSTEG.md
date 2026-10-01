# HOMSTEG STORE

O HOMSTEG é uma plataforma de criação de lojas online **100% GRATUITA**, multi-tenant: cada merchant pode criar uma loja, personalizar o design, gerir produtos e publicar uma storefront própria — sem planos, sem mensalidades e sem qualquer cobrança recorrente pela utilização da plataforma.

## Modelo de negócio

- **Criar e usar a loja é sempre gratuito.** Não existem planos (Free, Starter, Business, Professional ou Enterprise foram removidos), nem preços, assinaturas, upgrades ou períodos de pagamento.
- **O único sistema pago é o de CRÉDITOS.** O utilizador usa créditos apenas para comprar/desbloquear funcionalidades, modelos, componentes ou recursos disponíveis no Market (banners, cartões de produto, cabeçalhos, rodapés, etc.).
- O saldo de crédito vive na loja (`stores.creditMzn`) e é gerido manualmente pelo Admin (secção "Créditos").
- Não existe mensalidade pela loja nem cobrança recorrente pela utilização da plataforma.

## O que está implementado

A aplicação inclui uma landing page que comunica "Crie sua loja online 100% grátis", explica que não existem planos nem mensalidades e clarifica que os créditos servem apenas para recursos específicos do Market. O fluxo público inclui storefronts em `/store/:slug` com pesquisa de produtos, carrinho, favoritos, checkout e páginas de produto.

A área merchant em `/app` inclui Início, Market, Produtos, Categorias, Encomendas, Clientes, Design/Temas, Personalização, Pagamentos, Entrega, Marketing e Configurações. Todos os temas estão disponíveis gratuitamente para todas as lojas — não existem temas bloqueados. Não há limite de produtos. O painel central em `/admin` gere utilizadores, lojas, créditos e o catálogo comercial do Market.

A camada server inclui autenticação (Better Auth), schema Drizzle para utilizadores, lojas, membros, produtos, categorias, features do Market e compras do Market, além de procedimentos tRPC protegidos com validação de acesso por tenant antes de qualquer operação.

## Arquitectura

```text
client/
  src/pages/       Landing, Dashboard, StoreThemes, Admin, 404
  src/lib/plans.ts Helpers de crédito da loja (sem planos)
  src/index.css    Tokens, tipografia e microinterações
server/
  db.ts            Queries Drizzle, crédito e compras do Market
  routers.ts       Contratos tRPC protegidos
  homsteg.logic.test.ts  Testes de isolamento por tenant
shared/
  homsteg.ts       Tenant boundary (sem regras de planos)
  market-catalog.ts Catálogo estrutural de funcionalidades do Market
drizzle/
  schema.ts        users, stores, storeMembers, products, storeCategories,
                   marketFeatures, storeMarketFeatures
  0018_remove_plans.sql  Migração que remove plans/planRequests/subscrições
```

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, Wouter, tRPC 11, Drizzle ORM, PostgreSQL (Neon) e Better Auth. Imagens de demonstração usam URLs de fotografia do Unsplash para facilitar substituição por assets próprios.

## Ambiente e desenvolvimento

1. Configure as variáveis num `.env` local. Nunca faça commit de chaves reais.
2. Instale as dependências com `pnpm install`.
3. Execute `pnpm dev` para desenvolvimento.
4. Execute `pnpm test`, `pnpm run check` e `pnpm run build` antes de fazer deploy.
5. Aplique as migrações com `pnpm run db:push` (requer `MIGRATION_DATABASE_URL`).

Variáveis relevantes: `DATABASE_URL`, `MIGRATION_DATABASE_URL`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`.

## Base de dados e multi-tenancy

Cada entidade de negócio inclui `storeId`. A autorização server-side usa a relação `storeMembers` e a role do utilizador. Merchants só podem consultar ou alterar stores onde possuem membership; admins passam por uma rota controlada. O browser não é uma fonte confiável para decidir permissões. A camada partilhada expõe `assertTenantAccess` e `sanitizeStoreId`.

## Créditos e Market

As funcionalidades do Market são geridas na tabela `market_features` (nome, descrição, categoria, `priceCredits` e status), administráveis pelo Admin sem tocar em código. A compra debita o crédito da loja de forma transacional e o desbloqueio fica registado permanentemente em `store_market_features`. O servidor é a única fonte de verdade dos preços — nunca constantes no cliente.

## Pagamentos, domínios e localização

A experiência usa MZN, WhatsApp e referências de entrega nacional de Moçambique. Os pagamentos das lojas (M-Pesa, e-Mola, etc.) são configuração do próprio merchant, não da plataforma. A plataforma HOMSTEG em si não cobra nada pela criação ou utilização da loja.

## Deploy

O projeto está preparado para GitHub/Vercel via build de produção. Configure primeiro base de dados, OAuth e storage no ambiente de deploy. Reveja os headers, domínio, políticas de storage e migrações antes de publicar a primeira loja real.
