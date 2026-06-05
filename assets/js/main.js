"use strict";

(function () {
  function setViewportHeight() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
  }

  function setActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".nav-link[href]");

    links.forEach(function (link) {
      var href = link.getAttribute("href").replace("./", "");
      link.classList.toggle("active", href === path);
    });
  }

  function initCursor() {
    if (!window.gsap || !window.matchMedia("(pointer: fine)").matches) return;
    if (document.querySelector(".cursor-ring")) return;

    var ring = document.createElement("span");
    var dot = document.createElement("span");
    var ringSize = 36;
    var dotSize = 6;
    var targets = "a, button, [role='button'], input, label, select, textarea";

    ring.className = "cursor-ring";
    dot.className = "cursor-dot";
    ring.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    window.gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

    var ringX = window.gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    var ringY = window.gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    var dotX = window.gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    var dotY = window.gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });

    function sizeRing(size) {
      window.gsap.to(ring, { width: size, height: size, duration: 0.3, ease: "power2.out" });
    }

    function sizeDot(size) {
      window.gsap.to(dot, { width: size, height: size, duration: 0.2, ease: "power2.out" });
    }

    window.addEventListener("mousemove", function (event) {
      document.body.classList.add("has-custom-cursor");
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
    });

    document.addEventListener("mouseover", function (event) {
      if (!event.target.closest(targets)) return;
      sizeRing(ringSize * 1.8);
      sizeDot(0);
    });

    document.addEventListener("mouseout", function (event) {
      if (!event.target.closest(targets)) return;
      if (event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest(targets)) return;
      sizeRing(ringSize);
      sizeDot(dotSize);
    });

    document.addEventListener("mousedown", function () {
      sizeRing(ringSize * 2.4);
      sizeDot(dotSize * 0.5);
    });

    document.addEventListener("mouseup", function () {
      sizeRing(ringSize);
      sizeDot(dotSize);
    });

    document.documentElement.addEventListener("mouseleave", function () {
      document.body.classList.remove("has-custom-cursor");
    });
  }

  function initLanguageSwitch() {
    document.querySelectorAll("[data-language-switch]").forEach(function (switcher) {
      if (switcher.dataset.languageReady === "true") return;

      var trigger = switcher.querySelector(".language-switch__trigger");
      var current = switcher.querySelector(".language-switch__current");
      var options = Array.from(switcher.querySelectorAll(".language-switch__option"));
      var savedLanguage = localStorage.getItem("cnvn-language");

      if (savedLanguage !== "en" && savedLanguage !== "vi") {
        savedLanguage = "en";
      }

      function setOpen(isOpen) {
        switcher.classList.toggle("is-open", isOpen);
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      function selectLanguage(language) {
        options.forEach(function (option) {
          var isSelected = option.dataset.language === language;
          option.classList.toggle("is-active", isSelected);
          option.setAttribute("aria-selected", isSelected ? "true" : "false");
        });

        current.textContent = language.toUpperCase();
        document.documentElement.lang = language;
        localStorage.setItem("cnvn-language", language);
        setOpen(false);
      }

      trigger.addEventListener("click", function () {
        setOpen(!switcher.classList.contains("is-open"));
      });

      options.forEach(function (option) {
        option.addEventListener("click", function () {
          selectLanguage(option.dataset.language);
          trigger.focus();
        });
      });

      document.addEventListener("click", function (event) {
        if (!switcher.contains(event.target)) setOpen(false);
      });

      switcher.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          setOpen(false);
          trigger.focus();
        }
      });

      selectLanguage(savedLanguage);
      switcher.dataset.languageReady = "true";
    });
  }

  function initCustomScrollbars() {
    if (!window.OverlayScrollbarsGlobal) return;

    var OverlayScrollbars = window.OverlayScrollbarsGlobal.OverlayScrollbars;
    var scrollAreas = document.querySelectorAll("[data-overlayscrollbars-initialize], .custom-scroll, .custom-scroll-x");

    scrollAreas.forEach(function (element) {
      if (element.dataset.scrollbarReady === "true") return;
      OverlayScrollbars(element, {
        scrollbars: {
          autoHide: "leave",
          theme: "os-theme-dark",
        },
      });
      element.dataset.scrollbarReady = "true";
    });
  }

  function initSliders() {
    if (!window.Swiper) return;

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
      if (slider.dataset.sliderReady === "true") return;
      new window.Swiper(slider, {
        loop: true,
        speed: 700,
        slidesPerView: 1,
        pagination: {
          el: slider.querySelector(".swiper-pagination"),
          clickable: true,
        },
      });
      slider.dataset.sliderReady = "true";
    });
  }

  function initPageAnimations() {
    if (!window.gsap) return;

    var fadeUpTargets = document.querySelectorAll("[data-animate='fade-up']");
    if (!fadeUpTargets.length) return;

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    window.gsap.from(fadeUpTargets, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.08,
    });
  }

  function initPageTransitions() {
    if (document.querySelector(".page-transition")) return;

    var overlay = document.createElement("div");
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isTransitioning = false;

    overlay.className = "page-transition";
    document.body.appendChild(overlay);
    document.body.classList.remove("is-page-loading");

    function announcePageRevealed() {
      window.CNVNPageRevealed = true;
      window.dispatchEvent(new CustomEvent("cnvn:page-revealed"));
    }

    function revealPage() {
      overlay.classList.remove("is-hidden");

      if (!window.gsap || prefersReducedMotion) {
        overlay.classList.add("is-hidden");
        announcePageRevealed();
        return;
      }

      window.gsap
        .timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: function () {
            overlay.classList.add("is-hidden");
            announcePageRevealed();
          },
        })
        .to(overlay, { scaleY: 0, transformOrigin: "top center", duration: 0.9 });
    }

    function leavePage(href) {
      if (isTransitioning) return;
      isTransitioning = true;
      overlay.classList.remove("is-hidden");

      if (!window.gsap || prefersReducedMotion) {
        window.location.href = href;
        return;
      }

      window.gsap
        .timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: function () {
            window.location.href = href;
          },
        })
        .set(overlay, { autoAlpha: 1, scaleY: 0, transformOrigin: "bottom center" })
        .to(overlay, { scaleY: 1, duration: 0.9 }, 0);
    }

    document.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      if (!link) return;

      var href = link.getAttribute("href");
      if (
        !href ||
        href.charAt(0) === "#" ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.origin !== window.location.origin ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      leavePage(link.href);
    });

    window.addEventListener("pageshow", function () {
      isTransitioning = false;
      revealPage();
    });
  }

  function initMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var backdrop = document.querySelector(".menu-backdrop");
    var links = document.querySelectorAll(".nav-primary .nav-link");

    if (!toggle) return;

    function setMenuOpen(isOpen) {
      document.body.classList.toggle("is-menu-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setMenuOpen(!document.body.classList.contains("is-menu-open"));
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setMenuOpen(false);
      });
    }

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
    });
  }
  

  function initCommon() {
    setViewportHeight();
    setActiveNav();
    initCursor();
    initLanguageSwitch();
    initMobileMenu();
    initCustomScrollbars();
    initSliders();
    initPageAnimations();
    initPageTransitions();
  }

  initCommon();

  window.addEventListener("resize", setViewportHeight);

  window.CNVN = {
    initCommon: initCommon,
    initCustomScrollbars: initCustomScrollbars,
    initSliders: initSliders,
    initPageAnimations: initPageAnimations,
    initPageTransitions: initPageTransitions,
    initMobileMenu: initMobileMenu,
    initLanguageSwitch: initLanguageSwitch,
    initCursor: initCursor,
  };
})();
