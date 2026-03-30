import { isIP } from "net";

export function isPrivateIp(host: string): boolean {
  if (isIP(host) === 4) {
    const parts = host.split(".").map(Number);
    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      parts[0] === 0 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 169 && parts[1] === 254) // link-local / cloud metadata
    );
  }
  if (isIP(host) === 6) {
    const lower = host.toLowerCase();
    return (
      lower === "::1" ||
      lower.startsWith("fe80:") ||
      lower.startsWith("fc") ||
      lower.startsWith("fd")
    );
  }
  return false;
}

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname;
    if (hostname === "localhost" || hostname.endsWith(".local")) return false;
    if (isPrivateIp(hostname)) return false;
    return true;
  } catch {
    return false;
  }
}
