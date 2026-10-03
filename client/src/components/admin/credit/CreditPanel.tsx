import { useMemo, useState } from "react";

import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

import {
  formatCreditAmount,
  formatCredits,
} from "@/lib/plans";

/**
 * Gestão manual de crédito por loja (Admin).
 *
 * O crédito vive na loja (stores.creditMzn), não no
 * utilizador. O Admin seleciona uma loja e define o
 * saldo absoluto (Set) ou acrescenta/subtrai (Add).
 * Exemplo: Loja A +500 → dashboard mostra 500 créditos;
 * Loja B +1.000 → dashboard mostra 1.000 créditos.
 */
export default function CreditPanel() {
  const usersQuery =
    trpc.admin.credit.list.useQuery();

  const utils = trpc.useUtils();

  const users = usersQuery.data ?? [];

  const stores = useMemo(
    () =>
      users.flatMap(
        ({ user, stores: userStores }) =>
          userStores.map(({ store }) => ({
            store,
            ownerName: user.name ?? user.email ?? "Sem nome",
          })),
      ),
    [users],
  );

  const [selectedStoreId, setSelectedStoreId] =
    useState<string>("");

  const [amount, setAmount] = useState<string>("");

  const setCredit =
    trpc.admin.credit.set.useMutation({
      onSuccess: (result) => {
        toast.success(
          `Crédito definido: ${formatCredits(result.store.creditMzn)}.`,
        );

        void utils.admin.credit.list.invalidate();
        void utils.stores.usage.current.invalidate();
      },
      onError: (error) => {
        toast.error(
          error.message ||
            "Não foi possível definir o crédito.",
        );
      },
    });

  const addCredit =
    trpc.admin.credit.add.useMutation({
      onSuccess: (result) => {
        toast.success(
          `Novo saldo: ${formatCredits(result.store.creditMzn)}.`,
        );

        void utils.admin.credit.list.invalidate();
        void utils.stores.usage.current.invalidate();
      },
      onError: (error) => {
        toast.error(
          error.message ||
            "Não foi possível atualizar o crédito.",
        );
      },
    });

  const selected = stores.find(
    (entry) => entry.store.id === selectedStoreId,
  );

  const parsedAmount = Number.parseInt(amount, 10);

  const canSet =
    Boolean(selected) &&
    Number.isInteger(parsedAmount) &&
    parsedAmount >= 0 &&
    !setCredit.isPending;

  const canAdd =
    Boolean(selected) &&
    Number.isInteger(parsedAmount) &&
    parsedAmount !== 0 &&
    !addCredit.isPending;

  function handleSubmitAdd() {
    if (!selected || !canAdd) {
      return;
    }

    addCredit.mutate({
      storeId: selected.store.id,
      amountMzn: parsedAmount,
    });

    setAmount("");
  }

  function handleSubmitSet() {
    if (!selected || !canSet) {
      return;
    }

    setCredit.mutate({
      storeId: selected.store.id,
      creditMzn: parsedAmount,
    });

    setAmount("");
  }

  if (usersQuery.isLoading) {
    return (
      <div className="rounded-[14px] border border-[#e1e9df] bg-white p-5">
        <div className="text-[11px] text-[#899589]">
          A carregar lojas...
        </div>
      </div>
    );
  }

  if (usersQuery.isError) {
    return (
      <div className="rounded-[14px] border border-[#e1e9df] bg-white p-5">
        <div className="text-[11px] text-[#aa7429]">
          Não foi possível carregar as lojas.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Gestão manual */}
      <div className="rounded-[14px] border border-[#e1e9df] bg-white p-5">
        <div className="mb-4">
          <h2 className="text-[12px] font-bold">
            Gestão manual de crédito
          </h2>

          <p className="mt-1 text-[10px] text-[#8e998e]">
            Seleciona uma loja e define ou acrescenta
            créditos. O saldo é exibido no dashboard
            da loja como "Créditos: N".
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
              Loja
            </span>

            <select
              value={selectedStoreId}
              onChange={(event) =>
                setSelectedStoreId(event.target.value)
              }
              className="mt-1.5 h-9 w-full rounded-[9px] border border-[#dfe7dc] bg-[#fafcfa] px-2 text-[11px] outline-none focus:border-[#c8ff4a]"
            >
              <option value="">
                Escolhe a loja...
              </option>

              {stores.map(({ store }) => (
                <option
                  key={store.id}
                  value={store.id}
                >
                  {store.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
              Valor (créditos)
            </span>

            <input
              type="number"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="Ex.: 500"
              className="mt-1.5 h-9 w-full rounded-[9px] border border-[#dfe7dc] bg-[#fafcfa] px-3 text-[11px] outline-none focus:border-[#c8ff4a]"
            />
          </label>

          <div className="flex items-end gap-2">
            <button
              type="button"
              disabled={!canAdd}
              onClick={handleSubmitAdd}
              className="h-9 flex-1 rounded-[9px] bg-[#162016] px-3 text-[11px] font-bold text-white transition hover:bg-[#243222] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Acrescentar
            </button>

            <button
              type="button"
              disabled={!canSet}
              onClick={handleSubmitSet}
              className="h-9 flex-1 rounded-[9px] border border-[#dfe7dc] bg-white px-3 text-[11px] font-bold text-[#203016] transition hover:bg-[#f4f7f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Definir
            </button>
          </div>
        </div>

        {selected && (
          <p className="mt-3 text-[10px] text-[#748074]">
            Saldo atual de{" "}
            <span className="font-bold">
              {selected.store.name}
            </span>
            :{" "}
            {formatCredits(
              selected.store.creditMzn,
            )}{" "}
            · Proprietário: {selected.ownerName}
          </p>
        )}
      </div>

      {/* Lista de lojas com saldos */}
      <div className="rounded-[14px] border border-[#e1e9df] bg-white">
        <div className="border-b border-[#edf1eb] px-5 py-4">
          <h2 className="text-[12px] font-bold">
            Lojas e saldos
          </h2>

          <p className="mt-1 text-[10px] text-[#8e998e]">
            Crédito atual de cada loja (0 = sem crédito).
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[1.4fr_1.2fr_1fr] gap-4 border-b border-[#edf1eb] px-5 py-3 text-[9px] font-bold uppercase tracking-[.13em] text-[#9ba69b]">
              <span>Loja</span>
              <span>Proprietário</span>
              <span>Créditos</span>
            </div>

            {stores.length === 0 && (
              <div className="px-5 py-4 text-[10px] text-[#748074]">
                Nenhuma loja encontrada.
              </div>
            )}

            {stores.map(({ store, ownerName }) => (
              <div
                key={store.id}
                className="grid grid-cols-[1.4fr_1.2fr_1fr] items-center gap-4 border-b border-[#edf1eb] px-5 py-3.5 text-[10px] last:border-0"
              >
                <span className="font-semibold text-[#141714]">
                  {store.name}
                </span>

                <span className="text-[#748074]">
                  {ownerName}
                </span>

                <span className="font-bold text-[#141714]">
                  {formatCreditAmount(store.creditMzn)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
