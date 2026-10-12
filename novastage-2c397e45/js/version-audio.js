(function () {
  var config = window.NOVASTAGE_VERSION_CONFIG;
  if (!config) {
    return;
  }

  var volume = config.audioVolume || 0.4;
  var fadeMs = config.audioFadeMs || 900;
  var pauseKey = "novastage-music-paused";
  var playing = false;
  var currentVersionId = null;
  var fadeTimer = null;
  var gestureArmed = false;

  var audioA = document.createElement("audio");
  var audioB = document.createElement("audio");
  audioA.preload = "auto";
  audioB.preload = "auto";
  audioA.loop = true;
  audioB.loop = true;
  audioA.volume = 0;
  audioB.volume = 0;

  var active = audioA;
  var inactive = audioB;

  function findVersion(id) {
    return config.versions.find(function (v) {
      return v.id === id;
    });
  }

  function pickSrc(audioMeta) {
    var a = document.createElement("audio");
    if (a.canPlayType('audio/mpeg; codecs="mp3"') && audioMeta.mp3) {
      return audioMeta.mp3;
    }
    return audioMeta.ogg || audioMeta.mp3;
  }

  function userPaused() {
    try {
      return localStorage.getItem(pauseKey) === "1";
    } catch (e) {
      return false;
    }
  }

  function setUserPaused(paused) {
    try {
      if (paused) {
        localStorage.setItem(pauseKey, "1");
      } else {
        localStorage.removeItem(pauseKey);
      }
    } catch (e) {
      /* ignore */
    }
  }

  function tr(key, vars) {
    if (window.NOVASTAGE_t) {
      return window.NOVASTAGE_t(key, vars);
    }
    return "";
  }

  function syncButton() {
    var btn = document.getElementById("version-music-toggle");
    if (!btn) {
      return;
    }
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
    var playLabel = tr("music.play") || "Play music";
    var pauseLabel = tr("music.pause") || "Pause music";
    var playAria = tr("music.play.aria") || "Play version music";
    var pauseAria = tr("music.pause.aria") || "Pause version music";
    btn.textContent = playing ? pauseLabel : playLabel;
    btn.setAttribute("aria-label", playing ? pauseAria : playAria);
  }

  function setFooterCredit(version) {
    var el = document.getElementById("music-credit-line");
    if (!el || !version || !version.audio) {
      return;
    }
    var a = version.audio;
    var piece = tr("music.piece." + version.id) || a.piece;
    var performer = tr("music.performer." + version.id) || a.performer;
    var license = tr("music.license." + version.id) || a.license;
    var line = tr("music.credit", {
      version: version.id,
      piece: piece,
      composer: a.composer,
      performer: performer,
      license: license,
    });
    el.textContent =
      line ||
      "Music (Version " +
        version.id +
        "): " +
        a.piece +
        " — " +
        a.composer +
        " · " +
        a.performer +
        " · " +
        a.license;
  }

  function syncLabels() {
    syncButton();
    if (currentVersionId) {
      setFooterCredit(findVersion(currentVersionId));
    }
  }

  function fadeTo(targetVol, el, done) {
    window.clearInterval(fadeTimer);
    var start = el.volume;
    var steps = Math.max(8, Math.floor(fadeMs / 40));
    var step = 0;
    fadeTimer = window.setInterval(function () {
      step += 1;
      var t = step / steps;
      el.volume = start + (targetVol - start) * t;
      if (step >= steps) {
        window.clearInterval(fadeTimer);
        el.volume = targetVol;
        if (done) {
          done();
        }
      }
    }, fadeMs / steps);
  }

  function crossfadeTo(versionId) {
    var version = findVersion(versionId);
    if (!version || !version.audio) {
      return;
    }
    var src = pickSrc(version.audio);
    inactive.src = src;
    inactive.currentTime = 0;
    inactive.volume = 0;
    setFooterCredit(version);
    currentVersionId = versionId;

    inactive.play().catch(function () {});

    fadeTo(0, active, function () {
      active.pause();
      var tmp = active;
      active = inactive;
      inactive = tmp;
      fadeTo(volume, active);
    });
  }

  function loadVersion(versionId, autoplay) {
    var version = findVersion(versionId);
    if (!version || !version.audio) {
      return;
    }
    currentVersionId = versionId;
    setFooterCredit(version);
    active.src = pickSrc(version.audio);
    active.currentTime = 0;
    active.volume = playing && autoplay ? volume : 0;
    if (playing && autoplay) {
      active.play().catch(function () {});
    }
  }

  function markPlaying() {
    playing = true;
    setUserPaused(false);
    syncButton();
  }

  function markStopped(remember) {
    playing = false;
    if (remember) {
      setUserPaused(true);
    }
    syncButton();
  }

  function attemptPlay() {
    if (!active.src && currentVersionId) {
      loadVersion(currentVersionId, false);
    }
    window.clearInterval(fadeTimer);
    active.volume = volume;
    var promise = active.play();
    var settled =
      promise && typeof promise.then === "function"
        ? promise.then(
            function () {
              return true;
            },
            function () {
              return false;
            }
          )
        : Promise.resolve(true);
    return settled.then(function (ok) {
      if (ok) {
        markPlaying();
        active.volume = volume;
      } else {
        playing = false;
        try {
          active.pause();
        } catch (e) {
          /* ignore */
        }
        syncButton();
      }
      return ok;
    });
  }

  function pausePlayback() {
    markStopped(true);
    fadeTo(0, active, function () {
      active.pause();
    });
  }

  function togglePlay() {
    if (playing) {
      pausePlayback();
      return;
    }
    disarmGesture();
    attemptPlay();
  }

  function onFirstGesture(event) {
    var target = event.target;
    if (target && target.closest && target.closest("#version-music-toggle")) {
      disarmGesture();
      return;
    }
    disarmGesture();
    window.setTimeout(function () {
      if (userPaused() || playing) {
        return;
      }
      attemptPlay();
    }, 0);
  }

  function disarmGesture() {
    if (!gestureArmed) {
      return;
    }
    gestureArmed = false;
    ["scroll", "wheel", "touchstart", "pointerdown", "keydown"].forEach(function (name) {
      window.removeEventListener(name, onFirstGesture, true);
      document.removeEventListener(name, onFirstGesture, true);
    });
  }

  function armGesture() {
    if (gestureArmed || userPaused()) {
      return;
    }
    gestureArmed = true;
    ["scroll", "wheel", "touchstart", "pointerdown", "keydown"].forEach(function (name) {
      window.addEventListener(name, onFirstGesture, true);
      document.addEventListener(name, onFirstGesture, true);
    });
  }

  function onVersionChange(versionId) {
    if (playing) {
      crossfadeTo(versionId);
    } else {
      loadVersion(versionId, false);
    }
  }

  window.NOVASTAGE_audio = {
    togglePlay: togglePlay,
    onVersionChange: onVersionChange,
    syncLabels: syncLabels,
    isPlaying: function () {
      return playing;
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var initial =
      window.NOVASTAGE_getVersionId && window.NOVASTAGE_getVersionId()
        ? window.NOVASTAGE_getVersionId()
        : config.defaultVersion;
    loadVersion(initial, false);
    syncButton();
    if (userPaused()) {
      return;
    }
    attemptPlay().then(function (ok) {
      if (!ok) {
        armGesture();
      }
    });
  });
})();
