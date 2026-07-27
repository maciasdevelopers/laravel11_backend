import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfBancos } from '../../interfaces/interf-bancos';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { establecimientoModelo } from '../../modelos/establecimientoModelo';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  getAllEntidadesFederativas():Observable<any>{
    return this.httpcliente.get(this.url+'listar_entidades_federativas')
    .pipe(catchError(this.handlerError))
  }

  getCodPostales():Observable<any>{
    return this.httpcliente.get(this.url+'getcpostales')
    .pipe(catchError(this.handlerError))
  }

  postCodPostalDipomex(cod_postal:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"clave_cod_postal":cod_postal});
    console.log(json);
    let parametros = 'json='+json;
    let data = {"clave_cod_postal":cod_postal};
    return this.httpcliente.post(this.url+'dipomexcpostales',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  location_iq_dir(direccion:any): Observable<any>{
    //https://my.locationiq.com/dashboard#playground
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"direccion":direccion});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'location_iq_dir',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  postCodPostales(cod_postal:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"clave":cod_postal});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'postcpostales',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  buscaColonias(cod_postal:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"cod_postal":cod_postal});
    //console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'getlistacolonias',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  getEntidadFed(cod_postal:any,colonia:any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"cod_postal":cod_postal,"token_colonia":colonia});
    console.log(json);
    let parametros = 'json='+json;
    return this.httpcliente.post(this.url+'getselectentfed',parametros, {headers: headers}).pipe(
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
