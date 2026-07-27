import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfPais } from '../../interfaces/interf-pais';
import { global } from '../global_ssic'; 

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  getListaPais():Observable<InterfPais[]>{
    return this._httpClient.get<InterfPais[]>(this.url+'listaPaises')
    .pipe(catchError(this.handlerError));
  }

  getApiPaisCatalogo():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaPaises',{headers: headers})
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
