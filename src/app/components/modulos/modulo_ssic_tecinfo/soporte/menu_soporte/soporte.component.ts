import { Component, OnInit } from '@angular/core';
import { SoporteServiceService } from '../../../../../servicios/ssic/soporte-service.service';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';
import { ServEncryptService } from '../../../../../servicios/ssic/serv-encrypt.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { EmpresasServService } from '../../../../../servicios/ssic/empresas-serv.service';
import { PaisService } from '../../../../../servicios/ssic/pais.service';
import { InterfPais } from "../../../../../interfaces/interf-pais";
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { RegimenFiscalService } from '../../../../../servicios/regimen-fiscal.service';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/explain.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
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
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    './soporte.component.css',
    './../../tec_info.css'
  ]
})
export class SoporteComponent implements OnInit {
  list_solicitudes_registro:any = [];
  list_solicitudes_registro_canceled:any = [];
  list_solicitudes_registro_Deleted:any = [];

  list_empresas_all:any = [];
  AllRegFisArray:any = [];
  PfAllRegFisArray:any = [];
  PmAllRegFisArray:any = [];
  pageAltaPostales:number = 1;
  //public provModelo: provRfcTipoModelo;
  lista_paises: InterfPais[] = [];
  arrayMonedas:any = [];

  public validateRfcExtBool:boolean = true;
  public validateIdTaxBool:boolean = true;
  public validateFoundEmp:boolean = false;

  public v_clasificacion_emp:string = "";
  public v_subclasificacion_emp:string = "";
  public validatePersonales:boolean = false;
  public validateUbicacion:boolean = false;

  //datos generales
    public paterno:string = "";
    public materno:string = "";
    public nombres:string = "";
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
    public cod_postal:string = "";
    //dipomex
    public dipomex_cod_postal_estado:string = "---";
    public dipomex_cod_postal_municipio:string = "---";
    public dipomex_cod_postal_cp:string = "---";
    public dipomex_cod_postal_colonias:any = [];
    public dipomex_cod_postal_colonia_vinculada:string = "";
    public new_cod_postal_estado_name:string = "---";
    public new_cod_postal_estado_abrev:string = "---";
    public new_cod_postal_municipio:string = "---";
    public new_cod_postal_cp:string = "---";
    public new_cod_postal_colonia_vinculada:string = "";
    public validaCPNew:boolean = false;
    listnewdireccionNac:any = [];
    options = {};

  public new_user_paterno:string = "";
  public new_user_materno:string = "";
  public new_user_nombres:string = "";
  public new_user_email:string = "";
  public new_user_area:string = "";
  public new_user_cargo:string = "";
  list_empresas_user:any = [];
  list_areas_user:any = [];
  list_cargos_user:any = [];
  public new_user_bool_emp:boolean = true;
  public valida_registro_usuario:boolean = false;
  usuariosList:any = [];
  expandedRowsUsuarios: { [s: string]: boolean } = {};

  constructor(
    private soporteServ:SoporteServiceService,
    private trab_serv:EmpleadosService,
    private encryptor:ServEncryptService,
    public validator:ValidatorServService,
    public emp_serv:EmpresasServService,
    private translate:TranslateService,
    public _pais:PaisService,
    private _regimen:RegimenFiscalService
    ) { }

  ngOnInit(): void {
    this.solicitudes_registro();
    this.lista_general_empresas();
    this.catalogoAreasEmp();
    this.listaPersonal();

    this._pais.getListaPais().subscribe((data:InterfPais[]) => {
      this.lista_paises = data;
      console.log(this.lista_paises);
    });

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

  solicitudes_registro(){
    this.soporteServ.solicitudes_reg_vig().subscribe(
      response => {
        if (response.status == 'success') {
          this.list_solicitudes_registro = response.arrayEmpVig;
        }
      }, error => {console.log(error);}
    );
  }

  lista_general_empresas(){
    this.emp_serv.listaEmpresasAll().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          console.log(response.companies);
          this.list_empresas_all = response.companies;
          
          console.log(this.list_empresas_all);
          for (let e = 0; e < this.list_empresas_all.length; e++) {
            const emp = this.list_empresas_all[e];
            this.list_empresas_user.push({"company_name":emp["company_name"],"emp_token":emp["emp_token"],"name_abrev":emp["name_abrev"],"selected":false});
          }
          console.log(this.list_empresas_user);
        }
      }, error => {console.log(error);}
    );
  }

  catalogoAreasEmp(){
    this.trab_serv.catalogoAreasEmp().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.list_areas_user = response.areas;
          
          console.log(this.list_areas_user)
        }
      }, error => {console.log(error);}
    );
  }

  listaPersonal(){
    //this.trab_serv.listaPersonalSos().subscribe(
    //  response => {
    //    console.log(response);
    //    if (response.status == 'success') {
    //      this.usuariosList = response.usuarios;
    //      
    //      console.log(this.usuariosList)
    //    }
    //  }, error => {console.log(error);}
    //);
  }

  toggleUsuarios(row: any) {
    const isExpanded = !!this.expandedRowsUsuarios[row.empleado_token];
    this.expandedRowsUsuarios = {};
    if (!isExpanded) {
      this.expandedRowsUsuarios[row.empleado_token] = true;
    }
  }

  rExpandUsuarios(row: any): boolean {
    return !!this.expandedRowsUsuarios[row.empleado_token];
  }

  //registrar empresas
  selectTipoNacionalidadEmp(tipoEmp:any,subtipoEmp:any,botonAction:any){
    $("#nacFisBtn").removeClass("active"); 
    $("#nacMorBtn").removeClass("active"); 
    $("#extFisBtn").removeClass("active"); 
    $("#extMorBtn").removeClass("active");
    $("#"+botonAction).addClass("active");

    if (tipoEmp == "nacional") {
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

  checksubtipoProv(event:any,subtipoEmp:any){
    if (this.v_clasificacion_emp != "") {
      if (this.v_clasificacion_emp == "nacional") {
        if(subtipoEmp == "empresaFisica"){
          this.v_subclasificacion_emp = "empresaFisica";
          this.emp_rfc_generico = this.rfcGenericoPF;
        }

        if (subtipoEmp == "empresaMoral"){
          this.v_subclasificacion_emp = "empresaMoral";
          this.emp_rfc_generico = this.rfcGenericoPM;
        }
      }

      if (this.v_clasificacion_emp == "extranjero") {
        this.emp_rfc_generico = this.rfcGenericoExt;
        if(subtipoEmp == "empresaFisica"){
          this.v_subclasificacion_emp = "empresaFisica";
        }

        if (subtipoEmp == "empresaMoral"){
          this.v_subclasificacion_emp = "empresaMoral";
        }
      }

      //this.emp_rfc = "";
      //this.emp_id_tax = "";
      //this.emp_name_razon_social = "";
    }
  }

  keyupverif_rfcProv(event:any){
    if (event.value != "") {
      if (this.v_subclasificacion_emp == "empresaFisica") {
        var cdna1 = event.value.substring(0,4);
        var cdna2 = event.value.substring(4,10);
        var cdna3 = event.value.substring(10,13);
        if (/^[a-zA-Z]+$/.test(cdna1)) {
          if (/^[0-9]+$/.test(cdna2)) {
            if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 13) {
              this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
              this.emp_rfc = event.value;
            } else {
              this.validator.errorInput(event,"rfc de la empresa no es correcto");
              this.emp_rfc = "";
            }
          } else {
            this.validator.errorInput(event,"rfc de la empresa no es correcto");
            this.emp_rfc = "";
          }
        } else {
          this.validator.errorInput(event,"rfc de la empresa no es correcto");
          this.emp_rfc = "";
        }
      }
      if (this.v_subclasificacion_emp == "empresaMoral") {
        var cdna1 = event.value.substring(0,3);
        var cdna2 = event.value.substring(3,9);
        var cdna3 = event.value.substring(9,12);
        if (/^[a-zA-Z]+$/.test(cdna1)) {
          if (/^[0-9]+$/.test(cdna2)) {
            if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 12) {
              this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
              this.emp_rfc = event.value;
            }
            else{
              this.validator.errorInput(event,"rfc de la empresa no es correcto");
              this.emp_rfc = "";
            }
          }
          else{
            this.validator.errorInput(event,"rfc de la empresa no es correcto");
            this.emp_rfc = "";
          }
        }
        else{
          this.validator.errorInput(event,"rfc de la empresa no es correcto");
          this.emp_rfc = "";
        }
      }
    } else {
      if (this.v_subclasificacion_emp == "empresaFisica") {
        this.emp_rfc = "";
        this.validator.errorInput(event,"Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
      }
      if (this.v_subclasificacion_emp == "empresaMoral") {
        this.emp_rfc = "";
        this.validator.errorInput(event,"Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
      }
    }
  }

  keyupverif_rfcExtEmp(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true) {
      this.validator.correctoInput(event,"Escriba su rfc");
      this.validateRfcExtBool = true;
      this.emp_rfc = event.value;
    } else {
      this.emp_rfc = "";
      this.validateRfcExtBool = false;
      this.validator.errorInput(event,"Rfc incorrecto");
    }
  }

  keyupverif_TaxIdEmp(event:any){
    if (event.value != "") {
      if (event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value) == true) {
        this.validator.correctoInput(event,"Escriba Tax ID de la empresa");
        this.validateIdTaxBool = true;
        this.emp_id_tax = event.value;
      } else {
        this.validator.errorInput(event,"Tax ID de la empresa no es correcto");
        this.validateIdTaxBool = false;
        this.emp_id_tax = "";
      }
    } else {
      this.emp_id_tax = "";
      this.validateIdTaxBool = false;
      this.validator.errorInput(event,"Tax ID de la empresa no es correcto");
    }
  }

  functllenaRFcGenerico(event:any){
    $("#verif_rfcEmp").val("");
    $("#verif_rfcEmp").attr("disabled","disabled");
    if (this.v_clasificacion_emp == "nacional") {
      if (this.v_subclasificacion_emp != "") {
        if (this.v_subclasificacion_emp == "empresaFisica") {
          this.emp_rfc = this.rfcGenericoPF;
          $(event).addClass("noneView");
          $("#btnllenaRFcProv").removeClass("noneView");
        }
        if (this.v_subclasificacion_emp == "empresaMoral") {
          this.emp_rfc = this.rfcGenericoPM;
          $(event).addClass("noneView");
          $("#btnllenaRFcProv").removeClass("noneView");
        }
      } else {
        $("#verif_rfcEmp").removeAttr("disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcProv").addClass("noneView");
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione subtipo de empresa",
          showConfirmButton:false,
          timer: 3000
        })
      }
    }
    if (this.v_clasificacion_emp == "extranjero") {
      if (this.v_subclasificacion_emp != "") {
        this.emp_rfc = this.rfcGenericoExt;
        $(event).addClass("noneView");
        $("#btnllenaRFcProv").removeClass("noneView");
      } else {
        $("#verif_rfcEmp").removeAttr("disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcProv").addClass("noneView");
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione subtipo de empresa",
          showConfirmButton:false,
          timer: 3000
        })
      }
    }
  }

  functllenaRFcEmp(event:any){
    $("#verif_rfcEmp").val("");
    if (this.v_clasificacion_emp == "nacional") {
      if (this.v_subclasificacion_emp != "") {
        if (this.v_subclasificacion_emp == "empresaFisica") {
          $("#verif_rfcEmp").removeAttr("disabled");
          this.emp_rfc = "";
          $(event).addClass("noneView");
          $("#btnllenaRFcGenerico").removeClass("noneView");
        }
        if (this.v_subclasificacion_emp == "empresaMoral") {
          $("#verif_rfcEmp").removeAttr("disabled");
          this.emp_rfc = "";
          $(event).addClass("noneView");
          $("#btnllenaRFcGenerico").removeClass("noneView");
        }
      } else {
        $("#verif_rfcEmp").attr("disabled","disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcGenerico").addClass("noneView");
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione subtipo de empresa",
          showConfirmButton:false,
          timer: 3000
        })
      }
    }
    if (this.v_clasificacion_emp == "extranjero") {
      if (this.v_subclasificacion_emp != "") {
        $("#verif_rfcEmp").removeAttr("disabled");
        this.emp_rfc = "";
        $(event).addClass("noneView");
        $("#btnllenaRFcGenerico").removeClass("noneView");
      } else {
        $("#verif_rfcEmp").removeAttr("disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcGenerico").addClass("noneView");
        Swal.fire({
          position:"top-end",
          icon: "warning",
          title: "seleccione subtipo de empresa",
          showConfirmButton:false,
          timer: 3000
        })
      }
    }
  }

  checkNombreEmp(valor:any){
    if (valor.value === "") {
      this.validator.errorInput(valor,"Ingresa nombre completo / razón social de la empresa");
      this.emp_name_razon_social = "";
    } else {
      if (this.validator.strFilter(valor.value) == false) {
        this.validator.errorInput(valor,"Ingresa nombre completo / razón social de la empresa");
        this.emp_name_razon_social = "";
      } else {
        if (valor.value.length <4) {
          this.validator.errorInput(valor,"Número de caracteres invalido");
          this.emp_name_razon_social = "";
        } else {
          this.validator.correctoInput(valor,"Nombre completo / razón social de la empresa");
          this.emp_name_razon_social = valor.value;
        }
      }
    }
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
          $("#verif_rfcEmp").attr("data-length","13");
          $("#verif_rfcEmp").attr("placeholder","Ej. ABCD000000XXX");
          $("#verif_rfcEmp").attr("maxlength","13");
        }
        if (this.v_subclasificacion_emp == "empresaMoral") {
          $("#lbl_empresa").html("");
          $("#verif_rfcEmp").attr("data-length","12");
          $("#verif_rfcEmp").attr("placeholder","Ej. ABC000000XXX");
          $("#verif_rfcEmp").attr("maxlength","12");
        }
      }
      if (this.v_clasificacion_emp == "extranjero") {

      }
      $("#btnBuscaEmpDB").removeClass("noneView");
    }
  }

  functionBuscaEmpNacDB(){
    let verif_rfcEmp:any = document.getElementById("verif_rfcEmp");
    let verifNameCompany_reg:any = document.getElementById("verifNameCompany_reg");

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

          this.validator.correctoInput(verif_rfcEmp,"Escriba su rfc con Homoclave");
          this.validator.correctoInput(verifNameCompany_reg,"Nombre completo / razón social de la empresa");
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
              this.validator.errorInput(verifNameCompany_reg,"Ingresa nombre completo / razón social de la empresa");
              error = "Ingresa nombre de la empresa";
          }
          if (this.emp_rfc == "") {
              this.validator.errorInput(verif_rfcEmp,"Inserta Rfc de su empresa");
              error = "DEBE REGISTRAR RFC";
          }
          if (this.emp_rfc.length != 13) {
              this.validator.errorInput(verif_rfcEmp,"Su rfc debe contener 13 caracteres");
              error = "su RFC no es correcto";
          }
          if (!/^[a-zA-Z]+$/.test(cdna1ProvFis) || !/^[0-9]+$/.test(cdna2ProvFis) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvFis)) {
              this.validator.errorInput(verif_rfcEmp,"Su rfc debe contener 13 caracteres");
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

          this.validator.correctoInput(verif_rfcEmp,"Escriba su rfc con Homoclave");
          this.validator.correctoInput(verifNameCompany_reg,"Nombre completo / razón social de la empresa");
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
              this.validator.errorInput(verifNameCompany_reg,"Inserta nombre completo / razón social de la empresa");
              error = "Inserta nombre de la empresa";
          }
          if (this.emp_rfc == "") {
              this.validator.errorInput(verif_rfcEmp,"Inserta Rfc de su empresa");
              error = "DEBE REGISTRAR RFC";
          }
          if (this.emp_rfc.length != 12) {
              this.validator.errorInput(verif_rfcEmp,"Su rfc debe contener 12 caracteres");
              error = "su RFC no es correcto";
          }
          if (!/^[a-zA-Z]+$/.test(cdna1ProvMoral) || !/^[0-9]+$/.test(cdna2ProvMoral) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvMoral)) {
              this.validator.errorInput(verif_rfcEmp,"Su rfc debe contener 12 caracteres");
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
          this.emp_name_razon_social = nombre;
          //if (this.v_subclasificacion_emp == "empresaFisica") {} this.emp_rfc_generico
          if (this.v_subclasificacion_emp == "empresaMoral") {
            this.razon_social = this.emp_name_razon_social;
            //this.validator.correctoInput("#txtempresa_reg","Empresa");
          }          
          this.validateAllPersonales();
          
          
          
          
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
    this.paterno = "";
    this.materno = "";
    this.nombres = "";
    this.abrev = "";
    this.razon_social = "";
    this.comercial_nombre = "";
    this.curp = "";
    this.sitio_web = "";
    this.paistoken = "";
    this.tknRegimenFiscal = "";
    this.cod_postal = "";
    //dipomex
    this.dipomex_cod_postal_estado = "---";
    this.dipomex_cod_postal_municipio = "---";
    this.dipomex_cod_postal_cp = "---";
    this.dipomex_cod_postal_colonias = [];
    this.dipomex_cod_postal_colonia_vinculada = "";
    this.new_cod_postal_estado_name = "---";
    this.new_cod_postal_estado_abrev = "---";
    this.new_cod_postal_municipio = "---";
    this.new_cod_postal_cp = "---";
    this.new_cod_postal_colonia_vinculada = "";
    this.validaCPNew = false;
    this.listnewdireccionNac = [];
  }

//personales
  verificaEmpIguales(){
    let txt_paterno:any = document.getElementById("txt_paterno");
    let txt_materno:any = document.getElementById("txt_materno");
    let txt_nombres:any = document.getElementById("txt_nombres");
    let nombre:any = this.paterno.toLowerCase()+" "+this.materno.toLowerCase()+" "+this.nombres.toLowerCase();
    if (nombre == this.emp_name_razon_social.toLowerCase()) {
      this.validator.correctoInput(txt_paterno,"Apellido Paterno");
      this.validator.correctoInput(txt_materno,"Apellido Materno");
      this.validator.correctoInput(txt_nombres,"Nombre(s)");
    } else {
      this.validator.errorInput(txt_paterno,"Inserta Apellido Paterno");
      this.validator.errorInput(txt_materno,"Inserta Apellido Materno");
      this.validator.errorInput(txt_nombres,"Inserta Nombre(s)");
    }
  }

  keyupPaterno(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.paterno = event.value;
      this.validator.correctoInput(event,"Apellido paterno");
      this.verificaEmpIguales();
    } else {
      this.paterno = "";
      this.validator.errorInput(event,"Error en apellido paterno");
    }
    this.validateAllPersonales();
  }

  keyupMaterno(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.materno = event.value;
      this.validator.correctoInput(event,"Apellido Materno");
      this.verificaEmpIguales();
    } else {
      this.materno = "";
      this.validator.errorInput(event,"Error en apellido materno");
    }
    this.validateAllPersonales();
  }

  keyupNombres(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3) {
      this.nombres = event.value;
      this.validator.correctoInput(event,"Nombre(s)");
      this.verificaEmpIguales();
    } else {
      this.nombres = "";
      this.validator.errorInput(event,"Error en nombre(s)");
    }
    this.validateAllPersonales();
  }

  keyupRSocial(event:any){
    if (event.value != "" && event.value.length >= 3 && this.validator.strFilEmp(event.value) == true && event.value.toLowerCase() == this.emp_name_razon_social.toLowerCase()) {
      this.razon_social = event.value;
      this.validator.correctoInput(event,"Empresa");
    } else {
      this.razon_social = "";
      this.validator.errorInput(event,"Error en empresa");
    }
    this.validateAllPersonales();
  }

  keyupAbrev(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length == 3) {
      this.abrev = event.value;
      this.validator.correctoInput(event,"Abreviación");
    } else {
      this.abrev = "";
      this.validator.errorInput(event,"Error en abreviación");
    }
  }

  keyupComercialName(event:any){
    if (event.value != "" && this.validator.strFilEmp(event.value) == true) {
      this.comercial_nombre = event.value;
      this.validator.correctoInput(event,"Nombre comercial");
    } else {
      this.comercial_nombre = "";
      this.validator.errorInput(event,"Error en nombre comercial");
    }
    this.validateAllPersonales();
  }

  keyupCurp(event:any){ //txt_curp
    if (this.v_clasificacion_emp == "nacional") {
      if (event.value != "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length == 18) {
        this.curp = event.value;
        this.validator.correctoInput(event,"CURP");
      } else {
        this.curp = "";
        this.validator.errorInput(event,"Error en CURP");
      }
    } else {
      if (event.value === "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length >= 40) {
        this.curp = event.value;
        this.validator.correctoInput(event,"ID Tax");
      } else {
        this.curp = "";
        this.validator.errorInput(event,"IDTax invalido");
      }
    }
    this.validateAllPersonales();
  }

  changePais(event:any){
    if (event.value != "") {
      for (let i = 0; i < this.lista_paises.length; i++) {
        const country = this.lista_paises[i];
        if (country["token_pais"] == event.value) {
          this.validator.correctoSelect(event,"Pais");
          this.paistoken = event.value;
        }
      }
    } else {
      this.validator.errorSelect(event,"Seleccione un pais");
    }
    this.validateAllPersonales();
  }

  changeSitioWeb(event:any){
    if (event.value != "" && this.validator.filtroUrl("https://"+event.value) == true) {
      this.sitio_web = event.value;
      this.validator.correctoInput(event,"Sitio Web");
    } else {
      this.sitio_web = "";
      this.validator.errorInput(event,"Sitio web invalido");
    }
    this.validateAllPersonales();
  }

  changeRegimenFiscal(event:any){
    if (event.value != "") {
      for (let i = 0; i < this.AllRegFisArray.length; i++) {
        const row = this.AllRegFisArray[i];
        if (row["token_regimen_fiscal"] == event.value) {
          this.validator.correctoSelect(event,"Regimen fiscal");
          this.tknRegimenFiscal = row["token_regimen_fiscal"];
        }
      }
    } else {
      this.validator.errorSelect(event,"Seleccione regimen fiscal");
    }
    this.validateAllPersonales();
  }

  validateAllPersonales(){
    var txt_paterno:any = document.getElementById("txt_paterno");
    var txt_materno:any = document.getElementById("txt_materno");
    var txt_nombres:any = document.getElementById("txt_nombres");
    var txt_r_social:any = document.getElementById("txt_r_social");
    var txt_abrev:any = document.getElementById("txt_abrev");
    var txtidtax_reg:any = document.getElementById("txtidtax_reg");
    var txtComercial_name:any = document.getElementById("txtComercial_name");
    var txt_curp:any = document.getElementById("txt_curp");
    var sel_pais:any = document.getElementById("sel_pais");
    var txt_sitio_web:any = document.getElementById("txt_sitio_web");
    var selRegimenFiscal:any = document.getElementById("selRegimenFiscal");

    if (this.v_subclasificacion_emp == "empresaFisica") {
      if ((this.paterno != "" && this.validator.strFilter(this.paterno) == true && this.paterno.length >= 4) &&
        (this.materno != "" && this.validator.strFilter(this.materno) == true && this.materno.length >= 4) &&
        (this.nombres != "" && this.validator.strFilter(this.nombres) == true && this.nombres.length >= 3) &&
        (this.abrev != "" && this.validator.strFilter(this.abrev) == true && this.abrev.length == 3)) {

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

      } else {
        this.validatePersonales = false;
        if (this.paterno == "" || this.validator.strFilter(this.paterno) == false || this.paterno.length < 4){
          this.validator.errorInput(txt_paterno,"Error en apellido paterno");
        }
        if (this.materno == "" || this.validator.strFilter(this.materno) == false || this.materno.length < 4){
          this.validator.errorInput(txt_materno,"Error en apellido materno");
        }
        if (this.nombres == "" || this.validator.strFilter(this.nombres) == false || this.nombres.length < 3){
          this.validator.errorInput(txt_nombres,"Error en nombre(s)");
        }
        if (this.abrev == "" && this.validator.strFilter(this.abrev) == false && this.abrev.length != 3) {
          this.validator.errorInput(txt_abrev,"Error en abreviación");
        }
        //if (this.tknRegimenFiscal == ""){
        //  this.validator.errorSelect(selRegimenFiscal,"Seleccione regimen fiscal");
        //}
      }
    }
    if (this.v_subclasificacion_emp == "empresaMoral") {
      if (this.razon_social != "" && this.validator.strFilEmp(this.razon_social) == true && this.abrev != "" && this.validator.strFilter(this.abrev) == true && this.abrev.length == 3) {
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
      } else {
        this.validatePersonales = false;
        if (this.razon_social == "" && this.validator.strFilEmp(this.razon_social) == false && this.tknRegimenFiscal != "") {
          this.validator.errorInput(txt_r_social,"ingresa nombre de empresa");
        }
        if (this.abrev == "" && this.validator.strFilter(this.abrev) == false && this.abrev.length != 3) {
          this.validator.errorInput(txt_abrev,"Error en abreviación");
        }
        //if (this.tknRegimenFiscal == "") { && this.tknRegimenFiscal != ""
        //  this.validator.errorSelect(selRegimenFiscal,"Seleccione regimen fiscal");
        //}
      }
    }
    console.log(this.validatePersonales);
  }

//forma de pago
//ubicacion
  //extranjera
  keyupUbicaciontxtCodPostalExt(event:any) {
    if (event.value != "" && this.validator.filtroDom(event.value) == true) {
      this.cod_postal = event.value;
      this.validator.correctoInputRow(event);
      this.validateUbicacion = true;
    } else {
      this.cod_postal = "";
      this.validator.errorInputRow(event);
      this.validateUbicacion = true;
    }
  }

//nacional
  keyupCPostal_EstName(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.new_cod_postal_estado_name = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.new_cod_postal_estado_name = "";
    }
    this.validatecPostal();
  }

  keyupCPostal_Municipio(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.new_cod_postal_municipio = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.new_cod_postal_municipio = "";
    }
    this.validatecPostal();
  }

  keyupCPostal_CP(event:any){
    if (event.value != "" && this.validator.filtroNum(event.value) == true && event.value.length == 5) {
      this.validator.correctoInputRow(event);
      this.new_cod_postal_cp = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.new_cod_postal_cp = "";
    }
    this.validatecPostal();
  }

  keyupCPostal_Colonia(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.new_cod_postal_colonia_vinculada = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.new_cod_postal_colonia_vinculada = "";
    }
    this.validatecPostal();
  }

  validatecPostal(){
    if ((this.new_cod_postal_estado_name != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_estado_name) == true) &&
      (this.new_cod_postal_municipio != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_municipio) == true) &&
      (this.new_cod_postal_cp != "" && this.validator.filtroNum(this.new_cod_postal_cp) == true && this.new_cod_postal_cp.length == 5) &&
      (this.new_cod_postal_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_colonia_vinculada) == true)) {
      this.validaCPNew = true;
    } else {
      this.validaCPNew = false;
      if (this.new_cod_postal_estado_name == "" || this.validator.filtroAlfaNumerico(this.new_cod_postal_estado_name) == false) {
        this.validator.errorInputRow(document.getElementById("newDipoMexEstado"));
      }

      if (this.new_cod_postal_municipio == "" || this.validator.filtroAlfaNumerico(this.new_cod_postal_municipio) == false) {
        this.validator.errorInputRow(document.getElementById("newDipoMexMunicipio"));
      }

      if (this.new_cod_postal_cp == "" || this.validator.filtroNum(this.new_cod_postal_cp) == false || this.new_cod_postal_cp.length != 5) {
        this.validator.errorInputRow(document.getElementById("newDipoMexCP"));
      }

      if (this.new_cod_postal_colonia_vinculada == "" || this.validator.filtroAlfaNumerico(this.new_cod_postal_colonia_vinculada) == false) {
        this.validator.errorInputRow(document.getElementById("newDipoMexColonia"));
      } 
    }
  }

  addListPostal(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar la dirección registrada?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, agregar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if ((this.new_cod_postal_estado_name != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_estado_name) == true) &&
          (this.new_cod_postal_municipio != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_municipio) == true) &&
          (this.new_cod_postal_cp != "" && this.validator.filtroNum(this.new_cod_postal_cp) == true && this.new_cod_postal_cp.length == 5) &&
          (this.new_cod_postal_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_colonia_vinculada) == true)) {
          //
          this.listnewdireccionNac.push({"estado":this.new_cod_postal_estado_name,"municipio":this.new_cod_postal_municipio,"codigo_postal":this.new_cod_postal_cp,"colonia":this.new_cod_postal_colonia_vinculada});
          this.validateUbicacion = true;
          this.validaCPNew = false;

          this.validator.limpiaInputRow(document.getElementById("newDipoMexEstado"));
          this.validator.limpiaInputRow(document.getElementById("newDipoMexMunicipio"));
          this.validator.limpiaInputRow(document.getElementById("newDipoMexCP"));
          this.validator.limpiaInputRow(document.getElementById("newDipoMexColonia"));
          this.new_cod_postal_estado_name = "";
          this.new_cod_postal_municipio = "";
          this.new_cod_postal_cp = "";
          this.new_cod_postal_colonia_vinculada = "";

        } else {
          this.validateUbicacion = false;
          if (this.new_cod_postal_estado_name == "" || this.validator.filtroAlfaNumerico(this.new_cod_postal_estado_name) == false) {
            this.validator.errorInputRow(document.getElementById("newDipoMexEstado"));
          }
        
          if (this.new_cod_postal_municipio == "" || this.validator.filtroAlfaNumerico(this.new_cod_postal_municipio) == false) {
            this.validator.errorInputRow(document.getElementById("newDipoMexMunicipio"));
          }
        
          if (this.new_cod_postal_cp == "" || this.validator.filtroNum(this.new_cod_postal_cp) == false || this.new_cod_postal_cp.length != 5) {
            this.validator.errorInputRow(document.getElementById("newDipoMexCP"));
          }
        
          if (this.new_cod_postal_colonia_vinculada == "" || this.validator.filtroAlfaNumerico(this.new_cod_postal_colonia_vinculada) == false) {
            this.validator.errorInputRow(document.getElementById("newDipoMexColonia"));
          } 
        }
      }
    });
  }

  deleteListCPostal(posicion:any){
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
        this.listnewdireccionNac.splice(posicion,1);
        if (this.listnewdireccionNac.length == 0) {
          this.validateUbicacion = false;
        }
      }
    });
  }

//funciones de registro
  solicitaRegistroEmpresa(){
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
            this.paterno,
            this.materno,
            this.nombres,
            this.abrev,
            this.razon_social,
            this.comercial_nombre,
            this.curp,
            //this.paistoken,
            //this.sitio_web,
            //this.tknRegimenFiscal,
            //this.cod_postal,
            //this.dipomex_cod_postal_estado,
            //this.dipomex_cod_postal_municipio,
            //this.dipomex_cod_postal_cp,
            //this.dipomex_cod_postal_colonia_vinculada,
            //this.listnewdireccionNac,
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
                this.lista_general_empresas();
                this.comeBackPrincipalMenu();
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

  //usuarios
  creaPaternoUsuario(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.validator.correctoInputRow(event);
      this.new_user_paterno = event.value;
    } else {
      this.new_user_paterno = "";
      this.validator.errorInputRow(event);
    }
  }

  creaMaternoUsuario(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.validator.correctoInputRow(event);
      this.new_user_materno = event.value;
    } else {
      this.new_user_materno = "";
      this.validator.errorInputRow(event);
    }
    this.enableBtnRegistroUsuario();
  }

  creaNombresUsuario(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3) {
      this.validator.correctoInputRow(event);
      this.new_user_nombres = event.value;
    } else {
      this.new_user_nombres = "";
      this.validator.errorInputRow(event);
    }
    this.enableBtnRegistroUsuario();
  }

  creaEmailUsuario(event:any){
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
      this.new_user_email = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.new_user_email = "";
      this.validator.errorInputRow(event);
    }
    this.enableBtnRegistroUsuario();
  }

  selectAreasUsuario(event:any){
    if (event.value != "") {
      for (let i = 0; i < this.list_areas_user.length; i++) {
        const area = this.list_areas_user[i];
        if (area["token_area"] == event.value) {
          this.list_cargos_user = area["cargos"];
          this.new_user_area = area["token_area"];
          this.validator.correctoSelectBrowser(event);
        }
      }
    } else {
      this.validator.errorSelectBrowser(event);
    }
    this.enableBtnRegistroUsuario();
  }

  selectCargoUsuario(token_area:any,event:any){
    if (event.value != "") {
      for (let a = 0; a < this.list_areas_user.length; a++) {
        const area = this.list_areas_user[a];
        if (area["token_area"] == token_area) {
          for (let c = 0; c < area["cargos"].length; c++) {
            const carg = area["cargos"][c];
            if (carg["cargo_tkn"] == event.value) {
              this.new_user_cargo = carg["cargo_tkn"];
              this.validator.correctoSelectBrowser(event);
            }
          }
        }
      }
    } else {
      this.validator.errorSelectBrowser(event);
    }
    this.enableBtnRegistroUsuario();
  }

  selectEmpresaUsuario(event:any,emp_token:any){
    if (event.checked == true) {
      for (let e = 0; e < this.list_empresas_user.length; e++) {
        const emp = this.list_empresas_user[e];
        if (emp["emp_token"] == emp_token) {
          emp["selected"] = true;
          this.new_user_bool_emp = true;
        }
      }
    } else {
      for (let e = 0; e < this.list_empresas_user.length; e++) {
        const emp = this.list_empresas_user[e];
        if (emp["emp_token"] == emp_token) {
          emp["selected"] = false;
          this.selectBoolEmpUsuario();
        }
      }
    }
    this.enableBtnRegistroUsuario();
  }

  selectBoolEmpUsuario(){
    var counter = 0;
    for (let e = 0; e < this.list_empresas_user.length; e++) {
      const emp = this.list_empresas_user[e];
      if (emp["selected"] == false) {
        ++counter;
      }
    }
    if (counter == this.list_empresas_user.length) {
      this.new_user_bool_emp = false;
    }
    this.enableBtnRegistroUsuario();
  }

  enableBtnRegistroUsuario() {
    var textuser_paterno:any = document.getElementById("user_paterno");
    var textuser_materno:any = document.getElementById("user_materno");
    var textuser_nombres:any = document.getElementById("user_nombres");
    var textuser_email:any = document.getElementById("user_email");
    var menuuser_area:any = document.getElementById("user_area");
    var menuuser_cargo:any = document.getElementById("user_cargo");

    if ((this.new_user_paterno != '' && this.validator.strFilter(this.new_user_paterno) == true && this.new_user_paterno.length >= 4) &&
      (this.new_user_materno != '' && this.validator.strFilter(this.new_user_materno) == true && this.new_user_materno.length >= 4) &&
      (this.new_user_nombres != '' && this.validator.strFilter(this.new_user_nombres) == true && this.new_user_nombres.length >= 3) &&
      (this.new_user_email != '' && this.validator.filtroCorreo(this.new_user_email) == true) && 
      this.new_user_bool_emp == true && this.new_user_area != "" && this.new_user_cargo != "") {
        //this.validaMailTelContacto();
      this.valida_registro_usuario = true;
    } else {
      this.valida_registro_usuario = false;
      if(this.new_user_paterno == '' || this.validator.strFilter(this.new_user_paterno) == false || this.new_user_paterno.length < 4){
        this.validator.errorInputRow(textuser_paterno);
      }
      if(this.new_user_materno == '' || this.validator.strFilter(this.new_user_materno) == false || this.new_user_materno.length < 4){
        this.validator.errorInputRow(textuser_materno);
      }
      if(this.new_user_nombres == '' || this.validator.strFilter(this.new_user_nombres) == false || this.new_user_nombres.length < 3){
        this.validator.errorInputRow(textuser_nombres);
      }
      if(this.new_user_email == '' || this.validator.filtroCorreo(this.new_user_email) == false){
        this.validator.errorInputRow(textuser_email);
      }
      if(this.new_user_bool_emp == false){
        
      }
      if(this.new_user_area == ""){
        this.validator.errorSelectBrowser(menuuser_area);
      }
      if(this.new_user_cargo == ""){
        this.validator.errorSelectBrowser(menuuser_cargo);
      }
    }
  }

  registraUsuario(){
    var textuser_paterno:any = document.getElementById("user_paterno");
    var textuser_materno:any = document.getElementById("user_materno");
    var textuser_nombres:any = document.getElementById("user_nombres");
    var textuser_email:any = document.getElementById("user_email");
    var menuuser_area:any = document.getElementById("user_area");
    var menuuser_cargo:any = document.getElementById("user_cargo");

    if ((this.new_user_paterno != '' && this.validator.strFilter(this.new_user_paterno) == true && this.new_user_paterno.length >= 4) &&
      (this.new_user_materno != '' && this.validator.strFilter(this.new_user_materno) == true && this.new_user_materno.length >= 4) &&
      (this.new_user_nombres != '' && this.validator.strFilter(this.new_user_nombres) == true && this.new_user_nombres.length >= 3) &&
      (this.new_user_email != '' && this.validator.filtroCorreo(this.new_user_email) == true) && 
      this.new_user_bool_emp == true && this.new_user_area != "" && this.new_user_cargo != "") {
        //this.validaMailTelContacto();
    } else {
      if(this.new_user_paterno == '' || this.validator.strFilter(this.new_user_paterno) == false || this.new_user_paterno.length < 4){
        this.validator.errorInputRow(textuser_paterno);
      }
      if(this.new_user_materno == '' || this.validator.strFilter(this.new_user_materno) == false || this.new_user_materno.length < 4){
        this.validator.errorInputRow(textuser_materno);
      }
      if(this.new_user_nombres == '' || this.validator.strFilter(this.new_user_nombres) == false || this.new_user_nombres.length < 3){
        this.validator.errorInputRow(textuser_nombres);
      }
      if(this.new_user_email == '' || this.validator.filtroCorreo(this.new_user_email) == false){
        this.validator.errorInputRow(textuser_email);
      }
      if(this.new_user_bool_emp == false){
        
      }
      if(this.new_user_area == ""){
        this.validator.errorSelectBrowser(menuuser_area);
      }
      if(this.new_user_cargo == ""){
        this.validator.errorSelectBrowser(menuuser_cargo);
      }
    }
  }

  //cambios en permisos para usuarios
  updatePaternoPers(event:any,token_personal:any){
    //if (event.value === '') {
    //  this.validator.errorInput(event,'Inserta Apellido Paterno');
    //} else {
    //  if (this.validator.strFilter(event.value) == false) {
    //    this.validator.errorInputRow(event);
    //  } else {
    //    if (event.value.length <3) {
    //      this.validator.errorInputRow(event);
    //    } else {
    //      this.validator.correctoInputRow(event);
    //      this.trab_serv.actualizaPaternoPers(event.value,token_personal).subscribe(
    //        response => {
    //          if (response.status == 'success') {
    //            this.listaPersonal();
    //          }
    //        }, error => {console.log(error);}
    //      );
    //    }
    //  }
    //}
  }

  updateMaternoPers(event:any,token_personal:any){
    //if (event.value === '') {
    //  this.validator.errorInputRow(event);
    //} else {
    //  if (this.validator.strFilter(event.value) == false) {
    //    this.validator.errorInputRow(event);
    //  } else {
    //    if (event.value.length <3) {
    //      this.validator.errorInputRow(event);
    //    } else {
    //      this.validator.correctoInputRow(event);
    //      this.trab_serv.actualizaMaternoPers(event.value,token_personal).subscribe(
    //        response => {
    //          if (response.status == 'success') {
    //            this.listaPersonal();
    //          }
    //        }, error => {console.log(error);}
    //      );
    //    }
    //  }
    //}
  }

  updateNombresPers(event:any,token_personal:any){
    //if (event.value === '') {
    //  this.validator.errorInputRow(event);
    //} else {
    //  if (this.validator.strFilter(event.value) == false) {
    //    this.validator.errorInputRow(event);
    //  } else {
    //    if (event.value.length <3) {
    //      this.validator.errorInputRow(event);
    //    } else {
    //      this.validator.correctoInputRow(event);
    //      this.trab_serv.actualizaNombresPers(event.value,token_personal).subscribe(
    //        response => {
    //          if (response.status == 'success') {
    //            this.listaPersonal();
    //          }
    //        }, error => {console.log(error);}
    //      );
    //    }
    //  }
    //}
  }

  updateMailPers(event:any,token_personal:any){
    //if (event.value != "" && this.validator.filtroCorreo(event.value) == true) {
    //  this.validator.correctoInputRow(event);
    //  this.trab_serv.actualizaEmail(event.value,this.encryptor.santoEncryptCode(event.value),token_personal).subscribe(
    //    response => {
    //      if (response.status == 'success') {
    //        this.listaPersonal();
    //      }
    //    }, error => {console.log(error);}
    //  );
    //} else {
    //  this.validator.errorInputRow(event);
    //}
  }

  registraTelefono(event:any,token_personal:any){
    //if (event.value != "" && /^[0-9]+$/.test(event.value) && event.value.length == 10) {
    //  this.validator.correctoInputRow(event);
    //  this.trab_serv.registraTelefono(event.value,token_personal).subscribe(
    //    response => {
    //      if (response.status == 'success') {
    //        this.listaPersonal();
    //      }
    //    }, error => {console.log(error);}
    //  );
    //} else {
    //  this.validator.errorInputRow(event);
    //}
  }

  updateTelefono(event:any,token_personal:any,token_telefono:any){
    //if (event.value != "" && /^[0-9]+$/.test(event.value) && event.value.length == 10) {
    //  this.validator.correctoInputRow(event);
    //  this.trab_serv.updateTelefono(event.value,token_personal,token_telefono).subscribe(
    //    response => {
    //      if (response.status == 'success') {
    //        this.listaPersonal();
    //      }
    //    }, error => {console.log(error);}
    //  );
    //} else {
    //  this.validator.errorInputRow(event);
    //}
  }

  updateAreaPers(event:any,token_personal:any){
    //if (event.value != "" && this.validator.filtroCorreo(event.value) == true) {
    //  this.trab_serv.actualizaEmail(event.value,this.encryptor.santoEncryptCode(event.value),token_personal).subscribe(
    //    response => {
    //      if (response.status == 'success') {
    //        this.listaPersonal();
    //      }
    //    }, error => {console.log(error);}
    //  );
    //} else {
    //  this.validator.errorInputRow(event);
    //}
  }

  generaCodigosAccessAndPass(token_personal:any){
    console.log("prueba"+token_personal);
    for (let i = 0; i < this.usuariosList.length; i++){
      const user = this.usuariosList[i];
      if (user['token_personal'] == token_personal) {
        var possible_letter = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        var possible_char = '.,#$%&/()=';
        var stringDataCode = token_personal+user['paterno']+user['materno']+user['nombres']+user['email']+"code_access";
        var primerDataCode = this.encryptor.santoEncryptCode(stringDataCode).substring(0, 7);
        for (let a = 0; a < 1; a++){
          primerDataCode = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length))+primerDataCode;
        }
        var segundaDataCode = this.encryptor.santoEncryptCode(primerDataCode);

        var stringDataPass = token_personal+Math.random()+user['paterno']+user['email']+user['nombres']+"password"+user['materno'];
        var primerDataPass = this.encryptor.santoEncryptPass(stringDataPass).substring(0, 8);
        for (let i = 0; i < 2; i++){
          primerDataPass = primerDataPass+possible_char.charAt(Math.floor(Math.random() * possible_char.length));
        }
        for (let j = 0; j < 1; j++){
          primerDataPass = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length))+primerDataPass;
        }
        var segundaDataPass = this.encryptor.santoEncryptPass(primerDataPass);
        console.log(primerDataCode);
        console.log(primerDataPass);

      }
    }
  }

  revocarCodigosAccessAndPass(user_token:any){console.log("user_token "+user_token);}
}
