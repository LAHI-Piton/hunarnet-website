# Storing form submissions in Google Sheets (Apps Script)

This connects the website's forms (**Join the Community**, **Share Your Practice**, and future **Discussion** posts) to a Google Sheet you own. Every submission becomes a new row. No database, no server, completely free.

**Time needed:** about 10 minutes, once.

---

## What you'll end up with

A Google Sheet with three tabs — **Join**, **Practice**, **Discussion** — filling up automatically as teachers use the site. You can view, filter, sort, and export to Excel any time.

---

## Step 1 — Create the Google Sheet

1. Sign in to the Google account that should own this data (ideally a Lend A Hand India account).
2. Go to <https://sheets.google.com> and create a **Blank spreadsheet**.
3. Name it something like **HunarNet Submissions**.

## Step 2 — Open the Apps Script editor

1. In that Sheet, click **Extensions → Apps Script**.
2. A code editor opens in a new tab. Delete any sample code in the `Code.gs` file it shows.

## Step 3 — Paste the script

1. Open the file **`Code.gs`** from this folder (`google-apps-script/Code.gs`).
2. Copy **all** of it and paste it into the Apps Script editor.
3. Because you opened the editor **from the Sheet**, you can leave `SHEET_ID = "";` exactly as it is — it will use this Sheet automatically.
4. Click the **Save** icon (💾).

## Step 4 — (Optional) Create the tabs now

1. In the editor's function dropdown (top toolbar), choose **`setupTabs`**.
2. Click **Run**.
3. The first time, Google asks you to **Review permissions** → choose your account → **Advanced → Go to (project name) → Allow**. This is normal for your own script.
4. Switch back to the Sheet — you'll see **Join**, **Practice**, and **Discussion** tabs created with headers.

## Step 5 — Deploy as a Web App

1. In the editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** `HunarNet form endpoint`
   - **Execute as:** **Me** (your account)
   - **Who has access:** **Anyone**
     *(This must be "Anyone" so the public website can post to it. The script only appends rows — it never exposes your Sheet.)*
4. Click **Deploy**.
5. Approve permissions again if prompted.

## Step 6 — Copy the Web App URL

1. After deploying, Google shows a **Web app URL** ending in `/exec`. It looks like:
   ```
   https://script.google.com/macros/s/AKfycb...long...string/exec
   ```
2. **Copy it.**

## Step 7 — Point the website at your Web App

1. Open **`js/config.js`** in the website project.
2. Set:
   ```js
   DEMO_MODE: false,
   APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycb...string/exec",
   ```
   (Paste your real URL between the quotes.)
3. Save, commit, and push (or re-upload) the site. Done — submissions now land in your Sheet.

## Step 8 — Test it

1. Open your live site, complete the **Join the Community** form, and finish it.
2. Check the **Join** tab in your Sheet — a new row should appear within a second or two.
3. Try **Share Your Practice** and confirm a row lands in the **Practice** tab.

---

## Verifying it's live (quick check)

Paste your `/exec` URL into a browser address bar. You should see:
```json
{"result":"ok","service":"HunarNet form endpoint"}
```
That confirms the endpoint is running.

---

## Updating the script later

If you change `Code.gs` (e.g. add a column), you must **re-deploy**:
- **Deploy → Manage deployments → (edit, the pencil) → Version: New version → Deploy.**
- The URL stays the same, so you don't need to touch `config.js` again.

## Common issues

- **Rows not appearing:** make sure **Who has access** is **Anyone**, and that `DEMO_MODE` is `false` with the correct URL in `config.js`.
- **"Authorization required":** re-open the editor, run `setupTabs` once, and approve permissions.
- **Wrong Sheet:** if you created the script as a *standalone* project (not from the Sheet), set `SHEET_ID` in `Code.gs` to your Sheet's ID (the long string between `/d/` and `/edit` in the Sheet URL) and re-deploy.

---

## Where's the data? Can my team access it?

Yes. It's a normal Google Sheet — share it with colleagues from the Sheet's **Share** button, filter/sort as usual, or **File → Download → Microsoft Excel (.xlsx)** for offline copies. You fully own and control it.
