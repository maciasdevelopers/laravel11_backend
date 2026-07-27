import { Component, OnInit } from '@angular/core';
import { CuentasContablesService } from '../../../../../../servicios/ssic/cuentas-contables-service.service';
import { TreeNode } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app_contabilidad_catalogo_cuentas_contables_lista',
  templateUrl: './cuentas_contables_lista.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/listas_ps.css',
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
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../contabilidad.css',
    './cuentas_contables_lista.component.css'
  ],
  providers: [
    TableModule,
    TreeTableModule,
    //appRoutingProviders,
    //AuthGuardService,
    //DisAuthGuardService,
    //{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: LoadInterceptorInterceptor, multi: true },
  ],
})
export class CuentasContablesListaComponent implements OnInit {
  search_cuentas_contables_general_view:any;
  list_cuentas_contables_general: TreeNode[] = [];
  cuentaDetalleData:any = [];

  expandedRows: { [s: string]: boolean } = {};
  constructor(private c_contable_serv:CuentasContablesService) {
  }

  ngOnInit(): void {
    this.lista_cuentas_contables();
  }

  lista_cuentas_contables(){
    this.c_contable_serv.catalogoCuentaContable().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.list_cuentas_contables_general = response.cuentas_contables.map((cuenta:any) => ({
            data: cuenta,
            children: [] // si no tiene hijos, queda vacío
          }));
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return '';
    }
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return '';
    }
  }

  infoCuentaDetalle(cuenta: any) {
    console.log("Editando cuenta:", cuenta);
    // aquí puedes cargar la cuenta al formulario
  }

  eliminarCuenta(cuenta: any) {
    console.log("Eliminando cuenta:", cuenta);
    // aquí podrías lanzar un diálogo de confirmación
  }

}
