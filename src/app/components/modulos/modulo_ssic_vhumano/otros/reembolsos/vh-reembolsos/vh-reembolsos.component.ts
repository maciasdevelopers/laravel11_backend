import { Component, OnInit } from "@angular/core";
import { SSICReembolsosService } from "../../../../../../servicios/ssic/ssic_reembolsos.service";
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { interval } from 'rxjs';
import { Router } from '@angular/router';
import { ServNavSuperiorService } from "../../../../../../servicios/ssic/serv-nav-superior.service";
import { SentinelArkManager } from "../../../../../../servicios/sentinel-ark-manager";
import { global } from "../../../../../../servicios/global_ssic";
import { UsuariosService } from "../../../../../../servicios/serv_user.service";
import { SessionContextService } from "../../../../../../servicios/session-context";
declare var zxcvbn: any;

@Component({
  selector: 'app-vh-reembolsos',
  templateUrl: './vh-reembolsos.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../../styles/alertas.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    './vh-reembolsos.component.css',
    '../../../vhumano.css',
  ]
})
export class VHumReembolsosComponent implements OnInit {
  public identidad: any;
  searchReem: any;
  pageReem: number = 1;
  public reembolsos_general_bool: boolean = false;
  public reembolsos_pendientes_bool: boolean = false;
  public reembolsos_concluidos_bool: boolean = false;
  reembolsos_list_general: any = [];
  reembolsos_list_pendientes: any = [];
  reembolsos_list_concluidos: any = [];

  //permisos
  public vhum_privilegio_consulta: boolean = false;

  constructor(
    private navSupServ: ServNavSuperiorService,
    private sentinela: SentinelArkManager,
    private reem_serv: SSICReembolsosService,
    private translate: TranslateService,
    private routerr: Router,
    private sessionContext: SessionContextService,
    private userServ: UsuariosService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.cambia_permisos();
    this.reembolsos_lista_general();
    this.reembolsos_lista_pendientes();
    this.reembolsos_lista_concluidos();
    this.listenVHReem();
    this.navSupServ.acceso_vhum_reembolsos().subscribe(
      response => {
        if (response.status == 'success') {
          var token_superadmin = "ZnRNZzFSSUQ1OE1VM0hYNkxZTjEyQT09OjoxMjM0NTY3ODEyMzQ1Njc4";
          var token_admin_sos = "WXJpMDJObHVlL1pYSS81RCttUk5SUGx6UWl1NjEvVG1YSlR1Y1puYWk5RFk1T3d3VjFMRExZN3hOTlBxcGE0U3p1ZUM2UTRHVWp4UkFuR241aUxKbHdLU1JLZmFMeXpvK1p3WmZRemkyendCZGY1M0UwM0h2OGhyclRDMytMMnJRRENUUXB4RlRpOWpZeEVpYVR6Nis4b01VaXV0WHpVZ3JzWGg1Q3pGa3lzY0E1VGE2MzM2TjdGU1U0azMvMXFwTVM3YmJMM3p3QTdvYlAxQ3FjUDJVWlRyd09xYWJhUFBLRm1BdXpaVVpXc1Z0UUcxVWtJNDVVTjBjcE1Lb2hIRGpMT2NjYTlNMEtyUW01ZkQ2ckEyWWJTaThxNTZYQkFVTGJVakFVWDFPdVk9OjoxMjM0NTY3ODEyMzQ1Njc4";
          if (this.identidad['user_token'] == token_superadmin || this.identidad['user_token'] == token_admin_sos || response.acceso_reembolsos == true) {
            var porcentajeCarga = 0;
            var intervalo = setInterval(() => {
              porcentajeCarga = porcentajeCarga + 1;
              var porcentDiv = porcentajeCarga + '%';
              $(".h6loadingBlue").html('cargando... ' + porcentDiv);
              if (porcentajeCarga == 100) {
                clearInterval(intervalo);
                $("#iContent").removeClass("noneView");
                setTimeout(function () {
                  $("#loadingSeccion").fadeOut("slow");
                }, 3000);
              }
            }, 30);
          } else {
            global.url_denegado_name = "reembolsos (valor humano)";
            global.url_denegado_link = "sos_inside/valor_humano/reembolsos";
            global.home_link = "/sos_inside/home";
            this.routerr.navigate(['./plataformas/permission_denied']);
          }
        }
      },
      error => {
        console.log(error);
      }
    );

    const contadorReloj = interval(1000);
    contadorReloj.subscribe((n: any) => {
      if (localStorage.getItem('module_working') == "bEIxeFFKY2k4RnFEbWtnWDE5c1dKMGN5TFUwSW5EY0pTditvM3drV3FzTnFCZVhZN3A5aDREM3ZLRHF1YjFGUmNhY1pacDJDS3JsTm9RSXF6SkVTS2c9PTo6MTIzNDU2NzgxMjM0NTY3OA==") {
        this.cambia_permisos();
      }
    });
  }

  reembolsos_lista_general() {
    if (this.vhum_privilegio_consulta == true) {
      this.reembolsos_general_bool = false;
      this.reem_serv.list_reembolsos_vh().subscribe(
        response => {
          this.reembolsos_general_bool = true;
          if (response.status == 'success') {
            console.log(this.reembolsos_list_general);
            this.reembolsos_list_general = response.reem_lista_general;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  reembolsos_lista_pendientes() {
    if (this.vhum_privilegio_consulta == true) {
      this.reembolsos_pendientes_bool = false;
      this.reem_serv.list_reembolsos_vh().subscribe(
        response => {
          this.reembolsos_pendientes_bool = true;
          if (response.status == 'success') {
            //console.log(response);
            console.log(this.reembolsos_list_general);
            this.reembolsos_list_pendientes = response.reem_lista_pend;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  reembolsos_lista_concluidos() {
    if (this.vhum_privilegio_consulta == true) {
      this.reembolsos_concluidos_bool = false;
      this.reem_serv.list_reembolsos_vh().subscribe(
        response => {
          this.reembolsos_concluidos_bool = true;
          if (response.status == 'success') {
            this.reembolsos_list_concluidos = response.reem_lista_conc;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  listenVHReem() {
    //const messaging = getMessaging();
    //onMessage(messaging, (payload) => {});
  }

  private async cambia_permisos() {
    this.identidad = this.sentinela.getIdentifUsuario();
    const conf_valor_humano = this.sessionContext.empresa_data?.conf_valor_humano;
    if (this.vhum_privilegio_consulta != conf_valor_humano[0]["vhum_privilegio_consulta"]) {
      this.vhum_privilegio_consulta = this.identidad.vhum_privilegio_consulta;
      this.reembolsos_lista_general();
      this.reembolsos_lista_pendientes();
      this.reembolsos_lista_concluidos();
    }
  }

  solicitarPermisoConsulta() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userServ.user_solicitar_permiso_consulta(this.identidad.emp_token, this.identidad.user_token, "vhum").subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

}
