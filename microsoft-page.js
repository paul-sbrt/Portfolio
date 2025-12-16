function safeLearnSearchUrl(codeOrName) {
  const q = encodeURIComponent(codeOrName || "Microsoft certification");
  return `https://learn.microsoft.com/credentials/certifications/search/?terms=${q}`;
}

function renderCertifications(certs) {
  const container = document.getElementById("certifications-list");
  if (!container) return;
  container.innerHTML = "";

  certs.forEach((c) => {
    const name = c.name || c.title || c.code || "Certification";
    const year = c.date || c.year || "";
    const url = (c.officialUrl && c.officialUrl.trim()) ||
                (c.credentialUrl && c.credentialUrl.trim()) ||
                safeLearnSearchUrl(c.code || name);

    const card = document.createElement("div");
    card.className = "ms-cert";
    card.innerHTML = `
      <div>
        <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>
        ${year ? `<div class="ms-cert-year">${year}</div>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderMsProjects(projects) {
  const grid = document.getElementById("ms-projects-grid");
  if (!grid) return;
  grid.innerHTML = "";

  projects.forEach((p) => {
    const img = p.image || "./images/powerBI.png";
    const title = p.title || "Project";
    const year = p.year ? String(p.year) : "";
    const type = p.type || "";
    const cert = p.certification || "";
    const context = p.context || p.description || "";
    const tech = Array.isArray(p.tech) ? p.tech : [];
    const impact = Array.isArray(p.impact) ? p.impact : [];
    const link = (p.link || "").trim();

    const metaParts = [year, type, cert ? `Linked to ${cert}` : ""].filter(Boolean);
    const meta = metaParts.join(" • ");

    const openSameTab = Boolean(p.openInSameTab);
    const wrapperTag = link ? "a" : "div";
    const card = document.createElement(wrapperTag);
    card.className = "ms-card";
    if (link) {
      card.href = link;
      if (!openSameTab) {
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      } else {
        card.removeAttribute("target");
        card.removeAttribute("rel");
      }
      card.setAttribute("aria-label", `Ouvrir ${title}`);
    }

    card.innerHTML = `
      <div class="ms-card-thumb">
        <img src="${img}" alt="${title}" loading="lazy" />
      </div>
      <div class="ms-card-body">
        <h3>${title}</h3>
        ${meta ? `<div class="ms-meta">${meta}</div>` : ""}
        ${tech.length ? `<div class="ms-tags">${tech.map(t => `<span class="ms-tag">${t}</span>`).join("")}</div>` : ""}
        ${context ? `<p>${context}</p>` : ""}
        ${impact.length ? `<ul class="ms-impact">${impact.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateMsKpis(certs, projects) {
  const certTotal = Array.isArray(certs) ? certs.length : 0;
  const projectTotal = Array.isArray(projects) ? projects.length : 0;

  const certEl = document.getElementById("ms-kpi-certifications");
  if (certEl) certEl.textContent = certTotal;

  const projEl = document.getElementById("ms-kpi-projects");
  if (projEl) projEl.textContent = projectTotal;
}

Promise.all([
  fetch("./certifications.json").then(r => r.json()).catch(() => []),
  fetch("./ms-projects.json").then(r => r.json()).catch(() => [])
]).then(([certs, projects]) => {
  renderCertifications(Array.isArray(certs) ? certs : []);
  renderMsProjects(Array.isArray(projects) ? projects : []);
  updateMsKpis(certs, projects);
}).catch((e) => console.error(e));
