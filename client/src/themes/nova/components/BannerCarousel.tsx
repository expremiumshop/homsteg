"use client";

import { useEffect, useState } from "react";

import {
  normalizeBannerModel,
  BANNER_ANIMATION_CLASSES,
  type BannerAnimation,
  type BannerModel,
  type BannerFeatureSet,
} from "../bannerModels";

export interface NovaBanner {
  id: string;
  image_url: string;
  position: number;
  title?: string;
  subtitle?: string;

  /* Elementos opcionais deste banner individual. */
  features?: BannerFeatureSet;

  /* URL de destino do botão, já resolvido (loja/produto/link). */
  buttonHref?: string;
}

interface BannerCarouselProps {
  banners?: NovaBanner[];

  /** Modelo de banner escolhido pela loja (1..5). */
  model?: string | null;
}

const demoBanners: NovaBanner[] = [
  {
    id: "nova-banner-1",
    image_url:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
    position: 1,
    title: "Nova coleção",
    subtitle: "Peças selecionadas para a estação",
  },
  {
    id: "nova-banner-2",
    image_url:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
    position: 2,
    title: "Promoções da semana",
    subtitle: "Descontos em todo o catálogo",
  },
  {
    id: "nova-banner-3",
    image_url:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85",
    position: 3,
    title: "Novas chegadas",
    subtitle: "Aproveita as tendências do momento",
  },
];

export default function BannerCarousel({
  banners,
  model,
}: BannerCarouselProps) {
  /*
   * Sem banners reais (loja sem banner ou modo
   * demo sem dados), usa os banners demo —
   * identidade visual da Nova intacta.
   */
  const effectiveBanners =
    banners && banners.length > 0 ? banners : demoBanners;

  const bannerModel: BannerModel =
    normalizeBannerModel(model);

  const [current, setCurrent] = useState(0);

  const orderedBanners = [...effectiveBanners].sort(
    (a, b) => a.position - b.position,
  );

  useEffect(() => {
    if (orderedBanners.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % orderedBanners.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [orderedBanners.length]);

  useEffect(() => {
    if (current >= orderedBanners.length) {
      setCurrent(0);
    }
  }, [current, orderedBanners.length]);

  if (orderedBanners.length === 0) {
    return null;
  }

  const slide = orderedBanners[current];

  /*
   * Relógio para as contagens decrescentes (1s):
   * um único intervalo para o carrossel inteiro.
   */
  const [now, setNow] = useState(() => Date.now());

  const hasCountdown = orderedBanners.some(
    (banner) => banner.features?.countdown?.enabled,
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

  /* ============================================================
     MODELO 1 — ATUAL/COMPACTO (design e comportamento atuais)
     ============================================================ */

  if (bannerModel === "1") {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
          <div className="relative w-full aspect-[16/7] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
            {orderedBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === current ? "z-10 opacity-100" : "z-0 opacity-0"
                } ${animationClass(banner, index === current)}`}
              >
                <div className="block h-full w-full">
                  <img
                    src={banner.image_url}
                    alt={`Banner ${index + 1}`}
                    className="block h-full w-full object-cover"
                  />
                </div>

                <BannerFeatureLayer banner={banner} now={now} />
              </div>
            ))}
          </div>

          {orderedBanners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm md:bottom-4">
              {orderedBanners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Ir para banner ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === current ? "w-6 bg-white" : "w-2 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ============================================================
     MODELOS 2–5: O CARROSSEL INTEIRO USA O MESMO MODELO,
     AS MESMAS DIMENSÕES E A MESMA ESTRUTURA EM TODOS OS SLIDES.
     ============================================================ */

  /* MODELO 2 — GRANDE: imagem + painel de conteúdo em baixo. */
  if (bannerModel === "2") {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
          <div className="relative w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
            {orderedBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === current ? "z-10 opacity-100" : "z-0 opacity-0"
                } ${animationClass(banner, index === current)}`}
              >
                <img
                  src={banner.image_url}
                  alt={`Banner ${index + 1}`}
                  className="block h-full w-full object-cover"
                />

                <BannerFeatureLayer banner={banner} now={now} />
              </div>
            ))}
          </div>

          {/* Altura fixa: mesma estrutura em todos os slides */}
          <div className="flex min-h-[88px] items-stretch border-t border-black/5 bg-emerald-950 text-white md:min-h-[112px]">
            <div className="flex flex-col justify-center gap-2 px-6 py-4 text-left md:px-10">
              <h2 className="max-w-lg text-lg font-black tracking-tight sm:text-2xl md:text-3xl">
                {slide?.title || "Título da campanha"}
              </h2>

              <p className="max-w-md text-[11px] font-medium text-white/80 sm:text-sm">
                {slide?.subtitle || "Subtítulo da campanha"}
              </p>
            </div>
          </div>

          <CarouselDots
            orderedBanners={orderedBanners}
            current={current}
            setCurrent={setCurrent}
          />
        </div>
      </section>
    );
  }

  /* MODELO 3 — DUPLO: duas áreas visuais no mesmo slide. */
  if (bannerModel === "3") {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
          <div className="relative w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
            {orderedBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 grid grid-cols-2 gap-px bg-black/10 transition-opacity duration-700 ease-in-out ${
                  index === current ? "z-10 opacity-100" : "z-0 opacity-0"
                } ${animationClass(banner, index === current)}`}
              >
                {/* Área A — imagem + legenda */}
                <div className="relative overflow-hidden bg-slate-800">
                  <img
                    src={banner.image_url}
                    alt={`Banner ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-white">
                    {banner.title && (
                      <p className="truncate text-xs font-bold sm:text-sm">
                        {banner.title}
                      </p>
                    )}

                    {banner.subtitle && (
                      <p className="truncate text-[10px] text-white/80 sm:text-xs">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>

                  <BannerFeatureLayer banner={banner} now={now} />
                </div>

                {/* Área B — conteúdo sólido do mesmo slide */}
                <div className="flex flex-col items-start justify-center gap-1.5 bg-emerald-950 px-4 py-4 text-left text-white md:px-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                    Destaque
                  </span>

                  <p className="line-clamp-2 text-sm font-black sm:text-lg">
                    {banner.title || "A tua campanha aqui"}
                  </p>

                  <p className="line-clamp-2 text-[11px] text-white/80 sm:text-sm">
                    {banner.subtitle ||
                      "Adiciona título e subtítulo no painel."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <CarouselDots
            orderedBanners={orderedBanners}
            current={current}
            setCurrent={setCurrent}
          />
        </div>
      </section>
    );
  }

  /* MODELO 4 — SPLIT: metade imagem, metade texto. */
  if (bannerModel === "4") {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-white md:rounded-3xl">
          <div className="relative w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
            {orderedBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 grid grid-cols-2 transition-opacity duration-700 ease-in-out ${
                  index === current ? "z-10 opacity-100" : "z-0 opacity-0"
                } ${animationClass(banner, index === current)}`}
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={banner.image_url}
                    alt={`Banner ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <BannerFeatureLayer banner={banner} now={now} />
                </div>

                <div className="flex flex-col justify-center gap-2 bg-white px-5 py-4 text-left md:px-10">
                  <h2 className="line-clamp-2 text-base font-black tracking-tight text-slate-950 sm:text-xl md:text-2xl">
                    {banner.title || "Título do banner"}
                  </h2>

                  <p className="line-clamp-2 text-[11px] font-medium text-slate-500 sm:text-sm">
                    {banner.subtitle || "Subtítulo do banner"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <CarouselDots
            orderedBanners={orderedBanners}
            current={current}
            setCurrent={setCurrent}
          />
        </div>
      </section>
    );
  }

  /* MODELO 5 — OVERLAY: texto em destaque sobre a imagem. */
  if (bannerModel === "5") {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
          <div className="relative w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
            {orderedBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === current ? "z-10 opacity-100" : "z-0 opacity-0"
                } ${animationClass(banner, index === current)}`}
              >
                <img
                  src={banner.image_url}
                  alt={`Banner ${index + 1}`}
                  className="block h-full w-full object-cover"
                />

                <BannerFeatureLayer banner={banner} now={now} />

                {(banner.title || banner.subtitle) && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/35 px-6 text-center text-white">
                    {banner.title && (
                      <h2 className="max-w-xl text-xl font-black tracking-tight drop-shadow-sm sm:text-3xl md:text-4xl">
                        {banner.title}
                      </h2>
                    )}

                    {banner.subtitle && (
                      <p className="max-w-lg text-xs font-medium text-white/85 sm:text-sm md:text-base">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <CarouselDots
            orderedBanners={orderedBanners}
            current={current}
            setCurrent={setCurrent}
          />
        </div>
      </section>
    );
  }

  /*
   * MODELO 6 — GRADIENTE (do Market 1banner): faixa com
   * fundo em gradiente, título grande e botão de ação.
   */
  if (bannerModel === "6") {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="mx-auto w-full max-w-[1440px]">
          {orderedBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`overflow-hidden rounded-2xl transition-opacity duration-700 ease-in-out ${
                index === current ? "block" : "hidden"
              } ${animationClass(banner, index === current)}`}
            >
              <div className="flex min-h-[180px] flex-col justify-center gap-3 bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 p-8 text-white">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime-300">
                  Destaque da semana
                </span>

                <h2 className="max-w-md text-2xl font-black leading-tight sm:text-3xl">
                  {banner.title || "Grandes ofertas, todos os dias"}
                </h2>

                {banner.subtitle && (
                  <p className="max-w-md text-xs font-medium text-white/80 sm:text-sm">
                    {banner.subtitle}
                  </p>
                )}

                {banner.buttonHref ? (
                  <a
                    href={banner.buttonHref}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-lime-300"
                  >
                    Ver agora
                  </a>
                ) : (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950">
                    Ver agora
                  </span>
                )}
              </div>
            </div>
          ))}

          <CarouselDots
            orderedBanners={orderedBanners}
            current={current}
            setCurrent={setCurrent}
          />
        </div>
      </section>
    );
  }

  /*
   * MODELO 7 — SPLIT CLARO (do Market 2banner): texto à
   * esquerda, imagem à direita, fundo branco.
   */
  if (bannerModel === "7") {
    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="mx-auto w-full max-w-[1440px]">
          {orderedBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`overflow-hidden rounded-2xl transition-opacity duration-700 ease-in-out ${
                index === current ? "block" : "hidden"
              } ${animationClass(banner, index === current)}`}
            >
              <div className="grid min-h-[180px] grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:grid-cols-2">
                <div className="flex flex-col justify-center gap-3 p-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                    Nova coleção
                  </span>

                  <h2 className="text-xl font-black leading-tight text-slate-950 sm:text-2xl">
                    {banner.title || "Explore a nova coleção"}
                  </h2>

                  {banner.subtitle && (
                    <p className="text-xs text-slate-500 sm:text-sm">
                      {banner.subtitle}
                    </p>
                  )}

                  {banner.buttonHref && (
                    <a
                      href={banner.buttonHref}
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                      Descobrir
                    </a>
                  )}
                </div>

                <div className="relative hidden items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 sm:flex">
                  <img
                    src={banner.image_url}
                    alt={`Banner ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}

          <CarouselDots
            orderedBanners={orderedBanners}
            current={current}
            setCurrent={setCurrent}
          />
        </div>
      </section>
    );
  }

  /*
   * MODELO 9 — SIMPLES (do Market 10banner): imagem única,
   * sem carrossel, sem pontos e sem configurações.
   */
  if (bannerModel === "9") {
    const onlyBanner = orderedBanners[0];

    if (!onlyBanner) {
      return null;
    }

    return (
      <section className="w-full px-3 py-3 md:px-6 md:py-5">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
          <div className="relative w-full aspect-[16/7] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
            <img
              src={onlyBanner.image_url}
              alt="Banner da loja"
              className="block h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  /*
   * MODELO 8 — FAIXA (do Market 3banner): faixa compacta
   * com chamada e seta.
   */
  return (
    <section className="w-full px-3 py-3 md:px-6 md:py-5">
      <div className="mx-auto w-full max-w-[1440px]">
        {orderedBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`transition-opacity duration-700 ease-in-out ${
              index === current ? "block" : "hidden"
            }`}
          >
            <div className="flex w-full items-center justify-between gap-4 rounded-xl bg-lime-300 px-5 py-4 text-left">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-slate-950">
                  {banner.title || "Grande campanha da loja"}
                </p>

                {banner.subtitle && (
                  <p className="mt-0.5 text-xs text-emerald-900">
                    {banner.subtitle}
                  </p>
                )}
              </div>

              <span className="text-lg text-slate-950" aria-hidden="true">
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   ELEMENTOS OPCIONAIS POR BANNER (independentes do modelo)
   ============================================================ */

const BUTTON_POSITION_CLASSES: Record<string, string> = {
  "bottom-left": "bottom-10 left-4 md:bottom-12 md:left-6",
  "bottom-right": "bottom-10 right-4 md:bottom-12 md:right-6",
  "top-left": "top-4 left-4 md:top-6 md:left-6",
  "top-right": "top-4 right-4 md:top-6 md:right-6",
  center: "inset-0 flex items-center justify-center",
};

const TEXT_POSITION_CLASSES: Record<string, string> = {
  "top-left": "top-3 left-4 text-left",
  "top-center": "top-3 inset-x-0 text-center",
  "bottom-left": "bottom-3 left-4 text-left",
  "bottom-center": "bottom-3 inset-x-0 text-center",
  "bottom-right": "bottom-3 right-4 text-right",
};

function Countdown({
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
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
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

/**
 * Camada de elementos opcionais de UM banner.
 * Renderizada sobre a imagem em qualquer modelo.
 */
function BannerFeatureLayer({
  banner,
  now,
}: {
  banner: NovaBanner;
  now: number;
}) {
  const features = banner.features;

  if (!features) {
    return null;
  }

  const button = features.button?.enabled
    ? features.button
    : null;

  const text = features.text?.enabled ? features.text : null;

  const countdown = features.countdown?.enabled
    ? features.countdown
    : null;

  if (!button && !text && !countdown) {
    return null;
  }

  return (
    <>
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
          <Countdown endsAt={countdown.endsAt} now={now} />
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
          {banner.buttonHref ? (
            <a
              href={banner.buttonHref}
              target={
                button.target === "link" &&
                /^https?:\/\//.test(button.destination ?? "")
                  ? "_blank"
                  : undefined
              }
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              {button.label}
            </a>
          ) : (
            <span className="inline-flex h-9 items-center rounded-lg bg-emerald-600/60 px-4 text-xs font-bold text-white">
              {button.label}
            </span>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Classe de animação do slide ativo (leve, CSS only).
 */
function animationClass(
  banner: NovaBanner,
  isActive: boolean,
): string {
  if (!isActive) {
    return "";
  }

  const animation = banner.features?.animation;

  if (!animation?.enabled) {
    return "";
  }

  const type: BannerAnimation = animation.type ?? "fade";

  return BANNER_ANIMATION_CLASSES[type] ?? "";
}

/* ============================================================
   PONTOS DE NAVEGAÇÃO (mesma linguagem visual do modelo 1)
   ============================================================ */

function CarouselDots({
  orderedBanners,
  current,
  setCurrent,
}: {
  orderedBanners: NovaBanner[];
  current: number;
  setCurrent: (fn: (value: number) => number) => void;
}) {
  if (orderedBanners.length <= 1) {
    return null;
  }

  return (
    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm md:bottom-4">
      {orderedBanners.map((banner, index) => (
        <button
          key={banner.id}
          type="button"
          onClick={() => setCurrent(() => index)}
          aria-label={`Ir para banner ${index + 1}`}
          className={`h-2 rounded-full transition-all ${
            index === current ? "w-6 bg-white" : "w-2 bg-white/60"
          }`}
        />
      ))}
    </div>
  );
}
