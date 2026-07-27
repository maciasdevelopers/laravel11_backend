import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { OrdenPagoService } from '../../../../../servicios/ssic/orden-pago.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'fnzs_solicitud_cancelacion_pago',
  standalone: false,
  templateUrl: './soli-cancelacion-pago.html',
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
    './soli-cancelacion-pago.css',
  ]
})
export class SoliCancelacionPago implements OnInit{
  public dataSoliCancelacionPago:any = [];
  desglose_solicitud_cancelacion:any = [];
  desglose_solicitud_cancel_pago:any = [];
  desglose_solicitud_cancel_mov_acreedor:any = [];
  desglose_solicitud_cancel_activ_movim:any = [];

  constructor(
    private ordenPago: OrdenPagoService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef) {
  }

  @Input() set SoliCancelacion(value: string) {
    if (value) {
      this.dataSoliCancelacionPago = value;
      this.solicitud_de_cancelacion_pago(this.dataSoliCancelacionPago);
    }
  }

  ngOnInit(): void {
    // Al arrancar, inicializamos el formulario con el primer camión obligatorio
    //this.anadirTransporte();
  }

  solicitud_de_cancelacion_pago(canc_soli: any) {
    this.desglose_solicitud_cancelacion = [];
    this.ordenPago.solicitud_cancelacion_pago(canc_soli.cancel_soli_token,canc_soli.doc_anterior_token).subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.desglose_solicitud_cancelacion.push(canc_soli);
          
          this.desglose_solicitud_cancel_pago = response.pagos_realizados;
          this.desglose_solicitud_cancel_mov_acreedor = response.info_compras;
          this.desglose_solicitud_cancel_activ_movim = response.info_orden_pago;
        } else {
          let translate_response = this.translate.instant(response.message);
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

  confirmaCancelacionFechaCont(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    canc_comfirm.f_contab_confirma_cancelacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  confirmaCancelacionObserva(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    canc_comfirm.comentarios_confirma_cancelacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(canc_comfirm.comentarios_confirma_cancelacion);
    console.log("this.desglose_solicitud_cancelacion " + this.desglose_solicitud_cancelacion);
  }

  confirmaCancelPago(cancel_soli_token: any, f_contabilizacion: any, comentarios_confirma_cancelacion: any) {
    console.log(this.desglose_solicitud_cancel_pago);
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
        this.ordenPago.confirma_cancelacion_pago(cancel_soli_token, f_contabilizacion, comentarios_confirma_cancelacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              //this.lista_solicitudes_cancelacion();
              this.solicitud_de_cancelacion_pago(this.dataSoliCancelacionPago);
              this.relInterna.mensajeFNZSSoliCancelacion("cancelacion_realizada");
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
}
