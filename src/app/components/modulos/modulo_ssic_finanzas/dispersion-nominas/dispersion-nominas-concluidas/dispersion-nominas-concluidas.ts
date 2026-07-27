import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { Subject, takeUntil } from 'rxjs';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'fnzs_dispersion_nominas_concluidas',
  standalone: false,
  templateUrl: './dispersion-nominas-concluidas.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/breadcrumb.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/canvas.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../finanzas.css',
    './dispersion-nominas-concluidas.css',
  ]
})
export class DispersionNominasConcluidas implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;

  searchPagoConcluidas: any = [];
  ordenes_disper_concluidas: any = [];
  indicadorDisperNomOrdConc:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoNomConcOrd: Date[] | undefined;

  pagos_realizados_array: any = [];
  pagos_realizadosSeleccionadaDocs: string = "";
  pagos_realizados_anexos: any = [];

  public factura_relacionada_token:string = '';
  public factura_relacionada_typo:string = '';

  private destruir$ = new Subject<void>();

  constructor(
    private ordenDisper: NominaDispersionService,
    private ordenPago: OrdenPagoService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private servXlsx: DescargaExcel,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaOrdSeccionModule();
    this.getRespuestaPagoRealizado();

    this.searchPagoConcluidas = ['id', 'token_ordenPago', 'folio_ordenPago', 'fecha_contabilizacion_doc_anterior', 'fecha_contabilizacion_orden_pago', 'fecha_registro', 'orden_bloqueada', 'autorizacion_pay', 'fecha_autorizacion_pay',
      'factura_relacionada_typo', 'factura_relacionada_token', 'factura_relacionada_string', 'orden_emisor_emp', 'orden_emisor_personal_token', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre', 'orden_emisor_personal_nombre_comercial',
      'importe_total_inicial_simple', 'orden_moneda_inicial_name', 'importe_total_inicial', 'importe_autorizado_inicial_simple', 'orden_moneda_inicial_autorizada_tkn', 'orden_moneda_inicial_autorizada_name',
      'importe_autorizado_inicial_format', 'importe_autorizado_final_simple', 'importe_autorizado_final', 'orden_moneda_final_autorizada_name', 'importe_restante', 'importe_restante_format', 'importe_por_pagar', 'debe_simple',
      'debe_format', 'pago_anticipado', 'status_pago', 'status_pago_date', 'empresa', 'comprador', 'open_inside', 'detail_orden', 'autorizacion_proceso', 'lista_pagos_realizados'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdDisperSeccionModule$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_orden_disper_concluidas") {
          console.log(mensaje);
          if (this.ordenes_disper_concluidas.length === 0) this.lista_dispersion_concluidas('hoy');
        }
      }
    );
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "dispersion_nomina_realizada") {
          this.recargar_lista_dispersion_concluidas();
        }
      }
    );
  }

  recargar_lista_dispersion_concluidas() {
    this.lista_dispersion_concluidas(this.indicadorDisperNomOrdConc);
  }

  lista_dispersion_concluidas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDisperNomOrdConc = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var ord_conc_otras_fechas = document.getElementById("ord_conc_otras_fechas");
      if (this.rangoPeriodoNomConcOrd && this.rangoPeriodoNomConcOrd.length === 2) {
        const dateInicio = this.rangoPeriodoNomConcOrd[0];
        const dateFin = this.rangoPeriodoNomConcOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(ord_conc_otras_fechas);
          } else {
            this.validator.errorInputRow(ord_conc_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(ord_conc_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(ord_conc_otras_fechas);
        return;
      }
    }

    this.ordenDisper.lista_concluidas_ordenes_dispersion(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaDispersionConcluidas(response),
      error: (err) => this.manejarErrorDispersionConcluidas(err)
    });
  }
  
  private procesarRespuestaDispersionConcluidas(response: any) {
    if (response.status === 'success') {
      this.ordenes_disper_concluidas = response.ordenes;//.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      this.cd.detectChanges();
    } else {
      this.ordenes_disper_concluidas = [];
    }
  }

  private manejarErrorDispersionConcluidas(error: any) {
    console.error('Error al cargar la lista de ordenes de dispersión de nómina concluidas:', error);
    this.ordenes_disper_concluidas = [];
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }

  orden_pago_pagos_realizados(token_pagos: any) {
    this.ordenPago.desglosePagoRealizado(token_pagos).subscribe(
      response => {
        if (response.status == 'success') {
          this.pagos_realizados_array = response.pagos_realizados;
        }
        if (response.status == 'error') {
          let translate_response = this.translate.instant(response.message);
          Swal.fire({
            position:'top-end',
            icon: 'warning',
            title: translate_response,
            showConfirmButton:false,
            timer: 3000
          })
        }
      },
      error => {console.log(error);}
    );
  }

  orden_pago_pagos_cancelar(token_pagos: any) {
    this.ordenPago.desglosePagoRealizado(token_pagos).subscribe(
      response => {
        if (response.status == 'success') {
          this.pagos_realizados_array = response.pagos_realizados;
        }
        if (response.status == 'error') {
          let translate_response = this.translate.instant(response.message);
          Swal.fire({
            position:'top-end',
            icon: 'warning',
            title: translate_response,
            showConfirmButton:false,
            timer: 3000
          })
        }
      },
      error => {console.log(error);}
    );
  }

  pagosRealizadosverDocs(data: any) {
    this.pagos_realizadosSeleccionadaDocs = this.pagos_realizadosSeleccionadaDocs === data ? null : data;
  }

  viewDocumentoLink(url: any) { window.open(url, '_blank'); }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
