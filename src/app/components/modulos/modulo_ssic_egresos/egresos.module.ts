import { CommonModule, CurrencyPipe, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './egresos.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { RouterModule } from '@angular/router';
import { NgxFileDropModule } from 'ngx-file-drop';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { LenguajesService } from '../../../servicios/lenguajes.service';

import { App } from '../../../app';
//import { ErrorComponent } from '../error/error.component';
import { DashboardModule } from '../dashboard.module';

import { ListaProvEgresosComponent } from './proveedores/lista/listaprovegresos.component';
import { ValidacionProvEgresosComponent } from "./proveedores/validacion/validacionprovegresos.component";
import { AltaProvEgresosComponent } from "./proveedores/alta/altaprovegresos.component";
import { EgresosAltaProvReembolsosComponent } from './proveedores/alta_para_reembolsos/egresos_alta_prov_reembolsos.component';

//compras_requisicion
import { ListaRequisicionComponent } from './compras/instruccion_para_orden_de_compra/compras_requisicion/lista/listarequisicion.component';
import { AltaRequisicionComponent } from './compras/instruccion_para_orden_de_compra/compras_requisicion/alta/altarequisicion.component';
//compras_cotizacion
import { ListaCotizacionComponent } from './compras/instruccion_para_orden_de_compra/compras_cotizaciones/lista/listacotizacion.component';
import { AltaCotizacionComponent } from './compras/instruccion_para_orden_de_compra/compras_cotizaciones/nuevo_registro/altacotizacion.component';
//compras_instruccion
import { InstruccionCompraComponent } from './compras/instruccion_para_orden_de_compra/compras_instruccion/instruccion-compra.component';
//compras_registro
import { ComprasMainComponent } from './compras/compras-main.component';
import { RegistroCompraCFDIComponent } from './compras/compra_nuevo_registro/compras_registro_por_cfdi/registro_por_cfdi.component';
import { RegistroCompraInstruccionComponent } from './compras/compra_nuevo_registro/compras_registro_por_instruccion/registro_por_instruccion.component';
import { RegistroCompraProductosComponent } from './compras/compra_nuevo_registro/compras_registro_por_productos/registro_por_productos.component';
import { PagoOrdenForCompraComponent } from './compras/compra_nuevo_registro/pago_orden_for_compra/pago_orden_for_compra.component';
import { ProveedoresAnticipoComponent } from './compras/compra_nuevo_registro/compras_anticipo_proveedor/proveedores-anticipo.component';
//import { SeguimientoComprasComponent } from './compras/compra_segumiento/segcompra.component';
import { ComprasListaProrrateanComponent } from './compras/compra_segumiento/compras_prorrateo_antes_de_recepcion/compras_lista_prorratean/compras_lista_prorratean.component';
import { ComprasProrrateosInfoComponent } from './compras/compra_segumiento/compras_prorrateo_antes_de_recepcion/compras_prorrateos_info/compras_prorrateos_info.component';
import { CompraDevolucionSolicitarComponent } from './compras/compra_nuevo_registro/compras_solicitar_devolucion/compras_solicitar_devolucion.component';
import { CompraDevolucionSolicitudComponent } from './compras/compra_segumiento/compras_solicitudes_devolucion/compras_solicitudes_devolucion.component';
//import { AltaComprasComponent } from './compras/compras/registro/registro_main/registro_main.component';
//import { CompraPeriodicaComponent } from './compras/registro_compras/compras_periodicas/compras_periodicas.component';
//import { ComprasDescuentosComponent } from './compras/registro_compras/compras_descuentos/compras-descuentos.component';
import { ReportesComponent } from './reportes/reportes.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';

import { ComisionesYReembolsosComponent } from './comisiones_y_reembolsos/comisiones_y_reembolsos.component';
import { TercReemListasComponent } from './seccion_empleados/terc_reem_lista/terc_reem_lista.component';
import { TercProvRegistroComponent } from './seccion_empleados/terc_prov_registro/terc_prov_registro.component';
import { TercReemRegistrarComponent } from './seccion_empleados/terc_reem_new/terc_reem_new.component';

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
//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
import { EEGRComisionesAvisosComponent } from '../modulo_ssic_compras_reembolsos/comisiones-avisos/comisiones-avisos.component';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import { ComprasSolicitarDescuentosComponent } from './compras/compra_nuevo_registro/compras_solicitar_descuentos/compras_solicitar_descuentos.component';
import { ComprasSolicitudesDeDescuentoComponent } from './compras/compra_segumiento/compras_solicitudes_descuento/compras_solicitudes_descuento.component';
import { FacturacionproveedorComponent } from './compras/compra_nuevo_registro/compras_facturacion/facturacionproveedor.component';
import { NotasCreditoProvAltaComponent } from './compras/compra_nuevo_registro/compras_notas_de_credito_prov/compras_notascreditoprvalta/compras_notascreditoprvalta.component';
import { NotasCreditoProvListaComponent } from './compras/compra_nuevo_registro/compras_notas_de_credito_prov/compras_notascreditoprvlista/compras_notascreditoprvlista.component';
import { NotasDebitoProvAltaComponent } from './compras/compra_nuevo_registro/compras_notas_de_debito_prov/compras_notasdebitoprvalta/compras_notasdebitoprvalta.component';
import { NotasDebitoProvListaComponent } from './compras/compra_nuevo_registro/compras_notas_de_debito_prov/compras_notasdebitoprvlista/compras_notasdebitoprvlista.component';
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

import { ConciliacionCFDIComponent } from './compras/conciliacion-cfdi/conciliacion-cfdi.component';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { DesgloseRegistroCompraComponent } from './compras/compra_segumiento/desglose-registro-compra/desglose-registro-compra.component';
import { SeguimientoOrdenpagoRegistroCompraComponent } from './compras/compra_segumiento/seguimiento-ordenpago-registro-compra/seguimiento-ordenpago-registro-compra.component';
import { SeguimientoOrdenrecepcionRegistroCompraComponent } from './compras/compra_segumiento/seguimiento-ordenrecepcion-registro-compra/seguimiento-ordenrecepcion-registro-compra.component';
import { DataViewModule } from 'primeng/dataview';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { TextareaModule } from 'primeng/textarea';
import { EgresosComprasReembolsosModule } from '../modulo_ssic_compras_reembolsos/compras_reembolsos.module';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProvVinculacionUsuarios } from './proveedores/prov-vinculacion-usuarios/prov-vinculacion-usuarios';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivosFamRegistroModule } from '../modulo_ssic_activos_registro/activos_fam.module';
import { EgresosSolicitudesDeCancelacion } from './egresos-solicitudes-de-cancelacion/egresos-solicitudes-de-cancelacion';
import { RegistroGeneralCompras } from './compras/compra_segumiento/registro-general-compras/registro-general-compras';
import { ComprasPorAutorizar } from './compras/compra_segumiento/compras-por-autorizar/compras-por-autorizar';
import { ComprasAutorizadas } from './compras/compra_segumiento/compras-autorizadas/compras-autorizadas';
import { RecepcionDeFacturas } from './compras/compra_segumiento/recepcion-de-facturas/recepcion-de-facturas';
import { ComprasProgramadas } from './compras/compra_segumiento/compras-programadas/compras-programadas';
import { NotasDeCreditoRegistradas } from './compras/compra_segumiento/notas-de-credito-registradas/notas-de-credito-registradas';
import { ComprasPagadas } from './compras/compra_segumiento/compras-pagadas/compras-pagadas';
import { NotasDeDebitoRegistradas } from './compras/compra_segumiento/notas-de-debito-registradas/notas-de-debito-registradas';
import { EgresosLogisticaDeCompras } from './logistica-de-compras/logistica-de-compras';
import { LogisticaIniciarRutaComponent } from './logistica-de-compras/logistica-iniciar-ruta-component/logistica-iniciar-ruta-component';
import { LogisticaRegistraLlegadaFechaComponent } from './logistica-de-compras/logistica-registra-llegada-fecha-component/logistica-registra-llegada-fecha-component';
import { LogisticaAutorizaLlegadaComponent } from './logistica-de-compras/logistica-autoriza-llegada-component/logistica-autoriza-llegada-component';
import { EstablecimientosModule } from '../modulo_establecimientos/establecimientos.module';
import { A11yModule } from "@angular/cdk/a11y";
import { CargaCfdisTraslado } from './compras/compra_segumiento/carga-cfdis-traslado/carga-cfdis-traslado';
import { LogisticaContinuarRutaComponent } from './logistica-de-compras/logistica-continuar-ruta-component/logistica-continuar-ruta-component';
import { LogisticaMonitorComponent } from './logistica-de-compras/logistica-monitor-component/logistica-monitor-component';
import { CheckboxModule } from 'primeng/checkbox';
import { DrawerModule } from 'primeng/drawer';
import { TimelineModule } from 'primeng/timeline';
import { TextTruncatePipe } from '../../../pipes/text-truncate-pipe';
import { AvatarModule } from 'primeng/avatar';
import { TreeModule } from 'primeng/tree';
import { OrganizationChartModule } from 'primeng/organizationchart';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    ListaProvEgresosComponent,
    ValidacionProvEgresosComponent,
    AltaProvEgresosComponent,
    EgresosAltaProvReembolsosComponent,
    //compras
    ListaRequisicionComponent,
    AltaRequisicionComponent,
    ListaCotizacionComponent,
    AltaCotizacionComponent,
    ComprasMainComponent,
    //AltaComprasComponent,
    //RegistroCompraPrevInstComponent,
    RegistroCompraCFDIComponent,
    RegistroCompraInstruccionComponent,
    RegistroCompraProductosComponent,
    PagoOrdenForCompraComponent,
    //SeguimientoComprasComponent,
    ComprasListaProrrateanComponent,
    ComprasProrrateosInfoComponent,
    ReportesComponent,
    ComisionesYReembolsosComponent,

    //EgresosComisionesDetailComponent,
    TercReemListasComponent,
    TercProvRegistroComponent,
    TercReemRegistrarComponent,

    EEGRComisionesAvisosComponent,
    InstruccionCompraComponent,
    ComprasSolicitarDescuentosComponent,
    ComprasSolicitudesDeDescuentoComponent,
    ProveedoresAnticipoComponent,
    FacturacionproveedorComponent,
    CompraDevolucionSolicitarComponent,
    CompraDevolucionSolicitudComponent,
    NotasCreditoProvAltaComponent,
    NotasCreditoProvListaComponent,
    NotasDebitoProvAltaComponent,
    NotasDebitoProvListaComponent,
    ConciliacionCFDIComponent,
    DesgloseRegistroCompraComponent,
    SeguimientoOrdenpagoRegistroCompraComponent,
    SeguimientoOrdenrecepcionRegistroCompraComponent,
    ProvVinculacionUsuarios,
    EgresosSolicitudesDeCancelacion,
    RegistroGeneralCompras,
    ComprasPorAutorizar,
    ComprasAutorizadas,
    RecepcionDeFacturas,
    ComprasProgramadas,
    NotasDeCreditoRegistradas,
    ComprasPagadas,
    NotasDeDebitoRegistradas,
    EgresosLogisticaDeCompras,
    LogisticaIniciarRutaComponent,
    LogisticaRegistraLlegadaFechaComponent,
    LogisticaAutorizaLlegadaComponent,
    CargaCfdisTraslado,
    LogisticaContinuarRutaComponent,
    LogisticaMonitorComponent,
    //CompraPeriodicaComponent,
    //ComprasDescuentosComponent,
    TextTruncatePipe
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
    TooltipModule,
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
    TextareaModule,
    ToastModule,
    DatePickerModule,
    ConfirmPopupModule,
    EgresosComprasReembolsosModule,
    ActivosFamRegistroModule,
    FloatLabelModule,
    CheckboxModule,
    DrawerModule,
    TimelineModule,
    AvatarModule,
    TreeModule,
    OrganizationChartModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    NavegadorPrincipalModule,
    EstablecimientosModule,
    A11yModule
],
  exports: [
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
export class EgresosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
