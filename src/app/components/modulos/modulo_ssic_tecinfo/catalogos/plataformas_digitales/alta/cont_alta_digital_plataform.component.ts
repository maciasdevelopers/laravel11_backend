import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { InterfMonedas } from '../../../../../../interfaces/interf-monedas';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { monderoElectAngularModelo } from '../../../../../../modelos/monderoElectAngularModelo';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './cont_alta_digital_plataform.component.html',
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
    './cont_alta_digital_plataform.component.css']
})
export class ContAltaDigitalPlataformComponent implements OnInit {
  public usuario:Usuarios;
  public monderoElect:monderoElectAngularModelo;

  arrayListMonederos:any = [];
  public txtMonedaMonedero:string;
  arrayMonedas: InterfMonedas[] = [];
  public manejoMonedero:string;
  public referensManejoMonedero:string;
  arrayPersonal:any = [];
  public tokenResponsMon:string;
  public responsMonedero:string;
  arrayOptionAddMon:any = [];
  arrayCuentaMonedero:any = [];
  arrayCajaMonedero:any = [];

  @ViewChild('btnGuardarMonedero') btnGuardarMonedero: ElementRef = {} as ElementRef;
  @ViewChild('btnAddMnjMon') btnAddMnjMon: ElementRef = {} as ElementRef;

  constructor(
    private monedasServ:MonedasService,
    private renderer:Renderer2,
    private cuentaBan:CuentbancService,
    private cajaServ:CajaServService,
    private responsable:EmpleadosService,
    private monedero:MonederoElectService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.monderoElect = new monderoElectAngularModelo('','','','','','','',false,false,false,[],'','','');;
    this.txtMonedaMonedero = 'bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4';
    this.manejoMonedero = '';
    this.referensManejoMonedero = '';
    this.tokenResponsMon = '';
    this.responsMonedero = '';
  }

  ngOnInit(): void {
    
    

    this.monedasServ.getMonedas().subscribe((data:InterfMonedas[]) => {
      this.arrayMonedas = data;
      
    });

    this.monedero.listaMonederosElectronicos().subscribe(
      response => {
         if (response.status == 'success') {
          this.arrayListMonederos = response.monedero;
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

  }

  selectListaMonederoElectro(event:any,plataforma_electronica:any){
    for (let m = 0; m < this.arrayListMonederos.length; m++) {
      const moned = this.arrayListMonederos[m];
      if(moned['plataforma_electronica'] == plataforma_electronica){
        this.monderoElect.plataforma_electronica = plataforma_electronica;
        console.log(this.monderoElect);
      }
    }
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

  validaVigencia(event:any,modelDtCuenta:any){
    if (event.value != '') {
      modelDtCuenta.vigencia = event.value;
      console.log(modelDtCuenta);
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

  selectMonedaMonedero(event:any){
    this.txtMonedaMonedero = event.value;
    console.log(this.txtMonedaMonedero);
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

  selectManejoMonedero(event:any){
    if (event.value != '') {
      this.manejoMonedero = event.value;
      console.log(this.manejoMonedero);
    }
  }

  referenciaManejoMon(event:any){
    if (event.value != '') {
      this.referensManejoMonedero = event.value;
    }
  }

  validaNoReferencia(event:any){
    if (event.value == '' || !this.validator.filtroCuenta(event.value) == true) {
      this.validator.errorInput(event,"No. de referencia invalido");
    } else {
      this.validator.correctoInput(event,"No. de referencia");
    }
  }

  selectResponsableMon(event:any){
    //alert(event.value);
    let sepResponsable = event.value.split('-');
    //alert(sepResponsable[0]);
    if (event.value != '') {
      this.tokenResponsMon = sepResponsable[0];
      this.responsMonedero = sepResponsable[1];
      this.renderer.removeAttribute(this.btnAddMnjMon.nativeElement,"disabled");
    } else {
      this.renderer.setAttribute(this.btnAddMnjMon.nativeElement,"disabled","disabled");
    }
  }

  addManejoMonedero(){
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
        if (this.manejoMonedero != '' && this.referensManejoMonedero != '' && this.responsMonedero != '') {
          this.arrayOptionAddMon.push({"clave":this.manejoMonedero,"valor":this.referensManejoMonedero,"responsable":this.tokenResponsMon,
                                      "nameResp":this.responsMonedero});
          //this.renderer.setAttribute(this.txtReferenciaManejo.nativeElement,"value","");
          this.monderoElect.opciones_adicionales = this.arrayOptionAddMon;
          $("#txtReferenciaManejoMon").val('');
          console.log(this.monderoElect.opciones_adicionales);
        }
      }
    });
  }

  deleteManejoMonedero(event:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este registro?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, aliminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        let trTabManejoCuent = $(event).parent("td").parent("tr");
        this.arrayOptionAddMon.splice(trTabManejoCuent.index(),1);
        if (this.arrayOptionAddMon.length == 0) {
          this.monderoElect.opciones_adicionales = [];
        }
        console.log(this.monderoElect.opciones_adicionales);
        Swal.fire(
          'Eliminado!',
          'Este registro se ha eliminado correctamente',
          'success'
        )
      }
    });
  }

  selectCuentaMondElect(event:any,token_cuenta:any){
    for (let c = 0; c < this.arrayCuentaMonedero.length; c++) {
      const account = this.arrayCuentaMonedero[c];
      if(account['token_cuenta'] == token_cuenta){
        this.monderoElect.token_cuentaBanc = token_cuenta;
      }
    }
    //console.log(this.monderoElect);
  }

  selectCajaMondElect(event:any,token_caja:any){
    for (let ca = 0; ca < this.arrayCajaMonedero.length; ca++) {
      const caja = this.arrayCajaMonedero[ca];
      if(caja['token_caja'] == token_caja){
        this.monderoElect.token_caja = caja['token_caja'];
      }
      //console.log(this.monderoElect);
    }
  }

  validaFormMonedero(){
    if (this.monderoElect.plataforma_electronica != '' && this.monderoElect.no_referencia != '' && this.monderoElect.cuenta != '' &&
        this.monderoElect.clabe_inter != '' && this.monderoElect.titularCuenta != '' &&
        (this.monderoElect.areaEgresos == true || this.monderoElect.areaIngresos == true || this.monderoElect.areaValHumano == true)) {

      this.renderer.removeAttribute(this.btnGuardarMonedero.nativeElement,"disabled");
    } else {
      this.renderer.setAttribute(this.btnGuardarMonedero.nativeElement,"disabled","disabled");

    }
  }

  regMonElectro(form:{reset:() => void;}):void{
    let txtMonedaMon:any = document.getElementById("txtMonedaMon");
    this.monderoElect.moneda = txtMonedaMon.value;
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar este monedero electrónico?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        /*this.monedero.registraMonderoElectrnico(this.monderoElect).subscribe(
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
        ):*/
      }
    });
  }

}
