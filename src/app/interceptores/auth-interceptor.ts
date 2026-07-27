import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private primeAlerts: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 2. Si la petición es hacia esa URL, la dejamos pasar sin modificar
    if (
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaMonedas" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaRegimenFiscal" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaRegimenFiscalPF" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaRegimenFiscalPM" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaUsoCFDI" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaUsoCFDIPF" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaUsoCFDIPM" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaUnidadMedida" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaUnidadMedidaProducto" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaUnidadMedidaServicio" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/sat_unidades_de_medida" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaBancos" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaFormasDePago" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaMetodosDePago" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaPaises" ||
      req.url === "https://insideapis.sos-mexico.com.mx/api/listaUsoCFDI"
    ) {
      return next.handle(req);
    }

    const token = sessionStorage.getItem('inside_session_code');
    let request_config_inicial:any = {withCredentials:true};
    
    // Si el token existe, clonamos la petición y añadimos el header Authorization
    if (token) {
      request_config_inicial.headers = req.headers.set('Authorization', `Bearer ${token}`);
    }
    const request = req.clone(request_config_inicial);

    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse) => {
        //console.log("Status del error:", error.status); // Revisa qué número sale aquí
        //console.log("Cuerpo del error:", error.error);
        //console.log("Texto del estado:", error.statusText);
        let mensajeCuerpo = 'Ocurrió un error inesperado';
        if (error.status === 401) {
          mensajeCuerpo = error.error?.message || mensajeCuerpo;
          // Aquí podrías redirigir al login: this.router.navigate(['/login']);
          sessionStorage.clear();
          localStorage.clear();
        } else if (error.status === 403) {
          mensajeCuerpo = 'No tiene permisos para realizar esta acción.';
        } else if (error.status === 500) {
          mensajeCuerpo = 'Error en el servidor de SOS-México. Intente más tarde.';
        } else if (error.status === 0) {
          mensajeCuerpo = 'No hay conexión con el servidor. Revise su internet.';
        }

        // Mostrar la alerta automáticamente
        console.log('Error '+mensajeCuerpo)
        this.primeAlerts.add({ severity: 'error', summary: 'Atención', detail: mensajeCuerpo });
        // Lanzamos el error para que el componente también sepa que falló si es necesario
        return throwError(() => error);
      })
    );
  }
}