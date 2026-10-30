import { lookup, type LookupAddress, type LookupOptions } from "node:dns";
import { Agent, fetch } from "undici";
import { isPrivateIp } from "@/lib/url-validation";

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | LookupAddress[],
  family?: number,
) => void;

// Checks the address the socket actually connects to, so a hostname can't pass
// isPublicHost and then resolve to a private IP when fetched (DNS rebinding).
// IP-literal URLs skip DNS entirely and are covered by isPublicHost beforehand.
export const publicOnlyAgent = new Agent({
  connect: {
    lookup(hostname: string, options: LookupOptions, callback: LookupCallback) {
      lookup(hostname, { ...options, all: true }, (err, addresses) => {
        if (err) return callback(err, "", 0);
        if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
          return callback(Object.assign(new Error(`${hostname} resolves to a private address`), { code: "EPRIVATE" }), "", 0);
        }
        if (options.all) return callback(null, addresses);
        callback(null, addresses[0].address, addresses[0].family);
      });
    },
  },
});

// fetch() for user-supplied URLs: every connection goes through publicOnlyAgent
export function safeFetch(url: string, init: Parameters<typeof fetch>[1] = {}) {
  return fetch(url, { ...init, dispatcher: publicOnlyAgent });
}
