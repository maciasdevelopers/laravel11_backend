// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
//import { SoporteComponent }  from './tecinfo/soporte/soporte.component';

// importacion de componentes
import { NuevaPlantillaComponent } from './plantillas/nueva-plantilla/nueva-plantilla.component';
import { ListaPlantillasComponent } from './plantillas/lista-plantillas/lista-plantillas.component';
import { NuevoProyectoComponent } from './proyectos/nuevo-proyecto/nuevo-proyecto.component';
import { CatalogoProyectosComponent } from "./proyectos/proyectos_list/proyectos_list.component";
import { CalendarProyectosComponent } from './calendar-proyectos/calendar-proyectos.component';
import { GanttProyectosComponent } from './gantt-proyectos/gantt-proyectos.component';
//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
  {path:'nueva_plantilla',component: NuevaPlantillaComponent,canActivate:[AuthGuardService]},
  {path:'catalogo_plantillas',component: ListaPlantillasComponent,canActivate:[AuthGuardService]},
  {path:'nuevo_proyecto',component: NuevoProyectoComponent,canActivate:[AuthGuardService]},
  {path:'catalogo_proyectos',component: CatalogoProyectosComponent,canActivate:[AuthGuardService]},
  {path:'calendariodeactividad',component: CalendarProyectosComponent,canActivate:[AuthGuardService]},
  {path:'diagramadeproyectos',component: GanttProyectosComponent,canActivate:[AuthGuardService]},
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
