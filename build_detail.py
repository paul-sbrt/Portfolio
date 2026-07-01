#!/usr/bin/env python3
"""Generate one detail page per featured project from projects.json.

Static-site build step: reads projects.json and writes projects/<slug>.html
for every entry with "featured": true. One flexible template adapts to the
data — hero highlight, optional status line, optional "key outcomes" list,
a gallery of any length, an optional video panel, and the CTA. Assets are
referenced with ../ because pages live in the projects/ subdirectory.

Run from the repo root:  python3 build_detail.py
"""
import html
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "projects.json")
OUT_DIR = os.path.join(ROOT, "projects")

# Kept identical to the other pages so Chantier 5 can swap it everywhere at once.
DOMAIN = "https://YOUR-DOMAIN.com"


def esc(text):
    return html.escape(str(text or ""), quote=True)


def asset(path):
    """Rewrite a data asset path (./images/x) for a page in projects/."""
    p = str(path or "")
    if p.startswith("./"):
        return "../" + p[2:]
    if p.startswith("/") or p.startswith("http"):
        return p
    return "../" + p


def og_abs(path):
    """Absolute URL for OG image from a ./images/x path."""
    p = str(path or "")
    if p.startswith("http"):
        return p
    p = p.lstrip("./").lstrip("/")
    return f"{DOMAIN}/{p}"


def render_gallery(gallery):
    figs = []
    for shot in gallery:
        src = asset(shot.get("src"))
        alt = esc(shot.get("alt"))
        caption = esc(shot.get("caption"))
        figcaption = f"\n              <figcaption>{caption}</figcaption>" if caption else ""
        figs.append(
            f"""            <figure class="detail-shot">
              <div class="detail-shot-frame">
                <img src="{src}" alt="{alt}" loading="lazy" data-full="{src}" />
              </div>{figcaption}
            </figure>"""
        )
    return "\n".join(figs)


def render_impact(impact):
    if not impact:
        return ""
    items = "\n".join(f"            <li>{esc(i)}</li>" for i in impact)
    return f"""
      <section class="container ms-section" id="detail-outcomes">
        <h2 class="sub-title">Key outcomes</h2>
        <div class="ms-panel">
          <ul class="ms-impact">
{items}
          </ul>
        </div>
      </section>
"""


def render_video(video):
    if not video or not video.get("url"):
        return ""
    heading = esc(video.get("heading", "Video walkthrough"))
    body = esc(video.get("body", ""))
    url = esc(video.get("url"))
    label = esc(video.get("label", "Watch the video"))
    body_html = f'\n            <p class="ms-lead ms-lead--compact">{body}</p>' if body else ""
    return f"""
        <div class="ms-panel detail-video-panel">
          <div class="detail-video-copy">
            <h2 class="sub-title">{heading}</h2>{body_html}
          </div>
          <a class="btn detail-video-btn" href="{url}" target="_blank" rel="noopener noreferrer"
            ><i class="fa-solid fa-circle-play"></i> {label}</a
          >
        </div>
"""


def render_page(project):
    detail = project.get("detail", {})
    slug = project["slug"]
    title = esc(project["title"])
    summary = esc(project.get("summary", ""))
    hat = (project.get("hats") or ["Web"])[0]

    tagline = esc(detail.get("tagline", ""))
    highlight = esc(detail.get("highlight", project["title"]))
    heading = esc(detail.get("heading", ""))
    lead = esc(detail.get("lead", project.get("summary", "")))
    status = esc(detail.get("status", ""))
    context = detail.get("context") or {}
    context_heading = esc(context.get("heading", "Project context"))
    context_body = esc(context.get("body", ""))
    gallery_title = esc(detail.get("galleryTitle", "Gallery"))
    gallery_lead = esc(detail.get("galleryLead", ""))
    cta = detail.get("cta") or {}
    cta_heading = esc(cta.get("heading", "Interested?"))
    cta_body = esc(cta.get("body", ""))

    og_image = og_abs(project.get("image"))
    status_html = f'\n          <p class="detail-status">{status}</p>' if status else ""
    tagline_html = f'<p class="ms-tagline">{tagline}</p>\n          ' if tagline else ""
    context_html = (
        f"""
          <div class="ms-note-card">
            <h3>{context_heading}</h3>
            <p>{context_body}</p>
          </div>"""
        if context_body
        else ""
    )
    gallery_lead_html = (
        f'\n        <p class="ms-lead ms-lead--compact">{gallery_lead}</p>' if gallery_lead else ""
    )

    return f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script>
      // Set theme before paint to avoid flash of incorrect theme.
      (function () {{
        try {{
          var t = localStorage.getItem("theme");
          if (!t)
            t = matchMedia("(prefers-color-scheme: light)").matches
              ? "light"
              : "dark";
          document.documentElement.setAttribute("data-theme", t);
        }} catch (e) {{}}
      }})();
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — Paul Sabourault</title>
    <meta name="description" content="{summary}" />
    <!-- TODO: replace YOUR-DOMAIN.com with the production URL -->
    <link rel="canonical" href="{DOMAIN}/projects/{slug}.html" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{summary}" />
    <meta property="og:url" content="{DOMAIN}/projects/{slug}.html" />
    <meta property="og:image" content="{og_image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../style.css" />
    <link rel="stylesheet" href="../microsoft.css" />
    <script src="https://kit.fontawesome.com/5d10eb0d43.js" defer crossorigin="anonymous"></script>
    <script src="../theme.js" defer></script>
  </head>

  <body data-hat="{esc(hat)}">
    <div class="ms-nav-shell">
      <div class="container">
        <div class="header-sticky">
          <div class="nom">
            <a href="../index.html#header"
              ><div class="nom-text"><span>P</span>aul <span>S</span>abourault</div></a
            >
          </div>
          <nav>
            <ul id="sidemenu">
              <li><a href="../index.html#header">Home</a></li>
              <li><a href="../index.html#about">About</a></li>
              <li><a href="../index.html#projects">Projects</a></li>
              <li>
                <a class="nav-microsoft-highlight" href="../index.html#projects"
                  >Microsoft</a
                >
              </li>
              <li><a href="../index.html#contact">Contact</a></li>
              <i class="fa-solid fa-xmark"></i>
            </ul>
            <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Passer en thème clair"><i class="fa-solid fa-moon"></i></button>
            <i class="fa-solid fa-bars"></i>
          </nav>
        </div>
      </div>
    </div>

    <main class="ms-report-shell detail-shell">
      <header class="container ms-section ms-hero detail-hero--simple" id="detail-top">
        <div class="ms-hero-copy">
          {tagline_html}<h1 class="sub-title">
            <span class="ms-highlight">{highlight}</span> {heading}
          </h1>
          <p class="ms-lead">{lead}</p>{status_html}{context_html}
        </div>
      </header>
{render_impact(detail.get("impact"))}
      <section class="container ms-section" id="detail-gallery">
        <h2 class="sub-title">{gallery_title}</h2>{gallery_lead_html}

        <div class="ms-panel">
          <div class="detail-gallery">
{render_gallery(detail.get("gallery", []))}
          </div>
        </div>
{render_video(detail.get("video"))}      </section>

      <div class="detail-lightbox" id="detailLightbox" aria-hidden="true">
        <button class="detail-lightbox-close" id="detailLightboxClose" aria-label="Close gallery view">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="detail-lightbox-media">
          <img id="detailLightboxImg" src="" alt="" />
          <p id="detailLightboxCaption"></p>
        </div>
      </div>

      <section class="container ms-section">
        <div class="ms-panel detail-cta">
          <div>
            <h2 class="sub-title">{cta_heading}</h2>
            <p class="ms-lead ms-lead--compact">{cta_body}</p>
          </div>
          <div class="detail-cta-actions">
            <a class="btn btn2" href="../index.html#contact">Book a walkthrough</a>
            <a class="btn detail-back-btn" href="../index.html#projects"
              ><i class="fa-solid fa-arrow-left"></i> Back to all projects</a
            >
          </div>
        </div>
      </section>

      <footer>
        <p>Copyright<i class="fa-regular fa-copyright"></i> Paul Sabourault</p>
      </footer>
    </main>

    <script src="../app.js" defer></script>
    <script src="../lightbox.js"></script>
  </body>
</html>
"""


def main():
    with open(DATA, encoding="utf-8") as f:
        projects = json.load(f)

    os.makedirs(OUT_DIR, exist_ok=True)
    featured = [p for p in projects if p.get("featured")]
    for project in featured:
        path = os.path.join(OUT_DIR, f"{project['slug']}.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(render_page(project))
        print(f"generated projects/{project['slug']}.html")
    print(f"done — {len(featured)} detail page(s)")


if __name__ == "__main__":
    main()
