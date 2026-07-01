#!/usr/bin/env python3
"""Generate bilingual detail pages (one per featured project, per language).

For every projects.json entry with "featured": true, this writes:
  - FR:  projects/<slug>.html          (root, x-default)
  - EN:  en/projects/<slug>.html

Each page has the correct <html lang>, translated <title>/description/OG,
UI chrome baked from ui.<lang>.json, hreflang alternates between the pair,
and a body[data-alt-*] so the header FR|EN toggle can navigate to the other
language. One flexible template adapts to the data (hero, optional status,
live-link buttons, key outcomes, variable gallery, optional video, CTA).

Run from the repo root:  python3 build_detail.py
"""
import html
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "projects.json")

# Kept identical to the other pages so Chantier 5 can swap it everywhere at once.
DOMAIN = "https://YOUR-DOMAIN.com"

LANGS = ("fr", "en")


def esc(text):
    return html.escape(str(text or ""), quote=True)


def T(value, lang):
    """Pick a language from a {fr,en} pair; pass plain strings through."""
    if isinstance(value, dict):
        return value.get(lang) or value.get("fr") or value.get("en") or ""
    return value if value is not None else ""


def asset(path, base):
    """Rewrite a data asset path (./images/x) for the page's directory depth."""
    p = str(path or "")
    if p.startswith("./"):
        return base + p[2:]
    if p.startswith("/") or p.startswith("http"):
        return p
    return base + p


def og_abs(path):
    p = str(path or "")
    if p.startswith("http"):
        return p
    p = p.lstrip("./").lstrip("/")
    return f"{DOMAIN}/{p}"


def is_placeholder(value):
    return "À COMPLÉTER" in str(value or "")


def render_actions(links, external_url, lang):
    items = list(links or [])
    if not items and external_url and not is_placeholder(external_url):
        items = [{"label": "Visiter", "url": external_url}]
    btns = []
    for link in items:
        url = link.get("url", "")
        if not url or is_placeholder(url):
            continue
        label = esc(T(link.get("label", "Visiter"), lang))
        btns.append(
            f'<a class="btn detail-live-btn" href="{esc(url)}" target="_blank" rel="noopener noreferrer">{label}</a>'
        )
    if not btns:
        return ""
    return '\n          <div class="detail-actions">' + "".join(btns) + "</div>"


def render_gallery(gallery, base, lang):
    figs = []
    for shot in gallery:
        src = asset(shot.get("src"), base)
        alt = esc(T(shot.get("alt"), lang))
        caption = esc(T(shot.get("caption"), lang))
        figcaption = f"\n              <figcaption>{caption}</figcaption>" if caption else ""
        figs.append(
            f"""            <figure class="detail-shot">
              <div class="detail-shot-frame">
                <img src="{src}" alt="{alt}" loading="lazy" data-full="{src}" />
              </div>{figcaption}
            </figure>"""
        )
    return "\n".join(figs)


def render_gallery_section(detail, base, lang, ui):
    gallery = detail.get("gallery", [])
    if not gallery:
        return ""
    gallery_title = esc(T(detail.get("galleryTitle", "Gallery"), lang))
    gallery_lead = esc(T(detail.get("galleryLead", ""), lang))
    gallery_lead_html = (
        f'\n        <p class="ms-lead ms-lead--compact">{gallery_lead}</p>' if gallery_lead else ""
    )
    return f"""
      <section class="container ms-section" id="detail-gallery">
        <h2 class="sub-title">{gallery_title}</h2>{gallery_lead_html}

        <div class="ms-panel">
          <div class="detail-gallery">
{render_gallery(gallery, base, lang)}
          </div>
        </div>
{render_video(detail.get("video"), lang)}      </section>

      <div class="detail-lightbox" id="detailLightbox" aria-hidden="true">
        <button class="detail-lightbox-close" id="detailLightboxClose" aria-label="{esc(ui.get('detail.close', 'Close gallery view'))}">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="detail-lightbox-media">
          <img id="detailLightboxImg" src="" alt="" />
          <p id="detailLightboxCaption"></p>
        </div>
      </div>
"""


def render_impact(impact, lang, ui):
    if not impact:
        return ""
    items = "\n".join(f"            <li>{esc(T(i, lang))}</li>" for i in impact)
    heading = esc(ui.get("detail.outcomes", "Key outcomes"))
    return f"""
      <section class="container ms-section" id="detail-outcomes">
        <h2 class="sub-title">{heading}</h2>
        <div class="ms-panel">
          <ul class="ms-impact">
{items}
          </ul>
        </div>
      </section>
"""


def render_video(video, lang):
    if not video or not video.get("url"):
        return ""
    heading = esc(T(video.get("heading", "Video walkthrough"), lang))
    body = esc(T(video.get("body", ""), lang))
    url = esc(video.get("url"))
    label = esc(T(video.get("label", "Watch the video"), lang))
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


def render_page(project, lang, ui):
    """Render one detail page. FR lives in projects/, EN in en/projects/."""
    detail = project.get("detail", {})
    slug = project["slug"]
    title = esc(project["title"])
    summary = esc(T(project.get("summary", ""), lang))
    hat = (project.get("hats") or ["Web"])[0]

    # Directory depth + URLs per language.
    if lang == "fr":
        base = "../"
        self_url = f"{DOMAIN}/projects/{slug}.html"
        alt_lang, alt_rel = "en", f"../en/projects/{slug}.html"
    else:
        base = "../../"
        self_url = f"{DOMAIN}/en/projects/{slug}.html"
        alt_lang, alt_rel = "fr", f"../../projects/{slug}.html"
    fr_url = f"{DOMAIN}/projects/{slug}.html"
    en_url = f"{DOMAIN}/en/projects/{slug}.html"

    tagline = esc(T(detail.get("tagline", ""), lang))
    highlight = esc(T(detail.get("highlight", project["title"]), lang))
    heading = esc(T(detail.get("heading", ""), lang))
    lead = esc(T(detail.get("lead", project.get("summary", "")), lang))
    status = esc(T(detail.get("status", ""), lang))
    context = detail.get("context") or {}
    context_heading = esc(T(context.get("heading", "Project context"), lang))
    context_body = esc(T(context.get("body", ""), lang))
    cta = detail.get("cta") or {}
    cta_heading = esc(T(cta.get("heading", "Interested?"), lang))
    cta_body = esc(T(cta.get("body", ""), lang))

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
    actions_html = render_actions(detail.get("links"), project.get("externalUrl"), lang)
    gallery_section = render_gallery_section(detail, base, lang, ui)

    nav_home = esc(ui.get("nav.home", "Home"))
    nav_about = esc(ui.get("nav.about", "About"))
    nav_projects = esc(ui.get("nav.projects", "Projects"))
    nav_contact = esc(ui.get("nav.contact", "Contact"))
    copyright_word = esc(ui.get("footer.copyright", "Copyright"))
    book = esc(ui.get("detail.book", "Book a walkthrough"))
    back = esc(ui.get("detail.back", "Back to all projects"))
    toggle_label = "EN" if lang == "fr" else "FR"
    toggle_aria = "Switch to English" if lang == "fr" else "Passer en français"

    return f"""<!DOCTYPE html>
<html lang="{lang}">
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
    <link rel="canonical" href="{self_url}" />
    <link rel="alternate" hreflang="fr" href="{fr_url}" />
    <link rel="alternate" hreflang="en" href="{en_url}" />
    <link rel="alternate" hreflang="x-default" href="{fr_url}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{summary}" />
    <meta property="og:url" content="{self_url}" />
    <meta property="og:image" content="{og_image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="{base}favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{base}style.css" />
    <link rel="stylesheet" href="{base}microsoft.css" />
    <script src="https://kit.fontawesome.com/5d10eb0d43.js" defer crossorigin="anonymous"></script>
    <script src="{base}theme.js" defer></script>
    <script src="{base}i18n.js" defer></script>
  </head>

  <body data-hat="{esc(hat)}" data-detail data-i18n-base="{base}" data-alt-{alt_lang}="{alt_rel}">
    <div class="ms-nav-shell">
      <div class="container">
        <div class="header-sticky">
          <div class="nom">
            <a href="{base}index.html#header"
              ><div class="nom-text"><span>P</span>aul <span>S</span>abourault</div></a
            >
          </div>
          <nav>
            <ul id="sidemenu">
              <li><a href="{base}index.html#header">{nav_home}</a></li>
              <li><a href="{base}index.html#about">{nav_about}</a></li>
              <li><a href="{base}index.html#projects">{nav_projects}</a></li>
              <li><a href="{base}index.html#contact">{nav_contact}</a></li>
              <i class="fa-solid fa-xmark"></i>
            </ul>
            <button id="lang-toggle" class="lang-toggle" type="button" aria-label="{toggle_aria}">{toggle_label}</button>
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
          <p class="ms-lead">{lead}</p>{status_html}{actions_html}{context_html}
        </div>
      </header>
{render_impact(detail.get("impact"), lang, ui)}{gallery_section}
      <section class="container ms-section">
        <div class="ms-panel detail-cta">
          <div>
            <h2 class="sub-title">{cta_heading}</h2>
            <p class="ms-lead ms-lead--compact">{cta_body}</p>
          </div>
          <div class="detail-cta-actions">
            <a class="btn btn2" href="{base}index.html#contact">{book}</a>
            <a class="btn detail-back-btn" href="{base}index.html#projects"
              ><i class="fa-solid fa-arrow-left"></i> {back}</a
            >
          </div>
        </div>
      </section>

      <footer>
        <p>{copyright_word}<i class="fa-regular fa-copyright"></i> Paul Sabourault</p>
      </footer>
    </main>

    <script src="{base}app.js" defer></script>
    <script src="{base}lightbox.js"></script>
  </body>
</html>
"""


def main():
    with open(DATA, encoding="utf-8") as f:
        projects = json.load(f)
    ui = {}
    for lang in LANGS:
        with open(os.path.join(ROOT, f"ui.{lang}.json"), encoding="utf-8") as f:
            ui[lang] = json.load(f)

    featured = [p for p in projects if p.get("featured")]
    out_dirs = {"fr": os.path.join(ROOT, "projects"),
                "en": os.path.join(ROOT, "en", "projects")}
    for d in out_dirs.values():
        os.makedirs(d, exist_ok=True)

    count = 0
    for project in featured:
        for lang in LANGS:
            path = os.path.join(out_dirs[lang], f"{project['slug']}.html")
            with open(path, "w", encoding="utf-8") as f:
                f.write(render_page(project, lang, ui[lang]))
            count += 1
        print(f"generated {project['slug']} (fr + en)")
    print(f"done — {count} detail page(s) for {len(featured)} project(s)")


if __name__ == "__main__":
    main()
