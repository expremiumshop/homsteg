import { ArrowRight, X } from "lucide-react";

import { urbanMenuItems } from "../demoData";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar menu"
      />

      <aside className="relative h-full w-[88%] max-w-[360px] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black uppercase tracking-[0.18em] text-neutral-950">
            Menu
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 space-y-2">
          {urbanMenuItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              {item}

              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
