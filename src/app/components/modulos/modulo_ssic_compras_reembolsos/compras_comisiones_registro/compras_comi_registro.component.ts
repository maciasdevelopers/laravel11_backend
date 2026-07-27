import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { SsicComisionesService } from '../../../../servicios/ssic/ssic-comisiones.service';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { DireccionesService } from "../../../../servicios/ssic/direcciones.service";
import { MonedasService } from "../../../../servicios/monedas.service";
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { SessionContextService } from '../../../../servicios/session-context';
declare var zxcvbn: any;
@Component({
  selector: 'app_compras_egr_comi_registro',
  templateUrl: './compras_comi_registro.component.html',
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
    '../../../../styles/dirpostales.css',
    '../../modulo_ssic_egresos/egresos.css',
    './compras_comi_registro.component.css'
  ]
})
export class EgresosComisionesRegistrarComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  catalogo_monedas_api: any = [];
  arrayComisionados: any = [];
  //nuevo registro
  reem_opcion_comi = null;
  public min_date: string = "";
  public max_date: string = "";
  public comi_proyecto: string = "";
  public comisionado_tipo: string = "";
  public comisionado_token: string = "";
  public comi_empleado_nombre: string = "";
  public comi_especificaciones: string = "";
  public comi_fecha_salida: string = "";
  public comi_time_duracion: number = 0;
  public comi_recibe_dinero: boolean = false;
  public comi_dinero_recibido: string = "";
  public comi_moneda_tkn: string = "";
  public comi_moneda_name: string = "";
  public comi_tiempo_respuesta: number = 72;
  public comi_califica_vhum: boolean = false;
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

  constructor(
    private sentinela: SentinelArkManager,
    private comi_serv: SsicComisionesService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private dirServ: DireccionesService,
    private sessionContext: SessionContextService,
    private relInterna: ComunicacionInternaService,
    private _monedasServ: MonedasService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
  }

  ngOnInit(): void {
    this.getRespuestaComiReemSeccionModule();
    this.get_mes();
  }

  getRespuestaComiReemSeccionModule() {
    this.relInterna.mensajeComiReemSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_comi_registro") {
          console.log(mensaje);
          if (this.catalogo_monedas_api.length === 0) this.monedas_lista();
          if (this.arrayComisionados.length === 0) this.lista_empleados();
        }
      }
    );
  }

  get permiso_crear() {
    return this.sessionContext.privilegio_crear;
  }

  monedas_lista() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  lista_empleados() {
    this.comi_serv.comisionados_lista().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.arrayComisionados = response.comisionados_lista;
        }
      }, error => { console.log(error); }
    );
  }

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

  keyupProyectoComision(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.comi_proyecto = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeEmpleadoComision(comisionado_token: string) {
    console.log(comisionado_token);
    var comi_sionado_opcion = document.getElementById("comi_sionado_opcion")
    const comi_sionables_lista = this.arrayComisionados.find((trab: any) => trab.comisionado_token === comisionado_token);
    const validacion = comisionado_token != "" && typeof comi_sionables_lista !== 'undefined';
    this.comisionado_tipo = validacion ? comi_sionables_lista.comisionado_tipo : '';
    this.comisionado_token = validacion ? comi_sionables_lista.comisionado_token : '';
    validacion ? this.validator.correctoSelectBrowser(comi_sionado_opcion) : this.validator.errorSelectBrowser(comi_sionado_opcion);

    if (!validacion) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: "comisionado invalido, revisa tu información o comunicate a soporte",
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  keyupObservaComision(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
    this.comi_especificaciones = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupFechaSalidaComision(event: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.comi_fecha_salida = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTiempoDuracionComision(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value != 0;
    this.comi_time_duracion = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeRecibeDineroComision(event: any) {
    this.comi_recibe_dinero = event.checked ? true : false;
    if (!event.checked) {
      this.comi_dinero_recibido = "";
      this.comi_moneda_tkn = "";
    }
  }

  keyupDineroRecibido(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.comi_dinero_recibido = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get activateMoneda(): Boolean {
    const validacion = this.comi_recibe_dinero == true && this.comi_dinero_recibido != '';
    return validacion;
  }

  keyupValidateMonedaComi(event: any) {
    console.log(event.value);
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    const mnd = this.catalogo_monedas_api.find((row: any) => row.langEN === event.value || row.code === event.value);
    this.comi_moneda_tkn = validar ? mnd.code : '';
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  califica_vhum(event: any) {
    this.comi_califica_vhum = event.checked ? true : false;
  }

  buscaCodPostalDipomex(event: any) {
    const validacion = event.value != '' && this.validator.filtroNumericoSat(event.value) && event.value.length == 5;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.listarColoniasDipomex(event.value) : null;
  }

  listarColoniasDipomex(c_postal: any) {
    this.dipomex_cod_postal_colonias = [];
    this.dipomex_cod_postal_estado = "";
    this.dipomex_cod_postal_municipio = "";
    this.dipomex_cod_postal_cp = "";
    this.dipomex_cod_postal_colonia_vinculada = "";

    this.dirServ.postCodPostalDipomex(c_postal).subscribe(
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

  get comi_to_validate(): Boolean {
    const comi_proy = this.comi_proyecto != "" && this.validator.filtroAlfaNumerico(this.comi_proyecto);
    const comi_empl = this.comisionado_token != "";
    const comi_espe = this.comi_especificaciones != "" && this.validator.strFilter(this.comi_especificaciones) && this.comi_especificaciones.length >= 4;
    const comi_fsli = this.comi_fecha_salida != "" && this.validator.filtroFecha(this.comi_fecha_salida);
    const comi_dura = this.comi_time_duracion != 0 && this.validator.filtroNum(this.comi_time_duracion);
    const comi_resp = this.comi_tiempo_respuesta != 0 && this.validator.filtroNum(this.comi_tiempo_respuesta);
    const comi_dine = !this.comi_recibe_dinero || (this.comi_recibe_dinero && this.comi_dinero_recibido != '' && this.validator.filtroNum(this.comi_dinero_recibido) && this.comi_moneda_tkn != '');
    const comi_dire = this.dipomex_cod_postal_estado != '' && this.dipomex_cod_postal_municipio != '' && this.dipomex_cod_postal_cp != '' && this.dipomex_cod_postal_colonia_vinculada != '';
    return comi_proy && comi_empl && comi_espe && comi_fsli && comi_dura && comi_resp && comi_dine && comi_dire;
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
    this.dipomex_cod_postal_colonias = [];
    this.dipomex_cod_postal_estado = "---";
    this.dipomex_cod_postal_municipio = "---";
    this.dipomex_cod_postal_cp = "---";
    this.dipomex_cod_postal_colonias = [];
    this.dipomex_cod_postal_colonia_vinculada = "";
    this.validator.limpiaInput(document.getElementById("comi_proyecto"));
    this.validator.limpiaInputRowClases(document.getElementById("comi_sionado_opcion"));
    this.validator.limpiaInput(document.getElementById("comi_large_observ"));
    this.validator.limpiaInput(document.getElementById("comi_date_salida"));
    this.validator.limpiaInput(document.getElementById("comi_time_duracion"));
    $("#comi_recibe_dinero").prop("checked", false);
    this.validator.limpiaInput(document.getElementById("comi_dinero_recibido"));
    this.validator.limpiaInput(document.getElementById("comi_moneda"));
    $("#comi_califica_vhum").prop("checked", false);
    this.validator.limpiaInputRow(document.getElementById("txt_buscador_cpostal"));
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
          this.comisionado_tipo,
          this.comisionado_token,
          this.comi_especificaciones,
          this.comi_fecha_salida,
          this.comi_time_duracion,
          this.comi_recibe_dinero,
          this.comi_dinero_recibido,
          this.comi_moneda_tkn,
          this.comi_tiempo_respuesta,
          this.comi_califica_vhum,
          true,
          this.dipomex_cod_postal_estado,
          this.dipomex_cod_postal_municipio,
          this.dipomex_cod_postal_cp,
          this.dipomex_cod_postal_colonia_vinculada,
          this.listnewdireccionNac
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
              this.relInterna.mensajeEgresosComisionNoConcluida("comision_no_concluida");
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
