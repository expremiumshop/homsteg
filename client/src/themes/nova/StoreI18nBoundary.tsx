/*
 * Fronteira do i18n para as rotas da loja que vivem FORA da
 * árvore do NovaStorefront (carrinho, checkout e produto).
 *
 * Estas rotas são montadas diretamente pelo router
 * (client/src/App.tsx, ex.: /themes/nova/carrinho), pelo que
 * nunca passam pelo <I18nProvider> que o storefront monta na
 * sua fronteira. Sem este componente ficavam sempre no idioma
 * predefinido (pt/MZN), independentemente da loja.
 *
 * A resolução é a mesma do storefront: o storeSlug acompanha o
 * carrinho (itens adicionados na loja) ou chega na URL
 * (?storeSlug=...). A consulta stores.bySlug tem a MESMA chave
 * de cache usada pelo checkout/produto — o React Query junta os
 * pedidos, portanto não há um segundo request de rede.
 */
import type { ReactNode } from "react";

import { I18nProvider } from "@/lib/i18n-context";
import { trpc } from "@/lib/trpc";

export function StoreI18nBoundary({
  storeSlug,
  children,
}: {
  /** Slug da loja de onde veio o visitante (carrinho/URL). */
  storeSlug?: string | null;

  children: ReactNode;
}) {
  const slug = storeSlug?.trim() ?? "";

  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug },
    { enabled: Boolean(slug) },
  );

  /*
   * Enquanto a loja carrega não renderizamos a página: mostrar
   * o conteúdo em pt e trocar para en a meio segundo seria um
   * flash de idioma errado. Spinner neutro, igual ao do
   * storefront — e se a consulta falhar (ou não haja slug)
   * seguimos com o provider predefinido, nunca sem catálogo.
   */
  if (slug && storeQuery.isLoading) {
    return (
      <div
        aria-busy="true"
        className="flex min-h-screen items-center justify-center bg-gray-50"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
      </div>
    );
  }

  return (
    <I18nProvider
      language={storeQuery.data?.store.language}
      currency={storeQuery.data?.store.currency}
    >
      {children}
    </I18nProvider>
  );
}

export default StoreI18nBoundary;
