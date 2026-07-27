import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfActFijos } from '../../interfaces/interf-act-fijos';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { activoFijoAngularModelo } from '../../modelos/activoFijoAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class ActFijosService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } 

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  registraActivoFijo(activoFijo:activoFijoAngularModelo):Observable<any>{
    let data = {
      "categoria":activoFijo.categoria,
      "categoriaCuentaContable" :activoFijo.categoriaCuentaContable,
      "depreciacionContableTipo":activoFijo.depreciacionContableTipo,
      "depreciacionContablePeriodo":activoFijo.depreciacionContablePeriodo,
      "depreciacionContableImporte":activoFijo.depreciacionContableImporte,
      "depreciacionContableCuenta":activoFijo.depreciacionContableCuentaUno,
      "depreciacionContableCuentaDos":activoFijo.depreciacionContableCuentaDos,
      "depreciacionFiscalTipo":activoFijo.depreciacionFiscalTipo,
      "depreciacionFiscalPeriodo":activoFijo.depreciacionFiscalPeriodo,
      "depreciacionFiscalImporte":activoFijo.depreciacionFiscalImporte,
      "depreciacionFiscalCuenta":activoFijo.depreciacionFiscalCuentaUno,
      "depreciacionFiscalCuentaDos":activoFijo.depreciacionFiscalCuentaDos,
      "observaciones":activoFijo.observaciones
    };
    return this._httpClient.post(this.url+'inventarios_catalogos_appendactivofijo',data)
    .pipe(catchError(this.handlerError));
  }

  clasificacionAct():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_clasificacionfijosactv',null)
    .pipe(catchError(this.handlerError));
  }

  activosFijosCatalogo(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'inventarios_catalogos_listaActivosFijos',data)
    .pipe(catchError(this.handlerError));
  }

  activoscomprasFijosGet(cant_art_prorrateo:any):Observable<any>{
    let data = {"cant_art_prorrateo":cant_art_prorrateo};
    return this._httpClient.post(this.url+'egresos_compras_prorrateos_prorratear_activos_fijos',data)
    .pipe(catchError(this.handlerError));
  }

  viewActivoFijo(token_act_fijos:any):Observable<any>{
    let data = {"token_act_fijos":token_act_fijos};
    return this._httpClient.post(this.url+'inventarios_catalogos_viewActivoFijo',data)
    .pipe(catchError(this.handlerError));
  }

  actualizaGeneralesActivo(token_act_fijos:string,activoFijo:activoFijoAngularModelo):Observable<any>{
    let data = {
      "token_act_fijos":token_act_fijos,
      "categoria":activoFijo.categoria,
      "categoriaCuentaContable" :activoFijo.categoriaCuentaContable,
      "depreciacionContableTipo":activoFijo.depreciacionContableTipo,
      "depreciacionContablePeriodo":activoFijo.depreciacionContablePeriodo,
      "depreciacionContableImporte":activoFijo.depreciacionContableImporte,
      "depreciacionContableCuenta":activoFijo.depreciacionContableCuentaUno,
      "depreciacionContableCuentaDos":activoFijo.depreciacionContableCuentaDos,
      "depreciacionFiscalTipo":activoFijo.depreciacionFiscalTipo,
      "depreciacionFiscalPeriodo":activoFijo.depreciacionFiscalPeriodo,
      "depreciacionFiscalImporte":activoFijo.depreciacionFiscalImporte,
      "depreciacionFiscalCuenta":activoFijo.depreciacionFiscalCuentaUno,
      "depreciacionFiscalCuentaDos":activoFijo.depreciacionFiscalCuentaDos,
      "observaciones":activoFijo.observaciones
    };
    return this._httpClient.post(this.url+'inventarios_catalogos_actualizageneralesactfijo',data)
    .pipe(catchError(this.handlerError));
  }

  deletepapeleraactivofijo(token_act_fijos:any):Observable<any>{
    let data = {"token_act_fijos":token_act_fijos};
    return this._httpClient.post(this.url+'inventarios_catalogos_deletepapeleraactivofijo',data)
    .pipe(catchError(this.handlerError));
  }

  listaActivosFijosDeleted():Observable<any>{
    return this._httpClient.post(this.url+'inventarios_catalogos_listaActivosFijosDeleted',null)
    .pipe(catchError(this.handlerError));
  }

  restartActivosFijos(token_act_fijos:any):Observable<any>{
    let data = {"token_act_fijos":token_act_fijos};
    return this._httpClient.post(this.url+'inventarios_catalogos_restartActivosFijos',data)
    .pipe(catchError(this.handlerError));
  }

  deleteDeadActivosFijos(token_act_fijos:any):Observable<any>{
    let data = {"token_act_fijos":token_act_fijos};
    return this._httpClient.post(this.url+'inventarios_catalogos_deleteDeadActivosFijos',data)
    .pipe(catchError(this.handlerError));
  }

  agregaClassActivo(imgActClassCaarga:File,cActConcepto:any,cActContable:any,cActFiscal:any):Observable<any>{
    const formData = new FormData();
    formData.append('imgActClassCaarga', imgActClassCaarga, imgActClassCaarga.name);
    formData.append('datosclass',JSON.stringify({"cActConcepto":cActConcepto,"cActContable":cActContable,"cActFiscal":cActFiscal}));
    console.log(formData);
    return this._httpClient.post(this.url+'inventarios_catalogos_agregaclassactivo',formData)
    .pipe(catchError(this.handlerError));
  }

  actualizaActivoProv(token_act_fijos:any,proveedor:any,activo_claveTkn:any,clave:any):Observable<any>{
    let data = {
      "token_act_fijos":token_act_fijos,
      "tknProveedor":proveedor,
      "activo_claveTkn":activo_claveTkn,
      "clave":clave
    };
    return this._httpClient.post(this.url+'inventarios_catalogos_updateactivofijoprov',data)
    .pipe(catchError(this.handlerError));
  }

  eliminarActivoProv(token_act_fijos:any,proveedor:any,activo_claveTkn:any):Observable<any>{
    let data = {
      "token_act_fijos":token_act_fijos,
      "tknProveedor":proveedor,
      "activo_claveTkn":activo_claveTkn
    };
    return this._httpClient.post(this.url+'inventarios_catalogos_deleteactivofijoprov',data)
    .pipe(catchError(this.handlerError));
  }

  addNewActivoProv(token_act_fijos:any,proveedor:any,clave:any):Observable<any>{
    let data = {
      "token_act_fijos":token_act_fijos,
      "tknProveedor":proveedor,
      "clave":clave
    };
    return this._httpClient.post(this.url+'inventarios_catalogos_newactivofijoprov',data)
    .pipe(catchError(this.handlerError));
  }

  //recepción
  guardarRecepcionActFijos(token_compras:any,arrayActFijos:any,imagenEvidenciaXMl:File,imagenEvidenciaPdf:File):Observable<any>{
    const formdataCompra = new FormData();
    if (imagenEvidenciaXMl) {
      formdataCompra.append('imagenEvidenciaXMl',imagenEvidenciaXMl,imagenEvidenciaXMl.name);
    } else {
      formdataCompra.append('imagenEvidenciaXMl','');
    }
    if (imagenEvidenciaPdf) {
      formdataCompra.append('imagenEvidenciaPdf',imagenEvidenciaPdf,imagenEvidenciaPdf.name);
    } else {
      formdataCompra.append('imagenEvidenciaPdf','');
    }
    console.log(arrayActFijos);
    formdataCompra.append('dataCompra',JSON.stringify({"token_compra":token_compras,"arrayActFijos":arrayActFijos}));

    return this._httpClient.post(this.url+'egresos_compras_buyrecibeactfijos',formdataCompra).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  guardarRecepcionActivos(token_compras:any,activos_fijos:any):Observable<any>{
    let json = JSON.stringify({"token_compra":token_compras,"activos_fijos":activos_fijos});
    console.log(json);
    let data = {"token_compra":token_compras,"activos_fijos":activos_fijos};
    return this._httpClient.post(this.url+'inventarios_movimientos_recibe_activo',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  //contabilidad
  contabActFijosCat(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_catalogo',data).pipe(catchError(this.handlerError));
  }

  activoFijoDetalleToDeprec(token_activof_unidad:string):Observable<any>{
    let json = JSON.stringify({"token_activof_unidad":token_activof_unidad});
    console.log(json);
    let data = {"token_activof_unidad":token_activof_unidad};
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_detalle_to_deprec',data)
    .pipe(catchError(this.handlerError));
  }

  activoFijoDepreciar(token_activof_unidad:string,fecha_contabilizacion:string,observaciones:string,gasto_contable_manual:number,deduccion_de_inversion_manual:number):Observable<any>{
    let json = JSON.stringify({
      "token_activof_unidad":token_activof_unidad,
      "fecha_contabilizacion":fecha_contabilizacion,
      "observaciones":observaciones,
      "gasto_contable_manual":gasto_contable_manual,
      "deduccion_de_inversion_manual":deduccion_de_inversion_manual
    });
    console.log(json);
    let data = {
      "token_activof_unidad":token_activof_unidad,
      "fecha_contabilizacion":fecha_contabilizacion,
      "observaciones":observaciones,
      "gasto_contable_manual":gasto_contable_manual,
      "deduccion_de_inversion_manual":deduccion_de_inversion_manual
    };
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_depreciar_activo',data)
    .pipe(catchError(this.handlerError));
  }
  
  activoFijoDeprecionesRegistradas(token_activof_unidad:string):Observable<any>{
    let json = JSON.stringify({"token_activof_unidad":token_activof_unidad});
    console.log(json);
    let data = {"token_activof_unidad":token_activof_unidad};
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_depreciaciones_registradas',data)
    .pipe(catchError(this.handlerError));
  }

  activoFijoMejorasRegistradas(token_activof_unidad:string):Observable<any>{
    let json = JSON.stringify({"token_activof_unidad":token_activof_unidad});
    console.log(json);
    let data = {"token_activof_unidad":token_activof_unidad};
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_mejoras_registradas',data)
    .pipe(catchError(this.handlerError));
  }

  guardarFechaDepreciacionActivos(token_activof_unidad:string,fecha_iniciar_depreciacion:string):Observable<any>{
    let json = JSON.stringify({"token_activof_unidad":token_activof_unidad,"fecha_iniciar_depreciacion":fecha_iniciar_depreciacion});
    console.log(json);
    let data = {"token_activof_unidad":token_activof_unidad,"fecha_iniciar_depreciacion":fecha_iniciar_depreciacion};
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_inicia_depreciacion',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  bloqueaDepreciacionActivos(token_activof_unidad:string,fecha_bloqueo_deprec:string):Observable<any>{
    let json = JSON.stringify({"token_activof_unidad":token_activof_unidad,"fecha_bloqueo_deprec":fecha_bloqueo_deprec});
    console.log(json);
    let data = {"token_activof_unidad":token_activof_unidad,"fecha_bloqueo_deprec":fecha_bloqueo_deprec};
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_bloquea_depreciacion',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  desbloqueaDepreciacionActivos(token_activof_unidad:string,fecha_de_desbloqueo:string,fecha_proximo_corte:string):Observable<any>{
    let json = JSON.stringify({"token_activof_unidad":token_activof_unidad,"fecha_de_desbloqueo":fecha_de_desbloqueo,"fecha_reinicio_deprec":fecha_proximo_corte});
    console.log(json);
    let data = {"token_activof_unidad":token_activof_unidad,"fecha_de_desbloqueo":fecha_de_desbloqueo,"fecha_reinicio_deprec":fecha_proximo_corte};
    return this._httpClient.post(this.url+'contabilidad_activos_fijos_desbloquea_depreciacion',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
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
