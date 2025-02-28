import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseHttpInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    if (false) {
      throw new ServiceUnavailableException();
    }

    return next.handle().pipe(
      map((response) => {
        return {
          data: response.data,
          pagination: response.pagination,
          message: response.message,
          title: response.title,
          version: '1.0.1',
        };
      }),
    );
  }
}
