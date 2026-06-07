"use strict";

(function () {
  if (!document.body.classList.contains("page-contact")) return;

  function revealContactPage() {
    if (!window.gsap) return;

    window.gsap.from("[data-contact-reveal]", {
      y: 36,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      clearProps: "transform,opacity",
    });
  }

  if (window.CNVNPageRevealed) {
    revealContactPage();
  } else {
    window.addEventListener("cnvn:page-revealed", revealContactPage, { once: true });
  }
})();
