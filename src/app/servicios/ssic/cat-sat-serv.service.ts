import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class CatSatServService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) { 
    this.url = global.urlApi;
  }

  catSatProdServLimit(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get(this.url+'catalogo_prodservsat',{headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  catSatProdServClave(clave:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"clave":clave});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_prodservsatClave',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  catSatProdServDescripcion(clave:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"descripcion":clave});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_prodservsatDesc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  catSatClaveInput(clave:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"clave":clave});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_prodservsatInput',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
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

