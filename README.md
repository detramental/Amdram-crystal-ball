# Laos Show Forecaster — PWA

A Progressive Web App version of the theatre-show forecaster. Works fully
offline after the first load, installs like a native app on any modern
device, and needs no Python or dependencies.

## What's in the bundle

| File | Purpose |
|---|---|
| `laos_show_forecaster.html` | The whole app — UI, logic, styling |
| `manifest.json`             | PWA manifest (name, icons, colours) |
| `sw.js`                     | Service worker — offline cache |
| `icon-192.png`              | App icon (192×192) |
| `icon-512.png`              | App icon (512×512) |
| `icon-maskable-512.png`     | Maskable icon for Android home screen |

## How to run it

You **must serve the files over `http://` or `https://`** for the service
worker to install (browsers block service workers on `file://` for security).

### Option 1 — Local dev server (one command)
```bash
cd path/to/folder
python -m http.server 8000
# then open http://localhost:8000/laos_show_forecaster.html
```

### Option 2 — Share with your committee
Drop the whole folder into any of these — free tiers work fine:

- **GitHub Pages** (free, HTTPS built-in, pretty URL)
- **Netlify Drop** (drag-and-drop the folder in the browser)
- **Cloudflare Pages**
- **SharePoint / OneDrive** with a share link (works for viewing;
  installability may vary)

### Option 3 — Just view it
If you double-click `laos_show_forecaster.html` it will open in your
browser and work — you just won't get the "install to home screen"
prompt because the service worker won't register on `file://`.

## Installing as an app

- **Chrome / Edge on desktop** — an ⬇ Install app button appears in
  the toolbar once the manifest and service worker are detected.
- **Chrome on Android** — you'll get an "Add to Home Screen" prompt.
- **Safari on iPhone / iPad** — the app shows a hint at the bottom
  telling you to tap Share → Add to Home Screen. It then behaves
  like a native app with its own icon.

## What works offline

Once you've loaded the app once with an internet connection, the
service worker caches:

- The HTML, manifest, icons
- Chart.js (bar chart)
- SheetJS (Excel export)

After that you can use it on a plane, in a rehearsal hall with no
Wi-Fi, or anywhere else — the status bar shows an offline badge.

## Data storage

- **Auto-saved to browser storage** every 400 ms — reopen the app
  and your last figures come back.
- **Save / Load** buttons export/import a JSON scenario file so you
  can share pessimistic/likely/optimistic versions with the committee.
- **Excel export** — three sheets (Summary, Costs, Performances).
- **Chart export** — PNG image of the revenue chart.

## Bumping the app version

If you edit `laos_show_forecaster.html` and want everyone to pick up
the change, open `sw.js` and change `CACHE_VERSION` from `laos-forecaster-v1`
to `-v2`. Users will get the new files on their next visit.
