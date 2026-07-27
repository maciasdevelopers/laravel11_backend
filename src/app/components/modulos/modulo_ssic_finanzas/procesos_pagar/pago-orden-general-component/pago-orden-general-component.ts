import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
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
import { SessionContextService } from '../../../../../servicios/session-context';
import numeral from 'numeral';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'fnzs_pago_orden_general_form_component',
  standalone: false,
  templateUrl: './pago-orden-general-component.html',
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
    './pago-orden-general-component.css',
  ]
})
export class PagoOrdenGeneralComponent implements OnInit, OnChanges, OnDestroy{
  //public importe_pago_realizado: number = 0;
  public pay_order_importe: number = 0;
  public identidad: any;
  @Input() orden_de_pago_token!: string;
  @Input() orden_de_pago_partida!: any;

  //anticipos proveedor  
  ordenes_pago_anticipo_total: number = 0;
  search_prv_saldos_a_favor: any = [];
  public aplica_anticipo_a_proveedor: string = "No";
  proveedorAnticipos: any = [];
  proveedorAnticipoTotal: number = 0;
  proveedorAnticipoTotalFormat: string = "";
  proveedorAnticipoaplicado: number = 0;
  proveedorAnticipoRestanteFormat: string = "";
  //lista cajas registradas
  search_cajas_registradas: any = [];
  listaCajasRegistradas: any = [];
  //lista cuentas bancarias
  search_cuentas_bancarias: any = [];
  listaCuentasBancarias: any = [];
  //monederos
  search_cuentas_monedero_electronico: any = [];
  listaCuentasMonederoElectronico: any = [];
  //monedas
  catalogo_monedas_api: any = [];
  monedas_acree_pago = null;
  public emp_moneda_code: string = "";
  public emp_moneda_decimales: string = "";
  public pay_order_moneda_code: string = "";
  public pay_order_moneda_decimales: number = 0;

  public orden_pago_simple_form: boolean = false;
  ordenes_pago_listaProceso_prv_name: string = "";
  ordenes_pago_listaProceso_prv_token: string = "";
  ordenes_pago_listaProceso: any = [];
  searchPagolistaProceso: any = [];

  public pay_order_fecha_contabilizacion: string = "";
  pay_order_moneda_opcion = null;
  ordenes_pago_listaProceso_prv_saldos_a_favor: any = [];
  public pay_order_tipo_cambio: number = 1.00;
  public pay_order_forma_pago: string = "";
  public pay_order_observacion: string = "";
  public ordPayAnexosNames: any = [];
  public docsOrdPayAnexos: any[] = [];
  public filespayOrder: NgxFileDropEntry[] = [];

  private destruir$ = new Subject<void>();

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
    private sessionContext: SessionContextService,
    private cd: ChangeDetectorRef) {
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.emp_moneda_code = this.sessionContext.empresa_data?.e_moneda_code;
    this.emp_moneda_decimales = this.sessionContext.empresa_data?.e_moneda_decimales;
    this.search_cajas_registradas = ['caja_folio', 'caja_alias', 'establecimiento', 'salDoCaja', 'select_for_pagos', 'token_caja'];
    this.search_cuentas_bancarias = ['select_for_pagos', 'folio_cuenta', 'banco_clave', 'banco_nombre_comercial', 'token_cuenta', 'cuenta_bancaria', 'cuenta_view', 'cuenta_time', 'saldo_cuenta_format'];
    this.search_cuentas_monedero_electronico = ['select_for_pagos', 'token_cuentaMon', 'folio_cuenta', 'monedero', 'cuenta_frontend', 'saldo_cuenta_format'];
    this.search_prv_saldos_a_favor = ['select_for_pagos', 'fecha_de_registro', 'fecha_aplicacion', 'monto_real_format', 'tipo_cambio'];
    this.searchPagolistaProceso = ['id', 'folio_ordenPago', 'orden_emisor_personal_nombre', 'orden_emisor_emp', 'factura_relacionada_string', 'importe_total_inicial', 'importe_autorizado_inicial_format',
      'importe_autorizado_final', 'importe_restante_format'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cambioOrden = changes['orden_de_pago_token'];
    const orden_de_pago_partida = changes['orden_de_pago_partida'];
    if (cambioOrden || orden_de_pago_partida) {
      if (this.orden_de_pago_token && this.orden_de_pago_partida.length > 0) {

        this.orden_pago_simple_form = true;
        this.ordenes_pago_listaProceso =  this.orden_de_pago_partida;
        console.log(this.ordenes_pago_listaProceso);
        
        //this.orden_de_pago_partida.forEach((ord: any) => {
        //  var importe_pagado = 0;
        //  const lpag = ord.lista_pagos_realizados;
        //  lpag.forEach((pr: any) => {
        //    const pagado = pr.monto_pago_simple ? parseFloat(pr.monto_pago_simple.toString()) : 0;
        //    importe_pagado += pagado;
        //  });
        //  this.importe_pago_realizado = importe_pagado;
        //});

        this.ordenes_pago_listaProceso_prv_token = this.ordenes_pago_listaProceso[0]["orden_emisor_personal_token"];
        this.ordenes_pago_listaProceso_prv_name = this.ordenes_pago_listaProceso[0]["orden_emisor_personal_nombre"];
        if (this.ordenes_pago_listaProceso[0]["factura_relacionada_typo"] == 'compras') {
          this.listar_anticipos_proveedor(this.ordenes_pago_listaProceso_prv_token);
          this.listar_saldos_a_favor_proveedor(this.ordenes_pago_listaProceso_prv_token);
        }
        
        this.showCajasRegistradas();
        this.getCuentasBancarias();
        this.getMonederosElectronicos();
        this.monedas_lista();
      }
    }
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

  showCajasRegistradas() {
    this._cajServ.verListaCajas('all_partidas','','').subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
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

  ordenes_pago_adeudoFormat() {
    var importe_autorizado = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      importe_autorizado += parseFloat(row.importe_autorizado_final_simple);
      moneda_autorizada = row.orden_moneda_final_autorizada_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.orden_moneda_final_autorizada_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });
    return "$" + numeral(importe_autorizado).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales))) + " " + (this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada);
  }

  pagos_anteriores() {
    var pagos_total = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      pagos_total += parseFloat(row.pagos_realizados);
      moneda_autorizada = row.orden_moneda_final_autorizada_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.orden_moneda_final_autorizada_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });
    return "$" + numeral(pagos_total).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales))) + " " + (this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada);
  }

  deuda_menos_pagos() {
    var deuda_total = 0;
    var pagos_previos = 0;
    var total_por_pagar = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      deuda_total += parseFloat(row.importe_autorizado_final_simple);
      pagos_previos += parseFloat(row.pagos_realizados);
      total_por_pagar += parseFloat(row.importe_por_pagar);
      moneda_autorizada = row.orden_moneda_final_autorizada_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.orden_moneda_final_autorizada_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });

    var deuda_total_actualizada = deuda_total - pagos_previos;
    return numeral(deuda_total_actualizada).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales))) + " " + (this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada);
  }

  calculaTotalPagando():any {
    var importe_autorizado = 0;
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      importe_autorizado += parseFloat(row.importe_por_pagar);
    });
    return importe_autorizado;
  }

  calculaTotalPagandoFormat() {
    var importe_autorizado = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    //console.log(this.ordenes_pago_listaProceso);
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      //var importe_pagado = 0;
      //const lpag = row.lista_pagos_realizados;
      //lpag.forEach((pr: any) => {
      //  const pagado = pr.monto_pago_simple ? parseFloat(pr.monto_pago_simple.toString()) : 0;
      //  importe_pagado += pagado;
      //});
      importe_autorizado += parseFloat(row.importe_por_pagar);
      //importe_autorizado += importe_pagado;
      moneda_autorizada = row.orden_moneda_final_autorizada_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.orden_moneda_final_autorizada_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });
    return numeral(importe_autorizado).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales))) + " " + (this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada);
  }

  calculaTotalSaldo() {
    var deuda_total = 0;
    var pagos_previos = 0;
    var total_por_pagar = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      deuda_total += parseFloat(row.importe_autorizado_final_simple);
      pagos_previos += parseFloat(row.pagos_realizados);
      total_por_pagar += parseFloat(row.importe_por_pagar);
      moneda_autorizada = row.orden_moneda_final_autorizada_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.orden_moneda_final_autorizada_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });

    var deuda_total_actualizada = deuda_total - pagos_previos;
    var saldo_restante = deuda_total_actualizada - total_por_pagar;//parseFloat(this.pay_order_importe.toString()) - total_por_pagar
    return numeral(saldo_restante).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales))) + " " + (this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada);
  }

  calculaTotalSaldoSimple() {
    var deuda_total = 0;
    var pagos_previos = 0;
    var total_por_pagar = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      deuda_total += parseFloat(row.importe_autorizado_final_simple);
      pagos_previos += parseFloat(row.pagos_realizados);
      total_por_pagar += parseFloat(row.importe_por_pagar);
      moneda_autorizada = row.orden_moneda_final_autorizada_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.orden_moneda_final_autorizada_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });

    var deuda_total_actualizada = deuda_total - pagos_previos;
    var saldo_restante = deuda_total_actualizada - total_por_pagar;//parseFloat(this.pay_order_importe.toString()) - total_por_pagar
    return numeral(saldo_restante).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales)));
  }

  ordenes_pago_adeudo() {
    var importe_autorizado = 0;
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      importe_autorizado += parseFloat(row.importe_autorizado_final_simple);
    });
    return importe_autorizado;
  }

  aumentaImporteAll() {
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

    suma_order_importe += parseFloat(this.proveedorAnticipoaplicado.toString());

    const sald_list = this.ordenes_pago_listaProceso_prv_saldos_a_favor.filter((row: any) => row.select_for_pagos === true);
    sald_list.forEach((sald: any) => {
      const aplicar = sald.monto_aplicar ? parseFloat(sald.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    this.pay_order_importe = suma_order_importe;
    console.log(this.pay_order_importe);
    if (this.ordenes_pago_listaProceso.length == 1) {
      let ord = this.ordenes_pago_listaProceso[0];
      ord.importe_por_pagar = this.pay_order_importe > ord.importe_restante ? ord.importe_restante : this.pay_order_importe;
      ord.importe_por_pagar_format = numeral(ord.importe_por_pagar).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales.toString())));
      ord.debe_simple = parseFloat(ord.importe_restante) - parseFloat(ord.importe_por_pagar);
      ord.debe_format = numeral(ord.debe_simple).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales.toString())));
      //const decimales = Number(this.pay_order_moneda_decimales);
      //ord.debe_format = new Intl.NumberFormat('es-MX', { minimumFractionDigits: decimales, maximumFractionDigits: decimales}).format(ord.debe_simple);
    }
  }

  select_fecha_contabilizacion(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.pay_order_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupMonedaPagoSave(opcion: any) {
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.pay_order_moneda_code = typeof mnd !== 'undefined' ? mnd.code : '';
    this.pay_order_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    this.pay_order_tipo_cambio = typeof mnd !== 'undefined' && mnd.code == "MXN" ? 1.00 : 0;
    typeof mnd !== 'undefined' ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  editTipoCambio(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true;
    this.pay_order_tipo_cambio = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectFormaPagoSave(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.pay_order_forma_pago = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectCajaDisp(event: any, token_caja: string) {
    let caja = this.listaCajasRegistradas.find((row: any) => row.token_caja === token_caja);
    const validacion = token_caja != "" && typeof caja !== 'undefined';
    caja.select_for_pagos = validacion ? event.checked : false;
    caja.monto_aplicar = validacion && caja.saldofloat < this.ordenes_pago_adeudo() ? caja.saldofloat : 0;
    console.log(caja);
    this.aumentaImporteAll();
  }

  importeByCaja(event: any, token_caja: any) {
    const caja_list = this.listaCajasRegistradas.find((row: any) => row.token_caja === token_caja);
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && typeof token_caja !== 'undefined';
    caja_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.aumentaImporteAll();
    console.log(caja_list);
  }

  selectCuentaDisp(event: any, token_cuenta: any) {
    const cuent = this.listaCuentasBancarias.find((row: any) => row.token_cuenta === token_cuenta);
    const validacion = token_cuenta != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    cuent.monto_aplicar = validacion && cuent.saldofloat < this.ordenes_pago_adeudo() ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumentaImporteAll();
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

  importeByCuenta(event: any, token_cuenta: any) {
    const cuent_list = this.listaCuentasBancarias.find((row: any) => row.token_cuenta === token_cuenta);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof cuent_list !== 'undefined';
    cuent_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.aumentaImporteAll();
    console.log(cuent_list);
  }

  selectMonederoElectronicoDisp(event: any, token_cuentaMon: any) {
    const cuent = this.listaCuentasMonederoElectronico.find((row: any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = token_cuentaMon != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    cuent.monto_aplicar = validacion && cuent.saldofloat < this.ordenes_pago_adeudo() ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumentaImporteAll();
  }

  importeByMonedero(event: any, token_cuentaMon: any) {
    const moned = this.listaCuentasMonederoElectronico.find((row: any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof moned !== 'undefined';
    moned.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.aumentaImporteAll();
    console.log(moned);
  }

  redacta_anticipo_aplicado(event: any): void {
    var importe_autorizado = 0;
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      importe_autorizado += parseFloat(row.importe_autorizado_final_simple);
    });

    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value <= this.proveedorAnticipoTotal && event.value <= importe_autorizado;
    this.proveedorAnticipoaplicado = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.calcula_anticipo_restante();
    this.aumentaImporteAll();
  }

  calcula_anticipo_restante() {
    this.proveedorAnticipoRestanteFormat = "$" + numeral(this.proveedorAnticipoTotal - this.proveedorAnticipoaplicado).format('0,0.' + '0'.repeat(this.pay_order_moneda_decimales)) + " " + this.pay_order_moneda_code;
  }

  selectSaldoProv(uuid_saldo: any, event: any) {
    const sald = this.ordenes_pago_listaProceso_prv_saldos_a_favor.find((row: any) => row.uuid_saldo === uuid_saldo);
    const validacion = uuid_saldo != "" && typeof sald !== 'undefined';
    sald.select_for_pagos = validacion ? event.checked : false;

    if (validacion) {
      sald.aplicable_disabled = sald.monto_real < this.ordenes_pago_adeudo() ? true : false;
      sald.monto_aplicar = sald.monto_real < this.ordenes_pago_adeudo() ? sald.monto_real : 0;
    }

    console.log(sald);
    this.aumentaImporteAll();
  }

  listar_anticipos_proveedor(token_cat_proveedores: any) {
    this.provSer.listarAnticiposDisponiblesProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response);
          console.log(response.anticipos_registrados);
          this.aplica_anticipo_a_proveedor = "";
          this.proveedorAnticipoTotal = response.anticipo_total;
          this.proveedorAnticipoTotalFormat = response.anticipo_total_format;
          this.proveedorAnticipoRestanteFormat = response.anticipo_total_format;
          this.proveedorAnticipos = response.anticipos_registrados;
        }
      }
    );
  }

  listar_saldos_a_favor_proveedor(token_cat_proveedores: any) {
    this.provSer.listarSaldosDisponiblesProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response.saldos_registrados);
          this.ordenes_pago_listaProceso_prv_saldos_a_favor = response.saldos_registrados;
        }
      }
    );
  }

  importeBySaldoProv(uuid_saldo: any, event: any) {
    const sald = this.ordenes_pago_listaProceso_prv_saldos_a_favor.find((row: any) => row.uuid_saldo === uuid_saldo);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof sald !== 'undefined';
    sald.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.aumentaImporteAll();
    console.log(sald);
  }

  keyupOrdenPImportePorPagar(event: any, token_ordenPago: any) {
    let ord = this.ordenes_pago_listaProceso.find((row: any) => row.token_ordenPago === token_ordenPago);
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && parseFloat(event.value) <= parseFloat(ord.importe_restante) && typeof ord !== 'undefined';
    ord.importe_por_pagar = validacion ? event.value : '0.00';
    ord.debe_simple = validacion ? parseFloat(ord.importe_restante) - parseFloat(ord.importe_por_pagar) : ord.importe_restante;
    ord.debe_format = validacion ? numeral(ord.debe_simple).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales.toString()))) : numeral(ord.importe_restante).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales.toString())));
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupObservacionPago(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.pay_order_observacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedPagoOrden(files: NgxFileDropEntry[]) {
    this.filespayOrder = files;
    this.ordPayAnexosNames = [];
    this.docsOrdPayAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsOrdPayAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.ordPayAnexosNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.docsOrdPayAnexos.length > 0) {
              for (let j = 0; j < this.docsOrdPayAnexos.length; j++) {
                const row = this.docsOrdPayAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsOrdPayAnexos.push(file);
                }
              }
            } else {
              this.docsOrdPayAnexos.push(file);
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
            this.filespayOrder.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsOrdPayAnexos.length);
  }

  public fileOverPagoOrden(event: any) {
    console.log(event);
  }

  public fileLeavePagoOrden(event: any) {
    console.log(event);
  }

  deleteAnexosPagoOrden(posicion: any) {
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
          this.filespayOrder.splice(posicion, 1);
          this.docsOrdPayAnexos.splice(posicion, 1);
          this.ordPayAnexosNames.splice(posicion, 1);
          console.log(this.docsOrdPayAnexos.length);
        }
      }
    );
  }

  get validate_pago_for_ord_buy_reem_prov_acree(): Boolean {
    const validacion_importe = this.pay_order_importe > 0 && this.validator.filtroNum(this.pay_order_importe) == true;
    const validacion_fecha_contabilizacion = this.pay_order_fecha_contabilizacion != "" && this.validator.filtroFecha(this.pay_order_fecha_contabilizacion);

    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.pay_order_moneda_code);
    const validacion_moneda = this.pay_order_moneda_code != '' && this.validator.filtroAlfaNumerico(this.pay_order_moneda_code) == true && typeof mnd !== 'undefined';

    const validacion_tipo_cambio = this.pay_order_tipo_cambio > 0 && this.validator.filtroNum(this.pay_order_tipo_cambio) == true;

    const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true);
    const OKCaja = typeof caja_list !== 'undefined' && caja_list.length > 0;
    const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true);
    const OKCuenta = typeof cuent_list !== 'undefined' && cuent_list.length > 0;
    const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true);
    const OKMoned = typeof moned_list !== 'undefined' && moned_list.length > 0;
    const sald_list = this.ordenes_pago_listaProceso_prv_saldos_a_favor.filter((row: any) => row.select_for_pagos === true);
    const validacion_salida_dinero = OKCaja || OKCuenta || OKMoned || (this.proveedorAnticipoaplicado > 0) || (sald_list !== 'undefined' && sald_list.length > 0);

    var importe_registrado_por_pagar = 0;
    const pagar_list = this.ordenes_pago_listaProceso.filter((row: any) => row.importe_por_pagar != "0.00");
    if (pagar_list.length == this.ordenes_pago_listaProceso.length) {
      this.ordenes_pago_listaProceso.forEach((row: any) => {
        importe_registrado_por_pagar += parseFloat(row.importe_por_pagar);
      });
    }
    const validacion_pagando = pagar_list.length == this.ordenes_pago_listaProceso.length && importe_registrado_por_pagar > 0 && this.pay_order_importe >= importe_registrado_por_pagar;

    const validacion_observacion = this.pay_order_observacion != "" && this.validator.strFilter(this.pay_order_observacion) == true && this.pay_order_observacion.length >= 4;
    const validacion_documents = this.ordPayAnexosNames.length > 0;

    return validacion_fecha_contabilizacion && validacion_importe && validacion_moneda && validacion_tipo_cambio && validacion_salida_dinero && validacion_pagando && validacion_observacion && validacion_documents;
  }

  onSavePagoSimple(form: NgForm): void {
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
        this.orden_pago_simple_form = false;
        const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true);
        const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true);
        const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true);
        const sald_list = this.ordenes_pago_listaProceso_prv_saldos_a_favor.filter((row: any) => row.select_for_pagos === true);
        this.ordenPago.confirmaPagoSimple(
          this.pay_order_importe,
          this.pay_order_fecha_contabilizacion,
          caja_list,
          cuent_list,
          moned_list,
          this.proveedorAnticipoaplicado,
          sald_list,
          //proveedor
          this.ordenes_pago_listaProceso_prv_token,
          //calculo_total
          this.calculaTotalSaldoSimple(),
          this.pay_order_moneda_code,
          this.pay_order_tipo_cambio,
          this.pay_order_forma_pago,
          this.ordenes_pago_listaProceso,
          this.pay_order_observacion,
          this.docsOrdPayAnexos).subscribe(
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
                //setTimeout(function(e:any){e.reembolsosLista();},3000);
                this.calculaTotalSaldo();
                this.relInterna.mensajePagoRealizado("pago_orden_general_realizado");
                this.orden_pago_simple_form = true;
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

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
