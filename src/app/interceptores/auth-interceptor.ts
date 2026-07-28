import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

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
    const moriahKey = sessionStorage.getItem('moriah_key');
    let request_config_inicial:any = {withCredentials:true};
    
    // Si el token existe, clonamos la petición y añadimos el header Authorization
    if (token) {
      request_config_inicial.headers = req.headers.set('Authorization', `Bearer ${token}`);
    }
    // Si existe moriah_key, la enviamos también en los headers de la petición
    if (moriahKey) {
      if (!request_config_inicial.headers) {
        request_config_inicial.headers = req.headers;
      }
      request_config_inicial.headers = request_config_inicial.headers.set('X-Moriah-Key', moriahKey);
    }
    const request = req.clone(request_config_inicial);

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const refreshedMoriah = event.headers.get('X-Refreshed-Moriah');
          const refreshedToken = event.headers.get('X-Refreshed-Token');

          if (refreshedMoriah) {
            console.log('Token de contexto de empresa refrescado automáticamente por el servidor');
            sessionStorage.setItem('moriah_key', refreshedMoriah);
            localStorage.setItem('moriah_key', refreshedMoriah);
          }
          if (refreshedToken) {
            console.log('Token de usuario refrescado automáticamente por el servidor');
            sessionStorage.setItem('inside_session_code', refreshedToken);
            localStorage.setItem('user_code', refreshedToken);
          }
        }
      }),
      catchError((error:HttpErrorResponse) => {
        //console.log("Status del error:", error.status); // Revisa qué número sale aquí
        //console.log("Cuerpo del error:", error.error);
        //console.log("Texto del estado:", error.statusText);
        let mensajeCuerpo = 'Ocurrió un error inesperado';

        // Excluimos las rutas de autenticación pública y recuperación de contraseña de la alerta Swal global
        const esRutaPublicaAuth = req.url.includes('usuario_login_main') ||
                                  req.url.includes('verif_codigopass_ssic') ||
                                  req.url.includes('save_codigopass_ssic') ||
                                  req.url.includes('reset_passwpord_ssic');

        if (error.status === 401) {
          mensajeCuerpo = error.error?.message || error.error?.error || 'Su sesión ha expirado o es inválida. Inicie sesión nuevamente.';
          sessionStorage.clear();
          localStorage.clear();

          if (!esRutaPublicaAuth) {
            // Mostrar SweetAlert elegante y redirigir
            Swal.fire({
              title: 'Sesión Expirada',
              text: mensajeCuerpo,
              icon: 'warning',
              confirmButtonColor: '#388E3C',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              window.location.href = '/';
            });
            return throwError(() => error);
          }
        } else if (error.status === 403) {
          mensajeCuerpo = 'No tiene permisos para realizar esta acción.';
        } else if (error.status === 500) {
          mensajeCuerpo = 'Error en el servidor de SOS-México. Intente más tarde.';
        } else if (error.status === 0) {
          mensajeCuerpo = 'No hay conexión con el servidor. Revise su internet.';
        }

        // Mostrar la alerta automáticamente para errores no 401 públicos
        console.log('Error '+mensajeCuerpo)
        this.primeAlerts.add({ severity: 'error', summary: 'Atención', detail: mensajeCuerpo });
        // Lanzamos el error para que el componente también sepa que falló si es necesario
        return throwError(() => error);
      })
    );
  }
}