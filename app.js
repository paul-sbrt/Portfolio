let tabLinks = document.querySelectorAll(".tab-links");
let tabContent = document.querySelectorAll(".tab-content");

tabLinks.forEach((link, i) => {
  link.addEventListener("click", () => {
    // Ajouter la classe "active-link" au lien cliqué
    tabLinks.forEach((otherLink) => {
      otherLink.classList.remove("active-link");
    });
    link.classList.add("active-link");

    // Faire de même avec le contenu des onglets
    tabContent.forEach((content) => {
      content.classList.remove("active-tab");
    });
    tabContent[i].classList.add("active-tab");
  });
});

// -----Slide projects----

var swiper = new Swiper(".mySwiper", {
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
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

// ------ menu mobile ------

let sideMenu = document.getElementById("sidemenu");
let openIcon = document.querySelector(".fa-solid.fa-bars");

function openMenu() {
  sideMenu.style.right = "0";
  openIcon.style.display = "none";
}

function closeMenu() {
  sideMenu.style.right = "-200px";
  openIcon.style.display = "block";
}

sideMenu.addEventListener("click", () => {
  closeMenu();
});

// ---- responsive slide ----

window.addEventListener("resize", function () {
  if (window.innerWidth < 600) {
    swiper.params.slidesPerView = 1;
    swiper.update(); // Mettre à jour le Swiper avec la nouvelle configuration
  } else {
    swiper.params.slidesPerView = 2; // Revenir à la configuration par défaut
    swiper.update();
  }
});

// Appeler la fonction de mise à jour une fois au chargement initial
if (window.innerWidth < 600) {
  swiper.params.slidesPerView = 1;
  swiper.update();
}
