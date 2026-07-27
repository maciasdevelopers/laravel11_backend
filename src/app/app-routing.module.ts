import { NgModule } from '@angular/core';
import {ModuleWithProviders} from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "./servicios/auth-guard.service";
import { DisAuthGuardService } from "./servicios/disauth-guard.service";
import { PermissionDeniedComponent } from "./components/permission_denied/permission_denied.component";
import { ErrorComponent } from "./components/error/error.component";
import { RaizComponent } from './components/index_component/index_component.component';
import { PortalAsociadosComponent } from './components/landing_module/portal_para_terceros/asociados/portal_asociados.component';


const routes: Routes = [
  {path:'',component: RaizComponent,canActivate:[DisAuthGuardService]},
  {path:'asociados',component: PortalAsociadosComponent},
  {path:'bolsa_de_trabajo',component: ErrorComponent,canActivate:[DisAuthGuardService]},
  {path:'plataformas',loadChildren: () => import('./components/modulos/dashboard.module').then(m => m.DashboardModule),canActivate:[AuthGuardService]},
  {path:'ssic_inventarios',loadChildren: () => import('./components/modulos/modulo_ssic_inventarios/inventarios.module').then(m => m.InventariosModule),canActivate:[AuthGuardService]},
  {path:'plataformas/permission_denied',component: PermissionDeniedComponent,canActivate:[AuthGuardService]},
  {path:'permission_denied',component: PermissionDeniedComponent},
  {path:'**',component: ErrorComponent},
];

@NgModule({
  imports:[RouterModule.forRoot(routes,{useHash:true}),],
  exports: [RouterModule],
  providers: [
    //ClientsGuardService,
    //ClientsDisGuardService,
    //SuppliersGuardService,
    //SuppliersgDisGuardService,
    //EmploGuardService,
    //EmploDisGuardService,
    AuthGuardService,
    DisAuthGuardService
  ]
})
export class AppRoutingModule { }
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes);
export const routingDos: ModuleWithProviders<any> = RouterModule.forChild(routes);
