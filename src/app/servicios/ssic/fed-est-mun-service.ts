import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { estadosMunicipiosModelo } from '../../modelos/estadosMunicipiosModelo';

@Injectable({
  providedIn: 'root'
})
export class FedEstMunService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  fedEstMunRegistro(modelFedEstMun:estadosMunicipiosModelo): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
		  "fecha_contabilizacion": modelFedEstMun.fed_est_mun_fecha_cont,
		  "fed_est_mun_name": modelFedEstMun.fed_est_mun_name,
		  "fed_est_mun_rfc": modelFedEstMun.fed_est_mun_rfc,
		  "fed_est_mun_observaciones": modelFedEstMun.fed_est_mun_observaciones
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_registro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  fedEstMunCatalogoActivo(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_catalogo_activo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  fedEstMunDetalle(fed_est_mun_token:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"fed_est_mun_token":fed_est_mun_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  fedEstMunUpdate(fed_est_mun_token:string,modelDetFedEstMun:estadosMunicipiosModelo): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "fed_est_mun_token":fed_est_mun_token,
		  "fecha_contabilizacion": modelDetFedEstMun.fed_est_mun_fecha_cont,
		  "fed_est_mun_name": modelDetFedEstMun.fed_est_mun_name,
		  "fed_est_mun_rfc": modelDetFedEstMun.fed_est_mun_rfc,
		  "fed_est_mun_observaciones": modelDetFedEstMun.fed_est_mun_observaciones
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  fedEstMunDelete(fed_est_mun_token:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"fed_est_mun_token":fed_est_mun_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_eliminar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  fedEstMunCatalogoEliminados(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_catalogo_eliminados',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  fedEstMunRestaurar(fed_est_mun_token:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"fed_est_mun_token":fed_est_mun_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_restaurar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  fedEstMunPermDelete(fed_est_mun_token:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"fed_est_mun_token":fed_est_mun_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'finanzas_catalogos_fed_est_mun_perm_delete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  handlerError(error: { error: { message: string; }; status: any; message: any; }){
		let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
		if(error.error instanceof ErrorEvent){
			errorMessage = `Error: ${error.error.message}`;
		} else {
      errorMessage = error.error.message;
		}
		return throwError(errorMessage);
	}
}