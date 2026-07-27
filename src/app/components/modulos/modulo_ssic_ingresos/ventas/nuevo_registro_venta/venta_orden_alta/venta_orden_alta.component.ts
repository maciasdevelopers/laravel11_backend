import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { global } from "../../../../../../servicios/global_ssic"; 
import { InterfMonedas } from '../../../../../../interfaces/interf-monedas';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { VentasServService } from '../../../../../../servicios/ssic/ventas-serv.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { UbicacionServService } from '../../../../../../servicios/ssic/ubicacion-serv.service';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service'; 
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service'; 
import { ClientesService } from '../../../../../../servicios/ssic/clientes.service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import numeral from 'numeral';
import Swal from 'sweetalert2';

@Component({
  selector: 'app_interno_ingresos_orden_de_venta_registro',
  templateUrl: './venta_orden_alta.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/div_busqueda.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/ubicaciones.css',
    '../../../ingresos.css',
    './venta_orden_alta.component.css'
  ],
})
export class AltaVentasIngresosComponent implements OnInit {
  catalogo_monedas_api: any = [];
  catalogo_monedas_filtro_busqueda: any;
  arrayDesgloseVenta:any = [];
  arrayvClientes:any = [];
  arrayListaPVentas:any = [];

  tokenServProd:any = [];
  arrayTokenDescuento:any = [];
  arrayTokenImpuestos:any = [];
  articulos:any = [];
  arrayListaDescuentos:any = [];
  arrayListaPromociones:any = [];
  arrayListaImpuestos:any = [];
  datosCaja:any = [];
  datosCajaAlmacenDir:any = [];
  listaBancosVent:any = [];
  
  arrayFormaPago:any = [];
  arrayEfectVent:any = [];
  arrayCheque:any = [];
  arrayValDesp:any = [];
  listFpagoCheque:any = [];
  listFpagoValeDesp:any = [];
  
  public txtFolioClientV:string;
  public txtHiddenclienteToken:string;
  public txtNombreClientV:string;
  public txtRfcClientV:string;
  public txtListaPrecV:string;
  public txtMonedaClientV:string;
  public txtTipoCambioClientV:string;
  public responsableEntrega:string;

  public txtsubtotalVenta:string;
  public txttotalDescuentoVenta:string;
  public txtiva:string;
  public txtisRetenido:string;
  public txtivaRetenido:string;
  public txtieps:string;
  public txtotrosImpuFed:string;
  public txtotrosImpuLocal:string;
  public txttotal:string;
  public totalFpagoCheque:string;
  public totalFpagoValeDesp:string;
  public dinRecibido:string;
  public dinResta:string;
  public dinCambio:string;
  arrayLatLong:any = [];
  public latude:string;
  public longude:string;

  modalClientesVisible: boolean = false;
  modalSeriesLotesVisible: boolean = false;
  modalDescuentosVisible: boolean = false;
  modalPromocionesVisible: boolean = false;

  tiposBusqueda: any[] = [];
  
  tipoBusquedaSeleccionado: any;
  textoBusquedaProducto: string = '';
  clienteSeleccionado: any;
  direccionSeleccionada: any;

  productoSeleccionado: any;
  descuentoSeleccionado: any;
  promocionSeleccionada: any;
  seriesSeleccionadas: any[] = [];
  lotesSeleccionados: any[] = [];
  pedimentosSeleccionados: any[] = [];

  montoEfectivo: any;
  montoCheque: any;
  montoVale: any;
  bancoSeleccionado: any;
  limiteCredito: string = '';
  diasPago: string = '';
  numeroContrato: string = '';
  numeroCuenta: string = '';
  numeroReferencia: string = '';
  clabeInterbanc: string = '';

  divAltaVenta: boolean = false;
  divFormPagoGnral: boolean = false;
  divLugarEntrega: boolean = false;
  divTipoUsuario: boolean = true;
  
  clientListaTotal:any = [];
  clientListaPag:any = [];
  clientTotalRecords: number = 0;
  clientfilterSearch: number = 0;
  clientRows: number = 10;
  clientBuscar: string = '';
  
  @ViewChild('vpgeneral') vpgeneral: ElementRef = {} as ElementRef;
  @ViewChild('divAltaVenta') divAltaVentaEl: ElementRef = {} as ElementRef;
  @ViewChild('divOperProdServ') divOperProdServ: ElementRef = {} as ElementRef;
  @ViewChild('divFormPagoGnral') divFormPagoGnralEl: ElementRef = {} as ElementRef;
  @ViewChild('divPagoEfectivo') divPagoEfectivo: ElementRef = {} as ElementRef;
  @ViewChild('divPagoChque') divPagoChque: ElementRef = {} as ElementRef;
  @ViewChild('divPagoValeDespensa') divPagoValeDespensa: ElementRef = {} as ElementRef;
  @ViewChild('divLugarEntrega') divLugarEntregaEl: ElementRef = {} as ElementRef;
  @ViewChild('btnVentaPreReg') btnVentaPreReg: ElementRef = {} as ElementRef;

  public newFolioVenta:string;
  public usuario: Usuarios;
  public isDisabled: boolean;
  constructor(private renderer:Renderer2,
    public monedasServ:MonedasService,
    public _ventServ: VentasServService,
    public ubicaServ: UbicacionServService,
    public _cajServ: CajaServService,
    public bancos:BancosServService,
    public validator:ValidatorServService,
    public _clientServ: ClientesService) { 

    this.txtHiddenclienteToken = '---';
    this.txtFolioClientV = '---';
    this.txtNombreClientV = '---';
    this.txtRfcClientV = 'XAXX010101000';
    this.txtListaPrecV = 'público general';
    this.txtMonedaClientV = 'MXN-PESO MEXICANO';
    this.txtTipoCambioClientV = '$1.00';

    this.newFolioVenta = '';
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.isDisabled = false;
    this.txtsubtotalVenta = '$0.00';
    this.txttotalDescuentoVenta = '$0.00';
    this.txtiva = '$0.00';
    this.txtisRetenido = '$0.00';
    this.txtivaRetenido = '$0.00';
    this.txtieps = '$0.00';
    this.txtotrosImpuFed = '$0.00';
    this.txtotrosImpuLocal = '$0.00';
    this.txttotal = '$0.00';
    this.listFpagoCheque[0] = '1'; 
    this.listFpagoValeDesp[0] = '1';
    this.latude = '';
    this.longude = '';
    this.arrayCheque[0] = '';
    this.arrayValDesp[0] = '';
    this.totalFpagoCheque = '$0.00';
    this.totalFpagoValeDesp = '$0.00';
    this.dinRecibido = '$0.00';
    this.dinResta = '$0.00';
    this.dinCambio = '$0.00';
    this.responsableEntrega = '';

    this.tiposBusqueda = [
      {label: 'Clasificación', value: 'clasificacion'},
      {label: 'Unidad de Medida-SAT', value: 'unidadSat'},
      {label: 'Catálogo SAT', value: 'catalogoSat'},
      {label: 'Nombre producto/Servicios', value: 'concepto'},
      {label: 'Precio', value: 'precio'}
    ];
  }

  ngOnInit(): void {
    $('.tooltipped').tooltip();

    this.monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          this.catalogo_monedas_filtro_busqueda = response.monedas.map((item: any) => ({ searchField: `${item.code} ${item.langEN}` }));
          console.log(this.catalogo_monedas_api);
        }
      }
    )

    this._clientServ.catalogoClientesGeneral('all_partidas','','').subscribe(
      (response: any) => {
        if (response.status == 'success') {
          this.arrayvClientes = response.clientes;
        }
      }, 
      (error: any) => {
        console.log(error);
      }
    );

    this._ventServ.folioNewVenta().subscribe(
      (response: any) => {
        if (response.status == 'success') {
          this.newFolioVenta = response.folioNV;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );

    this._ventServ.listaArticulos().subscribe(
      (response: any) => {
        if (response.status == 'success') {
          this.arrayListaPVentas = response.listaArticulos;
          $('.tooltipped').tooltip();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );

    this._cajServ.getresponsableCajaVentas().subscribe(
      (response: any) => {
        if (response.status == 'success') {
          this.datosCaja = response.caja;
          this.datosCajaAlmacenDir = this.datosCaja[0].token_direccion;
          this.responsableEntrega = this.datosCaja[0].pers_token;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );

    this.bancos.getListaBancos().subscribe(
      (response: any) => {
         if (response.status == 'success') {
           this.listaBancosVent = response.banco;
        }
      }, 
      (error: any) => {
        console.log(error);
      }
    );
  }

  geolocalizar(){
    const d= document,
    n = navigator,
    options = {
      enableHighAccuracy:true,
      timeout:100,
      maximumAge:0,
    }; 

    const success = (position:any) => {
      console.log("lat "+this.latude+" long "+this.longude);
    };

    const error = (err:any) => {
      console.log("Error "+err.code+":"+err.message);
    };

    n.geolocation.getCurrentPosition(success,error,options);
  }

  btnVentaPubGeneral(){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea seleccionar venta para público general?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'aceptar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.iniciaProcesoVentaClient('publico_general');
      }
    });
  }

  mostrarModalClientes(){
    this.modalClientesVisible = true;
  }

  selectCliente(cliente: any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea seleccionar venta para este cliente?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'aceptar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.txtHiddenclienteToken = cliente.token;
        this.txtFolioClientV = cliente.folio;
        this.txtNombreClientV = cliente.nombre;
        this.txtRfcClientV = cliente.rfc;
        this.txtListaPrecV = cliente.listaPrecios;
        this.modalClientesVisible = false;
        this.divAltaVenta = true;
      }
    });
  }

  regresarMenu(){
    this.divAltaVenta = false;
    this.divFormPagoGnral = false;
    this.divLugarEntrega = false;
    this.arrayDesgloseVenta = [];
    this.sumaImporteFunct();
  }

  selectMonedaVenta(event:any){
    this.txtMonedaClientV = event.value;
  }

  changeTipoCambioVenta(event:any){
    this.txtTipoCambioClientV = event.value;
  }

  cantidadKeyup(event:any){
    let cantidadTxt:any = event.value;
    if (event.value != '' && /^[0-9]*$/.test(event.value)) {
      event.classList.remove("error");
      this.operacionVentaPartida(event);
    } else {
      event.classList.add("error");
    } 
  }

  checkDescuentoInp(descuento: any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea agregar este descuento?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.operacionVentaPartida(descuento);
        Swal.fire('Agregado!', 'Este descuento se ha agregado', 'success');
      }
    });
  }

  operacionVentaPartida(valor:any){
    // Lógica de cálculo de partidas
  }

  descargaArticulo(event:any, producto: any){
    this.productoSeleccionado = producto;
    
    if (producto.arraySerieLoteImport && 
        (producto.arraySerieLoteImport.serie.length > 0 || 
         producto.arraySerieLoteImport.lote.length > 0 ||
         producto.arraySerieLoteImport.pedimento.length > 0)) {
      this.mostrarModalSeriesLotes(producto);
    } else {
      this.agregarArticuloAlDesglose(event, producto);
    }
  }

  mostrarModalSeriesLotes(producto: any){
    this.productoSeleccionado = producto;
    this.seriesSeleccionadas = [];
    this.lotesSeleccionados = [];
    this.pedimentosSeleccionados = [];
    this.modalSeriesLotesVisible = true;
  }

  confirmarSeriesLotes(){
    this.modalSeriesLotesVisible = false;
    this.agregarArticuloAlDesglose(null, this.productoSeleccionado);
  }

  mostrarModalDescuentos(producto: any){
    this.productoSeleccionado = producto;
    this.modalDescuentosVisible = true;
  }

  mostrarModalPromociones(producto: any){
    this.productoSeleccionado = producto;
    this.modalPromocionesVisible = true;
  }

  agregarArticuloAlDesglose(event: any, producto: any){
    this.arrayDesgloseVenta.push({
      token_articulo: producto.token_articulo,
      imagen: producto.imagen,
      clasificacion: producto.clasificacion,
      sat: producto.sat,
      clave: producto.clave,
      concepto: producto.concepto,
      precioBase: producto.precioBase,
      cantidad: producto.dataCantidad || 1,
      paramDescuento: '$0.00',
      totalPromociones: '$0.00',
      totalImpretenido: '$0.00',
      totalImptrasladado: '$0.00',
      paramImportePartidaImpuesto: producto.precioBase,
      listaRetenidos: [],
      listaTrasladado: []
    });
    
    this.sumaImporteFunct();
    this.divFormPagoGnral = true;
    this.divLugarEntrega = true;
  }

  eliminaArticulo(event:any){
    let tokenarticulo:any = $(event).parent("td").parent("tr").find("td").eq(0).html();
    for (let i = 0; i < this.arrayDesgloseVenta.length; i++) {  
      if (this.arrayDesgloseVenta[i]['token_articulo'] == tokenarticulo) {
        this.arrayDesgloseVenta.splice(i,1);
      }
    }
    this.sumaImporteFunct();
  }

  onSellClick(event : MouseEvent){
    (event.target as HTMLLinkElement).disabled = true;
  }

  sumaImporteFunct(){
    let sumaSubtotal:any = 0; 
    let sumaDescuento:any = 0;
    let sumaIva:any = 0;
    let sumaIsRetenido:any = 0;
    let sumaIvaRetenido:any = 0;
    let sumaIeps:any = 0;
    let sumaOtrosImpuFed:any = 0;
    let sumatrosImpuLocal:any = 0;
    let subImporte:any = 0;
    
    for (let i = 0; i < this.arrayDesgloseVenta.length; i++) {
      let precioVenta = this.arrayDesgloseVenta[i]['precioBase'] || '0';
      let cantidadVenta = this.arrayDesgloseVenta[i]['cantidad'] || 0;
      let descuentoVenta = this.arrayDesgloseVenta[i]['paramDescuento'] || '$0.00';
      let valorIva = this.arrayDesgloseVenta[i]['clasificacionImpIva'] || '0';
      let valorIsRet = this.arrayDesgloseVenta[i]['clasificacionImpIsRet'] || '0';
      let valorIvaRet = this.arrayDesgloseVenta[i]['clasificacionImpIvaRet'] || '0';
      let valorIeps = this.arrayDesgloseVenta[i]['clasificacionImpIeps'] || '0';
      let valorOtroImpFed = this.arrayDesgloseVenta[i]['clasificacionImpOtrImpFed'] || '0';
      let valorOtroImpLoc = this.arrayDesgloseVenta[i]['clasificacionImpOtrImpLoc'] || '0';

      var valorUnitario = precioVenta.replace(",","");
      sumaSubtotal = parseFloat(sumaSubtotal) + (parseFloat(valorUnitario) * parseFloat(cantidadVenta));

      var valorDesc = descuentoVenta.replace("$","").replace(",","");
      sumaDescuento = parseFloat(sumaDescuento) + parseFloat(valorDesc);
      
      var valIva = valorIva.replace(",","");
      sumaIva = parseFloat(sumaIva) + parseFloat(valIva);

      var valIsRetenido = valorIsRet.replace(",","");
      sumaIsRetenido = parseFloat(sumaIsRetenido) + parseFloat(valIsRetenido);

      var valIvaRetenido = valorIvaRet.replace(",","");
      sumaIvaRetenido = parseFloat(sumaIvaRetenido) + parseFloat(valIvaRetenido);

      var valIeps = valorIeps.replace(",","");
      sumaIeps = parseFloat(sumaIeps) + parseFloat(valIeps);

      var valOtroImpFed = valorOtroImpFed.replace(",","");
      sumaOtrosImpuFed = parseFloat(sumaOtrosImpuFed) + parseFloat(valOtroImpFed);

      var valOtroImpLoc = valorOtroImpLoc.replace(",","");
      sumatrosImpuLocal = parseFloat(sumatrosImpuLocal) + parseFloat(valOtroImpLoc);
      
      subImporte = parseFloat(sumaSubtotal) - parseFloat(sumaDescuento) + parseFloat(sumaIva) - parseFloat(sumaIsRetenido) - parseFloat(sumaIvaRetenido);   
    }

    var nutot = numeral(sumaSubtotal);
    sumaSubtotal = nutot.format('$0,0.00');
    this.txtsubtotalVenta = sumaSubtotal;

    var nutot = numeral(sumaDescuento);
    sumaDescuento = nutot.format('$0,0.00');
    this.txttotalDescuentoVenta = sumaDescuento;

    var nutot = numeral(sumaIva);
    sumaIva = nutot.format('$0,0.00');
    this.txtiva = sumaIva;

    var nutot = numeral(sumaIsRetenido);
    sumaIsRetenido = nutot.format('$0,0.00');
    this.txtisRetenido = sumaIsRetenido;

    var nutot = numeral(sumaIvaRetenido);
    sumaIvaRetenido = nutot.format('$0,0.00');
    this.txtivaRetenido = sumaIvaRetenido;

    var nutot = numeral(sumaIeps);
    sumaIeps = nutot.format('$0,0.00');
    this.txtieps = sumaIeps;

    var nutot = numeral(sumaOtrosImpuFed);
    sumaOtrosImpuFed = nutot.format('$0,0.00');
    this.txtotrosImpuFed = sumaOtrosImpuFed;

    var nutot = numeral(sumatrosImpuLocal);
    sumatrosImpuLocal = nutot.format('$0,0.00');
    this.txtotrosImpuLocal = sumatrosImpuLocal;

    var nutot = numeral(subImporte);
    subImporte = nutot.format('$0,0.00');
    this.txttotal = subImporte;
  }

  abreFormaPagoChequeFrom(event:any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea habilitar la forma de pago con cheque?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoCheque.push(this.listFpagoCheque.length + 1);
      } 
    });
  }

  abreFormaPagoValeDespFrom(event:any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea habilitar la forma de pago con vales de despensa?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoValeDesp.push(this.listFpagoValeDesp.length + 1);
      } 
    });
  }

  btnDeletePagoCheque(event:any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea eliminar este apartado para pago con cheques?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, eliminar',
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sumaFormasPago();
      } 
    });
  }

  btnAddPagoCheque(event:any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea habilitar otro apartado para pago con cheques?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoCheque.push(this.listFpagoCheque.length + 1);
      } 
    });
  }

  btnDeletePagoValeDesp(event:any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea eliminar este apartado para vales de despensa?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, eliminar',
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sumaFormasPago();
      } 
    });
  }

  btnAddPagoValeDesp(event:any){
    Swal.fire({
      title: "Alerta",
      text: "¿Desea habilitar otro apartado para vales de despensa?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoValeDesp.push(this.listFpagoValeDesp.length + 1);
      } 
    });
  }

  btnCierraPago(event:any){
    // Lógica para cerrar secciones de pago
  }

  btnAbrePago(event:any){
    // Lógica para abrir secciones de pago
  }

  llenaPagoEfect(event:any){
    if (event.value != '' && this.validator.filtroCosto(event.value) == true) {
      this.arrayEfectVent[0] = event.value;
      this.arrayEfectVent[0] = numeral(this.arrayEfectVent[0]);
      this.arrayEfectVent[0] = (this.arrayEfectVent[0].format('$0,0.00'));
      this.validator.correctoInput(event,"Monto a pagar "+this.arrayEfectVent[0]);
      this.sumaFormasPago();
    } else {
      this.validator.errorInput(event,"Monto a pagar invalido");
    }
  }

  validaDateCheque(event:any){
    let txtNumRefCheque = $(event).parent("div").parent("div.content").find("input.txtNumRefCheque");
    if (event.value == '' || !/^\d{2,4}\-\d{1,2}\-\d{1,2}$/.test(event.value)) {
      this.validator.errorInput(event,"Fecha invalida");
      $(txtNumRefCheque).attr("disabled","disabled");
    } else {
      this.validator.correctoInput(event,"Fecha:");
      $(txtNumRefCheque).removeAttr("disabled");
    }
  }

  validaNumRefCheque(event:any){
    let txtBancoCheque = $(event).parent("div").parent("div.content").find("input.txtBancoCheque");
    if (event.value == '' || !this.validator.filtroNum(event.value) == true || event.value.length < 4) {
      this.validator.errorInput(event,"No. cheque invalido");
      $(txtBancoCheque).attr("disabled","disabled");
    } else {
      this.validator.correctoInput(event,"No. cheque");
      $(txtBancoCheque).removeAttr("disabled");
    }
  }

  validaBancoCheque(event:any){
    let txtTitularCheque = $(event).parent("div").parent("div.content").find("input.txtTitularCheque");
    if (event.value == '' || !this.validator.filtroAlfaNumerico(event.value) == true) {
      this.validator.errorInput(event,"Banco invalido");
      $(txtTitularCheque).attr("disabled","disabled");
    } else {
      this.validator.correctoInput(event,"Banco");
      $(txtTitularCheque).removeAttr("disabled");
    }
  }

  validaTitularCheque(event:any){
    let txtMontoCheque = $(event).parent("div").parent("div.content").find("input.txtMontoCheque");
    if (event.value == '' || !this.validator.filtroAlfaNumerico(event.value) == true || event.value.length < 4) {
      this.validator.errorInput(event,"Titular invalido");
      $(txtMontoCheque).attr("disabled","disabled");
    } else {
      this.validator.correctoInput(event,"Titular");
      $(txtMontoCheque).removeAttr("disabled");
    }
  }

  llenaPagoCheques(event:any){
    let divIndex = $(event).parent("div").parent("div").parent("div");
    let btnAddPagoCheque = $(event).parent("div").parent("div.content").parent("div.divChqueNominativo").find("btnAddPagoCheque");   
    let txtDateCheque = $(event).parent("div").parent("div.content").find("input.txtDateCheque");
    let txtNumRefCheque = $(event).parent("div").parent("div.content").find("input.txtNumRefCheque");
    let txtBancoCheque = $(event).parent("div").parent("div.content").find("input.txtBancoCheque");
    let txtTitularCheque = $(event).parent("div").parent("div.content").find("input.txtTitularCheque");
    if (event.value != '' && this.validator.filtroCosto(event.value) == true) {
      $(btnAddPagoCheque).removeAttr("disabled");
      this.sumaFormasPago();
      let datPcheque = event.value;
      datPcheque = numeral(datPcheque);
      datPcheque = (datPcheque.format('$0,0.00'));
      this.arrayCheque[divIndex.index()] = [{
        "txtDateCheque":txtDateCheque.val(),
        "txtNumRefCheque":txtNumRefCheque.val(),
        "txtBancoCheque":txtBancoCheque.val(),
        "txtTitularCheque":txtTitularCheque.val(),
        "montoChque":datPcheque
      }];
      this.validator.correctoInput(event,"Monto a pagar: "+datPcheque);
      $(btnAddPagoCheque).removeAttr("disabled");
    } else {
      this.validator.errorInput(event,"Monto a pagar invalido");
      $(btnAddPagoCheque).attr("disabled","disabled");
    } 
  }

  llenaPagoValeDesp(event:any){
    let divIndex = $(event).parent("div").parent("div").parent("div");
    let txtNumRefValDesp = $(event).parent("div").parent("div.content").find("input.txtNumRefValDesp");
    if (event.value != '' && /^[0-9.,$]*$/.test(event.value)) {
      let datPvale = event.value;
      datPvale = numeral(datPvale);
      datPvale = (datPvale.format('$0,0.00'));
      this.arrayValDesp[divIndex.index()] = [{
        "txtNumRefValDesp":txtNumRefValDesp.val(),
        "montoVale":datPvale
      }];
    } 
  }

  sumaFormasPago(){
    let sumaResta:any = 0;
    let sumaCambio:any = 0;
    let calcpagoCheque:any = 0;
    let calcpagoVale:any = 0;
    let totalPago:any = 0;
    let miontoformPago:any = $("#divFormPagoGnral").find(".miontoformPago");
    let txtMontoCheque:any = $("#divFormPagoGnral").find(".txtMontoCheque");
    let txtMontoValDesp:any = $("#divFormPagoGnral").find(".txtMontoValDesp"); 

    let valorTotalVenta:any = this.txttotal.replace("$","");
    valorTotalVenta = valorTotalVenta.replace(",","");
    for (let i = 0; i < miontoformPago.length; i++) {
        if (miontoformPago[i].value != '') {
          let sumatoriaformPago = miontoformPago[i].value.replace("$","");
          sumatoriaformPago = sumatoriaformPago.replace(",","");
          totalPago = parseFloat(totalPago) + parseFloat(sumatoriaformPago);
        } else {
          totalPago = parseFloat(totalPago) + parseFloat('0.00');
        }
    }
    
    for (let i = 0; i < txtMontoCheque.length; i++) {
      if (txtMontoCheque[i].value != '') {
        let sumaPagoCheque = txtMontoCheque[i].value.replace("$","");
        sumaPagoCheque = sumaPagoCheque.replace(",","");
        calcpagoCheque = parseFloat(calcpagoCheque) + parseFloat(sumaPagoCheque);
      } else {
        calcpagoCheque = parseFloat(calcpagoCheque) + parseFloat('0.00');
      }
      calcpagoCheque = numeral(calcpagoCheque);
      calcpagoCheque = (calcpagoCheque.format('$0,0.00'));
    }
    this.totalFpagoCheque = calcpagoCheque;
    for (let i = 0; i < txtMontoValDesp.length; i++) {
      if (txtMontoValDesp[i].value != '') {
        let sumaPagoDesp = txtMontoValDesp[i].value.replace("$","");
        sumaPagoDesp = sumaPagoDesp.replace(",","");
        calcpagoVale = parseFloat(calcpagoVale) + parseFloat(sumaPagoDesp);
      } else {
        calcpagoVale = parseFloat(calcpagoVale) + parseFloat('0.00');
      }
      calcpagoVale = numeral(calcpagoVale);
      calcpagoVale = (calcpagoVale.format('$0,0.00'));
    }
    this.totalFpagoValeDesp = calcpagoVale;
    
    if (valorTotalVenta == '0.00' || totalPago == '' || totalPago == '0.00') {
      this.renderer.setAttribute(this.btnVentaPreReg.nativeElement,"disabled","disabled");
    } else {
      if (valorTotalVenta == totalPago) {
        this.todoPagoVenta();
      } else {
        if (totalPago > valorTotalVenta) {
          this.todoPagoVenta();
          sumaCambio = parseFloat(sumaCambio) + parseFloat(totalPago) - parseFloat(valorTotalVenta);
        }
        if (totalPago < valorTotalVenta) {
          this.renderer.setAttribute(this.btnVentaPreReg.nativeElement,"disabled","disabled");
          sumaResta = parseFloat(sumaResta) + parseFloat(totalPago) - parseFloat(valorTotalVenta);
        }
      }
    }

    var nutot = numeral(totalPago);
    totalPago = nutot.format('$0,0.00');
    this.dinRecibido = totalPago;

    var nutot = numeral(sumaResta);
    sumaResta = nutot.format('$0,0.00');
    sumaResta = sumaResta.replace("-","");
    this.dinResta = sumaResta;

    var nutot = numeral(sumaCambio);
    sumaCambio = nutot.format('$0,0.00');
    this.dinCambio = sumaCambio;
  }

  todoPagoVenta(){
    this.arrayFormaPago[0] = this.arrayEfectVent;
    this.arrayFormaPago[1] = this.arrayCheque;
    this.arrayFormaPago[2] = this.arrayValDesp;
    this.renderer.removeAttribute(this.btnVentaPreReg.nativeElement,"disabled");
  }

  saveVenta(){
    this._ventServ.registraVenta(this.txtHiddenclienteToken,this.txtListaPrecV,this.txtMonedaClientV,
      this.txtTipoCambioClientV,this.arrayDesgloseVenta,this.datosCaja,this.datosCajaAlmacenDir,
      this.responsableEntrega,this.arrayFormaPago).subscribe(
        (response: any) => {
          if (response.status == 'success') {
            Swal.fire({
              position:'center',
              icon: 'success',
              title: response.message,
              showConfirmButton:false,
              timer: 3000
            });
          }
          if (response.status == 'error') {
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: response.message,
              showConfirmButton:false,
              timer: 3000
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  iniciaProcesoVentaClient(token_cat_clientes:any){
    if(token_cat_clientes === 'publico_general') {
      this.txtHiddenclienteToken = 'publico';
      this.txtFolioClientV = 'PÚBLICO GENERAL';
      this.txtNombreClientV = 'PÚBLICO GENERAL';
      this.txtRfcClientV = 'XAXX010101000';
      this.txtListaPrecV = 'público general';
    }
    this.divAltaVenta = true;
    this.divTipoUsuario = false;
  }

  lista_clientes(){
    this._clientServ.catalogoClientesGeneral('all_partidas','','').subscribe(
      (response: any) => {
        if (response.status == 'success') {
          this.clientListaTotal = response.clientes;
          this.clientTotalRecords = this.clientListaTotal.length;
          this.clientListaPag = this.clientListaTotal.slice(0,10);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  clientPaginador(event: any) {
    this.clientfilterSearch = event.first;
    this.clientRows = event.rows;
    this.clientUpdatePaginated();
  }

  clientUpdatePaginated() {
    const filteredItems = this.clientListaTotal.filter((item:any) => 
      item.folio.toLowerCase().includes(this.clientBuscar.toLowerCase()) ||
      item.nombre.toLowerCase().includes(this.clientBuscar.toLowerCase()) ||
      item.pais.toLowerCase().includes(this.clientBuscar.toLowerCase()) ||
      item.rfc_generico.toLowerCase().includes(this.clientBuscar.toLowerCase()) ||
      item.rfc_prov.toLowerCase().includes(this.clientBuscar.toLowerCase()) ||
      item.tax_id_prov.toLowerCase().includes(this.clientBuscar.toLowerCase()));
    this.clientTotalRecords = filteredItems.length;
    this.clientListaPag = filteredItems.slice(this.clientfilterSearch, this.clientfilterSearch + this.clientRows);
  }

  verClienteInfo(token_cat_clientes:any){
    const client = this.clientListaPag.find((row:any) => row.token_cat_clientes == token_cat_clientes);
    if(client) {
      client.data_detalle_vista = !client.data_detalle_vista ? true : false;
      if (client.data_detalle_vista) {
        this.informacionProveedor(token_cat_clientes);
      }
    }
  }

  informacionProveedor(token_cat_clientes:any){
    this._clientServ.getViewcliente(token_cat_clientes).subscribe(
      (response: any) => {
        if (response.status == 'success') {
          const client = this.clientListaPag.find((row:any) => row.token_cat_clientes == token_cat_clientes);
          if(client) {
            client.data_detalle = response.datosCliente;
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}