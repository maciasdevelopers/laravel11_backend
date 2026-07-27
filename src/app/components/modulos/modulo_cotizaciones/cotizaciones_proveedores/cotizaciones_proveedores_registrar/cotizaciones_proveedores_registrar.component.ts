import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener, AfterViewInit, ViewEncapsulation, Input} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { provRfcTipoModelo } from "../../../../../modelos/provRfcTipoModelo";
import { InterfPais } from "../../../../../interfaces/interf-pais";
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import '../../../../../../assets/js/zxcvbn.js';
import { RegimenFiscalService } from '../../../../../servicios/regimen-fiscal.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { PaisService } from '../../../../../servicios/ssic/pais.service';
import { InterfPagoForma } from '../../../../../interfaces/interf-pago-forma';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { FormaPagoService } from '../../../../../servicios/ssic/forma-pago.service';
import { MetodoPagoServService } from '../../../../../servicios/ssic/metodo-pago-serv.service';
import { InterfMetodoPago } from '../../../../../interfaces/interf-metodo-pago';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CargaPaginaService } from '../../../../../servicios/carga-pagina.service';
import numeral from 'numeral';
import { SessionContextService } from '../../../../../servicios/session-context';
//const messaging = getMessaging();

@Component({
  selector: 'out_compras_proveedor_registrar',
  templateUrl: './cotizaciones_proveedores_registrar.component.html',
  standalone:false,
  styleUrls: [
    './cotizaciones_proveedores_registrar.component.css',
    '../../compras.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/proveedores.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/div_explain.css',
  ]
})
export class CotizacionesProveedoresRegistrarComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  optionTool = {"placement":"top"};

  //nuevo registro
    AllRegFisArray:any = [];
    PfAllRegFisArray:any = [];
    PmAllRegFisArray:any = [];
    pageAltaPostales:number = 1;
    public provModelo: provRfcTipoModelo;
    arraYpais: InterfPais[] = [];
    arrayMonedas:any = [];
  
    public validateRfcExtBool:boolean = true;
    public validateIdTaxBool:boolean = true;
    public validateFoundProv:boolean = false;

    public vClasificacionProv:string = "";
    public vSubClasificacionProv:string = "";
    public validateToRegistro:boolean = false;
    public validatePersonales:boolean = false;
    public validateUbicacion:boolean = false;

    //datos generales
      public paterno:string = "";
      public materno:string = "";
      public nombres:string = "";
      public razon_social:string = "";
      public comercial_nombre:string = "";
      public curp:string = "";
      public sitio_web:string = "";
      public paistoken:string = "";
      public tknRegimenFiscal:string = "";
  
    //rfcs
      public rfcGenericoPF:string = "xaxx010101000";
      public rfcGenericoPM:string = "xax010101000";
      public rfcGenericoExt:string = "xexx010101000";
    
    //contacto
      public decideinfocontacto:boolean = false; 
      public txtMailPersonalProvv_reg:string = "";
      contPersMailList:any = []; 
      public txtEtiquetaPersonal:string = "";
      public txtPhonePersonal:string = "";
      public txtPhoneExtPersonal:string = "";
      contPersTelefonoList:any = [];   
      listaContactoPersonal:any = [];
    //informacion fiscal
      public tiene_docs_fiscales:boolean = false; 
      public docSituacionFiscal:any;
      public htmlSituacionFiscal:any = "";
      public typoSituacionFiscal:any;
      public docCumplimientoObFiscales:any;
      public htmlCumplimientoObFiscales:any = "";
      public typoCumplimientoObFiscales:any;
      public docContratos:any;
      public htmlContratos:any = "";
      public typoContratos:any;
      public files: NgxFileDropEntry[] = [];
      public files_anexos:any [] = [];
    //credito
      public decideaceptcredito:boolean = false; 
      public token_monedaOrden:string = 'bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4';
      public decimales_monedaOrden:number = 0;
      public limite_credito:string = numeral("0.00").format('$0,0.00');
      public dias_pago_credito:number = 0;
      public comienzacomputo_credito:string = "";
    //forma de pago
      public decideformapago:boolean = false; 
      arraYFormaPago: InterfPagoForma[] = [];
      arraYMetodoPago: InterfMetodoPago[] = [];
      public docEstadoCuenta:any;
      public htmlEstadoCuenta:any = "";
      public typoEstadoCuenta:any;
      public tknFormaPagoProv:string = "";
      public tipoReferenciaPago:string = "";
      public clabeInterbancariaBanco:string = "";
      public clabeInterbancariaPlaza:string = "";
      public clabeInterbancariaCuenta:string = "";
      public clabeInterbancariaControl:string = "";
      public clabeInterbancariaPago:string = "000-000-00000000000-0";
    //recibe_factura
      public receptFactura:boolean = false;
      public classRecibeArtPago:boolean = false;

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

  constructor(
    private sentinela:SentinelArkManager,
    private translate:TranslateService,
    private _regimen:RegimenFiscalService,
    private validator:ValidatorServService,
    private dirServ:DireccionesService,
    public _pais:PaisService,
    private sessionContext: SessionContextService,
    private _monedasServ: MonedasService,
    private _fpago: FormaPagoService,
    private _metPago:MetodoPagoServService,
    private sanitizer:DomSanitizer,
    private loadPageServ: CargaPaginaService,
    public provServ: ProveedoresService) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.provModelo = new provRfcTipoModelo("","","","","","","","","");
  }

  ngOnInit(): void {
    this.loadPageServ.comienza_contador_carga();
    this._pais.getListaPais().subscribe((data:InterfPais[]) => {
      this.arraYpais = data;
      console.log(this.arraYpais);
    });

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
    this.listarMonedAS();
    this.listFormaPago();
    this.listMetodoPago();
    this.listen();
  }

  get permiso_crear() {
    return this.sessionContext.privilegio_crear;
  }

  cerrarModal(modal:any){
    $(modal).removeClass("open");
    ////
    ////
    ////
  }

  listen(){
    //const messaging = getMessaging();
    //onMessage(messaging, (payload) => {});
  }

  //nuevo registro
    buscaCodPostalDipomex(event:any){
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
              this.dipomex_cod_postal_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
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
              Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
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
      this.activaFunctionRegistro();
    }

    seleccionaColoniaCPDipomex(colonia_name:any){
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
      this.activaFunctionRegistro();
    }

    tipoNacionalidadSelectProv(event:any,tipoProv:any,subtipoProv:any,botonAction:any){
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

      if (tipoProv == "nacional") {
        var verif_rfcProv = document.getElementById("verif_rfcProv");
        this.validator.limpiaInput(verif_rfcProv);
        var verif_idTaxProv = document.getElementById("verif_idTaxProv");
        this.validator.limpiaInput(verif_idTaxProv);
        var verifNameProvidderExt_reg = document.getElementById("verifNameProvidderExt_reg");
        this.validator.limpiaInput(verifNameProvidderExt_reg);
        this.vClasificacionProv = "nacional";
        this.provModelo.tipoProv = "nacional";
        if(subtipoProv == "provFisica"){
          this.vSubClasificacionProv = "provFisica";
          this.provModelo.subtipoProv = "provFisica";
          this.provModelo.rfc_generico = this.rfcGenericoPF;
        }

        if (subtipoProv == "provMoral"){
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
        if(subtipoProv == "provFisica"){
          this.vSubClasificacionProv = "provFisica";
          this.provModelo.subtipoProv = "provFisica";
        }

        if (subtipoProv == "provMoral"){
          this.vSubClasificacionProv = "provMoral";
          this.provModelo.subtipoProv = "provMoral";
        }
      }
      //this.provModelo.subtipoProv = "";
      this.provModelo.rfc = "";
      this.provModelo.id_tax = "";
      this.provModelo.name_prov = "";
      this.activaFunctionRegistro();
    }

    checksubtipoProv(event:any,subtipoProv:any){
      if (this.vClasificacionProv != "") {
        if (this.provModelo.tipoProv == "nacional") {
          if(subtipoProv == "provFisica"){
            this.vSubClasificacionProv = "provFisica";
            this.provModelo.subtipoProv = "provFisica";
            this.provModelo.rfc_generico = this.rfcGenericoPF;
          }

          if (subtipoProv == "provMoral"){
            this.vSubClasificacionProv = "provMoral";
            this.provModelo.subtipoProv = "provMoral";
            this.provModelo.rfc_generico = this.rfcGenericoPM;
          }
        }

        if (this.provModelo.tipoProv == "extranjero") {
          this.provModelo.rfc_generico = this.rfcGenericoExt;
          if(subtipoProv == "provFisica"){
            this.vSubClasificacionProv = "provFisica";
            this.provModelo.subtipoProv = "provFisica";
          }

          if (subtipoProv == "provMoral"){
            this.vSubClasificacionProv = "provMoral";
            this.provModelo.subtipoProv = "provMoral";
          }
        }

        //this.provModelo.rfc = "";
        //this.provModelo.id_tax = "";
        //this.provModelo.name_prov = "";
      }
    }

    keyupverif_rfcProv(event:any){
      if (event.value != "") {
        if (this.vSubClasificacionProv == "provFisica") {
          var cdna1 = event.value.substring(0,4);
          var cdna2 = event.value.substring(4,10);
          var cdna3 = event.value.substring(10,13);
          if (/^[a-zA-Z]+$/.test(cdna1)) {
            if (/^[0-9]+$/.test(cdna2)) {
              if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 13) {
                this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
                this.provModelo.rfc = event.value;
              } else {
                this.validator.errorInput(event,"rfc del proveedor no es correcto");
                this.provModelo.rfc = "";
              }
            } else {
              this.validator.errorInput(event,"rfc del proveedor no es correcto");
              this.provModelo.rfc = "";
            }
          } else {
            this.validator.errorInput(event,"rfc del proveedor no es correcto");
            this.provModelo.rfc = "";
          }
        }
        if (this.vSubClasificacionProv == "provMoral") {
          var cdna1 = event.value.substring(0,3);
          var cdna2 = event.value.substring(3,9);
          var cdna3 = event.value.substring(9,12);
          if (/^[a-zA-Z]+$/.test(cdna1)) {
            if (/^[0-9]+$/.test(cdna2)) {
              if (/^[a-zA-Z0-9]+$/.test(cdna3) && event.value.length == 12) {
                this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
                this.provModelo.rfc = event.value;
              }
              else{
                this.validator.errorInput(event,"rfc del proveedor no es correcto");
                this.provModelo.rfc = "";
              }
            }
            else{
              this.validator.errorInput(event,"rfc del proveedor no es correcto");
              this.provModelo.rfc = "";
            }
          }
          else{
            this.validator.errorInput(event,"rfc del proveedor no es correcto");
            this.provModelo.rfc = "";
          }
        }
      } else {
        if (this.vSubClasificacionProv == "provFisica") {
          this.provModelo.rfc = "";
          this.validator.errorInput(event,"Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
        }
        if (this.vSubClasificacionProv == "provMoral") {
          this.provModelo.rfc = "";
          this.validator.errorInput(event,"Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
        }
      }
    }

    keyupverif_rfcExtProv(event:any){
      if (event.value != "" && this.validator.strFilter(event.value) == true) {
        this.validator.correctoInput(event,"Escriba su rfc");
        this.validateRfcExtBool = true;
        this.provModelo.rfc = event.value;
      } else {
        this.provModelo.rfc = "";
        this.validateRfcExtBool = false;
        this.validator.errorInput(event,"Rfc incorrecto");
      }
    }

    keyupverif_TaxIdProv(event:any){
      if (event.value != "") {
        if (event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value) == true) {
          this.validator.correctoInput(event,"Escriba Tax ID del proveedor");
          this.validateIdTaxBool = true;
          this.provModelo.id_tax = event.value;
        } else {
          this.validator.errorInput(event,"Tax ID del proveedor no es correcto");
          this.validateIdTaxBool = false;
          this.provModelo.id_tax = "";
        }
      } else {
        this.provModelo.id_tax = "";
        this.validateIdTaxBool = false;
        this.validator.errorInput(event,"Tax ID del proveedor no es correcto");
      }
    }

    functllenaRFcGenerico(event:any){
      $("#verif_rfcProv").val("");
      $("#verif_rfcProv").attr("disabled","disabled");
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
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de proveedor",
            showConfirmButton:false,
            timer: 3000
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
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de proveedor",
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
    }

    functllenaRFcProv(event:any){
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
          $("#verif_rfcProv").attr("disabled","disabled");
          $(event).removeClass("noneView");
          $("#btnllenaRFcGenerico").addClass("noneView");
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de proveedor",
            showConfirmButton:false,
            timer: 3000
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
            position:"top-end",
            icon: "warning",
            title: "seleccione subtipo de proveedor",
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
    }

    checkNombreProv(valor:any){
      if (valor.value === "") {
        this.validator.errorInput(valor,"Ingresa nombre completo / razón social del proveedor");
        this.provModelo.name_prov = "";
      } else {
        if (this.validator.strFilter(valor.value) == false) {
          this.validator.errorInput(valor,"Ingresa nombre completo / razón social del proveedor");
          this.provModelo.name_prov = "";
        } else {
          if (valor.value.length <4) {
            this.validator.errorInput(valor,"Número de caracteres invalido");
            this.provModelo.name_prov = "";
          } else {
            this.validator.correctoInput(valor,"Nombre completo / razón social del proveedor");
            this.provModelo.name_prov = valor.value;
          }
        }
      }
    }

    especificacionesInputRfcProv(){
      let switchCheckSubTipoProv:any = document.getElementById("switchCheckSubTipoProv");
      let backSubTipoProv:any = document.getElementById("backSubTipoProv");
      if (this.provModelo.tipoProv != "" && this.provModelo.subtipoProv != "") {
        $(switchCheckSubTipoProv).removeAttr("disabled");
        $(backSubTipoProv).removeAttr("disabled");
        if (this.provModelo.tipoProv == "nacional") {
          if (this.provModelo.subtipoProv == "provFisica") {
            $("#lbl_proveedor").html("Escriba su rfc con Homoclave (13 caracteres Ej. ABCD000000XXX)");
            $("#verif_rfcProv").attr("data-length","13");
            $("#verif_rfcProv").attr("placeholder","Ej. ABCD000000XXX");
            $("#verif_rfcProv").attr("maxlength","13");
          }
          if (this.provModelo.subtipoProv == "provMoral") {
            $("#lbl_proveedor").html("");
            $("#verif_rfcProv").attr("data-length","12");
            $("#verif_rfcProv").attr("placeholder","Ej. ABC000000XXX");
            $("#verif_rfcProv").attr("maxlength","12");
          }
        }
        if (this.provModelo.tipoProv == "extranjero") {

        }
        $("#btnBuscaProvDB").removeClass("noneView");
      }
    }

    funtcBuscaProvDBNac(){
      let verif_rfcProv:any = document.getElementById("verif_rfcProv");
      let verifNameProvidder_reg:any = document.getElementById("verifNameProvidder_reg");

      var frc_novacio:any = "";
      if (this.provModelo.rfc != "") {
        frc_novacio = this.provModelo.rfc;
      } else {
        frc_novacio = this.provModelo.rfc_generico;
      }
      console.log(frc_novacio);
      var cdna1ProvFis = frc_novacio.substring(0,4);
      var cdna2ProvFis = frc_novacio.substring(4,10);
      var cdna3ProvFis = frc_novacio.substring(10,13);
      var cdna1ProvMoral = frc_novacio.substring(0,3);
      var cdna2ProvMoral = frc_novacio.substring(3,9);
      var cdna3ProvMoral = frc_novacio.substring(9,12);

      if (this.vClasificacionProv != "" && this.vSubClasificacionProv != "" && this.vClasificacionProv == "nacional") {
        if (this.vSubClasificacionProv == "provFisica") {
          if (frc_novacio != "" && frc_novacio.length == 13 && this.provModelo.name_prov != "" &&
            this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4 &&
            (/^[a-zA-Z]+$/.test(cdna1ProvFis)) && (/^[0-9]+$/.test(cdna2ProvFis)) && (/^[a-zA-Z0-9]+$/.test(cdna3ProvFis)) ) {

            this.validator.correctoInput(verif_rfcProv,"Escriba su rfc con Homoclave");
            this.validator.correctoInput(verifNameProvidder_reg,"Nombre completo / razón social del proveedor");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su proveedor es Persona Física?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: "Sí, verificar si se encuentra registrado",
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaProvMySQL(this.provModelo.rfc_generico,this.provModelo.rfc,this.provModelo.id_tax,this.provModelo.name_prov);
              }
            });

          } else {
            let error = "";
            if(this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4){
                this.validator.errorInput(verifNameProvidder_reg,"Ingresa nombre completo / razón social del proveedor");
                error = "Ingresa nombre del proveedor";
            }
            if (this.provModelo.rfc == "") {
                this.validator.errorInput(verif_rfcProv,"Inserta Rfc de su proveedor");
                error = "DEBE REGISTRAR RFC";
            }
            if (this.provModelo.rfc.length != 13) {
                this.validator.errorInput(verif_rfcProv,"Su rfc debe contener 13 caracteres");
                error = "su RFC no es correcto";
            }
            if (!/^[a-zA-Z]+$/.test(cdna1ProvFis) || !/^[0-9]+$/.test(cdna2ProvFis) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvFis)) {
                this.validator.errorInput(verif_rfcProv,"Su rfc debe contener 13 caracteres");
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

        if (this.vSubClasificacionProv == "provMoral") {
          if(frc_novacio != "" && frc_novacio.length == 12 && this.provModelo.name_prov != "" &&
            this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4 &&
            (/^[a-zA-Z]+$/.test(cdna1ProvMoral)) && (/^[0-9]+$/.test(cdna2ProvMoral)) && (/^[a-zA-Z0-9]+$/.test(cdna3ProvMoral))) {

            this.validator.correctoInput(verif_rfcProv,"Escriba su rfc con Homoclave");
            this.validator.correctoInput(verifNameProvidder_reg,"Nombre completo / razón social del proveedor");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su proveedor es Persona Moral?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: "Sí, verificar si se encuentra registrado",
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaProvMySQL(this.provModelo.rfc_generico,this.provModelo.rfc,this.provModelo.id_tax,this.provModelo.name_prov);
              }
            });
          } else {
            let error = "";
            if(this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4){
                this.validator.errorInput(verifNameProvidder_reg,"Inserta nombre completo / razón social del proveedor");
                error = "Inserta nombre del proveedor";
            }
            if (this.provModelo.rfc == "") {
                this.validator.errorInput(verif_rfcProv,"Inserta Rfc de su proveedor");
                error = "DEBE REGISTRAR RFC";
            }
            if (this.provModelo.rfc.length != 12) {
                this.validator.errorInput(verif_rfcProv,"Su rfc debe contener 12 caracteres");
                error = "su RFC no es correcto";
            }
            if (!/^[a-zA-Z]+$/.test(cdna1ProvMoral) || !/^[0-9]+$/.test(cdna2ProvMoral) || !/^[a-zA-Z0-9]+$/.test(cdna3ProvMoral)) {
                this.validator.errorInput(verif_rfcProv,"Su rfc debe contener 12 caracteres");
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
        if (this.vClasificacionProv == "") {
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione proveedor nacional o extranjero",
            showConfirmButton:false,
            timer: 3000
          })
        }

        if (this.vSubClasificacionProv == "") {
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

    funtcBuscaProvDBExt(){
      let verif_rfcProv:any = document.getElementById("verif_rfcProv");
      let verifNameProvidderExt_reg:any = document.getElementById("verifNameProvidderExt_reg");
      let verif_idTaxProv:any = document.getElementById("verif_idTaxProv");
      var cdna1ProvFis = this.provModelo.rfc.substring(0,4);
      var cdna2ProvFis = this.provModelo.rfc.substring(4,10);
      var cdna3ProvFis = this.provModelo.rfc.substring(10,13);
      var cdna1ProvMoral = this.provModelo.rfc.substring(0,3);
      var cdna2ProvMoral = this.provModelo.rfc.substring(3,9);
      var cdna3ProvMoral = this.provModelo.rfc.substring(9,12);

      if (this.vClasificacionProv != "" && this.vSubClasificacionProv != "" && this.vClasificacionProv == "extranjero") {

        if (this.provModelo.rfc == "" && this.provModelo.id_tax == "") {
          if (this.provModelo.rfc_generico != "" && this.provModelo.rfc_generico.length >= 9 && this.provModelo.rfc_generico.length <= 40 &&
            this.provModelo.name_prov != "" && this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4) {
            this.validator.correctoInput(verif_rfcProv,"Escriba su rfc con Homoclave");
            this.validator.correctoInput(verif_idTaxProv,"Escriba su Tax ID con Homoclave");
            this.validator.correctoInput(verifNameProvidderExt_reg,"Nombre completo / razón social del proveedor");
            Swal.fire({
              title: this.translate.instant("swal_attenc"),
              text: "¿Su proveedor es extranjero?",
              icon: "warning",
              confirmButtonColor: "#388E3C",
              confirmButtonText: this.translate.instant("swal_yes_insert"),
              showCancelButton: true,
              cancelButtonColor: "#D32F2F",
            }).then((result) => {
              if (result.isConfirmed) {
                this.validaProvMySQL(this.provModelo.rfc_generico,this.provModelo.rfc,this.provModelo.id_tax,this.provModelo.name_prov);
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
            if(this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4){
                this.validator.errorInput(verifNameProvidderExt_reg,"Ingresa nombre completo / razón social del proveedor");
                error = "Ingresa nombre completo / razón social del proveedor";
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
            if (this.provModelo.rfc_generico != "" && this.provModelo.rfc_generico.length >= 9 && this.provModelo.rfc_generico.length <= 40 &&
              this.provModelo.name_prov != "" && this.validator.strFilter(this.provModelo.name_prov) == true && this.provModelo.name_prov.length >= 4) {
              this.validator.correctoInput(verif_rfcProv,"Escriba su rfc con Homoclave");
              this.validator.correctoInput(verif_idTaxProv,"Escriba su Tax ID con Homoclave");
              this.validator.correctoInput(verifNameProvidderExt_reg,"Nombre completo / razón social del proveedor");
              Swal.fire({
                title: this.translate.instant("swal_attenc"),
                text: "¿Su proveedor es extranjero?",
                icon: "warning",
                confirmButtonColor: "#388E3C",
                confirmButtonText: this.translate.instant("swal_yes_insert"),
                showCancelButton: true,
                cancelButtonColor: "#D32F2F",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.validaProvMySQL(this.provModelo.rfc_generico,this.provModelo.rfc,this.provModelo.id_tax,this.provModelo.name_prov);
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
              if(this.provModelo.name_prov == "" || this.validator.strFilter(this.provModelo.name_prov) == false || this.provModelo.name_prov.length < 4){
                  this.validator.errorInput(verifNameProvidderExt_reg,"Ingresa nombre completo / razón social del proveedor");
                  error = "Ingresa nombre completo / razón social del proveedor";
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
        if (this.vClasificacionProv == "") {
          Swal.fire({
            position:"top-end",
            icon: "warning",
            title: "seleccione proveedor nacional o extranjero",
            showConfirmButton:false,
            timer: 3000
          })
        }

        if (this.vSubClasificacionProv == "") {
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

    validaProvMySQL(rfc_generico:any,rfc:any,id_tax:any,nombre:any){
      this.provServ.verificaExistsAllProveedor(this.vClasificacionProv,this.vSubClasificacionProv,rfc_generico,rfc,id_tax,nombre).subscribe(
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
            this.validateFoundProv = true;
            this.provModelo.name_prov = nombre;
            //if (this.vSubClasificacionProv == "provFisica") {}
            if (this.vSubClasificacionProv == "provMoral") {
              this.razon_social = this.provModelo.name_prov;
              //this.validator.correctoInput("#txtempresa_reg","Empresa");
            }          
            //
            //
            //
            //
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
      this.provModelo.tipoProv = "";
      this.provModelo.subtipoProv = "";
      this.provModelo.rfc_generico = "";
      this.provModelo.rfc = "";
      this.provModelo.id_tax = "";
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
      this.paterno = "";
      this.materno = "";
      this.nombres = "";
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
      if (nombre == this.provModelo.name_prov.toLowerCase()) {
        this.validator.correctoInputRow(txt_paterno);
        this.validator.correctoInputRow(txt_materno);
        this.validator.correctoInputRow(txt_nombres);
      } else {
        this.validator.errorInputRow(txt_paterno);
        this.validator.errorInputRow(txt_materno);
        this.validator.errorInputRow(txt_nombres);
      }
    }

    keyupPaterno(event:any){
      if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
        this.paterno = event.value;
        this.validator.correctoInputRow(event);
        this.verificaEmpIguales();
      } else {
        this.paterno = "";
        this.validator.errorInputRow(event);
      }
      this.validateAllPersonales();
    }

    keyupMaterno(event:any){
      if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
        this.materno = event.value;
        this.validator.correctoInputRow(event);
        this.verificaEmpIguales();
      } else {
        this.materno = "";
        this.validator.errorInputRow(event);
      }
      this.validateAllPersonales();
    }

    keyupNombres(event:any){
      if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3) {
        this.nombres = event.value;
        this.validator.correctoInputRow(event);
        this.verificaEmpIguales();
      } else {
        this.nombres = "";
        this.validator.errorInputRow(event);
      }
      this.validateAllPersonales();
    }

    keyupRSocial(event:any){
      if (event.value != "" && event.value.length >= 3 && this.validator.strFilEmp(event.value) == true && event.value.toLowerCase() == this.provModelo.name_prov.toLowerCase()) {
        this.razon_social = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.razon_social = "";
        this.validator.errorInputRow(event);
      }
      this.validateAllPersonales();
    }

    keyupComercialName(event:any){
      if (event.value != "" && this.validator.strFilEmp(event.value) == true) {
        this.comercial_nombre = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.comercial_nombre = "";
        this.validator.errorInputRow(event);
      }
      this.validateAllPersonales();
    }

    keyupCurp(event:any){ //txt_curp
      if (this.vClasificacionProv == "nacional") {
        if (event.value != "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length == 18) {
          this.curp = event.value;
          this.validator.correctoInputRow(event);
        } else {
          this.curp = "";
          this.validator.errorInputRow(event);
        }
      } else {
        if (event.value === "" && /^[a-zA-Z0-9]+$/.test(event.value) && event.value.length >= 40) {
          this.curp = event.value;
          this.validator.correctoInputRow(event);
        } else {
          this.curp = "";
          this.validator.errorInputRow(event);
        }
      }
      this.validateAllPersonales();
    }

    changePais(event:any){
      if (event.value != "") {
        for (let i = 0; i < this.arraYpais.length; i++) {
          const country = this.arraYpais[i];
          if (country["token_pais"] == event.value) {
            this.validator.correctoSelectBrowser(event);
            this.paistoken = event.value;
          }
        }
      } else {
        this.validator.errorSelectBrowser(event);
      }
      this.validateAllPersonales();
    }

    changeSitioWeb(event:any){
      if (event.value != "" && this.validator.filtroUrl("https://"+event.value) == true) {
        this.sitio_web = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.sitio_web = "";
        this.validator.errorInputRow(event);
      }
      this.validateAllPersonales();
    }

    changeRegimenFiscal(event:any){
      if (event.value != "") {
        for (let i = 0; i < this.AllRegFisArray.length; i++) {
          const row = this.AllRegFisArray[i];
          if (row["token_regimen_fiscal"] == event.value) {
            this.validator.correctoSelectBrowser(event);
            this.tknRegimenFiscal = row["token_regimen_fiscal"];
          }
        }
      } else {
        this.validator.errorSelectBrowser(event);
      }
      this.validateAllPersonales();
    }

    validateAllPersonales(){
      var txt_paterno:any = document.getElementById("txt_paterno");
      var txt_materno:any = document.getElementById("txt_materno");
      var txt_nombres:any = document.getElementById("txt_nombres");
      var txt_r_social:any = document.getElementById("txt_r_social");
      var txtidtax_reg:any = document.getElementById("txtidtax_reg");
      var txtComercial_name:any = document.getElementById("txtComercial_name");
      var txt_curp:any = document.getElementById("txt_curp");
      var sel_pais:any = document.getElementById("sel_pais");
      var txt_sitio_web:any = document.getElementById("txt_sitio_web");
      var selRegimenFiscal:any = document.getElementById("selRegimenFiscal");

      if (this.provModelo.subtipoProv == "provFisica") {
        if ((this.paterno != "" && this.validator.strFilter(this.paterno) == true && this.paterno.length >= 4) &&
          (this.materno != "" && this.validator.strFilter(this.materno) == true && this.materno.length >= 4) &&
          (this.nombres != "" && this.validator.strFilter(this.nombres) == true && this.nombres.length >= 3) &&
          this.tknRegimenFiscal != "") {

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
              if (this.sitio_web != "" && this.validator.filtroUrl("https://"+this.sitio_web) == true) {
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
                this.validator.errorInput(txt_sitio_web,"Sitio web invalido");
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

        } else {
          this.validatePersonales = false;
          if (this.paterno == "" || this.validator.strFilter(this.paterno) == false || this.paterno.length < 4){
            this.validator.errorInputRow(txt_paterno);
          }
          if (this.materno == "" || this.validator.strFilter(this.materno) == false || this.materno.length < 4){
            this.validator.errorInputRow(txt_materno);
          }
          if (this.nombres == "" || this.validator.strFilter(this.nombres) == false || this.nombres.length < 3){
            this.validator.errorInputRow(txt_nombres);
          }
          if (this.tknRegimenFiscal == ""){
            this.validator.errorSelectBrowser(selRegimenFiscal);
          }
        }
      }
      if (this.provModelo.subtipoProv == "provMoral") {
        if (this.razon_social != "" && this.validator.strFilEmp(this.razon_social) == true && this.tknRegimenFiscal != "") {
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
                if (this.sitio_web != "" && this.validator.filtroUrl("https://"+this.sitio_web) == true) {
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
                if (this.sitio_web != "" && this.validator.filtroUrl("https://"+this.sitio_web) == true) {
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
        } else {
          this.validatePersonales = false;
          if (this.razon_social == "" && this.validator.strFilEmp(this.razon_social) == false && this.tknRegimenFiscal != "") {
            this.validator.errorInputRow(txt_r_social);
          }
          if (this.tknRegimenFiscal == "") {
            this.validator.errorSelectBrowser(selRegimenFiscal);
          }
        }
      }
      console.log(this.validatePersonales);
      this.activaFunctionRegistro();
    }

  //contacto
    decideocupaContacto(event:any){
      if (event.checked == true) {
        $("#decideinfocontacto").removeClass("noneView");
        this.decideinfocontacto = true;
        //
      } else {
        $("#decideinfocontacto").addClass("noneView");
        this.decideinfocontacto = false;
      }
      this.activaFunctionRegistro();
    }

    keyupPersContPaterno(event:any){
      if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
      this.enableBtnContacto();
    }

    keyupPersContMaterno(event:any){
      if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
      this.enableBtnContacto();
    }

    keyupPersContNombres(event:any){
      if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
      this.enableBtnContacto();
    }

    keyupPersContArea(event:any){
      if (event.value != '' && this.validator.strFilEmp(event.value) == true) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
      this.enableBtnContacto();
    }

    keyupPersContCargo(event:any){
      if (event.value != '' && this.validator.strFilEmp(event.value) == true) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
      this.enableBtnContacto();
    }

    keyupPersContEmail(event:any){
      if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
        this.txtMailPersonalProvv_reg = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }

    addMailContacto() {
      var contPersEmail:any = document.getElementById("contPersProvEmail");
      if (this.txtMailPersonalProvv_reg != '' && this.validator.filtroCorreo(this.txtMailPersonalProvv_reg) == true) {
        this.contPersMailList.push(this.txtMailPersonalProvv_reg);
        console.log(this.contPersMailList);
        this.txtMailPersonalProvv_reg = '';
        this.validator.limpiaInputRow(contPersEmail);
        this.validaMailTelContacto();
      } else {
        this.validator.errorInputRow(contPersEmail);
        this.validaMailTelContacto();
      }
      this.enableBtnContacto();
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
      this.enableBtnContacto();
    }

    telefonoTipoCont_regChange(event:any){
      if (event.value != '' && this.validator.filtroAlfaNumerico(event.value)) {
        this.txtEtiquetaPersonal = event.value;
      } else {
        this.txtEtiquetaPersonal = "";
      }
      this.enableBtnContacto();
    }

    telefonoKeyupNumeroCont_reg(event:any){
      if (event.value != "" && event.value.length >= 5 && this.validator.filtroNum(event.value) == true) {
        this.validator.correctoInputRow(event);
        this.txtPhonePersonal = event.value;
      } else {
        this.txtPhonePersonal = "";
        this.validator.errorInputRow(event);
      }
      this.enableBtnContacto();
    }

    telefonoKeyupExtension_reg(event:any){
      if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true) {
        this.validator.correctoInputRow(event);
        this.txtPhoneExtPersonal = event.value;
      } else {
        this.txtPhoneExtPersonal = "";
        this.validator.errorInputRow(event);
      }
      this.enableBtnContacto();
    }

    addPhoneContacto() {
      var etiquetaCont_regProv:any = document.getElementById("etiquetaCont_regProv");
      var txtTelefonoCont_reg:any = document.getElementById("txtTelefonoCont_regProv");
      var txtExtension_reg:any = document.getElementById("txtExtension_regProv");

      if ((this.txtEtiquetaPersonal != '' && this.validator.strFilter(this.txtEtiquetaPersonal) == true) &&
        (this.txtPhonePersonal != '' && this.txtPhonePersonal.length >= 5 && this.validator.filtroNum(this.txtPhonePersonal) == true)) {
        this.validaMailTelContacto();
        if ((this.txtPhoneExtPersonal == '') || (this.txtPhoneExtPersonal != '' && this.txtPhoneExtPersonal.length >= 1 && this.validator.filtroNum(this.txtPhoneExtPersonal) == true)) {
          this.contPersTelefonoList.push({
            "etiqueta":this.txtEtiquetaPersonal,
            "telefono":this.txtPhonePersonal,
            "extension":this.txtPhoneExtPersonal,
          });
          this.txtEtiquetaPersonal = '';
          this.txtPhonePersonal = '';
          this.txtPhoneExtPersonal = '';
          this.validator.limpiaSelect(etiquetaCont_regProv);
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
          this.validator.errorInputRow(etiquetaCont_regProv);
        }
        if(this.txtPhonePersonal == '' || !(/^[0-9]+$/.test(this.txtPhonePersonal)) || this.txtPhonePersonal.length < 5){
          this.validator.errorInputRow(txtTelefonoCont_reg);
        }
      }
      this.enableBtnContacto();
    }

    deletePhoneContacto(position:any) {
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
          this.contPersTelefonoList.splice(position,1);
          if (this.contPersTelefonoList.length == 0) {
            this.validaMailTelContacto();
          }
        }
      });
      this.enableBtnContacto();
    }

    enableBtnContacto() {
      var contPersPaterno:any = document.getElementById("contPersProvPaterno");
      var contPersMaterno:any = document.getElementById("contPersProvMaterno");
      var contPersNombres:any = document.getElementById("contPersProvNombres");
      var contPersArea:any = document.getElementById("contPersProvArea");
      var contPersCargo:any = document.getElementById("contPersProvCargo");

      if ((contPersPaterno.value != '' && this.validator.strFilter(contPersPaterno.value) == true && contPersPaterno.value.length >= 4) &&
        (contPersMaterno.value != '' && this.validator.strFilter(contPersMaterno.value) == true && contPersMaterno.value.length >= 4) &&
        (contPersNombres.value != '' && this.validator.strFilter(contPersNombres.value) == true && contPersNombres.value.length >= 3) &&
        (contPersArea.value != '' && this.validator.strFilter(contPersArea.value) == true && contPersArea.value.length >= 5) &&
        (contPersCargo.value != '' && this.validator.strFilter(contPersCargo.value) == true && contPersCargo.value.length >= 5) &&
        this.contPersMailList.length > 0 && this.contPersTelefonoList.length > 0) {
          this.validaMailTelContacto();
        $("#addInfoContactoP").removeAttr("disabled");
      } else {
        if(contPersPaterno.value == '' || this.validator.strFilter(contPersPaterno.value) == false || contPersPaterno.value.length < 4){
          this.validator.errorInputRow(contPersPaterno);
        }
        if(contPersMaterno.value == '' || this.validator.strFilter(contPersMaterno.value) == false || contPersMaterno.value.length < 4){
          this.validator.errorInputRow(contPersMaterno);
        }
        if(contPersNombres.value == '' || this.validator.strFilter(contPersNombres.value) == false || contPersNombres.value.length < 3){
          this.validator.errorInputRow(contPersNombres);
        }
        if(contPersArea.value == '' || this.validator.strFilter(contPersArea.value) == false || contPersArea.value.length < 5){
          this.validator.errorInputRow(contPersArea);
        }
        if(contPersCargo.value == '' || this.validator.strFilter(contPersCargo.value) == false || contPersCargo.value.length < 5){
          this.validator.errorInputRow(contPersCargo);
        }
        if(this.contPersMailList.length == 0 || this.contPersTelefonoList.length == 0){
          this.validaMailTelContacto();
        }
      }
    }

    validaMailTelContacto(){
      if (this.contPersMailList.length > 0 && this.contPersTelefonoList.length > 0) {
        $("#btnModalPersMailTelMain").removeClass("btnError");
      } else {
        $("#btnModalPersMailTelMain").addClass("btnError");
      }
    }

    clickfunctionaddInfoContacto() {
      var contPersPaterno:any = document.getElementById("contPersProvPaterno");
      var contPersMaterno:any = document.getElementById("contPersProvMaterno");
      var contPersNombres:any = document.getElementById("contPersProvNombres");
      var contPersArea:any = document.getElementById("contPersProvArea");
      var contPersCargo:any = document.getElementById("contPersProvCargo");
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
          if ((contPersPaterno.value != '' && this.validator.strFilter(contPersPaterno.value) == true && contPersPaterno.value.length >= 4) &&
            (contPersMaterno.value != '' && this.validator.strFilter(contPersMaterno.value) == true && contPersMaterno.value.length >= 4) &&
            (contPersNombres.value != '' && this.validator.strFilter(contPersNombres.value) == true && contPersNombres.value.length >= 3) &&
            (contPersArea.value != '' && this.validator.strFilter(contPersArea.value) == true && contPersArea.value.length >= 5) &&
            (contPersCargo.value != '' && this.validator.strFilter(contPersCargo.value) == true && contPersCargo.value.length >= 5) &&
            this.contPersMailList.length != 0 && this.contPersTelefonoList.length != 0) {
            this.llenaTabCont();
            this.activaFunctionRegistro();
          } else {
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: 'complete los campos vacios',
              showConfirmButton:false,
              timer: 3000
            })
            if(contPersPaterno.value == '' || this.validator.strFilter(contPersPaterno.value) == false || contPersPaterno.value.length < 4){
              this.validator.errorInputRow(contPersPaterno);
            }
            if(contPersMaterno.value == '' || this.validator.strFilter(contPersMaterno.value) == false || contPersMaterno.value.length < 4){
              this.validator.errorInputRow(contPersMaterno);
            }
            if(contPersNombres.value == '' || this.validator.strFilter(contPersNombres.value) == false || contPersNombres.value.length < 3){
              this.validator.errorInputRow(contPersNombres);
            }
            if(contPersArea.value == '' || this.validator.strFilter(contPersArea.value) == false || contPersArea.value.length < 5){
              this.validator.errorInputRow(contPersArea);
            }
            if(contPersCargo.value == '' || this.validator.strFilter(contPersCargo.value) == false || contPersCargo.value.length < 5){
              this.validator.errorInputRow(contPersCargo);
            }
            if(this.contPersMailList.length == 0 || this.contPersTelefonoList.length == 0){
              $("#btnTelModalPersMailMain").addClass("btnError");
            }
          }
        }
      })
    }

    llenaTabCont(){
      //let arrayInternoPrvConatacto = [];
      var contPersPaterno:any = document.getElementById("contPersProvPaterno");
      var contPersMaterno:any = document.getElementById("contPersProvMaterno");
      var contPersNombres:any = document.getElementById("contPersProvNombres");
      var contPersArea:any = document.getElementById("contPersProvArea");
      var contPersCargo:any = document.getElementById("contPersProvCargo");
      
      this.listaContactoPersonal.push({
        "num_lista":this.listaContactoPersonal.length + 1,
        "paterno":contPersPaterno.value,
        "materno":contPersMaterno.value,
        "nombre":contPersNombres.value,
        "area":contPersArea.value,
        "cargo":contPersCargo.value,
        "emails":this.contPersMailList,
        "telefonos":this.contPersTelefonoList,
      });
      this.validator.limpiaInputRow(contPersPaterno);
      this.validator.limpiaInputRow(contPersMaterno);
      this.validator.limpiaInputRow(contPersNombres);
      this.validator.limpiaInputRow(contPersArea);
      this.validator.limpiaInputRow(contPersCargo);
      this.contPersMailList = [];
      this.contPersTelefonoList = [];
      //
      console.log(this.listaContactoPersonal);
      this.activaFunctionRegistro();
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
          this.listaContactoPersonal.splice(num_lista-1,1);
        }
        this.activaFunctionRegistro();
      });
    }

  //informacion fiscal
    decide_docs_fiscales(event:any){
      if (event.checked == true) {
        this.tiene_docs_fiscales = true;
        $("#decidedocs_fiscales").removeClass("noneView");
      } else {
        this.tiene_docs_fiscales = false;
        $("#decidedocs_fiscales").addClass("noneView");
      }
      this.activaFunctionRegistro();
    }

    changeEscannersitfiscal(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.typoSituacionFiscal = document.type;
          this.validator.correctoTR("#trDocSitFiscal");
          this.docSituacionFiscal = document;
          //
          reader.onload = function(this){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="framedocSituacionFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlSitfiscal(reader.result);
          }
        } else {
          this.validator.errorTR("#trDocSitFiscal");
          this.typoSituacionFiscal = "";
          this.htmlSituacionFiscal = "";
          if (e.target.files[0].size > 2000000) {
            //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
          }
          if (this.validator.filtroTipoArchivo(document.type) == false) {
            //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
          }
        }
        console.log(this.typoSituacionFiscal);
      }
      this.activaFunctionRegistro();
    }

    regresaHtmlSitfiscal(text_document:any){
      this.htmlSituacionFiscal = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocSitfiscal(){
      var file_situacion_fiscal = document.getElementById("file_situacion_fiscal");
      this.htmlSituacionFiscal = "";
      this.docSituacionFiscal = "";
      this.validator.limpiaTR("#trDocSitFiscal");
      this.validator.limpiaInputRow(file_situacion_fiscal);
    }

    changeEscannerContratos(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.typoContratos = document.type;
          this.validator.correctoTR("#trDocContratos");
          this.docContratos = document
          reader.onload =  function(){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlContratos(reader.result);
          };
        } else {
          this.validator.errorTR("#trDocContratos");
          this.htmlContratos = "";
          if (document.size > 2000000) {
            //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
          }
          if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
            //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
          }
        }
      }
      this.activaFunctionRegistro();
    }

    regresaHtmlContratos(text_document:any){
      this.htmlContratos = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocContratos(){
      var file_contratos = document.getElementById("file_contratos");
      this.htmlContratos = "";
      this.docContratos = "";
      this.validator.limpiaTR("#trDocContratos");
      this.validator.limpiaInputRow(file_contratos);
    }

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

    changeEscannercumplimiento(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.typoCumplimientoObFiscales = document.type;
          this.validator.correctoTR("#trDocCumplimientoObFiscales");
          this.docCumplimientoObFiscales = document
          reader.onload =  function(){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlCumplimientoObFiscales(reader.result);
          };
        } else {
          this.validator.errorTR("#trDocCumplimientoObFiscales");
          this.htmlCumplimientoObFiscales = "";
          if (document.size > 2000000) {
            //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
          }
          if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
            //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
          }
        }
      }
      this.activaFunctionRegistro();
    }

    regresaHtmlCumplimientoObFiscales(text_document:any){
      this.htmlCumplimientoObFiscales = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocCumplimientoObFiscales(){
      var file_cumplimiento_obfisc = document.getElementById("file_cumplimiento_obfisc");
      this.htmlCumplimientoObFiscales = "";
      this.docCumplimientoObFiscales = "";
      this.validator.limpiaTR("#trDocCumplimientoObFiscales");
      this.validator.limpiaInputRow(file_cumplimiento_obfisc);
    }

  //credito
    aceptaCreditoProv(event:any){
      if (event.checked == true) {
        this.decideaceptcredito = true;//
        $("#decidecredito").removeClass("noneView");
      } else {
        this.decideaceptcredito = false;
        $("#decidecredito").addClass("noneView");
      }
      //
      this.activaFunctionRegistro();
    }

    listarMonedAS(){
      this._monedasServ.getMonedasDos().subscribe((data) => {
        this.arrayMonedas = data;
        console.log(data);
        ////
      });
    }

    monedaChange(event:any){
      console.log(event.value);
      if(event.value != "" && this.validator.filtroAlfaNumerico(event.value)){
        for (let i = 0; i < this.arrayMonedas.length; i++) {
          const money = this.arrayMonedas[i];
          if (money['moneda'] == event.value) {
            console.log(money["token_monedas"]);
            this.token_monedaOrden = money['token_monedas'];
            this.decimales_monedaOrden = money['decimales'];
            console.log(this.decimales_monedaOrden);
            this.validator.correctoInputRow(event);
            return;
          } else {
            this.validator.errorInputRow(event);
            this.token_monedaOrden = '';
            this.decimales_monedaOrden = 0;
          }
        }
      } else {
        this.token_monedaOrden = '';
        this.decimales_monedaOrden = 0;
        //M.toast({html: "No se puede seleccionar esta opción", classes: 'rounded'});
      }
      this.activaFunctionRegistro();
    }

    keyupLimiteCredito(event:any){
      if (event.value != "" && this.validator.filtroNum(event.value) == true) {
        this.validator.correctoInputRow(event);
        this.limite_credito = numeral(event.value).format('$0,0.00');
      } else {
        this.validator.errorInputRow(event);
        this.limite_credito = numeral("0.00").format('$0,0.00');
      }
      this.activaFunctionRegistro();
    }

    keypressLimiteCredito(event:any){
      var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
      if (!(/^[0-9$.,]+$/.test(clave))) {
        this.validator.deten(event);
      }
    }

    keyupDiasPagoCredito(event:any){
      if (event.value != '' && this.validator.filtroNum(event.value) == true) {
        this.validator.correctoInputRow(event);
        this.dias_pago_credito = event.value;
      } else {
        this.validator.errorInputRow(event);
        this.dias_pago_credito = 0;
      }
      this.activaFunctionRegistro();
    }

    keypressDiasPagoCredito(event:any){
      var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
      if (!(/^[0-9$.,]+$/.test(clave))) {
        this.validator.deten(event);
      }
    }

    changeComienzaPagoProv(event:any){
      if (event.value != '' && this.validator.strFilEmp(event.value) == true) {
        this.validator.correctoSelectBrowser(event);
        this.comienzacomputo_credito = event.value;
      } else {
        this.validator.errorSelectBrowser(event);
        this.comienzacomputo_credito = "";
      }
      this.activaFunctionRegistro();
    }

  //forma de pago
    tieneFormaPagoProv(event:any){
      if (event.checked == true) {
        this.decideformapago = true;
        $("#decideformapago").removeClass("noneView");
      } else {
        this.decideformapago = false;
        $("#decideformapago").addClass("noneView");
      }
      //
      this.activaFunctionRegistro();
    }

    listFormaPago(){
      this._fpago.getformapago().subscribe((data:InterfPagoForma[]) => {
        this.arraYFormaPago = data;
        //
      })
    }

    listMetodoPago(){
      this._metPago.getMetodo().subscribe((data:InterfMetodoPago[]) => {
        this.arraYMetodoPago = data;
        //
      });
    }

    changeFormaPagoAltaProv(event:any){
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
        for (let i = 0; i < this.arraYFormaPago.length; i++) {
          const row = this.arraYFormaPago[i];
          if (row["forma"] == event.value) {
            this.validator.correctoInputRow(event);
            this.tknFormaPagoProv = row["token_formapago"];
            this.activaFunctionRegistro();
            //
            return;
          } else {
            this.activaFunctionRegistro();
            this.validator.errorInputRow(event);
            this.tknFormaPagoProv = "";
          }
        } 
      } else {
        this.validator.errorInputRow(event);
        this.tknFormaPagoProv = "";
        //M.toast({html: "forma de pago invalida, revisa tu información o comunicate a soporte", classes: 'rounded'});
      }
      this.activaFunctionRegistro();
    }

    changeEscannerEstadoCuenta(e:any){
      var local = this;
      for (let i = 0; i < e.target.files.length; i++) {
        const document = e.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(document);
        if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
          this.typoEstadoCuenta = document.type;
          this.validator.correctoTR("#trDocEstadoCuenta");
          this.docEstadoCuenta = document;
          
          reader.onload = function(this){
            //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
            //let imgPerfil = '<iframe id="framedocSituacionFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            local.regresaHtmlEstadoCuenta(reader.result);
          }
        } else {
          this.validator.errorTR("#trDocEstadoCuenta");
          this.typoEstadoCuenta = "";
          this.htmlEstadoCuenta = "";
          if (e.target.files[0].size > 2000000) {
            //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
          }
          if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
            //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
          }
        }
        console.log(this.htmlEstadoCuenta);
      }
      this.activaFunctionRegistro();
    }

    regresaHtmlEstadoCuenta(text_document:any){
      this.htmlEstadoCuenta = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
    }

    deleteDocEstadoCuenta(){
      var file_estado_cuenta = document.getElementById("file_estado_cuenta");
      this.htmlEstadoCuenta = "";
      this.docEstadoCuenta = "";
      this.validator.limpiaTR("#trDocCumplimientoObFiscales");
      this.validator.limpiaInputRow(file_estado_cuenta);
    }

    decideTipoReferenciaPago(event:any,referenciaPago:any){
      $("#txtClabeInt").prop("checked",false);
      $("#txtConvenio").prop("checked",false);
      $("#txtLineaCap").prop("checked",false);

      if (referenciaPago != '' && this.validator.strFilEmp(referenciaPago) == true) {
        if (referenciaPago == "clabeInterbancaria") {
          this.tipoReferenciaPago = 'ci';
        } else if (referenciaPago == "convenio") {
          this.tipoReferenciaPago = 'co';
          this.clabeInterbancariaPago = "000-000-00000000000-0"; 
        } else if (referenciaPago == "lineaCaptura") {
          this.tipoReferenciaPago = 'lc';
          this.clabeInterbancariaPago = "000-000-00000000000-0"; 
        }
        $(event).prop("checked",true);
      } else {
        this.tipoReferenciaPago = "";
        //M.toast({html: "Eerror en elección", classes: 'rounded'});
      }
      this.activaFunctionRegistro();
    }

    keyupClabeIntBanc_banco(event:any){
      if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 3) {
        this.clabeInterbancariaBanco = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.clabeInterbancariaBanco = "";
        this.validator.errorInputRow(event);
      }
      this.llenaClabeInterbancaria();
      this.activaFunctionRegistro();
    }

    keyupClabeIntBanc_plaza(event:any){
      if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 3) {
        this.clabeInterbancariaPlaza = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.clabeInterbancariaPlaza = "";
        this.validator.errorInputRow(event);
      }
      this.llenaClabeInterbancaria();
      this.activaFunctionRegistro();
    }

    keyupClabeIntBanc_cuenta(event:any){
      if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 11) {
        this.clabeInterbancariaCuenta = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.clabeInterbancariaCuenta = "";
        this.validator.errorInputRow(event);
      }
      this.llenaClabeInterbancaria();
      this.activaFunctionRegistro();
    }

    keyupClabeIntBanc_control(event:any){
      if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 1) {
        this.clabeInterbancariaControl = event.value;
        this.validator.correctoInputRow(event);
      } else {
        this.clabeInterbancariaControl = "";
        this.validator.errorInputRow(event);
      }
      this.llenaClabeInterbancaria();
      this.activaFunctionRegistro();
    }

    llenaClabeInterbancaria(){
      if ((this.clabeInterbancariaBanco != '' && this.validator.filtroCuenta(this.clabeInterbancariaBanco) == true && this.clabeInterbancariaBanco.length == 3) &&
        (this.clabeInterbancariaPlaza != '' && this.validator.filtroCuenta(this.clabeInterbancariaPlaza) == true && this.clabeInterbancariaPlaza.length == 3) &&
        (this.clabeInterbancariaCuenta != '' && this.validator.filtroCuenta(this.clabeInterbancariaCuenta) == true && this.clabeInterbancariaCuenta.length == 11) && 
        (this.clabeInterbancariaControl != '' && this.validator.filtroCuenta(this.clabeInterbancariaControl) == true && this.clabeInterbancariaControl.length == 1)) {
        this.clabeInterbancariaPago = this.clabeInterbancariaBanco+'-'+this.clabeInterbancariaPlaza+'-'+this.clabeInterbancariaCuenta+'-'+this.clabeInterbancariaControl;
      } else {
        this.clabeInterbancariaPago = "000-000-00000000000-0"; 
      }
      this.activaFunctionRegistro();
    }

    keypressClabeIntBanc(event:any){
      var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
      if (!/^[0-9]*$/.test(clave)) {
        this.validator.deten(event);
      }
    }

  //facturacion
    recibeFactAntesDespues(event:any){
      console.log(event.checked);
      if (event.checked == true) {
        this.receptFactura = true;
      } else {
        this.receptFactura = false;
      }
      //
    }

  recibeProdAntesDespues(event:any){
    console.log(event.checked);
    if (event.checked == true) {
      this.classRecibeArtPago = false;
    } else {
      this.classRecibeArtPago = true;
    }
    //
  }

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
      this.activaFunctionRegistro();
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
      this.activaFunctionRegistro();
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
          this.activaFunctionRegistro();
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
            this.activaFunctionRegistro();
          }
        }
      });
    }

  //funciones de registro
    activaFunctionRegistro(){
      if (this.validatePersonales == true
        && (this.decideinfocontacto == false || (this.decideinfocontacto == true && this.listaContactoPersonal.length > 0)) 
        && (this.tiene_docs_fiscales == false || (this.tiene_docs_fiscales == true && this.docSituacionFiscal != null && this.docCumplimientoObFiscales != null)) 
        && (this.decideaceptcredito == false || (this.decideaceptcredito == true && this.token_monedaOrden != "" && this.limite_credito != "" && this.dias_pago_credito != 0 && this.validator.filtroNum(this.dias_pago_credito) == true))
        && (this.decideformapago == false || (this.decideformapago == true && this.tknFormaPagoProv != "" && this.docEstadoCuenta != null && this.docSituacionFiscal != null && this.tipoReferenciaPago != '' && 
          this.validator.strFilEmp(this.tipoReferenciaPago) == true))
        && this.validateUbicacion == true
      ) {
        this.validateToRegistro = true;
      } else {
        this.validateToRegistro = false;
      }
    }

    solicitaRegistroProveedor(){
      if (this.validatePersonales == true && this.validateUbicacion == true) {
        Swal.fire({
          title: this.translate.instant("swal_attenc"),
          text: this.translate.instant("swal_insert"),
          icon: "warning",
          confirmButtonColor: "#388E3C",
          confirmButtonText: this.translate.instant("swal_yes_insert"),
          showCancelButton: true,
          cancelButtonColor: "#D32F2F",
        }).then((result) => {
          if (result.isConfirmed) {
            this.provServ.proveedor_registrar__compras(
              this.provModelo.rfc_generico,
              this.provModelo.rfc,
              this.provModelo.id_tax,
              this.vClasificacionProv,
              this.vSubClasificacionProv,
              this.paterno,
              this.materno,
              this.nombres,
              this.razon_social,
              this.comercial_nombre,
              this.curp,
              this.paistoken,
              this.sitio_web,
              this.tknRegimenFiscal,
              
              this.decideinfocontacto,
              this.listaContactoPersonal,
              this.tiene_docs_fiscales,
              this.docSituacionFiscal,
              this.docCumplimientoObFiscales,
              this.docContratos,
              this.files_anexos,
              this.decideaceptcredito,
              this.token_monedaOrden,
              this.limite_credito,
              this.dias_pago_credito,
              this.comienzacomputo_credito,
              this.decideformapago,
              this.tknFormaPagoProv,
              this.docEstadoCuenta,
              this.tipoReferenciaPago,
              this.clabeInterbancariaPago,
              this.receptFactura,
              this.classRecibeArtPago,
              
              this.cod_postal,
              this.dipomex_cod_postal_estado,
              this.dipomex_cod_postal_municipio,
              this.dipomex_cod_postal_cp,
              this.dipomex_cod_postal_colonia_vinculada,
              this.listnewdireccionNac,
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
