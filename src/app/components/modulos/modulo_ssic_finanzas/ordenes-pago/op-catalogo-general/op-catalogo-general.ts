import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { TranslateService } from '@ngx-translate/core';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fnzs_op_catalogo_general',
  standalone: false,
  templateUrl: './op-catalogo-general.html',
  //styleUrl: './op-catalogo-general.css'
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
    './op-catalogo-general.css',
  ]
})
export class OpCatalogoGeneral implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  searchPagoGeneral: any = [];
  ordenes_pago_general_list: any = [];
  indicadorOrdGral:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoGralOrd: Date[] | undefined;

  public factura_relacionada_token:string = '';
  public factura_relacionada_typo:string = '';

  public orden_pago_window_cancelacion:boolean = false;
  public viewNewCancelacionForm:boolean = false;
  public cancelacion_orden_pago_token: string = "";
  public cancelacion_orden_pago_folio: string = "";
  public cancelacion_fecha_contabilizacion: string = "";
  public cancelacion_observaciones: string = "";
  private destruir$ = new Subject<void>();

  constructor(
    private ordenPago: OrdenPagoService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private servXlsx: DescargaExcel,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef, 
    private primeAlerts: MessageService
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    if (this.ordenes_pago_general_list.length === 0) this.ver_ordenes_pago_general('hoy');
    this.getRespuestaAcreedoresMovimientos();
    this.getRespuestaOrdAuthChange();
    this.getRespuestaPagoRealizado();
    this.getRespuestaAnticipos();
    this.getRespuestaDeudoresMovimientos();
    this.searchPagoGeneral = ['folio_ordenPago', 'fecha_contabilizacion_orden_pago', 'factura_relacionada_string', 'orden_bloqueada', 'fecha_contabilizacion_doc_anterior', 'orden_emisor_personal_folio', 'orden_emisor_personal_nombre',
      'orden_emisor_personal_nombre_comercial', 'orden_emisor_emp', 'autorizacion_pay_text', 'fecha_autorizacion_pay', 'pago_anticipado', 'status_pago', 'status_pago_date', 'pago_realizado_folio', 'pago_realizado_fecha_contabilizacion',
      'pago_realizado_proveedor_name', 'pago_realizado_acreedor_name', 'pago_realizado_forma_pago_vinculada', 'pago_realizado_forma_metodo_pago_cfdi', 'pago_realizado_monto', 'pago_realizado_tipo_cambio', 'pago_realizado_observaciones',
      'importe_total_inicial', 'importe_autorizado_inicial_format', 'importe_autorizado_final', 'debe_format'];
  }

  getRespuestaOrdAuthChange() {
    this.relInterna.mensajeOrdAuthChange$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "orden_modificada_pend_auth" && this.ordenes_pago_general_list.length > 0) {
          this.lista_ordenes_pago_general();
        }
      }
    );
  }

  getRespuestaAnticipos() {
    this.relInterna.mensajeAnticipoDeudorInsert$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "anticipo_autorizado") {
          this.lista_ordenes_pago_general();
        }
      }
    );
  }

  getRespuestaPagoRealizado() {
    this.relInterna.mensajePagoRealizado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "pago_orden_general_realizado") {
          this.lista_ordenes_pago_general();
        }
      }
    );
  }

  getRespuestaAcreedoresMovimientos() {
    this.relInterna.mensajeAcreedorMovRegistrado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "acr_mov_registrado") {
          this.lista_ordenes_pago_general();
        }
      }
    );
  }

  getRespuestaDeudoresMovimientos() {
    this.relInterna.mensajeDeudorMovRegistrado$.pipe(takeUntil(this.destruir$)).subscribe(
      (mensaje: any) => {
        if (mensaje == "deu_mov_registrado") {
          this.lista_ordenes_pago_general();
        }
      }
    );
  }

  lista_ordenes_pago_general() {
    this.ver_ordenes_pago_general(this.indicadorOrdGral);
  }

  ver_ordenes_pago_general(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorOrdGral = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var pag_gen_otras_fechas = document.getElementById("pag_gen_otras_fechas");
      if (this.rangoPeriodoGralOrd && this.rangoPeriodoGralOrd.length === 2) {
        const dateInicio = this.rangoPeriodoGralOrd[0];
        const dateFin = this.rangoPeriodoGralOrd[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(pag_gen_otras_fechas);
          } else {
            this.validator.errorInputRow(pag_gen_otras_fechas);
            return;
          }
        } else {
          this.validator.correctoInputRow(pag_gen_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(pag_gen_otras_fechas);
        return;
      }
    }
    
    this.ordenPago.listageneralordenespago(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaGeneral(response),
      error: (err) => this.manejarErrorGeneral(err)
    });
  }

  private procesarRespuestaGeneral(response: any) {
    if (response.status === 'success') {
      console.log(response);
      this.ordenes_pago_general_list = response.ordenes.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.ordenes_pago_general_list = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorGeneral(error: any) {
    console.error('Error al cargar la lista general de ordenes de pago:', error);
    this.ordenes_pago_general_list = [];
  }

  desglose_facturaSeleccionada(lPay: any): void {
    this.factura_relacionada_token = lPay.factura_relacionada_token;
    this.factura_relacionada_typo = lPay.factura_relacionada_typo;
  }

  ver_factura_seleccionada(lPay:any):String {
    var href_doc = '';
    switch (lPay.factura_relacionada_typo) {
      case 'compras':
        href_doc = 'https://downloads.sos-mexico.com.mx/compras_pdf/'+lPay.factura_relacionada_token;
        break;
      case 'ventas':
        href_doc = 'https://downloads.sos-mexico.com.mx/ventas_pdf/'+lPay.factura_relacionada_token;
        break;
      case 'reembolsos':
        href_doc = 'https://downloads.sos-mexico.com.mx/reembolso_pdf/'+lPay.factura_relacionada_token;
        break;
    
      default:
        break;
    }
    return href_doc;
  }

  auth_rechaz_ord_pago(token_ordenPago: any) {
    const ordp = this.ordenes_pago_general_list.find((ordp: any) => ordp.token_ordenPago === token_ordenPago);
    const class_disabled = ordp.orden_bloqueada || ordp.status_pago ? 'disabled' : '';
    return !ordp.autorizacion_pay ? class_disabled + ' text-bg-success' : class_disabled + ' text-bg-danger';
  }

  descarga_excel_lgeneral() {
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "folio_ordenPago", rowspan: 2, align: "center" },
      { label: this.translate.instant("fecha_cont_pay_order"), field: "fecha_contabilizacion_orden_pago", rowspan: 2, align: "center" },
      { label: this.translate.instant("doc_ant"), field: "factura_relacionada_string", rowspan: 2, align: "left" },
      { label: this.translate.instant("fecha_cont_doc_ant"), field: "fecha_contabilizacion_doc_anterior", rowspan: 2, align: "center" },
      {
        label: this.translate.instant("ter_cero"), colspan: 3, align: "center", children: [
          { label: "folio", field: "orden_emisor_personal_folio", align: "left" },
          { label: this.translate.instant("name"), field: "orden_emisor_personal_nombre", align: "left" },
          { label: this.translate.instant("comercial_name"), field: "orden_emisor_personal_nombre_comercial", align: "left" },
        ]
      },

      { label: this.translate.instant("company_name"), field: "orden_emisor_emp", rowspan: 2, align: "left" },
      { label: this.translate.instant("autho_riza"), field: "autorizacion_pay_translate", rowspan: 2, align: "center", translate: true },
      { label: this.translate.instant("date_autho_riza"), field: "fecha_autorizacion_pay", rowspan: 2, align: "center" },

      {
        label: this.translate.instant("payed"), colspan: 11, align: "center", children: [
          { label: this.translate.instant("prepayment"), field: "pago_anticipado", align: "right" },
          { label: "status de pago", field: "status_pago_date", align: "center" },
          { label: "folio", field: "pago_realizado_folio", align: "center" },
          { label: this.translate.instant("fecha_cont"), field: "pago_realizado_fecha_contabilizacion", align: "center" },
          { label: this.translate.instant("prov"), field: "pago_realizado_proveedor_name", align: "left" },
          { label: this.translate.instant("acree_name"), field: "pago_realizado_acreedor_name", align: "left" },
          { label: this.translate.instant("f_pago"), field: "pago_realizado_forma_pago_vinculada", align: "left" },
          { label: this.translate.instant("f_m_pago_cfdi"), field: "pago_realizado_forma_metodo_pago_cfdi", align: "left" },
          { label: this.translate.instant("total_import"), field: "pago_realizado_monto", align: "right" },
          { label: this.translate.instant("mon_tipo_cambio"), field: "pago_realizado_tipo_cambio", align: "right" },
          { label: this.translate.instant("observ"), field: "pago_realizado_observaciones", align: "left" },
        ]
      },

      { label: this.translate.instant("total_refund"), field: "importe_total_inicial", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth"), field: "importe_autorizado_inicial_format", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth_converse"), field: "importe_autorizado_final", rowspan: 2, align: "right" },
      { label: "DEBE", field: "debe_format", rowspan: 2, align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(this.ordenes_pago_general_list, columnas, 'Ordenes de pago', 'orden_pago_lista_general.xlsx');
  }

  autorizar_orden_pago(pago_ord_item: any) {
    //pago_ord_item.token_ordenPago,pago_ord_item.status_pago
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
        if (!pago_ord_item.status_pago) {
          this.ordenPago.autorizar_ordenpago(pago_ord_item.token_ordenPago).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.relInterna.mensajeOrdAuthChange("orden_modificada_main_auth");
                this.recarga_orden_pago(pago_ord_item);
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

  desautorizar_orden_pago(pago_ord_item: any) {
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
        this.ordenPago.desautorizar_ordenespago(pago_ord_item.token_ordenPago).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.recarga_orden_pago(pago_ord_item);
              this.relInterna.mensajeOrdAuthChange("orden_modificada_main_auth");
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

  recarga_orden_pago(pago_ord_item:any) {
    this.ordenPago.actualizar_orden_pago(pago_ord_item.token_ordenPago).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log(response);

          pago_ord_item.autorizacion_pay = response.autorizacion_pay;
          pago_ord_item.autorizacion_pay_translate = response.autorizacion_pay_translate;
          //pago_ord_item.autorizacion_pay_text = response.autorizacion_pay_text;
          pago_ord_item.fecha_autorizacion_pay = response.fecha_autorizacion_pay;

          pago_ord_item.autorizacion_pay_text = response.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth');
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

  recarga_orden_p_ago(pago_ord_item:any) {
    console.log(pago_ord_item);
    const ordpIndex = this.ordenes_pago_general_list.findIndex((row:any) => row.token_ordenPago === pago_ord_item.token_ordenPago);
    if (ordpIndex === -1) return; // Si no lo encuentra, no hace nada

    this.ordenPago.actualizar_orden_pago(pago_ord_item.token_ordenPago).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log(response);
          const ordenNewData = response.orden_de_pago.map((lPay: any) => ({ ...lPay, autorizacion_pay_text: lPay.autorizacion_pay ? this.translate.instant('yes_auth') : this.translate.instant('not_auth') }));

          if (ordenNewData) {
            // Actualizamos de manera reactiva reemplazando el elemento en su respectivo índice
            this.ordenes_pago_general_list[ordpIndex] = ordenNewData;
            // Forzamos un nuevo path de referencia para que p-table detecte el cambio instantáneamente
            this.ordenes_pago_general_list = [...this.ordenes_pago_general_list];
            this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
          }
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

  orden_pago_solicitar_cancelacion(lPay: any) {
    this.orden_pago_window_cancelacion = true;
    this.cancelacion_orden_pago_token = lPay.token_ordenPago;
    this.cancelacion_orden_pago_folio = lPay.folio_ordenPago;
    this.limpia_form_cancelacion();
  }

  limpia_form_cancelacion() {
    this.viewNewCancelacionForm = true;
    this.cancelacion_fecha_contabilizacion = "";
    this.cancelacion_observaciones = "";
  }

  cancel_fecha_contabilizacion(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.cancelacion_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cancelacion_fecha_contabilizacion);
  }

  keyupObservacionCancelacion(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cancelacion_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaRegistroCancelacionPago():Boolean{
    const OKFechaCont = this.cancelacion_fecha_contabilizacion != "" && this.validator.filtroFecha(this.cancelacion_fecha_contabilizacion);
    const OKObservaciones = this.cancelacion_observaciones != '' && this.validator.filtroAlfaNumerico(this.cancelacion_observaciones);
    return this.cancelacion_orden_pago_token != '' && OKFechaCont && OKObservaciones;
  }

  orden_pago_enviar_solicitud_cancelacion(form: { reset: () => void; }):void{
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
        this.viewNewCancelacionForm = false;
        this.ordenPago.ordenPagoSolicitarCancelacion(this.cancelacion_orden_pago_token,this.cancelacion_fecha_contabilizacion,this.cancelacion_observaciones).subscribe(
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
              this.orden_pago_window_cancelacion = false;
              this.limpia_form_cancelacion();
              this.lista_ordenes_pago_general();
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

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
