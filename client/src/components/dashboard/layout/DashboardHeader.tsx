import {
  Bell,
  ChevronRight,
  Menu,
  Store,
} from "lucide-react";
import { Link } from "wouter";
import HomstegLogo from "@/components/HomstegLogo";
import { trpc } from "@/lib/trpc";
import { getPublicStoreUrl } from "@/lib/store-url";
import { useStorePlan } from "@/components/dashboard/plan/useStorePlan";
import PlanBadge from "@/components/dashboard/plan/PlanBadge";
import { usePanelI18n } from "@/lib/panel-i18n-context";

type DashboardHeaderProps = {
  section: string;
  title: string;
  storeSlug?: string;
  storeId?: string;
  onOpenMobileMenu: () => void;
};

export default function DashboardHeader({
  section,
  title,
  storeSlug,
  storeId,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  const { t, language, setLanguage } = usePanelI18n();

  const userQuery = trpc.auth.me.useQuery();

  const { creditMzn } = useStorePlan(storeId);

  const user = userQuery.data;

  const userName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    t("head.user");

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? t("head.morning")
      : hour < 18
        ? t("head.afternoon")
        : t("head.evening");

  return (
    <header className="dashboard-header sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label={t("head.openMenu")}
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
          <Link
            href="/app"
            className="transition hover:text-slate-900"
          >
            {t("head.dashboard")}
          </Link>

          {section !== "home" && (
            <>
              <ChevronRight className="h-4 w-4" />

              <span className="font-medium text-slate-700">
                {title}
              </span>
            </>
          )}
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:hidden">
          <HomstegLogo size={30} iconOnly />
          <p className="truncate text-sm font-bold text-slate-950">
            {title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/*
          Idioma do PAINEL — atalho do Configurações →
          Idioma do painel. Grava em localStorage do
          dispositivo e nunca toca em stores.language.
        */}
        <div
          className="flex items-center gap-0.5 rounded-xl border border-slate-200 p-0.5"
          role="group"
          aria-label={t("head.language")}
        >
          {(["pt", "en"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              aria-pressed={language === code}
              aria-label={
                code === "pt" ? "Português" : "English"
              }
              className={
                language === code
                  ? "rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white"
                  : "rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:text-slate-900"
              }
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <PlanBadge
          creditMzn={creditMzn}
          className="hidden sm:inline-flex"
        />

        <div className="hidden text-right md:block">
          <p className="text-sm font-semibold text-slate-900">
            {greeting}, {userName} 👋
          </p>

          {user?.email && (
            <p className="text-xs text-slate-400">
              {user.email}
            </p>
          )}
        </div>

        <button
          type="button"
          aria-label={t("head.notifications")}
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-[19px] w-[19px]" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime-500" />
        </button>

        <a
          href={
            storeSlug
              ? getPublicStoreUrl(storeSlug)
              : "/app/branding"
          }
          target={storeSlug ? "_blank" : undefined}
          rel={storeSlug ? "noreferrer" : undefined}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
        >
          <Store className="h-4 w-4" />
          {t("head.viewStore")}
        </a>
      </div>
    </header>
  );
}
