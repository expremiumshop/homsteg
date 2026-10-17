import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import {
  getStoreSlugFromHostname,
  isCustomDomainHostname,
} from "./lib/store-url";
import { trpc } from "./lib/trpc";

/* =============================================================
   CODE SPLITTING POR ROTA

   As páginas são carregadas em chunks lazy. O Nova mantém a
   loja pública separada das páginas administrativas, reduzindo
   o bundle inicial. Cada rota baixa apenas o seu
   chunk; o React Query e a sessão ficam no bundle base.
   ============================================================= */

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Storefront = lazy(() => import("./pages/Storefront"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const CreateStoreBusiness = lazy(() => import("./pages/CreateStoreBusiness"));
const CreateStoreData = lazy(() => import("./pages/CreateStoreData"));
const CreateStoreReview = lazy(() => import("./pages/CreateStoreReview"));
const Login = lazy(() => import("./pages/Login"));
const SocialAuthCallback = lazy(() => import("./pages/SocialAuthCallback"));
const RecoverPassword = lazy(() => import("./pages/RecoverPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Tema NOVA */
const NovaStorefront = lazy(() => import("./themes/nova/Storefront"));
const NovaProductPage = lazy(() => import("./themes/nova/NovaProductPage"));
const NovaCartPage = lazy(() => import("./themes/nova/NovaCartPage"));
const NovaMessagesPage = lazy(() => import("./themes/nova/NovaMessagesPage"));
const NovaAccountPage = lazy(() => import("./themes/nova/NovaAccountPage"));
const NovaCheckoutPage = lazy(() => import("./themes/nova/NovaCheckoutPage"));
const NovaInfoPage = lazy(() => import("./themes/nova/NovaInfoPage"));

/**
 * Fallback mínimo enquanto o chunk da rota chega.
 * Mesma linguagem visual do loading do storefront
 * (spinner neutro, sem flash de conteúdo errado).
 */
function RouteFallback() {
  return (
    <div
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-white"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
    </div>
  );
}

/**
 * Hostname-aware root route.
 *
 * A Vercel serve a mesma SPA em todos os hostnames
 * (www.homsteg.com, homsteg.com e <slug>.homsteg.com),
 * pelo que a rota "/" tem de decidir o que renderizar
 * a partir do hostname:
 *
 * - subdomínio de loja (ex.: fresh1.homsteg.com)
 *     → Storefront com o slug extraído do hostname,
 *       usando a MESMA arquitetura de /store/:slug
 *       (stores.bySlug → Neon → themeKey → tema).
 *
 * - raiz/www (ex.: www.homsteg.com)
 *     → Home, o site principal HOMSTEG, intacto.
 */
function RootRoute() {
  if (typeof window === "undefined") {
    return <Home />;
  }

  const storeSlug = getStoreSlugFromHostname(window.location.hostname);

  if (storeSlug) {
    return <Storefront slugOverride={storeSlug} />;
  }
  if (isCustomDomainHostname(window.location.hostname)) {
    const customStoreSlug = new URLSearchParams(window.location.search).get(
      "storeSlug"
    );
    if (customStoreSlug) return <Storefront slugOverride={customStoreSlug} />;
  }
  return <Home />;
}

function NovaThemePreview() {
  return <NovaStorefront mode="demo" />;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={RootRoute} />

      <Route path="/criar-conta" component={CreateAccount} />

      <Route path="/criar-loja/negocio" component={CreateStoreBusiness} />

      <Route path="/criar-loja/dados" component={CreateStoreData} />

      <Route path="/criar-loja/revisao" component={CreateStoreReview} />

      <Route path="/login" component={Login} />

      <Route path="/login/social/callback" component={SocialAuthCallback} />

      <Route path="/recuperar-palavra-passe" component={RecoverPassword} />

      <Route path="/app" component={Dashboard} />

      <Route path="/app/themes">
        <Redirect to="/app/branding" />
      </Route>

      <Route path="/app/:section" component={Dashboard} />

      <Route path="/store/themes">
        <Redirect to="/app/branding" />
      </Route>

      {/* =====================================================
          LOGIN ADMIN
          ===================================================== */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* =====================================================
          CARRINHO NOVA
          ===================================================== */}
      <Route path="/themes/nova/carrinho" component={NovaCartPage} />

      {/* =====================================================
          CHECKOUT NOVA
          ===================================================== */}
      <Route path="/themes/nova/checkout" component={NovaCheckoutPage} />

      {/* =====================================================
          MENSAGENS NOVA
          ===================================================== */}
      <Route path="/themes/nova/mensagens" component={NovaMessagesPage} />

      {/* =====================================================
          CONTA NOVA
          ===================================================== */}
      <Route path="/themes/nova/conta" component={NovaAccountPage} />

      <Route path="/themes/nova/pesquisa" component={NovaInfoPage} />
      <Route path="/themes/nova/ajuda" component={NovaInfoPage} />
      <Route path="/themes/nova/contacto" component={NovaInfoPage} />
      <Route path="/themes/nova/sobre" component={NovaInfoPage} />
      <Route path="/themes/nova/termos" component={NovaInfoPage} />

      {/* =====================================================
          PRODUTO NOVA
          ===================================================== */}
      <Route path="/themes/nova/produto/:slug" component={NovaProductPage} />

      {/* =====================================================
          LOJA NOVA
          ===================================================== */}
      <Route path="/themes/nova" component={NovaThemePreview} />

      {/* =====================================================
          LOJA REAL
          ===================================================== */}
      <Route path="/store/:slug" component={Storefront} />

      {/* =====================================================
          ADMIN
          ===================================================== */}
      <Route path="/admin" component={Admin} />

      <Route path="/404" component={NotFound} />

      <Route component={NotFound} />
    </Switch>
  );
}

function CustomDomainRoutes() {
  const hostname = window.location.hostname;
  const [, setLocation] = useLocation();
  const location = window.location.pathname + window.location.search;
  const domainQuery = trpc.stores.domain.byHostname.useQuery(
    { domain: hostname },
    { retry: false, staleTime: 60_000 }
  );
  const slug = domainQuery.data?.slug;
  const search = new URLSearchParams(window.location.search);
  const hasCanonicalStore = Boolean(slug && search.get("storeSlug") === slug);

  useEffect(() => {
    if (!slug || hasCanonicalStore) return;
    search.set("storeSlug", slug);
    setLocation(`${window.location.pathname}?${search.toString()}`);
  }, [slug, hasCanonicalStore, location, setLocation]);

  if (domainQuery.isLoading || (slug && !hasCanonicalStore))
    return <RouteFallback />;
  if (domainQuery.isError || !slug) return <NotFound />;
  return <AppRoutes />;
}

function Router() {
  if (
    typeof window !== "undefined" &&
    isCustomDomainHostname(window.location.hostname)
  ) {
    return <CustomDomainRoutes />;
  }
  return <AppRoutes />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster position="top-right" richColors />

            <Suspense fallback={<RouteFallback />}>
              <Router />
            </Suspense>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
