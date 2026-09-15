import { ArrowUpRight } from "lucide-react";

import { trpc } from "@/lib/trpc";

type UsersPanelProps = {
  search: string;
};

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

export default function UsersPanel({
  search,
}: UsersPanelProps) {
  const usersQuery = trpc.admin.users.list.useQuery();

  const users = (usersQuery.data ?? []).filter(
    ({ user, stores, latestApplication }) =>
      `${user.name ?? ""} ${
        user.email ?? ""
      } ${stores
        .map(({ store }) => store.name)
        .join(" ")} ${
        latestApplication?.status ?? ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  if (usersQuery.isLoading) {
    return (
      <div className="px-5 py-4 text-[10px] text-[#748074]">
        A carregar utilizadores...
      </div>
    );
  }

  if (usersQuery.isError) {
    return (
      <div className="px-5 py-4 text-[10px] text-[#aa7429]">
        <div className="font-bold">
          Erro ao carregar utilizadores
        </div>

        <div className="mt-1 break-words">
          {usersQuery.error?.message ||
            "Erro desconhecido ao consultar os utilizadores."}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="px-5 py-4 text-[10px] text-[#748074]">
        Nenhum utilizador encontrado.
      </div>
    );
  }

  return (
    <>
      {users.map((entry) => {
        const primaryStore = entry.stores[0];

        return (
          <div
            key={entry.user.id}
            className="grid grid-cols-[1.4fr_1.2fr_.8fr_1fr_.7fr_34px] items-center gap-4 border-b border-[#edf1eb] px-5 py-3.5 text-[10px] last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#e9f2e5] text-[9px] font-bold text-[#58754c]">
                {(entry.user.name ??
                  entry.user.email ??
                  "U")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <div className="font-semibold">
                  {entry.user.name ?? "Sem nome"}
                </div>

                <div className="mt-1 text-[9px] text-[#98a398]">
                  utilizador #{entry.user.id}
                </div>
              </div>
            </div>

            <span className="text-[#748074]">
              {entry.user.email ?? "—"}
            </span>

            <span className="font-semibold text-[#657464]">
              {primaryStore
                ? `${primaryStore.store.name} · ${
                    primaryStore.plan?.name ??
                    primaryStore.store.planKey
                  }`
                : "Sem loja"}
            </span>

            <span className="font-semibold">
              {entry.latestApplication
                ? `#${entry.latestApplication.id}`
                : "—"}
            </span>

            <span>
              <Status
                text={
                  primaryStore?.store.status ??
                  entry.latestApplication?.status ??
                  "sem loja"
                }
              />
            </span>

            {primaryStore ? (
              <a
                href={`/store/${primaryStore.store.slug}`}
                className="grid h-7 w-7 place-items-center rounded-full text-[#9aa69b] hover:bg-[#eff5ec] hover:text-[#58754c]"
                title="Abrir loja"
              >
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <span />
            )}
          </div>
        );
      })}
    </>
  );
}