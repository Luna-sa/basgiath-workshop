# Apps Script Setup — Workshop Backend on Google Sheets

Replaces Supabase. Whitelisted by every corporate firewall (it's
Google). ~10-15 minutes once.

## Step 1 · Create the script

1. Sign into the Google account that should own the workshop data.
   The script + spreadsheet + Drive folder will live in this account.
2. Open https://script.new — it creates a new untitled project.
3. In the left sidebar select the default `Code.gs` file. Delete
   everything in the editor.
4. Open `apps-script/Code.gs` from this repo. Copy its entire
   contents into the empty editor.
5. Save (`⌘+S` / `Ctrl+S`). Name the project something like
   `Basgiath Workshop Backend`.

## Step 2 · Run setup once

1. In the editor, with `Code.gs` open, click the function dropdown
   above the editor — it currently says `doPost`. Pick `doSetup`.
2. Click ▶ Run.
3. First run will prompt for permissions — accept:
   - "See, edit, create, delete your Google Sheets..."
   - "See, edit, create, delete your Google Drive files..."
   You can ignore the "Google hasn't verified this app" warning —
   it's your own script.
4. After the run completes, open **View → Logs** (or `⌘+Enter`).
   You'll see something like:
   ```
   SPREADSHEET_ID  : 1abc...XYZ
   DRIVE_FOLDER_ID : 1def...UVW
   Spreadsheet URL : https://docs.google.com/spreadsheets/d/...
   Drive folder URL: https://drive.google.com/drive/folders/...
   ```
5. Open the Spreadsheet URL — confirm 6 sheets are there: `students`,
   `dragons`, `dragon_votes`, `dragon_matches`, `bot_submissions`,
   `facilitator_state`.
6. Open the Drive folder URL — confirm an empty folder exists.

## Step 3 · Deploy as Web App

1. Top right: **Deploy → New deployment**.
2. Settings (gear icon left of "Select type") → **Web app**.
3. Description: `v1`.
4. **Execute as:** `Me` (your Google account).
5. **Who has access:** `Anyone`. (Yes, anyone. The workshop is
   single-day single-cohort, this is acceptable.)
6. Click **Deploy**.
7. Authorize again if prompted.
8. Copy the **Web app URL** — it looks like
   `https://script.google.com/macros/s/AKfy.../exec`.

## Step 4 · Wire it into the workshop

Set this as an env var on Render for the `basgiath-workshop` service:

```
VITE_GSHEETS_API = https://script.google.com/macros/s/AKfy.../exec
```

Trigger a redeploy on Render. The client code will detect
`VITE_GSHEETS_API` and route every persistence call through Apps
Script instead of Supabase.

## Quick verification

After Render redeploys, hit the registration page. The previous
"TypeError: Failed to fetch" should be gone. Open the `students`
sheet in your spreadsheet — a new row should appear in real time.

## When you change Code.gs later

Apps Script is annoying — you have to manually re-deploy after
every edit:

1. **Deploy → Manage deployments**.
2. Pencil icon next to your existing v1 deployment.
3. Version dropdown → **New version**. Description: `v2`.
4. **Deploy**.

The URL stays the same. No env var change needed.

## Recovering if something breaks

- If a sheet header gets corrupted, run `doSetup()` again — it's
  idempotent and re-asserts headers.
- If the spreadsheet was deleted, run `doSetup()` — it'll create
  a fresh one.
- Old Supabase data is still in your Supabase project; you can
  migrate manually if you ever fix the network issue.

## Cost

Free. Apps Script has a daily quota (6 hours of total execution +
20,000 URL fetches) which is many many orders of magnitude above
what a single workshop with 30 participants needs.
