import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { OrdenesProduccionService } from '../../../../servicios/logistica/ordenes-produccion.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { ComprasServService } from '../../../../servicios/ssic/compras-serv.service';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../servicios/descarga-excel';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LogisticaService } from '../../../../servicios/ssic/logistica-service';

@Component({
  selector: 'app-logistica-de-compras',
  standalone: false,
  templateUrl: './logistica-de-compras.html',
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/div_explain.css',
    '../../../../styles/switches.css',
    '../../../../styles/navegador.css',
    '../egresos.css',
    './logistica-de-compras.css'
  ]
})
export class EgresosLogisticaDeCompras implements OnInit, OnDestroy {
  searchTrasitosIniciados:any = [];
  arrayTrasitosIniciados:any = [];
  indicadorTrasitosIniciados:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoTrasitosIniciados: Date[] | undefined;

  loading = false;
  private destruir$ = new Subject<void>();
  //informacion desglose de compra
  public ver_logistica_monitor: boolean = false;
  public ver_logistica_continuar_ruta_bifurcada: boolean = false;
  public ver_logistica_registra_llegada_fecha:boolean = false;
  public ver_logistica_autoriza_llegada:boolean = false;
  public orden_iniciar_transito:string = "desactivada";
  public logistica_seguimiento_token:string = "";
  public logistica_seguimiento_folio:string = "";

  constructor(
    private validator:ValidatorServService,
    private _comprServ: ComprasServService,
    private logisticServ: LogisticaService,
    private translate:TranslateService,
    private relInterna:ComunicacionInternaService,
    private servXlsx:DescargaExcel,
    private cd: ChangeDetectorRef, 
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.lista_trasitos_iniciados('hoy');
    this.getRespuestaRegistroLogistica();
    this.getRespuestaSeguimientoLogistica();

    this.searchTrasitosIniciados = ['folio_compra','fecha_contabilizacion','proveedor_folio','proveedor_nombre','proveedor_nombre_comercial','compra_a_credito',
      'fecha_vencimiento','compra_moneda','compra_subtotal','compra_descuento','compra_retenciones','compra_traslados','importe_total_compra','aplica_recepcion_facturas',
      'recibeFactura','cfdi_comprobante_version','cfdi_comprobante_serie','cfdi_comprobante_folio','cfdi_comprobante_fecha','cfdi_comprobante_forma_de_pago','cfdi_comprobante_metodo_de_pago',
      'cfdi_comprobante_subtotal','cfdi_comprobante_moneda','cfdi_comprobante_tipo_de_cambio','cfdi_comprobante_total','cfdi_comprobante_confirmacion','cfdi_comprobante_tipo_de_comprobante',
      'cfdi_complementoFechaTimbrado','cfdi_complementoUUID','articulos_recibidos','total_articulos','lugarRecepcionTipo','lugarRecepcionTipo','lugarRecepcionDireccion','status_autorizacion',
      'existe_orden_recepcion','proveedor_token','bloqueo_orden_recepcion','uuid_orden_recepcion','folio_orden_pago','fecha_contabilizacion_orden_pago','pagos_realizados_fecha_contabilizacion',
      'pagos_realizados_fecha_contabilizacion','existe_orden_pago'];
  }

  getRespuestaRegistroLogistica(){
    this.relInterna.mensajeLogisticaRegistro$.subscribe(
      (mensaje:any) => {
        if (mensaje == "ruta_iniciada") {
          this.lista_trasitos_iniciados('hoy');
        }
      }
    );
  }

  cargar_lista_trasitos_iniciados() {
    this.lista_trasitos_iniciados(this.indicadorTrasitosIniciados);
  }

  lista_trasitos_iniciados(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorTrasitosIniciados = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;
    
    if (filtro == 'otras_fechas') {
      var transitos_otras_fechas = document.getElementById("transitos_otras_fechas");
      if (this.rangoTrasitosIniciados && this.rangoTrasitosIniciados.length === 2) {
        const dateInicio = this.rangoTrasitosIniciados[0];
        const dateFin = this.rangoTrasitosIniciados[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(transitos_otras_fechas);
          } else {
            this.validator.errorInputRow(transitos_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(transitos_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(transitos_otras_fechas);
        return;
      }
    }
 
    this.logisticServ.logisticaTrasitosIniciadosLista(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarTrasitosRespuesta(response),
      error: (err) => this.manejarTrasitosError(err)
    });
  }

  private procesarTrasitosRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.arrayTrasitosIniciados = response.compras;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayTrasitosIniciados = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarTrasitosError(error: any) {
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.arrayTrasitosIniciados = [];
  }

  getRespuestaSeguimientoLogistica(){
    this.relInterna.mensajeLogisticaSeguimiento$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seguimiento_logistico") {
          console.log(mensaje)
          this.relInterna.logisticaSeguimientoToken$.subscribe(
            (token: any) => {
              console.log(token);
            }
          );
        }
      }
    );
  }

  actualizar_partida(token_seguimiento_transito: any) {
    const cLog = this.arrayTrasitosIniciados.find((logis:any) => logis.token_seguimiento_transito === token_seguimiento_transito);
    //token_seguimiento_transito
    this.logisticServ.actualizarLogisticaTransito(token_seguimiento_transito).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          cLog.estado_alcanzado = response.estado_alcanzado;
          cLog.fecha_real_salida = response.fecha_real_salida;
          cLog.observaciones_salida = response.observaciones_salida;
          cLog.arribo_final_fecha_tentativa = response.arribo_final_fecha_tentativa;
          cLog.arribo_final_fecha_real = response.arribo_final_fecha_real;
          cLog.arribo_final_observaciones = response.arribo_final_observaciones;
          cLog.arribo_final_autorizado = response.arribo_final_autorizado;
          cLog.arribo_final_fecha_auth = response.arribo_final_fecha_auth;
          cLog.usuario_registra = response.usuario_registra;
          cLog.clase_espera = response.clase_espera;
          cLog.clase_transito = response.clase_transito;
          cLog.clase_entregados = response.clase_entregados;
          cLog.avance_entrega = response.avance_entrega;
          cLog.clase_recibidos = response.clase_recibidos;
          cLog.avance_recepcion = response.avance_recepcion;
          cLog.articulos_en_espera = response.articulos_en_espera;
          cLog.habilita_reg_new_salidas = response.habilita_reg_new_salidas;
          cLog.articulos_en_transito = response.articulos_en_transito;
          cLog.habiltar_continua_rutas = response.habiltar_continua_rutas;
          cLog.articulos_entregados = response.articulos_entregados;
          cLog.transitos_sin_fecha_llegada = response.transitos_sin_fecha_llegada;
          cLog.transitos_llegada_sin_auth = response.transitos_llegada_sin_auth;
          cLog.articulos_recibidos = response.articulos_recibidos;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  showCompraWindowIniciaTransito() {
    this.orden_iniciar_transito = this.orden_iniciar_transito == "desactivada" ? "activada" : "desactivada";
  }
  
  showWindowMonitor(cLog: any) {
    this.ver_logistica_monitor = true;
    this.logistica_seguimiento_token = cLog.token_seguimiento_transito;
    this.logistica_seguimiento_folio = cLog.folio_seguimiento_transito;
  }
  
  showWindowContinuarRutaBifurcada(cLog: any) {
    this.ver_logistica_continuar_ruta_bifurcada = true;
    this.logistica_seguimiento_token = cLog.token_seguimiento_transito;
    this.logistica_seguimiento_folio = cLog.folio_seguimiento_transito;
  }

  showLogisticaWindowRegistraFechaLlegada(cLog:any) {
    this.ver_logistica_registra_llegada_fecha = true;
    this.logistica_seguimiento_token = cLog.token_seguimiento_transito;
    this.logistica_seguimiento_folio = cLog.folio_seguimiento_transito;
  }

  showLogisticaWindowIniciaLlegadaAutorizar(cLog:any) {
    this.ver_logistica_autoriza_llegada = true;
    this.logistica_seguimiento_token = cLog.token_seguimiento_transito;
    this.logistica_seguimiento_folio = cLog.folio_seguimiento_transito;
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
