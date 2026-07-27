// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { AdminGuardService } from "../../../servicios/admin-guard.service";

//catalogos
//import { TECIAltaDeviceComponent } from './catalogos/dispositivos_de_medicion/alta/teci_altadevices.component';
//import { TECIListaDeviceComponent } from './catalogos/dispositivos_de_medicion/lista/teci_listadevices.component';
//import { ContAltaDigitalPlataformComponent } from './catalogos/plataformas_digitales/alta/cont_alta_digital_plataform.component';
//import { ContListaDigitalPlataformComponent } from './catalogos/plataformas_digitales/lista/cont_lista_digital_plataform.component';

//importacion de componentes
  import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";
  import { AppsComplementariasComponent } from "./apps_complementarias/apps_complementarias.component";
  import { TeciEmpresasCatalogosComponent } from "./empresas/empresas_catalogos/empresas_catalogos.component";
  import { TeciPerfilesUsuariosComponent } from './teci-perfiles-usuarios/teci-perfiles-usuarios.component';
  import { SoporteComponent } from "./soporte/menu_soporte/soporte.component";
  import { ComunicacionLista } from "./comunicacion/comunicacion-lista/comunicacion-lista";
  import { PublicacionesListaComponent } from "./publicaciones/publicaciones_lista/publicaciones_lista.component";
  
//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
	//{path:'',component: ListaProdIngresosComponent,canActivate:[AuthGuardService]},
  //{path:'devices_alta',component: TECIAltaDeviceComponent,canActivate:[AuthGuardService]},
  //{path:'devices_lista',component: TECIListaDeviceComponent,canActivate:[AuthGuardService]},
  //{path:'plataformas_digitales_alta',component: ContAltaDigitalPlataformComponent,canActivate:[AuthGuardService]},
  //{path:'plataformas_digitales_lista',component: ContListaDigitalPlataformComponent,canActivate:[AuthGuardService]},
  
  {path:'apps_complementarias',component: AppsComplementariasComponent,canActivate:[AuthGuardService]},
  {path:'empresas',component: TeciEmpresasCatalogosComponent,canActivate:[AuthGuardService]},
  {path:'usuarios',component: TeciPerfilesUsuariosComponent,canActivate:[AuthGuardService]},
  {path:'soporte_sos',component: ComingSoonComponent,canActivate:[AuthGuardService]},//SoporteComponent
  {path:'comunicacion',component: ComingSoonComponent,canActivate:[AuthGuardService]},//ComunicacionLista
  {path:'publicaciones',component: PublicacionesListaComponent,canActivate:[AdminGuardService]}
];

NgModule({
  imports:[RouterModule.forRoot(sosRutas,{useHash:true}),],
  exports:[RouterModule],
  providers: [
    AuthGuardService,
    DisAuthGuardService,
    AdminGuardService
  ]
})

//exportar rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(sosRutas);
