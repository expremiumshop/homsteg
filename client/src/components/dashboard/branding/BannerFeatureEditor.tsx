import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import type {
  BannerAnimation,
  BannerButtonPosition,
  BannerFeatureSet,
  BannerTextPosition,
} from "@/themes/nova/bannerModels";

/*
 * Atraso do commit depois de a digitação parar.
 * Curto o suficiente para parecer autosave, longo
 * o suficiente para nunca bloquear a escrita.
 */
const COMMIT_DELAY_MS = 600;

/* ============================================================
   INPUT DE TEXTO COM ESTADO LOCAL

   Cada tecla atualiza APENAS o estado local (digitação
   imediata, sem re-render da página nem mutations). O
   valor é entregue ao pai em debounce (ou no blur).
   ============================================================ */
export function DebouncedTextInput({
  value,
  onCommit,
  maxLength,
  placeholder,
  className,
}: {
  value: string;
  onCommit: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(value);

  const draftRef = useRef(value);
  const timerRef = useRef<number | null>(null);
  const onCommitRef = useRef(onCommit);

  useEffect(() => {
    onCommitRef.current = onCommit;
  });

  /*
   * Sincroniza com o valor externo apenas quando
   * difere do rascunho atual (não interrompe nunca
   * o utilizador a meio da escrita).
   */
  useEffect(() => {
    if (value !== draftRef.current) {
      draftRef.current = value;
      setDraft(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function scheduleCommit(next: string) {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onCommitRef.current(next);
    }, COMMIT_DELAY_MS);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const next = event.target.value;

    draftRef.current = next;
    setDraft(next);
    scheduleCommit(next);
  }

  function handleBlur() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      onCommitRef.current(draftRef.current);
    }
  }

  return (
    <input
      type="text"
      value={draft}
      maxLength={maxLength}
      placeholder={placeholder}
      className={className}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

/* ============================================================
   EDITOR DE ELEMENTOS DO BANNER

   Componente de TOPO (identidade estável entre
   renders — nunca remonta). Estado local para
   resposta imediata; checkboxes/selects commitam
   já, campos de texto commitam em debounce.
   ============================================================ */
export function BannerFeatureEditor({
  features,
  products,
  onCommit,
}: {
  features: BannerFeatureSet | undefined;
  products: { slug: string; name: string }[];
  onCommit: (features: BannerFeatureSet) => void;
}) {
  const [local, setLocal] =
    useState<BannerFeatureSet>(features ?? {});

  const localRef = useRef(local);
  const pendingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const onCommitRef = useRef(onCommit);

  useEffect(() => {
    onCommitRef.current = onCommit;
  });

  /*
   * Sincroniza com o valor guardado apenas quando
   * não há commit pendente (o rascunho local é
   * sempre mais recente durante a edição).
   */
  useEffect(() => {
    if (!pendingRef.current && features !== localRef.current) {
      localRef.current = features ?? {};
      setLocal(features ?? {});
    }
  }, [features]);

  /*
   * Flush no unmount: fecha o painel a meio da
   * escrita não perde o último rascunho.
   */
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
        onCommitRef.current(localRef.current);
      }
    };
  }, []);

  function commitNow(next: BannerFeatureSet) {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    pendingRef.current = true;
    localRef.current = next;
    setLocal(next);
    onCommitRef.current(next);
  }

  function scheduleCommit(next: BannerFeatureSet) {
    pendingRef.current = true;
    localRef.current = next;
    setLocal(next);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onCommitRef.current(localRef.current);
    }, COMMIT_DELAY_MS);
  }

  const button = local.button ?? { enabled: false };

  const text = local.text ?? { enabled: false };

  const animation = local.animation ?? {
    enabled: false,
    type: "fade" as const,
  };

  const countdown = local.countdown ?? {
    enabled: false,
  };

  return (
    <div className="mt-3 space-y-3 rounded-lg bg-[#f7f8f5] p-3">
      {/* ============ BOTÃO ============ */}

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={button.enabled}
            onChange={(event) =>
              commitNow({
                ...localRef.current,
                button: {
                  ...button,
                  enabled: event.target.checked,
                },
              })
            }
            className="h-4 w-4 accent-[#111713]"
          />

          <span className="text-xs font-bold text-[#111713]">
            Botão
          </span>
        </label>

        {button.enabled && (
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={button.label ?? ""}
              maxLength={40}
              placeholder="Texto do botão (ex.: Comprar)"
              onChange={(event) =>
                scheduleCommit({
                  ...localRef.current,
                  button: {
                    ...button,
                    label: event.target.value,
                  },
                })
              }
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
            />

            <select
              value={button.target ?? "product"}
              onChange={(event) =>
                commitNow({
                  ...localRef.current,
                  button: {
                    ...button,
                    target: event.target
                      .value as "product" | "link",
                  },
                })
              }
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
            >
              <option value="product">
                Página de produto
              </option>

              <option value="link">
                Link personalizado
              </option>
            </select>

            {button.target === "product" ? (
              <select
                value={button.destination ?? ""}
                onChange={(event) =>
                  commitNow({
                    ...localRef.current,
                    button: {
                      ...button,
                      destination:
                        event.target.value,
                    },
                  })
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
              >
                <option value="">
                  Escolhe o produto...
                </option>

                {products.map((product) => (
                  <option
                    key={product.slug}
                    value={product.slug}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={
                  button.target === "link"
                    ? (button.destination ?? "")
                    : ""
                }
                placeholder="https://..."
                onChange={(event) =>
                  scheduleCommit({
                    ...localRef.current,
                    button: {
                      ...button,
                      destination:
                        event.target.value,
                    },
                  })
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
              />
            )}

            <select
              value={button.position ?? "bottom-left"}
              onChange={(event) =>
                commitNow({
                  ...localRef.current,
                  button: {
                    ...button,
                    position: event.target
                      .value as BannerButtonPosition,
                  },
                })
              }
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
            >
              <option value="bottom-left">
                Inferior esquerda
              </option>

              <option value="bottom-right">
                Inferior direita
              </option>

              <option value="top-left">
                Superior esquerda
              </option>

              <option value="top-right">
                Superior direita
              </option>

              <option value="center">Centro</option>
            </select>
          </div>
        )}
      </div>

      {/* ============ TEXTO ============ */}

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={text.enabled}
            onChange={(event) =>
              commitNow({
                ...localRef.current,
                text: {
                  ...text,
                  enabled: event.target.checked,
                },
              })
            }
            className="h-4 w-4 accent-[#111713]"
          />

          <span className="text-xs font-bold text-[#111713]">
            Texto
          </span>
        </label>

        {text.enabled && (
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={text.text ?? ""}
              maxLength={200}
              placeholder="Texto a exibir no banner"
              onChange={(event) =>
                scheduleCommit({
                  ...localRef.current,
                  text: {
                    ...text,
                    text: event.target.value,
                  },
                })
              }
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
            />

            <select
              value={text.position ?? "bottom-center"}
              onChange={(event) =>
                commitNow({
                  ...localRef.current,
                  text: {
                    ...text,
                    position: event.target
                      .value as BannerTextPosition,
                  },
                })
              }
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
            >
              <option value="top-left">
                Superior esquerda
              </option>

              <option value="top-center">
                Superior centro
              </option>

              <option value="bottom-left">
                Inferior esquerda
              </option>

              <option value="bottom-center">
                Inferior centro
              </option>

              <option value="bottom-right">
                Inferior direita
              </option>
            </select>
          </div>
        )}
      </div>

      {/* ============ ANIMAÇÃO ============ */}

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={animation.enabled}
            onChange={(event) =>
              commitNow({
                ...localRef.current,
                animation: {
                  ...animation,
                  enabled: event.target.checked,
                },
              })
            }
            className="h-4 w-4 accent-[#111713]"
          />

          <span className="text-xs font-bold text-[#111713]">
            Animação (leve)
          </span>
        </label>

        {animation.enabled && (
          <select
            value={animation.type ?? "fade"}
            onChange={(event) =>
              commitNow({
                ...localRef.current,
                animation: {
                  ...animation,
                  type: event.target
                    .value as BannerAnimation,
                },
              })
            }
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none focus:border-gray-400"
          >
            <option value="fade">Fade</option>

            <option value="zoom">Zoom suave</option>

            <option value="slide-up">
              Entrada de baixo
            </option>

            <option value="slide-left">
              Entrada da direita
            </option>
          </select>
        )}
      </div>

      {/* ============ CONTAGEM DECRESCENTE ============ */}

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={countdown.enabled}
            onChange={(event) =>
              commitNow({
                ...localRef.current,
                countdown: {
                  ...countdown,
                  enabled: event.target.checked,
                },
              })
            }
            className="h-4 w-4 accent-[#111713]"
          />

          <span className="text-xs font-bold text-[#111713]">
            Contagem decrescente
          </span>
        </label>

        {countdown.enabled && (
          <input
            type="datetime-local"
            value={
              countdown.endsAt
                ? countdown.endsAt.slice(0, 16)
                : ""
            }
            onChange={(event) =>
              commitNow({
                ...localRef.current,
                countdown: {
                  ...countdown,
                  endsAt: event.target.value
                    ? new Date(
                        event.target.value,
                      ).toISOString()
                    : undefined,
                },
              })
            }
            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-gray-400"
          />
        )}
      </div>
    </div>
  );
}
