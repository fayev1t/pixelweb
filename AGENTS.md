# Repository Guidelines

This repository contains a React/Vite frontend and a minimal Flask server for serving the built static site.

## Project Structure & Module Organization
- `frontend/` — Vite + React app.
  - `frontend/src/` — application code; entry points are `main.jsx` and `App.jsx`.
  - `frontend/src/components/` — UI pieces (parallax background, rain effect, audio player).
  - `frontend/src/assets/` — images and audio used by the UI.
- `backend/` — Flask server (`backend/app.py`) that serves the built frontend from `frontend/dist/`.
- `character/` and `backgrand/` — source artwork at the repository root; keep these in sync with `frontend/src/assets` when updating art.

## Build, Test, and Development Commands
From `frontend/`:
- `npm install` — install frontend dependencies.
- `npm run dev` — start the Vite dev server with HMR.
- `npm run build` — generate production assets in `frontend/dist`.
- `npm run preview` — serve the built assets locally for a production-like check.
- `npm run lint` — run ESLint over JS/JSX sources.

Backend (serves the built site):
- `python backend/app.py` — run Flask on port 5000. Build the frontend first so `frontend/dist` exists.

## Coding Style & Naming Conventions
- JS/JSX uses 2-space indentation, semicolons, and single quotes (match existing files in `frontend/src`).
- React components use PascalCase with matching filenames like `AudioPlayer.jsx`.
- CSS class names are kebab-case and live in co-located files such as `App.css` and `RainEffect.css`.
- Linting is configured via `frontend/eslint.config.js` (React hooks + refresh rules). Run `npm run lint` before submitting.
- Python code in `backend/app.py` follows standard Flask patterns with 4-space indentation.

## Testing Guidelines
No test runner or test scripts are configured in this repo. If you add tests, choose a runner, add a `test` script to `frontend/package.json`, and document the setup. Prefer naming tests `*.test.jsx` or `*.spec.jsx`.

## Commit & Pull Request Guidelines
No Git history is present in this checkout, so there is no established commit-message convention to reference. Keep commits concise and imperative; if you introduce a convention (e.g., `feat:`/`fix:` prefixes), use it consistently.

For pull requests:
- Summarize the change and user impact.
- Link related issues/tickets.
- Include screenshots or GIFs for visual changes.
- Mention whether `npm run lint` and `npm run build` were run.

## Build Artifacts
`frontend/dist/` is generated output; do not edit files there by hand. Rebuild via `npm run build` when assets or UI code changes.
