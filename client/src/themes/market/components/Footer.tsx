import { Link } from "wouter";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

type FooterProps = {
  storeName?: string;
  storeSlug?: string;
};

export function Footer({
  storeName = "Market",
  storeSlug,
}: FooterProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  const homePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/market";

  return (
    <footer className="bg-[#0b3d2e] text-emerald-50">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* MARCA */}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-base font-black text-white">
                M
              </div>

              <span className="text-lg font-black tracking-tight text-white">
                {storeName}
              </span>
            </div>

            <p className="mt-3 max-w-xs text-sm leading-6 text-emerald-100/70">
              Tudo o que precisa, num só lugar.
              Produtos selecionados com entrega
              rápida em todo o país.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-emerald-500"
              >
                <Facebook size={16} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-emerald-500"
              >
                <Instagram size={16} />
              </a>

              <Link
                href={`/themes/market/mensagens${storeContext}`}
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-emerald-500"
              >
                <MessageCircle size={16} />
              </Link>
            </div>
          </div>

          {/* DEPARTAMENTOS */}

          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
              Departamentos
            </h3>

            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/80">
              <li>Eletrónica</li>
              <li>Moda</li>
              <li>Casa</li>
              <li>Acessórios</li>
              <li>Desporto</li>
            </ul>
          </div>

          {/* AJUDA */}

          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
              Ajuda
            </h3>

            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link
                  href={`/themes/market/conta${storeContext}`}
                  className="transition hover:text-white"
                >
                  Informações da loja
                </Link>
              </li>

              <li>
                <Link
                  href={`/themes/market/mensagens${storeContext}`}
                  className="transition hover:text-white"
                >
                  Atendimento
                </Link>
              </li>

              <li>Entregas e prazos</li>
              <li>Devoluções</li>
              <li>Perguntas frequentes</li>
            </ul>
          </div>

          {/* CONTACTO */}

          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
              Contacto
            </h3>

            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/80">
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0" />
                Maputo, Moçambique
              </li>

              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0" />
                apoio@market.co.mz
              </li>
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {["M-Pesa", "e-Mola", "VISA"].map(
                (method) => (
                  <span
                    key={method}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white"
                  >
                    {method}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-emerald-100/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            {storeName}. Todos os direitos
            reservados.
          </p>

          <p className="flex items-center gap-1.5">
            Compra segura
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
            Entrega em 24h
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
