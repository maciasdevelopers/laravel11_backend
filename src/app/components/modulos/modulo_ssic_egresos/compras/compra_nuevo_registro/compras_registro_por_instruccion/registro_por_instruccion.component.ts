import { ChangeDetectorRef, Component,OnDestroy,OnInit } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { RequisicionesService } from '../../../../../../servicios/ssic/requisiciones.service';
import { CotizacionesService } from '../../../../../../servicios/ssic/cotizaciones.service';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
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
import numeral from 'numeral';
import { takeUntil, tap } from 'rxjs/operators';
import { SeriesService } from '../../../../../../servicios/ssic/series-service.service';
import { MessageService } from 'primeng/api';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';
import { Subject } from 'rxjs';

@Component({
  selector: 'app_compras_registro_instrucion',
  templateUrl: './registro_por_instruccion.component.html',
  standalone:false,
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
    '../../../egresos.css',
    './registro_por_instruccion.component.css'
  ],
  providers: [RequisicionesService,SentinelArkManager]
})
export class RegistroCompraInstruccionComponent implements OnInit, OnDestroy {  
  //generales
  public usuario: Usuarios;
  public identidad: any;

  //listas
  lista_cotizaciones_auth:any = [];
  public requisicion_tkn:string = "";
  public cotizacion_tkn:string = "";
  public coti_token_detalle_cotizacion:string = "";
  public coti_token_desc_detalle_cotiza:string = "";
  cotizacion_selected:any = [];
  provListaTotal:any = [];
  public proveedor_token:string = '';
  public proveedor_token_registrado:boolean = false;
  public dataCFDI_emisor_new_registro:boolean = false;
  public receptFactura:boolean = false;
  public compra_contado_credito:string = '';
  prodservCatGeneral:any = [];
  dataprodservCatInsrBuscar: string = '';
  prodservCatInstruccion:any = [];
  proveedorAnticipos:any = [];
  proveedorSeleccionado:any = [];
  productosVincLista:any = [];
  searchSerieTrue:string = "";
  seriesCatalogoTrue:any = [];
  searchLotesTrue:string = "";
  listLotesTrue:any = [];
  searchPedimentosTrue:string = "";
  listaPedimentosTrue:any = [];
  validateArticulosSelected:boolean = false;
  arrayDesgloceCompra:any = [];
  catalogo_monedas_api:any = [];

  listActivosFijos:any = [];
  rangoPeriodoFijosActivos: Date[] | undefined;
  indicadorFijosActivos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  expandRowsActivoFijo: { [s: string]: boolean } = {};
  
  buscarActivosIntangibles:string = "";
  listActivosIntangibles:any = [];
  rangoPeriodoDiferidosActivos: Date[] | undefined;
  indicadorDiferidosActivos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  expandRowsActivoDiferido: { [s: string]: boolean } = {};
  amortizacion_periodos:any = [];
  arrayEstablecCompras:any = [];

  public compra_subtotal:string = numeral(0).format('0.00');
  public compra_descuento:string = numeral(0).format('0.00');
  public compra_retenciones:string = numeral(0).format('0.00');  
  public compra_traslados:string = numeral(0).format('0.00');
  public compra_total:string = numeral(0).format('0.00');

  private destroy$ = new Subject<void>();

   constructor(
    private _cotService: CotizacionesService,
    private sentinela:SentinelArkManager,
    private validator:ValidatorServService,
    private _actFijo: ActFijosService,
    private _intanServ:ActIntangiblesService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private _comprServ: ComprasServService,
    private loteServ:LotesServService,
    private pedimServ:PedimentosService,
    private translate:TranslateService,
    private serieServ:SeriesService,
    private relInterna:ComunicacionInternaService,
    private estabServ:EstablecimientosService,
    private cd: ChangeDetectorRef,
    private primeAlerts: MessageService
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.amortizacion_periodos = [
      {clave:"86400", valor:"Por día"},//clave:"periodDay",
      {clave:"604800", valor:"Por semana"},//clave:"periodWeek",
      {clave:"2629743", valor:"Por mes"},//clave:"periodMonth",
      {clave:"31556926",valor:"Por año"}//clave:"periodYear",
    ];
    this.cotizaciones_lista();  
    this.proveedoresLista();
    this.listar_catalogo_general_prod_serv();
    this.getRespuestaProveedorArticulos();
    this.getRespuestaProveedorServicios();
    this.listar_catalogo_general_prod_serv();
    this.lista_series_catalogo_true();
    this.listaLotesTrue();
    this.pedimentosTrueList();
    this.ver_activos_fijos_true('hoy');
    this.listar_activos_intang_true();
    this.proveedoresLista();
    this.monedasCatalogoApi();
    this.recargaEstablecimientos();
  }

  //Catalogo general de productos y servicios
    listar_catalogo_general_prod_serv(){
      this._comprServ.listaProdServCompras().subscribe(
        response => {
          if (response.status == 'success') {
            this.prodservCatGeneral = response.listaArticulos;
            console.log(this.prodservCatGeneral);
          }
        },
        error => {
          console.log(error);
        }
      );
    }

  //series
    lista_series_catalogo_true(){
      this.serieServ.listaSeriesvigentes().pipe(
        tap(response => {
          if (response?.status === 'success') {
            this.seriesCatalogoTrue = response.series;
            console.log(this.seriesCatalogoTrue);
          }
        })
      ).subscribe({error: error => console.log(error)});
    }

  //lotes
    listaLotesTrue(){
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
    pedimentosTrueList(){
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
        var act_buy_inst_otras_fechas = document.getElementById("act_buy_inst_otras_fechas");
        if (this.rangoPeriodoFijosActivos && this.rangoPeriodoFijosActivos.length === 2) {
          const dateInicio = this.rangoPeriodoFijosActivos[0];
          const dateFin = this.rangoPeriodoFijosActivos[1];
          if (dateInicio && dateFin) {
            const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
            const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
            if (validacionInicio && validacionFin) {
              periodo_inicio = dateInicio.toISOString().split('T')[0];
              periodo_fin = dateFin.toISOString().split('T')[0];
              this.validator.correctoInputRow(act_buy_inst_otras_fechas);
            } else {
              this.validator.errorInputRow(act_buy_inst_otras_fechas);
              return;
            }
          } else {
            this.validator.errorInputRow(act_buy_inst_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_buy_inst_otras_fechas);
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
        var act_buy_inst_otras_fechas = document.getElementById("act_buy_inst_otras_fechas");
        if (this.rangoPeriodoDiferidosActivos && this.rangoPeriodoDiferidosActivos.length === 2) {
          const dateInicio = this.rangoPeriodoDiferidosActivos[0];
          const dateFin = this.rangoPeriodoDiferidosActivos[1];
          if (dateInicio && dateFin) {
            const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
            const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
            if (validacionInicio && validacionFin) {
              periodo_inicio = dateInicio.toISOString().split('T')[0];
              periodo_fin = dateFin.toISOString().split('T')[0];
              this.validator.correctoInputRow(act_buy_inst_otras_fechas);
            } else {
              this.validator.errorInputRow(act_buy_inst_otras_fechas);
              return;
            }
          } else {
            this.validator.errorInputRow(act_buy_inst_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_buy_inst_otras_fechas);
          return;
        }
      }
  
      this._intanServ.activosIntangGet(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => this.procesar_respuesta_dif_activo(response),
        error: (err) => this.error_alerta_dif_activo(err)
      });
    }
    
    procesar_respuesta_dif_activo(response: any){
      if (response.status === 'success') {
        this.listActivosIntangibles = response.datosActivo;
        this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
      } else {
        this.listActivosIntangibles = []; // O manejar mensaje de "sin datos"
      }
    }
  
    error_alerta_dif_activo(error: any){
      console.error('Error al cargar compras:', error);
      this.listActivosIntangibles = [];
    }

  //monedas
    monedasCatalogoApi(){
      this._monedasServ.getApiMonedasCatalogo().subscribe(
        response => {
          if(response.status == 'success'){
            this.catalogo_monedas_api = response.monedas;
            console.log(this.catalogo_monedas_api);
          }
        }
      )
    }

  //establecimientos
    recargaEstablecimientos(){
      this.estabServ.listaEstablecimientoscomplete().subscribe(
        response => {
          console.log(response.status);
          if (response.status == 'success') {
            this.arrayEstablecCompras = response.listaEstablecimientos;
            console.log(this.arrayEstablecCompras);
          }
        },
        error =>{
          console.log(error);
        }
      )
    }
  
  onpresAlpha(e:KeyboardEvent){
    this.validator.key_press_alfa(e);
  }
  
  cotizaciones_lista(){
    this._cotService.cotizaciones_compra_proceso().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.lista_cotizaciones_auth = response.lista_cotizaciones;
          console.log(this.lista_cotizaciones_auth);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //proveedores
  proveedoresLista(){
    this._provServ.catalogoProveedoresForProcesos().subscribe(
      response => {
        if (response.status == 'success') {
          this.provListaTotal = response.proveedores;
          //this.proveedor_token != "" ? this.revisa_emisor_proveedor_registrado() : null;
          console.log(this.provListaTotal);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cotizacion_seleccionar(requisicion_tkn:any,cotizacion_tkn:any,coti_token_detalle_cotizacion:any,coti_token_desc_detalle_cotiza:any){
    this.cotizacion_selected = [];
    let cot = this.lista_cotizaciones_auth.find((row:any) => row.requisicion_tkn === requisicion_tkn && row.cotizacion_tkn === cotizacion_tkn && row.coti_token_detalle_cotizacion === coti_token_detalle_cotizacion && row.coti_token_desc_detalle_cotiza === coti_token_desc_detalle_cotiza)
    if (typeof cot !== 'undefined') {
      this.requisicion_tkn = cot.requisicion_tkn;
      this.cotizacion_tkn = cot.cotizacion_tkn;
      this.coti_token_detalle_cotizacion = cot.coti_token_detalle_cotizacion;
      this.coti_token_desc_detalle_cotiza = cot.coti_token_desc_detalle_cotiza;

      this.prodservCatInstruccion.push({
        "num_lista":1,
        //"NoIdentificacion": cChild.getAttribute("NoIdentificacion") ? cChild.getAttribute("NoIdentificacion") : "",
        "ObjetoImp":"",
        "ClaveProdServ":"",
        "Cantidad":cot.coti_inside_cantidad,
        "ClaveUnidad":cot.requi_necesidad_umed_name,
        "Unidad":cot.coti_inside_umed_name,
        "Descripcion":cot.requi_necesidad_concepto,
        "ValorUnitario":cot.coti_inside_precio,
        "Importe":cot.coti_inside_importe,
        "moneda_codigo":cot.coti_inside_moneda_codigo,
        "moneda_decimales":cot.coti_inside_moneda_decimales,
        //impuestos
        "articulo_descuento":cot.coti_inside_descuento,
        "articulo_retenciones":cot.coti_inside_retenciones,
        "articulo_traslados":cot.coti_inside_traslados,
        "articulo_homologado_iva":100,
        //Articulo a homologar generales
        "articulo_homologado_comprobacion":true,
        "articulo_homologado_ventana_registro":false,
        "articulo_homologado_registro_tipo":false,
        "articulo_homologado_token":"",
        "articulo_homologado_view":false,
        "articulo_homologado_nombre":"",
        "articulo_homologado_logotipo":"",
        "articulo_homologado_clasificacion":"",
        "articulo_homologado_identificador":"",
        //Articulo a homologar series
        "articulo_homologado_serie_bool":false,
        "articulo_homologado_serie_view":false,                  
        "articulo_homologado_serie_token":"",
        "articulo_homologado_serie_numero":"",
        //Articulo a homologar lotes
        "articulo_homologado_lote_bool":false,
        "articulo_homologado_lote_view":false,
        "articulo_homologado_lote_token":"",
        "articulo_homologado_lote_numero":"",
        //Articulo a homologar pedimentos
        "articulo_homologado_pedimento_bool":false,
        "articulo_homologado_pedimento_view":false,
        "articulo_homologado_pedimento_token":"",
        "articulo_homologado_pedimento_numero":"",
        //Articulo a homologar uso
        "articulo_homologado_view_uso":false,
        "articulo_homologado_uso":"",
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
        "articulo_homologado_prorratea":false,
        //gastos relacionados
        "articulo_homologado_gastos_rel":[],
        //periodicidad
        "articulo_homologado_periodicidadPc":"",
        "articulo_homologado_iteracionPc":"",
        "articulo_homologado_periodoDetIndPc":"",
        "articulo_homologado_fechaFinPc":"",
        //variabilidad de importe
        "articulo_homologado_tipoImporteVi":"",
        "articulo_homologado_monedaVi":"",
        "articulo_homologado_monedaDecimalesVi":"",
        "articulo_homologado_importeMinVi":"",
        "articulo_homologado_importeMaxVi":"",
        //desglose
        "activa_desglose": false,
      });

      this.compra_subtotal = numeral(cot.coti_inside_precio * cot.coti_inside_cantidad).format('0.'+'0'.repeat(cot.coti_inside_moneda_decimales));

      let data_prov = this.provListaTotal.find((row:any) => row.token_cat_proveedores === cot.token_cat_proveedores);
      //console.log(typeof data_prov !== 'undefined' ? 'proveedor encontrado' : 'proveedor no encontrado');
      this.proveedor_token_registrado = typeof data_prov !== 'undefined' ? true : false;
      this.receptFactura = typeof data_prov !== 'undefined' ? true : false;
      this.compra_contado_credito =  typeof data_prov !== 'undefined' && data_prov.aceptaCredito ? '' : 'contado';

      if (typeof data_prov !== 'undefined') {
        this._provServ.verDetalleProveedor(cot.token_cat_proveedores).subscribe(
          response => {
            if (response.status == 'success') {
              console.log(response);
              this.proveedorSeleccionado = response.proveedor; 
              this.proveedor_token = cot.token_cat_proveedores;
              console.log(cot.proveedor_data);
            }
          },
          error => {
            console.log(error);
          }
        );

        this.descargaDataProvComprasList(data_prov.token_cat_proveedores); 
        this.listar_anticipos_proveedor();
      }

      this.cotizacion_selected.push(cot);
      console.log(this.cotizacion_selected);

      const precio = parseFloat(cot.coti_inside_precio);
      const cantidad = parseFloat(cot.coti_inside_cantidad);
      const inside_subtotal = (precio * cantidad) - cot.coti_inside_descuento;

      this.compra_subtotal = numeral(inside_subtotal).format('0,0.'+'0'.repeat(cot.coti_inside_moneda_decimales));
      this.compra_descuento = numeral(cot.coti_inside_descuento).format('0,0.'+'0'.repeat(cot.coti_inside_moneda_decimales));
      this.compra_retenciones = numeral(cot.coti_inside_retenciones).format('0,0.'+'0'.repeat(cot.coti_inside_moneda_decimales));  
      this.compra_traslados = numeral(cot.coti_inside_traslados).format('0,0.'+'0'.repeat(cot.coti_inside_moneda_decimales));
      this.compra_total = numeral(cot.coti_inside_importe).format('0,0.'+'0'.repeat(cot.coti_inside_moneda_decimales));
      this.comprobarVinculacionArticulos();
    }
  }

  getRespuestaProveedorArticulos(){
    this.relInterna.mensajeProdInvent$.subscribe(
      (mensaje:any) => {
        mensaje == "producto registrado" ? this.descargaDataProvComprasList(this.proveedor_token) : null;
      }
    );
  }

  getRespuestaProveedorServicios(){
    this.relInterna.mensajeInsertServCompras$.subscribe(
      (mensaje:any) => {
        //$('#windowProveedorRegistro').modal('hide');
        //$('.modal-backdrop').remove();
        console.log("services reg.");
        mensaje == "servicio registrado" ? this.descargaDataProvComprasList(this.proveedor_token) : null;
      }
    );
  }

  descargaDataProvComprasList(token_cat_proveedores:any){  
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

  listar_anticipos_proveedor(){
    this._provServ.listarAnticiposProveedor(this.proveedor_token).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response.anticipos_registrados);
          this.proveedorAnticipos = response.anticipos_registrados;
        }
      }
    );
  }

  comprobarVinculacionArticulos(){
    this.prodservCatInstruccion.forEach((row:any) => {
      let prod_gral = this.prodservCatGeneral.find((row_gral:any) => row_gral.concepto.toLowerCase() === row.Descripcion.toLowerCase());
      let prod_prov = this.productosVincLista.find((prvd_row:any) => prvd_row.concepto.toLowerCase() === row.Descripcion.toLowerCase());
      row.articulo_homologado_comprobacion = typeof prod_gral === 'undefined' && typeof prod_prov === 'undefined' ? false : true; 
    });
  }

  verVentanaArticulosRegistro(inst_concept:any){
    inst_concept.articulo_homologado_ventana_registro = true;
  }

  ventanaArtRegistroTipo(inst_concept:any,tipo:any){
    inst_concept.articulo_homologado_registro_tipo = tipo;
  }

  verCatalogoProductosYServicios(inst_concept:any){
    inst_concept.articulo_homologado_view = !inst_concept.articulo_homologado_view ? true : false;
  }

  selecionaArticuloCompraXML(inst_concept:any,token_articulo:any,identificador:any,noIdentificacionXML:any){
    const index_gen_art = this.prodservCatGeneral.find((row:any) => row.token_articulo == token_articulo);

    console.log(identificador+" "+noIdentificacionXML);
    if (identificador == 'Producto' && typeof index_gen_art !== 'undefined') {
      this._comprServ.verificaArticuloProd(this.proveedor_token,token_articulo,identificador).subscribe(
        response => {
          if (response.status == 'success') {
            inst_concept.articulo_homologado_view = false;
            console.log(inst_concept);
            inst_concept.imagen = "";
            inst_concept.clasificacion = "";

            inst_concept.articulo_homologado_serie_bool = response.bool_serie;
            inst_concept.articulo_homologado_lote_bool = response.bool_lote;
            inst_concept.articulo_homologado_pedimento_bool = response.bool_pedimento;
            inst_concept.articulo_homologado_token = token_articulo;
            inst_concept.articulo_homologado_identificador = response.identificador;
            inst_concept.articulo_homologado_logotipo = index_gen_art.imagen;
            inst_concept.articulo_homologado_clasificacion = index_gen_art.clasificacion;
            this.functionValidaXmlContentArticulos(inst_concept);
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            this.functionValidaXmlContentArticulos(inst_concept);
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

    if (identificador == 'Servicio' && typeof index_gen_art !== 'undefined') {
      this._comprServ.verificaArticuloServ(this.proveedor_token,token_articulo,identificador).subscribe(
        response => {
          if (response.status == 'success') {
            inst_concept.articulo_homologado_view = false;
            console.log(inst_concept);
            inst_concept.imagen = "";
            inst_concept.clasificacion = "";

            inst_concept.articulo_homologado_token = token_articulo;
            inst_concept.articulo_homologado_identificador = response.identificador;
            inst_concept.articulo_homologado_logotipo = index_gen_art.imagen;
            inst_concept.articulo_homologado_clasificacion = index_gen_art.clasificacion;
            this.functionValidaXmlContentArticulos(inst_concept);
          }

          if (response.status == 'error') {
            let translate_response = this.translate.instant(response.message);
            //event.checked = false;
            this.functionValidaXmlContentArticulos(inst_concept);
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
  }

  verConceptoINSTProductosSeries(inst_concept:any){
    inst_concept.articulo_homologado_serie_view = !inst_concept.articulo_homologado_serie_view ? true : false;
  }

  selectPrdserieXml(inst_concept:any,serie_token:any){
    let serie = this.seriesCatalogoTrue.find((row:any) => row.serie_token == serie_token);
    inst_concept.articulo_homologado_serie_token = serie.serie_token;
    inst_concept.articulo_homologado_serie_numero = serie.serie_codigo;
    this.functionValidaXmlContentArticulos(inst_concept);
  }

  verConceptoINSTProductosLote(inst_concept:any){
    inst_concept.articulo_homologado_lote_view = !inst_concept.articulo_homologado_lote_view ? true : false;
  }

  selectPrdLoteXml(inst_concept:any,token_lote:any){
    let lote = this.listLotesTrue.find((row:any) => row.token_lote == token_lote);
    inst_concept.articulo_homologado_lote_token = lote.token_lote;
    inst_concept.articulo_homologado_lote_numero = lote.numero_lote;
    this.functionValidaXmlContentArticulos(inst_concept);
  }

  verConceptoINSTProductosPedimentoAduanal(inst_concept:any){
    inst_concept.articulo_homologado_pedimento_view = !inst_concept.articulo_homologado_pedimento_view ? true : false;
  }

  selectPrdPedimentoXml(inst_concept:any,token_pedimento:any){
    let pad = this.listaPedimentosTrue.find((row:any) => row.token_pedimento == token_pedimento);
    inst_concept.articulo_homologado_pedimento_token = pad.token_pedimento;
    inst_concept.articulo_homologado_pedimento_numero = pad.numero_pedimento;
    this.functionValidaXmlContentArticulos(inst_concept);
  }

  verConceptoINSTUsoActivo(inst_concept:any){
    inst_concept.articulo_homologado_view_uso = !inst_concept.articulo_homologado_view_uso ? true : false;
  }

  selectUsoArticuloXml(event:any,inst_concept:any){
    inst_concept.articulo_homologado_uso = event.value != '' ? event.value : '';
    this.functionValidaXmlContentArticulos(inst_concept);
  }

  verConceptoINSTActivosLista(inst_concept:any){
    console.log(inst_concept.articulo_homologado_identificador);
    inst_concept.articulo_homologado_view_activos = !inst_concept.articulo_homologado_view_activos ? true : false;
  }

  //selectActivoXml(inst_concept:any,token_activo:any){
  //  console.log(inst_concept.articulo_homologado_identificador); 
  //  inst_concept.articulo_homologado_activoFijo = inst_concept.articulo_homologado_uso == 'activo_fijo' ? token_activo : '';
  //  inst_concept.articulo_homologado_activoDiferido = inst_concept.articulo_homologado_uso == 'activo_intangible' ? token_activo : '';
  //  this.functionValidaXmlContentArticulos(inst_concept);
  //}

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
    row_man_concept.articulo_homologado_activoDiferido = row_man_concept.articulo_homologado_uso == 'activo_intangible' ? row_man_concept.temp_activo_diferido : '';
    if (row_man_concept.articulo_homologado_uso == 'activo_fijo') {
      row_man_concept.articulo_homologado_activo_diferido_foliado = [...row_man_concept.temp_activo_diferido_foliado];
    }
    row_man_concept.temp_activo_diferido = "";
    row_man_concept.temp_activo_diferido_foliado = [];
    row_man_concept.articulo_homologado_view_activos = false;
    this.functionValidaXmlContentArticulos(row_man_concept);
  }

  selectProrrateoCompra(inst_concept:any,event:any){
    inst_concept.articulo_homologado_prorratea = event.checked;
  }

  validarGeneralArticulo(concepto:any){
    if (!concepto.articulo_homologado_clasificacion || !concepto.Importe || !concepto.articulo_homologado_token || !concepto.articulo_homologado_identificador) {
      //throw new Error('Faltan datos obligatorios en el concepto.');
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el concepto.'});
      return false;
    }

    if (!concepto.articulo_homologado_serie_bool && !concepto.articulo_homologado_lote_bool && !concepto.articulo_homologado_pedimento_bool && !concepto.articulo_homologado_uso) {
      //throw new Error('Faltan datos obligatorios en el concepto.');
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el uso del producto.'});
      return false;
    }

    if (concepto.articulo_homologado_identificador === 'Producto') {
      if (concepto.articulo_homologado_serie_bool && !concepto.articulo_homologado_serie_token) {
        //throw new Error('Falta información de serie.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de serie.'});
        return false;
      }
      if (concepto.articulo_homologado_lote_bool && !concepto.articulo_homologado_lote_token) {
        //throw new Error('Falta información de lote.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de lote.'});
        return false;
      }
      if (concepto.articulo_homologado_pedimento_bool && !concepto.articulo_homologado_pedimento_token) {
        //throw new Error('Falta información de pedimento.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de pedimento.'});
        return false;
      }

      if (!concepto.articulo_homologado_uso) {
        //throw new Error('Faltan datos obligatorios en el concepto.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el uso del producto.'});
        return false;
      }

      if (concepto["articulo_homologado_uso"] === 'activo_fijo' && !concepto.articulo_homologado_activoFijo) {
        //throw new Error('Falta información de activo fijo.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de activo fijo.'});
        return false;
      }

      if (concepto.articulo_homologado_uso === 'activo_intangible' && !concepto.articulo_homologado_activoDiferido) {
        //throw new Error('Falta información de activo intangible.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de activo intangible.'});
        return false;
      } 

      return true;
    } else if (concepto.articulo_homologado_identificador === 'Servicio') {

      if (!concepto.articulo_homologado_uso) {
        //throw new Error('Faltan datos obligatorios en el concepto.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Faltan datos obligatorios en el uso del servicio.'});
        return false;
      }

      if (concepto.articulo_homologado_uso === 'activo_intangible' && !concepto.articulo_homologado_activoDiferido) {
        //throw new Error('Falta información de activo intangible.');
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Falta información de activo intangible.'});
        return false;
      } 
      return true;
    } else {
      //throw new Error('Identificador de artículo no reconocido.');
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Identificador de artículo no reconocido.'});
      return false;
    }
  }

  functionValidaXmlContentArticulos(inst_concept:any){
    try {
      var result_validacion:any = this.validarGeneralArticulo(inst_concept);
      console.log(result_validacion);
      this.validateArticulosSelected = result_validacion;
      inst_concept.activa_desglose = result_validacion;
    } catch (error:any) {
      this.validateArticulosSelected = false;
      //console.error('Error en la validación de conceptos:', error.message);
    }
  }

  selectAarticuloXml(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar estos articulos a la lista de compra?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, agregar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        const atr_filtro = this.prodservCatInstruccion.filter((row:any) => row.activa_desglose === true);
        this.arrayDesgloceCompra = atr_filtro;
        console.log(this.arrayDesgloceCompra);
        this.validateArticulosSelected = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
