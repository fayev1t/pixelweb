# Repository Guidelines

## Project Structure & Module Organization
- `src/main.jsx` boots the app, and `src/App.jsx` is the top-level scene container.
- Reusable UI/effects live in `src/components/` (for example `ParallaxBackground.jsx`, `RainEffect.jsx`, `PixiSnowEffect.jsx`).
- Shared constants and helpers are in `src/constants/` and `src/utils/`.
- Runtime media is stored in `src/assets/` (`background/`, `character/`, `music/`).
- `public/` holds static passthrough files, and `dist/` is generated build output.
- Related repo paths: Flask server in `../backend/app.py`, source art in `../character/` and `../backgrand/`, utility scripts in `../scripts/`.

## Build, Test, and Development Commands
Run from `frontend/`:
- `npm install`: install dependencies.
- `npm run dev`: start Vite with hot reload.
- `npm run build`: create production assets in `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run lint`: run ESLint (`eslint .`) on JS/JSX.

Production-style local serving:
- `python ../backend/app.py`: serves `frontend/dist/` on port `5000`.

## Coding Style & Naming Conventions
- Use functional React components and ES modules.
- Use 2-space indentation for JS/JSX/CSS; use 4 spaces in Python files.
- Prefer single quotes and semicolons in JS/JSX.
- Component filenames use PascalCase (`AudioPlayer.jsx`), utility files use camelCase (`lrcParser.js`), and CSS classes stay kebab-case.
- Follow `eslint.config.js`; resolve lint issues before opening a PR.

## Testing Guidelines
- No automated test suite is configured yet.
- Minimum validation for each change: `npm run lint` and `npm run build`.
- For UI changes, manually verify weather modes, animation playback, layering, and audio controls.
- If adding tests, colocate with source files and use `*.test.jsx`.

## Commit & Pull Request Guidelines
- History currently mixes styles (`first commit`, `feat: ...`); use concise, imperative messages with scope going forward (example: `frontend: refine umbrella shield collision`).
- PRs should include: summary, affected paths, validation commands run, linked issue/ticket, and screenshots/GIFs for visual updates.
- Keep commits focused; separate logic changes from asset-only updates when practical.
