import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfClasificacion } from '../../interfaces/interf-clasificacion';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class OrdenesDevengacionService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listaDevengacionOrden(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    let data = { "periodo": filtro, "periodo_inicio": periodo_inicio, "periodo_fin": periodo_fin };
    return this._httpClient.post(this.url + 'contabilidad_lista_ordenes_devengacion', data)
      .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  detalleDevengacion(orden_devengacion: any): Observable<any> {
    console.log(orden_devengacion)
    let data = {"orden_devengacion": orden_devengacion};
    return this._httpClient.post(this.url + 'contabilidad_orden_devengacion_detalle', data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  listaComprasDevengacionServ(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_lista_ServSinDevengar', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  establecePeriodoEspera(token_compras: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compras });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_trueperiodoespera24hrs', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  guardarDevengacionServicio(token_compras: any, arrayProductos: any, docsDevengacionAnexos: any, docsDevengacionNames: any): Observable<any> {
    console.log(docsDevengacionAnexos);
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compras, "productList": arrayProductos, "docsDevengacionNames": docsDevengacionNames });
    console.log(json);

    const formData = new FormData();
    for (var i = 0; i < docsDevengacionAnexos.length; i++) {
      formData.append("docsDevengacionAnexos[]", docsDevengacionAnexos[i]);
    }
    formData.append('json', json);
    console.log(formData);
    return this._httpClient.post(this.url + 'egresos_compras_devengaserviciocompras', formData).pipe(
      catchError(this.handlerError)
    );
  }

  guardarDevengacionActIntang(token_compras: any, arrayActIntang: any, imagenEvidenciaXMl: File, imagenEvidenciaPdf: File): Observable<any> {
    const formdataCompra = new FormData();
    if (imagenEvidenciaXMl) {
      formdataCompra.append('imagenEvidenciaXMl', imagenEvidenciaXMl, imagenEvidenciaXMl.name);
    } else {
      formdataCompra.append('imagenEvidenciaXMl', '');
    }
    if (imagenEvidenciaPdf) {
      formdataCompra.append('imagenEvidenciaPdf', imagenEvidenciaPdf, imagenEvidenciaPdf.name);
    } else {
      formdataCompra.append('imagenEvidenciaPdf', '');
    }

    formdataCompra.append('dataCompra', JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compras, "arrayActIntang": arrayActIntang }));

    return this._httpClient.post(this.url + 'egresos_compras_recibeactintangbuy', formdataCompra).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  guardarDevengacionServicios(token_compras: any, arrayServicios: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compras, "arrayServicios": arrayServicios });

    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_recibeserviciosbuy', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  handlerError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}