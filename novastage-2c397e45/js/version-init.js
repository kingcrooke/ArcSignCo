(function () {
  var config = window.NOVASTAGE_VERSION_CONFIG;
  if (!config) {
    return;
  }

  function paletteToVersion(letter) {
    var map = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    return map[letter] || config.defaultVersion;
  }

  function resolveVersionId() {
    var params = new URLSearchParams(window.location.search);
    var vParam = params.get("v");
    if (vParam) {
      var n = parseInt(vParam, 10);
      if (n >= 1 && n <= 5) {
        return n;
      }
    }
    var paletteParam = params.get("palette");
    if (paletteParam && /^[a-e]$/.test(paletteParam.toLowerCase())) {
      return paletteToVersion(paletteParam.toLowerCase());
    }
    try {
      var stored = localStorage.getItem(config.storageKey);
      if (stored) {
        var s = parseInt(stored, 10);
        if (s >= 1 && s <= 5) {
          return s;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return config.defaultVersion;
  }

  function findVersion(id) {
    return config.versions.find(function (v) {
      return v.id === id;
    });
  }

  function applyVersion(id, persist) {
    var version = findVersion(id) || findVersion(config.defaultVersion);
    var body = document.body;
    if (!body) {
      return version;
    }
    body.setAttribute("data-version", String(version.id));
    body.setAttribute("data-palette", version.palette);
    body.setAttribute("data-wordmark-font", version.wordmarkFont);
    body.setAttribute("data-lockup-emphasis", version.lockupEmphasis);
    body.classList.add("has-version-switcher");

    if (persist) {
      try {
        localStorage.setItem(config.storageKey, String(version.id));
      } catch (e) {
        /* ignore */
      }
      var url = new URL(window.location.href);
      url.searchParams.set("v", String(version.id));
      url.searchParams.delete("palette");
      window.history.replaceState({}, "", url.toString());
    }

    document.querySelectorAll(".version-switcher__tab").forEach(function (btn) {
      var active = btn.getAttribute("data-version") === String(version.id);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (window.NOVASTAGE_audio) {
      window.NOVASTAGE_audio.onVersionChange(version.id);
    }

    return version;
  }

  var initialId = resolveVersionId();
  window.NOVASTAGE_applyVersion = applyVersion;
  window.NOVASTAGE_getVersionId = function () {
    return parseInt(document.body.getAttribute("data-version") || String(initialId), 10);
  };

  if (document.body) {
    applyVersion(initialId, false);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      applyVersion(resolveVersionId(), false);
    });
  }
})();
