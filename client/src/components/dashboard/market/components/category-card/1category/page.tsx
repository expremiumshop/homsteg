import { Image as ImageIcon } from "lucide-react";

import type {
  MarketCategory,
} from "../../../registry";

/* =========================================================
   MARKET — CATEGORY CARD 1 (Imagem)
   Cartão com imagem de fundo e nome sobreposto.
   ========================================================= */

export default function Category1({
  category,
}: {
  category?: MarketCategory;
}) {
  return (
    <div className="group relative h-28 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-[#111713]">
      {category?.imageUrl ? (
        <img
          src={category.imageUrl}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:scale-105"
        />
      ) : null}

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
        <span className="text-sm font-bold text-white">
          {category?.name ?? "Categoria"}
        </span>
      </div>

      {!category?.imageUrl && (
        <ImageIcon className="absolute right-3 top-3 h-4 w-4 text-white/50" />
      )}
    </div>
  );
}
