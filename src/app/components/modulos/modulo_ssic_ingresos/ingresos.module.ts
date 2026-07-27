import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './ingresos.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
//import { Ng2SearchPipeModule } from '@ngx-maintenance/ng2-search-filter';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { RouterModule } from '@angular/router';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { LenguajesService } from '../../../servicios/lenguajes.service';
import { DashboardModule } from '../dashboard.module';

import { ListaDescuentosIngresosComponent } from './catalogos/descuentos/lista/listadescuentosingresos.component';
import { AltaDescuentosIngresosComponent } from './catalogos/descuentos/alta/altadescuentosingresos.component';
import { ListaPromocionesIngresosComponent } from './catalogos/promociones/lista/listapromocionesingresos.component';
import { AltaPromocionesIngresosComponent } from './catalogos/promociones/alta/altapromocionesingresos.component';
//ListaProdIngresosComponent
//ListaProdIngresosComponent
import { ListaClientesIngresosComponent } from './catalogos/clientes/lista/listaclientesingresos.component';
import { AltaClientesIngresosComponent } from './catalogos/clientes/alta/altaclientesingresos.component';

import { VentasMainComponent } from './ventas/ventas-main/ventas-main.component';
import { ListaPedidosIngresosComponent } from './ventas/seguimiento_venta/venta_pedidos_lista/listapedidosingresos.component'; 
import { AltaPedidosIngresosComponent } from './ventas/nuevo_registro_venta/venta_pedidos_alta/altapedidosingresos.component';
import { AltaVentasIngresosComponent } from './ventas/nuevo_registro_venta/venta_orden_alta/venta_orden_alta.component';
import { ListaGeneralVentasIngresosComponent } from './ventas/seguimiento_venta/venta_orden_lista_general/venta_orden_lista_general.component';
import { SeguimientoVentasComponent } from './ventas/seguimiento_venta/seguimiento/seguimiento.component';

import { ReportesIngresosComponent } from './reportes/reportes.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { NgxFileDropModule } from 'ngx-file-drop';

import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
import { CatSoliFactComponent } from './facturacion/cat-soli-fact-component/cat-soli-fact.component';
import { NewFactComponent } from './facturacion/new-fact-component/new-fact.component';
import { DetalleFacturaComponent } from './facturacion/detalle-factura/detalle-factura.component';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { AccordionModule } from 'primeng/accordion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Toast } from 'primeng/toast';
import { MegaMenuModule } from 'primeng/megamenu';
import { InputTextModule } from 'primeng/inputtext';
import { AsociadosModule } from '../modulo_terceros_asociados/asociados.module';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Popover } from "primeng/popover";
import { DatePickerModule } from 'primeng/datepicker';
import { IngresosSolicitudesCancelacion } from './ingresos-solicitudes-cancelacion/ingresos-solicitudes-cancelacion';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    ListaDescuentosIngresosComponent,
    AltaDescuentosIngresosComponent,
    ListaPromocionesIngresosComponent,
    AltaPromocionesIngresosComponent,
    ListaClientesIngresosComponent,
    AltaClientesIngresosComponent,

    VentasMainComponent,
    ListaPedidosIngresosComponent,
    AltaPedidosIngresosComponent,
    AltaVentasIngresosComponent,
    ListaGeneralVentasIngresosComponent,
    SeguimientoVentasComponent,

    ReportesIngresosComponent,
    CatSoliFactComponent,
    NewFactComponent,
    DetalleFacturaComponent,
    IngresosSolicitudesCancelacion,
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
    //Ng2SearchPipeModule,
    //TooltipModule,
    NgxFileDropModule,
    //RouterModule.forChild(routing),
    BienvenidoModule,
    LoaderModule,
    DashboardModule,
    NavegadorPrincipalModule,
    FooterModule,
    NgxMaterialIntlTelInputComponent,
    ReactiveFormsModule,
    TabsModule,
    AccordionModule,
    TableModule,
    SelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
    DividerModule,
    InputTextModule,
    Toast,
    MegaMenuModule,
    AsociadosModule,
    ConfirmPopupModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
    //SocketIoModule.forRoot(configSocket)
    ,
    Popover
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
export class IngresosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
