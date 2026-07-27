import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { SsicComisionesService } from '../../../../../../servicios/ssic/ssic-comisiones.service';
import { EmpresasServService } from '../../../../../../servicios/ssic/empresas-serv.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../../../../assets/js/zxcvbn.js';
// To use Html5Qrcode (more info below)
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones_monitoreo.component.html',
  //styleUrls: ['./comisiones.component.css']
  standalone: false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/dropdown.css',
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
    './comisiones_monitoreo.component.css'
  ]
})
export class GerenciaComisionesMonitoreoComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  searchComi: any = [];

  optionTool = {
    "placement": "top",
    //"showDelay":"500"
  };

  //lista
  optionsTree = { allowDrag: true };

  public view_monitor_comi: boolean = false;
  registroSelectedArbol: string = "";
  registroSelectedPagos: string = "";
  list_comisiones_monitor: any = [];

  public comi_nconc_view: boolean = false;
  array_comisiones_no_concluidas: any = [];

  public comi_cconc_view: boolean = false;
  array_comisiones_concluidas: any = [];

  public comi_disabled_view: boolean = false;
  array_comisiones_deshabilitadas: any = [];

  public comi_view_ubica_latitud: string = "";
  public comi_view_ubica_longitud: string = "";
  public comi_view_ubica_display_name: string = "";

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
    this.comisiones_monitor_general();
    this.searchComi = [
      'token_comision_main',
      'folio_comision',
      'comision_proyecto',
      'usuario_comision',
      'especificaciones',
      'fecha_programada',
      'duracion',
      'recibe_dinero',
      'dinero_recibido',
      'comision_moneda_name',
      'comi_tiempo_respuesta',
      'valor_humano',
      'egresos',
      'ubicacion_display_name',
      'reem_folio',
      'reem_date_reg',
      'reem_emisorPers',
      'reem_emisorEmp',
      'nombreRecPersVH',
      'soli_reem_auth_vhm',
      'soli_reem_list',
      'name_receptor',
      'btnp_horas_auth_vh_color',
      'btnp_horas_auth_vh_icon',
      'fecha_respuesta_auth_vh',
      'time_respuesta_auth_vh',
      'nombreRecPersEGR',
      'reem_soli_auth_egr_style',
      'soli_reem_auth_egr',
      'name_receptor',
      'btnp_horas_auth_egr_color',
      'btnp_horas_auth_egr_icon',
      'fecha_respuesta_auth_egr',
      'time_respuesta_auth_egr',
      'reem_importe',
      'importe_autorizado_inicial_format',
      'orden_moneda_inicial_autorizada_name',
      'reem_tipo_cambio',
      'reem_importe_convert',
      'importe_autorizado_final',
      'orden_moneda_final_autorizada_name',
      'ordp_folio',
      'ordp_fecha_reg',
      'fecha_respuesta_pago_tentativa',
      'time_respuesta_pago_tentativa',
      'respuesta_pago_done_fecha',
      'time_respuesta_pago_tent_color',
      'time_respuesta_pago_tent_icon',
      'fecha_respuesta_pago_ord_auth',
      'respuesta_pago_done_color',
      'respuesta_pago_done_icon'
    ];
  }

  cerrarModal(modal: any) { $(modal).removeClass("open"); }
  //lista

  comisiones_monitor_general() {
    this.view_monitor_comi = false;
    this.comi_serv.comisiones_monitoreo().subscribe(
      response => {
        this.view_monitor_comi = true;
        if (response.status == 'success') {
          this.list_comisiones_monitor = response.comi_listado;

          for (let a = 0; a < this.list_comisiones_monitor.length; a++) {
            const mon = this.list_comisiones_monitor[a];
            for (let b = 0; b < mon.arbol_nivel_dos.length; b++) {
              const dos = mon.arbol_nivel_dos[b];
              for (let c = 0; c < dos.children.length; c++) {
                const child = dos.children[c];
                this.translate.get(['pay_to', 'provs', 'f_pago', 'yes', 'observ', 'ssic_menu_egr', 'not_auth', 'yes_auth', 'ssic_menu_vhn']).subscribe(translations => {
                  let label_prov = child.folio_solicitud + " " + translations['pay_to'] + " " + translations['provs'] + " " + child.rfc_prov + " " + child.proveedor + ", " + translations['f_pago'] + ": " + child.fpago_clave + " " + child.fpago_forma;
                  let label_no_prov = child.folio_solicitud + ", " + translations['f_pago'] + ": " + child.fpago_clave + " " + child.fpago_forma;
                  child.label = child.pagado_a == 'prov' ? label_prov : label_no_prov;

                  if (child.nivel_dos_vhum.length > 0) {
                    for (let v = 0; v < child.children.length; v++) {
                      const vh_son = child.children[v];
                      let label_vh_no_A = translations['not_auth'] + ": " + translations['observ'] + ": " + vh_son.comments_auth_vh;
                      let label_vh_A = translations['yes_auth'] + ": " + vh_son.fecha_registro_auth_vh + " " + translations['observ'] + ": " + vh_son.comments_auth_vh;
                      vh_son.label = translations['ssic_menu_vhn'] + ": " + (vh_son.autorizacion_vh != 'A' ? label_vh_no_A : label_vh_A);

                      if (vh_son.children.length > 0) {
                        for (let e = 0; e < vh_son.children.length; e++) {
                          const egr_son = vh_son.children[e];
                          let label_egr_no_A = translations['not_auth'] + ": " + translations['observ'] + ": " + egr_son.comments_auth_egr;
                          let label_egr_A = translations['yes_auth'] + ": " + egr_son.fecha_registro_auth_egr + " " + translations['observ'] + ": " + egr_son.comments_auth_egr;
                          egr_son.label = translations['ssic_menu_egr'] + ": " + (egr_son.autorizacion_egr != 'A' ? label_egr_no_A : label_egr_A);
                        }
                      }
                    }
                  } else {
                    for (let v = 0; v < child.children.length; v++) {
                      const egr_son = child.children[v];
                      let label_egr_no_A = translations['not_auth'] + ": " + translations['observ'] + ": " + egr_son.comments_auth_egr;
                      let label_egr_A = translations['yes_auth'] + ": " + egr_son.fecha_registro_auth_egr + " " + translations['observ'] + ": " + egr_son.comments_auth_egr;
                      egr_son.label = translations['ssic_menu_egr'] + ": " + (egr_son.autorizacion_egr != 'A' ? label_egr_no_A : label_egr_A);
                    }
                  }
                });
              }
            }
          }
          console.log(this.list_comisiones_monitor);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verArbol(data: any) {
    this.registroSelectedArbol = this.registroSelectedArbol === data ? null : data;
  }

  verPagos(data: any) {
    this.registroSelectedPagos = this.registroSelectedPagos === data ? null : data;
  }

  insideComission() { }

  inside_comportamiento(nodo: any) {
    if ($(nodo).hasClass("noneView")) {
      $(nodo).removeClass("noneView");
    } else {
      $(nodo).addClass("noneView");
    }
  }

  viewDocumentoLink(url: any) {
    window.open(url, '_blank');
  }
}
