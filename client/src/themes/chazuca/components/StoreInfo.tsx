import { chazucaColors, chazucaBodyFont, chazucaHeadingFont } from "../theme";

type StoreInfoProps = {
  name?: string;
  category?: string | null;
  currency?: string | null;
};

export function StoreInfo({
  name = "Chazuca Lab",
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
        borderColor: chazucaColors.border,
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <div
          className="flex flex-col gap-5 rounded-3xl border p-6 sm:flex-row sm:items-center sm:p-8"
          style={{
            background:
              chazucaColors.surface,
            borderColor:
              chazucaColors.border,
          }}
        >
          {/* MONOGRAMA */}

          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold"
            style={{
              background:
                chazucaColors.primary,
              color:
                chazucaColors.primaryContrast,
              fontFamily:
                chazucaHeadingFont,
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
                  chazucaColors.accent,
              }}
            >
              Sobre a loja
            </p>

            <h2
              className="mt-1 text-xl"
              style={{
                fontFamily:
                  chazucaHeadingFont,
                fontWeight: 700,
                color: chazucaColors.text,
              }}
            >
              {name}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
              {category ||
                "Comércio online"}{" "}
              · Moçambique
            </p>
          </div>

          {/* MOEDA */}

          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: chazucaColors.bg,
            }}
          >
            <p
              className="text-[11px] uppercase tracking-wide"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
              Moeda
            </p>

            <p
              className="mt-0.5 text-sm font-semibold"
              style={{
                color: chazucaColors.text,
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
