import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfCotizaciones } from '../../interfaces/interf-cotizaciones';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient:HttpClient) {
    this.url = global.urlApi;
  }

  cotiSolicitudes(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_solicitudes_cotizacion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  solicitudesCotizacionCotizadas(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_solicitudes_cotizacion_cotizadas',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  solicitud_cotizacion_detalle(token_solicitud_cotizacion:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_solicitud_cotizacion":token_solicitud_cotizacion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_solicitud_cotizacion_detalle',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotNewPrevReq(token_solicitud:any,token_detalle_requisicion:any,prov_cotizaciones:any,adicionales:any,proveedores_mejor_opcion:any,comentarios_finales:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_solicitud":token_solicitud,
      "token_detalle_requisicion":token_detalle_requisicion,"prov_cotizaciones":prov_cotizaciones,"adicionales":adicionales,"proveedores_mejor_opcion":proveedores_mejor_opcion,"comentarios_finales":comentarios_finales});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_registrar_cotizacion_preq',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotVigentes(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_catalogo_cotizaciones',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotizacion_detalle(token_cotizacion:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cotizacion":token_cotizacion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_cotizacion_detalle',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotPendientes(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_totalCotizacionesPend',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  cotNewDirecta(cotizaciones_lista_new:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"cotizaciones_lista_new":cotizaciones_lista_new});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_registrar_cotizacion_directa',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotDirectaCatalogo(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_catalogo_cotizacion_directa',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotAuthByList(token_solicitud_cotizacion:any,listado:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_solicitud_cotizacion":token_solicitud_cotizacion,"listado":listado});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_autoriza_cotizacion_all',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotAuth(token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cotizacion":token_cotizacion,
      "token_detalle_cotizacion":token_detalle_cotizacion,"token_desc_detalle_cotiza":token_desc_detalle_cotiza});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_autoriza_cotizacion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotDesAuth(token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cotizacion":token_cotizacion,
      "token_detalle_cotizacion":token_detalle_cotizacion,"token_desc_detalle_cotiza":token_desc_detalle_cotiza});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_desautoriza_cotizacion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotDirectaAuth(token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cotizacion":token_cotizacion,"token_detalle_cotizacion":token_detalle_cotizacion,"token_desc_detalle_cotiza":token_desc_detalle_cotiza});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_autoriza_cotizacion_directa',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotdirectaDesAuth(token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cotizacion":token_cotizacion,"token_detalle_cotizacion":token_detalle_cotizacion,"token_desc_detalle_cotiza":token_desc_detalle_cotiza});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_desautoriza_cotizacion_directa',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  lastCotPrevReq(token_requisicion:any,token_detalle_requisicion:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_last_cotizacion_preq',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotizaciones_autorizadas(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_cotizaciones_autorizadas',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotizacion_confirmar_contactoProv(cotizacion_tkn:any,coti_token_detalle_cotizacion:any,coti_token_desc_detalle_cotiza:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"cotizacion_tkn":cotizacion_tkn,
      "coti_token_detalle_cotizacion":coti_token_detalle_cotizacion,"coti_token_desc_detalle_cotiza":coti_token_desc_detalle_cotiza});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_cotizacion_confirmar_contactoprov',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotizaciones_preorden_compra(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_cotizaciones_preorden_compra',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cotizaciones_compra_proceso(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_cotizaciones_compra_proceso',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
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
