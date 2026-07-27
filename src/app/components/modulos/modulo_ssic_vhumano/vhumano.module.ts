import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { routing, appRoutingProviders } from './vhumano.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { RouterModule } from '@angular/router';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DashboardModule } from '../dashboard.module';
import { VHCentrosTrabajoAltaComponent } from "./catalogos/centros_de_trabajo/alta/alta_centros_de_trabajo.component";
import { VHCentrosTrabajoListaComponent } from "./catalogos/centros_de_trabajo/lista/lista_centros_de_trabajo.component";

import { VHTrabajadoresRegistroComponent } from './catalogos/trabajadores/trabajadores_registro/trabajadores_registro.component';
import { VHTrabajadoresListaComponent } from './catalogos/trabajadores/trabajadores_lista/trabajadores_lista.component';
import { VHTrabajadoresControlAsistenciasComponent } from './catalogos/trabajadores/trabajadores_control_asistencias/trabajadores_control_asistencias.component';
import { VHTrabajadoresNominasComponent } from './catalogos/trabajadores/trabajadores_nominas/trabajadores_nominas.component';
import { VHTrabajadoresAportacionesComponent } from './catalogos/trabajadores/trabajadores_aportaciones/trabajadores_aportaciones.component';
import { VHReportesNominaAnalisisComponent } from './reportes/analisis_de_nomina/analisis_de_nomina.component';

import { VHumReembolsosComponent } from './otros/reembolsos/vh-reembolsos/vh-reembolsos.component';
import { VHumReemDetComponent } from './otros/reembolsos/det-reembolsos/det-reembolsos.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ContribucionesEIsnComponent } from './registros_vinculados_a_valor_humano/contribuciones-e-isn/contribuciones-e-isn.component';
import { IsnCatalogoComponent } from './registros_vinculados_a_valor_humano/contribuciones-e-isn/imp_sobre_nomi/imp_sobre_nomi_catalogo/imp_sobre_nomi_catalogo.component';
import { IsnRegistroComponent } from './registros_vinculados_a_valor_humano/contribuciones-e-isn/imp_sobre_nomi/imp_sobre_nomi_registro/imp_sobre_nomi_registro.component';
import { AportacionesSeguridadSocialCatalogoComponent } from './registros_vinculados_a_valor_humano/contribuciones-e-isn/aport_seg_social/aport_seg_social_catalogo/aport_seg_social_catalogo.component';
import { AportacionesSeguridadSocialRegistroComponent } from './registros_vinculados_a_valor_humano/contribuciones-e-isn/aport_seg_social/aport_seg_social_registro/aport_seg_social_registro.component'; 
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { NuevoReporteNomina } from './reportes/analisis_de_nomina/nuevo-reporte-nomina/nuevo-reporte-nomina';
import { DatePickerModule } from 'primeng/datepicker';
import { EstablecimientosModule } from '../modulo_establecimientos/establecimientos.module';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { InputNumberModule } from 'primeng/inputnumber';
import { VHReportesAsimiladosAnalisisComponent } from './reportes/analisis_de_asimilados/analisis_de_asimilados';
import { NuevoReporteAsimilados } from './reportes/analisis_de_asimilados/nuevo-reporte-asimilados/nuevo-reporte-asimilados';
import { VHumanoSolicitudesCancelacion } from './vhumano-solicitudes-cancelacion/vhumano-solicitudes-cancelacion';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

const dbConfig: DBConfig = {
  name: 'NominaDB',
  version: 2,
  objectStoresMeta: [{
    store: 'borrador_nomina',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'contenido', keypath: 'contenido', options: { unique: false } }
    ]
  }]
};

@NgModule({
  declarations: [
    VHCentrosTrabajoAltaComponent,
    VHCentrosTrabajoListaComponent,

    VHTrabajadoresRegistroComponent,
    VHTrabajadoresListaComponent,
    VHTrabajadoresControlAsistenciasComponent,
    VHTrabajadoresNominasComponent,
    VHTrabajadoresAportacionesComponent,

    VHReportesNominaAnalisisComponent,
    VHumReembolsosComponent,
    VHumReemDetComponent,
    ContribucionesEIsnComponent,
    IsnRegistroComponent,
    IsnCatalogoComponent,
    AportacionesSeguridadSocialCatalogoComponent,
    AportacionesSeguridadSocialRegistroComponent,
    NuevoReporteNomina,
    VHReportesAsimiladosAnalisisComponent,
    NuevoReporteAsimilados,
    VHumanoSolicitudesCancelacion,
  ],
  imports: [
    //BrowserModule,
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
    NgOptimizedImage,
    //NgxSearchFilterModule,
    NgxFileDropModule,
    BienvenidoModule,
    LoaderModule, 
    DashboardModule,
    NavegadorPrincipalModule,
    FooterModule,
    TooltipModule,
    TabsModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    DividerModule,
    SelectModule,
    Toast,
    NgxMaterialIntlTelInputComponent,
    ReactiveFormsModule,
    ConfirmPopupModule,
    ButtonModule,
    AccordionModule,
    DatePickerModule,
    EstablecimientosModule,
    TreeModule,
    TreeSelectModule,
    InputNumberModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    //RouterModule.forChild(routing),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    })
    //SocketIoModule.forRoot(configSocket)
  ],
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
export class VhumanoModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
