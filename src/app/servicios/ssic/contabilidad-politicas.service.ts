import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadPoliticasService {
  public url: string;

  httpOptions = {Headers: new HttpHeaders({'Content-Type': 'application/json'})}

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  lista_politicas_comisiones():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_comisiones_lista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  last_politicas_comision():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_comisiones_last',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  lista_politicas_reembolsos():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_reembolsos_lista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  last_politicas_reembolso():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_reembolsos_last',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  lista_politicas_justificaciones():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_justificaciones_lista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  last_politicas_justificacion():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_justificaciones_last',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  lista_politicas_proveedores():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_proveedores_lista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  last_politicas_proveedor():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politica_proveedores_last',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  lista_politicas_detalle(tknPolit:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"tknPolit":tknPolit});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'contabilidad_politicas_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  politica_update(tknPolit:any,tipo_politica:any,politica_concepto:any,docs_anexos_politica:any) :Observable<any>{
    console.log(docs_anexos_politica);
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"tknPolit":tknPolit,"tipo_politica":tipo_politica,"politica_concepto":politica_concepto});
    console.log(json);

    const formData = new FormData();
    for (var i = 0; i < docs_anexos_politica.length; i++) {formData.append("docs_anexos_politica[]", docs_anexos_politica[i]);}
    formData.append('solicitud',json);
    console.log(formData);
    return this._httpClient.post(this.url+'contabilidad_politica_update',formData).pipe(catchError(this.handlerError));
  }

  save_new_politica(politica_concepto:any,politica_tipo:any,docs_anexos_politica:any) :Observable<any>{
    console.log(docs_anexos_politica);
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"politica_concepto":politica_concepto,"tipo_politica":politica_tipo});
    console.log(json);

    const formData = new FormData();
    for (var i = 0; i < docs_anexos_politica.length; i++) {formData.append("docs_anexos_politica[]", docs_anexos_politica[i]);}
    formData.append('solicitud',json);
    console.log(formData);
    return this._httpClient.post(this.url+'contabilidad_politica_nuevo_registro',formData).pipe(catchError(this.handlerError));
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
