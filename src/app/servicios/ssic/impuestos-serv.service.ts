import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class ImpuestosServService {
  public url: string;
  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

//esquemas
  esquemaImpuestosRegistro(impuesto_esquema:any,impuestos_lista:any):Observable<any>{
    let data = {"impuesto_esquema":impuesto_esquema,"impuestos_lista":impuestos_lista};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_registro',data)
    .pipe(catchError(this.handlerError))
  }

  esquemaImpuestosCatalogo():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_catalogo',null)
    .pipe(catchError(this.handlerError))
  }

  esquemaImpuestosParaVentas():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_catalogo_forventas',null)
    .pipe(catchError(this.handlerError))
  }

  esquemaImpuestosCatalogoEnabled():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_catalogo_enabled',null)
    .pipe(catchError(this.handlerError))
  }

  enableEsquemaImpuestos(esquema_token:any):Observable<any>{
    let data = {"esquema_token":esquema_token};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_enable',data)
    .pipe(catchError(this.handlerError))
  }

  disableEsquemaImpuestos(esquema_token:any):Observable<any>{
    let data = {"esquema_token":esquema_token};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_disable',data)
    .pipe(catchError(this.handlerError))
  }

  seleccionarEsquemaImpuestosInfo(esquema_token:any):Observable<any>{
    let data = {"esquema_token":esquema_token};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_detalle',data)
    .pipe(catchError(this.handlerError))
  }

  actualizarEsquemaImpuestosSelected(esquema_token:any,impuesto_esquema:any):Observable<any>{
    let data = {"esquema_token":esquema_token,"impuesto_esquema":impuesto_esquema};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_actualizar',data)
    .pipe(catchError(this.handlerError))
  }

  actualizarEsquemaImpuestosAadSelected(esquema_token:any,token_catalogo_impuesto:any):Observable<any>{
    let data = {"esquema_token":esquema_token,"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_actualizar_agregar',data)
    .pipe(catchError(this.handlerError))
  }

  actualizarEsquemaImpuestosRemoveSelected(esquema_token:any,token_catalogo_impuesto:any):Observable<any>{
    let data = {"esquema_token":esquema_token,"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_actualizar_remove',data)
    .pipe(catchError(this.handlerError))
  }

  papeleraSaveEsquemaImpuestosSelected(esquema_token:any):Observable<any>{
    let data = {"esquema_token":esquema_token};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_papelera_save',data)
    .pipe(catchError(this.handlerError))
  }

  esquemaImpuestosCatalogoEliminados():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_eliminados',null)
    .pipe(catchError(this.handlerError))
  }

  restaurarEsquemaImpuestosSelected(esquema_token:any):Observable<any>{
    let data = {"esquema_token":esquema_token};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_restaurar',data)
    .pipe(catchError(this.handlerError))
  }

  eliminarPermEsquemaImpuestosSelected(esquema_token:any):Observable<any>{
    let data = {"esquema_token":esquema_token};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_esquema_eliminar',data)
    .pipe(catchError(this.handlerError))
  }

//impuestos
  registrarImpuestosCatalogo(
    impuesto_abreviacion:any,
    impuesto_concepto:any,
    impuesto_modulo:any,
    impuesto_nivel:any,
    impuesto_clave_sat:any,
    impuesto_tipo:any,
    impuesto_exento:any,
    impuesto_tasa_cuota:any,
    impuesto_importe:any,
    impuesto_tipo_cambio:any,
    impuesto_moneda_aplicada:any,
    impuesto_aplica_sobre:any,
    impuesto_desglose:any,
    impuesto_gl_por_pagar_o_cobrar:any,
    impuesto_gl_efectivamente_pagada_o_cobrada:any,
    impuesto_observaciones:any
  ):Observable<any>{
    let data = {
      "impuesto_abreviacion":impuesto_abreviacion,
      "impuesto_concepto":impuesto_concepto,
      "impuesto_modulo":impuesto_modulo,
      "impuesto_nivel":impuesto_nivel,
      "impuesto_clave_sat":impuesto_clave_sat,
      "impuesto_exento":impuesto_exento,
      "impuesto_tipo":impuesto_tipo,
      "impuesto_tasa_cuota":impuesto_tasa_cuota,
      "impuesto_importe":impuesto_importe,
      "tipo_cambio":impuesto_tipo_cambio,
      "moneda_impuesto":impuesto_moneda_aplicada,
      "impuesto_aplica_sobre":impuesto_aplica_sobre,
      "impuesto_desglose":impuesto_desglose,
      "impuesto_gl_por_pagar_o_cobrar":impuesto_gl_por_pagar_o_cobrar,
      "impuesto_gl_efectivamente_pagada_o_cobrada":impuesto_gl_efectivamente_pagada_o_cobrada,
      "impuesto_observaciones":impuesto_observaciones
    };
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_registrar',data)
    .pipe(catchError(this.handlerError))
  }

  catalogoGeneralImpuestosTrue(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'contabilidad_catalogo_general_impuestos',data)
    .pipe(catchError(this.handlerError))
  }

  catalogoImpuestosTrueDeclaracion():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogo_impuestos_declaracion',null)
    .pipe(catchError(this.handlerError))
  }

  catalogoGeneralImpuestosRetencionesTrue(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'contabilidad_catalogo_general_impuestos_retenciones',data)
    .pipe(catchError(this.handlerError))
  }

  catalogoGeneralImpuestosTrasladosTrue(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'contabilidad_catalogo_general_impuestos_traslados',data)
    .pipe(catchError(this.handlerError))
  }

  catalogoGeneralImpuestosEnabled():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogo_general_impuestos_enabled',null)
    .pipe(catchError(this.handlerError))
  }

  enableImpuestoSelected(token_catalogo_impuesto:any):Observable<any>{
    let data = {"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_enable',data)
    .pipe(catchError(this.handlerError))
  }

  disableImpuestoSelected(token_catalogo_impuesto:any):Observable<any>{
    let data = {"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_disable',data)
    .pipe(catchError(this.handlerError))
  }

  seleccionarImpuestoInfo(token_catalogo_impuesto:any):Observable<any>{
    let data = {"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_detalle',data)
    .pipe(catchError(this.handlerError))
  }

  actualizarPermImpuestoSelected(
    token_catalogo_impuesto:any,
    impuesto_modulo:any,
    impuesto_nivel:any,
    impuesto_clave_sat:any,
    impuesto_tipo:any,
    impuesto_tasa_cuota:any,
    impuesto_importe:any,
    impuesto_tipo_cambio:any,
    impuesto_moneda_aplicada:any,
    impuesto_aplica_sobre:any,
    impuesto_desglose:any,
    impuesto_gl_por_pagar_o_cobrar:any,
    impuesto_gl_efectivamente_pagada_o_cobrada:any,
    impuesto_observaciones:any
  ):Observable<any>{
    let data = {
      "token_catalogo_impuesto":token_catalogo_impuesto,
      "impuesto_modulo":impuesto_modulo,
      "impuesto_nivel":impuesto_nivel,
      "impuesto_clave_sat":impuesto_clave_sat,
      "impuesto_tipo":impuesto_tipo,
      "impuesto_tasa_cuota":impuesto_tasa_cuota,
      "impuesto_importe":impuesto_importe,
      "tipo_cambio":impuesto_tipo_cambio,
      "moneda_impuesto":impuesto_moneda_aplicada,
      "impuesto_aplica_sobre":impuesto_aplica_sobre,
      "impuesto_desglose":impuesto_desglose,
      "impuesto_gl_por_pagar_o_cobrar":impuesto_gl_por_pagar_o_cobrar,
      "impuesto_gl_efectivamente_pagada_o_cobrada":impuesto_gl_efectivamente_pagada_o_cobrada,
      "impuesto_observaciones":impuesto_observaciones
    };
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_actualizar',data)
    .pipe(catchError(this.handlerError))
  }

  papeleraSaveImpuestoSelected(token_catalogo_impuesto:any):Observable<any>{
    let data = {"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_papelera_save',data)
    .pipe(catchError(this.handlerError))
  }

  catalogoGeneralImpuestosFalse():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_eliminados',null)
    .pipe(catchError(this.handlerError))
  }

  restaurarImpuestoSelected(token_catalogo_impuesto:any):Observable<any>{
    let data = {"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_restaurar',data)
    .pipe(catchError(this.handlerError))
  }

  eliminarPermImpuestoSelected(token_catalogo_impuesto:any):Observable<any>{
    let data = {"token_catalogo_impuesto":token_catalogo_impuesto};
    return this._httpClient.post(this.url+'contabilidad_catalogoimpuestos_eliminar',data)
    .pipe(catchError(this.handlerError))
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
