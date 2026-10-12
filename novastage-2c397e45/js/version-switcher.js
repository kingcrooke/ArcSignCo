(function () {
  var config = window.NOVASTAGE_VERSION_CONFIG;
  var apply = window.NOVASTAGE_applyVersion;
  if (!config || !apply) {
    return;
  }

  var bar = document.getElementById("version-switcher");
  if (!bar) {
    return;
  }

  var musicBtn = document.createElement("button");
  musicBtn.type = "button";
  musicBtn.id = "version-music-toggle";
  musicBtn.className = "version-switcher__music";
  musicBtn.setAttribute("aria-pressed", "false");
  musicBtn.setAttribute(
    "aria-label",
    window.NOVASTAGE_t ? window.NOVASTAGE_t("music.play.aria") : "Play version music"
  );
  musicBtn.textContent = window.NOVASTAGE_t ? window.NOVASTAGE_t("music.play") : "Play music";
  musicBtn.addEventListener("click", function () {
    if (window.NOVASTAGE_audio) {
      window.NOVASTAGE_audio.togglePlay();
    }
  });
  bar.appendChild(musicBtn);

  var list = document.createElement("div");
  list.className = "version-switcher__tabs";
  list.setAttribute("role", "tablist");
  list.setAttribute(
    "aria-label",
    window.NOVASTAGE_t ? window.NOVASTAGE_t("version.list") : "Brand version preview"
  );

  function tabLabel(id) {
    if (window.NOVASTAGE_t) {
      return window.NOVASTAGE_t("version.tab", { n: id });
    }
    return "Version " + id;
  }

  function refreshVersionLabels() {
    list.setAttribute(
      "aria-label",
      window.NOVASTAGE_t ? window.NOVASTAGE_t("version.list") : "Brand version preview"
    );
    list.querySelectorAll(".version-switcher__tab").forEach(function (btn) {
      var label = tabLabel(btn.getAttribute("data-version"));
      btn.setAttribute("aria-label", label);
      var longLabel = btn.querySelector(".version-switcher__long");
      if (longLabel) {
        longLabel.textContent = label;
      }
    });
  }

  config.versions.forEach(function (version) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "version-switcher__tab";
    btn.setAttribute("role", "tab");
    btn.setAttribute("data-version", String(version.id));
    var label = tabLabel(version.id);
    btn.setAttribute("aria-label", label);
    var longLabel = document.createElement("span");
    longLabel.className = "version-switcher__long";
    longLabel.textContent = label;
    var shortLabel = document.createElement("span");
    shortLabel.className = "version-switcher__short";
    shortLabel.setAttribute("aria-hidden", "true");
    shortLabel.textContent = "V" + version.id;
    btn.appendChild(longLabel);
    btn.appendChild(shortLabel);
    btn.addEventListener("click", function () {
      apply(version.id, true);
    });
    list.appendChild(btn);
  });

  bar.appendChild(list);
  window.NOVASTAGE_refreshVersionLabels = refreshVersionLabels;
  apply(window.NOVASTAGE_getVersionId ? window.NOVASTAGE_getVersionId() : config.defaultVersion, false);
})();
