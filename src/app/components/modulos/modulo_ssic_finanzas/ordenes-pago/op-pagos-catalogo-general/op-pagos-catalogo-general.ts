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
  selector: 'fnzs_op_pagos_catalogo_general',
  standalone: false,
  templateUrl: './op-pagos-catalogo-general.html',
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
    './op-pagos-catalogo-general.css',
  ]
})
export class OpPagosCatalogoGeneral implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  search_pagos_done: any = [];
  list_pagos_done: any = [];
  indicadorOrdPagos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoPagosOrd: Date[] | undefined;
  public pago_desglose_view:boolean = false;
  pago_desglose_info: any = [];

  public pago_window_cancelacion:boolean = false;
  public viewNewCancelacionForm:boolean = false;
  public cancelacion_pago_token: string = "";
  public cancelacion_pago_folio: string = "";
  public cancelacion_fecha_contabilizacion: string = "";
  public cancelacion_observaciones: string = "";
  private destruir$ = new Subject<void>();

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
    this.search_pagos_done = ['token_pagos', 'folio_pagos', 'fecha_contabilizacion', 'pago_cancelado', 'pago_folio_cancelacion', 'pago_fecha_cancelacion', 'pago_fecha_contabilizacion_cancelacion', 'monto_pago',
      'monto_pago_format', 'monto_pago_resultant', 'observacionesPago', 'tipo_cambio', 'tipo_cambio_format', 'p_moneda', 'forma_pago_pago', 'forma_metodo_pago_cfdi', 'tercero_token', 'tercero_folio', 'tercero_name',
      'tercero_comercial_name', 'financeadoa_token', 'financeadoa_folio', 'financeadoa_name', 'financeadoa_comercial_name', 'concepto', 'personal_pago_token', 'personal_pago_folio', 'personal_pago_name', 'pago_autorizado',
      'fecha_pago_auth', 'personal_autoriza_token', 'personal_autoriza_folio', 'personal_autoriza_name', 'ordenes_relacionadas_lista', 'orden_factura_relacionada_typo', 'orden_factura_relacionada_token',
      'orden_factura_relacionada_string', 'desglose_pagos_medio', 'medio_pago_vinculado', 'doc_anterior_folio', 'doc_anterior_fecha_contabilizacion'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdPagoSeccionModule$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_op_pagos_done") {
          console.log(mensaje);
          if (this.list_pagos_done.length === 0) this.lista_pagos_realizados('hoy');
        }
      }
    );
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "pago_orden_general_realizado") {
          this.ver_pagos_realizados();
        }
      }
    );
  }

  ver_pagos_realizados() {
    this.lista_pagos_realizados(this.indicadorOrdPagos);
  }

  lista_pagos_realizados(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorOrdPagos = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    
    if (filtro == 'otras_fechas') {
      var pag_done_otras_fechas = document.getElementById("pag_done_otras_fechas");
      if (this.rangoPeriodoPagosOrd && this.rangoPeriodoPagosOrd[1]) {
        const dateInicio = this.rangoPeriodoPagosOrd[0];
        const dateFin = this.rangoPeriodoPagosOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(pag_done_otras_fechas);
          } else {
            this.validator.errorInputRow(pag_done_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(pag_done_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(pag_done_otras_fechas);
      }
    }
    
    this.ordenPago.listaPagosRealizados(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaPagos(response),
      error: (err) => this.manejarErrorPagos(err)
    });
  }

  private procesarRespuestaPagos(response: any) {
    if (response.status === 'success') {
      this.list_pagos_done = response.lista_pagos;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.list_pagos_done = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorPagos(error: any) {
    console.error('Error al cargar pagos realizados:', error);
    this.list_pagos_done = [];
  }

  descarga_excel_pagos() {
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "folio_pagos", rowspan: 2, align: "center" },
      { label: this.translate.instant("fecha_cont"), field: "fecha_contabilizacion", rowspan: 2, align: "center" },

      {
        label: this.translate.instant("doc_ant"), colspan: 2, align: "center", children: [
          { label: "folio", field: "doc_anterior_folio", align: "center" },
          { label: this.translate.instant("fecha_cont"), field: "doc_anterior_fecha_contabilizacion", align: "center" },
        ]
      },

      {
        label: "status", colspan: 3, align: "center", children: [
          { label: "status", field: "pago_cancelado_translate", align: "center", translate: true },
          { label: "folio", field: "pago_folio_cancelacion", align: "center" },
          { label: this.translate.instant("fecha_cont"), field: "pago_fecha_contabilizacion_cancelacion", align: "center" },
        ]
      },

      {
        label: this.translate.instant("ter_cero"), colspan: 3, align: "center", children: [
          { label: "folio", field: "tercero_folio", align: "left" },
          { label: this.translate.instant("name"), field: "tercero_name", align: "left" },
          { label: this.translate.instant("comercial_name"), field: "tercero_comercial_name", align: "left" },
        ]
      },

      {
        label: "financeado a", colspan: 3, align: "center", children: [
          { label: "folio", field: "financeadoa_folio", align: "left" },
          { label: this.translate.instant("name"), field: "financeadoa_name", align: "left" },
          { label: this.translate.instant("comercial_name"), field: "financeadoa_comercial_name", align: "left" },
        ]
      },

      { label: this.translate.instant("f_pago"), field: "medio_pago_vinculado", rowspan: 2, align: "left" },
      { label: this.translate.instant("f_m_pago_cfdi"), field: "forma_metodo_pago_cfdi", rowspan: 2, align: "center" },
      { label: "medio de pago por anticipos", field: "forma_metodo_pago_anticipos", rowspan: 2, align: "center" },
      { label: this.translate.instant("observ"), field: "observacionesPago", rowspan: 2, align: "right" },
      { label: this.translate.instant("currency"), field: "p_moneda", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_import"), field: "monto_pago_format", rowspan: 2, align: "right" },
      { label: this.translate.instant("mon_tipo_cambio"), field: "tipo_cambio_format", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_import_resultant"), field: "monto_pago_resultant", rowspan: 2, align: "right" },
    ];
    this.servXlsx.descarga_xlsx_documento(this.list_pagos_done, columnas, 'pagos realizados', 'pagos realizados.xlsx');
  }

  pagos_realizados_desglose(token_pagos: any) {
    this.pago_desglose_view = false;
    this.ordenPago.desglosePagoRealizado(token_pagos).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.pago_desglose_info = response.pagos_realizados;
          this.pago_desglose_view = true;
        }
        if (response.status == 'error') {
          let translate_response = this.translate.instant(response.message);
          this.pago_desglose_view = false;
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: translate_response,
            showConfirmButton: false,
            timer: 3000
          })
        }
      },
      error => { console.log(error); }
    );
  }

  pago_realizado_openform_cancelacion(payDone: any) {
    this.pago_window_cancelacion = true;
    this.cancelacion_pago_token = payDone.token_pagos;
    this.cancelacion_pago_folio = payDone.folio_pagos;
    this.limpia_form_cancelacion();
  }

  limpia_form_cancelacion() {
    this.viewNewCancelacionForm = true;
    this.cancelacion_fecha_contabilizacion = "";
    this.cancelacion_observaciones = "";
  }

  cancel_fecha_contabilizacion(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.cancelacion_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cancelacion_fecha_contabilizacion);
  }

  keyupObservacionCancelacion(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cancelacion_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaRegistroCancelacionPago():Boolean{
    const OKFechaCont = this.cancelacion_fecha_contabilizacion != "" && this.validator.filtroFecha(this.cancelacion_fecha_contabilizacion);
    const OKObservaciones = this.cancelacion_observaciones != '' && this.validator.filtroAlfaNumerico(this.cancelacion_observaciones);
    return this.cancelacion_pago_token != '' && OKFechaCont && OKObservaciones;
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

  pagos_realizados_solicitar_cancelacion(form: { reset: () => void; }):void{
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
        this.viewNewCancelacionForm = false;
        this.ordenPago.pagoRealizadoSolicitarCancelacion(this.cancelacion_pago_token,this.cancelacion_fecha_contabilizacion,this.cancelacion_observaciones).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              form.reset();
              this.pago_window_cancelacion = false;
              this.limpia_form_cancelacion();
              this.ver_pagos_realizados();
              this.relInterna.mensajeFNZSSoliCancelacion("seccion_fnzs_soli_cancelacion");
            }
            if (response.status == 'error') {
              this.pago_desglose_view = false;
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          error => { console.log(error); }
        );
      }
    });
  }
}
