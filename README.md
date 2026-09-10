# Plato Notes — platonotes.app

The public website for **Plato Notes**, an AI voice-notes app: record audio, get back a
transcript, a written note and a to-do list.

Live at **https://platonotes.app**

Static HTML served by a small Express process. No framework, no build step, no bundler — edit a
file in `public/`, refresh the browser.

> This is the origin registered with our payment provider. Changing how `/checkout` or the
> hostname behaves affects live payments — read [Checkout](#checkout) before touching `server.js`.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3005.

| Script | What it does |
|---|---|
| `npm run dev` | `node --watch server.js` — restarts on server changes |
| `npm start` | Plain `node server.js` — what production runs |

`npm run dev` watches `server.js` only. Changes to anything in `public/` are served straight from
disk, so a browser refresh is enough — hard-refresh (`Ctrl`/`Cmd` + `Shift` + `R`) after editing
CSS.

## Pages

| URL | File | Notes |
|---|---|---|
| `/` | `index.html` | Landing — product, how it works, features, pricing teaser |
| `/pricing` | `pricing.html` | Free vs Pro, billing terms |
| `/contact` | `contact.html` | Email, phone, registered address, legal entity |
| `/terms` | `terms.html` | Terms & Conditions |
| `/privacy` | `privacy.html` | Privacy Policy |
| `/refunds` | `refunds.html` | Refund & Cancellation Policy |
| `/download` | — | 302 to the Android APK |

Anything else renders `404.html` with a 404 status.

URLs are extensionless: `express.static`'s `extensions: ['html']` resolves `/pricing` to
`pricing.html`. Link to `/pricing`, never `/pricing.html`.

## Structure

```
server.js              www→apex redirect, /download, static files, 404
public/
  *.html               one file per page, each self-contained
  styles.css           the whole design system — every page links only this
  robots.txt
  sitemap.xml
  assets/
    platologo.png      logo and Open Graph image
    favicon.png
```

There is no templating. The header and footer are duplicated in each HTML file — **a change to
navigation or the footer has to be made in all seven pages.** That is the deliberate cost of
having no build step; `grep` before you edit.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3005` | The port to listen on. Railway sets this automatically. |
| `APK_DOWNLOAD_URL` | `https://note.brizaai.com/platonotes.apk` | Where `/download` redirects. |