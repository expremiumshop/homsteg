import { useEffect, useState } from "react";
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
  Languages,
  ShieldCheck,
  Store,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  normalizeCurrency,
  normalizeLanguage,
  type Currency,
  type Language,
} from "@/lib/i18n";
import { usePanelI18n } from "@/lib/panel-i18n-context";
import type { PanelTranslationKey } from "@/lib/panel-i18n";

type SettingsSection =
  | "loja"
  | "perfil"
  | "contacto"
  | "whatsapp"
  | "idioma"
  | "dominio"
  | "painel"
  | "checkout"
  | "entrega"
  | "pagamentos"
  | "seo"
  | "notificacoes"
  | "politicas"
  | "creditos"
  | "seguranca";

/*
 * Rótulos vêm do catálogo do PAINEL (panel-i18n.ts):
 * "Idioma e moeda" configura a loja; "Idioma do painel"
 * configura este painel — duas preferências independentes.
 */
const sections: {
  id: SettingsSection;
  labelKey: PanelTranslationKey;
  icon: typeof Store;
}[] = [
  { id: "loja", labelKey: "set.sec.store", icon: Store },
  { id: "perfil", labelKey: "set.sec.profile", icon: User },
  { id: "contacto", labelKey: "set.sec.contact", icon: MapPin },
  { id: "whatsapp", labelKey: "set.sec.whatsapp", icon: MessageCircle },
  { id: "idioma", labelKey: "set.sec.language", icon: Globe2 },
  { id: "dominio", labelKey: "set.sec.domain", icon: Globe2 },
  { id: "painel", labelKey: "set.sec.panelLanguage", icon: Languages },
  { id: "checkout", labelKey: "set.sec.checkout", icon: CreditCard },
  { id: "entrega", labelKey: "set.sec.delivery", icon: Truck },
  { id: "pagamentos", labelKey: "set.sec.payments", icon: Wallet },
  { id: "seo", labelKey: "set.sec.seo", icon: Search },
  { id: "notificacoes", labelKey: "set.sec.notifications", icon: Bell },
  { id: "politicas", labelKey: "set.sec.policies", icon: Package },
  { id: "creditos", labelKey: "set.sec.credits", icon: Wallet },
  { id: "seguranca", labelKey: "set.sec.security", icon: ShieldCheck },
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
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
  enabled: boolean | null;
  onChange?: (value: boolean) => void;
}) {
  const { t } = usePanelI18n();

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      {enabled === null ? (
        <span className="shrink-0 text-xs text-slate-400">
          {t("set.notAvailable")}
        </span>
      ) : (
        <Toggle enabled={enabled} onChange={onChange ?? (() => undefined)} />
      )}
    </div>
  );
}

export default function SettingsPage({ storeId }: { storeId?: string }) {
  /*
   * Idioma do PAINEL (independente do idioma da loja que é
   * gravado em stores.language pelo botão Guardar).
   */
  const {
    t,
    language: panelLanguage,
    setLanguage: changePanelLanguage,
  } = usePanelI18n();

  const [activeSection, setActiveSection] = useState<SettingsSection>("loja");

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const [whatsapp, setWhatsapp] = useState("");
  const [currency, setCurrency] = useState<Currency>("MZN");
  const [language, setLanguage] = useState<Language>("pt");
  const [customDomainInput, setCustomDomainInput] = useState("");

  const [saved, setSaved] = useState(false);

  const utils = trpc.useUtils();
  const storesQuery = trpc.stores.mine.useQuery();
  const updateWhatsApp = trpc.stores.checkout.updateWhatsApp.useMutation();
  const updateLocale = trpc.stores.locale.update.useMutation();
  const domainQuery = trpc.stores.domain.get.useQuery(
    { storeId: storeId ?? "" },
    {
      enabled: Boolean(storeId) && activeSection === "dominio",
      refetchInterval: activeSection === "dominio" ? 15000 : false,
    }
  );
  const saveDomain = trpc.stores.domain.save.useMutation();
  const verifyDomain = trpc.stores.domain.verify.useMutation();
  const removeDomain = trpc.stores.domain.remove.useMutation();

  useEffect(() => {
    if (domainQuery.data?.domain) setCustomDomainInput(domainQuery.data.domain);
    if (domainQuery.data?.state === "not-configured") setCustomDomainInput("");
  }, [domainQuery.data?.domain, domainQuery.data?.state]);

  const refreshDomain = async () => {
    if (storeId) await utils.stores.domain.get.invalidate({ storeId });
  };

  const handleSaveDomain = async () => {
    if (!storeId) return toast.error(t("set.toastNoStore"));
    try {
      await saveDomain.mutateAsync({ storeId, domain: customDomainInput });
      await refreshDomain();
      toast.success(t("set.domain.saved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("set.toastError"));
    }
  };

  const handleVerifyDomain = async () => {
    if (!storeId) return;
    try {
      const result = await verifyDomain.mutateAsync({ storeId });
      await refreshDomain();
      toast.success(
        result.state === "verified"
          ? t("set.domain.verifiedToast")
          : t("set.domain.pendingToast")
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("set.toastError"));
    }
  };

  const handleRemoveDomain = async () => {
    if (!storeId) return;
    try {
      await removeDomain.mutateAsync({ storeId });
      setCustomDomainInput("");
      await refreshDomain();
      toast.success(t("set.domain.removed"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("set.toastError"));
    }
  };

  const selectedStore = (storesQuery.data ?? [])
    .map(entry => ("store" in entry ? entry.store : entry))
    .find(store => store.id === storeId);
  const storeStatus = storesQuery.isLoading
    ? t("set.store.loading")
    : storesQuery.isError
      ? t("set.store.unavailable")
      : selectedStore?.status === "active"
        ? t("set.store.active")
        : selectedStore?.status === "suspended"
          ? t("set.store.suspended")
          : selectedStore?.status === "draft"
            ? t("set.store.draft")
            : t("set.store.unknown");
  const storeStatusClass = selectedStore?.status === "active"
    ? "bg-emerald-50 text-emerald-700"
    : selectedStore?.status === "suspended"
      ? "bg-red-50 text-red-700"
      : "bg-slate-100 text-slate-600";

  useEffect(() => {
    setWhatsapp(selectedStore?.whatsapp ?? "");
    setStoreName(selectedStore?.name ?? "");
    setStorePhone(selectedStore?.whatsapp ?? "");
  }, [selectedStore?.id, selectedStore?.name, selectedStore?.whatsapp]);

  /*
   * Idioma e moeda vêm da loja (stores.language / stores.currency)
   * e são normalizados: um valor antigo ou inválido na base de
   * dados aparece sempre como uma opção válida do formulário, em
   * vez de deixar o select vazio.
   */
  useEffect(() => {
    setLanguage(normalizeLanguage(selectedStore?.language));
    setCurrency(normalizeCurrency(selectedStore?.currency));
  }, [selectedStore?.id, selectedStore?.language, selectedStore?.currency]);

  const handleSave = async () => {
    if (!storeId) {
      toast.error(t("set.toastNoStore"));
      return;
    }

    if (!whatsapp.trim()) {
      toast.error(t("set.toastWhatsapp"));
      return;
    }

    try {
      await updateWhatsApp.mutateAsync({
        storeId,
        whatsapp,
      });

      /*
       * Idioma e moeda na mesma gravação: são a mesma decisão
       * de localização da loja e o storefront lê-os juntos.
       */
      await updateLocale.mutateAsync({
        storeId,
        language,
        currency,
      });

      await utils.stores.mine.invalidate();
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("[Settings] save failed:", error);
      toast.error(t("set.toastError"));
    }
  };

  const activeLabel = sections.find(section => section.id === activeSection)
    ? t(sections.find(section => section.id === activeSection)!.labelKey)
    : t("set.sec.store");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-lime-600">
            {t("set.kicker")}
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {t("set.title")}
          </h1>

          <p className="mt-1 text-sm text-slate-500">{t("set.subtitle")}</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={updateWhatsApp.isPending || updateLocale.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {updateWhatsApp.isPending || updateLocale.isPending ? (
            t("set.saving")
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              {t("set.saved")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t("set.save")}
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Settings navigation */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2">
          <div className="mb-2 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t("set.sectionLabel")}
            </p>
          </div>

          <nav className="space-y-1">
            {sections.map(section => {
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

                  <span className="flex-1">{t(section.labelKey)}</span>

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
                {t("set.sectionLabel")} / {activeLabel}
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
                    {t("set.store.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.store.desc")}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={t("set.store.name")}
                    value={storeName}
                    onChange={setStoreName}
                    placeholder={t("set.store.namePlaceholder")}
                    disabled
                  />

                  <Field
                    label={t("set.store.email")}
                    value={storeEmail}
                    onChange={setStoreEmail}
                    placeholder={t("set.store.emailPlaceholder")}
                    type="email"
                    disabled
                  />

                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        {t("set.store.description")}
                      </span>

                      <textarea
                        value={storeDescription}
                        onChange={event =>
                          setStoreDescription(event.target.value)
                        }
                        placeholder={t("set.store.descriptionPlaceholder")}
                        rows={4}
                        disabled
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none disabled:cursor-not-allowed"
                      />
                    </label>
                  </div>

                  <Field
                    label={t("set.store.phone")}
                    value={storePhone}
                    onChange={setStorePhone}
                    placeholder="+258 84 000 0000"
                    disabled
                  />

                  <Field
                    label={t("set.store.address")}
                    value={storeAddress}
                    onChange={setStoreAddress}
                    placeholder={t("set.store.addressPlaceholder")}
                    disabled
                  />
                </div>

                <div className="rounded-xl border border-lime-100 bg-lime-50 p-4">
                  <div className="flex gap-3">
                    <Store className="mt-0.5 h-5 w-5 shrink-0 text-lime-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {t("set.store.status")}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {t("set.store.statusDesc")}
                      </p>

                      <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${storeStatusClass}`}>
                        <span className={`h-2 w-2 rounded-full ${selectedStore?.status === "active" ? "bg-emerald-500" : selectedStore?.status === "suspended" ? "bg-red-500" : "bg-slate-400"}`} />
                        {storeStatus}
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
                    {t("set.profile.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.profile.desc")}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={t("set.profile.name")}
                    value=""
                    onChange={() => undefined}
                    placeholder={t("set.profile.namePlaceholder")}
                    disabled
                  />

                  <Field
                    label={t("set.profile.email")}
                    value=""
                    onChange={() => undefined}
                    placeholder={t("set.profile.emailPlaceholder")}
                    type="email"
                    disabled
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {t("set.profile.accountData")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t("set.profile.accountDataDesc")}
                  </p>
                </div>
              </div>
            )}

            {/* Contacto */}
            {activeSection === "contacto" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t("set.contact.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.contact.desc")}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={t("set.contact.phone")}
                    value={storePhone}
                    onChange={setStorePhone}
                    placeholder="+258 84 000 0000"
                    disabled
                  />

                  <Field
                    label={t("set.contact.email")}
                    value={storeEmail}
                    onChange={setStoreEmail}
                    placeholder="contacto@loja.com"
                    type="email"
                    disabled
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label={t("set.contact.address")}
                      value={storeAddress}
                      onChange={setStoreAddress}
                      placeholder={t("set.contact.addressPlaceholder")}
                      disabled
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
                    {t("set.whatsapp.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.whatsapp.desc")}
                  </p>
                </div>

                <Field
                  label={t("set.whatsapp.number")}
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder="+258 84 000 0000"
                />

                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <div className="flex gap-3">
                    <MessageCircle className="h-5 w-5 shrink-0 text-green-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {t("set.whatsapp.cardTitle")}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {t("set.whatsapp.cardDesc")}
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
                    {t("set.lang.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.lang.desc")}
                  </p>

                  <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                    {t("set.lang.storeOnly")}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      {t("set.lang.label")}
                    </span>

                    <select
                      value={language}
                      onChange={event =>
                        setLanguage(normalizeLanguage(event.target.value))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                    >
                      <option value="pt">Português</option>
                      <option value="en">English</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      {t("set.lang.currencyLabel")}
                    </span>

                    <select
                      value={currency}
                      onChange={event =>
                        setCurrency(normalizeCurrency(event.target.value))
                      }
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
                    {t("set.lang.current")}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {t("set.lang.currentDesc")}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                      {language === "en" ? "English" : "Português"}
                    </span>

                    <span className="inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                      {currency}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "dominio" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t("set.domain.heading")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.domain.desc")}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {t("set.domain.heading")}
                  </span>
                  <input
                    value={customDomainInput}
                    onChange={event => setCustomDomainInput(event.target.value)}
                    placeholder={t("set.domain.placeholder")}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDomain}
                    disabled={!customDomainInput.trim() || saveDomain.isPending}
                    className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saveDomain.isPending
                      ? t("set.saving")
                      : t("set.domain.save")}
                  </button>
                  {domainQuery.data?.domain && (
                    <>
                      <button
                        type="button"
                        onClick={handleVerifyDomain}
                        disabled={verifyDomain.isPending}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        {verifyDomain.isPending
                          ? t("set.domain.checking")
                          : t("set.domain.verify")}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveDomain}
                        disabled={removeDomain.isPending}
                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {removeDomain.isPending
                          ? t("set.saving")
                          : t("set.domain.remove")}
                      </button>
                    </>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {domainQuery.data?.domain
                          ? t("set.domain.configured")
                          : t("set.domain.heading")}
                      </p>
                      {domainQuery.data?.domain && (
                        <p className="mt-1 break-all text-sm text-slate-600">
                          {domainQuery.data.domain}
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${domainQuery.isError || domainQuery.data?.state === "error" ? "bg-red-100 text-red-700" : domainQuery.data?.state === "verified" ? "bg-green-100 text-green-700" : domainQuery.data?.state === "dns-pending" ? "bg-amber-100 text-amber-800" : "bg-white text-slate-600"}`}
                    >
                      {domainQuery.isError ||
                      domainQuery.data?.state === "error"
                        ? t("set.domain.error")
                        : verifyDomain.isPending || domainQuery.isFetching
                          ? t("set.domain.checking")
                          : domainQuery.data?.state === "verified"
                            ? t("set.domain.verified")
                            : domainQuery.data?.state === "dns-pending"
                              ? t("set.domain.pending")
                              : domainQuery.isLoading
                                ? t("set.domain.checking")
                                : t("set.domain.notConfigured")}
                    </span>
                  </div>
                </div>

                {domainQuery.data?.domain &&
                  domainQuery.data.txtName &&
                  domainQuery.data.txtValue && (
                    <div className="space-y-4 rounded-xl border border-lime-100 bg-lime-50 p-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {t("set.domain.dnsTitle")}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {t("set.domain.dnsDesc")}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">
                            {t("set.domain.recordType")}
                          </p>
                          <p className="mt-1 text-sm font-semibold">TXT</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">
                            {t("set.domain.recordName")}
                          </p>
                          <p className="mt-1 break-all text-sm font-semibold">
                            {domainQuery.data.txtName}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">
                            {t("set.domain.recordValue")}
                          </p>
                          <p className="mt-1 break-all text-sm font-semibold">
                            {domainQuery.data.txtValue}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs leading-5 text-slate-600">
                        {t("set.domain.propagation")}
                      </p>
                      <p className="rounded-lg bg-white/80 p-3 text-xs leading-5 text-slate-700">
                        {t("set.domain.vercelPending")}
                      </p>
                      <p className="text-xs leading-5 text-slate-600">
                        {t("set.domain.removeNotice")}
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* Idioma do PAINEL — independente do idioma da loja */}
            {activeSection === "painel" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t("set.panel.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.panel.desc")}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      {t("set.lang.label")}
                    </span>

                    <select
                      value={panelLanguage}
                      onChange={event =>
                        changePanelLanguage(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                    >
                      <option value="pt">Português</option>
                      <option value="en">English</option>
                    </select>
                  </label>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {t("set.panel.current")}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {t("set.panel.currentDesc")}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                      {panelLanguage === "en" ? "English" : "Português"}
                    </span>

                    <span className="inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600">
                      {t("set.panel.storeLanguage")}:{" "}
                      {language === "en" ? "English" : "Português"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {t("set.panel.hint")}
                  </p>
                </div>
              </div>
            )}

            {/* Checkout */}
            {activeSection === "checkout" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t("set.checkout.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.checkout.desc")}
                  </p>
                </div>

                <Field
                  label={t("set.checkout.number")}
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder="+258 84 000 0000"
                  type="tel"
                />

                <SettingRow
                  title={t("set.checkout.active")}
                  description={t("set.checkout.activeDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("set.checkout.guest")}
                  description={t("set.checkout.guestDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("set.checkout.phone")}
                  description={t("set.checkout.phoneDesc")}
                  enabled={null}
                />
              </div>
            )}

            {/* Entrega */}
            {activeSection === "entrega" && (
              <div className="p-5 sm:p-6">
                <SettingRow
                  title={t("set.delivery.local")}
                  description={t("set.delivery.localDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("set.delivery.pickup")}
                  description={t("set.delivery.pickupDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("set.delivery.free")}
                  description={t("set.delivery.freeDesc")}
                  enabled={null}
                />
              </div>
            )}

            {/* Pagamentos */}
            {activeSection === "pagamentos" && (
              <div className="p-5 sm:p-6">
                <SettingRow
                  title="M-Pesa"
                  description={t("set.pay.mpesaDesc")}
                  enabled={null}
                />

                <SettingRow
                  title="e-Mola"
                  description={t("set.pay.emolaDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("set.pay.card")}
                  description={t("set.pay.cardDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("set.pay.cod")}
                  description={t("set.pay.codDesc")}
                  enabled={null}
                />
              </div>
            )}

            {/* SEO */}
            {activeSection === "seo" && (
              <div className="space-y-5 p-5 sm:p-6">
                <Field
                  label={t("set.seo.title")}
                  value={storeName}
                  onChange={setStoreName}
                  placeholder={t("set.seo.titlePlaceholder")}
                  disabled
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {t("set.seo.description")}
                  </span>

                  <textarea
                    value={storeDescription}
                    onChange={event => setStoreDescription(event.target.value)}
                    rows={4}
                    placeholder={t("set.seo.descriptionPlaceholder")}
                    disabled
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed"
                  />
                </label>
              </div>
            )}

            {/* Notificações */}
            {activeSection === "notificacoes" && (
              <div className="p-5 sm:p-6">
                <SettingRow
                  title={t("set.notif.general")}
                  description={t("set.notif.generalDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("set.notif.orders")}
                  description={t("set.notif.ordersDesc")}
                  enabled={null}
                />

                <SettingRow
                  title={t("nav.marketing")}
                  description={t("set.notif.marketingDesc")}
                  enabled={null}
                />
              </div>
            )}

            {/* Políticas */}
            {activeSection === "politicas" && (
              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t("set.policies.heading")}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {t("set.policies.desc")}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {t("set.policies.return")}
                  </span>

                  <textarea
                    rows={5}
                    placeholder={t("set.policies.returnPlaceholder")}
                    disabled
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    {t("set.policies.terms")}
                  </span>

                  <textarea
                    rows={5}
                    placeholder={t("set.policies.termsPlaceholder")}
                    disabled
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed"
                  />
                </label>
              </div>
            )}

            {/* Créditos */}
            {activeSection === "creditos" && (
              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl border border-lime-200 bg-lime-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-lime-700">
                        {t("set.credits.freePlat")}
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-slate-950">
                        {t("set.credits.free")}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {t("set.credits.freeDesc")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <Wallet className="h-5 w-5 text-lime-600" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t("set.credits.about")}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {t("set.credits.aboutDesc")}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                      {t("set.credits.stores")}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">1</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                      {t("set.credits.products")}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {t("set.credits.unlimited")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                      {t("set.credits.cost")}
                    </p>
                    <p className="mt-1 text-lg font-bold text-lime-600">
                      0 MZN
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
                        {t("set.security.heading")}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {t("set.security.desc")}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {t("set.security.change")}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
