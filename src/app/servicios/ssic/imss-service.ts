import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { aportacionesIMSSModelo } from '../../modelos/aportacionesIMSSModelo';

@Injectable({
  providedIn: 'root'
})
export class ImssService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }
  
  private agregaSiExiste(formData: FormData, key: string, value: any) {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  }

  registra_aportacion_seg_social(modelIMSSAport:aportacionesIMSSModelo,desglose_total_cuotas:any,documentos_evidencia:any):Observable<any>{
    const dataFormIMSS = new FormData();
    dataFormIMSS.append("fecha_contabilizacion",modelIMSSAport.fecha_contabilizacion);
    dataFormIMSS.append("fecha_presentacion",modelIMSSAport.fecha_presentacion);
    dataFormIMSS.append("registro_patronal",modelIMSSAport.registro_patronal);

    this.agregaSiExiste(dataFormIMSS,"periodo_pago_seguros_imss_anio",modelIMSSAport.periodo_pago_seguros_imss_anio);
    //dataFormIMSS.append("periodo_pago_seguros_imss_anio",modelIMSSAport.periodo_pago_seguros_imss_anio);

    this.agregaSiExiste(dataFormIMSS,"periodo_pago_seguros_imss_mes",modelIMSSAport.periodo_pago_seguros_imss_mes);
    //dataFormIMSS.append("periodo_pago_seguros_imss_mes",modelIMSSAport.periodo_pago_seguros_imss_mes);

    this.agregaSiExiste(dataFormIMSS,"pago_rcv_infonavit_inicio",modelIMSSAport.pago_rcv_infonavit_inicio);
    //dataFormIMSS.append("pago_rcv_infonavit_inicio",modelIMSSAport.pago_rcv_infonavit_inicio);

    this.agregaSiExiste(dataFormIMSS,"pago_rcv_infonavit_fin",modelIMSSAport.pago_rcv_infonavit_fin);
    //dataFormIMSS.append("pago_rcv_infonavit_fin",modelIMSSAport.pago_rcv_infonavit_fin);
    
    dataFormIMSS.append("folio_sua",modelIMSSAport.folio_sua); 
    dataFormIMSS.append("clave_recepcion_archivo_pago",modelIMSSAport.clave_recepcion_archivo_pago); 
    dataFormIMSS.append("propuesta_fecha_limite_pago",modelIMSSAport.propuesta_fecha_limite_pago); 
    dataFormIMSS.append("linea_captura_sipare",modelIMSSAport.linea_captura_sipare); 
    dataFormIMSS.append("propuesta_s_m_g_d_f",modelIMSSAport.propuesta_s_m_g_d_f); 
    dataFormIMSS.append("propuesta_fecha_salario_minimo_pago",modelIMSSAport.propuesta_fecha_salario_minimo_pago); 
    dataFormIMSS.append("propuesta_valor_uma",modelIMSSAport.propuesta_valor_uma); 
    dataFormIMSS.append("propuesta_num_de_cotizantes",modelIMSSAport.propuesta_num_de_cotizantes); 
    dataFormIMSS.append("propuesta_num_dias_a_cotizar",modelIMSSAport.propuesta_num_dias_a_cotizar); 
    dataFormIMSS.append("propuesta_num_de_acreditados",modelIMSSAport.propuesta_num_de_acreditados);
    dataFormIMSS.append("desglose_total_cuotas", JSON.stringify(desglose_total_cuotas)); 
    dataFormIMSS.append("observaciones",modelIMSSAport.observaciones);
    for (var i = 0; i < documentos_evidencia.length; i++) {
      dataFormIMSS.append("documentos_evidencia[]", documentos_evidencia[i]);
    }
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_registro',dataFormIMSS).pipe(
      catchError(this.handlerError)
    );
  }

  catalogo_aportaciones_seg_social(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_reportes',data)
    .pipe(catchError(this.handlerError));
  }

  aportSSocialSeguimientoOrdenPago(aport_ssocial_token:any,aport_ssocial_ord_pago_token:any): Observable<any>{
    let data = {"aport_ssocial_token":aport_ssocial_token,"aport_ssocial_ord_pago_token":aport_ssocial_ord_pago_token};
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_seguimiento_pagos',data)
    .pipe(catchError(this.handlerError));
  }

  desglose_aportacion_seg_social(aport_ssocial_token:any): Observable<any>{
    let data = {"aport_ssocial_token":aport_ssocial_token};
    console.log(data);
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_desglose',data)
    .pipe(catchError(this.handlerError));
  }

  actualiza_aportacion_seg_social(aport_ssocial_token:any,modelIMSSAport:aportacionesIMSSModelo,desglose_total_cuotas:any,docs_eliminar:any,documentos_evidencia:any):Observable<any>{
    const dataFormIMSS = new FormData();
    dataFormIMSS.append("aport_ssocial_token",aport_ssocial_token);
    dataFormIMSS.append("fecha_contabilizacion",modelIMSSAport.fecha_contabilizacion);
    dataFormIMSS.append("fecha_presentacion",modelIMSSAport.fecha_presentacion);
    dataFormIMSS.append("registro_patronal",modelIMSSAport.registro_patronal);

    this.agregaSiExiste(dataFormIMSS,"periodo_pago_seguros_imss_anio",modelIMSSAport.periodo_pago_seguros_imss_anio); 
    this.agregaSiExiste(dataFormIMSS,"periodo_pago_seguros_imss_mes",modelIMSSAport.periodo_pago_seguros_imss_mes);
    this.agregaSiExiste(dataFormIMSS,"pago_rcv_infonavit_inicio",modelIMSSAport.pago_rcv_infonavit_inicio);
    this.agregaSiExiste(dataFormIMSS,"pago_rcv_infonavit_fin",modelIMSSAport.pago_rcv_infonavit_fin);

    dataFormIMSS.append("folio_sua",modelIMSSAport.folio_sua); 
    dataFormIMSS.append("clave_recepcion_archivo_pago",modelIMSSAport.clave_recepcion_archivo_pago); 
    dataFormIMSS.append("propuesta_fecha_limite_pago",modelIMSSAport.propuesta_fecha_limite_pago); 
    dataFormIMSS.append("linea_captura_sipare",modelIMSSAport.linea_captura_sipare); 
    dataFormIMSS.append("propuesta_s_m_g_d_f",modelIMSSAport.propuesta_s_m_g_d_f); 
    dataFormIMSS.append("propuesta_fecha_salario_minimo_pago",modelIMSSAport.propuesta_fecha_salario_minimo_pago); 
    dataFormIMSS.append("propuesta_valor_uma",modelIMSSAport.propuesta_valor_uma); 
    dataFormIMSS.append("propuesta_num_de_cotizantes",modelIMSSAport.propuesta_num_de_cotizantes); 
    dataFormIMSS.append("propuesta_num_dias_a_cotizar",modelIMSSAport.propuesta_num_dias_a_cotizar); 
    dataFormIMSS.append("propuesta_num_de_acreditados",modelIMSSAport.propuesta_num_de_acreditados);
    dataFormIMSS.append("desglose_total_cuotas",JSON.stringify(desglose_total_cuotas)); 
    dataFormIMSS.append("observaciones",modelIMSSAport.observaciones);
    if (docs_eliminar) {
      docs_eliminar.forEach((doc:any, i:any) => {
        dataFormIMSS.append(`docs_eliminar[${i}][token_documento]`, doc.token_documento);
        dataFormIMSS.append(`docs_eliminar[${i}][name_documento]`, doc.name_documento);
      });
    }

    for (var i = 0; i < documentos_evidencia.length; i++) {
      dataFormIMSS.append("documentos_evidencia[]", documentos_evidencia[i]);
    }
    //let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_actualizar',dataFormIMSS).pipe(
      catchError(this.handlerError)
    );
  }

  carga_cfdi_aportacion_seg_social(aport_ssocial_token:any,imss:any): Observable<any>{
    const formData = new FormData();
    formData.append("aport_ssocial_token",aport_ssocial_token);
    
    imss.forEach((row:any,index:number) => {
      Object.keys(row).forEach((key:any) => {
        if (["aport_ssocial_fact_new_xml","aport_ssocial_fact_new_pdf"].includes(key)) return;
        const cadenas = row[key];
        if (typeof cadenas === 'object') {
          formData.append(`imss[${index}][${key}]`,JSON.stringify(cadenas));
        } else {
          formData.append(`imss[${index}][${key}]`,cadenas);
        } 
      });

      if (row.aport_ssocial_fact_new_xml) {
        formData.append(`imss[${index}][aport_ssocial_fact_new_xml]`,row.aport_ssocial_fact_new_xml,row.aport_ssocial_fact_new_xml.name);
      }

      if (row.aport_ssocial_fact_new_pdf) {
        formData.append(`imss[${index}][aport_ssocial_fact_new_pdf]`,row.aport_ssocial_fact_new_pdf,row.aport_ssocial_fact_new_pdf.name);
      }
    });
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_carga_cfdi',formData).pipe(
      catchError(this.handlerError)
    );
  }

  carga_cfdi_aportacion_infonavit(aport_ssocial_token:any,infonavit:any): Observable<any>{
    const formData = new FormData();
    formData.append("aport_ssocial_token",aport_ssocial_token);
    
    infonavit.forEach((row:any,index:number) => {
      Object.keys(row).forEach((key:any) => {
        if (["aport_infonavit_fact_new_xml","aport_infonavit_fact_new_pdf"].includes(key)) return;
        const cadenas = row[key];
        if (typeof cadenas === 'object') {
          formData.append(`infonavit[${index}][${key}]`,JSON.stringify(cadenas));
        } else {
          formData.append(`infonavit[${index}][${key}]`,cadenas);
        } 
      });

      if (row.aport_infonavit_fact_new_xml) {
        formData.append(`infonavit[${index}][aport_infonavit_fact_new_xml]`,row.aport_infonavit_fact_new_xml,row.aport_infonavit_fact_new_xml.name);
      }

      if (row.aport_infonavit_fact_new_pdf) {
        formData.append(`infonavit[${index}][aport_infonavit_fact_new_pdf]`,row.aport_infonavit_fact_new_pdf,row.aport_infonavit_fact_new_pdf.name);
      }
    });
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_infonavit_carga_cfdi',formData).pipe(
      catchError(this.handlerError)
    );
  }

  eliminar_aportacion_seg_social(aport_ssocial_token:string): Observable<any>{
    let data = {"aport_ssocial_token":aport_ssocial_token};
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_eliminar',data)
    .pipe(catchError(this.handlerError));
  }

  catalogo_deleted_aportaciones_seg_social(): Observable<any>{
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_reportes_eliminados',null)
    .pipe(catchError(this.handlerError));
  }

  restaurar_aportacion_seg_social(aport_ssocial_token:string): Observable<any>{
    let data = {"aport_ssocial_token":aport_ssocial_token};
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_restaurar',data)
    .pipe(catchError(this.handlerError));
  }

  eliminacion_permanente_aportacion_seg_social(aport_ssocial_token:string): Observable<any>{
    let data = {"aport_ssocial_token":aport_ssocial_token};
    return this.httpcliente.post(this.url+'valor_humano_aportaciones_seguridad_social_eliminacion_permanente',data)
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
