// Theme toggle — wires the header button to the data-theme already set in <head>.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function syncIcon() {
    if (!btn) return;
    // The sun/moon SVG morphs purely from CSS ([data-theme]); we only keep the
    // accessible label/state in sync here.
    var isLight = current() === "light";
    var isEn = root.lang === "en";
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute(
      "aria-label",
      isLight
        ? isEn
          ? "Switch to dark theme"
          : "Passer en thème sombre"
        : isEn
        ? "Switch to light theme"
        : "Passer en thème clair"
    );
  }

  syncIcon();

  if (btn) {
    btn.addEventListener("click", function () {
      var next = current() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      syncIcon();
    });
  }

  // Keep the theme-toggle label in the active language when it changes.
  window.addEventListener("langChanged", syncIcon);
})();
