/*
 * Intenção de criação de loja.
 *
 * Quando o utilizador entra em "Criar loja", o percurso de conta
 * não pede código de verificação por email. O registo normal
 * (/login -> "Criar conta") continua a exigir OTP.
 *
 * A intenção vive apenas na sessão do browser e é limpa assim que
 * é usada, para nunca afetar outros acessos a /criar-conta.
 */
const STORE_CREATION_INTENT_KEY = "homsteg_create_store_intent";

export function markStoreCreationIntent() {
  try {
    sessionStorage.setItem(STORE_CREATION_INTENT_KEY, "1");
  } catch (error) {
    console.error(
      "[StoreCreationIntent] Não foi possível guardar a intenção:",
      error,
    );
  }
}

export function hasStoreCreationIntent() {
  try {
    return (
      sessionStorage.getItem(STORE_CREATION_INTENT_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function clearStoreCreationIntent() {
  try {
    sessionStorage.removeItem(
      STORE_CREATION_INTENT_KEY,
    );
  } catch {
    /* Sem sessionStorage não há nada a limpar. */
  }
}
