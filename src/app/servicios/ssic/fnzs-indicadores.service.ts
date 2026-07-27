import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class FnzsIndicadoresService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  private readonly banxico_link = 'https://www.banxico.org.mx/SieAPIRest/service/v1';
  private readonly banxico_token = '77a4e25ee88909e248bf672bd58af83043040bfc8caa2b9cea383dcda55c7fd5';

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }
  //home finanzas_indicadores_inpc_banxico
  indicadores_inpc_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_inpc_banxico').pipe(catchError(this.handlerError))
  }

  indicadores_tasa_recargos_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_tasa_recargos_banxico').pipe(catchError(this.handlerError))
  }

  indicadores_sal_min_gral_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_salario_minimo_general_banxico').pipe(catchError(this.handlerError))
  }

  indicadores_sal_min_front_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_salario_minimo_fronterizo_banxico').pipe(catchError(this.handlerError))
  }

  indicadores_uma_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_uma_banxico').pipe(catchError(this.handlerError))
  }

  indicadores_udi_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_udi_banxico').pipe(catchError(this.handlerError))
  }

  indicadores_tipo_de_cambio_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_tipo_de_cambio_banxico').pipe(catchError(this.handlerError))
  }


  indicadores_tiie_banxico(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_tiie_banxico').pipe(catchError(this.handlerError))
  }

  verHomeIndicadores(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_economicos')
      .pipe(catchError(this.handlerError))
  }

  //modulo de fiinanzas
  verFnzsIndicadores(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_economicos')
      .pipe(catchError(this.handlerError))
  }

  indicadores_inpc(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_inpc')
      .pipe(catchError(this.handlerError))
  }

  indicadores_inpc_new(valor: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "valor": valor });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'indicadores_inpc_registrar', parametros, { headers: headers })
      .pipe(catchError(this.handlerError));
  }

  indicadores_tasa_recargos(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_tasa_recargos')
      .pipe(catchError(this.handlerError))
  }

  indicadores_tipo_cambio(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_tipo_cambio')
      .pipe(catchError(this.handlerError))
  }

  indicadores_salario_minimo(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_salario_minimo')
      .pipe(catchError(this.handlerError))
  }

  indicadores_salario_min_front(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_salario_min_front')
      .pipe(catchError(this.handlerError))
  }

  indicadores_uma(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_uma')
      .pipe(catchError(this.handlerError))
  }

  indicadores_udi(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_udi')
      .pipe(catchError(this.handlerError))
  }

  indicadores_tiie(): Observable<any> {
    return this._httpClient.get(this.url + 'finanzas_indicadores_tiie')
      .pipe(catchError(this.handlerError))
  }

  handlerError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}
