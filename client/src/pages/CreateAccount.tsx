import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
} from "lucide-react";

import { toast } from "sonner";

import { useLocation } from "wouter";

import { authClient } from "@/lib/auth-client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type CreateAccountStep = "credentials" | "otp";

const OTP_COOLDOWN_SECONDS = 60;

function isOtpError(
  error:
    | { code?: string; message?: string }
    | null
    | undefined,
  token:
    | "OTP_EXPIRED"
    | "INVALID_OTP"
    | "TOO_MANY_ATTEMPTS",
) {
  if (!error) {
    return false;
  }

  return (
    error.code === token ||
    error.message === token ||
    (error.message?.includes(token) ?? false)
  );
}

function getOtpErrorMessage(
  error:
    | { code?: string; message?: string }
    | null
    | undefined,
) {
  if (isOtpError(error, "OTP_EXPIRED")) {
    return "O código expirou. Solicita um novo código.";
  }

  if (isOtpError(error, "TOO_MANY_ATTEMPTS")) {
    return "Demasiadas tentativas. Solicita um novo código.";
  }

  if (isOtpError(error, "INVALID_OTP")) {
    return "Código inválido. Verifica o código e tenta novamente.";
  }

  return (
    error?.message ||
    "Não foi possível validar o código. Tenta novamente."
  );
}

export default function CreateAccount() {
  const [, setLocation] = useLocation();

  const [step, setStep] =
    useState<CreateAccountStep>("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] =
    useState<string | null>(null);

  const [isSendingOtp, setIsSendingOtp] =
    useState(false);

  const [isVerifyingOtp, setIsVerifyingOtp] =
    useState(false);

  const [resendIn, setResendIn] = useState(0);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (resendIn <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendIn((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendIn]);

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
      typeof (error as { message?: unknown }).message ===
        "string"
    ) {
      return (error as { message: string }).message;
    }

    return "Ocorreu um erro. Tenta novamente.";
  }

  async function sendOtp(targetEmail: string) {
    setIsSendingOtp(true);

    try {
      const result =
        await authClient.emailOtp.sendVerificationOtp({
          email: targetEmail,
          type: "email-verification",
        });

      if (result.error) {
        console.error(
          "[CreateAccount] Erro ao enviar OTP:",
          result.error,
        );

        if (result.error.status === 429) {
          toast.error(
            "Aguarda um momento antes de pedir outro código.",
          );
        } else {
          toast.error(
            result.error.message ||
              "Não foi possível enviar o código. Tenta novamente.",
          );
        }

        return false;
      }

      setOtpEmail(targetEmail);
      setOtp("");
      setOtpError(null);
      setResendIn(OTP_COOLDOWN_SECONDS);
      setStep("otp");

      toast.success(
        "Enviamos um código para o teu email.",
      );

      return true;
    } catch (error: unknown) {
      console.error(
        "[CreateAccount] Erro inesperado ao enviar OTP:",
        error,
      );

      toast.error(getErrorMessage(error));

      return false;
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    if (isVerifyingOtp || isSendingOtp) {
      return;
    }

    if (otp.length !== 6) {
      setOtpError("Introduz o código de 6 dígitos.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const result =
        await authClient.emailOtp.verifyEmail({
          email: otpEmail,
          otp,
        });

      if (result.error) {
        console.error(
          "[CreateAccount] Erro ao verificar OTP:",
          result.error,
        );

        setOtpError(
          getOtpErrorMessage(result.error),
        );

        setOtp("");

        return;
      }

      sessionStorage.removeItem(
        "homsteg_business_types",
      );

      sessionStorage.removeItem(
        "homsteg_store_data",
      );

      toast.success(
        "Email verificado com sucesso!",
      );

      window.location.assign(
        "/criar-loja/negocio",
      );
    } catch (error: unknown) {
      console.error(
        "[CreateAccount] Erro inesperado ao verificar OTP:",
        error,
      );

      setOtpError(getErrorMessage(error));
      setOtp("");
    } finally {
      setIsVerifyingOtp(false);
    }
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
      const generatedName =
        cleanEmail.split("@")[0] ||
        "Utilizador";

      const result =
        await authClient.signUp.email({
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
          result.error.code ===
            "USER_ALREADY_EXISTS" ||
          result.error.status === 422
        ) {
          const session =
            await authClient.getSession();

          const sessionEmail =
            session.data?.user?.email
              ?.toLowerCase()
              .trim();

          if (sessionEmail === cleanEmail) {
            const sent =
              await sendOtp(cleanEmail);

            if (!sent) {
              toast.error(
                "Não foi possível enviar o código de verificação.",
              );
            }

            return;
          }

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

      const sent = await sendOtp(cleanEmail);

      if (!sent) {
        toast.error(
          "A conta foi criada, mas não foi possível enviar o código. Tenta novamente.",
        );
      }
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

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl">
          <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
            <div className="max-w-lg">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                  <Store className="h-6 w-6" />
                </div>

                <span className="text-2xl font-bold tracking-tight text-black">
                  HOMSTEG
                </span>
              </div>

              <h2 className="text-5xl font-bold leading-tight tracking-tight text-black">
                Confirma o teu
                <br />
                email.
              </h2>

              <p className="mt-6 max-w-md text-lg leading-8 text-slate-500">
                Enviámos um código de 6 dígitos
                para o teu email. Introduz o
                código para continuar.
              </p>
            </div>
          </div>

          <div className="flex w-full items-center justify-center px-6 py-10 lg:w-[520px]">
            <div className="w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                    <Store className="h-5 w-5" />
                  </div>

                  <span className="text-xl font-bold tracking-tight text-black">
                    HOMSTEG
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-black">
                  Verifica o teu email
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Enviámos um código para{" "}
                  <span className="font-medium text-black">
                    {otpEmail}
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Código de verificação
                  </label>

                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setOtpError(null);
                    }}
                    disabled={
                      isVerifyingOtp ||
                      isSendingOtp
                    }
                    containerClassName="justify-center"
                    aria-invalid={Boolean(otpError)}
                  >
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map(
                        (_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-13 w-11 rounded-xl border-slate-200 bg-slate-50 text-lg font-semibold text-black data-[active=true]:border-black data-[active=true]:ring-black/10 aria-invalid:border-red-400/60"
                          />
                        ),
                      )}
                    </InputOTPGroup>
                  </InputOTP>

                  {otpError && (
                    <p className="mt-3 text-center text-sm text-red-500">
                      {otpError}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={
                    isVerifyingOtp ||
                    isSendingOtp ||
                    otp.length !== 6
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isVerifyingOtp
                    ? "A verificar..."
                    : "Confirmar código"}

                  {!isVerifyingOtp && (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setOtp("");
                      setOtpError(null);
                    }}
                    className="flex items-center gap-1.5 text-slate-500 transition hover:text-black"
                    disabled={
                      isVerifyingOtp ||
                      isSendingOtp
                    }
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      sendOtp(otpEmail)
                    }
                    disabled={
                      isVerifyingOtp ||
                      isSendingOtp ||
                      resendIn > 0
                    }
                    className="font-medium text-black transition hover:text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    {resendIn > 0
                      ? `Reenviar código (${resendIn}s)`
                      : "Reenviar código"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
          <div className="max-w-lg">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                <Store className="h-6 w-6" />
              </div>

              <span className="text-2xl font-bold tracking-tight text-black">
                HOMSTEG
              </span>
            </div>

            <h2 className="text-5xl font-bold leading-tight tracking-tight text-black">
              Cria a tua loja
              <br />
              online hoje.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-500">
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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                  <Store className="h-5 w-5" />
                </div>

                <span className="text-xl font-bold tracking-tight text-black">
                  HOMSTEG
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Cria a tua conta
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Cria a tua conta com email
                e palavra-passe.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Palavra-passe
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-black disabled:cursor-not-allowed"
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

                <p className="mt-2 text-xs text-slate-400">
                  A palavra-passe deve ter
                  pelo menos 8 caracteres.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Confirmar palavra-passe
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-black disabled:cursor-not-allowed"
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
                  className="mt-1 h-4 w-4 rounded border-slate-300 bg-white accent-black"
                />

                <span className="text-sm leading-6 text-slate-500">
                  Aceito os termos e condições
                  e a política de privacidade do
                  HOMSTEG.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
              <p className="text-sm text-slate-500">
                Já tens uma conta?{" "}
                <button
                  type="button"
                  onClick={() =>
                    setLocation("/login")
                  }
                  className="font-medium text-black transition hover:text-slate-600"
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