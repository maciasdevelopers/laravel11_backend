import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { DescargaExcel } from '../../../../servicios/descarga-excel';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { Usuarios } from '../../../../modelos/Usuarios';
import { VhumanoCancelacionesService } from '../../../../servicios/ssic/vhumano-cancelaciones-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vhumano-solicitudes-cancelacion',
  standalone: false,
  templateUrl: './vhumano-solicitudes-cancelacion.html',
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/breadcrumb.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/canvas.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/explain.css',
    '../../../../styles/switches.css',
    '../../../../styles/cards.css',
    '../vhumano.css',
    './vhumano-solicitudes-cancelacion.css'
  ],
})
export class VHumanoSolicitudesCancelacion implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  list_cancel_soli: any = [];
  indicador_cancel_soli:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoCancelSoli: Date[] | undefined;

  desglose_solicitud_cancelacion: any = [];

  windowSoliCancelacionNominaEFInfo:boolean = false;
  desglose_solicitud_cancel_nomina_efectivo: any = [];
  desglose_soli_cancel_nomina_efectivo:boolean = false;

  windowSoliCancelacionNominaESPInfo:boolean = false;
  desglose_solicitud_cancel_nomina_especie: any = [];
  desglose_soli_cancel_nomina_especie:boolean = false;

  windowSoliCancelacionAsimilados:boolean = false;
  desglose_solicitud_cancel_asimilados: any = [];
  desglose_soli_cancel_asimilados:boolean = false;

  windowSoliCancelacionISN:boolean = false;
  desglose_solicitud_cancel_isn: any = [];
  desglose_soli_cancel_isn:boolean = false;

  windowSoliCancelacionIMSS:boolean = false;
  desglose_solicitud_cancel_imss: any = [];
  desglose_soli_cancel_imss:boolean = false;

 constructor(
    private vhumCancelServ: VhumanoCancelacionesService,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private sentinela: SentinelArkManager,
    private servXlsx: DescargaExcel,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.ver_solicitudes_cancelacion('hoy');
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeSoliCancelVHUM$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_vhum_soli_cancelacion") {
          console.log(mensaje);
          if (this.list_cancel_soli.length === 0) this.ver_solicitudes_cancelacion('hoy');
        }
      }
    );
  }

  lista_solicitudes_cancelacion() {
    this.ver_solicitudes_cancelacion(this.indicador_cancel_soli);
  }

  ver_solicitudes_cancelacion(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_cancel_soli = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var eegr_cancelaciones_otras_fechas = document.getElementById("eegr_cancelaciones_otras_fechas");
      if (this.rangoPeriodoCancelSoli && this.rangoPeriodoCancelSoli.length === 2) {
        const dateInicio = this.rangoPeriodoCancelSoli[0];
        const dateFin = this.rangoPeriodoCancelSoli[1];
        if (dateInicio && dateFin) {
          const validacionInicio = dateInicio && this.validator.filtroFecha(periodo_inicio);
          const validacionFin = dateFin && this.validator.filtroFecha(periodo_fin);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(eegr_cancelaciones_otras_fechas);
          } else {
            this.validator.errorInputRow(eegr_cancelaciones_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(eegr_cancelaciones_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(eegr_cancelaciones_otras_fechas);
      }
    }

    this.vhumCancelServ.listando_soli_cancelacion_vhum(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaSoliCan(response),
      error: (err) => this.manejarErrorSoliCan(err)
    });
  }

  private procesarRespuestaSoliCan(response: any) {
    if (response.status === 'success') {
      this.list_cancel_soli = response.solicitudes;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.list_cancel_soli = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorSoliCan(error: any) {
    console.error('Error al cargar la lista solicitudes de cancelación:', error);
    this.list_cancel_soli = [];
  }

  detalle_solicitud_de_cancelacion(canc: any) {
    switch (canc.tipo_solicitud) {
      case 'NOMINA-EFECTIVO':
        this.solicitud_de_cancelacion_nomina_efectivo(canc);
        break;
      case 'NOMINA-ESPECIE':
        this.solicitud_de_cancelacion_nomina_especie(canc);
        break;
      case 'ASIMILADOS':
        this.solicitud_de_cancelacion_asimilados(canc);
        break;
      case 'ISN':
        this.solicitud_de_cancelacion_isn(canc);
        break;
      case 'IMSS':
        this.solicitud_de_cancelacion_imss(canc);
        break;
      default:
        break;
    }
  }
//nomina en efectivo
  solicitud_de_cancelacion_nomina_efectivo(canc_soli: any) {
    this.desglose_solicitud_cancelacion = [];
    this.desglose_solicitud_cancelacion.push(canc_soli);
    this.windowSoliCancelacionNominaEFInfo = true;

    this.vhumCancelServ.solicitud_cancelacion_nomina_efectivo(canc_soli.cancel_soli_token,canc_soli.doc_anterior_token).subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.windowSoliCancelacionNominaEFInfo = true;
          this.desglose_soli_cancel_nomina_efectivo = response.canceled_nomina_efectivo; 
          this.desglose_solicitud_cancel_nomina_efectivo = response.data_nomina_efectivo;
          console.log(this.desglose_solicitud_cancel_nomina_efectivo);
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

  confirmaCancelacionFechaContNomiEF(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    canc_comfirm.f_contab_confirma_cancelacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  confirmaCancelacionObservaNomiEF(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    canc_comfirm.comentarios_confirma_cancelacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(canc_comfirm.comentarios_confirma_cancelacion);
    console.log("this.desglose_solicitud_cancelacion " + this.desglose_solicitud_cancelacion);
  }

  confirmaCancelNominaEfectivo(cancel_soli_token: any, f_contabilizacion: any, comentarios_confirma_cancelacion: any) {
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
        this.vhumCancelServ.confirma_cancelacion_nomina_efectivo(cancel_soli_token, f_contabilizacion, comentarios_confirma_cancelacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.lista_solicitudes_cancelacion();
              this.detalle_solicitud_de_cancelacion(cancel_soli_token);
              this.windowSoliCancelacionNominaEFInfo = false;
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

//nomina en especie
  solicitud_de_cancelacion_nomina_especie(canc_soli: any) {
    this.desglose_solicitud_cancelacion = [];
    this.desglose_solicitud_cancelacion.push(canc_soli);
    this.windowSoliCancelacionNominaESPInfo = true;

    this.vhumCancelServ.solicitud_cancelacion_nomina_especie(canc_soli.cancel_soli_token,canc_soli.doc_anterior_token).subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.windowSoliCancelacionNominaESPInfo = true;
          this.desglose_soli_cancel_nomina_especie = response.canceled_nomina_especie; 
          this.desglose_solicitud_cancel_nomina_especie = response.data_nomina_especie;
          console.log(this.desglose_solicitud_cancel_nomina_especie);
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

  confirmaCancelacionFechaContNomiESP(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    canc_comfirm.f_contab_confirma_cancelacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  confirmaCancelacionObservaNomiESP(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    canc_comfirm.comentarios_confirma_cancelacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(canc_comfirm.comentarios_confirma_cancelacion);
    console.log("this.desglose_solicitud_cancelacion " + this.desglose_solicitud_cancelacion);
  }

  confirmaCancelNominaEspecie(cancel_soli_token: any, f_contabilizacion: any, comentarios_confirma_cancelacion: any) {
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
        this.vhumCancelServ.confirma_cancelacion_nomina_especie(cancel_soli_token, f_contabilizacion, comentarios_confirma_cancelacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.lista_solicitudes_cancelacion();
              this.detalle_solicitud_de_cancelacion(cancel_soli_token);
              this.windowSoliCancelacionNominaESPInfo = false;
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

//asimilados
  solicitud_de_cancelacion_asimilados(canc_soli: any) {
    this.desglose_solicitud_cancelacion = [];
    this.desglose_solicitud_cancelacion.push(canc_soli);
    this.windowSoliCancelacionAsimilados = true;

    this.vhumCancelServ.solicitud_cancelacion_asimilados(canc_soli.cancel_soli_token,canc_soli.doc_anterior_token).subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.windowSoliCancelacionAsimilados = true;
          this.desglose_soli_cancel_asimilados = response.canceled_asimilados; 
          this.desglose_solicitud_cancel_asimilados = response.data_asimilados;
          console.log(this.desglose_solicitud_cancel_asimilados);
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

  confirmaCancelacionAsimilFechaCont(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    canc_comfirm.f_contab_confirma_cancelacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  confirmaCancelacionAsimilObserva(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    canc_comfirm.comentarios_confirma_cancelacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(canc_comfirm.comentarios_confirma_cancelacion);
    console.log("this.desglose_solicitud_cancelacion " + this.desglose_solicitud_cancelacion);
  }

  confirmaCancelAsimilados(cancel_soli_token: any, f_contabilizacion: any, comentarios_confirma_cancelacion: any) {
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
        this.vhumCancelServ.confirma_cancelacion_asimilados(cancel_soli_token, f_contabilizacion, comentarios_confirma_cancelacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.lista_solicitudes_cancelacion();
              this.detalle_solicitud_de_cancelacion(cancel_soli_token);
              this.windowSoliCancelacionNominaEFInfo = false;
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

//isn
  solicitud_de_cancelacion_isn(canc_soli: any) {
    this.desglose_solicitud_cancelacion = [];
    this.desglose_solicitud_cancelacion.push(canc_soli);
    this.windowSoliCancelacionISN = true;

    this.vhumCancelServ.solicitud_cancelacion_isn(canc_soli.cancel_soli_token,canc_soli.doc_anterior_token).subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.windowSoliCancelacionISN = true;
          this.desglose_soli_cancel_isn = response.canceled_isn; 
          this.desglose_soli_cancel_isn = response.data_isn;
          console.log(this.desglose_soli_cancel_isn);
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

  confirmaCancelacionISNFechaCont(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    canc_comfirm.f_contab_confirma_cancelacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  confirmaCancelacionISNObserva(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    canc_comfirm.comentarios_confirma_cancelacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(canc_comfirm.comentarios_confirma_cancelacion);
    console.log("this.desglose_solicitud_cancelacion " + this.desglose_solicitud_cancelacion);
  }

  confirmaCancelISN(cancel_soli_token: any, f_contabilizacion: any, comentarios_confirma_cancelacion: any) {
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
        this.vhumCancelServ.confirma_cancelacion_isn(cancel_soli_token, f_contabilizacion, comentarios_confirma_cancelacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.lista_solicitudes_cancelacion();
              this.detalle_solicitud_de_cancelacion(cancel_soli_token);
              this.windowSoliCancelacionISN = false;
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

//imss
  solicitud_de_cancelacion_imss(canc_soli: any) {
    this.desglose_solicitud_cancelacion = [];
    this.desglose_solicitud_cancelacion.push(canc_soli);
    this.windowSoliCancelacionNominaEFInfo = true;

    this.vhumCancelServ.solicitud_cancelacion_imss(canc_soli.cancel_soli_token,canc_soli.doc_anterior_token).subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.windowSoliCancelacionNominaEFInfo = true;
          this.desglose_soli_cancel_nomina_efectivo = response.canceled_orden_pago; 
          this.desglose_solicitud_cancel_nomina_efectivo = response.data_compras;
          console.log(this.desglose_solicitud_cancel_nomina_efectivo);
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

  confirmaCancelacionImssFechaCont(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    canc_comfirm.f_contab_confirma_cancelacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  confirmaCancelacionImssObserva(event: any, cancel_soli_token: any) {
    const canc_comfirm = this.desglose_solicitud_cancelacion.find((canc: any) => canc.cancel_soli_token === cancel_soli_token);
    const validacion = event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4;
    canc_comfirm.comentarios_confirma_cancelacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(canc_comfirm.comentarios_confirma_cancelacion);
    console.log("this.desglose_solicitud_cancelacion " + this.desglose_solicitud_cancelacion);
  }

  confirmaCancelImss(cancel_soli_token: any, f_contabilizacion: any, comentarios_confirma_cancelacion: any) {
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
        this.vhumCancelServ.confirma_cancelacion_imss(cancel_soli_token, f_contabilizacion, comentarios_confirma_cancelacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.lista_solicitudes_cancelacion();
              this.detalle_solicitud_de_cancelacion(cancel_soli_token);
              this.windowSoliCancelacionIMSS = false;
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

  ngOnDestroy() {
    //this.destruir$.next();
    //this.destruir$.complete();
  }
}
