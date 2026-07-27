import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfActIntangibles } from '../../interfaces/interf-act-intangibles';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { activoIntangibleAngularModelo } from '../../modelos/activoIntangibleAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class ActIntangiblesService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  activosIntangDelGet():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_listaactivosintandeleted',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  activoscomprasIntangDelGet(cant_art_prorrateo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"cant_art_prorrateo":cant_art_prorrateo});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_listacompraActivosIntan',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  activosIntangClassif():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_activosclasificacionintang',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  agregaClassActivoIntan(imgActClassCaarga:File,cActConcepto:any,cActContable:any,cActFiscal:any):Observable<any>{
    const formData = new FormData();
    let sos_tokens:any = sessionStorage.getItem('inside_session_code');
    formData.append('user_token',sos_tokens);
    formData.append('imgActClassCaarga', imgActClassCaarga, imgActClassCaarga.name);
    formData.append('datosclass',JSON.stringify({"cActConcepto":cActConcepto,"cActContable":cActContable,"cActFiscal":cActFiscal}));
    console.log(formData);
    //console.log(json);
    //let parametros = 'json='+json;
    //return this._httpClient.post(this.url+'appendservicio',parametros, {headers: headers})
    return this._httpClient.post(this.url+'inventarios_catalogos_agregaclassactivointang',formData)
    .pipe(catchError(this.handlerError));
  }

  activosIntangGet(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'inventarios_catalogos_listaActivosIntan',data)
    .pipe(catchError(this.handlerError));
  }

  activoscomprasdiferidosGet(cant_art_prorrateo:any):Observable<any>{
    let data = {"cant_art_prorrateo":cant_art_prorrateo};
    return this._httpClient.post(this.url+'egresos_compras_prorrateos_prorratear_activos_diferidos',data)
    .pipe(catchError(this.handlerError));
  }
  
  viewActivoIntan(token_act_intang:any):Observable<any>{
    let data = {"token_act_intang":token_act_intang};
    return this._httpClient.post(this.url+'inventarios_catalogos_viewActivoIntan',data)
    .pipe(catchError(this.handlerError));
  }

  actualizaGeneralesActivoIntan(token_act_intang:any,activoIntang:activoIntangibleAngularModelo):Observable<any>{
    let data = {
      "token_act_intang":token_act_intang,
      "categoria":activoIntang.categoria,
      "categoriaCuentaContable" :activoIntang.categoriaCuentaContable,
      "amortizacionContablePeriodo":activoIntang.amortizacionContablePeriodo,
      "amortizacionContableTiempoEjecucion":activoIntang.amortizacionContableTiempoEjecucion,
      "amortizacionContableCuentaUno":activoIntang.amortizacionContableCuentaUno,
      "amortizacionContableCuentaDos":activoIntang.amortizacionContableCuentaDos,
      "amortizacionFiscalPeriodo":activoIntang.amortizacionFiscalPeriodo,
      "amortizacionFiscalTiempoEjecucion":activoIntang.amortizacionFiscalTiempoEjecucion,
      "amortizacionFiscalCuentaUno":activoIntang.amortizacionFiscalCuentaUno,
      "amortizacionFiscalCuentaDos":activoIntang.amortizacionFiscalCuentaDos,
      "observaciones":activoIntang.observaciones
    };
    return this._httpClient.post(this.url+'inventarios_catalogos_actualizageneralesactintang',data)
    .pipe(catchError(this.handlerError));
  }

  deletepapeleraactivointang(token_act_intang:any):Observable<any>{
    let data = {"token_act_intang":token_act_intang};
    return this._httpClient.post(this.url+'inventarios_catalogos_deletepapeleraactivointang',data)
    .pipe(catchError(this.handlerError));
  }

  listaActivosIntanDeleted():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_listaactivosintandeleted',null)
    .pipe(catchError(this.handlerError));
  }

  restartActivosIntang(token_act_intang:any):Observable<any>{
    let data = {"token_act_intang":token_act_intang};
    return this._httpClient.post(this.url+'inventarios_catalogos_restartActivosintang',data)
    .pipe(catchError(this.handlerError));
  }

  deleteDeadActivosIntang(token_act_intang:any):Observable<any>{
    let data = {"token_act_intang":token_act_intang};
    return this._httpClient.post(this.url+'inventarios_catalogos_deleteDeadActivosIntang',data)
    .pipe(catchError(this.handlerError));
  }

  registraActivoIntangible(activoIntang:activoIntangibleAngularModelo):Observable<any>{
    let data = {
      "categoria":activoIntang.categoria,
      "categoriaCuentaContable" :activoIntang.categoriaCuentaContable,
      "amortizacionContablePeriodo":activoIntang.amortizacionContablePeriodo,
      "amortizacionContableTiempoEjecucion":activoIntang.amortizacionContableTiempoEjecucion,
      "amortizacionContableCuentaUno":activoIntang.amortizacionContableCuentaUno,
      "amortizacionContableCuentaDos":activoIntang.amortizacionContableCuentaDos,
      "amortizacionFiscalPeriodo":activoIntang.amortizacionFiscalPeriodo,
      "amortizacionFiscalTiempoEjecucion":activoIntang.amortizacionFiscalTiempoEjecucion,
      "amortizacionFiscalCuentaUno":activoIntang.amortizacionFiscalCuentaUno,
      "amortizacionFiscalCuentaDos":activoIntang.amortizacionFiscalCuentaDos,
      "observaciones":activoIntang.observaciones
    };
    return this._httpClient.post(this.url+'inventarios_catalogos_appendactivointangible',data)
    .pipe(catchError(this.handlerError));
  }

  updateActivoIntanPro(token_act_intangs:any,proveedor:any,activo_claveTkn:any,clave:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_act_intangs":token_act_intangs,
      "tknProveedor":proveedor,"activo_claveTkn":activo_claveTkn,"clave":clave});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_updateactivointangprov',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  eliminarActivoIntanProv(token_act_intangs:any,proveedor:any,activo_claveTkn:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_act_intangs":token_act_intangs,
    "tknProveedor":proveedor,"activo_claveTkn":activo_claveTkn});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_deleteactivointangprov',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  addNewActivoIntanProv(token_act_intangs:any,proveedor:any,clave:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_act_intangs":token_act_intangs,
      "tknProveedor":proveedor,"clave":clave});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'inventarios_catalogos_nuevactivointangprov',parametros, {headers: headers})
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
