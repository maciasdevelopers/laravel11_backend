import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { InterfMonedas } from '../interfaces/interf-monedas';
import { global } from './global_ssic';

@Injectable({
  providedIn: 'root'
})
export class MonedasService {
  public url:string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  }
  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  getApiMonedasCatalogo():Observable<any>{
    const ulr = 'https://insideapis.sos-mexico.com.mx/api/listaMonedas';

    if (this.cache.has(ulr)) {
      return this.cache.get(ulr)!;
    }

    const headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras

    const peticion$ = this._httpClient.get(ulr,{headers}).pipe(shareReplay(1),catchError(this.handlerError))
    this.cache.set(ulr,peticion$);
    return peticion$;
  }

  limpiaMonedasCache(){
    const ulr = 'https://insideapis.sos-mexico.com.mx/api/listaMonedas';
    this.cache.delete(ulr);
  }

  getMonedas():Observable<InterfMonedas[]>{
    return this._httpClient.get<InterfMonedas[]>(this.url+'listaMonedas')
    .pipe(catchError(this.handlerError))
  }

  getMonedasDos():Observable<any>{
    return this._httpClient.get(this.url+'listaMonedas')
    .pipe(catchError(this.handlerError))
  }

  monedaEmpresa():Observable<any>{
    return this._httpClient.post(this.url+'monedaempresa',null)
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
