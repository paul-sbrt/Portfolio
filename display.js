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

// Fonction pour charger et afficher les compétences.
// Données groupées ([{group, skills:[{name, image?}]}]) OU plate (rétrocompat).
// Aucun niveau affiché ; l'icône est optionnelle (skills sans visuel = puce texte).
function displaySkills() {
  fetch("skill.json")
    .then((response) => response.json())
    .then((skillsData) => {
      const skillsContent = document.querySelector(".tab-content.skills");
      skillsContent.innerHTML = ""; // Vider le contenu existant

      const groups = Array.isArray(skillsData) && skillsData[0] && skillsData[0].group
        ? skillsData
        : [{ group: "", skills: skillsData }];

      groups.forEach((group) => {
        const groupEl = document.createElement("div");
        groupEl.classList.add("skills-group");

        if (group.group) {
          const groupTitle = document.createElement("h4");
          groupTitle.classList.add("skills-group-title");
          groupTitle.textContent = group.group;
          groupEl.appendChild(groupTitle);
        }

        const gridEl = document.createElement("div");
        gridEl.classList.add("skills-grid");

        (group.skills || []).forEach((skill) => {
          const skillBox = document.createElement("div");
          skillBox.classList.add("box");

          if (skill.image) {
            const skillImage = document.createElement("img");
            skillImage.src = skill.image;
            skillImage.loading = "lazy";
            skillImage.alt = skill.name;
            skillBox.appendChild(skillImage);
            skillBox.appendChild(document.createElement("br"));
          } else {
            skillBox.classList.add("box--text");
          }

          const skillName = document.createElement("span");
          skillName.textContent = skill.name;
          skillBox.appendChild(skillName);

          gridEl.appendChild(skillBox);
        });

        groupEl.appendChild(gridEl);
        skillsContent.appendChild(groupEl);
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
  const grid = document.querySelector("#project-grid");
  if (!grid) return;
  const filtersContainer = document.querySelector("#project-filters");

  fetch("projects.json")
    .then((response) => response.json())
    .then((projectData) => {
      grid.innerHTML = "";
      projectData.forEach((project) => {
        grid.appendChild(buildProjectCard(project));
      });
      buildProjectFilters(projectData, filtersContainer, grid);
    })
    .catch((error) => console.error("Error fetching projects:", error));
}

// Build one project card (createElement — no unescaped innerHTML).
function buildProjectCard(project) {
  const hats = Array.isArray(project.hats) ? project.hats : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const isFeatured = Boolean(project.featured && project.slug);

  const card = document.createElement("a");
  card.className = "project-card";
  card.dataset.hats = hats.join("|");
  if (isFeatured) {
    card.href = `projects/${project.slug}.html`;
  } else {
    card.href = project.externalUrl || project.link || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
  }
  card.setAttribute("aria-label", `Open ${project.title}`);

  const thumb = document.createElement("div");
  thumb.className = "project-card-thumb";
  const img = document.createElement("img");
  img.src = project.image;
  img.alt = project.title;
  img.loading = "lazy";
  thumb.appendChild(img);

  const body = document.createElement("div");
  body.className = "project-card-body";

  const title = document.createElement("h3");
  title.textContent = project.title;
  body.appendChild(title);

  if (tags.length) {
    const tagRow = document.createElement("div");
    tagRow.className = "project-tags";
    tags.forEach((t) => {
      const chip = document.createElement("span");
      chip.className = "project-tag";
      chip.textContent = t;
      tagRow.appendChild(chip);
    });
    body.appendChild(tagRow);
  }

  const summary = document.createElement("p");
  summary.className = "project-summary";
  summary.textContent = project.summary || project.description || "";
  body.appendChild(summary);

  const foot = document.createElement("div");
  foot.className = "project-card-foot";
  hats.forEach((h) => {
    const hatChip = document.createElement("span");
    hatChip.className = "project-hat";
    hatChip.dataset.hat = h;
    hatChip.textContent = h;
    foot.appendChild(hatChip);
  });
  const arrow = document.createElement("i");
  arrow.className = isFeatured
    ? "fa-solid fa-arrow-right project-card-arrow"
    : "fa-solid fa-arrow-up-right-from-square project-card-arrow";
  foot.appendChild(arrow);
  body.appendChild(foot);

  card.appendChild(thumb);
  card.appendChild(body);
  return card;
}

// Build the hat filter bar and wire it to show/hide cards.
function buildProjectFilters(projectData, filtersContainer, grid) {
  if (!filtersContainer) return;
  const hatSet = [];
  projectData.forEach((p) => {
    (p.hats || []).forEach((h) => {
      if (!hatSet.includes(h)) hatSet.push(h);
    });
  });

  filtersContainer.innerHTML = "";
  const filters = ["all", ...hatSet];
  filters.forEach((filter, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "filter-chip" + (index === 0 ? " is-active" : "");
    chip.dataset.filter = filter;
    if (filter !== "all") chip.dataset.hat = filter;
    chip.textContent = filter === "all" ? "All" : filter;
    chip.addEventListener("click", () => applyFilter(filter, filtersContainer, grid));
    filtersContainer.appendChild(chip);
  });
}

function applyFilter(filter, filtersContainer, grid) {
  filtersContainer.querySelectorAll(".filter-chip").forEach((c) => {
    c.classList.toggle("is-active", c.dataset.filter === filter);
  });
  grid.querySelectorAll(".project-card").forEach((card) => {
    const hats = (card.dataset.hats || "").split("|").filter(Boolean);
    const show = filter === "all" || hats.includes(filter);
    card.style.display = show ? "" : "none";
  });
}

displayProjects();
