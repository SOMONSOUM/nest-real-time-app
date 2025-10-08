import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const path = request.url;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      this.logger.log('typeof', typeof res, typeof res === 'string');
      message =
        typeof res === 'string' ? res : res['message'] || exception.message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = `No record found for ${exception.meta?.modelName?.toString()}`;
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      }
    }

    response.status(status).json({
      code: status,
      method: request.method,
      message,
      timestamp: new Date().toISOString(),
      path,
    });
  }
}
