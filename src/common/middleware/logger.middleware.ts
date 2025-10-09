import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const start = Date.now();

    res.on('finish', () => {
      const end = Date.now();
      const duration = end - start;
      this.logger.log(
        `[Logger] ${method} ${originalUrl} - ${statusCode} ${duration}ms`,
      );
    });

    next();
  }
}
