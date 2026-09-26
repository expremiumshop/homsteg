import {
  Clock3,
  Facebook,
  Instagram,
  Lock,
  Mail,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Store,
} from "lucide-react";

import { Link } from "wouter";

type FooterProps = {
  storeName: string;
  storeSlug?: string;
};

export function Footer({
  storeName,
  storeSlug,
}: FooterProps) {
  const storeContext = storeSlug
    ? `?storeSlug=${encodeURIComponent(storeSlug)}`
    : "";

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Store className="h-5 w-5" />
              </div>

              <div>
                <p className="font-black">
                  {storeName}
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-500">
                  Prime Store
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Uma experiência de compra moderna,
              simples e segura, criada para encontrar
              aquilo que você procura.
            </p>

            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, MessageCircle].map(
                (Icon, index) => (
                  <button
                    key={index}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-950 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black">
              Comprar
            </h3>

            <div className="mt-5 space-y-3">
              {[
                "Novidades",
                "Mais vendidos",
                "Ofertas",
                "Moda",
                "Tecnologia",
              ].map((item) => (
                <Link
                  key={item}
                  href={`/themes/prime${storeContext}`}
                  className="block text-left text-sm text-slate-500 transition hover:text-orange-500"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black">
              Atendimento
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-orange-500" />

                <div>
                  <p className="text-xs font-bold">
                    Telefone
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    +258 84 000 0000
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-orange-500" />

                <div>
                  <p className="text-xs font-bold">
                    E-mail
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    suporte@prime.store
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 text-orange-500" />

                <div>
                  <p className="text-xs font-bold">
                    Horário
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Segunda a sábado, 08h–18h
                  </p>
                </div>
              </div>

              <Link
                href={`/themes/prime/mensagens${storeContext}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 transition hover:text-orange-600"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com atendimento
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black">
              Segurança
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <Lock className="h-4 w-4 text-emerald-500" />

                <span className="text-xs font-semibold text-slate-600">
                  Pagamento protegido
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />

                <span className="text-xs font-semibold text-slate-600">
                  Compra segura
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <PackageCheck className="h-4 w-4 text-emerald-500" />

                <span className="text-xs font-semibold text-slate-600">
                  Produtos selecionados
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} {storeName}.
            Todos os direitos reservados.
          </p>

          <div className="flex gap-5">
            <Link href={`/themes/prime/conta${storeContext}`}>
              Ajuda
            </Link>

            <Link href={`/themes/prime/conta${storeContext}`}>
              Privacidade
            </Link>

            <Link href={`/themes/prime/conta${storeContext}`}>
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
