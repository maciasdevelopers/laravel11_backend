import { Component, OnInit, ElementRef, Renderer2, ViewChild, Input } from '@angular/core';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import numeral from 'numeral';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { CFDIService } from '../../../../../../servicios/xml/cfdi.service';
import { MessageService } from 'primeng/api';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';

@Component({
  selector: 'app-desglose-registro-compra',
  standalone: false,
  templateUrl: './desglose-registro-compra.component.html',
  //styleUrl: './desglose-registro-compra.component.css'
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
    '../../../../../../styles/div_explain.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/totales.css',
    './desglose-registro-compra.component.css',
    '../../../egresos.css'
  ],
})
export class DesgloseRegistroCompraComponent implements OnInit {
  public compra_seleccionada_token: string = "";
  //monedas 
  catalogo_monedas_api:any = [];

  compras_desglose:any = [];
  pageArticulos: number = 1;
  pageArticulosRecibidos: number = 1;
  proveedorSeleccionado:any = [];
  arrayEstablecCompras:any = [];
  searchProductosVincLista:string = '';
  productosVincLista:any = [];
  searchProdServCatGeneral:string = '';
  prodservCatGeneral:any = [];
  expandRowsProductos: { [s: string]: boolean } = {};

  //Factura CFDI (XML)
  public imagenEvidenciaXml: any;
  public resultXml:string = '';
  //correcto
  //cfdi:Comprobante
  dataCFDI_comprobante:any = [];
  public dataCFDI_comprobante_TipoComprobante:string = '';
  public dataCFDI_comprobante_TipoCambio: string = '1.00';
  public dataCFDI_comprobante_Moneda:string = '';
  public dataCFDI_comprobante_MoneDecimales: number = 2;
  public dataCFDI_comprobante_Total:string = '';
  public dataCFDI_comprobante_formaPago:string = '';
  public dataCFDI_comprobante_MetodoPago:string = '';
  //cfdi:Comprobante//cfdi:CfdiRelacionados
  dataCFDIRelacionados:any = [];
  //cfdi:Comprobante//cfdi:Emisor
  public dataCFDI_emisor_Token:string = '';
  public dataCFDI_emisor_Rfc:string = '';
  public dataCFDI_emisor_Rfc_registrado: boolean = false;
  public dataCFDI_emisor_new_registro: boolean = false;
  dataCFDIEmisor:any = [];
  //cfdi:Comprobante//cfdi:Receptor
  public dataCFDI_receptor_Rfc:string = '';
  dataCFDIReceptor:any = [];
  public dataCFDI_receptor_UsoCFDI:string = '';
  //cfdi:Comprobante//cfdi:Conceptos'
  dataBuscarConceptoINTERNO:any = [];
  dataConceptosINTERNO:any = [];
  dataCFDI_conceptos:any = [];
  dataINTERNO_seleccion_concepto:any = [];
  concepto_cfdiSeleccionadoRetenciones: string = "";
  concepto_cfdiSeleccionadoTraslados: string = "";
  public articulo_homologado_view: boolean = false;
  retencionSeleccionada: any;
  trasladoSeleccionado: any;
  public selectvalidatexmlArticulos: boolean = false;

  seccion_concepto_prod_and_serv:string = "";
  seccion_concepto_retenciones:string = "";
  seccion_concepto_traslados:string = "";
  seccion_concepto_series:string = "";
  seccion_concepto_lotes:string = "";
  seccion_concepto_pedimentos:string = "";
  seccion_concepto_activos:string = "";
  seccion_concepto_prorrateos:string = "";

  public compra_subtotal: string = '0.00';
  public compra_descuento: string = '0.00';
  public compra_retenciones: string = '0.00';
  public compra_traslados: string = '0.00';
  public compra_total: string = '0.00';
  //impuestos //cfdi:Comprobante/cfdi:Impuestos
  public dataCFDI_impuestos_retenidos_total:string = '';
  dataCFDI_impuestos_retenidos_lista:any = [];
  public dataCFDI_impuestos_trasladados_total:string = '';
  dataCFDI_impuestos_trasladados_lista:any = [];
  //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
  dataCFDIComplemento:any = [];
  public dataCFDI_complemento_UUID:string = '';
  public dataCFDI_complemento_SelloCFD:string = '';

  //Factura CFDI (PDF)
  public imagenEvidenciaPdf: any;

  //verificacion de comprobante
  public imagenEvidenciaVerificacion: any;

  //proceso de compra
  public compra_contado_credito: string = 'contado';
  public receptFactura: boolean = false;

  //recepcion de articulo antes o despues de pago
  public classRecibeArtPago: boolean = false;

  //lugar de entrega
  public tipoLugarRecepcion:string = '';
  public tknLugarRecepcion:string = '';

  //anticipos
  public aplica_anticipo_a_proveedor:string = "No";
  proveedorAnticipoTotal:number = 0;
  proveedorAnticipoTotalFormat:string = "";
  proveedorAnticipoaplicado:number = 0;
  proveedorAnticipoRestanteFormat:string = "";

  //extras
  public compra_observaciones:string = '';
  public anexosCompraFiles: NgxFileDropEntry[] = [];
  public anexosCompraDocs: any[] = [];
  public anexosCompraNames:any = [];

  //registro de compra
  public cargandoCompras:string = '';
  public compra_proceso_pago: boolean = false;

  constructor(
    public _comprServ: ComprasServService,
    private translate: TranslateService,
    private relInterna: ComunicacionInternaService,
    public validator: ValidatorServService,
    private cfdiServ: CFDIService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private primeAlerts: MessageService) {
  }

  ngOnInit(): void {
    //this.recargaEstablecimientos();
    this.getRespuestaDesgloseCompra();
    this.dataBuscarConceptoINTERNO = ['Descripcion','articulo_homologado_folio','articulo_homologado_nombre','Unidad','ClaveProdServ','ValorUnitario','Cantidad',
      'Descuento','Importe','TotalRetenciones','TotalTraslados','Subtotal'];
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

  getRespuestaDesgloseCompra() {
    this.relInterna.mensajeComprasDesglose$.subscribe(
      (mensaje: any) => {
        if (mensaje == "ver_desglose_compra") {
          this.relInterna.tokenCompraExtraido$.subscribe(
            (tkn_compras: any) => {
              if (mensaje == "ver_desglose_compra") {
                this.compra_seleccionada_token = tkn_compras;
                this.verDesgloseCompletoCompra(tkn_compras);
              }
            }
          );
        }
      }
    );
  }

  verDesgloseCompletoCompra(token_compras: any) {
    if (this.catalogo_monedas_api.length === 0) {
      this.monedasCatalogoApi();
    }

    this.dataConceptosINTERNO = [];
    this.dataCFDI_conceptos = [];
    this._comprServ.verDesgloseCompletoCompra(token_compras).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.compras_desglose = response.compra_info;
          response.compra_info.forEach((row: any) => {
            this.dataCFDI_emisor_Token = row.proveedor_token;
            this.dataCFDI_comprobante = row.dataCFDI_comprobante;
            this.dataCFDIEmisor = row.dataCFDIEmisor;
            this.dataCFDIReceptor = row.dataCFDIReceptor;
            this.dataConceptosINTERNO = row.dataConceptosINTERNO;
            var totales_subtotal = 0;
            var totales_descuento = 0;
            var totales_retenciones = 0;
            var totales_traslados = 0;
            var totales_total = 0;
            this.dataConceptosINTERNO.forEach((int:any) => {
              let limpios_Importe = int.Importe.replace(/[$,]/g, '');
              let limpios_Descuento = int.Descuento.replace(/[$,]/g, '');
              let limpios_TotalRetenciones = int.TotalRetenciones.replace(/[$,]/g, '');
              let limpios_TotalTraslados = int.TotalTraslados.replace(/[$,]/g, '');
              let limpios_Subtotal = int.Subtotal.replace(/[$,]/g, '');

              totales_subtotal += parseFloat(limpios_Importe);
              totales_descuento += parseFloat(limpios_Descuento);
              totales_retenciones += parseFloat(limpios_TotalRetenciones);
              totales_traslados += parseFloat(limpios_TotalTraslados);
              totales_total += parseFloat(limpios_Subtotal);
            });
            this.compra_subtotal = numeral(totales_subtotal).format('2.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
            this.compra_descuento = numeral(totales_descuento).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
            this.compra_retenciones = numeral(totales_retenciones).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
            this.compra_traslados = numeral(totales_traslados).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
            this.compra_total = numeral(totales_total).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
            this.dataCFDI_conceptos = row.dataCFDI_conceptos;
            this.dataCFDI_impuestos_retenidos_lista = row.dataCFDI_impuestos_retenidos_lista;
            this.dataCFDI_impuestos_trasladados_lista = row.dataCFDI_impuestos_trasladados_lista;
            this.dataCFDIComplemento = row.dataCFDIComplemento;
            this.dataCFDIRelacionados = row.dataCFDIRelacionados;
            this.tipoLugarRecepcion = row.tipoLugarRecepcion;
            this.listar_articulos_proveedor(row.proveedor_token);
            this.descargaDataProvComprasList();
            this.listar_anticipos_proveedor();
          });
        }
        if (response.status == 'error') {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: this.translate.instant(response.message),
            showConfirmButton: false,
            timer: 3000
          })
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  listar_articulos_proveedor(token_cat_proveedores: any) {
    this._comprServ.listaProdServComprasProv(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          this.productosVincLista = response.listaArticulos;
          console.log(this.productosVincLista);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  descargaDataProvComprasList() {
    this.proveedorSeleccionado = [];
    this._provServ.verDetalleProveedor(this.dataCFDI_emisor_Token).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.proveedorSeleccionado = response.proveedor;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  listar_anticipos_proveedor() {
    this._provServ.listarAnticiposDisponiblesProveedor(this.dataCFDI_emisor_Token).subscribe(
      response => {
        if (response.status == "success") {
          this.proveedorAnticipoTotal = response.anticipo_total;
          this.proveedorAnticipoTotalFormat = response.anticipo_total_format;
          this.proveedorAnticipoRestanteFormat = response.anticipo_total_format;
        }
      }
    );
  }

  activar_aplica_facturas_recep(token_compras: any) {
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
        this._comprServ.activar_aplica_facturas_recep(token_compras).subscribe(
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
              this.verDesgloseCompletoCompra(token_compras);
              this.relInterna.mensajeComprasRegistro("nuevo_registro");
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

  deshabilitar_aplica_facturas_recep(token_compras: any) {
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
        this._comprServ.deshabilitar_aplica_facturas_recep(token_compras).subscribe(
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
              this.verDesgloseCompletoCompra(token_compras);
              this.relInterna.mensajeComprasRegistro("nuevo_registro");
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

  cargaXmlCompra(e: any, objeto: any): void {
    const doc_xml = objeto.files[0];
    console.log(doc_xml.type);
    const validacion_xml = doc_xml.size <= 2000000 && doc_xml.type == 'text/xml'; 
    this.imagenEvidenciaXml = validacion_xml ? doc_xml : null;
    validacion_xml ? this.lecturaInternaXML(objeto) : this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
  }

  comprobarVinculacionArticulos() {
    this.dataCFDI_conceptos.forEach((row: any) => {
      let prod_gral = this.prodservCatGeneral.find((row_gral: any) => row_gral.concepto.toLowerCase() === row.Descripcion.toLowerCase());
      let prod_prov = this.productosVincLista.find((prvd_row: any) => prvd_row.concepto.toLowerCase() === row.Descripcion.toLowerCase());
      row.articulo_homologado_comprobacion = typeof prod_gral === 'undefined' && typeof prod_prov === 'undefined' ? false : true;
    });
  }

  limpiaXMLData() {
    this.resultXml = '';
    //cfdi:Comprobante
    this.dataCFDI_comprobante = [];
    this.dataCFDI_comprobante_TipoComprobante = '';
    this.dataCFDI_comprobante_formaPago = '';
    this.dataCFDI_comprobante_MetodoPago = '';
    this.dataCFDI_comprobante_Moneda = '';
    this.dataCFDI_comprobante_MoneDecimales = 2;
    this.dataCFDI_comprobante_Total = '';
    //cfdi:Comprobante//cfdi:CfdiRelacionados
    this.dataCFDIRelacionados = [];
    //cfdi:Comprobante//cfdi:Emisor
    this.dataCFDI_emisor_Rfc = '';
    this.dataCFDI_emisor_Rfc_registrado = false;
    this.dataCFDI_emisor_new_registro = false;
    this.dataCFDIEmisor = [];
    //cfdi:Comprobante//cfdi:Receptor
    this.dataCFDIReceptor = [];
    this.dataCFDI_receptor_Rfc = '';
    this.dataCFDI_receptor_UsoCFDI = '';
    //cfdi:Comprobante//cfdi:Conceptos'
    this.dataCFDI_conceptos = [];
    //impuestos //cfdi:Comprobante/cfdi:Impuestos
    this.dataCFDI_impuestos_retenidos_total = '';
    this.dataCFDI_impuestos_retenidos_lista = [];
    this.dataCFDI_impuestos_trasladados_total = '';
    this.dataCFDI_impuestos_trasladados_lista = [];
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    this.dataCFDIComplemento = [];
    this.dataCFDI_complemento_UUID = '';
    this.dataCFDI_complemento_SelloCFD = '';
  }

  llenaCfdiRelacionados(nodo_emisor: any) {
    nodo_emisor.forEach((child: any) => {
      var tipoRelacion = child.getAttribute('TipoRelacion');
      var relacionados_uuid = '';
      const child_relacionados = child.children();
      child_relacionados.forEach((rChild: any) => {
        relacionados_uuid = rChild.getAttribute('CfdiRelacionado');
      });

      this.dataCFDIRelacionados.push(
        { "title": 'Tipo de relación', "content": tipoRelacion ? tipoRelacion : '---' },
        { "title": 'UUID', "content": relacionados_uuid ? relacionados_uuid : '---' },
      );
    });
  }

  obtenEmisor(nodo_emisor: any) {
    nodo_emisor.forEach((child: any) => {
      if (this.resultXml == 'validoXml') {
        this.dataCFDIEmisor.push(
          { "title": 'Rfc del emisor', "content": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---' },
          { "title": 'Nombre del emisor', "content": child.getAttribute('Nombre') ? child.getAttribute('Nombre') : '---' },
          { "title": 'Regimen fiscal del emisor', "content": child.getAttribute('RegimenFiscal') ? child.getAttribute('RegimenFiscal') : '---' },
        );
      } else {
        this.dataCFDI_emisor_Rfc = child.getAttribute('Rfc');
        console.log(this.dataCFDI_emisor_Rfc);
      }
    });
  }

  obtenReceptor(nodo_receptor: any) {
    nodo_receptor.forEach((child: any) => {
      if (this.resultXml == 'validoXml') {
        this.dataCFDIReceptor.push(
          { "title": 'Rfc del receptor', "content": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---' },
          { "title": 'Uso del CFDI', "content": child.getAttribute('UsoCFDI') ? child.getAttribute('UsoCFDI') : '---' },
        );
        this.dataCFDI_receptor_UsoCFDI = child.getAttribute('UsoCFDI');
      } else {
        this.dataCFDI_receptor_Rfc = child.getAttribute('Rfc');
        console.log(this.dataCFDI_receptor_Rfc);
      }
    });
  }

  obtenUUID(nodo_complemento: any) {
    nodo_complemento.forEach((child: any) => {
      const raiz_complemento: any = child.children();
      raiz_complemento.forEach((rChild: any) => {
        if (this.resultXml == 'validoXml') {
          this.dataCFDIComplemento.push(
            { "title": 'UUID', "content": rChild.getAttribute("UUID") ? rChild.getAttribute("UUID") : '---' },
            { "title": 'FechaTimbrado', "content": rChild.getAttribute("FechaTimbrado") ? rChild.getAttribute("FechaTimbrado") : '---' },
            { "title": 'RfcProvCertif', "content": rChild.getAttribute("RfcProvCertif") ? rChild.getAttribute("RfcProvCertif") : '---' },
            { "title": 'NoCertificadoSAT', "content": rChild.getAttribute("NoCertificadoSAT") ? rChild.getAttribute("NoCertificadoSAT") : '---' },
            { "title": 'SelloCFD', "content": rChild.getAttribute("SelloCFD") ? rChild.getAttribute("SelloCFD") : '---' },
            { "title": 'SelloSAT', "content": rChild.getAttribute("SelloSAT") ? rChild.getAttribute("SelloSAT") : '---' },
          );
        } else {
          this.dataCFDI_complemento_UUID = rChild.getAttribute("UUID");
          this.dataCFDI_complemento_SelloCFD = rChild.getAttribute("SelloCFD");
          console.log(this.dataCFDI_complemento_UUID);
        }
      });
    });
  }

  lecturaInternaXML(objeto: any) {
    this.dataCFDI_comprobante = [];
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

          this.dataCFDI_comprobante_Total = xmlNode.getAttribute('Total');

          const childNodes = xmlNode.children();
          const nodo_cfdi_relacionados = childNodes.getNodesByName("cfdi:CfdiRelacionados");
          const nodo_emisor = childNodes.getNodesByName("cfdi:Emisor");
          this.obtenEmisor(nodo_emisor);
          const nodo_receptor = childNodes.getNodesByName("cfdi:Receptor");
          this.obtenReceptor(nodo_receptor);
          const nodo_conceptos = childNodes.getNodesByName("cfdi:Conceptos");
          const nodo_impuestos = childNodes.getNodesByName("cfdi:Impuestos");
          const nodo_complemento = childNodes.getNodesByName("cfdi:Complemento");
          this.obtenUUID(nodo_complemento);
          this.dataCFDI_comprobante_TipoComprobante = xmlNode.getAttribute('TipoDeComprobante');

          if (this.dataCFDI_complemento_UUID && this.dataCFDI_emisor_Rfc && this.dataCFDI_receptor_Rfc && this.dataCFDI_comprobante_Total) {
            const total = parseFloat(this.dataCFDI_comprobante_Total).toFixed(6);

            this.cfdiServ.validaEstadoCFDICompras(this.dataCFDI_complemento_UUID, this.dataCFDI_emisor_Rfc, this.dataCFDI_receptor_Rfc, total).subscribe(
              response => {
                if (response.status == 'success' && response.estado == 'Vigente' && (this.dataCFDI_comprobante_TipoComprobante == "I" || this.dataCFDI_comprobante_TipoComprobante == "E")) {
                  if (!response.encontrado) {
                    this.validator.correctoInputRow(objeto);
                    this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: 'CFDI es correcto.' });
                    this.resultXml = 'validoXml';

                    //this.fcontab_compra_modelo.fecha_contabilizacion = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';
                    //this.compra_fecha_contabilizacion = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';
                    //this.compra_fecha_vencimiento = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';

                    this.dataCFDI_comprobante.push(
                      { "title": 'Versión', "content": xmlNode.getAttribute('Version') ? xmlNode.getAttribute('Version') : '---' },
                      { "title": 'Serie', "content": xmlNode.getAttribute('Serie') ? xmlNode.getAttribute('Serie') : '---' },
                      { "title": 'Folio', "content": xmlNode.getAttribute('Folio') ? xmlNode.getAttribute('Folio') : '---' },
                      { "title": 'Fecha', "content": xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha') : '---' },
                      { "title": 'Forma de pago', "content": xmlNode.getAttribute('FormaPago') ? xmlNode.getAttribute('FormaPago') : '---' },
                      { "title": 'Subtotal', "content": xmlNode.getAttribute('SubTotal') ? xmlNode.getAttribute('SubTotal') : '---' },
                      { "title": 'Moneda', "content": xmlNode.getAttribute('Moneda') ? xmlNode.getAttribute('Moneda') : '---' },
                      { "title": 'Tipo de cambio', "content": xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00' },
                      { "title": 'Total', "content": xmlNode.getAttribute('Total') ? xmlNode.getAttribute('Total') : '---' },
                      { "title": 'Confirmación', "content": xmlNode.getAttribute('confirmacion') ? xmlNode.getAttribute('confirmacion') : '---' },
                      { "title": 'Tipo de comprobante', "content": xmlNode.getAttribute('TipoDeComprobante') ? xmlNode.getAttribute('TipoDeComprobante') : '---' },
                      { "title": 'Método de Pago', "content": xmlNode.getAttribute('MetodoPago') ? xmlNode.getAttribute('MetodoPago') : '---' },
                      { "title": 'Lugar de Expedición', "content": xmlNode.getAttribute('LugarExpedicion') ? xmlNode.getAttribute('LugarExpedicion') : '---' },
                      { "title": 'No de certificado', "content": xmlNode.getAttribute('NoCertificado') ? xmlNode.getAttribute('NoCertificado') : '---' },
                      { "title": 'Sello', "content": xmlNode.getAttribute('Sello') ? xmlNode.getAttribute('Sello') : '---' },
                      { "title": 'Certificado', "content": xmlNode.getAttribute('Certificado') ? xmlNode.getAttribute('Certificado') : '---' },
                    );

                    this.llenaCfdiRelacionados(nodo_cfdi_relacionados);
                    this.obtenEmisor(nodo_emisor);
                    this.obtenReceptor(nodo_receptor);

                    this.dataCFDI_comprobante_formaPago = xmlNode.getAttribute('FormaPago');
                    this.dataCFDI_comprobante_MetodoPago = xmlNode.getAttribute('MetodoPago');
                    this.dataCFDI_comprobante_TipoCambio = xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00';
                    this.dataCFDI_comprobante_Moneda = xmlNode.getAttribute('Moneda');
                    const moneda_CFDI = this.catalogo_monedas_api.find((row: any) => row.code === this.dataCFDI_comprobante_Moneda);
                    this.dataCFDI_comprobante_MoneDecimales = moneda_CFDI.decimales;
                    console.log("dataCFDI_comprobante_MoneDecimales " + this.dataCFDI_comprobante_MoneDecimales);
                    console.log(this.dataCFDI_comprobante);

                    var cfdi_num_lista = 1;
                    nodo_conceptos.forEach(child => {
                      const raiz_conceptos: any = child.children();
                      console.log(raiz_conceptos);
                      var list_conceptos:any = [];
                      raiz_conceptos.forEach((cChild: any) => {
                        console.log(cChild.getAttribute("Cantidad"));
                        var list_impuestos:any = [];
                        var list_retenciones:any = [];
                        var total_retenciones: number = 0;
                        var ret_id: number = 1;
                        var list_traslados:any = [];
                        var total_traslados: number = 0;
                        var tras_id: number = 1;
                        const nodo_impuestos: any = cChild.children();
                        nodo_impuestos.forEach((iChild: any) => {
                          const interior_nodo = iChild.children();
                          interior_nodo.forEach((iChild: any) => {
                            console.log(iChild.name());
                            let iNodo_name = iChild.name();

                            if (iNodo_name == "cfdi:Retenciones") {
                              const nodo_retencion: any = iChild.children();
                              nodo_retencion.forEach((rtChild: any) => {
                                list_retenciones.push({
                                  "id": ret_id,
                                  "Base": rtChild.getAttribute("Base"),
                                  "Impuesto": rtChild.getAttribute("Impuesto"),
                                  "TipoFactor": rtChild.getAttribute("TipoFactor"),
                                  "TasaOCuota": rtChild.getAttribute("TasaOCuota"),
                                  "Importe": rtChild.getAttribute("Importe"),
                                  "impuesto_relacionado": "",
                                  "impuesto_relacion_nombre": "",
                                });
                                console.log(rtChild.getAttribute("Base"));
                                ++ret_id;
                              });
                            }

                            if (iNodo_name == "cfdi:Traslados") {
                              const nodo_traslado: any = iChild.children();
                              nodo_traslado.forEach((rtChild: any) => {
                                list_traslados.push({
                                  "id": tras_id,
                                  "Base": rtChild.getAttribute("Base"),
                                  "Impuesto": rtChild.getAttribute("Impuesto"),
                                  "TipoFactor": rtChild.getAttribute("TipoFactor"),
                                  "TasaOCuota": rtChild.getAttribute("TasaOCuota"),
                                  "Importe": rtChild.getAttribute("Importe"),
                                  "impuesto_relacionado": "",
                                  "impuesto_relacion_nombre": "",
                                });
                                console.log(rtChild.getAttribute("Base"));
                                ++tras_id;
                              });
                            }

                            list_impuestos.push({
                              "retenciones": list_retenciones,
                              "traslados": list_traslados,
                            });
                          });
                        });

                        var cantidadPartida = cChild.getAttribute("Cantidad") ? cChild.getAttribute("Cantidad") : 0;
                        var valorUnitarioPartida = cChild.getAttribute("ValorUnitario") ? cChild.getAttribute("ValorUnitario").toString() : 0;
                        var descuentoPartida = cChild.getAttribute("Descuento") ? cChild.getAttribute("Descuento").toString() : 0;
                        console.log(cChild.getAttribute("Importe"));
                        console.log(descuentoPartida);
                        console.log(total_traslados.toString());
                        console.log(total_retenciones.toString());

                        list_retenciones.forEach((ret: any) => {
                          if (ret.TipoFactor == "Exento") {
                            total_retenciones += 0;
                          } else {
                            total_retenciones += parseFloat(ret.Importe);
                          }
                          console.log(total_retenciones);
                        });

                        list_traslados.forEach((tras: any) => {
                          if (tras.TipoFactor == "Exento") {
                            total_traslados += 0;
                          } else {
                            total_traslados += parseFloat(tras.Importe);
                          }
                          console.log(total_traslados);
                        });
                        console.log(descuentoPartida);
                        const cfdiSubtotal = parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida) + parseFloat(total_traslados.toString()) - parseFloat(total_retenciones.toString());
                        const expandRowsRetenciones: { [s: string]: boolean } = {};
                        const expandRowsTraslados: { [s: string]: boolean } = {};
                        list_conceptos.push({
                          "cfdi_num_lista": cfdi_num_lista,
                          "NoIdentificacion": cChild.getAttribute("NoIdentificacion") ? cChild.getAttribute("NoIdentificacion") : "",
                          "ObjetoImp": cChild.getAttribute("ObjetoImp"),
                          "ClaveProdServ": cChild.getAttribute("ClaveProdServ"),
                          "Cantidad": cantidadPartida,
                          "ClaveUnidad": cChild.getAttribute("ClaveUnidad"),
                          "Unidad": cChild.getAttribute("Unidad"),
                          "Descripcion": cChild.getAttribute("Descripcion"),
                          "ValorUnitario":"$"+numeral(valorUnitarioPartida).format('0,0.'+'0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
                          "Descuento":"$"+numeral(descuentoPartida).format('0,0.'+'0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
                          "Importe":"$"+numeral(parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida)).format('0,0.'+'0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
                          //impuestos
                          "Impuestos": list_impuestos,
                          //retenciones
                          "TotalRetenciones":"$"+numeral(total_retenciones).format('0,0.'+'0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
                          "articulo_retenciones_modal": false,
                          "cfdi_retenciones": list_retenciones,
                          "expandedRowsRetenciones": expandRowsRetenciones,
                          "retenciones_llenadas": false,
                          //traslados
                          "TotalTraslados":"$"+numeral(total_traslados).format('0,0.'+'0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
                          "articulo_traslados_modal": false,
                          "cfdi_traslados": list_traslados,
                          "expandedRowsTraslados": expandRowsTraslados,
                          "traslados_llenados": false,
                          "Subtotal":"$"+numeral(cfdiSubtotal).format('0,0.'+'0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
                          //desglose
                          "bloqueado_for_desglose" : false,
                        });
                        ++cfdi_num_lista;
                      });
                      this.dataCFDI_conceptos = list_conceptos;
                      
                      this.dataConceptosINTERNO.forEach((row:any) => {
                        row.conceptoCFDI_listas = this.dataCFDI_conceptos;
                      });
                    });

                    var totales_subtotal = 0;
                    var totales_descuento = 0;
                    var totales_retenciones = 0;
                    var totales_traslados = 0;
                    var totales_total = 0;
                    this.dataCFDI_conceptos.forEach((concept: any) => {
                      totales_subtotal += parseFloat(concept.Importe);
                      totales_descuento += parseFloat(concept.Descuento);
                      totales_retenciones += parseFloat(concept.TotalRetenciones);
                      totales_traslados += parseFloat(concept.TotalTraslados);
                      totales_total += parseFloat(concept.Subtotal);
                    });
                    this.compra_subtotal = numeral(totales_subtotal).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
                    this.compra_descuento = numeral(totales_descuento).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
                    this.compra_retenciones = numeral(totales_retenciones).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
                    this.compra_traslados = numeral(totales_traslados).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
                    this.compra_total = numeral(totales_total).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));

                    nodo_impuestos.forEach(child => {
                      const raiz_impuestos: any = child.children();
                      console.log(raiz_impuestos);

                      this.dataCFDI_impuestos_retenidos_total = child.getAttribute('TotalImpuestosRetenidos');
                      this.dataCFDI_impuestos_retenidos_lista = [];
                      raiz_impuestos.forEach((rChild: any) => {
                        let iNodo_name = rChild.name();
                        if (iNodo_name == "cfdi:Retenciones") {
                          const nodo_retencion: any = rChild.children();
                          nodo_retencion.forEach((rtChild: any) => {
                            this.dataCFDI_impuestos_retenidos_lista.push({
                              "Base": rtChild.getAttribute("Base"),
                              "Impuesto": rtChild.getAttribute("Impuesto"),
                              "TipoFactor": rtChild.getAttribute("TipoFactor"),
                              "TasaOCuota": rtChild.getAttribute("TasaOCuota"),
                              "Importe": rtChild.getAttribute("Importe"),
                            });
                            console.log(rtChild.getAttribute("Base"));
                          });
                        }
                      });

                      this.dataCFDI_impuestos_trasladados_total = child.getAttribute('TotalImpuestosTrasladados');
                      this.dataCFDI_impuestos_trasladados_lista = [];
                      raiz_impuestos.forEach((rChild: any) => {
                        let iNodo_name = rChild.name();
                        if (iNodo_name == "cfdi:Traslados") {
                          const nodo_retencion: any = rChild.children();
                          nodo_retencion.forEach((rtChild: any) => {
                            this.dataCFDI_impuestos_trasladados_lista.push({
                              "Base": rtChild.getAttribute("Base"),
                              "Impuesto": rtChild.getAttribute("Impuesto"),
                              "TipoFactor": rtChild.getAttribute("TipoFactor"),
                              "TasaOCuota": rtChild.getAttribute("TasaOCuota"),
                              "Importe": rtChild.getAttribute("Importe"),
                            });
                            console.log(rtChild.getAttribute("Base"));
                          });
                        }
                      });
                    });

                    this.obtenUUID(nodo_complemento);
                    this.comprobarVinculacionArticulos();
                    this.abrirPaginaSAT();
                  } else {
                    this.validator.errorInputRow(objeto);
                    this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El documento CFDI ya se encuentra vinculado a otros procesos de compras' });
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
            this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos para validar el CFDI en el SAT.' });
          }
        } else {
          this.resultXml = 'errorXml';
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
          this.validator.errorInputRow(objeto);
        }
      };
      reader.readAsText(this.imagenEvidenciaXml);
    } else {
      this.validator.errorInputRow(objeto);
    }
  }

  //Factura CFDI (PDF)
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

  deletePdfCompra(): void {
    this.imagenEvidenciaPdf = null;
  }

  //Verificación de comprobantes fiscales por internet
  abrirPaginaSAT() {
    const total = parseFloat(this.dataCFDI_comprobante_Total).toFixed(6);
    const urlSAT = `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${this.dataCFDI_complemento_UUID}&re=${this.dataCFDI_emisor_Rfc}&rr=${this.dataCFDI_receptor_Rfc}&tt=${total}&fe=${this.dataCFDI_complemento_SelloCFD.slice(-8)}`;
    // Características de la ventana
    const features = 'popup=true,width=1000,height=800,left=200,top=100,resizable=yes,scrollbars=yes';
    // "_blank" garantiza que se abre una ventana/pestaña nueva
    const nuevaVentana = window.open(urlSAT, '_blank', features);
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

  limpiaSecciones() {
    this.seccion_concepto_prod_and_serv = "";
    this.seccion_concepto_retenciones = "";
    this.seccion_concepto_traslados = "";
    this.seccion_concepto_series = "";
    this.seccion_concepto_lotes = "";
    this.seccion_concepto_pedimentos = "";
    this.seccion_concepto_activos = "";
    this.seccion_concepto_prorrateos = "";
  }

  verConceptoListaProductosYServicios(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_prod_and_serv = this.seccion_concepto_prod_and_serv === row ? null : row;
  }

  seleccionaCFDIConceptForProdYServ(num_lista:any,cfdi_num_lista:any,event:any) {
    const inside = this.dataConceptosINTERNO.find((row:any) => row.num_lista === num_lista);
    const cfd_conceptos = inside.conceptoCFDI_listas.find((row:any) => row.cfdi_num_lista === cfdi_num_lista);

    if (typeof inside !== 'undefined' && typeof cfd_conceptos !== 'undefined') {
      inside.Descripcion = event.checked ? cfd_conceptos.Descripcion : '';
      inside.conceptoCFDI_referido = event.checked ? cfd_conceptos : [];
      inside.conceptoCFDI_listas.forEach((cfd:any) => {
        cfd.bloqueado_for_desglose = cfd.cfdi_num_lista === cfdi_num_lista ? true : false;
        
        inside.Unidad_class = event.checked ? (inside.Unidad == cfd.Unidad ? "correcto" : "error") : "";
        //"Descripcion" => isset($vDet->concepto_cfdi) && !is_null($vDet->concepto_cfdi) ? $JwtAuth->desencriptar($vDet->concepto_cfdi) : "",
        inside.ClaveProdServ_class = event.checked ? (inside.ClaveProdServ == cfd.ClaveProdServ ? "correcto" : "error") : "";
        inside.ValorUnitario_class = event.checked ? (inside.ValorUnitario == cfd.ValorUnitario ? "correcto" : "error") : "";
        inside.Cantidad_class = event.checked ? (inside.Cantidad == cfd.Cantidad ? "correcto" : "error") : "";
        inside.Descuento_class = event.checked ? (inside.Descuento == cfd.Descuento ? "correcto" : "error") : "";
        inside.Importe_class = event.checked ? (inside.Importe == cfd.Importe ? "correcto" : "error") : "";
        inside.Retenciones_class = event.checked ? (inside.TotalRetenciones == cfd.TotalRetenciones ? "correcto" : "error") : "";
        inside.Traslados_class = event.checked ? (inside.TotalTraslados == cfd.TotalTraslados ? "correcto" : "error") : "";
        inside.Subtotal_class = event.checked ? (inside.Subtotal == cfd.Subtotal ? "correcto" : "error") : "";
      });
    }
  }

  verCFDIRetenciones(row: any) {
    //this.limpiaSecciones();
    this.concepto_cfdiSeleccionadoRetenciones = this.concepto_cfdiSeleccionadoRetenciones === row ? null : row;
  }

  verCFDITraslados(row: any) {
    //this.limpiaSecciones();
    this.concepto_cfdiSeleccionadoTraslados = this.concepto_cfdiSeleccionadoTraslados === row ? null : row;
  }

  verConceptoListaRetenciones(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_retenciones = this.seccion_concepto_retenciones === row ? null : row;
  }

  verConceptoListaTraslados(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_traslados = this.seccion_concepto_traslados === row ? null : row;
  }

  verConceptoListaProductosSeries(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_series = this.seccion_concepto_series === row ? null : row;
  }

  verConceptoListaProductosLote(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_lotes = this.seccion_concepto_lotes === row ? null : row;
  }

  verConceptoListaProductosPedimentoAduanal(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_pedimentos = this.seccion_concepto_pedimentos === row ? null : row;
  }

  verConceptoListaUSOArt(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_activos = this.seccion_concepto_activos === row ? null : row;
  }

  verConceptoListaProrrateos(row: any) {
    //this.limpiaSecciones();
    this.seccion_concepto_prorrateos = this.seccion_concepto_prorrateos === row ? null : row;
  }

  tipoDireccionEntregas(event: any) {
    switch (event.value) {
      case 'proveedor':
        this.tipoLugarRecepcion = 'proveedor';
        break;
      case 'establecimiento':
        this.tipoLugarRecepcion = 'establecimiento';
        break;
      case 'noAplica':
        this.tipoLugarRecepcion = 'noAplica';
        break;
      default:
        this.tipoLugarRecepcion = '';
        break;
    }
  }

  selectDireccionEnt(event: any) {
    this.tknLugarRecepcion = event.value != '' ? event.value : '';
  }

  //anticipo
  aplicaAnticipoAProveedor(event: any) {
    switch (event.value) {
      case 'buy_aplicar_anticipo_a_proveedor':
        this.aplica_anticipo_a_proveedor = "Sí";
        break;
      case 'not_aplicar_anticipo_a_proveedor':
        this.aplica_anticipo_a_proveedor = "No";
        this.proveedorAnticipoaplicado = 0;
        this.proveedorAnticipoRestanteFormat = this.proveedorAnticipoTotalFormat;
        break;
    }
  }

  redacta_anticipo_aplicado(event: any): void {
    const validacion = event.value != "" && this.validator.filtroNum(event.value); 
    this.proveedorAnticipoaplicado = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.calcula_anticipo_restante() : null;
  }

  calcula_anticipo_restante(){
    this.proveedorAnticipoRestanteFormat = "$"+numeral(this.proveedorAnticipoTotal - this.proveedorAnticipoaplicado).format('0,0.'+'0'.repeat(this.dataCFDI_comprobante_MoneDecimales))+" "+this.dataCFDI_comprobante_Moneda;
  }

  selectAnticipo(token_anticipo: any) {
    //this.anticipoToken = token_anticipo != "" ? token_anticipo : "";
    token_anticipo == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el concepto.' }) : null;
  }

  getListasLlenadasCFDI() {
    const inside_scfdi = this.dataConceptosINTERNO.filter((row:any) => row.Descripcion !== "");
    //console.log(inside_scfdi);
    return inside_scfdi.length == this.dataConceptosINTERNO.length ? true : false; 
  }

  registraFacturasCompraCFDI(){
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
        //public compra_seleccionada_token: string = "";
        //public imagenEvidenciaXml: any;
        //public resultXml:string = '';
        //public dataCFDI_comprobante_TipoComprobante:string = '';
        //public dataCFDI_comprobante_TipoCambio: string = '1.00';
        //public dataCFDI_comprobante_Moneda:string = '';
        //public dataCFDI_comprobante_MoneDecimales: number = 2;
        //public dataCFDI_comprobante_Total:string = '';
        //public dataCFDI_comprobante_formaPago:string = '';
        //public dataCFDI_comprobante_MetodoPago:string = '';
        //dataCFDIRelacionados:any = [];
        //dataCFDIEmisor:any = [];
        //dataCFDIReceptor:any = [];
        //public dataCFDI_receptor_UsoCFDI:string = '';
        //dataConceptosINTERNO:any = [];
        //dataCFDI_conceptos:any = [];
        //concepto_cfdiSeleccionadoRetenciones: string = "";
        //concepto_cfdiSeleccionadoTraslados: string = "";
        //public articulo_homologado_view: boolean = false;
        //retencionSeleccionada: any;
        //trasladoSeleccionado: any;
        //public selectvalidatexmlArticulos: boolean = false;
        //dataCFDI_impuestos_retenidos_lista:any = [];
        //dataCFDI_impuestos_trasladados_lista:any = [];
        //public imagenEvidenciaPdf: any;
        //public imagenEvidenciaVerificacion: any;
        //public compra_contado_credito: string = 'contado';
        //public receptFactura: boolean = false;
        //public classRecibeArtPago: boolean = false;
        //public tipoLugarRecepcion:string = '';
        //public tknLugarRecepcion:string = '';
        //public compra_observaciones:string = '';
        //public anexosCompraFiles: NgxFileDropEntry[] = [];
        //public anexosCompraDocs: any[] = [];
        //public anexosCompraNames:any = [];}

        this._comprServ.seccion_compras_complementa_informacion(
          this.compra_seleccionada_token,
          //this.compra_fecha_contabilizacion,
          this.dataCFDI_comprobante,
          this.dataCFDIEmisor,
          this.dataCFDIReceptor,
          this.dataConceptosINTERNO,
          this.dataCFDI_impuestos_retenidos_lista,
          this.dataCFDI_impuestos_trasladados_lista,
          this.dataCFDIComplemento,
          this.dataCFDIRelacionados,
          //this.compra_total,
          //this.compra_contado_credito,
          //this.compra_fecha_vencimiento,
          //this.classRecibeArtPago,
          //this.receptFactura,
          //this.provToken,
          //this.anticipoToken,
          //this.tipoLugarRecepcion,
          //this.tknLugarRecepcion,
          this.imagenEvidenciaXml,
          this.imagenEvidenciaPdf,
          this.imagenEvidenciaVerificacion,
          //this.compra_observaciones,
          //this.anexosCompraDocs
        ).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.cargandoCompras = '';
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.verDesgloseCompletoCompra(this.compra_seleccionada_token);
              this.relInterna.mensajeComprasRegistro("nuevo_registro");
            }
            if (response.status == 'error') {
              this.cargandoCompras = 'fail';
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
}
