import {
  Eye,
  Pencil,
  Trash2,
  UploadCloud,
} from "lucide-react";

/* =========================================================
   MARKET — BANNER 10 (Digital Banner)
   Apresentação do modelo COMPLETO do banner de
   "Personalizar Loja" (Banners da loja), tal como o
   utilizador o terá depois de comprar:

   - imagem do banner + indicador "Rascunho";
   - campos Título / Subtítulo do banner;
   - ações: Publicar, Editar, Pré-visualizar, Remover;
   - opções: Botão, Texto, Animação (leve),
     Contagem decrescente;
   - botão "Adicionar banner".

   IMPORTANTE: no Market é apenas APRESENTAÇÃO — todos
   os campos, selects, checkboxes e botões estão
   desativados (inertes). Nada aqui é editável nem
   interativo; a aparência é réplica exata do existente.
   ========================================================= */

export default function Banner10() {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      {/* ============ IMAGEM DO BANNER ============ */}

      <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-[#f7f8f5]">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-medium">
            Imagem do banner
          </span>
        </div>

        <span className="absolute left-2 top-2 rounded-md bg-[#111713]/80 px-2 py-0.5 text-[10px] font-bold text-white">
          1
        </span>

        <span className="absolute right-2 top-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
          Rascunho
        </span>
      </div>

      {/* ============ TÍTULO / SUBTÍTULO ============ */}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          value="Título do banner"
          readOnly
          disabled
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none transition focus:border-gray-400 disabled:cursor-default"
        />

        <input
          type="text"
          value="Subtítulo do banner"
          readOnly
          disabled
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none transition focus:border-gray-400 disabled:cursor-default"
        />
      </div>

      {/* ============ AÇÕES ============ */}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2a2f2b]"
        >
          <UploadCloud className="h-4 w-4" />
          Publicar
        </button>

        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-[#111713] transition hover:bg-gray-50"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>

        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-[#111713] transition hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          Pré-visualizar
        </button>

        <span className="flex-1" />

        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Remover
        </button>
      </div>

      {/* ============ ELEMENTOS DO BANNER ============ */}

      <div className="mt-3 space-y-3 rounded-lg bg-[#f7f8f5] p-3">
        {/* BOTÃO */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-[#111713]"
            />

            <span className="text-xs font-bold text-[#111713]">
              Botão
            </span>
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value="Comprar"
              readOnly
              disabled
              placeholder="Texto do botão (ex.: Comprar)"
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
            />

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
            >
              <option>Página de produto</option>
            </select>

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
            >
              <option>Escolhe o produto...</option>
            </select>

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
            >
              <option>Inferior esquerda</option>
            </select>
          </div>
        </div>

        {/* TEXTO */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-[#111713]"
            />

            <span className="text-xs font-bold text-[#111713]">
              Texto
            </span>
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value="Texto a exibir no banner"
              readOnly
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
            />

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
            >
              <option>Inferior centro</option>
            </select>
          </div>
        </div>

        {/* ANIMAÇÃO (LEVE) */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-[#111713]"
            />

            <span className="text-xs font-bold text-[#111713]">
              Animação (leve)
            </span>
          </label>

          <select
            disabled
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
          >
            <option>Fade</option>
          </select>
        </div>

        {/* CONTAGEM DECRESCENTE */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-[#111713]"
            />

            <span className="text-xs font-bold text-[#111713]">
              Contagem decrescente
            </span>
          </label>

          <input
            type="datetime-local"
            disabled
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400 disabled:cursor-default"
          />
        </div>
      </div>

      {/* ============ ADICIONAR BANNER ============ */}

      <button
        type="button"
        tabIndex={-1}
        className="mt-4 flex w-full cursor-default items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2a2f2b]"
      >
        Adicionar banner
      </button>
    </div>
  );
}
