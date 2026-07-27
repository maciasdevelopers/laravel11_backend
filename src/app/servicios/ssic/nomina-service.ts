import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { nominaImpuestoModelo } from '../../modelos/nominas/nominaImpuestoModelo';

@Injectable({
  providedIn: 'root'
})
export class NominaService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  catalogo_reportes_nomina(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_reportes',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  nominaEfectivoSeguimientoOrdenPago(token_nominas_periodos:any,nomina_efectivo_ord_pago_token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_nominas_periodos":token_nominas_periodos,"nomina_efectivo_ord_pago_token":nomina_efectivo_ord_pago_token});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_efectivo_seguimiento_pagos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  nominaEspecieSeguimientoOrdenPago(token_nominas_periodos:any,nomina_especie_ord_pago_token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_nominas_periodos":token_nominas_periodos,"nomina_especie_ord_pago_token":nomina_especie_ord_pago_token});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_especie_seguimiento_pagos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  nominaDesgloseDispersion(token_nominas_periodos:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_nominas_periodos":token_nominas_periodos});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_desglose_dispersion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoNominaEliminar(token_nominas_periodos:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_nominas_periodos":token_nominas_periodos});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_eliminar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogo_reportes_eliminados_nomina(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_reportes_eliminados',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoNominaRestaurar(token_nominas_periodos:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_nominas_periodos":token_nominas_periodos});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_restaurar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoNominaEliminacionPermanente(token_nominas_periodos:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_nominas_periodos":token_nominas_periodos});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_eliminacion_permanente',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  carga_cfdi_nominas(token_nominas_periodos:any,nomina_reportada:any): Observable<any>{
    const formData = new FormData();
    formData.append("user_token",sessionStorage.getItem('inside_session_code') || '');
    formData.append("token_nominas_periodos",token_nominas_periodos);
    
    nomina_reportada.forEach((row:any,index:number) => {
      Object.keys(row).forEach((key:any) => {
        if (["nomina_factura_xml","nomina_factura_pdf"].includes(key)) return;
        const cadenas = row[key];
        if (typeof cadenas === 'object') {
          formData.append(`nomina_reportada[${index}][${key}]`,JSON.stringify(cadenas));
        } else {
          formData.append(`nomina_reportada[${index}][${key}]`,cadenas);
        } 
      });

      if (row.nomina_factura_xml) {
        formData.append(`nomina_reportada[${index}][nomina_factura_xml]`,row.nomina_factura_xml,row.nomina_factura_xml.name);
      }

      if (row.nomina_factura_pdf) {
        formData.append(`nomina_reportada[${index}][nomina_factura_pdf]`,row.nomina_factura_pdf,row.nomina_factura_pdf.name);
      }
    });
    return this.httpcliente.post(this.url+'valor_humano_nomina_carga_cfdi',formData).pipe(
      catchError(this.handlerError)
    );
  }

  registra_reporte_nomina(numero_de_nomina:any,fecha_contabilizacion:any,nomina_observacion:any,nomina_reportada:any,nomina_en_especie:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "numero_de_nomina":numero_de_nomina,
      //"registro_patronal":registro_patronal,
      //"nomina_periodicidad":nomina_periodicidad,
      //"periodo_inicio":periodo_inicio,
      //"periodo_fin":periodo_fin,
      //"nomina_moneda":nomina_moneda,
      "fecha_contabilizacion":fecha_contabilizacion,
      "nomina_observacion":nomina_observacion,
      "nomina_reportada":nomina_reportada,
      "nomina_en_especie":nomina_en_especie
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_nomina_genera_registro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

//ISN
  registra_impuesto_sobre_nomina(modelNominaImp:nominaImpuestoModelo,documentos_evidencia:any):Observable<any>{
    const formDataPago = new FormData();
    formDataPago.append("fecha_contabilizacion",modelNominaImp.fecha_contabilizacion); 
    formDataPago.append("fecha_vencimiento",modelNominaImp.fecha_vencimiento);
    formDataPago.append("fecha_presentacion",modelNominaImp.fecha_presentacion);
    formDataPago.append("estado",modelNominaImp.estado); 
    formDataPago.append("ejercicio",modelNominaImp.ejercicio);
    formDataPago.append("periodo_inicio",modelNominaImp.periodo_inicio);
    formDataPago.append("periodo_fin",modelNominaImp.periodo_fin);
    formDataPago.append("tipo_declaracion",modelNominaImp.tipo_declaracion); 
    formDataPago.append("moneda",modelNominaImp.moneda); 
    formDataPago.append("moneda_decimales",modelNominaImp.moneda_decimales.toString()); 
    formDataPago.append("total_remuneraciones_erogadas",modelNominaImp.total_remuneraciones_erogadas.toString()); 
    formDataPago.append("porcent_sobre_total_remuneraciones_erogadas",modelNominaImp.porcent_sobre_total_remuneraciones_erogadas.toString()); 
    formDataPago.append("complementarias_impuesto_a_cargo",modelNominaImp.complementarias_impuesto_a_cargo.toString()); 
    formDataPago.append("complementarias_saldo_a_favor",modelNominaImp.complementarias_saldo_a_favor.toString()); 
    formDataPago.append("impuesto_actualizado",modelNominaImp.impuesto_actualizado.toString()); 
    formDataPago.append("impuesto_descuento",modelNominaImp.impuesto_descuento); 
    formDataPago.append("impuesto_recargos",modelNominaImp.impuesto_recargos.toString()); 
    formDataPago.append("impuesto_recargos_condonados",modelNominaImp.impuesto_recargos_condonados.toString()); 
    formDataPago.append("subsi_n_resolu_impuesto_pagar",modelNominaImp.subsi_n_resolu_impuesto_pagar.toString()); 
    formDataPago.append("subsi_n_resolu_recargos",modelNominaImp.subsi_n_resolu_recargos.toString()); 
    formDataPago.append("compensa_n_resolucion",modelNominaImp.compensa_n_resolucion.toString()); 
    formDataPago.append("compensa_n_resolu_recargos",modelNominaImp.compensa_n_resolu_recargos.toString()); 
    formDataPago.append("impuesto_total_a_pagar",modelNominaImp.impuesto_total_a_pagar.toString()); 
    formDataPago.append("impuesto_saldo_a_favor",modelNominaImp.impuesto_saldo_a_favor.toString()); 
    formDataPago.append("observaciones",modelNominaImp.observaciones); 
    for (var i = 0; i < documentos_evidencia.length; i++) {
      formDataPago.append("documentos_evidencia[]", documentos_evidencia[i]);
    }
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_registro',formDataPago).pipe(
      catchError(this.handlerError)
    );
  }

  catalogo_impuesto_sobre_nomina(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_reportes',data).pipe(
      catchError(this.handlerError)
    );
  }

  isnSeguimientoOrdenPago(nomi_imp_token:any,nomi_imp_ord_pago_token:any): Observable<any>{
    let data = {"nomi_imp_token":nomi_imp_token,"nomi_imp_ord_pago_token":nomi_imp_ord_pago_token};
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_seguimiento_pagos',data)
    .pipe(catchError(this.handlerError));
  }

  desglose_impuesto_sobre_nomina(nomi_imp_token:string): Observable<any>{
    let data = {"nomi_imp_token":nomi_imp_token};
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_desglose',data)
    .pipe(catchError(this.handlerError));
  }
  
  actualiza_impuesto_sobre_nomina(nomi_imp_token:string,modelNominaImp:nominaImpuestoModelo,docs_eliminar:any,documentos_evidencia:any):Observable<any>{
    const formDataPago = new FormData();
    formDataPago.append("nomi_imp_token",nomi_imp_token);
    formDataPago.append("fecha_contabilizacion",modelNominaImp.fecha_contabilizacion); 
    formDataPago.append("fecha_vencimiento",modelNominaImp.fecha_vencimiento);
    formDataPago.append("fecha_presentacion",modelNominaImp.fecha_presentacion);
    formDataPago.append("estado",modelNominaImp.estado);
    formDataPago.append("ejercicio",modelNominaImp.ejercicio);
    formDataPago.append("periodo_inicio",modelNominaImp.periodo_inicio);
    formDataPago.append("periodo_fin",modelNominaImp.periodo_fin);
    formDataPago.append("tipo_declaracion",modelNominaImp.tipo_declaracion); 
    formDataPago.append("moneda",modelNominaImp.moneda);
    formDataPago.append("moneda_decimales",modelNominaImp.moneda_decimales.toString()); 
    formDataPago.append("total_remuneraciones_erogadas",modelNominaImp.total_remuneraciones_erogadas.toString()); 
    formDataPago.append("porcent_sobre_total_remuneraciones_erogadas",modelNominaImp.porcent_sobre_total_remuneraciones_erogadas.toString()); 
    formDataPago.append("complementarias_impuesto_a_cargo",modelNominaImp.complementarias_impuesto_a_cargo.toString()); 
    formDataPago.append("complementarias_saldo_a_favor",modelNominaImp.complementarias_saldo_a_favor.toString()); 
    formDataPago.append("impuesto_actualizado",modelNominaImp.impuesto_actualizado.toString()); 
    formDataPago.append("impuesto_descuento",modelNominaImp.impuesto_descuento); 
    formDataPago.append("impuesto_recargos",modelNominaImp.impuesto_recargos.toString()); 
    formDataPago.append("impuesto_recargos_condonados",modelNominaImp.impuesto_recargos_condonados.toString()); 
    formDataPago.append("subsi_n_resolu_impuesto_pagar",modelNominaImp.subsi_n_resolu_impuesto_pagar.toString()); 
    formDataPago.append("subsi_n_resolu_recargos",modelNominaImp.subsi_n_resolu_recargos.toString()); 
    formDataPago.append("compensa_n_resolucion",modelNominaImp.compensa_n_resolucion.toString()); 
    formDataPago.append("compensa_n_resolu_recargos",modelNominaImp.compensa_n_resolu_recargos.toString()); 
    formDataPago.append("impuesto_total_a_pagar",modelNominaImp.impuesto_total_a_pagar.toString()); 
    formDataPago.append("impuesto_saldo_a_favor",modelNominaImp.impuesto_saldo_a_favor.toString()); 
    formDataPago.append("observaciones",modelNominaImp.observaciones);
    formDataPago.append("docs_eliminar",docs_eliminar);
    for (var i = 0; i < documentos_evidencia.length; i++) {
      formDataPago.append("documentos_evidencia[]", documentos_evidencia[i]);
    }
    //let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_actualizar',formDataPago).pipe(
      catchError(this.handlerError)
    );
  }

  carga_cfdi_isn(nomi_imp_token:any,isn:any): Observable<any>{
    const formData = new FormData();
    formData.append("nomi_imp_token",nomi_imp_token);
    
    isn.forEach((row:any,index:number) => {
      Object.keys(row).forEach((key:any) => {
        if (["nomi_imp_factura_xml","nomi_imp_factura_pdf"].includes(key)) return;
        const cadenas = row[key];
        if (typeof cadenas === 'object') {
          formData.append(`isn[${index}][${key}]`,JSON.stringify(cadenas));
        } else {
          formData.append(`isn[${index}][${key}]`,cadenas);
        } 
      });

      if (row.nomi_imp_factura_xml) {
        formData.append(`isn[${index}][nomi_imp_factura_xml]`,row.nomi_imp_factura_xml,row.nomi_imp_factura_xml.name);
      }

      if (row.nomi_imp_factura_pdf) {
        formData.append(`isn[${index}][nomi_imp_factura_pdf]`,row.nomi_imp_factura_pdf,row.nomi_imp_factura_pdf.name);
      }
    });
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_carga_cfdi',formData).pipe(
      catchError(this.handlerError)
    );
  }

  eliminar_impuesto_sobre_nomina(nomi_imp_token:string): Observable<any>{
    let data = {"nomi_imp_token":nomi_imp_token};
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_eliminar',data)
    .pipe(catchError(this.handlerError));
  }

  catalogo_deleted_impuesto_sobre_nomina(): Observable<any>{
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_reportes_eliminados',null)
    .pipe(catchError(this.handlerError));
  }

  restaurar_impuesto_sobre_nomina(nomi_imp_token:string): Observable<any>{
    let data = {"nomi_imp_token":nomi_imp_token};
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_restaurar',data)
    .pipe(catchError(this.handlerError));
  }

  eliminacion_permanente_impuesto_sobre_nomina(nomi_imp_token:string): Observable<any>{
    let data = {"nomi_imp_token":nomi_imp_token};
    return this.httpcliente.post(this.url+'valor_humano_impuesto_sobre_nomina_eliminacion_permanente',data)
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
