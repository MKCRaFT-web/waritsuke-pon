// GA4計測設定: デプロイ前にこのIDを差し替えてください。
const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";

(function initAnalytics() {
  const isConfigured = /^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID) && GA4_MEASUREMENT_ID !== "G-XXXXXXXXXX";

  window.WaritsukeAnalytics = {
    measurementId: GA4_MEASUREMENT_ID,
    isEnabled: isConfigured,
    trackEvent(eventName, params = {}) {
      if (!isConfigured || typeof window.gtag !== "function") return;
      window.gtag("event", eventName, params);
    }
  };

  if (!isConfigured) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA4_MEASUREMENT_ID);
})();
