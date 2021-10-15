import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, path: url } = request;
    const timeStart: Date = new Date();

    response.on('close', () => {
      const { statusCode } = response;

      const timeEnd: Date = new Date();

      const time: number = timeEnd.getTime() - timeStart.getTime();

      this.logger.log(`${method} ${url} ${statusCode} ${time}ms`);
    });

    next();
  }
}
