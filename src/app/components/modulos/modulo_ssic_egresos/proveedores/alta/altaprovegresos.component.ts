import { Component, OnInit, ViewEncapsulation,  ViewChild } from '@angular/core';
import { proveedorModelo } from '../../../../../modelos/proveedorModelo';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { global } from '../../../../../servicios/global_ssic';
import { InterfPais } from '../../../../../interfaces/interf-pais';
import { PaisService } from '../../../../../servicios/ssic/pais.service';

import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { InterfPagoForma } from '../../../../../interfaces/interf-pago-forma';
import { FormaPagoService } from '../../../../../servicios/ssic/forma-pago.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { InterfMetodoPago } from '../../../../../interfaces/interf-metodo-pago';
import { RegimenFiscalService } from '../../../../../servicios/regimen-fiscal.service';
import numeral from 'numeral';

import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { Popover } from 'primeng/popover';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-interno-egresos-catalogos-altaprov',
  templateUrl: './altaprovegresos.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
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
    '../../egresos.css',
    './altaprovegresos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})

export class AltaProvEgresosComponent implements OnInit {
  public usuario: Usuarios;
  public provModelo: proveedorModelo;

  contactoCollapsed: boolean = true;

  //nuevo registro
  AllRegFisArray: any = [];
  PfAllRegFisArray: any = [];
  PmAllRegFisArray: any = [];
  pageAltaPostales: number = 1;
  arraYpais: InterfPais[] = [];
  catalogo_monedas_api: any = [];
  prorrateo_moneda_opcion = null;
  cred_comienza_pago: any = [];

  public validateRfcExtBool: boolean = true;
  public validateIdTaxBool: boolean = true;
  public validateFoundProv: boolean = false;

  public vClasificacionProv: string = "";
  public vSubClasificacionProv: string = "";
  public validatePersonales: boolean = false;
  public validateUbicacion: boolean = false;

  //datos generales
  public decisionEditNombre: boolean = false;

  //rfcs
  public rfcGenericoPF: string = "xaxx010101000";
  public rfcGenericoPM: string = "xax010101000";
  public rfcGenericoExt: string = "xexx010101000";

  //contacto
  separateDialCode = false;
  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  phoneForm: FormGroup;
  tipos_telefonos: any = [];
  public viewMailContModal: boolean = false;
  public txtContactoPaternoProvv_reg: string = "";
  public txtContactoMaternoProvv_reg: string = "";
  public txtContactoNombresProvv_reg: string = "";
  public txtContactoAreaProvv_reg: string = "";
  public txtContactoCargoProvv_reg: string = "";
  public txtMailPersonalProvv_reg: string = "";
  contPersMailList: any = [];
  public viewTelefonoContModal: boolean = false;
  public txtEtiquetaPersonal: string = "";
  public txtPhonePersonalAll: string = "";
  public txtPhoneExtPersonal: string = "";
  contPersTelefonoList: any = [];
  //informacion fiscal
  public files: NgxFileDropEntry[] = [];
  public files_anexos: any[] = [];
  //forma de pago
  arraYFormaPago: InterfPagoForma[] = [];
  arraYMetodoPago: InterfMetodoPago[] = [];

  public popUpAccept: string = "";
  public popUpReject: string = "";
  options = {};
  @ViewChild('frmAddProv') formAddProv!: NgForm;
  @ViewChild('popOverMails') popOverMails!: Popover;
  @ViewChild('popOverPhone') popOverPhone!: Popover;

  constructor(
    private translate: TranslateService,
    private validator: ValidatorServService,
    private dirServ: DireccionesService,
    private _pais: PaisService,
    private _monedasServ: MonedasService,
    private _fpago: FormaPagoService,
    private sanitizer: DomSanitizer,
    private _provServ: ProveedoresService,
    private _regimen: RegimenFiscalService,
    private relInterna: ComunicacionInternaService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.provModelo = new proveedorModelo(
      "",//tipoProv
      "",//subtipoProv
      "",//rfc_generico
      "",//rfc
      "",//rfc_back
      "",//id_tax
      "",//id_tax_back
      "",//name_prov
      "",//name_prov_back

      false,//habilitado_para_reembolsos,
      "",//emial_para_reembolsos:string,
      "",//comercial_nombre:string,
      "",//curp:string,
      "",//sitio_web:string,
      "",//paistoken:string,
      "",//tknRegimenFiscal:string,
      "",//cuenta_contable:string,
      //contacto
      false,//decideinfocontacto, 
      [],//listaContactoPersonal:string[],
      //informacion fiscal
      false,//tiene_docs_fiscales:boolean,
      "",//noCargaDocsFiscalesRazon:string, 
      null,//docSituacionFiscal:any,
      null,//htmlSituacionFiscal:any,
      null,//typoSituacionFiscal:any,
      null,//docCumplimientoObFiscales:any,
      null,//htmlCumplimientoObFiscales:any,
      null,//typoCumplimientoObFiscales:any,
      null,//docContratos:any,
      null,//htmlContratos:any,
      null,//typoContratos:any,
      //credito
      false,//decideaceptcredito:boolean, 
      "bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4",//token_monedaOrden:string,
      0,//decimales_monedaOrden:number,
      numeral("0.00").format('$0,0.00'),//limite_credito:string,
      0,//dias_pago_credito:number,
      "",//comienzacomputo_credito:string,
      //forma de pago
      false,//decideformapago:boolean,
      null,//docEstadoCuenta:any,
      null,//htmlEstadoCuenta:any,
      null,//typoEstadoCuenta:any,
      "",//tknFormaPagoProv:string,
      "",//tipoReferenciaPago:string,
      "",//clabeInterbancariaBanco:string,
      "",//clabeInterbancariaPlaza:string,
      "",//clabeInterbancariaCuenta:string,
      "",//clabeInterbancariaControl:string,
      "000-000-00000000000-0",//clabeInterbancariaPago:string,
      //recibe_factura
      false,//receptFactura:boolean,
      false,//classRecibeArtPago:boolean,
      //ubicacion
      "",//cod_postal:string,
      //dipomex
      "---",//dipomex_cod_postal_estado:string,
      "---",//dipomex_cod_postal_municipio:string,
      "---",//dipomex_cod_postal_cp:string,
      [],//dipomex_cod_postal_colonias:string[],
      "",//dipomex_cod_postal_colonia_vinculada:string,
      "---",//new_cod_postal_estado_name:string,
      "---",//new_cod_postal_estado_abrev:string,
      "---",//new_cod_postal_municipio:string,
      "---",//new_cod_postal_cp:string,
      "",//new_cod_postal_colonia_vinculada:string,
      [],//listnewdireccionNac:string[],
      [{ "id": 1 }],//newdireccionNac_nuevo_registro:string[],
    );
    this.phoneForm = this.fb.group({
      telefono: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tipos_telefonos = [
      {clave: 'Casa', valor: 'casa'},
      {clave: 'Movil', valor: 'movil'},
      {clave: 'Trabajo', valor: 'trabajo'},
      {clave: 'Fax', valor: 'fax'},
      {clave: 'Otro', valor: 'otro'}
    ];

    this.cred_comienza_pago = [
      {clave: 'Cada inicio de mes', valor: 'cada.inicio.mes'},
      {clave: 'Se emite/envía orden de pago', valor: 'sistem.emite.orden.pago'},
      {clave: 'Se recibe factura del proveedor', valor: 'serecibe.facturadel.proveedor'},
      {clave: 'El producto salga de las bodegas del proveedor', valor: 'producto.sale.bodegas.proveedor'},
      {clave: 'El producto es recibido en nuestras bodegas', valor: 'producto.recibido.nuestras.bodegas'}
    ];
  }

  listarPaises(){
    this._pais.getListaPais().subscribe((data: InterfPais[]) => {
      this.arraYpais = data;
      console.log(this.arraYpais);
    });
  }

  listarMonedas() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.catalogo_monedas_api = response.monedas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listandoRegimenFiscal(){
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

  //nuevo registro
  buscaCodPostalDipomex(event: any) {
    if (event.value != "" && event.value.length == 5) {
      this.validator.correctoInputRow(event);
      this.provModelo.dipomex_cod_postal_colonias = [];
      this.provModelo.dipomex_cod_postal_estado = "";
      this.provModelo.dipomex_cod_postal_municipio = "";
      this.provModelo.dipomex_cod_postal_cp = "";
      this.provModelo.dipomex_cod_postal_colonia_vinculada = "";

      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.provModelo.dipomex_cod_postal_estado = response.cod_postal["estado"] + " (" + response.cod_postal["estado_abreviatura"] + ")";
            this.provModelo.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.provModelo.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
            this.provModelo.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
            if (response.cod_postal["colonias"].length == 1) {
              this.provModelo.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
              this.validateUbicacion = true;
            } else {
              this.validateUbicacion = false;
            }
          } else {
            this.validateUbicacion = false;
            Swal.fire({ position: "top-end", icon: "warning", title: this.translate.instant(response.message), showConfirmButton: false, timer: 3000, customClass: { popup: 'my-swal-zindex' } })
            if (response.message == "postal_empty") {
              this.provModelo.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
              this.provModelo.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
              this.provModelo.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
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
    const col_vinc = this.provModelo.dipomex_cod_postal_colonias.find((col: any) => col === colonia_name);
    const validacion = colonia_name != "" && this.validator.filtroAlfaNumerico(colonia_name) && typeof col_vinc !== 'undefined';
    this.provModelo.dipomex_cod_postal_colonia_vinculada = validacion ? colonia_name : '';
    this.validateUbicacion = validacion ? true : false;
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
      var verif_rfcProv = document.getElementById("verif_rfcProv");
      this.validator.limpiaInput(verif_rfcProv);
      var verif_idTaxProv = document.getElementById("verif_idTaxProv");
      this.validator.limpiaInput(verif_idTaxProv);
      var verifNameProvidderExt_reg = document.getElementById("verifNameProvidderExt_reg");
      this.validator.limpiaInput(verifNameProvidderExt_reg);
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
      var verif_rfcProv = document.getElementById("verif_rfcProv");
      this.validator.limpiaInput(verif_rfcProv);
      var verifNameProvidder_reg = document.getElementById("verifNameProvidder_reg");
      this.validator.limpiaInput(verifNameProvidder_reg);
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

  checksubtipoProv(event: any, subtipoProv: any) {
    if (this.vClasificacionProv != "") {
      if (this.provModelo.tipoProv == "nacional") {
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

      if (this.provModelo.tipoProv == "extranjero") {
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

      //this.provModelo.rfc = "";
      //this.provModelo.id_tax = "";
      //this.provModelo.name_prov = "";
    }
  }

  keyupverif_rfcProv(event: any) {
    if (this.vSubClasificacionProv == "provFisica") {
      const validacion_pfis = event.value != "" && this.validator.filtroRfcPersFisica(event.value) && event.value.length == 13;
      this.provModelo.rfc = validacion_pfis ? event.value : "";
      validacion_pfis ? this.validator.correctoInput(event, "Escriba su rfc con Homoclave") : this.validator.errorInput(event, "rfc del proveedor no es correcto");
      if (event.value == "") {
        this.validator.errorInput(event, "Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
      }
    }
    if (this.vSubClasificacionProv == "provMoral") {
      const validacion_pmor = event.value != "" && this.validator.filtroRfcPersMoral(event.value) && event.value.length == 12;
      this.provModelo.rfc = validacion_pmor ? event.value : "";
      validacion_pmor ? this.validator.correctoInput(event, "Escriba su rfc con Homoclave") : this.validator.errorInput(event, "rfc del proveedor no es correcto");
      if (event.value == "") {
        this.validator.errorInput(event, "Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
      }
    }
  }

  keyupverif_rfcExtProv(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value);
    this.validateRfcExtBool = validacion ? true : false;
    this.provModelo.rfc = validacion ? event.value : "";
    validacion ? this.validator.correctoInput(event, "Escriba su rfc") : this.validator.errorInput(event, "Rfc incorrecto");
  }

  keyupverif_TaxIdProv(event: any) {
    const validacion = event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value);
    this.provModelo.id_tax = validacion ? event.value : "";
    this.validateIdTaxBool = validacion ? true : false;
    validacion ? this.validator.correctoInput(event, "Escriba Tax ID de la empresa") : this.validator.errorInput(event, "Tax ID de la empresa no es correcto");
  }

  functllenaRFcGenerico(event: any) {
    $("#verif_rfcProv").val("");
    $("#verif_rfcProv").attr("disabled", "disabled");
    if (this.provModelo.tipoProv == "nacional") {
      if (this.provModelo.subtipoProv != "") {
        if (this.provModelo.subtipoProv == "provFisica") {
          this.provModelo.rfc = this.rfcGenericoPF;
          $(event).addClass("noneView");
          $("#btnllenaRFcProv").removeClass("noneView");
        }
        if (this.provModelo.subtipoProv == "provMoral") {
          this.provModelo.rfc = this.rfcGenericoPM;
          $(event).addClass("noneView");
          $("#btnllenaRFcProv").removeClass("noneView");
        }
      } else {
        $("#verif_rfcProv").removeAttr("disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcProv").addClass("noneView");
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione subtipo de proveedor",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }
    }
    if (this.provModelo.tipoProv == "extranjero") {
      if (this.provModelo.subtipoProv != "") {
        this.provModelo.rfc = this.rfcGenericoExt;
        $(event).addClass("noneView");
        $("#btnllenaRFcProv").removeClass("noneView");
      } else {
        $("#verif_rfcProv").removeAttr("disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcProv").addClass("noneView");
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione subtipo de proveedor",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }
    }
  }

  functllenaRFcProv(event: any) {
    $("#verif_rfcProv").val("");
    if (this.provModelo.tipoProv == "nacional") {
      if (this.provModelo.subtipoProv != "") {
        if (this.provModelo.subtipoProv == "provFisica") {
          $("#verif_rfcProv").removeAttr("disabled");
          this.provModelo.rfc = "";
          $(event).addClass("noneView");
          $("#btnllenaRFcGenerico").removeClass("noneView");
        }
        if (this.provModelo.subtipoProv == "provMoral") {
          $("#verif_rfcProv").removeAttr("disabled");
          this.provModelo.rfc = "";
          $(event).addClass("noneView");
          $("#btnllenaRFcGenerico").removeClass("noneView");
        }
      } else {
        $("#verif_rfcProv").attr("disabled", "disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcGenerico").addClass("noneView");
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione subtipo de proveedor",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }
    }
    if (this.provModelo.tipoProv == "extranjero") {
      if (this.provModelo.subtipoProv != "") {
        $("#verif_rfcProv").removeAttr("disabled");
        this.provModelo.rfc = "";
        $(event).addClass("noneView");
        $("#btnllenaRFcGenerico").removeClass("noneView");
      } else {
        $("#verif_rfcProv").removeAttr("disabled");
        $(event).removeClass("noneView");
        $("#btnllenaRFcGenerico").addClass("noneView");
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "seleccione subtipo de proveedor",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'my-swal-zindex'
          }
        })
      }
    }
  }

  checkNombreProv(valor: any) {
    const validacion = valor.value != "" && this.validator.filtroAlfaNumerico(valor.value) && valor.value.length >= 4;
    this.provModelo.name_prov = validacion ? valor.value : "";
    validacion ? this.validator.correctoInput(valor, "Nombre completo / razón social del proveedor") : this.validator.errorInput(valor, "Ingresa nombre completo / razón social del proveedor");
    if (valor.value.length < 4) {
      this.validator.errorInput(valor, "Número de caracteres invalido");
    }
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

  funtcBuscaProvDBNac() {
    let verif_rfcProv: any = document.getElementById("verif_rfcProv");
    let verifNameProvidder_reg: any = document.getElementById("verifNameProvidder_reg");
    var frc_novacio: any = this.provModelo.rfc != "" ? this.provModelo.rfc : this.provModelo.rfc_generico;
    const name_prov_validacion = this.provModelo.name_prov != "" && this.validator.filtroAlfaNumerico(this.provModelo.name_prov) && this.provModelo.name_prov.length >= 4;
    const name_frc_fisica = this.vSubClasificacionProv == "provFisica" && this.validator.filtroRfcPersFisica(frc_novacio) && frc_novacio.length == 13;
    const name_frc_moral = this.vSubClasificacionProv == "provMoral" && this.validator.filtroRfcPersMoral(frc_novacio) && frc_novacio.length == 12;

    if (this.vClasificacionProv == "") this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Seleccione proveedor nacional o extranjero', life: 3000 });
    if (this.vSubClasificacionProv == "") this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Seleccione persona física o moral', life: 3000 });

    if (this.vClasificacionProv != "" && this.vSubClasificacionProv != "" && this.vClasificacionProv == "nacional") {
      const valida_rfc_gral = frc_novacio != "" && (name_frc_fisica || name_frc_moral);
      if (name_prov_validacion && valida_rfc_gral) {
        Swal.fire({
          title: this.translate.instant("swal_attenc"),
          text: this.vSubClasificacionProv == "provFisica" ? "¿Su proveedor es Persona Física?" : "¿Su proveedor es Persona Moral?",
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
        if (!name_prov_validacion) {
          this.validator.errorInput(verifNameProvidder_reg, "Ingresa nombre completo / razón social del proveedor");
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Ingresa nombre del proveedor', life: 3000 });
        }
        if (this.provModelo.rfc == "") {
          this.validator.errorInput(verif_rfcProv, "Inserta Rfc de su proveedor");
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe registrar rfc', life: 3000 });
        }
        if (!name_frc_fisica) {
          this.validator.errorInput(verif_rfcProv, "Su rfc debe contener 13 caracteres");
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'su RFC no es correcto', life: 3000 });
        }
        if (!name_frc_moral) {
          this.validator.errorInput(verif_rfcProv, "Su rfc debe contener 12 caracteres");
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'su RFC no es correcto', life: 3000 });
        }
      }
    }
  }

  funtcBuscaProvDBExt() {
    let verif_rfcProv: any = document.getElementById("verif_rfcProv");
    let verifNameProvidderExt_reg: any = document.getElementById("verifNameProvidderExt_reg");
    let verif_idTaxProv: any = document.getElementById("verif_idTaxProv");
    const valida_rfc_generico = this.provModelo.rfc_generico != "" && this.provModelo.rfc_generico.length >= 9 && this.provModelo.rfc_generico.length <= 40;
    const valida_name_prov = this.provModelo.name_prov != "" && this.validator.strFilter(this.provModelo.name_prov) && this.provModelo.name_prov.length >= 4;

    if (this.vClasificacionProv == "") this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Seleccione proveedor nacional o extranjero', life: 3000 });
    if (this.vSubClasificacionProv == "") this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Seleccione persona física o moral', life: 3000 });

    if (this.vClasificacionProv != "" && this.vSubClasificacionProv != "" && this.vClasificacionProv == "extranjero") {
      if (this.provModelo.rfc == "" && this.provModelo.id_tax == "") {
        if (valida_rfc_generico && valida_name_prov) {
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
          if (this.provModelo.rfc_generico == "") this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe registrar Tax ID', life: 3000 });

          if (this.provModelo.rfc_generico.length < 9 || this.provModelo.rfc_generico.length > 40) {
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'su RFC no es correcto', life: 3000 });
          }
          if (!valida_name_prov) {
            this.validator.errorInput(verifNameProvidderExt_reg, "Ingresa nombre completo / razón social del proveedor");
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Ingresa nombre completo / razón social del proveedor', life: 3000 });
          }
        }

      } else {
        if (this.validateRfcExtBool && this.validateIdTaxBool) {
          if (valida_rfc_generico && valida_name_prov) {
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
            if (this.provModelo.rfc_generico == "") this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe registrar Tax ID', life: 3000 });
            if (this.provModelo.rfc_generico.length < 9 || this.provModelo.rfc_generico.length > 40) {
              this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'su RFC no es correcto', life: 3000 });
            }
            if (this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4) {
              this.validator.errorInput(verifNameProvidderExt_reg, "Ingresa nombre completo / razón social del proveedor");
              this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Ingresa nombre completo / razón social del proveedor', life: 3000 });
            }
          }
        } else {
          if (!this.validateRfcExtBool) this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Error al registrar rfc', life: 3000 });
          if (!this.validateIdTaxBool) this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Error al registrar idTax', life: 3000 });
        }
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
          this.listandoRegimenFiscal();
          this.listarPaises();
        }
        if (response.status == "error") {
          console.log(response);
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
        console.log(error);
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

    this.provModelo = new proveedorModelo(
      "", "", "", "", "", "", "", "", "",
      false, "", "", "", "", "", "", "",
      //contacto
      false,
      [],
      //informacion fiscal
      false, "", null, null, null, null, null, null, null, null, null,
      //credito
      false, "bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4", 0, numeral("0.00").format('$0,0.00'), 0, "",
      //forma de pago
      false, null, null, null, "", "", "", "", "", "", "000-000-00000000000-0",
      //recibe_factura
      false, false,
      //ubicacion
      "",//cod_postal:string,
      //dipomex
      "", "", "", [], "", "", "", "", "", "", [], [{ "id": 1 }],
    );
  }

  habilitar_prov_para_reembolsos(event: any) {
    console.log(event.checked);
    this.provModelo.habilitado_para_reembolsos = event.checked ? true : false;
    event.checked ? $("#infoemail_reembolsos").removeClass("noneView") : $("#infoemail_reembolsos").addClass("noneView");
  }

  keyupEmailForReembolsos(event: any) {
    const validacion = event.value != '' && this.validator.filtroCorreo(event.value);
    this.provModelo.email_para_reembolsos = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //personales
  keyupComercialName(event: any) {
    const validacion = event.value != "" && this.validator.strFilEmp(event.value);
    this.provModelo.comercial_nombre = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validateAllPersonales();
  }

  keyupCurp(event: any) { //txt_curp
    if (this.vClasificacionProv == "nacional") {
      const validacion = event.value != "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length == 18;
      this.provModelo.curp = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    } else {
      const validacion = event.value === "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length >= 40;
      this.provModelo.curp = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }
    this.validateAllPersonales();
  }

  changePais(token_pais:any){
    var selPaisExtPF_reg = document.getElementById("selPaisExtPF_reg");
    const country = this.arraYpais.find((row:any) => row.token_pais === token_pais);
    const validacion = token_pais != "" && this.validator.filtroAlfaNumerico(country?.pais) && typeof country !== 'undefined';
    this.provModelo.paistoken = validacion ? country.token_pais : '';
    validacion ? this.validator.correctoSelectBrowser(selPaisExtPF_reg) : this.validator.errorSelectBrowser(selPaisExtPF_reg);
    this.validateAllPersonales();
  }

  changeSitioWeb(event: any) {
    const validacion = event.value != "" && this.validator.filtroUrl("https://" + event.value);
    this.provModelo.sitio_web = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validateAllPersonales();
  }

  changeRegimenFiscal(token_regimen_fiscal:any){
    var selRegimenFiscal = document.getElementById("selRegimenFiscal");
    const regfis = this.AllRegFisArray.find((row:any) => row.token_regimen_fiscal === token_regimen_fiscal);
    const validacion = token_regimen_fiscal != "" && this.validator.filtroAlfaNumerico(regfis?.regimen) && typeof regfis !== 'undefined';
    this.provModelo.tknRegimenFiscal = validacion ? regfis.token_regimen_fiscal : '';
    validacion ? this.validator.correctoSelectBrowser(selRegimenFiscal) : this.validator.errorSelectBrowser(selRegimenFiscal);
    this.validateAllPersonales();
  }

  keyupValidateCuentaContable(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.provModelo.cuenta_contable = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validateAllPersonales();
  }

  validateAllPersonales() {
    var txtnomComercial_reg: any = document.getElementById("txtnomComercial_reg");
    var txtcurpPF_reg: any = document.getElementById("txtcurpPF_reg");
    var selPaisExtPF_reg: any = document.getElementById("selPaisExtPF_reg");
    var txtsitWebPF_reg: any = document.getElementById("txtsitWebPF_reg");
    var selRegimenFiscal: any = document.getElementById("selRegimenFiscal");
    var cuentaContableProv: any = document.getElementById("cuentaContableProv");
    
    this.validatePersonales = true;
    
    if (this.provModelo.comercial_nombre) {
      if (!this.validator.strFilEmp(this.provModelo.comercial_nombre)) {
        this.validator.errorInputRow(txtnomComercial_reg);
        this.validatePersonales = false;
        return;
      }
    }

    if (this.provModelo.subtipoProv == "provFisica" && this.provModelo.curp) {
      const OKCurp = /^[a-zA-Z0-9]+$/.test(this.provModelo.curp) && this.provModelo.curp.length == 18;
      if (!OKCurp) {
        this.validator.errorInputRow(txtcurpPF_reg);
        this.validatePersonales = false;
        //return;
      }
    }

    if (this.vClasificacionProv == "extranjero" && !this.provModelo.paistoken) {
      this.validator.errorSelectBrowser(selPaisExtPF_reg);
      this.validatePersonales = false;
      //return;
    }

    if (this.provModelo.sitio_web) {
      if (!this.validator.filtroUrl("https://" + this.provModelo.sitio_web)) {
        this.validator.errorInputRow(txtsitWebPF_reg);
        this.validatePersonales = false;
        //return;
      }
    }

    if (!this.provModelo.tknRegimenFiscal) {
      this.validator.errorSelectBrowser(selRegimenFiscal);
      this.validatePersonales = false;
      //return;
    }

    if (!this.validator.filtroAlfaNumerico(this.provModelo.cuenta_contable)) {
      this.validator.errorInputRow(cuentaContableProv);
      this.validatePersonales = false;
      //return;
    }

    console.log(this.validatePersonales);
  }

  //contacto
  decideocupaContacto(event: any) {
    this.provModelo.decideinfocontacto = event.checked ? true : false;
    event.checked ? $("#decideinfocontacto").removeClass("noneView") : $("#decideinfocontacto").addClass("noneView");
  }

  keyupPersContPaterno(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
    this.txtContactoPaternoProvv_reg = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaFormContacto();
  }

  keyupPersContMaterno(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
    this.txtContactoMaternoProvv_reg = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaFormContacto();
  }

  keyupPersContNombres(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 3;
    this.txtContactoNombresProvv_reg = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaFormContacto();
  }

  keyupPersContArea(event: any) {
    const validacion = event.value != '' && this.validator.strFilEmp(event.value);
    this.txtContactoAreaProvv_reg = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaFormContacto();
  }

  keyupPersContCargo(event: any) {
    const validacion = event.value != '' && this.validator.strFilEmp(event.value);
    this.txtContactoCargoProvv_reg = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaFormContacto();
  }

  verModalContEmail() {
    this.viewMailContModal = true;
  }

  keyupPersContEmail(event: any) {
    const validacion = event.value != '' && this.validator.filtroCorreo(event.value) == true;
    this.txtMailPersonalProvv_reg = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  addMailContacto() {
    var contPersEmail: any = document.getElementById("contPersProvEmail");
    const validacion = this.txtMailPersonalProvv_reg != '' && this.validator.filtroCorreo(this.txtMailPersonalProvv_reg) == true;
    if (validacion) {
      this.contPersMailList.push(this.txtMailPersonalProvv_reg);
      console.log(this.contPersMailList);
      this.txtMailPersonalProvv_reg = '';
    }
    validacion ? this.validator.limpiaInputRow(contPersEmail) : this.validator.errorInputRow(contPersEmail);
    this.validaMailTelContacto();
    this.validaFormContacto();
  }

  deleteMailContacto(position: any) {
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
        this.contPersMailList.splice(position, 1);
        if (this.contPersMailList.length == 0) {
          this.validaMailTelContacto();
        }
        this.validaFormContacto();
      }
    });
  }

  verModalContTelefono() {
    this.viewTelefonoContModal = true;
  }

  telefonoTipoCont_regChange(valor:any) {
    var etiquetaCont_regProv = document.getElementById("etiquetaCont_regProv");
    const tip_tel = this.tipos_telefonos.find((row:any) => row.valor === valor);
    const validacion = valor != "" && this.validator.filtroAlfaNumerico(tip_tel?.valor) && typeof tip_tel !== 'undefined';
    this.txtEtiquetaPersonal = validacion ? tip_tel.valor : '';
    validacion ? this.validator.correctoSelectBrowser(etiquetaCont_regProv) : this.validator.errorSelectBrowser(etiquetaCont_regProv);
    this.validaFormContacto();
  }

  probarTextPhone() {
    if (this.phoneForm.valid) {
      const phoneNumber = this.phoneForm.get('telefono')?.value;
      const dialCode = phoneNumber?.number;
      console.log('Número de teléfono registrado:', phoneNumber + " " + dialCode);
      // Aquí puedes manejar el número de teléfono según tus necesidades
    }
  }

  telefonoKeyupNumeroCont_reg(event: any) {
    const phoneNumber = this.phoneForm.get('telefono')?.value;
    console.log(event.value);
    const validacion = event.value != "" && event.value.length >= 5 && this.validator.filtroPhone(event.value) == true && this.phoneForm.valid;
    this.txtPhonePersonalAll = validacion ? phoneNumber : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaFormContacto();
  }

  telefonoKeyupExtension_reg(event: any) {
    const validacion = event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true;
    this.txtPhoneExtPersonal = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaFormContacto();
  }

  get validaPhoneContacto(): Boolean {
    const valida_etiqueta = this.txtEtiquetaPersonal != '' && this.validator.strFilter(this.txtEtiquetaPersonal) == true;
    const valida_Phone = this.txtPhonePersonalAll != '';
    const valida_Ext = this.txtPhoneExtPersonal == '' || (this.txtPhoneExtPersonal != '' && this.validator.filtroPhone(this.txtPhoneExtPersonal));
    return valida_etiqueta && valida_Phone && valida_Ext;
  }

  addPhoneContacto() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        var etiquetaCont_regProv: any = document.getElementById("etiquetaCont_regProv");
        var txtTelefonoCont_reg: any = document.getElementById("txtTelefonoCont_regProv");
        var txtExtension_reg: any = document.getElementById("txtExtension_regProv");
        this.contPersTelefonoList.push({
          "etiqueta": this.txtEtiquetaPersonal,
          "telefono_complete": this.txtPhonePersonalAll,
          "extension": this.txtPhoneExtPersonal,
        });
        this.txtEtiquetaPersonal = '';
        this.txtPhonePersonalAll = '';
        this.txtPhoneExtPersonal = '';
        this.validator.limpiaSelect(etiquetaCont_regProv);
        this.validator.limpiaInputRow(txtTelefonoCont_reg);
        this.validator.limpiaInputRow(txtExtension_reg);
        this.validaMailTelContacto();
        this.validaFormContacto();
      }
    });
  }

  deletePhoneContacto(position: any) {
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
        this.contPersTelefonoList.splice(position, 1);
        if (this.contPersTelefonoList.length == 0) {
          this.validaMailTelContacto();
        }
      }
    });
    this.validaFormContacto();
  }

  validaFormContacto() {
    var contPersPaterno: any = document.getElementById("contPersProvPaterno");
    var contPersMaterno: any = document.getElementById("contPersProvMaterno");
    var contPersNombres: any = document.getElementById("contPersProvNombres");
    var contPersArea: any = document.getElementById("contPersProvArea");
    var contPersCargo: any = document.getElementById("contPersProvCargo");

    const validacionContactoPaterno = this.txtContactoPaternoProvv_reg != "" && this.validator.strFilter(this.txtContactoPaternoProvv_reg) == true && this.txtContactoPaternoProvv_reg.length >= 4;
    const validacionContactoMaterno = this.txtContactoMaternoProvv_reg != "" && this.validator.strFilter(this.txtContactoMaternoProvv_reg) == true && this.txtContactoMaternoProvv_reg.length >= 4;
    const validacionContactoNombres = this.txtContactoNombresProvv_reg != "" && this.validator.strFilter(this.txtContactoNombresProvv_reg) == true && this.txtContactoNombresProvv_reg.length >= 3;
    const validacionContactoArea = this.txtContactoAreaProvv_reg != "" && this.validator.strFilEmp(this.txtContactoAreaProvv_reg) == true;
    const validacionContactoCargo = this.txtContactoCargoProvv_reg != "" && this.validator.strFilEmp(this.txtContactoCargoProvv_reg) == true;
    const validacionContactoMailTelefono = this.contPersMailList.length > 0 || this.contPersTelefonoList.length > 0;

    !validacionContactoPaterno ? this.validator.errorInputRow(contPersPaterno) : null;
    !validacionContactoMaterno ? this.validator.errorInputRow(contPersMaterno) : null;
    !validacionContactoNombres ? this.validator.errorInputRow(contPersNombres) : null;
    !validacionContactoArea ? this.validator.errorInputRow(contPersArea) : null;
    !validacionContactoCargo ? this.validator.errorInputRow(contPersCargo) : null;
    !validacionContactoMailTelefono ? this.validaMailTelContacto() : null;
  }

  get enableBtnContacto(): Boolean {
    const validacionContactoPaterno = this.txtContactoPaternoProvv_reg != "" && this.validator.strFilter(this.txtContactoPaternoProvv_reg) == true && this.txtContactoPaternoProvv_reg.length >= 4;
    const validacionContactoMaterno = this.txtContactoMaternoProvv_reg != "" && this.validator.strFilter(this.txtContactoMaternoProvv_reg) == true && this.txtContactoMaternoProvv_reg.length >= 4;
    const validacionContactoNombres = this.txtContactoNombresProvv_reg != "" && this.validator.strFilter(this.txtContactoNombresProvv_reg) == true && this.txtContactoNombresProvv_reg.length >= 3;
    const validacionContactoArea = this.txtContactoAreaProvv_reg != '' && this.validator.strFilEmp(this.txtContactoAreaProvv_reg) == true;
    const validacionContactoCargo = this.txtContactoCargoProvv_reg != '' && this.validator.strFilEmp(this.txtContactoCargoProvv_reg) == true;
    const validacionContactoMailTelefono = this.contPersMailList.length > 0 || this.contPersTelefonoList.length > 0;
    return validacionContactoPaterno && validacionContactoMaterno && validacionContactoNombres && validacionContactoArea && validacionContactoCargo && validacionContactoMailTelefono;
  }

  validaMailTelContacto() {
    var btnModalPersMailMain = document.getElementById("btnModalPersMailMain");
    var btnModalPersTelMain = document.getElementById("btnModalPersTelMain");
    this.contPersMailList.length > 0 ? this.validator.contactoCorrectoBtn(btnModalPersMailMain) : this.validator.contactoErrorBtn(btnModalPersMailMain);
    this.contPersTelefonoList.length ? this.validator.contactoCorrectoBtn(btnModalPersTelMain) : this.validator.contactoErrorBtn(btnModalPersTelMain);
  }

  clickfunctionaddInfoContacto() {
    var contPersPaterno: any = document.getElementById("contPersProvPaterno");
    var contPersMaterno: any = document.getElementById("contPersProvMaterno");
    var contPersNombres: any = document.getElementById("contPersProvNombres");
    var contPersArea: any = document.getElementById("contPersProvArea");
    var contPersCargo: any = document.getElementById("contPersProvCargo");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar este personal de contacto?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.provModelo.listaContactoPersonal.push({
          "num_lista": this.provModelo.listaContactoPersonal.length + 1,
          "paterno": this.txtContactoPaternoProvv_reg,
          "materno": this.txtContactoMaternoProvv_reg,
          "nombre": this.txtContactoNombresProvv_reg,
          "area": this.txtContactoAreaProvv_reg,
          "cargo": this.txtContactoCargoProvv_reg,
          "emails": this.contPersMailList,
          "telefonos": this.contPersTelefonoList,
        });
        this.validator.limpiaInputRow(contPersPaterno);
        this.validator.limpiaInputRow(contPersMaterno);
        this.validator.limpiaInputRow(contPersNombres);
        this.validator.limpiaInputRow(contPersArea);
        this.validator.limpiaInputRow(contPersCargo);
        this.txtContactoPaternoProvv_reg = "";
        this.txtContactoMaternoProvv_reg = "";
        this.txtContactoNombresProvv_reg = "";
        this.txtContactoAreaProvv_reg = "";
        this.txtContactoCargoProvv_reg = "";
        this.contPersMailList = [];
        this.contPersTelefonoList = [];
        console.log(this.provModelo.listaContactoPersonal);
      }
    })
  }

  toggleMails(event: any) {
    this.popOverMails.toggle(event);
  }

  togglePhone(event: any) {
    this.popOverPhone.toggle(event);
  }

  clickfunctiondeleteRegCont(num_lista: any) {
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
        this.provModelo.listaContactoPersonal.splice(num_lista - 1, 1);
      }
    });
  }

  //informacion fiscal
  decide_docs_fiscales(event: any) {
    this.provModelo.tiene_docs_fiscales = event.checked ? true : false;
    event.checked ? $("#decidedocs_fiscales").removeClass("noneView") : $("#decidedocs_fiscales").addClass("noneView");
  }

  cargaDocssitfiscal(e: any) {
    var local = this;
    for (let i = 0; i < e.target.files.length; i++) {
      const document = e.target.files[i];
      let reader = new FileReader();
      reader.readAsDataURL(document);
      if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
        this.provModelo.typoSituacionFiscal = document.type;
        this.validator.correctoTR("#trDocSitFiscal");
        this.provModelo.docSituacionFiscal = document;
        //
        reader.onload = function (this) {
          //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
          //let imgPerfil = '<iframe id="framedocSituacionFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
          local.regresaHtmlSitfiscal(reader.result);
        }
      } else {
        this.validator.errorTR("#trDocSitFiscal");
        this.provModelo.typoSituacionFiscal = "";
        this.provModelo.htmlSituacionFiscal = "";
        if (e.target.files[0].size > 2000000) {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
        }
        if (this.validator.filtroTipoArchivo(document.type) == false) {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
        }
      }
      console.log(this.provModelo.typoSituacionFiscal);
    }
  }

  regresaHtmlSitfiscal(text_document: any) {
    this.provModelo.htmlSituacionFiscal = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
  }

  deleteDocSitfiscal() {
    var file_situacion_fiscal = document.getElementById("file_situacion_fiscal");
    this.provModelo.htmlSituacionFiscal = "";
    this.provModelo.docSituacionFiscal = "";
    this.validator.limpiaTR("#trDocSitFiscal");
    this.validator.limpiaInputRow(file_situacion_fiscal);
  }

  clickEscannersitfiscal() {//readerSitFiscalProv
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        //console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("readerSitFiscalProv", config, false);
    codeQrstfiscal.render(this.scanYesSitFiscal, this.onScanError);
  }

  scanYesSitFiscal(decodedText: any, decodedResult: any) {
    //console.log(`Scan result: ${decodedText}`, decodedResult);
    global.imagenUrlClFrvQrFiscal = decodedText;
    //console.log(global.imagenUrlClFrvQrFiscal)
    $("#divImgClassSitfiscalProv").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + decodedText + '" frameborder="0"></iframe>';
    $("#divImgClassSitfiscalProv").html(imgPerfil);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'my-swal-zindex'
      }
    })
  }

  onScanError(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }

  cargaDocsContratos(e: any) {
    var local = this;
    for (let i = 0; i < e.target.files.length; i++) {
      const document = e.target.files[i];
      let reader = new FileReader();
      reader.readAsDataURL(document);
      if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
        this.provModelo.typoContratos = document.type;
        this.validator.correctoTR("#trDocContratos");
        this.provModelo.docContratos = document
        reader.onload = function () {
          //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
          //let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
          local.regresaHtmlContratos(reader.result);
        };
      } else {
        this.validator.errorTR("#trDocContratos");
        this.provModelo.htmlContratos = "";
        if (document.size > 2000000) {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
        }
        if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
        }
      }
    }
  }

  regresaHtmlContratos(text_document: any) {
    this.provModelo.htmlContratos = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
  }

  deleteDocContratos() {
    var file_contratos = document.getElementById("file_contratos");
    this.provModelo.htmlContratos = "";
    this.provModelo.docContratos = "";
    this.validator.limpiaTR("#trDocContratos");
    this.validator.limpiaInputRow(file_contratos);
  }

  clickEscannercontratos() {//readerSitFiscalProv
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        //console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("readerContratosProv", config, false);
    codeQrstfiscal.render(this.scanYesCumplimiento, this.onScanErrorCumplim);
  }

  scanYesContratos(decodedText: any, decodedResult: any) {
    //console.log(`Scan result: ${decodedText}`, decodedResult);
    global.imagenUrlClFrvQrContratos = decodedText;
    $("#divImgClassContratosProv").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaContratosProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + decodedText + '" frameborder="0"></iframe>';
    $("#divImgClassContratosProv").html(imgPerfil);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'my-swal-zindex'
      }
    })
  }

  onScanErrorContratos(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(typoElement) == true) {
            this.files_anexos.push(file);
            console.log(this.validator.devuelveTipoArchivo(typoElement));
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (this.validator.filtroTipoArchivo(typoElement) == false) {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, jpg, png o paqueteria office';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000,
              customClass: {
                popup: 'my-swal-zindex'
              }
            })
            this.files_anexos.splice(i, 1);
            this.files.splice(i, 1);
            return;
          }

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  deleteAnexos(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo seleccionado?" + posicion,
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.files_anexos.splice(posicion, 1);
          this.files.splice(posicion, 1);
          console.log(this.files_anexos.length);
        }
      }
    );
  }

  cargaDocscumplimiento(e: any) {
    var local = this;
    for (let i = 0; i < e.target.files.length; i++) {
      const document = e.target.files[i];
      let reader = new FileReader();
      reader.readAsDataURL(document);
      if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
        this.provModelo.typoCumplimientoObFiscales = document.type;
        this.validator.correctoTR("#trDocCumplimientoObFiscales");
        this.provModelo.docCumplimientoObFiscales = document
        reader.onload = function () {
          //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
          //let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
          local.regresaHtmlCumplimientoObFiscales(reader.result);
        };
      } else {
        this.validator.errorTR("#trDocCumplimientoObFiscales");
        this.provModelo.htmlCumplimientoObFiscales = "";
        if (document.size > 2000000) {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
        }
        if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
        }
      }
    }
  }

  regresaHtmlCumplimientoObFiscales(text_document: any) {
    this.provModelo.htmlCumplimientoObFiscales = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
  }

  deleteDocCumplimientoObFiscales() {
    var file_cumplimiento_obfisc = document.getElementById("file_cumplimiento_obfisc");
    this.provModelo.htmlCumplimientoObFiscales = "";
    this.provModelo.docCumplimientoObFiscales = "";
    this.validator.limpiaTR("#trDocCumplimientoObFiscales");
    this.validator.limpiaInputRow(file_cumplimiento_obfisc);
  }

  clickEscannercumplimiento() {//readerSitFiscalProv
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        //console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("readerOpinionCumplimientoProv", config, false);
    codeQrstfiscal.render(this.scanYesCumplimiento, this.onScanErrorCumplim);
  }

  scanYesCumplimiento(decodedText: any, decodedResult: any) {
    //console.log(`Scan result: ${decodedText}`, decodedResult);
    global.imagenUrlClFrvQrCumplim = decodedText;
    $("#divImgClassCumplimientoObFiscalProv").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + decodedText + '" frameborder="0"></iframe>';
    $("#divImgClassCumplimientoObFiscalProv").html(imgPerfil);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'my-swal-zindex'
      }
    })
  }

  onScanErrorCumplim(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }

  //credito
  aceptaCreditoProv(event: any) {
    this.provModelo.decideaceptcredito = event.checked ? true : false;
    event.checked ? $("#decidecredito").removeClass("noneView") : $("#decidecredito").addClass("noneView");
    if (this.provModelo.decideaceptcredito && this.catalogo_monedas_api.length === 0) this.listarMonedas();
  }

  monedaChange(opcion: any) {
    console.log(opcion._filtro_busqueda);
    var creditoMonedaProv = document.getElementById("creditoMonedaProv");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.provModelo.token_monedaOrden = typeof mnd !== 'undefined' ? mnd.code : '';
    this.provModelo.decimales_monedaOrden = typeof mnd !== 'undefined' ? mnd.decimales : '';
    //this.pay_order_tipo_cambio = typeof mnd !== 'undefined' && mnd.code == "MXN" ? 1.00 : 0;
    typeof mnd !== 'undefined' ? this.validator.correctoSelectBrowser(creditoMonedaProv) : this.validator.errorSelectBrowser(creditoMonedaProv);
  }

  keyupLimiteCredito(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.provModelo.limite_credito = validacion ? numeral(event.value).format('$0,0.00') : numeral("0.00").format('$0,0.00');
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keypressLimiteCredito(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[0-9$.,]+$/.test(clave))) {
      this.validator.deten(event);
    }
  }

  keyupDiasPagoCredito(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.provModelo.dias_pago_credito = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keypressDiasPagoCredito(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[0-9$.,]+$/.test(clave))) {
      this.validator.deten(event);
    }
  }

  changeComienzaPagoProv(valor:any){
    var creditoComiCompDeDiasDeCredProv = document.getElementById("creditoComiCompDeDiasDeCredProv");
    const c_pago = this.cred_comienza_pago.find((row:any) => row.valor === valor);
    const validacion = valor != "" && typeof c_pago !== 'undefined' && this.validator.filtroAlfaNumerico(c_pago?.clave);
    this.provModelo.comienzacomputo_credito = validacion ? valor : '';
    validacion ? this.validator.correctoSelectBrowser(creditoComiCompDeDiasDeCredProv) : this.validator.errorSelectBrowser(creditoComiCompDeDiasDeCredProv);
  }

  //forma de pago
  tieneFormaPagoProv(event: any) {
    this.provModelo.decideformapago = event.checked ? true : false;
    event.checked ? $("#decideformapago").removeClass("noneView") : $("#decideformapago").addClass("noneView");
    if (this.provModelo.decideformapago && this.arraYFormaPago.length === 0) this.listFormaPago();
  }

  listFormaPago() {
    this._fpago.getformapago().subscribe((data: InterfPagoForma[]) => {
      this.arraYFormaPago = data;
    })
  }

  changeFormaPagoAltaProv(event: any) {
    let fpag = this.arraYFormaPago.find((row: any) => row.forma === event.value);
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof fpag !== 'undefined';
    this.provModelo.tknFormaPagoProv = validacion ? fpag.token_formapago : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    if (!validacion) this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'forma de pago invalida, revisa tu información o comunicate a soporte', life: 3000 });
  }

  cargaDocsEstadoCuenta(e: any) {
    var local = this;
    for (let i = 0; i < e.target.files.length; i++) {
      const document = e.target.files[i];
      let reader = new FileReader();
      reader.readAsDataURL(document);
      if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
        this.provModelo.typoEstadoCuenta = document.type;
        this.validator.correctoTR("#trDocEstadoCuenta");
        this.provModelo.docEstadoCuenta = document;

        reader.onload = function (this) {
          //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
          //let imgPerfil = '<iframe id="framedocSituacionFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
          local.regresaHtmlEstadoCuenta(reader.result);
        }
      } else {
        this.validator.errorTR("#trDocEstadoCuenta");
        this.provModelo.typoEstadoCuenta = "";
        this.provModelo.htmlEstadoCuenta = "";
        if (e.target.files[0].size > 2000000) {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
        }
        if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
          this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
        }
      }
      console.log(this.provModelo.htmlEstadoCuenta);
    }
  }

  regresaHtmlEstadoCuenta(text_document: any) {
    this.provModelo.htmlEstadoCuenta = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
  }

  deleteDocEstadoCuenta() {
    var file_estado_cuenta = document.getElementById("file_estado_cuenta");
    this.provModelo.htmlEstadoCuenta = "";
    this.provModelo.docEstadoCuenta = "";
    this.validator.limpiaTR("#trDocCumplimientoObFiscales");
    this.validator.limpiaInputRow(file_estado_cuenta);
  }

  clickEscannerEstadoCuenta() {//readerSitFiscalProv
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        //console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("readerEstadoCuenta", config, false);
    codeQrstfiscal.render(this.scanYesEstadoCuenta, this.onScanErrorEstadoCuenta);
  }

  scanYesEstadoCuenta(decodedText: any, decodedResult: any) {//console.log(`Scan result: ${decodedText}`, decodedResult);
    global.imagenUrlClFrvQrEstcuenta = decodedText;
    $("#divImgClassEstadoCuenta").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + decodedText + '" frameborder="0"></iframe>';
    $("#divImgClassEstadoCuenta").html(imgPerfil);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'my-swal-zindex'
      }
    })
  }

  onScanErrorEstadoCuenta(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }


  decideTipoReferenciaPago(event: any, referenciaPago: any) {
    $("#txtClabeInt").prop("checked", false);
    $("#txtConvenio").prop("checked", false);
    $("#txtLineaCap").prop("checked", false);

    if (referenciaPago != '' && this.validator.strFilEmp(referenciaPago) == true) {
      if (referenciaPago == "clabeInterbancaria") {
        this.provModelo.tipoReferenciaPago = 'ci';
      } else if (referenciaPago == "convenio") {
        this.provModelo.tipoReferenciaPago = 'co';
        this.provModelo.clabeInterbancariaPago = "000-000-00000000000-0";
      } else if (referenciaPago == "lineaCaptura") {
        this.provModelo.tipoReferenciaPago = 'lc';
        this.provModelo.clabeInterbancariaPago = "000-000-00000000000-0";
      }
      $(event).prop("checked", true);
    } else {
      this.provModelo.tipoReferenciaPago = "";
      this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Error en elección', life: 3000 });
    }
  }

  keyupClabeIntBanc_banco(event: any) {
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 3;
    this.provModelo.clabeInterbancariaBanco = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.llenaClabeInterbancaria();
  }

  keyupClabeIntBanc_plaza(event: any) {
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 3;
    this.provModelo.clabeInterbancariaPlaza = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.llenaClabeInterbancaria();
  }

  keyupClabeIntBanc_cuenta(event: any) {
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 11;
    this.provModelo.clabeInterbancariaCuenta = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.llenaClabeInterbancaria();
  }

  keyupClabeIntBanc_control(event: any) {
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 1;
    this.provModelo.clabeInterbancariaControl = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.llenaClabeInterbancaria();
  }

  llenaClabeInterbancaria() {
    const valida_clabeIntbBanco = this.provModelo.clabeInterbancariaBanco != '' && this.validator.filtroCuenta(this.provModelo.clabeInterbancariaBanco) && this.provModelo.clabeInterbancariaBanco.length == 3;
    const valida_clabeIntbPlaza = this.provModelo.clabeInterbancariaPlaza != '' && this.validator.filtroCuenta(this.provModelo.clabeInterbancariaPlaza) && this.provModelo.clabeInterbancariaPlaza.length == 3;
    const valida_clabeIntbCuenta = this.provModelo.clabeInterbancariaCuenta != '' && this.validator.filtroCuenta(this.provModelo.clabeInterbancariaCuenta) && this.provModelo.clabeInterbancariaCuenta.length == 11;
    const valida_clabeIntbControl = this.provModelo.clabeInterbancariaControl != '' && this.validator.filtroCuenta(this.provModelo.clabeInterbancariaControl) && this.provModelo.clabeInterbancariaControl.length == 1;
    const allClabeInterbancaria = valida_clabeIntbBanco && valida_clabeIntbPlaza && valida_clabeIntbCuenta && valida_clabeIntbControl;
    this.provModelo.clabeInterbancariaPago = allClabeInterbancaria ? this.provModelo.clabeInterbancariaBanco + '-' + this.provModelo.clabeInterbancariaPlaza + '-' + this.provModelo.clabeInterbancariaCuenta + '-' + this.provModelo.clabeInterbancariaControl : "000-000-00000000000-0";
  }

  keypressClabeIntBanc(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!/^[0-9]*$/.test(clave)) {
      this.validator.deten(event);
    }
  }

  //facturacion
  recibeFactAntesDespues(event: any) {
    console.log(event.checked);
    this.provModelo.receptFactura = event.checked == true ? true : false;
  }

  recibeProdAntesDespues(event: any) {
    console.log(event.checked);
    this.provModelo.classRecibeArtPago = event.checked == true ? true : false;
  }

  //ubicacion
  //extranjera
  keyupUbicaciontxtCodPostalExt(event: any) {
    const validacion = event.value != "" && this.validator.filtroDom(event.value);
    this.provModelo.cod_postal = validacion ? event.value : "";
    this.validateUbicacion = validacion ? true : false;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //nacional
  keyupCPostal_EstName(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.provModelo.new_cod_postal_estado_name = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_Municipio(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.provModelo.new_cod_postal_municipio = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_CP(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value.length == 5;
    this.provModelo.new_cod_postal_cp = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_Colonia(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.provModelo.new_cod_postal_colonia_vinculada = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validateCPostalDesconocido(): boolean {
    const validanewcp_estado = this.provModelo.new_cod_postal_estado_name != "" && this.validator.filtroAlfaNumerico(this.provModelo.new_cod_postal_estado_name);
    const validanewcp_municipio = this.provModelo.new_cod_postal_municipio != "" && this.validator.filtroAlfaNumerico(this.provModelo.new_cod_postal_municipio);
    const validanewcp_cpostal = this.provModelo.new_cod_postal_cp != "" && this.validator.filtroNum(this.provModelo.new_cod_postal_cp) && this.provModelo.new_cod_postal_cp.length == 5;
    const validanewcp_colonia = this.provModelo.new_cod_postal_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.provModelo.new_cod_postal_colonia_vinculada);

    return validanewcp_estado && validanewcp_municipio && validanewcp_cpostal && validanewcp_colonia;
  }

  addListPostalPrime(event: Event) {
    this.popUpAccept = this.translate.instant("swal_yes_insert");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_insert"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this.provModelo.listnewdireccionNac.push({
          "estado": this.provModelo.new_cod_postal_estado_name,
          "municipio": this.provModelo.new_cod_postal_municipio,
          "codigo_postal": this.provModelo.new_cod_postal_cp,
          "colonia": this.provModelo.new_cod_postal_colonia_vinculada
        });
        console.log(this.provModelo.listnewdireccionNac);
        this.validateUbicacion = true;
        this.validator.limpiaInputRow(document.getElementById("newDipoMexEstado"));
        this.validator.limpiaInputRow(document.getElementById("newDipoMexMunicipio"));
        this.validator.limpiaInputRow(document.getElementById("newDipoMexCP"));
        this.validator.limpiaInputRow(document.getElementById("newDipoMexColonia"));
        this.provModelo.new_cod_postal_estado_name = "";
        this.provModelo.new_cod_postal_municipio = "";
        this.provModelo.new_cod_postal_cp = "";
        this.provModelo.new_cod_postal_colonia_vinculada = "";
      }
    });
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
        this.provModelo.listnewdireccionNac.push({
          "estado": this.provModelo.new_cod_postal_estado_name,
          "municipio": this.provModelo.new_cod_postal_municipio,
          "codigo_postal": this.provModelo.new_cod_postal_cp,
          "colonia": this.provModelo.new_cod_postal_colonia_vinculada
        });
        console.log(this.provModelo.listnewdireccionNac);
      }
    });
  }

  deleteListCPostal(event: Event, posicion: any) {
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        this.provModelo.listnewdireccionNac.splice(posicion, 1);
        if (this.provModelo.listnewdireccionNac.length == 0) {
          this.validateUbicacion = false;
        }
      }
    });
  }

  //funciones de registro
  get validateToRegistro():Boolean {
    const v_reembolsos = !this.provModelo.habilitado_para_reembolsos || (this.provModelo.habilitado_para_reembolsos && this.provModelo.email_para_reembolsos != '' && this.validator.filtroCorreo(this.provModelo.email_para_reembolsos));
    const v_contacto = !this.provModelo.decideinfocontacto || (this.provModelo.decideinfocontacto && this.provModelo.listaContactoPersonal.length > 0);
    const v_fiscales = !this.provModelo.tiene_docs_fiscales || this.provModelo.tiene_docs_fiscales && this.provModelo.docSituacionFiscal != null && this.provModelo.docCumplimientoObFiscales != null;
    const v_credito = !this.provModelo.decideaceptcredito || (this.provModelo.decideaceptcredito && this.provModelo.token_monedaOrden != "" && this.provModelo.limite_credito != "" && this.provModelo.dias_pago_credito != 0 && this.validator.filtroNum(this.provModelo.dias_pago_credito));
    const v_fpag = !this.provModelo.decideformapago || (this.provModelo.decideformapago && this.provModelo.tknFormaPagoProv != "" && this.provModelo.docEstadoCuenta != null && this.provModelo.docSituacionFiscal != null && this.provModelo.tipoReferenciaPago != '' &&
      this.validator.strFilEmp(this.provModelo.tipoReferenciaPago));

    return this.validatePersonales && v_reembolsos && v_contacto && v_fiscales && v_credito && v_fpag && this.validateUbicacion;
  }

  solicitaRegistroProveedor(form:{reset:() => void;}): void {
    if (this.validatePersonales && this.validateUbicacion) {
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
          this._provServ.registraProveedor(
            this.provModelo.rfc_generico,
            this.provModelo.rfc,
            this.provModelo.id_tax,
            this.vClasificacionProv,
            this.vSubClasificacionProv,
            this.provModelo.name_prov,
            this.provModelo.habilitado_para_reembolsos,
            this.provModelo.email_para_reembolsos,

            this.provModelo.comercial_nombre,
            this.provModelo.curp,
            this.provModelo.paistoken,
            this.provModelo.sitio_web,
            [],
            this.provModelo.tknRegimenFiscal,
            this.provModelo.cuenta_contable,

            this.provModelo.decideinfocontacto,
            this.provModelo.listaContactoPersonal,

            this.provModelo.tiene_docs_fiscales,
            this.provModelo.docSituacionFiscal,
            global.imagenUrlClFrvQrFiscal,
            this.provModelo.docCumplimientoObFiscales,
            global.imagenUrlClFrvQrCumplim,
            this.provModelo.docContratos,
            this.files_anexos,
            this.provModelo.noCargaDocsFiscalesRazon,

            this.provModelo.decideaceptcredito,
            this.provModelo.token_monedaOrden,
            this.provModelo.limite_credito,
            this.provModelo.dias_pago_credito,
            this.provModelo.comienzacomputo_credito,
            this.provModelo.decideformapago,
            this.provModelo.tknFormaPagoProv,
            this.provModelo.docEstadoCuenta,
            global.imagenUrlClFrvQrEstcuenta,
            this.provModelo.tipoReferenciaPago,
            this.provModelo.clabeInterbancariaPago,
            this.provModelo.receptFactura,
            this.provModelo.classRecibeArtPago,

            this.provModelo.cod_postal,
            this.provModelo.dipomex_cod_postal_estado,
            this.provModelo.dipomex_cod_postal_municipio,
            this.provModelo.dipomex_cod_postal_cp,
            this.provModelo.dipomex_cod_postal_colonia_vinculada,
            this.provModelo.listnewdireccionNac,
          ).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function () {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000,
                    customClass: {
                      popup: 'my-swal-zindex'
                    }
                  })
                }, 1000);
                this.comeBackPrincipalMenu();
                form.reset();
                this.formAddProv.resetForm();
                this.relInterna.mensajeProveedorRegistro("registro aprobado");
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
  }

}
