import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fnzs_op_catalogo_pendientes',
  standalone: false,
  templateUrl: './op-catalogo-pendientes.html',
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
    './op-catalogo-pendientes.css',
  ]
})
export class OpCatalogoPendientes implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  searchPagoPendientes: any = [];
  ordenes_pago_lista_pendientes: any = [];
  indicadorOrdPend:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoPendOrd: Date[] | undefined;

  public factura_relacionada_token:string = '';
  public factura_relacionada_typo:string = '';
  private destruir$ = new Subject<void>();

  constructor(
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
    this.getRespuestaAcreedoresMovimientos();
    this.getRespuestaDeudoresMovimientos();
    this.searchPagoPendientes = ['id', 'token_ordenPago', 'folio_ordenPago', 'fecha_contabilizacion_doc_anterior', 'fecha_contabilizacion_orden_pago', 'fecha_registro', 'orden_bloqueada', 'autorizacion_pay', 'fecha_autorizacion_pay',
      'factura_relacionada_typo', 'factura_relacionada_token', 'factura_relacionada_string', 'orden_emisor_emp', 'orden_emisor_personal_token', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'importe_total_inicial_simple', 'orden_moneda_inicial_name', 'importe_total_inicial', 'importe_autorizado_inicial_simple', 'orden_moneda_inicial_autorizada_tkn',
      'orden_moneda_inicial_autorizada_name', 'importe_autorizado_inicial_format', 'importe_autorizado_final_simple', 'importe_autorizado_final', 'orden_moneda_final_autorizada_name', 'importe_restante', 'importe_restante_format',
      'importe_por_pagar', 'debe_simple', 'debe_format', 'pago_anticipado', 'status_pago', 'status_pago_date', 'empresa', 'comprador', 'open_inside', 'detail_orden', 'autorizacion_proceso', 'lista_pagos_realizados'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdPagoSeccionModule$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_op_pendientes") {
          console.log(mensaje);
          if (this.ordenes_pago_lista_pendientes.length === 0) this.lista_ordenes_pago_pendientes();
        }
      }
    );
  }

  getRespuestaOrdAuthChange() {
    this.relInterna.mensajeOrdAuthChange$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "orden_modificada_main_auth") {
          this.lista_ordenes_pago_pendientes();
        }
      }
    );
  }

  getRespuestaAcreedoresMovimientos() {
    this.relInterna.mensajeAcreedorMovRegistrado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "acr_mov_registrado") {
          this.lista_ordenes_pago_pendientes();
        }
      }
    );
  }

  getRespuestaDeudoresMovimientos() {
    this.relInterna.mensajeDeudorMovRegistrado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "deu_mov_registrado") {
          this.lista_ordenes_pago_pendientes();
        }
      }
    );
  }

  lista_ordenes_pago_pendientes() {
    this.ver_ordenes_pago_pendientes(this.indicadorOrdPend);
  }

  ver_ordenes_pago_pendientes(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorOrdPend = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var pag_pend_otras_fechas = document.getElementById("pag_pend_otras_fechas");
      if (this.rangoPeriodoPendOrd && this.rangoPeriodoPendOrd[1]) {
        const dateInicio = this.rangoPeriodoPendOrd[0];
        const dateFin = this.rangoPeriodoPendOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(pag_pend_otras_fechas);
          } else {
            this.validator.errorInputRow(pag_pend_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(pag_pend_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(pag_pend_otras_fechas);
      }
    }

    this.ordenPago.listaordenespagopendientes(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaPendientes(response),
      error: (err) => this.manejarErrorPendientes(err)
    });
  }

  private procesarRespuestaPendientes(response: any) {
    if (response.status === 'success') {
      this.ordenes_pago_lista_pendientes = response.ordenes.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      this.cd.detectChanges();
    } else {
      this.ordenes_pago_lista_pendientes = [];
    }
  }

  private manejarErrorPendientes(error: any) {
    console.error('Error al cargar ordenes de pago pendientes:', error);
    this.ordenes_pago_lista_pendientes = [];
  }

  descarga_excel_lpend() {
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "folio_ordenPago", rowspan: 2, align: "center" },
      { label: this.translate.instant("fecha_cont_pay_order"), field: "fecha_contabilizacion_orden_pago", rowspan: 2, align: "center" },
      { label: this.translate.instant("doc_ant"), field: "factura_relacionada_string", rowspan: 2, align: "left" },
      { label: this.translate.instant("fecha_cont_doc_ant"), field: "fecha_contabilizacion_doc_anterior", rowspan: 2, align: "center" },
      {
        label: this.translate.instant("ter_cero"), colspan: 3, align: "center", children: [
          { label: "folio", field: "orden_emisor_personal_folio", align: "left" },
          { label: this.translate.instant("name"), field: "orden_emisor_personal_nombre", align: "left" },
          { label: this.translate.instant("comercial_name"), field: "orden_emisor_personal_nombre_comercial", align: "left" },
        ]
      },
      { label: this.translate.instant("company_name"), field: "orden_emisor_emp", rowspan: 2, align: "left" },
      { label: this.translate.instant("prepayment"), field: "pago_anticipado", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund"), field: "importe_total_inicial", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth"), field: "importe_autorizado_inicial_format", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth_converse"), field: "importe_autorizado_final", rowspan: 2, align: "right" },
      { label: "DEBE", field: "debe_format", rowspan: 2, align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(this.ordenes_pago_lista_pendientes, columnas, 'Ordenes de pago', 'orden_pago_lista_pendientes.xlsx');
  }

  seleccionMasivaAuth(token_ordenPago: any, event: any) {
    let order = this.ordenes_pago_lista_pendientes.find((row: any) => row.token_ordenPago === token_ordenPago);
    order.autorizacion_proceso = event.checked;
  }

  get validacionMasivaAuth(): Boolean {
    let order = this.ordenes_pago_lista_pendientes.filter((row: any) => row.autorizacion_proceso === true);
    const validacion = order.length > 0;
    return validacion;
  }

  autorizar_orden_pago(pago_ord_item: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (!pago_ord_item.status_pago) {
          this.ordenPago.autorizar_ordenpago(pago_ord_item.token_ordenPago).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                //this.lista_ordenes_pago_pendientes();
                this.relInterna.mensajeOrdAuthChange("orden_modificada_pend_auth");
                this.recarga_orden_pago(pago_ord_item);
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

  recarga_orden_pago(pago_ord_item:any) {
    console.log(pago_ord_item);

    this.ordenes_pago_lista_pendientes = this.ordenes_pago_lista_pendientes.filter(
      (row: any) => row.token_ordenPago !== pago_ord_item.token_ordenPago
    );
  }

  autorizacion_masiva_orden_pago() {
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
        let order = this.ordenes_pago_lista_pendientes.filter((row: any) => row.autorizacion_proceso === true);
        this.ordenPago.autorizar_ordenespago(order).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              //$("#tabla_order_pago_list_general").DataTable().clear().destroy();
              //this.lista_ordenes_pago_general();
              //this.lista_ordenes_pago_pendientes();
              //this.lista_ordenes_pago_liberadas();
              //this.lista_ordenes_pago_concluidas();
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
      }
    })
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "pago_orden_general_realizado") {
          this.lista_ordenes_pago_pendientes();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }
}
