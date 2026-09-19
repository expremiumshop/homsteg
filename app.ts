import { createApp } from "./server/app";

/*
 * Entry point reconhecido pela Vercel para aplicações Express.
 * Todas as rotas, incluindo /api/auth/* e /api/trpc/*, são definidas
 * em server/app.ts e são partilhadas com o servidor local.
 */
const app = createApp();

export default app;
