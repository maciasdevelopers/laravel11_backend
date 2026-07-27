import { Component, OnInit } from '@angular/core';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { MonedasService } from '../../../../servicios/monedas.service';
import { CFDIService } from '../../../../servicios/xml/cfdi.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import numeral from 'numeral';

@Component({
  selector: 'tools_visor_de_cfdi',
  standalone: false,
  templateUrl: './visor-de-cfdi.html',
  styleUrls: [
    '../../../../styles/landing.css',
    '../../../../styles/input_group.css',
    '../../../../styles/buttons.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/explain.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/page_landing_index.css',
    './visor-de-cfdi.css'
  ],
})
export class VisorDeCfdi implements OnInit {
  public identidad: any;

  //monedas
  catalogo_monedas_api: any = [];
  //Factura CFDI (XML)
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

  //dataCFDIRelacionados:any = [];
  dataCFDIRelacionados_obj: any = {};

  //cfdi:Comprobante//cfdi:Emisor
  dataCFDIEmisor_obj: any = {};
  dataEmisor: any = [];
  public dataCFDI_emisor_Rfc: string = '';
  public dataCFDI_emisor_token: string = '';
  public dataCFDI_emisor_Rfc_registrado: boolean = false;
  public dataCFDI_emisor_new_registro: boolean = false;

  public aplica_anticipo_a_proveedor: string = "No";
  proveedorAnticipoTotal: number = 0;
  proveedorAnticipoTotalFormat: string = "";
  proveedorAnticipoaplicado: number = 0;
  proveedorAnticipoRestanteFormat: string = "";
  public prov_seleccionado_acepta_credito: boolean = false;

  //cfdi:Comprobante//cfdi:Receptor
  dataCFDIReceptor_obj: any = {};
  public dataCFDI_receptor_Rfc: string = '';
  public dataCFDI_receptor_UsoCFDI: string = '';
  //cfdi:Comprobante//cfdi:Conceptos'
  dataCFDI_conceptos: any = [];
  public dataCFDI_concepto_traslados:string = "";
  dataCFDIBuscarConcepto: any = [];
  retencionSeleccionada: any;
  trasladoSeleccionado: string = "";
  public selectvalidatexmlArticulos: boolean = false;
  public compra_subtotal: string = '0.00';
  public compra_descuento: string = '0.00';
  public compra_retenciones: string = '0.00';
  public compra_traslados: string = '0.00';
  public compra_total: string = '0.00';
  //impuestos //cfdi:Comprobante/cfdi:Impuestos
  public dataCFDI_impuestos_retenidos_total: number = 0;
  dataCFDI_impuestos_retenidos_lista: any = [];
  public dataCFDI_impuestos_trasladados_total: number = 0;
  dataCFDI_impuestos_trasladados_lista: any = [];
  //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
  //dataCFDIComplemento:any = [];
  dataCFDIComplemento_obj: any = {};
  dataCFDIComplemento_carta_porte_obj : any = {};
  public dataCFDI_complemento_UUID: string = '';
  public dataCFDI_complemento_SelloCFD: string = '';
  //activos
  listActivosFijos: any = [];
  rangoPeriodoActivos: Date[] | undefined;
  indicadorActivosGeneral:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  expandRowsActivoFijo: { [s: string]: boolean } = {};

  listActivosIntangibles: any = [];
  expandRowsActivoDiferido: { [s: string]: boolean } = {};
  public compra_fecha_recepcion_activo: string = "";

 public articulos_nuevo_registro: any = [];

  constructor(
    private validator: ValidatorServService,
    private _monedasServ: MonedasService,
    private cfdiServ: CFDIService,
    private translate: TranslateService,
    private primeAlerts: MessageService
  ) {
  }

  ngOnInit(): void {
    this.monedasCatalogoApi();

    this.dataCFDIBuscarConcepto = ['num_lista', 'NoIdentificacion', 'ObjetoImp', 'ClaveProdServ', 'Cantidad', 'ClaveUnidad', 'Unidad', 'Descripcion', 'ValorUnitario', 'Descuento',
      'Importe', 'TotalRetenciones', 'TotalTraslados', 'Subtotal', 'Impuestos', 'articulo_retenciones_modal', 'retenciones', 'expandedRowsRetenciones',
      'traslados', 'expandedRowsTraslados', 'traslados_llenados', 'articulo_homologado_iva',
      'articulo_homologado_registro_tipo', 'articulo_homologado_token', 'articulo_homologado_view',
      'articulo_homologado_nombre', 'articulo_homologado_logotipo', 'articulo_homologado_clasificacion', 'articulo_homologado_identificador', 'articulo_homologado_serie_bool',
      'articulo_homologado_serie_view', 'articulo_homologado_serie_token', 'articulo_homologado_serie_numero', 'articulo_homologado_lote_bool', 'articulo_homologado_lote_view',
      'articulo_homologado_lote_token', 'articulo_homologado_lote_numero', 'articulo_homologado_pedimento_bool', 'articulo_homologado_pedimento_view', 'articulo_homologado_pedimento_token',
      'articulo_homologado_pedimento_numero', 'articulo_homologado_view_uso', 'articulo_homologado_uso', 'articulo_homologado_efecto_fiscal', 'articulo_homologado_view_activos',
      'articulo_homologado_activoFijo', 'articulo_homologado_activoDiferido', 'articulo_homologado_prorratea', 'articulo_homologado_gastos_rel', 'articulo_homologado_periodicidad_view',
      'articulo_homologado_periodicidadPc', 'articulo_homologado_iteracionPc', 'articulo_homologado_periodoDetIndPc', 'articulo_homologado_fechaFinPc', 'articulo_homologado_tipoImporteVi',
      'articulo_homologado_monedaVi', 'articulo_homologado_monedaDecimalesVi', 'articulo_homologado_importeMinVi', 'articulo_homologado_importeMaxVi', 'articulo_homologado_periodicidad_reg', 'activa_desglose'];
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

  keepOrder = (a: any, b: any): number => {
    return 0;
  }

  formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private leerXmlAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  async cargaXmlCompra(e: any, objeto: any): Promise<void> {
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
    //cfdi:Comprobante//cfdi:CfdiRelacionados
    this.dataCFDIRelacionados_obj = {};
    //cfdi:Comprobante//cfdi:Emisor
    this.dataCFDI_emisor_Rfc = '';
    this.dataCFDI_emisor_Rfc_registrado = false;
    this.dataCFDI_emisor_new_registro = false;
    this.dataCFDIEmisor_obj = {};
    //cfdi:Comprobante//cfdi:Receptor
    this.dataCFDIReceptor_obj = {};
    this.dataCFDI_receptor_Rfc = '';
    this.dataCFDI_receptor_UsoCFDI = '';
    //cfdi:Comprobante//cfdi:Conceptos'
    this.dataCFDI_conceptos = [];
    //impuestos //cfdi:Comprobante/cfdi:Impuestos
    this.dataCFDI_impuestos_retenidos_total = 0;
    this.dataCFDI_impuestos_retenidos_lista = [];
    this.dataCFDI_impuestos_trasladados_total = 0;
    this.dataCFDI_impuestos_trasladados_lista = [];
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    this.dataCFDIComplemento_obj = {};
    this.dataCFDIComplemento_carta_porte_obj = {};
    this.dataCFDI_complemento_UUID = '';
    this.dataCFDI_complemento_SelloCFD = '';
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

      //const rfc_emp_user_receptor = this.sessionContext.empresa_data?.rfc_emp || "";
      //const company_emp_user_receptor = this.sessionContext.empresa_data?.company_name_large || "";

      //const valida_cion_emisor_rfc = rfc_emp_user_receptor.toLowerCase() === this.dataCFDI_receptor_Rfc.toLowerCase();
      //if (!valida_cion_emisor_rfc) {
      //  this.disparaErrorLocal(objeto, 'El rfc del receptor no coincide con el rfc de ' + company_emp_user_receptor + '.');
      //  return;
      //}

      const generales_cfdi_validacion = this.dataCFDI_complemento_UUID && this.dataCFDI_emisor_Rfc && this.dataCFDI_receptor_Rfc && this.dataCFDI_comprobante_Total;
      if (!generales_cfdi_validacion) {
        this.disparaErrorLocal(objeto, 'Faltan datos para validar el CFDI en el SAT.');
        return;
      }
      const total = parseFloat(this.dataCFDI_comprobante_Total).toFixed(6);

      //this.revisa_emisor_proveedor_registrado();

      this.cfdiServ.visorCfdiEstadoXmlIngresos(this.dataCFDI_complemento_UUID, this.dataCFDI_emisor_Rfc, this.dataCFDI_receptor_Rfc, total).subscribe(
        response => {
          const valida_resp_estado = response.status == 'success' && response.estado == 'Vigente' && (this.dataCFDI_comprobante_TipoComprobante == "I" || this.dataCFDI_comprobante_TipoComprobante == "E");
          if (!valida_resp_estado) {
            this.disparaErrorLocal(objeto, 'Faltan datos para validar el CFDI en el SAT.');
            return;
          }

          if (response.encontrado) {
            this.disparaErrorLocal(objeto, 'El documento CFDI ya se encuentra vinculado a otros procesos de compras');
            return;
          }

          this.procesaCuerpoCFDI(xmlNode, childNodes);
          //if (this.prodservCatGeneral.length === 0) {
          //  this.listar_catalogo_general_prod_serv();
          //}
          this.validator.correctoInputRow(objeto);
          //this.comprobarVinculacionArticulos();
          //this.abrirPaginaSAT();
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

  procesaCuerpoCFDI(xmlNode: any, childNodes: any) {
    this.dataCFDI_comprobante_obj = {
      version: xmlNode.getAttribute('Version') || '---',
      serie: xmlNode.getAttribute('Serie') || '---',
      folio: xmlNode.getAttribute('Folio') || '---',
      fecha: xmlNode.getAttribute('Fecha') || '---',
      forma_de_pago: xmlNode.getAttribute('FormaPago') || '---',
      subtotal: xmlNode.getAttribute('SubTotal') || '---',
      moneda: xmlNode.getAttribute('Moneda') || '---',
      tipo_de_cambio: xmlNode.getAttribute('TipoCambio') || '1.00',
      total: xmlNode.getAttribute('Total') || '---',
      confirmacion: xmlNode.getAttribute('confirmacion') || '---',
      tipo_de_comprobante: xmlNode.getAttribute('TipoDeComprobante') || '---',
      metodo_de_pago: xmlNode.getAttribute('MetodoPago') || '---',
      lugar_de_expedicion: xmlNode.getAttribute('LugarExpedicion') || '---',
      no_de_certificado: xmlNode.getAttribute('NoCertificado') || '---',
      sello: xmlNode.getAttribute('Sello') || '---',
      certificado: xmlNode.getAttribute('Certificado') || '---'
    };

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
        ClaveProdServ: cChild.getAttribute("ClaveProdServ") || "",
        ValorUnitario: numeral(cChild.getAttribute("ValorUnitario") || 0).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Cantidad: cChild.getAttribute("Cantidad") || 0,
        Descuento: numeral(descuentoPartida).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Importe: numeral(parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida)).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        TotalRetenciones: numeral(total_retenciones).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        articulo_retenciones_modal: false,
        retenciones: list_retenciones,
        TotalTraslados: numeral(total_traslados).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        traslados: list_traslados,
        Subtotal: numeral(cfdiSubtotal).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        NoIdentificacion: cChild.getAttribute("NoIdentificacion") || "",
        ObjetoImp: cChild.getAttribute("ObjetoImp") || "",
        ClaveUnidad: cChild.getAttribute("ClaveUnidad") || "",
        Impuestos: list_impuestos,
      }
    });
    console.log(this.dataCFDI_conceptos);

    this.calcularTotalesGenerales();

    const nodo_impuestos = childNodes.getNodesByName("cfdi:Impuestos");
    nodo_impuestos.forEach((child: any) => {
      this.dataCFDI_impuestos_retenidos_total = parseFloat(child.getAttribute('TotalImpuestosRetenidos') || 0);
      this.dataCFDI_impuestos_trasladados_total = parseFloat(child.getAttribute('TotalImpuestosTrasladados') || 0);
      const raiz_impuestos: any = child.children();
      console.log(raiz_impuestos);

      this.dataCFDI_impuestos_retenidos_lista = [];
      raiz_impuestos.forEach((rChild: any) => {
        let iNodo_name = rChild.name();
        const nodo_detalle: any = rChild.children();
        nodo_detalle.forEach((rtChild: any) => {
          const row_impuesto = {
            "Base": rtChild.getAttribute("Base"),
            "Impuesto": rtChild.getAttribute("Impuesto"),
            "TipoFactor": rtChild.getAttribute("TipoFactor"),
            "TasaOCuota": rtChild.getAttribute("TasaOCuota"),
            "Importe": rtChild.getAttribute("Importe"),
          };

          if (iNodo_name == "cfdi:Retenciones") {
            this.dataCFDI_impuestos_retenidos_lista.push(row_impuesto);
          } else if (iNodo_name == "cfdi:Traslados") {
            this.dataCFDI_impuestos_trasladados_lista.push(row_impuesto);
          }
          console.log(rtChild.getAttribute("Base"));
        });
      });
    });

    const nodo_complemento = childNodes.getNodesByName("cfdi:Complemento");
    this.obtenUUID(nodo_complemento);
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
        rfc_del_receptor: child.getAttribute('Rfc') || '---',
        uso_del_cfdi: child.getAttribute('UsoCFDI') || '---',
      };
      this.dataCFDI_receptor_UsoCFDI = child.getAttribute('UsoCFDI');
    });
  }

  obtenUUID(nodo_complemento: any) {
    nodo_complemento.forEach((child: any) => {
      const raiz_complemento: any = child.children();
      console.log(raiz_complemento)
      const nodo_timbre_fiscal = raiz_complemento.getNodesByName("tfd:TimbreFiscalDigital");
      nodo_timbre_fiscal.forEach((rChild: any) => {
        this.dataCFDIComplemento_obj = {
          UUID: rChild.getAttribute("UUID") || '---',
          FechaTimbrado: rChild.getAttribute("FechaTimbrado") || '---',
          RfcProvCertif: rChild.getAttribute("RfcProvCertif") || '---',
          NoCertificadoSAT: rChild.getAttribute("NoCertificadoSAT") || '---',
          SelloCFD: rChild.getAttribute("SelloCFD") || '---',
          SelloSAT: rChild.getAttribute("SelloSAT") || '---',
        };
      });

      const nodo_carta_aporte = raiz_complemento.getNodesByName("cartaporte31:CartaPorte");
      nodo_carta_aporte.forEach((rcp: any) => {
        this.dataCFDIComplemento_carta_porte_obj = {
          Version: rcp.getAttribute("Version") || '---',
          IdCCP: rcp.getAttribute("IdCCP") || '---',
          TranspInternac: rcp.getAttribute("TranspInternac") || '---',
          TotalDistRec: rcp.getAttribute("TotalDistRec") || 0,
        };
      });
    });
  }

  private disparaErrorLocal(objeto: any, mensaje: string) {
    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: mensaje });
    this.validator.errorInputRow(objeto);
    this.resultXml = 'errorXml';
  }

  calcularTotalesGenerales() {
    let subtotal = 0, descuento = 0, retenciones = 0, traslados = 0, total = 0;

    this.dataCFDI_conceptos.forEach((concept: any) => {
      // Usamos el operador unario (+) o parseFloat para asegurar valores numéricos
      subtotal += +concept.Importe || 0;
      descuento += +concept.Descuento || 0;
      retenciones += +concept.TotalRetenciones || 0;
      traslados += +concept.TotalTraslados || 0;
      total += +concept.Subtotal || 0;
    });

    const formato = '0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales);

    this.compra_subtotal = numeral(subtotal).format(formato);
    this.compra_descuento = numeral(descuento).format(formato);
    this.compra_retenciones = numeral(retenciones).format(formato);
    this.compra_traslados = numeral(traslados).format(formato);
    this.compra_total = numeral(total).format(formato);
  }

  activaBotonRetencionesClass(row_cfdi_concept: any) {
    var clase = "";
    if (this.dataEmisor.length > 0 && row_cfdi_concept.retenciones.length > 0) {
      clase = "bg-blue-600";
    } else {
      clase = "bg-blue-600 disabled";
    }
    return clase;
  }

  activaBotonRetencionesEnabled(row_cfdi_concept: any) {
    const valida_abre_tras = this.dataEmisor.length > 0 && row_cfdi_concept.retenciones.length > 0;
    return valida_abre_tras;
  }

  activaBotonRetencionesIcono(row_cfdi_concept: any) {
    var clase = "";
    if (this.dataEmisor.length > 0 && row_cfdi_concept.retenciones.length > 0) {
      clase = "fa-eye";
    } else {
      clase = "fa-ban";
    }
    return clase;
  }

  verConceptoXMLRetenciones(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_retenciones_modal = !row_cfdi_concept.articulo_retenciones_modal ? true : false;
  }

  activaBotonTrasladosClass(row_cfdi_concept: any) {
    var clase = "";
    const emi_vacio = Object.keys(this.dataCFDIEmisor_obj).length > 0;
    if (emi_vacio && row_cfdi_concept.traslados.length > 0) {
      clase = "bg-blue-600";
    } else {
      clase = "bg-blue-600 disabled";
    }
    return clase;
  }

  activaBotonTrasladosEnabled(row_cfdi_concept: any) {
    const emi_vacio = Object.keys(this.dataCFDIEmisor_obj).length > 0;
    const valida_abre_tras = emi_vacio && row_cfdi_concept.traslados.length > 0;
    return valida_abre_tras;
  }

  activaBotonTrasladosIcono(row_cfdi_concept: any) {
    var clase = "";
    const emi_vacio = Object.keys(this.dataCFDIEmisor_obj).length > 0;
    if (emi_vacio && row_cfdi_concept.traslados.length > 0) {
      clase = "fa-eye";
    } else {
      clase = "fa-ban";
    }
    return clase;
  }

  verConceptoXMLTraslados(row_cfdi_concept: any) {
    this.dataCFDI_concepto_traslados = this.dataCFDI_concepto_traslados === row_cfdi_concept ? null : row_cfdi_concept;
  }
}
