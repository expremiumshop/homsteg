import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Globe2,
  Lock,
  MapPin,
  MessageCircle,
  Package,
  Save,
  Search,
  ShieldCheck,
  Store,
  Truck,
  User,
  Wallet,
} from "lucide-react";

type SettingsSection =
  | "loja"
  | "perfil"
  | "contacto"
  | "whatsapp"
  | "idioma"
  | "checkout"
  | "entrega"
  | "pagamentos"
  | "seo"
  | "notificacoes"
  | "politicas"
  | "plano"
  | "seguranca";

const sections: {
  id: SettingsSection;
  label: string;
  icon: typeof Store;
}[] = [
  { id: "loja", label: "Loja", icon: Store },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "contacto", label: "Contacto", icon: MapPin },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "idioma", label: "Idioma e moeda", icon: Globe2 },
  { id: "checkout", label: "Checkout", icon: CreditCard },
  { id: "entrega", label: "Entrega", icon: Truck },
  { id: "pagamentos", label: "Pagamentos", icon: Wallet },
  { id: "seo", label: "SEO", icon: Search },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "politicas", label: "Políticas", icon: Package },
  { id: "plano", label: "Meu plano", icon: CreditCard },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck },
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
      />
    </label>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-lime-500" : "bg-slate-300"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("loja");

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const [whatsapp, setWhatsapp] = useState("");
  const [currency, setCurrency] = useState("MZN");

  const [notifications, setNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const activeLabel =
    sections.find((section) => section.id === activeSection)?.label ?? "Loja";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-lime-600">
            Configuração
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Configurações
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure a sua loja, conta, pagamentos, entrega e outras opções.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar alterações
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Settings navigation */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2">
          <div className="mb-2 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Configurações
            </p>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    active
                      ? "bg-lime-50 text-lime-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-lime-600" : "text-slate-400"
                    }`}
                  />

                  <span className="flex-1">{section.label}</span>

                  {active && <ChevronRight className="h-4 w-4" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <p className="text-xs font-medium text-slate-400">
                Configurações / {activeLabel}
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                {activeLabel}
              </h2>
            </div>

            {/* Loja */}
            {activeSection === "loja" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Informações da loja
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Estes dados serão utilizados na apresentação pública da
                    sua loja.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Nome da loja"
                    value={storeName}
                    onChange={setStoreName}
                    placeholder="Ex.: Atelier Nova"
                  />

                  <Field
                    label="E-mail da loja"
                    value={storeEmail}
                    onChange={setStoreEmail}
                    placeholder="loja@exemplo.com"
                    type="email"
                  />

                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        Descrição
                      </span>

                      <textarea
                        value={storeDescription}
                        onChange={(event) =>
                          setStoreDescription(event.target.value)
                        }
                        placeholder="Descreva brevemente a sua loja..."
                        rows={4}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                      />
                    </label>
                  </div>

                  <Field
                    label="Telefone"
                    value={storePhone}
                    onChange={setStorePhone}
                    placeholder="+258 84 000 0000"
                  />

                  <Field
                    label="Morada"
                    value={storeAddress}
                    onChange={setStoreAddress}
                    placeholder="Maputo, Moçambique"
                  />
                </div>

                <div className="rounded-xl border border-lime-100 bg-lime-50 p-4">
                  <div className="flex gap-3">
                    <Store className="mt-0.5 h-5 w-5 shrink-0 text-lime-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Estado da loja
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        A loja está configurada para ficar disponível quando
                        os produtos forem publicados.
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-lime-700">
                        <span className="h-2 w-2 rounded-full bg-lime-500" />
                        Loja ativa
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Perfil */}
            {activeSection === "perfil" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Perfil do utilizador
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Gerencie os dados utilizados na sua conta HOMSTEG.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Nome"
                    value=""
                    onChange={() => undefined}
                    placeholder="Seu nome"
                  />

                  <Field
                    label="E-mail"
                    value=""
                    onChange={() => undefined}
                    placeholder="seu@email.com"
                    type="email"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Dados da conta
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    A gestão completa de utilizadores será ligada ao sistema
                    de autenticação da HOMSTEG.
                  </p>
                </div>
              </div>
            )}

            {/* Contacto */}
            {activeSection === "contacto" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Contactos públicos
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Defina como os clientes poderão entrar em contacto com a
                    sua loja.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Telefone principal"
                    value={storePhone}
                    onChange={setStorePhone}
                    placeholder="+258 84 000 0000"
                  />

                  <Field
                    label="E-mail"
                    value={storeEmail}
                    onChange={setStoreEmail}
                    placeholder="contacto@loja.com"
                    type="email"
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Endereço"
                      value={storeAddress}
                      onChange={setStoreAddress}
                      placeholder="Cidade, província, Moçambique"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {activeSection === "whatsapp" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    WhatsApp
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure o número utilizado para atendimento e pedidos
                    através do WhatsApp.
                  </p>
                </div>

                <Field
                  label="Número do WhatsApp"
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder="+258 84 000 0000"
                />

                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <div className="flex gap-3">
                    <MessageCircle className="h-5 w-5 shrink-0 text-green-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Atendimento pelo WhatsApp
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Quando configurado, o número poderá aparecer na loja
                        e ser utilizado em ações de contacto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Idioma e moeda */}
            {activeSection === "idioma" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Idioma e moeda
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure a localização principal da sua loja.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Idioma
                    </span>

                    <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100">
                      <option>Português</option>
                      <option>English</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Moeda
                    </span>

                    <select
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                    >
                      <option value="MZN">MZN — Metical</option>
                      <option value="ZAR">ZAR — Rand</option>
                      <option value="USD">USD — Dólar</option>
                    </select>
                  </label>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Configuração actual
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    A moeda seleccionada será utilizada na apresentação dos
                    preços da loja.
                  </p>

                  <div className="mt-3 inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                    {currency}
                  </div>
                </div>
              </div>
            )}

            {/* Checkout */}
            {activeSection === "checkout" && (
              <div className="p-5 sm:p-6">
                <SettingRow
                  title="Checkout activo"
                  description="Permite que os clientes avancem para finalizar uma encomenda."
                  enabled={true}
                  onChange={() => undefined}
                />

                <SettingRow
                  title="Permitir compra como visitante"
                  description="Permite realizar pedidos sem criar uma conta."
                  enabled={true}
                  onChange={() => undefined}
                />

                <SettingRow
                  title="Solicitar telefone"
                  description="Solicita um contacto telefónico durante o checkout."
                  enabled={true}
                  onChange={() => undefined}
                />
              </div>
            )}

            {/* Entrega */}
            {activeSection === "entrega" && (
              <div className="p-5 sm:p-6">
                <SettingRow
                  title="Entrega local"
                  description="Disponibiliza entrega dentro das regiões configuradas."
                  enabled={true}
                  onChange={() => undefined}
                />

                <SettingRow
                  title="Levantamento na loja"
                  description="Permite ao cliente levantar a encomenda presencialmente."
                  enabled={false}
                  onChange={() => undefined}
                />

                <SettingRow
                  title="Entrega gratuita"
                  description="Permite configurar condições para entrega gratuita."
                  enabled={false}
                  onChange={() => undefined}
                />
              </div>
            )}

            {/* Pagamentos */}
            {activeSection === "pagamentos" && (
              <div className="p-5 sm:p-6">
                <SettingRow
                  title="M-Pesa"
                  description="Permitir pagamentos através do M-Pesa."
                  enabled={true}
                  onChange={() => undefined}
                />

                <SettingRow
                  title="e-Mola"
                  description="Permitir pagamentos através do e-Mola."
                  enabled={false}
                  onChange={() => undefined}
                />

                <SettingRow
                  title="Cartão bancário"
                  description="Permitir pagamentos com cartão."
                  enabled={false}
                  onChange={() => undefined}
                />

                <SettingRow
                  title="Pagamento na entrega"
                  description="Permitir pagamento no momento da entrega."
                  enabled={true}
                  onChange={() => undefined}
                />
              </div>
            )}

            {/* SEO */}
            {activeSection === "seo" && (
              <div className="space-y-5 p-5 sm:p-6">
                <Field
                  label="Título da loja"
                  value={storeName}
                  onChange={setStoreName}
                  placeholder="Nome da sua loja"
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Descrição SEO
                  </span>

                  <textarea
                    value={storeDescription}
                    onChange={(event) =>
                      setStoreDescription(event.target.value)
                    }
                    rows={4}
                    placeholder="Descrição que poderá aparecer nos motores de pesquisa..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                  />
                </label>
              </div>
            )}

            {/* Notificações */}
            {activeSection === "notificacoes" && (
              <div className="p-5 sm:p-6">
                <SettingRow
                  title="Notificações gerais"
                  description="Receber notificações importantes da plataforma."
                  enabled={notifications}
                  onChange={setNotifications}
                />

                <SettingRow
                  title="Novas encomendas"
                  description="Receber uma notificação sempre que uma nova encomenda for criada."
                  enabled={orderNotifications}
                  onChange={setOrderNotifications}
                />

                <SettingRow
                  title="Marketing"
                  description="Receber novidades, dicas e comunicações promocionais da HOMSTEG."
                  enabled={marketingNotifications}
                  onChange={setMarketingNotifications}
                />
              </div>
            )}

            {/* Políticas */}
            {activeSection === "politicas" && (
              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Políticas da loja
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Estas informações poderão aparecer no rodapé e durante o
                    checkout.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Política de devolução
                  </span>

                  <textarea
                    rows={5}
                    placeholder="Escreva a política de devolução da sua loja..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Termos e condições
                  </span>

                  <textarea
                    rows={5}
                    placeholder="Escreva os termos e condições..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                  />
                </label>
              </div>
            )}

            {/* Plano */}
            {activeSection === "plano" && (
              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl border border-lime-200 bg-lime-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-lime-700">
                        Plano actual
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-slate-950">
                        FREE
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        Comece a sua loja sem custos.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <CreditCard className="h-5 w-5 text-lime-600" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">Lojas</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      1
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">Produtos</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      Disponível
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">Estado</p>
                    <p className="mt-1 text-lg font-bold text-lime-600">
                      Activo
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Segurança */}
            {activeSection === "seguranca" && (
              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex gap-3">
                    <div className="rounded-xl bg-slate-100 p-2">
                      <Lock className="h-5 w-5 text-slate-700" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Segurança da conta
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        A autenticação e as sessões da conta são gerenciadas
                        pelo sistema seguro da HOMSTEG.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Alterar palavra-passe
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}