import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";

export type DashboardNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

type DashboardSidebarProps = {
  navigation: DashboardNavItem[];
  activeSection: string;
  children?: ReactNode;
};

export default function DashboardSidebar({
  navigation,
  activeSection,
  children,
}: DashboardSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[238px] flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-[68px] items-center border-b border-gray-100 px-5">
        <Link href="/app" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111713] text-lg font-black text-white">
            H
          </div>

          <span className="text-lg font-black tracking-tight text-[#111713]">
            HOMSTEG
          </span>

          <span className="h-2 w-2 rounded-full bg-lime-400" />
        </Link>
      </div>

      {/* Navegação */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSection;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-lime-100 text-[#111713]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#111713]",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Atalhos */}
        <div className="mt-8">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
            Atalhos
          </p>

          <div className="space-y-1">
            <Link
              href="/app/orders"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#111713]"
            >
              <ShoppingCartIcon />
              <span>Encomendas</span>
            </Link>

            <Link
              href="/app/customers"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#111713]"
            >
              <UsersIcon />
              <span>Clientes</span>
            </Link>

            <Link
              href="/app/marketing"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#111713]"
            >
              <AnalyticsIcon />
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Plano */}
      <div className="border-t border-gray-100 p-3">
        {children ?? (
          <div className="rounded-2xl bg-[#111713] p-4 text-white">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">
                Plano atual
              </span>

              <span className="rounded-full bg-lime-300 px-2 py-0.5 text-[10px] font-bold text-[#111713]">
                FREE
              </span>
            </div>

            <p className="text-sm font-semibold">Comece a sua loja</p>

            <p className="mt-1 text-xs leading-5 text-gray-400">
              Evolua o seu plano quando a sua loja crescer.
            </p>
          </div>
        )}
      </div>

      {/* Utilizador */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
            US
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#111713]">
              Minha conta
            </p>

            <p className="truncate text-xs text-gray-500">
              Proprietário da loja
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ShoppingCartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-[18px] w-[18px]"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="19" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-[18px] w-[18px]"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-[18px] w-[18px]"
    >
      <path d="M4 19V5" />
      <path d="M4 19h17" />
      <rect x="7" y="11" width="3" height="5" rx="1" />
      <rect x="12" y="8" width="3" height="8" rx="1" />
      <rect x="17" y="5" width="3" height="11" rx="1" />
    </svg>
  );
}