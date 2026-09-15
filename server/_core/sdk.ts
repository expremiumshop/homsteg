import {
  AXIOS_TIMEOUT_MS,
  COOKIE_NAME,
  ONE_YEAR_MS,
  decodeOAuthState,
} from "@shared/const";

import { ForbiddenError } from "@shared/_core/errors";

import axios, {
  type AxiosInstance,
} from "axios";

import {
  parse as parseCookieHeader,
} from "cookie";

import type { Request } from "express";

import {
  SignJWT,
  jwtVerify,
} from "jose";

import type { User } from "../../drizzle_old/schema";

import * as db from "../db";

import { ENV } from "./env";

import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/manusTypes";

/* =========================================================
   HELPERS
========================================================= */

const isNonEmptyString = (
  value: unknown,
): value is string =>
  typeof value === "string" &&
  value.length > 0;

/* =========================================================
   SESSION
========================================================= */

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

const EXCHANGE_TOKEN_PATH =
  "/webdev.v1.WebDevAuthPublicService/ExchangeToken";

const GET_USER_INFO_PATH =
  "/webdev.v1.WebDevAuthPublicService/GetUserInfo";

const GET_USER_INFO_WITH_JWT_PATH =
  "/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt";

/* =========================================================
   OAUTH SERVICE
========================================================= */

class OAuthService {
  constructor(
    private client: ReturnType<
      typeof axios.create
    >,
  ) {
    console.log(
      "[OAuth] Initialized with baseURL:",
      ENV.oAuthServerUrl,
    );

    if (!ENV.oAuthServerUrl) {
      console.warn(
        "[OAuth] OAUTH_SERVER_URL is not configured. OAuth login is disabled.",
      );
    }
  }

  private decodeState(
    state: string,
  ): string {
    return decodeOAuthState(state)
      .redirectUri;
  }

  async getTokenByCode(
    code: string,
    state: string,
  ): Promise<ExchangeTokenResponse> {
    const payload: ExchangeTokenRequest = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri:
        this.decodeState(state),
    };

    const { data } =
      await this.client.post<ExchangeTokenResponse>(
        EXCHANGE_TOKEN_PATH,
        payload,
      );

    return data;
  }

  async getUserInfoByToken(
    token: ExchangeTokenResponse,
  ): Promise<GetUserInfoResponse> {
    const { data } =
      await this.client.post<GetUserInfoResponse>(
        GET_USER_INFO_PATH,
        {
          accessToken:
            token.accessToken,
        },
      );

    return data;
  }
}

/* =========================================================
   OAUTH CLIENT
========================================================= */

const createOAuthHttpClient =
  (): AxiosInstance =>
    axios.create({
      baseURL:
        ENV.oAuthServerUrl || undefined,
      timeout: AXIOS_TIMEOUT_MS,
    });

/* =========================================================
   SDK
========================================================= */

class SDKServer {
  private readonly client: AxiosInstance;

  private readonly oauthService: OAuthService;

  constructor(
    client: AxiosInstance =
      createOAuthHttpClient(),
  ) {
    this.client = client;

    this.oauthService =
      new OAuthService(this.client);
  }

  /* =======================================================
     LOGIN METHOD
  ======================================================= */

  private deriveLoginMethod(
    platforms: unknown,
    fallback:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      fallback &&
      fallback.length > 0
    ) {
      return fallback;
    }

    if (
      !Array.isArray(platforms) ||
      platforms.length === 0
    ) {
      return null;
    }

    const set = new Set<string>(
      platforms.filter(
        (
          p,
        ): p is string =>
          typeof p === "string",
      ),
    );

    if (
      set.has(
        "REGISTERED_PLATFORM_EMAIL",
      )
    ) {
      return "email";
    }

    if (
      set.has(
        "REGISTERED_PLATFORM_GOOGLE",
      )
    ) {
      return "google";
    }

    if (
      set.has(
        "REGISTERED_PLATFORM_APPLE",
      )
    ) {
      return "apple";
    }

    if (
      set.has(
        "REGISTERED_PLATFORM_MICROSOFT",
      ) ||
      set.has(
        "REGISTERED_PLATFORM_AZURE",
      )
    ) {
      return "microsoft";
    }

    if (
      set.has(
        "REGISTERED_PLATFORM_GITHUB",
      )
    ) {
      return "github";
    }

    const first =
      Array.from(set)[0];

    return first
      ? first.toLowerCase()
      : null;
  }

  /* =======================================================
     OAUTH METHODS
  ======================================================= */

  async exchangeCodeForToken(
    code: string,
    state: string,
  ): Promise<ExchangeTokenResponse> {
    return this.oauthService
      .getTokenByCode(
        code,
        state,
      );
  }

  async getUserInfo(
    accessToken: string,
  ): Promise<GetUserInfoResponse> {
    const data =
      await this.oauthService
        .getUserInfoByToken({
          accessToken,
        } as ExchangeTokenResponse);

    const loginMethod =
      this.deriveLoginMethod(
        (data as any)?.platforms,
        (data as any)?.platform ??
          data.platform ??
          null,
      );

    return {
      ...(data as any),
      platform: loginMethod,
      loginMethod,
    } as GetUserInfoResponse;
  }

  async getUserInfoWithJwt(
    jwtToken: string,
  ): Promise<GetUserInfoWithJwtResponse> {
    if (!ENV.oAuthServerUrl) {
      throw new Error(
        "OAuth server is not configured.",
      );
    }

    const payload: GetUserInfoWithJwtRequest =
      {
        jwtToken,
        projectId: ENV.appId,
      };

    const { data } =
      await this.client.post<GetUserInfoWithJwtResponse>(
        GET_USER_INFO_WITH_JWT_PATH,
        payload,
      );

    const loginMethod =
      this.deriveLoginMethod(
        (data as any)?.platforms,
        (data as any)?.platform ??
          data.platform ??
          null,
      );

    return {
      ...(data as any),
      platform: loginMethod,
      loginMethod,
    } as GetUserInfoWithJwtResponse;
  }

  /* =======================================================
     COOKIES
  ======================================================= */

  private parseCookies(
    cookieHeader:
      | string
      | undefined,
  ) {
    if (!cookieHeader) {
      return new Map<
        string,
        string
      >();
    }

    const parsed =
      parseCookieHeader(
        cookieHeader,
      );

    return new Map(
      Object.entries(parsed),
    );
  }

  /* =======================================================
     SESSION SECRET
  ======================================================= */

  private getSessionSecret() {
    const secret =
      ENV.cookieSecret;

    if (
      !secret ||
      secret.length < 32
    ) {
      throw new Error(
        "COOKIE/JWT secret is missing or too short.",
      );
    }

    return new TextEncoder().encode(
      secret,
    );
  }

  /* =======================================================
     CREATE SESSION TOKEN
  ======================================================= */

  async createSessionToken(
    openId: string,
    options: {
      expiresInMs?: number;
      name?: string;
    } = {},
  ): Promise<string> {
    if (
      !isNonEmptyString(openId)
    ) {
      throw new Error(
        "Cannot create session without openId.",
      );
    }

    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name:
          options.name ||
          openId,
      },
      options,
    );
  }

  /* =======================================================
     SIGN SESSION
  ======================================================= */

  async signSession(
    payload: SessionPayload,
    options: {
      expiresInMs?: number;
    } = {},
  ): Promise<string> {
    if (
      !isNonEmptyString(
        payload.openId,
      )
    ) {
      throw new Error(
        "Session openId is required.",
      );
    }

    if (
      !isNonEmptyString(
        payload.appId,
      )
    ) {
      throw new Error(
        "Session appId is required.",
      );
    }

    if (
      !isNonEmptyString(
        payload.name,
      )
    ) {
      throw new Error(
        "Session name is required.",
      );
    }

    const issuedAt =
      Date.now();

    const expiresInMs =
      options.expiresInMs ??
      ONE_YEAR_MS;

    const expirationSeconds =
      Math.floor(
        (issuedAt +
          expiresInMs) /
          1000,
      );

    const secretKey =
      this.getSessionSecret();

    return new SignJWT({
      openId:
        payload.openId,

      appId:
        payload.appId,

      name:
        payload.name,
    })
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
      })
      .setIssuedAt(
        Math.floor(
          issuedAt / 1000,
        ),
      )
      .setExpirationTime(
        expirationSeconds,
      )
      .sign(secretKey);
  }

  /* =======================================================
     VERIFY SESSION
  ======================================================= */

  async verifySession(
    cookieValue:
      | string
      | undefined
      | null,
  ): Promise<SessionPayload | null> {
    if (!cookieValue) {
      console.warn(
        "[Auth] Missing session cookie",
      );

      return null;
    }

    try {
      const secretKey =
        this.getSessionSecret();

      const { payload } =
        await jwtVerify(
          cookieValue,
          secretKey,
          {
            algorithms: [
              "HS256",
            ],
          },
        );

      const {
        openId,
        appId,
        name,
      } =
        payload as Record<
          string,
          unknown
        >;

      if (
        !isNonEmptyString(
          openId,
        )
      ) {
        console.warn(
          "[Auth] Session openId missing.",
        );

        return null;
      }

      if (
        !isNonEmptyString(
          appId,
        )
      ) {
        console.warn(
          "[Auth] Session appId missing.",
        );

        return null;
      }

      if (
        !isNonEmptyString(
          name,
        )
      ) {
        console.warn(
          "[Auth] Session name missing.",
        );

        return null;
      }

      if (
        appId !== ENV.appId
      ) {
        console.warn(
          "[Auth] Session appId does not match current application.",
        );

        return null;
      }

      return {
        openId,
        appId,
        name,
      };
    } catch (error) {
      console.warn(
        "[Auth] Session verification failed:",
        error,
      );

      return null;
    }
  }

  /* =======================================================
     AUTHENTICATE REQUEST
  ======================================================= */

  async authenticateRequest(
    req: Request,
  ): Promise<AuthenticatedUser> {
    console.log(
      "[Auth] Authenticating request:",
      req.method,
      req.originalUrl,
    );

    /* -------------------------------------------------------
       1. COOKIE
    ------------------------------------------------------- */

    const cookies =
      this.parseCookies(
        req.headers.cookie,
      );

    let sessionToken =
      cookies.get(
        COOKIE_NAME,
      );

    /* -------------------------------------------------------
       2. BEARER TOKEN FALLBACK
    ------------------------------------------------------- */

    if (!sessionToken) {
      const authHeader =
        req.headers.authorization;

      if (
        typeof authHeader ===
          "string" &&
        authHeader.startsWith(
          "Bearer ",
        )
      ) {
        sessionToken =
          authHeader.slice(7);
      }
    }

    if (!sessionToken) {
      console.warn(
        "[Auth] No session token found.",
      );

      throw ForbiddenError(
        "Invalid session cookie",
      );
    }

    /* -------------------------------------------------------
       3. VERIFY JWT
    ------------------------------------------------------- */

    const session =
      await this.verifySession(
        sessionToken,
      );

    if (!session) {
      console.warn(
        "[Auth] Invalid session.",
      );

      throw ForbiddenError(
        "Invalid session cookie",
      );
    }

    console.log(
      "[Auth] Session verified:",
      {
        openId:
          session.openId,
        appId:
          session.appId,
        name:
          session.name,
      },
    );

    /* -------------------------------------------------------
       4. CRON
    ------------------------------------------------------- */

    if (
      session.openId.startsWith(
        CRON_OPEN_ID_PREFIX,
      )
    ) {
      const userInfo =
        await this.getUserInfoWithJwt(
          sessionToken,
        );

      const taskUid =
        userInfo.taskUid ??
        null;

      if (!taskUid) {
        throw ForbiddenError(
          "Cron session missing task_uid",
        );
      }

      return buildCronUser(
        userInfo,
      );
    }

    /* -------------------------------------------------------
       5. FIND USER BY OPEN ID
    ------------------------------------------------------- */

    const sessionUserId =
      session.openId;

    const signedInAt =
      new Date();

    let user =
      await db.getUserByOpenId(
        sessionUserId,
      );

    /* -------------------------------------------------------
       6. IMPORTANT:
          OUR HOMSTEG EMAIL/PASSWORD USERS
          MUST EXIST IN OUR DATABASE.

          We DO NOT attempt OAuth sync
          for them.
    ------------------------------------------------------- */

    if (!user) {
      console.warn(
        "[Auth] User not found for session openId:",
        sessionUserId,
      );

      /*
       * OAuth users can still be synchronized
       * if the OAuth server is configured.
       */
      if (ENV.oAuthServerUrl) {
        try {
          const userInfo =
            await this.getUserInfoWithJwt(
              sessionToken,
            );

          if (
            !isNonEmptyString(
              userInfo.openId,
            )
          ) {
            throw new Error(
              "OAuth returned invalid openId.",
            );
          }

          await db.upsertUser({
            openId:
              userInfo.openId,

            name:
              userInfo.name ||
              null,

            email:
              userInfo.email ??
              null,

            loginMethod:
              userInfo.loginMethod ??
              userInfo.platform ??
              null,

            lastSignedIn:
              signedInAt,
          });

          user =
            await db.getUserByOpenId(
              userInfo.openId,
            );
        } catch (error) {
          console.error(
            "[Auth] OAuth sync failed:",
            error,
          );
        }
      }
    }

    /* -------------------------------------------------------
       7. USER STILL NOT FOUND
    ------------------------------------------------------- */

    if (!user) {
      console.error(
        "[Auth] User not found:",
        sessionUserId,
      );

      throw ForbiddenError(
        "User not found",
      );
    }

    /* -------------------------------------------------------
       8. UPDATE LAST SIGN IN
    ------------------------------------------------------- */

    await db.upsertUser({
      openId:
        user.openId,

      lastSignedIn:
        signedInAt,
    });

    console.log(
      "[Auth] User authenticated:",
      {
        id: user.id,
        email: user.email,
        openId:
          user.openId,
      },
    );

    return user;
  }
}

/* =========================================================
   CRON
========================================================= */

const CRON_OPEN_ID_PREFIX =
  "cron_";

/* =========================================================
   AUTHENTICATED USER
========================================================= */

export type AuthenticatedUser =
  User & {
    taskUid?: string;
    isCron?: boolean;
  };

/* =========================================================
   CRON USER
========================================================= */

function buildCronUser(
  userInfo: GetUserInfoWithJwtResponse,
): AuthenticatedUser {
  const now =
    new Date();

  return {
    id: -1,

    openId:
      userInfo.openId,

    name:
      userInfo.name ||
      "Manus Scheduled Task",

    email: null,

    loginMethod: null,

    role: "user",

    createdAt: now,

    updatedAt: now,

    lastSignedIn: now,

    taskUid:
      userInfo.taskUid ??
      undefined,

    isCron: true,
  } as AuthenticatedUser;
}

/* =========================================================
   EXPORT
========================================================= */

export const sdk =
  new SDKServer();