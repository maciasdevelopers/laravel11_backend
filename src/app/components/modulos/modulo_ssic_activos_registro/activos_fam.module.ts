import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule, } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
//const configSocket:SocketIoConfig = {url:'',options:{}};
import { RegistroFamActivosFijosComponent } from './registro-fam-activos-fijos/registro-fam-activos-fijos';
import { RegistroFamActivosDiferidosComponent } from './registro-fam-activos-diferidos/registro-fam-activos-diferidos.component';
import { App } from '../../../app';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';

////import { NgxSearchFilterModule } from 'ngx-search-filter';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    RegistroFamActivosFijosComponent,
    RegistroFamActivosDiferidosComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    //NgxCaptureModule,
    //TooltipModule,
    DividerModule,
    Toast,
    SelectModule,
    AutoCompleteModule,
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
    RegistroFamActivosFijosComponent,
    RegistroFamActivosDiferidosComponent
  ],
  providers: [
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
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
export class ActivosFamRegistroModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
