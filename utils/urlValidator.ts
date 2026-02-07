const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

if (!rawBaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_BASE_URL");
}

let parsedBaseUrl: URL;
try {
  parsedBaseUrl = new URL(rawBaseUrl);
} catch {
  throw new Error(`Invalid NEXT_PUBLIC_BASE_URL: "${rawBaseUrl}"`);
}

export const BASE_URL = parsedBaseUrl.toString();