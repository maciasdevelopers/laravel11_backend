import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app_interno_egresos_compras_descuentos_solicitudes',
  standalone: false,
  templateUrl: './compras_solicitudes_descuento.component.html',
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
    './compras_solicitudes_descuento.component.css'
  ]
})
export class ComprasSolicitudesDeDescuentoComponent implements OnInit, OnDestroy {
  //Descuentos
  listaComprasDescuentos:any = [];
  indicadorComprasDescuentos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoComprasDescuentos: Date[] | undefined;
  loading = false;
  private destruir$ = new Subject<void>();

  constructor(
    private validator:ValidatorServService,
    private _comprServ: ComprasServService,
    private translate:TranslateService,
    private relInterna:ComunicacionInternaService,
    private servXlsx:DescargaExcel,
    private cd: ChangeDetectorRef, 
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    if (this.listaComprasDescuentos.length === 0) this.verDescuentosCompras('hoy');
  }

  listarDescuentosCompras() {
    this.verDescuentosCompras(this.indicadorComprasDescuentos);
  }

  verDescuentosCompras(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorComprasDescuentos = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;
    
    if (filtro == 'otras_fechas') {
      var buy_otras_fechas = document.getElementById("buy_otras_fechas");
      if (this.rangoPeriodoComprasDescuentos && this.rangoPeriodoComprasDescuentos.length === 2) {
        const dateInicio = this.rangoPeriodoComprasDescuentos[0];
        const dateFin = this.rangoPeriodoComprasDescuentos[1];
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
 
    this._comprServ.listaComprasDescuentos(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.listaComprasDescuentos = response.descuentos;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listaComprasDescuentos = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.listaComprasDescuentos = [];
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}