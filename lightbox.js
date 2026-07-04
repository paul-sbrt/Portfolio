/* Lightbox — pages détail (DA). Auto-init.
   - Toute image .dt-img (cover, galerie, visuel) → clic ouvre l'image plein écran.
     Clic lié au CADRE (.dt-shot / .dt-device / .dt-browser-shot / .dt-how-media) car
     l'overlay .dt-sweep couvre l'image et avalerait le clic.
   - Tout élément [data-video] (carte play) → clic ouvre la vidéo en modale (iframe).
   Clic hors média, croix ou Échap → ferme (et coupe la vidéo). Fail-safe : ne fait
   rien s'il n'y a ni image réelle ni vidéo. */
(function () {
  function init() {
    if (!document.querySelector("[data-detail]")) return;

    var frames = [];
    document
      .querySelectorAll(
        "[data-detail] .dt-shot, [data-detail] .dt-device, [data-detail] .dt-browser-shot, [data-detail] .dt-how-media"
      )
      .forEach(function (fr) {
        if (fr.querySelector(".dt-img")) frames.push(fr);
      });
    var videos = document.querySelectorAll("[data-detail] [data-video]");
    if (!frames.length && !videos.length) return;

    var lb = document.createElement("div");
    lb.className = "dt-lb";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<button class="dt-lb-close" type="button" aria-label="Fermer">✕</button>' +
      '<figure class="dt-lb-fig"><img alt="" /><figcaption></figcaption></figure>' +
      '<div class="dt-lb-video"><iframe title="video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
    document.body.appendChild(lb);

    var fig = lb.querySelector(".dt-lb-fig");
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    var vidWrap = lb.querySelector(".dt-lb-video");
    var iframe = lb.querySelector("iframe");
    var closeBtn = lb.querySelector(".dt-lb-close");
    var lastFocus = null;

    function show() {
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function openImage(src, alt) {
      if (!src) return;
      lastFocus = document.activeElement;
      vidWrap.style.display = "none";
      fig.style.display = "";
      lbImg.src = src;
      lbImg.alt = alt || "";
      lbCap.textContent = alt || "";
      lbCap.style.display = alt ? "" : "none";
      show();
    }
    function openVideo(url) {
      if (!url) return;
      lastFocus = document.activeElement;
      fig.style.display = "none";
      vidWrap.style.display = "block";
      iframe.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      show();
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      window.setTimeout(function () {
        lbImg.src = "";
        iframe.src = "";
      }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    frames.forEach(function (fr) {
      fr.style.cursor = "zoom-in";
      fr.addEventListener("click", function () {
        var img = fr.querySelector(".dt-img");
        if (img) openImage(img.currentSrc || img.src, img.alt);
      });
    });
    videos.forEach(function (el) {
      el.addEventListener("click", function () {
        openVideo(el.getAttribute("data-video"));
      });
    });
    closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
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
