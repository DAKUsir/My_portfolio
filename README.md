# Aditya Chauhan — PortfolioOps

A personal portfolio for Aditya Chauhan, AI/ML engineering and full-stack developer. The site presents selected projects, skills, education, recognition, profile links, and a downloadable resume. The repository is also the foundation for a complete software delivery and operations project.

## Current status

The Phase 2 frontend is personalized from the supplied resume and built as a responsive Next.js site. It includes project and skills sections, resume viewing and download, SEO/social metadata, keyboard skip navigation, a persisted optional dark theme, and a responsive contact form. Phase 3 adds server-side field validation, a honeypot, a bounded in-memory rate limiter, a health endpoint, and Vitest/Playwright coverage. Phase 4 adds pull-request and main-branch CI for linting, type checking, unit and browser tests, production builds, and dependency security checks. Phase 5 adds a hardened production Docker image, Compose runtime, repository secret scanning, container vulnerability scanning, a CycloneDX SBOM, and default-branch publishing to GitHub Container Registry. Email delivery uses Resend when configured; without credentials the API returns an explicit setup error and the form offers a mailto fallback. Messages are not stored in an application database.

## Stack

- Next.js App Router and React
- TypeScript
- Tailwind CSS 4 and custom responsive styles
- Motion for React (previously Framer Motion), with reduced-motion support
- Resend REST API for optional contact email delivery
- Vitest unit tests and Playwright browser tests
- Multi-stage Docker image and hardened Docker Compose runtime

## Run locally

Requirements: Node.js 24 and npm 11 or compatible versions.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

For local contact delivery, set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL=onboarding@resend.dev`, and `CONTACT_TO_EMAIL` in `.env.local` (or `.env`). Resend may restrict its test sender to verified recipients. For production, replace it with an address on a domain verified in Resend. See the [Resend Send Email API guide](https://resend.com/docs/api-reference/emails/send-email). Keep real credentials in an ignored `.env.local`/`.env` or your host's secret store; never commit them.

Useful commands:

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

GitHub Actions runs these checks for pull requests and pushes to `main` or `master`. It requires no application secrets; contact email delivery is not exercised by CI. Dependency audit blocks high and critical advisories, and pull requests also review newly introduced dependencies.

## Run the production container

Docker Compose builds the standalone Next.js production image and runs it as a non-root user with a read-only root filesystem, dropped Linux capabilities, a health check, and a writable temporary cache. Use Docker for production-style runs; continue using `npm run dev` for local frontend development.

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f portfolio
docker compose down
```

Compose reads `.env` from the project directory for the Resend settings. Keep that file local; `.env*` is excluded from both Git and the Docker build context. The API remains usable without Resend, but sending email requires a valid `RESEND_API_KEY`, sender, and recipient.

The container job builds and scans the image on pull requests and pushes. It fails for fixable high or critical OS/library vulnerabilities, publishes a CycloneDX SBOM as a 30-day Actions artifact, and publishes commit-SHA and `latest` tags to `ghcr.io` only from the repository's default branch. Gitleaks scans repository history for accidentally committed credentials. Dependabot opens weekly update PRs for npm dependencies, the Docker base image, and GitHub Actions.

The Playwright command reuses the development server on port 3000 when available, or starts one there. The API's in-memory rate limit is best-effort per process; use a shared limiter before running multiple production instances.

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

1. Verify a production sending domain and configure the Resend settings in the deployment environment (deferred until the domain is available).
2. Provision a small cloud environment with Terraform and deploy the scanned GHCR image through staging.
3. Replace process-local rate limiting with shared storage before scaling beyond one app process.
4. Add uptime, application, and deployment monitoring.

The app currently runs as a single Next.js service. See [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the scope and target design.
