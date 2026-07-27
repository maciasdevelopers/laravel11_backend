import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { LogGuardService } from "../../../servicios/logistica/log_auth.service";
import { LogDisGuardService } from "../../../servicios/logistica/log_disauth.service";

import { DashboardPrincipalComponent } from "./dashboard-principal/dashboard-principal.component";
import { DashboardLogisticaComponent } from "./dashboard-logistica/dashboard-logistica.component";
import { DashboardMaquiladorComponent } from "./dashboard-maquilador/dashboard-maquilador.component";

const sosRutas: Routes = [
  {path:'',redirectTo:'dashboard_principal',pathMatch:'full',resolve:[LogGuardService]},
  {path:'dashboard_principal',component: DashboardPrincipalComponent,canActivate:[LogGuardService]},
  {path:'dashboard_principal',redirectTo:'login',pathMatch:'full',resolve:[sessionStorage.length == 0]},

  {path:'',redirectTo:'dashboard_logistica',pathMatch:'full',resolve:[LogGuardService]},
  {path:'dashboard_logistica',component: DashboardLogisticaComponent,canActivate:[LogGuardService]},
  {path:'dashboard_logistica',redirectTo:'login',pathMatch:'full',resolve:[sessionStorage.length == 0]},

  {path:'',redirectTo:'dashboard_produccion',pathMatch:'full',resolve:[LogGuardService]},
  {path:'dashboard_produccion',component: DashboardMaquiladorComponent,canActivate:[LogGuardService]},
  {path:'dashboard_produccion',redirectTo:'login',pathMatch:'full',resolve:[sessionStorage.length == 0]},
];

NgModule({
  imports:[RouterModule.forRoot(sosRutas,{useHash:true}),],
  exports:[RouterModule],
  providers: [
    LogGuardService,
    LogDisGuardService
  ]
})

//exportar rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(sosRutas);
