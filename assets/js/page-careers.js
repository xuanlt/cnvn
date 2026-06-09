"use strict";

(function () {
  if (!document.body.classList.contains("page-careers")) return;

  var jobs = [];
  var lastFocusedElement;

  function loadJobs() {
    return fetch("./data/jobs.json")
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load jobs: " + response.status);
        return response.json();
      })
      .then(function (data) {
        jobs = data;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function renderJobs() {
    var grid = document.querySelector("#careersJobGrid");
    if (!grid) return;

    grid.innerHTML = jobs
      .map(function (job, index) {
        return (
          '<li class="careers-job" data-careers-reveal>' +
          '<button class="careers-job__trigger" type="button" data-job-index="' +
          index +
          '" aria-label="View ' +
          job.title +
          ' details">' +
          '<span class="careers-job__number text-sm">' +
          String(index + 1).padStart(2, "0") +
          "</span>" +
          '<span class="careers-job__main"><span class="careers-job__title h4">' +
          job.title +
          '</span><span class="careers-job__location text-sm"><i class="ph ph-map-pin" aria-hidden="true"></i>' +
          job.location +
          "</span></span>" +
          '<span class="careers-job__type text-sm">' +
          job.type +
          "</span>" +
          '<span class="careers-job__action" aria-hidden="true"><i class="ph ph-arrow-up-right"></i></span>' +
          "</button>" +
          "</li>"
        );
      })
      .join("");
  }

  function renderList(items) {
    return items
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");
  }

  function buildDrawerContent(job) {
    return (
      '<header class="careers-drawer__header">' +
      '<p class="careers-label">Open Position</p>' +
      '<h2 id="careersDrawerTitle">' +
      job.title +
      "</h2>" +
      '<div class="careers-drawer__meta text-sm"><span><i class="ph ph-map-pin" aria-hidden="true"></i>' +
      job.location +
      '</span><span><i class="ph ph-briefcase" aria-hidden="true"></i>' +
      job.type +
      '</span><span><i class="ph ph-clock" aria-hidden="true"></i>' +
      job.deadline +
      '</span><span><i class="ph ph-currency-circle-dollar" aria-hidden="true"></i>' +
      job.salary +
      "</span></div></header>" +
      '<div class="careers-drawer__body">' +
      '<section><h3 class="h5">About the role</h3><p>' +
      job.description +
      '</p></section><section><h3 class="h5">Responsibilities</h3><ul>' +
      renderList(job.responsibilities) +
      '</ul></section><section><h3 class="h5">Requirements</h3><ul>' +
      renderList(job.requirements) +
      "</ul></section></div>" +
      '<footer class="careers-drawer__apply"><p class="careers-label">How to apply</p><h3 class="h4">Apply for this role</h3>' +
      '<p>Send your CV and portfolio, if applicable, to <a href="mailto:careers@connectvietnam.com">careers@connectvietnam.com</a>.</p>' +
      '<p class="text-sm">Subject: ' +
      job.title +
      " - [Your Name]</p></footer>"
    );
  }

  function closeDrawer() {
    var drawer = document.querySelector("#careersDrawer");
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-careers-drawer-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function openDrawer(job, trigger) {
    var drawer = document.querySelector("#careersDrawer");
    var content = document.querySelector("#careersDrawerContent");
    if (!drawer || !content) return;

    lastFocusedElement = trigger;
    content.innerHTML = buildDrawerContent(job);
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-careers-drawer-open");
    drawer.querySelector(".careers-drawer__close").focus();
  }

  function initDrawer() {
    var grid = document.querySelector("#careersJobGrid");
    var drawer = document.querySelector("#careersDrawer");
    if (!grid || !drawer) return;

    grid.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-job-index]");
      if (!trigger) return;
      var job = jobs[Number(trigger.dataset.jobIndex)];
      if (job) openDrawer(job, trigger);
    });

    drawer.querySelectorAll("[data-careers-drawer-close]").forEach(function (button) {
      button.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !drawer.classList.contains("is-open")) return;

      var focusable = drawer.querySelectorAll("button, a[href]");
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
      .from(".careers-hero .careers-label", { autoAlpha: 0, y: 24 })
      .from(".careers-hero h1", { autoAlpha: 0, y: 44 }, "-=0.5")
      .from(".careers-hero__lead", { autoAlpha: 0, y: 32 }, "-=0.5");

    function revealHero() {
      heroTimeline.play();
    }

    if (window.CNVNPageRevealed) revealHero();
    else window.addEventListener("cnvn:page-revealed", revealHero, { once: true });

    document.querySelectorAll("[data-careers-reveal]").forEach(function (target) {
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

  loadJobs().then(function () {
    renderJobs();
    initDrawer();
    initAnimations();
  });
})();
