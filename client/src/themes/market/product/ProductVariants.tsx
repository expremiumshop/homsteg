import { useEffect, useState } from "react";

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
    <div className="space-y-5">
      {options.map((option) => (
        <div key={option.id}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {option.name}
            </h3>

            {selected[option.name] && (
              <span className="text-xs text-slate-400">
                Selecionado:{" "}
                <strong className="font-bold text-emerald-600">
                  {selected[option.name]}
                </strong>
              </span>
            )}
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
                  className={`min-w-[52px] rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
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
