import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfRequisiciones } from '../../interfaces/requisiciones';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class RequisicionesService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  listaCaracteristicas():Observable<any>{
    return this._httpClient.get(this.url+'egresos_compras_listacaracteristicas')
    .pipe(catchError(this.handlerError));
  }

  reqFolioMax(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_folioReqMax',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  reqPendientes():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_totalRequisicionesPend',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  catalogoReqTrue():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_catalogo_requisiciones',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  detalleRequisicion(token_requisicion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_detalle_requisicion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  detalleRequisicionWithCotizaciones(token_requisicion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_detalle_requisicion_cot_list',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  eliminaRequisicionDetalle(token_requisicion:any,token_detalle_requisicion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_eliminar_requisicion_detalle',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  autorizaRequisicion(token_requisicion:any,token_detalle_requisicion:any,cantidad_autorizada:any,comentarios:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,
      "token_detalle_requisicion":token_detalle_requisicion,"cantidad_autorizada":cantidad_autorizada,"comentarios":comentarios});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_autoriza_requisicion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  autorizaRequisicionAll(token_requisicion:any,coments_rechazo:any,desglose:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"coments_rechazo":coments_rechazo,"desglose":desglose});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_autoriza_requisicion_all',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  desautorizaRequisicion(token_requisicion:any,token_detalle_requisicion:any,comentarios:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"comentarios":comentarios});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_desautoriza_requisicion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameProyectoRequisicion(token_requisicion:any,requi_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"requi_proyecto":requi_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNamePrioridadRequisicion(token_requisicion:any,requi_prioridad:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"requi_prioridad":requi_prioridad});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_prioridad',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameListTipoRequisicion(token_requisicion:any,token_detalle_requisicion:any,requi_tipo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"requi_tipo":requi_tipo});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_list_tipo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameListConceptoRequisicion(token_requisicion:any,token_detalle_requisicion:any,requi_concepto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"requi_concepto":requi_concepto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_list_concepto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameAddListCaractRequisicion(token_requisicion:any,token_detalle_requisicion:any,clave:any,valor:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"clave":clave,"valor":valor});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_add_caract_list',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameDeleteListCaractRequisicion(token_requisicion:any,token_detalle_requisicion:any,token_caract:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"token_caract":token_caract});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'update_requisicion_delete_caract_list',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameListCantidadRequisicion(token_requisicion:any,token_detalle_requisicion:any,requi_cantidad:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"requi_cantidad":requi_cantidad});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_list_cantidad',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameListUnidadMedRequisicion(token_requisicion:any,token_detalle_requisicion:any,requi_unidad_medida:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"requi_unidad_medida":requi_unidad_medida});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_list_unidad_medida',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  updateNameListMarcaRequisicion(token_requisicion:any,token_detalle_requisicion:any,requi_marca:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion,"requi_marca":requi_marca});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_update_requisicion_list_marca',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  autorizarRequisicion(token_requisicion:any,token_detalle_requisicion:any):Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_requisicion":token_requisicion,"token_detalle_requisicion":token_detalle_requisicion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'autorizar_requisicion',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraRequisicionByList(proyecto:any,prioridad:any,lista_articulos:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proyecto":proyecto,"prioridad":prioridad,"lista_articulos":lista_articulos});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_registraRequisicionLista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  registraRequisicionByListModulo(proyecto:any,prioridad:any,justificacion:any,lista_articulos:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"proyecto":proyecto,"prioridad":prioridad,"justificacion":justificacion,"lista_articulos":lista_articulos});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_registraRequisicionLista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  requisicion_load_docs(partidaAnexos:any,partidaNames:any,requisicion:any,partida:any) :Observable<any>{
    console.log(partidaAnexos);
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"partidaNames":partidaNames,"requisicion":requisicion,"partida":partida});
    console.log(json);

    const formData = new FormData();
    for (var i = 0; i < partidaAnexos.length; i++) {
      formData.append("partidaAnexos[]", partidaAnexos[i]);
    }
    formData.append('solicitud',json);
    console.log(formData);
    return this._httpClient.post(this.url+'egresos_compras_requisicion_load_docs',formData).pipe(
      catchError(this.handlerError)
    );
  }

  registraRequisicionByDocs():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'egresos_compras_catalogo_requisiciones',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    ); // enviar las peticiones ajax
  }

  reqEliminados():Observable<InterfRequisiciones[]>{
    return this._httpClient.get<InterfRequisiciones[]>(this.url+'getCatalogoProvDel')
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
