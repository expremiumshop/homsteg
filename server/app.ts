import express from "express";
import { toNodeHandler } from "better-auth/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { auth } from "./auth.js";
import { appRouter } from "./routers.js";
import { createContext } from "./_core/context.js";


/**
 * Regista as rotas de API partilhadas pelo Express local e pela Vercel.
 * A entrega dos assets Vite continua a ser responsabilidade do ambiente
 * que invoca esta aplicação.
 */
export function createApp() {
  const app = express();

  // O Better Auth precisa receber o body original da requisição.
  app.all("/api/auth/*", toNodeHandler(auth));

  app.use(
    express.json({
      limit: "50mb",
    }),
  );

  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
    }),
  );

  /*
   * O proxy legado "/manus-storage/*" (template Manus) foi
   * DESATIVADO: era uma rota pública sem autenticação que
   * assinava qualquer chave contra o Forge da Manus.
   *
   * Confirmação de que é legado e sem dependências atuais:
   * - HOMSTEG guarda media exclusivamente no Cloudflare R2
   *   (server/r2.ts, acessível por URLs assinadas próprias);
   * - nenhum ficheiro do cliente ou servidor referencia
   *   "/manus-storage";
   * - BUILT_IN_FORGE_API_URL/BUILT_IN_FORGE_API_KEY não estão
   *   configurados em nenhum ambiente, pelo que a rota
   *   respondia sempre 500.
   *
   * server/_core/storageProxy.ts e server/storage.ts ficam
   * no repositório sem qualquer registo ativo.
   */

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}