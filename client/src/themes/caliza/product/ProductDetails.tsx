import {
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  calizaColors,
  calizaBodyFont,
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
      className="divide-y rounded-2xl border px-5"
      style={{
        borderColor:
          calizaColors.border,
        fontFamily: calizaBodyFont,
      }}
    >
      {/* DESCRIÇÃO */}

      <div
        className="py-5"
        style={{
          borderColor:
            calizaColors.border,
        }}
      >
        <h3
          className="text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{
            color: calizaColors.text,
          }}
        >
          Descrição
        </h3>

        <p
          className="mt-2.5 text-sm leading-7"
          style={{
            color:
              calizaColors.textMuted,
          }}
        >
          {product?.description ||
            "Peça disponível nesta loja Caliza. Fale connosco para mais informações."}
        </p>
      </div>

      {/* ENTREGA */}

      <div
        className="flex items-center gap-3 py-4"
        style={{
          borderColor:
            calizaColors.border,
        }}
      >
        <Truck
          size={17}
          strokeWidth={1.5}
          className="shrink-0"
          style={{
            color: calizaColors.text,
          }}
        />

        <p
          className="text-sm"
          style={{
            color:
              calizaColors.textMuted,
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
            calizaColors.border,
        }}
      >
        <RefreshCw
          size={17}
          strokeWidth={1.5}
          className="shrink-0"
          style={{
            color: calizaColors.text,
          }}
        />

        <p
          className="text-sm"
          style={{
            color:
              calizaColors.textMuted,
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
            calizaColors.border,
        }}
      >
        <ShieldCheck
          size={17}
          strokeWidth={1.5}
          className="shrink-0"
          style={{
            color: calizaColors.text,
          }}
        />

        <p
          className="text-sm"
          style={{
            color:
              calizaColors.textMuted,
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
