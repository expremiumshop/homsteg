import { Rocket } from "lucide-react";

import type {} from "../../../registry";

/* =========================================================
   MARKET — ESTOQUE 5 (+500 produtos)
   Pacote de capacidade extra de produtos.
   Toda loja começa com 50 grátis; este pacote soma
   +500 produtos à capacidade total da loja.
   ========================================================= */

export default function Stock5() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
        <Rocket className="h-6 w-6 text-rose-600" />
      </span>

      <div className="min-w-0">
        <p className="text-lg font-black leading-none text-[#111713]">
          +500 produtos
        </p>

        <p className="mt-1.5 text-xs leading-5 text-gray-500">
          Pacote Turbo — soma 500 produtos à
          capacidade da tua loja.
        </p>
      </div>
    </div>
  );
}
