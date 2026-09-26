import { chazucaColors, chazucaBodyFont, chazucaHeadingFont } from "../theme";

type CategoryMenuProps = {
  categories: string[];
  category?: string;
  onCategory?: (category: string) => void;
  onScrollToProducts?: () => void;
};

export function CategoryMenu({
  categories,
  category = "Todos",
  onCategory,
  onScrollToProducts,
}: CategoryMenuProps) {
  function handleSelect(name: string) {
    onCategory?.(name);

    onScrollToProducts?.();
  }

  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-10 sm:px-8"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      <div className="mb-6 text-center">
        <p
          className="text-[11px] uppercase tracking-[0.28em]"
          style={{
            color: chazucaColors.textMuted,
          }}
        >
          Universos
        </p>

        <h2
          className="mt-2 text-2xl sm:text-3xl"
          style={{
            fontFamily: chazucaHeadingFont,
            fontWeight: 700,
            color: chazucaColors.text,
          }}
        >
          Navega pelo clima
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {categories.map((name) => {
          const isActive = category === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => handleSelect(name)}
              className="rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition"
              style={{
                background: isActive
                  ? chazucaColors.primary
                  : chazucaColors.surface,
                color: isActive
                  ? chazucaColors.primaryContrast
                  : chazucaColors.text,
                borderColor: isActive
                  ? chazucaColors.primary
                  : chazucaColors.border,
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryMenu;
