import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfProveedores } from '../../interfaces/interf-proveedores';
import { global } from '../global_ssic'; 
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class CuentasContablesService {
  public url: string;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  catalogoCuentaNivelUno():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogos_cuentas_contables_nivel_uno',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  catalogoCuentaNivelDos(uuid_nivel_uno:any):Observable<any>{
    let data = {"uuid_nivel_uno":uuid_nivel_uno};
    return this._httpClient.post(this.url+'contabilidad_catalogos_cuentas_contables_nivel_dos',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  catalogoCuentaContable():Observable<any>{
    return this._httpClient.post(this.url+'contabilidad_catalogos_cuenta_contable_lista',null)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  crearCuentaContableProv(token_proveedor:any):Observable<any>{
    let data = {"token_proveedor":token_proveedor};
    return this._httpClient.post(this.url+'egresos_catalogos_registracuentacontableproveedor',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  registrarCuentaContable(
    nombre:any,
    niveluno_uuid:any,
    niveldos_uuid:any,
    numero:any,
    tipo:any,
    naturaleza:any,
    catalogo_aplicado_tipo:any,
    catalogo_aplicado_token:any,
    observaciones:any):Observable<any>{
    let data = {
      "nombre":nombre,
      "uuid_nivel_uno":niveluno_uuid,
      "uuid_nivel_dos":niveldos_uuid,
      "numero":numero,
      "tipo":tipo,
      "naturaleza":naturaleza,
      "catalogo_aplicado_tipo":catalogo_aplicado_tipo,
      "catalogo_aplicado_token":catalogo_aplicado_token,
      "observaciones":observaciones
    };

    return this._httpClient.post(this.url+'contabilidad_catalogos_cuenta_contable_registra',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
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
