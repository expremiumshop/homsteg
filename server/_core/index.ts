import "dotenv/config";

import { createServer } from "http";
import net from "net";

import { createApp } from "../app";

import { seedPlans } from "../db";

import {
  serveStatic,
  setupVite,
} from "./vite"

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
  const app = createApp();
  const server = createServer(app);

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
      // Garante que os planos HOMSTEG existem na base
      // de dados antes de servir pedidos.
      seedPlans().catch((error) => {
        console.warn(
          "[Plans] Failed to seed plans:",
          error,
        );
      });

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
