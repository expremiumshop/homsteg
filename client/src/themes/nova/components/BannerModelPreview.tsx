import {
  BANNER_MODELS,
  BANNER_UNLOCKABLE_MODELS,
  getBannerModelLabel,
  type BannerModel,
} from "../bannerModels";

/**
 * Miniatura estática de cada modelo de banner,
 * com a mesma linguagem visual do carrossel real
 * (rounded, emerald-950 para painéis de conteúdo).
 */
function BannerMiniature({ model }: { model: BannerModel }) {
  const img = (
    <div className="relative h-12 w-full overflow-hidden rounded-lg bg-slate-200">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
    </div>
  );

  if (model === "1") {
    return <div className="overflow-hidden rounded-xl shadow-sm">{img}</div>;
  }

  if (model === "2") {
    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {img}

        <div className="space-y-1 bg-emerald-950 px-2 py-1.5">
          <div className="h-1.5 w-3/5 rounded bg-white/70" />

          <div className="h-1 w-2/5 rounded bg-white/40" />
        </div>
      </div>
    );
  }

  if (model === "3") {
    return (
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-black/10 shadow-sm">
        <div className="relative h-12 bg-slate-300">
          <div className="absolute inset-x-1 bottom-1 h-1.5 rounded bg-white/70" />
        </div>

        <div className="flex flex-col justify-center gap-1 bg-emerald-950 px-2">
          <div className="h-1.5 w-4/5 rounded bg-white/70" />

          <div className="h-1 w-3/5 rounded bg-white/40" />
        </div>
      </div>
    );
  }

  if (model === "4") {
    return (
      <div className="grid grid-cols-2 overflow-hidden rounded-xl bg-white shadow-sm">
        {img}

        <div className="flex flex-col justify-center gap-1 bg-white px-2">
          <div className="h-1.5 w-4/5 rounded bg-slate-400" />

          <div className="h-1 w-3/5 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  /* Modelo 5 — overlay */
  return (
    <div className="relative h-12 w-full overflow-hidden rounded-xl shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/35">
        <div className="h-1.5 w-3/5 rounded bg-white" />

        <div className="h-1 w-2/5 rounded bg-white/60" />
      </div>
    </div>
  );
}

/**
 * Seletor dos 5 modelos de banner. A loja usa um
 * único modelo em cada momento — todos os slides do
 * carrossel partilham modelo, dimensões e estrutura.
 */
export function BannerModelSelector({
  value,
  onChange,
  disabled = false,
  unlockedModels,
}: {
  value: string | null | undefined;
  onChange: (model: BannerModel) => void;
  disabled?: boolean;
  /**
   * Modelos desbloqueados pela loja via Market
   * (store_market_features). Quando fornecido, APENAS
   * estes modelos são mostrados — os não comprados ficam
   * escondidos (comprados no Market, visíveis lá).
   */
  unlockedModels?: readonly BannerModel[] | null;
}) {
  const selected = value ?? "1";

  const visibleModels =
    unlockedModels === undefined
      ? BANNER_MODELS
      : BANNER_UNLOCKABLE_MODELS.filter((model) =>
          (unlockedModels ?? []).includes(model),
        );

  const descriptions: Record<BannerModel, string> = {
    "1": "Design atual do carrossel, sem alterações.",
    "2": "Área maior com título, subtítulo e conteúdo.",
    "3": "Duas áreas visuais no mesmo slide.",
    "4": "Duas metades lado a lado (imagem + texto).",
    "5": "Título e subtítulo em destaque sobre a imagem.",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleModels.map((model) => {
        const isActive = model === selected;

        return (
          <button
            key={model}
            type="button"
            disabled={disabled}
            onClick={() => onChange(model)}
            className={`
              overflow-hidden rounded-2xl border bg-white p-4 text-left transition
              ${
                isActive
                  ? "border-[#111713] ring-1 ring-[#111713]"
                  : "border-gray-200 hover:border-gray-300"
              }
              disabled:cursor-not-allowed disabled:opacity-60
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#111713]">
                  {getBannerModelLabel(model)}
                </h4>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  {descriptions[model]}
                </p>
              </div>

              {isActive && (
                <span className="rounded-full bg-[#111713] px-2.5 py-1 text-[10px] font-bold text-white">
                  Ativo
                </span>
              )}
            </div>

            <div className="mt-4">
              <BannerMiniature model={model} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default BannerModelSelector;
