(function () {
  var KEY = "tenant-reviews-084edd38-lang";
  var I18N = {
    es: {
      title: "Reseña de huéspedes",
      kicker: "Encuesta",
      intro: "Para nosotros es muy importante tu opinión. Por favor ayúdanos a calificar nuestro servicio llenando este breve encuesta y una pequeña reseña.",
      q1: "Del 1 al 10, ¿cómo calificas el servicio de la hostess y el landlord?",
      q2: "El apartamento que elegiste tenía todas las comodidades necesarias para tu estancia. Califícalo del 1 al 10.",
      q3: "Del 1 al 10, ¿cómo calificas la comodidad, la luminosidad y la armonía del espacio?",
      q4: "Del 1 al 10, ¿cómo calificas haber sentido ese apartamento como tu hogar?",
      q5a: "Del 1 al 10, si tuvieras la oportunidad de volver a rentar el apartamento, ¿qué puntuación le darías?",
      q5b: "¿Lo volverías a rentar?",
      q6: "Del 1 al 10, ¿cómo calificas el entorno, la ubicación, el sector y la seguridad del apartamento?",
      q7: "Del 1 al 10, ¿cómo calificas las facilidades, comodidades y la accesibilidad del apartamento con la comunicación / transporte de la ciudad?",
      q8: "Si deseas agregar algo más, escribe una breve reseña (opcional, unas 300 palabras como máximo).",
      hint: "Unas 300 palabras como máximo. Si se pasa un poco, igual puede enviarla.",
      over: "Va un poco más allá de 300 palabras. Puede enviarla igual.",
      yes: "Sí",
      no: "No",
      submit: "Enviar la reseña",
      thanksTitle: "Gracias",
      thanks: "Recibimos su reseña.",
      sendError: "No se pudo enviar. Intente de nuevo."
    },
    en: {
      title: "Guest review",
      kicker: "Survey",
      intro: "Your opinion matters a great deal to us. Please help us rate our service by filling out this short survey and a short review.",
      q1: "From 1 to 10, how do you rate the service of the hostess and the landlord?",
      q2: "The apartment you chose had all the amenities needed for your stay. Rate it from 1 to 10.",
      q3: "From 1 to 10, how do you rate the comfort, the luminosity, and the harmony of the space?",
      q4: "From 1 to 10, how do you rate feeling that the apartment was like your home?",
      q5a: "From 1 to 10, if you had the chance to rent the apartment again, what score would you give it?",
      q5b: "Would you rent it again?",
      q6: "From 1 to 10, how do you rate the surroundings, the location, the sector, and the security of the apartment?",
      q7: "From 1 to 10, how do you rate the facilities, the amenities, and how the apartment connects with city transport?",
      q8: "If you want to add anything else, write a short review (optional, about 300 words at most).",
      hint: "About 300 words at most. A little over that is still fine to send.",
      over: "This is a little past 300 words. You can still send it.",
      yes: "Yes",
      no: "No",
      submit: "Send the review",
      thanksTitle: "Thank you",
      thanks: "We received your review.",
      sendError: "Could not send. Please try again."
    },
    fr: {
      title: "Avis des hôtes",
      kicker: "Questionnaire",
      intro: "Votre avis compte beaucoup pour nous. Aidez-nous à évaluer notre service en remplissant ce court questionnaire et un court avis.",
      q1: "De 1 à 10, comment évaluez-vous le service de l’hôtesse et du propriétaire ?",
      q2: "L’appartement que vous avez choisi avait toutes les commodités nécessaires pour votre séjour. Notez-le de 1 à 10.",
      q3: "De 1 à 10, comment évaluez-vous le confort, la luminosité et l’harmonie de l’espace ?",
      q4: "De 1 à 10, comment évaluez-vous le sentiment que cet appartement était comme chez vous ?",
      q5a: "De 1 à 10, si vous aviez l’occasion de louer à nouveau l’appartement, quelle note lui donneriez-vous ?",
      q5b: "Le loueriez-vous à nouveau ?",
      q6: "De 1 à 10, comment évaluez-vous l’environnement, l’emplacement, le quartier et la sécurité de l’appartement ?",
      q7: "De 1 à 10, comment évaluez-vous les équipements, les commodités et l’accessibilité de l’appartement avec les transports de la ville ?",
      q8: "Si vous voulez ajouter quelque chose, écrivez un court avis (facultatif, environ 300 mots au plus).",
      hint: "Environ 300 mots au plus. Un peu plus reste acceptable.",
      over: "C’est un peu au-delà de 300 mots. Vous pouvez l’envoyer quand même.",
      yes: "Oui",
      no: "Non",
      submit: "Envoyer l’avis",
      thanksTitle: "Merci",
      thanks: "Nous avons reçu votre avis.",
      sendError: "L’envoi n’a pas abouti. Réessayez."
    }
  };

  var lang = "es";

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.es[key] || "";
  }

  function wordCount(text) {
    var trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  function apply() {
    document.documentElement.lang = lang === "en" ? "en" : lang === "fr" ? "fr" : "es";
    document.title = t("title") + " — EC Boutique";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-set-lang") === lang ? "true" : "false");
    });
    updateCount();
  }

  function updateCount() {
    var review = document.getElementById("review");
    var hint = document.getElementById("review-hint");
    if (!review || !hint) return;
    var count = wordCount(review.value);
    if (count > 300) {
      hint.textContent = t("over") + " (" + count + ")";
      hint.className = "warn";
    } else {
      hint.textContent = t("hint");
      hint.className = "hint";
    }
  }

  function setLang(next) {
    if (!I18N[next]) return;
    lang = next;
    try { localStorage.setItem(KEY, next); } catch (err) { /* ignore */ }
    apply();
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      setLang(button.getAttribute("data-set-lang"));
    });
  });

  var review = document.getElementById("review");
  if (review) review.addEventListener("input", updateCount);

  var form = document.getElementById("tenant-review");
  var thanks = document.getElementById("thanks");
  var error = document.getElementById("form-error");

  function showThanks() {
    if (form) form.hidden = true;
    if (thanks) thanks.hidden = false;
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (error) error.textContent = "";
      if (!form.reportValidity()) return;
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      }).then(function (response) {
        if (!response.ok) throw new Error("send");
        showThanks();
      }).catch(function () {
        if (error) error.textContent = t("sendError");
      });
    });
  }

  var params = new URLSearchParams(location.search);
  var fromQuery = params.get("lang");
  var stored = "";
  try { stored = localStorage.getItem(KEY) || ""; } catch (err) { stored = ""; }
  if (I18N[fromQuery]) lang = fromQuery;
  else if (I18N[stored]) lang = stored;
  apply();
  if (params.get("ok") === "1") showThanks();
})();
