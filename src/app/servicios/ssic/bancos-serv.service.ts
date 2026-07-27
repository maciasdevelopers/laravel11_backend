import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfBancos } from '../../interfaces/interf-bancos';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class BancosServService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }
  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  getApiListaBancos():Observable<any>{
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaBancos')
    .pipe(catchError(this.handlerError))
  }

  getListaBancos():Observable<any>{
    return this._httpClient.get(this.url+'listabancos')
    .pipe(catchError(this.handlerError))
  }

  listaBancosClave(clave:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"clave":clave});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'bancosclave',parametros, {headers: headers}).pipe(
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
