import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { declaracionesModelo } from '../../modelos/declaraciones/declaracionesModelo';

@Injectable({
  providedIn: 'root'
})
export class DeclaracionesService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  registra_declaracion(modelDeclaraciones:declaracionesModelo,documentos_evidencia:any):Observable<any>{
    const formDataPago = new FormData();
    formDataPago.append("fecha_contabilizacion",modelDeclaraciones.fecha_contabilizacion); 
    formDataPago.append("tipo_declaracion",modelDeclaraciones.tipo_declaracion); 
    formDataPago.append("periodicidad",modelDeclaraciones.periodicidad); 
    formDataPago.append("ejercicio",modelDeclaraciones.ejercicio);
    formDataPago.append("periodo_inicio",modelDeclaraciones.periodo_inicio);
    formDataPago.append("periodo_fin",modelDeclaraciones.periodo_fin);
    formDataPago.append("fecha_presentacion",modelDeclaraciones.fecha_presentacion); 
    formDataPago.append("medio_presentacion",modelDeclaraciones.medio_presentacion); 
    formDataPago.append("fecha_vencimiento",modelDeclaraciones.fecha_vencimiento); 
    formDataPago.append("version",modelDeclaraciones.version); 
    formDataPago.append("numero_operacion",modelDeclaraciones.numero_operacion); 
    formDataPago.append("linea_de_captura",modelDeclaraciones.linea_de_captura);
    formDataPago.append("moneda",modelDeclaraciones.moneda); 
    formDataPago.append("observaciones",modelDeclaraciones.observaciones);

    if (modelDeclaraciones.declaraciones_lista_pagar) {
      modelDeclaraciones.declaraciones_lista_pagar.forEach((lista_pagar:any, i:any) => {
        formDataPago.append(`declaraciones_lista_pagar[${i}][concepto_pago_token]`, lista_pagar.concepto_pago_token);
        formDataPago.append(`declaraciones_lista_pagar[${i}][concepto_pago_name]`, lista_pagar.concepto_pago_name);
        formDataPago.append(`declaraciones_lista_pagar[${i}][importe_a_favor]`, lista_pagar.importe_a_favor);
        formDataPago.append(`declaraciones_lista_pagar[${i}][a_cargo]`, lista_pagar.a_cargo);
        formDataPago.append(`declaraciones_lista_pagar[${i}][actualizaciones]`, lista_pagar.actualizaciones);
        formDataPago.append(`declaraciones_lista_pagar[${i}][recargos]`, lista_pagar.recargos);
        formDataPago.append(`declaraciones_lista_pagar[${i}][otros_cargos]`, lista_pagar.otros_cargos);
        formDataPago.append(`declaraciones_lista_pagar[${i}][otros_abonos]`, lista_pagar.otros_abonos);
        formDataPago.append(`declaraciones_lista_pagar[${i}][cantidad_a_pagar]`, lista_pagar.cantidad_a_pagar);
      });
    }

    for (var i = 0; i < documentos_evidencia.length; i++) {
      formDataPago.append("documentos_evidencia[]", documentos_evidencia[i]);
    }
    //let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_registro',formDataPago).pipe(
      catchError(this.handlerError)
    );
  }

  catDeclaracionesMain(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_catalogo',data)
    .pipe(catchError(this.handlerError));
  }

  declaracionImpFedSeguimientoOrdPago(declaracion_token:string,dec_ord_pago_token:string):Observable<any>{
    let data = {"declaracion_token":declaracion_token,"dec_ord_pago_token":dec_ord_pago_token};
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_seguimiento_orden_pago',data)
    .pipe(catchError(this.handlerError));
  }

  detalleDeclaracionImpFed(declaracion_token:string):Observable<any>{
    let data = {"declaracion_token":declaracion_token};
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_desglose',data)
    .pipe(catchError(this.handlerError));
  }

  actualiza_declaracion(declaracion_token:string,modelDeclaraciones:declaracionesModelo,documentos_evidencia:any):Observable<any>{
    const desgloseDeleteList = modelDeclaraciones.declaraciones_lista_registrada.filter((desg_list:any) => desg_list.proceso_eliminacion === true);
    const anexosRegList = modelDeclaraciones.anexos_registrados.filter((desg_list:any) => desg_list.eliminacion_proceso === true);
    const formDataFedDec = new FormData();

    formDataFedDec.append("declaracion_token",declaracion_token);
    formDataFedDec.append("fecha_contabilizacion",modelDeclaraciones.fecha_contabilizacion); 
    formDataFedDec.append("tipo_declaracion",modelDeclaraciones.tipo_declaracion); 
    formDataFedDec.append("periodicidad",modelDeclaraciones.periodicidad); 
    formDataFedDec.append("ejercicio",modelDeclaraciones.ejercicio);
    formDataFedDec.append("periodo_inicio",modelDeclaraciones.periodo_inicio);
    formDataFedDec.append("periodo_fin",modelDeclaraciones.periodo_fin);
    formDataFedDec.append("fecha_presentacion",modelDeclaraciones.fecha_presentacion); 
    formDataFedDec.append("medio_presentacion",modelDeclaraciones.medio_presentacion); 
    formDataFedDec.append("fecha_vencimiento",modelDeclaraciones.fecha_vencimiento); 
    formDataFedDec.append("version",modelDeclaraciones.version); 
    formDataFedDec.append("numero_operacion",modelDeclaraciones.numero_operacion); 
    formDataFedDec.append("linea_de_captura",modelDeclaraciones.linea_de_captura);
    formDataFedDec.append("moneda",modelDeclaraciones.moneda); 
 
    if (desgloseDeleteList) {
      desgloseDeleteList.forEach((dec_delete:any, d:any) => {
        formDataFedDec.append(`declaraciones_lista_eliminar[${d}][dec_desglose_token]`, dec_delete.dec_desglose_token);
      });
    }
 
    if (modelDeclaraciones.declaraciones_lista_pagar) {
      modelDeclaraciones.declaraciones_lista_pagar.forEach((dec_reg:any, p:any) => {
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][concepto_pago_token]`, dec_reg.concepto_pago_token);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][concepto_pago_name]`, dec_reg.concepto_pago_name);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][importe_a_favor]`, dec_reg.importe_a_favor);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][a_cargo]`, dec_reg.a_cargo);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][actualizaciones]`, dec_reg.actualizaciones);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][recargos]`, dec_reg.recargos);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][otros_cargos]`, dec_reg.otros_cargos);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][otros_abonos]`, dec_reg.otros_abonos);
        formDataFedDec.append(`declaraciones_lista_pagar[${p}][cantidad_a_pagar]`, dec_reg.cantidad_a_pagar);
      });
    }

    formDataFedDec.append("observaciones",modelDeclaraciones.observaciones); 
    
    if (anexosRegList) {
      anexosRegList.forEach((anex_delete:any, a:any) => {
        formDataFedDec.append(`anexos_lista_eliminar[${a}][token_documento]`, anex_delete.token_documento);
        formDataFedDec.append(`anexos_lista_eliminar[${a}][name_documento]`, anex_delete.name_documento);
      });
    }

    for (var i = 0; i < documentos_evidencia.length; i++) {
      formDataFedDec.append("documentos_evidencia[]", documentos_evidencia[i]);
    }
    //let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_actualizacion',formDataFedDec).pipe(
      catchError(this.handlerError)
    );
  }

  carga_cfdi_declaracion_imp_federales(declaracion_token:string,decfec_partida:any): Observable<any>{
    const formData = new FormData();
    formData.append("declaracion_token",declaracion_token);
    
    decfec_partida.forEach((row:any,index:number) => {
      Object.keys(row).forEach((key:any) => {
        if (["dec_new_factura_xml","dec_new_factura_pdf"].includes(key)) return;
        const cadenas = row[key];
        if (typeof cadenas === 'object') {
          formData.append(`decfec_partida[${index}][${key}]`,JSON.stringify(cadenas));
        } else {
          formData.append(`decfec_partida[${index}][${key}]`,cadenas);
        } 
      });

      if (row.dec_new_factura_xml) {
        formData.append(`decfec_partida[${index}][dec_new_factura_xml]`,row.dec_new_factura_xml,row.dec_new_factura_xml.name);
      }

      if (row.dec_new_factura_pdf) {
        formData.append(`decfec_partida[${index}][dec_new_factura_pdf]`,row.dec_new_factura_pdf,row.dec_new_factura_pdf.name);
      }
    });
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_carga_cfdis',formData).pipe(
      catchError(this.handlerError)
    );
  }

  deleteDeclaracionImpFed(declaracion_token:string):Observable<any>{
    let data = {"declaracion_token":declaracion_token};
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_delete',data)
    .pipe(catchError(this.handlerError));
  }

  catDeclaracionesDeleted():Observable<any>{
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_deleted_catalogo',null)
    .pipe(catchError(this.handlerError));
  }

  restaurarDeclaracionImpFed(declaracion_token:string):Observable<any>{
    let data = {"declaracion_token":declaracion_token};
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_restaurar',data)
    .pipe(catchError(this.handlerError));
  }

  deletePermDeclaracionImpFed(declaracion_token:string):Observable<any>{
    let data = {"declaracion_token":declaracion_token};
    return this.httpcliente.post(this.url+'contabilidad_declaraciones_imp_federales_delete_perm',data)
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
