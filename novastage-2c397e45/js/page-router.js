(function () {
  var HOME_ID = "view-home";
  var PORTFOLIO_ID = "view-portfolio";
  var VALID_PAGES = { home: true, portfolio: true };

  function currentParams() {
    return new URLSearchParams(window.location.search);
  }

  function resolvePage() {
    var page = currentParams().get("page");
    if (page === "portfolio") {
      return "portfolio";
    }
    return "home";
  }

  function buildUrl(page, hash) {
    var url = new URL(window.location.href);
    if (page === "home") {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", page);
    }
    if (hash) {
      url.hash = hash;
    } else if (!hash && page === "home" && url.hash && url.hash.indexOf("portfolio") !== -1) {
      url.hash = "";
    }
    return url;
  }

  function setActivePage(page, replaceState) {
    if (!VALID_PAGES[page]) {
      page = "home";
    }
    document.body.setAttribute("data-active-page", page);

    var homeEl = document.getElementById(HOME_ID);
    var portfolioEl = document.getElementById(PORTFOLIO_ID);
    if (homeEl) {
      homeEl.hidden = page !== "home";
    }
    if (portfolioEl) {
      portfolioEl.hidden = page !== "portfolio";
    }

    document.querySelectorAll("[data-nav-page]").forEach(function (link) {
      var target = link.getAttribute("data-nav-page");
      var active = target === page;
      link.classList.toggle("nav-link--active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (window.NOVASTAGE_setPortfolioMeta) {
      window.NOVASTAGE_setPortfolioMeta(page);
    }

    if (replaceState) {
      var url = buildUrl(page, page === "portfolio" ? window.location.hash : "");
      if (page === "home" && window.location.hash) {
        url.hash = window.location.hash;
      }
      window.history.replaceState({ page: page }, "", url.toString());
    }

    if (page === "portfolio" && window.location.hash) {
      window.requestAnimationFrame(function () {
        var target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }
        window.scrollTo(0, 0);
      });
    } else {
      window.scrollTo(0, 0);
    }
    if (window.NOVASTAGE_refreshReveal) {
      window.NOVASTAGE_refreshReveal();
    }
  }

  function onNavClick(event) {
    var link = event.target.closest("[data-page-link]");
    if (!link) {
      return;
    }
    var page = link.getAttribute("data-page-link");
    if (!VALID_PAGES[page]) {
      return;
    }
    var hash = link.getAttribute("data-page-hash");
    event.preventDefault();
    var url = buildUrl(page, hash || "");
    window.history.pushState({ page: page }, "", url.toString());
    setActivePage(page, false);
    if (hash) {
      var target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setActivePage(resolvePage(), true);

    document.addEventListener("click", onNavClick);

    window.addEventListener("popstate", function () {
      setActivePage(resolvePage(), false);
    });
  });

  window.NOVASTAGE_activePage = resolvePage;
  window.NOVASTAGE_setActivePage = setActivePage;
})();
