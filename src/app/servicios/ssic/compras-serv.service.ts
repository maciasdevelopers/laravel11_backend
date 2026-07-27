import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfClasificacion } from '../../interfaces/interf-clasificacion';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { cfdiTrasladoModelo } from '../../modelos/cfdiTrasladoModelo.';

@Injectable({
  providedIn: 'root'
})
export class ComprasServService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listaGeneralCompras(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    let json = JSON.stringify({ "periodo": filtro, "periodo_inicio": periodo_inicio, "periodo_fin": periodo_fin });
    console.log(json);
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    return this._httpClient.post(this.url + 'egresos_compras_lista_GeneralCompras', data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  compmrasSolicitarCancelacion(token_compras: any, contabilizacion: any, observaciones: any): Observable<any> {
    let data = { "token_compras": token_compras, "solicitud_fecha_contabilizacion": contabilizacion, "solicitud_observaciones": observaciones };
    console.log(data);
    return this._httpClient.post(this.url + 'egresos_compras_solicitar_cancelacion_compra', data)
      .pipe(catchError(this.handlerError));
  }

  listaComprasDevengacionServ(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_lista_ServSinDevengar', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  listaComprasRecibeFacturaDespues(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    //let json = JSON.stringify({"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin});
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_listacompras_sinfactura', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  getTotalComprasPeriodicasDia(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_lista_comprasPeriodicas', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  getListaComprasPeriodicas(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_lista_general_comprasPeriodicas', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  listaProdServCompras(): Observable<any> {
    return this._httpClient.post(this.url + 'egresos_compras_listaprdservcomp', null)
      .pipe(catchError(this.handlerError));
  }

  listaProdServComprasProv(token_proveedor: any): Observable<any> {
    let data = { "proveedor": token_proveedor };
    return this._httpClient.post(this.url + 'egresos_compras_listaprdservcompprov', data)
      .pipe(catchError(this.handlerError));
  }

  listaServiciosCompras(): Observable<any> {
    return this._httpClient.post(this.url + 'egresos_compras_listaservicioscomp', null)
      .pipe(catchError(this.handlerError));
  }

  listaServiciosComprasProv(token_proveedor: any): Observable<any> {
    let data = { "proveedor": token_proveedor };
    return this._httpClient.post(this.url + 'egresos_compras_listaprdservcompprov', data)
      .pipe(catchError(this.handlerError));
  }

  registraClaveProdPRV(tokenProveedor: any, token_articulo: any, identificador: any,
    prov_relacionado_registrar: any,
    prov_relacionado_tiene_clave: any,
    prov_relacionado_clave: any
  ): Observable<any> {
    let data = {
      "tokenProveedor": tokenProveedor,
      "token_articulo": token_articulo,
      "identificador": identificador,
      "prov_relacionado_registrar": prov_relacionado_registrar,
      "prov_relacionado_tiene_clave": prov_relacionado_tiene_clave,
      "prov_relacionado_clave": prov_relacionado_clave
    };
    return this._httpClient.post(this.url + 'egresos_compras_registra_clave_articulo_prv', data).pipe(
      catchError(this.handlerError));
  }

  verificaArticuloProd(tokenProveedor: any, token_articulo: any, identificador: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "tokenProveedor": tokenProveedor,
      "token_articulo": token_articulo, "identificador": identificador
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_detalleproductoproveedor', parametros, { headers: headers }).pipe(
      catchError(this.handlerError));
  }

  verificaArticuloServ(tokenProveedor: any, token_articulo: any, identificador: any): Observable<any> {
    let data = {"tokenProveedor": tokenProveedor,"token_articulo": token_articulo, "identificador": identificador};
    return this._httpClient.post(this.url + 'inventarios_catalogos_detalleservicioproveedor', data)
    .pipe(catchError(this.handlerError));
  }

  verificaArticulo(token_articulo: any): Observable<any> {
    let data = { "token_articulo": token_articulo };
    return this._httpClient.post(this.url + 'egresos_compras_consultarticulocompra', data)
      .pipe(catchError(this.handlerError));
  }

  folioCompra(): Observable<any> {
    return this._httpClient.post(this.url + 'egresos_compras_selectFolioCompra', null).pipe(
      catchError(this.handlerError)
    );
  }

  registraCompraPorCFDI(
    fecha_contabilizacion: any,
    fecha_vencimiento: any,
    cfdi_comprobante: any,
    compra_total: any,
    cfdi_relacionados: any,
    cfdi_emisor: any,
    tokenProveedor: any,
    cfdi_receptor: any,
    cfdi_conceptos: any,
    cfdi_impuestos_retenidos: any,
    cfdi_impuestos_trasladados: any,
    cfdi_complemento: any,
    cfdi_complemento_carta_porte: any,
    compra_contado_credito: any,
    anticipo_aplicado: any,
    classRecibeArtPago: any,
    tipoLugarRecepcion: any,

    compra_fecha_tentativa_salida: any,
    tknLugarSalida: any,
    compra_fecha_tentativa_recepcion: any,
    tknLugarRecepcion: any,

    imagenEvidenciaXMl: File,
    imagenEvidenciaPdf: File,
    imagenEvidenciaVerificacion: File,
    compra_observaciones: any,
    compra_anexos: any,
    pagar: any): Observable<any> {
    const formdataCompra = new FormData();
    console.log(cfdi_conceptos);

    formdataCompra.append("fecha_contabilizacion", fecha_contabilizacion);
    formdataCompra.append("fecha_vencimiento", fecha_vencimiento);
    formdataCompra.append("total", compra_total);
    formdataCompra.append("token_proveedor", tokenProveedor);
    formdataCompra.append("compra_contado_credito", compra_contado_credito);
    formdataCompra.append("anticipo_aplicado", anticipo_aplicado);
    formdataCompra.append("classRecibeArtPago", classRecibeArtPago ? 'true' : 'false');

    formdataCompra.append("tipoLugarEntrega", tipoLugarRecepcion);
    formdataCompra.append("compra_fecha_tentativa_salida", compra_fecha_tentativa_salida);
    formdataCompra.append("tknLugarSalida", tknLugarSalida);
    formdataCompra.append("compra_fecha_tentativa_recepcion", compra_fecha_tentativa_recepcion);
    formdataCompra.append("tknLugarRecepcion", tknLugarRecepcion);

    formdataCompra.append("compra_observaciones", compra_observaciones);
    formdataCompra.append("pagar", pagar);

    formdataCompra.append("cfdi_comprobante", JSON.stringify(cfdi_comprobante));
    formdataCompra.append("cfdi_relacionados", JSON.stringify(cfdi_relacionados));
    formdataCompra.append("cfdi_emisor", JSON.stringify(cfdi_emisor));
    formdataCompra.append("cfdi_receptor", JSON.stringify(cfdi_receptor));
    formdataCompra.append("cfdi_conceptos", JSON.stringify(cfdi_conceptos));
    formdataCompra.append("cfdi_impuestos_retenidos", JSON.stringify(cfdi_impuestos_retenidos));
    formdataCompra.append("cfdi_impuestos_trasladados", JSON.stringify(cfdi_impuestos_trasladados));
    formdataCompra.append("cfdi_complemento", JSON.stringify(cfdi_complemento));
    formdataCompra.append("cfdi_complemento_carta_porte", JSON.stringify(cfdi_complemento_carta_porte));

    imagenEvidenciaXMl ? formdataCompra.append('imagenEvidenciaXMl', imagenEvidenciaXMl, imagenEvidenciaXMl.name) : formdataCompra.append('imagenEvidenciaXMl', '');
    imagenEvidenciaPdf ? formdataCompra.append('imagenEvidenciaPdf', imagenEvidenciaPdf, imagenEvidenciaPdf.name) : formdataCompra.append('imagenEvidenciaPdf', '');
    imagenEvidenciaVerificacion ? formdataCompra.append('imagenEvidenciaVerificacion', imagenEvidenciaVerificacion, imagenEvidenciaVerificacion.name) : formdataCompra.append('imagenEvidenciaVerificacion', '');
    for (var i = 0; i < compra_anexos.length; i++) {
      formdataCompra.append("compra_anexos[]", compra_anexos[i]);
    }

    return this._httpClient.post(this.url + 'egresos_compras_registracompraByCFDI', formdataCompra).pipe(
      catchError(this.handlerError)
    );
  }

  registraCompraPorIntsruccion(
    validXmlFecha: any,
    tokenProveedor: any,
    token_formaPago: any,
    token_metodoPago: any,
    token_moneda: any,
    tipoDeCambio: any,
    token_usoCfdi: any,
    compra_contado_credito: any,
    receptFactura: any,
    uuid_anticipo: any,
    classRecibeArtPago: any,
    totalPagoCompra: any,
    pagoTesoreriaCaja: any,
    datosCajaToken: any,
    arrayDesgloceCompra: any,
    tipoLugarRecepcion: any,
    tknLugarRecepcion: any,
    imagenEvidenciaXMl: File,
    imagenEvidenciaPdf: File,
    imagenEvidenciaVerificacion: File,
    imagenEvidenciaAnexos: File): Observable<any> {
    const formdataCompra = new FormData();
    console.log(arrayDesgloceCompra);
    if (imagenEvidenciaXMl) {
      formdataCompra.append('imagenEvidenciaXMl', imagenEvidenciaXMl, imagenEvidenciaXMl.name);
    } else {
      formdataCompra.append('imagenEvidenciaXMl', '');
    }
    if (imagenEvidenciaPdf) {
      formdataCompra.append('imagenEvidenciaPdf', imagenEvidenciaPdf, imagenEvidenciaPdf.name);
    } else {
      formdataCompra.append('imagenEvidenciaPdf', '');
    }
    if (imagenEvidenciaVerificacion) {
      formdataCompra.append('imagenEvidenciaVerificacion', imagenEvidenciaVerificacion, imagenEvidenciaVerificacion.name);
    } else {
      formdataCompra.append('imagenEvidenciaVerificacion', '');
    }
    if (imagenEvidenciaAnexos) {
      formdataCompra.append('imagenEvidenciaAnexos', imagenEvidenciaAnexos, imagenEvidenciaAnexos.name);
    } else {
      formdataCompra.append('imagenEvidenciaAnexos', '');
    }
    formdataCompra.append(
      'dataCompra', JSON.stringify(
        {
          "user_token": sessionStorage.getItem('inside_session_code'),
          "validXmlFecha": validXmlFecha,
          "token_proveedor": tokenProveedor,
          "token_formaPago": token_formaPago,
          "token_metodoPago": token_metodoPago,
          "token_moneda": token_moneda,
          "tipoDeCambio": tipoDeCambio,
          "token_usoCdfi": token_usoCfdi,
          "compra_contado_credito": compra_contado_credito,
          "receptFactura": receptFactura,
          "uuid_anticipo": uuid_anticipo,
          "classRecibeArtPago": classRecibeArtPago,
          "totalPagoCompra": totalPagoCompra,
          "pagoTesoreriaCaja": pagoTesoreriaCaja,
          "datosCajaToken": datosCajaToken,
          "array_desgloceCompra": arrayDesgloceCompra,
          "tipoLugarEntrega": tipoLugarRecepcion,
          "tknLugarRecepcion": tknLugarRecepcion
        }
      )
    );
    console.log(uuid_anticipo);

    return this._httpClient.post(this.url + 'egresos_compras_registracompraByINSTRUCCION', formdataCompra).pipe(
      catchError(this.handlerError)
    );
  }

  registraCompraPorArticulos(
    fecha_contabilizacion: any,
    fecha_vencimiento: any,
    tokenProveedor: any,
    compra_moneda: any,
    tipoDeCambio: any,
    arrayDesgloceCompra: any,
    compra_total: any,
    compra_contado_credito: any,
    classRecibeArtPago: any,
    tipoLugarRecepcion: any,

    compra_fecha_tentativa_salida: any,
    tknLugarSalida: any,
    compra_fecha_tentativa_recepcion: any,
    tknLugarRecepcion: any,

    anticipo_aplicado: any,
    aplica_recepcion_facturas: any,
    compra_observaciones: any,
    compra_anexos: any,
    pagar: any
  ): Observable<any> {
    const formdataCompra = new FormData();

    formdataCompra.append("fecha_contabilizacion", fecha_contabilizacion);
    formdataCompra.append("fecha_vencimiento", fecha_vencimiento);
    formdataCompra.append("token_proveedor", tokenProveedor);
    formdataCompra.append("compra_moneda", compra_moneda);
    formdataCompra.append("tipoDeCambio", tipoDeCambio);
    formdataCompra.append("compra_conceptos", JSON.stringify(arrayDesgloceCompra));
    formdataCompra.append("total", compra_total);
    formdataCompra.append("compra_contado_credito", compra_contado_credito);
    formdataCompra.append("classRecibeArtPago", classRecibeArtPago ? 'true' : 'false');

    formdataCompra.append("tipoLugarEntrega", tipoLugarRecepcion);
    formdataCompra.append("compra_fecha_tentativa_salida", compra_fecha_tentativa_salida);
    formdataCompra.append("tknLugarSalida", tknLugarSalida);
    formdataCompra.append("compra_fecha_tentativa_recepcion", compra_fecha_tentativa_recepcion);
    formdataCompra.append("tknLugarRecepcion", tknLugarRecepcion);

    formdataCompra.append("anticipo_aplicado", anticipo_aplicado);
    formdataCompra.append("aplica_recepcion_facturas", aplica_recepcion_facturas);
    formdataCompra.append("compra_observaciones", compra_observaciones);
    formdataCompra.append("pagar", pagar);

    for (var i = 0; i < compra_anexos.length; i++) {
      formdataCompra.append("compra_anexos[]", compra_anexos[i]);
    }
    return this._httpClient.post(this.url + 'egresos_compras_registracompraByARTICULOS', formdataCompra).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraCompraPorReembolso(
    token_reem: any,
    token_solicitud_reem: any,
    dataCFDI_name_documento: any,
    fecha_contabilizacion: any,
    fecha_vencimiento: any,
    compra_total: any,
    tokenProveedor: any,

    dataCFDI_comprobante_fecha: any,
    dataCFDI_comprobante_TipoCambio: any,
    dataCFDI_comprobante_Moneda: any,
    dataCFDI_comprobante_MoneDecimales: any,
    dataCFDI_comprobante_formaPago: any,
    dataCFDI_comprobante_MetodoPago: any,
    dataCFDI_receptor_UsoCFDI: any,

    cfdi_conceptos: any,
    cfdi_impuestos_retenidos: any,
    cfdi_impuestos_trasladados: any,
    compra_contado_credito: any,
    receptFactura: any,
    uuid_anticipo: any,
    classRecibeArtPago: any,
    tipoLugarRecepcion: any,
    tknLugarRecepcion: any,
    imagenEvidenciaVerificacion: File,
    compra_observaciones: any,
    compra_anexos: any): Observable<any> {
    const formdataCompra = new FormData();
    console.log(cfdi_conceptos);
    imagenEvidenciaVerificacion ? formdataCompra.append('imagenEvidenciaVerificacion', imagenEvidenciaVerificacion, imagenEvidenciaVerificacion.name) : formdataCompra.append('imagenEvidenciaVerificacion', '');
    for (var i = 0; i < compra_anexos.length; i++) {
      formdataCompra.append("compra_anexos[]", compra_anexos[i]);
    }

    let json = JSON.stringify({
      "token_reem": token_reem,
      "token_solicitud_reem": token_solicitud_reem,
      "dataCFDI_name_documento": dataCFDI_name_documento,
      "fecha_contabilizacion": fecha_contabilizacion,
      "fecha_vencimiento": fecha_vencimiento,
      "total": compra_total,
      "token_proveedor": tokenProveedor,
      "dataCFDI_comprobante_fecha": dataCFDI_comprobante_fecha,
      "cfdi_TipoCambio": dataCFDI_comprobante_TipoCambio,
      "cfdi_Moneda": dataCFDI_comprobante_Moneda,
      "cfdi_MoneDecimales": dataCFDI_comprobante_MoneDecimales,
      "dataCFDI_comprobante_formaPago": dataCFDI_comprobante_formaPago,
      "dataCFDI_comprobante_MetodoPago": dataCFDI_comprobante_MetodoPago,
      "dataCFDI_receptor_UsoCFDI": dataCFDI_receptor_UsoCFDI,
      "cfdi_conceptos": cfdi_conceptos,
      "cfdi_impuestos_retenidos": cfdi_impuestos_retenidos,
      "cfdi_impuestos_trasladados": cfdi_impuestos_trasladados,
      "compra_contado_credito": compra_contado_credito,
      "receptFactura": receptFactura,
      "uuid_anticipo": uuid_anticipo,
      "classRecibeArtPago": classRecibeArtPago,
      "tipoLugarEntrega": tipoLugarRecepcion,
      "tknLugarRecepcion": tknLugarRecepcion,
      "compra_observaciones": compra_observaciones
    });

    console.log(json)
    formdataCompra.append('json', json);
    console.log(uuid_anticipo);

    return this._httpClient.post(this.url + 'egresos_compras_registracompraByReembolso', formdataCompra).pipe(
      catchError(this.handlerError)
    );
  }

  //seguimiento
  //compras no autorizadas
  listaComprasNoAturizadas(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    //let json = JSON.stringify({"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin});
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_listanoautorizadacompra', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  verDesgloseCompletoCompra(token_compra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_desglosecompletocompra', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  activar_aplica_facturas_recep(token_compra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_desglose_activar_aplicafacturasrecep', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  deshabilitar_aplica_facturas_recep(token_compra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_desglose_deshabilitar_aplicafacturasrecep', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  autorizaCompra(token_compra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_autorizarcompra', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraOrdenRecepcionCompra(token_compra: any, token_cat_proveedores: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "token_compras": token_compra,
      "token_cat_proveedores": token_cat_proveedores
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_registra_orden_recepcion', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  activaOrdenRecepcionCompra(token_compra: any, uuid_orden_recepcion: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "token_compras": token_compra,
      "uuid_orden_recepcion": uuid_orden_recepcion
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_activa_orden_recepcion', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraOrdenDevengacionCompra(token_compra: any, token_cat_proveedores: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "token_compras": token_compra,
      "token_cat_proveedores": token_cat_proveedores
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_registra_orden_devengacion', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  activaOrdenDevengacionCompra(token_compra: any, uuid_orden_devengacion: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "token_compras": token_compra,
      "uuid_orden_devengacion": uuid_orden_devengacion
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_activa_orden_devengacion', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraOrdenPagoCompra(token_compra: any, token_cat_proveedores: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "token_compras": token_compra,
      "token_cat_proveedores": token_cat_proveedores
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_registra_orden_pago', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  activaOrdenPagoCompra(token_compra: any, token_orden_pago: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "token_compras": token_compra,
      "token_orden_pago": token_orden_pago
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_activa_orden_pago', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  cancelaCompra(token_compra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_cancelarcompra', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  //Compras pagadas
  listaComprasAutorizadas(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    //let json = JSON.stringify({"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin});
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_listacomprasautorizadas', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  listaComprasPagadas(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    //let json = JSON.stringify({"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin});
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_listacompraspagadas', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  detalleComprasAutorizadas(token_compra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_detallecomprasautorizadas', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  detalleComprasDevengServ(token_compra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_detallecomprasdevengserv', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  //prorrateros
  listaNoProrratea(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'listaegresosnoprorratea', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  detailNoProrratea(token_compra: any): Observable<any> {
    let data = { "token_compra": token_compra };
    return this._httpClient.post(this.url + 'egresos_compras_detailegresosnoprorratefalse', data)
      .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  listaProrrateos(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    //let json = JSON.stringify({"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin});
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_listaegresosprorrateos', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  detailProrrateos(token_prorrateo: any): Observable<any> {
    let data = { "token_prorrateo": token_prorrateo };
    console.log(data);
    return this._httpClient.post(this.url + 'egresos_compras_detailegresosprorrateos', data).pipe(
      catchError(this.handlerError)
    );
  }

  historialegresosprorrateos(token_prorrateo: any, token_detalle_prorrt: any): Observable<any> {
    let data = { "token_prorrateo": token_prorrateo, "token_detalle_prorrt": token_detalle_prorrt };
    return this._httpClient.post(this.url + 'egresos_compras_historialegresosprorrateos', data)
      .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  deletehistorialegresosprorrateos(token_prorrateo: any, token_detalle_prorrt: any, token_rel_prort: any, token_detcompra: any): Observable<any> {
    let data = { "token_prorrateo": token_prorrateo, "token_detalle_prorrt": token_detalle_prorrt, "token_rel_prort": token_rel_prort, "token_detcompra": token_detcompra };
    return this._httpClient.post(this.url + 'egresos_compras_deletehistoricdetalleprorrat', data)
      .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  guardarprorrateos(fecha_contabilizacion: string, prorrateo_moneda: string, arraySelectedProrrateos: any): Observable<any> {
    let json = JSON.stringify({ "fecha_contabilizacion": fecha_contabilizacion, "prorrateo_moneda": prorrateo_moneda, "arraySelectedProrrateos": arraySelectedProrrateos });
    console.log(json);
    let data = { "fecha_contabilizacion": fecha_contabilizacion, "prorrateo_moneda": prorrateo_moneda, "arraySelectedProrrateos": arraySelectedProrrateos };
    console.log(data);
    return this._httpClient.post(this.url + 'egresos_compras_guardaregresosprorrateos', data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  rechazosComprasAutorizadas(token_compra: any, token_detcompra: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compra": token_compra, "token_detcompra": token_detcompra });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_rechazoscomprasautorizadas', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraRecepcionCFDI(
    compra_token: any,
    proveedor_token: any,
    emisor: any,
    receptor: any,
    UUID: any,
    tipoDeComprobante: any,
    fechaTimbrado: any,
    total: any,
    imagenEvidenciaXMl: File,
    imagenEvidenciaPdf: File,
    imagenEvidenciaVerificacion: File,
    imagenEvidenciaAnexos: File): Observable<any> {
    const formdataCompra = new FormData();
    if (imagenEvidenciaXMl) {
      formdataCompra.append('imagenEvidenciaXMl', imagenEvidenciaXMl, imagenEvidenciaXMl.name);
    } else {
      formdataCompra.append('imagenEvidenciaXMl', '');
    }
    if (imagenEvidenciaPdf) {
      formdataCompra.append('imagenEvidenciaPdf', imagenEvidenciaPdf, imagenEvidenciaPdf.name);
    } else {
      formdataCompra.append('imagenEvidenciaPdf', '');
    }
    if (imagenEvidenciaVerificacion) {
      formdataCompra.append('imagenEvidenciaVerificacion', imagenEvidenciaVerificacion, imagenEvidenciaVerificacion.name);
    } else {
      formdataCompra.append('imagenEvidenciaVerificacion', '');
    }
    if (imagenEvidenciaAnexos) {
      formdataCompra.append('imagenEvidenciaAnexos', imagenEvidenciaAnexos, imagenEvidenciaAnexos.name);
    } else {
      formdataCompra.append('imagenEvidenciaAnexos', '');
    }
    formdataCompra.append(
      'dataCompra', JSON.stringify(
        {
          "user_token": sessionStorage.getItem('inside_session_code'),
          "compra_token": compra_token,
          "proveedor_token": proveedor_token,
          "emisor": emisor,
          "receptor": receptor,
          "uuid": UUID,
          "tipoDeComprobante": tipoDeComprobante,
          "fechaTimbrado": fechaTimbrado,
          "total": total
        }
      )
    );

    return this._httpClient.post(this.url + 'egresos_compras_recibefacturacompras', formdataCompra).pipe(
      catchError(this.handlerError)
    );
  }

  //descuentos
  comprasRegistrarDescuento(
    tipo_devolucion: any,
    compra: any,
    proveedor: any,
    articulos: any,
    establecimiento: any,
    observaciones: any,
  ): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "tipo_devolucion": tipo_devolucion,
      "compra": compra,
      "proveedor": proveedor,
      "articulos": articulos,
      "establecimiento": establecimiento,
      "observaciones": observaciones
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_registrardescuento', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  listaComprasDescuentos(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    let json = JSON.stringify({ "periodo": filtro, "periodo_inicio": periodo_inicio, "periodo_fin": periodo_fin });
    console.log(json);
    let data = {
      "periodo": filtro,
      "periodo_inicio": periodo_inicio,
      "periodo_fin": periodo_fin
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    //let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_listacomprasdescuentos', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  autorizarComprasDescuentos(token_compras_descuentos: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compras_descuentos": token_compras_descuentos });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_autorizarcomprasdescuentos', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  cancelarComprasDescuentos(token_compras_descuentos: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compras_descuentos": token_compras_descuentos });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_cancelarcomprasdescuentos', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  //devoluciones
  comprasRegistrarDevolucion(
    tipo_devolucion: any,
    compra: any,
    proveedor: any,
    articulos: any,
    establecimiento: any,
    observaciones: any,
  ): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "tipo_devolucion": tipo_devolucion,
      "compra": compra,
      "proveedor": proveedor,
      "articulos": articulos,
      "establecimiento": establecimiento,
      "observaciones": observaciones
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_registrardevolucion', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  listaComprasDevoluciones(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_listacomprasdevoluciones', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  autorizarComprasDevoluciones(token_compras_devoluciones: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compras_devoluciones": token_compras_devoluciones });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_autorizarcomprasdevoluciones', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  cancelarComprasDevoluciones(token_compras_devoluciones: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_compras_devoluciones": token_compras_devoluciones });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'egresos_compras_cancelarcomprasdevoluciones', parametros, { headers: headers }).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  seccion_compras_complementa_informacion(
    token_compras: any,
    //fecha_contabilizacion:any,
    cfdi_comprobante: any,
    cfdi_emisor: any,
    cfdi_receptor: any,
    cfdi_conceptos: any,
    cfdi_impuestos_retenidos: any,
    cfdi_impuestos_trasladados: any,
    cfdi_complemento: any,
    cfdi_relacionados: any,
    //compra_total:any,
    //compra_contado_credito:any,
    //fecha_vencimiento:any,
    //classRecibeArtPago:any,
    //receptFactura:any,
    //tokenProveedor:any,
    //uuid_anticipo:any,
    //tipoLugarRecepcion:any,
    //tknLugarRecepcion:any,
    imagenEvidenciaXMl: File,
    imagenEvidenciaPdf: File,
    imagenEvidenciaVerificacion: File,
    //compra_observaciones:any,
    //compra_anexos:any,
    //pagar:any
  ): Observable<any> {
    const formdataCompra = new FormData();
    console.log(cfdi_conceptos);
    imagenEvidenciaXMl ? formdataCompra.append('imagenEvidenciaXMl', imagenEvidenciaXMl, imagenEvidenciaXMl.name) : formdataCompra.append('imagenEvidenciaXMl', '');
    imagenEvidenciaPdf ? formdataCompra.append('imagenEvidenciaPdf', imagenEvidenciaPdf, imagenEvidenciaPdf.name) : formdataCompra.append('imagenEvidenciaPdf', '');
    imagenEvidenciaVerificacion ? formdataCompra.append('imagenEvidenciaVerificacion', imagenEvidenciaVerificacion, imagenEvidenciaVerificacion.name) : formdataCompra.append('imagenEvidenciaVerificacion', '');
    //for (var i = 0; i < compra_anexos.length; i++) {
    //  formdataCompra.append("compra_anexos[]", compra_anexos[i]);
    //}

    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'),
      "token_compras": token_compras,
      //"fecha_contabilizacion":fecha_contabilizacion,
      //"fecha_vencimiento":fecha_vencimiento,
      "cfdi_comprobante": cfdi_comprobante,
      "cfdi_emisor": cfdi_emisor,
      "cfdi_receptor": cfdi_receptor,
      "cfdi_conceptos": cfdi_conceptos,
      "cfdi_impuestos_retenidos": cfdi_impuestos_retenidos,
      "cfdi_impuestos_trasladados": cfdi_impuestos_trasladados,
      "cfdi_complemento": cfdi_complemento,
      "cfdi_relacionados": cfdi_relacionados,
      //"total":compra_total,
      //"token_proveedor":tokenProveedor,
      //"compra_contado_credito":compra_contado_credito,

      //"receptFactura":receptFactura,
      //"uuid_anticipo":uuid_anticipo,
      //"classRecibeArtPago":classRecibeArtPago,
      //"tipoLugarRecepcion":tipoLugarRecepcion,
      //"tknLugarRecepcion":tknLugarRecepcion,
      //"compra_observaciones":compra_observaciones

      //"pagoTesoreriaCaja":pagoTesoreriaCaja,
      //"datosCajaToken":datosCajaToken,
    });

    console.log(json)
    //console.log(uuid_anticipo);
    formdataCompra.append('json', json);

    return this._httpClient.post(this.url + 'egresos_compras_complementa_informacion_CFDI', formdataCompra).pipe(
      catchError(this.handlerError)
    );
  }

  registraCargaCFDITraslado(
    fecha_contabilizacion: any,
    imagenEvidenciaXMl: File,
    imagenEvidenciaPdf: File,
    imagenEvidenciaVerificacion: File,
    modeloTrasladoCFDI: cfdiTrasladoModelo,
    comprasSeleccionadas: any,
    observaciones: any
  ): Observable<any> {
    let json = JSON.stringify({
      "fecha_contabilizacion":fecha_contabilizacion,
      "cfdi_comprobante":modeloTrasladoCFDI.dataCFDI_comprobante_obj,
      "cfdi_relacionados":modeloTrasladoCFDI.dataCFDIRelacionados_obj,
      "cfdi_emisor":modeloTrasladoCFDI.dataCFDIEmisor_obj,
      "cfdi_receptor":modeloTrasladoCFDI.dataCFDIReceptor_obj,
      "cfdi_conceptos":modeloTrasladoCFDI.dataCFDI_conceptos,
      "cfdi_complemento":modeloTrasladoCFDI.dataCFDIComplemento_obj,
      "cfdi_complemento_carta_porte":modeloTrasladoCFDI.dataCFDIComplemento_carta_porte_obj,
      "compras_seleccionadas":comprasSeleccionadas,
      "observaciones":observaciones
    });
    console.log(json);
    const formdataCompra = new FormData(); 
    formdataCompra.append("fecha_contabilizacion", fecha_contabilizacion);
    formdataCompra.append("cfdi_comprobante", JSON.stringify(modeloTrasladoCFDI.dataCFDI_comprobante_obj));
    formdataCompra.append("cfdi_relacionados", JSON.stringify(modeloTrasladoCFDI.dataCFDIRelacionados_obj));
    formdataCompra.append("cfdi_emisor", JSON.stringify(modeloTrasladoCFDI.dataCFDIEmisor_obj));
    formdataCompra.append("cfdi_receptor", JSON.stringify(modeloTrasladoCFDI.dataCFDIReceptor_obj));
    formdataCompra.append("cfdi_conceptos", JSON.stringify(modeloTrasladoCFDI.dataCFDI_conceptos));
    formdataCompra.append("cfdi_complemento", JSON.stringify(modeloTrasladoCFDI.dataCFDIComplemento_obj));
    formdataCompra.append("cfdi_complemento_carta_porte", JSON.stringify(modeloTrasladoCFDI.dataCFDIComplemento_carta_porte_obj));
    formdataCompra.append("compras_seleccionadas", JSON.stringify(comprasSeleccionadas));
    formdataCompra.append("observaciones", observaciones);

    imagenEvidenciaXMl ? formdataCompra.append('imagenEvidenciaXMl', imagenEvidenciaXMl, imagenEvidenciaXMl.name) : formdataCompra.append('imagenEvidenciaXMl', '');
    imagenEvidenciaPdf ? formdataCompra.append('imagenEvidenciaPdf', imagenEvidenciaPdf, imagenEvidenciaPdf.name) : formdataCompra.append('imagenEvidenciaPdf', '');
    imagenEvidenciaVerificacion ? formdataCompra.append('imagenEvidenciaVerificacion', imagenEvidenciaVerificacion, imagenEvidenciaVerificacion.name) : formdataCompra.append('imagenEvidenciaVerificacion', '');

    return this._httpClient.post(this.url + 'egresos_compras_carga_cfdi_traslado', formdataCompra).pipe(
      catchError(this.handlerError)
    );
  }

  handlerError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}
