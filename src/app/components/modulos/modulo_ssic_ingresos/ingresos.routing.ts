// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";
//import { SoporteComponent }  from './tecinfo/soporte/soporte.component';

// importacion de componentes
	import { ListaDescuentosIngresosComponent } from "./catalogos/descuentos/lista/listadescuentosingresos.component";
	import { AltaDescuentosIngresosComponent } from "./catalogos/descuentos/alta/altadescuentosingresos.component";
	import { ListaPromocionesIngresosComponent } from "./catalogos/promociones/lista/listapromocionesingresos.component";
	import { AltaPromocionesIngresosComponent } from "./catalogos/promociones/alta/altapromocionesingresos.component";
	//ListaProdIngresosComponent
	//ListaProdIngresosComponent
	import { ListaClientesIngresosComponent } from "./catalogos/clientes/lista/listaclientesingresos.component";
	import { AltaClientesIngresosComponent } from "./catalogos/clientes/alta/altaclientesingresos.component";

	//ventas
  import { VentasMainComponent } from './ventas/ventas-main/ventas-main.component';
	//import { ListaPedidosIngresosComponent } from "./ventas/pedidos/lista/listapedidosingresos.component";
	//import { AltaPedidosIngresosComponent } from "./ventas/pedidos/alta/altapedidosingresos.component";
	//import { AltaVentasIngresosComponent } from "./ventas/ventas/alta/altaventasingresos.component";
	//import { SeguimientoVentasComponent } from "./ventas/ventas/seguimiento/seguimiento.component";
	//AltaVentasIngresosComponent

	//facturación
	import { CatSoliFactComponent } from "./facturacion/cat-soli-fact-component/cat-soli-fact.component";
	import { DetalleFacturaComponent } from './facturacion/detalle-factura/detalle-factura.component';
	import { NewFactComponent } from "./facturacion/new-fact-component/new-fact.component";
	import { IngresosSolicitudesCancelacion } from "./ingresos-solicitudes-cancelacion/ingresos-solicitudes-cancelacion";
	//AltaVentasIngresosComponent

console.log(localStorage.length);
const sosRutas: Routes = [
		//ventas
		{path:'registro_de_ventas',component: VentasMainComponent,canActivate:[AuthGuardService]},
		{path:'solicitudes_de_cancelacion',component: IngresosSolicitudesCancelacion,canActivate:[AuthGuardService]},
  	//catalogos
		//clientes
		{path:'catalogodeclientes',component: ListaClientesIngresosComponent,canActivate:[AuthGuardService]},
		//{path:'altadeclientes',component: AltaClientesIngresosComponent,canActivate:[AuthGuardService]},
		{path:'catalogodedescuentos',component: ListaDescuentosIngresosComponent,canActivate:[AuthGuardService]},
		//{path:'altadedescuentos',component: AltaDescuentosIngresosComponent,canActivate:[AuthGuardService]},
		{path:'catalogodepromociones',component: ListaPromocionesIngresosComponent,canActivate:[AuthGuardService]},
		//{path:'altadepromociones',component: AltaPromocionesIngresosComponent,canActivate:[AuthGuardService]},
		{path:'altadepromociones',component: AltaPromocionesIngresosComponent,canActivate:[AuthGuardService]},
		//{path:'',component: ListaProdIngresosComponent,canActivate:[AuthGuardService]},
		//{path:'',redirectTo:'catalogodemercancias',pathMatch:'full',resolve:[AuthGuardService]},
		//{path:'listadepedidos',component: ListaPedidosIngresosComponent,canActivate:[AuthGuardService]},
		//{path:'altadeopedidos',component: AltaPedidosIngresosComponent,canActivate:[AuthGuardService]},
		//{path:'seguimientodeventas',component: SeguimientoVentasComponent,canActivate:[AuthGuardService]},
		//facturación
		//{path:'solicitudes_facturacion',component: CatSoliFactComponent,canActivate:[AuthGuardService]},
		//{path:'solicitud_facturacion_detalle/:tknCFDI',component: DetalleFacturaComponent,canActivate:[AuthGuardService]},
		//{path:'nueva_factura',component: NewFactComponent,canActivate:[AuthGuardService]},
		//Reportes
		{path:'lista_general_de_partidas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'lista_de_partidas_abiertas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'lista_de_partidas_cerradas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'ventas_brutas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'ventas_despues_de_descuentos',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'reporte_de_devoluciones',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'costo_de_ventas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'reporte_de_ventas_netas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'antigüedad_de_saldos_por_cobrar',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'reporte_especifico_sobre_ventas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'conciliacion_fiscal-contable_relacionada_con_ventas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
];

NgModule({
  imports:[RouterModule.forRoot(sosRutas,{useHash:true}),],
  exports:[RouterModule],
  providers: [
    AuthGuardService,
    DisAuthGuardService
  ]
})

//exportar rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(sosRutas);
