// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";

import { CotizacionesProveedoresListadoComponent } from "./cotizaciones_proveedores/cotizaciones_proveedores_listado/cotizaciones_proveedores_listado.component";
import { CotizacionesProveedoresRegistrarComponent } from './cotizaciones_proveedores/cotizaciones_proveedores_registrar/cotizaciones_proveedores_registrar.component';
// importacion de componentes

//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
  {path:'proveedores_catalogo',component: CotizacionesProveedoresListadoComponent,canActivate:[AuthGuardService]},
  {path:'proveedores_registro',component: CotizacionesProveedoresRegistrarComponent,canActivate:[AuthGuardService]},
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
