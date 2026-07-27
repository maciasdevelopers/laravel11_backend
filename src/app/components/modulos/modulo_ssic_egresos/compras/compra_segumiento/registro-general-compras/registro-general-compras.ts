import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app_interno_egresos_registro_general_compras',
  standalone: false,
  templateUrl: './registro-general-compras.html',
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
    './registro-general-compras.css'
  ],
})
export class RegistroGeneralCompras implements OnInit, OnDestroy {
  //catalogo general de compras
  searchComprasGeneral:any = [];
  arrayComprasGeneral:any = [];
  indicadorComprasGeneral:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoCompras: Date[] | undefined;
  @ViewChild('gralBuyList') gralBuyList!: NgForm;
  loading = false;
  private destruir$ = new Subject<void>();
  //informacion desglose de compra
  public ver_seccion_compra_desglose:boolean = false;
  public desglose_compra_folio:string = "";
  //informacion recepcion de compra
  public ver_seccion_compra_recepcion:boolean = false;
  //informacion pagos de compra
  public ver_seccion_compra_pagos:boolean = false;
  //cancelación de compra
  public compra_window_cancelacion:boolean = false;
  public viewNewCancelacionForm:boolean = false;
  public cancelacion_compra_token: string = "";
  public cancelacion_compra_folio: string = "";
  public cancelacion_fecha_contabilizacion: string = "";
  public cancelacion_observaciones: string = "";

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
    this.lista_general_compras('hoy');
    this.getRespuestaRegistroBuy();
    this.getRespuestaComprasDescargaExcel();

    this.searchComprasGeneral = ['folio_compra','fecha_contabilizacion','proveedor_folio','proveedor_nombre','proveedor_nombre_comercial','compra_a_credito',
      'fecha_vencimiento','compra_moneda','compra_subtotal','compra_descuento','compra_retenciones','compra_traslados','importe_total_compra','aplica_recepcion_facturas',
      'recibeFactura','cfdi_comprobante_version','cfdi_comprobante_serie','cfdi_comprobante_folio','cfdi_comprobante_fecha','cfdi_comprobante_forma_de_pago','cfdi_comprobante_metodo_de_pago',
      'cfdi_comprobante_subtotal','cfdi_comprobante_moneda','cfdi_comprobante_tipo_de_cambio','cfdi_comprobante_total','cfdi_comprobante_confirmacion','cfdi_comprobante_tipo_de_comprobante',
      'cfdi_complementoFechaTimbrado','cfdi_complementoUUID','articulos_recibidos','total_articulos','lugarRecepcionTipo','lugarRecepcionTipo','lugarRecepcionDireccion','status_autorizacion',
      'existe_orden_recepcion','proveedor_token','bloqueo_orden_recepcion','uuid_orden_recepcion','folio_orden_pago','fecha_contabilizacion_orden_pago','pagos_realizados_fecha_contabilizacion',
      'pagos_realizados_fecha_contabilizacion','existe_orden_pago'];
  }

  getRespuestaRegistroBuy(){
    this.relInterna.mensajeCompraRegistro$.subscribe(
      (mensaje:any) => {
        if (mensaje == "nuevo_registro") {
          this.lista_general_compras('hoy');
        }
      }
    );
  }

  getRespuestaComprasDescargaExcel(){
    this.relInterna.mensajeCompraExcelDescarga$.subscribe(
      (mensaje:any) => {
        if (mensaje == "descarga_excel_buy") {
          this.descarga_excel_compras();
        }
      }
    );
  }

  cargar_lista_compras() {
    this.lista_general_compras(this.indicadorComprasGeneral);
  }

  lista_general_compras(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorComprasGeneral = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;
    
    if (filtro == 'otras_fechas') {
      var buy_otras_fechas = document.getElementById("buy_otras_fechas");
      if (this.rangoPeriodoCompras && this.rangoPeriodoCompras.length === 2) {
        const dateInicio = this.rangoPeriodoCompras[0];
        const dateFin = this.rangoPeriodoCompras[1];
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
 
    this._comprServ.listaGeneralCompras(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.arrayComprasGeneral = response.compras;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayComprasGeneral = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.arrayComprasGeneral = [];
  }

  descarga_excel_compras(){
    const columnas:ExcelColumnas[] = [
			{label: "folio de compra", field: "folio_compra", rowspan: 2, align: "left"},
			{label: this.translate.instant("fecha_cont"), field: "fecha_contabilizacion", rowspan: 2, align: "left"},
			{label: this.translate.instant("prov"), colspan: 3, align: "center",children:[
			  {label: "folio", field: "proveedor_folio", align: "left"},
			  {label: this.translate.instant("prov"), field: "proveedor_nombre", align: "left"},
			  {label: this.translate.instant("comercial_name"), field: "proveedor_nombre_comercial", align: "left"},
      ]},
			{label: "Compra a crédito", colspan: 2, align: "center",children:[
        {label: "Tipo", field: "compra_a_credito", align: "left"},
        {label: "Fecha de vencimiento", field: "fecha_vencimiento", align: "left"},
      ]},
			
      {label: this.translate.instant("currency"), field: "compra_moneda", rowspan: 2, align: "left"},
			{label: "Subtotal", field: "compra_subtotal", rowspan: 2, align: "right", translate: true},
			{label: "Descuento", field: "compra_descuento", rowspan: 2, align: "right"},
      {label: "Retenciones", field: "compra_retenciones", rowspan: 2, align: "right"},
			{label: "Traslados", field: "compra_traslados", rowspan: 2, align: "right", translate: true},
			{label: "Total", field: "importe_total_compra", rowspan: 2, align: "right"},
			
			{label: "Facturas (CFDI)", colspan: 16, align: "center",children:[
        {label: "Aplica recepción de facturas", field: "aplica_recepcion_facturas", align: "left"},
        {label: "recibió Factura", field: "recibeFactura", align: "left"},
        {label: "Versión", field: "cfdi_comprobante_version", align: "left"},
        {label: "Serie", field: "cfdi_comprobante_serie", align: "left"},
        {label: "Folio", field: "cfdi_comprobante_folio", align: "left"},
        {label: "Fecha", field: "cfdi_comprobante_fecha", align: "left"},
        {label: "f_pago", field: "cfdi_comprobante_forma_de_pago", align: "left"},
        {label: "m_pago", field: "cfdi_comprobante_metodo_de_pago", align: "left"},
        {label: "Subtotal", field: "cfdi_comprobante_subtotal", align: "right"},
        {label: "Moneda", field: "cfdi_comprobante_moneda", align: "left"},
        {label: "Tipo de cambio", field: "cfdi_comprobante_tipo_de_cambio", align: "right"},
        {label: "Total", field: "cfdi_comprobante_total", align: "right"},
        {label: "Confirmación", field: "cfdi_comprobante_confirmacion", align: "left"},
        {label: "Tipo de comprobante", field: "cfdi_comprobante_tipo_de_comprobante", align: "left"},
        {label: "Fecha de timbrado", field: "cfdi_complementoFechaTimbrado", align: "left"},
        {label: "UUID", field: "cfdi_complementoUUID", align: "left"},
      ]},
			
			{label: "Orden de recepción", colspan: 3, align: "center",children:[
        {label: "Articulos recibidos", field: "articulos_recibidos_comparativa", align: "left"},
        {label: "Lugar de recepción", field: "lugarRecepcionComplete", align: "left"},
        {label: "Orden de recepción", field: "folio_orden_recepcion", align: "left"},
      ]},
      
			{label: "Orden de pago", colspan: 2, align: "center",children:[
        {label: "Orden de pago", field: "orden_pago_complete", align: "left"},
        {label: "Pago realizado", field: "pagos_realizados_complete", align: "left"}
      ]},
    ];
    this.servXlsx.descarga_xlsx_documento(this.arrayComprasGeneral,columnas,'Compras','Registro general de compras realizadas.xlsx');
  }

  showCompraSeleccionadaDesglose(token_compras:any,folio_compra:any) {
    this.ver_seccion_compra_desglose = true;
    this.desglose_compra_folio = folio_compra;
    this.relInterna.mensajeComprasDesglose("ver_desglose_compra",token_compras);
  }

  //orden de recepción
  generar_orden_recepcion(token_compras:any,token_cat_proveedores:any){
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
        this._comprServ.registraOrdenRecepcionCompra(token_compras,token_cat_proveedores).subscribe(
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
              this.cargar_lista_compras();
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

  activar_orden_recepcion(token_compras:any,uuid_orden_recepcion:any){
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
        this._comprServ.activaOrdenRecepcionCompra(token_compras,uuid_orden_recepcion).subscribe(
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
              this.cargar_lista_compras();
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

  showCompraSeleccionadaSeguimientoOrdenRecepcion(token_compras:any,folio_compra:any) {
    this.ver_seccion_compra_recepcion = true;
    this.desglose_compra_folio = folio_compra;
    this.relInterna.mensajeComprasDesglose("ver_desglose_compra",token_compras);
  }

  //orden de pago
  generar_orden_pago(token_compras:any,token_cat_proveedores:any){
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
        this._comprServ.registraOrdenPagoCompra(token_compras,token_cat_proveedores).subscribe(
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
              this.cargar_lista_compras();
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

  activar_orden_pago(token_compras:any,token_orden_pago:any){
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
        this._comprServ.activaOrdenPagoCompra(token_compras,token_orden_pago).subscribe(
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
              this.cargar_lista_compras();
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

  showCompraSeleccionadaSeguimientoOrdenPago(token_compras:any,folio_compra:any) {
    this.ver_seccion_compra_pagos = true;
    this.desglose_compra_folio = folio_compra;
    this.relInterna.mensajeComprasDesglose("ver_desglose_compra",token_compras);
  }

  //autorizacion o cancelacion de compra
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
              this.cargar_lista_compras();
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

  compra_realizada_openform_cancelacion(cBuy: any) {
    this.compra_window_cancelacion = true;
    this.cancelacion_compra_token = cBuy.token_compras;
    this.cancelacion_compra_folio = cBuy.folio_compra;
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

  get validaRegSoliCancelBuy():Boolean{
    const OKFechaCont = this.cancelacion_fecha_contabilizacion != "" && this.validator.filtroFecha(this.cancelacion_fecha_contabilizacion);
    const OKObservaciones = this.cancelacion_observaciones != '' && this.validator.filtroAlfaNumerico(this.cancelacion_observaciones);

    return this.cancelacion_compra_token != '' && OKFechaCont && OKObservaciones;
  }

  compra_solicitar_cancelacion(form: { reset: () => void; }):void{
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
        this._comprServ.compmrasSolicitarCancelacion(this.cancelacion_compra_token,this.cancelacion_fecha_contabilizacion,this.cancelacion_observaciones).subscribe(
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
              this.compra_window_cancelacion = false;
              this.limpia_form_cancelacion();
              this.cargar_lista_compras();
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
