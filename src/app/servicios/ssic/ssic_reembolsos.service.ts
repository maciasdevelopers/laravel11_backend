import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { productoAngularModelo } from '../../modelos/productoAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class SSICReembolsosService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _http: HttpClient) {
    this.url = global.urlApi;
  }

  list_reembolsos_egr_general(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._http.post(this.url+'egresos_reembolsos_lista_general',data).pipe(catchError(this.handlerError));
  }

  list_reembolsos_egr_pendientes() :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_lista_pendientes',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  list_reembolsos_compras_para_vincular(token_solicitud_reem:any,token_reem:any,filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {
      "token_solicitud_reem":token_solicitud_reem,
      "token_reem":token_reem,
      "periodo":filtro,
      "periodo_inicio":periodo_inicio,
      "periodo_fin":periodo_fin
    };
    return this._http.post(this.url+'egresos_reembolsos_compras_para_vincular',data)
    .pipe(catchError(this.handlerError));
  }

  list_reembolsos_egr_concluidos(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._http.post(this.url+'egresos_reembolsos_lista_concluidos',data)
    .pipe(catchError(this.handlerError));
  }

  reembolso_egr_detalle(token_reem:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_reem":token_reem});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_detalle',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  /*reembolso_egr_auth_pagar_a_acreedor(token_reem:any,tkn_solicitud:any,autorizacion:any,token_compras:any,fecha_contabilizacion:any,observaciones:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,
      "tkn_solicitud":tkn_solicitud,
      "autorizacion":autorizacion,
      "token_compras":token_compras,
      "fecha_contabilizacion":fecha_contabilizacion,
      "observaciones":observaciones
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_auth_pagar_a_acreedor',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }*/

  reembolso_egr_auth_pagar_a_acreedor(token_reem:any,tkn_solicitud:any,token_compras:any,fecha_contabilizacion:any,observaciones:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,
      "tkn_solicitud":tkn_solicitud,
      "token_compras":token_compras,
      "fecha_contabilizacion":fecha_contabilizacion,
      "observaciones":observaciones
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_auth_pagar_a_acreedor',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_egr_auth(token_reem:any,tkn_solicitud:any,autorizacion:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,"tkn_solicitud":tkn_solicitud,"autorizacion":autorizacion});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_auth',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_egr_observaciones_auth(token_reem:any,tkn_solicitud:any,observaciones:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,"tkn_solicitud":tkn_solicitud,"observaciones":observaciones});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_observaciones_auth',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_cancela_vinc_compras(token_reem:any,token_solicitud_reem:any,token_compras:any,observaciones:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,
      "token_solicitud_reem":token_solicitud_reem,
      "token_compras":token_compras,
      "observaciones":observaciones});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_solicita_cancelacion_vinc_compras',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_egr_genera_op_compras(token_reem:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_genera_op_compras',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_egr_auth_by_compras(token_reem:any,tkn_solicitud:any,autorizacion:any,observaciones:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,"tkn_solicitud":tkn_solicitud,"autorizacion":autorizacion,"observaciones":observaciones});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'egresos_reembolsos_compras_auth',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  list_reembolsos_vh() :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'valor_humano_reembolsos_lista',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_vh_detalle(token_reem:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_reem":token_reem});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'valor_humano_reembolsos_detalle',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_vh_auth(token_reem:any,tkn_solicitud:any,autorizacion:any,observaciones:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,"tkn_solicitud":tkn_solicitud,"autorizacion":autorizacion,"observaciones":observaciones});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'valor_humano_reembolsos_auth',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  list_o_p_reem() :Observable<any>{
    return this._http.post(this.url+'finanzas_orden_pago_op_reembolso_lista',null)
    .pipe(catchError(this.handlerError));
  }

  op_reembolso_detalle(token_reem:any) :Observable<any>{
    let data = {"token_reem":token_reem};
    return this._http.post(this.url+'finanzas_orden_pago_op_reembolso_detalle',data)
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
