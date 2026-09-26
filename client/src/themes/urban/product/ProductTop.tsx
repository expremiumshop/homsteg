import { ShieldCheck, Share2 } from "lucide-react";

import type {
  UrbanProduct,
} from "../demoData";

type ProductTopProps = {
  product: UrbanProduct;
};

export function ProductTop({
  product,
}: ProductTopProps) {
  return (
    <div className="w-full min-w-0 space-y-5">
      {/* CATEGORIA */}
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
        {product.category}
      </p>

      {/* NOME DO PRODUTO */}
      <h1
        title={product.name}
        className="block w-full min-w-0 max-w-full break-words text-3xl font-black leading-[1.05] tracking-[-0.035em] text-neutral-950 md:text-4xl"
      >
        {product.name}
      </h1>

      {/* STATUS + COMPARTILHAR */}
      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 max-w-full items-center gap-2.5 rounded-full bg-neutral-100 px-4 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-950" />

          <p className="min-w-0 max-w-full break-words text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-700">
            Fornecedor verificado
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-neutral-500 transition hover:text-neutral-950 active:scale-95"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </button>
      </div>
    </div>
  );
}

export default ProductTop;
