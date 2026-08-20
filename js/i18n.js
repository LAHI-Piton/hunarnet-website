/* =========================================================================
   HunarNet — Internationalisation (i18n) engine
   -------------------------------------------------------------------------
   - Loads lang/en.json and lang/hi.json
   - Applies text to any element with a data-i18n="section.key" attribute
   - Exposes window.I18N with the currently active language object so that
     main.js can render dynamic content (pillars, FAQs, etc.) in the right
     language.
   - Handles the EN | हिं toggle and remembers the choice in localStorage.
   ========================================================================= */

window.I18N = {
  lang: "en",
  data: {},          // active language object
  all: {},           // { en: {...}, hi: {...} }
  ready: false,
  onReady: []        // callbacks to run once translations are loaded
};

(function () {
  const cfg = window.HUNARNET_CONFIG || { DEFAULT_LANG: "en", AUTO_DETECT: false };
  const SUPPORTED = ["en", "hi", "mr"];
  const STORAGE_KEY = "hunarnet_lang";

  function pickInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    if (cfg.AUTO_DETECT) {
      const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(nav)) return nav;
    }
    return SUPPORTED.includes(cfg.DEFAULT_LANG) ? cfg.DEFAULT_LANG : "en";
  }

  // Resolve a dotted key path like "hero.title" against the active language.
  function t(path) {
    const parts = path.split(".");
    let cur = window.I18N.data;
    for (const p of parts) {
      if (cur == null) return path;
      cur = cur[p];
    }
    return (cur === undefined || cur === null) ? path : cur;
  }
  window.t = t;

  // Apply all data-i18n bindings currently in the DOM.
  function applyStaticText() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (typeof val !== "string") return;
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    // placeholders
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const val = t(el.getAttribute("data-i18n-ph"));
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });
    // document title + <html lang>
    document.title = t("meta.title");
    document.documentElement.setAttribute("lang", window.I18N.lang);
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = "en";
    window.I18N.lang = lang;
    window.I18N.data = window.I18N.all[lang] || {};
    localStorage.setItem(STORAGE_KEY, lang);
    applyStaticText();
    // update toggle button active states
    document.querySelectorAll("[data-setlang]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-setlang") === lang);
    });
    // let dynamic renderers (main.js) re-render in the new language
    document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang } }));
  }
  window.setLang = setLang;

  async function loadAll() {
    const results = {};
    for (const l of SUPPORTED) {
      try {
        const res = await fetch(`lang/${l}.json`, { cache: "no-cache" });
        results[l] = await res.json();
      } catch (e) {
        console.error(`Could not load language file: lang/${l}.json`, e);
        results[l] = {};
      }
    }
    window.I18N.all = results;
    window.I18N.ready = true;
    setLang(pickInitialLang());
    // fire ready callbacks
    window.I18N.onReady.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    document.dispatchEvent(new CustomEvent("i18n:ready"));
  }

  // Wire up toggle buttons (present in header once DOM is parsed)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-setlang]");
    if (btn) {
      e.preventDefault();
      setLang(btn.getAttribute("data-setlang"));
    }
  });

  document.addEventListener("DOMContentLoaded", loadAll);
})();
