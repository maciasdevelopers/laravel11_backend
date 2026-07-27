import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { NominaService } from '../../../../../servicios/ssic/nomina-service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import { nominaTotalesModelo } from '../../../../../modelos/nominas/nominaTotalesModelo';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { SessionContextService } from '../../../../../servicios/session-context';

@Component({
  selector: 'vhumano_reportes_nomina_analisis',
  templateUrl: './analisis_de_nomina.component.html',
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
    './analisis_de_nomina.component.css'
  ],
  providers: [ConfirmationService]
})
export class VHReportesNominaAnalisisComponent implements OnInit {
  public identidad: any;
  public nomina_totales: nominaTotalesModelo;

  list_nomina_reportes: any = [];
  searchPagoGeneral: any = [];
  search_pagos_done: any = [];
  public ver_nomina_seguimiento_pagos: boolean = false;
  nomina_efectivo_seguimiento_pagos: any = [];
  nomina_efectivo_pagos_historial: any = [];
  public ver_nomina_especie_seguimiento_pagos: boolean = false;
  nomina_especie_seguimiento_pagos: any = [];
  public ver_nomina_desglose: boolean = false;
  nomina_desglose_dispersion: any = [];
  nomina_busqueda_filtro: any = [];
  public nomina_detalle_token: string = "";
  public nomina_detalle_folio: string = "";
  catalogo_monedas_api: any = [];
  list_nomina_reportes_eliminados: any = [];

  //Factura CFDI (XML)
  public imagenEvidenciaXml: any;
  public imagenEvidenciaPdf: any;
  //public resultXml: string = '';
  //correcto
  //cfdi:Comprobante
  //dataCFDI_comprobante:any = [];
  //dataCFDIRelacionados:any = [];
  //cfdi:Comprobante//cfdi:Emisor
  //public dataCFDI_emisor_Rfc: string = '';
  //dataCFDIEmisor:any = [];
  //cfdi:Comprobante//cfdi:Receptor
  //public dataCFDI_receptor_Rfc: string = '';
  //dataCFDIReceptor:any = [];
  //cfdi:Comprobante//cfdi:Conceptos
  //dataCFDI_conceptos:any = [];
  //cfdi:Comprobante//cfdi:nomina
  //dataCFDI_nomina:any = [];
  //cfdi:Comprobante//cfdi:Complemento
  //dataCFDIComplemento:any = [];

  //public dataCFDI_complemento_UUID: string = '';
  //public dataCFDI_complemento_SelloCFD: string = '';

  constructor(
    private translate: TranslateService,
    private validator: ValidatorServService,
    private primeAlerts: MessageService,
    private relInterna: ComunicacionInternaService,
    private nominaServ: NominaService,
    private sentinela: SentinelArkManager,
    private cfdiServ: CFDIService,
    private sessionContext: SessionContextService,
    private _monedasServ: MonedasService,
    private servXlsx: DescargaExcel
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.nomina_totales = new nominaTotalesModelo('0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00');
    //,'0.00'
  }

  ngOnInit(): void {
    this.getRespuestaNominaRegistro();
    this.listando_reportes_de_nomina();
    this.listando_reportes_deleted_de_nomina();
    this.monedasCatalogoApi();
    this.nomina_busqueda_filtro = [
      'nomina_clave',
      'nomina_empleado_token',
      'nomina_empleado_nombre',
      'nomina_dias_trabajados',
      'nomina_sueldo',
      'nomina_otras_percepciones',
      'nomina_total_percepciones',
      'nomina_neto_pagado',
      'nomina_total_en_especie',
      'nomina_salario_por_hora',
      'nomina_total_imss',
      'nomina_horas_por_dia',
      'nomina_total_isr',
      'nomina_subsidio_empleo',
      'nomina_otras_deducciones',
      'nomina_total_deducciones',
      'nomina_total_efectivo',
      'nomina_empleado_nss',
      'nomina_empleado_rfc',
      'nomina_empleado_curp',
      'nomina_salario_diario',
      'nomina_salario_integrado',
      'nomina_dias_jornada',
      'nomina_empleado_fecha_alta',
      'nomina_faltas'
    ];

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

  descargarPlantillaNomina() {
    this.servXlsx.descargar_plantilla_nomina();
  }

  descarga_excel_nomina_reportes() {

  }

  getRespuestaNominaRegistro() {
    this.relInterna.mensajeVHNominaRegistro$.subscribe(
      (mensaje: any) => {
        if (mensaje == "nomina_registrada") {
          this.listando_reportes_de_nomina();
        }
      }
    );
  }

  listando_reportes_de_nomina() {
    this.nominaServ.catalogo_reportes_nomina().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.list_nomina_reportes = response.nominas;
          console.log(this.list_nomina_reportes);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verNominaEfectivoSeguimientoOrdenPago(token_nominas_periodos: any, nomina_efectivo_ord_pago_token: any) {
    this.ver_nomina_seguimiento_pagos = true;
    this.nominaServ.nominaEfectivoSeguimientoOrdenPago(token_nominas_periodos, nomina_efectivo_ord_pago_token).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.list_nomina_reportes.find((row: any) => row.token_nominas_periodos === token_nominas_periodos);
          this.nomina_detalle_folio = typeof rep !== 'undefined' ? rep.folio_interior : '';
          this.nomina_efectivo_seguimiento_pagos = response.seguimiento_orden_pago.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
          this.nomina_efectivo_pagos_historial = response.pagos_realizados;
          console.log(this.nomina_efectivo_seguimiento_pagos);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verNominaEspecieSeguimientoOrdenPago(token_nominas_periodos: any, nomina_especie_ord_pago_token: any) {
    this.ver_nomina_especie_seguimiento_pagos = true;
    this.nominaServ.nominaEspecieSeguimientoOrdenPago(token_nominas_periodos, nomina_especie_ord_pago_token).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.list_nomina_reportes.find((row: any) => row.token_nominas_periodos === token_nominas_periodos);
          this.nomina_detalle_folio = typeof rep !== 'undefined' ? rep.folio_interior : '';
          this.nomina_especie_seguimiento_pagos = response.nomina.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
          console.log(this.nomina_especie_seguimiento_pagos);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verNominaDesglose(token_nominas_periodos: any) {
    this.nominaServ.nominaDesgloseDispersion(token_nominas_periodos).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          const rep = this.list_nomina_reportes.find((row: any) => row.token_nominas_periodos === token_nominas_periodos);
          this.nomina_detalle_folio = typeof rep !== 'undefined' ? rep.folio_interior : '';
          this.nomina_detalle_token = token_nominas_periodos;
          this.ver_nomina_desglose = true;
          this.nomina_desglose_dispersion = response.desglose;
          console.log(this.nomina_desglose_dispersion);
          this.calculaNominaTotales();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  calculaNominaTotales() {
    var totales_nomi_salario_diario = 0;
    var totales_nomi_salario_integrado = 0;
    var totales_nomi_dias_trabajados = 0;
    var totales_nomi_faltas = 0;
    var totales_nomi_sueldo = 0;
    var totales_nomi_horas_extras_dobles = 0;
    var totales_nomi_aguinaldo = 0;
    var totales_nomi_horas_extras_triples = 0;
    var totales_nomi_vacaciones = 0;
    var totales_nomi_prima_vacacional = 0;
    var totales_nomi_reparto_de_utilidades = 0;
    var totales_nomi_despensa = 0;
    var totales_nomi_premios_de_asistencia = 0;
    var totales_nomi_premios_de_puntualidad = 0;
    var totales_nomi_prima_dominical = 0;
    var totales_nomi_bno_extra_x_comision_otro_edo = 0;
    var totales_nomi_indemnizacion = 0;
    var totales_nomi_prima_de_antiguedad = 0;
    var totales_nomi_isr_ajustado_por_subsidio = 0;
    var totales_nomi_total_isr = 0;
    var totales_nomi_total_imss = 0;
    var totales_nomi_credito_fonacot = 0;
    var totales_nomi_credito_infonavit = 0;
    var totales_nomi_subsidio_empleo = 0;
    //var totales_nomi_subsidio_empleo_aplicado = 0;
    var totales_nomi_otras_percepciones = 0;
    var totales_nomi_total_percepciones = 0;
    var totales_nomi_otras_deducciones = 0;
    var totales_nomi_total_deducciones = 0;
    var totales_nomi_total_efectivo = 0;
    var totales_nomi_total_en_especie = 0;
    var totales_nomi_neto_pagado = 0;
    var totales_nomi_salario_por_hora = 0;
    var totales_nomi_horas_por_dia = 0;
    var totales_nomi_u_t_laboradas = 0;

    this.nomina_desglose_dispersion.forEach((nom: any) => {
      totales_nomi_salario_diario += parseFloat(nom.nomina_salario_diario) || 0;
      totales_nomi_salario_integrado += parseFloat(nom.nomina_salario_integrado) || 0;
      totales_nomi_dias_trabajados += parseFloat(nom.nomina_dias_trabajados) || 0;
      totales_nomi_faltas += parseFloat(nom.nomina_faltas) || 0;
      totales_nomi_sueldo += parseFloat(nom.nomina_sueldo) || 0;
      totales_nomi_horas_extras_dobles += parseFloat(nom.nomina_horas_extras_dobles) || 0;
      totales_nomi_aguinaldo += parseFloat(nom.nomina_aguinaldo) || 0;
      totales_nomi_horas_extras_triples += parseFloat(nom.nomina_horas_extras_triples) || 0;
      totales_nomi_vacaciones += parseFloat(nom.nomina_vacaciones) || 0;
      totales_nomi_prima_vacacional += parseFloat(nom.nomina_prima_vacacional) || 0;
      totales_nomi_reparto_de_utilidades += parseFloat(nom.nomina_reparto_de_utilidades) || 0;
      totales_nomi_despensa += parseFloat(nom.nomina_despensa) || 0;
      totales_nomi_premios_de_asistencia += parseFloat(nom.nomina_premios_de_asistencia) || 0;
      totales_nomi_premios_de_puntualidad += parseFloat(nom.nomina_premios_de_puntualidad) || 0;
      totales_nomi_prima_dominical += parseFloat(nom.nomina_prima_dominical) || 0;
      totales_nomi_bno_extra_x_comision_otro_edo += parseFloat(nom.nomina_bno_extra_x_comision_otro_edo) || 0;
      totales_nomi_indemnizacion += parseFloat(nom.nomina_indemnizacion) || 0;
      totales_nomi_prima_de_antiguedad += parseFloat(nom.nomina_prima_de_antiguedad) || 0;
      totales_nomi_isr_ajustado_por_subsidio += parseFloat(nom.nomina_isr_ajustado_por_subsidio) || 0;
      totales_nomi_total_isr += parseFloat(nom.nomina_total_isr) || 0;
      totales_nomi_total_imss += parseFloat(nom.nomina_total_imss) || 0;
      totales_nomi_credito_fonacot += parseFloat(nom.nomina_credito_fonacot) || 0;
      totales_nomi_credito_infonavit += parseFloat(nom.nomina_credito_infonavit) || 0;
      totales_nomi_subsidio_empleo += parseFloat(nom.nomina_subsidio_empleo) || 0;
      //totales_nomi_subsidio_empleo_aplicado += parseFloat(nom.nomina_subsidio_empleo_aplicado) || 0;
      totales_nomi_otras_percepciones += parseFloat(nom.nomina_otras_percepciones) || 0;
      totales_nomi_total_percepciones += parseFloat(nom.nomina_total_percepciones) || 0;
      totales_nomi_otras_deducciones += parseFloat(nom.nomina_otras_deducciones) || 0;
      totales_nomi_total_deducciones += parseFloat(nom.nomina_total_deducciones) || 0;
      totales_nomi_total_efectivo += parseFloat(nom.nomina_total_efectivo) || 0;
      totales_nomi_total_en_especie += parseFloat(nom.nomina_total_en_especie) || 0;
      totales_nomi_neto_pagado += parseFloat(nom.nomina_neto_pagado) || 0;
      totales_nomi_salario_por_hora += parseFloat(nom.nomina_salario_por_hora) || 0;
      totales_nomi_horas_por_dia += parseFloat(nom.nomina_horas_por_dia) || 0;
    });

    this.nomina_totales.salario_diario = numeral(totales_nomi_salario_diario).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.salario_integrado = numeral(totales_nomi_salario_integrado).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.dias_trabajados = totales_nomi_dias_trabajados.toString();
    this.nomina_totales.faltas = totales_nomi_faltas.toString();
    this.nomina_totales.sueldo = numeral(totales_nomi_sueldo).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.horas_extras_dobles = numeral(totales_nomi_horas_extras_dobles).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.aguinaldo = numeral(totales_nomi_aguinaldo).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.horas_extras_triples = numeral(totales_nomi_horas_extras_triples).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.vacaciones = numeral(totales_nomi_vacaciones).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.prima_vacacional = numeral(totales_nomi_prima_vacacional).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.reparto_de_utilidades = numeral(totales_nomi_reparto_de_utilidades).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.despensa = numeral(totales_nomi_despensa).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.premios_de_asistencia = numeral(totales_nomi_premios_de_asistencia).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.premios_de_puntualidad = numeral(totales_nomi_premios_de_puntualidad).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.prima_dominical = numeral(totales_nomi_prima_dominical).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.bno_extra_x_comision_otro_edo = numeral(totales_nomi_bno_extra_x_comision_otro_edo).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.indemnizacion = numeral(totales_nomi_indemnizacion).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.prima_de_antiguedad = numeral(totales_nomi_prima_de_antiguedad).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.isr_ajustado_por_subsidio = numeral(totales_nomi_isr_ajustado_por_subsidio).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.total_isr = numeral(totales_nomi_total_isr).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.total_imss = numeral(totales_nomi_total_imss).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.credito_fonacot = numeral(totales_nomi_credito_fonacot).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.credito_infonavit = numeral(totales_nomi_credito_infonavit).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.subsidio_empleo = numeral(totales_nomi_subsidio_empleo).format('0,0.' + '0'.repeat(2));
    //this.nomina_totales.subsidio_empleo_aplicado = numeral(totales_nomi_subsidio_empleo_aplicado).format('0,0.'+'0'.repeat(2));
    this.nomina_totales.otras_percepciones = numeral(totales_nomi_otras_percepciones).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.total_percepciones = numeral(totales_nomi_total_percepciones).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.otras_deducciones = numeral(totales_nomi_otras_deducciones).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.total_deducciones = numeral(totales_nomi_total_deducciones).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.total_efectivo = numeral(totales_nomi_total_efectivo).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.total_en_especie = numeral(totales_nomi_total_en_especie).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.neto_pagado = numeral(totales_nomi_neto_pagado).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.salario_por_hora = numeral(totales_nomi_salario_por_hora).format('0,0.' + '0'.repeat(2));
    this.nomina_totales.horas_por_dia = numeral(totales_nomi_horas_por_dia).format('0,0.' + '0'.repeat(2));
    //this.nomina_totales.u_t_laboradas
  }

  verReportesEliminados() {
  }

  listando_reportes_eliminados_de_nomina() {
  }

  cargaXmlDispersion(token_nomina_recibo: string, e: any, objeto: any): void {
    const doc_xml = objeto.files[0];
    console.log(doc_xml.type);
    const validacion_xml = doc_xml.size <= 2000000 && doc_xml.type == 'text/xml';
    this.imagenEvidenciaXml = validacion_xml ? doc_xml : null;
    validacion_xml ? this.lecturaInternaXML(token_nomina_recibo, objeto) : this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
  }

  limpiaXMLData() {
    //this.resultXml = '';
    //cfdi:Comprobante
    //this.dataCFDI_comprobante = [];
    //cfdi:Comprobante//cfdi:CfdiRelacionados
    //this.dataCFDIRelacionados = [];
    //cfdi:Comprobante//cfdi:Emisor
    //this.dataCFDI_emisor_Rfc = '';
    //this.dataCFDIEmisor = [];
    //cfdi:Comprobante//cfdi:Receptor
    //this.dataCFDIReceptor = [];
    //this.dataCFDI_receptor_Rfc = '';
    //cfdi:Comprobante//cfdi:Conceptos
    //this.dataCFDI_conceptos = [];
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    //this.dataCFDIComplemento = [];
    //this.dataCFDI_complemento_UUID = '';
    //this.dataCFDI_complemento_SelloCFD = '';
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital//nomina12:Nomina
    //this.dataCFDI_nomina = [];
  }

  lecturaInternaXML(token_nomina_recibo: string, objeto: any) {
    const desg = this.nomina_desglose_dispersion.find((row: any) => row.token_nomina_recibo === token_nomina_recibo);
    desg.nomina_cfdi_comprobante = [];
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

          const rfc_emp_nomina_emisor = this.sessionContext.empresa_data?.rfc_emp || "";
          const company_emp_nomina_emisor = this.sessionContext.empresa_data?.company_name_large || "";

          const valida_cion_emisor_rfc = emisor_Rfc.toLowerCase() === rfc_emp_nomina_emisor.toLowerCase();

          const valida_cion_receptor_Rfc = receptor_Rfc.toLowerCase() === desg.nomina_empleado_rfc.toLowerCase();
          console.log("valida_cion_receptor_Rfc " + receptor_Rfc);

          const fechaInicialPago = this.cfdiServ.obtenComplementoFechaInicialPago(childNodes.getNodesByName("cfdi:Complemento")).toString();
          const fechaFinalPago = this.cfdiServ.obtenComplementoFechaFinalPago(childNodes.getNodesByName("cfdi:Complemento")).toString();
          const valida_cion_periodo = desg.nomina_periodo_fecha_inicio === fechaInicialPago && desg.nomina_periodo_fecha_fin === fechaFinalPago;
          console.log(desg.nomina_periodo_fecha_inicio);
          const valida_cion_UUID = complemento_UUID && receptor_Rfc && receptor_Rfc && xmlNode.getAttribute('Total');

          if (valida_cion_emisor_rfc && valida_cion_receptor_Rfc && valida_cion_periodo && valida_cion_UUID) {
            const total = parseFloat(xmlNode.getAttribute('Total')).toFixed(6);

            this.cfdiServ.validaEstadoCFDINominas(complemento_UUID, emisor_Rfc, receptor_Rfc, total).subscribe(
              response => {
                if (response.status == 'success' && response.estado == 'Vigente' && xmlNode.getAttribute('TipoDeComprobante') == "N") {
                  if (!response.encontrado) {
                    this.validator.correctoInputRow(objeto);
                    this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: 'CFDI es correcto.' });
                    desg.nomina_valida_xml = 'validoXml';

                    desg.nomina_cfdi_comprobante.push({
                      "FechaContabilizacion": xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "Version": xmlNode.getAttribute('Version') ? xmlNode.getAttribute('Version') : '---',
                      "Serie": xmlNode.getAttribute('Serie') ? xmlNode.getAttribute('Serie') : '---',
                      "Folio": xmlNode.getAttribute('Folio') ? xmlNode.getAttribute('Folio') : '---',
                      "Fecha": xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---',
                      "FormaDePago": xmlNode.getAttribute('FormaPago') ? xmlNode.getAttribute('FormaPago') : '---',
                      "Subtotal": xmlNode.getAttribute('SubTotal') ? xmlNode.getAttribute('SubTotal') : '---',
                      "Descuento": xmlNode.getAttribute('Descuento') ? xmlNode.getAttribute('Descuento') : '0.00',
                      "Moneda": xmlNode.getAttribute('Moneda') ? xmlNode.getAttribute('Moneda') : '---',
                      "TipoDeCambio": xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00',
                      "Total": xmlNode.getAttribute('Total') ? xmlNode.getAttribute('Total') : '0.00',
                      "Confirmacion": xmlNode.getAttribute('confirmacion') ? xmlNode.getAttribute('confirmacion') : '---',
                      "TipoDeComprobante": xmlNode.getAttribute('TipoDeComprobante') ? xmlNode.getAttribute('TipoDeComprobante') : '---',
                      "MetodoDePago": xmlNode.getAttribute('MetodoPago') ? xmlNode.getAttribute('MetodoPago') : '---',
                      "LugarDeExpedición": xmlNode.getAttribute('LugarExpedicion') ? xmlNode.getAttribute('LugarExpedicion') : '---',
                      "NoDeCertificado": xmlNode.getAttribute('NoCertificado') ? xmlNode.getAttribute('NoCertificado') : '---',
                      "Sello": xmlNode.getAttribute('Sello') ? xmlNode.getAttribute('Sello') : '---',
                      "Certificado": xmlNode.getAttribute('Certificado') ? xmlNode.getAttribute('Certificado') : '---',
                    });

                    nodo_emisor.forEach((child: any) => {
                      desg.nomina_cfdi_emisor.push({
                        "EmisorRfc": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---',
                        "EmisorNombre": child.getAttribute('Nombre') ? child.getAttribute('Nombre') : '---',
                        "EmisorRegimenFiscal": child.getAttribute('RegimenFiscal') ? child.getAttribute('RegimenFiscal') : '---',
                      });
                      //this.revisa_emisor_proveedor_registrado();
                    });

                    nodo_receptor.forEach((child: any) => {
                      desg.nomina_cfdi_receptor.push({
                        "ReceptorRfc": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---',
                        "ReceptorUsoCFDI": child.getAttribute('UsoCFDI') ? child.getAttribute('UsoCFDI') : '---'
                      });
                    });

                    console.log(desg.nomina_cfdi_comprobante);

                    nodo_conceptos.forEach(concepts => {
                      var list_conceptos: any = [];
                      concepts.children().forEach((cChild: any) => {
                        list_conceptos.push({
                          "ClaveProdServ": cChild.getAttribute("ClaveProdServ") ? cChild.getAttribute("ClaveProdServ") : "",
                          "Cantidad": cChild.getAttribute("Cantidad") ? cChild.getAttribute("Cantidad") : "",
                          "ClaveUnidad": cChild.getAttribute("ClaveUnidad") ? cChild.getAttribute("ClaveUnidad") : "",
                          "Descripcion": cChild.getAttribute("Descripcion") ? cChild.getAttribute("Descripcion") : "",
                          "ValorUnitario": cChild.getAttribute("ValorUnitario") ? cChild.getAttribute("ValorUnitario") : "",
                          "Importe": cChild.getAttribute("Importe") ? cChild.getAttribute("Importe") : "",
                          "Descuento": cChild.getAttribute("Descuento") ? cChild.getAttribute("Descuento") : "",
                          "ObjetoImp": cChild.getAttribute("ObjetoImp") ? cChild.getAttribute("ObjetoImp") : "",
                        });
                      });
                      desg.nomina_cfdi_conceptos = list_conceptos;
                      console.log(desg.nomina_cfdi_conceptos);
                    });

                    nodo_complemento.forEach((child: any) => {
                      const childNodes = child.children();
                      const timbreFiscalDigital = childNodes.getNodesByName("tfd:TimbreFiscalDigital");
                      timbreFiscalDigital.forEach((timbre: any) => {
                        desg.nomina_cfdi_complemento.push({
                          "UUID": timbre.getAttribute("UUID") ? timbre.getAttribute("UUID") : '---',
                          "FechaTimbrado": timbre.getAttribute("FechaTimbrado") ? timbre.getAttribute("FechaTimbrado") : '---',
                          "RfcProvCertif": timbre.getAttribute("RfcProvCertif") ? timbre.getAttribute("RfcProvCertif") : '---',
                          "NoCertificadoSAT": timbre.getAttribute("NoCertificadoSAT") ? timbre.getAttribute("NoCertificadoSAT") : '---',
                          "SelloCFD": timbre.getAttribute("SelloCFD") ? timbre.getAttribute("SelloCFD") : '---',
                          "SelloSAT": timbre.getAttribute("SelloSAT") ? timbre.getAttribute("SelloSAT") : '---'
                        });
                      });
                      //const timbreFDNodes = timbre.children();
                      const nomina12Nomina = childNodes.getNodesByName("nomina12:Nomina");
                      nomina12Nomina.forEach((nomina: any) => {
                        const childNomina = nomina.children();

                        var nomina_emisor: any = [];
                        const nomiEmisor = childNomina.getNodesByName("nomina12:Emisor");
                        nomiEmisor.forEach((nEmisor: any) => {
                          nomina_emisor.push({
                            "RegistroPatronal": nEmisor.getAttribute("RegistroPatronal")
                          });
                        });

                        var nomina_receptor: any = [];
                        const nomiReceptor = childNomina.getNodesByName("nomina12:Receptor");
                        nomiReceptor.forEach((nReceptor: any) => {
                          nomina_receptor.push({
                            "Antigüedad": nReceptor.getAttribute("Antigüedad"),
                            "Banco": nReceptor.getAttribute("Banco"),
                            "ClaveEntFed": nReceptor.getAttribute("ClaveEntFed"),
                            "CuentaBancaria": nReceptor.getAttribute("CuentaBancaria"),
                            "Curp": nReceptor.getAttribute("Curp"),
                            "Departamento": nReceptor.getAttribute("Departamento"),
                            "FechaInicioRelLaboral": nReceptor.getAttribute("FechaInicioRelLaboral"),
                            "NumEmpleado": nReceptor.getAttribute("NumEmpleado"),
                            "NumSeguridadSocial": nReceptor.getAttribute("NumSeguridadSocial"),
                            "PeriodicidadPago": nReceptor.getAttribute("PeriodicidadPago"),
                            "Puesto": nReceptor.getAttribute("Puesto"),
                            "RiesgoPuesto": nReceptor.getAttribute("RiesgoPuesto"),
                            "SalarioBaseCotApor": nReceptor.getAttribute("SalarioBaseCotApor"),
                            "SalarioDiarioIntegrado": nReceptor.getAttribute("SalarioDiarioIntegrado"),
                            "Sindicalizado": nReceptor.getAttribute("Sindicalizado"),
                            "TipoContrato": nReceptor.getAttribute("TipoContrato"),
                            "TipoJornada": nReceptor.getAttribute("TipoJornada"),
                            "TipoRegimen": nReceptor.getAttribute("TipoRegimen"),
                          });
                        });

                        var nomina_percepciones: any = [];
                        const nomiPercepciones = childNomina.getNodesByName("nomina12:Percepciones");
                        nomiPercepciones.forEach((nPercepciones: any) => {
                          var percepciones_percepcion: any = [];
                          const childPercepciones = nPercepciones.children();
                          const percepcionesPercepcion = childPercepciones.getNodesByName("nomina12:Percepcion");
                          percepcionesPercepcion.forEach((pPercepcion: any) => {
                            percepciones_percepcion.push({
                              "Clave": pPercepcion.getAttribute("Clave"),
                              "Concepto": pPercepcion.getAttribute("Concepto"),
                              "ImporteExento": pPercepcion.getAttribute("ImporteExento"),
                              "ImporteGravado": pPercepcion.getAttribute("ImporteGravado"),
                              "TipoPercepcion": pPercepcion.getAttribute("TipoPercepcion")
                            });
                          });

                          nomina_percepciones.push({
                            "TotalExento": nPercepciones.getAttribute("TotalExento"),
                            "TotalGravado": nPercepciones.getAttribute("TotalGravado"),
                            "TotalSueldos": nPercepciones.getAttribute("TotalSueldos"),
                            "Percepcion": percepciones_percepcion,
                          });
                        });

                        var nomina_deducciones: any = [];
                        const nomiDeducciones = childNomina.getNodesByName("nomina12:Deducciones");
                        nomiDeducciones.forEach((nDeducciones: any) => {
                          var deducciones_deduccion: any = [];
                          const childDeducciones = nDeducciones.children();
                          const deduccionesDeduccion = childDeducciones.getNodesByName("nomina12:Deduccion");
                          deduccionesDeduccion.forEach((dDeduccion: any) => {
                            deducciones_deduccion.push({
                              "Clave": dDeduccion.getAttribute("Clave"),
                              "Concepto": dDeduccion.getAttribute("Concepto"),
                              "Importe": dDeduccion.getAttribute("Importe"),
                              "TipoDeduccion": dDeduccion.getAttribute("TipoDeduccion")
                            });
                          });

                          nomina_deducciones.push({
                            "TotalImpuestosRetenidos": nDeducciones.getAttribute("TotalImpuestosRetenidos"),
                            "TotalOtrasDeducciones": nDeducciones.getAttribute("TotalOtrasDeducciones"),
                            "Deduccion": deducciones_deduccion,
                          });
                        });

                        var nomina_otros_pagos: any = [];
                        const nomiOtrosPagos = childNomina.getNodesByName("nomina12:OtrosPagos");
                        nomiOtrosPagos.forEach((nOtrosPagos: any) => {
                          const childOtrosPagos = nOtrosPagos.children();
                          const nomiOtroPago = childOtrosPagos.getNodesByName("nomina12:OtroPago");
                          nomiOtroPago.forEach((nOtroPago: any) => {
                            var subsidio_al_empleo: any = [];
                            const childOtroPago = nOtroPago.children();
                            const nomiSubsidioAlEmpleo = childOtroPago.getNodesByName("nomina12:SubsidioAlEmpleo");

                            nomiSubsidioAlEmpleo.forEach((nSubsidioAlEmpleo: any) => {
                              subsidio_al_empleo.push({
                                "SubsidioCausado": nSubsidioAlEmpleo.getAttribute("SubsidioCausado"),
                              });
                            });

                            nomina_otros_pagos.push({
                              "Clave": nOtroPago.getAttribute("Clave"),
                              "Concepto": nOtroPago.getAttribute("Concepto"),
                              "Importe": nOtroPago.getAttribute("Importe"),
                              "TipoOtroPago": nOtroPago.getAttribute("TipoOtroPago"),
                              "SubsidioAlEmpleo": subsidio_al_empleo,
                            });
                          });
                        });

                        desg.nomina_cfdi_nomina.push(
                          {
                            "FechaFinalPago": nomina.getAttribute("FechaFinalPago") ? nomina.getAttribute("FechaFinalPago") : '---',
                            "FechaInicialPago": nomina.getAttribute("FechaInicialPago") ? nomina.getAttribute("FechaInicialPago") : '---',
                            "FechaPago": nomina.getAttribute("FechaPago") ? nomina.getAttribute("FechaPago") : '---',
                            "NumDiasPagados": nomina.getAttribute("NumDiasPagados") ? nomina.getAttribute("NumDiasPagados") : '---',
                            "TipoNomina": nomina.getAttribute("TipoNomina") ? nomina.getAttribute("TipoNomina") : '---',
                            "TotalDeducciones": nomina.getAttribute("TotalDeducciones") ? nomina.getAttribute("TotalDeducciones") : '---',
                            "TotalOtrosPagos": nomina.getAttribute("TotalOtrosPagos") ? nomina.getAttribute("TotalOtrosPagos") : '---',
                            "TotalPercepciones": nomina.getAttribute("TotalPercepciones") ? nomina.getAttribute("TotalPercepciones") : '---',
                            "Version": nomina.getAttribute("Version") ? nomina.getAttribute("Version") : '---',
                            "Emisor": nomina_emisor,
                            "Receptor": nomina_receptor,
                            "Percepciones": nomina_percepciones,
                            "Deducciones": nomina_deducciones,
                            "OtrosPagos": nomina_otros_pagos,
                          }
                        );
                      });
                    });

                    console.log(desg.nomina_cfdi_nomina);
                    console.log(desg.nomina_cfdi_complemento);
                    desg.nomina_factura_xml = this.imagenEvidenciaXml;
                    //desg.nomina_cfdi_comprobante = this.dataCFDI_comprobante;
                    //desg.nomina_cfdi_emisor = this.dataCFDIEmisor;
                    //desg.nomina_cfdi_receptor = this.dataCFDIReceptor;
                    //desg.nomina_cfdi_conceptos = this.dataCFDI_conceptos;
                    //desg.nomina_cfdi_complemento = this.dataCFDIComplemento;
                    //desg.nomina_cfdi_nomina = this.dataCFDI_nomina;
                    console.log(desg);
                  } else {
                    this.validator.errorInputRow(objeto);
                    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El documento CFDI ya se encuentra vinculado a otros procesos de nómina' });
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
            desg.nomina_valida_xml = 'errorXml';
            if (!valida_cion_emisor_rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del emisor no coincide con el rfc de ' + company_emp_nomina_emisor + '.' });
            if (!valida_cion_receptor_Rfc) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del receptor no coincide con el rfc de ' + desg.nomina_empleado_nombre + '.' });
            if (!valida_cion_periodo) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Los periodos de pago del documento CFDI no coinciden' });
            if (!valida_cion_UUID) this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos para validar el CFDI en el SAT.' });
            this.validator.errorInputRow(objeto);
          }

        } else {
          desg.nomina_valida_xml = 'errorXml';
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
          this.validator.errorInputRow(objeto);
        }
      };
      reader.readAsText(this.imagenEvidenciaXml);
    } else {
      this.validator.errorInputRow(objeto);
    }
  }

  escanPdfDispersion(token_nomina_recibo: string, e: any, objeto: any): void {
    const doc_pdf = objeto.files[0];
    const validacion_pdf = doc_pdf.size <= 2000000 && (doc_pdf.type == 'application/pdf');
    this.imagenEvidenciaPdf = validacion_pdf ? doc_pdf : null;
    validacion_pdf ? this.validator.correctoInputRow(objeto) : this.validator.errorInputRow(objeto);
    if (validacion_pdf) {
      const desg = this.nomina_desglose_dispersion.find((row: any) => row.token_nomina_recibo === token_nomina_recibo);
      desg.nomina_factura_pdf = this.imagenEvidenciaPdf;
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

  get validaTrabCFDILoaded(): boolean {
    const desg = this.nomina_desglose_dispersion.filter((row: any) => row.nomina_factura_doc_xml === null && row.nomina_factura_doc_pdf === null && row.nomina_factura_xml !== null && row.nomina_factura_pdf !== null);
    return desg.length > 0 ? true : false;
  }

  cargaNominaCFDIS(token_nominas_periodos: string): void {
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
        let nominas_facts = this.nomina_desglose_dispersion.filter((row: any) => row.nomina_factura_xml !== null && row.nomina_factura_pdf !== null);
        this.nominaServ.carga_cfdi_nominas(token_nominas_periodos, nominas_facts).subscribe(
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
              this.verNominaDesglose(token_nominas_periodos);
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

  deleteNomina(token_nominas_periodos: any) {
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
        this.nominaServ.valorHumanoNominaEliminar(token_nominas_periodos).subscribe(
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
              this.listando_reportes_de_nomina();
              this.listando_reportes_deleted_de_nomina();
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

  listando_reportes_deleted_de_nomina() {
    this.nominaServ.catalogo_reportes_eliminados_nomina().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.list_nomina_reportes_eliminados = response.nominas;
          console.log(this.list_nomina_reportes_eliminados);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  restauraNomina(token_nominas_periodos: any) {
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
        this.nominaServ.valorHumanoNominaRestaurar(token_nominas_periodos).subscribe(
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
              this.listando_reportes_de_nomina();
              this.listando_reportes_deleted_de_nomina();
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

  deletePermanenteNomina(token_nominas_periodos: any) {
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
        this.nominaServ.valorHumanoNominaEliminacionPermanente(token_nominas_periodos).subscribe(
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
              this.listando_reportes_de_nomina();
              this.listando_reportes_deleted_de_nomina();
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
