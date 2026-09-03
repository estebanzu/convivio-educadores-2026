import { test, expect } from '@playwright/test';

test.describe('Initial render & core layout', () => {
  test('hero title, subtitle and CTAs are visible', async ({ page }) => {
    await page.goto('/');

    const heroTitle = page.locator('#hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText(/Convivio de/i);
    await expect(heroTitle).toContainText(/Educadores/i);

    // eyebrow
    await expect(page.getByText(/Parroquia Inmaculada Concepción de La Unión invita/i)).toBeVisible();

    // primary CTAs
    const ctaConfirm = page.getByRole('link', { name: /Confirmar asistencia/i }).first();
    await expect(ctaConfirm).toBeVisible();
    await expect(ctaConfirm).toHaveAttribute('href', /#rsvp/);

    const ctaDetalles = page.getByRole('link', { name: /Ver detalles/i });
    await expect(ctaDetalles).toBeVisible();
  });

  test('font loading — Open Sans is applied', async ({ page }) => {
    await page.goto('/');
    const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(bodyFont).toMatch(/Open Sans/i);

    // hero title uses Open Sans ExtraBold 800
    const heroWeight = await page.evaluate(() => {
      const el = document.getElementById('hero-title');
      return el ? getComputedStyle(el).fontWeight : '';
    });
    // 800 or 700+ after mapping
    expect(['800', '700', '600']).toContain(heroWeight);

    // ensure no FOIT — body should be visible without hidden
    const bodyVisible = await page.evaluate(() => {
      const b = document.body;
      return b.offsetHeight > 0 && getComputedStyle(b).visibility !== 'hidden';
    });
    expect(bodyVisible).toBeTruthy();
  });

  test('header logo and skip-link are accessible', async ({ page }) => {
    await page.goto('/');

    // skip link hidden until focus
    const skip = page.getByRole('link', { name: /Saltar al contenido principal/i });
    await expect(skip).toBeAttached();
    await skip.focus();
    await expect(skip).toBeFocused();

    // logo in header
    const logo = page.locator('header img[alt*="Parroquia Inmaculada"]');
    await expect(logo).toBeVisible();
    const logoAlt = await logo.getAttribute('alt');
    expect(logoAlt).toContain('Parroquia');

    // logo frame is round (rounded-full => large radius)
    const frame = page.locator('header span.overflow-hidden').first();
    await expect(frame).toBeVisible();
    await expect(frame).toHaveClass(/rounded-full/);
    const radius = await frame.evaluate((el) => parseFloat(getComputedStyle(el).borderRadius));
    expect(radius).toBeGreaterThan(100);
  });

  test('countdown renders without CLS — skeleton then live', async ({ page }) => {
    await page.goto('/');
    const countdown = page.locator('#countdown');
    await expect(countdown).toBeVisible();

    // Initially skeleton should have min-height to prevent CLS (visual has min-h)
    const visual = page.locator('#countdown-visual');
    await expect(visual).toBeVisible();
    const minH = await visual.evaluate((el) => getComputedStyle(el).minHeight);
    expect(minH).not.toBe('0px');

    // After JS hydrates, should have 4 units or celebration message
    await page.waitForTimeout(900);
    const hasUnits = await page.evaluate(() => {
      const el = document.getElementById('countdown-visual') || document.getElementById('countdown');
      return el ? el.textContent?.includes('días') || el?.textContent?.includes('¡Hoy es el gran día!') : false;
    });
    // skeleton at least should be replaced — check that at least one numeric card exists
    const cardCount = await page.locator('#countdown-visual > div').count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    expect(hasUnits || cardCount >= 4).toBeTruthy();
  });

  test('core sections are present', async ({ page }) => {
    await page.goto('/');
    for (const id of ['#detalles', '#agenda', '#rsvp']) {
      await expect(page.locator(id)).toBeVisible();
    }
    await expect(page.locator('#vestimenta')).toBeHidden();
    // verify detalles 3 cards (use heading role to avoid badge duplicate)
    await expect(page.getByRole('heading', { name: 'Cuándo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dónde' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Para quién' })).toBeVisible();
    // verify agenda
    await expect(page.getByRole('heading', { name: 'Eucaristía' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Refrigerio' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Convivio', exact: true })).toBeVisible();
  });

  test('map iframe lazy-loads and has title', async ({ page }) => {
    await page.goto('/');
    const iframe = page.locator('#map-iframe');
    await expect(iframe).toHaveAttribute('title', /Mapa Parroquia/i);
    await expect(iframe).toHaveAttribute('loading', 'lazy');
  });
});
