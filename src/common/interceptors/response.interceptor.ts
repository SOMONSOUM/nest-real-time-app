import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest();
    const path = request.url;
    const method = request.method;

    return next.handle().pipe(
      map((data) => ({
        code: context.switchToHttp().getResponse().statusCode ?? 200,
        method,
        message: 'Success',
        timestamp: new Date().toISOString(),
        path,
        responseTime: `${Date.now() - now}ms`,
        data,
      })),
    );
  }
}
