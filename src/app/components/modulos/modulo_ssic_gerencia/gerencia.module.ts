import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './gerencia.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service'; 
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { RouterModule } from '@angular/router';
import { NgxFileDropModule } from 'ngx-file-drop';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { LenguajesService } from '../../../servicios/lenguajes.service';
import { DashboardModule } from '../dashboard.module';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { TabsModule } from 'primeng/tabs';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
//const configSocket:SocketIoConfig = {url:'',options:{}};
registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

//monitoreo
  //comisiones
    import { GerenciaComisionesListaComponent } from './monitoreo/comisiones/comisiones_lista/comisiones_lista.component';
    import { GerenciaComisionesDetalleComponent } from './monitoreo/comisiones/comisiones_detalle/comisiones_detalle.component';
    import { GerenciaComisionesReaperturaComponent } from './monitoreo/comisiones/comisiones_reapertura/comisiones_reapertura.component';
    import { GerenciaComisionesMonitoreoComponent } from './monitoreo/comisiones/comisiones_monitoreo/comisiones_monitoreo.component';

@NgModule({
  declarations: [
    GerenciaComisionesListaComponent,
    GerenciaComisionesDetalleComponent,
    GerenciaComisionesReaperturaComponent,
    GerenciaComisionesMonitoreoComponent,
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
    //NgxSearchFilterModule,
    //TooltipModule,
    NgxFileDropModule,
    //RouterModule.forChild(routing),
    BienvenidoModule,
    LoaderModule, 
    DashboardModule,
    NavegadorPrincipalModule,
    FooterModule,
    TreeModule,
    NgbModule,
    NgOptimizedImage,
    TabsModule,
    AccordionModule,
    TableModule,
    TreeModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
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
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true},
    /*{
      provide:LOCALE_ID,
      deps:[LenguajesService],
      useFactory:(lenguajesService:any) => lenguajesService.getLenguaje()
    },*/
  ],
})
export class GerenciaModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
