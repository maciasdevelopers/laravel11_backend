import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, shareReplay, tap} from 'rxjs/operators';
import { global } from './global_ssic';
import { __setFunctionName } from 'tslib';
import { ServEncryptService } from './ssic/serv-encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class DeudoresService {
  public url: string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient,private encryptor:ServEncryptService) {
    this.url = global.urlApi;
  }

  deudoresNombresRelacionados():Observable<any>{
    const link = this.url + 'finanzas_catalogos_deudores_nombres_relacionados';
    const cacheKlave = link;
    this.cache.delete(link);
    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this._httpClient.post(link,null).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  catalogoDeudoresGeneral(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    const link = this.url + 'finanzas_catalogos_deudores_lista_general';
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    const cacheKlave = link+'|'+data;
    this.cache.delete(link + '|' + data);

    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this._httpClient.post(link,data).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  catalogoDeudoresMX(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    const link = this.url + 'finanzas_catalogos_deudores_mx';
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    const cacheKlave = link+'|'+data;
    this.cache.delete(link + '|' + data);
    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this._httpClient.post(link,data).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  catalogoDeudoresExtranjeros(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    const link = this.url + 'finanzas_catalogos_deudores_extranjeros';
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    const cacheKlave = link+'|'+data;
    this.cache.delete(link + '|' + data);
    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this._httpClient.post(link,data).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  verDetalleDeudorGenerales(token_cat_deudores:any):Observable<any>{
    let data = {"token_cat_deudores":token_cat_deudores};
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_detalle_generales',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  verDetalleDeudorPagos(token_cat_deudores:any):Observable<any>{
    let data = {"token_cat_deudores":token_cat_deudores};
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_detalle_pagos',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaDeudor(token_cat_deudores:any,deudor_data:any):Observable<any>{
    const nombre = deudor_data.nombre;
    const correo_electronico = deudor_data.correo_electronico;
    let data = {
      "token_cat_deudores":token_cat_deudores,
      "tipo":deudor_data.tipoDeudor,
      "subtipo":deudor_data.subtipoDeudor,
      "rfc":deudor_data.rfc,
      "taxID":deudor_data.taxID,
      "nombre":nombre,
      "nombre_comercial":deudor_data.nombre_comercial,
      "email_encrypt":correo_electronico ? this.encryptor.santoEncryptCode(correo_electronico) : '',
      "cuenta_contable":deudor_data.cuenta_contable,
      "habilita_deudor_reembolsos":deudor_data.habilita_reembolsos,
      "regimen_fiscal":deudor_data.regimen_fiscal,
      "trabajador_vinculado":deudor_data.trabajador_vinculado,
      "proveedor_vinculado":deudor_data.proveedor_vinculado,
      "acreedor_vinculado":deudor_data.acreedor_vinculado,
    };
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_actualiza',data)
    .pipe(catchError(this.handlerError));
  }

  deudoresEliminados():Observable<any>{
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_eliminados',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  moverAPapeleraDeudor(token_cat_deudores:any):Observable<any>{
    let data = {"token_cat_deudores":token_cat_deudores};
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_elimina_papelera',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  restaurarDeudor(token_cat_deudores:any):Observable<any>{
    let data = {"token_cat_deudores":token_cat_deudores};
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_restaurar',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  eliminarDeudor(token_cat_deudores:any):Observable<any>{
    let data = {"token_cat_deudores":token_cat_deudores};
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_elimina_permanente',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  registraDeudor(deudor_data:any,access_code:any,password_code:any):Observable<any>{
    const nombre = deudor_data.nombre;
    const correo_electronico = deudor_data.correo_electronico;
    let data = {
      "tipo":deudor_data.tipoDeudor,
      "subtipo":deudor_data.subtipoDeudor,
      "rfc":deudor_data.rfc,
      "taxID":deudor_data.taxID,
      "nombre":nombre,
      "nombre_comercial":deudor_data.nombre_comercial,
      "trabajador_vinculado":deudor_data.trabajador_vinculado,
      "proveedor_vinculado":deudor_data.proveedor_vinculado,
      "acreedor_vinculado":deudor_data.acreedor_vinculado,
      "email":correo_electronico ? this.encryptor.santoEncryptCode(correo_electronico) : '',
      "email_encrypt":correo_electronico ? this.encryptor.santoEncryptCode(correo_electronico) : '',
      "access_code":access_code,
      "password_code":password_code,
      "habilita_reembolsos":deudor_data.habilita_reembolsos,
      "cuenta_contable":deudor_data.cuenta_contable,
      "regimen_fiscal":deudor_data.regimen_fiscal,
    };
    return this._httpClient.post(this.url+'finanzas_catalogos_deudores_registra',data)
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
