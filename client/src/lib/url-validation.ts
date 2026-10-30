import { isIP } from "net";
import { lookup } from "dns/promises";

// IPv4 ranges a server-side fetch must never reach (RFC 1918, loopback, link-local
// incl. cloud metadata, carrier-grade NAT, "this network", multicast and reserved)
function isPrivateIpv4(host: string): boolean {
  const [a, b] = host.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

// "::ffff:7f00:1" (how URL() normalises ::ffff:127.0.0.1) → "127.0.0.1"
function ipv4FromMappedHex(rest: string): string | null {
  const m = rest.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (!m) return null;
  const hi = parseInt(m[1], 16);
  const lo = parseInt(m[2], 16);
  return [hi >> 8, hi & 255, lo >> 8, lo & 255].join(".");
}

export function isPrivateIp(host: string): boolean {
  // URL().hostname keeps the brackets around IPv6 literals
  const ip = host.replace(/^\[|\]$/g, "").toLowerCase();

  if (isIP(ip) === 4) return isPrivateIpv4(ip);
  if (isIP(ip) === 6) {
    if (ip.startsWith("::ffff:")) {
      const rest = ip.slice(7);
      const v4 = isIP(rest) === 4 ? rest : ipv4FromMappedHex(rest);
      if (v4) return isPrivateIpv4(v4);
    }
    return (
      ip === "::" ||
      ip === "::1" ||
      // fe80::/10 link-local covers fe80 to febf
      /^fe[89ab]/.test(ip) ||
      ip.startsWith("fc") ||
      ip.startsWith("fd") ||
      ip.startsWith("ff")
    );
  }
  return false;
}

function isBlockedName(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal");
}

// For URLs the server will fetch: the host must be public by name, and every address
// it resolves to must be public too (so names like localtest.me → 127.0.0.1 are rejected).
// shortcut: redirects aren't re-checked hop by hop; follow them manually in the scraper if that matters.
export async function isPublicHost(hostname: string): Promise<boolean> {
  if (isBlockedName(hostname) || isPrivateIp(hostname)) return false;
  const bare = hostname.replace(/^\[|\]$/g, "");
  if (isIP(bare)) return true;
  try {
    const addresses = await lookup(bare, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every((a) => !isPrivateIp(a.address));
  } catch {
    return false;
  }
}

// For URLs only rendered by the browser (thumbnails): https and not an obviously private host
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return !isBlockedName(parsed.hostname) && !isPrivateIp(parsed.hostname);
  } catch {
    return false;
  }
}
