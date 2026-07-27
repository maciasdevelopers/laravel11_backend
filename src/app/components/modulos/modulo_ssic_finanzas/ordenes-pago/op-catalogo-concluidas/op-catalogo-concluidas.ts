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

@Component({
  selector: 'fnzs_op_catalogo_concluidas',
  standalone: false,
  templateUrl: './op-catalogo-concluidas.html',
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
    './op-catalogo-concluidas.css',
  ]
})
export class OpCatalogoConcluidas implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  searchPagoConcluidas: any = [];
  ordenes_pago_concluidas_lista: any = [];
  indicadorOrdConc:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoConcOrd: Date[] | undefined;
  pagos_realizados_array: any = [];
  public pagos_realizados_view:boolean = false;
  pagos_realizadosSeleccionadaDocs: string = "";
  pagos_realizados_anexos: any = [];
  private destruir$ = new Subject<void>();

  public factura_relacionada_token:string = '';
  public factura_relacionada_typo:string = '';

  constructor(
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
    this.relInterna.mensajeOrdPagoSeccionModule$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_op_concluidas") {
          console.log(mensaje);
          if (this.ordenes_pago_concluidas_lista.length === 0) this.ver_ordenes_pago_concluidas('hoy');
        }
      }
    );
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "pago_orden_general_realizado") {
          this.lista_ordenes_pago_concluidas();
        }
      }
    );
  }

  //lista_ordenes_pago_concluidas
  lista_ordenes_pago_concluidas() {
    this.ver_ordenes_pago_concluidas(this.indicadorOrdConc);
  }

  ver_ordenes_pago_concluidas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorOrdConc = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var ord_conc_otras_fechas = document.getElementById("ord_conc_otras_fechas");
      if (this.rangoPeriodoConcOrd && this.rangoPeriodoConcOrd[1]) {
        const dateInicio = this.rangoPeriodoConcOrd[0];
        const dateFin = this.rangoPeriodoConcOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(ord_conc_otras_fechas);
          } else {
            this.validator.errorInputRow(ord_conc_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(ord_conc_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(ord_conc_otras_fechas);
      }
    }

    this.ordenPago.listaordenespagoconcluidas(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaConcluidas(response),
      error: (err) => this.manejarErrorConcluidas(err)
    });
  }

  private procesarRespuestaConcluidas(response: any) {
    if (response.status === 'success') {
      this.ordenes_pago_concluidas_lista = response.ordenes.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      this.cd.detectChanges();
    } else {
      this.ordenes_pago_concluidas_lista = [];
    }
  }

  private manejarErrorConcluidas(error: any) {
    console.error('Error al cargar ordenes de pago concluidas:', error);
    this.ordenes_pago_concluidas_lista = [];
  }

  descarga_excel_lconc() {
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
      { label: this.translate.instant("autho_riza"), field: "autorizacion_pay_translate", rowspan: 2, align: "center", translate: true },
      { label: this.translate.instant("date_autho_riza"), field: "fecha_autorizacion_pay", rowspan: 2, align: "center" },
      { label: this.translate.instant("total_refund"), field: "importe_total_inicial", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth"), field: "importe_autorizado_inicial_format", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth_converse"), field: "importe_autorizado_final", rowspan: 2, align: "right" },
      { label: "DEBE", field: "debe_format", rowspan: 2, align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(this.ordenes_pago_concluidas_lista, columnas, 'Ordenes de pago', 'orden_pago_lista_concluidas.xlsx');
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }

  orden_pago_pagos_realizados(token_pagos: any) {
    this.pagos_realizados_view = false;
    this.ordenPago.desglosePagoRealizado(token_pagos).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.pagos_realizados_array = response.pagos_realizados;
          this.pagos_realizados_view = true;
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

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
