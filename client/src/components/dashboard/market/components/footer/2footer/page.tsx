import { Send } from "lucide-react";

import type {} from "../../../registry";

/* =========================================================
   MARKET — FOOTER 2 (Escuro)
   Fundo escuro com newsletter e links.
   ========================================================= */

export default function Footer2() {
  return (
    <footer className="bg-[#111713] text-white">
      <div className="grid grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6">
        <div>
          <p className="text-sm font-black">
            Receba as novidades
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Ofertas exclusivas diretamente no seu email.
          </p>

          <div className="mt-3 flex max-w-sm items-center gap-2 rounded-full bg-white/10 p-1 pl-4">
            <span className="flex-1 text-xs text-gray-400">
              O seu email
            </span>

            <button
              type="button"
              aria-label="Subscrever"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-[#111713]"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-start gap-8 sm:justify-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide">
              Loja
            </p>

            <ul className="mt-2 space-y-1 text-xs text-gray-400">
              <li>Produtos</li>

              <li>Categorias</li>

              <li>Promoções</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide">
              Ajuda
            </p>

            <ul className="mt-2 space-y-1 text-xs text-gray-400">
              <li>Contactos</li>

              <li>Entregas</li>

              <li>Devoluções</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-gray-500 sm:px-6">
        © 2026 Market. Todos os direitos reservados.
      </div>
    </footer>
  );
}
