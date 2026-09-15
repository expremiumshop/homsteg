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

function NovaThemePreview() {
  return <NovaStorefront mode="demo" />;
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