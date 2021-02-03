import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerLoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private spinnerService: NgxSpinnerService
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.totalRequests++;
    this.spinner(true);
    return next.handle(request).pipe(
      tap(res => {
        if (res instanceof HttpResponse) {
          this.decreaseRequests();
        }
      }),
      catchError(err => {
        this.decreaseRequests();
        throw err;
      })
    );
  }

  private decreaseRequests() {
    this.totalRequests--;
    if (this.totalRequests === 0) {
      this.spinner(false);
    }
  }

  private spinner(loading: boolean): void {
    if (loading) {
      this.spinnerService.show();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 500);
    }
  }
}