import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './cotizaciones.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
////import { NgxSearchFilterModule } from 'ngx-search-filter';
import { RouterModule } from '@angular/router';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { LenguajesService } from '../../../servicios/lenguajes.service';

import { App} from '../../../app';
//import { ErrorComponent } from '../error/error.component';
//proveedores
import { CotizacionesProveedoresListadoComponent } from './cotizaciones_proveedores/cotizaciones_proveedores_listado/cotizaciones_proveedores_listado.component';
import { CotizacionesProveedoresRegistrarComponent } from './cotizaciones_proveedores/cotizaciones_proveedores_registrar/cotizaciones_proveedores_registrar.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { DashboardModule } from '../dashboard.module';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { PaginacionModule } from '../paginacionModule/paginacion/paginacion.module';
import { PaginatorModule } from 'primeng/paginator';
import { NumeralModule } from 'ngx-numeral';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    //proveedores
    CotizacionesProveedoresListadoComponent,
    CotizacionesProveedoresRegistrarComponent,
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    routing,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule,
    NgxCaptureModule,
    ////NgxSearchFilterModule,
    NgxFileDropModule,
    NumeralModule,
    //RouterModule.forChild(routing),
    //TooltipModule,
    PaginatorModule,
    InputTextModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NavegadorPrincipalModule,
    PaginacionModule,
    TabsModule,
    //SocketIoModule.forRoot(configSocket)
  ],
  exports:[
    FormsModule,
    CommonModule, 
  ],
  providers: [
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
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
  bootstrap: [App]
})
export class CotizacionesModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
