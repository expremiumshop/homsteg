import "dotenv/config";

import express from "express";

import {
  clerkMiddleware,
  getAuth,
} from "@clerk/express";

import { verifyWebhook } from "@clerk/express/webhooks";

import { createServer } from "http";

import net from "net";

import {
  createExpressMiddleware,
} from "@trpc/server/adapters/express";

import { registerOAuthRoutes } from "./oauth";

import { registerStorageProxy } from "./storageProxy";

import { appRouter } from "../routers";

import { createContext } from "./context";

import { syncClerkUser } from "../db";

import {
  serveStatic,
  setupVite,
} from "./vite";

function isPortAvailable(
  port: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    const testServer =
      net.createServer();

    testServer.listen(
      port,
      () => {
        testServer.close(() =>
          resolve(true),
        );
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
    if (
      await isPortAvailable(port)
    ) {
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
   * CLERK
   * ============================================================
   *
   * O middleware do Clerk precisa estar antes:
   *
   * - tRPC
   * - rotas protegidas
   * - createContext
   *
   * Assim getAuth(req) consegue identificar
   * a sessão autenticada.
   */

  const clerkPublishableKey =
    process.env.CLERK_PUBLISHABLE_KEY;

  const clerkSecretKey =
    process.env.CLERK_SECRET_KEY;

  if (!clerkPublishableKey) {
    throw new Error(
      "CLERK_PUBLISHABLE_KEY não está configurada.",
    );
  }

  if (!clerkSecretKey) {
    throw new Error(
      "CLERK_SECRET_KEY não está configurada.",
    );
  }

  app.use(
    clerkMiddleware({
      publishableKey:
        clerkPublishableKey,

      secretKey:
        clerkSecretKey,
    }),
  );

  /*
   * ============================================================
   * DEBUG DE AUTENTICAÇÃO CLERK
   * ============================================================
   *
   * Não bloqueia nenhuma rota.
   *
   * Serve apenas para confirmar que o servidor
   * realmente recebe o userId da sessão Clerk.
   */

  app.use(
    "/api/trpc",
    (req, _res, next) => {
      try {
        const auth = getAuth(req);

        const userId =
          auth.userId ?? null;

        console.log(
          `[Clerk] ${req.method} ${req.path} | userId=${userId ?? "NONE"}`,
        );
      } catch (error) {
        console.error(
          "[Clerk] Erro ao ler sessão:",
          error,
        );
      }

      next();
    },
  );

  /*
   * ============================================================
   * WEBHOOK CLERK
   * ============================================================
   *
   * Deve vir antes do express.json(),
   * pois verifyWebhook precisa do corpo bruto.
   */

  app.post(
    "/api/webhooks/clerk",
    express.raw({
      type: "application/json",
    }),
    async (req, res) => {
      try {
        const event =
          await verifyWebhook(req);

        if (
          event.type ===
            "user.created" ||
          event.type ===
            "user.updated"
        ) {
          const user =
            event.data;

          const primaryEmail =
            user.email_addresses.find(
              (email) =>
                email.id ===
                user.primary_email_address_id,
            );

          const name =
            [
              user.first_name,
              user.last_name,
            ]
              .filter(Boolean)
              .join(" ")
              .trim() || null;

          await syncClerkUser({
            clerkUserId:
              user.id,

            email:
              primaryEmail?.email_address
                ?.toLowerCase()
                .trim() ?? null,

            name,
          });
        }

        res
          .status(200)
          .send("Webhook received");
      } catch (error) {
        console.error(
          "[Clerk] Webhook verification or sync failed:",
          error,
        );

        res
          .status(400)
          .send("Invalid webhook");
      }
    },
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

  registerOAuthRoutes(app);

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
        `[Clerk] Middleware ativo.`,
      );
    },
  );
}

startServer().catch((error) => {
  console.error(
    "[Server] Failed to start:",
    error,
  );

  process.exit(1);
});