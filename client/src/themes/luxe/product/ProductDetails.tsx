import {
  Crown,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function ProductDetails() {
  const cards = [
    {
      icon: Truck,
      title: "Entrega rápida",
      text: "Para todo Moçambique.",
    },
    {
      icon: ShieldCheck,
      title: "Compra protegida",
      text: "Segurança em cada pedido.",
    },
    {
      icon: Crown,
      title: "Qualidade garantida",
      text: "Produtos selecionados.",
    },
    {
      icon: Headphones,
      title: "Suporte dedicado",
      text: "Estamos aqui para ajudar.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl bg-slate-50 p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Icon className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900">
              {card.title}
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-slate-400">
              {card.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ProductDetails;
