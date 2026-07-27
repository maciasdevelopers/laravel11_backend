import { Component, OnInit } from '@angular/core';
import { AsientosContablesService } from '../../../../../../servicios/ssic/asientos-contables.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asientos-contables-consulta',
  templateUrl: './asientos_contables_consulta.component.html',
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
    './asientos_contables_consulta.component.css'
  ],
  providers: [
    TableModule,
    ButtonModule,
    TagModule
  ],
})
export class AsientosContablesConsultaComponent implements OnInit {
  tokenAsiento: any = null;
  asiento: any = null;
  movimientos: any[] = [];
  loading: boolean = false;

  constructor(
    private asientosService: AsientosContablesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tokenAsiento = this.route.snapshot.params['token_asiento'];
    if (this.tokenAsiento) {
      this.cargarAsiento(this.tokenAsiento);
    }
  }

  cargarAsiento(token: any) {
    this.loading = true;
    this.asientosService.detalleAsientoContable(token).subscribe(
      response => {
        this.loading = false;
        if (response.status === 'success') {
          this.asiento = response.asiento_contable;
          this.movimientos = response.asiento_contable.movimientos || [];
        }
      },
      error => {
        this.loading = false;
        console.log('Error al cargar asiento:', error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al cargar el asiento contable',
          showConfirmButton: false,
          timer: 3000
        });
      }
    );
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

  getSeverityTipo(tipo: string) {
    switch (tipo) {
      case 'DEBE':
        return 'success';
      case 'HABER':
        return 'danger';
      default:
        return '';
    }
  }

  regresar() {
    this.router.navigate(['./plataformas/ssic/contabilidad/asientos_contables']);
  }

  imprimir() {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: 'Función de impresión en desarrollo',
      showConfirmButton: false,
      timer: 3000
    });
  }
}