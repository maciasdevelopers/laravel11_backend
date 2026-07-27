import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { ServEncryptService } from '../../../../../servicios/ssic/serv-encrypt.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import numeral from 'numeral';
import { NgxFileDropEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { MovimientosDineroService } from '../../../../../servicios/ssic/movimientos-dinero.service';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { Table } from 'primeng/table';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-movimientos-cuentas-propias',
  standalone: false,
  templateUrl: './movimientos-cuentas-propias.component.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/sat_web_page.css',
    '../../../../../styles/contraccion.css',
    '../../../../../styles/navegador.css',
    '../../finanzas.css',
    './movimientos-cuentas-propias.component.css']
})
export class MovimientosCuentasPropiasComponent implements OnInit, OnDestroy {
  search_movimientos_registrados:any = [];
  list_movimientos_registrados:any = [];
  indicador_mov_cp:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoMovCP: Date[] | undefined;

  movimientos_registradosDetalleData:any = [];

  search_movimientos_cancelados:any = [];
  list_movimientos_cancelados:any = [];

  listaCajasRegistradas:any = [];
  arrayCuentBanc:any = [];
  listMonederoElectro:any = [];
  catalogo_monedas_api:any = [];
  catalogo_monedas_filtro_busqueda:any;

  public movimiento_origen_tipo:string = "";
  public movimiento_origen_token:string = "";
  seleccionado_origen:any = [];
  public movimiento_fecha_contabilizacion:string = "";
  public movimiento_concepto:string = "";
  
  public movimiento_destino_tipo:string = "";
  public movimiento_destino_token:string = "";
  seleccionado_destino:any = [];

  public movimiento_monto:string = "";
  public movimiento_moneda_code: string = '';
  public movimiento_moneda_decimales: number = 2;
  public movimiento_tipo_cambio: string = '1.00';
  public movimiento_monto_resultante:string = "";
  public movimiento_observaciones: string = '';
  opcionesAgrupadas: any[] = [];
  public anexosMovimFiles: NgxFileDropEntry[] = [];
  public anexosMovimDocs:any [] = [];
  public anexosMovimNames:any = [];
  public movimiento_vista:boolean = true;
  @ViewChild('movRegList') movRegTable!: Table;
  @ViewChild('cancelMovList') cancelMovTable!: Table;

  public cancelacion_movimiento_window:boolean = false;
  public cancelacion_movimiento_form:boolean = true;
  public cancelacion_movimiento_folio:string = "";
  public cancelacion_movimiento_token:string = "";
  public cancelacion_movimiento_fecha_contabilizacion:string = "";
  public cancelacion_movimiento_observaciones:string = "";

  private destruir$ = new Subject<void>();

  constructor( 
    private cajaServ:CajaServService,
    private cuentaBan:CuentbancService,
    private encryptor:ServEncryptService,
    private monedero:MonederoElectService,
    private _monedasServ: MonedasService,
    private translate: TranslateService,
    private movimDinero:MovimientosDineroService,
    private servXlsx:DescargaExcel,
    private validator:ValidatorServService,
    private cd: ChangeDetectorRef
  ){
  }

  ngOnInit(): void {
    this.ver_movimientos_registrados('hoy');
    this.listando_movimientos_cancelados();
    this.listadoCajas();
    this.listaCuentasBancariaTRUE();
    this.listarMonederosElect();
    this.monedasCatalogoApi();
    this.agrupandoFuncion();
    this.search_movimientos_registrados = [
      'movimiento_cp_folio',
      'movimiento_cp_fecha_contabilizacion',
      'origen_catalogo_folio',
      'origen_catalogo_name',
      'destino_catalogo_folio',
      'destino_catalogo_name',
      'movimiento_monto',
      'movimiento_moneda',
      'movimiento_tipo_cambio',
      'movimiento_cp_observaciones',
      'utilizado',
      'movimiento_cp_cancelado',
      'movimiento_cp_token'
    ]; 
    this.search_movimientos_cancelados = [
      'movimiento_cp_folio',
      'movimiento_cp_fecha_contabilizacion',
      'origen_catalogo_folio',
      'origen_catalogo_name',
      'destino_catalogo_folio',
      'destino_catalogo_name',
			'movimiento_monto',
			'movimiento_moneda',
			'movimiento_tipo_cambio',
			'movimiento_cp_observaciones'
    ];
  }

//movimientos
  listando_movimientos_registrados() {
    this.ver_movimientos_registrados(this.indicador_mov_cp);
  }

  ver_movimientos_registrados(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_mov_cp = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    
    if (filtro == 'otras_fechas') {
      var mov_cp_otras_fechas = document.getElementById("mov_cp_otras_fechas");
      if (this.rangoPeriodoMovCP && this.rangoPeriodoMovCP.length === 2) {
        const dateInicio = this.rangoPeriodoMovCP[0];
        const dateFin = this.rangoPeriodoMovCP[1];
        if (dateInicio && dateFin) {            
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(mov_cp_otras_fechas);
          } else {
            this.validator.errorInputRow(mov_cp_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(mov_cp_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(mov_cp_otras_fechas);
        return;
      }
    }
  
    this.movimDinero.catalogoMovimientoCuentasPropias(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaEXTPRVList(response),
      error: (err) => this.manejarErrorEXTPRVList(err)
    });
  }
  
  private procesarRespuestaEXTPRVList(response: any) {
    if (response.status === 'success') {
      this.list_movimientos_registrados = response.movimientos;
      console.log(this.list_movimientos_registrados);
      this.cd.detectChanges();
    } else {
      this.list_movimientos_registrados = [];
    }
  }

  private manejarErrorEXTPRVList(error: any) {
    console.error('Error al cargar la lista de proveedores:', error);
    this.list_movimientos_registrados = [];
  }
  
  descarga_excel_movimientos_registrados(){
    const columnas:ExcelColumnas[] = [
      {label: "folio", field: "movimiento_cp_folio", align: "center"},
      {label: this.translate.instant("fecha_cont"), field: "movimiento_cp_fecha_contabilizacion", align: "left"},
      {label: "Origen", field: "origen_catalogo_complete", align: "center"},
      {label: "Destino", field: "destino_catalogo_complete", align: "left"},
      {label: this.translate.instant("total_import"), field: "movimiento_monto", align: "right"},
      {label: this.translate.instant("mon_name"), field: "movimiento_moneda", align: "left"},
      {label: this.translate.instant("mon_tipo_cambio"), field: "movimiento_tipo_cambio", align: "right"},
      {label: this.translate.instant("observ"), field: "movimiento_cp_observaciones", align: "left"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.list_movimientos_registrados,columnas,'movimientos registrados','movimientos registrados.xlsx');
  }

  cancel_fecha_contabilizacion_mcp(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.cancelacion_movimiento_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cancelacion_movimiento_fecha_contabilizacion);
  }

  keyupObservacionCancelacion_mcp(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cancelacion_movimiento_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  movimientoCuentasPropiasCancelStart(mcp:any){
    this.cancelacion_movimiento_window = true;
    this.cancelacion_movimiento_token = mcp.movimiento_cp_token;
    this.cancelacion_movimiento_folio = mcp.movimiento_cp_folio;
  }

  get validaRegSoliCancelMCP():Boolean{
    const OKFechaCont = this.cancelacion_movimiento_fecha_contabilizacion != "" && this.validator.filtroFecha(this.cancelacion_movimiento_fecha_contabilizacion);
    const OKObservaciones = this.cancelacion_movimiento_observaciones != '' && this.validator.filtroAlfaNumerico(this.cancelacion_movimiento_observaciones);

    return this.cancelacion_movimiento_token != '' && OKFechaCont && OKObservaciones;
  }

  catalogoMovimientoCuentasPropiasCancelar(form: { reset: () => void; }){
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
        this.cancelacion_movimiento_form = false;
        this.movimDinero.catalogoMovimientoCuentasPropiasCancelar(this.cancelacion_movimiento_token,this.cancelacion_movimiento_fecha_contabilizacion,this.cancelacion_movimiento_observaciones).subscribe(
          response => {
            console.log(response);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              form.reset();
              this.cancelacion_movimiento_form = true;
              this.cancelacion_movimiento_window = false;
              this.listando_movimientos_registrados();
              this.listando_movimientos_cancelados();
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

  listando_movimientos_cancelados(){
    this.movimDinero.catalogoMovimientosCanceladosCuentasPropias().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.list_movimientos_cancelados = response.movimientos;
          console.log(this.list_movimientos_cancelados);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  descarga_excel_movimientos_cancelados(){
    const columnas:ExcelColumnas[] = [
      {label: "folio", field: "movimiento_cp_folio", align: "center"},
      {label: this.translate.instant("fecha_cont"), field: "movimiento_cp_fecha_contabilizacion", align: "left"},
      {label: "Origen", field: "origen_catalogo_complete", align: "center"},
      {label: "Destino", field: "destino_catalogo_complete", align: "left"},
      {label: this.translate.instant("total_import"), field: "movimiento_monto", align: "right"},
      {label: this.translate.instant("mon_name"), field: "movimiento_moneda", align: "left"},
      {label: this.translate.instant("mon_tipo_cambio"), field: "movimiento_tipo_cambio", align: "right"},
      {label: this.translate.instant("observ"), field: "movimiento_cp_observaciones", align: "left"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.list_movimientos_cancelados,columnas,'movimientos cancelados','movimientos cancelados.xlsx');
  }

//registro
  listadoCajas(){
    this.cajaServ.verListaCajas('all_partidas','','').subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.listaCajasRegistradas = response.caja;
          console.log(this.listaCajasRegistradas);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  listaCuentasBancariaTRUE(){
    this.cuentaBan.catCuentasBancariasCompras('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.arrayCuentBanc = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listarMonederosElect(){
    this.monedero.catalogoMonederosElect('all_partidas','','').subscribe(
      response =>{
        console.log(response)
        if (response.status == 'success') {
          this.listMonederoElectro = response.monedero;
          console.log(this.listMonederoElectro);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedasCatalogoApi() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          this.catalogo_monedas_filtro_busqueda = response.monedas.map((item:any) => ({searchField: `${item.code} ${item.langEN}`}));
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  agrupandoFuncion(){
    this.opcionesAgrupadas = [
      ...this.listaCajasRegistradas.map((c: any) => ({
        label: `🟤 Caja: ${c.caja_alias}`,
        value: { tipo: 'caja', data: c }
      })),
      ...this.arrayCuentBanc.map((b: any) => ({
        label: `🏦 Banco: ${b.cuenta_bancaria}`,
        value: { tipo: 'banco', data: b }
      })),
      ...this.listMonederoElectro.map((m: any) => ({
        label: `💳 Monedero: ${m.cuenta_monedero}`,
        value: { tipo: 'monedero', data: m }
      }))
    ];

    console.log(this.opcionesAgrupadas);
  }

  onpresNumer(e:KeyboardEvent){
    this.validator.key_press_numbers(e);
  }

  movim_nuevo_registro_origen(event:any){
    var p_drop_origen = document.getElementById("p_drop_origen");
    //console.log(this.seleccionados);
    const row = event.value;
    const registro = row.value;
    //console.log(row.value);
    //console.log(registro.tipo);
    const validacion = registro.tipo != '' && this.validator.filtroAlfaNumerico(registro.tipo);
    this.movimiento_origen_tipo = validacion ? registro.tipo : '';
    validacion ? this.validator.correctoInputRow(p_drop_origen) : this.validator.errorInputRow(p_drop_origen);
    if (validacion) {
      const data = registro.data;
      switch (registro.tipo) {
        case 'caja':
          this.movimiento_origen_token = data.token_caja; 
          break;
        case 'banco':
          this.movimiento_origen_token = data.token_cuenta; 
          break;
        case 'monedero':
          this.movimiento_origen_token = data.token_cuentaMon; 
          break;
        default:
          this.movimiento_origen_token = "";
          break;
      }
    }
    console.log(this.movimiento_origen_tipo+" "+this.movimiento_origen_token);
  }

  movim_nuevo_registro_fecha_contabilizacion(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.movimiento_fecha_contabilizacion = validacion ? event.value : '';
    console.log(this.movimiento_fecha_contabilizacion);
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  movim_nuevo_registro_concepto(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.movimiento_concepto = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  movim_nuevo_registro_destino(event:any){
    var p_drop_destino = document.getElementById("p_drop_destino");
    //console.log(this.seleccionados);
    const row = event.value;
    const registro = row.value;
    //console.log(row.value);
    //console.log(registro.tipo);
    const validacion = registro.tipo != '' && this.validator.filtroAlfaNumerico(registro.tipo);
    this.movimiento_destino_tipo = validacion ? registro.tipo : '';
    validacion ? this.validator.correctoInputRow(p_drop_destino) : this.validator.errorInputRow(p_drop_destino);
    if (validacion) {
      const data = registro.data;
      switch (registro.tipo) {
        case 'caja':
          this.movimiento_destino_token = data.token_caja; 
          break;
        case 'banco':
          this.movimiento_destino_token = data.token_cuenta; 
          break;
        case 'monedero':
          this.movimiento_destino_token = data.token_cuentaMon; 
          break;
        default:
          this.movimiento_destino_token = "";
          break;
      }
    }
    validacion && this.movimiento_destino_token != this.movimiento_origen_token ? this.validator.correctoInputRow(p_drop_destino) : this.validator.errorInputRow(p_drop_destino);
    if (this.movimiento_destino_token == this.movimiento_origen_token) {
      this.movimiento_destino_token = "";
    }
    //token_caja
    //token_cuenta
    //token_cuentaMon
    console.log(this.movimiento_destino_tipo+" "+this.movimiento_destino_token);
  }

  movim_nuevo_registro_monto(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.movimiento_monto = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  movim_nuevo_registro_moneda(opcion:any){
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.movimiento_moneda_code = typeof mnd !== 'undefined' ? mnd.code : '';
    this.movimiento_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    this.movimiento_tipo_cambio = typeof mnd !== 'undefined' && mnd.code == "MXN" ? "1.00" : "";
    typeof mnd !== 'undefined'  ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  activaTipoCambio(){
    return (this.movimiento_moneda_code == "MXN");
  }

  movim_nuevo_registro_tipo_cambio(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.movimiento_tipo_cambio = validacion ? event.value : "1.00";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calcula_resultante_monto(){
    if (this.movimiento_moneda_code == "MXN") {
      var resultando = parseFloat(this.movimiento_monto) * 1;
      this.movimiento_monto_resultante = numeral(resultando).format('$0,0.'+'0'.repeat(this.movimiento_moneda_decimales));
    } else {
      //var resultando = parseFloat(this.reem_importe_total) / parseFloat(this.reem_tipo_cambio);
      var resultando = parseFloat(this.movimiento_monto) * parseFloat(this.movimiento_tipo_cambio);
      this.movimiento_monto_resultante = numeral(resultando).format('$0,0.'+'0'.repeat(this.movimiento_moneda_decimales));
    }
    return this.movimiento_monto_resultante
  }

  keyupObservacionesMovim(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.movimiento_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedMovimfiles(files: NgxFileDropEntry[]) {
    this.anexosMovimFiles = files;
    this.anexosMovimNames = [];
    this.anexosMovimDocs = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.anexosMovimDocs.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement+" "+nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.anexosMovimNames.push({"typoElement":typoElement,"nameFile":nameFile});
            if (this.anexosMovimDocs.length > 0) {
              for (let j = 0; j < this.anexosMovimDocs.length; j++) {
                const row = this.anexosMovimDocs[j];
                if (row["name"] != nameFile) {
                  this.anexosMovimDocs.push(file);
                }
              }
            } else {
              this.anexosMovimDocs.push(file);
            }
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El event.value '+nameFile+' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo '+nameFile+' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton:false,
              timer: 3000
            })
            this.anexosMovimFiles.splice(i,1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.anexosMovimDocs.length);
  }

  public fileOverMovim(event:any){
    console.log(event);
  }

  public fileLeaveMovim(event:any){
    console.log(event);
  }

  deleteAnexosMovim(posicion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionedo?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.anexosMovimFiles.splice(posicion,1);
          this.anexosMovimDocs.splice(posicion,1);
          this.anexosMovimNames.splice(posicion,1);
          console.log(this.anexosMovimDocs.length);
        }
      }
    );
  }

  get habilitaBtnRegistro():Boolean{ 
    const origen = this.movimiento_origen_tipo != "" && this.validator.filtroAlfaNumerico(this.movimiento_origen_tipo) && this.movimiento_origen_token != "";
    const fecha_cont = this.movimiento_fecha_contabilizacion != "" && this.validator.filtroFecha(this.movimiento_fecha_contabilizacion);
    const concepto = this.movimiento_concepto != '' && this.validator.filtroAlfaNumerico(this.movimiento_concepto);
    const destino = this.movimiento_destino_tipo != "" && this.validator.filtroAlfaNumerico(this.movimiento_destino_tipo) && this.movimiento_destino_token != "" && this.movimiento_destino_token != this.movimiento_origen_token;
    const monto = this.movimiento_monto != '' && this.validator.filtroNum(this.movimiento_monto);
    const mnd = this.movimiento_moneda_code != "" && this.movimiento_moneda_decimales > 0;
    const tipo_cambio = this.movimiento_tipo_cambio != '' && this.validator.filtroNum(this.movimiento_tipo_cambio);
    const observaciones = this.movimiento_observaciones != "" && this.validator.filtroAlfaNumerico(this.movimiento_observaciones) && this.movimiento_observaciones.length >= 4;
    return origen && fecha_cont && concepto && destino && monto && mnd && tipo_cambio && observaciones;
  }

  limpia_datos_registro(){ 
    this.seleccionado_origen = [];
    this.movimiento_origen_tipo = "";
    this.movimiento_origen_token = "";
    this.movimiento_fecha_contabilizacion = "";
    this.movimiento_concepto = "";

    this.seleccionado_destino = [];
    this.movimiento_destino_tipo = "";
    this.movimiento_destino_token = "";
    
    this.movimiento_monto = "";
    this.movimiento_moneda_code = "";
    this.movimiento_tipo_cambio = "";
    this.movimiento_observaciones = "";
    this.anexosMovimFiles = [];
    this.anexosMovimDocs = [];
    this.anexosMovimNames = [];
  }

  registraMovimientoPropio(){
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
        this.movimiento_vista = false;
        this.movimDinero.registraMovimientoCuentasPropias(
          this.movimiento_origen_tipo,
          this.movimiento_origen_token,
          this.movimiento_fecha_contabilizacion,
          this.movimiento_concepto,
          this.movimiento_destino_tipo,
          this.movimiento_destino_token,
          this.movimiento_monto,
          this.movimiento_moneda_code,
          this.movimiento_tipo_cambio,
          this.movimiento_observaciones,
          this.anexosMovimDocs
        ).subscribe(
          response => {
            console.log(response);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              this.listando_movimientos_registrados();
              this.listando_movimientos_cancelados();
              this.limpia_datos_registro();
              this.movimiento_vista = true;
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
          error => {console.log(error);}
        );
      }
    })
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}