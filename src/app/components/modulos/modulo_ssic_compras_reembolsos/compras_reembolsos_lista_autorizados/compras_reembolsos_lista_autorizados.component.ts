import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { SSICReembolsosService } from "../../../../servicios/ssic/ssic_reembolsos.service";
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { Subject, takeUntil } from 'rxjs';
import '../../../../../assets/js/zxcvbn.js';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { ComunicacionInternaService } from "../../../../servicios/comunicacion-interna.service.js";
import { Usuarios } from "../../../../modelos/Usuarios.js";
import { UsuariosService } from "../../../../servicios/serv_user.service";
import { SessionContextService } from "../../../../servicios/session-context";

@Component({
  selector: 'app_compras_egr_reembolsos_lista_autorizados',
  templateUrl: './compras_reembolsos_lista_autorizados.component.html',
  standalone: false,
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/totales.css',
    '../../../../styles/explain.css',
    '../../modulo_ssic_egresos/egresos.css',
    './compras_reembolsos_lista_autorizados.component.css',
  ]
})
export class EgresosReembolsosAutorizadosComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  reem_auth_search: any = [];

  reembolsos_list_autorizados: any = [];
  indicadorReemList:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoReemList: Date[] | undefined;

  expandedRowsReembolsosAuthReem: { [s: string]: boolean } = {};
  public folio_reembolso_main: string = "";
  public folio_reembolso_solicitud: string = "";
  reembolsoPerfilDocumentosAdjuntos: any = [];
  viewModalDocumentosAdjuntos:boolean = false;
  reembolsoPerfilCompraVinculacion: any = [];
  viewModalCompraVinculacion:boolean = false;
  reembolsoPerfilAutorizaciones: any = [];
  viewModalListadoDeAutorizaciones:boolean = false;

  public eegr_privilegio_consulta: boolean = false;
  public eegr_privilegio_crear: boolean = false;
  public eegr_privilegio_editar: boolean = false;
  public eegr_privilegio_elimina: boolean = false;
  public eegr_privilegio_ver_docs: boolean = false;

  reem_soli_compras_vincular: any = [];
  public search_compras_vincular_cfdi: any = [];
  indicadorBuyVinc:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoBuyVinc: Date[] | undefined;

  private destruir$ = new Subject<void>();

  constructor(
    public reem_serv: SSICReembolsosService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private relInterna: ComunicacionInternaService,
    private sessionContext: SessionContextService,
    private userServ: UsuariosService,
    private sentinela: SentinelArkManager,
    private cd: ChangeDetectorRef
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
  }

  ngOnInit(): void {
    this.getRespuestaComiReemSeccionModule();
    this.getRespuestaReembolsosTerminados();
    this.ver_permisos_para_egresos();
    this.reem_auth_search = ['folio_reem', 'folio_solicitud', 'comision_folio', 'comision_proyecto', 'nombreEmiPers', 'company', 'fecha_gasto_html', 'ticket_gasto', 'pagado_a',
      'prov_folio', 'prov_name', 'prov_nombre_comercial', 'prov_rfc', 'fpago_clave', 'fpago_forma', 'moneda_code', 'importe_requ_info_entr_format', 'tipo_cambio_soli_format',
      'importe_requ_info_sali_format', 'observaciones', 'token_solicitud_reem', 'terminado', 'autorizacion_vh', 'fecha_registro_auth_vh', 'max_auth_egr', 'fecha_registro_auth_egr',
      'hora_registro_auth_egr'];

    this.search_compras_vincular_cfdi = ['folio_compra', 'fecha_contabilizacion', 'proveedor_folio', 'proveedor_name', 'cfdi_comprobante_total',
      'cfdi_comprobante_tipo_de_comprobante', 'cfdi_complementoUUID', 'compra_observaciones', 'token_compras'];
  }

  getRespuestaComiReemSeccionModule() {
    this.relInterna.mensajeComiReemSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_comi_reem_autorizados") {
          console.log(mensaje);
          if (this.reembolsos_list_autorizados.length === 0) this.reembolsos_lista_terminados('hoy');
        }
      }
    );
  }

  getRespuestaReembolsosTerminados() {
    this.relInterna.mensajeEgresosReembolsoAutorizado$.subscribe(
      (mensaje: any) => {
        if (mensaje == "reembolso_autorizado") {
          this.reembolsos_lista_terminados(this.indicadorReemList);
        }
      }
    );
  }

  ver_permisos_para_egresos() {
    console.log(this.identidad);
    const permiso_ver_docs = this.sessionContext.privilegio_ver_docs;
    console.log(permiso_ver_docs);
    const conf_egresos = this.sessionContext.empresa_data?.conf_egresos;
    conf_egresos.forEach((eegr: any) => {
      this.eegr_privilegio_ver_docs = permiso_ver_docs && eegr.bool_eegr_perm_ver_docs ? true : false;
    });
  }

  recargar_lista_reembolsos() {
    this.reembolsos_lista_terminados(this.indicadorReemList);
  }

  reembolsos_lista_terminados(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorReemList = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var reem_auth_otras_fechas = document.getElementById("reem_auth_otras_fechas");
      if (this.rangoPeriodoReemList && this.rangoPeriodoReemList.length === 2) {
        const dateInicio = this.rangoPeriodoReemList[0];
        const dateFin = this.rangoPeriodoReemList[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(reem_auth_otras_fechas);
          } else {
            this.validator.errorInputRow(reem_auth_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(reem_auth_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(reem_auth_otras_fechas);
        return;
      }
    }

    this.reem_serv.list_reembolsos_egr_concluidos(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaReem(response),
      error: (err) => this.manejarErrorReem(err)
    });
  }

  private procesarRespuestaReem(response: any) {
    if (response.status === 'success') {
      this.reembolsos_list_autorizados = response.reem_lista_autorizados;
      this.cd.detectChanges();
    } else {
      this.reembolsos_list_autorizados = [];
    }
  }

  private manejarErrorReem(error: any) {
    console.error('Error al cargar la lista de reembolsos:', error);
    this.reembolsos_list_autorizados = [];
  }

  verDocumentosAdjuntos(lreem: any) {
    this.reembolsoPerfilDocumentosAdjuntos = [];
    this.reembolsoPerfilDocumentosAdjuntos.push(lreem);
    this.folio_reembolso_main = lreem.folio_reem;
    this.folio_reembolso_solicitud = lreem.folio_solicitud;
    this.viewModalDocumentosAdjuntos = true;
  }

  alertaViewDocs() {
    Swal.fire({
      timer: 3000,
      position: "top-end",
      icon: "info",
      title: this.translate.instant("perm_vdfiles"),
      text: this.translate.instant("perm_denied"),
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("perm_solicita"),
      showCancelButton: true,
      cancelButtonText: this.translate.instant("swal_cancel"),
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        const empresaToken = this.sessionContext.empresa_data?.empresa_token;
        this.userServ.user_solicitar_permiso_ver_docs(empresaToken, this.identidad.user_token, "eegr").subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  viewDocumentoBrowser(url_doc: any) {
    this.eegr_privilegio_ver_docs ? window.open(url_doc, '_blank') : this.alertaViewDocs();
  }

  disabled_autorizados_btn_auth_vinc(token_solicitud_reem: any) {
    const reem_soli = this.reembolsos_list_autorizados.find((reem: any) => reem.token_solicitud_reem === token_solicitud_reem);
    const condicion = !reem_soli.terminado && reem_soli.max_auth_egr && reem_soli.autorizacion_egr && reem_soli.autorizacion_vh != 'D';
    return condicion;
  }

  /*abreModalReemComprasVincular(lreem: any) {
    this.reembolsoPerfilCompraVinculacion = [];
    this.reem_serv.list_reembolsos_compras_para_vincular(lreem.token_solicitud_reem,lreem.token_reem,'hoy','','').pipe(takeUntil(this.destruir$)).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.reembolsoPerfilCompraVinculacion.push(lreem);
          this.reembolsoPerfilCompraVinculacion.compras_vincular = response.compras_vincular;
          console.log(this.reembolsoPerfilCompraVinculacion);
          this.reem_soli_compras_vincular = response.compras_vincular;
          this.folio_reembolso_main = lreem.folio_reem;
          this.folio_reembolso_solicitud = lreem.folio_solicitud;
          this.viewModalCompraVinculacion = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }*/

  abreModalReemComprasVincular(lreem: any) {
    this.reembolsoPerfilCompraVinculacion = [];
    this.reembolsoPerfilCompraVinculacion.push(lreem);
    console.log(this.reembolsoPerfilCompraVinculacion);
    this.folio_reembolso_main = lreem.folio_reem;
    this.folio_reembolso_solicitud = lreem.folio_solicitud;
    this.viewModalCompraVinculacion = true;
    this.ver_solicitudes_cancelacion(lreem,'hoy');
  }

  ver_solicitudes_cancelacion(lreem: any,filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorBuyVinc = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var reem_auth_buy_vinc_otras_fechas = document.getElementById("reem_auth_buy_vinc_otras_fechas");
      if (this.rangoPeriodoBuyVinc && this.rangoPeriodoBuyVinc.length === 2) {
        const dateInicio = this.rangoPeriodoBuyVinc[0];
        const dateFin = this.rangoPeriodoBuyVinc[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(reem_auth_buy_vinc_otras_fechas);
          } else {
            this.validator.errorInputRow(reem_auth_buy_vinc_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(reem_auth_buy_vinc_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(reem_auth_buy_vinc_otras_fechas);
        return;
      }
    }

    this.reem_serv.list_reembolsos_compras_para_vincular(
      lreem.token_solicitud_reem,
      lreem.token_reem,
      filtro,
      periodo_inicio, 
      periodo_fin
    ).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaSoliCan(response),
      error: (err) => this.manejarErrorSoliCan(err)
    });
  }

  private procesarRespuestaSoliCan(response: any) {
    if (response.status === 'success') {
      this.reem_soli_compras_vincular = response.compras_vincular;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.reem_soli_compras_vincular = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorSoliCan(error: any) {
    console.error('Error al cargar la lista solicitudes de cancelación:', error);
    this.reem_soli_compras_vincular = [];
  }

  keyupObservaReemComprasUNVincular(event: any, token_solicitud_reem: any) {
    const canc_soli = this.reembolsos_list_autorizados.find((reem: any) => reem.token_solicitud_reem === token_solicitud_reem);
    const validacion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    canc_soli.soli_cancela_vinc_comentarios = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(canc_soli.soli_cancela_vinc_comentarios);
  }

  solicitaDesvuinculacionReembolso(reem: any, token_compras: any) {
    //token_solicitud_reem: any, token_compras: any, soli_cancela_vinc_comentarios: any 
    //byid.token_solicitud_reem,byid.compras_vinculadas[0]['token_compras'],byid.soli_cancela_vinc_comentarios)
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonText: this.translate.instant("swal_cancel"),
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reem_serv.reembolso_cancela_vinc_compras(reem.token_reem,reem.token_solicitud_reem,token_compras,reem.soli_cancela_vinc_comentarios).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.relInterna.mensajeEgresosReembolsosListaGeneral("reembolso_compra_movimiento");
              this.recargar_lista_reembolsos();
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == 'error') {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    })
  }

  verHistorial(token_solicitud_reem: any) {
    const soli_cfdi = this.reembolsos_list_autorizados.find((row: any) => row.token_solicitud_reem === token_solicitud_reem);
    soli_cfdi.viewModalListadoDeAutorizaciones = true;
  }

  input_observaciones_c_vincular(event: any, token_compras: any) {
    const compra = this.reem_soli_compras_vincular.find((buy: any) => buy.token_compras === token_compras);
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof compra !== 'undefined';
    compra.compra_observaciones = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  vincularReembolsoACompraYPagarAAcreedor(token_reem: any, token_solicitud_reem: any, token_compras: any, observaciones: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonText: this.translate.instant("swal_cancel"),
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        const compra = this.reem_soli_compras_vincular.find((buy: any) => buy.token_compras === token_compras);
        this.reem_serv.reembolso_egr_auth_pagar_a_acreedor(token_reem, token_solicitud_reem, token_compras, compra.fecha_contabilizacion_html, observaciones).subscribe(
          response => {
            if (response.status == 'success') {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.relInterna.mensajeEgresosReembolsosListaGeneral("reembolso_compra_movimiento");
                this.recargar_lista_reembolsos();
                setTimeout(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
              }
              if (response.status == 'error') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    })
  }
}
