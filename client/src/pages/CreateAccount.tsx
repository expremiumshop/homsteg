import { FormEvent, useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

import { toast } from "sonner";

import { useLocation } from "wouter";

import { SocialAuthButtons } from "@/components/SocialAuthButtons";

import HomstegLogo from "@/components/HomstegLogo";

import { authClient } from "@/lib/auth-client";

import { trpc } from "@/lib/trpc";

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

  /*
   * Verdadeiro quando o email submetido já tinha conta
   * (ex.: tentativa anterior sem concluir a verificação).
   *
   * O fluxo passa a enviar o código na mesma, em vez de
   * bloquear com "email já registado".
   */
  const [accountExisted, setAccountExisted] =
    useState(false);

  const isSubmittingRef = useRef(false);

  const restorePasswordMutation =
    trpc.auth.restorePassword.useMutation();

  useEffect(() => {
    if (resendIn <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendIn(
        (current) => current - 1,
      );
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
      return (
        error as { message: string }
      ).message;
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
      setOtpError(
        "Introduz o código de 6 dígitos.",
      );
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

      /*
       * A verificação por OTP (Better Auth 1.7,
       * revokeUnprovenAccountAccess) apaga a credencial de
       * palavra-passe de contas que ainda não estavam
       * verificadas. Repor a palavra-passe escolhida no
       * formulário para o login email+password continuar
       * a funcionar.
       */
      try {
        const restore =
          await restorePasswordMutation.mutateAsync({
            newPassword: password,
          });

        if (restore.alreadyHadPassword) {
          toast.info(
            "Este email já tinha palavra-passe. Usa a tua palavra-passe habitual para entrar.",
          );
        }
      } catch {
        toast.error(
          "A conta foi verificada, mas não foi possível repor a palavra-passe. Usa “Recuperar conta” para definir uma nova.",
        );
      }

      window.location.assign(
        "/criar-loja/negocio",
      );
    } catch (error: unknown) {
      console.error(
        "[CreateAccount] Erro inesperado ao verificar OTP:",
        error,
      );

      setOtpError(
        getErrorMessage(error),
      );

      setOtp("");
    } finally {
      setIsVerifyingOtp(false);
    }
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

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Introduz o teu email.");
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

        const errorCode =
          result.error.code ?? "";

        const errorMessage =
          result.error.message ?? "";

        const isUserAlreadyExists =
          errorCode.includes(
            "USER_ALREADY_EXISTS",
          ) ||
          errorMessage
            .toLowerCase()
            .includes("already exists");

        if (isUserAlreadyExists) {
          /*
           * O email já tem conta (ex.: tentativa
           * anterior sem concluir a verificação).
           *
           * Em vez de bloquear, envia o código de
           * verificação — quem controla a caixa de
           * email consegue confirmar e continuar.
           */
          setAccountExisted(true);

          const sent =
            await sendOtp(cleanEmail);

          if (!sent) {
            toast.error(
              "Este email já está registado. Entra na tua conta ou tenta pedir o código novamente.",
            );
          }

          return;
        }

        toast.error(
          result.error.message ||
            "Não foi possível criar a conta.",
        );

        return;
      }

      setAccountExisted(false);

      const sent =
        await sendOtp(cleanEmail);

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

  /*
   * =====================================================
   * OTP
   * =====================================================
   */

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl overflow-hidden">
          {/* Decoração */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/4 top-[-180px] h-[420px] w-[420px] rounded-full bg-slate-100/80 blur-3xl"
          />

          {/* Painel esquerdo */}
          <div className="relative hidden flex-1 items-center px-12 lg:flex xl:px-20">
            <div className="relative z-10 max-w-lg">
              <div className="mb-10">
                <HomstegLogo size={58} />
              </div>

              <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
                Verificação segura
              </div>

              <h2 className="text-5xl font-black leading-[1.02] tracking-[-0.05em] text-black xl:text-6xl">
                Confirma
                <br />
                o teu email.
              </h2>

              <p className="mt-7 max-w-md text-[17px] leading-8 text-slate-500">
                Enviámos um código de 6 dígitos
                para o teu email. Introduz o código
                para continuar a criar a tua loja.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="relative z-10 flex w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[540px]">
            <div className="w-full max-w-md">
              {/* Logo mobile */}
              <div className="mb-8 lg:hidden">
                <HomstegLogo size={48} />
              </div>

              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                <div className="h-1.5 w-full bg-black" />

                <div className="p-6 sm:p-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-[-0.04em] text-black">
                      Verifica o teu email
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Enviámos um código para{" "}
                      <span className="font-bold text-black">
                        {otpEmail}
                      </span>
                      .
                    </p>

                    {accountExisted && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm leading-6 text-slate-600">
                          Este email já tem uma
                          conta HOMSTEG. Confirma o
                          código para continuar.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block text-[13px] font-bold text-slate-900">
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
                        aria-invalid={Boolean(
                          otpError,
                        )}
                      >
                        <InputOTPGroup className="gap-2">
                          {Array.from({
                            length: 6,
                          }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-14 w-11 rounded-2xl border-slate-200 bg-slate-50 text-lg font-bold text-black transition-all data-[active=true]:border-black data-[active=true]:bg-white data-[active=true]:ring-4 data-[active=true]:ring-black/[0.04] aria-invalid:border-red-400/60 sm:h-15 sm:w-12"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>

                      {otpError && (
                        <p className="mt-3 text-center text-sm font-medium text-red-500">
                          {otpError}
                        </p>
                      )}

                      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                        Não recebeste? Verifica a
                        caixa de spam ou as promoções.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={
                        isVerifyingOtp ||
                        isSendingOtp ||
                        otp.length !== 6
                      }
                      className="group flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isVerifyingOtp
                        ? "A verificar..."
                        : "Confirmar código"}

                      {!isVerifyingOtp && (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
                        className="flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-black"
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
                        className="font-bold text-black transition hover:text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        {resendIn > 0
                          ? `Reenviar código (${resendIn}s)`
                          : "Reenviar código"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLocation("/")}
                className="mx-auto mt-6 flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition hover:text-black"
              >
                <span>←</span>
                <span>Voltar para a HOMSTEG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * CRIAR CONTA
   * =====================================================
   */

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl overflow-hidden">
        {/* Decoração discreta */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/4 top-[-180px] h-[420px] w-[420px] rounded-full bg-slate-100/80 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-220px] right-[-100px] h-[360px] w-[360px] rounded-full bg-slate-100/60 blur-3xl"
        />

        {/* Painel esquerdo */}
        <div className="relative hidden flex-1 items-center px-12 lg:flex xl:px-20">
          <div className="relative z-10 max-w-lg">
            <div className="mb-10">
              <HomstegLogo size={58} />
            </div>

            <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
              Começa gratuitamente
            </div>

            <h2 className="text-5xl font-black leading-[1.02] tracking-[-0.05em] text-black xl:text-6xl">
              Cria a tua
              <br />
              loja online.
            </h2>

            <p className="mt-7 max-w-md text-[17px] leading-8 text-slate-500">
              Cria a tua conta e começa a
              configurar a tua loja no HOMSTEG.
              Sem mensalidade e sem complicação.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm">
                100% grátis
              </div>

              <div className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm">
                Sem mensalidade
              </div>

              <div className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm">
                Sem cartão
              </div>
            </div>
          </div>
        </div>

        {/* Área do formulário */}
        <div className="relative z-10 flex w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[540px]">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="mb-8 lg:hidden">
              <HomstegLogo size={48} />
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
              <div className="h-1.5 w-full bg-black" />

              <div className="p-6 sm:p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-black tracking-[-0.04em] text-black">
                    Cria a tua conta
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Cria a tua conta com email e
                    palavra-passe.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label className="mb-2.5 block text-[13px] font-bold text-slate-900">
                      Email
                    </label>

                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-black" />

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
                        disabled={isLoading}
                        className="h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-12 pr-4 text-[14px] text-black outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2.5 block text-[13px] font-bold text-slate-900">
                      Palavra-passe
                    </label>

                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-black" />

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
                        disabled={isLoading}
                        className="h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-12 pr-14 text-[14px] text-black outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current,
                          )
                        }
                        disabled={isLoading}
                        className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed"
                        aria-label={
                          showPassword
                            ? "Ocultar palavra-passe"
                            : "Mostrar palavra-passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-[18px] w-[18px]" />
                        ) : (
                          <Eye className="h-[18px] w-[18px]" />
                        )}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      A palavra-passe deve ter pelo
                      menos 8 caracteres.
                    </p>
                  </div>

                  {/* Confirmar password */}
                  <div>
                    <label className="mb-2.5 block text-[13px] font-bold text-slate-900">
                      Confirmar palavra-passe
                    </label>

                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-black" />

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
                        className="h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-12 pr-14 text-[14px] text-black outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current,
                          )
                        }
                        disabled={isLoading}
                        className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-black disabled:cursor-not-allowed"
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar confirmação"
                            : "Mostrar confirmação"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-[18px] w-[18px]" />
                        ) : (
                          <Eye className="h-[18px] w-[18px]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Termos */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-transparent p-1">
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

                    <span className="text-[13px] leading-6 text-slate-500">
                      Aceito os termos e condições e
                      a política de privacidade do
                      HOMSTEG.
                    </span>
                  </label>

                  {/* Criar conta */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 text-[14px] font-bold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-black/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading
                      ? "A criar conta..."
                      : "Criar conta"}

                    {!isLoading && (
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    )}
                  </button>
                </form>

                {/* Login social */}
                <div className="mt-6">
                  <SocialAuthButtons />
                </div>

                {/* Login */}
                <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                  <p className="text-[13px] text-slate-500">
                    Já tens uma conta?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setLocation("/login")
                      }
                      className="font-bold text-black transition hover:text-slate-600"
                    >
                      Entrar
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLocation("/")}
              className="mx-auto mt-6 flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition hover:text-black"
            >
              <span>←</span>
              <span>Voltar para a HOMSTEG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}