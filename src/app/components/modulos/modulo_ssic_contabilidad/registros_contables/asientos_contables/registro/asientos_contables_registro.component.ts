import { Component, OnInit } from '@angular/core';
import { AsientosContablesService } from '../../../../../../servicios/ssic/asientos-contables.service';
import { CuentasContablesService } from '../../../../../../servicios/ssic/cuentas-contables-service.service';
import { TableModule } from 'primeng/table';
//import { CalendarModule } from 'primeng/calendar';
//import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
//import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
//import { Math }

@Component({
  selector: 'app-asientos-contables-registro',
  templateUrl: './asientos_contables_registro.component.html',
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
    './asientos_contables_registro.component.css'
  ],
  providers: [
    TableModule,
    //CalendarModule,
    //DropdownModule,
    ButtonModule,
    InputTextModule,
    //InputTextareaModule
  ],
})
export class AsientosContablesRegistroComponent implements OnInit {
  tokenAsiento: any = null;
  esEdicion: boolean = false;

  // Datos del asiento
  fecha: any = null;
  tipo_poliza: any = null;
  concepto: string = '';
  observaciones: string = '';
  estado: string = 'BORRADOR';

  // Catálogos
  tiposPoliza: any[] = [];
  cuentasContables: any[] = [];
  cuentasFiltradas: any[] = [];

  // Movimientos (partidas)
  movimientos: any[] = [];
  nuevoMovimiento: any = {
    cuenta_contable: null,
    tipo_movimiento: 'DEBE',
    monto: 0,
    concepto: ''
  };

  // Totales
  totalDebe: number = 0;
  totalHaber: number = 0;
  diferencia: number = 0;

  // UI
  loading: boolean = false;
  viewFormulario: boolean = true;

  constructor(
    private asientosService: AsientosContablesService,
    private cuentasService: CuentasContablesService,
    private route: ActivatedRoute,
    private translate:TranslateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.tokenAsiento = this.route.snapshot.params['token_asiento'];
    
    if (this.tokenAsiento) {
      this.esEdicion = true;
      this.cargarAsiento(this.tokenAsiento);
    }
  }

  cargarCatalogos() {
    // Cargar tipos de póliza
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

    // Cargar catálogo de cuentas contables
    this.cuentasService.catalogoCuentaContable().subscribe(
      response => {
        if (response.status === 'success') {
          this.cuentasContables = response.cuentas_contables;
        }
      },
      error => {
        console.log('Error al cargar cuentas contables:', error);
      }
    );
  }

  cargarAsiento(token: any) {
    this.loading = true;
    this.asientosService.detalleAsientoContable(token).subscribe(
      response => {
        this.loading = false;
        if (response.status === 'success') {
          const asiento = response.asiento_contable;
          this.fecha = new Date(asiento.fecha);
          this.tipo_poliza = this.tiposPoliza.find((t: any) => t.value === asiento.tipo_poliza) || null;
          this.concepto = asiento.concepto;
          this.observaciones = asiento.observaciones || '';
          this.estado = asiento.estado;
          this.movimientos = asiento.movimientos || [];
          this.calcularTotales();
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

  filtrarCuentas(event: any) {
    const filtered: any[] = [];
    const query = event.query.toLowerCase();
    for (const cuenta of this.cuentasContables) {
      if (cuenta.nombre.toLowerCase().includes(query) || 
          cuenta.numero.includes(query)) {
        filtered.push(cuenta);
      }
    }
    this.cuentasFiltradas = filtered;
  }

  agregarMovimiento() {
    if (!this.nuevoMovimiento.cuenta_contable) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Seleccione una cuenta contable',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    if (!this.nuevoMovimiento.monto || this.nuevoMovimiento.monto <= 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Ingrese un monto válido',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    const movimiento = {
      ...this.nuevoMovimiento,
      token_cuenta: this.nuevoMovimiento.cuenta_contable.token_cuenta_contable,
      numero_cuenta: this.nuevoMovimiento.cuenta_contable.numero,
      nombre_cuenta: this.nuevoMovimiento.cuenta_contable.nombre
    };

    this.movimientos.push(movimiento);
    this.calcularTotales();
    this.limpiarMovimiento();
  }

  limpiarMovimiento() {
    this.nuevoMovimiento = {
      cuenta_contable: null,
      tipo_movimiento: 'DEBE',
      monto: 0,
      concepto: ''
    };
  }

  eliminarMovimiento(index: number) {
    Swal.fire({
      title: '¿Eliminar este movimiento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#388E3C',
      cancelButtonColor: '#D32F2F',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.movimientos.splice(index, 1);
        this.calcularTotales();
      }
    });
  }

  calcularTotales() {
    this.totalDebe = 0;
    this.totalHaber = 0;

    this.movimientos.forEach((mov: any) => {
      if (mov.tipo_movimiento === 'DEBE') {
        this.totalDebe += parseFloat(mov.monto);
      } else {
        this.totalHaber += parseFloat(mov.monto);
      }
    });

    this.diferencia = this.totalDebe - this.totalHaber;
  }
  
  get tieneDiferencia(): boolean {
    return Math.abs(this.diferencia) > 0.01;
  }

  validarFormulario(): boolean {
    if (!this.fecha) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Seleccione la fecha del asiento',
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (!this.tipo_poliza) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Seleccione el tipo de póliza',
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (!this.concepto || this.concepto.trim() === '') {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Ingrese el concepto del asiento',
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (this.movimientos.length < 2) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'El asiento debe tener al menos 2 movimientos',
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    if (Math.abs(this.diferencia) > 0.01) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'El asiento no está cuadrado. Diferencia: ' + this.diferencia.toFixed(2),
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }

    return true;
  }

  guardarAsiento() {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    const fechaFormateada = this.formatDate(this.fecha);

    const data:any = {
      fecha: fechaFormateada,
      tipo_poliza: this.tipo_poliza.value,
      concepto: this.concepto,
      observaciones: this.observaciones,
      movimientos: this.movimientos.map((mov: any) => ({
        token_cuenta_contable: mov.token_cuenta,
        tipo_movimiento: mov.tipo_movimiento,
        monto: mov.monto,
        concepto: mov.concepto
      }))
    };

    if (this.esEdicion) {
      data['token_asiento'] = this.tokenAsiento;
      this.asientosService.actualizarAsientoContable(
        this.tokenAsiento,
        fechaFormateada,
        this.tipo_poliza.value,
        this.concepto,
        data.movimientos,
        this.observaciones
      ).subscribe(
        response => {
          this.loading = false;
          if (response.status === 'success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Asiento actualizado correctamente',
              showConfirmButton: false,
              timer: 3000
            });
            this.router.navigate(['./plataformas/ssic/contabilidad/asientos_contables']);
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
          this.loading = false;
          console.log('Error al actualizar asiento:', error);
        }
      );
    } else {
      this.asientosService.registrarAsientoContable(
        fechaFormateada,
        this.tipo_poliza.value,
        this.concepto,
        data.movimientos,
        this.observaciones
      ).subscribe(
        response => {
          this.loading = false;
          if (response.status === 'success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Asiento registrado correctamente',
              showConfirmButton: false,
              timer: 3000
            });
            this.router.navigate(['./plataformas/ssic/contabilidad/asientos_contables']);
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
          this.loading = false;
          console.log('Error al registrar asiento:', error);
        }
      );
    }
  }

  cancelar() {
    Swal.fire({
      title: '¿Cancelar la operación?',
      text: 'Los datos no guardados se perderán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#388E3C',
      cancelButtonColor: '#D32F2F',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['./plataformas/ssic/contabilidad/asientos_contables']);
      }
    });
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