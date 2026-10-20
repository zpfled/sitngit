(() => {
  if (window.sitAndGitAnalyticsInitialized) return;
  window.sitAndGitAnalyticsInitialized = true;
  const pagePath = window.location.pathname;

  function track(name, parameters = {}) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, { page_path: pagePath, ...parameters });
      }
    } catch { /* Analytics must never interrupt native navigation. */ }
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") ?? "";
    if (href.startsWith("tel:")) {
      track("click_to_call", { link_url: href.split("?")[0] });
    } else if (href.startsWith("sms:")) {
      track("click_to_text", { link_url: href.split("?")[0] });
    } else if (href.startsWith("mailto:")) {
      track("click_to_email", { link_url: href.split("?")[0] });
    } else if (link.getAttribute("data-pricing-cta")) {
      try {
        const url = new URL(href, window.location.href);
        if (url.protocol !== "https:") return;
        const parameters = {
          link_url: url.origin + url.pathname,
          cta_placement: link.getAttribute("data-pricing-cta")
        };
        const intent = link.getAttribute("data-rental-intent");
        if (intent === "event" || intent === "long-term") parameters.rental_intent = intent;
        track("pricing_cta_click", parameters);
      } catch { /* Ignore malformed links. */ }
    }
  });
})();
