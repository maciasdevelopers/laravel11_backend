// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AuthGuardService } from "../../../servicios/auth-guard.service";
import { DisAuthGuardService } from "../../../servicios/disauth-guard.service";
import { ComingSoonComponent } from "../../coming-soon/coming-soon.component";

// importacion de componentes
	import { App } from "../../../app";
  import { CatalogoGeneralImpuestosComponent } from "./catalogos/impuestos/catalogo_general_impuestos.component";
	import { CuentasContablesListaComponent } from "./catalogos/cuentas_contables/cuentas_contables_lista/cuentas_contables_lista.component";
  //Aportaciones
  import { AportacionesListaComponent } from "./catalogos/contribuciones/aportaciones/lista/aportaciones_lista.component";
  import { AportacionesAltaComponent } from "./catalogos/contribuciones/aportaciones/alta/aportaciones_alta.component";

  //derechos y mejoras
  import { DerMejorasListaComponent } from "./catalogos/contribuciones/derechos_y_mejoras/lista/dermejoras_lista.component";
  import { DerMejorasAltaComponent } from "./catalogos/contribuciones/derechos_y_mejoras/alta/dermejoras_alta.component";

  //Politicas
  import { ContabilidadPoliticasHomeComponent } from './politicas/politicas_home/politicas_home.component';
  import { ContabPoliticDetalleComponent } from "./politicas/politicas_detalle/politicas_detalle.component";
  import { RegistrosParaAutorizarComponent } from './registros_contables/registros_para_autorizar/registros_para_autorizar.component';
  import { DeclaracionesListaComponent } from "./registros_fiscales/declaraciones/declaraciones_lista/declaraciones-component";
  import { ContActFijosComponent } from './catalogos/cont-act-fijos/cont-act-fijos-component';
  import { ContActDiferidosComponent } from './catalogos/cont-act-diferidos/cont-act-diferidos-component';
  
  // Asientos contables
  import { AsientosContablesListaComponent } from './registros_contables/asientos_contables/lista/asientos_contables_lista.component';
  import { AsientosContablesRegistroComponent } from './registros_contables/asientos_contables/registro/asientos_contables_registro.component';
  import { AsientosContablesConsultaComponent } from './registros_contables/asientos_contables/consulta/asientos_contables_consulta.component';
  import { ContabilidadOrdenesDevengacionComponent } from "./registros_contables/contabilidad_ordenes_devengacion/contabilidad_ordenes_devengacion.component";
  import { CruceXmlinternosVsXmlsat } from './registros_fiscales/cruce-xmlinternos-vs-xmlsat/cruce-xmlinternos-vs-xmlsat';

//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const sosRutas: Routes = [
  //politicas
  //{path:'politicas',component:ContabilidadPoliticasHomeComponent,canActivate:[AuthGuardService]},
  //{path:'politicas_info/:tknPolit',component:ContabPoliticDetalleComponent,canActivate:[AuthGuardService]},
  //Registros contables
    {path:'registros_contables_para_autorizar',component:RegistrosParaAutorizarComponent,canActivate:[AuthGuardService]}, 
    {path:'asientos_contables',component:AsientosContablesListaComponent,canActivate:[AuthGuardService]},
    {path:'devengacion_de_servicios',component:ContabilidadOrdenesDevengacionComponent,canActivate:[AuthGuardService]},
    //{path:'asientos_contables_registro',component:AsientosContablesRegistroComponent,canActivate:[AuthGuardService]},
    //{path:'asientos_contables_registro/:token_asiento',component:AsientosContablesRegistroComponent,canActivate:[AuthGuardService]},
    //{path:'asientos_contables_consulta/:token_asiento',component:AsientosContablesConsultaComponent,canActivate:[AuthGuardService]},
    {path:'ejecucion_de_depreciaciones_contables',component:ComingSoonComponent,canActivate:[AuthGuardService]}, 
    {path:'ejecucion_de_amortizaciones_contables',component:ComingSoonComponent,canActivate:[AuthGuardService]}, 
    {path:'reconciliacion_interna_contables',component:ComingSoonComponent,canActivate:[AuthGuardService]},
  //Registros fiscales
	  {path:'cruce_de_xml_internos_vs_xml_sat',component:CruceXmlinternosVsXmlsat,canActivate:[AuthGuardService]},
	  {path:'ingresos_acumulables',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'deducciones_autorizadas',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'declaraciones_anuales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'declaraciones',component:DeclaracionesListaComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_isr_federal',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_iva',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_ieps',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_retenciones_a_terceros',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_retenciones_a_la_nomina',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_isn',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_aportaciones_de_seguridad_social',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    //{path:'catalogodeaportaciones',component:AportacionesListaComponent,canActivate:[AuthGuardService]},
    //{path:'altadeaportaciones',component:AportacionesAltaComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_derechos',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    //{path:'catalogodederechosymejoras',component:DerMejorasListaComponent,canActivate:[AuthGuardService]},
    //{path:'altadederechosymejoras',component:DerMejorasAltaComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_contribuciones',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'calculo_de_actualizaciones_y_recargos',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'movimientos_ante_autoridades_fiscales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'opinion_de_cumplimiento',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'casos_de_aclaracion',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'perdidas_fiscales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'seguimiento_de_saldos_a_favor_de_iva',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'seguimiento_de_saldos_a_favor_de_isr',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'seguimiento_a_casos_de_pago_de_lo_indebido',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'seguimiento_a_cartas_de_invitacion',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'seguimiento_a_requerimientos',component:ComingSoonComponent,canActivate:[AuthGuardService]},
	  {path:'seguimiento_a_creditos_fiscales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
  //Catálogos
    {path:'cuentas_contables',component:CuentasContablesListaComponent,canActivate:[AuthGuardService]},
    {path:'cuentas_fiscales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    {path:'catalogo_de_productos_y_servicios_sat',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    {path:'catalogo_para_diot',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    {path:'catalogo_general_impuestos',component:CatalogoGeneralImpuestosComponent,canActivate:[AuthGuardService]},
    {path:'catalogo_de_deducciones_para_inversiones',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    {path:'catalogo_de_obligaciones_fiscales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    {path:'catalogo_de_registros_fiscales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    {path:'indicadores_fiscales',component:ComingSoonComponent,canActivate:[AuthGuardService]},
    {path:'catalogos/activos_fijos',component:ContActFijosComponent,canActivate:[AuthGuardService]},
    {path:'catalogos/activos_diferidos',component:ContActDiferidosComponent,canActivate:[AuthGuardService]},
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
