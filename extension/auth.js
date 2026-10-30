// Shared by popup.js (via <script>) and serviceworker.js (via importScripts).

// Public Supabase project URL and publishable key: safe to ship in the extension.
const SUPABASE_URL = "https://gfdwrzaeofehgpwuulvr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PLZj21S_KtFVCz1-jiq5PQ_3WNyg3dQ";
const API_BASE = "https://ritro.vercel.app";

function getSession() {
  return chrome.storage.local.get(["access_token", "refresh_token", "user_email"]);
}

function saveSession(tokenResponse) {
  return chrome.storage.local.set({
    access_token: tokenResponse.access_token,
    refresh_token: tokenResponse.refresh_token,
    user_email: tokenResponse.user.email,
  });
}

function clearSession() {
  // bookmarks_cache* were written by the removed on-page bar; cleared so old installs don't keep them
  return chrome.storage.local.remove([
    "access_token",
    "refresh_token",
    "user_email",
    "bookmarks_cache",
    "bookmarks_cache_at",
  ]);
}

// POST to Supabase's token endpoint (password login or refresh).
// The error carries the HTTP status so callers can tell a revoked token from a blip.
async function requestToken(grantType, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grantType}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
    // Bounded so login, refresh and the refresh inside signOut() can't hang
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error_description || data.msg || "Login failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

// Access tokens last about an hour; the refresh token keeps the user signed in.
// One refresh at a time per context: Supabase rotates refresh tokens, so two parallel
// refreshes would race and the loser would sign the user out.
let refreshing = null;

function refreshSession() {
  refreshing ??= (async () => {
    const { refresh_token, user_email } = await getSession();
    if (!refresh_token) return null;
    try {
      const data = await requestToken("refresh_token", { refresh_token });
      // Logged out (or switched account) while this was in flight: don't write the old login back
      const stored = await getSession();
      if (stored.refresh_token !== refresh_token) {
        // Another context (popup or service worker) already refreshed the same account: use its
        // token. After a logout, or a different account signing in, return null instead.
        return stored.user_email === user_email ? (stored.access_token ?? null) : null;
      }
      await saveSession(data);
      return data.access_token;
    } catch (e) {
      // Only a rejected token (400/401) ends the session. Network errors, 429 and 5xx keep it
      // so the next attempt can succeed.
      if (e.status === 400 || e.status === 401) {
        await clearSession();
        return null;
      }
      throw e;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

// Sign out on the server too, so the stored refresh token can't be used again
async function signOut() {
  // Bounded, so a stalled request can't keep the user signed in locally
  const logout = (token) =>
    fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
  try {
    const { access_token } = await getSession();
    if (access_token) {
      const res = await logout(access_token);
      // An expired access token can't sign out (Supabase answers 401 or 403); refresh once and retry
      if (res.status === 401 || res.status === 403) {
        const fresh = await refreshSession();
        if (fresh) await logout(fresh);
      }
    }
  } catch {
    // Offline or timed out: the local session is still cleared below
  } finally {
    await clearSession();
  }
}

class UnauthorizedError extends Error {
  constructor() {
    super("Please log in again");
    this.status = 401;
  }
}

// Calls the Ritro API with the stored token. On a 401 it refreshes once and retries.
async function apiFetch(path, options = {}) {
  const send = (token) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

  const { access_token } = await getSession();
  if (!access_token) throw new UnauthorizedError();

  let res = await send(access_token);
  if (res.status === 401) {
    // Another context (popup or service worker) may have refreshed already: use its token
    const { access_token: current } = await getSession();
    const fresh = current && current !== access_token ? current : await refreshSession();
    if (!fresh) throw new UnauthorizedError();
    res = await send(fresh);
  }
  if (res.status === 401) {
    await clearSession();
    throw new UnauthorizedError();
  }
  return res;
}
