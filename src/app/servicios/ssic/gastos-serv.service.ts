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
export class GastosService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listagastosvigentes():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'listaegresosgastosvigentes',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  listagastosDetalle(token_pedimento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_pedimento":token_pedimento});
    let params = 'json='+json;
    console.log(json);
    return this._httpClient.post(this.url+'inventarios_catalogos_detalleregresospedimento',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  updateGastosDetalle(imagenAltaPdfevidenciapedim:any,modelPedim:pedimentoDetailAngularModelo):Observable<any>{
    const formData = new FormData();
    console.log(imagenAltaPdfevidenciapedim);
    let sos_tokens:any = sessionStorage.getItem('inside_session_code');
    formData.append('user_token',sos_tokens);
    if (imagenAltaPdfevidenciapedim != undefined) {
      formData.append('imagenAltaPdfevidenciapedim', imagenAltaPdfevidenciapedim, imagenAltaPdfevidenciapedim.name);
    }
    formData.append('arrayPedim',JSON.stringify(modelPedim));
    console.log(formData);
    return this._httpClient.post(this.url+'inventarios_catalogos_actualizaegresospedimento',formData)
    .pipe(catchError(this.handlerError));
  }

  gastoseliminacion(token_pedimento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_pedimento":token_pedimento});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_listaegresospedimentosdelete',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  listagastosdeleted():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'listadeletedegresosgastos',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  gastosrestauracion(token_pedimento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_pedimento":token_pedimento});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_restartpedimento',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  gastoseliminacionperm(token_pedimento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_pedimento":token_pedimento});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_pedimentodeleteperm',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  registrogastos(imagenAltaPdfevidenciapedim:File,modelPedim:pedimentoAngularModelo):Observable<any>{
    const formData = new FormData();
    let sos_tokens:any = sessionStorage.getItem('inside_session_code');
    formData.append('user_token',sos_tokens);
    if (imagenAltaPdfevidenciapedim) {
      formData.append('imagenAltaPdfevidenciapedim', imagenAltaPdfevidenciapedim, imagenAltaPdfevidenciapedim.name);
    }
    formData.append('arrayPedim',JSON.stringify(modelPedim));
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
