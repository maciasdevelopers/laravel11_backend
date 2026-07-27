import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfDescuentos } from '../../interfaces/descuentos';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class DescuentosService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  getMaxfolioDesc():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_foliomaxdescuentos',parametros,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getfolioDescNewReg():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_folionewdescuentos',parametros,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getListaDescuentos():Observable<InterfDescuentos[]>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post<InterfDescuentos[]>(this.url+'ingresos_catalogos_listadescuentos',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  getViewDescuento(token_descuento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post<InterfDescuentos[]>(this.url+'ingresos_catalogos_descuentosselected',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  getListadescuentosdesac():Observable<InterfDescuentos[]>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post<InterfDescuentos[]>(this.url+'ingresos_catalogos_descuentosdesac',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  getListadescuentosdelete():Observable<InterfDescuentos[]>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post<InterfDescuentos[]>(this.url+'ingresos_catalogos_descuentosdelete',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  registraDescuento(
    alias:any,
    concepto:any,
    aplicacion:any,
    monto:any,
    tipo:any,
    fecha_inicia:any,
    fecha_termina:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"alias":alias,"concepto":concepto,
      "aplicacion":aplicacion,"monto":monto,"tipo":tipo,"fecha_inicia":fecha_inicia,
      "fecha_termina":fecha_termina});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_registranuevodescuento',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  updateDescuento(
    alias:any,
    concepto:any,
    aplicacion:any,
    monto:any,
    tipo:any,
    fecha_inicia:any,
    fecha_termina:any,
    token_descuentos:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"alias":alias,"concepto":concepto,
      "aplicacion":aplicacion,"monto":monto,"tipo":tipo,"fecha_inicia":fecha_inicia,
      "fecha_termina":fecha_termina,"token_descuentos":token_descuentos});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_updategeneralesdescuento',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  activarDescuento(token_descuento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_habilitadescuento',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  desactivarDescuento(token_descuento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_desactivadescuento',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  eliminarDescuento(token_descuento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_eliminadescuento',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  restaurarDescuento(token_descuento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_restauradescuento',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  eliminarPermDescuento(token_descuento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_deadeliminadescuento',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  //productos
    registrarProductoDesc(arrayAltaDescuentos:any,token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"arrayAltaDescuentos":arrayAltaDescuentos,"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_registradescuentomercancia',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    vincularProductoDesc(token_descuento:any,token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento,"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_vincdescuentomercancia',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    desvincularProductoDesc(token_descuento:any,tokenDescDetalle:any,token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento,"tokenDescDetalle":tokenDescDetalle,"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_desvincdescuentomercancia',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

  //servicios
    registrarServicioDesc(arrayAltaDescuentos:any,token_cat_servicios:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"arrayAltaDescuentos":arrayAltaDescuentos,"token_cat_servicios":token_cat_servicios});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_registradescuentoservicio',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    vincularServicioDesc(token_descuento:any,token_cat_servicios:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento,"token_cat_servicios":token_cat_servicios});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_vincdescuentoservicio',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    desvincularServicioDesc(token_descuento:any,tokenDescDetalle:any,token_cat_servicios:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_descuento":token_descuento,"tokenDescDetalle":tokenDescDetalle,"token_cat_servicios":token_cat_servicios});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_desvincdescuentoservicio',parametros, {headers: headers})
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
