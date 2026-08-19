# HunarNet website

A static, bilingual (English / Hindi) website for **HunarNet**, the teacher community by **Lend A Hand India**. No build step, no framework — just HTML, CSS and JavaScript, so it runs on GitHub Pages, Apache, NGINX, or any static host.

---

## Folder structure

```
hunarnet/
├── index.html              Page structure (with data-i18n text hooks)
├── css/
│   └── styles.css          All styling: colours, fonts, spacing, layout
├── js/
│   ├── config.js           ⚙️  Deployment settings (forms + language) — edit this
│   ├── i18n.js             Language engine (loads the JSON, handles the toggle)
│   ├── forms.js            Sends form submissions to Google Sheets (or demo)
│   └── main.js             All interactions (dropdowns, loop, modal, carousel…)
├── lang/
│   ├── en.json             📝 All English text
│   └── hi.json             📝 All Hindi text (placeholder — see note below)
├── assets/
│   ├── logo.png            Full HunarNet logo
│   ├── logo-icon.png       Logo icon (Warli figures) used in hero + favicon
│   ├── spot1.jpg …         Workshop photos (spotlight + testimonials)
├── google-apps-script/
│   ├── Code.gs             The Google Apps Script backend for form storage
│   └── README-appscript.md Step-by-step setup for Google Sheets storage
├── .nojekyll               Tells GitHub Pages to serve files as-is
└── README.md               This file
```

---

## Running it locally

Because the site loads language files with `fetch()`, open it through a small local server (not by double-clicking `index.html`, which browsers block for local file reads):

```bash
# From inside the hunarnet/ folder:
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Any static server works (`npx serve`, VS Code "Live Server", etc.).

---

## Editing content (no coding)

**All visible text lives in `lang/en.json` and `lang/hi.json`.** To change a headline, an FAQ, a pillar description, testimonials, discussion questions, or impact numbers, edit the matching key in **both** files (English and Hindi) and save. The structure of the two files is identical — same keys, translated values.

Examples:
- **Change the hero headline** → `hero.title` in both JSON files.
- **Add/remove an FAQ** → add or remove an item in the `faqs.items` array (keep both languages in sync).
- **Update impact numbers** → `impact.items[].target`.
- **Edit a pillar** → `pillars.items[]`.

> Tip: JSON is picky about commas and quotes. After editing, paste the file into <https://jsonlint.com> to check it's valid.

## Changing colours, fonts, spacing

Open `css/styles.css`. The top `:root` block holds the brand tokens:

```css
:root{
  --brown:#894B07;      /* primary brand colour */
  --coral:#F26755;      /* accent */
  --navy:#193564;       /* headings */
  --sky:#78D1EB;
  --beige:#EBE4DE;
  ...
  --display:'Anton';    /* big headings */
  --serif:'Crimson Pro';
  --friendly:'Fredoka';
  --body:Arial;
}
```

Change a value here and it updates everywhere.

## Changing photos or the logo

Drop replacements into `assets/` using the same filenames, or update the filenames referenced in `index.html` (logo) and `js/main.js` (the `PHOTOS` array for spotlight/testimonials).

---

## Languages (English + Hindi)

- A toggle in the header (**EN | हिं**, and full names in the mobile menu) switches language instantly and remembers the visitor's choice.
- Default behaviour is set in `js/config.js`:
  - `DEFAULT_LANG: "en"` — first-visit language.
  - `AUTO_DETECT: false` — set to `true` to use the browser's language on first visit.

> **⚠️ Hindi is currently a machine-assisted placeholder** (`lang/hi.json` starts with a `_note` field flagging this). Please have the LAHI team review and correct it — especially vocational-education terms — before going live. Editing it is just changing the string values in that file.

---

## Where do form submissions go?

The site has three data-collecting flows: **Join the Community**, **Share Your Practice**, and **Start a Discussion**.

- **Out of the box (`DEMO_MODE: true`)** they show the success screen but don't send anywhere — safe for previewing.
- **To store real submissions**, connect a **Google Sheet** via the included Google Apps Script. Full 10-minute guide: **`google-apps-script/README-appscript.md`**. Then set `DEMO_MODE: false` and paste your Web App URL into `js/config.js`.

Every submission becomes a row in a Google Sheet you own (one tab per form) — view, filter, and export to Excel freely. No database to manage.

---

## Deploying to GitHub Pages (recommended)

1. Create a new GitHub repository (e.g. `hunarnet`) and push the contents of this folder to it:
   ```bash
   git init
   git add .
   git commit -m "HunarNet website"
   git branch -M main
   git remote add origin https://github.com/YOUR-ORG/hunarnet.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Branch: **main**, folder: **/ (root)**. Save.
5. Wait ~1 minute. Your site is live at `https://YOUR-ORG.github.io/hunarnet/`.
6. Every future `git push` updates the live site automatically.

**Custom domain (optional):** in **Settings → Pages → Custom domain**, add e.g. `hunarnet.org`, then create a CNAME DNS record pointing to `YOUR-ORG.github.io`. GitHub provisions HTTPS automatically.

> The included `.nojekyll` file ensures GitHub Pages serves the folders (like `js/` and `lang/`) exactly as-is.

---

## Deploying to EC2 with NGINX or Apache (alternative)

The site is plain static files, so just serve this folder as the web root.

**NGINX** (`/etc/nginx/sites-available/hunarnet`):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/hunarnet;      # copy the project folder here
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```
```bash
sudo cp -r hunarnet /var/www/
sudo ln -s /etc/nginx/sites-available/hunarnet /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# HTTPS: sudo certbot --nginx -d your-domain.com
```

**Apache** (`/etc/apache2/sites-available/hunarnet.conf`):
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/hunarnet
    <Directory /var/www/hunarnet>
        Require all granted
    </Directory>
</VirtualHost>
```
```bash
sudo cp -r hunarnet /var/www/
sudo a2ensite hunarnet && sudo systemctl reload apache2
# HTTPS: sudo certbot --apache -d your-domain.com
```

Form storage still uses Google Sheets exactly the same way — hosting location doesn't change that.

---

## Quick checklist before going live

- [ ] Review & correct the Hindi in `lang/hi.json`.
- [ ] Replace sample testimonials / discussion questions / impact numbers with real ones (both languages).
- [ ] Set up the Google Sheet (see `google-apps-script/README-appscript.md`).
- [ ] In `js/config.js`: set `DEMO_MODE: false` and paste your `APPS_SCRIPT_URL`.
- [ ] Test each form on desktop **and** mobile; confirm rows land in the Sheet.
- [ ] Deploy (GitHub Pages or EC2).
