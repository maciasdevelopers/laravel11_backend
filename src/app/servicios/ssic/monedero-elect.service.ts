import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { monderoElectAngularModelo } from '../../modelos/monderoElectAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class MonederoElectService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  listaMonederosElectronicos():Observable<any>{
    return this.httpcliente.get(this.url+'catalogomonelect').pipe(catchError(this.handlerError));
  }

  catalogoMonederosElect(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'finanzas_catalogos_verlistamonedero',data).pipe(
      catchError(this.handlerError)
    );
  }

  folioMonederoElectronico(): Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_foliomonelectronico',null)
    .pipe(catchError(this.handlerError));
  }

  getresponsableCuentaMonedCompras():Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_responsablemonedero',null)
    .pipe(catchError(this.handlerError))
  }

  getresponsableCuentaMonedVentas():Observable<any>{ // dudosa,posible modificacion 
    return this.httpcliente.post(this.url+'finanzas_catalogos_responsablemonedero',null)
    .pipe(catchError(this.handlerError))
  }

  detalleMonederoElectronico(MonederoElect:any):Observable<any>{
    let data = {"token_monedero":MonederoElect};
    return this.httpcliente.post(this.url+'finanzas_catalogos_detallemonedero',data)
    .pipe(catchError(this.handlerError));
  }

  updateMonederoElectronico(token_cuentaMon:any,
    plataforma_electronica:any,
    no_referencia:any,
    cuenta:any,
    clabe_inter:any,
    titularCuenta:any,
    cuenta_contable:any,
    moneda:any,
    areaEgresos:any,
    areaIngresos:any,
    areaValHumano:any,
    listMediosOperacionNew:any,
    mediosOperacionDelete:any,
    token_responsable:any,
    token_cuentaBanc:any,
    token_caja:any
  ):Observable<any>{
    let data = {
      "token_cuentaMon":token_cuentaMon,
      "plataforma_electronica":plataforma_electronica,
      "no_referencia":no_referencia,
      "cuenta":cuenta,
      "clabe_inter":clabe_inter,
      "titularCuenta":titularCuenta,
      "cuenta_contable":cuenta_contable,
      "moneda":moneda,
      "egresos":areaEgresos,
      "ingresos":areaIngresos,
      "v_Humano":areaValHumano,
      "mediosOperacionNuevos":listMediosOperacionNew,
      "mediosOperacionDelete":mediosOperacionDelete,
      "token_responsable":token_responsable,
      "token_cuenta_bancaria":token_cuentaBanc,
      "caja":token_caja
    };
    return this.httpcliente.post(this.url+'finanzas_catalogos_actualizamonederoelectronico',data).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoMonederosElectDelete():Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_verlistamonederodel',null)
    .pipe(catchError(this.handlerError));
  }

  deleteMonedero(tokenMonedero:any): Observable<any>{
    let data = {"token_monedero":tokenMonedero};
    return this.httpcliente.post(this.url+'finanzas_catalogos_eliminamonelectronico',data)
    .pipe(catchError(this.handlerError));
  }

  restauraMonedero(tokenMonedero:any): Observable<any>{
    let data = {"token_monedero":tokenMonedero};
    return this.httpcliente.post(this.url+'finanzas_catalogos_restauramonelectronico',data).pipe(
      catchError(this.handlerError)
    );
  }

  deletePermMonedero(tokenMonedero:any): Observable<any>{
    let data = {"token_monedero":tokenMonedero};
    return this.httpcliente.post(this.url+'finanzas_catalogos_deletPermmonederoelctrnico',data).pipe(
      catchError(this.handlerError)
    );
  }

  registraMonderoElectronico(monedero:monderoElectAngularModelo):Observable<any>{
    let data = {
      "plataforma_electronica":monedero.plataforma_electronica,
      "no_referencia":monedero.no_referencia,
      "cuenta":monedero.cuenta,
      "clabe_inter":monedero.clabe_inter,
      "titularCuenta":monedero.titularCuenta,
      "cuenta_contable":monedero.cuenta_contable,
      "moneda":monedero.moneda,
      "egresos":monedero.areaEgresos,
      "ingresos":monedero.areaIngresos,
      "v_Humano":monedero.areaValHumano,
      "mediosOperacion":monedero.opciones_adicionales,
      "token_responsable":monedero.token_responsable,
      "token_cuenta_bancaria":monedero.token_cuentaBanc,
      "caja":monedero.token_caja
    };
    return this.httpcliente.post(this.url+'finanzas_catalogos_registramonederoelctrnico',data).pipe(
      catchError(this.handlerError)
    );
  }

  registraManejoCuestas(token_cuentaMon:any,arrayManejo:any):Observable<any>{ //no existe
    let data = {"token_cuentaMon":token_cuentaMon,"arrayManejo":arrayManejo};
    return this.httpcliente.post(this.url+'registranewcuentamanejo',data)
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
