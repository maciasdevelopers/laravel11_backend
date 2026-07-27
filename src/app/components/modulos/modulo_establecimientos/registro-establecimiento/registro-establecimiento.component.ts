import { FormBuilder, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { PaisService } from '../../../../servicios/ssic/pais.service';
import { DireccionesService } from '../../../../servicios/ssic/direcciones.service';
import { ServEncryptService } from '../../../../servicios/ssic/serv-encrypt.service';
import { EmpleadosService } from '../../../../servicios/ssic/empleados.service'; 
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import numeral from 'numeral';
import { QRCodeComponent } from 'angularx-qrcode';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { establecimientoModelo } from '../../../../modelos/establecimientoModelo';
import { EstablecimientosService } from '../../../../servicios/establecimientos';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-registro-establecimiento',
  standalone: false,
  
  templateUrl: './registro-establecimiento.component.html',
  styleUrls: [
    '../../../../styles/listas_ps.css',
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
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/dirpostales.css',
    '../../../../styles/switches.css',
    //'../inventarios.css',
    './registro-establecimiento.component.css'
  ],
})

export class RegistroEstablecimientoComponent implements OnInit {
  public usuario: Usuarios;
  tipos_establecimiento:any = [];
  secciones_de_trabajo:any = [];
  listaEmpleados:any = [];
  separateDialCode = false;
  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  phoneForm: FormGroup;
  public estabModel:establecimientoModelo;
  paisesLista:any = [];
  dipomex_cod_postal_colonias:any = [];
  viewFormulario:boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private dirServ: DireccionesService,
    private translate:TranslateService,
    private _pais: PaisService,
    private _personal: EmpleadosService,
    private estabServ:EstablecimientosService,
    private relInterna:ComunicacionInternaService,
    private fb: FormBuilder
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.estabModel = new establecimientoModelo("","","","",false,false,false,false,"","","","","","","","","",null,null);
    this.phoneForm = this.fb.group({
      telefono: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.catalogoEmpleados();
    this.listar_paises();
    this.listar_establecimientos_tipo();
    this.listar_secciones_de_trabajo();
  }

  catalogoEmpleados(){
    this._personal.catalogoGeneralTrabajadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaEmpleados = response.empleados;
          console.log(this.listaEmpleados);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listar_paises(){
    this._pais.getApiPaisCatalogo().subscribe(
      response => {
        this.paisesLista = response.status == 'success' ? response.paises : [];
        console.log(this.paisesLista)
      },
      error => {
        console.log(error);
      }
    );
  }

  listar_establecimientos_tipo(){
    this.tipos_establecimiento = [
      {data_db:'matriz', tipo:'Matriz'},
      {data_db:'sucursal', tipo:'Sucursal'},
      {data_db:'puntoVenta', tipo:'Puntos de Venta'},
      {data_db:'Filial', tipo:'Filiales'},
      {data_db:'Franqui', tipo:'Franquicias'},
      {data_db:'Connet', tipo:'Conecciones'},
    ];
  }

  listar_secciones_de_trabajo(){
    this.secciones_de_trabajo = [
      {clave:'aplicaIngresos', name:'Ingresos'},
      {clave:'aplicaEgresos', name:'Egresos'},
      {clave:'aplicaProcesosInternos', name:'Procesos internos'},
    ];
  }

//registro
  bindPressAlpha(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (this.validator.filtroAlfaNumerico(clave) == false) {
      this.validator.deten(event);
    }
  }

  keyupfunctiontxtAlias(event:any){
    const validar = event.value != "" && this.validator.filtroAlfaNumerico(event.value); 
    this.estabModel.alias = validar ? event.value : '';
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changefunctiontxtTipo(tipo:any){
    console.log(tipo)
    var estabTipos = document.getElementById("estabTipos");
    let tpEstab = this.tipos_establecimiento.find((row:any) => tipo.tipo != '' && row.tipo === tipo.tipo);
    const validacion = tipo.tipo != "" && this.validator.filtroAlfaNumerico(tipo.tipo) && typeof tpEstab !== 'undefined';
    this.estabModel.tipo = validacion ? tipo.data_db : '';
    validacion ? this.validator.correctoSelectBrowser(estabTipos) : this.validator.errorSelectBrowser(estabTipos);
  }

  keyupfunctiontxtDescripcion(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.estabModel.descripcion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupfunctiontxtEncargado(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    const employ = this.listaEmpleados.find((row:any) => row.nombre_completo === event.value);
    this.estabModel.encargado = validacion && typeof employ !== 'undefined' ? employ.token_empleado_vhum : '';
    validacion && typeof employ !== 'undefined' ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  functionAplicaAlmacen(event:any){
    this.estabModel.aplica_almacen = event.checked ? true : false;
  }
  
  functionAplicaMultiple(aplican: any) {
    var estabSeccionTrabajo = document.getElementById("estabSeccionTrabajo");
    const values = aplican.map((item: any) => item.clave);
    const validacion = aplican.length > 0;
    this.estabModel.aplica_ingresos = validacion ? values.includes('aplicaIngresos') : false;
    this.estabModel.aplica_egresos = validacion ? values.includes('aplicaEgresos') : false;
    this.estabModel.aplica_procesos_internos = validacion ? values.includes('aplicaProcesosInternos') : false;
    validacion ? this.validator.correctoSelectBrowser(estabSeccionTrabajo) : this.validator.errorSelectBrowser(estabSeccionTrabajo);
  }

  changePais(pais:any){
    console.log(event)
    console.log(pais.langES)
    var estabSeccionTrabajo = document.getElementById("estabSeccionTrabajo");
    const registro = this.paisesLista.find((row:any) => row.langES === pais.langES);
    const validacion = pais.langES != "" && this.validator.filtroAlfaNumerico(pais.langES);
    this.estabModel.ubicacion_pais = validacion ? registro.alpha3 : '';
    //this.estabModel.ext_direccion_pais = validacion ? registro.alpha3 : '';
    validacion ? this.validator.correctoSelectBrowser(estabSeccionTrabajo) : this.validator.errorSelectBrowser(estabSeccionTrabajo);
  }

  seleccionTipoPais(tipo:any){
    const validacion = tipo != "" && this.validator.filtroAlfaNumerico(tipo) == true;
    this.estabModel.ubicacion_pais = validacion ? tipo : '';
  }

  //diraccion nacional
  buscaCodPostalDipomex(event:any){
    if (event.value != "" && event.value.length == 5) {
      this.validator.correctoInputRow(event);
      this.dipomex_cod_postal_colonias.length = 0;
      this.estabModel.dipomex_cod_postal_cp = "";
      this.estabModel.dipomex_cod_postal_estado = "";
      this.estabModel.dipomex_cod_postal_municipio = "";
      this.estabModel.dipomex_cod_postal_colonia_vinculada = "";
      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.estabModel.dipomex_cod_postal_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
            this.estabModel.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.estabModel.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
            this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
            if (response.cod_postal["colonias"].length == 1) {
              this.estabModel.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
            }
          } else {
            Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
            if (response.message == "postal_empty") {
              this.estabModel.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
              this.estabModel.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
              this.estabModel.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
            }
          }
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.validator.errorInputRow(event)
    }
  }

  seleccionaColoniaCPDipomex(colonia_name:any){
    const find_colonia = this.dipomex_cod_postal_colonias.find((row:any) => row === colonia_name);
    this.estabModel.dipomex_cod_postal_colonia_vinculada = colonia_name != "" && typeof find_colonia !== 'undefined' ? find_colonia : '';
  }

  //diraccion extranjero
    keyupfunctionEstablecimExtCompleto(event:any) {
      const validacion = event.value != "" && this.validator.filtroDomNum(event.value) == true;
      this.estabModel.ext_direccion_completa = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    bindPressDireccEstabExt(event:any){
      var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
      if (this.validator.filtroDom(clave) == false) {
        this.validator.deten(event);
      }
    }

  probarTextPhone(){
    if (this.phoneForm.valid) {
      console.log(this.phoneForm);
      //const phone = this.phoneForm.get('telefono')?.value;
      console.log(this.phoneForm.value.telefono);
      const phone = this.phoneForm.value.telefono;
      if (phone) {
        console.log('Número internacional:', phone.internationalNumber);
        console.log('Número nacional:', phone.nationalNumber);
        console.log('Código de país:', phone.countryCode);
        console.log('Dial code:', phone.dialCode);
      }
    }
  }

  telefonoKeyupNumeroCont_reg(event:any){
    var estabTelefonos = document.getElementById("estabTelefonos");
    const phone = this.phoneForm.value.telefono;
    const validacion =  this.phoneForm.valid && phone.length >= 5 && this.validator.filtroPhone(phone);
    this.estabModel.phoneAll = validacion ? phone : '';
    validacion ? this.validator.correctoTelefonos(estabTelefonos) : this.validator.errorTelefonos(estabTelefonos);
  }

  keyupfunctionCuentaContable(event:any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.estabModel.cuenta_contable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validateRegistro():boolean {
    const validacion_alias = this.estabModel.alias != "" && this.validator.filtroAlfaNumerico(this.estabModel.alias) == true;
    const validacion_tipo  = this.estabModel.tipo != "" && this.validator.filtroAlfaNumerico(this.estabModel.tipo) == true;
    const validacion_descripcion = this.estabModel.descripcion != "" && this.validator.filtroAlfaNumerico(this.estabModel.descripcion) == true;
    //const valicacion_encargado = this.estabModel.encargado != "";
    const valicacion_aplica_i_e_pi = this.estabModel.aplica_ingresos || this.estabModel.aplica_egresos || this.estabModel.aplica_procesos_internos;
    const validacion_ubicacion_pais = this.estabModel.ubicacion_pais != "" && this.validator.filtroAlfaNumerico(this.estabModel.ubicacion_pais) == true;
    const validacion_ubicacion_mx = this.estabModel.ubicacion_pais == "MEX" && this.estabModel.dipomex_cod_postal_cp != "" && this.estabModel.dipomex_cod_postal_estado != "" && this.estabModel.dipomex_cod_postal_municipio != "" && this.estabModel.dipomex_cod_postal_colonia_vinculada != "";
    const validacion_ubicacion_ext = this.estabModel.ubicacion_pais != "MEX" && this.estabModel.ext_direccion_completa != "" && this.validator.filtroDom(this.estabModel.ext_direccion_completa);
    const validacion_telefonos = this.estabModel.phoneAll != "";
    const validacion_cuenta_contable = this.estabModel.cuenta_contable != "";
    return validacion_alias && validacion_tipo && validacion_descripcion && valicacion_aplica_i_e_pi && validacion_ubicacion_pais && (validacion_ubicacion_mx || validacion_ubicacion_ext) && validacion_telefonos;// && validacion_cuenta_contable;
  }

  registrarEstablecimiento(form:{reset:() => void;}){
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
        this.viewFormulario = false;
        //this.estabModel.descripcion
        this.estabServ.newEstablecimiento(this.estabModel).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(() => {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
                //this.recargaEstablecimientos();
              },3000);
              form.reset();
              this.viewFormulario = true;
              this.estabModel = new establecimientoModelo("","","","",false,false,false,false,"","","","","","","","","",null,null);
              this.relInterna.mensajeInsertEstablecimiento("establecimiento_registrado");
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
        );
      }
    })
  }
}
