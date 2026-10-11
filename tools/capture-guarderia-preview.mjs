import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:8765/guarderia-dfe200bb/';
const OUT = '/opt/cursor/artifacts';

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: true });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await shot(page, 'guarderia-mobile-es.png');

  await page.locator('[data-lang-btn="en"]').click();
  await page.waitForTimeout(300);
  await shot(page, 'guarderia-mobile-en.png');

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator('[data-lang-btn="es"]').click();
  await page.waitForTimeout(300);
  await shot(page, 'guarderia-desktop-es.png');

  await page.locator('[data-lang-btn="en"]').click();
  await page.waitForTimeout(300);
  await shot(page, 'guarderia-desktop-en.png');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
