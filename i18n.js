// Bilingual FR/EN switcher — mirrors theme.js.
// - Language lives in document.documentElement.lang (set pre-paint on the
//   index by a no-FOUC inline script; hardcoded per file on built detail pages).
// - On the index (client-switch): apply UI strings from ui.<lang>.json and
//   dispatch "langChanged" so display.js re-renders the data-driven sections.
// - On a detail page (body[data-detail]): the two languages are separate static
//   files, so the toggle just navigates to the alternate (body[data-alt-<lang>]).
(function () {
  var root = document.documentElement;
  var base = root.getAttribute("data-i18n-base") || "./"; // "../../" on /en/ pages

  function currentLang() {
    return root.lang === "en" ? "en" : "fr";
  }

  var cache = {};
  function loadUI(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch(base + "ui." + lang + ".json")
      .then(function (r) { return r.json(); })
      .then(function (d) { cache[lang] = d; return d; })
      .catch(function () { return {}; });
  }

  function applyUI(dict) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-ph")];
      if (v != null) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-aria")];
      if (v != null) el.setAttribute("aria-label", v);
    });
  }

  function updateToggle(lang) {
    var btn = document.getElementById("lang-toggle");
    if (!btn) return;
    // Show the language you would switch TO.
    btn.textContent = lang === "fr" ? "EN" : "FR";
    btn.setAttribute(
      "aria-label",
      lang === "fr" ? "Switch to English" : "Passer en français"
    );
  }

  function setLang(lang) {
    root.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    loadUI(lang).then(function (dict) {
      applyUI(dict);
      updateToggle(lang);
      window.dispatchEvent(new CustomEvent("langChanged", { detail: { lang: lang } }));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var lang = currentLang();
    var isDetail = document.body.hasAttribute("data-detail");

    // Detail pages have their UI baked at build time; only wire the toggle.
    if (!isDetail) {
      loadUI(lang).then(function (dict) {
        applyUI(dict);
        updateToggle(lang);
      });
    } else {
      updateToggle(lang);
      // Keep the global preference in sync with the page actually opened.
      try { localStorage.setItem("lang", lang); } catch (e) {}
    }

    var btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = currentLang() === "fr" ? "en" : "fr";
      if (isDetail) {
        var alt = document.body.getAttribute("data-alt-" + next);
        if (alt) {
          try { localStorage.setItem("lang", next); } catch (e) {}
          window.location.href = alt;
        }
        return;
      }
      setLang(next);
    });
  });
})();
