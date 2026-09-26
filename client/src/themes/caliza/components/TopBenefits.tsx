import { Gem, Gift, Palette } from "lucide-react";

import { calizaColors, calizaBodyFont } from "../theme";

const icons = {
  author: Palette,
  edition: Gem,
  gift: Gift,
};

type TopBenefitsProps = {
  items?: { title: string; icon?: keyof typeof icons }[];
};

export function TopBenefits({
  items = [
    { title: "Peças de autor", icon: "author" },
    {
      title: "Edições limitadas",
      icon: "edition",
    },
    { title: "Embalagem de presente", icon: "gift" },
  ],
}: TopBenefitsProps) {
  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-8 sm:px-8"
      style={{
        fontFamily: calizaBodyFont,
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon =
            (item.icon && icons[item.icon]) ||
            Palette;

          return (
            <div
              key={item.title}
              className="flex min-h-[76px] items-center gap-3.5 rounded-xl border px-5 py-4"
              style={{
                background:
                  calizaColors.surface,
                borderColor:
                  calizaColors.border,
                color: calizaColors.text,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, #c2410c 12%, transparent)",
                  color: "#c2410c",
                }}
              >
                <Icon size={18} />
              </div>

              <p className="text-sm font-semibold">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TopBenefits;
