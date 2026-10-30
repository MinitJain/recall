// Config, session storage and apiFetch live in auth.js, loaded before this file.

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

// ── SUPABASE AUTH ─────────────────────────────────────────────────────────────
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
async function loadBookmarks() {
  const res = await apiFetch("/api/bookmarks");
  if (!res.ok) throw new Error("Failed to load bookmarks");
  return res.json();
}

async function saveBookmark(url) {
  const res = await apiFetch("/api/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to save");
  }
  return res.json();
}

async function deleteBookmark(id) {
  const res = await apiFetch(`/api/bookmarks/${id}`, { method: "DELETE" });
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
      try {
        await deleteBookmark(btn.dataset.id);
        btn.closest(".bookmark-item").remove();
        if (bookmarksList.children.length === 0) {
          bookmarksList.innerHTML =
            '<p class="empty-state">No bookmarks yet.</p>';
        }
      } catch (e) {
        if (e.status === 401) return showAuthView();
        console.error(e);
      }
    });
  });
}

// ── INIT ──────────────────────────────────────────────────────────────────────
// Runs when the popup opens. Checks if we already have a stored session.
async function init() {
  const { access_token, user_email } = await getSession();
  if (!access_token) return showAuthView();

  showMainView(user_email);
  try {
    renderBookmarks(await loadBookmarks());
  } catch (e) {
    // apiFetch already tried a refresh; a 401 here means the session is gone
    if (e.status === 401) showAuthView();
    // Network or server errors: stay logged in, show an empty list
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
    const session = await requestToken("password", { email, password });
    await saveSession(session);
    showMainView(session.user.email);
    renderBookmarks(await loadBookmarks());
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
  saveBtn.textContent = "Saving...";
  saveBtn.disabled = true;
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await saveBookmark(tab.url);
    showSaveStatus("Saved!", "success");
    renderBookmarks(await loadBookmarks());
  } catch (e) {
    if (e.status === 401) return showAuthView();
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
