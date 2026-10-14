# BLIES approved Figma frontend

This React/Vite repository is the visual source of truth for the BLIES website. The Next.js repository `caitkaterina/Blies` supplies APIs and staff administration; its historical marketing pages do not replace this frontend.

Use Node 22 and pnpm 10.34.3:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

For local API integration, configure `BLIES_BACKEND_URL=http://localhost:3000` in an ignored local environment file and run the backend separately. Browser calls default to `/api`. On Vercel, set `BLIES_BACKEND_URL` to the actual approved HTTPS backend origin as a server-side setting. The restricted serverless proxy forwards public/customer APIs and protected customer cookies; staff/internal routes are excluded. Keep `VITE_API_BASE_URL=/api` for customer sessions. Never place a service-role key, session secret or provider credential in a `VITE_` variable.

The `/account` page uses existing design classes and provider-verified customer identity. Contact, quotation and tracking enquiries submit to the backend and only display receipt after confirmation. Document uploads require private backend storage and a real scanner. Provider failures produce error states, not substituted email-app submissions or fake records.

Use the backend's [implementation report](https://github.com/caitkaterina/Blies/blob/feat/end-to-end-integration/docs/FINAL_IMPLEMENTATION_REPORT.md), [deployment guide](https://github.com/caitkaterina/Blies/blob/feat/end-to-end-integration/docs/VERCEL_DEPLOYMENT_GUIDE.md), and [environment reference](https://github.com/caitkaterina/Blies/blob/feat/end-to-end-integration/docs/ENVIRONMENT_VARIABLES.md). Local tests do not establish live Supabase or Vercel readiness. Staging inspection/configuration and production publication approval remain prerequisites.
