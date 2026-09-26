import {
  Crown,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Porquê Luxe?
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Uma experiência diferente.
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Crown className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900">
              Seleção premium
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Produtos selecionados com
              atenção aos detalhes e à
              qualidade.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900">
              Compra segura
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Uma experiência pensada para
              comprar com tranquilidade.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Truck className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900">
              Entrega nacional
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Enviamos os seus produtos para
              diferentes pontos de Moçambique.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Headphones className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900">
              Suporte próximo
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Uma equipa pronta para ajudar
              antes e depois da compra.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
