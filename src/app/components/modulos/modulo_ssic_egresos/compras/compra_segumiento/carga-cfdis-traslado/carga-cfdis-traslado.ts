import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { comprasModeloFContabilizacion } from '../../../../../../modelos/compras/compra/comprasModeloFContabilizacion';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import { CFDIService } from '../../../../../../servicios/xml/cfdi.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionContextService } from '../../../../../../servicios/session-context';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { MessageService } from 'primeng/api';
import { cfdiTrasladoModelo } from '../../../../../../modelos/cfdiTrasladoModelo.';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import numeral from 'numeral';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'egresos_compras_carga_cfdis_traslado',
  standalone: false,
  templateUrl: './carga-cfdis-traslado.html',
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/file_input.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/sat_web_page.css',
    '../../../../../../styles/totales.css',
    '../../../egresos.css',
    './carga-cfdis-traslado.css'
  ],
})
export class CargaCfdisTraslado implements OnInit, OnDestroy{
  private subs: Subscription = new Subscription();
  public view_form_traslado_cfdi: boolean = true;
  public fcontab_compra_modelo: comprasModeloFContabilizacion;
  public modeloTrasladoCFDI: cfdiTrasladoModelo;

  private destruir$ = new Subject<void>();
  public usuario: Usuarios;
  public identidad: any;

  //monedas
  catalogo_monedas_api: any = [];

  public imagenEvidenciaXml: any;
  public resultXml: string = '';

  complem_cporte_ubica_domi: any;
  complem_cporte_merc_autot_atidveh: any;
  complem_cporte_merc_autot_seguros: any;
  complem_cporte_merc_autot_remolques: any;
  complem_cporte_contenedor_maritimo: any;
  complem_cporte_ferro_derechos_de_paso: any;
  complem_cporte_ferro_carro: any;

  //Factura CFDI (PDF)
  public imagenEvidenciaPdf: any;
  //verificacion de comprobante
  public imagenEvidenciaVerificacion: any;
  
  public compra_subtotal: string = '0.00';
  public compra_descuento: string = '0.00';
  public compra_retenciones: string = '0.00';
  public compra_traslados: string = '0.00';
  public compra_total: string = '0.00';

  searchComprasGeneral:any = [];
  arrayComprasGeneral:any = [];
  indicadorComprasGeneral:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoCompras: Date[] | undefined;
  loading = false;
  comprasSeleccionadas:any = [];
  metaKey: boolean = true;

  public carga_traslado_fecha_contabilizacion: string = '';
  public carga_traslado_cfdi_observaciones: string = '';
  @ViewChild('formCargaCFDITraslado') formCargaCFDITraslado!: NgForm;

  constructor(
    private sentinela: SentinelArkManager,
    private validator: ValidatorServService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private cfdiServ: CFDIService,
    private compraServ: ComprasServService,
    private translate: TranslateService,
    private sessionContext: SessionContextService,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef, 
    private primeAlerts: MessageService
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
    this.fcontab_compra_modelo = new comprasModeloFContabilizacion('', false);
    this.modeloTrasladoCFDI = new cfdiTrasladoModelo(
      //cfdi:Comprobante
      {},'','1.00','',2,'','','',
      //dataCFDIRelacionados
      {},
      //cfdi:Comprobante//cfdi:Emisor
      {},[],'','',false,false,"No",0,"",0,"",false,
      //cfdi:Comprobante//cfdi:Receptor
      {},'','',
      //cfdi:Comprobante//cfdi:Conceptos'
      [],[],false,'0.00','0.00','0.00','0.00','0.00',
      //impuestos //cfdi:Comprobante/cfdi:Impuestos
      0,[],0,[],
      //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
      //dataCFDIComplemento
      {},{},'',''
    );
    //this.modelLote = new loteAngularModelo('','','','');
    //this.modelPedim = new pedimentoAngularModelo('','','','','');
  }

  ngOnInit(): void {
    // Al arrancar, inicializamos el formulario con el primer camión obligatorio
    //this.anadirTransporte();
    this.monedasCatalogoApi();

    this.lista_general_compras('hoy');
    this.getRespuestaRegistroBuy();
    this.searchComprasGeneral = ['folio_compra','fecha_contabilizacion','proveedor_folio','proveedor_nombre','proveedor_nombre_comercial','compra_a_credito',
      'fecha_vencimiento','compra_moneda','compra_subtotal','compra_descuento','compra_retenciones','compra_traslados','importe_total_compra','aplica_recepcion_facturas',
      'recibeFactura','cfdi_comprobante_version','cfdi_comprobante_serie','cfdi_comprobante_folio','cfdi_comprobante_fecha','cfdi_comprobante_forma_de_pago','cfdi_comprobante_metodo_de_pago',
      'cfdi_comprobante_subtotal','cfdi_comprobante_moneda','cfdi_comprobante_tipo_de_cambio','cfdi_comprobante_total','cfdi_comprobante_confirmacion','cfdi_comprobante_tipo_de_comprobante',
      'cfdi_complementoFechaTimbrado','cfdi_complementoUUID','articulos_recibidos','total_articulos','lugarRecepcionTipo','lugarRecepcionTipo','lugarRecepcionDireccion','status_autorizacion',
      'existe_orden_recepcion','proveedor_token','bloqueo_orden_recepcion','uuid_orden_recepcion','folio_orden_pago','fecha_contabilizacion_orden_pago','pagos_realizados_fecha_contabilizacion',
      'pagos_realizados_fecha_contabilizacion','existe_orden_pago'];
  }

  getRespuestaRegistroBuy(){
    this.relInterna.mensajeCompraRegistro$.subscribe(
      (mensaje:any) => {
        if (mensaje == "nuevo_registro") {
          this.lista_general_compras('hoy');
        }
      }
    );
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

  select_fecha_contabilizacion(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.carga_traslado_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
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
    this.modeloTrasladoCFDI = new cfdiTrasladoModelo(
      //cfdi:Comprobante
      {},'','1.00','',2,'','','',
      //dataCFDIRelacionados
      {},
      //cfdi:Comprobante//cfdi:Emisor
      {},[],'','',false,false,"No",0,"",0,"",false,
      //cfdi:Comprobante//cfdi:Receptor
      {},'','',
      //cfdi:Comprobante//cfdi:Conceptos'
      [],[],false,'0.00','0.00','0.00','0.00','0.00',
      //impuestos //cfdi:Comprobante/cfdi:Impuestos
      0,[],0,[],
      //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
      //dataCFDIComplemento
      {},{},'',''
    );
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

      this.modeloTrasladoCFDI.dataCFDI_comprobante_Total = xmlNode.getAttribute('Total');
      this.modeloTrasladoCFDI.dataCFDI_comprobante_TipoComprobante = xmlNode.getAttribute('TipoDeComprobante');
      this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc = this.cfdiServ.obtenRFCEmisor(childNodes.getNodesByName("cfdi:Emisor")).toString();
      this.modeloTrasladoCFDI.dataCFDI_receptor_Rfc = this.cfdiServ.obtenReceptor(childNodes.getNodesByName("cfdi:Receptor")).toString();
      this.modeloTrasladoCFDI.dataCFDI_complemento_UUID = this.cfdiServ.obtenComplementoUUID(childNodes.getNodesByName("cfdi:Complemento")).toString();
      this.modeloTrasladoCFDI.dataCFDI_complemento_SelloCFD = this.cfdiServ.obtenComplementoSelloCFD(childNodes.getNodesByName("cfdi:Complemento")).toString();

      const rfcEmpresaLocal = (this.sessionContext.empresa_data?.rfc_emp || "").toLowerCase();
      const nombreEmpresaLocal = this.sessionContext.empresa_data?.company_name_large || "";
      const esTraslado = this.modeloTrasladoCFDI.dataCFDI_comprobante_TipoComprobante === 'T';
      
      // 2. Validación flexible de RFC para operaciones de Traslado
      const rfcEmisorXml = this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc.toLowerCase();
      const rfcReceptorXml = this.modeloTrasladoCFDI.dataCFDI_receptor_Rfc.toLowerCase();
      
      // Si es traslado, permitimos que nuestra empresa sea emisor OR receptor. 
      // Si no es ninguno de los dos, se activa el flujo de resguardo/terceros (puedes flexibilizarlo aún más aquí si lo requieres).
      const esRfcValido = esTraslado 
        ? (rfcEmpresaLocal === rfcEmisorXml || rfcEmpresaLocal === rfcReceptorXml || rfcReceptorXml.includes('xaxx010101'))
        : (rfcEmpresaLocal === rfcReceptorXml);

      if (!esRfcValido) {
        this.disparaErrorLocal(objeto, `El RFC del XML no corresponde a las operaciones autorizadas para ${nombreEmpresaLocal}.`);
        return;
      }

      const generales_cfdi_validacion = this.modeloTrasladoCFDI.dataCFDI_complemento_UUID && 
                                        this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc && 
                                        this.modeloTrasladoCFDI.dataCFDI_receptor_Rfc && 
                                        this.modeloTrasladoCFDI.dataCFDI_comprobante_Total;

      if (!generales_cfdi_validacion) {
        this.disparaErrorLocal(objeto, 'Faltan datos requeridos (UUID/RFCs) para validar el CFDI ante el SAT.');
        return;
      }
      const total = parseFloat(this.modeloTrasladoCFDI.dataCFDI_comprobante_Total || '0').toFixed(6);

      //this.revisa_emisor_proveedor_registrado();

      this.cfdiServ.validaEstadoCFDICompras(this.modeloTrasladoCFDI.dataCFDI_complemento_UUID, this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc, this.modeloTrasladoCFDI.dataCFDI_receptor_Rfc, total).subscribe(
        response => {
          console.log(response);
          const valida_resp_estado = response.status == 'success' && response.estado == 'Cancelado'/*Vigente*/ && this.modeloTrasladoCFDI.dataCFDI_comprobante_TipoComprobante == "T";
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

  getRespuestaRegistroProveed() {
    //this.proveedorRegistroSubscription = this.relInterna.mensajeProveedorEgresos$.subscribe(
    //  (mensaje: any) => {
    //    mensaje == "registro aprobado" ? this.revisa_emisor_proveedor_registrado() : null;
    //  }
    //);
  }

  revisa_emisor_proveedor_registrado() {
    this._provServ.verificaExistProveedorByRFC(this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc).subscribe(
      response => {
        let translate_response = this.translate.instant(response.message);
        if (response.status == "success") {
          this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: translate_response });
          this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc_registrado = true;
          this.modeloTrasladoCFDI.dataCFDI_emisor_new_registro = false;
          this.modeloTrasladoCFDI.dataCFDI_emisor_token = response.token;
          //this.prov_seleccionado_acepta_credito = response.aceptacredito;
          this.descarga_info_proveedor(response.token);
          this.listar_articulos_proveedor(response.token);
          this.listar_anticipos_proveedor(response.token);
          this.comprobarVinculacionArticulos();
        }
        if (response.status == "error") {
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });
          this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc_registrado = false;
          this.modeloTrasladoCFDI.dataCFDI_emisor_new_registro = true;
        }
      },
      error => {
        //console.log(error);
      }
    )
  }

  descarga_info_proveedor(token_cat_proveedores: any) {
    this.modeloTrasladoCFDI.dataEmisor = [];
    console.log("token_cat_proveedores " + token_cat_proveedores);
    this._provServ.verDetalleProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.modeloTrasladoCFDI.dataEmisor = response.proveedor;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  getRespuestaRegistroINVENT(){
    this.relInterna.mensajeProdInvent$.subscribe(
      (mensaje:any) => {
        if (mensaje == "producto registrado") {
          this.listar_articulos_proveedor(this.modeloTrasladoCFDI.dataCFDI_emisor_token);
          $('#modalPrdInventarioReg').modal('hide');
          $('.modal-backdrop').remove();
        }
      }
    );
  }

  getRespuestaProveedorServicios() {
    this.relInterna.mensajeInsertServCompras$.subscribe(
      (mensaje: any) => {
        $('#windowProveedorRegistro').modal('hide');
        $('.modal-backdrop').remove();
        console.log("services reg.");
        mensaje == "servicio registrado" ? this.listar_articulos_proveedor(this.modeloTrasladoCFDI.dataCFDI_emisor_token) : null;
        //mensaje == "servicio registrado" ? this.listar_catalogo_general_prod_serv() : null;
      }
    );
  }

  listar_articulos_proveedor(token_cat_proveedores: any) {
    this.compraServ.listaProdServComprasProv(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          //this.productosVincLista = response.listaArticulos;
          //console.log(this.productosVincLista);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listar_anticipos_proveedor(token_cat_proveedores: any) {
    this._provServ.listarAnticiposDisponiblesProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response);
          //this.aplica_anticipo_a_proveedor = "";
          //this.proveedorAnticipoTotal = response.anticipo_total;
          //this.proveedorAnticipoTotalFormat = response.anticipo_total_format;
          //this.proveedorAnticipoRestanteFormat = response.anticipo_total_format;
        }
      }
    );
  }

  verVentanaEmisorProveedorRegistro() {
    this.modeloTrasladoCFDI.dataCFDI_emisor_new_registro = true;
  }

  procesaCuerpoCFDI(xmlNode: any, childNodes: any) {
    this.fcontab_compra_modelo.fecha_contabilizacion = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';
    //this.compra_fecha_contabilizacion = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';
    //this.compra_fecha_vencimiento = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';

    this.modeloTrasladoCFDI.dataCFDI_comprobante_obj = {
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

    this.modeloTrasladoCFDI.dataCFDI_comprobante_formaPago = xmlNode.getAttribute('FormaPago');
    this.modeloTrasladoCFDI.dataCFDI_comprobante_MetodoPago = xmlNode.getAttribute('MetodoPago');
    this.modeloTrasladoCFDI.dataCFDI_comprobante_TipoCambio = xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00';
    this.modeloTrasladoCFDI.dataCFDI_comprobante_Moneda = xmlNode.getAttribute('Moneda');
    const moneda_CFDI = this.catalogo_monedas_api.find((row: any) => row.code === this.modeloTrasladoCFDI.dataCFDI_comprobante_Moneda);
    this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales = moneda_CFDI.decimales;
    console.log("dataCFDI_comprobante_MoneDecimales " + this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales);
    console.log(this.modeloTrasladoCFDI.dataCFDI_comprobante_obj);

    const nodo_cfdi_relacionados = childNodes.getNodesByName("cfdi:CfdiRelacionados");
    this.llenaCfdiRelacionados(nodo_cfdi_relacionados);
    const nodo_emisor = childNodes.getNodesByName("cfdi:Emisor");
    this.obtenEmisor(nodo_emisor);
    const nodo_receptor = childNodes.getNodesByName("cfdi:Receptor");
    this.obtenReceptor(nodo_receptor);
    const nodo_conceptos_row = childNodes.getNodesByName("cfdi:Conceptos")[0]?.children() || [];

    this.modeloTrasladoCFDI.dataCFDI_conceptos = nodo_conceptos_row.map((cChild: any, index: number) => {
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
        NoIdentificacion: cChild.getAttribute("NoIdentificacion") || "",
        ObjetoImp: cChild.getAttribute("ObjetoImp") || "",
        ClaveProdServ: cChild.getAttribute("ClaveProdServ") || "",
        Cantidad: cChild.getAttribute("Cantidad") || 0,
        ClaveUnidad: cChild.getAttribute("ClaveUnidad") || "",
        Unidad: cChild.getAttribute("Unidad") || "",
        Descripcion: cChild.getAttribute("Descripcion") || "",

        ValorUnitario: numeral(cChild.getAttribute("ValorUnitario") || 0).format('0.' + '0'.repeat(this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales)),
        Descuento: numeral(descuentoPartida).format('0.' + '0'.repeat(this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales)),
        Importe: numeral(parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida)).format('0.' + '0'.repeat(this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales)),
        TotalRetenciones: numeral(total_retenciones).format('0.' + '0'.repeat(this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales)),
        TotalTraslados: numeral(total_traslados).format('0.' + '0'.repeat(this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales)),
        Subtotal: numeral(cfdiSubtotal).format('0.' + '0'.repeat(this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales)),
        //impuestos
        Impuestos: list_impuestos,
        //retenciones
        articulo_retenciones_modal: false,
        retenciones: list_retenciones,
        expandedRowsRetenciones: expandRowsRetenciones,
        retenciones_llenadas: false,
        //traslados
        articulo_traslados_modal: false,
        traslados: list_traslados,
        expandedRowsTraslados: expandRowsTraslados,
        traslados_llenados: false,
        //iva
        articulo_homologado_iva: "",
        //Articulo para guardar
        articulo_guardar_tkn: "",
        articulo_guardar_identificador: "",
        //Articulo a homologar generales
        articulo_homologado_comprobacion: true,
        articulo_homologado_ventana_registro: false,
        articulo_homologado_registro_tipo: '',
        articulo_homologado_token: "",
        articulo_homologado_view: false,
        articulo_homologado_nombre: "",
        articulo_homologado_logotipo: "",
        articulo_homologado_clasificacion: "",
        articulo_homologado_identificador: "",
        //Articulo a homologar series
        articulo_homologado_serie_bool: false,
        articulo_homologado_serie_view: false,
        articulo_homologado_serie_token: "",
        articulo_homologado_serie_numero: "",
        //Articulo a homologar lotes
        articulo_homologado_lote_bool: false,
        articulo_homologado_lote_view: false,
        articulo_homologado_lote_token: "",
        articulo_homologado_lote_numero: "",
        //Articulo a homologar pedimentos
        articulo_homologado_pedimento_bool: false,
        articulo_homologado_pedimento_view: false,
        articulo_homologado_pedimento_token: "",
        articulo_homologado_pedimento_numero: "",
        //Articulo a homologar uso
        articulo_homologado_view_uso: false,
        temp_articulo_uso: "",
        temp_articulo_efecto_fiscal: "",
        articulo_homologado_uso: "",
        articulo_homologado_efecto_fiscal: "",
        //Articulo a homologar uso
        articulo_homologado_view_activos: false,
        expandedRowsActivoFijo: expandRowsActivosFijos,
        temp_activo_fijo: "",
        articulo_homologado_activoFijo: "",
        //activos diferidos
        temp_activo_diferido: "",
        articulo_homologado_activoDiferido: "",
        temp_activo_diferido_foliado: [],
        articulo_homologado_activo_diferido_foliado: [],
        //prorrateos
        articulo_homologado_prorratea: false,
        //gastos relacionados
        articulo_homologado_gastos_rel: [],
        //periodicidad
        articulo_homologado_periodicidad_view: false,
        articulo_homologado_periodicidadPc: "",
        articulo_homologado_iteracionPc: "",
        articulo_homologado_periodoDetIndPc: "",
        articulo_homologado_fechaFinPc: "",
        //variabilidad de importe
        articulo_homologado_tipoImporteVi: "",
        articulo_homologado_monedaVi: "",
        articulo_homologado_monedaDecimalesVi: "",
        articulo_homologado_importeMinVi: "",
        articulo_homologado_importeMaxVi: "",
        articulo_homologado_periodicidad_reg: false,
        //desglose
        activa_desglose: false,
      }
    });
    console.log(this.modeloTrasladoCFDI.dataCFDI_conceptos);

    this.calcularTotalesGenerales();

    const nodo_impuestos = childNodes.getNodesByName("cfdi:Impuestos");
    nodo_impuestos.forEach((child: any) => {
      this.modeloTrasladoCFDI.dataCFDI_impuestos_retenidos_total = parseFloat(child.getAttribute('TotalImpuestosRetenidos') || 0);
      this.modeloTrasladoCFDI.dataCFDI_impuestos_trasladados_total = parseFloat(child.getAttribute('TotalImpuestosTrasladados') || 0);
      const raiz_impuestos: any = child.children();
      console.log(raiz_impuestos);

      this.modeloTrasladoCFDI.dataCFDI_impuestos_retenidos_lista = [];
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
            this.modeloTrasladoCFDI.dataCFDI_impuestos_retenidos_lista.push(row_impuesto);
          } else if (iNodo_name == "cfdi:Traslados") {
            this.modeloTrasladoCFDI.dataCFDI_impuestos_trasladados_lista.push(row_impuesto);
          }
          console.log(rtChild.getAttribute("Base"));
        });
      });
    });

    const nodo_complemento = childNodes.getNodesByName("cfdi:Complemento");
    this.obtenUUID(nodo_complemento);
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

      this.modeloTrasladoCFDI.dataCFDIRelacionados_obj = {
        tipo_de_relacion: tipoRelacion || '---',
        UUID: relacionados_uuid || '---',
      };
    });
  }

  obtenEmisor(nodo_emisor: any) {
    nodo_emisor.forEach((child: any) => {
      this.modeloTrasladoCFDI.dataCFDIEmisor_obj = {
        rfc_del_emisor: child.getAttribute('Rfc') || '---',
        nombre_del_emisor: child.getAttribute('Nombre') || '---',
        regimen_fiscal_del_emisor: child.getAttribute('RegimenFiscal') || '---',
      };
    });
  }

  obtenReceptor(nodo_receptor: any) {
    nodo_receptor.forEach((child: any) => {
      this.modeloTrasladoCFDI.dataCFDIReceptor_obj = {
        rfc_del_receptor: child.getAttribute('Rfc') || '---',
        uso_del_cfdi: child.getAttribute('UsoCFDI') || '---',
      };
      this.modeloTrasladoCFDI.dataCFDI_receptor_UsoCFDI = child.getAttribute('UsoCFDI');
    });
  }

  obtenUUID(nodo_complemento:any) {
    nodo_complemento.forEach((child: any) => {
      const raiz_complemento: any = child.children();
      console.log(raiz_complemento)
      const nodo_timbre_fiscal = raiz_complemento.getNodesByName("tfd:TimbreFiscalDigital");
      nodo_timbre_fiscal.forEach((rChild: any) => {
        this.modeloTrasladoCFDI.dataCFDIComplemento_obj = {
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
        const raiz_cporte: any = rcp.children();
        let raiz_merc: any = null;
        let list_ubicaciones: any = [];
        let list_mercancias: any = [];
        let list_figura_transporte: any = [];

        const nodo_ubicaciones = raiz_cporte.getNodesByName("cartaporte31:Ubicaciones");
        nodo_ubicaciones.forEach((ubir:any) => {
          const raiz_ubica: any = ubir.children();
          const nodo_ubicacion = raiz_ubica.getNodesByName("cartaporte31:Ubicacion");
          nodo_ubicacion.forEach((ubid:any) => {
            let ubi_domi_calle:string = "";
            let ubi_numero_exterior:string = "";
            let ubi_numero_interior:string = "";
            let ubi_domi_colonia:string = "";
            let ubi_domi_localidad:string = "";
            let ubi_domi_referencia:string = "";
            let ubi_domi_municipio:string = "";
            let ubi_domi_estado:string = "";
            let ubi_domi_pais:string = "";
            let ubi_domi_codigopostal:string = "";
            const ubica_domi: any = ubid.children();
            const nodo_domicilio = ubica_domi.getNodesByName("cartaporte31:Domicilio");
            nodo_domicilio.forEach((udomi:any) => {
              ubi_domi_calle = udomi.getAttribute("Calle") || "";
              ubi_numero_exterior = udomi.getAttribute("NumeroExterior") || "";
              ubi_numero_interior = udomi.getAttribute("NumeroInterior") || "";
              ubi_domi_colonia = udomi.getAttribute("Colonia") || "";
              ubi_domi_localidad = udomi.getAttribute("Localidad") || "";
              ubi_domi_referencia = udomi.getAttribute("Referencia") || "";
              ubi_domi_municipio = udomi.getAttribute("Municipio") || "";
              ubi_domi_estado = udomi.getAttribute("Estado") || "";
              ubi_domi_pais = udomi.getAttribute("Pais") || "";
              ubi_domi_codigopostal = udomi.getAttribute("CodigoPostal") || "";
            });
  
            const row_ubicacion = {
              TipoUbicacion: ubid.getAttribute("TipoUbicacion") || "",
              IdUbicacion: ubid.getAttribute("IdUbicacion") || "",
              RFCRemitenteDestinatario: ubid.getAttribute("RFCRemitenteDestinatario") || "", 
              NombreRemitenteDestinatario: ubid.getAttribute("NombreRemitenteDestinatario") || "", 
              NumRegIdTrib: ubid.getAttribute("NumRegIdTrib") || "", 
              ResidenciaFiscal: ubid.getAttribute("ResidenciaFiscal") || "",
              NumEstacion: ubid.getAttribute("NumEstacion") || "",
              NombreEstacion: ubid.getAttribute("NombreEstacion") || "",
              NavegacionTrafico: ubid.getAttribute("NavegacionTrafico") || "",
              FechaHoraSalidaLlegada: ubid.getAttribute("FechaHoraSalidaLlegada") || "",
              TipoEstacion: ubid.getAttribute("TipoEstacion") || "",
              DistanciaRecorrida: ubid.getAttribute("DistanciaRecorrida") || 0,

              Calle: ubi_domi_calle,
              NumeroExterior: ubi_numero_exterior,
              NumeroInterior: ubi_numero_interior,
              Colonia: ubi_domi_colonia,
              Localidad: ubi_domi_localidad,
              Referencia: ubi_domi_referencia,
              Municipio: ubi_domi_municipio,
              Estado: ubi_domi_estado,
              Pais: ubi_domi_pais,
              CodigoPostal: ubi_domi_codigopostal,
            };
            list_ubicaciones.push(row_ubicacion);
          });
        });
        console.log(list_ubicaciones);

        const nodo_mercancias = raiz_cporte.getNodesByName("cartaporte31:Mercancias");
        nodo_mercancias.forEach((mercr:any) => {
          let mercancia: any = [];
          raiz_merc = mercr.children();
          const nodo_mercancia = raiz_merc.getNodesByName("cartaporte31:Mercancia");
          nodo_mercancia.forEach((merca:any) => {
            let documentacionAduanera: any = [];//
            const raiz_autot: any = merca.children();
            const nodo_doc_aduanera = raiz_autot.getNodesByName("cartaporte31:DocumentacionAduanera");
            nodo_doc_aduanera.forEach((aduan:any) => {
              documentacionAduanera.push({
                TipoDocumento: aduan.getAttribute("TipoDocumento") || "",
                NumPedimento: aduan.getAttribute("NumPedimento") || "", 
                IdentDocAduanero: aduan.getAttribute("IdentDocAduanero") || "", 
                RFCImpo: aduan.getAttribute("RFCImpo") || ""
              });
            });

            let guias_identificacion: any = [];//
            const nodo_identif_guias = raiz_autot.getNodesByName("cartaporte31:GuiasIdentificacion");
            nodo_identif_guias.forEach((guia_id:any) => {
              guias_identificacion.push({
                NumeroGuiaIdentificacion: guia_id.getAttribute("NumeroGuiaIdentificacion") || "",
                DescripGuiaIdentificacion: guia_id.getAttribute("DescripGuiaIdentificacion") || "", 
                PesoGuiaIdentificacion: guia_id.getAttribute("PesoGuiaIdentificacion") || ""
              });
            });

            let cantidad_transporta: any = [];//
            const nodo_cant_transporta = raiz_autot.getNodesByName("cartaporte31:CantidadTransporta");
            nodo_cant_transporta.forEach((cntTr:any) => {
              cantidad_transporta.push({
                Cantidad: cntTr.getAttribute("Cantidad") || "",
                IDOrigen: cntTr.getAttribute("IDOrigen") || "", 
                IDDestino: cntTr.getAttribute("IDDestino") || "", 
                CvesTransporte: cntTr.getAttribute("CvesTransporte") || ""
              });
            });

            let detalle_mercancia: any = [];//
            const nodo_merc_det = raiz_autot.getNodesByName("cartaporte31:DetalleMercancia");
            nodo_merc_det.forEach((detMr:any) => {
              detalle_mercancia.push({
                UnidadPesoMerc: detMr.getAttribute("UnidadPesoMerc") || "",
                PesoBruto: detMr.getAttribute("PesoBruto") || "", 
                PesoNeto: detMr.getAttribute("PesoNeto") || "", 
                PesoTara: detMr.getAttribute("PesoTara") || "", 
                NumPiezas: detMr.getAttribute("NumPiezas") || ""
              });
            });

            let descripcionesespecificas: any = [];//
            const nodo_desc_espe = raiz_autot.getNodesByName("cartaporte31:DescripcionesEspecificas");
            nodo_desc_espe.forEach((detMr:any) => {
              descripcionesespecificas.push({
                Marca: detMr.getAttribute("Marca") || "",
                Modelo: detMr.getAttribute("Modelo") || "", 
                SubModelo: detMr.getAttribute("SubModelo") || "", 
                NumeroSerie: detMr.getAttribute("NumeroSerie") || ""
              });
            });

            const row_mercancia = {
              BienesTransp: merca.getAttribute("BienesTransp") || "",
              ClaveSTCC: merca.getAttribute("ClaveSTCC") || "",
              Descripcion: merca.getAttribute("Descripcion") || "", 
              Cantidad: merca.getAttribute("Cantidad") || 0, 
              ClaveUnidad: merca.getAttribute("ClaveUnidad") || "",
              Unidad: merca.getAttribute("Unidad") || "",
              Dimensiones: merca.getAttribute("Dimensiones") || "",
              MaterialPeligroso: merca.getAttribute("MaterialPeligroso") || "",
              CveMaterialPeligroso: merca.getAttribute("CveMaterialPeligroso") || "",
              Embalaje: merca.getAttribute("Embalaje") || "",
              DescripEmbalaje: merca.getAttribute("DescripEmbalaje") || "",
              SectorCOFEPRIS: merca.getAttribute("SectorCOFEPRIS") || "",
              NombreIngredienteActivo: merca.getAttribute("NombreIngredienteActivo") || "",
              NomQuimico: merca.getAttribute("NomQuimico") || "",
              DenominacionGenericaProd: merca.getAttribute("DenominacionGenericaProd") || "",
              DenominacionDistintivaProd: merca.getAttribute("DenominacionDistintivaProd") || "",
              Fabricante: merca.getAttribute("Fabricante") || "",

              FechaCaducidad: merca.getAttribute("FechaCaducidad") || "",
              LoteMedicamento: merca.getAttribute("LoteMedicamento") || "",
              FormaFarmaceutica: merca.getAttribute("FormaFarmaceutica") || "",
              CondicionesEspTransp: merca.getAttribute("CondicionesEspTransp") || "",
              RegistroSanitarioFolioAutorizacion: merca.getAttribute("RegistroSanitarioFolioAutorizacion") || "",
              PermisoImportacion: merca.getAttribute("PermisoImportacion") || "",
              FolioImpoVUCEM: merca.getAttribute("FolioImpoVUCEM") || "",
              NumCAS: merca.getAttribute("NumCAS") || "",
              RazonSocialEmpImp: merca.getAttribute("RazonSocialEmpImp") || "",
              NumRegSanPlagCOFEPRIS: merca.getAttribute("NumRegSanPlagCOFEPRIS") || "",
              DatosFabricante: merca.getAttribute("DatosFabricante") || "",
              DatosFormulador: merca.getAttribute("DatosFormulador") || "",
              DatosMaquilador: merca.getAttribute("DatosMaquilador") || "",
              UsoAutorizado: merca.getAttribute("UsoAutorizado") || "",
              PesoEnKg: merca.getAttribute("PesoEnKg") || 0,
              ValorMercancia: merca.getAttribute("ValorMercancia") || 0,
              Moneda: merca.getAttribute("Moneda") || "",
              FraccionArancelaria: merca.getAttribute("FraccionArancelaria") || "",
              UUIDComercioExt: merca.getAttribute("UUIDComercioExt") || "",
              TipoMateria: merca.getAttribute("TipoMateria") || "",
              DescripcionMateria: merca.getAttribute("DescripcionMateria") || "",
              DocumentacionAduanera:documentacionAduanera,
              GuiasIdentificacion:guias_identificacion,
              CantidadTransporta:cantidad_transporta,
              DetalleMercancia:detalle_mercancia,
              DescripcionesEspecificas:descripcionesespecificas
            };
            mercancia.push(row_mercancia);
          });

          const row_merc_raiz = {
            PesoBrutoTotal: mercr.getAttribute("PesoBrutoTotal") || 0,
            UnidadPeso: mercr.getAttribute("UnidadPeso") || "", 
            PesoNetoTotal: mercr.getAttribute("PesoNetoTotal") || 0,
            NumTotalMercancias: mercr.getAttribute("NumTotalMercancias") || 0,
            CargoPorTasacion: mercr.getAttribute("CargoPorTasacion") || 0,
            LogisticaInversaRecoleccionDevolucion: mercr.getAttribute("LogisticaInversaRecoleccionDevolucion") || "",
            Mercancia:mercancia
          };
          list_mercancias.push(row_merc_raiz);
        });
        console.log(list_mercancias);

        let autotransporte: any = [];
        const nodo_autotransp = raiz_cporte.getNodesByName("cartaporte31:Autotransporte").length > 0 
          ? raiz_cporte.getNodesByName("cartaporte31:Autotransporte") 
          : raiz_merc.getNodesByName("cartaporte31:Autotransporte");
        
        nodo_autotransp.forEach((autot:any) => {
          let ident_vehi_config_vehicular: string = "";
          let ident_vehi_peso_bruto_vehicular: string = "";
          let ident_vehi_placa_vm: string = "";
          let ident_vehi_anio_modelo_vm: string = "";
          
          const raiz_autot: any = autot.children();
          const nodo_ident_vehi = raiz_autot.getNodesByName("cartaporte31:IdentificacionVehicular");
          nodo_ident_vehi.forEach((vehi:any) => {
            ident_vehi_config_vehicular = vehi.getAttribute("ConfigVehicular") || "";
            ident_vehi_peso_bruto_vehicular = vehi.getAttribute("PesoBrutoVehicular") || 0; 
            ident_vehi_placa_vm = vehi.getAttribute("PlacaVM") || ""; 
            ident_vehi_anio_modelo_vm = vehi.getAttribute("AnioModeloVM") || "";
          });

          let seguros_AseguraRespCivil: string = "";
          let seguros_PolizaRespCivil: string = "";
          let seguros_AseguraMedAmbiente: string = "";
          let seguros_PolizaMedAmbiente: string = "";
          let seguros_AseguraCarga: string = "";
          let seguros_PolizaCarga: string = "";
          let seguros_PrimaSeguro: string = "";
          const nodo_seguros = raiz_autot.getNodesByName("cartaporte31:Seguros");
          nodo_seguros.forEach((segu_ro:any) => {
            seguros_AseguraRespCivil = segu_ro.getAttribute("AseguraRespCivil") || "";
            seguros_PolizaRespCivil = segu_ro.getAttribute("PolizaRespCivil") || "";
            seguros_AseguraMedAmbiente = segu_ro.getAttribute("AseguraMedAmbiente") || "";
            seguros_PolizaMedAmbiente = segu_ro.getAttribute("PolizaMedAmbiente") || "";
            seguros_AseguraCarga = segu_ro.getAttribute("AseguraCarga") || "";
            seguros_PolizaCarga = segu_ro.getAttribute("PolizaCarga") || "";
            seguros_PrimaSeguro = segu_ro.getAttribute("PrimaSeguro") || 0;
          });

          let remolques: any = [];//
          const nodo_remolques = raiz_autot.getNodesByName("cartaporte31:Remolques");
          nodo_remolques.forEach((remo_r:any) => {
            const raiz_remolques: any = remo_r.children();
            const nodo_remolque = raiz_remolques.getNodesByName("cartaporte31:Remolque");
            nodo_remolque.forEach((remol:any) => {
              const row_remolque = {
                SubTipoRem: remol.getAttribute("SubTipoRem") || "",
                Placa: remol.getAttribute("Placa") || ""
              };
              remolques.push(row_remolque);
            });
          });

          const row_autot = {
            PermSCT: autot.getAttribute("PermSCT") || "",
            NumPermisoSCT: autot.getAttribute("NumPermisoSCT") || "",
            //IdentificacionVehicular
            ConfigVehicular: ident_vehi_config_vehicular,
            PesoBrutoVehicular:  ident_vehi_peso_bruto_vehicular, 
            PlacaVM:  ident_vehi_placa_vm, 
            AnioModeloVM: ident_vehi_anio_modelo_vm,
            //Seguros
            AseguraRespCivil: seguros_AseguraRespCivil,
            PolizaRespCivil: seguros_PolizaRespCivil,
            AseguraMedAmbiente: seguros_AseguraMedAmbiente,
            PolizaMedAmbiente: seguros_PolizaMedAmbiente,
            AseguraCarga: seguros_AseguraCarga,
            PolizaCarga: seguros_PolizaCarga,
            PrimaSeguro: seguros_PrimaSeguro,
            //remolques
            Remolques: remolques,
          };
          autotransporte.push(row_autot);
        });
        
        let transporte_maritimo: any = [];//
        const nodoTransporteMaritimo = raiz_cporte.getNodesByName("cartaporte31:TransporteMaritimo");
        nodoTransporteMaritimo.forEach((marit:any) => {
          let ContenedorMar: any = [];//
          const raiz_marit: any = marit.children();
          const nodoContenedorMar = raiz_marit.getNodesByName("cartaporte31:ContenedorM");
          nodoContenedorMar.forEach((contM:any) => {
            ContenedorMar.push({
              TipoContenedor: contM.getAttribute("TipoContenedor") || "",
              MatriculaContenedor: contM.getAttribute("MatriculaContenedor") || "",
              NumPrecinto: contM.getAttribute("NumPrecinto") || "",
              IdCCPRelacionado: contM.getAttribute("IdCCPRelacionado") || "",
              PlacaVMCCP: contM.getAttribute("PlacaVMCCP") || "",
              FechaCertificacionCCP: contM.getAttribute("FechaCertificacionCCP") || "",
            });
          });
          
          const row_marit = {
            PermSCT: marit.getAttribute("PermSCT") || "",
            NumPermisoSCT: marit.getAttribute("NumPermisoSCT") || "",
            NombreAseg: marit.getAttribute("NombreAseg") || "",
            NumPolizaSeguro: marit.getAttribute("NumPolizaSeguro") || "",
            TipoEmbarcacion: marit.getAttribute("TipoEmbarcacion") || "",
            Matricula: marit.getAttribute("Matricula") || "",
            NumeroOMI: marit.getAttribute("NumeroOMI") || "",
            AnioEmbarcacion: marit.getAttribute("AnioEmbarcacion") || "",
            NombreEmbarc: marit.getAttribute("NombreEmbarc") || "",
            NacionalidadEmbarc: marit.getAttribute("NacionalidadEmbarc") || "",
            UnidadesDeArqBruto: marit.getAttribute("UnidadesDeArqBruto") || 0,
            TipoCarga: marit.getAttribute("TipoCarga") || "",
            Eslora: marit.getAttribute("Eslora") || 0,
            Manga: marit.getAttribute("Manga") || 0,
            Calado: marit.getAttribute("Calado") || 0,
            Puntal: marit.getAttribute("Puntal") || 0,
            LineaNaviera: marit.getAttribute("LineaNaviera") || "",
            NombreAgenteNaviero: marit.getAttribute("NombreAgenteNaviero") || "",
            NumAutorizacionNaviero: marit.getAttribute("NumAutorizacionNaviero") || "",
            NumViaje: marit.getAttribute("NumViaje") || "",
            NumConocEmbarc: marit.getAttribute("NumConocEmbarc") || "",
            PermisoTempNavegacion: marit.getAttribute("PermisoTempNavegacion") || "",
            ContenedorM:ContenedorMar
          };
          transporte_maritimo.push(row_marit);
        });

        let transporte_aereo: any = [];//
        const nodoTransporteAereo = raiz_cporte.getNodesByName("cartaporte31:TransporteAereo");
        nodoTransporteAereo.forEach((t_air:any) => {
          transporte_aereo.push({
            PermSCT: t_air.getAttribute("PermSCT") || "",
            NumPermisoSCT: t_air.getAttribute("NumPermisoSCT") || "",
            MatriculaAeronave: t_air.getAttribute("MatriculaAeronave") || "",
            NombreAseg: t_air.getAttribute("NombreAseg") || "",
            NumPolizaSeguro: t_air.getAttribute("NumPolizaSeguro") || "",
            NumeroGuia: t_air.getAttribute("NumeroGuia") || "",
            LugarContrato: t_air.getAttribute("LugarContrato") || "",
            CodigoTransportista: t_air.getAttribute("CodigoTransportista") || "",
            RFCEmbarcador: t_air.getAttribute("RFCEmbarcador") || "",
            NumRegIdTribEmbarc: t_air.getAttribute("NumRegIdTribEmbarc") || "",
            ResidenciaFiscalEmbarc: t_air.getAttribute("ResidenciaFiscalEmbarc") || "",
            NombreEmbarcador: t_air.getAttribute("NombreEmbarcador") || "",
          });
        });

        let transporte_ferroviario: any = [];//
        const nodoTransporteFerroviario = raiz_cporte.getNodesByName("cartaporte31:TransporteFerroviario");
        nodoTransporteFerroviario.forEach((tFerro:any) => {
          const raiz_ferro: any = tFerro.children();
          let derechos_de_paso: any = [];//
          const nodoTransFerroDerechos = raiz_ferro.getNodesByName("cartaporte31:DerechosDePaso");
          nodoTransFerroDerechos.forEach((dere:any) => {
            derechos_de_paso.push({
              TipoDerechoDePaso: dere.getAttribute("TipoDerechoDePaso") || "",
              KilometrajePagado: dere.getAttribute("KilometrajePagado") || 0
            });
          });

          let carro: any = [];//
          const nodoTransFerroCarro = raiz_ferro.getNodesByName("cartaporte31:Carro");
          nodoTransFerroCarro.forEach((car_f:any) => {
            let carro_contenedor: any = [];//
            const nodoTransFerroCarroContenedor = raiz_cporte.getNodesByName("cartaporte31:Contenedor");
            nodoTransFerroCarroContenedor.forEach((conten_car:any) => {
              carro_contenedor.push({
                TipoContenedor: conten_car.getAttribute("TipoContenedor") || "",
                PesoContenedorVacio: conten_car.getAttribute("PesoContenedorVacio") || 0,
                PesoNetoMercancia: conten_car.getAttribute("PesoNetoMercancia") || 0
              });
            });
          
            carro.push({
              TipoCarro: car_f.getAttribute("TipoCarro") || "",
              MatriculaCarro: car_f.getAttribute("MatriculaCarro") || "",
              GuiaCarro: car_f.getAttribute("GuiaCarro") || "",
              ToneladasNetasCarro: car_f.getAttribute("ToneladasNetasCarro") || 0,
              Contenedor: carro_contenedor
            });
          });

          const row_ferrovia = {
            TipoDeServicio: tFerro.getAttribute("TipoDeServicio") || "",
            TipoDeTrafico: tFerro.getAttribute("TipoDeTrafico") || "",
            NombreAseg: tFerro.getAttribute("NombreAseg") || "",
            NumPolizaSeguro: tFerro.getAttribute("NumPolizaSeguro") || "",
            DerechosDePaso: derechos_de_paso,
            Carro: carro
          };
          transporte_ferroviario.push(row_ferrovia);
        });

        let partes_transporte: any = [];//
        const nodoPartesTransporte = raiz_cporte.getNodesByName("cartaporte31:PartesTransporte");
        nodoPartesTransporte.forEach((remo_r:any) => {
          partes_transporte.push({
            ParteTransporte: remo_r.getAttribute("ParteTransporte") || "",
            IdPartesTransporte: remo_r.getAttribute("IdPartesTransporte") || ""
          });
        });

        const nodo_figura_transporte = raiz_cporte.getNodesByName("cartaporte31:FiguraTransporte");
        nodo_figura_transporte.forEach((fig_t:any) => {
          const raiz_fig_t: any = fig_t.children();
          const nodo_tipos_figura = raiz_fig_t.getNodesByName("cartaporte31:TiposFigura");
          nodo_tipos_figura.forEach((ctf:any) => {
            const row_tipos_figura = {
              TipoFigura: ctf.getAttribute("TipoFigura") || "",
              RFCFigura: ctf.getAttribute("RFCFigura") || "", 
              NumLicencia: ctf.getAttribute("NumLicencia") || "", 
              NombreFigura: ctf.getAttribute("NombreFigura") || "", 
              NumRegIdTribFigura: ctf.getAttribute("NumRegIdTribFigura") || "", 
              ResidenciaFiscalFigura: ctf.getAttribute("ResidenciaFiscalFigura") || ""
            };
            list_figura_transporte.push(row_tipos_figura);
          });
        });

        this.modeloTrasladoCFDI.dataCFDIComplemento_carta_porte_obj = {
          Version: rcp.getAttribute("Version") || '---',
          IdCCP: rcp.getAttribute("IdCCP") || '---',
          TranspInternac: rcp.getAttribute("TranspInternac") || '---',
          RegimenAduanero: rcp.getAttribute("RegimenAduanero") || '---',
          EntradaSalidaMerc: rcp.getAttribute("EntradaSalidaMerc") || '---',
          PaisOrigenDestino: rcp.getAttribute("PaisOrigenDestino") || '---',
          ViaEntradaSalida: rcp.getAttribute("ViaEntradaSalida") || '---',
          TotalDistRec: rcp.getAttribute("TotalDistRec") || 0,
          RegistroISTMO: rcp.getAttribute("RegistroISTMO") || '---',
          UbicacionPoloOrigen: rcp.getAttribute("UbicacionPoloOrigen") || '---',
          UbicacionPoloDestino: rcp.getAttribute("UbicacionPoloDestino") || '---',
          
          ubicaciones: list_ubicaciones,
          mercancias: list_mercancias,
          Autotransporte:autotransporte,
          FiguraTransporte: list_figura_transporte,
          TransporteMaritimo: transporte_maritimo,
          TransporteAereo: transporte_aereo,
          TransporteFerroviario: transporte_ferroviario,
          PartesTransporte: partes_transporte,
        };
      });
    });
  }

  verConceptoDireccion(ubica:any) {
    this.complem_cporte_ubica_domi = this.complem_cporte_ubica_domi === ubica ? null : ubica;
  }

  verATIDVehConcepto(atidveh:any) {
    this.complem_cporte_merc_autot_atidveh = this.complem_cporte_merc_autot_atidveh === atidveh ? null : atidveh;
    this.complem_cporte_merc_autot_seguros = null;
    this.complem_cporte_merc_autot_remolques = null;
  }

  verSegurosTranspConcepto(seguros:any) {
    this.complem_cporte_merc_autot_atidveh = null;
    this.complem_cporte_merc_autot_seguros = this.complem_cporte_merc_autot_seguros === seguros ? null : seguros;
    this.complem_cporte_merc_autot_remolques = null;
  }

  verRemolquesTranspConcepto(remolques:any) {
    this.complem_cporte_merc_autot_atidveh = null;
    this.complem_cporte_merc_autot_seguros = null;
    this.complem_cporte_merc_autot_remolques = this.complem_cporte_merc_autot_remolques === remolques ? null : remolques;
  }

  verTranspMarContenedorM(contenedor:any) {
    this.complem_cporte_contenedor_maritimo = this.complem_cporte_contenedor_maritimo === contenedor ? null : contenedor;
  }

  verTranspFerroDerechosDePaso(DerechosDePaso:any) {
    this.complem_cporte_ferro_derechos_de_paso = this.complem_cporte_ferro_derechos_de_paso === DerechosDePaso ? null : DerechosDePaso;
  }
  verTranspFerroCarro(Carro:any) {
    this.complem_cporte_ferro_carro = this.complem_cporte_ferro_carro === Carro ? null : Carro;
  }
  verTranspCarroConten(Contenedor:any,ferroviario:any) {
    ferroviario.ver_contenedor = ferroviario.ver_contenedor === Contenedor ? null : Contenedor;
  }

  comprobarVinculacionArticulos() {
    // 1. Crear diccionarios para búsqueda instantánea
    //const setGral = new Set(this.prodservCatGeneral.map((g: any) => g.concepto?.trim().toLowerCase()));
    //const setProv = new Set(this.productosVincLista.map((p: any) => p.concepto?.trim().toLowerCase()));

    // 2. Actualizar los conceptos existentes
    //this.modeloTrasladoCFDI.dataCFDI_conceptos = this.modeloTrasladoCFDI.dataCFDI_conceptos.map((concepto: any) => {
    //  const desc = concepto.Descripcion?.trim().toLowerCase();
    //  return {
    //    ...concepto,
    //    articulo_homologado_comprobacion: setGral.has(desc) || setProv.has(desc)
    //  };
    //});
  }

  abrirPaginaSAT() {
    const total = parseFloat(this.modeloTrasladoCFDI.dataCFDI_comprobante_Total).toFixed(6);
    const urlSAT = `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspxthis.modeloTrasladoCFDI=${this.modeloTrasladoCFDI.dataCFDI_complemento_UUID}&re=${this.modeloTrasladoCFDI.dataCFDI_emisor_Rfc}&rr=${this.modeloTrasladoCFDI.dataCFDI_receptor_Rfc}&tt=${total}&fe=${this.modeloTrasladoCFDI.dataCFDI_complemento_SelloCFD.slice(-8)}`;
    // Características de la ventana
    const features = 'popup=true,width=1000,height=800,left=200,top=100,resizable=yes,scrollbars=yes';
    // "_blank" garantiza que se abre una ventana/pestaña nueva
    const nuevaVentana = window.open(urlSAT, '_blank', features);
  }

  calcularTotalesGenerales() {
    let subtotal = 0, descuento = 0, retenciones = 0, traslados = 0, total = 0;

    this.modeloTrasladoCFDI.dataCFDI_conceptos.forEach((concept: any) => {
      // Usamos el operador unario (+) o parseFloat para asegurar valores numéricos
      subtotal += +concept.Importe || 0;
      descuento += +concept.Descuento || 0;
      retenciones += +concept.TotalRetenciones || 0;
      traslados += +concept.TotalTraslados || 0;
      total += +concept.Subtotal || 0;
    });

    const formato = '0.' + '0'.repeat(this.modeloTrasladoCFDI.dataCFDI_comprobante_MoneDecimales);

    this.compra_subtotal = numeral(subtotal).format(formato);
    this.compra_descuento = numeral(descuento).format(formato);
    this.compra_retenciones = numeral(retenciones).format(formato);
    this.compra_traslados = numeral(traslados).format(formato);
    this.compra_total = numeral(total).format(formato);
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

  capturaValidacionComprobante(e: any, objeto: any) {
    const capt_cfdi = objeto.files[0];
    const validacion_comp = capt_cfdi.size <= 2000000 && (capt_cfdi.type == 'application/pdf' || capt_cfdi.type == 'image/jpeg' || capt_cfdi.type == 'image/png');
    this.imagenEvidenciaVerificacion = validacion_comp ? capt_cfdi : null;
    validacion_comp ? this.validator.correctoInputRow(objeto) : this.validator.errorInputRow(objeto);
    if (!validacion_comp) {
      let mensajeError = '';
      if (capt_cfdi.size > 2000000) mensajeError = 'El archivo excede el tamaño permitido (2MB)';
      if (capt_cfdi.type != 'application/pdf') mensajeError = 'El archivo Debe ser en formato pdf';
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: mensajeError });
    }
  }

  lista_general_compras(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorComprasGeneral = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;
    
    if (filtro == 'otras_fechas') {
      var buy_otras_fechas = document.getElementById("buy_otras_fechas");
      if (this.rangoPeriodoCompras && this.rangoPeriodoCompras.length === 2) {
        const dateInicio = this.rangoPeriodoCompras[0];
        const dateFin = this.rangoPeriodoCompras[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(buy_otras_fechas);
          } else {
            this.validator.errorInputRow(buy_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(buy_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(buy_otras_fechas);
        return;
      }
    }
 
    this.compraServ.listaGeneralCompras(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.arrayComprasGeneral = response.compras;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayComprasGeneral = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.arrayComprasGeneral = [];
  }

  keyupObservacionCargaCFDI(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.carga_traslado_cfdi_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get habilitaBtnRegistro(): Boolean {
    const valida_fecha_cont = this.carga_traslado_fecha_contabilizacion != "" && this.validator.filtroFecha(this.carga_traslado_fecha_contabilizacion);
    const valida_observ = this.carga_traslado_cfdi_observaciones != "" && this.validator.filtroAlfaNumerico(this.carga_traslado_cfdi_observaciones) && this.carga_traslado_cfdi_observaciones.length >= 4;
    const validacion = valida_fecha_cont && this.imagenEvidenciaXml && this.imagenEvidenciaPdf && this.imagenEvidenciaVerificacion && this.comprasSeleccionadas.length > 0 && valida_observ;
    return validacion;
  }

  onSaveCFDITraslado(form: NgForm): void {
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
        console.log(this.comprasSeleccionadas);
        this.view_form_traslado_cfdi = false;
        this.compraServ.registraCargaCFDITraslado(
          this.carga_traslado_fecha_contabilizacion,
          this.imagenEvidenciaXml,
          this.imagenEvidenciaPdf,
          this.imagenEvidenciaVerificacion,
          this.modeloTrasladoCFDI,
          this.comprasSeleccionadas,
          this.carga_traslado_cfdi_observaciones
        ).subscribe(
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
                this.view_form_traslado_cfdi = true;
                this.relInterna.mensajePagoRealizado("carga_traslado_realizada");
                form.reset();
                form.resetForm();
                this.formCargaCFDITraslado.resetForm();
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
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.destruir$.next();
    this.destruir$.complete();
  }
}
