/* =========================================================================
   HunarNet — Form submission helper
   -------------------------------------------------------------------------
   submitToSheet(formType, payload)
     - In DEMO_MODE: resolves immediately (no network call).
     - In live mode: POSTs JSON to the Google Apps Script Web App, which
       appends a row to the matching tab in your Google Sheet.

   We use a "no-cors"-friendly POST with text/plain content type so the
   browser does not send a CORS preflight (Apps Script Web Apps do not
   return CORS headers for preflight). The Apps Script reads e.postData.
   ========================================================================= */

window.submitToSheet = async function (formType, payload) {
  const cfg = window.HUNARNET_CONFIG || {};
  const body = {
    formType: formType,                 // "join" | "practice" | "discussion"
    lang: (window.I18N && window.I18N.lang) || "en",
    submittedAt: new Date().toISOString(),
    data: payload
  };

  // DEMO MODE: pretend it worked, log to console so you can verify the shape.
  if (cfg.DEMO_MODE || !cfg.APPS_SCRIPT_URL || cfg.APPS_SCRIPT_URL.indexOf("PASTE_") === 0) {
    console.info("[HunarNet DEMO] Form captured (not sent):", body);
    await new Promise((r) => setTimeout(r, 500)); // small delay to feel real
    return { ok: true, demo: true };
  }

  // LIVE MODE
  try {
    const res = await fetch(cfg.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body)
    });
    // Apps Script returns JSON like {"result":"success"}
    const out = await res.json().catch(() => ({}));
    return { ok: out.result === "success", raw: out };
  } catch (e) {
    console.error("[HunarNet] Submission failed:", e);
    return { ok: false, error: e };
  }
};
