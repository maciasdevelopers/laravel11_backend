import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfBancos } from '../interfaces/interf-bancos';
import { global } from './global_ssic';
import { Usuarios } from '../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class PuntoVentaService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

//asociados
  catalogoPuntoDeVenta(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_puntodeventa_lista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizarPuntoVentaAsociados(token_puntodeventa:any,alias:any,tipo:any,tasa_tarifa:any,importe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_puntodeventa":token_puntodeventa,
      "impuesto_alias":alias,"impuesto_tipo":tipo,"impuesto_tasa_tarifa":tasa_tarifa,"impuesto_importe":importe});
    console.log(json)
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_puntodeventa_actualizar',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  papeleraSavePuntoVentaAsociados(token_puntodeventa:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_puntodeventa":token_puntodeventa});
    console.log(json)
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_puntodeventa_papelera_save',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  catalogoPuntoVentaEliminadosAsociados():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_puntodeventa_papelera_catalogo',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  restaurarPuntoVentaAsociados(token_puntodeventa:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_puntodeventa":token_puntodeventa});
    console.log(json)
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_puntodeventa_restaurar',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  eliminarPermPuntoVentaAsociados(token_puntodeventa:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_puntodeventa":token_puntodeventa});
    console.log(json)
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_puntodeventa_eliminar',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  newPuntoVentaAsociados(alias:any,nombre:any,responsable:any,observaciones:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "punto_venta_alias":alias,
      "punto_venta_nombre":nombre,
      "punto_venta_responsable":responsable,
      "punto_venta_observaciones":observaciones
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_puntodeventa_registrar',parametros, {headers: headers}).pipe(
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
