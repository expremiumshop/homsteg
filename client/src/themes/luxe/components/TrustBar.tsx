import {
  Headphones,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
        <div className="flex items-center gap-3 px-5 py-5">
          <Truck className="h-6 w-6 text-red-500" />

          <div>
            <p className="text-xs font-black text-slate-900">
              Entrega rápida
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Para todo Moçambique
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-5">
          <ShieldCheck className="h-6 w-6 text-red-500" />

          <div>
            <p className="text-xs font-black text-slate-900">
              Compra protegida
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Segurança em cada pedido
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-5">
          <PackageCheck className="h-6 w-6 text-red-500" />

          <div>
            <p className="text-xs font-black text-slate-900">
              Qualidade garantida
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Produtos selecionados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-5">
          <Headphones className="h-6 w-6 text-red-500" />

          <div>
            <p className="text-xs font-black text-slate-900">
              Suporte dedicado
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Estamos aqui para ajudar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBar;
