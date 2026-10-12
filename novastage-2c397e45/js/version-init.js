(function () {
  var config = window.NOVASTAGE_VERSION_CONFIG;
  if (!config) {
    return;
  }

  function paletteToVersion(letter) {
    var map = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    return map[letter] || config.defaultVersion;
  }

  function findVersion(id) {
    return config.versions.find(function (v) {
      return v.id === id;
    });
  }

  function isEnabled(id) {
    var version = findVersion(id);
    return !!(version && version.enabled !== false);
  }

  function resolveVersionId() {
    var params = new URLSearchParams(window.location.search);
    var vParam = params.get("v");
    if (vParam) {
      var n = parseInt(vParam, 10);
      if (isEnabled(n)) {
        return n;
      }
      return config.defaultVersion;
    }
    var paletteParam = params.get("palette");
    if (paletteParam && /^[a-e]$/.test(paletteParam.toLowerCase())) {
      var mapped = paletteToVersion(paletteParam.toLowerCase());
      if (isEnabled(mapped)) {
        return mapped;
      }
      return config.defaultVersion;
    }
    try {
      var stored = localStorage.getItem(config.storageKey);
      if (stored) {
        var s = parseInt(stored, 10);
        if (isEnabled(s)) {
          return s;
        }
        localStorage.setItem(config.storageKey, String(config.defaultVersion));
      }
    } catch (e) {
      /* ignore */
    }
    return config.defaultVersion;
  }

  function rewriteRetiredVersion() {
    var url = new URL(window.location.href);
    var vParam = url.searchParams.get("v");
    var paletteParam = url.searchParams.get("palette");
    var retired = false;
    if (vParam && !isEnabled(parseInt(vParam, 10))) {
      retired = true;
    }
    if (!vParam && paletteParam && /^[a-e]$/.test(paletteParam.toLowerCase())) {
      if (!isEnabled(paletteToVersion(paletteParam.toLowerCase()))) {
        retired = true;
      }
    }
    if (!retired) {
      return;
    }
    url.searchParams.set("v", String(config.defaultVersion));
    url.searchParams.delete("palette");
    window.history.replaceState({}, "", url.toString());
  }

  function applyVersion(id, persist) {
    var version = findVersion(id);
    if (!version || version.enabled === false) {
      version = findVersion(config.defaultVersion);
    }
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
    rewriteRetiredVersion();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      applyVersion(resolveVersionId(), false);
      rewriteRetiredVersion();
    });
  }
})();
