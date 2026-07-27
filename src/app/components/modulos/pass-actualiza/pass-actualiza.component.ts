import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ContrasenaServiceService } from '../../../servicios/ssic/contrasena-service.service.js';
import { ValidatorServService } from '../../../servicios/validator-serv.service';
import { passwordsAngularModelo } from '../../../modelos/passwordsAngularModelo';
import { DomSanitizer } from '@angular/platform-browser';
import { ServLandJSService } from '../../../servicios/serv-land-js.service';
import { ServEncryptService } from '../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare var zxcvbn:any;

import '../../../../assets/js/zxcvbn.js';

@Component({
  selector: 'app-pass-actualiza',
  templateUrl: './pass-actualiza.component.html',
  standalone:false,
  styleUrls: ['./pass-actualiza.component.css']
})
export class PassActualizaComponent implements OnInit {
  public token: any;
  public identificaUser: any;

  public contras: passwordsAngularModelo;
  public imgFondo:string;
  public mayusPrimera:boolean;
  public numberPrimera:boolean;
  public symbolPrimera:boolean;
  public strengthClassPrimera:string;
  public mayusConfirmacion:boolean;
  public numberConfirmacion:boolean;
  public symbolConfirmacion:boolean;
  public strengthClassConfirmacion:string;

  public mayusOlder:boolean;
  public numberOlder:boolean;
  public symbolOlder:boolean;

  public eqpass:boolean;
  public eqpassword:any;
  public btnModalActPass:boolean;
  constructor(
    private passwordServ:ContrasenaServiceService,
    private sanitizer:DomSanitizer,
    private validator:ValidatorServService,
    private chargeJs:ServLandJSService,
    private encryptor:ServEncryptService,
    private translate:TranslateService,
    private routerr:Router) {
    chargeJs.cargaArchJs(["zxcvbn"]);
    this.contras = new passwordsAngularModelo('','','');
    this.imgFondo = '';
    this.mayusPrimera = true;
    this.numberPrimera = true;
    this.symbolPrimera = true;
    this.strengthClassPrimera = 'strengthPrimera password-strength';
    this.mayusConfirmacion = true;
    this.numberConfirmacion = true;
    this.symbolConfirmacion = true;
    this.strengthClassConfirmacion = 'strengthConfirmacion password-strength';
    this.eqpass = true;
    this.btnModalActPass = false;
    this.mayusOlder = false;
    this.numberOlder = false;
    this.symbolOlder = false;
  }

  ngOnInit(): void {
    this.imgFondo = this.passwordServ.getFondoPantalla();
  }

  pIgualesveirf(){
    var txtprimerCPassword = document.getElementById("primerCPassword");
    var txtsecondCPassword = document.getElementById("secondCPassword");
    var paaeqpassword:any = document.getElementById("eqpassword");
    if (this.contras.passPrimera != '' && this.contras.passSegunda != '') {
      if (this.contras.passPrimera == this.contras.passSegunda &&
        this.mayusPrimera == true && this.numberPrimera == true &&
        this.symbolPrimera == true && this.mayusConfirmacion == true &&
        this.numberConfirmacion == true && this.symbolConfirmacion == true) {
        this.eqpass = true;
        paaeqpassword.innerHTML = " &#xf058; Contraseñas iguales";
        this.btnModalActPass = true;
      } else {
        this.eqpass = false;
        paaeqpassword.innerHTML = " &#xf057; Contraseñas diferentes";
        this.btnModalActPass = false;
      }
    } else {
      if (this.contras.passPrimera == '') {
        this.validator.errorInput2(txtprimerCPassword,'&nbsp;&#xf023; Contraseña invalida');
      }
      if (this.contras.passSegunda == '') {
        this.validator.errorInput2(txtsecondCPassword,'&nbsp;&#xf023; Contraseña invalida');
      }
    }
  }

  keyupPrimerClave(event:any){
    if (event.value != '') {
      const pdwVal = event.value;
      let result:any = new zxcvbn(pdwVal);
      this.strengthClassPrimera = 'strengthPrimera password-strength strength-' + result.score;

      if (this.validator.filterPasswordMayus(event.value[0]) == true) {
        this.mayusPrimera = true;//correctobtn(mayusPrimera);
      } else {
        this.mayusPrimera = false;//correctobtn(mayusPrimera);
      }

      if (this.validator.filterPasswordNumber(event.value.trim()) == true) {
        this.numberPrimera = true;//correctobtn(numberPrimera);
      } else {
        this.numberPrimera = false;//correctobtn(numberPrimera);
      }

      if (this.validator.filterPasswordSymbol(event.value) == true) {
        this.symbolPrimera = true;//correctobtn(symbolPrimera);
      } else {
        this.symbolPrimera = false;//correctobtn(symbolPrimera);
      }

      if (this.mayusPrimera == true && this.numberPrimera == true && this.symbolPrimera == true) {
        if (this.validator.filterPassword(event.value) == true && event.value.length >= 8) {
          this.validator.correctoInput2(event,'&nbsp;&#xf023; Contraseña');
          this.contras.passPrimera = this.encryptor.santoEncryptPass(event.value);
          if (this.strengthClassPrimera == "strengthPrimera password-strength strength-3" ||
            this.strengthClassPrimera == "strengthPrimera password-strength strength-4") {
            console.log("bien");
            this.pIgualesveirf();
          }
        } else {
          this.contras.passPrimera = '';
          this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
        }
      } else {
        this.contras.passPrimera = '';
        this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
      }

    } else {
      this.contras.passPrimera = '';
      this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
      this.mayusPrimera = false;//errorbtn(mayusPrimera);
      this.numberPrimera = false;//errorbtn(numberPrimera);
      this.symbolPrimera = false;//errorbtn(symbolPrimera);
      const pdwVal = event.value;
      let result:any = new zxcvbn(pdwVal);
      this.strengthClassPrimera = 'strengthPrimera password-strength strength-' + result.score;
    }
  }

  keyupClaveConfirmacion(event:any){
    if (event.value != '') {
      const pdwVal = event.value;
      let result:any = new zxcvbn(pdwVal);
      this.strengthClassConfirmacion = 'strengthConfirmacion password-strength strength-' + result.score;

      if (this.validator.filterPasswordMayus(event.value[0]) == true) {
        this.mayusConfirmacion = true;//correctobtn(mayusConfirmacion);
      } else {
        this.mayusConfirmacion = false;//correctobtn(mayusPrimera);
      }

      if (this.validator.filterPasswordNumber(event.value.trim()) == true) {
        this.numberConfirmacion = true;//correctobtn(numberConfirmacion);
      } else {
        this.numberConfirmacion = false;//correctobtn(numberPrimera);
      }

      if (this.validator.filterPasswordSymbol(event.value) == true) {
        this.symbolConfirmacion = true;//correctobtn(symbolConfirmacion);
      } else {
        this.symbolConfirmacion = false;//correctobtn(symbolConfirmacion);
      }

      if (this.mayusConfirmacion == true && this.numberConfirmacion == true && this.symbolConfirmacion == true) {
        if (this.validator.filterPassword(event.value) == true && event.value.length >= 8) {
          this.validator.correctoInput2(event,'&nbsp;&#xf023; Contraseña');
          this.contras.passSegunda = this.encryptor.santoEncryptPass(event.value);
          if (this.strengthClassConfirmacion == "strengthConfirmacion password-strength strength-3" ||
            this.strengthClassConfirmacion == "strengthConfirmacion password-strength strength-4") {
            console.log("bien");
            this.pIgualesveirf();
          }
        } else {
          this.contras.passSegunda = '';
          this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
        }
      } else {
        this.contras.passSegunda = '';
        this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
      }

    } else {
      this.contras.passSegunda = '';
      this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
      this.mayusConfirmacion = false;//errorbtn(mayusPrimera);
      this.numberConfirmacion = false;//errorbtn(numberPrimera);
      this.symbolConfirmacion = false;//errorbtn(symbolPrimera);
      const pdwVal = event.value;
      let result:any = new zxcvbn(pdwVal);
      this.strengthClassConfirmacion = 'strengthConfirmacion password-strength strength-' + result.score;
    }
  }

  keyupClaveOlder(event:any){
    if (event.value != '') {

      if (this.validator.filterPasswordMayus(event.value[0]) == true) {
        this.mayusOlder = true;//correctobtn(mayusConfirmacion);
      } else {
        this.mayusOlder = false;//correctobtn(mayusPrimera);
      }

      if (this.validator.filterPasswordNumber(event.value.trim()) == true) {
        this.numberOlder = true;//correctobtn(numberConfirmacion);
      } else {
        this.numberOlder = false;//correctobtn(numberPrimera);
      }

      if (this.validator.filterPasswordSymbol(event.value) == true) {
        this.symbolOlder = true;//correctobtn(symbolConfirmacion);
      } else {
        this.symbolOlder = false;//correctobtn(symbolConfirmacion);
      }

      if (this.mayusOlder == true && this.numberOlder == true && this.symbolOlder == true) {
        if (this.validator.filterPassword(event.value) == true && event.value.length >= 8) {
          this.validator.correctoInput2(event,'&nbsp;&#xf023; Contraseña');
          this.contras.passOlder = this.encryptor.santoEncryptPass(event.value);
        } else {
          this.contras.passOlder = '';
          this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
        }
      } else {
        this.contras.passOlder = '';
        this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
      }

    } else {
      this.contras.passOlder = '';
      this.validator.errorInput2(event,'&nbsp;&#xf023; Contraseña invalida');
      this.mayusOlder = false;//errorbtn(mayusPrimera);
      this.numberOlder = false;//errorbtn(numberPrimera);
      this.symbolOlder = false;//errorbtn(symbolPrimera);
    }
  }

  actualizaPassword(event:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea guardar esta contraseña?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.passwordServ.sendPasswordSSIC(this.contras.passPrimera,this.contras.passSegunda,this.contras.passOlder).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              var enrutador = this.routerr;
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })

              var enrutador = this.routerr;
              localStorage.setItem('module_working',response.modulo_code);
              localStorage.setItem('settings_privilegio_crear',response.settings_privilegio_crear);
              localStorage.setItem('settings_privilegio_editar',response.settings_privilegio_editar);
              localStorage.setItem('settings_privilegio_consulta',response.settings_privilegio_consulta);
              localStorage.setItem('settings_privilegio_elimina',response.settings_privilegio_elimina);
              localStorage.setItem('settings_privilegio_ver_docs',response.settings_privilegio_ver_docs);
              localStorage.setItem('last_actividad',""+Math.floor(new Date().getTime()/1000.0));
              localStorage.setItem('user_code',response.large_token_access);//tokenUsuario
              localStorage.setItem('user_info',JSON.stringify(response.dataUsers));//identificaUsuario
              localStorage.setItem('system_lenguaje',response.lenguaje);
              localStorage.setItem('type_process_module',response.validate_process);
              
              //persistir datos del usuario
              sessionStorage.setItem('inside_session_code',response.large_token_access);//tokenUsuario
              enrutador.navigate([response.modulo_destino]);
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
          error=> {
            console.log(error);
          }
        );
      }
    });
  }
}
