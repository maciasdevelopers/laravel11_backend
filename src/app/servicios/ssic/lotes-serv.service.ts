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
export class LotesServService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listaLotesvigentes():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_listalotesvigentes',null)
    .pipe(catchError(this.handlerError))
  }

  loteseliminacion(token_lote:any):Observable<any>{
    let data = {"token_lote":token_lote};
    return this._httpClient.post(this.url+'inventarios_catalogos_listalotesdelete',data)
    .pipe(catchError(this.handlerError))
  }

  listaLotesDetalle(token_lote:any):Observable<any>{
    let data = {"token_lote":token_lote};
    return this._httpClient.post(this.url+'inventarios_catalogos_detalleegresoslote',data)
    .pipe(catchError(this.handlerError))
  }

  updateLotes(imagenAltaPdfevidencialote:any,modelLote:loteDetailAngularModelo):Observable<any>{
    const formData = new FormData();
    formData.append('token_lote',modelLote.token_lote);
    formData.append('fechaLote',modelLote.fechaLote);
    formData.append('numeroLote',modelLote.numeroLote);
    formData.append('comentarios',modelLote.comentarios);
    //ormData.append('nameEvidencia',modelLote.nameEvidencia);
    if (imagenAltaPdfevidencialote != undefined) {
      formData.append('imagenAltaPdfevidencialote', imagenAltaPdfevidencialote, imagenAltaPdfevidencialote.name);
    }
    console.log(formData);
    return this._httpClient.post(this.url+'inventarios_catalogos_actualizaegresoslote',formData)
    .pipe(catchError(this.handlerError));
  }

  listaLotesdeleted():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_listadeletedlotes',null)
    .pipe(catchError(this.handlerError))
  }

  lotesrestauracion(token_lote:any):Observable<any>{
    let data = {"token_lote":token_lote};
    return this._httpClient.post(this.url+'inventarios_catalogos_restartlote',data)
    .pipe(catchError(this.handlerError))
  }

  loteseliminacionperm(token_lote:any):Observable<any>{
    let data = {"token_lote":token_lote};
    return this._httpClient.post(this.url+'inventarios_catalogos_deleteloteperm',data)
    .pipe(catchError(this.handlerError))
  }

  registroLotes(imagenAltaPdfevidencialote:File,modelLote:loteAngularModelo):Observable<any>{
    const formData = new FormData();
    formData.append('fechaLote',modelLote.fechaLote);
    formData.append('numeroLote',modelLote.numeroLote);
    formData.append('comentarios',modelLote.comentarios);
    formData.append('nameEvidencia',modelLote.nameEvidencia);
    if (imagenAltaPdfevidencialote) {
      formData.append('imagenAltaPdfevidencialote', imagenAltaPdfevidencialote, imagenAltaPdfevidencialote.name);
    }
    console.log(formData);
    return this._httpClient.post(this.url+'inventarios_catalogos_registraLote',formData)
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
