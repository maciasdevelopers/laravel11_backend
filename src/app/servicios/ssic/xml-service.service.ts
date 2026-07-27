import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { global } from '../global_ssic';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class XmlServiceService {
  public url: string;
  public user:any;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
    this.user = sessionStorage.getItem('inside_session_code');
  }
  
  cargarxmlmasivos(xmlArreglo:any):Observable<any>{ //no existe
    const formData = new FormData();
    for (var i = 0; i < xmlArreglo.length; i++) { 
      formData.append("imgEvidencias[]", xmlArreglo[i]);
    }
    console.log(this.user);
    if (this.user == "" || this.user == null) {
      formData.append('json',JSON.stringify({"user_token":"xxxx"}));
    } else {
      formData.append('json',JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')}));
    }
    console.log(formData);
    return this._httpClient.post(this.url+'guardarfacturasxml',formData).pipe(
      catchError(this.handlerError)
    );
  }

  descargarxmlmasivos(param:any,busqueda:any):Observable<any>{ // no existe 
    var token_usuario = "";
    if (this.user != "") {
      token_usuario = this.user;
    }

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":token_usuario,"param":param,"busqueda":busqueda});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'consultafacturasxml',parametros, {headers: headers})
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