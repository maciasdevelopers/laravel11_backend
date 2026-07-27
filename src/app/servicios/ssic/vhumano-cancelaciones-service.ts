import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class VhumanoCancelacionesService {
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

  listando_soli_cancelacion_vhum(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    const link = this.url + 'vhumano_cancelaciones_lista_general';
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

  //nomina en efectivo
  solicitud_cancelacion_nomina_efectivo(token_cancel_nomina_efectivo:any,token_nomina_efectivo:any):Observable<any>{
    let data = {"token_cancel_nomina_efectivo":token_cancel_nomina_efectivo,"token_nomina_efectivo":token_nomina_efectivo};
    console.log(data);
    return this.httpClient.post(this.url+'vhumano_cancelaciones_solicitud_cancelacion_nomina_efectivo',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_nomina_efectivo(token_cancel_nomina_efectivo:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_nomina_efectivo":token_cancel_nomina_efectivo,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_nomina_efectivo":token_cancel_nomina_efectivo,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'egresos_cancelaciones_confirmar_cancelacion_nomina_efectivo',data).pipe(
      catchError(this.handlerError)
    );
  }

  //nomina en especie
  solicitud_cancelacion_nomina_especie(token_cancel_nomina_especie:any,token_nomina_efectivo:any):Observable<any>{
    let data = {"token_cancel_nomina_especie":token_cancel_nomina_especie,"token_nomina_efectivo":token_nomina_efectivo};
    console.log(data);
    return this.httpClient.post(this.url+'vhumano_cancelaciones_solicitud_cancelacion_nomina_especie',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_nomina_especie(token_cancel_nomina_especie:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_nomina_especie":token_cancel_nomina_especie,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_nomina_especie":token_cancel_nomina_especie,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'egresos_cancelaciones_confirmar_cancelacion_nomina_especie',data).pipe(
      catchError(this.handlerError)
    );
  }

  //asimilados
  solicitud_cancelacion_asimilados(token_cancel_asimilados:any,token_asimilados:any):Observable<any>{
    let data = {"token_cancel_asimilados":token_cancel_asimilados,"token_asimilados":token_asimilados};
    console.log(data);
    return this.httpClient.post(this.url+'vhumano_cancelaciones_solicitud_cancelacion_asimilados',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_asimilados(token_cancel_asimilados:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_asimilados":token_cancel_asimilados,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_asimilados":token_cancel_asimilados,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'egresos_cancelaciones_confirmar_cancelacion_asimilados',data).pipe(
      catchError(this.handlerError)
    );
  }

  //impuestos sobre nómina
  solicitud_cancelacion_isn(token_cancel_isn:any,token_isn:any):Observable<any>{
    let data = {"token_cancel_isn":token_cancel_isn,"token_isn":token_isn};
    console.log(data);
    return this.httpClient.post(this.url+'vhumano_cancelaciones_solicitud_cancelacion_isn',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_isn(token_cancel_isn:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_isn":token_cancel_isn,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_isn":token_cancel_isn,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'egresos_cancelaciones_confirmar_cancelacion_isn',data).pipe(
      catchError(this.handlerError)
    );
  }

  //impuestos sobre nómina
  solicitud_cancelacion_imss(token_cancel_imss:any,token_imss:any):Observable<any>{
    let data = {"token_cancel_imss":token_cancel_imss,"token_imss":token_imss};
    console.log(data);
    return this.httpClient.post(this.url+'vhumano_cancelaciones_solicitud_cancelacion_imss',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_imss(token_cancel_imss:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_imss":token_cancel_imss,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_imss":token_cancel_imss,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'egresos_cancelaciones_confirmar_cancelacion_imss',data).pipe(
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
