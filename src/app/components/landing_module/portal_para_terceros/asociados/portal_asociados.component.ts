import { Component, OnInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input} from "@angular/core";
import { ValidatorServService } from "../../../../servicios/validator-serv.service";
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ServEncryptService } from "../../../../servicios/ssic/serv-encrypt.service";
declare var zxcvbn:any;
import "../../../../../assets/js/zxcvbn.js";
import { VentasServService } from "../../../../servicios/ssic/ventas-serv.service";
import { CookieService } from "ngx-cookie-service";
import { Subscription,interval,timer } from 'rxjs';
import { SolicitudFacturaService } from "../../../../servicios/solicitud-factura.service";
import { RegimenFiscalService } from "../../../../servicios/regimen-fiscal.service";
import { direccionesDipoModelo } from "../../../../modelos/direccionesDipoModelo.js";
import { DireccionesService } from "../../../../servicios/ssic/direcciones.service";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CountryISO } from "ngx-material-intl-tel-input";

@Component({
  selector: "app_portal_asociados",
  templateUrl: "./portal_asociados.component.html",
  standalone:false,
  styleUrls: [
    './portal_asociados.component.css',
    '../../../../styles/input_group.css',
    '../../../../styles/login.css',
    '../../../../styles/images.css',
    '../../../../styles/passValidate.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
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
    '../../../../styles/landing.css',
    '../../../../styles/navegador.css',
    '../../../../styles/colores.css',
    '../../../../styles/parallax.css',
    '../../../../styles/div_explain.css',
    '../../../../styles/switches.css',
    '../../../../styles/dirpostales.css',
  ],
  providers:[
    //MainTerAssociatesService,
    //LoginTerClientesService,
    //LoginTerSuppliersService,
    //MainEmployeesService
  ]
})
export class PortalAsociadosComponent implements OnInit {
  public dirModelo: direccionesDipoModelo;
  public acceso_codigo:string = "";
  public acceso_password:string = "";
  public acceso_folio_venta:string = "";
  public token_venta_registrada:string = "";
  detalleVentaRegistrada:any = [];
  public porcentaje_barra:number = 0; 
  public modulo_progresbar:boolean = false; 

  public razon_social_tipo:string = ""; 
  public razon_social_rfc:string = ""; 
  public razon_social_name:string = ""; 
  public razon_social_uso_cfdi:string = ""; 
  lista_uso_cfdi_complete:any = []; 
  lista_uso_cfdi_pf:any = []; 
  lista_uso_cfdi_pm:any = []; 

  public razon_social_regimen_fiscal:string = ""; 
  lista_regimen_fiscal_complete:any = []; 
  lista_regimen_fiscal_pf:any = []; 
  lista_regimen_fiscal_pm:any = []; 

  public razon_social_cpostal:string = "";
  public razon_social_dir_fiscal:string = "";  
  public razon_social_email:string = ""; 

  separateDialCode = false;
  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  phoneForm: FormGroup;
  public razon_social_telefono_dial:string = "";
  public razon_social_telefono_number:string = "";
  public razon_social_telefono_all:string = "";
  constructor(
    private translate:TranslateService,
    private validator:ValidatorServService,
    private encryptor:ServEncryptService,
    private ventServ: VentasServService,
    private sanitizer:DomSanitizer,
    private galletita:CookieService,
    private factServ:SolicitudFacturaService,
    private regFisServ:RegimenFiscalService,
    private dirServ:DireccionesService,
    private routerr:Router,
    private fb: FormBuilder
  ) {
    this.dirModelo = new direccionesDipoModelo("","","",[],"");
    this.phoneForm = new FormGroup({
      telefono: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.ventaMostradorDetalle();
    this.api_uso_cfdi_lista_complete();
    this.api_uso_cfdi_lista_pf();
    this.api_uso_cfdi_lista_pm();
    this.api_regimen_fiscal_lista_complete();
    this.api_regimen_fiscal_lista_pf();
    this.api_regimen_fiscal_lista_pm();
  }

  ventaMostradorDetalle(){
    if (localStorage.length > 0 && localStorage.getItem('user_code') != undefined) {
      this.ventServ.ventaMostradorDetalle().subscribe(
        response => {
          if (response.status == 'success') {
            this.detalleVentaRegistrada = response.dataVenta;
            console.log(this.detalleVentaRegistrada);
            this.token_venta_registrada = this.detalleVentaRegistrada[0]["token_ventas"];
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.detalleVentaRegistrada = [];
    }
  }

  api_uso_cfdi_lista_complete(){
    this.factServ.getApiUsoCFDILista().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listado);
          this.lista_uso_cfdi_complete = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  api_uso_cfdi_lista_pf(){
    this.factServ.getApiUsoCFDIListaPF().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listado);
          this.lista_uso_cfdi_pf = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  api_uso_cfdi_lista_pm(){
    this.factServ.getApiUsoCFDIListaPM().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listado);
          this.lista_uso_cfdi_pm = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  api_regimen_fiscal_lista_complete(){
    this.regFisServ.getApiRegimenFiscalAll().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listado);
          this.lista_regimen_fiscal_complete = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  api_regimen_fiscal_lista_pf(){
    this.regFisServ.getApiRegimenFiscalPF().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listado);
          this.lista_regimen_fiscal_pf = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  api_regimen_fiscal_lista_pm(){
    this.regFisServ.getApiRegimenFiscalPM().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listado);
          this.lista_regimen_fiscal_pm = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  viewPassword(input:any){
    var password_input:any = document.getElementById(input);
    if (password_input.type == "password") {
      password_input.type = "text";
    } else {
      password_input.type = "password";
    }
  }

  validateCodAccesoAssociates(event:any){
    if (event.value != "" && this.validator.filtroCodAccess(event.value) == true && event.value.length == 10) {
      this.acceso_codigo = event.value;
      this.validator.correctoInputRow(event);
      console.log(this.encryptor.imperialEncrypt(this.acceso_codigo))
    } else {
      this.acceso_codigo = "";
      this.validator.errorInputRow(event);
    }
  }

  validatePasswordAssociates(event:any){
    if (event.value != "" && this.validator.filterPasswordVentas(event.value) == true && event.value.length == 8) {
      //console.log(this.encryptor.imperialEncrypt(event.value));
      this.acceso_password = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.acceso_password = "";
      this.validator.errorInputRow(event);
    }
  }

  validateFactVentaAssociates(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.acceso_folio_venta = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.acceso_folio_venta = "";
      this.validator.errorInputRow(event);
    }
  }

  onLoginAssociates(form: { reset: () => void; }): void{
    this.modulo_progresbar = true;
    console.log("VENT-000000008");
    this.ventServ.ventaMostradorAcceso(this.encryptor.imperialEncrypt(this.acceso_codigo),this.encryptor.imperialEncrypt(this.acceso_password),this.acceso_folio_venta).subscribe(//funciones de callback
      response => {
        console.log(response);
        let translate_response = this.translate.instant(response.message);
        if (response.status == "success") {
          setTimeout(() => {
            Swal.fire({
              position:'center',
              icon: 'success',
              title: translate_response,
              showConfirmButton:false,
              timer: 3000
            });
          },1000);
          form.reset();
          var intervalo = setInterval(() => {
            this.porcentaje_barra = this.porcentaje_barra +1;
            var porcentDiv = this.porcentaje_barra+'%';
            $("#progress_assocLog").css("width", porcentDiv);
            if (this.porcentaje_barra == 100) {
              clearInterval(intervalo);
              setTimeout(() => {
                //document.cookie = "code_inside="+response.large_token_access+";path=/;max-age=60*60;";
                localStorage.setItem('module_working',response.modulo_code);
                localStorage.setItem('user_code',response.large_token_access);//tokenUsuario
                sessionStorage.setItem('inside_session_code',response.large_token_access);//tokenUsuario
                //window.location.reload();
                //$('#myModal').modal('hide');
                this.modulo_progresbar = false;
                this.ventaMostradorDetalle();
              },3000);
              //this.modulo_progresbar = false;
            }
          },30);
          this.galletita.set("code_inside",response.large_token_access,1,"/","sos-mexico.com.mx",true,"Lax");
        } else {
          this.modulo_progresbar = false;
          Swal.fire({
            position:'top-end',
            icon: 'warning',
            title: translate_response,
            showConfirmButton:false,
            timer: 3000
          });
        }
        form.reset();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  lgoutFunct(){
    $("ul#listNotificaciones").removeClass("menuActivo"); 
    $("#dropdown_menu_main_terc").addClass("noneView");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_logout"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_logout"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      var enrutador = this.routerr;
      if (result.isConfirmed) {
        //Fuente: https://www.iteramos.com/pregunta/90317/como-cancelaranular-todas-las-peticiones-http-pendientes-angular-4
        const contunlog = timer(3000);
        contunlog.subscribe((a:any) => {
          localStorage.clear();
          sessionStorage.clear();
          enrutador.navigate(['./']);
        });
      }
    });
  }

  soliFactura_tipoRS(tipoRazonSocial:any,botonAction:any){
    $("#fisicaBtnRS").removeClass("active_chip"); 
    $("#moralBtnRS").removeClass("active_chip"); 

    $("#fisicaBtnRS").prop("disabled",false); 
    $("#moralBtnRS").prop("disabled",false); 

    $("#"+botonAction).addClass("active_chip");
    $("#"+botonAction).prop("disabled",true);

    var rs_rfc_row = document.getElementById("rs_rfc_row");
    this.validator.limpiaInput(rs_rfc_row);
    var verifNameRSocial = document.getElementById("verifNameRSocial");
    this.validator.limpiaInput(verifNameRSocial);
    this.razon_social_tipo = tipoRazonSocial == "rsFisica" ? "rsFisica" : "rsMoral";

    this.razon_social_name = ""; 
    this.razon_social_rfc = ""; 
    this.razon_social_uso_cfdi = ""; 
    this.razon_social_regimen_fiscal = ""; 
    this.razon_social_cpostal = "";
    this.razon_social_dir_fiscal = "";  
    this.razon_social_email = ""; 
    this.razon_social_telefono_dial = "";
    this.razon_social_telefono_number = "";
    this.razon_social_telefono_all = "";
  }

  soliFactura_especificaciones(){
    if (this.razon_social_tipo == "rsFisica") {
      $("#lbl_rsocial").html("Escriba su rfc con Homoclave (13 caracteres Ej. ABCD000000XXX)");
      $("#rs_rfc_row").attr("data-length","13");
      $("#rs_rfc_row").attr("placeholder","Ej. ABCD000000XXX");
      $("#rs_rfc_row").attr("maxlength","13");
    }
    if (this.razon_social_tipo == "rsMoral") {
      $("#lbl_rsocial").html("Escriba su rfc con Homoclave (12 caracteres Ej. ABCD000000XXX)");
      $("#rs_rfc_row").attr("data-length","12");
      $("#rs_rfc_row").attr("placeholder","Ej. ABC000000XXX");
      $("#rs_rfc_row").attr("maxlength","12");
    }
  }

  soliFactura_rfcKeyUp(event:any){
    if (this.razon_social_tipo == "rsFisica") {
      if (event.value != "" && this.validator.filtroRfcPersFisica(event.value) == true && event.value.length == 13) {
        this.validator.correctoInputRow(event);
        this.razon_social_rfc = event.value;
      } else {
        this.validator.errorInputRow(event);
        this.razon_social_rfc = "";
      }
    }
    if (this.razon_social_tipo == "rsMoral") {
      if (event.value != "" && this.validator.filtroRfcPersMoral(event.value) == true && event.value.length == 12) {
        this.validator.correctoInputRow(event);
        this.razon_social_rfc = event.value;
      }
      else{
        this.validator.errorInputRow(event);
        this.razon_social_rfc = "";
      }
    }
  }

  soliFactura_rsocialKeyUp(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.validator.correctoInputRow(event);
      this.razon_social_name = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.razon_social_name = "";
    }
  }

  soliFactura_UsoCFDIChange(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && (event.value.length === 3 || event.value.length == 4)) {
      for (let i = 0; i < this.lista_uso_cfdi_complete.length; i++) {
        const uso = this.lista_uso_cfdi_complete[i];
        console.log(uso["clave_uso"]);
        if (uso["clave_uso"] == event.value) {
          this.validator.correctoInputRow(event);
          this.razon_social_uso_cfdi = event.value;
          return;
        } else {
          this.validator.errorInputRow(event);
          this.razon_social_uso_cfdi = "";
        }
      }
    } else {
      console.log("error");
      this.validator.errorInputRow(event);
      this.razon_social_uso_cfdi = "";
    }
  }

  soliFactura_RegimenFiscalChange(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && (event.value.length === 3 || event.value.length == 4)) {
      for (let i = 0; i < this.lista_regimen_fiscal_complete.length; i++) {
        const reg = this.lista_regimen_fiscal_complete[i];
        console.log(reg["clave"]);
        if (reg["clave"] == event.value) {
          this.validator.correctoInputRow(event);
          this.razon_social_regimen_fiscal = event.value;
          return;
        } else {
          this.validator.errorInputRow(event);
          this.razon_social_regimen_fiscal = "";
        }
      }
    } else {
      console.log("error");
      this.validator.errorInputRow(event);
      this.razon_social_regimen_fiscal = "";
    }
  }

  soliFactura_buscaCP(event:any){
    if (event.value != "" && event.value.length == 5) {
      this.validator.correctoInputRow(event);
      this.dirModelo.dipomex_cod_postal_colonias.length = 0;
      this.dirModelo.dipomex_cod_postal_estado = "";
      this.dirModelo.dipomex_cod_postal_municipio = "";
      this.dirModelo.dipomex_cod_postal_cp = "";
      this.dirModelo.dipomex_cod_postal_colonia_vinculada = "";
      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.dirModelo.dipomex_cod_postal_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
            this.dirModelo.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.dirModelo.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
            this.dirModelo.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
            if (response.cod_postal["colonias"].length == 1) {
              this.dirModelo.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
              this.razon_social_cpostal = this.dirModelo.dipomex_cod_postal_cp;
            } else {
              this.razon_social_cpostal = "";
            }
          } else {
            this.razon_social_cpostal = "";
            Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
            if (response.message == "postal_empty") {
              this.dirModelo.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
              this.dirModelo.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
              this.dirModelo.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
            }
          }
        },
        error => {console.log(error);}
      )
    } else {
      this.validator.errorInputRow(event)
    }
  }

  soliFactura_ColoniaCP(colonia_name:any){
    if (colonia_name != "") {
      for (let i = 0; i < this.dirModelo.dipomex_cod_postal_colonias.length; i++) {
        if (this.dirModelo.dipomex_cod_postal_colonias[i] == colonia_name) {
          this.dirModelo.dipomex_cod_postal_colonia_vinculada = colonia_name;
          this.razon_social_cpostal = this.dirModelo.dipomex_cod_postal_cp;
        }
      }
    } else {
      this.razon_social_cpostal = "";
    }
  }

  soliFactura_DirFiscal(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.razon_social_dir_fiscal = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.razon_social_dir_fiscal = "";
      this.validator.errorInputRow(event);
    }
  }

  soliFactura_Email(event:any){
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
      this.razon_social_email = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.razon_social_email = "";
      this.validator.errorInputRow(event);
    }
  }

  probarTextPhone(){
    if (this.phoneForm.valid) {
      const phoneNumber = this.phoneForm.get('telefono')?.value;
      const dialCode = phoneNumber?.number;
      console.log('Número de teléfono registrado:', phoneNumber+" "+dialCode);
      // Aquí puedes manejar el número de teléfono según tus necesidades
    }
  }

  soliFactura_Phone(event:any){
    if (event.value != "" && event.value.length >= 5 && this.validator.filtroNum(event.value) == true && this.phoneForm.valid) {
      const phoneNumber = this.phoneForm.get('telefono')?.value;
      this.validator.correctoInputRow(event);
      this.razon_social_telefono_dial = phoneNumber?.dialCode;
      this.razon_social_telefono_number = phoneNumber?.number;
      this.razon_social_telefono_all = phoneNumber;
      console.log(event.value+" "+phoneNumber?.dialCode+" "+phoneNumber?.number);
    } else {
      this.razon_social_telefono_dial = "";
      this.razon_social_telefono_number = "";
      this.razon_social_telefono_all = "";
      this.validator.errorInputRow(event);
    }
  }

  get listoToRegistro(): boolean {
    return (
      this.razon_social_tipo != '' &&
      this.razon_social_rfc != '' &&
      this.razon_social_name != '' &&
      this.razon_social_uso_cfdi != '' &&
      this.razon_social_regimen_fiscal != '' &&
      this.razon_social_cpostal != '' &&
      this.razon_social_dir_fiscal != '' &&
      (this.razon_social_cpostal != '' || this.razon_social_dir_fiscal != '')
    );
  }

  registraSolicitudFactura(form: { reset: () => void; }): void{
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.factServ.saveSolicitudFacturaMostrador(
            this.token_venta_registrada,
            this.razon_social_tipo, 
            this.razon_social_rfc, 
            this.razon_social_name, 
            this.razon_social_uso_cfdi, 
            this.razon_social_regimen_fiscal,
            this.razon_social_cpostal,
            this.razon_social_dir_fiscal,  
            this.dirModelo.dipomex_cod_postal_estado,
            this.dirModelo.dipomex_cod_postal_municipio,
            this.dirModelo.dipomex_cod_postal_cp,
            this.dirModelo.dipomex_cod_postal_colonia_vinculada,
            this.razon_social_email, 
            this.razon_social_telefono_dial,
            this.razon_social_telefono_number,
            this.razon_social_telefono_all,
            ).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                window.location.reload();
                //this.listaProyectosTrue();

                //this.recibePush("Fv9yVMOdtQ50fB9kYaGoa8p0XyRx3r03wlPQRHZDn6Y");
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
      }
    );
  }

}
