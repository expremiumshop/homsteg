import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
]);

function isSecureRequest(req: Request) {
  if (req.protocol === "https") {
    return true;
  }

  const forwardedProto = req.headers["x-forwarded-proto"];

  if (!forwardedProto) {
    return false;
  }

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(
    (proto) => proto.trim().toLowerCase() === "https",
  );
}

export function getSessionCookieOptions(
  req: Request,
): Pick<
  CookieOptions,
  "domain" | "httpOnly" | "path" | "sameSite" | "secure"
> {
  const hostname = req.hostname;
  const secure = isSecureRequest(req);

  /*
   * Desenvolvimento:
   *
   * localhost usa HTTP, portanto não podemos usar
   * SameSite=None + Secure=false.
   *
   * SameSite=Lax permite que o cookie seja enviado
   * normalmente entre as páginas da própria aplicação.
   */
  if (
    hostname &&
    LOCAL_HOSTS.has(hostname)
  ) {
    return {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    };
  }

  /*
   * Produção:
   *
   * Se a aplicação estiver em HTTPS, usamos Secure.
   * Lax é suficiente para a navegação normal da aplicação.
   */
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
  };
}