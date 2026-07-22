import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if ((context.getType() as string) === 'graphql') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Request completed successfully',
        data,
      })),
    );
  }
}
