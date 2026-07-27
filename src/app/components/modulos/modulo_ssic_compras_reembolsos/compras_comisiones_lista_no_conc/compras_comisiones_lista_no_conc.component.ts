import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener, AfterViewInit, ViewEncapsulation, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { SsicComisionesService } from '../../../../servicios/ssic/ssic-comisiones.service';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { DireccionesService } from "../../../../servicios/ssic/direcciones.service";
import { MonedasService } from "../../../../servicios/monedas.service";
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionContextService } from '../../../../servicios/session-context';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app_compras_egr_comi_lista_no_conc',
  templateUrl: './compras_comisiones_lista_no_conc.component.html',
  standalone: false,
  styleUrls: [
    '../../../../styles/datatable.css',
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
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/switches.css',
    '../../../../styles/colores.css',
    '../../../../styles/explain.css',
    '../../../../styles/dirpostales.css',
    '../../modulo_ssic_egresos/egresos.css',
    './compras_comisiones_lista_no_conc.component.css'
  ]
})
export class EgresosComisionesListaNoConcluidasComponent implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;

  formInfoRecibida: FormGroup;

  optionTool = {
    "placement": "top",
    //"showDelay":"500"
  };

  //lista
  public comi_nconc_search: any = [];
  array_comisiones_no_concluidas: any = [];
    indicadorComiNoConc:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
    rangoPeriodoComiNoConc: Date[] | undefined;

  //detalle
  arrayComisionDetalle: any = [];
  public folio_comision: string = "";
  arrayReembolsosVinculados: any = [];

  //nuevo registro
  public comi_update_bloqueado: string = "";
  public min_date: string = "";
  public max_date: string = "";
  public comi_proyecto: string = "";
  arrayComisionados: any = [];
  public comisionado_tipo: string = "";
  public comisionado_token: string = "";
  public comisionado_nombre: string = "";
  public comi_especificaciones: string = "";
  public comi_fecha_salida: string = "";
  public comi_time_duracion: number = 0;
  catalogo_monedas_api: any = [];
  public comi_recibe_dinero: boolean = false;
  public comi_dinero_recibido: string = "";
  public comi_moneda: string = "";
  public comi_moneda_decimales: number = 0;
  public comi_califica_vhum: boolean = false;
  public comi_tiempo_respuesta: number = 72;

  public comi_ubicacion_completa: string = "";

  public dipomex_cod_postal_estado: string = "---";
  public dipomex_cod_postal_municipio: string = "---";
  public dipomex_cod_postal_cp: string = "---";
  public dipomex_cod_postal_colonias: any = [];
  public dipomex_cod_postal_colonia_vinculada: string = "";
  public new_cod_postal_estado_name: string = "---";
  public new_cod_postal_estado_abrev: string = "---";
  public new_cod_postal_municipio: string = "---";
  public new_cod_postal_cp: string = "---";
  public new_cod_postal_colonia_vinculada: string = "";
  public validaCPNew: boolean = false;
  listnewdireccionNac: any = [];

  public comi_validate_to_save: boolean = false;
  public tokenComision: any = "";
  public comi_viewModal: boolean = false;

  private destruir$ = new Subject<void>();

  constructor(
    private sentinela: SentinelArkManager,
    private comi_serv: SsicComisionesService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private dirServ: DireccionesService,
    private sessionContext: SessionContextService,
    private relInterna: ComunicacionInternaService,
    private _monedasServ: MonedasService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.formInfoRecibida = this.fb.group({
      comisionado_token: [this.comisionado_token || null],
      comisionado_nombre: [this.comisionado_nombre || null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaComiReemSeccionModule();
    this.getRespuestaComisionNoConcluida();
    this.get_mes();

    this.comi_nconc_search = [
      'token_comision_main',
      'folio_comision',
      'comision_proyecto',
      'usuario_comision',
      'especificaciones',
      'fecha_programada',
      'duracion',
      'recibe_dinero',
      'dinero_recibido',
      'comision_moneda_name',
      'comi_tiempo_respuesta',
      'valor_humano',
      'egresos',
      'ubicacion_display_name',
      'ubicacion_colonia',
      'ubicacion_municipio',
      'ubicacion_codigo_postal',
      'ubicacion_estado',
      'concluida_fecha'
    ];
  }

  getRespuestaComiReemSeccionModule() {
    this.relInterna.mensajeComiReemSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_comi_no_concluidas") {
          console.log(mensaje);
          if (this.array_comisiones_no_concluidas.length === 0) this.lista_comisiones_no_concluidas('hoy');
        }
      }
    );
  }

  get permiso_editar() {
    return this.sessionContext.privilegio_editar;
  }

  get permiso_consulta() {
    return this.sessionContext.privilegio_consulta;
  }

  getRespuestaComisionNoConcluida() {
    this.relInterna.mensajeEgresosComisionNoConcluida$.subscribe(
      (mensaje: any) => {
        if (mensaje == "comision_no_concluida") {
          this.lista_comisiones_no_concluidas(this.indicadorComiNoConc);
        }
      }
    );
  }

  monedasCatalogoApi() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  //lista
    recargar_lista_no_concluidas() {
      this.lista_comisiones_no_concluidas(this.indicadorComiNoConc);
    }
    
    lista_comisiones_no_concluidas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
      this.indicadorComiNoConc = filtro;
      let periodo_inicio = '';
      let periodo_fin = '';
  
      if (filtro == 'otras_fechas') {
        var comi_no_conc_otras_fechas = document.getElementById("comi_no_conc_otras_fechas");
        if (this.rangoPeriodoComiNoConc && this.rangoPeriodoComiNoConc.length === 2) {
          const dateInicio = this.rangoPeriodoComiNoConc[0];
          const dateFin = this.rangoPeriodoComiNoConc[1];
          if (dateInicio && dateFin) {
            const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
            const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
            if (validacionInicio && validacionFin) {
              periodo_inicio = dateInicio.toISOString().split('T')[0];
              periodo_fin = dateFin.toISOString().split('T')[0];
              this.validator.correctoInputRow(comi_no_conc_otras_fechas);
            } else {
              this.validator.errorInputRow(comi_no_conc_otras_fechas);
              return;
            }
          } else {
            this.validator.errorInputRow(comi_no_conc_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(comi_no_conc_otras_fechas);
          return;
        }
      }
  
      this.comi_serv.comision_listas_no_concluidas(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
        next: (response) => this.procesarRespuestaComi(response),
        error: (err) => this.manejarErrorComi(err)
      });
    }

    private procesarRespuestaComi(response: any) {
      if (response.status === 'success') {
        this.array_comisiones_no_concluidas = response.comi_listado;
        console.log(this.array_comisiones_no_concluidas);
        this.cd.detectChanges();
      } else {
        this.array_comisiones_no_concluidas = [];
      }
    }
  
    private manejarErrorComi(error: any) {
      console.error('Error al cargar la lista de comisiones:', error);
      this.array_comisiones_no_concluidas = [];
    }

  ver_desglose_comision(token_comision_main: any) {
    this.comi_serv.comision_detalle_get_data(token_comision_main).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.comi_viewModal = true;
          this.arrayComisionDetalle = response.comi_contenido;
          this.monedasCatalogoApi();
          this.listaPersonal();

          this.arrayComisionDetalle.forEach((comi: any) => {
            if (!this.sessionContext.privilegio_editar && comi.comision_relaciones_total == 0) {
              this.comi_update_bloqueado = 'Esta comisión no se puede editar, ' + this.translate.instant("perm_denied");
            } else {
              this.comi_update_bloqueado = 'Esta comisión no se puede editar por que ha sido relacionada con ' + comi.comision_relaciones_total + ' reembolsos';
            }

            this.folio_comision = comi.folio_comision;
            this.arrayReembolsosVinculados = comi.comision_relaciones;
            if (comi.comision_relaciones_total == 0) {
              this.tokenComision = comi.token_comision_main;
              this.comi_proyecto = comi.comision_proyecto;
              this.comisionado_token = comi.usuario_comision_tkn;
              this.comisionado_nombre = comi.usuario_comision_name;
              this.comi_especificaciones = comi.especificaciones;
              this.comi_fecha_salida = comi.fecha_programada_html;
              this.comi_time_duracion = comi.duracion;
              this.comi_recibe_dinero = comi.recibe_dinero;
              this.comi_dinero_recibido = comi.dinero_recibido_simple;
              this.comi_moneda = comi.comision_moneda;
              this.comi_moneda_decimales = comi.comision_moneda_decimales;
              this.comi_califica_vhum = comi.valor_humano;
              this.comi_ubicacion_completa = comi.ubicacion_display_name != '' ? comi.ubicacion_display_name : comi.ubicacion_colonia + ', ' + comi.ubicacion_municipio + ', ' + comi.ubicacion_codigo_postal + ', ' + comi.ubicacion_estado;

              comi.ubicacion_codigo_postal != null && comi.ubicacion_codigo_postal != '' ? this.listarColoniasDipomex(comi.ubicacion_codigo_postal) : null;
              this.dipomex_cod_postal_estado = comi.ubicacion_estado;
              this.dipomex_cod_postal_municipio = comi.ubicacion_municipio;
              this.dipomex_cod_postal_cp = comi.ubicacion_codigo_postal;
              this.dipomex_cod_postal_colonia_vinculada = comi.ubicacion_colonia;
            }
          });

          console.log(this.arrayComisionDetalle);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listarColoniasDipomex(c_postal: any) {
    this.dipomex_cod_postal_colonias = [];
    this.dirServ.postCodPostalDipomex(c_postal).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response.cod_postal);
          this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
        } else {
          Swal.fire({ position: "top-end", icon: "warning", title: this.translate.instant(response.message), showConfirmButton: false, timer: 3000, customClass: { popup: 'my-swal-zindex' } })
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  solicita_apertura_comi(token_comision: any) {
    console.log(token_comision);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.comi_serv.egresos_comisiones_reabrir(token_comision).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.relInterna.mensajeEgresosComisionLGeneral("comision_lista_general");
              this.recargar_lista_no_concluidas();
              this.relInterna.mensajeEgresosComisionConcluida("comision_concluida");
              this.relInterna.mensajeEgresosComisionDeshabilitada("comision_deshabilitada");
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

  terminarComission(token_comision: any) {
    console.log(token_comision);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.comi_serv.comision_terminar(token_comision).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.relInterna.mensajeEgresosComisionLGeneral("comision_lista_general");
              this.recargar_lista_no_concluidas();
              this.relInterna.mensajeEgresosComisionConcluida("comision_concluida");
              this.relInterna.mensajeEgresosComisionDeshabilitada("comision_deshabilitada");
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
            //console.log(error);
          }
        )
      }
    });
  }

  deshabilitarComission(token_comision: any) {
    console.log(token_comision);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.comi_serv.comision_deshabilitar(token_comision).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.relInterna.mensajeEgresosComisionLGeneral("comision_lista_general");
              this.recargar_lista_no_concluidas();
              this.relInterna.mensajeEgresosComisionConcluida("comision_concluida");
              this.relInterna.mensajeEgresosComisionDeshabilitada("comision_deshabilitada");
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
            //console.log(error);
          }
        )
      }
    });
  }

  rehabilitarComission(token_comision: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.comi_serv.comision_rehabilitar(token_comision).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.relInterna.mensajeEgresosComisionLGeneral("comision_lista_general");
              this.recargar_lista_no_concluidas();
              this.relInterna.mensajeEgresosComisionConcluida("comision_concluida");
              this.relInterna.mensajeEgresosComisionDeshabilitada("comision_deshabilitada");
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
            //console.log(error);
          }
        )
      }
    });
  }

  return_form_reg() {
    this.tokenComision = "";
    this.comi_proyecto = "";
    this.comisionado_token = "";
    this.comisionado_nombre = "";
    this.comi_especificaciones = "";
    this.comi_fecha_salida = "";
    this.comi_time_duracion = 0;
    this.comi_recibe_dinero = false;
    this.comi_dinero_recibido = "";
    this.comi_moneda = "";
    this.comi_moneda_decimales = 0;
    this.comi_califica_vhum = false;

    this.dipomex_cod_postal_estado = "---";
    this.dipomex_cod_postal_municipio = "---";
    this.dipomex_cod_postal_cp = "---";
    this.dipomex_cod_postal_colonias = [];
    this.dipomex_cod_postal_colonia_vinculada = "";
  }

  keyupComisionUpdate_proyecto(event: any) {
    this.comi_proyecto = event.value;
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === this.tokenComision);
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof comidet !== 'undefined' && this.comi_proyecto != comidet.comision_proyecto;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupComisionUpdate_empleado(comisionado_token: string) {
    var comi_sionado_opcion_no_conc = document.getElementById("comi_sionado_opcion_no_conc");
    const comi_sionables_lista = this.arrayComisionados.find((trab: any) => trab.comisionado_token === comisionado_token);

    this.comisionado_tipo = comi_sionables_lista.comisionado_tipo;
    this.comisionado_token = typeof comi_sionables_lista !== 'undefined' ? comi_sionables_lista.comisionado_token : "";
    this.comisionado_nombre = typeof comi_sionables_lista !== 'undefined' ? comi_sionables_lista.comisionado_nombre : "";
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === this.tokenComision);
    const validacion = comisionado_token != "" && this.validator.filtroAlfaNumerico(comisionado_token) && typeof comidet !== 'undefined' && this.comisionado_token != comidet.usuario_comision_tkn;
    validacion && typeof comi_sionables_lista !== 'undefined' ? this.validator.correctoInputRow(comi_sionado_opcion_no_conc) : this.validator.errorInputRow(comi_sionado_opcion_no_conc);
  }

  keyupComisionUpdate_observaciones(event: any) {
    this.comi_especificaciones = event.value;
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === this.tokenComision);
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4 && typeof comidet !== 'undefined' && this.comi_especificaciones != comidet.especificaciones;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupComisionUpdate_fechaSalida(event: any) {
    this.comi_fecha_salida = event.value;
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === this.tokenComision);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && typeof comidet !== 'undefined' && this.comi_fecha_salida != comidet.fecha_programada_html;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupComisionUpdate_tiempoDuracion(event: any) {
    this.comi_time_duracion = event.value;
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === this.tokenComision);
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value != 0 && typeof comidet !== 'undefined' && this.comi_time_duracion != comidet.duracion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupComisionUpdate_recibeDinero(event: any) {
    this.comi_recibe_dinero = event.checked ? true : false;
    if (event.checked) {
      this.comi_dinero_recibido = "";
      this.comi_moneda = "";
      this.comi_moneda_decimales = 0;
    }
  }

  keyupComisionUpdate_dineroRecibido(event: any) {
    this.comi_dinero_recibido = event.value;
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === this.tokenComision);
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && typeof comidet !== 'undefined' && this.comi_dinero_recibido != comidet.recibe_dinero;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupComisionUpdate_moneda(opcion: any) {
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.comi_moneda = typeof mnd !== 'undefined' ? mnd.code : '';
    this.comi_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : 0;
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === this.tokenComision);
    const validacion = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) && typeof mnd !== 'undefined' && (this.comi_moneda != comidet.comision_moneda) && (this.comi_moneda_decimales != comidet.comision_moneda_decimales);
    validacion ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  keyupComisionUpdate_califica_vhum(event: any) {
    this.comi_califica_vhum = event.checked ? true : false;
  }

  buscaCodPostalDipomex(event: any) {
    const validacion = event.value != '' && this.validator.filtroNumericoSat(event.value) && event.value.length == 5;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    if (validacion) {
      this.dipomex_cod_postal_colonias = [];
      this.dipomex_cod_postal_estado = "";
      this.dipomex_cod_postal_municipio = "";
      this.dipomex_cod_postal_cp = "";
      this.dipomex_cod_postal_colonia_vinculada = "";

      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.dipomex_cod_postal_estado = response.cod_postal["estado"] + " (" + response.cod_postal["estado_abreviatura"] + ")";
            this.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
            this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];

            if (response.cod_postal["colonias"].length == 1) {
              this.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
            }
          } else {
            Swal.fire({ position: "top-end", icon: "warning", title: this.translate.instant(response.message), showConfirmButton: false, timer: 3000, customClass: { popup: 'my-swal-zindex' } })
            if (response.message == "postal_empty") {
              this.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
              this.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
              this.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
            }
          }
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  seleccionaColoniaCPDipomex(colonia_name: any) {
    const colonias = this.dipomex_cod_postal_colonias.find((row: any) => row === colonia_name);
    this.dipomex_cod_postal_colonia_vinculada = typeof colonias !== 'undefined' ? colonia_name : '';
  }

  keyupCPostal_EstName(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_cod_postal_estado_name = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_Municipio(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_cod_postal_municipio = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_CP(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value.length == 5;
    this.new_cod_postal_cp = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCPostal_Colonia(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_cod_postal_colonia_vinculada = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  addListPostal() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar la dirección registrada?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, agregar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const valida_estado = this.new_cod_postal_estado_name != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_estado_name);
        const valida_municipio = this.new_cod_postal_municipio != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_municipio);
        const valida_postal_cp = this.new_cod_postal_cp != "" && this.validator.filtroNum(this.new_cod_postal_cp) == true && this.new_cod_postal_cp.length == 5;
        const valida_colonia = this.new_cod_postal_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.new_cod_postal_colonia_vinculada);
        if (valida_estado && valida_municipio && valida_postal_cp && valida_colonia) {
          this.listnewdireccionNac.push({ "estado": this.new_cod_postal_estado_name, "municipio": this.new_cod_postal_municipio, "codigo_postal": this.new_cod_postal_cp, "colonia": this.new_cod_postal_colonia_vinculada });
          this.validaCPNew = false;

          this.validator.limpiaInputRow(document.getElementById("newDipoMexEstado"));
          this.validator.limpiaInputRow(document.getElementById("newDipoMexMunicipio"));
          this.validator.limpiaInputRow(document.getElementById("newDipoMexCP"));
          this.validator.limpiaInputRow(document.getElementById("newDipoMexColonia"));
          this.new_cod_postal_estado_name = "";
          this.new_cod_postal_municipio = "";
          this.new_cod_postal_cp = "";
          this.new_cod_postal_colonia_vinculada = "";
        } else {
          if (!valida_estado) { this.validator.errorInputRow(document.getElementById("newDipoMexEstado")); }
          if (!valida_municipio) { this.validator.errorInputRow(document.getElementById("newDipoMexMunicipio")); }
          if (!valida_postal_cp) { this.validator.errorInputRow(document.getElementById("newDipoMexCP")); }
          if (!valida_colonia) { this.validator.errorInputRow(document.getElementById("newDipoMexColonia")); }
        }
      }
    });
  }

  deleteListCPostal(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.listnewdireccionNac.splice(posicion, 1);
      }
    });
  }

  comi_to_vali_update(token_comision_main: any): Boolean {
    const comidet = this.arrayComisionDetalle.find((comi: any) => comi.token_comision_main === token_comision_main);
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === this.comi_moneda);
    const comi_proy = this.comi_proyecto != "" && this.validator.filtroAlfaNumerico(this.comi_proyecto) && typeof comidet !== 'undefined' && this.comi_proyecto != comidet.comision_proyecto;
    const comi_empl = this.comisionado_token != "" && typeof comidet !== 'undefined' && this.comisionado_token != comidet.usuario_comision_tkn;
    const comi_espe = this.comi_especificaciones != "" && this.validator.strFilter(this.comi_especificaciones) && this.comi_especificaciones.length >= 4 && typeof comidet !== 'undefined' && this.comi_especificaciones != comidet.especificaciones;
    const comi_fsli = this.comi_fecha_salida != "" && this.validator.filtroFecha(this.comi_fecha_salida) && typeof comidet !== 'undefined' && this.comi_fecha_salida != comidet.fecha_programada_html;
    const comi_dura = this.comi_time_duracion != 0 && this.validator.filtroNum(this.comi_time_duracion) && this.comi_time_duracion != 0 && typeof comidet !== 'undefined' && this.comi_time_duracion != comidet.duracion;

    const comi_reci = this.comi_recibe_dinero != comidet.recibe_dinero;
    //const comi_dine = !this.comi_recibe_dinero || (this.comi_recibe_dinero && this.comi_dinero_recibido != '' && this.validator.filtroNum(this.comi_dinero_recibido) && typeof comidet !== 'undefined' && this.comi_dinero_recibido != comidet.recibe_dinero);
    const comi_dine = this.comi_dinero_recibido != '' && this.validator.filtroNum(this.comi_dinero_recibido) && typeof comidet !== 'undefined' && this.comi_dinero_recibido != comidet.recibe_dinero;

    const comi_mone = this.comi_moneda != '' && this.validator.filtroAlfaNumerico(this.comi_moneda) && typeof mnd !== 'undefined' && this.comi_moneda != comidet.comision_moneda;

    const dire_post = this.dipomex_cod_postal_cp != '' && this.dipomex_cod_postal_cp != comidet.ubicacion_codigo_postal && this.dipomex_cod_postal_colonia_vinculada != '' && this.dipomex_cod_postal_colonia_vinculada != comidet.ubicacion_colonia;
    const dire_colo = this.dipomex_cod_postal_colonia_vinculada != '' && this.dipomex_cod_postal_colonia_vinculada != comidet.ubicacion_colonia && this.dipomex_cod_postal_cp == comidet.ubicacion_codigo_postal;
    //const validadir_postal = dire_post && dire_colo && dire_muni && dire_esta;
    //const validadir_colonia = dire_colo && this.dipomex_cod_postal_cp == comidet.ubicacion_codigo_postal && this.dipomex_cod_postal_municipio == comidet.ubicacion_municipio && this.dipomex_cod_postal_estado == comidet.ubicacion_estado;
    return comi_proy || comi_empl || comi_espe || comi_fsli || comi_dura || comi_reci || comi_dine || comi_mone || dire_post || dire_colo;
  }

  onUpdateComisionSolicitud() {
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
        this.comi_serv.update_comision(
          this.tokenComision,
          this.comi_proyecto,
          this.comisionado_tipo,
          this.comisionado_token,
          this.comi_especificaciones,
          this.comi_fecha_salida,
          this.comi_time_duracion,
          this.comi_recibe_dinero,
          this.comi_dinero_recibido,
          this.comi_moneda,
          this.comi_tiempo_respuesta,
          this.comi_califica_vhum,
          true,
          this.dipomex_cod_postal_estado,
          this.dipomex_cod_postal_municipio,
          this.dipomex_cod_postal_cp,
          this.dipomex_cod_postal_colonia_vinculada
        ).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.cleanFormRegistro();
              this.relInterna.mensajeEgresosComisionLGeneral("comision_lista_general");
              this.recargar_lista_no_concluidas();
              this.relInterna.mensajeEgresosComisionConcluida("comision_concluida");
              this.relInterna.mensajeEgresosComisionDeshabilitada("comision_deshabilitada");
              this.ver_desglose_comision(this.tokenComision);
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
            //console.log(error);
          }
        )
      }
    });
  }

  //nuevo registro
  listaPersonal() {
    this.comi_serv.comisionados_lista().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.arrayComisionados = response.comisionados_lista;
        }
      }, error => { console.log(error); }
    );
  }

  cerrarModal(modal: any) { $(modal).removeClass("open"); }

  get_mes() {
    let f_actual = new Date();
    var año = f_actual.getFullYear();
    var simple_mes = f_actual.getMonth() + 1;
    var mes = "" + simple_mes;
    if (simple_mes < 10) {
      mes = "0" + simple_mes;
    }
    let ultimo_dia = new Date(f_actual.getFullYear(), f_actual.getMonth() + 1, 0).getDate();
    this.max_date = año + "-" + mes + "-" + ultimo_dia;
    console.log(this.min_date + " " + this.max_date);
  }

  cleanFormRegistro() {
    this.comi_proyecto = "";
    this.comisionado_token = "";
    this.comi_especificaciones = "";
    this.comi_fecha_salida = "";
    this.comi_time_duracion = 0;
    this.comi_recibe_dinero = false;
    this.comi_dinero_recibido = "";
    this.comi_califica_vhum = false;
    this.dipomex_cod_postal_estado = "---";
    this.dipomex_cod_postal_municipio = "---";
    this.dipomex_cod_postal_cp = "---";
    this.dipomex_cod_postal_colonias = [];
    this.dipomex_cod_postal_colonia_vinculada = "";
    this.comi_validate_to_save = false;

    this.validator.limpiaInput(document.getElementById("comi_proyecto"));
    this.validator.limpiaSelect(document.getElementById("comi_sionado_opcion_no_conc"));
    this.validator.limpiaTextareaWithLabel(document.getElementById("comi_large_observ"));
    this.validator.limpiaInput(document.getElementById("comi_date_salida"));
    this.validator.limpiaInput(document.getElementById("comi_time_duracion"));
    $("#comi_recibe_dinero").prop("checked", false);
    this.validator.limpiaInput(document.getElementById("comi_dinero_recibido"));
    this.validator.limpiaInput(document.getElementById("selectedMonedaCode"));
    $("#comi_califica_vhum").prop("checked", false);
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
