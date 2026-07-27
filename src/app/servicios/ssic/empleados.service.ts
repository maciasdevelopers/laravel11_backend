import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { trabajadoresModelo } from '../../modelos/trabajadoresModelo';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  catalogoAreasEmp(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'lista_areas_sos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoGeneralTrabajadores(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogo_general_trabajadores',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoGeneralTrabajadoresXRegistroPatronal(registro_patronal:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "registro_patronal":registro_patronal
    });
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogo_trabajadores_por_registro_patronal',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoTrabajadoresDetalle(token_empleado_vhum:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_empleado_vhum":token_empleado_vhum});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_trabajadores_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  altaTrabajador(token_empleado_vhum:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_empleado_vhum":token_empleado_vhum});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_alta_trabajador',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  bajaTrabajador(token_empleado_vhum:any,baja_motivo:any,fecha_contabilizacion:any):Observable<any>{
    let cuenta = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_empleado_vhum":token_empleado_vhum,"baja_motivo":baja_motivo,"fecha_contabilizacion":fecha_contabilizacion});
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_baja_trabajador',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoTrabajadoresActivos(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogo_trabajadores_activos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoTrabajadoresInactivos(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogo_trabajadores_inactivos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoTrabajadoresEliminados(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_catalogo_trabajadores_eliminados',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoTrabajadorEliminar(token_empleado_vhum:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_empleado_vhum":token_empleado_vhum});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_trabajadores_eliminar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoTrabajadorRestaurar(token_empleado_vhum:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_empleado_vhum":token_empleado_vhum});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_trabajadores_restaurar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoTrabajadorDeletePermanente(token_empleado_vhum:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_empleado_vhum":token_empleado_vhum});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_trabajadores_eliminacion_permanente',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoTrabajadoresInfoNominas(token_empleado_vhum:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_empleado_vhum":token_empleado_vhum});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_trabajadores_info_para_nominas',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  valorHumanoTrabajadoresInfoNominasByNSS(trabajador_nss:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"trabajador_nss":trabajador_nss});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'valor_humano_trabajadores_info_para_nominas_by_nss',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizarTrabajador(trabajador:trabajadoresModelo,salario_diario:string,salario_integrado:string,entra_en_vigor:string,observacion:string,token_empleado_vhum:any):Observable<any>{
    let cuenta = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_empleado_vhum":token_empleado_vhum,
      "apePaterno":trabajador.apePaterno,
      "apeMaterno":trabajador.apeMaterno,
      "nombres":trabajador.nombres,
      "edad":trabajador.edad,
      "domicilio_CalleNumero":trabajador.domicilio_CalleNumero,
      "domicilio_cod_postal":trabajador.domicilio_cod_postal,
      "domicilio_colonia_vinculada":trabajador.domicilio_colonia_vinculada,
      "domicilio_municipio":trabajador.domicilio_municipio,
      "domicilio_estado":trabajador.domicilio_estado,
      "origen_nacimiento_fecha":trabajador.origen_nacimiento_fecha,
      "origen_nacimiento_lugar":trabajador.origen_nacimiento_lugar,
      "origen_nacionalidad":trabajador.origen_nacionalidad,
      "sexo":trabajador.sexo,
      "estado_civil":trabajador.estado_civil,
      "regimen_trabajador":trabajador.regimen_trabajador,
      "contacto_telefono_tipo":trabajador.contacto_telefono_tipo,
      "contacto_telefono_numero":trabajador.contacto_telefono_numero,
      "contacto_email":trabajador.contacto_email,
      "documentacion_curp":trabajador.documentacion_curp,
      "documentacion_rfc":trabajador.documentacion_rfc,
      "documentacion_pasaporte_new":trabajador.documentacion_pasaporte_list_new,
      "documentacion_pasaporte_delete":trabajador.documentacion_pasaporte_list_registrados.filter((row:any) => row.pasaporte_estado === 'delete'),
      "documentacion_visa_new":trabajador.documentacion_visa_list_new,
      "documentacion_visa_delete":trabajador.documentacion_visa_list_registrados.filter((row:any) => row.visa_estado === 'delete'),
      "documentacion_numero_de_seguridad_social":trabajador.documentacion_numero_de_seguridad_social,
      "documentacion_licencia_new":trabajador.documentacion_licencia_list_new,
      "documentacion_licencia_delete":trabajador.documentacion_licencia_list_registrados.filter((row:any) => row.licencia_estado === 'delete'),
      //cbancaria
      "cbancaria_banco_token":trabajador.cbancaria_banco_token,
      "cbancaria_cuenta":trabajador.cbancaria_cuenta,
      "cbancaria_clabe_inter":trabajador.cbancaria_clabe_inter,
      "cbancaria_sucursal":trabajador.cbancaria_sucursal,

      "centro_de_trabajo":trabajador.centro_de_trabajo,
      //salario
      "departamento":trabajador.departamento,
      "puesto":trabajador.puesto,
      //salario
      "salario_tipo":trabajador.salario_tipo,
      //contratacion
      "contratacion_tipo":trabajador.contratacion_tipo,
      "contratacion_fecha":trabajador.contratacion_fecha,
      "alta_en_empresa":trabajador.fecha_alta_en_empresa,
      "nomina_periodicidad":trabajador.nomina_periodicidad,
      "nomina_moneda":trabajador.nomina_moneda,
      "tipo_jornada":trabajador.tipo_jornada,
      "turno":trabajador.turno,
      "salario_diario":salario_diario,
      "salario_integrado":salario_integrado,
      "entra_en_vigor":entra_en_vigor,
      "observacion":observacion
    });
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_actualizatrabajador',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaResponsables(token_establecimiento:string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_establecimiento":token_establecimiento});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'inventarios_catalogos_establecimientoresponsables',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaResponsablesMonedero(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'listapersgeneral',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registroTrabajador(trabajador:trabajadoresModelo):Observable<any>{
    let cuenta = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "apePaterno":trabajador.apePaterno,
      "apeMaterno":trabajador.apeMaterno,
      "nombres":trabajador.nombres,
      "edad":trabajador.edad,
      "domicilio_CalleNumero":trabajador.domicilio_CalleNumero,
      "domicilio_cod_postal":trabajador.domicilio_cod_postal,
      "domicilio_colonia_vinculada":trabajador.domicilio_colonia_vinculada,
      "domicilio_municipio":trabajador.domicilio_municipio,
      "domicilio_estado":trabajador.domicilio_estado,
      "origen_nacimiento_fecha":trabajador.origen_nacimiento_fecha,
      "origen_nacimiento_lugar":trabajador.origen_nacimiento_lugar,
      "origen_nacionalidad":trabajador.origen_nacionalidad,
      "sexo":trabajador.sexo,
      "estado_civil":trabajador.estado_civil,
      "regimen_trabajador":trabajador.regimen_trabajador,
      "contacto_telefono_tipo":trabajador.contacto_telefono_tipo,
      "contacto_telefono_numero":trabajador.contacto_telefono_numero,
      "contacto_email":trabajador.contacto_email,
      "documentacion_curp":trabajador.documentacion_curp,
      "documentacion_rfc":trabajador.documentacion_rfc,
      "documentacion_pasaporte":trabajador.documentacion_pasaporte_list_new,
      "documentacion_visa":trabajador.documentacion_visa_list_new,
      "documentacion_numero_de_seguridad_social":trabajador.documentacion_numero_de_seguridad_social,
      "documentacion_licencia":trabajador.documentacion_licencia_list_new,
      //cbancaria
      "cbancaria_banco_token":trabajador.cbancaria_banco_token,
      "cbancaria_cuenta":trabajador.cbancaria_cuenta,
      "cbancaria_clabe_inter":trabajador.cbancaria_clabe_inter,
      "cbancaria_sucursal":trabajador.cbancaria_sucursal,
      "centro_de_trabajo":trabajador.centro_de_trabajo,
      //salario
      "departamento":trabajador.departamento,
      "puesto":trabajador.puesto,
      //salario
      "salario_tipo":trabajador.salario_tipo,
      //contratacion
      "contratacion_tipo":trabajador.contratacion_tipo,
      "contratacion_fecha":trabajador.contratacion_fecha,
      "alta_en_empresa":trabajador.fecha_alta_en_empresa,
      "nomina_periodicidad":trabajador.nomina_periodicidad,
      "nomina_moneda":trabajador.nomina_moneda,
      "tipo_jornada":trabajador.tipo_jornada,
      "turno":trabajador.turno,
      "nomina_salario_diario":trabajador.nomina_salario_diario,
      "nomina_salario_integrado":trabajador.nomina_salario_integrado,
    });
    console.log(cuenta);
    let parametros = 'json='+encodeURIComponent(cuenta);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'valor_humano_catalogos_registratrabajador',parametros, {headers: headers}).pipe(
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
