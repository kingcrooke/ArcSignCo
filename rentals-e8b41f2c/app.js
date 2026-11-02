(function () {
  var lang = "es";
  var galleryAt = {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var MOTIFS = {
    living: '<rect x="90" y="470" width="420" height="130"/><path d="M150 470v-70h300v70"/><rect x="760" y="180" width="280" height="340"/><path d="M760 260h280M760 340h280"/>',
    sitting: '<rect x="140" y="430" width="200" height="160"/><rect x="420" y="450" width="180" height="140"/><path d="M180 430v-90M300 430v-90M460 450v-70"/>',
    loft: '<path d="M80 160h1040M80 210h1040M80 260h1040"/><rect x="280" y="400" width="640" height="180"/><path d="M280 470h640"/>',
    bedroom: '<rect x="300" y="390" width="560" height="190"/><path d="M300 460h560"/><rect x="860" y="200" width="180" height="280"/>',
    stair: '<ellipse cx="600" cy="420" rx="220" ry="80"/><ellipse cx="600" cy="420" rx="150" ry="52"/><ellipse cx="600" cy="420" rx="80" ry="26"/><circle cx="600" cy="420" r="10" fill="#1c1917" stroke="none"/>',
    terrace: '<path d="M80 470h1040"/><path d="M120 470v120M240 470v120M360 470v120M480 470v120M600 470v120M720 470v120M840 470v120M960 470v120M1080 470v120"/><path d="M80 200h1040"/>',
    kitchen: '<path d="M120 260h520v300H120z"/><path d="M640 360h420v200H640z"/><circle cx="300" cy="390" r="28"/><circle cx="420" cy="390" r="28"/>',
    mezz: '<rect x="180" y="360" width="720" height="40"/><path d="M240 400v140M840 400v140"/><rect x="470" y="230" width="220" height="130"/>',
    laundry: '<rect x="360" y="250" width="420" height="360"/><circle cx="570" cy="430" r="90"/><circle cx="570" cy="430" r="30"/>',
    video: '<circle cx="600" cy="400" r="120"/><path d="M560 340l140 60-140 60z" fill="#1c1917" stroke="none"/>',
    emptyA: '<rect x="700" y="160" width="300" height="400"/><path d="M700 280h300M700 400h300"/>',
    emptyB: '<rect x="470" y="180" width="260" height="460"/><circle cx="680" cy="420" r="8" fill="#1c1917" stroke="none"/>',
    block: '<rect x="360" y="160" width="480" height="500"/><path d="M360 280h480M360 400h480M360 520h480"/>',
    grid: '<path d="M80 200h1040M80 360h1040M80 520h1040M220 80v640M520 80v640M820 80v640"/>'
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function t(key, vars) {
    var pack = window.I18N[lang] || window.I18N.es;
    var text = pack[key];
    if (text == null) text = window.I18N.es[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.split("{" + name + "}").join(String(vars[name]));
      });
    }
    return text;
  }

  function tr(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.es || "";
  }

  function locale() {
    return lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "es-DO";
  }

  function placeholderSvg(motif, label) {
    return (
      '<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(label) + '">' +
      '<rect width="1200" height="800" fill="#e4dfd6"/>' +
      '<g fill="none" stroke="#1c1917" stroke-width="3">' + (MOTIFS[motif] || MOTIFS.emptyA) + "</g>" +
      '<text x="48" y="78" fill="#1c1917" font-family="Schibsted Grotesk, sans-serif" font-size="32" font-weight="700" letter-spacing="5">PLACEHOLDER</text>' +
      "</svg>"
    );
  }

  function statusClass(listing) {
    return listing.status === "occupied" ? "badge-occupied" : "badge-available";
  }

  function statusLabel(listing) {
    return listing.status === "occupied" ? t("statusOccupied") : t("statusAvailable");
  }

  function addressLines(listing) {
    var a = listing.address;
    return [
      a.street,
      a.building,
      a.area + ", " + a.city,
      a.district + ", " + tr(a.country)
    ];
  }

  function mapSrc(query, zoom) {
    var hl = lang === "en" ? "en" : lang === "fr" ? "fr" : "es";
    return "https://maps.google.com/maps?q=" + encodeURIComponent(query) + "&hl=" + hl + "&z=" + zoom + "&output=embed";
  }

  function mapsLink(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function streetLink(listing) {
    if (listing.geo) {
      return "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + listing.geo.lat + "," + listing.geo.lng;
    }
    return mapsLink(listing.mapQuery) + "&layer=c";
  }

  function infoMailto(listing) {
    var subject = t("mailSubject") + " — " + tr(listing.name);
    var body = [
      tr(listing.name),
      addressLines(listing).join(", "),
      t("aptLabel") + " " + listing.aptNumber,
      "",
      t("mailBody")
    ].join("\r\n");
    return "mailto:" + window.RENTALS.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function diagram(listing) {
    if (listing.diagram === "levels") {
      return (
        '<div class="levels">' +
        level(t("levelTerrace")) +
        level(t("levelLoft")) +
        '<p class="stair-label">' + esc(t("levelStair")) + "</p>" +
        level(t("levelFourth")) +
        '<p class="meta">' + esc(t("diagramNote")) + "</p></div>"
      );
    }
    if (listing.diagram === "d2") {
      return (
        '<div class="levels">' +
        level(t("d2Roof")) +
        level(t("d2Mezz")) +
        level(t("d2Main")) +
        '<p class="meta">' + esc(t("diagramNote")) + "</p></div>"
      );
    }
    return "";
  }

  function level(text) {
    return '<p class="level"><strong>' + esc(text) + "</strong></p>";
  }

  function listHtml(items) {
    if (!items || !items.length) return "";
    return "<ul class=\"fit-list\">" + items.map(function (item) {
      return "<li>" + esc(tr(item)) + "</li>";
    }).join("") + "</ul>";
  }

  function applyStatic() {
    var htmlLang = lang === "en" ? "en" : lang === "fr" ? "fr" : "es";
    document.documentElement.lang = htmlLang;
    document.title = t("metaTitle");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("metaDescription"));
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (button) {
      var code = button.getAttribute("data-set-lang");
      button.setAttribute("aria-pressed", code === lang ? "true" : "false");
      button.setAttribute("aria-label", code === "es" ? "Español" : code === "fr" ? "Français" : "English");
    });
    var toggle = document.querySelector(".nav-toggle");
    if (toggle) {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.textContent = open ? t("menuClose") : t("menu");
    }
  }

  function renderHero() {
    var listing = window.RENTALS.listings[0];
    var link = document.getElementById("hero-media");
    var caption = tr(listing.name);
    link.href = "#listing-" + listing.id;
    link.setAttribute("aria-label", caption + " PLACEHOLDER");
    link.innerHTML =
      placeholderSvg(listing.media[0].motif, caption) +
      '<span class="hero-badge badge ' + statusClass(listing) + '">' + esc(statusLabel(listing)) + "</span>" +
      '<span class="hero-caption"><span>' + esc(caption) + '</span><span>PLACEHOLDER</span></span>';
  }

  function renderIndex() {
    var rows = window.RENTALS.listings.map(function (listing, index) {
      var n = String(index + 1).padStart(2, "0");
      return (
        "<tr>" +
        "<td>" + n + "</td>" +
        '<td><a href="#listing-' + listing.id + '">' + esc(tr(listing.name)) + "</a></td>" +
        "<td>" + esc(tr(listing.layoutShort)) + "</td>" +
        "<td><span class=\"badge " + statusClass(listing) + "\">" + esc(statusLabel(listing)) + "</span>" +
        (listing.comingSoon ? " <span class=\"soon\">" + esc(t("comingSoon")) + "</span>" : "") +
        "</td>" +
        "<td>" + esc(tr(listing.addressShort)) + "</td>" +
        "</tr>"
      );
    }).join("");
    document.getElementById("listing-index").innerHTML =
      '<table class="index"><thead><tr>' +
      "<th>#</th><th>" + esc(t("colApt")) + "</th><th>" + esc(t("colLayout")) + "</th><th>" + esc(t("colStatus")) + "</th><th>" + esc(t("colAddress")) + "</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table>";
  }

  function renderSheets() {
    document.getElementById("listing-sheets").innerHTML = window.RENTALS.listings.map(function (listing, index) {
      var at = galleryAt[listing.id] || 0;
      var slide = listing.media[at];
      var label = tr(slide.caption);
      var n = String(index + 1).padStart(2, "0");
      var thumbs = listing.media.map(function (item, i) {
        return '<li><button type="button" data-go="' + i + '" aria-current="' + (i === at ? "true" : "false") + '" aria-label="' + esc(tr(item.caption)) + '">' +
          placeholderSvg(item.motif, tr(item.caption)) + "</button></li>";
      }).join("");
      var amenities = listing.amenities.length
        ? "<h3>" + esc(t("amenTitle")) + "</h3><ul class=\"amenities\">" + listing.amenities.map(function (item) {
          return "<li>" + esc(tr(item)) + "</li>";
        }).join("") + "</ul>"
        : "";
      return (
        '<article class="listing" id="listing-' + listing.id + '">' +
        '<header class="listing-head"><p class="kicker">' + n + "</p><h3>" + esc(tr(listing.name)) + "</h3>" +
        '<div class="badges">' +
        (listing.comingSoon ? '<p class="soon">' + esc(t("comingSoon")) + "</p>" : "") +
        '<p class="badge ' + statusClass(listing) + '" data-status="' + esc(listing.status) + '">' + esc(statusLabel(listing)) + "</p>" +
        "</div></header>" +
        "<p class=\"summary\">" + esc(tr(listing.summary)) + "</p>" +
        (listing.comingSoon ? "<p>" + esc(t("notOffer")) + "</p>" : "") +
        '<div class="gallery" data-gallery="' + listing.id + '" tabindex="0">' +
        '<div class="stage">' +
        '<button type="button" class="stage-open" data-open="1" aria-label="' + esc(t("galleryOpen")) + " " + esc(label) + '">' +
        (slide.kind === "video" && slide.src
          ? '<video controls src="' + esc(slide.src) + '"></video>'
          : placeholderSvg(slide.motif, label)) +
        "</button>" +
        '<button type="button" class="g-nav prev" data-dir="-1" aria-label="' + esc(t("galleryPrev")) + '">‹</button>' +
        '<button type="button" class="g-nav next" data-dir="1" aria-label="' + esc(t("galleryNext")) + '">›</button>' +
        '<p class="g-count">' + esc(t("count", { n: at + 1, m: listing.media.length })) + "</p>" +
        "</div>" +
        '<ul class="thumbs">' + thumbs + "</ul>" +
        '<p class="caption">' + esc(label) + " · PLACEHOLDER</p>" +
        (slide.kind === "video" && !slide.src ? '<p class="video-note">' + esc(t("videoMissing")) + "</p>" : "") +
        "</div>" +
        '<div class="listing-grid"><div class="prose">' +
        "<p>" + esc(tr(listing.description)) + "</p>" +
        "<h3>" + esc(t("layoutTitle")) + "</h3><p>" + esc(tr(listing.layout)) + "</p>" +
        diagram(listing) +
        (tr(listing.stay) ? "<h3>" + esc(t("stayTitle")) + "</h3><p>" + esc(tr(listing.stay)) + "</p>" : "") +
        (listing.fitFor.length ? "<h3>" + esc(t("fitTitle")) + "</h3>" + listHtml(listing.fitFor) : "") +
        (listing.notFor.length ? "<h3>" + esc(t("notTitle")) + "</h3>" + listHtml(listing.notFor) : "") +
        "<h3>" + esc(t("petTitle")) + "</h3><p>" + esc(tr(listing.pet)) + "</p>" +
        amenities +
        "</div><aside class=\"facts\">" +
        "<h3>" + esc(t("addressTitle")) + "</h3>" +
        "<p class=\"address\">" + addressLines(listing).map(esc).join("<br>") + "</p>" +
        "<p><strong>" + esc(t("aptLabel")) + " " + esc(listing.aptNumber) + "</strong></p>" +
        "<p>" + esc(tr(listing.floorNote)) + "</p>" +
        '<div class="map-frame"><iframe title="' + esc(tr(listing.name)) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + esc(mapSrc(listing.mapQuery, listing.mapZoom || 16)) + '"></iframe></div>' +
        "<p class=\"meta\">" + esc(tr(listing.mapNote)) + "</p>" +
        '<p class="map-links"><a href="' + esc(mapsLink(listing.mapQuery)) + '" target="_blank" rel="noopener noreferrer">' + esc(t("openMaps")) + "</a>" +
        '<a href="' + esc(streetLink(listing)) + '" target="_blank" rel="noopener noreferrer">' + esc(t("openStreet")) + "</a></p>" +
        '<p class="meta">' + esc(t("mapFallback")) + "</p>" +
        '<p class="rate-note">' + esc(t("rateNote")) + "</p>" +
        '<div class="listing-actions"><a class="button" href="' + esc(infoMailto(listing)) + '">' + esc(t("moreInfo")) + "</a>" +
        '<button type="button" class="button button-ghost" data-select-apt="' + listing.id + '">' + esc(t("useForm")) + "</button></div>" +
        "</aside></div></article>"
      );
    }).join("");
  }

  function renderRules() {
    document.getElementById("rules-from-listings").innerHTML = window.RENTALS.listings.map(function (listing) {
      var stay = tr(listing.stay);
      return (
        '<section class="rule-block"><h3>' + esc(tr(listing.name)) + "</h3>" +
        (listing.comingSoon ? "<p>" + esc(t("notOffer")) + "</p>" : "") +
        "<p><strong>" + esc(t("stayTitle")) + ".</strong> " + esc(stay || t("stayUnpublished")) + "</p>" +
        (listing.fitFor.length ? "<p><strong>" + esc(t("fitTitle")) + ".</strong></p>" + listHtml(listing.fitFor) : "") +
        (listing.notFor.length ? "<p><strong>" + esc(t("notTitle")) + ".</strong></p>" + listHtml(listing.notFor) : "") +
        "<p><strong>" + esc(t("petTitle")) + ".</strong> " + esc(tr(listing.pet)) + "</p></section>"
      );
    }).join("");
  }

  function renderArea() {
    var query = window.RENTALS.building.query;
    document.getElementById("area-map").innerHTML =
      '<div class="map-frame"><iframe title="' + esc(t("areaMapLabel")) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' +
      esc(mapSrc(query, 15)) + '"></iframe></div>' +
      '<p class="map-links"><a href="' + esc(mapsLink(query)) + '" target="_blank" rel="noopener noreferrer">' + esc(t("openMaps")) + "</a>" +
      '<a href="' + esc(streetLink({ geo: window.RENTALS.building, mapQuery: query })) + '" target="_blank" rel="noopener noreferrer">' + esc(t("openStreet")) + "</a></p>" +
      '<p class="meta">' + esc(t("mapFallback")) + "</p>";
  }

  function weekdayName(dayIndex) {
    var base = new Date(2026, 10, 2);
    var diff = (dayIndex - base.getDay() + 7) % 7;
    var date = new Date(base);
    date.setDate(base.getDate() + diff);
    return new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(date);
  }

  function renderViewingSummary() {
    var view = window.RENTALS.viewing;
    var days = view.weekdays.map(weekdayName).join(", ");
    document.getElementById("viewing-summary").textContent = t("viewingSummary", {
      days: days,
      times: view.times.join(", ")
    });
  }

  function upcomingDays() {
    var view = window.RENTALS.viewing;
    var wanted = view.weekdays;
    var limit = view.daysToShow || 3;
    var now = new Date();
    var found = [];
    var i;
    for (i = 0; i < 28 && found.length < limit; i += 1) {
      var date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (wanted.indexOf(date.getDay()) === -1) continue;
      var times = view.times.filter(function (time) {
        if (i > 0) return true;
        var parts = time.split(":");
        var when = new Date(now);
        when.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
        return when.getTime() > now.getTime() + 60 * 60 * 1000;
      });
      if (!times.length) continue;
      found.push({ date: date, times: times });
    }
    return found;
  }

  function isoDate(date) {
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + m + "-" + d;
  }

  function renderSlots() {
    var selected = "";
    var current = document.querySelector('input[name="slot"]:checked');
    if (current) selected = current.value;
    var html = '<div class="days">' + upcomingDays().map(function (day) {
      var legend = new Intl.DateTimeFormat(locale(), { weekday: "long", day: "numeric", month: "long" }).format(day.date);
      var radios = day.times.map(function (time) {
        var value = isoDate(day.date) + "|" + time;
        return '<label class="choice"><input type="radio" name="slot" value="' + esc(value) + '"' +
          (value === selected ? " checked" : "") + "> <span>" + esc(time) + "</span></label>";
      }).join("");
      return "<fieldset class=\"day\"><legend>" + esc(legend) + "</legend>" + radios + "</fieldset>";
    }).join("") + "</div>";
    document.getElementById("slot-list").innerHTML = html;
  }

  function fillApartments() {
    var select = document.getElementById("in-apt");
    var current = select.value;
    var options = '<option value="">' + esc(t("selectApt")) + "</option>" + window.RENTALS.listings.map(function (listing) {
      var suffix = listing.comingSoon ? " — " + t("comingSoon") : "";
      return '<option value="' + esc(listing.id) + '">' + esc(tr(listing.name) + suffix) + "</option>";
    }).join("");
    select.innerHTML = options;
    if (current) select.value = current;
  }

  function syncVisitMode() {
    var mode = document.querySelector('input[name="visit-mode"]:checked').value;
    document.getElementById("slot-list").hidden = mode !== "slot";
    document.getElementById("own-time").hidden = mode !== "own";
  }

  function listingById(id) {
    return window.RENTALS.listings.filter(function (item) { return item.id === id; })[0];
  }

  function clearErrors() {
    document.getElementById("form-errors").innerHTML = "";
    document.querySelectorAll(".field.is-invalid").forEach(function (field) {
      field.classList.remove("is-invalid");
    });
  }

  function mark(id) {
    var el = document.getElementById(id);
    if (el && el.closest) {
      var field = el.closest(".field");
      if (field) field.classList.add("is-invalid");
    }
  }

  function validate(form) {
    var errors = [];
    var name = form.name.value.trim();
    var country = form.country.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var apt = form.apartment.value;
    var arrive = form.arrival.value;
    var depart = form.departure.value;
    var mode = form["visit-mode"].value;
    if (name.length < 2) { errors.push(t("formNeedName")); mark("in-name"); }
    if (country.length < 2) { errors.push(t("formNeedCountry")); mark("in-country"); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.push(t("formNeedEmail")); mark("in-email"); }
    if (phone.replace(/\D/g, "").length < 6) { errors.push(t("formNeedPhone")); mark("in-phone"); }
    if (!apt) { errors.push(t("formNeedApt")); mark("in-apt"); }
    if (!arrive) { errors.push(t("formNeedArrive")); mark("in-arrive"); }
    if (!depart) { errors.push(t("formNeedDepart")); mark("in-depart"); }
    if (arrive && depart && depart <= arrive) { errors.push(t("formNeedOrder")); mark("in-depart"); }
    if (mode === "slot" && !form.slot.value) errors.push(t("formNeedSlot"));
    if (mode === "own" && (!form["own-date"].value || !form["own-time"].value)) {
      errors.push(t("formNeedOwn"));
      mark("own-date");
    }
    return errors;
  }

  function composeMail(form) {
    var listing = listingById(form.apartment.value);
    var mode = form["visit-mode"].value;
    var visit = t("noVisit");
    if (mode === "slot") visit = t("slotWord") + ": " + form.slot.value.replace("|", " ");
    if (mode === "own") visit = t("proposed") + ": " + form["own-date"].value + " " + form["own-time"].value;
    var hold = form.hold.checked;
    var subjectBase = hold ? t("mailHoldSubject") : (mode === "none" ? t("mailSubject") : t("mailVisitSubject"));
    var subject = subjectBase + " — " + tr(listing.name);
    var body = [
      tr(listing.name),
      addressLines(listing).join(", "),
      t("aptLabel") + " " + listing.aptNumber,
      "",
      t("labelName") + ": " + form.name.value.trim(),
      t("labelCountry") + ": " + form.country.value.trim(),
      t("labelEmail") + ": " + form.email.value.trim(),
      t("labelPhone") + ": " + form.phone.value.trim(),
      t("labelArrive") + ": " + form.arrival.value,
      t("labelDepart") + ": " + form.departure.value,
      t("visitLegend") + ": " + visit,
      (hold ? t("holdYes") : t("holdWordNo")),
      t("labelNote") + ": " + form.note.value.trim(),
      "",
      t("mailBody"),
      "Language: " + lang
    ].join("\r\n");
    return { subject: subject, body: body };
  }

  function render() {
    applyStatic();
    renderHero();
    renderIndex();
    renderSheets();
    renderRules();
    renderArea();
    renderViewingSummary();
    fillApartments();
    renderSlots();
    syncVisitMode();
    ["contact-email", "footer-email"].forEach(function (id) {
      var link = document.getElementById(id);
      link.href = "mailto:" + window.RENTALS.email;
      link.textContent = window.RENTALS.email;
    });
  }

  function setLang(next) {
    if (!window.I18N[next]) return;
    lang = next;
    try { localStorage.setItem("rentals-e8b41f2c-lang", next); } catch (err) { /* ignore */ }
    render();
  }

  document.addEventListener("click", function (event) {
    var langButton = event.target.closest("[data-set-lang]");
    if (langButton) {
      setLang(langButton.getAttribute("data-set-lang"));
      return;
    }
    var toggle = event.target.closest(".nav-toggle");
    if (toggle) {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.getElementById("site-nav").classList.toggle("is-open", open);
      toggle.textContent = open ? t("menuClose") : t("menu");
      return;
    }
    if (event.target.closest("#site-nav a")) {
      var navToggle = document.querySelector(".nav-toggle");
      navToggle.setAttribute("aria-expanded", "false");
      document.getElementById("site-nav").classList.remove("is-open");
      navToggle.textContent = t("menu");
    }
    var selectApt = event.target.closest("[data-select-apt]");
    if (selectApt) {
      document.getElementById("in-apt").value = selectApt.getAttribute("data-select-apt");
      document.getElementById("contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      document.getElementById("in-name").focus();
      return;
    }
    var gallery = event.target.closest("[data-gallery]");
    if (!gallery) return;
    var id = gallery.getAttribute("data-gallery");
    var listing = listingById(id);
    var dir = event.target.closest("[data-dir]");
    var go = event.target.closest("[data-go]");
    var open = event.target.closest("[data-open]");
    if (dir) {
      var step = Number(dir.getAttribute("data-dir"));
      galleryAt[id] = (galleryAt[id] || 0) + step;
      if (galleryAt[id] < 0) galleryAt[id] = listing.media.length - 1;
      if (galleryAt[id] >= listing.media.length) galleryAt[id] = 0;
      renderSheets();
      var next = document.querySelector('[data-gallery="' + id + '"] [data-dir="' + step + '"]');
      if (next) next.focus();
    } else if (go) {
      galleryAt[id] = Number(go.getAttribute("data-go"));
      renderSheets();
    } else if (open) {
      var slide = listing.media[galleryAt[id] || 0];
      document.getElementById("lightbox-caption").textContent = tr(slide.caption) + " · PLACEHOLDER";
      document.getElementById("lightbox-stage").innerHTML = placeholderSvg(slide.motif, tr(slide.caption));
      document.getElementById("lightbox").showModal();
    }
  });

  document.getElementById("listing-sheets").addEventListener("keydown", function (event) {
    var gallery = event.target.closest("[data-gallery]");
    if (!gallery) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    var id = gallery.getAttribute("data-gallery");
    var listing = listingById(id);
    galleryAt[id] = (galleryAt[id] || 0) + (event.key === "ArrowRight" ? 1 : -1);
    if (galleryAt[id] < 0) galleryAt[id] = listing.media.length - 1;
    if (galleryAt[id] >= listing.media.length) galleryAt[id] = 0;
    renderSheets();
    var fresh = document.querySelector('[data-gallery="' + id + '"]');
    if (fresh) fresh.focus();
  });

  document.getElementById("lightbox-close").addEventListener("click", function () {
    document.getElementById("lightbox").close();
  });
  document.getElementById("lightbox").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });

  document.getElementById("inquiry-form").addEventListener("change", syncVisitMode);

  document.getElementById("inquiry-form").addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    var errors = validate(event.currentTarget);
    if (errors.length) {
      document.getElementById("form-errors").innerHTML = "<ul>" + errors.map(function (item) {
        return "<li>" + esc(item) + "</li>";
      }).join("") + "</ul>";
      var first = document.querySelector(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea");
      if (first) first.focus();
      return;
    }
    var mail = composeMail(event.currentTarget);
    var success = document.getElementById("form-success");
    document.getElementById("success-text").value = mail.subject + "\n\n" + mail.body;
    success.hidden = false;
    window.location.href = "mailto:" + window.RENTALS.email + "?subject=" + encodeURIComponent(mail.subject) + "&body=" + encodeURIComponent(mail.body);
  });

  document.getElementById("copy-mail").addEventListener("click", function () {
    var text = document.getElementById("success-text").value;
    var button = document.getElementById("copy-mail");
    function done() { button.textContent = t("copied"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        document.getElementById("success-text").select();
      });
    } else {
      document.getElementById("success-text").select();
    }
  });

  document.getElementById("hold-jump").addEventListener("click", function () {
    document.getElementById("want-hold").checked = true;
    document.getElementById("contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    document.getElementById("in-name").focus();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var toggle = document.querySelector(".nav-toggle");
    if (toggle.getAttribute("aria-expanded") === "true") {
      toggle.setAttribute("aria-expanded", "false");
      document.getElementById("site-nav").classList.remove("is-open");
      toggle.textContent = t("menu");
    }
  });

  var params = new URLSearchParams(location.search);
  var fromQuery = params.get("lang");
  var stored = "";
  try { stored = localStorage.getItem("rentals-e8b41f2c-lang") || ""; } catch (err) { stored = ""; }
  if (window.I18N[fromQuery]) lang = fromQuery;
  else if (window.I18N[stored]) lang = stored;

  var today = isoDate(new Date());
  document.getElementById("in-arrive").min = today;
  document.getElementById("in-depart").min = today;
  document.getElementById("own-date").min = today;

  render();
})();
