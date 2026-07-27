import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
//const messaging = getMessaging();
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { provRfcTipoModelo } from '../../../../../modelos/provRfcTipoModelo';
import { InterfPais } from '../../../../../interfaces/interf-pais';
import { PaisService } from '../../../../../servicios/ssic/pais.service';
import { RegimenFiscalService } from '../../../../../servicios/regimen-fiscal.service';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app_terc_prov_registro',
  templateUrl: './terc_prov_registro.component.html',
  standalone: false,
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
    //'../../../terceros.component.css',
    '../../egresos.css',
    './terc_prov_registro.component.css'
  ]
})
export class TercProvRegistroComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  AllRegFisArray: any = [];
  PfAllRegFisArray: any = [];
  PmAllRegFisArray: any = [];
  pageAltaPostales: number = 1;
  public provModelo: provRfcTipoModelo;
  arraYpais: InterfPais[] = [];
  arrayMonedas: any = [];

  public validateRfcExtBool: boolean = true;
  public validateIdTaxBool: boolean = true;
  public validateFoundProv: boolean = false;

  public vClasificacionProv: string = "";
  public vSubClasificacionProv: string = "";
  public validatePersonales: boolean = false;
  public validateUbicacion: boolean = false;

  public paterno: string = "";
  public materno: string = "";
  public nombres: string = "";
  public razon_social: string = "";
  public comercial_nombre: string = "";
  public curp: string = "";
  public sitio_web: string = "";
  public paistoken: string = "";
  public tknRegimenFiscal: string = "";

  public cuenta_contable: string = "";
  public decisionEditNombre: boolean = false;

  public rfcGenericoPF: string = "xaxx010101000";
  public rfcGenericoPM: string = "xax010101000";
  public rfcGenericoExt: string = "xexx010101000";

  public cod_postal: string = "";
  public dipomex_cod_postal_estado: string = "---";
  public dipomex_cod_postal_municipio: string = "---";
  public dipomex_cod_postal_cp: string = "---";
  public dipomex_cod_postal_colonias: any = [];
  public dipomex_cod_postal_colonia_vinculada: string = "";
  public new_cod_postal_estado_name: string = "---";
  public new_cod_postal_estado_abrev: string = "---";
  public new_cod_postal_municipio: string = "---";
  public new_cod_postal_cp: string = "---";
  public new_cod_postal_colonia_vinculada: string = "";
  listnewdireccionNac: any = [];
  options = {};

  constructor(
    private sentinela: SentinelArkManager,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private _provServ: ProveedoresService,
    private _pais: PaisService,
    private _regimen: RegimenFiscalService,
    private dirServ: DireccionesService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.provModelo = new provRfcTipoModelo("", "", "", "", "", "", "", "", "");
  }

  ngOnInit(): void {
  }

  getListaPais() {
    this._pais.getListaPais().subscribe((data: InterfPais[]) => {
      this.arraYpais = data;
      console.log(this.arraYpais);
    });
  }

  getAllRegimenFiscal() {
    this._regimen.getAllRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.AllRegFisArray = data.listRegFisc;
        console.log(this.AllRegFisArray);
      }
    });
  }

  getPfRegimenFiscal() {
    this._regimen.getPfRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PfAllRegFisArray = data.listRegFisc;
        console.log(this.PfAllRegFisArray);
      }
    });
  }

  getPmRegimenFiscal() {
    this._regimen.getPmRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PmAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PmAllRegFisArray);
    });
  }

  buscaCodPostalDipomex(event: any) {
    if (event.value != "" && event.value.length == 5) {
      this.validator.correctoInputRow(event);
      this.dipomex_cod_postal_colonias.length = 0;
      this.dipomex_cod_postal_estado = "";
      this.dipomex_cod_postal_municipio = "";
      this.dipomex_cod_postal_cp = "";
      this.dipomex_cod_postal_colonia_vinculada = "";

      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.dipomex_cod_postal_estado = response.cod_postal["estado"] + " (" + response.cod_postal["estado_abreviatura"] + ")";
            this.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
            this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
            if (response.cod_postal["colonias"].length == 1) {
              this.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
              this.validateUbicacion = true;
            } else {
              this.validateUbicacion = false;
            }
          } else {
            this.validateUbicacion = false;
            Swal.fire({ position: "top-end", icon: "warning", title: this.translate.instant(response.message), showConfirmButton: false, timer: 3000 })
            if (response.message == "postal_empty") {
              this.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
              this.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
              this.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
            }
          }
        },
        error => {
          //console.log(error);
        }
      )
    } else {
      this.validator.errorInputRow(event)
    }
  }

  seleccionaColoniaCPDipomex(colonia_name: any) {
    if (colonia_name != "") {
      for (let i = 0; i < this.dipomex_cod_postal_colonias.length; i++) {
        if (this.dipomex_cod_postal_colonias[i] == colonia_name) {
          this.dipomex_cod_postal_colonia_vinculada = colonia_name;
          this.validateUbicacion = true;
        }
      }
    } else {
      this.validateUbicacion = false;
    }
  }

  tipoNacionalidadSelectProv(event: any, tipoProv: any, subtipoProv: any, botonAction: any) {
    $("#nacFisBtn").removeClass("active_chip");
    $("#nacMorBtn").removeClass("active_chip");
    $("#extFisBtn").removeClass("active_chip");
    $("#extMorBtn").removeClass("active_chip");

    $("#nacFisBtn").prop("disabled", false);
    $("#nacMorBtn").prop("disabled", false);
    $("#extFisBtn").prop("disabled", false);
    $("#extMorBtn").prop("disabled", false);

    $("#" + botonAction).addClass("active_chip");
    $("#" + botonAction).prop("disabled", true);

    if (tipoProv == "nacional") {
      this.vClasificacionProv = "nacional";
      this.provModelo.tipoProv = "nacional";
      if (subtipoProv == "provFisica") {
        this.vSubClasificacionProv = "provFisica";
        this.provModelo.subtipoProv = "provFisica";
        this.provModelo.rfc_generico = this.rfcGenericoPF;
      }

      if (subtipoProv == "provMoral") {
        this.vSubClasificacionProv = "provMoral";
        this.provModelo.subtipoProv = "provMoral";
        this.provModelo.rfc_generico = this.rfcGenericoPM;
      }
    }
    if (tipoProv == "extranjero") {
      this.vClasificacionProv = "extranjero";
      this.provModelo.tipoProv = "extranjero";
      this.provModelo.rfc_generico = this.rfcGenericoExt;
      if (subtipoProv == "provFisica") {
        this.vSubClasificacionProv = "provFisica";
        this.provModelo.subtipoProv = "provFisica";
      }

      if (subtipoProv == "provMoral") {
        this.vSubClasificacionProv = "provMoral";
        this.provModelo.subtipoProv = "provMoral";
      }
    }
    //this.provModelo.subtipoProv = "";
    this.provModelo.rfc = "";
    this.provModelo.id_tax = "";
    this.provModelo.name_prov = "";
  }

  especificacionesInputRfcProv() {
    let switchCheckSubTipoProv: any = document.getElementById("switchCheckSubTipoProv");
    let backSubTipoProv: any = document.getElementById("backSubTipoProv");
    if (this.provModelo.tipoProv != "" && this.provModelo.subtipoProv != "") {
      $(switchCheckSubTipoProv).removeAttr("disabled");
      $(backSubTipoProv).removeAttr("disabled");
      if (this.provModelo.tipoProv == "nacional") {
        if (this.provModelo.subtipoProv == "provFisica") {
          $("#lbl_proveedor").html("Escriba su rfc con Homoclave (13 caracteres Ej. ABCD000000XXX)");
          $("#verif_rfcProv").attr("data-length", "13");
          $("#verif_rfcProv").attr("placeholder", "Ej. ABCD000000XXX");
          $("#verif_rfcProv").attr("maxlength", "13");
        }
        if (this.provModelo.subtipoProv == "provMoral") {
          $("#lbl_proveedor").html("");
          $("#verif_rfcProv").attr("data-length", "12");
          $("#verif_rfcProv").attr("placeholder", "Ej. ABC000000XXX");
          $("#verif_rfcProv").attr("maxlength", "12");
        }
      }
      if (this.provModelo.tipoProv == "extranjero") {

      }
      $("#btnBuscaProvDB").removeClass("noneView");
    }
  }

  keyupverif_rfcProv(event: any) {
    if (event.value != "") {
      if (this.vSubClasificacionProv == "provFisica") {
        var cdna1 = event.value.substring(0, 4);
        var cdna2 = event.value.substring(4, 10);
        var cdna3 = event.value.substring(10, 13);
        if (/^[a-zA-Z]+$/.test(cdna1)) {
          if (/^[0-9]+$/.test(cdna2)) {
            if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 13) {
              this.validator.correctoInput(event, "Escriba su rfc con Homoclave");
              this.provModelo.rfc = event.value;
            } else {
              this.validator.errorInput(event, "rfc del proveedor no es correcto");
              this.provModelo.rfc = "";
            }
          } else {
            this.validator.errorInput(event, "rfc del proveedor no es correcto");
            this.provModelo.rfc = "";
          }
        } else {
          this.validator.errorInput(event, "rfc del proveedor no es correcto");
          this.provModelo.rfc = "";
        }
      }
      if (this.vSubClasificacionProv == "provMoral") {
        var cdna1 = event.value.substring(0, 3);
        var cdna2 = event.value.substring(3, 9);
        var cdna3 = event.value.substring(9, 12);
        if (/^[a-zA-Z]+$/.test(cdna1)) {
          if (/^[0-9]+$/.test(cdna2)) {
            if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 12) {
              this.validator.correctoInput(event, "Escriba su rfc con Homoclave");
              this.provModelo.rfc = event.value;
            }
            else {
              this.validator.errorInput(event, "rfc del proveedor no es correcto");
              this.provModelo.rfc = "";
            }
          }
          else {
            this.validator.errorInput(event, "rfc del proveedor no es correcto");
            this.provModelo.rfc = "";
          }
        }
        else {
          this.validator.errorInput(event, "rfc del proveedor no es correcto");
          this.provModelo.rfc = "";
        }
      }
    } else {
      if (this.vSubClasificacionProv == "provFisica") {
        this.provModelo.rfc = "";
        this.validator.errorInput(event, "Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
      }
      if (this.vSubClasificacionProv == "provMoral") {
        this.provModelo.rfc = "";
        this.validator.errorInput(event, "Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
      }
    }
  }

  keyupverif_rfcExtProv(event: any) {
    if (event.value != "" && this.validator.strFilter(event.value) == true) {
      this.validator.correctoInput(event, "Escriba su rfc");
      this.validateRfcExtBool = true;
      this.provModelo.rfc = event.value;
    } else {
      this.provModelo.rfc = "";
      this.validateRfcExtBool = false;
      this.validator.errorInput(event, "Rfc incorrecto");
    }
  }

  keyupverif_TaxIdProv(event: any) {
    if (event.value != "") {
      if (event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value) == true) {
        this.validator.correctoInput(event, "Escriba Tax ID del proveedor");
        this.validateIdTaxBool = true;
        this.provModelo.id_tax = event.value;
      } else {
        this.validator.errorInput(event, "Tax ID del proveedor no es correcto");
        this.validateIdTaxBool = false;
        this.provModelo.id_tax = "";
      }
    } else {
      this.provModelo.id_tax = "";
      this.validateIdTaxBool = false;
      this.validator.errorInput(event, "Tax ID del proveedor no es correcto");
    }
  }

  checkNombreProv(valor: any) {
    if (valor.value === "") {
      this.validator.errorInput(valor, "Ingresa nombre completo / razón social del proveedor");
      this.provModelo.name_prov = "";
    } else {
      if (this.validator.strFilter(valor.value) == false) {
        this.validator.errorInput(valor, "Ingresa nombre completo / razón social del proveedor");
        this.provModelo.name_prov = "";
      } else {
        if (valor.value.length < 4) {
          this.validator.errorInput(valor, "Número de caracteres invalido");
          this.provModelo.name_prov = "";
        } else {
          this.validator.correctoInput(valor, "Nombre completo / razón social del proveedor");
          this.provModelo.name_prov = valor.value;
        }
      }
    }
  }

  funtcBuscaProvDBNac() {
    let verif_rfcProv: any = document.getElementById("verif_rfcProv");
    let verifNameProvidder_reg: any = document.getElementById("verifNameProvidder_reg");

    var frc_novacio: any = "";
    if (this.provModelo.rfc != "") {
      frc_novacio = this.provModelo.rfc;
    } else {
      frc_novacio = this.provModelo.rfc_generico;
    }
    console.log(frc_novacio);
    var cdna1ProvFis = frc_novacio.substring(0, 4);
    var cdna2ProvFis = frc_novacio.substring(4, 10);
    var cdna3ProvFis = frc_novacio.substring(10, 13);
    var cdna1ProvMoral = frc_novacio.substring(0, 3);
    var cdna2ProvMoral = frc_novacio.substring(3, 9);
    var cdna3ProvMoral = frc_novacio.substring(9, 12);

    if (this.vClasificacionProv != "" && this.vSubClasificacionProv != "" && this.vClasificacionProv == "nacional") {
      if (this.vSubClasificacionProv == "provFisica") {
        if (frc_novacio != "" && frc_novacio.length == 13 && this.provModelo.name_prov != "" &&
          this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4 &&
          (/^[a-zA-Z]+$/.test(cdna1ProvFis)) && (/^[0-9]+$/.test(cdna2ProvFis)) && (/^[a-zA-Z0-9]+$/.test(cdna3ProvFis))) {

          this.validator.correctoInput(verif_rfcProv, "Escriba su rfc con Homoclave");
          this.validator.correctoInput(verifNameProvidder_reg, "Nombre completo / razón social del proveedor");
          Swal.fire({
            title: this.translate.instant("swal_attenc"),
            text: "¿Su proveedor es Persona Física?",
            icon: "warning",
            confirmButtonColor: "#388E3C",
            confirmButtonText: "Sí, verificar si se encuentra registrado",
            showCancelButton: true,
            cancelButtonColor: "#D32F2F",
            customClass: {
              popup: 'my-swal-zindex'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              this.validaProvMySQL(this.provModelo.rfc_generico, this.provModelo.rfc, this.provModelo.id_tax, this.provModelo.name_prov);
            }
          });

        } else {
          let error = "";
          if (this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4) {
            this.validator.errorInput(verifNameProvidder_reg, "Ingresa nombre completo / razón social del proveedor");
            error = "Ingresa nombre del proveedor";
          }
          if (this.provModelo.rfc == "") {
            this.validator.errorInput(verif_rfcProv, "Inserta Rfc de su proveedor");
            error = "DEBE REGISTRAR RFC";
          }
          if (this.provModelo.rfc.length != 13) {
            this.validator.errorInput(verif_rfcProv, "Su rfc debe contener 13 caracteres");
            error = "su RFC no es correcto";
          }
          if (!/^[a-zA-Z]+$/.test(cdna1ProvFis) || !/^[0-9]+$/.test(cdna2ProvFis) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvFis)) {
            this.validator.errorInput(verif_rfcProv, "Su rfc debe contener 13 caracteres");
            error = "su RFC no es correcto";
          }
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: error,
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'my-swal-zindex'
            }
          })
        }
      }

      if (this.vSubClasificacionProv == "provMoral") {
        if (frc_novacio != "" && frc_novacio.length == 12 && this.provModelo.name_prov != "" &&
          this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4 &&
          (/^[a-zA-Z]+$/.test(cdna1ProvMoral)) && (/^[0-9]+$/.test(cdna2ProvMoral)) && (/^[a-zA-Z0-9]+$/.test(cdna3ProvMoral))) {

          this.validator.correctoInput(verif_rfcProv, "Escriba su rfc con Homoclave");
          this.validator.correctoInput(verifNameProvidder_reg, "Nombre completo / razón social del proveedor");
          Swal.fire({
            title: this.translate.instant("swal_attenc"),
            text: "¿Su proveedor es Persona Moral?",
            icon: "warning",
            confirmButtonColor: "#388E3C",
            confirmButtonText: "Sí, verificar si se encuentra registrado",
            showCancelButton: true,
            cancelButtonColor: "#D32F2F",
            customClass: {
              popup: 'my-swal-zindex'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              this.validaProvMySQL(this.provModelo.rfc_generico, this.provModelo.rfc, this.provModelo.id_tax, this.provModelo.name_prov);
            }
          });
        } else {
          let error = "";
          if (this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4) {
            this.validator.errorInput(verifNameProvidder_reg, "Inserta nombre completo / razón social del proveedor");
            error = "Inserta nombre del proveedor";
          }
          if (this.provModelo.rfc == "") {
            this.validator.errorInput(verif_rfcProv, "Inserta Rfc de su proveedor");
            error = "DEBE REGISTRAR RFC";
          }
          if (this.provModelo.rfc.length != 12) {
            this.validator.errorInput(verif_rfcProv, "Su rfc debe contener 12 caracteres");
            error = "su RFC no es correcto";
          }
          if (!/^[a-zA-Z]+$/.test(cdna1ProvMoral) || !/^[0-9]+$/.test(cdna2ProvMoral) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvMoral)) {
            this.validator.errorInput(verif_rfcProv, "Su rfc debe contener 12 caracteres");
            error = "su RFC no es correcto";
          }
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: error,
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'my-swal-zindex'
            }
          })
        }
      }
    } else {
      if (this.vClasificacionProv == "") {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione proveedor nacional o extranjero",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }

      if (this.vSubClasificacionProv == "") {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione persona física o moral",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }

    }

  }

  funtcBuscaProvDBExt() {
    let verif_rfcProv: any = document.getElementById("verif_rfcProv");
    let verifNameProvidderExt_reg: any = document.getElementById("verifNameProvidderExt_reg");
    let verif_idTaxProv: any = document.getElementById("verif_idTaxProv");
    var cdna1ProvFis = this.provModelo.rfc.substring(0, 4);
    var cdna2ProvFis = this.provModelo.rfc.substring(4, 10);
    var cdna3ProvFis = this.provModelo.rfc.substring(10, 13);
    var cdna1ProvMoral = this.provModelo.rfc.substring(0, 3);
    var cdna2ProvMoral = this.provModelo.rfc.substring(3, 9);
    var cdna3ProvMoral = this.provModelo.rfc.substring(9, 12);

    if (this.vClasificacionProv != "" && this.vSubClasificacionProv != "" && this.vClasificacionProv == "extranjero") {

      if (this.provModelo.rfc == "" && this.provModelo.id_tax == "") {
        if (this.provModelo.rfc_generico != "" && this.provModelo.rfc_generico.length >= 9 && this.provModelo.rfc_generico.length <= 40 &&
          this.provModelo.name_prov != "" && this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4) {
          this.validator.correctoInput(verif_rfcProv, "Escriba su rfc con Homoclave");
          this.validator.correctoInput(verif_idTaxProv, "Escriba su Tax ID con Homoclave");
          this.validator.correctoInput(verifNameProvidderExt_reg, "Nombre completo / razón social del proveedor");
          Swal.fire({
            title: this.translate.instant("swal_attenc"),
            text: "¿Su proveedor es extranjero?",
            icon: "warning",
            confirmButtonColor: "#388E3C",
            confirmButtonText: "Sí, registrar",
            showCancelButton: true,
            cancelButtonColor: "#D32F2F",
            customClass: {
              popup: 'my-swal-zindex'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              this.validaProvMySQL(this.provModelo.rfc_generico, this.provModelo.rfc, this.provModelo.id_tax, this.provModelo.name_prov);
            }
          });
        } else {
          let error = "";
          if (this.provModelo.rfc_generico == "") {
            error = "Debe registrar Tax ID";
          }
          if (this.provModelo.rfc_generico.length < 9 || this.provModelo.rfc_generico.length > 40) {
            error = "su RFC no es correcto";
          }
          if (this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4) {
            this.validator.errorInput(verifNameProvidderExt_reg, "Ingresa nombre completo / razón social del proveedor");
            error = "Ingresa nombre completo / razón social del proveedor";
          }
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: error,
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'my-swal-zindex'
            }
          })
        }
      } else {
        if (this.validateRfcExtBool == true && this.validateIdTaxBool == true) {
          if (this.provModelo.rfc_generico != "" && this.provModelo.rfc_generico.length >= 9 && this.provModelo.rfc_generico.length <= 40 &&
            this.provModelo.name_prov != "" && this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4) {
            this.validator.correctoInput(verif_rfcProv, "Escriba su rfc con Homoclave");
            this.validator.correctoInput(verif_idTaxProv, "Escriba su Tax ID con Homoclave");
            this.validator.correctoInput(verifNameProvidderExt_reg, "Nombre completo / razón social del proveedor");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su proveedor es extranjero?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: "Sí, registrar",
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
              customClass: {
                popup: 'my-swal-zindex'
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaProvMySQL(this.provModelo.rfc_generico, this.provModelo.rfc, this.provModelo.id_tax, this.provModelo.name_prov);
              }
            });
          } else {
            let error = "";
            if (this.provModelo.rfc_generico == "") {
              error = "Debe registrar Tax ID";
            }
            if (this.provModelo.rfc_generico.length < 9 || this.provModelo.rfc_generico.length > 40) {
              error = "su RFC no es correcto";
            }
            if (this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4) {
              this.validator.errorInput(verifNameProvidderExt_reg, "Ingresa nombre completo / razón social del proveedor");
              error = "Ingresa nombre completo / razón social del proveedor";
            }
            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: error,
              showConfirmButton: false,
              timer: 3000,
              customClass: {
                popup: 'my-swal-zindex'
              }
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
            position: "top-end",
            icon: "warning",
            title: error,
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'my-swal-zindex'
            }
          })
        }
      }
    } else {
      if (this.vClasificacionProv == "") {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione proveedor nacional o extranjero",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }

      if (this.vSubClasificacionProv == "") {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione persona física o moral",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }
    }
  }

  validaProvMySQL(rfc_generico: any, rfc: any, id_tax: any, nombre: any) {
    this._provServ.verificaExistsAllProveedor(this.vClasificacionProv, this.vSubClasificacionProv, rfc_generico, rfc, id_tax, nombre).subscribe(
      response => {
        let translate_response = this.translate.instant(response.message);
        if (response.status == "success") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: translate_response,
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              popup: 'my-swal-zindex'
            }
          });
          this.validateFoundProv = true;
          this.provModelo.name_prov = nombre;
          this.provModelo.rfc_back = rfc;
          this.provModelo.id_tax_back = id_tax;
          this.provModelo.name_prov_back = nombre;
          this.getListaPais();
          this.getAllRegimenFiscal();
          this.getPfRegimenFiscal();
          this.getPmRegimenFiscal();
        }
        if (response.status == "error") {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: translate_response,
            showConfirmButton: false,
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
    )
  }

  decideEditarDataProveedor() {
    this.decisionEditNombre = this.decisionEditNombre == false ? true : false;
  }

  validaNewNombreProv(valor: any) {
    const validacion = valor.value != "" && valor.value.length >= 4 && this.validator.strFilter(valor.value) == true && valor.value != this.provModelo.name_prov;
    this.provModelo.name_prov_back = validacion ? valor.value : "";
    validacion ? this.validator.correctoInput(valor, "Nombre completo / razón social del proveedor") : this.validator.errorInput(valor, "Ingresa nombre completo / razón social del proveedor");
  }

  validaNewRfcProv(event: any) {
    if (this.vSubClasificacionProv == "provFisica") {
      const validacion = event.value != "" && this.validator.filtroRfcPersFisica(event.value) && event.value.length == 13;
      this.provModelo.rfc_back = validacion ? event.value : "";
      validacion ? this.validator.correctoInput(event, "Escriba su rfc con Homoclave") : this.validator.errorInput(event, "Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
    }

    if (this.vSubClasificacionProv == "provMoral") {
      const validacion = event.value != "" && this.validator.filtroRfcPersFisica(event.value) && event.value.length == 12;
      this.provModelo.rfc_back = validacion ? event.value : "";
      validacion ? this.validator.correctoInput(event, "Escriba su rfc con Homoclave") : this.validator.errorInput(event, "Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
    }
  }

  validaNewTaxIdProv(event: any) {
    const validacion = event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value);
    this.validateIdTaxBool = validacion ? true : false;
    this.provModelo.id_tax_back = validacion ? event.value : '';
    validacion ? this.validator.correctoInput(event, "Escriba Tax ID del proveedor") : this.validator.errorInput(event, "Tax ID del proveedor no es correcto");
  }

  guardaNew_DataProveedor() {
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
        this._provServ.verificaExistsAllProveedor(this.vClasificacionProv, this.vSubClasificacionProv, this.provModelo.rfc_generico, this.provModelo.rfc_back, this.provModelo.id_tax_back, this.provModelo.name_prov_back).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                  popup: 'my-swal-zindex'
                }
              });
              this.provModelo.name_prov = this.provModelo.name_prov_back;
              this.provModelo.rfc = this.provModelo.rfc_back;
              this.provModelo.id_tax = this.provModelo.id_tax_back;
              this.decisionEditNombre = false;
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
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
        )

      }
    })

  }

  comeBackPrincipalMenu() {
    this.provModelo.tipoProv = "";
    this.provModelo.subtipoProv = "";
    this.provModelo.rfc_generico = "";
    this.provModelo.rfc = "";
    this.provModelo.id_tax = "";
    this.provModelo.name_prov = "";
    this.validateFoundProv = false;
    this.vClasificacionProv = "";
    this.vSubClasificacionProv = "";
    this.rfcGenericoPF = "xaxx010101000";
    this.rfcGenericoPM = "xax010101000";
    this.rfcGenericoExt = "xexx010101000";
    this.validateRfcExtBool = true;
    this.validateIdTaxBool = true;
    this.validatePersonales = false;
    this.validateUbicacion = false;
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
    this.listnewdireccionNac = [];
  }

  keyupComercialName(event: any) {
    const validacion = event.value != "" && this.validator.strFilEmp(event.value);
    this.comercial_nombre = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validateAllPersonales();
  }

  keyupCurp(event: any) { //txt_curp
    if (this.vClasificacionProv == "nacional") {
      const validacion = event.value != "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length == 18;
      this.curp = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    } else {
      const validacion = event.value === "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length >= 40;
      this.curp = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }
    this.validateAllPersonales();
  }

  changePais(event: any) {
    const country = this.arraYpais.find((row: any) => row.token_pais === event.value);
    const validacion = event.value != '' && typeof country !== 'undefined';
    this.paistoken = validacion ? country.token_pais : '';
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
    this.validateAllPersonales();
  }

  changeSitioWeb(event: any) {
    const validacion = event.value != "" && this.validator.filtroUrl("https://" + event.value);
    this.sitio_web = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validateAllPersonales();
  }

  changeRegimenFiscal(event: any) {
    const regfis = this.AllRegFisArray.find((row: any) => row.token_regimen_fiscal === event.value);
    const validacion = event.value != '' && typeof regfis !== 'undefined';
    this.tknRegimenFiscal = validacion ? regfis.token_regimen_fiscal : '';
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
    this.validateAllPersonales();
  }

  keyupValidateCuentaContable(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.cuenta_contable = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validateAllPersonales() {
    var txtComercial_name: any = document.getElementById("txtComercial_name");
    var txt_curp: any = document.getElementById("txt_curp");
    var sel_pais: any = document.getElementById("sel_pais");
    var txt_sitio_web: any = document.getElementById("txt_sitio_web");
    var selRegimenFiscal: any = document.getElementById("selRegimenFiscal");

    if (this.tknRegimenFiscal != "") {
      if (this.provModelo.subtipoProv == "provFisica") {
        if (this.curp == "" && this.comercial_nombre == "" && this.sitio_web == "") {
          if (this.vClasificacionProv == "extranjero") {
            if (this.paistoken != "") {
              this.validatePersonales = true;
            } else {
              this.validatePersonales = false;
              this.validator.errorSelectBrowser(sel_pais);
            }
          } else {
            this.validatePersonales = true;
          }
        } else {
          if (this.curp != "") {
            if (this.curp != "" && (/^[a-zA-Z0-9]+$/.test(this.curp)) && this.curp.length == 18) {
              if (this.vClasificacionProv == "extranjero") {
                if (this.paistoken != "") {
                  this.validatePersonales = true;
                } else {
                  this.validatePersonales = false;
                  this.validator.errorSelectBrowser(sel_pais);
                }
              } else {
                this.validatePersonales = true;
              }
            } else {
              this.validator.errorInputRow(txt_curp);
            }
          } else {
            if (this.vClasificacionProv == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelectBrowser(sel_pais);
              }
            } else {
              this.validatePersonales = true;
            }
          }

          if (this.comercial_nombre != "") {
            if (this.comercial_nombre != "" && this.validator.strFilEmp(this.comercial_nombre) == true) {
              if (this.vClasificacionProv == "extranjero") {
                if (this.paistoken != "") {
                  this.validatePersonales = true;
                } else {
                  this.validatePersonales = false;
                  this.validator.errorSelectBrowser(sel_pais);
                }
              } else {
                this.validatePersonales = true;
              }

            } else {
              this.validator.errorInputRow(txtComercial_name);
            }
          } else {
            if (this.vClasificacionProv == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelectBrowser(sel_pais);
              }
            } else {
              this.validatePersonales = true;
            }
          }

          if (this.sitio_web != "") {
            if (this.sitio_web != "" && this.validator.filtroUrl("https://" + this.sitio_web) == true) {
              if (this.vClasificacionProv == "extranjero") {
                if (this.paistoken != "") {
                  this.validatePersonales = true;
                } else {
                  this.validatePersonales = false;
                  this.validator.errorSelectBrowser(sel_pais);
                }
              } else {
                this.validatePersonales = true;
              }

            } else {
              this.validator.errorInput(txt_sitio_web, "Sitio web invalido");
            }
          } else {
            if (this.vClasificacionProv == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelectBrowser(sel_pais);
              }
            } else {
              this.validatePersonales = true;
            }
          }
        }
      } else if (this.provModelo.subtipoProv == "provMoral") {
        if (this.vClasificacionProv == "nacional") {
          if (this.comercial_nombre == "" && this.sitio_web == "") {
            this.validatePersonales = true;
          } else {
            if (this.comercial_nombre != "") {
              if (this.comercial_nombre != "" && this.validator.strFilEmp(this.comercial_nombre) == true) {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorInputRow(txtComercial_name);
              }
            } else {
              this.validatePersonales = true;
            }

            if (this.sitio_web != "") {
              if (this.sitio_web != "" && this.validator.filtroUrl("https://" + this.sitio_web) == true) {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorInputRow(txt_sitio_web);
              }
            } else {
              this.validatePersonales = true;
            }
          }
        }

        if (this.vClasificacionProv == "extranjero") {
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
                this.validator.errorInputRow(txtComercial_name);
              }
            } else {
              this.validatePersonales = true;
            }

            if (this.sitio_web != "") {
              if (this.sitio_web != "" && this.validator.filtroUrl("https://" + this.sitio_web) == true) {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorInputRow(txt_sitio_web);
              }
            } else {
              this.validatePersonales = true;
            }

            if (this.vClasificacionProv == "extranjero") {
              if (this.paistoken != "") {
                this.validatePersonales = true;
              } else {
                this.validatePersonales = false;
                this.validator.errorSelectRow(sel_pais);
              }
            } else {
              this.validatePersonales = true;
            }
          }
        }
      }
    } else {
      this.validatePersonales = false;
      this.validator.errorSelectBrowser(selRegimenFiscal);
    }
    console.log(this.validatePersonales);
  }

  keyupUbicaciontxtCodPostalExt(event: any) {
    const validacion = event.value != "" && this.validator.filtroDom(event.value);
    this.cod_postal = validacion ? event.value : "";
    this.validateUbicacion = validacion ? true : false;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_EstName(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_cod_postal_estado_name = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_Municipio(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_cod_postal_municipio = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_CP(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value.length == 5;
    this.new_cod_postal_cp = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_Colonia(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_cod_postal_colonia_vinculada = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validatecPostal(): Boolean {
    const valida_estado = this.new_cod_postal_estado_name != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_estado_name);
    const valida_munici = this.new_cod_postal_municipio != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_municipio);
    const valida_postal = this.new_cod_postal_cp != "" && this.validator.filtroNum(this.new_cod_postal_cp) == true && this.new_cod_postal_cp.length == 5;
    const valida_colonia = this.new_cod_postal_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_colonia_vinculada);
    return valida_estado && valida_munici && valida_postal && valida_colonia;
  }

  addListPostal() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar la dirección registrada?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, agregar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if ((this.new_cod_postal_estado_name != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_estado_name) == true) &&
          (this.new_cod_postal_municipio != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_municipio) == true) &&
          (this.new_cod_postal_cp != "" && this.validator.filtroNum(this.new_cod_postal_cp) == true && this.new_cod_postal_cp.length == 5) &&
          (this.new_cod_postal_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_colonia_vinculada) == true)) {
          //
          this.listnewdireccionNac.push({ "estado": this.new_cod_postal_estado_name, "municipio": this.new_cod_postal_municipio, "codigo_postal": this.new_cod_postal_cp, "colonia": this.new_cod_postal_colonia_vinculada });
          this.validateUbicacion = true;
          //this.validaCPNew = false;

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
        //this.activaFunctionRegistro();
      }
    });
  }

  deleteListCPostal(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.listnewdireccionNac.splice(posicion, 1);
        if (this.listnewdireccionNac.length == 0) {
          this.validateUbicacion = false;
          //this.activaFunctionRegistro();
        }
      }
    });
  }

  solicitaRegistroProveedor(form: NgForm): void {
    if (this.validatePersonales == true && this.validateUbicacion == true) {
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea registrar este proveedor?",
        icon: "warning",
        confirmButtonColor: "#388E3C",
        confirmButtonText: "Sí, registrar",
        showCancelButton: true,
        cancelButtonColor: "#D32F2F",
      }).then((result) => {
        if (result.isConfirmed) {
          this._provServ.proveedor_registro_modulos_externos(
            this.provModelo.rfc_generico,
            this.provModelo.rfc,
            this.provModelo.id_tax,
            this.vClasificacionProv,
            this.vSubClasificacionProv,
            this.provModelo.name_prov,
            this.comercial_nombre,
            this.curp,
            this.paistoken,
            this.sitio_web,
            this.tknRegimenFiscal,
            this.cod_postal,
            this.dipomex_cod_postal_estado,
            this.dipomex_cod_postal_municipio,
            this.dipomex_cod_postal_cp,
            this.dipomex_cod_postal_colonia_vinculada,
            this.listnewdireccionNac,
          ).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function () {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
                this.comeBackPrincipalMenu();
              }
              if (response.status == "error") {
                Swal.fire({
                  position: "top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      })
    }
  }
}
