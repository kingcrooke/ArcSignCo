(function () {
  var config = window.NOVASTAGE_VERSION_CONFIG;
  if (!config) {
    return;
  }

  var volume = config.audioVolume || 0.4;
  var fadeMs = config.audioFadeMs || 900;
  var playing = false;
  var currentVersionId = null;
  var fadeTimer = null;

  var audioA = document.createElement("audio");
  var audioB = document.createElement("audio");
  audioA.preload = "none";
  audioB.preload = "none";
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

  function setFooterCredit(version) {
    var el = document.getElementById("music-credit-line");
    if (!el || !version || !version.audio) {
      return;
    }
    var a = version.audio;
    el.textContent =
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

  function togglePlay() {
    playing = !playing;
    var btn = document.getElementById("version-music-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      btn.textContent = playing ? "Pause music" : "Play music";
    }
    if (playing) {
      if (!active.src && currentVersionId) {
        loadVersion(currentVersionId, true);
      }
      active.play().catch(function () {});
      fadeTo(volume, active);
    } else {
      fadeTo(0, active, function () {
        active.pause();
      });
    }
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
  });
})();
