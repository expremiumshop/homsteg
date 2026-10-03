/*
 * Diagnóstico read-only do Resend: lista os emails mais
 * recentes enviados pela conta, com o evento final
 * (delivered / bounced / etc.).
 */

import "dotenv/config";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("RESEND_API_KEY não está configurada.");
  process.exit(1);
}

const res = await fetch(
  "https://api.resend.com/emails?limit=20",
  {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  },
);

if (!res.ok) {
  console.error(
    "Resend respondeu",
    res.status,
    await res.text().catch(() => ""),
  );
  process.exit(1);
}

const data = await res.json();

const emails = data?.data ?? [];

console.log(
  `Emails recentes na conta Resend (${emails.length}):`,
);

for (const email of emails) {
  console.log(
    `  - [${email.last_event ?? "?"}] ${email.created_at} | to=${Array.isArray(email.to) ? email.to.join(", ") : email.to} | from=${email.from} | "${email.subject}"`,
  );
}

if (emails.length === 0) {
  console.log("  (nenhum email devolvido pela API)");
}
