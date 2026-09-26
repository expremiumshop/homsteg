import { useState } from "react";

import { Search, X } from "lucide-react";

import { urbanPopularSearches } from "../demoData";

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchPanel({
  open,
  onClose,
}: SearchPanelProps) {
  const [value, setValue] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-white">
      <div className="mx-auto max-w-[900px] px-5 py-8 md:px-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
            Pesquisa
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100"
            aria-label="Fechar pesquisa"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-12 flex items-center gap-4 border-b-2 border-neutral-950 pb-4">
          <Search className="h-6 w-6 text-neutral-400" />

          <input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Pesquisar produtos..."
            className="w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-neutral-300 md:text-4xl"
          />
        </div>

        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
            Pesquisas populares
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {urbanPopularSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setValue(item)}
                className="rounded-full bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
