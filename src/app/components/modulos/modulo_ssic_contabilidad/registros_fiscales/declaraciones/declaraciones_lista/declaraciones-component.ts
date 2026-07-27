import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeclaracionesService } from '../../../../../../servicios/ssic/declaraciones-service';
import Swal from 'sweetalert2';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { declaracionesModelo } from '../../../../../../modelos/declaraciones/declaracionesModelo';
import { declaracionPagarModelo } from '../../../../../../modelos/declaraciones/declaracionPagarModelo';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ImpuestosServService } from '../../../../../../servicios/ssic/impuestos-serv.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'app-declaraciones-component',
  standalone: false,
  templateUrl: './declaraciones-component.html',
  styleUrls: [
    '../../../../../../styles/loading.css',
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
    '../../../../../../styles/switches.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/explain.css',
    '../../../contabilidad.css',
    './declaraciones-component.css'
  ],
})
export class DeclaracionesListaComponent implements OnInit{
  public identidad: any;
  public modelDeclaraciones: declaracionesModelo;
  public modelDeclaracionPagar: declaracionPagarModelo;
  public declaracion_ver_form_reg:boolean = false;
  listaDeclaracionesRegistradas:any = [];
  indicadorDeclaraciones:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoDeclaraciones: Date[] | undefined;
  searchDeclaGeneral:any = [];
  
  public ver_ventana_declaracion_detalle:boolean = false;
  public ver_info_declaracion_detalle:boolean = false;
  public decfed_detalle_folio:string = "";
  detalleDeclaracionImpFed:any = [];
  min_ejercicio:any = null;
  max_ejercicio:any = null;
  tipos_declaracion:any = [];
  tipos_periodicidad:any = [];
  medios_presentacion:any = [];
  infoDecForm: FormGroup;

  public ver_decfed_seguimiento_pagos:boolean = false;
  decfed_seguimiento_pagos:any = [];
  decfed_pagos_historial:any = [];
  searchPagoGeneral:any = [];
  search_pagos_done:any = [];

  public imagenEvidenciaXml: any;
  public imagenEvidenciaPdf: any;
  impuestos_list_declaracion:any = [];
  public impuesto_selected:any = null;
  public DeclaracionAnexosNames:any = [];
  public docsDeclaracionAnexos:any [] = [];
  public filesDeclaracion: NgxFileDropEntry[] = [];

  public ver_ventana_declaraciones_deleted:boolean = false;
  listaDeclaracionesEliminadas:any = [];
  constructor(
    private fb: FormBuilder,
    private decla_serv:DeclaracionesService,
    private sentinela: SentinelArkManager,
    public validator:ValidatorServService,
    private _catImp: ImpuestosServService,
    private translate:TranslateService,
    private cd: ChangeDetectorRef,
    private relInterna: ComunicacionInternaService,
  ){
    this.identidad = this.sentinela.getIdentifUsuario();
    this.modelDeclaraciones = new declaracionesModelo('','','','','','','','','','0','','','MXN',2,[],[],'',[]);
    this.modelDeclaracionPagar = new declaracionPagarModelo('','',0,0,0,0,0,0,0);
    this.infoDecForm = this.fb.group({
      tipo_declaracion: [null],
      periodicidad: [null],
      ejercicio: [this.modelDeclaraciones.ejercicio || null],
      periodo: [null],
      medio_presentacion: [null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaNominaRegistro();
    this.verDeclaraciones('hoy');

    this.searchDeclaGeneral = ['declaracion_folio','declaracion_fecha_contabilizacion','declaracion_tipo','declaracion_periodicidad',
      'declaracion_ejercicio','declaracion_periodo_inicio','declaracion_fecha_presentacion','declaracion_medio_presentacion',
      'declaracion_fecha_vencimiento','declaracion_version','declaracion_numero_operacion','declaracion_linea_de_captura',
      'declaracion_moneda','declaracion_observaciones','impuesto_a_cargo','recargos','cantidad_a_cargo','cantidad_a_pagar',
      'dec_pago','dec_saldo','dec_ord_pago_folio'];
      
    this.searchPagoGeneral = ['folio_ordenPago','fecha_contabilizacion_orden_pago','factura_relacionada_string','orden_bloqueada','fecha_contabilizacion_doc_anterior','orden_emisor_personal_folio','orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial','orden_emisor_emp','autorizacion_pay_text','fecha_autorizacion_pay','pago_anticipado','status_pago','status_pago_date','pago_realizado_folio','pago_realizado_fecha_contabilizacion',
      'pago_realizado_proveedor_name','pago_realizado_acreedor_name','pago_realizado_forma_pago_vinculada','pago_realizado_forma_metodo_pago_cfdi','pago_realizado_monto','pago_realizado_tipo_cambio','pago_realizado_observaciones',
      'importe_total_inicial','importe_autorizado_inicial_format','importe_autorizado_final','debe_format'];

    this.search_pagos_done = ['token_pagos','folio_pagos','fecha_contabilizacion','pago_cancelado',	'pago_folio_cancelacion','pago_fecha_cancelacion','pago_fecha_contabilizacion_cancelacion','monto_pago',
      'monto_pago_format','monto_pago_resultant','observacionesPago','tipo_cambio','tipo_cambio_format','p_moneda','forma_pago_pago','forma_metodo_pago_cfdi','destino','tercero_token','tercero_folio','tercero_name',
      'tercero_comercial_name','financeadoa_token','financeadoa_folio','financeadoa_name','financeadoa_comercial_name','concepto','personal_pago_token','personal_pago_folio','personal_pago_name','pago_autorizado',
      'fecha_pago_auth','personal_autoriza_token','personal_autoriza_folio','personal_autoriza_name','ordenes_relacionadas_lista','orden_factura_relacionada_typo','orden_factura_relacionada_token',
      'orden_factura_relacionada_string','desglose_pagos_medio','medio_pago_vinculado','doc_anterior_folio','doc_anterior_fecha_contabilizacion'];
  }

  getRespuestaNominaRegistro() {
    this.relInterna.mensajeContDeclaracionesRegistro$.subscribe(
      (mensaje: any) => {
        if (mensaje == "declaracion_registrada") {
          this.verDeclaraciones('hoy');
        }
      }
    );
  }

  catalogoImpuestosDeclaracion(){
    this._catImp.catalogoImpuestosTrueDeclaracion().subscribe(
      response => {
        if (response.status == 'success') {
          this.impuestos_list_declaracion = response.impuestos;
          console.log(this.impuestos_list_declaracion);
        }
      }, 
      error => {
        console.log(error);
      }
    );
  }

  declaracionVerFormReg(){  
    this.declaracion_ver_form_reg = true;
  }

  listadoDeclaraciones() {
    this.verDeclaraciones(this.indicadorDeclaraciones);
  }

  verDeclaraciones(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDeclaraciones = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var acree_gral_otras_fechas = document.getElementById("acree_gral_otras_fechas");
      if (this.rangoPeriodoDeclaraciones && this.rangoPeriodoDeclaraciones[1]) {
        const dateInicio = this.rangoPeriodoDeclaraciones[0];
        const dateFin = this.rangoPeriodoDeclaraciones[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(acree_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(acree_gral_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(acree_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(acree_gral_otras_fechas);
      }
    }

    this.decla_serv.catDeclaracionesMain(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaAcree(response),
      error: (err) => this.manejarErrorAcree(err)
    });
  }

  private procesarRespuestaAcree(response: any) {
    if (response.status === 'success') {
      console.log(response);
      this.listaDeclaracionesRegistradas = response.declaraciones;
      this.cd.detectChanges();
    } else {
      this.listaDeclaracionesRegistradas = [];
    }
  }

  private manejarErrorAcree(error: any) {
    console.error('Error al cargar declaraciones:', error);
    this.listaDeclaracionesRegistradas = [];
  }

  descarga_excel_declaraciones(){}

  desgloseDeclaracion(declaracion_token:string){
    this.modelDeclaraciones = new declaracionesModelo('','','','','','','','','','0','','','MXN',2,[],[],'',[]);
    this.detalleDeclaracionImpFed = [];
    this.decfed_detalle_folio = "";
    this.decla_serv.detalleDeclaracionImpFed(declaracion_token).subscribe(
      response =>{
        console.log(response);
        if (response.status == 'success') {
          if (this.impuestos_list_declaracion.length === 0) {
            this.catalogoImpuestosDeclaracion();
          }

          if (this.tipos_declaracion.length === 0) {
            this.tipos_declaracion = [
              {valor: 'normal', tipo: 'Normal'},
              {valor: 'comple', tipo: 'Complementaria'}
            ];
          }

          if (this.tipos_periodicidad.length === 0) {
            this.tipos_periodicidad = [
              {periodicidad:'semanal'},
              {periodicidad:'catorcenal'},
              {periodicidad:'quincenal'},
              {periodicidad:'mensual'},
              {periodicidad:'bimestral'},
              {periodicidad:'trimestral'},
              {periodicidad:'cuatrimestral'},
              {periodicidad:'semestral'},
              {periodicidad:'anual'}
            ];
          }

          if (this.medios_presentacion.length === 0) {
            this.medios_presentacion = [
              {valor: 'internet', medio: 'Internet'},
              {valor: 'ventanilla', medio: 'Ventanilla'}
            ];
          }

          this.detalleDeclaracionImpFed = response.declaracion;
          this.detalleDeclaracionImpFed.forEach((dec_row:any) => {
            this.decfed_detalle_folio = dec_row.declaracion_folio;
            this.modelDeclaraciones.fecha_contabilizacion = dec_row.declaracion_fecha_contabilizacion;
            this.modelDeclaraciones.tipo_declaracion = dec_row.declaracion_tipo;
            this.modelDeclaraciones.periodicidad = dec_row.declaracion_periodicidad;
            this.modelDeclaraciones.ejercicio = dec_row.declaracion_ejercicio;
            this.modelDeclaraciones.periodo_inicio = dec_row.declaracion_periodo_inicio;
            this.modelDeclaraciones.periodo_fin = dec_row.declaracion_periodo_fin;
            this.modelDeclaraciones.fecha_presentacion = dec_row.declaracion_fecha_presentacion;
            this.modelDeclaraciones.medio_presentacion = dec_row.declaracion_medio_presentacion;
            this.modelDeclaraciones.fecha_vencimiento = dec_row.declaracion_fecha_vencimiento;
            this.modelDeclaraciones.version = dec_row.declaracion_version;
            this.modelDeclaraciones.numero_operacion = dec_row.declaracion_numero_operacion;
            this.modelDeclaraciones.linea_de_captura = dec_row.declaracion_linea_de_captura;
            this.modelDeclaraciones.declaraciones_lista_registrada = dec_row.desglose_dec;
            this.modelDeclaraciones.observaciones = dec_row.declaracion_observaciones;
            this.modelDeclaraciones.anexos_registrados = dec_row.decAnexos;
            
            this.infoDecForm.patchValue({periodicidad: dec_row.declaracion_periodicidad});
          });
          
          this.pathEjerPeriodoDeclaracion();
          this.pathTipoDeclaracion();
          this.pathMediosPresentacion();

          //console.log(response);
          this.ver_ventana_declaracion_detalle = true;
          this.ver_info_declaracion_detalle = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  pathTipoDeclaracion(){
    const tdec = this.tipos_declaracion.find((row:any) => row.valor === this.modelDeclaraciones.tipo_declaracion);
    this.infoDecForm.patchValue({tipo_declaracion: tdec.tipo});
  }

  pathEjerPeriodoDeclaracion(){
    const dec_ejercicio = this.modelDeclaraciones.ejercicio.toString();
    this.infoDecForm.patchValue({ejercicio: dec_ejercicio});

    const anioInt = parseInt(dec_ejercicio);
    this.min_ejercicio = new Date(anioInt, 0, 1);
    this.max_ejercicio = new Date(anioInt, 11, 31);

    const [y_ini,m_ini,d_ini] = this.modelDeclaraciones.periodo_inicio.toString().split('-').map(Number);
    const mes_periodo_inicio = new Date(y_ini, m_ini - 1, d_ini);

    const [y_fin,m_fin,d_fin] = this.modelDeclaraciones.periodo_fin.toString().split('-').map(Number);
    const mes_periodo_fin = new Date(y_fin, m_fin - 1, d_fin);

    const ultimo_dia_mes = new Date(y_fin, m_fin, 0).getDate();
    mes_periodo_fin.setDate(ultimo_dia_mes);

    console.log("Inicio:", mes_periodo_inicio, "Fin:", mes_periodo_fin);
    this.infoDecForm.patchValue({periodo: [mes_periodo_inicio, mes_periodo_fin]});
    console.log(this.infoDecForm.get('periodo')?.value);
  }

  pathMediosPresentacion(){
    let med_present = this.medios_presentacion.find((row:any) => row.valor === this.modelDeclaraciones.medio_presentacion);
    this.infoDecForm.patchValue({medio_presentacion: med_present.medio});
  }

  /* ================= CALCULOS ================= */
  get calculo_registrado_importe_a_favor() {
    const importe_a_favor = this.modelDeclaraciones.declaraciones_lista_registrada.reduce((desp: any, item: any) => desp + Number(item.importe_a_favor || 0), 0);
    return this.formatNumber(importe_a_favor);
  }

  get calculo_registrado_total_a_cargo() {
    const total_a_cargo = this.modelDeclaraciones.declaraciones_lista_registrada.reduce((desp: any, item: any) => desp + Number(item.a_cargo || 0), 0);
    return this.formatNumber(total_a_cargo);
  }

  get calculo_registrado_total_actualizaciones() {
    const total_actualizaciones = this.modelDeclaraciones.declaraciones_lista_registrada.reduce((desp: any, item: any) => desp + Number(item.actualizaciones || 0), 0);
    return this.formatNumber(total_actualizaciones);
  }

  get calculo_registrado_total_recargos() {
    const total_recargos = this.modelDeclaraciones.declaraciones_lista_registrada.reduce((desp: any, item: any) => desp + Number(item.recargos || 0), 0);
    return this.formatNumber(total_recargos);
  }

  get calculo_registrado_total_otros_cargos() {
    const total_otros_cargos = this.modelDeclaraciones.declaraciones_lista_registrada.reduce((desp: any, item: any) => desp + Number(item.otros_cargos || 0), 0);
    return this.formatNumber(total_otros_cargos);
  }

  get calculo_registrado_total_otros_abonos() {
    const total_otros_abonos = this.modelDeclaraciones.declaraciones_lista_registrada.reduce((desp: any, item: any) => desp + Number(item.otros_abonos || 0), 0);
    return this.formatNumber(total_otros_abonos);
  }

  get calculo_registrado_total_cantidad_a_pagar() {
    const total_cantidad_a_pagar = this.modelDeclaraciones.declaraciones_lista_registrada.reduce((desp: any, item: any) => desp + Number(item.cantidad_a_pagar || 0), 0);
    return this.formatNumber(total_cantidad_a_pagar);
  }

  formatNumber(v: number | undefined): string {
    const n = Number(v || 0);
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }

  roundToCents(n: number): number {
    console.log(n);
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  select_fecha_contabilizacion(event:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    this.modelDeclaraciones.fecha_contabilizacion = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.fecha_contabilizacion != dec_det.declaracion_fecha_contabilizacion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTipoDeclaracion(opcion:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    //console.log(opcion);
    var declaTipo = document.getElementById("declaTipo");
    const tdec = this.tipos_declaracion.find((row:any) => row.tipo === opcion);
    this.modelDeclaraciones.tipo_declaracion = tdec.valor;
    const validacion = opcion.tipo != '' && typeof tdec !== 'undefined' && typeof dec_det !== 'undefined' && this.modelDeclaraciones.tipo_declaracion != dec_det.declaracion_tipo;
    validacion ? this.validator.correctoInputRow(declaTipo) : this.validator.errorInputRow(declaTipo);
  }

  changePeriodicidad(opcion:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    console.log(opcion);
    var declaPeriodicidad = document.getElementById("declaPeriodicidad");
    let nper = this.tipos_periodicidad.find((row:any) => row.periodicidad === opcion.periodicidad);
    this.modelDeclaraciones.periodicidad = nper.periodicidad;
    const validacion = opcion.periodicidad != '' && typeof nper !== 'undefined' && typeof dec_det !== 'undefined' && this.modelDeclaraciones.periodicidad != dec_det.declaracion_periodicidad;
    validacion ? this.validator.correctoSelectBrowser(declaPeriodicidad) : this.validator.errorSelectBrowser(declaPeriodicidad);
  }

  selectEjercicio(declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    var declaEjercicio = document.getElementById("declaEjercicio");
    console.log(this.infoDecForm.get('ejercicio')?.value);
    const ejercicio = this.infoDecForm.get('ejercicio')?.value.getFullYear(); 
    this.modelDeclaraciones.ejercicio = ejercicio;
    const validacion = ejercicio && this.validator.filtroNum(ejercicio) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.ejercicio != dec_det.declaracion_ejercicio;
    validacion ? this.validator.correctoInputRow(declaEjercicio) : this.validator.errorInputRow(declaEjercicio);
    if (validacion) {
      this.min_ejercicio = new Date(parseInt(this.modelDeclaraciones.ejercicio), 0, 1);
      this.max_ejercicio = new Date(parseInt(this.modelDeclaraciones.ejercicio), 11, 31);
    }
    console.log(this.modelDeclaraciones);
  }

  selectEjercicioPeriodo(declaracion_token:string){
    const periodo = this.infoDecForm.get('periodo')?.value;
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    var declaPeriodo = document.getElementById("declaPeriodo");
    if (periodo && periodo.length === 2 && periodo[1] != null) {
      const fechaInicio = periodo[0];
      const fechaFin = periodo[1];

      const inicioDate = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
      const finDate = new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
      // Convertimos las fechas a formato yyyy-mm-dd
      const inicio = inicioDate.toISOString().split('T')[0];
      const fin = finDate.toISOString().split('T')[0];
      // Guardamos en tus variables de nómina
      this.modelDeclaraciones.periodo_inicio = inicio;
      this.modelDeclaraciones.periodo_fin = fin;

      const validacionInicio = inicio != '' && this.validator.filtroFecha(inicio) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.periodo_inicio != dec_det.declaracion_periodo_inicio;
      const validacionFin = fin != '' && this.validator.filtroFecha(fin) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.periodo_fin != dec_det.declaracion_periodo_fin;

      validacionInicio || validacionFin ? this.validator.correctoInputRow(declaPeriodo) : this.validator.errorInputRow(declaPeriodo);
    } else {
      this.validator.errorInputRow(declaPeriodo);
    }
    console.log(this.modelDeclaraciones);
  }

  select_fecha_presentacion(event:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    this.modelDeclaraciones.fecha_presentacion = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.fecha_presentacion != dec_det.declaracion_fecha_presentacion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeMedioPresentacion(opcion:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    console.log(opcion);
    var declaMedioPresent = document.getElementById("declaMedioPresent");
    let med_present = this.medios_presentacion.find((row:any) => row.valor === opcion.valor);
    this.modelDeclaraciones.medio_presentacion = med_present.valor;
    const validacion = opcion.valor != '' && typeof med_present !== 'undefined' && typeof dec_det !== 'undefined' && this.modelDeclaraciones.medio_presentacion != dec_det.declaracion_medio_presentacion;
    validacion ? this.validator.correctoSelectBrowser(declaMedioPresent) : this.validator.errorSelectBrowser(declaMedioPresent);
  }

  select_vencimiento_obligacion(event:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    this.modelDeclaraciones.fecha_vencimiento = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.fecha_vencimiento != dec_det.declaracion_fecha_vencimiento;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_version(event:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    this.modelDeclaraciones.version = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.version != dec_det.declaracion_version;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_numero_operacion(event:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    this.modelDeclaraciones.numero_operacion = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.numero_operacion != dec_det.declaracion_numero_operacion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_linea_de_captura(event:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    this.modelDeclaraciones.linea_de_captura = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof dec_det !== 'undefined' && this.modelDeclaraciones.linea_de_captura != dec_det.declaracion_linea_de_captura;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  /* ================= DESGLOSE ================= */
  delete_desglose_dec_registrado(dec_desglose_token:string){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          let dec_des = this.modelDeclaraciones.declaraciones_lista_registrada.find((row:any) => row.dec_desglose_token === dec_desglose_token);
          dec_des.proceso_eliminacion = dec_des.proceso_eliminacion ? false : true;
          console.log(this.modelDeclaraciones.declaraciones_lista_registrada);
          this.cd.detectChanges();
        }
      }
    );
  }

  changeDesgPayConcepto(token_catalogo_impuesto:any){
    console.log(token_catalogo_impuesto);
    var desgPayConcepto = document.getElementById("desgPayConcepto");
    let impList = this.impuestos_list_declaracion.find((row:any) => row.token_catalogo_impuesto === token_catalogo_impuesto);
    const validacion = token_catalogo_impuesto != '' && typeof impList !== 'undefined';
    this.modelDeclaracionPagar.concepto_de_pago_token = validacion ? impList.token_catalogo_impuesto : '';
    this.modelDeclaracionPagar.concepto_de_pago_name = validacion ? impList.folio_impuesto+' '+impList.concepto_impuesto+' ('+impList.abreviacion_impuesto+')' : '';
    validacion ? this.validator.correctoSelectBrowser(desgPayConcepto) : this.validator.errorSelectBrowser(desgPayConcepto);
  }

  keyupDesgPayImporteAFavor(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.importe_a_favor = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayACargo(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.a_cargo = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayActualizaciones(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.actualizaciones = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayRecargos(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.recargos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayOtrosCargos(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.otros_cargos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayOtrosAbonos(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.otros_abonos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get desgPayCantidadACargo(){
    const decp = this.modelDeclaracionPagar;
    let suman = Number(decp.a_cargo || 0) + Number(decp.actualizaciones || 0) + Number(decp.recargos || 0) + Number(decp.otros_cargos || 0);
    let suma_total = suman - Number(decp.otros_abonos || 0);
    decp.cantidad_a_cargo = suma_total;
    return suma_total;
  }

  get validaDesglose(): Boolean {
    let impList = this.impuestos_list_declaracion.find((row:any) => row.token_catalogo_impuesto === this.modelDeclaracionPagar.concepto_de_pago_token);
    const validaConcepto = this.modelDeclaracionPagar.concepto_de_pago_token != '' && typeof impList !== 'undefined';
    const validaImporteAFavor = this.modelDeclaracionPagar.importe_a_favor >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.importe_a_favor);
    const validaACargo = this.modelDeclaracionPagar.a_cargo >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.a_cargo);
    const validaRecargos = this.modelDeclaracionPagar.recargos >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.recargos);
    const validaCantidadACargo = this.modelDeclaracionPagar.cantidad_a_cargo >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.cantidad_a_cargo);
    return validaConcepto && validaACargo && validaCantidadACargo;
  }

  addImpuestosDeclarar(){
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
        this.modelDeclaraciones.declaraciones_lista_pagar.push({
          "concepto_pago_token": this.modelDeclaracionPagar.concepto_de_pago_token,
          "concepto_pago_name": this.modelDeclaracionPagar.concepto_de_pago_name,
          "importe_a_favor": parseInt(this.modelDeclaracionPagar.importe_a_favor.toString()),
          "a_cargo": parseInt(this.modelDeclaracionPagar.a_cargo.toString()),
          "actualizaciones": parseInt(this.modelDeclaracionPagar.actualizaciones.toString()),
          "recargos": parseInt(this.modelDeclaracionPagar.recargos.toString()),
          "otros_cargos": parseInt(this.modelDeclaracionPagar.otros_cargos.toString()),
          "otros_abonos": parseInt(this.modelDeclaracionPagar.otros_abonos.toString()),
          "cantidad_a_pagar": parseInt(this.modelDeclaracionPagar.cantidad_a_cargo.toString()),
        });
        this.modelDeclaracionPagar = new declaracionPagarModelo('','',0,0,0,0,0,0,0);
        this.validator.limpiaInputRow(document.getElementById("desgPayConcepto"));
        this.validator.limpiaInputRow(document.getElementById("desgPayImporteAFavor"));
        this.validator.limpiaInputRow(document.getElementById("desgPayACargo"));
        this.validator.limpiaInputRow(document.getElementById("desgPayActualizaciones"));
        this.validator.limpiaInputRow(document.getElementById("desgPayRecargos"));
        this.validator.limpiaInputRow(document.getElementById("desgPayOtrosCargos"));
        this.validator.limpiaInputRow(document.getElementById("desgPayOtrosAbonos"));
        this.impuesto_selected = null;
        this.cd.detectChanges();
      }
    })
  }

  get nuevo_calculo_importe_a_favor() {
    const importe_a_favor = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.importe_a_favor || 0), 0);
    return this.formatNumber(importe_a_favor);
  }

  get nuevo_calculo_total_a_cargo() {
    const total_a_cargo = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.a_cargo || 0), 0);
    return this.formatNumber(total_a_cargo);
  }

  get nuevo_calculo_total_actualizaciones() {
    const total_actualizaciones = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.actualizaciones || 0), 0);
    return this.formatNumber(total_actualizaciones);
  }

  get nuevo_calculo_total_recargos() {
    const total_recargos = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.recargos || 0), 0);
    return this.formatNumber(total_recargos);
  }

  get nuevo_calculo_total_otros_cargos() {
    const total_otros_cargos = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.otros_cargos || 0), 0);
    return this.formatNumber(total_otros_cargos);
  }

  get nuevo_calculo_total_otros_abonos() {
    const total_otros_abonos = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.otros_abonos || 0), 0);
    return this.formatNumber(total_otros_abonos);
  }

  get nuevo_calculo_total_cantidad_a_pagar() {
    const total_cantidad_a_pagar = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.cantidad_a_pagar || 0), 0);
    return this.formatNumber(total_cantidad_a_pagar);
  }

  deleteDeclaracion_desglose(posicion:number){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.modelDeclaraciones.declaraciones_lista_pagar.splice(posicion,1);
          console.log(this.modelDeclaraciones.declaraciones_lista_pagar.length);
          this.cd.detectChanges();
        }
      }
    );
  }

  keyupObservacionDeclaracion(event:any,declaracion_token:string){
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.modelDeclaraciones.observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  delete_dec_anex_registrado(token_documento:string){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          let dec_anex = this.modelDeclaraciones.anexos_registrados.find((row:any) => row.token_documento === token_documento);
          dec_anex.eliminacion_proceso = dec_anex.eliminacion_proceso ? false : true;
          console.log(this.modelDeclaraciones.anexos_registrados);
          this.cd.detectChanges();
        }
      }
    );
  }

  public droppedDeclaracion(files: NgxFileDropEntry[]) {
    this.filesDeclaracion = files;
    this.DeclaracionAnexosNames = [];
    this.docsDeclaracionAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsDeclaracionAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement+" "+nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.DeclaracionAnexosNames.push({"typoElement":typoElement,"nameFile":nameFile});
            if (this.docsDeclaracionAnexos.length > 0) {
              for (let j = 0; j < this.docsDeclaracionAnexos.length; j++) {
                const row = this.docsDeclaracionAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsDeclaracionAnexos.push(file);
                }
              }
            } else {
              this.docsDeclaracionAnexos.push(file);
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
            this.filesDeclaracion.splice(i,1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsDeclaracionAnexos.length);
  }

  public fileOverDeclaracion(event:any){
    console.log(event);
  }

  public fileLeaveDeclaracion(event:any){
    console.log(event);
  }

  deleteAnexosDeclaracion(posicion:any){
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
          this.filesDeclaracion.splice(posicion,1);
          this.docsDeclaracionAnexos.splice(posicion,1);
          this.DeclaracionAnexosNames.splice(posicion,1);
          console.log(this.docsDeclaracionAnexos.length);
        }
      }
    );
  }

  validate_declaracion_reg(declaracion_token:string):Boolean{
    const dec_det = this.detalleDeclaracionImpFed.find((row:any) => row.declaracion_token === declaracion_token);
    if (typeof dec_det !== 'undefined') {
      const dec = this.modelDeclaraciones;
      const validaFechaCont = dec.fecha_contabilizacion != '' && this.validator.filtroFecha(dec.fecha_contabilizacion) && dec.fecha_contabilizacion != dec_det.declaracion_fecha_contabilizacion;
      
      const tdec = this.tipos_declaracion.find((row:any) => row.valor === dec.tipo_declaracion);
      const validaTipoDeclaracion = dec.tipo_declaracion != '' && typeof tdec !== 'undefined' && dec.tipo_declaracion != dec_det.declaracion_tipo;
      
      let nper = this.tipos_periodicidad.find((row:any) => row.periodicidad === dec.periodicidad);
      const validaPeriodicidad = dec.periodicidad != '' && typeof nper !== 'undefined' && dec.periodicidad != dec_det.declaracion_periodicidad;
      
      const validaEjercicio = dec.ejercicio != '' && this.validator.filtroNum(dec.ejercicio) && dec.ejercicio != dec_det.declaracion_ejercicio;
  
      const validaPeriodoInicio = dec.periodo_inicio != '' && this.validator.filtroFecha(dec.periodo_inicio) && dec.periodo_inicio != dec_det.declaracion_periodo_inicio;
      const validaPeriodoFin = dec.periodo_fin != '' && this.validator.filtroFecha(dec.periodo_fin) && dec.periodo_fin != dec_det.declaracion_periodo_fin;
      const validaFechaPresentacion = dec.fecha_presentacion != '' && this.validator.filtroFecha(dec.fecha_presentacion) && dec.fecha_presentacion != dec_det.declaracion_fecha_presentacion;
      
      let med_present = this.medios_presentacion.find((row:any) => row.valor === dec.medio_presentacion);
      const validaMedioPresentacion = dec.medio_presentacion != '' && typeof med_present !== 'undefined' && dec.medio_presentacion != dec_det.declaracion_medio_presentacion;
  
      const validaVencimientoObligacion = dec.fecha_vencimiento != '' && this.validator.filtroFecha(dec.fecha_vencimiento) && dec.fecha_vencimiento != dec_det.declaracion_fecha_vencimiento;
      const validaVersion = dec.version != '' && this.validator.filtroNum(dec.version) && dec.version != dec_det.declaracion_version;
      const validaNumeroOperacion = dec.numero_operacion != '' && this.validator.filtroNum(dec.numero_operacion) && dec.numero_operacion != dec_det.declaracion_numero_operacion;
      const validaLineaCaptura = dec.linea_de_captura != '' && this.validator.filtroAlfaNumerico(dec.linea_de_captura) && dec.linea_de_captura != dec_det.declaracion_linea_de_captura;
      const desgloseRegList = dec.declaraciones_lista_registrada.filter((desg_list:any) => desg_list.proceso_eliminacion === true);
      const validaDesgloseDelete = desgloseRegList.length > 0;
      const validaNewDesglose = dec.declaraciones_lista_pagar.length > 0;
  
      const validaObservacion = dec.observaciones != "" && this.validator.filtroAlfaNumerico(dec.observaciones) && dec.observaciones.length >= 4 && dec.observaciones != dec_det.declaracion_observaciones;
      
      const anexosRegList = dec.anexos_registrados.filter((doc_list:any) => doc_list.eliminacion_proceso === true);
      const validaAnexosListDelete = anexosRegList.length > 0;
      const validaNewAnexos = this.DeclaracionAnexosNames.length > 0; 
  
      return validaFechaCont || 
        validaTipoDeclaracion || 
        validaPeriodicidad || 
        validaEjercicio || 
        validaPeriodoInicio || 
        validaPeriodoFin || 
        validaFechaPresentacion || 
        validaMedioPresentacion || 
        validaVencimientoObligacion || 
        validaVersion || 
        validaNumeroOperacion || 
        validaLineaCaptura ||
        validaDesgloseDelete ||
        validaNewDesglose ||
        validaObservacion ||
        validaAnexosListDelete ||
        validaNewAnexos;
    } else {
      return false;
    }
  }

  declaracionUpdate(form:{reset:() => void;},declaracion_token:string):void{
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
        //this.ver_info_declaracion_detalle = false;
        this.decla_serv.actualiza_declaracion(declaracion_token,this.modelDeclaraciones,this.docsDeclaracionAnexos).subscribe(
          response => {
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
              this.desgloseDeclaracion(declaracion_token);
              this.listadoDeclaraciones();
              this.listadoDeletedDeclaraciones();
              this.ver_info_declaracion_detalle = true;
              this.modelDeclaraciones = new declaracionesModelo('','','','','','','','','','0','','','MXN',2,[],[],'',[]);
              this.DeclaracionAnexosNames = [];
              this.docsDeclaracionAnexos = [];
              this.filesDeclaracion = [];
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
        );
      }
    })
  }

  verISNSeguimientoOrdenPago(declaracion_token:any,dec_ord_pago_token:any){
    this.ver_decfed_seguimiento_pagos = true;
    this.decla_serv.declaracionImpFedSeguimientoOrdPago(declaracion_token,dec_ord_pago_token).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.listaDeclaracionesRegistradas.find((row:any) => row.declaracion_token === declaracion_token);
          this.decfed_detalle_folio = typeof rep !== 'undefined' ? rep.declaracion_folio : '';          
          this.decfed_seguimiento_pagos = response.seguimiento_orden_pago.map((lPay:any) => ({...lPay,autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth')}));
          this.decfed_pagos_historial = response.pagos_realizados;
          console.log(this.decfed_seguimiento_pagos);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteDeclaracion(declaracion_token:string){
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
        this.decla_serv.deleteDeclaracionImpFed(declaracion_token).subscribe(
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
              this.listadoDeclaraciones();
              this.listadoDeletedDeclaraciones();
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

  verVentanaDeclaracionesEliminadas(){
    this.ver_ventana_declaraciones_deleted = true;
  }

  listadoDeletedDeclaraciones(){
    this.decla_serv.catDeclaracionesDeleted().subscribe(
      response =>{
        if (response.status == 'success') {
          console.log(response);
          this.listaDeclaracionesEliminadas = response.declaraciones;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  restauraDeclaracion(declaracion_token:string){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.decla_serv.restaurarDeclaracionImpFed(declaracion_token).subscribe(
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
              this.listadoDeclaraciones();
              this.listadoDeletedDeclaraciones();
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

  eliminapermDeclaracion(declaracion_token:string){
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
        this.decla_serv.deletePermDeclaracionImpFed(declaracion_token).subscribe(
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
              this.listadoDeclaraciones();
              this.listadoDeletedDeclaraciones();
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
