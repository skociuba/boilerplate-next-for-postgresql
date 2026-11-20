# Boilerplate and Starter for Next JS 14+, Tailwind CSS 3 and TypeScript

https://github.com/hadrysm/nextjs-boilerplate/blob/main/src/components/templates/MainLayout/MainLayout.test.tsx
🚀 Boilerplate and Starter for Next.js, Tailwind CSS and TypeScript ⚡️ Made with developer experience first: Next.js (app routing), TypeScript, ESLint, Prettier, Husky, Lint-Staged, Jest, React Testing Library, PostCSS, Tailwind CSS, Storybook, Plop, GH actions.

![Cover](https://svgshare.com/i/idk.svg)

## :rocket: Features

Developer experience first:

- [Next.js](https://nextjs.org) for Static Site Generator
- Type checking [TypeScript](https://www.typescriptlang.org)
- Integrate with [Tailwind CSS](https://tailwindcss.com)
- [Storybook](https://storybook.js.org) for components documentation
- Strict Mode for TypeScript and React 18
- Linter with [ESLint](https://eslint.org)
- Code Formatter with [Prettier](https://prettier.io)
- [Husky](https://typicode.github.io/husky/#/) for Git Hooks
- [Lint-staged](https://github.com/okonet/lint-staged) for running linters on Git staged files
- Testing with [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/)
- Absolute Imports using `@` prefix
- Nextjs custom layouts
- [T3 env](https://env.t3.gg/) Manage your environment variables with ease
- Message convention for git
- Maximize lighthouse score
- GH actions
- Components generation with [Plop](https://plopjs.com/) and [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) convention

## 📅 Plans

- [Bundler Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [next-pwa](https://github.com/shadowwalker/next-pwa)

## 🧪 Testing

All tests are collocated with the source code inside the same directory. So, it makes it easier to find them. Coverage threshold is set to `70%`. In the `.jest` folder there is a custom provider for the all tests.

### End-to-end (Playwright)

`e2e/` runs a real browser against a production build of the frontend, talking to the real
backend image (`sebastiankociuba/node-backend:latest`), PostgreSQL and MailDev. Covered flows:
registration with the activation link read from the e-mail, login, session surviving a page
reload (refresh token cookie), logout, wrong password, and creating/editing/deleting a post.

```sh
docker compose -f e2e/docker-compose.yml up -d --wait   # db + backend + maildev
npx playwright install chromium                          # once
npm run test:e2e                                         # builds and starts the frontend itself
docker compose -f e2e/docker-compose.yml down
```

CI runs the same steps in the `e2e` job; the image is built only when both `test` and `e2e` pass.

## :information_source: How To Use

To use this template you can simply click in **[Use this template](https://github.com/hadrysm/nextjs-boilerplate/generate)** or create your Next.js app based on this template by running:

```bash
pnpm create next-app -e https://github.com/hadrysm/nextjs-boilerplate
```

## 🚀 Deploy to production

Install command on Vercel:

```
corepack use pnpm@`pnpm -v` && pnpm i
```

You can see the results locally in production mode with:

```shell
pnpm build
```

```shell
pnpm start
```

## 📈 Monitoring and error tracking

- **Uptime** — [public status page](https://stats.uptimerobot.com/BinXvsm3RH): UptimeRobot checks
  the site and the API health endpoint every 5 minutes and emails on downtime.
- **Errors** — Sentry ([src/sentry.shared.ts](src/sentry.shared.ts)) reports unexpected errors
  from the browser and from server-side rendering, tagged with the commit the image was built
  from. Users see an error screen with a retry button instead of a blank page
  ([src/app/[locale]/error.tsx](src/app/[locale]/error.tsx)). Cookies, headers and request bodies
  are not sent; there is no tracing or session replay.
- **Readable stack traces** — CI uploads source maps to Sentry while building the image (token
  passed as a Docker build secret, so it never ends up in the image) and removes them from the
  build, so the original source is not served publicly.

Configuration: repository variable `NEXT_PUBLIC_SENTRY_DSN` and secret `SENTRY_AUTH_TOKEN`.
Without the DSN (local, tests, E2E) Sentry stays off.

## :gear: Generating components

```bash
pnpm generate Button
```

Result (if you chose an atom component):

```
└── components
      └── atoms
        └── Button
          ├── index.ts
          ├── Button.stories.tsx
          ├── Button.test.tsx
          └── Button.tsx
```

## 🤝 Contributing

1. Fork this repository;
2. Create your branch: `git checkout -b my-awesome-contribution`;
3. Commit your changes: `git commit -m 'feat: Add some awesome contribution'`;
4. Push to the branch: `git push origin my-awesome-contribution`.

## License

Licensed under the MIT License, Copyright © 2024

See [LICENSE](LICENSE) for more information.

---

Made with much :heart: and :muscle: by Mateusz Hadryś :blush: <a href="https://www.linkedin.com/in/mateusz-hadry%C5%9B/">My Contact</a>
