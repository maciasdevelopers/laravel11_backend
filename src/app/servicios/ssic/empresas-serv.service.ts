import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfActFijos } from '../../interfaces/interf-act-fijos';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { activoFijoAngularModelo } from '../../modelos/activoFijoAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class EmpresasServService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listaEmpresasCompleteRegistro():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'empresacompleteregistro',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  listaEmpresasAll():Observable<any>{
    return this._httpClient.get(this.url+'allcompanies')
    .pipe(catchError(this.handlerError))
  }

  empresaPerfilInfo(empresa_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"empresa_token":empresa_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_empresas_perfil',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  habilitaRegistroTrabajoCentros(empresa_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"empresa_token":empresa_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_empresas_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deshabilitaRegistroTrabajoCentros(empresa_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"empresa_token":empresa_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_empresas_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  empresaDetalleInfo(empresa_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"empresa_token":empresa_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_empresas_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  vincularEmpresaUsuario(empresa_token:any,usuario_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"empresa_token":empresa_token,"usuario_token":usuario_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'empresa_vincular_usuario',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaEmpresasVinc():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_empresas_vinculadas',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  selectEmpresaVinc(empresa_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"empresa_token":empresa_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'select_empresa_vinculada',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  empConfigEgresos(emp_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"emp_token":emp_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_settings_empresa_config_eegr',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  verificaExistsAllEmpresas(tipoEmp:any,subtipoEmp:any,rfc_generico:any,emp_rfc:any,id_tax:any,nombre:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"tipoEmp":tipoEmp,"subtipoEmp":subtipoEmp,
      "rfc_generico":rfc_generico,"emp_rfc":emp_rfc,"id_tax":id_tax,"nombre":nombre});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'verify_exist_empresa_one',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  empresa_registrar(
    rfc_generico:any,
    emp_rfc:any,
    id_tax:any,
    tipoEmp:any,
    subtipoEmp:any,
    razon_social:any,
    abrev:any,
    comercial_nombre:any,
    curp:any,
    paistoken:any,
    sitio_web:any,
    tknRegimenFiscal:any
  ):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "rfc_generico":rfc_generico,
      "emp_rfc":emp_rfc,
      "id_tax":id_tax,
      "tipoEmp":tipoEmp,
      "subtipoEmp":subtipoEmp,
      "razon_social":razon_social,
      "abrev":abrev,
      "comercial_nombre":comercial_nombre,
      "curp":curp,
      "paistoken":paistoken,
      "sitio_web":sitio_web,
      "tknRegimenFiscal":tknRegimenFiscal
      //"tkn_cod_postal":tkn_cod_postal
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'empresa_registrar',parametros, {headers: headers}).pipe(
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
