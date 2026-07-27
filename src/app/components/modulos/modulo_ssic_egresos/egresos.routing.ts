// importacion necesaria
import { ModuleWithProviders, NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";
// importacion de componentes
import { App } from "../../../app";
//catalogos
//proveedores
import { ListaProvEgresosComponent } from "./proveedores/lista/listaprovegresos.component";
//Impuestos aplicables a las compras
//Encargos o comisiones
//import { TercComisionesListasComponent } from "./seccion_empleados/terc_comi_listas/terc_comi_listas.component";
//import { TercComisionesDetailComponent } from "./seccion_empleados/terc_comi_det/terc_comi_det.component";
//compras
//Requisición
import { ListaRequisicionComponent } from "./compras/instruccion_para_orden_de_compra/compras_requisicion/lista/listarequisicion.component";
import { AltaRequisicionComponent } from "./compras/instruccion_para_orden_de_compra/compras_requisicion/alta/altarequisicion.component";
//Cotización
import { ListaCotizacionComponent } from "./compras/instruccion_para_orden_de_compra/compras_cotizaciones/lista/listacotizacion.component";
import { AltaCotizacionComponent } from "./compras/instruccion_para_orden_de_compra/compras_cotizaciones/nuevo_registro/altacotizacion.component";
//Instrucción para la orden de compra
import { InstruccionCompraComponent } from "./compras/instruccion_para_orden_de_compra/compras_instruccion/instruccion-compra.component";
//orden de compra
import { ComprasMainComponent } from "./compras/compras-main.component";
//logistica de compras
import { EgresosLogisticaDeCompras } from "./logistica-de-compras/logistica-de-compras";
//Anticipo para proveedores
import { ProveedoresAnticipoComponent } from "./compras/compra_nuevo_registro/compras_anticipo_proveedor/proveedores-anticipo.component";
//Recepción de productos
//import { RecepcionproductosComponent } from "./compras/compras_recepcion_productos/compras_recepcion_productos.component";
//Facturación del proveedor
import { FacturacionproveedorComponent } from "./compras/compra_nuevo_registro/compras_facturacion/facturacionproveedor.component";
//Devolución de productos al proveedor
//Notas de crédito del proveedor
//import { NotascreditoprovComponent } from "./compras/compras_notas_de_credito_prov/notascreditoprov.component";
//Notas de debito del proveedor
//import { NotasdebitoprovComponent } from "./compras/compras_notas_de_debito_prov/notasdebitoprov.component";
//reembolsos
//import { EEGRComisionesAvisosComponent } from './eegr_comisiones/comisiones-avisos/comisiones-avisos.component';
import { ComisionesYReembolsosComponent } from './comisiones_y_reembolsos/comisiones_y_reembolsos.component';
import { EgresosSolicitudesDeCancelacion } from "./egresos-solicitudes-de-cancelacion/egresos-solicitudes-de-cancelacion";
import { TercReemListasComponent } from "./seccion_empleados/terc_reem_lista/terc_reem_lista.component";

//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
  //compras
  //Requisición
  { path: 'compras/requisiciones/catalogo', component: ListaRequisicionComponent, canActivate: [AuthGuardService] },
  { path: 'compras/requisiciones/registro', component: AltaRequisicionComponent, canActivate: [AuthGuardService] },
  //Cotización
  { path: 'compras/cotizaciones/lista', component: ListaCotizacionComponent, canActivate: [AuthGuardService] },
  { path: 'compras/cotizaciones/registro', component: AltaCotizacionComponent, canActivate: [AuthGuardService] },
  //Instrucción para la orden de compra
  { path: 'compras/instruccion_compra', component: InstruccionCompraComponent, canActivate: [AuthGuardService] },
  //orden de compra
  { path: 'ordenes_de_compra', component: ComprasMainComponent, canActivate: [AuthGuardService] },
  //Logistica de compras
  { path: 'logistica_de_compras', component: EgresosLogisticaDeCompras, canActivate: [AuthGuardService] },
  //{path:'catalogode_erogacionesygastos',component: AltaComprasComponent,canActivate:[AuthGuardService]},
  //{path:'altade_erogacionesygastos',component: SeguimientoComprasComponent,canActivate:[AuthGuardService]},
  //{path:'seguimientodecompras_recepcion/:tknCompra',component: RecibeCompraComponent,canActivate:[AuthGuardService]},
  //Anticipo para proveedores
  { path: 'compras/proveedores/anticipo', component: ProveedoresAnticipoComponent, canActivate: [AuthGuardService] },
  //Recepción de productos
  //{path:'compras/productos/recepcion',component: RecepcionproductosComponent,canActivate:[AuthGuardService]},
  //Facturación del proveedor
  { path: 'compras/proveedores/facturacion', component: FacturacionproveedorComponent, canActivate: [AuthGuardService] },
  //Devolución de productos al proveedor
  //Notas de crédito del proveedor
  //{path:'compras/proveedores/notas_de_credito',component: NotascreditoprovComponent,canActivate:[AuthGuardService]},
  //Notas de debito del proveedor
  //{path:'compras/proveedores/notas_de_debito',component: NotasdebitoprovComponent,canActivate:[AuthGuardService]},
  //catalogos
  //proveedores
  { path: 'proveedores', component: ListaProvEgresosComponent, canActivate: [AuthGuardService] },
  //Impuestos aplicables a las compras
  //reembolsos
  { path: 'comisiones_y_reembolsos', component: ComisionesYReembolsosComponent, canActivate: [AuthGuardService] },
  { path: 'solicitudes_de_cancelacion', component: EgresosSolicitudesDeCancelacion, canActivate: [AuthGuardService] },
  //{path:'comisiones_registro/:tknComi',component: EEGRComisionesAvisosComponent,canActivate:[AuthGuardService]},
  { path: 'reembolsos/empleado/catalogo', component: TercReemListasComponent, canActivate: [AuthGuardService] },
  //Reportes
  { path: 'lista_general_de_partidas', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'lista_de_partidas_abiertas', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'lista_de_partidas_cerradas', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_compra_de_productos', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'reporte_de_contratacion_de_servicios', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'antigüedad_de_saldos_por_pagar', component: ComingSoonComponent, canActivate: [AuthGuardService] },
  { path: 'conciliacion_fiscal-contable_relacionada_con_compras', component: ComingSoonComponent, canActivate: [AuthGuardService] },
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
