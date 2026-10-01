import { Plus } from "lucide-react";

import type {
  MarketCategory,
} from "../../../registry";

/* =========================================================
   MARKET — PRODUCT CARD 1 (Elevado)
   Cartão com sombra suave e botão de compra.

   Pré-visualização estrutural: o `product` aqui é
   apenas um item de demo da loja, não um produto
   comercial do catálogo Market.
   ========================================================= */

type DemoProduct = {
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
};

function formatMzn(value: number) {
  return `${value.toLocaleString("pt-MZ")} MT`;
}

export default function Product1({
  product,
}: {
  product?: DemoProduct;
}) {
  return (
    <div className="flex h-72 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative flex h-40 items-center justify-center bg-gray-100">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-gray-400">
            Imagem
          </span>
        )}

        <span className="absolute left-2 top-2 rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold text-[#111713]">
          Novo
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <span className="text-[11px] text-gray-400">
          {product?.category ?? "Categoria"}
        </span>

        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-[#111713]">
          {product?.name ?? "Nome do produto"}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-black text-emerald-700">
            {formatMzn(product?.price ?? 0)}
          </span>

          <button
            type="button"
            aria-label="Adicionar ao carrinho"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111713] text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
