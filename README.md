# Karabo Levy Khuthama: Portfolio

**Live site: https://levy-khuthama.github.io/**

My personal developer portfolio: software support experience, an AI bootcamp
with Stellenbosch University, and the projects I've built. It's a static site
in plain HTML, CSS and JavaScript, with no framework and no build step.

## Highlights

- **Try SoleStock live.** My shoe inventory project (Python, 114 tests) runs
  in the browser through Pyodide, so you can use the real program without
  installing anything.
- Nine projects across data science, machine learning and software, with
  filters and previews.
- Light and dark themes, scroll-aware navigation and a downloadable CV.

## Run it locally

```
python3 -m http.server 8000
```

then visit http://localhost:8000. Serving it this way is needed for the live
demo, which downloads Python in the browser. It deploys as-is to any static
host (GitHub Pages, Netlify, Vercel).

## Structure

```
index.html            page content only (no inline CSS or JS)
css/
  base.css            design tokens, light/dark colours, reset, typography
  layout.css          wrapper, progress bar, nav, section scaffold, footer
  hero.css            headline, blobs, stats strip, CV button
  sections.css        experience, about, skills, education, contact
  projects.css        filter pills, project cards, terminal previews, modal
  demo.css            the "Try SoleStock live" terminal
js/
  theme.js            light/dark toggle (loaded in <head> to avoid a flash)
  scroll.js           progress bar, nav border, scroll-spy, reveal-on-scroll
  projects.js         project category filters
  modal.js            project lightbox
  contact.js          copy-email button
  demo.js             loads Python and runs SoleStock in the page
  solestock-bundle.js SoleStock's source, packed for the demo (generated)
assets/
  images/             project preview charts
  favicon.svg, og-image.png, Karabo-Khuthama-CV.pdf
```

## Conventions

- **Colours live in `css/base.css` only.** Everything else uses `var(--token)`,
  which is what makes dark mode work.
- **Each stylesheet owns its responsive and reduced-motion rules**, next to the
  components they affect.
- **Scripts are classic, self-contained IIFEs** (not ES modules).
- **Behaviour is hooked via `id` and `data-*` attributes**, not inline handlers.

## Editing content

- **Add a project:** copy a `.project-card` block in `index.html`, set its
  `data-cat` (`data` or `software`), `data-name`, `data-desc`, `data-meta`,
  `data-img` and `data-link`, and drop its preview image in `assets/images/`.
  Cards with no `data-img` show a terminal preview instead.
- **Change colours:** edit the tokens at the top of `css/base.css`.
- **Update the demo** after changing SoleStock: rebuild `js/solestock-bundle.js`
  with `tools/build_demo_bundle.py` from the SoleStock repo.
