import {
  BadgeCheck,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function ServiceBar() {
  const services = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Entrega rápida",
      text: "Receba sem complicações",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Compra segura",
      text: "Seus dados protegidos",
    },
    {
      icon: <BadgeCheck className="h-5 w-5" />,
      title: "Produtos verificados",
      text: "Qualidade selecionada",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Suporte",
      text: "Estamos aqui para ajudar",
    },
  ];

  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {services.map((service) => (
          <div
            key={service.title}
            className="flex items-center gap-3 border-b border-slate-100 px-4 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              {service.icon}
            </div>

            <div>
              <p className="text-xs font-black text-slate-900">
                {service.title}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {service.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiceBar;
