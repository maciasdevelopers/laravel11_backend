import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CancelServiceService {
  private cancelPendingRequests$ = new Subject<void>()

  constructor() { } /** Cancels all pending Http requests. */

  public cancelPendingRequests() {
    this.cancelPendingRequests$.next()
  }

  public onCancelPendingRequests() {
    return this.cancelPendingRequests$.asObservable()
  }
}
