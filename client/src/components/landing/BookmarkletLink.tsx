// React refuses to render javascript: hrefs, so the draggable bookmarklet is injected as
// static, server-generated HTML. Nothing in it comes from user input.
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ritro.vercel.app";

const html = `<a href="javascript:(function(){location.href='${appUrl}/bookmarklet?url='+encodeURIComponent(location.href)})();" draggable="true" title="Drag this to your bookmarks bar" class="bookmarklet-link">Save to Ritro</a>`;

export default function BookmarkletLink() {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
