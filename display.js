// --- Bilingual helpers ---
function getLang() {
  return document.documentElement.lang === "en" ? "en" : "fr";
}

// Read a possibly-bilingual value. {fr,en} -> active language (with fallback);
// a plain string is returned as-is (progressive migration).
function t(value, lang) {
  lang = lang || getLang();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (value[lang] != null) return value[lang];
    if (value.fr != null) return value.fr;
    if (value.en != null) return value.en;
    return "";
  }
  return value != null ? value : "";
}

// Detail pages are static per-language (FR at projects/, EN under en/projects/).
function detailHref(slug) {
  return getLang() === "en"
    ? `en/projects/${slug}.html`
    : `projects/${slug}.html`;
}

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
  return t(cert.name) || t(cert.title) || cert.code || "Certification";
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

// SKILLS — direction ③ « Sur la Ligne ». Un composant UNIFORME rend les 5 groupes à
// l'identique (bande typo) ; la variété vient de la data. Deux niveaux = propriété du
// composant : les skills `featured` sont les phares (Archivo 900), le reste = détail
// caché au repos + révélé au survol/focus/tap (embrasement rose→or → texte blanc).
// Data groupée ([{group:{fr,en}, skills:[{name, featured?, image?}]}]) ; icône ignorée
// (TEXTE ONLY). Bilingue via t() ; re-render sur langChanged (renderAllData).
function displaySkills() {
  fetch("skill.json")
    .then((response) => response.json())
    .then((skillsData) => {
      const panel = document.querySelector(".tab-content.skills");
      if (!panel) return;
      panel.innerHTML = "";
      const host = document.createElement("div");
      host.className = "skl-bands";
      panel.appendChild(host);

      const groups =
        Array.isArray(skillsData) && skillsData[0] && skillsData[0].group
          ? skillsData
          : [{ group: "", skills: skillsData }];

      const reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // One-shot entrance for the (dynamically built) bands — a local observer,
      // since motion.js queried the DOM before these existed.
      const io =
        "IntersectionObserver" in window
          ? new IntersectionObserver(
              function (entries) {
                entries.forEach(function (e) {
                  if (e.isIntersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                  }
                });
              },
              { threshold: 0.18 }
            )
          : null;

      groups.forEach(function (group) {
        const skills = group.skills || [];
        const flagged = skills.filter(function (s) { return s.featured; });
        // Fallback if data has no `featured`: first two are the flagships.
        const flags = flagged.length ? flagged : skills.slice(0, 2);
        const rest = flagged.length
          ? skills.filter(function (s) { return !s.featured; })
          : skills.slice(2);

        const band = document.createElement("div");
        band.className = "skl-band";
        if (/microsoft/i.test(t(group.group)) || group.hat === "ms") {
          band.dataset.hat = "ms";
        }

        // Group name — mono eyebrow (the only structural label; encodes the category).
        const eyebrow = document.createElement("p");
        eyebrow.className = "skl-eyebrow";
        eyebrow.textContent = t(group.group);
        band.appendChild(eyebrow);

        // Flagships — the interface IS the type (Archivo 900), first = anchor (gradient).
        const line = document.createElement("div");
        line.className = "skl-line";
        flags.forEach(function (s, i) {
          if (i) {
            // Middot, not a slash — several skill names already contain "/"
            // (e.g. "Flutter / Dart"), so a slash separator would read ambiguously.
            const sep = document.createElement("span");
            sep.className = "skl-sep";
            sep.textContent = "·";
            line.appendChild(sep);
          }
          const w = document.createElement("span");
          w.className = "skl-sk" + (i === 0 ? " skl-anchor" : "");
          w.textContent = t(s.name);
          line.appendChild(w);
        });
        band.appendChild(line);

        if (rest.length) {
          // Resting invitation — hidden secondaries, elegant "+N · voir plus".
          const invite = document.createElement("div");
          invite.className = "skl-invite";
          invite.setAttribute("aria-hidden", "true");
          const rule = document.createElement("span");
          rule.className = "skl-invite-rule";
          const n = document.createElement("span");
          n.className = "skl-invite-n";
          n.textContent = "+" + rest.length;
          const txt = document.createElement("span");
          txt.className = "skl-invite-txt";
          txt.textContent = t({ fr: "voir plus", en: "see all" });
          const arw = document.createElement("span");
          arw.className = "skl-invite-arw";
          arw.textContent = "→";
          invite.append(rule, n, txt, arw);
          band.appendChild(invite);

          // Hidden detail (grid-rows) — the rest, revealed with the ignition sweep.
          const detail = document.createElement("div");
          detail.className = "skl-detail";
          const inner = document.createElement("div");
          inner.className = "skl-inner";
          const row = document.createElement("div");
          row.className = "skl-row";
          rest.forEach(function (s) {
            const g = document.createElement("span");
            g.className = "skl-g";
            g.textContent = t(s.name);
            row.appendChild(g);
          });
          inner.appendChild(row);
          detail.appendChild(inner);
          band.appendChild(detail);

          // Hover = CSS. Keyboard + touch here (pin the revealed state).
          band.tabIndex = 0;
          band.setAttribute("role", "button");
          band.setAttribute("aria-expanded", "false");
          band.setAttribute(
            "aria-label",
            t(group.group) +
              t({ fr: " — voir toutes les compétences", en: " — see all skills" })
          );
          const toggle = function () {
            const on = band.classList.toggle("lit");
            band.setAttribute("aria-expanded", on ? "true" : "false");
            // Mobile: the tab-slider pins the panel height — re-measure after the
            // reveal (immediately + once the grid-rows transition settles).
            emitTabContentUpdated();
            setTimeout(emitTabContentUpdated, 600);
          };
          band.addEventListener("click", toggle);
          band.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          });
        }

        host.appendChild(band);
        if (reduce || !io) band.classList.add("in");
        else io.observe(band);
      });
      emitTabContentUpdated(); // let the mobile tab-slider re-measure this panel
    })
    .catch((error) => console.error("Error loading skills data:", error));
}

// Fonction pour charger et afficher l'expérience professionnelle
// ===== REGISTRE — ONE uniform "record row" component for the dated entries
// (experience / studies / certifications). "One component, N data": each type maps
// its JSON to the common record { title, org, place, dates, detail?, detailList?,
// href?, tag? }. Renders a full-width row — Archivo title + org·place mono, a
// right-aligned mono date-spine — with the detail revealed on hover/focus/tap
// (rose→gold ignition settling to legible --text + a vertical filet, skills-③ family).
function renderRegistre(records, container) {
  if (!container) return;
  container.innerHTML = "";
  const list = document.createElement("div");
  list.className = "reg";
  container.appendChild(list);

  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.15 }
        )
      : null;

  records.forEach(function (r, i) {
    const hasDetail = r.detail || (r.detailList && r.detailList.length);
    const item = document.createElement(r.href ? "a" : "div");
    item.className = "reg-item" + (r.href ? " is-link" : "");
    item.style.transitionDelay = (0.05 + i * 0.09).toFixed(2) + "s";
    if (r.href) {
      item.href = r.href;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
    } else if (hasDetail) {
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-expanded", "false");
    }

    const head = document.createElement("div");
    head.className = "reg-head";

    const titleline = document.createElement("div");
    titleline.className = "reg-titleline";
    if (r.tag) {
      const tag = document.createElement("span");
      tag.className = "reg-tag";
      tag.textContent = r.tag;
      titleline.appendChild(tag);
    }
    const title = document.createElement("span");
    title.className = "reg-title";
    title.textContent = r.title;
    titleline.appendChild(title);
    if (hasDetail) {
      const cue = document.createElement("span");
      cue.className = "reg-cue";
      cue.setAttribute("aria-hidden", "true");
      cue.textContent = "＋";
      titleline.appendChild(cue);
    }
    head.appendChild(titleline);

    const metaStr = [r.org, r.place].filter(Boolean).join(" · ");
    if (metaStr) {
      const meta = document.createElement("div");
      meta.className = "reg-meta";
      meta.textContent = metaStr;
      head.appendChild(meta);
    }

    if (hasDetail) {
      const detail = document.createElement("div");
      detail.className = "reg-detail";
      const inner = document.createElement("div");
      inner.className = "reg-detail-in";
      const drow = document.createElement("div");
      drow.className = "reg-drow";
      const pieces = r.detailList ? r.detailList : [r.detail];
      pieces.forEach(function (p) {
        const w = document.createElement("span");
        w.className = "reg-ignite";
        w.textContent = p;
        drow.appendChild(w);
      });
      inner.appendChild(drow);
      detail.appendChild(inner);
      head.appendChild(detail);
    }
    item.appendChild(head);

    const side = document.createElement("div");
    side.className = "reg-side";
    const dates = document.createElement("span");
    dates.className = "reg-dates";
    dates.textContent = r.dates || "";
    side.appendChild(dates);
    if (r.href) {
      const arw = document.createElement("span");
      arw.className = "reg-arrow";
      arw.setAttribute("aria-hidden", "true");
      arw.textContent = "↗";
      side.appendChild(arw);
    }
    item.appendChild(side);
    list.appendChild(item);

    // Hover = CSS. Non-link rows with detail get a keyboard/tap toggle.
    if (!r.href && hasDetail) {
      const toggle = function () {
        const on = item.classList.toggle("open");
        item.setAttribute("aria-expanded", on ? "true" : "false");
        emitTabContentUpdated();
        setTimeout(emitTabContentUpdated, 600);
      };
      item.addEventListener("click", toggle);
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    }

    if (reduce || !io) item.classList.add("in");
    else io.observe(item);
  });
  emitTabContentUpdated();
}

// Adapter — Experience → record.
function displayExperience() {
  fetch("experience.json")
    .then((response) => response.json())
    .then((data) => {
      const records = data.map(function (e) {
        return {
          title: t(e.position),
          org: e.company || "", // company is a plain string, not {fr,en}
          place: t(e.location),
          dates: t(e.dates),
          detail: e.description ? t(e.description) : null,
        };
      });
      renderRegistre(records, document.querySelector(".tab-content.experience"));
    })
    .catch((error) => console.error("Error loading experience data:", error));
}

// Adapter — Studies → record (no detail: just title + place + dates).
function displayStudies() {
  fetch("studies.json")
    .then((response) => response.json())
    .then((data) => {
      const records = data.map(function (s) {
        return {
          title: t(s.institution),
          org: "",
          place: t(s.place),
          dates: t(s.dates),
        };
      });
      renderRegistre(records, document.querySelector(".tab-content.studies"));
    })
    .catch((error) => console.error("Error loading studies data:", error));
}


// Adapter — Certifications → record (the row is an external link; skills = detail).
function displayCertifications() {
  fetch("certifications.json")
    .then((response) => response.json())
    .then((data) => {
      const records = data.map(function (c) {
        return {
          title: certName(c),
          org: t(c.issuer) || "Microsoft",
          place: "",
          dates: certYear(c),
          tag: c.code || null,
          detailList:
            Array.isArray(c.skills) && c.skills.length ? c.skills : null,
          href: certUrl(c),
        };
      });
      renderRegistre(records, document.querySelector(".tab-content.certifications"));
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
      const cards = projectData.map(buildProjectCard);
      cards.forEach((card, i) => {
        card.style.animationDelay = (i % 8) * 0.05 + "s"; // light stagger
        grid.appendChild(card);
      });
      buildProjectFilters(projectData, filtersContainer, grid);
      revealCards(cards);
    })
    .catch((error) => console.error("Error fetching projects:", error));
}

// Scroll reveal for cards, with a strong fail-safe: cards are never left
// hidden. No IntersectionObserver / reduced-motion -> show immediately; and a
// timeout un-hides any card that is on-screen but hasn't fired yet.
function revealCards(cards) {
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  cards.forEach((c) => io.observe(c));
  // fail-safe: reveal any on-screen card still hidden after a moment
  setTimeout(() => {
    cards.forEach((c) => {
      if (c.classList.contains("in")) return;
      const r = c.getBoundingClientRect();
      if (r.top < (window.innerHeight || 0) && r.bottom > 0) c.classList.add("in");
    });
  }, 1800);
}

// Build one project card (createElement — no unescaped innerHTML).
function buildProjectCard(project) {
  const hats = Array.isArray(project.hats) ? project.hats : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const isFeatured = Boolean(project.featured && project.slug);

  const card = document.createElement("a");
  card.className = "project-card card-reveal";
  card.dataset.hats = hats.join("|");
  // Real per-project brand colour (--c); falls back to the portfolio rose in CSS.
  if (project.brand) card.style.setProperty("--c", project.brand);
  if (isFeatured) {
    card.href = detailHref(project.slug);
  } else {
    card.href = project.externalUrl || project.link || "#";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
  }
  card.setAttribute("aria-label", `${project.title}`);

  // Thumb: a duotone panel in the project's colour; a real screenshot sits on
  // top when one exists (placeholder-only projects show the duotone + label).
  const thumb = document.createElement("div");
  thumb.className = "project-card-thumb";
  const mesh = document.createElement("div");
  mesh.className = "project-card-mesh";
  thumb.appendChild(mesh);

  const swatch = document.createElement("span");
  swatch.className = "project-card-swatch";
  thumb.appendChild(swatch);

  const hasImage = project.image && project.image.indexOf("placeholder") === -1;
  if (hasImage) {
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title;
    img.loading = "lazy";
    thumb.appendChild(img);
  } else {
    const cap = document.createElement("span");
    cap.className = "project-card-cap";
    cap.textContent =
      (project.detail && t(project.detail.highlight)) || project.title;
    thumb.appendChild(cap);
  }

  const body = document.createElement("div");
  body.className = "project-card-body";

  const title = document.createElement("h3");
  title.textContent = project.title;
  body.appendChild(title);

  if (tags.length) {
    const tagRow = document.createElement("div");
    tagRow.className = "project-tags";
    tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "project-tag";
      chip.textContent = tag;
      tagRow.appendChild(chip);
    });
    body.appendChild(tagRow);
  }

  const summary = document.createElement("p");
  summary.className = "project-summary";
  summary.textContent = t(project.summary) || t(project.description) || "";
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
    chip.textContent =
      filter === "all" ? (getLang() === "en" ? "All" : "Tous") : filter;
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

// Re-render every data-driven section when the language toggles (index only).
// Each renderer clears its container and rebuilds from the active language.
function renderAllData() {
  displayProjects();
  if (typeof displaySkills === "function") displaySkills();
  if (typeof displayExperience === "function") displayExperience();
  if (typeof displayStudies === "function") displayStudies();
  if (typeof displayCertifications === "function") displayCertifications();
}
window.addEventListener("langChanged", renderAllData);
