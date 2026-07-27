import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { loteAngularModelo } from '../../modelos/loteAngularModelo';
import { loteDetailAngularModelo } from '../../modelos/loteDetailAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  registroSeries(serie_code:any,uso_unico:any,comentarios:any):Observable<any>{
    let data = {"serie_code":serie_code,"uso_unico":uso_unico,"comentarios":comentarios};
    return this._httpClient.post(this.url+'inventarios_catalogos_series_registro',data)
    .pipe(catchError(this.handlerError))
  }

  listaSeriesvigentes():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_series_catalogo',null)
    .pipe(catchError(this.handlerError))
  }

  infoSerieDetail(serie_token:any):Observable<any>{
    let data = {"serie_token":serie_token};
    return this._httpClient.post(this.url+'inventarios_catalogos_series_detalle',data)
    .pipe(catchError(this.handlerError))
  }

  eliminaSeriePapelera(serie_token:any):Observable<any>{
    let data = {"serie_token":serie_token};
    return this._httpClient.post(this.url+'inventarios_catalogos_series_eliminapap',data)
    .pipe(catchError(this.handlerError))
  }

  listaSeriesDeleted():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_series_eliminadas',null)
    .pipe(catchError(this.handlerError))
  }

  serieRestaurar(serie_token:any):Observable<any>{
    let data = {"serie_token":serie_token};
    return this._httpClient.post(this.url+'inventarios_catalogos_series_restaurar',data)
    .pipe(catchError(this.handlerError))
  }

  serieDeletePerm(serie_token:any):Observable<any>{
    let data = {"serie_token":serie_token};
    return this._httpClient.post(this.url+'inventarios_catalogos_series_borrar',data)
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
