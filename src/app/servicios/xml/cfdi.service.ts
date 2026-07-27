import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfUsoCFDI } from '../../interfaces/interf-uso-cfdi';
import { global } from '../global_ssic';
import { resolve } from 'path';
import { rejects } from 'assert';
//import { parseString } from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class CFDIService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  obtenRFCEmisor(nodo_emisor:any):String{
    let rfc_emisor = '';
    nodo_emisor.forEach((emi:any) => {
      console.log(emi.getAttribute('Rfc')); 
      rfc_emisor = emi.getAttribute('Rfc');
    });
    return rfc_emisor;
  }

  obtenReceptor(nodo_receptor:any):String{
    let rfc_receptor = '';
    nodo_receptor.forEach((child:any) => {
      console.log(child.getAttribute('Rfc'));
      rfc_receptor = child.getAttribute('Rfc');
    });
    return rfc_receptor;
  }

  obtenComplementoUUID(nodo_complemento:any):String{
    let complemento_uuid = '';
    nodo_complemento.forEach((child:any) => {
      const childNodes = child.children();
      const timbreFiscalDigital = childNodes.getNodesByName("tfd:TimbreFiscalDigital");
      timbreFiscalDigital.forEach((timbre:any) => {
        console.log(timbre.getAttribute("UUID"));
        complemento_uuid = timbre.getAttribute("UUID");
      });
    });
    return complemento_uuid;
  }

  obtenComplementoUUIDCompras(nodo_complemento:any):String{
    let complemento_uuid = '';
    nodo_complemento.forEach((child:any) => {
      const raiz_complemento: any = child.children();
      raiz_complemento.forEach((rChild: any) => {
        console.log(rChild.getAttribute("UUID"));
        complemento_uuid = rChild.getAttribute("UUID");
      });
    });
    return complemento_uuid;
  }

  obtenComplementoSelloCFDCompras(nodo_complemento:any):String{
    let complemento_sellocfd = '';
    nodo_complemento.forEach((child:any) => {
      const raiz_complemento: any = child.children();
      raiz_complemento.forEach((rChild: any) => {
        console.log(rChild.getAttribute("SelloCFD"));
        complemento_sellocfd = rChild.getAttribute("SelloCFD");
      });
    });
    return complemento_sellocfd;
  }

  obtenComplementoSelloCFD(nodo_complemento:any):String{
    let complemento_SelloCFD = '';
    nodo_complemento.forEach((child:any) => {
      const childNodes = child.children();
      const timbreFiscalDigital = childNodes.getNodesByName("tfd:TimbreFiscalDigital");
      timbreFiscalDigital.forEach((timbre:any) => {
        console.log(timbre.getAttribute("SelloCFD"));
        complemento_SelloCFD = timbre.getAttribute("SelloCFD");
      });
    });
    return complemento_SelloCFD;
  }

  obtenComplementoCartaPorte(nodo_complemento:any):String{
    let carta_porte_IdCCP = '';
    nodo_complemento.forEach((child:any) => {
      const raiz_complemento = child.children();
      const nodo_carta_aporte = raiz_complemento.getNodesByName("cartaporte31:CartaPorte");
      nodo_carta_aporte.forEach((rcp:any) => {
        console.log(rcp.getAttribute("IdCCP"));
        carta_porte_IdCCP = rcp.getAttribute("IdCCP");
      });
    });
    return carta_porte_IdCCP;
  }

  obtenComplementoFechaInicialPago(nodo_complemento:any):String{
    let complemento_FechaInicialPago = '';
    nodo_complemento.forEach((child:any) => {
      const childNodes = child.children();
      const nomina12Nomina = childNodes.getNodesByName("nomina12:Nomina");
      nomina12Nomina.forEach((nomina:any) => {
        complemento_FechaInicialPago = nomina.getAttribute("FechaInicialPago");
      });
    });
    return complemento_FechaInicialPago;
  }

  obtenComplementoFechaFinalPago(nodo_complemento:any):String{
    let complemento_FechaFinalPago = '';
    nodo_complemento.forEach((child:any) => {
      const childNodes = child.children();
      const nomina12Nomina = childNodes.getNodesByName("nomina12:Nomina");
      nomina12Nomina.forEach((nomina:any) => {
        complemento_FechaFinalPago = nomina.getAttribute("FechaFinalPago");
        //"FechaPago":nomina.getAttribute("FechaPago") ? nomina.getAttribute("FechaPago") : '---',
      });
    });
    return complemento_FechaFinalPago;
  }

  usoCFDIGet():Observable<InterfUsoCFDI[]>{
    return this._httpClient.get<InterfUsoCFDI[]>(this.url+'getListaUso')
    .pipe(catchError(this.handlerError));
  }

  getApiUsoCFDI():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaUsoCFDI',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  motivosCancelacionCfdi():Observable<any>{
    return this._httpClient.get(this.url+'getMotivosCancelacionCfdi')
    .pipe(catchError(this.handlerError))
  }

  //lecturaXmlIngresos(xml:string,emisor:any,receptor:any):Promise<any>{
  //  return new Promise((resolve:any,reject:any) => {
  //    parseString(
  //      xml,
  //      {explicitArray: false, mergeAttrs: true},
  //      (err:any,result:any) => {
  //        if (err) {
  //          reject(err);
  //        } else {
  //          resolve(result);
  //        }
  //      }
  //    );
  //  });
  //}

  //convertirXMLaJSON(xml: string): Promise<any> {
  //  return new Promise((resolve, reject) => {
  //    parseString(
  //      xml,
  //      { explicitArray: false, mergeAttrs: true },
  //      (err, result) => {
  //        if (err) {
  //          reject(err);
  //        } else {
  //          resolve(result);
  //        }
  //      }
  //    );
  //  });
  //}

  validaEstadoCFDIDecImpFederales(uuid:any,emisor:any,receptor:any,total:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"emisor":emisor,"receptor":receptor,"uuid":uuid,"total":total});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'cfdi_validacion_validaestadoxmlcfdi_decimp_federales',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  validaEstadoCFDIIMMS(uuid:any,emisor:any,receptor:any,total:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"emisor":emisor,"receptor":receptor,"uuid":uuid,"total":total});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'cfdi_validacion_validaestadoxmlcfdi_aportaciones_imss',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  validaEstadoCFDIISN(uuid:any,emisor:any,receptor:any,total:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"emisor":emisor,"receptor":receptor,"uuid":uuid,"total":total});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'cfdi_validacion_validaestadoxmlcfdi_impuestos_sobre_nomina',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  validaEstadoCFDINominas(uuid:any,emisor:any,receptor:any,total:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"emisor":emisor,"receptor":receptor,"uuid":uuid,"total":total});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'cfdi_validacion_validaestadoxmlcfdi_nominas',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  validaEstadoCFDICompras(uuid:any,emisor:any,receptor:any,total:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"emisor":emisor,"receptor":receptor,"uuid":uuid,"total":total});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'cfdi_validacion_validaestadoxmlcfdi_compras',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  validaEstadoCFDIReembolsos(uuid:any,emisor:any,receptor:any,total:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"emisor":emisor,"receptor":receptor,"uuid":uuid,"total":total});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'cfdi_validacion_validaestadoxmlcfdi_reembolsos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  validaEstructXmlIngresos(imagenEvidenciaXMl:File,emisor:any,receptor:any):Observable<any>{
    const formdataXml = new FormData();
    console.log(imagenEvidenciaXMl.name);
    formdataXml.append('imagenEvidenciaXMl',imagenEvidenciaXMl,imagenEvidenciaXMl.name);
    formdataXml.append('proveedor',JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "emisor":emisor,"receptor":receptor}));
    return this._httpClient.post(this.url+'egresos_compras_validaestructxmlingresos',formdataXml).pipe(
      catchError(this.handlerError)
    );
  }

  validaEstructXmlEgresos(imagenEvidenciaXMl:File,tokenProveedor:any,rfcProveedor:any):Observable<any>{
    const formdataXml = new FormData();
    console.log(imagenEvidenciaXMl.name);
    formdataXml.append('imagenEvidenciaXMl',imagenEvidenciaXMl,imagenEvidenciaXMl.name);
    const json_data = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proveedor_token":tokenProveedor,"proveedor_rfc":rfcProveedor});
    console.log(json_data);
    formdataXml.append('json',json_data);
    return this._httpClient.post(this.url+'egresos_compras_validaestructxmlegresos',formdataXml).pipe(
      catchError(this.handlerError)
    );
  }

  list_soli_facturacion():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_facturacion_solicitudes_facturacion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  detalle_soli_facturacion(token_cfdi:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cfdi":token_cfdi});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_facturacion_detalle_solicitud_facturacion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  emitir_factura(docsAnexos:any,token_cfdi:any,token_solicitud_cfdi:any,emision_serie:any,emision_folio:any,emision_fecha:any,emision_monto:any):Observable<any>{
    let json = JSON.stringify(
      {
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cfdi":token_cfdi,
        "token_solicitud_cfdi":token_solicitud_cfdi,
        "serie_emision":emision_serie,
        "folio_emision":emision_folio,
        "fecha_emision":emision_fecha,
        "monto_emision":emision_monto
      }
    );
    console.log(json);
    /*let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'emision_factura',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );*/
    const formData = new FormData();
    for (var i = 0; i < docsAnexos.length; i++) {
      formData.append("docsAnexos[]", docsAnexos[i]);
    }
    formData.append('json',json);
    console.log(formData);
    return this._httpClient.post(this.url+'ingresos_facturacion_emision_factura',formData).pipe(
      catchError(this.handlerError)
    );
  }

  deleteDocumentoFact(token_solicitud:any,token_documento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "token_solicitud_cfdi":token_solicitud,"token_documento":token_documento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'detalle_solicitud_cfdi',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  cancelSolicitudFactura(docsAnexos:any,token_cfdi:any,token_solicitud_cfdi:any,token_cancelacion:any, 
    clave_motivo_cancelacion:any,motivo_cancelacion:any,client_tkn_soli:any,rfc_soli:any,
    emp_soli:any,email_referencia:any,fact_pagada:any,tentativa_pago:any,
    mes_de_venta:any,importe_venta:any,listXmlSoli:any):Observable<any>{
    console.log(docsAnexos);
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_cfdi":token_cfdi,
      "token_solicitud_cfdi":token_solicitud_cfdi,
      "token_cancelacion":token_cancelacion,
      "clave_motivo_cancelacion":clave_motivo_cancelacion,
      "motivo_cancelacion":motivo_cancelacion,
      "client_tkn_soli":client_tkn_soli,
      "soliCfdiRfc":rfc_soli,
      "soliCfdiEmp":emp_soli,
      "soliCfdiEmail":email_referencia,
      "soliCfdiFactPagada":fact_pagada,
      "soliCfdiTentativaPago":tentativa_pago,
      "soliCfdiMesVenta":mes_de_venta,
      "soliCfdiImporteVenta":importe_venta,
      "soliCfdiXmlSoli":listXmlSoli
    });
    console.log(json);
    /*let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+"r_solicitud_cfdi",parametros, {headers: headers})
    .pipe(catchError(this.handlerError));*/

    const formData = new FormData();
    for (var i = 0; i < docsAnexos.length; i++) {
      formData.append("docsAnexos[]", docsAnexos[i]);
    }
    formData.append('solicitud',json);
    console.log(formData);
    return this._httpClient.post(this.url+'cancelar_solicitud_cfdi',formData).pipe(
      catchError(this.handlerError)
    );
  }

  //visor CFDI
  visorCfdiEstadoXmlIngresos(uuid:any,emisor:any,receptor:any,total:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"emisor":emisor,"receptor":receptor,"uuid":uuid,"total":total});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'visor_cfdi_estado_xml_ingresos',parametros, {headers: headers}).pipe(
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
