# node:22-alpine zamiast przypiętego 22.1.0: stary obraz nie dostawał już
# łatek systemu ani Node, a skan Trivy (ci.yml) by go zatrzymywał.
# Aktualizacje obrazu bazowego proponuje Dependabot (.github/dependabot.yml).
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

ARG NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

# Cel rewrite'u /api-proxy (next.config.mjs). next build wpisuje go na stałe
# do .next/routes-manifest.json, więc zmienna musi być ustawiona TERAZ —
# BASE_URL ustawiony dopiero przy starcie kontenera nic nie zmienia.
# Wcześniej wartość przychodziła z przypadkiem commitowanego pliku env.
ARG BASE_URL
ENV BASE_URL=$BASE_URL

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ARG NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Serwer standalone to sam `node server.js` — npm/npx w obrazie
# produkcyjnym nie są potrzebne, a to w nich skaner znajduje podatności
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# NEXT_PUBLIC_BASE_PATH (np. /vps2) jest ustawiane tym samym build-argiem
# co basePath w next.config.mjs — jedno źródło prawdy, nie duplikujemy ścieżki.
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:3000${NEXT_PUBLIC_BASE_PATH}/" || exit 1

CMD ["node", "server.js"]
