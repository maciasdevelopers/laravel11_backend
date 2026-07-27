import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { SsicComisionesService } from '../../../../servicios/ssic/ssic-comisiones.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { SessionContextService } from '../../../../servicios/session-context';
@Component({
  selector: 'app_compras_egr_comi_lista_deleted',
  templateUrl: './compras_comisiones_lista_deleted.component.html',
  standalone: false,
  styleUrls: [
    '../../../../styles/datatable.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/landing.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/switches.css',
    '../../../../styles/colores.css',
    '../../../../styles/explain.css',
    '../../../../styles/dirpostales.css',
    '../../modulo_ssic_egresos/egresos.css',
    './compras_comisiones_lista_deleted.component.css'
  ]
})
export class EgresosComisionesListasDeletedComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  optionTool = {
    "placement": "top",
    //"showDelay":"500"
  };

  //lista
  public comi_disabled_search: any = [];
  array_comisiones_deshabilitadas: any = [];

  //detalle
  arrayComisionDetalle: any = [];
  public folio_comision: string = "";
  public comi_viewModal: boolean = false;

  constructor(
    private sentinela: SentinelArkManager,
    private comi_serv: SsicComisionesService,
    private translate: TranslateService,
    private sessionContext: SessionContextService,
    private relInterna: ComunicacionInternaService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
  }

  ngOnInit(): void {
    this.getRespuestaComisionDeshabilitada();
    this.getRespuestaComiReemSeccionModule();
    this.comi_disabled_search = [
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
      'ubicacion_colonia',
      'ubicacion_municipio',
      'ubicacion_codigo_postal',
      'ubicacion_estado',
      'concluida_fecha',
      'fecha_delete_comission'
    ];
  }

  getRespuestaComiReemSeccionModule() {
    this.relInterna.mensajeComiReemSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_comi_eliminadas") {
          console.log(mensaje);
          if (this.array_comisiones_deshabilitadas.length === 0) this.lista_comisiones_deshabilitadas();
        }
      }
    );
  }

  get permiso_editar() {
    return this.sessionContext.privilegio_editar;
  }

  get permiso_consulta() {
    return this.sessionContext.privilegio_consulta;
  }

  getRespuestaComisionDeshabilitada() {
    this.relInterna.mensajeEgresosComisionDeshabilitada$.subscribe(
      (mensaje: any) => {
        if (mensaje == "comision_deshabilitada") {
          this.lista_comisiones_deshabilitadas();
        }
      }
    );
  }

  lista_comisiones_deshabilitadas() {
    this.comi_serv.comision_deshabilitadas().subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.array_comisiones_deshabilitadas = response.comi_listado;
          console.log(this.array_comisiones_deshabilitadas);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ver_desglose_comision(token_comision_main: any) {
    this.comi_serv.comision_detalle_get_data(token_comision_main).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.comi_viewModal = true;
          this.arrayComisionDetalle = response.comi_contenido;
          console.log(this.arrayComisionDetalle);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  rehabilitarComission(token_comision: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.comi_serv.comision_rehabilitar(token_comision).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.relInterna.mensajeEgresosComisionLGeneral("comision_lista_general");
              this.relInterna.mensajeEgresosComisionNoConcluida("comision_no_concluida");
              this.relInterna.mensajeEgresosComisionConcluida("comision_concluida");
              this.lista_comisiones_deshabilitadas();
            }
            if (response.status == 'error') {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        )
      }
    });
  }
}
