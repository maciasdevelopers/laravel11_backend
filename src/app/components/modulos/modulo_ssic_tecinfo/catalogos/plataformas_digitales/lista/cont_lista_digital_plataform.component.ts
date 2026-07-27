import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { InterfMonedas } from '../../../../../../interfaces/interf-monedas';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { monderoElectAngularModelo } from '../../../../../../modelos/monderoElectAngularModelo';
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScannerState} from "html5-qrcode";
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { global } from '../../../../../../servicios/global_ssic';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './cont_lista_digital_plataform.component.html',
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
    './cont_lista_digital_plataform.component.css']
})
export class ContListaDigitalPlataformComponent implements OnInit {
  public usuario:Usuarios;
  public perfMonElect:monderoElectAngularModelo;
  public validateQRcodeMonedero:boolean;
  pageMonederoVig:number = 1;
  pageMonederoDel:number = 1;
  arrayMonederoElectro:any = [];
  arrayDetListMonedero:any = [];
  arrayMonedas: InterfMonedas[] = [];
  public txtMonedaMonedero:string;
  public manDetMonedero:string;
  public reffDetManejoMon:string;
  public manNewMonedero:string;
  public refNewManejoMon:string;
  public responsNewMonedero:string;
  arrayPersonal:any = [];
  arrayNewOptionesMon:any = [];

  @ViewChild('btnSaveDetMonedero') btnSaveDetMonedero: ElementRef = {} as ElementRef;

  arrayMonederoElectDel:any = [];

  constructor(
    private monedasServ:MonedasService,
    private renderer:Renderer2,
    private responsable:EmpleadosService,
    private monedero:MonederoElectService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.perfMonElect = new monderoElectAngularModelo('','','','','','','',false,false,false,[],'','','');;
    this.txtMonedaMonedero = 'bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4';
    this.validateQRcodeMonedero = false;
    this.manDetMonedero = '';
    this.reffDetManejoMon = '';
    this.manNewMonedero = '';
    this.refNewManejoMon = '';
    this.responsNewMonedero = '';
  }

  ngOnInit(): void {
    

    this.monedasServ.getMonedas().subscribe((data:InterfMonedas[]) => {
      this.arrayMonedas = data;
    })

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

    this.monedero.catalogoMonederosElectDelete().subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayMonederoElectDel = response.mondero;
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

  recargaListaMonedero(){
    this.monedero.catalogoMonederosElect('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayMonederoElectro = response.mondero;
        }
      },
      error => {
        console.log(error);
      }
    );

    this.monedero.catalogoMonederosElectDelete().subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayMonederoElectDel = response.mondero;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  functViewMonderoElectronico(event:any,token_cuentaMon:any){
    this.monedero.detalleMonederoElectronico(token_cuentaMon).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayDetListMonedero = response.mondero;
          
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  selectDetListMonElectro(event:any){
    if(event.value !=''){
      this.perfMonElect.plataforma_electronica = event.value;
      console.log(this.perfMonElect);
    }
  }

  validaDetFormMon(){
    /*if (this.perfMonElect.plataforma_electronica != '' || this.perfMonElect.no_referencia != '' || this.perfMonElect.cuenta != '' ||
        this.perfMonElect.clabe_inter != '' || this.perfMonElect.titularCuenta != '' ||
        (this.perfMonElect.areaEgresos == true || this.perfMonElect.areaIngresos == true || this.perfMonElect.areaValHumano == true) ||
        this.perfMonElect.opciones_adicionales != '' || this.perfMonElect.token_cuentaBanc != '' || this.perfMonElect.token_caja != '') {
      this.renderer.removeAttribute(this.btnSaveDetMonedero.nativeElement,"disabled");
    } else {
      this.renderer.setAttribute(this.btnSaveDetMonedero.nativeElement,"disabled","disabled");
    }*/
  }

  validaNoRef(event:any,modelDtCuenta:any){
    if (event.value == '' || !this.validator.filtroNum(event.value) == true) {
      this.validator.errorInput(event,"No. de referencia invalido");
    } else {
      this.validator.correctoInput(event,"No. de referencia");
      let validaReferencia = event.value;
      let referenciaCrifrad = this.encryptor.emperador(validaReferencia);
      modelDtCuenta.no_referencia = referenciaCrifrad;
      //console.log(modelDtCuenta.no_referencia+" "+validaReferencia);
    }
  }

  verContrato(event:any){
    var contrato = $(event).parent("div").find("input.txtPasssContrato");
    //alert(contrato.val());
    if (contrato.prop("type") == "password") {
        contrato.attr("type","text");
        event.innerHTML = '&#xf070;';
    } else {
        contrato.prop("type","password");
        event.innerHTML = '<i class="fa-solid fa-info"></i>';
    }
  }

  validaNoCuenta(event:any,modelDtCuenta:any){
    if (event.value == '' || !this.validator.filtroCuenta(event.value) == true) {
      this.validator.errorInput(event,"No. de cuenta invalido");
    } else {
      this.validator.correctoInput(event,"No. de cuenta");
      let validaCuenta = event.value;
      let cuentaCrifrad = this.encryptor.emperador(validaCuenta);
      modelDtCuenta.cuenta = cuentaCrifrad;
      //console.log(modelDtCuenta.cuenta);
    }
  }

  verCuenta(event:any){
    var cuenta = $(event).parent("div").find("input.txtPassCuenta");
    if (cuenta.prop("type") == "password") {
        cuenta.attr("type","text");
        event.innerHTML = '&#xf070;';
    } else {
        cuenta.prop("type","password");
        event.innerHTML = '<i class="fa-solid fa-info"></i>';
    }
  }

  validaClabeInter(event:any,modelDtCuenta:any){
    var inputSucursal = $(event).parent("div").parent("div").parent("div").find("input.txtSucursal");
    if (event.value == '' || !this.validator.filtroCuenta(event.value) == true) {
      this.validator.errorInput(event,"Clabe interbancaria invalida");
    } else {
      this.validator.correctoInput(event,"Clabe interbancaria");
      let validaClabeInt = event.value;
      inputSucursal.val(validaClabeInt.substring(3,6));

      let clabIntCrifrad = this.encryptor.emperador(validaClabeInt);
      modelDtCuenta.clabe_inter = clabIntCrifrad;

      let sucursalCrifrad = this.encryptor.emperador(inputSucursal.val());
      modelDtCuenta.sucursal = sucursalCrifrad;
      //console.log(modelDtCuenta.sucursal+" "+this.encryptor.esclavo(sucursalCrifrad));
    }
  }

  verClabeInter(event:any){
    var clabeInterbancaria = $(event).parent("div").find("input.txtPassClabeInter");
    if (clabeInterbancaria.prop("type") == "password") {
        //alert(clabeInterbancaria.prop("maxlength"));
        clabeInterbancaria.attr("type","text");
        event.innerHTML = '&#xf070;';
    } else {
        clabeInterbancaria.prop("type","password");
        event.innerHTML = '<i class="fa-solid fa-info"></i>';
    }
  }

  validaTitular(event:any,modelDtCuenta:any){
    if (event.value == '' || !this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.errorInput(event,"Titular de la cuenta invalido");
    } else {
      this.validator.correctoInput(event,"Titular de la cuenta");
      let validaTitular = event.value;
      let titularCrifrad = this.encryptor.emperador(validaTitular);
      modelDtCuenta.titularCuenta = titularCrifrad;
      //console.log(this.cuentaBanc);
    }
  }

  validaAreaEgresos(event:any,modelDtCuenta:any){
    //alert("funciona");
    if ($(event).prop('checked')) {
      modelDtCuenta.areaEgresos = true;
    } else {
      modelDtCuenta.areaEgresos = false;
    }
    //console.log(this.cuentaBanc);
  }

  validaAreaIngresos(event:any,modelDtCuenta:any){
    //alert("funciona");
    if ($(event).prop('checked')) {
      modelDtCuenta.areaIngresos = true;
    } else {
      modelDtCuenta.areaIngresos = false;
    }
    //console.log(this.cuentaBanc);
  }

  validaAreaVHumano(event:any,modelDtCuenta:any){
    //alert("funciona");
    if ($(event).prop('checked')) {
      modelDtCuenta.areaValHumano = true;
    } else {
      modelDtCuenta.areaValHumano = false;
    }
    //console.log(this.cuentaBanc);
  }

  selectMonedaMonedero(event:any){
    this.txtMonedaMonedero = event.value;
    console.log(this.txtMonedaMonedero);
  }

  selectDetManejoMonedero(event:any){
    if (event.value != '') {
      this.manDetMonedero = event.value;
    }
  }

  validaNoReferencia(event:any){
    if (event.value == '' || !this.validator.filtroCuenta(event.value) == true) {
      this.validator.errorInput(event,"No. de referencia invalido");
    } else {
      this.validator.correctoInput(event,"No. de referencia");
    }
  }

  refferencDetManejoMon(event:any){
    if (event.value != '') {
      this.reffDetManejoMon = event.value;
    }
  }

  selectNewManejoMon(event:any){
    if (event.value != '') {
      this.manNewMonedero = event.value;
    }
  }

  refferencNewManejoMon(event:any){
    if (event.value != '') {
      this.refNewManejoMon = event.value;
    }
  }

  selectNewResponsableMon(event:any){
    if (event.value != '') {
      this.responsNewMonedero = event.value;
    }
  }

  registraManejoCuenta(){
    //alert("funciona");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar este registro?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, agregar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.manNewMonedero != '' && this.refNewManejoMon != '' && this.responsNewMonedero != '') {
          this.arrayNewOptionesMon.push({"clave":this.manNewMonedero,"valor":this.refNewManejoMon,"responsable":this.responsNewMonedero});
          //console.log(this.arrayNewOptionesMon);
          this.monedero.registraManejoCuestas(this.arrayDetListMonedero[0]['token_cuentaMon'],this.arrayNewOptionesMon).subscribe(
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
      }
    });
  }

  selectNewListCuenta(event:any){
    if(event.value !=''){
      this.perfMonElect.token_cuentaBanc = event.value;
    }
    console.log(this.perfMonElect);
  }

  selectNewListaCaja(event:any){
    if(event.value !=''){
      this.perfMonElect.token_caja = event.value;
    }
    console.log(this.perfMonElect);
  }

  updateMonederoElectronico(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea guardar este monedero electrónico?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        /*this.monedero.updateMonederoElectronico(this.perfMonElect,this.arrayDetListMonedero[0]['token_cuentaMon'],[],[]).subscribe(
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
        );*/
        Swal.fire(
          'Guardado!',
          'Esta cuenta bancaria se ha guardado correctamente',
          'success'
        )
      }
    });
  }

  functDeleteMnderoElctronico(event:any,token_cuentaMon:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este monedero electrónico?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, aliminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.monedero.deleteMonedero(token_cuentaMon).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.recargaListaMonedero();
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

  functRestauraMonedElectronico(event:any,token_cuentaMon:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar este monedero electrónico?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.monedero.restauraMonedero(token_cuentaMon).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.recargaListaMonedero();
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

  functDeletPermMndroElectronico(event:any,token_cuentaMon:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea eliminar permanentemente este monedero electrónico?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: 'Sí, aliminar',
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.monedero.deletePermMonedero(token_cuentaMon).subscribe(
            response => {
              console.log(response.status);
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.recargaListaMonedero();
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
