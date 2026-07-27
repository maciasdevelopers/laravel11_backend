import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import Swal from 'sweetalert2';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { MessageService } from 'primeng/api';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'fnzs_dispersion_nominas_general',
  standalone: false,
  templateUrl: './dispersion-nominas-general.html',
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
    './dispersion-nominas-general.css',
  ]
})
export class DispersionNominasGeneral implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;

  searchPagoGeneral: any = [];
  ordenes_disper_general: any = [];
  indicadorDisperNomOrdGral: 'hoy' | 'esta_semana' | 'este_mes' | 'mes_anterior' | 'otras_fechas' | 'all_partidas' = 'hoy';
  rangoPeriodoNomGralOrd: Date[] | undefined;

  public orden_dispers_efectivo_window_cancelacion:boolean = false;
  public viewNewCancelacionDispersEfectivoForm:boolean = false;
  public cancelacion_orden_dispers_efectivo_token: string = "";
  public cancelacion_orden_dispers_efectivo_folio: string = "";
  public cancelacion_dispers_efectivo_fecha_contabilizacion: string = "";
  public cancelacion_dispers_efectivo_observaciones: string = "";

  public orden_dispers_especie_window_cancelacion:boolean = false;
  public viewNewCancelacionDispersEspecieForm:boolean = false;
  public cancelacion_orden_dispers_especie_token: string = "";
  public cancelacion_orden_dispers_especie_folio: string = "";
  public cancelacion_dispers_especie_fecha_contabilizacion: string = "";
  public cancelacion_dispers_especie_observaciones: string = "";

  public factura_relacionada_token:string = '';
  public factura_relacionada_typo:string = '';

  private destruir$ = new Subject<void>();

  constructor(
    private ordenDisper: NominaDispersionService,
    private ordenPago: OrdenPagoService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private servXlsx: DescargaExcel,
    private cd: ChangeDetectorRef,
    private relInterna: ComunicacionInternaService,
    private primeAlerts: MessageService
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.getRespuestaOrdAuthChange();
    this.searchPagoGeneral = ['folio_ordenPago', 'fecha_contabilizacion_orden_pago', 'factura_relacionada_string', 'orden_bloqueada', 'fecha_contabilizacion_doc_anterior', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'orden_emisor_emp', 'autorizacion_pay_text', 'fecha_autorizacion_pay', 'pago_anticipado', 'status_pago', 'status_pago_date', 'pago_realizado_folio', 'pago_realizado_fecha_contabilizacion',
      'pago_realizado_proveedor_name', 'pago_realizado_acreedor_name', 'pago_realizado_forma_pago_vinculada', 'pago_realizado_forma_metodo_pago_cfdi', 'pago_realizado_monto', 'pago_realizado_tipo_cambio', 'pago_realizado_observaciones',
      'importe_total_inicial', 'importe_autorizado_inicial_format', 'importe_autorizado_final', 'debe_format'];

    this.ver_ord_gral_dispersion('hoy');
  }

  getRespuestaOrdAuthChange() {
    this.relInterna.mensajeOrdAuthChange$.subscribe(
      (mensaje: any) => {
        if (mensaje == "orden_dispersion_modificada_pend_auth" && this.ordenes_disper_general.length > 0) {
          this.lista_gral_dispersion();
        }
      }
    );
  }

  lista_gral_dispersion() {
    this.ver_ord_gral_dispersion(this.indicadorDisperNomOrdGral);
  }

  ver_ord_gral_dispersion(filtro: 'hoy' | 'esta_semana' | 'este_mes' | 'mes_anterior' | 'otras_fechas' | 'all_partidas') {
    this.indicadorDisperNomOrdGral = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var disper_otras_fechas = document.getElementById("disper_otras_fechas");
      if (this.rangoPeriodoNomGralOrd && this.rangoPeriodoNomGralOrd.length === 2) {
        const dateInicio = this.rangoPeriodoNomGralOrd[0];
        const dateFin = this.rangoPeriodoNomGralOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(disper_otras_fechas);
          } else {
            this.validator.errorInputRow(disper_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(disper_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(disper_otras_fechas);
        return;
      }
    }

    this.ordenDisper.lista_general_ordenes_dispersion(filtro, periodo_inicio, periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaGralDispersion(response),
      error: (err) => this.manejarErrorGralDispersion(err)
    });
  }

  private procesarRespuestaGralDispersion(response: any) {
    if (response.status === 'success') {
      this.ordenes_disper_general = response.ordenes;//.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      console.log(this.ordenes_disper_general);
      this.cd.detectChanges();
    } else {
      this.ordenes_disper_general = [];
    }
  }

  private manejarErrorGralDispersion(error: any) {
    console.error('Error al cargar la lista de ordenes de dispersión de nómina:', error);
    this.ordenes_disper_general = [];
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }

  auth_rechaz_ord_pago(token_ordenPago: any) {
    const ordp = this.ordenes_disper_general.find((ordp: any) => ordp.token_ordenPago === token_ordenPago);
    const class_disabled = ordp.orden_bloqueada || ordp.status_pago ? 'disabled' : '';
    return !ordp.autorizacion_pay ? class_disabled + ' text-bg-success' : class_disabled + ' text-bg-danger';
  }

  autorizar_orden_pago(disp_ord_item: any) {
    //disp_ord_item.token_ordenPago,disp_ord_item.status_pago
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (!disp_ord_item.status_pago) {
          this.ordenPago.autorizar_ordenpago(disp_ord_item.token_ordenPago).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                //this.lista_gral_dispersion();
                this.relInterna.mensajeOrdAuthChange("orden_dispersion_modificada_main_auth");
                this.recarga_orden_pago(disp_ord_item);
                //this.recargar_lista_dispersion_pend();
                //this.recargar_lista_dispersion_liberadas();
                //this.recargar_lista_dispersion_concluidas();
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
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
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "orden de pago concluida",
            showConfirmButton: false,
            timer: 3000
          })
        }
      }
    })
  }

  desautorizar_orden_pago(disp_ord_item: any) {
    //disp_ord_item.token_ordenPago,disp_ord_item.status_pago
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea desautorizar esta orden de pago?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("desauth"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenPago.desautorizar_ordenespago(disp_ord_item.token_ordenPago).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              //this.lista_gral_dispersion();
              this.relInterna.mensajeOrdAuthChange("orden_dispersion_modificada_main_auth");
              this.recarga_orden_pago(disp_ord_item);
              //this.recargar_lista_dispersion_pend();
              //this.recargar_lista_dispersion_liberadas();
              //this.recargar_lista_dispersion_concluidas();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
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

  recarga_orden_pago(disp_ord_item:any) {
    this.ordenPago.actualizar_orden_pago(disp_ord_item.token_ordenPago).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log(response);

          disp_ord_item.autorizacion_pay = response.autorizacion_pay;
          disp_ord_item.autorizacion_pay_translate = response.autorizacion_pay_translate;
          //disp_ord_item.autorizacion_pay_text = response.autorizacion_pay_text;
          disp_ord_item.fecha_autorizacion_pay = response.fecha_autorizacion_pay;

          disp_ord_item.autorizacion_pay_text = response.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth');
          this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
        } else {
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Los datos de la orden de pago no han sido actualizados' });
        }
      },
      error: (err) => {
        console.error('Error al cargar la lista general de ordenes de pago:', err);
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: 'Error al cargar la lista general de ordenes de pago' });
      }
    });
  }

  //efectivo
  orden_dispersion_efectivo_realizado_openform_cancelacion(lPay: any) {
    this.orden_dispers_efectivo_window_cancelacion = true;
    this.cancelacion_orden_dispers_efectivo_token = lPay.token_ordenPago;
    this.cancelacion_orden_dispers_efectivo_folio = lPay.folio_ordenPago;
    this.limpia_form_cancelacion_efectivo();
  }

  limpia_form_cancelacion_efectivo() {
    this.viewNewCancelacionDispersEfectivoForm = true;
    this.cancelacion_dispers_efectivo_fecha_contabilizacion = "";
    this.cancelacion_dispers_efectivo_observaciones = "";
  }

  cancel_fecha_contabilizacion_efectivo(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.cancelacion_dispers_efectivo_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cancelacion_dispers_efectivo_fecha_contabilizacion);
  }

  keyupObservacionCancelacion_efectivo(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cancelacion_dispers_efectivo_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaRegistroCancelacionDispersionEfectivo():Boolean{
    const OKFechaCont = this.cancelacion_dispers_efectivo_fecha_contabilizacion != "" && this.validator.filtroFecha(this.cancelacion_dispers_efectivo_fecha_contabilizacion);
    const OKObservaciones = this.cancelacion_dispers_efectivo_observaciones != '' && this.validator.filtroAlfaNumerico(this.cancelacion_dispers_efectivo_observaciones);

    return this.cancelacion_orden_dispers_efectivo_token != '' && OKFechaCont && OKObservaciones;
  }

  orden_dispersion_efectivo_solicitar_cancelacion(form: { reset: () => void; }):void{
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.viewNewCancelacionDispersEfectivoForm = false;
        this.ordenDisper.ordenDispersionEfectivoSolicitarCancelacion(this.cancelacion_orden_dispers_efectivo_token,this.cancelacion_dispers_efectivo_fecha_contabilizacion,this.cancelacion_dispers_efectivo_observaciones).subscribe(
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
              form.reset();
              this.orden_dispers_efectivo_window_cancelacion = false;
              this.limpia_form_cancelacion_efectivo();
              this.lista_gral_dispersion();
              this.relInterna.mensajeFNZSSoliCancelacion("seccion_fnzs_soli_cancelacion");
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
          error => { console.log(error); }
        );
      }
    });
  }

  //especie
  orden_dispersion_especie_realizado_openform_cancelacion(lPay: any) {
    this.orden_dispers_especie_window_cancelacion = true;
    this.cancelacion_orden_dispers_especie_token = lPay.token_ordenPago;
    this.cancelacion_orden_dispers_especie_folio = lPay.folio_ordenPago;
    this.limpia_form_cancelacion_especie();
  }

  limpia_form_cancelacion_especie() {
    this.viewNewCancelacionDispersEspecieForm = true;
    this.cancelacion_dispers_especie_fecha_contabilizacion = "";
    this.cancelacion_dispers_especie_observaciones = "";
  }

  cancel_fecha_contabilizacion_especie(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.cancelacion_dispers_especie_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cancelacion_dispers_especie_fecha_contabilizacion);
  }

  keyupObservacionCancelacion_especie(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cancelacion_dispers_especie_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaRegistroCancelacionDispersionEspecie():Boolean{
    const OKFechaCont = this.cancelacion_dispers_especie_fecha_contabilizacion != "" && this.validator.filtroFecha(this.cancelacion_dispers_especie_fecha_contabilizacion);
    const OKObservaciones = this.cancelacion_dispers_especie_observaciones != '' && this.validator.filtroAlfaNumerico(this.cancelacion_dispers_especie_observaciones);

    return this.cancelacion_orden_dispers_especie_token != '' && OKFechaCont && OKObservaciones;
  }

  orden_dispersion_especie_solicitar_cancelacion(form: { reset: () => void; }):void{
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.viewNewCancelacionDispersEspecieForm = false;
        this.ordenDisper.ordenDispersionEspecieSolicitarCancelacion(this.cancelacion_orden_dispers_especie_token,this.cancelacion_dispers_especie_fecha_contabilizacion,this.cancelacion_dispers_especie_observaciones).subscribe(
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
              form.reset();
              this.orden_dispers_especie_window_cancelacion = false;
              this.limpia_form_cancelacion_especie();
              this.lista_gral_dispersion();
              this.relInterna.mensajeFNZSSoliCancelacion("seccion_fnzs_soli_cancelacion");
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
          error => { console.log(error); }
        );
      }
    });
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
