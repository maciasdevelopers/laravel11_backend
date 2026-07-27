import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfSoluciones } from './interf-soluciones';
import { global } from '../../../servicios/global_ssic';
@Injectable({
  providedIn: 'root'
})
export class ServSolucionesService {
	public url: string;

  	httpOptions = {
  	  	Headers: new HttpHeaders({
			'Content-Type': 'application/json'
  	  	})
  	}

  	constructor(private httpClient: HttpClient) { 
		this.url = global.urlApi;
	}
	
	traeTodosServLanding(): Observable<any>{
		return this.httpClient.get(this.url+'landingSoluciones')
		.pipe(catchError(this.errorHandler))
	}


	errorHandler(error: { error: { message: string; }; status: any; message: any; }){
		let errorMensaje = '';
		if(error.error instanceof ErrorEvent){
			errorMensaje = error.error.message;
		} else {
			errorMensaje = `Error code: ${error.status}\nMessage: ${error.message}`;
		}
		return throwError(errorMensaje);
	}
	

}
