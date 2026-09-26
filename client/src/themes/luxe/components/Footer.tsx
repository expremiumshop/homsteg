import { Crown, MapPin } from "lucide-react";

import { Link } from "wouter";

import { footerColumns } from "../demoData";

type FooterProps = {
  storeName?: string;
  storeSlug?: string;
};

export function Footer({
  storeName = "LUXE",
  storeSlug,
}: FooterProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-slate-200 pb-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Crown className="h-5 w-5" />
              </div>

              <div>
                <div className="text-xl font-black tracking-[0.22em] text-slate-950">
                  {storeName}
                </div>

                <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  Marketplace
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              Um marketplace moderno para
              descobrir produtos que combinam
              qualidade, estilo e
              personalidade.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <MapPin className="h-4 w-4" />
              Moçambique
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map(
              (column, columnIndex) => (
                <div key={column.title}>
                  <h3 className="text-xs font-black uppercase tracking-wide text-slate-950">
                    {column.title}
                  </h3>

                  <div className="mt-4 space-y-3">
                    {column.links.map(
                      (link, linkIndex) => {
                        // Ligações funcionais
                        // para as páginas Luxe.
                        const href =
                          columnIndex === 1 &&
                          (link ===
                            "Central de ajuda" ||
                            link ===
                              "Contacte-nos")
                            ? `/themes/luxe/mensagens${storeContext}`
                            : `/themes/luxe/conta${storeContext}`;

                        return (
                          <Link
                            key={link}
                            href={
                              columnIndex ===
                                0 &&
                              linkIndex === 0
                                ? `/themes/luxe${storeContext}`
                                : href
                            }
                            className="block text-xs text-slate-500 transition hover:text-red-500"
                          >
                            {link}
                          </Link>
                        );
                      },
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {storeName}{" "}
            Marketplace. Todos os direitos
            reservados.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href={`/themes/luxe/conta${storeContext}`}
            >
              Privacidade
            </Link>

            <Link
              href={`/themes/luxe/conta${storeContext}`}
            >
              Termos
            </Link>

            <Link
              href={`/themes/luxe/conta${storeContext}`}
            >
              Cookies
            </Link>

            <span>Moçambique · MZN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
