import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { SessionContextService } from '../../../../../servicios/session-context';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import numeral from 'numeral';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'fnzs_pago_nomina_especie_form_component',
  standalone: false,
  templateUrl: './pago-nomina-especie-component.html',
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
    './pago-nomina-especie-component.css',
  ]
})
export class PagoNominaEspecieComponent implements OnInit, OnChanges, OnDestroy{
  @Input() orden_de_pago!: string;
  @Input() nominas_especie!: string;

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


  @ViewChild('formRegistroPagoESNomina') formRegistroPagoESNomina!: NgForm;
  public orden_pago_nomina_especie_form: boolean = false;
  private destruir$ = new Subject<void>();
  pay_order_moneda_opcion = null;
  
  //procesos
  //importes 
  public importe_total_deuda: number = 0;
  public importe_total_pagos_realizados: number = 0;
  public importe_total_deuda_restante: number = 0;
  
  public pay_order_fecha_contabilizacion: string = "";
  public pay_order_importe: number = 0;
  public pay_importe: number = 0;
  public pay_order_moneda_code: string = "";
  public pay_order_moneda_decimales: number = 0;
  public pay_order_tipo_cambio: number = 1.00;
  public pay_order_forma_pago: string = "";

  ordenes_pago_listaProceso: any = [];
  searchPagolistaProceso: any = [];

  public pay_order_observacion: string = "";
  public ordPayAnexosNames: any = [];
  public docsOrdPayAnexos: any[] = [];
  public filespayOrder: NgxFileDropEntry[] = [];

  constructor(
    private ordenDisper: NominaDispersionService,
    private ordenPago: OrdenPagoService,
    private _cajServ: CajaServService,
    private cuentaBan: CuentbancService,
    private monedero: MonederoElectService,
    private _monedasServ: MonedasService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private sessionContext: SessionContextService,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.search_cajas_registradas = ['caja_folio', 'caja_alias', 'establecimiento', 'salDoCaja', 'select_for_pagos', 'token_caja'];
    this.search_cuentas_bancarias = ['select_for_pagos', 'folio_cuenta', 'banco_clave', 'banco_nombre_comercial', 'token_cuenta', 'cuenta_bancaria', 'cuenta_view', 'cuenta_time', 'saldo_cuenta_format'];
    this.search_cuentas_monedero_electronico = ['select_for_pagos', 'token_cuentaMon', 'folio_cuenta', 'monedero', 'cuenta_frontend', 'saldo_cuenta_format'];
    this.searchPagolistaProceso = ['id', 'folio_ordenPago', 'orden_emisor_personal_nombre', 'orden_emisor_emp', 'factura_relacionada_string', 'importe_total_inicial', 'importe_autorizado_inicial_format',
      'importe_autorizado_final', 'importe_restante_format'];

    this.emp_moneda_code = this.sessionContext.empresa_data?.e_moneda_code;
    this.emp_moneda_decimales = this.sessionContext.empresa_data?.e_moneda_decimales;
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
    );
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

  ngOnChanges(changes: SimpleChanges): void {
    const cambioOrden = changes['orden_de_pago'];
    const cambioEspecie = changes['nominas_especie'];
    if (cambioOrden || cambioEspecie) {      
      if (this.orden_de_pago && this.nominas_especie) {
        this.orden_pago_nomina_especie_form = false;
        this.ordenPago.pagoNominaEspecieDesglose(this.orden_de_pago, this.nominas_especie).pipe(takeUntil(this.destruir$)).subscribe(
          response => {
            if (response.status == 'success') {
              console.log(response);
              this.orden_pago_nomina_especie_form = true;
              this.limpiaSeccionPagos();
              this.ordenes_pago_listaProceso = response.desglose;
              this.showCajasRegistradas();
              this.getCuentasBancarias();
              this.getMonederosElectronicos();
              this.monedas_lista();
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  limpiaSeccionPagos() {
    this.listaCajasRegistradas = [];
    this.listaCuentasBancarias = [];
    this.listaCuentasMonederoElectronico = [];
    this.ordenes_pago_listaProceso = [];
    this.pay_order_moneda_opcion = null;
    this.pay_order_fecha_contabilizacion = "";
    //this.validator.limpiaInputRow(document.getElementById("fechaContabilizacionPago"));
    this.pay_order_importe = 0;
    this.pay_importe = 0;
    this.pay_order_moneda_code = "";
    this.pay_order_moneda_decimales = 0;
    //this.validator.limpiaInputRow(document.getElementById("selectedMonedaCode"));
    console.log("selectedMonedaCode");
    this.pay_order_tipo_cambio = 1.00;
    //this.validator.limpiaInputRow(document.getElementById("pagos_tipo_cambio"));
    //$("#pagos_tipo_cambio").val(this.pay_order_tipo_cambio);
    this.pay_order_forma_pago = "";
    //this.validator.limpiaInputRow(document.getElementById("pagos_forma_pago"));
    this.pay_order_observacion = "";
    //this.validator.limpiaTextarea(document.getElementById("pago_large_observ"));
    this.ordPayAnexosNames = [];
    this.docsOrdPayAnexos = [];
    this.filespayOrder = [];
    //$('#modalEnviaEvidenciasMultiPago').modal('hide');
    //$('.modal-backdrop').remove();
  }

  ordenPagoAdeudoNomiEspecieFormat() {
    var importe_autorizado = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";

    this.ordenes_pago_listaProceso.forEach((row: any) => {
      importe_autorizado += parseFloat(row.nomina_total_en_especie_simple);
      moneda_autorizada = row.nomina_esp_moneda_name;
    });

    // Redondeo seguro para evitar residuos de punto flotante en JS
    this.importe_total_deuda = Math.round(importe_autorizado * 100) / 100;

    // 2. Obtener decimales de la moneda (fuera del bucle para no sobrecargar el proceso)
    if (moneda_autorizada) {
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === moneda_autorizada);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    }
    // 3. Evaluar la cantidad de decimales a aplicar según tu prioridad
    const numDecimales = parseInt(
      this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales
    ) || 2;
    // 4. Construir la máscara de Numeral y armar el string final
    const mascaraDecimales = numDecimales > 0 ? '.' + '0'.repeat(numDecimales) : '';
    const monedaFinal = this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada;
    return "$" + numeral(this.importe_total_deuda).format('0,0' + mascaraDecimales) + " " + monedaFinal;
  }

  pagos_anteriores() {
    var pagos_total = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";

    // 1. Sumar e iterar obteniendo la moneda de las filas
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      pagos_total += parseFloat(row.pagos_realizados) || 0;
      moneda_autorizada = row.nomina_moneda_name;
    });

    // Redondeo seguro para evitar residuos de punto flotante en JS
    this.importe_total_pagos_realizados = Math.round(pagos_total * 100) / 100;

    // 2. Obtener decimales de la moneda (fuera del bucle para no sobrecargar el proceso)
    if (moneda_autorizada) {
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === moneda_autorizada);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    }
    // 3. Evaluar la cantidad de decimales a aplicar según tu prioridad
    const numDecimales = parseInt(
      this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales
    ) || 2;
    // 4. Construir la máscara de Numeral y armar el string final
    const mascaraDecimales = numDecimales > 0 ? '.' + '0'.repeat(numDecimales) : '';
    const monedaFinal = this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada;
    return "$" + numeral(this.importe_total_pagos_realizados).format('0,0' + mascaraDecimales) + " " + monedaFinal;
  }

  deuda_menos_pagos() {
    var deuda_total = 0;
    var pagos_previos = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";

    // 1. Sumar e iterar obteniendo la moneda de las filas
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      deuda_total += parseFloat(row.nomina_total_efectivo_simple);
      pagos_previos += parseFloat(row.pagos_realizados);
      moneda_autorizada = row.nomina_moneda_name;
    });
    
    // Redondeo seguro para evitar residuos de punto flotante en JS
    var deuda_total_actualizada = deuda_total - pagos_previos;
    this.importe_total_deuda_restante = Math.round(deuda_total_actualizada * 100) / 100;

    // 2. Obtener decimales de la moneda (fuera del bucle para no sobrecargar el proceso)
    if (moneda_autorizada) {
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === moneda_autorizada);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    }
    // 3. Evaluar la cantidad de decimales a aplicar según tu prioridad
    const numDecimales = parseInt(
      this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales
    ) || 2;
    // 4. Construir la máscara de Numeral y armar el string final
    const mascaraDecimales = numDecimales > 0 ? '.' + '0'.repeat(numDecimales) : '';
    const monedaFinal = this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada;
    return "$" + numeral(this.importe_total_deuda_restante).format('0,0' + mascaraDecimales) + " " + monedaFinal;
  }

  calculaTotalParaAplicar():string {
    var importe_autorizado = this.pay_order_importe || 0;//this.pay_order_importe;
    // Normalizamos el número de decimales garantizando que sea un entero válido >= 0
    const numDecimales = Math.max(0, parseInt(this.pay_order_moneda_decimales?.toString() || '2', 10));
  
    // Construimos la máscara de Numeral (.00, .000, etc.) de forma segura
    const mascaraDecimales = numDecimales > 0 ? '.' + '0'.repeat(numDecimales) : '.00';

    // Agregamos la clave de la moneda si existe
    const codigoMoneda = this.pay_order_moneda_code ? ` ${this.pay_order_moneda_code}` : ' MXN';

    return "$" + numeral(importe_autorizado).format('0,0' + mascaraDecimales) + codigoMoneda;
  }

  calculaTotalPagandoEspecieNomina():any {
    if (!this.ordenes_pago_listaProceso || this.ordenes_pago_listaProceso.length === 0) {
      return 0;
    }
    
    // 1. Sumar los montos asignados a cada trabajador
    const total = this.ordenes_pago_listaProceso.reduce((acc: number, row: any) => {
      // Tomamos el importe ingresado en la fila o 0 si está vacío
      const montoFila = parseFloat(row.importe_por_pagar || 0) || 0;
      return acc + montoFila;
    }, 0);
    console.log(total);

    // 2. Redondeo seguro a 2 decimales para evitar residuos (ej. 1500.0000000000002)
    return Math.round(total * 100) / 100;
  }

  calculaTotalPagandoEspecieNominaFormat() {
    var importe_autorizado = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      importe_autorizado += parseFloat(row.importe_por_pagar);
      moneda_autorizada = row.nomina_moneda_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.nomina_moneda_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });
    return numeral(importe_autorizado).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales))) + " " + (this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada);
  }

  calculaTotalEspecieNominaSaldo() {
    // 1. Esto ya comprobamos que da 2, está perfecto
    const decimalesConfig = typeof this.pay_order_moneda_decimales !== 'undefined' 
      ? parseInt(this.pay_order_moneda_decimales.toString(), 10) 
      : 2;
  
    const numeroDecimales = isNaN(decimalesConfig) || decimalesConfig < 0 ? 0 : decimalesConfig;
  
    let total_por_pagar = 0;
    
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      const importeRow = parseFloat(row.importe_por_pagar);
      const importeValido = isNaN(importeRow) ? 0 : importeRow;
      
      // CAMBIO AQUÍ: Primero sumamos los números flotantes ordinarios, y al resultado de la suma le aplicamos el toFixed(2)
      total_por_pagar = parseFloat((total_por_pagar + importeValido).toFixed(numeroDecimales));
    });
    
    // 2. Validar y parsear el importe principal de la orden de pago
    const payOrderImporte = parseFloat(this.pay_order_importe?.toString() || '0');
    const payOrderImporteValido = isNaN(payOrderImporte) ? 0 : payOrderImporte;
  
    // CAMBIO AQUÍ TAMBIÉN: A la resta final le aplicamos el toFixed(2) para limpiar el saldo definitivo
    const saldo_restante = parseFloat((payOrderImporteValido - total_por_pagar).toFixed(numeroDecimales));
    
    // Este log ahora sí te va a pintar 0 en lugar de -3.63e-12
    console.log('Saldo Restante Corregido:', saldo_restante);
    
    // 4. Construir el formato de Numeral
    const formatoNumeral = numeroDecimales > 0 ? `0,0.${'0'.repeat(numeroDecimales)}` : '0,0';
    return `${numeral(saldo_restante).format(formatoNumeral)} ${this.pay_order_moneda_code}`;
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

    this.pay_order_importe = suma_order_importe + parseFloat(this.pay_importe.toString());
    console.log(this.pay_order_importe);
    if (this.ordenes_pago_listaProceso.length == 1) {
      let ord = this.ordenes_pago_listaProceso[0];
      ord.importe_por_pagar = this.pay_order_importe > ord.importe_restante ? ord.importe_restante : this.pay_order_importe;
      ord.debe_simple = parseFloat(ord.importe_restante) - parseFloat(ord.importe_por_pagar);
      ord.debe_format = numeral(ord.debe_simple).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales.toString())));
    }
  }

  calculaTotalSaldo() {
    var total_por_pagar = 0;
    var moneda_autorizada = "";
    var moneda_autorizada_decimales = "";
    this.ordenes_pago_listaProceso.forEach((row: any) => {
      total_por_pagar += parseFloat(row.importe_por_pagar);
      moneda_autorizada = row.orden_moneda_final_autorizada_name;
      const mnd = this.catalogo_monedas_api.find((mon: any) => mon.code === row.orden_moneda_final_autorizada_name);
      moneda_autorizada_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    });

    var saldo_restante = parseFloat(this.pay_order_importe.toString()) - total_por_pagar;
    return numeral(saldo_restante).format('0,0.' + '0'.repeat(parseInt(this.pay_order_moneda_decimales > 0 ? this.pay_order_moneda_decimales.toString() : moneda_autorizada_decimales))) + " " + (this.pay_order_moneda_code != '' ? this.pay_order_moneda_code : moneda_autorizada);
  }

  select_fecha_contabilizacion(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.pay_order_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.pay_order_fecha_contabilizacion);
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

  //caja
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
    validacion ? this.aumentaImporteAll() : null;
    console.log(caja_list);
  }

  //CuentasBancarias
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
    validacion ? this.aumentaImporteAll() : null;
    console.log(cuent_list);
  }

  //MonederoElectronico
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
    validacion ? this.aumentaImporteAll() : null;
    console.log(moned);
  }
  
  keyupOrdenPImporteEspeciePorPagar(event: any, token_especie_desglose: any) {
    let ord = this.ordenes_pago_listaProceso.find((row: any) => row.token_especie_desglose === token_especie_desglose);
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

  get validate_pago_for_nomina_especie(): Boolean {
    const validacion_importe = this.pay_order_importe > 0 && this.validator.filtroNum(this.pay_order_importe) == true;
    const validacion_fecha_contabilizacion = this.pay_order_fecha_contabilizacion != "" && this.validator.filtroFecha(this.pay_order_fecha_contabilizacion);

    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.pay_order_moneda_code);
    const validacion_moneda = this.pay_order_moneda_code != '' && this.validator.filtroAlfaNumerico(this.pay_order_moneda_code) == true && typeof mnd !== 'undefined';

    const validacion_tipo_cambio = this.pay_order_tipo_cambio > 0 && this.validator.filtroNum(this.pay_order_tipo_cambio) == true;

    const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true);
    const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true);
    const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true);
    const validacion_salida_dinero = (typeof caja_list !== 'undefined' && caja_list.length > 0) || (typeof cuent_list !== 'undefined' && cuent_list.length > 0) || (typeof moned_list !== 'undefined' && moned_list.length > 0);// || (this.proveedorAnticipoaplicado > 0) || (sald_list !== 'undefined' && sald_list.length > 0);

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
    //this.ordPay_validate_to_save = true;
  }

  onSavePagoNominaEspecie(form: NgForm): void {
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
        this.orden_pago_nomina_especie_form = false;
        const caja_list = this.listaCajasRegistradas.filter((row: any) => row.select_for_pagos === true);
        const cuent_list = this.listaCuentasBancarias.filter((row: any) => row.select_for_pagos === true);
        const moned_list = this.listaCuentasMonederoElectronico.filter((row: any) => row.select_for_pagos === true);
        //const sald_list = this.ordenes_pago_listaProceso_prv_saldos_a_favor.filter((row:any) => row.select_for_pagos === true);
        this.ordenPago.confirmaPagoEspecieNomina(
          this.orden_de_pago,
          this.nominas_especie,
          this.pay_order_importe,
          this.pay_order_fecha_contabilizacion,
          caja_list,
          cuent_list,
          moned_list,
          this.calculaTotalSaldo(),
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
                this.orden_pago_nomina_especie_form = true;
                this.calculaTotalSaldo();
                this.showCajasRegistradas();
                this.getCuentasBancarias();
                this.getMonederosElectronicos();
                form.reset();
                form.resetForm();
                this.limpiaSeccionPagos();
                this.formRegistroPagoESNomina.resetForm();
                this.relInterna.mensajePagoRealizado("dispersion_nomina_realizada");
                //this.refreshData();
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
