/* Contact form — états (loading / succès / erreur), validation client, honeypot +
   time-trap. Envoie en AJAX vers contact.php (SMTP O2switch) au déploiement.
   SIMULATE = true → envoi simulé en local (pas de PHP) ; passer à false une fois
   contact.php en ligne. Sans JS : le form POST natif vers contact.php (fallback). */
(function () {
  var SIMULATE = false; // envoi RÉEL via contact.php (SMTP O2switch)

  var form = document.getElementById("contactForm");
  if (!form) return;
  var btn = document.getElementById("contactSubmit");
  var txt = btn.querySelector(".c-txt");
  var status = document.getElementById("contactStatus");
  var ts = document.getElementById("c-ts");
  if (ts) ts.value = String(Date.now()); // time-trap : horodatage de chargement

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var STR = {
    fr: {
      send: "Envoyer →", sending: "Envoi…",
      ok: "Message envoyé — je te réponds vite.",
      errFields: "Vérifie les champs surlignés.",
      errServer: "Une erreur est survenue — réessaie, ou écris-moi par email."
    },
    en: {
      send: "Send →", sending: "Sending…",
      ok: "Message sent — I'll reply soon.",
      errFields: "Check the highlighted fields.",
      errServer: "Something went wrong — try again, or email me."
    }
  };
  function L() { return document.documentElement.lang === "en" ? STR.en : STR.fr; }

  function setInvalid(input, bad) { input.closest(".c-field").classList.toggle("invalid", bad); }
  function show(kind, msg) {
    status.className = "c-status" + (kind ? " " + kind : "");
    status.innerHTML = kind === "ok"
      ? '<span class="c-ic" aria-hidden="true">✓</span> ' + msg
      : (kind === "err" ? "✕ " + msg : msg);
  }
  function loading(on) {
    btn.classList.toggle("loading", on);
    btn.disabled = on;
    txt.textContent = on ? L().sending : L().send;
  }

  function validate() {
    var f = form, bad = false;
    [[f.name, !f.name.value.trim()], [f.email, !EMAIL.test(f.email.value)],
     [f.subject, !f.subject.value.trim()], [f.message, !f.message.value.trim()]]
      .forEach(function (p) { setInvalid(p[0], p[1]); if (p[1]) bad = true; });
    return !bad;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    show("", "");
    // honeypot rempli → bot : on fait comme si c'était parti, sans rien envoyer
    if (form.website && form.website.value) { show("ok", L().ok); return; }
    if (!validate()) { show("err", L().errFields); return; }

    loading(true);

    if (SIMULATE) {
      window.setTimeout(function () {
        loading(false);
        show("ok", L().ok);
        form.reset();
      }, 1000);
      return;
    }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        loading(false);
        if (data && data.ok) { show("ok", data.message || L().ok); form.reset(); }
        else { show("err", (data && data.message) || L().errServer); }
      })
      .catch(function () { loading(false); show("err", L().errServer); });
  });
})();
