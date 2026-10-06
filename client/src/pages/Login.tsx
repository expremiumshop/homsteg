import { FormEvent, useState } from "react";

import { useLocation } from "wouter";

import HomstegLogo from "@/components/HomstegLogo";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import { SocialAuthButtons } from "@/components/SocialAuthButtons";

import { authClient } from "@/lib/auth-client";

import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, setLocation] = useLocation();

  const utils = trpc.useUtils();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  async function finishLogin() {
    try {
      const stores = await utils.stores.mine.fetch();

      if (stores.length > 0) {
        const firstItem = stores[0];

        const firstStore =
          "store" in firstItem
            ? firstItem.store
            : firstItem;

        if (firstStore?.id) {
          toast.success("Login efetuado com sucesso!");

          window.location.assign(
            `/app?storeId=${encodeURIComponent(firstStore.id)}`,
          );

          return;
        }

        console.error(
          "[Login] Loja encontrada, mas sem ID:",
          firstItem,
        );
      }

      toast.success("Login efetuado com sucesso!");

      window.location.assign("/criar-loja/negocio");
    } catch (error: unknown) {
      console.error(
        "[Login] Erro ao procurar loja:",
        error,
      );

      toast.error(
        "A autenticação foi concluída, mas não foi possível carregar a tua loja.",
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Introduz o teu email.");
      return;
    }

    if (!password) {
      toast.error("Introduz a tua palavra-passe.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: cleanEmail,
        password,
        rememberMe: true,
      });

      if (result.error) {
        console.error(
          "[Better Auth Login Error]",
          result.error,
        );

        toast.error(
          result.error.message ||
            "E-mail ou palavra-passe incorretos.",
        );

        return;
      }

      // A sessão Better Auth acabou de ser criada.
      // Descarta qualquer resposta anterior antes de procurar
      // a loja já associada a este utilizador.
      await Promise.all([
        utils.auth.me.invalidate(),
        utils.stores.mine.invalidate(),
      ]);

      await finishLogin();
    } catch (error: unknown) {
      console.error(
        "[Login] Erro ao iniciar login:",
        error,
      );

      if (error instanceof Error) {
        toast.error(
          error.message ||
            "Não foi possível iniciar o login.",
        );
      } else {
        toast.error(
          "Não foi possível iniciar o login.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-6 sm:py-14">
        {/* Elementos decorativos discretos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[680px] -translate-x-1/2 rounded-full bg-slate-100/70 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-180px] left-[-120px] h-72 w-72 rounded-full bg-slate-100/50 blur-3xl"
        />

        <div className="relative z-10 w-full max-w-[430px]">
          {/* Cabeçalho */}
          <div className="mb-8 text-center sm:mb-10">
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="group mx-auto mb-7 flex items-center justify-center rounded-2xl p-2 transition-transform duration-200 hover:scale-[1.03]"
            >
              <HomstegLogo size={56} />
            </button>

            <div className="space-y-2">
              <h1 className="text-[30px] font-black tracking-[-0.04em] text-black sm:text-[34px]">
                Entrar na tua conta
              </h1>

              <p className="mx-auto max-w-sm text-[14px] leading-6 text-slate-500">
                Entra para gerir a tua loja HOMSTEG.
              </p>
            </div>
          </div>

          {/* Card principal */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            {/* Barra superior */}
            <div className="h-1.5 w-full bg-black" />

            <div className="p-6 sm:p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-[13px] font-bold text-slate-900"
                  >
                    Email
                  </label>

                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-black" />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="exemplo@email.com"
                      className="h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-12 pr-4 text-[14px] text-black outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2.5 block text-[13px] font-bold text-slate-900"
                  >
                    Palavra-passe
                  </label>

                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-black" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="A tua palavra-passe"
                      className="h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-12 pr-14 text-[14px] text-black outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.04]"
                      disabled={isLoading}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value,
                        )
                      }
                      className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-100 hover:text-black"
                      aria-label={
                        showPassword
                          ? "Ocultar palavra-passe"
                          : "Mostrar palavra-passe"
                      }
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Recuperação */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-[13px] font-semibold text-slate-500 transition-colors hover:text-black"
                    onClick={() =>
                      setLocation(
                        "/recuperar-palavra-passe",
                      )
                    }
                    disabled={isLoading}
                  >
                    Esqueceste a palavra-passe?
                  </button>
                </div>

                {/* Entrar */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 text-[14px] font-bold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-black/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      A verificar...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Login social */}
              <div className="mt-6">
                <SocialAuthButtons />
              </div>

              {/* Separador */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  ou
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Criar conta */}
              <div className="text-center">
                <p className="text-[13px] text-slate-500">
                  Ainda não tens uma conta?
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setLocation("/criar-conta")
                  }
                  className="mt-3 flex h-[52px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-[14px] font-bold text-black transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                  disabled={isLoading}
                >
                  Criar conta
                </button>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="mx-auto mt-6 flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors hover:text-black"
          >
            <span>←</span>
            <span>Voltar para a HOMSTEG</span>
          </button>
        </div>
      </div>
    </div>
  );
}