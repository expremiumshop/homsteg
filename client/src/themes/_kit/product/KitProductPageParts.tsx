import { useEffect, useState } from "react";
import {
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { useCart } from "@/contexts/CartContext";
import { formatMzn } from "../lib";
import { TkButton, TkCard } from "../ui";

/* ============================================================
 * GALERIA
 * ============================================================ */
export interface KitGalleryImage {
  id: string;
  image_url: string;
  position?: number | null;
}

export function KitProductGallery({
  image,
  name,
  images = [],
}: {
  image?: string | null;
  name: string;
  images?: KitGalleryImage[];
}) {
  const all = [
    ...(image ? [{ id: "main-image", image_url: image, position: -1 }] : []),
    ...images,
  ];
  const unique = Array.from(
    new Map(all.filter((i) => i?.image_url).map((i) => [i.image_url, i])).values(),
  );

  const [active, setActive] = useState(unique[0]?.image_url || "/placeholder.svg");

  useEffect(() => {
    setActive(unique[0]?.image_url || "/placeholder.svg");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, images]);

  if (unique.length === 0) {
    return (
      <div
        className="relative aspect-square w-full overflow-hidden border"
        style={{
          borderColor: "var(--tk-border)",
          borderRadius: "var(--tk-card-radius)",
          background: "var(--tk-surface)",
        }}
      >
        <img src="/placeholder.svg" alt={name} className="absolute inset-0 h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="relative aspect-square w-full overflow-hidden border"
        style={{
          borderColor: "var(--tk-border)",
          borderRadius: "var(--tk-card-radius)",
          background: "var(--tk-surface)",
        }}
      >
        <img src={active} alt={name} className="absolute inset-0 h-full w-full object-contain p-2" />
      </div>

      {unique.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {unique.map((item, index) => {
            const selected = active === item.image_url;
            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={() => setActive(item.image_url)}
                aria-label={`Selecionar imagem ${index + 1}`}
                className="relative h-16 w-16 shrink-0 overflow-hidden border-2"
                style={{
                  borderColor: selected ? "var(--tk-primary)" : "var(--tk-border)",
                  borderRadius: "var(--tk-radius)",
                  background: "var(--tk-surface)",
                }}
              >
                <img
                  src={item.image_url}
                  alt={`${name} - imagem ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {unique.length > 1 && (
        <div className="mt-2 text-xs text-[var(--tk-muted)]">{unique.length} imagens</div>
      )}
    </div>
  );
}

/* ============================================================
 * VARIANTES
 * ============================================================ */
export interface KitProductOption {
  id: string;
  name: string;
  values: string[];
}

function KitProductVariants({
  options,
  onChange,
}: {
  options: KitProductOption[];
  onChange: (selected: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <p className="mb-2 text-sm font-semibold text-[var(--tk-text)]">
            {option.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ [option.name]: value })}
                className="border-2 px-4 py-2 text-sm font-semibold transition"
                style={{ borderRadius: "var(--tk-radius)" }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * AÇÕES DE COMPRA (quantidade + carrinho + comprar agora)
 * ============================================================ */
export function KitProductPurchaseSection({
  product,
  options = [],
  storeSlug,
  checkoutPath,
}: {
  product: {
    id: number | string;
    name: string;
    price: number;
    image?: string | null;
    image_url?: string | null;
    stock: number;
  };
  options?: KitProductOption[];
  storeSlug?: string;
  checkoutPath: string;
}) {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  const stock = Number(product?.stock ?? 0);

  function validate() {
    if (options.length === 0) return true;
    const missing = options
      .filter((o) => o.name && o.values.length > 0)
      .filter((o) => !selected[o.name]?.trim());
    if (missing.length > 0) {
      alert(`Selecione as variantes: ${missing.map((o) => o.name).join(", ")}`);
      return false;
    }
    return true;
  }

  function cartItem() {
    return {
      id: String(product.id),
      name: product.name,
      price: Number(product.price ?? 0),
      image_url:
        (product as { image_url?: string | null }).image_url ||
        product.image ||
        undefined,
      variants: options.length > 0 ? selected : undefined,
      quantity,
      storeSlug,
    };
  }

  function handleAdd() {
    if (stock <= 0) {
      alert("Este produto está sem stock.");
      return;
    }
    if (!validate()) return;
    addToCart(cartItem());
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (stock <= 0) {
      alert("Este produto está sem stock.");
      return;
    }
    if (!validate()) return;
    setBuying(true);
    addToCart(cartItem());
    navigate(checkoutPath);
  }

  return (
    <div className="space-y-5">
      {options.length > 0 && (
        <KitProductVariants options={options} onChange={setSelected} />
      )}

      <div>
        <p className="mb-2 text-sm font-semibold text-[var(--tk-text)]">Quantidade</p>
        <div
          className="flex w-fit items-center overflow-hidden border"
          style={{
            borderColor: "var(--tk-border)",
            borderRadius: "var(--tk-radius)",
            background: "var(--tk-surface)",
          }}
        >
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
            className="flex h-11 w-11 items-center justify-center transition hover:bg-black/5 disabled:opacity-40"
          >
            <Minus size={17} />
          </button>
          <span className="flex h-11 min-w-[52px] items-center justify-center border-x px-3 font-semibold"
            style={{ borderColor: "var(--tk-border)" }}>
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => (stock > 0 ? Math.min(stock, q + 1) : q))}
            disabled={stock <= 0 || quantity >= stock}
            aria-label="Aumentar quantidade"
            className="flex h-11 w-11 items-center justify-center transition hover:bg-black/5 disabled:opacity-40"
          >
            <Plus size={17} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TkButton
          variant="outline"
          size="lg"
          onClick={handleAdd}
          disabled={stock <= 0}
          aria-label="Adicionar produto ao carrinho"
          className={added ? "!border-green-500 !text-green-600" : ""}
        >
          {added ? (
            <>
              <Check size={19} />
              Adicionado
            </>
          ) : (
            <>
              <ShoppingCart size={19} />
              Adicionar ao carrinho
            </>
          )}
        </TkButton>

        <TkButton
          size="lg"
          onClick={handleBuyNow}
          disabled={stock <= 0 || buying}
          aria-label="Comprar agora"
        >
          <Zap size={19} className={buying ? "animate-pulse" : ""} />
          {buying ? "A abrir..." : "Comprar agora"}
        </TkButton>
      </div>

      <p className="text-xs text-[var(--tk-muted)]">
        Pagamento seguro • Produto protegido • Compra garantida
      </p>
    </div>
  );
}

/* ============================================================
 * CARTÕES: PORTES + GARANTIA
 * ============================================================ */
export function KitShippingCard() {
  return (
    <TkCard className="flex items-start gap-3 p-4">
      <Truck size={20} className="mt-0.5 shrink-0 text-[var(--tk-primary)]" />
      <div>
        <h3 className="text-sm font-bold text-[var(--tk-text)]">Entrega rápida</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--tk-muted)]">
          Entregas em todo o território nacional. O prazo e o custo de entrega
          são confirmados pela nossa equipa após o pedido.
        </p>
      </div>
    </TkCard>
  );
}

export function KitGuaranteeCard() {
  return (
    <TkCard className="flex items-start gap-3 p-4">
      <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[var(--tk-primary)]" />
      <div>
        <h3 className="text-sm font-bold text-[var(--tk-text)]">Compra garantida</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--tk-muted)]">
          Compra acompanhada pela nossa equipa. Pagamento apenas após
          confirmação da disponibilidade dos produtos.
        </p>
      </div>
    </TkCard>
  );
}

/* ============================================================
 * TABS (descrição / detalhes)
 * ============================================================ */
export function KitProductTabs({
  description,
  category,
  stock,
}: {
  description?: string | null;
  category?: string | null;
  stock: number;
}) {
  const [tab, setTab] = useState<"descricao" | "detalhes">("descricao");

  return (
    <div className="px-4 py-5 md:px-6">
      <div className="mb-4 flex gap-2">
        {(
          [
            ["descricao", "Descrição"],
            ["detalhes", "Detalhes"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="px-4 py-2 text-sm font-bold transition"
            style={{
              borderRadius: "var(--tk-radius)",
              background:
                tab === key ? "var(--tk-primary)" : "transparent",
              color:
                tab === key
                  ? "var(--tk-primary-contrast)"
                  : "var(--tk-muted)",
              border: "1px solid var(--tk-border)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "descricao" ? (
        <div className="text-sm leading-7 text-[var(--tk-muted)]">
          {description ? (
            <p>{description}</p>
          ) : (
            <p>Este produto oferece qualidade e uma excelente experiência de compra.</p>
          )}
        </div>
      ) : (
        <ul className="space-y-2 text-sm text-[var(--tk-muted)]">
          <li>✓ Produto original verificado</li>
          <li>✓ Compra segura</li>
          <li>✓ Suporte ao cliente</li>
          <li>✓ Stock: {stock} unidades</li>
          {category && <li>✓ Categoria: {category}</li>}
        </ul>
      )}
    </div>
  );
}

/* ============================================================
 * AVALIAÇÕES (estático, como na Nova)
 * ============================================================ */
export function KitReviewsSection() {
  const reviews = [
    { name: "Ana M.", rating: 5, text: "Excelente produto e atendimento muito rápido." },
    { name: "Carlos T.", rating: 5, text: "Entrega dentro do prazo. Recomendo!" },
    { name: "Sofia R.", rating: 4, text: "Boa qualidade pelo preço. Muito satisfeita." },
  ];

  return (
    <TkCard className="p-5 md:p-6">
      <h2 className="text-lg font-bold text-[var(--tk-text)]">Avaliações dos clientes</h2>
      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="border-b pb-4 last:border-b-0 last:pb-0"
            style={{ borderColor: "var(--tk-border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--tk-text)]">{review.name}</span>
              <span className="text-xs" style={{ color: "var(--tk-accent)" }}>
                {"★".repeat(review.rating)}
                <span className="opacity-30">{"★".repeat(5 - review.rating)}</span>
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--tk-muted)]">{review.text}</p>
          </div>
        ))}
      </div>
    </TkCard>
  );
}

/* ============================================================
 * PRODUTOS RELACIONADOS
 * ============================================================ */
export function KitRelatedProducts({
  products,
  basePath,
  storeSlug,
}: {
  products: {
    id: number | string;
    slug: string;
    name: string;
    price: number;
    compare_at_price: number | null;
    image: string | null;
  }[];
  basePath: string;
  storeSlug?: string;
}) {
  const ctx = storeSlug ? `?storeSlug=${encodeURIComponent(storeSlug)}` : "";

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-[var(--tk-text)]">
        Produtos relacionados
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`${basePath}/produto/${encodeURIComponent(product.slug)}${ctx}`}
            className="group overflow-hidden shadow-sm transition hover:shadow-md"
            style={{
              background: "var(--tk-surface)",
              borderRadius: "var(--tk-card-radius)",
              border: "1px solid var(--tk-border)",
            }}
          >
            <div className="relative aspect-square overflow-hidden" style={{ background: "var(--tk-bg)" }}>
              <img
                src={product.image?.trim() || "/placeholder.svg"}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="px-3 py-2">
              <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--tk-text)]">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-[var(--tk-primary)]">
                {formatMzn(product.price)} MZN
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
