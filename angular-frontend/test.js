const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to Angular
    await page.goto('http://localhost:63830');

    // Wait for pagination exactly
    await page.waitForSelector('.hn-page-btn');

    let pageInfo = await page.$eval('.hn-page-nums', el => el.textContent);
    console.log('Initial page:', pageInfo);

    // Click Next
    const buttons = await page.$$('.hn-page-btn');
    await buttons[1].click(); // Second button is Next (Prev is first)

    await new Promise(r => setTimeout(r, 1000));

    pageInfo = await page.$eval('.hn-page-nums', el => el.textContent);
    console.log('After Next click:', pageInfo);

    await browser.close();
})();
