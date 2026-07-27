import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { asimiladosModelo } from '../../modelos/asimiladosModelo';

@Injectable({
  providedIn: 'root'
})
export class AsimiladosService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  registra_reporte_asimilados(
    imagenEvidenciaXMl:File,
    imagenEvidenciaPdf:File,
    fecha_contabilizacion:any,
    asimilado:any,
    desglose:asimiladosModelo,
    observaciones:any,
    documentos_evidencia:any,

    dataCFDI_comprobante_obj:any,
    dataCFDIRelacionados_obj:any,
    dataCFDIEmisor_obj:any,
    dataCFDIReceptor_obj:any,
    dataCFDI_conceptos:any,
    dataCFDIComplemento_obj:any,
    dataCFDIComplementoNomina_obj:any,
    dataCFDIComplementoNominaReceptor_obj:any,
    dataCFDIComplementoNominaPercepciones_obj:any,
    dataCFDIComplementoNominaPercepcion_obj:any,
    dataCFDIComplementoNominaDeducciones_obj:any,
    dataCFDIComplementoNominaDeduccion_obj:any,

  ): Observable<any>{
    const formDataAsim = new FormData();

    imagenEvidenciaXMl ? formDataAsim.append('imagenEvidenciaXMl',imagenEvidenciaXMl,imagenEvidenciaXMl.name) : formDataAsim.append('imagenEvidenciaXMl','');
    imagenEvidenciaPdf ? formDataAsim.append('imagenEvidenciaPdf',imagenEvidenciaPdf,imagenEvidenciaPdf.name) : formDataAsim.append('imagenEvidenciaPdf','');

    formDataAsim.append("fecha_contabilizacion",fecha_contabilizacion); 
    formDataAsim.append("asimilado",asimilado);
    formDataAsim.append("periodo_inicio",desglose.periodo_inicio);
    formDataAsim.append("periodo_fin",desglose.periodo_fin);
    formDataAsim.append("fecha_pago",desglose.fecha_pago);
    formDataAsim.append("moneda_code",desglose.moneda_code);
    formDataAsim.append("dias_pagados",desglose.dias_pagados);
    formDataAsim.append("total_percepciones",desglose.total_percepciones.toString());
    formDataAsim.append("percepciones_servicio",desglose.percepciones_servicio_token);
    formDataAsim.append("total_deducciones",desglose.total_deducciones.toString());
    formDataAsim.append("deducciones_impuesto",desglose.deducciones_impuesto_token);
    formDataAsim.append("observaciones",observaciones);

    for (var i = 0; i < documentos_evidencia.length; i++) {
      formDataAsim.append("documentos_evidencia[]", documentos_evidencia[i]);
    }

    formDataAsim.append("dataCFDI_comprobante_obj",JSON.stringify(dataCFDI_comprobante_obj));
    formDataAsim.append("dataCFDIRelacionados_obj",JSON.stringify(dataCFDIRelacionados_obj));
    formDataAsim.append("dataCFDIEmisor_obj",JSON.stringify(dataCFDIEmisor_obj));
    formDataAsim.append("dataCFDIReceptor_obj",JSON.stringify(dataCFDIReceptor_obj));
    formDataAsim.append("dataCFDI_conceptos",JSON.stringify(dataCFDI_conceptos));
    formDataAsim.append("dataCFDIComplemento_obj",JSON.stringify(dataCFDIComplemento_obj));
    formDataAsim.append("dataCFDIComplementoNomina_obj",JSON.stringify(dataCFDIComplementoNomina_obj));
    formDataAsim.append("dataCFDIComplementoNominaReceptor_obj",JSON.stringify(dataCFDIComplementoNominaReceptor_obj));
    formDataAsim.append("dataCFDIComplementoNominaPercepciones_obj",JSON.stringify(dataCFDIComplementoNominaPercepciones_obj));
    formDataAsim.append("dataCFDIComplementoNominaPercepcion_obj",JSON.stringify(dataCFDIComplementoNominaPercepcion_obj));
    formDataAsim.append("dataCFDIComplementoNominaDeducciones_obj",JSON.stringify(dataCFDIComplementoNominaDeducciones_obj));
    formDataAsim.append("dataCFDIComplementoNominaDeduccion_obj",JSON.stringify(dataCFDIComplementoNominaDeduccion_obj));

    return this.httpcliente.post(this.url+'valor_humano_asimilados_genera_registro',formDataAsim)
    .pipe(catchError(this.handlerError));
  }

  catalogo_reportes_asimilados(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'valor_humano_asimilados_reportes',data)
    .pipe(catchError(this.handlerError));
  }

  asimiladosSeguimientoOrdenPago(token_reporte_asim:any,asim_ord_pago_token:any): Observable<any>{
    let data = {"token_reporte_asim":token_reporte_asim,"asim_ord_pago_token":asim_ord_pago_token};
    return this.httpcliente.post(this.url+'valor_humano_asimilados_seguimiento_pagos',data)
    .pipe(catchError(this.handlerError));
  }

  asimiladosDesglose(token_reporte_asim:any): Observable<any>{
    let data = {"token_reporte_asim":token_reporte_asim};
    return this.httpcliente.post(this.url+'valor_humano_asimilados_desglose',data)
    .pipe(catchError(this.handlerError));
  }

  asimiladosUpdate(token_reporte_asim:any,desglose:asimiladosModelo,observaciones:any): Observable<any>{
    let data = {
      "token_reporte_asim":token_reporte_asim,
      "percepciones_servicio":desglose.percepciones_servicio_token,
      "deducciones_impuesto":desglose.deducciones_impuesto_token,
      "observaciones":observaciones
    };
    return this.httpcliente.post(this.url+'valor_humano_asimilados_actualizar',data)
    .pipe(catchError(this.handlerError));
  }
  
  valorHumanoAsimiladosEliminar(token_reporte_asim:any): Observable<any>{
    let data = {"token_reporte_asim":token_reporte_asim};
    return this.httpcliente.post(this.url+'valor_humano_asimilados_eliminar',data)
    .pipe(catchError(this.handlerError));
  }

  catalogo_reportes_deleted_asimilados(): Observable<any>{
    return this.httpcliente.post(this.url+'valor_humano_asimilados_reportes_eliminados',null)
    .pipe(catchError(this.handlerError));
  }

  valorHumanoAsimiladoRestaurar(token_reporte_asim:any): Observable<any>{
    let data = {"token_reporte_asim":token_reporte_asim};
    return this.httpcliente.post(this.url+'valor_humano_asimilados_restaurar',data)
    .pipe(catchError(this.handlerError));
  }

  valorHumanoAsimiladosPermEliminar(token_reporte_asim:any): Observable<any>{
    let data = {"token_reporte_asim":token_reporte_asim};
    return this.httpcliente.post(this.url+'valor_humano_asimilados_eliminacion_permanente',data)
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
