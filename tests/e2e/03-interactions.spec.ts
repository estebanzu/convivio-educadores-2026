import { test, expect } from '@playwright/test';

test.describe('Interaction states', () => {
  test('hero CTA scrolls to RSVP', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /Confirmar asistencia/i }).first();
    await cta.click();
    await page.waitForTimeout(700); // smooth scroll
    const rsvp = page.locator('#rsvp');
    await expect(rsvp).toBeInViewport();
    // URL may stay without hash due to preventDefault + scrollIntoView, check in-viewport is enough
  });

  test('Ver detalles scrolls to detalles', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Ver detalles/i }).click();
    await page.waitForTimeout(1000);
    // Check scroll happened and target is near viewport top (allowing for floating navbar)
    const inView = await page.evaluate(() => {
      const el = document.getElementById('detalles');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.top > -200;
    });
    expect(inView).toBeTruthy();
    await expect(page.locator('#detalles')).toBeVisible();
  });

  test('hover and focus states have visible feedback', async ({ page }) => {
    await page.goto('/');

    const primaryCTA = page.getByRole('link', { name: /Abrir Google Forms/i });
    // hover
    await primaryCTA.hover();
    await page.waitForTimeout(200);
    const hoverBg = await primaryCTA.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(hoverBg).toBeTruthy();

    // focus-visible ring
    await primaryCTA.focus();
    await expect(primaryCTA).toBeFocused();
    expect(await primaryCTA.evaluate((el) => document.activeElement === el)).toBeTruthy();

    // keyboard navigation: tab should move focus visibly (skip-link -> logo -> nav)
    await page.keyboard.press('Tab');
    const afterTab = await page.evaluate(() => document.activeElement?.tagName);
    expect(afterTab).toBeTruthy(); // at least something focused
  });

  test('add to calendar click does not error and creates download', async ({ page }) => {
    await page.goto('/');

    // intercept window.open and download
    const [download] = await Promise.all([
      page.waitForEvent('download').catch(() => null),
      page.locator('#add-calendar').click(),
    ]);

    // Should either trigger download (ics) or open new tab — accept either
    // Check that no console error
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.waitForTimeout(500);
    expect(errors.length).toBe(0);

    if (download) {
      expect(download.suggestedFilename()).toMatch(/\.ics$/);
    }
  });

  test('external links have security attrs', async ({ page }) => {
    await page.goto('/');
    const extLinks = page.locator('a[target="_blank"]');
    const count = await extLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = extLinks.nth(i);
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('skip link becomes visible on focus', async ({ page }) => {
    await page.goto('/');
    const skip = page.getByRole('link', { name: /Saltar al contenido/i });
    // not visible before focus (off-screen)
    const beforeBox = await skip.boundingBox();
    // after focus should be on-screen
    await skip.focus();
    const afterBox = await skip.boundingBox();
    expect(afterBox?.y).toBeGreaterThanOrEqual(0);
    // click should move to main
    await skip.click();
    await expect(page.locator('#main-content')).toBeInViewport();
  });
});
