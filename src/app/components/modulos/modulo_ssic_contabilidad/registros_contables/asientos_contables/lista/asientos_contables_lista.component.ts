import { Component, OnInit } from '@angular/core';
import { AsientosContablesService } from '../../../../../../servicios/ssic/asientos-contables.service';
import { TableModule } from 'primeng/table';
//import { CalendarModule } from 'primeng/calendar';
//import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asientos-contables-lista',
  templateUrl: './asientos_contables_lista.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../../styles/loading.css',
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
    '../../../../../../styles/colores.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/explain.css',
    '../../../contabilidad.css',
    './asientos_contables_lista.component.css'
  ],
  providers: [
    TableModule,
    //CalendarModule,
    //DropdownModule,
    ButtonModule
  ],
})
export class AsientosContablesListaComponent implements OnInit {
  listaAsientos: any[] = [];
  viewLista: boolean = false;
  loading: boolean = false;

  // Filtros
  fecha_inicio: any = null;
  fecha_fin: any = null;
  tipo_poliza: any = null;
  tiposPoliza: any[] = [];

  ver_form_registro_asiento_contable: boolean = false;
  ver_form_consulta_asiento_contable: boolean = false;

  constructor(
    private asientosService: AsientosContablesService,
    private translate: TranslateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.cargarTiposPoliza();
    this.buscarAsientos();
  }

  cargarTiposPoliza() {
    this.asientosService.catalogoTiposPoliza().subscribe(
      response => {
        if (response.status === 'success') {
          this.tiposPoliza = response.tipos_poliza;
        }
      },
      error => {
        console.log('Error al cargar tipos de póliza:', error);
      }
    );
  }

  buscarAsientos() {
    this.loading = true;
    this.viewLista = false;
    
    const fechaInicio = this.fecha_inicio ? this.formatDate(this.fecha_inicio) : '';
    const fechaFin = this.fecha_fin ? this.formatDate(this.fecha_fin) : '';
    const tipoPoliza = this.tipo_poliza ? this.tipo_poliza.value : '';

    this.asientosService.listaAsientosContables(fechaInicio, fechaFin, tipoPoliza).subscribe(
      response => {
        this.loading = false;
        this.viewLista = true;
        if (response.status === 'success') {
          this.listaAsientos = response.asientos_contables;
        }
      },
      error => {
        this.loading = false;
        console.log('Error al cargar asientos contables:', error);
      }
    );
  }

  limpiarFiltros() {
    this.fecha_inicio = null;
    this.fecha_fin = null;
    this.tipo_poliza = null;
    this.buscarAsientos();
  }

  verDetalle(token_asiento: any) {
    this.ver_form_consulta_asiento_contable = true;
    //this.router.navigate(['./plataformas/ssic/contabilidad/asientos_contables_consulta', token_asiento]);
  }

  nuevoAsiento() {
    this.ver_form_registro_asiento_contable = true;
    //this.router.navigate(['./plataformas/ssic/contabilidad/asientos_contables_registro']);
  }

  editarAsiento(token_asiento: any) {
    this.router.navigate(['./plataformas/ssic/contabilidad/asientos_contables_registro', token_asiento]);
  }

  eliminarAsiento(token_asiento: any) {
    Swal.fire({
      title: '¿Está seguro de eliminar este asiento contable?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#388E3C',
      cancelButtonColor: '#D32F2F',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.asientosService.eliminarAsientoContable(token_asiento).subscribe(
          response => {
            if (response.status === 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Asiento eliminado correctamente',
                showConfirmButton: false,
                timer: 3000
              });
              this.buscarAsientos();
            } else {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.message,
                showConfirmButton: false,
                timer: 3000
              });
            }
          },
          error => {
            console.log('Error al eliminar asiento:', error);
          }
        );
      }
    });
  }

  autorizarAsiento(token_asiento: any) {
    Swal.fire({
      title: '¿Autorizar este asiento contable?',
      text: 'Una vez autorizado no podrá modificarse',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#388E3C',
      cancelButtonColor: '#D32F2F',
      confirmButtonText: 'Sí, autorizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.asientosService.autorizarAsientoContable(token_asiento).subscribe(
          response => {
            if (response.status === 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Asiento autorizado correctamente',
                showConfirmButton: false,
                timer: 3000
              });
              this.buscarAsientos();
            } else {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.message,
                showConfirmButton: false,
                timer: 3000
              });
            }
          },
          error => {
            console.log('Error al autorizar asiento:', error);
          }
        );
      }
    });
  }

  getSeverityEstado(estado: string) {
    switch (estado) {
      case 'BORRADOR':
        return 'warn';
      case 'AUTORIZADO':
        return 'success';
      case 'CANCELADO':
        return 'danger';
      default:
        return '';
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}