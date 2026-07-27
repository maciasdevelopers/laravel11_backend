import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfProductos } from '../../interfaces/interf-productos';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { productoAngularModelo } from '../../modelos/productoAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  //ingresos
    prodIngresosVigentes():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'listavntsProductosVigentes',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }
    
    prodMercancias():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      //console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_productosForVentas',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    detalleMercancia(token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'detallemercancia',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

  //inventarios
    productosCatGeneral(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
      let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
      return this._httpClient.post(this.url+'inventarios_catalogos_productos_general',data)
      .pipe(catchError(this.handlerError));
    }

  //inventarios
    productosInventariosCat(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
      let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
      return this._httpClient.post(this.url+'inventarios_catalogos_productos_inventarios',data)
      .pipe(catchError(this.handlerError));
    }

    prodVentasMostradorLista(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
      let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
      return this._httpClient.post(this.url+'inventarios_catalogos_productos_mostrador',data)
      .pipe(catchError(this.handlerError));
    }

    prodInventariosBusquedaByCode(scanner_codigo:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"scanner_codigo":scanner_codigo});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_detalleproductoByCode',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    prodInventariosEliminados():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      //console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_productosEliminados',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    inventariosDetalleProducto(dattknprod:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proddata":dattknprod});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_detalle_producto_inventarios',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    mostradorDetalleProducto(dattknprod:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proddata":dattknprod});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_detalle_producto_mostrador',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    verAlmacenProducto(dattknprod:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proddata":dattknprod});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_detalleproducto_almacen',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    verKardexProducto(token_cat_productos:any):Observable<any>{
      let data = {"token_cat_productos":token_cat_productos};
      return this._httpClient.post(this.url+'inventarios_catalogos_detalleproducto_kardex',data)
      .pipe(catchError(this.handlerError));
    }

    updateLogotipoProducto(token_cat_productos:any,imgProdCaarga:File):Observable<any>{
      const formData = new FormData();
      if (imgProdCaarga) {
        formData.append('imgProdCaarga', imgProdCaarga, imgProdCaarga.name);
      }
      formData.append('data_producto',JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos}));
      return this._httpClient.post(this.url+'updatearticulologo',formData)
      .pipe(catchError(this.handlerError));
    }

    updateGeneralesProducto(token_cat_productos:any,
      concepto:any,
      familia:any,
      clasificacion:any,
      genero:any,
      marca:any,
      stock_min:any,
      stock_max:any,
      costeo:any,
      unidad_entrada_clave:any,
      unidad_salida_clave:any,
      moneda_codigo:any,
      cuenta_contable:any,
      uso_prod:any,
      num_serie:any,
      num_lote:any,
      pedimentoAduanal:any,        
      sat_clave_code:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_productos":token_cat_productos,
        "concepto":concepto,
        "familia":familia,
        "clasificacion":clasificacion,
        "genero":genero,
        "marca":marca,
        "stock_min":stock_min,
        "stock_max":stock_max,
        "costeo":costeo,
        "unidad_entrada_clave":unidad_entrada_clave,
        "unidad_salida_clave":unidad_salida_clave,
        "moneda_codigo":moneda_codigo,
        "cuenta_contable":cuenta_contable,
        "uso_prod":uso_prod,
        "num_serie":num_serie,
        "num_lote":num_lote,
        "pedimentoAduanal":pedimentoAduanal,
        "sat_clave_code":sat_clave_code
      });
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_updategeneralesproducto',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    updateGeneralesMostraVentProducto(token_cat_productos:any,concepto:any,precio_aplicable:any,unidad_salida_clave:any,moneda_codigo:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_productos":token_cat_productos,
        "concepto":concepto,
        "precio_aplicable":precio_aplicable,
        "unidad_salida_clave":unidad_salida_clave,
        "moneda_codigo":moneda_codigo
      });
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_updategeneralesmostradorproducto',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    agregaCaracterisicasProd(token_cat_productos:any,nuevas_caracteristicas:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos,"nuevas_caracteristicas":nuevas_caracteristicas});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_agregacaracteristicaproducto',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    eliminaCaracterisicasProd(token_cat_productos:any,caracteristicas:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos,"caracteristicas":caracteristicas});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_deletecaracteristicaproducto',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    agregaClavesProd(token_cat_productos:any,nuevas_claves:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos,"nuevas_claves":nuevas_claves});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_agregaclavesinternasproducto',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    eliminaClavesProd(token_cat_productos:any,claves:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos,"claves":claves});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_deleteclavesinternasproducto',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    recargaProvProductoDetalle(token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'recargaprovproductos',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    updateClaveProdProv(token_cat_productos:any,prv_claves:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_productos":token_cat_productos,
        "prv_claves":prv_claves
      });
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_updateclaveprodproveedor',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    eliminaClaveProdProv(token_cat_productos:any,prv_claves:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_productos":token_cat_productos,
        "prv_claves":prv_claves
      });
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_deleteclaveprodproveedor',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    nuevoClaveProdProv(token_cat_productos:any,prv_claves:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_productos":token_cat_productos,
        "prv_claves":prv_claves});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_appendclaveprodproveedor',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    deleteDocProducto(token_cat_productos:any,docs_delete:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),
        "token_cat_productos":token_cat_productos,
        "docs_delete":docs_delete});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_deleteanexosproducto',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      );
    }

    registraNuevoDocProducto(token_cat_productos:any,docsProdAnexos:any):Observable<any>{
      let json:any = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      
      const formData = new FormData();
      for (let i = 0; i < docsProdAnexos.length; i++) {
       formData.append("docsProdAnexos[]",docsProdAnexos[i]);
      }
      
      formData.append("json",json);
      console.log(formData);
      console.log(json);
      return this._httpClient.post(this.url+'inventarios_catalogos_registraanexosproducto',formData)
      .pipe(catchError(this.handlerError));
    }

    cambiaAlmacenProd(dattknprod:any,tknTabAlm:any,tknDetAlm:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proddata":dattknprod,"tknTabAlm":tknTabAlm,"tknDetAlm":tknDetAlm});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'changalmproducto',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    solicitarValidateProducto(token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_productos_solicita_valid',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      ); // enviar las peticiones ajax
    }

    catalogoProductosNotAutorizados():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_productos_no_autorizados',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    productoAutorizar(token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_validacion_proceso_productos',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    moverPapeleraProducto(dattknprod:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proddata":dattknprod});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_producto_papelera_save',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    restauraProducto(dattknprod:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proddata":dattknprod});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_producto_restaurar',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    eliminaDefProducto(dattknprod:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proddata":dattknprod});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'inventarios_catalogos_producto_delete_perm',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    registraNewProducto(
      modelProd:productoAngularModelo,

      caracteristicas:any,
      listaClaveProd:any,
      proveedor:any,
      docsProdAnexos:any,
      prodAnexosNames:any
    ):Observable<any>{
      let json:any = JSON.stringify({
        "user_token":sessionStorage.getItem('inside_session_code'),
        "concepto":modelProd.concepto,
        "familia":modelProd.familia,
        "marca":modelProd.marca,
        "clasificacion":modelProd.clasificacion,
        "genero":modelProd.genero,
        "stock_min":modelProd.stock_min,
        "stock_max":modelProd.stock_max,
        "control_inventarios":modelProd.control_inventarios,
        "costeo":modelProd.costeo,
        "unidad_entrada_clave":modelProd.unidad_entrada_clave,
        "unidad_salida_clave":modelProd.unidad_salida_clave,
        "moneda_codigo":modelProd.moneda_codigo,
        "cuenta_contable":modelProd.cuenta_contable,
        //"uso_prod":modelProd.uso_prod,
        "num_serie":modelProd.num_serie,
        "num_lote":modelProd.num_lote,
        "pedimentoAduanal":modelProd.pedimentoAduanal,
        "nivel_alm":modelProd.nivel_alm,
        "sat_clave_code":modelProd.sat_clave_code,
        "sat_clave_homologada":modelProd.sat_clave_homologada,
        "caracteristicas":caracteristicas,
        "claves_internas":listaClaveProd,
        "proveedor":proveedor,
        "prodAnexoName":prodAnexosNames
      });
      
      const formData = new FormData();
      for (let i = 0; i < docsProdAnexos.length; i++) {
       formData.append("docsProdAnexos[]",docsProdAnexos[i]);
      }
      
      formData.append("json",json);
      console.log(formData);
      console.log(json);
      return this._httpClient.post(this.url+'inventarios_catalogos_createarticulo',formData)
      .pipe(catchError(this.handlerError));
    }

    prodPorProveedor(proveedor:any): Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"provv":proveedor});
      //console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post<InterfProductos[]>(this.url+'inventarios_catalogos_prodPorProveedor',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    prodMercanciasProcessBuyFaceProrrateos(cant_art_prorrateo:number):Observable<any>{
      let data = {"cant_art_prorrateo":cant_art_prorrateo};
      console.log(data);
      return this._httpClient.post(this.url+'egresos_compras_prorrateos_prorratear_productos',data)
      .pipe(catchError(this.handlerError));
    }
  //asociados
    catalogoProductosAsociados():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json:any = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'modulo_mostrador_productos_catalogo',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    mostradorEliminaProducto(token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'modulo_mostrador_productos_papelera_save',parametros, {headers: headers}).pipe(
        catchError(this.handlerError)
      ); // enviar las peticiones ajax
    }

    catalogoProductosEliminadosMostrador():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json:any = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'modulo_mostrador_productos_papelera_catalogo',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    catalogoProductosMostradorRestaurar(token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'modulo_mostrador_productos_restaurar',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    catalogoProductosMostradorDeletePerm(token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'modulo_mostrador_productos_eliminar',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    registraNewProductoMostrador(
      concepto:any,
      precio:any,
      unidad_salida_clave:any,
      unidad_salida_homologada:any,
      moneda_codigo:any,
      moneda_homologada:any,
      listaClaveProd:any,
      impuestos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json:any = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"concepto":concepto,"precio":precio,
        "unidad_salida_clave":unidad_salida_clave,"unidad_salida_homologada":unidad_salida_homologada,
        "moneda_codigo":moneda_codigo,"moneda_homologada":moneda_homologada,"claves_internas":listaClaveProd,"impuestos":impuestos});
      console.log(json);
      let parametros = 'json='+json;
      //createarticulo_asociados
      return this._httpClient.post(this.url+'inventarios_catalogos_mostrador_createarticulo',parametros, {headers: headers})
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
