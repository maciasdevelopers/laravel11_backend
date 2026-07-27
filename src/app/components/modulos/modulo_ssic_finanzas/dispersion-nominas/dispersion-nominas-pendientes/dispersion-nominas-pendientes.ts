import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { Subject, takeUntil } from 'rxjs';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fnzs_dispersion_nominas_pendientes',
  standalone: false,
  templateUrl: './dispersion-nominas-pendientes.html',
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
    './dispersion-nominas-pendientes.css',
  ]
})
export class DispersionNominasPendientes implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;

  searchPagoPendientes: any = [];
  ordenes_disper_pendientes: any = [];
  indicadorDisperNomOrdPend:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoNomPendOrd: Date[] | undefined;

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
    private cd: ChangeDetectorRef, 
    private primeAlerts: MessageService
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaOrdSeccionModule();
    this.getRespuestaOrdAuthChange();
    this.searchPagoPendientes = ['id', 'token_ordenPago', 'folio_ordenPago', 'fecha_contabilizacion_doc_anterior', 'fecha_contabilizacion_orden_pago', 'fecha_registro', 'orden_bloqueada', 'autorizacion_pay', 'fecha_autorizacion_pay',
      'factura_relacionada_typo', 'factura_relacionada_token', 'factura_relacionada_string', 'orden_emisor_emp', 'orden_emisor_personal_token', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'importe_total_inicial_simple', 'orden_moneda_inicial_name', 'importe_total_inicial', 'importe_autorizado_inicial_simple', 'orden_moneda_inicial_autorizada_tkn',
      'orden_moneda_inicial_autorizada_name', 'importe_autorizado_inicial_format', 'importe_autorizado_final_simple', 'importe_autorizado_final', 'orden_moneda_final_autorizada_name', 'importe_restante', 'importe_restante_format',
      'importe_por_pagar', 'debe_simple', 'debe_format', 'pago_anticipado', 'status_pago', 'status_pago_date', 'empresa', 'comprador', 'open_inside', 'detail_orden', 'autorizacion_proceso', 'lista_pagos_realizados'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdDisperSeccionModule$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_orden_disper_pendientes") {
          console.log(mensaje);
          if (this.ordenes_disper_pendientes.length === 0) this.lista_dispersion_pend('hoy');
        }
      }
    );
  }

  getRespuestaOrdAuthChange() {
    this.relInterna.mensajeOrdAuthChange$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "orden_dispersion_modificada_main_auth") {
          this.recargar_lista_dispersion_pend();
        }
      }
    );
  }

  getRespuestaAcreedoresMovimientos() {
    this.relInterna.mensajeVHNominaRegistro$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "nomina_registrada") {
          this.recargar_lista_dispersion_pend();
        }
      }
    );
  }

  recargar_lista_dispersion_pend() {
    this.lista_dispersion_pend(this.indicadorDisperNomOrdPend);
  }

  lista_dispersion_pend(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDisperNomOrdPend = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var disper_pend_otras_fechas = document.getElementById("disper_pend_otras_fechas");
      if (this.rangoPeriodoNomPendOrd && this.rangoPeriodoNomPendOrd.length === 2) {
        const dateInicio = this.rangoPeriodoNomPendOrd[0];
        const dateFin = this.rangoPeriodoNomPendOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(disper_pend_otras_fechas);
          } else {
            this.validator.errorInputRow(disper_pend_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(disper_pend_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(disper_pend_otras_fechas);
        return;
      }
    }

    this.ordenDisper.lista_pendientes_ordenes_dispersion(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaDispersionPend(response),
      error: (err) => this.manejarErrorDispersionPend(err)
    });
  }
  
  private procesarRespuestaDispersionPend(response: any) {
    if (response.status === 'success') {
      this.ordenes_disper_pendientes = response.ordenes;//.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      this.cd.detectChanges();
    } else {
      this.ordenes_disper_pendientes = [];
    }
  }

  private manejarErrorDispersionPend(error: any) {
    console.error('Error al cargar la lista de ordenes de dispersión de nómina pendientes:', error);
    this.ordenes_disper_pendientes = [];
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }

  auth_rechaz_ord_pago(token_ordenPago: any) {
    const ordp = this.ordenes_disper_pendientes.find((ordp: any) => ordp.token_ordenPago === token_ordenPago);
    const class_disabled = ordp.orden_bloqueada || ordp.status_pago ? 'disabled' : '';
    return !ordp.autorizacion_pay ? class_disabled + ' text-bg-success' : class_disabled + ' text-bg-danger';
  }

  autorizar_orden_pago(disp_ord_item: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (!disp_ord_item.status_pago) {
          this.ordenPago.autorizar_ordenpago(disp_ord_item.token_ordenPago).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                //this.recargar_lista_gral_dispersion();
                //this.recargar_lista_dispersion_pend();
                this.relInterna.mensajeOrdAuthChange("orden_dispersion_modificada_pend_auth");
                this.recarga_orden_pago(disp_ord_item);
                //this.recargar_lista_dispersion_liberadas();
                //this.recargar_lista_dispersion_concluidas();
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
              if (response.status == 'error') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          );
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "orden de pago concluida",
            showConfirmButton: false,
            timer: 3000
          })
        }
      }
    })
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "dispersion_nomina_realizada") {
          this.recargar_lista_dispersion_pend();
        }
      }
    );
  }

  recarga_orden_pago(disp_ord_item:any) {
    console.log(disp_ord_item);

    this.ordenes_disper_pendientes = this.ordenes_disper_pendientes.filter(
      (row: any) => row.token_ordenPago !== disp_ord_item.token_ordenPago
    );
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
