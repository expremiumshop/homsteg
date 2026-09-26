import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  LogOut,
  Menu,
  Search,
  Store,
  Users,
  X,
} from "lucide-react";

import { trpc } from "@/lib/trpc";
import {
  getPublicStoreUrl,
  getStoreUrlLabel,
} from "@/lib/store-url";
import UsersPanel from "@/components/admin/users/UsersPanel";
import PlansPanel from "@/components/admin/plans/PlansPanel";

const adminNav = [
  { label: "Utilizadores", icon: Users },
  { label: "Lojas", icon: Store },
  { label: "Planos", icon: CreditCard },
];

export default function Admin() {
  const [active, setActive] = useState("Utilizadores");
  const [search, setSearch] = useState("");
  const [mobile, setMobile] = useState(false);

  const usersQuery = trpc.admin.users.list.useQuery();
  const users = usersQuery.data ?? [];

  const stores = users.flatMap(({ user, stores: userStores }) =>
    userStores.map(({ store }) => ({
      store,
      user,
    })),
  );

  const currentStores = stores.filter(({ store, user }) =>
    `${store.name} ${store.slug} ${store.status} ${user.name ?? ""} ${
      user.email ?? ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (!usersQuery.isError) {
      return;
    }

    const code = usersQuery.error?.data?.code;

    if (code === "UNAUTHORIZED" || code === "FORBIDDEN") {
      window.location.replace("/admin/login");
    }
  }, [usersQuery.isError, usersQuery.error]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("[Admin] Erro ao terminar sessão:", error);
    } finally {
      window.location.replace("/admin/login");
    }
  }

  if (usersQuery.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f7f2]">
        <div className="text-[11px] font-semibold text-[#748074]">
          A carregar administração...
        </div>
      </div>
    );
  }

  if (usersQuery.isError) {
    const code = usersQuery.error?.data?.code;

    if (code === "UNAUTHORIZED" || code === "FORBIDDEN") {
      return (
        <div className="grid min-h-screen place-items-center bg-[#f4f7f2] px-6">
          <div className="text-center">
            <div className="font-display text-[20px] font-semibold tracking-[-.05em]">
              Acesso restrito
            </div>

            <p className="mt-2 text-[11px] text-[#7d897e]">
              A redirecionar para o login do administrador...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f7f2] px-6">
        <div className="max-w-[420px] text-center">
          <div className="font-display text-[20px] font-semibold tracking-[-.05em]">
            Não foi possível carregar a administração
          </div>

          <p className="mt-2 text-[11px] text-[#7d897e]">
            {usersQuery.error?.message ??
              "Ocorreu um erro ao carregar os dados."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f2] text-[#141714]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[235px] flex-col border-r border-[#dfe7dc] bg-[#162016] px-4 py-5 text-white transition-transform ${
          mobile
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-9 flex items-center justify-between px-2">
          <a
            href="/"
            className="font-display text-[18px] font-bold tracking-[-.07em]"
          >
            HOMSTEG
            <span className="text-[#c8ff4a]">.</span>
          </a>

          <button
            type="button"
            onClick={() => setMobile(false)}
            className="lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[.18em] text-white/35">
          Platform admin
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActive(item.label);
                  setMobile(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-left text-[11px] font-semibold ${
                  active === item.label
                    ? "bg-[#c8ff4a] text-[#203016]"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#c8ff4a] text-[10px] font-bold text-[#233018]">
              AD
            </div>

            <div className="min-w-0">
              <div className="truncate text-[11px] font-bold">
                Admin HOMSTEG
              </div>

              <div className="text-[9px] text-white/40">
                Super admin
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-left text-[11px] font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={14} />
            Terminar sessão
          </button>
        </div>
      </aside>

      {mobile && (
        <button
          type="button"
          onClick={() => setMobile(false)}
          className="fixed inset-0 z-40 bg-black/25 lg:hidden"
          aria-label="Fechar menu"
        />
      )}

      <div className="lg:pl-[235px]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#dfe7dc] bg-[#f4f7f2]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobile(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#d7e1d4] bg-white lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={17} />
            </button>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8c998c]">
                Central platform
              </div>

              <div className="font-display text-[15px] font-semibold tracking-[-.04em]">
                {active}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-7">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#8c998d]">
              Central de administração
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-[-.06em]">
              {active}
            </h1>

            <p className="mt-2 text-[13px] text-[#7d897e]">
              {active === "Utilizadores"
                ? "Contas e lojas reais associadas."
                : active === "Planos"
                  ? "Planos, limites de produtos e pedidos de upgrade."
                  : "Lojas ativas criadas pelos utilizadores."}
            </p>
          </div>

          <div className="mb-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[14px] border border-[#e1e9df] bg-white p-4">
              <div className="text-[11px] text-[#899589]">
                Utilizadores
              </div>

              <div className="mt-4 font-display text-[23px] font-semibold tracking-[-.06em]">
                {users.length}
              </div>
            </div>

            <div className="rounded-[14px] border border-[#e1e9df] bg-white p-4">
              <div className="text-[11px] text-[#899589]">
                Lojas
              </div>

              <div className="mt-4 font-display text-[23px] font-semibold tracking-[-.06em]">
                {stores.length}
              </div>
            </div>
          </div>

          <div>
            {active === "Planos" ? (
              <PlansPanel />
            ) : (
            <div className="rounded-[14px] border border-[#e1e9df] bg-white">
              <div className="flex flex-col justify-between gap-3 border-b border-[#edf1eb] px-5 py-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-[12px] font-bold">
                    {active === "Utilizadores"
                      ? "Utilizadores e lojas"
                      : "Lojas ativas"}
                  </h2>

                  <p className="mt-1 text-[10px] text-[#8e998e]">
                    {active === "Utilizadores"
                      ? "Contas reais registadas na plataforma."
                      : "Lojas disponíveis na plataforma."}
                  </p>
                </div>

                <div className="flex w-full justify-end gap-2 sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aba0]"
                      size={13}
                    />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Pesquisar..."
                      className="h-8 w-full max-w-[180px] rounded-full border border-[#dfe7dc] bg-[#fafcfa] pl-8 pr-3 text-[10px] outline-none sm:w-[180px]"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[750px]">
                  {active === "Utilizadores" && (
                    <>
                      <div className="grid grid-cols-[1.4fr_1.2fr_1fr_.8fr_34px] gap-4 border-b border-[#edf1eb] px-5 py-3 text-[9px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
                        <span>Utilizador</span>
                        <span>E-mail</span>
                        <span>Loja / plano</span>
                        <span>Estado</span>
                        <span />
                      </div>

                      <UsersPanel search={search} />
                    </>
                  )}

                  {active === "Lojas" && (
                    <>
                      <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_34px] gap-4 border-b border-[#edf1eb] px-5 py-3 text-[9px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
                        <span>Loja</span>
                        <span>Utilizador</span>
                        <span>Endereço</span>
                        <span>Estado</span>
                        <span />
                      </div>

                      {currentStores.length === 0 && (
                        <div className="px-5 py-4 text-[10px] text-[#748074]">
                          Nenhuma loja encontrada.
                        </div>
                      )}

                      {currentStores.map(({ store, user }) => (
                        <div
                          key={store.id}
                          className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_34px] items-center gap-4 border-b border-[#edf1eb] px-5 py-3.5 text-[10px] last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#e9f2e5] text-[9px] font-bold text-[#58754c]">
                              {store.name
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div>
                              <div className="font-semibold">
                                {store.name}
                              </div>

                              <div className="mt-1 text-[9px] text-[#98a398]">
                                loja ativa
                              </div>
                            </div>
                          </div>

                          <span className="text-[#748074]">
                            {user.name ?? user.email ?? "Sem nome"}
                          </span>

                          <span className="font-semibold text-[#657464]">
                            {getStoreUrlLabel(store.slug)}
                          </span>

                          <span>
                            <Status text={store.status} />
                          </span>

                          <a
                            href={getPublicStoreUrl(store.slug)}
                            className="grid h-7 w-7 place-items-center rounded-full text-[#9aa69b] hover:bg-[#eff5ec] hover:text-[#58754c]"
                            title="Abrir loja"
                          >
                            <ArrowUpRight size={14} />
                          </a>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Status({ text }: { text: string }) {
  const normalized = text.toLowerCase();

  const isPositive =
    normalized === "active" ||
    normalized === "activa" ||
    normalized === "approved" ||
    normalized === "aprovada";

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold ${
        isPositive
          ? "bg-[#eaf6cf] text-[#648e31]"
          : "bg-[#fff0d7] text-[#aa7429]"
      }`}
    >
      {text}
    </span>
  );
}