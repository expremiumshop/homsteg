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
  file?: File;
  preview: string;
  isExisting?: boolean;
};

type ProductOption = {
  name: string;
  values: string[];
};

type Product = {
  id?: number;
  name?: string;
  description?: string | null;
  priceMzn?: number;
  compareAtPriceMzn?: number | null;
  category?: string | null;
  stock?: number;
  status?: "active" | "draft" | "archived";
  imageUrl?: string | null;
  featured?: boolean;
  images?: string[];
  options?: ProductOption[];
};

type EditProductModalProps = {
  product?: Product;
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

export default function EditProductModal({
  product,
  onClose,
}: EditProductModalProps) {
  const [name, setName] = useState(product?.name || "");

  const [description, setDescription] = useState(
    product?.description || "",
  );

  const [price, setPrice] = useState(
    product?.priceMzn?.toString() || "",
  );

  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPriceMzn?.toString() || "",
  );

  const [category, setCategory] = useState(
    product?.category || "",
  );

  const [stock, setStock] = useState(
    product?.stock?.toString() || "0",
  );

  const [status, setStatus] = useState<
    "active" | "draft" | "archived"
  >(product?.status || "active");

  const [featured, setFeatured] = useState(
    product?.featured || false,
  );

  const [images, setImages] = useState<ProductImage[]>(() => {
    const existingImages = product?.images?.length
      ? product.images
      : product?.imageUrl
        ? [product.imageUrl]
        : [];

    return existingImages.map((url, index) => ({
      id: `existing-${index}`,
      preview: url,
      isExisting: true,
    }));
  });

  const [mainImageId, setMainImageId] = useState<string | null>(
    () => {
      if (product?.imageUrl) {
        const index =
          product.images?.findIndex(
            (url) => url === product.imageUrl,
          ) ?? 0;

        return `existing-${Math.max(index, 0)}`;
      }

      return product?.images?.length ? "existing-0" : null;
    },
  );

  const [options, setOptions] = useState<ProductOption[]>(
    product?.options || [],
  );

  const [quickOption, setQuickOption] = useState("");

  const [quickValues, setQuickValues] = useState<string[]>([]);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (!image.isExisting) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  function handleImages(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setError("");
    setMessage("");

    const validImages: ProductImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(
          `"${file.name}" não é uma imagem válida.`,
        );
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError(
          `"${file.name}" ultrapassa o limite de 1 MB.`,
        );
        continue;
      }

      validImages.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        isExisting: false,
      });
    }

    setImages((current) => [
      ...current,
      ...validImages,
    ]);

    event.target.value = "";
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find(
        (item) => item.id === id,
      );

      if (image && !image.isExisting) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter(
        (item) => item.id !== id,
      );
    });

    if (mainImageId === id) {
      const remaining = images.filter(
        (item) => item.id !== id,
      );

      setMainImageId(
        remaining[0]?.id || null,
      );
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
      current.filter(
        (_, i) => i !== index,
      ),
    );
  }

  function updateOptionName(
    index: number,
    value: string,
  ) {
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
              values: option.values.map(
                (item, j) =>
                  j === valueIndex
                    ? value
                    : item,
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
              values: [
                ...option.values,
                "",
              ],
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
          values: values.length
            ? values
            : [""],
        };
      }),
    );
  }

  function toggleQuickValue(
    value: string,
  ) {
    setQuickValues((current) =>
      current.includes(value)
        ? current.filter(
            (item) => item !== value,
          )
        : [...current, value],
    );
  }

  function addQuickOption() {
    const selected = QUICK_OPTIONS.find(
      (item) => item.id === quickOption,
    );

    if (
      !selected ||
      quickValues.length === 0
    ) {
      setError(
        "Escolha uma opção e pelo menos um valor.",
      );
      return;
    }

    setError("");

    setOptions((current) => {
      const existingIndex =
        current.findIndex(
          (option) =>
            option.name.toLowerCase() ===
            selected.name.toLowerCase(),
        );

      if (existingIndex >= 0) {
        return current.map(
          (option, index) =>
            index === existingIndex
              ? {
                  ...option,
                  values: Array.from(
                    new Set([
                      ...option.values.filter(
                        Boolean,
                      ),
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

    setMessage(
      `${selected.name} actualizada.`,
    );

    setQuickValues([]);
  }

  function handleSave() {
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError(
        "Digite o nome do produto.",
      );
      return;
    }

    if (!price || Number(price) <= 0) {
      setError(
        "Digite um preço válido.",
      );
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
      "Alterações prontas. A ligação com o Neon será feita no próximo passo.",
    );
  }

  const selectedQuickOption =
    QUICK_OPTIONS.find(
      (item) => item.id === quickOption,
    );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 sm:px-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Editar Produto
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Actualize as informações do produto.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* MENSAGENS */}
        {(error || message) && (
          <div className="px-5 pt-5 sm:px-7">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-700">
                {message}
              </div>
            )}
          </div>
        )}

        {/* CONTEÚDO */}
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-3">
          {/* ESQUERDA */}
          <div className="space-y-6 lg:col-span-2">
            {/* INFORMAÇÕES */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="mb-6 text-xl font-bold text-slate-950">
                Informações do Produto
              </h2>

              <label className="block text-sm font-semibold text-slate-800">
                Nome do produto

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Nome do produto"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="mt-5 block text-sm font-semibold text-slate-800">
                Descrição

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value,
                    )
                  }
                  rows={6}
                  placeholder="Descrição do produto"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  URL do produto
                </p>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {slugify(name) ||
                    "nome-do-produto"}
                </p>
              </div>
            </section>

            {/* IMAGENS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Imagens do Produto
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Adicione, remova ou altere a imagem principal.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700">
                  <ImagePlus size={20} />

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
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
                  <ImagePlus
                    size={48}
                    className="mx-auto mb-4 text-slate-300"
                  />

                  <p className="font-semibold text-slate-600">
                    Nenhuma imagem
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Adicione uma imagem ao produto.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
                    >
                      <img
                        src={image.preview}
                        alt={name || "Produto"}
                        className="aspect-square w-full object-cover"
                      />

                      {mainImageId === image.id && (
                        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
                          <Star
                            size={12}
                            fill="currentColor"
                          />
                          Principal
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 flex gap-2 bg-slate-950/60 p-2">
                        {mainImageId !== image.id && (
                          <button
                            type="button"
                            onClick={() =>
                              setMainImageId(
                                image.id,
                              )
                            }
                            className="flex-1 rounded-lg bg-white px-2 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            Principal
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              image.id,
                            )
                          }
                          className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                          aria-label="Remover imagem"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                <div className="flex gap-2">
                  <Upload size={18} />

                  <span>
                    JPG, PNG ou WebP. Cada imagem até 1 MB.
                  </span>
                </div>
              </div>
            </section>

            {/* PREÇO */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="mb-6 text-xl font-bold text-slate-950">
                Preço
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-800">
                  Preço actual (MZN)

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="text-sm font-semibold text-slate-800">
                  Preço antigo

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) =>
                      setCompareAtPrice(
                        e.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>
            </section>

            {/* VARIANTES */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Variantes do Produto
                  </h2>

                  <p className="text-sm text-slate-500">
                    Edite tamanhos, cores e outras opções.
                  </p>
                </div>
              </div>

              {/* OPÇÕES RÁPIDAS */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <Zap
                    size={19}
                    className="text-emerald-600"
                  />

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Adicionar rapidamente
                    </h3>

                    <p className="text-sm text-slate-500">
                      Escolha uma opção pronta.
                    </p>
                  </div>
                </div>

                <select
                  value={quickOption}
                  onChange={(e) => {
                    setQuickOption(
                      e.target.value,
                    );
                    setQuickValues([]);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">
                    Seleccionar tipo...
                  </option>

                  {QUICK_OPTIONS.map(
                    (option) => (
                      <option
                        key={option.id}
                        value={option.id}
                      >
                        {option.name}
                      </option>
                    ),
                  )}

                  <option value="custom">
                    Personalizado
                  </option>
                </select>

                {selectedQuickOption && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold text-slate-800">
                        Valores
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setQuickValues(
                            selectedQuickOption.values,
                          )
                        }
                        className="text-xs font-bold text-emerald-600 hover:underline"
                      >
                        Seleccionar todos
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {selectedQuickOption.values.map(
                        (value) => {
                          const selected =
                            quickValues.includes(
                              value,
                            );

                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                toggleQuickValue(
                                  value,
                                )
                              }
                              className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                                selected
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
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
                      onClick={
                        addQuickOption
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
                    >
                      <Plus size={18} />
                      Adicionar opção
                    </button>
                  </div>
                )}

                {quickOption === "custom" && (
                  <div className="mt-5 rounded-xl border border-slate-100 bg-white p-4">
                    <div className="flex gap-3">
                      <Settings2
                        size={20}
                        className="text-slate-500"
                      />

                      <div>
                        <p className="font-bold text-slate-900">
                          Opção personalizada
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Crie uma opção personalizada abaixo.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* OPÇÕES EXISTENTES */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Opções do produto
                    </h3>

                    <p className="text-sm text-slate-500">
                      Edite ou adicione valores.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Plus size={17} />
                    Adicionar
                  </button>
                </div>

                {options.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    Nenhuma variante configurada.
                  </div>
                )}

                <div className="space-y-4">
                  {options.map(
                    (
                      option,
                      optionIndex,
                    ) => (
                      <div
                        key={optionIndex}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex gap-3">
                          <input
                            value={
                              option.name
                            }
                            onChange={(e) =>
                              updateOptionName(
                                optionIndex,
                                e.target.value,
                              )
                            }
                            placeholder="Nome da opção"
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeOption(
                                optionIndex,
                              )
                            }
                            className="rounded-xl border border-red-100 bg-red-50 p-3 text-red-600 transition hover:bg-red-100"
                            aria-label="Remover opção"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 space-y-3">
                          {option.values.map(
                            (
                              value,
                              valueIndex,
                            ) => (
                              <div
                                key={
                                  valueIndex
                                }
                                className="flex gap-3"
                              >
                                <input
                                  value={value}
                                  onChange={(e) =>
                                    updateOptionValue(
                                      optionIndex,
                                      valueIndex,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Valor"
                                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOptionValue(
                                      optionIndex,
                                      valueIndex,
                                    )
                                  }
                                  className="rounded-xl border border-slate-200 bg-white p-3 text-red-600 transition hover:border-red-200 hover:bg-red-50"
                                  aria-label="Remover valor"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            ),
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addOptionValue(
                              optionIndex,
                            )
                          }
                          className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                        >
                          <Plus size={16} />
                          Adicionar valor
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* DIREITA */}
          <aside className="space-y-6">
            {/* ORGANIZAÇÃO */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-xl font-bold text-slate-950">
                Organização
              </h2>

              <label className="text-sm font-semibold text-slate-800">
                Categoria

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
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

            {/* ESTOQUE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-xl font-bold text-slate-950">
                Inventário
              </h2>

              <label className="text-sm font-semibold text-slate-800">
                Quantidade em estoque

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(
                      e.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </section>

            {/* ESTADO */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-xl font-bold text-slate-950">
                Estado
              </h2>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "active"
                      | "draft"
                      | "archived",
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                <option value="active">
                  Ativo
                </option>

                <option value="draft">
                  Rascunho
                </option>

                <option value="archived">
                  Arquivado
                </option>
              </select>
            </section>

            {/* VISIBILIDADE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-5 text-xl font-bold text-slate-950">
                Visibilidade
              </h2>

              <label className="flex cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(
                      e.target.checked,
                    )
                  }
                  className="mt-1 h-5 w-5 accent-emerald-600"
                />

                <div>
                  <p className="font-semibold text-slate-800">
                    Produto em destaque
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Mostrar nas áreas de destaque.
                  </p>
                </div>
              </label>
            </section>

            {/* AÇÕES */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700"
              >
                Guardar Alterações
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}