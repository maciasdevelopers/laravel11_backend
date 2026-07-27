import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgOptimizedImage } from '@angular/common';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';

//const configSocket:SocketIoConfig = {url:'',options:{}};
import { ProductosInventariosRegistroComponent } from './productos-inventarios-registro/productos-inventarios-registro.component';
import { ProductosVmostradorRegistroComponent } from './productos-vmostrador-registro/productos-vmostrador-registro.component';
import { InventServComprasAltaComponent } from './invent-serv-compras-alta/invent-serv-compras-alta.component';
import { App } from '../../../app';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

////import { NgxSearchFilterModule } from 'ngx-search-filter';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    ProductosInventariosRegistroComponent,
    ProductosVmostradorRegistroComponent,
    InventServComprasAltaComponent,
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule,//NgxPaginationModule,
    NgxCaptureModule,
    NgSelectModule,//NgxFilterPipeModule,
    NgxFileDropModule,
    //RouterModule.forChild(routing),
    //TooltipModule,
    NgOptimizedImage,
    DividerModule,
    SelectModule,
    TableModule,
    Toast,
    ConfirmPopupModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
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
    ProductosInventariosRegistroComponent,
    ProductosVmostradorRegistroComponent,
    InventServComprasAltaComponent,
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
export class ProductosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
