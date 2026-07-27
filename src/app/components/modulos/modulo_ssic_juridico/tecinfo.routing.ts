// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";

//importacion de componentes
	import { SoporteComponent } from "../modulo_ssic_tecinfo/soporte/menu_soporte/soporte.component";

//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
	//{path:'',component: ListaProdIngresosComponent,canActivate:[AuthGuardService]},
	{path:'',redirectTo:'soporte_sos',pathMatch:'full',resolve:[AuthGuardService]},
	{path:'soporte_sos',component: SoporteComponent,canActivate:[AuthGuardService]},
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
