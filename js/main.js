/* ===========================================================
   Grillhouse Nyhamnsläge – interaktion
   =========================================================== */
(function () {
  "use strict";

  /* --- Konfiguration ----------------------------------------
     ORDER_URL: lägg in URL:en till online-beställningen här.
       Så länge värdet är tomt visas en notis om att den öppnar snart.
     OPENING_DATE: ISO-datum för premiären (t.ex. "2026-08-15").
       Är värdet tomt visas "Snart" istället för en nedräkning.
  ------------------------------------------------------------ */
  var ORDER_URL    = "";
  var OPENING_DATE = "2026-06-01T11:00:00+02:00"; // 1 juni 2026, kl. 11:00

  /* --- Aktuellt år i sidfoten --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --- Mobilmeny --- */
  var toggle   = document.getElementById("nav-toggle");
  var links    = document.getElementById("nav-links");
  var backdrop = document.getElementById("nav-backdrop");

  function setMenu(open) {
    if (!links || !toggle) return;
    links.classList.toggle("is-open", open);
    if (backdrop) backdrop.classList.toggle("is-open", open);
    document.body.classList.toggle("is-locked", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
  }
  function closeMenu() { setMenu(false); }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      setMenu(!links.classList.contains("is-open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    if (backdrop) backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* --- Nav-bakgrund vid scroll --- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 12);
    updateFloatingCta();
  }

  /* --- Nedräkning --- */
  var cdRoot   = document.querySelector("[data-countdown]");
  var cdDays   = document.querySelector("[data-cd-days]");
  var cdHours  = document.querySelector("[data-cd-hours]");
  var cdMins   = document.querySelector("[data-cd-mins]");
  var cdText   = document.querySelector("[data-countdown-text]");
  var cdBadge  = document.querySelector("[data-countdown-badge]");
  var cdChip   = document.querySelector("[data-countdown-chip]");
  var openingTs = OPENING_DATE ? new Date(OPENING_DATE).getTime() : NaN;

  function setAll(text) {
    if (cdText)  cdText.textContent  = text;
    if (cdBadge) cdBadge.textContent = text;
    if (cdChip)  cdChip.textContent  = text;
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function renderCountdown() {
    if (!openingTs || isNaN(openingTs)) {
      setAll("Öppnar snart");
      if (cdRoot) cdRoot.hidden = true;
      return;
    }
    var diff = openingTs - Date.now();
    if (diff <= 0) {
      setAll("Vi har öppet!");
      if (cdRoot) cdRoot.hidden = true;
      return;
    }
    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000) / 60000);

    if (cdRoot)  cdRoot.hidden = false;
    if (cdDays)  cdDays.textContent  = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins)  cdMins.textContent  = pad(mins);

    var label = "Öppnar om " + days + (days === 1 ? " dag" : " dagar");
    setAll(label);
  }
  renderCountdown();
  setInterval(renderCountdown, 30 * 1000);

  /* --- Glödande partiklar (embers) --- */
  function spawnEmbers(container, count) {
    if (!container) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var e = document.createElement("span");
      e.className = "ember";
      var size = 3 + Math.random() * 4;
      e.style.left = (Math.random() * 100) + "%";
      e.style.width = e.style.height = size + "px";
      e.style.setProperty("--dx", ((Math.random() - 0.5) * 120) + "px");
      e.style.setProperty("--rise", (320 + Math.random() * 360) + "px");
      e.style.animationDuration = (5 + Math.random() * 5) + "s";
      e.style.animationDelay    = (Math.random() * 8) + "s";
      frag.appendChild(e);
    }
    container.appendChild(frag);
  }
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    spawnEmbers(document.getElementById("embers"), 22);
  }

  /* --- Stagger-fördröjning ----------------------------------
     Sätter --reveal-delay i ms på varje [data-reveal] som är
     barn till ett [data-reveal-stagger]-element.
  ------------------------------------------------------------ */
  document.querySelectorAll("[data-reveal-stagger]").forEach(function (group) {
    var step = parseInt(group.getAttribute("data-stagger") || "90", 10);
    var children = group.querySelectorAll("[data-reveal]");
    children.forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", (i * step) + "ms");
    });
  });

  /* --- Scroll-in animationer --- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* --- Aktiv länk i menyn vid scroll --- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* --- Flytande mobil-CTA --- */
  var floatingCta = document.getElementById("floating-cta");
  var hero        = document.getElementById("hem");
  function updateFloatingCta() {
    if (!floatingCta || !hero) return;
    var heroBottom = hero.getBoundingClientRect().bottom;
    floatingCta.classList.toggle("is-visible", heroBottom < 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Beställningsknappar --- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4000);
  }

  document.querySelectorAll("[data-order-cta]").forEach(function (btn) {
    if (ORDER_URL) {
      btn.setAttribute("href", ORDER_URL);
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener");
    } else {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        showToast("Online-beställning öppnar snart – håll utkik!");
        closeMenu();
      });
    }
  });

})();
