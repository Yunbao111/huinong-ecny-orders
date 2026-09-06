const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseURL = 'http://localhost:3000';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifacts = path.join(__dirname, '..', 'test-artifacts');
fs.mkdirSync(artifacts, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function attachGuards(page, label, errors) {
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label} console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`${label} pageerror: ${error.message}`));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${label} HTTP ${response.status()}: ${response.url()}`);
  });
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert(dimensions.scrollWidth <= dimensions.width + 1, `${label} horizontal overflow: ${JSON.stringify(dimensions)}`);
}

(async () => {
  const browser = await chromium.launch({ executablePath: edgePath, headless: true });
  const errors = [];
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktop.newPage();
    await attachGuards(page, 'desktop', errors);
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await assertNoOverflow(page, 'desktop home');

    const navHrefs = await page.locator('nav[aria-label="主导航"] a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    assert(JSON.stringify(navHrefs) === JSON.stringify(['/', '/orders', '/digital-rmb', '/wallet']), `desktop navigation is not four real routes: ${navHrefs}`);

    await page.getByRole('button', { name: /身份|李建国/ }).click();
    await page.getByRole('menuitemradio', { name: /李建国/ }).click();
    assert((await page.getByText('已切换为：李建国・农户').count()) === 1, 'role switch did not produce visible confirmation');

    await page.getByRole('link', { name: '我的订单' }).click();
    await page.waitForURL('**/orders');
    await page.getByRole('button', { name: '登记交货' }).click();
    await page.getByRole('button', { name: '信息无误，确认交货' }).click();
    assert((await page.getByText('交货登记成功，订单正在等待验收员验收。').count()) === 1, 'delivery confirmation missing');

    await page.getByRole('button', { name: /李建国・农户/ }).click();
    await page.getByRole('menuitemradio', { name: /王师傅/ }).click();
    await page.getByRole('button', { name: '开始现场验收' }).click();
    const accepted = page.getByLabel('验收合格（千克）');
    await accepted.fill('1900');
    assert(await page.getByRole('button', { name: '验收通过并触发仿真付款' }).isDisabled(), 'invalid weight did not disable settlement');
    assert((await page.getByRole('alert').count()) === 1, 'invalid weight message missing');
    await accepted.fill('1950');
    await page.getByRole('button', { name: '验收通过并触发仿真付款' }).click();
    await page.getByText('仿真付款完成：10,140.00 元已记入农户虚拟钱包。').waitFor({ timeout: 5000 });
    assert((await page.getByText('仿真实付货款').count()) === 1, 'paid order state missing');
    assert((await page.getByRole('button', { name: /触发仿真付款/ }).count()) === 0, 'duplicate payment trigger remained visible');
    await page.screenshot({ path: path.join(artifacts, 'orders-desktop.png'), fullPage: true });

    await page.getByRole('link', { name: '认识数币' }).click();
    await page.waitForURL('**/digital-rmb');
    await page.getByRole('button', { name: '验收接付款' }).click();
    assert((await page.getByText('交货后担心货款迟迟不到').count()) === 1, 'settlement education scene did not update');
    await page.getByRole('button', { name: '少暴露信息' }).click();
    assert((await page.getByText('农户担心个人信息被过度收集').count()) === 1, 'privacy education scene did not update');
    await assertNoOverflow(page, 'desktop digital-rmb');
    await page.screenshot({ path: path.join(artifacts, 'digital-rmb-desktop.png'), fullPage: true });

    await page.getByRole('link', { name: '数币钱包' }).click();
    await page.waitForURL('**/wallet');
    assert((await page.getByText('¥38,790.00').count()) >= 1, 'wallet balance did not include simulated payment');
    if (await page.getByRole('button', { name: '重新体验硬钱包演示' }).count()) await page.getByRole('button', { name: '重新体验硬钱包演示' }).click();
    await page.getByRole('button', { name: '模拟碰一碰收款' }).click();
    assert((await page.getByText('本机已记录，等待联网核验').count()) === 1, 'offline queued state missing');
    await page.reload({ waitUntil: 'networkidle' });
    assert((await page.getByText('本机已记录，等待联网核验').count()) === 1, 'offline queued state did not persist');
    await page.getByRole('button', { name: '模拟恢复网络并同步' }).click();
    assert((await page.getByText('仿真同步核验成功').count()) === 1, 'offline sync state missing');
    assert((await page.getByRole('button', { name: '模拟碰一碰收款' }).count()) === 0, 'duplicate offline record button remained visible');
    await page.getByRole('button', { name: '重新体验硬钱包演示' }).click();
    assert((await page.getByRole('button', { name: '模拟碰一碰收款' }).count()) === 1, 'offline reset button did not work');
    await page.screenshot({ path: path.join(artifacts, 'wallet-desktop.png'), fullPage: true });

    const allButtons = await page.locator('button').evaluateAll((buttons) => buttons.map((button) => ({ text: button.textContent.trim(), label: button.getAttribute('aria-label'), disabled: button.disabled })));
    assert(allButtons.every((button) => button.text || button.label), `button without accessible name: ${JSON.stringify(allButtons)}`);
    const badLinks = await page.locator('a').evaluateAll((links) => links.filter((link) => !link.getAttribute('href') || link.getAttribute('href') === '#').map((link) => link.textContent.trim()));
    assert(badLinks.length === 0, `non-functional links found: ${badLinks}`);
    await desktop.close();

    for (const viewport of [{ name: 'mobile', width: 390, height: 844 }, { name: 'tablet', width: 768, height: 1024 }]) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const responsivePage = await context.newPage();
      await attachGuards(responsivePage, viewport.name, errors);
      for (const route of ['/', '/orders', '/digital-rmb', '/wallet']) {
        await responsivePage.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
        await assertNoOverflow(responsivePage, `${viewport.name} ${route}`);
      }
      if (viewport.name === 'mobile') {
        await responsivePage.getByRole('link', { name: '首页', exact: true }).click();
        await responsivePage.waitForURL(baseURL + '/');
        await responsivePage.getByRole('button', { name: /身份/ }).click();
        assert((await responsivePage.getByRole('menuitemradio').count()) === 4, 'mobile role menu did not open');
        await responsivePage.screenshot({ path: path.join(artifacts, 'home-mobile-role-menu.png'), fullPage: false });
      }
      await context.close();
    }

    assert(errors.length === 0, `browser errors:\n${errors.join('\n')}`);
    console.log('PASS four routes, role switching, order settlement, education scenes, wallet offline sync, responsive layouts');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
