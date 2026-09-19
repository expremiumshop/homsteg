import {
    GetObjectCommand,
    HeadBucketCommand,
    PutObjectCommand,
    S3Client,
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const endpoint =
    process.env.R2_ENDPOINT ||
    (accountId
      ? `https://${accountId}.r2.cloudflarestorage.com`
      : undefined);
  
  if (!accountId) {
    console.warn("[R2] R2_ACCOUNT_ID não configurado.");
  }
  
  if (!accessKeyId) {
    console.warn("[R2] R2_ACCESS_KEY_ID não configurado.");
  }
  
  if (!secretAccessKey) {
    console.warn("[R2] R2_SECRET_ACCESS_KEY não configurado.");
  }
  
  if (!bucketName) {
    console.warn("[R2] R2_BUCKET_NAME não configurado.");
  }
  
  if (!endpoint) {
    console.warn("[R2] R2_ENDPOINT não configurado.");
  }
  
  export const R2_BUCKET = bucketName ?? "";
  
  export const r2Client = new S3Client({
    region: process.env.R2_REGION || "auto",
    endpoint,
    credentials:
      accessKeyId && secretAccessKey
        ? {
            accessKeyId,
            secretAccessKey,
          }
        : undefined,
  });
  
  function assertR2Configured() {
    if (
      !accountId ||
      !accessKeyId ||
      !secretAccessKey ||
      !bucketName ||
      !endpoint
    ) {
      throw new Error(
        "Cloudflare R2 não está configurado corretamente no servidor.",
      );
    }
  }
  
  function sanitizeFileName(fileName: string) {
    return fileName
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-");
  }
  
  export function buildStoreObjectKey({
    storeId,
    folder,
    fileName,
  }: {
    storeId: string;
    folder: string;
    fileName: string;
  }) {
    const safeStoreId = storeId.trim();
    const safeFolder = folder
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .replace(/[^a-zA-Z0-9/_-]/g, "-");
  
    const safeFileName = sanitizeFileName(fileName);
  
    if (!safeStoreId) {
      throw new Error("storeId inválido.");
    }
  
    if (!safeFolder) {
      throw new Error("Pasta de armazenamento inválida.");
    }
  
    if (!safeFileName) {
      throw new Error("Nome do ficheiro inválido.");
    }
  
    return `stores/${safeStoreId}/${safeFolder}/${safeFileName}`;
  }
  
  export async function checkR2Connection() {
    assertR2Configured();
  
    await r2Client.send(
      new HeadBucketCommand({
        Bucket: R2_BUCKET,
      }),
    );
  
    return {
      connected: true,
      bucket: R2_BUCKET,
    };
  }
  
  export async function createStoreUploadUrl({
    storeId,
    folder,
    fileName,
    contentType,
  }: {
    storeId: string;
    folder: string;
    fileName: string;
    contentType: string;
  }) {
    assertR2Configured();
  
    if (!contentType.startsWith("image/")) {
      throw new Error("O ficheiro enviado precisa ser uma imagem.");
    }
  
    const key = buildStoreObjectKey({
      storeId,
      folder,
      fileName: `${crypto.randomUUID()}-${fileName}`,
    });
  
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });
  
    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 60 * 15,
    });
  
    return {
      key,
      uploadUrl,
    };
  }
  
  export async function createStoreDownloadUrl(key: string) {
    assertR2Configured();
  
    if (!key.trim()) {
      throw new Error("Chave R2 inválida.");
    }
  
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });
  
    return getSignedUrl(r2Client, command, {
      expiresIn: 60 * 60 * 24 * 7,
    });
  }
  
  export async function uploadStoreObject({
    key,
    body,
    contentType,
  }: {
    key: string;
    body: Buffer | Uint8Array | string;
    contentType: string;
  }) {
    assertR2Configured();
  
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  
    return {
      key,
    };
  }
  
  export async function getStoreObject(key: string) {
    assertR2Configured();
  
    return r2Client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      }),
    );
  }
  
  export async function deleteStoreObject(key: string) {
    assertR2Configured();
  
    // DeleteObjectCommand intentionally omitted for now.
    // We are not deleting product images during product creation.
    return {
      key,
      deleted: false,
    };
  }