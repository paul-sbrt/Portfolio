#!/usr/bin/env python3
"""Generate bilingual project detail pages — direction D1 (récit produit, rythme
horizontal aéré, charte DUO par projet). One template, N data.

For every projects.json entry with "featured": true, writes:
  - FR:  projects/<slug>.html          (root, x-default)
  - EN:  en/projects/<slug>.html

Data-driven rules:
  - hats: "App" -> portrait device hero + démarche visual ; else -> browser (paysage).
  - charte DUO: project.brand (principale) + project.brand2 (secondaire) ; --g2
    (gradient partner) computed = brand2 if light enough, else a lightened brand
    (so navy secondaries stay legible in the title while dominating the bands).
  - detail.quote optional -> "Le pourquoi" quote (else section shows prose only ;
    if neither why nor quote -> section skipped).
  - detail.approach[] optional -> "La démarche" (skipped if absent, e.g. MS cases).
  - detail.outcomes[] (structured) or detail.impact[] (flat) -> "Le résultat".
  - externalUrl / detail.links -> hero link (absent -> no link).
  - real image (project.image not a placeholder) -> shown in the frame ; else a
    duotone brand→brand2 placeholder. Same for the gallery.
  - tags -> discreet stack (section skipped if empty).

Loads detail.css + Archivo + JetBrains Mono (no microsoft.css / Poppins-only).
Run from the repo root:  python3 build_detail.py
"""
import html
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "projects.json")
DOMAIN = "https://YOUR-DOMAIN.com"
LANGS = ("fr", "en")


def esc(text):
    return html.escape(str(text or ""), quote=True)


def T(value, lang):
    if isinstance(value, dict):
        return value.get(lang) or value.get("fr") or value.get("en") or ""
    return value if value is not None else ""


def asset(path, base):
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
    v = str(value or "")
    return ("À COMPLÉTER" in v) or ("placeholder" in v) or (v == "")


# ---- charte DUO helpers -----------------------------------------------------
def _rgb(hx):
    h = str(hx or "#000000").lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _lum(hx):
    r, g, b = _rgb(hx)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0


def _mix_white(hx, t):
    r, g, b = _rgb(hx)
    f = lambda c: round(c + (255 - c) * t)
    return "#%02X%02X%02X" % (f(r), f(g), f(b))


def _ink(hx):
    """Light-theme variant of a brand colour: darken (hue kept) until it is AA-legible
    as text/accent on the light bg (#faf9f7). Colours already dark enough — navy — are
    returned unchanged, so navy stays an elegant accent instead of a heavy block."""
    r, g, b = _rgb(hx)
    if _lum(hx) <= 0.34:
        return "#%02X%02X%02X" % (r, g, b)
    k = 1.0
    while k > 0.06:
        k -= 0.02
        rr, gg, bb = round(r * k), round(g * k), round(b * k)
        if (0.2126 * rr + 0.7152 * gg + 0.0722 * bb) / 255.0 <= 0.34:
            return "#%02X%02X%02X" % (rr, gg, bb)
    return "#%02X%02X%02X" % (round(r * k), round(g * k), round(b * k))


def charte(project):
    brand = project.get("brand") or "#ff004f"
    brand2 = project.get("brand2") or brand
    # navy/dark secondaries can't carry bright text → light warm partner for --g2
    g2 = brand2 if _lum(brand2) >= 0.22 else _mix_white(brand, 0.42)
    # light-theme "ink" variants (accents/text) — darkened, AA on the light bg
    return brand, brand2, g2, _ink(brand), _ink(brand2)


# ---- visual (real image or duotone placeholder) -----------------------------
def visual_inner(img_src, alt, label, logo=False):
    if img_src and logo:
        # logo d'outil (pas une capture) → carte de marque : logo centré, contain, de l'air
        return f'<div class="dt-logofield"><img class="dt-logo" src="{img_src}" alt="{alt}" loading="lazy" /></div>'
    if img_src:
        return f'<img class="dt-img" src="{img_src}" alt="{alt}" loading="lazy" />'
    return f'<div class="dt-ph"></div><span class="dt-ph-label">{label}</span>'


def render_hero(project, detail, lang, ui, base, is_app, ext_url, ext_label):
    highlight = esc(T(detail.get("highlight", project["title"]), lang))
    heading = esc(T(detail.get("heading", ""), lang))
    lead = esc(T(detail.get("lead", project.get("summary", "")), lang))
    hats = " · ".join(project.get("hats") or [])
    year = project.get("year")
    eyebrow = esc(hats + (f" · {year}" if year else ""))
    cap = esc(project["title"])

    cover = project.get("image")
    img_src = asset(cover, base) if not is_placeholder(cover) else ""
    to_come = esc(ui.get("detail.gallery", "Gallery")) + " —"
    label = esc(T(detail.get("tagline", ""), lang)) or cap

    sub_html = f'<p class="dt-sub rv">{heading}</p>' if heading else ""
    link_html = ""
    if ext_url:
        link_html = (f'<div class="dt-meta rv"><a href="{esc(ext_url)}" target="_blank" '
                     f'rel="noopener noreferrer">{ext_label} ↗</a></div>')

    text = f"""<div class="dt-htext">
          <p class="dt-eyebrow rv">{eyebrow}</p>
          <h1 class="rv"><span class="dt-b">{highlight}</span></h1>
          {sub_html}
          <p class="dt-lead rv">{lead}</p>
          {link_html}
        </div>"""

    logo = bool(project.get("coverLogo")) and bool(img_src)
    inner = visual_inner(img_src, cap, label, logo)
    cap_html = "" if logo else f'<span class="dt-cap">{cap}</span>'  # le logo EST l'identité
    if is_app:
        media = f"""<div class="dt-device rv">{inner}{cap_html}</div>"""
        return f"""    <header class="dt-hero dt-hero--app dt-wrap" id="detail-top">
        {text}
        {media}
      </header>"""
    # web / MS : browser paysage
    url_txt = esc((ext_url or "").replace("https://", "").replace("http://", "").rstrip("/")) or cap
    media = f"""<div class="dt-browser rv">
          <div class="dt-browser-bar"><i></i><i></i><i></i><span class="dt-url">{url_txt}</span></div>
          <div class="dt-browser-shot">{inner}{cap_html}</div>
        </div>"""
    return f"""    <header class="dt-hero dt-hero--web dt-wrap" id="detail-top">
        {text}
        {media}
      </header>"""


def render_band(detail, lang, ui):
    tagline = esc(T(detail.get("tagline", ""), lang))
    if not tagline:
        return ""
    letter = esc((esc(T(detail.get("highlight", ""), lang)) or "•")[0])
    idea = esc(ui.get("detail.idea", "The idea"))
    return f"""
    <section class="dt-band">
      <div class="dt-wm" aria-hidden="true">{letter}</div>
      <div class="dt-wrap"><p class="dt-k rv">{idea}</p><h2 class="rv">{tagline}</h2></div>
    </section>"""


def render_why(detail, lang, ui):
    why = esc(T(detail.get("why", ""), lang))
    quote = esc(T(detail.get("quote", ""), lang))
    if not why and not quote:
        return ""
    label = esc(ui.get("detail.why", "Why"))
    prose = f'<p class="dt-prose dt-txt rv">{why}</p>' if why else ""
    quote_html = (f'<div class="dt-quote rv"><p class="dt-pullquote">“ {quote} ”</p></div>'
                  if quote else "")
    return f"""
    <div class="dt-wrap"><section class="dt-why">
      <p class="dt-sec-eyebrow rv"><span class="dt-num">01</span> — {label}</p>
      {prose}
      {quote_html}
    </section></div>"""


def render_approach(detail, lang, ui, base, is_app):
    approach = detail.get("approach") or []
    if not approach:
        return ""
    label = esc(ui.get("detail.approach", "Approach"))
    letters = "abcdefghij"
    rows = []
    for i, ch in enumerate(approach):
        t = esc(T(ch.get("title"), lang))
        b = esc(T(ch.get("body"), lang))
        rows.append(f'<div class="dt-choice rv"><h3><span>{letters[i]}.</span>{t}</h3><p>{b}</p></div>')
    choices = "\n        ".join(rows)
    mode = "" if is_app else " dt-how--web"
    lbl = esc(ui.get("detail.gallery", "Gallery")) + " —"
    media = f'<div class="dt-how-media rv"><div class="dt-float">{visual_inner("", "", lbl)}</div></div>'
    return f"""
    <div class="dt-wrap"><section class="dt-how{mode}">
      {media}
      <div>
        <p class="dt-sec-eyebrow rv"><span class="dt-num">02</span> — {label}</p>
        {choices}
      </div>
    </section></div>"""


def render_result(detail, lang, ui):
    outcomes = detail.get("outcomes")
    impact = detail.get("impact")
    label = esc(ui.get("detail.result", "Result"))
    feats = []
    if outcomes:
        for o in outcomes:
            t = esc(T(o.get("title"), lang))
            b = esc(T(o.get("body"), lang))
            feats.append(f'<div class="dt-feat rv"><b>{t}</b><span>{b}</span></div>')
    elif impact:
        for it in impact:
            feats.append(f'<div class="dt-feat rv"><b>{esc(T(it, lang))}</b></div>')
    if not feats:
        return ""
    one = " dt-features--one" if len(feats) <= 1 else ""
    items = "\n        ".join(feats)
    return f"""
    <div class="dt-wrap"><section class="dt-result">
      <p class="dt-sec-eyebrow rv"><span class="dt-num">03</span> — {label}</p>
      <div class="dt-features{one}">
        {items}
      </div>
    </section></div>"""


def render_statusband(detail, lang, ui):
    status = esc(T(detail.get("status", ""), lang))
    if not status:
        return ""
    label = esc(ui.get("detail.statusLabel", "Where it stands"))
    return f"""
    <section class="dt-statusband">
      <div class="dt-wrap"><div class="dt-in rv"><span class="dt-lab">{label}</span><p>{status}</p></div></div>
    </section>"""


def render_gallery(detail, base, lang, ui):
    label = esc(ui.get("detail.gallery", "Gallery"))
    shots = detail.get("gallery") or []
    tiles = []
    real = [s for s in shots if s.get("src") and not is_placeholder(s.get("src"))]
    if real:
        for s in real:  # TOUTES les images (plus de plafond à 3)
            src = asset(s.get("src"), base)
            alt = esc(T(s.get("caption") or s.get("alt"), lang))
            tiles.append(f'<div class="dt-shot"><img class="dt-img" src="{src}" alt="{alt}" loading="lazy" /><div class="dt-sweep"></div></div>')
        gal_class = "dt-gal dt-gal--full rv"  # grille adaptative au nombre
    else:
        to_come = esc(ui.get("detail.gallery", "Gallery"))
        for i in range(3):
            tiles.append(f'<div class="dt-shot"><div class="dt-ph"></div><div class="dt-sweep"></div><span class="dt-ph-label">{to_come} {i + 1} — …</span></div>')
        gal_class = "dt-gal rv"  # 3 placeholders, grille "vedette"
    tiles_html = "\n        ".join(tiles)
    return f"""
    <div class="dt-wrap"><section class="dt-gallery">
      <p class="dt-sec-eyebrow rv">{label}</p>
      <div class="{gal_class}">
        {tiles_html}
      </div>
    </section></div>"""


def _embed(url):
    """YouTube / Vimeo watch URL -> embeddable URL. '' if unknown (block skipped)."""
    import re
    u = str(url or "")
    yt = re.search(r"(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([\w-]+)", u)
    if yt:
        return "https://www.youtube.com/embed/" + yt.group(1)
    if "vimeo.com/" in u:
        vid = u.rstrip("/").split("/")[-1]
        if vid.isdigit():
            return "https://player.vimeo.com/video/" + vid
    return ""


def render_video(detail, lang, ui):
    """Optional demo video -> a play card that opens a modal (lightbox.js). Absent /
    unknown provider -> nothing (no empty block, no dead link)."""
    v = detail.get("video") or {}
    embed = _embed(v.get("url"))
    if not embed:
        return ""
    heading = esc(T(v.get("heading", ui.get("detail.demo", "Demo")), lang))
    body = esc(T(v.get("body", ""), lang))
    body_html = f'<p class="dt-videobody rv">{body}</p>' if body else ""
    return f"""
    <div class="dt-wrap"><section class="dt-video">
      <p class="dt-sec-eyebrow rv">{heading}</p>
      <button class="dt-videocard rv" type="button" data-video="{embed}" aria-label="{heading}">
        <div class="dt-ph"></div>
        <span class="dt-playbtn" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
      </button>
      {body_html}
    </section></div>"""


def render_stack(project, ui):
    tags = project.get("tags") or []
    if not tags:
        return ""
    label = esc(ui.get("detail.builtwith", "Built with"))
    chips = "".join(f'<span class="dt-chip">{esc(t)}</span>' for t in tags)
    return f"""
      <div class="dt-stack rv">
        <span class="dt-lab">{label}</span>
        <div class="dt-chips">{chips}</div>
      </div>"""


def render_page(project, lang, ui):
    detail = project.get("detail", {})
    slug = project["slug"]
    title = esc(project["title"])
    summary = esc(T(project.get("summary", ""), lang))
    hats = project.get("hats") or ["Web"]
    is_app = "App" in hats
    brand, brand2, g2, brand_ink, brand2_ink = charte(project)

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

    # external link (detail.links first, else externalUrl)
    ext_url, ext_label = "", esc(ui.get("detail.visit", "View project"))
    links = detail.get("links") or []
    if links and links[0].get("url") and not is_placeholder(links[0]["url"]):
        ext_url = links[0]["url"]
        ext_label = esc(T(links[0].get("label", ui.get("detail.visit", "View project")), lang))
    elif project.get("externalUrl") and not is_placeholder(project.get("externalUrl")):
        ext_url = project["externalUrl"]

    og_image = og_abs(project.get("image"))
    nav_home = esc(ui.get("nav.home", "Home"))
    nav_about = esc(ui.get("nav.about", "About"))
    nav_projects = esc(ui.get("nav.projects", "Projects"))
    nav_contact = esc(ui.get("nav.contact", "Contact"))
    copyright_word = esc(ui.get("footer.copyright", "Copyright"))
    back = esc(ui.get("detail.allProjects", "All projects"))
    toggle_aria = "Switch to English" if lang == "fr" else "Passer en français"

    hero = render_hero(project, detail, lang, ui, base, is_app, ext_url, ext_label)
    band = render_band(detail, lang, ui)
    why = render_why(detail, lang, ui)
    approach = render_approach(detail, lang, ui, base, is_app)
    result = render_result(detail, lang, ui)
    statusband = render_statusband(detail, lang, ui)
    gallery = render_gallery(detail, base, lang, ui)
    video = render_video(detail, lang, ui)
    stack = render_stack(project, ui)

    return f"""<!DOCTYPE html>
<html lang="{lang}">
  <head>
    <meta charset="utf-8" />
    <script>
      (function () {{
        try {{
          var t = localStorage.getItem("theme");
          if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", t);
        }} catch (e) {{}}
      }})();
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — Paul Sabourault</title>
    <meta name="description" content="{summary}" />
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
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;900&family=JetBrains+Mono:wght@500;600&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{base}style.css" />
    <link rel="stylesheet" href="{base}detail.css" />
    <script src="https://kit.fontawesome.com/5d10eb0d43.js" defer crossorigin="anonymous"></script>
    <script src="{base}theme.js" defer></script>
    <script src="{base}i18n.js" defer></script>
  </head>

  <body data-detail data-i18n-base="{base}" data-alt-{alt_lang}="{alt_rel}" style="--brand:{brand};--brand2:{brand2};--g2:{g2};--brand-ink:{brand_ink};--brand2-ink:{brand2_ink};">
    <div class="dt-nav-shell">
      <div class="container">
        <div class="header-sticky">
          <div class="nom">
            <a href="{base}index.html#header"><div class="nom-text"><span>P</span>aul <span>S</span>abourault</div></a>
          </div>
          <nav>
            <ul id="sidemenu">
              <li><a href="{base}index.html#header">{nav_home}</a></li>
              <li><a href="{base}index.html#about">{nav_about}</a></li>
              <li><a href="{base}index.html#projects">{nav_projects}</a></li>
              <li><a href="{base}index.html#contact">{nav_contact}</a></li>
              <li class="nav-toggles">
                <button id="lang-toggle" class="lang-toggle" type="button" aria-label="{toggle_aria}">
                  <span class="lang-slider" aria-hidden="true"></span>
                  <span class="lang-opt" data-lang="fr">FR</span>
                  <span class="lang-opt" data-lang="en">EN</span>
                </button>
                <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Changer de thème">
                  <svg class="theme-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                    <mask id="theme-moon-mask">
                      <rect x="0" y="0" width="24" height="24" fill="#fff" />
                      <circle class="theme-cut" cx="18" cy="7" r="6" fill="#000" />
                    </mask>
                    <circle class="theme-orb" cx="12" cy="12" r="6" fill="currentColor" mask="url(#theme-moon-mask)" />
                    <g class="theme-rays" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
                      <line x1="12" y1="1.6" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22.4" />
                      <line x1="1.6" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22.4" y2="12" />
                      <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" /><line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
                      <line x1="19.6" y1="4.4" x2="17.9" y2="6.1" /><line x1="6.1" y1="17.9" x2="4.4" y2="19.6" />
                    </g>
                  </svg>
                </button>
              </li>
              <i class="fa-solid fa-xmark"></i>
            </ul>
            <i class="fa-solid fa-bars"></i>
          </nav>
        </div>
      </div>
    </div>

    <main>
      <div class="dt-wrap"><a class="dt-topback" href="{base}index.html#projects"><i class="fa-solid fa-arrow-left"></i> {back}</a></div>
{hero}
{band}
{why}
{approach}
{result}
{statusband}
{gallery}
{video}
      <div class="dt-wrap">{stack}
        <div class="dt-end"><a class="dt-back" href="{base}index.html#projects"><i class="fa-solid fa-arrow-left"></i> {back}</a></div>
      </div>

      <footer>
        <p>{copyright_word}<i class="fa-regular fa-copyright"></i> Paul Sabourault</p>
      </footer>
    </main>

    <script src="{base}app.js" defer></script>
    <script src="{base}lightbox.js" defer></script>
    <script>
      (function () {{
        var els = document.querySelectorAll(".rv");
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce || !("IntersectionObserver" in window)) {{
          els.forEach(function (el) {{ el.classList.add("in"); }}); return;
        }}
        var io = new IntersectionObserver(function (es) {{
          es.forEach(function (e) {{ if (e.isIntersecting) {{ e.target.classList.add("in"); io.unobserve(e.target); }} }});
        }}, {{ threshold: 0.14 }});
        els.forEach(function (el, i) {{ el.style.transitionDelay = ((i % 5) * 0.06).toFixed(2) + "s"; io.observe(el); }});
        setTimeout(function () {{ els.forEach(function (el) {{ var r = el.getBoundingClientRect(); if (r.top < (window.innerHeight || 0) && r.bottom > 0) el.classList.add("in"); }}); }}, 1800);
      }})();
    </script>
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
