import type {} from "../../../registry";

/* =========================================================
   MARKET — FOOTER 1 (Completo)
   Três colunas de links + barra de copyright.
   ========================================================= */

export default function Footer1() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="grid grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-sm font-black text-[#111713]">
            MARKET
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Produtos selecionados com entrega em todo
            o país.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#111713]">
            Loja
          </p>

          <ul className="mt-2 space-y-1 text-xs text-gray-500">
            <li>
              <button type="button">Produtos</button>
            </li>

            <li>
              <button type="button">Categorias</button>
            </li>

            <li>
              <button type="button">Promoções</button>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#111713]">
            Ajuda
          </p>

          <ul className="mt-2 space-y-1 text-xs text-gray-500">
            <li>
              <button type="button">Contactos</button>
            </li>

            <li>
              <button type="button">Entregas</button>
            </li>

            <li>
              <button type="button">Devoluções</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-3 text-center text-[11px] text-gray-400 sm:px-6">
        © 2026 Market. Todos os direitos reservados.
      </div>
    </footer>
  );
}
