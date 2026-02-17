# Repository Guidelines

This repository includes a Vite/React frontend and a minimal Flask server that serves the built static files.

## Project Structure & Module Organization
- `frontend/` contains the web app.
- `frontend/src/main.jsx` and `frontend/src/App.jsx` are the frontend entry points.
- `frontend/src/components/` stores UI modules (for example `ParallaxBackground.jsx`, `RainEffect.jsx`, `AudioPlayer.jsx`).
- `frontend/src/assets/` stores runtime images and audio.
- `backend/app.py` serves `frontend/dist/` on Flask.
- `character/` and `backgrand/` keep source artwork; sync updates into `frontend/src/assets/` when art changes.

## Build, Test, and Development Commands
Run from `frontend/` unless noted:
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server with HMR.
- `npm run build` creates production output in `frontend/dist/`.
- `npm run preview` serves the built app locally.
- `npm run lint` runs ESLint for JS/JSX.

Backend (from repo root):
- `python backend/app.py` starts Flask on port `5000` and serves built frontend files.

## Coding Style & Naming Conventions
- Use 2-space indentation, semicolons, and single quotes in JS/JSX.
- Name React components with PascalCase and matching filenames (example: `AudioPlayer.jsx`).
- Use kebab-case CSS class names in co-located stylesheets (example: `RainEffect.css`).
- Follow `frontend/eslint.config.js`; fix lint issues before opening a PR.
- Use 4-space indentation in Python (`backend/app.py`).

## Testing Guidelines
- No test runner is currently configured.
- If you add tests, add a `test` script in `frontend/package.json` and document setup in `README.md`.
- Prefer names like `*.test.jsx` or `*.spec.jsx`.

## Commit & Pull Request Guidelines
- Keep commits concise, imperative, and scoped to one change.
- If you adopt prefixes like `feat:` or `fix:`, use them consistently.
- PRs should include:
  - Change summary and user impact
  - Linked issue/ticket
  - Screenshots or GIFs for UI updates
  - Verification notes (for example: `npm run lint`, `npm run build`)

## Build Artifacts
- Do not edit `frontend/dist/` manually.
- Rebuild with `npm run build` after UI or asset changes.
