import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { SsicComisionesService } from '../../../../../../servicios/ssic/ssic-comisiones.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { DireccionesService } from "../../../../../../servicios/ssic/direcciones.service";
import { MonedasService } from "../../../../../../servicios/monedas.service";
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
declare var zxcvbn: any;
import '../../../../../../../assets/js/zxcvbn.js';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
declare var zxcvbn: any;

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones_lista.component.html',
  //styleUrls: ['./comisiones.component.css']
  standalone: false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
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
    '../../../gerencia.css',
    './comisiones_lista.component.css'
  ]
})
export class GerenciaComisionesListaComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  searchComi: any = [];

  optionTool = {
    "placement": "top",
    //"showDelay":"500"
  };

  //lista
  optionsTree = { allowDrag: true };

  public comi_all_view: boolean = false;
  array_comisiones_all: any = [];

  public comi_nconc_view: boolean = false;
  array_comisiones_no_concluidas: any = [];

  public comi_cconc_view: boolean = false;
  array_comisiones_concluidas: any = [];

  public comi_disabled_view: boolean = false;
  array_comisiones_deshabilitadas: any = [];

  public comi_view_ubica_latitud: string = "";
  public comi_view_ubica_longitud: string = "";
  public comi_view_ubica_display_name: string = "";
  registroSelectedArbol: string = "";
  registroSelectedPagos: string = "";

  //nuevo registro
  public min_date: string = "";
  public max_date: string = "";
  public comi_proyecto: string = "";
  arrayEmpleados: any = [];
  public comi_empleado_token: string = "";
  public comi_empleado_nombre: string = "";
  public comi_especificaciones: string = "";
  public comi_fecha_salida: string = "";
  public comi_time_duracion: number = 0;
  arrayMonedas: any = [];
  public comi_recibe_dinero: boolean = false;
  public comi_dinero_recibido: string = "";
  public comi_moneda_tkn: string = "";
  public comi_moneda_name: string = "";
  public comi_califica_vhum: boolean = false;
  public comi_tiempo_respuesta: number = 72;
  arrayDirecciones: any = [];
  public comi_ubicacion_direccion: string = "";
  public comi_ubicacion_latitud: string = "";
  public comi_ubicacion_longitud: string = "";
  public comi_ubicacion_display_name: string = "";
  public comi_validate_to_save: boolean = false;

  public comi_bool_form_update: boolean = false;
  public tokenComision: any = "";
  public comi_validate_to_update: boolean = false;

  constructor(
    private sentinela: SentinelArkManager,
    private comi_serv: SsicComisionesService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private dirServ: DireccionesService,
    private trab_serv: EmpleadosService,
    private _monedasServ: MonedasService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
  }

  ngOnInit(): void {
    this._monedasServ.getMonedasDos().subscribe((data) => {
      this.arrayMonedas = data;
      console.log(data);
    });
    this.lista_comisiones_general();
    this.lista_comisiones_no_concluidas();
    this.lista_comisiones_concluidas();
    this.lista_comisiones_deshabilitadas();

    this.listaPersonal();
    this.get_mes();
    this.searchComi = [
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
      'ubicacion_display_name'
    ];
  }

  lista_comisiones_general() {
    this.comi_all_view = false;
    this.comi_serv.comision_lista_general().subscribe(
      response => {
        this.comi_all_view = true;
        if (response.status == 'success') {
          this.array_comisiones_all = response.comi_listado;
          console.log(this.array_comisiones_all);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  lista_comisiones_no_concluidas() {
    this.comi_nconc_view = false;
    this.comi_serv.comision_listas_no_concluidas('','','').subscribe(
      response => {
        this.comi_nconc_view = true;
        if (response.status == 'success') {
          this.array_comisiones_no_concluidas = response.comi_listado;
          console.log(this.array_comisiones_no_concluidas);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  lista_comisiones_concluidas() {
    this.comi_cconc_view = false;
    this.comi_serv.comision_listas_concluidas('','','').subscribe(
      response => {
        this.comi_cconc_view = true;
        if (response.status == 'success') {
          this.array_comisiones_concluidas = response.comi_listado;
          console.log(this.array_comisiones_concluidas);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  lista_comisiones_deshabilitadas() {
    this.comi_disabled_view = false;
    this.comi_serv.comision_deshabilitadas().subscribe(
      response => {
        this.comi_disabled_view = true;
        if (response.status == 'success') {
          this.array_comisiones_deshabilitadas = response.comi_listado;
          console.log(this.array_comisiones_deshabilitadas);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verArbol(data: any) {
    this.registroSelectedArbol = this.registroSelectedArbol === data ? null : data;
  }

  verPagos(data: any) {
    this.registroSelectedPagos = this.registroSelectedPagos === data ? null : data;
  }

  comisionesVerUbica(ubicacion_latitud: any, ubicacion_longitud: any, ubicacion_display_name: any) {
    this.comi_view_ubica_latitud = ubicacion_latitud;
    this.comi_view_ubica_longitud = ubicacion_longitud;
    this.comi_view_ubica_display_name = ubicacion_display_name;
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
              this.cleanFormRegistro();
              this.lista_comisiones_no_concluidas();
              this.lista_comisiones_concluidas();
              this.lista_comisiones_deshabilitadas();
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
              this.cleanFormRegistro();
              this.lista_comisiones_no_concluidas();
              this.lista_comisiones_concluidas();
              this.lista_comisiones_deshabilitadas();
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

  detalleComission(token_comision: any) {
    this.comi_serv.comision_detalle_update(token_comision).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);

          if (response.comision_relaciones_num > 0) {
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: "Esta comisión no se puede editar por que ha sido relacionada con " + response.comision_relaciones_num + " reembolsos",
              showConfirmButton: false,
              timer: 3000
            })
          } else {
            this.comi_bool_form_update = true;
            this.tokenComision = response.token_comision_main;
            this.comi_proyecto = response.comision_proyecto;
            this.comi_empleado_token = response.usuario_comision_tkn;
            this.comi_empleado_nombre = response.usuario_comision_name;
            this.comi_especificaciones = response.especificaciones;
            this.comi_fecha_salida = response.fecha_programada_html;
            this.comi_time_duracion = response.duracion;
            this.comi_recibe_dinero = response.recibe_dinero;
            this.comi_dinero_recibido = response.dinero_recibido_simple;
            this.comi_moneda_tkn = response.comision_moneda_tkn;
            this.comi_moneda_name = response.comision_moneda_name;
            this.comi_califica_vhum = response.valor_humano;
            this.comi_ubicacion_direccion = response.kjgkjkkjllklkyu;
            this.comi_ubicacion_latitud = response.ubicacion_latitud;
            this.comi_ubicacion_longitud = response.ubicacion_longitud;
            this.comi_ubicacion_display_name = response.ubicacion_display_name;
          }
          //public comi_validate_to_update:boolean = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  return_form_reg() {
    this.tokenComision = "";
    this.comi_bool_form_update = false;
    this.comi_proyecto = "";
    this.comi_empleado_token = "";
    this.comi_empleado_nombre = "";
    this.comi_especificaciones = "";
    this.comi_fecha_salida = "";
    this.comi_time_duracion = 0;
    this.comi_recibe_dinero = false;
    this.comi_dinero_recibido = "";
    this.comi_moneda_tkn = "";
    this.comi_moneda_name = "";
    this.comi_califica_vhum = false;
    this.comi_ubicacion_direccion = "";
    this.comi_ubicacion_latitud = "";
    this.comi_ubicacion_longitud = "";
    this.comi_ubicacion_display_name = "";
  }

  keyupComisionUpdate_proyecto(event: any) {
    this.comi_proyecto = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInput(event, this.translate.instant("proy"));
    } else {
      this.validator.errorInput(event, this.translate.instant("proy_fail"));
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_empleado(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.arrayEmpleados.length; i++) {
        const row = this.arrayEmpleados[i];
        if (row["nombre_completo"] == event.value) {
          this.validator.correctoInput(event, this.translate.instant("employ"));
          this.comi_empleado_token = row["token_empleado_inside"];
          this.comi_empleado_nombre = row["nombre_completo"];
          this.comi_to_vali_update();
          return;
        } else {
          this.comi_to_vali_update();
          this.validator.errorInput(event, this.translate.instant("employ_fail"));
          this.comi_empleado_token = "";
        }
      }
    } else {
      this.validator.errorInput(event, this.translate.instant("employ_fail"));
      this.comi_empleado_token = "";
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: "proveedor invalido, revisa tu información o comunicate a soporte",
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  keyupComisionUpdate_observaciones(event: any) {
    this.comi_especificaciones = event.value;
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.validator.correctoTextarea(event, this.translate.instant("observ"));
    } else {
      this.validator.errorTextarea(event, this.translate.instant("observ_fail"));
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_fechaSalida(event: any) {
    this.comi_fecha_salida = event.value;
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.validator.correctoInput(event, this.translate.instant("comi_date"));
    } else {
      this.validator.errorInput(event, this.translate.instant("comi_date_fail"));
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_tiempoDuracion(event: any) {
    this.comi_time_duracion = event.value;
    if (event.value != "" && this.validator.filtroNum(event.value) == true && event.value != 0) {
      this.validator.correctoInput(event, this.translate.instant("comi_time"));
    } else {
      this.validator.errorInput(event, this.translate.instant("comi_time_fail"));
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_recibeDinero(event: any) {
    if (event.checked == true) {
      this.comi_recibe_dinero = true;
    } else {
      this.comi_recibe_dinero = false;
      this.comi_dinero_recibido = "";
      this.comi_moneda_tkn = "";
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_dineroRecibido(event: any) {
    this.comi_dinero_recibido = event.value;
    if (event.value != '' && this.validator.filtroNum(event.value) == true) {
      this.validator.correctoInput(event, this.translate.instant("total_import"));
    } else {
      this.validator.errorInput(event, this.translate.instant("total_importfail"));
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_moneda(event: any) {
    console.log(event.value);
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.arrayMonedas.length; i++) {
        const money = this.arrayMonedas[i];
        if (money['moneda'] == event.value) {
          this.validator.correctoInput(event, this.translate.instant("mon_name"));
          console.log(money["token_monedas"]);
          this.comi_moneda_tkn = money["token_monedas"];
          this.comi_moneda_name = money["moneda"];
          this.comi_to_vali_update();
          return;
        } else {
          this.validator.errorInput(event, this.translate.instant("mon_name_fail"));
          this.comi_moneda_tkn = "";
          this.comi_to_vali_update();
        }
      }
    } else {
      this.validator.errorInput(event, this.translate.instant("mon_name_fail"));
      this.comi_moneda_tkn = "";
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_califica_vhum(event: any) {
    if (event.checked == true) {
      this.comi_califica_vhum = true;
    } else {
      this.comi_califica_vhum = false;
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_direccion_location(event: any) {
    this.comi_ubicacion_direccion = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_listar_direcciones() {
    if (this.comi_ubicacion_direccion != "" && this.validator.filtroAlfaNumerico(this.comi_ubicacion_direccion) == true) {
      this.dirServ.location_iq_dir(this.comi_ubicacion_direccion).subscribe(
        response => {
          if (response.status == 'success') {
            this.arrayDirecciones = response.direcciones;
            console.log(this.arrayDirecciones);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.validator.errorInputRow(document.getElementById("txt_buscador_geolocation"));
    }
    this.comi_to_vali_update();
  }

  keyupComisionUpdate_get_latitud_longitud(latitud: any, longitud: any, display_name: any) {
    for (let i = 0; i < this.arrayDirecciones.length; i++) {
      const dir = this.arrayDirecciones[i];
      if (dir["display_name"] != display_name) {
        $("#radio_location_" + i).prop("checked", false);
      }
    }

    if (latitud != "" && longitud != "") {
      this.comi_ubicacion_latitud = latitud;
      this.comi_ubicacion_longitud = longitud;
      this.comi_ubicacion_display_name = display_name;
    } else {
      this.comi_ubicacion_latitud = "";
      this.comi_ubicacion_longitud = "";
      this.comi_ubicacion_display_name = "";
    }
    this.comi_to_vali_update();
  }

  comi_to_vali_update() {
    if (this.comi_proyecto != "" && this.validator.filtroAlfaNumerico(this.comi_proyecto) == true
      && this.comi_empleado_token != ""
      && this.comi_especificaciones != "" && this.validator.strFilter(this.comi_especificaciones) == true && this.comi_especificaciones.length >= 4
      && this.comi_fecha_salida != "" && this.validator.filtroFecha(this.comi_fecha_salida) == true
      && this.comi_time_duracion != 0 && this.validator.filtroNum(this.comi_time_duracion) == true
      && this.comi_tiempo_respuesta != 0 && this.validator.filtroNum(this.comi_tiempo_respuesta) == true
      && this.comi_ubicacion_latitud != "" && this.comi_ubicacion_longitud != "" && this.comi_ubicacion_display_name != "") {
      if (this.comi_recibe_dinero == true) {
        if (this.comi_dinero_recibido != '' && this.validator.filtroNum(this.comi_dinero_recibido) == true && this.comi_moneda_tkn != "") {
          this.comi_validate_to_update = true;
        } else {
          this.comi_validate_to_update = false;
        }
      } else {
        this.comi_validate_to_update = true;
      }

    } else {
      this.comi_validate_to_update = false;
    }
    console.log("this.comi_proyecto " + this.comi_proyecto);
    console.log("this.comi_empleado_token " + this.comi_empleado_token);
    console.log("this.comi_especificaciones " + this.comi_especificaciones);
    console.log("this.comi_fecha_salida " + this.comi_fecha_salida);
    console.log("this.comi_time_duracion " + this.comi_time_duracion);
    console.log("this.comi_recibe_dinero" + this.comi_recibe_dinero);
    console.log("this.comi_dinero_recibido " + this.comi_dinero_recibido);
    console.log("this.comi_tiempo_respuest " + this.comi_tiempo_respuesta);
    console.log("this.comi_califica_vhum" + this.comi_califica_vhum);
    console.log("this.comi_ubicacion_latitud" + this.comi_ubicacion_latitud);
    console.log("this.comi_ubicacion_longitud " + this.comi_ubicacion_longitud);
    console.log("this.comi_validate_to_update " + this.comi_validate_to_update);
  }

  inside_comportamiento(nodo: any) {
    if ($(nodo).hasClass("noneView")) {
      $(nodo).removeClass("noneView");
    } else {
      $(nodo).addClass("noneView");
    }
  }

  //nuevo registro
  listaPersonal() {
    this.trab_serv.catalogoGeneralTrabajadores().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.arrayEmpleados = response.empleados;
          console.log(this.arrayEmpleados)
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
    //let primer_dia = new Date(f_actual.getFullYear(), f_actual.getMonth(),1).getDate();
    let ultimo_dia = new Date(f_actual.getFullYear(), f_actual.getMonth() + 1, 0).getDate();
    //this.min_date = año+"-"+mes+"-0"+primer_dia;
    this.max_date = año + "-" + mes + "-" + ultimo_dia;
    console.log(this.min_date + " " + this.max_date);
  }

  keyupProyectoComision(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.comi_proyecto = event.value;
      this.validator.correctoInput(event, this.translate.instant("proy"));
    } else {
      this.comi_proyecto = "";
      this.validator.errorInput(event, this.translate.instant("proy_fail"));
    }
    this.comi_to_validate();
  }

  changeEmpleadoComision(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.arrayEmpleados.length; i++) {
        const row = this.arrayEmpleados[i];
        if (row["nombre_completo"] == event.value) {
          this.validator.correctoInput(event, this.translate.instant("employ"));
          this.comi_empleado_token = row["token_empleado_inside"];
          this.comi_to_validate();
          return;
        } else {
          this.comi_to_validate();
          this.validator.errorInput(event, this.translate.instant("employ_fail"));
          this.comi_empleado_token = "";
        }
      }
    } else {
      this.validator.errorInput(event, this.translate.instant("employ_fail"));
      this.comi_empleado_token = "";
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: "proveedor invalido, revisa tu información o comunicate a soporte",
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  keyupObservaComision(event: any) {
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.comi_especificaciones = event.value;
      this.validator.correctoTextarea(event, this.translate.instant("observ"));
    } else {
      this.comi_especificaciones = "";
      this.validator.errorTextarea(event, this.translate.instant("observ_fail"));
    }
    this.comi_to_validate();
  }

  keyupFechaSalidaComision(event: any) {
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.comi_fecha_salida = event.value;
      this.validator.correctoInput(event, this.translate.instant("comi_date"));
    } else {
      this.comi_fecha_salida = "";
      this.validator.errorInput(event, this.translate.instant("comi_date_fail"));
    }
    this.comi_to_validate();
  }

  keyupTiempoDuracionComision(event: any) {
    if (event.value != "" && this.validator.filtroNum(event.value) == true && event.value != 0) {
      this.comi_time_duracion = event.value;
      this.validator.correctoInput(event, this.translate.instant("comi_time"));
    } else {
      this.comi_time_duracion = 0;
      this.validator.errorInput(event, this.translate.instant("comi_time_fail"));
    }
    this.comi_to_validate();
  }

  changeRecibeDineroComision(event: any) {
    if (event.checked == true) {
      this.comi_recibe_dinero = true;
    } else {
      this.comi_recibe_dinero = false;
      this.comi_dinero_recibido = "";
      this.comi_moneda_tkn = "";
    }
    this.comi_to_validate();
  }

  keyupDineroRecibido(event: any) {
    if (event.value != '' && this.validator.filtroNum(event.value) == true) {
      this.comi_dinero_recibido = event.value;
      this.validator.correctoInput(event, this.translate.instant("total_import"));
    } else {
      this.comi_dinero_recibido = "";
      this.validator.errorInput(event, this.translate.instant("total_importfail"));
    }
    this.comi_to_validate();
  }

  keyupValidateMonedaComi(event: any) {
    console.log(event.value);
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      for (let i = 0; i < this.arrayMonedas.length; i++) {
        const money = this.arrayMonedas[i];
        if (money['moneda'] == event.value) {
          this.validator.correctoInput(event, this.translate.instant("mon_name"));
          console.log(money["token_monedas"]);
          this.comi_moneda_tkn = money["token_monedas"];
          this.comi_to_validate();
          return;
        } else {
          this.validator.errorInput(event, this.translate.instant("mon_name_fail"));
          this.comi_moneda_tkn = "";
          this.comi_to_validate();
        }
      }
    } else {
      this.validator.errorInput(event, this.translate.instant("mon_name_fail"));
      this.comi_moneda_tkn = "";
    }
    this.comi_to_validate();
  }

  registra_time_respuesta(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInput(event, this.translate.instant("resp_time"));
      if (event.value == "24 horas") {
        this.comi_tiempo_respuesta = 24;
      } else if (event.value == "48 horas") {
        this.comi_tiempo_respuesta = 48;
      } else if (event.value == "72 horas") {
        this.comi_tiempo_respuesta = 72;
      }
    } else {
      this.validator.errorInput(event, this.translate.instant("resp_time_fail"));
      this.comi_tiempo_respuesta = 0;
    }
    this.comi_to_validate();
  }

  califica_vhum(event: any) {
    if (event.checked == true) {
      this.comi_califica_vhum = true;
    } else {
      this.comi_califica_vhum = false;
    }
    this.comi_to_validate();
  }

  keyup_direccion_location(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.comi_ubicacion_direccion = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.comi_ubicacion_direccion = "";
      this.validator.errorInputRow(event);
    }
  }

  listar_direcciones() {
    if (this.comi_ubicacion_direccion != "" && this.validator.filtroAlfaNumerico(this.comi_ubicacion_direccion) == true) {
      this.dirServ.location_iq_dir(this.comi_ubicacion_direccion).subscribe(
        response => {
          if (response.status == 'success') {
            this.arrayDirecciones = response.direcciones;
            console.log(this.arrayDirecciones);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.validator.errorInputRow(document.getElementById("txt_buscador_geolocation"));
    }
  }

  get_latitud_longitud(latitud: any, longitud: any, display_name: any) {

    for (let i = 0; i < this.arrayDirecciones.length; i++) {
      const dir = this.arrayDirecciones[i];
      if (dir["display_name"] != display_name) {
        $("#radio_location_" + i).prop("checked", false);
      }
    }

    if (latitud != "" && longitud != "") {
      this.comi_ubicacion_latitud = latitud;
      this.comi_ubicacion_longitud = longitud;
      this.comi_ubicacion_display_name = display_name;
    } else {
      this.comi_ubicacion_latitud = "";
      this.comi_ubicacion_longitud = "";
      this.comi_ubicacion_display_name = "";
    }
    this.comi_to_validate();
  }

  comi_to_validate() {
    if (this.comi_proyecto != "" && this.validator.filtroAlfaNumerico(this.comi_proyecto) == true
      && this.comi_empleado_token != ""
      && this.comi_especificaciones != "" && this.validator.strFilter(this.comi_especificaciones) == true && this.comi_especificaciones.length >= 4
      && this.comi_fecha_salida != "" && this.validator.filtroFecha(this.comi_fecha_salida) == true
      && this.comi_time_duracion != 0 && this.validator.filtroNum(this.comi_time_duracion) == true
      && this.comi_tiempo_respuesta != 0 && this.validator.filtroNum(this.comi_tiempo_respuesta) == true
      && this.comi_ubicacion_latitud != "" && this.comi_ubicacion_longitud != "" && this.comi_ubicacion_display_name != "") {
      if (this.comi_recibe_dinero == true) {
        if (this.comi_dinero_recibido != '' && this.validator.filtroNum(this.comi_dinero_recibido) == true && this.comi_moneda_tkn != "") {
          this.comi_validate_to_save = true;
        } else {
          this.comi_validate_to_save = false;
        }
      } else {
        this.comi_validate_to_save = true;
      }

    } else {
      this.comi_validate_to_save = false;
    }
    console.log("this.comi_proyecto " + this.comi_proyecto);
    console.log("this.comi_empleado_token " + this.comi_empleado_token);
    console.log("this.comi_especificaciones " + this.comi_especificaciones);
    console.log("this.comi_fecha_salida " + this.comi_fecha_salida);
    console.log("this.comi_time_duracion " + this.comi_time_duracion);
    console.log("this.comi_recibe_dinero" + this.comi_recibe_dinero);
    console.log("this.comi_dinero_recibido " + this.comi_dinero_recibido);
    console.log("this.comi_tiempo_respuest " + this.comi_tiempo_respuesta);
    console.log("this.comi_califica_vhum" + this.comi_califica_vhum);
    console.log("this.comi_ubicacion_latitud" + this.comi_ubicacion_latitud);
    console.log("this.comi_ubicacion_longitud " + this.comi_ubicacion_longitud);
    console.log("this.comi_validate_to_save " + this.comi_validate_to_save);
  }

  cleanFormRegistro() {
    this.comi_proyecto = "";
    this.comi_empleado_token = "";
    this.comi_especificaciones = "";
    this.comi_fecha_salida = "";
    this.comi_time_duracion = 0;
    this.comi_recibe_dinero = false;
    this.comi_dinero_recibido = "";
    this.comi_califica_vhum = false;
    this.comi_ubicacion_latitud = "";
    this.comi_ubicacion_longitud = "";
    this.comi_ubicacion_display_name = "";
    this.comi_validate_to_save = false;
    this.arrayDirecciones.length = 0;

    this.validator.limpiaInput(document.getElementById("comi_proyecto"));
    this.validator.limpiaInput(document.getElementById("comi_empleado"));
    this.validator.limpiaTextareaWithLabel(document.getElementById("comi_large_observ"));
    this.validator.limpiaInput(document.getElementById("comi_date_salida"));
    this.validator.limpiaInput(document.getElementById("comi_time_duracion"));
    $("#comi_recibe_dinero").prop("checked", false);
    this.validator.limpiaInput(document.getElementById("comi_dinero_recibido"));
    this.validator.limpiaInput(document.getElementById("comi_moneda"));
    $("#comi_califica_vhum").prop("checked", false);
    this.validator.limpiaInputRow(document.getElementById("txt_buscador_geolocation"));
    this.arrayDirecciones = [];
  }

  onSaveComisionSolicitud() {
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
        this.comi_serv.save_comision(
          this.comi_proyecto,
          "null",
          this.comi_empleado_token,
          this.comi_especificaciones,
          this.comi_fecha_salida,
          this.comi_time_duracion,
          this.comi_recibe_dinero,
          this.comi_dinero_recibido,
          this.comi_moneda_tkn,
          this.comi_tiempo_respuesta,
          this.comi_califica_vhum,
          true,
          this.comi_ubicacion_latitud,
          this.comi_ubicacion_longitud,
          this.comi_ubicacion_display_name,
          '', ''
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
              this.lista_comisiones_no_concluidas();
              this.lista_comisiones_concluidas();
              this.lista_comisiones_deshabilitadas();
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
}
