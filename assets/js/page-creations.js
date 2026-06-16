"use strict";

(function () {
  if (!document.body.classList.contains("page-creations")) return;

  var projects = [];
  var lastFocusedElement;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadProjects() {
    return fetch("./data/creations-projects.json")
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load creations projects: " + response.status);
        return response.json();
      })
      .then(function (data) {
        projects = data;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function renderTags(tags) {
    return (tags || [])
      .map(function (tag) {
        return "<li>" + escapeHtml(tag) + "</li>";
      })
      .join("");
  }

  function renderFeaturedProject(project, index) {
    return (
      '<li class="creations-project" data-creations-reveal>' +
      '<span class="creations-project__media" aria-hidden="true" data-hover-slideshow>' +
      '<span class="hover-slideshow__slides">' +
      '<img class="hover-slideshow__image is-active" src="' +
      escapeHtml(project.image) +
      '" alt="" loading="lazy" />' +
      '<span class="hover-slideshow__image" style="background:#c5bdb2;"></span>' +
      '<span class="hover-slideshow__image" style="background:#8a9478;"></span>' +
      '<span class="hover-slideshow__image" style="background:#6b7e8f;"></span>' +
      '</span></span>' +
      '<div class="creations-project__foot">' +
      '<div class="creations-project__meta">' +
      '<span class="creations-project__category text-sm">' +
      String(index + 1).padStart(2, "0") +
      " / " +
      escapeHtml(project.category) +
      '</span>' +
      '<h2 class="creations-project__title">' +
      escapeHtml(project.title) +
      '</h2>' +
      '</div>' +
      '<div class="creations-project__info">' +
      '<span class="creations-project__desc">' +
      escapeHtml(project.description) +
      '</span>' +
      '<span class="creations-project__fact"><span class="text-sm">Client</span><strong>' +
      escapeHtml(project.client) +
      '</strong></span>' +
      '<span class="creations-project__fact creations-project__fact--services"><span class="text-sm">Services</span><ul class="creations-project__services">' +
      renderTags(project.services) +
      '</ul></span>' +
      '<button class="creations-project__cta" type="button" data-project-id="' +
      escapeHtml(project.id) +
      '" aria-label="View ' +
      escapeHtml(project.title) +
      ' details">' +
      '<span class="stroke-link stroke-link--light">' +
      '<span class="stroke-link__label">View Project</span>' +
      '<svg class="stroke-link__stroke" viewBox="0 0 220 80" aria-hidden="true"><path pathLength="1" d="M 18 28 C 4 44 16 62 68 66 C 126 70 190 56 208 22" /></svg>' +
      '</span>' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</li>'
    );
  }

  function renderProjects() {
    var selectedList = document.querySelector("#creationsProjectList");
    if (!selectedList) return;

    var featured = projects.filter(function (project) {
      return project.featured;
    });

    selectedList.innerHTML = featured.map(renderFeaturedProject).join("");
  }

  function findProject(id) {
    return projects.find(function (project) {
      return project.id === id;
    });
  }

  function renderList(items) {
    return (items || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
  }

  function buildModalContent(project) {
    return (
      '<header class="creations-modal__header"><p class="creations-label">' +
      escapeHtml(project.category) +
      '</p><h2 id="creationsModalTitle">' +
      escapeHtml(project.title) +
      '</h2><p>' +
      escapeHtml(project.description) +
      "</p></header>" +
      '<dl class="creations-modal__facts"><div><dt>Client</dt><dd>' +
      escapeHtml(project.client) +
      "</dd></div><div><dt>Year</dt><dd>" +
      escapeHtml(project.year) +
      "</dd></div><div><dt>Sector</dt><dd>" +
      escapeHtml(project.sector) +
      "</dd></div></dl>" +
      '<div class="creations-modal__sections"><section><h3 class="h5">Client Challenge</h3><p>' +
      escapeHtml(project.problem) +
      '</p></section><section><h3 class="h5">Connect Vietnam Solution</h3><p>' +
      escapeHtml(project.solution) +
      '</p></section><section><h3 class="h5">Scope of Work</h3><ul>' +
      renderList(project.work) +
      '</ul></section><section><h3 class="h5">Results</h3><ul>' +
      renderList(project.results) +
      "</ul></section></div>" +
      '<ul class="creations-modal__tags">' +
      renderTags(project.services) +
      "</ul>"
    );
  }

  function closeModal() {
    var modal = document.querySelector("#creationsModal");
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-creations-modal-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function openModal(project, trigger) {
    var modal = document.querySelector("#creationsModal");
    var image = document.querySelector("#creationsModalImage");
    var content = document.querySelector("#creationsModalContent");
    if (!modal || !image || !content) return;

    lastFocusedElement = trigger;
    image.src = project.image;
    image.alt = project.imageAlt;
    content.innerHTML = buildModalContent(project);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-creations-modal-open");
    modal.querySelector(".creations-modal__close").focus();
  }

  function initModal() {
    var modal = document.querySelector("#creationsModal");
    if (!modal) return;

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-project-id]");
      if (!trigger) return;
      var project = findProject(trigger.dataset.projectId);
      if (project) openModal(project, trigger);
    });

    modal.querySelectorAll("[data-creations-modal-close]").forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key !== "Tab" || !modal.classList.contains("is-open")) return;
      var focusable = modal.querySelectorAll("button, a[href]");
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initHoverSlideshows() {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".creations-project [data-hover-slideshow]").forEach(function (slideshow) {
      if (slideshow.dataset.slideshowReady === "true") return;

      var images = Array.from(slideshow.querySelectorAll(".hover-slideshow__image"));
      var interval = Number(slideshow.dataset.slideshowInterval) || 2400;
      var activeIndex = 0;
      var slideTimer;

      function showSlide(index) {
        activeIndex = index % images.length;
        images.forEach(function (image, i) {
          image.classList.toggle("is-active", i === activeIndex);
        });
      }

      function startSlides() {
        if (prefersReducedMotion || slideTimer || images.length < 2) return;
        slideTimer = window.setInterval(function () {
          showSlide(activeIndex + 1);
        }, interval);
      }

      function stopSlides() {
        if (!slideTimer) return;
        window.clearInterval(slideTimer);
        slideTimer = null;
      }

      slideshow.addEventListener("pointerenter", function () { startSlides(); });
      slideshow.addEventListener("pointerleave", function () { stopSlides(); });
      slideshow.dataset.slideshowReady = "true";
    });
  }

  function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    var scroller =
      document.querySelector(".subpage-main [data-overlayscrollbars-viewport]") ||
      document.querySelector(".subpage-main");
    var heroTimeline = window.gsap.timeline({
      paused: true,
      defaults: { duration: 0.8, ease: "power3.out" },
    });

    heroTimeline
      .from(".creations-hero .creations-label", { autoAlpha: 0, y: 24 })
      .from(".creations-hero h1", { autoAlpha: 0, y: 44 }, "-=0.5")
      .from(".creations-hero__lead", { autoAlpha: 0, y: 32 }, "-=0.5");

    function revealHero() {
      heroTimeline.play();
    }

    if (window.CNVNPageRevealed) revealHero();
    else window.addEventListener("cnvn:page-revealed", revealHero, { once: true });

    document.querySelectorAll("[data-creations-reveal]").forEach(function (target) {
      window.gsap.from(target, {
        autoAlpha: 0,
        y: 40,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: target,
          scroller: scroller,
          start: "top 88%",
          once: true,
        },
      });
    });

    requestAnimationFrame(function () {
      window.ScrollTrigger.refresh();
    });
  }

  loadProjects().then(function () {
    renderProjects();
    initModal();
    initHoverSlideshows();
    initAnimations();
  });
})();
