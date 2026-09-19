import { FormEvent, useState } from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Store,
} from "lucide-react";

import { useLocation } from "wouter";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Introduza o seu e-mail.");
      return;
    }

    if (!password) {
      setError(
        "Introduza a sua palavra-passe.",
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await authClient.signIn.email({
          email: normalizedEmail,
          password,
          rememberMe: true,
        });

      if (result.error) {
        console.error(
          "[AdminLogin] Better Auth error:",
          result.error,
        );

        setError(
          result.error.message ||
            "E-mail ou palavra-passe incorretos.",
        );

        return;
      }

      /*
       * O login Better Auth foi concluído.
       *
       * Agora verificamos o utilizador de negócio
       * do HOMSTEG e a sua role real no Neon.
       */
      const user =
        await utils.auth.me.fetch();

      if (!user) {
        await authClient.signOut();

        setError(
          "A sessão foi criada, mas o utilizador HOMSTEG não foi encontrado.",
        );

        return;
      }

      /*
       * O acesso ao painel depende exclusivamente
       * da role armazenada em users.role.
       */
      if (user.role !== "admin") {
        await authClient.signOut();

        utils.auth.me.setData(
          undefined,
          null,
        );

        setError(
          "Esta conta não possui permissões de administrador.",
        );

        return;
      }

      navigate("/admin");
    } catch (err: unknown) {
      console.error(
        "[AdminLogin] Erro inesperado:",
        err,
      );

      try {
        await authClient.signOut();
      } catch {
        // Ignora erro secundário de logout.
      }

      if (err instanceof Error) {
        setError(
          err.message ||
            "Não foi possível iniciar sessão.",
        );
      } else {
        setError(
          "Não foi possível iniciar sessão.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f6ef] px-4 py-10 text-[#173b2a]">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173b2a] shadow-sm">
            <Store className="h-5 w-5 text-lime-300" />
          </div>

          <div className="text-left">
            <div className="text-xl font-bold tracking-tight">
              HOMSTEG.
            </div>

            <div className="text-xs font-medium uppercase tracking-[0.16em] text-[#6b756e]">
              Platform admin
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-[0_18px_60px_rgba(23,59,42,0.10)] sm:p-9">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#173b2a]">
              Entrar no Admin
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#707871]">
              Acede à área de administração do HOMSTEG.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="text-sm font-semibold text-red-700">
                Erro no login
              </div>

              <div className="mt-1 break-words text-xs leading-5 text-red-600">
                {error}
              </div>
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-[#173b2a]"
              >
                E-mail
              </label>

              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder="admin@exemplo.com"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-[#dfe5df] bg-white px-4 text-sm text-[#173b2a] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#173b2a] focus:ring-4 focus:ring-[#173b2a]/10 disabled:cursor-not-allowed disabled:bg-[#f5f6f3]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-[#173b2a]"
              >
                Palavra-passe
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Introduza a sua palavra-passe"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-[#dfe5df] bg-white px-4 pr-12 text-sm text-[#173b2a] outline-none transition placeholder:text-[#a1aaa4] focus:border-[#173b2a] focus:ring-4 focus:ring-[#173b2a]/10 disabled:cursor-not-allowed disabled:bg-[#f5f6f3]"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Ocultar palavra-passe"
                      : "Mostrar palavra-passe"
                  }
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  disabled={loading}
                  className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#68746d] transition hover:text-[#173b2a] disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-[#173b2a] px-5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#214d37] hover:shadow-lg hover:shadow-[#173b2a]/15 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span
                className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent ${
                  loading
                    ? "animate-[shimmer_1.4s_infinite]"
                    : ""
                }`}
              />

              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    A entrar...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    Entrar
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        <div className="mt-5 text-center text-xs text-[#8a938d]">
          HOMSTEG · Platform administration
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}