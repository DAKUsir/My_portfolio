# PortfolioOps

A personal portfolio built as an end-to-end software delivery project. The site will showcase projects and a resume while the repository demonstrates how the application is planned, built, secured, deployed, and operated.

## Current status

**Phase 1 — project planning and setup.** The Next.js, TypeScript, and Tailwind CSS application scaffold is in place. The feature scope and target architecture are recorded in [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

The Git repository is initialized locally. A GitHub remote has not been configured yet.

## Run locally

Requirements: Node.js 24 and npm 11 or compatible versions.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

Useful commands:

```bash
npm run lint
npm run build
```

If the browser stays on a loading screen, stop any existing dev server with `Ctrl+C` first. Next allows one dev server per project; if port 3000 is occupied it may print a different local URL. If the old server left a stale development cache, remove it and restart:

```bash
rm -rf .next/dev
npm run dev
```

## Planned product areas

- Home and about: professional introduction and featured work.
- Projects: searchable project cards with technologies, source, and demo links.
- Skills: grouped technical skills.
- Resume: view and download a PDF, once supplied.
- Contact: validated contact flow, implemented after the frontend foundation.
- Engineering: real deployment, pipeline, uptime, and security signals when those integrations exist.

## Delivery direction

The initial app is a single Next.js service. GitHub Actions will later validate pull requests; Docker will package releases; Terraform will provision the target AWS environment; and CloudWatch, Sentry, uptime checks, and Lighthouse CI will provide operational signals. See the architecture note for boundaries and decisions.

## Repository guide

```text
src/app/       Next.js routes and shared styles
public/        Static assets and, later, the resume PDF
docs/          Project scope and architecture decisions
```
