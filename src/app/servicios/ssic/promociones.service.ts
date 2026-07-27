import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IntefPromociones } from '../../interfaces/intef-promociones';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  getMaxfolioPromo():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_foliomaxpromocion',parametros,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getfolioPromoNewReg():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_folionewpromocion',parametros,{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getListaPromociones():Observable<IntefPromociones[]>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let params = 'json='+json;
    return this._httpClient.post<IntefPromociones[]>(this.url+'ingresos_catalogos_listapromociones',params,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  getViewPromociones(token_promocion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post<IntefPromociones[]>(this.url+'ingresos_catalogos_promocionesselected',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  getListapromocionesdesac():Observable<IntefPromociones[]>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post<IntefPromociones[]>(this.url+'ingresos_catalogos_promocionesdesac',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  getListapromocionesdelete():Observable<IntefPromociones[]>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    let parametros = 'json='+json;
    return this._httpClient.post<IntefPromociones[]>(this.url+'ingresos_catalogos_promocionesdelete',parametros,{headers:headers})
    .pipe(catchError(this.handlerError))
  }

  registraPromocion(alias:any,concepto:any,aplicacion:any,monto:any,tipo:any,fecha_inicia:any,fecha_termina:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"alias":alias,"concepto":concepto,
      "aplicacion":aplicacion,"monto":monto,"tipo":tipo,"fecha_inicia":fecha_inicia,
      "fecha_termina":fecha_termina});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_registranuevopromocion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  updatePromocion(
    alias:any,
    concepto:any,
    aplicacion:any,
    monto:any,
    tipo:any,
    fecha_inicia:any,
    fecha_termina:any,
    token_promocions:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"alias":alias,"concepto":concepto,
      "aplicacion":aplicacion,"monto":monto,"tipo":tipo,"fecha_inicia":fecha_inicia,
      "fecha_termina":fecha_termina,"token_promocions":token_promocions});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_updategeneralespromocion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  activarPromocion(token_promocion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_habilitapromocion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  desactivarPromocion(token_promocion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_desactivapromocion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  eliminarPromocion(token_promocion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_eliminapromocion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  restaurarPromocion(token_promocion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_restaurapromocion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  eliminarPermPromocion(token_promocion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ingresos_catalogos_deadeliminapromocion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  //productos
    registrarProductoPromo(arrayAltaPromociones:any,token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"arrayAltaPromociones":arrayAltaPromociones,"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_registrapromocionmercancia',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    vincularProductoPromo(token_promocion:any,token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion,"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_vincpromocionmercancia',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    desvincularProductoPromo(token_promocion:any,tokenPromoDetalle:any,token_cat_productos:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion,"tokenPromoDetalle":tokenPromoDetalle,"token_cat_productos":token_cat_productos});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_desvincpromocionmercancia',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

  //servicios
    registrarServicioPromo(arrayAltaPromociones:any,token_cat_servicios:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"arrayAltaPromociones":arrayAltaPromociones,"token_cat_servicios":token_cat_servicios});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_registrapromocionservicio',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    vincularServicioPromo(token_promocion:any,token_cat_servicios:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion,"token_cat_servicios":token_cat_servicios});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_vincpromocionservicio',parametros, {headers: headers})
      .pipe(catchError(this.handlerError));
    }

    desvincularServicioPromo(token_promocion:any,tokenPromoDetalle:any,token_cat_servicios:any):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
      let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_promocion":token_promocion,"tokenPromoDetalle":tokenPromoDetalle,"token_cat_servicios":token_cat_servicios});
      console.log(json);
      let parametros = 'json='+json;
      return this._httpClient.post(this.url+'ingresos_catalogos_desvincpromocionservicio',parametros, {headers: headers})
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
