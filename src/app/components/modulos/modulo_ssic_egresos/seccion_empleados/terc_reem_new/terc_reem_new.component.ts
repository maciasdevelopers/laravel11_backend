import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ReembolsosService } from '../../../../../servicios/employees_reembolsos.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { FormaPagoService } from '../../../../../servicios/ssic/forma-pago.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
//const messaging = getMessaging();
import { SsicComisionesService } from '../../../../../servicios/ssic/ssic-comisiones.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import numeral from 'numeral';
import { MessageService } from 'primeng/api';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';
import { reemNewFaseUnoModelo } from '../../../../../modelos/reembolsos/reemNewFaseUnoModelo';
import { reemNewFaseDosModelo } from '../../../../../modelos/reembolsos/reemNewFaseDosModelo';
import { SessionContextService } from '../../../../../servicios/session-context';
declare var zxcvbn: any;
@Component({
  selector: 'terc_reembolso_new_solicitud',
  templateUrl: './terc_reem_new.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/totales.css',
    '../../../../../styles/explain.css',
    //'../../../terceros.component.css',
    '../../egresos.css',
    './terc_reem_new.component.css'
  ]
})
export class TercReemRegistrarComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  public newFaseUNO: reemNewFaseUnoModelo;
  public newFaseDOS: reemNewFaseDosModelo;

  //nuevo registro
  reem_opcion_pagado_a = null;
  reem_opcion_prov = null;
  reem_opcion_fpago = null;
  reem_opcion_moneda = null;
  public usuario_habilita_reembolsos: boolean = false;
  catalogo_monedas_api: any = [];
  catalogoFormaPagoApi: any = [];
  public min_date: string = "";
  public max_date: string = "";
  list_pagado_a: any = [];
  list_proveedores_general: any = [];
  comisionSeleccionada: string = "";
  public reem_comision_saldo_format: string = numeral("0.00").format('$0,0.00');
  arrayComisionesLista: any = [];
  acree_dor_user: any = [];

  //reembolsos
  public ver_proveedores_modal: boolean = false;
  public imagenEvidenciaXml: any;
  public imagenEvidenciaPdf: any;
  public imagenAnexosReem: File[] = [];

  arrayreembolsosSave: any = [];
  public total_reem: string = numeral("0.00").format('$0,0.00');
  public total_reem_resultante: string = numeral("0.00").format('$0,0.00');

  constructor(
    private sentinela: SentinelArkManager,
    private reem_serv: ReembolsosService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private _fpago: FormaPagoService,
    private comi_serv: SsicComisionesService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private primeAlerts: MessageService,
    private sessionContext: SessionContextService,
    private cfdiServ: CFDIService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.newFaseUNO = new reemNewFaseUnoModelo('', '', [], 0, '', false, null, false, null);
    this.newFaseDOS = new reemNewFaseDosModelo(
      '',//reem_fecha
      '',//reem_folio_ticket
      '',//reem_pagado_a
      '',//reem_tkn_proveedor
      '',//reem_forma_pago
      '',//reem_importe_total
      '',//reem_moneda_nombre
      '',//reem_moneda_decimales
      '1.00',//reem_tipo_cambio_string
      numeral("0.00").format('$0,0.00'),//reem_importe_resultante
      '',//reem_observacion
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
      '',//dataCFDI_complemento_SelloCFD
      '',
      ''
    );
    this.suma_total_reem();
  }

  ngOnInit(): void {
    this.usuario_habilita_reembolsos = this.identidad.habilita_reembolsos;
    this.get_mes();
    this.define_acreedor_first();
    this.translate.get(['provs', 'gen_pub']).subscribe(translations => {
      this.list_pagado_a = [
        { key: '0', label: translations['provs'], opcion: 'prov' },
        { key: '1', label: translations['gen_pub'], opcion: 'pubgeneral' }
      ];
    });
  }

  get permiso_crear() {
    return this.sessionContext.privilegio_crear;
  }

  monedas_lista() {
    if (this.catalogo_monedas_api.length === 0) {      
      this._monedasServ.getApiMonedasCatalogo().subscribe(
        response => {
          if (response.status == 'success') {
            this.catalogo_monedas_api = response.monedas;
            console.log(this.catalogo_monedas_api);
          }
        }
      )
    }
  }

  formadepagoCatalogoApi() {
    if (this.catalogoFormaPagoApi.length === 0) {
      this._fpago.getApiFormaPago().subscribe(
        response => {
          if (response.status == 'success') {
            console.log(response.forma_pago);
            this.catalogoFormaPagoApi = response.forma_pago;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  get_mes() {
    let f_actual = new Date();
    var año = f_actual.getFullYear();
    var simple_mes = f_actual.getMonth() + 1;
    var mes = "" + simple_mes;
    if (simple_mes < 10) {
      mes = "0" + simple_mes;
    }
    //let primer_dia = new Date(f_actual.getFullYear(), f_actual.getMonth(),1).getDate();
    let ultimo_dia = new Date(f_actual.getFullYear(), f_actual.getMonth() + 1, 0).getDate();
    //this.min_date = año+"-"+mes+"-0"+primer_dia;
    this.max_date = año + "-" + mes + "-" + ultimo_dia;
    console.log(this.min_date + " " + this.max_date);
  }

  lista_proveedores() {
    if (this.list_proveedores_general.length === 0) {
      this._provServ.catalogo_prov_autorizados().subscribe(
        response => {
          if (response.status == 'success') {
            response.listado.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
            this.list_proveedores_general = response.listado;
            console.log(this.list_proveedores_general);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  //fase uno
  define_acreedor_first() {
    const acreeedor = this.sessionContext.empresa_data?.acreedor;
    this.acree_dor_user = acreeedor;
    console.log(this.acree_dor_user);
    if (acreeedor.length == 1) {
      acreeedor.forEach((arc: any) => {
        this.newFaseUNO.usuario_acreedor_token = arc.token_cat_acreedores;
        console.log(this.newFaseUNO.usuario_acreedor_token);
        this.newFaseUNO.usuario_acreedor_titular = arc.acr_titular;
      });
      console.log("comisionesLista");
      this.comisionesLista();
    }
  }

  select_acreedor_for_registro(opcion: any) {
    var reem_acreedor_data = document.getElementById("reem_acreedor_data");
    const acreeedor = this.sessionContext.empresa_data?.acreedor;
    let acr_l = acreeedor.find((row: any) => opcion.token_cat_acreedores != '' && row.token_cat_acreedores === opcion.token_cat_acreedores);
    const validacion = opcion.opcion != "" && this.validator.strFilter(opcion.acr_titular) && typeof acr_l !== 'undefined';
    this.newFaseUNO.usuario_acreedor_token = validacion ? acr_l.token_cat_acreedores : "";
    this.newFaseUNO.usuario_acreedor_titular = validacion ? acr_l.acr_titular : "";
    validacion ? this.validator.correctoSelectBrowser(reem_acreedor_data) : this.validator.errorSelectBrowser(reem_acreedor_data);
    console.log(this.newFaseUNO.usuario_acreedor_titular + " " + this.newFaseUNO.usuario_acreedor_token);
    if (validacion) {
      this.comisionesLista();
    }
  }

  comisionesLista() {
    this.comi_serv.list_reem_salidas_comision(this.newFaseUNO.usuario_acreedor_token).subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayComisionesLista = response.comisiones_lista;
          console.log(this.arrayComisionesLista);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectComision() {
    this.newFaseUNO.comisionesSelected.forEach((comi: any) => {
      if (this.newFaseUNO.tiempo_respuesta_reem_comi == 0 || (this.newFaseUNO.tiempo_respuesta_reem_comi > 0 && comi.comi_tiempo_respuesta > this.newFaseUNO.tiempo_respuesta_reem_comi)) {
        this.newFaseUNO.tiempo_respuesta_reem_comi = comi.comi_tiempo_respuesta;
      }
    });
  }

  totalComision() {
    const total_comi_saldo = this.newFaseUNO.comisionesSelected.length > 0 ? this.newFaseUNO.comisionesSelected.reduce((acc: any, row: any) => {
      if (row["dinero_recibido_simple"] != null) {
        console.log(row["dinero_recibido_simple"]);
        return acc + parseFloat(row["dinero_recibido_simple"]);
      }
      return acc;
    }, 0) : 0;

    this.reem_comision_saldo_format = numeral(total_comi_saldo).format('$0,0.00');
    if (this.arrayreembolsosSave.length > 0) {
      this.suma_total_reem();
    }
  }

  get validaFaseUNO(): Boolean {
    const valida_acreedor_token = this.newFaseUNO.usuario_acreedor_token != "";
    const valida_comisiones = this.newFaseUNO.comisionesSelected.length > 0;

    return valida_acreedor_token && valida_comisiones;
  }

  onSaveReembolsoFaseUNO() {
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
        this.reem_serv.save_reembolsos_fase_uno(this.newFaseUNO).subscribe(
          response => {
            console.log(response);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.newFaseUNO.token_reembolso_main = response.token_reembolso_main;
              this.newFaseUNO.valor_humano_valua = response.valor_humano_valua;
              this.newFaseUNO.valor_humano_aplica = response.valor_humano_aplica;
              this.newFaseUNO.egresos_valua = response.egresos_valua;
              this.newFaseUNO.egresos_aplica = response.egresos_aplica;
              this.monedas_lista();
              this.formadepagoCatalogoApi();
              this.lista_proveedores();
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
          error => { console.log(error); }
        )
      }
    })
  }

  //fase dos
  get sinComisiones(): boolean {
    return this.newFaseUNO.comisionesSelected.length === 0;
  }

  keyupFechaGastoReem(event: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.newFaseDOS.reem_fecha = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTicketReem(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value);
    this.newFaseDOS.reem_folio_ticket = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPagado_aReem(opcion: any) {
    var reem_pay_to = document.getElementById("reem_pay_to");
    let pgda = this.list_pagado_a.find((row: any) => opcion.opcion != '' && row.opcion === opcion.opcion);
    const validacion = opcion.opcion != "" && this.validator.strFilter(opcion.opcion) && typeof pgda !== 'undefined';
    this.newFaseDOS.reem_pagado_a = validacion ? pgda.opcion : "";
    validacion ? this.validator.correctoSelectBrowser(reem_pay_to) : this.validator.errorSelectBrowser(reem_pay_to);
  }

  keyupTknProveedorReem(opcion: any) {
    var proveedor_selected_reem = document.getElementById("proveedor_selected_reem");
    let prv = this.list_proveedores_general.find((row: any) => opcion.token_cat_proveedores != '' && row.token_cat_proveedores === opcion.token_cat_proveedores);
    this.newFaseDOS.reem_tkn_proveedor = typeof prv !== 'undefined' ? prv.token_cat_proveedores : '';
    typeof prv !== 'undefined' ? this.validator.correctoSelectBrowser(proveedor_selected_reem) : this.validator.errorSelectBrowser(proveedor_selected_reem);
  }

  ver_catalogo_de_proveedores() {
    this.ver_proveedores_modal = true;
  }

  keyupTknFPagoReem(opcion: any) {
    var reem_f_pago = document.getElementById("reem_f_pago");
    const forma_pago_validate = this.catalogoFormaPagoApi.find((row: any) => opcion.descripcion != '' && row.descripcion === opcion.descripcion);
    const validacion = opcion.descripcion != "" && this.validator.filtroAlfaNumerico(opcion.descripcion) == true && typeof forma_pago_validate !== 'undefined';
    this.newFaseDOS.reem_forma_pago = validacion ? forma_pago_validate.clave : '';
    validacion ? this.validator.correctoSelectBrowser(reem_f_pago) : this.validator.errorSelectBrowser(reem_f_pago);
  }

  keyupTotalReemSave(event: any) {
    const validacion = event.value != "" && this.validator.filtroCosto(event.value);
    this.newFaseDOS.reem_importe_total = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.extraeImporteTC();
  }

  keyupValidateMonedaEntrante(opcion: any) {
    console.log(opcion._filtro_busqueda);
    var reem_moneda_entrante = document.getElementById("reem_moneda_entrante");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.newFaseDOS.reem_moneda_nombre = typeof mnd !== 'undefined' ? mnd.code : '';
    this.newFaseDOS.reem_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    typeof mnd !== 'undefined' ? this.validator.correctoSelectBrowser(reem_moneda_entrante) : this.validator.errorSelectBrowser(reem_moneda_entrante);
    typeof mnd !== 'undefined' ? this.extraeImporteTC() : null;
    this.newFaseDOS.reem_tipo_cambio_string = typeof mnd !== 'undefined' && mnd.code == "MXN" ? "1.00" : "0.00";
  }

  editTipoCambio(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.newFaseDOS.reem_tipo_cambio_string = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.extraeImporteTC();
  }

  cargaXmlCompra(e: any, objeto: any): void {
    const doc_xml = objeto.files[0];
    console.log(doc_xml.name);
    const validacion_xml = doc_xml.size <= 2000000 && doc_xml.type == 'text/xml';
    this.imagenEvidenciaXml = validacion_xml ? doc_xml : null;
    this.newFaseDOS.factura_xml_name = validacion_xml ? doc_xml.name : null;
    validacion_xml ? this.lecturaInternaXML(objeto) : this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'CFDI es inválido.' });
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

  revisa_emisor_proveedor_registrado(objeto: any) {
    let data_prov = this.list_proveedores_general.find((row: any) => row.token_cat_proveedores === this.newFaseDOS.reem_tkn_proveedor && row.rfc_prov.toUpperCase() === this.newFaseDOS.dataCFDI_emisor_Rfc);
    this.newFaseDOS.dataCFDI_emisor_Rfc_registrado = typeof data_prov !== 'undefined' ? true : false;
    this.newFaseDOS.dataCFDI_emisor_Token = typeof data_prov !== 'undefined' ? data_prov.token_cat_proveedores : '';

    if (typeof data_prov === 'undefined') {
      this.validator.errorInputRow(objeto);
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Error de vinculación de proveedor con Emisor de CFDI.' });
    }

  }

  obtenEmisor(nodo_emisor: any, objeto: any) {
    nodo_emisor.forEach((child: any) => {
      this.newFaseDOS.dataCFDIEmisor.push(
        { "title": 'Rfc del emisor', "content": child.getAttribute('Rfc') ? child.getAttribute('Rfc') : '---' },
        { "title": 'Nombre del emisor', "content": child.getAttribute('Nombre') ? child.getAttribute('Nombre') : '---' },
        { "title": 'Regimen fiscal del emisor', "content": child.getAttribute('RegimenFiscal') ? child.getAttribute('RegimenFiscal') : '---' },
      );
      this.revisa_emisor_proveedor_registrado(objeto);
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

  lecturaInternaXML(objeto: any) {
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
                      this.obtenEmisor(nodo_emisor, objeto);
                      this.obtenReceptor(nodo_receptor);

                      this.newFaseDOS.dataCFDI_comprobante_formaPago = xmlNode.getAttribute('FormaPago');
                      this.newFaseDOS.dataCFDI_comprobante_MetodoPago = xmlNode.getAttribute('MetodoPago');
                      this.newFaseDOS.dataCFDI_comprobante_TipoCambio = xmlNode.getAttribute('TipoCambio') ? xmlNode.getAttribute('TipoCambio') : '1.00';
                      this.newFaseDOS.dataCFDI_comprobante_Moneda = xmlNode.getAttribute('Moneda');
                      const moneda_CFDI = this.catalogo_monedas_api.find((row: any) => row.code === this.newFaseDOS.dataCFDI_comprobante_Moneda);
                      this.newFaseDOS.dataCFDI_comprobante_MoneDecimales = moneda_CFDI.decimales;
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

  cargaPdfReem(objeto: any): void {
    const doc_pdf = objeto.files[0];
    const validacion_pdf = doc_pdf.size <= 2000000 && (doc_pdf.type == 'application/pdf');
    this.imagenEvidenciaPdf = validacion_pdf ? doc_pdf : null;
    this.newFaseDOS.factura_pdf_name = validacion_pdf ? doc_pdf.name : null;
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

  //anexos 
  cargandoAnexos(event: any): void {
    this.imagenAnexosReem = [];
    const docs: FileList = event.target.files;
    for (let i = 0; i < docs.length; i++) {
      this.imagenAnexosReem.push(docs.item(i)!);
    }
    console.log(this.imagenAnexosReem);
    this.imagenEvidenciaXml = null;
    this.imagenEvidenciaPdf = null;
    this.newFaseDOS.resultXml = '';
  }

  keyupObservaReemSave(event: any) {
    const validarcion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    this.newFaseDOS.reem_observacion = validarcion ? event.value : "";
    validarcion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  extraeImporteTC() {
    if (this.newFaseDOS.reem_moneda_nombre == "MXN") {
      var resultando = parseFloat(this.newFaseDOS.reem_importe_total) * 1;
      this.newFaseDOS.reem_importe_resultante = numeral(resultando).format('$0,0.' + '0'.repeat(parseInt(this.newFaseDOS.reem_moneda_decimales)));
    } else {
      var resultando = parseFloat(this.newFaseDOS.reem_importe_total) * parseFloat(this.newFaseDOS.reem_tipo_cambio_string);
      this.newFaseDOS.reem_importe_resultante = numeral(resultando).format('$0,0.' + '0'.repeat(parseInt(this.newFaseDOS.reem_moneda_decimales)));
    }
  }

  get bloquearAnexos(): boolean {
    return this.escenarioDocumentosValido === 'FACTURA';
  }

  get escenarioDocumentosValido(): 'FACTURA' | 'ANEXOS' | null {
    const xml = !!this.imagenEvidenciaXml;
    const pdf = !!this.imagenEvidenciaPdf;
    const anexos = this.imagenAnexosReem?.length > 0;

    if (xml && pdf && !anexos) return 'FACTURA';
    if (!xml && !pdf && anexos) return 'ANEXOS';

    return null;
  }

  get reem_to_validate(): Boolean {
    const valida_reem_fecha = this.newFaseDOS.reem_fecha != "" && this.validator.filtroFecha(this.newFaseDOS.reem_fecha);
    const valida_reem_folio_ticket = this.newFaseDOS.reem_folio_ticket != "" && this.validator.strFilter(this.newFaseDOS.reem_folio_ticket);
    const valida_reem_pagado_a = this.newFaseDOS.reem_pagado_a != "" && this.validator.strFilter(this.newFaseDOS.reem_pagado_a) && (this.newFaseDOS.reem_pagado_a != "prov" || (this.newFaseDOS.reem_pagado_a == "prov" && this.newFaseDOS.reem_tkn_proveedor != ""));
    const valida_reem_forma_pago = this.newFaseDOS.reem_forma_pago != "";
    const valida_reem_importe_total = this.newFaseDOS.reem_importe_total != "" && this.validator.filtroCosto(this.newFaseDOS.reem_importe_total);
    const valida_reem_moneda_entrante = this.newFaseDOS.reem_moneda_nombre != "";
    const valida_reem_tipo_cambio = this.newFaseDOS.reem_tipo_cambio_string != "" && this.validator.filtroNum(this.newFaseDOS.reem_tipo_cambio_string);
    const valida_reem_observacion = this.newFaseDOS.reem_observacion != "" && this.validator.strFilter(this.newFaseDOS.reem_observacion) == true && this.newFaseDOS.reem_observacion.length >= 4;
    const documentos = this.escenarioDocumentosValido !== null;

    return this.newFaseUNO.comisionesSelected.length > 0 && valida_reem_fecha && valida_reem_folio_ticket && valida_reem_pagado_a && valida_reem_forma_pago && valida_reem_importe_total &&
      valida_reem_moneda_entrante && valida_reem_tipo_cambio && valida_reem_observacion && documentos;
  }

  list_reem_to_save() {
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
        if (!this.reem_to_validate) return;
        const escenario = this.escenarioDocumentosValido;
        if (!escenario) return;
        var proveedor_generic_rfc: any = "";
        var proveedor_rfc: any = "";
        var proveedor_id_tax: any = "";
        var proveedor_name: any = "";

        if (this.newFaseDOS.reem_pagado_a == "prov") {
          const prv_data = this.list_proveedores_general.find((prv: any) => prv.token_cat_proveedores === this.newFaseDOS.reem_tkn_proveedor);
          proveedor_generic_rfc = prv_data.rfc_generico;
          proveedor_rfc = prv_data.rfc_prov;
          proveedor_id_tax = prv_data.tax_id_prov;
          proveedor_name = prv_data.nombre;
        }

        this.reem_serv.save_reembolsos_fase_dos(
          this.newFaseUNO.token_reembolso_main,
          this.newFaseUNO.valor_humano_aplica,
          this.newFaseUNO.egresos_aplica,
          this.newFaseUNO.tiempo_respuesta_reem_comi,
          this.newFaseDOS,
          this.imagenEvidenciaXml,
          this.imagenEvidenciaPdf,
          this.imagenAnexosReem).subscribe(
            response => {
              console.log(response);
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: translate_response });
                let fpg = this.catalogoFormaPagoApi.find((row: any) => row.clave === this.newFaseDOS.reem_forma_pago);
                this.arrayreembolsosSave.push({
                  "token_solicitud_reem": response.token_solicitud_reem,
                  "reem_fecha": this.newFaseDOS.reem_fecha,
                  "reem_folio_ticket": this.newFaseDOS.reem_folio_ticket,
                  "reem_pagado_a": this.newFaseDOS.reem_pagado_a,
                  "proveedor_tkn": this.newFaseDOS.reem_tkn_proveedor,
                  "proveedor_generic_rfc": proveedor_generic_rfc,
                  "proveedor_rfc": proveedor_rfc,
                  "proveedor_id_tax": proveedor_id_tax,
                  "proveedor_name": proveedor_name,
                  "tkn_forma_pago": this.newFaseDOS.reem_forma_pago,
                  "f_pago_clave": fpg.clave,
                  "f_pago_forma": fpg.descripcion,
                  "reem_importe_total": this.newFaseDOS.reem_importe_total,
                  "reem_importe_total_format": numeral(this.newFaseDOS.reem_importe_total).format('0,0.' + '0'.repeat(parseInt(this.newFaseDOS.reem_moneda_decimales))),
                  "reem_tipo_cambio_string": this.newFaseDOS.reem_tipo_cambio_string,
                  "reem_tipo_cambio_format": numeral(this.newFaseDOS.reem_tipo_cambio_string).format('0,0.' + '0'.repeat(parseInt(this.newFaseDOS.reem_moneda_decimales))),
                  "reem_moneda_nombre": this.newFaseDOS.reem_moneda_nombre,
                  "reem_importe_saliente": numeral(parseFloat(this.newFaseDOS.reem_importe_total) * parseFloat(this.newFaseDOS.reem_tipo_cambio_string)).format('0,0.' + '0'.repeat(parseInt(this.newFaseDOS.reem_moneda_decimales))),
                  "factura_xml": this.newFaseDOS.factura_xml_name,
                  "dataCFDI_comprobante": this.newFaseDOS.dataCFDI_comprobante,
                  "dataCFDIRelacionados": this.newFaseDOS.dataCFDIRelacionados,
                  "dataCFDIEmisor": this.newFaseDOS.dataCFDIEmisor,
                  "dataCFDIReceptor": this.newFaseDOS.dataCFDIReceptor,
                  "dataCFDI_conceptos": this.newFaseDOS.dataCFDI_conceptos,
                  "dataCFDI_impuestos_retenidos_lista": this.newFaseDOS.dataCFDI_impuestos_retenidos_lista,
                  "dataCFDI_impuestos_trasladados_lista": this.newFaseDOS.dataCFDI_impuestos_trasladados_lista,
                  "dataCFDIComplemento": this.newFaseDOS.dataCFDIComplemento,
                  "factura_pdf": this.newFaseDOS.factura_pdf_name,
                  "reembolsos_anexos": escenario === 'ANEXOS' ? this.imagenAnexosReem : [],
                  "reem_observacion": this.newFaseDOS.reem_observacion
                });
                console.log(this.arrayreembolsosSave);
                this.suma_total_reem();
                this.validator.limpiaInputRow(document.getElementById("reem_date_gasto"));
                this.validator.limpiaInputRow(document.getElementById("reem_ticket_gasto"));
                this.validator.limpiaSelect(document.getElementById("reem_pay_to"));
                if (this.newFaseDOS.reem_pagado_a == "prov") { this.validator.limpiaInputRow(document.getElementById("proveedor_selected_reem")); }
                this.validator.limpiaInputRow(document.getElementById("reem_f_pago"));
                this.validator.limpiaInputRow(document.getElementById("reem_importe_total"));
                this.validator.limpiaInputRow(document.getElementById("reem_moneda_entrante"));
                this.validator.limpiaInputRow(document.getElementById("reem_tipo_cambio"));
                this.validator.limpiaInputRow(document.getElementById("facturaxml"));
                this.validator.limpiaInputRow(document.getElementById("facturapdf"));
                this.validator.limpiaInputRow(document.getElementById("anexosReem"));
                this.validator.limpiaTextarea(document.getElementById("reem_large_observ"));
                this.reem_opcion_pagado_a = null;
                this.reem_opcion_prov = null;
                this.reem_opcion_fpago = null;
                this.reem_opcion_moneda = null;

                this.newFaseDOS = new reemNewFaseDosModelo('', '', '', '', '', '', '', '', '1.00', numeral("0.00").format('$0,0.00'), '', '',
                  [], '', '1.00', '', 2, '', '', '', [], '', '', false, false, [], '', [], '', [], '', '', '', '', '', false, '0.00', '0.00', '0.00', '0.00', '0.00', 0, [], 0, [], [], '', '', '', '');

                this.imagenEvidenciaXml = null;
                this.imagenEvidenciaPdf = null;
                this.imagenAnexosReem = [];
              }
              if (response.status == 'error') {
                this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });
              }
            },
            error => { console.log(error); }
          );
      }
    })
  }

  suma_total_reem() {
    const total_comi_saldo = this.newFaseUNO.comisionesSelected.length > 0 ? this.newFaseUNO.comisionesSelected.reduce((acc: any, row: any) => {
      if (row["dinero_recibido_simple"] != null) {
        console.log(row["dinero_recibido_simple"]);
        return acc + parseFloat(row["dinero_recibido_simple"]);
      }
      return acc;
    }, 0) : 0;

    this.reem_comision_saldo_format = numeral(total_comi_saldo).format('$0,0.00');
    var inside_total: any = 0;
    for (let a = 0; a < this.arrayreembolsosSave.length; a++) {
      const reem = this.arrayreembolsosSave[a];
      inside_total = inside_total + (parseFloat(reem["reem_importe_total"]) * parseFloat(reem["reem_tipo_cambio_string"]));
    }
    this.total_reem = numeral(inside_total).format('$0,0.00');
    this.total_reem_resultante = numeral(parseFloat(inside_total) - parseFloat(total_comi_saldo)).format('$0,0.00');
  }

  delete_list_reem(posicion: any, token_solicitud_reem: string) {
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
          this.reem_serv.save_reembolsos_fase_dos_delete(this.newFaseUNO.token_reembolso_main, token_solicitud_reem).subscribe(
            response => {
              console.log(response);
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: translate_response });
                this.arrayreembolsosSave.splice(posicion, 1);
                console.log(this.arrayreembolsosSave.length);
                this.suma_total_reem();
              }
              if (response.status == 'error') {
                this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });
              }
            },
            error => { console.log(error); }
          );
        }
      }
    );
  }

  cleanFormRegistro() {
    //this.arrayComisionesSelected.splice(0, this.arrayComisionesSelected.length);
    //this.arrayreembolsosSave = [];
    //this.total_reem = parseFloat("0.00").toFixed(2);
  }

  onSaveReembolsoSolicitud() {
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
        this.reem_serv.save_reembolsos_fase_tres(this.newFaseUNO).subscribe(
          response => {
            console.log(response);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response + " " + response.folio_reem,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.arrayreembolsosSave = [];
              this.newFaseUNO.usuario_acreedor_token = "";
              this.validator.limpiaInputRow(document.getElementById("reem_acreedor_data"));
              //this.reembolsos_detalle(response.token_reembolso_main);
              //this.reem_saved = true;
              this.newFaseUNO = new reemNewFaseUnoModelo('', '', [], 0, '', false, null, false, null);
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
          error => { console.log(error); }
        );
      }
    })
  }
}