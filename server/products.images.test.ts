import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { extractStoreObjectKey, isPresignedObjectUrl } from "./r2";

const projectRoot = path.resolve(import.meta.dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(projectRoot, relativePath), "utf8");
}

/** Colapsa espaços/quebras de linha num único espaço. */
function normalizeSource(source: string): string {
  return source.replace(/\s+/g, " ");
}

/* URL presigned estilo S3 path-style (endpoint + bucket). */
const presignedPathStyle =
  "https://abc123.r2.cloudflarestorage.com/meu-bucket/" +
  "stores/store-a/products/1699999999-foto.jpg" +
  "?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cred" +
  "&X-Amz-Signature=assinatura";

/* URL presigned estilo virtual-host (sem bucket no caminho). */
const presignedVirtualHost =
  "https://meu-bucket.abc123.r2.cloudflarestorage.com/" +
  "stores/store-a/products/logo.png" +
  "?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=xyz";

const externalUrl =
  "https://images.unsplash.com/photo-1521572163474?w=800&q=80";

/* ============================================================
   DETECÇÃO E RECUPERAÇÃO DE CHAVES R2
   ============================================================ */

describe("HOMSTEG — URLs presigned vs referência permanente", () => {
  it("reconhece uma URL presigned (expira em 7 dias)", () => {
    expect(isPresignedObjectUrl(presignedPathStyle)).toBe(true);
    expect(isPresignedObjectUrl(presignedVirtualHost)).toBe(true);
  });

  it("não marca URLs públicas/externas como presigned", () => {
    expect(isPresignedObjectUrl(externalUrl)).toBe(false);
    expect(isPresignedObjectUrl("não é uma URL")).toBe(false);
  });

  it("extrai a chave R2 permanente de uma URL presigned", () => {
    expect(extractStoreObjectKey(presignedPathStyle)).toBe(
      "stores/store-a/products/1699999999-foto.jpg",
    );
    expect(extractStoreObjectKey(presignedVirtualHost)).toBe(
      "stores/store-a/products/logo.png",
    );
  });

  it("devolve null quando a URL não aponta a um objeto da loja", () => {
    expect(extractStoreObjectKey(externalUrl)).toBeNull();
    expect(extractStoreObjectKey("não é uma URL")).toBeNull();
  });
});

/* ============================================================
   LIGAÇÃO (wiring) — modais, router e hidratação
   ============================================================ */

describe("HOMSTEG — imageUrl nunca persiste uma URL temporária (wiring)", () => {
  const newModal = normalizeSource(
    readRepoFile("client/src/components/dashboard/products/NewProductModal.tsx"),
  );
  const editModal = normalizeSource(
    readRepoFile("client/src/components/dashboard/products/EditProductModal.tsx"),
  );
  const routersSource = normalizeSource(readRepoFile("server/routers.ts"));
  const dbSource = normalizeSource(readRepoFile("server/db.ts"));

  it("a criação guarda apenas as chaves R2 (imageKeys)", () => {
    expect(newModal).not.toContain("imageUrl: uploadedImages");
    expect(newModal).toContain(
      "imageKeys: uploadedImages.map((upload) => upload.key)",
    );
  });

  it("a edição não guarda a URL assinada de 7 dias", () => {
    expect(editModal).not.toContain("firstImageUrl");
    expect(editModal).toContain(
      "imageUrl: uploadedKeys.length ? null",
    );
  });

  it("products.create converte uma URL presigned na chave R2", () => {
    expect(routersSource).toContain("isPresignedObjectUrl(imageUrl)");
    expect(routersSource).toContain("extractStoreObjectKey(imageUrl)");
    expect(routersSource).toContain("imageUrl = null");
  });

  it("products.update nunca persiste uma URL presigned", () => {
    expect(routersSource).toContain(
      "input.imageUrl && isPresignedObjectUrl(input.imageUrl) ? null : input.imageUrl",
    );
  });

  it("a hidratação regenera URLs a partir da chave embutida na URL antiga", () => {
    expect(dbSource).toContain(
      "isPresignedObjectUrl(product.imageUrl) ? extractStoreObjectKey(product.imageUrl) : null",
    );
    expect(dbSource).toContain(
      "imageUrls.push(await createStoreDownloadUrl(signedKey))",
    );
  });

  it("as URLs públicas externas (demo) continuam intactas", () => {
    expect(dbSource).toContain("imageUrls.push(product.imageUrl)");
  });
});
