import { Component,OnInit, ElementRef, Renderer2, ViewChild, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ComprasServService } from '../../../../../../../servicios/ssic/compras-serv.service';
import { ProductosService } from '../../../../../../../servicios/ssic/productos.service';
import { ActFijosService } from '../../../../../../../servicios/ssic/act-fijos.service';
import { ActIntangiblesService } from '../../../../../../../servicios/ssic/act-intangibles.service';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import { MonedasService } from '../../../../../../../servicios/monedas.service';
import { TranslateService } from '@ngx-translate/core';
import { prorrateoModelo } from '../../../../../../../modelos/prorrateoModelo';
import numeral from 'numeral';

import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../../../servicios/comunicacion-interna.service';
import { Subject, takeUntil } from 'rxjs';
import { DescargaExcel } from '../../../../../../../servicios/descarga-excel';
import { EstablecimientosService } from '../../../../../../../servicios/establecimientos';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app_egresos_compras_lista_prorratean',
  templateUrl: './compras_lista_prorratean.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/datatable.css',
    '../../../../../../../styles/dropdown.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/file_input.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/landing.css',
    '../../../../../../../styles/explain.css',
    '../../../../../../../styles/switches.css',
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/diseños_contables.css',
    '../../../../egresos.css',
    './compras_lista_prorratean.component.css'
  ],
  //providers: [RequisicionesService,ServClientesService]
})

export class ComprasListaProrrateanComponent implements OnInit, OnDestroy {
  arrayProrrateos:any = [];
  indicadorProrrateos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  loading = false;
  rangoPeriodoProrrateos: Date[] | undefined;
  tokenComprasProrrateo: any = null;
  verDialogoProrrateo: boolean = false;
  
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
    if (this.arrayProrrateos.length === 0) this.listarProrrateosCompras();
  }

  listarProrrateosCompras() {
    this.verProrrateosCompras(this.indicadorProrrateos);
  }

  //prorrateos
  verProrrateosCompras(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorProrrateos = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;
    
    if (filtro == 'otras_fechas') {
      var buy_otras_fechas = document.getElementById("buy_otras_fechas");
      if (this.rangoPeriodoProrrateos && this.rangoPeriodoProrrateos.length === 2) {
        const dateInicio = this.rangoPeriodoProrrateos[0];
        const dateFin = this.rangoPeriodoProrrateos[1];
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
 
    this._comprServ.listaProrrateos(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.arrayProrrateos = response.datosProrrateo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayProrrateos = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.arrayProrrateos = [];
  }

  infoProrrateo(token_prorrateo:any){
    this.relInterna.mensajeComprasProrrateos(token_prorrateo);
    this.tokenComprasProrrateo = token_prorrateo;
    this.verDialogoProrrateo = true;
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
