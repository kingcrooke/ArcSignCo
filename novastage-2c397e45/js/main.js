(function () {
  var root = document.documentElement;

  var menuButton = document.getElementById("menu-button");
  var mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  var yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll("[data-reveal]");

  function isBelowFold(el) {
    var rect = el.getBoundingClientRect();
    return rect.top > window.innerHeight * 0.88;
  }

  if (!reducedMotion && revealEls.length && "IntersectionObserver" in window) {
    root.classList.add("js-reveal");

    revealEls.forEach(function (el) {
      if (el.closest(".hero")) {
        el.classList.add("is-visible");
        return;
      }
      if (isBelowFold(el)) {
        el.classList.add("reveal-pending");
      } else {
        el.classList.add("is-visible");
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      if (el.classList.contains("reveal-pending")) {
        observer.observe(el);
      }
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var parallaxEls = document.querySelectorAll("[data-parallax]");
  var ticking = false;

  function applyParallax() {
    if (reducedMotion) {
      return;
    }
    var scrollY = window.scrollY;
    parallaxEls.forEach(function (el) {
      var rate = parseFloat(el.getAttribute("data-parallax") || "0.02");
      el.style.setProperty("--parallax-y", scrollY * rate + "px");
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(applyParallax);
    }
  }

  if (parallaxEls.length && !reducedMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    applyParallax();
  }

  var hero = document.getElementById("hero");
  if (hero && !reducedMotion) {
    hero.classList.add("hero--motion");
    window.setTimeout(function () {
      hero.classList.add("hero--settled");
    }, 2600);
  } else if (hero) {
    hero.classList.add("hero--settled");
  }

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }
      status.textContent = window.NOVASTAGE_t
        ? window.NOVASTAGE_t("form.status")
        : "Thank you — your message is ready to send once the contact form is connected. (TODO: wire up form handler.)";
      status.setAttribute("data-filled", "1");
    });
  }
})();
