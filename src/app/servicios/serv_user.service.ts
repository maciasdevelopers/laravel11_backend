import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../modelos/Usuarios';
import { global } from './global_ssic';
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Idle, NotIdle } from 'idlejs';
import { isPlatformBrowser } from '@angular/common';
import { SessionContextService } from './session-context';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  public url: string;
  public identif: any;
  public token: any;
  public parsed: any;

  public escuchandoMouse:boolean = false;
  public saliendo:boolean = false;
  public checador:any;
  public tiempo_lgout:any;
  public progreso:any;
  public id_interval:any;

  public expanded:boolean = false;
  //public id_interval:any;
  public activo:any;
  public inactivo:any;

  options = {};

  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private httpcliente: HttpClient,
    private translate:TranslateService,
    private routerr:Router,
    private sessionContext: SessionContextService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.url = global.urlApi;
  }

  registrar_usuario_nuevo(user_paterno:any,user_materno:any,user_nombres:any,user_email:any,user_email_encrypt:any,user_empresas:any,user_area:any,user_cargo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"user_paterno":user_paterno,"user_materno":user_materno,
      "user_nombres":user_nombres,"user_email":user_email,"user_email_encrypt":user_email_encrypt,"user_empresas":user_empresas,"user_area":user_area,"user_cargo":user_cargo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'registrar_usuario_nuevo',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  //usuarios
  usuarios_catalogo_general(): Observable<any>{
    return this.httpcliente.post(this.url+'catalogo_usuarios',null)
    .pipe(catchError(this.handlerError));
  }

  usuarios_catalogo_desglose(usuario_token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_token":usuario_token});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'usuarios_desglose_completo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  //credenciales de acceso
  generaPassCodeUser(access_code:any,password_code:any,usuario_token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"access_code":access_code,"password_code":password_code,"usuario_token":usuario_token});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'genera_credenciales_acceso_usuario',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  revocaPassCodeUser(usuario_token:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_token":usuario_token});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'revoca_credenciales_acceso_usuario',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  devilJerarquiaPermisoIngr(token_personal:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_personal":token_personal});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'actualizapaternopersonal',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  powerJerarquiaPermisoIngr(token_personal:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_personal":token_personal});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'actualizapaternopersonal',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  user_acceso_modulo_ssic(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_ssic',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_descarga_xml(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_descarga_xml',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_logistica(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_logistica',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_compras(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_compras',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_proyectos(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_proyectos',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_terceros(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_terceros',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_terceros_associates(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_terceros_associates',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_terceros_clientes(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_terceros_clientes',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_terceros_proveedores(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_terceros_proveedores',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_acceso_modulo_terceros_empleados(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_acceso_modulo_terceros_empleados',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

//permisos
  user_solicitar_permiso_jerarquia(usuario_empresa:any,usuario_user:any,modulo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"modulo":modulo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_solicitar_permiso_jerarquia',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_solicitar_permiso_crear(usuario_empresa:any,usuario_user:any,modulo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"modulo":modulo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_solicitar_permiso_crear',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_solicitar_permiso_editar(usuario_empresa:any,usuario_user:any,modulo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"modulo":modulo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_solicitar_permiso_editar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_solicitar_permiso_consulta(usuario_empresa:any,usuario_user:any,modulo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"modulo":modulo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_solicitar_permiso_consulta',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_solicitar_permiso_eliminar(usuario_empresa:any,usuario_user:any,modulo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"modulo":modulo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_solicitar_permiso_eliminar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_solicitar_permiso_ver_docs(usuario_empresa:any,usuario_user:any,modulo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"modulo":modulo});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_solicitar_permiso_ver_docs',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }
//ingresos
  user_permisos_ingresos_acceso(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_ingresos_acceso',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_ingresos_jerarquia(usuario_empresa:any,usuario_user:any,jerarquia:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"jerarquia":jerarquia});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_ingresos_jerarquia',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }
  
  user_permisos_ingresos_crear(usuario_empresa:any,usuario_user:any,perm_crear:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_crear":perm_crear});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_ingresos_crear',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_ingresos_editar(usuario_empresa:any,usuario_user:any,perm_editar:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_editar":perm_editar});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_ingresos_editar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_ingresos_consultar(usuario_empresa:any,usuario_user:any,perm_consulta:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_consulta":perm_consulta});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_ingresos_consultar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_ingresos_eliminar(usuario_empresa:any,usuario_user:any,perm_elimina:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_elimina":perm_elimina});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_ingresos_eliminar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_ingresos_ver_docs(usuario_empresa:any,usuario_user:any,perm_ver_docs:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_ver_docs":perm_ver_docs});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_ingresos_ver_docs',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  //Catalogos
  //Route::post("user_permisos_ingresos_catalogos_modulo",[MAIN_UsuarioController::class,"userPermisosIngresosCatalogosModulo"]);
    //Route::post("user_permisos_ingresos_mercancias",[MAIN_UsuarioController::class,"userPermisosIngresosMercancias"]);
    //Route::post("user_permisos_ingresos_servicios",[MAIN_UsuarioController::class,"userPermisosIngresosServicios"]);
    //Route::post("user_permisos_ingresos_lista_precios",[MAIN_UsuarioController::class,"userPermisosIngresosListaPrecios"]);
    //Route::post("user_permisos_ingresos_descuentos",[MAIN_UsuarioController::class,"userPermisosIngresosDescuentos"]);
    //Route::post("user_permisos_ingresos_promociones",[MAIN_UsuarioController::class,"userPermisosIngresosPromociones"]);
    //Route::post("user_permisos_ingresos_impuestos",[MAIN_UsuarioController::class,"userPermisosIngresosImpuestos"]);
    //Route::post("user_permisos_ingresos_clientes",[MAIN_UsuarioController::class,"userPermisosIngresosClientes"]);
  //Route::post("user_permisos_ingresos_ventas_modulo",[MAIN_UsuarioController::class,"userPermisosIngresosVentasModulo"]);
    //Route::post("user_permisos_ingresos_pedidos",[MAIN_UsuarioController::class,"userPermisosIngresosPedidos"]);
    //Route::post("user_permisos_ingresos_ventas",[MAIN_UsuarioController::class,"userPermisosIngresosVentas"]);
    //Route::post("user_permisos_ingresos_seguimiento_ventas",[MAIN_UsuarioController::class,"userPermisosIngresosSeguimientoVentas"]);
    //Route::post("user_permisos_ingresos_devoluciones",[MAIN_UsuarioController::class,"userPermisosIngresosDevoluciones"]);
    //Route::post("user_permisos_ingresos_facturacion",[MAIN_UsuarioController::class,"userPermisosIngresosFacturacion"]);
  //Route::post("user_permisos_ingresos_reportes",[MAIN_UsuarioController::class,"userPermisosIngresosReportes"]);
//egresos
  user_permisos_egresos_acceso(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_egresos_acceso',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_egresos_jerarquia(usuario_empresa:any,usuario_user:any,jerarquia:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"jerarquia":jerarquia});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_egresos_jerarquia',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_egresos_crear(usuario_empresa:any,usuario_user:any,perm_crear:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_crear":perm_crear});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_egresos_crear',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_egresos_editar(usuario_empresa:any,usuario_user:any,perm_editar:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_editar":perm_editar});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_egresos_editar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_egresos_consultar(usuario_empresa:any,usuario_user:any,perm_consulta:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_consulta":perm_consulta});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_egresos_consultar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_egresos_eliminar(usuario_empresa:any,usuario_user:any,perm_elimina:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_elimina":perm_elimina});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_egresos_eliminar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_egresos_ver_docs(usuario_empresa:any,usuario_user:any,perm_ver_docs:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_ver_docs":perm_ver_docs});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_egresos_ver_docs',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  //Route::post("user_permisos_egresos_catalogos_modulo",[MAIN_UsuarioController::class,"userPermisosEgresosCatalogosModulo"]);
    //Route::post("user_permisos_egresos_productos",[MAIN_UsuarioController::class,"userPermisosEgresosProductos"]);
    //Route::post("user_permisos_egresos_servicios",[MAIN_UsuarioController::class,"userPermisosEgresosServicios"]);
    //Route::post("user_permisos_egresos_activos_fijos",[MAIN_UsuarioController::class,"userPermisosEgresosActivosFijos"]);
    //Route::post("user_permisos_egresos_activos_intang",[MAIN_UsuarioController::class,"userPermisosEgresosActivosIntang"]);
    //Route::post("user_permisos_egresos_proveedores",[MAIN_UsuarioController::class,"userPermisosEgresosProveedores"]);
    //Route::post("user_permisos_egresos_establecimientos",[MAIN_UsuarioController::class,"userPermisosEgresosEstablecimientos"]);
  //Compras
  //Route::post("user_permisos_egresos_compras_modulo",[MAIN_UsuarioController::class,"userPermisosEgresosComprasModulo"]);
    //Route::post("user_permisos_egresos_requisiciones",[MAIN_UsuarioController::class,"userPermisosEgresosRequisiciones"]);
    //Route::post("user_permisos_egresos_cotizaciones",[MAIN_UsuarioController::class,"userPermisosEgresosCotizaciones"]);
    //Route::post("user_permisos_egresos_compra_directa",[MAIN_UsuarioController::class,"userPermisosEgresosCompraDirecta"]);
    //Route::post("user_permisos_egresos_compra_seguimiento",[MAIN_UsuarioController::class,"userPermisosEgresosCompraSeguimiento"]);
//finanzas
  user_permisos_finanzas_acceso(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_finanzas_acceso',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_finanzas_jerarquia(usuario_empresa:any,usuario_user:any,jerarquia:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"jerarquia":jerarquia});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_finanzas_jerarquia',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_finanzas_crear(usuario_empresa:any,usuario_user:any,perm_crear:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_crear":perm_crear});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_finanzas_crear',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_finanzas_editar(usuario_empresa:any,usuario_user:any,perm_editar:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_editar":perm_editar});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_finanzas_editar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_finanzas_consultar(usuario_empresa:any,usuario_user:any,perm_consulta:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_consulta":perm_consulta});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_finanzas_consultar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_finanzas_eliminar(usuario_empresa:any,usuario_user:any,perm_elimina:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_elimina":perm_elimina});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_finanzas_eliminar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_finanzas_ver_docs(usuario_empresa:any,usuario_user:any,perm_ver_docs:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_ver_docs":perm_ver_docs});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_finanzas_ver_docs',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }
  
  //Route::post("user_permisos_finanzas_catalogos_modulo",[MAIN_UsuarioController::class,"userPermisosFinanzasCatalogosModulo"]);
    //Route::post("user_permisos_finanzas_cuentas_bancarias",[MAIN_UsuarioController::class,"userPermisosFinanzasCuentasBancarias"]);
    //Route::post("user_permisos_finanzas_caja",[MAIN_UsuarioController::class,"userPermisosFinanzasCaja"]);
    //Route::post("user_permisos_finanzas_monederos_electronicos",[MAIN_UsuarioController::class,"userPermisosFinanzasMonederosElectronicos"]);
    //Route::post("user_permisos_finanzas_dispositivos_electronicos",[MAIN_UsuarioController::class,"userPermisosFinanzasDispositivosElectronicos"]);
  //Route::post("user_permisos_finanzas_control_mov_bancarios",[MAIN_UsuarioController::class,"userPermisosFinanzasControlMovBancarios"]);
  //Route::post("user_permisos_finanzas_control_mov_efectivo",[MAIN_UsuarioController::class,"userPermisosFinanzasControlMovEfectivo"]);
  //Route::post("user_permisos_finanzas_ordenes_pago",[MAIN_UsuarioController::class,"userPermisosFinanzasOrdenesPago"]);
  //Route::post("user_permisos_finanzas_ajustes_ycpr",[MAIN_UsuarioController::class,"userPermisosFinanzasAjustesyCPR"]);
  //Route::post("user_permisos_finanzas_info_bancaria",[MAIN_UsuarioController::class,"userPermisosFinanzasInfoBancaria"]);
//valor_humano
  user_permisos_valor_humano_acceso(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_valor_humano_acceso',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_valor_humano_jerarquia(usuario_empresa:any,usuario_user:any,jerarquia:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"jerarquia":jerarquia});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_valor_humano_jerarquia',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_valor_humano_crear(usuario_empresa:any,usuario_user:any,perm_crear:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_crear":perm_crear});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_valor_humano_crear',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_valor_humano_editar(usuario_empresa:any,usuario_user:any,perm_editar:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_editar":perm_editar});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_valor_humano_editar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_valor_humano_consultar(usuario_empresa:any,usuario_user:any,perm_consulta:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_consulta":perm_consulta});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_valor_humano_consultar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_valor_humano_eliminar(usuario_empresa:any,usuario_user:any,perm_elimina:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_elimina":perm_elimina});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_valor_humano_eliminar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_valor_humano_ver_docs(usuario_empresa:any,usuario_user:any,perm_ver_docs:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_ver_docs":perm_ver_docs});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_valor_humano_ver_docs',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  //Route::post("user_permisos_valor_humano_catalogos",[MAIN_UsuarioController::class,"userPermisosValorHumanoCatalogos"]);
  //Route::post("user_permisos_valor_humano_reembolsos",[MAIN_UsuarioController::class,"userPermisosValorHumanoReembolsos"]);
  //Route::post("user_permisos_valor_humano_justificacion_gastos",[MAIN_UsuarioController::class,"userPermisosValorHumanoJustificacionGastos"]);
  //Route::post("user_permisos_valor_humano_reportes",[MAIN_UsuarioController::class,"userPermisosValorHumanoReportes"]);
//contabilidad
  user_permisos_contabilidad_acceso(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_contabilidad_acceso',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_contabilidad_jerarquia(usuario_empresa:any,usuario_user:any,jerarquia:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"jerarquia":jerarquia});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_contabilidad_jerarquia',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_contabilidad_crear(usuario_empresa:any,usuario_user:any,perm_crear:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_crear":perm_crear});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_contabilidad_crear',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_contabilidad_editar(usuario_empresa:any,usuario_user:any,perm_editar:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_editar":perm_editar});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_contabilidad_editar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_contabilidad_consultar(usuario_empresa:any,usuario_user:any,perm_consulta:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_consulta":perm_consulta});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_contabilidad_consultar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_contabilidad_eliminar(usuario_empresa:any,usuario_user:any,perm_elimina:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_elimina":perm_elimina});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_contabilidad_eliminar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_contabilidad_ver_docs(usuario_empresa:any,usuario_user:any,perm_ver_docs:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_ver_docs":perm_ver_docs});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_contabilidad_ver_docs',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  //Route::post("user_permisos_contabilidad_catalogos",[MAIN_UsuarioController::class,"userPermisosContabilidadCatalogos"]);
  //Route::post("user_permisos_contabilidad_politicas",[MAIN_UsuarioController::class,"userPermisosContabilidadPoliticas"]);
  //Route::post("user_permisos_contabilidad_catalogo_cuentas",[MAIN_UsuarioController::class,"userPermisosContabilidadCatalogoCuentas"]);
  //Route::post("user_permisos_contabilidad_estados_financieros",[MAIN_UsuarioController::class,"userPermisosContabilidadEstadosFinancieros"]);
  //Route::post("user_permisos_contabilidad_reportes",[MAIN_UsuarioController::class,"userPermisosContabilidadReportes"]);
//tec_info
  user_permisos_teci_info_acceso(usuario_empresa:any,usuario_user:any,acceso:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"acceso":acceso});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_acceso',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_jerarquia(usuario_empresa:any,usuario_user:any,jerarquia:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"jerarquia":jerarquia});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_jerarquia',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_crear(usuario_empresa:any,usuario_user:any,perm_crear:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_crear":perm_crear});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_crear',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_editar(usuario_empresa:any,usuario_user:any,perm_editar:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_editar":perm_editar});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_editar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_consultar(usuario_empresa:any,usuario_user:any,perm_consulta:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_consulta":perm_consulta});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_consultar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_eliminar(usuario_empresa:any,usuario_user:any,perm_elimina:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_elimina":perm_elimina});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_eliminar',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_ver_docs(usuario_empresa:any,usuario_user:any,perm_ver_docs:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_ver_docs":perm_ver_docs});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_ver_docs',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_apps_complementarias(usuario_empresa:any,usuario_user:any,perm_apps:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_apps":perm_apps});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_apps_complementarias',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_soporte(usuario_empresa:any,usuario_user:any,perm_soporte:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_soporte":perm_soporte});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_soporte',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_comunicacion(usuario_empresa:any,usuario_user:any,perm_comunicacion:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_comunicacion":perm_comunicacion});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_comunicacion',parametros, {headers: headers}).pipe(catchError(this.handlerError));
  }

  user_permisos_teci_info_publicaciones(usuario_empresa:any,usuario_user:any,perm_publicaciones:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"usuario_empresa":usuario_empresa,"usuario_user":usuario_user,"perm_publicaciones":perm_publicaciones});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'user_permisos_teci_info_publicaciones',parametros, {headers: headers}).pipe(catchError(this.handlerError));
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
