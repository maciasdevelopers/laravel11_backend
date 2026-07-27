import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { global } from './global_ssic';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  public url:string;
  constructor(private httpCliente:HttpClient) {
    this.url = global.urlApi;
  }

  retencionesPDF(
    retencion_decimales:any,
    perfil_name:any,
    perfil_clave:any,
    iva_establecido_percent:any,
    retencion_iva_liva_percent:any,
    retencion_isr_porcentaje:any,
    retencion_importe:any,
    iva_establecido_view:any,
    retencion_iva_liva_view:any,
    retencion_subtotal_view:any,
    retencion_isr_view:any,
    retencion_total_view:any){
    const params = new HttpParams()
      .set('retencion_decimales',retencion_decimales)
      .set('perfil_name',perfil_name)
      .set('perfil_clave',perfil_clave)
      .set('iva_establecido_percent',iva_establecido_percent)
      .set('retencion_iva_liva_percent',retencion_iva_liva_percent)
      .set('retencion_isr_porcentaje',retencion_isr_porcentaje)
      .set('retencion_importe',retencion_importe)
      .set('iva_establecido_view',iva_establecido_view)
      .set('retencion_iva_liva_view',retencion_iva_liva_view)
      .set('retencion_subtotal_view',retencion_subtotal_view)
      .set('retencion_isr_view',retencion_isr_view)
      .set('retencion_total_view',retencion_total_view);

    /*const options = {
      params : params,
      responseType: 'blob' as 'json',
    };*/
    return this.httpCliente.get('https://downloads.sos-mexico.com.mx/calculo_retenciones_download',{
      params: params,
      responseType: 'blob'
    });
  }

  handlerError(error:{error:{message:string;}; status:any;message:any;}){
    let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
    if (error.error instanceof ErrorEvent) { 
      errorMessage = `Error:${error.error.message}`;
    } else {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}