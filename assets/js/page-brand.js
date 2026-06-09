"use strict";

(function () {
  if (!document.body.classList.contains("page-brand")) return;

  var brandData = {
    shifts: [],
    services: [],
    network: [],
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadData() {
    return fetch("./data/brand-solutions.json")
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load brand solutions: " + response.status);
        return response.json();
      })
      .then(function (data) {
        brandData = data;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function renderTags(items) {
    return items
      .map(function (item) {
        return '<span class="brand-service__tag">' + escapeHtml(item) + "</span>";
      })
      .join("");
  }

  function renderShifts() {
    var list = document.querySelector("#brandShiftList");
    if (!list) return;

    list.innerHTML = brandData.shifts
      .map(function (shift, index) {
        var number = String(index + 1).padStart(2, "0");
        return (
          '<li class="brand-shift" data-brand-reveal><button class="brand-shift__button" type="button" aria-pressed="false">' +
          '<span class="brand-shift__inner"><span class="brand-shift__face brand-shift__front"><span class="brand-shift__number">' +
          number +
          '</span><span class="brand-shift__copy">' +
          escapeHtml(shift.from) +
          " - " +
          escapeHtml(shift.to) +
          '</span><i class="ph ph-arrow-up-right brand-shift__arrow" aria-hidden="true"></i></span>' +
          '<span class="brand-shift__face brand-shift__back"><span class="brand-shift__number">' +
          number +
          '</span><span class="brand-shift__copy">' +
          escapeHtml(shift.detail) +
          '</span><i class="ph ph-arrow-down-left brand-shift__arrow" aria-hidden="true"></i></span></span></button></li>'
        );
      })
      .join("");
  }

  function renderServices() {
    var list = document.querySelector("#brandServiceList");
    if (!list) return;

    list.innerHTML = brandData.services
      .map(function (service, index) {
        var groups = service.groups
          .map(function (group) {
            return (
              '<section class="brand-service__group"><p class="brand-label">' +
              escapeHtml(group.label) +
              '</p><div class="brand-service__tags">' +
              renderTags(group.items) +
              "</div></section>"
            );
          })
          .join("");

        return (
          '<article class="brand-service">' +
          '<header class="brand-service__header"><span class="brand-service__icon"><img src="' +
          escapeHtml(service.image) +
          '" alt="" aria-hidden="true" /></span><h3>' +
          escapeHtml(service.title) +
          '</h3><span class="brand-service__number text-sm">' +
          String(index + 1).padStart(2, "0") +
          '</span></header><div class="brand-service__body"><div class="brand-service__copy"><p class="brand-service__headline h4">' +
          escapeHtml(service.headline) +
          '</p><p class="brand-service__description">' +
          escapeHtml(service.description) +
          '</p></div><div class="brand-service__groups">' +
          groups +
          "</div></div></article>"
        );
      })
      .join("");
  }

  function renderNetwork() {
    var list = document.querySelector("#brandNetworkList");
    if (!list) return;

    list.innerHTML = brandData.network
      .map(function (item, index) {
        return (
          '<li class="brand-network-card"><i class="ph ' +
          escapeHtml(item.icon) +
          '" aria-hidden="true"></i><h3>' +
          escapeHtml(item.title) +
          '</h3><p>' +
          item.items.map(escapeHtml).join(" · ") +
          "</p></li>"
        );
      })
      .join("");
  }

  function initShifts() {
    document.querySelector("#brandShiftList")?.addEventListener("click", function (event) {
      var button = event.target.closest(".brand-shift__button");
      if (!button) return;
      var isActive = button.classList.toggle("is-active");
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function initNetwork() {
    var stage = document.querySelector("#brandNetworkStage");
    var items = stage ? Array.from(stage.querySelectorAll(".brand-network-card")) : [];
    if (!stage || !items.length || window.matchMedia("(max-width: 1023px)").matches) return;

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    var paused = false;

    function render() {
      var radius = Math.max(170, Math.min(stage.clientWidth * 0.31, stage.clientHeight * 0.34));
      items.forEach(function (item, index) {
        if (!paused && !reducedMotion) angles[index] += 0.0022;
        item.style.left = stage.clientWidth / 2 + Math.cos(angles[index]) * radius + "px";
        item.style.top = stage.clientHeight / 2 + Math.sin(angles[index]) * radius + "px";
      });
      requestAnimationFrame(render);
    }

    items.forEach(function (item) {
      item.addEventListener("pointerenter", function () {
        paused = true;
        stage.classList.add("is-paused");
      });
      item.addEventListener("pointerleave", function () {
        paused = false;
        stage.classList.remove("is-paused");
      });
    });
    render();
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
      .from(".brand-hero .brand-label", { autoAlpha: 0, y: 24 })
      .from(".brand-hero h1", { autoAlpha: 0, y: 44 }, "-=0.5")
      .from(".brand-hero__lead", { autoAlpha: 0, y: 32 }, "-=0.5");

    function revealHero() {
      heroTimeline.play();
    }

    if (window.CNVNPageRevealed) revealHero();
    else window.addEventListener("cnvn:page-revealed", revealHero, { once: true });

    document.querySelectorAll("[data-brand-reveal]").forEach(function (target) {
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

  loadData().then(function () {
    renderShifts();
    renderServices();
    renderNetwork();
    initShifts();
    initNetwork();
    initAnimations();
  });
})();
