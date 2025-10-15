# ALU Visualizer (Phase 0)

Interactive arithmetic logic unit explorer built with React, TypeScript, and Vite. Phase 0 delivers the project scaffolding so the next milestones can focus on simulation logic, pedagogy, and rich visualization.

## Getting Started

1. Install dependencies: `npm install`
2. Launch the dev server: `npm run dev`
3. Visit Storybook component sandbox: `npm run storybook`

Environment variables live in `.env` (see `.env.example`). sensible defaults let you run without extra configuration.

## Available Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – type-check via project references then create production bundle
- `npm run preview` – serve the production build locally
- `npm run lint` / `npm run lint:fix` – ESLint with strict TS, Tailwind, Storybook rules
- `npm run format` / `npm run format:check` – Prettier formatting helpers
- `npm run typecheck` – TS project-only check for the app bundle
- `npm run test` / `npm run test:watch` / `npm run test:coverage` – Vitest unit suite
- `npm run test:e2e` / `npm run test:e2e:ui` – Playwright smoke tests
- `npm run storybook` / `npm run build-storybook` – component explorer powered by Vite builder
- `npm run ci` – lint, type-check, unit, and e2e tests for pipeline parity

Playwright browsers install automatically on `npm install` via the `prepare` script.

## Tooling Highlights

- **Styling** – Tailwind CSS with forms plugin, project-wide dark-surface theme, and utility-first design tokens.
- **Internationalization** – i18next + react-i18next bootstrapped with locale typings and provider wiring.
- **Testing Stack** – Vitest + Testing Library for units, Playwright for critical flow e2e, coverage via V8.
- **Storybook** – Vite-powered Storybook with a11y and Vitest addons plus shared i18n context.
- **PWA Ready** – `vite-plugin-pwa` configured for offline caching, manifest generation, and auto updates.
- **Linting & Formatting** – ESLint flat config with strict TypeScript rules, Tailwind conventions, Storybook plugin, and Prettier alignment.

## Project Structure

```text
src/
  App.tsx              // Phase 0 splash + checklist
  App.test.tsx         // Baseline render smoke test
  config/              // Zod-backed environment helper
  i18n/                // i18next setup, typed resources, locale bundles
  index.css            // Tailwind directives + base tokens
  setupTests.ts        // Vitest + Testing Library globals
tests/e2e/             // Playwright smoke suite
.storybook/            // Storybook Vite builder config & decorators
```

## Quality Gates

- ESLint, Prettier, and Tailwind checks enforced in CI via `npm run ci`
- Vitest configured with jsdom environment and coverage reporters (`text`, `html`, `lcov`)
- Playwright spins up the production preview build for deterministic e2e runs
- PWA manifest + service worker emitted at build for offline readiness

## Implementation Roadmap

Milestones and deliverables live in `IMPLEMENTATION.md`. Each phase ends with a pause for tests, review, and feedback before proceeding (current status: Phase 0 complete).

## Next Steps

- Phase 1: Build the simulation core (`Bit` types, two's complement routines, stepwise adder) with exhaustive unit coverage.
- Reference `copilot-instructions.md` for the full product specification while implementing subsequent phases.
