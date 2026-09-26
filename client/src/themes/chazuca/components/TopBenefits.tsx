import {
  FlaskConical,
  Palette,
  Zap,
} from "lucide-react";

import { chazucaColors, chazucaBodyFont } from "../theme";

const icons = {
  drop: Zap,
  art: Palette,
  lab: FlaskConical,
};

type TopBenefitsProps = {
  items?: { title: string; icon?: keyof typeof icons }[];
};

export function TopBenefits({
  items = [
    { title: "Drops limitados", icon: "drop" },
    {
      title: "Arte de autores locais",
      icon: "art",
    },
    { title: "Envio expresso", icon: "lab" },
  ],
}: TopBenefitsProps) {
  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-8 sm:px-8"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon =
            (item.icon && icons[item.icon]) ||
            Zap;

          return (
            <div
              key={item.title}
              className="flex min-h-[76px] items-center gap-3.5 rounded-2xl border px-5 py-4"
              style={{
                background:
                  chazucaColors.surface,
                borderColor:
                  chazucaColors.border,
                color: chazucaColors.text,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, #7c3aed 12%, transparent)",
                  color: "#7c3aed",
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
