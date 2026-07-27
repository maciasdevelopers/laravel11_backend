import { Component, OnInit } from '@angular/core';
import { EmpresasServService } from '../../../../servicios/ssic/empresas-serv.service';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { SessionContextService } from '../../../../servicios/session-context';

@Component({
  selector: 'app-perfil-empresa',
  templateUrl: './perfil-empresa.component.html',
  standalone: false,
  styleUrls: [
    './perfil-empresa.component.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
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
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/explain.css',
    '../../../../styles/switches.css',
  ]
})
export class PerfilEmpresaComponent implements OnInit {
  public identidad: any;
  empresa_detail_info: any = [];

  constructor(
    public emp_serv: EmpresasServService,
    private sentinela: SentinelArkManager,
    private sessionContext: SessionContextService,
    private translate: TranslateService,
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.ver_empresa_data(this.sessionContext.empresa_data?.empresa_token);
  }

  ver_empresa_data(empresa_token: string) {
    this.emp_serv.empresaPerfilInfo(empresa_token).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.empresa_detail_info = response.empresaInfo;
        }
      }, error => { console.log(error); }
    );
  }

  habilitar_prov_para_trab_centros(empresa_token: any, event: any) {
    console.log(event.checked);
    if (event.checked == true) {
      this.emp_serv.habilitaRegistroTrabajoCentros(empresa_token).subscribe(
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
            this.ver_empresa_data(empresa_token);
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
          console.log(error);
        }
      )
    } else {
      this.emp_serv.deshabilitaRegistroTrabajoCentros(empresa_token).subscribe(
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
            this.ver_empresa_data(empresa_token);
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
          console.log(error);
        }
      )
    }
  }

}
