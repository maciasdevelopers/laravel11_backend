import { Injectable } from '@angular/core';
import { sessionModelo } from '../modelos/sessionModelo';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { global } from './global_ssic';
import { ServEncryptService } from './ssic/serv-encrypt.service';
import { Idle, NotIdle } from 'idlejs';
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SessionContextService } from './session-context';

@Injectable({
  providedIn: 'root'
})
export class SentinelArkManager {
  public url: string;
  public parsed: any;
  public identif: any;
  public token: any;
  public activo:any;
  public inactivo:any;
  private relojJuicio: any;

  constructor(
    private http: HttpClient,
    private encryptor:ServEncryptService,
    private translate:TranslateService,
    private sessionContext:SessionContextService,
    private routerr:Router,
  ) {
    this.url = global.urlApi;
  }

  //logins
  inicia_session_usuario_main(usuarioArray: sessionModelo) :Observable<any>{
    console.log(JSON.stringify(usuarioArray));
    const url_completa = `${this.url}usuario_login_main`;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(url_completa,usuarioArray, {headers: headers,withCredentials: true})
    .pipe(catchError(this.handlerError));
  }

  //actualizacion de constraseñas
  sendCodePassUpdate(usuarioArray: sessionModelo, gettoken: boolean | null) :Observable<any>{
    let json = JSON.stringify(usuarioArray);
    console.log(json);
    let parametros = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this.http.post(this.url+'save_codigopass_ssic',parametros, {headers: headers}).pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  verifCodePassUpdate(user_token_text:any,code_verif_txt:any) :Observable<any>{
    let json = JSON.stringify({"user_token":user_token_text,"code_verif":code_verif_txt});
    console.log(json);
    let parametros = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this.http.post(this.url+'verif_codigopass_ssic',parametros, {headers: headers}); // enviar las peticiones ajax
  }

  resetPasswordSsic(user_token_text:any,passPrimera:any,passSegunda:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({
      "user_token":user_token_text,
      "passPrimera":this.encryptor.santoEncryptPass(passPrimera),
      "passSegunda":this.encryptor.santoEncryptPass(passSegunda)
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.http.post(this.url+'reset_passwpord_ssic',parametros,{headers: headers}).pipe(catchError(this.handlerError));
  }

  //sesiones inciadas
  tiempo_inactivo_contador():void{
    this.detener_actividad_vigilancia();
    console.log('inactivo');
    this.activo = new NotIdle()
      .whenInteractive()
      .within(5, 1000)
      .do(() => this.registra_actividad())
      .start();

    this.inactivo = new Idle()
      .whenNotInteractive()
      .within(3)
      .do(() => this.inactividad_alerta())
      .start();
  }

  detener_actividad_vigilancia():void{
    this.activo?.stop();
    this.inactivo?.stop();
    clearInterval(this.relojJuicio);
  }

  registra_actividad():void{
    localStorage.setItem('last_actividad',""+Math.floor(new Date().getTime()/1000.0));
    if (this.inactivo) {
      this.inactivo.stop();
      this.inactivo.restart();
    }
  }

  inactividad_alerta():void{
    console.log('inactivo');
    if (localStorage.getItem('user_code')) {
      this.detener_actividad_vigilancia();
      let segundosRestantes = 60;
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        html: `Por su seguridad su sesión se cerrará en <b id="timer-b" style="font-size: 20px;">${segundosRestantes}</b> segundos.`,
        timer: 60000,
        timerProgressBar: true,
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_cancel"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_yes_logout"),
        didOpen: () => {
          const b_tag = Swal.getHtmlContainer()?.querySelector('#timer-b');
          this.relojJuicio = setInterval(() => {
            segundosRestantes--;
            if (b_tag) b_tag.textContent = `${segundosRestantes}`;
          }, 1000);
        },
        willClose: () => clearInterval(this.relojJuicio)
      }).then((result) => {
        if (result.isConfirmed) {
          this.tiempo_inactivo_contador();
        } else {
          this.apocalipsisSesion();
        }
      }); 
    }
  }

  apocalipsisSesion(){
    this.detener_actividad_vigilancia();
    localStorage.clear();
    sessionStorage.clear();
    this.sessionContext.clear();
    this.translate.use('es');
    this.routerr.navigate(['./']);
    $('.modal-backdrop').remove();
  }

  getIdentifUsuario(){
    this.parsed = localStorage.getItem('user_info');
    let identify = JSON.parse(this.parsed);
    this.identif = identify && identify != 'undefined' ? identify : null;
    return this.identif;
  }

  getTokenStorage(){
    let token = sessionStorage.getItem('inside_session_code');
    this.token = token && token != 'undefined' ? token : null;
    return this.token;
  }

  addEmpresaUsuarioAllConfig(
    company_token:any,
    company_name_short:any,
    company_name_large:any,
    regimen_fiscal_token:any,
    regimen_fiscal_descripcion:any,
    habilita_centros_de_trabajo:any,
    zona_horaria:any,
    zona_horaria_utc:any,
    codigo_pais:any,
    rfc_generico:any,
    rfc_emp:any,
    tax_id_emp:any,
    logotypo:any,
    conf_ingresos:any,
    conf_egresos:any,
    conf_finanzas:any,
    conf_valor_humano:any,
    conf_contabilidad:any,
    conf_tec_info:any,
    jerarquia:any,
    settings_privilegio_crear:any,
    settings_privilegio_editar:any,
    settings_privilegio_consulta:any,
    settings_privilegio_elimina:any,
    settings_privilegio_ver_docs:any,
    e_moneda_code:any,
    e_moneda_decimales:any,
    acreedor:any,
    habilita_reembolsos:any
  ){
    var parse_storage:any = localStorage.getItem('user_info');

    let arrayEmp: { emp_token: any,company_name_short: any,company_name_large: any,regimen_fiscal_token:any,regimen_fiscal_descripcion:any,
      habilita_centros_de_trabajo:any,zona_horaria: any,zona_horaria_utc: any,codigo_pais: any,rfc_generico: any,rfc_emp: any,tax_id_emp: any,
      logotypo: any,conf_ingresos: any,conf_egresos: any,conf_finanzas: any,conf_valor_humano: any,conf_contabilidad: any,conf_tec_info: any,
      jerarquia: any,settings_privilegio_crear: any,settings_privilegio_editar: any,settings_privilegio_consulta: any,
      settings_privilegio_elimina: any,settings_privilegio_ver_docs: any,e_moneda_code:any,e_moneda_decimales:any,}[] = [];
    arrayEmp.push({
      "emp_token":company_token,
      "company_name_short":company_name_short,
      "company_name_large":company_name_large,
      "regimen_fiscal_token":regimen_fiscal_token,
      "regimen_fiscal_descripcion":regimen_fiscal_descripcion,
      "habilita_centros_de_trabajo":habilita_centros_de_trabajo,
      "zona_horaria":zona_horaria,
      "zona_horaria_utc":zona_horaria_utc,
      "codigo_pais":codigo_pais,
      "rfc_generico":rfc_generico,
      "rfc_emp":rfc_emp,
      "tax_id_emp":tax_id_emp,
      "logotypo":logotypo,
      "conf_ingresos":conf_ingresos,
      "conf_egresos":conf_egresos,
      "conf_finanzas":conf_finanzas,
      "conf_valor_humano":conf_valor_humano,
      "conf_contabilidad":conf_contabilidad,
      "conf_tec_info":conf_tec_info,
      "jerarquia":jerarquia,
      "settings_privilegio_crear":settings_privilegio_crear,
      "settings_privilegio_editar":settings_privilegio_editar,
      "settings_privilegio_consulta":settings_privilegio_consulta,
      "settings_privilegio_elimina":settings_privilegio_elimina,
      "settings_privilegio_ver_docs":settings_privilegio_ver_docs,
      "e_moneda_code":e_moneda_code,
      "e_moneda_decimales":e_moneda_decimales,
    });

    var info_user = JSON.parse(parse_storage);
    info_user.acreedor = acreedor;
    info_user.habilita_reembolsos = habilita_reembolsos;
    info_user.company = arrayEmp;
    localStorage.setItem('user_info',JSON.stringify(info_user));
  }

  usuario_logout_main() :Observable<any>{
    const url_completa = `${this.url}usuario_logout_main`;
    let headers = new HttpHeaders().set('Content-Type','application/json');

    return this.http.post(url_completa, {}, {  // ✅ body vacío
      headers: headers,
      withCredentials: true                // ✅ para enviar cookies
    }).pipe(catchError(this.handlerError));
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
