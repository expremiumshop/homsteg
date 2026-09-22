import { FormEvent, useState } from "react";

import { useLocation } from "wouter";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
} from "lucide-react";

import { toast } from "sonner";

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

      // A sessão Better Auth acabou de ser criada. Descarta qualquer resposta
      // anterior (por exemplo, uma consulta sem sessão) antes de procurar a
      // loja já associada a este utilizador.
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
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="mb-8 text-center">
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="mx-auto mb-8 flex items-center justify-center gap-2"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                <Store className="h-6 w-6" />
              </div>

              <span className="text-2xl font-black tracking-tight">
                HOMSTEG
                <span className="text-lime-400">.</span>
              </span>
            </button>

            <h1 className="text-3xl font-black tracking-tight">
              Entrar na tua conta
            </h1>

            <p className="mt-3 text-sm text-white/60">
              Entra para gerir a tua loja HOMSTEG.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white p-6 text-black shadow-2xl sm:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="exemplo@email.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-black focus:bg-white"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Palavra-passe
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm outline-none transition focus:border-black focus:bg-white"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-black"
                    aria-label={
                      showPassword
                        ? "Ocultar palavra-passe"
                        : "Mostrar palavra-passe"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* RECUPERAÇÃO */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-semibold text-slate-600 transition hover:text-black"
                  onClick={() =>
                    toast.info(
                      "A recuperação da palavra-passe será adicionada nesta área.",
                    )
                  }
                  disabled={isLoading}
                >
                  Esqueceste a palavra-passe?
                </button>
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    A verificar...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {/* SEPARADOR */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs text-slate-400">
                ou
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* CRIAR CONTA */}
            <p className="text-center text-sm text-slate-500">
              Ainda não tens uma conta?
            </p>

            <button
              type="button"
              onClick={() =>
                setLocation("/criar-conta")
              }
              className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white text-sm font-bold text-black transition hover:bg-slate-50"
              disabled={isLoading}
            >
              Criar conta
            </button>
          </div>

          {/* RODAPÉ */}
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="mx-auto mt-6 block text-sm text-white/50 transition hover:text-white"
          >
            Voltar para a HOMSTEG
          </button>
        </div>
      </div>
    </div>
  );
}
