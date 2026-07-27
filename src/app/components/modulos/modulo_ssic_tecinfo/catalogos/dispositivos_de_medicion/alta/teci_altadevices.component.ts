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

@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './teci_altadevices.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
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
    '../../../../../../styles/paginador.css',
    '../../../tec_info.css',
    './teci_altadevices.component.css',
  ]
})
export class TECIAltaDeviceComponent implements OnInit {
  public usuario:Usuarios;
  public dispositiv:dispositivosAngularModelo;

  arrayTipoDips:any = [];
  arrayCajaMonedero:any = [];
  arrayCuentaMonedero:any = [];
  arrayMonederoElectro:any = [];
  arrayPersonal:any = [];

  constructor(
    private cuentaBan:CuentbancService,
    private cajaServ:CajaServService,
    private responsable:EmpleadosService,
    private monedero:MonederoElectService,
    private dispositivo:DispositivosServService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.dispositiv = new dispositivosAngularModelo('','','','','','','','');
  }

  ngOnInit(): void {
    

    this.dispositivo.listaTipoDispositivo().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayTipoDips = response.dispositivo;
          
          //console.log(this.arrayTipoDips);
        }
      },
      error =>{
        console.log(error);
      }
    )

    this.cajaServ.verListaCajas('all_partidas','','').subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayCajaMonedero = response.caja;
        }
      },
      error =>{
        console.log(error);
      }
    )

    this.cuentaBan.catCuentasBancariasMain('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayCuentaMonedero = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    )

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

    this.responsable.listaResponsablesMonedero().subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayPersonal = response.personal;
          
          //console.log(this.arrayPersonal);
        }
      },
      error => {
        console.log(error);
      }
    )

  }

  validaTipoDisp(event:any,modelDtCuenta:any){
    if (event.value != '') {
      modelDtCuenta.tipo_dispositivo = event.value;
      console.log(this.dispositiv);
    }
  }

  validaAliasDisp(event:any,modelDtCuenta:any){
    if (event.value == '' || !this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.errorInput(event,"Alias invalido");
    } else {
      this.validator.correctoInput(event,"Alias");
      modelDtCuenta.alias_dispositivo = event.value;
      console.log(this.dispositiv);
    }
  }

  validaSerie(event:any,modelDtCuenta:any){
    if (event.value == '' || !this.validator.filtroCuenta(event.value) == true) {
      this.validator.errorInput(event,"No. serie invalido");
    } else {
      this.validator.correctoInput(event,"No. serie");
      modelDtCuenta.serie = event.value;
      console.log(this.dispositiv);
    }
  }

  validaVigencia(event:any,modelDtCuenta:any){
    if (event.value != '') {
      modelDtCuenta.vigencia = event.value;
      console.log(modelDtCuenta);
    }
  }

  selectCajaDisp(event:any,modelo:any){
    if(event.value !=''){
      modelo.token_caja = event.value;
    }
    console.log(this.dispositiv);
  }

  selectCuentaDisp(event:any,modelo:any){
    if(event.value !=''){
      modelo.token_cuentaBanc = event.value;
    }
    console.log(this.dispositiv);
  }

  selectMonederoDisp(event:any,modelo:any){
    if(event.value !=''){
      modelo.token_monElect = event.value;
    }
    console.log(this.dispositiv);
  }

  selectResponsDisp(event:any,modelo:any){
    if(event.value !=''){
      modelo.token_responsable = event.value;
    }
    console.log(this.dispositiv);
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
        this.dispositivo.registraDispositivo(this.dispositiv).subscribe(
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
              form.reset();
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
