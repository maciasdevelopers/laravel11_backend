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
export class OrdenesRecepcionService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listaComprasRecepcionOrden(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    let data = { "periodo": filtro, "periodo_inicio": periodo_inicio, "periodo_fin": periodo_fin };
    return this._httpClient.post(this.url + 'egresos_compras_lista_ordenes_recepcion', data)
      .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  detalleOrdenRecepcion(orden_recepcion: any): Observable<any> {
    console.log(orden_recepcion)
    let data = {"orden_recepcion": orden_recepcion};
    return this._httpClient.post(this.url + 'egresos_compras_detallecompras_recep', data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  listaComprasRecepcionProds(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_lista_ProdSinRecibir', parametros, { headers: headers }).pipe(
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

  guardarRecepcionProductos(uuid_orden_recepcion:any,token_compras:any,arrayProductos:any): Observable<any> {
    let data = {"uuid_orden_recepcion": uuid_orden_recepcion, "token_compras": token_compras, "productList": arrayProductos};
    return this._httpClient.post(this.url + 'egresos_compras_recibeprodutocompras', data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  guardarRecepcionProds(token_compras: any, arrayProductos: any, imagenEvidenciaXMl: File, imagenEvidenciaPdf: File): Observable<any> {
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

    formdataCompra.append('dataCompra', JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compras, "productList": arrayProductos }));

    return this._httpClient.post(this.url + 'egresos_compras_recibeproductos', formdataCompra).pipe(
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