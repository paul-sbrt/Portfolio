// Theme toggle — wires the header button to the data-theme already set in <head>.
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function syncIcon() {
    if (!btn) return;
    var isLight = current() === "light";
    var icon = btn.querySelector("i");
    if (icon) icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute(
      "aria-label",
      isLight ? "Passer en thème sombre" : "Passer en thème clair"
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
})();
