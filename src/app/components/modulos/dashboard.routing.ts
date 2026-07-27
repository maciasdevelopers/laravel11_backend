// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../servicios/global_ssic";
import { AuthGuardService } from "../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../servicios/disauth-guard.service";
import { DashboardComponent } from './dashboard/dashboard.component';

const sosRutas: Routes = [
  //{path:'',redirectTo:'home',pathMatch:'full',resolve:[AuthGuardService]},
  {path:'home',component: DashboardComponent,canActivate:[AuthGuardService]},
  //{path:'home',redirectTo:'',pathMatch:'full',resolve:[sessionStorage.length == 0]},

  //empresa
    {path:'perfil_empresa',loadChildren: () => import('./modulo_empresa/EmpresaModule.module').then(m => m.EmpresaModule),canActivate:[AuthGuardService]},
  //usuario
    {path:'perfil_usuario',loadChildren: () => import('./modulo_usuario/userModule.module').then(m => m.UserModule),canActivate:[AuthGuardService]},
  //ssic_ingresos
    {path:'ssic/gerencia',loadChildren: () => import('./modulo_ssic_gerencia/gerencia.module').then(m => m.GerenciaModule),canActivate:[AuthGuardService]},
  //ssic_ingresos
    {path:'ssic/ingresos',loadChildren: () => import('./modulo_ssic_ingresos/ingresos.module').then(m => m.IngresosModule),canActivate:[AuthGuardService]},
  //ssic_egresos
    {path:'ssic/egresos',loadChildren: () => import('./modulo_ssic_egresos/egresos.module').then(m => m.EgresosModule),canActivate:[AuthGuardService]},
	//ssic_inventarios
    {path:'ssic/inventarios',loadChildren: () => import('./modulo_ssic_inventarios/inventarios.module').then(m => m.InventariosModule),canActivate:[AuthGuardService]},
	//ssic_produccion_en_proceso
    {path:'ssic/produccion_en_proceso',loadChildren: () => import('./modulo_ssic_produccion_en_proceso/produccion_en_proceso.module').then(m => m.ProduccionEnProcesoModule),canActivate:[AuthGuardService]},
  //ssic_finanzas
    {path:'ssic/finanzas',loadChildren: () => import('./modulo_ssic_finanzas/finanzas.module').then(m => m.FinanzasModule),canActivate:[AuthGuardService]},
	//ssic_valor_humano
    {path:'ssic/valor_humano',loadChildren: () => import('./modulo_ssic_vhumano/vhumano.module').then(m => m.VhumanoModule),canActivate:[AuthGuardService]},
	//ssic_contabilidad
    {path:'ssic/contabilidad',loadChildren: () => import('./modulo_ssic_contabilidad/contabilidad.module').then(m => m.ContabilidadModule),canActivate:[AuthGuardService]},
	//ssic_tecnologias_de_la_informacion
    {path:'ssic/tecnologias_de_la_informacion',loadChildren: () => import('./modulo_ssic_tecinfo/tecinfo.module').then(m => m.TecinfoModule),canActivate:[AuthGuardService]},
  //descarga_xml
    {path:'descarga_xml',loadChildren: () => import('./modulo_descarga_xml/descarga_xml.module').then(m => m.DescargaXMLModule),canActivate:[AuthGuardService]},
  //logistica
    {path:'logistica',loadChildren: () => import('./modulo_logistica/logistica.module').then(m => m.LogisticaModule),canActivate:[AuthGuardService]},
  //cotizaciones
    {path:'cotizaciones',loadChildren: () => import('./modulo_ssic_egresos/egresos.module').then(m => m.EgresosModule),canActivate:[AuthGuardService]},
  //outside_proyectos
    {path:'gestion_de_proyectos',loadChildren: () => import('./modulo_proyectos/proyectos.module').then(m => m.ProyectosModule),canActivate:[AuthGuardService]},
  //outside_terceros_asociados
    {path:'portal_para_terceros_asociados',loadChildren: () => import('./modulo_terceros_asociados/asociados.module').then(m => m.AsociadosModule),canActivate:[AuthGuardService]},
  //{ path: '**', redirectTo: 'home' }
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