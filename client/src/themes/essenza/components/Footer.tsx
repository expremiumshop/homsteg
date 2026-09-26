import { Link } from "wouter";

import { Instagram } from "lucide-react";

type FooterProps = {
  storeName?: string;
  storeSlug?: string;
};

export function Footer({
  storeName = "Essenza",
  storeSlug,
}: FooterProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* MARCA */}

          <div className="min-w-0">
            <span
              className="text-2xl tracking-[0.08em] text-white"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                fontWeight: 600,
              }}
            >
              {storeName}
            </span>

            <p className="mt-4 max-w-xs text-[13px] leading-6 text-neutral-400">
              Design atemporal, materiais
              honestos e o essencial em cada
              detalhe.
            </p>

            <a
              href="#"
              aria-label="Instagram"
              className="mt-5 inline-flex h-9 w-9 items-center justify-center border border-neutral-800 text-neutral-300 transition hover:border-white hover:text-white"
            >
              <Instagram size={15} />
            </a>
          </div>

          {/* LOJA */}

          <div className="min-w-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              Loja
            </h3>

            <ul className="mt-4 space-y-2.5 text-[13px] text-neutral-400">
              {["Moda", "Beleza", "Acessórios", "Joias", "Casa"].map(
                (item) => (
                  <li key={item}>
                    <span className="transition hover:text-white">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* AJUDA */}

          <div className="min-w-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              Ajuda
            </h3>

            <ul className="mt-4 space-y-2.5 text-[13px] text-neutral-400">
              <li>
                <Link
                  href={`/themes/essenza/conta${storeContext}`}
                  className="transition hover:text-white"
                >
                  Informações da loja
                </Link>
              </li>

              <li>
                <Link
                  href={`/themes/essenza/mensagens${storeContext}`}
                  className="transition hover:text-white"
                >
                  Atendimento
                </Link>
              </li>

              <li>
                <span className="transition hover:text-white">
                  Entregas e prazos
                </span>
              </li>

              <li>
                <span className="transition hover:text-white">
                  Trocas e devoluções
                </span>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}

          <div className="min-w-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              Contacto
            </h3>

            <ul className="mt-4 space-y-2.5 text-[13px] text-neutral-400">
              <li>Maputo, Moçambique</li>

              <li>ola@essenza.co.mz</li>

              <li>Seg–Sáb · 8h–18h</li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {["M-Pesa", "e-Mola", "VISA"].map(
                (method) => (
                  <span
                    key={method}
                    className="border border-neutral-800 px-2.5 py-1 text-[10px] uppercase tracking-wider text-neutral-300"
                  >
                    {method}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-6 text-[11px] text-neutral-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            {storeName}. Todos os direitos
            reservados.
          </p>

          <p>Menos, mas melhor.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
