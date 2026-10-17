/*
 * i18n do storefront público (HOMSTEG).
 *
 * Este ficheiro é a FUNDAÇÃO de tradução da loja: catálogo,
 * normalização da preferência guardada na loja, interpolação e
 * formatação de preços. É puro (sem React e sem Intl) para
 * poder ser testado e reutilizado no cliente e em scripts.
 *
 * O idioma é escolhido em Configurações → Idioma e moeda e
 * fica gravado em stores.language (ver drizzle/schema.ts e a
 * migração 0025_store_language.sql). O componente React que
 * expõe isto ao storefront é client/src/lib/i18n-context.tsx.
 *
 * Idiomas suportados: pt (Português) e en (English).
 * "pt" é a fonte da verdade: o catálogo EN é tipado como
 * Record<TranslationKey, string>, pelo que o TypeScript falha
 * se uma chave ficar por traduzir.
 *
 * IMPORTANTE: este catálogo é SÓ da loja pública. O painel tem
 * o seu próprio módulo (client/src/lib/panel-i18n.ts) e a sua
 * própria preferência — trocar um nunca troca o outro.
 */

export const SUPPORTED_LANGUAGES = ["pt", "en"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "pt";

/*
 * Moedas oferecidas em Configurações → Idioma e moeda.
 * Mesma lista validada no servidor (server/routers.ts,
 * storeCurrencyInput).
 */
export const SUPPORTED_CURRENCIES = ["MZN", "ZAR", "USD"] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "MZN";

/**
 * Normaliza o idioma guardado na loja.
 *
 * Qualquer valor ausente, desconhecido ou de outra caixa cai
 * para o predefinido ("pt"), para que uma loja antiga (ou um
 * valor inválido na base de dados) nunca deixe a loja pública
 * sem catálogo.
 */
export function normalizeLanguage(value: string | null | undefined): Language {
  const normalized = value?.trim().toLowerCase();

  return SUPPORTED_LANGUAGES.includes(normalized as Language)
    ? (normalized as Language)
    : DEFAULT_LANGUAGE;
}

/**
 * Normaliza a moeda guardada na loja.
 *
 * Tal como o idioma: valores fora da lista suportada caem para
 * "MZN" em vez de quebrarem a apresentação de preços.
 */
export function normalizeCurrency(value: string | null | undefined): Currency {
  const normalized = value?.trim().toUpperCase();

  return SUPPORTED_CURRENCIES.includes(normalized as Currency)
    ? (normalized as Currency)
    : DEFAULT_CURRENCY;
}

/**
 * Catálogo PT — fonte da verdade das chaves de tradução.
 *
 * Os valores são o texto que a interface já mostra hoje, por
 * isso aplicar o i18n não muda a loja para quem a vê em
 * português.
 */
const pt = {
  /* Navegação inferior (mobile). */
  "nav.home": "Home",
  "nav.messages": "Mensagens",
  "nav.cart": "Carrinho",
  "nav.account": "Conta",

  /* Pesquisa. */
  "search.placeholder": "O que procura hoje?",
  "search.short": "Pesquisar",
  "search.products": "Pesquisar produtos...",
  "info.search": "Pesquisar produtos",
  "info.allProducts": "Todos os produtos",
  "info.resultsFor": "Resultados para “{query}”",
  "info.help": "Ajuda",
  "info.contact": "Contacto",
  "info.about": "Sobre a loja",
  "info.terms": "Termos e políticas",
  "info.submitSearch": "Pesquisar",
  "info.searchStoreRequired": "Abre a pesquisa a partir de uma loja para ver os seus produtos.",
  "info.storeNotFound": "Loja não encontrada",
  "info.storeNotFoundHint": "Não foi possível carregar esta loja.",
  "info.back": "Voltar",
  "info.contactWhatsapp": "Contactar {store} pelo WhatsApp",
  "info.noContact": "Esta loja ainda não disponibilizou um contacto público.",
  "info.helpText": "Para informações sobre produtos, encomendas e entregas, contacta diretamente a loja.",
  "info.contactStore": "Contactar a loja pelo WhatsApp",
  "info.policiesUnavailable": "As condições e políticas desta loja ainda não foram configuradas.",
  "info.storeFallback": "Informação da loja.",

  /* Cabeçalho. */
  "header.welcome": "Bem-vindo à {store}",
  "header.superDeals": "Super Ofertas",
  "header.coupons": "Cupons",
  "header.myOrders": "Meus pedidos",
  "header.support": "Atendimento",
  "header.tracking": "Rastreio",
  "header.hello": "Olá!",
  "header.account": "Minha conta",
  "header.search": "Buscar",
  "header.searchWide": "Pesquisar produtos, marcas e muito mais...",
  "header.loadingCategories": "Carregando categorias...",
  "header.noCategories": "Nenhuma categoria cadastrada",
  "header.couponExclusive": "Cupons exclusivos",
  "header.trackingAvailable": "Rastreamento disponível",
  "header.dailyDeals": "Ofertas todos os dias",
  "header.customerSupport": "Suporte ao cliente",
  "header.allCategories": "Todas as categorias",
  "header.openMenu": "Abrir menu",
  "header.closeMenu": "Fechar menu",
  "header.signInRegister": "Entrar / Registrar",

  /* Grelha de produtos (loja). */
  "grid.title": "Produtos em destaque",
  "grid.subtitle": "Produtos selecionados especialmente para si",
  "grid.loading": "Carregando produtos...",
  "grid.empty": "Ainda não há produtos na loja.",
  "grid.emptyHint": "Adicione produtos no painel de administração.",

  /* Loja (estados e secção "Sobre a loja"). */
  "store.notFound": "Loja não encontrada",
  "store.notFoundHint": "Não foi possível encontrar a loja solicitada.",
  "store.productsError": "Não foi possível carregar os produtos.",
  "store.about": "Sobre a loja",
  "store.currency": "Moeda",
  "store.commerce": "Comércio online",
  "store.country": "Moçambique",
  "store.storeFallback": "Loja",

  /* Benefícios superiores. */
  "benefit.fastDelivery": "Entrega em horas",
  "benefit.securePayment": "Pagamento seguro",
  "benefit.verifiedSellers": "Vendedores verificados",

  /* Secção de benefícios + sobre a loja. */
  "benefits.deliveryTitle": "Entrega em Moçambique",
  "benefits.deliveryText":
    "Receba os seus produtos com segurança e acompanhe a sua entrega.",
  "benefits.safeBuyTitle": "Compra segura",
  "benefits.safeBuyText":
    "Os seus dados são tratados com segurança durante a sua compra.",
  "benefits.verifiedTitle": "Produtos verificados",
  "benefits.verifiedText":
    "Encontre produtos e vendedores selecionados para uma experiência melhor.",
  "benefits.supportTitle": "Suporte ao cliente",
  "benefits.supportText":
    "Conte com a nossa equipa para ajudar sempre que precisar.",
  "benefits.whyTitle": "Porquê comprar na {store}?",
  "benefits.whyText":
    "Uma experiência de compra simples, segura e confiável.",
  "benefits.slogan": "{store} — qualidade que chega até si.",
  "benefits.about1a":
    " é uma loja dedicada à comercialização de produtos de qualidade, selecionados cuidadosamente para oferecer aos nossos clientes ",
  "benefits.about1b": "excelência, variedade e preços competitivos",
  "benefits.about2a":
    "Trabalhamos para oferecer uma ampla variedade de produtos, selecionando opções que aliam ",
  "benefits.about2b": "qualidade, bom preço e estilo",
  "benefits.about3":
    "O nosso compromisso é tornar produtos de qualidade acessíveis a clientes em todo o território nacional. Procuramos oferecer uma experiência de compra simples, segura e conveniente.",
  "benefits.about4":
    ", acreditamos que comprar deve ser uma experiência simples, segura e satisfatória. Por isso, procuramos oferecer produtos cuidadosamente selecionados, preços justos e um atendimento focado nas necessidades de cada cliente.",

  /* Categorias. */
  "categories.title": "Categorias",
  "categories.viewProducts": "Ver produtos",
  "categories.explore": "Explorar categoria",

  /* Carrossel de banners. */
  "banner.weekHighlight": "Destaque da semana",
  "banner.seeNow": "Ver agora",
  "banner.bigOffers": "Grandes ofertas, todos os dias",
  "banner.newCollection": "Nova coleção",
  "banner.exploreCollection": "Explore a nova coleção",
  "banner.discover": "Descobrir",
  "banner.campaignTitle": "Título da campanha",
  "banner.campaignSubtitle": "Subtítulo da campanha",
  "banner.yourCampaign": "A tua campanha aqui",
  "banner.title": "Título do banner",
  "banner.subtitle": "Subtítulo do banner",
  "banner.bigCampaign": "Grande campanha da loja",
  "banner.alt": "Banner da loja",
  "banner.featured": "Destaque",

  /* Cartões de produto. */
  "card.new": "Novo",
  "card.buy": "Comprar",
  "card.addToCart": "Adicionar ao carrinho",
  "card.offer": "OFERTA",
  "card.featured": "Destaque",
  "card.price": "PREÇO",
  "card.verifiedStore": "Loja verificada",
  "card.productImage": "IMAGEM DO PRODUTO",
  "card.productInfo": "INFORMAÇÕES DO PRODUTO",

  /* Rodapé. */
  "footer.products": "Produtos",
  "footer.contacts": "Contactos",
  "footer.help": "Ajuda",
  "footer.newsletterTitle": "Receba as novidades",
  "footer.newsletterText":
    "Ofertas exclusivas diretamente no seu email.",
  "footer.yourEmail": "O seu email",
  "footer.store": "Loja",
  "footer.promotions": "Promoções",
  "footer.deliveries": "Entregas",
  "footer.returns": "Devoluções",
  "footer.allRights": "Todos os direitos reservados.",
  "footer.tagline":
    "Encontre produtos de qualidade, boas ofertas e uma experiência de compra simples e segura.",
  "footer.onlineStore": "Loja online em Moçambique",
  "footer.regions": "Entregas em várias regiões",
  "footer.securePurchases": "Compras seguras",
  "footer.shop": "COMPRAR",
  "footer.service": "ATENDIMENTO",
  "footer.aboutUsTitle": "SOBRE NÓS",
  "footer.followUs": "SIGA-NOS",
  "footer.followText":
    "Acompanhe a nossa loja nas redes sociais e fique por dentro das novidades e ofertas.",
  "footer.share": "Partilhar",
  "footer.paymentMethods": "Métodos de pagamento:",
  "footer.paymentMethodsTitle": "MÉTODOS DE PAGAMENTO",
  "footer.bank": "Banco",
  "footer.followStore": "SIGA A NOSSA LOJA",
  "footer.pricesIn": "Preços apresentados em {currency}",
  "footer.onlinePrices":
    "Compras online em Moçambique • Valores em {currency}",
  "footer.allCategories": "Todas as categorias",
  "footer.electronics": "Eletrónica",
  "footer.fashion": "Moda",
  "footer.beauty": "Beleza",
  "footer.toys": "Brinquedos",
  "footer.newArrivals": "Novidades",
  "footer.deals": "Ofertas",
  "footer.helpCenter": "Central de ajuda",
  "footer.contactUs": "Contacte-nos",
  "footer.howToBuy": "Como comprar",
  "footer.returnsRefunds": "Devoluções e reembolsos",
  "footer.faq": "Perguntas frequentes",
  "footer.aboutUs": "Sobre nós",
  "footer.howItWorks": "Como funciona",
  "footer.workWithUs": "Trabalhe connosco",
  "footer.privacy": "Política de privacidade",
  "footer.terms": "Termos e condições",

  /* Carrinho. */
  "cart.title": "Carrinho de compras",
  "cart.empty": "Seu carrinho está vazio",
  "cart.emptyHint": "Adicione produtos para continuar.",
  "cart.continueShopping": "Continuar comprando",
  "cart.remove": "Remover",
  "cart.subtotal": "Subtotal",
  "cart.total": "Total:",
  "cart.checkout": "Finalizar compra",
  "cart.clear": "Limpar carrinho",
  "cart.backToStore": "← Voltar à loja",
  "cart.summary": "Resumo",
  "cart.decrease": "Diminuir quantidade",
  "cart.increase": "Aumentar quantidade",

  /* Checkout. */
  "checkout.title": "Finalizar compra",
  "checkout.subtitle":
    "Preencha os seus dados e envie o pedido pelo WhatsApp.",
  "checkout.empty": "Carrinho vazio",
  "checkout.emptyHint":
    "Adicione produtos ao carrinho antes de finalizar a compra.",
  "checkout.backToStore": "Voltar para loja",
  "checkout.deliveryData": "Dados de entrega",
  "checkout.paymentMethod": "Método de pagamento",
  "checkout.fullName": "Nome completo *",
  "checkout.phone": "Telefone *",
  "checkout.email": "Email (opcional)",
  "checkout.city": "Cidade *",
  "checkout.address1": "Endereço 1",
  "checkout.address1Placeholder": "Endereço completo / Distrito *",
  "checkout.address1Hint":
    "Informe o endereço completo e o distrito.",
  "checkout.address2": "Endereço 2",
  "checkout.address2Placeholder": "Avenida ou Bairro",
  "checkout.address3": "Endereço 3",
  "checkout.address3Placeholder":
    "Zona, Quarteirão, perto de X, Empresa X, Banca X...",
  "checkout.orderSummary": "Resumo do pedido",
  "checkout.products": "Produtos",
  "checkout.delivery": "Entrega",
  "checkout.free": "Grátis",
  "checkout.total": "Total",
  "checkout.sendOrder": "Enviar o pedido/WhatsApp",
  "checkout.preparing": "A preparar pedido...",
  "checkout.whatsappNote":
    "O WhatsApp será aberto com todos os dados do pedido preenchidos automaticamente.",
  "checkout.securePayment": "Pagamento seguro",
  "checkout.trackedDelivery": "Entrega rastreada",
  "checkout.guarantee100": "Garantia 100%",
  "checkout.removeProduct": "Eliminar produto",
  "checkout.bankCard": "Cartão bancário",
  "checkout.errName": "Digite o seu nome completo.",
  "checkout.errPhone": "Digite o seu telefone.",
  "checkout.errPhoneInvalid": "Digite um telefone válido.",
  "checkout.errCity": "Digite a sua cidade.",
  "checkout.errAddress":
    "Digite o endereço completo e o distrito.",
  "checkout.errPayment": "Selecione o método de pagamento.",
  "checkout.errEmptyCart": "O carrinho está vazio.",
  "checkout.errInvalidItem":
    "Existe um produto inválido no carrinho. Atualize a página e tente novamente.",
  "checkout.errWhatsapp":
    "O WhatsApp desta loja ainda não está configurado. Tente novamente mais tarde.",
  "checkout.errPrepare":
    "Não foi possível preparar o pedido. Tente novamente.",

  /* Mensagem de pedido enviada ao WhatsApp. */
  "wa.newOrder": "NOVO PEDIDO",
  "wa.customerData": "DADOS DO CLIENTE",
  "wa.deliveryData": "DADOS DE ENTREGA",
  "wa.products": "PRODUTOS",
  "wa.orderSummary": "RESUMO DO PEDIDO",
  "wa.paymentMethod": "MÉTODO DE PAGAMENTO",
  "wa.confirmation": "CONFIRMAÇÃO",
  "wa.product": "PRODUTO",
  "wa.name": "Nome",
  "wa.phone": "Telefone",
  "wa.email": "Email",
  "wa.city": "Cidade",
  "wa.notInformed": "Não informado",
  "wa.unitPrice": "Preço unitário",
  "wa.quantity": "Quantidade",
  "wa.chosenVariations": "VARIAÇÕES ESCOLHIDAS",
  "wa.noVariations": "Variações: Nenhuma",
  "wa.deliveryFree": "Entrega: Grátis",
  "wa.confirmText": "Gostaria de confirmar este pedido.",
  "wa.confirmRequest":
    "Por favor, confirme a disponibilidade dos produtos e envie as instruções para o pagamento.",
  "wa.thanks": "Obrigado pela atenção!",

  /* Página de atendimento / mensagens. */
  "messages.title": "Atendimento",
  "messages.subtitle": "Fale com a equipa da {store} pelo WhatsApp",
  "messages.descA": "O nosso atendimento é realizado através do ",
  "messages.descB":
    ". Através deste canal poderá falar diretamente com a nossa equipa e obter ajuda durante o processo de compra.",
  "messages.helpProducts": "Dúvidas sobre produtos",
  "messages.helpProductsDesc":
    "Pergunte sobre produtos, preços, disponibilidade, tamanhos, cores ou outras características.",
  "messages.helpBuying": "Ajuda durante a compra",
  "messages.helpBuyingDesc":
    "A nossa equipa pode ajudar com o carrinho, checkout, encomenda e outras dúvidas relacionadas com a compra.",
  "messages.supportDesc":
    "Envie a sua mensagem pelo WhatsApp e a nossa equipa dará continuidade ao atendimento.",
  "messages.continueTitle": "Continuar para o WhatsApp",
  "messages.continueDesc":
    "Clique no botão abaixo para iniciar uma conversa com a nossa equipa.",
  "messages.hello": "Olá, {store}! Gostaria de falar com o atendimento.",

  /* Página de produto. */
  "product.loading": "A carregar o produto...",
  "product.storeNotFoundHint":
    "Não foi possível encontrar a loja associada a este produto.",
  "product.notFound": "Produto não encontrado",
  "product.notFoundHint":
    "Este produto não existe nesta loja ou já não está disponível.",
  "product.back": "Voltar",
  "product.backToStore": "Voltar à loja",
  "product.price": "PREÇO",
  "product.limitedOffer": "Oferta especial por tempo limitado",
  "product.coupon": "CUPOM",
  "product.couponShort": "Cupom",
  "product.saveOnThis": "Economize nesta compra",
  "product.get": "Obter",
  "product.stock": "ESTOQUE",
  "product.stockLeft": "Restam",
  "product.unitsAvailable": "unidades disponíveis",
  "product.quantity": "Quantidade",
  "product.quantityLabel": "QUANTIDADE",
  "product.selectVariants": "Selecione as variantes:",
  "product.added": "Adicionado",
  "product.addAria": "Adicionar produto ao carrinho",
  "product.buyNow": "Comprar agora",
  "product.description": "Descrição do produto",
  "product.tabDescription": "Descrição",
  "product.tabDetails": "Detalhes",
  "product.opening": "A abrir...",
  "product.guaranteeLine":
    "Pagamento seguro • Produto protegido • Compra garantida",
  "product.descriptionFallback":
    "Informações detalhadas do produto aparecerão aqui.",
  "product.details": "Detalhes do produto",
  "product.category": "Categoria",
  "product.categoryFallback": "Sem categoria",
  "product.availability": "Disponibilidade",
  "product.inStock": "Em estoque",
  "product.outOfStock": "Sem estoque",
  "product.garantiaLabel": "Garantia",
  "product.shippingLabel": "Envio",
  "product.international": "Internacional",
  "product.reviewsTab": "Avaliações",
  "product.reviewsEmpty":
    "As avaliações dos clientes aparecerão aqui.",
  "product.reviews": "Avaliações do produto",
  "product.avgRating": "Avaliação média",
  "product.starsN": "{count} estrelas",
  "product.star1": "1 estrela",
  "product.customerComments": "Comentários dos clientes",
  "product.noReviews": "Ainda não existem avaliações.",
  "product.noReviewsHint":
    "Quando clientes avaliarem este produto, elas aparecerão aqui.",
  "product.customerPhotos": "Fotos dos clientes",
  "product.enjoyBefore": "Aproveite antes que termine",
  "product.share": "Compartilhar",
  "product.reviewedSafe":
    "Produto analisado e seguro para compra",
  "product.nameLabel": "NOME DO PRODUTO",
  "product.noName": "Produto sem nome",
  "product.verifiedSupplier": "Fornecedor verificado",
  "product.trackingAfterShipping":
    "Rastreamento disponível após envio",
  "product.related": "Você também pode gostar",
  "product.seeAll": "Ver todos",
  "product.offerAvailable": "Oferta disponível",
  "product.shippingTitle": "Entrega",
  "product.shippingSafe": "Entrega segura com rastreamento",
  "product.destination": "Destino",
  "product.selectAddress": "Selecionar endereço",
  "product.estimatedTime": "Prazo estimado",
  "product.businessDays": "7 - 15 dias úteis",
  "product.protected": "Produto protegido",
  "product.protectedData": "Dados protegidos",
  "product.sendToFriends": "Envie para amigos",
  "product.guarantees": "GARANTIAS",
} as const;

export type TranslationKey = keyof typeof pt;

/**
 * Catálogo EN. O tipo obriga a cobrir TODAS as chaves do PT:
 * acrescentar uma chave acima sem a traduzir faz o
 * `tsc --noEmit` falhar (verificado em i18n.test.ts).
 */
const en: Record<TranslationKey, string> = {
  "nav.home": "Home",
  "nav.messages": "Messages",
  "nav.cart": "Cart",
  "nav.account": "Account",

  "search.placeholder": "What are you looking for today?",
  "search.short": "Search",
  "search.products": "Search products...",
  "info.search": "Search products",
  "info.allProducts": "All products",
  "info.resultsFor": "Results for “{query}”",
  "info.help": "Help",
  "info.contact": "Contact",
  "info.about": "About the store",
  "info.terms": "Terms and policies",
  "info.submitSearch": "Search",
  "info.searchStoreRequired": "Open search from a store to view its products.",
  "info.storeNotFound": "Store not found",
  "info.storeNotFoundHint": "This store could not be loaded.",
  "info.back": "Back",
  "info.contactWhatsapp": "Contact {store} on WhatsApp",
  "info.noContact": "This store has not provided a public contact yet.",
  "info.helpText": "For information about products, orders and delivery, contact the store directly.",
  "info.contactStore": "Contact the store on WhatsApp",
  "info.policiesUnavailable": "This store has not configured its terms and policies yet.",
  "info.storeFallback": "Store information.",

  "header.welcome": "Welcome to {store}",
  "header.superDeals": "Hot deals",
  "header.coupons": "Coupons",
  "header.myOrders": "My orders",
  "header.support": "Support",
  "header.tracking": "Tracking",
  "header.hello": "Hello!",
  "header.account": "My account",
  "header.search": "Search",
  "header.searchWide": "Search products, brands and much more...",
  "header.loadingCategories": "Loading categories...",
  "header.noCategories": "No categories yet",
  "header.couponExclusive": "Exclusive coupons",
  "header.trackingAvailable": "Tracking available",
  "header.dailyDeals": "Deals every day",
  "header.customerSupport": "Customer support",
  "header.allCategories": "All categories",
  "header.openMenu": "Open menu",
  "header.closeMenu": "Close menu",
  "header.signInRegister": "Sign in / Register",

  "grid.title": "Featured products",
  "grid.subtitle": "Products specially selected for you",
  "grid.loading": "Loading products...",
  "grid.empty": "There are no products in the store yet.",
  "grid.emptyHint": "Add products from the admin panel.",

  "store.notFound": "Store not found",
  "store.notFoundHint": "We couldn't find the requested store.",
  "store.productsError": "We couldn't load the products.",
  "store.about": "About the store",
  "store.currency": "Currency",
  "store.commerce": "Online commerce",
  "store.country": "Mozambique",
  "store.storeFallback": "Store",

  "messages.title": "Support",
  "messages.subtitle": "Chat with the {store} team on WhatsApp",
  "messages.descA": "Our support is handled through ",
  "messages.descB":
    ". Through this channel you can talk directly to our team and get help during the purchase process.",
  "messages.helpProducts": "Product questions",
  "messages.helpProductsDesc":
    "Ask about products, prices, availability, sizes, colours or other features.",
  "messages.helpBuying": "Help while buying",
  "messages.helpBuyingDesc":
    "Our team can help with the cart, checkout, order and other purchase questions.",
  "messages.supportDesc":
    "Send your message on WhatsApp and our team will follow up.",
  "messages.continueTitle": "Continue to WhatsApp",
  "messages.continueDesc":
    "Click the button below to start a conversation with our team.",
  "messages.hello":
    "Hello, {store}! I'd like to talk to support.",

  "benefit.fastDelivery": "Delivery in hours",
  "benefit.securePayment": "Secure payment",
  "benefit.verifiedSellers": "Verified sellers",

  "benefits.deliveryTitle": "Delivery in Mozambique",
  "benefits.deliveryText":
    "Receive your products safely and follow your delivery.",
  "benefits.safeBuyTitle": "Safe shopping",
  "benefits.safeBuyText":
    "Your data is handled securely during your purchase.",
  "benefits.verifiedTitle": "Verified products",
  "benefits.verifiedText":
    "Find selected products and sellers for a better experience.",
  "benefits.supportTitle": "Customer support",
  "benefits.supportText":
    "Count on our team to help whenever you need.",
  "benefits.whyTitle": "Why buy at {store}?",
  "benefits.whyText":
    "A simple, safe and reliable shopping experience.",
  "benefits.slogan": "{store} — quality that reaches you.",
  "benefits.about1a":
    " is a store dedicated to selling quality products, carefully selected to offer our customers ",
  "benefits.about1b": "excellence, variety and competitive prices",
  "benefits.about2a":
    "We work to offer a wide variety of products, selecting options that combine ",
  "benefits.about2b": "quality, good price and style",
  "benefits.about3":
    "Our commitment is to make quality products accessible to customers across the country. We aim to offer a simple, safe and convenient shopping experience.",
  "benefits.about4":
    ", we believe shopping should be a simple, safe and satisfying experience. That is why we aim to offer carefully selected products, fair prices and service focused on every customer's needs.",

  "categories.title": "Categories",
  "categories.viewProducts": "View products",
  "categories.explore": "Explore category",

  "banner.weekHighlight": "Featured this week",
  "banner.seeNow": "See now",
  "banner.bigOffers": "Great deals, every day",
  "banner.newCollection": "New collection",
  "banner.exploreCollection": "Explore the new collection",
  "banner.discover": "Discover",
  "banner.campaignTitle": "Campaign title",
  "banner.campaignSubtitle": "Campaign subtitle",
  "banner.yourCampaign": "Your campaign here",
  "banner.title": "Banner title",
  "banner.subtitle": "Banner subtitle",
  "banner.bigCampaign": "Big store campaign",
  "banner.alt": "Store banner",
  "banner.featured": "Featured",

  "card.new": "New",
  "card.buy": "Buy",
  "card.addToCart": "Add to cart",
  "card.offer": "DEAL",
  "card.featured": "Featured",
  "card.price": "PRICE",
  "card.verifiedStore": "Verified store",
  "card.productImage": "PRODUCT IMAGE",
  "card.productInfo": "PRODUCT INFORMATION",

  "footer.products": "Products",
  "footer.contacts": "Contact",
  "footer.help": "Help",
  "footer.newsletterTitle": "Get the latest news",
  "footer.newsletterText": "Exclusive offers straight to your inbox.",
  "footer.yourEmail": "Your email",
  "footer.store": "Store",
  "footer.promotions": "Promotions",
  "footer.deliveries": "Deliveries",
  "footer.returns": "Returns",
  "footer.allRights": "All rights reserved.",
  "footer.tagline":
    "Find quality products, great offers and a simple, safe shopping experience.",
  "footer.onlineStore": "Online store in Mozambique",
  "footer.regions": "Deliveries across several regions",
  "footer.securePurchases": "Secure shopping",
  "footer.shop": "SHOP",
  "footer.service": "SUPPORT",
  "footer.aboutUsTitle": "ABOUT US",
  "footer.followUs": "FOLLOW US",
  "footer.followText":
    "Follow our store on social media and stay up to date with news and offers.",
  "footer.share": "Share",
  "footer.paymentMethods": "Payment methods:",
  "footer.paymentMethodsTitle": "PAYMENT METHODS",
  "footer.bank": "Bank",
  "footer.followStore": "FOLLOW OUR STORE",
  "footer.pricesIn": "Prices shown in {currency}",
  "footer.onlinePrices":
    "Online shopping in Mozambique • Prices in {currency}",
  "footer.allCategories": "All categories",
  "footer.electronics": "Electronics",
  "footer.fashion": "Fashion",
  "footer.beauty": "Beauty",
  "footer.toys": "Toys",
  "footer.newArrivals": "New arrivals",
  "footer.deals": "Offers",
  "footer.helpCenter": "Help center",
  "footer.contactUs": "Contact us",
  "footer.howToBuy": "How to buy",
  "footer.returnsRefunds": "Returns and refunds",
  "footer.faq": "Frequently asked questions",
  "footer.aboutUs": "About us",
  "footer.howItWorks": "How it works",
  "footer.workWithUs": "Work with us",
  "footer.privacy": "Privacy policy",
  "footer.terms": "Terms and conditions",

  "cart.title": "Shopping cart",
  "cart.empty": "Your cart is empty",
  "cart.emptyHint": "Add products to continue.",
  "cart.continueShopping": "Continue shopping",
  "cart.remove": "Remove",
  "cart.subtotal": "Subtotal",
  "cart.total": "Total:",
  "cart.checkout": "Checkout",
  "cart.clear": "Clear cart",
  "cart.backToStore": "← Back to store",
  "cart.summary": "Summary",
  "cart.decrease": "Decrease quantity",
  "cart.increase": "Increase quantity",

  "checkout.title": "Checkout",
  "checkout.subtitle":
    "Fill in your details and send the order via WhatsApp.",
  "checkout.empty": "Empty cart",
  "checkout.emptyHint": "Add products to the cart before checking out.",
  "checkout.backToStore": "Back to store",
  "checkout.deliveryData": "Delivery details",
  "checkout.paymentMethod": "Payment method",
  "checkout.fullName": "Full name *",
  "checkout.phone": "Phone *",
  "checkout.email": "Email (optional)",
  "checkout.city": "City *",
  "checkout.address1": "Address 1",
  "checkout.address1Placeholder": "Full address / District *",
  "checkout.address1Hint": "Enter the full address and the district.",
  "checkout.address2": "Address 2",
  "checkout.address2Placeholder": "Avenue or neighbourhood",
  "checkout.address3": "Address 3",
  "checkout.address3Placeholder":
    "Zone, block, near X, Company X, Stall X...",
  "checkout.orderSummary": "Order summary",
  "checkout.products": "Products",
  "checkout.delivery": "Delivery",
  "checkout.free": "Free",
  "checkout.total": "Total",
  "checkout.sendOrder": "Send order / WhatsApp",
  "checkout.preparing": "Preparing order...",
  "checkout.whatsappNote":
    "WhatsApp will open with all order details filled in automatically.",
  "checkout.securePayment": "Secure payment",
  "checkout.trackedDelivery": "Tracked delivery",
  "checkout.guarantee100": "100% guarantee",
  "checkout.removeProduct": "Remove product",
  "checkout.bankCard": "Bank card",
  "checkout.errName": "Enter your full name.",
  "checkout.errPhone": "Enter your phone number.",
  "checkout.errPhoneInvalid": "Enter a valid phone number.",
  "checkout.errCity": "Enter your city.",
  "checkout.errAddress": "Enter the full address and the district.",
  "checkout.errPayment": "Select a payment method.",
  "checkout.errEmptyCart": "The cart is empty.",
  "checkout.errInvalidItem":
    "There is an invalid product in the cart. Refresh the page and try again.",
  "checkout.errWhatsapp":
    "This store's WhatsApp is not configured yet. Please try again later.",
  "checkout.errPrepare":
    "We couldn't prepare the order. Please try again.",

  "wa.newOrder": "NEW ORDER",
  "wa.customerData": "CUSTOMER DETAILS",
  "wa.deliveryData": "DELIVERY DETAILS",
  "wa.products": "PRODUCTS",
  "wa.orderSummary": "ORDER SUMMARY",
  "wa.paymentMethod": "PAYMENT METHOD",
  "wa.confirmation": "CONFIRMATION",
  "wa.product": "PRODUCT",
  "wa.name": "Name",
  "wa.phone": "Phone",
  "wa.email": "Email",
  "wa.city": "City",
  "wa.notInformed": "Not provided",
  "wa.unitPrice": "Unit price",
  "wa.quantity": "Quantity",
  "wa.chosenVariations": "CHOSEN OPTIONS",
  "wa.noVariations": "Options: None",
  "wa.deliveryFree": "Delivery: Free",
  "wa.confirmText": "I would like to confirm this order.",
  "wa.confirmRequest":
    "Please confirm product availability and send the payment instructions.",
  "wa.thanks": "Thank you for your attention!",

  "product.loading": "Loading product...",
  "product.storeNotFoundHint":
    "We couldn't find the store linked to this product.",
  "product.notFound": "Product not found",
  "product.notFoundHint":
    "This product doesn't exist in this store or is no longer available.",
  "product.back": "Back",
  "product.backToStore": "Back to store",
  "product.price": "PRICE",
  "product.limitedOffer": "Special offer for a limited time",
  "product.coupon": "COUPON",
  "product.couponShort": "Coupon",
  "product.saveOnThis": "Save on this purchase",
  "product.get": "Get",
  "product.stock": "STOCK",
  "product.stockLeft": "Only",
  "product.unitsAvailable": "units available",
  "product.quantity": "Quantity",
  "product.quantityLabel": "QUANTITY",
  "product.selectVariants": "Select the options:",
  "product.added": "Added",
  "product.addAria": "Add product to cart",
  "product.buyNow": "Buy now",
  "product.description": "Product description",
  "product.tabDescription": "Description",
  "product.tabDetails": "Details",
  "product.opening": "Opening...",
  "product.guaranteeLine":
    "Secure payment • Protected product • Guaranteed purchase",
  "product.descriptionFallback":
    "Detailed product information will appear here.",
  "product.details": "Product details",
  "product.category": "Category",
  "product.categoryFallback": "No category",
  "product.availability": "Availability",
  "product.inStock": "In stock",
  "product.outOfStock": "Out of stock",
  "product.garantiaLabel": "Warranty",
  "product.shippingLabel": "Shipping",
  "product.international": "International",
  "product.reviewsTab": "Reviews",
  "product.reviewsEmpty": "Customer reviews will appear here.",
  "product.reviews": "Product reviews",
  "product.avgRating": "Average rating",
  "product.starsN": "{count} stars",
  "product.star1": "1 star",
  "product.customerComments": "Customer comments",
  "product.noReviews": "No reviews yet.",
  "product.noReviewsHint":
    "When customers review this product, they will appear here.",
  "product.customerPhotos": "Customer photos",
  "product.enjoyBefore": "Enjoy it before it ends",
  "product.share": "Share",
  "product.reviewedSafe": "Reviewed product, safe to buy",
  "product.nameLabel": "PRODUCT NAME",
  "product.noName": "Unnamed product",
  "product.verifiedSupplier": "Verified supplier",
  "product.trackingAfterShipping": "Tracking available after dispatch",
  "product.related": "You may also like",
  "product.seeAll": "See all",
  "product.offerAvailable": "Offer available",
  "product.shippingTitle": "Delivery",
  "product.shippingSafe": "Safe delivery with tracking",
  "product.destination": "Destination",
  "product.selectAddress": "Select address",
  "product.estimatedTime": "Estimated time",
  "product.businessDays": "7 - 15 business days",
  "product.protected": "Protected product",
  "product.protectedData": "Protected data",
  "product.sendToFriends": "Send to friends",
  "product.guarantees": "GUARANTEES",
};

const catalogs: Record<Language, Record<TranslationKey, string>> = {
  pt,
  en,
};

/** Todas as chaves disponíveis (ordem estável do catálogo PT). */
export const TRANSLATION_KEYS = Object.keys(pt) as TranslationKey[];

/**
 * Traduz uma chave.
 *
 * `vars` substitui marcadores no formato {nome}: por exemplo
 * translate("pt", "cart.itemCount", { count: 3 }).
 *
 * Uma chave em falta devolve a própria chave (nunca `undefined`),
 * para que uma string não traduzida apareça identificável na
 * interface em vez de deixar o ecrã em branco.
 */
export function translate(
  language: string | null | undefined,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const catalog = catalogs[normalizeLanguage(language)];

  const template = catalog[key] ?? pt[key] ?? key;

  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

/**
 * Agrupa milhares sem Intl/locale.
 *
 * Mesma decisão de client/src/lib/plans.ts: formatação
 * determinística (o resultado não depende do ICU do ambiente),
 * o que mantém preços iguais no browser, no servidor e nos
 * testes.
 */
function groupThousands(value: number, separator: string): string {
  const truncated = Math.trunc(value ?? 0);

  const sign = truncated < 0 ? "-" : "";

  const digits = Math.abs(truncated).toString();

  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Preço já formatado, sem o código da moeda:
 *   pt → "1.234"      en → "1,234"
 *
 * Preços inteiros (o caso real das lojas) não ganham casas
 * decimais em nenhum idioma, para não inventar cêntimos que o
 * lojista nunca introduziu.
 */
export function formatAmount(
  value: number | null | undefined,
  language: string | null | undefined
): string {
  const languageOrDefault = normalizeLanguage(language);

  const separator = languageOrDefault === "en" ? "," : ".";

  return groupThousands(value ?? 0, separator);
}

/**
 * Preço com a moeda da loja, ex.: "1.250 MZN".
 *
 * O código da moeda (não o símbolo) é o formato que o
 * storefront Nova já usava, e é o único que funciona igual para
 * MZN, ZAR e USD.
 */
export function formatMoney(
  value: number | null | undefined,
  currency: string | null | undefined,
  language: string | null | undefined
): string {
  return `${formatAmount(value, language)} ${normalizeCurrency(currency)}`;
}
