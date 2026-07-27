import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class RelojChecadorService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = global.urlApi;
  }

  checkIn(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code'),
      ...data
    });
    let params = 'json=' + encodeURIComponent(json);
    return this.http.post(this.url + 'reloj_checador_entrada', params, { headers: headers })
      .pipe(catchError(this.handlerError));
  }

  checkOut(data: any, evidence?: File): Observable<any> {
    const formData = new FormData();
    let json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code'),
      ...data
    });
    formData.append('json', json);
    if (evidence) {
      formData.append('evidencia', evidence);
    }
    return this.http.post(this.url + 'reloj_checador_salida', formData)
      .pipe(catchError(this.handlerError));
  }

  getAttendanceHistory(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let json = JSON.stringify({ user_token: sessionStorage.getItem('inside_session_code') });
    let params = 'json=' + encodeURIComponent(json);
    return this.http.post(this.url + 'reloj_checador_asistencias', params, { headers: headers })
      .pipe(catchError(this.handlerError));
  }

  requestLeave(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code'),
      ...data
    });
    let params = 'json=' + encodeURIComponent(json);
    return this.http.post(this.url + 'reloj_checador_solicitar_permiso', params, { headers: headers })
      .pipe(catchError(this.handlerError));
  }

  getUserWorkProfile(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let json = JSON.stringify({ user_token: sessionStorage.getItem('inside_session_code') });
    let params = 'json=' + encodeURIComponent(json);
    return this.http.post(this.url + 'reloj_checador_perfil_trabajador', params, { headers: headers })
      .pipe(catchError(this.handlerError));
  }

  private handlerError(error: any) {
    let errorMessage = 'Ocurrió un error inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}
