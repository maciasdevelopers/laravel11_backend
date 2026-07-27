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
export class MovimientosDineroService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  catalogoMovimientosBancCuentasAll():Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_catalogos_catalogo_movimientos_bancarios_cuent',null)
    .pipe(catchError(this.handlerError));
  }

  catalogoMovimientosBancCuenta(token_cuenta:string,periodo_inicio:string,periodo_fin:string):Observable<any>{
    let data = {"token_cuenta":token_cuenta,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'finanzas_catalogos_movimientos_bancarios_cuenta_selected',data)
    .pipe(catchError(this.handlerError));
  }

  registraAjustePreviaAuth(token_cuenta:any,tipo_de_poliza:any,forma_operacion:any,fecha_movimiento:any,saldo_ajuste:any,origen_destino_movimiento:any,token_cliente:any,
    token_proveedor:any,token_empleado:any,cfdi_data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cuenta":token_cuenta,"tipo_de_poliza":tipo_de_poliza,
      "forma_operacion":forma_operacion,"fecha_movimiento":fecha_movimiento,"origen_destino_movimiento":origen_destino_movimiento,"token_cliente":token_cliente,
      "token_proveedor":token_proveedor,"token_empleado":token_empleado,"cfdi_data":cfdi_data,"saldo_ajuste":saldo_ajuste});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'finanzas_catalogos_registra_ajuste_cuenta_sin_auth',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registraAjusteAutorizado(
    token_cuenta:any,
    tipo_de_poliza:any,
    forma_operacion:any,
    fecha_movimiento:any,
    saldo_ajuste:any,
    origen_destino_movimiento:any,
    token_cliente:any,
    token_proveedor:any,
    token_empleado:any,
    cfdi_data:any
  ):Observable<any>{
    let data = {
      "token_cuenta":token_cuenta,
      "tipo_de_poliza":tipo_de_poliza,
      "forma_operacion":forma_operacion,
      "fecha_movimiento":fecha_movimiento,
      "origen_destino_movimiento":origen_destino_movimiento,
      "token_cliente":token_cliente,
      "token_proveedor":token_proveedor,
      "token_empleado":token_empleado,
      "cfdi_data":cfdi_data,
      "saldo_ajuste":saldo_ajuste
    };
    return this.httpcliente.post(this.url+'finanzas_catalogos_registra_ajuste_cuenta_autorizado',data)
    .pipe(catchError(this.handlerError));
  }

  //cuentas propias
  catalogoMovimientoCuentasPropias(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'finanzas_mov_financieros_catalogo_movimiento_cuentas_propias',data)
    .pipe(catchError(this.handlerError));
  }

  catalogoMovimientoCuentasPropiasCancelar(movimiento_cp_token:string,fecha_contabilizacion:string,observaciones:string):Observable<any>{
    let data = {"movimiento_cp_token":movimiento_cp_token,"fecha_contabilizacion":fecha_contabilizacion,"observaciones":observaciones};
    return this.httpcliente.post(this.url+'finanzas_mov_financieros_catalogo_movimiento_cpropias_cancela',data)
    .pipe(catchError(this.handlerError));
  }

  catalogoMovimientosCanceladosCuentasPropias():Observable<any>{
    return this.httpcliente.post(this.url+'finanzas_mov_financieros_catalogo_movimiento_cpropias_cancelados',null)
    .pipe(catchError(this.handlerError));
  }

  registraMovimientoCuentasPropias(
    origen_tipo:any,
    origen_token:any,
    fecha_contabilizacion:any,
    concepto:any,
    destino_tipo:any,
    destino_token:any,
    monto:any,
    moneda_code:any,
    tipo_cambio:any,
    observaciones:any,
    anexosMovimDocs:any
  ):Observable<any>{
    const formdata = new FormData();
    formdata.append('origen_tipo',origen_tipo);
    formdata.append('origen_token',origen_token);
    formdata.append('fecha_contabilizacion',fecha_contabilizacion); 
    formdata.append('concepto',concepto);
    formdata.append('destino_tipo',destino_tipo); 
    formdata.append('destino_token',destino_token);
    formdata.append('monto',monto);
    formdata.append('moneda_code',moneda_code);  
    formdata.append('tipo_cambio',tipo_cambio);
    formdata.append('observaciones',observaciones);

    for (var i = 0; i < anexosMovimDocs.length; i++) {
      formdata.append("anexosMovimDocs[]", anexosMovimDocs[i]);
    }

    return this.httpcliente.post(this.url+'finanzas_mov_financieros_registra_movimiento_cuentas_propias',formdata).pipe(
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
