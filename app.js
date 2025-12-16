let tabLinks = document.querySelectorAll(".tab-links");
let tabContent = document.querySelectorAll(".tab-content");
const hasTabData =
  typeof displaySkills === "function" ||
  typeof displayExperience === "function" ||
  typeof displayStudies === "function";

if (tabLinks.length && hasTabData) {
  // Gestionnaire d'événements de clic pour les liens des onglets
  tabLinks.forEach((link, i) => {
    link.addEventListener("click", () => {
      // Ajouter la classe "active-link" au lien cliqué
      tabLinks.forEach((otherLink) => {
        otherLink.classList.remove("active-link");
      });
      link.classList.add("active-link");

      // Afficher le contenu correspondant en fonction de l'onglet cliqué
      tabContent.forEach((content) => {
        content.classList.remove("active-tab");
      });
      if (tabContent[i]) {
        tabContent[i].classList.add("active-tab");
      }

      // Appeler la fonction correspondante pour charger et afficher les données
      if (i === 0 && typeof displaySkills === "function") {
        displaySkills();
      } else if (i === 1 && typeof displayExperience === "function") {
        displayExperience();
      } else if (i === 2 && typeof displayStudies === "function") {
        displayStudies();
      }
    });
  });

  if (typeof displaySkills === "function") {
    displaySkills();
  }
}

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
