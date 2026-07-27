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
export class SsicComisionesService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _http: HttpClient) {
    this.url = global.urlApi;
  }

  comisionados_lista() :Observable<any>{ //no existe 
    return this._http.post(this.url+'egresos_comisiones_comisionados',null)
    .pipe(catchError(this.handlerError));
  }

  comision_lista_general() :Observable<any>{
    return this._http.post(this.url+'comision_lista_general',null)
    .pipe(catchError(this.handlerError));
  }

  comisiones_lista_general(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._http.post(this.url+'egresos_comisiones_lista_general',data)
    .pipe(catchError(this.handlerError));
  }

  comision_listas_no_concluidas(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._http.post(this.url+'egresos_comisiones_listas_no_concluidas',data)
    .pipe(catchError(this.handlerError));
  }

  comision_listas_recibe_dinero() :Observable<any>{ //no existe
    return this._http.post(this.url+'comision_listas_recibe_dinero',null)
    .pipe(catchError(this.handlerError));
  }

  comision_registro_aviso_fnzs(tokenComision:any) :Observable<any>{ //no existe
    let data = {"tokenComision":tokenComision};
    return this._http.post(this.url+'comision_registro_aviso_fnzs',data)
    .pipe(catchError(this.handlerError));
  }

  comision_registro_aviso_eegr(tokenComision:any) :Observable<any>{
    let data = {"tokenComision":tokenComision};
    return this._http.post(this.url+'egresos_comisiones_comision_registro_aviso_eegr',data)
    .pipe(catchError(this.handlerError));
  }

  comision_registro_aviso_vhum(tokenComision:any) :Observable<any>{
    let data = {"tokenComision":tokenComision};
    return this._http.post(this.url+'valor_humano_comision_registro_aviso_vhum',data)
    .pipe(catchError(this.handlerError));
  }

  comision_terminar(token_comision:any) :Observable<any>{
    let data = {"token_comision":token_comision};
    return this._http.post(this.url+'egresos_comisiones_terminar',data)
    .pipe(catchError(this.handlerError));
  }


  comision_deshabilitar(token_comision:any) :Observable<any>{
    let data = {"token_comision":token_comision};
    return this._http.post(this.url+'egresos_comisiones_deshabilitar',data)
    .pipe(catchError(this.handlerError));
  }

  comision_rehabilitar(token_comision:any) :Observable<any>{
    let data = {"token_comision":token_comision};
    return this._http.post(this.url+'egresos_comisiones_rehabilitar',data)
    .pipe(catchError(this.handlerError));
  }

  comision_listas_concluidas(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._http.post(this.url+'egresos_comisiones_listas_concluidas',data).pipe(catchError(this.handlerError));
  }

  comision_detalle_update(token_comision:any) :Observable<any>{
    let data = {"token_comision":token_comision};
    return this._http.post(this.url+'egresos_comisiones_detalle_update',data)
    .pipe(catchError(this.handlerError));
  }

  comision_detalle_get_data(token_comision:any) :Observable<any>{
    let data = {"token_comision":token_comision};
    return this._http.post(this.url+'egresos_comisiones_detalle_get_data',data)
    .pipe(catchError(this.handlerError));
  }

  comision_deshabilitadas() :Observable<any>{
    return this._http.post(this.url+'egresos_comisiones_deshabilitadas',null)
    .pipe(catchError(this.handlerError));
  }

  list_reem_salidas_comision(usuario_acreedor_token:any) :Observable<any>{
    let data = {"usuario_acreedor_token":usuario_acreedor_token};
    return this._http.post(this.url+'comision_reem_listas',data)
    .pipe(catchError(this.handlerError));
  }

  save_comision(
    comi_proyecto:any,
    comi_comisionado_tipo:any,
    comi_comisionado_token:any,
    comi_especificaciones:any,
    comi_fecha_salida:any,
    comi_time_duracion:any,
    comi_recibe_dinero:any,
    comi_dinero_recibido:any,
    comi_moneda_tkn:any,
    comi_tiempo_respuesta:any,
    comi_califica_vhum:any,
    comi_califica_egresos:any,

    data_dipomex_cod_postal_estado:any,
    data_dipomex_cod_postal_municipio:any,
    data_dipomex_cod_postal_cp:any,
    data_dipomex_cod_postal_colonia_vinculada:any,
    data_listnewdireccionNac:any) :Observable<any>{
    let data = {
      "comi_proyecto":comi_proyecto,
      "comi_comisionado_tipo":comi_comisionado_tipo,
      "comi_comisionado_token":comi_comisionado_token,
      "comi_especificaciones":comi_especificaciones,
      "comi_fecha_salida":comi_fecha_salida,
      "comi_time_duracion":comi_time_duracion,
      "comi_recibe_dinero":comi_recibe_dinero,
      "comi_dinero_recibido":comi_dinero_recibido,
      "comi_moneda_tkn":comi_moneda_tkn,
      "comi_tiempo_respuesta":comi_tiempo_respuesta,
      "comi_califica_vhum":comi_califica_vhum,
      "comi_califica_egresos":comi_califica_egresos,
      "dipomex_cod_postal_estado":data_dipomex_cod_postal_estado,
      "dipomex_cod_postal_municipio":data_dipomex_cod_postal_municipio,
      "dipomex_cod_postal_cp":data_dipomex_cod_postal_cp,
      "dipomex_cod_postal_colonia_vinculada":data_dipomex_cod_postal_colonia_vinculada,
      "listnewdireccionNac":data_listnewdireccionNac
    };
    return this._http.post(this.url+'egresos_comisiones_registrar',data)
    .pipe(catchError(this.handlerError));
  }

  update_comision(
    token_comision:any,
    comi_proyecto:any,
    comi_comisionado_tipo:any,
    comi_comisionado_token:any,
    comi_especificaciones:any,
    comi_fecha_salida:any,
    comi_time_duracion:any,
    comi_recibe_dinero:any,
    comi_dinero_recibido:any,
    comi_moneda:any,
    comi_tiempo_respuesta:any,
    comi_califica_vhum:any,
    comi_califica_egresos:any,
    data_dipomex_cod_postal_estado:any,
    data_dipomex_cod_postal_municipio:any,
    data_dipomex_cod_postal_cp:any,
    data_dipomex_cod_postal_colonia_vinculada:any) :Observable<any>{
    let data = {
      "token_comision":token_comision,
      "comi_proyecto":comi_proyecto,
      "comi_comisionado_tipo":comi_comisionado_tipo,
      "comi_comisionado_token":comi_comisionado_token,
      "comi_especificaciones":comi_especificaciones,
      "comi_fecha_salida":comi_fecha_salida,
      "comi_time_duracion":comi_time_duracion,
      "comi_recibe_dinero":comi_recibe_dinero,
      "comi_dinero_recibido":comi_dinero_recibido,
      "comi_moneda":comi_moneda,
      "comi_tiempo_respuesta":comi_tiempo_respuesta,
      "comi_califica_vhum":comi_califica_vhum,
      "comi_califica_egresos":comi_califica_egresos,
      "dipomex_cod_postal_estado":data_dipomex_cod_postal_estado,
      "dipomex_cod_postal_municipio":data_dipomex_cod_postal_municipio,
      "dipomex_cod_postal_cp":data_dipomex_cod_postal_cp,
      "dipomex_cod_postal_colonia_vinculada":data_dipomex_cod_postal_colonia_vinculada
    };
    return this._http.post(this.url+'egresos_comisiones_actualizar',data)
    .pipe(catchError(this.handlerError));
  }

  comisiones_monitoreo() :Observable<any>{
    return this._http.post(this.url+'gerencia_monitoreo_comisiones',null).pipe(catchError(this.handlerError));
  }

  comisiones_solicitud_apertura() :Observable<any>{ //no existe
    return this._http.post(this.url+'comisiones_solicitud_apertura',null).pipe(catchError(this.handlerError));
  }

  egresos_comisiones_reabrir(token_comision:any) :Observable<any>{ // no existe
    let data = {"token_comision":token_comision};
    return this._http.post(this.url+'egresos_comisiones_reabrir',data)
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
