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
    chrome.action.openPopup();
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

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
      chrome.action.setBadgeText({ text: "✓", tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: "#F59E0B", tabId: tab.id });
      setTimeout(() => chrome.action.setBadgeText({ text: "", tabId: tab.id }), 2000);
    } else if (res.status === 401) {
      chrome.action.openPopup();
    }
  } catch {
    // Network error — silently fail, badge stays clean
  }
});
