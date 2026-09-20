import express from "express";
import fs from "node:fs";
import path from "node:path";

import { createApp } from "./server/app.js";

/**
 * Entry point da aplicação Express para a Vercel.
 *
 * Produção:
 * - /api/* é atendido pelo backend
 * - dist/public contém o frontend Vite
 * - rotas da SPA retornam index.html
 *
 * Desenvolvimento:
 * - o Vite continua responsável pelo frontend
 */
const app = createApp();

void express;

if (process.env.NODE_ENV === "production") {
  const staticDir = path.resolve(
    process.cwd(),
    "dist",
    "public",
  );

  if (fs.existsSync(staticDir)) {
    app.use(
      express.static(staticDir, {
        index: "index.html",
      }),
    );

    app.get(
      /^(?!\/api(?:\/|$)).*/,
      (_req, res) => {
        res.sendFile(
          path.join(
            staticDir,
            "index.html",
          ),
        );
      },
    );
  }
}

export default app;