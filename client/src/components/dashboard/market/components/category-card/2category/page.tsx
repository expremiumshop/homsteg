import { Grid2X2 } from "lucide-react";

import type {
  MarketCategory,
} from "../../../registry";

/* =========================================================
   MARKET — CATEGORY CARD 2 (Ícone)
   Cartão compacto com ícone e contagem.
   ========================================================= */

export default function Category2({
  category,
}: {
  category?: MarketCategory;
}) {
  return (
    <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-center transition hover:border-emerald-600">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-[#111713]">
        <Grid2X2 className="h-5 w-5" />
      </span>

      <span className="text-sm font-bold text-[#111713]">
        {category?.name ?? "Categoria"}
      </span>

      <span className="text-[11px] text-gray-400">
        {category ? "Ver produtos" : "12 produtos"}
      </span>
    </div>
  );
}
