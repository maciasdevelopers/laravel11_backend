import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ComprasServService } from '../../../../../servicios/ssic/compras-serv.service';
import { LogisticaService } from '../../../../../servicios/ssic/logistica-service';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { logisticaCompraModelo } from '../../../../../modelos/logistica/logisticaCompraModelo';
import Swal from 'sweetalert2';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { ConnectableObservable, Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import numeral from 'numeral';

interface Hito {
  clave: string;
  valor: string;
}

@Component({
  selector: 'logistica_compras_iniciar_ruta',
  standalone: false,
  templateUrl: './logistica-iniciar-ruta-component.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
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
    '../../../../../styles/colores.css',
    '../../../../../styles/div_explain.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/navegador.css',
    '../../egresos.css',
    './logistica-iniciar-ruta-component.css'
  ]
})
export class LogisticaIniciarRutaComponent implements OnInit, OnDestroy{
  arrayComprasGeneral:any = [];
  compras_seleccionadas: string[] = [];
  compras_tokens:any = [];
  loading = false;

  listaCFDICartaPorteUUID:any = [];
  //monedas
  catalogo_monedas_api: any = [];
  // Variables de control de la vista (similares a tu entorno actual)
  public view_form_inicio_logistica: boolean = true;
  public esSalidaInicial: boolean = true;
  //Subscription
  private subs: Subscription = new Subscription();
  private destruir$ = new Subject<void>();
  //modelo de datos
  public logisticBuyModel:logisticaCompraModelo;
  //compras
  detalleCompra: any = [];
  listado_original_articulos: any = [];
  listado_articulos_procesos: any = [];
  unidadesAnterioresReferencia: any = [];
  public compra_fecha_tentativa_salida:string = '';
  //direcciones
  public direccionDestinoMisAlmacenes: string = '';
  // Formulario Maestro
  // Catálogo estandarizado de hitos estilo Marketplace
  public listaEtapasTraslado: Hito[] = [
    { clave: 'recolectado', valor: '📦 EN TRÁNSITO (Salida inicial del proveedor)' },
    //{ clave: 'entransito', valor: '🚚 EN TRÁNSITO (Ruta intermedia)' },
    //{ clave: 'transbordo',  valor: '✈️ TRANSBORDO (Cambio de medio/unidad)' },
    //{ clave: 'entregado',   valor: '🏁 ENTREGADO (Arribo final a almacén)' }
  ];
  // Variables de control de la vista (similares a tu entorno actual)
  public listaTipoTransporte: any = [
    { clave: 'terrestre', valor: 'Terrestre (Camión/Tráiler)' },
    { clave: 'maritimo', valor: 'Marítimo (Buque/Contenedor)' },
    { clave: 'aereo', valor: 'Aéreo (Avión)' }
  ];
  // llaves del GS1
  public code_gs1_llaves_tipos: any = [
    { clave: 'GTIN-12', valor: 'UPC (GTIN-12)' },
    { clave: 'GTIN-13', valor: 'EAN (GTIN-13)' },
    { clave: 'GTIN-14', valor: 'Caja (GTIN-14)' },
    { clave: 'GIAI', valor: 'Activo Fijo (GIAI)' }
  ];

  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  phoneForm: { [key: number]: FormGroup } = {};

  listaTransportes: any = [{ 
    tipo_transporte: 'terrestre',
    operador_nombre: '',
    tentativa_llegada_destino: '',
    operador_telefono: '',
    identificador_principal: '', // Placas / Contenedor / Guía
    identificador_secundario: '',                        // Remolque / Booking / Vuelo
    permiso_autorizacion: '',
    direccion_origen: '',
    direccion_destino_especifica: this.direccionDestinoMisAlmacenes,
    unidad_destinada_entrega_final: false,
    //data para xml
    carta_porte_relacionada: '',
    dataCFDIComplemento_carta_porte_obj: [],
    articulos: [],
    articulos_seleccionados: []  
  }];
  //Factura CFDI (XML)
  //public imagenEvidenciaXml: any;
  //public resultXml: string = '';
  ////Factura CFDI (PDF)
  //public imagenEvidenciaPdf: any;
  dataCFDIBuscarConcepto: any = [];
  public anexosTransitoFiles: NgxFileDropEntry[] = [];
  public anexosTransitoDocs: any[] = [];
  public anexosTransitoNames: any = [];

  constructor(
    private logisticaService: LogisticaService,
    private validator: ValidatorServService,
    private _comprServ: ComprasServService,
    private translate: TranslateService,
    private relInterna: ComunicacionInternaService,
    private servXlsx: DescargaExcel,
    private cd: ChangeDetectorRef,
    private primeAlerts: MessageService,
    private _monedasServ: MonedasService,
    private cfdiServ: CFDIService,
    private fb: FormBuilder
  ) {
    this.phoneForm[0] = this.fb.group({
      telefono: ['', [Validators.required]]
    });
    //this.logisticBuyModel = new logisticaCompraModelo('','','','','','','','','','','','','','','','','','','','','');
    this.logisticBuyModel = new logisticaCompraModelo('','','','','',this.listaTransportes);
  }

  @Input() set transito_orden(value: string) {
    if (value) {
      this.logisticBuyModel.compra_relacionada_token = value;
      this.monedasCatalogoApi();
      this.verfInfoCompra();
      this.listaCartasPorteLogistica();
    }
  }

  ngOnInit(): void {
    // Al arrancar, inicializamos el formulario con el primer camión obligatorio
    //this.anadirTransporte();
    this.dataCFDIBuscarConcepto = ['num_lista', 'NoIdentificacion', 'ObjetoImp', 'ClaveProdServ', 'Cantidad', 'ClaveUnidad', 'Unidad', 'Descripcion', 'ValorUnitario', 'Descuento',
      'Importe', 'TotalRetenciones', 'TotalTraslados', 'Subtotal', 'Impuestos', 'retenciones', 'expandedRowsRetenciones',
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

  listaCartasPorteLogistica() {
    this.logisticaService.logisticaCompraCartasPorte().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaCFDICartaPorteUUID = response.cartas_porte;
          console.log(this.listaCFDICartaPorteUUID);
        }
      }
    )
  }

  verfInfoCompra() {
    this.subs.add(
      this.logisticaService.logisticaComprasLista('all_partidas','','').pipe(takeUntil(this.destruir$)).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.status === 'success') {
            this.arrayComprasGeneral = response.compras;
            this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
          } else {
            this.arrayComprasGeneral = []; // O manejar mensaje de "sin datos"
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al cargar compras:', err);
          this.arrayComprasGeneral = [];
        }
      })
    );
  }

  descargarInfoComprasSeleccionadas() {
    this.logisticBuyModel.transportes.forEach((transp:any) => {
      transp.articulos = [];
    });

    this.compras_tokens = this.compras_seleccionadas.map(token => ({token_compras: token}));
    //this.compras_tokens = this.compras_seleccionadas.map((compra: any) => ({
    //  token_compras: compra.token_compras // 📍 Extraemos solo el string encriptado
    //}));
    console.log(this.compras_seleccionadas);
    console.log(this.compras_tokens);
    if (this.compras_tokens.length > 0) {
      this.subs.add(
        this.logisticaService.logisticaCompraDesglosePartidas(this.compras_tokens).subscribe(response => {//tokensFormateados
          if (response.status === 'success') {
            this.detalleCompra = response.compra;
            this.listado_original_articulos = [];
            this.listado_articulos_procesos = [];
            this.unidadesAnterioresReferencia = [];
            response.compra.forEach((buy: any) => {
              this.compra_fecha_tentativa_salida = buy.fecha_tentativa_salida;
              this.direccionDestinoMisAlmacenes = buy.recepcion_estab_direccion;
              console.log(buy.compra_partidas);
              this.listado_original_articulos = buy.compra_partidas;
              this.listado_articulos_procesos = buy.compra_partidas;
  
              if (this.logisticBuyModel.transportes && this.logisticBuyModel.transportes[0]) {
                this.logisticBuyModel.transportes[0].articulos = JSON.parse(JSON.stringify(this.listado_original_articulos));
  
                // Opcional: Si quieres que al arrancar inicien vacíos los campos SKU y GS1 de la unidad 1:
                this.logisticBuyModel.transportes[0].articulos.forEach((art: any) => {
                  art.new_sku = '';
                  art.new_tipo_llave_gs1 = '';
                  art.new_codigo_gs1 = '';
                });
              }
            });
            this.cd.detectChanges();
          }
        })
      );
    }
  }

  public onHitoChange(etapa_seleccionada: string): void {
    var etapa_del_traslado = document.getElementById("etapa_del_traslado");
    let option = this.listaEtapasTraslado.find((row: any) => row.clave === etapa_seleccionada);
    const validacion = etapa_seleccionada != "" && this.validator.filtroAlfaNumerico(etapa_seleccionada) && typeof option !== 'undefined';
    this.logisticBuyModel.estado_alcanzado = validacion ? option.clave : '';
    validacion ? this.validator.correctoSelectBrowser(etapa_del_traslado) : this.validator.errorSelectBrowser(etapa_del_traslado);

    this.esSalidaInicial = (etapa_seleccionada === 'recolectado');
    
    // Lógica inteligente: Si no es el hito inicial, consultamos al backend de Laravel
    // para traer el destino anterior inmediato y setearlo como nuevo origen automático
    if (!this.esSalidaInicial) {
      this.unidadesAnterioresReferencia = [];
      this.logisticaService.logisticaCompraObtenUltimoParadero(this.logisticBuyModel.compra_relacionada_token).subscribe({
        next: (res: any) => {
          if (res && res.status === 'success' && res.data) {

            // GUARDAMOS LA SÁBANA DE DATOS PARA CONSULTA, NO PARA FORZAR EL FORMULARIO
            this.unidadesAnterioresReferencia = res.data.unidades_anteriores;
            // POR DEFECTO, si el formulario está vacío o solo tiene la unidad inicial, 
            // le sugerimos como origen la ubicación de la primera unidad del tramo anterior.
            if (this.unidadesAnterioresReferencia.length > 0 && this.logisticBuyModel.transportes[0]) {
              this.logisticBuyModel.transportes[0].direccion_origen = this.unidadesAnterioresReferencia[0].direccion_destino_especifica;
            }

            this.listado_articulos_procesos = res.data.mercanciaEnTransito;
            if (this.logisticBuyModel.transportes && this.logisticBuyModel.transportes[0]) {
              this.logisticBuyModel.transportes[0].articulos = JSON.parse(JSON.stringify(this.listado_articulos_procesos));

              // Opcional: Si quieres que al arrancar inicien vacíos los campos SKU y GS1 de la unidad 1:
              this.logisticBuyModel.transportes[0].articulos.forEach((art: any) => {
                art.new_sku = '';
                art.new_tipo_llave_gs1 = '';
                art.new_codigo_gs1 = '';
              });
            }
            this.cd.detectChanges();
          }
        }
      });
    } else {
      if (this.logisticBuyModel.transportes && this.logisticBuyModel.transportes[0]) {
        this.logisticBuyModel.transportes[0].articulos = JSON.parse(JSON.stringify(this.listado_original_articulos));

        // Opcional: Si quieres que al arrancar inicien vacíos los campos SKU y GS1 de la unidad 1:
        this.logisticBuyModel.transportes[0].articulos.forEach((art: any) => {
          art.new_sku = '';
          art.new_tipo_llave_gs1 = '';
          art.new_codigo_gs1 = '';
        });
      }
    }
  }

  select_fecha_real_salida(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.logisticBuyModel.fecha_real_salida = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  select_fecha_tentativa_llegada(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.logisticBuyModel.tentativaLlegadaLugarDestino = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //Unidades / Medios de Transporte Despachados

  public removerTransporte(index: number): void {
    if (this.logisticBuyModel.transportes.length > 1) {
      this.logisticBuyModel.transportes.splice(index, 1);// removeAt(index)
    }
  }

  select_tipo_transporte(clave: any,transporte:any) {
    var medioDeTransporte = document.getElementById("medioDeTransporte");
    let option = this.listaTipoTransporte.find((row: any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof option !== 'undefined';
    transporte.tipo_transporte = validacion ? option.clave : '';
    validacion ? this.validator.correctoSelectBrowser(medioDeTransporte) : this.validator.errorSelectBrowser(medioDeTransporte);
  }

  salida_nombre_operador(event:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    transporte.operador_nombre = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  probarTextPhone(idx:any){
    if (this.phoneForm[idx].valid) {
      console.log(this.phoneForm);
      //const phone = this.phoneForm.get('telefono')?.value;
      console.log(this.phoneForm[idx].value.telefono);
      const phone = this.phoneForm[idx].value.telefono;
      if (phone) {
        console.log('Número internacional:', phone.internationalNumber);
        console.log('Número nacional:', phone.nationalNumber);
        console.log('Código de país:', phone.countryCode);
        console.log('Dial code:', phone.dialCode);
      }
    }
  }

  keyupTrabContTelefonoNumero(event:any,transporte:any,idx:any){
    var telefonoDelOperador = document.getElementById("telefonoDelOperador");
    const phone = this.phoneForm[idx].value.telefono;
    const validacion = this.phoneForm[idx].valid && phone.length >= 5 && this.validator.filtroPhone(phone);
    transporte.operador_telefono = validacion ? phone : '';
    validacion ? this.validator.correctoTelefonos(telefonoDelOperador) : this.validator.errorTelefonos(telefonoDelOperador);
  }

  fecha_tentativa_llegada_destino(event:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    transporte.tentativa_llegada_destino = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  salida_identificador_principal(event:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    transporte.identificador_principal = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  salida_identificador_secundario(event:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    transporte.identificador_secundario = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  salida_permiso_autorizacion(event:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    transporte.permiso_autorizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  salida_direccion_origen(event:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    transporte.direccion_origen = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  salida_direccion_destino_especifica(event:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    transporte.direccion_destino_especifica = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  estableceDestinoComoEntregaFinal(transporte:any): void {
    if (!transporte.unidad_destinada_entrega_final) {
      transporte.unidad_destinada_entrega_final = true;
    } else {
      transporte.unidad_destinada_entrega_final = false;
    }
  }

  select_carta_porte_transporte(carta_porte_id_ccp: any,transporte:any) {
    var cartaPorteTransporte = document.getElementById("cartaPorteTransporte");
    let cPorte = this.listaCFDICartaPorteUUID.find((row: any) => row.cfdi_comprobante_registrado_carta_porte_id_ccp === carta_porte_id_ccp);
    const validacion = carta_porte_id_ccp != "" && this.validator.filtroAlfaNumerico(carta_porte_id_ccp) && typeof cPorte !== 'undefined';
    
    if (validacion) {
      this.logisticaService.logisticaCompraObtenerCartaPorte(cPorte.cfdi_comprobante_registrado_tipo,cPorte.cfdi_comprobante_registrado_uuid,cPorte.cfdi_comprobante_registrado_carta_porte_id_ccp).subscribe(
        response => {
          if (response.status == 'success') {
            transporte.carta_porte_relacionada = validacion ? cPorte.cfdi_comprobante_registrado_carta_porte_id_ccp : '';
            transporte.dataCFDIComplemento_carta_porte_obj = response.carta_porte;
            console.log(transporte.dataCFDIComplemento_carta_porte_obj);
          }
        }
      );
    }
    validacion ? this.validator.correctoSelectBrowser(cartaPorteTransporte) : this.validator.errorSelectBrowser(cartaPorteTransporte);
  }

  keepOrder = (a: any, b: any): number => {
    return 0;
  }

  formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  verATIDVehConcepto(atidveh:any,transporte:any) {
    transporte.ver_atidveh = transporte.ver_atidveh === atidveh ? null : atidveh;
    transporte.ver_seguros = null;
    transporte.ver_remolques = null;
  }

  verSegurosTranspConcepto(seguros:any,transporte:any) {
    transporte.ver_atidveh = null;
    transporte.ver_seguros = transporte.ver_seguros === seguros ? null : seguros;
    transporte.ver_remolques = null;
  }

  verRemolquesTranspConcepto(remolques:any,transporte:any) {
    transporte.ver_atidveh = null;
    transporte.ver_seguros = null;
    transporte.ver_remolques = transporte.ver_remolques === remolques ? null : remolques;
  }

  verTranspMarContenedorM(contenedor:any,transporte:any) {
    transporte.ver_contenedor_m = transporte.ver_contenedor_m === contenedor ? null : contenedor;
  }

  verTranspFerroDerechosDePaso(DerechosDePaso:any,transporte:any) {
    transporte.ver_derechos_de_paso = transporte.ver_derechos_de_paso === DerechosDePaso ? null : DerechosDePaso;
  }

  verTranspFerroCarro(Carro:any,transporte:any) {
    transporte.ver_carro = transporte.ver_carro === Carro ? null : Carro;
  }

  verTranspCarroConten(Contenedor:any,ferroviario:any) {
    ferroviario.ver_contenedor = ferroviario.ver_contenedor === Contenedor ? null : Contenedor;
  }

  // Añade esta función en tu archivo logistica-iniciar-transito-component.ts
  public tieneArticulosIncompletos(articulos: any[]): boolean {
    if (!articulos || articulos.length === 0) return true;

    // Devuelve true si encuentra al menos un artículo sin SKU, GS1 o cantidad
    return articulos.some(art => (art.reg_sku === '' && art.new_sku === '') || (art.reg_codigo_gs1 === '' && art.new_codigo_gs1 === '') || art.cantidad_transitar === 0 || art.cantidad_transitar > art.cantidad_pendiente_transito);
  }

  articulo_cantidad(event:any,cBuy:any): void {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value <= cBuy.cantidad_pendiente_transito;
    cBuy.cantidad_transitar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  articulo_sku(event:any,cBuy:any,transporte:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    cBuy.new_sku = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(transporte.articulos_seleccionados);
  }

  articulo_gs1_declara_tipo(clave:any,cBuy:any,transporte:any,selectIndex:any) {
    console.log('articuloGs1tipos_'+selectIndex);
    var articuloGs1tipos = document.getElementById('articuloGs1tipos_'+selectIndex);
    let dcperiod = this.code_gs1_llaves_tipos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    cBuy.new_tipo_llave_gs1 = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(articuloGs1tipos) : this.validator.errorSelectBrowser(articuloGs1tipos);
    console.log(transporte.articulos_seleccionados);
  }
  
  obtenerPlaceholder(tipoLlave: string): string {
    switch(tipoLlave) {
      case 'GTIN-12': return 'Ej. 123456789012 (12 díg)';
      case 'GTIN-13': return 'Ej. 7501234567890 (13 díg)';
      case 'GTIN-14': return 'Ej. 17501234567897 (14 díg)';
      case 'GIAI':    return 'Ej. Activo Alfanumérico (Hasta 30)';
      default:        return 'Seleccione tipo de código';
    }
  }

  obtenerMaxlength(tipoLlave: string): number {
    switch(tipoLlave) {
      case 'GTIN-12': return 12;
      case 'GTIN-13': return 13;
      case 'GTIN-14': return 14;
      case 'GIAI':    return 30;
      default:        return 50;
    }
  }

  articulo_gs1_key(event:any,cBuy:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    cBuy.new_codigo_gs1 = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public anadirTransporte(): void {
    const articulosIndependientes = JSON.parse(JSON.stringify(this.listado_articulos_procesos));
    articulosIndependientes.forEach((art: any) => {
      art.new_sku = '';
      art.new_tipo_llave_gs1 = '';
      art.new_codigo_gs1 = '';
    });
    
    const nuevoTransporte = { 
      tipo_transporte: 'terrestre',
      operador_nombre: '',
      tentativa_llegada_destino: '',
      operador_telefono: '',
      identificador_principal: '', // Placas / Contenedor / Guía
      identificador_secundario: '',                        // Remolque / Booking / Vuelo
      permiso_autorizacion: '',
      direccion_origen: '',
      direccion_destino_especifica: this.direccionDestinoMisAlmacenes,
      unidad_destinada_entrega_final: false,
      //data para xml
      carta_porte_relacionada: '',
      dataCFDIComplemento_carta_porte_obj: [],
      articulos: articulosIndependientes,
      articulos_seleccionados: []  
    };
    this.logisticBuyModel.transportes.push(nuevoTransporte);//this.listaTransportes
    const nuevoIdx = this.logisticBuyModel.transportes.length - 1;
    this.phoneForm[nuevoIdx] = this.fb.group({
      telefono: ['', [Validators.required]]
    });
  }

  especificaciones_transporte(event:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.logisticBuyModel.observaciones = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedTransito(files: NgxFileDropEntry[]) {
    // 1. Limpiamos estados para recibir el nuevo set de archivos
    this.anexosTransitoFiles = files;
    this.anexosTransitoNames = [];
    this.anexosTransitoDocs = [];

    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i];

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          const typoElement = file.type;
          const nameFile = file.name;
          const sizeFile = file.size;

          // 2. Validación de tipos y tamaño (2MB)
          const allowedTypes = ['application/pdf', 'text/xml', 'image/jpeg', 'image/jpg', 'image/png'];
          const isAllowedType = allowedTypes.includes(typoElement);
          const isAllowedSize = sizeFile <= 2000000;

          if (isAllowedType && isAllowedSize) {
            // 3. Inserción directa y limpia
            // Ya no necesitamos el ciclo for (j...) porque limpiamos al inicio
            this.anexosTransitoNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            this.anexosTransitoDocs.push(file);

            console.log(`Archivo aceptado: ${nameFile}`);
          } else {
            // 4. Manejo de errores específico
            let mensajeError = '';
            if (!isAllowedSize) {
              mensajeError = `El archivo ${nameFile} excede el tamaño permitido (2MB)`;
            } else if (!isAllowedType) {
              mensajeError = `El archivo ${nameFile} tiene un formato no permitido (PDF, XML, JPG, PNG)`;
            }

            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            });

            // Opcional: Remover de la lista de visualización si falló la validación técnica
            const index = this.anexosTransitoFiles.findIndex(f => f.relativePath === droppedFile.relativePath);
            if (index > -1) this.anexosTransitoFiles.splice(index, 1);
          }
        });
      }
    }
  }

  public fileOverTransito(event: any) {
    console.log(event);
  }

  public fileLeaveTransito(event: any) {
    console.log(event);
  }

  deleteAnexosTransito(posicion: number) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo seleccionado?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"), // Asegúrate de tener esta llave en tu i18n
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminamos de los 3 arreglos usando el mismo índice
        this.anexosTransitoFiles.splice(posicion, 1);
        this.anexosTransitoNames.splice(posicion, 1);
        this.anexosTransitoDocs.splice(posicion, 1);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Archivo eliminado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  get validaFormInicioTransitoCompra():boolean{
    const m = this.logisticBuyModel;
    let option = this.listaEtapasTraslado.find((row: any) => row.clave === m.estado_alcanzado);

    // 1. Validaciones base obligatorias
    let valido = m.compra_relacionada_token !== '' &&
      m.estado_alcanzado !== '' && this.validator.filtroAlfaNumerico(m.estado_alcanzado) && typeof option !== 'undefined' &&
      m.fecha_real_salida !== '' && this.validator.filtroFecha(m.fecha_real_salida) && 
      m.tentativaLlegadaLugarDestino !== '' && this.validator.filtroFecha(m.tentativaLlegadaLugarDestino) && 
      m.observaciones !== '' && this.validator.filtroAlfaNumerico(m.observaciones);

    let transportesValidos = m.transportes.every((transp:any) => {
      let t_transp = this.listaTipoTransporte.find((row: any) => row.clave === transp.tipo_transporte);
      let camposUnidadOk = transp.tipo_transporte != "" && this.validator.filtroAlfaNumerico(transp.tipo_transporte) && typeof t_transp !== 'undefined' &&
      transp.operador_nombre != "" && this.validator.filtroAlfaNumerico(transp.operador_nombre) &&
      transp.operador_telefono.length >= 5 && this.validator.filtroPhone(transp.operador_telefono) &&
      transp.tentativa_llegada_destino != "" && this.validator.filtroFecha(transp.tentativa_llegada_destino) &&
      transp.identificador_principal != "" && this.validator.filtroAlfaNumerico(transp.identificador_principal) &&
      transp.identificador_secundario != "" && this.validator.filtroAlfaNumerico(transp.identificador_secundario) &&
      transp.direccion_origen != "" && this.validator.filtroAlfaNumerico(transp.direccion_origen) &&
      transp.direccion_destino_especifica != "" && this.validator.filtroAlfaNumerico(transp.direccion_destino_especifica);

      // Validación de artículos seleccionados mediante el Checkbox
      // A: Debe tener al menos un artículo seleccionado en esta unidad
      let tieneArticulos = transp.articulos_seleccionados && transp.articulos_seleccionados.length > 0;
    
      // B: Todos los artículos seleccionados en esta unidad deben tener cantidad, SKU y GS1 completos
      let articulosCompletosOk = tieneArticulos && transp.articulos_seleccionados.every((art: any) => {
        const OKSku = (art.reg_sku !== '' || (art.new_sku && art.new_sku !== ''));
        const OKGs1 = ((art.reg_tipo_llave_gs1 !== '' && art.reg_codigo_gs1 !== '') || (art.new_codigo_gs1 && art.new_codigo_gs1 !== ''));
        const OKCantPend = art.cantidad_transitar &&  art.cantidad_transitar > 0 && art.cantidad_transitar <= art.cantidad_pendiente_transito;
        return OKSku && OKGs1 && OKCantPend;
      });
      return camposUnidadOk && articulosCompletosOk;
    });

    // 4. Validar que al menos las partidas tengan sus datos completos si es obligatorio
    //const partidasValidas = this.listado_articulos.every((art:any) => art.new_sku && art.new_sku !== '');
    
    // Asignamos el estado final al guardián del botón submit
    return valido && transportesValidos;// && partidasValidas;
  }

  public registrarHitoLogistico(form:{reset:() => void;}): void {
    if (!this.validaFormInicioTransitoCompra) {
      this.primeAlerts.add({ 
        severity: 'warn', 
        summary: 'Campos Incompletos', 
        detail: 'Por favor complete todos los campos requeridos y seleccione los artículos asignados.' 
      });
      return;
    }

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
        //this.view_form_inicio_logistica = false;
        this.logisticaService.logisticaCompraIniciaTransito(this.logisticBuyModel,this.compras_tokens,this.anexosTransitoDocs).subscribe({
          next: (response) => {    
            let translate_response = this.translate.instant(response.message);        
            if (response.status === 'success') {
              this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa:', detail: translate_response });
              this.view_form_inicio_logistica = true; // Cerramos o limpiamos el modal/formulario
              form.reset();
              this.logisticBuyModel = new logisticaCompraModelo('','','','','',this.listaTransportes);
              this.relInterna.mensajeLogisticaRegistro("ruta_iniciada");
            } else {
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa:', detail: translate_response });
            }
          },
          error: (error) => {
            this.primeAlerts.add({
              severity: 'error', 
              summary: 'Fallo en Servidor', 
              detail: error.error?.message || 'Ocurrió un problema al procesar la transacción.'
            });
          }
        });
      }
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
