import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { MonedasService } from '../../../../servicios/monedas.service';
import { VentasServService } from '../../../../servicios/ssic/ventas-serv.service';
import { Usuarios } from '../../../../modelos/Usuarios';
import { DomSanitizer } from '@angular/platform-browser';
import { UbicacionServService } from '../../../../servicios/ssic/ubicacion-serv.service';
import { CajaServService } from '../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { ClientesService } from '../../../../servicios/ssic/clientes.service';
import { BancosServService } from '../../../../servicios/ssic/bancos-serv.service';
import { MonederoElectService } from '../../../../servicios/ssic/monedero-elect.service';
import numeral from 'numeral';
import { ToWords } from 'to-words';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ImpuestosServService } from '../../../../servicios/ssic/impuestos-serv.service';
import { PuntoVentaService } from '../../../../servicios/punto-venta.service';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { ServEncryptService } from '../../../../servicios/ssic/serv-encrypt.service';
import { FormaPagoService } from '../../../../servicios/ssic/forma-pago.service';
import { SessionContextService } from '../../../../servicios/session-context';
//const countries = require("countries-list");
//import countriesList from 'countries-list';

const toWords = new ToWords({
  localeCode: 'es-MX',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Peso',
      plural: 'Pesos',
      symbol: '$',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
        symbol: '',
      },
    },
  },
});

const toIngles = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Peso',
      plural: 'Pesos',
      symbol: '$',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
        symbol: '',
      },
    },
  },
});

@Component({
  selector: 'app_interno_ingresos_ventas_mostrador_new',
  templateUrl: './altaventamostrador.component.html',
  standalone:false,
  styleUrls: [
    './altaventamostrador.component.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/loading.css',
    '../../../../styles/landing.css',
    '../../../../styles/navegador.css',
    '../../../../styles/colores.css',
    '../../../../styles/parallax.css',
    '../../../../styles/div_explain.css',
    '../../../../styles/switches.css',
    '../../../../styles/totales.css',
  ],
})

export class AltaVentasMostradorComponent implements OnInit {
  public identidad: any;
  public usuario: Usuarios;
  catalogoMonedasApi:any = [];
  catalogoFormaPagoApi:any = [];
  catalogoBancosApi:any = [];
  listaClientes:any = [];
  public cliente_seleccionado_nombre:string = "";
  public cliente_seleccionado_token:string = "";
  listaPuntoVenta:any = [];
  public puntoventa_seleccionado_token:string = "";
  public puntoventa_seleccionado_direccion:string = "";
  public puntoventa_seleccionado_alias:string = "";
  public puntoventa_seleccionado_responsable:string = "";
  arraylistInternaArticulos:any = [];
  public seccionArticulosListadoBool:boolean = false;
  arraylistArticulos:any = [];
  public viewListaArticulos:boolean = false;
  private dataTableArticulosListadoPVenta: any;
  listEsquemasImpuestos:any = [];
  lista_articulos_seleccionados:any = [];
  public qr_generado:string = "";

  public mx_venta_subtotal:string = numeral(0).format('$0.00');
  public mx_venta_descuento:string = numeral(0).format('$0.00');
  public mx_venta_traslados:string = numeral(0).format('$0.00');
  public mx_venta_retenciones:string = numeral(0).format('$0.00');
  public mx_venta_importe_total:string = numeral(0).format('$0.00');
  public mx_venta_importe_string:string = "";
  public mx_venta_moneda_codigo:string = "MXN";
  public mx_venta_moneda_nombre:string = "Peso Mexicano";
  public mx_venta_moneda_decimales_cantidad:number = 2;
  public mx_venta_moneda_decimales_string:string = "00";
  
  public cnvr_venta_subtotal:string = numeral(0).format('$0.00');
  public cnvr_venta_descuento:string = numeral(0).format('$0.00');
  public cnvr_venta_traslados:string = numeral(0).format('$0.00');
  public cnvr_venta_retenciones:string = numeral(0).format('$0.00');
  public cnvr_venta_importe_total:string = numeral(0).format('$0.00');
  public cnvr_venta_importe_string:string = "";
  public cnvr_venta_moneda_codigo:string = "MXN";
  public cnvr_venta_moneda_nombre:string = "Peso Mexicano";
  public cnvr_venta_moneda_decimales_cantidad:number = 2;
  public cnvr_venta_moneda_decimales_string:string = "00";
  public cnvr_venta_tipo_cambio_simple:number = 1.00;
  public cnvr_venta_tipo_cambio_format:string = numeral(1).format('$1.00');
  public decide_generar_factura:string = "";
  public progressBarRegistro:boolean = false;
  public fecha_venta_impresion:string = new Date().toLocaleString();
  public codigo_acceso_venta_impreso:string = "";
  public codigo_acceso_venta_cifrado:string = "";
  public passwo_acceso_venta_impreso:string = "";
  public passwo_acceso_venta_cifrado:string = "";
  public folio_venta_generada:string = "";

  public venta_cobro_forma_generada:string = "";
  public venta_cobro_fecha:string = "";
  public venta_cobro_banco:string = "";
  public venta_cobro_cuenta_card_clabe:string = "";
  public venta_cobro_clave_referencia:string = "";
  public venta_cobro_moneda_code:string = "";
  public venta_cobro_moneda_decimales:number = 2;
  public venta_cobro_importe_simple:number = 0.00;
  public venta_cobro_importe_format:string = numeral(0).format('$0.00');
  public venta_cobro_concepto:string = "ventas a público general";
  public venta_cambio:string = "";
  public relacion_importe_cambio:boolean = false;

  @ViewChild('printableDiv') printableDiv!: ElementRef;

  //scanner
  public scanner_codigo:string = "";
  public scanner_buffer:string = "";
  public scanner_timeOut:any;
  listener: (() => void) | undefined;

  constructor(private renderer:Renderer2,
    private sanitizer:DomSanitizer,
    private monedasServ:MonedasService,
    private fpagoServ:FormaPagoService,
    private _ventServ: VentasServService,
    private ubicaServ: UbicacionServService,
    private _cajServ: CajaServService,
    private bancos:BancosServService,
    private monedero:MonederoElectService,
    private sessionContext: SessionContextService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private _catImp: ImpuestosServService,
    private _clientServ: ClientesService,
    private sentinela: SentinelArkManager,
    private encryptor:ServEncryptService,
    private pvServ:PuntoVentaService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
    this.listener = this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      if (this.scanner_timeOut) clearTimeout(this.scanner_timeOut);//reinicia temporizador
      if (event.key === 'Enter') {
        //si detecta entrada, guarada el código y reinicia el buffer
        this.scanner_codigo = this.scanner_buffer;
        console.log('código verificado: ',this.scanner_codigo);
        this.prodInventariosBusquedaByCode(this.scanner_codigo);
        this.scanner_buffer = '';
      } else {
        //almacena caracteres en el buffer
        this.scanner_buffer += event.key;
      }

      this.scanner_timeOut = setTimeout(() => {
        this.scanner_buffer = '';
      }, 500);
    });
  }

  ngOnInit(): void {
    this.listarClientesPubGen();
    this.listarPuntosDVenta();
    this.monedasCatalogoApi();
    this.formadepagoCatalogoApi();
    this.bancosfunctionCatalogoApi();
    this.listarImpuestosEsquemas();
    this.calculaCambioDevolver();
    this.moduloMostradorArticulosLista();
  }

  get empresa_data() {
    //console.log(this.sessionContext.empresa_data);
    return this.sessionContext.empresa_data;
  }

  abreventana_modal(modal_ident:any){
    $(modal_ident).modal('show');
  }

  listarClientesPubGen(){
    this._clientServ.listaclientesVentasMostrador().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaClientes = response.clientes;
          console.log(this.listaClientes);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listarPuntosDVenta(){
    this.pvServ.catalogoPuntoDeVenta().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPuntoVenta = response.catalogo;
          console.log(this.listaPuntoVenta);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedasCatalogoApi(){
    this.monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.catalogoMonedasApi = response.monedas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  formadepagoCatalogoApi(){
    this.fpagoServ.getApiFormaPago().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.forma_pago);
          this.catalogoFormaPagoApi = response.forma_pago;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  bancosfunctionCatalogoApi(){
    this.bancos.getApiListaBancos().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.catalogo);
          this.catalogoBancosApi = response.catalogo;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  moduloMostradorArticulosLista(){
    this._ventServ.moduloMostradorArticulosLista().subscribe(
      response => {
        if (response.status == 'success') {
          this.arraylistInternaArticulos = response.listaArticulos;
          console.log(this.arraylistInternaArticulos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  buscaArticulos(event: any){
    this.viewListaArticulos = false;
    console.log('event.value:', event.value);
    console.log('arraylistInternaArticulos:', this.arraylistInternaArticulos);
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      const listaFiltrada = this.arraylistInternaArticulos.filter((art:any) => art.concepto.toLowerCase().includes(event.value.toLowerCase())).map((row:any) => row);
      this.arraylistArticulos = [];
      if (listaFiltrada.length > 0) {  
        this.viewListaArticulos = true;      
        console.log(listaFiltrada);
        this.arraylistArticulos = listaFiltrada;
        ////$('#tablaArticulosListadoPVenta').DataTable().destroy();
        //if (DataTable.isDataTable('#tablaArticulosListadoPVenta')) {
        //  console.log("isData table");
        //  this.reloadData();
        //} else {
        //  console.log("notData table");
        //}
        //this.dataTableServ.destruyeDatatable("#tablaArticulosListadoPVenta");
      }
    } else {
      this.validator.errorInputRow(event);
    }
  }

  prodInventariosBusquedaByCode(scanner_codigo:any){
    console.log("scanner_codigo: "+scanner_codigo)
    this._ventServ.moduloMostradorArticulosBusquedaByCode(scanner_codigo).subscribe(
      response => {
        if (response.status == 'success') {
          this.arraylistArticulos = response.listaArticulos;
          console.log(this.arraylistInternaArticulos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  reloadData(): void {
    this.dataTableArticulosListadoPVenta.clear().rows.add(this.arraylistArticulos).draw();
  }

  listarImpuestosEsquemas(){
    this._catImp.esquemaImpuestosParaVentas().subscribe(
      response => {
        if (response.status == 'success') {
          this.listEsquemasImpuestos = response.esquemas;
          console.log(this.listEsquemasImpuestos);
        }
      }, 
      error => {
        console.log(error);
      }
    );
  }

//selecciones
  seleccionClienteVenta(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.listaClientes.length; i++) {
        const row = this.listaClientes[i];
        if (row["nombre"] == event.value) {
          this.validator.correctoInputRow(event);
          this.cliente_seleccionado_token = row["token_cat_clientes"];
          this.cliente_seleccionado_nombre = row["nombre"];
          this.activaListaArticulos();
          return;
        } else {
          this.validator.errorInputRow(event);
          this.cliente_seleccionado_token = "";
          this.cliente_seleccionado_nombre = "";
          this.activaListaArticulos();
        }
      }
    } else {
      this.cliente_seleccionado_token = "";
      this.cliente_seleccionado_nombre = "";
      this.validator.errorInputRow(event);
      this.activaListaArticulos();
    }
  }

  seleccionPuntoDVenta(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.listaPuntoVenta.length; i++) {
        const row = this.listaPuntoVenta[i];
        if (row["pv_alias"] == event.value) {
          this.validator.correctoInputRow(event);
          this.puntoventa_seleccionado_token = row["token_puntodeventa"];
          this.puntoventa_seleccionado_direccion = row["pv_direccion"];
          this.puntoventa_seleccionado_alias = row["pv_alias"];
          this.puntoventa_seleccionado_responsable = row["pv_responsable"];
          this.activaListaArticulos();
          return;
        } else {
          this.validator.errorInputRow(event);
          this.puntoventa_seleccionado_token = "";
          this.puntoventa_seleccionado_direccion = "";
          this.puntoventa_seleccionado_alias = "";
          this.puntoventa_seleccionado_responsable = "";
          this.activaListaArticulos();
        }
      }
    } else {
      this.puntoventa_seleccionado_token = "";
      this.puntoventa_seleccionado_direccion = "";
      this.puntoventa_seleccionado_alias = "";
      this.puntoventa_seleccionado_responsable = "";
      this.validator.errorInputRow(event);
      this.activaListaArticulos();
    }
  }

  keyupValidateMonedaApi(event:any){
    console.log(event.value);
    if(event.value != "" && this.validator.filtroAlfaNumerico(event.value)){
      for (let i = 0; i < this.catalogoMonedasApi.length; i++) {
        const money = this.catalogoMonedasApi[i];
        if (money['langEN'] == event.value) {
          this.validator.correctoInputRow(event);
          console.log(money["code"]);
          this.cnvr_venta_moneda_codigo = money["code"];
          this.cnvr_venta_moneda_nombre = money['langEN'];
          this.cnvr_venta_moneda_decimales_string = "";
          this.convierteDecimalesACadena(money['decimales']);
          //this.cnvr_venta_tipo_cambio_simple = 0.00;
          this.cnvr_venta_tipo_cambio_format = numeral(0).format('$0,0.00');
          this.activaListaArticulos();
          if (this.lista_articulos_seleccionados.length > 0) {        
            this.calculaTotales();
            this.conversorImportes();
          }
          return;
        } else {
          this.validator.errorInputRow(event);
          this.cnvr_venta_moneda_codigo = "";
          this.cnvr_venta_moneda_nombre = "";
          this.cnvr_venta_moneda_decimales_string = "00";
          this.cnvr_venta_tipo_cambio_simple = 1.00;
          this.cnvr_venta_tipo_cambio_format = numeral(1).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
          this.activaListaArticulos();
          if (this.lista_articulos_seleccionados.length > 0) {        
            this.calculaTotales();
            this.conversorImportes();
          }
        }
      }
    } else {
      this.validator.errorInputRow(event);
      this.cnvr_venta_moneda_codigo = "";
      this.cnvr_venta_moneda_nombre = "";
      this.cnvr_venta_moneda_decimales_string = "00";
      this.cnvr_venta_tipo_cambio_simple = 1.00;
      this.cnvr_venta_tipo_cambio_format = numeral(1).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
      this.activaListaArticulos();
      if (this.lista_articulos_seleccionados.length > 0) {        
        this.calculaTotales();
        this.conversorImportes();
      }
    }
  }

  convierteDecimalesACadena(decimales:any){
    console.log(decimales);
    for (let i = 0; i < decimales; i++) {
      this.cnvr_venta_moneda_decimales_string = this.cnvr_venta_moneda_decimales_string+"0";
    }
  }

  editTipoCambio(event:any){
    if(event.value != '' && this.validator.filtroNum(event.value) == true){
      this.cnvr_venta_tipo_cambio_simple = event.value;
      this.cnvr_venta_tipo_cambio_format = numeral(event.value).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
      this.validator.correctoInputRow(event);
    } else {
      this.cnvr_venta_tipo_cambio_simple = 1.00;
      this.cnvr_venta_tipo_cambio_format = numeral(1).format('$0,0.'+this.mx_venta_moneda_decimales_string);
      this.validator.errorInputRow(event);
    }
    this.activaListaArticulos();
    if (this.lista_articulos_seleccionados.length > 0) {        
      this.calculaTotales();
      this.conversorImportes();
    }
  }

  activaListaArticulos(){
    if (this.cliente_seleccionado_token != "" && this.puntoventa_seleccionado_token != "" && (this.cnvr_venta_moneda_codigo == "MXN" || (this.cnvr_venta_moneda_codigo != "MXN" && this.cnvr_venta_tipo_cambio_simple != 1.00))) {
      this.seccionArticulosListadoBool = true;
    } else {
      this.seccionArticulosListadoBool = false;
    }
  }

  ventaPrecioBase(contador_posicion:any,event:any){
    const index_pos = this.arraylistArticulos.map((item:any) => item.contador_posicion).indexOf(contador_posicion);
    console.log(index_pos);
    if (this.arraylistArticulos[index_pos]["precioBase"] != "" && this.validator.filtroNum(this.arraylistArticulos[index_pos]["precioBase"]) == true) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
    this.validacionPartida(index_pos);
  }

  ventaCantidad(contador_posicion:any,event:any){
    const index_pos = this.arraylistArticulos.map((item:any) => item.contador_posicion).indexOf(contador_posicion);
    console.log(index_pos);
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      this.arraylistArticulos[index_pos]["dataCantidad"] = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.arraylistArticulos[index_pos]["dataCantidad"] = "";
      this.validator.errorInputRow(event);
    }
    this.validacionPartida(index_pos);
  }

  ventaDescuentos(contador_posicion:any,event:any){
    const index_pos = this.arraylistArticulos.map((item:any) => item.contador_posicion).indexOf(contador_posicion);
    console.log(index_pos);
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      this.arraylistArticulos[index_pos]["descuento_aplicado"] = event.value;
      this.arraylistArticulos[index_pos]["descuento_aplicadoFormat"] = numeral(event.value).format('$0,0.'+this.mx_venta_moneda_decimales_string);
      this.validator.correctoInputRow(event);
    } else {
      this.arraylistArticulos[index_pos]["descuento_aplicado"] = 0.00;
      this.arraylistArticulos[index_pos]["descuento_aplicadoFormat"] = numeral(0.00).format('$0,0.'+this.mx_venta_moneda_decimales_string);
      this.validator.errorInputRow(event);
    }
    this.validacionPartida(index_pos);
  }

  ventaSeleccionEsquemaImpuestos(contador_posicion:any,event:any){
    const index_pos = this.arraylistArticulos.map((item:any) => item.contador_posicion).indexOf(contador_posicion);
    console.log(index_pos);
    if (event.value != "") {
      for (let i = 0; i < this.listEsquemasImpuestos.length; i++) {
        const esq = this.listEsquemasImpuestos[i];
        if (esq["esquema_token"] == event.value) {
          this.arraylistArticulos[index_pos]["esquema_impuestos_aplicado"] = event.value;
          this.arraylistArticulos[index_pos]["impuestos_aplicados"] = esq["impuestos"];
          this.validator.correctoInputRow(event);
          this.validacionPartida(index_pos);
          return;
        } else {
          this.arraylistArticulos[index_pos]["esquema_impuestos_aplicado"] = "";
          this.arraylistArticulos[index_pos]["impuestos_aplicados"] = [];
          this.validator.errorInputRow(event);
          this.validacionPartida(index_pos);
        }
      }
    } else {
      this.arraylistArticulos[index_pos]["esquema_impuestos_aplicado"] = "";
      this.arraylistArticulos[index_pos]["impuestos_aplicados"] = [];
      this.validator.errorInputRow(event);
      this.validacionPartida(index_pos);
    }
  }

  validacionPartida(index_pos:any){
    console.log(index_pos);
    if (this.arraylistArticulos[index_pos]["precioBase"] != "" && this.validator.filtroNum(this.arraylistArticulos[index_pos]["precioBase"]) == true) {
      this.arraylistArticulos[index_pos]["precioBaseFormat"] = numeral(this.arraylistArticulos[index_pos]["precioBase"]).format('$0,0.'+this.mx_venta_moneda_decimales_string);
      var precioInicial:any = parseFloat(this.arraylistArticulos[index_pos]["precioBase"]) * parseFloat(this.arraylistArticulos[index_pos]["dataCantidad"]);
      console.log(precioInicial);
      var precioSubtotal:any = parseFloat(precioInicial) - parseFloat(this.arraylistArticulos[index_pos]["descuento_aplicado"]);
      this.arraylistArticulos[index_pos]["subtotalAfterDescuentos"] = numeral(precioSubtotal).format('0.'+this.mx_venta_moneda_decimales_string);
      this.arraylistArticulos[index_pos]["subtotalAfterDescuentosFormat"] = numeral(precioSubtotal).format('$0,0.'+this.mx_venta_moneda_decimales_string);
      if (this.arraylistArticulos[index_pos]["esquema_impuestos_aplicado"] != "") {
        var suma_traslados:any = 0.00;
        var suma_retenciones:any = 0.00;
        for (let i = 0; i < this.arraylistArticulos[index_pos]["impuestos_aplicados"].length; i++) {
          const imp = this.arraylistArticulos[index_pos]["impuestos_aplicados"][i];
          var base = this.arraylistArticulos[index_pos]["subtotalAfterDescuentos"];
          var importe_impuesto_aplicado:any = 0.00;
          if (imp["base_aplicable"] == "subtotal") {
            switch (imp["calculo"]) {
              case "tasa":
                importe_impuesto_aplicado = parseFloat(base) * parseFloat("0."+imp["importe"]);
                imp["valor_para_venta"] = numeral(parseFloat(base) * parseFloat("0."+imp["importe"])).format('0.'+this.mx_venta_moneda_decimales_string);
                imp["valor_para_ventaFormat"] = numeral(parseFloat(base) * parseFloat("0."+imp["importe"])).format('$0,0.'+this.mx_venta_moneda_decimales_string);
                break;
              case "cuota":
                importe_impuesto_aplicado = parseFloat(imp["importe"]);
                imp["valor_para_venta"] = numeral(parseFloat(imp["importe"])).format('0.'+this.mx_venta_moneda_decimales_string);
                imp["valor_para_ventaFormat"] = numeral(parseFloat(imp["importe"])).format('$0,0.'+this.mx_venta_moneda_decimales_string);
                break;
              default:
                break;
            }
            
            //if (imp["tipo_impuesto"] == "trasladado") {
            //  suma_traslados = parseFloat(suma_traslados) + parseFloat(importe_impuesto_aplicado);
            //} else {
            //  suma_traslados = parseFloat(suma_retenciones) + parseFloat(importe_impuesto_aplicado);
            //}
            switch (imp["tipo_impuesto"]) {
              case "trasladado":
                suma_traslados = parseFloat(suma_traslados) + parseFloat(importe_impuesto_aplicado);
                break;
              case "retenido":
                suma_traslados = parseFloat(suma_retenciones) + parseFloat(importe_impuesto_aplicado);
                break;
              default:
                break;
            }
          }
          this.arraylistArticulos[index_pos]["totalTrasladados"] = parseFloat(suma_traslados);
          this.arraylistArticulos[index_pos]["totalTrasladadosFormat"] = numeral(parseFloat(suma_traslados)).format('$0,0.'+this.mx_venta_moneda_decimales_string);
          this.arraylistArticulos[index_pos]["totalRetenidos"] = parseFloat(suma_retenciones);
          this.arraylistArticulos[index_pos]["totalRetenidosFormat"] = numeral(parseFloat(suma_retenciones)).format('$0,0.'+this.mx_venta_moneda_decimales_string);
        }
      }
      console.log(this.arraylistArticulos[index_pos]["totalTrasladados"]);
      console.log(this.arraylistArticulos[index_pos]["totalRetenidos"]);
      var importeTotal:any = parseFloat(precioSubtotal) + parseFloat(this.arraylistArticulos[index_pos]["totalTrasladados"]) - parseFloat(this.arraylistArticulos[index_pos]["totalRetenidos"]);
      this.arraylistArticulos[index_pos]["importePartida"] = numeral(importeTotal).format('0.'+this.mx_venta_moneda_decimales_string);
      this.arraylistArticulos[index_pos]["importePartidaFormat"] = numeral(importeTotal).format('$0,0.'+this.mx_venta_moneda_decimales_string);
    } else {
      var ventaNumberPrecioBase = document.getElementById("ventaNumberPrecioBase");
      this.validator.errorInputRow(ventaNumberPrecioBase);
    }
  }

  seleccionarArticuloParaVenta(contador_posicion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.lista_articulos_seleccionados.push(this.arraylistArticulos[contador_posicion]);
        this.qr_generado = JSON.stringify({
          cliente:this.cliente_seleccionado_token,
          punto_venta:this.puntoventa_seleccionado_token,
          listado:this.lista_articulos_seleccionados.length
        });
        this.calculaTotales();
        this.conversorImportes();
      }
    });
  }

  deleteArticuloParaVenta(contador_posicion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.lista_articulos_seleccionados.splice(contador_posicion,1);
        this.calculaTotales();
        this.conversorImportes();
        if (this.lista_articulos_seleccionados.length > 0) {
          this.qr_generado = JSON.stringify({
            cliente:this.cliente_seleccionado_token,
            punto_venta:this.puntoventa_seleccionado_token,
            listado:this.lista_articulos_seleccionados.length
          });
        } else {
          this.qr_generado = "";
        }
      }
    });
  }

  calculaTotales(){
    this.mx_venta_subtotal = numeral(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.subtotalAfterDescuentos),0)).format('$0,0.'+this.mx_venta_moneda_decimales_string);
    this.mx_venta_descuento = numeral(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.descuento_aplicado),0)).format('$0,0.'+this.mx_venta_moneda_decimales_string);
    this.mx_venta_traslados = numeral(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.totalTrasladados),0)).format('$0,0.'+this.mx_venta_moneda_decimales_string);
    this.mx_venta_retenciones = numeral(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.totalRetenidos),0)).format('$0,0.'+this.mx_venta_moneda_decimales_string);
    this.mx_venta_importe_total = numeral(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.importePartida),0)).format('$0,0.'+this.mx_venta_moneda_decimales_string);
    this.mx_venta_importe_string = toWords.convert(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.importePartida),0));
    console.log(this.mx_venta_importe_string);
  }

  conversorImportes(){
    this.cnvr_venta_subtotal = numeral(parseFloat(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.subtotalAfterDescuentos),0)) / this.cnvr_venta_tipo_cambio_simple).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
    this.cnvr_venta_descuento = numeral(parseFloat(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.descuento_aplicado),0)) / this.cnvr_venta_tipo_cambio_simple).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
    this.cnvr_venta_traslados = numeral(parseFloat(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.totalTrasladados),0)) / this.cnvr_venta_tipo_cambio_simple).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
    this.cnvr_venta_retenciones = numeral(parseFloat(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.totalRetenidos),0)) / this.cnvr_venta_tipo_cambio_simple).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
    this.cnvr_venta_importe_total = numeral(parseFloat(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.importePartida),0)) / this.cnvr_venta_tipo_cambio_simple).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
    this.cnvr_venta_importe_string = toIngles.convert(parseFloat(this.lista_articulos_seleccionados.reduce((acumulado:any,actual:any) => parseFloat(acumulado) + parseFloat(actual.importePartida),0)) / this.cnvr_venta_tipo_cambio_simple);
    console.log(this.cnvr_venta_importe_string);
  }

  abreModalVentas(modal_ident:any){
    $(modal_ident).modal('show');
  }

  validateCodAccesoVenta(){
    const alfabetoCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let c = 0; c < 10; c++) {
      this.codigo_acceso_venta_impreso += alfabetoCode.charAt(Math.floor(Math.random() * alfabetoCode.length));
      this.codigo_acceso_venta_cifrado = this.encryptor.imperialEncrypt(this.codigo_acceso_venta_impreso);
    }

    const alfabetoPass = "0123456789.,;:()/abcdefghijklmnopqrstuvwxyz#%&$ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let p = 0; p < 8; p++) {
      this.passwo_acceso_venta_impreso += alfabetoPass.charAt(Math.floor(Math.random() * alfabetoPass.length));
      this.passwo_acceso_venta_cifrado = this.encryptor.imperialEncrypt(this.passwo_acceso_venta_impreso);
    }
    console.log(this.codigo_acceso_venta_impreso+" "+this.codigo_acceso_venta_cifrado);
    this.verificar();
  }

  verificar(){
    if (this.encryptor.imperialEncrypt("cjIgpM8XzE") == "U2FsdGVkX1/1PEMqK1iU0WPjae1ltVkH1r9ZJthYET8=") {
      console.log("trueValid");
    } else {
      console.log("faldseValid");
    }
  }

  decideGenerarFactura(desicion:any){
    this.decide_generar_factura = desicion == "true" ? "true" : "false";
  }

  
  seleccionFormaCobroVenta(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.catalogoFormaPagoApi.length; i++) {
        const row = this.catalogoFormaPagoApi[i];
        if (row["descripcion"] == event.value) {
          this.validator.correctoInputRow(event);
          this.venta_cobro_forma_generada = row["descripcion"];
          this.venta_cobro_moneda_code = this.venta_cobro_forma_generada == "Efectivo" ? this.cnvr_venta_moneda_codigo : ""; 
          return;
        } else {
          this.validator.errorInputRow(event);
          this.venta_cobro_forma_generada = "";
        }
      }
    } else {
      this.venta_cobro_forma_generada = "";
      this.validator.errorInputRow(event);
    }
  }

  validaDateFormaPago(event:any){
    if (event.value != '' && this.validator.filtroFecha(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.venta_cobro_fecha = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.venta_cobro_fecha = "";
    }
  }

  seleccionBancoCobroVenta(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.catalogoBancosApi.length; i++) {
        const row = this.catalogoBancosApi[i];
        if (row["nombre_corto"] == event.value) {
          this.validator.correctoInputRow(event);
          this.venta_cobro_banco = row["nombre_corto"];
          return;
        } else {
          this.validator.errorInputRow(event);
          this.venta_cobro_banco = "";
        }
      }
    } else {
      this.venta_cobro_banco = "";
      this.validator.errorInputRow(event);
    }
  }

  cobroVentaNumTarjeta(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.venta_cobro_cuenta_card_clabe = event.value;
    } else {
      this.venta_cobro_cuenta_card_clabe = "";
      this.validator.errorInputRow(event);
    }
  }

  cobroVentaClaveReferencia(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.venta_cobro_clave_referencia = event.value;
    } else {
      this.venta_cobro_clave_referencia = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupImporteCobroVenta(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.venta_cobro_importe_simple = event.value;
      this.venta_cobro_importe_format = event.value;
    } else {
      this.venta_cobro_importe_simple = 0.00;
      this.venta_cobro_importe_format = "0.00";
      this.validator.errorInputRow(event);
    }
    if (this.venta_cobro_moneda_code != "") {
      this.calculaCambioDevolver();
    }
  }

  keyupMonedaCobroVenta(event:any){
    console.log(event.value);
    if(event.value != "" && this.validator.filtroAlfaNumerico(event.value)){
      for (let i = 0; i < this.catalogoMonedasApi.length; i++) {
        const money = this.catalogoMonedasApi[i];
        if (money['code'] == event.value) {
          this.venta_cobro_moneda_code = money["code"];
          this.venta_cobro_moneda_decimales = money['decimales'];
          this.validator.correctoInputRow(event);
          this.calculaCambioDevolver();
          return;
        } else {
          this.venta_cobro_moneda_code = "";
          this.venta_cobro_moneda_decimales = 2;
          this.validator.errorInputRow(event);
          this.calculaCambioDevolver();
        }
      }
    } else {
      this.venta_cobro_moneda_code = "";
      this.venta_cobro_moneda_decimales = 2;
      this.validator.errorInputRow(event);
      this.calculaCambioDevolver();
    }
  }

  keyupConceptoCobroVenta(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.venta_cobro_concepto = event.value;
    } else {
      this.venta_cobro_concepto = "";
      this.validator.errorInputRow(event);
    }
  }

  calculaCambioDevolver(){
    var cambio_mxn = '0.00';
    var cambio_convert = '0.00';
    if (this.venta_cobro_moneda_code == "MXN") {
      console.log(this.mx_venta_importe_total+" "+this.venta_cobro_importe_simple);
      cambio_mxn = numeral(parseFloat(this.venta_cobro_importe_simple.toString().replace(/[\$,]/g, '')) - parseFloat(this.mx_venta_importe_total.toString().replace(/[\$,]/g, ''))).format('$0,0.'+this.mx_venta_moneda_decimales_string);
      console.log(cambio_mxn)

      cambio_convert = numeral((parseFloat(this.venta_cobro_importe_simple.toString().replace(/[\$,]/g, '')) / this.cnvr_venta_tipo_cambio_simple) - parseFloat(this.cnvr_venta_importe_total.toString().replace(/[\$,]/g, ''))).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
      console.log(cambio_convert)
      this.relacion_importe_cambio = parseFloat(this.venta_cobro_importe_simple.toString()) > parseFloat(this.mx_venta_importe_total.toString().replace(/[\$,]/g, '')) ? true : false;
    } else {
      console.log(this.cnvr_venta_importe_total+" "+this.venta_cobro_importe_simple);
      cambio_convert = numeral(parseFloat(this.venta_cobro_importe_simple.toString().replace(/[\$,]/g, '')) - parseFloat(this.cnvr_venta_importe_total.toString().replace(/[\$,]/g, ''))).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
      console.log(cambio_convert)

      cambio_mxn = numeral((parseFloat(this.venta_cobro_importe_simple.toString().replace(/[\$,]/g, '')) * this.cnvr_venta_tipo_cambio_simple) - parseFloat(this.mx_venta_importe_total.toString().replace(/[\$,]/g, ''))).format('$0,0.'+this.mx_venta_moneda_decimales_string);
      console.log(cambio_mxn)
      this.relacion_importe_cambio = parseFloat(this.venta_cobro_importe_simple.toString()) > parseFloat(this.cnvr_venta_importe_total.toString().replace(/[\$,]/g, '')) ? true : false;
    }

    switch (this.venta_cobro_moneda_code) {
      case "MXN":
        this.venta_cobro_importe_format = numeral(this.venta_cobro_importe_simple.toString().replace(/[\$,]/g, '')).format('$0,0.'+this.mx_venta_moneda_decimales_string);
        break;
      default:
        this.venta_cobro_importe_format = numeral(this.venta_cobro_importe_simple.toString().replace(/[\$,]/g, '')).format('$0,0.'+this.cnvr_venta_moneda_decimales_string);
        break;
    }
    this.venta_cambio = cambio_mxn+" MXN / "+cambio_convert+" "+this.cnvr_venta_moneda_codigo;
  }

  registraVentaMostrador(form:{reset:() => void;}):void{
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
        this.codigo_acceso_venta_impreso = "";
        this.codigo_acceso_venta_cifrado = "";
        this.passwo_acceso_venta_impreso = "";
        this.passwo_acceso_venta_cifrado = "";
        this.validateCodAccesoVenta();
        this._ventServ.registraMostradorVenta(
          this.cliente_seleccionado_token,
          this.puntoventa_seleccionado_token,
          this.mx_venta_moneda_codigo,
          this.mx_venta_moneda_decimales_cantidad,
          this.cnvr_venta_tipo_cambio_simple,
          this.cnvr_venta_moneda_codigo,
          this.cnvr_venta_moneda_decimales_cantidad,
          this.lista_articulos_seleccionados,
          this.decide_generar_factura,
          this.codigo_acceso_venta_cifrado,
          this.passwo_acceso_venta_cifrado,
          this.venta_cobro_forma_generada,
          this.venta_cobro_fecha,
          this.venta_cobro_banco,
          this.venta_cobro_cuenta_card_clabe,
          this.venta_cobro_clave_referencia,
          this.venta_cobro_moneda_code,
          this.venta_cobro_moneda_decimales,
          this.venta_cobro_importe_simple,
          this.cnvr_venta_tipo_cambio_simple,
          this.venta_cobro_concepto
        ).subscribe(
          response => {
            let respuesta_venta = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.folio_venta_generada = response.folio_vent;
              this.progressBarRegistro = false;
              console.log(response.folio_vent);
              form.reset();
              setTimeout(() => {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: respuesta_venta,
                  showConfirmButton:false,
                  timer: 3000
                });
              },1000);
              setTimeout(() => {
                this.imprimir();
                this.limpiaTodo();
              }, 3000);
            }
            if (response.status == 'error') {
              this.progressBarRegistro = false;
              Swal.fire({
                position:'top-end',
                icon: 'warning',
                title: respuesta_venta,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    });
  }

  imprimir() {
    //this.folio_venta_generada = folio_vent;
    const printContents = this.printableDiv.nativeElement.innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Impresión</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              h1 {
                color: #444;
              }
              h2 {
                text-align: center !important;
                margin: 0;
              }
              p {
                text-align: center !important;
                margin: 0;
                padding: 0;
                height: 15px;
                font-size: small;
              }
              table {
                width: 100%!important;
                border-collapse: collapse!important;
              }
              th,td {
                text-align: left!important;
                padding: 5px!important;
                border-bottom: 1px solid #ddd!important;
              }
              .totales{
                margin-top:20px!important;
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }

  limpiaTodo(){
    this.cliente_seleccionado_nombre = "";
    this.cliente_seleccionado_token = "";
    this.puntoventa_seleccionado_token = "";
    this.puntoventa_seleccionado_direccion = "";
    this.puntoventa_seleccionado_alias = "";
    this.puntoventa_seleccionado_responsable = "";
    this.seccionArticulosListadoBool = false;
    this.arraylistArticulos = [];
    this.viewListaArticulos = false;
    this.lista_articulos_seleccionados = [];
    this.qr_generado = "";

    this.mx_venta_subtotal = numeral(0).format('$0.00');
    this.mx_venta_descuento = numeral(0).format('$0.00');
    this.mx_venta_traslados = numeral(0).format('$0.00');
    this.mx_venta_retenciones = numeral(0).format('$0.00');
    this.mx_venta_importe_total = numeral(0).format('$0.00');
    this.mx_venta_importe_string = "";
    this.mx_venta_moneda_codigo = "MXN";
    this.mx_venta_moneda_nombre = "Peso Mexicano";
    this.mx_venta_moneda_decimales_cantidad = 2;
    this.mx_venta_moneda_decimales_string = "00";
    
    this.cnvr_venta_subtotal = numeral(0).format('$0.00');
    this.cnvr_venta_descuento = numeral(0).format('$0.00');
    this.cnvr_venta_traslados = numeral(0).format('$0.00');
    this.cnvr_venta_retenciones = numeral(0).format('$0.00');
    this.cnvr_venta_importe_total = numeral(0).format('$0.00');
    this.cnvr_venta_importe_string = "";
    this.cnvr_venta_moneda_codigo = "MXN";
    this.cnvr_venta_moneda_nombre = "Peso Mexicano";
    this.cnvr_venta_moneda_decimales_cantidad = 2;
    this.cnvr_venta_moneda_decimales_string = "00";
    this.cnvr_venta_tipo_cambio_simple = 1.00;
    this.cnvr_venta_tipo_cambio_format = numeral(1).format('$1.00');
    this.decide_generar_factura = "";
    this.progressBarRegistro = false;
    this.fecha_venta_impresion = new Date().toLocaleString();
    this.codigo_acceso_venta_impreso = "";
    this.codigo_acceso_venta_cifrado = "";
    this.passwo_acceso_venta_impreso = "";
    this.passwo_acceso_venta_cifrado = "";
    this.folio_venta_generada = "";
  
    this.venta_cobro_forma_generada = "";
    this.venta_cobro_fecha = "";
    this.venta_cobro_banco = "";
    this.venta_cobro_cuenta_card_clabe = "";
    this.venta_cobro_clave_referencia = "";
    this.venta_cobro_moneda_code = "";
    this.venta_cobro_moneda_decimales = 2;
    this.venta_cobro_importe_simple = 0.00;
    this.venta_cobro_importe_format = numeral(0).format('$0.00');
    this.venta_cobro_concepto = "ventas a público general";
    this.venta_cambio = "";
    this.validator.limpiaInputRow(document.getElementById("vent_cliente_selected")); 
    this.validator.limpiaInputRow(document.getElementById("vent_pventa_selected")); 
    this.validator.limpiaInputRow(document.getElementById("vent_monedaventa_selected")); 
    if (this.cnvr_venta_moneda_codigo != this.mx_venta_moneda_codigo) {
      this.validator.limpiaInputRow(document.getElementById("vent_tipoCambioventa_selected"));
    }
    this.validator.limpiaInputRow(document.getElementById("vent_search_articulo"));
  }
}
