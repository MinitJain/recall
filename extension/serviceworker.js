const SUPABASE_URL = "https://gfdwrzaeofehgpwuulvr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PLZj21S_KtFVCz1-jiq5PQ_3WNyg3dQ";
const API_BASE = "https://recallsave.vercel.app";

function getSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["access_token", "user_email"], resolve);
  });
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "save-bookmark") return;

  const { access_token } = await getSession();
  if (!access_token) {
    // Not logged in — open the popup so they can sign in
    chrome.action.openPopup().catch(() => {});
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const protocol = new URL(tab.url).protocol;
  if (protocol !== "http:" && protocol !== "https:") return;

  const tabId = typeof tab.id === "number" ? tab.id : undefined;

  try {
    const res = await fetch(`${API_BASE}/api/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ url: tab.url }),
    });

    if (res.ok) {
      if (tabId !== undefined) {
        chrome.action.setBadgeText({ text: "✓", tabId }).catch(() => {});
        chrome.action.setBadgeBackgroundColor({ color: "#F59E0B", tabId }).catch(() => {});
        setTimeout(() => chrome.action.setBadgeText({ text: "", tabId }).catch(() => {}), 2000);
      }
    } else if (res.status === 401) {
      chrome.action.openPopup().catch(() => {});
    }
  } catch {
    // Network error — silently fail, badge stays clean
  }
});
