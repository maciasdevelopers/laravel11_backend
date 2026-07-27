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
export class MovimientosFinancierosService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  listMovimFinanCaja(token_caja:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_caja":token_caja,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
    return this.httpcliente.post(this.url+'finanzas_reportes_estado_movimientos_financieros_caja',data).pipe(catchError(this.handlerError));
  }

  listMovimFinanCuentaBancaria(token_cuenta:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_cuenta":token_cuenta,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
    return this.httpcliente.post(this.url+'finanzas_reportes_estado_movimientos_financieros_cuenta',data).pipe(catchError(this.handlerError));
  }

  listMovimFinanMonederoElectronico(token_cuentamonedero:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_cuentamonedero":token_cuentamonedero,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
    return this.httpcliente.post(this.url+'finanzas_reportes_estado_movimientos_financieros_monedero_electronico',data).pipe(catchError(this.handlerError));
  }

  listMovimFinanAcreedor(token_cat_acreedores:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_cat_acreedores":token_cat_acreedores,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
    return this.httpcliente.post(this.url+'finanzas_reportes_estado_movimientos_financieros_acreedor',data).pipe(catchError(this.handlerError));
  }

  listMovimFinanDeudor(token_cat_deudores:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_cat_deudores":token_cat_deudores,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
    return this.httpcliente.post(this.url+'finanzas_reportes_estado_movimientos_financieros_deudor',data).pipe(catchError(this.handlerError));
  }

  listMovimFinanProveedor(token_cat_proveedores:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_cat_proveedores":token_cat_proveedores,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
    return this.httpcliente.post(this.url+'finanzas_reportes_estado_movimientos_financieros_proveedor',data).pipe(catchError(this.handlerError));
  }

  listMovimFinanCliente(token_cat_clientes:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_cat_clientes":token_cat_clientes,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    console.log(data);
    return this.httpcliente.post(this.url+'finanzas_reportes_estado_movimientos_financieros_cliente',data).pipe(catchError(this.handlerError));
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
