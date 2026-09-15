import { ChangeEvent, useEffect, useState } from "react";
import {
  ImagePlus,
  Upload,
  X,
  Trash2,
  Plus,
  Star,
  Zap,
  Palette,
  Ruler,
  HardDrive,
  Droplets,
  Footprints,
  Settings2,
} from "lucide-react";

type ProductImage = {
  id: string;
  file: File;
  preview: string;
};

type ProductOption = {
  name: string;
  values: string[];
};

type NewProductModalProps = {
  onClose?: () => void;
};

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

const QUICK_OPTIONS = [
  {
    id: "size",
    name: "Tamanho de roupa",
    icon: <Ruler size={18} />,
    values: [
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL",
      "4XL",
      "5XL",
    ],
  },
  {
    id: "color",
    name: "Cor",
    icon: <Palette size={18} />,
    values: [
      "Preto",
      "Branco",
      "Vermelho",
      "Azul",
      "Verde",
      "Amarelo",
      "Rosa",
      "Laranja",
      "Roxo",
      "Castanho",
      "Cinza",
      "Bege",
    ],
  },
  {
    id: "shoe",
    name: "Calçado",
    icon: <Footprints size={18} />,
    values: [
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
    ],
  },
  {
    id: "storage",
    name: "Armazenamento",
    icon: <HardDrive size={18} />,
    values: [
      "32 GB",
      "64 GB",
      "128 GB",
      "256 GB",
      "512 GB",
      "1 TB",
      "2 TB",
    ],
  },
  {
    id: "volume",
    name: "Volume",
    icon: <Droplets size={18} />,
    values: [
      "100 ml",
      "250 ml",
      "500 ml",
      "750 ml",
      "1 L",
      "1,5 L",
      "2 L",
      "5 L",
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProductModal({
  onClose,
}: NewProductModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("0");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [featured, setFeatured] = useState(false);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [mainImageId, setMainImageId] = useState<string | null>(null);

  const [options, setOptions] = useState<ProductOption[]>([]);
  const [quickOption, setQuickOption] = useState("");
  const [quickValues, setQuickValues] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [images]);

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setError("");
    setMessage("");

    const validImages: ProductImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" não é uma imagem válida.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError(`"${file.name}" ultrapassa o limite de 1 MB.`);
        continue;
      }

      validImages.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setImages((current) => [...current, ...validImages]);

    if (!mainImageId && validImages.length > 0) {
      setMainImageId(validImages[0].id);
    }

    event.target.value = "";
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter((item) => item.id !== id);
    });

    if (mainImageId === id) {
      const remaining = images.filter((item) => item.id !== id);
      setMainImageId(remaining[0]?.id || null);
    }
  }

  function addOption() {
    setOptions((current) => [
      ...current,
      {
        name: "",
        values: [""],
      },
    ]);
  }

  function removeOption(index: number) {
    setOptions((current) =>
      current.filter((_, i) => i !== index),
    );
  }

  function updateOptionName(index: number, value: string) {
    setOptions((current) =>
      current.map((option, i) =>
        i === index
          ? {
              ...option,
              name: value,
            }
          : option,
      ),
    );
  }

  function updateOptionValue(
    optionIndex: number,
    valueIndex: number,
    value: string,
  ) {
    setOptions((current) =>
      current.map((option, i) =>
        i === optionIndex
          ? {
              ...option,
              values: option.values.map((item, j) =>
                j === valueIndex ? value : item,
              ),
            }
          : option,
      ),
    );
  }

  function addOptionValue(index: number) {
    setOptions((current) =>
      current.map((option, i) =>
        i === index
          ? {
              ...option,
              values: [...option.values, ""],
            }
          : option,
      ),
    );
  }

  function removeOptionValue(
    optionIndex: number,
    valueIndex: number,
  ) {
    setOptions((current) =>
      current.map((option, i) => {
        if (i !== optionIndex) {
          return option;
        }

        const values = option.values.filter(
          (_, j) => j !== valueIndex,
        );

        return {
          ...option,
          values: values.length ? values : [""],
        };
      }),
    );
  }

  function toggleQuickValue(value: string) {
    setQuickValues((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  function addQuickOption() {
    const selected = QUICK_OPTIONS.find(
      (item) => item.id === quickOption,
    );

    if (!selected || quickValues.length === 0) {
      setError("Escolha uma opção e pelo menos um valor.");
      return;
    }

    setError("");

    setOptions((current) => {
      const existingIndex = current.findIndex(
        (option) =>
          option.name.toLowerCase() ===
          selected.name.toLowerCase(),
      );

      if (existingIndex >= 0) {
        return current.map((option, index) =>
          index === existingIndex
            ? {
                ...option,
                values: Array.from(
                  new Set([
                    ...option.values.filter(Boolean),
                    ...quickValues,
                  ]),
                ),
              }
            : option,
        );
      }

      return [
        ...current,
        {
          name: selected.name,
          values: quickValues,
        },
      ];
    });

    setMessage(`${selected.name} adicionada.`);
    setQuickValues([]);
  }

  function handleSave() {
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Digite o nome do produto.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Digite um preço válido.");
      return;
    }

    if (
      compareAtPrice &&
      Number(compareAtPrice) <= Number(price)
    ) {
      setError(
        "O preço antigo deve ser maior que o preço actual.",
      );
      return;
    }

    setMessage(
      "Produto preparado. A ligação com o Neon será feita no próximo passo.",
    );
  }

  const selectedQuickOption = QUICK_OPTIONS.find(
    (item) => item.id === quickOption,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] sm:p-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xl">
        {/* Header */}
        <div className="border-b border-slate-100 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
                Gestão de produtos
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Novo produto
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Adicione um novo produto à sua loja.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {(error || message) && (
          <div className="px-5 pt-5 sm:px-7">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Informações */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-950">
                  Informações do produto
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Defina as informações principais do produto.
                </p>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Nome do produto

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Ex: Camiseta Nike"
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="mt-5 block text-sm font-medium text-slate-700">
                Descrição

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={6}
                  placeholder="Descrição do produto"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  URL do produto
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {slugify(name) || "nome-do-produto"}
                </p>
              </div>
            </section>

            {/* Imagens */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Imagens do produto
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Adicione várias imagens e escolha a principal.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <ImagePlus className="h-4 w-4 text-slate-500" />
                  Adicionar imagens

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImages}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                    <ImagePlus className="h-6 w-6 text-slate-400" />
                  </div>

                  <p className="text-sm font-medium text-slate-700">
                    Nenhuma imagem adicionada
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    JPG, PNG ou WebP até 1 MB.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={image.preview}
                        alt={name || "Produto"}
                        className="aspect-square w-full object-cover"
                      />

                      {mainImageId === image.id && (
                        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white">
                          <Star
                            className="h-3 w-3"
                            fill="currentColor"
                          />
                          Principal
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 flex gap-2 bg-slate-950/60 p-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                        {mainImageId !== image.id && (
                          <button
                            type="button"
                            onClick={() =>
                              setMainImageId(image.id)
                            }
                            className="flex-1 rounded-lg bg-white px-2 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Principal
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                          aria-label="Remover imagem"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Upload className="h-4 w-4 text-slate-400" />
                  Cada imagem pode ter no máximo 1 MB.
                </div>
              </div>
            </section>

            {/* Preço */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-950">
                  Preço
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Defina o preço actual e, se necessário, o preço antigo.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Preço actual (MZN)

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                    placeholder="15000"
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Preço antigo

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(event) =>
                      setCompareAtPrice(event.target.value)
                    }
                    placeholder="18000"
                    className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>
            </section>

            {/* Variantes */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Variantes do produto
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tamanho, cor, calçado, armazenamento, volume e
                    opções personalizadas.
                  </p>
                </div>
              </div>

              {/* Adicionar rapidamente */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <Zap className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Adicionar rapidamente
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Escolha uma opção pronta.
                    </p>
                  </div>
                </div>

                <select
                  value={quickOption}
                  onChange={(event) => {
                    setQuickOption(event.target.value);
                    setQuickValues([]);
                  }}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">
                    Selecionar tipo...
                  </option>

                  {QUICK_OPTIONS.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                    >
                      {option.name}
                    </option>
                  ))}

                  <option value="custom">
                    Personalizado
                  </option>
                </select>

                {selectedQuickOption && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-700">
                        Valores
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setQuickValues(
                            selectedQuickOption.values,
                          )
                        }
                        className="text-xs font-medium text-emerald-600 transition hover:text-emerald-700"
                      >
                        Seleccionar todos
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {selectedQuickOption.values.map(
                        (value) => {
                          const selected =
                            quickValues.includes(value);

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                toggleQuickValue(value)
                              }
                              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                                selected
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
                              }`}
                            >
                              {selected && "✓ "}
                              {value}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={addQuickOption}
                      className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar opção
                    </button>
                  </div>
                )}

                {quickOption === "custom" && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex gap-3">
                      <Settings2 className="h-5 w-5 shrink-0 text-slate-400" />

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Opção personalizada
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Crie uma opção personalizada abaixo.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Opções adicionadas */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Opções adicionadas
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Personalize os valores.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </button>
                </div>

                {options.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center text-sm text-slate-400">
                    Nenhuma opção adicionada.
                  </div>
                )}

                <div className="space-y-4">
                  {options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex gap-3">
                        <input
                          value={option.name}
                          onChange={(event) =>
                            updateOptionName(
                              optionIndex,
                              event.target.value,
                            )
                          }
                          placeholder="Nome da opção"
                          className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeOption(optionIndex)
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                          aria-label="Remover opção"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        {option.values.map(
                          (value, valueIndex) => (
                            <div
                              key={valueIndex}
                              className="flex gap-3"
                            >
                              <input
                                value={value}
                                onChange={(event) =>
                                  updateOptionValue(
                                    optionIndex,
                                    valueIndex,
                                    event.target.value,
                                  )
                                }
                                placeholder="Valor"
                                className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeOptionValue(
                                    optionIndex,
                                    valueIndex,
                                  )
                                }
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                                aria-label="Remover valor"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ),
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addOptionValue(optionIndex)
                        }
                        className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-emerald-600 transition hover:text-emerald-700"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar valor
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right */}
          <aside className="space-y-6">
            {/* Organização */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-base font-semibold text-slate-950">
                Organização
              </h2>

              <label className="text-sm font-medium text-slate-700">
                Categoria

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">
                    Sem categoria
                  </option>

                  <option value="Moda masculina">
                    Moda masculina
                  </option>

                  <option value="Moda feminina">
                    Moda feminina
                  </option>

                  <option value="Calçados">
                    Calçados
                  </option>

                  <option value="Eletrónicos">
                    Eletrónicos
                  </option>
                </select>
              </label>
            </section>

            {/* Inventário */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-base font-semibold text-slate-950">
                Inventário
              </h2>

              <label className="text-sm font-medium text-slate-700">
                Quantidade em stock

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(event) =>
                    setStock(event.target.value)
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </section>

            {/* Estado */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-base font-semibold text-slate-950">
                Estado
              </h2>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "active"
                      | "draft",
                  )
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                <option value="active">
                  Ativo
                </option>

                <option value="draft">
                  Rascunho
                </option>
              </select>
            </section>

            {/* Visibilidade */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-base font-semibold text-slate-950">
                Visibilidade
              </h2>

              <label className="flex cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
                />

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Produto em destaque
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Mostrar nas áreas de destaque.
                  </p>
                </div>
              </label>
            </section>

            {/* Ações */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <button
                type="button"
                onClick={handleSave}
                className="h-10 w-full rounded-xl bg-emerald-600 px-6 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Guardar produto
              </button>

              <button
                type="button"
                onClick={onClose}
                className="mt-3 h-10 w-full rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
              >
                Cancelar
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}