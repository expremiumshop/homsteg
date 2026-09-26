import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";
import {
  CLIENT_PLANS,
  type ClientPlanKey,
  getPlanProductLimitLabel,
} from "@/lib/plans";

const UPGRADEABLE_PLANS: ClientPlanKey[] = [
  "starter",
  "business",
  "professional",
  "enterprise",
];

export default function UpgradePlanModal({
  storeId,
  currentPlanKey,
  onClose,
}: {
  storeId: string;
  currentPlanKey: string;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] =
    useState<ClientPlanKey>("starter");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  const requestUpgrade =
    trpc.stores.plan.requestUpgrade.useMutation({
      onSuccess: () => {
        toast.success(
          "Pedido de upgrade enviado para aprovação.",
        );

        utils.stores.plan.current.invalidate();

        onClose();
      },
      onError: (mutationError) => {
        setError(
          mutationError.message ||
            "Não foi possível enviar o pedido.",
        );
      },
    });

  function handleSubmit() {
    setError("");

    requestUpgrade.mutate({
      storeId,
      requestedPlanKey: selectedPlan,
      note: note.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] sm:p-6">
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Pedir upgrade de plano
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              O novo limite é aplicado após
              aprovação do administrador.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 px-5 py-4">
          {UPGRADEABLE_PLANS.map((planKey) => {
            const plan =
              CLIENT_PLANS[planKey];

            const isCurrent =
              planKey === currentPlanKey;

            return (
              <button
                key={planKey}
                type="button"
                disabled={isCurrent}
                onClick={() =>
                  setSelectedPlan(planKey)
                }
                className={[
                  "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                  selectedPlan === planKey
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-slate-300",
                  isCurrent
                    ? "cursor-not-allowed opacity-50"
                    : "",
                ].join(" ")}
              >
                <span>
                  <span className="block text-sm font-bold text-slate-950">
                    {plan.name}
                  </span>

                  <span className="mt-0.5 block text-xs text-slate-500">
                    {getPlanProductLimitLabel(
                      planKey,
                    )}
                  </span>
                </span>

                <span
                  className={[
                    "h-4 w-4 rounded-full border-2",
                    selectedPlan === planKey
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-slate-300",
                  ].join(" ")}
                />
              </button>
            );
          })}

          <textarea
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            rows={3}
            placeholder="Nota para o administrador (opcional)"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              requestUpgrade.isPending
            }
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {requestUpgrade.isPending
              ? "A enviar..."
              : "Enviar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
