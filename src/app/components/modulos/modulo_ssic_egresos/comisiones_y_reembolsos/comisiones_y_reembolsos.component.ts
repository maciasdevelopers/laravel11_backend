import { Component, OnInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input} from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import '../../../../../assets/js/zxcvbn.js';
// To use Html5Qrcode (more info below)
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { SentinelArkManager } from "../../../../servicios/sentinel-ark-manager.js";
import { Usuarios } from "../../../../modelos/Usuarios.js";
import { ComunicacionInternaService } from "../../../../servicios/comunicacion-interna.service.js";
declare var zxcvbn:any;
//import { getMessaging, getToken, onMessage } from "firebase/messaging";
//const messaging = getMessaging();  
@Component({
  selector: 'app_comisiones_y_reembolsos',
  templateUrl: './comisiones_y_reembolsos.component.html',
  standalone:false,
  styleUrls: [
    './comisiones_y_reembolsos.component.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/totales.css',
    '../../../../styles/explain.css',
    '../egresos.css',
  ]
})
export class ComisionesYReembolsosComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  constructor(
    private translate:TranslateService,
    private relInterna: ComunicacionInternaService,
    private sentinela: SentinelArkManager
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
  }

  onMenuItemClick(opcion: string) {
    //$('#modalComprasProrrateos').modal('show');  mensajeComiReemSeccionModule
  }

  cambioDeSeccion(tabIndex: string | number){
    const index_tabla = tabIndex.toString();
    switch (index_tabla) {
      case '1': this.relInterna.mensajeComiReemSeccionModule('seccion_comi_reem_autorizados'); break;
      case '2': this.relInterna.mensajeComiReemSeccionModule('seccion_comi_lista_general'); break;
      case '3': this.relInterna.mensajeComiReemSeccionModule('seccion_comi_no_concluidas'); break;
      case '4': this.relInterna.mensajeComiReemSeccionModule('seccion_comi_concluidas'); break;
      case '5': this.relInterna.mensajeComiReemSeccionModule('seccion_comi_eliminadas'); break;
      case '6': this.relInterna.mensajeComiReemSeccionModule('seccion_comi_registro'); break;
      default:
        break;
    }
  }
}
