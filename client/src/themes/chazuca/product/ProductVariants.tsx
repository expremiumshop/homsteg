import { useEffect, useState } from "react";

import {
  chazucaColors,
  chazucaBodyFont,
} from "../theme";

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

type ProductVariantsProps = {
  options: ProductOption[];
  onChange?: (
    selected: Record<string, string>,
  ) => void;
};

export function ProductVariants({
  options,
  onChange,
}: ProductVariantsProps) {
  const [selected, setSelected] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const initialSelection: Record<
      string,
      string
    > = {};

    for (const option of options) {
      if (option.values.length > 0) {
        initialSelection[option.name] =
          option.values[0];
      }
    }

    setSelected(initialSelection);

    onChange?.(initialSelection);
  }, [options, onChange]);

  function selectValue(
    optionName: string,
    value: string,
  ) {
    const updated = {
      ...selected,
      [optionName]: value,
    };

    setSelected(updated);

    onChange?.(updated);
  }

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div
      className="space-y-6"
      style={{
        fontFamily: chazucaBodyFont,
      }}
    >
      {options.map((option) => (
        <div key={option.id}>
          <div className="mb-3 flex items-center justify-between">
            <h3
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{
                color: chazucaColors.text,
              }}
            >
              {option.name}
            </h3>

            <span
              className="text-xs"
              style={{
                color:
                  chazucaColors.textMuted,
              }}
            >
              {selected[option.name]}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected =
                selected[option.name] ===
                value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    selectValue(
                      option.name,
                      value,
                    )
                  }
                  className="min-w-[48px] rounded-full border px-4 py-2 text-xs transition"
                  style={{
                    background: isSelected
                      ? chazucaColors.primary
                      : chazucaColors.surface,
                    color: isSelected
                      ? chazucaColors.primaryContrast
                      : chazucaColors.text,
                    borderColor: isSelected
                      ? chazucaColors.primary
                      : chazucaColors.border,
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductVariants;
