import {
  FormEvent,
  useEffect,
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

type RecoveryStep =
  | "request"
  | "otp"
  | "reset";

const OTP_COOLDOWN_SECONDS = 60;

function isOtpError(
  error:
    | {
        code?: string;
        message?: string;
      }
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
    | {
        code?: string;
        message?: string;
      }
    | null
    | undefined,
) {
  if (isOtpError(error, "OTP_EXPIRED")) {
    return "O código expirou. Solicita um novo código.";
  }

  if (
    isOtpError(error, "TOO_MANY_ATTEMPTS")
  ) {
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

export default function RecoverPassword() {
  const [, setLocation] = useLocation();

  const [step, setStep] =
    useState<RecoveryStep>("request");

  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [otp, setOtp] = useState("");

  const [otpError, setOtpError] =
    useState<string | null>(null);

  const [isSendingOtp, setIsSendingOtp] =
    useState(false);

  const [resendIn, setResendIn] = useState(0);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendIn((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendIn]);

  /**
   * Envia o OTP de recuperação para o email indicado.
   * O servidor envia o código por email (via Resend).
   */
  async function requestOtp(
    targetEmail: string,
  ) {
    setIsSendingOtp(true);

    try {
      const result =
        await authClient.emailOtp.requestPasswordReset(
          {
            email: targetEmail,
          },
        );

      if (result.error) {
        console.error(
          "[RecoverPassword] Erro ao pedir código:",
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
        "[RecoverPassword] Erro inesperado ao pedir código:",
        error,
      );

      toast.error(getErrorMessage(error));

      return false;
    } finally {
      setIsSendingOtp(false);
    }
  }

  /**
   * Verifica o OTP e, se válido, avança para o passo
   * de redefinição da palavra-passe.
   */
  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      setOtpError(
        "Introduz o código de 6 dígitos.",
      );
      return;
    }

    setIsLoading(true);
    setOtpError(null);

    try {
      const result =
        await authClient.emailOtp.checkVerificationOtp(
          {
            email,
            otp,
            type: "forget-password",
          },
        );

      if (result.error) {
        console.error(
          "[RecoverPassword] Erro ao verificar código:",
          result.error,
        );

        setOtpError(
          getOtpErrorMessage(result.error),
        );

        setOtp("");

        return;
      }

      setStep("reset");
    } catch (error: unknown) {
      console.error(
        "[RecoverPassword] Erro inesperado ao verificar código:",
        error,
      );

      setOtpError(
        getErrorMessage(error),
      );

      setOtp("");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Redefine a palavra-passe usando o OTP validado.
   */
  async function handleResetPassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "A nova palavra-passe deve ter pelo menos 8 caracteres.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "As palavras-passe não coincidem.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const result =
        await authClient.emailOtp.resetPassword({
          email,
          otp,
          password: newPassword,
        });

      if (result.error) {
        console.error(
          "[RecoverPassword] Erro ao redefinir palavra-passe:",
          result.error,
        );

        if (
          isOtpError(
            result.error,
            "OTP_EXPIRED",
          ) ||
          isOtpError(
            result.error,
            "INVALID_OTP",
          ) ||
          isOtpError(
            result.error,
            "TOO_MANY_ATTEMPTS",
          )
        ) {
          setOtp("");
          setStep("otp");
        }

        toast.error(
          getOtpErrorMessage(result.error),
        );

        return;
      }

      toast.success(
        "Palavra-passe redefinida com sucesso! Já podes entrar.",
      );

      setLocation("/login");
    } catch (error: unknown) {
      console.error(
        "[RecoverPassword] Erro inesperado ao redefinir:",
        error,
      );

      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "request") {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <button
                type="button"
                onClick={() => setLocation("/")}
                className="mx-auto mb-8 flex items-center justify-center gap-2"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                  <Store className="h-6 w-6" />
                </div>

                <span className="text-2xl font-black tracking-tight text-black">
                  HOMSTEG
                  <span className="text-lime-500">
                    .
                  </span>
                </span>
              </button>

              <h1 className="text-3xl font-black tracking-tight text-black">
                Recuperar palavra-passe
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Introduz o teu email para receber
                um código de recuperação.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-black shadow-2xl sm:p-8">
              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  const cleanEmail =
                    email.trim().toLowerCase();

                  if (!cleanEmail) {
                    toast.error(
                      "Introduz o teu email.",
                    );
                    return;
                  }

                  void requestOtp(cleanEmail);
                }}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="recovery-email"
                    className="mb-2 block text-sm font-semibold text-slate-900"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="recovery-email"
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
                      disabled={isSendingOtp}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    isLoading || isSendingOtp
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingOtp
                    ? "A enviar código..."
                    : "Enviar código"}

                  {!isSendingOtp && (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() =>
                  setLocation("/login")
                }
                className="mt-5 flex w-full items-center justify-center gap-1.5 text-sm text-slate-500 transition hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-8 flex items-center justify-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                  <Store className="h-6 w-6" />
                </div>

                <span className="text-2xl font-black tracking-tight text-black">
                  HOMSTEG
                  <span className="text-lime-500">
                    .
                  </span>
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-black">
                Introduz o código
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Enviámos um código para{" "}
                <span className="font-medium text-slate-900">
                  {email}
                </span>
                .
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Código de recuperação
                  </label>

                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setOtpError(null);
                    }}
                    disabled={
                      isLoading || isSendingOtp
                    }
                    containerClassName="justify-center"
                    aria-invalid={Boolean(otpError)}
                  >
                    <InputOTPGroup className="gap-2">
                      {Array.from({
                        length: 6,
                      }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-13 w-11 rounded-xl border-slate-200 bg-slate-50 text-lg font-semibold text-black data-[active=true]:border-black data-[active=true]:ring-black/10 aria-invalid:border-red-400"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {otpError && (
                    <p className="mt-3 text-center text-sm text-red-600">
                      {otpError}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={
                    isLoading ||
                    isSendingOtp ||
                    otp.length !== 6
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading
                    ? "A verificar..."
                    : "Confirmar código"}

                  {!isLoading && (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setOtp("");
                      setOtpError(null);
                    }}
                    className="flex items-center gap-1.5 text-slate-500 transition hover:text-black"
                    disabled={
                      isLoading || isSendingOtp
                    }
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      requestOtp(email)
                    }
                    disabled={
                      isLoading ||
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
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-8 flex items-center justify-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                <Store className="h-6 w-6" />
              </div>

              <span className="text-2xl font-black tracking-tight text-black">
                HOMSTEG
                <span className="text-lime-500">
                  .
                </span>
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-black">
              Nova palavra-passe
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Define a tua nova palavra-passe.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-black shadow-2xl sm:p-8">
            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  Nova palavra-passe
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value,
                      )
                    }
                    placeholder="Mínimo de 8 caracteres"
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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

                <p className="mt-2 text-xs text-slate-400">
                  A palavra-passe deve ter pelo
                  menos 8 caracteres.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  Confirmar nova palavra-passe
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="confirm-new-password"
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
                    placeholder="Repete a nova palavra-passe"
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-black"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? "A guardar..."
                  : "Guardar nova palavra-passe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}