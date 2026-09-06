(() => {
  if (window.sitAndGitAnalyticsInitialized) return;
  window.sitAndGitAnalyticsInitialized = true;
  const leadKey = "sitandgit:quote-submitted";
  const leadLifetime = 10 * 60 * 1000;
  const pagePath = window.location.pathname;
  let formStarted = false;

  function track(name, parameters = {}) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, { page_path: pagePath, ...parameters });
      }
    } catch { /* Analytics must never interrupt navigation or form submission. */ }
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href.startsWith("tel:")) {
      track("click_to_call", { link_url: href });
    } else if (href.startsWith("mailto:")) {
      // Exclude email subject/body query parameters from analytics.
      track("click_to_email", { link_url: href.split("?")[0] });
    } else {
      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin && url.pathname.replace(/\/+$/, "") === "/get-a-quote") {
          track("quote_cta_click", { link_url: url.origin + url.pathname, link_text: link.textContent.trim() });
        }
      } catch { /* Ignore malformed links. */ }
    }
  });

  function startForm(event) {
    const field = event.target;
    if (formStarted || !field.matches?.("input, select, textarea") ||
        field.form?.getAttribute("name") !== "quote" || field.disabled || field.readOnly ||
        ["hidden", "submit", "button", "reset"].includes(field.type) ||
        ["bot-field", "form-name", "g-recaptcha-response", "cf-turnstile-response"].includes(field.name)) return;
    formStarted = true;
    track("form_start", { form_name: "quote" });
  }
  for (const type of ["focusin", "input", "change"]) document.addEventListener(type, startForm);

  document.addEventListener("submit", (event) => {
    if (event.target.getAttribute("name") !== "quote" || event.defaultPrevented) return;
    try {
      window.sessionStorage.setItem(leadKey, String(Date.now()));
    } catch { /* Storage may be unavailable; keep native Netlify submission. */ }
  });

  if (pagePath.replace(/\/+$/, "") === "/thank-you") {
    try {
      const submitted = Number(window.sessionStorage.getItem(leadKey));
      window.sessionStorage.removeItem(leadKey);
      const elapsed = Date.now() - submitted;
      if (submitted > 0 && elapsed >= 0 && elapsed <= leadLifetime) {
        track("generate_lead", { form_name: "quote" });
      }
    } catch { /* Direct visits and unavailable storage do not count as leads. */ }
  }
})();
