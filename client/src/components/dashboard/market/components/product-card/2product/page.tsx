import type {} from "../../../registry";

/* =========================================================
   MARKET — PRODUCT CARD 2 (Compacto)
   Cartão quadrado, imagem e preço em destaque.

   Pré-visualização estrutural: o `product` aqui é
   apenas um item de demo da loja, não um produto
   comercial do catálogo Market.
   ========================================================= */

type DemoProduct = {
  name: string;
  price: number;
  imageUrl?: string | null;
};

function formatMzn(value: number) {
  return `${value.toLocaleString("pt-MZ")} MT`;
}

export default function Product2({
  product,
}: {
  product?: DemoProduct;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-emerald-600">
      <div className="aspect-square bg-gray-100">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-gray-400">
            Imagem
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-[#111713]">
          {product?.name ?? "Nome do produto"}
        </h3>

        <span className="mt-1 block text-base font-black text-[#111713]">
          {formatMzn(product?.price ?? 0)}
        </span>
      </div>
    </div>
  );
}
