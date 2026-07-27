import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import { SessionContextService } from '../../../../../servicios/session-context';

@Component({
  selector: 'sos_finanzas_ordenes_de_pago_liberadas',
  standalone: false,
  templateUrl: './op-liberadas.html',
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
    './op-liberadas.css',
  ]
})
export class OpLiberadas implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  
  searchPagoLiberadas: any = [];
  searchPagolistaProceso: any = [];
  ordenes_pago_lista_liberadas: any = [];
  indicadorOrdLib:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoNomLibOrd: Date[] | undefined;
  
  public orden_pago_nomina_efectivo_ver: boolean = false;
  orden_pago_nomina_op_token: string = "";
  orden_pago_nomina_periodo_token: string = "";
  public orden_pago_nomina_especie_ver: boolean = false;
  orden_pago_nomina_especie_token: string = "";
  public orden_pago_simple_ver: boolean = false;
  public orden_pago_masivo_ver: boolean = false;
  orden_pago_general_token: string = "";
  ordenes_pago_listaProceso: any = [];

  public factura_relacionada_token:string = '';
  public factura_relacionada_typo:string = '';

  private destruir$ = new Subject<void>();

  ////anticipos proveedor  
  //ordenes_pago_anticipo_total: number = 0;
  //search_prv_saldos_a_favor: any = [];
  //public aplica_anticipo_a_proveedor: string = "No";
  //proveedorAnticipos: any = [];
  //proveedorAnticipoTotal: number = 0;
  //proveedorAnticipoTotalFormat: string = "";
  //proveedorAnticipoaplicado: number = 0;
  //proveedorAnticipoRestanteFormat: string = "";

  ////lista cajas registradas
  //search_cajas_registradas: any = [];
  //listaCajasRegistradas: any = [];
  ////lista cuentas bancarias
  //search_cuentas_bancarias: any = [];
  //listaCuentasBancarias: any = [];
  ////monederos
  //search_cuentas_monedero_electronico: any = [];
  //listaCuentasMonederoElectronico: any = [];
  ////monedas
  //catalogo_monedas_api: any = [];
  //monedas_acree_pago = null;
  //public emp_moneda_code: string = "";
  //public emp_moneda_decimales: string = "";
  //public pay_order_moneda_code: string = "";
  //public pay_order_moneda_decimales: number = 0;


  ////toggle rows
  //expandedRowsOrdenesLib: { [s: string]: boolean } = {};
  ////pago masivo
  //pay_order_moneda_opcion = null;
  //ordenes_pago_listaProceso_prv_saldos_a_favor: any = [];
  //public pay_order_fecha_contabilizacion: string = "";
  //public pay_order_importe: number = 0;
  //public pay_importe: number = 0;
  //public pay_order_tipo_cambio: number = 1.00;
  //public pay_order_forma_pago: string = "";
  //public pay_order_observacion: string = "";
  //public ordPayAnexosNames: any = [];
  //public docsOrdPayAnexos: any[] = [];
  //public filespayOrder: NgxFileDropEntry[] = [];

  ////old data
  //public orden_pago_simple_form: boolean = false;
  //ordenes_pago_listaProceso_prv_token: string = "";
  //ordenes_pago_listaProceso_prv_name: string = "";

  ////nomina seleccionada 
  //public orden_pago_nomina_efectivo_form: boolean = false;
  //public orden_pago_nomina_especie_form: boolean = false;

  @ViewChild('formAddPagoNuevo') formAddPagoNuevo!: NgForm;
  @ViewChild('formRegistroPagoNominaEF') formRegistroPagoNominaEF!: NgForm;
  @ViewChild('formRegistroPagoESNomina') formRegistroPagoESNomina!: NgForm;

  constructor(
    private ordenPago: OrdenPagoService,
    private _cajServ: CajaServService,
    private cuentaBan: CuentbancService,
    private monedero: MonederoElectService,
    private _monedasServ: MonedasService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private provSer: ProveedoresService,
    private relInterna: ComunicacionInternaService,
    private servXlsx: DescargaExcel,
    private sessionContext: SessionContextService,
    private cd: ChangeDetectorRef) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaAcreedoresMovimientos();
    this.getRespuestaOrdAuthChange();
    this.getRespuestaPagoRealizado();
    this.getRespuestaDeudoresMovimientos();
    this.getRespuestaOrdSeccionModule();
    //this.emp_moneda_code = this.sessionContext.empresa_data?.e_moneda_code;
    //this.emp_moneda_decimales = this.sessionContext.empresa_data?.e_moneda_decimales;
    //console.log(this.emp_moneda_code + " " + this.emp_moneda_decimales);

    this.searchPagoLiberadas = ['id', 'token_ordenPago', 'folio_ordenPago', 'fecha_contabilizacion_doc_anterior', 'fecha_contabilizacion_orden_pago', 'fecha_registro', 'orden_bloqueada', 'autorizacion_pay', 'autorizacion_pay_text',
      'fecha_autorizacion_pay', 'factura_relacionada_typo', 'factura_relacionada_token', 'factura_relacionada_string', 'orden_emisor_emp', 'orden_emisor_personal_token', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'importe_total_inicial_simple', 'orden_moneda_inicial_name', 'importe_total_inicial', 'importe_autorizado_inicial_simple', 'orden_moneda_inicial_autorizada_tkn',
      'orden_moneda_inicial_autorizada_name', 'importe_autorizado_inicial_format', 'importe_autorizado_final_simple', 'importe_autorizado_final', 'orden_moneda_final_autorizada_name', 'importe_restante', 'importe_restante_format',
      'importe_por_pagar', 'debe_simple', 'debe_format', 'pago_anticipado', 'status_pago', 'status_pago_date', 'empresa', 'comprador', 'open_inside', 'detail_orden', 'autorizacion_proceso', 'lista_pagos_realizados'];

    /*this.search_cajas_registradas = ['caja_folio', 'caja_alias', 'establecimiento', 'salDoCaja', 'select_for_pagos', 'token_caja'];
    this.search_cuentas_bancarias = ['select_for_pagos', 'folio_cuenta', 'banco_clave', 'banco_nombre_comercial', 'token_cuenta', 'cuenta_bancaria', 'cuenta_view', 'cuenta_time', 'saldo_cuenta_format'];
    this.search_cuentas_monedero_electronico = ['select_for_pagos', 'token_cuentaMon', 'folio_cuenta', 'monedero', 'cuenta_frontend', 'saldo_cuenta_format'];
    this.search_prv_saldos_a_favor = ['select_for_pagos', 'fecha_de_registro', 'fecha_aplicacion', 'monto_real_format', 'tipo_cambio'];
    this.searchPagolistaProceso = ['id', 'folio_ordenPago', 'orden_emisor_personal_nombre', 'orden_emisor_emp', 'factura_relacionada_string', 'importe_total_inicial', 'importe_autorizado_inicial_format',
      'importe_autorizado_final', 'importe_restante_format'];*/
  }

  getRespuestaAcreedoresMovimientos() {
    this.relInterna.mensajeAcreedorMovRegistrado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "acr_mov_registrado") {
          this.lista_ordenes_pago_liberadas();
        }
      }
    );
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "pago_orden_general_realizado") {
          this.lista_ordenes_pago_liberadas();
        }
      }
    );
  }

  getRespuestaDeudoresMovimientos() {
    this.relInterna.mensajeDeudorMovRegistrado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "deu_mov_registrado") {
          this.lista_ordenes_pago_liberadas();
        }
      }
    );
  }

  getRespuestaOrdAuthChange() {
    this.relInterna.mensajeOrdAuthChange$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "orden_modificada_main_auth" || mensaje == "orden_modificada_pend_auth") {
          this.lista_ordenes_pago_liberadas();
        }
      }
    );
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdPagoSeccionModule$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_op_liberadas") {
          console.log(mensaje);
          if (this.ordenes_pago_lista_liberadas.length === 0) this.ver_ordenes_pago_liberadas('hoy');
        }
      }
    );
  }

  lista_ordenes_pago_liberadas() {
    this.ver_ordenes_pago_liberadas(this.indicadorOrdLib);
  }

  ver_ordenes_pago_liberadas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorOrdLib = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var disper_otras_fechas = document.getElementById("disper_lib_otras_fechas");
      if (this.rangoPeriodoNomLibOrd && this.rangoPeriodoNomLibOrd.length === 2) {
        const dateInicio = this.rangoPeriodoNomLibOrd[0];
        const dateFin = this.rangoPeriodoNomLibOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(disper_otras_fechas);
          } else {
            this.validator.errorInputRow(disper_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(disper_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(disper_otras_fechas);
      }
    }
    
    this.ordenPago.listaordenespagoliberadas(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarResponseOPLib(response),
      error: (err) => this.manejarErrorOPLib(err)
    });
  }

  private procesarResponseOPLib(response: any) {
    if (response.status === 'success') {
      this.ordenes_pago_lista_liberadas = response.ordenes.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      this.cd.detectChanges();
    } else {
      this.ordenes_pago_lista_liberadas = [];
    }
  }

  private manejarErrorOPLib(error: any) {
    console.error('Error al cargar lista de ordenes de pago liberadas:', error);
    this.ordenes_pago_lista_liberadas = [];
  }

  descarga_excel_llib() {
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
      { label: this.translate.instant("prepayment"), field: "pago_anticipado", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund"), field: "importe_total_inicial", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth"), field: "importe_autorizado_inicial_format", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth_converse"), field: "importe_autorizado_final", rowspan: 2, align: "right" },
      { label: "DEBE", field: "debe_format", rowspan: 2, align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(this.ordenes_pago_lista_liberadas, columnas, 'Ordenes de pago', 'orden_pago_lista_aprobadas.xlsx');
  }

  seleccionMasivaPagar(token_ordenPago: any, event: any) {
    let order = this.ordenes_pago_lista_liberadas.find((row: any) => row.token_ordenPago === token_ordenPago);
    order.pago_proceso = event.checked;
  }

  listar_pago_nomina_simple(token_ordenPago: string, token_nominas_periodos: string) {
    this.orden_pago_nomina_efectivo_ver = true;
    this.orden_pago_nomina_op_token = token_ordenPago;
    this.orden_pago_nomina_periodo_token = token_nominas_periodos;
  }

  listar_pago_nomi_na_especie_simple(token_ordenPago: string, token_nominas_especie: string) {
    this.orden_pago_nomina_especie_ver = true;
    this.orden_pago_nomina_op_token = token_ordenPago;
    this.orden_pago_nomina_especie_token = token_nominas_especie;
  }

  listar_pago_orden_simple(token_ordenPago: any) {
    this.orden_pago_simple_ver = true;
    this.orden_pago_general_token = token_ordenPago;
    let order = this.ordenes_pago_lista_liberadas.filter((row: any) => row.token_ordenPago === token_ordenPago);
    this.ordenes_pago_listaProceso = order;
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }

  get validacionMasivaPagar(): Boolean {
    let order = this.ordenes_pago_lista_liberadas.filter((row: any) => row.pago_proceso === true);
    const validacion = order.length > 0;
    return validacion;
  }

  listar_pago_masiva() {
    this.orden_pago_masivo_ver = true;
    let order = this.ordenes_pago_lista_liberadas.filter((row: any) => row.pago_proceso === true);
    this.ordenes_pago_listaProceso = order;
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
