# You're the Oldies!

The music didn't get old. You did. A tiny, static music time machine: enter your high school graduation year and see the song from your era that is now as old as another hit was to you.

## Local development

Requires Node.js 20.3 or newer.

```sh
npm ci
npm run dev
```

Astro serves the app at `http://localhost:4321`. The browser code is vanilla TypeScript; the catalog is bundled from `src/data/songs.json`.

## Tests and build

```sh
npm test
npm run build
npm run preview
```

The comparison functions live in `src/lib/comparison.ts`. They accept the current year as an argument, so date logic is deterministic in tests. Each request in the browser reads the current calendar year dynamically.

## Maintaining the catalog

Edit `src/data/songs.json`. Each entry has a unique stable `id`, `title`, `artist`, original release `year`, `genre`, and `recognition` from 1 (niche) to 5 (widely recognized). `peakYear` records a later year when the song was especially popular; `url` is also optional. For modern songs, use the earliest public recording release (album or single) for `year`; for historical songs predating commercial recordings, use the earliest documented publication or circulation year of the composition. Use `peakYear` for a later chart peak. Avoid duplicate IDs and verify title, artist credits, release year, and any peak year before adding songs. The app chooses a graduation-era song released in the four years leading up to graduation, then finds the highest-recognition song in the exact target year; it falls back one year either side and marks that result as approximate. Matching code does not invent titles or years.

The catalog has 1–2 historically documented songs per year from 1860–1934 and 8–10 popular songs per year from 1935–2025. The earliest supported graduation year is 1945. Recognition scores are editorial estimates intended to make familiar songs more likely to appear; they are not chart rankings. For pre-recording-era songs, consult historical sheet music collections and annual music references to verify dates.

## Sharing

Result URLs use `grad`, `song`, `oldies`, and `year` query parameters. The oldies song and year preserve the displayed pairing for same-year links; when opened in a later calendar year the app recalculates against the new age relationship. The Web Share API is used where available, with a clipboard fallback. General Open Graph metadata is provided; previews are not generated per result.

## Deploying to GitHub Pages

1. Push this repository to GitHub and set the production branch to `main`.
2. In **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
3. The workflow in `.github/workflows/deploy.yml` installs locked dependencies, runs unit tests, builds Astro, and deploys `dist` on pushes to `main`.
4. In **Settings → Pages → Custom domain**, enter `youretheoldies.com` and save. The `public/CNAME` file is included in the deployed output.
5. At your DNS provider, point the apex domain to GitHub Pages using its published A/AAAA records, or use an ALIAS/ANAME record if supported. Add `www` as a CNAME to the GitHub Pages host if you want that hostname too. Enable **Enforce HTTPS** after DNS has propagated.

The Astro site URL is set to `https://youretheoldies.com` in `astro.config.mjs`; no server or API keys are required.
