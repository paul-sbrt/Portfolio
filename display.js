// Fonction pour charger et afficher les compétences
function displaySkills() {
  fetch("skill.json")
    .then((response) => response.json())
    .then((skillsData) => {
      const skillsContent = document.querySelector(".tab-content.skills");
      skillsContent.innerHTML = ""; // Vider le contenu existant

      // Parcourir les données et créer les éléments HTML dynamiquement
      skillsData.forEach((skill) => {
        const skillBox = document.createElement("div");
        skillBox.classList.add("box");

        const skillImage = document.createElement("img");
        skillImage.src = skill.image;

        const skillName = document.createElement("span");
        skillName.textContent = skill.name;

        const skillLevel = document.createElement("p");
        skillLevel.textContent = skill.level;

        skillBox.appendChild(skillImage);
        skillBox.appendChild(document.createElement("br"));
        skillBox.appendChild(skillName);
        skillBox.appendChild(document.createElement("br"));
        skillBox.appendChild(skillLevel);

        skillsContent.appendChild(skillBox);
      });
    })
    .catch((error) => console.error("Error loading skills data:", error));
}

// Fonction pour charger et afficher l'expérience professionnelle
function displayExperience() {
  fetch("experience.json")
    .then((response) => response.json())
    .then((experienceData) => {
      const experienceContent = document.querySelector(
        ".tab-content.experience"
      );
      experienceContent.innerHTML = ""; // Vider le contenu existant

      // Parcourir les données et créer les éléments HTML dynamiquement
      experienceData.forEach((experience) => {
        const experienceBox = document.createElement("div");
        experienceBox.classList.add("box-2");

        const experienceImage = document.createElement("img");
        experienceImage.src = experience.image;

        const experiencePosition = document.createElement("span");
        experiencePosition.textContent = experience.position;

        const experienceCompany = document.createElement("p");
        experienceCompany.textContent = experience.company;

        const experienceLocation = document.createElement("p");
        experienceLocation.textContent = experience.location;

        const experienceDates = document.createElement("p");
        experienceDates.textContent = experience.dates;

        experienceBox.appendChild(experienceImage);
        experienceBox.appendChild(document.createElement("br"));
        experienceBox.appendChild(experiencePosition);
        experienceBox.appendChild(document.createElement("br"));
        experienceBox.appendChild(experienceCompany);
        experienceBox.appendChild(experienceLocation);
        experienceBox.appendChild(experienceDates);

        experienceContent.appendChild(experienceBox);
      });
    })
    .catch((error) => console.error("Error loading experience data:", error));
}

// Fonction pour charger et afficher les études
function displayStudies() {
  fetch("studies.json")
    .then((response) => response.json())
    .then((studiesData) => {
      const studiesContent = document.querySelector(".tab-content.studies");
      studiesContent.innerHTML = ""; // Vider le contenu existant

      // Parcourir les données et créer les éléments HTML dynamiquement
      studiesData.forEach((study) => {
        const studyBox = document.createElement("div");
        studyBox.classList.add("box-2");

        const studyImage = document.createElement("img");
        studyImage.src = study.image;

        const studyInstitution = document.createElement("span");
        studyInstitution.textContent = study.institution;

        const studyPlace = document.createElement("p");
        studyPlace.textContent = study.place;

        const studyDates = document.createElement("p");
        studyDates.textContent = study.dates;

        studyBox.appendChild(studyImage);
        studyBox.appendChild(document.createElement("br"));
        studyBox.appendChild(studyInstitution);
        studyBox.appendChild(document.createElement("br"));
        studyBox.appendChild(studyPlace);
        studyBox.appendChild(studyDates);

        studiesContent.appendChild(studyBox);
      });
    })
    .catch((error) => console.error("Error loading studies data:", error));
}
