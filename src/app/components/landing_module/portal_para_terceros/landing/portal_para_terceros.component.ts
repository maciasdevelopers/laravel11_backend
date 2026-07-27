import { Component, OnInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input} from "@angular/core";
import { Usuarios } from "../../../../modelos/Usuarios.js";
import { ValidatorServService } from "../../../../servicios/validator-serv.service";
import { UniMedServService } from "../../../../servicios/uni-med-serv.service";
import { InterfPais } from "../../../../interfaces/interf-pais.js";
import { PaisService } from "../../../../servicios/ssic/pais.service";
import { TranslateService } from '@ngx-translate/core';
import { MonedasService } from "../../../../servicios/monedas.service";
import { InterfPagoForma } from "../../../../interfaces/interf-pago-forma";
import { FormaPagoService } from "../../../../servicios/ssic/forma-pago.service";
import { Router } from "@angular/router";
import { passwordsAngularModelo } from "../../../../modelos/passwordsAngularModelo";
import { ServEncryptService } from "../../../../servicios/ssic/serv-encrypt.service";
import "../../../../../assets/js/zxcvbn.js";

@Component({
  selector: "app_portal_para_terceros",
  templateUrl: "./portal_para_terceros.component.html",
  standalone:false,
  styleUrls: [
    './portal_para_terceros.component.css',
    '../../../../styles/landing.css',
    '../../../../styles/modals.css',
    '../../../../styles/input_group.css',
    '../../../../styles/login.css',
    '../../../../styles/images.css',
    '../../../../styles/buttons.css',
    '../../../../styles/passValidate.css',
    '../../../../styles/parallax.css',
    '../../../../styles/cards.css',
  ]
})
export class PortalParaTercerosComponent implements OnInit {
  public token_firebase_web:string;
  public usuario: Usuarios;
  public status: string;
  public token: any;
  public identificaUser: any;
  public boolDecision:any;

  public contras: passwordsAngularModelo;
  public visor_pass_active:boolean = false;

  public mayusAssociatesLogin:boolean;
  public mayusClientsLogin:boolean;
  public mayusSuppliersLogin:boolean;
  public mayusEmployeesLogin:boolean;

  public numberAssociatesLogin:boolean;
  public numberClientsLogin:boolean;
  public numberSuppliersLogin:boolean;
  public numberEmployeesLogin:boolean;

  public symbolAssociatesLogin:boolean;
  public symbolClientsLogin:boolean;
  public symbolSuppliersLogin:boolean;
  public symbolEmployeesLogin:boolean;

  public email_associates_user:string;
  public email_clients_user:string;
  public email_suppliers_user:string;
  public email_employees_user:string;

  public user_token_associates_text:string;
  public user_token_clients_text:string;
  public user_token_suppliers_text:string;
  public user_token_employees_text:string;

  public process_reset_associates_pass:string;
  public process_reset_clients_pass:string;
  public process_reset_suppliers_pass:string;
  public process_reset_employees_pass:string;

  public code_verif_associates_txt:string;
  public code_verif_clients_txt:string;
  public code_verif_suppliers_txt:string;
  public code_verif_employees_txt:string;

  public strengthassociatesClassPrimera:string;
  public strengthclientsClassPrimera:string;
  public strengthsuppliersClassPrimera:string;
  public strengthemployeesClassPrimera:string;

  public mayusassociatesPrimera:boolean;
  public mayusclientsPrimera:boolean;
  public mayussuppliersPrimera:boolean;
  public mayusemployeesPrimera:boolean;

  public numberassociatesPrimera:boolean;
  public numberclientsPrimera:boolean;
  public numbersuppliersPrimera:boolean;
  public numberemployeesPrimera:boolean;

  public symbolassociatesPrimera:boolean;
  public symbolclientsPrimera:boolean;
  public symbolsuppliersPrimera:boolean;
  public symbolemployeesPrimera:boolean;

  public strengthassociatesClassConfirmacion:string;
  public strengthclientsClassConfirmacion:string;
  public strengthsuppliersClassConfirmacion:string;
  public strengthemployeesClassConfirmacion:string;

  public mayusassociatesConfirmacion:boolean;
  public mayusclientsConfirmacion:boolean;
  public mayussuppliersConfirmacion:boolean;
  public mayusemployeesConfirmacion:boolean;

  public numberassociatesConfirmacion:boolean;
  public numberclientsConfirmacion:boolean;
  public numbersuppliersConfirmacion:boolean;
  public numberemployeesConfirmacion:boolean;

  public symbolassociatesConfirmacion:boolean;
  public symbolclientsConfirmacion:boolean;
  public symbolsuppliersConfirmacion:boolean;
  public symbolemployeesConfirmacion:boolean;

  public eqAssociatesPass:boolean;
  public eqClientsPass:boolean;
  public eqSuppliersPass:boolean;
  public eqEmployeesPass:boolean;

  public btnAssociatesModalActPass:boolean;
  public btnClientsModalActPass:boolean;
  public btnSuppliersModalActPass:boolean;
  public btnEmployeesModalActPass:boolean;

  pageAltaPostales:number = 1;
  options = {};
  arraYpais: InterfPais[] = [];
  arrayMonedas:any = [];
  arraYFormaPago: InterfPagoForma[] = [];
  constructor(
    public validator:ValidatorServService,
    public _medidasCat:UniMedServService,
    public _pais:PaisService,
    public _monedasServ: MonedasService,
    public _fpago: FormaPagoService,
    private translate:TranslateService,
    //public _provServ: ProveedoresService,
    private routerr:Router,
    public encryptor:ServEncryptService) {
    this.token_firebase_web = "";
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.contras = new passwordsAngularModelo("","","");
    this.status = "";
    this.boolDecision = "";

    this.mayusAssociatesLogin = false;
    this.mayusClientsLogin = false;
    this.mayusSuppliersLogin = false;
    this.mayusEmployeesLogin = false;

    this.numberAssociatesLogin = false;
    this.numberClientsLogin = false;
    this.numberSuppliersLogin = false;
    this.numberEmployeesLogin = false;

    this.symbolAssociatesLogin = false;
    this.symbolClientsLogin = false;
    this.symbolSuppliersLogin = false;
    this.symbolEmployeesLogin = false;

    this.email_associates_user = "";
    this.email_clients_user = "";
    this.email_suppliers_user = "";
    this.email_employees_user = "";

    this.user_token_associates_text = "";
    this.user_token_clients_text = "";
    this.user_token_suppliers_text = "";
    this.user_token_employees_text = "";

    this.process_reset_associates_pass = "zero";
    this.process_reset_clients_pass = "zero";
    this.process_reset_suppliers_pass = "zero";
    this.process_reset_employees_pass = "zero";

    this.code_verif_associates_txt = "";
    this.code_verif_clients_txt = "";
    this.code_verif_suppliers_txt = "";
    this.code_verif_employees_txt = "";

    this.strengthassociatesClassPrimera = "strengthPrimera password-strength";
    this.strengthclientsClassPrimera = "strengthPrimera password-strength";
    this.strengthsuppliersClassPrimera = "strengthPrimera password-strength";
    this.strengthemployeesClassPrimera = "strengthPrimera password-strength";

    this.mayusassociatesPrimera = true;
    this.mayusclientsPrimera = true;
    this.mayussuppliersPrimera = true;
    this.mayusemployeesPrimera = true;

    this.numberassociatesPrimera = true;
    this.numberclientsPrimera = true;
    this.numbersuppliersPrimera = true;
    this.numberemployeesPrimera = true;

    this.symbolassociatesPrimera = true;
    this.symbolclientsPrimera = true;
    this.symbolsuppliersPrimera = true;
    this.symbolemployeesPrimera = true;

    this.strengthassociatesClassConfirmacion = "strengthConfirmacion password-strength";
    this.strengthclientsClassConfirmacion = "strengthConfirmacion password-strength";
    this.strengthsuppliersClassConfirmacion = "strengthConfirmacion password-strength";
    this.strengthemployeesClassConfirmacion = "strengthConfirmacion password-strength";

    this.mayusassociatesConfirmacion = true;
    this.mayusclientsConfirmacion = true;
    this.mayussuppliersConfirmacion = true;
    this.mayusemployeesConfirmacion = true;

    this.numberassociatesConfirmacion = true;
    this.numberclientsConfirmacion = true;
    this.numbersuppliersConfirmacion = true;
    this.numberemployeesConfirmacion = true;

    this.symbolassociatesConfirmacion = true;
    this.symbolclientsConfirmacion = true;
    this.symbolsuppliersConfirmacion = true;
    this.symbolemployeesConfirmacion = true;

    this.eqAssociatesPass = true;
    this.eqClientsPass = true;
    this.eqSuppliersPass = true;
    this.eqEmployeesPass = true;

    this.btnAssociatesModalActPass = false;
    this.btnClientsModalActPass = false;
    this.btnSuppliersModalActPass = false;
    this.btnEmployeesModalActPass = false;
  }

  ngOnInit(): void {
    this._pais.getListaPais().subscribe((data:InterfPais[]) => {
      this.arraYpais = data;
      //console.log(this.arraYpais);
    });

    this._monedasServ.getMonedasDos().subscribe((data) => {
      this.arrayMonedas = data;
      //console.log(data);
    });

    this._fpago.getformapago().subscribe((data:InterfPagoForma[]) => {
      this.arraYFormaPago = data;
    })
  }

  requestPermission() {
    //const messaging = getMessaging();
    //getToken(messaging, { vapidKey:environment.vapidKey}).then((currentToken) => {
    //  if (currentToken) {
    //    console.log("Hurraaa!!! we got the token.....")
    //    console.log(currentToken);
    //    this.token_firebase_web = currentToken;
    //    this.usuario.firebase_token_web = currentToken;
    //    // Send the token to your server and update the UI if necessary
    //    // ...
    //  } else {
    //    // Show permission request UI
    //    console.log('No registration token available. Request permission to generate one.');
    //    // ...
    //  }
    //}).catch((err) => {
    //  console.log('An error occurred while retrieving token. ', err);
    //  // ...
    //});
  }

  disableVisorPass(){
    this.visor_pass_active = false;
  }

  viewPassword(input:any){
    var password_input:any = document.getElementById(input);
    if (password_input.type == "password") {
      password_input.type = "text";
    } else {
      password_input.type = "password";
    }
  }
}
