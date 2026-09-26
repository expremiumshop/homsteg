import {
  BarChart3,
  Box,
  Globe2,
  LayoutDashboard,
  Menu,
  Palette,
  Settings2,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import PlanSidebarCard from "@/components/dashboard/plan/PlanSidebarCard";
import OverviewPage from "@/components/dashboard/overview/OverviewPage";
import ProductsPage from "@/components/dashboard/products/ProductsPage";
import CategoriesPage from "@/components/dashboard/categories/CategoriesPage";
import OrdersPage from "@/components/dashboard/orders/OrdersPage";
import CustomersPage from "@/components/dashboard/customers/CustomersPage";
import PaymentsPage from "@/components/dashboard/payments/PaymentsPage";
import ShippingPage from "@/components/dashboard/shipping/ShippingPage";
import MarketingPage from "@/components/dashboard/Marketing/MarketingPage";
import SettingsPage from "@/components/dashboard/Settings/SettingsPage";
import { trpc } from "@/lib/trpc";

export type DashboardSection =
  | "home"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "themes"
  | "payments"
  | "shipping"
  | "marketing"
  | "settings";

const mainNav = [
  {
    id: "home" as DashboardSection,
    label: "Início",
    icon: LayoutDashboard,
    path: "/app",
  },
  {
    id: "products" as DashboardSection,
    label: "Produtos",
    icon: Box,
    path: "/app/products",
  },
  {
    id: "categories" as DashboardSection,
    label: "Categorias",
    icon: Menu,
    path: "/app/categories",
  },
  {
    id: "orders" as DashboardSection,
    label: "Encomendas",
    icon: ShoppingCart,
    path: "/app/orders",
  },
  {
    id: "customers" as DashboardSection,
    label: "Clientes",
    icon: Users,
    path: "/app/customers",
  },
  {
    id: "themes" as DashboardSection,
    label: "Design e temas",
    icon: Palette,
    path: "/store/themes",
  },
  {
    id: "payments" as DashboardSection,
    label: "Pagamentos",
    icon: BarChart3,
    path: "/app/payments",
  },
  {
    id: "shipping" as DashboardSection,
    label: "Entrega",
    icon: Globe2,
    path: "/app/shipping",
  },
  {
    id: "marketing" as DashboardSection,
    label: "Marketing",
    icon: BarChart3,
    path: "/app/marketing",
  },
  {
    id: "settings" as DashboardSection,
    label: "Configurações",
    icon: Settings2,
    path: "/app/settings",
  },
];

function getSectionFromPath(path: string): DashboardSection {
  const section = path.split("/")[2];

  switch (section) {
    case "products":
      return "products";
    case "categories":
      return "categories";
    case "orders":
      return "orders";
    case "customers":
      return "customers";
    case "themes":
      return "themes";
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

export default function Dashboard() {
  const [location] = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const storesQuery = trpc.stores.mine.useQuery();

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

  const storeSlug = selectedStore?.slug;

  const section = getSectionFromPath(location);

  const currentNav =
    mainNav.find((item) => item.id === section) ??
    mainNav[0];

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#111713]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          navigation={mainNav}
          activeSection={section}
        >
          <PlanSidebarCard
            storeId={selectedStore?.id}
          />
        </DashboardSidebar>
      </div>

      {/* Mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <aside className="relative z-10 h-full w-[280px] bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111713] text-lg font-black text-white">
                  H
                </div>

                <span className="text-lg font-black tracking-tight">
                  HOMSTEG
                </span>

                <span className="h-2 w-2 rounded-full bg-lime-400" />
              </div>

              <button
                type="button"
                aria-label="Fechar menu"
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
                {mainNav.map((item) => {
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
          title={currentNav.label}
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
