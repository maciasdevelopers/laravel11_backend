import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfClasificacion } from '../../interfaces/interf-clasificacion';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class VisitasService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  totalVisitas():Observable<any>{
    return this._httpClient.get(this.url+'ver_visitas')
    .pipe(catchError(this.handlerError))
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

  errorHandle_r(error: { error: { message: string; }; status: any; message: any; }){
		let errorMensaje = '';
		if(error.error instanceof ErrorEvent){
			errorMensaje = error.error.message;
		} else {
			errorMensaje = `Error code: ${error.status}\nMessage: ${error.message}`;
		}
		return throwError(errorMensaje);
	}

  /*
  errorHandler(error: { error: { message: string; }; status: any; message: any; }){
		let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
		if(error.error instanceof ErrorEvent){
			errorMessage = `Error: ${error.error.message}`;
		} else {
      errorMessage = error.error.message;
			//errorMensaje = `Error code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        // Si el backend envía un mensaje, lo mostramos
      } else {
        // Si no hay mensaje del backend, usamos códigos HTTP
        //switch (error.status) {
        //  case 400:
        //    errorMessage = 'Solicitud incorrecta. Verifique los datos enviados.';
        //    break;
        //  case 401:
        //    errorMessage = 'No está autenticado. Inicie sesión nuevamente.';
        //    break;
        //  case 403:
        //    errorMessage = 'No tiene permisos para realizar esta acción.';
        //    break;
        //  case 404:
        //    errorMessage = 'Recurso no encontrado.';
        //    break;
        //  case 409:
        //    errorMessage = 'No se puede eliminar la caja porque está vinculada a otras operaciones.';
        //    break;
        //  case 500:
        //    errorMessage = 'Error interno del servidor. Intente más tarde.';
        //    break;
        //  default:
        //    errorMessage = `Error ${error.status}: ${error.message}`;
        //    break;
        //}
      }
		}
		return throwError(errorMessage);
	}
  */
}
