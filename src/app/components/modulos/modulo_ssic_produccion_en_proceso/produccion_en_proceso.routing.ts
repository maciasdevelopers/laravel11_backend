// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";

console.log(localStorage.length);
const sosRutas: Routes = [
  //Planeación
		{path:'lista_de_recursos_para_produccion',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'materia_prima_planeada',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'recurso_humano_planeado',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'otros_conceptos_planeados',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'cronologia_del_trabajo',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	//Producción
		{path:'orden_de_produccion',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'recibo_de_materiales_para_produccion',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'recursos_consumidos_durante_la_produccion',component: ComingSoonComponent,canActivate:[AuthGuardService]},
	//Reportes
		{path:'lista_general_de_partidas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'lista_de_partidas_abiertas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'lista_de_partidas_cerradas',component: ComingSoonComponent,canActivate:[AuthGuardService]},
		{path:'reporte_comparativo_entre_planeado_y_ejecutado',component: ComingSoonComponent,canActivate:[AuthGuardService]},
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
