import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { Subject, takeUntil } from 'rxjs';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionContextService } from '../../../../../servicios/session-context';
import { Router } from 'express';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { NgForm } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'fnzs_dispersion_nominas_liberadas',
  standalone: false,
  templateUrl: './dispersion-nominas-liberadas.html',
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
    './dispersion-nominas-liberadas.css',
  ]
})
export class DispersionNominasLiberadas implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;

  searchPagoLiberadas: any = [];
  ordenes_disper_liberadas: any = [];
  indicadorDisperNomOrdLib:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoNomLibOrd: Date[] | undefined;

  orden_pago_nomina_op_token: string = "";
  public factura_relacionada_token:string = '';
  public factura_relacionada_typo:string = '';

  public orden_pago_nomina_efectivo_ver: boolean = false;
  orden_pago_nomina_periodo_token: string = "";

  public orden_pago_nomina_especie_ver: boolean = false;
  orden_pago_nomina_especie_token: string = "";
  private destruir$ = new Subject<void>();

  constructor(
    private ordenDisper: NominaDispersionService,
    private validator: ValidatorServService,
    private sentinela: SentinelArkManager,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaOrdSeccionModule();
    this.getRespuestaOrdAuthChange();
    this.searchPagoLiberadas = ['folio_ordenPago', 'fecha_contabilizacion_orden_pago', 'factura_relacionada_string', 'orden_bloqueada', 'fecha_contabilizacion_doc_anterior', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'orden_emisor_emp', 'autorizacion_pay_text', 'fecha_autorizacion_pay', 'pago_anticipado', 'status_pago', 'status_pago_date', 'pago_realizado_folio', 'pago_realizado_fecha_contabilizacion',
      'pago_realizado_proveedor_name', 'pago_realizado_acreedor_name', 'pago_realizado_forma_pago_vinculada', 'pago_realizado_forma_metodo_pago_cfdi', 'pago_realizado_monto', 'pago_realizado_tipo_cambio', 'pago_realizado_observaciones',
      'importe_total_inicial', 'importe_autorizado_inicial_format', 'importe_autorizado_final', 'debe_format'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdDisperSeccionModule$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_orden_disper_liberadas") {
          console.log(mensaje);
          if (this.ordenes_disper_liberadas.length === 0) this.ver_ordenes_dispersion_liberadas('hoy');
        }
      }
    );
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "dispersion_nomina_realizada") {
          this.lista_ordenes_dispersion_liberadas();
        }
      }
    );
  }

  getRespuestaOrdAuthChange() {
    this.relInterna.mensajeOrdAuthChange$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "orden_dispersion_modificada_main_auth" || mensaje == "orden_dispersion_modificada_pend_auth") {
          this.lista_ordenes_dispersion_liberadas();
        }
      }
    );
  }

  lista_ordenes_dispersion_liberadas() {
    this.ver_ordenes_dispersion_liberadas(this.indicadorDisperNomOrdLib);
  }

  ver_ordenes_dispersion_liberadas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDisperNomOrdLib = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var disper_lib_otras_fechas = document.getElementById("disper_lib_otras_fechas");
      if (this.rangoPeriodoNomLibOrd && this.rangoPeriodoNomLibOrd.length === 2) {
        const dateInicio = this.rangoPeriodoNomLibOrd[0];
        const dateFin = this.rangoPeriodoNomLibOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(disper_lib_otras_fechas);
          } else {
            this.validator.errorInputRow(disper_lib_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(disper_lib_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(disper_lib_otras_fechas);
        return;
      }
    }

    this.ordenDisper.lista_liberadas_ordenes_dispersion(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaDispersionLiberadas(response),
      error: (err) => this.manejarErrorDispersionLiberadas(err)
    });
  }
  
  private procesarRespuestaDispersionLiberadas(response: any) {
    console.log(response)
    if (response.status === 'success') {
      this.ordenes_disper_liberadas = response.ordenes;//.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      this.cd.detectChanges();
    } else {
      this.ordenes_disper_liberadas = [];
    }
  }

  private manejarErrorDispersionLiberadas(error: any) {
    console.error('Error al cargar la lista de ordenes de dispersión de nómina liberadas:', error);
    this.ordenes_disper_liberadas = [];
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }

  listar_pago_nomina_simple(token_ordenPago: string, token_nominas_periodos: string) {
    this.orden_pago_nomina_efectivo_ver = true;
    this.orden_pago_nomina_op_token = token_ordenPago;
    this.orden_pago_nomina_periodo_token = token_nominas_periodos;
  }

  listar_pago_nomi_na_especie_simple(token_ordenPago: string, token_nominas_especie: string) {
    this.orden_pago_nomina_especie_ver = true;
    this.orden_pago_nomina_op_token = token_ordenPago;
    this.orden_pago_nomina_especie_token = token_nominas_especie;
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
