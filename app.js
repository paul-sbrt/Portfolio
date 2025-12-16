const tabLinks = Array.from(document.querySelectorAll(".tab-links"));
const tabContent = Array.from(document.querySelectorAll(".tab-content"));
const tabSlider = document.querySelector("[data-tab-slider]");
const tabTrack = tabSlider
  ? tabSlider.querySelector(".tab-panels-track")
  : null;
let activeTabIndex = 0;

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

const setActiveTab = (index, options = {}) => {
  if (!tabLinks.length || typeof index !== "number") return;
  const targetIndex = Math.max(0, Math.min(index, tabLinks.length - 1));

  if (targetIndex === activeTabIndex && !options.force) {
    syncTabSlider(options.animate !== false);
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
};

if (tabLinks.length && hasTabData) {
  tabLinks.forEach((link, index) => {
    link.addEventListener("click", () => setActiveTab(index));
  });

  setActiveTab(0, { animate: false, force: true });
}

window.addEventListener("resize", () => syncTabSlider(false));
window.addEventListener("tabContentUpdated", () => {
  syncTabSlider(false);
});

// scroll nav
const nomDiv = document.querySelector(".nom");

window.addEventListener("scroll", function () {
  if (window.scrollY === 0) {
    // Scroll is at the top of the page
    nomDiv.style.visibility = "visible";
  } else {
    // Scroll is not at the top of the page
    nomDiv.style.visibility = "hidden";
  }
});

// -----Slide projects----

const swiperContainer = document.querySelector(".mySwiper");
let swiper = null;

if (typeof Swiper !== "undefined" && swiperContainer) {
  swiper = new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 55,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
    keyboard: {
      enabled: true,
    },
    mousewheel: true,

    pagination: {
      el: ".swiper-pagination",
      clickable: false,
      dynamicBullets: true,
      loop: true,
    },

    navigation: {
      prevEl: ".swiper-button-prev",
      nextEl: ".swiper-button-next",
    },
  });
}

// ------ menu mobile ------

let sideMenu = document.getElementById("sidemenu");
let openIcon = document.querySelector(".fa-solid.fa-bars");
let closeIcon = document.querySelector("#sidemenu .fa-solid.fa-xmark");

function openMenu() {
  if (!sideMenu) return;
  sideMenu.style.right = "0";
  if (openIcon && window.innerWidth <= 600) {
    openIcon.style.display = "none";
  }
}

function closeMenu() {
  if (!sideMenu) return;
  sideMenu.style.right = "-200px";
  if (openIcon) {
    openIcon.style.display = window.innerWidth <= 600 ? "block" : "none";
  }
}

if (openIcon) {
  openIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    openMenu();
  });
}

if (closeIcon) {
  closeIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    closeMenu();
  });
}

if (sideMenu) {
  sideMenu.addEventListener("click", () => {
    closeMenu();
  });
}

window.addEventListener("resize", closeMenu);
closeMenu();

// ---- responsive slide ----

if (swiper) {
  const updateSlidesPerView = () => {
    swiper.params.slidesPerView = window.innerWidth < 600 ? 1 : 2;
    swiper.update();
  };

  window.addEventListener("resize", updateSlidesPerView);
  updateSlidesPerView(); // initial sync
}
