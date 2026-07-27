import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { AcreedoresService } from '../../../../../servicios/acreedores.service';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { DeudoresService } from '../../../../../servicios/deudores.service';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { SessionContextService } from '../../../../../servicios/session-context';

@Component({
  selector: 'app_ordenes_pago_op_acreedores',
  standalone: false,
  templateUrl: './op-acreedores.component.html',
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
    './op-acreedores.component.css',
  ]
})
export class OpAcreedoresComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  public pay_importe: number = 0;

  //cajas
  search_cajas_registradas: any = [];
  listaCajasRegistradas: any = [];
  //cuentas
  search_cuentas_bancarias: any = [];
  listaCuentasBancarias: any = [];
  //monederos
  search_cuentas_monedero_electronico: any = [];
  listaCuentasMonederoElectronico: any = [];

  //monedas
  catalogo_monedas_api: any = [];
  monedas_acree_pago = null;
  pay_order_moneda_opcion = null;
  public pay_order_moneda_code: string = "";
  public pay_order_moneda_decimales: number = 0;
  public emp_moneda_code: string = "";
  public emp_moneda_decimales: string = "";

  //acreedores 
  indicadorAcree:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoAcree: Date[] | undefined;
  list_acreedores_general: any = [];
  acreeDetalleData: any = [];
  public acreeDetalleVer:boolean = false;
  search_acreedor_estado_de_cuenta: any = [];
  search_pagos_acreedor_list: string = "";
  search_acreedor_movimientos_realizados: string = "";
  search_acreedor_lista_for_movimientos: any = [];
  acree_pagos_lista_for_movimientos: any = [];
  public acree_pago_fecha_contabilizacion: string = "";
  public acree_pago_moneda_code: string = "";
  public acree_pago_moneda_decimales: number = 0;
  public acree_pago_tipo_cambio: number = 1.00;
  public acree_pago_forma_pago: string = "";
  public acree_pago_movi_debe_haber: string = "";
  public pay_acr_observacion: string = "";
  public filespayArc: NgxFileDropEntry[] = [];
  public docsArcPayAnexos: any[] = [];
  public arcPayAnexosNames: any = [];
  public pay_acree_importe: number = 0;
  @ViewChild('formAddPagoAcreedor') formAddPagoAcreedor!: NgForm;

  //deudores
  deudorDetalleForCompensacion: any = [];

  constructor(
    private acreedServ: AcreedoresService,
    private relInterna: ComunicacionInternaService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private _cajServ: CajaServService,
    private cuentaBan: CuentbancService,
    private monedero: MonederoElectService,
    private _monedasServ: MonedasService,
    private sessionContext: SessionContextService,
    private deudorServ: DeudoresService,
    private ordenPago: OrdenPagoService,
    private servXlsx: DescargaExcel,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaOrdSeccionModule();
    this.emp_moneda_code = this.sessionContext.empresa_data?.e_moneda_code;
    this.emp_moneda_decimales = this.sessionContext.empresa_data?.e_moneda_decimales;
    this.getRespuestaAcreedores();
    this.getRespuestaAnticipos();
    this.search_acreedor_estado_de_cuenta = [
      'tipo_registro_e_cuenta', 
      'folio_e_cuenta', 
      'cancelacion_doc_anterior', 
      'fecha_contabilizacion',
      'tipo_cambio_movimiento', 
      'forma_pago_vinculada', 
      'forma_pago_cfdi', 
      'metodo_pago_cfdi',
      'f_m_pago_cfdi',
      'observacionesPago',
      'pago_moneda',
      'monto_pago', 
      'estado_cuenta_debe_format', 
      'estado_cuenta_haber_format',
      'estado_cuenta_saldo_format'
    ];
    this.search_cajas_registradas = ['caja_folio', 'caja_alias', 'establecimiento', 'salDoCaja', 'select_for_pagos', 'token_caja'];
    this.search_cuentas_bancarias = ['select_for_pagos', 'folio_cuenta', 'banco_clave', 'banco_nombre_comercial', 'token_cuenta', 'cuenta_bancaria', 'cuenta_view', 'cuenta_time', 'saldo_cuenta_format'];
    this.search_cuentas_monedero_electronico = ['select_for_pagos', 'token_cuentaMon', 'folio_cuenta', 'monedero', 'cuenta_frontend', 'saldo_cuenta_format'];
    this.search_acreedor_lista_for_movimientos = ['folio_pagos', 'fecha_contabilizacion', 'doc_anterior_folio', 'doc_anterior_fecha_contabilizacion', 'forma_pago_vinculada', 'forma_pago_cfdi',
      'metodo_pago_cfdi', 'monto_pago', 'tipo_cambio', 'observacionesPago', 'token_pagos', 'debe_format'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdPagoSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_op_acreedores") {
          console.log(mensaje);
          if (this.list_acreedores_general.length === 0) this.catalogo_acreedores('hoy');
        }
      }
    );
  }

  getRespuestaAnticipos() {
    this.relInterna.mensajeAnticipoDeudorInsert$.subscribe(
      (mensaje: any) => {
        if (mensaje == "anticipo_autorizado") {
          this.lista_acreedores();
        }
      }
    );
  }

  getRespuestaAcreedores() {
    this.relInterna.mensajeListaAcreedores$.subscribe(
      (mensaje: any) => {
        console.log(mensaje)
        if (mensaje == "listar_acreedores") {
          this.lista_acreedores();
        }
      }
    );
  }

  lista_acreedores() {
    this.catalogo_acreedores(this.indicadorAcree);
  }

  catalogo_acreedores(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorAcree = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var acree_gral_otras_fechas = document.getElementById("acree_gral_otras_fechas");
      if (this.rangoPeriodoAcree && this.rangoPeriodoAcree[1]) {
        const dateInicio = this.rangoPeriodoAcree[0];
        const dateFin = this.rangoPeriodoAcree[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(acree_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(acree_gral_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(acree_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(acree_gral_otras_fechas);
      }
    }

    this.acreedServ.catalogoAcreedoresGeneral(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaAcree(response),
      error: (err) => this.manejarErrorAcree(err)
    });
  }

  private procesarRespuestaAcree(response: any) {
    if (response.status === 'success') {
      this.list_acreedores_general = response.acreedores;
      this.cd.detectChanges();
    } else {
      this.list_acreedores_general = [];
    }
  }

  private manejarErrorAcree(error: any) {
    console.error('Error al cargar acreedores:', error);
    this.list_acreedores_general = [];
  }

  showCajasRegistradas() {
    this._cajServ.verListaCajas('all_partidas','','').subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          //this.listaCajasRegistradas = response.caja.filter((caj:any) => caj.saldofloat > 0);
          this.listaCajasRegistradas = response.caja;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getCuentasBancarias() {
    this.cuentaBan.catCuentasBancariasMain('all_partidas','','').subscribe(
      response => {
        if (response.status == 'success') {
          this.listaCuentasBancarias = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  getMonederosElectronicos() {
    this.monedero.catalogoMonederosElect('all_partidas','','').subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.listaCuentasMonederoElectronico = response.monedero;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedas_lista() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  infoAcreeDetalle(token_cat_acreedores: any) {
    this.limpiaAcreedorSeccionPagos();
    this.acreedServ.verDetalleAcreedorPagos(token_cat_acreedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.acreeDetalleData = response.acreedor;
          this.acreeDetalleData.forEach((acr: any) => {
            this.acree_pagos_lista_for_movimientos = acr.pagos_acreedor_list;
          });
          this.acreeDetalleVer = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  data_para_pagos_m_b_m(){
    if (this.listaCajasRegistradas.length === 0) this.showCajasRegistradas();
    if (this.listaCuentasBancarias.length === 0) this.getCuentasBancarias();
    if (this.listaCuentasMonederoElectronico.length === 0) this.getMonederosElectronicos();
    if (this.catalogo_monedas_api.length === 0) this.monedas_lista();
  }

  descarga_excel_acr_estado_cuenta(estado_de_cuenta: any) {
    const est_cuenta_acr = estado_de_cuenta.map((payDone: any) => ({
      ...payDone,
      excel_folio_est_cuenta: payDone.tipo_registro_e_cuenta == 'PAGO' ? payDone.pago_folio : (payDone.tipo_registro_e_cuenta == 'CANCELACION' ? payDone.cancelacion_folio : payDone.movimiento_folio),
      excel_forma_pago: payDone.forma_pago_cfdi + " / " + payDone.metodo_pago_cfdi
    }));
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "excel_folio_est_cuenta", align: "center" },
      { label: this.translate.instant("fecha_cont"), field: "fecha_contabilizacion", align: "center" },
      { label: this.translate.instant("doc_ant"), field: "cancelacion_doc_anterior", align: "center" },
      { label: this.translate.instant("f_pago"), field: "forma_pago_vinculada", align: "center" },
      { label: this.translate.instant("f_m_pago_cfdi"), field: "excel_forma_pago", align: "center" },
      { label: this.translate.instant("observ"), field: "observacionesPago", align: "left" },
      { label: this.translate.instant("total_import"), field: "monto_pago", align: "right" },
      { label: this.translate.instant("mon_tipo_cambio"), field: "tipo_cambio_movimiento", align: "right" },
      { label: "debe", field: "estado_cuenta_debe_format", align: "right" },
      { label: "haber", field: "estado_cuenta_haber_format", align: "right" },
      { label: "saldo", field: "estado_cuenta_saldo_format", align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(est_cuenta_acr, columnas, 'Estado de cuenta de acreedores', 'estado_de_cuenta_de_acreedores.xlsx');
  }

  select_acree_pago_fecha_contab(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.acree_pago_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_acree_pago_moneda(opcion: any) {
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("acreedorMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.acree_pago_moneda_code = typeof mnd !== 'undefined' ? mnd.code : '';
    this.acree_pago_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : 0;
    this.acree_pago_tipo_cambio = typeof mnd !== 'undefined' && this.acree_pago_moneda_code == this.emp_moneda_code ? 1.00 : 0;
    typeof mnd !== 'undefined' ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
    console.log(this.acree_pago_moneda_code + " " + this.acree_pago_moneda_decimales);
  }

  keyup_acree_tipo_cambio(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true;
    this.acree_pago_tipo_cambio = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  select_acree_forma_pago(event: any, token_cat_deudores: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.acree_pago_forma_pago = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion && this.acree_pago_forma_pago == "por-compensacion" ? this.infoDeudorForCompensacion(token_cat_deudores) : null;
  }

  infoDeudorForCompensacion(token_cat_deudores: any) {
    this.deudorServ.verDetalleDeudorPagos(token_cat_deudores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.deudorDetalleForCompensacion = response.deudor;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  select_acree_debe_haber(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.acree_pago_movi_debe_haber = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  select_acree_caja(event: any, token_caja: string) {
    let caja = this.listaCajasRegistradas.find((row: any) => row.token_caja === token_caja);
    const validacion = token_caja != "" && typeof caja !== 'undefined';
    caja.select_for_pagos = validacion ? event.checked : false;
    //caja.monto_aplicar = validacion && caja.saldofloat < this.ordenes_pago_adeudo() ? caja.saldofloat : 0;
    caja.monto_aplicar = validacion ? caja.saldofloat : 0;
    console.log(caja);
    this.aumenta_importe_acree();
  }

  acree_importe_by_caja(event: any, token_caja: any) {
    const caja_list = this.listaCajasRegistradas.find((row: any) => row.token_caja === token_caja);
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && typeof token_caja !== 'undefined';
    caja_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_acree() : null;
    console.log(caja_list);
  }

  select_acree_cuenta(event: any, token_cuenta: any) {
    const cuent = this.listaCuentasBancarias.find((row: any) => row.token_cuenta === token_cuenta);
    const validacion = token_cuenta != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    //cuent.monto_aplicar = validacion && cuent.saldofloat < this.ordenes_pago_adeudo() ? cuent.saldofloat : 0;
    cuent.monto_aplicar = validacion ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumenta_importe_acree();
  }

  functCuentaNumber(token_cuenta: any) {
    let account = this.listaCuentasBancarias.find((row: any) => row.token_cuenta === token_cuenta);
    account.cuenta_view = account.cuenta_view ? false : true;
    var intervalo: any = null;
    if (account.cuenta_view) {
      this.cuentaBan.verCuentaBancariaCompleta(token_cuenta).subscribe(
        response => {
          if (response.status == 'success') {
            account.cuenta_bancaria = response.cuenta_bancaria;
            account.cuenta_time = 30;
            intervalo = setInterval(() => {
              account.cuenta_time = account.cuenta_time - 1;
              if (account.cuenta_time == 0 || !account.cuenta_view) {
                account.cuenta_view = false;
                account.cuenta_time = 0;
                clearInterval(intervalo);
                this.cuentaBan.verCuentaBancaria4Digitos(token_cuenta).subscribe(
                  response => {
                    if (response.status == 'success') {
                      account.cuenta_bancaria = response.cuenta_bancaria;
                    }
                  },
                  error => {
                    console.log(error);
                  }
                );
              }
            }, 1000);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.cuentaBan.verCuentaBancaria4Digitos(token_cuenta).subscribe(
        response => {
          if (response.status == 'success') {
            account.cuenta_bancaria = response.cuenta_bancaria;
          }
        },
        error => {
          console.log(error);
        }
      );
      return;
    }
  }

  acree_importe_by_cuenta(event: any, token_cuenta: any) {
    const cuent_list = this.listaCuentasBancarias.find((row: any) => row.token_cuenta === token_cuenta);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof cuent_list !== 'undefined';
    cuent_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_acree() : null;
  }

  select_acree_monedero_electronico(event: any, token_cuentaMon: any) {
    const cuent = this.listaCuentasMonederoElectronico.find((row: any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = token_cuentaMon != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    //cuent.monto_aplicar = validacion && cuent.saldofloat < this.ordenes_pago_adeudo() ? cuent.saldofloat : 0;
    cuent.monto_aplicar = validacion ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumenta_importe_acree();
  }

  acree_importe_by_monedero(event: any, token_cuentaMon: any) {
    const moned = this.listaCuentasMonederoElectronico.find((row: any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof moned !== 'undefined';
    moned.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_acree() : null;
  }

  aplicacion_saldo_deudor(event: any, token_cat_deudores: any): void {
    const deu = this.deudorDetalleForCompensacion.find((row: any) => row.token_cat_deudores === token_cat_deudores);
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    deu.deu_total_saldo_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_acree() : null;
    if (validacion) {
      deu.deu_total_saldo_restante_simple = deu.deu_total_saldo_simple - deu.deu_total_saldo_aplicar;
      deu.deu_total_saldo_restante = "$" + numeral(deu.deu_total_saldo_restante_simple).format('0,0.' + '0'.repeat(parseInt(this.acree_pago_moneda_decimales.toString()))) + " " + this.acree_pago_moneda_code;
    }
  }

  aumenta_importe_acree() {
    var suma_order_importe = 0;
    const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true);
    caja_list.forEach((caj: any) => {
      const aplicar = caj.monto_aplicar ? parseFloat(caj.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true);
    cuent_list.forEach((account: any) => {
      const aplicar = account.monto_aplicar ? parseFloat(account.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true);
    moned_list.forEach((account: any) => {
      const aplicar = account.monto_aplicar ? parseFloat(account.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    if (this.acree_pago_forma_pago == "por-compensacion" && this.deudorDetalleForCompensacion.length == 1) {
      const deu_list = this.deudorDetalleForCompensacion.filter((row: any) => row.deu_total_saldo_aplicar > 0);
      deu_list.forEach((deu: any) => {
        suma_order_importe += parseFloat(deu.deu_total_saldo_aplicar.toString());
      });
    }

    this.pay_acree_importe = suma_order_importe + parseFloat(this.pay_importe.toString());
    console.log(this.pay_acree_importe);
    if (this.acree_pagos_lista_for_movimientos.length == 1) {
      let ord = this.acree_pagos_lista_for_movimientos[0];
      ord.importe_por_pagar = this.pay_acree_importe > ord.importe_restante ? ord.importe_restante : this.pay_acree_importe;
      ord.debe_simple = parseFloat(ord.importe_restante) - parseFloat(ord.importe_por_pagar);
      ord.debe_format = numeral(ord.debe_simple).format('0,0.' + '0'.repeat(parseInt(this.acree_pago_moneda_decimales.toString())));
    }
  }

  keyup_pag_acr_importe(event: any, token_pagos: any) {
    const de_cimales = parseInt(this.acree_pago_moneda_decimales.toString());
    let pay = this.acree_pagos_lista_for_movimientos.find((row: any) => row.token_pagos === token_pagos);
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && parseFloat(event.value) <= parseFloat(pay.importe_restante) && typeof pay !== 'undefined';
    pay.importe_por_pagar = validacion ? parseFloat(parseFloat(event.value).toFixed(de_cimales)) : parseFloat((0).toFixed(de_cimales));
    pay.debe_simple = validacion ? parseFloat((parseFloat(pay.importe_restante) - pay.importe_por_pagar).toFixed(de_cimales)) : pay.importe_restante;
    pay.debe_format = validacion ? numeral(pay.debe_simple).format('0,0.' + '0'.repeat(de_cimales)) : numeral(pay.importe_restante).format('0,0.' + '0'.repeat(de_cimales));
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calcula_total_pagar_acr() {
    const decimales = Number(this.acree_pago_moneda_decimales);
    const importe_autorizado = this.acree_pagos_lista_for_movimientos.reduce((total: any, row: any) => total + Number(row.importe_por_pagar) || 0, 0);
    const importe_redondeado = Number(importe_autorizado.toFixed(decimales));
    return numeral(importe_redondeado).format('0,0.' + '0'.repeat(decimales));
  }

  keyupObservacionPagarAcr(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.pay_acr_observacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedAcr(files: NgxFileDropEntry[]) {
    //public filespayArc: NgxFileDropEntry[] = [];
    //public docsArcPayAnexos:any [] = [];
    //public arcPayAnexosNames:any = [];

    this.filespayArc = files;
    this.arcPayAnexosNames = [];
    this.docsArcPayAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsArcPayAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.arcPayAnexosNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.docsArcPayAnexos.length > 0) {
              for (let j = 0; j < this.docsArcPayAnexos.length; j++) {
                const row = this.docsArcPayAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsArcPayAnexos.push(file);
                }
              }
            } else {
              this.docsArcPayAnexos.push(file);
            }
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El event.value ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.filespayArc.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsArcPayAnexos.length);
  }

  public fileOverAcr(event: any) {
    console.log(event);
  }

  public fileLeaveAcr(event: any) {
    console.log(event);
  }

  deleteAnexosAcr(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionedo?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.filespayArc.splice(posicion, 1);
          this.docsArcPayAnexos.splice(posicion, 1);
          this.arcPayAnexosNames.splice(posicion, 1);
          console.log(this.docsArcPayAnexos.length);
        }
      }
    );
  }

  limpiaAcreedorSeccionPagos() {
    this.acree_pago_fecha_contabilizacion = "";
    this.pay_acree_importe = 0;
    this.pay_importe = 0;
    this.acree_pago_moneda_code = "";
    this.acree_pago_moneda_decimales = 0;
    this.acree_pago_tipo_cambio = 1.00;
    this.acree_pago_forma_pago = "";
    this.pay_acr_observacion = "";
    this.arcPayAnexosNames = [];
    this.docsArcPayAnexos = [];
    this.filespayArc = [];
    this.acree_pago_movi_debe_haber = "";
  }

  limpiaAcreeSeccionPagos() {
    this.acree_pago_fecha_contabilizacion = "";
    this.validator.limpiaInputRow(document.getElementById("fechaContabilizacionACRPago"));
    this.pay_acree_importe = 0;
    this.pay_importe = 0;
    this.acree_pago_moneda_code = "";
    this.acree_pago_moneda_decimales = 0;
    this.validator.limpiaInputRow(document.getElementById("acreedorMonedaCode"));
    this.monedas_acree_pago = null;
    console.log("selectedMonedaCode");
    this.acree_pago_tipo_cambio = 1.00;
    this.validator.limpiaInputRow(document.getElementById("pagos_acr_tipo_cambio"));
    $("#pagos_acr_tipo_cambio").val(this.acree_pago_tipo_cambio);
    this.acree_pago_forma_pago = "";
    this.validator.limpiaInputRow(document.getElementById("pagos_acr_forma_pago"));
    this.pay_acr_observacion = "";
    this.validator.limpiaInputRow(document.getElementById("pagos_acr_debe_o_haber"));
    this.acree_pago_movi_debe_haber = "";
    this.validator.limpiaTextarea(document.getElementById("pago_acr_large_observ"));
    this.arcPayAnexosNames = [];
    this.docsArcPayAnexos = [];
    this.filespayArc = [];
    //$('#windowAcreedorInfo').modal('hide');
    //$('.modal-backdrop').remove();
  }

  get pay_acr_to_validate(): Boolean {
    const validacion_fecha_contabilizacion = this.acree_pago_fecha_contabilizacion != "" && this.validator.filtroFecha(this.acree_pago_fecha_contabilizacion);

    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.acree_pago_moneda_code);
    const validacion_moneda = this.acree_pago_moneda_code != '' && this.validator.filtroAlfaNumerico(this.acree_pago_moneda_code) == true && typeof mnd !== 'undefined';

    const validacion_tipo_cambio = this.acree_pago_tipo_cambio > 0 && this.validator.filtroNum(this.acree_pago_tipo_cambio) == true;

    const validacion_forma_pago = this.acree_pago_forma_pago != "" && this.validator.filtroAlfaNumerico(this.acree_pago_forma_pago);
    const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true && row.monto_aplicar > 0);
    const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true && row.monto_aplicar > 0);
    const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true && row.monto_aplicar > 0);
    const deu_data = this.acree_pago_forma_pago == "por-compensacion" && this.deudorDetalleForCompensacion.length == 1 && this.deudorDetalleForCompensacion.filter((row: any) => row.deu_total_saldo_aplicar > 0);
    const validacion_movi_debe_haber = this.acree_pago_movi_debe_haber != "" && this.validator.filtroAlfaNumerico(this.acree_pago_movi_debe_haber);
    const validacion_importe = this.pay_acree_importe > 0 && this.validator.filtroNum(this.pay_acree_importe) == true;
    //const validacion_pagar_list = this.acree_pago_movi_debe_haber == 'haber' && (this.acree_pagos_lista_for_movimientos.length > 0 && this.acree_pagos_lista_for_movimientos.filter((row: any) => row.importe_por_pagar != "0.00").length > 0) || this.acree_pago_movi_debe_haber == 'debe';
    const validacion_pagar_list = this.acree_pago_movi_debe_haber == 'haber' || this.acree_pago_movi_debe_haber == 'debe';

    const validacion_salida_dinero = (typeof caja_list !== 'undefined' && caja_list.length > 0) || (typeof cuent_list !== 'undefined' && cuent_list.length > 0) ||
      (typeof moned_list !== 'undefined' && moned_list.length > 0) || (typeof deu_data !== 'undefined' && deu_data.length > 0);

    const validacion_observacion = this.pay_acr_observacion != "" && this.validator.strFilter(this.pay_acr_observacion) == true && this.pay_acr_observacion.length >= 4;
    const validacion_documents = this.arcPayAnexosNames.length > 0;

    return validacion_movi_debe_haber && validacion_fecha_contabilizacion && validacion_importe && validacion_moneda && validacion_tipo_cambio && validacion_salida_dinero && validacion_pagar_list && validacion_observacion && validacion_documents;
  }

  onSavePagoAcreedor(token_cat_acreedores: any, deudor_vinculado_token: any, form: NgForm): void {
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
        const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true && row.monto_aplicar > 0);
        const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true && row.monto_aplicar > 0);
        const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true && row.monto_aplicar > 0);
        const lista_movimientos = this.acree_pagos_lista_for_movimientos.filter((row: any) => row.importe_por_pagar != "0.00");
        const deu_total_saldo_aplicar = this.deudorDetalleForCompensacion.find((row: any) => row.token_cat_deudores === deudor_vinculado_token && row.deu_total_saldo_aplicar > 0);

        this.ordenPago.confirmaMovimientoAcreedor(
          token_cat_acreedores,
          this.acree_pago_fecha_contabilizacion,
          this.acree_pago_moneda_code,
          this.acree_pago_tipo_cambio,
          this.acree_pago_forma_pago,
          deudor_vinculado_token,
          this.acree_pago_movi_debe_haber,
          this.pay_acree_importe,
          caja_list,
          cuent_list,
          moned_list,
          lista_movimientos,
          deu_total_saldo_aplicar,
          this.pay_acr_observacion,
          this.docsArcPayAnexos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
                this.relInterna.mensajeAcreedorMovimientoRegistrado("acr_mov_registrado");
                this.showCajasRegistradas();
                this.getCuentasBancarias();
                this.getMonederosElectronicos();
                form.reset();
                form.resetForm();
                this.limpiaAcreeSeccionPagos();
                this.lista_acreedores();
                this.infoAcreeDetalle(token_cat_acreedores);
                this.formAddPagoAcreedor.resetForm();
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
              //console.log(error);
            }
          );
      }
    })
  }

}
