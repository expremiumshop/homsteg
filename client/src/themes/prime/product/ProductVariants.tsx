import { useEffect, useState } from "react";

export type PrimeProductOption = {
  id: string;
  name: string;
  values: string[];
};

type ProductVariantsProps = {
  options: PrimeProductOption[];
  onChange?: (
    selected: Record<string, string>,
  ) => void;
};

export function ProductVariants({
  options,
  onChange,
}: ProductVariantsProps) {
  const [selected, setSelected] =
    useState<Record<string, string>>(
      {},
    );

  useEffect(() => {
    const initialSelection: Record<
      string,
      string
    > = {};

    for (const option of options) {
      if (
        option.values.length > 0
      ) {
        initialSelection[option.name] =
          option.values[0];
      }
    }

    setSelected(initialSelection);
    onChange?.(initialSelection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

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
    <div className="space-y-5">
      {options.map((option) => (
        <div key={option.id}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">
              {option.name}
            </p>

            {selected[
              option.name
            ] && (
              <span className="text-xs font-semibold text-slate-500">
                {
                  selected[
                    option.name
                  ]
                }
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {option.values.map(
              (value) => {
                const isSelected =
                  selected[
                    option.name
                  ] === value;

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
                    className={`min-w-[52px] rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-orange-500"
                    }`}
                  >
                    {value}
                  </button>
                );
              },
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductVariants;
