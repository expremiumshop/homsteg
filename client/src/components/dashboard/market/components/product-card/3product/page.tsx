import { ChevronRight } from "lucide-react";

/* =========================================================
   MARKET — PRODUCT CARD 3 (Horizontal)
   Imagem à esquerda, detalhes à direita.

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

export default function Product3({
  product,
}: {
  product?: DemoProduct;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-emerald-600">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[10px] text-gray-400">
            Imagem
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[11px] text-gray-400">
          {product?.category ?? "Categoria"}
        </span>

        <h3 className="truncate text-sm font-bold text-[#111713]">
          {product?.name ?? "Nome do produto"}
        </h3>

        <span className="text-sm font-black text-emerald-700">
          {formatMzn(product?.price ?? 0)}
        </span>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
    </div>
  );
}
