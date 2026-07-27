import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DireccionesService } from '../../../../../../../servicios/ssic/direcciones.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import { ComunicacionInternaService } from '../../../../../../../servicios/comunicacion-interna.service';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { nominaImpuestoModelo } from '../../../../../../../modelos/nominas/nominaImpuestoModelo';
import { NgxFileDropEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';
import { NominaService } from '../../../../../../../servicios/ssic/nomina-service';
import { MessageService } from 'primeng/api';
import { CFDIService } from '../../../../../../../servicios/xml/cfdi.service';
import { SentinelArkManager } from '../../../../../../../servicios/sentinel-ark-manager';
import { ImssService } from '../../../../../../../servicios/ssic/imss-service';
import { SessionContextService } from '../../../../../../../servicios/session-context';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'vhum_isnomina_catalogo',
  standalone: false,

  templateUrl: './imp_sobre_nomi_catalogo.component.html',
  styleUrls: [
    '../../../../../../../styles/loading.css',
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/dropdown.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/file_input.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/landing.css',
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/explain.css',
    '../../../../../../../styles/switches.css',
    '../../../../../../../styles/navegador.css',
    '../../../../vhumano.css',
    './imp_sobre_nomi_catalogo.component.css']
})
export class IsnCatalogoComponent implements OnInit, OnDestroy {
  public identidad: any;
  public modelNominaImp: nominaImpuestoModelo;
  searchPagoGeneral: any = [];
  search_pagos_done: any = [];

  entidades_federativas: any = [];
  min_ejercicio: any = null;
  max_ejercicio: any = null;
  tipos_declaracion: any = [];

  //ISN (Impuestos sobre la nómina)
  public modal_registro_declaracion_isn: boolean = false;
  search_declaraciones_isn: any = [];

  catalogo_declaraciones_isn: any = [];
  indicador_decla_list_isn:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoDeclaListIsn: Date[] | undefined;

  public ver_isn_seguimiento_pagos: boolean = false;
  isn_seguimiento_pagos: any = [];
  isn_pagos_historial: any = [];
  public isn_detalle_folio: string = "";
  desglose_impdeclaraciones_nomina: any = [];
  isnForm: FormGroup;
  public imp_sobre_nomina_form: boolean = true;
  public ImpNominaAnexosNames: any = [];
  public docsImpNominaAnexos: any[] = [];
  public filesImpNomina: NgxFileDropEntry[] = [];
  public modal_desglose_declaracion_isn: boolean = false;
  public imagenEvidenciaXml: any;
  public imagenEvidenciaPdf: any;
  public modal_deleted_declaraciones_isn: boolean = false;
  catalogo_deleted_declaraciones_isn: any = [];

  private destruir$ = new Subject<void>();

  constructor(
    private dirServ: DireccionesService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private primeAlerts: MessageService,
    private sessionContext: SessionContextService,
    private nominaServ: NominaService,
    private cfdiServ: CFDIService,
    private sentinela: SentinelArkManager,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.modelNominaImp = new nominaImpuestoModelo('', '', '', '', '', '', '', '', '', '', '', 2, 0, 0, 0, 0, 0, 0, '0.00', 0, 0, 0, 0, 0, 0, 0, 0, '');
    this.isnForm = this.fb.group({
      estado: [this.modelNominaImp.estado_entidad || null],
      ejercicio: [null],
      periodo: [null],
      tipo_declaracion: [null],
    });
  }

  ngOnInit(): void {
    this.searchPagoGeneral = ['folio_ordenPago', 'fecha_contabilizacion_orden_pago', 'factura_relacionada_string', 'orden_bloqueada', 'fecha_contabilizacion_doc_anterior', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'orden_emisor_emp', 'autorizacion_pay_text', 'fecha_autorizacion_pay', 'pago_anticipado', 'status_pago', 'status_pago_date', 'pago_realizado_folio', 'pago_realizado_fecha_contabilizacion',
      'pago_realizado_proveedor_name', 'pago_realizado_acreedor_name', 'pago_realizado_forma_pago_vinculada', 'pago_realizado_forma_metodo_pago_cfdi', 'pago_realizado_monto', 'pago_realizado_tipo_cambio', 'pago_realizado_observaciones',
      'importe_total_inicial', 'importe_autorizado_inicial_format', 'importe_autorizado_final', 'debe_format'];

    this.search_pagos_done = ['token_pagos', 'folio_pagos', 'fecha_contabilizacion', 'pago_cancelado', 'pago_folio_cancelacion', 'pago_fecha_cancelacion', 'pago_fecha_contabilizacion_cancelacion', 'monto_pago',
      'monto_pago_format', 'monto_pago_resultant', 'observacionesPago', 'tipo_cambio', 'tipo_cambio_format', 'p_moneda', 'forma_pago_pago', 'forma_metodo_pago_cfdi', 'destino', 'tercero_token', 'tercero_folio', 'tercero_name',
      'tercero_comercial_name', 'financeadoa_token', 'financeadoa_folio', 'financeadoa_name', 'financeadoa_comercial_name', 'concepto', 'personal_pago_token', 'personal_pago_folio', 'personal_pago_name', 'pago_autorizado',
      'fecha_pago_auth', 'personal_autoriza_token', 'personal_autoriza_folio', 'personal_autoriza_name', 'ordenes_relacionadas_lista', 'orden_factura_relacionada_typo', 'orden_factura_relacionada_token',
      'orden_factura_relacionada_string', 'desglose_pagos_medio', 'medio_pago_vinculado', 'doc_anterior_folio', 'doc_anterior_fecha_contabilizacion'];

    this.search_declaraciones_isn = ['nomi_imp_folio', 'nomi_imp_fecha_contabilizacion', 'nomi_imp_fecha_vencimiento', 'nomi_imp_estado_all_info', 'nomi_imp_periodo', 'nomi_imp_tipo_declaracion',
      'nomi_imp_impuesto_total_a_pagar', 'nomi_imp_factura_doc_xml', 'nomi_imp_factura_doc_pdf'];

    this.descarga_estados_mexico();
    this.ver_isn_declaraciones('hoy');
    this.listando_isn_deleted_declaraciones();
    this.getRespuestaRegistro();
    this.tipos_declaracion = [
      { valor: 'normal', tipo: 'Normal' },
      { valor: 'comple', tipo: 'Complementaria' }
    ];
  }

  getRespuestaRegistro(){
    this.relInterna.mensajeVHNominaImpuestoRegistro$.subscribe(
      (mensaje:any) => {
        mensaje == "nomina_impuestos_registrada" ? this.listando_isn_declaraciones() : null;
      }
    );
  }

  descarga_estados_mexico() {
    this.dirServ.getAllEntidadesFederativas().subscribe((data) => {
      if (data.status == 'success') {
        this.entidades_federativas = data.entidades_federativas;
      }
      console.log(this.entidades_federativas);
    });
  }

  verRegistroDeclaracionIsn() {
    this.modal_registro_declaracion_isn = true;
  }

  descarga_excel_isn() {

  }

  listando_isn_declaraciones() {
    this.ver_isn_declaraciones(this.indicador_decla_list_isn);
  }

  ver_isn_declaraciones(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicador_decla_list_isn = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var list_decla_isn_otras_fechas = document.getElementById("list_decla_isn_otras_fechas");
      if (this.rangoPeriodoDeclaListIsn && this.rangoPeriodoDeclaListIsn.length === 2) {
        const dateInicio = this.rangoPeriodoDeclaListIsn[0];
        const dateFin = this.rangoPeriodoDeclaListIsn[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(list_decla_isn_otras_fechas);
          } else {
            this.validator.errorInputRow(list_decla_isn_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(list_decla_isn_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(list_decla_isn_otras_fechas);
        return;
      }
    }
    
    this.nominaServ.catalogo_impuesto_sobre_nomina(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaDecIsnList(response),
      error: (err) => this.manejarErrorDecIsnList(err)
    });
  }

  private procesarRespuestaDecIsnList(response: any) {
    if (response.status === 'success') {
      this.catalogo_declaraciones_isn = response.isn_lista;
      console.log(this.catalogo_declaraciones_isn);
      this.cd.detectChanges();
    } else {
      this.catalogo_declaraciones_isn = [];
    }
  }

  private manejarErrorDecIsnList(error: any) {
    console.error('Error al cargar la lista de declaraciones de impuestos sobre nómina:', error);
    this.catalogo_declaraciones_isn = [];
  }

  verISNSeguimientoOrdenPago(nomi_imp_token: any, nomi_imp_ord_pago_token: any) {
    this.ver_isn_seguimiento_pagos = true;
    this.nominaServ.isnSeguimientoOrdenPago(nomi_imp_token, nomi_imp_ord_pago_token).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.catalogo_declaraciones_isn.find((row: any) => row.nomi_imp_token === nomi_imp_token);
          this.isn_detalle_folio = typeof rep !== 'undefined' ? rep.nomi_imp_folio : '';
          this.isn_seguimiento_pagos = response.seguimiento_orden_pago.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
          this.isn_pagos_historial = response.pagos_realizados;
          console.log(this.isn_seguimiento_pagos);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verDetalleISN(nomi_imp_token: string) {
    this.nominaServ.desglose_impuesto_sobre_nomina(nomi_imp_token).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.desglose_impdeclaraciones_nomina = response.isn_desglose;
          console.log(this.desglose_impdeclaraciones_nomina);
          this.modal_desglose_declaracion_isn = true;
          this.imp_sobre_nomina_form = true;
          this.desglose_impdeclaraciones_nomina.forEach((isn: any) => {
            this.modelNominaImp.fecha_contabilizacion = isn.nomi_imp_fecha_contabilizacion_edit;
            this.modelNominaImp.fecha_presentacion = isn.nomi_imp_fecha_presentacion_edit;
            this.modelNominaImp.fecha_vencimiento = isn.nomi_imp_fecha_vencimiento_edit;

            this.modelNominaImp.estado = isn.nomi_imp_estado_token;
            this.modelNominaImp.estado_entidad = isn.nomi_imp_estado_entidad;
            this.isnForm.patchValue({ estado: isn.nomi_imp_estado_entidad });

            this.modelNominaImp.ejercicio = isn.nomi_imp_ejercicio_simple;
            this.isnForm.patchValue({ ejercicio: isn.nomi_imp_ejercicio_simple });
            this.min_ejercicio = new Date(parseInt(this.modelNominaImp.ejercicio), 0, 1);
            this.max_ejercicio = new Date(parseInt(this.modelNominaImp.ejercicio), 11, 31);

            this.modelNominaImp.periodo_inicio = isn.nomi_imp_periodo_inicio_edit;
            this.modelNominaImp.periodo_fin = isn.nomi_imp_periodo_fin_edit;

            const [y, m, d] = isn.nomi_imp_periodo_inicio_edit.split('-').map(Number);
            const mes_periodo_inicio = new Date(y, m - 1, d);
            console.log(isn.nomi_imp_periodo_inicio_edit + " " + mes_periodo_inicio);
            const mes_periodo_fin = new Date(isn.nomi_imp_periodo_fin_edit);
            mes_periodo_fin.setDate(new Date(mes_periodo_fin.getFullYear(), mes_periodo_fin.getMonth() + 1, 0).getDate());
            console.log(mes_periodo_fin);
            this.isnForm.patchValue({ periodo: [mes_periodo_inicio, mes_periodo_fin] });

            this.modelNominaImp.tipo_declaracion = isn.nomi_imp_tipo_declaracion;
            this.isnForm.patchValue({ tipo_declaracion: isn.nomi_imp_tipo_declaracion });

            this.modelNominaImp.total_remuneraciones_erogadas = isn.nomi_imp_total_remuneraciones_erogadas;
            this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas = isn.nomi_imp_porcent_sobre_total_remuneraciones_erogadas;
            this.modelNominaImp.complementarias_impuesto_a_cargo = isn.nomi_imp_complementarias_impuesto_a_cargo;
            this.modelNominaImp.complementarias_saldo_a_favor = isn.nomi_imp_complementarias_saldo_a_favor;
            this.modelNominaImp.impuesto_actualizado = isn.nomi_imp_impuesto_actualizado;
            this.modelNominaImp.impuesto_descuento = isn.nomi_imp_impuesto_descuento;
            this.modelNominaImp.impuesto_recargos = isn.nomi_imp_impuesto_recargos;
            this.modelNominaImp.impuesto_recargos_condonados = isn.nomi_imp_impuesto_recargos_condonados;
            this.modelNominaImp.subsi_n_resolu_impuesto_pagar = isn.nomi_imp_subsi_n_resolu_impuesto_pagar;
            this.modelNominaImp.subsi_n_resolu_recargos = isn.nomi_imp_subsi_n_resolu_recargos;
            this.modelNominaImp.compensa_n_resolucion = isn.nomi_imp_compensa_n_resolucion;
            this.modelNominaImp.compensa_n_resolu_recargos = isn.nomi_imp_compensa_n_resolu_recargos;
            this.modelNominaImp.impuesto_total_a_pagar = isn.nomi_imp_impuesto_total_a_pagar;
            this.modelNominaImp.impuesto_saldo_a_favor = isn.nomi_imp_impuesto_saldo_a_favor;
            this.modelNominaImp.observaciones = isn.observaciones;
          });
        }
      }, error => { console.log(error); }
    );
  }

  select_fecha_contabilizacion(event:any, isninfo:any): void {
    this.modelNominaImp.fecha_contabilizacion = event.value;
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.fecha_contabilizacion != isninfo.nomi_imp_fecha_contabilizacion_edit;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.fecha_contabilizacion);
  }

  select_fecha_presentacion(event:any, isninfo:any) {
    this.modelNominaImp.fecha_presentacion = event.value;
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.fecha_presentacion != isninfo.nomi_imp_fecha_presentacion_edit;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.fecha_vencimiento);
  }

  select_fecha_vencimiento(event:any,isninfo:any): void {
    this.modelNominaImp.fecha_vencimiento = event.value;
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.fecha_vencimiento != isninfo.nomi_imp_fecha_vencimiento_edit;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.fecha_vencimiento);
  }

  changeEstadoMonina(entidad_federativa:any,isninfo:any): void {
    console.log(entidad_federativa);
    var contribNominaEstado = document.getElementById("contribNominaEstado");
    const entFed = this.entidades_federativas.find((row: any) => row.entidad === entidad_federativa);
    this.modelNominaImp.estado = entFed.token_entidad_federativa;
    const validacion = entidad_federativa != '' && typeof entFed !== 'undefined' && typeof isninfo !== 'undefined' && this.modelNominaImp.estado != isninfo.nomi_imp_estado_token;
    validacion ? this.validator.correctoInputRow(contribNominaEstado) : this.validator.errorInputRow(contribNominaEstado);
  }

  selectEjercicio(isninfo:any): void {
    var contribNominaEjercicio = document.getElementById("contribNominaEjercicio");
    const ejercicio = this.isnForm.get('ejercicio')?.value.getFullYear();
    this.modelNominaImp.ejercicio = ejercicio;
    const validacion = ejercicio && this.validator.filtroNum(ejercicio) && typeof isninfo !== 'undefined' && this.modelNominaImp.ejercicio != isninfo.nomi_imp_ejercicio_simple;
    validacion ? this.validator.correctoInputRow(contribNominaEjercicio) : this.validator.errorInputRow(contribNominaEjercicio);
    if (validacion) {
      this.min_ejercicio = new Date(parseInt(this.modelNominaImp.ejercicio), 0, 1);
      this.max_ejercicio = new Date(parseInt(this.modelNominaImp.ejercicio), 11, 31);
    }
    console.log(this.modelNominaImp);
  }

  selectEjercicioPeriodo(isninfo:any): void {
    const periodo = this.isnForm.get('periodo')?.value;
    var contribNominaEjercicioPeriodo = document.getElementById("contribNominaEjercicioPeriodo");
    if (periodo && periodo.length === 2 && periodo[1] != null) {
      const fechaInicio = periodo[0];
      const fechaFin = periodo[1];

      const inicioDate = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
      const finDate = new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
      // Convertimos las fechas a formato yyyy-mm-dd
      const inicio = inicioDate.toISOString().split('T')[0];
      const fin = finDate.toISOString().split('T')[0];
      // Guardamos en tus variables de nómina
      this.modelNominaImp.periodo_inicio = inicio;
      this.modelNominaImp.periodo_fin = fin;

      const validacionInicio = inicio != '' && this.validator.filtroFecha(inicio) && typeof isninfo !== 'undefined' && this.modelNominaImp.periodo_inicio != isninfo.nomi_imp_periodo_inicio_edit;
      const validacionFin = fin != '' && this.validator.filtroFecha(fin) && this.modelNominaImp.periodo_fin != isninfo.nomi_imp_periodo_fin_edit;

      validacionInicio || validacionFin ? this.validator.correctoInputRow(contribNominaEjercicioPeriodo) : this.validator.errorInputRow(contribNominaEjercicioPeriodo);
    } else {
      this.validator.errorInputRow(contribNominaEjercicioPeriodo);
    }
  }

  changeTipoDeclaracion(tipo:any,isninfo:any): void {
    console.log(tipo);
    var contribNominaTipoDeclaracion = document.getElementById("contribNominaTipoDeclaracion");
    const tdec = this.tipos_declaracion.find((row: any) => row.tipo === tipo);
    this.modelNominaImp.tipo_declaracion = tdec.valor;
    const validacion = tipo != '' && typeof tdec !== 'undefined' && typeof isninfo !== 'undefined' && this.modelNominaImp.tipo_declaracion != isninfo.nomi_imp_tipo_declaracion;
    validacion ? this.validator.correctoInputRow(contribNominaTipoDeclaracion) : this.validator.errorInputRow(contribNominaTipoDeclaracion);
    if (validacion) {
      this.modelNominaImp.tipo_declaracion == 'comple' ? $("#impuesto_complementarias").removeClass("noneView") : $("#impuesto_complementarias").addClass("noneView");
    } else {
      $("#impuesto_complementarias").addClass("noneView");
    }
  }

  //total_remuneraciones_erogadas
  importeTotalRemuneracionesErogadas(event:any,isninfo:any): void {
    this.modelNominaImp.total_remuneraciones_erogadas = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.total_remuneraciones_erogadas != isninfo.nomi_imp_total_remuneraciones_erogadas;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //porcent_sobre_total_remuneraciones_erogadas
  importePorcentSobreTotalRemuneracionesErogadas(event:any,isninfo:any): void {
    this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas != isninfo.nomi_imp_porcent_sobre_total_remuneraciones_erogadas;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //complementarias_impuesto_a_cargo
  importeComplementariasImpuestoACargo(event:any,isninfo:any): void {
    this.modelNominaImp.complementarias_impuesto_a_cargo = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.complementarias_impuesto_a_cargo != isninfo.nomi_imp_complementarias_impuesto_a_cargo;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //complementarias_saldo_a_favor
  importeComplementariasSaldoAFavor(event:any,isninfo:any): void {
    this.modelNominaImp.complementarias_saldo_a_favor = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.complementarias_saldo_a_favor != isninfo.nomi_imp_complementarias_saldo_a_favor;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_actualizado
  importeImpuestoActualizado(event:any,isninfo:any): void {
    this.modelNominaImp.impuesto_actualizado = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.impuesto_actualizado != isninfo.nomi_imp_impuesto_actualizado;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.impuesto_actualizado);
  }

  //impuesto_descuento
  importeImpuestoDescuento(event:any,isninfo:any): void {
    this.modelNominaImp.impuesto_descuento = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.impuesto_descuento != isninfo.nomi_imp_impuesto_descuento;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_recargos
  importeImpuestoRecargos(event:any,isninfo:any): void {
    this.modelNominaImp.impuesto_recargos = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.impuesto_recargos != isninfo.nomi_imp_impuesto_recargos;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_recargos_condonados
  importeImpuestoRecargosCondonados(event:any,isninfo:any): void {
    this.modelNominaImp.impuesto_recargos_condonados = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.impuesto_recargos_condonados != isninfo.nomi_imp_impuesto_recargos_condonados;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //subsi_n_resolu_impuesto_pagar
  importeSubsiNResoluImpuestoPagar(event:any,isninfo:any): void {
    this.modelNominaImp.subsi_n_resolu_impuesto_pagar = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.subsi_n_resolu_impuesto_pagar != isninfo.nomi_imp_subsi_n_resolu_impuesto_pagar;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //subsi_n_resolu_recargos
  importeSubsiNResoluRecargos(event:any,isninfo:any): void {
    this.modelNominaImp.subsi_n_resolu_recargos = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.subsi_n_resolu_recargos != isninfo.nomi_imp_subsi_n_resolu_recargos;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //compensa_n_resolucion
  importeCompensaNResolucion(event:any,isninfo:any): void {
    this.modelNominaImp.compensa_n_resolucion = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.compensa_n_resolucion != isninfo.nomi_imp_compensa_n_resolucion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //compensa_n_resolu_recargos
  importeCompensaNResolucionRecargos(event:any,isninfo:any): void {
    this.modelNominaImp.compensa_n_resolu_recargos = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.compensa_n_resolu_recargos != isninfo.nomi_imp_compensa_n_resolu_recargos;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_total_a_pagar
  importeImpuestoTotalAPagar(event:any,isninfo:any): void {
    this.modelNominaImp.impuesto_total_a_pagar = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.impuesto_total_a_pagar != isninfo.nomi_imp_impuesto_total_a_pagar;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_saldo_a_favor
  importeImpuestoSaldoAFavor(event:any,isninfo:any): void {
    this.modelNominaImp.impuesto_saldo_a_favor = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof isninfo !== 'undefined' && this.modelNominaImp.impuesto_saldo_a_favor != isninfo.nomi_imp_impuesto_saldo_a_favor;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calculando_totales() {
    //var subsidios = parseFloat(this.modelNominaImp.subsi_n_resolu_impuesto_pagar.toString()) + parseFloat(this.modelNominaImp.subsi_n_resolu_recargos.toString());
    //var compensaciones = parseFloat(this.modelNominaImp.compensa_n_resolucion.toString()) + parseFloat(this.modelNominaImp.compensa_n_resolu_recargos.toString());
    //var total_calculo = parseFloat(this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas.toString())
    //+ parseFloat(this.modelNominaImp.complementarias_impuesto_a_cargo.toString())//Complementarias impuesto a cargo
    //+ parseFloat(this.modelNominaImp.impuesto_actualizado.toString())//Impuesto actualizado
    //+ parseFloat(this.modelNominaImp.impuesto_recargos.toString())//Recargos
    ////------------------------------------------------
    //- parseFloat(this.modelNominaImp.complementarias_saldo_a_favor.toString())//Complementarias saldo a favor
    //- parseFloat(this.modelNominaImp.impuesto_descuento.toString())//Descuento
    //- parseFloat(this.modelNominaImp.impuesto_recargos_condonados.toString())//Recargos condonados
    //- subsidios
    //- compensaciones;
    //console.log(total_calculo);
    ////------------------------------------------------
    ////= J) Total a pagar (si positivo)
    ////= K) Saldo a favor (si negativo)
  }

  keyupObservacionContribucionNomina(event:any,isninfo:any): void {
    this.modelNominaImp.observaciones = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && typeof isninfo !== 'undefined' && this.modelNominaImp.observaciones != isninfo.observaciones;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  deleteAnexoDocs(isninfo:any, token_documento: string): void {
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
        const doc = isninfo.isnAnexos.find((docu: any) => docu.token_documento === token_documento);
        doc.eliminacion_proceso = doc.eliminacion_proceso ? false : true;
        this.cd.detectChanges();
      }
    });
  }

  public droppedImpNomina(files: NgxFileDropEntry[]) {
    this.filesImpNomina = files;
    this.ImpNominaAnexosNames = [];
    this.docsImpNominaAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsImpNominaAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.ImpNominaAnexosNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.docsImpNominaAnexos.length > 0) {
              for (let j = 0; j < this.docsImpNominaAnexos.length; j++) {
                const row = this.docsImpNominaAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsImpNominaAnexos.push(file);
                  this.cd.detectChanges();
                }
              }
            } else {
              this.docsImpNominaAnexos.push(file);
              this.cd.detectChanges();
            }
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El event.value ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.filesImpNomina.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsImpNominaAnexos.length);
  }

  public fileOverImpNomina(event: any) {
    console.log(event);
  }

  public fileLeaveImpNomina(event: any) {
    console.log(event);
  }

  deleteAnexosImpNomina(posicion: any) {
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
          this.filesImpNomina.splice(posicion, 1);
          this.docsImpNominaAnexos.splice(posicion, 1);
          this.ImpNominaAnexosNames.splice(posicion, 1);
          console.log(this.docsImpNominaAnexos.length);
        }
      }
    );
  }

  validate_isn_update(isn:any): Boolean {
    if (typeof isn !== 'undefined') {
      const validaFechaContabilizacion = this.modelNominaImp.fecha_contabilizacion != "" && this.validator.filtroFecha(this.modelNominaImp.fecha_contabilizacion) && this.modelNominaImp.fecha_contabilizacion != isn.nomi_imp_fecha_contabilizacion_edit;

      const validaFechaVencimiento = this.modelNominaImp.fecha_vencimiento != "" && this.validator.filtroFecha(this.modelNominaImp.fecha_vencimiento) && this.modelNominaImp.fecha_vencimiento != isn.nomi_imp_fecha_vencimiento_edit;
      const validaFechaPresentacion = this.modelNominaImp.fecha_presentacion != "" && this.validator.filtroFecha(this.modelNominaImp.fecha_presentacion) && this.modelNominaImp.fecha_presentacion != isn.nomi_imp_fecha_presentacion_edit;

      const entFed = this.entidades_federativas.find((row: any) => row.token_entidad_federativa === this.modelNominaImp.estado);
      const validaEstado = this.modelNominaImp.estado != '' && typeof entFed !== 'undefined' && this.modelNominaImp.estado != isn.nomi_imp_estado_token;

      const validaEjercicio = this.modelNominaImp.ejercicio != '' && this.validator.filtroNum(this.modelNominaImp.ejercicio) && this.modelNominaImp.ejercicio != isn.nomi_imp_ejercicio_simple;
      const validaPeriodoInicio = this.modelNominaImp.periodo_inicio != '' && this.validator.filtroFecha(this.modelNominaImp.periodo_inicio) && this.modelNominaImp.periodo_inicio != isn.nomi_imp_periodo_inicio_edit;
      const validaPeriodoFin = this.modelNominaImp.periodo_fin != '' && this.validator.filtroFecha(this.modelNominaImp.periodo_fin) && this.modelNominaImp.periodo_fin != isn.nomi_imp_periodo_fin_edit;

      //if (this.modelNominaImp.ejercicio != isn.nomi_imp_ejercicio_simple) {
      //  const validaEjercicioPeriodo = (validaEjercicio && validaPeriodoInicio && validaPeriodoFin) || !validaEjercicio && (validaPeriodoInicio || validaPeriodoFin);
      //} else {
      //}
      const validaEjercicioPeriodo = (validaEjercicio && validaPeriodoInicio && validaPeriodoFin) || !validaEjercicio && (validaPeriodoInicio || validaPeriodoFin);

      const tdec = this.tipos_declaracion.find((row: any) => row.valor === this.modelNominaImp.tipo_declaracion);
      const validaTipoDeclaracion = this.modelNominaImp.tipo_declaracion != '' && typeof tdec !== 'undefined' && this.modelNominaImp.tipo_declaracion != isn.nomi_imp_tipo_declaracion;

      //total_remuneraciones_erogadas
      const validaTotalRemuneracionesErogadas = this.modelNominaImp.total_remuneraciones_erogadas > 0 && this.validator.filtroNum(this.modelNominaImp.total_remuneraciones_erogadas) && this.modelNominaImp.total_remuneraciones_erogadas != isn.nomi_imp_total_remuneraciones_erogadas;

      //porcent_sobre_total_remuneraciones_erogadas
      const validaPorcentSobreTotalRemuneracionesErogadas = this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas > 0 && this.validator.filtroNum(this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas) && this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas != isn.nomi_imp_porcent_sobre_total_remuneraciones_erogadas;

      //complementarias_impuesto_a_cargo
      const complemenImpuestoACargo = this.modelNominaImp.complementarias_impuesto_a_cargo > 0 && this.validator.filtroNum(this.modelNominaImp.complementarias_impuesto_a_cargo) && this.modelNominaImp.complementarias_impuesto_a_cargo != isn.nomi_imp_complementarias_impuesto_a_cargo;
      const validaComplementariasImpuestoACargo = this.modelNominaImp.tipo_declaracion == 'normal' || (this.modelNominaImp.tipo_declaracion == 'comple' && complemenImpuestoACargo);

      //complementarias_saldo_a_favor
      const complemenSaldoAFavor = this.modelNominaImp.complementarias_saldo_a_favor > 0 && this.validator.filtroNum(this.modelNominaImp.complementarias_saldo_a_favor) && this.modelNominaImp.complementarias_saldo_a_favor != isn.nomi_imp_complementarias_saldo_a_favor;
      const validaComplementariasSaldoAFavor = this.modelNominaImp.tipo_declaracion == 'normal' || (this.modelNominaImp.tipo_declaracion == 'comple' && complemenSaldoAFavor);

      //impuesto_actualizado
      const validaImpuestoActualizado = this.modelNominaImp.impuesto_actualizado > 0 && this.validator.filtroNum(this.modelNominaImp.impuesto_actualizado) && this.modelNominaImp.impuesto_actualizado != isn.nomi_imp_impuesto_actualizado;

      //impuesto_descuento
      const validaImpuestoDescuento = this.modelNominaImp.impuesto_descuento != '' && (this.modelNominaImp.impuesto_descuento == '0.00' || this.modelNominaImp.impuesto_descuento != '0.00') && this.validator.filtroNum(this.modelNominaImp.impuesto_descuento) && this.modelNominaImp.impuesto_descuento != isn.nomi_imp_impuesto_descuento;

      //impuesto_recargos
      const validaImpuestoRecargos = this.modelNominaImp.impuesto_recargos > 0 && this.validator.filtroNum(this.modelNominaImp.impuesto_recargos) && this.modelNominaImp.impuesto_recargos != isn.nomi_imp_impuesto_recargos;

      //impuesto_recargos_condonados
      const validaImpuestoRecargosCondonados = this.modelNominaImp.impuesto_recargos_condonados > 0 && this.validator.filtroNum(this.modelNominaImp.impuesto_recargos_condonados) && this.modelNominaImp.impuesto_recargos_condonados != isn.nomi_imp_impuesto_recargos_condonados;

      //subsi_n_resolu_impuesto_pagar
      const validaSubsiNResoluImpuestoPagar = this.modelNominaImp.subsi_n_resolu_impuesto_pagar > 0 && this.validator.filtroNum(this.modelNominaImp.subsi_n_resolu_impuesto_pagar) && this.modelNominaImp.subsi_n_resolu_impuesto_pagar != isn.nomi_imp_subsi_n_resolu_impuesto_pagar;

      //subsi_n_resolu_recargos
      const validaSubsiNResoluRecargos = this.modelNominaImp.subsi_n_resolu_recargos > 0 && this.validator.filtroNum(this.modelNominaImp.subsi_n_resolu_recargos) && this.modelNominaImp.subsi_n_resolu_recargos != isn.nomi_imp_subsi_n_resolu_recargos;

      //compensa_n_resolucion
      const validaCompensaNResolucion = this.modelNominaImp.compensa_n_resolucion > 0 && this.validator.filtroNum(this.modelNominaImp.compensa_n_resolucion) && this.modelNominaImp.compensa_n_resolucion != isn.nomi_imp_compensa_n_resolucion;

      //compensa_n_resolu_recargos
      const validaCompensaNResolucionRecargos = this.modelNominaImp.compensa_n_resolu_recargos > 0 && this.validator.filtroNum(this.modelNominaImp.compensa_n_resolu_recargos) && this.modelNominaImp.compensa_n_resolu_recargos != isn.nomi_imp_compensa_n_resolu_recargos;

      //impuesto_total_a_pagar
      const validaImpuestoTotalAPagar = this.modelNominaImp.impuesto_total_a_pagar > 0 && this.validator.filtroNum(this.modelNominaImp.impuesto_total_a_pagar) && this.modelNominaImp.impuesto_total_a_pagar != isn.nomi_imp_impuesto_total_a_pagar;

      //impuesto_saldo_a_favor
      const validaImpuestoSaldoAFavor = this.modelNominaImp.impuesto_saldo_a_favor > 0 && this.validator.filtroNum(this.modelNominaImp.impuesto_saldo_a_favor) && this.modelNominaImp.impuesto_saldo_a_favor != isn.nomi_imp_impuesto_saldo_a_favor;

      const validacion_observacion = this.modelNominaImp.observaciones != "" && this.validator.strFilter(this.modelNominaImp.observaciones) && this.modelNominaImp.observaciones.length >= 4 && this.modelNominaImp.observaciones != isn.observaciones;

      const docs_eliminar = isn.isnAnexos.filter((docu: any) => docu.eliminacion_proceso === true);
      const validacion_eliminar_documents = docs_eliminar.length > 0;

      const validacion_documents = this.ImpNominaAnexosNames.length > 0;

      return validaFechaContabilizacion ||
        validaFechaVencimiento ||
        validaFechaPresentacion ||
        validaEstado ||
        validaEjercicioPeriodo ||
        validaTipoDeclaracion ||
        validaTotalRemuneracionesErogadas ||
        validaPorcentSobreTotalRemuneracionesErogadas ||
        validaComplementariasImpuestoACargo ||
        validaComplementariasSaldoAFavor ||
        validaImpuestoActualizado ||
        validaImpuestoDescuento ||
        validaImpuestoRecargos ||
        validaImpuestoRecargosCondonados ||
        validaSubsiNResoluImpuestoPagar ||
        validaSubsiNResoluRecargos ||
        validaCompensaNResolucion ||
        validaCompensaNResolucionRecargos ||
        validaImpuestoTotalAPagar ||
        validaImpuestoSaldoAFavor ||
        validacion_observacion ||
        validacion_eliminar_documents ||
        validacion_documents;
    } else {
      return false;
    }
  }

  isn_actualizar(form: { reset: () => void; },isninfo:any): void {
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
        const docs_eliminar = isninfo.isnAnexos.filter((docu: any) => docu.eliminacion_proceso === true);
        this.imp_sobre_nomina_form = false;
        this.nominaServ.actualiza_impuesto_sobre_nomina(isninfo.nomi_imp_token,this.modelNominaImp,docs_eliminar,this.docsImpNominaAnexos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
                this.listando_isn_declaraciones();
                this.verDetalleISN(isninfo.nomi_imp_token);
                form.reset();
                this.imp_sobre_nomina_form = true;
                this.modelNominaImp = new nominaImpuestoModelo('', '', '', '', '', '', '', '', '', '', '', 2, 0, 0, 0, 0, 0, 0, '0.00', 0, 0, 0, 0, 0, 0, 0, 0, '');

                this.ImpNominaAnexosNames = [];
                this.docsImpNominaAnexos = [];
                this.filesImpNomina = [];
              }
              if (response.status == 'error') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
            },
            error => {
              //console.log(error);
            }
          );
      }
    })
  }

  cargaXmlISN(nomi_imp_token: string, e: any, objeto: any): void {
    const doc_xml = objeto.files[0];
    console.log(doc_xml.type);
    const validacion_xml = doc_xml.size <= 2000000 && doc_xml.type == 'text/xml';
    this.imagenEvidenciaXml = validacion_xml ? doc_xml : null;
    validacion_xml ? this.lecturaInternaXML(nomi_imp_token, objeto) : this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
  }

  limpiaXMLData() {
    //cfdi:Comprobante
    //this.isnCfdiComprobante = [];
    //cfdi:Comprobante//cfdi:Emisor
    //this.dataCFDI_emisor_Rfc = '';
    //this.isnCfdiEmisor = [];
    //cfdi:Comprobante//cfdi:Receptor
    //this.dataCFDI_receptor_Rfc = '';
    //this.isnCfdiReceptor = [];
    //cfdi:Comprobante//cfdi:Conceptos
    //this.isnCfdiConceptos = [];
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    //this.isnCfdiComplemento = [];
    //this.dataCFDI_complemento_UUID = '';
    //this.dataCFDI_complemento_SelloCFD = '';
  }

  lecturaInternaXML(nomi_imp_token: string, objeto: any) {
    const isn_data = this.catalogo_declaraciones_isn.find((row: any) => row.nomi_imp_token === nomi_imp_token);
    //this.isnCfdiComprobante = [];
    console.log("lectura comienza");
    this.limpiaXMLData();
    if (this.imagenEvidenciaXml) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const xmlString = e.target.result;
        const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml');
        if (xmlDoc.getElementsByTagName('parsererror').length == 0) {
          const xmlElement: any = xmlDoc.documentElement;
          const xmlNode = nodeFromXmlElement(xmlElement);

          const childNodes = xmlNode.children();

          const nodo_emisor = childNodes.getNodesByName("cfdi:Emisor");
          const emisor_Rfc = this.cfdiServ.obtenRFCEmisor(childNodes.getNodesByName("cfdi:Emisor")).toString();

          const nodo_receptor = childNodes.getNodesByName("cfdi:Receptor");
          const receptor_Rfc = this.cfdiServ.obtenReceptor(childNodes.getNodesByName("cfdi:Receptor")).toString();

          const nodo_conceptos = childNodes.getNodesByName("cfdi:Conceptos");
          const nodo_complemento = childNodes.getNodesByName("cfdi:Complemento");
          const complemento_UUID = this.cfdiServ.obtenComplementoUUID(childNodes.getNodesByName("cfdi:Complemento")).toString();
          const complemento_SelloCFD = this.cfdiServ.obtenComplementoSelloCFD(childNodes.getNodesByName("cfdi:Complemento")).toString();

          const rfc_emp_nomina_receptor = this.sessionContext.empresa_data?.rfc_emp || "";
          const company_emp_nomina_receptor = this.sessionContext.empresa_data?.company_name_large || "";

          const valida_cion_emisor_rfc = emisor_Rfc.toLowerCase() === isn_data.nomi_imp_estado_rfc.toLowerCase();

          const valida_cion_receptor_Rfc = receptor_Rfc.toLowerCase() === rfc_emp_nomina_receptor.toLowerCase();
          console.log("valida_cion_receptor_Rfc " + receptor_Rfc);

          const valida_cion_UUID = complemento_UUID && emisor_Rfc && receptor_Rfc && xmlNode.getAttribute('Total');

          if (valida_cion_emisor_rfc && valida_cion_receptor_Rfc && valida_cion_UUID) { //valida_cion_periodo && 
            const total = parseFloat(xmlNode.getAttribute('Total')).toFixed(6);

            this.cfdiServ.validaEstadoCFDIISN(complemento_UUID, emisor_Rfc, receptor_Rfc, total).subscribe(
              response => {
                if (response.status == 'success' && response.estado == 'Vigente' && xmlNode.getAttribute('TipoDeComprobante') == "I") {
                  if (!response.encontrado) {
                    this.validator.correctoInputRow(objeto);
                    this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: 'CFDI es correcto.' });
                    isn_data.nomi_imp_valida_xml = 'validoXml';

                    isn_data.nomi_imp_cfdi_comprobante.push({
                      "FechaContabilizacion": xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "Version": xmlNode.getAttribute('Version') ? xmlNode.getAttribute('Version') : '---',
                      "Serie": xmlNode.getAttribute('Serie') ? xmlNode.getAttribute('Serie') : '---',
                      "Folio": xmlNode.getAttribute('Folio') ? xmlNode.getAttribute('Folio') : '---',
                      "Fecha": xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "Sello": xmlNode.getAttribute('Sello') ? xmlNode.getAttribute('Sello') : '---',
                      "FormaDePago": xmlNode.getAttribute('FormaPago') ? xmlNode.getAttribute('FormaPago') : '---',
                      "NoDeCertificado": xmlNode.getAttribute('NoCertificado') ? xmlNode.getAttribute('NoCertificado') : '---',
                      "Certificado": xmlNode.getAttribute('Certificado') ? xmlNode.getAttribute('Certificado') : '---',
                      "Subtotal": xmlNode.getAttribute('SubTotal') ? xmlNode.getAttribute('SubTotal') : '---',
                      "Descuento": xmlNode.getAttribute('Descuento') ? xmlNode.getAttribute('Descuento') : '0.00',
                      "Moneda": xmlNode.getAttribute('Moneda') ? xmlNode.getAttribute('Moneda') : 'MXN',
                      "TipoDeCambio": xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00',
                      "Total": xmlNode.getAttribute('Total') ? xmlNode.getAttribute('Total') : '0.00',
                      "Confirmacion": xmlNode.getAttribute('confirmacion') ? xmlNode.getAttribute('confirmacion') : '---',
                      "TipoDeComprobante": xmlNode.getAttribute('TipoDeComprobante') ? xmlNode.getAttribute('TipoDeComprobante') : '---',
                      "MetodoDePago": xmlNode.getAttribute('MetodoPago') ? xmlNode.getAttribute('MetodoPago') : '---',
                      "LugarDeExpedición": xmlNode.getAttribute('LugarExpedicion') ? xmlNode.getAttribute('LugarExpedicion') : '---',
                    });
                    console.log(isn_data.nomi_imp_cfdi_comprobante);

                    nodo_emisor.forEach((child: any) => {
                      isn_data.nomi_imp_cfdi_emisor.push({
                        "EmisorRfc": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---',
                        "EmisorNombre": child.getAttribute('Nombre') ? child.getAttribute('Nombre') : '---',
                        "EmisorRegimenFiscal": child.getAttribute('RegimenFiscal') ? child.getAttribute('RegimenFiscal') : '---',
                      });
                    });

                    nodo_receptor.forEach((child: any) => {
                      isn_data.nomi_imp_cfdi_receptor.push({
                        "ReceptorRfc": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---',
                        "ReceptorDomicilioFiscal": child.getAttribute('DomicilioFiscalReceptor') ? child.getAttribute('DomicilioFiscalReceptor') : '---',
                        "ReceptorRegimenFiscal": child.getAttribute('RegimenFiscalReceptor') ? child.getAttribute('RegimenFiscalReceptor') : '---',
                        "ReceptorUsoCFDI": child.getAttribute('UsoCFDI') ? child.getAttribute('UsoCFDI') : '---',
                      });
                    });

                    nodo_conceptos.forEach(concepts => {
                      var list_conceptos: any = [];
                      concepts.children().forEach((cChild: any) => {
                        list_conceptos.push({
                          "ClaveProdServ": cChild.getAttribute("ClaveProdServ") ? cChild.getAttribute("ClaveProdServ") : "",
                          "Cantidad": cChild.getAttribute("Cantidad") ? cChild.getAttribute("Cantidad") : "",
                          "ClaveUnidad": cChild.getAttribute("ClaveUnidad") ? cChild.getAttribute("ClaveUnidad") : "",
                          "Descripcion": cChild.getAttribute("Descripcion") ? cChild.getAttribute("Descripcion") : "",
                          "ValorUnitario": cChild.getAttribute("ValorUnitario") ? cChild.getAttribute("ValorUnitario") : "0.00",
                          "Importe": cChild.getAttribute("Importe") ? cChild.getAttribute("Importe") : "0.00",
                          "Descuento": cChild.getAttribute("Descuento") ? cChild.getAttribute("Descuento") : "0.00",
                          "ObjetoImp": cChild.getAttribute("ObjetoImp") ? cChild.getAttribute("ObjetoImp") : "",
                        });
                      });
                      isn_data.nomi_imp_cfdi_conceptos = list_conceptos;
                      console.log(isn_data.nomi_imp_cfdi_conceptos);
                    });

                    nodo_complemento.forEach((child: any) => {
                      const childNodes = child.children();
                      const timbreFiscalDigital = childNodes.getNodesByName("tfd:TimbreFiscalDigital");
                      timbreFiscalDigital.forEach((timbre: any) => {
                        isn_data.nomi_imp_cfdi_complemento.push({
                          "Version": timbre.getAttribute("Version") ? timbre.getAttribute("Version") : '---',
                          "UUID": timbre.getAttribute("UUID") ? timbre.getAttribute("UUID") : '---',
                          "FechaTimbrado": timbre.getAttribute("FechaTimbrado") ? timbre.getAttribute("FechaTimbrado") : '---',
                          "RfcProvCertif": timbre.getAttribute("RfcProvCertif") ? timbre.getAttribute("RfcProvCertif") : '---',
                          "SelloCFD": timbre.getAttribute("SelloCFD") ? timbre.getAttribute("SelloCFD") : '---',
                          "NoCertificadoSAT": timbre.getAttribute("NoCertificadoSAT") ? timbre.getAttribute("NoCertificadoSAT") : '---',
                          "SelloSAT": timbre.getAttribute("SelloSAT") ? timbre.getAttribute("SelloSAT") : '---'
                        });
                      });
                    });

                    console.log(isn_data.nomi_imp_cfdi_complemento);
                    isn_data.nomi_imp_factura_xml = this.imagenEvidenciaXml;
                    //isn_data.nomi_imp_cfdi_comprobante = this.isnCfdiComprobante;
                    //isn_data.nomi_imp_cfdi_emisor = this.isnCfdiEmisor;
                    //isn_data.nomi_imp_cfdi_receptor = this.isnCfdiReceptor;
                    //isn_data.nomi_imp_cfdi_conceptos = this.isnCfdiConceptos;
                    //isn_data.nomi_imp_cfdi_complemento = this.isnCfdiComplemento;
                    console.log(isn_data);
                  } else {
                    this.validator.errorInputRow(objeto);
                    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El documento CFDI ya se encuentra vinculado a otros procesos de impuestos sobre nómina' });
                  }
                } else {
                  this.validator.errorInputRow(objeto);
                  this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos para validar el CFDI en el SAT.' });
                }
              },
              error => {
                console.log(error);
              }
            );
          } else {
            isn_data.nomi_imp_valida_xml = 'errorXml';
            if (!valida_cion_emisor_rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del emisor no coincide con el rfc de ' + isn_data.nomi_imp_estado_entidad + '.' });
            if (!valida_cion_receptor_Rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del receptor no coincide con el rfc de ' + company_emp_nomina_receptor + '.' });
            if (!valida_cion_UUID) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos para validar el CFDI en el SAT.' });
            this.validator.errorInputRow(objeto);
          }
        } else {
          isn_data.nomi_imp_valida_xml = 'errorXml';
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
          this.validator.errorInputRow(objeto);
        }
      };
      reader.readAsText(this.imagenEvidenciaXml);
    } else {
      this.validator.errorInputRow(objeto);
    }
  }

  escanPdfISN(nomi_imp_token: string, e: any, objeto: any): void {
    const doc_pdf = objeto.files[0];
    const validacion_pdf = doc_pdf.size <= 2000000 && (doc_pdf.type == 'application/pdf');
    this.imagenEvidenciaPdf = validacion_pdf ? doc_pdf : null;
    validacion_pdf ? this.validator.correctoInputRow(objeto) : this.validator.errorInputRow(objeto);
    if (validacion_pdf) {
      const isn_data = this.catalogo_declaraciones_isn.find((row: any) => row.nomi_imp_token === nomi_imp_token);
      isn_data.nomi_imp_factura_pdf = this.imagenEvidenciaPdf;
    } else {
      let mensajeError = '';
      if (doc_pdf.size > 2000000) mensajeError = 'El archivo excede el tamaño permitido (2MB)';
      if (doc_pdf.type != 'application/pdf') mensajeError = 'El archivo Debe ser en formato pdf';
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: mensajeError });
    }
  }

  deletePdfCompra(): void {
    this.imagenEvidenciaPdf = null;
  }

  validaTrabCFDILoaded(nomi_imp_token: string): boolean {
    const isn_data = this.catalogo_declaraciones_isn.find((row: any) => row.nomi_imp_token === nomi_imp_token);
    const validacion = isn_data.nomi_imp_factura_doc_xml === null && isn_data.nomi_imp_factura_doc_pdf === null && isn_data.nomi_imp_factura_xml !== null && isn_data.nomi_imp_factura_pdf !== null;
    return validacion;
  }

  cargaISNCFDIS(nomi_imp_token: string): void {
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
        //this.viewFormulario = false;
        //nomina_total_en_especie
        let nominas_facts = this.catalogo_declaraciones_isn.filter((row: any) => row.nomi_imp_token === nomi_imp_token);
        this.nominaServ.carga_cfdi_isn(nomi_imp_token, nominas_facts).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            console.log(response);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              //this.viewFormulario = true;
              //this.centTrabModel = new centroTrabajoModelo('','','','',false,'','');
              //this.relInterna.mensajeTrabajadorRegistro("centro_trabajo_registrado");
              this.listando_isn_declaraciones();
            }
            if (response.status == 'error') {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  deleteISNDeclaracion(nomi_imp_token: string) {
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
        this.nominaServ.eliminar_impuesto_sobre_nomina(nomi_imp_token).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.listando_isn_declaraciones();
              this.listando_isn_deleted_declaraciones();
            }
            if (response.status == 'error') {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  verDeletedDeclaracionesISN() {
    this.modal_deleted_declaraciones_isn = true;
  }

  listando_isn_deleted_declaraciones() {
    this.nominaServ.catalogo_deleted_impuesto_sobre_nomina().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogo_deleted_declaraciones_isn = response.isn_lista;
          console.log(this.catalogo_deleted_declaraciones_isn);
        }
      }, error => { console.log(error); }
    );
  }

  restauraISNDeclaracion(nomi_imp_token: any) {
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
        this.nominaServ.restaurar_impuesto_sobre_nomina(nomi_imp_token).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.listando_isn_declaraciones();
              this.listando_isn_deleted_declaraciones();
            }
            if (response.status == 'error') {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  deletePermanenteISNDeclaracion(nomi_imp_token: any) {
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
        this.nominaServ.eliminacion_permanente_impuesto_sobre_nomina(nomi_imp_token).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.listando_isn_declaraciones();
              this.listando_isn_deleted_declaraciones();
            }
            if (response.status == 'error') {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
