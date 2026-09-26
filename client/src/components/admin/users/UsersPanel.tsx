import { useState } from "react";

import {
  ArrowUpRight,
  Eye,
  Power,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { trpc } from "@/lib/trpc";
import {
  getPublicStoreUrl,
} from "@/lib/store-url";

type UsersPanelProps = {
  search: string;
};

function Status({ text }: { text: string }) {
  const normalized = text.toLowerCase();

  const isActive =
    normalized === "active" ||
    normalized === "activa" ||
    normalized === "approved" ||
    normalized === "aprovada";

  const isSuspended =
    normalized === "suspended" ||
    normalized === "suspensa";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${
        isActive
          ? "bg-[#eef7e7] text-[#648e31]"
          : isSuspended
            ? "bg-[#fff0f0] text-[#a64b4b]"
            : "bg-[#fff7e8] text-[#aa7429]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive
            ? "bg-[#78a842]"
            : isSuspended
              ? "bg-[#c76868]"
              : "bg-[#c99a43]"
        }`}
      />

      {text}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  let displayValue = "—";

  if (Array.isArray(value)) {
    displayValue =
      value.length > 0
        ? value.join(", ")
        : "—";
  } else if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    displayValue = String(value);
  }

  return (
    <div className="flex min-h-[38px] items-center justify-between gap-6 py-2">
      <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.04em] text-[#98a398]">
        {label}
      </span>

      <span className="max-w-[70%] break-words text-right text-[10px] font-medium text-[#4f5d50]">
        {displayValue}
      </span>
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-3">
      <div className="text-[11px] font-bold text-[#465346]">
        {title}
      </div>

      {description && (
        <div className="mt-0.5 text-[9px] text-[#98a398]">
          {description}
        </div>
      )}
    </div>
  );
}

export default function UsersPanel({
  search,
}: UsersPanelProps) {
  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);

  const usersQuery =
    trpc.admin.users.list.useQuery();

  const activateStore =
    trpc.admin.stores.activate.useMutation();

  const suspendStore =
    trpc.admin.stores.suspend.useMutation();

  const deleteStore =
    trpc.admin.stores.delete.useMutation();

  const deleteUser =
    trpc.admin.users.delete.useMutation();

  const users = (usersQuery.data ?? []).filter(
    ({
      user,
      stores,
      latestApplication,
    }) =>
      `${user.name ?? ""} ${
        user.email ?? ""
      } ${stores
        .map(
          ({ store }) =>
            store.name,
        )
        .join(" ")} ${
        latestApplication?.status ??
        ""
      }`
        .toLowerCase()
        .includes(
          search.toLowerCase(),
        ),
  );

  async function refreshUsers() {
    await usersQuery.refetch();
  }

  async function handleActivate(
    storeId: string,
  ) {
    try {
      await activateStore.mutateAsync({
        storeId,
      });

      await refreshUsers();
    } catch (error) {
      console.error(
        "Erro ao activar loja:",
        error,
      );
    }
  }

  async function handleSuspend(
    storeId: string,
  ) {
    try {
      await suspendStore.mutateAsync({
        storeId,
      });

      await refreshUsers();
    } catch (error) {
      console.error(
        "Erro ao suspender loja:",
        error,
      );
    }
  }

  async function handleDeleteStore(
    storeId: string,
    storeName: string,
  ) {
    const confirmed =
      window.confirm(
        `Tem certeza que deseja eliminar a loja "${storeName}"?\n\nEsta acção não pode ser desfeita.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStore.mutateAsync({
        storeId,
      });

      setSelectedUserId(null);

      await refreshUsers();
    } catch (error) {
      console.error(
        "Erro ao eliminar loja:",
        error,
      );
    }
  }

  async function handleDeleteUser(
    userId: number,
    userName: string,
  ) {
    const confirmed =
      window.confirm(
        `Tem certeza que deseja eliminar o utilizador "${userName}"?\n\nA eliminação também removerá as lojas, produtos e candidaturas associadas a este utilizador.\n\nEsta acção não pode ser desfeita.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser.mutateAsync({
        userId,
      });

      setSelectedUserId(null);

      await refreshUsers();
    } catch (error) {
      console.error(
        "Erro ao eliminar utilizador:",
        error,
      );
    }
  }

  if (usersQuery.isLoading) {
    return (
      <div className="flex items-center justify-center px-6 py-12">
        <div className="text-[10px] font-medium text-[#879287]">
          A carregar utilizadores...
        </div>
      </div>
    );
  }

  if (usersQuery.isError) {
    return (
      <div className="mx-5 my-4 rounded-[12px] bg-[#fff8ee] px-4 py-4">
        <div className="text-[10px] font-bold text-[#aa7429]">
          Erro ao carregar utilizadores
        </div>

        <div className="mt-1 break-words text-[9px] text-[#9b8a70]">
          {usersQuery.error?.message ||
            "Erro desconhecido ao consultar os utilizadores."}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#f1f5ef] text-[#80917d]">
          <UserRound size={17} />
        </div>

        <div className="text-[11px] font-semibold text-[#596559]">
          Nenhum utilizador encontrado
        </div>

        <div className="mt-1 text-[9px] text-[#9aa39a]">
          Tente alterar o termo de pesquisa.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* CABEÇALHO */}
      <div className="grid grid-cols-[1.45fr_1.3fr_1fr_.7fr_.7fr_92px] items-center gap-4 bg-[#f8faf7] px-5 py-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b978b]">
          Utilizador
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b978b]">
          Contacto
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b978b]">
          Loja
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b978b]">
          Pedido
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b978b]">
          Estado
        </span>

        <span className="text-right text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b978b]">
          Acções
        </span>
      </div>

      {/* UTILIZADORES */}
      {users.map((entry) => {
        const primaryStore =
          entry.stores[0];

        const isSelected =
          selectedUserId ===
          entry.user.id;

        const displayName =
          entry.user.name ??
          entry.user.email ??
          "Utilizador";

        return (
          <div
            key={entry.user.id}
            className="bg-white"
          >
            {/* LINHA PRINCIPAL */}
            <div
              className={`grid grid-cols-[1.45fr_1.3fr_1fr_.7fr_.7fr_92px] items-center gap-4 px-5 py-4 transition-colors ${
                isSelected
                  ? "bg-[#f7faf5]"
                  : "hover:bg-[#fbfcfa]"
              }`}
            >
              {/* UTILIZADOR */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#edf4e9] text-[10px] font-bold text-[#5d7755]">
                  {displayName
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-[10px] font-bold text-[#465346]">
                    {entry.user.name ??
                      "Sem nome"}
                  </div>

                  <div className="mt-0.5 text-[8px] text-[#a0a9a0]">
                    ID #{entry.user.id}
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div className="min-w-0 truncate text-[10px] text-[#788378]">
                {entry.user.email ??
                  "—"}
              </div>

              {/* LOJA */}
              <div className="min-w-0">
                {primaryStore ? (
                  <>
                    <div className="truncate text-[10px] font-semibold text-[#596759]">
                      {
                        primaryStore
                          .store.name
                      }
                    </div>

                    <div className="mt-0.5 truncate text-[8px] text-[#a0a9a0]">
                      {primaryStore
                        .plan
                        ?.name ??
                        primaryStore
                          .store
                          .planKey}
                    </div>
                  </>
                ) : (
                  <span className="text-[9px] text-[#a0a9a0]">
                    Sem loja
                  </span>
                )}
              </div>

              {/* PEDIDO */}
              <div className="text-[10px] font-semibold text-[#697569]">
                {entry.latestApplication
                  ? `#${entry.latestApplication.id}`
                  : "—"}
              </div>

              {/* ESTADO */}
              <div>
                <Status
                  text={
                    primaryStore
                      ?.store.status ??
                    entry
                      .latestApplication
                      ?.status ??
                    "sem loja"
                  }
                />
              </div>

              {/* ACÇÕES */}
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedUserId(
                      isSelected
                        ? null
                        : entry.user.id,
                    )
                  }
                  className={`grid h-8 w-8 place-items-center rounded-[8px] transition-colors ${
                    isSelected
                      ? "bg-[#e9f1e5] text-[#58754c]"
                      : "text-[#9aa49a] hover:bg-[#f0f4ee] hover:text-[#58754c]"
                  }`}
                  title="Ver informações"
                >
                  <Eye size={14} />
                </button>

                {primaryStore && (
                  <a
                    href={getPublicStoreUrl(
                      primaryStore.store.slug,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-8 w-8 place-items-center rounded-[8px] text-[#9aa49a] transition-colors hover:bg-[#f0f4ee] hover:text-[#58754c]"
                    title="Abrir loja"
                  >
                    <ArrowUpRight
                      size={14}
                    />
                  </a>
                )}

                <button
                  type="button"
                  disabled={
                    deleteUser.isPending
                  }
                  onClick={() =>
                    handleDeleteUser(
                      entry.user.id,
                      displayName,
                    )
                  }
                  className="grid h-8 w-8 place-items-center rounded-[8px] text-[#b06b6b] transition-colors hover:bg-[#fff0f0] hover:text-[#a64b4b] disabled:cursor-not-allowed disabled:opacity-40"
                  title="Eliminar utilizador"
                >
                  <Trash2
                    size={14}
                  />
                </button>
              </div>
            </div>

            {/* PAINEL DE DETALHES */}
            {isSelected && (
              <div className="bg-[#f8faf7] px-5 pb-5 pt-1">
                <div className="rounded-[14px] bg-white p-5 shadow-[0_4px_20px_rgba(50,70,50,0.05)]">
                  {/* TOPO DO DETALHE */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#edf4e9] text-[#58754c]">
                        <UserRound
                          size={17}
                        />
                      </div>

                      <div>
                        <div className="text-[12px] font-bold text-[#465346]">
                          Informações do utilizador
                        </div>

                        <div className="mt-0.5 text-[9px] text-[#98a398]">
                          Dados da conta, loja e pedido de criação.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedUserId(
                          null,
                        )
                      }
                      className="grid h-8 w-8 place-items-center rounded-[8px] text-[#9aa49a] transition-colors hover:bg-[#f1f4ef] hover:text-[#58754c]"
                      title="Fechar"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* INFORMAÇÕES PRINCIPAIS */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* UTILIZADOR */}
                    <div className="rounded-[11px] bg-[#fafcf9] px-4 py-3">
                      <SectionTitle
                        title="Conta"
                        description="Informações básicas do utilizador."
                      />

                      <DetailRow
                        label="Nome"
                        value={
                          entry.user.name
                        }
                      />

                      <DetailRow
                        label="E-mail"
                        value={
                          entry.user.email
                        }
                      />

                      <DetailRow
                        label="ID"
                        value={
                          entry.user.id
                        }
                      />

                      <DetailRow
                        label="Função"
                        value={
                          entry.user.role
                        }
                      />
                    </div>

                    {/* LOJA */}
                    <div className="rounded-[11px] bg-[#fafcf9] px-4 py-3">
                      <SectionTitle
                        title="Loja"
                        description="Informações actuais da loja."
                      />

                      {primaryStore ? (
                        <>
                          <DetailRow
                            label="Nome"
                            value={
                              primaryStore
                                .store
                                .name
                            }
                          />

                          <DetailRow
                            label="Slug"
                            value={
                              primaryStore
                                .store
                                .slug
                            }
                          />

                          <DetailRow
                            label="Plano"
                            value={
                              primaryStore
                                .plan
                                ?.name ??
                              primaryStore
                                .store
                                .planKey
                            }
                          />

                          <DetailRow
                            label="Estado"
                            value={
                              primaryStore
                                .store
                                .status
                            }
                          />

                          <DetailRow
                            label="Moeda"
                            value={
                              primaryStore
                                .store
                                .currency
                            }
                          />

                          <DetailRow
                            label="WhatsApp"
                            value={
                              primaryStore
                                .store
                                .whatsapp
                            }
                          />
                        </>
                      ) : (
                        <div className="py-5 text-center text-[9px] text-[#9aa39a]">
                          Este utilizador ainda não possui uma loja.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PEDIDO DE CRIAÇÃO */}
                  {entry.latestApplication && (
                    <div className="mt-4 rounded-[11px] bg-[#fafcf9] px-4 py-4">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <SectionTitle
                          title="Pedido de criação"
                          description={`Pedido #${entry.latestApplication.id}`}
                        />

                        <Status
                          text={
                            entry
                              .latestApplication
                              .status
                          }
                        />
                      </div>

                      <div className="grid gap-x-8 md:grid-cols-2">
                        <DetailRow
                          label="Nome completo"
                          value={
                            entry
                              .latestApplication
                              .fullName
                          }
                        />

                        <DetailRow
                          label="Username"
                          value={
                            entry
                              .latestApplication
                              .username
                          }
                        />

                        <DetailRow
                          label="Nome da loja"
                          value={
                            entry
                              .latestApplication
                              .storeName
                          }
                        />

                        <DetailRow
                          label="Slug"
                          value={
                            entry
                              .latestApplication
                              .storeSlug
                          }
                        />

                        <DetailRow
                          label="Tipo de negócio"
                          value={
                            entry
                              .latestApplication
                              .businessTypes
                          }
                        />

                        <DetailRow
                          label="Telefone"
                          value={
                            entry
                              .latestApplication
                              .phone
                          }
                        />

                        <DetailRow
                          label="Telefone alternativo"
                          value={
                            entry
                              .latestApplication
                              .alternativePhone
                          }
                        />

                        <DetailRow
                          label="WhatsApp"
                          value={
                            entry
                              .latestApplication
                              .whatsapp
                          }
                        />

                        <DetailRow
                          label="País"
                          value={
                            entry
                              .latestApplication
                              .country
                          }
                        />

                        <DetailRow
                          label="Província"
                          value={
                            entry
                              .latestApplication
                              .province
                          }
                        />

                        <DetailRow
                          label="Distrito"
                          value={
                            entry
                              .latestApplication
                              .district
                          }
                        />

                        <DetailRow
                          label="Bairro"
                          value={
                            entry
                              .latestApplication
                              .neighborhood
                          }
                        />

                        <DetailRow
                          label="Notas"
                          value={
                            entry
                              .latestApplication
                              .notes
                          }
                        />

                        <DetailRow
                          label="Notas do admin"
                          value={
                            entry
                              .latestApplication
                              .adminNotes
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* ACÇÕES DA LOJA */}
                  {primaryStore && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {primaryStore.store.status ===
                        "active" ? (
                          <button
                            type="button"
                            disabled={
                              suspendStore.isPending
                            }
                            onClick={() =>
                              handleSuspend(
                                primaryStore
                                  .store
                                  .id,
                              )
                            }
                            className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#fff6e8] px-3 text-[9px] font-bold text-[#aa7429] transition-colors hover:bg-[#ffefd3] disabled:opacity-50"
                          >
                            <Power
                              size={13}
                            />

                            {suspendStore.isPending
                              ? "A suspender..."
                              : "Suspender loja"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              activateStore.isPending
                            }
                            onClick={() =>
                              handleActivate(
                                primaryStore
                                  .store
                                  .id,
                              )
                            }
                            className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#eef7e7] px-3 text-[9px] font-bold text-[#648e31] transition-colors hover:bg-[#e5f2dc] disabled:opacity-50"
                          >
                            <Power
                              size={13}
                            />

                            {activateStore.isPending
                              ? "A activar..."
                              : "Activar loja"}
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={
                            deleteStore.isPending
                          }
                          onClick={() =>
                            handleDeleteStore(
                              primaryStore
                                .store
                                .id,
                              primaryStore
                                .store
                                .name,
                            )
                          }
                          className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#fff0f0] px-3 text-[9px] font-bold text-[#a64b4b] transition-colors hover:bg-[#ffe6e6] disabled:opacity-50"
                        >
                          <Trash2
                            size={13}
                          />

                          {deleteStore.isPending
                            ? "A eliminar..."
                            : "Eliminar loja"}
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={
                          deleteUser.isPending
                        }
                        onClick={() =>
                          handleDeleteUser(
                            entry.user.id,
                            displayName,
                          )
                        }
                        className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#a64b4b] px-3 text-[9px] font-bold text-white transition-colors hover:bg-[#934141] disabled:opacity-50"
                      >
                        <Trash2
                          size={13}
                        />

                        {deleteUser.isPending
                          ? "A eliminar..."
                          : "Eliminar utilizador"}
                      </button>
                    </div>
                  )}

                  {/* ELIMINAR UTILIZADOR SEM LOJA */}
                  {!primaryStore && (
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        disabled={
                          deleteUser.isPending
                        }
                        onClick={() =>
                          handleDeleteUser(
                            entry.user.id,
                            displayName,
                          )
                        }
                        className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#a64b4b] px-3 text-[9px] font-bold text-white transition-colors hover:bg-[#934141] disabled:opacity-50"
                      >
                        <Trash2
                          size={13}
                        />

                        {deleteUser.isPending
                          ? "A eliminar..."
                          : "Eliminar utilizador"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}