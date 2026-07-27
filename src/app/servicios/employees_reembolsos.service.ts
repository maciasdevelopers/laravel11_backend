import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../modelos/Usuarios';
import { global } from './global_ssic';
import { reemNewFaseUnoModelo } from '../modelos/reembolsos/reemNewFaseUnoModelo';
import { reemNewFaseDosModelo } from '../modelos/reembolsos/reemNewFaseDosModelo';
import { reemNewFaseDosCFDIModelo } from '../modelos/reembolsos/reemNewFaseDosCFDIModelo';

@Injectable({
  providedIn: 'root'
})
export class ReembolsosService {
  public url: string;
  public identif: any;
  public token: any;
  public parsed: any;
  public user:any;

  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(public _http: HttpClient) {
    this.url = global.urlApi;
    this.user = sessionStorage.getItem('inside_session_code');
  }

  list_reembolsos_true() :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_lista',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  list_reembolsos_two() :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_lista_deleted',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_deshabilitar(token_reem:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_reem":token_reem});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_deshabilitar',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_rehabilitar(token_reem:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_reem":token_reem});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_rehabilitar',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolso_detalle(token_reem:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_reem":token_reem});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_detalle',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reembolsos_load_xml_fact(token_reem:any,partida:any,factura_xml:any,newFaseDOS:reemNewFaseDosCFDIModelo) :Observable<any>{
    const formDataReem = new FormData();
    var json_convert = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,
      "tkn_solicitud":partida,
      "proveedor_tkn":newFaseDOS.dataCFDI_emisor_Token,
      "dataCFDI_comprobante":newFaseDOS.dataCFDI_comprobante,
      "dataCFDIRelacionados":newFaseDOS.dataCFDIRelacionados,
      "dataCFDIEmisor":newFaseDOS.dataCFDIEmisor,
      "dataCFDIReceptor":newFaseDOS.dataCFDIReceptor,
      "dataCFDI_conceptos":newFaseDOS.dataCFDI_conceptos,
      "dataCFDI_impuestos_retenidos_lista":newFaseDOS.dataCFDI_impuestos_retenidos_lista,
      "dataCFDI_impuestos_trasladados_lista":newFaseDOS.dataCFDI_impuestos_trasladados_lista,
      "dataCFDIComplemento":newFaseDOS.dataCFDIComplemento
    });
    
    formDataReem.append("factura_xml", factura_xml);
    formDataReem.append("json",json_convert);
    console.log(json_convert);
    return this._http.post(this.url+'reembolso_load_xml_fact',formDataReem).pipe(
      catchError(this.handlerError)
    );
  }

  reembolsos_load_pdf_fact(token_reem:any,partida:any,factura_pdf:any) :Observable<any>{
    const formDataReem = new FormData();
    var json_convert = JSON.stringify({  
      "user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":token_reem,
      "tkn_solicitud":partida
    });
    
    formDataReem.append("factura_pdf", factura_pdf);
    formDataReem.append("json",json_convert);
    console.log(json_convert);
    return this._http.post(this.url+'reembolso_load_pdf_fact',formDataReem).pipe(
      catchError(this.handlerError)
    );
  }

  reembolsos_load_anexos_docs(docsReemAnexos:any,reemAnexosNames:any,token_reem:any,partida:any) :Observable<any>{
    console.log(docsReemAnexos);
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"tokenReembolso":token_reem,"tkn_solicitud":partida,"reemAnexosNames":reemAnexosNames});
    console.log(json);

    const formData = new FormData();
    for (var i = 0; i < docsReemAnexos.length; i++) {
      formData.append("docsReemAnexos[]", docsReemAnexos[i]);
    }
    formData.append('solicitud',json);
    console.log(formData);
    return this._http.post(this.url+'reembolso_load_docs',formData).pipe(
      catchError(this.handlerError)
    );
  }

  delete_reembolso_docs(tokenReembolso:any,tkn_solicitud:any,token_docs:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
    "tokenReembolso":tokenReembolso,"tkn_solicitud":tkn_solicitud,"token_docs":token_docs});
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_delete_docs',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  update_reembolso(tokenReembolso:any,tkn_solicitud:any,fecha_gasto:any,ticket_gasto:any,pagado_a:any,
    tkn_proveedor:any,forma_pago:any,importe_requerido:any,reem_moneda_tkn:any,reem_tipo_cambio_string:any,motivo_reem:any) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":tokenReembolso,
      "tkn_solicitud":tkn_solicitud,
      "fecha_gasto":fecha_gasto,
      "ticket_gasto":ticket_gasto,
      "pagado_a":pagado_a,
      "tkn_proveedor":tkn_proveedor,
      "forma_pago":forma_pago,
      "importe_requerido":importe_requerido,
      "reem_moneda_tkn":reem_moneda_tkn,
      "reem_tipo_cambio_string":reem_tipo_cambio_string,
      "motivo_reem":motivo_reem
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_update',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  agrega_new_reembolso(docsReemAnexos:any,tokenReembolso:any,fecha_gasto:any,ticket_gasto:any,pagado_a:any,
    tkn_proveedor:any,forma_pago:any,importe_requerido:any,motivo_reem:any) :Observable<any>{
    console.log(docsReemAnexos);
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "tokenReembolso":tokenReembolso,
      "fecha_gasto":fecha_gasto,
      "ticket_gasto":ticket_gasto,
      "pagado_a":pagado_a,
      "tkn_proveedor":tkn_proveedor,
      "forma_pago":forma_pago,
      "importe_requerido":importe_requerido,
      "motivo_reem":motivo_reem
    });
    console.log(json);

    const formData = new FormData();
    for (var i = 0; i < docsReemAnexos.length; i++) {
      formData.append("docsReemAnexos[]", docsReemAnexos[i]);
    }
    formData.append('solicitud',json);
    console.log(formData);
    return this._http.post(this.url+'reembolso_add_new',formData).pipe(
      catchError(this.handlerError)
    );
  }

  save_reembolsos(reembolsos:any,arrayComisionesSelected:any,tiempo_respuesta_reem_comi:any,/*habilita_reembolsos:any,*/acreedor:any) :Observable<any>{
    const formData = new FormData();
    formData.append("user_token",sessionStorage.getItem('inside_session_code') || '');
    formData.append("comisiones",JSON.stringify(arrayComisionesSelected));
    formData.append("tiempo_respuesta_reem_comi",tiempo_respuesta_reem_comi);
    //formData.append("habilita_reembolsos",habilita_reembolsos);
    formData.append("acreedor",acreedor);
    reembolsos.forEach((row:any,index:number) => {
      Object.keys(row).forEach((key:any) => {
        if (["factura_xml","factura_pdf","reembolsos_anexos"].includes(key)) return;
        const cadenas = row[key];
        if (typeof cadenas === 'object') {
          formData.append(`reembolsos[${index}][${key}]`,JSON.stringify(cadenas));
        } else {
          formData.append(`reembolsos[${index}][${key}]`,cadenas);
        } 
      });

      if (row.factura_xml) {
        formData.append(`reembolsos[${index}][factura_xml]`,row.factura_xml,row.factura_xml.name);
      }

      if (row.factura_pdf) {
        formData.append(`reembolsos[${index}][factura_pdf]`,row.factura_pdf,row.factura_pdf.name);
      }

      if (row.reembolsos_anexos) {
        row.reembolsos_anexos.forEach((file:File,i:number) => {
          formData.append(`reembolsos[${index}][reembolsos_anexos][${i}]`,file,file.name);
        });
      }
      //"factura_xml":this.imagenEvidenciaXml,
      //"dataCFDI_comprobante":this.dataCFDI_comprobante,
      //"dataCFDIRelacionados":this.dataCFDIRelacionados,
      //"dataCFDIEmisor":this.dataCFDIEmisor,
      //"dataCFDIReceptor":this.dataCFDIReceptor,
      //"dataCFDI_conceptos":this.dataCFDI_conceptos,
      //"dataCFDI_impuestos_retenidos_lista":this.dataCFDI_impuestos_retenidos_lista,
      //"dataCFDI_impuestos_trasladados_lista":this.dataCFDI_impuestos_trasladados_lista,
      //"dataCFDIComplemento":this.dataCFDIComplemento,
      //"factura_pdf":this.imagenEvidenciaPdf,
      //"reembolsos_anexos":this.imagenAnexosReem,
    });
    return this._http.post(this.url+'reembolso_registro',formData).pipe(
      catchError(this.handlerError)
    );
  }

  save_reembolsos_fase_uno(newFaseUNO: reemNewFaseUnoModelo) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "acreedor":newFaseUNO.usuario_acreedor_token,
      "comisiones":newFaseUNO.comisionesSelected,
      "tiempo_respuesta_reem_comi":newFaseUNO.tiempo_respuesta_reem_comi,
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_registro_fase_uno',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  save_reembolsos_fase_dos(
    token_reembolso_main:string,
    autorizacion_vh:any,
    autorizacion_egr:any,
    tiempo_respuesta_autorizacion:any,
    newFaseDOS: reemNewFaseDosModelo,factura_xml:any,factura_pdf:any,reembolsos_anexos:any) :Observable<any>{
    const formDataReem = new FormData();
    var json_convert = JSON.stringify(
      {  
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_reembolso_main":token_reembolso_main,
        "autorizacion_vh":autorizacion_vh,
        "autorizacion_egr":autorizacion_egr,
        "tiempo_respuesta_autorizacion":tiempo_respuesta_autorizacion,
        "reem_fecha":newFaseDOS.reem_fecha,
        "reem_folio_ticket":newFaseDOS.reem_folio_ticket,
        "reem_pagado_a":newFaseDOS.reem_pagado_a,
        "proveedor_tkn":newFaseDOS.reem_tkn_proveedor,
        "tkn_forma_pago":newFaseDOS.reem_forma_pago,
        "reem_importe_total":newFaseDOS.reem_importe_total,
        "reem_tipo_cambio":newFaseDOS.reem_tipo_cambio_string,
        "reem_moneda_nombre":newFaseDOS.reem_moneda_nombre,
        "dataCFDI_comprobante":newFaseDOS.dataCFDI_comprobante,
        "dataCFDIRelacionados":newFaseDOS.dataCFDIRelacionados,
        "dataCFDIEmisor":newFaseDOS.dataCFDIEmisor,
        "dataCFDIReceptor":newFaseDOS.dataCFDIReceptor,
        "dataCFDI_conceptos":newFaseDOS.dataCFDI_conceptos,
        "dataCFDI_impuestos_retenidos_lista":newFaseDOS.dataCFDI_impuestos_retenidos_lista,
        "dataCFDI_impuestos_trasladados_lista":newFaseDOS.dataCFDI_impuestos_trasladados_lista,
        "dataCFDIComplemento":newFaseDOS.dataCFDIComplemento,
        "reem_observacion":newFaseDOS.reem_observacion
      }
    );
    
    formDataReem.append("factura_xml", factura_xml);
    formDataReem.append("factura_pdf", factura_pdf);
    for (let i = 0; i < reembolsos_anexos.length; i++) {
      formDataReem.append('reembolsos_anexos[]',reembolsos_anexos[i],reembolsos_anexos[i].name);
    }

    formDataReem.append("json",json_convert);
    console.log(json_convert);
    //let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_registro_fase_dos',formDataReem).pipe(
      catchError(this.handlerError)
    );
  }

  save_reembolsos_fase_dos_delete(token_reembolso_main:string,token_solicitud_reem:string) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_reembolso_main":token_reembolso_main,
      "token_solicitud_reem":token_solicitud_reem,
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_registro_fase_dos_delete',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  save_reembolsos_fase_tres(newFaseUNO: reemNewFaseUnoModelo) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_reembolso_main":newFaseUNO.token_reembolso_main,
      "egresos_valua":newFaseUNO.egresos_valua,
      "valor_humano_valua":newFaseUNO.valor_humano_valua,
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._http.post(this.url+'reembolso_registro_fase_tres',parametros, {headers: headers})
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
