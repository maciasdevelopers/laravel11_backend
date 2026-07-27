import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
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

import { App} from '../../../app';
//import { ErrorComponent } from '../error/error.component';
import { DashboardModule } from '../dashboard.module';

import { RegistroEstablecimientoComponent } from './registro-establecimiento/registro-establecimiento.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { Toast } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { SplitterModule } from 'primeng/splitter';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Rating } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TreeModule } from 'primeng/tree';
import { ProductosModule } from '../modulo_articulos/productos.module';
//reportes
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultiSelectModule } from 'primeng/multiselect';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    RegistroEstablecimientoComponent
  ],
  imports: [
    //BrowserModule,
    NgxMaterialIntlTelInputComponent,
    CommonModule,
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
    DividerModule,
    SelectModule,
    MultiSelectModule,
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
  exports: [
    FormsModule,
    RegistroEstablecimientoComponent
  ],
  providers: [
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
export class EstablecimientosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
