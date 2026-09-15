import { useState } from "react";
import {
  Truck,
  MapPin,
  Package,
  Plus,
  CheckCircle2,
  Clock3,
  Trash2,
} from "lucide-react";

type ShippingZone = {
  id: number;
  name: string;
  regions: string;
  price: number;
  estimatedTime: string;
  enabled: boolean;
};

const initialZones: ShippingZone[] = [
  {
    id: 1,
    name: "Maputo",
    regions: "Cidade de Maputo e arredores",
    price: 150,
    estimatedTime: "1–2 dias",
    enabled: true,
  },
  {
    id: 2,
    name: "Matola",
    regions: "Cidade da Matola",
    price: 200,
    estimatedTime: "1–2 dias",
    enabled: true,
  },
];

function formatMzn(value: number) {
  return `${value.toLocaleString("pt-MZ")} MZN`;
}

export default function ShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>(initialZones);

  const activeZones = zones.filter((zone) => zone.enabled).length;

  const toggleZone = (id: number) => {
    setZones((current) =>
      current.map((zone) =>
        zone.id === id ? { ...zone, enabled: !zone.enabled } : zone,
      ),
    );
  };

  const removeZone = (id: number) => {
    setZones((current) => current.filter((zone) => zone.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
            Logística
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Entrega
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure as regiões, preços e condições de entrega da sua loja.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Adicionar região
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Regiões configuradas
            </span>

            <MapPin className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {zones.length}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Zonas de entrega
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Regiões ativas
            </span>

            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            {activeZones}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Disponíveis para clientes
          </div>
        </div>

        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Moeda
            </span>

            <Package className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-3 text-2xl font-semibold text-slate-950">
            MZN
          </div>

          <div className="mt-1 text-xs text-slate-400">
            Metical moçambicano
          </div>
        </div>
      </div>

      {/* Delivery options */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Regiões de entrega
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Defina onde a sua loja realiza entregas e quanto será cobrado.
          </p>
        </div>

        <div className="space-y-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`rounded-2xl border bg-white p-4 transition ${
                zone.enabled
                  ? "border-slate-200"
                  : "border-slate-200 opacity-70"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      zone.enabled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Truck className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {zone.name}
                      </h3>

                      {zone.enabled && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Ativa
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {zone.regions}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:min-w-[430px]">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Preço
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {formatMzn(zone.price)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Prazo
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                      <Clock3 className="h-3.5 w-3.5" />
                      {zone.estimatedTime}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-end gap-2 sm:col-span-1 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => toggleZone(zone.id)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        zone.enabled ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      aria-label={
                        zone.enabled
                          ? `Desativar ${zone.name}`
                          : `Ativar ${zone.name}`
                      }
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          zone.enabled ? "left-6" : "left-1"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeZone(zone.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Eliminar região ${zone.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {zones.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Truck className="mx-auto h-8 w-8 text-slate-300" />

              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                Nenhuma região configurada
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Adicione uma região para começar a configurar as entregas.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Free shipping */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Package className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Envio gratuito
              </h3>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                Ofereça entrega gratuita quando o valor da encomenda atingir
                um determinado limite.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Configurar
          </button>
        </div>
      </section>

      {/* Delivery notice */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <h3 className="text-sm font-semibold text-emerald-900">
              Entrega preparada para Moçambique
            </h3>

            <p className="mt-1 text-xs leading-5 text-emerald-800">
              Poderemos adicionar posteriormente transportadoras, cálculo
              automático de frete, pontos de recolha e outras opções de
              logística.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}