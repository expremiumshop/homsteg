import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "wouter";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import {
  getStoreSlugFromHostname,
} from "./lib/store-url";

/* =============================================================
   CODE SPLITTING POR ROTA

   Todas as páginas e temas são carregados em chunks lazy.
   Antes, um único bundle incluía os 8 temas completos
   (loja + produto + carrinho + checkout + mensagens + conta
   cada) e todas as páginas do dashboard — mesmo quem só
   abria a Home pública. Agora cada rota baixa apenas o seu
   chunk; o React Query e a sessão ficam no bundle base.
   ============================================================= */

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Storefront = lazy(() => import("./pages/Storefront"));
const StoreThemes = lazy(() => import("./pages/StoreThemes"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const CreateStoreBusiness = lazy(() => import("./pages/CreateStoreBusiness"));
const CreateStoreData = lazy(() => import("./pages/CreateStoreData"));
const CreateStoreReview = lazy(() => import("./pages/CreateStoreReview"));
const Login = lazy(() => import("./pages/Login"));
const RecoverPassword = lazy(() => import("./pages/RecoverPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Tema NOVA */
const NovaStorefront = lazy(() => import("./themes/nova/Storefront"));
const NovaProductPage = lazy(() => import("./themes/nova/NovaProductPage"));
const NovaCartPage = lazy(() => import("./themes/nova/NovaCartPage"));
const NovaMessagesPage = lazy(() => import("./themes/nova/NovaMessagesPage"));
const NovaAccountPage = lazy(() => import("./themes/nova/NovaAccountPage"));
const NovaCheckoutPage = lazy(() => import("./themes/nova/NovaCheckoutPage"));

/* Tema MARKET */
const MarketStorefront = lazy(() => import("./themes/market/Storefront"));
const MarketProductPage = lazy(() => import("./themes/market/MarketProductPage"));
const MarketCartPage = lazy(() => import("./themes/market/MarketCartPage"));
const MarketMessagesPage = lazy(() => import("./themes/market/MarketMessagesPage"));
const MarketAccountPage = lazy(() => import("./themes/market/MarketAccountPage"));
const MarketCheckoutPage = lazy(() => import("./themes/market/MarketCheckoutPage"));

/* Tema ESSENZA */
const EssenzaStorefront = lazy(() => import("./themes/essenza/Storefront"));
const EssenzaProductPage = lazy(() => import("./themes/essenza/EssenzaProductPage"));
const EssenzaCartPage = lazy(() => import("./themes/essenza/EssenzaCartPage"));
const EssenzaMessagesPage = lazy(() => import("./themes/essenza/EssenzaMessagesPage"));
const EssenzaAccountPage = lazy(() => import("./themes/essenza/EssenzaAccountPage"));
const EssenzaCheckoutPage = lazy(() => import("./themes/essenza/EssenzaCheckoutPage"));

/* Tema CALIZA */
const CalizaStorefront = lazy(() => import("./themes/caliza/Storefront"));
const CalizaProductPage = lazy(() => import("./themes/caliza/CalizaProductPage"));
const CalizaCartPage = lazy(() => import("./themes/caliza/CalizaCartPage"));
const CalizaMessagesPage = lazy(() => import("./themes/caliza/CalizaMessagesPage"));
const CalizaAccountPage = lazy(() => import("./themes/caliza/CalizaAccountPage"));
const CalizaCheckoutPage = lazy(() => import("./themes/caliza/CalizaCheckoutPage"));

/* Tema CHAZUCA */
const ChazucaStorefront = lazy(() => import("./themes/chazuca/Storefront"));
const ChazucaProductPage = lazy(() => import("./themes/chazuca/ChazucaProductPage"));
const ChazucaCartPage = lazy(() => import("./themes/chazuca/ChazucaCartPage"));
const ChazucaMessagesPage = lazy(() => import("./themes/chazuca/ChazucaMessagesPage"));
const ChazucaAccountPage = lazy(() => import("./themes/chazuca/ChazucaAccountPage"));
const ChazucaCheckoutPage = lazy(() => import("./themes/chazuca/ChazucaCheckoutPage"));

/* Tema URBAN */
const UrbanStorefront = lazy(() => import("./themes/urban/Storefront"));
const UrbanProductPage = lazy(() => import("./themes/urban/UrbanProductPage"));
const UrbanCartPage = lazy(() => import("./themes/urban/UrbanCartPage"));
const UrbanMessagesPage = lazy(() => import("./themes/urban/UrbanMessagesPage"));
const UrbanAccountPage = lazy(() => import("./themes/urban/UrbanAccountPage"));
const UrbanCheckoutPage = lazy(() => import("./themes/urban/UrbanCheckoutPage"));

/* Tema PRIME */
const PrimeStorefront = lazy(() => import("./themes/prime/Storefront"));
const PrimeProductPage = lazy(() => import("./themes/prime/PrimeProductPage"));
const PrimeCartPage = lazy(() => import("./themes/prime/PrimeCartPage"));
const PrimeMessagesPage = lazy(() => import("./themes/prime/PrimeMessagesPage"));
const PrimeAccountPage = lazy(() => import("./themes/prime/PrimeAccountPage"));
const PrimeCheckoutPage = lazy(() => import("./themes/prime/PrimeCheckoutPage"));

/* Tema LUXE */
const LuxeStorefrontPreview = lazy(() => import("./themes/luxe/Storefront"));
const LuxeProductPage = lazy(() => import("./themes/luxe/LuxeProductPage"));
const LuxeCartPage = lazy(() => import("./themes/luxe/LuxeCartPage"));
const LuxeMessagesPage = lazy(() => import("./themes/luxe/LuxeMessagesPage"));
const LuxeAccountPage = lazy(() => import("./themes/luxe/LuxeAccountPage"));
const LuxeCheckoutPage = lazy(() => import("./themes/luxe/LuxeCheckoutPage"));

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

  const storeSlug = getStoreSlugFromHostname(
    window.location.hostname,
  );

  if (storeSlug) {
    return (
      <Storefront slugOverride={storeSlug} />
    );
  }
  return <Home />;
}

function UrbanThemePreview() {
  return <UrbanStorefront mode="demo" />;
}

function PrimeThemePreview() {
  return <PrimeStorefront mode="demo" />;
}

function LuxeThemePreview() {
  return <LuxeStorefrontPreview mode="demo" />;
}

function NovaThemePreview() {
  return <NovaStorefront mode="demo" />;
}

function MarketThemePreview() {
  return <MarketStorefront />;
}

function EssenzaThemePreview() {
  return <EssenzaStorefront />;
}

function CalizaThemePreview() {
  return <CalizaStorefront />;
}

function ChazucaThemePreview() {
  return <ChazucaStorefront />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRoute} />

      <Route
        path="/criar-conta"
        component={CreateAccount}
      />

      <Route
        path="/criar-loja/negocio"
        component={CreateStoreBusiness}
      />

      <Route
        path="/criar-loja/dados"
        component={CreateStoreData}
      />

      <Route
        path="/criar-loja/revisao"
        component={CreateStoreReview}
      />

      <Route path="/login" component={Login} />

      <Route
        path="/recuperar-palavra-passe"
        component={RecoverPassword}
      />

      <Route path="/app" component={Dashboard} />

      <Route path="/app/themes">
        <Redirect to="/store/themes" />
      </Route>

      <Route
        path="/app/:section"
        component={Dashboard}
      />

      <Route
        path="/store/themes"
        component={StoreThemes}
      />

      {/* =====================================================
          LOGIN ADMIN
          ===================================================== */}
      <Route
        path="/admin/login"
        component={AdminLogin}
      />

      {/* =====================================================
          CARRINHO NOVA
          ===================================================== */}
      <Route
        path="/themes/nova/carrinho"
        component={NovaCartPage}
      />

      {/* =====================================================
          CHECKOUT NOVA
          ===================================================== */}
      <Route
        path="/themes/nova/checkout"
        component={NovaCheckoutPage}
      />

      {/* =====================================================
          MENSAGENS NOVA
          ===================================================== */}
      <Route
        path="/themes/nova/mensagens"
        component={NovaMessagesPage}
      />

      {/* =====================================================
          CONTA NOVA
          ===================================================== */}
      <Route
        path="/themes/nova/conta"
        component={NovaAccountPage}
      />

      {/* =====================================================
          PRODUTO NOVA
          ===================================================== */}
      <Route
        path="/themes/nova/produto/:slug"
        component={NovaProductPage}
      />

      {/* =====================================================
          LOJA NOVA
          ===================================================== */}
      <Route
        path="/themes/nova"
        component={NovaThemePreview}
      />

      {/* =====================================================
          LOJA MARKET
          ===================================================== */}
      <Route
        path="/themes/market/carrinho"
        component={MarketCartPage}
      />

      <Route
        path="/themes/market/checkout"
        component={MarketCheckoutPage}
      />

      <Route
        path="/themes/market/mensagens"
        component={MarketMessagesPage}
      />

      <Route
        path="/themes/market/conta"
        component={MarketAccountPage}
      />

      <Route
        path="/themes/market/produto/:slug"
        component={MarketProductPage}
      />

      <Route
        path="/themes/market"
        component={MarketThemePreview}
      />

      {/* =====================================================
          LOJA ESSENZA
          ===================================================== */}
      <Route
        path="/themes/essenza/carrinho"
        component={EssenzaCartPage}
      />

      <Route
        path="/themes/essenza/checkout"
        component={EssenzaCheckoutPage}
      />

      <Route
        path="/themes/essenza/mensagens"
        component={EssenzaMessagesPage}
      />

      <Route
        path="/themes/essenza/conta"
        component={EssenzaAccountPage}
      />

      <Route
        path="/themes/essenza/produto/:slug"
        component={EssenzaProductPage}
      />

      <Route
        path="/themes/essenza"
        component={EssenzaThemePreview}
      />

      {/* =====================================================
          LOJA CALIZA
          ===================================================== */}
      <Route
        path="/themes/caliza/carrinho"
        component={CalizaCartPage}
      />

      <Route
        path="/themes/caliza/checkout"
        component={CalizaCheckoutPage}
      />

      <Route
        path="/themes/caliza/mensagens"
        component={CalizaMessagesPage}
      />

      <Route
        path="/themes/caliza/conta"
        component={CalizaAccountPage}
      />

      <Route
        path="/themes/caliza/produto/:slug"
        component={CalizaProductPage}
      />

      <Route
        path="/themes/caliza"
        component={CalizaThemePreview}
      />

      {/* =====================================================
          LOJA URBAN
          ===================================================== */}
      <Route
        path="/themes/urban/carrinho"
        component={UrbanCartPage}
      />

      <Route
        path="/themes/urban/checkout"
        component={UrbanCheckoutPage}
      />

      <Route
        path="/themes/urban/mensagens"
        component={UrbanMessagesPage}
      />

      <Route
        path="/themes/urban/conta"
        component={UrbanAccountPage}
      />

      <Route
        path="/themes/urban/produto/:slug"
        component={UrbanProductPage}
      />

      <Route
        path="/themes/urban"
        component={UrbanThemePreview}
      />

      {/* =====================================================
          LOJA PRIME
          ===================================================== */}
      <Route
        path="/themes/prime/carrinho"
        component={PrimeCartPage}
      />

      <Route
        path="/themes/prime/checkout"
        component={PrimeCheckoutPage}
      />

      <Route
        path="/themes/prime/mensagens"
        component={PrimeMessagesPage}
      />

      <Route
        path="/themes/prime/conta"
        component={PrimeAccountPage}
      />

      <Route
        path="/themes/prime/produto/:slug"
        component={PrimeProductPage}
      />

      <Route
        path="/themes/prime"
        component={PrimeThemePreview}
      />

      {/* =====================================================
          LOJA LUXE
          ===================================================== */}
      <Route
        path="/themes/luxe/carrinho"
        component={LuxeCartPage}
      />

      <Route
        path="/themes/luxe/checkout"
        component={LuxeCheckoutPage}
      />

      <Route
        path="/themes/luxe/mensagens"
        component={LuxeMessagesPage}
      />

      <Route
        path="/themes/luxe/conta"
        component={LuxeAccountPage}
      />

      <Route
        path="/themes/luxe/produto/:slug"
        component={LuxeProductPage}
      />

      <Route
        path="/themes/luxe"
        component={LuxeThemePreview}
      />

      {/* =====================================================
          LOJA CHAZUCA
          ===================================================== */}
      <Route
        path="/themes/chazuca/carrinho"
        component={ChazucaCartPage}
      />

      <Route
        path="/themes/chazuca/checkout"
        component={ChazucaCheckoutPage}
      />

      <Route
        path="/themes/chazuca/mensagens"
        component={ChazucaMessagesPage}
      />

      <Route
        path="/themes/chazuca/conta"
        component={ChazucaAccountPage}
      />

      <Route
        path="/themes/chazuca/produto/:slug"
        component={ChazucaProductPage}
      />

      <Route
        path="/themes/chazuca"
        component={ChazucaThemePreview}
      />

      {/* =====================================================
          LOJA REAL
          ===================================================== */}
      <Route
        path="/store/:slug"
        component={Storefront}
      />

      {/* =====================================================
          ADMIN
          ===================================================== */}
      <Route
        path="/admin"
        component={Admin}
      />

      <Route
        path="/404"
        component={NotFound}
      />

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster
              position="top-right"
              richColors
            />

            <Suspense fallback={<RouteFallback />}>
              <Router />
            </Suspense>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
