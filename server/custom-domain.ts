import { resolveTxt } from "node:dns/promises";
import { domainToASCII } from "node:url";

export function normalizeCustomDomain(value: string) {
  const input = value.trim().toLowerCase();
  if (!input || /[\s/:?#@]/.test(input) || input.endsWith(".")) return null;
  const ascii = domainToASCII(input);
  if (!ascii || ascii.length > 253 || !ascii.includes(".")) return null;
  const labels = ascii.split(".");
  if (
    labels.some(
      label =>
        !label ||
        label.length > 63 ||
        !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
    )
  )
    return null;
  if (
    /^\d+(?:\.\d+){3}$/.test(ascii) ||
    !/[a-z]/.test(labels[labels.length - 1])
  )
    return null;
  if (
    ascii === "homsteg.com" ||
    ascii.endsWith(".homsteg.com") ||
    ascii === "vercel.app" ||
    ascii.endsWith(".vercel.app")
  )
    return null;
  return ascii;
}

export async function checkCustomDomainVerification(
  domain: string,
  token: string
) {
  try {
    const records = await resolveTxt(`_homsteg-verification.${domain}`);
    return {
      verified: records.some(parts => parts.join("") === token),
      error: false,
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return { verified: false, error: code !== "ENODATA" };
  }
}
