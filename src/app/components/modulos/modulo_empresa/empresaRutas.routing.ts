// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
//import { EmploGuardService } from "../../../servicios/terceros/employees/auth_emplo.service";
//import { EmploDisGuardService } from "../../../servicios/terceros/employees/disauth_emplo.service";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
// importacion de componentes
import { PerfilEmpresaComponent } from './perfil-empresa/perfil-empresa.component';
//console.log(sessionStorage.length);//sessionStorage.length
//console.log(localStorage.length);
const empresaRutas: Routes = [
  {path:'',component: PerfilEmpresaComponent,canActivate:[AuthGuardService]},
];

NgModule({
  imports:[RouterModule.forRoot(empresaRutas,{useHash:true}),],
  exports:[RouterModule],
  providers: [
    AuthGuardService,
    DisAuthGuardService
  ]
})

//exportar rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(empresaRutas);
