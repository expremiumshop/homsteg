import {
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

type ProductDetailsProps = {
  product?: {
    description?: string | null;
  };
};

export function ProductDetails({
  product,
}: ProductDetailsProps) {
  return (
    <div className="space-y-4">
      {/* DESCRIÇÃO */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
          Descrição
        </h3>

        <p className="mt-2.5 text-sm leading-7 text-slate-500">
          {product?.description ||
            "Produto disponível nesta loja Market. Entre em contacto connosco para mais informações."}
        </p>
      </div>

      {/* ENTREGA */}

      <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Truck size={19} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900">
            Entrega rápida
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Entregas em 24 horas nas
            principais cidades. Grátis em
            compras acima de 5.000 MT.
          </p>
        </div>
      </div>

      {/* DEVOLUÇÃO */}

      <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <RotateCcw size={19} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900">
            Devolução fácil
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Devolva em até 7 dias se o
            produto não corresponder ao
            anunciado.
          </p>
        </div>
      </div>

      {/* GARANTIA */}

      <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <ShieldCheck size={19} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-black text-slate-900">
            Compra garantida
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Pagamento confirmado na entrega
            ou por M-Pesa / e-Mola com
            total segurança.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <PackageCheck size={15} />
        Produto verificado pela equipa
        Market
      </div>
    </div>
  );
}

export default ProductDetails;
