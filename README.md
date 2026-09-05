# Amelia — Presentation Website

A React + Vite showcase site for an AI product, styled after a bold
propaganda-poster aesthetic: deep red, navy, and cream, with halftone
textures and geometric motifs.

All copy is placeholder text — swap it out with real product details.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).

One-time setup: in the repo's Settings → Pages, set **Source** to
**GitHub Actions**. The site will then be published at
`https://gregoryhue.github.io/amelia-presentation-website/`.

The Vite `base` in [vite.config.js](vite.config.js) is set to match this
repo's name — update it if the repo is ever renamed or moved to a custom
domain (in which case `base` should be `/`).
