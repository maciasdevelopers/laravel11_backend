import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from './global_ssic';

@Injectable({
  providedIn: 'root'
})
export class RegimenFiscalService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }
  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

//apis
  getApiRegimenFiscalAll():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaRegimenFiscal',{headers: headers})
    .pipe(catchError(this.handlerError))
  }
  
  getApiRegimenFiscalPF():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaRegimenFiscalPF',{headers: headers})
    .pipe(catchError(this.handlerError))
  }
  
  getApiRegimenFiscalPM():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaRegimenFiscalPM',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getAllRegimenFiscal():Observable<any>{
    return this._httpClient.get(this.url+'getallregimenfiscal')
    .pipe(catchError(this.handlerError))
  }

  getPfRegimenFiscal():Observable<any>{
    return this._httpClient.get(this.url+'getpfregimenfiscal')
    .pipe(catchError(this.handlerError))
  }

  getPmRegimenFiscal():Observable<any>{
    return this._httpClient.get(this.url+'getpmregimenfiscal')
    .pipe(catchError(this.handlerError))
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
