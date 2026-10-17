import {
    MessageCircle,
    Clock,
    ShoppingBag,
    HelpCircle,
  } from "lucide-react";
  import { Link, useSearch } from "wouter";
  import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n-context";
import StoreI18nBoundary from "./StoreI18nBoundary";

  export default function NovaMessagesPage() {
    const search = useSearch();
    const storeSlug = new URLSearchParams(search)
      .get("storeSlug")
      ?.trim();

    return (
      <StoreI18nBoundary storeSlug={storeSlug}>
        <MessagesContent />
      </StoreI18nBoundary>
    );
  }

  function MessagesContent() {
    const search = useSearch();
    const storeSlug = new URLSearchParams(search)
      .get("storeSlug")
      ?.trim();
    const storeQuery = trpc.stores.bySlug.useQuery(
      { slug: storeSlug ?? "" },
      { enabled: Boolean(storeSlug) },
    );
    const store = storeQuery.data?.store;
    const storeName = store?.name ??
      (storeSlug ? "Loja" : "NOVA STORE");
    const whatsappNumber = store?.whatsapp
      ?.replace(/\D/g, "");
    const storePath = storeSlug
      ? `/store/${encodeURIComponent(storeSlug)}`
      : "/themes/nova";
    const { t } = useI18n();
    const whatsappMessage = encodeURIComponent(
      t("messages.hello", { store: storeName }),
    );

    function openWhatsApp() {
      if (!whatsappNumber) {
        return;
      }
      window.open(
        `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
        <div className="mx-auto w-full max-w-3xl">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* CABEÇALHO */}
            <div className="border-b border-gray-200 px-5 py-6 dark:border-gray-800 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                  <MessageCircle className="h-6 w-6" />
                </div>
  
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                    {t("messages.title")}
                  </h1>
  
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t("messages.subtitle", { store: storeName })}
                  </p>
                </div>
              </div>
            </div>
  
            {/* CONTEÚDO */}
            <div className="px-5 py-6 sm:px-8">
              <div className="space-y-6">
                <div>                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("messages.title")}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {t("messages.descA")}
                    <strong>WhatsApp</strong>{t("messages.descB")}
                  </p>
                </div>
  
                {/* INFORMAÇÕES */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
  
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t("messages.helpProducts")}
                      </h3>
  
                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {t("messages.helpProductsDesc")}
                      </p>
                    </div>
                  </div>
  
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
  
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t("messages.helpBuying")}
                      </h3>
  
                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {t("messages.helpBuyingDesc")}
                      </p>
                    </div>
                  </div>
  
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
  
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t("messages.title")}
                      </h3>
  
                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {t("messages.supportDesc")}
                      </p>
                    </div>
                  </div>
                </div>
  
                {/* WHATSAPP */}
                <div className="rounded-2xl bg-green-50 p-5 dark:bg-green-950/30">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                      <MessageCircle className="h-5 w-5" />
                    </div>
  
                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-900 dark:text-white">                        {t("messages.continueTitle")}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {t("messages.continueDesc")}
                      </p>
                    </div>
                  </div>
  
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    disabled={!whatsappNumber}
                    className="
                      mt-5
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-green-600
                      px-5
                      py-3.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-green-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t("messages.continueTitle")}
                  </button>
                </div>
  
                {/* VOLTAR */}
                <div className="border-t border-gray-200 pt-6 text-center dark:border-gray-800">
                  <Link
                    href={storePath}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-gray-100
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-gray-700
                      transition
                      hover:bg-gray-200
                      dark:bg-gray-800
                      dark:text-gray-200
                      dark:hover:bg-gray-700
                    "
                  >
                    {t("product.backToStore")}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }
