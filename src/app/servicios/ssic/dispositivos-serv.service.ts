import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { dispositivosAngularModelo } from '../../modelos/dispositivosAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class DispositivosServService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  folioDispositivo(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'foliodispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaTipoDispositivo(): Observable<any>{
    return this.httpcliente.get(this.url+'listipodispositivo').pipe(catchError(this.handlerError));
  }

  verListaDispositivos():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'verlistadisovig',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaDispositivo(
    token_dispositivo:any,
    tipo_dispositivo:any,
    alias_dispositivo:any,
    serie:any,
    vigencia:any,
    token_responsable:any,
    token_caja:any,
    token_cuentaBanc:any,
    token_monElect:any
  ):Observable<any>{
    let disp = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_dispositivo":token_dispositivo,
      "tipo_dispositivo":tipo_dispositivo,
      "alias_dispositivo":alias_dispositivo,
      "serie":serie,
      "vigencia":vigencia,
      "token_responsable":token_responsable,
      "token_caja":token_caja,
      "token_cuentaBanc":token_cuentaBanc,
      "token_monElect":token_monElect
    });
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'actualizadispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizacajaDispositivo(token_dispositivo:any,token_caja:any):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivo,"token_caja":token_caja});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'actualizacajadispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  unvinccajaDispositivo(token_dispositivo:any,token_caja:any):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivo,"token_caja":token_caja});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'unvinccajadispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizacuentaBankDispositivo(token_dispositivo:any,token_cuentaBanc:any):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivo,"token_cuentaBanc":token_cuentaBanc});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'actualizacuentabankdispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  unvincCuentaBankDispositivo(token_dispositivo:any,token_cuentaBanc:any):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivo,"token_cuentaBanc":token_cuentaBanc});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'unvinccuentabankdispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizacuentaMonDispositivo(token_dispositivo:any,token_monElect:any):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivo,"token_monElect":token_monElect});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'actualizacuentamoneddispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  unvinccuentaMonDispositivo(token_dispositivo:any,token_monElect:any):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivo,"token_monElect":token_monElect});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'unvinccuentamoneddispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  registraDispositivo(dispositivo:dispositivosAngularModelo):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"dispositivo":dispositivo});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'registradispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  detalleDispositivo(token_dispositivos:any):Observable<any>{
    let disp = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivos});
    console.log(disp);
    let parametros = 'json='+disp;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.httpcliente.post(this.url+'detalledispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  verListaDeleteDispositivo():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'verlistadispdel',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deleteDispositivo(token_dispositivo:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":token_dispositivo});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'deletedispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  restaurarDispositivo(token_dispositivos:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":''});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'restauradispositivo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deletePermDispositivo(token_dispositivos:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_dispositivo":''});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'deletepermdispositivo',parametros, {headers: headers}).pipe(
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
