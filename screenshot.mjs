import puppeteer from 'puppeteer';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

async function main() {
  // Launch headless browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  // Navigate to the built-in index.html using a file URL
  const filePath = path.join(process.cwd(), 'index.html');
  const url = 'file://' + filePath;
  await page.goto(url);

  // Set a small viewport so the base64 output fits in a comment
  await page.setViewport({ width: 400, height: 600 });

  // Capture screenshot
  const imagePath = 'screenshot.png';
  await page.screenshot({ path: imagePath });
  await browser.close();

  // Convert the screenshot to base64 and save to a text file
  const image = await readFile(imagePath);
  const base64 = image.toString('base64');
  await writeFile('screenshot.txt', base64);
}

main();
