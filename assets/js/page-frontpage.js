"use strict";

(function () {
  if (!document.body.classList.contains("page-frontpage")) return;

  function initMobileReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    var heroTimeline = window.gsap.timeline({
      paused: true,
      defaults: { duration: 0.75, ease: "power3.out" },
    });

    heroTimeline
      .from(".fp-mobile__hero .fp-mobile__kicker", { autoAlpha: 0, y: 20 })
      .from(".fp-mobile__hero-title", { autoAlpha: 0, yPercent: 30, duration: 0.9 }, "-=0.45")
      .from(".fp-mobile__hero-sub", { autoAlpha: 0, y: 24 }, "-=0.5")
      .from(".fp-mobile__hero-tagline", { autoAlpha: 0, y: 20 }, "-=0.4");

    function revealHero() { heroTimeline.play(); }

    if (window.CNVNPageRevealed) {
      revealHero();
    } else {
      window.addEventListener("cnvn:page-revealed", revealHero, { once: true });
    }

    document.querySelectorAll(".fp-mobile__heading").forEach(function (heading) {
      window.gsap.from(heading.children, {
        autoAlpha: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.11,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 84%", once: true },
      });
    });

    document.querySelectorAll(".fp-mobile__service-card").forEach(function (card, index) {
      window.gsap.from(card, {
        autoAlpha: 0,
        x: index % 2 === 0 ? -24 : 24,
        y: 20,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 92%", once: true },
      });
    });

    document.querySelectorAll(".fp-mobile__work-card").forEach(function (card) {
      window.gsap.from(card, {
        clipPath: "inset(0 0 100% 0)",
        scale: 1.06,
        duration: 1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      });
    });

    window.gsap.from(".fp-mobile__about-image", {
      clipPath: "inset(0 0 16% 0)",
      scale: 1.06,
      duration: 1.1,
      ease: "power3.inOut",
      scrollTrigger: { trigger: ".fp-mobile__about-image", start: "top 86%", once: true },
    });

    window.gsap.from(".fp-mobile__about-copy", {
      autoAlpha: 0,
      y: 48,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".fp-mobile__about-copy", start: "top 88%", once: true },
    });

    document.querySelectorAll(".fp-mobile__cta, .fp-mobile__about-footer").forEach(function (target) {
      window.gsap.from(target, {
        autoAlpha: 0,
        y: 24,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: { trigger: target, start: "top 92%", once: true },
      });
    });

    window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
  }

  if (window.matchMedia("(max-width: 767px)").matches) {
    initMobileReveals();
    return;
  }

  var stage = document.querySelector(".frontpage-stage");
  if (!stage) return;

  var lenis;

  if (window.Lenis) {
    lenis = new window.Lenis({
      wrapper: stage,
      content: document.querySelector(".frontpage-grid"),
      orientation: "horizontal",
      gestureOrientation: "both",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
  }

  function raf(time) {
    if (lenis) lenis.raf(time);
    requestAnimationFrame(raf);
  }

  function initDragScroll() {
    var isDragging = false;
    var startX = 0;
    var startScroll = 0;

    stage.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      if (event.target.closest("a, button, input, select, textarea, [role='button']")) return;
      isDragging = true;
      startX = event.clientX;
      startScroll = stage.scrollLeft;
      stage.classList.add("is-dragging");
      stage.setPointerCapture(event.pointerId);
      if (lenis) lenis.stop();
    });

    stage.addEventListener("pointermove", function (event) {
      if (!isDragging) return;
      event.preventDefault();
      stage.scrollLeft = startScroll - (event.clientX - startX);
    });

    function endDrag(event) {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove("is-dragging");
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(stage.scrollLeft, { immediate: true });
        lenis.start();
      }
    }

    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("lostpointercapture", function () {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove("is-dragging");
      if (lenis) lenis.start();
    });
  }

  function initHorizontalReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    var targets = window.gsap.utils.toArray(".frontpage-grid .grid-item:not([aria-hidden='true']):not([data-fp-cards])");
    var redBlocks = window.gsap.utils.toArray(".frontpage-grid .red-block");
    var initialRedBlocks = window.gsap.utils.toArray(".frontpage-grid .screen-1 .red-block");
    var parallaxHeadings = window.gsap.utils.toArray(".frontpage-grid .scroll-parallax");

    function splitTextIntoWords(element) {
      var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      var textNodes = [];

      while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.trim()) {
          textNodes.push(walker.currentNode);
        }
      }

      textNodes.forEach(function (textNode) {
        var fragment = document.createDocumentFragment();
        var parts = textNode.nodeValue.split(/(\s+)/);

        parts.forEach(function (part) {
          if (!part) return;

          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }

          var word = document.createElement("span");
          word.className = "reveal-word";
          word.textContent = part;
          fragment.appendChild(word);
        });

        textNode.parentNode.replaceChild(fragment, textNode);
      });
    }

    targets.forEach(splitTextIntoWords);

    for (var screenIndex = 1; screenIndex <= 5; screenIndex += 1) {
      var screenTargets = targets.filter(function (target) {
        return target.classList.contains("screen-" + screenIndex);
      });

      if (!screenTargets.length) continue;

      var isFirstScreen = screenIndex === 1;

      var screenTimeline = isFirstScreen
        ? window.gsap.timeline({ paused: true })
        : window.gsap.timeline({
            scrollTrigger: {
              trigger: screenTargets[0],
              scroller: stage,
              horizontal: true,
              start: "left 88%",
              once: true,
            },
          });

      screenTargets.forEach(function (target) {
        var words = target.querySelectorAll(".reveal-word");
        var isInlineStatement = target.querySelector(".text-inline-statement");
        var isProjectCard = target.querySelector(".fp-project-card");

        window.gsap.set(target, {
          autoAlpha: 0,
          x: isInlineStatement ? 0 : 48,
        });

        window.gsap.set(words, {
          autoAlpha: 0,
          x: isInlineStatement ? 0 : 18,
          yPercent: isInlineStatement ? 115 : 0,
          y: 0,
          rotationX: isInlineStatement ? -18 : 0,
          filter: isInlineStatement ? "blur(8px)" : "blur(0px)",
        });

        screenTimeline.to(
          target,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          isProjectCard ? "+=0.15" : undefined,
        );

        if (words.length) {
          screenTimeline.to(
            words,
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              yPercent: 0,
              rotationX: 0,
              filter: "blur(0px)",
              duration: isInlineStatement ? 0.9 : 0.42,
              stagger: isInlineStatement ? 0.11 : 0.045,
              ease: isInlineStatement ? "power3.out" : "power2.out",
            },
            isInlineStatement ? "-=0.36" : "-=0.28",
          );
        }
      });

      if (isFirstScreen) {
        (function (tl) {
          if (window.CNVNPageRevealed) {
            tl.play();
          } else {
            window.addEventListener("cnvn:page-revealed", function () { tl.play(); }, { once: true });
          }
        })(screenTimeline);
      }
    }

    window.gsap.set(initialRedBlocks, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    function revealInitialRedBlocks() {
      window.gsap.to(initialRedBlocks, {
        scaleX: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      });
    }

    if (window.CNVNPageRevealed) {
      revealInitialRedBlocks();
    } else {
      window.addEventListener("cnvn:page-revealed", revealInitialRedBlocks, { once: true });
    }

    redBlocks
      .filter(function (block) {
        return initialRedBlocks.indexOf(block) === -1;
      })
      .forEach(function (block) {
        window.gsap.fromTo(
          block,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              scroller: stage,
              horizontal: true,
              start: "left 92%",
              once: true,
            },
          },
        );
      });

    parallaxHeadings.forEach(function (heading) {
      window.gsap.fromTo(
        heading,
        {
          xPercent: 8,
        },
        {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: heading,
            scroller: stage,
            horizontal: true,
            start: "left right",
            end: "right left",
            scrub: 0.7,
          },
        },
      );
    });

    var cardsGrid = document.querySelector("[data-fp-cards]");
    if (cardsGrid) {
      var serviceCards = cardsGrid.querySelectorAll(".fp-service-card");
      window.gsap.set(serviceCards, { autoAlpha: 0, y: 28 });
      window.gsap.to(serviceCards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsGrid,
          scroller: stage,
          horizontal: true,
          start: "left 85%",
          once: true,
        },
      });
    }

    if (lenis) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }

    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  function initGridBackground() {
    var homeGrid = document.querySelector(".frontpage-grid");
    if (!homeGrid) return;

    var screenCount = 5;
    var rootStyles = window.getComputedStyle(document.documentElement);
    var screenColors = [];
    var activeScreen = -1;
    var updateFrame;

    for (var colorIndex = 1; colorIndex <= screenCount; colorIndex += 1) {
      screenColors.push(rootStyles.getPropertyValue("--home-screen-color-" + colorIndex).trim());
    }

    function updateBackground() {
      updateFrame = null;

      var screenWidth = homeGrid.scrollWidth / screenCount;
      var viewportCenter = stage.scrollLeft + stage.clientWidth / 2;
      var nextScreen = Math.min(screenCount - 1, Math.max(0, Math.floor(viewportCenter / screenWidth)));

      if (nextScreen === activeScreen) return;
      activeScreen = nextScreen;

      if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.gsap.to(homeGrid, {
          backgroundColor: screenColors[activeScreen],
          duration: 0.75,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        homeGrid.style.backgroundColor = screenColors[activeScreen];
      }
    }

    function queueUpdate() {
      if (updateFrame) return;
      updateFrame = requestAnimationFrame(updateBackground);
    }

    stage.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    updateBackground();
  }

  function initHoverSlideshows() {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll("[data-hover-slideshow]").forEach(function (slideshow) {
      if (slideshow.dataset.slideshowReady === "true") return;

      var images = Array.from(slideshow.querySelectorAll(".hover-slideshow__image"));
      var interval = Number(slideshow.dataset.slideshowInterval) || 2400;
      var activeIndex = 0;
      var slideTimer;

      function showSlide(index) {
        activeIndex = index % images.length;
        images.forEach(function (image, imageIndex) {
          image.classList.toggle("is-active", imageIndex === activeIndex);
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

      function setActive(isActive) {
        if (isActive) {
          startSlides();
        } else {
          stopSlides();
        }
      }

      slideshow.addEventListener("pointerenter", function () {
        setActive(true);
      });
      slideshow.addEventListener("pointerleave", function () {
        setActive(false);
      });
      slideshow.addEventListener("focus", function () {
        setActive(true);
      });
      slideshow.addEventListener("blur", function () {
        setActive(false);
      });
      slideshow.dataset.slideshowReady = "true";
    });
  }

  function initOrbMotion() {
    var orb = document.querySelector(".fp-orb");
    if (!orb || !window.gsap) return;

    var currentScreen = -1;
    var revealed = false;

    function getStates() {
      var sw = stage.clientWidth;
      var sh = stage.clientHeight;
      return [
        { x: sw * 0.58,          y: sh * 0.5,   scale: 1,   blur: 0,  opacity: 1    },
        { x: sw * 1 + sw * 0.33, y: sh * 1.15,  scale: 4/3, blur: 90, opacity: 0.18 },
        { x: sw * 2 + sw * 0.5,  y: sh * -0.09, scale: 4/3, blur: 90, opacity: 0.18 },
        { x: sw * 3 + sw * 0.5,  y: sh * 0.82,  scale: 4/3, blur: 90, opacity: 0.18 },
        { x: sw * 4 + sw * 0.82, y: sh * -0.3,  scale: 4/3, blur: 90, opacity: 0.18 },
      ];
    }

    var sw0 = stage.clientWidth;
    var sh0 = stage.clientHeight;
    window.gsap.set(orb, {
      xPercent: -50,
      yPercent: -50,
      x: sw0 * 0.55,
      y: sh0 * 0.5,
      scale: 0.08,
      filter: "blur(0px)",
      opacity: 1,
    });

    function revealOrb() {
      revealed = true;
      currentScreen = 0;
      window.gsap.to(orb, {
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
      });
    }

    function goToScreen(index) {
      if (!revealed || index === currentScreen) return;
      currentScreen = index;
      var states = getStates();
      var s = states[Math.min(index, states.length - 1)];
      window.gsap.to(orb, {
        x: s.x,
        y: s.y,
        scale: s.scale,
        filter: "blur(" + s.blur + "px)",
        opacity: s.opacity,
        duration: 1.8,
        ease: "sine.inOut",
        overwrite: "auto",
      });
    }

    function onScroll() {
      var screen = Math.round(stage.scrollLeft / stage.clientWidth);
      goToScreen(Math.max(0, Math.min(4, screen)));
    }

    if (window.CNVNPageRevealed) {
      revealOrb();
    } else {
      window.addEventListener("cnvn:page-revealed", revealOrb, { once: true });
    }

    stage.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", function () {
      if (!revealed || currentScreen < 0) return;
      var states = getStates();
      var s = states[Math.min(currentScreen, states.length - 1)];
      window.gsap.set(orb, { x: s.x, y: s.y });
    });
  }

  function initScrollButton() {
    var btns = document.querySelectorAll("[data-fp-scroll-next]");
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var screenWidth = stage.clientWidth;
        var target = stage.scrollLeft + screenWidth;
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.2, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
        } else {
          stage.scrollTo({ left: target, behavior: "smooth" });
        }
      });
    });
  }

  function initStatCounters() {
    var counters = document.querySelectorAll(".fp-s5-count");
    if (!counters.length || !window.gsap || !window.ScrollTrigger) return;

    counters.forEach(function (counter) {
      var target = parseInt(counter.dataset.count, 10);
      var obj = { val: 0 };

      window.gsap.set(counter, { textContent: "0+" });

      window.gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: function () {
          counter.textContent = Math.round(obj.val) + "+";
        },
        scrollTrigger: {
          trigger: counter,
          scroller: stage,
          horizontal: true,
          start: "left 90%",
          once: true,
        },
      });
    });
  }

  function initScrollBtnFade() {
    if (!window.gsap || !window.ScrollTrigger) return;

    document.querySelectorAll("[data-fp-scroll-next]").forEach(function (btn) {
      window.gsap.to(btn, {
        autoAlpha: 0,
        ease: "power1.in",
        scrollTrigger: {
          trigger: btn,
          scroller: stage,
          horizontal: true,
          start: "right 72%",
          end: "right 12%",
          scrub: 0.4,
        },
      });
    });
  }

  initDragScroll();
  initGridBackground();
  initHorizontalReveals();
  initHoverSlideshows();
  initOrbMotion();
  initScrollButton();
  initStatCounters();
  initScrollBtnFade();
  requestAnimationFrame(raf);
})();
