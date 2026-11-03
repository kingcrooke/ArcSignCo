(function () {
  var lang = "es";
  var galleryAt = {};
  var lb = { items: [], index: 0, galleryId: "" };
  var lbScroll = 0;
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

  function isUnavailable(listing) {
    return listing.status === "unavailable" || listing.status === "occupied";
  }

  function statusClass(listing) {
    if (listing.status === "soon") return "badge-soon";
    return isUnavailable(listing) ? "badge-occupied" : "badge-available";
  }

  function statusLabel(listing) {
    if (listing.status === "soon") return t("statusSoon");
    return isUnavailable(listing) ? t("statusOccupied") : t("statusAvailable");
  }

  function mediaHtml(item, label) {
    if (item && item.kind === "video" && item.src) {
      return '<video class="tour-video" controls muted playsinline preload="none" poster="' + esc(item.poster || "") + '" src="' + esc(item.src) + '" aria-label="' + esc(label) + '"></video>';
    }
    if (item && item.src) {
      return '<img src="' + esc(item.src) + '" alt="' + esc(label) + '">';
    }
    if (item && item.kind === "pattern") {
      return '<div class="pattern-placeholder" role="img" aria-label="' + esc(label) + '"><span>' + esc(label) + "</span></div>";
    }
    return placeholderSvg(item && item.motif, label);
  }

  function thumbHtml(item, label) {
    if (item && item.kind === "video" && item.poster) return '<img src="' + esc(item.poster) + '" alt="' + esc(label) + '">';
    return mediaHtml(item, label);
  }

  function addressLines(listing) {
    var a = listing.address;
    if (!a) return [];
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
    if (listing.levelLabels && listing.levelLabels.length) {
      return '<div class="levels">' + listing.levelLabels.map(function (label) {
        return level(tr(label));
      }).join("") + "</div>";
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
    var badge = document.getElementById("hero-badge");
    if (!badge) return;
    badge.className = "badge " + statusClass(listing);
    badge.textContent = statusLabel(listing);
  }

  function renderIndex() {
    var rows = window.RENTALS.listings.map(function (listing, index) {
      var n = String(index + 1).padStart(2, "0");
      return (
        "<tr>" +
        "<td>" + n + "</td>" +
        '<td><a href="#listing-' + listing.id + '">' + esc(tr(listing.name)) + "</a></td>" +
        "<td>" + esc(tr(listing.layoutShort)) + "</td>" +
        "<td><span class=\"badge " + statusClass(listing) + "\">" + esc(statusLabel(listing)) + "</span></td>" +
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
          thumbHtml(item, tr(item.caption)) + "</button></li>";
      }).join("");
      var amenities = listing.amenities.length
        ? "<h3>" + esc(t("amenTitle")) + "</h3><ul class=\"amenities\">" + listing.amenities.map(function (item) {
          return "<li>" + esc(tr(item)) + "</li>";
        }).join("") + "</ul>"
        : "";
      var stageInner = mediaHtml(slide, label);
      if (slide.src && slide.kind !== "video" && slide.kind !== "pattern") {
        stageInner = '<button type="button" class="stage-open" data-open="1" aria-label="' + esc(t("galleryOpen")) + " " + esc(label) + '">' + stageInner + "</button>";
      }
      var todo = listing.media.filter(function (item) { return item.todo; }).map(function (item) {
        return "<!-- TODO: " + String(item.todo).replace(/[^-.\w]/g, "") + " -->";
      }).join("");
      var actions = '<div class="listing-actions">' +
        (listing.status === "available" ? '<a class="button" href="#hold">' + esc(t("holdButton")) + "</a>" : "") +
        '<a class="button' + (listing.status === "available" ? " button-ghost" : "") + '" href="' + esc(infoMailto(listing)) + '">' + esc(t("moreInfo")) + "</a>" +
        '<button type="button" class="button button-ghost" data-select-apt="' + listing.id + '">' + esc(t("useForm")) + "</button></div>";
      var facts = "";
      if (listing.address && !listing.hideLocation) {
        facts = "<aside class=\"facts\">" +
          "<h3>" + esc(t("addressTitle")) + "</h3>" +
          "<p class=\"address\">" + addressLines(listing).map(esc).join("<br>") + "</p>" +
          "<p><strong>" + esc(t("aptLabel")) + " " + esc(listing.aptNumber) + "</strong></p>" +
          '<div class="map-frame"><iframe title="' + esc(tr(listing.name)) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' + esc(mapSrc(listing.mapQuery, listing.mapZoom || 16)) + '"></iframe></div>' +
          "<p class=\"meta\">" + esc(tr(listing.mapNote)) + "</p>" +
          '<p class="map-links"><a href="' + esc(mapsLink(listing.mapQuery)) + '" target="_blank" rel="noopener noreferrer">' + esc(t("openMaps")) + "</a>" +
          '<a href="' + esc(streetLink(listing)) + '" target="_blank" rel="noopener noreferrer">' + esc(t("openStreet")) + "</a></p>" +
          '<p class="meta">' + esc(t("mapFallback")) + "</p>" +
          actions +
          "</aside>";
      }
      return (
        '<article class="listing" id="listing-' + listing.id + '">' +
        '<header class="listing-head"><p class="kicker">' + n + "</p><h3>" + esc(tr(listing.name)) + "</h3>" +
        '<div class="badges">' +
        '<p class="badge ' + statusClass(listing) + '" data-status="' + esc(listing.status) + '">' + esc(statusLabel(listing)) + "</p>" +
        "</div></header>" +
        (tr(listing.floorChip) ? '<p class="floor-chip">' + esc(tr(listing.floorChip)) + "</p>" : "") +
        (tr(listing.blockNote) ? '<p class="block-note">' + esc(tr(listing.blockNote)) + "</p>" : "") +
        "<p class=\"summary\">" + esc(tr(listing.summary)) + "</p>" +
        '<div class="gallery" data-gallery="' + listing.id + '" tabindex="0">' +
        todo +
        '<div class="stage' + (slide.kind === "video" ? " is-portrait" : "") + (slide.kind === "pattern" ? " is-pattern" : "") + '">' +
        stageInner +
        '<button type="button" class="g-nav prev" data-dir="-1" aria-label="' + esc(t("galleryPrev")) + '">‹</button>' +
        '<button type="button" class="g-nav next" data-dir="1" aria-label="' + esc(t("galleryNext")) + '">›</button>' +
        '<p class="g-count">' + esc(t("count", { n: at + 1, m: listing.media.length })) + "</p>" +
        "</div>" +
        '<ul class="thumbs">' + thumbs + "</ul>" +
        '<p class="caption">' + esc(label) + "</p>" +
        '<p class="meta photo-note">' + esc(tr(listing.photoNote) || t("photoNote")) + "</p>" +
        "</div>" +
        calendarBlock(listing) +
        '<div class="listing-grid"><div class="prose">' +
        (tr(listing.description) ? "<p>" + esc(tr(listing.description)) + "</p>" : "") +
        (tr(listing.kitchen) ? "<p class=\"kitchen-line\">" + esc(tr(listing.kitchen)) + "</p>" : "") +
        (tr(listing.layout) ? "<h3>" + esc(t("layoutTitle")) + "</h3><p>" + esc(tr(listing.layout)) + "</p>" : "") +
        diagram(listing) +
        amenities +
        (facts ? "" : actions) +
        "</div>" + facts + "</div></article>"
      );
    }).join("");
  }

  function renderRules() {
    document.getElementById("rules-from-listings").innerHTML = "<p>" + esc(t("rulesBody")) + "</p>";
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
      var suffix = listing.status === "soon" ? " — " + t("futureInterest") : "";
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
    if (!arrive) { errors.push(t("formNeedArrive")); }
    if (!depart) { errors.push(t("formNeedDepart")); }
    if (arrive && depart && depart <= arrive) errors.push(t("formNeedOrder"));
    if (arrive && depart && depart > arrive) {
      var listing = listingById(apt);
      if (listing && (rangeHitsBlock(listing, arrive, depart) || isBlocked(listing, arrive))) errors.push(t("formNeedOpen"));
      if (stayParts(arrive, depart).tooLong) errors.push(t("formNeedYear"));
    }
    if (form.access && !form.access.checked) errors.push(t("formNeedAccess"));
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
      formatStay(form.arrival.value, form.departure.value),
      t("visitLegend") + ": " + visit,
      (hold ? t("holdYes") : t("holdWordNo")),
      "Advertencia confirmada: Sí",
      "acepta_advertencias: sí",
      t("confirmStamp") + ": " + confirmStamp(),
      t("labelNote") + ": " + form.note.value.trim(),
      "",
      t("mailBody"),
      "Language: " + lang
    ].join("\r\n");
    return { subject: subject, body: body };
  }

  var calMonth = {};
  var formPick = { start: "", end: "" };

  function todayIso() {
    return isoDate(new Date());
  }

  function blockedRanges(listing) {
    return (listing && listing.blocked) || [];
  }

  function isBlocked(listing, iso) {
    return blockedRanges(listing).some(function (range) {
      return iso >= range.start && iso <= range.end;
    });
  }

  function rangeHitsBlock(listing, start, end) {
    var a = start < end ? start : end;
    var b = start < end ? end : start;
    var cursor = parseIso(a);
    var last = parseIso(b);
    while (cursor < last) {
      if (isBlocked(listing, isoDate(cursor))) return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  }

  function parseIso(iso) {
    var parts = iso.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function stayParts(start, end) {
    var a = parseIso(start);
    var b = parseIso(end);
    var months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
    var days = b.getDate() - a.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    }
    var nights = Math.round((b.getTime() - a.getTime()) / 86400000);
    return { months: months, days: days, nights: nights, tooLong: months > 11 };
  }

  function formatStay(start, end) {
    if (!start || !end || end <= start) return "";
    var parts = stayParts(start, end);
    var monthText = parts.months === 1 ? t("stayMonth") : parts.months > 1 ? t("stayMonths", { n: parts.months }) : "";
    var dayText = parts.days === 1 ? t("stayDay") : parts.days > 1 ? t("stayDays", { n: parts.days }) : "";
    var length = monthText && dayText ? t("stayJoin", { months: monthText, days: dayText }) : (monthText || dayText);
    var nights = parts.nights === 1 ? t("stayNight") : t("stayNights", { n: parts.nights });
    return t("stayLength") + ": " + length + " · " + nights;
  }

  function monthKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
  }

  function cursorDate(id) {
    if (!calMonth[id]) {
      var listing = listingById(id === "form" ? document.getElementById("in-apt").value : id);
      var seed = listing && listing.blocked && listing.blocked[0] ? listing.blocked[0].start : todayIso();
      calMonth[id] = seed.slice(0, 7);
    }
    return parseIso(calMonth[id] + "-01");
  }

  function shiftMonth(id, step) {
    var date = cursorDate(id);
    date.setMonth(date.getMonth() + step);
    calMonth[id] = monthKey(date);
  }

  function weekHeads() {
    return ["weekMon", "weekTue", "weekWed", "weekThu", "weekFri", "weekSat", "weekSun"].map(function (key) {
      return "<span>" + esc(t(key)) + "</span>";
    }).join("");
  }

  function monthHtml(listing, id, date, pick) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var title = new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric" }).format(date);
    var pad = (new Date(year, month, 1).getDay() + 6) % 7;
    var count = new Date(year, month + 1, 0).getDate();
    var cells = "";
    var i;
    for (i = 0; i < pad; i += 1) cells += '<span class="cal-empty"></span>';
    for (i = 1; i <= count; i += 1) {
      var iso = isoDate(new Date(year, month, i));
      var blocked = listing && isBlocked(listing, iso);
      var past = iso < todayIso();
      var cls = "cal-day";
      if (blocked) cls += " is-blocked";
      if (iso === todayIso()) cls += " is-today";
      if (pick.start === iso) cls += " is-start";
      if (pick.end === iso) cls += " is-end";
      if (pick.start && pick.end && iso > pick.start && iso < pick.end) cls += " is-between";
      var disabled = blocked || past;
      cells += '<button type="button" class="' + cls + '" data-cal-day="' + iso + '" data-cal-id="' + esc(id) + '"' +
        (disabled ? " disabled" : "") + '><span>' + i + "</span></button>";
    }
    return '<div class="cal-month"><p class="cal-title">' + esc(title) + "</p><div class=\"cal-grid\">" + weekHeads() + cells + "</div></div>";
  }

  function calendarHtml(listing, id, pick) {
    var start = cursorDate(id);
    var next = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    var hint = t("calHint");
    return (
      '<section class="cal-block">' +
      "<h3>" + esc(t("calTitle")) + "</h3>" +
      '<p class="meta">' + esc(hint) + "</p>" +
      '<div class="cal-tools">' +
      '<button type="button" class="button button-ghost" data-cal-nav="-1" data-cal-id="' + esc(id) + '">' + esc(t("calPrev")) + "</button>" +
      '<button type="button" class="button button-ghost" data-cal-nav="1" data-cal-id="' + esc(id) + '">' + esc(t("calNext")) + "</button>" +
      "</div>" +
      '<div class="cal-months">' + monthHtml(listing, id, start, pick) + monthHtml(listing, id, next, pick) + "</div>" +
      (id !== "form" && pick.start && pick.end ? '<p class="stay-length">' + esc(formatStay(pick.start, pick.end)) + "</p>" : "") +
      "</section>"
    );
  }

  function calendarBlock(listing) {
    if (listing.status === "soon") return "";
    var pick = formPick.listingId === listing.id ? formPick : { start: "", end: "" };
    return calendarHtml(listing, listing.id, pick);
  }

  function confirmStamp() {
    var zone = (window.RENTALS.viewing && window.RENTALS.viewing.timeZone) || "America/Santo_Domingo";
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    var bag = {};
    parts.forEach(function (part) { bag[part.type] = part.value; });
    return bag.year + "-" + bag.month + "-" + bag.day + " " + bag.hour + ":" + bag.minute + " AST";
  }

  function activeListing() {
    var id = document.getElementById("in-apt").value;
    return listingById(id) || window.RENTALS.listings[0];
  }

  function syncStayFields() {
    document.getElementById("in-arrive").value = formPick.start || "";
    document.getElementById("in-depart").value = formPick.end || "";
    var node = document.getElementById("stay-length");
    if (!formPick.start || !formPick.end) {
      node.textContent = "";
      return;
    }
    var parts = stayParts(formPick.start, formPick.end);
    node.textContent = formatStay(formPick.start, formPick.end);
    node.dataset.tooLong = parts.tooLong ? "1" : "";
  }

  function renderFormCalendar() {
    var listing = activeListing();
    document.getElementById("stay-calendar").innerHTML = calendarHtml(listing, "form", formPick);
    syncStayFields();
  }

  function chooseDay(id, iso) {
    var listing = id === "form" ? activeListing() : listingById(id);
    if (!listing || isBlocked(listing, iso) || iso < todayIso()) return;
    var pick = id === "form" ? formPick : { start: formPick.listingId === id ? formPick.start : "", end: formPick.listingId === id ? formPick.end : "" };
    if (!pick.start || (pick.start && pick.end)) {
      formPick = { start: iso, end: "", listingId: listing.id };
    } else if (iso <= pick.start) {
      formPick = { start: iso, end: "", listingId: listing.id };
    } else if (rangeHitsBlock(listing, pick.start, iso) || isBlocked(listing, iso)) {
      formPick = { start: pick.start, end: "", listingId: listing.id, error: "overlap" };
    } else {
      formPick = { start: pick.start, end: iso, listingId: listing.id };
    }
    if (id !== "form") document.getElementById("in-apt").value = listing.id;
    renderSheets();
    renderFormCalendar();
    if (formPick.error) {
      document.getElementById("stay-length").textContent = t("formNeedOpen");
    }
  }

  function renderNeighborhood() {
    var items = window.RENTALS.neighborhood || [];
    document.getElementById("neighborhood").innerHTML = items.map(function (item, i) {
      return '<figure><button type="button" data-area-open="' + i + '" aria-label="' + esc(t("galleryOpen")) + " " + esc(tr(item.caption)) + '"><img src="' + esc(item.src) + '" alt="' + esc(tr(item.caption)) + '"></button><figcaption>' + esc(tr(item.caption)) + "</figcaption></figure>";
    }).join("");
  }

  function renderSamples() {
    var notes = window.RENTALS.samples || [];
    document.getElementById("sample-notes").innerHTML = notes.map(function (note) {
      return '<blockquote><p>' + esc(tr(note.text)) + "</p><footer>" + esc(note.name) + "</footer></blockquote>";
    }).join("");
  }

  function renderCredits() {
    var rows = window.RENTALS.credits || [];
    document.getElementById("credits").innerHTML = rows.map(function (row) {
      return "<li><a href=\"" + esc(row.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
        esc(row.work) + " · " + esc(row.name) + " · " + esc(row.source) + "</a></li>";
    }).join("");
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
    renderNeighborhood();
    renderSamples();
    renderCredits();
    renderFormCalendar();
    ["contact-email", "footer-email"].forEach(function (id) {
      var link = document.getElementById(id);
      link.href = "mailto:" + window.RENTALS.email;
      link.textContent = window.RENTALS.email;
    });
    var warnLink = document.getElementById("warn-check-link");
    if (warnLink) warnLink.textContent = t("warnCheck");
    syncSubmit();
    watchReveal();
  }

  function syncSubmit() {
    var button = document.querySelector("#inquiry-form button[type='submit']");
    var box = document.getElementById("access-ok");
    if (button && box) button.disabled = !box.checked;
  }

  function watchReveal() {
    if (reduce) return;
    if (!watchReveal.observer) {
      watchReveal.observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      }, { threshold: 0.12 });
    }
    document.querySelectorAll(".section, .listing, .neighborhood figure, .samples blockquote").forEach(function (el) {
      el.classList.add("reveal");
      watchReveal.observer.observe(el);
    });
  }

  function setLang(next) {
    if (!window.I18N[next]) return;
    lang = next;
    try { localStorage.setItem("rentals-e8b41f2c-lang", next); } catch (err) { /* ignore */ }
    render();
  }

  document.addEventListener("click", function (event) {
    var calNav = event.target.closest("[data-cal-nav]");
    if (calNav) {
      shiftMonth(calNav.getAttribute("data-cal-id"), Number(calNav.getAttribute("data-cal-nav")));
      if (calNav.getAttribute("data-cal-id") === "form") renderFormCalendar();
      else renderSheets();
      return;
    }
    var calDay = event.target.closest("[data-cal-day]");
    if (calDay && !calDay.disabled) {
      chooseDay(calDay.getAttribute("data-cal-id"), calDay.getAttribute("data-cal-day"));
      return;
    }
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
    var areaOpen = event.target.closest("[data-area-open]");
    if (areaOpen) {
      var areaItems = (window.RENTALS.neighborhood || []).map(function (item) {
        return { kind: "photo", src: item.src, caption: item.caption };
      });
      openLightbox(areaItems, Number(areaOpen.getAttribute("data-area-open")), "");
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
      var photos = photoItems(listing.media);
      var current = listing.media[galleryAt[id] || 0];
      var start = 0;
      photos.forEach(function (item, i) {
        if (current && item.src === current.src) start = i;
      });
      openLightbox(photos, start, id);
    }
  });

  document.getElementById("listing-sheets").addEventListener("keydown", function (event) {
    if (!document.getElementById("lightbox").hidden) return;
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

  document.getElementById("in-apt").addEventListener("change", function () {
    formPick = { start: "", end: "", listingId: document.getElementById("in-apt").value };
    renderFormCalendar();
    renderSheets();
  });

  function photoItems(list) {
    return (list || []).filter(function (item) {
      return item && item.src && item.kind !== "video" && item.kind !== "pattern";
    });
  }

  function lockPage() {
    lbScroll = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.classList.add("lb-open");
    document.body.style.top = "-" + lbScroll + "px";
  }

  function unlockPage() {
    document.body.classList.remove("lb-open");
    document.body.style.top = "";
    window.scrollTo(0, lbScroll);
  }

  function showLightbox() {
    var item = lb.items[lb.index];
    if (!item) return;
    var img = document.getElementById("lightbox-img");
    img.src = item.src;
    img.alt = tr(item.caption);
    document.getElementById("lightbox-caption").textContent = tr(item.caption);
    var box = document.getElementById("lightbox");
    box.hidden = false;
    if (!document.body.classList.contains("lb-open")) lockPage();
  }

  function openLightbox(items, index, galleryId) {
    if (!items || !items.length) return;
    lb.items = items;
    lb.index = (index + items.length) % items.length;
    lb.galleryId = galleryId || "";
    showLightbox();
  }

  function closeLightbox() {
    var box = document.getElementById("lightbox");
    if (!box || box.hidden) return;
    box.hidden = true;
    document.getElementById("lightbox-img").removeAttribute("src");
    unlockPage();
    if (lb.galleryId) renderSheets();
  }

  function stepLightbox(step) {
    var box = document.getElementById("lightbox");
    if (!box || box.hidden || !lb.items.length) return;
    lb.index = (lb.index + step + lb.items.length) % lb.items.length;
    if (lb.galleryId) {
      var listing = listingById(lb.galleryId);
      var src = lb.items[lb.index].src;
      listing.media.forEach(function (item, i) {
        if (item.src === src) galleryAt[lb.galleryId] = i;
      });
    }
    showLightbox();
  }

  document.getElementById("lightbox-prev").addEventListener("click", function (event) {
    event.stopPropagation();
    stepLightbox(-1);
  });
  document.getElementById("lightbox-next").addEventListener("click", function (event) {
    event.stopPropagation();
    stepLightbox(1);
  });
  document.getElementById("lightbox-close").addEventListener("click", function (event) {
    event.stopPropagation();
    closeLightbox();
  });
  document.getElementById("lightbox-backdrop").addEventListener("click", function () {
    closeLightbox();
  });
  document.getElementById("lightbox").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) closeLightbox();
  });

  var touchX = 0;
  var touchY = 0;
  document.getElementById("lightbox").addEventListener("touchstart", function (event) {
    if (!event.changedTouches || !event.changedTouches.length) return;
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;
  }, { passive: true });
  document.getElementById("lightbox").addEventListener("touchend", function (event) {
    if (!event.changedTouches || !event.changedTouches.length) return;
    var dx = event.changedTouches[0].clientX - touchX;
    var dy = event.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    stepLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.getElementById("inquiry-form").addEventListener("change", function () {
    syncVisitMode();
    syncSubmit();
  });
  document.getElementById("warn-check-link").addEventListener("click", function (event) {
    event.stopPropagation();
  });

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
    var box = document.getElementById("lightbox");
    if (box && !box.hidden) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") { event.preventDefault(); stepLightbox(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); stepLightbox(-1); }
      return;
    }
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

  document.getElementById("own-date").min = isoDate(new Date());

  render();
})();
