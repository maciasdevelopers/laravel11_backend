import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';
import { DispositivosServService } from '../../../../../../servicios/ssic/dispositivos-serv.service';
import { dispositivosAngularModelo } from '../../../../../../modelos/dispositivosAngularModelo';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';


@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './tes_listadevices.component.html',
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
    '../../../../../../styles/colores.css',
    '../../../../../../styles/navegador.css',
    '../../../finanzas.css',
    './tes_listadevices.component.css']
})
export class ListaDevicesTesoreriaComponent implements OnInit {
  public usuario:Usuarios;
  public dispositiv:dispositivosAngularModelo;
  arrayListaDispositivo:any = [];

  arrayDetListDispositivo:any = [];
  dispositivo_seleccionado:string = "";
  arrayTipoDips:any = [];
  arrayCajaMonedero:any = [];
  listaCuentasBancarias:any = [];
  arrayMonederoElectro:any = [];
  arrayPersonal:any = [];
  arrayListaDelDispositivo:any = [];

  constructor(
    private dispositivo:DispositivosServService,
    private validator:ValidatorServService,
    private cajaServ:CajaServService,
    private cuentaBan:CuentbancService,
    private responsable:EmpleadosService,
    private monedero:MonederoElectService,
    private relInterna:ComunicacionInternaService,
    private encryptor:ServEncryptService,
    private translate:TranslateService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.dispositiv = new dispositivosAngularModelo('','','','','','','','');
  }

  ngOnInit(): void {
    this.listaDispositivosTRUE();
    this.listarDispositivosEliminados();
    this.getTiposDispositivo();
    this.getrCajasMonedero();
    this.getCuentasMonedero();
    this.getMonederosElectronicos();
    this.getResponsablesMonedero();
    this. getRespuestaRegistro();
  }

  getRespuestaRegistro(){
    this.relInterna.mensajeInsertDEVICE$.subscribe(
      (mensaje:any) => {
        mensaje == "registro aprobado" ? this.listaDispositivosTRUE() : null;
      }
    );
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
          this.arrayMonederoElectro = response.monedero;
          console.log(response);
          this.arrayMonederoElectro.forEach((row:any) => {
            var cuuentaCifrado = this.encryptor.esclavo_strong(row.cuenta);
            console.log(cuuentaCifrado);
            //this.arrayCuentBanc[i]['cuenta_frontend'] = cuuentaCifrado.replace(cuuentaCifrado.substring(cuuentaCifrado.length-4,0),'**** **** **** ');
          });
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
  listaDispositivosTRUE(){
    this.dispositivo.verListaDispositivos().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.arrayListaDispositivo = response.dispositivo;
          //console.log(this.arrayListaDispositivo);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  listarDispositivosEliminados(){
    this.dispositivo.verListaDeleteDispositivo().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayListaDelDispositivo = response.dispositivo;
          //console.log(this.arrayListaDelDispositivo);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  functViewDispositivo(token_dispositivos:any){
    this.dispositivo.detalleDispositivo(token_dispositivos).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayDetListDispositivo = response.dispositivo;
          this.dispositivo_seleccionado = token_dispositivos;
          console.log(response.dispositivo);
          this.arrayDetListDispositivo.forEach((row:any) => {            
            this.dispositiv.tipo_dispositivo = row.tipo_dispositivo;
            this.dispositiv.alias_dispositivo = row.alias;
            this.dispositiv.serie = row.serie;
            this.dispositiv.vigencia = row.vigencia;
            this.dispositiv.token_responsable = row.tokenResponsDispositivo;
            this.dispositiv.token_caja = row.caja_token;
            this.dispositiv.token_cuentaBanc = row.cuenta_bank_token;
            this.dispositiv.token_monElect = row.monedero_token;
          });
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  validaTipoDisp(event:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    const type_disp = this.arrayTipoDips.find((row:any) => row.token_tipo_disp === event.value);
    this.dispositiv.tipo_dispositivo = type_disp.token_tipo_disp;
    const validacion = event.value != "" && typeof disp !== 'undefined' && typeof type_disp !== 'undefined' && this.dispositiv.tipo_dispositivo != disp.tipo_dispositivo;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  validaAliasDisp(event:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    this.dispositiv.alias_dispositivo = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof disp !== 'undefined' && this.dispositiv.alias_dispositivo != disp.alias;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  validaSerie(event:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    this.dispositiv.serie = event.value;
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true && typeof disp !== 'undefined' && this.dispositiv.serie != disp.serie;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  validaVigencia(event:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    this.dispositiv.vigencia = event.value;
    const validacion = event.value != '' && this.validator.filtroFechaMesAño(event.value) == true && typeof disp !== 'undefined' && this.dispositiv.vigencia != disp.vigencia;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dispositiv);
  }

  selectCajaDisp(token_caja:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    const caja = this.arrayCajaMonedero.find((row:any) => row.token_caja === token_caja);
    this.dispositiv.token_caja = caja.token_caja;
    const validacion = token_caja != "" && typeof caja !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_caja != disp.caja_token;
    console.log(this.dispositiv);
  }

  selectCuentaDisp(token_cuenta:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    const cuent = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === token_cuenta);
    this.dispositiv.token_cuentaBanc = cuent.token_cuenta;
    const validacion = token_cuenta != "" && typeof cuent !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_cuentaBanc != disp.cuenta_bank_token;
    console.log(this.dispositiv);
  }

  selectMonederoDisp(token_cuentaMon:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    const mon = this.arrayMonederoElectro.find((row:any) => row.token_cuentaMon === token_cuentaMon);
    this.dispositiv.token_monElect = mon.token_cuentaMon;
    const validacion = token_cuentaMon != "" && typeof mon !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_monElect != disp.monedero_token;
    console.log(this.dispositiv);
  }

  selectResponsDisp(token_empleado_vhum:any){
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);
    const pers = this.arrayPersonal.find((row:any) => row.token_empleado_vhum === token_empleado_vhum);
    this.dispositiv.token_responsable = pers.token_empleado_vhum;
    const validacion = token_empleado_vhum != "" && typeof pers !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_responsable != disp.tokenResponsDispositivo;
    console.log(this.dispositiv);
  }

  get validaDispRegistro():boolean{
    const disp = this.arrayDetListDispositivo.find((row:any) => row.token_dispositivos === this.dispositivo_seleccionado);

    const type_disp = this.arrayTipoDips.find((row:any) => row.token_tipo_disp === this.dispositiv.tipo_dispositivo);
    const validacionTipoDisp = this.dispositiv.tipo_dispositivo != "" && typeof disp !== 'undefined' && typeof type_disp !== 'undefined' && this.dispositiv.tipo_dispositivo != disp.tipo_dispositivo;

    const validacionAliasDisp = this.dispositiv.alias_dispositivo != '' && this.validator.filtroAlfaNumerico(this.dispositiv.alias_dispositivo) == true && typeof disp !== 'undefined' && this.dispositiv.alias_dispositivo != disp.alias;
    const validacionSerie = this.dispositiv.serie != '' && this.validator.filtroCuenta(this.dispositiv.serie) == true && typeof disp !== 'undefined' && this.dispositiv.serie != disp.serie; 
    const validacionVigencia = this.dispositiv.vigencia != '' && this.validator.filtroFechaMesAño(this.dispositiv.vigencia) == true && typeof disp !== 'undefined' && this.dispositiv.vigencia != disp.vigencia; 

    const caja = this.arrayCajaMonedero.find((row:any) => row.token_caja === this.dispositiv.token_caja);
    const validacion_caj = this.dispositiv.token_caja != '' && typeof caja !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_caja != disp.caja_token;

    const cuent = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === this.dispositiv.token_cuentaBanc);
    const validacion_cuent = this.dispositiv.token_cuentaBanc != '' && typeof cuent !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_cuentaBanc != disp.cuenta_bank_token;

    const mon = this.arrayMonederoElectro.find((row:any) => row.token_cuentaMon === this.dispositiv.token_monElect);
    const validacion_mon = this.dispositiv.token_monElect != '' && typeof mon !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_monElect != disp.monedero_token;
    
    const pers = this.arrayPersonal.find((row:any) => row.token_empleado_vhum === this.dispositiv.token_responsable);
    const validacion_empleado = this.dispositiv.token_responsable != "" && typeof pers !== 'undefined' && typeof disp !== 'undefined' && this.dispositiv.token_responsable != disp.tokenResponsDispositivo;

    return validacionTipoDisp || validacionAliasDisp || validacionSerie || validacionVigencia || validacion_caj || validacion_cuent || validacion_mon || validacion_empleado;
  }

  actualizaDispositivo(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar este dispositivo?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.dispositivo.actualizaDispositivo(
          this.dispositivo_seleccionado,
          this.dispositiv.tipo_dispositivo,
          this.dispositiv.alias_dispositivo,
          this.dispositiv.serie,
          this.dispositiv.vigencia,
          this.dispositiv.token_responsable,
          this.dispositiv.token_caja,
          this.dispositiv.token_cuentaBanc,
          this.dispositiv.token_monElect
        ).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
              this.functViewDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos']);
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

  functDelDispositivo(token_dispositivos:any){
    alert("funciona");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este dispositivo?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, aliminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {

        /*this.dispositivo.deleteDispositivo(token_dispositivos).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.recargaListaDispositivo();
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
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
          error =>{
            console.log(error);
          }
        );*/
      }
    });
  }

  restauraDispositivo(token_dispositivos:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar este dispositivo?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {

        this.dispositivo.restaurarDispositivo(token_dispositivos).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.listaDispositivosTRUE();
              this.listarDispositivosEliminados();
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })

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
          error =>{
            console.log(error);
          }
        );
      }
    });
  }

  eliminapermDispositivo(token_dispositivos:any){
    alert("funciona");
     Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar permanentemente este dispositivo?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, aliminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {

        this.dispositivo.deletePermDispositivo(token_dispositivos).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.listaDispositivosTRUE();
              this.listarDispositivosEliminados();
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })

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
          error =>{
            console.log(error);
          }
        );
      }
    });
  }
}
