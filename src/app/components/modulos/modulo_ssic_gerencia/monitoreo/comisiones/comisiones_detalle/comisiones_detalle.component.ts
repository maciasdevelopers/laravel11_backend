import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SsicComisionesService } from '../../../../../../servicios/ssic/ssic-comisiones.service';

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones_detalle.component.html',
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
    './comisiones_detalle.component.css'
  ]
})
export class GerenciaComisionesDetalleComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  public tokenComision: any = "";
  arrayComisionDetalle: any = [];
  public folio_comision: string = "";
  options = {};
  constructor(
    private sentinela: SentinelArkManager,
    private comi_serv: SsicComisionesService,
    private translate: TranslateService,
    private act_rute: ActivatedRoute
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
  }

  ngOnInit(): void {
    this.tokenComision = this.act_rute.snapshot.paramMap.get("tknComision");
    var porcentajeCarga = 0;
    var intervalo = setInterval(() => {
      porcentajeCarga = porcentajeCarga + 1;
      var porcentDiv = porcentajeCarga + '%';
      $(".h6loadingSeccion").html('cargando... ' + porcentDiv);
      if (porcentajeCarga == 100) {
        clearInterval(intervalo);
        $("#vContent").removeClass("noneView");
        setTimeout(function () {
          $("#loadingSeccion").fadeOut("slow");
        }, 3000);
      }
    }, 30);

    this.comision_detalle();
    console.log(this.identidad.emp_token);
    this.listen();
  }

  go_back() {
    window.history.back();
  }

  listen() {
    //const messaging = getMessaging();
    //onMessage(messaging, (payload) => {
    //  this.comision_detalle();
    //});
  }

  comision_detalle() {
    this.comi_serv.comision_detalle_get_data(this.tokenComision).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.arrayComisionDetalle = response.comi_contenido;
          this.folio_comision = this.arrayComisionDetalle[0]["folio_comision"];

          for (let a = 0; a < this.arrayComisionDetalle.length; a++) {
            const row = this.arrayComisionDetalle[a];
          }

          console.log(this.arrayComisionDetalle);
          //this.comi_proyecto = row["comision_proyecto"];
          //this.comi_empleado_token = row["usuario_comision_tkn"];
          //this.comi_empleado_nombre = row["usuario_comision_name"];
          //this.comi_especificaciones = row["especificaciones"];
          //this.comi_fecha_salida = row["fecha_programada_html"];
          //this.comi_time_duracion = row["duracion"];
          //this.comi_recibe_dinero = row["recibe_dinero"];
          //this.comi_dinero_recibido = row["dinero_recibido_simple"];
          //this.comi_moneda_tkn = row["comision_moneda_tkn"];
          //this.comi_moneda_name = row["comision_moneda_name"];
          //this.comi_califica_vhum = row["valor_humano"];
          //this.comi_ubicacion_direccion = row[""];
          //this.comi_ubicacion_latitud = row["ubicacion_latitud"];
          //this.comi_ubicacion_longitud = row["ubicacion_longitud"];
          //this.comi_ubicacion_display_name = row["ubicacion_display_name"];
          //public comi_validate_to_update:boolean = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cerrarModal(modal: any) { $(modal).removeClass("open"); }

}
