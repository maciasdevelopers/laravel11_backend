import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { global } from '../../../../../../servicios/global_ssic';
import { RequisicionesService } from '../../../../../../servicios/ssic/requisiciones.service';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { UniMedServService } from '../../../../../../servicios/uni-med-serv.service';
import { LotesServService } from '../../../../../../servicios/ssic/lotes-serv.service';
import { PedimentosService } from '../../../../../../servicios/ssic/pedimentos-serv.service';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { ActFijosService } from '../../../../../../servicios/ssic/act-fijos.service';
import { ActIntangiblesService } from '../../../../../../servicios/ssic/act-intangibles.service';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';

import { Html5QrcodeScanner, Html5QrcodeScannerState } from "html5-qrcode";
import { Html5Qrcode } from "html5-qrcode";
import numeral from 'numeral';
import { takeUntil, tap } from 'rxjs/operators';
import { SeriesService } from '../../../../../../servicios/ssic/series-service.service';
import { MessageService } from 'primeng/api';
import { ImpuestosServService } from '../../../../../../servicios/ssic/impuestos-serv.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { comprasModeloFContabilizacion } from '../../../../../../modelos/compras/compra/comprasModeloFContabilizacion';
import { loteAngularModelo } from '../../../../../../modelos/loteAngularModelo';
import { pedimentoAngularModelo } from '../../../../../../modelos/pedimentoAngularModelo';
import { activoFijoAngularModelo } from '../../../../../../modelos/activoFijoAngularModelo';
import { activoIntangibleAngularModelo } from '../../../../../../modelos/activoIntangibleAngularModelo';
import { NgForm } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';
import { SessionContextService } from '../../../../../../servicios/session-context';
import { Subject } from 'rxjs';

@Component({
  selector: 'app_compras_registro_productos',
  templateUrl: './registro_por_productos.component.html',
  standalone: false,
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
    '../../../../../../styles/contraccion.css',
    '../../../../../../styles/totales.css',
    '../../../egresos.css',
    './registro_por_productos.component.css'
  ],
  providers: [RequisicionesService, SentinelArkManager]
})
export class RegistroCompraProductosComponent implements OnInit, OnDestroy {
  //generales
  public usuario: Usuarios;
  public identidad: any;
  public compra_by_prods: boolean = false;
  public mostrarSelectsCompra: boolean = true;
  public priv_eegr_comp_cot: boolean = false;
  public priv_eegr_comp_dir: boolean = false;
  public priv_eegr_compras: boolean = false;
  public priv_eegr_perm_consulta: boolean = false;
  public priv_eegr_perm_crear: boolean = false;

  public dataCFDI_comprobante_Moneda: string = '';
  public dataCFDI_comprobante_MoneDecimales: number = 0;
  public dataCFDI_comprobante_TipoCambio: string = '';

  //monedas
  catalogo_monedas_api: any = [];
  catalogo_monedas_filtro_busqueda: any;
  unidadMedidaCatalogoInventario: any = [];

  //establecimientos
  arrayEstablecCompras: any = [];
  public compra_establecimientos_registro_modal: boolean = false;

  //retenciones
  searchRetencionesTrue: string = "";
  impRetencionesCatalogo: any = [];
  indicadorImpRetenciones:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoImpRetenciones: Date[] | undefined;

  //traslados
  searchTrasladosTrue: string = "";
  impTrasladosCatalogo: any = [];
  indicadorImpTraslados:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoImpTraslados: Date[] | undefined;

  //fecha de registro
  public compra_fecha_registro: string = "";
  //fecha de vencimiento
  public compra_fecha_vencimiento: string = "";
  //folio de registro
  public compra_folio_registro: string = "";
  //modelos
  public fcontab_compra_modelo: comprasModeloFContabilizacion;
  //proveedor
  lista_proveedores: any = [];
  proveedorSeleccionado: any = [];
  public aplica_anticipo_a_proveedor: string = "No";
  proveedorAnticipoTotal: number = 0;
  proveedorAnticipoTotalFormat: string = "";
  proveedorAnticipoaplicado: number = 0;
  proveedorAnticipoRestanteFormat: string = "";

  public provToken: string = "";
  public prov_seleccionado_acepta_credito: boolean = false;
  public compra_contado_credito: string = 'contado';
  public selectvalidateArticulosVinc: boolean = false;
  //public anticipo_uuid: string = '';

  //Catalogo de productos y servicios
  productosVincLista: any = [];
  prodservCatGeneral: any = [];
  expandRowsProductos: { [s: string]: boolean } = {};
  dataCFDIBuscarRetenciones: any = [];
  dataCFDIBuscarTraslados: any = [];
  dataCFDI_conceptos: any = [];
  dataCFDIBuscarConcepto: any = [];
  public selectvalidatexmlArticulos: boolean = false;
  public compra_subtotal: string = '0.00';
  public compra_descuento: string = '0.00';
  public compra_retenciones: string = '0.00';
  public compra_traslados: string = '0.00';
  public compra_total: string = '0.00';
  public articulos_nuevo_registro: any = []; // asegúrate de que esto esté inicializado como arreglo vacío

  //series
  seriesCatalogoTrue: any = [];
  public token_serie: string = "";
  public numero_serie: string = "";
  public serie_nueva: string = "";
  public serie_uso_unico: boolean = false;
  public serie_comentarios: string = "";

  //lotes
  listLotesTrue: any = [];
  public token_lote: string = "";
  public numero_lote: string = "";
  public modelLote: loteAngularModelo;
  public imagenAltaPdfevidencialote: any;
  @ViewChild('formRegistroLote') formLoteReg!: NgForm;

  //pedimentos
  listaPedimentosTrue: any = [];
  public token_padnal: string = "";
  public numero_padnal: string = "";
  imagenAltaPdfevidenciapedim: any;
  public modelPedim: pedimentoAngularModelo;
  @ViewChild('formRegistroPedAduanal') formPedAduanalReg!: NgForm;
  //activos
  amortizacion_periodos:any = [];
  //public articulo_uso_interno: string = "";
  //public articulo_uso_fiscal: string = "";
  //activos
  listActivosFijos: any = [];
  rangoPeriodoFijosActivos: Date[] | undefined;
  indicadorFijosActivos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  expandRowsActivoFijo: { [s: string]: boolean } = {};

  listActivosIntangibles: any = [];
  rangoPeriodoDiferidosActivos: Date[] | undefined;
  indicadorDiferidosActivos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  expandRowsActivoDiferido: { [s: string]: boolean } = {};

  //recepcion de articulo antes o despues de pago
  public classRecibeArtPago: boolean = false;

  //lugar de entrega
  public tipoLugarRecepcion: string = '';
  public compra_fecha_tentativa_salida: string = '';
  public tknLugarSalida: string = '';
  public compra_fecha_tentativa_recepcion: string = '';
  public tknLugarRecepcion: string = '';

  public aplica_recepcion_facturas: string = "";

  //extras
  public compra_observaciones: string = '';
  public anexosCompraFiles: NgxFileDropEntry[] = [];
  public anexosCompraDocs: any[] = [];
  public anexosCompraNames: any = [];

  //registro de compra
  public cargandoCompras: string = '';
  public compra_proceso_pago: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private sentinela: SentinelArkManager,
    private validator: ValidatorServService,
    private _actFijo: ActFijosService,
    private _intanServ: ActIntangiblesService,
    private _medidasCat: UniMedServService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private _comprServ: ComprasServService,
    private sessionContext: SessionContextService,
    private loteServ: LotesServService,
    private pedimServ: PedimentosService,
    private translate: TranslateService,
    private serieServ: SeriesService,
    private relInterna: ComunicacionInternaService,
    private _catImp: ImpuestosServService,
    private estabServ: EstablecimientosService,
    private primeAlerts: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
    this.fcontab_compra_modelo = new comprasModeloFContabilizacion('', false);
    this.modelLote = new loteAngularModelo('', '', '', '');
    this.modelPedim = new pedimentoAngularModelo('', '', '', '', '');
  }

  ngOnInit(): void {
    this.amortizacion_periodos = [
      {clave:"86400", valor:"Por día"},//clave:"periodDay",
      {clave:"604800", valor:"Por semana"},//clave:"periodWeek",
      {clave:"2629743", valor:"Por mes"},//clave:"periodMonth",
      {clave:"31556926",valor:"Por año"}//clave:"periodYear",
    ];
    this.getRespuestaRegistroPago();
    this.getRespuestaRegistroProveed();
    this.getRespuestaProveedorServicios();
    this.ver_compras_folio();
    this.listar_catalogo_general_prod_serv();
    this.lista_series_catalogo_true();
    this.listaLotesTrue();
    this.pedimentosTrueList();
    this.ver_activos_fijos_true('hoy');
    this.ver_activos_intang_true('hoy');
    this.function_permisos();
    this.proveedoresLista();
    this.monedasCatalogoApi();
    this.recargaEstablecimientos();
    this.lista_impuestos_catalogo_retenciones();
    this.lista_impuestos_catalogo_traslados();
    this.recreaPrincipalLineRegistro();
    this.catalogoUnidadDeMedidaApi();
    this.getRespuestaRegistroEstablecimiento();
    this.getRespuestaRegistroINVENT();

    this.compra_by_prods = true;
    this.dataCFDIBuscarRetenciones = ['token_catalogo_impuesto', 'folio_impuesto', 'abreviacion_impuesto', 'concepto_impuesto', 'modulo', 'nivel_aplicacion', 'catalogo_sat',
      'tipo_impuesto', 'exento', 'calculo', 'txtimporte', 'tipo_cambio', 'monedas_codigo', 'monedas_moneda', 'base_aplicable', 'desglose', 'gl_por_pagarcobrar', 'gl_pagada_o_cobrada', 'observaciones'];

    this.dataCFDIBuscarTraslados = ['token_catalogo_impuesto', 'folio_impuesto', 'abreviacion_impuesto', 'concepto_impuesto', 'modulo', 'nivel_aplicacion', 'catalogo_sat',
      'tipo_impuesto', 'exento', 'calculo', 'txtimporte', 'tipo_cambio', 'monedas_codigo', 'monedas_moneda', 'base_aplicable', 'desglose', 'gl_por_pagarcobrar', 'gl_pagada_o_cobrada', 'observaciones'];

    this.dataCFDIBuscarConcepto = ['Descripcion', 'Unidad', 'ValorUnitario', 'Cantidad', 'Descuento', 'Importe', 'TotalRetenciones', 'TotalTraslados', 'Subtotal',
      'articulo_homologado_serie_numero', 'articulo_homologado_lote_numero', 'articulo_homologado_pedimento_numero', 'articulo_homologado_uso', 'articulo_homologado_efecto_fiscal',
      'articulo_homologado_info', 'articulo_homologado_prorratea'];
  }

  getRespuestaRegistroPago() {
    this.relInterna.mensajePagoRealizadoCompra$.subscribe(
      (mensaje: any) => {
        if (mensaje == "pago_realizado") {
          this.compra_proceso_pago = false;
          this.relInterna.mensajeComprasRegistro("nuevo_registro");
        }
      }
    );
  }

  recreaPrincipalLineRegistro() {
    const expandRowsRetenciones: { [s: string]: boolean } = {};
    const expandRowsTraslados: { [s: string]: boolean } = {};
    this.articulos_nuevo_registro = [{
      "id": 1,
      "num_lista": 0,
      "NoIdentificacion": "",
      "ObjetoImp": "",
      "ClaveProdServ": "",
      "Cantidad": "",
      "ClaveUnidad": "",
      "Unidad": "",
      "Descripcion": "",
      "ValorUnitario": "",
      "Descuento": 0,
      "DescuentoFormat": 0,
      "Importe": 0,
      "ImporteFormat": "0.00",
      "TotalRetenciones": 0,
      "TotalRetencionesFormat": "0.00",
      "TotalTraslados": 0,
      "TotalTrasladosFormat": "0.00",
      "Subtotal": 0,
      "SubtotalFormat": "0.00",
      //impuestos
      "Impuestos": [],
      //retenciones
      "articulo_retenciones_modal": false,
      "retenciones": [],
      "expandedRowsRetenciones": expandRowsRetenciones,
      "retenciones_llenadas": false,
      //traslados
      "articulo_traslados_modal": false,
      "traslados": [],
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
      "temp_articulo_uso": "",
      "articulo_homologado_uso": "",
      "temp_articulo_efecto_fiscal": "",
      "articulo_homologado_efecto_fiscal": "",
      //Articulo a homologar uso
      "articulo_homologado_view_activos": false,
      "temp_activo_fijo": "",
      "articulo_homologado_activoFijo": "",
      "temp_activo_diferido": "",
      "articulo_homologado_activoDiferido": "",
      "temp_activo_diferido_foliado": [],
      "articulo_homologado_activo_diferido_foliado": [],
      "articulo_homologado_info": "",
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
    }];
  }

  //Catalogo general de productos y servicios
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

  //series
  lista_series_catalogo_true() {
    this.serieServ.listaSeriesvigentes().pipe(
      tap(response => {
        if (response?.status === 'success') {
          this.seriesCatalogoTrue = response.series;
          console.log(this.seriesCatalogoTrue);
        }
      })
    ).subscribe({ error: error => console.log(error) });
  }

  //lotes
  listaLotesTrue() {
    this.loteServ.listaLotesvigentes().subscribe(
      response => {
        if (response.status == 'success') {
          this.listLotesTrue = response.datosLote;
          console.log(this.listLotesTrue);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //pedimentos
  pedimentosTrueList() {
    this.pedimServ.listapedimentosvigentes().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPedimentosTrue = response.datosPedimento;
          console.log(this.listaPedimentosTrue);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //activos
  listar_activos_fijos_true() {
    this.ver_activos_fijos_true(this.indicadorFijosActivos);
  }
  
  ver_activos_fijos_true(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorFijosActivos = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var act_buy_prod_otras_fechas = document.getElementById("act_buy_prod_otras_fechas");
      if (this.rangoPeriodoFijosActivos && this.rangoPeriodoFijosActivos.length === 2) {
        const dateInicio = this.rangoPeriodoFijosActivos[0];
        const dateFin = this.rangoPeriodoFijosActivos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(act_buy_prod_otras_fechas);
          } else {
            this.validator.errorInputRow(act_buy_prod_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_buy_prod_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(act_buy_prod_otras_fechas);
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

  //monedas
  monedasCatalogoApi() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          this.catalogo_monedas_filtro_busqueda = response.monedas.map((item: any) => ({ searchField: `${item.code} ${item.langEN}` }));
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  //unidad de medida
  catalogoUnidadDeMedidaApi() {
    this._medidasCat.inventUnidadesMedidaEnabledCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listaUMedida);
          this.unidadMedidaCatalogoInventario = response.listaUMedida;

        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //establecimientos
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

  //permisos
  function_permisos() {
    const conf_egresos = this.sessionContext.empresa_data?.conf_egresos;
    for (let i = 0; i < conf_egresos.length; i++) {
      const conf = conf_egresos[i];
      this.priv_eegr_comp_cot = conf["bool_eegr_comp_cot"];
      this.priv_eegr_comp_dir = conf["bool_eegr_comp_dir"];
      this.priv_eegr_compras = conf["bool_eegr_compras"];
      this.priv_eegr_perm_consulta = conf["bool_eegr_perm_consulta"];
      this.priv_eegr_perm_crear = conf["bool_eegr_perm_crear"];
    }
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

  //proveedores
  getRespuestaRegistroProveed() {
    this.relInterna.mensajeProveedorEgresos$.subscribe(
      (mensaje: any) => {
        $('#windowProveedorRegistro').modal('hide');
        $('.modal-backdrop').remove();
        mensaje == "registro aprobado" ? this.proveedoresLista() : null;
      }
    );
  }

  getRespuestaRegistroINVENT(){
    this.relInterna.mensajeProdInvent$.subscribe(
      (mensaje:any) => {
        if (mensaje == "producto registrado") {
        $('#windowProveedorRegistro').modal('hide');
          $('#modalPrdInventarioReg').modal('hide');
          $('.modal-backdrop').remove();
          this.listar_articulos_proveedor(this.provToken);
          this.descargaDataProvComprasList(this.provToken);
          this.listar_catalogo_general_prod_serv();
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
        mensaje == "servicio registrado" ? this.descargaDataProvComprasList(this.provToken) : null;
        mensaje == "servicio registrado" ? this.listar_catalogo_general_prod_serv() : null;
      }
    );
  }

  proveedoresLista() {
    this._provServ.catalogoProveedoresForProcesos().subscribe(
      response => {
        if (response.status == 'success') {
          this.lista_proveedores = response.proveedores;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectProveedor(opcion: any) {
    console.log(opcion.token_cat_proveedores);
    var selectedCatProv = document.getElementById("selectedCatProv");
    let data_prov = this.lista_proveedores.find((row: any) => opcion.token_cat_proveedores != '' && row.token_cat_proveedores == opcion.token_cat_proveedores);
    this.provToken = typeof data_prov !== 'undefined' ? data_prov.token_cat_proveedores : '';
    this.prov_seleccionado_acepta_credito = typeof data_prov !== 'undefined' ? data_prov.aceptacredito : false;
    typeof data_prov !== 'undefined' ? this.descargaDataProvComprasList(data_prov.token_cat_proveedores) : null;
    typeof data_prov !== 'undefined' ? this.comprobarVinculacionArticulos() : null;
    typeof data_prov !== 'undefined' ? this.listar_anticipos_proveedor() : null;
    typeof data_prov !== 'undefined' ? this.validator.correctoSelectBrowser(selectedCatProv) : this.validator.errorSelectBrowser(selectedCatProv);
  }

  valMoned(opcion: any) {
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.dataCFDI_comprobante_Moneda = typeof mnd !== 'undefined' ? mnd.code : '';
    this.dataCFDI_comprobante_MoneDecimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    this.dataCFDI_comprobante_TipoCambio = typeof mnd !== 'undefined' && mnd.code == "MXN" ? "1.00" : "";
    typeof mnd !== 'undefined' ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  activaTipoCambio() {
    return (this.dataCFDI_comprobante_Moneda == "MXN");
  }

  editTipoCambio(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.dataCFDI_comprobante_TipoCambio = validacion ? event.value : "1.00";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get accordion_desactivado(): Boolean {
    return this.proveedorSeleccionado.length == 0 || this.dataCFDI_comprobante_Moneda == '' || this.dataCFDI_comprobante_TipoCambio == '';
  }

  descargaDataProvComprasList(token_cat_proveedores: any) {
    this.proveedorSeleccionado = [];
    console.log("token_cat_proveedores " + token_cat_proveedores);
    this._provServ.verDetalleProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.proveedorSeleccionado = response.proveedor;
          console.log(this.proveedorSeleccionado);
          this.listar_articulos_proveedor(token_cat_proveedores);
        }
      },
      error => {
        console.log(error);
      }
    )
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

  listar_anticipos_proveedor() {
    this._provServ.listarAnticiposDisponiblesProveedor(this.provToken).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response.anticipos_registrados);
          this.aplica_anticipo_a_proveedor = "";
          this.proveedorAnticipoTotal = response.anticipo_total;
          this.proveedorAnticipoTotalFormat = response.anticipo_total_format;
          this.proveedorAnticipoRestanteFormat = response.anticipo_total_format;
        }
      }
    );
  }

  active_view_cont() {
    this.fcontab_compra_modelo.view_cont = !this.fcontab_compra_modelo.view_cont ? true : false;
  }

  select_fecha_contabilizacion(event: any): void {
    console.log(event.value);
    const validacion_xml = event.value != "" && this.validator.filtroFecha(event.value);
    this.fcontab_compra_modelo.fecha_contabilizacion = validacion_xml ? event.value : '';
    validacion_xml ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    if (validacion_xml && this.compra_contado_credito == 'contado') {
      this.compra_fecha_vencimiento = event.value;
    }
  }

  //seleccion de articulos
  verConceptoXMLProductosYServicios(row_man_concept:any) {
    row_man_concept.articulo_homologado_view = !row_man_concept.articulo_homologado_view ? true : false;
  }

  verSeccionXMLRegistroProductosYServicios(row_man_concept:any,seccion_registro:string) {
    row_man_concept.articulo_homologado_ventana_registro = true;
    row_man_concept.articulo_homologado_registro_tipo = seccion_registro;
  }

  selecionaArticuloCompra(row_man_concept:any, token_articulo: any, identificador: any) {
    const valid_art = token_articulo != "" && identificador != "" && this.validator.filtroAlfaNumerico(identificador);
    row_man_concept.articulo_guardar_tkn = valid_art ? token_articulo : '';
    row_man_concept.articulo_guardar_identificador = valid_art ? identificador : '';
  }

  seleccionaArticuloGralCompra(row_man_concept:any, token_articulo: any, identificador: any) {
    const valid_art = token_articulo != "" && identificador != "" && this.validator.filtroAlfaNumerico(identificador);

    if (identificador == 'Producto') {
      this._comprServ.verificaArticuloProd(this.provToken, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            row_man_concept.articulo_guardar_tkn = valid_art ? token_articulo : '';
            row_man_concept.articulo_guardar_identificador = valid_art ? identificador : '';
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            this.functionValidaXmlContentArticulos(row_man_concept);
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

    if (identificador == 'Servicio') {
      this._comprServ.verificaArticuloServ(this.provToken, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            row_man_concept.articulo_guardar_tkn = valid_art ? token_articulo : '';
            row_man_concept.articulo_guardar_identificador = valid_art ? identificador : '';
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            //event.checked = false;
            this.functionValidaXmlContentArticulos(row_man_concept);
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

  prov_relacionado_registrar(event: any, listado: any) {
    let art = this.prodservCatGeneral.find((row: any) => row.listado === listado);
    art.prov_relacionado_registrar = event.checked ? true : false;
  }

  decideHabilitaClave(event: any, listado: any) {
    let art = this.prodservCatGeneral.find((row: any) => row.listado === listado);
    art.prov_relacionado_tiene_clave = event.checked ? true : false;
  }

  keyupProvProdClave(event: any, listado: any) {
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    let art = this.prodservCatGeneral.find((row: any) => row.listado === listado);
    art.prov_relacionado_clave = validar ? event.value : '';
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(art);
  }

  validaRegClaveProdPRV(listado: any) {
    let art = this.prodservCatGeneral.find((row: any) => row.listado === listado);
    const validar_clave = art.prov_relacionado_clave != '' && this.validator.filtroAlfaNumerico(art.prov_relacionado_clave) == true;
    return art.prov_relacionado_registrar && (!art.prov_relacionado_tiene_clave || (art.prov_relacionado_tiene_clave && validar_clave));
  }

  registraClaveProdPRV(listado: any) {
    let art = this.prodservCatGeneral.find((row: any) => row.listado === listado);
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
          this.provToken,
          art.token_articulo,
          art.identificador,
          art.prov_relacionado_registrar,
          art.prov_relacionado_tiene_clave,
          art.prov_relacionado_clave
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
              this.listar_articulos_proveedor(this.provToken);
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

  cancelarArticuloCompra(row_man_concept:any) {
    row_man_concept.articulo_guardar_tkn = '';
    row_man_concept.articulo_guardar_identificador = '';
    row_man_concept.articulo_homologado_view = false;
    console.log(this.articulos_nuevo_registro);
  }

  guardaArticuloCompraXML(row_man_concept:any, token_articulo: any, identificador: any, noIdentificacionXML: any) {
    let gen_art_cat = this.prodservCatGeneral.find((row: any) => row.token_articulo === token_articulo);

    console.log(identificador + " " + noIdentificacionXML);
    if (identificador == 'Producto') {
      this._comprServ.verificaArticuloProd(this.provToken, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(row_man_concept);
            row_man_concept.clasificacion = "";
            row_man_concept.Descripcion = gen_art_cat.concepto;
            row_man_concept.articulo_homologado_serie_bool = response.bool_serie;
            row_man_concept.articulo_homologado_lote_bool = response.bool_lote;
            row_man_concept.articulo_homologado_pedimento_bool = response.bool_pedimento;
            row_man_concept.articulo_homologado_token = token_articulo;
            row_man_concept.articulo_homologado_identificador = response.identificador;
            row_man_concept.articulo_homologado_logotipo = gen_art_cat.imagen;
            row_man_concept.articulo_homologado_clasificacion = gen_art_cat.clasificacion;
            row_man_concept.articulo_homologado_view = false;
            this.functionValidaXmlContentArticulos(row_man_concept);
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            this.functionValidaXmlContentArticulos(row_man_concept);
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
      this._comprServ.verificaArticuloServ(this.provToken, token_articulo, identificador).subscribe(
        response => {
          if (response.status == 'success') {
            console.log("gen_art_cat.listado " + gen_art_cat.listado)
            console.log(row_man_concept);
            row_man_concept.clasificacion = "";
            row_man_concept.Descripcion = gen_art_cat.concepto;
            row_man_concept.articulo_homologado_token = token_articulo;
            row_man_concept.articulo_homologado_identificador = response.identificador;
            row_man_concept.articulo_homologado_logotipo = gen_art_cat.imagen;
            row_man_concept.articulo_homologado_clasificacion = gen_art_cat.clasificacion;
            row_man_concept.articulo_homologado_view = false;
            this.functionValidaXmlContentArticulos(row_man_concept);
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            //event.checked = false;
            this.functionValidaXmlContentArticulos(row_man_concept);
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
    console.log(row_man_concept);
  }

  verConceptoProductoDOSUMedida(row_man_concept:any, simbolo: any) {
    var selectedUMedCatInvent = document.getElementById("selectedUMedCatInvent");
    const medUni = this.unidadMedidaCatalogoInventario.find((row: any) => row.simbolo === simbolo);//Unidad
    const validacion = simbolo != "" && this.validator.filtroAlfaNumerico(simbolo) && typeof medUni !== 'undefined';
    row_man_concept.Unidad = validacion && medUni ? medUni.nombre : "";
    validacion ? this.validator.correctoSelectBrowser(selectedUMedCatInvent) : this.validator.errorSelectBrowser(selectedUMedCatInvent);
    console.log(row_man_concept);
    this.functionValidaXmlContentArticulos(row_man_concept);
  }

  verConceptoProductoDOSPUnitario(row_man_concept:any, event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    row_man_concept.ValorUnitario = validacion ? numeral(event.value).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) : '0.00';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_man_concept);
    this.functionValidaXmlContentArticulos(row_man_concept);
    this.calculo_partida_importeDOS(row_man_concept);
  }

  verConceptoProductoDOSCantidad(row_man_concept:any, event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    row_man_concept.Cantidad = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.articulos_nuevo_registro);
    this.functionValidaXmlContentArticulos(row_man_concept);
    this.calculo_partida_importeDOS(row_man_concept);
  }

  verConceptoProductoDOSDescuentoUnidad(row_man_concept:any, event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    row_man_concept.Descuento = validacion ? numeral(event.value).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) : '0.00';
    row_man_concept.DescuentoFormat = validacion ? numeral(event.value).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) : '0.00';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.articulos_nuevo_registro);
    this.functionValidaXmlContentArticulos(row_man_concept);
    this.calculo_partida_importeDOS(row_man_concept);
  }

  verConceptoProductoDOSRetenciones(row_man_concept:any, event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    row_man_concept.TotalRetenciones = validacion ? numeral(event.value).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) : '0.00';
    row_man_concept.TotalRetencionesFormat = validacion ? numeral(event.value).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) : '0.00';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.articulos_nuevo_registro);
    this.functionValidaXmlContentArticulos(row_man_concept);
    this.calculo_partida_importeDOS(row_man_concept);
  }

  activaBotonRetencionesClass(row_man_concept:any) {
    var clase = "";
    if (this.proveedorSeleccionado.length == 0 || row_man_concept.Descripcion == '' || row_man_concept.TotalRetenciones == 0) {
      clase = "bg-blue-600 disabled";
    } else {
      if (row_man_concept.retenciones.length == 0 && !row_man_concept.retenciones_llenadas) {
        clase = "bg-blue-600";
      } else {
        clase = "text-bg-success rounded-3";
      }
    }
    return clase;
  }

  activaBotonRetencionesIcono(row_man_concept:any) {
    var clase = "";
    if (this.proveedorSeleccionado.length == 0 || row_man_concept.Descripcion == '' || row_man_concept.TotalRetenciones == 0) {
      clase = "fa-ban";
    } else {
      if (row_man_concept.retenciones.length == 0 && !row_man_concept.retenciones_llenadas) {
        clase = "fa-eye";
      } else {
        clase = "fa-check-double";
      }
    }
    return clase;
  }

  enableRetenciones(row_man_concept:any) {
    const condicion = this.proveedorSeleccionado.length > 0 && row_man_concept.Descripcion != '' && row_man_concept.TotalRetenciones > 0;
    return condicion;
  }

  verConceptoXMLRetenciones(row_man_concept:any) {
    row_man_concept.articulo_retenciones_modal = !row_man_concept.articulo_retenciones_modal ? true : false;
  }

  toggleRetencion(row: any, row_man_concept:any) {
    console.log(this.articulos_nuevo_registro);

    const isExpanded = !!row_man_concept.expandedRowsRetenciones[row.id];
    row_man_concept.expandedRowsRetenciones = {};
    if (!isExpanded) {
      row_man_concept.expandedRowsRetenciones[row.id] = true;
    }
  }

  rExpandRetencion(row: any, row_man_concept:any): boolean {
    return !!row_man_concept.expandedRowsRetenciones[row.id];
  }

  selecciona_imp_retencion(row_man_concept:any, event: any) {
    let imp = this.impRetencionesCatalogo.find((row: any) => row.token_catalogo_impuesto == event.value);
    const validacion = event.value != "" && typeof imp !== 'undefined';
    if (validacion) {
      const index = row_man_concept.retenciones.findIndex((row: any) => row.impuesto_relacionado_token === imp.token_catalogo_impuesto);
      if (index > -1) {
        row_man_concept.retenciones.splice(index, 1);
      } else {
        row_man_concept.retenciones.push({
          impuesto_relacionado_token: imp.token_catalogo_impuesto,
          impuesto_relacionado_nombre: imp.folio_impuesto + " " + imp.abreviacion_impuesto
        });
      }
    }
    console.log(this.articulos_nuevo_registro);
  }

  habilita_guarda_imp_retencion(row_man_concept:any): Boolean {
    const retenciones_llenas = row_man_concept.retenciones.length > 0;
    return retenciones_llenas;
  }

  imp_retencion_cancelar(row_man_concept:any) {
    row_man_concept.retenciones = [];
    row_man_concept.articulo_retenciones_modal = false;
    row_man_concept.retenciones_llenadas = false;
  }

  guarda_imp_retencion(row_man_concept:any) {
    row_man_concept.articulo_retenciones_modal = false;
    row_man_concept.retenciones_llenadas = true;
  }

  verConceptoProductoDOSTraslados(row_man_concept:any, event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    row_man_concept.TotalTraslados = validacion ? numeral(event.value).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) : '0.00';
    row_man_concept.TotalTrasladosFormat = validacion ? numeral(event.value).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) : '0.00';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.articulos_nuevo_registro);
    this.functionValidaXmlContentArticulos(row_man_concept);
    this.calculo_partida_importeDOS(row_man_concept);
  }

  activaBotonTrasladosClass(row_man_concept:any) {
    var clase = "";
    if (this.proveedorSeleccionado.length == 0 || row_man_concept.Descripcion == '' || row_man_concept.TotalTraslados == 0) {
      clase = "bg-blue-600 disabled";
    } else {
      if (row_man_concept.traslados.length == 0 && !row_man_concept.traslados_llenados) {
        clase = "bg-blue-600";
      } else {
        clase = "text-bg-success rounded-3";
      }
    }
    return clase;
  }

  activaBotonTrasladosIcono(row_man_concept:any) {
    var clase = "";
    if (this.proveedorSeleccionado.length == 0 || row_man_concept.Descripcion == '' || row_man_concept.TotalTraslados == 0) {
      clase = "fa-ban";
    } else {
      if (row_man_concept.traslados.length == 0 && !row_man_concept.traslados_llenados) {
        clase = "fa-eye";
      } else {
        clase = "fa-check-double";
      }
    }
    return clase;
  }

  enableTraslados(row_man_concept:any) {
    const condicion = this.proveedorSeleccionado.length > 0 && row_man_concept.Descripcion != '' && row_man_concept.TotalTraslados > 0;
    return condicion;
  }

  verConceptoXMLTraslados(row_man_concept:any) {
    row_man_concept.articulo_traslados_modal = !row_man_concept.articulo_traslados_modal ? true : false;
  }

  toggleTraslado(row: any, row_man_concept:any) {
    console.log(this.articulos_nuevo_registro);

    const isExpanded = !!row_man_concept.expandedRowsTraslados[row.id];
    row_man_concept.expandedRowsTraslados = {};
    if (!isExpanded) {
      row_man_concept.expandedRowsTraslados[row.id] = true;
    }
  }

  rExpandTraslado(row: any, row_man_concept:any): boolean {
    return !!row_man_concept.expandedRowsTraslados[row.id];
  }

  selecciona_imp_traslado(row_man_concept:any, event: any) {
    let imp = this.impTrasladosCatalogo.find((row: any) => row.token_catalogo_impuesto == event.value);
    const validacion = event.value != "" && typeof imp !== 'undefined';

    if (validacion) {
      const index = row_man_concept.traslados.findIndex((row: any) => row.impuesto_relacionado_token === imp.token_catalogo_impuesto);
      if (index > -1) {
        row_man_concept.traslados.splice(index, 1);
      } else {
        row_man_concept.traslados.push({
          impuesto_relacionado_token: imp.token_catalogo_impuesto,
          impuesto_relacionado_nombre: imp.folio_impuesto + " " + imp.abreviacion_impuesto
        });
      }
    }
    console.log(this.articulos_nuevo_registro);
  }

  habilita_guarda_imp_traslado(row_man_concept:any): Boolean {
    const traslados_llenos = row_man_concept.traslados.length > 0;
    return traslados_llenos;
  }

  imp_traslado_cancelar(row_man_concept:any) {
    row_man_concept.traslados = [];
    row_man_concept.articulo_traslados_modal = false;
    row_man_concept.traslados_llenados = false;
  }

  guarda_imp_traslado(row_man_concept:any) {
    row_man_concept.articulo_traslados_modal = false;
    row_man_concept.traslados_llenados = true;
  }

  calculo_partida_importeDOS(row_man_concept:any) {
    //let art = this.prodservCatGeneral[ind];
    let base_uno = (parseFloat(row_man_concept.ValorUnitario) * parseFloat(this.dataCFDI_comprobante_TipoCambio)) * parseFloat(row_man_concept.Cantidad);
    let importe_compra = base_uno - parseFloat(row_man_concept.Descuento);
    row_man_concept.Importe = numeral(importe_compra).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
    row_man_concept.ImporteFormat = numeral(importe_compra).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));

    var total_compra = base_uno - parseFloat(row_man_concept.Descuento) + parseFloat(row_man_concept.TotalTraslados) - parseFloat(row_man_concept.TotalRetenciones);
    console.log("importe " + total_compra);
    row_man_concept.Subtotal = numeral(total_compra).format('0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));;
    row_man_concept.SubtotalFormat = numeral(total_compra).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
    //totalConImpuestoConversion
  }

  verConceptoXMLProductosSeries(row_man_concept:any) {
    row_man_concept.articulo_homologado_serie_view = !row_man_concept.articulo_homologado_serie_view ? true : false;
  }

  selectPrdserieXml(row_man_concept:any, serie_token: any) {
    let index_serie = this.seriesCatalogoTrue.findIndex((row: any) => row.serie_token == serie_token);
    this.token_serie = this.seriesCatalogoTrue[index_serie]["serie_token"];
    this.numero_serie = this.seriesCatalogoTrue[index_serie]["serie_codigo"];
  }

  validaNuevaSerie(event: any) {
    var validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.serie_nueva = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  decideUsoUnico(event: any) {
    this.serie_uso_unico = event.checked == true ? true : false;
  }

  serieComentariosLoteKeyUp(event: any) {
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.serie_comentarios = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  registraSerie(form: NgForm): void {
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
        this.serieServ.registroSeries(this.serie_nueva, this.serie_uso_unico, this.serie_comentarios).subscribe(
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
              this.validator.limpiaInputRow(document.getElementById("txt_new_serie"));
              this.serie_nueva = "";
              this.serie_uso_unico = false;
              this.serie_comentarios = "";
              this.lista_series_catalogo_true();
              form.resetForm();
              //this.formAddProducto.resetForm();
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
        )
      }
    });
  }

  artSerieCancelar(row_man_concept:any) {
    row_man_concept.articulo_homologado_serie_token = "";
    row_man_concept.articulo_homologado_serie_numero = "";
    this.token_serie = "";
    this.numero_serie = "";
    row_man_concept.articulo_homologado_serie_view = false;
  }

  guardartSerie(row_man_concept:any) {
    row_man_concept.articulo_homologado_serie_token = this.token_serie;
    row_man_concept.articulo_homologado_serie_numero = this.numero_serie;
    this.token_serie = "";
    this.numero_serie = "";
    row_man_concept.articulo_homologado_serie_view = false;
    this.functionValidaXmlContentArticulos(row_man_concept);
  }

  verConceptoXMLProductosLote(row_man_concept:any) {
    row_man_concept.articulo_homologado_lote_view = !row_man_concept.articulo_homologado_lote_view ? true : false;
  }

  selectPrdLoteXml(row_man_concept:any, token_lote: any) {
    let index_lote = this.listLotesTrue.findIndex((row: any) => row.token_lote == token_lote);
    this.token_lote = this.listLotesTrue[index_lote]["token_lote"];
    this.numero_lote = this.listLotesTrue[index_lote]["numero_lote"];
  }

  //registro
  checkFechaLote(event: any) {
    let validacion = event.value != '' && this.validator.filtroFecha(event.value) == true;
    this.modelLote.fechaLote = validacion ? event.value : '';
    console.log(this.modelLote.fechaLote)
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkNumeroLote(event: any) {
    let validacion = event.value != '' && this.validator.strFilter(event.value) == true;
    this.modelLote.numeroLote = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkComentariosLote(event: any) {
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelLote.comentarios = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeEscannersitfiscal(e: any) {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    var typoElement = e.target.files[0].type;
    if (e.target.files[0].size <= 2000000 && (typoElement == 'application/pdf')) {
      this.imagenAltaPdfevidencialote = e.target.files[0];
      if (typoElement == 'application/pdf') {
        this.modelLote.nameEvidencia = e.target.files[0].name;
        reader.onload = function () {
          $("#divImgClassSitfiscalProv").removeClass("btnError");
          let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + reader.result + '" frameborder="0"></iframe>';
          $("#divImgClassSitfiscalProv").html(imgPerfil);
        };
      }
    } else {
      let mensajeError = '';
      if (e.target.files[0].size > 2000000) {
        mensajeError = 'La imagen excede el tamaño permitido (2MB)';
      }
      if (typoElement != 'application/pdf') {
        mensajeError = 'La evidencia debe ser en formato pdf';
      }
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: mensajeError,
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  clickEscannerEvidenciaLote() {//readerEvidenciaLote
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        //console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("readerEvidenciaLote", config, false);
    codeQrstfiscal.render(this.scanYesEvidencia, this.onScanError);
  }

  scanYesEvidenciaPed(decodedText: any, decodedResult: any) {
    global.imagenUrlEvidenciaLote = decodedText;
    $("#divImgClassSitfiscalProv").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + decodedText + '" frameborder="0"></iframe>';
    $("#divImgClassSitfiscalProv").html(imgPerfil);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton: false,
      timer: 3000
    })
  }

  onScanErrorPed(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }

  get verificaDataPed(): boolean {
    //console.log("validarty "+this.modelLote.fechaLote+" "+this.modelLote.numeroLote)
    // && this.modelLote.nameEvidencia != '';
    return (this.modelLote.fechaLote != '' && this.modelLote.numeroLote != '' && this.modelLote.comentarios != '');
  }

  registraLote(form: NgForm): void {
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
        this.loteServ.registroLotes(this.imagenAltaPdfevidencialote, this.modelLote).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(() => {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
                form.resetForm();
                this.validator.limpiaInputRow(document.getElementById("dataLoteFecha"));
                this.validator.limpiaInputRow(document.getElementById("dataLoteNumero"));
                this.validator.limpiaInputRow(document.getElementById("dataLoteComentarios"));
                this.validator.limpiaInputRow(document.getElementById("dataLoteDocs"));

                this.formLoteReg.resetForm();
                this.listaLotesTrue();
              }, 1000);
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
        )
      }
    })
    console.log(this.modelLote)
  }

  artLoteCancelar(row_man_concept:any) {
    row_man_concept.articulo_homologado_lote_token = "";
    row_man_concept.articulo_homologado_lote_numero = "";
    this.token_lote = "";
    this.numero_lote = "";
    row_man_concept.articulo_homologado_lote_view = false;
  }

  guardartLote(row_man_concept:any) {
    row_man_concept.articulo_homologado_lote_token = this.token_lote;
    row_man_concept.articulo_homologado_lote_numero = this.numero_lote;
    this.token_lote = "";
    this.numero_lote = "";
    row_man_concept.articulo_homologado_lote_view = false;
    this.functionValidaXmlContentArticulos(row_man_concept);
  }

  verConceptoXMLProductosPedimentoAduanal(row_man_concept:any) {
    row_man_concept.articulo_homologado_pedimento_view = !row_man_concept.articulo_homologado_pedimento_view ? true : false;
  }

  selectPrdPedimentoXml(row_man_concept:any, token_pedimento: any) {
    let index_pad = this.listaPedimentosTrue.findIndex((row: any) => row.token_pedimento == token_pedimento);
    this.token_padnal = this.listaPedimentosTrue[index_pad]["token_pedimento"];
    this.numero_padnal = this.listaPedimentosTrue[index_pad]["numero_pedimento"];
  }

  //registro
  checkFechaPedim(event: any) {
    let validacion = event.value != '' && this.validator.filtroFecha(event.value) == true;
    this.modelPedim.fechaPedim = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkNumeroImportacion(event: any) {
    let validacion = event.value != '' && this.validator.strFilter(event.value) == true;
    this.modelPedim.numeroPedim = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkPedimAduana(event: any) {
    let validacion = event.value != '' && this.validator.strFilter(event.value) == true;
    this.modelPedim.aduana = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkComentariosPedim(event: any) {
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelPedim.comentarios = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeEscannerEvidPed(e: any) {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    var typoElement = e.target.files[0].type;
    if (e.target.files[0].size <= 2000000 && (typoElement == 'application/pdf')) {
      this.imagenAltaPdfevidenciapedim = e.target.files[0];
      if (typoElement == 'application/pdf') {
        this.modelPedim.nameEvidencia = e.target.files[0].name;
        reader.onload = function () {
          $("#divImgClassEvidPedim").removeClass("btnError");
          let imgPerfil = '<iframe style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + reader.result + '" frameborder="0"></iframe>';
          $("#divImgClassEvidPedim").html(imgPerfil);
        };
      }
    } else {
      let mensajeError = '';
      if (e.target.files[0].size > 2000000) {
        mensajeError = 'La evidencia excede el tamaño permitido (2MB)';
      }
      if (typoElement != 'application/pdf') {
        mensajeError = 'La evidencia debe ser en formato pdf';
      }
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: mensajeError,
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  clickEscannerEvidenciaPedim() {//readerEvidenciaPedim
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        //console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("readerEvidenciaPedim", config, false);
    codeQrstfiscal.render(this.scanYesEvidencia, this.onScanError);
  }

  scanYesEvidencia(decodedText: any, decodedResult: any) {
    global.imagenUrlEvidenciaLote = decodedText;
    $("#divImgClassEvidPedim").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + decodedText + '" frameborder="0"></iframe>';
    $("#divImgClassEvidPedim").html(imgPerfil);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton: false,
      timer: 3000
    })
  }

  onScanError(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }

  get verificaData(): boolean {
    return (this.modelPedim.fechaPedim != '' && this.modelPedim.numeroPedim != '' && this.modelPedim.aduana != '' && this.modelPedim.comentarios != '');
  }

  registraPedimento(form: NgForm): void {
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
        this.pedimServ.registropedimentos(this.imagenAltaPdfevidenciapedim, this.modelPedim).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(() => {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
                form.resetForm();
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdFecha"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdNumeroPed"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdAduana"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdComentarios"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdDocs"));

                this.formPedAduanalReg.resetForm();
                this.pedimentosTrueList();
              }, 3000);
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
        )
      }
    })
    console.log(this.modelPedim)
  }

  artPrdPedimentoCancelar(row_man_concept:any) {
    row_man_concept.articulo_homologado_pedimento_token = "";
    row_man_concept.articulo_homologado_pedimento_numero = "";
    this.token_padnal = "";
    this.numero_padnal = "";
    row_man_concept.articulo_homologado_pedimento_view = false;
  }

  guardartPrdPedimento(row_man_concept:any) {
    row_man_concept.articulo_homologado_pedimento_token = this.token_padnal;
    row_man_concept.articulo_homologado_pedimento_numero = this.numero_padnal;
    this.token_padnal = "";
    this.numero_padnal = "";
    row_man_concept.articulo_homologado_pedimento_view = false;
    this.functionValidaXmlContentArticulos(row_man_concept);
  }

  verConceptoXMLUsoActivo(row_man_concept:any) {
    row_man_concept.articulo_homologado_view_uso = !row_man_concept.articulo_homologado_view_uso ? true : false;
    row_man_concept.temp_articulo_uso = row_man_concept.articulo_homologado_uso;
    row_man_concept.temp_articulo_efecto_fiscal = row_man_concept.articulo_homologado_efecto_fiscal;
  }

  selectUsoArticuloXml(event: any, row_cfdi_concept: any) {
    console.log(event.value);
    row_cfdi_concept.temp_articulo_uso = event.value != '' ? event.value : '';

    if (event.value === 'activo_fijo' && this.listActivosFijos.length === 0) {
      this.listar_activos_fijos_true();
    } else if (event.value === 'activo_diferido' && this.listActivosIntangibles.length === 0) {
      this.listar_activos_intang_true();
    }
  }

  selectEfectoFiscalUsoArticulo(event: any,row_man_concept:any) {
    row_man_concept.temp_articulo_efecto_fiscal = event.value != '' ? event.value : '';
  }

  artUsoActivoCancelar(row_man_concept:any) {
    row_man_concept.temp_articulo_uso = "";
    row_man_concept.temp_articulo_efecto_fiscal = "";
    
    row_man_concept.articulo_homologado_uso = "";
    row_man_concept.articulo_homologado_efecto_fiscal = "";
    row_man_concept.articulo_homologado_view_uso = false;
  }

  guardartUsoActivo(row_man_concept:any) {
    row_man_concept.articulo_homologado_uso = row_man_concept.temp_articulo_uso;
    row_man_concept.articulo_homologado_efecto_fiscal = row_man_concept.temp_articulo_efecto_fiscal;

    row_man_concept.temp_articulo_uso = "";
    row_man_concept.temp_articulo_efecto_fiscal = "";
    row_man_concept.articulo_homologado_view_uso = false;
    this.functionValidaXmlContentArticulos(row_man_concept);
    console.log(row_man_concept);
  }

  verConceptoXMLActivosLista(row_man_concept:any) {
    console.log(row_man_concept.articulo_homologado_identificador);
    row_man_concept.articulo_homologado_view_activos = !row_man_concept.articulo_homologado_view_activos ? true : false;
  }

  //fijos
  selectActivoXmlFijo(row_man_concept:any, token_activo: any) {
    if (row_man_concept.temp_activo_fijo === token_activo) {
      row_man_concept.temp_activo_fijo = '';
      return;
    }

    row_man_concept.temp_activo_fijo = token_activo;

    this.expandRowsActivoFijo = { [token_activo]: true };
    console.log(row_man_concept);
    if (!row_man_concept) return;
  }

  artActivoFijoValidar(row_man_concept:any): Boolean {
    return row_man_concept.temp_activo_fijo != '';
  }

  artActivoFijoCancelar(row_man_concept:any) {
    row_man_concept.articulo_homologado_activoFijo = "";
    row_man_concept.temp_activo_fijo = "";
    row_man_concept.articulo_homologado_view_activos = false;
  }

  guardartActivoFijo(row_man_concept:any) {
    row_man_concept.articulo_homologado_activoFijo = row_man_concept.articulo_homologado_uso == 'activo_fijo' ? row_man_concept.temp_activo_fijo : '';
    row_man_concept.temp_activo_fijo = "";
    row_man_concept.articulo_homologado_view_activos = false;
    this.functionValidaXmlContentArticulos(row_man_concept);
  }

  selectActivoXmlDiferido(event:any,row_man_concept:any, token_activo: any) {
    if (row_man_concept.temp_activo_diferido === token_activo) {
      row_man_concept.temp_activo_diferido = '';
      row_man_concept.temp_activo_diferido_foliado = [];
      return;
    }

    row_man_concept.temp_activo_diferido = token_activo;

    this.expandRowsActivoDiferido = { [token_activo]: true };

    console.log(row_man_concept);

    if (!row_man_concept) return;
    
    for (let i = 0; i < parseInt(row_man_concept.Cantidad); i++) {
      row_man_concept.temp_activo_diferido_foliado.push({
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
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  isActivoSeleccionado(conceptList: any, filaActual: any): boolean {
    const tokenSeleccionado = conceptList.articulo_homologado_activoDiferido != filaActual.token_act_intang && conceptList.temp_activo_diferido != filaActual.token_act_intang;
    return tokenSeleccionado;
  }

  keyupACTDFoliadoAmortContablePeriodo(clave:any, afoli: any, row_man_concept:any) {
    var amort_cont_periodo = document.getElementById(afoli.id_select_cont);
    let dcperiod = this.amortizacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    afoli.amort_contable_periodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(amort_cont_periodo) : this.validator.errorSelectBrowser(amort_cont_periodo);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortContableTiempo(event: any, afoli: any, row_man_concept:any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && afoli;
    afoli.amort_contable_tiempo = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortContableFechaAPartir(event: any, afoli: any, row_man_concept:any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && afoli;
    afoli.amort_contable_fecha_apartir = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortContableObservaciones(event: any, afoli: any, row_man_concept:any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && afoli;
    afoli.amort_contable_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalPeriodo(clave:any, afoli: any, row_man_concept:any) {
    var amort_fisc_periodo = document.getElementById(afoli.id_select_fisc);
    let dcperiod = this.amortizacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    afoli.amort_fiscal_periodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(amort_fisc_periodo) : this.validator.errorSelectBrowser(amort_fisc_periodo);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalTiempo(event: any, afoli: any, row_man_concept:any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && afoli;
    afoli.amort_fiscal_tiempo = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalFechaAPartir(event: any, afoli: any, row_man_concept:any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && afoli;
    afoli.amort_fiscal_fecha_apartir = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  keyupACTDFoliadoAmortFiscalObservaciones(event: any, afoli: any, row_man_concept:any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && afoli;
    afoli.amort_fiscal_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(row_man_concept.temp_activo_diferido_foliado);
  }

  artActivoDiferidoValidar(row_man_concept:any): Boolean {
    const actfol = row_man_concept.temp_activo_diferido_foliado.filter((fol: any) =>
      fol.amort_contable_periodo != '' &&
      fol.amort_contable_tiempo != '' &&
      fol.amort_contable_fecha_apartir != '' &&
      fol.amort_contable_observaciones != '' &&
      fol.amort_fiscal_periodo != '' &&
      fol.amort_fiscal_tiempo != '' &&
      fol.amort_fiscal_fecha_apartir != '' &&
      fol.amort_fiscal_observaciones != ''
    );
    return row_man_concept.temp_activo_diferido != '' && row_man_concept.temp_activo_diferido_foliado.length == row_man_concept.Cantidad && actfol.length == Number(row_man_concept.Cantidad);
  }

  artActivoDiferidoCancelar(row_man_concept:any) {
    row_man_concept.articulo_homologado_activoDiferido = "";
    row_man_concept.temp_activo_diferido = "";
    row_man_concept.articulo_homologado_view_activos = false;
  }

  guardartActivoDiferido(row_man_concept:any) {
    row_man_concept.articulo_homologado_activoDiferido = row_man_concept.articulo_homologado_uso == 'activo_diferido' ? row_man_concept.temp_activo_diferido : '';
    if (row_man_concept.articulo_homologado_uso == 'activo_diferido') {
      row_man_concept.articulo_homologado_activo_diferido_foliado = [...row_man_concept.temp_activo_diferido_foliado];
    }
    row_man_concept.temp_activo_diferido = "";
    row_man_concept.temp_activo_diferido_foliado = [];
    row_man_concept.articulo_homologado_view_activos = false;
    this.functionValidaXmlContentArticulos(row_man_concept);
  }

  selectProrrateoCompra(row_man_concept:any, event: any) {
    row_man_concept.articulo_homologado_prorratea = event.checked;
  }

  validarGeneralArticulo(concepto: any) {
    const art_hom_ident = concepto.articulo_homologado_identificador;
    if (!concepto.articulo_homologado_clasificacion || !concepto.Importe || !concepto.articulo_homologado_token || !concepto.articulo_homologado_identificador) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el concepto.' });
      return false;
    }

    if (!concepto.articulo_homologado_serie_bool && !concepto.articulo_homologado_lote_bool && !concepto.articulo_homologado_pedimento_bool && !concepto.articulo_homologado_uso) {
      //throw new Error('Faltan datos obligatorios en el concepto.');
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el uso del producto.' });
      return false;
    }

    if (concepto.articulo_retenciones && !concepto.retencion_token) {
      //throw new Error('Faltan datos obligatorios en el concepto.');
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en impuestos retenidos.' });
      return false;
    }

    if (concepto.articulo_traslados && !concepto.traslado_token) {
      //throw new Error('Faltan datos obligatorios en el concepto.');
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en impuestos trasladados.' });
      return false;
    }
    
    const identificadoresValidos = ['Producto', 'Servicio', 'ActivoFijo', 'ActivoDiferido'];

    if (identificadoresValidos.includes(art_hom_ident)) {
      if (art_hom_ident === 'Producto' && concepto.articulo_homologado_serie_bool && !concepto.articulo_homologado_serie_token) {
        //throw new Error('Falta información de serie.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de serie.' });
        return false;
      }
      if (art_hom_ident === 'Producto' && concepto.articulo_homologado_lote_bool && !concepto.articulo_homologado_lote_token) {
        //throw new Error('Falta información de lote.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de lote.' });
        return false;
      }
      if (art_hom_ident === 'Producto' && concepto.articulo_homologado_pedimento_bool && !concepto.articulo_homologado_pedimento_token) {
        //throw new Error('Falta información de pedimento.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de pedimento.' });
        return false;
      }

      if (!concepto.articulo_homologado_uso) {
        //throw new Error('Faltan datos obligatorios en el concepto.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el uso del producto.' });
        return false;
      }

      if (concepto.articulo_homologado_uso === 'activo_fijo' && !concepto.articulo_homologado_activoFijo) {
        //throw new Error('Falta información de activo fijo.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de activo fijo.' });
        return false;
      }

      if (concepto.articulo_homologado_uso === 'activo_diferido' && !concepto.articulo_homologado_activoDiferido) {
        //throw new Error('Falta información de activo intangible.');
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

  functionValidaXmlContentArticulos(row_man_concept:any) {
    try {
      var result_validacion: any = this.validarGeneralArticulo(row_man_concept);
      console.log(result_validacion);
      this.selectvalidatexmlArticulos = result_validacion;
      row_man_concept.activa_desglose = result_validacion;
    } catch (error: any) {
      this.selectvalidatexmlArticulos = false;
      //console.error('Error en la validación de conceptos:', error.message);
    }
  }

  descargaPartidaCompra(row_man_concept:any) {
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
        row_man_concept.num_lista = this.dataCFDI_conceptos.length + 1;
        this.dataCFDI_conceptos.push(row_man_concept);
        this.cd.detectChanges();
        //this.articulos_nuevo_registro = [];
        this.recreaPrincipalLineRegistro();
        this.calculaTotalesCompra();
        this.selectvalidatexmlArticulos = false;
        console.log(this.dataCFDI_conceptos);
        console.log(this.articulos_nuevo_registro);
      }
    })
  }

  calculaTotalesCompra() {
    var totales_compra_subtotal = 0;
    var totales_compra_descuento = 0;
    var totales_compra_retenciones = 0;
    var totales_compra_traslados = 0;
    var totales_compra_total = 0;
    this.dataCFDI_conceptos.forEach((calc: any) => {
      totales_compra_subtotal += calc.Importe;
      totales_compra_descuento += calc.Descuento;
      totales_compra_retenciones += parseFloat(calc.TotalRetenciones);
      totales_compra_traslados += parseFloat(calc.TotalTraslados);
      totales_compra_total += calc.Subtotal;
    });

    this.compra_subtotal = numeral(totales_compra_subtotal).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
    this.compra_descuento = numeral(totales_compra_descuento).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
    this.compra_retenciones = numeral(totales_compra_retenciones).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
    this.compra_traslados = numeral(totales_compra_traslados).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
    this.compra_total = numeral(totales_compra_total).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales));
  }

  verPartDownRetenciones(row_man_concept:any) {
    console.log(row_man_concept);
    row_man_concept.articulo_retenciones_modal = !row_man_concept.articulo_retenciones_modal ? true : false;
  }

  verPartDownTraslados(row_man_concept:any) {
    row_man_concept.articulo_traslados_modal = !row_man_concept.articulo_traslados_modal ? true : false;
  }

  eliminaPartida(posicion: any) {
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
        this.dataCFDI_conceptos.splice(posicion, 1);
      }
    })
  }

  //compra a credito
  desicionCreditoContadoCompra(decision: any) {
    this.compra_contado_credito = decision;
    this.compra_fecha_vencimiento = decision == 'contado' ? this.fcontab_compra_modelo.fecha_contabilizacion : '';
  }

  select_fecha_vencimiento(event: any): void {
    const validacion_xml = event.value != "" && this.validator.filtroFecha(event.value);
    this.compra_fecha_vencimiento = validacion_xml ? event.value : '';
    validacion_xml ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //¿Recibes el producto o servicio antes o despues del pago?
  recibeProdAntesDespues(event: any) {
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

  calcula_anticipo_restante() {
    this.proveedorAnticipoRestanteFormat = "$" + numeral(this.proveedorAnticipoTotal - this.proveedorAnticipoaplicado).format('0,0.' + '0'.repeat(this.dataCFDI_comprobante_MoneDecimales)) + " " + this.dataCFDI_comprobante_Moneda;
  }

  selectAnticipo(uuid_anticipo: any) {
    //this.anticipo_uuid = uuid_anticipo != "" ? uuid_anticipo : "";
    uuid_anticipo == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el concepto.' }) : null;
  }

  aplicarFacturasCompra(event: any) {
    switch (event.value) {
      case 'buy_aplicar_factura':
        this.aplica_recepcion_facturas = "Sí";
        break;
      case 'not_aplicar_factura':
        this.aplica_recepcion_facturas = "No";
        break;
    }
  }

  onpresNumer(e: KeyboardEvent) {
    this.validator.key_press_numbers(e);
  }

  onpresAlpha(e: KeyboardEvent) {
    this.validator.key_press_alfa(e);
  }

  keyupObservacionesCompra(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.compra_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedCompra(files: NgxFileDropEntry[]) {
    this.anexosCompraFiles = files;
    this.anexosCompraNames = [];
    this.anexosCompraDocs = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.anexosCompraDocs.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.anexosCompraNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.anexosCompraDocs.length > 0) {
              for (let j = 0; j < this.anexosCompraDocs.length; j++) {
                const row = this.anexosCompraDocs[j];
                if (row["name"] != nameFile) {
                  this.anexosCompraDocs.push(file);
                }
              }
            } else {
              this.anexosCompraDocs.push(file);
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
            this.anexosCompraFiles.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.anexosCompraDocs.length);
  }

  public fileOverCompra(event: any) {
    console.log(event);
  }

  public fileLeaveCompra(event: any) {
    console.log(event);
  }

  deleteAnexosCompra(posicion: any) {
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
          this.anexosCompraFiles.splice(posicion, 1);
          this.anexosCompraDocs.splice(posicion, 1);
          this.anexosCompraNames.splice(posicion, 1);
          console.log(this.anexosCompraDocs.length);
        }
      }
    );
  }

  get habilitaBtnRegistro(): Boolean {
    //console.log(this.compra_contado_credito);
    //console.log(this.compra_fecha_vencimiento);
    const valida_cont_cred = this.compra_contado_credito != "" && this.compra_fecha_vencimiento != "";
    const valida_lug_recep = this.tipoLugarRecepcion != '' && (this.tipoLugarRecepcion == 'noAplica' || (this.tipoLugarRecepcion != 'noAplica' && this.tknLugarRecepcion != ''));
    const validacion = this.provToken != '' && this.dataCFDI_conceptos.length > 0 && valida_cont_cred && valida_lug_recep && this.aplica_recepcion_facturas != "";
    return validacion;
  }

  validateRegistraCompraCFDI(modalidad: any) {
    //const modalidad = (event.submitter as HTMLButtonElement)?.value; event: SubmitEvent){
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
        this.compra_by_prods = false;
        this.cargandoCompras = 'cargando';
        const valida_cont_cred = this.compra_contado_credito != '' && (this.compra_contado_credito == 'contado' || (this.compra_contado_credito == 'credito' && this.compra_fecha_vencimiento != ""));
        const valida_recepcion = this.tipoLugarRecepcion != '' && (this.tipoLugarRecepcion == 'noAplica' || (this.tipoLugarRecepcion != 'noAplica' && this.tknLugarRecepcion != ''));
        if (this.provToken != '' && this.dataCFDI_comprobante_Moneda != '' && this.dataCFDI_conceptos.length != 0 && valida_cont_cred && valida_recepcion) {
          switch (modalidad) {
            case 'pagar':
              this.registrarCompraMANUAL_Pagar();
              break;
            case 'listado':
              this.registrarCompraMANUAL_returnList();
              break;
            case 'registrando':
              this.registrarCompraMANUAL();
              break;

            default:
              break;
          }
          this.dataCFDI_comprobante_Moneda == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'No hay moneda seleccionada para esta compra' }) : null;
        } else {
          this.provToken == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar un proveedor para realizar esta compra' }) : null;
          this.dataCFDI_conceptos.length == 0 ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar articulos y/o servicios para comprar' }) : null;
          this.tipoLugarRecepcion == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar una opción en el bloque "PUNTO DE ENTREGA O RECEPCION' }) : null;
          this.tknLugarRecepcion == "" ? this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Debe seleccionar un lugar donde se recibiran los articulos seleccionados para esta compra' }) : null;
        }
      }
    })
  }

  registrarCompraMANUAL_Pagar() {
    this._comprServ.registraCompraPorArticulos(
      this.fcontab_compra_modelo.fecha_contabilizacion,
      this.compra_fecha_vencimiento,
      this.provToken,
      this.dataCFDI_comprobante_Moneda,
      this.dataCFDI_comprobante_TipoCambio,
      this.dataCFDI_conceptos,
      this.compra_total,
      this.compra_contado_credito,
      this.classRecibeArtPago,
      this.tipoLugarRecepcion,

      this.compra_fecha_tentativa_salida,
      this.tknLugarSalida,
      this.compra_fecha_tentativa_recepcion,
      this.tknLugarRecepcion,

      this.proveedorAnticipoaplicado,
      this.aplica_recepcion_facturas,
      this.compra_observaciones,
      this.anexosCompraDocs,
      "pagar",
    ).subscribe(
      response => {
        let translate_response = this.translate.instant(response.message);
        console.log(response);
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
          })
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  registrarCompraMANUAL_returnList() {
    this._comprServ.registraCompraPorArticulos(
      this.fcontab_compra_modelo.fecha_contabilizacion,
      this.compra_fecha_vencimiento,
      this.provToken,
      this.dataCFDI_comprobante_Moneda,
      this.dataCFDI_comprobante_TipoCambio,
      this.dataCFDI_conceptos,
      this.compra_total,
      this.compra_contado_credito,
      this.classRecibeArtPago,
      this.tipoLugarRecepcion,

      this.compra_fecha_tentativa_salida,
      this.tknLugarSalida,
      this.compra_fecha_tentativa_recepcion,
      this.tknLugarRecepcion,

      this.proveedorAnticipoaplicado,
      this.aplica_recepcion_facturas,
      this.compra_observaciones,
      this.anexosCompraDocs,
      "no_pagar",
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

  registrarCompraMANUAL() {
    this._comprServ.registraCompraPorArticulos(
      this.fcontab_compra_modelo.fecha_contabilizacion,
      this.compra_fecha_vencimiento,
      this.provToken,
      this.dataCFDI_comprobante_Moneda,
      this.dataCFDI_comprobante_TipoCambio,
      this.dataCFDI_conceptos,
      this.compra_total,
      this.compra_contado_credito,
      this.classRecibeArtPago,
      this.tipoLugarRecepcion,

      this.compra_fecha_tentativa_salida,
      this.tknLugarSalida,
      this.compra_fecha_tentativa_recepcion,
      this.tknLugarRecepcion,

      this.proveedorAnticipoaplicado,
      this.aplica_recepcion_facturas,
      this.compra_observaciones,
      this.anexosCompraDocs,
      "no_pagar",
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
    this.mostrarSelectsCompra = false;
    //this.validator.limpiaInputRow(document.getElementById("fechaContabilizacionCompra"));
    //this.validator.limpiaInputRow(document.getElementById("fechaVencimientoCompra"));
    this.fcontab_compra_modelo = new comprasModeloFContabilizacion('', false);
    this.compra_fecha_vencimiento = '';
    this.ver_compras_folio();
    setTimeout(() => {
      this.mostrarSelectsCompra = true;
    });
    this.dataCFDI_conceptos = [];
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
    this.validator.limpiaTextarea(document.getElementById("compraPRODS_large_observ"));
    this.anexosCompraFiles = [];
    this.anexosCompraDocs = [];
    this.anexosCompraNames = [];
    this.aplica_recepcion_facturas = "";

    this.compra_by_prods = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}