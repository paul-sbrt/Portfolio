let tabLinks = document.querySelectorAll(".tab-links");
let tabContent = document.querySelectorAll(".tab-content");

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
    tabContent[i].classList.add("active-tab");

    // Appeler la fonction correspondante pour charger et afficher les données
    if (i === 0) {
      displaySkills();
    } else if (i === 1) {
      displayExperience();
    } else if (i === 2) {
      displayStudies();
    }
  });
});

displaySkills();

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

let swiper = new Swiper(".mySwiper", {
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
displayProjects();
// ------ menu mobile ------

let sideMenu = document.getElementById("sidemenu");
let openIcon = document.querySelector(".fa-solid.fa-bars");

function openMenu() {
  sideMenu.style.right = "0";
  openIcon.style.display = "none";
}

function closeMenu() {
  sideMenu.style.right = "-200px";
  if (window.innerWidth <= 600) {
    openIcon.style.display = "block";
  } else {
    openIcon.style.display = "none";
  }
}

sideMenu.addEventListener("click", () => {
  closeMenu();
});

window.addEventListener("resize", closeMenu);

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
