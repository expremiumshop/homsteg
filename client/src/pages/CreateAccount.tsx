import {
  FormEvent,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useLocation,
} from "wouter";

import {
  authClient,
} from "@/lib/auth-client";

export default function CreateAccount() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const isSubmittingRef = useRef(false);

  function getErrorMessage(error: unknown): string {
    if (
      error &&
      typeof error === "object" &&
      "error" in error
    ) {
      const responseError = (
        error as {
          error?: {
            message?: string;
            status?: number;
            statusText?: string;
          };
        }
      ).error;

      if (responseError?.message) {
        return responseError.message;
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }

    return "Ocorreu um erro. Tenta novamente.";
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmittingRef.current || isLoading) {
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Introduz o teu email.");
      return;
    }

    if (!password) {
      toast.error("Introduz uma palavra-passe.");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "A palavra-passe deve ter pelo menos 8 caracteres.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "As palavras-passe não coincidem.",
      );
      return;
    }

    if (!acceptedTerms) {
      toast.error(
        "Aceita os termos e condições para continuar.",
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      /*
       * O Better Auth exige um nome no cadastro padrão.
       * Como o HOMSTEG não pede nome ao utilizador,
       * usamos temporariamente a parte anterior ao @.
       */
      const generatedName =
        cleanEmail.split("@")[0] || "Utilizador";

      const result = await authClient.signUp.email({
        email: cleanEmail,
        password,
        name: generatedName,
      });

      if (result.error) {
        console.error(
          "[CreateAccount] Better Auth error:",
          result.error,
        );

        if (
          result.error.code === "USER_ALREADY_EXISTS" ||
          result.error.status === 422
        ) {
          toast.error(
            "Este email já está registado. Entra na tua conta.",
          );
        } else {
          toast.error(
            result.error.message ||
              "Não foi possível criar a conta.",
          );
        }

        return;
      }

      sessionStorage.removeItem(
        "homsteg_business_types",
      );

      sessionStorage.removeItem(
        "homsteg_store_data",
      );

      toast.success(
        "Conta criada com sucesso!",
      );

      window.location.assign(
        "/criar-loja/negocio",
      );
    } catch (error: unknown) {
      console.error(
        "[CreateAccount] Unexpected error:",
        error,
      );

      toast.error(
        getErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
          <div className="max-w-lg">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
                <Store className="h-6 w-6" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                HOMSTEG
              </span>
            </div>

            <h2 className="text-5xl font-bold leading-tight tracking-tight">
              Cria a tua loja
              <br />
              online hoje.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-white/50">
              Cria a tua conta e começa a
              configurar a tua loja no
              HOMSTEG.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-[520px]">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                  <Store className="h-5 w-5" />
                </div>

                <span className="text-xl font-bold tracking-tight">
                  HOMSTEG
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Cria a tua conta
              </h1>

              <p className="mt-2 text-sm text-white/50">
                Cria a tua conta com email
                e palavra-passe.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="teu@email.com"
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/25 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Palavra-passe
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Mínimo de 8 caracteres"
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? "Ocultar palavra-passe"
                        : "Mostrar palavra-passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-white/35">
                  A palavra-passe deve ter
                  pelo menos 8 caracteres.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirmar palavra-passe
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    placeholder="Repete a palavra-passe"
                    required
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white disabled:cursor-not-allowed"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(
                      event.target.checked,
                    )
                  }
                  disabled={isLoading}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-white"
                />

                <span className="text-sm leading-6 text-white/50">
                  Aceito os termos e condições
                  e a política de privacidade do
                  HOMSTEG.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading
                  ? "A criar conta..."
                  : "Criar conta"}

                {!isLoading && (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/40">
                Já tens uma conta?{" "}
                <button
                  type="button"
                  onClick={() =>
                    setLocation("/login")
                  }
                  className="font-medium text-white transition hover:text-white/70"
                >
                  Entrar
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
