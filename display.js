function emitTabContentUpdated() {
  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function"
  ) {
    window.dispatchEvent(new CustomEvent("tabContentUpdated"));
  }
}

// --- Certification field extraction (single source of truth) ---
function certName(cert) {
  return cert.name || cert.title || cert.code || "Certification";
}

function certYear(cert) {
  return cert.date ? String(cert.date) : cert.year ? String(cert.year) : "";
}

function certUrl(cert) {
  const official = cert.officialUrl && cert.officialUrl.trim();
  const credential = cert.credentialUrl && cert.credentialUrl.trim();
  return (
    official ||
    credential ||
    `https://learn.microsoft.com/credentials/certifications/search/?terms=${encodeURIComponent(
      cert.code || certName(cert)
    )}`
  );
}

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
        skillImage.loading = "lazy";
        skillImage.alt = skill.name;

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
      emitTabContentUpdated();
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
        experienceImage.loading = "lazy";
        experienceImage.alt = experience.company || experience.position || "";

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
      emitTabContentUpdated();
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
        studyImage.loading = "lazy";
        studyImage.alt = study.institution || "";

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
      emitTabContentUpdated();
    })
    .catch((error) => console.error("Error loading studies data:", error));
}


// Fonction pour charger et afficher les certifications (minimal: nom + année + lien officiel)
function displayCertifications() {
  fetch("certifications.json")
    .then((response) => response.json())
    .then((certData) => {
      const certContainer = document.querySelector(".tab-content.certifications");
      if (!certContainer) return;

      certContainer.innerHTML = "";

      certData.forEach((cert) => {
        const name = certName(cert);
        const issuer = cert.issuer || "Microsoft";
        const year = certYear(cert);
        const url = certUrl(cert);

        const card = document.createElement("a");
        card.classList.add("cert-card");
        card.href = url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.title = `Voir le détail ${name}`;

        const main = document.createElement("div");
        main.classList.add("cert-main");

        if (cert.code) {
          const codeEl = document.createElement("span");
          codeEl.classList.add("cert-code");
          codeEl.textContent = cert.code;
          main.appendChild(codeEl);
        }

        const copy = document.createElement("div");
        copy.classList.add("cert-copy");

        const nameEl = document.createElement("div");
        nameEl.classList.add("cert-name");
        nameEl.textContent = name;
        copy.appendChild(nameEl);

        if (issuer) {
          const issuerEl = document.createElement("div");
          issuerEl.classList.add("cert-issuer");
          issuerEl.textContent = issuer;
          copy.appendChild(issuerEl);
        }

        main.appendChild(copy);

        const meta = document.createElement("div");
        meta.classList.add("cert-meta-block");

        if (year) {
          const yearEl = document.createElement("span");
          yearEl.classList.add("cert-year");
          yearEl.textContent = year;
          meta.appendChild(yearEl);
        }

        const arrow = document.createElement("span");
        arrow.classList.add("cert-arrow");
        arrow.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
        meta.appendChild(arrow);

        card.appendChild(main);
        card.appendChild(meta);
        certContainer.appendChild(card);
      });
      emitTabContentUpdated();
    })
    .catch((error) => console.error("Error loading certifications:", error));
}

function displayProjects() {
  fetch("projects.json")
    .then((response) => response.json())
    .then((projectData) => {
      const projectsContainer = document.querySelector(".swiper-wrapper");

      projectData.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("work", "swiper-slide");

        const imgElement = document.createElement("img");
        imgElement.src = project.image;
        imgElement.alt = project.title;
        imgElement.loading = "lazy";

        const layerElement = document.createElement("div");
        layerElement.classList.add("layer");

        const titleElement = document.createElement("h3");
        titleElement.textContent = project.title;

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = project.summary || project.description || "";

        // Featured projects link to their generated detail page (same tab);
        // everything else links out to its live/external URL (new tab).
        const linkElement = document.createElement("a");
        if (project.featured && project.slug) {
          linkElement.href = `projects/${project.slug}.html`;
        } else {
          linkElement.href = project.externalUrl || project.link || "#";
          linkElement.target = "_blank";
          linkElement.rel = "noopener noreferrer";
        }
        const arrowIcon = document.createElement("i");
        arrowIcon.classList.add("fa-solid", "fa-arrow-up-right-from-square");
        linkElement.appendChild(arrowIcon);

        layerElement.appendChild(titleElement);
        layerElement.appendChild(descriptionElement);
        layerElement.appendChild(linkElement);

        projectElement.appendChild(imgElement);
        projectElement.appendChild(layerElement);

        projectsContainer.appendChild(projectElement);
      });
    })
    .catch((error) => console.error("Error fetching projects:", error));
}

displayProjects();
