import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { CFDIService } from '../../../../../../../servicios/xml/cfdi.service';
import { SentinelArkManager } from '../../../../../../../servicios/sentinel-ark-manager';
import { ImssService } from '../../../../../../../servicios/ssic/imss-service';
import { aportacionesIMSSModelo } from '../../../../../../../modelos/aportacionesIMSSModelo';
import { CentrosTrabajoService } from '../../../../../../../servicios/ssic/centros-trabajo-service';
import { SessionContextService } from '../../../../../../../servicios/session-context';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComunicacionInternaService } from '../../../../../../../servicios/comunicacion-interna.service';

interface Row {
  type: 'section' | 'label' | 'label_aport' | 'input' | 'subtotal';
  label: string;
  patronal?: null | number;
  obrera?: null | number;
  total?: null | number;
}

@Component({
  selector: 'vhum_aportaciones_imss_catalogo',
  standalone: false,
  templateUrl: './aport_seg_social_catalogo.component.html',
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
    './aport_seg_social_catalogo.component.css']
})
export class AportacionesSeguridadSocialCatalogoComponent implements OnInit, OnDestroy {
  public identidad: any;
  public modelIMSSAport: aportacionesIMSSModelo;
  catalogo_registros_patronales:any = [];
  searchPagoGeneral:any = [];
  search_pagos_done:any = [];

//DASS (Aportaciones de Seguridad Social)
  search_aportaciones_de_imss:any = [];
  catalogo_aportaciones_de_imss:any = [];
  imss_aport_list_indicador:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoImssAport: Date[] | undefined;

  public ver_aport_imss_seguimiento_pagos:boolean = false;
  aport_imss_seguimiento_pagos:any = [];
  aport_imss_pagos_historial:any = [];
  public isn_detalle_folio:string = "";
  desglose_aportacion_de_imss:any = [];
  aportacionImssForm: FormGroup;
  public aportacion_seguridad_social_form:boolean = true;
  public AporSSOCIALAnexosNames:any = [];
  public docsAporSSOCIALAnexos:any [] = [];
  public filesAporSSOCIAL: NgxFileDropEntry[] = [];
  public modal_desglose_aportacion_seguridad_social:boolean = false;
  public ImssAportEvidenciaXml: any;
  public ImssAportEvidenciaPdf: any;
  public InfonavitAportEvidenciaXml: any;
  public InfonavitAportEvidenciaPdf: any;
	public modal_deleted_aportaciones_seguridad_social:boolean = false;
  catalogo_deleted_aportaciones_de_imss:any = [];

  desglose_total_cuotas: Row[] = [];
  desglose_original: Row[] = [];
  nomina_registro_patronal:any = null;
  bimestre_pago_rcv_infonavit:any = null;
  totales = { patronal: 0, obrera: 0, total: 0 };

  private destruir$ = new Subject<void>();

  constructor(
    private translate:TranslateService,
    private validator:ValidatorServService,
    private primeAlerts: MessageService,
    private cfdiServ: CFDIService,
    private sentinela: SentinelArkManager,
    private imssServ:ImssService,
    private ctraserv:CentrosTrabajoService,
    private sessionContext: SessionContextService,
    private relInterna:ComunicacionInternaService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.modelIMSSAport = new aportacionesIMSSModelo('','','','','','','','','','','','','','0','0','0','0','');
    this.aportacionImssForm = this.fb.group({
      registro_patronal: [null],
      periodo_pago_seguros: [null],
      pago_rcv_infonavit: [null]
    });
  }

  ngOnInit(): void {
    this.ver_imss_aportaciones('hoy');
    this.getRespuestaRegistro();
    this.listando_imss_deleted_declaraciones();
    this.descarga_centros_de_trabajo();

    this.searchPagoGeneral = ['folio_ordenPago','fecha_contabilizacion_orden_pago','factura_relacionada_string','orden_bloqueada','fecha_contabilizacion_doc_anterior','orden_emisor_personal_folio','orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial','orden_emisor_emp','autorizacion_pay_text','fecha_autorizacion_pay','pago_anticipado','status_pago','status_pago_date','pago_realizado_folio','pago_realizado_fecha_contabilizacion',
      'pago_realizado_proveedor_name','pago_realizado_acreedor_name','pago_realizado_forma_pago_vinculada','pago_realizado_forma_metodo_pago_cfdi','pago_realizado_monto','pago_realizado_tipo_cambio','pago_realizado_observaciones',
      'importe_total_inicial','importe_autorizado_inicial_format','importe_autorizado_final','debe_format'];

    this.search_pagos_done = ['token_pagos','folio_pagos','fecha_contabilizacion','pago_cancelado',	'pago_folio_cancelacion','pago_fecha_cancelacion','pago_fecha_contabilizacion_cancelacion','monto_pago',
      'monto_pago_format','monto_pago_resultant','observacionesPago','tipo_cambio','tipo_cambio_format','p_moneda','forma_pago_pago','forma_metodo_pago_cfdi','destino','tercero_token','tercero_folio','tercero_name',
      'tercero_comercial_name','financeadoa_token','financeadoa_folio','financeadoa_name','financeadoa_comercial_name','concepto','personal_pago_token','personal_pago_folio','personal_pago_name','pago_autorizado',
      'fecha_pago_auth','personal_autoriza_token','personal_autoriza_folio','personal_autoriza_name','ordenes_relacionadas_lista','orden_factura_relacionada_typo','orden_factura_relacionada_token',
      'orden_factura_relacionada_string','desglose_pagos_medio','medio_pago_vinculado','doc_anterior_folio','doc_anterior_fecha_contabilizacion'];

    this.search_aportaciones_de_imss = ['aport_ssocial_folio','aport_ssocial_fecha_contabilizacion','aport_ssocial_registro_patronal_serie','periodo_pago_seguros_imss','pago_rcv_infonavit',
      'folio_sua','clave_recepcion_archivo_pago','propuesta_fecha_limite_pago','linea_captura_sipare','propuesta_s_m_g_d_f','propuesta_fecha_salario_minimo_pago','propuesta_valor_uma',
      'propuesta_num_de_cotizantes','propuesta_num_dias_a_cotizar','propuesta_num_de_acreditados','cuotas_patronales','cuotas_obreras','cuotas_totales','observaciones'];
  }

  descarga_excel_isn(){
    
  }
  
  getRespuestaRegistro(){
    this.relInterna.mensajeVHAportaSEGSocialIMSS$.subscribe(
      (mensaje:any) => {
        mensaje == "aportacion_imss_registrada" ? this.listando_imss_aportaciones() : null;
      }
    );
  }

  listando_imss_aportaciones() {
    this.ver_imss_aportaciones(this.imss_aport_list_indicador);
  }

  ver_imss_aportaciones(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.imss_aport_list_indicador = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var list_imss_aport_otras_fechas = document.getElementById("list_imss_aport_otras_fechas");
      if (this.rangoPeriodoImssAport && this.rangoPeriodoImssAport.length === 2) {
        const dateInicio = this.rangoPeriodoImssAport[0];
        const dateFin = this.rangoPeriodoImssAport[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(list_imss_aport_otras_fechas);
          } else {
            this.validator.errorInputRow(list_imss_aport_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(list_imss_aport_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(list_imss_aport_otras_fechas);
        return;
      }
    }
    
    this.imssServ.catalogo_aportaciones_seg_social(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaListImssAport(response),
      error: (err) => this.manejarErrorListImssAport(err)
    });
  }

  private procesarRespuestaListImssAport(response: any) {
    if (response.status === 'success') {
      this.catalogo_aportaciones_de_imss = response.aportaciones;
      console.log(this.catalogo_aportaciones_de_imss);
      this.cd.detectChanges();
    } else {
      this.catalogo_aportaciones_de_imss = [];
    }
  }

  private manejarErrorListImssAport(error: any) {
    console.error('Error al cargar la lista de aportaciones de seguridad social:', error);
    this.catalogo_aportaciones_de_imss = [];
  }


  verAportSSocialSeguimientoOrdenPago(aport_ssocial_token:any,aport_ssocial_ord_pago_token:any){
    this.ver_aport_imss_seguimiento_pagos = true;
    this.imssServ.aportSSocialSeguimientoOrdenPago(aport_ssocial_token,aport_ssocial_ord_pago_token).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
          this.isn_detalle_folio = typeof rep !== 'undefined' ? rep.nomi_imp_folio : '';          
          this.aport_imss_seguimiento_pagos = response.seguimiento_orden_pago.map((lPay:any) => ({...lPay,autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth')}));
          this.aport_imss_pagos_historial = response.pagos_realizados;
          console.log(this.aport_imss_seguimiento_pagos);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verDetalleIMSS(aport_ssocial_token:string){
    this.imssServ.desglose_aportacion_seg_social(aport_ssocial_token).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.desglose_aportacion_de_imss = response.aportaciones;
          console.log(this.desglose_aportacion_de_imss);
          this.modal_desglose_aportacion_seguridad_social = true;
          this.aportacion_seguridad_social_form = true;
          this.desglose_aportacion_de_imss.forEach((imss:any) => {
            this.modelIMSSAport.fecha_contabilizacion = imss.aport_ssocial_fecha_contabilizacion;
            this.modelIMSSAport.fecha_presentacion = imss.aport_ssocial_fecha_presentacion;
            this.modelIMSSAport.registro_patronal = imss.aport_ssocial_registro_patronal_serie;
            this.aportacionImssForm.patchValue({registro_patronal: imss.aport_ssocial_registro_patronal_serie});

            this.modelIMSSAport.periodo_pago_seguros_imss_anio = imss.periodo_pago_seguros_imss_anio;
            this.modelIMSSAport.periodo_pago_seguros_imss_mes = imss.periodo_pago_seguros_imss_mes;

            const imss_anio = imss.periodo_pago_seguros_imss_anio;
            const imss_mes = imss.periodo_pago_seguros_imss_mes;
            if (imss_anio && imss_mes) {
              const fechaPeriodo = new Date(imss_anio, imss_mes - 1, 1);
              this.aportacionImssForm.patchValue({periodo_pago_seguros: fechaPeriodo});
            }
            
            this.modelIMSSAport.pago_rcv_infonavit_inicio = imss.pago_rcv_infonavit_inicio;
            this.modelIMSSAport.pago_rcv_infonavit_fin = imss.pago_rcv_infonavit_fin;

            if (imss.pago_rcv_infonavit_inicio && imss.pago_rcv_infonavit_fin) {
              const [y,m,d] = imss.pago_rcv_infonavit_inicio.split('-').map(Number);
              const mes_periodo_inicio = new Date(y, m - 1, d);
              console.log(imss.pago_rcv_infonavit_inicio+" "+mes_periodo_inicio);
              const mes_periodo_fin = new Date(imss.pago_rcv_infonavit_fin);
              mes_periodo_fin.setDate(new Date(mes_periodo_fin.getFullYear(), mes_periodo_fin.getMonth() + 1, 0).getDate());
              console.log(mes_periodo_fin);
              this.aportacionImssForm.patchValue({pago_rcv_infonavit: [mes_periodo_inicio, mes_periodo_fin]});
            }

            this.modelIMSSAport.folio_sua = imss.folio_sua;
            this.modelIMSSAport.clave_recepcion_archivo_pago = imss.clave_recepcion_archivo_pago;
            this.modelIMSSAport.propuesta_fecha_limite_pago = imss.propuesta_fecha_limite_pago;
            this.modelIMSSAport.linea_captura_sipare = imss.linea_captura_sipare;
            this.modelIMSSAport.propuesta_s_m_g_d_f = imss.propuesta_s_m_g_d_f_edit;
            this.modelIMSSAport.propuesta_fecha_salario_minimo_pago = imss.propuesta_fecha_salario_minimo_pago;
            this.modelIMSSAport.propuesta_valor_uma = imss.propuesta_valor_uma_edit;
            this.modelIMSSAport.propuesta_num_de_cotizantes = imss.propuesta_num_de_cotizantes;
            this.modelIMSSAport.propuesta_num_dias_a_cotizar = imss.propuesta_num_dias_a_cotizar;
            this.modelIMSSAport.propuesta_num_de_acreditados = imss.propuesta_num_de_acreditados;
            this.modelIMSSAport.observaciones = imss.observaciones;

            //this.desglose_total_cuotas = imss.cuotasDesglose;
            
            this.desglose_total_cuotas = imss.cuotasDesglose.map((r:any) => ({
              ...r,
              patronal: r.patronal ?? 0,
              obrera: r.obrera ?? 0,
              total: r.total ?? 0
            }));
            this.desglose_original = JSON.parse(
              JSON.stringify(this.desglose_total_cuotas)
            );

            //this.desgloseFA.clear();
            //this.desglose_total_cuotas.forEach(des_row => {
            //  this.desgloseFA.push(this.crearFila(des_row));
            //});
            this.recalcularTodo();
          });
        }
      }, error => {console.log(error);}
    );
  }

  descarga_centros_de_trabajo() {
    this.ctraserv.catalogoGeneralCentrosTrabajo().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.catalogo_registros_patronales = response.cent_trab;
          console.log(this.catalogo_registros_patronales);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  changeFechaContabilizacion(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.fecha_contabilizacion = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.fecha_contabilizacion != imss.aport_ssocial_fecha_contabilizacion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeFechaPresentacion(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.fecha_presentacion = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.fecha_presentacion != imss.aport_ssocial_fecha_presentacion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeNominaRPIMSS(registro_patronal_imss:any,aport_ssocial_token:string){
    var new_nomina_rpimss = document.getElementById("new_nomina_rpimss");
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    let rpimss = this.catalogo_registros_patronales.find((row:any) => registro_patronal_imss != '' && row.clave_registro_patronal_imss === registro_patronal_imss);
    this.modelIMSSAport.registro_patronal = rpimss.clave_registro_patronal_imss;
    const validacion = registro_patronal_imss != "" && this.validator.filtroAlfaNumerico(registro_patronal_imss) && typeof rpimss !== 'undefined' && typeof imss !== 'undefined' && this.modelIMSSAport.registro_patronal != imss.aport_ssocial_registro_patronal_serie;
    validacion ? this.validator.correctoSelectBrowser(new_nomina_rpimss) : this.validator.errorSelectBrowser(new_nomina_rpimss);
  }

  selectPeriodoPagoSegurosIMSS(aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    var periodo_imss = document.getElementById("periodo_imss");
    const periodo_pago_seguros = this.aportacionImssForm.get('periodo_pago_seguros')?.value;
    console.log(periodo_pago_seguros);
    const anio = periodo_pago_seguros.getFullYear();
    const mes = periodo_pago_seguros.getMonth() + 1;
    this.modelIMSSAport.periodo_pago_seguros_imss_anio = anio;
    this.modelIMSSAport.periodo_pago_seguros_imss_mes = mes;
    const validacion_anio = anio != '' && this.validator.filtroNum(anio) && typeof imss !== 'undefined' && this.modelIMSSAport.periodo_pago_seguros_imss_anio != imss.periodo_pago_seguros_imss_anio;
    const validacion_mes = mes != '' && this.validator.filtroNum(mes) && typeof imss !== 'undefined' && this.modelIMSSAport.periodo_pago_seguros_imss_mes != imss.periodo_pago_seguros_imss_mes;
    !validacion_anio && !validacion_mes ? this.validator.errorInputRow(periodo_imss) : this.validator.correctoInputRow(periodo_imss);
  }

  selectBimestrePagoRcv(aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    var bimestre_rcv = document.getElementById("bimestre_rcv");
    if (this.bimestre_pago_rcv_infonavit && this.bimestre_pago_rcv_infonavit.length === 2) {
      const fechaInicio = this.bimestre_pago_rcv_infonavit[0];
      const fechaFin = this.bimestre_pago_rcv_infonavit[1];
      const inicioDate = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
      const finDate = new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
      // Convertimos las fechas a formato yyyy-mm-dd
      const inicio = inicioDate.toISOString().split('T')[0];
      const fin = finDate.toISOString().split('T')[0];
      // Guardamos en tus variables de nómina
      this.modelIMSSAport.pago_rcv_infonavit_inicio = inicio;
      this.modelIMSSAport.pago_rcv_infonavit_fin = fin;

      const validacionInicio = fechaInicio && this.validator.filtroFecha(fechaInicio.toISOString().split('T')[0]) && typeof imss !== 'undefined' && this.modelIMSSAport.pago_rcv_infonavit_inicio != imss.pago_rcv_infonavit_inicio;
      const validacionFin = fechaFin && this.validator.filtroFecha(fechaFin.toISOString().split('T')[0]) && typeof imss !== 'undefined' && this.modelIMSSAport.pago_rcv_infonavit_fin != imss.pago_rcv_infonavit_fin;

      if (!validacionInicio && !validacionFin) {
        this.validator.errorInputRow(bimestre_rcv);
      } else {
        this.validator.correctoInputRow(bimestre_rcv);
      }
    } else {
      this.validator.errorInputRow(bimestre_rcv);
    }
    //console.log(this.modelIMSSAport);
  }

  keyupFolioSUA(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.folio_sua = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.folio_sua != imss.folio_sua;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupClaveRecepcionArchivoPago(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.clave_recepcion_archivo_pago = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.clave_recepcion_archivo_pago != imss.clave_recepcion_archivo_pago;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changePropuestaFechaLimitePago(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.propuesta_fecha_limite_pago = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.propuesta_fecha_limite_pago != imss.propuesta_fecha_limite_pago;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaReferenciaDEPagoLineaSIPARE(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.linea_captura_sipare = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.linea_captura_sipare != imss.linea_captura_sipare;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaSMGDF(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.propuesta_s_m_g_d_f = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.propuesta_s_m_g_d_f != imss.propuesta_s_m_g_d_f_edit;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changePropuestaFechaSalarioMinimoPago(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.propuesta_fecha_salario_minimo_pago = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.propuesta_fecha_salario_minimo_pago != imss.propuesta_fecha_salario_minimo_pago;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaValorUMA(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.propuesta_valor_uma = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.propuesta_valor_uma != imss.propuesta_valor_uma_edit;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaNumCotizantes(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.propuesta_num_de_cotizantes = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.propuesta_num_de_cotizantes != imss.propuesta_num_de_cotizantes;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaNumDiasCotizar(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.propuesta_num_dias_a_cotizar = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.propuesta_num_dias_a_cotizar != imss.propuesta_num_dias_a_cotizar;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaNumAcreditados(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.propuesta_num_de_acreditados = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof imss !== 'undefined' && this.modelIMSSAport.propuesta_num_de_acreditados != imss.propuesta_num_de_acreditados;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  onCantidadChange(rowIndex: number, field: 'patronal' | 'obrera' | 'total', event:any) {
    const inputDom = event.originalEvent.target;
    const value = inputDom.value;
    const cleanValue = value.replace(/,/g, '');
    
    if (cleanValue === '') {
      this.desglose_total_cuotas[rowIndex][field] = 0;
  
      // Quitar estilo de error porque borrar no es un error
      this.validator.correctoInputRow(inputDom);
  
      // Recalcular total patronal + obrera si aplica
      const p = Number(this.desglose_total_cuotas[rowIndex].patronal || 0);
      const o = Number(this.desglose_total_cuotas[rowIndex].obrera || 0);
      this.desglose_total_cuotas[rowIndex].total = this.roundToCents(p + o);
  
      this.recalcularTodo();
      return;
    }

    const validacion = cleanValue !== '' && this.validator.filtroNumPrime(Number(cleanValue));
    validacion ? this.validator.correctoInputRow(inputDom) : this.validator.errorInputRow(inputDom);
    if (validacion) {
      const v = this.parseNumber(cleanValue);
      this.desglose_total_cuotas[rowIndex][field] = v;
      if (field === 'patronal' || field === 'obrera') {
        // Si tienes la regla que total = patronal + obrera, la aplicamos:
        const p = Number(this.desglose_total_cuotas[rowIndex].patronal || 0);
        const o = Number(this.desglose_total_cuotas[rowIndex].obrera || 0);
        this.desglose_total_cuotas[rowIndex].total = this.roundToCents(p + o);
      }
    }
    console.log(this.desglose_total_cuotas);
    this.recalcularTodo();
  }

  // recalcula subtotales y totales globales
  recalcularTodo() {
    // lógica de ejemplo: recalcular subtotales para cada fila tipo 'subtotal' sumando las filas input entre subtotales.
    let globalP = 0, globalO = 0, globalT = 0;
    let localP = 0, localO = 0, localT = 0;

    for (let i = 0; i < this.desglose_total_cuotas.length; i++) {
      const r = this.desglose_total_cuotas[i];

      if (r.type === 'input') {
        localP += Number(r.patronal || 0);
        localO += Number(r.obrera || 0);
        localT += Number(r.total || 0);
      } else if (r.type === 'subtotal') {
        // asigna el subtotal calculado
        r.patronal = this.roundToCents(localP);
        r.obrera = this.roundToCents(localO);
        r.total = this.roundToCents(localT);

        // acumula al global
        globalP += localP;
        globalO += localO;
        globalT += localT;

        // reset local
        localP = 0; localO = 0; localT = 0;
      }
      // si es sección o label, nada; seguimos acumulando inputs hasta encontrar subtotal
    }

    // si hay inputs al final sin subtotal, los agregamos igual
    globalP += localP;
    globalO += localO;
    globalT += localT;

    this.totales.patronal = this.roundToCents(globalP);
    this.totales.obrera = this.roundToCents(globalO);
    this.totales.total = this.roundToCents(globalT);
  }

  // util: formatea número (usa Intl)
  formatNumber(v: number | undefined): string {
    const n = Number(v || 0);
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }

  // util: parsea valor de p-inputNumber (puede venir como number)
  parseNumber(v: any): number {
    if (v === null || v === undefined || v === '') return 0;
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  roundToCents(n: number): number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  keyupObservacionApSegSocial(event:any,aport_ssocial_token:string){
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    this.modelIMSSAport.observaciones = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && typeof imss !== 'undefined' && this.modelIMSSAport.observaciones != imss.observaciones;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  deleteAnexoDocs(aportinfo:any, token_documento: string): void {
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
        const doc = aportinfo.docsAnexos.find((docu: any) => docu.token_documento === token_documento);
        doc.eliminacion_proceso = doc.eliminacion_proceso ? false : true;
        this.cd.detectChanges();
      }
    });
  }

  public async droppedApSegSocial(files: NgxFileDropEntry[]) {
    this.filesAporSSOCIAL = files;
    this.AporSSOCIALAnexosNames = [];
    this.docsAporSSOCIALAnexos = [];
    const extensionesPermitidas = ['pdf', 'xml', 'jpg', 'jpeg', 'png', 'sua'];
    const tiposPermitidos = ['application/pdf','text/xml','image/jpeg','image/jpg','image/png'];
    
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i];
  
      if (!droppedFile.fileEntry.isFile) continue;
  
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      const file: File = await this.obtenerArchivo(fileEntry);
  
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const mime = file.type;
  
      // Validación principal
      const esValido =
        file.size <= 2000000 &&
        (tiposPermitidos.includes(mime) || extensionesPermitidas.includes(extension));
  
      if (!esValido) {
        let mensajeError = '';
  
        if (file.size > 2000000)
          mensajeError = `El archivo ${file.name} excede el tamaño permitido (2MB)`;
  
        if (!extensionesPermitidas.includes(extension))
          mensajeError = `El archivo ${file.name} debe ser pdf, xml, png, jpg o sua`;
  
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: mensajeError,
          showConfirmButton: false,
          timer: 3000
        });
  
        // Eliminar archivo no válido
        this.filesAporSSOCIAL.splice(i, 1);
        continue;
      }
  
      // Evita duplicados
      if (this.docsAporSSOCIALAnexos.some(f => f.name === file.name)) continue;
  
      // Guardar archivo
      this.AporSSOCIALAnexosNames.push({
        typoElement: mime,
        nameFile: file.name
      });
  
      this.docsAporSSOCIALAnexos.push(file);
    }

    console.log(this.docsAporSSOCIALAnexos.length);
  }
  
  private obtenerArchivo(entry: FileSystemFileEntry): Promise<File> {
    return new Promise(resolve => entry.file(resolve));
  }

  public fileOverApSegSocial(event:any){
    console.log(event);
  }

  public fileLeaveApSegSocial(event:any){
    console.log(event);
  }

  deleteAnexosApSegSocial(posicion:any){
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
          this.filesAporSSOCIAL.splice(posicion,1);
          this.docsAporSSOCIALAnexos.splice(posicion,1);
          this.AporSSOCIALAnexosNames.splice(posicion,1);
          console.log(this.docsAporSSOCIALAnexos.length);
        }
      }
    );
  }
  
  huboCambios(): boolean {
    return this.desglose_total_cuotas.some((row, i) => {
      const original = this.desglose_original[i];
      if (!original) return false;
  
      return (
        Number(row.patronal) !== Number(original.patronal) ||
        Number(row.obrera)   !== Number(original.obrera)   ||
        Number(row.total)    !== Number(original.total)
      );
    });
  }

  validaReportAssocialUpdate(aport_ssocial_token:string):Boolean {
    const imss = this.desglose_aportacion_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    if (typeof imss !== 'undefined') {
      const validaFechaContabilizacion = this.modelIMSSAport.fecha_contabilizacion != "" && this.validator.filtroFecha(this.modelIMSSAport.fecha_contabilizacion) && this.modelIMSSAport.fecha_contabilizacion != imss.aport_ssocial_fecha_contabilizacion;
      const validaFechaPresentacion = this.modelIMSSAport.fecha_presentacion != "" && this.validator.filtroFecha(this.modelIMSSAport.fecha_presentacion) && this.modelIMSSAport.fecha_presentacion != imss.aport_ssocial_fecha_presentacion;

      const validaRegistroPatronal = this.modelIMSSAport.registro_patronal != "" && this.validator.filtroAlfaNumerico(this.modelIMSSAport.registro_patronal) && this.modelIMSSAport.registro_patronal != imss.aport_ssocial_registro_patronal_serie;
  
      const validaPeriodoPagoSegIMSSAnio = this.modelIMSSAport.periodo_pago_seguros_imss_anio != '' && this.validator.filtroNum(this.modelIMSSAport.periodo_pago_seguros_imss_anio) && this.modelIMSSAport.periodo_pago_seguros_imss_anio != imss.periodo_pago_seguros_imss_anio;
      const validaPeriodoPagoSegIMSSMes = this.modelIMSSAport.periodo_pago_seguros_imss_mes != '' && this.validator.filtroNum(this.modelIMSSAport.periodo_pago_seguros_imss_mes) && this.modelIMSSAport.periodo_pago_seguros_imss_mes != imss.periodo_pago_seguros_imss_mes;
      const validaPeriodoPagoSegIMSS = validaPeriodoPagoSegIMSSAnio || validaPeriodoPagoSegIMSSMes;

      const validacionInicio = this.modelIMSSAport.pago_rcv_infonavit_inicio && this.validator.filtroFecha(this.modelIMSSAport.pago_rcv_infonavit_inicio) && this.modelIMSSAport.pago_rcv_infonavit_inicio != imss.pago_rcv_infonavit_inicio;
      const validacionFin = this.modelIMSSAport.pago_rcv_infonavit_fin && this.validator.filtroFecha(this.modelIMSSAport.pago_rcv_infonavit_fin) && this.modelIMSSAport.pago_rcv_infonavit_fin != imss.pago_rcv_infonavit_fin;
      const validaPagoRCVInfonavit = validacionInicio || validacionFin;

      const validaFolioSUA = this.modelIMSSAport.folio_sua != '' && this.validator.filtroAlfaNumerico(this.modelIMSSAport.folio_sua) && this.modelIMSSAport.folio_sua != imss.folio_sua;
      const validaClaveRecepcionArchivoPago = this.modelIMSSAport.clave_recepcion_archivo_pago != '' && this.validator.filtroAlfaNumerico(this.modelIMSSAport.clave_recepcion_archivo_pago) && this.modelIMSSAport.clave_recepcion_archivo_pago != imss.clave_recepcion_archivo_pago;
      const validaPropuestaFechaLimitePago = this.modelIMSSAport.propuesta_fecha_limite_pago != '' && this.validator.filtroFecha(this.modelIMSSAport.propuesta_fecha_limite_pago) && this.modelIMSSAport.propuesta_fecha_limite_pago != imss.propuesta_fecha_limite_pago;
      const validaPropuestaRefDEPagoSIPARE = this.modelIMSSAport.linea_captura_sipare != '' && this.validator.filtroAlfaNumerico(this.modelIMSSAport.linea_captura_sipare) && this.modelIMSSAport.linea_captura_sipare != imss.linea_captura_sipare;
      const validaPropuestaSMGDF = this.modelIMSSAport.propuesta_s_m_g_d_f != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_s_m_g_d_f) && this.modelIMSSAport.propuesta_s_m_g_d_f != imss.propuesta_s_m_g_d_f_edit;
      const validaPropuestaFechaSalarioMinimoPago = this.modelIMSSAport.propuesta_fecha_salario_minimo_pago != '' && this.validator.filtroFecha(this.modelIMSSAport.propuesta_fecha_salario_minimo_pago) && this.modelIMSSAport.propuesta_fecha_salario_minimo_pago != imss.propuesta_fecha_salario_minimo_pago;
      
      const validaPropuestaValorUMA = this.modelIMSSAport.propuesta_valor_uma != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_valor_uma) && this.modelIMSSAport.propuesta_valor_uma != imss.propuesta_valor_uma_edit;
      const validaPropuestaNumCotizantes = this.modelIMSSAport.propuesta_num_de_cotizantes != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_num_de_cotizantes) && this.modelIMSSAport.propuesta_num_de_cotizantes != imss.propuesta_num_de_cotizantes;
      const validaPropuestaNumDiasCotizar = this.modelIMSSAport.propuesta_num_dias_a_cotizar != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_num_dias_a_cotizar) && this.modelIMSSAport.propuesta_num_dias_a_cotizar != imss.propuesta_num_dias_a_cotizar;
      const validaPropuestaNumAcreditados = this.modelIMSSAport.propuesta_num_de_acreditados != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_num_de_acreditados) && this.modelIMSSAport.propuesta_num_de_acreditados != imss.propuesta_num_de_acreditados;
  
      const validaTotales = this.totales.patronal > 0 && this.totales.obrera > 0 && this.totales.total > 0 && this.huboCambios();
  
      const validacion_observacion = this.modelIMSSAport.observaciones != "" && this.validator.strFilter(this.modelIMSSAport.observaciones) && this.modelIMSSAport.observaciones.length >= 4 && this.modelIMSSAport.observaciones != imss.observaciones;

      const docs_eliminar = imss.docsAnexos.filter((docu: any) => docu.eliminacion_proceso === true);
      const validacion_eliminar_documents = docs_eliminar.length > 0;

      const validacion_documents = this.AporSSOCIALAnexosNames.length > 0; 
  
      return validaFechaContabilizacion || validaFechaPresentacion || validaRegistroPatronal || validaPeriodoPagoSegIMSS || validaPagoRCVInfonavit || validaFolioSUA || validaClaveRecepcionArchivoPago || validaPropuestaFechaLimitePago || validaPropuestaRefDEPagoSIPARE || 
        validaPropuestaSMGDF || validaPropuestaFechaSalarioMinimoPago || validaPropuestaValorUMA || validaPropuestaNumCotizantes || validaPropuestaNumDiasCotizar || 
        validaPropuestaNumAcreditados || validaTotales || validacion_observacion || validacion_eliminar_documents || validacion_documents;
    } else {
      return false;
    }
  }

  aportacionSegSocialReporteUpdate(form:{reset:() => void;},aport:any):void{
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
        //aport.aport_ssocial_token
        const docs_eliminar = aport.docsAnexos.filter((docu: any) => docu.eliminacion_proceso === true);
        this.aportacion_seguridad_social_form = false;
        this.imssServ.actualiza_aportacion_seg_social(
          aport.aport_ssocial_token,
          this.modelIMSSAport,
          this.desglose_total_cuotas,
          docs_eliminar,
          this.docsAporSSOCIALAnexos).subscribe(
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
              this.verDetalleIMSS(aport.aport_ssocial_token);
              form.reset();
              this.aportacion_seguridad_social_form = true;
              this.modelIMSSAport = new aportacionesIMSSModelo('','','','','','','','','','','','','','0','0','0','0','');
              
              this.nomina_registro_patronal = null;
              this.bimestre_pago_rcv_infonavit = null;
            
              this.AporSSOCIALAnexosNames = [];
              this.docsAporSSOCIALAnexos = [];
              this.filesAporSSOCIAL = [];
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
            //console.log(error);
          }
        );
      }
    })
  }

  cargaAportSegSocialIMSSXml(aport_ssocial_token:string,e: any, objeto: any): void {
    const doc_xml = objeto.files[0];
    console.log(doc_xml.type);
    const validacion_xml = doc_xml.size <= 2000000 && doc_xml.type == 'text/xml'; 
    this.ImssAportEvidenciaXml = validacion_xml ? doc_xml : null;
    validacion_xml ? this.lecturaXMLIMSS(aport_ssocial_token,objeto) : this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
  }

  limpiaXMLDataIMSS(aport_ssocial_token:string) {
    const isn_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    isn_data.aport_ssocial_cfdi_comprobante = [];
    isn_data.aport_ssocial_cfdi_emisor = [];
    isn_data.aport_ssocial_cfdi_receptor = [];
    isn_data.aport_ssocial_cfdi_conceptos = [];
    isn_data.aport_ssocial_cfdi_complemento = [];
  }

  lecturaXMLIMSS(aport_ssocial_token:string,objeto: any) {
    const isn_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    isn_data.aport_ssocial_cfdi_comprobante = [];
    console.log("lectura comienza");
    this.limpiaXMLDataIMSS(aport_ssocial_token);
    if (this.ImssAportEvidenciaXml) {
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

          const rfc_empresa_receptor = this.sessionContext.empresa_data?.rfc_emp || "";
          const company_empresa_receptor = this.sessionContext.empresa_data?.company_name_large || "";

          const valida_cion_emisor_rfc = emisor_Rfc.toLowerCase() === isn_data.prv_imss_rfc.toLowerCase();

          const valida_cion_receptor_Rfc = receptor_Rfc.toLowerCase() === rfc_empresa_receptor.toLowerCase();

          console.log("valida_cion_receptor_Rfc " + receptor_Rfc);

          const valida_cion_UUID = complemento_UUID && emisor_Rfc && receptor_Rfc && xmlNode.getAttribute('Total');

          if (valida_cion_emisor_rfc && valida_cion_receptor_Rfc && valida_cion_UUID) {
            const total = parseFloat(xmlNode.getAttribute('Total')).toFixed(6);
            
            this.cfdiServ.validaEstadoCFDIIMMS(complemento_UUID,emisor_Rfc,receptor_Rfc, total).subscribe(
              response => {
                if (response.status == 'success' && response.estado == 'Vigente' && xmlNode.getAttribute('TipoDeComprobante') == "I") {
                  if (!response.encontrado) {
                    this.validator.correctoInputRow(objeto);
                    this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: 'CFDI es correcto.' });
                    isn_data.aport_ssocial_valida_xml = 'validoXml';
                    
                    isn_data.aport_ssocial_cfdi_comprobante.push({
                      "FechaContabilizacion":xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "Version":xmlNode.getAttribute('Version') ? xmlNode.getAttribute('Version') : '---',
                      "Serie":xmlNode.getAttribute('Serie') ? xmlNode.getAttribute('Serie') : '---',
                      "Folio":xmlNode.getAttribute('Folio') ? xmlNode.getAttribute('Folio') : '---',
                      "Fecha":xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "Sello":xmlNode.getAttribute('Sello') ? xmlNode.getAttribute('Sello') : '---',
                      "FormaDePago":xmlNode.getAttribute('FormaPago') ? xmlNode.getAttribute('FormaPago') : '---',
                      "NoDeCertificado":xmlNode.getAttribute('NoCertificado') ? xmlNode.getAttribute('NoCertificado') : '---',
                      "Certificado":xmlNode.getAttribute('Certificado') ? xmlNode.getAttribute('Certificado') : '---',
                      "Subtotal":xmlNode.getAttribute('SubTotal') ? xmlNode.getAttribute('SubTotal') : '---',
                      "Descuento":xmlNode.getAttribute('Descuento') ? xmlNode.getAttribute('Descuento') : '0.00',
                      "Moneda":xmlNode.getAttribute('Moneda') ? xmlNode.getAttribute('Moneda') : 'MXN',
                      "TipoDeCambio":xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00',
                      "Total":xmlNode.getAttribute('Total') ? xmlNode.getAttribute('Total') : '0.00',
                      "Confirmacion":xmlNode.getAttribute('confirmacion') ? xmlNode.getAttribute('confirmacion') : '---',
                      "TipoDeComprobante":xmlNode.getAttribute('TipoDeComprobante') ? xmlNode.getAttribute('TipoDeComprobante') : '---',
                      "Exportacion":xmlNode.getAttribute('Exportacion') ? xmlNode.getAttribute('Exportacion') : '---',
                      "MetodoDePago":xmlNode.getAttribute('MetodoPago') ? xmlNode.getAttribute('MetodoPago') : '---',
                      "LugarDeExpedición":xmlNode.getAttribute('LugarExpedicion') ? xmlNode.getAttribute('LugarExpedicion') : '---',
                    });
                    console.log(isn_data.aport_ssocial_cfdi_comprobante);

                    nodo_emisor.forEach((child:any) => {
                      isn_data.aport_ssocial_cfdi_emisor.push({
                        "EmisorRfc":child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---',
                        "EmisorNombre":child.getAttribute('Nombre') ? child.getAttribute('Nombre') : '---',
                        "EmisorRegimenFiscal":child.getAttribute('RegimenFiscal') ? child.getAttribute('RegimenFiscal') : '---',
                      });
                    });
                    
                    nodo_receptor.forEach((child:any) => {
                      isn_data.aport_ssocial_cfdi_receptor.push({
                        "ReceptorRfc":child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---', 
                        "ReceptorDomicilioFiscal":child.getAttribute('DomicilioFiscalReceptor') ? child.getAttribute('DomicilioFiscalReceptor') : '---', 
                        "ReceptorRegimenFiscal":child.getAttribute('RegimenFiscalReceptor') ? child.getAttribute('RegimenFiscalReceptor') : '---', 
                        "ReceptorUsoCFDI":child.getAttribute('UsoCFDI') ? child.getAttribute('UsoCFDI') : '---',
                      });
                    });

                    nodo_conceptos.forEach(concepts => {
                      var list_conceptos:any = [];
                      concepts.children().forEach((cChild: any) => {
                        list_conceptos.push({
                          "Cantidad": cChild.getAttribute("Cantidad") ? cChild.getAttribute("Cantidad") : "",
                          "ClaveProdServ": cChild.getAttribute("ClaveProdServ") ? cChild.getAttribute("ClaveProdServ") : "",
                          "ClaveUnidad": cChild.getAttribute("ClaveUnidad") ? cChild.getAttribute("ClaveUnidad") : "",
                          "Descripcion": cChild.getAttribute("Descripcion") ? cChild.getAttribute("Descripcion") : "",
                          "ValorUnitario": cChild.getAttribute("ValorUnitario") ? cChild.getAttribute("ValorUnitario") : "0.00",
                          "Importe": cChild.getAttribute("Importe") ? cChild.getAttribute("Importe") : "0.00",
                          "Descuento": cChild.getAttribute("Descuento") ? cChild.getAttribute("Descuento") : "0.00",
                          "ObjetoImp": cChild.getAttribute("ObjetoImp") ? cChild.getAttribute("ObjetoImp") : "",
                        });
                      });
                      isn_data.aport_ssocial_cfdi_conceptos = list_conceptos;
                    console.log(isn_data.aport_ssocial_cfdi_conceptos);
                    });
                    
                    nodo_complemento.forEach((child:any) => {
                      const childNodes = child.children();
                      const timbreFiscalDigital = childNodes.getNodesByName("tfd:TimbreFiscalDigital");
                      timbreFiscalDigital.forEach((timbre:any) => {
                        isn_data.aport_ssocial_cfdi_complemento.push({
                          "Version":timbre.getAttribute("Version") ? timbre.getAttribute("Version") : '---',
                          "UUID":timbre.getAttribute("UUID") ? timbre.getAttribute("UUID") : '---',
                          "FechaTimbrado":timbre.getAttribute("FechaTimbrado") ? timbre.getAttribute("FechaTimbrado") : '---',
                          "RfcProvCertif":timbre.getAttribute("RfcProvCertif") ? timbre.getAttribute("RfcProvCertif") : '---',
                          "SelloCFD":timbre.getAttribute("SelloCFD") ? timbre.getAttribute("SelloCFD") : '---',
                          "NoCertificadoSAT":timbre.getAttribute("NoCertificadoSAT") ? timbre.getAttribute("NoCertificadoSAT") : '---',
                          "SelloSAT":timbre.getAttribute("SelloSAT") ? timbre.getAttribute("SelloSAT") : '---'
                        });
                      });
                    });
                    
                    console.log(isn_data.aport_ssocial_cfdi_complemento);
                    isn_data.aport_ssocial_fact_new_xml = this.ImssAportEvidenciaXml;
                    console.log(isn_data);
                  } else {
                    this.validator.errorInputRow(objeto);
                    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El documento CFDI ya se encuentra vinculado a otros procesos de compras'});
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
            isn_data.aport_ssocial_valida_xml = 'errorXml';
            if (!valida_cion_emisor_rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del emisor no coincide con el rfc de '+isn_data.prv_imss_entidad+'.' });
            if (!valida_cion_receptor_Rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del receptor no coincide con el rfc de '+company_empresa_receptor+'.' });
            if (!valida_cion_UUID) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos para validar el CFDI en el SAT.' });
            this.validator.errorInputRow(objeto);
          }
        } else {
          isn_data.aport_ssocial_valida_xml = 'errorXml';
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
          this.validator.errorInputRow(objeto);
        }
      };
      reader.readAsText(this.ImssAportEvidenciaXml);
    } else {
      this.validator.errorInputRow(objeto);
    }
  }

  cargaAportSegSocialIMSSPdf(aport_ssocial_token:string,e: any, objeto: any): void {
    console.log('application/pdf');
    const doc_pdf = objeto.files[0];
    const validacion_pdf = doc_pdf.size <= 2000000 && (doc_pdf.type == 'application/pdf');
    this.ImssAportEvidenciaPdf = validacion_pdf ? doc_pdf : null;
    validacion_pdf ? this.validator.correctoInputRow(objeto) : this.validator.errorInputRow(objeto);
    if (validacion_pdf) {
      const isn_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
      isn_data.aport_ssocial_fact_new_pdf = this.ImssAportEvidenciaPdf;
    } else {
      let mensajeError = '';
      if (doc_pdf.size > 2000000) mensajeError = 'El archivo excede el tamaño permitido (2MB)';
      if (doc_pdf.type != 'application/pdf') mensajeError = 'El archivo Debe ser en formato pdf';
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: mensajeError });
    }
  }

  validaCFDIIMSSLoaded(aport_ssocial_token:string):boolean {
    const isn_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    const validacion = isn_data.aport_ssocial_factura_doc_xml === null && isn_data.aport_ssocial_factura_doc_pdf === null && 
    isn_data.aport_ssocial_fact_new_xml !== null && isn_data.aport_ssocial_fact_new_pdf !== null;
    return validacion;
  }

  cargaAportSegSocialIMSSCFDIS(aport_ssocial_token:string):void{
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
        let aportaciones = this.catalogo_aportaciones_de_imss.filter((row:any) => row.aport_ssocial_token === aport_ssocial_token);
        this.imssServ.carga_cfdi_aportacion_seg_social(aport_ssocial_token,aportaciones).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            console.log(response);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
              //this.viewFormulario = true;
              //this.centTrabModel = new centroTrabajoModelo('','','','',false,'','');
              //this.relInterna.mensajeTrabajadorRegistro("centro_trabajo_registrado");
              this.listando_imss_aportaciones();
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

  /*infonavit*/
  cargaAportSegSocialInfonavitXml(aport_ssocial_token:string,e: any, objeto: any): void {
    const doc_xml = objeto.files[0];
    console.log(doc_xml.type);
    const validacion_xml = doc_xml.size <= 2000000 && doc_xml.type == 'text/xml'; 
    this.InfonavitAportEvidenciaXml = validacion_xml ? doc_xml : null;
    validacion_xml ? this.lecturaXMLInfonavit(aport_ssocial_token,objeto) : this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
  }

  limpiaXMLDataInfonavit(aport_ssocial_token:string) {
    const infonavit_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    infonavit_data.aport_infonavit_cfdi_comprobante = [];
    infonavit_data.aport_infonavit_cfdi_emisor = [];
    infonavit_data.aport_infonavit_cfdi_receptor = [];
    infonavit_data.aport_infonavit_cfdi_conceptos = [];
    infonavit_data.aport_infonavit_cfdi_complemento = [];
  }

  lecturaXMLInfonavit(aport_ssocial_token:string,objeto: any) {
    const infonavit_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    infonavit_data.aport_infonavit_cfdi_comprobante = [];
    console.log("lectura comienza");
    this.limpiaXMLDataInfonavit(aport_ssocial_token);
    if (this.InfonavitAportEvidenciaXml) {
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

          const rfc_empresa_receptor = this.sessionContext.empresa_data?.rfc_emp;
          const company_empresa_receptor = this.sessionContext.empresa_data?.company_name_large;

          const valida_cion_emisor_rfc = emisor_Rfc.toLowerCase() === infonavit_data.prv_infonavit_rfc.toLowerCase();

          const valida_cion_receptor_Rfc = receptor_Rfc.toLowerCase() === rfc_empresa_receptor.toLowerCase();

          console.log("valida_cion_receptor_Rfc " + receptor_Rfc);

          const valida_cion_UUID = complemento_UUID && emisor_Rfc && receptor_Rfc && xmlNode.getAttribute('Total');

          if (valida_cion_emisor_rfc && valida_cion_receptor_Rfc && valida_cion_UUID) {
            const total = parseFloat(xmlNode.getAttribute('Total')).toFixed(6);
            
            this.cfdiServ.validaEstadoCFDICompras(complemento_UUID,emisor_Rfc,receptor_Rfc, total).subscribe(
              response => {
                if (response.status == 'success' && response.estado == 'Vigente' && xmlNode.getAttribute('TipoDeComprobante') == "I") {
                  if (!response.encontrado) {
                    this.validator.correctoInputRow(objeto);
                    this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: 'CFDI es correcto.' });
                    infonavit_data.aport_infonavit_valida_xml = 'validoXml';
                    
                    infonavit_data.aport_infonavit_cfdi_comprobante.push({
                      "FechaContabilizacion":xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "Version":xmlNode.getAttribute('Version') ? xmlNode.getAttribute('Version') : '---',
                      "Serie":xmlNode.getAttribute('Serie') ? xmlNode.getAttribute('Serie') : '---',
                      "Folio":xmlNode.getAttribute('Folio') ? xmlNode.getAttribute('Folio') : '---',
                      "Fecha":xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "Sello":xmlNode.getAttribute('Sello') ? xmlNode.getAttribute('Sello') : '---',
                      "FormaDePago":xmlNode.getAttribute('FormaPago') ? xmlNode.getAttribute('FormaPago') : '---',
                      "NoDeCertificado":xmlNode.getAttribute('NoCertificado') ? xmlNode.getAttribute('NoCertificado') : '---',
                      "Certificado":xmlNode.getAttribute('Certificado') ? xmlNode.getAttribute('Certificado') : '---',
                      "Subtotal":xmlNode.getAttribute('SubTotal') ? xmlNode.getAttribute('SubTotal') : '---',
                      "Descuento":xmlNode.getAttribute('Descuento') ? xmlNode.getAttribute('Descuento') : '0.00',
                      "Moneda":xmlNode.getAttribute('Moneda') ? xmlNode.getAttribute('Moneda') : 'MXN',
                      "TipoDeCambio":xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00',
                      "Total":xmlNode.getAttribute('Total') ? xmlNode.getAttribute('Total') : '0.00',
                      "Confirmacion":xmlNode.getAttribute('confirmacion') ? xmlNode.getAttribute('confirmacion') : '---',
                      "TipoDeComprobante":xmlNode.getAttribute('TipoDeComprobante') ? xmlNode.getAttribute('TipoDeComprobante') : '---',
                      "MetodoDePago":xmlNode.getAttribute('MetodoPago') ? xmlNode.getAttribute('MetodoPago') : '---',
                      "LugarDeExpedición":xmlNode.getAttribute('LugarExpedicion') ? xmlNode.getAttribute('LugarExpedicion') : '---',
                    });
                    console.log(infonavit_data.aport_infonavit_cfdi_comprobante);

                    nodo_emisor.forEach((child:any) => {
                      infonavit_data.aport_infonavit_cfdi_emisor.push({
                        "EmisorRfc":child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---',
                        "EmisorNombre":child.getAttribute('Nombre') ? child.getAttribute('Nombre') : '---',
                        "EmisorRegimenFiscal":child.getAttribute('RegimenFiscal') ? child.getAttribute('RegimenFiscal') : '---',
                      });
                    });
                    
                    nodo_receptor.forEach((child:any) => {
                      infonavit_data.aport_infonavit_cfdi_receptor.push({
                        "ReceptorRfc":child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---', 
                        "ReceptorDomicilioFiscal":child.getAttribute('DomicilioFiscalReceptor') ? child.getAttribute('DomicilioFiscalReceptor') : '---', 
                        "ReceptorRegimenFiscal":child.getAttribute('RegimenFiscalReceptor') ? child.getAttribute('RegimenFiscalReceptor') : '---', 
                        "ReceptorUsoCFDI":child.getAttribute('UsoCFDI') ? child.getAttribute('UsoCFDI') : '---',
                      });
                    });

                    nodo_conceptos.forEach(concepts => {
                      var list_conceptos:any = [];
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
                      infonavit_data.aport_infonavit_cfdi_conceptos = list_conceptos;
                    console.log(infonavit_data.aport_infonavit_cfdi_conceptos);
                    });
                    
                    nodo_complemento.forEach((child:any) => {
                      const childNodes = child.children();
                      const timbreFiscalDigital = childNodes.getNodesByName("tfd:TimbreFiscalDigital");
                      timbreFiscalDigital.forEach((timbre:any) => {
                        infonavit_data.aport_infonavit_cfdi_complemento.push({
                          "Version":timbre.getAttribute("Version") ? timbre.getAttribute("Version") : '---',
                          "UUID":timbre.getAttribute("UUID") ? timbre.getAttribute("UUID") : '---',
                          "FechaTimbrado":timbre.getAttribute("FechaTimbrado") ? timbre.getAttribute("FechaTimbrado") : '---',
                          "RfcProvCertif":timbre.getAttribute("RfcProvCertif") ? timbre.getAttribute("RfcProvCertif") : '---',
                          "SelloCFD":timbre.getAttribute("SelloCFD") ? timbre.getAttribute("SelloCFD") : '---',
                          "NoCertificadoSAT":timbre.getAttribute("NoCertificadoSAT") ? timbre.getAttribute("NoCertificadoSAT") : '---',
                          "SelloSAT":timbre.getAttribute("SelloSAT") ? timbre.getAttribute("SelloSAT") : '---'
                        });
                      });
                    });
                    
                    console.log(infonavit_data.aport_infonavit_cfdi_complemento);
                    infonavit_data.aport_infonavit_fact_new_xml = this.InfonavitAportEvidenciaXml;
                    console.log(infonavit_data);
                  } else {
                    this.validator.errorInputRow(objeto);
                    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El documento CFDI ya se encuentra vinculado a otros procesos de compras'});
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
            infonavit_data.aport_infonavit_valida_xml = 'errorXml';
            if (!valida_cion_emisor_rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del emisor no coincide con el rfc de '+infonavit_data.prv_infonavit_entidad+'.' });
            if (!valida_cion_receptor_Rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del receptor no coincide con el rfc de '+company_empresa_receptor+'.' });
            if (!valida_cion_UUID) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos para validar el CFDI en el SAT.' });
            this.validator.errorInputRow(objeto);
          }
        } else {
          infonavit_data.aport_infonavit_valida_xml = 'errorXml';
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
          this.validator.errorInputRow(objeto);
        }
      };
      reader.readAsText(this.InfonavitAportEvidenciaXml);
    } else {
      this.validator.errorInputRow(objeto);
    }
  }

  cargaAportSegSocialInfonavitPdf(aport_ssocial_token:string,e: any, objeto: any): void {
    console.log('application/pdf');
    const doc_pdf = objeto.files[0];
    const validacion_pdf = doc_pdf.size <= 2000000 && (doc_pdf.type == 'application/pdf');
    this.InfonavitAportEvidenciaPdf = validacion_pdf ? doc_pdf : null;
    validacion_pdf ? this.validator.correctoInputRow(objeto) : this.validator.errorInputRow(objeto);
    if (validacion_pdf) {
      const infonavit_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
      infonavit_data.aport_infonavit_fact_new_pdf = this.InfonavitAportEvidenciaPdf;
    } else {
      let mensajeError = '';
      if (doc_pdf.size > 2000000) mensajeError = 'El archivo excede el tamaño permitido (2MB)';
      if (doc_pdf.type != 'application/pdf') mensajeError = 'El archivo Debe ser en formato pdf';
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: mensajeError });
    }
  }

  validaInfonavitCFDILoaded(aport_ssocial_token:string):boolean {
    const infonavit_data = this.catalogo_aportaciones_de_imss.find((row:any) => row.aport_ssocial_token === aport_ssocial_token);
    const validacion = infonavit_data.aport_infonavit_factura_doc_xml === null && infonavit_data.aport_infonavit_factura_doc_pdf === null && infonavit_data.aport_infonavit_fact_new_xml !== null && infonavit_data.aport_infonavit_fact_new_pdf !== null;
    return validacion;
  }

  cargaAportSegSocialInfonavitCFDIS(aport_ssocial_token:string):void{
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
        let aportaciones = this.catalogo_aportaciones_de_imss.filter((row:any) => row.aport_ssocial_token === aport_ssocial_token);
        this.imssServ.carga_cfdi_aportacion_infonavit(aport_ssocial_token,aportaciones).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            console.log(response);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
              //this.viewFormulario = true;
              //this.centTrabModel = new centroTrabajoModelo('','','','',false,'','');
              //this.relInterna.mensajeTrabajadorRegistro("centro_trabajo_registrado");
              this.listando_imss_aportaciones();
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

  deleteAportacionSegSocial(aport_ssocial_token:string){
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
        this.imssServ.eliminar_aportacion_seg_social(aport_ssocial_token).subscribe(
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
              this.listando_imss_aportaciones();
              this.listando_imss_deleted_declaraciones();
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

  verDeletedImssDeclaraciones(){
    this.modal_deleted_aportaciones_seguridad_social = true;
  }

  listando_imss_deleted_declaraciones() {
    this.imssServ.catalogo_deleted_aportaciones_seg_social().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogo_deleted_aportaciones_de_imss = response.aportaciones;
          console.log(this.catalogo_deleted_aportaciones_de_imss);
        }
      }, error => {console.log(error);}
    );
  }

  restauraAportacionSegSocial(aport_ssocial_token:any){
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
        this.imssServ.restaurar_aportacion_seg_social(aport_ssocial_token).subscribe(
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
              this.listando_imss_aportaciones();
              this.listando_imss_deleted_declaraciones();
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

  deletePermanenteAportacionSegSocial(aport_ssocial_token:any){
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
        this.imssServ.eliminacion_permanente_aportacion_seg_social(aport_ssocial_token).subscribe(
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
              this.listando_imss_aportaciones();
              this.listando_imss_deleted_declaraciones();
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

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
