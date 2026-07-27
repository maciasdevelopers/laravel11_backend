import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, shareReplay, tap} from 'rxjs/operators';
import { InterfProveedores } from '../interfaces/interf-proveedores';
import { global } from './global_ssic';
import { Usuarios } from '../modelos/Usuarios';
import { __setFunctionName } from 'tslib';
import { AsYouType } from 'libphonenumber-js';
import { ServEncryptService } from './ssic/serv-encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  public url: string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private httpClient: HttpClient,
    private encryptor:ServEncryptService
  ) {
    this.url = global.urlApi;
  }

  catalogoProveedoresGeneral(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_general',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  catalogoProveedoresForProcesos():Observable<any>{
    const link = this.url + 'egresos_catalogos_proveedores_for_procesos';
    //const token = sessionStorage.getItem('inside_session_code');
    //const body = 'json=' + JSON.stringify({ user_token: token });
    //const headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    //const cacheKlave = link+'|'+token;
    //this.cache.delete(link + '|' + token);
    let data = {"periodo":'all_partidas',"periodo_inicio":'',"periodo_fin":''};
    const cacheKlave = link;    

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

  catalogoProveedoresMX(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_mx',data).pipe(
      catchError(this.handlerError)
    ); //
    /*const link = this.url + 'egresos_catalogos_proveedores_mx';
    const token = sessionStorage.getItem('inside_session_code');
    const body = 'json=' + JSON.stringify({ user_token: token });
    const cacheKlave = link+'|'+token;
    this.cache.delete(link + '|' + token);
    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    const peticion$ = this.httpClient.post(link,body, {headers}).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;*/
  }

  catalogoProveedoresExtranjeros(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let json = JSON.stringify({"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin});
    console.log(json);
    let data = {
      "periodo":filtro,
      "periodo_inicio":periodo_inicio,
      "periodo_fin":periodo_fin
    };
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_extranjeros',data).pipe(
      catchError(this.handlerError)
    );
    /*const link = this.url + 'egresos_catalogos_proveedores_extranjeros';
    const token = sessionStorage.getItem('inside_session_code');
    const body = 'json=' + JSON.stringify({ user_token: token });
    const cacheKlave = link+'|'+token;
    this.cache.delete(link + '|' + token);
    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    const peticion$ = this.httpClient.post(link,body, {headers}).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;*/
  }

  catalogoProveedoresPersFísicas(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_personas_fisicas',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  catalogoProveedoresPersMorales(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_personas_morales',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  catalogoProveedoresBitacora():Observable<any>{
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_bitacora',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  catalogoProvedoresForClaves():Observable<any>{
    const link = this.url + 'egresos_catalogos_proveedoresforclaves';
    const cacheKlave = link;

    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this.httpClient.post(link,null)
    .pipe(shareReplay(1),catchError(this.handlerError));
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  verDetalleProveedor(token_proveedor:any):Observable<any>{
    let data = {"token_proveedor":token_proveedor};
    return this.httpClient.post(this.url+'egresos_catalogos_detalle_proveedores',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  habilitaProvForReembolsos(token_cat_proveedores:any,email_para_reembolsos:any):Observable<any>{
    let data = {"token_cat_proveedores":token_cat_proveedores,"email_para_reembolsos":email_para_reembolsos};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_habilita_para_reembolsos',data)
    .pipe(catchError(this.handlerError));
  }

  deshabilitaProvForReembolsos(token_cat_proveedores:any):Observable<any>{
    let data = {"token_cat_proveedores":token_cat_proveedores};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_cancela_para_reembolsos',data)
    .pipe(catchError(this.handlerError));
  }

  updateGeneralesProveedor(
    token_cat_proveedores:any,
    radioProv:any,
    subtipoProv:any,
    prov_rfc:any,
    id_tax:any,
    nombre:any,
    nombre_comercial:any,
    sitio_web:any,
    regimen_fiscal:any,
    cuenta_contable:any
  ):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "radioProv":radioProv,
      "subtipoProv":subtipoProv,
      "prov_rfc":prov_rfc,
      "id_tax":id_tax,
      "nombre":nombre,
      "nombre_comercial":nombre_comercial,
      "sitio_web":sitio_web,
      "regimen_fiscal":regimen_fiscal,
      "cuenta_contable":cuenta_contable
    };
    return this.httpClient.post(this.url+'egresos_catalogos_verify_exist_proveedor_two',data)
    .pipe(catchError(this.handlerError));
  }

  registraNuevoContactoProv(token_cat_proveedores:any,paterno_edit:any,materno_edit:any,nombre_edit:any,area_contacto_edit:any,cargo_contacto_edit:any,lista_emails:any,lista_telefonos:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_cat_proveedores":token_cat_proveedores,
      "paterno":paterno_edit,
      "materno":materno_edit,
      "nombre":nombre_edit,
      "area_contacto":area_contacto_edit,
      "cargo_contacto":cargo_contacto_edit,
      "emails_contacto":lista_emails,
      "telefonos_contacto":lista_telefonos
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'ingresos_catalogos_proveedor_registra_contacto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  updateGeneralesContactoProv(token_cat_proveedores:any,token_contacto:any,paterno_edit:any,materno_edit:any,nombre_edit:any,area_contacto_edit:any,cargo_contacto_edit:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_contacto":token_contacto,"paterno":paterno_edit,"materno":materno_edit,
      "nombre":nombre_edit,"area_contacto":area_contacto_edit,"cargo_contacto":cargo_contacto_edit});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'ingresos_catalogos_update_contacto_generales',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  agregaPhoneContactoProv(token_cat_proveedores:any,token_contacto:any,etiqueta:any,numero_telefono:any,extension:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_contacto":token_contacto,"etiqueta":etiqueta,"numero_telefono":numero_telefono,"extension":extension});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_contacto_telefono_agregar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  updatePhoneContactoProv(token_cat_proveedores:any,token_contacto:any,token_telefono:any,etiqueta:any,numero_telefono:any,extension:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_contacto":token_contacto,
      "token_telefono":token_telefono,"etiqueta":etiqueta,"numero_telefono":numero_telefono,"extension":extension});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_contacto_telefono_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deletePhoneContactoProv(token_cat_proveedores:any,token_contacto:any,token_telefono:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_contacto":token_contacto,"token_telefono":token_telefono});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_contacto_telefono_delete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  agregaEMailContactoProv(token_cat_proveedores:any,token_contacto:any,correo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_contacto":token_contacto,"correo":correo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_contacto_email_agregar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  updateEMailContactoProv(token_cat_proveedores:any,token_contacto:any,token_correo:any,correo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_contacto":token_contacto,"token_correo":token_correo,"correo":correo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_contacto_email_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deleteEMailContactoProv(token_cat_proveedores:any,token_contacto:any,token_correo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_contacto":token_contacto,"token_correo":token_correo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_contacto_correo_delete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaCreditosProv(
    token_cat_proveedores:any,
    token_creditos:any,
    acepta:any,
    data_moneda_code:any,
    data_moneda_decimales:any,
    data_limite_credito:any,
    data_dias_cobro_credito:any,
    data_comienzacomputo_credito:any
  ):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "token_creditos":token_creditos,
      "aceptcredito":acepta,
      "data_moneda_code":data_moneda_code,
      "data_moneda_decimales":data_moneda_decimales,
      "txtlimiteCredito":data_limite_credito,
      "txtdiasCobroCredit":data_dias_cobro_credito,
      "selectComienzaCobroClient":data_comienzacomputo_credito
    };
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_creditos_update',data)
    .pipe(catchError(this.handlerError));
  }

  registraCreditosProv(
    token_cat_proveedores:any,    
    data_decideaceptcredito:any,
    data_moneda_code:any,
    data_moneda_decimales:any,
    data_limite_credito:any,
    data_dias_cobro_credito:any,
    data_comienzacomputo_credito:any,):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_cat_proveedores":token_cat_proveedores,
      "creditoAsignado":data_decideaceptcredito,
      "data_moneda_code":data_moneda_code,
      "data_moneda_decimales":data_moneda_decimales,
      "txtlimiteCredito":data_limite_credito,
      "txtdiasCobroCredit":data_dias_cobro_credito,
      "selectComienzaCobroClient":data_comienzacomputo_credito
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_creditos_registro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }
  
  eliminaCreditosProv(token_cat_proveedores:any,token_creditos:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_creditos":token_creditos});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_creditos_delete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaFormaPagoProv(token_cat_proveedores:any,data_tiene_forma_pago:any,data_token_forma_pago:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"tiene_forma_pago":data_tiene_forma_pago,"formaCobroAltaClient":data_token_forma_pago});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_fcobro_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registraFormaCobroProv(token_cat_proveedores:any,data_token_forma_pago:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"formaCobroAltaClient":data_token_forma_pago});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_fcobro_registro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  habilitaEmitirFacturaAntesPago(token_cat_proveedores:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_habilita_emitir_fact_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deshabilitaEmitirFacturaAntesPago(token_cat_proveedores:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_cancela_emitir_fact_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  habilitaEntregaDeProdAntesPago(token_cat_proveedores:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_entrega_de_prod_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deshabilitaEntregaDeProdAntesPago(token_cat_proveedores:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_cancela_entrega_de_prod_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  dipoMexUpdateUbicaProv(
    token_cat_proveedores:any,
    token_direccion:any,
    estado:any,
    municipio:any,
    codigo_postal:any,
    colonia:any
  ):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "token_direccion":token_direccion,
      "estado":estado,
      "municipio":municipio,
      "codigo_postal":codigo_postal,
      "colonia":colonia,
      "api":"api"
    };
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_update_ubicacion_dipomex',data)
    .pipe(catchError(this.handlerError));
  }

  noApiUpdateUbicaProv(token_cat_proveedores:any,token_direccion:any,estado:any,municipio:any,codigo_postal:any,colonia:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"token_direccion":token_direccion,"estado":estado,"municipio":municipio,"codigo_postal":codigo_postal,"colonia":colonia,"api":"no_api_found"});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_update_ubicacion_no_api',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogo_prov_autorizados():Observable<any>{
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_autorizados',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  catalogo_prov_no_autorizados():Observable<any>{
    return this.httpClient.post(this.url+'egresos_catalogos_catalogo_prov_no_autorizados',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  solicitarValidateProveedor(token_proveedor:any):Observable<any>{
    let data = {"token_proveedor":token_proveedor};
    return this.httpClient.post(this.url+'egresos_catalogos_solicitar_validacion_proveedores',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  validarProveedor(token_proveedor:any):Observable<any>{
    let data = {"token_proveedor":token_proveedor};
    return this.httpClient.post(this.url+'egresos_catalogos_validacion_proceso_proveedores',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  provNotVincUser():Observable<any>{
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_prov_not_vinc_user',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  proveedorVincularExistenteUser(soli_vinculo_token:any,token_proveedor:any):Observable<any>{
    let data = {"soli_vinculo_token":soli_vinculo_token,"token_proveedor":token_proveedor};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_prov_vincular_existente_usuario',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  proveedorVincularNuevoUser(soli_vinculo_token:any,token_proveedor:any,access_code:any,password_code:any):Observable<any>{
    let data = {
      "soli_vinculo_token":soli_vinculo_token,
      "token_proveedor":token_proveedor,
      "access_code":access_code,
      "password_code":password_code
    };
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_prov_vincular_nuevo_usuario',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaRfcProv(token_proveedor:any,rfc_generico:any,rfc_prov:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "rfc_generico":rfc_generico,
      "rfc_prov":rfc_prov
    };
    return this.httpClient.post(this.url+'egresos_catalogos_actualizarfcproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaIdTaxProv(token_proveedor:any,tax_id_prov:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "tax_id_prov":tax_id_prov
    };
    return this.httpClient.post(this.url+'egresos_catalogos_actualizaidtaxproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaGeneralesPF(
    token_proveedor:any,
    paternoPersonales:any,
    maternoPersonales:any,
    nombrePersonales:any,
    nombreComPersonales:any,
    curpTaxPersonales:any,
    selectPaisPersonales:any,
    sitWebPersonales:any
  ):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "paternoPersonales":paternoPersonales,
      "maternoPersonales":maternoPersonales,
      "nombrePersonales":nombrePersonales,
      "nombreComPersonales":nombreComPersonales,
      "curpTaxPersonales":curpTaxPersonales,
      "selectPaisPersonales":selectPaisPersonales,
      "sitWebPersonales":sitWebPersonales
    };

    return this.httpClient.post(this.url+'egresos_catalogos_actualizageneralespfproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaGeneralesPM(
    token_proveedor:any,
    empresaPersonales:any,
    nombreComPersonales:any,
    curpTaxPersonales:any,
    selectPaisPersonales:any,
    sitWebPersonales:any
  ):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "empresaPersonales":empresaPersonales,
      "nombreComPersonales":nombreComPersonales,
      "curpTaxPersonales":curpTaxPersonales,
      "selectPaisPersonales":selectPaisPersonales,
      "sitWebPersonales":sitWebPersonales
    };

    return this.httpClient.post(this.url+'egresos_catalogos_actualizageneralespmproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaRedes(token_proveedor:any,redes_sociales:any):Observable<any>{
    let data = {"token_proveedor":token_proveedor,"redes_sociales":redes_sociales};
    return this.httpClient.post(this.url+'egresos_catalogos_actualizaredesproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  deletePersonalProv(token_proveedor:any,token_personal:any):Observable<any>{
    let data = {"token_proveedor":token_proveedor,"token_personal":token_personal};
    return this.httpClient.post(this.url+'egresos_catalogos_eliminapersonalproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  nuevoPersonalProv(token_proveedor:any,arrayContactoPersonalProvv_reg:any):Observable<any>{
    let data = {"token_proveedor":token_proveedor,"list_contacto":arrayContactoPersonalProvv_reg};
    return this.httpClient.post(this.url+'egresos_catalogos_ingresapersonalproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaContPersonal(
    token_proveedor:any,
    token_personal:any,
    personal_cont_paterno:any,
    personal_cont_materno:any,
    personal_cont_nombre:any,
    personal_cont_area:any,
    personal_cont_cargo:any
  ):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "personal_cont_paterno":personal_cont_paterno,
      "personal_cont_materno":personal_cont_materno,
      "personal_cont_nombre":personal_cont_nombre,
      "personal_cont_area":personal_cont_area,
      "personal_cont_cargo":personal_cont_cargo
    };
    return this.httpClient.post(this.url+'egresos_catalogos_actualizapersonalgeneralesproveedor',data).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  nuevoTelefonoPersonal(
    token_proveedor:any,
    token_personal:any,
    personal_etiqueta:any,
    personal_icon:any,
    personal_telefono:any,
    personal_extension:any
  ):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "personal_etiqueta":personal_etiqueta,
      "personal_icon":personal_icon,
      "personal_telefono":personal_telefono,
      "personal_extension":personal_extension
    };
    return this.httpClient.post(this.url+'egresos_catalogos_agregapersonaltelefonoproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaTelefonoPersonal(
    token_proveedor:any,
    token_personal:any,
    token_telefono:any,
    personal_etiqueta:any,
    personal_icon:any,
    personal_telefono:any,
    personal_extension:any
  ):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_telefono":token_telefono,
      "personal_etiqueta":personal_etiqueta,
      "personal_icon":personal_icon,
      "personal_telefono":personal_telefono,
      "personal_extension":personal_extension
    };
    return this.httpClient.post(this.url+'egresos_catalogos_actualizapersonaltelefonoproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  eliminaTelefonoPersonal(token_proveedor:any,token_personal:any,token_telefono:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_telefono":token_telefono
    };
    return this.httpClient.post(this.url+'egresos_catalogos_eliminapersonaltelefonoproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  restartTelefonoPersonal(token_proveedor:any,token_personal:any,token_telefono:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_telefono":token_telefono
    };
    return this.httpClient.post(this.url+'egresos_catalogos_restartpersonaltelefonoproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  eliminaPermTelefonoPersonal(token_proveedor:any,token_personal:any,token_telefono:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_telefono":token_telefono
    };
    return this.httpClient.post(this.url+'egresos_catalogos_eliminapermpersonaltelefonoproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  nuevoCorreoPersonal(token_proveedor:any,token_personal:any,personal_correo:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "personal_correo":personal_correo
    };
    return this.httpClient.post(this.url+'egresos_catalogos_agregapersonalemailproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  actualizaCorreoPersonal(token_proveedor:any,token_personal:any,token_correo:any,personal_correo:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_correo":token_correo,
      "personal_correo":personal_correo
    };
    return this.httpClient.post(this.url+'egresos_catalogos_actualizapersonalemailproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  eliminaCorreoPersonal(token_proveedor:any,token_personal:any,token_correo:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_correo":token_correo
    };
    return this.httpClient.post(this.url+'egresos_catalogos_eliminapersonalemailproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  restartCorreoPersonal(token_proveedor:any,token_personal:any,token_correo:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_correo":token_correo
    };
    return this.httpClient.post(this.url+'egresos_catalogos_restartpersonalemailproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  eliminaPermCorreoPersonal(token_proveedor:any,token_personal:any,token_correo:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal,
      "token_correo":token_correo
    };
    return this.httpClient.post(this.url+'egresos_catalogos_eliminapermpersonalemailproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  restartPersonalProv(token_proveedor:any,token_personal:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal
    };
    return this.httpClient.post(this.url+'egresos_catalogos_eliminapersonalproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  restauraPersonalProv(token_proveedor:any,token_personal:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal
    };
    return this.httpClient.post(this.url+'egresos_catalogos_restartpersonalproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  deletePermPersonalProv(token_proveedor:any,token_personal:any):Observable<any>{
    let data = {
      "token_proveedor":token_proveedor,
      "token_personal":token_personal
    };
    return this.httpClient.post(this.url+'egresos_catalogos_deletepermanentepersonalproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  updatecontanciafiscalsitload(token_proveedor:any,imagenAltaPdfFiscal:File):Observable<any>{
    const formData = new FormData();
    formData.append('token_cat_proveedores',token_proveedor);
    formData.append('imagenAltaPdfFiscal',imagenAltaPdfFiscal,imagenAltaPdfFiscal.name);
    console.log(formData);
    return this.httpClient.post(this.url+'egresos_catalogos_updatecontanciafiscalsitload',formData).pipe(
      catchError(this.handlerError)
    );
  }

  updatecontanciafiscalsitbase64(token_proveedor:any,base64AltaPdfFiscal:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_proveedor,
      "base64AltaPdfFiscal":base64AltaPdfFiscal
    };
    return this.httpClient.post(this.url+'egresos_catalogos_updatecontanciafiscalsitbase64',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  updatecumplimientoload(token_proveedor:any,imagenAltaPdfCumplimientoObFiscales:File):Observable<any>{
    const formData = new FormData();
    formData.append('token_cat_proveedores',token_proveedor);
    formData.append('imagenAltaPdfCumplimientoObFiscales',imagenAltaPdfCumplimientoObFiscales,imagenAltaPdfCumplimientoObFiscales.name);
    console.log(formData);
    return this.httpClient.post(this.url+'egresos_catalogos_updatecumplimientoload',formData).pipe(
      catchError(this.handlerError)
    );
  }

  updatecumplimientobase64(token_proveedor:any,base64AltaPdfCumplimientoObFiscales:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_proveedor,
      "base64AltaPdfCumplimientoObFiscales":base64AltaPdfCumplimientoObFiscales
    };
    return this.httpClient.post(this.url+'egresos_catalogos_updatecumplimientobase64',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  updateCreditos(token_cat_proveedores:any,creditos:any,decideaceptcredito:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"creditos":creditos,"decideaceptcredito":decideaceptcredito});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_updatecreditosproveedor',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateFormaPagoProveedor(token_cat_proveedores:any,formaPago:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "formaPago":formaPago
    };
    return this.httpClient.post(this.url+'egresos_catalogos_updateformapagoproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  updateFormaPagoProveedorEstCuenta(token_cat_proveedores:any,imagenPerfilPdfEstCuenta:File,base64AltaPdfEstCuenta:any):Observable<any>{
    const formData = new FormData();
    console.log(imagenPerfilPdfEstCuenta);
    formData.append('token_cat_proveedores',token_cat_proveedores);
    if (imagenPerfilPdfEstCuenta) {
      formData.append('imagenPerfilPdfEstCuenta',imagenPerfilPdfEstCuenta,imagenPerfilPdfEstCuenta.name);
    }
    formData.append('base64AltaPdfEstCuenta',base64AltaPdfEstCuenta);
    console.log(formData);
    return this.httpClient.post(this.url+'egresos_catalogos_updatefpagoproveedorestcuenta',formData).pipe(
      catchError(this.handlerError)
    );
  }

  updateFormaPagoProveedorClabeInterb(token_cat_proveedores:any,formaPago:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "formaPago":formaPago
    };
    return this.httpClient.post(this.url+'egresos_catalogos_updateclabeinterbpagoproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  registraNuevaUbicacionNac(token_cat_proveedores:any,arrayubicacionNacionalProvv_reg:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,
      "arrayubicacionNacionalProvv_reg":arrayubicacionNacionalProvv_reg});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_registranuevaubicacionnacionalproveedor',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraNuevaUbicacionExt(
    token_cat_proveedores:any,
    pais:any,
    arrayubicacionExtranjeroProvv_reg:any
  ):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "pais":pais,
      "arrayubicacionExtranjeroProvv_reg":arrayubicacionExtranjeroProvv_reg
    };
    return this.httpClient.post(this.url+'egresos_catalogos_registranuevaubicacionextranjeroproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  deleteUbicacion(token_cat_proveedores:any,token_direccion:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "token_direccion":token_direccion
    };
    return this.httpClient.post(this.url+'egresos_catalogos_deleteubicacionproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  updateUbicacionNac(token_cat_proveedores:any,dirUbicacion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_proveedores":token_cat_proveedores,"dirUbicacion":dirUbicacion});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_updateubicacionnacionalproveedor',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateUbicacionExt(token_cat_proveedores:any,dirUbicacion:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "dirUbicacion":dirUbicacion
    };
    return this.httpClient.post(this.url+'egresos_catalogos_updateubicacionextranjeroproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  restaurarUbicacion(token_cat_proveedores:any,token_direccion:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "token_direccion":token_direccion
    };
    return this.httpClient.post(this.url+'egresos_catalogos_restaurarubicacionproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  deletePermUbicacion(token_cat_proveedores:any,token_direccion:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "token_direccion":token_direccion
    };
    return this.httpClient.post(this.url+'egresos_catalogos_deletepermubicacionproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  provEliminados():Observable<any>{
    return this.httpClient.post(this.url+'egresos_catalogos_catalogoprovdel',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  movetorecycleprov(token_proveedor:any):Observable<any>{
    let data = {"token_cat_proveedores":token_proveedor};
    return this.httpClient.post(this.url+'egresos_catalogos_deleteproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  reviveProveedor(token_proveedor:any):Observable<any>{
    let data = {"token_cat_proveedores":token_proveedor};
    return this.httpClient.post(this.url+'egresos_catalogos_restaurarproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  remataProveedor(token_proveedor:any):Observable<any>{
    let data = {"token_cat_proveedores":token_proveedor};
    return this.httpClient.post(this.url+'egresos_catalogos_deletepermproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  verificaExistsAllProveedor(radioProv:any,subtipoProv:any,rfc_generico:any,prov_rfc:any,id_tax:any,nombre:any):Observable<any>{
    let data = {
      "radioProv":radioProv,
      "subtipoProv":subtipoProv,
      "rfc_generico":rfc_generico,
      "prov_rfc":prov_rfc,
      "id_tax":id_tax,
      "nombre":nombre
    };
    return this.httpClient.post(this.url+'egresos_catalogos_verify_exist_proveedor_one',data)
    .pipe(catchError(this.handlerError));
  }

  verificaExistProveedorByRFC(prov_rfc:any):Observable<any>{
    let data = {"prov_rfc":prov_rfc};
    return this.httpClient.post(this.url+'egresos_catalogos_verify_exist_proveedor_rfc',data).pipe(
      catchError(this.handlerError)
    );
  }

  buscaProvExtranjero(proveedorrfc:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proveedorrfc":proveedorrfc});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_egresos_busquedaextproveedor',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  buscaProvMySQLPF(rfcPaterno:any,rfcMaterno:any,rfcNombre:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"rfcPaterno":rfcPaterno,"rfcMaterno":rfcMaterno,"rfcNombre":rfcNombre});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_egresos_busquedapfextproveedor',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  proveedor_registrar__compras(
    rfc_generico:any,
    prov_rfc:any,
    id_tax:any,
    radioProv:any,
    subtipoProv:any,
    paterno:any,
    materno:any,
    nombres:any,
    razon_social:any,
    comercial_nombre:any,
    curp:any,
    paistoken:any,
    sitio_web:any,
    tknRegimenFiscal:any,
    decideinfocontacto:any,
    listaContactoPersonal:any,
    tiene_docs_fiscales:any,
    docSituacionFiscal:File,
    docCumplimientoObFiscales:File,
    docContratos:File,

    files_anexos:any,

    decideaceptcredito:any,
    token_moneda:any,
    limite_credito:any,
    dias_pago_credito:any,
    comienzacomputo_credito:any,
    decideformapago:any,
    token_forma_pago:any,
    docEstadoCuenta:File,
    tipoReferenciaPago:any,
    clabeInterbancariaBanco:any,
    receptFactura:any,
    classRecibeArtPago:any,
    cod_postal:any,
    dipomex_cod_postal_estado:any,
    dipomex_cod_postal_municipio:any,
    dipomex_cod_postal_cp:any,
    dipomex_cod_postal_colonia_vinculada:any,
    listnewdireccionNac:any
  ):Observable<any>{
    const formData = new FormData();
    if (docSituacionFiscal) {
      formData.append('docSituacionFiscal',docSituacionFiscal,docSituacionFiscal.name);
    } else {
      formData.append('docSituacionFiscal','');
    }
    if (docCumplimientoObFiscales) {
      formData.append('docCumplimientoObFiscales',docCumplimientoObFiscales,docCumplimientoObFiscales.name);
    } else {
      formData.append('docCumplimientoObFiscales','');
    }
    if (docContratos) {
      formData.append('docContrato',docContratos,docContratos.name);
    } else {
      formData.append('docContrato','');
    }
    if (docEstadoCuenta) {
      formData.append('docEstadoCuenta',docEstadoCuenta,docEstadoCuenta.name);
    } else {
      formData.append('docEstadoCuenta','');
    }
    for (var i = 0; i < files_anexos.length; i++) {
      formData.append("files_anexos[]", files_anexos[i]);
    }
    formData.append('proveedor',JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "rfc_generico":rfc_generico,
      "prov_rfc":prov_rfc,
      "id_tax":id_tax,
      "radioProv":radioProv,
      "subtipoProv":subtipoProv,
      "paterno":paterno,
      "materno":materno,
      "nombres":nombres,
      "razon_social":razon_social,
      "comercial_nombre":comercial_nombre,
      "curp":curp,
      "paistoken":paistoken,
      "sitio_web":sitio_web,
      "tknRegimenFiscal":tknRegimenFiscal,
      "decideinfocontacto":decideinfocontacto,
      "listaContactoPersonal":listaContactoPersonal,
      "tiene_docs_fiscales":tiene_docs_fiscales,
      "decideaceptcredito":decideaceptcredito,
      "token_moneda":token_moneda,
      "limite_credito":limite_credito,
      "dias_pago_credito":dias_pago_credito,
      "comienzacomputo_credito":comienzacomputo_credito,
      "decideformapago":decideformapago,
      "token_forma_pago":token_forma_pago,
      "tipoReferenciaPago":tipoReferenciaPago,
      "clabe_interbancaria":clabeInterbancariaBanco,
      "receptFactura":receptFactura,
      "classRecibeArtPago":classRecibeArtPago,
      "cod_postal":cod_postal,
      "dipomex_cod_postal_estado":dipomex_cod_postal_estado,
      "dipomex_cod_postal_municipio":dipomex_cod_postal_municipio,
      "dipomex_cod_postal_cp":dipomex_cod_postal_cp,
      "dipomex_cod_postal_colonia_vinculada":dipomex_cod_postal_colonia_vinculada,
      "listnewdireccionNac":listnewdireccionNac
      //"tkn_cod_postal":tkn_cod_postal
    }));
    console.log(formData);
    return this.httpClient.post(this.url+'egresos_catalogos_proveedor_solicitud_registro_compras',formData).pipe(
      catchError(this.handlerError)
    );
  }

  proveedor_solicitar_registro(
    //varriablleRfc:any,
    rfc_generico:any,
    prov_rfc:any,
    id_tax:any,
    radioProv:any,
    subtipoProv:any,
    txtPaternoPF_reg:any,
    txtMaternoPF_reg:any,
    txtnombrePF_reg:any,
    txtnomCom_regPF:any,
    txtcurpPF_reg:any,
    selPaisExtPF_reg:any,
    txtsitWebPF_reg:any,
    arrayRedesPF:any,
    txtempresa_reg:any,
    selPaisExtPM_reg:any,
    txtnomCom_regPM:any,
    txtsitWeb_regPM:any,
    arrayRedesPM:any,
    decideinfocontacto:any,
    arrayContactoPersonalProvv_reg:any,
    tiene_docs_fiscales:any,
    imagenAltaPdfFiscal:File,
    base64AltaPdfFiscal:any,
    imagenAltaPdfCumplimientoObFiscales:File,
    base64AltaPdfCumplimientoObFiscales:any,
    valnoCargaDocsFiscalesRazon:any,
    aceptaCredito:any,
    txtMoneda_reg:any,
    limiteCredito:any,
    txtdiaspagoCredit_reg:any,
    selectComienzaPagoProv:any,
    formaPagoAltaProv:any,
    tipoReferenciaPago:any,
    clabeIntBanc:any,
    imagenAltaPdfEstCuenta:File,
    base64AltaPdfEstCuenta:any,
    arrayubicacionExtranjeraProvv_reg:any,
    arrayubicacionNacionalProvv_reg:any
  ):Observable<any>{

    console.log(imagenAltaPdfFiscal+" "+imagenAltaPdfEstCuenta+" "+imagenAltaPdfCumplimientoObFiscales);

    const formData = new FormData();
    if (imagenAltaPdfFiscal) {
      formData.append('imagenAltaPdfFiscal',imagenAltaPdfFiscal,imagenAltaPdfFiscal.name);
    } else {
      formData.append('imagenAltaPdfFiscal','');
    }
    console.log(base64AltaPdfFiscal);
    formData.append('base64AltaPdfFiscal',base64AltaPdfFiscal);
    if (imagenAltaPdfCumplimientoObFiscales) {
      formData.append('imagenAltaPdfCumplimientoObFiscales',imagenAltaPdfCumplimientoObFiscales,imagenAltaPdfCumplimientoObFiscales.name);
    } else {
      formData.append('imagenAltaPdfCumplimientoObFiscales','');
    }
    formData.append('base64AltaPdfCumplimientoObFiscales',base64AltaPdfCumplimientoObFiscales);

    console.log(imagenAltaPdfEstCuenta);
    if (imagenAltaPdfEstCuenta) {
      formData.append('imagenAltaPdfEstCuenta',imagenAltaPdfEstCuenta,imagenAltaPdfEstCuenta.name);
    }
    formData.append('base64AltaPdfEstCuenta',base64AltaPdfEstCuenta);
    console.log(txtempresa_reg)
    formData.append('proveedor',JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      //"rfc-registro-pf":varriablleRfc,
      "rfc_generico":rfc_generico,
      "prov_rfc":prov_rfc,
      "id_tax":id_tax,
      "radioProv":radioProv,
      "subtipoProv":subtipoProv,
      "txtPaternoPF":txtPaternoPF_reg,
      "txtMaternoPF":txtMaternoPF_reg,
      "txtnombrePF":txtnombrePF_reg,
      "txtcurpPF":txtcurpPF_reg,
      "paisPF":selPaisExtPF_reg,
      "txtNomComercialPF":txtnomCom_regPF,
      "txtSitioWebPF":txtsitWebPF_reg,
      "redesSocialesPF":arrayRedesPF,
      "txtempresa":txtempresa_reg,
      "pais":selPaisExtPM_reg,
      "txtNomComercialPM":txtnomCom_regPM,
      "txtSitioWebPM":txtsitWeb_regPM,
      "redesSocialesPM":arrayRedesPM,
      "decideinfocontacto":decideinfocontacto,
      "arrayContactoPersonalProvv_reg":arrayContactoPersonalProvv_reg,
      "tiene_docs_fiscales":tiene_docs_fiscales,
      "valnoCargaDocsFiscalesRazon":valnoCargaDocsFiscalesRazon,
      "aceptaCredito":aceptaCredito,
      "txtMoneda":txtMoneda_reg,
      "txtlimiteCredito":limiteCredito,
      "txtdiaspagoCredit":txtdiaspagoCredit_reg,
      "selectComienzaPagoProv":selectComienzaPagoProv,
      "formaPagoAltaProv":formaPagoAltaProv,
      "tipoReferenciaPago":tipoReferenciaPago,
      "clabeIntBanc":clabeIntBanc,
      "arrayubicacionExtranjeraProvv_reg":arrayubicacionExtranjeraProvv_reg,
      "arrayubicacionNacionalProvv_reg":arrayubicacionNacionalProvv_reg,
    }));
    console.log(formData);
    return this.httpClient.post(this.url+'egresos_catalogos_proveedor_solicitud_registro',formData).pipe(
      catchError(this.handlerError)
    );
  }

  proveedor_registro_modulos_externos(
    data_rfc_generico:any,
    data_rfc_real:any,
    data_id_tax:any,
    data_tipoProv:any,
    data_subtipoProv:any,
    data_name_prov:any,

    data_nombre_comercial:any,
    data_curp:any,
    data_pais:any,
    data_sitWeb:any,
    data_tknRegimenFiscal:any,

    data_cod_postal:any,
    //tkn_cod_postal:any
    data_dipomex_cod_postal_estado:any,
    data_dipomex_cod_postal_municipio:any,
    data_dipomex_cod_postal_cp:any,
    data_dipomex_cod_postal_colonia_vinculada:any,
    data_listnewdireccionNac:any
  ):Observable<any>{
    let data = {
      "rfc_generico":data_rfc_generico,
      "prov_rfc":data_rfc_real,
      "id_tax":data_id_tax,
      "radioProv":data_tipoProv,
      "subtipoProv":data_subtipoProv,
      "name_prov":data_name_prov,
      "comercial_nombre":data_nombre_comercial,
      "curp":data_curp,
      "paistoken":data_pais,
      "sitio_web":data_sitWeb,
      "tknRegimenFiscal":data_tknRegimenFiscal,
      "cod_postal":data_cod_postal,
      "dipomex_cod_postal_estado":data_dipomex_cod_postal_estado,
      "dipomex_cod_postal_municipio":data_dipomex_cod_postal_municipio,
      "dipomex_cod_postal_cp":data_dipomex_cod_postal_cp,
      "dipomex_cod_postal_colonia_vinculada":data_dipomex_cod_postal_colonia_vinculada,
      "listnewdireccionNac":data_listnewdireccionNac
    };
    return this.httpClient.post(this.url+'egresos_catalogos_proveedor_registro_modulos_externos',data).pipe(
      catchError(this.handlerError)
    );
  }

  registraProveedor(
    data_rfc_generico:any,
    data_rfc_real:any,
    data_id_tax:any,
    data_tipoProv:any,
    data_subtipoProv:any,
    data_name_prov:any,
    data_habilitado_para_reembolsos:boolean,
    data_email_para_reembolsos:any,

    data_nombre_comercial:any,
    data_curp:any,
    data_pais:any,
    data_sitWeb:any,
    data_redesSociales:any,
    data_tknRegimenFiscal:any,
    data_cuenta_contable:any,

    data_decideinfocontacto:any,
    data_arrayContactoPersonalProvv_reg:any,

    data_tiene_docs_fiscales:any,
    data_docSituacionFiscal:File,
    data_base64CodeSitFical:any,
    data_docCumplimientoObFiscales:File,
    data_base64CodeCumplimientoObFiscales:any,
    docContratos:File,
    data_files_anexos:any,
    data_valnoCargaDocsFiscalesRazon:any,

    data_decideaceptcredito:any,
    data_token_moneda:any,
    data_limite_credito:any,
    data_dias_pago_credito:any,
    data_comienzacomputo_credito:any,

    data_decideformapago:any,
    data_token_forma_pago:any,
    data_docEstadoCuenta:File,
    data_base64CodeEstadoCuenta:any,
    data_tipoReferenciaPago:any,
    data_clabeInterbancariaBanco:any,
    data_receptFactura:any,
    data_classRecibeArtPago:any,
    data_cod_postal:any,
    data_dipomex_cod_postal_estado:any,
    data_dipomex_cod_postal_municipio:any,
    data_dipomex_cod_postal_cp:any,
    data_dipomex_cod_postal_colonia_vinculada:any,
    data_listnewdireccionNac:any
  ):Observable<any>{
    const formData = new FormData();
    console.log(data_docSituacionFiscal+" "+data_docEstadoCuenta+" "+data_docCumplimientoObFiscales);
    console.log(data_base64CodeSitFical);

    data_docSituacionFiscal ? formData.append('imagenAltaPdfFiscal',data_docSituacionFiscal,data_docSituacionFiscal.name) : formData.append('imagenAltaPdfFiscal','');
    formData.append('base64AltaPdfFiscal',data_base64CodeSitFical);
    
    console.log(data_base64CodeCumplimientoObFiscales);
    data_docCumplimientoObFiscales ? formData.append('imagenAltaPdfCumplimientoObFiscales',data_docCumplimientoObFiscales,data_docCumplimientoObFiscales.name) : formData.append('imagenAltaPdfCumplimientoObFiscales','');
    formData.append('base64AltaPdfCumplimientoObFiscales',data_base64CodeCumplimientoObFiscales);
    
    docContratos ? formData.append('imagenAltaContratos',docContratos,docContratos.name) : formData.append('imagenAltaContratos','');

    data_docEstadoCuenta ? formData.append('imagenAltaPdfEstCuenta',data_docEstadoCuenta,data_docEstadoCuenta.name) : formData.append('imagenAltaPdfEstCuenta','');
    formData.append('base64AltaPdfEstCuenta',data_base64CodeEstadoCuenta);

    for (var i = 0; i < data_files_anexos.length; i++) {
      formData.append("files_anexos[]", data_files_anexos[i]);
    }

    formData.append('rfc_generico',data_rfc_generico);
    formData.append('prov_rfc',data_rfc_real);
    formData.append('id_tax',data_id_tax);
    formData.append('radioProv',data_tipoProv);
    formData.append('subtipoProv',data_subtipoProv);
    formData.append('name_prov',data_name_prov);
    formData.append('habilitado_para_reembolsos',data_habilitado_para_reembolsos ? 'true' : 'false');
    formData.append('email_para_reembolsos',data_habilitado_para_reembolsos ? data_email_para_reembolsos : '');
    formData.append('info_comparativa',data_habilitado_para_reembolsos ? this.encryptor.santoEncryptCode(data_email_para_reembolsos) : '');
    formData.append('comercial_nombre',data_nombre_comercial);
    formData.append('curp',data_curp);
    formData.append('paistoken',data_pais);
    formData.append('sitio_web',data_sitWeb);
    formData.append('redesSociales',data_redesSociales);
    formData.append('tknRegimenFiscal',data_tknRegimenFiscal);
    formData.append('cuenta_contable',data_cuenta_contable);

    formData.append('decideinfocontacto',data_decideinfocontacto ? 'true' : 'false');

    //formData.append('arrayContactoPersonalProvv_reg',data_arrayContactoPersonalProvv_reg);
    if (data_arrayContactoPersonalProvv_reg) {
      data_arrayContactoPersonalProvv_reg.forEach((cont:any, c:any) => {
        formData.append(`arrayContactoPersonalProvv_reg[${c}][num_lista]`, cont.num_lista);
        formData.append(`arrayContactoPersonalProvv_reg[${c}][paterno]`, cont.paterno);
        formData.append(`arrayContactoPersonalProvv_reg[${c}][materno]`, cont.materno);
        formData.append(`arrayContactoPersonalProvv_reg[${c}][nombre]`, cont.nombre);
        formData.append(`arrayContactoPersonalProvv_reg[${c}][area]`, cont.area);
        formData.append(`arrayContactoPersonalProvv_reg[${c}][cargo]`, cont.cargo);
        formData.append(`arrayContactoPersonalProvv_reg[${c}][emails]`, cont.emails);
        formData.append(`arrayContactoPersonalProvv_reg[${c}][telefonos]`, cont.telefonos);
      });
    }

    formData.append('tiene_docs_fiscales',data_tiene_docs_fiscales ? 'true' : 'false');
    formData.append('valnoCargaDocsFiscalesRazon',data_valnoCargaDocsFiscalesRazon);
    formData.append('aceptaCredito',data_decideaceptcredito ? 'true' : 'false');
    formData.append('txtMoneda',data_token_moneda);
    formData.append('txtlimiteCredito',data_limite_credito);
    formData.append('txtdiaspagoCredit',data_dias_pago_credito);
    formData.append('selectComienzaPagoProv',data_comienzacomputo_credito);
      
    formData.append('decideformapago',data_decideformapago ? 'true' : 'false');
    formData.append('formaPagoAltaProv',data_token_forma_pago);
    formData.append('tipoReferenciaPago',data_tipoReferenciaPago);
    formData.append('clabeIntBanc',data_clabeInterbancariaBanco);

    formData.append('receptFactura',data_receptFactura ? 'true' : 'false');
    formData.append('classRecibeArtPago',data_classRecibeArtPago ? 'true' : 'false');
    formData.append('cod_postal',data_cod_postal);
    formData.append('dipomex_cod_postal_estado',data_dipomex_cod_postal_estado);
    formData.append('dipomex_cod_postal_municipio',data_dipomex_cod_postal_municipio);
    formData.append('dipomex_cod_postal_cp',data_dipomex_cod_postal_cp);
    formData.append('dipomex_cod_postal_colonia_vinculada',data_dipomex_cod_postal_colonia_vinculada);
    //formData.append('listnewdireccionNac',data_listnewdireccionNac);

    if (data_listnewdireccionNac) {
      data_listnewdireccionNac.forEach((nac:any, n:any) => {
        formData.append(`listnewdireccionNac[${n}][estado]`, nac.estado);
        formData.append(`listnewdireccionNac[${n}][municipio]`, nac.municipio);
        formData.append(`listnewdireccionNac[${n}][codigo_postal]`, nac.codigo_postal);
        formData.append(`listnewdireccionNac[${n}][colonia]`, nac.colonia);
      });
    }

    console.log(data_name_prov)
    console.log(formData);
    return this.httpClient.post(this.url+'egresos_catalogos_egresos_registraproveedor',formData).pipe(
      catchError(this.handlerError)
    );
  }

  listarAnticiposProvSolicitudes(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_solicitudes',data).pipe(
      catchError(this.handlerError)
    );
  }

  listarAnticiposProvCatalogoGeneral(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_catalogo',data).pipe(
      catchError(this.handlerError)
    );
  }

  listarAnticiposAutorizadosProvCatalogo(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_autorizados',data).pipe(
      catchError(this.handlerError)
    );
  }

  listarAnticiposProveedor(token_cat_proveedores:any):Observable<any>{
    let data = {"token_cat_proveedores":token_cat_proveedores};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_by_prov',data).pipe(
      catchError(this.handlerError)
    );
  }

  autorizarAnticipo(ant_soli:any,anticipo_caja:any,anticipo_cuenta_bancaria:any,anticipo_cuenta_monedero:any,evidencias_anticipo:any):Observable<any>{
    const formDataAnticipo = new FormData();
    formDataAnticipo.append("anticipo_uuid",ant_soli.anticipo_uuid);
    formDataAnticipo.append("anticipo_proveedor",ant_soli.proveedor_token);
    formDataAnticipo.append("anticipo_fecha_contabilizacion",ant_soli.anticipo_procesos_fecha_contabilizacion);
    formDataAnticipo.append("anticipo_moneda",ant_soli.anticipo_procesos_moneda);
    formDataAnticipo.append("anticipo_moneda_decimales",ant_soli.anticipo_procesos_moneda_decimales);
    formDataAnticipo.append("anticipo_importe",ant_soli.anticipo_procesos_importe);
    formDataAnticipo.append("anticipo_tipo_cambio_number",ant_soli.anticipo_procesos_tipo_cambio_number);
    formDataAnticipo.append("anticipo_f_pago",ant_soli.anticipo_procesos_f_pago);
    //formDataAnticipo.append("anticipo_caja",anticipo_caja);
    //formDataAnticipo.append("anticipo_cuenta_bancaria",anticipo_cuenta_bancaria);
    //formDataAnticipo.append("anticipo_cuenta_monedero",anticipo_cuenta_monedero);

    if (anticipo_caja) {
      anticipo_caja.forEach((caja:any, i:any) => {
        formDataAnticipo.append(`anticipo_caja[${i}][token_caja]`, caja.token_caja);
        formDataAnticipo.append(`anticipo_caja[${i}][monto_aplicar]`, caja.monto_aplicar);
      });
    }

    if (anticipo_cuenta_bancaria) {
      anticipo_cuenta_bancaria.forEach((cuenta:any, i:any) => {
        formDataAnticipo.append(`anticipo_cuenta_bancaria[${i}][token_cuenta]`, cuenta.token_cuenta);
        formDataAnticipo.append(`anticipo_cuenta_bancaria[${i}][monto_aplicar]`, cuenta.monto_aplicar);
      });
    }

    if (anticipo_cuenta_monedero) {
      anticipo_cuenta_monedero.forEach((moned:any, i:any) => {
        formDataAnticipo.append(`anticipo_cuenta_monedero[${i}][token_cuentaMon]`, moned.token_cuentaMon);
        formDataAnticipo.append(`anticipo_cuenta_monedero[${i}][monto_aplicar]`, moned.monto_aplicar);
      });
    }

    formDataAnticipo.append("anticipo_comentarios",ant_soli.anticipo_procesos_comentarios);
    for (var i = 0; i < evidencias_anticipo.length; i++) {
      formDataAnticipo.append("evidencias_anticipo[]", evidencias_anticipo[i]);
    }
    //let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_autorizar',formDataAnticipo).pipe(
      catchError(this.handlerError)
    );
  }

  rechazarAnticipo(anticipo_uuid:any,comentarios_por_soli:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),anticipo_uuid:anticipo_uuid,comentarios:comentarios_por_soli});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_rechazar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  desgloseAnticipo(anticipo_uuid:any):Observable<any>{
    let data = {"anticipo_uuid":anticipo_uuid};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_catalogo',data).pipe(
      catchError(this.handlerError)
    );
  }

  anticipoSolicitarCancelacion(anticipo_uuid:any,contabilizacion:any,observaciones:any):Observable<any>{
    let data = {"anticipo_uuid":anticipo_uuid,"solicitud_fecha_contabilizacion":contabilizacion,"solicitud_observaciones":observaciones};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_pago_solicitar_cancelacion_anticipo',data)
    .pipe(catchError(this.handlerError));
  }

  listarAnticiposDisponiblesProveedor(token_cat_proveedores:any):Observable<any>{
    let data = {"token_cat_proveedores":token_cat_proveedores};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_disponibles',data).pipe(
      catchError(this.handlerError)
    );
  }

  registraAnticipoProveedor(token_cat_proveedores:any,fecha_contabilizacion:any,forma_pago:any,moneda_codigo:any,moneda_decimales:any,tipo_cambio:any,cantidad_anticipo:any,observaciones:any):Observable<any>{
    let data = {
      "token_cat_proveedores":token_cat_proveedores,
      "moneda_codigo":moneda_codigo,
      "fecha_contabilizacion":fecha_contabilizacion,
      "forma_pago":forma_pago,
      "moneda_decimales":moneda_decimales,
      "tipo_cambio":tipo_cambio,
      "cantidad_anticipo":cantidad_anticipo,
      "observaciones":observaciones
    };
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_anticipos_registro',data).pipe(
      catchError(this.handlerError)
    );
  }

  listarSaldosProveedor(token_cat_proveedores:any):Observable<any>{
    let data = {"token_cat_proveedores":token_cat_proveedores};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_saldos_catalogo',data)
    .pipe(catchError(this.handlerError));
  }

  listarSaldosDisponiblesProveedor(token_cat_proveedores:any):Observable<any>{
    let data = {"token_cat_proveedores":token_cat_proveedores};
    return this.httpClient.post(this.url+'egresos_catalogos_proveedores_saldos_disponible',data)
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
