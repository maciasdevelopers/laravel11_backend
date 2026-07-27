import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { EmpresasServService } from '../../../../../servicios/ssic/empresas-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { PaisService } from '../../../../../servicios/ssic/pais.service';
import { RegimenFiscalService } from '../../../../../servicios/regimen-fiscal.service';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';
import Swal from 'sweetalert2';
import { InterfPais } from '../../../../../interfaces/interf-pais';
import { NgForm } from '@angular/forms';
import { empRfcTipoModelo } from '../../../../../modelos/empRfcTipoModelo';

@Component({
  selector: 'app_teci_registro_empresas',
  standalone: false,
  templateUrl: './empresas-registro.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/telefonos.css',
    '../../tec_info.css',
    './empresas-registro.css'
  ],
})
export class EmpresasRegistro implements OnInit{
  public empModelo: empRfcTipoModelo;
  lista_paises:any = [];
  AllRegFisArray:any = [];
  PfAllRegFisArray:any = [];
  PmAllRegFisArray:any = [];
  public validateFoundEmp:boolean = false;
  public v_clasificacion_emp:string = "";
  public v_subclasificacion_emp:string = "";
  public validatePersonales:boolean = false;
  public validateUbicacion:boolean = false;

  //datos generales
  public razon_social:string = "";
  public abrev:string = "";
  public comercial_nombre:string = "";
  public curp:string = "";
  public sitio_web:string = "";
  public paistoken:string = "";
  public tknRegimenFiscal:string = "";

  //rfcs
  public emp_rfc_generico:string = "";
  public emp_rfc = "";
  public emp_id_tax = "";
  public emp_name_razon_social = "";
  public rfcGenericoPF:string = "xaxx010101000";
  public rfcGenericoPM:string = "xax010101000";
  public rfcGenericoExt:string = "xexx010101000";

  //ubicacion
  //public cod_postal:string = "";
  ////dipomex
  //public dipomex_cod_postal_estado:string = "---";
  //public dipomex_cod_postal_municipio:string = "---";
  //public dipomex_cod_postal_cp:string = "---";
  //public dipomex_cod_postal_colonias:any = [];
  //public dipomex_cod_postal_colonia_vinculada:string = "";
  //public new_cod_postal_estado_name:string = "---";
  //public new_cod_postal_estado_abrev:string = "---";
  //public new_cod_postal_municipio:string = "---";
  //public new_cod_postal_cp:string = "---";
  //public new_cod_postal_colonia_vinculada:string = "";
  //public validaCPNew:boolean = false;
  //listnewdireccionNac:any = [];
  //options = {};

  public validateRfcExtBool:boolean = true;
  public validateIdTaxBool:boolean = true;

  @ViewChild('frmAddEmp') formAddEmp!: NgForm;
  public decisionEditNombre:boolean = false;
  constructor(
    private trab_serv:EmpleadosService,
    public validator:ValidatorServService,
    public emp_serv:EmpresasServService,
    private translate:TranslateService,
    public _pais:PaisService,
    private _regimen:RegimenFiscalService
    ) { 
      this.empModelo = new empRfcTipoModelo("","","","","","","","","");
    }

  ngOnInit(): void {
   this.listando_paises();

    this._regimen.getAllRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.AllRegFisArray = data.listRegFisc;
      }
      console.log(this.AllRegFisArray);
      
    });

    this._regimen.getPfRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PfAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PfAllRegFisArray);
      
    });

    this._regimen.getPmRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PmAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PmAllRegFisArray);
      
    });
  }

  listando_paises(){
    this._pais.getListaPais().subscribe((data:InterfPais[]) => {
      this.lista_paises = data;
      console.log(this.lista_paises);
    });
  }

  selectTipoNacionalidadEmp(tipoEmp:any,subtipoEmp:any,botonAction:any){
      $("#nacFisBtn").removeClass("active_chip"); 
      $("#nacMorBtn").removeClass("active_chip"); 
      $("#extFisBtn").removeClass("active_chip"); 
      $("#extMorBtn").removeClass("active_chip");

      $("#nacFisBtn").prop("disabled",false); 
      $("#nacMorBtn").prop("disabled",false); 
      $("#extFisBtn").prop("disabled",false); 
      $("#extMorBtn").prop("disabled",false);

      $("#"+botonAction).addClass("active_chip");
      $("#"+botonAction).prop("disabled",true);

    if (tipoEmp == "nacional") {
      var verif_rfcEmpExt = document.getElementById("verif_rfcEmpExt");
      this.validator.limpiaInput(verif_rfcEmpExt);
      var verif_idTaxEmp = document.getElementById("verif_idTaxEmp");
      this.validator.limpiaInput(verif_idTaxEmp);
      var verifNameCompanyExt_reg = document.getElementById("verifNameCompanyExt_reg");
      this.validator.limpiaInput(verifNameCompanyExt_reg);
      //this.vClasificacionProv = "nacional";
      //this.empModelo.tipoProv = "nacional";

      this.v_clasificacion_emp = "nacional";
      if(subtipoEmp == "empresaFisica"){
        this.v_subclasificacion_emp = "empresaFisica";
        this.emp_rfc_generico = this.rfcGenericoPF;
      }

      if (subtipoEmp == "empresaMoral"){
        this.v_subclasificacion_emp = "empresaMoral";
        this.emp_rfc_generico = this.rfcGenericoPM;
      }
    }
    if (tipoEmp == "extranjero") {
      var verif_rfcEmpMx = document.getElementById("verif_rfcEmpMx");
      this.validator.limpiaInput(verif_rfcEmpMx);
      var verif_idTaxEmp = document.getElementById("verif_idTaxEmp");
      this.validator.limpiaInput(verif_idTaxEmp);
      var verifNameCompanyNac_reg = document.getElementById("verifNameCompanyNac_reg");
      this.validator.limpiaInput(verifNameCompanyNac_reg);

      this.v_clasificacion_emp = "extranjero";
      this.emp_rfc_generico = this.rfcGenericoExt;
      if(subtipoEmp == "empresaFisica"){
        this.v_subclasificacion_emp = "empresaFisica";
      }

      if (subtipoEmp == "empresaMoral"){
        this.v_subclasificacion_emp = "empresaMoral";
      }
    }
    //this.v_subclasificacion_emp = "";
    this.emp_rfc = "";
    this.emp_id_tax = "";
    this.emp_name_razon_social = "";
  }

  especificacionesInputRfcEmp(){
    let switchCheckSubTipoEmp:any = document.getElementById("switchCheckSubTipoEmp");
    let backSubTipoEmp:any = document.getElementById("backSubTipoEmp");
    if (this.v_clasificacion_emp != "" && this.v_subclasificacion_emp != "") {
      $(switchCheckSubTipoEmp).removeAttr("disabled");
      $(backSubTipoEmp).removeAttr("disabled");
      if (this.v_clasificacion_emp == "nacional") {
        if (this.v_subclasificacion_emp == "empresaFisica") {
          $("#lbl_empresa").html("Escriba su rfc con Homoclave (13 caracteres Ej. ABCD000000XXX)");
          $("#verif_rfcEmpMx").attr("data-length","13");
          $("#verif_rfcEmpMx").attr("placeholder","Ej. ABCD000000XXX");
          $("#verif_rfcEmpMx").attr("maxlength","13");
        }
        if (this.v_subclasificacion_emp == "empresaMoral") {
          $("#lbl_empresa").html("");
          $("#verif_rfcEmpMx").attr("data-length","12");
          $("#verif_rfcEmpMx").attr("placeholder","Ej. ABC000000XXX");
          $("#verif_rfcEmpMx").attr("maxlength","12");
        }
      }
      if (this.v_clasificacion_emp == "extranjero") {

      }
      $("#btnBuscaEmpDB").removeClass("noneView");
    }
  }

  keyupVerifRfcEmp(event:any){
    if (this.v_subclasificacion_emp == "empresaFisica") {
      const validacion_pfis = event.value != "" && this.validator.filtroRfcPersFisica(event.value) && event.value.length == 13;
      this.emp_rfc = validacion_pfis ? event.value : "";
      validacion_pfis ? this.validator.correctoInput(event,"Escriba su rfc con Homoclave") : this.validator.errorInput(event,"rfc de la empresa no es correcto");
      if (event.value == "") {
        this.validator.errorInput(event,"Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
      }
    }
    if (this.v_subclasificacion_emp == "empresaMoral") {
      const validacion_pmor = event.value != "" && this.validator.filtroRfcPersMoral(event.value) && event.value.length == 12;
      this.emp_rfc = validacion_pmor ? event.value : "";
      validacion_pmor ? this.validator.correctoInput(event,"Escriba su rfc con Homoclave") : this.validator.errorInput(event,"rfc de la empresa no es correcto");
      if (event.value == "") {
        this.validator.errorInput(event,"Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
      }
    }
  }

  keyupverif_rfcExtEmp(event:any){
    const validacion = event.value != "" && this.validator.strFilter(event.value);
    this.emp_rfc = validacion ? event.value : "";
    this.validateRfcExtBool = validacion ? true : false;
    validacion ? this.validator.correctoInput(event,"Escriba su rfc") : this.validator.errorInput(event,"Rfc incorrecto");
  }

  keyupverif_TaxIdEmp(event:any){
    const validacion = event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value);
    this.emp_id_tax = validacion ? event.value : "";
    this.validateIdTaxBool = validacion ? true : false;
    validacion ? this.validator.correctoInput(event,"Escriba Tax ID de la empresa") : this.validator.errorInput(event,"Tax ID de la empresa no es correcto");
  }

  checkNombreEmp(valor:any){
    const validacion = valor.value != "" && this.validator.strFilter(valor.value) && valor.value.length >= 4;
    this.emp_name_razon_social = validacion ? valor.value : "";
    validacion ? this.validator.correctoInput(valor,"Nombre completo / razón social de la empresa") : this.validator.errorInput(valor,"Ingresa nombre completo / razón social de la empresa");
    if (valor.value.length < 4) {
      this.validator.errorInput(valor,"Número de caracteres invalido");
    }
  }

  functionBuscaEmpNacDB(){
    let verif_rfcEmpMx:any = document.getElementById("verif_rfcEmpMx");
    let verifNameCompanyNac_reg:any = document.getElementById("verifNameCompanyNac_reg");

    var frc_novacio:any = "";
    if (this.emp_rfc != "") {
      frc_novacio = this.emp_rfc;
    } else {
      frc_novacio = this.emp_rfc_generico;
    }
    console.log(frc_novacio);
    var cdna1ProvFis = frc_novacio.substring(0,4);
    var cdna2ProvFis = frc_novacio.substring(4,10);
    var cdna3ProvFis = frc_novacio.substring(10,13);
    var cdna1ProvMoral = frc_novacio.substring(0,3);
    var cdna2ProvMoral = frc_novacio.substring(3,9);
    var cdna3ProvMoral = frc_novacio.substring(9,12);

    if (this.v_clasificacion_emp != "" && this.v_subclasificacion_emp != "" && this.v_clasificacion_emp == "nacional") {
      if (this.v_subclasificacion_emp == "empresaFisica") {
        if (frc_novacio != "" && frc_novacio.length == 13 && this.emp_name_razon_social != "" &&
          this.validator.strFilter(this.emp_name_razon_social) == true && this.emp_name_razon_social.length >= 4 &&
          (/^[a-zA-Z]+$/.test(cdna1ProvFis)) && (/^[0-9]+$/.test(cdna2ProvFis)) && (/^[a-zA-Z0-9]+$/.test(cdna3ProvFis)) ) {

          this.validator.correctoInput(verif_rfcEmpMx,"Escriba su rfc con Homoclave");
          this.validator.correctoInput(verifNameCompanyNac_reg,"Nombre completo / razón social de la empresa");
          Swal.fire({
            title: this.translate.instant("swal_attenc"),
            text: "¿Su empresa es Persona Física?",
            icon: "warning",
            confirmButtonColor: "#388E3C",
            confirmButtonText: "Sí, verificar si se encuentra registrada",
            showCancelButton: true,
            cancelButtonColor: "#D32F2F",
          }).then((result) => {
            if (result.isConfirmed) {
              this.validaProvMySQL(this.emp_rfc_generico,this.emp_rfc,this.emp_id_tax,this.emp_name_razon_social);
            }
          });

        } else {
          let error = "";
          if(this.emp_name_razon_social == "" || this.validator.strFilter(this.emp_name_razon_social) == false || this.emp_name_razon_social.length < 4){
              this.validator.errorInput(verifNameCompanyNac_reg,"Ingresa nombre completo / razón social de la empresa");
              error = "Ingresa nombre de la empresa";
          }
          if (this.emp_rfc == "") {
              this.validator.errorInput(verif_rfcEmpMx,"Inserta Rfc de su empresa");
              error = "DEBE REGISTRAR RFC";
          }
          if (this.emp_rfc.length != 13) {
              this.validator.errorInput(verif_rfcEmpMx,"Su rfc debe contener 13 caracteres");
              error = "su RFC no es correcto";
          }
          if (!/^[a-zA-Z]+$/.test(cdna1ProvFis) || !/^[0-9]+$/.test(cdna2ProvFis) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvFis)) {
              this.validator.errorInput(verif_rfcEmpMx,"Su rfc debe contener 13 caracteres");
              error = "su RFC no es correcto";
          }
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: error,
            showConfirmButton:false,
            timer: 3000
          })
        }
      }

      if (this.v_subclasificacion_emp == "empresaMoral") {
        if(frc_novacio != "" && frc_novacio.length == 12 && this.emp_name_razon_social != "" &&
          this.validator.strFilter(this.emp_name_razon_social) == true && this.emp_name_razon_social.length >= 4 &&
          (/^[a-zA-Z]+$/.test(cdna1ProvMoral)) && (/^[0-9]+$/.test(cdna2ProvMoral)) && (/^[a-zA-Z0-9]+$/.test(cdna3ProvMoral))) {

          this.validator.correctoInput(verif_rfcEmpMx,"Escriba su rfc con Homoclave");
          this.validator.correctoInput(verifNameCompanyNac_reg,"Nombre completo / razón social de la empresa");
          Swal.fire({
            title: this.translate.instant("swal_attenc"),
            text: "¿Su empresa es Persona Moral?",
            icon: "warning",
            confirmButtonColor: "#388E3C",
            confirmButtonText: "Sí, verificar si se encuentra registrada",
            showCancelButton: true,
            cancelButtonColor: "#D32F2F",
          }).then((result) => {
            if (result.isConfirmed) {
              this.validaProvMySQL(this.emp_rfc_generico,this.emp_rfc,this.emp_id_tax,this.emp_name_razon_social);
            }
          });
        } else {
          let error = "";
          if(this.emp_name_razon_social == "" || this.validator.strFilter(this.emp_name_razon_social) == false || this.emp_name_razon_social.length < 4){
              this.validator.errorInput(verifNameCompanyNac_reg,"Inserta nombre completo / razón social de la empresa");
              error = "Inserta nombre de la empresa";
          }
          if (this.emp_rfc == "") {
              this.validator.errorInput(verif_rfcEmpMx,"Inserta Rfc de su empresa");
              error = "DEBE REGISTRAR RFC";
          }
          if (this.emp_rfc.length != 12) {
              this.validator.errorInput(verif_rfcEmpMx,"Su rfc debe contener 12 caracteres");
              error = "su RFC no es correcto";
          }
          if (!/^[a-zA-Z]+$/.test(cdna1ProvMoral) || !/^[0-9]+$/.test(cdna2ProvMoral) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvMoral)) {
              this.validator.errorInput(verif_rfcEmpMx,"Su rfc debe contener 12 caracteres");
              error = "su RFC no es correcto";
          }
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: error,
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
    } else {
      if (this.v_clasificacion_emp == "") {
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione empresa nacional o extranjero",
          showConfirmButton:false,
          timer: 3000
        })
      }

      if (this.v_subclasificacion_emp == "") {
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione persona física o moral",
          showConfirmButton:false,
          timer: 3000
        })
      }

    }
  }

  funtcBuscaEmpExtDB(){
    let verif_rfcEmp:any = document.getElementById("verif_rfcEmp");
    let verifNameCompany_reg:any = document.getElementById("verifNameCompany_reg");
    let verif_idTaxEmp:any = document.getElementById("verif_idTaxEmp");
    var cdna1ProvFis = this.emp_rfc.substring(0,4);
    var cdna2ProvFis = this.emp_rfc.substring(4,10);
    var cdna3ProvFis = this.emp_rfc.substring(10,13);
    var cdna1ProvMoral = this.emp_rfc.substring(0,3);
    var cdna2ProvMoral = this.emp_rfc.substring(3,9);
    var cdna3ProvMoral = this.emp_rfc.substring(9,12);

    if (this.v_clasificacion_emp != "" && this.v_subclasificacion_emp != "" && this.v_clasificacion_emp == "extranjero") {

      if (this.emp_rfc == "" && this.emp_id_tax == "") {
        if (this.emp_rfc_generico != "" && this.emp_rfc_generico.length >= 9 && this.emp_rfc_generico.length <= 40 &&
          this.emp_name_razon_social != "" && this.validator.strFilter(this.emp_name_razon_social) == true && this.emp_name_razon_social.length >= 4) {
          this.validator.correctoInput(verif_rfcEmp,"Escriba su rfc con Homoclave");
          this.validator.correctoInput(verif_idTaxEmp,"Escriba su Tax ID con Homoclave");
          this.validator.correctoInput(verifNameCompany_reg,"Nombre completo / razón social de la empresa");
          Swal.fire({
            title: this.translate.instant("swal_attenc"),
            text: "¿Su empresa es extranjera?",
            icon: "warning",
            confirmButtonColor: "#388E3C",
            confirmButtonText: this.translate.instant("swal_yes_insert"),
            showCancelButton: true,
            cancelButtonColor: "#D32F2F",
          }).then((result) => {
            if (result.isConfirmed) {
              this.validaProvMySQL(this.emp_rfc_generico,this.emp_rfc,this.emp_id_tax,this.emp_name_razon_social);
            }
          });
        } else {
          let error = "";
          if (this.emp_rfc_generico == "") {
              error = "Debe registrar Tax ID";
          }
          if (this.emp_rfc_generico.length < 9 || this.emp_rfc_generico.length > 40) {
              error = "su RFC no es correcto";
          }
          if(this.emp_name_razon_social == "" || this.validator.strFilter(this.emp_name_razon_social) == false || this.emp_name_razon_social.length < 4){
              this.validator.errorInput(verifNameCompany_reg,"Ingresa nombre completo / razón social de la empresa");
              error = "Ingresa nombre completo / razón social de la empresa";
          }
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: error,
            showConfirmButton:false,
            timer: 3000
          })
        }
      } else {
        if (this.validateRfcExtBool == true && this.validateIdTaxBool == true) {
          if (this.emp_rfc_generico != "" && this.emp_rfc_generico.length >= 9 && this.emp_rfc_generico.length <= 40 &&
            this.emp_name_razon_social != "" && this.validator.strFilter(this.emp_name_razon_social) == true && this.emp_name_razon_social.length >= 4) {
            this.validator.correctoInput(verif_rfcEmp,"Escriba su rfc con Homoclave");
            this.validator.correctoInput(verif_idTaxEmp,"Escriba su Tax ID con Homoclave");
            this.validator.correctoInput(verifNameCompany_reg,"Nombre completo / razón social de la empresa");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su empresa es extranjero?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: this.translate.instant("swal_yes_insert"),
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaProvMySQL(this.emp_rfc_generico,this.emp_rfc,this.emp_id_tax,this.emp_name_razon_social);
              }
            });
          } else {
            let error = "";
            if (this.emp_rfc_generico == "") {
                error = "Debe registrar Tax ID";
            }
            if (this.emp_rfc_generico.length < 9 || this.emp_rfc_generico.length > 40) {
                error = "su RFC no es correcto";
            }
            if(this.emp_name_razon_social == "" || this.validator.strFilter(this.emp_name_razon_social) == false || this.emp_name_razon_social.length < 4){
                this.validator.errorInput(verifNameCompany_reg,"Ingresa nombre completo / razón social de la empresa");
                error = "Ingresa nombre completo / razón social de la empresa";
            }
            Swal.fire({
              position:"top-end",
              icon: "warning",
              title: error,
              showConfirmButton:false,
              timer: 3000
            })
          }
        } else {
          let error = "";
          if (this.validateRfcExtBool == false) {
              error = "Error al registrar rfc";
          }
          if (this.validateIdTaxBool == false) {
              error = "Error al registrar idTax";
          }
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: error,
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
    } else {
      if (this.v_clasificacion_emp == "") {
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione empresa nacional o extranjero",
          showConfirmButton:false,
          timer: 3000
        })
      }

      if (this.v_subclasificacion_emp == "") {
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione persona física o moral",
          showConfirmButton:false,
          timer: 3000
        })
      }
    }
  }

  validaProvMySQL(emp_rfc_generico:any,rfc:any,id_tax:any,nombre:any){
    this.emp_serv.verificaExistsAllEmpresas(this.v_clasificacion_emp,this.v_subclasificacion_emp,emp_rfc_generico,rfc,id_tax,nombre).subscribe(
      response => {
        let translate_response = this.translate.instant(response.message);
        if (response.status == "success") {
          Swal.fire({
            position:"center",
            icon: "success",
            title: translate_response,
            showConfirmButton:false,
            timer: 3000
          });
          this.validateFoundEmp = true;
          this.empModelo.name_emp = nombre;
          this.empModelo.rfc_back = rfc;
          this.empModelo.id_tax_back = id_tax;
          this.empModelo.name_emp_back = nombre;

          this.emp_name_razon_social = nombre;
          //if (this.v_subclasificacion_emp == "empresaFisica") {} this.emp_rfc_generico
          this.razon_social = this.emp_name_razon_social;
          //this.validateAllPersonales();
        }
        if (response.status == "error") {
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: translate_response,
            showConfirmButton:false,
            timer: 3000
          })
        }
      },
      error => {
        //console.log(error);
      }
    )
  }

  validateAllPersonales(){
    var txt_r_social:any = document.getElementById("txt_r_social");
    var txtComercial_name:any = document.getElementById("txtComercial_name");
    var txt_abrev:any = document.getElementById("txt_abrev");
    var txt_curp:any = document.getElementById("txt_curp");
    var sel_pais:any = document.getElementById("sel_pais");
    var txt_sitio_web:any = document.getElementById("txt_sitio_web");
    var selRegimenFiscal:any = document.getElementById("selRegimenFiscal");

    const valida_razon_social = this.razon_social != "" && this.validator.strFilEmp(this.razon_social); 
    const valida_abrev = this.abrev != "" && this.validator.strFilter(this.abrev) && this.abrev.length == 3; 

    if (valida_razon_social && valida_abrev && this.tknRegimenFiscal != "") {
      if (this.v_subclasificacion_emp == "empresaFisica") {
        if (this.curp == "" && this.comercial_nombre == "" && this.sitio_web == "") {
          if (this.v_clasificacion_emp == "extranjero") {
            if (this.paistoken != "") {
              this.validatePersonales = true;
            } else {
              this.validatePersonales = false;
              this.validator.errorSelect(sel_pais,"Seleccione un pais");
            }
          } else {
            this.validatePersonales = true;
          }
        } else {
          if (this.curp != "") {
            if (this.curp != "" && (/^[a-zA-Z0-9]+$/.test(this.curp)) && this.curp.length == 18) {
              if (this.v_clasificacion_emp == "extranjero") {
                if (this.paistoken != "") {
                  this.validatePersonales = true;
                } else {
                  this.validatePersonales = false;
                  this.validator.errorSelect(sel_pais,"Seleccione un pais");
                }
              } else {
                this.validatePersonales = true;
              }
            } else {
              this.validator.errorInput(txt_curp,"Inserta CURP/CURP invalido");
            }
          } else {
            if (this.v_clasificacion_emp == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelect(sel_pais,"Seleccione un pais");
              }
            } else {
              this.validatePersonales = true;
            }
          }
  
          if (this.comercial_nombre != "") {
            if (this.comercial_nombre != "" && this.validator.strFilEmp(this.comercial_nombre) == true) {
              if (this.v_clasificacion_emp == "extranjero") {
                if (this.paistoken != "") {
                  this.validatePersonales = true;
                } else {
                  this.validatePersonales = false;
                  this.validator.errorSelect(sel_pais,"Seleccione un pais");
                }
              } else {
                this.validatePersonales = true;
              }
  
            } else {
              this.validator.errorInput(txtComercial_name,"Error en nombre comercial");
            }
          } else {
            if (this.v_clasificacion_emp == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelect(sel_pais,"Seleccione un pais");
              }
            } else {
              this.validatePersonales = true;
            }
          }
  
          if (this.sitio_web != "") {
            if (this.sitio_web != "" && this.validator.filtroUrl("https://"+this.sitio_web) == true) {
              if (this.v_clasificacion_emp == "extranjero") {
                if (this.paistoken != "") {
                  this.validatePersonales = true;
                } else {
                  this.validatePersonales = false;
                  this.validator.errorSelect(sel_pais,"Seleccione un pais");
                }
              } else {
                this.validatePersonales = true;
              }
  
            } else {
              this.validator.errorInput(txt_sitio_web,"Sitio web invalido");
            }
          } else {
            if (this.v_clasificacion_emp == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelect(sel_pais,"Seleccione un pais");
              }
            } else {
              this.validatePersonales = true;
            }
          }
        }
      }
      if (this.v_subclasificacion_emp == "empresaMoral") {
        if (this.v_clasificacion_emp == "nacional") {
          if (this.comercial_nombre == "" && this.sitio_web == "") {
            this.validatePersonales = true;
          } else {
            if (this.comercial_nombre != "") {
              if (this.comercial_nombre != "" && this.validator.strFilEmp(this.comercial_nombre) == true) {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorInput(txtComercial_name,"Error en nombre comercial");
              }
            } else {
              this.validatePersonales = true;
            }
  
            if (this.sitio_web != "") {
              if (this.sitio_web != "" && this.validator.filtroUrl("https://"+this.sitio_web) == true) {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorInput(txt_sitio_web,"Sitio web invalido");
              }
            } else {
              this.validatePersonales = true;
            }
          }
        }
  
        if (this.v_clasificacion_emp == "extranjero") {
          if (this.comercial_nombre == "" && this.sitio_web == "") {
            if (this.paistoken == "") {
              this.validatePersonales = false;
            } else {
              this.validatePersonales = true;
            }  
          } else {
            if (this.comercial_nombre != "") {
              if (this.comercial_nombre != "" && this.validator.strFilEmp(this.comercial_nombre) == true) {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorInput(txtComercial_name,"Error en nombre comercial");
              }
            } else {
              this.validatePersonales = true;
            }
  
            if (this.sitio_web != "") {
              if (this.sitio_web != "" && this.validator.filtroUrl("https://"+this.sitio_web) == true) {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorInput(txt_sitio_web,"Sitio web invalido");
              }
            } else {
              this.validatePersonales = true;
            }
  
            if (this.v_clasificacion_emp == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelect(sel_pais,"Seleccione un pais");
              }
            } else {
              this.validatePersonales = true;
            }
          }
        }
      }
    } else {
      this.validatePersonales = false;
      if (!valida_razon_social) this.validator.errorInput(txt_r_social,"ingresa nombre de empresa");
      if (!valida_abrev) this.validator.errorInput(txt_abrev,"Error en abreviación");
      if (this.tknRegimenFiscal == "") this.validator.errorSelectBrowser(selRegimenFiscal);
    }
    console.log(this.validatePersonales);
  }

  decideEditarDataEmpresa(){
    this.decisionEditNombre = this.decisionEditNombre == false ? true : false;
  }

  validaNewNombreEmp(valor:any){
    const validacion = valor.value != "" && valor.value.length >= 4 && this.validator.strFilter(valor.value) == true && valor.value != this.empModelo.name_emp;
    this.empModelo.name_emp_back = validacion ? valor.value : "";
    validacion ? this.validator.correctoInput(valor,"Nombre completo / razón social de la empresa") : this.validator.errorInput(valor,"Ingresa nombre completo / razón social de la empresa");
  }

  validaNewRfcEmp(event:any){ 
    if (this.v_subclasificacion_emp == "provFisica") {
      const validacion = event.value != "" && this.validator.filtroRfcPersFisica(event.value) && event.value.length == 13;
      this.empModelo.rfc_back = validacion ? event.value : "";
      validacion ? this.validator.correctoInput(event,"Escriba su rfc con Homoclave") : this.validator.errorInput(event,"Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
    }

    if (this.v_subclasificacion_emp == "provMoral") {
      const validacion = event.value != "" && this.validator.filtroRfcPersFisica(event.value) && event.value.length == 12;
      this.empModelo.rfc_back = validacion ? event.value : "";
      validacion ? this.validator.correctoInput(event,"Escriba su rfc con Homoclave") : this.validator.errorInput(event,"Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
    }
  }
  
  validaNewTaxIdProv(event:any){
    const validacion = event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value);
    this.validateIdTaxBool = validacion ? true : false;
    this.empModelo.id_tax_back = validacion ? event.value : '';
    validacion ? this.validator.correctoInput(event,"Escriba Tax ID de la empresa") : this.validator.errorInput(event,"Tax ID de la empresa no es correcto");
  }
  
  guardaNew_DataEmpresa(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.emp_serv.verificaExistsAllEmpresas(this.v_clasificacion_emp,this.v_subclasificacion_emp,this.empModelo.rfc_generico,this.empModelo.rfc_back,this.empModelo.id_tax_back,this.empModelo.name_emp_back).subscribe(
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
              this.empModelo.name_emp = this.empModelo.name_emp_back;
              this.empModelo.rfc = this.empModelo.rfc_back;
              this.empModelo.id_tax = this.empModelo.id_tax_back;
              this.decisionEditNombre = false;
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {console.log(error);}
        );
      }
    })
  }

  comeBackPrincipalMenu(){
    this.v_clasificacion_emp = "";
    this.v_subclasificacion_emp = "";
    this.emp_rfc_generico = "";
    this.emp_rfc = "";
    this.emp_id_tax = "";
    this.validateFoundEmp = false;
    this.v_clasificacion_emp = "";
    this.v_subclasificacion_emp = "";
    this.rfcGenericoPF = "xaxx010101000";
    this.rfcGenericoPM = "xax010101000";
    this.rfcGenericoExt = "xexx010101000";
    this.validateRfcExtBool = true;
    this.validateIdTaxBool = true;
    this.validatePersonales = false;
    this.validateUbicacion = false;
    this.abrev = "";
    this.razon_social = "";
    this.comercial_nombre = "";
    this.curp = "";
    this.sitio_web = "";
    this.paistoken = "";
    this.tknRegimenFiscal = "";
  }

  keyupComercialName(event:any){
    const validacion = event.value != "" && this.validator.strFilEmp(event.value);
    this.comercial_nombre = validacion ? event.value : "";
    validacion ? this.validator.correctoInput(event,"Nombre comercial") : this.validator.errorInput(event,"Error en nombre comercial");
    this.validateAllPersonales();
  }

  keyupAbrev(event:any){
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length == 3;
    this.abrev = validacion ? event.value : "";
    validacion ? this.validator.correctoInput(event,"Abreviación") : this.validator.errorInput(event,"Error en abreviación");
  }

  keyupCurp(event:any){ //txt_curp
    const validacion = event.value != "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length == 18;
    this.curp = validacion ? event.value : "";
    validacion ? this.validator.correctoInput(event,"CURP") : this.validator.errorInput(event,"Error en CURP");
    this.validateAllPersonales();
  }

  changePais(event:any){
    const s_pais = this.lista_paises.find((row: any) => row.token_pais === event.value);
    const validacion = event.value != "" && typeof s_pais !== 'undefined';
    this.paistoken = validacion ? s_pais.token_pais : "";
    validacion ? this.validator.correctoSelect(event,"Pais") : this.validator.errorSelect(event,"Seleccione un pais");
    this.validateAllPersonales();
  }

  changeSitioWeb(event:any){
    const validacion = event.value != "" && this.validator.filtroUrl("https://"+event.value);
    this.sitio_web = validacion ? event.value : "";
    validacion ? this.validator.correctoInput(event,"Sitio Web") : this.validator.errorInput(event,"Sitio web invalido");
    this.validateAllPersonales();
  }

  changeRegimenFiscal(event:any){
    const fis_cal = this.AllRegFisArray.find((row: any) => row.token_regimen_fiscal === event.value);
    const validacion = event.value != "" && typeof fis_cal !== 'undefined';
    this.tknRegimenFiscal = validacion ? fis_cal.token_regimen_fiscal : "";
    validacion ? this.validator.correctoSelect(event,"Regimen fiscal") : this.validator.errorSelect(event,"Seleccione regimen fiscal");
    this.validateAllPersonales();
  }

  solicitaRegistroEmpresa(form:NgForm):void{
    //this.validatePersonales == true && this.validateUbicacion == true
    if (this.validatePersonales == true) {
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea registrar esta empresa?",
        icon: "warning",
        confirmButtonColor: "#388E3C",
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: "#D32F2F",
      }).then((result) => {
        if (result.isConfirmed) {
          this.emp_serv.empresa_registrar(
            this.emp_rfc_generico,
            this.emp_rfc,
            this.emp_id_tax,
            this.v_clasificacion_emp,
            this.v_subclasificacion_emp,
            this.razon_social,
            this.abrev,
            this.comercial_nombre,
            this.curp,
            this.paistoken,
            this.sitio_web,
            this.tknRegimenFiscal
          ).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function(){
                  Swal.fire({
                    position:"center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                //this.lista_general_empresas();
                this.comeBackPrincipalMenu();
                form.resetForm();
                this.formAddEmp.resetForm();
                //this.relInterna.mensajeProveedorRegistro("registro aprobado");
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              //console.log(error);
            }
          )
        }
      })
    } else {
      Swal.fire({
        position:"top-end",
        icon: "warning",
        title: "llene los campos solicitados",
        showConfirmButton:false,
        timer: 3000
      })
    }
  }
}
