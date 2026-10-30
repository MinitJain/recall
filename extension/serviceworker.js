importScripts("auth.js");

function flashBadge(tabId, text, color, ms) {
  if (tabId === undefined) return;
  chrome.action.setBadgeText({ text, tabId }).catch(() => {});
  chrome.action.setBadgeBackgroundColor({ color, tabId }).catch(() => {});
  setTimeout(() => chrome.action.setBadgeText({ text: "", tabId }).catch(() => {}), ms);
}

// Alt+Shift+S: save the current tab without opening the popup
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "save-bookmark") return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const protocol = new URL(tab.url).protocol;
  if (protocol !== "http:" && protocol !== "https:") return;

  const tabId = typeof tab.id === "number" ? tab.id : undefined;

  try {
    const res = await apiFetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: tab.url }),
    });
    if (res.ok) flashBadge(tabId, "✓", "#F59E0B", 2000);
    else flashBadge(tabId, "✖", "#EF4444", 3000);
  } catch (e) {
    // Not logged in, or the session couldn't be refreshed: open the popup so they can sign in
    if (e.status === 401) chrome.action.openPopup().catch(() => {});
    else flashBadge(tabId, "✖", "#EF4444", 3000);
  }
});
