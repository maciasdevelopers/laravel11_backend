// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
//import { SoporteComponent }  from './tecinfo/soporte/soporte.component';

// importacion de componentes
	//comisiones
    import { GerenciaComisionesListaComponent } from "./monitoreo/comisiones/comisiones_lista/comisiones_lista.component";
    import { GerenciaComisionesDetalleComponent } from "./monitoreo/comisiones/comisiones_detalle/comisiones_detalle.component";
    import { GerenciaComisionesReaperturaComponent } from './monitoreo/comisiones/comisiones_reapertura/comisiones_reapertura.component';
    import { GerenciaComisionesMonitoreoComponent } from './monitoreo/comisiones/comisiones_monitoreo/comisiones_monitoreo.component';

//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
	//{path:'',component: ListaProdIngresosComponent,canActivate:[AuthGuardService]},
  {path:'comisiones_catalogo',component: GerenciaComisionesListaComponent,canActivate:[AuthGuardService]},
  {path:'comisiones_info/:tknComision',component: GerenciaComisionesDetalleComponent,canActivate:[AuthGuardService]},
  {path:'comisiones_reapertura',component: GerenciaComisionesReaperturaComponent,canActivate:[AuthGuardService]},
  {path:'monitoreodecomisiones',component: GerenciaComisionesMonitoreoComponent,canActivate:[AuthGuardService]},
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
