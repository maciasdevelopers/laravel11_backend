import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class VentasServService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  folioNewVenta():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_ventas_newFolioVenta',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  listaArticulos():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_ventas_cargaArticulosVenta',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  listaArticulosClient(tokenCliente:any,token_lista_precios:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"tokenCliente":tokenCliente,"token_lista_precios":token_lista_precios});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_ventas_cargaArticulosVenta',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getArticuloDet(tokenArticulo:any,cantidad:any,valdescuento:any,arrayTokenDescuento:any,valpromocion:any,importePartida:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"tkn_articulo":tokenArticulo,
      "cantidad":cantidad,"descuento":valdescuento,"arrayDescuentos":arrayTokenDescuento,"promocion":valpromocion,"importePartida":importePartida});
      console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_ventas_descargarttosell',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getArticuloDetProd(arrayselectLotSerAdu:any,tokenArticulo:any,cantidad:any,valdescuento:any,arrayTokenDescuento:any,valpromocion:any,importePartida:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"lotSerAdu":arrayselectLotSerAdu,"tkn_articulo":tokenArticulo,
      "cantidad":cantidad,"descuento":valdescuento,"arrayDescuentos":arrayTokenDescuento,"promocion":valpromocion,"importePartida":importePartida});
      console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_ventas_descargarttosellpr',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  registraVenta(
    HiddenclienteToken:any,
    ListaPrecV:any,
    MonedaClientV:any,
    TipoCambioClientV:any,
    arrayDesgloseVenta:any,
    datosCaja:any,
    datosCajaAlmacenDir:any,
    responsableEntrega:any,
    arrayFormaPago:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "HiddenclienteToken":HiddenclienteToken,
      "ListaPrecV":ListaPrecV,
      "MonedaClientV":MonedaClientV,
      "TipoCambioClientV":TipoCambioClientV,
      "arrayDesgloseVenta":arrayDesgloseVenta,
      "datosCaja":datosCaja,
      "datosCajaAlmacenDir":datosCajaAlmacenDir,
      "responsableEntrega":responsableEntrega,
      "arrayFormaPago":arrayFormaPago});
      console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_ventas_registraventa',params,{headers: headers}).pipe(catchError(this.handlerError))
  }

  moduloMostradorBusquedaArticulos(busqueda:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"busqueda":busqueda});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_buscaArticulosVenta',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  moduloMostradorArticulosLista():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_articulosVenta',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  moduloMostradorArticulosBusquedaByCode(scanner_codigo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"scanner_codigo":scanner_codigo});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_articulosVentaByCode',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  registraMostradorVenta(
    token_cat_clientes:any,
    token_puntodeventa:any,
    mx_venta_moneda_codigo:any,
    mx_venta_moneda_decimales:any,
    cnvr_venta_tipo_cambio_simple:any,
    cnvr_venta_moneda_codigo:any,
    cnvr_venta_moneda_decimales:any,
    listaArticulosVenta:any,
    generar_factura:any,
    codigo_acceso_venta_cifrado:any,
    password_acceso_venta_cifrado:any,

    venta_cobro_forma_generada:any,
    venta_cobro_fecha:any,
    venta_cobro_banco:any,
    venta_cobro_cuenta_card_clabe:any,
    venta_cobro_clave_referencia:any,
    venta_cobro_moneda:any,
    cobro_moneda_decimales:any,
    venta_cobro_importe:any,
    venta_tipo_cambio_simple:any,
    venta_cobro_concepto:any):Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes,"token_puntodeventa":token_puntodeventa,"mx_venta_moneda_codigo":mx_venta_moneda_codigo,
      "mx_venta_moneda_decimales":mx_venta_moneda_decimales,"cnvr_venta_tipo_cambio_simple":cnvr_venta_tipo_cambio_simple,"cnvr_venta_moneda_codigo":cnvr_venta_moneda_codigo,"cnvr_venta_moneda_decimales":cnvr_venta_moneda_decimales,
      "listaArticulosVenta":listaArticulosVenta,"generar_factura":generar_factura,"imperial_code":codigo_acceso_venta_cifrado,"imperial_pass":password_acceso_venta_cifrado,"venta_cobro_forma_generada":venta_cobro_forma_generada,
      "venta_cobro_fecha":venta_cobro_fecha,"venta_cobro_banco":venta_cobro_banco,"venta_cobro_cuenta_card_clabe":venta_cobro_cuenta_card_clabe,
      "venta_cobro_clave_referencia":venta_cobro_clave_referencia,"venta_cobro_moneda_code":venta_cobro_moneda,"venta_cobro_moneda_decimales":cobro_moneda_decimales,
      "venta_cobro_importe":venta_cobro_importe,"venta_cobro_tipo_cambio":venta_tipo_cambio_simple,"venta_cobro_concepto":venta_cobro_concepto});
      console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_registraventa',params,{headers: headers}).pipe(catchError(this.handlerError))
  }

  registraCobroMostradorVenta(token_venta_generada:any,venta_cobro_bool_generar:any,venta_cobro_forma_generada:any,venta_cobro_fecha:any,venta_cobro_banco:any,
    venta_cobro_cuenta_card_clabe:any,venta_cobro_clave_referencia:any,venta_cobro_moneda:any,cobro_moneda_decimales:any,venta_cobro_importe:any,
    venta_tipo_cambio_simple:any,venta_cobro_concepto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),
      "token_venta_generada":token_venta_generada,"venta_cobro_bool_generar":venta_cobro_bool_generar,"venta_cobro_forma_generada":venta_cobro_forma_generada,
      "venta_cobro_fecha":venta_cobro_fecha,"venta_cobro_banco":venta_cobro_banco,"venta_cobro_cuenta_card_clabe":venta_cobro_cuenta_card_clabe,
      "venta_cobro_clave_referencia":venta_cobro_clave_referencia,"venta_cobro_moneda_code":venta_cobro_moneda,"venta_cobro_moneda_decimales":cobro_moneda_decimales,
      "venta_cobro_importe":venta_cobro_importe,"venta_cobro_tipo_cambio":venta_tipo_cambio_simple,"venta_cobro_concepto":venta_cobro_concepto});
      console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_registracobroventa',params,{headers: headers}).pipe(catchError(this.handlerError))
  }

  ventaMostradorAcceso(codigo_acceso_venta_cifrado:any,password_acceso_venta_cifrado:any,imperial_folio_venta:any):Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"imperial_code":codigo_acceso_venta_cifrado,"imperial_pass":password_acceso_venta_cifrado,"folio_venta":imperial_folio_venta});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_venta_acceso',params,{headers: headers}).pipe(catchError(this.handlerError))
  }

  ventaMostradorCatalogo():Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_ventascatalogogeneral',params,{headers: headers}).pipe(catchError(this.handlerError))
  }

  ventaMostradorCanceladasCatalogo():Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_ventascatalogocanceladas',params,{headers: headers}).pipe(catchError(this.handlerError))
  }


  ventaMostradorDetalleInside(token_ventas:any):Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_ventas":token_ventas});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_venta_inside_detalle',params,{headers: headers}).pipe(catchError(this.handlerError))
  }

  ventaMostradorCancelar(token_ventas:any,razones_cancelacion:any):Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_ventas":token_ventas,"razones_cancelacion":razones_cancelacion});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_venta_cancelar',params,{headers: headers}).pipe(catchError(this.handlerError))
  }


  ventaMostradorDetalle():Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_mostrador_venta_detalle',params,{headers: headers}).pipe(catchError(this.handlerError))
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
