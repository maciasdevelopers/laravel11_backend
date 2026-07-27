import { Component, OnInit } from '@angular/core';
import { MovimientosDineroService } from '../../../../../servicios/ssic/movimientos-dinero.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { InterfPagoForma } from '../../../../../interfaces/interf-pago-forma';
import { FormaPagoService } from '../../../../../servicios/ssic/forma-pago.service';

import { MetodoPagoServService } from '../../../../../servicios/ssic/metodo-pago-serv.service';
import { InterfMetodoPago } from '../../../../../interfaces/interf-metodo-pago';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonedasService } from '../../../../../servicios/monedas.service';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';

import { ClientesService } from '../../../../../servicios/ssic/clientes.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import numeral from 'numeral';
import { SessionContextService } from '../../../../../servicios/session-context';

@Component({
  selector: 'app-control-mov-banc',
  templateUrl: './control-mov-banc.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/navegador.css',
    '../../finanzas.css',
    './control-mov-banc.component.css']
})
export class ControlMovBancComponent implements OnInit {
  public identidad: any;
  public token_cuenta_banc:string;
  public name_cuenta_banc:string;
  public name_banc:string;
  public saldo_cuenta_banc:string;
  public moneda_cuenta_token:string;
  public moneda_cuenta_name:string; 
  list_clientes:any = [];
  list_proveedores:any = [];
  list_empleados:any = [];
  array_metodo_pago: InterfMetodoPago[] = [];
  array_forma_pago: InterfPagoForma[] = [];
  arrayMonedas:any = [];
  searchCuentMovBanc:any;
  pageCuentMovBanc: number = 1;
  arrayCuentMovBanc:any = [];

  public modulo_registro_ajuste:boolean = false;

  arrayCuentBanc:any = [];

  //registro de ajute
    public tipo_de_poliza:string;
    public forma_operacion:string;
    public fecha_movimiento:string;
    public saldo_ajuste:string;
    public origen_destino_movimiento:string;
    public lista_clientes:any = [];
    public token_cliente:string;
    public lista_proveedores:any = [];
    public token_proveedor:string;
    public lista_empleados:any = [];
    public token_empleado:string;

    public bool_cfdi_vinculado:boolean = false;
    public cfdi_data:any = [];
    public cfdi_fecha_emision:string;
    public cfdi_folio_interno:string;
    public cfdi_folio_fiscal:string;
    public cfdi_token_metodo_pago:string;
    public cfdi_name_metodo_pago:string;
    public cfdi_token_forma_pago:string;
    public cfdi_name_forma_pago:string;
    public cfdi_importe_total:string;
    public cfdi_importe_aplicado:string;
    public cfdi_importe_restante:string;
    public cfdi_token_moneda:string;
    public cfdi_name_moneda:string;
    public cfdi_data_bool:boolean = false;
    public facturas_importe_total:string;
    public facturas_importe_restante:string;
    
    public bool_registro_nuevo:boolean = false;

  constructor(
    private sentinela: SentinelArkManager,
    private monedasServ:MonedasService,
    private cuentaBan:CuentbancService,
    private sessionContext: SessionContextService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private encryptor:ServEncryptService,
    private _client:ClientesService,
    private _prov:ProveedoresService,
    private _persServ:EmpleadosService,
    private _fpago:FormaPagoService,
    private _metPago:MetodoPagoServService,
    private mov_banc:MovimientosDineroService
  ) { 
    this.identidad = this.sentinela.getIdentifUsuario();
    this.token_cuenta_banc = "";
    this.name_cuenta_banc = "seleccione cuenta bancaria";
    this.name_banc = "---";
    this.saldo_cuenta_banc = numeral("0.00").format('$0,0.00');
    this.moneda_cuenta_token = "";
    this.moneda_cuenta_name = "";
    //registro de ajute
    this.tipo_de_poliza = "";
    this.forma_operacion = "";
    this.fecha_movimiento = "";
    this.origen_destino_movimiento = "";
    this.token_cliente = "";
    this.token_proveedor = "";
    this.token_empleado = "";
    this.cfdi_fecha_emision = "";
    this.cfdi_folio_interno = "";
    this.cfdi_folio_fiscal = "";
    this.cfdi_token_metodo_pago = "";
    this.cfdi_name_metodo_pago = "";
    this.cfdi_token_forma_pago = "";
    this.cfdi_name_forma_pago = "";
    this.cfdi_importe_total = "";
    this.cfdi_importe_aplicado = "";
    this.cfdi_importe_restante = numeral("0").format('$0,0.00');
    this.cfdi_token_moneda = "";
    this.cfdi_name_moneda = "";
    this.facturas_importe_total = numeral("0").format('$0,0.00');
    this.facturas_importe_restante = numeral("0").format('$0,0.00');
    this.saldo_ajuste = "";
  }

  ngOnInit(): void {
    this._client.catalogoClientesGeneral('all_partidas','','').subscribe(
      response => {
        if (response.status == 'success') {
          response.clientes.sort((a:any,b:any) => a.nombre.localeCompare(b.nombre));
          this.list_clientes = response.clientes;
          console.log(this.list_clientes);
        }
      },
      error => {
        console.log(error);
      }
    );

    this._prov.catalogoProveedoresForProcesos().subscribe(
      response => {
        if (response.status == 'success') {
          response.proveedores.sort((a:any,b:any) => a.nombre.localeCompare(b.nombre));
          this.list_proveedores = response.proveedores;
          console.log(this.list_proveedores);
        }
      },
      error => {
        console.log(error);
      }
    );

    this._persServ.catalogoGeneralTrabajadores().subscribe(
      response => {
        if (response.status == 'success') {
          response.empleados.sort((a:any,b:any) => a.nombre_completo.localeCompare(b.nombre_completo));
          this.list_empleados = response.empleados;
          console.log(this.list_empleados);
        }
      },
      error => {
        console.log(error);
      }
    );

    this._metPago.getMetodo().subscribe((data:InterfMetodoPago[]) => {
      this.array_metodo_pago = data;
      //console.log(this.arraYMetodoPago);
    });

    this._fpago.getformapago().subscribe((data:InterfPagoForma[]) => {
      this.array_forma_pago = data;
      console.log(this.array_forma_pago);
    });

    this.monedasServ.getMonedasDos().subscribe((data) => {
      this.arrayMonedas = data;
      console.log(data);
      //
    });

    this.recargaListaCuentaBancaria();
  }

  recargaListaCuentaBancaria(){
    this.cuentaBan.catCuentasBancariasCompras('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayCuentBanc = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectCuentaBancaria(event:any){
    if (event.value != "") {
      for (let i = 0; i < this.arrayCuentBanc.length; i++) {
        const cuenta_banc = this.arrayCuentBanc[i];
        if (cuenta_banc["token_cuenta"] == event.value) {
          /*this.mov_banc.catalogoMovimientosBancCuenta(event.value).subscribe(
            response => {
              console.log(response.status);
              if (response.status == 'success') {
                //this.arrayListaDelCaja = response.caja;
                this.token_cuenta_banc = event.value;
                this.name_cuenta_banc = cuenta_banc["cuenta"];
                this.name_banc = cuenta_banc["claveBanco"]+" "+cuenta_banc["nombre_comercial"];
                
                this.arrayCuentMovBanc = response.movimientos;
                for (let i = 0; i < this.arrayCuentMovBanc.length; i++) {
                  console.log(this.arrayCuentMovBanc[i]['numero_cuenta_back']);
                  var cuentaCifrado = this.encryptor.esclavo_strong(this.arrayCuentMovBanc[i]['numero_cuenta_back']);
                  console.log(cuentaCifrado);
                  this.arrayCuentMovBanc[i]['numero_cuenta'] = cuentaCifrado.replace(cuentaCifrado.substring(cuentaCifrado.length-4,0),'**** **** **** ');
                  //console.log(this.arrayCuentBanc[i]['cuenta']);
                }
                this.saldo_cuenta_banc = response.saldo_cuenta;
                console.log(this.arrayCuentMovBanc);
              }
            },
            error =>{
              console.log(error);
            }
          )*/
        }
      }
    } else {
      this.token_cuenta_banc = "";
      this.name_cuenta_banc = "seleccione cuenta bancaria";
      this.name_banc = "---";
    }
  }

  catalogoMovimientosBancCuentaWithToken(token_cuenta:any){
    /*this.mov_banc.catalogoMovimientosBancCuenta(token_cuenta).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          //this.arrayListaDelCaja = response.caja;
          this.arrayCuentMovBanc = response.movimientos;
          for (let i = 0; i < this.arrayCuentMovBanc.length; i++) {
            console.log(this.arrayCuentMovBanc[i]['numero_cuenta_back']);
            var cuentaCifrado = this.encryptor.esclavo_strong(this.arrayCuentMovBanc[i]['numero_cuenta_back']);
            console.log(cuentaCifrado);
            this.arrayCuentMovBanc[i]['numero_cuenta'] = cuentaCifrado.replace(cuentaCifrado.substring(cuentaCifrado.length-4,0),'**** **** **** ');
            //console.log(this.arrayCuentBanc[i]['cuenta']);
          }
          this.saldo_cuenta_banc = response.saldo_cuenta;
          console.log(this.arrayCuentMovBanc);
        }
      },
      error =>{
        console.log(error);
      }
    )*/
  }

//registro de ajuste
  changeBoolaRegistro(){
    if (this.modulo_registro_ajuste == false) {
      this.modulo_registro_ajuste = true;
    } else {
      this.modulo_registro_ajuste = false;
    }
    //const doc = new jsPDF();
    //doc.html(document.body, {
    //  callback: function (doc) {
    //    doc.save();
    //  },
    //  x: 20,
    //  y: 20
    //});
  }

  selectTipoPoliza(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.tipo_de_poliza = event.value;
      this.validator.correctoSelectBrowser(event);
    } else {
      this.tipo_de_poliza = "";
      this.validator.errorSelectBrowser(event);
    }
    this.validacion_general_registro();
  }

  selectFormaOperacion(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.forma_operacion = event.value;
      this.validator.correctoSelectBrowser(event);
    } else {
      this.forma_operacion = "";
      this.validator.errorSelectBrowser(event);
    }
    this.validacion_general_registro();
  }

  validaFechaMovimiento(event:any){
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.fecha_movimiento = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.fecha_movimiento = "";
      this.validator.errorInputRow(event);
    }
    this.validacion_general_registro();
  }

  validaSaldoAjuste(event:any){
    if(event.value != '' && this.validator.filtroNum(event.value) == true){
      //this.saldo_ajuste = event.value;
      //this.validator.correctoInputRow(event);
      if (this.cfdi_data.length != 0) {
        var suma_facturas:any = 0;
        var restante_facturas:any = 0;
        for (let i = 0; i < this.cfdi_data.length; i++) {
          const row_cfdi = this.cfdi_data[i];
          suma_facturas = parseFloat(suma_facturas) + parseFloat(row_cfdi["importe_aplicado"]);
        }

        if (event.value >= suma_facturas) {
          console.log("suma_facturas "+suma_facturas);
          this.saldo_ajuste = event.value;
          this.facturas_importe_total = numeral(suma_facturas).format('$0,0.00');
          restante_facturas = parseFloat(this.saldo_ajuste) - parseFloat(suma_facturas);
          this.facturas_importe_restante = numeral(restante_facturas).format('$0,0.00');
          this.validator.correctoInputRow(event);
        } else {
          this.saldo_ajuste = "";
          this.validator.errorInputRow(event);
        }
      } else {
        this.saldo_ajuste = event.value;
        console.log("cfdi_data.length "+this.cfdi_data.length+" saldo_ajuste "+this.saldo_ajuste);
        this.validator.correctoInputRow(event);
      }

    } else {
      this.saldo_ajuste = "";
      this.validator.errorInputRow(event);
    }
    this.validacion_general_registro();
  }

  validaOrigenDestinoMovimiento(event:any){
    this.token_cliente = "";
    this.token_proveedor = "";
    this.token_empleado = "";
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.origen_destino_movimiento = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.origen_destino_movimiento = "";
      this.validator.errorInputRow(event);
    }
    this.validacion_general_registro();
  }

  validaCliente(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.list_clientes.length; i++) {
        const row = this.list_clientes[i];
        if (row["nombre"] == event.value) {
          this.validator.correctoInputRow(event);
          this.token_cliente = row["token_client"];
          this.validacion_general_registro();
          return;
        } else {
          this.validacion_general_registro();
          this.validator.errorInputRow(event);
          this.token_cliente = "";
        }
      } 
    } else {
      this.validacion_general_registro();
      this.validator.errorInputRow(event);
      this.token_cliente = "";
    }
  }

  validaProveedor(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.list_proveedores.length; i++) {
        const row = this.list_proveedores[i];
        if (row["nombre"] == event.value) {
          this.validator.correctoInputRow(event);
          this.token_proveedor = row["token_cat_proveedores"];
          this.validacion_general_registro();
          return;
        } else {
          this.validacion_general_registro();
          this.validator.errorInputRow(event);
          this.token_proveedor = "";
        }
      } 
    } else {
      this.validacion_general_registro();
      this.validator.errorInputRow(event);
      this.token_proveedor = "";
    }
  }

  validaEmpleado(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.list_empleados.length; i++) {
        const row = this.list_empleados[i];
        if (row["nombre_completo"] == event.value) {
          this.validator.correctoInputRow(event);
          this.token_empleado = row["token_empleado_inside"];
          this.validacion_general_registro();
          return;
        } else {
          this.validacion_general_registro();
          this.validator.errorInputRow(event);
          this.token_empleado = "";
        }
      } 
    } else {
      this.validacion_general_registro();
      this.validator.errorInputRow(event);
      this.token_empleado = "";
    }
  }

  cfdiVinculadoExist(){
    if (this.bool_cfdi_vinculado == false) {
      if(this.saldo_ajuste != '' && this.validator.filtroNum(this.saldo_ajuste) == true){
        this.bool_cfdi_vinculado = true;
      } else {
        this.bool_cfdi_vinculado = false;
        Swal.fire({
          position:'top-end',
          icon: 'warning',
          title: "Para poder habilitar esta sección debe registrar el importe total de la operación",
          //title: translate_response,
          showConfirmButton:false,
          timer: 3000
        })
      }
    } else {
      this.bool_cfdi_vinculado = false;
    }
    this.validacion_general_registro();
  }

  validaCfdiFechaEmision(event:any){
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.cfdi_fecha_emision = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.cfdi_fecha_emision = "";
      this.validator.errorInputRow(event);
    }
    this.validacion_cfdi_data();
  }

  validaCfdifolioInterno(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.cfdi_folio_interno = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.cfdi_folio_interno = "";
    }
    this.validacion_cfdi_data();
  }

  validaCfdiUuid(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.cfdi_folio_fiscal = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.cfdi_folio_fiscal = "";
    }
    this.validacion_cfdi_data();
  }

  metodoPagoCfdiChange(event:any){
    if(event.value != ''){
      this.validator.correctoSelectBrowser(event);
      for (let i = 0; i < this.array_metodo_pago.length; i++) {
        const method = this.array_metodo_pago[i];
        if (method["token_metodopago"] == event.value) {
          this.cfdi_token_metodo_pago = method["token_metodopago"];
          this.cfdi_name_metodo_pago = method["abrev"]+" "+method["metodo"];
        }
      }
    } else {
      this.validator.errorSelectBrowser(event);
      this.cfdi_token_metodo_pago = "";
      this.cfdi_name_metodo_pago = ""; 
    }
    this.validacion_cfdi_data();
  }

  formaPagoCfdiChange(event:any){
    if(event.value != ''){
      this.cfdi_token_forma_pago = event.value;
      this.validator.correctoSelectBrowser(event);
      for (let i = 0; i < this.array_forma_pago.length; i++) {
        const f_pago = this.array_forma_pago[i];
        if (f_pago['token_formapago'] == event.value) {
          this.cfdi_token_forma_pago = f_pago['token_formapago'];  
          this.cfdi_name_forma_pago = f_pago["clave"]+" "+f_pago["forma"];
        }
      }
    } else {
      this.validator.errorSelectBrowser(event);
      this.cfdi_token_forma_pago = "";
      this.cfdi_name_forma_pago = "";
    }
    this.validacion_cfdi_data();
  }

  validaCfdiImporteTotal(event:any){
    if(event.value != '' && this.validator.filtroNum(event.value) == true){
      this.cfdi_importe_total = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.cfdi_importe_total = "";
      this.validator.errorInputRow(event);
    }
    this.validacion_cfdi_data();
    this.cfdiCalculaImporteRestante();

  }

  validaCfdiImporteAplicado(event:any){
    if(event.value != '' && this.validator.filtroNum(event.value) == true){
      if(this.cfdi_data.length == 0){
        console.log(event.value+" <= "+this.saldo_ajuste)
        if(parseFloat(event.value) <= parseFloat(this.saldo_ajuste)){
          this.cfdi_importe_aplicado = event.value;
          this.validator.correctoInputRow(event);
          console.log("cfdi_importe_aplicado true");
        } else {
          this.cfdi_importe_aplicado = "";
          this.validator.errorInputRow(event);
          console.log("cfdi_importe_aplicado false");
        }
      } else {
        var suma_facturas:any = 0;
        var restante_facturas:any = 0;
        for (let i = 0; i < this.cfdi_data.length; i++) {
          const row_cfdi = this.cfdi_data[i];
          suma_facturas = parseFloat(suma_facturas) + parseFloat(row_cfdi["importe_aplicado"]);
        }
        restante_facturas = parseFloat(this.saldo_ajuste) - parseFloat(suma_facturas);
        if(event.value <= restante_facturas){
          this.cfdi_importe_aplicado = event.value;
          this.validator.correctoInputRow(event);
        } else {
          this.cfdi_importe_aplicado = "";
          this.validator.errorInputRow(event);
        }
      }
    } else {
      this.cfdi_importe_aplicado = "";
      this.validator.errorInputRow(event);
    }
    this.validacion_cfdi_data();
    this.cfdiCalculaImporteRestante();
  }

  cfdiCalculaImporteRestante(){
    var resta:any = parseFloat(this.cfdi_importe_total) - parseFloat(this.cfdi_importe_aplicado);
    this.cfdi_importe_restante = numeral(resta).format('$0,0.00');
  }

  monedaCfdiChange(event:any){
    console.log(event.value);
    if(event.value != "" && this.validator.filtroAlfaNumerico(event.value)){
      for (let i = 0; i < this.arrayMonedas.length; i++) {
        const money = this.arrayMonedas[i];
        if (money['moneda'] == event.value) {
          this.validator.correctoInputRow(event);
          this.cfdi_token_moneda = money["token_monedas"];
          this.cfdi_name_moneda = money["codigo"]+" - "+money["moneda"];
          this.validacion_cfdi_data();
          return;
        } else {
          this.validator.errorInputRow(event);
          this.cfdi_token_moneda = "";
          this.cfdi_name_moneda = "";
          this.validacion_cfdi_data();
        }
      }
    } else {
      this.validator.errorInputRow(event);
      this.cfdi_token_moneda = "";
      this.cfdi_name_moneda = "";
    }
  }

  validacion_cfdi_data(){
    var cfdiFechaEmision_txt = document.getElementById("cfdiFechaEmision_txt");
    var cfdifolioInterno_txt = document.getElementById("cfdifolioInterno_txt");
    var cfdiUuid_txt = document.getElementById("cfdiUuid_txt");
    var cfdiMetodoPago = document.getElementById("cfdiMetodoPago");
    var cfdiFormaPago = document.getElementById("cfdiFormaPago");
    var moneda_selected = document.getElementById("moneda_selected");
    var cfdi_txt_importe_total = document.getElementById("cfdi_txt_importe_total");
    var cfdi_txt_importe_aplicado = document.getElementById("cfdi_txt_importe_aplicado");

    if ((this.cfdi_fecha_emision != "" && this.validator.filtroFecha(this.cfdi_fecha_emision) == true) &&
      (this.cfdi_folio_interno != "" && this.validator.filtroAlfaNumerico(this.cfdi_folio_interno) == true) &&
      (this.cfdi_folio_fiscal != "" && this.validator.filtroAlfaNumerico(this.cfdi_folio_fiscal) == true) &&
      (this.cfdi_token_metodo_pago != "") &&
      (this.cfdi_token_forma_pago != "") &&
      (this.cfdi_token_moneda != "" && this.validator.filtroAlfaNumerico(this.cfdi_token_moneda) == true) &&
      (this.cfdi_importe_total != "" && this.validator.filtroNum(this.cfdi_importe_total) == true) &&
      (this.cfdi_importe_aplicado != "" && this.validator.filtroNum(this.cfdi_importe_aplicado) == true)) {
      this.cfdi_data_bool = true;
    } else {
      this.cfdi_data_bool = false;
      if (this.cfdi_fecha_emision == "" || this.validator.filtroFecha(this.cfdi_fecha_emision) == false) {
        this.validator.errorInputRow(cfdiFechaEmision_txt);
      }

      if (this.cfdi_folio_interno == "" || this.validator.filtroAlfaNumerico(this.cfdi_folio_interno) == false) {
        this.validator.errorInputRow(cfdifolioInterno_txt);
      }

      if (this.cfdi_folio_fiscal == "" || this.validator.filtroAlfaNumerico(this.cfdi_folio_fiscal) == false) {
        this.validator.errorInputRow(cfdiUuid_txt);
      }
      
      if (this.cfdi_token_metodo_pago == "") {
        this.validator.errorSelectBrowser(cfdiMetodoPago);
      }

      if (this.cfdi_token_forma_pago == "") {
        this.validator.errorSelectBrowser(cfdiFormaPago);
      }

      if (this.cfdi_token_moneda == "" || this.validator.filtroAlfaNumerico(this.cfdi_token_moneda) == false) {
        this.validator.errorInputRow(moneda_selected);
      }

      if (this.cfdi_importe_total == "" || this.validator.filtroNum(this.cfdi_importe_total) == false) {
        this.validator.errorInputRow(cfdi_txt_importe_total);
      }

      if (this.cfdi_importe_aplicado == "" || this.validator.filtroNum(this.cfdi_importe_aplicado) == false) {
        this.validator.errorInputRow(cfdi_txt_importe_aplicado);
      }
    }
  }

  add_cfdi_data(){
    var cfdiFechaEmision_txt = document.getElementById("cfdiFechaEmision_txt");
    var cfdifolioInterno_txt = document.getElementById("cfdifolioInterno_txt");
    var cfdiUuid_txt = document.getElementById("cfdiUuid_txt");
    var cfdiMetodoPago = document.getElementById("cfdiMetodoPago");
    var cfdiFormaPago = document.getElementById("cfdiFormaPago");
    var moneda_selected = document.getElementById("moneda_selected");
    var cfdi_txt_importe_total = document.getElementById("cfdi_txt_importe_total");
    var cfdi_txt_importe_aplicado = document.getElementById("cfdi_txt_importe_aplicado");

    if ((this.cfdi_fecha_emision != "" && this.validator.filtroFecha(this.cfdi_fecha_emision) == true) &&
        (this.cfdi_folio_interno != "" && this.validator.filtroAlfaNumerico(this.cfdi_folio_interno) == true) &&
        (this.cfdi_folio_fiscal != "" && this.validator.filtroAlfaNumerico(this.cfdi_folio_fiscal) == true) &&
        (this.cfdi_token_metodo_pago != "") &&
        (this.cfdi_token_forma_pago != "") &&
        (this.cfdi_token_moneda != "" && this.validator.filtroAlfaNumerico(this.cfdi_token_moneda) == true) &&
        (this.cfdi_importe_total != "" && this.validator.filtroNum(this.cfdi_importe_total) == true) &&
        (this.cfdi_importe_aplicado != "" && this.validator.filtroNum(this.cfdi_importe_aplicado) == true)) {

        this.cfdi_data.push({
          "fecha_emision":this.cfdi_fecha_emision,
          "folio_interno":this.cfdi_folio_interno,
          "folio_fiscal":this.cfdi_folio_fiscal,
          "metodo_pago_token":this.cfdi_token_metodo_pago,
          "metodo_pago_name":this.cfdi_name_metodo_pago,
          "forma_pago_token":this.cfdi_token_forma_pago,
          "forma_pago_name":this.cfdi_name_forma_pago,
          "moneda_token":this.cfdi_token_moneda,
          "moneda_name":this.cfdi_name_moneda,
          "importe_total":this.cfdi_importe_total,
          "importe_total_format":numeral(this.cfdi_importe_total).format('$0,0.00'),
          "importe_aplicado":this.cfdi_importe_aplicado,
          "importe_aplicado_format":numeral(this.cfdi_importe_aplicado).format('$0,0.00'),
          "importe_restante":this.cfdi_importe_restante,
        });

        var suma_facturas:any = 0;
        var restante_facturas:any = 0;
        for (let i = 0; i < this.cfdi_data.length; i++) {
          const row_cfdi = this.cfdi_data[i];
          suma_facturas = parseFloat(suma_facturas) + parseFloat(row_cfdi["importe_aplicado"]);
        }
        this.facturas_importe_total = numeral(suma_facturas).format('$0,0.00');
        restante_facturas = parseFloat(this.saldo_ajuste) - parseFloat(suma_facturas);
        this.facturas_importe_restante = numeral(restante_facturas).format('$0,0.00');

        this.validator.limpiaInputRow(cfdiFechaEmision_txt);
        this.validator.limpiaInputRow(cfdifolioInterno_txt);
        this.validator.limpiaInputRow(cfdiUuid_txt);
        this.validator.limpiaSelect(cfdiMetodoPago);
        this.validator.limpiaSelect(cfdiFormaPago);
        this.validator.limpiaInputRow(moneda_selected);
        this.validator.limpiaInputRow(cfdi_txt_importe_total);
        this.validator.limpiaInputRow(cfdi_txt_importe_aplicado);
    
        this.cfdi_fecha_emision = "";
        this.cfdi_folio_interno = "";
        this.cfdi_folio_fiscal = "";
        this.cfdi_token_metodo_pago = "";
        this.cfdi_name_metodo_pago = "";
        this.cfdi_token_forma_pago = "";
        this.cfdi_name_forma_pago = "";
        this.cfdi_token_moneda = "";
        this.cfdi_name_moneda = "";
        this.cfdi_importe_total = "";
        this.cfdi_importe_aplicado = "";
        this.cfdi_importe_restante = numeral("0").format('$0,0.00');
        this.cfdi_data_bool = false;
        this.validacion_general_registro();
    } else {
      this.cfdi_data_bool = true;
      if (this.cfdi_fecha_emision == "" || this.validator.filtroFecha(this.cfdi_fecha_emision) == false) {
        this.validator.errorInputRow(cfdiFechaEmision_txt);
      }

      if (this.cfdi_folio_interno == "" || this.validator.filtroAlfaNumerico(this.cfdi_folio_interno) == false) {
        this.validator.errorInputRow(cfdifolioInterno_txt);
      }

      if (this.cfdi_folio_fiscal == "" || this.validator.filtroAlfaNumerico(this.cfdi_folio_fiscal) == false) {
        this.validator.errorInputRow(cfdiUuid_txt);
      }
      
      if (this.cfdi_token_metodo_pago == "") {
        this.validator.errorSelectBrowser(cfdiMetodoPago);
      }

      if (this.cfdi_token_forma_pago == "") {
        this.validator.errorSelectBrowser(cfdiFormaPago);
      }

      if (this.cfdi_token_moneda == "" || this.validator.filtroAlfaNumerico(this.cfdi_token_moneda) == false) {
        this.validator.errorInputRow(moneda_selected);
      }

      if (this.cfdi_importe_total == "" || this.validator.filtroNum(this.cfdi_importe_total) == false) {
        this.validator.errorTextareaRow(cfdi_txt_importe_total);
      }

      if (this.cfdi_importe_aplicado == "" || this.validator.filtroNum(this.cfdi_importe_aplicado) == false) {
        this.validator.errorTextareaRow(cfdi_txt_importe_aplicado);
      }
    }
  }

  delete_cfdi_data(posicion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.cfdi_data.splice(posicion,1);
        if (this.cfdi_data.length > 0) {
          var suma_facturas:any = 0;
          var restante_facturas:any = 0;
          for (let i = 0; i < this.cfdi_data.length; i++) {
            const row_cfdi = this.cfdi_data[i];
            suma_facturas = parseFloat(suma_facturas) + parseFloat(row_cfdi["importe_aplicado"]);
          }
          this.facturas_importe_total = numeral(suma_facturas).format('$0,0.00');
          restante_facturas = parseFloat(this.saldo_ajuste) - parseFloat(suma_facturas);
        } else {
          this.facturas_importe_total = numeral(0).format('$0,0.00');
        }
        this.validacion_general_registro();
      }
    });
  }

  validacion_general_registro(){
    var selectTipoPoliza = document.getElementById("selectTipoPoliza");
    var selectFormaOperacion = document.getElementById("selectFormaOperacion");
    var txt_ajuste_fecha = document.getElementById("txt_ajuste_fecha");
    var monto_ajuste = document.getElementById("monto_ajuste");
    var selectOrigenDestinoMovimiento = document.getElementById("selectOrigenDestinoMovimiento");

    //console.log("tipo_de_poliza "+this.tipo_de_poliza);
    //console.log("forma_operacion "+this.forma_operacion);
    //console.log("fecha_movimiento "+this.fecha_movimiento);
    //console.log("saldo_ajuste "+this.saldo_ajuste);
    //console.log("origen_destino_movimiento "+this.origen_destino_movimiento);
    //console.log("token_cliente "+this.token_cliente);
    //console.log("token_proveedor "+this.token_proveedor);
    //console.log("token_empleado "+this.token_empleado);

    if ((this.tipo_de_poliza != "" && this.validator.filtroAlfaNumerico(this.tipo_de_poliza) == true) &&
      (this.forma_operacion != "" && this.validator.filtroAlfaNumerico(this.forma_operacion) == true) &&
      (this.fecha_movimiento != "" && this.validator.filtroFecha(this.fecha_movimiento) == true) &&
      (this.saldo_ajuste != "" && this.validator.filtroNum(this.saldo_ajuste) == true) &&
      (this.origen_destino_movimiento != "" && this.validator.filtroAlfaNumerico(this.origen_destino_movimiento) == true)) {
      
      if (this.origen_destino_movimiento == "cliente") {
        var cliente_selected = document.getElementById("cliente_selected");
        if (this.token_cliente != "") {
          //console.log("correcto");
          this.bool_registro_nuevo = true;
        } else {
          this.validator.errorInputRow(cliente_selected);
        }
      } else if (this.origen_destino_movimiento == "proveedor") {
        var proveedor_selected = document.getElementById("proveedor_selected");
        if (this.token_proveedor != "") {
          //console.log("correcto");
          this.bool_registro_nuevo = true;
        } else {
          this.validator.errorInputRow(proveedor_selected);
        }
      } else if (this.origen_destino_movimiento == "empleado") {
        var empleado_selected = document.getElementById("empleado_selected");
        if (this.token_empleado != "") {
          //console.log("correcto");
          this.bool_registro_nuevo = true;
        } else {
          this.validator.errorInputRow(empleado_selected);
        }
      }

      if (this.bool_cfdi_vinculado == true) {
        if (this.cfdi_data.length > 0 && this.facturas_importe_restante == "$0.00") {
          this.bool_registro_nuevo = true;
        } else {
          this.bool_registro_nuevo = false;
          //Swal.fire({
          //  position:'top-end',
          //  icon: 'warning',
          //  title: "El importe total de todas las facturas no corresponse al importe total de movimiento",
          //  //title: translate_response,
          //  showConfirmButton:false,
          //  timer: 3000
          //})
        }

      } else {
        this.bool_registro_nuevo = true;
      }

    } else {
      this.bool_registro_nuevo = false;
      if (this.tipo_de_poliza == "" || this.validator.filtroAlfaNumerico(this.tipo_de_poliza) == false) {
        this.validator.errorSelectBrowser(selectTipoPoliza);
      }

      if (this.forma_operacion == "" || this.validator.filtroAlfaNumerico(this.forma_operacion) == false) {
        this.validator.errorSelectBrowser(selectFormaOperacion);
      }

      if (this.fecha_movimiento == "" || this.validator.filtroFecha(this.fecha_movimiento) == false) {
        this.validator.errorInputRow(txt_ajuste_fecha);
      }

      if (this.saldo_ajuste == "" || this.validator.filtroNum(this.saldo_ajuste) == false) {
        this.validator.errorInputRow(monto_ajuste);
      }

      if (this.origen_destino_movimiento == "" || this.validator.filtroAlfaNumerico(this.origen_destino_movimiento) == false) {
        this.validator.errorSelectBrowser(selectOrigenDestinoMovimiento);
      }
    }
  }

  clean_registro(){
    var selectTipoPoliza = document.getElementById("selectTipoPoliza");
    this.validator.limpiaSelect(selectTipoPoliza);
    var selectFormaOperacion = document.getElementById("selectFormaOperacion");
    this.validator.limpiaSelect(selectFormaOperacion);
    var txt_ajuste_fecha = document.getElementById("txt_ajuste_fecha");
    this.validator.limpiaInputRow(txt_ajuste_fecha);
    var monto_ajuste = document.getElementById("monto_ajuste");
    this.validator.limpiaInputRow(monto_ajuste);
    var selectOrigenDestinoMovimiento = document.getElementById("selectOrigenDestinoMovimiento");
    this.validator.limpiaSelect(selectOrigenDestinoMovimiento);

    //var desglose_ajuste = document.getElementById("desglose_ajuste");
    //this.validator.limpiaTextarea(desglose_ajuste);

    this.tipo_de_poliza = "";
    this.forma_operacion = "";
    this.fecha_movimiento = "";
    this.saldo_ajuste = "";
    this.origen_destino_movimiento = "";
    this.token_cliente = "";
    this.token_proveedor = "";
    this.token_empleado = "";
    this.cfdi_data.length = 0;
    this.bool_registro_nuevo = false;
  }

  registrar_ajuste(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea guardar los cambios?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.sessionContext.empresa_data?.nivel_empleado == "N1") {
          //this.mov_banc.catalogoMovimientosBancCuenta  this.token_cuenta_banc = event.value;
          this.mov_banc.registraAjusteAutorizado(
            this.token_cuenta_banc,
            this.tipo_de_poliza,
            this.forma_operacion,
            this.fecha_movimiento,
            this.saldo_ajuste,
            this.origen_destino_movimiento,
            this.token_cliente,
            this.token_proveedor,
            this.token_empleado,
            this.cfdi_data,
            ).subscribe(
            response => {
              //let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: response.message,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.catalogoMovimientosBancCuentaWithToken(this.token_cuenta_banc);
                this.clean_registro();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: response.message,
                  //title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          );
        } 

        if (this.sessionContext.empresa_data?.nivel_empleado == "N2") {
          this.mov_banc.registraAjustePreviaAuth(            
            this.token_cuenta_banc,
            this.tipo_de_poliza,
            this.forma_operacion,
            this.fecha_movimiento,
            this.saldo_ajuste,
            this.origen_destino_movimiento,
            this.token_cliente,
            this.token_proveedor,
            this.token_empleado,
            this.cfdi_data).subscribe(
            response => {
              //let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: response.message,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.catalogoMovimientosBancCuentaWithToken(this.token_cuenta_banc);
                this.clean_registro();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: response.message,
                  //title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    });
  }
}
