import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  private browser: puppeteer.Browser;
  private logger: Logger = new Logger('PUPPETEER');

  constructor() {
    const createBrowser = async () => {
      this.logger.log('Launching browser...');

      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
        ],
      });
      this.browser.on('disconnected', () => {
        this.logger.log('Disconnected');

        createBrowser();
      });

      this.logger.log('Init...Done');
    };

    (async () => {
      await createBrowser();
    })();
  }

  async generatePdf(file: Express.Multer.File): Promise<Buffer> {
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
