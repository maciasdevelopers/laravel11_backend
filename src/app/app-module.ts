import { APP_INITIALIZER, isDevMode, NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { AppRoutingModule,routing,routingDos, appRoutingProviders }
import { AppRoutingModule,routing,routingDos, appRoutingProviders } from './app-routing.module';
import { App } from './app';
import { providePrimeNG } from 'primeng/config';
// Módulos de PrimeNG que uses
import { FormsModule, ReactiveFormsModule } from '@angular/forms';   // <-- este es el bueno
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressBar } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import MyMaterialLight from './presset';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { environment } from '../environments/environment';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgOptimizedImage, registerLocaleData } from '@angular/common';
import { HttpClientModule,provideHttpClient, HttpClient, HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';

import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';

//interceptores
import { JwtInterceptorInterceptor } from './interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from './interceptores/load-interceptor.interceptor';

//servicios
import { ServLandCSSService } from './servicios/serv-land-css.service';
import { AssocGuardService } from './servicios/terceros/associates/auth-assoc.service';
import { ClientsGuardService } from "./servicios/terceros/clients/auth_clients.service";
import { SuppliersGuardService } from "./servicios/terceros/suppliers/auth_suppliers.service";
import { AuthGuardService } from './servicios/auth-guard.service';
import { DisAuthGuardService } from './servicios/disauth-guard.service';
import { NotificacionesService } from './servicios/notificaciones.service';

//componentes
import { RaizComponent } from './components/index_component/index_component.component';
import { NuestrasSolucionesComponent } from './components/landing_module/nuestras_soluciones/nuestras_soluciones.component';
import { RegistrateSsicComponent } from './components/landing_module/registrate_ssic/registrate_ssic.component';
import { PortalParaTercerosComponent } from './components/landing_module/portal_para_terceros/landing/portal_para_terceros.component';
import { PortalAsociadosComponent } from './components/landing_module/portal_para_terceros/asociados/portal_asociados.component';
import { HerramientasAyudaComponent } from './components/landing_module/herramientas_ayuda/herramientas_ayuda.component';
import { CalculadoraRetencionIsrIva } from './components/landing_module/herramientas_ayuda/calculadora-retencion-isr-iva/calculadora-retencion-isr-iva';
import { VisorDeCfdi } from './components/landing_module/herramientas_ayuda/visor-de-cfdi/visor-de-cfdi';
import { CalculadorasRelacionadasConTemasLaborales } from './components/landing_module/herramientas_ayuda/calculadoras-relacionadas-con-temas-laborales/calculadoras-relacionadas-con-temas-laborales';
import { CalculadorasActualizacionesYRecargos } from './components/landing_module/herramientas_ayuda/calculadoras-actualizaciones-y-recargos/calculadoras-actualizaciones-y-recargos';
import { CalculadorasCalculoEstimadoImpuestos } from './components/landing_module/herramientas_ayuda/calculadoras-calculo-estimado-impuestos/calculadoras-calculo-estimado-impuestos';
import { PermissionDeniedComponent } from './components/permission_denied/permission_denied.component';
import { ErrorComponent } from './components/error/error.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgSelectModule } from '@ng-select/ng-select';
import { PanelModule } from 'primeng/panel';
import { Toast } from 'primeng/toast';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { MessageService } from 'primeng/api';
import { LoginComponent } from './components/login-component/login-component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AuthInterceptor } from './interceptores/auth-interceptor';
import { DividerModule } from 'primeng/divider';
import { SessionContextService } from './servicios/session-context';
import { FooterModule } from './components/modulos/footerModule/footer.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

export function iniciaSesionFactory(sessionContext:SessionContextService){
  return () => sessionContext.recuperarSession();
}

@NgModule({
  declarations: [
    App,
    RaizComponent,
    NuestrasSolucionesComponent,
    RegistrateSsicComponent,
    PortalParaTercerosComponent,
    PortalAsociadosComponent,
    HerramientasAyudaComponent,
    CalculadoraRetencionIsrIva,
    VisorDeCfdi,
    CalculadorasRelacionadasConTemasLaborales,
    CalculadorasActualizacionesYRecargos,
    CalculadorasCalculoEstimadoImpuestos,
    PermissionDeniedComponent,
    ErrorComponent,
    ComingSoonComponent,
    LoginComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    CommonModule,
    TableModule,
    ProgressBar,
    ButtonModule,
    SliderModule,

    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    routing,
    routingDos,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgxMaterialIntlTelInputComponent,
    AccordionModule,
    CardModule,
    DialogModule,
    NgSelectModule,
    PanelModule,
    Toast,
    ConfirmPopupModule,
    DividerModule,
    BrowserModule,
    HttpClientModule,
    FooterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: iniciaSesionFactory,
      deps: [SessionContextService],
      multi: true
    },
    //providePrimeNG({
    //  theme: AuraLight
    //}),
    providePrimeNG({
      theme: {
        preset: MyMaterialLight
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),

    appRoutingProviders,
    provideHttpClient(withFetch()),
    ServLandCSSService,
    AssocGuardService,
    //AssocDisGuardService,
    ClientsGuardService,
    //ClientsDisGuardService,
    SuppliersGuardService,
    //SuppliersgDisGuardService,
    //EmploGuardService,
    //EmploDisGuardService,
    MessageService,
    AuthGuardService,
    DisAuthGuardService,
    NotificacionesService,
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
export class AppModule { }
