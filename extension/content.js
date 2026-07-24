// ── GUARD ────────────────────────────────────────────────────────────────────
// Only run in the top-level frame — skip iframes embedded in pages.
if (window !== window.top) {
  // eslint-disable-next-line no-throw-literal
  throw null; // Stops script execution cleanly without logging an error
}

// ── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = "https://recallsave.vercel.app";
const BAR_HEIGHT = 36; // px — matches browser bookmark bar height
const CACHE_TTL_MS = 60_000; // ticker is decorative, not critical path — 60s staleness is fine

// ── STORAGE ──────────────────────────────────────────────────────────────────
function getSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["access_token"], resolve);
  });
}

function getCache() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["bookmarks_cache", "bookmarks_cache_at"], resolve);
  });
}

function setCache(bookmarks) {
  return new Promise((resolve) => {
    chrome.storage.local.set(
      { bookmarks_cache: bookmarks, bookmarks_cache_at: Date.now() },
      resolve
    );
  });
}

// A 401 means the access token is dead — clear it everywhere so the popup
// shows the login view too, instead of the ticker silently going dark forever.
function clearExpiredSession() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(
      ["access_token", "user_email", "bookmarks_cache", "bookmarks_cache_at"],
      resolve
    );
  });
}

// ── SECURITY ─────────────────────────────────────────────────────────────────
function isSafeUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── BAR CREATION ─────────────────────────────────────────────────────────────
// Shadow DOM isolates the bar's styles from the host page completely.
// The host page's CSS cannot affect our bar; our CSS cannot affect the page.
function createBar() {
  const host = document.createElement("div");
  host.id = "__recall_ticker_host__";
  host.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "right:0",
    `height:${BAR_HEIGHT}px`,
    "z-index:2147483647", // max possible z-index
    "pointer-events:auto",
  ].join(";");

  const shadow = host.attachShadow({ mode: "closed" });

  shadow.innerHTML = `
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      #bar {
        display: flex;
        align-items: center;
        height: ${BAR_HEIGHT}px;
        background: #111111;
        border-bottom: 1px solid #1f1f1f;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      #track-wrap {
        flex: 1;
        overflow: hidden;
        height: 100%;
        display: flex;
        align-items: center;
      }

      #track {
        display: flex;
        list-style: none;
        height: 100%;
        align-items: center;
        white-space: nowrap;
      }

      #track.scrolling {
        animation: ticker 35s linear infinite;
        will-change: transform;
      }

      #track.scrolling:hover {
        animation-play-state: paused;
      }

      @keyframes ticker {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .tick-item {
        display: flex;
        align-items: center;
        height: 100%;
        flex-shrink: 0;
      }

      .tick-item a {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 14px;
        height: 100%;
        font-size: 12px;
        color: #aaaaaa;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        transition: color 0.1s;
      }

      .tick-item a:hover {
        color: #F0A500;
      }

      .tick-item img {
        width: 14px;
        height: 14px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .tick-item::after {
        content: "·";
        color: #2a2a2a;
        flex-shrink: 0;
        font-size: 14px;
      }

      #dismiss {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        margin-right: 4px;
        background: transparent;
        border: none;
        color: #444;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: color 0.1s, background 0.1s;
      }

      #dismiss:hover {
        color: #ededed;
        background: #1f1f1f;
      }

      @media (prefers-reduced-motion: reduce) {
        #track.scrolling {
          animation: none;
          overflow-x: auto;
        }
      }

      /* Pause on keyboard focus too, not just mouse hover — a Tab-only user
         needs the scrolling to stop before they can read the focused link. */
      #track.scrolling:focus-within {
        animation-play-state: paused;
      }
    </style>

    <div id="bar">
      <div id="track-wrap">
        <ul id="track" aria-label="Your saved bookmarks" role="list"></ul>
      </div>
      <button id="dismiss" aria-label="Dismiss Recall bar" title="Dismiss">×</button>
    </div>
  `;

  return { host, shadow };
}

// ── TICKER RENDER ─────────────────────────────────────────────────────────────
function renderTicker(shadow, bookmarks) {
  const track = shadow.getElementById("track");

  // Duplicate array so the -50% translate creates a seamless loop.
  // With very few bookmarks, the strip would be too short — multiply further.
  const copies = bookmarks.length < 5
    ? Math.ceil(10 / bookmarks.length) * 2
    : 2;
  const items = Array.from({ length: copies }, () => bookmarks).flat();

  track.innerHTML = items
    .map((b) => {
      let domain = "";
      try {
        domain = new URL(b.url).hostname;
      } catch {
        // unparseable url — domain stays empty, no favicon shown
      }

      const safeUrl = isSafeUrl(b.url) ? b.url : "#";
      const label = escapeHtml(b.title || domain || b.url);
      const favicon = domain
        ? `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=16" alt="" width="14" height="14" />`
        : "";

      return `<li class="tick-item">
        <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">
          ${favicon}
          <span>${label}</span>
        </a>
      </li>`;
    })
    .join("");

  track.classList.add("scrolling");
}

// ── INIT ──────────────────────────────────────────────────────────────────────
// Tracks the currently-mounted bar so the storage listener below can add/remove
// it in response to login/logout happening in another tab, without a refresh.
let mountedHost = null;

async function loadBookmarksViaCache(access_token) {
  const { bookmarks_cache, bookmarks_cache_at } = await getCache();
  if (
    Array.isArray(bookmarks_cache) &&
    typeof bookmarks_cache_at === "number" &&
    Date.now() - bookmarks_cache_at < CACHE_TTL_MS
  ) {
    return bookmarks_cache;
  }

  const res = await fetch(`${API_BASE}/api/bookmarks`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (res.status === 401) {
    await clearExpiredSession();
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!res.ok) throw new Error("Failed to load bookmarks");

  const bookmarks = await res.json();
  if (!Array.isArray(bookmarks)) throw new Error("Unexpected response shape");

  await setCache(bookmarks);
  return bookmarks;
}

async function init() {
  const { access_token } = await getSession();

  // Not logged in — inject nothing. User shouldn't see the bar until they log in.
  if (!access_token) return;

  // Mount the bar immediately so there's no visible delay while fetching.
  const { host, shadow } = createBar();
  document.documentElement.appendChild(host);
  mountedHost = host;

  // Dismiss button — removes bar for this page visit only.
  shadow.getElementById("dismiss").addEventListener("click", () => {
    host.remove();
    mountedHost = null;
  });

  try {
    const bookmarks = await loadBookmarksViaCache(access_token);

    if (bookmarks.length === 0) {
      host.remove();
      mountedHost = null;
      return;
    }

    renderTicker(shadow, bookmarks);
  } catch {
    // 401, network error, or CSP block — silently remove the bar either way.
    host.remove();
    mountedHost = null;
  }
}

// React to login/logout happening in the popup while this page is already
// open, instead of requiring a refresh for the bar to appear or disappear.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !("access_token" in changes)) return;

  const nowLoggedIn = Boolean(changes.access_token.newValue);
  if (nowLoggedIn && !mountedHost) {
    init();
  } else if (!nowLoggedIn && mountedHost) {
    mountedHost.remove();
    mountedHost = null;
  }
});

init();
