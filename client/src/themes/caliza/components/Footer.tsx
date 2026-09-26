import { Link } from "wouter";

import { Instagram } from "lucide-react";

import {
  calizaColors,
  calizaHeadingFont,
  calizaBodyFont,
} from "../theme";

type FooterProps = {
  storeName?: string;
  storeSlug?: string;
};

export function Footer({
  storeName = "Caliza Studio",
  storeSlug,
}: FooterProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <footer
      style={{
        background:
          calizaColors.footerBg,
        color: calizaColors.footerText,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* MARCA */}

          <div className="min-w-0">
            <span
              className="text-2xl"
              style={{
                fontFamily:
                  calizaHeadingFont,
                fontWeight: 600,
              }}
            >
              {storeName}
            </span>

            <p className="mt-4 max-w-xs text-[13px] leading-6 opacity-75">
              Objetos e peças com alma de
              atelier, inspirados na
              paisagem mediterrânica.
            </p>

            <a
              href="#"
              aria-label="Instagram"
              className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
            >
              <Instagram size={15} />
            </a>
          </div>

          {/* LOJA */}

          <div className="min-w-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Loja
            </h3>

            <ul className="mt-4 space-y-2.5 text-[13px] opacity-80">
              {[
                "Cerâmica",
                "Arte",
                "Casa",
                "Moda",
                "Acessórios",
              ].map((item) => (
                <li key={item}>
                  <span className="transition hover:opacity-100">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* AJUDA */}

          <div className="min-w-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Ajuda
            </h3>

            <ul className="mt-4 space-y-2.5 text-[13px] opacity-80">
              <li>
                <Link
                  href={`/themes/caliza/conta${storeContext}`}
                  className="transition hover:opacity-100"
                >
                  Informações da loja
                </Link>
              </li>

              <li>
                <Link
                  href={`/themes/caliza/mensagens${storeContext}`}
                  className="transition hover:opacity-100"
                >
                  Atendimento
                </Link>
              </li>

              <li>
                <span className="transition hover:opacity-100">
                  Entregas e prazos
                </span>
              </li>

              <li>
                <span className="transition hover:opacity-100">
                  Trocas e devoluções
                </span>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}

          <div className="min-w-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Contacto
            </h3>

            <ul className="mt-4 space-y-2.5 text-[13px] opacity-80">
              <li>Maputo, Moçambique</li>

              <li>ola@calizastudio.co.mz</li>

              <li>Seg–Sáb · 8h–18h</li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "M-Pesa",
                "e-Mola",
                "VISA",
              ].map((method) => (
                <span
                  key={method}
                  className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-[11px] opacity-70 sm:flex-row">
          <p>
            ©{" "}
            {new Date().getFullYear()}{" "}
            {storeName}. Todos os direitos
            reservados.
          </p>

          <p>Beleza esculpida no simples.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
