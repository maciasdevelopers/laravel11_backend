import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { AsimiladosService } from '../../../../../servicios/ssic/asimilados-service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';
import { SessionContextService } from '../../../../../servicios/session-context';
import { MonedasService } from '../../../../../servicios/monedas.service';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { nominaTotalesModelo } from '../../../../../modelos/nominas/nominaTotalesModelo';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { Subscription } from 'rxjs';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { asimiladosModelo } from '../../../../../modelos/asimiladosModelo';
import { ComprasServService } from '../../../../../servicios/ssic/compras-serv.service';
import { ImpuestosServService } from '../../../../../servicios/ssic/impuestos-serv.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';

@Component({
  selector: 'vhumano_reportes_asimilados_analisis',
  templateUrl: './analisis_de_asimilados.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/breadcrumb.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/canvas.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/cards.css',
    '../../vhumano.css',
    './analisis_de_asimilados.css'
  ],
  providers: [ConfirmationService]
})
export class VHReportesAsimiladosAnalisisComponent implements OnInit {
  public identidad: any;
  public modelAsimilados: asimiladosModelo;

  list_asimilados_reportes: any = [];
  indicador_asim_rep_list:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoListAsimRep: Date[] | undefined;
  
  public ver_asimilados_seguimiento_pagos: boolean = false;
  asimilados_seguimiento_pagos: any = [];
  searchPagoGeneral: any = [];
  asimilados_pagos_historial: any = [];
  search_pagos_done: any = [];

  public ver_asimilados_desglose: boolean = false;
  asimilados_desglose_info: any = [];
  asimilados_desglose_tokens: any = [];
  public asimilados_detalle_token: string = "";
  public asimilados_detalle_folio: string = "";

  //desglose y carga de cfdi
  public viewNewAsimiladoForm: boolean = true;
  catalogo_monedas_api: any = [];
  asimilado_arreglo_vacio:any = [];
  serviciosVincLista: any = [];
  servCatGeneral: any = [];
  expandRowsServicios: { [s: string]: boolean } = {};

  public asimilado_fecha_contabilizacion: string = "";
  public asimilado_token: string = "";
  public asimilado_observaciones: string = "";

  public imagenEvidenciaXml: any;
  public resultXml: string = '';
  //cfdi:Comprobante
  dataCFDI_comprobante_obj: any = {};
  public dataCFDI_comprobante_TipoComprobante: string = '';
  public dataCFDI_comprobante_TipoCambio: string = '1.00';
  public dataCFDI_comprobante_Moneda: string = '';
  public dataCFDI_comprobante_MoneDecimales: number = 2;
  public dataCFDI_comprobante_Total: string = '';
  public dataCFDI_comprobante_formaPago: string = '';
  public dataCFDI_comprobante_MetodoPago: string = '';
  //cfdi:Comprobante//cfdi:Emisor
  dataCFDIEmisor_obj: any = {};
  public dataCFDI_emisor_Rfc: string = '';
  //cfdi:Comprobante//cfdi:Receptor
  dataCFDIReceptor_obj: any = {};
  dataReceptor: any = [];
  public dataCFDI_receptor_Rfc: string = '';
  public dataCFDI_receptor_UsoCFDI: string = '';
  public dataCFDI_receptor_Rfc_registrado: boolean = false;
  public dataCFDI_receptor_new_registro: boolean = false;
  //dataCFDIRelacionados:any = [];
  dataCFDIRelacionados_obj: any = {};
  //cfdi:Comprobante//cfdi:Conceptos'
  dataCFDI_conceptos: any = [];
  dataCFDIBuscarConcepto: any = [];
  //impuestos //cfdi:Comprobante/cfdi:Impuestos
  public dataCFDI_impuestos_retenidos_total: number = 0;
  dataCFDI_impuestos_retenidos_lista: any = [];
  public dataCFDI_impuestos_trasladados_total: number = 0;
  dataCFDI_impuestos_trasladados_lista: any = [];
  //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
  //dataCFDIComplemento:any = [];
  dataCFDIComplemento_obj: any = {};
  public dataCFDI_complemento_UUID: string = '';
  public dataCFDI_complemento_SelloCFD: string = '';
  dataCFDIComplementoNomina_obj: any = {};
  dataCFDIComplementoNominaReceptor_obj: any = {};
  dataCFDIComplementoNominaPercepciones_obj: any = {};
  public dataCFDIComplementoNominaPercepcionConceptos: any = [];
  dataCFDIComplementoNominaDeducciones_obj: any = {};

  public dataCFDI_complemento_DeducTotalImpRet: string = '';
  public dataCFDI_complemento_DeducConceptos: any = [];
  expandedRowsRetenciones: { [s: string]: boolean } = {};

  rangoPeriodoPagoAsimilados: Date[] | undefined;
  private proveedorRegistroSubscription!: Subscription;

  public AsimiladosAnexosNames: any = [];
  public docsAsimiladosAnexos: any[] = [];
  public filesAsimilados: NgxFileDropEntry[] = [];

  //Factura CFDI (PDF)
  public imagenEvidenciaPdf: any;

  dataCFDIBuscarRetenciones: any = [];
  impRetencionesCatalogo: any = [];
  indicadorImpRetenciones:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoImpRetenciones: Date[] | undefined;

  public percepciones_servicio_save:string = '';
  public deducciones_impuesto_save:string = '';
  public selectvalidatexmlArticulos: boolean = false;

  asimiladoForm: FormGroup;

  list_asimilados_reportes_eliminados: any = [];
  constructor(
    private translate: TranslateService,
    private validator: ValidatorServService,
    private primeAlerts: MessageService,
    private relInterna: ComunicacionInternaService,
    private asimService: AsimiladosService,
    private sentinela: SentinelArkManager,
    private cfdiServ: CFDIService,
    private sessionContext: SessionContextService,
    private _monedasServ: MonedasService,
    private provServ: ProveedoresService,
    private cd: ChangeDetectorRef,
    private _comprServ: ComprasServService,
    private _catImp: ImpuestosServService,
    private servXlsx: DescargaExcel,
    private fb: FormBuilder
  ){
    this.identidad = this.sentinela.getIdentifUsuario();
    this.modelAsimilados = new asimiladosModelo('','','','',2,'',0.00,false,'',0.00,false,'');
    this.asimiladoForm = this.fb.group({
      periodo_de_pago: [null],
      fecha_de_pago: [null],
      mon_name: [null],
      dias_pagados: [null],
      total_percepciones: [null],
      total_deducciones: [null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaAsimiladosRegistro();
    this.ver_asimilados_reportes('hoy');
    this.listando_reportes_deleted_de_asimilados();
    this.monedasCatalogoApi();

    this.searchPagoGeneral = ['folio_ordenPago', 'fecha_contabilizacion_orden_pago', 'factura_relacionada_string', 'orden_bloqueada', 'fecha_contabilizacion_doc_anterior', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'orden_emisor_emp', 'autorizacion_pay_text', 'fecha_autorizacion_pay', 'pago_anticipado', 'status_pago', 'status_pago_date', 'pago_realizado_folio', 'pago_realizado_fecha_contabilizacion',
      'pago_realizado_proveedor_name', 'pago_realizado_acreedor_name', 'pago_realizado_forma_pago_vinculada', 'pago_realizado_forma_metodo_pago_cfdi', 'pago_realizado_monto', 'pago_realizado_tipo_cambio', 'pago_realizado_observaciones',
      'importe_total_inicial', 'importe_autorizado_inicial_format', 'importe_autorizado_final', 'debe_format'];

    this.search_pagos_done = ['token_pagos', 'folio_pagos', 'fecha_contabilizacion', 'pago_cancelado', 'pago_folio_cancelacion', 'pago_fecha_cancelacion', 'pago_fecha_contabilizacion_cancelacion', 'monto_pago',
      'monto_pago_format', 'monto_pago_resultant', 'observacionesPago', 'tipo_cambio', 'tipo_cambio_format', 'p_moneda', 'forma_pago_pago', 'forma_metodo_pago_cfdi', 'destino', 'tercero_token', 'tercero_folio', 'tercero_name',
      'tercero_comercial_name', 'financeadoa_token', 'financeadoa_folio', 'financeadoa_name', 'financeadoa_comercial_name', 'concepto', 'personal_pago_token', 'personal_pago_folio', 'personal_pago_name', 'pago_autorizado',
      'fecha_pago_auth', 'personal_autoriza_token', 'personal_autoriza_folio', 'personal_autoriza_name', 'ordenes_relacionadas_lista', 'orden_factura_relacionada_typo', 'orden_factura_relacionada_token',
      'orden_factura_relacionada_string', 'desglose_pagos_medio', 'medio_pago_vinculado', 'doc_anterior_folio', 'doc_anterior_fecha_contabilizacion'];
  }

  monedasCatalogoApi() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  descargarPlantillaAsimilados() {
    this.servXlsx.descargar_plantilla_nomina();
  }

  descarga_excel_asimilados_reportes() {

  }

  getRespuestaAsimiladosRegistro() {
    this.relInterna.mensajeVHAsimiladosRegistro$.subscribe(
      (mensaje: any) => {
        if (mensaje == "asimilados_registro") {
          this.listando_asimilados_reportes();
        }
      }
    );
  }

  listando_asimilados_reportes() {
    this.ver_asimilados_reportes(this.indicador_asim_rep_list);
  }

  ver_asimilados_reportes(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicador_asim_rep_list = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var asim_rep_otras_fechas = document.getElementById("asim_rep_otras_fechas");
      if (this.rangoPeriodoListAsimRep && this.rangoPeriodoListAsimRep.length === 2) {
        const dateInicio = this.rangoPeriodoListAsimRep[0];
        const dateFin = this.rangoPeriodoListAsimRep[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(asim_rep_otras_fechas);
          } else {
            this.validator.errorInputRow(asim_rep_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(asim_rep_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(asim_rep_otras_fechas);
        return;
      }
    }
    
    this.asimService.catalogo_reportes_asimilados(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaDecIsnList(response),
      error: (err) => this.manejarErrorDecIsnList(err)
    });
  }

  private procesarRespuestaDecIsnList(response: any) {
    if (response.status === 'success') {
      this.list_asimilados_reportes = response.reportes;
      console.log(this.list_asimilados_reportes);
      this.cd.detectChanges();
    } else {
      this.list_asimilados_reportes = [];
    }
  }

  private manejarErrorDecIsnList(error: any) {
    console.error('Error al cargar reportes de asimilados:', error);
    this.list_asimilados_reportes = [];
  }

  verReporteSeguimientoOrdenPago(token_reporte_asim: any, asim_ord_pago_token: any) {
    this.ver_asimilados_seguimiento_pagos = true;
    this.asimService.asimiladosSeguimientoOrdenPago(token_reporte_asim, asim_ord_pago_token).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.list_asimilados_reportes.find((row: any) => row.token_reporte_asim === token_reporte_asim);
          this.asimilados_detalle_folio = typeof rep !== 'undefined' ? rep.folio_interior : '';
          this.asimilados_seguimiento_pagos = response.seguimiento_orden_pago.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
          this.asimilados_pagos_historial = response.pagos_realizados;
          console.log(this.asimilados_seguimiento_pagos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verAsimiladosDesglose(token_reporte_asim: any) {
    this.asimilado_arreglo_vacio = [{"id":1}];
    this.monedasCatalogoApi();

    this.dataCFDIBuscarRetenciones = ['token_catalogo_impuesto', 'folio_impuesto', 'abreviacion_impuesto', 'concepto_impuesto', 'modulo', 'nivel_aplicacion', 'catalogo_sat',
      'tipo_impuesto', 'exento', 'calculo', 'txtimporte', 'tipo_cambio', 'monedas_codigo', 'monedas_moneda', 'base_aplicable', 'desglose', 'gl_por_pagarcobrar', 'gl_pagada_o_cobrada', 'observaciones'];

    this.asimService.asimiladosDesglose(token_reporte_asim).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.list_asimilados_reportes.find((row: any) => row.token_reporte_asim === token_reporte_asim);
          this.asimilados_detalle_folio = typeof rep !== 'undefined' ? rep.folio_interior : '';
          this.asimilados_detalle_token = token_reporte_asim;
          this.ver_asimilados_desglose = true;
          this.asimilados_desglose_info = response.reporte;
          this.resultXml = "validoXml";
          this.asimilados_desglose_info.forEach((asim_data:any) => {

            this.asimilados_desglose_tokens = asim_data.asim_desglose;
            asim_data.asim_desglose.forEach((adesg:any) => {
              this.asimilado_token = adesg.desglose_asim_receptor_token;
            });

            asim_data.asim_cfdi_comprobante.forEach((comp:any) => {
              this.dataCFDI_comprobante_obj = {
                version: comp.version || '---',
                serie: comp.serie || '---',
                folio: comp.folio || '---',
                fecha: comp.fecha || '---',
                forma_de_pago: comp.forma_de_pago || '---',
                subtotal: comp.subtotal || '---',
                Descuento: comp.Descuento || '0.00',
                moneda: comp.moneda || '---',
                tipo_de_cambio: comp.tipo_de_cambio || '1.00',
                total: comp.total || '---',
                confirmacion: comp.confirmacion || '---',
                tipo_de_comprobante: comp.tipo_de_comprobante || '---',
                metodo_de_pago: comp.metodo_de_pago || '---',
                lugar_de_expedicion: comp.lugar_de_expedicion || '---',
                no_de_certificado: comp.no_de_certificado || '---',
                sello: comp.sello || '---',
                certificado: comp.certificado || '---'
              };
            });

            asim_data.asim_cfdi_emisor.forEach((emi:any) => {
              this.dataCFDIEmisor_obj = {
                rfc_del_emisor: emi.rfc_del_emisor || '---',
                nombre_del_emisor: emi.nombre_del_emisor || '---',
                regimen_fiscal_del_emisor: emi.regimen_fiscal_del_emisor || '---',
              };
            });

            asim_data.asim_cfdi_receptor.forEach((rec:any) => {
              this.dataCFDI_receptor_Rfc = rec.Rfc || '---';
              this.dataCFDIReceptor_obj = {
                Rfc: rec.Rfc || '---',
                Nombre: rec.nombre || '---',
                UsoCFDI: rec.UsoCFDI || '---',
                RegimenFiscalReceptor: rec.RegimenFiscalReceptor || '---',
                DomicilioFiscalReceptor: rec.DomicilioFiscalReceptor || '---',
              };
              this.revisa_receptor_proveedor_registrado();
            });

            this.dataCFDI_conceptos = asim_data.asim_cfdi_conceptos;

            asim_data.asim_desglose.forEach((desg:any) => {
              this.modelAsimilados.moneda_code = desg.desglose_asim_moneda || '';
              this.asimiladoForm.patchValue({ mon_name: desg.desglose_asim_moneda });
              this.modelAsimilados.percepciones_servicio_token = desg.servicio_asociado_token;
              this.modelAsimilados.deducciones_impuesto_token = desg.impuesto_asociado_token;
            });

            asim_data.asim_cfdi_complementonomina.forEach((cnomi:any) => {           
              console.log(cnomi.FechaInicialPago);   
              this.modelAsimilados.periodo_inicio = cnomi.FechaInicialPago || '';
              this.modelAsimilados.periodo_fin = cnomi.FechaFinalPago || '';
              
              const [y, m, d] = cnomi.FechaInicialPago.split('-').map(Number);
              const mes_periodo_inicio = new Date(y, m - 1, d);
              console.log(cnomi.FechaInicialPago + " " + mes_periodo_inicio);
              const mes_periodo_fin = new Date(cnomi.FechaFinalPago);
              mes_periodo_fin.setDate(new Date(mes_periodo_fin.getFullYear(), mes_periodo_fin.getMonth() + 1, 0).getDate());
              console.log(mes_periodo_fin);
              this.asimiladoForm.patchValue({ periodo_de_pago: [mes_periodo_inicio, mes_periodo_fin] });
      
              this.modelAsimilados.fecha_pago = cnomi.FechaPago || '';
              this.asimiladoForm.patchValue({ fecha_de_pago: cnomi.FechaPago });
      
              this.modelAsimilados.dias_pagados = cnomi.NumDiasPagados || '';
              this.asimiladoForm.patchValue({ dias_pagados: cnomi.NumDiasPagados });
      
              this.modelAsimilados.total_percepciones = cnomi.TotalPercepciones || '';
              this.asimiladoForm.patchValue({ total_percepciones: cnomi.TotalPercepciones });
      
              this.modelAsimilados.total_deducciones = cnomi.TotalDeducciones || '';
              this.asimiladoForm.patchValue({ total_deducciones: cnomi.TotalDeducciones });
            });
          });
          console.log(this.asimilados_desglose_info);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listar_catalogo_general_serv() {
    //listaServiciosComprasProv
    this._comprServ.listaServiciosCompras().subscribe(
      response => {
        if (response.status == 'success') {
          this.servCatGeneral = response.listaArticulos;
          console.log(this.servCatGeneral);
          const expandRowsProductos: { [s: string]: boolean } = {};
          this.servCatGeneral.forEach((row: any) => {
            row.expandedRowsProductos = expandRowsProductos;
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  lista_impuestos_catalogo_retenciones() {
    this.ver_impuestos_catalogo_retenciones(this.indicadorImpRetenciones);
  }

  ver_impuestos_catalogo_retenciones(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorImpRetenciones = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var imp_retenciones_otras_fechas = document.getElementById("imp_retenciones_otras_fechas");
      if (this.rangoPeriodoImpRetenciones && this.rangoPeriodoImpRetenciones.length === 2) {
        const dateInicio = this.rangoPeriodoImpRetenciones[0];
        const dateFin = this.rangoPeriodoImpRetenciones[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(imp_retenciones_otras_fechas);
          } else {
            this.validator.errorInputRow(imp_retenciones_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(imp_retenciones_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(imp_retenciones_otras_fechas);
      }
    }
    
    this._catImp.catalogoGeneralImpuestosRetencionesTrue(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaRetImp(response),
      error: (err) => this.manejarErrorRetImp(err)
    });
  }

  private procesarRespuestaRetImp(response: any) {
    if (response.status === 'success') {
      this.impRetencionesCatalogo = response.impuestos;
      console.log(this.impRetencionesCatalogo);
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.impRetencionesCatalogo = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorRetImp(error: any) {
    console.error('Error al cargar el catálogo de impuestos retenidos:', error);
    this.impRetencionesCatalogo = [];
  }

  select_fecha_contabilizacion(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.asimilado_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.asimilado_fecha_contabilizacion);
  }

  keepOrder = (a: any, b: any): number => {
    return 0;
  }

  formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async cargaXmlAsimReporte(e: any, objeto: any): Promise<void> {
    const doc_xml = objeto.files[0];

    const xml_tipo = doc_xml.type == 'text/xml' && doc_xml.name.toLowerCase().endsWith('.xml');
    const xml_size = doc_xml.size <= 2000000;
    if (xml_tipo && xml_size) {
      this.imagenEvidenciaXml = doc_xml;
      try {
        await this.lecturaInternaXML(objeto);
      } catch (error) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Error en el procesamiento de información' });
      }
    } else {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: !xml_tipo ? 'El archivo no es un XML.' : 'El archivo supera el límite de 2MB.' });
      this.validator.errorInputRow(objeto);
    }
  }

  deleteXmlCompra(): void {
    this.imagenEvidenciaXml = null;
  }

  limpiaXMLData() {
    this.resultXml = '';
    //cfdi:Comprobante
    this.dataCFDI_comprobante_obj = {};
    this.dataCFDI_comprobante_TipoComprobante = '';
    this.dataCFDI_comprobante_formaPago = '';
    this.dataCFDI_comprobante_MetodoPago = '';
    this.dataCFDI_comprobante_Moneda = '';
    this.dataCFDI_comprobante_MoneDecimales = 2;
    this.dataCFDI_comprobante_Total = '';
    //cfdi:Comprobante//cfdi:Emisor
    this.dataCFDI_emisor_Rfc = '';
    this.dataCFDIEmisor_obj = {};
    //cfdi:Comprobante//cfdi:Receptor
    this.dataCFDIReceptor_obj = {};
    this.dataCFDI_receptor_Rfc = '';
    this.dataCFDI_receptor_UsoCFDI = '';
    this.dataCFDI_receptor_Rfc_registrado = false;
    this.dataCFDI_receptor_new_registro = false;
    //cfdi:Comprobante//cfdi:Conceptos'
    this.dataCFDI_conceptos = [];
    //impuestos //cfdi:Comprobante/cfdi:Impuestos
    this.dataCFDI_impuestos_retenidos_total = 0;
    this.dataCFDI_impuestos_retenidos_lista = [];
    this.dataCFDI_impuestos_trasladados_total = 0;
    this.dataCFDI_impuestos_trasladados_lista = [];
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    this.dataCFDIComplemento_obj = {};
    this.dataCFDI_complemento_UUID = '';
    this.dataCFDI_complemento_SelloCFD = '';
    this.dataCFDIComplementoNomina_obj = {};
    this.dataCFDIComplementoNominaReceptor_obj = {};
    this.dataCFDIComplementoNominaPercepciones_obj = {};
    this.dataCFDIComplementoNominaPercepcionConceptos = [];
    this.dataCFDIComplementoNominaDeducciones_obj = {};
    this.dataCFDI_complemento_DeducConceptos = [];
  }

  async lecturaInternaXML(objeto: any) {
    this.resultXml = 'errorXml';
    this.limpiaXMLData();

    if (!this.imagenEvidenciaXml) {
      this.validator.errorInputRow(objeto);
      return;
    }

    const reader = new FileReader();

    try {
      const xmlString = await this.leerXmlAsText(this.imagenEvidenciaXml);
      const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml');

      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML_PARSE_ERROR');
      }

      const xmlElement: any = xmlDoc.documentElement;
      const xmlNode = nodeFromXmlElement(xmlElement);
      const childNodes = xmlNode.children();

      this.dataCFDI_comprobante_Total = xmlNode.getAttribute('Total');
      this.dataCFDI_comprobante_TipoComprobante = xmlNode.getAttribute('TipoDeComprobante');

      this.dataCFDI_emisor_Rfc = this.cfdiServ.obtenRFCEmisor(childNodes.getNodesByName("cfdi:Emisor")).toString();
      this.dataCFDI_receptor_Rfc = this.cfdiServ.obtenReceptor(childNodes.getNodesByName("cfdi:Receptor")).toString();

      this.dataCFDI_complemento_UUID = this.cfdiServ.obtenComplementoUUID(childNodes.getNodesByName("cfdi:Complemento")).toString();
      this.dataCFDI_complemento_SelloCFD = this.cfdiServ.obtenComplementoSelloCFD(childNodes.getNodesByName("cfdi:Complemento")).toString();

      const rfc_emp_nomina_emisor = this.sessionContext.empresa_data?.rfc_emp || "";
      const company_emp_nomina_emisor = this.sessionContext.empresa_data?.company_name_large || "";

      const valida_cion_emisor_rfc = this.dataCFDI_emisor_Rfc.toLowerCase() === rfc_emp_nomina_emisor.toLowerCase();
      if (!valida_cion_emisor_rfc) {
        this.disparaErrorLocal(objeto, 'El rfc del emisor no coincide con el rfc de ' + company_emp_nomina_emisor + '.');
        return;
      }

      const generales_cfdi_validacion = this.dataCFDI_complemento_UUID && this.dataCFDI_emisor_Rfc && this.dataCFDI_receptor_Rfc && this.dataCFDI_comprobante_Total;
      if (!generales_cfdi_validacion) {
        this.disparaErrorLocal(objeto, 'Faltan datos para validar el CFDI en el SAT.');
        return;
      }
      const total = parseFloat(this.dataCFDI_comprobante_Total).toFixed(6);

      this.revisa_receptor_proveedor_registrado();

      this.cfdiServ.validaEstadoCFDICompras(this.dataCFDI_complemento_UUID, this.dataCFDI_emisor_Rfc, this.dataCFDI_receptor_Rfc, total).subscribe(
        response => {
          const valida_resp_estado = response.status == 'success' && response.estado == 'Vigente' && (this.dataCFDI_comprobante_TipoComprobante == "N");
          if (!valida_resp_estado) {
            this.disparaErrorLocal(objeto, 'Faltan datos para validar el CFDI en el SAT.');
            return;
          }

          if (response.encontrado) {
            this.disparaErrorLocal(objeto, 'El documento CFDI ya se encuentra vinculado a otros procesos de compras');
            return;
          }

          this.procesaCuerpoCFDI(xmlNode, childNodes);
          if (this.servCatGeneral.length === 0) {
            this.listar_catalogo_general_serv();
          }
          this.validator.correctoInputRow(objeto);
          this.comprobarVinculacionArticulos();
          this.abrirPaginaSAT();
          this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: 'CFDI es correcto.' });
          this.resultXml = 'validoXml';
        },
        error => {
          console.log(error);
        }
      );
    } catch (error: any) {
      this.disparaErrorLocal(objeto, error.message || 'Error crítico al procesar el CFDI.');
    }
  }

  revisa_receptor_proveedor_registrado() {
    this.provServ.verificaExistProveedorByRFC(this.dataCFDI_receptor_Rfc).subscribe(
      response => {
        let translate_response = this.translate.instant(response.message);
        if (response.status == "success") {
          this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: translate_response });
          this.dataCFDI_receptor_Rfc_registrado = true;
          this.dataCFDI_receptor_new_registro = false;
          this.asimilado_token = response.token;
          this.descarga_info_proveedor(response.token);
          this.listar_articulos_proveedor(response.token);
          //this.listar_anticipos_proveedor(response.token);
          this.comprobarVinculacionArticulos();
        }
        if (response.status == "error") {
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });
          this.dataCFDI_receptor_Rfc_registrado = false;
          this.dataCFDI_receptor_new_registro = true;
        }
      },
      error => {
        //console.log(error);
      }
    )
  }

  descarga_info_proveedor(token_cat_proveedores: any) {
    this.dataReceptor = [];
    console.log("token_cat_proveedores " + token_cat_proveedores);
    this.provServ.verDetalleProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.dataReceptor = response.proveedor;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  listar_articulos_proveedor(token_cat_proveedores: any) {
    this._comprServ.listaServiciosComprasProv(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          this.serviciosVincLista = response.listaArticulos;
          console.log(this.serviciosVincLista);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //listar_anticipos_proveedor(token_cat_proveedores: any) {
  //  this._provServ.listarAnticiposDisponiblesProveedor(token_cat_proveedores).subscribe(
  //    response => {
  //      if (response.status == "success") {
  //        console.log(response);
  //        this.aplica_anticipo_a_proveedor = "";
  //        this.proveedorAnticipoTotal = response.anticipo_total;
  //        this.proveedorAnticipoTotalFormat = response.anticipo_total_format;
  //        this.proveedorAnticipoRestanteFormat = response.anticipo_total_format;
  //      }
  //    }
  //  );
  //}

  verVentanaReceptorProveedorRegistro() {
    this.dataCFDI_receptor_new_registro = true;
  }

  procesaCuerpoCFDI(xmlNode: any, childNodes: any) {
    this.asimilado_fecha_contabilizacion = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';

    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === xmlNode.getAttribute('Moneda'));
    this.modelAsimilados.moneda_code = typeof mnd !== 'undefined' ? mnd.code : '';
    this.modelAsimilados.moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    console.log(this.modelAsimilados);



    this.dataCFDI_comprobante_formaPago = xmlNode.getAttribute('FormaPago');
    this.dataCFDI_comprobante_MetodoPago = xmlNode.getAttribute('MetodoPago');
    this.dataCFDI_comprobante_TipoCambio = xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00';
    this.dataCFDI_comprobante_Moneda = xmlNode.getAttribute('Moneda');
    const moneda_CFDI = this.catalogo_monedas_api.find((row: any) => row.code === this.dataCFDI_comprobante_Moneda);
    this.dataCFDI_comprobante_MoneDecimales = moneda_CFDI.decimales;
    console.log("dataCFDI_comprobante_MoneDecimales " + this.dataCFDI_comprobante_MoneDecimales);
    console.log(this.dataCFDI_comprobante_obj);

    const nodo_cfdi_relacionados = childNodes.getNodesByName("cfdi:CfdiRelacionados");
    this.llenaCfdiRelacionados(nodo_cfdi_relacionados);
    const nodo_emisor = childNodes.getNodesByName("cfdi:Emisor");
    this.obtenEmisor(nodo_emisor);
    const nodo_receptor = childNodes.getNodesByName("cfdi:Receptor");
    this.obtenReceptor(nodo_receptor);
    const nodo_conceptos_row = childNodes.getNodesByName("cfdi:Conceptos")[0]?.children() || [];

    this.dataCFDI_conceptos = nodo_conceptos_row.map((cChild: any, index: number) => {
      const expandRowsRetenciones: { [s: string]: boolean } = {};
      const expandRowsTraslados: { [s: string]: boolean } = {};
      const expandRowsActivosFijos: { [s: string]: boolean } = {};
      let list_impuestos: any = [];

      let list_retenciones: any = [];
      let total_retenciones = 0;

      var list_traslados: any = [];
      var total_traslados = 0;


      const impuestos = cChild.children().find((n: any) => n.name() === "cfdi:Impuestos");
      if (impuestos) {
        impuestos.children().forEach((tipo: any) => {
          let iNodo_name = tipo.name();
          const nodes_impuestos = tipo.children();
          console.log(iNodo_name);
          nodes_impuestos.forEach((impItem: any) => {
            const row_imp = {
              id: (iNodo_name === "cfdi:Retenciones" ? list_retenciones : list_traslados).length + 1,
              Base: impItem.getAttribute("Base") || "",
              Impuesto: impItem.getAttribute("Impuesto") || "",
              TipoFactor: impItem.getAttribute("TipoFactor") || "",
              TasaOCuota: impItem.getAttribute("TasaOCuota") || "",
              Importe: impItem.getAttribute("Importe") || 0,
              impuesto_relacionado: "",
              impuesto_relacion_nombre: "",
            };
            if (tipo.name() === "cfdi:Retenciones") {
              list_retenciones.push(row_imp);
              total_retenciones += row_imp.Importe;
            } else {
              list_traslados.push(row_imp);
              if (row_imp.TipoFactor !== "Exento") total_traslados += row_imp.Importe;
            }
            list_impuestos.push(row_imp);
          });
        });
      }

      var descuentoPartida = cChild.getAttribute("Descuento") || 0;
      const cfdiSubtotal = parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida) + parseFloat(total_traslados.toString()) - parseFloat(total_retenciones.toString());
      return {
        num_lista: index + 1,
        Descripcion: cChild.getAttribute("Descripcion") || "",
        Unidad: cChild.getAttribute("Unidad") || "",
        ClaveUnidad: cChild.getAttribute("ClaveUnidad") || "",
        ClaveProdServ: cChild.getAttribute("ClaveProdServ") || "",
        ValorUnitario: numeral(cChild.getAttribute("ValorUnitario") || 0).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Cantidad: cChild.getAttribute("Cantidad") || 0,
        Descuento: numeral(descuentoPartida).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Importe: numeral(parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida)).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Subtotal: numeral(cfdiSubtotal).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        ObjetoImp: cChild.getAttribute("ObjetoImp") || "",
        //NoIdentificacion: cChild.getAttribute("NoIdentificacion") || "",
        //TotalRetenciones: numeral(total_retenciones).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        //TotalTraslados: numeral(total_traslados).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
      }
    });
    console.log(this.dataCFDI_conceptos);

    const nodo_complemento = childNodes.getNodesByName("cfdi:Complemento");
    this.obtenComplemento_Nomina(nodo_complemento);
  }

  private disparaErrorLocal(objeto: any, mensaje: string) {
    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: mensaje });
    this.validator.errorInputRow(objeto);
    this.resultXml = 'errorXml';
  }

  private leerXmlAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  llenaCfdiRelacionados(nodo_emisor: any) {
    nodo_emisor.forEach((child: any) => {
      var tipoRelacion = child.getAttribute('TipoRelacion');
      var relacionados_uuid = '';
      const child_relacionados = child.children();
      child_relacionados.forEach((rChild: any) => {
        relacionados_uuid = rChild.getAttribute('CfdiRelacionado');
      });

      this.dataCFDIRelacionados_obj = {
        tipo_de_relacion: tipoRelacion || '---',
        UUID: relacionados_uuid || '---',
      };
    });
  }

  obtenEmisor(nodo_emisor: any) {
    nodo_emisor.forEach((child: any) => {
      this.dataCFDIEmisor_obj = {
        rfc_del_emisor: child.getAttribute('Rfc') || '---',
        nombre_del_emisor: child.getAttribute('Nombre') || '---',
        regimen_fiscal_del_emisor: child.getAttribute('RegimenFiscal') || '---',
      };
    });
  }

  obtenReceptor(nodo_receptor: any) {
    nodo_receptor.forEach((child: any) => {
      this.dataCFDIReceptor_obj = {
        Rfc: child.getAttribute('Rfc') || '---',
        Nombre: child.getAttribute('Nombre') || '---',
        UsoCFDI: child.getAttribute('UsoCFDI') || '---',
        RegimenFiscalReceptor: child.getAttribute('RegimenFiscalReceptor') || '---',
        DomicilioFiscalReceptor: child.getAttribute('DomicilioFiscalReceptor') || '---',
      };
      this.dataCFDI_receptor_UsoCFDI = child.getAttribute('UsoCFDI');
    });
  }

  obtenComplemento_Nomina(nodo_complemento: any) {
    nodo_complemento.forEach((child: any) => {
      const raiz_complemento: any = child.children();
      console.log(raiz_complemento);
      const nodo_timbre_fiscal = raiz_complemento.getNodesByName("tfd:TimbreFiscalDigital");
      nodo_timbre_fiscal.forEach((rChild: any) => {
        this.dataCFDIComplemento_obj = {
          Version: rChild.getAttribute("Version") || '---',
          UUID: rChild.getAttribute("UUID") || '---',
          FechaTimbrado: rChild.getAttribute("FechaTimbrado") || '---',
          RfcProvCertif: rChild.getAttribute("RfcProvCertif") || '---',
          NoCertificadoSAT: rChild.getAttribute("NoCertificadoSAT") || '---',
          SelloCFD: rChild.getAttribute("SelloCFD") || '---',
          SelloSAT: rChild.getAttribute("SelloSAT") || '---',
        };
      });

      const nodo_nomina12_Nomina = raiz_complemento.getNodesByName("nomina12:Nomina");
      console.log(nodo_nomina12_Nomina);
      nodo_nomina12_Nomina.forEach((mino: any) => {
        this.modelAsimilados.periodo_inicio = mino.getAttribute("FechaInicialPago") || '';
        this.modelAsimilados.periodo_fin = mino.getAttribute("FechaFinalPago") || '';
        
        const [y, m, d] = mino.getAttribute("FechaInicialPago").split('-').map(Number);
        const mes_periodo_inicio = new Date(y, m - 1, d);
        console.log(mino.getAttribute("FechaInicialPago") + " " + mes_periodo_inicio);
        const mes_periodo_fin = new Date(mino.getAttribute("FechaFinalPago"));
        mes_periodo_fin.setDate(new Date(mes_periodo_fin.getFullYear(), mes_periodo_fin.getMonth() + 1, 0).getDate());
        console.log(mes_periodo_fin);
        this.asimiladoForm.patchValue({ periodo_de_pago: [mes_periodo_inicio, mes_periodo_fin] });

        this.modelAsimilados.fecha_pago = mino.getAttribute("FechaPago") || '';
        this.asimiladoForm.patchValue({ fecha_de_pago: mino.getAttribute("FechaPago") });
        
        this.asimiladoForm.patchValue({ mon_name: this.dataCFDI_comprobante_Moneda });

        this.modelAsimilados.dias_pagados = mino.getAttribute("NumDiasPagados") || '';
        this.asimiladoForm.patchValue({ dias_pagados: mino.getAttribute("NumDiasPagados") });

        this.modelAsimilados.total_percepciones = mino.getAttribute("TotalPercepciones") || '';
        this.asimiladoForm.patchValue({ total_percepciones: mino.getAttribute("TotalPercepciones") });

        this.modelAsimilados.total_deducciones = mino.getAttribute("TotalDeducciones") || '';
        this.asimiladoForm.patchValue({ total_deducciones: mino.getAttribute("TotalDeducciones") });
        
        const raiz_nomina: any = mino.children();
        const nodo_nomina_receptor = raiz_nomina.getNodesByName("nomina12:Receptor");
        nodo_nomina_receptor.forEach((nomi_rec: any) => {
          this.dataCFDIComplementoNominaReceptor_obj = {
            ClaveEntFed: nomi_rec.getAttribute("ClaveEntFed") || '---',
            Curp: nomi_rec.getAttribute("Curp") || '---',
            NumEmpleado: nomi_rec.getAttribute("NumEmpleado") || '---',
            TipoContrato: nomi_rec.getAttribute("TipoContrato") || '---',
            PeriodicidadPago: nomi_rec.getAttribute("PeriodicidadPago") || '---',
            TipoRegimen: nomi_rec.getAttribute("TipoRegimen") || '---'
          };
        });
        
        const nodo_nomina_percepciones = raiz_nomina.getNodesByName("nomina12:Percepciones");
        nodo_nomina_percepciones.forEach((perm: any) => {
          this.dataCFDIComplementoNominaPercepciones_obj = {
            TotalExento: perm.getAttribute("TotalExento") || '0.00',
            TotalGravado: perm.getAttribute("TotalGravado") || '0.00',
            TotalSueldos: perm.getAttribute("TotalSueldos") || '0.00',
          };

          const raiz_percepciones: any = perm.children();
          const nodo_nomina_percepcion = raiz_percepciones.getNodesByName("nomina12:Percepcion");
          
          this.dataCFDIComplementoNominaPercepcionConceptos = nodo_nomina_percepcion.map((pcepChild: any, pindex: number) => {
            return {
              num_lista: pindex + 1,
              Clave: pcepChild.getAttribute("Clave") || "",
              Concepto: pcepChild.getAttribute("Concepto") || "",
              ImporteExento: pcepChild.getAttribute("ImporteExento") || "0.00",
              ImporteGravado: pcepChild.getAttribute("ImporteGravado") || "0.00", 
              TipoPercepcion: pcepChild.getAttribute("TipoPercepcion") || "0.00",
            }
          });
        });

        const nodo_nomina_deducciones = raiz_nomina.getNodesByName("nomina12:Deducciones");
        nodo_nomina_deducciones.forEach((dedum: any) => {
          this.dataCFDI_complemento_DeducTotalImpRet = dedum.getAttribute("TotalImpuestosRetenidos") || '';
          
          this.dataCFDIComplementoNominaDeducciones_obj = {
            TotalImpuestosRetenidos: dedum.getAttribute("TotalImpuestosRetenidos") || '0.00',
            TotalOtrasDeducciones: dedum.getAttribute("TotalOtrasDeducciones") || '0.00'
          };

          const raiz_deducciones: any = dedum.children();
          const nodo_nomina_deduccion = raiz_deducciones.getNodesByName("nomina12:Deduccion");
          this.dataCFDI_complemento_DeducConceptos = nodo_nomina_deduccion.map((dducChild: any, dindex: number) => {
            return {
              num_lista: dindex + 1,
              Clave: dducChild.getAttribute("Clave") || "",
              Concepto: dducChild.getAttribute("Concepto") || "",
              Importe: dducChild.getAttribute("Importe") || "0.00",
              TipoDeduccion: dducChild.getAttribute("TipoDeduccion") || ""
            }
          });
        });

        console.log(this.modelAsimilados);
        this.dataCFDIComplementoNomina_obj = {
          FechaFinalPago: mino.getAttribute("FechaFinalPago") || '---',
          FechaInicialPago: mino.getAttribute("FechaInicialPago") || '---',
          FechaPago: mino.getAttribute("FechaPago") || '---',
          NumDiasPagados: mino.getAttribute("NumDiasPagados") || '---',
          TipoNomina: mino.getAttribute("TipoNomina") || '---',
          TotalDeducciones: mino.getAttribute("TotalDeducciones") || '0.00',
          TotalOtrosPagos: mino.getAttribute("TotalOtrosPagos") || '0.00',
          TotalPercepciones: mino.getAttribute("TotalPercepciones") || '0.00',
          Version: mino.getAttribute("Version") || '---',
        };
      });
    });
  }

  comprobarVinculacionArticulos() {
    //// 1. Crear diccionarios para búsqueda instantánea
    //const setGral = new Set(this.servCatGeneral.map((g: any) => g.concepto?.trim().toLowerCase()));
    //const setProv = new Set(this.productosVincLista.map((p: any) => p.concepto?.trim().toLowerCase()));
    //// 2. Actualizar los conceptos existentes
    //this.dataCFDI_conceptos = this.dataCFDI_conceptos.map((concepto: any) => {
    //  const desc = concepto.Descripcion?.trim().toLowerCase();
    //  return {
    //    ...concepto,
    //    articulo_homologado_comprobacion: setGral.has(desc) || setProv.has(desc)
    //  };
    //});
  }

  abrirPaginaSAT() {
    const total = parseFloat(this.dataCFDI_comprobante_Total).toFixed(6);
    const urlSAT = `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${this.dataCFDI_complemento_UUID}&re=${this.dataCFDI_emisor_Rfc}&rr=${this.dataCFDI_receptor_Rfc}&tt=${total}&fe=${this.dataCFDI_complemento_SelloCFD.slice(-8)}`;
    // Características de la ventana
    const features = 'popup=true,width=1000,height=800,left=200,top=100,resizable=yes,scrollbars=yes';
    // "_blank" garantiza que se abre una ventana/pestaña nueva
    const nuevaVentana = window.open(urlSAT, '_blank', features);
  }

  changePeriodoPagoAsimilado(){
    var newReportAsimPeriodo = document.getElementById("newReportAsimPeriodo");
    if (this.rangoPeriodoPagoAsimilados && this.rangoPeriodoPagoAsimilados.length === 2) {
      const dateInicio = this.rangoPeriodoPagoAsimilados[0];
      const dateFin = this.rangoPeriodoPagoAsimilados[1];
      
      if (dateInicio && dateFin) {
        const validacionInicio = dateInicio && this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
        const validacionFin = dateFin && this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
        if (validacionInicio && validacionFin) {
          //Guardamos en tus variables de nómina
          this.modelAsimilados.periodo_inicio = dateInicio.toISOString().split('T')[0];
          this.modelAsimilados.periodo_fin = dateFin.toISOString().split('T')[0];
          //Indicas al validador visual que está correcto
          this.validator.correctoInputRow(newReportAsimPeriodo);
        } else {
          //Si algo está mal, limpias y marcas error
          this.modelAsimilados.periodo_inicio = '';
          this.modelAsimilados.periodo_fin = '';
          this.validator.errorInputRow(newReportAsimPeriodo);
        }
      } else {
        this.validator.errorInputRow(newReportAsimPeriodo);
        return;
      }
    } else {
      //Si sólo hay una fecha o no hay nada
      this.modelAsimilados.periodo_inicio = '';
      this.modelAsimilados.periodo_fin = '';
      this.validator.errorInputRow(newReportAsimPeriodo);
    }
  }

  changeAsimiladoFechaPago(event:any){
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.modelAsimilados.fecha_pago = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupAsimiladoDiasPagados(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelAsimilados.dias_pagados = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupAsimiladoTotalPercepciones(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelAsimilados.total_percepciones = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verConceptoXMLServicios() {
    this.modelAsimilados.percepciones_window = !this.modelAsimilados.percepciones_window ? true : false;
  }

  selecionaServicio(token_articulo: any) {
    this.percepciones_servicio_save = token_articulo;
  }

  seleccionaArticuloGralCompra(token_articulo: any, identificador: any) {
    const valid_art = token_articulo != "" && identificador != "" && this.validator.filtroAlfaNumerico(identificador);
    
    this._comprServ.verificaArticuloServ(this.asimilado_token, token_articulo, identificador).subscribe(
      response => {
        if (response.status == 'success') {
          this.percepciones_servicio_save = valid_art ? token_articulo : '';
          //this.modelAsimilados.percepciones_servicio_token = valid_art ? token_articulo : '';
        }

        if (response.status == 'error') {
          let translate_response = this.translate.instant(response.message);
          //event.checked = false;
          this.functionValidaXmlContentArticulos();
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

  prov_relacionado_registrar(event: any, lgProd: any) {
    lgProd.prov_relacionado_registrar = event.checked ? true : false;
  }

  decideHabilitaClave(event: any, lgProd: any) {
    lgProd.prov_relacionado_tiene_clave = event.checked ? true : false;
  }

  keyupProvProdClave(event: any, lgProd: any) {
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    lgProd.prov_relacionado_clave = validar ? event.value : '';
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(lgProd);
  }

  validaRegClaveProdPRV(lgProd: any) {
    const validar_clave = lgProd.prov_relacionado_clave != '' && this.validator.filtroAlfaNumerico(lgProd.prov_relacionado_clave) == true;
    return lgProd.prov_relacionado_registrar && (!lgProd.prov_relacionado_tiene_clave || (lgProd.prov_relacionado_tiene_clave && validar_clave));
  }

  registraClaveProdPRV(lgProd: any) {
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
        this._comprServ.registraClaveProdPRV(
          this.asimilado_token,
          lgProd.token_articulo,
          lgProd.identificador,
          lgProd.prov_relacionado_registrar,
          lgProd.prov_relacionado_tiene_clave,
          lgProd.prov_relacionado_clave
        ).subscribe(
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
              //location.reload();
              this.listar_catalogo_general_serv();
              this.listar_articulos_proveedor(this.asimilado_token);
              this.expandRowsServicios = {};
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
    })
  }

  keypressProvProdClave(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (this.validator.strFilter(clave) == false) {
      this.validator.deten(event);
    }
  }

  cancelarArticuloAsim() {
    this.percepciones_servicio_save = '';
    this.modelAsimilados.percepciones_window = false;
    console.log(this.dataCFDI_conceptos);
  }

  guardaArticuloCompraXML() {
    let gen_art_cat = this.servCatGeneral.find((row: any) => row.token_articulo === this.percepciones_servicio_save);

    this._comprServ.verificaArticuloServ(this.asimilado_token, this.percepciones_servicio_save, gen_art_cat.identificador).subscribe(
      response => {
        if (response.status == 'success') {
          console.log("gen_art_cat.listado " + gen_art_cat.listado)
          this.modelAsimilados.percepciones_servicio_token = this.percepciones_servicio_save;
          this.modelAsimilados.percepciones_window = false;
          console.log(this.modelAsimilados);
          this.functionValidaXmlContentArticulos();
        }

        if (response.status == 'error') {
          let translate_response = this.translate.instant(response.message);
          //event.checked = false;
          this.functionValidaXmlContentArticulos();
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

    console.log(this.dataCFDI_conceptos);
  }

  keyupAsimiladoTotalDeducciones(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelAsimilados.total_deducciones = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activaBotonImpuestosClass() {
    var clase = "";
    if (this.dataReceptor.length == 0 || this.modelAsimilados.total_deducciones == 0) {
      clase = "bg-blue-600 disabled";
    } else {
      if (this.modelAsimilados.deducciones_impuesto_token == '') {
        clase = "bg-blue-600";
      } else {
        clase = "text-bg-success rounded-3";
      }
    }
    return clase;
  }

  activaBotonImpuestosEnabled() {
    const valida_abre_tras = this.dataReceptor.length > 0 && this.modelAsimilados.total_deducciones > 0;
    return valida_abre_tras;
  }

  activaBotonImpuestosIcono() {
    var clase = "";
    if (this.dataReceptor.length == 0 || this.modelAsimilados.total_deducciones == 0) {
      clase = "fa-ban";
    } else {
      if (this.modelAsimilados.deducciones_impuesto_token == '') {
        clase = "fa-eye";
      } else {
        clase = "fa-check-double";
      }
    }
    return clase;
  }

  verConceptoXMLImpuestos() {
    this.modelAsimilados.deducciones_window = !this.modelAsimilados.deducciones_window ? true : false;
    if (this.impRetencionesCatalogo.length === 0) {
      this.lista_impuestos_catalogo_retenciones();
    }
  }

  selecciona_imp_retencion(event: any) {
    let imp = this.impRetencionesCatalogo.find((row: any) => row.token_catalogo_impuesto == event.value);
    const validacion = event.value != "" && typeof imp !== 'undefined';
    this.deducciones_impuesto_save = validacion ? imp.token_catalogo_impuesto : '';
    //this.modelAsimilados.deducciones_impuesto_token = validacion ? imp.token_catalogo_impuesto : '';
    console.log(this.dataCFDI_conceptos);
  }

  imp_retencion_cancelar() {
    this.deducciones_impuesto_save = '';
    this.modelAsimilados.deducciones_window = false;
  }

  guarda_imp_retencion() {
    this.modelAsimilados.deducciones_impuesto_token = this.deducciones_impuesto_save;
    this.modelAsimilados.deducciones_window = false;
    this.functionValidaXmlContentArticulos();
  }

  get get_asimilado_total():String{
    const asim_total = Number(this.modelAsimilados.total_percepciones) - Number(this.modelAsimilados.total_deducciones);
    const decimales = this.modelAsimilados.moneda_decimales || 2;
    return numeral(asim_total).format('0,0.'+'0'.repeat(decimales));
  }

  validarGeneralArticulo() {
    const validaPeriodoInicio = this.modelAsimilados.periodo_inicio != '' && this.validator.filtroFecha(this.modelAsimilados.periodo_inicio);
    const validaPeriodoFin = this.modelAsimilados.periodo_fin != '' && this.validator.filtroFecha(this.modelAsimilados.periodo_fin);
    if (!validaPeriodoInicio || !validaPeriodoFin) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el Periodo de pago.' });
      return false;
    }

    const validaFechaPago = this.modelAsimilados.fecha_pago != '' && this.validator.filtroFecha(this.modelAsimilados.fecha_pago);
    if (!validaFechaPago) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en la fecha de pago.' });
      return false;
    }

    const validaDiasPagados = this.modelAsimilados.dias_pagados != '' && this.validator.filtroAlfaNumerico(this.modelAsimilados.dias_pagados);
    if (!validaDiasPagados) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en días pagados.' });
      return false;
    }

    const validaTotalPercepciones = this.modelAsimilados.total_percepciones > 0 && this.validator.filtroNum(this.modelAsimilados.total_percepciones);
    if (!validaTotalPercepciones) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el total de percepciones.' });
      return false;
    }

    if (!this.modelAsimilados.percepciones_servicio_token) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el servicio asociado a percepciones.' });
      return false;
    }

    if (this.modelAsimilados.total_deducciones > 0) {
      const validaTotalDeducciones = this.modelAsimilados.total_deducciones > 0 && this.validator.filtroNum(this.modelAsimilados.total_deducciones);
      
      if (!validaTotalDeducciones) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el total de deducciones.' });
        return false;
      }
      
      if (!this.modelAsimilados.deducciones_impuesto_token) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el impuesto asociado a deducciones.' });
        return false;
      }
    }
    return true;
  }

  functionValidaXmlContentArticulos() {
    try {
      var result_validacion: any = this.validarGeneralArticulo();
      console.log(result_validacion);
      this.selectvalidatexmlArticulos = result_validacion;
    } catch (error: any) {
      this.selectvalidatexmlArticulos = false;
    }
  }

  escanPdfCompra(e: any, objeto: any): void {
    const doc_pdf = objeto.files[0];
    const validacion_pdf = doc_pdf.size <= 2000000 && (doc_pdf.type == 'application/pdf');
    this.imagenEvidenciaPdf = validacion_pdf ? doc_pdf : null;
    validacion_pdf ? this.validator.correctoInputRow(objeto) : this.validator.errorInputRow(objeto);
    if (!validacion_pdf) {
      let mensajeError = '';
      if (doc_pdf.size > 2000000) mensajeError = 'El archivo excede el tamaño permitido (2MB)';
      if (doc_pdf.type != 'application/pdf') mensajeError = 'El archivo Debe ser en formato pdf';
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: mensajeError });
    }
  }

  keyupObservacionReporte(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.asimilado_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedAsimilados(files: NgxFileDropEntry[]) {
    this.filesAsimilados = files;
    this.AsimiladosAnexosNames = [];
    this.docsAsimiladosAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsAsimiladosAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.AsimiladosAnexosNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.docsAsimiladosAnexos.length > 0) {
              for (let j = 0; j < this.docsAsimiladosAnexos.length; j++) {
                const row = this.docsAsimiladosAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsAsimiladosAnexos.push(file);
                }
              }
            } else {
              this.docsAsimiladosAnexos.push(file);
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
            this.filesAsimilados.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsAsimiladosAnexos.length);
  }

  public fileOverImpAsimilados(event: any) {
    console.log(event);
  }

  public fileLeaveImpAsimilados(event: any) {
    console.log(event);
  }

  deleteAnexosAsimilados(posicion: any) {
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
          this.filesAsimilados.splice(posicion, 1);
          this.docsAsimiladosAnexos.splice(posicion, 1);
          this.AsimiladosAnexosNames.splice(posicion, 1);
          console.log(this.docsAsimiladosAnexos.length);
        }
      }
    );
  }

  validaRegistroAsimiladosReport(token_reporte_asim:any):Boolean{
    const desg = this.asimilados_desglose_info.find((row:any) => row.token_reporte_asim === token_reporte_asim);
    const asim_desg = this.asimilados_desglose_tokens.find((row:any) => row.desglose_asim_receptor_token === this.asimilado_token);
    const OKPerServTkn = this.modelAsimilados.percepciones_servicio_token !== asim_desg.servicio_asociado_token;
    const OKDedImpuTkn = this.modelAsimilados.deducciones_impuesto_token !== asim_desg.impuesto_asociado_token;
    const OKObservaciones = this.asimilado_observaciones != '' && this.validator.filtroAlfaNumerico(this.asimilado_observaciones) && this.asimilado_observaciones != desg.asim_observaciones;
    const OKDocuments = this.AsimiladosAnexosNames.length > 0;
    return OKPerServTkn || OKDedImpuTkn || OKObservaciones;
  }

  updateAsimiladoReporte(form: { reset: () => void; },token_reporte_asim: any):void{
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
        this.viewNewAsimiladoForm = false;
        //nomina_total_en_especie
        this.asimService.asimiladosUpdate(
          token_reporte_asim, 
          this.modelAsimilados,
          this.asimilado_observaciones,
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
              });
              form.reset();
              this.viewNewAsimiladoForm = true;
              this.asimilado_fecha_contabilizacion = "";
              this.asimilado_token = "";
              this.asimilado_observaciones = "";
              this.limpiaXMLData();

              //this.centTrabModel = new centroTrabajoModelo('','','','',false,'','');
              this.relInterna.mensajeAsimiladosRegistro("asimilados_registro");
              this.modelAsimilados = new asimiladosModelo('','','','',2,'',0.00,false,'',0.00,false,'');
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

  deleteAsimReporte(token_reporte_asim: any) {
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
        this.asimService.valorHumanoAsimiladosEliminar(token_reporte_asim).subscribe(
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
              this.listando_asimilados_reportes();
              this.listando_reportes_deleted_de_asimilados();
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

  verReportesEliminados() {
  }

  listando_reportes_deleted_de_asimilados() {
    this.asimService.catalogo_reportes_deleted_asimilados().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.list_asimilados_reportes_eliminados = response.reportes;
          console.log(this.list_asimilados_reportes_eliminados);
        } else {
          this.list_asimilados_reportes_eliminados = [];
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  restauraAsimiladoReporte(token_reporte_asim: any) {
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
        this.asimService.valorHumanoAsimiladoRestaurar(token_reporte_asim).subscribe(
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
              this.listando_asimilados_reportes();
              this.listando_reportes_deleted_de_asimilados();
              this.cd.detectChanges();
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

  deletePermanenteAsimiladoReporte(token_reporte_asim: any) {
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
        this.asimService.valorHumanoAsimiladosPermEliminar(token_reporte_asim).subscribe(
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
              this.listando_asimilados_reportes();
              this.listando_reportes_deleted_de_asimilados();
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
}
