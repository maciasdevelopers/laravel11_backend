import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import { cajaAngularModelo } from '../../../../../../modelos/cajaAngularModelo';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { InterfMonedas } from '../../../../../../interfaces/interf-monedas';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { DispositivosServService } from '../../../../../../servicios/ssic/dispositivos-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../../../../servicios/global_ssic';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';

@Component({
  selector: 'app-nueva-caja-finanzas',
  templateUrl: './tes_altacajas.component.html',
  standalone:false,
  styleUrls: [
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
    '../../../../../../styles/explain.css',
    '../../../finanzas.css',
  './tes_altacajas.component.css']
})
export class AltaCajasTesoreriaComponent implements OnInit {
  public caja:cajaAngularModelo;
  public usuario:Usuarios;
  arrayEstablecimientos:any = [];
  arrayListRespons:any = [];
  catalogoMonedasApi:any = [];
  public txtMonedaCaja:string;
  arrayTurnosCaja:any = [];
  arrayLlenaTurnosCaja:any = [];
  verFormAlta:boolean = true;

  @ViewChild('btnGuardarCaja') btnGuardarCaja: ElementRef = {} as ElementRef;

  constructor(
    private monedasServ:MonedasService,
    private renderer:Renderer2,
    private cuentaBan:CuentbancService,
    private bancos:BancosServService,
    private cajaServ:CajaServService,
    private dirServ:DireccionesService,
    private employServ:EmpleadosService,
    private monedero:MonederoElectService,
    private dispositivo:DispositivosServService,
    private validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private translate:TranslateService,
    private estabServ:EstablecimientosService,
    private encryptor:ServEncryptService) {
      this.caja = new cajaAngularModelo('','','','','','','',false,false,false,false,false,false,'');
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.txtMonedaCaja = 'bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4';
  }

  ngOnInit(): void {
    this.listarEstablecimientos();
    this.getListaMonedasAPI();
    this.listaResponsableAlmacen("---");
  }

  listarEstablecimientos(){
    this.estabServ.listaEstablecimientoscomplete().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayEstablecimientos = response.listaEstablecimientos;
          console.log(this.arrayEstablecimientos);
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  listaResponsableAlmacen(folio_establecimiento:any){
    if (folio_establecimiento != "---") {
      const estab = this.arrayEstablecimientos.find((row:any) => row.estab_folio === folio_establecimiento);
      this.employServ.listaResponsables(estab.token_establecimiento).subscribe(
        response => {
          console.log(response);
          if (response.status == 'success') {
            this.arrayListRespons = response.personal;
            //console.log(this.arrayListRespons);
          }
        },
        error =>{
          console.log(error);
        }
      ); 
    } else {
      this.employServ.catalogoGeneralTrabajadores().subscribe(
        response => {
          if (response.status == 'success') {
            this.arrayListRespons = response.empleados;
            console.log(this.arrayListRespons);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getListaMonedasAPI(){
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

  validaDescripcion(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.caja.descripcion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validaEstablecimiento(opcion:any){
    var selectedEstabLista = document.getElementById("selectedEstabLista");
    const estab = this.arrayEstablecimientos.find((row:any) => row.estab_folio === opcion.estab_folio);

    const validacion = opcion.estab_folio != '' && typeof estab !== 'undefined';
    this.caja.establecimiento_token = validacion ? estab.token_establecimiento : '';
    validacion ? this.validator.correctoInputRow(selectedEstabLista) : this.validator.errorInputRow(selectedEstabLista);
  }

  validaVendedor(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value); 
    this.caja.vendedor = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.listaResponsableAlmacen(estab.token_establecimiento);
  }

  validaMonedaCaja(opcion:any){
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogoMonedasApi.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    const validar = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) && typeof mnd !== 'undefined';
    this.caja.moneda = validar ? mnd.code : '';
    validar ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  validaCuentaContable(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4;
    this.caja.cuenta_contable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validaAreaServicioIngresos(event:any){
    this.caja.servegresos = event.checked ? true : false;
  }

  validaAreaServicioEgresos(event:any){
    this.caja.servingresos = event.checked ? true : false;
  }

  validaAreaServicioPropias(event:any){
    this.caja.servpropias = event.checked ? true : false;
  }

//Configuración para ventas
  validaVentasCaptCliente(event:any){
    this.caja.capt_cliente = event.checked ? true : false;
  }
  
  validaVentasCaptPrecioXArticulo(event:any){
    this.caja.capt_precio_x_articulo = event.checked ? true : false;
  }
  
  validaVentasCaptPrimeroCantidad(event:any){
    this.caja.capt_primero_cantidad = event.checked ? true : false;
  }

  get validaFormCaja():boolean{
    const validacionDescripcion = this.caja.descripcion != '' && this.validator.filtroAlfaNumerico(this.caja.descripcion) == true;
    const validacionEstablecimiento = this.caja.establecimiento_token != '';
    const validacionVendedor = this.caja.vendedor != '';
    const validacionvalidaMonedaCaja = this.caja.moneda != '';
    const validacionvalidaMonedaCuentaContable = this.caja.cuenta_contable != '';

    return validacionDescripcion && validacionEstablecimiento && validacionvalidaMonedaCaja && validacionvalidaMonedaCuentaContable;
  }

  registraDataCaja(form:{reset:() => void;}):void{
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
        this.verFormAlta = false;
        this.cajaServ.registraCaja(this.caja).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.verFormAlta = true;
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
              form.reset();
              this.caja = new cajaAngularModelo('','','','','','','',false,false,false,false,false,false,'');
              this.relInterna.mensajeCAJAInsert("registro aprobado");
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
    });
  }
}
