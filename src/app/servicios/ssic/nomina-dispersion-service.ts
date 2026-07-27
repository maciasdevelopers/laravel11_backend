import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class NominaDispersionService {
  public url: string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {
    this.url = global.urlApi;
  }

//general
  lista_general_ordenes_dispersion(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_lista_general',data).pipe(
      catchError(this.handlerError)
    );
  }

  ordenDispersionEfectivoSolicitarCancelacion(orden_dispersion:any,contabilizacion:any,observaciones:any):Observable<any>{
    let data = {"orden_dispersion":orden_dispersion,"solicitud_fecha_contabilizacion":contabilizacion,"solicitud_observaciones":observaciones};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_efectivo_solicitar_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  solicitud_cancelacion_orden_dispersion_nomina_efectivo(token_cancel_soliordp:any,token_orden_pago:any):Observable<any>{
    let data = {"token_cancel_soliordp":token_cancel_soliordp,"token_orden_pago":token_orden_pago};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_efectivo_solicitud_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  confirmar_cancelacion_orden_dispersion_nomina_efectivo(token_cancel_soliordp:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_soliordp":token_cancel_soliordp,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_soliordp":token_cancel_soliordp,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_efectivo_confirmar_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  ordenDispersionEspecieSolicitarCancelacion(orden_dispersion:any,contabilizacion:any,observaciones:any):Observable<any>{
    let data = {"orden_dispersion":orden_dispersion,"solicitud_fecha_contabilizacion":contabilizacion,"solicitud_observaciones":observaciones};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_especie_solicitar_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  solicitud_cancelacion_orden_dispersion_nomina_especie(token_cancel_soliordp:any,token_orden_pago:any):Observable<any>{
    let data = {"token_cancel_soliordp":token_cancel_soliordp,"token_orden_pago":token_orden_pago};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_especie_solicitud_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  confirmar_cancelacion_orden_dispersion_nomina_especie(token_cancel_soliordp:any,fecha_contabilizacion:any,comentarios_confirma_cancelacion:any):Observable<any>{
    let json = JSON.stringify({"token_cancel_soliordp":token_cancel_soliordp,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"token_cancel_soliordp":token_cancel_soliordp,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_especie_confirmar_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

//pendientes
  lista_pendientes_ordenes_dispersion(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_lista_pendientes',data).pipe(
      catchError(this.handlerError)
    );
  }

//liberadas
  lista_liberadas_ordenes_dispersion(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_lista_liberadas',data).pipe(
      catchError(this.handlerError)
    );
  }

//concluidas
  lista_concluidas_ordenes_dispersion(filtro:any,periodo_inicio:string = '',periodo_fin:string = '') :Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_lista_concluidas',data).pipe(
      catchError(this.handlerError)
    );
  }

//pagos realizados
  lista_general_ordenes_pagos(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''):Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_lista_pagos_done',data).pipe(
      catchError(this.handlerError)
    );
  }

  pagoRealizadoSolicitarCancelacion(pago_realizado:any,contabilizacion:any,observaciones:any):Observable<any>{
    let data = {"pago_realizado":pago_realizado,"solicitud_fecha_contabilizacion":contabilizacion,"solicitud_observaciones":observaciones};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_pago_solicitar_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  solicitud_cancelacion_pago_nomina(token_cancel_solip:string,token_pagos:string):Observable<any>{
    let data = {"token_cancel_solip":token_cancel_solip,"token_pagos":token_pagos};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_pago_solicitud_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  confirmar_cancelacion_pago_nomina(cancel_soli_token:string,fecha_contabilizacion:string,comentarios_confirma_cancelacion:string):Observable<any>{
    let json = JSON.stringify({"cancel_soli_token":cancel_soli_token,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion});
    console.log(json);
    let data = {"cancel_soli_token":cancel_soli_token,"fecha_contabilizacion":fecha_contabilizacion,"comentarios_confirma_cancelacion":comentarios_confirma_cancelacion};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_nomina_pago_confirmar_cancelacion',data)
    .pipe(catchError(this.handlerError));
  }

  catalogoNominaTrabajadores(filtro:any,periodo_inicio:string = '',periodo_fin:string = ''): Observable<any>{
    let data = {"periodo":filtro,"periodo_inicio":periodo_inicio,"periodo_fin":periodo_fin};
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_catalogo_trabajadores',data).pipe(
      catchError(this.handlerError)
    );
  }

  dispersion_pagos_trabajador(token_empleado_vhum:any): Observable<any>{
    let data = {"token_empleado_vhum":token_empleado_vhum};
    console.log(data);
    return this.httpClient.post(this.url+'finanzas_orden_dispersion_lista_pagos_trabajador',data)
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
