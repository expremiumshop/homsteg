/*
 * i18n do PAINEL (área de administração /app).
 *
 * Este módulo é DELIBERADAMENTE separado de
 * client/src/lib/i18n.ts (loja pública):
 *
 *  - a loja guarda o idioma em stores.language (base de dados,
 *    escolhido em Configurações → Idioma e moeda);
 *  - o painel guarda o idioma NESTE dispositivo, em
 *    localStorage ("homsteg_panel_language"), escolhido em
 *    Configurações → Idioma do painel (ou no cabeçalho).
 *
 * Por isso trocar um NUNCA troca o outro:
 *   Loja: Português  + Painel: English   ✅
 *   Loja: English    + Painel: Português ✅
 *
 * Puro (sem React) para poder ser testado; o componente que o
 * expõe é client/src/lib/panel-i18n-context.tsx.
 */

export const SUPPORTED_PANEL_LANGUAGES = ["pt", "en"] as const;

export type PanelLanguage = (typeof SUPPORTED_PANEL_LANGUAGES)[number];

export const DEFAULT_PANEL_LANGUAGE: PanelLanguage = "pt";

/** Chave de persistência do painel — nunca partilhada com a loja. */
export const PANEL_LANGUAGE_STORAGE_KEY = "homsteg_panel_language";

/**
 * Normaliza um valor de idioma do painel.
 * Valores desconhecidos caem para o predefinido ("pt").
 */
export function normalizePanelLanguage(
  value: string | null | undefined
): PanelLanguage {
  const normalized = value?.trim().toLowerCase();

  return SUPPORTED_PANEL_LANGUAGES.includes(normalized as PanelLanguage)
    ? (normalized as PanelLanguage)
    : DEFAULT_PANEL_LANGUAGE;
}

/** Lê a preferência guardada neste dispositivo. */
export function readPanelLanguage(): PanelLanguage {
  if (typeof window === "undefined") {
    return DEFAULT_PANEL_LANGUAGE;
  }

  try {
    return normalizePanelLanguage(
      window.localStorage.getItem(PANEL_LANGUAGE_STORAGE_KEY)
    );
  } catch {
    /* localStorage bloqueado (modo privado) → predefinido. */
    return DEFAULT_PANEL_LANGUAGE;
  }
}

/** Grava a preferência do painel (só no painel, nunca na loja). */
export function writePanelLanguage(
  value: PanelLanguage | string
): PanelLanguage {
  const normalized = normalizePanelLanguage(value);

  if (typeof window === "undefined") {
    return normalized;
  }

  try {
    window.localStorage.setItem(PANEL_LANGUAGE_STORAGE_KEY, normalized);
  } catch {
    /* Sem persistência possível: fica na memória da sessão. */
  }

  return normalized;
}

/**
 * Catálogo PT do painel — fonte da verdade das chaves.
 * (O painel nasceu em português: estes são os textos reais.)
 */
const pt = {
  /* Navegação principal. */
  "nav.home": "Início",
  "nav.market": "Market",
  "nav.products": "Produtos",
  "nav.categories": "Categorias",
  "nav.orders": "Encomendas",
  "nav.customers": "Clientes",
  "nav.branding": "Personalizar loja",
  "nav.payments": "Pagamentos",
  "nav.shipping": "Entrega",
  "nav.marketing": "Marketing",
  "nav.settings": "Configurações",
  "nav.credits": "Créditos",

  /* Sidebar. */
  "side.workspace": "Workspace",
  "side.shortcuts": "Atalhos",
  "side.orders": "Encomendas",
  "side.customers": "Clientes",
  "side.analytics": "Analytics",
  "side.account": "Minha conta",
  "side.role": "Proprietário da loja",
  "side.credits": "Créditos",
  "side.creditNote": "O saldo de créditos é gerido pelo Admin.",

  /* Cabeçalho. */
  "head.openMenu": "Abrir menu",
  "head.closeMenu": "Fechar menu",
  "head.notifications": "Notificações",
  "head.viewStore": "Ver loja",
  "head.user": "Utilizador",
  "head.dashboard": "Dashboard",
  "head.language": "Idioma do painel",
  "head.morning": "Bom dia",
  "head.afternoon": "Boa tarde",
  "head.evening": "Boa noite",

  /* Configurações — cromo. */
  "set.kicker": "Configuração",
  "set.title": "Configurações",
  "set.subtitle":
    "Configure a sua loja, conta, pagamentos, entrega e outras opções.",
  "set.saving": "A guardar...",
  "set.saved": "Guardado",
  "set.save": "Guardar alterações",
  "set.sectionLabel": "Configurações",
  "set.toastNoStore": "Selecione uma loja para guardar as configurações.",
  "set.toastWhatsapp": "Introduza o número de WhatsApp da loja.",
  "set.toastError": "Não foi possível guardar as configurações.",

  /* Secções da navegação de configurações. */
  "set.sec.store": "Loja",
  "set.sec.profile": "Perfil",
  "set.sec.contact": "Contacto",
  "set.sec.whatsapp": "WhatsApp",
  "set.sec.language": "Idioma e moeda",
  "set.sec.checkout": "Checkout",
  "set.sec.delivery": "Entrega",
  "set.sec.payments": "Pagamentos",
  "set.sec.seo": "SEO",
  "set.sec.notifications": "Notificações",
  "set.sec.policies": "Políticas",
  "set.sec.credits": "Créditos",
  "set.sec.security": "Segurança",
  "set.sec.domain": "Domínio",
  "set.domain.heading": "Domínio da loja",
  "set.domain.desc": "Use um domínio próprio para abrir a sua loja.",
  "set.domain.placeholder": "www.minhaloja.com",
  "set.domain.save": "Guardar domínio",
  "set.domain.remove": "Remover domínio",
  "set.domain.verify": "Verificar DNS",
  "set.domain.notConfigured": "Não configurado",
  "set.domain.pending": "DNS pendente",
  "set.domain.checking": "A verificar",
  "set.domain.verified": "Verificado",
  "set.domain.error": "Erro",
  "set.domain.configured": "Domínio configurado",
  "set.domain.dnsTitle": "Confirme que controla este domínio",
  "set.domain.dnsDesc":
    "Adicione este registo TXT no fornecedor do domínio. A verificação só termina quando o DNS publicar exatamente este valor.",
  "set.domain.recordName": "Nome / Host",
  "set.domain.recordType": "Tipo",
  "set.domain.recordValue": "Valor",
  "set.domain.propagation":
    "A propagação DNS pode demorar. Depois, selecione Verificar DNS.",
  "set.domain.vercelPending":
    "Para receber tráfego e HTTPS, a equipa HOMSTEG ainda precisa de adicionar o domínio em Project Settings → Domains na Vercel e consultar o registo A (domínio raiz) ou CNAME (subdomínio) exato indicado para esse domínio. Este projeto não tem integração Vercel configurada para fazer esse registo; não usamos destinos genéricos ou inventados.",
  "set.domain.removeNotice":
    "Se este domínio tiver sido adicionado manualmente à Vercel, remova-o também em Project Settings → Domains. A remoção aqui apaga a associação à loja HOMSTEG.",
  "set.domain.saved": "Domínio guardado. Configure o registo TXT abaixo.",
  "set.domain.removed": "Domínio removido da loja.",
  "set.domain.verifiedToast": "A propriedade do domínio foi verificada.",
  "set.domain.pendingToast":
    "O registo TXT ainda não foi encontrado. Confirme o DNS e tente novamente.",
  "set.sec.panelLanguage": "Idioma do painel",

  /* Loja. */
  "set.store.heading": "Informações da loja",
  "set.store.desc":
    "Estes dados serão utilizados na apresentação pública da sua loja.",
  "set.store.name": "Nome da loja",
  "set.store.namePlaceholder": "Ex.: Atelier Nova",
  "set.store.email": "E-mail da loja",
  "set.store.emailPlaceholder": "loja@exemplo.com",
  "set.store.description": "Descrição",
  "set.store.descriptionPlaceholder": "Descreva brevemente a sua loja...",
  "set.store.phone": "Telefone",
  "set.store.address": "Morada",
  "set.store.addressPlaceholder": "Maputo, Moçambique",
  "set.store.status": "Estado da loja",
  "set.store.statusDesc":
    "A loja está configurada para ficar disponível quando os produtos forem publicados.",
  "set.store.active": "Loja ativa",
  "set.store.draft": "Rascunho",
  "set.store.suspended": "Suspensa",
  "set.store.unknown": "Estado desconhecido",
  "set.store.loading": "A carregar estado...",
  "set.store.unavailable": "Estado indisponível",
  "set.notAvailable": "Ainda não disponível",

  /* Perfil. */
  "set.profile.heading": "Perfil do utilizador",
  "set.profile.desc": "Gerencie os dados utilizados na sua conta HOMSTEG.",
  "set.profile.name": "Nome",
  "set.profile.namePlaceholder": "Seu nome",
  "set.profile.email": "E-mail",
  "set.profile.emailPlaceholder": "seu@email.com",
  "set.profile.accountData": "Dados da conta",
  "set.profile.accountDataDesc":
    "A gestão completa de utilizadores será ligada ao sistema de autenticação da HOMSTEG.",

  /* Contacto. */
  "set.contact.heading": "Contactos públicos",
  "set.contact.desc":
    "Defina como os clientes poderão entrar em contacto com a sua loja.",
  "set.contact.phone": "Telefone principal",
  "set.contact.email": "E-mail",
  "set.contact.address": "Endereço",
  "set.contact.addressPlaceholder": "Cidade, província, Moçambique",

  /* WhatsApp. */
  "set.whatsapp.heading": "WhatsApp",
  "set.whatsapp.desc":
    "Configure o número utilizado para atendimento e pedidos através do WhatsApp.",
  "set.whatsapp.number": "Número do WhatsApp",
  "set.whatsapp.cardTitle": "Atendimento pelo WhatsApp",
  "set.whatsapp.cardDesc":
    "Quando configurado, o número poderá aparecer na loja e ser utilizado em ações de contacto.",

  /* Idioma e moeda da LOJA. */
  "set.lang.heading": "Idioma e moeda",
  "set.lang.desc": "Configure a localização principal da sua loja.",
  "set.lang.storeOnly":
    "Este idioma aplica-se apenas à loja pública. O idioma do painel é independente e configura-se em «Idioma do painel».",
  "set.lang.label": "Idioma",
  "set.lang.currencyLabel": "Moeda",
  "set.lang.current": "Configuração actual",
  "set.lang.currentDesc":
    "A moeda seleccionada será utilizada na apresentação dos preços da loja e o idioma escolhe os textos do storefront.",

  /* Idioma do PAINEL. */
  "set.panel.heading": "Idioma do painel",
  "set.panel.desc":
    "Idioma apenas desta área de administração — não altera a loja pública.",
  "set.panel.current": "Configuração actual",
  "set.panel.currentDesc":
    "O idioma do painel fica guardado neste dispositivo e é aplicado a todo o painel, independentemente do idioma da loja.",
  "set.panel.storeLanguage": "Idioma da loja",
  "set.panel.hint": "Pode também trocar rapidamente no cabeçalho do painel.",

  /* Checkout. */
  "set.checkout.heading": "Pedidos pelo WhatsApp",
  "set.checkout.desc":
    "Este número recebe os pedidos enviados no checkout da sua loja.",
  "set.checkout.number": "Número de WhatsApp da loja",
  "set.checkout.active": "Checkout activo",
  "set.checkout.activeDesc":
    "Permite que os clientes avancem para finalizar uma encomenda.",
  "set.checkout.guest": "Permitir compra como visitante",
  "set.checkout.guestDesc": "Permite realizar pedidos sem criar uma conta.",
  "set.checkout.phone": "Solicitar telefone",
  "set.checkout.phoneDesc":
    "Solicita um contacto telefónico durante o checkout.",

  /* Entrega. */
  "set.delivery.local": "Entrega local",
  "set.delivery.localDesc":
    "Disponibiliza entrega dentro das regiões configuradas.",
  "set.delivery.pickup": "Levantamento na loja",
  "set.delivery.pickupDesc":
    "Permite ao cliente levantar a encomenda presencialmente.",
  "set.delivery.free": "Entrega gratuita",
  "set.delivery.freeDesc":
    "Permite configurar condições para entrega gratuita.",

  /* Pagamentos. */
  "set.pay.mpesaDesc": "Permitir pagamentos através do M-Pesa.",
  "set.pay.emolaDesc": "Permitir pagamentos através do e-Mola.",
  "set.pay.card": "Cartão bancário",
  "set.pay.cardDesc": "Permitir pagamentos com cartão.",
  "set.pay.cod": "Pagamento na entrega",
  "set.pay.codDesc": "Permitir pagamento no momento da entrega.",

  /* SEO. */
  "set.seo.title": "Título da loja",
  "set.seo.titlePlaceholder": "Nome da sua loja",
  "set.seo.description": "Descrição SEO",
  "set.seo.descriptionPlaceholder":
    "Descrição que poderá aparecer nos motores de pesquisa...",

  /* Notificações. */
  "set.notif.general": "Notificações gerais",
  "set.notif.generalDesc": "Receber notificações importantes da plataforma.",
  "set.notif.orders": "Novas encomendas",
  "set.notif.ordersDesc":
    "Receber uma notificação sempre que uma nova encomenda for criada.",
  "set.notif.marketingDesc":
    "Receber novidades, dicas e comunicações promocionais da HOMSTEG.",

  /* Políticas. */
  "set.policies.heading": "Políticas da loja",
  "set.policies.desc":
    "Estas informações poderão aparecer no rodapé e durante o checkout.",
  "set.policies.return": "Política de devolução",
  "set.policies.returnPlaceholder":
    "Escreva a política de devolução da sua loja...",
  "set.policies.terms": "Termos e condições",
  "set.policies.termsPlaceholder": "Escreva os termos e condições...",

  /* Créditos. */
  "set.credits.freePlat": "Plataforma gratuita",
  "set.credits.free": "100% grátis",
  "set.credits.freeDesc":
    "Sem planos, sem mensalidades e sem subscrições — a sua loja é sempre gratuita.",
  "set.credits.about": "Sobre os créditos",
  "set.credits.aboutDesc":
    "Os créditos são o único sistema pago da HOMSTEG e servem apenas para comprar ou desbloquear funcionalidades, modelos e componentes no Market. Criar e usar a loja nunca é cobrado. O saldo de crédito é gerido pelo administrador da plataforma.",
  "set.credits.stores": "Lojas",
  "set.credits.products": "Produtos",
  "set.credits.unlimited": "Ilimitados",
  "set.credits.cost": "Custo da loja",

  /* Segurança. */
  "set.security.heading": "Segurança da conta",
  "set.security.desc":
    "A autenticação e as sessões da conta são gerenciadas pelo sistema seguro da HOMSTEG.",
  "set.security.change": "Alterar palavra-passe",
} as const;

export type PanelTranslationKey = keyof typeof pt;

/**
 * Catálogo EN. O tipo obriga a cobrir TODAS as chaves do PT,
 * tal como no i18n da loja.
 */
const en: Record<PanelTranslationKey, string> = {
  "nav.home": "Home",
  "nav.market": "Market",
  "nav.products": "Products",
  "nav.categories": "Categories",
  "nav.orders": "Orders",
  "nav.customers": "Customers",
  "nav.branding": "Customize store",
  "nav.payments": "Payments",
  "nav.shipping": "Delivery",
  "nav.marketing": "Marketing",
  "nav.settings": "Settings",
  "nav.credits": "Credits",

  "side.workspace": "Workspace",
  "side.shortcuts": "Shortcuts",
  "side.orders": "Orders",
  "side.customers": "Customers",
  "side.analytics": "Analytics",
  "side.account": "My account",
  "side.role": "Store owner",
  "side.credits": "Credits",
  "side.creditNote": "The credit balance is managed by the Admin.",

  "head.openMenu": "Open menu",
  "head.closeMenu": "Close menu",
  "head.notifications": "Notifications",
  "head.viewStore": "View store",
  "head.user": "User",
  "head.dashboard": "Dashboard",
  "head.language": "Panel language",
  "head.morning": "Good morning",
  "head.afternoon": "Good afternoon",
  "head.evening": "Good evening",

  "set.kicker": "Setup",
  "set.title": "Settings",
  "set.subtitle":
    "Set up your store, account, payments, delivery and other options.",
  "set.saving": "Saving...",
  "set.saved": "Saved",
  "set.save": "Save changes",
  "set.sectionLabel": "Settings",
  "set.toastNoStore": "Select a store to save the settings.",
  "set.toastWhatsapp": "Enter the store's WhatsApp number.",
  "set.toastError": "Couldn't save the settings.",

  "set.sec.store": "Store",
  "set.sec.profile": "Profile",
  "set.sec.contact": "Contact",
  "set.sec.whatsapp": "WhatsApp",
  "set.sec.language": "Language & currency",
  "set.sec.checkout": "Checkout",
  "set.sec.delivery": "Delivery",
  "set.sec.payments": "Payments",
  "set.sec.seo": "SEO",
  "set.sec.notifications": "Notifications",
  "set.sec.policies": "Policies",
  "set.sec.credits": "Credits",
  "set.sec.security": "Security",
  "set.sec.domain": "Domain",
  "set.domain.heading": "Store domain",
  "set.domain.desc": "Use your own domain to open your store.",
  "set.domain.placeholder": "www.mystore.com",
  "set.domain.save": "Save domain",
  "set.domain.remove": "Remove domain",
  "set.domain.verify": "Verify DNS",
  "set.domain.notConfigured": "Not configured",
  "set.domain.pending": "DNS pending",
  "set.domain.checking": "Checking",
  "set.domain.verified": "Verified",
  "set.domain.error": "Error",
  "set.domain.configured": "Configured domain",
  "set.domain.dnsTitle": "Confirm that you control this domain",
  "set.domain.dnsDesc":
    "Add this TXT record at your domain provider. Verification completes only when DNS publishes this exact value.",
  "set.domain.recordName": "Name / Host",
  "set.domain.recordType": "Type",
  "set.domain.recordValue": "Value",
  "set.domain.propagation":
    "DNS propagation can take time. Then select Verify DNS.",
  "set.domain.vercelPending":
    "To receive traffic and HTTPS, the HOMSTEG team must add this domain under Project Settings → Domains in Vercel and read the exact A record (apex) or CNAME (subdomain) Vercel provides for it. This project has no Vercel integration configured to register domains; we do not use generic or invented targets.",
  "set.domain.removeNotice":
    "If this domain was added to Vercel manually, remove it there too under Project Settings → Domains. Removing it here deletes its HOMSTEG store association.",
  "set.domain.saved": "Domain saved. Configure the TXT record below.",
  "set.domain.removed": "Domain removed from the store.",
  "set.domain.verifiedToast": "Domain ownership verified.",
  "set.domain.pendingToast":
    "The TXT record was not found yet. Check DNS and try again.",
  "set.sec.panelLanguage": "Panel language",

  "set.store.heading": "Store information",
  "set.store.desc": "This information is used in your store's public display.",
  "set.store.name": "Store name",
  "set.store.namePlaceholder": "E.g. Atelier Nova",
  "set.store.email": "Store email",
  "set.store.emailPlaceholder": "store@example.com",
  "set.store.description": "Description",
  "set.store.descriptionPlaceholder": "Briefly describe your store...",
  "set.store.phone": "Phone",
  "set.store.address": "Address",
  "set.store.addressPlaceholder": "Maputo, Mozambique",
  "set.store.status": "Store status",
  "set.store.statusDesc":
    "The store is set to go live once products are published.",
  "set.store.active": "Store active",
  "set.store.draft": "Draft",
  "set.store.suspended": "Suspended",
  "set.store.unknown": "Unknown status",
  "set.store.loading": "Loading status...",
  "set.store.unavailable": "Status unavailable",
  "set.notAvailable": "Not available yet",

  "set.profile.heading": "User profile",
  "set.profile.desc": "Manage the details used in your HOMSTEG account.",
  "set.profile.name": "Name",
  "set.profile.namePlaceholder": "Your name",
  "set.profile.email": "Email",
  "set.profile.emailPlaceholder": "your@email.com",
  "set.profile.accountData": "Account details",
  "set.profile.accountDataDesc":
    "Full user management will be connected to HOMSTEG's authentication system.",

  "set.contact.heading": "Public contact details",
  "set.contact.desc": "Set how customers can get in touch with your store.",
  "set.contact.phone": "Primary phone",
  "set.contact.email": "Email",
  "set.contact.address": "Address",
  "set.contact.addressPlaceholder": "City, province, Mozambique",

  "set.whatsapp.heading": "WhatsApp",
  "set.whatsapp.desc":
    "Set the number used for support and orders via WhatsApp.",
  "set.whatsapp.number": "WhatsApp number",
  "set.whatsapp.cardTitle": "WhatsApp support",
  "set.whatsapp.cardDesc":
    "Once set, the number can appear in the store and be used for contact actions.",

  "set.lang.heading": "Language & currency",
  "set.lang.desc": "Set your store's primary locale.",
  "set.lang.storeOnly":
    'This language applies to the public store only. The panel language is independent and is set under "Panel language".',
  "set.lang.label": "Language",
  "set.lang.currencyLabel": "Currency",
  "set.lang.current": "Current setting",
  "set.lang.currentDesc":
    "The selected currency is used for prices and the language selects the storefront texts.",

  "set.panel.heading": "Panel language",
  "set.panel.desc":
    "Language for this admin area only — it does not change the public store.",
  "set.panel.current": "Current setting",
  "set.panel.currentDesc":
    "The panel language is stored on this device and applies to the whole panel, independently of the store language.",
  "set.panel.storeLanguage": "Store language",
  "set.panel.hint": "You can also switch quickly from the panel header.",

  "set.checkout.heading": "Orders via WhatsApp",
  "set.checkout.desc":
    "This number receives the orders sent from your store's checkout.",
  "set.checkout.number": "Store WhatsApp number",
  "set.checkout.active": "Active checkout",
  "set.checkout.activeDesc": "Allows customers to proceed to place an order.",
  "set.checkout.guest": "Allow guest checkout",
  "set.checkout.guestDesc": "Allows orders without creating an account.",
  "set.checkout.phone": "Ask for phone",
  "set.checkout.phoneDesc": "Asks for a phone number during checkout.",

  "set.delivery.local": "Local delivery",
  "set.delivery.localDesc": "Offers delivery within the configured regions.",
  "set.delivery.pickup": "Store pickup",
  "set.delivery.pickupDesc": "Lets customers collect the order in person.",
  "set.delivery.free": "Free delivery",
  "set.delivery.freeDesc": "Set conditions for free delivery.",

  "set.pay.mpesaDesc": "Allow payments via M-Pesa.",
  "set.pay.emolaDesc": "Allow payments via e-Mola.",
  "set.pay.card": "Bank card",
  "set.pay.cardDesc": "Allow card payments.",
  "set.pay.cod": "Pay on delivery",
  "set.pay.codDesc": "Allow payment at delivery time.",

  "set.seo.title": "Store title",
  "set.seo.titlePlaceholder": "Your store name",
  "set.seo.description": "SEO description",
  "set.seo.descriptionPlaceholder":
    "Description that may appear in search engines...",

  "set.notif.general": "General notifications",
  "set.notif.generalDesc": "Receive important platform notifications.",
  "set.notif.orders": "New orders",
  "set.notif.ordersDesc": "Get a notification whenever a new order is created.",
  "set.notif.marketingDesc":
    "Receive news, tips and promotional messages from HOMSTEG.",

  "set.policies.heading": "Store policies",
  "set.policies.desc":
    "This information may appear in the footer and during checkout.",
  "set.policies.return": "Return policy",
  "set.policies.returnPlaceholder": "Write your store's return policy...",
  "set.policies.terms": "Terms and conditions",
  "set.policies.termsPlaceholder": "Write the terms and conditions...",

  "set.credits.freePlat": "Free platform",
  "set.credits.free": "100% free",
  "set.credits.freeDesc":
    "No plans, no monthly fees and no subscriptions — your store is always free.",
  "set.credits.about": "About credits",
  "set.credits.aboutDesc":
    "Credits are HOMSTEG's only paid system and are used only to buy or unlock features, models and components in the Market. Creating and using the store is never charged. The credit balance is managed by the platform administrator.",
  "set.credits.stores": "Stores",
  "set.credits.products": "Products",
  "set.credits.unlimited": "Unlimited",
  "set.credits.cost": "Store cost",

  "set.security.heading": "Account security",
  "set.security.desc":
    "Authentication and account sessions are managed by HOMSTEG's secure system.",
  "set.security.change": "Change password",
};

const panelCatalogs: Record<
  PanelLanguage,
  Record<PanelTranslationKey, string>
> = {
  pt,
  en,
};

/** Todas as chaves do painel (ordem estável do catálogo PT). */
export const PANEL_TRANSLATION_KEYS = Object.keys(pt) as PanelTranslationKey[];

/**
 * Traduz uma chave do painel.
 * Marcadores {nome} são substituídos por `vars`; uma chave em
 * falta devolve a própria chave (nunca uma tela vazia).
 */
export function panelTranslate(
  language: string | null | undefined,
  key: PanelTranslationKey,
  vars?: Record<string, string | number>
): string {
  const catalog = panelCatalogs[normalizePanelLanguage(language)];

  const template = catalog[key] ?? pt[key] ?? key;

  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}
