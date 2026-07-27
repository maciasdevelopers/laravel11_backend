import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { DeudoresService } from '../../../../../servicios/deudores.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import numeral from 'numeral';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { AcreedoresService } from '../../../../../servicios/acreedores.service';
import { SessionContextService } from '../../../../../servicios/session-context';

@Component({
  selector: 'app_ordenes_pago_op_deudores',
  standalone: false,

  templateUrl: './op-deudores.component.html',
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
    './op-deudores.component.css',
  ]
})
export class OpDeudoresComponent implements OnInit {
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
  monedas_deu_pago = null;
  pay_order_moneda_opcion = null;
  public pay_order_moneda_code: string = "";
  public pay_order_moneda_decimales: number = 0;
  public emp_moneda_code: string = "";
  public emp_moneda_decimales: string = "";

  //deudores
  list_deudores_general: any = [];
  indicadorDeudores:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoDeudores: Date[] | undefined;
  deudorDetalleData: any = [];
  public deudorDetalleVer:boolean = false;
  search_deudor_estado_de_cuenta: any = [];
  search_deudor_movimientos_realizados: string = "";
  search_deudor_lista_for_movimientos: any = [];
  deu_pagos_lista_for_movimientos: any = [];
  public deu_pago_fecha_contabilizacion: string = "";
  public deu_pago_moneda_code: string = "";
  public deu_pago_moneda_decimales: number = 0;
  public deu_pago_tipo_cambio: number = 1.00;
  public deu_pago_forma_pago: string = "";
  public deu_pago_movi_debe_haber: string = "";
  public pay_deu_observacion: string = "";
  public filespayDeu: NgxFileDropEntry[] = [];
  public docsDeuPayAnexos: any[] = [];
  public deuPayAnexosNames: any = [];
  public pay_deu_importe: number = 0;
  @ViewChild('formAddPagoDeudor') formAddPagoDeudor!: NgForm;

  //acreedores 
  acreedorDetalleForCompensacion: any = [];

  constructor(
    private relInterna: ComunicacionInternaService,
    private deudorServ: DeudoresService,
    private acreedServ: AcreedoresService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private ordenPago: OrdenPagoService,
    private _cajServ: CajaServService,
    private cuentaBan: CuentbancService,
    private monedero: MonederoElectService,
    private _monedasServ: MonedasService,
    private sessionContext: SessionContextService,
    private sentinela: SentinelArkManager,
    private servXlsx: DescargaExcel,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.emp_moneda_code = this.sessionContext.empresa_data?.e_moneda_code;
    this.emp_moneda_decimales = this.sessionContext.empresa_data?.e_moneda_decimales;
    this.getRespuestaOrdSeccionModule();
    this.getRespuestaDeudores();
    this.getRespuestaAnticipos();
    this.search_deudor_estado_de_cuenta = [
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
    this.search_deudor_lista_for_movimientos = ['folio_pagos', 'fecha_contabilizacion', 'forma_pago_vinculada', 'forma_pago_cfdi', 'metodo_pago_cfdi', 'monto_pago',
      'tipo_cambio', 'observacionesPago', 'token_pagos', 'debe_format'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdPagoSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_op_deudores") {
          console.log(mensaje);
          if (this.list_deudores_general.length === 0) this.ver_lista_deudores('hoy');
        }
      }
    );
  }

  getRespuestaAnticipos() {
    this.relInterna.mensajeAnticipoDeudorInsert$.subscribe(
      (mensaje: any) => {
        if (mensaje == "anticipo_autorizado") {
          this.lista_deudores();
        }
      }
    );
  }

  getRespuestaDeudores() {
    this.relInterna.mensajeListaDeudores$.subscribe(
      (mensaje: any) => {
        console.log(mensaje)
        if (mensaje == "listar_deudores") {
          this.lista_deudores();
        }
      }
    );
  }

  lista_deudores() {
    this.ver_lista_deudores(this.indicadorDeudores);
  }

  ver_lista_deudores(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDeudores = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var deu_gral_otras_fechas = document.getElementById("deu_gral_otras_fechas");
      if (this.rangoPeriodoDeudores && this.rangoPeriodoDeudores[1]) {
        const dateInicio = this.rangoPeriodoDeudores[0];
        const dateFin = this.rangoPeriodoDeudores[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(deu_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(deu_gral_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(deu_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(deu_gral_otras_fechas);
      }
    }

    this.deudorServ.catalogoDeudoresGeneral(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaDeudores(response),
      error: (err) => this.manejarErrorDeudores(err)
    });
  }

  private procesarRespuestaDeudores(response: any) {
    if (response.status === 'success') {
      this.list_deudores_general = response.deudores;
      this.cd.detectChanges();
    } else {
      this.list_deudores_general = [];
    }
  }

  private manejarErrorDeudores(error: any) {
    console.error('Error al cargar pagos realizados:', error);
    this.list_deudores_general = [];
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

  infodeuDetalle(token_cat_deudores: any) {
    this.limpiaDeudorSeccionPagos();
    this.deudorServ.verDetalleDeudorPagos(token_cat_deudores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.deudorDetalleData = response.deudor;
          this.deudorDetalleData.forEach((acr: any) => {
            this.deu_pagos_lista_for_movimientos = acr.pagos_deudor_list.filter((mov: any) => mov.debe_simple != "0.00");
          });
          this.deudorDetalleVer = true;
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

  descarga_excel_deu_estado_cuenta(estado_de_cuenta: any) {
    const est_cuenta_acr = estado_de_cuenta.map((payDone: any) => ({
      ...payDone,
      excel_folio_est_cuenta: payDone.tipo_registro_e_cuenta == 'PAGO' ? payDone.pago_folio : payDone.movimiento_folio
    }));
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "excel_folio_est_cuenta", align: "center" },
      { label: this.translate.instant("fecha_cont"), field: "fecha_contabilizacion", align: "center" },
      { label: this.translate.instant("doc_ant"), field: "documento_anterior", align: "center" },
      { label: this.translate.instant("f_pago"), field: "forma_pago_vinculada", align: "center" },
      { label: this.translate.instant("observ"), field: "observacionesPago", align: "left" },
      { label: this.translate.instant("total_import"), field: "monto_pago", align: "right" },
      { label: this.translate.instant("mon_tipo_cambio"), field: "tipo_cambio_movimiento", align: "right" },
      { label: "debe", field: "estado_cuenta_debe_format", align: "right" },
      { label: "haber", field: "estado_cuenta_haber_format", align: "right" },
      { label: "saldo", field: "estado_cuenta_saldo_format", align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(est_cuenta_acr, columnas, 'Estado de cuenta de deudores', 'estado_de_cuenta_de_deudores.xlsx');
  }

  select_deu_pago_fecha_contab(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.deu_pago_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_deu_pago_moneda(opcion: any) {
    var deudorMonedaCode = document.getElementById("deudorMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    const validacion = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) == true && typeof mnd !== 'undefined';
    this.deu_pago_moneda_code = validacion ? mnd.code : '';
    this.deu_pago_moneda_decimales = validacion ? mnd.decimales : '';
    this.deu_pago_tipo_cambio = validacion && this.deu_pago_moneda_code == this.emp_moneda_code ? 1.00 : 0;
    validacion ? this.validator.correctoInputRow(deudorMonedaCode) : this.validator.errorInputRow(deudorMonedaCode);
  }

  keyup_deu_tipo_cambio(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true;
    this.deu_pago_tipo_cambio = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  select_deu_forma_pago(event: any, token_cat_acreedores: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.deu_pago_forma_pago = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion && this.deu_pago_forma_pago == "por-compensacion" ? this.infoAcreedorForCompensacion(token_cat_acreedores) : null;
  }

  infoAcreedorForCompensacion(token_cat_acreedores: any) {
    this.acreedServ.verDetalleAcreedorPagos(token_cat_acreedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.acreedorDetalleForCompensacion = response.acreedor;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  select_deu_debe_haber(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.deu_pago_movi_debe_haber = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  select_deu_caja(event: any, token_caja: string) {
    let caja = this.listaCajasRegistradas.find((row: any) => row.token_caja === token_caja);
    const validacion = token_caja != "" && typeof caja !== 'undefined';
    caja.select_for_pagos = validacion ? event.checked : false;
    //caja.monto_aplicar = validacion && caja.saldofloat < this.ordenes_pago_adeudo() ? caja.saldofloat : 0;
    caja.monto_aplicar = validacion ? caja.saldofloat : 0;
    console.log(caja);
    this.aumenta_importe_deudor();
  }

  deu_importe_by_caja(event: any, token_caja: any) {
    const caja_list = this.listaCajasRegistradas.find((row: any) => row.token_caja === token_caja);
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && typeof token_caja !== 'undefined';
    caja_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_deudor() : null;
    console.log(caja_list);
  }

  select_deu_cuenta(event: any, token_cuenta: any) {
    const cuent = this.listaCuentasBancarias.find((row: any) => row.token_cuenta === token_cuenta);
    const validacion = token_cuenta != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    //cuent.monto_aplicar = validacion && cuent.saldofloat < this.ordenes_pago_adeudo() ? cuent.saldofloat : 0;
    cuent.monto_aplicar = validacion ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumenta_importe_deudor();
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

  deu_importe_by_cuenta(event: any, token_cuenta: any) {
    const cuent_list = this.listaCuentasBancarias.find((row: any) => row.token_cuenta === token_cuenta);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof cuent_list !== 'undefined';
    cuent_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_deudor() : null;
    console.log(cuent_list);
  }

  select_deu_monedero_electronico(event: any, token_cuentaMon: any) {
    const cuent = this.listaCuentasMonederoElectronico.find((row: any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = token_cuentaMon != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    //cuent.monto_aplicar = validacion && cuent.saldofloat < this.ordenes_pago_adeudo() ? cuent.saldofloat : 0;
    cuent.monto_aplicar = validacion ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumenta_importe_deudor();
  }

  deu_importe_by_monedero(event: any, token_cuentaMon: any) {
    const moned = this.listaCuentasMonederoElectronico.find((row: any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof moned !== 'undefined';
    moned.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_deudor() : null;
  }

  aplicacion_saldo_acreedor(event: any, token_cat_acreedores: any): void {
    const acr = this.acreedorDetalleForCompensacion.find((row: any) => row.token_cat_acreedores === token_cat_acreedores);
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    acr.acr_total_saldo_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_deudor() : null;
    if (validacion) {
      acr.acr_total_saldo_restante_simple = acr.acr_total_saldo_simple - acr.acr_total_saldo_aplicar;
      acr.acr_total_saldo_restante = "$" + numeral(acr.acr_total_saldo_restante_simple).format('0,0.' + '0'.repeat(parseInt(this.deu_pago_moneda_decimales.toString()))) + " " + this.deu_pago_moneda_code;
    }
  }

  aumenta_importe_deudor() {
    var suma_order_importe = 0;
    const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true);
    caja_list.forEach((caj: any) => {
      const aplicar = caj.monto_aplicar ? parseFloat(caj.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true);
    console.log(cuent_list.length);
    cuent_list.forEach((account: any) => {
      const aplicar = account.monto_aplicar ? parseFloat(account.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true);
    moned_list.forEach((account: any) => {
      const aplicar = account.monto_aplicar ? parseFloat(account.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    if (this.deu_pago_forma_pago == "por-compensacion" && this.acreedorDetalleForCompensacion.length == 1) {
      const acr_list = this.acreedorDetalleForCompensacion.filter((row: any) => row.acr_total_saldo_aplicar > 0);
      acr_list.forEach((acr: any) => {
        suma_order_importe += parseFloat(acr.acr_total_saldo_aplicar.toString());
      });
    }

    this.pay_deu_importe = suma_order_importe + parseFloat(this.pay_importe.toString());
    console.log(this.pay_deu_importe);
    if (this.deu_pagos_lista_for_movimientos.length == 1) {
      let ord = this.deu_pagos_lista_for_movimientos[0];
      ord.importe_por_pagar = this.pay_deu_importe > ord.importe_restante ? ord.importe_restante : this.pay_deu_importe;
      ord.debe_simple = parseFloat(ord.importe_restante) - parseFloat(ord.importe_por_pagar);
      //ord.debe_format = numeral(ord.debe_simple).format('0,0.'+'0'.repeat(parseInt(this.deu_pago_moneda_decimales.toString())));
      ord.debe_format = new Intl.NumberFormat('es-MX', { minimumFractionDigits: this.deu_pago_moneda_decimales, maximumFractionDigits: this.deu_pago_moneda_decimales }).format(ord.debe_simple);
    }
  }

  keyup_pag_deu_importe(event: any, token_pagos: any) {
    let pay = this.deu_pagos_lista_for_movimientos.find((row: any) => row.token_pagos === token_pagos);
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && parseFloat(event.value) <= parseFloat(pay.importe_restante) && typeof pay !== 'undefined';
    pay.importe_por_pagar = validacion ? event.value : '0.00';
    pay.debe_simple = validacion ? parseFloat(pay.importe_restante) - parseFloat(pay.importe_por_pagar) : pay.importe_restante;
    pay.debe_format = validacion ? numeral(pay.debe_simple).format('0,0.' + '0'.repeat(parseInt(this.deu_pago_moneda_decimales.toString()))) : numeral(pay.importe_restante).format('0,0.' + '0'.repeat(parseInt(this.deu_pago_moneda_decimales.toString())));
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calcula_total_pagar_deu() {
    var importe_autorizado = 0;
    this.deu_pagos_lista_for_movimientos.forEach((row: any) => {
      importe_autorizado += parseFloat(row.importe_por_pagar);
    });
    return numeral(importe_autorizado).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales.toString())));
  }

  keyupObservacionPagarDeu(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.pay_deu_observacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedDeu(files: NgxFileDropEntry[]) {
    //public filespayDeu: NgxFileDropEntry[] = [];
    //public docsDeuPayAnexos:any [] = [];
    //public deuPayAnexosNames:any = [];

    this.filespayDeu = files;
    this.deuPayAnexosNames = [];
    this.docsDeuPayAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsDeuPayAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.deuPayAnexosNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.docsDeuPayAnexos.length > 0) {
              for (let j = 0; j < this.docsDeuPayAnexos.length; j++) {
                const row = this.docsDeuPayAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsDeuPayAnexos.push(file);
                }
              }
            } else {
              this.docsDeuPayAnexos.push(file);
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
            this.filespayDeu.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsDeuPayAnexos.length);
  }

  public fileOverDeu(event: any) {
    console.log(event);
  }

  public fileLeaveDeu(event: any) {
    console.log(event);
  }

  deleteAnexosDeu(posicion: any) {
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
          this.filespayDeu.splice(posicion, 1);
          this.docsDeuPayAnexos.splice(posicion, 1);
          this.deuPayAnexosNames.splice(posicion, 1);
          console.log(this.docsDeuPayAnexos.length);
        }
      }
    );
  }

  limpiaDeudorSeccionPagos() {
    this.deu_pago_fecha_contabilizacion = "";
    this.pay_deu_importe = 0;
    this.pay_importe = 0;
    this.deu_pago_moneda_code = "";
    this.deu_pago_moneda_decimales = 0;
    this.deu_pago_tipo_cambio = 1.00;
    this.deu_pago_forma_pago = "";
    this.pay_deu_observacion = "";
    this.deuPayAnexosNames = [];
    this.docsDeuPayAnexos = [];
    this.filespayDeu = [];
    this.deu_pago_movi_debe_haber = "";
  }

  limpiaDeudorSeccionPagosAll() {
    this.deu_pago_fecha_contabilizacion = "";
    this.validator.limpiaInputRow(document.getElementById("fechaContabilizacionDeuPago"));
    this.pay_deu_importe = 0;
    this.pay_importe = 0;
    this.deu_pago_moneda_code = "";
    this.deu_pago_moneda_decimales = 0;
    this.validator.limpiaInputRow(document.getElementById("deudorMonedaCode"));
    this.monedas_deu_pago = null;
    console.log("selectedMonedaCode");
    this.deu_pago_tipo_cambio = 1.00;
    this.validator.limpiaInputRow(document.getElementById("pagos_deu_tipo_cambio"));
    $("#pagos_deu_tipo_cambio").val(this.deu_pago_tipo_cambio);
    this.deu_pago_forma_pago = "";
    this.validator.limpiaInputRow(document.getElementById("pagos_deu_forma_pago"));
    this.pay_deu_observacion = "";
    this.validator.limpiaInputRow(document.getElementById("pagos_deu_debe_o_haber"));
    this.deu_pago_movi_debe_haber = "";
    this.validator.limpiaTextarea(document.getElementById("pago_deu_large_observ"));
    this.deuPayAnexosNames = [];
    this.docsDeuPayAnexos = [];
    this.filespayDeu = [];
    //$('#windowdeudorInfo').modal('hide');
    //$('.modal-backdrop').remove();
  }

  get pay_deu_to_validate(): Boolean {
    const validacion_fecha_contabilizacion = this.deu_pago_fecha_contabilizacion != "" && this.validator.filtroFecha(this.deu_pago_fecha_contabilizacion);

    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.deu_pago_moneda_code);
    const validacion_moneda = this.deu_pago_moneda_code != '' && this.validator.filtroAlfaNumerico(this.deu_pago_moneda_code) == true && typeof mnd !== 'undefined';

    const validacion_tipo_cambio = this.deu_pago_tipo_cambio > 0 && this.validator.filtroNum(this.deu_pago_tipo_cambio) == true;

    const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos && row.monto_aplicar > 0);
    const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos && row.monto_aplicar > 0);
    const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos && row.monto_aplicar > 0);
    const acree_data = this.deu_pago_forma_pago == "por-compensacion" && this.acreedorDetalleForCompensacion.length == 1 && this.acreedorDetalleForCompensacion.filter((row: any) => row.acr_total_saldo_aplicar > 0);
    const validacion_movi_debe_haber = this.deu_pago_movi_debe_haber != "" && this.validator.filtroAlfaNumerico(this.deu_pago_movi_debe_haber);
    const validacion_importe = this.pay_deu_importe > 0 && this.validator.filtroNum(this.pay_deu_importe) == true;
    const validacion_pagar_list = this.deu_pagos_lista_for_movimientos.length > 0 && this.deu_pagos_lista_for_movimientos.filter((row: any) => row.importe_por_pagar != "0.00").length > 0;

    const validacion_salida_dinero = (typeof caja_list !== 'undefined' && caja_list.length > 0) || (typeof cuent_list !== 'undefined' && cuent_list.length > 0) ||
      (typeof moned_list !== 'undefined' && moned_list.length > 0) || (typeof acree_data !== 'undefined' && acree_data.length > 0);

    const validacion_observacion = this.pay_deu_observacion != "" && this.validator.strFilter(this.pay_deu_observacion) && this.pay_deu_observacion.length >= 4;
    const validacion_documents = this.deuPayAnexosNames.length > 0;

    return validacion_movi_debe_haber && validacion_fecha_contabilizacion && validacion_importe && validacion_moneda && validacion_tipo_cambio && validacion_salida_dinero && validacion_observacion && validacion_documents;
  }

  onSavePagoDeudor(token_cat_deudores: any, acreedor_vinculado_token: any, form: NgForm): void {
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
        const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true);
        const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true);
        const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true);
        const lista_movimientos = this.deu_pagos_lista_for_movimientos.filter((row: any) => row.importe_por_pagar != "0.00");
        const acr_total_saldo_aplicar = this.acreedorDetalleForCompensacion.find((row: any) => row.token_cat_acreedores === acreedor_vinculado_token && row.acr_total_saldo_aplicar > 0);

        this.ordenPago.confirmaMovimientoDeudor(
          //this.pay_deu_importe,
          //this.deu_pago_fecha_contabilizacion,
          //caja_list,
          //cuent_list,
          //moned_list,
          //proveedor
          //token_cat_deudores,
          //calculo_total
          //this.deu_pago_moneda_code,
          //this.deu_pago_tipo_cambio,
          //this.deu_pago_forma_pago,
          //lista_movimientos,
          //this.pay_deu_observacion,
          //this.docsDeuPayAnexos



          token_cat_deudores,
          this.deu_pago_fecha_contabilizacion,
          this.deu_pago_moneda_code,
          this.deu_pago_tipo_cambio,
          this.deu_pago_forma_pago,
          acreedor_vinculado_token,
          this.deu_pago_movi_debe_haber,
          this.pay_deu_importe,
          caja_list,
          cuent_list,
          moned_list,
          lista_movimientos,
          acr_total_saldo_aplicar,
          this.pay_deu_observacion,
          this.docsDeuPayAnexos).subscribe(
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
                this.relInterna.mensajeDeudorMovimientoRegistrado("deu_mov_registrado");
                this.showCajasRegistradas();
                this.getCuentasBancarias();
                this.getMonederosElectronicos();
                form.reset();
                form.resetForm();
                this.limpiaDeudorSeccionPagosAll();
                this.lista_deudores();
                this.infodeuDetalle(token_cat_deudores);
                this.formAddPagoDeudor.resetForm();
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
