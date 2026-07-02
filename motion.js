// Progressive reveal on scroll. Elements with .reveal fade/slide in when they
// enter the viewport. Respects prefers-reduced-motion and degrades gracefully
// (everything shown) when IntersectionObserver is unavailable.
(function () {
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAll(els) {
    els.forEach(function (el) {
      el.classList.add("in");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      showAll(els);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    // Paint the initial (hidden) state before observing, so above-the-fold
    // elements animate on load instead of appearing already-revealed.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        els.forEach(function (el) {
          io.observe(el);
        });
      });
    });
  });
})();

// About story reveal — ONE-SHOT. The story eases in the first time the section
// scrolls into view, then stays put: .rv-in is added once and the element is
// unobserved (no replay on scroll up/down, no exit animation).
// Fail-safe: everything shown under reduced-motion or without IntersectionObserver.
(function () {
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    var els = Array.prototype.slice.call(document.querySelectorAll(".rv"));
    if (!els.length) return;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("rv-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rv-in");
            io.unobserve(entry.target); // reveal once, then leave it alone
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        els.forEach(function (el) {
          io.observe(el);
        });
      });
    });
  });
})();

// CONTINUOUS scroll parallax on the About portrait — the photo and its colour
// plate drift together as the section passes through the viewport (stays live the
// whole time it's on screen, distinct from the one-shot entrance above). Writes a
// single --parallax var on .about-photo, inherited by the frame + caption.
// Disabled under reduced-motion; a no-op without IntersectionObserver (var stays
// 0, so the photo simply sits still and framed).
(function () {
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  document.addEventListener("DOMContentLoaded", function () {
    var host = document.querySelector(".about-photo");
    if (!host) return;

    var FRAME_AMP = 22; // photo + plate drift (px, top-to-bottom of the pass)
    var ticking = false;
    var visible = true;

    function update() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var r = host.getBoundingClientRect();
      var center = r.top + r.height / 2;
      // progress: -1 when centre is at viewport bottom, +1 at the top.
      var progress = (vh / 2 - center) / (vh / 2 + r.height / 2);
      if (progress < -1) progress = -1;
      if (progress > 1) progress = 1;
      host.style.setProperty("--parallax", (progress * FRAME_AMP).toFixed(1) + "px");
    }

    function onScroll() {
      if (!visible || ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    // Only listen while the photo is actually on screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) onScroll();
      }, { rootMargin: "12% 0px" }).observe(host);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  });
})();
