import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ReembolsosService } from '../../../../../servicios/employees_reembolsos.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { InterfPagoForma } from "../../../../../interfaces/interf-pago-forma";
import { InterfMetodoPago } from '../../../../../interfaces/interf-metodo-pago';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
//const messaging = getMessaging();
import numeral from 'numeral';
import { Popover } from 'primeng/popover';
import { DomSanitizer } from '@angular/platform-browser';
import xmlFormat from 'xml-formatter';
import { reemNewFaseDosCFDIModelo } from '../../../../../modelos/reembolsos/reemNewFaseDosCFDIModelo';
import { MessageService } from 'primeng/api';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { SessionContextService } from '../../../../../servicios/session-context';
declare var zxcvbn: any;
@Component({
  selector: 'terc_reem_listas',
  templateUrl: './terc_reem_lista.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/datatable.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/colores.css',
    //'../../../terceros.component.css',
    '../../egresos.css',
    './terc_reem_lista.component.css'
  ]
})
export class TercReemListasComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  public newFaseDOS: reemNewFaseDosCFDIModelo;

  optionTool = {
    "placement": "top",
    //"showDelay":"500"
  };

  //lista
  searchReemTrue: any = [];
  listReembolsosTrue: any = [];
  searchReemDeleted: any = [];
  listReembolsosDeleted: any = [];
  pageReem: number = 1;

  //detalle
  public folio_reembolso: string = "";
  public reem_viewModal: boolean = false;
  public reem_pagos_viewModal: boolean = false;
  public reem_carga_docs_viewModal: boolean = false;
  arrayReembolsosDetalle: any = [];
  reembolsoDetallePartidas: any = [];
  public html_view_evd: any;
  public name_view_evd: string = "";
  public html_type_evd: string = "";
  public distrib_pagos_uno: string = "col-12";
  public distrib_pagos_dos: string = "col-12";
  searchReemSoli: any = [];
  public load_docs_token_reem: string = "";
  public load_docs_token_solicitud_reem: string = "";
  public load_docs_num_lista: string = "";
  selectedXML: any;
  @ViewChild('popMenuXML') popMenuXML!: Popover;
  selectedPDF: any;
  @ViewChild('popMenuPDF') popMenuPDF!: Popover;
  selectedAnexos: any;
  @ViewChild('popMenuAnexos') popMenuAnexos!: Popover;
  searchPagosRealizados: any;

  //nuevo registro
  public enabled_class_paso_dos: string = "col-12 disabledView";
  public enabled_class_paso_tres: string = "col-12 disabledView";

  searchComiListReem: any;
  pageComiListReem: number = 1;
  public rcomi_view: boolean = false;
  arrayComisionesLista: any = [];
  public tiempo_respuesta_reem_comi: number = 0;
  arrayComisionesSelected: any = [];
  arraYFormaPago: InterfPagoForma[] = [];
  arraYMetodoPago: InterfMetodoPago[] = [];
  public min_date: string;
  public max_date: string;
  public filesReem: NgxFileDropEntry[] = [];

  public imagenEvidenciaXml: any;
  public imagenEvidenciaPdf: any;

  public docsReemAnexos: any[] = [];
  public reemAnexosNames: any = [];
  public reem_validate_to_save: boolean;

  public reem_comision_saldo_format: string = numeral("0.00").format('$0,0.00');
  public total_reem: string = numeral("0.00").format('$0,0.00');
  public total_reem_resultante: string = numeral("0.00").format('$0,0.00');
  public reem_fecha: string;
  public reem_folio_ticket: string;
  public reem_pagado_a: string;
  public reem_tkn_proveedor: string;
  public reem_forma_pago: string;
  public reem_importe_total: string;
  public reem_moneda_entrante_tkn: string;
  public reem_moneda_entrante_nombre: string;
  public reem_moneda_entrante_decimales: string;
  public reem_tipo_cambio_format: string = numeral("1").format('$0,0.00');
  public reem_tipo_cambio_string: string = "1.00";
  public reem_moneda_saliente_tkn: string;
  public reem_moneda_saliente_nombre: string;
  public reem_moneda_saliente_decimales: string;
  public reem_importe_resultante: string = numeral("0.00").format('$0,0.00');
  public reem_observacion: string = "";
  arrayreembolsosSave: any = [];
  reem_list_proveedores: any = [];

  constructor(
    private sentinela: SentinelArkManager,
    private reem_serv: ReembolsosService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private sessionContext: SessionContextService,
    private primeAlerts: MessageService,
    private cfdiServ: CFDIService,
    private sanitizer: DomSanitizer
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");

    this.min_date = "";
    this.max_date = "";
    this.reem_validate_to_save = false;
    this.reem_fecha = "";
    this.reem_folio_ticket = "";
    this.reem_pagado_a = "";
    this.reem_tkn_proveedor = "";
    this.reem_forma_pago = "";
    this.reem_importe_total = "";
    this.reem_moneda_entrante_tkn = "bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4";
    this.reem_moneda_entrante_nombre = "MXN - Peso mexicano";
    this.reem_moneda_entrante_decimales = "2";
    this.reem_moneda_saliente_tkn = "bmVUblp5dHpIVkZXWXhKVVJCekJIZz09OjoxMjM0NTY3ODEyMzQ1Njc4";
    this.reem_moneda_saliente_nombre = "MXN - Peso mexicano";
    this.reem_moneda_saliente_decimales = "2";

    this.newFaseDOS = new reemNewFaseDosCFDIModelo(
      '',//resultXml
      [],//dataCFDI_comprobante
      '',//dataCFDI_comprobante_TipoComprobante
      '1.00',//dataCFDI_comprobante_TipoCambio
      '',//dataCFDI_comprobante_Moneda
      2,//dataCFDI_comprobante_MoneDecimales
      '',//dataCFDI_comprobante_Total
      '',//dataCFDI_comprobante_formaPago
      '',//dataCFDI_comprobante_MetodoPago
      [],//dataCFDIRelacionados
      '',//dataCFDI_emisor_Rfc
      '',//dataCFDI_emisor_Token
      false,//dataCFDI_emisor_Rfc_registrado
      false,//dataCFDI_emisor_new_registro
      [],//dataCFDIEmisor
      '',//dataCFDI_receptor_Rfc
      [],//dataCFDIReceptor
      '',//dataCFDI_receptor_UsoCFDI
      [],//dataCFDI_conceptos
      '',//dataCFDIBuscarConcepto
      '',//dataCFDIBuscarRetenciones
      '',//retencionSeleccionada
      '',//dataCFDIBuscarTraslados
      '',//trasladoSeleccionado
      false,//selectvalidatexmlArticulos
      '0.00',//compra_subtotal
      '0.00',//compra_descuento
      '0.00',//compra_retenciones
      '0.00',//compra_traslados
      '0.00',//compra_total
      0,//dataCFDI_impuestos_retenidos_total
      [],//dataCFDI_impuestos_retenidos_lista
      0,//dataCFDI_impuestos_trasladados_total
      [],//dataCFDI_impuestos_trasladados_lista
      [],//dataCFDIComplemento
      '',//dataCFDI_complemento_UUID
      ''//dataCFDI_complemento_SelloCFD
    );
  }

  ngOnInit(): void {
    this.reembolsosLista_one();
    this.searchReemTrue = ['progress', 'token_reem', 'total_anexos', 'eliminacion_disponbible', 'folio_reem', 'date_solicitud', 'nombreEmiPers', 'name_emisor', 'importe_total',
      'moneda_entrante', 'total_tipo_cambio', 'total_reem_saliente', 'moneda_entrante', 'reem_soli_auth_vhm_style', 'nombreRecPersVH', 'soli_reem_auth_vhm', 'soli_reem_list',
      'name_receptor', 'btnp_horas_auth_vh_color', 'btnp_horas_auth_vh_icon', 'fecha_respuesta_auth_vh', 'time_respuesta_auth_vh', 'reem_soli_auth_egr_style', 'nombreRecPersEGR',
      'soli_reem_auth_egr', 'btnp_horas_auth_egr_color', 'btnp_horas_auth_egr_icon', 'fecha_respuesta_auth_egr', 'time_respuesta_auth_egr', 'fecha_respuesta_pago_ord_auth',
      'fecha_respuesta_pago_tentativa', 'time_respuesta_pago_tentativa', 'respuesta_pago_done_fecha', 'time_respuesta_pago_tent_color', 'time_respuesta_pago_tent_icon',
      'respuesta_pago_done_color', 'respuesta_pago_done_icon'];

    this.searchReemDeleted = ['reem_canceled', 'progress', 'token_reem', 'total_anexos', 'folio_reem', 'date_solicitud', 'nombreEmiPers', 'name_emisor', 'importe_total', 'moneda_entrante',
      'total_tipo_cambio', 'total_reem_saliente', 'moneda_saliente', 'nombreRecPersVH', 'reem_soli_auth_vhm_style', 'soli_reem_auth_vhm', 'soli_reem_list', 'name_receptor',
      'nombreRecPersEGR', 'reem_soli_auth_egr_style', 'soli_reem_auth_egr', 'soli_reem_list', 'fecha_respuesta_autorizacion_vhegr', 'time_respuesta_autorizacion_vhegr',
      'fecha_respuesta_pago_ord_auth', 'fecha_respuesta_pago_tentativa', 'time_respuesta_pago_tentativa', 'respuesta_pago_done_fecha', 'fecha_delete'];

    this.searchReemSoli = ['folio_solicitud', 'fecha_solicitud', 'fecha_gasto', 'ticket_gasto', 'pagado_a', 'rfc_prov', 'proveedor', 'fpago_clave', 'fpago_forma', 'importe_requerido_info',
      'moneda_origen_codigo', 'tipo_cambio_format', 'reem_importe_resultante', 'moneda_origen_codigo', 'observaciones', 'autorizacion_vh', 'fecha_registro_auth_vh', 'hora_registro_auth_vh',
      'comments_auth_vh', 'comments_auth_egr', 'autorizacion_egr', 'fecha_registro_auth_egr', 'hora_registro_auth_egr', 'token_reem', 'token_solicitud_reem', 'num_lista'];
  }

  get permiso_consulta() {
    return this.sessionContext.privilegio_consulta;
  }

  cambioDeSeccion(tabIndex: string | number){
    const index_tabla = tabIndex.toString();
    switch (index_tabla) {
      case '1': if (this.listReembolsosTrue.length === 0) this.reembolsosLista_one(); break;
      case '2': if (this.listReembolsosDeleted.length === 0) this.reembolsosLista_two(); break;
      default:
        break;
    }
  }

  //lista
  reembolsosLista_one() {
    this.reem_serv.list_reembolsos_true().subscribe(
      response => {
        if (response.status == 'success') {
          this.listReembolsosTrue = response.list_reem;
          console.log(this.listReembolsosTrue);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  reembolsosLista_two() {
    this.reem_serv.list_reembolsos_two().subscribe(
      response => {
        if (response.status == 'success') {
          this.listReembolsosDeleted = response.list_reem;
          console.log(this.listReembolsosDeleted);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deshabilitarReembolso(token_reem: any) {
    console.log(token_reem);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.reem_serv.reembolso_deshabilitar(token_reem).subscribe(
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
              this.reembolsosLista_one();
              this.reembolsosLista_two();
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
        )
      }
    });
  }

  rehabilitarReembolso(token_reem: any) {
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
        this.reem_serv.reembolso_rehabilitar(token_reem).subscribe(
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
              this.reembolsosLista_one();
              this.reembolsosLista_two();
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
        )
      }
    });
  }

  //detalle 
  recarga_seccion_pagos() {
    this.reem_pagos_viewModal = true
    this.html_view_evd = null;
    this.name_view_evd = "";
    this.html_type_evd = "";
    this.distrib_pagos_uno = "col-12";
    this.distrib_pagos_dos = "col-12";
  }

  ver_desglose_reembolso(tokenReembolso: any) {
    this.reem_serv.reembolso_detalle(tokenReembolso).subscribe(
      response => {
        if (response.status == 'success') {
          this.reem_viewModal = true;
          this.arrayReembolsosDetalle = response.reem_det;

          this.arrayReembolsosDetalle.forEach((main: any) => {
            this.folio_reembolso = main.folio_reem;
            this.reembolsoDetallePartidas = main.soliReem;
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectDataCargarDocs(token_reem: any, token_solicitud_reem: any, num_lista: any) {
    const partida = this.reembolsoDetallePartidas.find((part: any) => part.token_solicitud_reem === token_solicitud_reem);
    partida.carga_docs_modal = true;

    this.reem_carga_docs_viewModal = true;
    this.load_docs_token_reem = token_reem;
    this.load_docs_token_solicitud_reem = token_solicitud_reem;
    this.load_docs_num_lista = num_lista;
  }

  displayXML(event: any, rSoli: any) {
    if (this.selectedXML?.token_solicitud_reem === rSoli.token_solicitud_reem) {
      this.popMenuXML.hide();
      this.selectedXML = null;
    } else {
      this.selectedXML = rSoli;
      this.popMenuXML.show(event);
      if (this.popMenuXML.container) {
        this.popMenuXML.align();
      }
    }
  }

  displayPDF(event: any, rSoli: any) {
    if (this.selectedPDF?.token_solicitud_reem === rSoli.token_solicitud_reem) {
      this.popMenuPDF.hide();
      this.selectedPDF = null;
    } else {
      this.selectedPDF = rSoli;
      this.popMenuPDF.show(event);
      if (this.popMenuPDF.container) {
        this.popMenuPDF.align();
      }
    }
  }

  displayAnexos(event: any, rSoli: any) {
    if (this.selectedAnexos?.token_solicitud_reem === rSoli.token_solicitud_reem) {
      this.popMenuAnexos.hide();
      this.selectedAnexos = null;
    } else {
      this.selectedAnexos = rSoli;
      this.popMenuAnexos.show(event);
      if (this.popMenuAnexos.container) {
        this.popMenuAnexos.align();
      }
    }
  }

  viewDocumentoLink(url: any) {
    window.open(url, '_blank');
  }

  select_evidencias_pago(name_documento: any, extension: any, html_doc: any) {
    console.log(extension);
    this.name_view_evd = name_documento;
    this.html_type_evd = extension;
    if (extension == "pdf") {
      this.html_view_evd = this.sanitizer.bypassSecurityTrustHtml(html_doc);
    } else if (extension == "xml") {
      this.html_view_evd = xmlFormat(html_doc);
    }
    this.distrib_pagos_uno = "col-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 col-xxl-2";
    this.distrib_pagos_dos = "col-12 col-sm-6 col-md-3 col-lg-2 col-xl-2 col-xxl-2";
  }

  cargaXmlReem(e: any, objeto: any, tkn_prov: any, rfc_prov: any, moneda: any, moneda_decimales: any): void {
    const doc_xml = objeto.files[0];
    console.log(doc_xml.name);
    const validacion_xml = doc_xml.size <= 2000000 && doc_xml.type == 'text/xml';
    this.imagenEvidenciaXml = validacion_xml ? doc_xml : null;
    validacion_xml ? this.lecturaInternaXML(objeto, tkn_prov, rfc_prov, moneda, moneda_decimales) : this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
  }

  limpiaXMLData() {
    this.newFaseDOS.resultXml = '';
    //cfdi:Comprobante
    this.newFaseDOS.dataCFDI_comprobante = [];
    this.newFaseDOS.dataCFDI_comprobante_TipoComprobante = '';
    this.newFaseDOS.dataCFDI_comprobante_formaPago = '';
    this.newFaseDOS.dataCFDI_comprobante_MetodoPago = '';
    this.newFaseDOS.dataCFDI_comprobante_Moneda = '';
    this.newFaseDOS.dataCFDI_comprobante_MoneDecimales = 2;
    this.newFaseDOS.dataCFDI_comprobante_Total = '';
    //cfdi:Comprobante//cfdi:CfdiRelacionados
    this.newFaseDOS.dataCFDIRelacionados = [];
    //cfdi:Comprobante//cfdi:Emisor
    this.newFaseDOS.dataCFDI_emisor_Rfc = '';
    this.newFaseDOS.dataCFDI_emisor_Token = '';
    this.newFaseDOS.dataCFDI_emisor_Rfc_registrado = false;
    this.newFaseDOS.dataCFDI_emisor_new_registro = false;
    this.newFaseDOS.dataCFDIEmisor = [];
    //cfdi:Comprobante//cfdi:Receptor
    this.newFaseDOS.dataCFDIReceptor = [];
    this.newFaseDOS.dataCFDI_receptor_Rfc = '';
    this.newFaseDOS.dataCFDI_receptor_UsoCFDI = '';
    //cfdi:Comprobante//cfdi:Conceptos'
    this.newFaseDOS.dataCFDI_conceptos = [];
    //impuestos //cfdi:Comprobante/cfdi:Impuestos
    this.newFaseDOS.dataCFDI_impuestos_retenidos_total = 0;
    this.newFaseDOS.dataCFDI_impuestos_retenidos_lista = [];
    this.newFaseDOS.dataCFDI_impuestos_trasladados_total = 0;
    this.newFaseDOS.dataCFDI_impuestos_trasladados_lista = [];
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    this.newFaseDOS.dataCFDIComplemento = [];
    this.newFaseDOS.dataCFDI_complemento_UUID = '';
    this.newFaseDOS.dataCFDI_complemento_SelloCFD = '';
  }

  revisa_emisor_proveedor_registrado(objeto: any, tkn_prov: any, rfc_prov: any) {
    console.log(rfc_prov);
    let validaprv = rfc_prov.toUpperCase() === this.newFaseDOS.dataCFDI_emisor_Rfc;
    this.newFaseDOS.dataCFDI_emisor_Rfc_registrado = validaprv ? true : false;
    this.newFaseDOS.dataCFDI_emisor_Token = tkn_prov;

    if (!validaprv) {
      this.validator.errorInputRow(objeto);
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Error de vinculación de proveedor con Emisor de CFDI.' });
    }
  }

  obtenEmisor(nodo_emisor: any, objeto: any, tkn_prov: any, rfc_prov: any) {
    nodo_emisor.forEach((child: any) => {
      this.newFaseDOS.dataCFDIEmisor.push(
        { "title": 'Rfc del emisor', "content": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---' },
        { "title": 'Nombre del emisor', "content": child.getAttribute('Nombre') ? child.getAttribute('Nombre') : '---' },
        { "title": 'Regimen fiscal del emisor', "content": child.getAttribute('RegimenFiscal') ? child.getAttribute('RegimenFiscal') : '---' },
      );
      this.revisa_emisor_proveedor_registrado(objeto, tkn_prov, rfc_prov);
    });
  }

  obtenReceptor(nodo_receptor: any) {
    nodo_receptor.forEach((child: any) => {
      this.newFaseDOS.dataCFDIReceptor.push(
        { "title": 'Rfc del receptor', "content": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---' },
        { "title": 'Uso del CFDI', "content": child.getAttribute('UsoCFDI') ? child.getAttribute('UsoCFDI') : '---' },
      );
      this.newFaseDOS.dataCFDI_receptor_UsoCFDI = child.getAttribute('UsoCFDI');
    });
  }

  obtenUUID(nodo_complemento: any) {
    nodo_complemento.forEach((child: any) => {
      const raiz_complemento: any = child.children();
      raiz_complemento.forEach((rChild: any) => {
        this.newFaseDOS.dataCFDIComplemento.push(
          { "title": 'UUID', "content": rChild.getAttribute("UUID") ? rChild.getAttribute("UUID") : '---' },
          { "title": 'FechaTimbrado', "content": rChild.getAttribute("FechaTimbrado") ? rChild.getAttribute("FechaTimbrado") : '---' },
          { "title": 'RfcProvCertif', "content": rChild.getAttribute("RfcProvCertif") ? rChild.getAttribute("RfcProvCertif") : '---' },
          { "title": 'NoCertificadoSAT', "content": rChild.getAttribute("NoCertificadoSAT") ? rChild.getAttribute("NoCertificadoSAT") : '---' },
          { "title": 'SelloCFD', "content": rChild.getAttribute("SelloCFD") ? rChild.getAttribute("SelloCFD") : '---' },
          { "title": 'SelloSAT', "content": rChild.getAttribute("SelloSAT") ? rChild.getAttribute("SelloSAT") : '---' },
        );
      });
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

      this.newFaseDOS.dataCFDIRelacionados.push(
        { "title": 'Tipo de relación', "content": tipoRelacion ? tipoRelacion : '---' },
        { "title": 'UUID', "content": relacionados_uuid ? relacionados_uuid : '---' },
      );
    });
  }

  lecturaInternaXML(objeto: any, tkn_prov: any, rfc_prov: any, moneda: any, moneda_decimales: any) {
    this.newFaseDOS.dataCFDI_comprobante = [];
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

          this.newFaseDOS.dataCFDI_comprobante_Total = xmlNode.getAttribute('Total');

          const childNodes = xmlNode.children();
          const nodo_cfdi_relacionados = childNodes.getNodesByName("cfdi:CfdiRelacionados");
          const nodo_emisor = childNodes.getNodesByName("cfdi:Emisor");
          this.newFaseDOS.dataCFDI_emisor_Rfc = this.cfdiServ.obtenRFCEmisor(childNodes.getNodesByName("cfdi:Emisor")).toString();

          const nodo_receptor = childNodes.getNodesByName("cfdi:Receptor");
          this.newFaseDOS.dataCFDI_receptor_Rfc = this.cfdiServ.obtenReceptor(childNodes.getNodesByName("cfdi:Receptor")).toString();
          const nodo_conceptos = childNodes.getNodesByName("cfdi:Conceptos");
          const nodo_impuestos = childNodes.getNodesByName("cfdi:Impuestos");
          const nodo_complemento = childNodes.getNodesByName("cfdi:Complemento");
          this.newFaseDOS.dataCFDI_complemento_UUID = this.cfdiServ.obtenComplementoUUIDCompras(childNodes.getNodesByName("cfdi:Complemento")).toString();
          this.newFaseDOS.dataCFDI_complemento_SelloCFD = this.cfdiServ.obtenComplementoSelloCFDCompras(childNodes.getNodesByName("cfdi:Complemento")).toString();
          this.newFaseDOS.dataCFDI_comprobante_TipoComprobante = xmlNode.getAttribute('TipoDeComprobante');

          let rfc_emp_user_receptor = this.sessionContext.empresa_data?.rfc_emp;
          let company_emp_user_receptor = this.sessionContext.empresa_data?.company_name_large;

          const valida_cion_emisor_rfc = rfc_emp_user_receptor.toLowerCase() === this.newFaseDOS.dataCFDI_receptor_Rfc.toLowerCase();

          if (valida_cion_emisor_rfc) {
            if (this.newFaseDOS.dataCFDI_complemento_UUID && this.newFaseDOS.dataCFDI_emisor_Rfc && this.newFaseDOS.dataCFDI_receptor_Rfc && this.newFaseDOS.dataCFDI_comprobante_Total) {
              const total = parseFloat(this.newFaseDOS.dataCFDI_comprobante_Total).toFixed(6);

              this.cfdiServ.validaEstadoCFDIReembolsos(this.newFaseDOS.dataCFDI_complemento_UUID, this.newFaseDOS.dataCFDI_emisor_Rfc, this.newFaseDOS.dataCFDI_receptor_Rfc, total).subscribe(
                response => {
                  if (response.status == 'success' && response.estado == 'Vigente' && (this.newFaseDOS.dataCFDI_comprobante_TipoComprobante == "I" || this.newFaseDOS.dataCFDI_comprobante_TipoComprobante == "E")) {
                    if (!response.encontrado) {
                      this.validator.correctoInputRow(objeto);
                      this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: 'CFDI es correcto.' });
                      this.newFaseDOS.resultXml = 'validoXml';

                      this.newFaseDOS.dataCFDI_comprobante.push(
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
                      this.obtenEmisor(nodo_emisor, objeto, tkn_prov, rfc_prov);
                      this.obtenReceptor(nodo_receptor);

                      this.newFaseDOS.dataCFDI_comprobante_formaPago = xmlNode.getAttribute('FormaPago');
                      this.newFaseDOS.dataCFDI_comprobante_MetodoPago = xmlNode.getAttribute('MetodoPago');
                      this.newFaseDOS.dataCFDI_comprobante_TipoCambio = xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00';
                      this.newFaseDOS.dataCFDI_comprobante_Moneda = xmlNode.getAttribute('Moneda');
                      const validaMoneda = moneda === this.newFaseDOS.dataCFDI_comprobante_Moneda;
                      this.newFaseDOS.dataCFDI_comprobante_MoneDecimales = validaMoneda ? moneda_decimales : '';
                      console.log("dataCFDI_comprobante_MoneDecimales " + this.newFaseDOS.dataCFDI_comprobante_MoneDecimales);
                      console.log(this.newFaseDOS.dataCFDI_comprobante);

                      var num_lista = 1;
                      nodo_conceptos.forEach(child => {
                        const raiz_conceptos: any = child.children();
                        console.log(raiz_conceptos);
                        var list_conceptos: any = [];
                        raiz_conceptos.forEach((cChild: any) => {
                          console.log(cChild.getAttribute("Cantidad"));
                          var list_impuestos: any = [];
                          var list_retenciones: any = [];
                          var total_retenciones: number = 0;
                          var ret_id: number = 1;
                          var list_traslados: any = [];
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
                            "num_lista": num_lista,
                            "NoIdentificacion": cChild.getAttribute("NoIdentificacion") ? cChild.getAttribute("NoIdentificacion") : "",
                            "ObjetoImp": cChild.getAttribute("ObjetoImp"),
                            "ClaveProdServ": cChild.getAttribute("ClaveProdServ"),
                            "Cantidad": cantidadPartida,
                            "ClaveUnidad": cChild.getAttribute("ClaveUnidad"),
                            "Unidad": cChild.getAttribute("Unidad"),
                            "Descripcion": cChild.getAttribute("Descripcion"),
                            "ValorUnitario": valorUnitarioPartida,
                            "Descuento": numeral(descuentoPartida).format('0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales)),
                            "Importe": numeral(parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida)).format('0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales)),
                            "TotalRetenciones": numeral(total_retenciones).format('0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales)),
                            "TotalTraslados": numeral(total_traslados).format('0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales)),
                            "Subtotal": numeral(cfdiSubtotal).format('0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales)),
                            //impuestos
                            "Impuestos": list_impuestos,
                            //retenciones
                            "articulo_retenciones_modal": false,
                            "retenciones": list_retenciones,
                            "expandedRowsRetenciones": expandRowsRetenciones,
                            "retenciones_llenadas": false,
                            //traslados
                            "articulo_traslados_modal": false,
                            "traslados": list_traslados,
                            "expandedRowsTraslados": expandRowsTraslados,
                            "traslados_llenados": false,
                            //iva
                            "articulo_homologado_iva": "",
                            //Articulo para guardar
                            "articulo_guardar_tkn": "",
                            "articulo_guardar_identificador": "",
                            //Articulo a homologar generales
                            "articulo_homologado_comprobacion": true,
                            "articulo_homologado_ventana_registro": false,
                            "articulo_homologado_registro_tipo": false,
                            "articulo_homologado_token": "",
                            "articulo_homologado_view": false,
                            "articulo_homologado_nombre": "",
                            "articulo_homologado_logotipo": "",
                            "articulo_homologado_clasificacion": "",
                            "articulo_homologado_identificador": "",
                            //Articulo a homologar series
                            "articulo_homologado_serie_bool": false,
                            "articulo_homologado_serie_view": false,
                            "articulo_homologado_serie_token": "",
                            "articulo_homologado_serie_numero": "",
                            //Articulo a homologar lotes
                            "articulo_homologado_lote_bool": false,
                            "articulo_homologado_lote_view": false,
                            "articulo_homologado_lote_token": "",
                            "articulo_homologado_lote_numero": "",
                            //Articulo a homologar pedimentos
                            "articulo_homologado_pedimento_bool": false,
                            "articulo_homologado_pedimento_view": false,
                            "articulo_homologado_pedimento_token": "",
                            "articulo_homologado_pedimento_numero": "",
                            //Articulo a homologar uso
                            "articulo_homologado_view_uso": false,
                            "articulo_homologado_uso": "",
                            "articulo_homologado_efecto_fiscal": "",
                            //Articulo a homologar uso
                            "articulo_homologado_view_activos": false,
                            "articulo_homologado_activoFijo": "",
                            "articulo_homologado_activoDiferido": "",
                            //prorrateos
                            "articulo_homologado_prorratea": false,
                            //gastos relacionados
                            "articulo_homologado_gastos_rel": [],
                            //periodicidad
                            "articulo_homologado_periodicidad_view": false,
                            "articulo_homologado_periodicidadPc": "",
                            "articulo_homologado_iteracionPc": "",
                            "articulo_homologado_periodoDetIndPc": "",
                            "articulo_homologado_fechaFinPc": "",
                            //variabilidad de importe
                            "articulo_homologado_tipoImporteVi": "",
                            "articulo_homologado_monedaVi": "",
                            "articulo_homologado_monedaDecimalesVi": "",
                            "articulo_homologado_importeMinVi": "",
                            "articulo_homologado_importeMaxVi": "",
                            "articulo_homologado_periodicidad_reg": false,
                            //desglose
                            "activa_desglose": false,
                          });
                          ++num_lista;
                        });
                        this.newFaseDOS.dataCFDI_conceptos = list_conceptos;
                      });

                      var totales_subtotal = 0;
                      var totales_descuento = 0;
                      var totales_retenciones = 0;
                      var totales_traslados = 0;
                      var totales_total = 0;

                      this.newFaseDOS.dataCFDI_conceptos.forEach((concept: any) => {
                        totales_subtotal += parseFloat(concept.Importe);
                        totales_descuento += parseFloat(concept.Descuento);
                        totales_retenciones += parseFloat(concept.TotalRetenciones);
                        totales_traslados += parseFloat(concept.TotalTraslados);
                        totales_total += parseFloat(concept.Subtotal);
                      });

                      this.newFaseDOS.compra_subtotal = numeral(totales_subtotal).format('0,0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales));
                      this.newFaseDOS.compra_descuento = numeral(totales_descuento).format('0,0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales));
                      this.newFaseDOS.compra_retenciones = numeral(totales_retenciones).format('0,0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales));
                      this.newFaseDOS.compra_traslados = numeral(totales_traslados).format('0,0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales));
                      this.newFaseDOS.compra_total = numeral(totales_total).format('0,0.' + '0'.repeat(this.newFaseDOS.dataCFDI_comprobante_MoneDecimales));

                      nodo_impuestos.forEach(child => {
                        const raiz_impuestos: any = child.children();
                        console.log(raiz_impuestos);

                        this.newFaseDOS.dataCFDI_impuestos_retenidos_total = child.hasAttribute("TotalImpuestosRetenidos") ? parseFloat(child.getAttribute('TotalImpuestosRetenidos')) : 0;
                        this.newFaseDOS.dataCFDI_impuestos_retenidos_lista = [];
                        raiz_impuestos.forEach((rChild: any) => {
                          let iNodo_name = rChild.name();
                          if (iNodo_name == "cfdi:Retenciones") {
                            const nodo_retencion: any = rChild.children();
                            nodo_retencion.forEach((rtChild: any) => {
                              this.newFaseDOS.dataCFDI_impuestos_retenidos_lista.push({
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

                        this.newFaseDOS.dataCFDI_impuestos_trasladados_total = child.hasAttribute("TotalImpuestosTrasladados") ? parseFloat(child.getAttribute('TotalImpuestosTrasladados')) : 0;
                        this.newFaseDOS.dataCFDI_impuestos_trasladados_lista = [];
                        raiz_impuestos.forEach((rChild: any) => {
                          let iNodo_name = rChild.name();
                          if (iNodo_name == "cfdi:Traslados") {
                            const nodo_retencion: any = rChild.children();
                            nodo_retencion.forEach((rtChild: any) => {
                              this.newFaseDOS.dataCFDI_impuestos_trasladados_lista.push({
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
                      //this.comprobarVinculacionArticulos();
                      //this.abrirPaginaSAT();
                    } else {
                      this.validator.errorInputRow(objeto);
                      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El documento CFDI ya se encuentra vinculado a otros procesos de reembolso' });
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
              this.newFaseDOS.resultXml = 'errorXml';
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos para validar el CFDI en el SAT.' });
              this.validator.errorInputRow(objeto);
            }
          } else {
            this.newFaseDOS.resultXml = 'errorXml';
            this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'El rfc del receptor no coincide con el rfc de ' + company_emp_user_receptor + '.' });
            this.validator.errorInputRow(objeto);
          }
        } else {
          this.newFaseDOS.resultXml = 'errorXml';
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
          this.validator.errorInputRow(objeto);
        }
      };
      reader.readAsText(this.imagenEvidenciaXml);
    } else {
      this.validator.errorInputRow(objeto);
    }
  }

  get habilitarCargaCFDI(): boolean {
    const fdos = this.newFaseDOS;
    return this.imagenEvidenciaXml && fdos.resultXml === 'validoXml' && fdos.dataCFDI_comprobante.length > 0 && fdos.dataCFDIEmisor.length > 0 && fdos.dataCFDIEmisor.length > 0 && fdos.dataCFDI_conceptos.length > 0;
  }

  loadXMLReembolsoSolicitud(reembolso: any, partida: any) {
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
        this.reem_serv.reembolsos_load_xml_fact(reembolso, partida, this.imagenEvidenciaXml, this.newFaseDOS).subscribe(
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
              this.reembolsosLista_one();
              this.ver_desglose_reembolso(reembolso);
              this.filesReem = [];
              this.docsReemAnexos = [];
              this.reemAnexosNames = [];
              this.load_docs_token_reem = "";
              this.load_docs_token_solicitud_reem = "";
              this.load_docs_num_lista = "";
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
        )
      }
    })
  }

  cargaPdfReem(objeto: any): void {
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

  loadPDFReembolsoSolicitud(reembolso: any, partida: any) {
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
        this.reem_serv.reembolsos_load_pdf_fact(reembolso, partida, this.imagenEvidenciaPdf).subscribe(
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
              this.reembolsosLista_one();
              this.ver_desglose_reembolso(reembolso);
              this.filesReem = [];
              this.docsReemAnexos = [];
              this.reemAnexosNames = [];
              this.load_docs_token_reem = "";
              this.load_docs_token_solicitud_reem = "";
              this.load_docs_num_lista = "";
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
        )
      }
    })
  }

  public droppedReem(files: NgxFileDropEntry[], posicion: any) {
    this.filesReem = files;
    this.docsReemAnexos = [];
    this.reemAnexosNames = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsReemAnexos.push(file,droppedFile.relativePath);
          var nameFile = file.name;
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(file.type) == true) {
            this.reemAnexosNames.push({ "typoElement": this.validator.devuelveTipoArchivo(file.type), "nameFile": nameFile });
            this.docsReemAnexos.push(file);
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (this.validator.filtroTipoArchivo(file.type) == false) {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.filesReem.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log("docsReemAnexos.length " + this.docsReemAnexos.length);
  }

  public fileOverReem(event: any, posicion: any) {
    console.log(event);
  }

  public fileLeaveReem(event: any, posicion: any) {
    console.log(event);
  }

  deleteAnexosReem(posicion: any) {
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
          this.docsReemAnexos.splice(posicion, 1);
          this.filesReem.splice(posicion, 1);
          console.log(this.docsReemAnexos.length);
        }
      }
    );
  }

  loadAnexosReembolsoSolicitud(reembolso: any, partida: any) {
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
        if (this.docsReemAnexos.length > 0) {
          this.reem_serv.reembolsos_load_anexos_docs(this.docsReemAnexos, this.reemAnexosNames, reembolso, partida).subscribe(
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
                //setTimeout(function(e:any){e.reembolsosLista();},3000);
                this.ver_desglose_reembolso(reembolso);
                this.filesReem = [];
                this.docsReemAnexos = [];
                this.reemAnexosNames = [];
                this.load_docs_token_reem = "";
                this.load_docs_token_solicitud_reem = "";
                this.load_docs_num_lista = "";
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
          )
        }
      }
    })
  }

  //nuevo registro
  cerrarModal(modal: any) {
    $(modal).removeClass("open");
  }
}
