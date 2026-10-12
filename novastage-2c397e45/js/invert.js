(function () {
  var STORAGE_KEY = "novastage-invert";

  function label() {
    if (window.NOVASTAGE_t) {
      return window.NOVASTAGE_t("invert.label");
    }
    return "Invert colors";
  }

  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function writeStored(on) {
    try {
      if (on) {
        localStorage.setItem(STORAGE_KEY, "1");
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      /* ignore */
    }
  }

  function resolveInvert() {
    var on = readStored();
    var params = new URLSearchParams(window.location.search);
    if (params.get("invert") === "1") {
      on = true;
    }
    if (params.get("invert") === "0") {
      on = false;
    }
    return on;
  }

  function syncButton(on) {
    var btn = document.getElementById("version-invert-toggle");
    if (!btn) {
      return;
    }
    var text = label();
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.textContent = text;
    btn.setAttribute("aria-label", text);
  }

  function applyInvert(on, writeUrl) {
    if (!document.body) {
      return;
    }
    if (on) {
      document.body.setAttribute("data-invert", "1");
    } else {
      document.body.removeAttribute("data-invert");
    }
    writeStored(on);
    syncButton(on);
    if (writeUrl) {
      var url = new URL(window.location.href);
      if (on) {
        url.searchParams.set("invert", "1");
      } else {
        url.searchParams.delete("invert");
      }
      window.history.replaceState({}, "", url.toString());
    }
  }

  window.NOVASTAGE_refreshInvertLabel = function () {
    syncButton(document.body && document.body.getAttribute("data-invert") === "1");
  };

  window.NOVASTAGE_setInvert = applyInvert;

  function init() {
    applyInvert(resolveInvert(), false);
    var btn = document.getElementById("version-invert-toggle");
    if (!btn || btn.getAttribute("data-bound") === "1") {
      return;
    }
    btn.setAttribute("data-bound", "1");
    btn.addEventListener("click", function () {
      applyInvert(document.body.getAttribute("data-invert") !== "1", true);
    });
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
