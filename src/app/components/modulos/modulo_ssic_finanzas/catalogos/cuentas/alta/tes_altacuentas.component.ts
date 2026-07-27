import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import { cuentasModelo } from '../../../../../../modelos/cuentasModelo';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { DispositivosServService } from '../../../../../../servicios/ssic/dispositivos-serv.service';
import { TranslateService } from '@ngx-translate/core';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';


@Component({
  selector: 'app-nueva-cuenta-bancaria-finanzas',
  templateUrl: './tes_altacuentas.component.html',
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
    '../../../../../../styles/explain.css',
    '../../../finanzas.css',
    './tes_altacuentas.component.css']
})
export class AltaCuentasTesoreriaComponent implements OnInit {
  public usuario:Usuarios;
  public cuentaBanc:cuentasModelo;
  catalogoBancos:any = [];
  catalogoMonedasApi:any = [];

  //manewjo de cuenta
  arrayAdicionales:any = [];
  public manejoCuentaTipo:string = "";
  public manejoCuentaReferencia:string = "";
  public manejoCuentaVigencia:string = "";

  public txtMonedaCuenta:string;

  //registro
  viewFormulario:boolean = true;
  public viewContrato:boolean = false; 
  public viewCuenta:boolean = false;
  public viewClabeInterbanc:boolean = false;

  @ViewChild('txtbuscaBanco') txtbuscaBanco: ElementRef = {} as ElementRef;
  @ViewChild('noCuenta') noCuenta: ElementRef = {} as ElementRef;
  @ViewChild('btnAddManej') btnAddManej: ElementRef = {} as ElementRef;
  @ViewChild('txtReferenciaManejo') txtReferenciaManejo: ElementRef = {} as ElementRef;
  @ViewChild('divFormUpdateCuenta') divFormUpdateCuenta: ElementRef = {} as ElementRef;
  @ViewChild('txtselectbanco') txtselectbanco: ElementRef = {} as ElementRef;
  @ViewChild('txtPasssContrato') txtPasssContrato: ElementRef = {} as ElementRef;
  @ViewChild('btnViewContrato') btnViewContrato: ElementRef = {} as ElementRef;
  @ViewChild('txtPassCuenta') txtPassCuenta: ElementRef = {} as ElementRef;
  @ViewChild('btnViewCuenta') btnViewCuenta: ElementRef = {} as ElementRef;
  @ViewChild('txtPassClabeInter') txtPassClabeInter: ElementRef = {} as ElementRef;
  @ViewChild('btnViewCable') btnViewCable: ElementRef = {} as ElementRef;
  @ViewChild('txtTitular') txtTitular: ElementRef = {} as ElementRef;
  @ViewChild('txtDetMonedaCuenta') txtDetMonedaCuenta: ElementRef = {} as ElementRef;
  @ViewChild('checkEgresos') checkEgresos: ElementRef = {} as ElementRef;
  @ViewChild('checkIngresos') checkIngresos: ElementRef = {} as ElementRef;
  @ViewChild('checkVHumano') checkVHumano: ElementRef = {} as ElementRef;
  @ViewChild('selectManejoAdc') selectManejoAdc: ElementRef = {} as ElementRef;
  @ViewChild('txtReferencia') txtReferencia: ElementRef = {} as ElementRef;
  @ViewChild('btnDetAddManej') btnDetAddManej: ElementRef = {} as ElementRef;

  constructor(
    public monedasServ:MonedasService,
    private renderer:Renderer2,
    public cuentaBan:CuentbancService,
    public bancos:BancosServService,
    public cajaServ:CajaServService,
    private dirServ:DireccionesService,
    public responsable:EmpleadosService,
    public monedero:MonederoElectService,
    public dispositivo:DispositivosServService,
    public validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private translate:TranslateService,
    public encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.cuentaBanc = new cuentasModelo('','','','','','','','','','','',false,false,false,'');
    this.txtMonedaCuenta = 'bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4';
  }

  ngOnInit(): void {
    this.monedasCatalogoApi();
    this.getCatalogoBancos();
  }

  monedasCatalogoApi(){
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

  getCatalogoBancos(){
    this.bancos.getListaBancos().subscribe(
      response => {
         if (response.status == 'success') {
          console.log(response);
          this.catalogoBancos = response.banco;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  selectListaBanco(opcion:any){
    console.log(opcion.nombre_comercial);
    var selectedBancoCuenta = document.getElementById("selectedBancoCuenta");
    const bank = this.catalogoBancos.find((row:any) => row.nombre_comercial === opcion.nombre_comercial);
    const validacion = opcion.nombre_comercial != '' && this.validator.filtroAlfaNumerico(opcion.nombre_comercial) && typeof bank !== 'undefined';
    this.cuentaBanc.token_banco = validacion && typeof bank !== 'undefined' ? bank.token_bancos : '';
    this.cuentaBanc.clave_banco = validacion && typeof bank !== 'undefined' ? bank.clave : '';
    validacion ? this.validator.correctoSelectBrowser(selectedBancoCuenta) : this.validator.errorSelectBrowser(selectedBancoCuenta);
  }

  validaNoContrato(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true;
    //this.cuentaBanc.contrato = validacion ? this.encryptor.encryptBankAccount(event.value) : '';
    this.cuentaBanc.contrato = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cuentaBanc.contrato);
  }

  verContrato(){
    var contrato:any = document.getElementById("contratoNuevaCuenta");
    contrato.type = contrato.type === "password" ? "text" : "password";
    this.viewContrato = contrato.type === "text" ? true : false;
  }

  validaNoCuenta(event:any){
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true;
    //this.cuentaBanc.cuenta = validacion ? this.encryptor.encryptBankAccount(event.value) : '';
    this.cuentaBanc.cuenta = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verCuenta(){
    var cuenta:any = document.getElementById("accountNuevaCuenta");
    cuenta.type = cuenta.type === "password" ? "text" : "password";
    this.viewCuenta = cuenta.type === "text" ? true : false;
  }

  validaClabeInter(event:any){
    var inputSucursal:any = document.getElementById("sucursalNuevaCuenta");
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true;
    //this.cuentaBanc.clabe_inter = validacion ? this.encryptor.encryptBankAccount(event.value) : '';
    this.cuentaBanc.clabe_inter = validacion ? event.value : '';
    inputSucursal.value = validacion ? event.value.substring(3,6) : '';
    //this.cuentaBanc.sucursal = validacion ? this.encryptor.encryptBankAccount(event.value.substring(3,6)) : '';
    this.cuentaBanc.sucursal = validacion ? event.value.substring(3,6) : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verClabeInter(){
    var interbank:any = document.getElementById("clabeInterNuevaCuenta");
    interbank.type = interbank.type === "password" ? "text" : "password";
    this.viewClabeInterbanc = interbank.type === "text" ? true : false;
  }

  validaTitular(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    //this.cuentaBanc.titularCuenta = validacion ? this.encryptor.encryptBankAccount(event.value) : '';
    this.cuentaBanc.titularCuenta = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupValidateMonedaApi(opcion:any){
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogoMonedasApi.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    const validacion = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) && typeof mnd !== 'undefined';
    this.cuentaBanc.moneda_code = validacion ? mnd.code : '';
    this.cuentaBanc.moneda_decimales = validacion ? mnd.decimales : '';
    validacion ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  validaCuentaContable(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4;
    this.cuentaBanc.cuenta_contable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validaAreaEgresos(event:any){
    this.cuentaBanc.areaEgresos = event.checked;
  }

  validaAreaIngresos(event:any){
    this.cuentaBanc.areaIngresos = event.checked;
  }

  validaAreaVHumano(event:any){
    this.cuentaBanc.areaValHumano = event.checked;
  }

  selectManejoCuenta(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.manejoCuentaTipo = validacion ? event.value : '';
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
  }

  referenciaManejoCuenta(event:any){
    const validacion = event.value != "" && this.validator.filtroCuenta(event.value) == true;
    this.manejoCuentaReferencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  vigenciaManejoCuenta(event:any){
    console.log(event.value);
    const validacion = event.value != '' && this.validator.filtroFechaMesAño(event.value) == true;
    this.manejoCuentaVigencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaNoReferencia():boolean{
    const validacionManejoCuenta = this.manejoCuentaTipo != "" && this.validator.filtroAlfaNumerico(this.manejoCuentaTipo) == true;
    const validacionreferencia = this.manejoCuentaReferencia != "" && this.validator.filtroCuenta(this.manejoCuentaReferencia) == true;
    return validacionManejoCuenta && validacionreferencia;
  }

  addManejoCuenta(){
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
        var num_lista = this.arrayAdicionales.length+1;
        const validacionVigencia = this.manejoCuentaVigencia != "" && this.validator.filtroFechaMesAño(this.manejoCuentaVigencia) == true;
        this.arrayAdicionales.push({"num_lista":num_lista,"clave":this.manejoCuentaTipo,"valor":this.manejoCuentaReferencia,"vigencia":(validacionVigencia ? this.manejoCuentaVigencia : '---')});
        this.cuentaBanc.opciones_adicionales = this.arrayAdicionales;
        this.manejoCuentaTipo = "";this.manejoCuentaReferencia = "";this.manejoCuentaVigencia = "";
        this.validator.limpiaSelect(document.getElementById("selectManejo"));
        this.validator.limpiaInputRow(document.getElementById("txtReferenciaManejo"));
        this.validator.limpiaInputRow(document.getElementById("txtVigenciaManejo"));
      }
    });
  }

  deleteManejoCuenta(num_lista:any){
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
        let index = this.arrayAdicionales.findIndex((row:any) => row.num_lista === num_lista);
        this.arrayAdicionales.splice(index,1);
        if (this.arrayAdicionales.length == 0) {
          this.cuentaBanc.opciones_adicionales = '';
        }
        Swal.fire(
          'Eliminado!',
          'Este registro se ha eliminado correctamente',
          'success'
        )
      }
    });
  }

  get validaRegistroCuenta():boolean{
    const validacion_banco = this.cuentaBanc.token_banco != "" && this.cuentaBanc.clave_banco != "";
    const validacion_contrato = this.cuentaBanc.contrato != '';
    const validacion_cuenta = this.cuentaBanc.cuenta != '';
    const validacion_clabe_inter = this.cuentaBanc.clabe_inter != '';
    const validacion_sucursal = this.cuentaBanc.sucursal != '';
    const validacion_titularCuenta = this.cuentaBanc.titularCuenta != '';
    const validacion_moneda_code = this.cuentaBanc.moneda_code != "";
    const validacion_moneda_decimales = this.cuentaBanc.moneda_decimales != "";
    const validacionvalidaMonedaCaja = this.cuentaBanc.cuenta_contable != '';
    const validacion_adicionales = this.arrayAdicionales.length > 0;

    return validacion_banco && validacion_contrato && validacion_cuenta && validacion_clabe_inter && validacion_sucursal &&  
      validacion_titularCuenta && validacion_moneda_code && validacion_moneda_decimales && validacionvalidaMonedaCaja && validacion_adicionales;
  }

  regCuentaBan(form:{reset:() => void;}):void{
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.viewFormulario = false;
        this.cuentaBan.registroCuentBanc(this.cuentaBanc).subscribe(
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
              this.viewFormulario = true;
              this.cuentaBanc = new cuentasModelo('','','','','','','','','','','',false,false,false,'');
              this.relInterna.mensajeCuentaInsert("registro aprobado");
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
