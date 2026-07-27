import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { RequisicionesService } from '../../../../../../servicios/ssic/requisiciones.service';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { ActFijosService } from '../../../../../../servicios/ssic/act-fijos.service';
import { ActIntangiblesService } from '../../../../../../servicios/ssic/act-intangibles.service';
import { CFDIService } from '../../../../../../servicios/xml/cfdi.service';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import numeral from 'numeral';
import { takeUntil, tap } from 'rxjs/operators';
import { nodeFromXmlElement } from '@nodecfdi/cfdi-core';
import { MessageService } from 'primeng/api';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { ImpuestosServService } from '../../../../../../servicios/ssic/impuestos-serv.service';
import { comprasModeloFContabilizacion } from '../../../../../../modelos/compras/compra/comprasModeloFContabilizacion';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';
import { Subject, Subscription } from 'rxjs';
import { SessionContextService } from '../../../../../../servicios/session-context';

@Component({
  selector: 'app_compras_registro_cfdi',
  templateUrl: './registro_por_cfdi.component.html',
  standalone: false,
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
    './registro_por_cfdi.component.css'
  ],
  providers: [RequisicionesService, SentinelArkManager]
})
export class RegistroCompraCFDIComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public usuario: Usuarios;
  public identidad: any;

  //monedas
  catalogo_monedas_api: any = [];
  //Catalogo de productos y servicios
  productosVincLista: any = [];
  prodservCatGeneral: any = [];
  expandRowsProductos: { [s: string]: boolean } = {};
  public articulos_nuevo_registro: any = [];// asegúrate de que esto esté inicializado como arreglo vacío

  public fcontab_compra_modelo: comprasModeloFContabilizacion;
  //fecha de registro
  public compra_fecha_registro: string = "";
  //fecha de contabilizacion
  public compra_fecha_contabilizacion: string = "";
  //fecha de contabilizacion
  public compra_fecha_vencimiento: string = "";
  //folio de registro
  public compra_folio_registro: string = "";
  //retenciones
  dataCFDIBuscarRetenciones: any = [];
  impRetencionesCatalogo: any = [];
  indicadorImpRetenciones:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoImpRetenciones: Date[] | undefined;
  //traslados
  dataCFDIBuscarTraslados: any = [];
  impTrasladosCatalogo: any = [];
  indicadorImpTraslados:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoImpTraslados: Date[] | undefined;

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
  dataCFDIComplemento_carta_porte_obj: any = {};
  public dataCFDI_complemento_UUID: string = '';
  public dataCFDI_complemento_SelloCFD: string = '';
  //activos
  amortizacion_periodos:any = []
  listActivosFijos: any = [];
  rangoPeriodoFijosActivos: Date[] | undefined;
  indicadorFijosActivos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  expandRowsActivoFijo: { [s: string]: boolean } = {};

  listActivosIntangibles: any = [];
  rangoPeriodoDiferidosActivos: Date[] | undefined;
  indicadorDiferidosActivos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  expandRowsActivoDiferido: { [s: string]: boolean } = {};

  //Factura CFDI (PDF)
  public imagenEvidenciaPdf: any;

  //verificacion de comprobante
  public imagenEvidenciaVerificacion: any;

  //proceso de compra
  public compra_contado_credito: string = 'contado';

  //recepcion de articulo antes o despues de pago
  public classRecibeArtPago: boolean = false;

  //lugar de entrega
  public tipoLugarRecepcion: string = '';
  public compra_fecha_tentativa_salida: string = '';
  public tknLugarSalida: string = '';
  public compra_fecha_tentativa_recepcion: string = '';
  public tknLugarRecepcion: string = '';

  //establecimientos
  arrayEstablecCompras: any = [];
  public compra_establecimientos_registro_modal: boolean = false;

  //extras
  public compra_observaciones: string = '';
  public anexosCompraFiles: NgxFileDropEntry[] = [];
  public anexosCompraDocs: any[] = [];
  public anexosCompraNames: any = [];

  //registro de compra
  public cargandoCompras: string = '';
  public compra_proceso_pago: boolean = false;

  private pagoSubscription!: Subscription;
  private proveedorRegistroSubscription!: Subscription;

  complem_cporte_ubica_domi: any;
  complem_cporte_merc_autot_atidveh: any;
  complem_cporte_merc_autot_seguros: any;
  complem_cporte_merc_autot_remolques: any;
  complem_cporte_contenedor_maritimo: any;
  complem_cporte_ferro_derechos_de_paso: any;
  complem_cporte_ferro_carro: any;

  constructor(
    private sentinela: SentinelArkManager,
    private validator: ValidatorServService,
    private _actFijo: ActFijosService,
    private _intanServ: ActIntangiblesService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private cfdiServ: CFDIService,
    private _comprServ: ComprasServService,
    private translate: TranslateService,
    private sessionContext: SessionContextService,
    private relInterna: ComunicacionInternaService,
    private _catImp: ImpuestosServService,
    private estabServ: EstablecimientosService,
    private cd: ChangeDetectorRef, 
    private primeAlerts: MessageService
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
    this.fcontab_compra_modelo = new comprasModeloFContabilizacion('', false);
    //this.modelLote = new loteAngularModelo('','','','');
    //this.modelPedim = new pedimentoAngularModelo('','','','','');
  }

  ngOnInit(): void {
    this.amortizacion_periodos = [
      {clave:"86400", valor:"Por día"},//clave:"periodDay",
      {clave:"604800", valor:"Por semana"},//clave:"periodWeek",
      {clave:"2629743", valor:"Por mes"},//clave:"periodMonth",
      {clave:"31556926",valor:"Por año"}//clave:"periodYear",
    ];
    this.articulos_nuevo_registro = [{ "id": 1, "num_lista": 0 }];
    //this.function_permisos();
    this.ver_compras_folio();
    this.monedasCatalogoApi();
    this.getRespuestaRegistroINVENT();
    this.getRespuestaProveedorServicios();
    this.getRespuestaRegistroPago();
    this.getRespuestaRegistroEstablecimiento();
    this.getRespuestaRegistroProveed();
    //this.getRespuestaProveedorArticulos();
    //this.getRespuestaProveedorServicios();

    this.dataCFDIBuscarConcepto = ['num_lista', 'NoIdentificacion', 'ObjetoImp', 'ClaveProdServ', 'Cantidad', 'ClaveUnidad', 'Unidad', 'Descripcion', 'ValorUnitario', 'Descuento',
      'Importe', 'TotalRetenciones', 'TotalTraslados', 'Subtotal', 'Impuestos', 'articulo_retenciones_modal', 'retenciones', 'expandedRowsRetenciones', 'retenciones_llenadas',
      'articulo_traslados_modal', 'traslados', 'expandedRowsTraslados', 'traslados_llenados', 'articulo_homologado_iva', 'articulo_guardar_tkn', 'articulo_guardar_identificador',
      'articulo_homologado_comprobacion', 'articulo_homologado_ventana_registro', 'articulo_homologado_registro_tipo', 'articulo_homologado_token', 'articulo_homologado_view',
      'articulo_homologado_nombre', 'articulo_homologado_logotipo', 'articulo_homologado_clasificacion', 'articulo_homologado_identificador', 'articulo_homologado_serie_bool',
      'articulo_homologado_serie_view', 'articulo_homologado_serie_token', 'articulo_homologado_serie_numero', 'articulo_homologado_lote_bool', 'articulo_homologado_lote_view',
      'articulo_homologado_lote_token', 'articulo_homologado_lote_numero', 'articulo_homologado_pedimento_bool', 'articulo_homologado_pedimento_view', 'articulo_homologado_pedimento_token',
      'articulo_homologado_pedimento_numero', 'articulo_homologado_view_uso', 'articulo_homologado_uso', 'articulo_homologado_efecto_fiscal', 'articulo_homologado_view_activos',
      'articulo_homologado_activoFijo', 'articulo_homologado_activoDiferido', 'articulo_homologado_prorratea', 'articulo_homologado_gastos_rel', 'articulo_homologado_periodicidad_view',
      'articulo_homologado_periodicidadPc', 'articulo_homologado_iteracionPc', 'articulo_homologado_periodoDetIndPc', 'articulo_homologado_fechaFinPc', 'articulo_homologado_tipoImporteVi',
      'articulo_homologado_monedaVi', 'articulo_homologado_monedaDecimalesVi', 'articulo_homologado_importeMinVi', 'articulo_homologado_importeMaxVi', 'articulo_homologado_periodicidad_reg', 'activa_desglose'];

    this.dataCFDIBuscarRetenciones = ['token_catalogo_impuesto', 'folio_impuesto', 'abreviacion_impuesto', 'concepto_impuesto', 'modulo', 'nivel_aplicacion', 'catalogo_sat',
      'tipo_impuesto', 'exento', 'calculo', 'txtimporte', 'tipo_cambio', 'monedas_codigo', 'monedas_moneda', 'base_aplicable', 'desglose', 'gl_por_pagarcobrar', 'gl_pagada_o_cobrada', 'observaciones'];

    this.dataCFDIBuscarTraslados = ['token_catalogo_impuesto', 'folio_impuesto', 'abreviacion_impuesto', 'concepto_impuesto', 'modulo', 'nivel_aplicacion', 'catalogo_sat',
      'tipo_impuesto', 'exento', 'calculo', 'txtimporte', 'tipo_cambio', 'monedas_codigo', 'monedas_moneda', 'base_aplicable', 'desglose', 'gl_por_pagarcobrar', 'gl_pagada_o_cobrada', 'observaciones'];
  }

  keepOrder = (a: any, b: any): number => {
    return 0;
  }

  formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
  
  listar_catalogo_general_prod_serv() {
    this._comprServ.listaProdServCompras().subscribe(
      response => {
        if (response.status == 'success') {
          this.prodservCatGeneral = response.listaArticulos;
          console.log(this.prodservCatGeneral);
          const expandRowsProductos: { [s: string]: boolean } = {};
          this.prodservCatGeneral.forEach((row: any) => {
            row.expandedRowsProductos = expandRowsProductos;
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //retenciones
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

  //traslados
  lista_impuestos_catalogo_traslados() {
    this.ver_impuestos_catalogo_traslados(this.indicadorImpTraslados);
  }

  ver_impuestos_catalogo_traslados(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorImpTraslados = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var imp_tras_otras_fechas = document.getElementById("imp_tras_otras_fechas");
      if (this.rangoPeriodoImpTraslados && this.rangoPeriodoImpTraslados.length === 2) {
        const dateInicio = this.rangoPeriodoImpTraslados[0];
        const dateFin = this.rangoPeriodoImpTraslados[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(imp_tras_otras_fechas);
          } else {
            this.validator.errorInputRow(imp_tras_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(imp_tras_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(imp_tras_otras_fechas);
      }
    }
    
    this._catImp.catalogoGeneralImpuestosTrasladosTrue(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaTrasImp(response),
      error: (err) => this.manejarErrorTrasImp(err)
    });
  }

  private procesarRespuestaTrasImp(response: any) {
    if (response.status === 'success') {
      this.impTrasladosCatalogo = response.impuestos;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
      console.log(this.impTrasladosCatalogo);
    } else {
      this.impTrasladosCatalogo = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorTrasImp(error: any) {
    console.error('Error al cargar el catálogo de impuestos trasladados:', error);
    this.impTrasladosCatalogo = [];
  }

  //activos
  recargar_lista_activos() {
    this.listFamActFijosTrue(this.indicadorFijosActivos);
  }

  listFamActFijosTrue(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorFijosActivos = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var act_cbuy_cfdi_otras_fechas = document.getElementById("act_cbuy_cfdi_otras_fechas");
      if (this.rangoPeriodoFijosActivos && this.rangoPeriodoFijosActivos.length === 2) {
        const dateInicio = this.rangoPeriodoFijosActivos[0];
        const dateFin = this.rangoPeriodoFijosActivos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(act_cbuy_cfdi_otras_fechas);
          } else {
            this.validator.errorInputRow(act_cbuy_cfdi_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_cbuy_cfdi_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(act_cbuy_cfdi_otras_fechas);
        return;
      }
    }

    this._actFijo.activosFijosCatalogo(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => this.procesar_respuesta_activo(response),
      error: (err) => this.error_alerta_activo(err)
    });
  }

  procesar_respuesta_activo(response: any){
    if (response.status === 'success') {
      this.listActivosFijos = response.datosActivo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listActivosFijos = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_activo(error: any){
    console.error('Error al cargar compras:', error);
    this.listActivosFijos = [];
  }

  listar_activos_intang_true() {
    this.ver_activos_intang_true(this.indicadorDiferidosActivos);
  }

  ver_activos_intang_true(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDiferidosActivos = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var act_dif_cbuy_cfdi_otras_fechas = document.getElementById("act_dif_cbuy_cfdi_otras_fechas");
      if (this.rangoPeriodoDiferidosActivos && this.rangoPeriodoDiferidosActivos.length === 2) {
        const dateInicio = this.rangoPeriodoDiferidosActivos[0];
        const dateFin = this.rangoPeriodoDiferidosActivos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(act_dif_cbuy_cfdi_otras_fechas);
          } else {
            this.validator.errorInputRow(act_dif_cbuy_cfdi_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_dif_cbuy_cfdi_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(act_dif_cbuy_cfdi_otras_fechas);
        return;
      }
    }

    this._intanServ.activosIntangGet(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => this.procesar_respuesta_diferido_activo(response),
      error: (err) => this.error_alerta_diferido_activo(err)
    });
  }

  procesar_respuesta_diferido_activo(response: any){
    if (response.status === 'success') {
      this.listActivosIntangibles = response.datosActivo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listActivosIntangibles = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_diferido_activo(error: any){
    console.error('Error al cargar compras:', error);
    this.listActivosIntangibles = [];
  }

  recargaEstablecimientos() {
    this.estabServ.listaEstablecimientoscomplete().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayEstablecCompras = response.listaEstablecimientos;
          console.log(this.arrayEstablecCompras);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verEstablecimientoFormRegistro() {
    this.compra_establecimientos_registro_modal = true;
  }

  ver_compras_folio() {
    this._comprServ.folioCompra().subscribe(
      response => {
        if (response.status == 'success') {
          this.compra_folio_registro = response.folioCompleto;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  select_fecha_contabilizacion(event: any): void {
    const validacion_xml = event.value != "" && this.validator.filtroFecha(event.value);
    this.compra_fecha_contabilizacion = validacion_xml ? event.value : '';
    validacion_xml ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  active_view_cont() {
    this.fcontab_compra_modelo.view_cont = !this.fcontab_compra_modelo.view_cont ? true : false;
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

  deleteXmlCompra(): void {
    this.imagenEvidenciaXml = null;
  }

  deletePdfCompra(): void {
    this.imagenEvidenciaPdf = null;
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

      const rfc_emp_user_receptor = this.sessionContext.empresa_data?.rfc_emp || "";
      const company_emp_user_receptor = this.sessionContext.empresa_data?.company_name_large || "";

      const valida_cion_emisor_rfc = rfc_emp_user_receptor.toLowerCase() === this.dataCFDI_receptor_Rfc.toLowerCase();
      if (!valida_cion_emisor_rfc) {
        this.disparaErrorLocal(objeto, 'El rfc del receptor no coincide con el rfc de ' + company_emp_user_receptor + '.');
        return;
      }

      const generales_cfdi_validacion = this.dataCFDI_complemento_UUID && this.dataCFDI_emisor_Rfc && this.dataCFDI_receptor_Rfc && this.dataCFDI_comprobante_Total;
      if (!generales_cfdi_validacion) {
        this.disparaErrorLocal(objeto, 'Faltan datos para validar el CFDI en el SAT.');
        return;
      }
      const total = parseFloat(this.dataCFDI_comprobante_Total).toFixed(6);

      this.revisa_emisor_proveedor_registrado();

      this.cfdiServ.validaEstadoCFDICompras(this.dataCFDI_complemento_UUID, this.dataCFDI_emisor_Rfc, this.dataCFDI_receptor_Rfc, total).subscribe(
        response => {
          console.log(response);
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
          if (this.prodservCatGeneral.length === 0) {
            this.listar_catalogo_general_prod_serv();
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

  getRespuestaRegistroProveed() {
    this.proveedorRegistroSubscription = this.relInterna.mensajeProveedorEgresos$.subscribe(
      (mensaje: any) => {
        mensaje == "registro aprobado" ? this.revisa_emisor_proveedor_registrado() : null;
      }
    );
  }

  revisa_emisor_proveedor_registrado() {
    this._provServ.verificaExistProveedorByRFC(this.dataCFDI_emisor_Rfc).subscribe(
      response => {
        let translate_response = this.translate.instant(response.message);
        if (response.status == "success") {
          this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: translate_response });
          this.dataCFDI_emisor_Rfc_registrado = true;
          this.dataCFDI_emisor_new_registro = false;
          this.dataCFDI_emisor_token = response.token;
          this.prov_seleccionado_acepta_credito = response.aceptacredito;
          this.descarga_info_proveedor(response.token);
          this.listar_articulos_proveedor(response.token);
          this.listar_anticipos_proveedor(response.token);
          this.comprobarVinculacionArticulos();
        }
        if (response.status == "error") {
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: translate_response });
          this.dataCFDI_emisor_Rfc_registrado = false;
          this.dataCFDI_emisor_new_registro = true;
        }
      },
      error => {
        //console.log(error);
      }
    )
  }

  descarga_info_proveedor(token_cat_proveedores: any) {
    this.dataEmisor = [];
    console.log("token_cat_proveedores " + token_cat_proveedores);
    this._provServ.verDetalleProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.dataEmisor = response.proveedor;
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
          this.listar_articulos_proveedor(this.dataCFDI_emisor_token);
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
        mensaje == "servicio registrado" ? this.listar_articulos_proveedor(this.dataCFDI_emisor_token) : null;
        mensaje == "servicio registrado" ? this.listar_catalogo_general_prod_serv() : null;
      }
    );
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

  listar_anticipos_proveedor(token_cat_proveedores: any) {
    this._provServ.listarAnticiposDisponiblesProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response);
          this.aplica_anticipo_a_proveedor = "";
          this.proveedorAnticipoTotal = response.anticipo_total;
          this.proveedorAnticipoTotalFormat = response.anticipo_total_format;
          this.proveedorAnticipoRestanteFormat = response.anticipo_total_format;
        }
      }
    );
  }

  verVentanaEmisorProveedorRegistro() {
    this.dataCFDI_emisor_new_registro = true;
  }

  procesaCuerpoCFDI(xmlNode: any, childNodes: any) {
    this.fcontab_compra_modelo.fecha_contabilizacion = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';
    this.compra_fecha_contabilizacion = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';
    this.compra_fecha_vencimiento = xmlNode.getAttribute('Fecha') ? xmlNode.getAttribute('Fecha')?.split('T')[0] ?? '' : '';

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
              console.log("retenciones item");
              list_retenciones.push(row_imp);
              total_retenciones += parseFloat(row_imp.Importe);
            } else {
              list_traslados.push(row_imp);
              if (row_imp.TipoFactor !== "Exento") total_traslados += parseFloat(row_imp.Importe);
            }
            list_impuestos.push(row_imp);
          });
        });
      }

      console.log("total_retenciones: "+total_retenciones )
      if (total_retenciones == 0) {
        console.log("retenciones data importes");
        list_retenciones.forEach((calc_reten:any) => {
          total_retenciones += calc_reten.Importe;
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

        ValorUnitario: numeral(cChild.getAttribute("ValorUnitario") || 0).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Descuento: numeral(descuentoPartida).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Importe: numeral(parseFloat(cChild.getAttribute("Importe")) - parseFloat(descuentoPartida)).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        TotalRetenciones: numeral(total_retenciones).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        TotalTraslados: numeral(total_traslados).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
        Subtotal: numeral(cfdiSubtotal).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)),
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
        rfc_del_receptor: child.getAttribute('Rfc') || '---',
        uso_del_cfdi: child.getAttribute('UsoCFDI') || '---',
      };
      this.dataCFDI_receptor_UsoCFDI = child.getAttribute('UsoCFDI');
    });
  }

  obtenUUID(nodo_complemento:any) {
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

        this.dataCFDIComplemento_carta_porte_obj = {
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
    const setGral = new Set(this.prodservCatGeneral.map((g: any) => g.concepto?.trim().toLowerCase()));
    const setProv = new Set(this.productosVincLista.map((p: any) => p.concepto?.trim().toLowerCase()));

    // 2. Actualizar los conceptos existentes
    this.dataCFDI_conceptos = this.dataCFDI_conceptos.map((concepto: any) => {
      const desc = concepto.Descripcion?.trim().toLowerCase();
      return {
        ...concepto,
        articulo_homologado_comprobacion: setGral.has(desc) || setProv.has(desc)
      };
    });
  }

  abrirPaginaSAT() {
    const total = parseFloat(this.dataCFDI_comprobante_Total).toFixed(6);
    const urlSAT = `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${this.dataCFDI_complemento_UUID}&re=${this.dataCFDI_emisor_Rfc}&rr=${this.dataCFDI_receptor_Rfc}&tt=${total}&fe=${this.dataCFDI_complemento_SelloCFD.slice(-8)}`;
    // Características de la ventana
    const features = 'popup=true,width=1000,height=800,left=200,top=100,resizable=yes,scrollbars=yes';
    // "_blank" garantiza que se abre una ventana/pestaña nueva
    const nuevaVentana = window.open(urlSAT, '_blank', features);
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

  //procesamiento de información
  verConceptoXMLProductosYServicios(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_homologado_view = !row_cfdi_concept.articulo_homologado_view ? true : false;
  }

  verSeccionXMLRegistroProductosYServicios(row_cfdi_concept: any,seccion_registro:string) {
    row_cfdi_concept.articulo_homologado_ventana_registro = true;
    row_cfdi_concept.articulo_homologado_registro_tipo = seccion_registro;
  }

  selecionaArticuloCompra(row_cfdi_concept: any, token_articulo: any, identificador: any) {
    const valid_art = token_articulo != "" && identificador != "" && this.validator.filtroAlfaNumerico(identificador);
    row_cfdi_concept.articulo_guardar_tkn = valid_art ? token_articulo : '';
    row_cfdi_concept.articulo_guardar_identificador = valid_art ? identificador : '';
  }

  seleccionaArticuloGralCompra(row_cfdi_concept: any, token_articulo: any, identificador: any) {
    const valid_art = token_articulo != "" && identificador != "" && this.validator.filtroAlfaNumerico(identificador);

    if (identificador == 'Producto') {
      this._comprServ.verificaArticuloProd(this.dataCFDI_emisor_token, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            row_cfdi_concept.articulo_guardar_tkn = valid_art ? token_articulo : '';
            row_cfdi_concept.articulo_guardar_identificador = valid_art ? identificador : '';
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            this.functionValidaXmlContentArticulos(row_cfdi_concept);
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
    } else {
      this._comprServ.verificaArticuloServ(this.dataCFDI_emisor_token, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            row_cfdi_concept.articulo_guardar_tkn = valid_art ? token_articulo : '';
            row_cfdi_concept.articulo_guardar_identificador = valid_art ? identificador : '';
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            //event.checked = false;
            this.functionValidaXmlContentArticulos(row_cfdi_concept);
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
          this.dataCFDI_emisor_token,
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
              this.listar_catalogo_general_prod_serv();
              this.listar_articulos_proveedor(this.dataCFDI_emisor_token);
              this.expandRowsProductos = {};
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

  cancelarArticuloCompra(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_guardar_tkn = '';
    row_cfdi_concept.articulo_guardar_identificador = '';
    row_cfdi_concept.articulo_homologado_view = false;
    console.log(this.dataCFDI_conceptos);
  }

  guardaArticuloCompraXML(row_cfdi_concept: any, token_articulo: any, identificador: any, noIdentificacionXML: any) {
    let gen_art_cat = this.prodservCatGeneral.find((row: any) => row.token_articulo === token_articulo);

    console.log(identificador + " " + noIdentificacionXML);
    if (identificador == 'Producto') {
      this._comprServ.verificaArticuloProd(this.dataCFDI_emisor_token, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(row_cfdi_concept);
            row_cfdi_concept.clasificacion = "";

            row_cfdi_concept.articulo_homologado_serie_bool = response.bool_serie;
            row_cfdi_concept.articulo_homologado_lote_bool = response.bool_lote;
            row_cfdi_concept.articulo_homologado_pedimento_bool = response.bool_pedimento;
            row_cfdi_concept.articulo_homologado_token = token_articulo;
            row_cfdi_concept.articulo_homologado_identificador = response.identificador;
            row_cfdi_concept.articulo_homologado_logotipo = gen_art_cat.imagen;
            row_cfdi_concept.articulo_homologado_clasificacion = gen_art_cat.clasificacion;
            row_cfdi_concept.articulo_homologado_view = false;
            this.functionValidaXmlContentArticulos(row_cfdi_concept);
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            this.functionValidaXmlContentArticulos(row_cfdi_concept);
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
    } else {
      this._comprServ.verificaArticuloServ(this.dataCFDI_emisor_token, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            console.log("gen_art_cat.listado " + gen_art_cat.listado)
            console.log(row_cfdi_concept);
            row_cfdi_concept.clasificacion = "";
            row_cfdi_concept.articulo_homologado_token = token_articulo;
            row_cfdi_concept.articulo_homologado_identificador = response.identificador;
            row_cfdi_concept.articulo_homologado_logotipo = gen_art_cat.imagen;
            row_cfdi_concept.articulo_homologado_clasificacion = gen_art_cat.clasificacion;
            row_cfdi_concept.articulo_homologado_view = false;
            console.log(row_cfdi_concept);
            this.functionValidaXmlContentArticulos(row_cfdi_concept);
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            //event.checked = false;
            this.functionValidaXmlContentArticulos(row_cfdi_concept);
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
    console.log(this.dataCFDI_conceptos);
  }

  activaBotonRetencionesClass(row_cfdi_concept: any) {
    var clase = "";
    if (this.dataEmisor.length == 0 || row_cfdi_concept.articulo_homologado_identificador == '' || row_cfdi_concept.retenciones.length == 0) {
      clase = "bg-blue-600 disabled";
    } else {
      if (!row_cfdi_concept.retenciones_llenadas) {
        clase = "bg-blue-600";
      } else {
        clase = "text-bg-success rounded-3";
      }
    }
    return clase;
  }

  activaBotonRetencionesEnabled(row_cfdi_concept: any) {
    const valida_abre_tras = this.dataEmisor.length > 0 && row_cfdi_concept.articulo_homologado_identificador != '' || row_cfdi_concept.retenciones.length > 0;
    return valida_abre_tras;
  }

  activaBotonRetencionesIcono(row_cfdi_concept: any) {
    var clase = "";
    if (this.dataEmisor.length == 0 || row_cfdi_concept.retenciones.length == 0) {
      clase = "fa-ban";
    } else {
      if (!row_cfdi_concept.retenciones_llenadas) {
        clase = "fa-eye";
      } else {
        clase = "fa-check-double";
      }
    }
    return clase;
  }

  verConceptoXMLRetenciones(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_retenciones_modal = !row_cfdi_concept.articulo_retenciones_modal ? true : false;
    if (this.impRetencionesCatalogo.length === 0) {
      this.lista_impuestos_catalogo_retenciones();
    }
  }

  toggleRetencion(row: any, row_cfdi_concept: any) {
    console.log(this.dataCFDI_conceptos);

    const isExpanded = !!row_cfdi_concept.expandedRowsRetenciones[row.id];
    row_cfdi_concept.expandedRowsRetenciones = {};
    if (!isExpanded) {
      row_cfdi_concept.expandedRowsRetenciones[row.id] = true;
    }
  }

  rExpandRetencion(row: any, row_cfdi_concept: any): boolean {
    return !!row_cfdi_concept.expandedRowsRetenciones[row.id];
  }

  onRowExpandRet(event: any, row_cfdi_concept: any) {
    if (!row_cfdi_concept.expandedRowsRetenciones) row_cfdi_concept.expandedRowsRetenciones = {};
    row_cfdi_concept.expandedRowsRetenciones[event.data.id] = true;
  }

  onRowCollapseRet(event: any, row_cfdi_concept: any) {
    if (row_cfdi_concept.expandedRowsRetenciones) {
      delete row_cfdi_concept.expandedRowsRetenciones[event.data.id];
    }
  }

  selecciona_imp_retencion(row_cfdi_concept: any, posicion: any, event: any) {
    let imp = this.impRetencionesCatalogo.find((row: any) => row.token_catalogo_impuesto == event.value);
    const validacion = event.value != "" && row_cfdi_concept && typeof imp !== 'undefined';
    row_cfdi_concept.retenciones[posicion]["impuesto_relacionado"] = validacion ? imp.token_catalogo_impuesto : '';
    row_cfdi_concept.retenciones[posicion]["impuesto_relacion_nombre"] = validacion ? imp.folio_impuesto + " " + imp.abreviacion_impuesto : '';
    //validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dataCFDI_conceptos);
  }

  habilita_guarda_imp_retencion(row_cfdi_concept: any): Boolean {
    const retenciones_llenas = row_cfdi_concept.retenciones.filter((row: any) => row.impuesto_relacionado != "");
    return retenciones_llenas.length > 0;
  }

  imp_retencion_cancelar(row_cfdi_concept: any) {
    row_cfdi_concept.retenciones.forEach((ret: any) => {
      ret.impuesto_relacionado = "";
    });
    row_cfdi_concept.articulo_retenciones_modal = false;
    row_cfdi_concept.retenciones_llenadas = false;
  }

  guarda_imp_retencion(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_retenciones_modal = false;
    row_cfdi_concept.retenciones_llenadas = true;
  }

  activaBotonTrasladosClass(row_cfdi_concept: any) {
    var clase = "";
    if (this.dataEmisor.length == 0 || row_cfdi_concept.articulo_homologado_identificador == '' || row_cfdi_concept.traslados.length == 0) {
      clase = "bg-blue-600 disabled";
    } else {
      if (!row_cfdi_concept.traslados_llenados) {
        clase = "bg-blue-600";
      } else {
        clase = "text-bg-success rounded-3";
      }
    }
    return clase;
  }

  activaBotonTrasladosEnabled(row_cfdi_concept: any) {
    const valida_abre_tras = this.dataEmisor.length > 0 && row_cfdi_concept.articulo_homologado_identificador != '' || row_cfdi_concept.traslados.length > 0;
    return valida_abre_tras;
  }

  activaBotonTrasladosIcono(row_cfdi_concept: any) {
    var clase = "";
    if (this.dataEmisor.length == 0 || row_cfdi_concept.traslados.length == 0) {
      clase = "fa-ban";
    } else {
      if (!row_cfdi_concept.traslados_llenados) {
        clase = "fa-eye";
      } else {
        clase = "fa-check-double";
      }
    }
    return clase;
  }

  verConceptoXMLTraslados(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_traslados_modal = !row_cfdi_concept.articulo_traslados_modal ? true : false;
    if (this.impTrasladosCatalogo.length === 0) {
      this.lista_impuestos_catalogo_traslados();
    }
  }

  toggleTraslado(row: any, row_cfdi_concept: any) {
    console.log(this.dataCFDI_conceptos);
    const isExpanded = !!row_cfdi_concept.expandedRowsTraslados[row.id];
    row_cfdi_concept.expandedRowsTraslados = {};
    if (!isExpanded) {
      row_cfdi_concept.expandedRowsTraslados[row.id] = true;
    }
  }

  rExpandTraslado(row: any, row_cfdi_concept: any): boolean {
    return !!row_cfdi_concept.expandedRowsTraslados[row.id];
  }

  selecciona_imp_traslado(row_cfdi_concept: any, posicion: any, event: any) {
    let imp = this.impTrasladosCatalogo.find((row: any) => row.token_catalogo_impuesto == event.value);
    const validacion = event.value != "" && row_cfdi_concept && typeof imp !== 'undefined';
    row_cfdi_concept.traslados[posicion]["impuesto_relacionado"] = validacion ? event.value : '';
    row_cfdi_concept.traslados[posicion]["impuesto_relacion_nombre"] = validacion ? imp.folio_impuesto + " " + imp.abreviacion_impuesto : '';
    //validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.dataCFDI_conceptos);
  }

  habilita_guarda_imp_traslado(row_cfdi_concept: any): Boolean {
    const traslados_llenos = row_cfdi_concept.traslados.filter((row: any) => row.impuesto_relacionado != "");
    return traslados_llenos.length > 0;
  }

  imp_traslado_cancelar(row_cfdi_concept: any) {
    row_cfdi_concept.traslados.forEach((ret: any) => {
      ret.impuesto_relacionado = "";
    });
    row_cfdi_concept.articulo_traslados_modal = false;
    row_cfdi_concept.traslados_llenados = false;
  }

  guarda_imp_traslado(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_traslados_modal = false;
    row_cfdi_concept.traslados_llenados = true;
  }

  verConceptoXMLUsoActivo(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_homologado_view_uso = !row_cfdi_concept.articulo_homologado_view_uso ? true : false;
    row_cfdi_concept.temp_articulo_uso = row_cfdi_concept.articulo_homologado_uso;
    row_cfdi_concept.temp_articulo_efecto_fiscal = row_cfdi_concept.articulo_homologado_efecto_fiscal;
  }

  selectUsoArticuloXml(event: any, row_cfdi_concept: any) {
    console.log(event.value);
    row_cfdi_concept.temp_articulo_uso = event.value != '' ? event.value : '';

    if (event.value === 'activo_fijo' && this.listActivosFijos.length === 0) {
      this.recargar_lista_activos();
    } else if (event.value === 'activo_diferido' && this.listActivosIntangibles.length === 0) {
      this.listar_activos_intang_true();
    }
  }

  selectEfectoFiscalUsoArticulo(event: any, row_cfdi_concept: any) {
    row_cfdi_concept.temp_articulo_efecto_fiscal = event.value != '' ? event.value : '';
  }

  artUsoActivoCancelar(row_cfdi_concept: any) {
    row_cfdi_concept.temp_articulo_uso = "";
    row_cfdi_concept.temp_articulo_efecto_fiscal = "";

    row_cfdi_concept.articulo_homologado_uso = "";
    row_cfdi_concept.articulo_homologado_efecto_fiscal = "";
    row_cfdi_concept.articulo_homologado_view_uso = false;
  }

  guardartUsoActivo(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_homologado_uso = row_cfdi_concept.temp_articulo_uso;
    row_cfdi_concept.articulo_homologado_efecto_fiscal = row_cfdi_concept.temp_articulo_efecto_fiscal;

    row_cfdi_concept.temp_articulo_uso = "";
    row_cfdi_concept.temp_articulo_efecto_fiscal = "";
    row_cfdi_concept.articulo_homologado_view_uso = false;
    this.functionValidaXmlContentArticulos(row_cfdi_concept);
  }

  verConceptoXMLActivosLista(row_cfdi_concept: any) {
    console.log(row_cfdi_concept.articulo_homologado_identificador);
    row_cfdi_concept.articulo_homologado_view_activos = !row_cfdi_concept.articulo_homologado_view_activos ? true : false;
  }

  //fijos
  selectActivoXmlFijo(row_cfdi_concept: any, token_activo: any) {
    if (row_cfdi_concept.temp_activo_fijo === token_activo) {
      row_cfdi_concept.temp_activo_fijo = '';
      return;
    }

    row_cfdi_concept.temp_activo_fijo = token_activo;

    this.expandRowsActivoFijo = { [token_activo]: true };
    console.log(row_cfdi_concept);
    if (!row_cfdi_concept) return;
  }

  artActivoFijoValidar(row_cfdi_concept: any): Boolean {
    return row_cfdi_concept.temp_activo_fijo != '';
  }

  artActivoFijoCancelar(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_homologado_activoFijo = "";
    row_cfdi_concept.temp_activo_fijo = "";
    row_cfdi_concept.articulo_homologado_view_activos = false;
  }

  guardartActivoFijo(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_homologado_activoFijo = row_cfdi_concept.articulo_homologado_uso == 'activo_fijo' ? row_cfdi_concept.temp_activo_fijo : '';
    row_cfdi_concept.temp_activo_fijo = "";
    row_cfdi_concept.articulo_homologado_view_activos = false;
    this.functionValidaXmlContentArticulos(row_cfdi_concept);
  }

  //diferidos
  selectActivoXmlDiferido(event:any,row_cfdi_concept: any, token_activo: any) {
    if (row_cfdi_concept.temp_activo_diferido === token_activo) {
      row_cfdi_concept.temp_activo_diferido = '';
      row_cfdi_concept.temp_activo_diferido_foliado = [];
      return;
    }

    row_cfdi_concept.temp_activo_diferido = token_activo;

    this.expandRowsActivoDiferido = { [token_activo]: true };

    console.log(row_cfdi_concept);

    if (!row_cfdi_concept) return;
    
    for (let i = 0; i < parseInt(row_cfdi_concept.Cantidad); i++) {
      row_cfdi_concept.temp_activo_diferido_foliado.push({
        activo_lista: i + 1,

        id_select_cont: 'amort_cont_periodo'+(i + 1),
        amort_contable_periodo: '',
        amort_contable_tiempo: '',
        amort_contable_fecha_apartir: '', 
        amort_contable_observaciones: '',
        
        id_select_fisc: 'amort_fisc_periodo'+(i + 1),
        amort_fiscal_periodo: '',
        amort_fiscal_tiempo: '',
        amort_fiscal_fecha_apartir: '',
        amort_fiscal_observaciones: '',
      });
    }
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  isActivoSeleccionado(conceptList: any, filaActual: any): boolean {
    const tokenSeleccionado = conceptList.articulo_homologado_activoDiferido != filaActual.token_act_intang && conceptList.temp_activo_diferido != filaActual.token_act_intang;
    return tokenSeleccionado;
  }

  keyupACTDFoliadoAmortContablePeriodo(clave:any, afoli: any, row_cfdi_concept: any) {
    var amort_cont_periodo = document.getElementById(afoli.id_select_cont);
    let dcperiod = this.amortizacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    afoli.amort_contable_periodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(amort_cont_periodo) : this.validator.errorSelectBrowser(amort_cont_periodo);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortContableTiempo(event: any, afoli: any, row_cfdi_concept: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && afoli;
    afoli.amort_contable_tiempo = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortContableFechaAPartir(event: any, afoli: any, row_cfdi_concept: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && afoli;
    afoli.amort_contable_fecha_apartir = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortContableObservaciones(event: any, afoli: any, row_cfdi_concept: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && afoli;
    afoli.amort_contable_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalPeriodo(clave:any, afoli: any, row_cfdi_concept: any) {
    var amort_fisc_periodo = document.getElementById(afoli.id_select_fisc);
    let dcperiod = this.amortizacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    afoli.amort_fiscal_periodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(amort_fisc_periodo) : this.validator.errorSelectBrowser(amort_fisc_periodo);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalTiempo(event: any, afoli: any, row_cfdi_concept: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && afoli;
    afoli.amort_fiscal_tiempo = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalFechaAPartir(event: any, afoli: any, row_cfdi_concept: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && afoli;
    afoli.amort_fiscal_fecha_apartir = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalObservaciones(event: any, afoli: any, row_cfdi_concept: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && afoli;
    afoli.amort_fiscal_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_cfdi_concept.temp_activo_diferido_foliado);
  }

  artActivoDiferidoValidar(row_cfdi_concept: any): Boolean {
    const actfol = row_cfdi_concept.temp_activo_diferido_foliado.filter((fol: any) => 
      fol.amort_contable_periodo != '' &&
      fol.amort_contable_tiempo != '' &&
      fol.amort_contable_fecha_apartir != '' &&
      fol.amort_contable_observaciones != '' &&
      fol.amort_fiscal_periodo != '' &&
      fol.amort_fiscal_tiempo != '' &&
      fol.amort_fiscal_fecha_apartir != '' &&
      fol.amort_fiscal_observaciones != ''
    );
    return row_cfdi_concept.temp_activo_diferido != '' && row_cfdi_concept.temp_activo_diferido_foliado.length == row_cfdi_concept.Cantidad && actfol.length == Number(row_cfdi_concept.Cantidad);
  }

  artActivoDiferidoCancelar(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_homologado_activoDiferido = "";
    row_cfdi_concept.temp_activo_diferido = "";
    row_cfdi_concept.articulo_homologado_view_activos = false;
  }

  guardartActivoDiferido(row_cfdi_concept: any) {
    row_cfdi_concept.articulo_homologado_activoDiferido = row_cfdi_concept.articulo_homologado_uso == 'activo_diferido' ? row_cfdi_concept.temp_activo_diferido : '';
    if (row_cfdi_concept.articulo_homologado_uso == 'activo_diferido') {
      row_cfdi_concept.articulo_homologado_activo_diferido_foliado = [...row_cfdi_concept.temp_activo_diferido_foliado];
    }
    row_cfdi_concept.temp_activo_diferido = "";
    row_cfdi_concept.articulo_homologado_view_activos = false;
    this.functionValidaXmlContentArticulos(row_cfdi_concept);
  }

  selectProrrateoCompra(row_cfdi_concept: any, event: any) {
    row_cfdi_concept.articulo_homologado_prorratea = event.checked;
  }

  validarGeneralArticulo(concepto: any) {
    if (!concepto.articulo_homologado_clasificacion || !concepto.Importe || !concepto.articulo_homologado_token || !concepto.articulo_homologado_identificador) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el concepto.' });
      return false;
    }

    if (concepto.retenciones && concepto.retenciones.length > 0) {
      const retencionesIncompletas = concepto.retenciones.some((r: any) => !r.impuesto_relacionado);
      if (retencionesIncompletas && !concepto.retenciones_llenadas) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en impuestos retenidos.' });
        return false;
      }
    }

    if (concepto.traslados && concepto.traslados.length > 0) {
      const trasladosIncompletos = concepto.traslados.some((t: any) => !t.impuesto_relacionado);
      if (trasladosIncompletos && !concepto.traslados_llenados) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en impuestos trasladados.' });
        return false;
      }
    }

    const identificadoresValidos = ['Producto', 'Servicio', 'ActivoFijo', 'ActivoDiferido'];

    if (identificadoresValidos.includes(concepto.articulo_homologado_identificador)) {
      if (!concepto.articulo_homologado_uso) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el uso del articulo.' });
        return false;
      }

      if (concepto.articulo_homologado_uso === 'activo_fijo' && !concepto.articulo_homologado_activoFijo) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de activo fijo.' });
        return false;
      }

      if (concepto.articulo_homologado_uso === 'activo_diferido' && !concepto.articulo_homologado_activoDiferido) {
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de activo intangible.' });
        return false;
      }
      return true;
    } else {
      //throw new Error('Identificador de artículo no reconocido.');
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Identificador de artículo no reconocido.' });
      return false;
    }
  }

  functionValidaXmlContentArticulos(row_cfdi_concept: any) {
    try {
      var result_validacion: any = this.validarGeneralArticulo(row_cfdi_concept);
      console.log(result_validacion);
      this.selectvalidatexmlArticulos = result_validacion;
      row_cfdi_concept.activa_desglose = result_validacion;
    } catch (error: any) {
      this.selectvalidatexmlArticulos = false;
      //console.error('Error en la validación de conceptos:', error.message);
    }
  }

  desicionCreditoContadoCompra(decision: any) {
    this.compra_contado_credito = decision;
    this.compra_fecha_vencimiento = decision == 'contado' && this.resultXml == 'validoXml' ? this.compra_fecha_contabilizacion : '';
  }

  select_fecha_vencimiento(event: any): void {
    const validacion_xml = event.value != "" && this.validator.filtroFecha(event.value);
    this.compra_fecha_vencimiento = validacion_xml ? event.value : '';
    validacion_xml ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  recibeProdAntesDespues(event: any) {
    //¿Recibes el producto o servicio antes o despues del pago?
    // si es TRUE genera orden de pago, si es FALSE no
    this.classRecibeArtPago = event.checked;
  }
  
  //Punto de entrega o recepcion
  getRespuestaRegistroEstablecimiento(){
    this.relInterna.mensajeInsertEstablecimiento$.subscribe(
      (mensaje:any) => {
        mensaje == "establecimiento_registrado" ? this.recargaEstablecimientos() : null;
      }
    );
  }

  tipoDireccionEntregas(event: any) {
    switch (event.value) {
      case 'proveedor':
        this.tipoLugarRecepcion = 'proveedor';
        break;
      case 'establecimiento':
        this.tipoLugarRecepcion = 'establecimiento';
        if (this.arrayEstablecCompras.length === 0) {
          this.recargaEstablecimientos();
        }
        break;
      case 'noAplica':
        this.tipoLugarRecepcion = 'noAplica';
        break;
      default:
        this.tipoLugarRecepcion = '';
        break;
    }
  }

  select_fecha_tentativa_salida(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.compra_fecha_tentativa_salida = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectCompraLugarSalida(token_direccion: string) {
    var lugar_salida_compra = document.getElementById("lugar_salida_compra");
    const validacion = token_direccion != "";
    this.tknLugarSalida = validacion ? token_direccion : "";
    validacion ? this.validator.correctoSelectBrowser(lugar_salida_compra) : this.validator.errorSelectBrowser(lugar_salida_compra);
  }

  select_fecha_tentativa_recepcion(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.compra_fecha_tentativa_recepcion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectCompraLugarRecepcion(token_establecimiento: string) {
    var lugar_recepcion_compra = document.getElementById("lugar_recepcion_compra");
    const validacion = token_establecimiento != "";
    this.tknLugarRecepcion = validacion ? token_establecimiento : "";
    validacion ? this.validator.correctoSelectBrowser(lugar_recepcion_compra) : this.validator.errorSelectBrowser(lugar_recepcion_compra);
  }

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

  calcula_anticipo_restante() {
    this.proveedorAnticipoRestanteFormat = "$" + numeral(this.proveedorAnticipoTotal - this.proveedorAnticipoaplicado).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) + " " + this.dataCFDI_comprobante_Moneda;
  }

  selectAnticipo(uuid_anticipo: any) {
    //this.anticipo_uuid = uuid_anticipo != "" ? uuid_anticipo : "";
    uuid_anticipo == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el concepto.' }) : null;
  }

  keyupObservacionCompra(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.compra_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedCompra(files: NgxFileDropEntry[]) {
    // 1. Limpiamos estados para recibir el nuevo set de archivos
    this.anexosCompraFiles = files;
    this.anexosCompraNames = [];
    this.anexosCompraDocs = [];

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
            this.anexosCompraNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            this.anexosCompraDocs.push(file);

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
            const index = this.anexosCompraFiles.findIndex(f => f.relativePath === droppedFile.relativePath);
            if (index > -1) this.anexosCompraFiles.splice(index, 1);
          }
        });
      }
    }
  }

  public fileOverCompra(event: any) {
    console.log(event);
  }

  public fileLeaveCompra(event: any) {
    console.log(event);
  }

  deleteAnexosCompra(posicion: number) {
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
        this.anexosCompraFiles.splice(posicion, 1);
        this.anexosCompraNames.splice(posicion, 1);
        this.anexosCompraDocs.splice(posicion, 1);

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

  get habilitaBtnRegistro(): Boolean {
    //console.log(this.compra_contado_credito);
    //console.log(this.compra_fecha_vencimiento);
    const valida_cont_cred = this.compra_contado_credito != "" && this.compra_fecha_vencimiento != "";
    const valida_lug_recep = this.tipoLugarRecepcion != '' && (this.tipoLugarRecepcion == 'noAplica' || (this.tipoLugarRecepcion != 'noAplica' && this.tknLugarRecepcion != ''));
    const validacion = this.imagenEvidenciaXml && this.dataCFDI_emisor_token != '' && this.imagenEvidenciaVerificacion && this.selectvalidatexmlArticulos && valida_cont_cred && valida_lug_recep;
    return validacion;
  }

  validateRegistraCompraCFDI(modalidad: any) {
    var validateXmlCompras: any = '';
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
        this.cargandoCompras = 'cargando';
        const valida_cont_cred = this.compra_contado_credito != '' && (this.compra_contado_credito == 'contado' || (this.compra_contado_credito == 'credito' && this.compra_fecha_vencimiento != ""));

        const valida_recep_prov = this.compra_fecha_tentativa_salida != '' && this.validator.filtroFecha(this.compra_fecha_tentativa_salida) && this.tknLugarSalida != '' && 
          this.validator.filtroFecha(this.compra_fecha_tentativa_recepcion) && this.tknLugarRecepcion != '';
        const valida_recep_estab = this.compra_fecha_tentativa_salida != '' && this.validator.filtroFecha(this.compra_fecha_tentativa_salida) && 
          this.validator.filtroFecha(this.compra_fecha_tentativa_recepcion) && this.tknLugarRecepcion != '';
        const valida_recep_eaplicada = (this.tipoLugarRecepcion == 'proveedor' && valida_recep_prov) || (this.tipoLugarRecepcion == 'establecimiento' && valida_recep_estab);
        const valida_recepcion = this.tipoLugarRecepcion != '' && (this.tipoLugarRecepcion == 'noAplica' || valida_recep_eaplicada);
        
        if (this.dataCFDI_emisor_token != '' && this.dataCFDI_conceptos.length != 0 && valida_cont_cred && valida_recepcion) {
          const validaFacturas = this.imagenEvidenciaXml && this.imagenEvidenciaVerificacion;
          const validaPagoFormaMetodo = this.dataCFDI_comprobante_formaPago != '' && this.dataCFDI_comprobante_MetodoPago != '';
          validateXmlCompras = validaFacturas && validaPagoFormaMetodo && this.dataCFDI_comprobante_Moneda != '' && this.dataCFDI_receptor_UsoCFDI != '' ? 'true' : 'false';
          this.dataCFDI_conceptos.forEach((con_xml:any) => {
            con_xml.temp_activo_diferido_foliado = [];
          });
          //? this.registrarCompraCFDI() : 
          if (validateXmlCompras == 'true') {
            switch (modalidad) {
              case 'pagar':
                this.registrarCompraCFDI_Pagar();
                break;
              case 'listado':
                this.registrarCompraCFDI_returnList();
                break;
              case 'registrando':
                this.registrarCompraCFDI();
                break;

              default:
                break;
            }
          } else {
            this.cargandoCompras = 'fail';
          }

          !this.imagenEvidenciaXml ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe cargar la factura en formato xml correspondiente a esta compra' }) : null;
          this.dataCFDI_comprobante_formaPago == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Forma de pago no existe para esta compra' }) : null;
          this.dataCFDI_comprobante_MetodoPago == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Método de pago no existe para esta compra' }) : null;
          this.dataCFDI_comprobante_Moneda == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'No hay moneda seleccionada para esta compra' }) : null;
          this.dataCFDI_receptor_UsoCFDI == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Uso de cfdi no existe para esta compra' }) : null;
          !this.imagenEvidenciaVerificacion ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe cargar el documento de verificación de comprobante fiscal degital correspondiente a esta compra' }) : null;
        } else {
          this.dataCFDI_emisor_token == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar un proveedor para realizar esta compra' }) : null;
          this.dataCFDI_conceptos.length == 0 ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar articulos y/o servicios para comprar' }) : null;
          this.tipoLugarRecepcion == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar una opción en el bloque "PUNTO DE ENTREGA O RECEPCION' }) : null;
          this.tknLugarRecepcion == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar un lugar donde se recibiran los articulos seleccionados para esta compra' }) : null;
        }
      }
    })
  }

  registrarCompraCFDI_Pagar() {
    this._comprServ.registraCompraPorCFDI(
      this.compra_fecha_contabilizacion,
      this.compra_fecha_vencimiento,
      this.dataCFDI_comprobante_obj,
      this.compra_total,
      this.dataCFDIRelacionados_obj,
      this.dataCFDIEmisor_obj,
      this.dataCFDI_emisor_token,
      this.dataCFDIReceptor_obj,
      this.dataCFDI_conceptos,
      this.dataCFDI_impuestos_retenidos_lista,
      this.dataCFDI_impuestos_trasladados_lista,
      this.dataCFDIComplemento_obj,
      this.dataCFDIComplemento_carta_porte_obj,
      this.compra_contado_credito,
      /*this.anticipo_uuid,*/
      this.proveedorAnticipoaplicado,
      this.classRecibeArtPago,
      this.tipoLugarRecepcion,

      this.compra_fecha_tentativa_salida,
      this.tknLugarSalida,
      this.compra_fecha_tentativa_recepcion,
      this.tknLugarRecepcion,

      this.imagenEvidenciaXml,
      this.imagenEvidenciaPdf,
      this.imagenEvidenciaVerificacion,
      this.compra_observaciones,
      this.anexosCompraDocs,
      "pagar",
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
          //location.reload();
          this.compra_proceso_pago = true;
          this.relInterna.mensajeComprasPagarRegistro("nuevo_registro", response.token_compras, response.token_proveedor, response.token_ordenPago);
        }
        if (response.status == 'error') {
          this.cargandoCompras = 'fail';
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: translate_response,
            showConfirmButton: false,
            timer: 3000
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getRespuestaRegistroPago() {
    this.pagoSubscription = this.relInterna.mensajePagoRealizadoCompra$.subscribe(
      (mensaje: any) => {
        if (mensaje == "pago_realizado") {
          this.compra_proceso_pago = false;
          this.relInterna.mensajeComprasRegistro("nuevo_registro");
        }
      }
    );
  }

  registrarCompraCFDI_returnList() {
    this._comprServ.registraCompraPorCFDI(
      this.compra_fecha_contabilizacion,
      this.compra_fecha_vencimiento,
      this.dataCFDI_comprobante_obj,
      this.compra_total,
      this.dataCFDIRelacionados_obj,
      this.dataCFDIEmisor_obj,
      this.dataCFDI_emisor_token,
      this.dataCFDIReceptor_obj,
      this.dataCFDI_conceptos,
      this.dataCFDI_impuestos_retenidos_lista,
      this.dataCFDI_impuestos_trasladados_lista,
      this.dataCFDIComplemento_obj,
      this.dataCFDIComplemento_carta_porte_obj,
      this.compra_contado_credito,
      /*this.anticipo_uuid,*/
      this.proveedorAnticipoaplicado,
      this.classRecibeArtPago,
      this.tipoLugarRecepcion,

      this.compra_fecha_tentativa_salida,
      this.tknLugarSalida,
      this.compra_fecha_tentativa_recepcion,
      this.tknLugarRecepcion,
      
      this.imagenEvidenciaXml,
      this.imagenEvidenciaPdf,
      this.imagenEvidenciaVerificacion,
      this.compra_observaciones,
      this.anexosCompraDocs,
      "no_pagar"
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
          //location.reload();
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

  registrarCompraCFDI() {
    this._comprServ.registraCompraPorCFDI(
      this.compra_fecha_contabilizacion,
      this.compra_fecha_vencimiento,
      this.dataCFDI_comprobante_obj,
      this.compra_total,
      this.dataCFDIRelacionados_obj,
      this.dataCFDIEmisor_obj,
      this.dataCFDI_emisor_token,
      this.dataCFDIReceptor_obj,
      this.dataCFDI_conceptos,
      this.dataCFDI_impuestos_retenidos_lista,
      this.dataCFDI_impuestos_trasladados_lista,
      this.dataCFDIComplemento_obj,
      this.dataCFDIComplemento_carta_porte_obj,
      this.compra_contado_credito,
      /*this.anticipo_uuid,*/
      this.proveedorAnticipoaplicado,
      this.classRecibeArtPago,
      this.tipoLugarRecepcion,
    
      this.compra_fecha_tentativa_salida,
      this.tknLugarSalida,
      this.compra_fecha_tentativa_recepcion,
      this.tknLugarRecepcion,

      this.imagenEvidenciaXml,
      this.imagenEvidenciaPdf,
      this.imagenEvidenciaVerificacion,
      this.compra_observaciones,
      this.anexosCompraDocs,
      "no_pagar"
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
          this.limpia_sigue_registrando();
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

  limpia_sigue_registrando() {
    this.validator.limpiaInputRow(document.getElementById("fechaContabilizacionCompra"));
    this.validator.limpiaInputRow(document.getElementById("facturaxml"));
    this.validator.limpiaInputRow(document.getElementById("facturapdf"));
    this.validator.limpiaInputRow(document.getElementById("comprobantePdf"));
    this.validator.limpiaInputRow(document.getElementById("fechaVencimientoCompra"));
    this.compra_fecha_contabilizacion = '';
    this.compra_fecha_vencimiento = '';
    this.compra_fecha_tentativa_recepcion = '';
    this.ver_compras_folio();
    this.limpiaXMLData();
    this.imagenEvidenciaXml = null;
    this.imagenEvidenciaPdf = null;
    this.imagenEvidenciaVerificacion = null;

    //proceso de compra
    this.compra_contado_credito = 'contado';

    //recepcion de articulo antes o despues de pago
    this.classRecibeArtPago = false;

    //lugar de entrega
    this.tipoLugarRecepcion = '';
    this.compra_fecha_tentativa_salida = '';
    this.tknLugarSalida = '';
    this.compra_fecha_tentativa_recepcion = '';
    this.tknLugarRecepcion = '';

    //registro de compra
    this.cargandoCompras = '';
    /*this.anticipo_uuid = '';*/
    this.proveedorAnticipoaplicado = 0;

    this.compra_observaciones = '';
    this.validator.limpiaTextarea(document.getElementById("compraCFDI_large_observ"));
    this.anexosCompraFiles = [];
    this.anexosCompraDocs = [];
    this.anexosCompraNames = [];
  }

  ngOnDestroy(): void {
    if (this.pagoSubscription) {
      this.pagoSubscription.unsubscribe();
    }
    if (this.proveedorRegistroSubscription) {
      this.proveedorRegistroSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
