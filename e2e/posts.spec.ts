import { expect, test } from '@playwright/test';

import { createActiveUser, login } from './helpers';

test('dodanie, edycja i usunięcie własnego posta', async ({ page, request }) => {
  const user = await createActiveUser(request, 'posty');
  const title = `Post E2E ${Date.now()}`;

  await login(page, user.email, user.password);
  await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();

  await page.goto('/posts');
  await expect(page.getByText('Nie masz jeszcze żadnych postów.')).toBeVisible();

  await page.getByRole('link', { name: 'dodaj wpis' }).click();
  await page.getByLabel('Tytuł').fill(title);
  await page.getByLabel('Treść').fill('Treść dodana przez test E2E.');
  await page.getByRole('button', { name: 'Zapisz' }).click();

  await expect(page).toHaveURL(/\/posts$/);
  await expect(page.getByText(title)).toBeVisible();

  // Edycja: formularz ładuje istniejące dane, zapis zmienia tytuł na liście
  await page.getByRole('link', { name: 'edytuj' }).click();
  await expect(page.getByLabel('Tytuł')).toHaveValue(title);
  await page.getByLabel('Tytuł').fill(`${title} (poprawiony)`);
  await page.getByRole('button', { name: 'Zapisz' }).click();
  await expect(page.getByText(`${title} (poprawiony)`)).toBeVisible();

  await page.getByRole('button', { name: 'usuń' }).click();
  await expect(page.getByText('Nie masz jeszcze żadnych postów.')).toBeVisible();
});
