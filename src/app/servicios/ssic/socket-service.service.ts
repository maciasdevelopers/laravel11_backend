import { Injectable, ApplicationRef } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService extends Socket {

  constructor(appRef: ApplicationRef) {
    super(
      {
        url: 'http://localhost:3000', // 👈 pon aquí tu backend
        options: {}
      },
      appRef // 👈 se pasa como segundo argumento obligatorio
    );
  }
}
