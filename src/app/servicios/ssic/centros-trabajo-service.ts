import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { centroTrabajoModelo } from '../../modelos/centroTrabajoModelo';

@Injectable({
  providedIn: 'root'
})
export class CentrosTrabajoService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  registroCentroTrabajo(centro_trab:centroTrabajoModelo):Observable<any>{

    //public centrotrab_fecha_contabilizacion: string,
    //public centrotrab_clave_registro_patronal_imss: string,
    //public riesgo_division: string,
    //public riesgo_grupo: string,
    //public riesgo_fraccion: string,
    //public riesgo_clave: string,
    //public centrotrab_descripcion: string,
    //public centrotrab_ubicacion: string,
    //public centrotrab_baja: boolean,
    //public centrotrab_causa_baja: string,
    //public centrotrab_fecha_baja:string

    let cuenta = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "registro_patronal_imss":centro_trab.centrotrab_clave_registro_patronal_imss,
      "riesgo_division":centro_trab.riesgo_division,
      "riesgo_grupo":centro_trab.riesgo_grupo,
      "riesgo_fraccion":centro_trab.riesgo_fraccion,
      "riesgo_clave":centro_trab.riesgo_clave,
      "descripcion":centro_trab.centrotrab_descripcion,
      "ubicacion":centro_trab.centrotrab_ubicacion,
    });
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_registra_centro_trabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoGeneralCentrosTrabajo(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogos_centros_de_trabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  detalleCentroTrabajo(centrotrab_uuid:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"centrotrab_uuid":centrotrab_uuid,});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_centros_de_trabajo_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaCentroTrabajo(centrotrab_uuid:any,centro_trab:centroTrabajoModelo):Observable<any>{
    let cuenta = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "centrotrab_uuid":centrotrab_uuid,
      "registro_patronal_imss":centro_trab.centrotrab_clave_registro_patronal_imss,
      "riesgo_division":centro_trab.riesgo_division,
      "riesgo_grupo":centro_trab.riesgo_grupo,
      "riesgo_fraccion":centro_trab.riesgo_fraccion,
      "riesgo_clave":centro_trab.riesgo_clave,
      "descripcion":centro_trab.centrotrab_descripcion,
      "ubicacion":centro_trab.centrotrab_ubicacion,
    });
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_centros_de_trabajo_actualiza',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoCentrosTrabajoActivos(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogos_centros_de_trabajo_activos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoCentrosTrabajoEliminados(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogos_centros_de_trabajo_eliminados',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  altaCentroTrabajo(centrotrab_uuid:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"centrotrab_uuid":centrotrab_uuid});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_alta_centro_trabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  bajaCentroTrabajo(centrotrab_uuid:any,baja_motivo:any,fecha_contabilizacion:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"centrotrab_uuid":centrotrab_uuid,"baja_motivo":baja_motivo,"fecha_contabilizacion":fecha_contabilizacion});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_baja_centro_trabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoCentrosTrabajoInactivos(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogos_centros_de_trabajo_inactivos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  eliminaCentroTrabajo(centrotrab_uuid:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"centrotrab_uuid":centrotrab_uuid,});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_elimina_centro_trabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  restauraCentroTrabajo(centrotrab_uuid:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"centrotrab_uuid":centrotrab_uuid,});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_restaura_centro_trabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  eliminacionPermanenteCentroTrabajo(centrotrab_uuid:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"centrotrab_uuid":centrotrab_uuid,});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_eliminacion_permanente_centro_trabajo',parametros, {headers: headers}).pipe(
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
