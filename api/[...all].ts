import { createApp } from "../server/app";

/*
 * A Vercel executa este entrypoint para qualquer /api/*.
 * O Express já contém as rotas do Better Auth, tRPC e storage.
 */
export default createApp();
