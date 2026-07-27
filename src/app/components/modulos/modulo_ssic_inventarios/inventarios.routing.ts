// importacion necesaria
import { ModuleWithProviders, NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";
// importacion de componentes
import { App } from "../../../app";
//productos
import { ProductosInventariosMainComponent } from './inventarios_catalogos/productos/productos_main/productos_main.component';

//servicios
import { InventServiciosMainComponent } from './inventarios_catalogos/servicios/servicios-main.component';
//import { InventServVentasAltaComponent } from './servicios_ventas/alta/inventservventas_alta.component';
//import { InventServVentasListaComponent } from './servicios_ventas/lista/inventservventas_lista.component';
//import { InventServVentasDetalleComponent } from './servicios_ventas/detalle/inventservventas_detalle.component';
//import { InventServVentasMostradorDetalleComponent } from './servicios_ventas/detalle-mostrador/inventservventas_mostrador_detalle.component';
//import { InventServComprasAltaComponent } from './servicios_compras/invent-serv-compras-alta/invent-serv-compras-alta.component';
//import { InventServComprasListaComponent } from './servicios_compras/invent-serv-compras-lista/invent-serv-compras-lista.component';
//import { InventServComprasDetalleComponent } from './servicios_compras/invent-serv-compras-detalle/invent-serv-compras-detalle.component';

//Códigos de barras
import { CodigosDeBarrasComponent } from './inventarios_catalogos/codigos-de-barras/codigos-de-barras.component';

//Lotes
import { CatalogoLoteInventComponent } from './inventarios_catalogos/lotes/lotes_cat_component.component';

//Pedimentos aduanales
import { ListaPedimentoEgresosComponent } from './inventarios_catalogos/pedimentos/pedimentos_cat_component.component';

//Series
import { SeriesCatalogoComponent } from './inventarios_catalogos/series/series_cat_component.component';

//Lineas de productos
import { LineasDeProductosComponent } from './inventarios_catalogos/lineas-de-productos/lineas-de-productos.component';

//Departamentos
import { DepartamentosComponent } from './inventarios_catalogos/departamentos/departamentos.component';

//Activos fijos
import { ListaActivoFijoEgresosComponent } from "./inventarios_catalogos/act_fijos/lista_activos_fijos/lista_activos_fijos.component";

//Activos intangibles
import { ListaActivoDiferidoInventariosComponent } from './inventarios_catalogos/act_intang/listaactivointangegresos.component';

//Establecimientos
import { EstablecimientosInventariosComponent } from './inventarios_catalogos/establecimientos/listaestablecimiento.component';

//lista de precios
import { ListaPreciosComponent } from './inventarios_catalogos/lista-precios/lista-precios.component';

//unidades de medida
import { UnidadesMedidaComponent } from './inventarios_catalogos/unidades-medida/unidades-medida.component';
import { InventKardexComponent } from "./inventarios_reportes/inventarios_kardex/inventarios_kardex.component";
import { InventariosOrdenesRecepcionComponent } from "./registros_relacionados_con_movimientos_al_inventario/inventarios_ordenes_recepcion/inventarios_ordenes_recepcion.component";

//import { ListaGastoEgresosComponent } from "./gastos/lista/listagastoegresos.component";
//import { AltaGastoEgresosComponent } from "./gastos/alta/altagastoegresos.component";
//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
  //registros relacionados con movimientos al inventario
  { path: 'ordenes_de_recepcion', component: InventariosOrdenesRecepcionComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_incidencias', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'articulos_alternos', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'ajustes_a_los_costos_por_arribo_de_mercancias_compradas', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'bloqueo_desbloqueo_de_existencias', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'ajustes_manuales_a_los_inventarios', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  //catalogos
  //productos
  { path: 'productos', component: ProductosInventariosMainComponent, canActivate: [AuthGuardService] },
  //servicios
  { path: 'servicios', component: InventServiciosMainComponent, canActivate: [AuthGuardService] },
  //Códigos de barras
  { path: 'codigos_de_barras', component: CodigosDeBarrasComponent, canActivate: [AuthGuardService] },
  //Lotes
  { path: 'lotes', component: CatalogoLoteInventComponent, canActivate: [AuthGuardService] },
  //Pedimentos aduanales
  { path: 'pedimentos_aduanales', component: ListaPedimentoEgresosComponent, canActivate: [AuthGuardService] },
  //Series
  { path: 'series', component: SeriesCatalogoComponent, canActivate: [AuthGuardService] },
  //Lineas de productos
  { path: 'lineas_de_productos', component: LineasDeProductosComponent, canActivate: [AuthGuardService] },
  //Departamentos
  { path: 'departamentos', component: DepartamentosComponent, canActivate: [AuthGuardService] },
  //Activos fijos
  { path: 'activos_fijos', component: ListaActivoFijoEgresosComponent, canActivate: [AuthGuardService] },
  //Activos intangibles
  { path: 'activos_diferidos', component: ListaActivoDiferidoInventariosComponent, canActivate: [AuthGuardService] },
  //Establecimientos
  { path: 'establecimientos', component: EstablecimientosInventariosComponent, canActivate: [AuthGuardService] },
  //lista de precios
  { path: 'lista_de_precios', component: ListaPreciosComponent, canActivate: [AuthGuardService] },
  //unidades de medida
  { path: 'unidades_de_medida', component: UnidadesMedidaComponent, canActivate: [AuthGuardService] },
  //{path:'catalogodegastos',component:ListaGastoEgresosComponent,canActivate:[AuthGuardService]},
  //{path:'altadegastos',component:AltaGastoEgresosComponent,canActivate:[AuthGuardService]},
  //reportes
  { path: 'lista_general_de_productos_y_servicios', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'kardex_de_inventarios', component: InventKardexComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_stock', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_productos_comprometidos', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_productos_transito_por_compra', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_productos_transito_por_venta', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_rotacion_de_productos', component: ComingSoonComponent, canActivate: [AuthGuardService] },
];

NgModule({
  imports: [RouterModule.forRoot(sosRutas, { useHash: true }),],
  exports: [RouterModule],
  providers: [
    AuthGuardService,
    DisAuthGuardService
  ]
})

//exportar rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(sosRutas);
