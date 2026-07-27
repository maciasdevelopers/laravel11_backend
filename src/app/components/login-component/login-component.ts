import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../servicios/validator-serv.service';
import { ServEncryptService } from '../../servicios/ssic/serv-encrypt.service';
import { sessionModelo } from '../../modelos/sessionModelo';
import { SentinelArkManager } from '../../servicios/sentinel-ark-manager';
import { ApiInternaService } from '../../servicios/api-interna.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { NotificacionesService } from '../../servicios/notificaciones.service';
import emailjs from '@emailjs/browser';
import { passwordsAngularModelo } from '../../modelos/passwordsAngularModelo';
declare var zxcvbn: any;
import '../../../assets/js/zxcvbn.js';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComunicacionInternaService } from '../../servicios/comunicacion-interna.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sos_mexico_login_window',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrls: [
    '../../styles/navegador.css',
    '../../styles/landing.css',
    '../../styles/input_group.css',
    '../../styles/login.css',
    '../../styles/images.css',
    '../../styles/explain.css',
    '../../styles/buttons.css',
    '../../styles/loading.css',
    '../../styles/collection.css',
    '../../styles/collapsible.css',
    '../../styles/passValidate.css',
    '../../styles/parallax.css',
    '../../styles/modals.css',
    './login-component.css',
  ],
  providers: [ConfirmationService]
})
export class LoginComponent implements OnInit {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public show_pass_reset: boolean = false;

  //login
  public usuario: sessionModelo;
  public visor_pass_active: boolean = false;

  public mayusLogin: boolean = false;
  public numberLogin: boolean = false;
  public symbolLogin: boolean = false;

  public porcentaje_barra: number = 0;
  //public status: string = "";

  //update pass
  public contras: passwordsAngularModelo;
  public email_user: string = "";
  public user_token_text: string = "";
  public process_reset_pass: string = "zero";
  public code_verif_txt: string = "";

  public mayusPrimera: boolean = false;
  public minusPrimera: boolean = false;
  public numberPrimera: boolean = false;
  public symbolPrimera: boolean = false;
  public strengthClassPrimera: string = 'strengthPrimera password-strength';
  public mayusConfirmacion: boolean = false;
  public minusConfirmacion: boolean = false;
  public numberConfirmacion: boolean = false;
  public symbolConfirmacion: boolean = false;
  public strengthClassConfirmacion: string = 'strengthConfirmacion password-strength';

  public eqpass: boolean = true;
  public btnModalActPass: boolean = false;
  public popUpAccept: string = "";
  public popUpReject: string = "";

  constructor(
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private sentinela: SentinelArkManager,
    private inside_api: ApiInternaService,
    private routerr: Router,
    private galletita: CookieService,
    private translate: TranslateService,
    private primeAlerts: MessageService,
    private confirmationService: ConfirmationService,
    private relInterna: ComunicacionInternaService,
    private mensajes: NotificacionesService
  ) {
    this.usuario = new sessionModelo("", "", "", "");
    this.contras = new passwordsAngularModelo('', '', '');
  }

  ngOnInit(): void {
    this.getTokenDeviceFire();
  }

  validateCodAccesoLogin(event: any) {
    const validacion = event.value != "" && ((this.validator.filtroCodAccess(event.value) && 7 < event.value.length && event.value.length < 10) || (this.validator.filtroCorreo(event.value)));
    this.usuario.codigo_acceso = validacion ? this.encryptor.santoEncryptCode(event.value) : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  viewPassword(input: any) {
    var password_input: any = document.getElementById(input);
    if (password_input.type == "password") {
      password_input.type = "text";
    } else {
      password_input.type = "password";
    }
  }

  validatePasswordLogin(event: any) {
    this.visor_pass_active = true;
    this.mayusLogin = this.validator.filterPasswordMayus(event.value[0]) == true ? true : false;
    this.numberLogin = this.validator.filterPasswordNumber(event.value.trim()) == true ? true : false;
    this.symbolLogin = this.validator.filterPasswordSymbol(event.value) == true ? true : false;

    const validacion = event.value != '' && this.mayusLogin && this.numberLogin && this.symbolLogin && this.validator.filterPassword(event.value) && event.value.length >= 8;
    this.usuario.password = validacion ? this.encryptor.santoEncryptPass(event.value) : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);

    if (event.value == '') {
      this.visor_pass_active = false;
      this.mayusLogin = false;
      this.numberLogin = false;
      this.symbolLogin = false;
    }
  }

  async onLoginSSIC(form: { reset: () => void; }): Promise<void> {
    $("#progress_login").removeClass("noneView");
    this.porcentaje_barra = 0;

    this.sentinela.inicia_session_usuario_main(this.usuario).subscribe({
      next:(response) => {
        if (response.status == 'success') {
          this.procesarSesionExitosa(response, form);
        } else {
          this.manejarErrorLogin(response.message || 'Error al iniciar sesión');
        }
      },
      error:(err) => {
        $("#progress_login").addClass("noneView");
        console.log('Error login:', err);
      }
    });
  }

  private procesarSesionExitosa(response: any, form: { reset: () => void; }){
    //this.currentUserSubject.next(response.dataUsers);
    const userData = response.dataUsers;
    const token = response.large_token_access;
    localStorage.setItem('user_code', token);
    localStorage.setItem('user_info', JSON.stringify(userData));
    localStorage.setItem('last_actividad', "" + Math.floor(Date.now() / 1000));
    localStorage.setItem('session_active', 'true');
    sessionStorage.setItem('inside_session_code', token);
    this.sentinela.tiempo_inactivo_contador();
    
    var intervalo = setInterval(() => {
      this.porcentaje_barra += 2;
      $("#progress_login").css("width", this.porcentaje_barra + '%');
      $("#progress_login").attr("aria-valuenow", this.porcentaje_barra);
      if (this.porcentaje_barra >= 100) {
        clearInterval(intervalo);
        setTimeout(() => {
          $("#progress_login").addClass("noneView");
          form.reset();
          this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa:', detail: "Bienvenido" });
          this.routerr.navigate([response.modulo_destino]);
        },500);
      }
    }, 30);
  } 

  private manejarErrorLogin(mensaje: string) {
    $("#progress_login").addClass("noneView");
    const translate_response = this.translate.instant(mensaje);
    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa:', detail: translate_response });
  }
  
  //enviar codigo de verificacion
  getTokenDeviceFire() {
    this.mensajes.tokenSalida$.subscribe(data => {
      this.usuario.token_device = data;
    });
    (window as any).receiveFCMToken = (token: string) => {
      console.log('Token recibido desde Android:', token);
      this.usuario.token_device = token;
    }
  }

  validateCodAccesoCodePass(event: any) {
    const validacion = event.value != "" && this.validator.filtroCorreo(event.value);
    this.usuario.email = validacion ? this.encryptor.santoEncryptCode(event.value) : "";
    this.email_user = validacion ? event.value : "";
    validacion ? this.validator.correctoInput2(event, '&#x40;&nbsp;' + this.translate.instant("email")) : this.validator.errorInput2(event, '&#x40;&nbsp;' + this.translate.instant("email_fail"));
  }

  onSendCodeVerif(form: { reset: () => void; }): void {
    console.log(this.usuario);
    this.sentinela.sendCodePassUpdate(this.usuario, null).subscribe(//funciones de callback
      response => {
        console.log(response);
        let translate_response = this.translate.instant(response.message);
        if (response.status == 'success') {
          let mensaje_serv = this.translate.instant(response.message);
          this.user_token_text = response.user_token_text;
          //this.listaPersonal();
          const parametros = {
            from_name: 'SOPORTE SOS',
            from_email: 'soporte@sos-mexico.com.mx',
            to_name: this.email_user,
            to_email: this.email_user,
            access_code: response.random_text,
            link: 'https://sos-mexico.com.mx'
          };
          //emailjs.send(user['email'],contenidoHtml,parametros,'')
          emailjs.send('service_dejznyj', 'template_jpadj0q', parametros, 'H1Nl6vkZbsBm1MtNF')
            .then((response) => {
              console.log("success", response.status, response.text);
              this.process_reset_pass = "one";
              this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: mensaje_serv });
            }, (err) => {
              this.process_reset_pass = "zero";
              this.usuario.email = "";
              this.email_user = "";
              this.user_token_text = "";
              console.log("falla", err);
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: "falla " + err,
                showConfirmButton: false,
                timer: 3000,
                customClass: { popup: 'my-swal-zindex' }
              })
            });
        } else {
          this.process_reset_pass = "zero";
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });
        }
        //form.reset();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //verificar codigo de verificacion
  verificarCodAccesoCodePass(event: any) {
    const validacion = event.value != "" && this.validator.filtroCodAccess(event.value) && event.value.length == 10;
    this.code_verif_txt = validacion ? event.value : "";
    validacion ? this.validator.correctoInput2(event, '&#xf13e;&nbsp;' + this.translate.instant("verif_code_user")) : this.validator.errorInput2(event, '&#xf13e;&nbsp;' + this.translate.instant("verif_code_user_fail"));
  }

  onVerifiyCodeVerif() {
    console.log(this.usuario);
    this.sentinela.verifCodePassUpdate(this.user_token_text, this.code_verif_txt).subscribe(//funciones de callback
      response => {
        console.log(response);
        let translate_response = this.translate.instant(response.message);
        if (response.status == 'success') {
          this.process_reset_pass = "two";
          this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: translate_response });
        } else {
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });

          if (response.resp_cod != "none" && response.resp_cod != "success") {
            this.process_reset_pass = "zero";
            this.user_token_text = "";
            this.usuario.email = "";
            this.email_user = "";
          }
        }
        //form.reset();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  openResetPassBool(boolean: any) {
    this.show_pass_reset = boolean == true ? true : false;
    this.relInterna.mensajeLoginUser(boolean ? "pass_reset" : "access_ssic");
  }


  //resetear Contraseña
  pIgualesveirf() {
    var txtprimerCPassword = document.getElementById("primerCPassword");
    var txtsecondCPassword = document.getElementById("secondCPassword");
    var paaeqpassword: any = document.getElementById("eqpassword");
    const pass_no_empty = this.contras.passPrimera != '' && this.contras.passSegunda != '';
    this.btnModalActPass = false;
    this.eqpass = false;
    paaeqpassword.innerHTML = "✖ Contraseñas diferentes";

    if (!pass_no_empty) {
      if (this.contras.passPrimera == '') this.validator.errorInputRow(txtprimerCPassword);
      if (this.contras.passSegunda == '') this.validator.errorInputRow(txtsecondCPassword);
      return;
    }

    const pass_primera = this.mayusPrimera && this.minusPrimera && this.numberPrimera && this.symbolPrimera;
    const pass_confirm = this.mayusConfirmacion && this.minusConfirmacion && this.numberConfirmacion && this.symbolConfirmacion;

    if (this.contras.passPrimera == this.contras.passSegunda && pass_primera && pass_confirm) {
      this.eqpass = true;
      paaeqpassword.innerHTML = "✔ Contraseñas iguales";
      this.btnModalActPass = true;
    }
  }

  keyupPrimerClave(event: any) {
    const pdwVal = event.value;
    let result: any = zxcvbn(pdwVal);//new zxcvbn(pdwVal);
    this.strengthClassPrimera = 'strengthPrimera password-strength strength-' + result.score;
    this.mayusPrimera = /[A-Z]/.test(pdwVal);
    this.minusPrimera = /[a-z]/.test(pdwVal);
    this.numberPrimera = this.validator.filterPasswordNumber(pdwVal);
    this.symbolPrimera = this.validator.filterPasswordSymbol(pdwVal);
    const OKParams = this.mayusPrimera && this.minusPrimera && this.numberPrimera && this.symbolPrimera;
    const validacion = pdwVal != '' && this.validator.filterPassword(pdwVal) && pdwVal.length >= 8 && result.score > 2 && OKParams;
    //this.encryptor.santoEncryptPass(event.value)
    this.contras.passPrimera = validacion ? pdwVal : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.pIgualesveirf();
  }

  keyupClaveConfirmacion(event: any) {
    const pdwVal = event.value;
    let result: any = zxcvbn(pdwVal);//new zxcvbn(pdwVal);
    this.strengthClassConfirmacion = 'strengthConfirmacion password-strength strength-' + result.score;
    this.mayusConfirmacion = /[A-Z]/.test(pdwVal);
    this.minusConfirmacion = /[a-z]/.test(pdwVal);
    this.numberConfirmacion = this.validator.filterPasswordNumber(pdwVal);
    this.symbolConfirmacion = this.validator.filterPasswordSymbol(pdwVal);

    const OKParams = this.mayusConfirmacion && this.minusConfirmacion && this.numberConfirmacion && this.symbolConfirmacion;
    const validacion = pdwVal != '' && this.validator.filterPassword(pdwVal) && pdwVal.length >= 8 && result.score > 2 && OKParams;
    //this.encryptor.santoEncryptPass(event.value);
    this.contras.passSegunda = validacion ? pdwVal : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.pIgualesveirf();
  }

  resetPassWordYa(event: Event) {
    this.popUpAccept = this.translate.instant("swal_yes_update");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_update"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        this.sentinela.resetPasswordSsic(this.user_token_text, this.contras.passPrimera, this.contras.passSegunda).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: translate_response });
              this.process_reset_pass = "zero";
            }
            if (response.status == 'error') {
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }
}
