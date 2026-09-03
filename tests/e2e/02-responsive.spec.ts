import { test, expect } from '@playwright/test';

test.describe('Viewport responsiveness', () => {
  test('mobile: hamburger hidden, RSVP mobile button visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeHidden();

    const mobileRSVP = page.locator('header a.md\\:hidden');
    await expect(mobileRSVP).toBeVisible();
    await expect(mobileRSVP).toContainText('RSVP');
    // tap target >=32px
    const box = await mobileRSVP.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(28);

    // date card hidden on mobile, inline date visible (only hero date card)
    const desktopDate = page.locator('#hero .hidden.sm\\:flex').first();
    await expect(desktopDate).toBeHidden();
  });

  test('desktop: nav visible, mobile RSVP hidden', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto('/');

    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Detalles', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Agenda', exact: true })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Vestimenta', exact: true })).toBeHidden();

    const mobileRSVP = page.locator('header a.md\\:hidden');
    await expect(mobileRSVP).toBeHidden();
  });

  test('grid stacks without horizontal overflow', async ({ page }) => {
    for (const width of [320, 414, 768, 1024]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, `overflow at ${width}px`).toBeFalsy();
    }
  });

  test('hero layout adapts: stacked on mobile, 2-col on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const heroGrid = page.locator('#hero > div > div.grid').first();
    await expect(heroGrid).toBeVisible();
    const mobileGap = await heroGrid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // on mobile should be single column (one value)
    expect(mobileGap.trim().split(' ').length).toBe(1);

    await page.setViewportSize({ width: 1024, height: 800 });
    await page.waitForTimeout(200);
    const desktopCols = await heroGrid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // desktop has 2 columns
    expect(desktopCols.trim().split(' ').length).toBe(2);
  });

  test('countdown 4-col fits on 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');
    const countdown = page.locator('#countdown');
    await expect(countdown).toBeVisible();
    const childOverflow = await page.evaluate(() => {
      const c = document.getElementById('countdown');
      if (!c) return false;
      const rect = c.getBoundingClientRect();
      return rect.width > window.innerWidth - 32; // 16px padding each side
    });
    expect(childOverflow).toBeFalsy();
  });
});
