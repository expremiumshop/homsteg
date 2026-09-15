import {
  FormEvent,
  useRef,
  useState,
} from "react";

import {
  useAuth,
} from "@clerk/react";

import {
  useSignUp,
} from "@clerk/react/legacy";

import {
  useLocation,
} from "wouter";

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
  trpc,
} from "@/lib/trpc";

export default function CreateAccount() {
  const [, setLocation] = useLocation();

  const utils = trpc.useUtils();

  const {
    isLoaded: isAuthLoaded,
    isSignedIn,
    signOut,
  } = useAuth();

  const {
    isLoaded: isSignUpLoaded,
    signUp,
    setActive,
  } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    needsVerification,
    setNeedsVerification,
  ] = useState(false);

  const [
    verificationCode,
    setVerificationCode,
  ] = useState("");

  const isSubmittingRef =
    useRef(false);

  const authenticationReady =
    isAuthLoaded && isSignUpLoaded;

  function getClerkErrorMessage(
    error: unknown,
  ): string {
    if (
      error &&
      typeof error === "object" &&
      "errors" in error
    ) {
      const errors = (
        error as {
          errors?: Array<{
            longMessage?: string;
            message?: string;
          }>;
        }
      ).errors;

      if (
        Array.isArray(errors) &&
        errors.length > 0
      ) {
        return (
          errors[0]?.longMessage ??
          errors[0]?.message ??
          "Ocorreu um erro. Tenta novamente."
        );
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (
        error as { message?: unknown }
      ).message === "string"
    ) {
      return (
        error as { message: string }
      ).message;
    }

    return "Ocorreu um erro. Tenta novamente.";
  }

  async function syncUserWithNeon() {
    try {
      const user =
        await utils.auth.me.fetch();

      if (!user) {
        throw new Error(
          "USER_SYNC_FAILED",
        );
      }

      return true;
    } catch {
      return false;
    }
  }

  async function finishAccountCreation(
    sessionId: string | null,
  ) {
    if (!sessionId) {
      toast.error(
        "A conta foi criada, mas a sessão não foi iniciada.",
      );
      return;
    }

    if (!setActive) {
      toast.error(
        "A conta foi criada, mas a sessão não foi iniciada.",
      );
      return;
    }

    try {
      await setActive({
        session: sessionId,
      });
    } catch (error) {
      toast.error(
        getClerkErrorMessage(error),
      );
      return;
    }

    const synced =
      await syncUserWithNeon();

    if (!synced) {
      toast.error(
        "A conta foi criada, mas não foi possível sincronizá-la com a plataforma.",
      );
      return;
    }

    sessionStorage.removeItem(
      "homsteg_business_types",
    );

    sessionStorage.removeItem(
      "homsteg_store_data",
    );

    setNeedsVerification(false);
    setVerificationCode("");

    toast.success(
      "Conta criada com sucesso!",
    );

    window.location.assign(
      "/criar-loja/negocio",
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      isSubmittingRef.current ||
      isLoading
    ) {
      return;
    }

    if (
      !isAuthLoaded ||
      !isSignUpLoaded
    ) {
      toast.error(
        "O sistema de autenticação ainda está a carregar.",
      );
      return;
    }

    if (!signUp) {
      toast.error(
        "O sistema de cadastro não está disponível.",
      );
      return;
    }

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error(
        "Introduz o teu email.",
      );
      return;
    }

    if (!password) {
      toast.error(
        "Introduz uma palavra-passe.",
      );
      return;
    }

    if (password.length < 8) {
      toast.error(
        "A palavra-passe deve ter pelo menos 8 caracteres.",
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
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
      if (isSignedIn && signOut) {
        await signOut();
      }

      const result =
        await signUp.create({
          emailAddress: cleanEmail,
          password,
        });

      if (
        result.status === "complete"
      ) {
        await finishAccountCreation(
          result.createdSessionId,
        );
        return;
      }

      if (
        Array.isArray(
          result.missingFields,
        ) &&
        result.missingFields.includes(
          "legal_accepted",
        )
      ) {
        const updatedResult =
          await signUp.update({
            legalAccepted: true,
          });

        if (
          updatedResult.status ===
          "complete"
        ) {
          await finishAccountCreation(
            updatedResult.createdSessionId,
          );
          return;
        }
      }

      const emailNeedsVerification =
        result.unverifiedFields?.includes(
          "email_address",
        );

      if (
        emailNeedsVerification ||
        result.status ===
          "missing_requirements"
      ) {
        try {
          await signUp.prepareEmailAddressVerification(
            {
              strategy: "email_code",
            },
          );

          setNeedsVerification(
            true,
          );

          toast.success(
            "Enviámos um código de verificação para o teu email.",
          );

          return;
        } catch (error) {
          toast.error(
            getClerkErrorMessage(
              error,
            ),
          );
          return;
        }
      }

      toast.error(
        "Não foi possível concluir o registo.",
      );
    } catch (error: unknown) {
      const clerkError =
        error &&
        typeof error === "object" &&
        "errors" in error
          ? (
              error as {
                errors?: Array<{
                  code?: string;
                  longMessage?: string;
                  message?: string;
                }>;
              }
            ).errors?.[0]
          : undefined;

      if (
        clerkError?.code ===
        "verification_already_verified"
      ) {
        try {
          if (
            signUp.status ===
            "complete"
          ) {
            await finishAccountCreation(
              signUp.createdSessionId,
            );
            return;
          }
        } catch (
          innerError
        ) {
          toast.error(
            getClerkErrorMessage(
              innerError,
            ),
          );
        }

        return;
      }

      toast.error(
        getClerkErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  }

  async function handleVerification(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      isLoading ||
      !isSignUpLoaded ||
      !signUp
    ) {
      return;
    }

    const code =
      verificationCode.trim();

    if (!code) {
      toast.error(
        "Introduz o código de verificação.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const result =
        await signUp.attemptEmailAddressVerification(
          {
            code,
          },
        );

      if (
        result.status === "complete"
      ) {
        await finishAccountCreation(
          result.createdSessionId,
        );
        return;
      }

      if (
        Array.isArray(
          result.missingFields,
        ) &&
        result.missingFields.includes(
          "legal_accepted",
        )
      ) {
        const updatedResult =
          await signUp.update({
            legalAccepted: true,
          });

        if (
          updatedResult.status ===
          "complete"
        ) {
          await finishAccountCreation(
            updatedResult.createdSessionId,
          );
          return;
        }
      }

      toast.error(
        "Ainda faltam informações para concluir o registo.",
      );
    } catch (error: unknown) {
      const clerkError =
        error &&
        typeof error === "object" &&
        "errors" in error
          ? (
              error as {
                errors?: Array<{
                  code?: string;
                  longMessage?: string;
                  message?: string;
                }>;
              }
            ).errors?.[0]
          : undefined;

      if (
        clerkError?.code ===
        "verification_already_verified"
      ) {
        try {
          if (
            signUp.status ===
            "complete"
          ) {
            await finishAccountCreation(
              signUp.createdSessionId,
            );
            return;
          }
        } catch (
          innerError
        ) {
          toast.error(
            getClerkErrorMessage(
              innerError,
            ),
          );
          return;
        }

        toast.error(
          "O email já foi verificado, mas a conta ainda não foi concluída.",
        );

        return;
      }

      toast.error(
        getClerkErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!authenticationReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="text-sm text-white/70">
            A carregar o sistema de autenticação...
          </p>
        </div>
      </div>
    );
  }

  if (needsVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 py-10 text-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black">
              <Mail className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-bold">
              Verifica o teu email
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Enviámos um código de
              verificação para{" "}
              <span className="font-medium text-white">
                {email}
              </span>
              .
            </p>
          </div>

          <form
            onSubmit={
              handleVerification
            }
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl"
          >
            <label className="mb-2 block text-sm font-medium">
              Código de verificação
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={verificationCode}
              onChange={(event) =>
                setVerificationCode(
                  event.target.value,
                )
              }
              placeholder="000000"
              maxLength={8}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-xl tracking-[0.4em] text-white outline-none transition focus:border-white/30"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "A verificar..."
                : "Verificar email"}

              {!isLoading && (
                <ArrowRight className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setNeedsVerification(
                  false,
                );
                setVerificationCode("");
              }}
              className="mt-4 w-full text-sm text-white/50 transition hover:text-white"
            >
              Voltar
            </button>
          </form>
        </div>
      </div>
    );
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
                Cria a tua conta com
                email e palavra-passe.
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
                      setEmail(
                        event.target.value,
                      )
                    }
                    placeholder="teu@email.com"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
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
                      setPassword(
                        event.target.value,
                      )
                    }
                    placeholder="Mínimo de 8 caracteres"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white"
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
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-white"
                />

                <span className="text-sm leading-6 text-white/50">
                  Aceito os termos e
                  condições e a política
                  de privacidade do
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