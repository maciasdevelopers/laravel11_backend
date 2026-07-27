import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderServService } from '../servicios/ssic/loader-serv.service';
import { HttpCancelService } from '../servicios/ssic/http-cancel.service';
import { global } from '../servicios/global_ssic';

@Injectable()
export class LoadInterceptorInterceptor implements HttpInterceptor {
  public url: string;

  constructor(
    private readonly loaderServ:LoaderServService,
    private readonly HttpCancel:HttpCancelService,) {
      this.url = global.urlApi;
    }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (localStorage.length == 0) {
      //console.log(request.url);
      return next.handle(request).pipe(takeUntil(this.HttpCancel.onCancelPendingRequests()));
    } else {
      if (
        request.url != this.url+"usuario_recupera_user_empresa" &&
        request.url != this.url+"dtalgnpacc" &&
        request.url != this.url+"permisos_acceso_menu" &&
        request.url != this.url+"permisos_acceso_ingresos" &&
        request.url != this.url+"all_user_config_ssic" &&
        request.url != this.url+"permisos_proyectos" &&
        request.url != this.url+"total_notificaciones" &&
        request.url != this.url+"control_proyectos" &&
        request.url != this.url+"getcpostales" &&
        request.url != this.url+"postcpostales" &&
        request.url != "https://logistica.sos-mexico.com.mx/totalnotificaciones" &&
        request.url != this.url+"update_requisicion_list_tipo" &&
        request.url != this.url+"update_requisicion_list_concepto" &&
        request.url != this.url+"update_requisicion_list_cantidad" &&
        request.url != this.url+"update_requisicion_list_marca" &&
        request.url != this.url+"ingresos_mostrador_buscaArticulosVenta" &&
        request.url != this.url+"notificaciones" &&
        request.url != this.url+"notificaciones_sin_leer") {
        this.loaderServ.mostrar();
        return next.handle(request).pipe(
          finalize(() => this.loaderServ.desaparecer())
        );
      } else {
        return next.handle(request);
      }
    }
  }
}
