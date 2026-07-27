import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { DispositivosServService } from '../../../../../../servicios/ssic/dispositivos-serv.service';
import { dispositivosAngularModelo } from '../../../../../../modelos/dispositivosAngularModelo';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'app-nuevo-dispositivo-finanzas',
  templateUrl: './tes_altadevices.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/file_input.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/landing.css',
    '../../../finanzas.css',
    './tes_altadevices.component.css']
})
export class AltaDevicesTesoreriaComponent implements OnInit {
  public usuario:Usuarios;
  public dispositiv:dispositivosAngularModelo;

  arrayTipoDips:any = [];
  arrayCajaMonedero:any = [];
  listaCuentasBancarias:any = [];
  arrayMonederoElectro:any = [];
  arrayPersonal:any = [];
  viewFormulario:boolean = true;

  constructor(
    private cuentaBan:CuentbancService,
    private cajaServ:CajaServService,
    private responsable:EmpleadosService,
    private monedero:MonederoElectService,
    private dispositivo:DispositivosServService,
    private validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private translate:TranslateService,
    private encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.dispositiv = new dispositivosAngularModelo('','','','','','','','');
  }

  ngOnInit(): void {
    this.getTiposDispositivo();
    this.getrCajasMonedero();
    this.getCuentasMonedero();
    this.getMonederosElectronicos();
    this.getResponsablesMonedero();
  }

  getTiposDispositivo(){
    this.dispositivo.listaTipoDispositivo().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayTipoDips = response.dispositivo;
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  getrCajasMonedero(){
    this.cajaServ.verListaCajas('all_partidas','','').subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.arrayCajaMonedero = response.caja;
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  getCuentasMonedero(){
    this.cuentaBan.catCuentasBancariasMain('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.listaCuentasBancarias = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  functCuentaNumber(token_cuenta:any){
    let account = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === token_cuenta);
    account.cuenta_view = account.cuenta_view ? false : true;
    var intervalo:any = null;
    if (account.cuenta_view) {
      this.cuentaBan.verCuentaBancariaCompleta(token_cuenta).subscribe(
        response => {
          if (response.status == 'success') {
            account.cuenta_bancaria = response.cuenta_bancaria;
            account.cuenta_time = 30;
            intervalo = setInterval(() => {
              account.cuenta_time = account.cuenta_time - 1;
              if (account.cuenta_time == 0 || !account.cuenta_view) {
                account.cuenta_view = false;
                account.cuenta_time = 0;
                clearInterval(intervalo);
                this.cuentaBan.verCuentaBancaria4Digitos(token_cuenta).subscribe(
                  response => {
                    if (response.status == 'success') {
                      account.cuenta_bancaria = response.cuenta_bancaria;
                    }
                  },
                  error =>{
                    console.log(error);
                  }
                );
              }
            },1000);
          }
        },
        error =>{
          console.log(error);
        }
      );
    } else {
      this.cuentaBan.verCuentaBancaria4Digitos(token_cuenta).subscribe(
        response => {
          if (response.status == 'success') {
            account.cuenta_bancaria = response.cuenta_bancaria;
          }
        },
        error =>{
          console.log(error);
        }
      );
      return;
    }
  }

  getMonederosElectronicos(){
    this.monedero.catalogoMonederosElect('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayMonederoElectro = response.mondero;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  getResponsablesMonedero(){
    this.responsable.catalogoGeneralTrabajadores().subscribe(
      response =>{
        if (response.status == 'success') {
          console.log(response);
          this.arrayPersonal = response.empleados;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  validaTipoDisp(event:any){
    const dips = this.arrayTipoDips.find((row:any) => row.token_tipo_disp === event.value);
    const validacion = event.value != "" && typeof dips !== 'undefined';
    this.dispositiv.tipo_dispositivo = validacion  ? dips.token_tipo_disp : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  validaAliasDisp(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.dispositiv.alias_dispositivo = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  validaSerie(event:any){
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true; 
    this.dispositiv.serie = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  validaVigencia(event:any){
    const validacion = event.value != '' && this.validator.filtroFechaMesAño(event.value) == true; 
    this.dispositiv.vigencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  selectCajaDisp(token_caja:any){
    const cuent = this.arrayCajaMonedero.find((row:any) => row.token_caja === token_caja);
    const validacion = token_caja != "" && typeof cuent !== 'undefined';
    this.dispositiv.token_caja = validacion ? cuent.token_caja : '';
    console.log(this.dispositiv);
  }

  selectCuentaDisp(token_cuenta:any){
    const cuent = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === token_cuenta);
    const validacion = token_cuenta != "" && typeof cuent !== 'undefined';
    this.dispositiv.token_cuentaBanc = validacion ? cuent.token_cuenta : '';
    console.log(this.dispositiv);
  }

  selectMonederoDisp(token_cuentaMon:any){
    const cuent = this.arrayMonederoElectro.find((row:any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = token_cuentaMon != "" && typeof cuent !== 'undefined';
    this.dispositiv.token_monElect = validacion ? cuent.token_cuentaMon : '';
    console.log(this.dispositiv);
  }

  selectResponsDisp(token_empleado_vhum:any){
    const pers = this.arrayPersonal.find((row:any) => row.token_empleado_vhum === token_empleado_vhum);
    const validacion = token_empleado_vhum != "" && typeof pers !== 'undefined';
    this.dispositiv.token_responsable = validacion ? pers.token_empleado_vhum : '';
    console.log(this.dispositiv);
  }

  get validaDispRegistro():boolean{
    const validacionTipoDisp = this.dispositiv.tipo_dispositivo != "";
    const validacionAliasDisp = this.dispositiv.alias_dispositivo != '' && this.validator.filtroAlfaNumerico(this.dispositiv.alias_dispositivo) == true;
    const validacionSerie = this.dispositiv.serie != '' && this.validator.filtroCuenta(this.dispositiv.serie) == true; 
    const validacionVigencia = this.dispositiv.vigencia != '' && this.validator.filtroFechaMesAño(this.dispositiv.vigencia) == true; 
    const validacion_caj_cuent_mon = this.dispositiv.token_caja != '' || this.dispositiv.token_cuentaBanc != '' || this.dispositiv.token_monElect != '';

    return validacionTipoDisp && validacionAliasDisp && validacionSerie && validacionVigencia && validacion_caj_cuent_mon && this.dispositiv.token_responsable != '';
  }

  regDispositivo(form:{reset:() => void;}):void{
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar este dispositivo?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.viewFormulario = false;
        this.dispositivo.registraDispositivo(this.dispositiv).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.viewFormulario = true;
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
              form.reset();
              this.dispositiv = new dispositivosAngularModelo('','','','','','','','');
              this.relInterna.mensajeDEVICEInsert("registro aprobado");
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
        )
      }
    });
  }

}
