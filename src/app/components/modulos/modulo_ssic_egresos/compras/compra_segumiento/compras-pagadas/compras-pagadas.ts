import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app_interno_egresos_compras_pagadas',
  standalone: false,
  templateUrl: './compras-pagadas.html',
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
    './compras-pagadas.css'
  ]
})
export class ComprasPagadas implements OnInit, OnDestroy {
  //compras pagadas
  searchComprasPagadas:any = [];
  arrayComprasPagadas:any = [];
  indicadorComprasPagadas:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoComprasPagadas: Date[] | undefined;
  loading = false;
  private destruir$ = new Subject<void>();
  //informacion desglose de compra
  public ver_seccion_compra_desglose:boolean = false;
  public desglose_compra_folio:string = "";
  //informacion recepcion de compra
  public ver_seccion_compra_recepcion:boolean = false;
  //informacion pagos de compra
  public ver_seccion_compra_pagos:boolean = false;

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
    if (this.arrayComprasPagadas.length === 0) this.verComprasPagadas('hoy');
    this.searchComprasPagadas = ['token_compras','folio_compra','fecha_contabilizacion','proveedor_folio','proveedor_nombre','proveedor_nombre_comercial','compra_a_credito',
      'fecha_vencimiento','compra_moneda','compra_subtotal','compra_descuento','compra_retenciones','compra_traslados','importe_total_compra','aplica_recepcion_facturas',
      'recibeFactura','cfdi_comprobante_version','cfdi_comprobante_serie','cfdi_comprobante_folio','cfdi_comprobante_fecha','cfdi_comprobante_forma_de_pago','cfdi_comprobante_metodo_de_pago',
      'cfdi_comprobante_subtotal','cfdi_comprobante_moneda','cfdi_comprobante_tipo_de_cambio','cfdi_comprobante_total','cfdi_comprobante_confirmacion','cfdi_comprobante_tipo_de_comprobante',
      'cfdi_complementoFechaTimbrado','cfdi_complementoUUID','articulos_recibidos','total_articulos','lugarRecepcionTipo','lugarRecepcionTipo','lugarRecepcionDireccion','status_autorizacion',
      'existe_orden_recepcion','proveedor_token','bloqueo_orden_recepcion','uuid_orden_recepcion','folio_orden_pago','fecha_contabilizacion_orden_pago','pagos_realizados_fecha_contabilizacion',
      'pagos_realizados_fecha_contabilizacion','existe_orden_pago'];
  }
  
  listaComprasPagadas() {
    this.verComprasPagadas(this.indicadorComprasPagadas);
  }

  verComprasPagadas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorComprasPagadas = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;
    
    if (filtro == 'otras_fechas') {
      var buy_otras_fechas = document.getElementById("buy_otras_fechas");
      if (this.rangoPeriodoComprasPagadas && this.rangoPeriodoComprasPagadas.length === 2) {
        const dateInicio = this.rangoPeriodoComprasPagadas[0];
        const dateFin = this.rangoPeriodoComprasPagadas[1];
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
 
    this._comprServ.listaComprasPagadas(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.arrayComprasPagadas = response.compras;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayComprasPagadas = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.arrayComprasPagadas = [];
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
              this.listaComprasPagadas();
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
              this.listaComprasPagadas();
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
              this.listaComprasPagadas();
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
              this.listaComprasPagadas();
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
              this.listaComprasPagadas();
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

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}