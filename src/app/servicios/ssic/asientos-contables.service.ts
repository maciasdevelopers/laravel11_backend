import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';

@Injectable({
  providedIn: 'root'
})
export class AsientosContablesService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  // Lista de asientos contables (pólizas)
  listaAsientosContables(fecha_inicio:any, fecha_fin:any, tipo_poliza:any):Observable<any>{
    let data = {
      "fecha_inicio":fecha_inicio,
      "fecha_fin":fecha_fin,
      "tipo_poliza":tipo_poliza
    };
    return this._httpClient.post(this.url+'contabilidad_asientos_contables_lista',data)
    .pipe(catchError(this.handlerError));
  }

  // Consulta detalle de asiento contable
  detalleAsientoContable(token_asiento:any):Observable<any>{
    let data = {"token_asiento":token_asiento};
    return this._httpClient.post(this.url+'contabilidad_asientos_contables_detalle',data)
    .pipe(catchError(this.handlerError));
  }

  // Registro de asiento contable (póliza)
  registrarAsientoContable(
    fecha:any,
    tipo_poliza:any,
    concepto:any,
    movimientos:any,
    observaciones:any
  ):Observable<any>{
    let data = {
      "fecha":fecha,
      "tipo_poliza":tipo_poliza,
      "concepto":concepto,
      "movimientos":movimientos,
      "observaciones":observaciones
    };
    return this._httpClient.post(this.url+'contabilidad_asientos_contables_registra',data)
    .pipe(catchError(this.handlerError));
  }

  // Actualizar asiento contable
  actualizarAsientoContable(
    token_asiento:any,
    fecha:any,
    tipo_poliza:any,
    concepto:any,
    movimientos:any,
    observaciones:any
  ):Observable<any>{
    let data = {
      "token_asiento":token_asiento,
      "fecha":fecha,
      "tipo_poliza":tipo_poliza,
      "concepto":concepto,
      "movimientos":movimientos,
      "observaciones":observaciones
    };
    return this._httpClient.post(this.url+'contabilidad_asientos_contables_actualiza',data)
    .pipe(catchError(this.handlerError));
  }

  // Eliminar asiento contable
  eliminarAsientoContable(token_asiento:any):Observable<any>{
    let data = {"token_asiento":token_asiento};
    return this._httpClient.post(this.url+'contabilidad_asientos_contables_elimina',data)
    .pipe(catchError(this.handlerError));
  }

  // Autorizar asiento contable
  autorizarAsientoContable(token_asiento:any):Observable<any>{
    let data = {"token_asiento":token_asiento};
    return this._httpClient.post(this.url+'contabilidad_asientos_contables_autoriza',data)
    .pipe(catchError(this.handlerError));
  }

  // Lista de tipos de póliza
  catalogoTiposPoliza():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogos_tipos_poliza',null)
    .pipe(catchError(this.handlerError));
  }

  // Catálogo de cuentas contables para movimientos
  catalogoCuentasParaMovimientos():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogos_cuentas_movimientos',null)
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