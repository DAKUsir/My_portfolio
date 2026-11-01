# PortfolioOps project brief

## Purpose

Build a polished personal portfolio and use it as a practical example of modern software delivery. The visitor experience should stay focused on the person and their work; operational details belong on a separate engineering page.

## Audiences

- Recruiters and collaborators reviewing projects, skills, and a resume.
- Engineers reviewing the repository, release pipeline, security controls, and operational practices.

## Product scope

### Portfolio experience

- Home/about page with an introduction and selected work.
- Project gallery with descriptions, technologies, screenshots, and source/demo links.
- Skills page grouped by discipline.
- Resume page with viewing and download support after a resume is provided.
- Contact page with server-side validation, spam protection, and clear success/error feedback.
- Engineering page that reports real public pipeline, release, uptime, and performance signals after those systems exist.
- Responsive layout, accessible interactions, metadata, sitemap, and a useful not-found state.

The project list from the planning brief is a starting point: Krishi Bazar, Orchestrated AI Platform, Cancer Prediction, and Eye of Machine. Project details and public links should be confirmed before publishing.

### Engineering scope

- Keep application and infrastructure changes in one version-controlled repository.
- Add pull-request CI, tests, security scans, immutable container builds, staged deployment, and a protected production release in later phases.
- Provision cloud resources with Terraform and use short-lived GitHub Actions OIDC credentials.
- Add logs, metrics, error tracking, uptime checks, performance budgets, rollback behavior, and a runbook.
- Display only verified public status data; never expose credentials, private logs, or account identifiers.

## Phase 1 acceptance

- The project scope and initial architecture are documented.
- A TypeScript Next.js App Router project with Tailwind CSS and a lockfile exists.
- The local Git repository is initialized and has a clean, named baseline commit.
- The local development commands are documented.

## Out of scope for Phase 1

Portfolio page implementation, contact API, database, automated tests, CI/CD workflows, Docker image, Terraform, cloud resources, monitoring integrations, and remote GitHub setup. These come in later phases; the remote repository also requires the user's GitHub account and access.

## Current environment notes

Node.js 24, npm 11, and Git are available. Docker and the VS Code command are not installed in this environment. Their installation is not required to create or run the Phase 1 app; Docker is introduced in its dedicated phase.

The initial dependency install reported 16 moderate npm advisories. No automatic dependency upgrades were applied; review and resolve the findings before deployment as part of the security phase.
