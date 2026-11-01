# Aditya Chauhan — PortfolioOps

A personal portfolio for Aditya Chauhan, AI/ML engineering and full-stack developer. The site presents selected projects, skills, education, recognition, profile links, and a downloadable resume. The repository is also the foundation for a complete software delivery and operations project.

## Current status

The Phase 1 project foundation is complete. The first portfolio experience is now personalized from the supplied resume and built as a responsive Next.js page. Contact API, automated tests, CI/CD, containerization, cloud infrastructure, and monitoring remain future phases.

## Stack

- Next.js App Router and React
- TypeScript
- Tailwind CSS 4 and custom responsive styles
- Motion for React (previously Framer Motion), with reduced-motion support

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

If the browser stays on a loading screen, stop the existing dev server with `Ctrl+C` first. Next allows one dev server per project; if port 3000 is occupied it may print a different local URL. If the old server left a stale development cache, remove it and restart:

```bash
rm -rf .next/dev
npm run dev
```

## Repository guide

```text
src/app/       Portfolio page, layout, styles, and motion components
public/        Static assets, including the resume PDF and site icon
docs/          Project scope and architecture decisions
```

## Delivery direction

The initial app is a single Next.js service. Later phases will add pull-request CI, security checks, a production Docker image, Terraform-managed AWS infrastructure, staged deployment, and operational monitoring. See [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the current scope and target design.
