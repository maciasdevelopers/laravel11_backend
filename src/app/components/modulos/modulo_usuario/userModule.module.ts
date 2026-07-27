import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FormsModule } from '@angular/forms';

import { routing, appRoutingProviders } from './userRutas.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { InputTextModule } from 'primeng/inputtext';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    PerfilUsuarioComponent,
  ],
  imports: [
    CommonModule,
    routing,
    FormsModule,
    NgbPaginationModule,
    NgxCaptureModule,
   //NgxSearchFilterModule,
    HttpClientModule,
    //TooltipModule,
    NgxFileDropModule,
    NgOptimizedImage,
    InputTextModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NavegadorPrincipalModule,
    BienvenidoModule,
    LoaderModule,
    //SocketIoModule.forRoot(configSocket)
  ],
  exports:[
    FormsModule,
  ],
  providers: [
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    AuthGuardService,
    DisAuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true }
  ],
})
export class UserModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}