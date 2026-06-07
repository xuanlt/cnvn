"use strict";

(function () {
  if (!document.body.classList.contains("page-about")) return;

  var teamData = window.CNVNTeamData || [];

  function renderTeam() {
    var grid = document.querySelector("#aboutTeamGrid");
    if (!grid) return;

    grid.innerHTML = teamData
      .map(function (member, index) {
        return (
          '<li class="about-team__card" data-team-index="' +
          index +
          '">' +
          '<button class="about-team__profile" type="button" aria-label="View ' +
          member.name +
          ' profile">' +
          '<span class="about-team__avatar about-team__avatar--' +
          member.avatarColor +
          '">' +
          member.initials +
          "</span>" +
          '<span class="about-team__action" aria-hidden="true"><i class="ph ph-plus"></i></span>' +
          "</button>" +
          "<h3>" +
          member.name +
          "</h3>" +
          "<p>" +
          member.role +
          "</p>" +
          "</li>"
        );
      })
      .join("");
  }

  function initTeamModal() {
    var grid = document.querySelector("#aboutTeamGrid");
    var modal = document.querySelector("#aboutTeamModal");
    if (!grid || !modal) return;

    var avatar = modal.querySelector("#aboutTeamModalAvatar");
    var role = modal.querySelector("#aboutTeamModalRole");
    var name = modal.querySelector("#aboutTeamModalName");
    var bio = modal.querySelector("#aboutTeamModalBio");
    var experience = modal.querySelector("#aboutTeamModalExperience");
    var industries = modal.querySelector("#aboutTeamModalIndustries");
    var clients = modal.querySelector("#aboutTeamModalClients");
    var lastFocusedElement;

    function openModal(member, trigger) {
      lastFocusedElement = trigger;
      avatar.className = "about-team-modal__avatar about-team__avatar--" + member.avatarColor;
      avatar.textContent = member.initials;
      role.textContent = member.role;
      name.textContent = member.name;
      bio.textContent = member.bio;
      experience.textContent = member.yearsOfExperience + " years";
      industries.textContent = member.industries.join(" / ");
      clients.textContent = member.clients.join(" / ");
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-team-modal-open");
      modal.querySelector(".about-team-modal__close").focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-team-modal-open");
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    grid.addEventListener("click", function (event) {
      var trigger = event.target.closest(".about-team__profile");
      if (!trigger) return;
      var card = trigger.closest(".about-team__card");
      var member = teamData[Number(card.dataset.teamIndex)];
      if (member) openModal(member, trigger);
    });

    modal.querySelectorAll("[data-team-modal-close]").forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  function initAboutAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    var scroller =
      document.querySelector(".subpage-main [data-overlayscrollbars-viewport]") ||
      document.querySelector(".subpage-main");
    var heroTimeline = window.gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.8,
        ease: "power3.out",
      },
    });

    heroTimeline
      .from(".about-hero .about-label", { autoAlpha: 0, y: 24 })
      .from(".about-hero h1", { autoAlpha: 0, y: 48 }, "-=0.5")
      .from(".about-hero__lead", { autoAlpha: 0, y: 36 }, "-=0.48");

    function revealHero() {
      heroTimeline.play();
    }

    if (window.CNVNPageRevealed) {
      revealHero();
    } else {
      window.addEventListener("cnvn:page-revealed", revealHero, { once: true });
    }

    document.querySelectorAll("[data-about-reveal]:not(.about-hero)").forEach(function (target) {
      window.gsap.from(target, {
        autoAlpha: 0,
        y: 44,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: target,
          scroller: scroller,
          start: "top 88%",
          once: true,
        },
      });
    });

    window.gsap.from(".about-mission article", {
      autoAlpha: 0,
      scale: 0.78,
      duration: 0.55,
      ease: "back.out(1.5)",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".about-mission__list",
        scroller: scroller,
        start: "top 82%",
        once: true,
      },
    });

    window.gsap.from(".about-team__card", {
      autoAlpha: 0,
      y: 48,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".about-team__grid",
        scroller: scroller,
        start: "top 84%",
        once: true,
      },
    });

    if (window.matchMedia("(min-width: 768px)").matches) {
      window.gsap.fromTo(
        ".about-photo img",
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-photo",
            scroller: scroller,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    }

    requestAnimationFrame(function () {
      window.ScrollTrigger.refresh();
    });

    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  renderTeam();
  initTeamModal();
  initAboutAnimations();
})();
