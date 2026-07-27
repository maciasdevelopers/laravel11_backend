import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './tecinfo.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service'; 
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { RouterModule } from '@angular/router';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { LenguajesService } from '../../../servicios/lenguajes.service';

//import { BienvTecComponent } from './bienvenido/bienv_tec.component';
//import { LoaderTecComponent } from './loader_tec/loader_tec.component';
//import { NavegadorTecComponent } from './navegador_tec/navegador_tec.component';

//import { AppsComComponent } from './apps-com/apps-com.component';
//import { SoporteComponent } from './soporte/soporte.component';
//import { ComunicacionComponent } from './comunicacion/comunicacion.component';
//import { PublicacionesComponent } from './publicaciones/publicaciones.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { DashboardModule } from '../dashboard.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { InputTextModule } from 'primeng/inputtext';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    //BienvTecComponent,
    //LoaderTecComponent,
    //NavegadorTecComponent,

    //AppsComComponent,
    //SoporteComponent,
    //ComunicacionComponent,
    //PublicacionesComponent,
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgxCaptureModule,
   //NgxSearchFilterModule,
    BienvenidoModule,
    LoaderModule, 
    DashboardModule,
    NavegadorPrincipalModule,
    FooterModule,
    InputTextModule,
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
export class TecinfoModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
