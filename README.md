# You're the Oldies!

You're the Oldies! is a static music comparison site. Enter a high school graduation year to see a song released during the four years before graduation and a song that was approximately the same age at graduation. Results show the class year, release years, and the current age of the high school song. The site uses a vintage radio and record-store visual style.

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

The comparison functions live in `src/lib/comparison.ts`. They accept the current year as an argument, so date logic is deterministic in tests. The browser calculates song ages from the current calendar year. Visitors can request another comparison, share a result link, and open Spotify or YouTube Music searches for either song. Listening links use each song's title and artist as search terms; they do not point to specific verified recordings.

## Maintaining the catalog

Edit `src/data/songs.json`. Each entry has a unique stable `id`, `title`, `artist`, release `year`, `genre`, and `recognition` score from 1 (less widely recognized) to 5 (widely recognized). `peakYear` can record a later year when a song was especially popular; `url` is an optional field. For modern songs, use the earliest public recording release (album or single) for `year`; for historical songs predating commercial recordings, use the earliest documented publication or circulation year of the composition. Use `peakYear` for a later chart peak. Verify song titles, artist credits, and dates before adding entries.

For a selected graduation year, the app chooses a song released in the four years leading up to that year, then calculates the year of a song that would be the same age at graduation based on the current calendar year. It prefers exact release-year matches and falls back to a song released one year before or after the target year. Approximate matches are labeled with the target year and the matched song's release year. Matching code does not invent song titles or dates.

The catalog includes songs from 1860 onward, with denser coverage of popular music from 1935 through 2025. The earliest accepted graduation year is 1945; match availability depends on catalog coverage. Recognition scores are editorial estimates, not chart rankings. For pre-recording-era songs, consult historical sheet music collections and annual music references to verify dates.

## Sharing

Result URLs use `grad`, `song`, `oldies`, and `year` query parameters. These preserve the selected songs and displayed pairing when a link is opened. The Web Share API is used where available, with a clipboard fallback. General Open Graph metadata is provided; previews are not generated per result.

## Site assets

The shared page layout is in `src/layouts/BaseLayout.astro`. The SVG favicon in `public/favicon.svg` uses the site's vinyl record motif.

## Deploying to GitHub Pages

1. Push this repository to GitHub and set the production branch to `main`.
2. In **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
3. The workflow in `.github/workflows/deploy.yml` installs locked dependencies, runs unit tests, builds Astro, and deploys `dist` on pushes to `main`.
4. In **Settings → Pages → Custom domain**, enter `youretheoldies.com` and save. The `public/CNAME` file is included in the deployed output.
5. At your DNS provider, point the apex domain to GitHub Pages using its published A/AAAA records, or use an ALIAS/ANAME record if supported. Add `www` as a CNAME to the GitHub Pages host if you want that hostname too. Enable **Enforce HTTPS** after DNS has propagated.

The Astro site URL is set to `https://youretheoldies.com` in `astro.config.mjs`; no server or API keys are required.

## License

The original source code and associated documentation are available under the MIT License in [LICENSE](LICENSE), so they can be used in forks and adaptations. The You're the Oldies! / YTO FM names, logos, visual identity, and domain names are excluded from that license; forks should use distinct branding and must not imply endorsement or affiliation. The song catalog at `src/data/songs.json` is also excluded. Song titles, artist names, and other third-party material remain subject to the rights of their respective owners; this repository grants no rights to them.
