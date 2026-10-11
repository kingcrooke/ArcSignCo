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
  musicBtn.setAttribute("aria-label", "Play or pause version music");
  musicBtn.textContent = "Play music";
  musicBtn.addEventListener("click", function () {
    if (window.NOVASTAGE_audio) {
      window.NOVASTAGE_audio.togglePlay();
    }
  });
  bar.appendChild(musicBtn);

  var list = document.createElement("div");
  list.className = "version-switcher__tabs";
  list.setAttribute("role", "tablist");
  list.setAttribute("aria-label", "Brand version preview");

  config.versions.forEach(function (version) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "version-switcher__tab";
    btn.setAttribute("role", "tab");
    btn.setAttribute("data-version", String(version.id));
    btn.setAttribute("aria-label", version.tabLabel);
    var longLabel = document.createElement("span");
    longLabel.className = "version-switcher__long";
    longLabel.textContent = version.tabLabel;
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
  apply(window.NOVASTAGE_getVersionId ? window.NOVASTAGE_getVersionId() : config.defaultVersion, false);
})();
