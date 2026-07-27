import { CommonModule, CurrencyPipe, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeMX from '@angular/common/locales/es-MX';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { App} from '../../../app';
import { DashboardModule } from '../dashboard.module';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { Toast } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { SplitterModule } from 'primeng/splitter';
import { PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
//const configSocket:SocketIoConfig = {url:'',options:{}};

import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ProductosModule } from '../modulo_articulos/productos.module';

import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { OrderListModule } from 'primeng/orderlist';
import { NumeralFormatPipe } from '../../../pipes/numeral-format.pipe';
import { MegaMenuModule } from 'primeng/megamenu';
//import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { DataViewModule } from 'primeng/dataview';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { TextareaModule } from 'primeng/textarea';
registerLocaleData(localeMX);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}
//reembolsos
import { EgresosReembolsosGeneralComponent } from './compras_reembolsos_lista_general/compras_reembolsos_lista_general.component';
import { EgresosReembolsosAutorizadosComponent } from './compras_reembolsos_lista_autorizados/compras_reembolsos_lista_autorizados.component';
//comisiones
import { EgresosComisionesListaGeneralComponent } from './compras_comisiones_lista_general/compras_comisiones_lista_general.component';
import { EgresosComisionesListaNoConcluidasComponent } from './compras_comisiones_lista_no_conc/compras_comisiones_lista_no_conc.component';
import { EgresosComisionesListaConcluidasComponent } from './compras_comisiones_lista_conc/compras_comisiones_lista_conc.component';
import { EgresosComisionesListasDeletedComponent } from './compras_comisiones_lista_deleted/compras_comisiones_lista_deleted.component';
import { EgresosComisionesRegistrarComponent } from './compras_comisiones_registro/compras_comi_registro.component';
import { DatePickerModule } from 'primeng/datepicker';


@NgModule({
  declarations: [
    EgresosReembolsosGeneralComponent,
    EgresosReembolsosAutorizadosComponent,
    EgresosComisionesListaGeneralComponent,
    EgresosComisionesListaNoConcluidasComponent,
    EgresosComisionesListaConcluidasComponent,
    EgresosComisionesListasDeletedComponent,
    EgresosComisionesRegistrarComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule, 
    NgbModule, 
    NgbPaginationModule,
    MatListModule,
    MatPaginatorModule,
    PaginatorModule,
    NgxCaptureModule,
    //NgxSearchFilterModule,
    NgxFileDropModule,
    BienvenidoModule,
    LoaderModule, 
    DashboardModule,
    FooterModule,
    //TooltipModule,
    NgOptimizedImage,
    NgxMaterialIntlTelInputComponent,
    TabsModule,
    TableModule,
    InputTextModule,
    AccordionModule,
    DividerModule,
    Toast,
    PanelModule,
    SplitterModule,
    PopoverModule,
    DialogModule,
    MenubarModule,
    ProductosModule,
    NumeralFormatPipe,
    TagModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    ProgressBar,
    ButtonModule,
    SliderModule,
    OrderListModule,
    MegaMenuModule,
    //OverlayPanelModule,
    CardModule,
    FieldsetModule,
    DataViewModule,
    PanelMenuModule,
    MenuModule,  
    CurrencyPipe,
    DatePickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NavegadorPrincipalModule,
    //SocketIoModule.forRoot(configSocket)
  ],
  exports:[
    FormsModule,
    CommonModule,
    EgresosReembolsosGeneralComponent,
    EgresosReembolsosAutorizadosComponent,
    EgresosComisionesListaGeneralComponent,
    EgresosComisionesListaNoConcluidasComponent,
    EgresosComisionesListaConcluidasComponent,
    EgresosComisionesListasDeletedComponent,
    EgresosComisionesRegistrarComponent,
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
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true },

    /*{
      provide:LOCALE_ID,
      deps:[LenguajesService],
      useFactory:(lenguajesService:any) => lenguajesService.getLenguaje()
    },*/
  ],
  bootstrap: [App]
})
export class EgresosComprasReembolsosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
