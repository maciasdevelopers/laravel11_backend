import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { SsicComisionesService } from '../../../../../../servicios/ssic/ssic-comisiones.service';
import { EmpresasServService } from '../../../../../../servicios/ssic/empresas-serv.service';
import { TranslateService } from '@ngx-translate/core';
declare var zxcvbn: any;
import '../../../../../../../assets/js/zxcvbn.js';
// To use Html5Qrcode (more info below)
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones_reapertura.component.html',
  //styleUrls: ['./comisiones.component.css']
  standalone: false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/file_input.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/landing.css',
    '../../../gerencia.css',
    './comisiones_reapertura.component.css'
  ]
})
export class GerenciaComisionesReaperturaComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  optionTool = {
    "placement": "top",
    //"showDelay":"500"
  };

  public comi_all_view: boolean = false;
  list_comi_soliaper: any = [];

  constructor(
    private sentinela: SentinelArkManager,
    public empServ: EmpresasServService,
    public comi_serv: SsicComisionesService,
    private translate: TranslateService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
  }

  ngOnInit(): void {
    this.lista_comisiones_general();
  }

  lista_comisiones_general() {
    this.comi_all_view = false;
    this.comi_serv.comisiones_solicitud_apertura().subscribe(
      response => {
        this.comi_all_view = true;
        if (response.status == 'success') {
          this.list_comi_soliaper = response.comi_listado;
          console.log(this.list_comi_soliaper);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
