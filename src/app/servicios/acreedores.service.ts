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
export class AcreedoresService {
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

  acreedoresNombresRelacionados():Observable<any>{
    const link = this.url + 'finanzas_catalogos_acreedores_nombres_relacionados';
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

  catalogoAcreedoresGeneral(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    const link = this.url + 'finanzas_catalogos_acreedores_lista_general';
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
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

  catalogoAcreedoresMX(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    const link = this.url + 'finanzas_catalogos_acreedores_mx';
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

  catalogoAcreedoresExtranjeros(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    const link = this.url + 'finanzas_catalogos_acreedores_extranjeros';
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

  verDetalleAcreedorGenerales(token_cat_acreedores:any):Observable<any>{
    let data = {"token_cat_acreedores":token_cat_acreedores};
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_detalle_generales',data).pipe(
      catchError(this.handlerError)
    );
  }

  verDetalleAcreedorPagos(token_cat_acreedores:any):Observable<any>{
    let data = {"token_cat_acreedores":token_cat_acreedores};
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_detalle_pagos',data).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaAcreedor(token_cat_acreedores:any,acreedor_data:any):Observable<any>{
    const nombre = acreedor_data.nombre;
    const correo_electronico = acreedor_data.correo_electronico;

    let data = {
      "token_cat_acreedores":token_cat_acreedores,
      "tipo":acreedor_data.tipoAcree,
      "subtipo":acreedor_data.subtipoAcree,
      "rfc":acreedor_data.rfc,
      "taxID":acreedor_data.taxID,
      "nombre":nombre,
      "nombre_comercial":acreedor_data.nombre_comercial,
      "email_encrypt":correo_electronico ? this.encryptor.santoEncryptCode(correo_electronico) : '',
      "cuenta_contable":acreedor_data.cuenta_contable,
      "habilita_reembolsos":acreedor_data.habilita_reembolsos,
      "regimen_fiscal":acreedor_data.regimen_fiscal,
      "trabajador_vinculado":acreedor_data.trabajador_vinculado,
      "proveedor_vinculado":acreedor_data.proveedor_vinculado,
      "deudor_vinculado":acreedor_data.deudor_vinculado
    };
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_actualiza',data).pipe(
      catchError(this.handlerError)
    );
  }

  moverAPapeleraAcree(token_cat_acreedores:any):Observable<any>{
    let data = {"token_cat_acreedores":token_cat_acreedores};
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_elimina_papelera',data).pipe(
      catchError(this.handlerError)
    );
  }

  acredoresEliminados():Observable<any>{
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_eliminados',null).pipe(
      catchError(this.handlerError)
    ); 
  }

  restaurarAcreedor(token_cat_acreedores:any):Observable<any>{
    let data = {"token_cat_acreedores":token_cat_acreedores};
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_restaurar',data).pipe(
      catchError(this.handlerError)
    );
  }

  eliminarAcreedor(token_cat_acreedores:any):Observable<any>{
    let data = {"token_cat_acreedores":token_cat_acreedores};
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_elimina_permanente',data).pipe(
      catchError(this.handlerError)
    );
  }

  registraAcreedor(acreedor_data:any,access_code:any,password_code:any):Observable<any>{
    const nombre = acreedor_data.nombre;
    const correo_electronico = acreedor_data.correo_electronico;
    let data = {
      "tipo":acreedor_data.tipoAcree,
      "subtipo":acreedor_data.subtipoAcree,
      "rfc":acreedor_data.rfc,
      "taxID":acreedor_data.taxID,
      "nombre":nombre,
      "nombre_comercial":acreedor_data.nombre_comercial,
      "trabajador_vinculado":acreedor_data.trabajador_vinculado,
      "proveedor_vinculado":acreedor_data.proveedor_vinculado,
      "deudor_vinculado":acreedor_data.deudor_vinculado,
      "email":correo_electronico ? this.encryptor.santoEncryptCode(correo_electronico) : '',
      "email_encrypt":correo_electronico ? this.encryptor.santoEncryptCode(correo_electronico) : '',
      "access_code":access_code,
      "password_code":password_code,
      "habilita_reembolsos":acreedor_data.habilita_reembolsos,
      "cuenta_contable":acreedor_data.cuenta_contable,
      "regimen_fiscal":acreedor_data.regimen_fiscal
    };
    return this._httpClient.post(this.url+'finanzas_catalogos_acreedores_registra',data).pipe(
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
