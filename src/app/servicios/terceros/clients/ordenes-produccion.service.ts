import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { global } from '../../global_ssic';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfProductos } from '../../../interfaces/interf-productos';
import { Usuarios } from '../../../modelos/Usuarios';
import { productoAngularModelo } from '../../../modelos/productoAngularModelo';

@Injectable({
  providedIn: 'root'
})
export class OrdenesProduccionService {
  public url: string;
  public user:any;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
    this.user = sessionStorage.getItem('app-token-row');
  }

  listaMedidas():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get(this.url+'listamedidas',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  listaPaises():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get(this.url+'listaPaises',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  totalNotificaciones():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'totalnotificaciones',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  notificacionesMin():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'notificacionesordenes',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  notificacionesAll():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'notificacionesordenesall',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  verNotificacion(token_notificacion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_notificacion":token_notificacion});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'vernotificacion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  verUltimaNotificacion():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'ultimanotificacion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  listaOrdenesProduccOrigen():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'listaordenesproduccion-origen',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  detalleOrdenesProduccOrigen(token_produccion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'detalleordenproduccion-origen',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  detalleBitacoraOrdenProducc(token_produccion:any,token_bitacora:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion,"token_bitacora":token_bitacora});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'bitacoraordenproduccion-origen',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  listaOrdenesProduccLogistica():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'listaordenesproduccion-logistica',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  listaOrdenesProduccMaquilador():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'listaordenesproduccion-maquilador',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  registrarOrdenesProducc(orden_descripcion:any,orden_upc:any,orden_sku:any,orden_cantidad:any,orden_unidad_medida:any,
    orden_procedencia:any,orden_destino:any,fecha_salida_tentativa:any,fecha_llegada_tentativa:any,
    orden_observaciones_maquila:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"descripcion":orden_descripcion,"upc":orden_upc,"sku":orden_sku,
      "cantidad":orden_cantidad,"unidad_medida":orden_unidad_medida,"procedencia":orden_procedencia,
      "destino":orden_destino,"salida_tentativa":fecha_salida_tentativa,"llegada_tentativa":fecha_llegada_tentativa,
      "observaciones_maquila":orden_observaciones_maquila});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'registrarordenproduccion',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  validaFsalidaOrdenP(token_produccion:any,txt_fecha_salida_final:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion,
      "txt_fecha_salida_final":txt_fecha_salida_final});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'validarsalidaordenprod',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  registrarFsalidaOrdenP(token_produccion:any,txt_fecha_salida_final:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion,
      "txt_fecha_salida_final":txt_fecha_salida_final});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'registrarsalidaordenprod',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  confirmarRegistroAduana(token_produccion:any,token_solicitud:any,orden_conf_chofer:any,
    orden_conf_camion:any,orden_conf_placas:any,imagenEvidenciasReceptAduana:any):Observable<any>{
    const formData = new FormData();
    for (var i = 0; i < imagenEvidenciasReceptAduana.length; i++) {
      formData.append("imgEvidencias[]", imagenEvidenciasReceptAduana[i]);
    }
    formData.append('json',JSON.stringify({
      "user_token":sessionStorage.getItem('app-token-row'),
      "token_produccion":token_produccion,
      "token_solicitud":token_solicitud,
      "chofer":orden_conf_chofer,
      "camion":orden_conf_camion,
      "placas":orden_conf_placas,
    }));
    console.log(formData);
    return this._httpClient.post(this.url+'confirmareceptordenaduana',formData).pipe(
      catchError(this.handlerError)
    );
  }

  confirmarRegistroAlmacen(token_produccion:any,token_solicitud:any,orden_conf_chofer:any,
    orden_conf_camion:any,orden_conf_placas:any,imagenEvidenciasReceptAduana:any):Observable<any>{
    const formData = new FormData();
    for (var i = 0; i < imagenEvidenciasReceptAduana.length; i++) {
      formData.append("imgEvidencias[]", imagenEvidenciasReceptAduana[i]);
    }
    formData.append('json',JSON.stringify({
      "user_token":sessionStorage.getItem('app-token-row'),
      "token_produccion":token_produccion,
      "token_solicitud":token_solicitud,
      "chofer":orden_conf_chofer,
      "camion":orden_conf_camion,
      "placas":orden_conf_placas,
    }));
    console.log(formData);
    return this._httpClient.post(this.url+'confirmareceptordenalmacen',formData).pipe(
      catchError(this.handlerError)
    );
  }

  confirmarDescargaLogistica(token_produccion:any,token_solicitud:any,cantidad:any,imagenEvidenciasDescarga:any):Observable<any>{
    console.log(cantidad);
    const formData = new FormData();
    for (var i = 0; i < imagenEvidenciasDescarga.length; i++) {
      formData.append("imgEvidencias[]", imagenEvidenciasDescarga[i]);
    }
    formData.append('json',JSON.stringify({
      "user_token":sessionStorage.getItem('app-token-row'),
      "token_produccion":token_produccion,
      "token_solicitud":token_solicitud,
      "cantidad_descarga":cantidad,
    }));
    console.log(formData);
    return this._httpClient.post(this.url+'confirmardescargaorden',formData).pipe(
      catchError(this.handlerError)
    );
  }

  registraEntregaLogistica(token_produccion:any,cantidad:any,imagenEvidenciasEntrega:any,fecha_salida:any,fecha_llegada_tentativa:any,
    observaciones_salida:any):Observable<any>{
    const formData = new FormData();
    for (var i = 0; i < imagenEvidenciasEntrega.length; i++) {
      formData.append("imgEvidencias[]", imagenEvidenciasEntrega[i]);
    }
    formData.append('json',JSON.stringify({
      "user_token":sessionStorage.getItem('app-token-row'),
      "token_produccion":token_produccion,
      "cantidad_descarga":cantidad,
      "fecha_salida":fecha_salida,
      "fecha_llegada_tentativa":fecha_llegada_tentativa,
      "observaciones_salida":observaciones_salida
    }));
    console.log(formData);
    return this._httpClient.post(this.url+'confirmardescargaorden',formData).pipe(
      catchError(this.handlerError)
    );
  }

  eliminaOrdenP(token_produccion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'deleteordenprod',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  restauraOrdenP(token_produccion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'retaurarordenprod',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }
  deletepermOrdenP(token_produccion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'deletepermordenprod',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  solicitaEntregaMaquilador(token_produccion:any,cantidad:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('app-token-row'),"token_produccion":token_produccion,"cantidad_entrega":cantidad});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'solicitaentregamaquilador',parametros, {headers: headers})
    .pipe(catchError(this.handlerError));
  }

  entregalogisticatomaquilador(token_produccion:any,token_solicitud:any,cantidad:any,imagenEvidenciasEntregaToMaq:any):Observable<any>{
    console.log(cantidad);
    const formData = new FormData();
    for (var i = 0; i < imagenEvidenciasEntregaToMaq.length; i++) {
      formData.append("imgEvidencias[]", imagenEvidenciasEntregaToMaq[i]);
    }
    formData.append('json',JSON.stringify({
      "user_token":sessionStorage.getItem('app-token-row'),
      "token_produccion":token_produccion,
      "token_solicitud":token_solicitud,
      "cantidad_new":cantidad,
    }));
    console.log(formData);
    return this._httpClient.post(this.url+'entregatomaquilador',formData).pipe(
      catchError(this.handlerError)
    );
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
