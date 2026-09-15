import { useState } from "react";
import {
  Palette,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Crown,
  Sparkles,
  Store,
} from "lucide-react";
import { useLocation } from "wouter";

type Theme = {
  id: string;
  name: string;
  description: string;
  category: string;
  plan: "Grátis" | "Premium";
};

const themes: Theme[] = [
  {
    id: "",
    name: "Nova",
    description: "Marketplace moderno e versátil para diferentes tipos de loja.",
    category: "Marketplace",
    plan: "Grátis",
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "Visual premium para moda, luxo e marcas sofisticadas.",
    category: "Moda & Luxo",
    plan: "Premium",
  },
  {
    id: "market",
    name: "Market",
    description: "Ideal para lojas com grande variedade de produtos.",
    category: "Marketplace",
    plan: "Premium",
  },
  {
    id: "urban",
    name: "Urban",
    description: "Moda, streetwear e lifestyle com visual marcante.",
    category: "Lifestyle",
    plan: "Premium",
  },
  {
    id: "essenza",
    name: "Essenza",
    description: "Design minimalista, elegante e focado nos produtos.",
    category: "Minimalista",
    plan: "Premium",
  },
  {
    id: "prime",
    name: "Prime",
    description: "Experiência moderna para tecnologia e eletrónica.",
    category: "Tecnologia",
    plan: "Premium",
  },
  {
    id: "caliza",
    name: "Caliza",
    description: "Visual sofisticado para marcas modernas e criativas.",
    category: "Moderno",
    plan: "Premium",
  },
  {
    id: "chazuca",
    name: "Chazuca",
    description: "Um tema criativo, forte e versátil para destacar a loja.",
    category: "Criativo",
    plan: "Premium",
  },
];

export default function ThemesPage() {
  const [, navigate] = useLocation();

  const [selectedTheme, setSelectedTheme] = useState("nova");

  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const currentTheme =
    themes.find((theme) => theme.id === selectedTheme) ?? themes[0];

  function handleSelectTheme(themeId: string) {
    setSelectedTheme(themeId);
  }

  function handleViewTheme(themeId: string) {
    navigate(`/store/themes?theme=${themeId}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            Editor visual
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Temas
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Escolha e personalize o visual da sua loja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleViewTheme(selectedTheme)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Eye className="h-4 w-4" />
          Ver tema
        </button>
      </div>

      {/* Current theme */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Tema atualmente selecionado
              </p>

              <p className="text-xs text-slate-500">
                {currentTheme.name}
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-700">
            Ativo
          </span>
        </div>
      </div>

      {/* Theme list */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Temas disponíveis
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explore os temas disponíveis e escolha o visual da sua loja.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.id;

            return (
              <div
                key={theme.id}
                className={`group overflow-hidden rounded-2xl border bg-white text-left transition ${
                  isSelected
                    ? "border-emerald-400 ring-2 ring-emerald-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 p-4">
                    <div className="h-full rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex h-8 items-center gap-2 border-b border-slate-100 px-3">
                        <div className="h-2 w-2 rounded-full bg-slate-900" />

                        <div className="h-1.5 w-16 rounded-full bg-slate-200" />

                        <div className="ml-auto h-1.5 w-10 rounded-full bg-slate-100" />
                      </div>

                      <div className="p-3">
                        <div className="h-16 rounded-lg bg-slate-100" />

                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="h-16 rounded-lg bg-slate-100" />
                          <div className="h-16 rounded-lg bg-slate-100" />
                          <div className="h-16 rounded-lg bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {theme.plan === "Premium" && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-white">
                      <Crown className="h-3 w-3" />
                      Premium
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {theme.name}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {theme.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                      {theme.category}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {isSelected ? (
                      <button
                        type="button"
                        onClick={() => handleViewTheme(theme.id)}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver tema
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectTheme(theme.id)}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        <Palette className="h-3.5 w-3.5" />
                        Selecionar tema
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Preview */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Pré-visualização
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Veja como o tema {currentTheme.name} ficará em diferentes
              dispositivos.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                previewDevice === "desktop"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="Pré-visualização desktop"
            >
              <Monitor className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setPreviewDevice("tablet")}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                previewDevice === "tablet"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="Pré-visualização tablet"
            >
              <Tablet className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                previewDevice === "mobile"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="Pré-visualização mobile"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex min-h-[360px] items-center justify-center bg-slate-50 p-6">
          <div
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all ${
              previewDevice === "desktop"
                ? "w-full max-w-4xl"
                : previewDevice === "tablet"
                  ? "w-full max-w-2xl"
                  : "w-full max-w-sm"
            }`}
          >
            <div className="flex h-12 items-center gap-3 border-b border-slate-100 px-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                H
              </div>

              <div className="h-2 w-24 rounded-full bg-slate-200" />

              <div className="ml-auto h-7 w-20 rounded-lg bg-slate-100" />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  {currentTheme.id === "nova" ? (
                    <Sparkles className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Store className="h-4 w-4 text-slate-600" />
                  )}
                </div>

                <div className="h-3 w-32 rounded-full bg-slate-200" />
              </div>

              <div className="mt-4 h-32 rounded-xl bg-slate-100" />

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="h-28 rounded-xl bg-slate-100" />
                <div className="h-28 rounded-xl bg-slate-100" />
                <div className="h-28 rounded-xl bg-slate-100" />
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="h-3 w-32 rounded-full bg-slate-200" />

                <div className="h-8 w-24 rounded-lg bg-slate-950" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          <Eye className="h-3.5 w-3.5" />

          Pré-visualização do tema {currentTheme.name}
        </div>
      </section>
    </div>
  );
}