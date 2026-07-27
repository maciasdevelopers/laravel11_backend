import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './contabilidad.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service'; 
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { NgxFileDropModule } from 'ngx-file-drop';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { DashboardModule } from '../dashboard.module';

//catalogos
  //impuestos
    import { CatalogoGeneralImpuestosComponent } from "./catalogos/impuestos/catalogo_general_impuestos.component";
  //cuentas contables
    import { CuentasContablesListaComponent } from './catalogos/cuentas_contables/cuentas_contables_lista/cuentas_contables_lista.component';
    import { CuentasContablesRegistroComponent } from './catalogos/cuentas_contables/cuentas_contables_registro/cuentas_contables_registro.component';

  //Aportaciones
    import { AportacionesAltaComponent } from "./catalogos/contribuciones/aportaciones/alta/aportaciones_alta.component";
    import { AportacionesListaComponent } from "./catalogos/contribuciones/aportaciones/lista/aportaciones_lista.component";

  //DerMejoras
    import { DerMejorasListaComponent } from "./catalogos/contribuciones/derechos_y_mejoras/lista/dermejoras_lista.component";
    import { DerMejorasAltaComponent } from "./catalogos/contribuciones/derechos_y_mejoras/alta/dermejoras_alta.component";

  //DerMejoras
    import { ContabilidadPoliticasHomeComponent } from './politicas/politicas_home/politicas_home.component';
    import { ContabPoliticComiComponent } from './politicas/politicas_comisiones/politicas_comisiones.component';
    import { ContabPoliticReemComponent } from './politicas/politicas_reembolsos/politicas_reembolsos.component';
    import { ContabPoliticProvComponent } from './politicas/politicas_proveedores/politicas_proveedores.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { ContabPoliticDetalleComponent } from './politicas/politicas_detalle/politicas_detalle.component';

import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { RegistrosParaAutorizarComponent } from './registros_contables/registros_para_autorizar/registros_para_autorizar.component';
import { TabsModule } from 'primeng/tabs';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
//import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TreeTableModule } from 'primeng/treetable';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DeclaracionesListaComponent } from './registros_fiscales/declaraciones/declaraciones_lista/declaraciones-component';
import { DeclaracionesRegistroComponent } from './registros_fiscales/declaraciones/declaraciones-registro/declaraciones-registro';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { Toast } from 'primeng/toast';
import { ContActFijosComponent } from './catalogos/cont-act-fijos/cont-act-fijos-component';
import { ContActDiferidosComponent } from './catalogos/cont-act-diferidos/cont-act-diferidos-component';

// Asientos contables
import { AsientosContablesListaComponent } from './registros_contables/asientos_contables/lista/asientos_contables_lista.component';
import { AsientosContablesRegistroComponent } from './registros_contables/asientos_contables/registro/asientos_contables_registro.component';
import { AsientosContablesConsultaComponent } from './registros_contables/asientos_contables/consulta/asientos_contables_consulta.component';
import { ContabilidadOrdenesDevengacionComponent } from './registros_contables/contabilidad_ordenes_devengacion/contabilidad_ordenes_devengacion.component';
import { ContabilidadSolicitudesCancelacion } from './contabilidad-solicitudes-cancelacion/contabilidad-solicitudes-cancelacion';
import { CruceXmlinternosVsXmlsat } from './registros_fiscales/cruce-xmlinternos-vs-xmlsat/cruce-xmlinternos-vs-xmlsat';

// PrimeNG modules adicionales
// import { CalendarModule } from 'primeng/calendar';
// import { DropdownModule } from 'primeng/dropdown';
// import { InputTextareaModule } from 'primeng/inputtextarea';
// import { AutoCompleteModule } from 'primeng/autocomplete';
//const configSocket:SocketIoConfig = {url:'',options:{}};
registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    CatalogoGeneralImpuestosComponent,
    CuentasContablesListaComponent,
    CuentasContablesRegistroComponent,
    AportacionesAltaComponent,
    AportacionesListaComponent,
    DerMejorasListaComponent,
    DerMejorasAltaComponent,
    ContabilidadPoliticasHomeComponent,
    ContabPoliticComiComponent,
    ContabPoliticReemComponent,
    ContabPoliticProvComponent,
    ContabPoliticDetalleComponent,
    RegistrosParaAutorizarComponent,
    DeclaracionesListaComponent,
    DeclaracionesRegistroComponent,
    ContActFijosComponent,
    ContActDiferidosComponent,
    AsientosContablesListaComponent,
    AsientosContablesRegistroComponent,
    AsientosContablesConsultaComponent,
    ContabilidadOrdenesDevengacionComponent,
    ContabilidadSolicitudesCancelacion,
    CruceXmlinternosVsXmlsat,
  ],
  imports: [
    CommonModule,
    routing,
    HttpClientModule,
    FormsModule,
    NgbCollapseModule,
    NgbModule,
    NgbPaginationModule,
    MatListModule,
    MatPaginatorModule,
    PaginatorModule,
    NgxCaptureModule,
    //NgxSearchFilterModule,
    //TooltipModule,
    NgxFileDropModule,
    BienvenidoModule,
    LoaderModule, 
    DashboardModule,
    NavegadorPrincipalModule,
    FooterModule,
    NgbModule,
    NgOptimizedImage,
    TabsModule,
    AccordionModule,
    TableModule,
    TreeModule,
    DividerModule,
    //DropdownModule,
    InputNumberModule,
    ReactiveFormsModule,
    SelectModule,
    TreeTableModule,
    TagModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DialogModule,
    DatePickerModule,
    Toast,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    })
    //SocketIoModule.forRoot(configSocket)
  ],
  ///  InputTextareaModule,
  ///  AutoCompleteModule
  ///  //SocketIoModule.forRoot(configSocket)
  ///],
  exports:[
    FormsModule,
  ],
  providers: [
    appRoutingProviders,
    AuthGuardService,
    DisAuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true },

    /*{
      provide:LOCALE_ID,
      deps:[LenguajesService],
      useFactory:(lenguajesService:any) => lenguajesService.getLenguaje()
    },*/
  ],
})
export class ContabilidadModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
