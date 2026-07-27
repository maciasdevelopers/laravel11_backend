// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";

import { VHCentrosTrabajoAltaComponent } from "./catalogos/centros_de_trabajo/alta/alta_centros_de_trabajo.component";
import { VHCentrosTrabajoListaComponent } from "./catalogos/centros_de_trabajo/lista/lista_centros_de_trabajo.component";

import { VHTrabajadoresListaComponent } from "./catalogos/trabajadores/trabajadores_lista/trabajadores_lista.component";
import { VHumReembolsosComponent } from "./otros/reembolsos/vh-reembolsos/vh-reembolsos.component"; 
import { VHumReemDetComponent } from './otros/reembolsos/det-reembolsos/det-reembolsos.component';
import { ContribucionesEIsnComponent } from './registros_vinculados_a_valor_humano/contribuciones-e-isn/contribuciones-e-isn.component';
import { VHReportesNominaAnalisisComponent } from "./reportes/analisis_de_nomina/analisis_de_nomina.component";
import { VHReportesAsimiladosAnalisisComponent } from './reportes/analisis_de_asimilados/analisis_de_asimilados';
import { VHumanoSolicitudesCancelacion } from "./vhumano-solicitudes-cancelacion/vhumano-solicitudes-cancelacion";

console.log(localStorage.length);
const sosRutas: Routes = [
  //Registros vinculados con valor humano
	  {path:'aportaciones_e_isn',component: ContribucionesEIsnComponent,canActivate:[AuthGuardService]},
	  {path:'resposivas_de_equipo_herremientas_y_otros',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'asistencias_e_incidencias',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'solicitud_de_vacaciones',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'permisos_laborales',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'incapacidades',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'incidencia_laboral',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'acta_administrativa_laboral',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'descuentos_a_la_nomina',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'solicitudes_de_cancelacion',component: VHumanoSolicitudesCancelacion,canActivate:[AuthGuardService]},
    //reembolsos
    {path:'reembolsos',component: VHumReembolsosComponent,canActivate:[AuthGuardService]},
    {path:'reembolso_detalle/:tknReem',component: VHumReemDetComponent,canActivate:[AuthGuardService]},
  //Catálogos
    //trabajadores
    {path:'trabajadores',component: VHTrabajadoresListaComponent,canActivate:[AuthGuardService]},
    //Centro de trabajo
    {path:'centro_de_trabajo',component: VHCentrosTrabajoListaComponent,canActivate:[AuthGuardService]},
    {path:'centros_de_trabajo_alta',component: VHCentrosTrabajoAltaComponent,canActivate:[AuthGuardService]},
    //Jornadas de trabajo
    {path:'jornadas_de_trabajo',component: ComingSoonComponent,canActivate:[AuthGuardService]},
  //Reportes
    //Analisis de nomina
    {path:'analisis_de_nomina',component: VHReportesNominaAnalisisComponent,canActivate:[AuthGuardService]},
    //Analisis de asimilados
    {path:'analisis_de_asimilados',component: VHReportesAsimiladosAnalisisComponent,canActivate:[AuthGuardService]},
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
