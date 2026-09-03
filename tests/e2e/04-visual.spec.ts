import { test, expect } from '@playwright/test';

test.describe('Visual regressions', () => {
  test('full page snapshot — desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(800); // let countdown and fonts settle
    // hide dynamic countdown numbers to avoid flakiness — mask it
    await expect(page).toHaveScreenshot('full-desktop.png', {
      fullPage: true,
      mask: [page.locator('#countdown')],
      maxDiffPixelRatio: 0.03,
    });
  });

  test('full page snapshot — mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot('full-mobile.png', {
      fullPage: true,
      mask: [page.locator('#countdown')],
      maxDiffPixelRatio: 0.03,
    });
  });

  test('hero and RSVP sections snapshots', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero')).toHaveScreenshot('hero.png', { maxDiffPixelRatio: 0.04 });
    await expect(page.locator('#rsvp')).toHaveScreenshot('rsvp.png', { maxDiffPixelRatio: 0.04 });
  });

  test('no layout shift after hydration', async ({ page }) => {
    await page.goto('/');
    // measure hero height before and after JS hydration
    const h1 = await page.locator('#hero').boundingBox().then((b) => b?.height ?? 0);
    await page.waitForTimeout(1200);
    const h2 = await page.locator('#hero').boundingBox().then((b) => b?.height ?? 0);
    // allow 4px tolerance for font rendering
    expect(Math.abs(h2 - h1)).toBeLessThan(8);
  });
});
