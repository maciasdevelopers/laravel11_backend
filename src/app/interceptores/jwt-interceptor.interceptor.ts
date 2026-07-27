import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderServService } from '../servicios/ssic/loader-serv.service';
import { HttpCancelService } from '../servicios/ssic/http-cancel.service';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private httpCancel: HttpCancelService) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //console.log(request.url);
    return next.handle(request).pipe(takeUntil(this.httpCancel.onCancelPendingRequests()));
  }
}
