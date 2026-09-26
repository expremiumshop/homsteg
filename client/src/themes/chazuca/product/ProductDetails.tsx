import {
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  chazucaColors,
  chazucaBodyFont,
} from "../theme";

type ProductDetailsProps = {
  product?: {
    description?: string | null;
  };
};

export function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <div
      className="divide-y rounded-3xl border px-5"
      style={{
        borderColor:
          chazucaColors.border,
        fontFamily: chazucaBodyFont,
      }}
    >
      {/* DESCRIÇÃO */}

      <div
        className="py-5"
        style={{
          borderColor:
            chazucaColors.border,
        }}
      >
        <h3
          className="text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{
            color: chazucaColors.text,
          }}
        >
          Descrição
        </h3>

        <p
          className="mt-2.5 text-sm leading-7"
          style={{
            color:
              chazucaColors.textMuted,
          }}
        >
          {product?.description ||
            "Peça disponível nesta loja Chazuca. Fale connosco para mais informações."}
        </p>
      </div>

      {/* ENTREGA */}

      <div
        className="flex items-center gap-3 py-4"
        style={{
          borderColor:
            chazucaColors.border,
        }}
      >
        <Truck
          size={17}
          strokeWidth={1.5}
          className="shrink-0"
          style={{
            color: chazucaColors.text,
          }}
        />

        <p
          className="text-sm"
          style={{
            color:
              chazucaColors.textMuted,
          }}
        >
          Entregas em todo o território
          nacional · Prazo confirmado pela
          nossa equipa após o pedido
        </p>
      </div>

      {/* TROCA */}

      <div
        className="flex items-center gap-3 py-4"
        style={{
          borderColor:
            chazucaColors.border,
        }}
      >
        <RefreshCw
          size={17}
          strokeWidth={1.5}
          className="shrink-0"
          style={{
            color: chazucaColors.text,
          }}
        />

        <p
          className="text-sm"
          style={{
            color:
              chazucaColors.textMuted,
          }}
        >
          Troca ou devolução em até 7
          dias
        </p>
      </div>

      {/* GARANTIA */}

      <div
        className="flex items-center gap-3 py-4"
        style={{
          borderColor:
            chazucaColors.border,
        }}
      >
        <ShieldCheck
          size={17}
          strokeWidth={1.5}
          className="shrink-0"
          style={{
            color: chazucaColors.text,
          }}
        />

        <p
          className="text-sm"
          style={{
            color:
              chazucaColors.textMuted,
          }}
        >
          Pagamento na entrega ou por
          M-Pesa / e-Mola
        </p>
      </div>
    </div>
  );
}

export default ProductDetails;
