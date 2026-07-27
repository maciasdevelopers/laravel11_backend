import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  //landing_page
  verPublicacionesMin():Observable<any>{
    return this._httpClient.get(this.url+'verPublicacionesMin')
    .pipe(catchError(this.handlerError))
  }

  publicacionCompleta(token_publicacion:any):Observable<any>{
    let data = {"token_publicacion":token_publicacion};
    console.log(data);
    return this._httpClient.post(this.url+'ver_publicacion_completa',data)
    .pipe(catchError(this.handlerError));
  }

  //sistema_interno
  publicacion_registrar(titulo:string,resena:string,desglose:any,fuentes_de_consulta:any):Observable<any>{
    let data = {"titulo":titulo,"resena":resena,"desglose":desglose,"fuentes_de_consulta":fuentes_de_consulta};
    console.log(data);
    return this._httpClient.post(this.url+'tecnologias_info_publicaciones_registrar',data)
    .pipe(catchError(this.handlerError));
  }

  publicacionesCatalogo():Observable<any>{
    return this._httpClient.post(this.url+'tecnologias_info_publicaciones_catalogo',null)
    .pipe(catchError(this.handlerError));
  }

  detallePublicacion(token_publicacion:string):Observable<any>{
    let data = {"token_publicacion":token_publicacion};
    return this._httpClient.post(this.url+'tecnologias_info_publicaciones_detalle',data)
    .pipe(catchError(this.handlerError));
  }

  actualizarPublicacion(
    token_publicacion:string,
    titulo:string,
    resena:string,
    desglose_nuevo:any,
    desglose_edit:any,
    desglose_delete:any,
    fuentes_de_consulta_nuevo:any,
    fuentes_de_consulta_edit:any,
    fuentes_de_consulta_delete:any
  ):Observable<any>{
    let data = {
      "token_publicacion":token_publicacion,    
      "titulo":titulo,
      "resena":resena,
      "desglose_nuevo":desglose_nuevo,
      "desglose_edit":desglose_edit,
      "desglose_delete":desglose_delete,
      "fuentes_de_consulta_nuevo":fuentes_de_consulta_nuevo,
      "fuentes_de_consulta_edit":fuentes_de_consulta_edit,
      "fuentes_de_consulta_delete":fuentes_de_consulta_delete
    };
    return this._httpClient.post(this.url+'tecnologias_info_publicaciones_actualizar',data)
    .pipe(catchError(this.handlerError));
  }

  eliminarPublicacion(token_publicacion:string):Observable<any>{
    let data = {"token_publicacion":token_publicacion};
    return this._httpClient.post(this.url+'tecnologias_info_publicaciones_eliminar',data)
    .pipe(catchError(this.handlerError));
  }

  restaurarPublicacion(token_publicacion:string):Observable<any>{
    let data = {"token_publicacion":token_publicacion};
    return this._httpClient.post(this.url+'tecnologias_info_publicaciones_restaurar',data)
    .pipe(catchError(this.handlerError));
  }

  eliminacionPermanentePublicacion(token_publicacion:string):Observable<any>{
    let data = {"token_publicacion":token_publicacion};
    return this._httpClient.post(this.url+'tecnologias_info_publicaciones_eliminacion_permanente',data)
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
