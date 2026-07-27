import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { global } from './global_ssic';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  //private socket: WebSocket;
  private token_seguro_service = new BehaviorSubject<string>("tkn");
  tokenSalida$ = this.token_seguro_service.asObservable();
  public url: string;
  
  constructor(private _httpClient: HttpClient) {
    //this.socket = new WebSocket('ws://localhost:8080');
    this.url = global.urlApi;
  }

  onMessage(callback: (data: any) => void): void {
    //this.socket.onmessage = (event) => {const data = JSON.parse(event.data);callback(data);};
  }

  sendMessage(message: any): void {
    //this.socket.send(JSON.stringify(message));
  }

  registraToken(deviceToken:any){
    this.token_seguro_service.next(deviceToken);
  }

  getNotificacionesUser():Observable<any>{
    let headers = new HttpHeaders({'Authorization': `Bearer ${sessionStorage.getItem('inside_session_code')}`});
    return this._httpClient.get(this.url+'notificaciones',{headers: headers}); // enviar las peticiones ajax
  }

  getNotificacionesDepreciaciones():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_depreciaciones_pendientes',null); // enviar las peticiones ajax
  }

  getNotificacionesSinLeerUser(): Observable<any> {
    const token = sessionStorage.getItem('inside_session_code');
    // Si no hay token, devolvemos un observable de un array vacío
    if (!token) {
      return of([]); // Importa 'of' de 'rxjs'
    }
    let headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this._httpClient.get(this.url + 'notificaciones_sin_leer', { headers: headers });
  }

  marcarComoLeida(id: string): Observable<any> {
    return this._httpClient.post(`${this.url}notificaciones/${id}/marcar-leida`, {});
  }
}
 