import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NominaDispersionService } from '../../../../../servicios/ssic/nomina-dispersion-service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'fnzs_solicitud_cancelacion_gral_nomina',
  standalone: false,
  templateUrl: './soli-cancelacion-gral-nomina.html',
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
    './soli-cancelacion-gral-nomina.css',
  ]
})
export class SoliCancelacionGralNomina implements OnInit{
  public dataSoliCancelacionNomina:any = [];
  desglose_solicitud_cancelacion:any = [];
  desgloseSoliCancelacionDispersionPago: any = [];

  constructor(
    private ordenDisper: NominaDispersionService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef) {
  }

  @Input() set SoliCancelacion(value: string) {
    if (value) {
      this.dataSoliCancelacionNomina = value;
      this.solicitud_de_cancelacion_pago_nomina(this.dataSoliCancelacionNomina);
    }
  }

  ngOnInit(): void {
    // Al arrancar, inicializamos el formulario con el primer camión obligatorio
    //this.anadirTransporte();
  }

  solicitud_de_cancelacion_pago_nomina(canc_soli: any) {
    this.desglose_solicitud_cancelacion = [];
    this.desglose_solicitud_cancelacion.push(canc_soli);

    this.ordenDisper.solicitud_cancelacion_pago_nomina(canc_soli.cancel_soli_token,canc_soli.doc_anterior_token).subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.desgloseSoliCancelacionDispersionPago = response.pagos_realizados;
          //this.desglose_solicitud_cancel_mov_acreedor = response.info_compras;
          //this.desglose_solicitud_cancel_activ_movim = response.info_orden_pago;

          //console.log(this.desglose_solicitud_cancel_mov_acreedor);
          //console.log(this.desglose_solicitud_cancel_activ_movim);
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

  confirmaCancelPagoNomina(cancel_soli_token: any, f_contabilizacion: any, comentarios_confirma_cancelacion: any) {
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
        this.ordenDisper.confirmar_cancelacion_pago_nomina(cancel_soli_token, f_contabilizacion, comentarios_confirma_cancelacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.solicitud_de_cancelacion_pago_nomina(this.dataSoliCancelacionNomina);
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
