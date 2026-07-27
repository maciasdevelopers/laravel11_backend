import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './finanzas.routing';
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
import { DashboardModule } from '../dashboard.module';

import { PuntoVentaAltaComponent } from './catalogos/punto_de_venta/alta/puntoventassocalta.component';
import { PuntoVentaListaComponent } from './catalogos/punto_de_venta/lista/puntoventassoclista.component';

import { ListaCuentasTesoreriaComponent } from './catalogos/cuentas/lista/tes_listacuentas.component';
import { AltaCuentasTesoreriaComponent } from './catalogos/cuentas/alta/tes_altacuentas.component';
import { ListaCajasTesoreriaComponent } from './catalogos/cajas/lista/tes_listacajas.component';
import { AltaCajasTesoreriaComponent } from './catalogos/cajas/alta/tes_altacajas.component';
import { ListaMonederoTesoreriaComponent } from './catalogos/monederos/lista/tes_listamon.component';
import { AltaMonederoTesoreriaComponent } from './catalogos/monederos/alta/tes_altamon.component';
import { ListaDevicesTesoreriaComponent } from './catalogos/dispositivos/lista/tes_listadevices.component';
import { AltaDevicesTesoreriaComponent } from './catalogos/dispositivos/alta/tes_altadevices.component';

import { ControlMovBancComponent } from './registro_de_movimientos_financieros/control-mov-banc/control-mov-banc.component';
import { ControlMovEfectComponent } from './registro_de_movimientos_financieros/control-mov-efect/control-mov-efect.component';
//ordenes de cobro
import { ListaOrdenesCobroComponent } from './ordenes-cobro/lista-ordenes-cobro.component';
//ordenes de pago
import { ListaOrdenesPagoComponent } from './ordenes-pago/lista-ordenes-pago.component';
//import { OrdenPagoProvDetTesComponent } from "./ordenes-pago/detalle-orden-pago-prov/orden-pago-prov-tes-det.component";
//import { OrdenPagoClientDetTesComponent } from "./ordenes-pago/detalle-orden-pago-cliente/orden-pago-client-tes-det.component";
//import { OrdenPagoJustDetTesComponent } from "./ordenes-pago/detalle-orden-pago-just/orden-pago-just-tes-det.component";
//import { OrdenPagoReemDetTesComponent } from "./ordenes-pago/detalle-orden-pago-reem/orden-pago-reem-tes-det.component";

import { InfoBancariaComponent } from './registro_de_movimientos_financieros/info-bancaria/info-bancaria.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
import { TreeModule } from '@ali-hm/angular-tree-component';
import { IndicadoresEconomicosComponent } from './catalogos/indicadores-economicos/indicadores-economicos.component';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
//const configSocket:SocketIoConfig = {url:'',options:{}};
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { MovimientosCuentasPropiasComponent } from './registro_de_movimientos_financieros/movimientos-cuentas-propias/movimientos-cuentas-propias.component';
import { EstadoMovimientosFinancierosComponent } from './reportes/estado-movim-financieros/estado-movimientos-financieros.component';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChartModule } from 'primeng/chart';
import { AcreedoresListaComponent } from './catalogos/acreedores/acreedores-lista/acreedores-lista.component';
import { AcreedoresRegistroComponent } from './catalogos/acreedores/acreedores-registro/acreedores-registro.component';
import { DeudoresListaComponent } from './catalogos/deudores/deudores-lista/deudores-lista.component';
import { DeudoresRegistroComponent } from './catalogos/deudores/deudores-registro/deudores-registro.component';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { OpAnticiposComponent } from './ordenes-pago/op-anticipos/op-anticipos.component';
import { OpAcreedoresComponent } from './ordenes-pago/op-acreedores/op-acreedores.component';
import { OpDeudoresComponent } from './ordenes-pago/op-deudores/op-deudores.component';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OpLiberadas } from './ordenes-pago/op-liberadas/op-liberadas';
import { FederacionEstadosMunicipios } from './catalogos/federacion-estados-municipios/federacion-estados-municipios';
import { OpCatalogoGeneral } from './ordenes-pago/op-catalogo-general/op-catalogo-general';
import { OpCatalogoPendientes } from './ordenes-pago/op-catalogo-pendientes/op-catalogo-pendientes';
import { OpCatalogoConcluidas } from './ordenes-pago/op-catalogo-concluidas/op-catalogo-concluidas';
import { OpPagosCatalogoGeneral } from './ordenes-pago/op-pagos-catalogo-general/op-pagos-catalogo-general';
import { FinanzasSolicitudesDeCancelacion } from './finanzas-solicitudes-cancelacion/cancelacion_lista_solicitudes/cancelacion_lista_solicitudes';
import { OpGraficaGeneral } from './ordenes-pago/op-grafica-general/op-grafica-general';
import { OpDetalleFacturaInformative } from './ordenes-pago/op-detalle-factura-informative/op-detalle-factura-informative';
import { EstadoMovimientosFinancierosCajasComponent } from './reportes/estado-movim-financieros/est-movim-financ-cajas/est-movim-financ-cajas-component';
import { EstadoMovimientosFinancierosCuentasBankComponent } from './reportes/estado-movim-financieros/est-movim-financ-cuenta-bank/est-movim-financ-cuenta-bank-component';
import { EstadoMovimientosFinancierosMonedElectComponent } from './reportes/estado-movim-financieros/est-movim-financ-moned-elect/est-movim-financ-moned-elect-component';
import { EstadoMovimientosFinancierosClienteComponent } from './reportes/estado-movim-financieros/est-movim-financ-cliente/est-movim-financ-cliente-component';
import { EstadoMovimientosFinancierosDeudorComponent } from './reportes/estado-movim-financieros/est-movim-financ-deudor/est-movim-financ-deudor-component';
import { EstadoMovimientosFinancierosProveedorComponent } from './reportes/estado-movim-financieros/est-movim-financ-proveedor/est-movim-financ-proveedor-component';
import { EstadoMovimientosFinancierosAcreeComponent } from './reportes/estado-movim-financieros/est-movim-financ-acree/est-movim-financ-acree-component';
import { DispersionNominasComponent } from './dispersion-nominas/dispersion-nominas';
import { DispersionNominasGeneral } from './dispersion-nominas/dispersion-nominas-general/dispersion-nominas-general';
import { DispersionNominasPendientes } from './dispersion-nominas/dispersion-nominas-pendientes/dispersion-nominas-pendientes';
import { DispersionNominasLiberadas } from './dispersion-nominas/dispersion-nominas-liberadas/dispersion-nominas-liberadas';
import { DispersionNominasConcluidas } from './dispersion-nominas/dispersion-nominas-concluidas/dispersion-nominas-concluidas';
import { DispersionNominasPagos } from './dispersion-nominas/dispersion-nominas-pagos/dispersion-nominas-pagos';
import { DispersionNominasTrabajadores } from './dispersion-nominas/dispersion-nominas-trabajadores/dispersion-nominas-trabajadores';
import { PagoNominaEfectivoComponent } from './procesos_pagar/pago-nomina-efectivo-component/pago-nomina-efectivo-component';
import { PagoNominaEspecieComponent } from './procesos_pagar/pago-nomina-especie-component/pago-nomina-especie-component';
import { PagoOrdenGeneralComponent } from './procesos_pagar/pago-orden-general-component/pago-orden-general-component';
import { SoliCancelacionPago } from './finanzas-solicitudes-cancelacion/soli-cancelacion-pago/soli-cancelacion-pago';
import { SoliCancelacionOrdenDePago } from './finanzas-solicitudes-cancelacion/soli-cancelacion-orden-de-pago/soli-cancelacion-orden-de-pago';
import { SoliCancelacionReembolsos } from './finanzas-solicitudes-cancelacion/soli-cancelacion-reembolsos/soli-cancelacion-reembolsos';
import { SoliCancelacionMovCpropias } from './finanzas-solicitudes-cancelacion/soli-cancelacion-mov-cpropias/soli-cancelacion-mov-cpropias';
import { SoliCancelacionGralNomina } from './finanzas-solicitudes-cancelacion/soli-cancelacion-gral-nomina/soli-cancelacion-gral-nomina';
import { SoliCancelacionNominaEfectivo } from './finanzas-solicitudes-cancelacion/soli-cancelacion-nomina-efectivo/soli-cancelacion-nomina-efectivo';
import { SoliCancelacionNominaEspecie } from './finanzas-solicitudes-cancelacion/soli-cancelacion-nomina-especie/soli-cancelacion-nomina-especie';
import { SoliCancelacionAnticipos } from './finanzas-solicitudes-cancelacion/soli-cancelacion-anticipos/soli-cancelacion-anticipos';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    PuntoVentaAltaComponent,
    PuntoVentaListaComponent,
    ListaCuentasTesoreriaComponent,
    AltaCuentasTesoreriaComponent,
    ListaCajasTesoreriaComponent,
    AltaCajasTesoreriaComponent,
    ListaMonederoTesoreriaComponent,
    AltaMonederoTesoreriaComponent,
    ListaDevicesTesoreriaComponent,
    AltaDevicesTesoreriaComponent,

    ControlMovBancComponent,
    ControlMovEfectComponent,
    //ordenes de cobros
    ListaOrdenesCobroComponent,
    //ordenes de pagos
    ListaOrdenesPagoComponent,

    //OrdenPagoProvDetTesComponent,
    //OrdenPagoClientDetTesComponent,
		//OrdenPagoJustDetTesComponent,
		//OrdenPagoReemDetTesComponent,

    InfoBancariaComponent,
    IndicadoresEconomicosComponent,
    MovimientosCuentasPropiasComponent,
    EstadoMovimientosFinancierosComponent,
    AcreedoresListaComponent,
    AcreedoresRegistroComponent,
    DeudoresListaComponent,
    DeudoresRegistroComponent,
    OpAnticiposComponent,
    OpAcreedoresComponent,
    OpDeudoresComponent,
    OpLiberadas,
    DispersionNominasComponent,
    FederacionEstadosMunicipios,
    OpCatalogoGeneral,
    OpCatalogoPendientes,
    OpCatalogoConcluidas,
    OpPagosCatalogoGeneral,
    FinanzasSolicitudesDeCancelacion,
    OpGraficaGeneral,
    OpDetalleFacturaInformative,
    EstadoMovimientosFinancierosCajasComponent,
    EstadoMovimientosFinancierosCuentasBankComponent,
    EstadoMovimientosFinancierosMonedElectComponent,
    EstadoMovimientosFinancierosClienteComponent,
    EstadoMovimientosFinancierosDeudorComponent,
    EstadoMovimientosFinancierosProveedorComponent,
    EstadoMovimientosFinancierosAcreeComponent,
    DispersionNominasGeneral,
    DispersionNominasPendientes,
    DispersionNominasLiberadas,
    DispersionNominasConcluidas,
    DispersionNominasPagos,
    DispersionNominasTrabajadores,
    PagoNominaEfectivoComponent,
    PagoNominaEspecieComponent,
    PagoOrdenGeneralComponent,
    SoliCancelacionPago,
    SoliCancelacionOrdenDePago,
    SoliCancelacionReembolsos,
    SoliCancelacionMovCpropias,
    SoliCancelacionGralNomina,
    SoliCancelacionNominaEfectivo,
    SoliCancelacionNominaEspecie,
    SoliCancelacionAnticipos,
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
    //TooltipModule,
    //NgxSearchFilterModule,
    BienvenidoModule,
    LoaderModule, 
    DashboardModule,
    NavegadorPrincipalModule,
    FooterModule,
    TreeModule,
    TabsModule,
    TableModule,
    InputTextModule,
    AccordionModule,
    PanelModule,
    SelectModule,
    MultiSelectModule,
    DividerModule,
    ListboxModule,
    DatePickerModule,
    //RouterModule.forChild(routing),
    NgxFileDropModule,
    ReactiveFormsModule,
    DialogModule,
    ChartModule,
    IconFieldModule,
    InputIconModule,
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
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FinanzasModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
