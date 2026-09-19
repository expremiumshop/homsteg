import express from "express";
import { createApp } from "./server/app.js";

/**
 * Entry point da aplicação Express para a Vercel.
 * Todas as rotas são definidas em server/app.ts.
 */
const app = createApp();

void express;

export default app;