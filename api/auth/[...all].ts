import { toNodeHandler } from "better-auth/node";

import { auth } from "../../server/auth";

/*
 * A Vercel não executa o servidor Express de server/_core/index.ts.
 * Este entrypoint serverless recebe todas as rotas /api/auth/* e usa
 * exactamente a mesma instância do Better Auth utilizada localmente.
 */
export default toNodeHandler(auth);
