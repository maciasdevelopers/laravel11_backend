import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { global } from './global_ssic';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
//solicitud-factura
export class SolicitudFacturaService {
  public url: string;
  public user:any;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }
//apis
  getApiUsoCFDILista():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaUsoCFDI',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getApiUsoCFDIListaPF():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaUsoCFDIPF',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getApiUsoCFDIListaPM():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaUsoCFDIPM',{headers: headers})
    .pipe(catchError(this.handlerError))
  }
  
  listSolicitudFactura():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'list_solicitud_cfdi',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  detalleSolicitudFactura(token_cfdi:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cfdi":token_cfdi});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'detalle_solicitud_cfdi',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
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

  saveSolicitudFacturaMostrador(token_venta_registrada:any,razon_social_tipo:any,razon_social_rfc:any,razon_social_name:any,razon_social_uso_cfdi:any,razon_social_regimen_fiscal:any,
    razon_social_cpostal:any,razon_social_dir_fiscal:any,dipomex_cod_postal_estado:any,dipomex_cod_postal_municipio:any,dipomex_cod_postal_cp:any,
    dipomex_cod_postal_colonia_vinculada:any,razon_social_email:any,razon_social_telefono_dial:any,razon_social_telefono_number:any,razon_social_telefono_all:any,):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_venta_registrada":token_venta_registrada,"razon_social_tipo":razon_social_tipo,"razon_social_rfc":razon_social_rfc,
      "razon_social_name":razon_social_name,"razon_social_uso_cfdi":razon_social_uso_cfdi,"razon_social_regimen_fiscal":razon_social_regimen_fiscal,"razon_social_cpostal":razon_social_cpostal,
      "razon_social_dir_fiscal":razon_social_dir_fiscal,"dipomex_cod_postal_estado":dipomex_cod_postal_estado,"dipomex_cod_postal_municipio":dipomex_cod_postal_municipio,"dipomex_cod_postal_cp":dipomex_cod_postal_cp,
      "dipomex_cod_postal_colonia_vinculada":dipomex_cod_postal_colonia_vinculada,"razon_social_email":razon_social_email,"razon_social_telefono_dial":razon_social_telefono_dial,"razon_social_telefono_number":razon_social_telefono_number,
      "razon_social_telefono_all":razon_social_telefono_all});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'registra_solicitud_factura_venta_mostrador',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  saveSolicitudFactura(docsAnexos:any,client_tkn_soli:any,rfc_soli:any,emp_soli:any,email_referencia:any,
    fact_pagada:any,tentativa_pago:any,mes_de_venta:any,importe_venta:any,listXmlSoli:any):Observable<any>{
    console.log(docsAnexos);
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
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
    return this._httpClient.post(this.url+'registro_solicitud_cfdi',formData).pipe(
      catchError(this.handlerError)
    );
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
