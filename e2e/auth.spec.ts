import { expect, test } from '@playwright/test';

import { createActiveUser, getActivationLink, login, PASSWORD, uniqueEmail } from './helpers';

test.describe('konto użytkownika', () => {
  test('rejestracja → mail aktywacyjny → logowanie', async ({ page, request }) => {
    const email = uniqueEmail('rejestracja');

    await page.goto('/login');
    await page.getByRole('button', { name: 'Załóż konto' }).first().click();
    await page.getByLabel('Imię').fill('Nowy Użytkownik');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Hasło', { exact: true }).fill(PASSWORD);
    await page.getByLabel('Powtórz hasło').fill(PASSWORD);
    await page.locator('form').getByRole('button', { name: 'Załóż konto' }).click();

    // Konto czeka na potwierdzenie maila — formularz wraca do logowania
    await expect(page.locator('form').getByRole('button', { name: 'Zaloguj się' })).toBeVisible();

    // Link z maila otwarty w przeglądarce, tak jak kliknąłby go użytkownik
    const link = await getActivationLink(request, email);
    await page.goto(link);
    await expect(page.getByText(/potwierdzon/i)).toBeVisible();

    await login(page, email, PASSWORD);
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();
    await expect(page.getByText('Nowy Użytkownik')).toBeVisible();
  });

  test('sesja przeżywa odświeżenie strony, wylogowanie ją kończy', async ({ page, request }) => {
    const user = await createActiveUser(request, 'sesja');

    await login(page, user.email, user.password);
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();

    // Access token jest tylko w pamięci strony — po przeładowaniu sesję
    // odtwarza refresh token z ciasteczka httpOnly (POST /auth/refresh)
    await page.reload();
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();

    await page.getByRole('button', { name: 'Wyloguj' }).click();
    await expect(page.getByRole('link', { name: 'Zaloguj się' })).toBeVisible();

    // Wylogowanie unieważnia refresh token, więc przeładowanie nie loguje z powrotem
    await page.reload();
    await expect(page.getByRole('link', { name: 'Zaloguj się' })).toBeVisible();
  });

  test('błędne hasło pokazuje komunikat i nie loguje', async ({ page, request }) => {
    const user = await createActiveUser(request, 'zle-haslo');

    await login(page, user.email, 'to-nie-jest-to-haslo');

    await expect(page.getByText('Nieprawidłowy email lub hasło')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toHaveCount(0);
  });
});
