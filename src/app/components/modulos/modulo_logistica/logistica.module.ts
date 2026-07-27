import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './logistica.routing';
//import { AuthGuardService } from '../../../servicios/auth-guard.service';
//import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { RouterModule } from '@angular/router';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LenguajesService } from '../../../servicios/lenguajes.service';

import { LogGuardService } from '../../../servicios/logistica/log_auth.service';
import { LogDisGuardService } from "../../../servicios/logistica/log_disauth.service";

import { DashboardPrincipalComponent } from "./dashboard-principal/dashboard-principal.component";
import { DashboardLogisticaComponent } from "./dashboard-logistica/dashboard-logistica.component";
import { DashboardMaquiladorComponent } from "./dashboard-maquilador/dashboard-maquilador.component";

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { TabsModule } from 'primeng/tabs';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    DashboardPrincipalComponent,
    DashboardLogisticaComponent,
    DashboardMaquiladorComponent,
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
    BienvenidoModule,
    LoaderModule,
    NavegadorPrincipalModule,
    FooterModule,
    TabsModule,
    InputTextModule,
    //TooltipModule,
    AccordionModule,
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
    LogGuardService,
    LogDisGuardService,
    //NotificacionesServService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true },

    /*{
      provide:LOCALE_ID,
      deps:[LenguajesService],
      useFactory:(lenguajesService:any) => lenguajesService.getLenguaje()
    },*/
  ],
})
export class LogisticaModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
