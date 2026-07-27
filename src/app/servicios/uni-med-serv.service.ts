import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { InterfUmedida } from '../interfaces/interf-umedida';
import { global } from './global_ssic';

export interface UnidadMedida {
  clave: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class UniMedServService {
  public url: string;
  private cache = new Map<string, Observable<any>>();
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) { 
    this.url = global.urlApi;
  }

  getApiSatCatalogoProductos():Observable<UnidadMedida[]> {
    return this._httpClient.get<UnidadMedida[]>(this.url+'inventarios_catalogos_unidades_medida_sat_catalogo');
  }

  getApiUniMedCatalogo():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaUnidadMedida',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  inventUnidadesMedidaProducto():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaUnidadMedidaProducto',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  inventUnidadesMedidaServicio():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/listaUnidadMedidaServicio',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  inventSATUnidadesMedida():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get('https://insideapis.sos-mexico.com.mx/api/sat_unidades_de_medida',{headers: headers})
    .pipe(catchError(this.handlerError))
  }

  getClassifUmedida():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    return this._httpClient.get(this.url+'listamedidas',{headers: headers})
    .pipe(catchError(this.handlerError))
  }
  
  inventUnidadesMedidaCatalogo(): Observable<any> {
    const endpoint = 'inventarios_catalogos_unidades_medida_catalogo';
    const url = `${this.url}${endpoint}`;
    const cacheKey = `${url}|null`;
  
    // 1. Verificar si ya existe en caché antes de cualquier otra acción
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
  
    // 2. Si no está en caché, crear la petición
    const peticion$ = this._httpClient.post<any>(url, null).pipe(
      shareReplay(1), // Mantiene el último valor para suscriptores tardíos
      catchError(err => {
        // Si hay error, eliminamos la entrada fallida de la caché para permitir reintentos
        this.cache.delete(cacheKey);
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
  
    // 3. Almacenar en caché y retornar
    this.cache.set(cacheKey, peticion$);
    return peticion$;
  }

  inventUnidades_MedidaCatalogo_():Observable<any>{
    const link = this.url + 'inventarios_catalogos_unidades_med_ida_catalogo';
    const cacheKlave = link+'|'+null;
    this.cache.delete(link + '|' + null);

    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const peticion$ = this._httpClient.post(link,null).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  inventUnidadesMedidaEnabledCatalogo():Observable<any>{
    const endpoint = 'inventarios_catalogos_unidades_medida_enabled_catalogo';
    const url = `${this.url}${endpoint}`;
    const cacheKey = `${url}|null`;
    
    // 1. Si ya existe el Observable en caché, lo devolvemos de inmediato
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
  
    // 2. Si no existe, creamos el flujo
    const peticion$ = this._httpClient.post<any>(url, null).pipe(
      shareReplay(1), // Comparte la última respuesta exitosa con todos
      catchError(err => {
        // SI FALLA: Eliminamos inmediatamente de la caché para que el siguiente intento lo vuelva a intentar
        this.cache.delete(cacheKey);
        console.error('Error en la petición:', err);
        return this.handlerError(err); // Asegúrate de que esto retorne un error con throwError
      })
    );
  
    // 3. Guardamos el OBSERVABLE en la caché para peticiones simultáneas
    this.cache.set(cacheKey, peticion$);
    
    return peticion$;
  }

  inventUnidadesMedida_EnabledCatalogo():Observable<any>{
    const link = this.url + 'inventarios_catalogos_unidades_medida_enabled_catalogo';
    const token = sessionStorage.getItem('inside_session_code');
    const body = 'json=' + JSON.stringify({ user_token: token });
    const cacheKlave = link+'|'+token;
    this.cache.delete(link + '|' + token);

    if (this.cache.has(cacheKlave)) {
      return this.cache.get(cacheKlave)!;
    }

    const headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    const peticion$ = this._httpClient.post(link,body, {headers}).pipe(
      shareReplay(1),
      catchError(err => {
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
    this.cache.set(cacheKlave,peticion$);
    return peticion$;
  }

  uniMedCatalogoUpdateGenerales(token_unidad_medida:any,nombre:any,simbolo:any,categoria:any,sat_vinculo:any):Observable<any>{
    let data = {
      "token_unidad_medida":token_unidad_medida,
      "nombre":nombre,
      "simbolo":simbolo,
      "categoria":categoria,
      "sat_vinculo":sat_vinculo
    };

    const endpoint = 'inventarios_catalogos_unidades_medida_generales_update';
    const url = `${this.url}${endpoint}`;    
    return this._httpClient.post(url, data).pipe(
      tap((res: any) => {
        // 2. Invalidación de caché solo si la respuesta es exitosa
        if (res?.status === 'success') {
          const cacheKey = `${this.url}inventarios_catalogos_unidades_medida_catalogo|null`;
          
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            console.log(`[CACHE] Eliminado después de actualizar unidad.`);
          }
        }
      }),
      catchError(err => {
        console.error('Error al registrar unidad de medida:', err);
        return this.handlerError(err);
      })
    );
  }

  unidadesMedidaHabilitar(token_unidad_medida:any):Observable<any>{
    let data = {"token_unidad_medida":token_unidad_medida};

    const endpoint = 'inventarios_catalogos_unidades_medida_generales_habilitar';
    const url = `${this.url}${endpoint}`;    
    return this._httpClient.post(url, data).pipe(
      tap((res: any) => {
        // 2. Invalidación de caché solo si la respuesta es exitosa
        if (res?.status === 'success') {
          const cacheKey = `${this.url}inventarios_catalogos_unidades_medida_catalogo|null`;
          
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            console.log(`[CACHE] Eliminado después de habilitar unidad.`);
          }
        }
      }),
      catchError(err => {
        console.error('Error al registrar unidad de medida:', err);
        return this.handlerError(err);
      })
    );
  }

  unidadesMedidaDeshabilitar(token_unidad_medida:any):Observable<any>{
    let data = {"token_unidad_medida":token_unidad_medida};

    const endpoint = 'inventarios_catalogos_unidades_medida_generales_deshabilitar';
    const url = `${this.url}${endpoint}`;    
    return this._httpClient.post(url, data).pipe(
      tap((res: any) => {
        // 2. Invalidación de caché solo si la respuesta es exitosa
        if (res?.status === 'success') {
          const cacheKey = `${this.url}inventarios_catalogos_unidades_medida_catalogo|null`;
          
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            console.log(`[CACHE] Eliminado después de deshabilitar unidad.`);
          }
        }
      }),
      catchError(err => {
        console.error('Error al registrar unidad de medida:', err);
        return this.handlerError(err);
      })
    );
  }

  unidadesMedidaEliminarPapelera(token_unidad_medida:any):Observable<any>{
    let data = {"token_unidad_medida":token_unidad_medida};

    const endpoint = 'inventarios_catalogos_unidades_medida_generales_eliminar_papelera';
    const url = `${this.url}${endpoint}`;    
    return this._httpClient.post(url, data).pipe(
      tap((res: any) => {
        // 2. Invalidación de caché solo si la respuesta es exitosa
        if (res?.status === 'success') {
          const cacheKey = `${this.url}inventarios_catalogos_unidades_medida_catalogo|null`;
          
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            console.log(`[CACHE] Eliminado después de eliminar unidad.`);
          }
        }
      }),
      catchError(err => {
        console.error('Error al registrar unidad de medida:', err);
        return this.handlerError(err);
      })
    );
  }

  inventUnidadesMedidaEliminadasCatalogo():Observable<any>{
    const endpoint = 'inventarios_catalogos_unidades_medida_eliminadas_catalogo';
    const url = `${this.url}${endpoint}`;
    const cacheKey = `${url}|null`;
  
    // 1. Verificar si ya existe en caché antes de cualquier otra acción
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
  
    // 2. Si no está en caché, crear la petición
    const peticion$ = this._httpClient.post<any>(url, null).pipe(
      shareReplay(1), // Mantiene el último valor para suscriptores tardíos
      catchError(err => {
        // Si hay error, eliminamos la entrada fallida de la caché para permitir reintentos
        this.cache.delete(cacheKey);
        console.error('Error en la petición:', err);
        return this.handlerError(err);
      })
    );
  
    // 3. Almacenar en caché y retornar
    this.cache.set(cacheKey, peticion$);
    return peticion$;
  }

  unidadesMedidaRestaurar(token_unidad_medida:any):Observable<any>{
    let data = {"token_unidad_medida":token_unidad_medida};

    const endpoint = 'inventarios_catalogos_unidades_medida_generales_restaurar';
    const url = `${this.url}${endpoint}`;    
    return this._httpClient.post(url, data).pipe(
      tap((res: any) => {
        // 2. Invalidación de caché solo si la respuesta es exitosa
        if (res?.status === 'success') {
          const cacheKey = `${this.url}inventarios_catalogos_unidades_medida_catalogo|null`;
          
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            console.log(`[CACHE] Eliminado después de restaurar unidad.`);
          }
        }
      }),
      catchError(err => {
        console.error('Error al registrar unidad de medida:', err);
        return this.handlerError(err);
      })
    );
  }

  unidadesMedidaEliminacionPermanente(token_unidad_medida:any):Observable<any>{
    let data = {"token_unidad_medida":token_unidad_medida};

    const endpoint = 'inventarios_catalogos_unidades_medida_generales_eliminacion_permanente';
    const url = `${this.url}${endpoint}`;    
    return this._httpClient.post(url, data).pipe(
      tap((res: any) => {
        // 2. Invalidación de caché solo si la respuesta es exitosa
        if (res?.status === 'success') {
          const cacheKey = `${this.url}inventarios_catalogos_unidades_medida_catalogo|null`;
          
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            console.log(`[CACHE] Eliminado después de eliminar definitivamente unidad.`);
          }
        }
      }),
      catchError(err => {
        console.error('Error al registrar unidad de medida:', err);
        return this.handlerError(err);
      })
    );
  }

  serviciosMedidasPost(clave:any):Observable<any>{
    let data = {"clave":clave};
    return this._httpClient.post(this.url+'inventarios_catalogos_unidades_medida_postmedidasatservicios',data)
    .pipe(catchError(this.handlerError)); // enviar las peticiones ajax
  }

  uniMedCatalogoRegistrar(nombre:any,simbolo:any,categoria:any,sat_vinculo:any):Observable<any>{
    let data = {
      "nombre":nombre,
      "simbolo":simbolo,
      "categoria":categoria,
      "sat_vinculo":sat_vinculo
    };
    
    const endpoint = 'inventarios_catalogos_unidades_medida_registrar';
    const url = `${this.url}${endpoint}`;    
    return this._httpClient.post(url, data).pipe(
      tap((res: any) => {
        // 2. Invalidación de caché solo si la respuesta es exitosa
        if (res?.status === 'success') {
          const cacheKey = `${this.url}inventarios_catalogos_unidades_medida_catalogo|null`;
          
          if (this.cache.has(cacheKey)) {
            this.cache.delete(cacheKey);
            console.log(`[CACHE] Eliminado después de eliminar definitivamente unidad.`);
          }
        }
      }),
      catchError(err => {
        console.error('Error al registrar unidad de medida:', err);
        return this.handlerError(err);
      })
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
