import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class EgresosCancelacionesService {
  public url: string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listando_soli_cancelacion_eegr(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    const link = this.url + 'egresos_cancelaciones_lista_general';
    const cacheKlave = link+'|'+data;
    this.cache.delete(link + '|' + data);

    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this.httpClient.post(link,data).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  solicitud_cancelacion_compra(token_cancel_compra:any,token_compras:any):Observable<any>{
    let data = {"token_cancel_compra":token_cancel_compra,"token_compras":token_compras};
    console.log(data);
    return this.httpClient.post(this.url+'egresos_cancelaciones_solicitud_cancelacion_compra',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_compra(token_cancel_compra:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_compra":token_cancel_compra,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_compra":token_cancel_compra,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'egresos_cancelaciones_confirmar_cancelacion_compra',data).pipe(
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
