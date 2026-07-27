import { Component, OnInit, ViewChild } from '@angular/core';
import { deudoresModelo } from '../../../../../../modelos/deudoresModelo';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DeudoresService } from '../../../../../../servicios/deudores.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import emailjs from '@emailjs/browser';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { RegimenFiscalService } from '../../../../../../servicios/regimen-fiscal.service';

@Component({
  selector: 'app-interno-finanzas-catalogos-deudoresregistro',
  standalone: false,
  
  templateUrl: './deudores-registro.component.html',
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
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/telefonos.css',
    '../../../../../../styles/explain.css',
    '../../../finanzas.css',
    './deudores-registro.component.css'
  ],
})
export class DeudoresRegistroComponent implements OnInit{
  public deudorModelo: deudoresModelo;

  listaRelationsNombres:any = [];
  listaRelationsTrab:any = [];
  listaRelationsProv:any = [];
  listaRelationsAcr:any = [];
  
  personal_filtrado:any = [];
  selectedEmpleado:any;
  AllRegFisArray:any = [];
  PfAllRegFisArray:any = [];
  PmAllRegFisArray:any = [];
  public acree_reg_fiscal:string = "";

  public rfcGenericoPF:string = "xaxx010101000";
  public rfcGenericoPM:string = "xax010101000";
  public rfcGenericoExt:string = "xexx010101000";
  @ViewChild('formRegDeudores') formRegDeudores!: NgForm;

  constructor(
    private translate:TranslateService,
    public validator:ValidatorServService,
    public deudorServ:DeudoresService,
    private _persServ:EmpleadosService,
    private encryptor:ServEncryptService,
    private relInterna:ComunicacionInternaService,
    private _regimen:RegimenFiscalService,
    private fb: FormBuilder
  ){
    this.deudorModelo = new deudoresModelo("","","","","","","",false,"","","","","");
  }

  ngOnInit(): void {
    this.listando_personal();
    this.getRegimenesFiscales();
  }

  getRegimenesFiscales(){
    this._regimen.getAllRegimenFiscal().subscribe((data) => {
      this.AllRegFisArray = data.status == 'success' ? data.listRegFisc : [];
      data.status == 'success' ? console.log(this.AllRegFisArray) : null;
    });
    this._regimen.getPfRegimenFiscal().subscribe((data) => {
      this.PfAllRegFisArray = data.status == 'success' ? data.listRegFisc : [];
      data.status == 'success' ? console.log(this.PfAllRegFisArray) : null;
    });
    this._regimen.getPmRegimenFiscal().subscribe((data) => {
      this.PmAllRegFisArray = data.status == 'success' ? data.listRegFisc : [];
      data.status == 'success' ? console.log(this.PmAllRegFisArray) : null;
    });
  }

  listando_personal(){
    this.deudorServ.deudoresNombresRelacionados().subscribe(
      response => {
        this.listaRelationsNombres = response.status == 'success' ? response.nombres_relacionados : [];
        this.listaRelationsTrab = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "TRAB");
        this.listaRelationsProv = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "PROV");
        this.listaRelationsAcr = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "ACREE");
        response.status == 'success' ? console.log(this.listaRelationsNombres) : null;
      },
      error => {
        console.log(error);
      }
    );
  }

  letreroRFCNacional():string{
    var letrero = "";
    if (this.deudorModelo.tipoDeudor == 'extranjero' || this.deudorModelo.subtipoDeudor == '') {
      letrero = "Escriba su rfc con Homoclave";
    } else {
      switch (this.deudorModelo.subtipoDeudor) {
        case 'provFisica':
          letrero = "Escriba su rfc con Homoclave (13 caracteres)";
          break;
        case 'provMoral':
          letrero = "Escriba su rfc con Homoclave (12 caracteres)";
          break;
        default:
          letrero = "";
          break;
      }
    }
    return letrero;
  }

  tipoSeleccionado(tipo: string) {
    this.deudorModelo.tipoDeudor = tipo;
    this.deudorModelo.subtipoDeudor = '';
  }

  get esVacio():Boolean {
    return this.deudorModelo.tipoDeudor === '';
  }

  get esNacional():Boolean {
    return this.deudorModelo.tipoDeudor === 'nacional';
  }

  get esExtranjero():Boolean {
    return this.deudorModelo.tipoDeudor === 'extranjero';
  }

  limitarLongitudRfc(event: any, max: number): void {
    const input = event.target;
    if (input.value.length > max) {
      input.value = input.value.slice(0, max);
    }
  }

  validaDeudorRfc(event:any){
    const validaSubtipo = this.deudorModelo.subtipoDeudor;
    const validacion = event.value != '' && ((validaSubtipo === 'deudorFisica' && this.validator.filtroRfcPersFisica(event.value)) || validaSubtipo === 'deudorMoral' && this.validator.filtroRfcPersMoral(event.value));
    this.deudorModelo.rfc = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupverif_TaxIdDeudor(event:any){
    const validacion = event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value);
    this.deudorModelo.taxID = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNombreDeudor(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4;
    this.deudorModelo.nombre = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNombreComercialDeudor(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4;
    this.deudorModelo.nombre_comercial = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupMailDeudor(event:any){
    const validacion = event.value != "" && this.validator.filtroCorreo(event.value);
    this.deudorModelo.correo_electronico = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCuentaContableDeudor(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4;
    this.deudorModelo.cuenta_contable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectHabilitaReembolsos(event:any){
    this.deudorModelo.habilita_reembolsos = event.checked ? true : false;
  }

  changeRegimenFiscal(opcion:any){
    var selectedFiscalRegimen = document.getElementById("selectedFiscalRegimen");
    const regfis = this.AllRegFisArray.find((row:any) => row.token_regimen_fiscal === opcion.token_regimen_fiscal);
    const validacion = opcion.token_regimen_fiscal != '' && typeof regfis !== 'undefined';
    this.deudorModelo.regimen_fiscal = validacion ? regfis.token_regimen_fiscal : '';
    validacion ? this.validator.correctoInputRow(selectedFiscalRegimen) : this.validator.errorInputRow(selectedFiscalRegimen);
  }
  
  decideVinculaTrab(event:any){
    if (event.checked) {
      $("#decideinfotrabajador").removeClass("noneView");
    } else {
      $("#decideinfotrabajador").addClass("noneView");
    }
  }

  decideVinculaProv(event:any){
    if (event.checked) {
      $("#decideinfoproveedor").removeClass("noneView");
    } else {
      $("#decideinfoproveedor").addClass("noneView");
    }
  }

  decideocupaAcreedor(event:any){
    if (event.checked) {
      $("#decideinfoacreedor").removeClass("noneView");
    } else {
      $("#decideinfoacreedor").addClass("noneView");
    }
  }

  vincula_select_trabajador(people_relacionado_token:any) {
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsTrab.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined';
    this.deudorModelo.trabajador_vinculado = validacion ? names.people_relacionado_token : '';
    if (validacion) {
      this.listaRelationsTrab.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  vincula_select_proveedor(people_relacionado_token:any) {
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsProv.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined';
    this.deudorModelo.proveedor_vinculado = validacion ? names.people_relacionado_token : '';
    if (validacion) {
      this.listaRelationsProv.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  vincula_select_acreedor(people_relacionado_token:any) {
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsAcr.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined';
    this.deudorModelo.acreedor_vinculado = validacion ? names.people_relacionado_token : '';
    if (validacion) {
      this.listaRelationsAcr.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  get validaDeudorRegistro():Boolean{
    const tipoDeudor = this.deudorModelo.tipoDeudor;
    const subtipoDeudor = this.deudorModelo.subtipoDeudor;
    const rfc = this.deudorModelo.rfc;
    const taxID = this.deudorModelo.taxID;
    const nombre = this.deudorModelo.nombre;
    const nombre_comercial = this.deudorModelo.nombre_comercial;
    const trabajador_vinculado = this.deudorModelo.trabajador_vinculado;
    const proveedor_vinculado = this.deudorModelo.proveedor_vinculado;
    const acreedor_vinculado = this.deudorModelo.acreedor_vinculado;
    const correo_electronico = this.deudorModelo.correo_electronico;

    const valida_tipoDeudor = tipoDeudor != "";
    const valida_subtipoDeudor = subtipoDeudor != "";
    const valida_rfc = rfc != '' && ((subtipoDeudor === 'deudorFisica' && this.validator.filtroRfcPersFisica(rfc)) || subtipoDeudor === 'deudorMoral' && this.validator.filtroRfcPersMoral(rfc));
    const valida_taxID = taxID != "" && taxID.length >= 9 && taxID.length <= 40 && this.validator.strFilEmp(taxID);
    const valida_nombre = nombre != "" && this.validator.filtroAlfaNumerico(nombre) && nombre.length > 4;
    const valida_nombre_comercial = nombre_comercial != "" && this.validator.filtroAlfaNumerico(nombre_comercial) && nombre_comercial.length > 4;
    const valida_empleado_vinculado = trabajador_vinculado != '' || proveedor_vinculado != '' || acreedor_vinculado != '';
    const valida_correo_electronico = correo_electronico != "" && this.validator.filtroCorreo(correo_electronico);
    return valida_tipoDeudor && valida_subtipoDeudor && valida_nombre && valida_nombre_comercial;
  }

  limpiaTodo(){
    this.deudorModelo = new deudoresModelo("","","","","","","",false,"","","","","");
    this.validator.limpiaInputRow(document.getElementById("verif_rfcDeudor")); 
    if (this.esExtranjero) {
      this.validator.limpiaInputRow(document.getElementById("verif_taxIDDeudor")); 
    }
    this.personal_filtrado = [];
    this.validator.limpiaInputRow(document.getElementById("verifNameDeudor")); 
    this.validator.limpiaInputRow(document.getElementById("verifNameComercialDeudor")); 
    this.validator.limpiaInputRow(document.getElementById("verifNameEmailDeudor")); 
    this.validator.limpiaInputRow(document.getElementById("verifccontableDeudor"));
  }

  registrarDeudor(form:NgForm):void{
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const nombre = this.deudorModelo.nombre;
        const correo_electronico = this.deudorModelo.correo_electronico;

        var possible_letter = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        var possible_char = '.,#$%&/()=';
        var stringDataCode = correo_electronico+nombre+correo_electronico+"code_access";
        var primerDataCode = this.encryptor.santoEncryptCode(stringDataCode).substring(0, 7);
        for (let a = 0; a < 1; a++){
          primerDataCode = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length))+primerDataCode;
        }
        var segundaDataCode = this.encryptor.santoEncryptCode(primerDataCode);

        var stringDataPass = correo_electronico+Math.random()+nombre+"password"+correo_electronico;
        var primerDataPass = this.encryptor.santoEncryptPass(stringDataPass).substring(0, 8);
        for (let i = 0; i < 2; i++){
          primerDataPass = primerDataPass+possible_char.charAt(Math.floor(Math.random() * possible_char.length));
        }
        for (let j = 0; j < 1; j++){
          primerDataPass = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length))+primerDataPass;
        }
        var segundaDataPass = this.encryptor.santoEncryptPass(primerDataPass);

        this.deudorServ.registraDeudor(this.deudorModelo,segundaDataCode,segundaDataPass).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000,
                customClass: {
                  popup: 'my-swal-zindex'
                }
              });

              if (correo_electronico != "") {
                var contenidoHtml = '<html><head><title>titulo de la página</title></head>'+
                '<body><div style="background-color: #d3d3d3;display:flex;justify-content:center">'+
                    '<h4 style="width: 100%;font-size: 35px;font-weight: bold;"></h4>'+
                    '<h6 style="width: 100%;font-weight: 600;"></h6><br>'+
                    '<p style="width: 100%;margin: 0;padding: 20px;"></p>'+
                    '<p style="width: 100%;margin: 0;padding-left: 20px;">Código de acceso: <strong>'+primerDataCode+'</strong></p>'+
                    '<p style="width: 100%;margin: 0;padding-left: 20px;">Contraseña: <strong>'+primerDataPass+'</strong></p>'+
                  '</div></body></html>';
                const parametros = {
                  from_name: 'SOPORTE SOS',
                  from_email:'soporte@sos-mexico.com.mx',
                  to_name:nombre+' <'+correo_electronico+'>',
                  to_email:correo_electronico,
                  access_code:primerDataCode,
                  pass_code:primerDataPass,
                  link:'https://sos-mexico.com.mx/clientes'
                };
  
                //emailjs.send(user['email'],contenidoHtml,parametros,'')
                emailjs.send('service_dejznyj','template_v1nh0fl',parametros,'H1Nl6vkZbsBm1MtNF')
                .then((response) => {
                  console.log("success",response.status,response.text);
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: response.text,
                    showConfirmButton:false,
                    timer: 3000
                  });
                  setTimeout(function(){
                    window.location.reload();
                  },3000);
                },(err) => {
                  console.log("falla",err);
                  Swal.fire({
                    position:'top-end',
                    icon: 'warning',
                    title: "falla "+err,
                    showConfirmButton:false,
                    timer: 3000
                  })
                }); 
              }
              form.resetForm();
              this.formRegDeudores.resetForm();
              this.limpiaTodo();
              this.relInterna.mensajeDeudorInsert("nuevo deudor registrado");
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000,
                customClass: {
                  popup: 'my-swal-zindex'
                }
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    });
  }
}
