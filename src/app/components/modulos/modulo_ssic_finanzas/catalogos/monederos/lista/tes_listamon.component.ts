import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { monderoElectAngularModelo } from '../../../../../../modelos/monderoElectAngularModelo';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { Table } from 'primeng/table';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './tes_listamon.component.html',
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
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../finanzas.css',
    './tes_listamon.component.css']
})
export class ListaMonederoTesoreriaComponent implements OnInit {
  public usuario:Usuarios;
  public monderoElect:monderoElectAngularModelo;
  listMonederoElectro:any = [];
  indicadorMonederoElectro:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoMonederoElectro: Date[] | undefined;
  infoForm: FormGroup;
  
  public verFormNuevoMonElectronico:boolean = false;

  public verFormDetListMonedero:boolean = false;
  arrayDetListMonedero:any = [];
  public verDetMonElectronico:boolean = false;
  public tokenCuentaMonederoRegistrado:string = "";
  arrayListMonederos:any = [];
  catalogoMonedasApi:any = [];
  public viewContrato:boolean = false; 
  public viewCuenta:boolean = false;  
  public viewClabeInterbanc:boolean = false; 
  public manejoMonedero:string = "";
  public referensManejoMonedero:string = "";
  listMediosOperacionNew:any = [];
  listMediosOperacionRegistrados:any = [];
  arrayPersonal:any = [];
  arrayCajaMonedero:any = [];
  listaCuentasBancarias:any = [];
  public verlistaMonElectronicoDeleted:boolean = false;
  listMonederoElectDel:any = [];
  @ViewChild('monElectList') table_monedero!: Table;

  constructor(
    private monedasServ:MonedasService,
    private renderer:Renderer2,
    private responsable:EmpleadosService,
    private monedero:MonederoElectService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private relInterna:ComunicacionInternaService,
    private cuentaBan:CuentbancService,
    private cajaServ:CajaServService,
    private servXlsx:DescargaExcel,
    private encryptor:ServEncryptService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.monderoElect = new monderoElectAngularModelo('','','','','','','',false,false,false,[],'','','');;
    this.infoForm = this.fb.group({
      plataforma_electronica: [this.monderoElect.plataforma_electronica || null],
      mon_moneda: [this.monderoElect.moneda || null],
      responsableVinculado: [this.monderoElect.token_responsable || null],
      cajaVinculada: [this.monderoElect.token_caja || null],
      cuentaBancariaVinculada: [this.monderoElect.token_cuentaBanc || null],
    });
  }

  ngOnInit(): void {
    this.verMonederosElect('hoy');
    this.listarMonederosElectDelete();
    this.listarMonederosElectronicos();
    this.getListaMonedasAPI();
    this.listarResponsablesMonedero();
    this.listarCuentasBancarias();
    this.listarCajasMonedero();
    this.getRespuestaRegistro();
  }

  openFormNuevoMonElectronico(){
    this.verFormNuevoMonElectronico = true;
  }

  getRespuestaRegistro(){
    this.relInterna.mensajeInsertMONEDERO$.subscribe(
      (mensaje:any) => {
        mensaje == "registro aprobado" ? this.listaMonederosElect() : null;
      }
    );
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

  descarga_excel_monedero(){
    const columnas:ExcelColumnas[] = [
      {label: "Folio", field: "folio_cuenta", align: "center"},
      {label: "Monedero", field: "monedero", align: "center"},
      {label: "Cuenta", field: "cuenta_monedero", align: "center"},
      {label: "Egresos y cuentas por pagar", field: "egresos", align: "center"},
      {label: "Ingresos y cuentas por cobrar", field: "ingresos", align: "center"},
      {label: "Valor humano", field: "v_humano", align: "center"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.listMonederoElectro,columnas,'Monederos electrónicos','catálogo de monederos electrónicos.xlsx');
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

  listarCuentasBancarias(){
    this.cuentaBan.catCuentasBancariasMain('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          console.log(response);
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
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayCajaMonedero = response.caja;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  listaMonederosElect() {
    this.verMonederosElect(this.indicadorMonederoElectro);
  }

  verMonederosElect(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorMonederoElectro = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var moned_otras_fechas = document.getElementById("moned_otras_fechas");
      if (this.rangoPeriodoMonederoElectro && this.rangoPeriodoMonederoElectro[1]) {
        const dateInicio = this.rangoPeriodoMonederoElectro[0];
        const dateFin = this.rangoPeriodoMonederoElectro[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(moned_otras_fechas);
          } else {
            this.validator.errorInputRow(moned_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(moned_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(moned_otras_fechas);
      }
    }

    this.monedero.catalogoMonederosElect(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaMonedElect(response),
      error: (err) => this.manejarErrorMonedElect(err)
    });
  }

  private procesarRespuestaMonedElect(response: any) {
    if (response.status === 'success') {
      this.listMonederoElectro = response.monedero
      this.cd.detectChanges();
    } else {
      this.listMonederoElectro = [];
    }
  }

  private manejarErrorMonedElect(error: any) {
    console.error('Error al cargar monederos electrónicos:', error);
    this.listMonederoElectro = [];
  }

  functViewMonderoElectronico(token_cuentaMon:any){
    this.monedero.detalleMonederoElectronico(token_cuentaMon).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.verDetMonElectronico = true;
          this.verFormDetListMonedero = true;
          this.tokenCuentaMonederoRegistrado = token_cuentaMon;
          this.arrayDetListMonedero = response.monedero;
          console.log(this.arrayDetListMonedero);
          this.arrayDetListMonedero.forEach((row:any) => {
            this.monderoElect.plataforma_electronica = row.plataforma_electronica;
            this.infoForm.patchValue({plataforma_electronica: row.plataforma_electronica});

            this.monderoElect.no_referencia = row.referencia
            this.monderoElect.cuenta = row.cuenta;
            this.monderoElect.clabe_inter = row.clabe_inter;
            this.monderoElect.titularCuenta = row.titular;
            this.monderoElect.cuenta_contable = row.cuenta_contable;

            this.monderoElect.moneda = row.moneda;
            this.infoForm.patchValue({mon_moneda: row.moneda});
            
            this.monderoElect.areaEgresos = row.mon_egresos;
            this.monderoElect.areaIngresos = row.mon_ingresos;
            this.monderoElect.areaValHumano = row.mon_v_humano;
            this.monderoElect.opciones_adicionales = row.medios_operacion;
            this.listMediosOperacionRegistrados = row.medios_operacion;

            this.monderoElect.token_responsable = row.responsable_token;
            this.infoForm.patchValue({responsableVinculado: row.responsable_token});

            this.monderoElect.token_caja = row.caja_token;
            this.infoForm.patchValue({cajaVinculada: row.caja_token});

            this.monderoElect.token_cuentaBanc = row.cuenta_banco_token;
            this.infoForm.patchValue({cuentaBancariaVinculada: row.cuenta_banco_token});
          });
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  selectListaMonederoElectro(nombre:any){
    console.log(nombre);
    var editMonElectMedioPagoElect = document.getElementById("editMonElectMedioPagoElect");
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    this.monderoElect.plataforma_electronica = nombre;
    const validacion = nombre != "" && this.validator.filtroAlfaNumerico(nombre) && this.monderoElect.plataforma_electronica != mondet.plataforma_electronica;
    validacion ? this.validator.correctoSelectBrowser(editMonElectMedioPagoElect) : this.validator.errorSelectBrowser(editMonElectMedioPagoElect);
  }

  validaNoRef(event:any){
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    this.monderoElect.no_referencia = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true && typeof mondet !== 'undefined' && this.monderoElect.no_referencia != mondet.referencia_backend;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verContrato(){
    var contrato:any = document.getElementById("editMonElectReferencia");
    contrato.type = contrato.type === "password" ? "text" : "password";
    this.viewContrato = contrato.type === "text" ? true : false;
  }

  validaNoCuenta(event:any){
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    this.monderoElect.cuenta = event.value;
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true && typeof mondet !== 'undefined' && this.monderoElect.cuenta != mondet.cuenta_backend;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verCuenta(){
    var cuenta:any = document.getElementById("editMonElectNoCuenta");
    cuenta.type = cuenta.type === "password" ? "text" : "password";
    this.viewCuenta = cuenta.type === "text" ? true : false;
  }

  validaClabeInter(event:any){
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    this.monderoElect.clabe_inter = event.value;
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) == true && typeof mondet !== 'undefined' && this.monderoElect.clabe_inter != mondet.clabe_inter_backend;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verClabeInter(){
    var interbank:any = document.getElementById("editMonElectClabeInter");
    interbank.type = interbank.type === "password" ? "text" : "password";
    this.viewClabeInterbanc = interbank.type === "text" ? true : false;
  }

  validaTitular(event:any){
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    this.monderoElect.titularCuenta = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof mondet !== 'undefined' && this.monderoElect.titularCuenta != mondet.titular_backend;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectMonedaMonedero(code:any){
    var editMonElectMoneda = document.getElementById("editMonElectMoneda");
    console.log(code);
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    const mnd = this.catalogoMonedasApi.find((row: any) => row.code === code);
    this.monderoElect.moneda = mnd.code;
    const validacion = code != '' && this.validator.filtroAlfaNumerico(code) == true && typeof mnd !== 'undefined' && typeof mondet !== 'undefined' && this.monderoElect.moneda != mondet.moneda;
    validacion ? this.validator.correctoSelectBrowser(editMonElectMoneda) : this.validator.errorSelectBrowser(editMonElectMoneda);
  }

  validaCuentaContable(event:any){
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    this.monderoElect.cuenta_contable = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof mondet !== 'undefined' && this.monderoElect.cuenta_contable != mondet.cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
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

  manejoMonederoListDelete(event:any,token_medio_operacion:any){
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
        this.listMediosOperacionRegistrados = this.listMediosOperacionRegistrados.map((med:any) => 
          med.token_medio_operacion === token_medio_operacion
            ? {...med, proceso_eliminacion: event.checked}
            : med
        );
        
        const medope_dellist = this.listMediosOperacionRegistrados.filter((med:any) => med.proceso_eliminacion);
        const medope_delete = medope_dellist.length > 0;
        console.log(medope_delete);
        this.cd.detectChanges();

        //Swal.fire(
        //  'Eliminado!',
        //  'Este registro se ha eliminado correctamente',
        //  'success'
        //)
      }
    });
  }

  referenciaManejoMon(event:any){
    const validacion = event.value != "" && this.validator.filtroCuenta(event.value) == true;
    this.referensManejoMonedero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaNoReferencia():boolean{
    const validacionManejoMonedero = this.manejoMonedero != "" && this.validator.filtroAlfaNumerico(this.manejoMonedero) == true;
    const validacionReferenciaManejo = this.referensManejoMonedero != "" && this.validator.filtroCuenta(this.referensManejoMonedero) == true;
    return validacionManejoMonedero && validacionReferenciaManejo;
  }

  addManejoMonedero(){
    var editMonElectManejoMonedero = document.getElementById("editMonElectManejoMonedero");
    var editMonElectManejoReferencia = document.getElementById("editMonElectManejoReferencia");
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
          var num_lista = this.listMediosOperacionNew.length + 1;
          this.listMediosOperacionNew.push({"num_lista":num_lista,"clave":this.manejoMonedero,"valor":this.referensManejoMonedero});
          this.monderoElect.opciones_adicionales = this.listMediosOperacionNew;
          this.validator.limpiaInputRow(editMonElectManejoMonedero);
          this.validator.limpiaInputRow(editMonElectManejoReferencia);
          this.manejoMonedero = "";
          this.referensManejoMonedero = "";
          $("#editMonElectManejoReferencia").val('');
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
        let pos_lista = this.listMediosOperacionNew.findIndex((row:any) => row.num_lista === num_lista);
        this.listMediosOperacionNew.splice(pos_lista,1);
        if (this.listMediosOperacionNew.length == 0) {
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

  selectResponsableMon(nombre_completo:any){
    console.log(nombre_completo);
    var editMonElectResponsableVinculado = document.getElementById("editMonElectResponsableVinculado");
    const empleado = this.arrayPersonal.find((row:any) => row.nombre_completo === nombre_completo);
    this.monderoElect.token_responsable = empleado.token_empleado_vhum;
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado); 
    const validacion = nombre_completo != '' && this.validator.filtroAlfaNumerico(nombre_completo) && typeof empleado !== 'undefined' && typeof mondet !== 'undefined' && this.monderoElect.token_responsable != mondet.responsable_token; 
    validacion ? this.validator.correctoSelectBrowser(editMonElectResponsableVinculado) : this.validator.errorSelectBrowser(editMonElectResponsableVinculado);
  }

  selectCajaMondElect(filtro_busqueda:any){
    console.log(filtro_busqueda);
    var editMonElectCajaVinculada = document.getElementById("editMonElectCajaVinculada");
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    const caja = this.arrayCajaMonedero.find((row:any) => row._filtro_busqueda === filtro_busqueda);
    this.monderoElect.token_caja = caja.token_caja;
    const validacion = filtro_busqueda != '' && this.validator.filtroAlfaNumerico(filtro_busqueda) && typeof caja !== 'undefined' && typeof mondet !== 'undefined' && this.monderoElect.token_caja != mondet.caja_token;
    validacion ? this.validator.correctoSelectBrowser(editMonElectCajaVinculada) : this.validator.errorSelectBrowser(editMonElectCajaVinculada);
  }

  selectCuentaMondElect(filtro_busqueda:any){
    console.log(filtro_busqueda);
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);
    var editMonElectCuentaBancariaVinculada = document.getElementById("editMonElectCuentaBancariaVinculada");
    const cuent = this.listaCuentasBancarias.find((row:any) => row._filtro_busqueda === filtro_busqueda);
    this.monderoElect.token_cuentaBanc = cuent.token_cuenta;
    const validacion = filtro_busqueda != '' && typeof cuent !== 'undefined' && typeof mondet !== 'undefined' && this.monderoElect.token_cuentaBanc != mondet.cuenta_banco_token;
    validacion ? this.validator.correctoSelectBrowser(editMonElectCuentaBancariaVinculada) : this.validator.errorSelectBrowser(editMonElectCuentaBancariaVinculada);
  }

  get validaFormMonedero():boolean{
    const mondet = this.arrayDetListMonedero.find((row:any) => row.token_cuentaMon === this.tokenCuentaMonederoRegistrado);

    const validacionPlatmaElect = this.monderoElect.plataforma_electronica != "" && this.validator.filtroAlfaNumerico(this.monderoElect.plataforma_electronica) && this.monderoElect.plataforma_electronica != mondet.plataforma_electronica;
    
    const validacionNumReferencia = this.monderoElect.no_referencia != '' && typeof mondet !== 'undefined' && this.monderoElect.no_referencia != mondet.referencia;
    const validacionNoCuenta = this.monderoElect.cuenta != '' && typeof mondet !== 'undefined' && this.monderoElect.cuenta != mondet.cuenta;
    const validacionClabeInter = this.monderoElect.clabe_inter != '' && typeof mondet !== 'undefined' && this.monderoElect.clabe_inter != mondet.clabe_inter;
    const validacionTitularCuenta = this.monderoElect.titularCuenta != '' && typeof mondet !== 'undefined' && this.monderoElect.titularCuenta != mondet.titular;

    const mon_data = this.catalogoMonedasApi.find((row:any) => row.code === this.monderoElect.moneda); 
    const validacionMoneda = this.monderoElect.moneda != '' && this.validator.filtroAlfaNumerico(this.monderoElect.moneda) && typeof mon_data !== 'undefined' && typeof mondet !== 'undefined' && this.monderoElect.moneda != mondet.moneda;

    const validacionCuentaContable = this.monderoElect.cuenta_contable != "" && this.validator.filtroAlfaNumerico(this.monderoElect.cuenta_contable) && this.monderoElect.cuenta_contable.length > 4 && typeof mondet !== 'undefined' && this.monderoElect.cuenta_contable != mondet.cuenta_contable;

    const medope_dellist = this.listMediosOperacionRegistrados.filter((me_d:any) => me_d.proceso_eliminacion);
    const medope_delete = medope_dellist.length > 0;
    console.log(medope_dellist.length);
    const validacionAdicionales = this.listMediosOperacionNew.length > 0;
    const validacionEgresos = this.monderoElect.areaEgresos != mondet.mon_egresos;
    const validacionIngresos = this.monderoElect.areaIngresos != mondet.mon_ingresos;
    const validacionVHumano = this.monderoElect.areaValHumano != mondet.mon_v_humano;


    const empleado = this.arrayPersonal.find((row:any) => row.token_empleado_vhum === this.monderoElect.token_responsable);
    const validacionResponsable = this.monderoElect.token_responsable != '' && typeof empleado !== 'undefined' && typeof mondet !== 'undefined' && this.monderoElect.token_responsable != mondet.responsable_token; 
    const validacionCajaMondElect = this.monderoElect.token_caja != '' && this.monderoElect.token_caja != mondet.caja_token;

    const validacionCuentaBanc = this.monderoElect.token_cuentaBanc != '' && this.monderoElect.token_cuentaBanc != mondet.cuenta_banco_token;
    return mondet !== 'undefined' && validacionPlatmaElect || validacionNumReferencia || validacionNoCuenta || validacionClabeInter || validacionTitularCuenta || validacionMoneda || validacionCuentaContable || validacionEgresos || validacionIngresos || 
    validacionVHumano || medope_delete || validacionAdicionales || validacionResponsable ||validacionCuentaBanc || validacionCajaMondElect;
  }

  actualizaMonedero(){
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
        this.verFormDetListMonedero = false;
        console.log(this.monderoElect.opciones_adicionales);
        this.monedero.updateMonederoElectronico(this.tokenCuentaMonederoRegistrado,
          this.monderoElect.plataforma_electronica,
          this.monderoElect.no_referencia,
          this.monderoElect.cuenta,
          this.monderoElect.clabe_inter,
          this.monderoElect.titularCuenta,
          this.monderoElect.cuenta_contable,
          this.monderoElect.moneda,
          this.monderoElect.areaEgresos,
          this.monderoElect.areaIngresos,
          this.monderoElect.areaValHumano,
          this.listMediosOperacionNew,
          this.listMediosOperacionRegistrados.filter((med:any) => med.proceso_eliminacion),
          this.monderoElect.token_responsable,
          this.monderoElect.token_cuentaBanc,
          this.monderoElect.token_caja,
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
              this.listMediosOperacionNew = [];
              this.listaMonederosElect();
              this.functViewMonderoElectronico(this.tokenCuentaMonederoRegistrado);
              this.verFormDetListMonedero = true;
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

  functDeleteMnderoElctronico(token_cuentaMon:any){
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
              this.listaMonederosElect();
              this.listarMonederosElectDelete();
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

  openListMonederosElectDelete(){
    this.verlistaMonElectronicoDeleted = true;
  }

  listarMonederosElectDelete(){
    this.monedero.catalogoMonederosElectDelete().subscribe(
      response =>{
        if (response.status == 'success') {
          this.listMonederoElectDel = response.monedero;
          for (let i = 0; i < response.monedero.length; i++) {
            var cuuentaCifrado = this.encryptor.sencible_decript(response.monedero[i]["cuenta_backend"]);
            this.listMonederoElectDel[i]["cuenta_frontend"] = cuuentaCifrado.replace(cuuentaCifrado.substring(cuuentaCifrado.length-4,0),'**** **** **** ');
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  functRestauraMonedElectronico(token_cuentaMon:any){
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
              this.listaMonederosElect();
              this.listarMonederosElectDelete();
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

  functDeletPermMndroElectronico(token_cuentaMon:any){
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
                this.listaMonederosElect();
                this.listarMonederosElectDelete();
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
