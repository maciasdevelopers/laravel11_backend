import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmpresasServService } from '../../../../../servicios/ssic/empresas-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { UsuariosService } from '../../../../../servicios/serv_user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app_teci_perfiles_empresas',
  standalone: false,

  templateUrl: './empresas_catalogos.component.html',
  styleUrls: [
    '../../../../../styles/explain.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../tec_info.css',
    './empresas_catalogos.component.css',
  ],
  providers: [ConfirmationService]
})
export class TeciEmpresasCatalogosComponent implements OnInit {
  public popUpAccept: string = "";
  public popUpReject: string = "";
  public emp_tics_ver_registro: boolean = false;
  catalogo_general_empresas: any = [];
  catalogo_empresas_eliminadas: any = [];

  public ver_empresa_info: boolean = false;
  empresa_detail_info: any = [];
  public empresa_detail_folio: string = "";

  constructor(
    public emp_serv: EmpresasServService,
    private users: UsuariosService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.lista_general_empresas();
    this.lista_deleted_empresas();
  }

  verRegistroEmpresa() {
    this.emp_tics_ver_registro = true;
  }

  lista_general_empresas() {
    this.emp_serv.listaEmpresasAll().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          console.log(response.companies);
          this.catalogo_general_empresas = response.companies;
          console.log(this.catalogo_general_empresas);
        }
      }, error => { console.log(error); }
    );
  }

  lista_deleted_empresas() {
    this.emp_serv.listaEmpresasAll().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          console.log(response.companies);
          this.catalogo_empresas_eliminadas = response.companies;
          console.log(this.catalogo_empresas_eliminadas);
        }
      }, error => { console.log(error); }
    );
  }

  descarga_excel_empresas() {

  }

  ver_empresa_data(empresa_token: string) {
    this.emp_serv.empresaDetalleInfo(empresa_token).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.ver_empresa_info = true;
          this.empresa_detail_info = response.empresaInfo;
          this.empresa_detail_info.forEach((emp: any) => {
            this.empresa_detail_folio = emp.company_name;
          });
        }
      }, error => { console.log(error); }
    );
  }

  vincularEmpresaUsuario(empresa_token: string, usuario_token: string) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.emp_serv.vincularEmpresaUsuario(empresa_token, usuario_token).subscribe(
          response => {
            console.log(response);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
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
          }, error => { console.log(error); }
        );
      }
    });
  }
}
