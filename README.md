# VPS2 — Frontend

Next.js frontend of a small blogging app: public post feed with search and tags, accounts with email
activation, profiles, and an admin area for users and tags. Polish and English. Runs as a Docker
container on a VPS behind nginx, next to the
[backend API](https://github.com/skociuba/backend-boilerplate).

**Live:** [app](https://skociuba-vps2.duckdns.org/vps2) ·
[status page](https://stats.uptimerobot.com/BinXvsm3RH) ·
server setup: [ansible/](ansible/README.md)

## Highlights

- **Session handling** — the access token lives only in memory, never in `localStorage`; the
  refresh token is an `HttpOnly` cookie set by the API. Requests go through a same-origin
  `/api-proxy` rewrite, so the cookie is first-party. On a `401` the client refreshes the token once
  and retries; parallel requests wait for the same refresh, because the API rotates refresh tokens
  and a second refresh would invalidate the first.
- **Real end-to-end tests** — Playwright drives a production build against the real backend image,
  PostgreSQL and MailDev: registration with the activation link read from the email, login, a
  session surviving a reload, logout, and post CRUD.
- **Errors handled for the user and the team** — an error screen with a retry button instead of a
  blank page, and Sentry reports from the browser and from server rendering, with readable stack
  traces (source maps uploaded in CI, not served publicly).
- **Delivery** — every pull request runs ESLint (with Prettier), unit tests, a dependency audit, the
  E2E suite, an Ansible lint and a production build (which also type-checks) with a Trivy scan. Releases are versioned by
  release-please and deployed after a manual approval.
- **Privacy** — no analytics, trackers or scripts loaded from third parties; error reports to Sentry
  carry no personal data. The [privacy policy](https://skociuba-vps2.duckdns.org/vps2/privacy)
  matches what the code stores and sends.

## Tech stack

| Area      | Tools                                                                        |
| --------- | ---------------------------------------------------------------------------- |
| Framework | Next.js 15 (App Router, standalone output), React 19, TypeScript             |
| UI        | Tailwind CSS 4, lucide-react, react-toastify                                 |
| Data      | TanStack Query, Zustand (current user), Formik + Yup and Zod for forms       |
| i18n      | next-intl (Polish, English)                                                  |
| Testing   | Jest + React Testing Library, Playwright                                     |
| Quality   | ESLint 9 (flat config), Prettier, husky + lint-staged, `npm audit` allowlist |
| Delivery  | Docker, GitHub Actions, release-please, Trivy, Docker Hub                    |
| Ops       | nginx + Let's Encrypt, Ansible, Sentry, UptimeRobot                          |

## Delivery pipeline

1. **Pull request** — `test` (ESLint with Prettier, unit tests, dependency audit with documented
   exceptions in [audit-allowlist.json](audit-allowlist.json)), `e2e` (Playwright on the real stack),
   `ansible` (playbook syntax and lint) and `build` (production image, which also type-checks, plus a
   Trivy scan).
2. **Merge to `master`** — the image is pushed as `:<commit-sha>` and source maps go to Sentry.
   release-please keeps a release PR open with the next version and changelog.
3. **Merge the release PR** — tags `vX.Y.Z`, retags the scanned image as `:X.Y.Z` and `:latest` and
   deploys it after approval in the `production` environment.
4. **Rollback** — Actions → "Deploy Frontend" → run with an older version, or
   [scripts/rollback.sh](scripts/rollback.sh) on the server.

Git hooks run ESLint and Prettier on staged files and lint, types and unit tests before a push.

## Monitoring and error tracking

- **Uptime** — UptimeRobot checks the site and the API health endpoint every 5 minutes and emails
  on downtime ([status page](https://stats.uptimerobot.com/BinXvsm3RH)).
- **Errors** — Sentry ([src/sentry.shared.ts](src/sentry.shared.ts)) reports unexpected errors from
  the browser and from server-side rendering, tagged with the commit the image was built from.
  Cookies, headers and request bodies are not sent; there is no tracing or session replay.
- **Source maps** — uploaded while CI builds the image (the token is a Docker build secret, so it is
  not stored in the image) and deleted from the build afterwards.

Configuration: repository variable `NEXT_PUBLIC_SENTRY_DSN` and secret `SENTRY_AUTH_TOKEN`. Without
the DSN (local runs, tests, E2E) Sentry stays off.

## Running locally

Requirements: Node.js 22, and the [backend](https://github.com/skociuba/backend-boilerplate) running
locally (its README covers the setup). Start it on port 3001 so it does not clash with Next.js:

```sh
# in the backend repo
PORT=3001 npm start

# here
npm install
BASE_URL=http://localhost:3001 npm run dev    # http://localhost:3000
```

`BASE_URL` is where the `/api-proxy` rewrite sends API calls. In production it is baked in at build
time (a build argument in CI).

### Tests

```sh
npm test                 # unit tests (React Testing Library), collocated with the components
npm run lint             # ESLint
npx tsc --noEmit         # types
```

End-to-end tests run a real browser against a production build, the backend image, PostgreSQL and
MailDev:

```sh
docker compose -f e2e/docker-compose.yml up -d --wait   # db + backend + maildev
npx playwright install chromium                          # once
npm run test:e2e                                         # builds and starts the frontend itself
docker compose -f e2e/docker-compose.yml down
```

### Generating components

`npm run generate` scaffolds a component with its test from the templates in [.plop/](.plop/).

## Project structure

```
src/
  app/[locale]/        routes (App Router), one folder per page; error.tsx is the error screen
  components/
    features/          feature components (Auth, Posts, Profile, Tags, Users, ...)
    layout/            navbar, footer, cookie notice, page layout
    ui/                buttons, inputs, dropdowns
  hooks/api/           TanStack Query hooks for the API
  lib/                 API client (silent refresh), auth store, validation
  instrumentation*.ts  Sentry setup for the browser and the server
messages/              translations (pl, en)
e2e/                   Playwright tests and the stack they run against
ansible/               server configuration (see ansible/README.md)
scripts/               dependency audit with an allowlist, rollback
```
