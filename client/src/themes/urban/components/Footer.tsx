import { Logo } from "./Logo";

type FooterProps = {
  storeName: string;
};

export function Footer({ storeName }: FooterProps) {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo storeName={storeName} />

            <p className="mt-6 max-w-[430px] text-sm leading-7 text-white/45">
              Uma experiência de compra moderna, simples e
              pensada para pessoas que valorizam estilo,
              qualidade e personalidade.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
              Loja
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Todos os produtos",
                "Novidades",
                "Mais vendidos",
                "Ofertas",
              ].map((item) => (
                <button
                  type="button"
                  key={item}
                  className="block text-sm text-white/65 transition hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
              Ajuda
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Contactos",
                "Entrega",
                "Trocas",
                "Privacidade",
              ].map((item) => (
                <button
                  type="button"
                  key={item}
                  className="block text-sm text-white/65 transition hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/35 md:flex-row">
          <span>
            © {new Date().getFullYear()} {storeName}. Todos os
            direitos reservados.
          </span>

          <span>Powered by HOMSTEG</span>
        </div>
      </div>
    </footer>
  );
}
