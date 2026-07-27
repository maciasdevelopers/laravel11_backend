import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ClasificacionService } from '../../../../../../servicios/ssic/clasificacion.service';
import { CatSatServService } from '../../../../../../servicios/ssic/cat-sat-serv.service';
import { UniMedServService } from '../../../../../../servicios/uni-med-serv.service';
import { ServiciosService } from '../../../../../../servicios/ssic/servicios.service';
import { servicioAngularModelo } from '../../../../../../modelos/servicioAngularModelo';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { MonedasService } from '../../../../../../servicios/monedas.service';

@Component({
  selector: 'app-inventarios-servicios-ventas-registro',
  templateUrl: './invent-serv-ventas-registro.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
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
    '../../../../../../styles/loading.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../inventarios.css',
    './invent-serv-ventas-registro.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class InventServVentasRegistroComponent implements OnInit {
  public usuario: Usuarios;
  catalogoMonedasApi:any = [];

  public modelServ: servicioAngularModelo;
  arrayClasifServicios:any = [];
  catalogoUnidadesMedidaAPI:any = [];
  catalogoUnidadesMedidaSAT:any = [];

  arrayCatProv:any = [];
  arrayClaveProvServ:any = [];

  public validateServ:boolean;

  public progressBarRegistro:boolean;

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
    public _provServ: ProveedoresService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.modelServ = new servicioAngularModelo('','','L1IzLzhPMTFRSmhMeDMvY1E3ZnhkZz09OjoxMjM0NTY3ODEyMzQ1Njc4','','','ZG5IOHVYOU13QjlqaW1McmwvZ0E5Zz09OjoxMjM0NTY3ODEyMzQ1Njc4','',[],0.00,'','','');
    this.validateServ = false;
    this.progressBarRegistro = false;
  }

  ngOnInit(): void {
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

    this.monedasCatalogoApi();
    this.unidadMedidaServiciosAPI()
    this.unidadMedidaServiciosSAT();

    this._provServ.catalogoProveedoresForProcesos().subscribe(
      response => {
          if (response.status == 'success') {
            console.log(response);
            this.arrayCatProv = response.proveedores;
            for (let i = 0; i < this.arrayCatProv.length; i++) {
              const provlist = this.arrayCatProv[i];
              this.arrayClaveProvServ.push({
                "token_cat_proveedores":provlist['token_cat_proveedores'],
                "encendido":provlist['encendido'],
                "tiene_clave":"",
                "clave":""
              })
            }
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

  unidadMedidaServiciosAPI(){
    this.uni_med.inventUnidadesMedidaCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogoUnidadesMedidaAPI = response.unidades_medida;
          console.log(this.catalogoUnidadesMedidaAPI);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  unidadMedidaServiciosSAT(){
    this.uni_med.inventUnidadesMedidaCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogoUnidadesMedidaSAT = response.listMedidas;
          console.log(this.catalogoUnidadesMedidaSAT);
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
    if (event.value != '' && this.validator.filtroAlfaNumerico(event.value)) {
      this.modelServ.concepto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.modelServ.concepto = '';
      this.validator.errorInputRow(event);
    }
  }
  
  keyupPrecioAplicableServ(event:any){
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      this.modelServ.precio_aplicable = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.modelServ.precio_aplicable = 0;
      this.validator.errorInputRow(event);
    }
  }

  keyupValidateMoneda(event:any){
    if(event.value != "" && this.validator.filtroAlfaNumerico(event.value)){
      for (let i = 0; i < this.catalogoMonedasApi.length; i++) {
        const money = this.catalogoMonedasApi[i];
        if (money['langEN'] == event.value) {
          this.validator.correctoInputRow(event);
          console.log(money["code"]);
          this.modelServ.moneda_codigo = money["code"];
          return;
        } else {
          this.validator.errorInputRow(event);
          this.modelServ.moneda_codigo = "";
        }
      }
    } else {
      this.validator.errorInputRow(event);
      this.modelServ.moneda_codigo = "";
    }
  }

  keyupUnidadMedidaSalidaApiServ(event:any){// creando una nueva funcion, con parametros (objeto input linea 85 html)
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) { // aqui estoy preguntando al sistema si el valor del objeto input no esta vacio y si mi input cumple con los caracteres q permite el filtro alfanumerico
      for (let index = 0; index < this.catalogoUnidadesMedidaAPI.length; index++) {// aqui estoy indicando el listado de mi arreglo de catumedida en cualquier pocision iniciando desde 0
        const row = this.catalogoUnidadesMedidaAPI[index];// se crea una constante que adquiere el valor de mi arreglo en la posicion index se acomodara dentro de cualquier espacio mientras este en mi arreglo
        if (row["nombre"] == event.value) { // condicionamos al sistema si el valor del input esta dentro de los valores del arreglo 
          // cuando se cumpla la condicion anterior
          this.validator.correctoInputRow(event);// cuando se cumpla la condicion anterior mi input se declarara correcto
          this.modelServ.unidad_medida_clave = row["nombre"];// se guarda el token de mi undad de medido en la variable del modelo de productos 
          return;// detiene la ejecucion del for ya que se encontro un token de unidad de medida que corresponde al que le estyo enviando por parametros 
        } else { // si no se cumple mi condicion 
          // este es el incorrecto de mi unidad de salida
          this.validator.errorInputRow(event);// esto indica si el valor de mi input no esta registrado dentro de mi arreglo en la posicion index se declara como incorrecto 
          this.modelServ.unidad_medida_clave = "";// estamos volando el valor de la variable unidad de medida ya que ocurrio un error en la validacion  
        }
      }
    } else { // que no se cumplieron con las condiciones de la linea 389
      this.modelServ.unidad_medida_clave = "";
      this.validator.errorInputRow(event);
    }
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
        this._servicioServ.InventariosCatalogosMostradorCreateServicio(
          this.modelServ.concepto,
          this.modelServ.precio_aplicable,
          this.modelServ.unidad_medida_clave,
          this.modelServ.moneda_codigo,
          this.modelServ.impuestos).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.progressBarRegistro = false;
              form.reset();
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              setTimeout(function(){
                window.location.reload();
              },3000);
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
        )
      }
    });
  }
}
