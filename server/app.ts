import express from "express";

import { toNodeHandler } from "better-auth/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { auth } from "./auth";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerStorageProxy } from "./_core/storageProxy";

/**
 * Regista as rotas de API partilhadas pelo Express local e pela Vercel.
 * A entrega dos assets Vite continua a ser responsabilidade do ambiente
 * que invoca esta aplicação.
 */
export function createApp() {
  const app = express();

  // O Better Auth precisa receber o body original da requisição.
  app.all(
    "/api/auth/*",
    toNodeHandler(auth),
  );

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

  registerStorageProxy(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}
