import { useEffect, useState } from "react";

/*
 * =========================================================
 * MARKET — BANNER 4 (Banner Personalizado)
 * =========================================================
 * Funcionalidade transferida do "Personalizar loja"
 * (Branding) para o Market, com código PRÓPRIO e
 * isolado — este ficheiro não partilha nem altera o
 * código dos banners 1, 2 e 3 nem do tema Nova.
 *
 * O que a funcionalidade real permite configurar por
 * banner (guardado em bannerFeatures por chave R2):
 *   - Texto livre com posição;
 *   - Botão com destino (produto da loja ou link);
 *   - Animação leve do slide ativo;
 *   - Contagem decrescente (datetime);
 *   - Estado de publicação: Publicar / Despublicar
 *     (Rascunho) — novos banners nascem como Rascunho.
 *
 * Aqui fica a pré-visualização de demonstração, fiel
 * ao comportamento da loja: o elemento ativo é
 * percorrido em ciclo, com os elementos a atuar sobre
 * o slide (texto e botão conforme a posição,
 * contagem a contar, animação aplicada).
 * =========================================================
 */

/* ---------- Tipos locais (espelham a config real) ---------- */

type Banner4ButtonPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "center";

type Banner4TextPosition =
  | "top-left"
  | "top-center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type Banner4Animation = "none" | "fade" | "zoom" | "slide-up" | "slide-left";

type Banner4FeatureSet = {
  button?: {
    enabled: boolean;
    label?: string;
    target?: "product" | "link";
    destination?: string;
    position?: Banner4ButtonPosition;
  };
  text?: {
    enabled: boolean;
    text?: string;
    position?: Banner4TextPosition;
  };
  animation?: {
    enabled: boolean;
    type?: Banner4Animation;
  };
  countdown?: {
    enabled: boolean;
    endsAt?: string;
  };
};

/* ---------- Configuração da demonstração ---------- */

const BUTTON_POSITION_CLASSES: Record<
  Banner4ButtonPosition,
  string
> = {
  "bottom-left": "bottom-10 left-4 md:bottom-12 md:left-6",
  "bottom-right": "bottom-10 right-4 md:bottom-12 md:right-6",
  "top-left": "top-4 left-4 md:top-6 md:left-6",
  "top-right": "top-4 right-4 md:top-6 md:right-6",
  center: "inset-0 flex items-center justify-center",
};

const TEXT_POSITION_CLASSES: Record<
  Banner4TextPosition,
  string
> = {
  "top-left": "top-3 left-4 text-left",
  "top-center": "top-3 inset-x-0 text-center",
  "bottom-left": "bottom-3 left-4 text-left",
  "bottom-center": "bottom-3 inset-x-0 text-center",
  "bottom-right": "bottom-3 right-4 text-right",
};

/* Mesmos keyframes/classes do storefront (CSS global). */
const ANIMATION_CLASSES: Record<Banner4Animation, string> = {
  none: "",
  fade: "nova-banner-anim-fade",
  zoom: "nova-banner-anim-zoom",
  "slide-up": "nova-banner-anim-slide-up",
  "slide-left": "nova-banner-anim-slide-left",
};

type Banner4Slide = {
  id: string;
  imageUrl: string;
  features: Banner4FeatureSet;
};

/*
 * Contagem decrescente da demo: 48 horas a partir
 * do carregamento do módulo.
 */
const DEMO_COUNTDOWN_ENDS_AT = new Date(
  Date.now() + 48 * 60 * 60 * 1000,
).toISOString();

const DEMO_SLIDES: Banner4Slide[] = [
  {
    id: "banner4-demo-1",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
    features: {
      text: {
        enabled: true,
        text: "Promoção de lançamento",
        position: "top-left",
      },
      button: {
        enabled: true,
        label: "Comprar agora",
        target: "product",
        position: "bottom-left",
      },
      animation: { enabled: true, type: "fade" },
    },
  },
  {
    id: "banner4-demo-2",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
    features: {
      text: {
        enabled: true,
        text: "Frete grátis acima de 5.000 MT",
        position: "bottom-center",
      },
      button: {
        enabled: true,
        label: "Aproveitar",
        target: "link",
        destination: "https://loja.exemplo/colecao",
        position: "bottom-right",
      },
      animation: { enabled: true, type: "slide-up" },
    },
  },
  {
    id: "banner4-demo-3",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85",
    features: {
      countdown: {
        enabled: true,
        endsAt: DEMO_COUNTDOWN_ENDS_AT,
      },
      animation: { enabled: true, type: "zoom" },
    },
  },
];

/* ---------- Estado de publicação (demo) ---------- */

const PUBLISHED_STATES: Record<string, boolean> = {
  "banner4-demo-1": true,
  "banner4-demo-2": true,
  /* Rascunho — só aparece na loja após Publicar. */
  "banner4-demo-3": false,
};

/* ---------- Componente principal ---------- */

export default function Banner4() {
  /* Só slides publicados aparecem na loja/carrossel. */
  const published = DEMO_SLIDES.filter(
    (slide) => PUBLISHED_STATES[slide.id] !== false,
  );

  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (published.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % published.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [published.length]);

  /* Relógio da contagem decrescente (1s). */
  const hasCountdown = published.some(
    (slide) => slide.features.countdown?.enabled,
  );

  useEffect(() => {
    if (!hasCountdown) {
      return;
    }

    const timer = window.setInterval(
      () => setNow(Date.now()),
      1000,
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [hasCountdown]);

  if (current >= published.length) {
    setCurrent(0);
  }

  if (published.length === 0) {
    return null;
  }

  const slide = published[current];

  return (
    <section className="px-4 sm:px-6">
      {/* Pré-visualização do carrossel */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <div className="relative w-full aspect-[16/6]">
          {published.map((item, index) => {
            const active = index === current;

            const animation =
              item.features.animation?.enabled
                ? ANIMATION_CLASSES[
                    item.features.animation.type ?? "fade"
                  ] ?? ""
                : "";

            const text =
              item.features.text?.enabled
                ? item.features.text
                : null;

            const button =
              item.features.button?.enabled
                ? item.features.button
                : null;

            const countdown =
              item.features.countdown?.enabled
                ? item.features.countdown
                : null;

            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  active ? "z-10 opacity-100" : "z-0 opacity-0"
                } ${active ? animation : ""}`}
              >
                <img
                  src={item.imageUrl}
                  alt={`Banner ${index + 1}`}
                  className="block h-full w-full object-cover"
                />

                {/* TEXTO LIVRE */}
                {text && text.text && (
                  <div
                    className={`pointer-events-none absolute z-20 px-4 ${
                      TEXT_POSITION_CLASSES[
                        text.position ?? "bottom-center"
                      ] ?? ""
                    }`}
                  >
                    <p className="inline-block max-w-md rounded-lg bg-black/45 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm sm:text-sm">
                      {text.text}
                    </p>
                  </div>
                )}

                {/* CONTAGEM DECRESCENTE */}
                {countdown && (
                  <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2">
                    <Countdown4
                      endsAt={countdown.endsAt}
                      now={now}
                    />
                  </div>
                )}

                {/* BOTÃO */}
                {button && button.label && (
                  <div
                    className={`absolute z-30 ${
                      BUTTON_POSITION_CLASSES[
                        button.position ?? "bottom-left"
                      ] ?? ""
                    }`}
                  >
                    {/*
                     * Na loja, o destino é resolvido
                     * (produto da loja ou link externo).
                     * Em demo, renderiza como span inerte.
                     */}
                    <span className="inline-flex h-9 items-center rounded-lg bg-emerald-600/90 px-4 text-xs font-bold text-white shadow-md">
                      {button.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pontos de navegação */}
        {published.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm">
            {published.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ir para banner ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? "w-6 bg-white"
                    : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Etiqueta de estado (Publicar/Despublicar) */}
      <div className="mt-2 flex items-center justify-end">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2 py-1 text-[10px] font-bold text-gray-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              PUBLISHED_STATES[slide.id] === false
                ? "bg-amber-500"
                : "bg-emerald-600"
            }`}
          />
          {PUBLISHED_STATES[slide.id] === false
            ? "Rascunho (não aparece na loja)"
            : "Publicado"}
        </span>
      </div>
    </section>
  );
}

/* ---------- Contagem decrescente (código próprio) ---------- */

function Countdown4({
  endsAt,
  now,
}: {
  endsAt?: string;
  now: number;
}) {
  const target = endsAt ? Date.parse(endsAt) : NaN;

  if (Number.isNaN(target)) {
    return null;
  }

  const diff = Math.max(0, target - now);

  if (diff === 0) {
    return null;
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(
    (totalSeconds % 86400) / 3600,
  );
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );
  const seconds = totalSeconds % 60;

  const units = [
    { label: "d", value: days },
    { label: "h", value: hours },
    { label: "m", value: minutes },
    { label: "s", value: seconds },
  ].filter(
    (unit) => unit.value > 0 || unit.label !== "d",
  );

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-white backdrop-blur-sm">
      {units.map((unit, index) => (
        <span
          key={unit.label}
          className="flex items-baseline gap-1"
        >
          {index > 0 && (
            <span className="text-[10px] opacity-50">:</span>
          )}

          <span className="text-xs font-black tabular-nums sm:text-sm">
            {String(unit.value).padStart(2, "0")}
          </span>

          <span className="text-[9px] font-bold opacity-70">
            {unit.label}
          </span>
        </span>
      ))}
    </div>
  );
}
