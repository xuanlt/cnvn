"use strict";

(function () {
  if (!document.body.classList.contains("page-home")) return;

  var stage = document.querySelector(".home-stage");
  if (!stage) return;

  var lenis;

  if (window.Lenis) {
    lenis = new window.Lenis({
      wrapper: stage,
      content: document.querySelector(".home-grid"),
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

    var targets = window.gsap.utils.toArray(".home-grid .grid-item:not([aria-hidden='true'])");
    var redBlocks = window.gsap.utils.toArray(".home-grid .red-block");
    var initialRedBlocks = window.gsap.utils.toArray(".home-grid .screen-1 .red-block");
    var parallaxHeadings = window.gsap.utils.toArray(".home-grid .scroll-parallax");

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

      var screenTimeline = window.gsap.timeline({
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

        screenTimeline.to(target, {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          ease: "power3.out",
        });

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

    if (lenis) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }

    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  function initGridBackground() {
    var homeGrid = document.querySelector(".home-grid");
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

  initDragScroll();
  initGridBackground();
  initHorizontalReveals();
  requestAnimationFrame(raf);
})();
