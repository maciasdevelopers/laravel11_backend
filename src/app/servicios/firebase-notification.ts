import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseNotification {
  private app = initializeApp(environment.firebase);
  private messaging = getMessaging(this.app);

  // Pedir permiso al usuario y obtener token
  requestPermission(): Promise<string | null> {
    return getToken(this.messaging, { vapidKey: environment.vapidKey })
      .then(token => token)
      .catch(err => {
        console.error('No se pudo obtener token FCM:', err);
        return null;
      });
  }

  // Escuchar mensajes en foreground
  listenMessages(callback: (payload: any) => void) {
    onMessage(this.messaging, callback);
  }
}