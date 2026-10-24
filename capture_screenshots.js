import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://localhost:4173';
const OUTPUT_DIR = path.resolve('screenshots');
const ARTIFACT_DIR = 'C:\\Users\\Sidhu\\.gemini\\antigravity-ide\\brain\\67f0d7d9-98c1-431d-8cf1-971beb1267af\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function capture() {
  console.log('--- Launching Chrome for Cross-Browser Capture ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Chrome Desktop Dark
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'chrome-desktop-dark.png') });
  console.log('Saved: chrome-desktop-dark.png');

  // 2. Chrome Desktop Light (Toggle theme)
  const themeToggle = await page.$('[data-testid="theme-toggle-btn"]');
  if (themeToggle) {
    await themeToggle.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'chrome-desktop-light.png') });
    console.log('Saved: chrome-desktop-light.png');
    // Switch back to dark
    await themeToggle.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // 3. Form Validation Errors State
  const submitBtn = await page.$('[data-testid="submit-transaction-btn"]');
  if (submitBtn) {
    await submitBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'chrome-form-validation.png') });
    console.log('Saved: chrome-form-validation.png');
  }

  // 4. Budget Alert Triggered State
  const editBudgetBtn = await page.$('[data-testid="edit-budget-btn"]');
  if (editBudgetBtn) {
    await editBudgetBtn.click();
    await new Promise((r) => setTimeout(r, 200));
    const budgetInput = await page.$('[data-testid="budget-input-field"]');
    if (budgetInput) {
      await budgetInput.click();
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');
      await budgetInput.type('500');
      const saveBudgetBtn = await page.$('[data-testid="save-budget-btn"]');
      if (saveBudgetBtn) {
        await saveBudgetBtn.click();
        await new Promise((r) => setTimeout(r, 400));
        await page.screenshot({ path: path.join(OUTPUT_DIR, 'chrome-budget-alert.png') });
        console.log('Saved: chrome-budget-alert.png');
      }
    }
  }

  // 5. Tablet Viewport (iPad 768x1024)
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'chrome-tablet.png') });
  console.log('Saved: chrome-tablet.png');

  // 6. Mobile Viewport (iPhone SE 375x667)
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'chrome-mobile.png') });
  console.log('Saved: chrome-mobile.png');

  await browser.close();

  // 7. Microsoft Edge Desktop Capture
  if (fs.existsSync(EDGE_PATH)) {
    console.log('--- Launching Microsoft Edge for Cross-Browser Verification ---');
    const edgeBrowser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const edgePage = await edgeBrowser.newPage();
    await edgePage.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await edgePage.goto(URL, { waitUntil: 'networkidle0' });
    await edgePage.screenshot({ path: path.join(OUTPUT_DIR, 'edge-desktop-dark.png') });
    console.log('Saved: edge-desktop-dark.png');
    await edgeBrowser.close();
  }

  // Copy screenshots to artifact directory
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    if (file.endsWith('.png')) {
      fs.copyFileSync(path.join(OUTPUT_DIR, file), path.join(ARTIFACT_DIR, file));
    }
  }
  console.log('All screenshots synchronized to artifacts directory!');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
