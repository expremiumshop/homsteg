import { ShoppingBag } from "lucide-react";

type LogoProps = {
  storeName: string;
};

export function Logo({ storeName }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
        <ShoppingBag className="h-5 w-5" />
      </div>

      <div className="leading-none">
        <div className="text-[16px] font-black uppercase tracking-[0.16em] text-neutral-950">
          {storeName}
        </div>

        <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.25em] text-neutral-400">
          Store
        </div>
      </div>
    </div>
  );
}
