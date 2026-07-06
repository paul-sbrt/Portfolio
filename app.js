const tabLinks = Array.from(document.querySelectorAll(".tab-links"));
const tabContent = Array.from(document.querySelectorAll(".tab-content"));
const tabSlider = document.querySelector("[data-tab-slider]");
const tabTrack = tabSlider
  ? tabSlider.querySelector(".tab-panels-track")
  : null;
let activeTabIndex = 0;

// The tab system drives all four panels: Skills / Experience / Studies / Certifications.
const tabDataLoaders = [
  typeof displaySkills === "function" ? displaySkills : null,
  typeof displayExperience === "function" ? displayExperience : null,
  typeof displayStudies === "function" ? displayStudies : null,
  typeof displayCertifications === "function" ? displayCertifications : null,
];

const hasTabData = tabDataLoaders.some((loader) => typeof loader === "function");
const loadedTabs = new Set();

const loadTabData = (index) => {
  const loader = tabDataLoaders[index];
  if (typeof loader !== "function" || loadedTabs.has(index)) {
    return;
  }
  loader();
  loadedTabs.add(index);
};

const syncPanelHeight = () => {
  if (!tabSlider) return;
  if (window.innerWidth > 600) {
    tabSlider.style.height = "";
    return;
  }

  const activePanel = tabContent[activeTabIndex];
  tabSlider.style.height = activePanel ? `${activePanel.offsetHeight}px` : "auto";
};

const getSlideOffset = (index) => {
  if (window.innerWidth > 600) {
    return 0;
  }

  let offset = 0;
  for (let i = 0; i < index; i += 1) {
    offset += tabContent[i] ? tabContent[i].offsetHeight : 0;
  }
  return offset;
};

const syncTabSlider = (animate = true) => {
  if (!tabTrack) return;
  if (window.innerWidth > 600) {
    tabTrack.style.transition = "";
    tabTrack.style.transform = "";
    syncPanelHeight();
    return;
  }

  const offset = getSlideOffset(activeTabIndex);
  tabTrack.style.transition = animate ? "transform 0.35s ease" : "none";
  tabTrack.style.transform = `translateY(-${offset}px)`;
  syncPanelHeight();
};

const ensurePanelsBefore = (index) => {
  for (let i = 0; i <= index; i += 1) {
    loadTabData(i);
  }
};

// Gliding rose→gold indicator under the active tab (segmented switch motion).
const tabTitle = document.querySelector(".tab-title");
const tabIndicator = tabTitle ? tabTitle.querySelector(".tab-ind") : null;
const positionTabIndicator = () => {
  if (!tabIndicator || !tabLinks.length) return;
  const active = tabLinks[activeTabIndex];
  if (!active) return;
  // Thin rose→gold filet sitting on the hairline, under the active label
  // (width = label's; y = bottom of the label's row, so wrapping is handled).
  tabIndicator.style.width = active.offsetWidth + "px";
  tabIndicator.style.transform =
    "translate(" + active.offsetLeft + "px, " +
    (active.offsetTop + active.offsetHeight - 2) + "px)";
  tabIndicator.style.opacity = "1";
};

const setActiveTab = (index, options = {}) => {
  if (!tabLinks.length || typeof index !== "number") return;
  const targetIndex = Math.max(0, Math.min(index, tabLinks.length - 1));

  if (targetIndex === activeTabIndex && !options.force) {
    syncTabSlider(options.animate !== false);
    positionTabIndicator();
    return;
  }

  activeTabIndex = targetIndex;

  tabLinks.forEach((link) => link.classList.remove("active-link"));
  tabLinks[targetIndex].classList.add("active-link");

  tabContent.forEach((content) => content.classList.remove("active-tab"));
  if (tabContent[targetIndex]) {
    tabContent[targetIndex].classList.add("active-tab");
  }

  ensurePanelsBefore(targetIndex);
  syncTabSlider(options.animate !== false);
  positionTabIndicator();
};

if (tabLinks.length && hasTabData) {
  tabLinks.forEach((link, index) => {
    link.addEventListener("click", () => setActiveTab(index));
  });

  setActiveTab(0, { animate: false, force: true });
}

window.addEventListener("resize", () => {
  syncTabSlider(false);
  positionTabIndicator();
});
window.addEventListener("tabContentUpdated", () => {
  syncTabSlider(false);
});
// Re-place the indicator once webfonts settle (label widths change) and on load.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(positionTabIndicator);
}
window.addEventListener("load", positionTabIndicator);
// Labels change width on FR/EN switch — re-place after i18n has applied.
window.addEventListener("langChanged", () => {
  requestAnimationFrame(positionTabIndicator);
});

// Header: condense + tint slightly once scrolled (subtle). Fail-safe — if this
// never runs, the bar stays in its default, fully-usable state.
const stickyBar = document.querySelector(".header-sticky");
if (stickyBar) {
  const onScroll = () =>
    stickyBar.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Scroll-spy: highlight the nav link of the section in view. Progressive —
// no JS / no IntersectionObserver just means no active state; links still work.
(function () {
  const links = Array.prototype.slice.call(
    document.querySelectorAll('#sidemenu a[href^="#"]')
  );
  if (!links.length || !("IntersectionObserver" in window)) return;
  const byId = {};
  links.forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    if (id) byId[id] = a;
  });
  const sections = Object.keys(byId)
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active-link"));
        const a = byId[e.target.id];
        if (a) a.classList.add("active-link");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
})();

// ------ menu mobile ------

// Mobile burger menu — CSS drives the slide (body.menu-open); JS just toggles the
// class + locks background scroll. Closes on a nav-link tap, outside click, Escape,
// or resize. Toggling language/theme (inside the menu) does NOT close it.
const sideMenu = document.getElementById("sidemenu");
const openIcon = document.querySelector(".fa-solid.fa-bars");
const closeIcon = document.querySelector("#sidemenu .fa-solid.fa-xmark");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  if (openIcon) openIcon.setAttribute("aria-expanded", open ? "true" : "false");
}

if (openIcon) {
  openIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenu(true);
  });
}
if (closeIcon) {
  closeIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenu(false);
  });
}
if (sideMenu) {
  // close only when an actual nav link is tapped (not the toggles)
  sideMenu.querySelectorAll('a[href]').forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );
}
// click outside the panel (incl. the backdrop) closes
document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("menu-open")) return;
  if (sideMenu && sideMenu.contains(event.target)) return;
  if (openIcon && openIcon.contains(event.target)) return;
  setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => setMenu(false));
setMenu(false);
