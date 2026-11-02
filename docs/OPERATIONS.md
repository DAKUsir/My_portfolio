# Render operations runbook

## Current deployment

- Service: `aditya-portfolio` on Render, Singapore region
- Public URL: <https://my-portfolio-rvgm.onrender.com>
- Runtime: Docker image built from the repository's `Dockerfile`
- Health check: `GET /api/health`
- Initial plan: Render Free

## Check a deployment

GitHub Actions must pass before Render auto-deploys from the connected branch. In Render, open the service's **Events** or **Deploys** page and confirm the latest deploy is live. Then run the production smoke check from the repository root:

```bash
npm run smoke:production
```

To check another deployment, set `PORTFOLIO_URL` to its HTTPS base URL. The check requests the homepage and `/api/health`; each request waits up to 90 seconds to allow a Free service to wake.

## Logs and recovery

1. Open the service in Render and inspect **Logs** and **Events** for startup, health-check, or deploy errors.
2. Check the deployed revision and confirm its GitHub Actions run passed.
3. If the newest deploy is unhealthy, use **Deploys → Rollback** to restore a previous successful deploy.
4. Run `npm run smoke:production` again after the rollback or fix.

The app does not store user submissions or mutable files on its container filesystem. A missing Resend key disables contact email delivery but should not prevent the site or health endpoint from starting.

## Free plan behavior

Render Free web services sleep after 15 minutes without inbound traffic. The first request after sleep can take about a minute to wake the service. This can make an occasional smoke check or visitor request feel slow; it is expected on this plan. Avoid a frequent synthetic ping because it keeps the service awake and consumes the monthly instance-hour allowance. Upgrade the service plan when low-latency availability matters.

## Deferred launch work

- Add and verify the custom domain when it is available, then configure the production Resend sender and `RESEND_API_KEY` as a Render secret.
- Add external uptime notifications if desired; no external monitoring account is connected yet.
- Replace process-local contact rate limiting with shared storage before running multiple service instances.
- Decide on a paid Render plan before treating this as an always-available production site.
