import { ChevronRight } from "lucide-react";

import type {
  MarketCategory,
} from "../../../registry";

/* =========================================================
   MARKET — CATEGORY CARD 3 (Borda)
   Cartão claro com borda e seta lateral.
   ========================================================= */

export default function Category3({
  category,
}: {
  category?: MarketCategory;
}) {
  return (
    <div className="flex h-28 items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#111713]">
          {category?.name ?? "Categoria"}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Explorar categoria
        </p>
      </div>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white">
        <ChevronRight className="h-4 w-4 text-gray-500" />
      </span>
    </div>
  );
}
