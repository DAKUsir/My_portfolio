# Aditya Chauhan — PortfolioOps

A personal portfolio for Aditya Chauhan, AI/ML engineering and full-stack developer. The site presents selected projects, skills, education, recognition, profile links, and a downloadable resume. The repository is also the foundation for a complete software delivery and operations project.

## Current status

The Phase 1 portfolio is personalized from the supplied resume and built as a responsive Next.js site. The visual system uses a warm light palette, with a contrasting dark contact panel and custom project illustrations. Motion for React provides reduced-motion-aware entrances, hover feedback, and animated project filtering by discipline. Contact API, automated tests, CI/CD, containerization, cloud infrastructure, and monitoring remain future phases.

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

## Next steps

1. Review the resume details and project links, then refine any copy or portfolio content.
2. Add a validated, rate-limited contact route and automated checks.
3. Add pull-request CI with lint, build, and dependency/security checks.
4. Build and run the app in a production Docker image.
5. Provision a small cloud environment with Terraform, then deploy through a staged workflow.
6. Add uptime, application, and deployment monitoring.

The app currently runs as a single Next.js service. See [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the scope and target design.
