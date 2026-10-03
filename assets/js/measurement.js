(function () {
  var cfg = window.__ARC_MEASUREMENT__ || {};
  var opts = window.__ARC_HEAD_OPTS__ || {};

  if (opts.verification) {
    if (cfg.googleSiteVerification) {
      var g = document.createElement("meta");
      g.name = "google-site-verification";
      g.content = cfg.googleSiteVerification;
      document.head.appendChild(g);
    }
    if (cfg.bingSiteVerification) {
      var b = document.createElement("meta");
      b.name = "msvalidate.01";
      b.content = cfg.bingSiteVerification;
      document.head.appendChild(b);
    }
  }

  var GA4_ID = cfg.ga4Id || "";
  if (!/^G-[A-Z0-9]+$/.test(GA4_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID);
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID);
  document.head.appendChild(s);
})();
