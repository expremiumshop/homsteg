import {
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  essenzaFreeShippingThreshold,
  formatPrice,
} from "../demoData";

type ProductDetailsProps = {
  product?: {
    description?: string | null;
  };
};

export function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <div className="divide-y divide-neutral-100 border-y border-neutral-100">
      {/* DESCRIÇÃO */}

      <div className="py-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-950">
          Descrição
        </h3>

        <p className="mt-2.5 text-sm leading-7 text-neutral-500">
          {product?.description ||
            "Peça disponível nesta loja Essenza. Fale connosco para mais informações."}
        </p>
      </div>

      {/* ENTREGA */}

      <div className="flex items-center gap-3 py-4">
        <Truck
          size={17}
          strokeWidth={1.5}
          className="shrink-0 text-neutral-950"
        />

        <p className="text-sm text-neutral-600">
          Entrega em 24h nas principais
          cidades · Grátis acima de{" "}
          {formatPrice(
            essenzaFreeShippingThreshold,
          )}
        </p>
      </div>

      {/* TROCA */}

      <div className="flex items-center gap-3 py-4">
        <RefreshCw
          size={17}
          strokeWidth={1.5}
          className="shrink-0 text-neutral-950"
        />

        <p className="text-sm text-neutral-600">
          Troca ou devolução em até 7
          dias
        </p>
      </div>

      {/* GARANTIA */}

      <div className="flex items-center gap-3 py-4">
        <ShieldCheck
          size={17}
          strokeWidth={1.5}
          className="shrink-0 text-neutral-950"
        />

        <p className="text-sm text-neutral-600">
          Pagamento na entrega ou por
          M-Pesa / e-Mola
        </p>
      </div>
    </div>
  );
}

export default ProductDetails;
