/**
 * Código exclusivo da loja (HOMSTEG).
 *
 * Toda loja recebe automaticamente um código único de
 * 8 caracteres. O proprietário pode partilhá-lo para
 * convidar outras pessoas; um código pode ser utilizado
 * por várias outras lojas — mas pertence a UMA loja.
 *
 * Alfabeto sem caracteres ambíguos (sem 0/O/1/I/L):
 * 32 símbolos → 32^8 ≈ 1,1 biliões de combinações.
 */

const STORE_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export const STORE_CODE_LENGTH = 8;

/**
 * Gera um código aleatório criptograficamente seguro
 * no formato usado por toda a plataforma (ex.: "H7K2M9PQ").
 */
export function generateStoreCode(): string {
  const bytes = new Uint8Array(STORE_CODE_LENGTH);

  globalThis.crypto.getRandomValues(bytes);

  let code = "";

  for (let i = 0; i < STORE_CODE_LENGTH; i++) {
    code += STORE_CODE_ALPHABET[bytes[i] % STORE_CODE_ALPHABET.length];
  }

  return code;
}

/**
 * Normaliza um código introduzido por alguém:
 * remove espaços/ separadores comuns, uppercase.
 */
export function normalizeStoreCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[\s-_.]/g, "");
}

/**
 * Valida o formato de um código de loja.
 */
export function isValidStoreCodeFormat(raw: string): boolean {
  const normalized = normalizeStoreCode(raw);

  return (
    normalized.length === STORE_CODE_LENGTH &&
    normalized.split("").every((char) =>
      STORE_CODE_ALPHABET.includes(char),
    )
  );
}
