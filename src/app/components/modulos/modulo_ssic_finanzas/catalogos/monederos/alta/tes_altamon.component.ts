import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { monderoElectAngularModelo } from '../../../../../../modelos/monderoElectAngularModelo';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'app-nuevo-monedero-electronico-finanzas',
  templateUrl: './tes_altamon.component.html',
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
    '../../../../../../styles/switches.css',
    '../../../../../../styles/explain.css',
    '../../../finanzas.css',
    './tes_altamon.component.css']
})
export class AltaMonederoTesoreriaComponent implements OnInit {
  public usuario:Usuarios;
  public monderoElect:monderoElectAngularModelo;

  arrayListMonederos:any = [];
  public txtMonedaMonedero:string;
  catalogoMonedasApi:any = [];
  public manejoMonedero:string;
  public referensManejoMonedero:string;
  arrayPersonal:any = [];
  public tokenResponsMon:string;
  public responsMonedero:string;
  arrayOptionAddMon:any = [];
  listaCuentasBancarias:any = [];
  arrayCajaMonedero:any = [];
  viewFormulario:boolean = true;

  public viewContrato:boolean = false; 
  public viewCuenta:boolean = false;  
  public viewClabeInterbanc:boolean = false; 

  constructor(
    private monedasServ:MonedasService,
    private renderer:Renderer2,
    private cuentaBan:CuentbancService,
    private cajaServ:CajaServService,
    private responsable:EmpleadosService,
    private monedero:MonederoElectService,
    private validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private translate:TranslateService,
    private cd: ChangeDetectorRef,
    private encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.monderoElect = new monderoElectAngularModelo('','','','','','','',false,false,false,[],'','','');
    this.txtMonedaMonedero = 'bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4';
    this.manejoMonedero = '';
    this.referensManejoMonedero = '';
    this.tokenResponsMon = '';
    this.responsMonedero = '';
  }

  ngOnInit(): void {
    this.getListaMonedasAPI();
    this.listarMonederosElectronicos();
    this.listarResponsablesMonedero();
    this.listarCuentasMonedero();
    this.listarCajasMonedero();
  }

  getListaMonedasAPI(){
    this.monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.catalogoMonedasApi = response.monedas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listarMonederosElectronicos(){
    this.monedero.listaMonederosElectronicos().subscribe(
      response => {
         if (response.status == 'success') {
          console.log(response)
          this.arrayListMonederos = response.monedero;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listarResponsablesMonedero(){
    this.responsable.catalogoGeneralTrabajadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayPersonal = response.empleados;
          console.log(this.arrayPersonal);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listarCuentasMonedero(){
    this.cuentaBan.catCuentasBancariasMain('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.listaCuentasBancarias = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listarCajasMonedero(){
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
    );
  }

  selectListaMonederoElectro(nombre:any){
    var selectedMedioPagoElect = document.getElementById("selectedMedioPagoElect");
    const validacion = nombre != "" && this.validator.filtroAlfaNumerico(nombre);
    this.monderoElect.plataforma_electronica = validacion ? nombre : '';
    validacion ? this.validator.correctoSelectBrowser(selectedMedioPagoElect) : this.validator.errorSelectBrowser(selectedMedioPagoElect);
  }

  validaNoRef(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true;
    this.monderoElect.no_referencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verContrato(){
    var contrato:any = document.getElementById("referenciaNewMonElect");
    contrato.type = contrato.type === "password" ? "text" : "password";
    this.viewContrato = contrato.type === "text" ? true : false;
  }

  validaNoCuenta(event:any){
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true;
    this.monderoElect.cuenta = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verCuenta(){
    var cuenta:any = document.getElementById("noCuentaNewMonElect");
    cuenta.type = cuenta.type === "password" ? "text" : "password";
    this.viewCuenta = cuenta.type === "text" ? true : false;
  }

  validaClabeInter(event:any){
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true;
    this.monderoElect.clabe_inter = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verClabeInter(){
    var interbank:any = document.getElementById("clabeInterNewMonElect");
    interbank.type = interbank.type === "password" ? "text" : "password";
    this.viewClabeInterbanc = interbank.type === "text" ? true : false;
  }

  validaTitular(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value); 
    this.monderoElect.titularCuenta = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validaCuentaContable(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4;
    this.monderoElect.cuenta_contable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectMonedaMonedero(opcion:any){
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogoMonedasApi.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    const validar = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) && typeof mnd !== 'undefined';
    this.monderoElect.moneda = validar ? mnd.code : '';
    validar ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  validaAreaEgresos(event:any){
    this.monderoElect.areaEgresos = event.checked;
  }

  validaAreaIngresos(event:any){
    this.monderoElect.areaIngresos = event.checked;
  }

  validaAreaVHumano(event:any){
    this.monderoElect.areaValHumano = event.checked;
  }

  selectManejoMonedero(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.manejoMonedero = validacion ? event.value : '';
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
  }

  referenciaManejoMon(event:any){
    const validacion = event.value != "" && this.validator.filtroCuenta(event.value);
    this.referensManejoMonedero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaNoReferencia():boolean{
    const validacionManejoMonedero = this.manejoMonedero != "" && this.validator.filtroAlfaNumerico(this.manejoMonedero);
    const validacionReferenciaManejo = this.referensManejoMonedero != "" && this.validator.filtroCuenta(this.referensManejoMonedero);
    return validacionManejoMonedero && validacionReferenciaManejo;
  }

  addManejoMonedero(){
    var listManejoMonedero = document.getElementById("listManejoMonedero");
    var txtReferenciaManejoMon = document.getElementById("txtReferenciaManejoMon");
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
        if (this.manejoMonedero != '' && this.referensManejoMonedero != '') {
          var num_lista = this.arrayOptionAddMon.length + 1;
          this.arrayOptionAddMon.push({"num_lista":num_lista,"clave":this.manejoMonedero,"valor":this.referensManejoMonedero});
          this.monderoElect.opciones_adicionales = this.arrayOptionAddMon;
          this.validator.limpiaInputRow(listManejoMonedero);
          this.validator.limpiaInputRow(txtReferenciaManejoMon);
          this.manejoMonedero = "";
          this.referensManejoMonedero = "";
          $("#txtReferenciaManejoMon").val('');
          console.log(this.monderoElect.opciones_adicionales);
          this.cd.detectChanges();
        }
      }
    });
  }

  deleteManejoMonedero(num_lista:any){
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
        let pos_lista = this.arrayOptionAddMon.findIndex((row:any) => row.num_lista === num_lista);
        this.arrayOptionAddMon.splice(pos_lista,1);
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

  selectResponsableMon(opcion:any){
    console.log(opcion.token_empleado_vhum);
    var selectedPersonalResponsable = document.getElementById("selectedPersonalResponsable");
    const empleado = this.arrayPersonal.find((row:any) => row.token_empleado_vhum === opcion.token_empleado_vhum);
    const validacion = opcion.token_empleado_vhum != '' && this.validator.filtroAlfaNumerico(empleado.nombre_completo) == true && typeof empleado !== 'undefined'; 
    this.monderoElect.token_responsable = validacion ? empleado.token_empleado_vhum : '';
    validacion ? this.validator.correctoSelectBrowser(selectedPersonalResponsable) : this.validator.errorSelectBrowser(selectedPersonalResponsable);
  }

  selectCajaMondElect(opcion:any){
    var selectedCajaVincular = document.getElementById("selectedCajaVincular");
    const caja = this.arrayCajaMonedero.find((row:any) => row.token_caja === opcion.token_caja);
    const validacion = opcion.token_caja != "" && typeof caja !== 'undefined' && caja.token_caja != "";
    this.monderoElect.token_caja = validacion ? caja.token_caja : '';
    validacion ? this.validator.correctoSelectBrowser(selectedCajaVincular) : this.validator.errorSelectBrowser(selectedCajaVincular);
  }

  selectCuentaMondElect(opcion:any){
    var selectedCuentaBancariaVincular = document.getElementById("selectedCuentaBancariaVincular");
    const cuent = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === opcion.token_cuenta);
    const validacion = opcion.token_cuenta != '' && typeof cuent !== 'undefined' && cuent.token_cuenta != '';
    this.monderoElect.token_cuentaBanc = validacion ? cuent.token_cuenta : '';
    validacion ? this.validator.correctoSelectBrowser(selectedCuentaBancariaVincular) : this.validator.errorSelectBrowser(selectedCuentaBancariaVincular);
  }

  get validaFormMonedero():boolean{
    const validacionPlataformaElectronica = this.monderoElect.plataforma_electronica != "" && this.validator.filtroAlfaNumerico(this.monderoElect.plataforma_electronica);
    const validacionNumReferencia = this.monderoElect.no_referencia != '';
    const validacionNoCuenta = this.monderoElect.cuenta != '';
    const validacionClabeInter = this.monderoElect.clabe_inter != '';
    const validacionTitularCuenta = this.monderoElect.titularCuenta != '';
    const validacionCuentaContable = this.monderoElect.cuenta_contable != '';
    const validacionMoneda = this.monderoElect.moneda != '';
    const validacionAdicionales = this.arrayOptionAddMon.length > 0;
    const validacionCuentaBanc = this.monderoElect.token_cuentaBanc != '';
    const validacionCajaMondElect = this.monderoElect.token_caja != '';

    return validacionPlataformaElectronica && validacionNumReferencia && validacionNoCuenta && validacionClabeInter && validacionTitularCuenta && validacionCuentaContable && validacionMoneda;
  }

  regMonElectro(form:{reset:() => void;}):void{
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
        this.viewFormulario = false;
        this.monedero.registraMonderoElectronico(this.monderoElect).subscribe(
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
              this.arrayOptionAddMon = [];
              this.monderoElect = new monderoElectAngularModelo('','','','','','','',false,false,false,[],'','','');;
              this.relInterna.mensajeMONEDEROInsert("registro aprobado");
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
