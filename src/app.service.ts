import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  private browser: puppeteer.Browser;

  async generatePdf(file: Express.Multer.File): Promise<Buffer> {
    if (!!!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
        ],
      });
    }

    const page = await this.browser.newPage();
    await page.setContent(file.buffer.toString());

    const options: puppeteer.PDFOptions = {
      format: 'a5',
      printBackground: true,
      margin: {
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
      },
    };

    const buffer = await page.pdf(options);

    await page.close();

    return buffer;
  }
}
