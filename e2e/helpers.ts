import { APIRequestContext, expect, Page } from '@playwright/test';

// Adresy usług z e2e/docker-compose.yml. 127.0.0.1, a nie localhost:
// localhost potrafi rozwiązać się najpierw na IPv6 (::1), a porty są
// wystawione tylko na IPv4.
export const API_URL = 'http://127.0.0.1:3001';
const MAILDEV_URL = 'http://127.0.0.1:1080';

export const PASSWORD = 'e2e-haslo-123';

// Każdy test zakłada własne konto — testy idą równolegle na jednej bazie
// i nie mogą sobie nawzajem podbierać użytkowników ani postów
export const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.local`;

type MaildevEmail = { to: { address: string }[]; subject: string; text: string };

// Czeka na mail do danego adresu i wyciąga z niego link aktywacyjny.
// expect.poll zamiast stałego sleepa: backend wysyła mail asynchronicznie,
// więc sprawdzamy skrzynkę, aż się pojawi (albo minie limit czasu).
export const getActivationLink = async (request: APIRequestContext, email: string) => {
  let link = '';

  await expect
    .poll(
      async () => {
        const response = await request.get(`${MAILDEV_URL}/email`);
        const emails = (await response.json()) as MaildevEmail[];
        const mail = emails.find((m) => m.to.some((to) => to.address === email));
        link = mail?.text.match(/https?:\/\/\S+\/activate\?token=[\w-]+/)?.[0] ?? '';

        return link;
      },
      { message: `mail aktywacyjny do ${email}`, timeout: 15_000 }
    )
    .not.toBe('');

  return link;
};

// Gotowe, aktywne konto przez API, bez klikania — dla testów, w których
// rejestracja nie jest tym, co sprawdzamy. Tą samą drogą co użytkownik:
// rejestracja, mail, potwierdzenie tokenem z maila.
export const createActiveUser = async (request: APIRequestContext, prefix: string) => {
  const email = uniqueEmail(prefix);

  const register = await request.post(`${API_URL}/auth/register`, {
    data: { name: `E2E ${prefix}`, email, password: PASSWORD }
  });
  expect(register.status()).toBe(201);

  const link = await getActivationLink(request, email);
  const token = new URL(link).searchParams.get('token');
  const verify = await request.post(`${API_URL}/auth/verify-email`, { data: { token } });
  expect(verify.ok()).toBe(true);

  return { email, password: PASSWORD, name: `E2E ${prefix}` };
};

export const login = async (page: Page, email: string, password: string) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Hasło', { exact: true }).fill(password);
  // W formularzu, bo "Zaloguj się" to też nazwa zakładki nad nim
  await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
};
