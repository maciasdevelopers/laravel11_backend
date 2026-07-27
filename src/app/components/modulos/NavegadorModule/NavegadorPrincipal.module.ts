import { CommonModule } from '@angular/common';
import { NgModule,LOCALE_ID } from '@angular/core';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgOptimizedImage } from '@angular/common';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//import { ServLandCSSService } from './serv-land-css.service';
import { LenguajesService } from '../../../servicios/lenguajes.service';
import { RouterModule } from '@angular/router';

import { style } from '@angular/animations';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { cajaAngularModelo } from '../../../modelos/cajaAngularModelo';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { TooltipModule } from 'ng2-tooltip-directive-ng13fix';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//const configSocket:SocketIoConfig = {url:'',options:{}};
import { NavegadorPrincipalComponent } from './navegador_principal/navegador_principal.component';
//import { TreeModule } from '@ali-hm/angular-tree-component';
import { App} from '../../../app';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenubarModule } from 'primeng/menubar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TreeSelectModule } from 'primeng/treeselect';

import { TabsModule } from 'primeng/tabs';
import { DrawerModule } from 'primeng/drawer';
import { TreeModule } from 'primeng/tree';
import { Toast } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { EgresosModule } from '../modulo_ssic_egresos/egresos.module';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

registerLocaleData(localeMX);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

@NgModule({
  declarations: [
    NavegadorPrincipalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    //TooltipModule,
    NgOptimizedImage,
    NgbPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    TreeModule,
    DrawerModule,
    RouterModule,
    MegaMenuModule,
    PanelMenuModule,
    MenubarModule,
    BadgeModule,
    MatToolbarModule,
    MatMenuModule,
    TreeSelectModule,
    OverlayBadgeModule,
    TabsModule,
    Toast,
    DialogModule,
    ImageModule,
    AvatarModule,
    DividerModule,
    ConfirmDialogModule,
    //SocketIoModule.forRoot(configSocket)
  ],
  providers:[
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    providePrimeNG({
        theme: {
            preset: Aura
        }
    })
  ],
  exports:[
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    NavegadorPrincipalComponent,
  ],

  bootstrap: [App]
})
export class NavegadorPrincipalModule { }
//export function HttpLoaderFactory(http: HttpClient) {
//return new TranslateHttpLoader(http);
//}
