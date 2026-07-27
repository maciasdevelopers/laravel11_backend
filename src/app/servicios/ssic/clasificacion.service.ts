import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { InterfClasificacion } from '../../interfaces/interf-clasificacion';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {
  public url: string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  getClassifProd():Observable<any>{
    return this._httpClient.get(this.url+'getClasificacionProductos')
    .pipe(catchError(this.handlerError));
  }

  saveClassifProd(clasificacion:any,subclasificacion:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "clasificacion":clasificacion,
      "subclasificacion":subclasificacion
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'newClasificacionProductosComplete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }


  getClassifProdCompleta(): Observable<any>{
    const link = this.url + 'getClasificacionProductosComplete';
    const token = sessionStorage.getItem('inside_session_code');
    const body = 'json=' + JSON.stringify({ user_token: token });
    const cacheKlave = link+'|'+token;

    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    const peticion$ = this._httpClient.post(link,body, {headers}).pipe(shareReplay(1),catchError(this.handlerError));
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  getGeneroProd(clasificacion:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"clasificacion":clasificacion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'getGeneroProductos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  getGeneroValidadoProd(clasificacion:any,token_genero:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"clasificacion":clasificacion,"token_genero":token_genero});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'getGeneroValidadoProductos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  getClasificacionCompleta(clasificacion:string, genero:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"clasificacion":clasificacion,"genero":genero});
    console.log("getClasificacionCompleta "+json)
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'getClasificacionFull',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  getClasificacionCompletaServ(clasificacion:string, genero:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"clasificacion":clasificacion,"genero":genero});
    console.log(json)
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'clasificacompletserv',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  getGeneroClassifServ():Observable<any>{
    const ulr = this.url+'getClasificacionServicios';

    if (this.cache.has(ulr)) {
      return this.cache.get(ulr)!;
    }

    const peticion$ = this._httpClient.get(ulr).pipe(shareReplay(1),catchError(this.handlerError))
    this.cache.set(ulr,peticion$);
    return peticion$;
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
