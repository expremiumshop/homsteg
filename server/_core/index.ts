import "dotenv/config";

import express from "express";
import { createServer } from "http";
import net from "net";

import { toNodeHandler } from "better-auth/node";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { auth } from "../auth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerStorageProxy } from "./storageProxy";

import {
  serveStatic,
  setupVite,
} from "./vite";

function isPortAvailable(
  port: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    const testServer = net.createServer();

    testServer.listen(
      port,
      () => {
        testServer.close(() => resolve(true));
      },
    );

    testServer.on(
      "error",
      () => resolve(false),
    );
  });
}

async function findAvailablePort(
  startPort = 3000,
): Promise<number> {
  for (
    let port = startPort;
    port < startPort + 20;
    port++
  ) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(
    `No available port found starting from ${startPort}`,
  );
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  /*
   * ============================================================
   * BETTER AUTH
   * ============================================================
   *
   * O Better Auth trata:
   *
   * - criar conta
   * - login
   * - logout
   * - sessão
   * - cookies
   * - recuperação/verificação de autenticação
   *
   * Deve estar antes do express.json(), porque o handler do
   * Better Auth precisa receber o body original da requisição.
   */
  app.all(
    "/api/auth/*",
    toNodeHandler(auth),
  );

  /*
   * ============================================================
   * BODY PARSERS
   * ============================================================
   */
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
   * ============================================================
   * OUTRAS ROTAS
   * ============================================================
   */
  registerStorageProxy(app);

  /*
   * ============================================================
   * tRPC
   * ============================================================
   */
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  /*
   * ============================================================
   * FRONTEND
   * ============================================================
   */
  if (
    process.env.NODE_ENV ===
    "development"
  ) {
    await setupVite(
      app,
      server,
    );
  } else {
    serveStatic(app);
  }

  /*
   * ============================================================
   * PORTA
   * ============================================================
   */
  const preferredPort =
    parseInt(
      process.env.PORT ||
        "3000",
      10,
    );

  const port =
    await findAvailablePort(
      preferredPort,
    );

  if (
    port !== preferredPort
  ) {
    console.log(
      `Port ${preferredPort} is busy, using port ${port} instead`,
    );
  }

  server.listen(
    port,
    () => {
      console.log(
        `Server running on http://localhost:${port}/`,
      );

      console.log(
        `[Better Auth] Authentication active at /api/auth/*`,
      );
    },
  );
}

startServer().catch(
  (error) => {
    console.error(
      "[Server] Failed to start:",
      error,
    );

    process.exit(1);
  },
);