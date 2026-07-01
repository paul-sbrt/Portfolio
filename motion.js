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
