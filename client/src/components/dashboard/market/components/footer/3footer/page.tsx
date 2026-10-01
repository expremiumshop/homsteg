/* =========================================================
   MARKET — FOOTER 3 (Minimal)
   Uma linha com logo, links e copyright.
   ========================================================= */

export default function Footer3() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row sm:px-6">
        <span className="font-black text-[#111713]">
          MARKET
        </span>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="transition hover:text-[#111713]"
          >
            Produtos
          </button>

          <button
            type="button"
            className="transition hover:text-[#111713]"
          >
            Contactos
          </button>

          <button
            type="button"
            className="transition hover:text-[#111713]"
          >
            Ajuda
          </button>
        </div>

        <span>© 2026 Market</span>
      </div>
    </footer>
  );
}
