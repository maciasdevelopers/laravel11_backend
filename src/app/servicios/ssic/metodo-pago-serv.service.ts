import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfMetodoPago } from '../../interfaces/interf-metodo-pago'; 
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoServService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) { 
    this.url = global.urlApi;
  }

  getApiMetodoPago():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaMetodosDePago',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getMetodo():Observable<InterfMetodoPago[]>{
    return this._httpClient.get<InterfMetodoPago[]>(this.url+'getmetodopago').pipe(
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
