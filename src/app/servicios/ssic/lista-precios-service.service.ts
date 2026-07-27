import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class ListaPreciosServiceService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  getListaPrecios():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_getlistaprecios',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  //mercancias
    registraListaPrecios(token_cat_productos:any,token_lista_precios:any,precio_detalle:any,arrayImpuestos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_productos":token_cat_productos,
        "token_lista_precios":token_lista_precios,"precio_detalle":precio_detalle,"arrayImpuestos":arrayImpuestos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_registralistapreciosmercancias',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    updateListaPrecios():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_updatelistapreciosmercancias',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

  //servicios
    simulaprecioservicio(token_cat_servicios:any,precio_base:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_servicios":token_cat_servicios,"precio_base":precio_base});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_simulaprecioservicio',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    registraListaPreciosServ(token_cat_servicios:any,token_lista_precios:any,precio_detalle:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_cat_servicios":token_cat_servicios,
        "token_lista_precios":token_lista_precios,"precio_detalle":precio_detalle});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_registralistapreciosserv',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    updateListaPreciosServ():Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_getlistaprecios',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
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
