# Aditya Chauhan — PortfolioOps

A personal portfolio for Aditya Chauhan, AI/ML engineering and full-stack developer. The site presents selected projects, skills, education, recognition, profile links, and a downloadable resume. The repository is also the foundation for a complete software delivery and operations project.

## Current status

The Phase 2 frontend is personalized from the supplied resume and built as a responsive Next.js site. It includes project and skills sections, resume viewing and download, SEO/social metadata, keyboard skip navigation, a persisted optional dark theme, and a responsive contact form. Phase 3 adds server-side field validation, a honeypot, a bounded in-memory rate limiter, a health endpoint, and Vitest/Playwright coverage. Phase 4 adds pull-request and main-branch CI for linting, type checking, unit and browser tests, production builds, and dependency security checks. Phase 5 adds a hardened production Docker image, Compose runtime, repository secret scanning, container vulnerability scanning, a CycloneDX SBOM, and default-branch publishing to GitHub Container Registry. Phase 6 deploys the Docker service on Render at <https://my-portfolio-rvgm.onrender.com>, with <https://chauhanaditya.me> configured as the custom domain. The homepage and health endpoint have returned HTTP 200. Email delivery uses Resend when configured; without credentials the API returns an explicit setup error and the form offers a mailto fallback. Messages are not stored in an application database.

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

The container job builds and scans the image on pull requests and pushes. It fails for fixable high or critical OS/library vulnerabilities and uploads the Trivy report and CycloneDX SBOM as a 30-day Actions artifact. The non-root distroless runtime image reduces the shipped operating-system package set. Successful default-branch runs publish commit-SHA and `latest` tags to `ghcr.io`. Gitleaks scans repository history for accidentally committed credentials. Dependabot opens weekly update PRs for npm dependencies, the Docker base image, and GitHub Actions.

## Current production deployment

The production web service is hosted on Render from the repository's `Dockerfile`. Render builds from GitHub and auto-deploys after connected CI checks pass. The service is currently on the Free plan in the Virginia (US East) region and is reachable at both <https://my-portfolio-rvgm.onrender.com> and <https://chauhanaditya.me>. Namecheap DNS points the root domain and `www` subdomain to Render; Render manages HTTPS certificates for the custom domain.

The root `render.yaml` is a reproducible Blueprint definition and currently specifies Singapore; the existing live service has been configured separately in Virginia. If recreating the service from the Blueprint, review the region before provisioning. Render Free web services sleep after 15 minutes without traffic and may take about a minute to wake on the next request. Upgrade the service plan if you need it to stay awake. See [Render's Free instance limits](https://render.com/docs/free).

Vercel is being considered as an alternative host for the Next.js app, but no Vercel deployment or domain migration has been completed. Keep the Render deployment and DNS in place until a Vercel deployment, environment variables, contact API, custom domain, and HTTPS have all been verified.

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

## Remaining work

1. Verify `chauhanaditya.me` as a sending domain in Resend, then configure the production sender, recipient, and `RESEND_API_KEY` in the chosen host's secret settings and test delivery.
2. Finish Grafana Synthetic Monitoring alert routing so check failures notify you.
3. Decide whether to keep Render (upgrade to avoid Free-plan sleep) or migrate to Vercel; validate the contact API and environment variables before changing DNS.
4. Replace process-local contact rate limiting with shared storage before running multiple app instances.

The app currently runs as a single Next.js service. See [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), and [`docs/OPERATIONS.md`](docs/OPERATIONS.md) for scope, architecture, and the Render runbook.
