import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { ClasificacionService } from '../../../../servicios/ssic/clasificacion.service';
import { CatSatServService } from '../../../../servicios/ssic/cat-sat-serv.service';
import { UniMedServService } from '../../../../servicios/uni-med-serv.service';
import { ServiciosService } from '../../../../servicios/ssic/servicios.service';
import { servicioAngularModelo } from '../../../../modelos/servicioAngularModelo';
import { ProveedoresService } from '../../../../servicios/proveedores.service';
import { ServEncryptService } from '../../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { MonedasService } from '../../../../servicios/monedas.service';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'app-invent-serv-compras-alta',
  templateUrl: './invent-serv-compras-alta.component.html',
  standalone:false,
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
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
    '../../../../styles/landing.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/colores.css',
    '../../../../styles/explain.css',
    '../../../../styles/switches.css',
    '../../modulo_ssic_inventarios/inventarios.css',
    './invent-serv-compras-alta.component.css'
  ],
})
export class InventServComprasAltaComponent implements OnInit {
  public usuario: Usuarios;
  catalogoMonedasApi:any = [];

  public modelServ: servicioAngularModelo;
  arrayClasifServicios:any = [];
  catalogoUnidadesMedINVENT:any = [];
  buscarCatProv:any = [];
  arrayCatProv:any = [];
  public view_proveedores:boolean = false;
  arrayClaveProvServ:any = [];
  public validateServ:boolean = false;
  public progressBarRegistro:boolean = false;
  public vista_formulario:boolean = true;

  @ViewChild('btnAddLogotipo') btnAddLogotipo: ElementRef = {} as ElementRef;
  @ViewChild('h6Sat') h6Sat: ElementRef = {} as ElementRef;
  @ViewChild('catSATServHiddenProd') catSATServHiddenProd: ElementRef = {} as ElementRef;
  @ViewChild('catalogoSAT') catalogoSAT: ElementRef = {} as ElementRef;
  @ViewChild('buscaClaveSat') buscaClaveSat: ElementRef = {} as ElementRef;

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    public validator:ValidatorServService,
    public encryptor:ServEncryptService,
    public _catSat: CatSatServService,
    public _clasifServ: ClasificacionService,
    public _servicioServ:ServiciosService,
    public uni_med:UniMedServService,
    private translate:TranslateService,
    private _monedasServ: MonedasService,
    private relInterna:ComunicacionInternaService,
    public _provServ: ProveedoresService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.modelServ = new servicioAngularModelo('','','L1IzLzhPMTFRSmhMeDMvY1E3ZnhkZz09OjoxMjM0NTY3ODEyMzQ1Njc4','','','ZG5IOHVYOU13QjlqaW1McmwvZ0E5Zz09OjoxMjM0NTY3ODEyMzQ1Njc4','',[],0.00,'','','');
  }

  ngOnInit(): void {
    this.listaClasificacionServicios();
    this.monedasCatalogoApi();
    this.unidadMedidaCatalogoGeneral();
    this.proveedoresLista();
    this.buscarCatProv = ['folio','rfc_prov','nombre','encendido','tiene_clave'];
  }

  listaClasificacionServicios(){
    this._clasifServ.getGeneroClassifServ().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayClasifServicios = response.listClass;
          console.log(this.arrayClasifServicios);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedasCatalogoApi(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.catalogoMonedasApi = response.monedas;
          /*
            "number": 784,
            "code": "AED",
            "decimales": "2",
            "langEN": "United Arab Emirates dirham",
            "langIT": "Dirham degli Emirati Arabi Uniti",
            "symbol_decimal": "1583;46;1573",
            "symbol_hex": "062F;002E;0625"
          */
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  unidadMedidaCatalogoGeneral(){
    this.uni_med.inventUnidadesMedidaEnabledCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogoUnidadesMedINVENT = response.listaUMedida;
          console.log(this.catalogoUnidadesMedINVENT);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  proveedoresLista(){
    this.view_proveedores = false;
    this._provServ.catalogoProveedoresForProcesos().subscribe(
      response => {
        this.view_proveedores = true;
        if (response.status == 'success') {
          console.log(response.proveedores);
          this.arrayCatProv = response.proveedores;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyPressNumerico(objetoKeyPress:KeyboardEvent){
    this.validator.key_press_numbers_clave_sat(objetoKeyPress);
  }

  conceptoKeyup(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelServ.concepto = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.servicioValidate();
  }

  selectGeneroServ(event:any){
    console.log(event.value);
    this.modelServ.genero = event.value != '' ? event.value : '';
    event.value != '' ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
    this.servicioValidate();
  }

  //unidades de medida
    keyupUnidadMedidaSalidaApiServ(opcion:any){
      var selectedUnidadMedidaSAT = document.getElementById("selectedUnidadMedidaSAT");
      console.log(opcion);
      const umed = this.catalogoUnidadesMedINVENT.find((row:any) => row.nombre === opcion.nombre);
      const validacion = opcion.nombre != "" && this.validator.filtroAlfaNumerico(opcion.nombre) == true && typeof umed !== 'undefined'; 
      this.modelServ.unidad_medida_clave = validacion ? umed.nombre : "";
      validacion ? this.validator.correctoSelectBrowser(selectedUnidadMedidaSAT) : this.validator.errorSelectBrowser(selectedUnidadMedidaSAT);
    }

    keyupValidateCuentaContable(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value); 
      this.modelServ.cuenta_contable = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  //area sat
    keyupSat(event:any){
      const validacion = event.value != '' && this.validator.filtroNumericoSat(event.value) == true && (event.value.length == 7 || event.value.length == 8);
      this.modelServ.clave_sat = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.servicioValidate();
    }

  apagar_encender(event:any,token_cat_proveedores:any){
    const prov_row = this.arrayCatProv.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.encendido = event.checked;
    prov_row.tiene_clave = event.checked ? 'false' : null;
    prov_row.asigned_clave = event.checked ? '' : null;
    console.log(token_cat_proveedores);
  }

  decideHabilitaClave(event:any,token_cat_proveedores:any){
    const prov_row = this.arrayCatProv.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.tiene_clave = event.checked == true ? 'true' : 'false';
  }

  keyupProvServClave(event:any,token_cat_proveedores:any){
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    const prov_row = this.arrayCatProv.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.asigned_clave = validar ? event.value : '';
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(prov_row);
  }

  keypressProvServClave(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (this.validator.strFilter(clave) == false) {
      this.validator.deten(event);
    }
  }

  //registro
    servicioValidate(){
      console.log(this.modelServ);
      const validacion = this.modelServ.concepto != '' && this.validator.filtroAlfaNumerico(this.modelServ.concepto) == true && this.modelServ.genero != '' && this.modelServ.unidad_medida_clave != '';
      this.validateServ = validacion ? true : false;
    }

    registraServ(form:{reset:() => void;}):void{
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
          this.progressBarRegistro = true;
          this.arrayClaveProvServ = this.arrayCatProv.filter((row:any) => row.encendido == true).map((row:any) => ({token_cat_proveedores:row.token_cat_proveedores,encendido:row.encendido,tiene_clave:row.tiene_clave,clave:row.asigned_clave}));
          this.modelServ.proveedor = this.arrayClaveProvServ;
          console.log(this.modelServ.proveedor);
          this._servicioServ.registraServEgresos(
            this.modelServ.concepto,
            this.modelServ.clasificacion,
            this.modelServ.genero,
            this.modelServ.cuenta_contable,
            this.modelServ.clave_sat,
            this.modelServ.unidad_medida_clave,
            this.modelServ.proveedor).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.progressBarRegistro = false;
                form.reset();
                this.vista_formulario = false;
                setTimeout(() => {
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  });
                  this.vista_formulario = true;
                  this.validateServ = false;
                  this.proveedoresLista();
                  this.modelServ = new servicioAngularModelo('','','L1IzLzhPMTFRSmhMeDMvY1E3ZnhkZz09OjoxMjM0NTY3ODEyMzQ1Njc4','','','ZG5IOHVYOU13QjlqaW1McmwvZ0E5Zz09OjoxMjM0NTY3ODEyMzQ1Njc4','',[],0.00,'','','');
                  this.relInterna.mensajeInsertServCompras("servicio registrado");
                },1000);
              }
              if (response.status == 'error') {
                this.progressBarRegistro = false;
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
          );
        }
      });
    }
}
