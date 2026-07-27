import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfBancos } from '../interfaces/interf-bancos';
import { global } from './global_ssic';
import { Usuarios } from '../modelos/Usuarios';
import { establecimientoModelo } from '../modelos/establecimientoModelo';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosService {
  public url:string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-type': 'Aplication/json'
    })
  }

  constructor(public httpcliente:HttpClient) {
    this.url = global.urlApi;
  }

  listaEstablecimientos(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpcliente.post(this.url+'inventarios_catalogos_establecimientos',data)
    .pipe(catchError(this.handlerError));
  }

  listaEstablecimientosNoTrabCentros():Observable<any>{
    return this.httpcliente.post(this.url+'inventarios_catalogos_establecimientos_no_centro_trabajo',null)
    .pipe(catchError(this.handlerError));
  }

  listaEstablecimientoscomplete(): Observable<any>{
    return this.httpcliente.post(this.url+'inventarios_catalogos_listdireccionalmcomplete',null)
    .pipe(catchError(this.handlerError));
  }

  detalleEstablecimientos(tokenEstablecimiento:any): Observable<any>{
    let data = {"tokenEstablecimiento":tokenEstablecimiento};
    return this.httpcliente.post(this.url+'inventarios_catalogos_detalleestablecimiento',data)
    .pipe(catchError(this.handlerError));
  }

  updateEstablecimiento(token_establecimiento:string,estabModel:establecimientoModelo): Observable<any>{
    let data = {
      "establecimiento_token":token_establecimiento,
      "establecimiento_alias":estabModel.alias,
      "establecimiento_tipo":estabModel.tipo,
      "establecimiento_descripcion":estabModel.descripcion,
      "establecimiento_aplica_ingresos":estabModel.aplica_ingresos,
      "establecimiento_aplica_egresos":estabModel.aplica_egresos,
      "establecimiento_aplica_procesos_internos":estabModel.aplica_procesos_internos,
      "establecimiento_aplica_almacen":estabModel.aplica_almacen,
      "establecimiento_ubicacion_pais":estabModel.ubicacion_pais,
      "establecimiento_dipomex_cod_postal_estado":estabModel.dipomex_cod_postal_estado,
      "establecimiento_dipomex_cod_postal_municipio":estabModel.dipomex_cod_postal_municipio,
      "establecimiento_dipomex_cod_postal_cp":estabModel.dipomex_cod_postal_cp,
      "establecimiento_dipomex_cod_postal_colonia_vinculada":estabModel.dipomex_cod_postal_colonia_vinculada,
      "establecimiento_ext_direccion_completa":estabModel.ext_direccion_completa,
      "establecimiento_phoneAll":estabModel.phoneAll,
      "establecimiento_cuenta_contable":estabModel.cuenta_contable,
    };
    return this.httpcliente.post(this.url+'inventarios_catalogos_actualizaestablecimiento',data)
    .pipe(catchError(this.handlerError));
  }

  deleteEstablecimiento(tokenEstablecimiento:any): Observable<any>{
    let data = {"tokenEstablecimiento":tokenEstablecimiento};
    return this.httpcliente.post(this.url+'inventarios_catalogos_deleteestablecimiento',data)
    .pipe(catchError(this.handlerError));
  }

  listaEstablecimientosDeleted(): Observable<any>{
    return this.httpcliente.post(this.url+'inventarios_catalogos_deletedestablecimientos',null)
    .pipe(catchError(this.handlerError));
  }

  restoreEstablecimiento(tokenEstablecimiento:any): Observable<any>{
    let data = {"tokenEstablecimiento":tokenEstablecimiento};
    return this.httpcliente.post(this.url+'inventarios_catalogos_restoreestablecimiento',data)
    .pipe(catchError(this.handlerError));
  }

  permdeleteEstablecimiento(tokenEstablecimiento:any): Observable<any>{
    let data = {"tokenEstablecimiento":tokenEstablecimiento};
    return this.httpcliente.post(this.url+'inventarios_catalogos_permdeleteestablecimiento',data)
    .pipe(catchError(this.handlerError));
  }

  newEstablecimiento(estabModel:establecimientoModelo): Observable<any>{
    let data = {
      "establecimiento_alias":estabModel.alias,
      "establecimiento_tipo":estabModel.tipo,
      "establecimiento_descripcion":estabModel.descripcion,
      //"establecimiento_encargado":estabModel.encargado,
      "establecimiento_aplica_ingresos":estabModel.aplica_ingresos,
      "establecimiento_aplica_egresos":estabModel.aplica_egresos,
      "establecimiento_aplica_procesos_internos":estabModel.aplica_procesos_internos,
      "establecimiento_aplica_almacen":estabModel.aplica_almacen,
      "establecimiento_ubicacion_pais":estabModel.ubicacion_pais,
      "establecimiento_dipomex_cod_postal_estado":estabModel.dipomex_cod_postal_estado,
      "establecimiento_dipomex_cod_postal_municipio":estabModel.dipomex_cod_postal_municipio,
      "establecimiento_dipomex_cod_postal_cp":estabModel.dipomex_cod_postal_cp,
      "establecimiento_dipomex_cod_postal_colonia_vinculada":estabModel.dipomex_cod_postal_colonia_vinculada,
      "establecimiento_ext_direccion_completa":estabModel.ext_direccion_completa,
      "establecimiento_phoneAll":estabModel.phoneAll,
      "establecimiento_cuenta_contable":estabModel.cuenta_contable,
    };
    return this.httpcliente.post(this.url+'inventarios_catalogos_registraestablecimiento',data)
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
