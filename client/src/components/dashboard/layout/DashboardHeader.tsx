import {
  Bell,
  ChevronRight,
  Menu,
  Store,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type DashboardHeaderProps = {
  section: string;
  title: string;
  storeSlug?: string;
  onOpenMobileMenu: () => void;
};

export default function DashboardHeader({
  section,
  title,
  storeSlug,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  const userQuery = trpc.auth.me.useQuery();

  const user = userQuery.data;

  const userName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Utilizador";

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Bom dia"
      : hour < 18
        ? "Boa tarde"
        : "Boa noite";

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menu"
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
            Dashboard
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

        <div className="sm:hidden">
          <p className="text-sm font-bold text-slate-950">
            {title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
          aria-label="Notificações"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-[19px] w-[19px]" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime-500" />
        </button>

        <Link
          href={storeSlug ? `/store/${storeSlug}` : "/store/themes"}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
        >
          <Store className="h-4 w-4" />
          Ver loja
        </Link>
      </div>
    </header>
  );
}
