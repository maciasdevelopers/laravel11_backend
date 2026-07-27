import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { pedimentoAngularModelo } from '../../modelos/pedimentoAngularModelo';
import { pedimentoDetailAngularModelo } from '../../modelos/pedimentoDetailAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class PedimentosService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listapedimentosvigentes():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_listaegresospedimentosvigentes',null)
    .pipe(catchError(this.handlerError))
  }

  listapedimentosDetalle(token_pedimento:any):Observable<any>{
    let data = {"token_pedimento":token_pedimento};
    return this._httpClient.post(this.url+'inventarios_catalogos_detalleregresospedimento',data)
    .pipe(catchError(this.handlerError))
  }

  updatePedimentosDetalle(imagenAltaPdfevidenciapedim:any,modelPedim:pedimentoDetailAngularModelo):Observable<any>{
    const formData = new FormData();
    console.log(imagenAltaPdfevidenciapedim);
    formData.append('token_pedimento',modelPedim.token_pedimento);
    formData.append('fechaPedim',modelPedim.fechaPedim);
    formData.append('numeroPedim',modelPedim.numeroPedim);
    formData.append('aduana',modelPedim.aduana);
    formData.append('comentarios',modelPedim.comentarios);
    formData.append('nameEvidencia',JSON.stringify(modelPedim.evidencias));
    if (imagenAltaPdfevidenciapedim != undefined) {
      formData.append('imagenAltaPdfevidenciapedim', imagenAltaPdfevidenciapedim, imagenAltaPdfevidenciapedim.name);
    }
    console.log(formData);
    return this._httpClient.post(this.url+'inventarios_catalogos_actualizaegresospedimento',formData)
    .pipe(catchError(this.handlerError));
  }

  pedimentoseliminacion(token_pedimento:any):Observable<any>{
    let data = {"token_pedimento":token_pedimento};
    return this._httpClient.post(this.url+'inventarios_catalogos_listaegresospedimentosdelete',data)
    .pipe(catchError(this.handlerError))
  }

  listapedimentosdeleted():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_listadeletedegresospedimentos',null)
    .pipe(catchError(this.handlerError))
  }

  pedimentosrestauracion(token_pedimento:any):Observable<any>{
    let data = {"token_pedimento":token_pedimento};
    return this._httpClient.post(this.url+'inventarios_catalogos_restartpedimento',data)
    .pipe(catchError(this.handlerError))
  }

  pedimentoseliminacionperm(token_pedimento:any):Observable<any>{
    let data = {"token_pedimento":token_pedimento};
    return this._httpClient.post(this.url+'inventarios_catalogos_pedimentodeleteperm',data)
    .pipe(catchError(this.handlerError))
  }

  registropedimentos(imagenAltaPdfevidenciapedim:File,modelPedim:pedimentoAngularModelo):Observable<any>{
    const formData = new FormData();
    formData.append('fechaPedim',modelPedim.fechaPedim);
    formData.append('numeroPedim',modelPedim.numeroPedim);
    formData.append('aduana',modelPedim.aduana);
    formData.append('comentarios',modelPedim.comentarios);
    formData.append('nameEvidencia',modelPedim.nameEvidencia);
    if (imagenAltaPdfevidenciapedim) {
      formData.append('imagenAltaPdfevidenciapedim', imagenAltaPdfevidenciapedim, imagenAltaPdfevidenciapedim.name);
    }
    console.log(formData);
    return this._httpClient.post(this.url+'inventarios_catalogos_registrapedimento',formData)
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
