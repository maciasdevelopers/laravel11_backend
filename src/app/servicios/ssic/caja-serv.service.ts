import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { cajaAngularModelo } from '../../modelos/cajaAngularModelo';
import { perfilCajaAngularModelo } from '../../modelos/perfilCajaAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class CajaServService {
  public url: string;
  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  verListaCajas(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this._httpClient.post(this.url+'finanzas_catalogos_catalogo_cajas_true',data)
    .pipe(catchError(this.handlerError));
  }

  folioCaja(): Observable<any>{
    return this._httpClient.post(this.url+'finanzas_catalogos_foliocaja',null).pipe(catchError(this.handlerError));
  }

  detalleCaja(tokenCaja:any): Observable<any>{
    let data = {"token_caja":tokenCaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_detallecaja',data)
    .pipe(catchError(this.handlerError));
  }

  verListaDeleteCaja(): Observable<any>{
    return this._httpClient.post(this.url+'finanzas_catalogos_catalogo_cajas_deleted',null)
    .pipe(catchError(this.handlerError));
  }

  deleteCaja(tokenCaja:any): Observable<any>{
    let data = {"token_caja":tokenCaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_eliminacaja',data)
    .pipe(catchError(this.handlerError));
  }

  restaurarCaja(tokenCaja:any): Observable<any>{
    let data = {"token_caja":tokenCaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_restauracaja',data)
    .pipe(catchError(this.handlerError));
  }

  deletePermCaja(tokenCaja:any): Observable<any>{
    let data = {"token_caja":tokenCaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_eliminapermcj',data)
    .pipe(catchError(this.handlerError));
  }

  desvinculaResponsable(almacen:any,toknRespons:any,tokenCaja:any): Observable<any>{
    let data = {"token_diralmacen":almacen,"token_responsable":toknRespons,"token_caja":tokenCaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_chngperscja',data).pipe(
      catchError(this.handlerError)
    );
  }

  vinculaResponsable(almacen:any,toknRespons:any,tokenCaja:any): Observable<any>{
    let data = {"token_diralmacen":almacen,"token_responsable":toknRespons,"token_caja":tokenCaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_vnculspnbcaja',data).pipe(
      catchError(this.handlerError)
    );
  }

  updatePersonalCj(tokenCaja:any,almacenOld:any,almacenNew:any,toknRespons:any): Observable<any>{
    let data = {
      "token_caja":tokenCaja,
      "token_almacenOld":almacenOld,
      "token_almacenNew":almacenNew,
      "token_responsables":toknRespons
    };
    return this._httpClient.post(this.url+'finanzas_catalogos_updtpersnew',data).pipe(
      catchError(this.handlerError)
    );
  }

  updateDirResponsCaja(regCaja:cajaAngularModelo,tokenCaja:any):Observable<any>{
    let data = {
      "token_diralmacen":regCaja.establecimiento_token,
      "token_responsable":regCaja.vendedor,
      "token_caja":tokenCaja
    };
    return this._httpClient.put(this.url+'finanzas_catalogos_updatealmacencaja',data)
    .pipe(catchError(this.handlerError))
  }

  getresponsableCajaCompras():Observable<any>{
    return this._httpClient.post(this.url+'finanzas_catalogos_responsablecaja',null)
    .pipe(catchError(this.handlerError))
  }

  getresponsableCajaVentas():Observable<any>{
    return this._httpClient.post(this.url+'finanzas_catalogos_responsablecaja',null)
    .pipe(catchError(this.handlerError))
  }

  updateCaja(regCaja:cajaAngularModelo,tokCaja:any):Observable<any>{
    let data = {
      "token_caja":tokCaja,
      "moneda":regCaja.moneda,
      "establecimiento_token":regCaja.establecimiento_token,
      "descripcion":regCaja.descripcion,
      "cuenta_contable":regCaja.cuenta_contable,
      "servegresos":regCaja.servegresos,
      "servingresos":regCaja.servingresos,
      "servpropias":regCaja.servpropias,
      "capt_cliente":regCaja.capt_cliente,
      "capt_precio_x_articulo":regCaja.capt_precio_x_articulo,
      "capt_primero_cantidad":regCaja.capt_primero_cantidad,
      "vendedor":regCaja.vendedor
    };
    return this._httpClient.post(this.url+'finanzas_catalogos_updatecaja',data)
    .pipe(catchError(this.handlerError));
  }

  editaCorteCaja(tokCaja:any,tokenCortecaja:any,horarioCorteCaja:any):Observable<any>{
    let data = {
      "token_caja":tokCaja,
      "token_cortecaja":tokenCortecaja,
      "horario_cortecaja":horarioCorteCaja
    };
    return this._httpClient.post(this.url+'finanzas_catalogos_editacortecja',data)
    .pipe(catchError(this.handlerError));
  }

  eliminaCorteCaja(tokCaja:any,tokenCortecaja:any):Observable<any>{
    let data = {"token_caja":tokCaja,"token_cortecaja":tokenCortecaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_eliminacortecja',data)
    .pipe(catchError(this.handlerError));
  }

  guardarNewCorteCaja(tokCaja:any,horarioCortCaja:any):Observable<any>{
    let data = {"token_caja":tokCaja,"horario_cortecaja":horarioCortCaja};
    return this._httpClient.post(this.url+'finanzas_catalogos_newcortecja',data)
    .pipe(catchError(this.handlerError));
  }

  registraCaja(regCaja:cajaAngularModelo):Observable<any>{
    let data = {
      "moneda":regCaja.moneda,
      "establecimiento_token":regCaja.establecimiento_token,
      "descripcion":regCaja.descripcion,
      "cuenta_contable":regCaja.cuenta_contable,
      "servegresos":regCaja.servegresos,
      "servingresos":regCaja.servingresos,
      "servpropias":regCaja.servpropias,
      "capt_cliente":regCaja.capt_cliente,
      "capt_precio_x_articulo":regCaja.capt_precio_x_articulo,
      "capt_primero_cantidad":regCaja.capt_primero_cantidad,
      "vendedor":regCaja.vendedor
    };
    
    return this._httpClient.post(this.url+'finanzas_catalogos_registracaja',data)
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
