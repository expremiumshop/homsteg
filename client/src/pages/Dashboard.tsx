import {
  BarChart3,
  Box,
  Globe2,
  ImagePlus,
  LayoutDashboard,
  Menu,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

import HomstegLogo from "@/components/HomstegLogo";
import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import PlanSidebarCard from "@/components/dashboard/plan/PlanSidebarCard";
import CreditsPage from "@/components/dashboard/plan/CreditsPage";
import OverviewPage from "@/components/dashboard/overview/OverviewPage";
import ProductsPage from "@/components/dashboard/products/ProductsPage";
import CategoriesPage from "@/components/dashboard/categories/CategoriesPage";
import OrdersPage from "@/components/dashboard/orders/OrdersPage";
import CustomersPage from "@/components/dashboard/customers/CustomersPage";
import PaymentsPage from "@/components/dashboard/payments/PaymentsPage";
import ShippingPage from "@/components/dashboard/shipping/ShippingPage";
import MarketingPage from "@/components/dashboard/Marketing/MarketingPage";
import SettingsPage from "@/components/dashboard/Settings/SettingsPage";
import BrandingPage from "@/components/dashboard/branding/BrandingPage";
import MarketPage from "@/components/dashboard/market/page";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  PanelI18nProvider,
  usePanelI18n,
} from "@/lib/panel-i18n-context";
import type { PanelTranslationKey } from "@/lib/panel-i18n";

export type DashboardSection =
  | "home"
  | "credits"
  | "market"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "branding"
  | "payments"
  | "shipping"
  | "marketing"
  | "settings";

/*
 * Os rótulos guardam CHAVES do catálogo do painel
 * (client/src/lib/panel-i18n.ts) e são resolvidos no render:
 * trocar o idioma do painel troca o menu sem tocar na loja.
 */
const mainNav: {
  id: DashboardSection;
  labelKey: PanelTranslationKey;
  icon: typeof LayoutDashboard;
  path: string;
}[] = [
  {
    id: "home",
    labelKey: "nav.home",
    icon: LayoutDashboard,
    path: "/app",
  },
  {
    id: "market",
    labelKey: "nav.market",
    icon: ShoppingBag,
    path: "/app/market",
  },
  {
    id: "products",
    labelKey: "nav.products",
    icon: Box,
    path: "/app/products",
  },
  {
    id: "categories",
    labelKey: "nav.categories",
    icon: Menu,
    path: "/app/categories",
  },
  {
    id: "orders",
    labelKey: "nav.orders",
    icon: ShoppingCart,
    path: "/app/orders",
  },
  {
    id: "customers",
    labelKey: "nav.customers",
    icon: Users,
    path: "/app/customers",
  },
  {
    id: "branding",
    labelKey: "nav.branding",
    icon: ImagePlus,
    path: "/app/branding",
  },
  {
    id: "payments",
    labelKey: "nav.payments",
    icon: BarChart3,
    path: "/app/payments",
  },
  {
    id: "shipping",
    labelKey: "nav.shipping",
    icon: Globe2,
    path: "/app/shipping",
  },
  {
    id: "marketing",
    labelKey: "nav.marketing",
    icon: BarChart3,
    path: "/app/marketing",
  },
  {
    id: "settings",
    labelKey: "nav.settings",
    icon: Settings2,
    path: "/app/settings",
  },
];

function getSectionFromPath(path: string): DashboardSection {
  const section = path.split("/")[2];

  switch (section) {
    case "credits":
      return "credits";
    case "market":
      return "market";
    case "products":
      return "products";
    case "categories":
      return "categories";
    case "orders":
      return "orders";
    case "customers":
      return "customers";
    case "branding":
      return "branding";
    case "payments":
      return "payments";
    case "shipping":
      return "shipping";
    case "marketing":
      return "marketing";
    case "settings":
      return "settings";
    default:
      return "home";
  }
}

function DashboardContent({
  section,
  storeId,
  storeSlug,
}: {
  section: DashboardSection;
  storeId?: string;
  storeSlug?: string;
}) {
  switch (section) {
    case "credits":
      return <CreditsPage storeId={storeId} />;

    case "market":
      return <MarketPage storeId={storeId} />;

    case "products":
      return <ProductsPage storeId={storeId} />;

    case "categories":
      return <CategoriesPage storeId={storeId} />;

    case "orders":
      return <OrdersPage />;

    case "customers":
      return <CustomersPage />;

    case "payments":
      return <PaymentsPage />;

    case "shipping":
      return <ShippingPage />;

    case "marketing":
      return <MarketingPage />;

    case "branding":
      return (
        <BrandingPage
          storeId={storeId}
          storeSlug={storeSlug}
        />
      );

    case "settings":
      return <SettingsPage storeId={storeId} />;

    case "home":
    default:
      return (
        <OverviewPage
          storeId={storeId}
          storeSlug={storeSlug}
        />
      );
  }
}

/**
 * O provider fica POR CIMA de todo o painel: sidebar,
 * cabeçalho e páginas usam usePanelI18n(). A loja pública
 * fica fora desta árvore e continua a ler stores.language.
 */
export default function Dashboard() {
  return (
    <PanelI18nProvider>
      <DashboardShell />
    </PanelI18nProvider>
  );
}

function DashboardShell() {
  const { t } = usePanelI18n();

  const [location, setLocation] = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const storesQuery = trpc.stores.mine.useQuery();
  const auth = useAuth();

  const requestedStoreId = new URLSearchParams(
    window.location.search,
  ).get("storeId");

  const savedStoreId = sessionStorage.getItem(
    "homsteg_active_store_id",
  );

  const stores = (storesQuery.data ?? []).map((entry) =>
    "store" in entry ? entry.store : entry,
  );

  const selectedStore =
    stores.find(
      (store) =>
        store.id === requestedStoreId ||
        store.id === savedStoreId,
    ) ?? stores[0];

  useEffect(() => {
    if (selectedStore) {
      sessionStorage.setItem(
        "homsteg_active_store_id",
        selectedStore.id,
      );
    }
  }, [selectedStore]);

  useEffect(() => {
    if (!auth.loading && !auth.error && !auth.isAuthenticated) {
      setLocation("/login");
    }
  }, [auth.loading, auth.error, auth.isAuthenticated, setLocation]);

  const storeSlug = selectedStore?.slug;

  const section = getSectionFromPath(location);

  /* Rótulos traduzidos no render (idioma do painel). */
  const translatedNav = mainNav.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }));

  const currentNav =
    translatedNav.find((item) => item.id === section) ??
    translatedNav[0];

  /*
   * A área de créditos (/app/credits) não faz parte do
   * menu principal — recebe o seu próprio título.
   */
  const pageTitle =
    section === "credits" ? t("nav.credits") : currentNav.label;

  if (auth.loading || (!auth.isAuthenticated && !auth.error)) {
    return (
      <div aria-busy="true" className="flex min-h-screen items-center justify-center bg-[#f7f8f5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-600">
            {auth.error
              ? "Não foi possível confirmar a sessão."
              : "A sessão não está disponível."}
          </p>
          {auth.error && (
            <button type="button" onClick={() => void auth.refresh()} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Tentar novamente
            </button>
          )}
          <Link href="/login" className="mt-4 inline-block font-semibold text-emerald-700">Entrar novamente</Link>
        </div>
      </main>
    );
  }

  if (storesQuery.isLoading) {
    return (
      <div aria-busy="true" className="flex min-h-screen items-center justify-center bg-[#f7f8f5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (storesQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <h1 className="text-lg font-bold text-slate-950">Não foi possível carregar as lojas</h1>
          <p className="mt-2 text-sm text-slate-600">{storesQuery.error.message}</p>
          <button type="button" onClick={() => void storesQuery.refetch()} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Tentar novamente</button>
        </div>
      </main>
    );
  }

  if (stores.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <h1 className="text-lg font-bold text-slate-950">Ainda não tens uma loja</h1>
          <p className="mt-2 text-sm text-slate-600">Cria uma loja para começar a gerir produtos e personalização.</p>
          <Link href="/criar-loja/negocio" className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Criar loja</Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#111713]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          navigation={translatedNav}
          activeSection={section}
        >
          <PlanSidebarCard
            storeId={selectedStore?.id}
          />
        </DashboardSidebar>
      </div>

      {/* Mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">            <button
              type="button"
              aria-label={t("head.closeMenu")}
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileSidebarOpen(false)}
            />

          <aside className="relative z-10 h-full w-[280px] bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b px-5">
              <HomstegLogo size={38} />

              <button
                type="button"
                aria-label={t("head.closeMenu")}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                onClick={() =>
                  setMobileSidebarOpen(false)
                }
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                {translatedNav.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === section;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        window.history.pushState(
                          {},
                          "",
                          item.path,
                        );

                        window.dispatchEvent(
                          new PopStateEvent("popstate"),
                        );

                        setMobileSidebarOpen(false);
                      }}
                      className={[
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                        active
                          ? "bg-lime-100 text-[#111713]"
                          : "text-gray-600 hover:bg-gray-100 hover:text-[#111713]",
                      ].join(" ")}
                    >
                      <Icon className="h-[18px] w-[18px]" />

                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6">
                <PlanSidebarCard
                  storeId={selectedStore?.id}
                />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="lg:pl-[238px]">
        <DashboardHeader
          section={section}
          title={pageTitle}
          storeSlug={storeSlug}
          storeId={selectedStore?.id}
          onOpenMobileMenu={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="min-h-[calc(100vh-68px)] p-4 sm:p-6 lg:p-8">
          <DashboardContent
            section={section}
            storeId={selectedStore?.id}
            storeSlug={storeSlug}
          />
        </main>
      </div>
    </div>
  );
}
