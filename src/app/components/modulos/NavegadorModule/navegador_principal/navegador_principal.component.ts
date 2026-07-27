import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { EmpresasServService } from '../../../../servicios/ssic/empresas-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { HttpCancelService } from '../../../../servicios/ssic/http-cancel.service';
import { Router } from '@angular/router';
import { Subject, interval, takeUntil, timer } from 'rxjs';
import { DatePipe } from '@angular/common';
//import { getMessaging, getToken, onMessage } from "@angular/fire/compat/messaging";
import { NotificacionesService } from '../../../../servicios/notificaciones.service';
import { ServNavSuperiorService } from '../../../../servicios/ssic/serv-nav-superior.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SessionContextService } from '../../../../servicios/session-context';

@Component({
  selector: 'nav_principal_inside_app',
  templateUrl: './navegador_principal.component.html',
  standalone: false,
  styleUrls: [
    './navegador_principal.component.css',
    '../../../../styles/navegador.css',
    '../../../../styles/landing.css',
    '../../../../styles/datatable.css',
    '../../../../styles/input_group.css',
    '../../../../styles/images.css',
    '../../../../styles/buttons.css',
    '../../../../styles/loading.css',
    '../../../../styles/collection.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/passValidate.css',
    '../../../../styles/parallax.css',
    '../../../../styles/tooltips.css',
    '../../../../styles/colores.css',
    '../../../../styles/switches.css',
  ],
  providers: [MessageService, ConfirmationService]
})
export class NavegadorPrincipalComponent implements OnInit, OnDestroy {
  public isCollapsedNavegador: boolean = true;
  public sidebarVisible: boolean = false;
  public isCollapsedSSIC: boolean = true;
  listaModulos: any[] = [];
  listEmpresasVinc: any = [];
  public modalEmpresasVinculadasAlUsuarioVisible: boolean = false;
  public modalNotificacionesAlUsuarioVisible: boolean = false;
  menuItems: any = [];
  boolModuloElegido: boolean = false;

  public identidad: any;

  //fechas
  public pipe: any;
  public fechaCDMX_semana: string = "";
  public fechaCDMX_dia: string = "";
  public fechaCDMX_mes: string = "";
  public fechaCDMX_ano: string = "";
  public horaCDMX: string = "";
  pipeCDMX = new DatePipe('es_MX');//
  public fechaLocal_semana: string = "";
  public fechaLocal_dia: string = "";
  public fechaLocal_mes: string = "";
  public fechaLocal_ano: string = "";
  public horaLocal: string = "";
  public zona_horaria_utc: string = "";

  //perfiles de usuario
  public settings_lenguaje_string: string;
  public selected: string = 'None';
  options = {};

  //menuSSIC:any = []; 
  menuSSIC: any = [];
  //TreeNode this.dataTree: TreeNode[];
  menuTercAssoc: any = [];
  menuTercClientes: any = [];
  menuUserCotizaciones: any = [];
  menuTercProveedores: any = [];
  menuLogistica: any = [];
  menuTercEmpleados: any = [];
  menuDescargaXML: any = [];
  menuGestionProyectos: any = [];
  menuPerfilEmpresa: any = [];
  menuPerfilUsuario: any = [];

  getMenuForModule(moduloNombre: string) {
    switch (moduloNombre) {
      case 'ssic': return this.menuSSIC;
      case 'ter_asoc': return this.menuTercAssoc;
      case 'ter_cli': return this.menuTercClientes;
      case 'cotizaciones': return this.menuUserCotizaciones;
      case 'ter_prv': return this.menuTercProveedores;
      case 'logistica': return this.menuLogistica;
      case 'ter_emp': return this.menuTercEmpleados;
      case 'descarga_xml': return this.menuDescargaXML;
      case 'gestion_proyectos': return this.menuGestionProyectos;
      default: return null;
    }
  }
  notificaciones_sin_leer: number = 0;
  notificacionesList: any = [];
  empresa_to_access: any = null;

  expandedKeys: { [key: string]: boolean } = {};

  private destruiyeNavBar$ = new Subject<void>();

  constructor(
    private routerr: Router,
    private translate: TranslateService,
    private httpCancelServ: HttpCancelService,
    private navSupServ: ServNavSuperiorService,
    private cd: ChangeDetectorRef,
    private sentinela: SentinelArkManager,
    private primeAlerts: MessageService,
    private sessionContext: SessionContextService,
    private notifServ: NotificacionesService,
    private empService: EmpresasServService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.pipe = new DatePipe(this.sessionContext.empresa_data?.codigo_pais);//'es_MX'
    this.zona_horaria_utc = 'UTC-6';
    this.settings_lenguaje_string = "" + localStorage.getItem('system_lenguaje');
    // console.log(this.sessionContext.lenguaje);
    // this.translate.use(this.sessionContext.lenguaje/*this.settings_lenguaje_string*/);
  }

  ngOnInit(): void {
    this.sessionContext.lenguaje$.pipe(takeUntil(this.destruiyeNavBar$)).subscribe(lang => {
      if (lang) {
        this.translate.use(lang);
      }
    });
    this.sessionContext.modulos$.subscribe(modulos => {
      this.listaModulos = modulos.map((m: any) => ({ ...m, expanded: false }));
    });
    this.sessionContext.empresa$().subscribe(empresa => {
      this.empresa_to_access = empresa;
    });
    this.inicializaMenus();
    this.listenNotificaciones();
    //this.servMouse.tiempo_inactivo_contador();
    this.listaEmpresasVinculadasUser();
    this.relojAutomatico();
    this.getPermLogin();

    const contadorReloj = interval(1000);
    contadorReloj.pipe(takeUntil(this.destruiyeNavBar$)).subscribe((n: any) => {
      this.relojAutomatico();
    });
    //setInterval(() => this.notificaComprasPriodicasDia(), 300000);
  }

  listenNotificaciones() {
    this.notifServ.getNotificacionesSinLeerUser().pipe(takeUntil(this.destruiyeNavBar$)).subscribe(
      (data) => {
        this.notificaciones_sin_leer = data.length;
        this.cd.detectChanges();
      }
    );
    this.notifServ.getNotificacionesUser().pipe(takeUntil(this.destruiyeNavBar$)).subscribe(
      (data) => {
        this.notificacionesList = data;
        this.cd.detectChanges();
        console.log(this.notificacionesList);
      }
    );
    //this.routerr.navigate(['./plataformas/ssic/contabilidad/catalogos/activos_fijos']);
  }

  inicializaMenus() {
    const es_admin_emp = this.sessionContext.empresa_data?.es_administradora;
    console.log(es_admin_emp);

    this.menuSSIC = [
      {
        key: '0', label: 'ssic_menu_ger', data: 'folder_monitoreo',
        children: [
          {
            key: '0-0', label: 'menu_moni', data: 'folder_monitoreo',
            children: [
              {
                key: '0-0-0', label: 'menu_pos_notes',
                children: [
                  { key: '0-0-0-0', label: 'menu_notes_cat', link: './plataformas/ssic/ingresos/mostrador/ventas_catalogo' },
                  { key: '0-0-0-1', label: 'menu_notes_new', link: './plataformas/ssic/ingresos/mostrador/ventas_registro' }
                ]
              },
              {
                key: '0-0-1', label: 'menu_sales_orders',
                children: [
                  { key: '0-0-1-0', label: 'menu_orders_cat', link: './plataformas/ssic/ingresos/listadepedidos' },
                  { key: '0-0-1-1', label: 'menu_orders_new', link: './plataformas/ssic/ingresos/altadeopedidos' }
                ]
              },
              { key: '0-0-2', label: 'menu_cust_adv', link: './plataformas/ssic/ingresos/anticipos_de_clientes' },
              { key: '0-0-3', label: 'menu_prod_deliv', link: './plataformas/ssic/ingresos/entrega_de_productos_al_cliente' },
              { key: '0-0-4', label: 'menu_sales_ret', link: './plataformas/ssic/ingresos/devoluciones_sobre_ventas' },
              { key: '0-0-5', label: 'menu_credit_notes', link: './plataformas/ssic/ingresos/notas_de_credito' },
              { key: '0-0-6', label: 'menu_cfdi_req', link: './plataformas/ssic/ingresos/solicitud_para_emision_de_cfdi' },
              { key: '0-0-7', label: 'menu_invoicing', link: './plataformas/ssic/ingresos/facturacion_fiscal_mx' },
              { key: '0-0-8', label: 'Notas de crédito (Fiscal MX)', link: './plataformas/ssic/ingresos/notas_de_credito_fiscal_mx' },
              { key: '0-0-9', label: 'menu_debit_notes', link: './plataformas/ssic/ingresos/notas_de_credito_fiscal_mx' },
              { key: '0-0-10', label: 'Comisiones', link: './plataformas/ssic/gerencia/comisiones_catalogo' }
            ]
          },
          {
            key: '0-1', label: 'Reportes', data: 'folder_reportes',
            children: [
              { key: '0-1-0', label: 'clientes', link: './plataformas/ssic/ingresos/catalogodeclientes' },
              { key: '0-1-1', label: 'Productos para venta', link: './plataformas/ssic/ingresos/productos_para_venta' },
              { key: '0-1-2', label: 'Servicios para venta', link: './plataformas/ssic/ingresos/servicios_para_venta' },
              { key: '0-1-3', label: 'impuestos aplicables a las ventas', link: './plataformas/ssic/ingresos/impuestos_aplicables_a_ventas' },
              { key: '0-1-4', label: 'descuentos', link: './plataformas/ssic/ingresos/catalogodedescuentos' },
              { key: '0-1-5', label: 'promociones', link: './plataformas/ssic/ingresos/catalogodepromociones' },
            ]
          },
          {
            key: '0-2', label: 'Reportes administrativos', data: 'folder_reportes_admin',
            children: [
              { key: '0-2-0', label: 'Lista general de partidas', link: './plataformas/ssic/ingresos/lista_general_de_partidas' },
              { key: '0-2-1', label: 'Lista de partidas abiertas', link: './plataformas/ssic/ingresos/lista_de_partidas_abiertas' },
              { key: '0-2-2', label: 'Lista de partidas cerradas', link: './plataformas/ssic/ingresos/lista_de_partidas_cerradas' },
              { key: '0-2-3', label: 'Reporte de ventas brutas', link: './plataformas/ssic/ingresos/ventas_brutas' },
              { key: '0-2-4', label: 'Reporte de ventas después de descuentos', link: './plataformas/ssic/ingresos/ventas_despues_de_descuentos' },
              { key: '0-2-5', label: 'Reporte de devoluciones', link: './plataformas/ssic/ingresos/reporte_de_devoluciones' },
              { key: '0-2-6', label: 'Costo de ventas', link: './plataformas/ssic/ingresos/costo_de_ventas' },
              { key: '0-2-7', label: 'Reporte de ventas netas', link: './plataformas/ssic/ingresos/reporte_de_ventas_netas' },
              { key: '0-2-8', label: 'Antigüedad de saldos por cobrar', link: './plataformas/ssic/ingresos/antigüedad_de_saldos_por_cobrar' },
              { key: '0-2-9', label: 'Consulta de algún reporte espeifico sobre ventas', link: './plataformas/ssic/ingresos/reporte_especifico_sobre_ventas' },
              { key: '0-2-10', label: 'Conciliación fiscal-contable relacionada con ventas', link: './plataformas/ssic/ingresos/conciliacion_fiscal-contable_relacionada_con_ventas' },
            ]
          },
          {
            key: '0-3', label: 'Reportes financieros', data: 'folder_reportes_financieros',
            children: [
              { key: '0-3-0', label: 'Lista general de partidas', link: './plataformas/ssic/ingresos/lista_general_de_partidas' },
              { key: '0-3-1', label: 'Lista de partidas abiertas', link: './plataformas/ssic/ingresos/lista_de_partidas_abiertas' },
              { key: '0-3-2', label: 'Lista de partidas cerradas', link: './plataformas/ssic/ingresos/lista_de_partidas_cerradas' },
              { key: '0-3-3', label: 'Reporte de ventas brutas', link: './plataformas/ssic/ingresos/ventas_brutas' },
              { key: '0-3-4', label: 'Reporte de ventas después de descuentos', link: './plataformas/ssic/ingresos/ventas_despues_de_descuentos' },
              { key: '0-3-5', label: 'Reporte de devoluciones', link: './plataformas/ssic/ingresos/reporte_de_devoluciones' },
              { key: '0-3-6', label: 'Costo de ventas', link: './plataformas/ssic/ingresos/costo_de_ventas' },
              { key: '0-3-7', label: 'Reporte de ventas netas', link: './plataformas/ssic/ingresos/reporte_de_ventas_netas' },
              { key: '0-3-8', label: 'Antigüedad de saldos por cobrar', link: './plataformas/ssic/ingresos/antigüedad_de_saldos_por_cobrar' },
              { key: '0-3-9', label: 'Consulta de algún reporte espeifico sobre ventas', link: './plataformas/ssic/ingresos/reporte_especifico_sobre_ventas' },
              { key: '0-3-10', label: 'Conciliación fiscal-contable relacionada con ventas', link: './plataformas/ssic/ingresos/conciliacion_fiscal-contable_relacionada_con_ventas' },
            ]
          },
          {
            key: '0-4', label: 'Reportes contables', data: 'folder_reportes_contables',
            children: [
              { key: '0-4-0', label: 'Lista general de partidas', link: './plataformas/ssic/ingresos/lista_general_de_partidas' },
              { key: '0-4-1', label: 'Lista de partidas abiertas', link: './plataformas/ssic/ingresos/lista_de_partidas_abiertas' },
              { key: '0-4-2', label: 'Lista de partidas cerradas', link: './plataformas/ssic/ingresos/lista_de_partidas_cerradas' },
              { key: '0-4-3', label: 'Reporte de ventas brutas', link: './plataformas/ssic/ingresos/ventas_brutas' },
              { key: '0-4-4', label: 'Reporte de ventas después de descuentos', link: './plataformas/ssic/ingresos/ventas_despues_de_descuentos' },
              { key: '0-4-5', label: 'Reporte de devoluciones', link: './plataformas/ssic/ingresos/reporte_de_devoluciones' },
              { key: '0-4-6', label: 'Costo de ventas', link: './plataformas/ssic/ingresos/costo_de_ventas' },
              { key: '0-4-7', label: 'Reporte de ventas netas', link: './plataformas/ssic/ingresos/reporte_de_ventas_netas' },
              { key: '0-4-8', label: 'Antigüedad de saldos por cobrar', link: './plataformas/ssic/ingresos/antigüedad_de_saldos_por_cobrar' },
              { key: '0-4-9', label: 'Consulta de algún reporte espeifico sobre ventas', link: './plataformas/ssic/ingresos/reporte_especifico_sobre_ventas' },
              { key: '0-4-10', label: 'Conciliación fiscal-contable relacionada con ventas', link: './plataformas/ssic/ingresos/conciliacion_fiscal-contable_relacionada_con_ventas' },
            ]
          },
        ]
      },
      {
        key: '1', label: 'ssic_menu_ing', data: 'folder_monitoreo',
        children: [
          { key: '1-0', label: 'Ventas', link: './plataformas/ssic/ingresos/registro_de_ventas' },
          {
            key: '1-1', label: 'Catalogos',
            children: [
              { key: '1-1-0', label: 'clientes', link: './plataformas/ssic/ingresos/catalogodeclientes' },
              { key: '1-1-4', label: 'descuentos', link: './plataformas/ssic/ingresos/catalogodedescuentos' },
              { key: '1-1-5', label: 'promociones', link: './plataformas/ssic/ingresos/catalogodepromociones' },
              { key: '1-1-6', label: 'Impuestos aplicables a las ventas', link: './plataformas/ssic/contabilidad/catalogo_general_impuestos' },
            ]
          },
          {
            key: '1-2', label: 'cancel_soli', link: './plataformas/ssic/ingresos/solicitudes_de_cancelacion'
          },
          {
            key: '1-3', label: 'Reportes',
            children: [
              { key: '1-3-0', label: 'Lista general de partidas', link: './plataformas/ssic/ingresos/lista_general_de_partidas' },
              { key: '1-3-1', label: 'Lista de partidas abiertas', link: './plataformas/ssic/ingresos/lista_de_partidas_abiertas' },
              { key: '1-3-2', label: 'Lista de partidas cerradas', link: './plataformas/ssic/ingresos/lista_de_partidas_cerradas' },
              { key: '1-3-3', label: 'Reporte de ventas brutas', link: './plataformas/ssic/ingresos/ventas_brutas' },
              { key: '1-3-4', label: 'Reporte de ventas después de descuentos', link: './plataformas/ssic/ingresos/ventas_despues_de_descuentos' },
              { key: '1-3-5', label: 'Reporte de devoluciones', link: './plataformas/ssic/ingresos/reporte_de_devoluciones' },
              { key: '1-3-6', label: 'Costo de ventas', link: './plataformas/ssic/ingresos/costo_de_ventas' },
              { key: '1-3-7', label: 'Reporte de ventas netas', link: './plataformas/ssic/ingresos/reporte_de_ventas_netas' },
              { key: '1-3-8', label: 'Antigüedad de saldos por cobrar', link: './plataformas/ssic/ingresos/antigüedad_de_saldos_por_cobrar' },
              { key: '1-3-9', label: 'Consulta de algún reporte espeifico sobre ventas', link: './plataformas/ssic/ingresos/reporte_especifico_sobre_ventas' },
              { key: '1-3-10', label: 'Conciliación fiscal-contable relacionada con ventas', link: './plataformas/ssic/ingresos/conciliacion_fiscal-contable_relacionada_con_ventas' },
            ]
          }
          /*
          children:[
            {key:'0-0-9-0',label:'Solicitudes de facturación',link:'./plataformas/ssic/ingresos/solicitudes_facturacion'},
            {key:'0-0-9-1',label:'Registro de nueva factura',link:'./plataformas/ssic/ingresos/nueva_factura'}
          ]
          */
        ]
      },
      {
        key: '2', label: 'ssic_menu_egr', data: 'folder_monitoreo',
        children: [
          { key: '2-0', label: 'Compras', link: './plataformas/ssic/egresos/ordenes_de_compra' },
          { key: '2-1', label: 'Logistica de compras', link: './plataformas/ssic/egresos/logistica_de_compras' },
          { key: '2-2', label: 'Comisiones y reembolsos', link: './plataformas/ssic/egresos/comisiones_y_reembolsos' },
          { key: '2-3', label: 'Solicitudes de cancelación', link: './plataformas/ssic/egresos/solicitudes_de_cancelacion' },
          {
            key: '2-4', label: 'Catalogos',
            children: [
              { key: '2-4-0', label: 'Proveedores', link: './plataformas/ssic/egresos/proveedores' },
              { key: '2-4-1', label: 'Impuestos aplicables a las compras', link: './plataformas/ssic/contabilidad/catalogo_general_impuestos' },

            ]
          },
          {
            key: '2-5', label: 'Reportes',
            children: [
              { key: '2-5-0', label: 'Lista general de partidas', link: './plataformas/ssic/egresos/lista_general_de_partidas' },
              { key: '2-5-1', label: 'Lista de partidas abiertas', link: './plataformas/ssic/egresos/lista_de_partidas_abiertas' },
              { key: '2-5-2', label: 'Lista de partidas cerradas', link: './plataformas/ssic/egresos/lista_de_partidas_cerradas' },
              { key: '2-5-3', label: 'Reporte de compra de productos', link: './plataformas/ssic/egresos/reporte_de_compra_de_productos' },
              { key: '2-5-4', label: 'Reporte de contratación de servicios', link: './plataformas/ssic/egresos/reporte_de_contratacion_de_servicios' },
              { key: '2-5-5', label: 'Antigüedad de saldos por pagar', link: './plataformas/ssic/egresos/antigüedad_de_saldos_por_pagar' },
              { key: '2-5-6', label: 'Conciliación fiscal-contable relacionada con compras', link: './plataformas/ssic/egresos/conciliacion_fiscal-contable_relacionada_con_compras' },
            ]
          },
        ]
      },
      {
        key: '3', label: 'ssic_menu_inven', data: 'folder_monitoreo',
        children: [
          {
            key: '3-0', label: 'Registros relacionados con movimientos al inventario',
            children: [
              { key: '3-0-0', label: 'Ordenes de recepción', link: './plataformas/ssic/inventarios/ordenes_de_recepcion' },
              { key: '3-0-1', label: 'Reporte de incidencias en inventarios', link: './plataformas/ssic/inventarios/reporte_de_incidencias' },
              { key: '3-0-2', label: 'Articulos alternos', link: './plataformas/ssic/inventarios/articulos_alternos' },
              { key: '3-0-3', label: 'Ajustes a los costos por arribo de mercancias compradas', link: './plataformas/ssic/inventarios/ajustes_a_los_costos_por_arribo_de_mercancias_compradas' },
              { key: '3-0-4', label: 'Bloqueo/desbloqueo de existencias', link: './plataformas/ssic/inventarios/bloqueo_desbloqueo_de_existencias' },
              { key: '3-0-5', label: 'Ajustes manuales a los inventarios', link: './plataformas/ssic/inventarios/ajustes_manuales_a_los_inventarios' },
            ]
          },
          {
            key: '3-1', label: 'Catalogos',
            children: [
              { key: '3-1-0', label: 'Productos', link: './plataformas/ssic/inventarios/productos' },
              { key: '3-1-1', label: 'Servicios', link: './plataformas/ssic/inventarios/servicios' },
              { key: '3-1-2', label: 'Códigos de barras', link: './plataformas/ssic/inventarios/codigos_de_barras' },
              { key: '3-1-3', label: 'Lotes', link: './plataformas/ssic/inventarios/lotes' },
              { key: '3-1-4', label: 'Pedimentos aduanales', link: './plataformas/ssic/inventarios/pedimentos_aduanales' },
              { key: '3-1-5', label: 'Series', link: './plataformas/ssic/inventarios/series' },
              { key: '3-1-6', label: 'Lineas de productos', link: './plataformas/ssic/inventarios/lineas_de_productos' },
              { key: '3-1-7', label: 'Departamentos', link: './plataformas/ssic/inventarios/departamentos' },
              { key: '3-1-8', label: 'Activos fijos', link: './plataformas/ssic/inventarios/activos_fijos' },
              { key: '3-1-9', label: 'Activos diferidos', link: './plataformas/ssic/inventarios/activos_diferidos' },
              { key: '3-1-10', label: 'Establecimientos', link: './plataformas/ssic/inventarios/establecimientos' },
              { key: '3-1-10', label: 'Listas de precios', link: './plataformas/ssic/inventarios/lista_de_precios' },
              { key: '3-1-10', label: 'unidades de medida', link: './plataformas/ssic/inventarios/unidades_de_medida' },
            ]
          },
          {
            key: '3-2', label: 'Reportes',
            children: [
              //children:[
              //  {key:'3-2-0-0',label:'Catálogo de productos',link:'./plataformas/ssic/inventarios/catalogodeproductos'},
              //  {key:'3-2-0-1',label:'Alta de productos',link:'./plataformas/ssic/inventarios/altadeproductos'},
              //  {key:'3-2-0-2',label:'Catálogo de pedimentos aduanales',link:'./plataformas/ssic/inventarios/catalogodepedimentos'},
              //  {key:'3-2-0-3',label:'Alta de pedimentos aduanales',link:'./plataformas/ssic/inventarios/altadepedimentos'},
              //]
              { key: '3-2-0', label: 'Lista general de productos y servicios', link: './plataformas/ssic/inventarios/lista_general_de_productos_y_servicios' },
              { key: '3-2-1', label: 'Kardex', link: './plataformas/ssic/inventarios/kardex_de_inventarios' },
              { key: '3-2-2', label: 'Reporte de stock', link: './plataformas/ssic/inventarios/reporte_de_stock' },
              { key: '3-2-3', label: 'Reporte de productos comprometidos', link: './plataformas/ssic/inventarios/reporte_de_productos_comprometidos' },
              { key: '3-2-4', label: 'Reporte de productos en tránsito por compra', link: './plataformas/ssic/inventarios/reporte_de_productos_transito_por_compra' },
              { key: '3-2-5', label: 'Reporte de productos en tránsito por venta', link: './plataformas/ssic/inventarios/reporte_de_productos_transito_por_venta' },
              { key: '3-2-6', label: 'Reporte de rotación de productos', link: './plataformas/ssic/inventarios/reporte_de_rotacion_de_productos' },
              { key: '3-2-7', label: 'Establecimientos' },
            ]
          }
        ]
      },
      {
        key: '4', label: 'ssic_menu_prod', data: 'folder_monitoreo',
        children: [
          {
            key: '4-0', label: 'Planeación',
            children: [
              { key: '4-0-0', label: 'Lista de recursos para producción', link: './plataformas/ssic/produccion_en_proceso/lista_de_recursos_para_produccion' },
              { key: '4-0-1', label: 'Materia prima planeada', link: './plataformas/ssic/produccion_en_proceso/materia_prima_planeada' },
              { key: '4-0-2', label: 'Recurso humano planeado', link: './plataformas/ssic/produccion_en_proceso/recurso_humano_planeado' },
              { key: '4-0-3', label: 'Otros conceptos planeados', link: './plataformas/ssic/produccion_en_proceso/otros_conceptos_planeados' },
              { key: '4-0-4', label: 'Cronología de trabajo', link: './plataformas/ssic/produccion_en_proceso/cronologia_del_trabajo' },
            ]
          },
          {
            key: '4-1', label: 'Producción',
            children: [
              { key: '4-1-0', label: 'Orden de producción', link: './plataformas/ssic/produccion_en_proceso/orden_de_produccion' },
              { key: '4-1-1', label: 'Recibo de materiales para producción', link: './plataformas/ssic/produccion_en_proceso/recibo_de_materiales_para_produccion' },
              { key: '4-1-2', label: 'Recursos consumidos durante la producción', link: './plataformas/ssic/produccion_en_proceso/recursos_consumidos_durante_la_produccion' }
            ]
          },
          {
            key: '4-2', label: 'Reportes',
            children: [
              { key: '4-2-0', label: 'Lista general de partidas', link: './plataformas/ssic/produccion_en_proceso/lista_general_de_partidas' },
              { key: '4-2-1', label: 'Lista de partidas abiertas', link: './plataformas/ssic/produccion_en_proceso/lista_de_partidas_abiertas' },
              { key: '4-2-2', label: 'Lista de partidas cerradas', link: './plataformas/ssic/produccion_en_proceso/lista_de_partidas_cerradas' },
              { key: '4-2-3', label: 'Reporte comparativo entre planeado y ejecutado', link: './plataformas/ssic/produccion_en_proceso/reporte_comparativo_entre_planeado_y_ejecutado' }
            ]
          }
        ]
      },
      {
        key: '5', label: 'ssic_menu_fnzs', data: 'folder_monitoreo',
        children: [
          { key: '5-0', label: 'Ordenes de cobro', link: './plataformas/ssic/finanzas/ordenes_de_cobro' },
          { key: '5-1', label: 'Ordenes de pago', link: './plataformas/ssic/finanzas/ordenes_de_pago' },
          { key: '5-1', label: 'Ordenes de dispersión de nómina', link: './plataformas/ssic/finanzas/ordenes_de_dispersion_de_nomina' },
          {
            key: '5-2', label: 'Registro de movimientos financieros',
            children: [
              { key: '5-2-0', label: 'Registro de entrada de dinero', link: './plataformas/ssic/finanzas/registro_de_entrada_de_dinero' },
              { key: '5-2-1', label: 'Registro de salida de dinero', link: './plataformas/ssic/finanzas/registro_de_salida_de_dinero' },
              { key: '5-2-2', label: 'Movimiento entre cuentas propias', link: './plataformas/ssic/finanzas/movimientos_entre_cuentas_propias' },
              { key: '5-2-3', label: 'Reconciliación interna financiera', link: './plataformas/ssic/finanzas/reconciliacion_interna_financiera' },
              { key: '5-2-4', label: 'Registro manual de ajustes', link: './plataformas/ssic/finanzas/registro_manual_de_ajustes' },
              { key: '5-2-5', label: 'Corte financiero de punto de notas de venta mostrador', link: './plataformas/ssic/finanzas/corte_financiero_de_punto_de_notas_de_venta_mostrador' },
              { key: '5-2-6', label: 'Conciliación de fondo de caja', link: './plataformas/ssic/finanzas/conciliacion_de_fondo_de_caja' },
              { key: '5-2-7', label: 'Conciliación bancaria', link: './plataformas/ssic/finanzas/conciliacion_bancaria' },
              { key: '5-2-8', label: 'Conciliación de monederos electrónicos', link: './plataformas/ssic/finanzas/conciliacion_de_monederos_electronicos' },
              { key: '5-2-9', label: 'Conciliación de plataformas electrónicas', link: './plataformas/ssic/finanzas/conciliacion_de_plataformas_electronicas' }
            ]
          },
          {
            key: '5-3', label: 'Catalogos',
            children: [
              { key: '5-3-0', label: 'Acreedores', link: './plataformas/ssic/finanzas/acreedores' },
              { key: '5-3-1', label: 'Deudores', link: './plataformas/ssic/finanzas/deudores' },
              { key: '5-3-2', label: 'Punto de venta mostrador', link: './plataformas/ssic/finanzas/punto_de_venta' },
              { key: '5-3-3', label: 'Fondo de caja', link: './plataformas/ssic/finanzas/cajas' },
              { key: '5-3-4', label: 'Cuentas bancarias', link: './plataformas/ssic/finanzas/cuentas_bancarias' },
              { key: '5-3-5', label: 'Dispositivos', link: './plataformas/ssic/finanzas/dispositivos' },
              { key: '5-3-6', label: 'Monederos electrónicos', link: './plataformas/ssic/finanzas/monederos_electronicos' },
              { key: '5-3-7', label: 'Plataformas electrónicas', link: './plataformas/ssic/finanzas/plataformas_electronicas' },
              { key: '5-3-8', label: 'Federación estados y municipios', link: './plataformas/ssic/finanzas/federacion_estados_y_municipios' },
              { key: '5-3-9', label: 'Indicadores económicos', link: './plataformas/ssic/finanzas/indicadores_economicos' },
              { key: '5-3-10', label: 'Monedas y divisas', link: './plataformas/ssic/finanzas/monedas_y_divisas' },
            ]
          },
          {
            key: '5-4', label: 'Reportes',
            children: [
              { key: '5-4-0', label: 'Estado de movimientos financieros', link: './plataformas/ssic/finanzas/estado_de_movimientos_financieros' }
            ]
          },
          {
            key: '5-5', label: 'Solicitudes de cancelación', link: './plataformas/ssic/finanzas/solicitudes_de_cancelacion'
          },
          //{key:'0-0',label: 'Control de movimientos bancarios',link:'./plataformas/ssic/finanzas/control_movimientos_bancarios'},
          //{key:'0-0',label: 'Control de movimientos en efectivo',link:'./plataformas/ssic/finanzas/control_movimientos_en_efectivo'},
          //{key:'0-0',label: 'Comisiones',link:'./plataformas/ssic/finanzas/comisiones'},   
          //{key:'0-0',label: 'Ajustes y cuentas propias'},
          //{key:'0-0',label: 'Información bancaria'},
          //{key:'0-0',label: 'Indicadores económicos',link:'./plataformas/ssic/finanzas/indicadores_economicos'},
          //{key:'0-0',label: 'Reembolsos',link:'./plataformas/ssic/finanzas/reembolsos'},
          //{key:'0-0',label: 'Justificación de gastos',link:'./plataformas/ssic/finanzas/justificacion_de_gastos'},
        ]
      },
      {
        key: '6', label: 'ssic_menu_vhn', data: 'folder_monitoreo',
        children: [
          {
            key: '6-0', label: 'Registros vinculados con valor humano',
            children: [
              { key: '6-0-0', label: 'Aportaciones e ISN', link: './plataformas/ssic/valor_humano/aportaciones_e_isn' },
              { key: '6-0-1', label: 'Resposivas de equipo, herremientas y otros', link: './plataformas/ssic/valor_humano/resposivas_de_equipo_herremientas_y_otros' },
              { key: '6-0-2', label: 'Asistencias e incidencias', link: './plataformas/ssic/valor_humano/asistencias_e_incidencias' },
              { key: '6-0-3', label: 'Solicitud de vacaciones', link: './plataformas/ssic/valor_humano/solicitud_de_vacaciones' },
              { key: '6-0-4', label: 'Permisos laborales', link: './plataformas/ssic/valor_humano/permisos_laborales' },
              { key: '6-0-5', label: 'Incapacidades', link: './plataformas/ssic/valor_humano/incapacidades' },
              { key: '6-0-6', label: 'Incidencia laboral', link: './plataformas/ssic/valor_humano/incidencia_laboral' },
              { key: '6-0-7', label: 'Acta administrativa laboral', link: './plataformas/ssic/valor_humano/acta_administrativa_laboral' },
              { key: '6-0-8', label: 'Descuentos a la nomina', link: './plataformas/ssic/valor_humano/descuentos_a_la_nomina' },
              { key: '6-0-9', label: 'Reembolsos', link: './plataformas/ssic/valor_humano/reembolsos' },
              { key: '6-0-10', label: 'cancel_soli', link: './plataformas/ssic/valor_humano/solicitudes_de_cancelacion' },
            ]
          },
          {
            key: '6-1', label: 'Catálogos',
            children: [
              { key: '6-1-0', label: 'Trabajadores', link: './plataformas/ssic/valor_humano/trabajadores' },
              { key: '6-1-1', label: 'Centro de trabajo', link: './plataformas/ssic/valor_humano/centro_de_trabajo' },
              { key: '6-1-2', label: 'Jornadas de trabajo', link: './plataformas/ssic/valor_humano/jornadas_de_trabajo' }
            ]
          },
          {
            key: '6-2', label: 'Reportes',
            children: [
              { key: '6-2-0', label: 'menu_payroll_analysis', link: './plataformas/ssic/valor_humano/analisis_de_nomina' },
              { key: '6-2-1', label: 'menu_assimilated_salaries_analysis', link: './plataformas/ssic/valor_humano/analisis_de_asimilados' }
            ]
          },
          //{key:'0-0',label: 'Asistencias'},
          //{key:'0-0',label: 'Cálculo de nominas'},
          //{key:'0-0',label: 'Cálculo de aportaciones'},
          //{path:'centros_de_trabajo_alta',component: VHCentrosTrabajoAltaComponent,canActivate:[AuthGuardService]},
          //{path:'centros_de_trabajo_lista',component: VHCentrosTrabajoListaComponent,canActivate:[AuthGuardService]},
          //{path:'empleados_alta',component: VHTrabajadoresRegistroComponent,canActivate:[AuthGuardService]},
          //{path:'empleados_lista',component: VHTrabajadoresListaComponent,canActivate:[AuthGuardService]},
          //{path:'empleados_asistencias',component: VHTrabajadoresControlAsistenciasComponent,canActivate:[AuthGuardService]},
          //{path:'empleados_nomina',component: VHTrabajadoresNominasComponent,canActivate:[AuthGuardService]},
          //{path:'empleados_aportaciones',component: VHTrabajadoresAportacionesComponent,canActivate:[AuthGuardService]},
          //{key:'0-0',label: 'Justificación de gastos',link:'./plataformas/ssic/valor_humano/justificacion_de_gastos'},
        ]
      },
      {
        key: '7', label: 'ssic_menu_con', data: 'folder_monitoreo',
        children: [
          {
            key: '7-0', label: 'Registros contables',
            children: [
              { key: '7-0-0', label: 'Asientos contables', link: './plataformas/ssic/contabilidad/asientos_contables' },
              { key: '7-0-1', label: 'Registros para autorizar', link: './plataformas/ssic/contabilidad/registros_contables_para_autorizar' },
              { key: '7-0-2', label: 'Registro diario', link: './plataformas/ssic/contabilidad/registro_diario' },
              { key: '7-0-3', label: 'Ejecución de depreciaciones contables', link: './plataformas/ssic/contabilidad/ejecucion_de_depreciaciones_contables' },
              { key: '7-0-4', label: 'Ejecución de amortizaciones contables', link: './plataformas/ssic/contabilidad/ejecucion_de_amortizaciones_contables' },
              { key: '7-0-5', label: 'Reconciliación interna contables', link: './plataformas/ssic/contabilidad/reconciliacion_interna_contables' },
              { key: '7-0-6', label: 'Ordenes de devengación de servicios', link: './plataformas/ssic/contabilidad/devengacion_de_servicios' }
            ]
          },
          {
            key: '7-1', label: 'Registros fiscales',
            children: [
              { key: '7-1-0', label: 'Cruce de XML internos vs XML SAT', link: './plataformas/ssic/contabilidad/cruce_de_xml_internos_vs_xml_sat' },
              { key: '7-1-1', label: 'Ingresos acumulables', link: './plataformas/ssic/contabilidad/ingresos_acumulables' },
              { key: '7-1-2', label: 'Deducciones autorizadas', link: './plataformas/ssic/contabilidad/deducciones_autorizadas' },
              { key: '7-1-3', label: 'Declaraciones anuales', link: './plataformas/ssic/contabilidad/declaraciones_anuales' },
              { key: '7-1-4', label: 'Declaraciones', link: './plataformas/ssic/contabilidad/declaraciones' },
              { key: '7-1-5', label: 'Cálculo de ISR Federal', link: './plataformas/ssic/contabilidad/calculo_de_isr_federal' },
              { key: '7-1-6', label: 'Cálculo de IVA', link: './plataformas/ssic/contabilidad/calculo_de_iva' },
              { key: '7-1-7', label: 'Cálculo de IEPS', link: './plataformas/ssic/contabilidad/calculo_de_ieps' },
              { key: '7-1-8', label: 'Cálculo de retenciones a terceros', link: './plataformas/ssic/contabilidad/calculo_de_retenciones_a_terceros' },
              { key: '7-1-9', label: 'Cálculo de retenciones a la nomina', link: './plataformas/ssic/contabilidad/calculo_de_retenciones_a_la_nomina' },
              { key: '7-1-10', label: 'Cálculo de ISN', link: './plataformas/ssic/contabilidad/calculo_de_isn' },
              { key: '7-1-11', label: 'Cálculo de aportaciones de seguridad social', link: './plataformas/ssic/contabilidad/calculo_de_aportaciones_de_seguridad_social' },
              { key: '7-1-12', label: 'Cálculo de derechos', link: './plataformas/ssic/contabilidad/calculo_de_derechos' },
              { key: '7-1-13', label: 'Cálculo de otras contribuciones', link: './plataformas/ssic/contabilidad/calculo_de_contribuciones' },
              { key: '7-1-14', label: 'Cálculo de actualizaciones y recargos', link: './plataformas/ssic/contabilidad/calculo_de_actualizaciones_y_recargos' },
              { key: '7-1-15', label: 'Movimientos ante autoridades fiscales', link: './plataformas/ssic/contabilidad/movimientos_ante_autoridades_fiscales' },
              { key: '7-1-16', label: 'Opinión de cumplimiento', link: './plataformas/ssic/contabilidad/opinion_de_cumplimiento' },
              { key: '7-1-17', label: 'Casos de aclaración', link: './plataformas/ssic/contabilidad/casos_de_aclaracion' },
              { key: '7-1-18', label: 'Perdidas fiscales', link: './plataformas/ssic/contabilidad/perdidas_fiscales' },
              { key: '7-1-19', label: 'Seguimiento de saldos a favor de IVA', link: './plataformas/ssic/contabilidad/seguimiento_de_saldos_a_favor_de_iva' },
              { key: '7-1-20', label: 'Seguimiento de saldos a favor de ISR', link: './plataformas/ssic/contabilidad/seguimiento_de_saldos_a_favor_de_isr' },
              { key: '7-1-21', label: 'Seguimiento a casos de pago de lo indebido', link: './plataformas/ssic/contabilidad/seguimiento_a_casos_de_pago_de_lo_indebido' },
              { key: '7-1-22', label: 'Seguimiento a cartas de invitación', link: './plataformas/ssic/contabilidad/seguimiento_a_cartas_de_invitacion' },
              { key: '7-1-23', label: 'Seguimiento a requerimientos', link: './plataformas/ssic/contabilidad/seguimiento_a_requerimientos' },
              { key: '7-1-24', label: 'Seguimiento a créditos fiscales', link: './plataformas/ssic/contabilidad/seguimiento_a_creditos_fiscales' },
            ]
          },
          {
            key: '7-2', label: 'Catálogos',
            children: [
              { key: '7-2-0', label: 'Catálogo de cuentas contables', link: './plataformas/ssic/contabilidad/cuentas_contables' },
              { key: '7-2-1', label: 'Catálogo de cuentas fiscales', link: './plataformas/ssic/contabilidad/cuentas_fiscales' },
              { key: '7-2-2', label: 'Catálogo de productos y servicios SAT', link: './plataformas/ssic/contabilidad/catalogo_de_productos_y_servicios_sat' },
              { key: '7-2-3', label: 'Catálogo para DIOT', link: './plataformas/ssic/contabilidad/catalogo_para_diot' },
              { key: '7-2-4', label: 'Catálogo general de impuestos', link: './plataformas/ssic/contabilidad/catalogo_general_impuestos' },
              { key: '7-2-5', label: 'Catálogo de deducciones para inversiones', link: './plataformas/ssic/contabilidad/catalogo_de_deducciones_para_inversiones' },
              { key: '7-2-6', label: 'Catálogo de obligaciones fiscales', link: './plataformas/ssic/contabilidad/catalogo_de_obligaciones_fiscales' },
              { key: '7-2-7', label: 'Catálogo de registros fiscales', link: './plataformas/ssic/contabilidad/catalogo_de_registros_fiscales' },
              { key: '7-2-8', label: 'Indicadores fiscales', link: './plataformas/ssic/contabilidad/indicadores_fiscales' },
              { key: '7-2-9', label: 'Activos fijos', link: './plataformas/ssic/contabilidad/catalogos/activos_fijos' },
              { key: '7-2-10', label: 'Activos diferidos', link: './plataformas/ssic/contabilidad/catalogos/activos_diferidos' },
            ]
          },
          {
            key: '7-3', label: 'Monitoreo',
            children: [
              { key: '7-3-0', label: 'Comisiones', link: './plataformas/ssic/contabilidad/monitoreo_de_comisiones' },
            ]
          },

          //{key:'0-0',label: 'Catálogo de cuentas',link:'./plataformas/ssic/contabilidad/catalogodecuentas'},
          //{key:'0-0',label: 'Políticas',link:'./plataformas/ssic/contabilidad/politicas'},
          //{key:'0-0',label: 'Estados Financieros'},
          //{key:'0-0',label: 'Comisiones',
          //  children: [
          //    {key:'0-4-0',label:'Lista general de comisiones',link:'./plataformas/ssic/contabilidad/comisiones_catalogo'},
          //    {key:'0-4-0',label:'Solicitudes de reapertura',link:'./plataformas/ssic/contabilidad/comisiones_reapertura'},
          //  ]
          //},

          //{key:'0-0',label: 'Reportes',
          //  children: [
          //    {key:'0-4-0',label:'Comisiones',link:'./plataformas/ssic/contabilidad/reportedecomisiones'},
          //  ]
          //},
        ]
      },
      {
        key: '8', label: 'ssic_menu_tec', data: 'folder_monitoreo',
        children: [
          {
            key: '8-0', label: 'Gestión de empresas',
            children: [
              { key: '8-0-0', label: 'Perfiles de empresas', link: './plataformas/ssic/tecnologias_de_la_informacion/empresas' }
            ]
          },
          {
            key: '8-1', label: 'Gestión de usuarios',
            children: [
              { key: '8-1-0', label: 'Perfiles de usuarios', link: './plataformas/ssic/tecnologias_de_la_informacion/usuarios' }
            ]
          },
          {
            key: '8-2', label: 'Soporte y asistencia',
            children: [
              { key: '8-2-0', label: 'Soporte y asistencia virtual', link: './plataformas/ssic/tecnologias_de_la_informacion/soporte_sos' }
            ]
          },
          {
            key: '8-3', label: 'Comunicación interna',
            children: [
              { key: '8-3-0', label: 'Comunicación', link: './plataformas/ssic/tecnologias_de_la_informacion/comunicacion' }
            ]
          },
          {
            key: '8-4', label: 'Apps complementarias',
            children: [
              { key: '8-4-0', label: 'Apps complementarias', link: './plataformas/ssic/tecnologias_de_la_informacion/apps_complementarias' }
            ]
          },
          ... (es_admin_emp ? [
            {
              key: '8-5', label: 'Publicaciones',
              children: [
                { key: '8-5-0', label: 'Publicaciones', link: './plataformas/ssic/tecnologias_de_la_informacion/publicaciones' }
              ]
            }
          ] : [])
        ]
      }
    ];
    this.menuTercAssoc = [
      {
        key: '0', label: 'Ventas',
        children: [
          { key: '0-0', label: 'Seguimiento de ventas', link: './plataformas/portal_para_terceros_asociados/ventas_catalogo' },//ssic/ingresos/mostrador plataformas/ssic/ingresos/mostrador/
          { key: '0-1', label: 'Registro de ventas', link: './plataformas/portal_para_terceros_asociados/ventas_registro' }
        ]
      }
    ];
    this.menuTercClientes = [
      { key: '0', label: 'comi_list', link: '' },
      { key: '1', label: 'comi_soli', link: '' }
    ];
    this.menuUserCotizaciones = [
      { key: '0', label: 'prov', link: './plataformas/ssic/egresos/proveedores' },
      {
        key: '1', label: "Requisiciones",
        children: [
          { key: '1-0', label: "Catálogo de requisiciones", link: './plataformas/ssic/egresos/compras/requisiciones/catalogo' },
          { key: '1-1', label: "Alta de requisición", link: './plataformas/ssic/egresos/compras/requisiciones/registro' }
        ]
      },
      {
        key: '2', label: "Cotizaciones",
        children: [
          { key: '2-0', label: "Catálogo de cotizaciones", link: './plataformas/ssic/egresos/compras/cotizaciones/lista' },
          { key: '2-1', label: "Alta de cotización", link: './plataformas/ssic/egresos/compras/cotizaciones/registro' }
        ]
      },
      { key: '3', label: 'Instrucción para la orden de compra', link: './plataformas/ssic/egresos/compras/instruccion_compra' },
    ];
    this.menuTercProveedores = [
      {
        key: '0', label: 'comi',
        children: [
          { key: '0-0', label: 'comi_list', link: '' },
          { key: '0-1', label: 'comi_soli', link: '' }
        ]
      }
    ];
    this.menuLogistica = [
      { key: '0', label: "principal", link: './plataformas/logistica/dashboard_principal' },
      { key: '1', label: "logistica", link: './plataformas/logistica/dashboard_logistica' },
      { key: '2', label: "produccion", link: './plataformas/logistica/dashboard_produccion' }
    ];
    this.menuTercEmpleados = [
      //{key:'0',label:'prov',link:'./plataformas/ssic/egresos/proveedores'},
      //{key:'1',label:'comi',link:'./plataformas/ssic/egresos/catalogos/encargos_o_comisiones'},
      { key: '0', label: 'reem', link: './plataformas/ssic/egresos/reembolsos/empleado/catalogo' },
    ];
    this.menuDescargaXML = [
      {
        key: '0', label: 'comi',
        children: [
          { key: '0-0', label: 'comi_list', link: '' },
          { key: '0-1', label: 'comi_soli', link: '' }
        ]
      }
    ];
    this.menuGestionProyectos = [
      {
        key: '0', label: "Plantillas",
        children: [
          { key: '0-0', label: "Nueva plantilla predeterminada", link: './plataformas/gestion_de_proyectos/nueva_plantilla' },
          { key: '0-1', label: "Catálogo de plantillas predeterminadas", link: './plataformas/gestion_de_proyectos/catalogo_plantillas' }
        ]
      },
      {
        key: '1', label: 'proy_list',
        children: [
          { key: '1-0', label: 'proy_list', link: './plataformas/gestion_de_proyectos/catalogo_proyectos' },
          { key: '1-1', label: 'proy_new', link: './plataformas/gestion_de_proyectos/nuevo_proyecto' }
        ]
      },
      { key: '2', label: 'cal_act_proy', link: './plataformas/gestion_de_proyectos/calendariodeactividad' },
      { key: '3', label: 'gantt_diagram', link: './plataformas/gestion_de_proyectos/diagramadeproyectos' },
    ];
    this.sessionContext.empresa$().subscribe(empresa => {
      if (!empresa) {
        this.menuPerfilEmpresa = [];
        return;
      }

      this.menuPerfilEmpresa = [
        { key: '0', label: empresa.company_name_large },
        { key: '1', label: "ver perfil de empresa", link: './plataformas/perfil_empresa' },
        { key: '2', label: "Catálogo de empresas", link: 'activaListaEmpresas' },
      ];
    });
    this.menuPerfilUsuario = [
      { key: '0', label: this.identidad.name },
      { key: '1', label: "ver perfil de usuario", link: './plataformas/perfil_usuario' },
    ];


    this.translate.get(['ssic_menu_ger', 'ssic_menu_ing', 'ssic_menu_egr', 'ssic_menu_inven', 'ssic_menu_prod', 'ssic_menu_fnzs', 'fnzs_ind_eco', 'ssic_menu_vhn', 'ssic_menu_con', 'ssic_menu_tec', 'comi_list', 'comi_soli', 'prov',
      'prov_cat', 'prov_reg', 'comi', 'comi_list', 'comi_soli', 'prov', 'prov_cat', 'prov_reg', 'comi', 'comi_list', 'comi_soli', 'reem', 'reem_list', 'reem_soli', 'comi', 'comi_list', 'comi_soli', 'proy_list', 'proy_list', 'proy_new',
      'cal_act_proy', 'gantt_diagram']).pipe(takeUntil(this.destruiyeNavBar$)).subscribe(translations => {


    });
  }

  get empresa$() {
    //console.log(this.sessionContext.empresa$());empresa_to_access_modules
    return this.sessionContext.empresa$();
  }

  get empresa_data() {
    //console.log(this.sessionContext.empresa_data);
    return this.sessionContext.empresa_data;
  }

  onNodeExpand(event: any, menu: any) {
    const nodeExpanded = event.node;

    // 🔒 Cierra todos los demás nodos
    //this.expandedKeys = {};
    // ✅ Solo deja abierto el nodo expandido
    //this.expandedKeys[node.key] = true;

    const parent = this.findParent(menu, nodeExpanded.key);
    const siblings = parent ? parent.children : menu;

    if (siblings) {
      siblings.forEach((node: any) => {
        if (node.key !== nodeExpanded.key) {
          node.expanded = false;
        }
      });
    }
  }

  onNodeCollapse(event: any) {
    const node = event.node;
    delete this.expandedKeys[node.key];
  }

  findParent(nodes: any[], key: string): any {
    for (let node of nodes) {
      if (node.children && node.children.some((child: any) => child.key === key)) {
        return node;
      } else if (node.children) {
        let found = this.findParent(node.children, key);
        if (found) return found;
      }
    }
    return null;
  }

  private async relojAutomatico() {
    this.zona_horaria_utc = "UTC-6";
    var date = new Date();
    this.fechaCDMX_semana = "" + date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City', weekday: "long" });
    this.fechaCDMX_dia = "" + date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City', day: "2-digit" });
    this.fechaCDMX_mes = "" + date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City', month: "numeric" });
    this.fechaCDMX_ano = "" + date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City', year: "numeric" });
    this.horaCDMX = "" + date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City', timeStyle: 'medium', hourCycle: "h12" });

    this.fechaLocal_semana = "" + date.toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, weekday: "long" });
    this.fechaLocal_dia = "" + date.toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, day: "2-digit" });
    this.fechaLocal_mes = "" + date.toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, month: "numeric" });
    this.fechaLocal_ano = "" + date.toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: "numeric" });
    this.horaLocal = "" + date.toLocaleString(Intl.DateTimeFormat().resolvedOptions().locale, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, timeStyle: 'medium', hourCycle: "h12" });
    this.cd.detectChanges();
  }

  private async getPermLogin() {
    if (localStorage.getItem('module_working') == "bEIxeFFKY2k4RnFEbWtnWDE5c1dKMGN5TFUwSW5EY0pTditvM3drV3FzTnFCZVhZN3A5aDREM3ZLRHF1YjFGUmNhY1pacDJDS3JsTm9RSXF6SkVTS2c9PTo6MTIzNDU2NzgxMjM0NTY3OA==") {
      this.navSupServ.getAccesosByMenu().toPromise().then(
        response => {
          if (response.status == 'success') {
            if (response.statusPerm == true) {
              //console.log(response);
            } else {
              localStorage.clear();
              sessionStorage.clear();
              this.routerr.navigate(['./']);
            }
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      return;
    }
  }

  listaEmpresasVinculadasUser() {
    this.empService.listaEmpresasVinc().pipe(takeUntil(this.destruiyeNavBar$)).subscribe(
      response => {
        if (response.status == 'success') {
          this.listEmpresasVinc = response.emp_result;
          this.cd.detectChanges();
          //console.log(this.listEmpresasVinc);

          for (let i = 0; i < this.listEmpresasVinc.length; i++) {
            const emp = this.listEmpresasVinc[i];
            if (emp["emp_token"] == this.sessionContext.empresa_data?.empresa_token) {
              emp["active_class"] = "active";
            } else {
              emp["active_class"] = "";
            }
          }
        }
      }, error => { console.log(error); }
    );
  }

  empresa_vinculada_token(empresa_token: any) {
    const validacion_empresa = empresa_token == this.sessionContext.empresa_data?.empresa_token;
    return validacion_empresa;
  }

  cambiarEmpresa(empresa_token: any) {
    this.sessionContext.selectEmpresaVinc(empresa_token)
      .subscribe({
        next: (context) => {
          console.log(context);
          // Guardar token nuevo
          localStorage.setItem('user_code', context.large_token_access);
          sessionStorage.setItem('inside_session_code', context.large_token_access);
          localStorage.setItem('moriah_key', context.large_token_access);
          sessionStorage.setItem('moriah_key', context.large_token_access);
          this.sessionContext.setEmpresa(context);
          this.modalEmpresasVinculadasAlUsuarioVisible = false;
          // Opcional: refrescar app
          window.location.reload();
        }
      });
  }

  onNodeSelected(event: any): void {
    this.boolModuloElegido = true;
    console.log(event.node.link);
    //console.log(this.identidad.habilita_reembolsos);
    //console.log(this.identidad.token_cat_acreedores);
    //event.node.link ? (event.node.link == "activaListaEmpresas" ? this.activaListaEmpresas() : this.routerr.navigate([event.node.link])) : console.log("error al selecionar menu");
    if (event.node.link) {
      if (event.node.link == "activaListaEmpresas") {
        this.modalEmpresasVinculadasAlUsuarioVisible = true;
      } else {
        //const reem:'./plataformas/ssic/egresos/proveedores'},
        const reem_cat = './plataformas/ssic/egresos/reembolsos/empleado/catalogo';
        if (event.node.link == reem_cat) {
          if (this.sessionContext.empresa_data?.habilita_reembolsos) {
            this.routerr.navigate([event.node.link]);
          } else {
            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "no tienes permiso como acreedor",
              showConfirmButton: false,
              timer: 3000
            });
          }
        } else {
          this.routerr.navigate([event.node.link]);
        }
      }
    } else {
      console.log("error al selecionar menu");
    }
  }

  verNotificacionesUser() {
    this.modalNotificacionesAlUsuarioVisible = true;
  }

  verificarNotificacion(id: any, data: any) {
    this.notifServ.marcarComoLeida(id).pipe(takeUntil(this.destruiyeNavBar$)).subscribe(
      response => {
        console.log(response);
        if (response.status == 'ok') {
          this.listenNotificaciones();
          if (data.accion === 'activos_fijos_pendientes_depreciar') {
            this.routerr.navigate(['./plataformas/ssic/contabilidad/catalogos/activos_fijos']);
          }
        }
      }, error => { console.log(error); }
    );
  }

  ignorarNotificacion(id: any) {
    this.notifServ.marcarComoLeida(id).pipe(takeUntil(this.destruiyeNavBar$)).subscribe(
      response => {
        console.log(response);
        if (response.status == 'ok') {
          this.listenNotificaciones();
          this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa: ', detail: response.message, key: 'toastIgnorarNotif' })
        }
      }, error => { console.log(error); }
    );
  }

  lgoutFunct() {
    $("ul#listNotificaciones").removeClass("menuActivo");
    $("#dropdown_menu_main_terc").addClass("noneView");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_logout"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_logout"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      var enrutador = this.routerr;
      if (result.isConfirmed) {

        this.sentinela.usuario_logout_main().subscribe(
          response => {
            if (response.status == 'success') {
              this.httpCancelServ.cancelPendingRequests();
              //Fuente: https://www.iteramos.com/pregunta/90317/como-cancelaranular-todas-las-peticiones-http-pendientes-angular-4
              const contunlog = timer(3000);
              contunlog.pipe(takeUntil(this.destruiyeNavBar$)).subscribe((a: any) => {
                this.sessionContext.setLenguaje('es');
                this.sessionContext.clear();
                localStorage.clear();
                sessionStorage.clear();
                this.identidad = [];
                enrutador.navigate(['./']);
              });
            } else {
              console.log(response);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this.destruiyeNavBar$.next();
    this.destruiyeNavBar$.complete();
  }
}
