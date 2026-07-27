import { ChangeDetectorRef, Component } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { Subject } from 'rxjs';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'fnzs_dispersion_nominas_trabajadores',
  standalone: false,
  templateUrl: './dispersion-nominas-trabajadores.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/breadcrumb.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/canvas.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../finanzas.css',
    './dispersion-nominas-trabajadores.css',
  ]
})
export class DispersionNominasTrabajadores {
  public usuario: Usuarios;
  public identidad: any;

  //trabajadores
  catalogo_trabajadores_list: any = [];
  indicadorDisperOrdTrabajadores:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoDisperOrdTrabajadores: Date[] | undefined;
  trabajador_detail: any = [];
  public trabajador_detail_ver: boolean = false;
  search_acreedor_estado_de_cuenta: any = [];

  private destruir$ = new Subject<void>();

  constructor(
    private ordenDisper: NominaDispersionService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private servXlsx: DescargaExcel,
    private validator: ValidatorServService,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaOrdSeccionModule();
    this.search_acreedor_estado_de_cuenta = ['tipo_registro_e_cuenta', 'folio_e_cuenta', 'cancelacion_folio', 'movimiento_folio', 'fecha_contabilizacion', 'cancelacion_doc_anterior',
      'forma_pago_vinculada', 'forma_pago_cfdi', 'metodo_pago_cfdi', 'observacionesPago', 'monto_pago', 'tipo_cambio_movimiento', 'estado_cuenta_debe_format', 'estado_cuenta_haber_format',
      'estado_cuenta_saldo_format'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdDisperSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_orden_disper_trabajadores") {
          console.log(mensaje);
          if (this.catalogo_trabajadores_list.length === 0) this.lista_catalogo_trabajadores('hoy');
        }
      }
    );
  }

  //trabajadores
  lista_catalogo_trabajadores(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDisperOrdTrabajadores = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var trabajadores_dispersion_otras_fechas = document.getElementById("trabajadores_dispersion_otras_fechas");
      if (this.rangoPeriodoDisperOrdTrabajadores && this.rangoPeriodoDisperOrdTrabajadores[1]) {
        const dateInicio = this.rangoPeriodoDisperOrdTrabajadores[0];
        const dateFin = this.rangoPeriodoDisperOrdTrabajadores[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(trabajadores_dispersion_otras_fechas);
          } else {
            this.validator.errorInputRow(trabajadores_dispersion_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(trabajadores_dispersion_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(trabajadores_dispersion_otras_fechas);
      }
    }

    this.ordenDisper.catalogoNominaTrabajadores(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaTrabajadores(response),
      error: (err) => this.manejarErrorTrabajadores(err)
    });
  }

  private procesarRespuestaTrabajadores(response: any) {
    if (response.status === 'success') {
      this.catalogo_trabajadores_list = response.empleados;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.catalogo_trabajadores_list = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorTrabajadores(error: any) {
    console.error('Error al cargar catálogo de trabajadores:', error);
    this.catalogo_trabajadores_list = [];
  }

  verDetalleEmpleado(token_empleado_vhum: any) {
    this.trabajador_detail = [];
    //console.log(token_empleado_vhum);
    const trabajador_find = this.catalogo_trabajadores_list.find((row: any) => row.token_empleado_vhum === token_empleado_vhum);
    if (typeof trabajador_find !== 'undefined') {
      this.ordenDisper.dispersion_pagos_trabajador(token_empleado_vhum).subscribe(
        response => {
          console.log(response);
          if (response.status == 'success') {
            this.trabajador_detail_ver = true;
            this.trabajador_detail = response.empleado_info;
            console.log(this.trabajador_detail);
          }
        }, error => { console.log(error); }
      );
    }
  }

  descarga_excel_trab_estado_cuenta(estado_de_cuenta: any) {
    /*const est_cuenta_acr = estado_de_cuenta.map((payDone: any) => ({
      ...payDone,
      excel_folio_est_cuenta: payDone.tipo_registro_e_cuenta == 'PAGO' ? payDone.pago_folio : (payDone.tipo_registro_e_cuenta == 'CANCELACION' ? payDone.cancelacion_folio : payDone.movimiento_folio),
      excel_forma_pago: payDone.forma_pago_cfdi + " / " + payDone.metodo_pago_cfdi
    }));
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "excel_folio_est_cuenta", align: "center" },
      { label: this.translate.instant("fecha_cont"), field: "fecha_contabilizacion", align: "center" },
      { label: this.translate.instant("doc_ant"), field: "cancelacion_doc_anterior", align: "center" },
      { label: this.translate.instant("f_pago"), field: "forma_pago_vinculada", align: "center" },
      { label: this.translate.instant("f_m_pago_cfdi"), field: "excel_forma_pago", align: "center" },
      { label: this.translate.instant("observ"), field: "observacionesPago", align: "left" },
      { label: this.translate.instant("total_import"), field: "monto_pago", align: "right" },
      { label: this.translate.instant("mon_tipo_cambio"), field: "tipo_cambio_movimiento", align: "right" },
      { label: "debe", field: "estado_cuenta_debe_format", align: "right" },
      { label: "haber", field: "estado_cuenta_haber_format", align: "right" },
      { label: "saldo", field: "estado_cuenta_saldo_format", align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(est_cuenta_acr, columnas, 'Estado de cuenta de acreedores', 'estado_de_cuenta_de_acreedores.xlsx');*/
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
