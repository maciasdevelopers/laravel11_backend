import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { Subject } from 'rxjs';

@Component({
  selector: 'fnzs_op_pagos_cancelaciones',
  standalone: false,
  templateUrl: './cancelacion_lista_solicitudes.html',
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
    './cancelacion_lista_solicitudes.css',
  ]
})
export class FinanzasSolicitudesDeCancelacion implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  solicitudes_cancelacion: any = [];
  indicadorSoliCancel:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoSoliCancel: Date[] | undefined;

  dataSolicitudCancelacion:any = [];
  windowSoliCancelacionPagoInfo:boolean = false;
  windowSoliCancelacionOrdenPagoInfo:boolean = false;
  windowSoliCancelacionReembolsoInfo:boolean = false;
  windowSoliCancelacionMCPInfo:boolean = false;
  windowSoliCancelacionPagoDispersionInfo:boolean = false;
  windowSoliCancelacionOrdenDispersionEfectivoInfo:boolean = false;
  windowSoliCancelacionOrdenDispersionEspecieInfo:boolean = false;
  windowSoliCancelacionAnticipoInfo:boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private ordenPago: OrdenPagoService,
    private ordenDisper: NominaDispersionService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private servXlsx: DescargaExcel,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaSolicitudesCancelacion();
    this.getRespuestaCancelRealizada();
  }

  getRespuestaSolicitudesCancelacion() {
    this.relInterna.mensajeFNZSSoliCancelacion$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_fnzs_soli_cancelacion") {
          console.log(mensaje);
          if (this.solicitudes_cancelacion.length === 0) this.ver_solicitudes_cancelacion('hoy');
        }
      }
    );
  }

  lista_solicitudes_cancelacion() {
    this.ver_solicitudes_cancelacion(this.indicadorSoliCancel);
  }

  ver_solicitudes_cancelacion(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorSoliCancel = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var pag_cancelaciones_otras_fechas = document.getElementById("pag_cancelaciones_otras_fechas");
      if (this.rangoPeriodoSoliCancel && this.rangoPeriodoSoliCancel.length === 2) {
        const dateInicio = this.rangoPeriodoSoliCancel[0];
        const dateFin = this.rangoPeriodoSoliCancel[1];
        if (dateInicio && dateFin) {
          const validacionInicio = dateInicio && this.validator.filtroFecha(periodo_inicio);
          const validacionFin = dateFin && this.validator.filtroFecha(periodo_fin);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(pag_cancelaciones_otras_fechas);
          } else {
            this.validator.errorInputRow(pag_cancelaciones_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(pag_cancelaciones_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(pag_cancelaciones_otras_fechas);
      }
    }

    this.ordenPago.listando_solicitudes_cancelacion(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaSoliCan(response),
      error: (err) => this.manejarErrorSoliCan(err)
    });
  }

  private procesarRespuestaSoliCan(response: any) {
    if (response.status === 'success') {
      this.solicitudes_cancelacion = response.solicitudes;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.solicitudes_cancelacion = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorSoliCan(error: any) {
    console.error('Error al cargar la lista solicitudes de cancelación:', error);
    this.solicitudes_cancelacion = [];
  }

  detalle_solicitud_de_cancelacion(canc: any) {
    this.dataSolicitudCancelacion = canc;
    switch (canc.tipo_solicitud) {
      case 'PAGO':
        this.windowSoliCancelacionPagoInfo = true;
        break;
      case 'PAGO-NOMINA':
        this.windowSoliCancelacionPagoDispersionInfo = true;
        break;
      case 'ORDEN DE PAGO':
        this.windowSoliCancelacionOrdenPagoInfo = true;
        break;
      case 'ORDEN DE DISPERSION DE NOMINA EN EFECTIVO':
        this.windowSoliCancelacionOrdenDispersionEfectivoInfo = true;
        break;
      case 'ORDEN DE DISPERSION DE NOMINA EN ESPECIE':
        this.windowSoliCancelacionOrdenDispersionEspecieInfo = true;
        break;
      case 'REEMBOLSO':
        this.windowSoliCancelacionReembolsoInfo = true;
        break;
      case 'CUENTAS PROPIAS':
        this.windowSoliCancelacionMCPInfo = true;
        break;
      case 'ANTICIPO':
        this.windowSoliCancelacionAnticipoInfo = true;
        break;
    
      default:
        break;
    }
  }

  getRespuestaCancelRealizada() {
    this.relInterna.mensajeFNZSSoliCancelacion$.subscribe(
      (mensaje: any) => {
        if (mensaje == "cancelacion_realizada") {
          const cancel_soli_token = this.dataSolicitudCancelacion.cancel_soli_token;
          this.ordenPago.actualiza_solicitud_de_cancelacion(cancel_soli_token).subscribe(
            response => {
              if (response.status == 'success') {
                const solicitud = this.solicitudes_cancelacion.find((soli_l:any) => soli_l.cancel_soli_token === cancel_soli_token);
                solicitud.doc_anterior_token = response.doc_anterior_token;
                solicitud.doc_anterior_folio = response.doc_anterior_folio;
                solicitud.soli_reem_token = response.soli_reem_token;
                solicitud.soli_reem_folio = response.soli_reem_folio;
                solicitud.compras_token = response.compras_token;
                solicitud.compras_folio = response.compras_folio;
                solicitud.fecha_contabilizacion = response.fecha_contabilizacion;
                solicitud.fecha_contabilizacion_date = response.fecha_contabilizacion_date;
                solicitud.fecha_contabilizacion_gmdate = response.fecha_contabilizacion_gmdate;
                solicitud.cancel_soli_observaciones = response.cancel_soli_observaciones;
                solicitud.cancel_soli_cancel_realizada = response.cancel_soli_cancel_realizada;
                solicitud.comentarios_confirma_cancelacion = response.comentarios_confirma_cancelacion;
                solicitud.f_contab_confirma_cancelacion = response.f_contab_confirma_cancelacion;

                if (this.windowSoliCancelacionPagoInfo) this.windowSoliCancelacionPagoInfo = false;
                if (this.windowSoliCancelacionPagoDispersionInfo) this.windowSoliCancelacionPagoDispersionInfo = false;
                if (this.windowSoliCancelacionOrdenPagoInfo) this.windowSoliCancelacionOrdenPagoInfo = false;
                if (this.windowSoliCancelacionOrdenDispersionEfectivoInfo) this.windowSoliCancelacionOrdenDispersionEfectivoInfo = false;
                if (this.windowSoliCancelacionOrdenDispersionEspecieInfo) this.windowSoliCancelacionOrdenDispersionEspecieInfo = false;
                if (this.windowSoliCancelacionReembolsoInfo) this.windowSoliCancelacionReembolsoInfo = false;
                if (this.windowSoliCancelacionMCPInfo) this.windowSoliCancelacionMCPInfo = false;
                if (this.windowSoliCancelacionAnticipoInfo) this.windowSoliCancelacionAnticipoInfo = false;
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    );
  }

  //toggleCancelPagos(row: any) {
  //  const isExpanded = !!this.expandedCancelacionPagos[row.folio_pagos];
  //  this.expandedCancelacionPagos = {};
  //  if (!isExpanded) {
  //    this.expandedCancelacionPagos[row.folio_pagos] = true;
  //  }
  //}

  //rExpandCancelPagos(row: any): boolean {
  //  return !!this.expandedCancelacionPagos[row.folio_pagos];
  //}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
