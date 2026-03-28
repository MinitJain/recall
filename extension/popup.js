// ── CONFIG ──────────────────────────────────────────────────────────────────
// These are your public Supabase keys — safe to include here.
// Find them in your .env.local as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_URL = "https://gfdwrzaeofehgpwuulvr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PLZj21S_KtFVCz1-jiq5PQ_3WNyg3dQ";
const API_BASE = "https://recallsave.vercel.app";

// ── DOM REFS ─────────────────────────────────────────────────────────────────
const authView = document.getElementById("auth-view");
const mainView = document.getElementById("main-view");
const authError = document.getElementById("auth-error");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const togglePasswordBtn = document.getElementById("toggle-password");
const logoutBtn = document.getElementById("logout-btn");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");
const bookmarksList = document.getElementById("bookmarks-list");
const userEmailSpan = document.getElementById("user-email");

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
// chrome.storage.local uses callbacks, so we wrap in Promises for cleaner code.
function getSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["access_token", "user_email"], resolve);
  });
}

function saveSession(access_token, user_email) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ access_token, user_email }, resolve);
  });
}

function clearSession() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(["access_token", "user_email"], resolve);
  });
}

// ── SUPABASE AUTH ─────────────────────────────────────────────────────────────
// We call Supabase's REST API directly — no npm package needed.
// MERN equivalent: calling your Express /auth/login route with fetch.
async function login(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error_description || data.msg || "Login failed");
  return { access_token: data.access_token, user_email: data.user.email };
}

async function signup(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error_description || data.msg || "Signup failed");
  return data;
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────
function showAuthView() {
  authView.classList.remove("hidden");
  mainView.classList.add("hidden");
}

function showMainView(email) {
  authView.classList.add("hidden");
  mainView.classList.remove("hidden");
  userEmailSpan.textContent = email;
}

function showAuthError(msg) {
  authError.textContent = msg;
  authError.className = "error";
}

function showAuthSuccess(msg) {
  authError.textContent = msg;
  authError.className = "error";
  authError.style.cssText =
    "color:#4ade80;border-color:#166534;background:#052e16;display:block";
}

function hideAuthMessage() {
  authError.className = "error hidden";
  authError.style.cssText = "";
}

function showSaveStatus(msg, type = "") {
  saveStatus.textContent = msg;
  saveStatus.className = `status ${type}`;
  setTimeout(() => (saveStatus.className = "status hidden"), 3000);
}

// ── BOOKMARKS ─────────────────────────────────────────────────────────────────
async function loadBookmarks(access_token) {
  const res = await fetch(`${API_BASE}/api/bookmarks`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (res.status === 401) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!res.ok) throw new Error("Failed to load bookmarks");
  return res.json();
}

async function saveBookmark(url, access_token) {
  const res = await fetch(`${API_BASE}/api/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to save");
  }
  return res.json();
}

async function deleteBookmark(id, access_token) {
  const res = await fetch(`${API_BASE}/api/bookmarks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (res.status !== 204 && !res.ok) throw new Error("Failed to delete");
}

function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
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

function renderBookmarks(bookmarks) {
  if (bookmarks.length === 0) {
    bookmarksList.innerHTML = '<p class="empty-state">No bookmarks yet.</p>';
    return;
  }
  bookmarksList.innerHTML = bookmarks
    .map((b) => {
      let hostname = "";
      try {
        hostname = new URL(b.url).hostname;
      } catch {
        hostname = b.url;
      }
      return `
    <div class="bookmark-item" data-id="${escapeHtml(b.id)}">
      <div class="bookmark-info">
        <a href="${isSafeUrl(b.url) ? escapeHtml(b.url) : "#"}" target="_blank" rel="noopener noreferrer" class="bookmark-title">
          ${escapeHtml(b.title || b.url)}
        </a>
        <span class="bookmark-url">${escapeHtml(hostname)}</span>
      </div>
      <button class="delete-btn" data-id="${escapeHtml(b.id)}">×</button>
    </div>`;
    })
    .join("");

  bookmarksList.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const { access_token } = await getSession();
      try {
        await deleteBookmark(btn.dataset.id, access_token);
        btn.closest(".bookmark-item").remove();
        if (bookmarksList.children.length === 0) {
          bookmarksList.innerHTML =
            '<p class="empty-state">No bookmarks yet.</p>';
        }
      } catch (e) {
        console.error(e);
      }
    });
  });
}

// ── INIT ──────────────────────────────────────────────────────────────────────
// Runs when the popup opens. Checks if we already have a stored session.
async function init() {
  const { access_token, user_email } = await getSession();
  if (access_token) {
    showMainView(user_email);
    try {
      const bookmarks = await loadBookmarks(access_token);
      renderBookmarks(bookmarks);
    } catch (e) {
      if (e.status === 401) {
        // Token expired — force re-login
        await clearSession();
        showAuthView();
      }
      // Network errors / server errors: stay logged in, show empty list
    }
  } else {
    showAuthView();
  }
}

// ── EVENT LISTENERS ───────────────────────────────────────────────────────────
loginBtn.addEventListener("click", async () => {
  hideAuthMessage();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) return showAuthError("Email and password required");

  loginBtn.textContent = "Logging in...";
  loginBtn.disabled = true;
  try {
    const { access_token, user_email } = await login(email, password);
    await saveSession(access_token, user_email);
    showMainView(user_email);
    const bookmarks = await loadBookmarks(access_token);
    renderBookmarks(bookmarks);
  } catch (e) {
    showAuthError(e.message);
  } finally {
    loginBtn.textContent = "Log in";
    loginBtn.disabled = false;
  }
});

signupBtn.addEventListener("click", async () => {
  hideAuthMessage();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) return showAuthError("Email and password required");

  signupBtn.textContent = "Signing up...";
  signupBtn.disabled = true;
  try {
    await signup(email, password);
    showAuthSuccess("Check your email to confirm your account.");
  } catch (e) {
    showAuthError(e.message);
  } finally {
    signupBtn.textContent = "Sign up";
    signupBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  await clearSession();
  showAuthView();
});

saveBtn.addEventListener("click", async () => {
  const { access_token } = await getSession();
  saveBtn.textContent = "Saving...";
  saveBtn.disabled = true;
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const data = await saveBookmark(tab.url, access_token);
    if (data.aiTagsFailed) {
      showSaveStatus("Saved — add tags manually", "success");
    } else {
      showSaveStatus("Saved!", "success");
    }
    const bookmarks = await loadBookmarks(access_token);
    renderBookmarks(bookmarks);
  } catch (e) {
    showSaveStatus(e.message, "error-text");
  } finally {
    saveBtn.textContent = "Save this page";
    saveBtn.disabled = false;
  }
});

togglePasswordBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
});

init();
