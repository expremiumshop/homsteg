import {
  Package,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function ProductDetails() {
  const cards = [
    {
      icon: Truck,
      title: "Envio rápido",
      text: "Processamos o seu pedido com agilidade e enviamos em até 48h.",
    },
    {
      icon: RotateCcw,
      title: "Troca simples",
      text: "Facilidade para trocar o produto quando necessário.",
    },
    {
      icon: ShieldCheck,
      title: "Compra segura",
      text: "Seu pagamento e seus dados protegidos.",
    },
    {
      icon: Package,
      title: "Produto original",
      text: "Produto analisado e conferido pela nossa equipa.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl bg-neutral-100 p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white">
              <Icon className="h-4.5 w-4.5" />
            </div>

            <h3 className="mt-4 text-sm font-black text-neutral-950">
              {card.title}
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-neutral-500">
              {card.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ProductDetails;
