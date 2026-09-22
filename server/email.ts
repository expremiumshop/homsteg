import "dotenv/config";

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

const fromEmail =
  process.env.RESEND_FROM_EMAIL ||
  "HOMSTEG <onboarding@resend.dev>";

if (!apiKey) {
  throw new Error(
    "RESEND_API_KEY não está configurada.",
  );
}

const resend = new Resend(apiKey);

export async function sendLoginOtpEmail(
  email: string,
  otp: string,
) {
  console.log(
    "[HOMSTEG EMAIL] ========================================",
  );

  console.log(
    "[HOMSTEG EMAIL] Iniciando envio do OTP",
  );

  console.log(
    "[HOMSTEG EMAIL] FROM:",
    fromEmail,
  );

  console.log(
    "[HOMSTEG EMAIL] TO:",
    email,
  );

  console.log(
    "[HOMSTEG EMAIL] OTP:",
    otp,
  );

  const html = `
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HOMSTEG — Código de acesso</title>
      </head>

      <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">

        <div style="padding:40px 20px;">

          <div
            style="
              max-width:520px;
              margin:0 auto;
              background:#ffffff;
              border-radius:20px;
              padding:40px;
            "
          >

            <div style="text-align:center;margin-bottom:32px;">

              <div
                style="
                  display:inline-flex;
                  align-items:center;
                  justify-content:center;
                  width:48px;
                  height:48px;
                  background:#000000;
                  border-radius:12px;
                  color:#ffffff;
                  font-size:22px;
                  font-weight:800;
                "
              >
                H
              </div>

              <div
                style="
                  margin-top:12px;
                  font-size:24px;
                  font-weight:900;
                  letter-spacing:-1px;
                  color:#111111;
                "
              >
                HOMSTEG<span style="color:#a3e635;">.</span>
              </div>

            </div>

            <h1
              style="
                margin:0 0 12px;
                text-align:center;
                font-size:26px;
                color:#111111;
              "
            >
              Código de acesso
            </h1>

            <p
              style="
                margin:0;
                text-align:center;
                font-size:15px;
                line-height:1.6;
                color:#666666;
              "
            >
              Usa o código abaixo para concluir o acesso à tua conta HOMSTEG.
            </p>

            <div
              style="
                margin:32px 0;
                text-align:center;
              "
            >

              <div
                style="
                  display:inline-block;
                  padding:18px 28px;
                  background:#f4f4f5;
                  border-radius:16px;
                  font-size:36px;
                  font-weight:900;
                  letter-spacing:10px;
                  color:#111111;
                "
              >
                ${otp}
              </div>

            </div>

            <p
              style="
                margin:0;
                text-align:center;
                font-size:14px;
                line-height:1.6;
                color:#777777;
              "
            >
              Este código é válido durante <strong>5 minutos</strong>.
            </p>

            <p
              style="
                margin:24px 0 0;
                text-align:center;
                font-size:13px;
                line-height:1.6;
                color:#999999;
              "
            >
              Se não foste tu a tentar entrar, podes ignorar este email.
            </p>

            <div
              style="
                margin-top:32px;
                padding-top:20px;
                border-top:1px solid #eeeeee;
                text-align:center;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:12px;
                  color:#aaaaaa;
                "
              >
                © HOMSTEG — Plataforma de lojas online
              </p>

            </div>

          </div>

        </div>

      </body>
    </html>
  `;

  const text = `
HOMSTEG — Código de acesso

O teu código de acesso é:

${otp}

Este código é válido durante 5 minutos.

Se não foste tu a tentar entrar, podes ignorar este email.

© HOMSTEG — Plataforma de lojas online
  `.trim();

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [email],

      subject: "HOMSTEG — Código de acesso",

      html,

      text,
    });

    console.log(
      "[HOMSTEG EMAIL] RESPOSTA COMPLETA DO RESEND:",
      result,
    );

    if (result.error) {
      console.error(
        "[HOMSTEG EMAIL] ERRO DEVOLVIDO PELO RESEND:",
        result.error,
      );

      throw new Error(
        result.error.message ||
          "O Resend recusou o envio do email.",
      );
    }

    console.log(
      "[HOMSTEG EMAIL] EMAIL ACEITO:",
      {
        id: result.data?.id,
        to: email,
      },
    );

    console.log(
      "[HOMSTEG EMAIL] ========================================",
    );

    return result.data;
  } catch (error) {
    console.error(
      "[HOMSTEG EMAIL] FALHA REAL NO ENVIO:",
      error,
    );

    console.log(
      "[HOMSTEG EMAIL] ========================================",
    );

    throw error;
  }
}