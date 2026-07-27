import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './inventarios.routing';
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

import { App } from '../../../app';
//import { ErrorComponent } from '../error/error.component';
import { DashboardModule } from '../dashboard.module';


import { InventariosOrdenesRecepcionComponent } from './registros_relacionados_con_movimientos_al_inventario/inventarios_ordenes_recepcion/inventarios_ordenes_recepcion.component';

//productos
import { ProductosInventariosMainComponent } from './inventarios_catalogos/productos/productos_main/productos_main.component';
import { ProductosInventariosCatalogoComponent } from './inventarios_catalogos/productos/productos-inventarios-catalogo/productos-inventarios-catalogo.component';
import { ProductosVmostradorCatalogoComponent } from './inventarios_catalogos/productos/productos-vmostrador-catalogo/productos-vmostrador-catalogo.component';
import { ProductosCategoriasComponent } from './inventarios_catalogos/productos/productos-categorias/productos-categorias.component';

//servicios
import { InventServiciosMainComponent } from './inventarios_catalogos/servicios/servicios-main.component';
import { InventServComprasListaComponent } from './inventarios_catalogos/servicios/invent-serv-compras-lista/invent-serv-compras-lista.component';
import { InventServVentasRegistroComponent } from './inventarios_catalogos/servicios/invent-serv-ventas-registro/invent-serv-ventas-registro.component';
import { InventServVentasListaComponent } from './inventarios_catalogos/servicios/invent-serv-ventas-lista/inventservventas_lista.component';
import { InventServVentasMostradorRegistroComponent } from './inventarios_catalogos/servicios/invent-serv-ventas-mostrador-registro/invent-serv-ventas-mostrador-registro.component';
import { InventServVentasMostradorListaComponent } from './inventarios_catalogos/servicios/invent-serv-ventas-lista-mostrador/invent-serv-ventas-lista-mostrador.component';
//import { InventServComprasDetalleComponent } from './servicios_compras/invent-serv-compras-detalle/invent-serv-compras-detalle.component';
//import { InventServVentasDetalleComponent } from './servicios_ventas/detalle/inventservventas_detalle.component';
//import { InventServVentasMostradorDetalleComponent } from './servicios_ventas/detalle-mostrador/inventservventas_mostrador_detalle.component';

//Códigos de barras
import { CodigosDeBarrasComponent } from './inventarios_catalogos/codigos-de-barras/codigos-de-barras.component';

//Lotes
import { CatalogoLoteInventComponent } from './inventarios_catalogos/lotes/lotes_cat_component.component';

//Pedimentos aduanales
import { ListaPedimentoEgresosComponent } from './inventarios_catalogos/pedimentos/pedimentos_cat_component.component';

//Series
import { SeriesCatalogoComponent } from './inventarios_catalogos/series/series_cat_component.component';

//Lineas de productos
import { LineasDeProductosComponent } from './inventarios_catalogos/lineas-de-productos/lineas-de-productos.component';

//Departamentos
import { DepartamentosComponent } from './inventarios_catalogos/departamentos/departamentos.component';

//Activos fijos
import { ListaActivoFijoEgresosComponent } from './inventarios_catalogos/act_fijos/lista_activos_fijos/lista_activos_fijos.component';

//Activos intangibles
import { ListaActivoDiferidoInventariosComponent } from "./inventarios_catalogos/act_intang/listaactivointangegresos.component";

//Establecimientos
import { EstablecimientosInventariosComponent } from './inventarios_catalogos/establecimientos/listaestablecimiento.component';

//lista de precios
import { ListaPreciosComponent } from './inventarios_catalogos/lista-precios/lista-precios.component';

import { ListaGastoEgresosComponent } from './inventarios_catalogos/gastos/lista/listagastoegresos.component';
import { AltaGastoEgresosComponent } from './inventarios_catalogos/gastos/alta/altagastoegresos.component';

//unidades de medida
import { UnidadesMedidaComponent } from './inventarios_catalogos/unidades-medida/unidades-medida.component';

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
import { InventKardexComponent } from './inventarios_reportes/inventarios_kardex/inventarios_kardex.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { EstablecimientosModule } from '../modulo_establecimientos/establecimientos.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivosFamRegistroModule } from '../modulo_ssic_activos_registro/activos_fam.module';
import { DatePickerModule } from 'primeng/datepicker';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    //ordenes de recepcion
    InventariosOrdenesRecepcionComponent,
    //productos
    ProductosInventariosMainComponent,
    ProductosVmostradorCatalogoComponent,
    ProductosInventariosCatalogoComponent,
    ProductosCategoriasComponent,

    //servicios
    InventServiciosMainComponent,
    InventServComprasListaComponent,
    InventServVentasRegistroComponent,
    InventServVentasListaComponent,
    InventServVentasMostradorRegistroComponent,
    InventServVentasMostradorListaComponent,

    //InventServVentasDetalleComponent,
    //InventServVentasMostradorDetalleComponent,
    //InventServComprasDetalleComponent,

    //Códigos de barras
    CodigosDeBarrasComponent,

    //Lotes
    CatalogoLoteInventComponent,

    //Pedimentos aduanales
    ListaPedimentoEgresosComponent,

    //Series
    SeriesCatalogoComponent,

    //Lineas de productos
    LineasDeProductosComponent,

    //Departamentos
    DepartamentosComponent,

    //Activos fijos
    ListaActivoFijoEgresosComponent,

    //Activos intangibles
    ListaActivoDiferidoInventariosComponent,

    //Establecimientos
    EstablecimientosInventariosComponent,
    //lista de precios
    ListaPreciosComponent,
    UnidadesMedidaComponent,
    ListaGastoEgresosComponent,
    AltaGastoEgresosComponent,
    //reportes
    InventKardexComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    routing,
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
    //RouterModule.forChild(routing),
    BienvenidoModule,
    LoaderModule,
    DashboardModule,
    FooterModule,
    //TooltipModule,
    NgOptimizedImage,
    NgxMaterialIntlTelInputComponent,
    TabsModule,
    DividerModule,
    Toast,
    PanelModule,
    AccordionModule,
    TableModule,
    SplitterModule,
    FieldsetModule,
    DialogModule,
    ConfirmPopupModule,
    Rating,
    SelectModule,
    MultiSelectModule,
    TreeModule,
    ProductosModule,
    ActivosFamRegistroModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    AutoCompleteModule,
    DatePickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NavegadorPrincipalModule,
    DataViewModule,
    TagModule,
    ButtonModule,
    EstablecimientosModule,
    //SocketIoModule.forRoot(configSocket)
  ],
  exports: [
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
  bootstrap: [App]
})
export class InventariosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
