import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app_interno_egresos_compras_programadas',
  standalone: false,
  templateUrl: './compras-programadas.html',
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
    '../../../../../../styles/colores.css',
    '../../../../../../styles/div_explain.css',
    '../../../../../../styles/switches.css',
    '../../../egresos.css',
    './compras-programadas.css'
  ]
})
export class ComprasProgramadas implements OnInit, OnDestroy {
  searchComprasProgramadas:any = [];
  arrayComprasProgramadas:any = [];
  indicadorComprasProgramadas:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoComprasProgramadas: Date[] | undefined;
  loading = false;
  private destruir$ = new Subject<void>();

  constructor(
    private validator:ValidatorServService,
    private _comprServ: ComprasServService,
    private translate:TranslateService,
    private relInterna:ComunicacionInternaService,
    private servXlsx:DescargaExcel,
    private estabServ:EstablecimientosService,
    private cd: ChangeDetectorRef, 
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    if (this.arrayComprasProgramadas.length === 0) this.verComprasPeriodicas('hoy');
    this.searchComprasProgramadas = ['folio_prod','producto','periodicidadCompra','repeticionPeriodo','tipoPeriodo','fechaFinPeriodo','tipo_variabilidad','importe_minimo',
      'importe_maximo','folio_compra','fecha_registro_compra','forma_pago','metodo_pago','recibeFactura','compra_moneda','compra_a_credito','proveedor_folio','proveedor_nombre','importe_total_compra'];
  }

  listaComprasPriodicas() {
    this.verComprasPeriodicas(this.indicadorComprasProgramadas);
  }

  verComprasPeriodicas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorComprasProgramadas = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;
    
    if (filtro == 'otras_fechas') {
      var buy_otras_fechas = document.getElementById("buy_otras_fechas");
      if (this.rangoPeriodoComprasProgramadas && this.rangoPeriodoComprasProgramadas.length === 2) {
        const dateInicio = this.rangoPeriodoComprasProgramadas[0];
        const dateFin = this.rangoPeriodoComprasProgramadas[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(buy_otras_fechas);
          } else {
            this.validator.errorInputRow(buy_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(buy_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(buy_otras_fechas);
        return;
      }
    }
 
    this._comprServ.getListaComprasPeriodicas(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.arrayComprasProgramadas = response.compras;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayComprasProgramadas = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.arrayComprasProgramadas = [];
  }

  autorizaCompra(token_compras:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._comprServ.autorizaCompra(token_compras).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              this.listaComprasPriodicas();
            }
            if (response.status == 'error') {
              Swal.fire({
                position:'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
