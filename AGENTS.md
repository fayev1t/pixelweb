# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` is the main app (Vite + React).
- `frontend/src/main.jsx` boots the app, and `frontend/src/App.jsx` is the top-level scene container.
- `frontend/src/components/` contains reusable visual modules (for example `ParallaxBackground.jsx`, `RainEffect.jsx`, `PixiSnowEffect.jsx`).
- `frontend/src/assets/` stores runtime images/audio used by the UI.
- `backend/app.py` is a minimal Flask server that serves `frontend/dist/` in production-style runs.
- `scripts/adjust_webp_speed.py` is a utility for adjusting animation timing in `.webp` assets.
- `character/` and `backgrand/` hold source art; sync final files into `frontend/src/assets/`.

## Build, Test, and Development Commands
Run frontend commands from `frontend/`:
- `npm install`: install JS dependencies.
- `npm run dev`: start the local Vite dev server with hot reload.
- `npm run build`: create production output in `frontend/dist/`.
- `npm run preview`: serve the built frontend locally.
- `npm run lint`: run ESLint on JS/JSX files.

Run backend from repo root:
- `python backend/app.py`: serve the built frontend on port `5000`.

## Coding Style & Naming Conventions
- JS/JSX: functional React components, PascalCase component filenames, single quotes, semicolons.
- Prefer 2-space indentation in JS/JSX and CSS.
- CSS classes should remain kebab-case (for example `rain-scene`, `layer-mountains`).
- Python code uses 4-space indentation and snake_case naming.
- Follow `frontend/eslint.config.js`; resolve lint errors before opening a PR.

## Testing Guidelines
- No automated test suite is configured yet.
- Minimum validation for every change: `npm run lint` and `npm run build` in `frontend/`.
- For UI changes, include manual verification notes (weather modes, animation playback, audio controls).
- If you add tests, place frontend tests near source files using `*.test.jsx` naming.

## Commit & Pull Request Guidelines
- Current history is minimal (`first commit`), so apply a consistent convention going forward.
- Use concise, imperative commit messages scoped by area, e.g., `frontend: add snow animation fallback`.
- PRs should include: change summary, affected paths, validation commands run, linked issue/ticket, and screenshots/GIFs for visual updates.
- Keep commits focused; separate asset-only updates from logic changes when possible.
