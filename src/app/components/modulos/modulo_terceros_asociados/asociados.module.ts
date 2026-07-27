import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FormsModule } from '@angular/forms';
import { routing, appRoutingProviders } from './asociados.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service'; 
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { LoaderModule } from '../loaderModule/loader.module';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { FooterModule } from '../footerModule/footer.module';
import { AltaVentasMostradorComponent } from './altaventamostrador/altaventamostrador.component';
import { CatalogoVentasMostradorComponent } from './catalogoventamostrador/catalogoventamostrador.component';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    CatalogoVentasMostradorComponent,
    AltaVentasMostradorComponent,
  ],
  imports: [
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
    NgxFileDropModule,
    NgOptimizedImage,
    BienvenidoModule,
    LoaderModule,
    NavegadorPrincipalModule,
    FooterModule,
    TabsModule,
    InputTextModule,
    TableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    //SocketIoModule.forRoot(configSocket)
  ],
  exports:[
    FormsModule,
    AltaVentasMostradorComponent,
    CatalogoVentasMostradorComponent
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
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true }
  ],
})
export class AsociadosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
