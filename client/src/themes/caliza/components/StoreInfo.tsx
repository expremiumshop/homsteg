import { calizaColors, calizaBodyFont } from "../theme";

type StoreInfoProps = {
  name?: string;
  category?: string | null;
  currency?: string | null;
};

export function StoreInfo({
  name = "Caliza Studio",
  category,
  currency,
}: StoreInfoProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <section
      className="border-t py-12"
      style={{
        borderColor: calizaColors.border,
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <div
          className="flex flex-col gap-5 rounded-2xl border p-6 sm:flex-row sm:items-center sm:p-8"
          style={{
            background:
              calizaColors.surface,
            borderColor:
              calizaColors.border,
          }}
        >
          {/* MONOGRAMA */}

          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-xl font-semibold"
            style={{
              background:
                calizaColors.primary,
              color:
                calizaColors.primaryContrast,
              fontFamily:
                "'Playfair Display', Georgia, serif",
            }}
          >
            {initials || "C"}
          </div>

          {/* INFORMAÇÕES */}

          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{
                color:
                  calizaColors.accent,
              }}
            >
              Sobre a loja
            </p>

            <h2
              className="mt-1 text-xl"
              style={{
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                fontWeight: 500,
                color: calizaColors.text,
              }}
            >
              {name}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color:
                  calizaColors.textMuted,
              }}
            >
              {category ||
                "Comércio online"}{" "}
              · Moçambique
            </p>
          </div>

          {/* MOEDA */}

          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: calizaColors.bg,
            }}
          >
            <p
              className="text-[11px] uppercase tracking-wide"
              style={{
                color:
                  calizaColors.textMuted,
              }}
            >
              Moeda
            </p>

            <p
              className="mt-0.5 text-sm font-semibold"
              style={{
                color: calizaColors.text,
              }}
            >
              {currency || "MZN"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoreInfo;
