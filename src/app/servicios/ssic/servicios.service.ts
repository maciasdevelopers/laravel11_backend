import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfServicios } from '../../interfaces/intef-servicios';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { servicioAngularModelo } from '../../modelos/servicioAngularModelo';
import { fileAngularModelo } from '../../modelos/fileAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  servVigentes(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_listaserviciosvigentesingresos', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  viewServIngresosVigentes(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_detalleingresosservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  downpdfservingresos(tknServicio: any): Observable<any> {
    let sos_tokens: any = sessionStorage.getItem('inside_session_code');
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json'); //cabeceras
    headers.append('user_token', sos_tokens); //cabeceras
    headers.append('servdata', tknServicio); //cabeceras
    return this._httpClient.get(this.url + 'ingresos_catalogos_downloadservicioingresospdf', { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  actualizaServIngresos(token_cat_servicio: any, fechaAlta: any, clasificacion: any, genero: any, clave_sat: any, concepto: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "fechaAlta": fechaAlta, "clasificacion": clasificacion, "genero": genero, "clave_sat": clave_sat, "concepto": concepto
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_actualizageneralservicioingresos', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  vinculaImpuestoServicio(token_cat_servicio: any, token_cat_impuestos: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio, "token_cat_impuestos": token_cat_impuestos });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_vincimpuestoservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  desvinculaImpuestoServicio(token_cat_servicio: any, token_cat_impuestos: any, imp_art_token: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "token_cat_impuestos": token_cat_impuestos, "imp_art_token": imp_art_token
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_desvincimpuestoservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  actualizaServClient(token_cat_servicio: any, token_cat_clientes: any, serv_claveTkn: any, clave: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "tknCliente": token_cat_clientes, "serv_claveTkn": serv_claveTkn, "clave": clave
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_clavesactualizaclienteservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  eliminarServClient(token_cat_servicio: any, token_cat_clientes: any, serv_claveTkn: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "tknCliente": token_cat_clientes, "serv_claveTkn": serv_claveTkn
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_deleteclavesclienteservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  addNewServClient(token_cat_servicio: any, token_cat_clientes: any, clave: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "tknCliente": token_cat_clientes, "clave": clave
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_newclienteclaveservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  moveToPapServIngresos(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_deleteservicioingresos', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  servEliminados(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_listaservicioseliminadosingresos', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  restartServIngresos(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_servicioingresosrestart', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  deadPapServIngresos(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'ingresos_catalogos_eliminazionservingresos', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  registraServIngresos(imagen: File,
    fechaAlta: any,
    clasificacion: any,
    genero: any,
    clave_sat: any,
    tknSat: any,
    concepto: any,
    token_unidad_medida: any,
    token_monedaServAlta: any,
    txttipoCam: any,
    txtCantSim: any,
    txtPrecioB: any,
    txtSubtotal: any,
    catImpVigArray: any,
    arrayDescuentos: any,
    arrayPromociones: any,
    arrayAltaDescuentos: any,
    arrayAltaPromociones: any,
    arrayClaveClientServ: any): Observable<any> {
    //let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    //let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"servdata":servicio});
    const formData = new FormData();
    if (imagen) {
      formData.append('image', imagen, imagen.name);
    } else {
      formData.append('image', '');
    }
    formData.append('servdata',
      JSON.stringify({
        "user_token": sessionStorage.getItem('inside_session_code'),
        "fechaAlta": fechaAlta,
        "clasificacion": clasificacion,
        "genero": genero,
        "clave_sat": clave_sat,
        "tknSat": tknSat,
        "concepto": concepto,
        "token_unidad_medida": token_unidad_medida,
        "token_monedaServAlta": token_monedaServAlta,
        "txttipoCam": txttipoCam,
        "txtCantSim": txtCantSim,
        "txtPrecioB": txtPrecioB,
        "txtSubtotal": txtSubtotal,
        "catImpVigArray": catImpVigArray,
        "arrayDescuentos": arrayDescuentos,
        "arrayPromociones": arrayPromociones,
        "arrayAltaDescuentos": arrayAltaDescuentos,
        "arrayAltaPromociones": arrayAltaPromociones,
        "arrayClaveClientServ": arrayClaveClientServ
      }));
    console.log(formData);
    return this._httpClient.post(this.url + 'ingresos_catalogos_registroservicioingresos', formData)
      .pipe(catchError(this.errorHandler));
  }



  //inventarios
  //venta
  //ventas de mostrador
  InventariosCatalogosMostradorCreateServicio(concepto: any, precio: any, unidad_medida: any, moneda_codigo: any, impuestos: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json: any = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "concepto": concepto, "precio": precio,
      "unidad_medida": unidad_medida, "moneda_codigo": moneda_codigo, "impuestos": impuestos
    });
    console.log(json);
    let parametros = 'json=' + json;
    //createarticulo_asociados
    return this._httpClient.post(this.url + 'inventarios_catalogos_mostrador_createservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  InventariosCatalogosMostradorCatalogoServ(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_mostrador_catalogoserv', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  InventariosCatalogosMostradorServicioPerfil(token_cat_servicios: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json: any = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicios": token_cat_servicios });
    console.log(json);
    let parametros = 'json=' + json;
    //createarticulo_asociados
    return this._httpClient.post(this.url + 'inventarios_catalogos_mostrador_servicioperfil', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  InventariosCatalogosMostradorServicioActualiza(token_cat_servicios: any, concepto: any, precio: any, unidad_medida: any, moneda_codigo: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicios": token_cat_servicios,
      "concepto": concepto, "precio": precio, "moneda_codigo": moneda_codigo, "unidad_medida": unidad_medida
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_mostrador_servicioupdate', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  //ventas catalogo general
  InventariosCatalogosGeneralCreateServicio(concepto: any, precio: any, unidad_medida: any, moneda_token: any, impuestos: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json: any = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "concepto": concepto, "precio": precio,
      "unidad_medida": unidad_medida, "moneda_codigo": moneda_token, "impuestos": impuestos
    });
    console.log(json);
    let parametros = 'json=' + json;
    //createarticulo_asociados
    return this._httpClient.post(this.url + 'inventarios_catalogos_general_createservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  InventariosCatalogosGeneralCatalogoServ(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_general_catalogoserv', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  InventariosCatalogosGeneralDeletedServ(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_general_deletedserv', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  InventariosCatalogosMostradorDelete(token_cat_servicios: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json: any = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicios": token_cat_servicios });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_mostrador_serviciodelete', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  serviciosCatalogoGeneral(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_serviciosVigentes', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  servEgresosCompras(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_servicios_compras', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  viewServEgresosVigentes(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_detalleservicioegresos', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  downpdfservegresos(tknServicio: any): Observable<any> {
    let sos_tokens: any = sessionStorage.getItem('inside_session_code');
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json'); //cabeceras
    headers.append('user_token', sos_tokens); //cabeceras
    headers.append('servdata', tknServicio); //cabeceras
    return this._httpClient.get(this.url + 'inventarios_catalogos_downpdfservegresos', { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  actualizaServCompras(token_cat_servicio: any, concepto: any, clasificacion: any, genero: any, clave_sat: any, unidad_medida_clave: any, proveedor_vinc: any, nuevo_proveedor: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio, "concepto": concepto, "clasificacion": clasificacion, "genero": genero,
      "clave_sat": clave_sat, "unidad_medida_clave": unidad_medida_clave, "proveedor_vinc": proveedor_vinc, "nuevo_proveedor": nuevo_proveedor
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_servicios_compras_update', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  actualizaServVentas(token_cat_servicio: any, fechaAlta: any, clasificacion: any, genero: any, clave_sat: any, concepto: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "fechaAlta": fechaAlta, "clasificacion": clasificacion, "genero": genero, "clave_sat": clave_sat, "concepto": concepto
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_updateservicioventas', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  recargaProvServicioDetalle(token_cat_servicios: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicios": token_cat_servicios });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_recargaprovservicios', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  actualizaServProv(token_cat_servicio: any, proveedor: any, serv_claveTkn: any, clave: any, tiene_clave: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "tknProveedor": proveedor, "serv_claveTkn": serv_claveTkn, "clave": clave, "tiene_clave": tiene_clave
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_updateservicioprov', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  eliminarServProv(token_cat_servicio: any, proveedor: any, serv_claveTkn: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "tknProveedor": proveedor, "serv_claveTkn": serv_claveTkn
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_deleteservicioprov', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  addNewServProv(token_cat_servicio: any, proveedor: any, clave: any, tiene_clave: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicio": token_cat_servicio,
      "tknProveedor": proveedor, "clave": clave, "tiene_clave": tiene_clave
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_newservicioprov', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  solicitarValidateServicio(token_cat_servicios: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicios": token_cat_servicios });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_servicios_solicita_valid', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  moveToPapServEgresos(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_servicio_papelera_save', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  inventariosServiciosNotAutorizados(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_servicios_no_autorizados', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  servicioAutorizar(token_cat_servicios: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "token_cat_servicios": token_cat_servicios });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_validacion_proceso_servicios', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  servEgresosEliminados(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code') });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_serviciosEliminados', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  restartServEgresos(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_servicio_restaurar', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  deadPapServEgresos(tknServicio: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({ "user_token": sessionStorage.getItem('inside_session_code'), "servdata": tknServicio });
    //console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_servicio_delete_perm', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));
  }

  registraServEgresos(concepto: any, clasificacion: any, genero: any,cuenta_contable:any, clave_sat: any, unidad_medida_clave: any, proveedor: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token": sessionStorage.getItem('inside_session_code'), 
      "concepto": concepto, 
      "clasificacion": clasificacion, 
      "genero": genero,
      "cuenta_contable":cuenta_contable,
      "clave_sat": clave_sat, 
      "unidad_medida_clave": unidad_medida_clave, 
      "proveedor": proveedor
    });
    console.log(json);
    let parametros = 'json=' + json;
    return this._httpClient.post(this.url + 'inventarios_catalogos_appendservicio', parametros, { headers: headers })
      .pipe(catchError(this.errorHandler));

    //const formData = new FormData();
    //let sos_tokens:any = sessionStorage.getItem('inside_session_code');
    //formData.append('user_token',sos_tokens);
    //formData.append('servdata',JSON.stringify(servicio));
    //console.log(formData);
    //return this._httpClient.post(this.url+'inventarios_catalogos_appendservicio',formData)
    //.pipe(catchError(this.errorHandler));
  }

  errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMensaje = '';
    if (error.error instanceof ErrorEvent) {
      errorMensaje = error.error.message;
    } else {
      errorMensaje = `Error code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMensaje);
  }


}
