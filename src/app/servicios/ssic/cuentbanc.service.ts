import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { cuentasModelo } from '../../modelos/cuentasModelo';
import { ServEncryptService } from './serv-encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class CuentbancService {
  public url:string;
  //private cache$?: Observable<any>;
  private cache$?: Observable<any> | null = null;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient,public encryptor:ServEncryptService) {
    this.url = global.urlApi;
  }

  getresponsableCuentaCompras():Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_responsablecuenta',null)
    .pipe(catchError(this.handlerError))
  }

  getresponsableCuentaVentas():Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_responsablecaja',null)
    .pipe(catchError(this.handlerError))
  }

  catCuentasBancariasMain(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'finanzas_catalogos_cuentasvig',data)
    .pipe(catchError(this.handlerError));
  }

  catCuentasBancariasCompras(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    if (!this.cache$) {
      this.cache$ = this.httpcliente.post(this.url + 'finanzas_catalogos_cuentasvig',data).pipe(
        shareReplay(1), // 🔑 cachea el resultado para todos
        catchError(this.handlerError)
      );
    }
    return this.cache$;
  }

  folioCuentaBancaria(): Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_foliocuentabanc',null).pipe(
      catchError(this.handlerError)
    );
  }

  registroCuentBanc(cuentasBanc:cuentasModelo):Observable<any>{
    let data = {
      "token_banco":cuentasBanc.token_banco,
      "clave_banco":cuentasBanc.clave_banco,
      "contrato":cuentasBanc.contrato,
      "cuenta":cuentasBanc.cuenta,
      "clabe_inter":cuentasBanc.clabe_inter,
      "titularCuenta":cuentasBanc.titularCuenta,
      "sucursal":cuentasBanc.sucursal,
      "moneda_code":cuentasBanc.moneda_code,
      "moneda_decimales":cuentasBanc.moneda_decimales,
      "cuenta_contable":cuentasBanc.cuenta_contable,
      "areaEgresos":cuentasBanc.areaEgresos,
      "areaIngresos":cuentasBanc.areaIngresos,
      "areaValHumano":cuentasBanc.areaValHumano,
    };
    return this.httpcliente.post(this.url+'finanzas_catalogos_registracuentabancaria',data).pipe(
      catchError(this.handlerError)
    );
  }

  verCuentaBancariaCompleta(cuentaBanc:any):Observable<any>{
    let data = {"token_cuenta":cuentaBanc};
    return this.httpcliente.post(this.url+'finanzas_catalogos_ver_cuenta_bancaria_completa',data).pipe(
      catchError(this.handlerError)
    );
  }

  verCuentaBancaria4Digitos(cuentaBanc:any):Observable<any>{
    let data = {"token_cuenta":cuentaBanc};
    return this.httpcliente.post(this.url+'finanzas_catalogos_ver_cuenta_bancaria_4_digitos',data)
    .pipe(catchError(this.handlerError));
  }

  detalleCuentaBancaria(cuentaBanc:any):Observable<any>{
    let data = {"token_cuenta":cuentaBanc};
    return this.httpcliente.post(this.url+'finanzas_catalogos_detallecuentavig',data)
    .pipe(catchError(this.handlerError));
  }

  updateCuentBanc(
    token_cuenta:any,
    token_banco:any,
    contrato:any,
    cuenta:any,
    clabe_inter:any,
    sucursal:any,
    titularCuenta:any,
    moneda_code:any,
    cuenta_contable:any,
    areaEgresos:any,
    areaIngresos:any,
    areaValHumano:any,
    eliminacion_proceso:any,
    medios_operacion:any):Observable<any>{
    let data = {
      "token_cuenta":token_cuenta,
      "token_banco":token_banco,
      "contrato":contrato,
      "cuenta":cuenta,
      "clabe_inter":clabe_inter,
      "sucursal":sucursal,
      "titularCuenta":titularCuenta,
      "moneda_code":moneda_code,
      "cuenta_contable":cuenta_contable,
      "areaEgresos":areaEgresos,
      "areaIngresos":areaIngresos,
      "areaValHumano":areaValHumano,
      "eliminacion_proceso":eliminacion_proceso,
      "medios_operacion":medios_operacion
    };
    return this.httpcliente.post(this.url+'finanzas_catalogos_updatecuentbncaria',data)
    .pipe(catchError(this.handlerError));
  }

  cuentasDelete():Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_cuentasdel',null)
    .pipe(catchError(this.handlerError));
  }

  deleteCuentaBancaria(tokenCuenta:any): Observable<any>{
    let data = {"token_cuenta":tokenCuenta};
    return this.httpcliente.post(this.url+'finanzas_catalogos_eliminacuentaban',data)
    .pipe(catchError(this.handlerError));
  }

  restauraCuentaBancaria(tokenCuenta:any): Observable<any>{
    let data = {"token_cuenta":tokenCuenta};
    return this.httpcliente.post(this.url+'finanzas_catalogos_restauracuentaban',data)
    .pipe(catchError(this.handlerError));
  }

  eliminaPermCuentaBancaria(tokenCuenta:any): Observable<any>{
    let data = {"token_cuenta":tokenCuenta};
    return this.httpcliente.post(this.url+'finanzas_catalogos_deltepermcuentaban',data)
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
