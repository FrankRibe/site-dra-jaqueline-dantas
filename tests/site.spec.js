const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:4180/') && response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  page._siteErrors = errors;
  await page.goto('/');
});
test.afterEach(async ({ page }) => {
  expect(page._siteErrors, 'JavaScript errors or missing requested resources').toEqual([]);
});

test('tratamentos fechados e seleção exclusiva de cor', async ({ page }) => {
  const treatments = page.locator('.treatment-list details');
  await expect(treatments).toHaveCount(4);
  await expect(page.locator('.treatment-list details[open]')).toHaveCount(0);
  for (const index of [0, 1]) {
    const treatment = treatments.nth(index);
    await treatment.locator('summary').click();
    await expect(page.locator('.treatment-list details[open]')).toHaveCount(1);
    await treatment.getByRole('button', { name: 'BL1', exact: true }).click();
    await expect(treatment.locator('[data-tone][aria-pressed="true"]')).toHaveText('BL1');
    await treatment.getByRole('button', { name: 'A3', exact: true }).click();
    await expect(treatment.locator('[data-tone][aria-pressed="true"]')).toHaveText('A3');
    await treatment.locator('[data-view="smile"]').click();
    await expect(treatment.locator('.full-smile')).toBeVisible();
    await expect(treatment.locator('.smile-caption')).toContainText('A3');
    await treatment.locator('summary').click();
  }
});

test('galeria filtra e permite navegar e fechar', async ({ page }) => {
  await page.getByRole('button', { name: 'Clareamento', exact: true }).click();
  const photos = page.locator('.results-grid .gallery-photo:visible');
  await expect(photos).toHaveCount(3);
  await photos.first().click();
  const viewer = page.locator('#story-view');
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('[data-count]')).toHaveText('1 de 3');
  await viewer.getByRole('button', { name: 'Próxima foto' }).click();
  await expect(viewer.locator('[data-count]')).toHaveText('2 de 3');
  await viewer.getByRole('button', { name: 'Fechar destaque' }).click();
  await expect(viewer).not.toBeVisible();
});

test('menu mobile abre, navega e fecha', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Menu lateral é exclusivo do celular');
  const button = page.locator('.menu-toggle');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.locator('.mobile-drawer').getByRole('link', { name: 'Tratamentos', exact: true }).click();
  await expect(page).toHaveURL(/#tratamentos$/);
  await expect(page.locator('.mobile-drawer')).not.toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('contatos apontam para os canais corretos', async ({ page }) => {
  const links = await page.locator('a[href*="wa.me/"]').evaluateAll(nodes => nodes.map(n => n.href));
  expect(links.length).toBeGreaterThan(0);
  for (const href of links) {
    const url = new URL(href);
    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toBe('/5511986183972');
  }
  expect(await page.locator('a[href="https://www.instagram.com/drajaquelinedantas/"]').count()).toBeGreaterThan(0);
});

test('página cabe na tela e imagens locais carregam', async ({ page }) => {
  const images = page.locator('img[src]');
  for (const img of await images.all()) {
    await img.evaluate(node => { node.loading = 'eager'; });
  }
  await expect.poll(async () => images.evaluateAll(nodes => nodes.filter(n => !n.complete || n.naturalWidth === 0).map(n => n.getAttribute('src')))).toEqual([]);
  const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width + 1);
});
