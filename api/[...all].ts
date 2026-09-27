/*
 * A Vercel executa este entrypoint para qualquer /api/*.
 * O Express já contém as rotas do Better Auth, tRPC e storage.
 *
 * Nota: o import usa sufixo .js (padrão ESM do repo,
 * "type": "module") — import sem extensão quebra
 * @vercel/node em runtime (ERR_MODULE_NOT_FOUND).
 */
import { createApp } from "../server/app.js";
export default createApp();
