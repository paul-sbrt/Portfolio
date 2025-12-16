(function () {
  function initLightbox(config) {
    if (!config) return;
    const shots = document.querySelectorAll(config.shotSelector);
    const lightbox = document.getElementById(config.lightboxId);
    const lightboxImg = document.getElementById(config.lightboxImgId);
    const captionEl = config.captionId
      ? document.getElementById(config.captionId)
      : null;
    const closeBtn = config.closeBtnId
      ? document.getElementById(config.closeBtnId)
      : null;

    if (!shots.length || !lightbox || !lightboxImg) return;

    const toggleBodyScroll = (enable) => {
      if (!config.bodyClass) return;
      document.body.classList.toggle(config.bodyClass, enable);
    };

    const setCaption = (text) => {
      if (!captionEl) return;
      captionEl.textContent = text || "";
      captionEl.style.display = text ? "block" : "none";
    };

    const openLightbox = (imgSrc, imgAlt, caption) => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt || "";
      setCaption(caption);
      lightbox.classList.add("is-visible");
      lightbox.setAttribute("aria-hidden", "false");
      toggleBodyScroll(true);
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-visible");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
      lightboxImg.alt = "";
      setCaption("");
      toggleBodyScroll(false);
    };

    shots.forEach((shot) => {
      shot.addEventListener("click", () => {
        const img = shot.querySelector("img");
        if (!img) return;
        const caption = shot.querySelector("figcaption");
        openLightbox(
          img.getAttribute("data-full") || img.src,
          img.alt || "",
          caption ? caption.textContent.trim() : ""
        );
      });
    });

    closeBtn && closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-visible")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    [
      {
        shotSelector: ".suez-shot",
        lightboxId: "suezLightbox",
        lightboxImgId: "suezLightboxImg",
        captionId: "suezLightboxCaption",
        closeBtnId: "suezLightboxClose",
        bodyClass: "suez-lightbox-open",
      },
      {
        shotSelector: ".mscd-shot",
        lightboxId: "mscdLightbox",
        lightboxImgId: "mscdLightboxImg",
        captionId: "mscdLightboxCaption",
        closeBtnId: "mscdLightboxClose",
        bodyClass: "mscd-lightbox-open",
      },
    ].forEach(initLightbox);
  });
})();
