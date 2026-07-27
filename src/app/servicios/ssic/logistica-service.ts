import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfClasificacion } from '../../interfaces/interf-clasificacion';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import { logisticaCompraModelo } from '../../modelos/logistica/logisticaCompraModelo';

@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  logisticaTrasitosIniciadosLista(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    let data = {"periodo": filtro,"periodo_inicio": periodo_inicio,"periodo_fin": periodo_fin};
    return this._httpClient.post(this.url + 'egresos_logistica_transitos_iniciados', data)
    .pipe(catchError(this.handlerError));
  }

  actualizarLogisticaTransito(logistica_seguimiento_token:string): Observable<any> {
    let data = {"logistica_seguimiento_token":logistica_seguimiento_token};
    console.log(data)
    return this._httpClient.post(this.url + 'egresos_logistica_transito_actualizar', data)
    .pipe(catchError(this.handlerError));
  }

  logisticaComprasLista(filtro: any, periodo_inicio: string = '', periodo_fin: string = ''): Observable<any> {
    let data = {"periodo": filtro,"periodo_inicio": periodo_inicio,"periodo_fin": periodo_fin};
    return this._httpClient.post(this.url + 'egresos_logistica_compras_lista', data)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraDesglosePartidas(compras_vinculadas:any): Observable<any> {
    let data = {"compras_vinculadas":compras_vinculadas};
    return this._httpClient.post(this.url + 'egresos_logistica_compras_desglose_partidas', data)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraCartasPorte(): Observable<any> {
    return this._httpClient.post(this.url + 'egresos_logistica_compras_lista_carta_porte',null)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraObtenerCartaPorte(cfdi_comprobante_tipo:string,cfdi_complemento_uuid:string,cfdi_carta_porte_id:string): Observable<any> {
    let data = {"cfdi_comprobante_tipo":cfdi_comprobante_tipo,"cfdi_complemento_uuid":cfdi_complemento_uuid,"cfdi_carta_porte_id":cfdi_carta_porte_id};
    return this._httpClient.post(this.url + 'egresos_logistica_compras_obtener_carta_porte',data)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraArribosSinFechaRegistrada(logistica_seguimiento_token:string): Observable<any> {
    let data = {"logistica_seguimiento_token":logistica_seguimiento_token};
    console.log(data)
    return this._httpClient.post(this.url + 'egresos_logistica_compras_arribos_sin_fecha_registrada', data)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraRegistrarLlegada(
    logistica_seguimiento_token:string,
    token_seguimiento_unidad:string,
    new_fecha_real_arribo:string,
    new_observaciones_arribo:string,
    anexos_llegada:any
  ): Observable<any> {
    const formLogistica = new FormData();
    formLogistica.append("logistica_seguimiento_token",logistica_seguimiento_token);
    formLogistica.append("token_seguimiento_unidad",token_seguimiento_unidad);
    formLogistica.append("fecha_real_arribo",new_fecha_real_arribo);
    formLogistica.append("observaciones_arribo",new_observaciones_arribo);
    for (var i = 0; i < anexos_llegada.length; i++) {
      formLogistica.append("anexos_llegada[]", anexos_llegada[i]);
    }
    let data = {
      "logistica_seguimiento_token":logistica_seguimiento_token,
      "token_seguimiento_unidad":token_seguimiento_unidad,
      "fecha_real_arribo":new_fecha_real_arribo,
      "observaciones_arribo":new_observaciones_arribo
    };
    console.log(data)
    return this._httpClient.post(this.url + 'egresos_logistica_compras_llegada_registrar', formLogistica)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraArribosNoAutorizados(logistica_seguimiento_token:string): Observable<any> {
    let data = {"logistica_seguimiento_token":logistica_seguimiento_token};
    console.log(data)
    return this._httpClient.post(this.url + 'egresos_logistica_compras_arribos_no_autorizados', data)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraRegistrarAutorizacion(
    logistica_seguimiento_token:string,
    token_seguimiento_unidad:string,
    etapa_anterior:string,
    auth_arribo_fecha:string,
    auth_arribo_tipo:string,
    auth_arribo_origen:string,
    auth_arribo_autorizador:string,
    auth_arribo_observaciones:string,
    autorizacion_anexos:any
  ): Observable<any> {
    let data = {
      "logistica_seguimiento_token":logistica_seguimiento_token,
      "token_seguimiento_unidad":token_seguimiento_unidad,
      "etapa_anterior":etapa_anterior,
      "auth_arribo_fecha":auth_arribo_fecha,
      "auth_arribo_tipo":auth_arribo_tipo,
      "auth_arribo_origen":auth_arribo_origen,
      "auth_arribo_autorizador":auth_arribo_autorizador,
      "auth_arribo_observaciones":auth_arribo_observaciones
    };
    console.log(data);
    const formLogistica = new FormData();
    formLogistica.append("logistica_seguimiento_token",logistica_seguimiento_token);
    formLogistica.append("token_seguimiento_unidad",token_seguimiento_unidad);
    formLogistica.append("etapa_anterior",etapa_anterior);
    formLogistica.append("auth_arribo_fecha",auth_arribo_fecha);
    formLogistica.append("auth_arribo_tipo",auth_arribo_tipo);
    formLogistica.append("auth_arribo_origen",auth_arribo_origen);
    formLogistica.append("auth_arribo_autorizador",auth_arribo_autorizador);
    formLogistica.append("auth_arribo_observaciones",auth_arribo_observaciones);
    for (var i = 0; i < autorizacion_anexos.length; i++) {
      formLogistica.append("autorizacion_anexos[]", autorizacion_anexos[i]);
    }
    //let data = {
    //  "token_compras":token_compras,
    //  "token_seguimiento_transito":token_seguimiento_transito,
    //  "etapa_anterior":etapa_anterior,
    //  "auth_arribo_fecha":auth_arribo_fecha,
    //  "auth_arribo_tipo":auth_arribo_tipo,
    //  "auth_arribo_origen":auth_arribo_origen,
    //  "auth_arribo_autorizador":auth_arribo_autorizador,
    //  "auth_arribo_observaciones":auth_arribo_observaciones,
    //};
    return this._httpClient.post(this.url + 'egresos_logistica_compras_llegada_autorizar',formLogistica)
    .pipe(catchError(this.handlerError));
  }

  obtenerUbicacionesSinEntrega(logistica_seguimiento_token:string): Observable<any> {
    let data = {"logistica_seguimiento_token":logistica_seguimiento_token};
    console.log(data);
    return this._httpClient.post(this.url + 'egresos_logistica_compras_ubicaciones_sin_entrega', data)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraObtenUltimoParadero(token_compras:string): Observable<any> {
    let data = {"token_compras":token_compras};
    console.log(data);
    return this._httpClient.post(this.url + 'egresos_logistica_compras_ultimo_paradero', data)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraIniciaTransito(logisticBuyModel:logisticaCompraModelo,compras_vinculadas:any,transito_anexos:any): Observable<any> {
    let data = {
      "compras_vinculadas":compras_vinculadas,
      "compra_relacionada_token": logisticBuyModel.compra_relacionada_token,
      "estado_alcanzado": logisticBuyModel.estado_alcanzado,
      "fecha_real_salida": logisticBuyModel.fecha_real_salida,
      "tentativaLlegadaLugarDestino": logisticBuyModel.tentativaLlegadaLugarDestino,
      "observaciones": logisticBuyModel.observaciones,
      "transportes": JSON.stringify(logisticBuyModel.transportes)
    }
    console.log(data);

    const formLogistica = new FormData();
    formLogistica.append("compra_relacionada_token", logisticBuyModel.compra_relacionada_token);

    if (compras_vinculadas) {
      //compras_vinculadas.forEach((buy:any, cv:any) => {
      //  formLogistica.append(`compras_vinculadas[${cv}][token_compras]`, buy.token_compras);
      //});
      formLogistica.append("compras_vinculadas", JSON.stringify(compras_vinculadas));
    }
    formLogistica.append("estado_alcanzado", logisticBuyModel.estado_alcanzado);
    formLogistica.append("fecha_real_salida", logisticBuyModel.fecha_real_salida);
    formLogistica.append("tentativaLlegadaLugarDestino", logisticBuyModel.tentativaLlegadaLugarDestino);
    formLogistica.append("observaciones", logisticBuyModel.observaciones);
    formLogistica.append("transportes", JSON.stringify(logisticBuyModel.transportes));
    for (var doc = 0; doc < transito_anexos.length; doc++) {
      formLogistica.append("transito_anexos[]", transito_anexos[doc]);
    }
    return this._httpClient.post(this.url + 'egresos_logistica_compras_guardar_transito', formLogistica)
    .pipe(catchError(this.handlerError));
  }

  logisticaCompraContinuarRuta(logistica_seguimiento_token:string,punto_seleccionado:string,logisticBuyModel:logisticaCompraModelo,transito_anexos:any): Observable<any> {//compras_vinculadas:any,
    let data = {
      "logistica_seguimiento_token":logistica_seguimiento_token,
      "punto_seleccionado":punto_seleccionado,
      "transportes": JSON.stringify(logisticBuyModel.transportes),
      "observaciones": logisticBuyModel.observaciones
    }
    console.log(data);

    const formLogistica = new FormData();
    formLogistica.append("logistica_seguimiento_token", logistica_seguimiento_token);
    formLogistica.append("punto_seleccionado", punto_seleccionado);
    formLogistica.append("transportes", JSON.stringify(logisticBuyModel.transportes));
    formLogistica.append("observaciones", logisticBuyModel.observaciones);
    for (var doc = 0; doc < transito_anexos.length; doc++) {
      formLogistica.append("transito_anexos[]", transito_anexos[doc]);
    }
    return this._httpClient.post(this.url + 'egresos_logistica_compras_continuar_ruta', formLogistica)
    .pipe(catchError(this.handlerError));
  }

  monitorRutasLogistica(logistica_seguimiento_token:string): Observable<any> {
    let data = {"logistica_seguimiento_token":logistica_seguimiento_token};
    console.log(data);
    return this._httpClient.post(this.url + 'egresos_logistica_compras_monitor', data)
    .pipe(catchError(this.handlerError));
  }

  handlerError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}
