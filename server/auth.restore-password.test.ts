import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * A mutation auth.restorePassword chama auth.api.setPassword
 * (endpoint serverOnly do Better Auth). O módulo ./auth.js é
 * mockado para controlar esse comportamento sem base de dados
 * nem variáveis de ambiente reais.
 */
vi.mock("./auth.js", () => ({
  auth: {
    api: {
      setPassword: vi.fn(),
    },
  },
  getBetterAuthUserById: vi.fn(),
}));

import { appRouter } from "./routers";
import { auth } from "./auth.js";
import type { TrpcContext } from "./_core/context";

const setPasswordMock = vi.mocked(auth.api.setPassword);

function createAuthContext() {
  const user = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "better-auth",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx = {
    user,
    req: {
      protocol: "https",
      headers: { cookie: "better-auth.session_token=x" },
    } as unknown as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx, user };
}

describe("auth.restorePassword", () => {
  beforeEach(() => {
    setPasswordMock.mockReset();
  });

  it("repõe a palavra-passe quando a conta não tem credencial", async () => {
    const { ctx } = createAuthContext();

    setPasswordMock.mockResolvedValueOnce({
      status: true,
    } as Awaited<ReturnType<typeof setPasswordMock>>);

    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.restorePassword({
      newPassword: "palavra-segura-123",
    });

    expect(result).toEqual({
      restored: true,
      alreadyHadPassword: false,
    });

    expect(setPasswordMock).toHaveBeenCalledTimes(1);
    expect(setPasswordMock).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { newPassword: "palavra-segura-123" },
      }),
    );
  });

  it("reporta alreadyHadPassword quando a conta já tem palavra-passe", async () => {
    const { ctx } = createAuthContext();

    setPasswordMock.mockRejectedValueOnce(
      new Error("User already has a password set"),
    );

    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.restorePassword({
      newPassword: "palavra-segura-123",
    });

    expect(result).toEqual({
      restored: false,
      alreadyHadPassword: true,
    });
  });

  it("propaga erro interno para falhas inesperadas", async () => {
    const { ctx } = createAuthContext();

    setPasswordMock.mockRejectedValueOnce(
      new Error("boom"),
    );

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.restorePassword({
        newPassword: "palavra-segura-123",
      }),
    ).rejects.toThrow(
      "Não foi possível repor a palavra-passe da conta.",
    );
  });

  it("rejeita palavras-passe curtas", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.restorePassword({ newPassword: "curta" }),
    ).rejects.toThrow();
  });
});
