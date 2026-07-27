import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../../global_ssic';
import { Usuarios } from '../../../modelos/Usuarios';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class MainTerAssociatesService {
  public url: string;
  public identif: any;
  public token: any;
  public parsed: any;
  public user:any;

  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) {
    this.url = global.urlApi;
    this.user = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('inside_session_code') : '';
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

  cliente_solicitar_registro(
    rfc_generico:any,
    client_rfc:any,
    id_tax:any,
    radioClient:any,
    subtipoClient:any,
    paterno:any,
    materno:any,
    nombres:any,
    razon_social:any,
    comercial_nombre:any,
    curp:any,
    paistoken:any,
    sitio_web:any,
    tknRegimenFiscal:any,
    cod_postal:any,
    dipomex_cod_postal_estado:any,
    dipomex_cod_postal_municipio:any,
    dipomex_cod_postal_cp:any,
    dipomex_cod_postal_colonia_vinculada:any,
    listnewdireccionNac:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"rfc_generico":rfc_generico,
      "client_rfc":client_rfc,"id_tax":id_tax,"radioClient":radioClient,"subtipoClient":subtipoClient,
      "paterno":paterno,"materno":materno,"nombres":nombres,"razon_social":razon_social,
      "comercial_nombre":comercial_nombre,"curp":curp,"paistoken":paistoken,"sitio_web":sitio_web,
      "tknRegimenFiscal":tknRegimenFiscal,"cod_postal":cod_postal,
      "dipomex_cod_postal_estado":dipomex_cod_postal_estado,"dipomex_cod_postal_municipio":dipomex_cod_postal_municipio,
      "dipomex_cod_postal_cp":dipomex_cod_postal_cp,"dipomex_cod_postal_colonia_vinculada":dipomex_cod_postal_colonia_vinculada,
      "listnewdireccionNac":listnewdireccionNac
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'cliente_solicitud_registro',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaclientes():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_listaclientes',params,{headers: headers})
    .pipe(catchError(this.handlerError))
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
