/**
 * Starts a file download from a link the API signed (`Content-Disposition: attachment`) without leaving the page.
 * Not `window.open`: browsers block popups opened after an async wait (like polling for a PDF), and a pre-opened tab
 * is left blank. A plain link click is allowed.
 */
export function startDownload(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
