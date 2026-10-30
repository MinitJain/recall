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

// POST to Supabase's token endpoint (password login or refresh)
async function requestToken(grantType, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=${grantType}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Login failed");
  return data;
}

// Access tokens last about an hour; the refresh token keeps the user signed in.
async function refreshSession() {
  const { refresh_token } = await getSession();
  if (!refresh_token) return null;
  try {
    const data = await requestToken("refresh_token", { refresh_token });
    await saveSession(data);
    return data.access_token;
  } catch {
    await clearSession();
    return null;
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
    const fresh = await refreshSession();
    if (!fresh) throw new UnauthorizedError();
    res = await send(fresh);
  }
  if (res.status === 401) {
    await clearSession();
    throw new UnauthorizedError();
  }
  return res;
}
