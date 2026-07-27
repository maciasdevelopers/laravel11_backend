import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  catalogoClientesGeneral(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_general',data)
    .pipe(catchError(this.handlerError));
    //ingresos_catalogos_listaclientes
  }

  catalogoClientesMX(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_mx',data)
    .pipe(catchError(this.handlerError))
  }

  catalogoClientesExtranjeros(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_extranjeros',data)
    .pipe(catchError(this.handlerError))
  }

  listaclientesPublicoGeneral():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_listaclientes_publicogeneral',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  listaclientesVentasMostrador():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_listaclientes_publicogeneralVentasMostrador',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getViewcliente(token_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_clientes":token_clientes});
    console.log(json);
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_verclientes',params,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  solicitaValidacionCliente(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_listaclientes_validacion_request',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  procesoValidacionCliente(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_listaclientes_validar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  eliminaCliente(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_cliente_papelera_save',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoEliminadosClientes():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_listaclienteseliminados',params,{headers: headers}).pipe(catchError(this.handlerError));
  }

  restaurarCliente(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_cliente_restaurar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  eliminacionPermanenteCliente(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_cliente_eliminar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  verificaExistsAllCliente(radioClient:any,subtipoClient:any,rfc_generico:any,client_rfc:any,id_tax:any,nombre:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"radioClient":radioClient,
      "subtipoClient":subtipoClient,"rfc_generico":rfc_generico,"client_rfc":client_rfc,"id_tax":id_tax,"nombre":nombre});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_verify_exist_cliente_one',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  updateGeneralesCliente(token_cliente:any,radioClient:any,subtipoClient:any,client_rfc:any,id_tax:any,nombre:any,nombre_comercial:any,sitio_web:any,regimen_fiscal:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"radioClient":radioClient,
      "subtipoClient":subtipoClient,"client_rfc":client_rfc,"id_tax":id_tax,"nombre":nombre,"nombre_comercial":nombre_comercial,"sitio_web":sitio_web,"regimen_fiscal":regimen_fiscal});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_verify_exist_cliente_two',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registraNuevoContactoCliente(token_cliente:any,paterno_edit:any,materno_edit:any,nombre_edit:any,area_contacto_edit:any,cargo_contacto_edit:any,lista_emails:any,lista_telefonos:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_cliente":token_cliente,
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
    return this._httpClient.post(this.url+'ingresos_catalogos_cliente_registra_contacto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  updateGeneralesContactoCliente(token_cliente:any,token_contacto:any,paterno_edit:any,materno_edit:any,nombre_edit:any,area_contacto_edit:any,cargo_contacto_edit:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_contacto":token_contacto,"paterno":paterno_edit,"materno":materno_edit,
      "nombre":nombre_edit,"area_contacto":area_contacto_edit,"cargo_contacto":cargo_contacto_edit});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_update_contacto_generales',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  agregaPhoneContactoCliente(token_cliente:any,token_contacto:any,etiqueta:any,numero_telefono:any,extension:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_contacto":token_contacto,"etiqueta":etiqueta,"numero_telefono":numero_telefono,"extension":extension});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_contacto_telefono_agregar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  updatePhoneContactoCliente(token_cliente:any,token_contacto:any,token_telefono:any,etiqueta:any,numero_telefono:any,extension:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_contacto":token_contacto,
      "token_telefono":token_telefono,"etiqueta":etiqueta,"numero_telefono":numero_telefono,"extension":extension});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_contacto_telefono_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deletePhoneContactoCliente(token_cliente:any,token_contacto:any,token_telefono:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_contacto":token_contacto,"token_telefono":token_telefono});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_contacto_telefono_delete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  agregaEMailContactoCliente(token_cliente:any,token_contacto:any,correo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_contacto":token_contacto,"correo":correo});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_contacto_email_agregar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  updateEMailContactoCliente(token_cliente:any,token_contacto:any,token_correo:any,correo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_contacto":token_contacto,"token_correo":token_correo,"correo":correo});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_contacto_email_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deleteEMailContactoCliente(token_cliente:any,token_contacto:any,token_correo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_contacto":token_contacto,"token_correo":token_correo});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_contacto_correo_delete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaCreditosCliente(token_cliente:any,token_creditos:any,data_moneda_code:any,data_moneda_decimales:any,data_limite_credito:any,
    data_dias_cobro_credito:any,data_comienzacomputo_credito:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_creditos":token_creditos,"data_moneda_code":data_moneda_code,
      "data_moneda_decimales":data_moneda_decimales,"txtlimiteCredito":data_limite_credito,"txtdiasCobroCredit":data_dias_cobro_credito,"selectComienzaCobroClient":data_comienzacomputo_credito});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_creditos_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registraCreditosCliente(
    token_cliente:any,    
    data_decideaceptcredito:any,
    data_moneda_code:any,
    data_moneda_decimales:any,
    data_limite_credito:any,
    data_dias_cobro_credito:any,
    data_comienzacomputo_credito:any,):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_cliente":token_cliente,
      "creditoAsignado":data_decideaceptcredito,
      "data_moneda_code":data_moneda_code,
      "data_moneda_decimales":data_moneda_decimales,
      "txtlimiteCredito":data_limite_credito,
      "txtdiasCobroCredit":data_dias_cobro_credito,
      "selectComienzaCobroClient":data_comienzacomputo_credito
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_creditos_registro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }
  
  eliminaCreditosCliente(token_cliente:any,token_creditos:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"token_creditos":token_creditos});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_creditos_delete',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaFormaCobroCliente(token_cliente:any,data_tiene_forma_cobro:any,data_token_forma_cobro:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"tiene_forma_cobro":data_tiene_forma_cobro,"formaCobroAltaClient":data_token_forma_cobro});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_fcobro_update',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registraFormaCobroCliente(token_cliente:any,data_token_forma_cobro:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cliente":token_cliente,"formaCobroAltaClient":data_token_forma_cobro});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_fcobro_registro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  habilitaEmitirFacturaAntesCobro(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_habilita_emitir_fact_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deshabilitaEmitirFacturaAntesCobro(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_cancela_emitir_fact_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  habilitaEntregaDeProdAntesCobro(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_entrega_de_prod_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deshabilitaEntregaDeProdAntesCobro(token_cat_clientes:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_cancela_entrega_de_prod_antes_cobro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  dipoMexUpdateUbicaCliente(token_cat_clientes:any,token_direccion:any,estado:any,municipio:any,codigo_postal:any,colonia:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes,"token_direccion":token_direccion,"estado":estado,"municipio":municipio,"codigo_postal":codigo_postal,"colonia":colonia,"api":"api"});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_update_ubicacion_dipomex',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  noApiUpdateUbicaCliente(token_cat_clientes:any,token_direccion:any,estado:any,municipio:any,codigo_postal:any,colonia:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_clientes":token_cat_clientes,"token_direccion":token_direccion,"estado":estado,"municipio":municipio,"codigo_postal":codigo_postal,"colonia":colonia,"api":"no_api_found"});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_clientes_update_ubicacion_no_api',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registraCliente(
    data_rfc_generico:any,
    data_rfc_real:any,
    data_id_tax:any,
    data_tipoClient:any,
    data_subtipoClient:any,
    data_name_cliente:any,
    data_cuenta_contable:any,

    data_nombre_comercial:any,
    data_curp:any,
    data_pais:any,
    data_sitWeb:any,
    data_tknRegimenFiscal:any,

    data_decideinfocontacto:any,
    data_arrayContactoPersonalClient_reg:any,

    data_tiene_docs_fiscales:any,
    data_docSituacionFiscal:File,
    data_base64CodeSitFical:any,
    data_docCumplimientoObFiscales:File,
    data_base64CodeCumplimientoObFiscales:any,
    docContratos:File,
    data_base64CodeContratos:any,
    data_files_anexos:any,
    data_valnoCargaDocsFiscalesRazon:any,

    data_decideaceptcredito:any,
    data_moneda_code:any,
    data_moneda_decimales:any,
    data_limite_credito:any,
    data_dias_cobro_credito:any,
    data_comienzacomputo_credito:any,

    data_decideformacobro:any,
    data_token_forma_cobro:any,
    data_tipoReferenciacobro:any,
    data_clabeInterbancariaBanco:any,
    data_receptFactura:any,
    data_classRecibeArtcobro:any,
    data_cod_postal:any,
    data_dipomex_cod_postal_estado:any,
    data_dipomex_cod_postal_municipio:any,
    data_dipomex_cod_postal_cp:any,
    data_dipomex_cod_postal_colonia_vinculada:any,
    data_listnewdireccionNac:any
  ):Observable<any>{
    const formData = new FormData();
    console.log(data_docSituacionFiscal+" "+data_docCumplimientoObFiscales);
    console.log(data_base64CodeSitFical);

    data_docSituacionFiscal ? formData.append('imagenAltaPdfFiscal',data_docSituacionFiscal,data_docSituacionFiscal.name) : formData.append('imagenAltaPdfFiscal','');
    formData.append('base64AltaPdfFiscal',data_base64CodeSitFical);
    
    data_docCumplimientoObFiscales ? formData.append('imagenAltaPdfCumplimientoObFiscales',data_docCumplimientoObFiscales,data_docCumplimientoObFiscales.name) : formData.append('imagenAltaPdfCumplimientoObFiscales','');
    formData.append('base64AltaPdfCumplimientoObFiscales',data_base64CodeCumplimientoObFiscales);
    
    docContratos ? formData.append('imagenAltaContratos',docContratos,docContratos.name) : formData.append('imagenAltaContratos','');
    formData.append('base64AltaPdfContratos',data_base64CodeContratos);

    for (var i = 0; i < data_files_anexos.length; i++) {
      formData.append("files_anexos[]", data_files_anexos[i]);
    }

    let json_registro = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "rfc_generico":data_rfc_generico,
      "client_rfc":data_rfc_real,
      "id_tax":data_id_tax,
      "radioClient":data_tipoClient,
      "subtipoClient":data_subtipoClient,
      "name_cliente":data_name_cliente,
      "cuenta_contable":data_cuenta_contable,
      "comercial_nombre":data_nombre_comercial,
      "curp":data_curp,
      "paistoken":data_pais,
      "sitio_web":data_sitWeb,
      "tknRegimenFiscal":data_tknRegimenFiscal,
      "decideinfocontacto":data_decideinfocontacto,
      "arrayContactoPersonal":data_arrayContactoPersonalClient_reg,
      "tiene_docs_fiscales":data_tiene_docs_fiscales,
      "valnoCargaDocsFiscalesRazon":data_valnoCargaDocsFiscalesRazon,
      "creditoAsignado":data_decideaceptcredito,
      "data_moneda_code":data_moneda_code,
      "data_moneda_decimales":data_moneda_decimales,
      "txtlimiteCredito":data_limite_credito,
      "txtdiasCobroCredit":data_dias_cobro_credito,
      "selectComienzaCobroClient":data_comienzacomputo_credito,
      "decideformaCobro":data_decideformacobro,
      "formaCobroAltaClient":data_token_forma_cobro,
      "receptFactura":data_receptFactura,
      "classRecibeArtcobro":data_classRecibeArtcobro,
      "cod_postal":data_cod_postal,
      "dipomex_cod_postal_estado":data_dipomex_cod_postal_estado,
      "dipomex_cod_postal_municipio":data_dipomex_cod_postal_municipio,
      "dipomex_cod_postal_cp":data_dipomex_cod_postal_cp,
      "dipomex_cod_postal_colonia_vinculada":data_dipomex_cod_postal_colonia_vinculada,
      "listnewdireccionNac":data_listnewdireccionNac
    });

    console.log(data_name_cliente);
    console.log(json_registro);
    formData.append('cliente',json_registro);
    console.log(formData);
    return this._httpClient.post(this.url+'ingresos_catalogos_registrar_cliente',formData).pipe(
      catchError(this.handlerError)
    );
  }

  registraCliente_old(
    rfc_generico:any,
    client_rfc:any,
    id_tax:any,
    radioClient:any,
    subtipoClient:any,
    txtPaternoPF:any,
    txtMaternoPF:any,
    txtnombrePF:any,
    txtNomComercialPF:any,
    txtcurpPF:any,
    paisPF:any,
    txtSitioWebPF:any,
    redesSocialesPF:any,
    txtempresa:any,
    pais:any,
    txtNomComercialPM:any,
    txtSitioWebPM:any,
    redesSocialesPM:any,
    decideinfocontacto:any,
    arrayContactoPersonal:any,
    tiene_docs_fiscales:any,
    docSitFiscal:File,
    base64SitFiscal:any,
    docCumpObFisc:File,
    base64CumpObFisc:any,
    valnoCargaDocsFiscalesRazon:any,
    aceptaCredito:any,
    txtMoneda:any,
    txtlimiteCredito:any,
    txtdiaspagoCredit:any,
    comienzaPago:any,
    formaPago:any,
    tipoReferenciaPago:any,
    clabeIntBanc:any,
    docEstCuenta:File,
    base64EstCuenta:any,
    locationExtranjera:any,
    locationNacional:any
  ):Observable<any>{
    console.log(docSitFiscal+" "+docEstCuenta+" "+docCumpObFisc);
    const formData = new FormData();
    if (docSitFiscal) {
      formData.append('docSitFiscal',docSitFiscal,docSitFiscal.name);
    } else {
      formData.append('docSitFiscal','');
    }
    console.log(base64SitFiscal);
    formData.append('base64SitFiscal',base64SitFiscal);
    if (docCumpObFisc) {
      formData.append('docCumpObFisc',docCumpObFisc,docCumpObFisc.name);
    } else {
      formData.append('docCumpObFisc','');
    }
    formData.append('base64CumpObFisc',base64CumpObFisc);

    console.log(docEstCuenta);
    if (docEstCuenta) {
      formData.append('docEstCuenta',docEstCuenta,docEstCuenta.name);
    }
    formData.append('base64EstCuenta',base64EstCuenta);
    console.log(txtempresa)
    formData.append('cliente',JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "rfc_generico":rfc_generico,
      "client_rfc":client_rfc,
      "id_tax":id_tax,
      "radioClient":radioClient,
      "subtipoClient":subtipoClient,
      "txtPaternoPF":txtPaternoPF,
      "txtMaternoPF":txtMaternoPF,
      "txtnombrePF":txtnombrePF,
      "txtcurpPF":txtcurpPF,
      "paisPF":paisPF,
      "txtNomComercialPF":txtNomComercialPF,
      "txtSitioWebPF":txtSitioWebPF,
      "redesSocialesPF":redesSocialesPF,
      "txtempresa":txtempresa,
      "pais":pais,
      "txtNomComercialPM":txtNomComercialPM,
      "txtSitioWebPM":txtSitioWebPM,
      "redesSocialesPM":redesSocialesPM,
      "decideinfocontacto":decideinfocontacto,
      "arrayContactoPersonal":arrayContactoPersonal,
      "tiene_docs_fiscales":tiene_docs_fiscales,
      "valnoCargaDocsFiscalesRazon":valnoCargaDocsFiscalesRazon,
      "aceptaCredito":aceptaCredito,
      "txtMoneda":txtMoneda,
      "txtlimiteCredito":txtlimiteCredito,
      "txtdiaspagoCredit":txtdiaspagoCredit,
      "comienzaPago":comienzaPago,
      "formaPago":formaPago,
      "tipoReferenciaPago":tipoReferenciaPago,
      "clabeIntBanc":clabeIntBanc,
      "locationExtranjera":locationExtranjera,
      "locationNacional":locationNacional,
    }));
    console.log(formData);
    return this._httpClient.post(this.url+'ingresos_catalogos_registrar_cliente',formData).pipe(
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
