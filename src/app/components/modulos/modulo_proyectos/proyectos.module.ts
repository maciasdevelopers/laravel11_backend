import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';
//import { NgxSearchFilterModule } from 'ngx-search-filter';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbCollapseModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';//import { NgxPaginationModule } from 'ngx-pagination';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorModule } from 'primeng/paginator';

import { NgxFileDropModule } from 'ngx-file-drop';
import { FormsModule } from '@angular/forms';
import { NgxGanttModule } from '@worktile/gantt';

//interceptors
import { JwtInterceptorInterceptor } from '../../../interceptores/jwt-interceptor.interceptor';
import { LoadInterceptorInterceptor } from '../../../interceptores/load-interceptor.interceptor';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';

//servicios
import { routing, appRoutingProviders } from './proyectos.routing';
import { AuthGuardService } from '../../../servicios/auth-guard.service';
import { DisAuthGuardService } from '../../../servicios/disauth-guard.service';
import { TreeModule } from '@ali-hm/angular-tree-component';

//componentes
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { GanttModule } from '@syncfusion/ej2-angular-gantt'
//https://ej2.syncfusion.com/angular/documentation/gantt/getting-started
import { NuevaPlantillaComponent } from './plantillas/nueva-plantilla/nueva-plantilla.component';
import { ListaPlantillasComponent } from './plantillas/lista-plantillas/lista-plantillas.component';
import { NuevoProyectoComponent } from './proyectos/nuevo-proyecto/nuevo-proyecto.component';
import { CatalogoProyectosComponent } from './proyectos/proyectos_list/proyectos_list.component';
import { CalendarProyectosComponent } from './calendar-proyectos/calendar-proyectos.component';
import { GanttProyectosComponent } from './gantt-proyectos/gantt-proyectos.component';
import { NavegadorPrincipalModule } from '../NavegadorModule/NavegadorPrincipal.module';
import { PaginacionModule } from '../paginacionModule/paginacion/paginacion.module';
import { BienvenidoModule } from '../bienvenidoModule/bienvenido.module';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

//const configSocket:SocketIoConfig = {url:'',options:{}};

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    NuevaPlantillaComponent,
    ListaPlantillasComponent,
    NuevoProyectoComponent,
    CatalogoProyectosComponent,
    CalendarProyectosComponent,
    GanttProyectosComponent
  ],
  imports: [
    CommonModule,
    routing,
    FormsModule,
    NgbPaginationModule,
    MatListModule,
    MatPaginatorModule,
    PaginatorModule,
    NgxCaptureModule,
    //NgxSearchFilterModule,
    NgxFileDropModule,
    FullCalendarModule,
    NgxGanttModule,
    TreeModule,
    NgbCollapseModule,
    NavegadorPrincipalModule,
    BienvenidoModule,
    PaginacionModule,
    NgbModule,
    TooltipModule,
    InputTextModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports:[
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
    provideHttpClient(),
    AuthGuardService,
    DisAuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true },

    /*{
      provide:LOCALE_ID,
      deps:[LenguajesService],
      useFactory:(lenguajesService:any) => lenguajesService.getLenguaje()
    },*/
  ]
})
export class ProyectosModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
