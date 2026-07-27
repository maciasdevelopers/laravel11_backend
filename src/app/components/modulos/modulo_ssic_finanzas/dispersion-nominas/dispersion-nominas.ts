import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { Usuarios } from '../../../../modelos/Usuarios';
import { global } from '../../../../servicios/global_ssic';
import { TranslateService } from '@ngx-translate/core';
import { ServNavSuperiorService } from '../../../../servicios/ssic/serv-nav-superior.service';
import { Router } from '@angular/router';
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
//const messaging = getMessaging();
import { Subject, takeUntil } from 'rxjs';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'app-dispersion-nominas',
  standalone: false,
  templateUrl: './dispersion-nominas.html',
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/breadcrumb.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/canvas.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/explain.css',
    '../../../../styles/switches.css',
    '../finanzas.css',
    './dispersion-nominas.css',
  ]
})
export class DispersionNominasComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  private destruir$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private navSupServ: ServNavSuperiorService,
    private routerr: Router,
    private relInterna: ComunicacionInternaService,
    private sentinela: SentinelArkManager
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    /*this.navSupServ.acceso_finanzas_acceso_ordenesdepago().subscribe(
      response => {
        if (response.status == 'success') {
          var token_superadmin = "ZnRNZzFSSUQ1OE1VM0hYNkxZTjEyQT09OjoxMjM0NTY3ODEyMzQ1Njc4";
          var token_admin_sos = "WXJpMDJObHVlL1pYSS81RCttUk5SUGx6UWl1NjEvVG1YSlR1Y1puYWk5RFk1T3d3VjFMRExZN3hOTlBxcGE0U3p1ZUM2UTRHVWp4UkFuR241aUxKbHdLU1JLZmFMeXpvK1p3WmZRemkyendCZGY1M0UwM0h2OGhyclRDMytMMnJRRENUUXB4RlRpOWpZeEVpYVR6Nis4b01VaXV0WHpVZ3JzWGg1Q3pGa3lzY0E1VGE2MzM2TjdGU1U0azMvMXFwTVM3YmJMM3p3QTdvYlAxQ3FjUDJVWlRyd09xYWJhUFBLRm1BdXpaVVpXc1Z0UUcxVWtJNDVVTjBjcE1Lb2hIRGpMT2NjYTlNMEtyUW01ZkQ2ckEyWWJTaThxNTZYQkFVTGJVakFVWDFPdVk9OjoxMjM0NTY3ODEyMzQ1Njc4";
          if (this.identidad['user_token'] != token_superadmin && this.identidad['user_token'] != token_admin_sos && !response.acceso_paym_ord) {
            global.url_denegado_name = "ordenes de pago (Finanzas)";
            global.url_denegado_link = "sos_inside/finanzas/catalogodeordenesdepago";
            global.home_link = "/sos_inside/home";
            this.routerr.navigate(['./plataformas/permission_denied']);
          }
        }
      },
      error => {
        console.log(error);
      }
    );*/
  }

  cambioDeSeccion(tabIndex: string | number){
    const index_tabla = tabIndex.toString();
    switch (index_tabla) {
      case '1': this.relInterna.mensajeOrdDisperSeccionModule('seccion_orden_disper_pendientes'); break;
      case '2': this.relInterna.mensajeOrdDisperSeccionModule('seccion_orden_disper_liberadas'); break;
      case '3': this.relInterna.mensajeOrdDisperSeccionModule('seccion_orden_disper_concluidas'); break;
      case '4': this.relInterna.mensajeOrdDisperSeccionModule('seccion_orden_disper_pagos_done'); break;
      case '5': this.relInterna.mensajeOrdDisperSeccionModule('seccion_orden_disper_trabajadores'); break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
