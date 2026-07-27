import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import { cuentasModelo } from '../../../../../../modelos/cuentasModelo';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonedasService } from '../../../../../../servicios/monedas.service';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { Table } from 'primeng/table';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './tes_listacuentas.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
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
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/navegador.css',
    '../../../finanzas.css',
  './tes_listacuentas.component.css'
  ]
})
export class ListaCuentasTesoreriaComponent implements OnInit {
  public usuario:Usuarios;
  public cuentaBanc:cuentasModelo;

  public viewModalNuevaCBancaria = false;

  arrayCuentBanc:any = [];
  indicadorCuentBanc:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoCuentBanc: Date[] | undefined;

  catalogoBancos:any = [];
  catalogoMonedasApi:any = [];

  public verModalCuentaRegistrada = false;
  infoCuentaRegistrada:any = [];
  tokenCuentaRegistrada:string = "";
  
  //manewjo de cuenta
  arrayAdicionales:any = [];
  public manejoCuentaTipo:string = "";
  public manejoCuentaReferencia:string = "";
  public manejoCuentaVigencia:string = "";
  
  public viewModalCuentBankDelet = false;
  arrayCuentBankDelet:any = [];
  @ViewChild('listCuentBanc') table_cbank!: Table;
  formCuentaBank!: FormGroup;

  constructor(
    private bancos:BancosServService,
    private monedasServ:MonedasService,
    private cuentaBan:CuentbancService,
    private renderer:Renderer2,
    private validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private translate:TranslateService,
    private servXlsx:DescargaExcel,
    private encryptor:ServEncryptService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.cuentaBanc = new cuentasModelo('','','','','','','','','','','',false,false,false,'');
      this.formCuentaBank = this.fb.group({
        banco: [this.cuentaBanc.clave_banco || null],
        moneda: [this.cuentaBanc.moneda_code || null],
      });
  }

  ngOnInit(): void {
    this.verCuentasBancariaTRUE('hoy');
    this.listaCuentasBancariasDeleted();
    this.getCatalogoBancos();
    this.monedasCatalogoApi();
    this.getRespuestaRegistro();
  }

  verVentanaNuevaCuentaBancaria(){
    this.viewModalNuevaCBancaria = true;
  }

  getRespuestaRegistro(){
    this.relInterna.mensajeInsertCUENTA$.subscribe(
      (mensaje:any) => {
        mensaje == "registro aprobado" ? this.listaCuentasBancariaTRUE() : null;
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

  listaCuentasBancariaTRUE() {
    this.verCuentasBancariaTRUE(this.indicadorCuentBanc);
  }

  verCuentasBancariaTRUE(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorCuentBanc = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var account_bank_otras_fechas = document.getElementById("account_bank_otras_fechas");
      if (this.rangoPeriodoCuentBanc && this.rangoPeriodoCuentBanc[1]) {
        const dateInicio = this.rangoPeriodoCuentBanc[0];
        const dateFin = this.rangoPeriodoCuentBanc[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(account_bank_otras_fechas);
          } else {
            this.validator.errorInputRow(account_bank_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(account_bank_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(account_bank_otras_fechas);
      }
    }

    this.cuentaBan.catCuentasBancariasMain(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaCuentasBank(response),
      error: (err) => this.manejarErrorCuentasBank(err)
    });
  }

  private procesarRespuestaCuentasBank(response: any) {
    if (response.status === 'success') {
      this.arrayCuentBanc = response.cuentas;
      this.arrayCuentBanc = this.arrayCuentBanc.map((item:any) => ({
        ...item,
        banco_completo: item.banco_clave + ' ' + item.banco_nombre_comercial
      }));
      this.cd.detectChanges();
    } else {
      this.arrayCuentBanc = [];
    }
  }

  private manejarErrorCuentasBank(error: any) {
    console.error('Error al cargar cuentas bancarias:', error);
    this.arrayCuentBanc = [];
  }

  descarga_excel_bancos(){
    const columnas:ExcelColumnas[] = [
      {label: "folio", field: "folio_cuenta", align: "center"},
      {label: "banco", field: "banco_completo", align: "center"},
      {label: "cuenta", field: "cuenta_bancaria", align: "center"},
      {label: "Egresos y cuentas por pagar", field: "egresos", align: "center"},
      {label: "Ingresos y cuentas por cobrar", field: "ingresos", align: "center"},
      {label: "Valor humano", field: "v_humano", align: "center"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.arrayCuentBanc,columnas,'Bancos','catálogo de bancos.xlsx');
  }

  limpiaData(){
    this.infoCuentaRegistrada = [];
    this.arrayAdicionales = [];
    this.tokenCuentaRegistrada = "";
    this.cuentaBanc.token_banco = "";
    this.cuentaBanc.clave_banco = "";
    this.cuentaBanc.contrato = "";
    this.cuentaBanc.cuenta = "";
    this.cuentaBanc.clabe_inter = "";
    this.cuentaBanc.vigencia = "";
    this.cuentaBanc.sucursal = "";
    this.cuentaBanc.titularCuenta = "";
    this.cuentaBanc.moneda_code = "";
    this.cuentaBanc.moneda_decimales = "";
    this.cuentaBanc.areaEgresos = false;
    this.cuentaBanc.areaIngresos = false;
    this.cuentaBanc.areaValHumano = false;
    this.cuentaBanc.opciones_adicionales = [];
  }

  functViewCuenta(token_cuenta:any){
    this.limpiaData();
    this.cuentaBan.detalleCuentaBancaria(token_cuenta).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.cuenta);
          this.verModalCuentaRegistrada = true;
          this.infoCuentaRegistrada = response.cuenta;
          this.tokenCuentaRegistrada = token_cuenta;
          this.infoCuentaRegistrada.forEach((row:any) => {
            console.log(row.contrato);
            this.cuentaBanc.token_banco = row.banco_token;
            this.cuentaBanc.clave_banco = row.banco_clave;
            this.formCuentaBank.patchValue({banco: row.banco_clave});

            this.cuentaBanc.contrato = row.contrato;
            this.cuentaBanc.cuenta = row.cuenta;
            this.cuentaBanc.clabe_inter = row.clabe_inter;
            this.cuentaBanc.vigencia = row.vigencia;
            this.cuentaBanc.sucursal = row.sucursal;
            this.cuentaBanc.titularCuenta = row.titular;
            
            this.cuentaBanc.moneda_code = row.moneda_code;
            this.formCuentaBank.patchValue({moneda: row.moneda_code});

            const currency = this.catalogoMonedasApi.find((mon:any) => mon.code === row.moneda_code);
            row.moneda_name = currency.langEN;
            this.cuentaBanc.moneda_decimales = currency.decimales;

            this.cuentaBanc.cuenta_contable = row.cuenta_contable;

            this.cuentaBanc.areaEgresos = row.egresos;
            this.cuentaBanc.areaIngresos = row.ingresos;
            this.cuentaBanc.areaValHumano = row.v_humano;
            this.cuentaBanc.opciones_adicionales = row.opciones_adicionales;
          });
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  
  selectListaBanco(clave:any){
    console.log(clave);
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    var editBancoCuenta = document.getElementById("editBancoCuenta");
    const bank = this.catalogoBancos.find((row:any) => row.clave === clave);
    this.cuentaBanc.token_banco = bank.token_bancos;
    this.cuentaBanc.clave_banco = bank.clave;
    const validacion = clave != '' && this.validator.filtroAlfaNumerico(clave) && typeof bank !== 'undefined' && typeof account !== 'undefined' && this.cuentaBanc.token_banco != account.banco_token;
    validacion ? this.validator.correctoSelectBrowser(editBancoCuenta) : this.validator.errorSelectBrowser(editBancoCuenta);
  }

  validaNoContrato(event:any){
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    this.cuentaBanc.contrato = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true && typeof account !== 'undefined' && this.cuentaBanc.contrato != account.contrato;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cuentaBanc.contrato);
  }

  verContrato(){
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    account.contrato_view = account.contrato_view ? false : true;
    var contrato:any = document.getElementById("contratoCuentaRegistrada");
    contrato.type = contrato.type === "password" ? "text" : "password";
  }

  validaNoCuenta(event:any){
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    this.cuentaBanc.cuenta = event.value;
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true && typeof account !== 'undefined' && this.cuentaBanc.cuenta != account.cuenta;
    //console.log(this.encryptor.decryptBankAccount(this.cuentaBanc.cuenta));
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verCuenta(){
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    account.cuenta_view = account.cuenta_view ? false : true;
    var contrato:any = document.getElementById("accountCuentaRegistrada");
    contrato.type = contrato.type === "password" ? "text" : "password";
  }

  validaClabeInter(event:any){
    var inputSucursal:any = document.getElementById("sucursalCuentaRegistrada");
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    this.cuentaBanc.clabe_inter = event.value;
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true && typeof account !== 'undefined' && this.cuentaBanc.clabe_inter != account.clabe_inter;
    inputSucursal.value = validacion ? event.value.substring(3,6) : '';
    this.cuentaBanc.sucursal = validacion ? event.value.substring(3,6) : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verClabeInter(){
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    account.clabe_inter_view = account.clabe_inter_view ? false : true;
    var interbank:any = document.getElementById("clabeInterCuentaRegistrada");
    interbank.type = interbank.type === "password" ? "text" : "password";
  }

  validaTitular(event:any){
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    this.cuentaBanc.titularCuenta = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof account !== 'undefined' && this.cuentaBanc.titularCuenta != account.titular;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupValidateMonedaApi(code:any){
    var editMonedaCuenta = document.getElementById("editMonedaCuenta");
    console.log(code);
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    const mnd = this.catalogoMonedasApi.find((row: any) => row.code === code);
    this.cuentaBanc.moneda_code = mnd.code;
    this.cuentaBanc.moneda_decimales = mnd.decimales;
    const validacion = code != '' && this.validator.filtroAlfaNumerico(code) == true && typeof mnd !== 'undefined' && typeof account !== 'undefined' && this.cuentaBanc.moneda_code != account.moneda_code;
    validacion ? this.validator.correctoSelectBrowser(editMonedaCuenta) : this.validator.errorSelectBrowser(editMonedaCuenta);
  }

  validaCuentaContable(event:any){
    const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    this.cuentaBanc.cuenta_contable = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof account !== 'undefined' && this.cuentaBanc.cuenta_contable != account.cuenta_contable;
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
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
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

  deleteManejoCuentaNuevo(num_lista:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.arrayAdicionales.findIndex((row:any) => row.num_lista === num_lista);
        this.arrayAdicionales.splice(index,1);
        Swal.fire(
          'Eliminado!',
          'Este registro se ha eliminado correctamente',
          'success'
        )
      }
    });
  }

  deleteManejoCuentaRegistrado(token_medio_operacion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        let option = this.cuentaBanc.opciones_adicionales.find((row:any) => row.token_medio_operacion === token_medio_operacion);
        option.proceso_eliminacion = option.proceso_eliminacion ? false : true;
      }
    });
  }

  get validaActualizacionCuenta():boolean{
    if (this.infoCuentaRegistrada.length > 0) {
      const account = this.infoCuentaRegistrada.find((row:any) => row.token_cuenta === this.tokenCuentaRegistrada);
    
      const bank = this.catalogoBancos.find((row:any) => row.token_bancos === this.cuentaBanc.token_banco);
      const validacion_banco = this.cuentaBanc.token_banco != "" && this.cuentaBanc.clave_banco != "" && typeof bank !== 'undefined' && typeof account !== 'undefined' && this.cuentaBanc.token_banco != account.banco_token;
  
      const validacion_contrato = this.cuentaBanc.contrato != '' && typeof account !== 'undefined' && this.cuentaBanc.contrato != account.contrato;
      const validacion_cuenta = this.cuentaBanc.cuenta != '' && typeof account !== 'undefined' && this.cuentaBanc.cuenta != account.cuenta;
      const validacion_clabe_inter = this.cuentaBanc.clabe_inter != '' && typeof account !== 'undefined' && this.cuentaBanc.clabe_inter != account.clabe_inter;
      const validacion_sucursal = this.cuentaBanc.sucursal != '' && typeof account !== 'undefined' && this.cuentaBanc.sucursal != account.sucursal;
      const validacion_titularCuenta = this.cuentaBanc.titularCuenta != '' && typeof account !== 'undefined' && this.cuentaBanc.titularCuenta != account.titular;
  
      const currency = this.catalogoMonedasApi.find((row:any) => row.code === this.cuentaBanc.moneda_code);
      const validacion_moneda_code = this.cuentaBanc.moneda_code != "" && this.cuentaBanc.moneda_decimales != "" && typeof currency !== 'undefined' && typeof account !== 'undefined' && this.cuentaBanc.moneda_code != account.moneda_code;
      
      const validacion_cuenta_contable = this.cuentaBanc.cuenta_contable != "" && this.validator.filtroAlfaNumerico(this.cuentaBanc.cuenta_contable) && this.cuentaBanc.cuenta_contable.length > 4 && typeof account !== 'undefined' && this.cuentaBanc.cuenta_contable != account.cuenta_contable;

      const validaAreaEgresos = this.cuentaBanc.areaEgresos != account.egresos;
      const validaAreaIngresos = this.cuentaBanc.areaIngresos != account.ingresos;
      const validaAreaVHumano = this.cuentaBanc.areaValHumano != account.v_humano;
  
      const validacion_adicionales_new = this.arrayAdicionales.length > 0;
      let option = this.cuentaBanc.opciones_adicionales.filter((row:any) => row.proceso_eliminacion === true);
      const validacion_adicionales_old = option.length > 0;
  
      return validacion_banco || 
        validacion_contrato || 
        validacion_cuenta || 
        validacion_clabe_inter || 
        validacion_sucursal || 
        validacion_titularCuenta || 
        validacion_moneda_code || 
        validacion_cuenta_contable ||
        validaAreaEgresos || 
        validaAreaIngresos || 
        validaAreaVHumano || 
        validacion_adicionales_new || 
        validacion_adicionales_old;
    } else {
      return false;
    }
  }

  actualizaCuentaBan(token_cuenta:any){
    let eliminacion_proceso = this.cuentaBanc.opciones_adicionales.filter((row:any) => row.proceso_eliminacion === true);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        //let cuenta_cipher_contrado:string = btoa(this.cuentaBanc.contrato);
        //let cuenta_cipher_cuenta:string = btoa(this.cuentaBanc.cuenta);
        //let cuenta_cipher_clabe_inter:string = btoa(this.cuentaBanc.clabe_inter);
        //let cuenta_cipher_sucursal:string = btoa(this.cuentaBanc.sucursal);
        //let cuenta_cipher_titularCuenta:string = btoa(this.cuentaBanc.titularCuenta);
        //console.log(cuenta_cipher_contrado);
        this.cuentaBan.updateCuentBanc(token_cuenta,
          this.cuentaBanc.token_banco,
          this.cuentaBanc.contrato,//cuenta_cipher_contrado,
          this.cuentaBanc.cuenta,//cuenta_cipher_cuenta,
          this.cuentaBanc.clabe_inter,//cuenta_cipher_clabe_inter,
          this.cuentaBanc.sucursal,//cuenta_cipher_sucursal,
          this.cuentaBanc.titularCuenta,//cuenta_cipher_titularCuenta,
          this.cuentaBanc.moneda_code,
          this.cuentaBanc.cuenta_contable,
          this.cuentaBanc.areaEgresos,
          this.cuentaBanc.areaIngresos,
          this.cuentaBanc.areaValHumano,
          eliminacion_proceso,
          this.arrayAdicionales).subscribe(
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
              //$('#'+ventana).modal('hide');
              //$('.modal-backdrop').remove();
              this.functViewCuenta(token_cuenta);
              this.listaCuentasBancariaTRUE();
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

  functCuentaNumber(token_cuenta:any){
    let account = this.arrayCuentBanc.find((row:any) => row.token_cuenta === token_cuenta);
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

  functDeleteCuenta(token_cuenta:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaBan.deleteCuentaBancaria(token_cuenta).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.listaCuentasBancariaTRUE();
              this.listaCuentasBancariasDeleted();
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
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
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: error,
              showConfirmButton: false,
              timer: 3000
            });
          }
        );
      }
    });
  }

  verVentanaNuevaCBankDelet(){
    this.viewModalCuentBankDelet = true;
  }

  listaCuentasBancariasDeleted(){
    this.cuentaBan.cuentasDelete().subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayCuentBankDelet = response.cuentas
          console.log(response.cuentas);
          for (let i = 0; i < response.cuentas.length; i++) {
            console.log(response.cuentas[i]['cuenta']);
            var cuuentaCifrado = this.encryptor.decryptBankAccount(response.cuentas[i]['cuenta']);
            console.log(cuuentaCifrado);
            this.arrayCuentBankDelet[i]['cuenta'] = cuuentaCifrado.replace(cuuentaCifrado.substring(cuuentaCifrado.length-4,0),'**** **** **** ');
            //console.log(this.arrayCuentBankDelet[i]['cuenta']);
          }
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  functRestauraCuenta(token_cuenta:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaBan.restauraCuentaBancaria(token_cuenta).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.listaCuentasBancariaTRUE();
              this.listaCuentasBancariasDeleted();
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

  functDeletPermCuenta(token_cuenta:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentaBan.eliminaPermCuentaBancaria(token_cuenta).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.listaCuentasBancariaTRUE();
              this.listaCuentasBancariasDeleted();
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
