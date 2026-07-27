import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { routing, appRoutingProviders } from './dashboard.routing';
import { AuthGuardService } from '../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../servicios/disauth-guard.service';
import { NgSelectModule } from '@ng-select/ng-select';////import { NgxSearchFilterModule } from 'ngx-search-filter';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgOptimizedImage } from '@angular/common';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../modelos/cajaAngularModelo';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';

//const configSocket:SocketIoConfig = {url:'',options:{}};
import { App } from '../../app';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatbotComponent } from './dashboard/chatbot/chatbot.component';
import { CompleteRegistroComponent } from './complete-registro/complete-registro.component';
import { NavegadorPrincipalModule } from './NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from './footerModule/footer.module';
import { CardModule } from 'primeng/card';
import { BienvenidoModule } from './bienvenidoModule/bienvenido.module';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { SelectModule } from 'primeng/select';

//import { AuthInterceptor } from '../../interceptores/auth-interceptor';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    DashboardComponent,
    ChatbotComponent,
    CompleteRegistroComponent,
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    routing,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,//NgxPaginationModule,
    NgxCaptureModule,
    NgSelectModule,//NgxFilterPipeModule,
    NgxFileDropModule,
    //RouterModule.forChild(routing),
    //TooltipModule,
    NgOptimizedImage,
    NavegadorPrincipalModule,
    FooterModule,
    CardModule,
    BienvenidoModule,
    DialogModule,
    ImageModule,
    SelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
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
    //NotificacionesServService,
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
export class DashboardModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
