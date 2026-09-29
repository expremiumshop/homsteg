/**
 * Diagnóstico read-only da configuração Resend.
 * NUNCA imprime a API key — apenas metadados.
 */
import "dotenv/config";

function maskKey(key) {
  if (!key) return null;
  return `${key.slice(0, 6)}…${key.slice(-4)} (len=${key.length})`;
}

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

console.log(
  "RESEND_API_KEY set:",
  Boolean(apiKey),
  maskKey(apiKey) ?? "(missing)",
);
console.log("RESEND_FROM_EMAIL:", fromEmail ?? "(não definida — fallback onboarding@resend.dev)");

if (!apiKey) {
  console.error("Sem RESEND_API_KEY — nada a diagnosticar.");
  process.exit(1);
}

const authHeader = { Authorization: `Bearer ${apiKey}` };

// 1. Domínios verificados na conta Resend.
try {
  const res = await fetch("https://api.resend.com/domains", {
    headers: authHeader,
  });

  const body = await res.json().catch(() => null);

  console.log("\n=== DOMÍNIOS RESEND ===");
  console.log("HTTP status:", res.status);

  if (Array.isArray(body?.data) && body.data.length > 0) {
    for (const domain of body.data) {
      console.log(
        `- ${domain.name} | status=${domain.status} | verified=${Boolean(domain.verified_at ?? domain.status === "verified")}`,
      );
    }
  } else {
    console.log("Nenhum domínio verificado nesta conta Resend.");
    console.log("Payload:", JSON.stringify(body));
  }
} catch (error) {
  console.error("Falha ao consultar /domains:", error.message);
}

// 2. Chave válida? (listar API keys exige permissão; falha esperada em keys só-de-envio)
try {
  const res = await fetch("https://api.resend.com/api-keys", {
    headers: authHeader,
  });

  const body = await res.json().catch(() => null);

  console.log("\n=== VALIDAÇÃO DA API KEY (/api-keys) ===");
  console.log("HTTP status:", res.status);

  if (res.status === 401 || res.status === 403) {
    console.log("Chave recusada pela API → RESEND_API_KEY inválida/revogada OU sem permissão de leitura.");
    console.log("Payload:", JSON.stringify(body));
  } else {
    console.log("Chave aceite pela API (autenticação OK).");
  }
} catch (error) {
  console.error("Falha ao validar a chave:", error.message);
}

console.log("\nFim do diagnóstico (nenhuma alteração foi feita).");
