import { Component, OnInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input } from "@angular/core";
import { Usuarios } from "../../../../../../modelos/Usuarios";
import { global } from "../../../../../../servicios/global_ssic"; 
import { HttpCancelService } from "../../../../../../servicios/ssic/http-cancel.service";
import { ClientesService } from "../../../../../../servicios/ssic/clientes.service";
import { InterfPais } from "../../../../../../interfaces/interf-pais";
import { PaisService } from "../../../../../../servicios/ssic/pais.service";
import { DireccionesService } from "../../../../../../servicios/ssic/direcciones.service";
import { MonedasService } from "../../../../../../servicios/monedas.service";
import { InterfPagoForma } from "../../../../../../interfaces/interf-pago-forma";
import { FormaPagoService } from "../../../../../../servicios/ssic/forma-pago.service";
import { MetodoPagoServService } from "../../../../../../servicios/ssic/metodo-pago-serv.service";
import { InterfMetodoPago } from "../../../../../../interfaces/interf-metodo-pago";
import { ValidatorServService } from "../../../../../../servicios/validator-serv.service";
import { ServEncryptService } from "../../../../../../servicios/ssic/serv-encrypt.service";
import { TranslateService } from "@ngx-translate/core";
import { clienteModelo } from "../../../../../../modelos/clienteModelo";
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from "ngx-file-drop";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import numeral from 'numeral';
import { Html5QrcodeScanner } from "html5-qrcode";
// To use Html5Qrcode (more info below)
import { Html5Qrcode } from "html5-qrcode";
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { CountryISO, NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import { RegimenFiscalService } from "../../../../../../servicios/regimen-fiscal.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-interno-ingresos-catalogos-altaclient',
  templateUrl: './altaclientesingresos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/div_busqueda.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/ubicaciones.css',
    '../../../ingresos.css',
    './altaclientesingresos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})

export class AltaClientesIngresosComponent implements OnInit {
  public usuario: Usuarios;
  //public prov_Modelo: proveedorModelo;
  public modeloCliente: clienteModelo;

  contactoCollapsed: boolean = true;

  //nuevo registro
  AllRegFisArray: any = [];
  PfAllRegFisArray: any = [];
  PmAllRegFisArray: any = [];
  pageAltaPostales: number = 1;
  arraYpais: InterfPais[] = [];
  catalogo_monedas_api: any = [];
  prorrateo_moneda_opcion = null;
  cred_comienza_cobro: any = [];

  public validateRfcExtBool: boolean = true;
  public validateIdTaxBool: boolean = true;
  public validateFoundClient: boolean = false;

  public vClasificacionClient: string = "";
  public vSubClasificacionClient: string = "";
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
  public txtContactoPaternoClient_reg: string = "";
  public txtContactoMaternoClient_reg: string = "";
  public txtContactoNombresClient_reg: string = "";
  public txtContactoAreaClient_reg: string = "";
  public txtContactoCargoClient_reg: string = "";
  public txtMailPersonalClient_reg: string = "";
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
  listaFormasCobro: InterfPagoForma[] = [];
  arraYMetodoPago: InterfMetodoPago[] = [];

  public popUpAccept: string = "";
  public popUpReject: string = "";
  options = {};
  @ViewChild('frmAddProv') formAddProv!: NgForm;
  @ViewChild('popOverMails') popOverMails!: Popover;
  @ViewChild('popOverPhone') popOverPhone!: Popover;

  constructor(
    public renderer: Renderer2,
    public _fcobro: FormaPagoService,
    public _metPago: MetodoPagoServService,
    private routerr: Router,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private httpCancelServ: HttpCancelService,

    //clientes
    private _client:ClientesService,
    private dirServ:DireccionesService,
    public _pais: PaisService,
    public _monedasServ: MonedasService,
    private _regimen:RegimenFiscalService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.modeloCliente = new clienteModelo(
      "",//tipoProv
      "",//subtipoProv
      "",//rfc_generico
      "",//rfc
      "",//rfc_back
      "",//id_tax
      "",//id_tax_back
      "",//name_prov
      "",//name_prov_back

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
      phone: ['', Validators.required]
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

    this.cred_comienza_cobro = [
      {clave: 'Cada inicio de mes', valor: 'cada.inicio.mes'},
      {clave: 'Se emite/envía orden de cobro', valor: 'sistem.emite.orden.cobro'},
      {clave: 'Se emite factura al cliente', valor: 'seemite.facturaal.cliente'},
      {clave: 'El producto salga de nuestras bodegas', valor: 'producto.sale.nuestras.bodegas'},
      {clave: 'El producto es entregado en las bodegas del cliente', valor: 'producto.entregado.bodegas.proveedor'},
    ];

    //this.listFormaCobro();
  }

  listarPaises(){
    this._pais.getListaPais().subscribe((data:InterfPais[]) => {
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
      //
    });

    this._regimen.getPfRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PfAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PfAllRegFisArray);
      //
    });

    this._regimen.getPmRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PmAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PmAllRegFisArray);
      //
    });
  }

  //nuevo registro
    buscaCodPostalDipomex(event:any){
      if (event.value != "" && event.value.length == 5) {
        this.validator.correctoInputRow(event);
        this.modeloCliente.dipomex_cod_postal_colonias.length = 0;
        this.modeloCliente.dipomex_cod_postal_estado = "";
        this.modeloCliente.dipomex_cod_postal_municipio = "";
        this.modeloCliente.dipomex_cod_postal_cp = "";
        this.modeloCliente.dipomex_cod_postal_colonia_vinculada = "";

        this.dirServ.postCodPostalDipomex(event.value).subscribe(
          response => {
            if (response.status == "success") {
              console.log(response.cod_postal);
              this.modeloCliente.dipomex_cod_postal_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
              this.modeloCliente.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
              this.modeloCliente.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
              this.modeloCliente.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
              if (response.cod_postal["colonias"].length == 1) {
                this.modeloCliente.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
                this.validateUbicacion = true;
              } else {
                this.validateUbicacion = false;
              }
            } else {
              this.validateUbicacion = false;
              Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
              if (response.message == "postal_empty") {
                this.modeloCliente.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
                this.modeloCliente.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
                this.modeloCliente.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
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

    seleccionaColoniaCPDipomex(colonia_name:any){
      if (colonia_name != "") {
        for (let i = 0; i < this.modeloCliente.dipomex_cod_postal_colonias.length; i++) {
          if (this.modeloCliente.dipomex_cod_postal_colonias[i] == colonia_name) {
            this.modeloCliente.dipomex_cod_postal_colonia_vinculada = colonia_name;
            this.validateUbicacion = true;
          }
        }
      } else {
        this.validateUbicacion = false;
      }
    }

    tipoNacionalidadSelectClient(event:any,tipoClient:any,subtipoClient:any,botonAction:any){
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

      if (tipoClient == "nacional") {
        var verif_rfcClient = document.getElementById("verif_rfcClient");
        this.validator.limpiaInput(verif_rfcClient);
        var verif_idTaxClient = document.getElementById("verif_idTaxClient");
        this.validator.limpiaInput(verif_idTaxClient);
        var verifNameClienteExt_reg = document.getElementById("verifNameClienteExt_reg");
        this.validator.limpiaInput(verifNameClienteExt_reg);
        this.vClasificacionClient = "nacional";
        this.modeloCliente.tipoClient = "nacional";
        if(subtipoClient == "clientFisica"){
          this.vSubClasificacionClient = "clientFisica";
          this.modeloCliente.subtipoClient = "clientFisica";
          this.modeloCliente.rfc_generico = this.rfcGenericoPF;
        }

        if (subtipoClient == "clientMoral"){
          this.vSubClasificacionClient = "clientMoral";
          this.modeloCliente.subtipoClient = "clientMoral";
          this.modeloCliente.rfc_generico = this.rfcGenericoPM;
        }
      }
      if (tipoClient == "extranjero") {
        var verif_rfcClient = document.getElementById("verif_rfcClient");
        this.validator.limpiaInput(verif_rfcClient);
        var verifNameCliente_reg = document.getElementById("verifNameCliente_reg");
        this.validator.limpiaInput(verifNameCliente_reg);
        this.vClasificacionClient = "extranjero";
        this.modeloCliente.tipoClient = "extranjero";
        this.modeloCliente.rfc_generico = this.rfcGenericoExt;
        if(subtipoClient == "clientFisica"){
          this.vSubClasificacionClient = "clientFisica";
          this.modeloCliente.subtipoClient = "clientFisica";
        }

        if (subtipoClient == "clientMoral"){
          this.vSubClasificacionClient = "clientMoral";
          this.modeloCliente.subtipoClient = "clientMoral";
        }
      }
      //this.modeloCliente.subtipoClient = "";
      this.modeloCliente.rfc = "";
      this.modeloCliente.id_tax = "";
      this.modeloCliente.name_client = "";
    }

    checksubtipoClient(event:any,subtipoClient:any){
      if (this.vClasificacionClient != "") {
        if (this.modeloCliente.tipoClient == "nacional") {
          if(subtipoClient == "clientFisica"){
            this.vSubClasificacionClient = "clientFisica";
            this.modeloCliente.subtipoClient = "clientFisica";
            this.modeloCliente.rfc_generico = this.rfcGenericoPF;
          }

          if (subtipoClient == "clientMoral"){
            this.vSubClasificacionClient = "clientMoral";
            this.modeloCliente.subtipoClient = "clientMoral";
            this.modeloCliente.rfc_generico = this.rfcGenericoPM;
          }
        }

        if (this.modeloCliente.tipoClient == "extranjero") {
          this.modeloCliente.rfc_generico = this.rfcGenericoExt;
          if(subtipoClient == "clientFisica"){
            this.vSubClasificacionClient = "clientFisica";
            this.modeloCliente.subtipoClient = "clientFisica";
          }

          if (subtipoClient == "clientMoral"){
            this.vSubClasificacionClient = "clientMoral";
            this.modeloCliente.subtipoClient = "clientMoral";
          }
        }

        //this.modeloCliente.rfc = "";
        //this.modeloCliente.id_tax = "";
        //this.modeloCliente.name_client = "";
      }
    }

    keyupverif_rfcClient(event:any){
      if (event.value != "") {
        if (this.vSubClasificacionClient == "clientFisica") {
          var cdna1 = event.value.substring(0,4);
          var cdna2 = event.value.substring(4,10);
          var cdna3 = event.value.substring(10,13);
          if (/^[a-zA-Z]+$/.test(cdna1)) {
            if (/^[0-9]+$/.test(cdna2)) {
              if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 13) {
                this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
                this.modeloCliente.rfc = event.value;
              } else {
                this.validator.errorInput(event,"rfc del cliente no es correcto");
                this.modeloCliente.rfc = "";
              }
            } else {
              this.validator.errorInput(event,"rfc del cliente no es correcto");
              this.modeloCliente.rfc = "";
            }
          } else {
            this.validator.errorInput(event,"rfc del cliente no es correcto");
            this.modeloCliente.rfc = "";
          }
        }
        if (this.vSubClasificacionClient == "clientMoral") {
          var cdna1 = event.value.substring(0,3);
          var cdna2 = event.value.substring(3,9);
          var cdna3 = event.value.substring(9,12);
          if (/^[a-zA-Z]+$/.test(cdna1)) {
            if (/^[0-9]+$/.test(cdna2)) {
              if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 12) {
                this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
                this.modeloCliente.rfc = event.value;
              }
              else{
                this.validator.errorInput(event,"rfc del cliente no es correcto");
                this.modeloCliente.rfc = "";
              }
            }
            else{
              this.validator.errorInput(event,"rfc del cliente no es correcto");
              this.modeloCliente.rfc = "";
            }
          }
          else{
            this.validator.errorInput(event,"rfc del cliente no es correcto");
            this.modeloCliente.rfc = "";
          }
        }
      } else {
        if (this.vSubClasificacionClient == "clientFisica") {
          this.modeloCliente.rfc = "";
          this.validator.errorInput(event,"Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
        }
        if (this.vSubClasificacionClient == "clientMoral") {
          this.modeloCliente.rfc = "";
          this.validator.errorInput(event,"Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
        }
      }
    }

    validaExtseleccion(){
      return (this.modeloCliente.tipoClient == '' || this.modeloCliente.tipoClient == 'nacional' || this.modeloCliente.subtipoClient == '');
    }
    
    keyupverif_rfcExtClient(event:any){
      if (event.value != "" && this.validator.strFilter(event.value)) {
        this.validator.correctoInput(event,"Escriba su rfc");
        this.validateRfcExtBool = true;
        this.modeloCliente.rfc = event.value;
      } else {
        this.modeloCliente.rfc = "";
        this.validateRfcExtBool = false;
        this.validator.errorInput(event,"Rfc incorrecto");
      }
    }

    keyupverif_TaxIdClient(event:any){
      if (event.value != "") {
        if (event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value)) {
          this.validator.correctoInput(event,"Escriba Tax ID del cliente");
          this.validateIdTaxBool = true;
          this.modeloCliente.id_tax = event.value;
        } else {
          this.validator.errorInput(event,"Tax ID del cliente no es correcto");
          this.validateIdTaxBool = false;
          this.modeloCliente.id_tax = "";
        }
      } else {
        this.modeloCliente.id_tax = "";
        this.validateIdTaxBool = false;
        this.validator.errorInput(event,"Tax ID del cliente no es correcto");
      }
    }

    functllenaRFcGenerico(event:any){
      $("#verif_rfcClient").val("");
      $("#verif_rfcClient").attr("disabled","disabled");
      if (this.modeloCliente.tipoClient == "nacional") {
        if (this.modeloCliente.subtipoClient != "") {
          if (this.modeloCliente.subtipoClient == "clientFisica") {
            this.modeloCliente.rfc = this.rfcGenericoPF;
            $(event).addClass("noneView");
            $("#btnllenaRFcClient").removeClass("noneView");
          }
          if (this.modeloCliente.subtipoClient == "clientMoral") {
            this.modeloCliente.rfc = this.rfcGenericoPM;
            $(event).addClass("noneView");
            $("#btnllenaRFcClient").removeClass("noneView");
          }
        } else {
          $("#verif_rfcClient").removeAttr("disabled");
          $(event).removeClass("noneView");
          $("#btnllenaRFcClient").addClass("noneView");
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de cliente",
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
      if (this.modeloCliente.tipoClient == "extranjero") {
        if (this.modeloCliente.subtipoClient != "") {
          this.modeloCliente.rfc = this.rfcGenericoExt;
          $(event).addClass("noneView");
          $("#btnllenaRFcClient").removeClass("noneView");
        } else {
          $("#verif_rfcClient").removeAttr("disabled");
          $(event).removeClass("noneView");
          $("#btnllenaRFcClient").addClass("noneView");
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de cliente",
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
    }

    functllenaRFcClient(event:any){
      $("#verif_rfcClient").val("");
      if (this.modeloCliente.tipoClient == "nacional") {
        if (this.modeloCliente.subtipoClient != "") {
          if (this.modeloCliente.subtipoClient == "clientFisica") {
            $("#verif_rfcClient").removeAttr("disabled");
            this.modeloCliente.rfc = "";
            $(event).addClass("noneView");
            $("#btnllenaRFcGenerico").removeClass("noneView");
          }
          if (this.modeloCliente.subtipoClient == "clientMoral") {
            $("#verif_rfcClient").removeAttr("disabled");
            this.modeloCliente.rfc = "";
            $(event).addClass("noneView");
            $("#btnllenaRFcGenerico").removeClass("noneView");
          }
        } else {
          $("#verif_rfcClient").attr("disabled","disabled");
          $(event).removeClass("noneView");
          $("#btnllenaRFcGenerico").addClass("noneView");
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de cliente",
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
      if (this.modeloCliente.tipoClient == "extranjero") {
        if (this.modeloCliente.subtipoClient != "") {
          $("#verif_rfcClient").removeAttr("disabled");
          this.modeloCliente.rfc = "";
          $(event).addClass("noneView");
          $("#btnllenaRFcGenerico").removeClass("noneView");
        } else {
          $("#verif_rfcClient").removeAttr("disabled");
          $(event).removeClass("noneView");
          $("#btnllenaRFcGenerico").addClass("noneView");
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de cliente",
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
    }

    checkNombreClient(valor:any){
      if (valor.value != "" && this.validator.strFilter(valor.value) == true && valor.value.length >= 4) {
        this.validator.correctoInput(valor,"Nombre completo / razón social del cliente");
        this.modeloCliente.name_client = valor.value;
      } else {
        this.validator.errorInput(valor,"Ingresa nombre completo / razón social del cliente");
        this.modeloCliente.name_client = "";
      }
    }

    especificacionesInputRfcClient(){
      let switchCheckSubtipoClient:any = document.getElementById("switchCheckSubtipoClient");
      let backSubtipoClient:any = document.getElementById("backSubtipoClient");
      if (this.modeloCliente.tipoClient != "" && this.modeloCliente.subtipoClient != "") {
        $(switchCheckSubtipoClient).removeAttr("disabled");
        $(backSubtipoClient).removeAttr("disabled");
        if (this.modeloCliente.tipoClient == "nacional") {
          if (this.modeloCliente.subtipoClient == "clientFisica") {
            $("#lbl_cliente").html("Escriba su rfc con Homoclave (13 caracteres Ej. ABCD000000XXX)");
            $("#verif_rfcClient").attr("data-length","13");
            $("#verif_rfcClient").attr("placeholder","Ej. ABCD000000XXX");
            $("#verif_rfcClient").attr("maxlength","13");
          }
          if (this.modeloCliente.subtipoClient == "clientMoral") {
            $("#lbl_cliente").html("");
            $("#verif_rfcClient").attr("data-length","12");
            $("#verif_rfcClient").attr("placeholder","Ej. ABC000000XXX");
            $("#verif_rfcClient").attr("maxlength","12");
          }
        }
        if (this.modeloCliente.tipoClient == "extranjero") {

        }
        $("#btnBuscaClientDB").removeClass("noneView");
      }
    }

    funtcBuscaClientDBNac(){
      let verif_rfcClient:any = document.getElementById("verif_rfcClient");
      let verifNameCliente_reg:any = document.getElementById("verifNameCliente_reg");

      var frc_novacio:any = "";
      if (this.modeloCliente.rfc != "") {
        frc_novacio = this.modeloCliente.rfc;
      } else {
        frc_novacio = this.modeloCliente.rfc_generico;
      }
      console.log(frc_novacio);
      var cdna1ClientFis = frc_novacio.substring(0,4);
      var cdna2ClientFis = frc_novacio.substring(4,10);
      var cdna3ClientFis = frc_novacio.substring(10,13);
      var cdna1clientMoral = frc_novacio.substring(0,3);
      var cdna2clientMoral = frc_novacio.substring(3,9);
      var cdna3clientMoral = frc_novacio.substring(9,12);

      if (this.vClasificacionClient != "" && this.vSubClasificacionClient != "" && this.vClasificacionClient == "nacional") {
        if (this.vSubClasificacionClient == "clientFisica") {
          if (frc_novacio != "" && frc_novacio.length == 13 && this.modeloCliente.name_client != "" &&
            this.validator.strFilter(this.modeloCliente.name_client) == true && this.modeloCliente.name_client.length >= 4 &&
            (/^[a-zA-Z]+$/.test(cdna1ClientFis)) && (/^[0-9]+$/.test(cdna2ClientFis)) && (/^[a-zA-Z0-9]+$/.test(cdna3ClientFis)) ) {

            this.validator.correctoInput(verif_rfcClient,"Escriba su rfc con Homoclave");
            this.validator.correctoInput(verifNameCliente_reg,"Nombre completo / razón social del cliente");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su cliente es Persona Física?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: "Sí, verificar si se encuentra registrado",
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaClientMySQL(this.modeloCliente.rfc_generico,this.modeloCliente.rfc,this.modeloCliente.id_tax,this.modeloCliente.name_client);
              }
            });

          } else {
            let error = "";
            if(this.modeloCliente.name_client == "" || this.validator.strFilter(this.modeloCliente.name_client) == false || this.modeloCliente.name_client.length < 4){
                this.validator.errorInput(verifNameCliente_reg,"Ingresa nombre completo / razón social del cliente");
                error = "Ingresa nombre del cliente";
            }
            if (this.modeloCliente.rfc == "") {
                this.validator.errorInput(verif_rfcClient,"Inserta Rfc de su cliente");
                error = "DEBE REGISTRAR RFC";
            }
            if (this.modeloCliente.rfc.length != 13) {
                this.validator.errorInput(verif_rfcClient,"Su rfc debe contener 13 caracteres");
                error = "su RFC no es correcto";
            }
            if (!/^[a-zA-Z]+$/.test(cdna1ClientFis) || !/^[0-9]+$/.test(cdna2ClientFis) || !/^[a-zA-Z0-9]+$/.test(cdna3ClientFis)) {
                this.validator.errorInput(verif_rfcClient,"Su rfc debe contener 13 caracteres");
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

        if (this.vSubClasificacionClient == "clientMoral") {
          if(frc_novacio != "" && frc_novacio.length == 12 && this.modeloCliente.name_client != "" &&
            this.validator.strFilter(this.modeloCliente.name_client) == true && this.modeloCliente.name_client.length >= 4 &&
            (/^[a-zA-Z]+$/.test(cdna1clientMoral)) && (/^[0-9]+$/.test(cdna2clientMoral)) && (/^[a-zA-Z0-9]+$/.test(cdna3clientMoral))) {

            this.validator.correctoInput(verif_rfcClient,"Escriba su rfc con Homoclave");
            this.validator.correctoInput(verifNameCliente_reg,"Nombre completo / razón social del cliente");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su cliente es Persona Moral?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: "Sí, verificar si se encuentra registrado",
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaClientMySQL(this.modeloCliente.rfc_generico,this.modeloCliente.rfc,this.modeloCliente.id_tax,this.modeloCliente.name_client);
              }
            });
          } else {
            let error = "";
            if(this.modeloCliente.name_client == "" || this.validator.strFilter(this.modeloCliente.name_client) == false || this.modeloCliente.name_client.length < 4){
                this.validator.errorInput(verifNameCliente_reg,"Inserta nombre completo / razón social del cliente");
                error = "Inserta nombre del cliente";
            }
            if (this.modeloCliente.rfc == "") {
                this.validator.errorInput(verif_rfcClient,"Inserta Rfc de su cliente");
                error = "DEBE REGISTRAR RFC";
            }
            if (this.modeloCliente.rfc.length != 12) {
                this.validator.errorInput(verif_rfcClient,"Su rfc debe contener 12 caracteres");
                error = "su RFC no es correcto";
            }
            if (!/^[a-zA-Z]+$/.test(cdna1clientMoral) || !/^[0-9]+$/.test(cdna2clientMoral) || !/^[a-zA-Z0-9]+$/.test(cdna3clientMoral)) {
                this.validator.errorInput(verif_rfcClient,"Su rfc debe contener 12 caracteres");
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
        if (this.vClasificacionClient == "") {
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione cliente nacional o extranjero",
            showConfirmButton:false,
            timer: 3000
          })
        }

        if (this.vSubClasificacionClient == "") {
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

    funtcBuscaClientDBExt(){
      let verif_rfcClient:any = document.getElementById("verif_rfcClientExt");
      let verifNameClienteExt_reg:any = document.getElementById("verifNameClienteExt_reg");
      let verif_idTaxClient:any = document.getElementById("verif_idTaxClient");
      var cdna1ClientFis = this.modeloCliente.rfc.substring(0,4);
      var cdna2ClientFis = this.modeloCliente.rfc.substring(4,10);
      var cdna3ClientFis = this.modeloCliente.rfc.substring(10,13);
      var cdna1clientMoral = this.modeloCliente.rfc.substring(0,3);
      var cdna2clientMoral = this.modeloCliente.rfc.substring(3,9);
      var cdna3clientMoral = this.modeloCliente.rfc.substring(9,12);

      if (this.vClasificacionClient != "" && this.vSubClasificacionClient != "" && this.vClasificacionClient == "extranjero") {

        if (this.modeloCliente.rfc == "" && this.modeloCliente.id_tax == "") {
          if (this.modeloCliente.rfc_generico != "" && this.modeloCliente.rfc_generico.length >= 9 && this.modeloCliente.rfc_generico.length <= 40 &&
            this.modeloCliente.name_client != "" && this.validator.strFilter(this.modeloCliente.name_client) == true && this.modeloCliente.name_client.length >= 4) {
            this.validator.correctoInput(verif_rfcClient,"Escriba su rfc con Homoclave");
            this.validator.correctoInput(verif_idTaxClient,"Escriba su Tax ID con Homoclave");
            this.validator.correctoInput(verifNameClienteExt_reg,"Nombre completo / razón social del cliente");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su cliente es extranjero?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: this.translate.instant("swal_yes_insert"),
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaClientMySQL(this.modeloCliente.rfc_generico,this.modeloCliente.rfc,this.modeloCliente.id_tax,this.modeloCliente.name_client);
              }
            });
          } else {
            let error = "";
            if (this.modeloCliente.rfc_generico == "") {
                error = "Debe registrar Tax ID";
            }
            if (this.modeloCliente.rfc_generico.length < 9 || this.modeloCliente.rfc_generico.length > 40) {
                error = "su RFC no es correcto";
            }
            if(this.modeloCliente.name_client == "" || this.validator.strFilter(this.modeloCliente.name_client) == false || this.modeloCliente.name_client.length < 4){
                this.validator.errorInput(verifNameClienteExt_reg,"Ingresa nombre completo / razón social del cliente");
                error = "Ingresa nombre completo / razón social del cliente";
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
            if (this.modeloCliente.rfc_generico != "" && this.modeloCliente.rfc_generico.length >= 9 && this.modeloCliente.rfc_generico.length <= 40 &&
              this.modeloCliente.name_client != "" && this.validator.strFilter(this.modeloCliente.name_client) == true && this.modeloCliente.name_client.length >= 4) {
              this.validator.correctoInput(verif_rfcClient,"Escriba su rfc con Homoclave");
              this.validator.correctoInput(verif_idTaxClient,"Escriba su Tax ID con Homoclave");
              this.validator.correctoInput(verifNameClienteExt_reg,"Nombre completo / razón social del cliente");
              Swal.fire({
                title: this.translate.instant("swal_attenc"),
                text: "¿Su cliente es extranjero?",
                icon: "warning",
                confirmButtonColor: "#388E3C",
                confirmButtonText: this.translate.instant("swal_yes_insert"),
                showCancelButton: true,
                cancelButtonColor: "#D32F2F",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.validaClientMySQL(this.modeloCliente.rfc_generico,this.modeloCliente.rfc,this.modeloCliente.id_tax,this.modeloCliente.name_client);
                }
              });
            } else {
              let error = "";
              if (this.modeloCliente.rfc_generico == "") {
                  error = "Debe registrar Tax ID";
              }
              if (this.modeloCliente.rfc_generico.length < 9 || this.modeloCliente.rfc_generico.length > 40) {
                  error = "su RFC no es correcto";
              }
              if(this.modeloCliente.name_client == "" || this.validator.strFilter(this.modeloCliente.name_client) == false || this.modeloCliente.name_client.length < 4){
                  this.validator.errorInput(verifNameClienteExt_reg,"Ingresa nombre completo / razón social del cliente");
                  error = "Ingresa nombre completo / razón social del cliente";
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
        if (this.vClasificacionClient == "") {
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione cliente nacional o extranjero",
            showConfirmButton:false,
            timer: 3000
          })
        }

        if (this.vSubClasificacionClient == "") {
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

    validaClientMySQL(rfc_generico:any,rfc:any,id_tax:any,nombre:any){
      this._client.verificaExistsAllCliente(this.vClasificacionClient,this.vSubClasificacionClient,rfc_generico,rfc,id_tax,nombre).subscribe(
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
            this.validateFoundClient = true;
            this.modeloCliente.name_client = nombre;
            this.modeloCliente.rfc_back = rfc;
            this.modeloCliente.id_tax_back = id_tax;
            this.modeloCliente.name_client_back = nombre;
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

    decideEditarDataCliente(){
      this.decisionEditNombre = this.decisionEditNombre == false ? true : false;
    }

    validaNewNombreClient(valor:any){
      if (valor.value != "" && valor.value.length >= 4 && this.validator.strFilter(valor.value) == true && valor.value != this.modeloCliente.name_client) {
        this.validator.correctoInput(valor,"Nombre completo / razón social del cliente");
        this.modeloCliente.name_client_back = valor.value;
      } else {
        this.validator.errorInput(valor,"Ingresa nombre completo / razón social del cliente");
        this.modeloCliente.name_client_back = "";
      }
    }

    validaNewRfcClient(event:any){
      if (this.vSubClasificacionClient == "clientFisica") {
        if (event.value != "" && this.validator.filtroRfcPersFisica(event.value) == true && event.value.length == 13) {
          this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
          this.modeloCliente.rfc_back = event.value;
        } else {
          this.validator.errorInput(event,"Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
          this.modeloCliente.rfc_back = "";
        }
      }
      if (this.vSubClasificacionClient == "clientMoral") {
        if (event.value != "" && this.validator.filtroRfcPersMoral(event.value) == true && event.value.length == 12) {
          this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
          this.modeloCliente.rfc_back = event.value;
        }
        else{
          this.validator.errorInput(event,"Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
          this.modeloCliente.rfc_back = "";
        }
      }
    }

    validaNewTaxIdClient(event:any){
      if (event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value)) {
        this.validator.correctoInput(event,"Escriba Tax ID del cliente");
        this.validateIdTaxBool = true;
        this.modeloCliente.id_tax_back = event.value;
      } else {
        this.validator.errorInput(event,"Tax ID del cliente no es correcto");
        this.validateIdTaxBool = false;
        this.modeloCliente.id_tax_back = "";
      }
    }

    guardaNew_DataCliente(){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_update"),
        icon: "warning",
        confirmButtonColor: "#388E3C",
        confirmButtonText: this.translate.instant("swal_yes_update"),
        showCancelButton: true,
        cancelButtonColor: "#D32F2F",
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._client.verificaExistsAllCliente(this.vClasificacionClient,this.vSubClasificacionClient,this.modeloCliente.rfc_generico,this.modeloCliente.rfc_back,this.modeloCliente.id_tax_back,this.modeloCliente.name_client_back).subscribe(
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
                this.modeloCliente.name_client = this.modeloCliente.name_client_back;
                this.modeloCliente.rfc = this.modeloCliente.rfc_back;
                this.modeloCliente.id_tax = this.modeloCliente.id_tax_back;
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
            error => {
              //console.log(error);
            }
          )

        }
      })
      
    }
    
    comeBackPrincipalMenu(){
      this.validateFoundClient = false;
      this.vClasificacionClient = "";
      this.vSubClasificacionClient = "";
      this.rfcGenericoPF = "xaxx010101000";
      this.rfcGenericoPM = "xax010101000";
      this.rfcGenericoExt = "xexx010101000";
      this.validateRfcExtBool = true;
      this.validateIdTaxBool = true;
      this.validatePersonales = false;
      this.validateUbicacion = false;
      
      this.modeloCliente = new clienteModelo(
        "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "",
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

  //personales
    keyupComercialName(event:any){
      const validacion = event.value != "" && this.validator.strFilEmp(event.value);
      this.modeloCliente.comercial_nombre = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validateAllPersonales();
    }

    keyupCurp(event:any){ //txt_curp
      if (this.vClasificacionClient == "nacional") {
        const validacion = event.value != "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length == 18;
        this.modeloCliente.curp = validacion ? event.value : "";
        validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      } else {
        const validacion = event.value === "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length >= 40;
        this.modeloCliente.curp = validacion ? event.value : "";
        validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      }
      this.validateAllPersonales();
    }

    changePais(token_pais:any){
      var selPaisExtPF_reg = document.getElementById("selPaisExtPF_reg");
      const country = this.arraYpais.find((row:any) => row.token_pais === token_pais);
      const validacion = token_pais != "" && this.validator.filtroAlfaNumerico(country?.pais) && typeof country !== 'undefined';
      this.modeloCliente.paistoken = validacion ? country.token_pais : '';
      validacion ? this.validator.correctoSelectBrowser(selPaisExtPF_reg) : this.validator.errorSelectBrowser(selPaisExtPF_reg);
      this.validateAllPersonales();
    }

    changeSitioWeb(event:any){
      const validacion = event.value != "" && this.validator.filtroUrl("https://" + event.value);
      this.modeloCliente.sitio_web = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validateAllPersonales();
    }

    changeRegimenFiscal(token_regimen_fiscal:any){
      var selRegimenFiscal = document.getElementById("selRegimenFiscal");
      const regfis = this.AllRegFisArray.find((row:any) => row.token_regimen_fiscal === token_regimen_fiscal);
      const validacion = token_regimen_fiscal != "" && this.validator.filtroAlfaNumerico(regfis?.regimen) && typeof regfis !== 'undefined';
      this.modeloCliente.tknRegimenFiscal = validacion ? regfis.token_regimen_fiscal : '';
      validacion ? this.validator.correctoSelectBrowser(selRegimenFiscal) : this.validator.errorSelectBrowser(selRegimenFiscal);
      this.validateAllPersonales();
    }

    keyupValidateCuentaContableClient(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.modeloCliente.cuenta_contable = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validateAllPersonales();
    }

    validateAllPersonales(){
      var txtComercial_name:any = document.getElementById("txtComercial_name");
      var txt_curp:any = document.getElementById("txt_curp");
      var selPaisExtPF_reg:any = document.getElementById("selPaisExtPF_reg");
      var txtsitWebPF_reg:any = document.getElementById("txtsitWebPF_reg");
      var selRegimenFiscal:any = document.getElementById("selRegimenFiscal");
      var cuentaContableClient:any = document.getElementById("cuentaContableClient");
      
      this.validatePersonales = true;
      
      if (this.modeloCliente.comercial_nombre) {
        if (!this.validator.strFilEmp(this.modeloCliente.comercial_nombre)) {
          this.validator.errorInputRow(txtComercial_name);
          this.validatePersonales = false;
          return;
        }
      }
  
      if (this.modeloCliente.subtipoClient == "clientFisica" && this.modeloCliente.curp) {
        const OKCurp = /^[a-zA-Z0-9]+$/.test(this.modeloCliente.curp) && this.modeloCliente.curp.length == 18;
        if (!OKCurp) {
          this.validator.errorInputRow(txt_curp);
          this.validatePersonales = false;
          //return;
        }
      }
  
      if (this.vClasificacionClient == "extranjero" && !this.modeloCliente.paistoken) {
        this.validator.errorSelectBrowser(selPaisExtPF_reg);
        this.validatePersonales = false;
        //return;
      }
  
      if (this.modeloCliente.sitio_web) {
        if (!this.validator.filtroUrl("https://" + this.modeloCliente.sitio_web)) {
          this.validator.errorInputRow(txtsitWebPF_reg);
          this.validatePersonales = false;
          //return;
        }
      }
  
      if (!this.modeloCliente.tknRegimenFiscal) {
        this.validator.errorSelectBrowser(selRegimenFiscal);
        this.validatePersonales = false;
        //return;
      }
  
      if (!this.validator.filtroAlfaNumerico(this.modeloCliente.cuenta_contable)) {
        this.validator.errorInputRow(cuentaContableClient);
        this.validatePersonales = false;
        //return;
      }
  
      console.log(this.validatePersonales);
    }

  //contacto
    decideocupaContacto(event:any){
      this.modeloCliente.decideinfocontacto = event.checked ? true : false;
      event.checked ? $("#decideinfocontacto").removeClass("noneView") : $("#decideinfocontacto").addClass("noneView");
    }

    keyupPersContPaterno(event:any){
      const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
      this.txtContactoPaternoClient_reg = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validaFormContacto();
    }

    keyupPersContMaterno(event:any){
      const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
      this.txtContactoMaternoClient_reg = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validaFormContacto();
    }

    keyupPersContNombres(event:any){
      const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 3;
      this.txtContactoNombresClient_reg = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validaFormContacto();
    }

    keyupPersContArea(event:any){
      const validacion = event.value != '' && this.validator.strFilEmp(event.value);
      this.txtContactoAreaClient_reg = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validaFormContacto();
    }

    keyupPersContCargo(event:any){
      const validacion = event.value != '' && this.validator.strFilEmp(event.value);
      this.txtContactoCargoClient_reg = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.validaFormContacto();
    }
    
    verModalContEmail() {
      this.viewMailContModal = true;
    }

    keyupPersContEmail(event:any){
      if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
        this.txtMailPersonalClient_reg = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }

    addMailContacto() {
      var contPersEmail:any = document.getElementById("contPersClientEmail");
      if (this.txtMailPersonalClient_reg != '' && this.validator.filtroCorreo(this.txtMailPersonalClient_reg) == true) {
        this.contPersMailList.push(this.txtMailPersonalClient_reg);
        console.log(this.contPersMailList);
        this.txtMailPersonalClient_reg = '';
        this.validator.limpiaInputRow(contPersEmail);
        this.validaMailTelContacto();
      } else {
        this.validator.errorInputRow(contPersEmail);
        this.validaMailTelContacto();
      }
      this.validaFormContacto();
    }

    deleteMailContacto(position:any) {
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
          this.contPersMailList.splice(position,1);
          if (this.contPersMailList.length == 0) {
            this.validaMailTelContacto();
          }
        }
      });
      this.validaFormContacto();
    }
    
    verModalContTelefono() {
      this.viewTelefonoContModal = true;
    }

    telefonoTipoCont_regChange(event:any){
      this.txtEtiquetaPersonal = event.value != '' && this.validator.filtroAlfaNumerico(event.value) ? event.value : "";
      this.validaFormContacto();
    }

    probarTextPhone(){
      if (this.phoneForm.valid) {
        const phoneNumber = this.phoneForm.get('phone')?.value;
        console.log('Número de teléfono registrado:',phoneNumber);
      }
    }

    telefonoKeyupNumeroCont_reg(event:any){
      if (event.value != "" && event.value.length >= 5 && this.validator.filtroPhone(event.value) == true && this.phoneForm.valid) {
        const phoneNumber = this.phoneForm.get('phone')?.value;
        this.validator.correctoInputRow(event);
        this.txtPhonePersonalAll = phoneNumber;
        console.log(this.txtPhonePersonalAll);
      } else {
        this.txtPhonePersonalAll = "";
        this.validator.errorInputRow(event);
      }
      this.validaFormContacto();
    }

    telefonoKeyupExtension_reg(event:any){
      if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true) {
        this.validator.correctoInputRow(event);
        this.txtPhoneExtPersonal = event.value;
      } else {
        this.txtPhoneExtPersonal = "";
        this.validator.errorInputRow(event);
      }
      this.validaFormContacto();
    }
    
    get validaPhoneContacto(): Boolean {
      const valida_etiqueta = this.txtEtiquetaPersonal != '' && this.validator.strFilter(this.txtEtiquetaPersonal) == true;
      const valida_Phone = this.txtPhonePersonalAll != '';
      const valida_Ext = this.txtPhoneExtPersonal == '' || (this.txtPhoneExtPersonal != '' && this.validator.filtroPhone(this.txtPhoneExtPersonal));
      return valida_etiqueta && valida_Phone && valida_Ext;
    }

    addPhoneContacto() {
      var etiquetaCont_regClient:any = document.getElementById("etiquetaCont_regClient");
      var txtTelefonoCont_reg:any = document.getElementById("txtTelefonoCont_regClient");
      var txtExtension_reg:any = document.getElementById("txtExtension_regClient");

      if ((this.txtEtiquetaPersonal != '' && this.validator.strFilter(this.txtEtiquetaPersonal) == true) && this.txtPhonePersonalAll != '') {
        this.validaMailTelContacto();
        if ((this.txtPhoneExtPersonal == '') || (this.txtPhoneExtPersonal != '' && this.txtPhoneExtPersonal.length >= 1 && this.validator.filtroNum(this.txtPhoneExtPersonal) == true)) {
          this.contPersTelefonoList.push({
            "etiqueta":this.txtEtiquetaPersonal,
            "telefono_complete":this.txtPhonePersonalAll,
            "extension":this.txtPhoneExtPersonal,
          });
          this.txtEtiquetaPersonal = '';
          this.txtPhonePersonalAll = '';
          this.txtPhoneExtPersonal = '';
          this.validator.limpiaSelect(etiquetaCont_regClient);
          this.validator.limpiaInputRow(txtTelefonoCont_reg);
          this.validator.limpiaInputRow(txtExtension_reg);
        } else {
          this.validator.errorInputRow(txtExtension_reg);
        }
        console.log(this.contPersTelefonoList);
      } else {
        this.validaMailTelContacto();
        //M.toast({html: "Complete los campos vacios", classes: 'rounded'});
        if(this.txtEtiquetaPersonal == '' || this.validator.strFilter(this.txtEtiquetaPersonal) == false){
          this.validator.errorInputRow(etiquetaCont_regClient);
        }
        if(this.txtPhonePersonalAll == ''){
          this.validator.errorInputRow(txtTelefonoCont_reg);
        }
      }
      this.validaFormContacto();
    }

    deletePhoneContacto(position:any) {
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.contPersTelefonoList.splice(position,1);
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
  
      const validacionContactoPaterno = this.txtContactoPaternoClient_reg != "" && this.validator.strFilter(this.txtContactoPaternoClient_reg) == true && this.txtContactoPaternoClient_reg.length >= 4;
      const validacionContactoMaterno = this.txtContactoMaternoClient_reg != "" && this.validator.strFilter(this.txtContactoMaternoClient_reg) == true && this.txtContactoMaternoClient_reg.length >= 4;
      const validacionContactoNombres = this.txtContactoNombresClient_reg != "" && this.validator.strFilter(this.txtContactoNombresClient_reg) == true && this.txtContactoNombresClient_reg.length >= 3;
      const validacionContactoArea = this.txtContactoAreaClient_reg != "" && this.validator.strFilEmp(this.txtContactoAreaClient_reg) == true;
      const validacionContactoCargo = this.txtContactoCargoClient_reg != "" && this.validator.strFilEmp(this.txtContactoCargoClient_reg) == true;
      const validacionContactoMailTelefono = this.contPersMailList.length > 0 || this.contPersTelefonoList.length > 0;
  
      !validacionContactoPaterno ? this.validator.errorInputRow(contPersPaterno) : null;
      !validacionContactoMaterno ? this.validator.errorInputRow(contPersMaterno) : null;
      !validacionContactoNombres ? this.validator.errorInputRow(contPersNombres) : null;
      !validacionContactoArea ? this.validator.errorInputRow(contPersArea) : null;
      !validacionContactoCargo ? this.validator.errorInputRow(contPersCargo) : null;
      !validacionContactoMailTelefono ? this.validaMailTelContacto() : null;
    }

    get enableBtnContacto(): Boolean {
      const validacionContactoPaterno = this.txtContactoPaternoClient_reg != "" && this.validator.strFilter(this.txtContactoPaternoClient_reg) == true && this.txtContactoPaternoClient_reg.length >= 4;
      const validacionContactoMaterno = this.txtContactoMaternoClient_reg != "" && this.validator.strFilter(this.txtContactoMaternoClient_reg) == true && this.txtContactoMaternoClient_reg.length >= 4;
      const validacionContactoNombres = this.txtContactoNombresClient_reg != "" && this.validator.strFilter(this.txtContactoNombresClient_reg) == true && this.txtContactoNombresClient_reg.length >= 3;
      const validacionContactoArea = this.txtContactoAreaClient_reg != '' && this.validator.strFilEmp(this.txtContactoAreaClient_reg) == true;
      const validacionContactoCargo = this.txtContactoCargoClient_reg != '' && this.validator.strFilEmp(this.txtContactoCargoClient_reg) == true;
      const validacionContactoMailTelefono = this.contPersMailList.length > 0 || this.contPersTelefonoList.length > 0;
      return validacionContactoPaterno && validacionContactoMaterno && validacionContactoNombres && validacionContactoArea && validacionContactoCargo && validacionContactoMailTelefono;
    }

    validaMailTelContacto(){
      if (this.contPersMailList.length > 0 && this.contPersTelefonoList.length > 0) {
        $("#btnModalPersMailTelMain").removeClass("btnError");
      } else {
        $("#btnModalPersMailTelMain").addClass("btnError");
      }
    }

    clickfunctionaddInfoContacto() {
      var contPersPaterno:any = document.getElementById("contPersClientPaterno");
      var contPersMaterno:any = document.getElementById("contPersClientMaterno");
      var contPersNombres:any = document.getElementById("contPersClientNombres");
      var contPersArea:any = document.getElementById("contPersClientArea");
      var contPersCargo:any = document.getElementById("contPersClientCargo");
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea agregar este personal de contacto?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          
          this.modeloCliente.listaContactoPersonal.push({
            "num_lista":this.modeloCliente.listaContactoPersonal.length + 1,
            "paterno": this.txtContactoPaternoClient_reg,
            "materno": this.txtContactoMaternoClient_reg,
            "nombre": this.txtContactoNombresClient_reg,
            "area": this.txtContactoAreaClient_reg,
            "cargo": this.txtContactoCargoClient_reg,
            "emails": this.contPersMailList,
            "telefonos": this.contPersTelefonoList,
          });
          this.validator.limpiaInputRow(contPersPaterno);
          this.validator.limpiaInputRow(contPersMaterno);
          this.validator.limpiaInputRow(contPersNombres);
          this.validator.limpiaInputRow(contPersArea);
          this.validator.limpiaInputRow(contPersCargo);
          this.contPersMailList = [];
          this.contPersTelefonoList = [];
          //
          console.log(this.modeloCliente.listaContactoPersonal);

        }
      })
    }
    
    toggleMails(event: any) {
      this.popOverMails.toggle(event);
    }
  
    togglePhone(event: any) {
      this.popOverPhone.toggle(event);
    }

    clickfunctiondeleteRegCont(num_lista:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.modeloCliente.listaContactoPersonal.splice(num_lista-1,1);
        }
      });
    }

  //informacion fiscal
    decide_docs_fiscales(event:any){
      this.modeloCliente.tiene_docs_fiscales = event.checked ? true : false;
      event.checked ? $("#decidedocs_fiscales").removeClass("noneView") : $("#decidedocs_fiscales").addClass("noneView");
    }

    cargaDocssitfiscal(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.modeloCliente.typoSituacionFiscal = document.type;
          this.validator.correctoTR("#trDocSitFiscal");
          this.modeloCliente.docSituacionFiscal = document;
          //
          reader.onload = function(this){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="framedocSituacionFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlSitfiscal(reader.result);
          }
        } else {
          this.validator.errorTR("#trDocSitFiscal");
          this.modeloCliente.typoSituacionFiscal = "";
          this.modeloCliente.htmlSituacionFiscal = "";
          if (e.target.files[0].size > 2000000) {
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
          }
          if (this.validator.filtroTipoArchivo(document.type) == false) {
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
          }
        }
        console.log(this.modeloCliente.typoSituacionFiscal);
      }
    }

    regresaHtmlSitfiscal(text_document:any){
      this.modeloCliente.htmlSituacionFiscal = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocSitfiscal(){
      var file_situacion_fiscal = document.getElementById("file_situacion_fiscal");
      this.modeloCliente.htmlSituacionFiscal = "";
      this.modeloCliente.docSituacionFiscal = "";
      this.validator.limpiaTR("#trDocSitFiscal");
      this.validator.limpiaInputRow(file_situacion_fiscal);
    }

    clickEscannersitfiscal(){//readerSitFiscalClient
      var cameraId:any = '';
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          cameraId = devices[0].id;
          //console.log(cameraId);
        }
      }).catch(err => {
        // handle err
      });
      let config:any = {fps:10,qrbox: { width: 250, height: 250 }};
      let codeQrstfiscal:any = new Html5QrcodeScanner("readerSitFiscalClient",config,false);
      codeQrstfiscal.render(this.scanYesSitFiscal,this.onScanError);
    }

    scanYesSitFiscal(decodedText:any, decodedResult:any) {
      //console.log(`Scan result: ${decodedText}`, decodedResult);
      global.imagenUrlClFrvQrFiscal = decodedText;
      //console.log(global.imagenUrlClFrvQrFiscal)
      $("#divImgClassSitfiscalClient").removeClass("btnError");
      let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+decodedText+'" frameborder="0"></iframe>';
      $("#divImgClassSitfiscalClient").html(imgPerfil);
      Swal.fire({
        position:'center',
        icon: 'success',
        title: 'escaneo completado',
        showConfirmButton:false,
        timer: 3000
      })
    }

    onScanError(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}

    cargaDocsContratos(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.modeloCliente.typoContratos = document.type;
          this.validator.correctoTR("#trDocContratos");
          this.modeloCliente.docContratos = document
          reader.onload =  function(){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalClient" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlContratos(reader.result);
          };
        } else {
          this.validator.errorTR("#trDocContratos");
          this.modeloCliente.htmlContratos = "";
          if (document.size > 2000000) {
            //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
          }
          if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
            //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
          }
        }
      }
    }

    regresaHtmlContratos(text_document:any){
      this.modeloCliente.htmlContratos = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocContratos(){
      var file_contratos = document.getElementById("file_contratos");
      this.modeloCliente.htmlContratos = "";
      this.modeloCliente.docContratos = "";
      this.validator.limpiaTR("#trDocContratos");
      this.validator.limpiaInputRow(file_contratos);
    }

    clickEscannercontratos(){//readerSitFiscalClient
      var cameraId:any = '';
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          cameraId = devices[0].id;
          //console.log(cameraId);
        }
      }).catch(err => {
        // handle err
      });
      let config:any = {fps:10,qrbox: { width: 250, height: 250 }};
      let codeQrstfiscal:any = new Html5QrcodeScanner("readerContratosClient",config,false);
      codeQrstfiscal.render(this.scanYesCumplimiento,this.onScanErrorCumplim);
    }

    scanYesContratos(decodedText:any, decodedResult:any) {
      //console.log(`Scan result: ${decodedText}`, decodedResult);
      global.imagenUrlClFrvQrContratos = decodedText;
      $("#divImgClassContratosClient").removeClass("btnError");
      let imgPerfil = '<iframe id="frameimagenAltaContratosClient" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+decodedText+'" frameborder="0"></iframe>';
      $("#divImgClassContratosClient").html(imgPerfil);
      Swal.fire({
        position:'center',
        icon: 'success',
        title: 'escaneo completado',
        showConfirmButton:false,
        timer: 3000
      })
    }

    onScanErrorContratos(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}

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
                timer: 3000
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

    cargaDocscumplimiento(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.modeloCliente.typoCumplimientoObFiscales = document.type;
          this.validator.correctoTR("#trDocCumplimientoObFiscales");
          this.modeloCliente.docCumplimientoObFiscales = document
          reader.onload =  function(){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalClient" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlCumplimientoObFiscales(reader.result);
          };
        } else {
          this.validator.errorTR("#trDocCumplimientoObFiscales");
          this.modeloCliente.htmlCumplimientoObFiscales = "";
          if (document.size > 2000000) {
            //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
          }
          if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
            //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
          }
        }
      }
    }

    regresaHtmlCumplimientoObFiscales(text_document:any){
      this.modeloCliente.htmlCumplimientoObFiscales = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocCumplimientoObFiscales(){
      var file_cumplimiento_obfisc = document.getElementById("file_cumplimiento_obfisc");
      this.modeloCliente.htmlCumplimientoObFiscales = "";
      this.modeloCliente.docCumplimientoObFiscales = "";
      this.validator.limpiaTR("#trDocCumplimientoObFiscales");
      this.validator.limpiaInputRow(file_cumplimiento_obfisc);
    }

    clickEscannercumplimiento(){//readerSitFiscalClient
      var cameraId:any = '';
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          cameraId = devices[0].id;
          //console.log(cameraId);
        }
      }).catch(err => {
        // handle err
      });
      let config:any = {fps:10,qrbox: { width: 250, height: 250 }};
      let codeQrstfiscal:any = new Html5QrcodeScanner("readerOpinionCumplimientoClient",config,false);
      codeQrstfiscal.render(this.scanYesCumplimiento,this.onScanErrorCumplim);
    }

    scanYesCumplimiento(decodedText:any, decodedResult:any) {
      //console.log(`Scan result: ${decodedText}`, decodedResult);
      global.imagenUrlClFrvQrCumplim = decodedText;
      $("#divImgClassCumplimientoObFiscalClient").removeClass("btnError");
      let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalClient" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+decodedText+'" frameborder="0"></iframe>';
      $("#divImgClassCumplimientoObFiscalClient").html(imgPerfil);
      Swal.fire({
        position:'center',
        icon: 'success',
        title: 'escaneo completado',
        showConfirmButton:false,
        timer: 3000
      })
    }

    onScanErrorCumplim(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}

  //credito
    activaLineaCreditoClient(event:any){
      this.modeloCliente.decideaceptcredito = event.checked ? true : false;
      event.checked ? $("#decidecredito").removeClass("noneView") : $("#decidecredito").addClass("noneView");
      if (this.modeloCliente.decideaceptcredito && this.catalogo_monedas_api.length === 0) this.listarMonedas();
    }

    monedaChange(opcion: any) {
      console.log(opcion._filtro_busqueda);
      var creditoMonedaClient = document.getElementById("creditoMonedaClient");
      const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
      this.modeloCliente.token_monedaOrden = typeof mnd !== 'undefined' ? mnd.code : '';
      this.modeloCliente.decimales_monedaOrden = typeof mnd !== 'undefined' ? mnd.decimales : '';
      //this.pay_order_tipo_cambio = typeof mnd !== 'undefined' && mnd.code == "MXN" ? 1.00 : 0;
      typeof mnd !== 'undefined' ? this.validator.correctoSelectBrowser(creditoMonedaClient) : this.validator.errorSelectBrowser(creditoMonedaClient);
    }

    keyupLimiteCredito(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value);
      this.modeloCliente.limite_credito = validacion ? numeral(event.value).format('$0,0.00') : numeral("0.00").format('$0,0.00');
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keypressLimiteCredito(event:any){
      var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
      if (!(/^[0-9$.,]+$/.test(clave))) {
        this.validator.deten(event);
      }
    }

    keyupDiasPagoCredito(event:any){
      const validacion = event.value != '' && this.validator.filtroNum(event.value);
      this.modeloCliente.dias_pago_credito = validacion ? event.value : 0;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keypressDiasPagoCredito(event:any){
      var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
      if (!(/^[0-9$.,]+$/.test(clave))) {
        this.validator.deten(event);
      }
    }

    changeComienzaPagoClient(valor:any){
      var creditoComiCompDeDiasDeCredClient = document.getElementById("creditoComiCompDeDiasDeCredClient");
      const c_pago = this.cred_comienza_cobro.find((row:any) => row.valor === valor);
      const validacion = valor != "" && typeof c_pago !== 'undefined' && this.validator.filtroAlfaNumerico(c_pago?.clave);
      this.modeloCliente.comienzacomputo_credito = validacion ? valor : '';
      validacion ? this.validator.correctoSelectBrowser(creditoComiCompDeDiasDeCredClient) : this.validator.errorSelectBrowser(creditoComiCompDeDiasDeCredClient);
    }

  //forma de pago
    tieneFormaCobroClient(event:any){
      this.modeloCliente.decideformapago = event.checked ? true : false;
      event.checked ? $("#decideformapago").removeClass("noneView") : $("#decideformapago").addClass("noneView");
      if (this.modeloCliente.decideformapago && this.listaFormasCobro.length === 0) this.listFormaCobro();
    }

    listFormaCobro(){
      this._fcobro.getformapago().subscribe((data:InterfPagoForma[]) => {
        this.listaFormasCobro = data;
      })
    }

    changeFormaCobroAltaClient(event:any){
      let fpag = this.listaFormasCobro.find((row: any) => row.forma === event.value);
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof fpag !== 'undefined';
      this.modeloCliente.tknFormaCobroClient = validacion ? fpag.token_formapago : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      if (!validacion) this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'forma de cobro invalida, revisa tu información o comunicate a soporte', life: 3000 });
    }

    cargaDocsEstadoCuenta(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.modeloCliente.typoEstadoCuenta = document.type;
          this.validator.correctoTR("#trDocEstadoCuenta");
          this.modeloCliente.docEstadoCuenta = document;
          
          reader.onload = function(this){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="framedocSituacionFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlEstadoCuenta(reader.result);
          }
        } else {
          this.validator.errorTR("#trDocEstadoCuenta");
          this.modeloCliente.typoEstadoCuenta = "";
          this.modeloCliente.htmlEstadoCuenta = "";
          if (e.target.files[0].size > 2000000) {
            //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Este documento excede el tamaño permitido (2MB)', life: 3000 });
          }
          if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
            //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
            this.messageService.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png', life: 3000 });
          }
        }
        console.log(this.modeloCliente.htmlEstadoCuenta);
      }
    }

    regresaHtmlEstadoCuenta(text_document:any){
      this.modeloCliente.htmlEstadoCuenta = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocEstadoCuenta(){
      var file_estado_cuenta = document.getElementById("file_estado_cuenta");
      this.modeloCliente.htmlEstadoCuenta = "";
      this.modeloCliente.docEstadoCuenta = "";
      this.validator.limpiaTR("#trDocCumplimientoObFiscales");
      this.validator.limpiaInputRow(file_estado_cuenta);
    }

    clickEscannerEstadoCuenta(){//readerSitFiscalClient
      var cameraId:any = '';
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          cameraId = devices[0].id;
          //console.log(cameraId);
        }
      }).catch(err => {
        // handle err
      });
      let config:any = {fps:10,qrbox: { width: 250, height: 250 }};
      let codeQrstfiscal:any = new Html5QrcodeScanner("readerEstadoCuenta",config,false);
      codeQrstfiscal.render(this.scanYesEstadoCuenta,this.onScanErrorEstadoCuenta);
    }

    scanYesEstadoCuenta(decodedText:any, decodedResult:any) {//console.log(`Scan result: ${decodedText}`, decodedResult);
      global.imagenUrlClFrvQrEstcuenta = decodedText;
      $("#divImgClassEstadoCuenta").removeClass("btnError");
      let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalClient" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+decodedText+'" frameborder="0"></iframe>';
      $("#divImgClassEstadoCuenta").html(imgPerfil);
      Swal.fire({
        position:'center',
        icon: 'success',
        title: 'escaneo completado',
        showConfirmButton:false,
        timer: 3000
      })
    }

    onScanErrorEstadoCuenta(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}


    decideTipoReferenciaPago(event:any,referenciaPago:any){
      $("#txtClabeInt").prop("checked",false);
      $("#txtConvenio").prop("checked",false);
      $("#txtLineaCap").prop("checked",false);

      if (referenciaPago != '' && this.validator.strFilEmp(referenciaPago) == true) {
        if (referenciaPago == "clabeInterbancaria") {
          this.modeloCliente.tipoReferenciaPago = 'ci';
        } else if (referenciaPago == "convenio") {
          this.modeloCliente.tipoReferenciaPago = 'co';
          this.modeloCliente.clabeInterbancariaPago = "000-000-00000000000-0"; 
        } else if (referenciaPago == "lineaCaptura") {
          this.modeloCliente.tipoReferenciaPago = 'lc';
          this.modeloCliente.clabeInterbancariaPago = "000-000-00000000000-0"; 
        }
        $(event).prop("checked",true);
      } else {
        this.modeloCliente.tipoReferenciaPago = "";
        //M.toast({html: "Eerror en elección", classes: 'rounded'});
      }
    }

    keyupClabeIntBanc_banco(event:any){
      const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 3;
      this.modeloCliente.clabeInterbancariaBanco = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.llenaClabeInterbancaria();
    }

    keyupClabeIntBanc_plaza(event:any){
      const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 3;
      this.modeloCliente.clabeInterbancariaPlaza = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.llenaClabeInterbancaria();
    }

    keyupClabeIntBanc_cuenta(event:any){
      const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 11;
      this.modeloCliente.clabeInterbancariaCuenta = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.llenaClabeInterbancaria();
    }

    keyupClabeIntBanc_control(event:any){
      const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && event.value.length == 1;
      this.modeloCliente.clabeInterbancariaControl = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      this.llenaClabeInterbancaria();
    }

    llenaClabeInterbancaria(){
    const valida_clabeIntbBanco = this.modeloCliente.clabeInterbancariaBanco != '' && this.validator.filtroCuenta(this.modeloCliente.clabeInterbancariaBanco) && this.modeloCliente.clabeInterbancariaBanco.length == 3;
    const valida_clabeIntbPlaza = this.modeloCliente.clabeInterbancariaPlaza != '' && this.validator.filtroCuenta(this.modeloCliente.clabeInterbancariaPlaza) && this.modeloCliente.clabeInterbancariaPlaza.length == 3;
    const valida_clabeIntbCuenta = this.modeloCliente.clabeInterbancariaCuenta != '' && this.validator.filtroCuenta(this.modeloCliente.clabeInterbancariaCuenta) && this.modeloCliente.clabeInterbancariaCuenta.length == 11;
    const valida_clabeIntbControl = this.modeloCliente.clabeInterbancariaControl != '' && this.validator.filtroCuenta(this.modeloCliente.clabeInterbancariaControl) && this.modeloCliente.clabeInterbancariaControl.length == 1;
    const allClabeInterbancaria = valida_clabeIntbBanco && valida_clabeIntbPlaza && valida_clabeIntbCuenta && valida_clabeIntbControl;
    this.modeloCliente.clabeInterbancariaPago = allClabeInterbancaria ? this.modeloCliente.clabeInterbancariaBanco + '-' + this.modeloCliente.clabeInterbancariaPlaza + '-' + this.modeloCliente.clabeInterbancariaCuenta + '-' + this.modeloCliente.clabeInterbancariaControl : "000-000-00000000000-0";
    }

    keypressClabeIntBanc(event:any){
      var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
      if (!/^[0-9]*$/.test(clave)) {
        this.validator.deten(event);
      }
    }

  //facturacion
    emitirFactAntesDespues(event:any){
      console.log(event.checked);
      this.modeloCliente.emitirFactura = event.checked == true ? true : false;
    }

  entregaDeProdAntesDespues(event:any){
      console.log(event.checked);
      this.modeloCliente.classEntregaArtPago = event.checked == true ? true : false;
  }

  //ubicacion
    //extranjera
    keyupUbicaciontxtCodPostalExt(event:any) {
      const validacion = event.value != "" && this.validator.filtroDom(event.value);
      this.modeloCliente.cod_postal = validacion ? event.value : "";
      this.validateUbicacion = validacion ? true : false;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  //nacional
    keyupCPostal_EstName(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.modeloCliente.new_cod_postal_estado_name = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupCPostal_Municipio(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.modeloCliente.new_cod_postal_municipio = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupCPostal_CP(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value.length == 5;
      this.modeloCliente.new_cod_postal_cp = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupCPostal_Colonia(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.modeloCliente.new_cod_postal_colonia_vinculada = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  get validateCPostalDesconocido(): boolean {
    const validanewcp_estado = this.modeloCliente.new_cod_postal_estado_name != "" && this.validator.filtroAlfaNumerico(this.modeloCliente.new_cod_postal_estado_name);
    const validanewcp_municipio = this.modeloCliente.new_cod_postal_municipio != "" && this.validator.filtroAlfaNumerico(this.modeloCliente.new_cod_postal_municipio);
    const validanewcp_cpostal = this.modeloCliente.new_cod_postal_cp != "" && this.validator.filtroNum(this.modeloCliente.new_cod_postal_cp) && this.modeloCliente.new_cod_postal_cp.length == 5;
    const validanewcp_colonia = this.modeloCliente.new_cod_postal_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.modeloCliente.new_cod_postal_colonia_vinculada);

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
        this.modeloCliente.listnewdireccionNac.push({
          "estado": this.modeloCliente.new_cod_postal_estado_name,
          "municipio": this.modeloCliente.new_cod_postal_municipio,
          "codigo_postal": this.modeloCliente.new_cod_postal_cp,
          "colonia": this.modeloCliente.new_cod_postal_colonia_vinculada
        });
        console.log(this.modeloCliente.listnewdireccionNac);
        this.validateUbicacion = true;
        this.validator.limpiaInputRow(document.getElementById("newDipoMexEstado"));
        this.validator.limpiaInputRow(document.getElementById("newDipoMexMunicipio"));
        this.validator.limpiaInputRow(document.getElementById("newDipoMexCP"));
        this.validator.limpiaInputRow(document.getElementById("newDipoMexColonia"));
        this.modeloCliente.new_cod_postal_estado_name = "";
        this.modeloCliente.new_cod_postal_municipio = "";
        this.modeloCliente.new_cod_postal_cp = "";
        this.modeloCliente.new_cod_postal_colonia_vinculada = "";
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
        this.modeloCliente.listnewdireccionNac.push({
          "estado": this.modeloCliente.new_cod_postal_estado_name,
          "municipio": this.modeloCliente.new_cod_postal_municipio,
          "codigo_postal": this.modeloCliente.new_cod_postal_cp,
          "colonia": this.modeloCliente.new_cod_postal_colonia_vinculada
        });
        console.log(this.modeloCliente.listnewdireccionNac);
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
        this.modeloCliente.listnewdireccionNac.splice(posicion, 1);
        if (this.modeloCliente.listnewdireccionNac.length == 0) {
          this.validateUbicacion = false;
        }
      }
    });
  }

  //funciones de registro
    get validateToRegistro():Boolean {
      const v_contacto = !this.modeloCliente.decideinfocontacto || (this.modeloCliente.decideinfocontacto && this.modeloCliente.listaContactoPersonal.length > 0);
      const v_fiscales = !this.modeloCliente.tiene_docs_fiscales || this.modeloCliente.tiene_docs_fiscales && this.modeloCliente.docSituacionFiscal != null && this.modeloCliente.docCumplimientoObFiscales != null;
      const v_credito = !this.modeloCliente.decideaceptcredito || (this.modeloCliente.decideaceptcredito && this.modeloCliente.token_monedaOrden != "" && this.modeloCliente.limite_credito != "" && this.modeloCliente.dias_pago_credito != 0 && this.validator.filtroNum(this.modeloCliente.dias_pago_credito));
      const v_fpag = !this.modeloCliente.decideformapago || (this.modeloCliente.decideformapago && this.modeloCliente.tknFormaCobroClient != "" && this.modeloCliente.docEstadoCuenta != null && this.modeloCliente.docSituacionFiscal != null && this.modeloCliente.tipoReferenciaPago != '' &&
        this.validator.strFilEmp(this.modeloCliente.tipoReferenciaPago));

      return this.validatePersonales && v_contacto && v_fiscales && v_credito && v_fpag && this.validateUbicacion;
    }

    solicitaRegistroCliente(){
      if (this.validatePersonales == true && this.validateUbicacion == true) {
        Swal.fire({
          title: this.translate.instant("swal_attenc"),
          text: "¿Desea registrar este cliente?",
          icon: "warning",
          confirmButtonColor: "#388E3C",
          confirmButtonText: this.translate.instant("swal_yes_insert"),
          showCancelButton: true,
          cancelButtonColor: "#D32F2F",
        }).then((result) => {
          if (result.isConfirmed) {
            this._client.registraCliente(
              this.modeloCliente.rfc_generico,
              this.modeloCliente.rfc,
              this.modeloCliente.id_tax,
              this.vClasificacionClient,
              this.vSubClasificacionClient,
              this.modeloCliente.name_client,
              this.modeloCliente.cuenta_contable,

              this.modeloCliente.comercial_nombre,
              this.modeloCliente.curp,
              this.modeloCliente.paistoken,
              this.modeloCliente.sitio_web,
              this.modeloCliente.tknRegimenFiscal,
              
              this.modeloCliente.decideinfocontacto,
              this.modeloCliente.listaContactoPersonal,

              this.modeloCliente.tiene_docs_fiscales,
              this.modeloCliente.docSituacionFiscal,
              global.imagenUrlClFrvQrFiscal,
              this.modeloCliente.docCumplimientoObFiscales,
              global.imagenUrlClFrvQrCumplim,
              this.modeloCliente.docContratos,
              global.imagenUrlClFrvQrContratos,
              this.files_anexos,
              this.modeloCliente.noCargaDocsFiscalesRazon,

              this.modeloCliente.decideaceptcredito,
              this.modeloCliente.token_monedaOrden,
              "monRegistro_decimales",
              this.modeloCliente.limite_credito,
              this.modeloCliente.dias_pago_credito,
              this.modeloCliente.comienzacomputo_credito,
              this.modeloCliente.decideformapago,
              this.modeloCliente.tknFormaCobroClient,
              this.modeloCliente.tipoReferenciaPago,
              this.modeloCliente.clabeInterbancariaPago,
              this.modeloCliente.emitirFactura,
              this.modeloCliente.classEntregaArtPago,
              this.modeloCliente.cod_postal,
              this.modeloCliente.dipomex_cod_postal_estado,
              this.modeloCliente.dipomex_cod_postal_municipio,
              this.modeloCliente.dipomex_cod_postal_cp,
              this.modeloCliente.dipomex_cod_postal_colonia_vinculada,
              this.modeloCliente.listnewdireccionNac,
            ).subscribe(
              response => {
                console.log(response.message);
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
      }
    }
}
