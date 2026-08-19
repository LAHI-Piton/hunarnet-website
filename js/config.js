/* =========================================================================
   HunarNet — Site Configuration
   -------------------------------------------------------------------------
   This is the ONLY file you normally need to touch to switch the site
   from "demo mode" to "live mode" (real form submissions).
   ========================================================================= */

window.HUNARNET_CONFIG = {

  /* -----------------------------------------------------------------------
     FORM STORAGE
     -----------------------------------------------------------------------
     DEMO_MODE:
       true  -> forms show the "thank you" screen but DO NOT send anywhere.
                Great while you are still setting up the Google Sheet.
       false -> forms POST real submissions to APPS_SCRIPT_URL below.

     APPS_SCRIPT_URL:
       Paste the Web App URL you get after deploying the Google Apps Script
       (see google-apps-script/README-appscript.md, Step 6).
       It looks like:
       https://script.google.com/macros/s/AKfyc.....xyz/exec
     ----------------------------------------------------------------------- */
  DEMO_MODE: false,
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzQzXITJqfoTdzA6S523F_e0Rk0c05WB6SVbNJv2ECfZmTVjxrVypkL_2XON9iDF5S8bw/exec",

  /* -----------------------------------------------------------------------
     LANGUAGE
     -----------------------------------------------------------------------
     DEFAULT_LANG:   "en" or "hi" — used on a visitor's first-ever visit.
     AUTO_DETECT:    if true, use the browser language on first visit
                     (falls back to DEFAULT_LANG). A visitor's manual
                     choice is always remembered afterwards.
     ----------------------------------------------------------------------- */
  DEFAULT_LANG: "en",
  AUTO_DETECT: false
};
