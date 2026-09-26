import {
  Image as ImageIcon,
  Star,
} from "lucide-react";

export function ReviewsSection() {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
      {/* TÍTULO */}
      <h2 className="text-2xl font-black tracking-tight text-slate-950">
        Avaliações do produto
      </h2>

      {/* RESUMO */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* NOTA */}
        <div className="text-center">
          <p className="text-5xl font-black tracking-tight text-slate-950">
            4.8
          </p>

          <div className="my-3 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(
              (i) => (
                <Star
                  key={i}
                  className="h-4.5 w-4.5 fill-amber-400 text-amber-400"
                />
              ),
            )}
          </div>

          <p className="text-xs font-semibold text-slate-400">
            Avaliação média
          </p>
        </div>

        {/* BARRAS */}
        <div className="space-y-3 md:col-span-2">
          {[
            "5 estrelas",
            "4 estrelas",
            "3 estrelas",
            "2 estrelas",
            "1 estrela",
          ].map(
            (item, index) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <span className="w-20 shrink-0 text-xs font-semibold text-slate-600">
                  {item}
                </span>

                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width:
                        index === 0
                          ? "85%"
                          : "10%",
                    }}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* COMENTÁRIOS */}
      <div className="pt-2">
        <h3 className="text-sm font-black text-slate-950">
          Comentários dos clientes
        </h3>

        <div className="mt-3 rounded-2xl bg-slate-50 p-5 text-sm text-slate-400">
          Ainda não existem avaliações.
          <br />
          Quando clientes avaliarem este
          produto, elas aparecerão aqui.
        </div>
      </div>

      {/* FOTOS */}
      <div className="pt-2">
        <div className="flex items-center gap-2 text-sm font-black text-slate-950">
          <ImageIcon className="h-4.5 w-4.5" />
          Fotos dos clientes
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="aspect-square rounded-xl bg-slate-100"
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
