import {
  Eye,
  Pencil,
  Trash2,
  UploadCloud,
} from "lucide-react";

/* =========================================================
   MARKET — BANNER 10 (Digital Banner)

   Apresentação do modelo completo de Banners da Loja.
   Apenas demonstração no Market — nada é editável.
   ========================================================= */

export default function Banner10() {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      {/* ============ IMAGEM DO BANNER ============ */}
      <div className="relative h-36 w-full overflow-hidden rounded-lg border border-gray-200 bg-[#f7f8f5]">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
          alt="Imagem demonstrativa do banner"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-3 left-3 max-w-[260px] text-white">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/80">
            Nova coleção
          </p>

          <p className="mt-1 text-base font-black leading-tight">
            Descubra os destaques da loja
          </p>
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
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none disabled:cursor-default"
        />

        <input
          type="text"
          value="Subtítulo do banner"
          readOnly
          disabled
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none disabled:cursor-default"
        />
      </div>

      {/* ============ AÇÕES ============ */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2 text-xs font-bold text-white"
        >
          <UploadCloud className="h-4 w-4" />
          Publicar
        </button>

        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-[#111713]"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>

        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-[#111713]"
        >
          <Eye className="h-4 w-4" />
          Pré-visualizar
        </button>

        <span className="flex-1" />

        <button
          type="button"
          tabIndex={-1}
          className="flex cursor-default items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600"
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
              placeholder="Texto do botão"
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none disabled:cursor-default"
            />

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none disabled:cursor-default"
            >
              <option>Página de produto</option>
            </select>

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none disabled:cursor-default"
            >
              <option>Escolhe o produto...</option>
            </select>

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none disabled:cursor-default"
            >
              <option>Inferior esquerda</option>
            </select>

            {/* NOVO — LINK DO BOTÃO */}
            <input
              type="url"
              value="https://exemplo.com/produto"
              readOnly
              disabled
              placeholder="Link do botão (ex.: https://...)"
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none disabled:cursor-default sm:col-span-2"
            />
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
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none disabled:cursor-default"
            />

            <select
              disabled
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none disabled:cursor-default"
            >
              <option>Inferior centro</option>
            </select>
          </div>
        </div>

        {/* ANIMAÇÃO */}
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
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none disabled:cursor-default"
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
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none disabled:cursor-default"
          />
        </div>
      </div>

      {/* ============ ADICIONAR BANNER ============ */}
      <button
        type="button"
        tabIndex={-1}
        className="mt-4 flex w-full cursor-default items-center justify-center gap-2 rounded-xl bg-[#111713] px-4 py-2.5 text-xs font-bold text-white"
      >
        Adicionar banner
      </button>
    </div>
  );
}