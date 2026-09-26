import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Redirect, Route, Switch } from "wouter";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Storefront from "./pages/Storefront";
import StoreThemes from "./pages/StoreThemes";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import CreateAccount from "./pages/CreateAccount";
import CreateStoreBusiness from "./pages/CreateStoreBusiness";
import CreateStoreData from "./pages/CreateStoreData";
import CreateStoreReview from "./pages/CreateStoreReview";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import NovaStorefront from "./themes/nova/Storefront";
import NovaProductPage from "./themes/nova/NovaProductPage";
import NovaCartPage from "./themes/nova/NovaCartPage";
import NovaMessagesPage from "./themes/nova/NovaMessagesPage";
import NovaAccountPage from "./themes/nova/NovaAccountPage";
import NovaCheckoutPage from "./themes/nova/NovaCheckoutPage";

import MarketStorefront from "./themes/market/Storefront";
import MarketProductPage from "./themes/market/MarketProductPage";
import MarketCartPage from "./themes/market/MarketCartPage";
import MarketMessagesPage from "./themes/market/MarketMessagesPage";
import MarketAccountPage from "./themes/market/MarketAccountPage";
import MarketCheckoutPage from "./themes/market/MarketCheckoutPage";

import EssenzaStorefront from "./themes/essenza/Storefront";
import EssenzaProductPage from "./themes/essenza/EssenzaProductPage";
import EssenzaCartPage from "./themes/essenza/EssenzaCartPage";
import EssenzaMessagesPage from "./themes/essenza/EssenzaMessagesPage";
import EssenzaAccountPage from "./themes/essenza/EssenzaAccountPage";
import EssenzaCheckoutPage from "./themes/essenza/EssenzaCheckoutPage";

import CalizaStorefront from "./themes/caliza/Storefront";
import CalizaProductPage from "./themes/caliza/CalizaProductPage";
import CalizaCartPage from "./themes/caliza/CalizaCartPage";
import CalizaMessagesPage from "./themes/caliza/CalizaMessagesPage";
import CalizaAccountPage from "./themes/caliza/CalizaAccountPage";
import CalizaCheckoutPage from "./themes/caliza/CalizaCheckoutPage";

import ChazucaStorefront from "./themes/chazuca/Storefront";
import ChazucaProductPage from "./themes/chazuca/ChazucaProductPage";
import ChazucaCartPage from "./themes/chazuca/ChazucaCartPage";
import ChazucaMessagesPage from "./themes/chazuca/ChazucaMessagesPage";
import ChazucaAccountPage from "./themes/chazuca/ChazucaAccountPage";
import ChazucaCheckoutPage from "./themes/chazuca/ChazucaCheckoutPage";

import UrbanStorefront from "./themes/urban/Storefront";
import UrbanProductPage from "./themes/urban/UrbanProductPage";
import UrbanCartPage from "./themes/urban/UrbanCartPage";
import UrbanMessagesPage from "./themes/urban/UrbanMessagesPage";
import UrbanAccountPage from "./themes/urban/UrbanAccountPage";
import UrbanCheckoutPage from "./themes/urban/UrbanCheckoutPage";

import PrimeStorefront from "./themes/prime/Storefront";
import PrimeProductPage from "./themes/prime/PrimeProductPage";
import PrimeCartPage from "./themes/prime/PrimeCartPage";
import PrimeMessagesPage from "./themes/prime/PrimeMessagesPage";
import PrimeAccountPage from "./themes/prime/PrimeAccountPage";
import PrimeCheckoutPage from "./themes/prime/PrimeCheckoutPage";

import LuxeStorefrontPreview from "./themes/luxe/Storefront";
import LuxeProductPage from "./themes/luxe/LuxeProductPage";
import LuxeCartPage from "./themes/luxe/LuxeCartPage";
import LuxeMessagesPage from "./themes/luxe/LuxeMessagesPage";
import LuxeAccountPage from "./themes/luxe/LuxeAccountPage";
import LuxeCheckoutPage from "./themes/luxe/LuxeCheckoutPage";

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
      <Route path="/" component={Home} />

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

            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
