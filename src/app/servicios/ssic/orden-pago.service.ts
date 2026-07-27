import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class OrdenPagoService {
  public url: string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  countOrdenesPago():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_countordenespago',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  testgeneralordenespago(page: number = 1,perPage:number = 10):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "page": page,
      "per_page": perPage
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_pruebalistageneralordenespago',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listageneralordenespago(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_pago_listageneralordenespago',data).pipe(
      catchError(this.handlerError)
    );
  }

  ordenPagoSolicitarCancelacion(orden_pago:any,contabilizacion:any,observaciones:any):Observable<any>{
    let data = {"orden_pago":orden_pago,"solicitud_fecha_contabilizacion":contabilizacion,"solicitud_observaciones":observaciones};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitar_cancelacion_orden_pago',data)
    .pipe(catchError(this.handlerError));
  }

  listaordenespagopendientes(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_pago_listaordenespagopendientes',data).pipe(
      catchError(this.handlerError)
    );
  }

  listaordenespagoliberadas(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_pago_listaordenespagoliberadas',data).pipe(
      catchError(this.handlerError)
    );
  }

  listaordenespagoparacompras(token_compras:any,token_ordenPago:any):Observable<any>{
    let data = {"token_compras":token_compras,"token_ordenPago":token_ordenPago};
    return this.httpClient.post(this.url+'finanzas_orden_pago_listaordenespagoparacompras',data)
    .pipe(catchError(this.handlerError));
  }

  listaordenespagoconcluidas(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_pago_listaordenespagoconcluidas',data).pipe(
      catchError(this.handlerError)
    );
  }

  autorizar_ordenpago(orden_pago:any):Observable<any>{
    let data = {"orden_pago":orden_pago};
    return this.httpClient.post(this.url+'finanzas_orden_pago_autorizar_orden_pago',data)
    .pipe(catchError(this.handlerError));
  }

  autorizar_ordenespago(ordenes:any):Observable<any>{
    let data = {"ordenes":ordenes};
    return this.httpClient.post(this.url+'finanzas_orden_pago_autorizar_ordenes_pago',data)
    .pipe(catchError(this.handlerError));
  }

  desautorizar_ordenespago(orden_pago:any):Observable<any>{
    let data = {"orden_pago":orden_pago};
    return this.httpClient.post(this.url+'finanzas_orden_pago_desautorizar_orden_pago',data)
    .pipe(catchError(this.handlerError));
  }

  actualizar_orden_pago(orden_pago:any):Observable<any>{
    let data = {"orden_pago":orden_pago};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_actualizar_orden_pago',data)
    .pipe(catchError(this.handlerError));
  }

  listaPagosRealizados(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_pago_catalogo_pagos_done',data).pipe(
      catchError(this.handlerError)
    );
  }

  listaOrdenesPagoProveedor():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_listaordenespagocompras',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaOrdenesPagoCliente():Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'listaordenespagoventas',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  verOrdenesPagoProveedor(token_proveedor:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proveedor":token_proveedor});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_detalleordenpagocompras',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  desglosePagoRealizado(pago_realizado:any):Observable<any>{
    let data = {"pago_realizado":pago_realizado};
    return this.httpClient.post(this.url+'finanzas_orden_pago_catalogo_pagos_desglose',data)
    .pipe(catchError(this.handlerError));
  }

  pagoRealizadoSolicitarCancelacion(pago_realizado:any,contabilizacion:any,observaciones:any):Observable<any>{
    let data = {"pago_realizado":pago_realizado,"solicitud_fecha_contabilizacion":contabilizacion,"solicitud_observaciones":observaciones};
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitar_cancelacion_pago',data)
    .pipe(catchError(this.handlerError));
  }

  desgloseNominaPagoRealizado(pago_realizado:any):Observable<any>{
    let data = {"pago_realizado":pago_realizado};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_desglose_pago_nomina',data)
    .pipe(catchError(this.handlerError));
  }

  pagoNominaDesglose(token_ordenPago:string,token_nominas_periodos:string):Observable<any>{
    let data = {"token_ordenPago":token_ordenPago,"token_nominas_periodos":token_nominas_periodos};
    console.log(data)
    return this.httpClient.post(this.url+'finanzas_orden_pago_nomina_desglose',data)
    .pipe(catchError(this.handlerError));
  }

  pagoNominaEspecieDesglose(token_ordenPago:string,token_nominas_especie:string):Observable<any>{
    let data = {"token_ordenPago":token_ordenPago,"token_nominas_especie":token_nominas_especie};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_nomina_especie_desglose',data).pipe(
      catchError(this.handlerError)
    );
  }

  confirmaPagoSimple(
    order_importe:any,
    fecha_contabilizacion:any,
    order_caja:any,
    order_cuenta_bancaria:any,
    order_monedero_electronico:any,
    anticipos:any,
    saldos:any,
    prv_token:any,
    saldo_a_favor:any,
    order_moneda:any,
    order_tipo_cambio:any,
    order_forma_pago:any,
    order_ordenes_pago:any,
    order_observacion:any,
    evidencias_pagos:any
  ):Observable<any>{
    const formDataPago = new FormData();

    formDataPago.append("order_importe",order_importe);
    formDataPago.append("fecha_contabilizacion",fecha_contabilizacion);
    //formDataPago.append("order_caja",order_caja);
    //formDataPago.append("order_cuenta_bancaria",order_cuenta_bancaria);
    //formDataPago.append("order_monedero_electronico",order_monedero_electronico);
    formDataPago.append("anticipos",anticipos);
    //formDataPago.append("saldos",saldos);
    formDataPago.append("prv_token",prv_token);
    formDataPago.append("saldo_a_favor",saldo_a_favor);
    formDataPago.append("order_moneda",order_moneda);
    formDataPago.append("order_tipo_cambio",order_tipo_cambio);
    formDataPago.append("order_forma_pago",order_forma_pago);
    //formDataPago.append("order_ordenes_pago",order_ordenes_pago);
    formDataPago.append("order_observacion",order_observacion);

    
    if (order_caja) {
      order_caja.forEach((caja:any, i:any) => {
        formDataPago.append(`order_caja[${i}][token_caja]`, caja.token_caja);
        formDataPago.append(`order_caja[${i}][monto_aplicar]`, caja.monto_aplicar);
      });
    }

    if (order_cuenta_bancaria) {
      order_cuenta_bancaria.forEach((cuenta:any, i:any) => {
        formDataPago.append(`order_cuenta_bancaria[${i}][token_cuenta]`, cuenta.token_cuenta);
        formDataPago.append(`order_cuenta_bancaria[${i}][monto_aplicar]`, cuenta.monto_aplicar);
      });
    }

    if (order_monedero_electronico) {
      order_monedero_electronico.forEach((moned:any, i:any) => {
        formDataPago.append(`order_monedero_electronico[${i}][token_cuentaMon]`, moned.token_cuentaMon);
        formDataPago.append(`order_monedero_electronico[${i}][monto_aplicar]`, moned.monto_aplicar);
      });
    }

    if (saldos) {
      saldos.forEach((sald:any, i:any) => {
        formDataPago.append(`saldos[${i}][uuid_saldo]`, sald.uuid_saldo);
        formDataPago.append(`saldos[${i}][monto_real]`, sald.monto_real);
        formDataPago.append(`saldos[${i}][monto_aplicar]`, sald.monto_aplicar);
      });
    }

    if (order_ordenes_pago) {
      order_ordenes_pago.forEach((ordp:any, i:any) => {
        formDataPago.append(`order_ordenes_pago[${i}][factura_relacionada_typo]`, ordp.factura_relacionada_typo);
        formDataPago.append(`order_ordenes_pago[${i}][folio_ordenPago]`, ordp.folio_ordenPago);
        formDataPago.append(`order_ordenes_pago[${i}][token_ordenPago]`, ordp.token_ordenPago);
        formDataPago.append(`order_ordenes_pago[${i}][factura_relacionada_token]`, ordp.factura_relacionada_token);
        formDataPago.append(`order_ordenes_pago[${i}][factura_relacionada_string]`, ordp.factura_relacionada_string);
        formDataPago.append(`order_ordenes_pago[${i}][importe_por_pagar]`, ordp.importe_por_pagar);
        formDataPago.append(`order_ordenes_pago[${i}][debe_simple]`, ordp.debe_simple);
      });
    }

    for (var i = 0; i < evidencias_pagos.length; i++) {
      formDataPago.append("evidencias_pagos[]", evidencias_pagos[i]);
    }
    //let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_ordenpago_registrapagosimple',formDataPago).pipe(
      catchError(this.handlerError)
    );
  }

  confirmaDispersionNomina(
    orden_pago_token:string,
    nomina_periodo_token:string,
    order_importe:number,
    fecha_contabilizacion:string,
    order_caja:any,
    order_cuenta_bancaria:any,
    order_monedero_electronico:any,
    saldo_a_favor:any,
    order_moneda:any,
    order_tipo_cambio:any,
    order_forma_pago:any,
    trabajadores_relacionados:any,
    trabajadores_dispersados:any,
    order_observacion:any,
    evidencias_pagos:any):Observable<any>{
    const formDataPago = new FormData();

    formDataPago.append("orden_pago_token",orden_pago_token);
    formDataPago.append("nomina_periodo_token",nomina_periodo_token);
    formDataPago.append("order_importe",order_importe.toString());
    formDataPago.append("fecha_contabilizacion",fecha_contabilizacion);
    formDataPago.append("saldo_a_favor",saldo_a_favor);
    formDataPago.append("order_moneda",order_moneda);
    formDataPago.append("order_tipo_cambio",order_tipo_cambio);
    formDataPago.append("order_forma_pago",order_forma_pago);
    formDataPago.append("order_observacion",order_observacion);
    
    //formDataPago.append("order_caja",order_caja);
    //formDataPago.append("order_cuenta_bancaria",order_cuenta_bancaria);
    //formDataPago.append("order_monedero_electronico",order_monedero_electronico);
    //formDataPago.append("trabajadores_dispersados",trabajadores_dispersados);
    
    if (order_caja) {
      order_caja.forEach((caja:any, i:any) => {
        formDataPago.append(`order_caja[${i}][token_caja]`, caja.token_caja);
        formDataPago.append(`order_caja[${i}][monto_aplicar]`, caja.monto_aplicar);
      });
    }

    if (order_cuenta_bancaria) {
      order_cuenta_bancaria.forEach((cuenta:any, i:any) => {
        formDataPago.append(`order_cuenta_bancaria[${i}][token_cuenta]`, cuenta.token_cuenta);
        formDataPago.append(`order_cuenta_bancaria[${i}][monto_aplicar]`, cuenta.monto_aplicar);
      });
    }

    if (order_monedero_electronico) {
      order_monedero_electronico.forEach((moned:any, i:any) => {
        formDataPago.append(`order_monedero_electronico[${i}][token_cuentaMon]`, moned.token_cuentaMon);
        formDataPago.append(`order_monedero_electronico[${i}][monto_aplicar]`, moned.monto_aplicar);
      });
    }

    if (trabajadores_relacionados) {
      trabajadores_relacionados.forEach((trb_disp:any, i:any) => {
        formDataPago.append(`trabajadores_relacionados[${i}][token_nomina_recibo]`, trb_disp.token_nomina_recibo);
        formDataPago.append(`trabajadores_relacionados[${i}][nomina_moneda_name]`, trb_disp.nomina_moneda_name);
        formDataPago.append(`trabajadores_relacionados[${i}][nomina_empleado_token]`, trb_disp.nomina_empleado_token);
        formDataPago.append(`trabajadores_relacionados[${i}][importe_por_pagar]`, trb_disp.importe_por_pagar);
        formDataPago.append(`trabajadores_relacionados[${i}][debe_simple]`, trb_disp.debe_simple);
      });
    }

    if (trabajadores_dispersados) {
      trabajadores_dispersados.forEach((trab:any, i:any) => {
        formDataPago.append(`trabajadores_dispersados[${i}][token_nomina_recibo]`, trab.token_nomina_recibo);
        formDataPago.append(`trabajadores_dispersados[${i}][nomina_moneda_name]`, trab.nomina_moneda_name);
        formDataPago.append(`trabajadores_dispersados[${i}][nomina_empleado_token]`, trab.nomina_empleado_token);
        formDataPago.append(`trabajadores_dispersados[${i}][importe_por_pagar]`, trab.importe_por_pagar);
        formDataPago.append(`trabajadores_dispersados[${i}][debe_simple]`, trab.debe_simple);
      });
    }

    for (var i = 0; i < evidencias_pagos.length; i++) {
      formDataPago.append("evidencias_pagos[]", evidencias_pagos[i]);
    }
    return this.httpClient.post(this.url+'finanzas_orden_pago_ordenpago_registra_dispersion_nomina',formDataPago).pipe(
      catchError(this.handlerError)
    );
  }

  confirmaPagoEspecieNomina(
    orden_pago_token:string,
    nomina_especie_token:string,
    order_importe:number,
    fecha_contabilizacion:string,
    order_caja:any,
    order_cuenta_bancaria:any,
    order_monedero_electronico:any,
    saldo_a_favor:any,
    order_moneda:any,
    order_tipo_cambio:any,
    order_forma_pago:any,
    trabajadores_dispersados:any,
    order_observacion:any,
    evidencias_pagos:any):Observable<any>{
    const formDataPago = new FormData();

    formDataPago.append("orden_pago_token",orden_pago_token);
    formDataPago.append("nomina_especie_token",nomina_especie_token);
    formDataPago.append("order_importe",order_importe.toString());
    formDataPago.append("fecha_contabilizacion",fecha_contabilizacion);
    formDataPago.append("saldo_a_favor",saldo_a_favor);
    formDataPago.append("order_moneda",order_moneda);
    formDataPago.append("order_tipo_cambio",order_tipo_cambio);
    formDataPago.append("order_forma_pago",order_forma_pago);
    formDataPago.append("trabajadores_dispersados",trabajadores_dispersados);
    formDataPago.append("order_observacion",order_observacion);
    
    if (order_caja) {
      order_caja.forEach((caja:any, i:any) => {
        formDataPago.append(`order_caja[${i}][token_caja]`, caja.token_caja);
        formDataPago.append(`order_caja[${i}][monto_aplicar]`, caja.monto_aplicar);
      });
    }
    
    if (order_cuenta_bancaria) {
      order_cuenta_bancaria.forEach((cuenta:any, i:any) => {
        formDataPago.append(`order_cuenta_bancaria[${i}][token_cuenta]`, cuenta.token_cuenta);
        formDataPago.append(`order_cuenta_bancaria[${i}][monto_aplicar]`, cuenta.monto_aplicar);
      });
    }
    
    if (order_monedero_electronico) {
      order_monedero_electronico.forEach((moned:any, i:any) => {
        formDataPago.append(`order_monedero_electronico[${i}][token_cuentaMon]`, moned.token_cuentaMon);
        formDataPago.append(`order_monedero_electronico[${i}][monto_aplicar]`, moned.monto_aplicar);
      });
    }

    if (trabajadores_dispersados) {
      trabajadores_dispersados.forEach((trab:any, i:any) => {
        formDataPago.append(`trabajadores_dispersados[${i}][token_especie_desglose]`, trab.token_especie_desglose);
        formDataPago.append(`trabajadores_dispersados[${i}][nomina_esp_moneda_name]`, trab.nomina_esp_moneda_name);
        formDataPago.append(`trabajadores_dispersados[${i}][nomina_empleado_token]`, trab.nomina_empleado_token);
        formDataPago.append(`trabajadores_dispersados[${i}][importe_por_pagar]`, trab.importe_por_pagar);
        formDataPago.append(`trabajadores_dispersados[${i}][debe_simple]`, trab.debe_simple);
      });
    }

    for (var i = 0; i < evidencias_pagos.length; i++) {
      formDataPago.append("evidencias_pagos[]", evidencias_pagos[i]);
    }
    return this.httpClient.post(this.url+'finanzas_orden_pago_ordenpago_registra_pago_nomina_especie',formDataPago).pipe(
      catchError(this.handlerError)
    );
  }

  confirmaMovimientoAcreedor(
    token_cat_acreedores:any,
    fecha_contabilizacion:any,
    pay_moneda:any,
    pay_tipo_cambio:any,
    pay_forma_pago:any,
    deudor_vinculado_token:any,
    movi_debe_haber:any,
    pay_importe:any,
    pay_caja:any,
    pay_cuenta_bancaria:any,
    pay_monedero_electronico:any,
    lista_movimientos:any,
    deu_saldo_aplicar:any,
    pay_observacion:any,
    evidencias_pagos:any):Observable<any>{
    console.log(deu_saldo_aplicar);
    const formDataPago = new FormData();
    /*var json_convert = JSON.stringify(
      {  
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_acreedores":token_cat_acreedores,
        "fecha_contabilizacion":fecha_contabilizacion,
        "pay_moneda":pay_moneda,
        "pay_tipo_cambio":pay_tipo_cambio,
        "pay_forma_pago":pay_forma_pago,
        "deudor_vinculado_token":deudor_vinculado_token,
        "movi_debe_haber":movi_debe_haber,
        "pay_importe":pay_importe,
        "pay_caja":pay_caja,
        "pay_cuenta_bancaria":pay_cuenta_bancaria,
        "pay_monedero_electronico":pay_monedero_electronico,
        "lista_movimientos":lista_movimientos,
        "deu_total_saldo_aplicar": typeof deu_saldo_aplicar !== 'undefined' ? deu_saldo_aplicar.deu_total_saldo_aplicar : 0,
        "pay_observacion":pay_observacion
      }
    );*/

    formDataPago.append("token_cat_acreedores",token_cat_acreedores);
    formDataPago.append("fecha_contabilizacion",fecha_contabilizacion);
    formDataPago.append("pay_moneda",pay_moneda);
    formDataPago.append("pay_tipo_cambio",pay_tipo_cambio);
    formDataPago.append("pay_forma_pago",pay_forma_pago);
    formDataPago.append("deudor_vinculado_token",deudor_vinculado_token);
    formDataPago.append("movi_debe_haber",movi_debe_haber);
    formDataPago.append("pay_importe",pay_importe);

    //formDataPago.append("pay_caja",pay_caja);
    if (pay_caja) {
      pay_caja.forEach((caja:any, i_c:any) => {
        formDataPago.append(`pay_caja[${i_c}][token_caja]`, caja.token_caja);
        formDataPago.append(`pay_caja[${i_c}][monto_aplicar]`, caja.monto_aplicar);
      });
    }

    //formDataPago.append("pay_cuenta_bancaria",pay_cuenta_bancaria);
    if (pay_cuenta_bancaria) {
      pay_cuenta_bancaria.forEach((cuenta:any, i_b:any) => {
        formDataPago.append(`pay_cuenta_bancaria[${i_b}][token_cuenta]`, cuenta.token_cuenta);
        formDataPago.append(`pay_cuenta_bancaria[${i_b}][monto_aplicar]`, cuenta.monto_aplicar);
      });
    }

    //formDataPago.append("pay_monedero_electronico",pay_monedero_electronico);
    if (pay_monedero_electronico) {
      pay_monedero_electronico.forEach((moned:any, i_me:any) => {
        formDataPago.append(`pay_monedero_electronico[${i_me}][token_cuentaMon]`, moned.token_cuentaMon);
        formDataPago.append(`pay_monedero_electronico[${i_me}][monto_aplicar]`, moned.monto_aplicar);
      });
    }

    //formDataPago.append("lista_movimientos",lista_movimientos);
    if (lista_movimientos) {
      lista_movimientos.forEach((l_mov:any, i_mov:any) => {
        formDataPago.append(`lista_movimientos[${i_mov}][token_pagos]`, l_mov.token_pagos);
        formDataPago.append(`lista_movimientos[${i_mov}][importe_por_pagar]`, l_mov.importe_por_pagar);
        formDataPago.append(`lista_movimientos[${i_mov}][debe_simple]`, l_mov.debe_simple);
      });
    }

    formDataPago.append("deu_total_saldo_aplicar",typeof deu_saldo_aplicar !== 'undefined' ? deu_saldo_aplicar.deu_total_saldo_aplicar : '0');
    formDataPago.append("pay_observacion",pay_observacion);

    for (var i_docs = 0; i_docs < evidencias_pagos.length; i_docs++) {
      formDataPago.append("evidencias_pagos[]", evidencias_pagos[i_docs]);
    }
    
    //formDataPago.append("json",json_convert);
    //console.log(json_convert);
    //let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_ordenpago_registra_movimiento_acreedor',formDataPago)
    .pipe(catchError(this.handlerError));
  }

  confirmaMovimientoDeudor(
    token_cat_deudores:any,
    fecha_contabilizacion:any,
    pay_moneda:any,
    pay_tipo_cambio:any,
    pay_forma_pago:any,
    acreedor_vinculado_token:any,
    movi_debe_haber:any,
    pay_importe:any,
    pay_caja:any,
    pay_cuenta_bancaria:any,
    pay_monedero_electronico:any,
    lista_movimientos:any,
    acr_saldo_aplicar:any,
    pay_observacion:any,
    evidencias_pagos:any
  ):Observable<any>{
    const formDataPago = new FormData();
    /*var json_convert = JSON.stringify(
      {  
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_deudores":token_cat_deudores,
        "fecha_contabilizacion":fecha_contabilizacion,
        "pay_moneda":pay_moneda,
        "pay_tipo_cambio":pay_tipo_cambio,
        "pay_forma_pago":pay_forma_pago,
        "acreedor_vinculado_token":acreedor_vinculado_token,
        "movi_debe_haber":movi_debe_haber,
        "pay_importe":pay_importe,
        "pay_caja":pay_caja,
        "pay_cuenta_bancaria":pay_cuenta_bancaria,
        "pay_monedero_electronico":pay_monedero_electronico,
        "lista_movimientos":lista_movimientos,
        "acr_total_saldo_aplicar": typeof acr_saldo_aplicar !== 'undefined' ? acr_saldo_aplicar.acr_total_saldo_aplicar : 0,
        "pay_observacion":pay_observacion
      }
    );*/

    formDataPago.append("token_cat_deudores",token_cat_deudores);
    formDataPago.append("fecha_contabilizacion",fecha_contabilizacion);
    formDataPago.append("pay_moneda",pay_moneda);
    formDataPago.append("pay_tipo_cambio",pay_tipo_cambio);
    formDataPago.append("pay_forma_pago",pay_forma_pago);
    formDataPago.append("acreedor_vinculado_token",acreedor_vinculado_token);
    formDataPago.append("movi_debe_haber",movi_debe_haber);
    formDataPago.append("pay_importe",pay_importe);

    //formDataPago.append("pay_caja",pay_caja);
    if (pay_caja) {
      pay_caja.forEach((caja:any, i_c:any) => {
        formDataPago.append(`pay_caja[${i_c}][token_caja]`, caja.token_caja);
        formDataPago.append(`pay_caja[${i_c}][monto_aplicar]`, caja.monto_aplicar);
      });
    }

    //formDataPago.append("pay_cuenta_bancaria",pay_cuenta_bancaria);
    if (pay_cuenta_bancaria) {
      pay_cuenta_bancaria.forEach((cuenta:any, i_b:any) => {
        formDataPago.append(`pay_cuenta_bancaria[${i_b}][token_cuenta]`, cuenta.token_cuenta);
        formDataPago.append(`pay_cuenta_bancaria[${i_b}][monto_aplicar]`, cuenta.monto_aplicar);
      });
    }

    //formDataPago.append("pay_monedero_electronico",pay_monedero_electronico);
    if (pay_monedero_electronico) {
      pay_monedero_electronico.forEach((moned:any, i_me:any) => {
        formDataPago.append(`pay_monedero_electronico[${i_me}][token_cuentaMon]`, moned.token_cuentaMon);
        formDataPago.append(`pay_monedero_electronico[${i_me}][monto_aplicar]`, moned.monto_aplicar);
      });
    }

    //formDataPago.append("lista_movimientos",lista_movimientos);
    if (lista_movimientos) {
      lista_movimientos.forEach((l_mov:any, i_mov:any) => {
        formDataPago.append(`lista_movimientos[${i_mov}][token_pagos]`, l_mov.token_pagos);
        formDataPago.append(`lista_movimientos[${i_mov}][importe_por_pagar]`, l_mov.importe_por_pagar);
        formDataPago.append(`lista_movimientos[${i_mov}][debe_simple]`, l_mov.debe_simple);
      });
    }

    formDataPago.append("acr_total_saldo_aplicar",acr_saldo_aplicar !== 'undefined' ? acr_saldo_aplicar.acr_total_saldo_aplicar : '0');
    formDataPago.append("pay_observacion",pay_observacion);

    for (var i_docs = 0; i_docs < evidencias_pagos.length; i_docs++) {
      formDataPago.append("evidencias_pagos[]", evidencias_pagos[i_docs]);
    }
    //formDataPago.append("json",json_convert);
    //console.log(json_convert);
    return this.httpClient.post(this.url+'finanzas_orden_pago_ordenpago_registra_movimiento_deudor',formDataPago)
    .pipe(catchError(this.handlerError));
  }

  pagoDirecto(token_proveedor:any,tokenCaja:any,tokenCuenta:any,tokenMonedero:any,
    token_formaPago:any,token_metodoPago:any,token_moneda:any,
    tipoCambio:any,selectedOrdenPagoCompra:any,imagenEvidenciaPagos:any,divEvidenciaVencidos:any):Observable<any>{
    console.log(token_proveedor);
    const formDataPago = new FormData();

    for (let a = 0; a < imagenEvidenciaPagos.length; a++) {
      console.log(imagenEvidenciaPagos[a].name);
      formDataPago.append("imagenEvidenciaPagos"+a,imagenEvidenciaPagos[a],imagenEvidenciaPagos[a].name)
    }
    formDataPago.append("length",imagenEvidenciaPagos.length)

    formDataPago.append("dataPago",JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proveedor":token_proveedor,"tokenCaja":tokenCaja,
      "tokenCuenta":tokenCuenta,"tokenMonedero":tokenMonedero,"token_formaPago":token_formaPago,
      "token_metodoPago":token_metodoPago,"token_moneda":token_moneda,"tipo_cambio":tipoCambio,
      "selectedOrdenPagoCompra":selectedOrdenPagoCompra,"imagenEvidenciaPagos":imagenEvidenciaPagos}));

    //console.log(json);
    //let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_registrapagodirecto',formDataPago).pipe(
      catchError(this.handlerError)
    );
  }

  //,this.arraySistemasContables,this.observacionesPago
  pagoReembolsoSinAuth(token_reembolso:any,saldo_pago_total:any,facturas_seleccionadas:any,evidencias_pagos:any):Observable<any>{
    const formData = new FormData();
    console.log(JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"saldo_pago_total":saldo_pago_total,"token_reembolso":token_reembolso,"facturas_seleccionadas":facturas_seleccionadas}));
    for (var i = 0; i < evidencias_pagos.length; i++) {
      formData.append("evidencias_pagos[]", evidencias_pagos[i]);
    }
    formData.append('json',JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"saldo_pago_total":saldo_pago_total,"token_reembolso":token_reembolso,"facturas_seleccionadas":facturas_seleccionadas}));
    console.log(formData);
    return this.httpClient.post(this.url+'finanzas_orden_pago_registrapagoreembolso_nivel_uno',formData).pipe(
      catchError(this.handlerError)
    );
  }
//,this.arraySistemasContables,this.observacionesPago
  pagoDirectoReembolso(token_reembolso:any,saldo_pago_total:any,facturas_seleccionadas:any,evidencias_pagos:any):Observable<any>{
    const formData = new FormData();
    console.log(JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"saldo_pago_total":saldo_pago_total,"token_reembolso":token_reembolso,"facturas_seleccionadas":facturas_seleccionadas}));
    for (var i = 0; i < evidencias_pagos.length; i++) {
      formData.append("evidencias_pagos[]", evidencias_pagos[i]);
    }
    formData.append('json',JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"saldo_pago_total":saldo_pago_total,"token_reembolso":token_reembolso,"facturas_seleccionadas":facturas_seleccionadas}));
    console.log(formData);
    return this.httpClient.post(this.url+'finanzas_orden_pago_registrapagoreembolso_directo',formData).pipe(
      catchError(this.handlerError)
    );
  }

  detenerPagoReembolso(token_reembolso:any,solicitud_reembolso:any,orden_pago:any,token_pago:any,name_caja:any,name_cuenta_banc:any,name_cuenta_mone:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_reembolso":token_reembolso,
      "solicitud_reembolso":solicitud_reembolso,
      "orden_pago":orden_pago,
      "token_pago":token_pago,
      "name_caja":name_caja,
      "name_cuenta_banc":name_cuenta_banc,
      "name_cuenta_mone":name_cuenta_mone
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_detenerpagoreembolso',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  autorizarPagoReembolso(token_reembolso:any,solicitud_reembolso:any,orden_pago:any,token_pago:any,name_caja:any,name_cuenta_banc:any,name_cuenta_mone:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_reembolso":token_reembolso,
      "solicitud_reembolso":solicitud_reembolso,
      "orden_pago":orden_pago,
      "token_pago":token_pago,
      "name_caja":name_caja,
      "name_cuenta_banc":name_cuenta_banc,
      "name_cuenta_mone":name_cuenta_mone
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'finanzas_orden_pago_autorizarpagoreembolso',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listando_solicitudes_cancelacion(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    const link = this.url + 'finanzas_orden_pago_solicitudes_de_cancelacion';
    const cacheKlave = link+'|'+data;
    this.cache.delete(link + '|' + data);

    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this.httpClient.post(link,data).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  actualiza_solicitud_de_cancelacion(cancel_soli_token:string) :Observable<any>{
    let data = {"cancel_soli_token":cancel_soli_token};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_actualiza_solicitud_de_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  solicitud_cancelacion_pago(token_cancel_solip:string,token_pagos:string):Observable<any>{
    let data = {"token_cancel_solip":token_cancel_solip,"token_pagos":token_pagos};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitud_cancelacion_pago',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_pago(cancel_soli_token:string,fecha_contabilizacion:string,comentarios_confirma_cancelacion:string):Observable<any>{
    let json = JSON.stringify({"cancel_soli_token":cancel_soli_token,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"cancel_soli_token":cancel_soli_token,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'finanzas_orden_pago_confirmar_cancelacion_pago',data).pipe(
      catchError(this.handlerError)
    );
  }

  solicitud_cancelacion_orden_pago(token_cancel_soliordp:any,token_orden_pago:any):Observable<any>{
    let data = {"token_cancel_soliordp":token_cancel_soliordp,"token_orden_pago":token_orden_pago};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitud_cancelacion_orden_pago',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_orden_pago(token_cancel_soliordp:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_soliordp":token_cancel_soliordp,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_soliordp":token_cancel_soliordp,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'finanzas_orden_pago_confirmar_cancelacion_orden_pago',data).pipe(
      catchError(this.handlerError)
    );
  }

  solicitud_cancelacion_reembolso_orden_pago(token_cancel_reem:any,reem_cancel_main_token:any,reem_cancel_soli_token:any,reem_cancel_compra_vinc_token:any):Observable<any>{
    let data = {
      "token_cancel_reem":token_cancel_reem,
      "reem_token":reem_cancel_main_token,
      "reem_soli_token":reem_cancel_soli_token,
      "compra_token":reem_cancel_compra_vinc_token
    };
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitud_cancelacion_reembolso_orden_pago',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_reembolso_orden_pago(ordenes_de_pago:any,token_cancel_reem:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"ordenes_de_pago":ordenes_de_pago,"token_cancel_reem":token_cancel_reem,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"ordenes_de_pago":ordenes_de_pago,"token_cancel_reem":token_cancel_reem,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'finanzas_orden_pago_confirmar_cancelacion_reembolso_orden_pago',data).pipe(
      catchError(this.handlerError)
    );
  }

  solicitud_cancelacion_mcp(token_cancel_mcp:any,movimiento_cp_token:any):Observable<any>{
    let data = {"token_cancel_mcp":token_cancel_mcp,"movimiento_cp_token":movimiento_cp_token};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitud_cancelacion_mcp',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_mcp(token_cancel_mcp:any,movimiento_cp_token:any,fecha_contabilizacion:any,observaciones:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_mcp":token_cancel_mcp,"movimiento_cp_token":movimiento_cp_token,"fecha_contabilizacion":fecha_contabilizacion,"observaciones":observaciones});
    console.log(json);
    let data = {
      "token_cancel_mcp":token_cancel_mcp,
      "movimiento_cp_token":movimiento_cp_token,
      "fecha_contabilizacion":fecha_contabilizacion,
      "observaciones":observaciones
    };
    return this.httpClient.post(this.url+'finanzas_orden_pago_confirmar_cancelacion_mcp',data).pipe(
      catchError(this.handlerError)
    );
  }

  solicitud_cancelacion_anticipo(token_cancel_soliant:string,anticipo_uuid:string):Observable<any>{
    let data = {"token_cancel_soliant":token_cancel_soliant,"anticipo_uuid":anticipo_uuid};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitud_cancelacion_anticipo',data)
    .pipe(catchError(this.handlerError));
  }

  confirma_cancelacion_anticipo(token_cancel_soliant:string,fecha_contabilizacion:string,comentarios_confirma_cancelacion:string):Observable<any>{
    let json = JSON.stringify({"token_cancel_soliant":token_cancel_soliant,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_soliant":token_cancel_soliant,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'finanzas_orden_pago_confirmar_cancelacion_anticipo',data).pipe(
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
