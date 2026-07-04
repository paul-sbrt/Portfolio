/* Lightbox — pages détail (DA). Auto-init : toute image .dt-img (cover, galerie,
   visuel démarche) devient cliquable → s'ouvre en plein écran sur fond assombri.
   Clic hors image, croix ou Échap → ferme. Fail-safe : ne fait rien s'il n'y a pas
   d'images réelles (placeholders duotone non cliquables). */
(function () {
  function init() {
    var root = document.querySelector("[data-detail]");
    if (!root) return;
    var imgs = document.querySelectorAll("[data-detail] .dt-img");
    if (!imgs.length) return;

    var lb = document.createElement("div");
    lb.className = "dt-lb";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<button class="dt-lb-close" type="button" aria-label="Fermer">✕</button>' +
      '<figure class="dt-lb-fig"><img alt="" /><figcaption></figcaption></figure>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    var closeBtn = lb.querySelector(".dt-lb-close");
    var lastFocus = null;

    function open(src, alt) {
      if (!src) return;
      lastFocus = document.activeElement;
      lbImg.src = src;
      lbImg.alt = alt || "";
      lbCap.textContent = alt || "";
      lbCap.style.display = alt ? "" : "none";
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      window.setTimeout(function () { lbImg.src = ""; }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    imgs.forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        open(img.currentSrc || img.src, img.alt);
      });
    });
    closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("open")) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
