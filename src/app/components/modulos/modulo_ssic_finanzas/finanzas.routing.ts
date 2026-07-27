// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";

// importacion de componentes
	//ordenes de cobros
		import { ListaOrdenesCobroComponent } from "./ordenes-cobro/lista-ordenes-cobro.component";
	//ordenes de pagos
		import { ListaOrdenesPagoComponent } from './ordenes-pago/lista-ordenes-pago.component';
		//import { OrdenPagoProvDetTesComponent } from "./ordenes-pago/detalle-orden-pago-prov/orden-pago-prov-tes-det.component";
		//import { OrdenPagoClientDetTesComponent } from "./ordenes-pago/detalle-orden-pago-cliente/orden-pago-client-tes-det.component";
		//import { OrdenPagoJustDetTesComponent } from "./ordenes-pago/detalle-orden-pago-just/orden-pago-just-tes-det.component";
		//import { OrdenPagoReemDetTesComponent } from "./ordenes-pago/detalle-orden-pago-reem/orden-pago-reem-tes-det.component";
	//ordenes de pagos
		import { DispersionNominasComponent } from "./dispersion-nominas/dispersion-nominas";
	//catalogos
		//Acreedores		
		import { AcreedoresListaComponent } from './catalogos/acreedores/acreedores-lista/acreedores-lista.component';
		//Deudores		
		import { DeudoresListaComponent } from './catalogos/deudores/deudores-lista/deudores-lista.component';
		//puntos de venta
		import { PuntoVentaListaComponent } from "./catalogos/punto_de_venta/lista/puntoventassoclista.component";
		//cuentas
		import { ListaCuentasTesoreriaComponent } from "./catalogos/cuentas/lista/tes_listacuentas.component";
		//cajas
		import { ListaCajasTesoreriaComponent } from "./catalogos/cajas/lista/tes_listacajas.component";
		//monederos
		import { ListaMonederoTesoreriaComponent } from "./catalogos/monederos/lista/tes_listamon.component";
		//federación estados y municipios
		import { FederacionEstadosMunicipios } from './catalogos/federacion-estados-municipios/federacion-estados-municipios';
		//movimientos
		import { ControlMovBancComponent } from "./registro_de_movimientos_financieros/control-mov-banc/control-mov-banc.component";
		import { ControlMovEfectComponent } from "./registro_de_movimientos_financieros/control-mov-efect/control-mov-efect.component";
		//dispositivos
		import { ListaDevicesTesoreriaComponent } from "./catalogos/dispositivos/lista/tes_listadevices.component";
		//indicadores
		import { IndicadoresEconomicosComponent } from "./catalogos/indicadores-economicos/indicadores-economicos.component";
		import { MovimientosCuentasPropiasComponent } from './registro_de_movimientos_financieros/movimientos-cuentas-propias/movimientos-cuentas-propias.component';
	//reportes
		import { EstadoMovimientosFinancierosComponent } from "./reportes/estado-movim-financieros/estado-movimientos-financieros.component";
	//cancelaciones
		import { FinanzasSolicitudesDeCancelacion } from "./finanzas-solicitudes-cancelacion/cancelacion_lista_solicitudes/cancelacion_lista_solicitudes";
import { pagosGuard } from "../../../seguridad_escudo/pagos-guard";


//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
  //ordenes de cobro
		{path:'ordenes_de_cobro',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		//{path:'ordenes_de_cobro',component:ListaOrdenesCobroComponent,canActivate:[AuthGuardService]},
		//{path:'ordendepago_prov_detalle/:token_ordenPago',component:OrdenPagoProvDetTesComponent,canActivate:[AuthGuardService]},
		//{path:'ordendepago_client_detalle/:token_ordenPago',component:OrdenPagoClientDetTesComponent,canActivate:[AuthGuardService]},
		//{path:'ordendepago_reem_detalle/:tknReem',component:OrdenPagoReemDetTesComponent,canActivate:[AuthGuardService]},
		//{path:'ordendepago_just_detalle/:tknJust',component:OrdenPagoJustDetTesComponent,canActivate:[AuthGuardService]},
	//ordenes de pagos
		{path:'ordenes_de_pago',component:ListaOrdenesPagoComponent,canActivate:[AuthGuardService,pagosGuard]},
		//{path:'ordendepago_prov_detalle/:token_ordenPago',component:OrdenPagoProvDetTesComponent,canActivate:[AuthGuardService]},
		//{path:'ordendepago_client_detalle/:token_ordenPago',component:OrdenPagoClientDetTesComponent,canActivate:[AuthGuardService]},
		//{path:'ordendepago_reem_detalle/:tknReem',component:OrdenPagoReemDetTesComponent,canActivate:[AuthGuardService]},
		//{path:'ordendepago_just_detalle/:tknJust',component:OrdenPagoJustDetTesComponent,canActivate:[AuthGuardService]},
	//ordenes de pagos
		{path:'ordenes_de_dispersion_de_nomina',component:DispersionNominasComponent,canActivate:[AuthGuardService]},
	//Registro de movimientos financieros
		{path:'registro_de_entrada_de_dinero',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'registro_de_salida_de_dinero',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		//{path:'control_movimientos_en_efectivo',component:ControlMovEfectComponent,canActivate:[AuthGuardService]},
		{path:'movimientos_entre_cuentas_propias',component:MovimientosCuentasPropiasComponent,canActivate:[AuthGuardService]},
		//{path:'control_movimientos_bancarios',component:ControlMovBancComponent,canActivate:[AuthGuardService]},
		{path:'reconciliacion_interna_financiera',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'registro_manual_de_ajustes',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'corte_financiero_de_punto_de_notas_de_venta_mostrador',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'conciliacion_de_fondo_de_caja',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'conciliacion_bancaria',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'conciliacion_de_monederos_electronicos',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'conciliacion_de_plataformas_electronicas',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	//catalogos
		{path:'acreedores',component:AcreedoresListaComponent,canActivate:[AuthGuardService]},
		{path:'deudores',component:DeudoresListaComponent,canActivate:[AuthGuardService]},
		//puntos de venta
		{path:'punto_de_venta',component:PuntoVentaListaComponent,canActivate:[AuthGuardService]},
		//cajas
		{path:'cajas',component:ListaCajasTesoreriaComponent,canActivate:[AuthGuardService]},
		//cuentas
		{path:'cuentas_bancarias',component:ListaCuentasTesoreriaComponent,canActivate:[AuthGuardService]},
		//dispositivos
		{path:'dispositivos',component:ListaDevicesTesoreriaComponent,canActivate:[AuthGuardService]},
		//monederos electrónicos
		{path:'monederos_electronicos',component:ListaMonederoTesoreriaComponent,canActivate:[AuthGuardService]},
		//plataformas electrónicas
		{path:'plataformas_electronicas',component:ComingSoonComponent,canActivate:[AuthGuardService]},
		//federación estados y municipios
		{path:'federacion_estados_y_municipios',component:FederacionEstadosMunicipios,canActivate:[AuthGuardService]},
		//Indicadores económicos
		{path:'indicadores_economicos',component:IndicadoresEconomicosComponent,canActivate:[AuthGuardService]},
		//Monedas y divisas
		{path:'monedas_y_divisas',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	//Reportes
		//Estado de movimientos financieros
		{path:'estado_de_movimientos_financieros',component:EstadoMovimientosFinancierosComponent,canActivate:[AuthGuardService]},
	//cancelaciones
		{path:'solicitudes_de_cancelacion',component:FinanzasSolicitudesDeCancelacion,canActivate:[AuthGuardService]},
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
