import { defineConfig, devices } from '@playwright/test';

// Testy E2E: prawdziwa przeglądarka klika po zbudowanym frontendzie, który
// rozmawia z prawdziwym backendem i bazą (e2e/docker-compose.yml). Testy
// jednostkowe (jest) mockują API, a tu sprawdzamy, czy całość działa razem:
// proxy /api-proxy, ciasteczko z refresh tokenem, maile z linkami.
//
// Backend musi już stać: docker compose -f e2e/docker-compose.yml up -d --wait
export default defineConfig({
  testDir: './e2e',
  // Testy dzielą jedną bazę, ale każdy zakłada własne konto z unikalnym
  // mailem, więc mogą iść równolegle
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // W CI jedna powtórka na wypadek chwilowej czkawki środowiska; lokalnie
  // zero, żeby niestabilny test od razu było widać
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    // Ślad (zrzuty, DOM, sieć) tylko z nieudanych prób — do obejrzenia w
    // raporcie HTML, który CI wrzuca jako artefakt
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Produkcyjny build, nie `next dev`: testujemy to samo, co trafia do
    // obrazu. BASE_URL jest wpiekany w rewrite /api-proxy przy buildzie,
    // więc musi być ustawiony już tutaj, a nie dopiero przy starcie.
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    env: {
      BASE_URL: 'http://127.0.0.1:3001',
      NEXT_PUBLIC_BASE_URL: 'http://127.0.0.1:3001'
    },
    timeout: 240_000,
    // Lokalnie można mieć już odpalony frontend i nie czekać na build
    reuseExistingServer: !process.env.CI
  }
});
