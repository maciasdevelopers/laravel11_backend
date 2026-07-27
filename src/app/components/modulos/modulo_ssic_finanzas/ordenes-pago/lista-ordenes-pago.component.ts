import { Component, OnInit, ElementRef, Renderer2, ViewChild, Input, AfterViewInit, inject, PLATFORM_ID, ChangeDetectorRef, effect } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js/auto';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { Table } from 'primeng/table';
import { SessionContextService } from '../../../../servicios/session-context';

@Component({
  selector: 'sos_finanzas_ordenes_de_pago_main',
  templateUrl: './lista-ordenes-pago.component.html',
  standalone: false,
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/breadcrumb.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/canvas.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/explain.css',
    '../../../../styles/switches.css',
    '../finanzas.css',
    './lista-ordenes-pago.component.css',
  ]
})
export class ListaOrdenesPagoComponent implements OnInit, AfterViewInit {
  public usuario: Usuarios;

  //permisos
  public fnzs_privilegio_consulta: boolean = false;
  public fnzs_privilegio_crear: boolean = false;
  public fnzs_privilegio_editar: boolean = false;
  public fnzs_privilegio_elimina: boolean = false;
  public fnzs_privilegio_ver_docs: boolean = false;
  //graficas
  public chart!: Chart;
  @ViewChild('chart_draw') chart_draw!: ElementRef<HTMLCanvasElement>;
  grafica_datos: any;
  grafica_opciones: any;
  platformId = inject(PLATFORM_ID);

  //activeTabIndex
  activeTabIndex: number = 0;

  constructor(
    private translate: TranslateService,
    private sessionContext: SessionContextService,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
  }

  themeEffect = effect(() => {
    this.grafica_general_ord_pay();
  });

  ngOnInit(): void {
    this.grafica_general_ord_pay();
    this.cambia_permisos();
  }

  ngAfterViewInit() {
    if (this.activeTabIndex === 0) {
      this.grafica_general_ord_pay();
    }
  }

  private async cambia_permisos() {
    const conf_finanzas = this.sessionContext.empresa_data?.conf_finanzas;
    conf_finanzas.forEach((fnzs: any) => {
      if (this.fnzs_privilegio_crear != fnzs.bool_fnzs_perm_crear) {
        this.fnzs_privilegio_crear = fnzs.bool_fnzs_perm_crear;
      }

      if (this.fnzs_privilegio_editar != fnzs.bool_fnzs_perm_editar) {
        this.fnzs_privilegio_editar = fnzs.bool_fnzs_perm_editar;
      }

      if (this.fnzs_privilegio_consulta != fnzs.bool_fnzs_perm_consulta) {
        this.fnzs_privilegio_consulta = fnzs.bool_fnzs_perm_consulta;
      }
  
      if (this.fnzs_privilegio_elimina != fnzs.bool_fnzs_perm_elimina) {
        this.fnzs_privilegio_elimina = fnzs.bool_fnzs_perm_elimina;
      }
  
      if (this.fnzs_privilegio_ver_docs != fnzs.bool_fnzs_perm_ver_docs) {
        this.fnzs_privilegio_ver_docs = fnzs.bool_fnzs_perm_ver_docs;
      }
    });
  }
  
  cambioDeSeccion(tabIndex: string | number){
    const index_tabla = tabIndex.toString();
    switch (index_tabla) {
      case '1': this.relInterna.mensajeOrdPagoSeccionModule('seccion_op_pendientes'); break;
      case '2': this.relInterna.mensajeOrdPagoSeccionModule('seccion_op_liberadas'); break;
      case '3': this.relInterna.mensajeOrdPagoSeccionModule('seccion_op_concluidas'); break;
      case '4': this.relInterna.mensajeOrdPagoSeccionModule('seccion_op_pagos_done'); break;
      case '5': this.relInterna.mensajeOrdPagoSeccionModule('seccion_op_acreedores'); break;
      case '6': this.relInterna.mensajeOrdPagoSeccionModule('seccion_op_deudores'); break;
      case '7': this.relInterna.mensajeOrdPagoSeccionModule('seccion_op_anticipos'); break;
      default:
        break;
    }
  }

  //graficas
  graficaGeneralOrdPayChange(event: any) {
    this.activeTabIndex = event.index;
    console.log(this.activeTabIndex)
    if (this.activeTabIndex === 0 && !this.chart) { // Índice de la pestaña que contiene el canvas
      this.grafica_general_ord_pay();
    }
  }

  grafica_general_ord_pay() {
    //console.log(this.ordenes_pago_lista_pendientes.length);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.grafica_datos = {
      labels: ['No autorizadas', 'Autorizadas', 'Concluidas'],
      datasets: [
        {
          //data: [10, this.ordenes_pago_lista_liberadas_por_id.length, this.ordenes_pago_concluidas_lista.length],
          backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
        }
      ]
    };

    this.grafica_opciones = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.cd.markForCheck();
  }

  grafica_pastel_ord_pay() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Graficas de reembolsos',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    // Creamos la gráfica
    this.chart = new Chart("chart_draw", {
      type: 'line', // tipo de la gráfica 
      data: data, // datos 
      options: {
        responsive: true
      }
    });
  }

  grafica_pastel_ord_reem() {

  }
}
