import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './tecinfo.routing';
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

import { TECIAltaDeviceComponent } from './catalogos/dispositivos_de_medicion/alta/teci_altadevices.component';
import { TECIListaDeviceComponent } from './catalogos/dispositivos_de_medicion/lista/teci_listadevices.component';
import { ContAltaDigitalPlataformComponent } from './catalogos/plataformas_digitales/alta/cont_alta_digital_plataform.component';
import { ContListaDigitalPlataformComponent } from './catalogos/plataformas_digitales/lista/cont_lista_digital_plataform.component';

import { AppsComplementariasComponent } from './apps_complementarias/apps_complementarias.component';
import { SoporteComponent } from './soporte/menu_soporte/soporte.component';
import { ComunicacionLista } from './comunicacion/comunicacion-lista/comunicacion-lista';
import { ComunicacionRegistro } from './comunicacion/comunicacion-registro/comunicacion-registro';
import { PublicacionesListaComponent } from './publicaciones/publicaciones_lista/publicaciones_lista.component';
import { PublicacionesRegistroComponent } from './publicaciones/publicaciones_registro/publicaciones_registro.component';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbAccordionModule, NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';

import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { LoaderModule } from '../loaderModule/loader.module';
import { SoporteRegistrosParaAutorizarComponent } from './soporte/registros_para_autorizar/registros_para_autorizar.component';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { TeciEmpresasCatalogosComponent } from './empresas/empresas_catalogos/empresas_catalogos.component';
import { TeciPerfilesUsuariosComponent } from './teci-perfiles-usuarios/teci-perfiles-usuarios.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { EmpresasRegistro } from './empresas/empresas-registro/empresas-registro';
import { AdminGuardService } from '../../../servicios/admin-guard.service';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    TECIAltaDeviceComponent,
    TECIListaDeviceComponent,
    ContAltaDigitalPlataformComponent,
    ContListaDigitalPlataformComponent,

    AppsComplementariasComponent,
    SoporteComponent,
    ComunicacionLista,
    ComunicacionRegistro,
    PublicacionesListaComponent,
    PublicacionesRegistroComponent,
    SoporteRegistrosParaAutorizarComponent,
    TeciEmpresasCatalogosComponent,
    TeciPerfilesUsuariosComponent,
    EmpresasRegistro,
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    routing,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    MatListModule,
    MatPaginatorModule,
    PaginatorModule,
    NgxCaptureModule,
    //NgxSearchFilterModule,
    NgbAccordionModule,
    NgbCollapseModule,
    //RouterModule.forChild(routing),
    BienvenidoModule,
    LoaderModule,
    DashboardModule,
    NavegadorPrincipalModule,
    FooterModule,
    NgbModule,
    NgOptimizedImage,
    AccordionModule,
    TabsModule,
    DividerModule,
    TableModule,
    //TooltipModule,
    MultiSelectModule,
    SelectModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Toast,
    ConfirmPopupModule,
    ButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
    //SocketIoModule.forRoot(configSocket)
  ],
  exports: [
    FormsModule,
    NgbAccordionModule,
  ],
  providers: [
    appRoutingProviders,
    AuthGuardService,
    DisAuthGuardService,
    AdminGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true },

    /*{
      provide:LOCALE_ID,
      deps:[LenguajesService],
      useFactory:(lenguajesService:any) => lenguajesService.getLenguaje()
    },*/
  ],
})
export class TecinfoModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
