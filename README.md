# Portfolio

This is a static React/Vite portfolio. It has no API server or database dependency. All display content is bundled from local JSON, and all portfolio images are served from `client/public`.

## Edit content

- Update profile, projects, skills, achievements, experience, testimonials, media coverage, or newsletter cards in the matching JSON file under `client/src/data/`.
- Update `settings.json` for the default theme, font, and resume link. Theme selections made by a visitor are saved in their browser only.
- Add images under `client/public/` (or `client/public/uploads/`) and use a root-relative path such as `/uploads/project.webp` in JSON.
- To optimize JPG/PNG assets and update their local references, run `python client/scripts/optimize_images.py` (requires Pillow).
- `github-years.json` contains cached GitHub activity snapshots. Update it manually when you want to refresh the activity display; the deployed site makes no GitHub/API request.

Run locally from the repository root with `npm run dev`; create a production bundle with `npm run build`.

## Render Static Site

The root `render.yaml` defines a free static site with the `client` root, Vite build output, and a rewrite rule for direct visits to SPA routes. Create a Render Blueprint from this repository to apply it. If configuring an existing Static Site in the dashboard, use root directory `client`, build command `npm ci && npm run build`, publish directory `dist`, and add a Rewrite rule from `/*` to `/index.html`. Content changes go live after pushing the updated JSON/images to GitHub and allowing Render to redeploy.

## Static behavior

The contact form opens the visitor's email app with the message prefilled. Static hosting cannot accept messages, store admin edits, or submit forms without a separate backend/service, so the database-backed admin panel, message inbox, and admin account signup were removed. Experiences and testimonials currently have no records; add entries to their local JSON files to display them.
