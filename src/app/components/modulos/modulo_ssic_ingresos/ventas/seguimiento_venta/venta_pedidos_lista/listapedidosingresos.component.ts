import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { global } from '../../../../../../servicios/global_ssic';
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
import { TranslateService } from '@ngx-translate/core';
//import * as JSpdf from 'jspdf';

@Component({
  selector: 'app-interno-ingresos-ventas',
  templateUrl: './listapedidosingresos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/file_input.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/landing.css',
    '../../../ingresos.css',
    './listapedidosingresos.component.css'],
})
export class ListaPedidosIngresosComponent implements OnInit {
   @Input() getlistaPedido:boolean = false;
   @Input() getformPedido:boolean = false;
   @Input() getformDataVentas:boolean = false;
   @Input() getformAltaVenta:boolean = false;
   @Input() getlistaDevol:boolean = false;
   @Input() getformDevol:boolean = false;
   @Input() getlistaSeg:boolean = false;
   @Input() getformSeg:boolean = false;
  arrayMonedasVent: InterfMonedas[] = [];
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

  @ViewChild('vpgeneral') vpgeneral: ElementRef = {} as ElementRef;
  @ViewChild('divAltaVenta') divAltaVenta: ElementRef = {} as ElementRef;
  @ViewChild('divTipoUsuario') divTipoUsuario: ElementRef = {} as ElementRef;
  @ViewChild('divOperProdServ') divOperProdServ: ElementRef = {} as ElementRef;

  @ViewChild('divFormPagoGnral') divFormPagoGnral: ElementRef = {} as ElementRef;

  @ViewChild('divPagoEfectivo') divPagoEfectivo: ElementRef = {} as ElementRef;
  @ViewChild('divPagoChque') divPagoChque: ElementRef = {} as ElementRef;
  @ViewChild('divPagoValeDespensa') divPagoValeDespensa: ElementRef = {} as ElementRef;

  @ViewChild('divLugarEntrega') divLugarEntrega: ElementRef = {} as ElementRef;
  @ViewChild('btnVentaPreReg') btnVentaPreReg: ElementRef = {} as ElementRef;

  public newFolioVenta:string;
  public usuario: Usuarios;
  public isDisabled: boolean;
  constructor(
    private renderer:Renderer2,
    private monedasServ:MonedasService,
    private _ventServ: VentasServService,
    private ubicaServ: UbicacionServService,
    private _cajServ: CajaServService,
    private bancos:BancosServService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private _clientServ: ClientesService) {
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
  }

  ngOnInit(): void {
    //this.geolocalizar();
    this.cargaMenuVentas();
    setInterval(this.cargaMenuVentas.bind(this),5000);
    //$('.tooltipped').tooltip();
    let elems = document.querySelectorAll('.tooltipped');
    //let instances = M.Tooltip.init(elems, global.options);

    this.monedasServ.getMonedas().subscribe((data:InterfMonedas[]) => {
      this.arrayMonedasVent = data;
    })

    this._clientServ.catalogoClientesGeneral('all_partidas','','').subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayvClientes = response.clientes;
        }
      },
      error => {
        console.log(error);
      }
    );

    this._ventServ.folioNewVenta().subscribe(
      response => {
        if (response.status == 'success') {
          this.newFolioVenta = response.folioNV;
        }
      },
      error => {
        console.log(error);
      }
    )

    this._ventServ.listaArticulos().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayListaPVentas = response.listaArticulos;
          //$('.tooltipped').tooltip();
        }
      },
      error => {
        console.log(error);
      }
    )

    this._cajServ.getresponsableCajaVentas().subscribe(
      response => {
        if (response.status == 'success') {
          this.datosCaja = response.caja;
          this.datosCajaAlmacenDir = response.caja[0].token_almacen;
          this.responsableEntrega = response.caja[0].pers_token;
        }
      },
      error => {
        console.log(error);
      }
    )

    this.bancos.getListaBancos().subscribe(
      response => {
         if (response.status == 'success') {
           this.listaBancosVent = response.banco;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  cargaMenuVentas(){
    
  }

  geolocalizar(){
    const d= document,
    n = navigator,
    options = {
      enableHighAccuracy:true,
      timeout:100,
      maximumAge:0,
    }

    const success = (position:any) => {
      //this.latude = position.coords.latitude;
      //this.longude = position.coords.longitude;
      console.log("lat "+this.latude+" long "+this.longude);
      //this._cajServ.getresponsableCajaVentas(position.coords.latitude,position.coords.longitude).subscribe(
      //  response => {
      //    if (response.status == 'success') {
      //      this.datosCaja = response.caja;
      //      console.log(this.datosCaja);
      //    }
      //  },
      //  error => {
      //    console.log(error);
      //  }
      //)
    }

    const error = (err:any) => {
      console.log("Error "+err.code+":"+err.message);
    }

    n.geolocation.getCurrentPosition(success,error,options);
  }

  btnVentaPubGeneral(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea seleccionar venta para público general?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'aceptar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.renderer.removeClass(this.divAltaVenta.nativeElement,"noneView");
        this.renderer.addClass(this.divTipoUsuario.nativeElement,"noneView");
      } else {
        this.renderer.addClass(this.divAltaVenta.nativeElement,"noneView");
        this.renderer.removeClass(this.divTipoUsuario.nativeElement,"noneView");
      }
    });
  }

  selectCliente(event:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea seleccionar venta para este cliente?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'aceptar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        let trIndex = $(event).parents('td').parent('tr');
        this.txtHiddenclienteToken = event.value;
        //alert($(trIndex).find('td').eq(0).html());
        let tdFolio:any = $(trIndex).find('td').eq(0).html();
        this.txtFolioClientV = tdFolio;
        let tdNombreClient:any = $(trIndex).find('td').eq(3).html();
        this.txtNombreClientV = tdNombreClient;
        let tdRfcClient:any = $(trIndex).find('td').eq(2).html();
        this.txtRfcClientV = tdRfcClient;
        let tdListaPrecClient:any = $(trIndex).find('td').eq(4).html();
        this.txtListaPrecV = tdListaPrecClient;
        //$("#modalVentaclientList").modal('close');
        this.renderer.removeClass(this.divAltaVenta.nativeElement,"noneView");
        this.renderer.addClass(this.divTipoUsuario.nativeElement,"noneView");
      } else {
        this.renderer.addClass(this.divAltaVenta.nativeElement,"noneView");
        this.renderer.removeClass(this.divTipoUsuario.nativeElement,"noneView");
      }
    });
  }

  selectMonedaVenta(event:any){
    this.txtMonedaClientV = event.value;
  }

  changeTipoCambioVenta(event:any){
    this.txtTipoCambioClientV = event.value;
  }

  cantidadKeyup(event:any){
    let cantidadTxt:any = event.value;
    let txtExistenciaKardex = $(event).parents("#trDataVentas").find(".txtExistenciaKardex").html();
    if (event.value != '' && /^[0-9]*$/.test(event.value)) {
        if (typeof(txtExistenciaKardex) == 'undefined') {
          event.classList.remove("error");
          this.operacionVentaPartida(event);
        } else {
          if (parseFloat(cantidadTxt) <= parseFloat(txtExistenciaKardex)) {
            event.classList.remove("error");
            this.operacionVentaPartida(event);
          } else {
            event.classList.add("error");
          }
        }
    } else {
        event.classList.add("error");
    }
  }

  checkDescuentoInp(event:any){
    var descSelected = event.value;
    //var trDescuento = $(this).parent("label").parent("p").parents("td").parents("tr").parents("tbody").parents("#tabListaDescuentosVenta").find("tr").eq(2);
    //var tdTokenDescuentoP1 = $(trDescuento).find("input#txtSelectDescuento");
    //alert(tdTokenDescuentoP1);
    //arrayTokenDescuento = tdTokenDescuentoP1.val();
    //console.log(arrayTokenDescuento[0]);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar este descuento?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.operacionVentaPartida(event);
        Swal.fire(
          'Agregado!',
          'Este descuento se ha agregado',
          'success'
        )
      } else {
        $(event).removeAttr("checked");
      }
    });
    console.log("seleccion descuento1 "+this.arrayTokenDescuento.length);
  }

  operacionVentaPartida(valor:any){
    let trPrincipal = $(valor).parents("#trDataVentas");
    let tdTknVenta:any = $(valor).parents("#trDataVentas").find("#tdTknVenta").html();
    let precioBase:any = $(valor).parents("#trDataVentas").find("#tdPrecioBase").html();
    let cantidad:any = $(valor).parents("#trDataVentas").find(".txtCantidadVenta").val();
    let btnInfoDesc:any = $(valor).parents("#trDataVentas").find("#infoDesc");
    let btnInfoImp = $(valor).parents("#trDataVentas").find("#infoImp");
    let txtTotalDescuento = $(valor).parents("#trDataVentas").find(".txtTotalDescuento");
    let txtTotalImpuesto = $(valor).parents("#trDataVentas").find(".txtTotalImpuesto");
    let importePartida:any = $(valor).parents("#trDataVentas").find(".tdImportePartida");
    let valPrecio:any = precioBase.replace("$","");
    let subTotal:any = parseFloat(valPrecio) * parseFloat(cantidad);

    //alert("precioBase "+subTotal)

    //Descuentos
      let totalDescuentosPartidav:any = 0;
      for (let a = 0; a < this.arrayListaPVentas.length; a++) {
        const element = a;
        if (this.arrayListaPVentas[element]['token_articulo'] == tdTknVenta) {
          if (this.arrayListaPVentas[element]['arrayDescuentos'].length == 0) {
            totalDescuentosPartidav = 0;
          } else {
            let rutaDescuento = $(valor).parents("#trDataVentas").find("table.tabListaDescuentosVenta tbody");
            let tdRows = $(rutaDescuento).find("tr.trListaDescModal");
            //alert("tdRows.length "+tdRows.length);
            if (tdRows.length == 1) {
              let tdSelectDescuentos = $(rutaDescuento).find("tr").eq(0).find("td").eq(9);
              let tdInput = tdSelectDescuentos.find("input#txtSelectDescuento");
              let cuoPorc = $(rutaDescuento).find("tr").eq(0).find("#tdCoutaPorc").html();
              let monto = $(rutaDescuento).find("tr").eq(0).find("#tdMonto").html();
              let importeDescuento = $(rutaDescuento).find("tr").eq(0).find("#tdImporteDescuento");
              let descuento:any = 0;
              if ($(tdInput).is(":checked") || $(tdInput).is(":disabled")) {
                if (cuoPorc == 'cuota') {
                  descuento = parseFloat(monto.replace("$",""));
                } else {
                    let valorDesc = monto.replace("%","");
                    descuento = parseFloat(valorDesc) / 100;
                    descuento = parseFloat(subTotal) * parseFloat(descuento);
                }

                totalDescuentosPartidav = totalDescuentosPartidav + descuento;
                //alert(totalDescuentosPartidav);
                let nuDesc = numeral(descuento);
                txtTotalDescuento.html(nuDesc.format('$0,0.00'));
                importeDescuento.html(nuDesc.format('$0,0.00'));
                this.arrayTokenDescuento[0] = tdInput.val();
              }
            }
            if (tdRows.length > 1) {
              //alert("tdRows.length"+tdRows.length);
              //totalDescuentosPartidav = 0;
              for (let i = 0; i < tdRows.length; i++) {
                let descuento:any = 0;
                let tdSelectDescuentos = $(rutaDescuento).find("tr").eq(i).find("td").eq(9);
                let tdInput = tdSelectDescuentos.find("input#txtSelectDescuento");
                let tdInputAdd = tdSelectDescuentos.find("input#txtSelectDescuento").val();

                let cuoPorc = $(tdInput).parent("label").parent("p").parent("td").parent("tr").find("#tdCoutaPorc").html();
                //alert(cuoPorc);
                let monto = $(tdInput).parent("label").parent("p").parent("td").parent("tr").find("#tdMonto").html();
                let importeDescuento = $(tdInput).parent("label").parent("p").parent("td").parent("tr").find("#tdImporteDescuento");
                //alert(monto);
                this.arrayTokenDescuento[i] = tdInputAdd;
                console.log(this.arrayTokenDescuento);

                if (i == 0) {
                  if ( $(tdInput).is(":checked") || $(tdInput).is(":disabled") ) {
                    //alert(importeDescuento.html());
                    if (cuoPorc == 'cuota') {
                        descuento = monto.replace("$","");
                    } else {
                        let valorDesc = monto.replace("%","");
                        descuento = parseFloat(valorDesc) / 100;
                        descuento = parseFloat(subTotal) * parseFloat(descuento);
                    }
                    totalDescuentosPartidav = parseFloat(totalDescuentosPartidav) + parseFloat(descuento);
                    //alert("totalDescuentosPartidav1 "+totalDescuentosPartidav);
                    let nuDesc = numeral(descuento);
                    txtTotalDescuento.html(nuDesc.format('$0,0.00'));
                    importeDescuento.html(nuDesc.format('$0,0.00'));
                  }
                }

                if (i > 0) {
                  if ( $(tdInput).is(":checked") || $(tdInput).is(":disabled") ) {
                    //alert(importeDescuento.html());
                    if (cuoPorc == 'cuota') {
                        descuento = monto.replace("$","");
                    } else {
                        let valorDesc = monto.replace("%","");
                        descuento = parseFloat(valorDesc) / 100;
                        let replaceImPartida = importePartida.html().replace("$","");
                        replaceImPartida = replaceImPartida.replace(",","");
                        descuento = parseFloat(replaceImPartida) * parseFloat(descuento);
                    }
                    totalDescuentosPartidav = parseFloat(totalDescuentosPartidav) + parseFloat(descuento);
                    //alert("totalDescuentosPartidav2 "+totalDescuentosPartidav);
                    let nuDesc = numeral(totalDescuentosPartidav);
                    txtTotalDescuento.html(nuDesc.format('$0,0.00'));
                    importeDescuento.html(nuDesc.format('$0,0.00'));
                  }
                }

              }
            }
          }
        }
      }

    //Promociones
      let totalPromocionesPartidav:any = 0;


    //Resultados de operaciones (descuentos,promociones e impuestos)
      let conteoPartida:any = 0;
      subTotal = subTotal - parseFloat(totalDescuentosPartidav);
      subTotal = subTotal - parseFloat(totalPromocionesPartidav);
      subTotal = subTotal.toFixed(2);
      conteoPartida = numeral(subTotal);
      importePartida.html(conteoPartida.format('$0,0.00'));
  }

  descargaArticulo(event:any){
    let tokenarticulo:any = $(event).parents("#trDataVentas").find("#tdTknVenta").html();
    let infoSerieLoteImport = $(event).parents("#trDataVentas").find("#infoSerieLoteImport");
    let cantidad:any = $(event).parents("#trDataVentas").find(".txtCantidadVenta").val();
    //descuentos seleccionados
      let getListaDesc = JSON.stringify(this.arrayTokenDescuento);
      //alert(getListaDesc);
    //importe total de descuento
      let valdescuento:any = '';
      let txtTotalDescuento:any = $(event).parents("#trDataVentas").find(".txtTotalDescuento").html();
      if (typeof(txtTotalDescuento) == 'undefined') {
        valdescuento = '$0.00';
      } else {
        valdescuento = txtTotalDescuento;
      }

    //importe total de promocion
      let valpromocion:any = '$0.00';

    //importe de partida
      let importePartida:any = $(event).parents("#trDataVentas").find(".tdImportePartida").html();

      let btnselectArtuloSell:any = $(event).parents("#trDataVentas").find("a.btnselectArtuloSell");

    //recorrer array de articulos
    for (let i1 = 0; i1 < this.arrayListaPVentas.length; i1++) {
      //comparar token seleccionado con el array
      if (this.arrayListaPVentas[i1]['token_articulo'] == tokenarticulo) {
        //alert("for arrayListaPVentas ");
        //comoarar identificadoes
        if (this.arrayListaPVentas[i1]['identificador'] == 'Producto') {
          let txtExistenciaKardex:any = $(event).parents("#trDataVentas").find(".txtExistenciaKardex").html();
          //alert('$0.00 '+txtExistenciaKardex); validar arrays de serie lote y pedimento
          if (this.arrayListaPVentas[i1]['arraySerieLoteImport']['serie'].length != 0 ||
            this.arrayListaPVentas[i1]['arraySerieLoteImport']['lote'].length != 0 ||
            this.arrayListaPVentas[i1]['arraySerieLoteImport']['pedimento'].length != 0) {

            let selectLotSerAdu:any = $(event).parents("#trDataVentas").find('#tdModalexistKardex input[name="selectLotSerAdu"]:checked');

            if (selectLotSerAdu.length != 0) {
              let arrayselectLotSerAdu = [];
              let cantSelection:any = 0;
              //alert("selectLotSerAdu.length"+selectLotSerAdu.length);
              for (let i = 0; i < selectLotSerAdu.length; i++) {
                arrayselectLotSerAdu.push(selectLotSerAdu[i].value);
                let sumExist:any = $(selectLotSerAdu[i]).parent("label").parent("p").parent("td").parent("tr").find("td").eq(1).html();
                cantSelection = parseFloat(cantSelection) + parseFloat(sumExist);
              }
              //alert(arrayselectLotSerAdu);
              if (cantSelection >= cantidad) {
                infoSerieLoteImport.removeClass("btnError");
                this._ventServ.getArticuloDetProd(arrayselectLotSerAdu,tokenarticulo,cantidad,valdescuento,this.arrayTokenDescuento,valpromocion,importePartida).subscribe(
                  response => {
                    if (response.status == 'success') {
                      btnselectArtuloSell.addClass("btnDisabled");
                      this.renderer.removeClass(this.divOperProdServ.nativeElement,"noneView");
                      this.arrayDesgloseVenta[this.arrayDesgloseVenta.length] = response.listaArticulos[0];
                      console.log(this.arrayDesgloseVenta);
                      //$('.tooltipped').tooltip();
                      this.sumaImporteFunct();
                      this.renderer.removeClass(this.divFormPagoGnral.nativeElement,"noneView");
                      this.renderer.removeClass(this.divLugarEntrega.nativeElement,"noneView");
                    }
                  },
                  error => {
                    console.log(error);
                  }
                )
              } else {
                infoSerieLoteImport.addClass("btnError");
              }
            } else {
              infoSerieLoteImport.addClass("btnError");
            }
          } else {
            if (txtExistenciaKardex >= cantidad) {
              let arrayselectLotSerAdu:any = [];
              infoSerieLoteImport.removeClass("btnError");
              this._ventServ.getArticuloDetProd(arrayselectLotSerAdu,tokenarticulo,cantidad,valdescuento,this.arrayTokenDescuento,valpromocion,importePartida).subscribe(
                response => {
                  if (response.status == 'success') {
                    btnselectArtuloSell.addClass("btnDisabled");
                    this.renderer.removeClass(this.divOperProdServ.nativeElement,"noneView");
                    this.arrayDesgloseVenta[this.arrayDesgloseVenta.length] = response.listaArticulos[0];
                    console.log(this.arrayDesgloseVenta);
                    //$('.tooltipped').tooltip();
                    this.sumaImporteFunct();
                    this.renderer.removeClass(this.divFormPagoGnral.nativeElement,"noneView");
                    this.renderer.removeClass(this.divLugarEntrega.nativeElement,"noneView");
                  }
                },
                error => {
                  console.log(error);
                }
              )
            } else {
              infoSerieLoteImport.addClass("btnError");

            }
          }
        } else {
          this._ventServ.getArticuloDet(tokenarticulo,cantidad,valdescuento,this.arrayTokenDescuento,valpromocion,importePartida).subscribe(
            response => {
              if (response.status == 'success') {
                btnselectArtuloSell.addClass("btnDisabled");
                this.renderer.removeClass(this.divOperProdServ.nativeElement,"noneView");
                this.arrayDesgloseVenta[this.arrayDesgloseVenta.length] = response.listaArticulos[0];
                console.log(this.arrayDesgloseVenta);
                //$('.tooltipped').tooltip();
                this.sumaImporteFunct();
                this.renderer.removeClass(this.divFormPagoGnral.nativeElement,"noneView");
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      }
    }
  }

  eliminaArticulo(event:any){
    let tokenarticulo:any = $(event).parent("td").parent("tr").find("td").eq(0).html();
    for (let i = 0; i < this.arrayDesgloseVenta.length; i++) {
      if (this.arrayDesgloseVenta[i]['token_articulo'] == tokenarticulo) {
        this.arrayDesgloseVenta.splice(i,1);
        //alert(tokenarticulo);
      }
    }
    this.sumaImporteFunct();
  }

  onSellClick(event : MouseEvent){
    (event.target as HTMLLinkElement).disabled = true;
  }

  sumaImporteFunct(){
    //alert("holaaaaaasumaImporteFunct")
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
      let precioVenta = this.arrayDesgloseVenta[i]['precioBase'];
      let cantidadVenta = this.arrayDesgloseVenta[i]['cantidad'];
      let descuentoVenta = this.arrayDesgloseVenta[i]['paramDescuento'];
      let promocionVenta = this.arrayDesgloseVenta[i]['totalPromociones'];
      let impuestoRetVenta = this.arrayDesgloseVenta[i]['totalImpretenido'];
      let impuestoTrasVenta = this.arrayDesgloseVenta[i]['totalImptrasladado'];

      let valorIva = this.arrayDesgloseVenta[i]['clasificacionImpIva'];//$(this).find("td.impIva").html();
      let valorIsRet = this.arrayDesgloseVenta[i]['clasificacionImpIsRet'];//$(this).find("td.impIsRet").html();
      let valorIvaRet = this.arrayDesgloseVenta[i]['clasificacionImpIvaRet'];//$(this).find("td.impIvaRet").html();
      let valorIeps = this.arrayDesgloseVenta[i]['clasificacionImpIeps'];//$(this).find("td.impIeps").html();
      let valorOtroImpFed = this.arrayDesgloseVenta[i]['clasificacionImpOtrImpFed'];//$(this).find("td.impOtrImpFed").html();
      let valorOtroImpLoc = this.arrayDesgloseVenta[i]['clasificacionImpOtrImpLoc'];//$(this).find("td.impOtrImpLoc").html();
      let importeTotal = this.arrayDesgloseVenta[i]['paramImportePartidaImpuesto'];

      //alert(precioVenta);
        var valorUnitario = precioVenta.replace(",","");
        sumaSubtotal = parseFloat(sumaSubtotal) + (parseFloat(valorUnitario) * parseFloat(cantidadVenta));
        //alert(sumaSubtotal)

      //descuento
        var valorDesc = descuentoVenta.replace("$","");
        valorDesc = valorDesc.replace(",","");
        //alert(valorDesc);
        sumaDescuento = parseFloat(sumaDescuento) + parseFloat(valorDesc);
        //alert(sumaDescuento);
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
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea habilitar la forma de pago con cheque?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      //showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.renderer.removeClass(this.divPagoChque.nativeElement,"noneView");
      }
    });
  }

  abreFormaPagoValeDespFrom(event:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea habilitar la forma de pago con vales de despensa?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      //showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.renderer.removeClass(this.divPagoValeDespensa.nativeElement,"noneView");
      }
    });
  }

  btnDeletePagoCheque(event:any){
    let divIndex = $(event).parent("a").parent("div").parent("div");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este apartado para pago con cheques?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      //showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoCheque.splice(divIndex.index(),1);
        divIndex.remove();
        this. sumaFormasPago();
      }
    });
  }

  btnAddPagoCheque(event:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea habilitar otro apartado para pago con cheques?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      //showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoCheque.push(this.listFpagoCheque.length+1);
        console.log("this.listFpagoCheque "+this.listFpagoCheque);
      }
    });
  }

  btnDeletePagoValeDesp(event:any){
    let divIndex = $(event).parent("a").parent("div").parent("div");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este apartado para pago con cheques?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      //showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoCheque.splice(divIndex.index(),1);
        divIndex.remove();
        this.sumaFormasPago();
      }
    });
  }

  btnAddPagoValeDesp(event:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea habilitar otro apartado para pago con vales de despensa?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'si, agregar',
      //showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.listFpagoValeDesp.push(this.listFpagoValeDesp.length+1);
      }
    });
  }

  btnCierraPago(event:any){
    var header = $(event).parents("div.header");
    $(header).find(".btnAbrePago").removeClass("noneView");
    $(header).parent("div.divEfectivo").find("div.content").addClass("noneView");
    $(header).parent("div.divChqueNominativo").find("div.content").addClass("noneView");
    $(header).parent("div.diValeDespensa").find("div.content").addClass("noneView");
    $(header).parent("div.divCreditDebit").find("div.content").addClass("noneView");
    $(header).parent("div.divTransfer").find("div.content").addClass("noneView");
    $(header).parent("div.divMonElect").find("div.content").addClass("noneView");
    $(header).find(".btnCierraPago").addClass("noneView");
  }

  btnAbrePago(event:any){
    var header = $(event).parents("div.header");
    $(header).find(".btnCierraPago").removeClass("noneView");
    $(header).parent("div.divEfectivo").find("div.content").removeClass("noneView");
    $(header).parent("div.divChqueNominativo").find("div.content").removeClass("noneView");
    $(header).parent("div.diValeDespensa").find("div.content").removeClass("noneView");
    $(header).parent("div.divCreditDebit").find("div.content").removeClass("noneView");
    $(header).parent("div.divTransfer").find("div.content").removeClass("noneView");
    $(header).parent("div.divMonElect").find("div.content").removeClass("noneView");
    $(header).find(".btnAbrePago").addClass("noneView");
  }

  llenaPagoEfect(event:any){
    if (event.value != '' && this.validator.filtroCosto(event.value) == true) {
      this.arrayEfectVent[0] = event.value;

      this.arrayEfectVent[0] = numeral(this.arrayEfectVent[0]);
      this.arrayEfectVent[0] = (this.arrayEfectVent[0].format('$0,0.00'));

      console.log(this.arrayEfectVent);
      this.validator.correctoInput(event,"Monto a pagar "+this.arrayEfectVent[0]);
      this.sumaFormasPago();
    } else {
      this.validator.errorInput(event,"Monto a pagar invalido");
    }
  }

  //pressCant({ event }: { event: any; }): false | undefined{
  //  let clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
  //  if (!this.validator.filtroCosto(clave)) {
  //    event.preventDefault();
  //    return false;
  //  }
  //}

  validaDateCheque(event:any){
    let txtNumRefCheque = $(event).parent("div").parent("div.content").find("input.txtNumRefCheque");
    alert(event.value)
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
    if (event.value == '' || !this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.errorInput(event,"Banco invalido");
      $(txtTitularCheque).attr("disabled","disabled");
    } else {
      this.validator.correctoInput(event,"Banco");
      $(txtTitularCheque).removeAttr("disabled");
    }
  }

  validaTitularCheque(event:any){
    let txtMontoCheque = $(event).parent("div").parent("div.content").find("input.txtMontoCheque");
    if (event.value == '' || !this.validator.filtroAlfaNumerico(event.value) || event.value.length < 4) {
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
      //alert(divIndex.index());(keyup)="sumaFormasPago();"
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
      //alert(divIndex.index());
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

    //dinRecibido:any = $("#divFormPagoGnral").find("#pRecibido");
    //dinResta:any = $("#divFormPagoGnral").find("#pResta");
    //dinCambio:any = $("#divFormPagoGnral").find("#pCambio");
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
    //alert("valorTotalVenta "+valorTotalVenta+" "+totalPago)
    if (valorTotalVenta == '0.00' || totalPago == '' || totalPago == '0.00') {
      $("#total").removeClass("correctoTotal");
      $("#total").addClass("errorTotal");
      $(".headerResta").addClass("errorTotal");
      $(".headerCambio").addClass("errorTotal");
      this.renderer.setAttribute(this.btnVentaPreReg.nativeElement,"disabled","disabled");
    } else {
      if (valorTotalVenta == totalPago) {
        $("#total").removeClass("errorTotal");
        $("#total").addClass("correctoTotal");
        $(".headerResta").removeClass("errorTotal");
        $(".headerCambio").removeClass("errorTotal");
        this.todoPagoVenta();
      } else {
        if (totalPago > valorTotalVenta) {
          $("#total").removeClass("errorTotal");
          $("#total").addClass("correctoTotal");
          $(".headerResta").removeClass("errorTotal");
          $(".headerCambio").addClass("errorTotal");
          this.todoPagoVenta();
          sumaCambio = parseFloat(sumaCambio) + parseFloat(totalPago) - parseFloat(valorTotalVenta);
        }
        if (totalPago < valorTotalVenta) {
          $("#total").removeClass("correctoTotal");
          $("#total").addClass("errorTotal");
          $(".headerResta").addClass("errorTotal");
          $(".headerCambio").removeClass("errorTotal");
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

  //this.arrayDesgloseVenta
  //this.txtsubtotalVenta
  //this.txttotalDescuentoVenta
  //this.txtiva
  //this.txtisRetenido
  //this.txtivaRetenido
  //this.txtieps
  //this.txtotrosImpuFed
  //this.txtotrosImpuLocal
  //this.txttotal
  //this.datosCaja
  //this.datosCajaAlmacenDir

  saveVenta(){
    //this.txtFolioClientV
    //this.txtNombreClientV
    //this.txtRfcClientV

    this._ventServ.registraVenta(this.txtHiddenclienteToken,this.txtListaPrecV,this.txtMonedaClientV,
      this.txtTipoCambioClientV,this.arrayDesgloseVenta,this.datosCaja,this.datosCajaAlmacenDir,
      this.responsableEntrega,this.arrayFormaPago).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            Swal.fire({
              position:'center',
              icon: 'success',
              title: translate_response,
              showConfirmButton:false,
              timer: 3000
            })
          }
          if (response.status == 'error') {
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: translate_response,
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

}
