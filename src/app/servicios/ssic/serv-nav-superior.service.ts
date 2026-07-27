import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfNavSuperior } from '../../interfaces/interf-nav-superior';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class ServNavSuperiorService {
  private urlhorarioUso = 'horarioUso';
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
    var json_usuario = [];
    let identifica_usuario:any = localStorage.getItem('user_info');
    json_usuario.push(JSON.parse(identifica_usuario));
  }

  getRelojAutomatico(): Observable<any>{
    //return this.httpClient.get<InterfNavSuperior[]>(this.url+this.urlhorarioUso)
    //.pipe(catchError(this.errorHandler))
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      //console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+this.urlhorarioUso,parametros, {headers: headers}).pipe(
        catchError(this.errorHandler)
      ); // enviar las peticiones ajax
  }

  cambia_foto_perfil(avatar_user_img:File):Observable<any>{
    const formData = new FormData();
    if (avatar_user_img) {
      formData.append('avatar_user_img', avatar_user_img, avatar_user_img.name);
    }    
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    formData.append('json',json);
    return this._httpClient.post(this.url+'user_update_avatar',formData)
    .pipe(catchError(this.errorHandler));
  }

  updateIdioma(lenguaje:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"lenguaje":lenguaje});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post<any>(this.url+'update_language',parametros, {headers: headers}).pipe(catchError(this.errorHandler)); // enviar las peticiones ajax
  }

  getFechaInput(): Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      //console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'getFechaInput',parametros, {headers: headers}).pipe(
        catchError(this.errorHandler)
      ); // enviar las peticiones ajax
  }

  getAccesosByMenu(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post<any>(this.url+'permisos_acceso_menu',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
  }

  getConfigUser(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post<any>(this.url+'all_user_config_ssic',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
    //console.log(json);
  }

  getNewPermisoIngresos(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post<any>(this.url+'permisos_acceso_ingresos',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
    console.log(json);
  }
//ingresos
//egresos
  acceso_egresos_reembolsos(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    console.log(json);
    return this._httpClient.post<any>(this.url+'permisos_egresos_acceso_reem',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
  }

  acceso_egresos_justificaciones(): Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    console.log(json);
    return this._httpClient.post<any>(this.url+'permisos_egresos_acceso_just',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
  }

//finanzas
acceso_finanzas_acceso_ordenesdepago(): Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
  let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
  let parametros = 'json='+json;
  console.log(json);
  return this._httpClient.post<any>(this.url+'permisos_finanzas_acceso_ordenesdepago',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
}

//valor_humano
  acceso_vhum_reembolsos(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    console.log(json);
    return this._httpClient.post<any>(this.url+'permisos_vhum_acceso_reem',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
  }

  acceso_vhum_justificaciones(): Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    console.log(json);
    return this._httpClient.post<any>(this.url+'permisos_vhum_acceso_just',parametros, {headers: headers}).pipe(catchError(this.errorHandler));
  }

//contabilidad
//tec_info

	errorHandler(error: { error: { message: string; }; status: any; message: any; }){
		let errorMensaje = '';
		if(error.error instanceof ErrorEvent){
			errorMensaje = error.error.message;
		} else {
			errorMensaje = `Error code: ${error.status}\nMessage: ${error.message}`;
		}
		return throwError(errorMensaje);
	}

}
