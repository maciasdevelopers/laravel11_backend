import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';
import { DispositivosServService } from '../../../../../../servicios/ssic/dispositivos-serv.service';
import { dispositivosAngularModelo } from '../../../../../../modelos/dispositivosAngularModelo';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScannerState} from 'html5-qrcode';
import { global } from '../../../../../../servicios/global_ssic';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './teci_listadevices.component.html',
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
    './teci_listadevices.component.css',]
})
export class TECIListaDeviceComponent implements OnInit {
  searchDisp:any;
  pageDisp: number = 1;

  searchDeletedDisp:any;
  pageDeletedDisp: number = 1;

  public usuario:Usuarios;
  public dispositiv:dispositivosAngularModelo;
  public perfDispositiv:dispositivosAngularModelo;

  arrayListaDispositivo:any = [];
  arrayDetListDispositivo:any = [];

  arrayListaDelDispositivo:any = [];

  constructor(
    private dispositivo:DispositivosServService,
    private validator:ValidatorServService,
    private translate:TranslateService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.dispositiv = new dispositivosAngularModelo('','','','','','','','');
    this.perfDispositiv = new dispositivosAngularModelo('','','','','','','','');
  }

  ngOnInit(): void {
    

    this.dispositivo.verListaDispositivos().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayListaDispositivo = response.dispositivo;
          //console.log(this.arrayListaDispositivo);
        }
      },
      error =>{
        console.log(error);
      }
    )

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
    )

  }

  recargaListaDispositivo(){
    this.dispositivo.verListaDispositivos().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayListaDispositivo = response.dispositivo;
          //console.log(this.arrayListaDispositivo);
        }
      },
      error =>{
        console.log(error);
      }
    )

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
    )
  }

  clickEscannerrqdevice(){//readerSitFiscalProv
    $("#readerrqDispositivo").removeClass("noneView");
    var cameraId:any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config:any = {fps:10,qrbox: { width: 250, height: 250 }};
    let codeQrstdivice:any = new Html5QrcodeScanner("camerarqDispositivo",config,false);
    codeQrstdivice.render(this.scanYesDevice,this.onScanError);
  }

  scanYesDevice(decodedText:any, decodedResult:any) {
    console.log(`Scan result: ${decodedText}`, decodedResult);
    global.imagenUrlQrDispositivoTes = decodedText;
    Swal.fire({
      position:'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton:false,
      timer: 3000
    })
  }
  onScanError(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}


  getDispositivoQr(){
    if (global.imagenUrlQrDispositivoTes != '') {
      //$("#modalViewDisp").modal();
      this.functViewDispositivo(global.imagenUrlQrDispositivoTes);
      const readerQr = new Html5Qrcode("camerarqDispositivo");
      readerQr.stop();
    }
  }

  functViewDispositivo(token_dispositivos:any){
    this.dispositivo.detalleDispositivo(token_dispositivos).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          //$("#modalViewDisp").modal();
          $(document).ready(function() {
            //$('#modalViewDisp').modal();
          });
          
          this.arrayDetListDispositivo = response.dispositivo;
          console.log(response.dispositivo);
          this.perfDispositiv.tipo_dispositivo = response.dispositivo[0]['tipo_dispositivo'];
          this.perfDispositiv.alias_dispositivo = response.dispositivo[0]['alias'];
          this.perfDispositiv.serie = response.dispositivo[0]['serie'];
          this.perfDispositiv.vigencia = response.dispositivo[0]['vigencia'];
          this.perfDispositiv.token_responsable = response.dispositivo[0]['tokenResponsDispositivo'];
          if (response.dispositivo[0]['cuenta'].length != 0) {
            for (let index = 0; index < response.dispositivo[0]['cuenta'].length; index++) {
              const cuenta = response.dispositivo[0]['cuenta'][index];
              if (cuenta['relStatus'] == true) {
                this.dispositiv.token_cuentaBanc = cuenta['token_cuenta'];
              }
            }
          }
          if (response.dispositivo[0]['caja'].length != 0) {
            for (let index = 0; index < response.dispositivo[0]['caja'].length; index++) {
              const caja = response.dispositivo[0]['caja'][index];
              if (caja['relStatus'] == true) {
                this.dispositiv.token_caja = caja['token_caja'];
              }
            }
          }
          if (response.dispositivo[0]['monedero'].length != 0) {
            for (let index = 0; index < response.dispositivo[0]['monedero'].length; index++) {
              const monedero = response.dispositivo[0]['monedero'][index];
              if (monedero['relStatus'] == true) {
                this.dispositiv.token_monElect = monedero['token_cuentamonedero'];
              }
            }
          }
          
        }
      },
      error =>{
        console.log(error);
      }
    );
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

  selectResponsDisp(event:any,modelo:any){
    if(event.value !=''){
      modelo.token_responsable = event.value;
    }
    console.log(this.dispositiv);
  }

  actualizaDispositivo():void{
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
        /*this.dispositivo.actualizaDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos'],this.perfDispositiv.tipo_dispositivo,
        this.perfDispositiv.alias_dispositivo,this.perfDispositiv.serie,this.perfDispositiv.vigencia,this.perfDispositiv.token_responsable).subscribe(
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
        )*/
      }
    });
  }

  unvincCajaDisp(event:any){
    if(event.value != ''){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea desvincular su dispositivo a esta caja?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.dispositivo.unvinccajaDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos'],event.value).subscribe(
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
        } else {
          $(event).removeAttr("checked");
        }
      });
    } else {
      Swal.fire({
        position:'top-end',
        icon: 'warning',
        title: 'la caja que ha seleccionado contiene informacion invalida o nula',
        showConfirmButton:false,
        timer: 3000
      })
    }
  }

  actualizaCajaDisp(event:any){
    if(event.value != ''){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea vincular su dispositivo a esta caja?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.dispositivo.actualizacajaDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos'],event.value).subscribe(
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
        } else {
          $(event).removeAttr("checked");
        }
      });
    } else {
      Swal.fire({
        position:'top-end',
        icon: 'warning',
        title: 'la caja que ha seleccionado contiene informacion invalida o nula',
        showConfirmButton:false,
        timer: 3000
      })
    }
  }

  unvincCuentaBankDisp(event:any){
    if(event.value != ''){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea desvincular su dispositivo a esta cuenta bancaria?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.dispositivo.unvincCuentaBankDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos'],event.value).subscribe(
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
        } else {
          $(event).removeAttr("checked");
        }
      });
    } else {
      Swal.fire({
        position:'top-end',
        icon: 'warning',
        title: 'la cuenta bancaria que ha seleccionado contiene informacion invalida o nula',
        showConfirmButton:false,
        timer: 3000
      })
    }
  }

  actualizaCuentaBankDisp(event:any){
    if(event.value != ''){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea vincular su dispositivo a esta cuenta bancaria?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.dispositivo.actualizacuentaBankDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos'],event.value).subscribe(
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
        } else {
          $(event).removeAttr("checked");
        }
      });
    } else {
      Swal.fire({
        position:'top-end',
        icon: 'warning',
        title: 'la cuenta bancaria que ha seleccionado contiene informacion invalida o nula',
        showConfirmButton:false,
        timer: 3000
      })
    }
  }

  univincCuentaMonederoDisp(event:any){
    if(event.value != ''){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea vincular su dispositivo a esta cuenta de monedero electrónico?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.dispositivo.unvinccuentaMonDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos'],event.value).subscribe(
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
        } else {
          $(event).removeAttr("checked");
        }
      });
    } else {
      Swal.fire({
        position:'top-end',
        icon: 'warning',
        title: 'la cuenta de monedero electrónico que ha seleccionado contiene informacion invalida o nula',
        showConfirmButton:false,
        timer: 3000
      })
    }
  }

  actualizaCuentaMonederoDisp(event:any){
    if(event.value != ''){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea vincular su dispositivo a esta cuenta de monedero electrónico?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.dispositivo.actualizacuentaMonDispositivo(this.arrayDetListDispositivo[0]['token_dispositivos'],event.value).subscribe(
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
        } else {
          $(event).removeAttr("checked");
        }
      });
    } else {
      Swal.fire({
        position:'top-end',
        icon: 'warning',
        title: 'la cuenta de monedero electrónico que ha seleccionado contiene informacion invalida o nula',
        showConfirmButton:false,
        timer: 3000
      })
    }
  }

  functDelDispositivo(token_dispositivo:any){
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
        this.dispositivo.deleteDispositivo(token_dispositivo).subscribe(
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
        );
      }
    });
  }

  restauraDispositivo(event:any){
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

        /*this.dispositivo.restaurarDispositivo().subscribe(
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

  eliminapermDispositivo(event:any){
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

        /*this.dispositivo.deletePermDispositivo().subscribe(
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

}
