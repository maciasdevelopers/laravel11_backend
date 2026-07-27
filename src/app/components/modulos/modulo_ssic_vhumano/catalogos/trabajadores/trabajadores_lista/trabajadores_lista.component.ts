import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { trabajadoresModelo } from '../../../../../../modelos/trabajadoresModelo';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaisService } from '../../../../../../servicios/ssic/pais.service';
import { InterfPais } from '../../../../../../interfaces/interf-pais';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { CentrosTrabajoService } from '../../../../../../servicios/ssic/centros-trabajo-service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { trabajadoresBajaModelo } from '../../../../../../modelos/trabajadoresBajaModelo';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { SessionContextService } from '../../../../../../servicios/session-context';

@Component({
  selector: 'vhumano_trabajadores_catalogos',
  templateUrl: './trabajadores_lista.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/breadcrumb.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/canvas.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/cards.css',
    '../../../vhumano.css',
    './trabajadores_lista.component.css',
  ],
  providers: [ConfirmationService]
})
export class VHTrabajadoresListaComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  catalogo_trabajadores_list: any = [];
  catalogo_empleados_detalle: any = [];
  catalogo_trabajadores_activos_list: any = [];
  catalogo_trabajadores_inactivos_list: any = [];
  catalogo_trabajadores_eliminados_list: any = [];
  public trab_ee_ver_registro: boolean = false;
  public trab_ee_ver_detalle: boolean = false;

  public modeloTrab: trabajadoresModelo;
  public bajaModeloTrab: trabajadoresBajaModelo;
  separateDialCode = false;
  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  phoneForm: FormGroup;
  trab_sexo: any = [];
  trab_estado_civil: any = [];
  trab_tipo_telefonos: any = [];
  trab_licencia_tipos: any = [];
  trab_entidades_federativas: any = [];
  trab_lista_tipos_salario: any = [];
  trab_lista_tipos_contrato: any = [];
  fechaVencimientoInformativa: string = '';
  trab_empleo_act_ant: any = [];
  trab_referencias_personales: any = [];
  paises_lista: any = [];
  lista_bancos: any = [];
  trabajador_detail: any = [];
  public trabajador_detail_ver: boolean = false;
  public trabajador_detail_folio: string = "";
  public trabajador_detail_centro_de_trabajo: string = "";
  catalogo_centros_trabajo: any = [];
  trab_informacion_personal: any = [];

  trab_historial_de_sueldos: any = [];
  public trab_sueldo_salario_diario: string = "";
  public trab_sueldo_salario_integrado: string = "";
  public trab_sueldo_entra_en_vigor: string = "";
  public trab_sueldo_observacion: string = "";

  trab_informacion_pasaporte: any = [];
  trab_informacion_visa: any = [];
  trab_informacion_licencia: any = [];
  public popUpAccept: string = "";
  public popUpReject: string = "";

  nomina_jornadas: any = [];
  nomina_jornada_empleado = null;

  nomina_turnos: any = [];
  nomina_turno_empleado = null;

  nomina_periodos: any = [];
  nomina_periodicidad = null;
  catalogo_monedas_api: any = [];
  nomina_moneda = null;

  public alta_trabajador_ver: boolean = false;
  public baja_trabajador_ver: boolean = false;
  emp_habilita_centros_de_trabajo: boolean = true;

  constructor(
    private sentinela: SentinelArkManager,
    private translate: TranslateService,
    private bancos: BancosServService,
    private validator: ValidatorServService,
    private trab_serv: EmpleadosService,
    private dirServ: DireccionesService,
    private primeAlerts: MessageService,
    private _pais: PaisService,
    private ctraserv: CentrosTrabajoService,
    private relInterna: ComunicacionInternaService,
    private confirmationService: ConfirmationService,
    private servXlsx: DescargaExcel,
    private _monedasServ: MonedasService,
    private sessionContext: SessionContextService,
    private fb: FormBuilder
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.modeloTrab = new trabajadoresModelo('', '', '', 0, '', '', [], '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', [], [], '', '', '', [], [], '', false, '', '', '', '', '', 0, false, [], [], '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 2, '', '', '', '');
    this.bajaModeloTrab = new trabajadoresBajaModelo('', '', '');
    this.phoneForm = this.fb.group({
      telefono: ['', [Validators.required]],
      estado_civil: [this.modeloTrab.estado_civil || null], // valor que viene de la BD
      sexo: [this.modeloTrab.sexo || null],
      domicilio_colonia_vinculada: [this.modeloTrab.domicilio_colonia_vinculada || null],
      nacionalidad: [this.modeloTrab.origen_nacionalidad || null],
      contacto_telefono_tipo: [this.modeloTrab.contacto_telefono_tipo || null],
      documentacion_pasaporte_expide: [this.modeloTrab.documentacion_pasaporte_expide || null],
      documentacion_visa_expide: [this.modeloTrab.documentacion_visa_expide || null],
      documentacion_licencia_clave: [this.modeloTrab.documentacion_licencia_nivel || null],
      documentacion_licencia_expide: [this.modeloTrab.documentacion_licencia_expide || null],
      cbancariaBankNombreComercial: [this.modeloTrab.cbancaria_banco_nombre_comercial || null],
      salario_tipo_de: [this.modeloTrab.salario_tipo || null],
      contrato_tipo: [this.modeloTrab.contratacion_tipo || null],
      nomina_periodicidad: [this.modeloTrab.nomina_periodicidad || null],
      nomina_moneda: [this.modeloTrab.nomina_moneda || null],
      nomina_jornada: [this.modeloTrab.tipo_jornada || null],
      nomina_turno: [this.modeloTrab.turno || null],
    });
  }

  ngOnInit(): void {
    this.pedir_seleccion_trabajo_centro();
    this.listando_catalogo_trabajadores();
    this.listando_catalogo_trab_activos();
    this.listando_catalogo_trab_inactivos();
    this.listando_catalogo_trab_eliminados();
    this.listandoPaises();
    this.descarga_centros_de_trabajo();
    this.getCatalogoBancos();
    this.getRespuestaTrabajadorRegistro();
    this.monedasCatalogoApi();
    this.translate.get(['sex_m', 'sex_f', 'sex_o', 'soltero', 'casado', 'divorciado', 'viudo', 'union_lib']).subscribe(translations => {
      this.trab_sexo = [
        { key: '0', label: translations['sex_m'], opcion: 'M' },
        { key: '1', label: translations['sex_f'], opcion: 'F' },
        { key: '2', label: translations['sex_o'], opcion: 'Otro' }
      ];
      this.trab_estado_civil = [
        { key: '0', label: translations['soltero'], opcion: 'Soltero' },
        { key: '1', label: translations['casado'], opcion: 'Casado' },
        { key: '2', label: translations['divorciado'], opcion: 'Divorciado' },
        { key: '3', label: translations['viudo'], opcion: 'Viudo' },
        { key: '4', label: translations['union_lib'], opcion: 'Unión libre' }
      ];
    });

    this.trab_tipo_telefonos = [
      { key: '0', label: 'casa', opcion: 'casa' },
      { key: '1', label: 'movil', opcion: 'movil' },
      { key: '2', label: 'Trabajo', opcion: 'trabajo' },
      { key: '3', label: 'fax', opcion: 'fax' },
      { key: '4', label: 'otro', opcion: 'otro' },
    ];

    this.trab_empleo_act_ant = [
      { key: '0', concepto: 'Tiempo que prestó sus servicios', ant1: '', ant2: '', ant3: '' },
      { key: '1', concepto: 'Nombre de la Empresa', ant1: '', ant2: '', ant3: '' },
      { key: '2', concepto: 'Domicilio', ant1: '', ant2: '', ant3: '' },
      { key: '3', concepto: 'Teléfono', ant1: '', ant2: '', ant3: '' },
      {
        key: '4', concepto: 'Puesto',
        ant1: [{ inicial: '', final: '' }],
        ant2: [{ inicial: '', final: '' }],
        ant3: [{ inicial: '', final: '' }]
      },
      {
        key: '4', concepto: 'Sueldos',
        ant1: [{ inicial: '', final: '' }],
        ant2: [{ inicial: '', final: '' }],
        ant3: [{ inicial: '', final: '' }]
      },
      { key: '4', concepto: 'Motivos de su separación', ant1: '', ant2: '', ant3: '' },
      { key: '4', concepto: 'Nombre de su jefe inmediato', ant1: '', ant2: '', ant3: '' },
      { key: '4', concepto: 'Actividades Desempeñadas', ant1: '', ant2: '', ant3: '' },
    ];

    this.trab_licencia_tipos = [
      { key: '0', nivel: 'federal', tipo: 'A', opcion: 'federal tipo A: Pasajeros, turismo y carga (básica para chóferes de carretera).', vigencia: 5, permanente: false },
      { key: '1', nivel: 'federal', tipo: 'B', opcion: 'federal tipo B: Servicio de autotransporte federal de pasajeros en autobuses (foráneos)', vigencia: 3, permanente: false },
      { key: '2', nivel: 'federal', tipo: 'C', opcion: 'federal tipo C: Servicio de autotransporte federal de carga en camiones unitarios y tractocamiones.', vigencia: 3, permanente: false },
      { key: '3', nivel: 'federal', tipo: 'D', opcion: 'federal tipo D: Servicio de autotransporte de pasajeros en turismo (camiones de excursión).', vigencia: 3, permanente: false },
      { key: '4', nivel: 'federal', tipo: 'E', opcion: 'federal tipo E: Servicio de doble remolque (tractocamiones de dos remolques en carreteras federales).', vigencia: 3, permanente: false },
      { key: '5', nivel: 'federal', tipo: 'F', opcion: 'federal tipo F: Para conducir ferrocarriles', vigencia: 3, permanente: false },
      { key: '6', nivel: 'estatal', tipo: 'A', opcion: 'estatal tipo A: Automovilista particular.', vigencia: 3, permanente: false },
      { key: '7', nivel: 'estatal', tipo: 'B', opcion: 'estatal tipo B: Chofer particular o transporte público/taxi.', vigencia: 3, permanente: false },
      { key: '8', nivel: 'estatal', tipo: 'C', opcion: 'estatal tipo C: Vehículos de carga.', vigencia: 3, permanente: false },
      { key: '9', nivel: 'estatal', tipo: 'D', opcion: 'estatal tipo D: Transporte de pasajeros (camiones urbanos, microbuses).', vigencia: 3, permanente: false },
      { key: '10', nivel: 'estatal', tipo: 'E', opcion: 'estatal tipo E: Vehículos de emergencia o especiales.', vigencia: 3, permanente: false },
      { key: '11', nivel: 'federal', tipo: 'A', opcion: 'federal tipo A: Pasajeros, turismo y carga (licencia permanente).', vigencia: null, permanente: true },
      { key: '12', nivel: 'estatal', tipo: 'A', opcion: 'estatal tipo A: Automovilista particular (licencia permanente).', vigencia: null, permanente: true },
    ];

    this.trab_entidades_federativas = [
      { clave: 'aguascalientes', nombre: 'Aguascalientes' },
      { clave: 'bajacalifornia', nombre: 'Baja California' },
      { clave: 'bajacaliforniasur', nombre: 'Baja California Sur' },
      { clave: 'campeche', nombre: 'Campeche' },
      { clave: 'coahuila', nombre: 'Coahuila' },
      { clave: 'colima', nombre: 'Colima' },
      { clave: 'chiapas', nombre: 'Chiapas' },
      { clave: 'chihuahua', nombre: 'Chihuahua' },
      { clave: 'ciudaddemexico', nombre: 'Ciudad de México' },
      { clave: 'durango', nombre: 'Durango' },
      { clave: 'guanajuato', nombre: 'Guanajuato' },
      { clave: 'guerrero', nombre: 'Guerrero' },
      { clave: 'hidalgo', nombre: 'Hidalgo' },
      { clave: 'jalisco', nombre: 'Jalisco' },
      { clave: 'mexico', nombre: 'México' },
      { clave: 'michoacan', nombre: 'Michoacán' },
      { clave: 'morelos', nombre: 'Morelos' },
      { clave: 'nayarit', nombre: 'Nayarit' },
      { clave: 'nuevoleon', nombre: 'Nuevo León' },
      { clave: 'oaxaca', nombre: 'Oaxaca' },
      { clave: 'puebla', nombre: 'Puebla' },
      { clave: 'queretaro', nombre: 'Querétaro' },
      { clave: 'quintanaroo', nombre: 'Quintana Roo' },
      { clave: 'sanluispotosi', nombre: 'San Luis Potosí' },
      { clave: 'sinaloa', nombre: 'Sinaloa' },
      { clave: 'sonora', nombre: 'Sonora' },
      { clave: 'tabasco', nombre: 'Tabasco' },
      { clave: 'tamaulipas', nombre: 'Tamaulipas' },
      { clave: 'tlaxcala', nombre: 'Tlaxcala' },
      { clave: 'veracruz', nombre: 'Veracruz' },
      { clave: 'yucatan', nombre: 'Yucatán' },
      { clave: 'zacatecas', nombre: 'Zacatecas' }
    ];

    this.trab_lista_tipos_salario = [
      { clave: 'Salario fijo', nombre: 'Salario fijo' },
      { clave: 'Salario variable', nombre: 'Salario variable' },
      { clave: 'Salario mixto', nombre: 'Salario mixto' }
    ];

    this.trab_lista_tipos_contrato = [
      { clave: 'contrattimeindet', tipo: 'Por tiempo indeterminado' },
      { clave: 'contrattimedet', tipo: 'Por tiempo determinado' },
      //{clave:'contratobratimedet', tipo:'Por obra o tiempo determinado'},
      { clave: 'contratpertest', tipo: 'Periodo de prueba' },
      { clave: 'contratcapacinicial', tipo: 'Capacitación inicial' },
      //{clave:'contratoutsourcing', tipo:'Outsourcing (Servicios especializados)'},
      //{clave:'contratjornreductimeparc', tipo:'Jornada reducida o tiempo parcial'},
      { clave: 'contrattemporada', tipo: 'Temporada' },
      { clave: 'honorarios', tipo: 'Honorarios' },
      //{clave:'contratteletrabajo', tipo:'Teletrabajo (home office)'},
    ];

    this.nomina_periodos = [
      { periodicidad: 'semanal' },
      { periodicidad: 'catorcenal' },
      { periodicidad: 'quincenal' },
      { periodicidad: 'mensual' },
      { periodicidad: 'bimestral' },
      { periodicidad: 'trimestral' },
      { periodicidad: 'cuatrimestral' },
      { periodicidad: 'semestral' },
      { periodicidad: 'anual' }
    ];

    this.nomina_jornadas = [
      { jornada: 'Completa' },
      { jornada: 'Reducida' }
    ];

    this.nomina_turnos = [
      { turno: 'Matutino' },
      { turno: 'Vespertino' },
      { turno: 'Nocturno' }
    ];
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

  pedir_seleccion_trabajo_centro() {
    this.emp_habilita_centros_de_trabajo = this.sessionContext.empresa_data?.habilita_centros_de_trabajo;
  }

  getRespuestaTrabajadorRegistro() {
    this.relInterna.mensajeVHTrabajadorRegistro$.subscribe(
      (mensaje: any) => {
        if (mensaje == "trabajador_registrado") {
          this.listando_catalogo_trabajadores();
          this.listando_catalogo_trab_eliminados();
        }
      }
    );
  }

  listando_catalogo_trabajadores() {
    this.trab_serv.catalogoGeneralTrabajadores().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogo_trabajadores_list = response.empleados;
        }
      }, error => { console.log(error); }
    );
  }

  listando_catalogo_trab_activos() {
    this.trab_serv.catalogoTrabajadoresActivos().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogo_trabajadores_activos_list = response.empleados;
        }
      }, error => { console.log(error); }
    );
  }

  altaTrabajador(token_empleado_vhum: any, baja_motivo: any, baja_fecha: any) {
    this.bajaModeloTrab.token_empleado_vhum = token_empleado_vhum;
    this.bajaModeloTrab.baja_motivo = baja_motivo;
    this.bajaModeloTrab.baja_fecha_contabilizacion = baja_fecha;
    this.alta_trabajador_ver = true;
  }

  dardealtaTrabajador(token_empleado_vhum: any) {
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
        //this.viewFormulario = false;
        this.trab_serv.altaTrabajador(token_empleado_vhum).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.alta_trabajador_ver = false;
              this.bajaModeloTrab = new trabajadoresBajaModelo('', '', '');
              this.listando_catalogo_trabajadores();
              this.listando_catalogo_trab_activos();
              this.listando_catalogo_trab_inactivos();
              this.listando_catalogo_trab_eliminados();
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
    });
  }

  bajaTrabajador(token_empleado_vhum: any) {
    this.bajaModeloTrab.token_empleado_vhum = token_empleado_vhum;
    this.baja_trabajador_ver = true;
  }

  keyupWorkerBajaMotivo(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.bajaModeloTrab.baja_motivo = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeWorkerBajaFecha(event: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.bajaModeloTrab.baja_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  dardebajaTrabajador(token_empleado_vhum: any) {
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
        //this.viewFormulario = false;
        this.trab_serv.bajaTrabajador(token_empleado_vhum, this.bajaModeloTrab.baja_motivo, this.bajaModeloTrab.baja_fecha_contabilizacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.validator.limpiaInputRow(document.getElementById("trabajadorBajaMotivo"));
              this.validator.limpiaInputRow(document.getElementById("trabajadorBajaFecha"));
              this.baja_trabajador_ver = false;
              this.bajaModeloTrab = new trabajadoresBajaModelo('', '', '');
              this.listando_catalogo_trabajadores();
              this.listando_catalogo_trab_activos();
              this.listando_catalogo_trab_inactivos();
              this.listando_catalogo_trab_eliminados();
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
    });
  }

  listando_catalogo_trab_inactivos() {
    this.trab_serv.catalogoTrabajadoresInactivos().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogo_trabajadores_inactivos_list = response.empleados;
        }
      }, error => { console.log(error); }
    );
  }

  verRegistroEmpleado() {
    this.trab_ee_ver_registro = true;
  }

  descarga_excel_trabajadores() {
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
      { label: this.translate.instant("prepayment"), field: "pago_anticipado", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund"), field: "importe_total_inicial", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth"), field: "importe_autorizado_inicial_format", rowspan: 2, align: "right" },
      { label: this.translate.instant("total_refund_auth_converse"), field: "importe_autorizado_final", rowspan: 2, align: "right" },
      { label: "DEBE", field: "debe_format", rowspan: 2, align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento(this.catalogo_trabajadores_list, columnas, 'Ordenes de pago', 'orden_pago_lista_aprobadas.xlsx');
  }

  verDetalleEmpleado(token_empleado_vhum: any) {
    this.trabajador_detail = [];
    this.trabajador_detail_folio = "";
    this.trab_informacion_personal = [];
    this.trab_historial_de_sueldos = [];
    //console.log(token_empleado_vhum);
    const trabajador_find = this.catalogo_trabajadores_list.find((row: any) => row.token_empleado_vhum === token_empleado_vhum);
    if (typeof trabajador_find !== 'undefined') {
      this.trab_serv.valorHumanoTrabajadoresDetalle(token_empleado_vhum).subscribe(
        response => {
          console.log(response);
          if (response.status == 'success') {
            this.trabajador_detail_ver = true;
            this.trabajador_detail = response.empleado_info;

            response.empleado_info.forEach((trab: any) => {
              this.trabajador_detail_folio = trab.folio_empleado;
              this.trab_informacion_personal = trab.informacion_personal;
              this.trab_historial_de_sueldos = trab.historial_de_sueldos;
              trab.informacion_personal.forEach((pers: any) => {
                this.modeloTrab.apePaterno = pers.paterno;
                this.modeloTrab.apeMaterno = pers.materno;
                this.modeloTrab.nombres = pers.nombres;
                this.modeloTrab.edad = pers.edad;
                this.modeloTrab.sexo = pers.sexo;
                this.modeloTrab.estado_civil = pers.estado_civil;

                if (pers.sexo != '') this.phoneForm.patchValue({ sexo: pers.sexo });
                if (pers.estado_civil != '') this.phoneForm.patchValue({ estado_civil: pers.estado_civil });
                if (pers.nacionalidad != '') this.phoneForm.patchValue({ nacionalidad: pers.nacionalidad_pais });
                if (pers.bancCuentaBancoNombreComercial != '') this.phoneForm.patchValue({ cbancariaBankNombreComercial: pers.bancCuentaBancoNombreComercial });
                if (pers.salario_tipo != '') this.phoneForm.patchValue({ salario_tipo_de: pers.salario_tipo });
                if (pers.contratacion_tipo != '') this.phoneForm.patchValue({ contrato_tipo: pers.contratacion_tipo_nombre });

                pers.direcciones.forEach((dir: any) => {
                  this.modeloTrab.domicilio_CalleNumero = dir.calle;
                  this.modeloTrab.domicilio_cod_postal = dir.c_postal_edit;
                  this.modeloTrab.domicilio_colonia_vinculada = dir.colonia_edit;
                  this.modeloTrab.domicilio_municipio = dir.municipio_edit;
                  this.modeloTrab.domicilio_estado = dir.estado_edit;

                  if (dir.colonia_edit != '') this.phoneForm.patchValue({ domicilio_colonia_vinculada: dir.colonia_edit });

                  this.dirServ.postCodPostalDipomex(dir.c_postal_edit).subscribe(
                    response => {
                      if (response.status == "success") {
                        console.log(response.cod_postal);
                        this.modeloTrab.domicilio_colonias_por_cp = response.cod_postal["colonias"];
                      } else {
                        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: this.translate.instant(response.message) });
                      }
                    },
                    error => {
                      //console.log(error);
                    }
                  )
                });

                this.modeloTrab.origen_nacimiento_fecha = pers.fecha_nacimiento;
                this.modeloTrab.origen_nacimiento_lugar = pers.lugar_nacimiento;
                this.modeloTrab.origen_nacionalidad = pers.nacionalidad_token;

                this.modeloTrab.contacto_telefono_tipo = pers.telefono_tipo;
                this.modeloTrab.contacto_telefono_numero = pers.telefono_numero;

                this.phoneForm.patchValue({
                  contacto_telefono_tipo: pers.telefono_tipo,
                  telefono: pers.telefono_numero
                });

                this.modeloTrab.contacto_email = pers.correo;

                this.modeloTrab.documentacion_curp = pers.curp;
                this.modeloTrab.documentacion_rfc = pers.rfc;
                this.modeloTrab.documentacion_pasaporte_list_registrados = pers.pasaporte;
                this.modeloTrab.documentacion_visa_list_registrados = pers.visa;
                this.modeloTrab.documentacion_numero_de_seguridad_social = pers.numero_de_seguridad_social;
                this.modeloTrab.documentacion_licencia_list_registrados = pers.licenciaConducir;

                this.modeloTrab.cbancaria_banco_token = pers.bancCuentaBancoToken;
                this.modeloTrab.cbancaria_banco_clave = pers.bancCuentaBancoClave;
                this.modeloTrab.cbancaria_banco_nombre_comercial = pers.bancCuentaBancoNombreComercial;
                this.modeloTrab.cbancaria_cuenta = pers.bancCuentaCuenta;
                this.modeloTrab.cbancaria_clabe_inter = pers.bancCuentaClabeInter;
                this.modeloTrab.cbancaria_sucursal = pers.bancCuentaSucursal;
                this.modeloTrab.centro_de_trabajo = pers.centro_de_trabajo_uuid;
                this.trabajador_detail_centro_de_trabajo = pers.centro_de_trabajo_folio;

                this.modeloTrab.departamento = pers.departamento;
                this.modeloTrab.puesto = pers.puesto;
                this.modeloTrab.salario_tipo = pers.salario_tipo;
                this.modeloTrab.contratacion_tipo = pers.contratacion_tipo;
                this.modeloTrab.contratacion_fecha = pers.contratacion_fecha;
                this.modeloTrab.fecha_alta_en_empresa = pers.alta_en_empresa;

                this.modeloTrab.nomina_periodicidad = pers.nomina_periodicidad;
                this.phoneForm.patchValue({ nomina_periodicidad: pers.nomina_periodicidad });
                this.modeloTrab.nomina_moneda = pers.nomina_moneda;
                this.phoneForm.patchValue({ nomina_moneda: pers.nomina_moneda });
                this.modeloTrab.tipo_jornada = pers.nomina_jornada;
                this.phoneForm.patchValue({ nomina_jornada: pers.nomina_jornada });
                this.modeloTrab.turno = pers.nomina_turno
                this.phoneForm.patchValue({ nomina_turno: pers.nomina_turno });

                this.modeloTrab.nomina_salario_diario = pers.nomina_salario_diario;
                this.modeloTrab.nomina_salario_integrado = pers.nomina_salario_integrado;
              });
            });
            console.log(this.trabajador_detail);
          }
        }, error => { console.log(error); }
      );
    }
  }

  descarga_centros_de_trabajo() {
    this.ctraserv.catalogoGeneralCentrosTrabajo().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.catalogo_centros_trabajo = response.cent_trab;
          console.log(this.catalogo_centros_trabajo);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  listandoPaises() {
    this._pais.getListaPais().subscribe((data: InterfPais[]) => {
      this.paises_lista = data;
      console.log(this.paises_lista);
    });
  }

  getCatalogoBancos() {
    this.bancos.getListaBancos().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.lista_bancos = response.banco;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyupTrabPaterno(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.apePaterno = event.value;
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4 && this.modeloTrab.apePaterno != trab_pers.paterno;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabMaterno(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.apeMaterno = event.value;
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4 && this.modeloTrab.apeMaterno != trab_pers.materno;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabNombres(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.nombres = event.value;
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 3 && this.modeloTrab.nombres != trab_pers.nombres;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabEdad(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.edad = event.value;
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && this.modeloTrab.edad != trab_pers.edad;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabSexo(sexo: any, token_empleado_vhum: any) {
    console.log(sexo);
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabSexo = document.getElementById("trabEditSexo");
    let pgda = this.trab_sexo.find((row: any) => sexo != '' && row.opcion === sexo);
    console.log(pgda);
    this.modeloTrab.sexo = pgda.opcion;
    console.log(this.modeloTrab.sexo);
    const validacion = sexo != "" && this.validator.strFilter(sexo) && typeof pgda !== 'undefined' && this.modeloTrab.sexo != trab_pers.sexo;
    validacion ? this.validator.correctoSelectBrowser(trabSexo) : this.validator.errorSelectBrowser(trabSexo);
  }

  keyupTrabEstadoCivil(e_civil: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabEstadoCivil = document.getElementById("trabEditEstadoCivil");
    let pgda = this.trab_estado_civil.find((row: any) => e_civil != '' && row.opcion === e_civil);
    this.modeloTrab.estado_civil = pgda.opcion;
    const validacion = e_civil != "" && this.validator.strFilter(e_civil) && typeof pgda !== 'undefined' && this.modeloTrab.estado_civil != trab_pers.estado_civil;
    validacion ? this.validator.correctoSelectBrowser(trabEstadoCivil) : this.validator.errorSelectBrowser(trabEstadoCivil);
  }

  keyupTrabDomicilioCalleNumero(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.filter((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    //const trab_dir = trab_pers.find((trab:any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.domicilio_CalleNumero = event.value;
    const valid_main = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    const validacion = trab_pers?.direcciones?.length > 0 ? valid_main && this.modeloTrab.domicilio_CalleNumero != trab_pers.direcciones[0].calle : valid_main;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  buscaCodPostalDipomex(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    //trab_informacion_personal direcciones dir.c_postal_edit;
    //trab_informacion_personal direcciones dir.colonia_edit;
    //trab_informacion_personal direcciones dir.municipio_edit;
    //trab_informacion_personal direcciones dir.estado_edit;
    var trabDomicilioColonia = document.getElementById("trabEditDomicilioColonia");
    var trabDomicilioMunicipio = document.getElementById("trabEditDomicilioMunicipio");
    var trabDomicilioEstado = document.getElementById("trabEditDomicilioEstado");
    const valid_main = event.value != "" && this.validator.filtroNumericoCPostal(event.value) && event.value.length == 5;
    const validacion_cp = trab_pers?.direcciones?.length > 0 ? valid_main && this.modeloTrab.domicilio_cod_postal != trab_pers.direcciones[0].c_postal_edit : valid_main;
    validacion_cp ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    if (validacion_cp) {
      this.modeloTrab.domicilio_colonias_por_cp = [];
      this.modeloTrab.domicilio_estado = "";
      this.modeloTrab.domicilio_municipio = "";
      this.modeloTrab.domicilio_cod_postal = "";
      this.modeloTrab.domicilio_colonia_vinculada = "";

      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.modeloTrab.domicilio_estado = response.cod_postal["estado"] + " (" + response.cod_postal["estado_abreviatura"] + ")";
            this.validator.correctoInputRow(trabDomicilioEstado);
            this.modeloTrab.domicilio_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.validator.correctoInputRow(trabDomicilioMunicipio);
            this.modeloTrab.domicilio_cod_postal = response.cod_postal["codigo_postal"];
            this.modeloTrab.domicilio_colonias_por_cp = response.cod_postal["colonias"];
            this.modeloTrab.domicilio_colonia_vinculada = response.cod_postal["colonias"].length == 1 ? response.cod_postal["colonias"][0] : "";
            response.cod_postal["colonias"].length == 1 ? this.validator.correctoInputRow(trabDomicilioColonia) : this.validator.errorSelectBrowser(trabDomicilioColonia);
          } else {
            this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: this.translate.instant(response.message) });
            if (response.message == "postal_empty") {
              this.validator.errorInputRow(trabDomicilioEstado);
              this.validator.errorInputRow(trabDomicilioMunicipio);
              this.validator.errorInputRow(trabDomicilioColonia);
              this.modeloTrab.domicilio_estado = this.translate.instant("unk_nown");
              this.modeloTrab.domicilio_municipio = this.translate.instant("unk_nown");
              this.modeloTrab.domicilio_cod_postal = this.translate.instant("unk_nown");
            }
          }
        },
        error => {
          //console.log(error);
        }
      )
    }
  }

  seleccionaColoniatrab(colonia_name: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabDomicilioColonia = document.getElementById("trabEditDomicilioColonia");
    const col_vinc = this.modeloTrab.domicilio_colonias_por_cp.find((col: any) => col === colonia_name);
    this.modeloTrab.domicilio_colonia_vinculada = colonia_name;
    const valid_main = colonia_name != "" && this.validator.filtroAlfaNumerico(colonia_name) && col_vinc != "" && this.validator.filtroAlfaNumerico(col_vinc);
    const validacion = trab_pers?.direcciones?.length > 0 ? valid_main && this.modeloTrab.domicilio_colonia_vinculada != trab_pers.direcciones[0].c_postal_edit : valid_main;
    validacion ? this.validator.correctoSelectBrowser(trabDomicilioColonia) : this.validator.errorSelectBrowser(trabDomicilioColonia);
  }

  keyupTrabOrigenNacimFecha(object: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.origen_nacimiento_fecha = object.value;
    const validacion = object.value != "" && this.validator.filtroFecha(object.value) && this.modeloTrab.origen_nacimiento_fecha != trab_pers.fecha_nacimiento;
    validacion ? this.validator.correctoInputRow(object) : this.validator.errorInputRow(object);
  }

  keyupTrabOrigenNacimLugar(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.origen_nacimiento_lugar = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modeloTrab.origen_nacimiento_lugar != trab_pers.lugar_nacimiento;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabOrigenPais(pais: any, token_empleado_vhum: any) {
    console.log(pais);
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    //trab_informacion_personal pers.nacionalidad;
    var trabOrigenNacionalidad = document.getElementById("trabEditOrigenNacionalidad");
    const country = this.paises_lista.find((row: any) => row.pais === pais);
    this.modeloTrab.origen_nacionalidad = country.token_pais;
    const validacion = pais != '' && this.validator.filtroAlfaNumerico(pais) && typeof country !== 'undefined' && this.modeloTrab.origen_nacionalidad != trab_pers.nacionalidad;
    validacion ? this.validator.correctoSelectBrowser(trabOrigenNacionalidad) : this.validator.errorSelectBrowser(trabOrigenNacionalidad);
  }

  changeTrabContTelefonoTipo(tipo_telefono: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    //trab_informacion_personal telefonos tel.etiqueta;
    var trabContTipoTel = document.getElementById("trabEditContTipoTel");
    let pgda = this.trab_tipo_telefonos.find((row: any) => tipo_telefono != '' && row.opcion === tipo_telefono);
    this.modeloTrab.contacto_telefono_tipo = pgda.opcion;
    const validacion = tipo_telefono != "" && this.validator.filtroAlfaNumerico(tipo_telefono) && typeof pgda !== 'undefined' && this.modeloTrab.contacto_telefono_tipo != trab_pers.telefono_tipo;
    validacion ? this.validator.correctoSelectBrowser(trabContTipoTel) : this.validator.errorSelectBrowser(trabContTipoTel);
  }

  probarTextPhone(token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    //trab_informacion_personal telefonos tel.telefono;
    if (this.phoneForm.valid) {
      console.log(this.phoneForm);
      //const phone = this.phoneForm.get('telefono')?.value;
      console.log(this.phoneForm.value.telefono);
      const phone = this.phoneForm.value.telefono;
      if (phone) {
        console.log('Número internacional:', phone.internationalNumber);
        console.log('Número nacional:', phone.nationalNumber);
        console.log('Código de país:', phone.countryCode);
        console.log('Dial code:', phone.dialCode);
      }
    }
  }

  keyupTrabContTelefonoNumero(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    //trab_informacion_personal telefonos tel.telefono;
    var trabContTelefono = document.getElementById("trabEditContTelefono");
    const phone = this.phoneForm.value.telefono;
    this.modeloTrab.contacto_telefono_numero = phone;
    const validacion = this.phoneForm.valid && phone.length >= 5 && this.validator.filtroPhone(phone) && this.modeloTrab.contacto_telefono_numero != trab_pers.telefono_numero;
    validacion ? this.validator.correctoTelefonos(trabContTelefono) : this.validator.errorTelefonos(trabContTelefono);
  }

  keyupTrabContMail(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.contacto_email = event.value;
    const validacion = event.value != "" && this.validator.filtroCorreo(event.value) && this.modeloTrab.contacto_email != trab_pers.correo;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabDocsCurp(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.documentacion_curp = event.value;
    const validacion = event.value != "" && this.validator.filtroCURP(event.value) && this.modeloTrab.documentacion_curp != trab_pers.curp;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabDocsRfc(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.documentacion_rfc = event.value;
    const validacion = event.value != '' && this.validator.filtroRfcPersFisica(event.value) && this.modeloTrab.documentacion_rfc != trab_pers.rfc;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabDocsPasaporte(event: any) {
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_pasaporte_numero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabDocsPasaporteExpide(opcion: any) {
    var trabDocsPasaporteExpide = document.getElementById("trabEditDocsPasaporteExpide");
    const country = this.paises_lista.find((row: any) => row.token_pais === opcion.token_pais);
    const validacion = opcion.pais != '' && this.validator.filtroAlfaNumerico(opcion.pais) && typeof country !== 'undefined';
    this.modeloTrab.documentacion_pasaporte_expide = validacion ? country.pais : '';
    validacion ? this.validator.correctoSelectBrowser(trabDocsPasaporteExpide) : this.validator.errorSelectBrowser(trabDocsPasaporteExpide);
  }

  changeTrabDocsPasaporteVigencia(event: any) {
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modeloTrab.documentacion_pasaporte_vigencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validatePasaporteAdd(): Boolean {
    const validacion_pasaporte_numero = this.modeloTrab.documentacion_pasaporte_numero != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_pasaporte_numero);
    const validacion_pasaporte_expide = this.modeloTrab.documentacion_pasaporte_expide != '';
    const validacion_pasaporte_vigencia = this.modeloTrab.documentacion_pasaporte_vigencia != '' && this.validator.filtroFecha(this.modeloTrab.documentacion_pasaporte_vigencia);
    return validacion_pasaporte_numero && validacion_pasaporte_expide && validacion_pasaporte_vigencia;
  }

  changeTrabDocsPasaporteAdd(event: Event) {
    var trabDocsPasaporteNum = document.getElementById("trabEditDocsPasaporteNum");
    var trabDocsPasaporteExpide = document.getElementById("trabEditDocsPasaporteExpide");
    var trabDocsPasaporteVigencia = document.getElementById("trabEditDocsPasaporteVigencia");

    this.popUpAccept = this.translate.instant("swal_yes_insert");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_insert"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        var num_lista = this.modeloTrab.documentacion_pasaporte_list_new.length + 1;
        this.modeloTrab.documentacion_pasaporte_list_new.push({
          "num_lista": num_lista,
          "pasaporte_numero": this.modeloTrab.documentacion_pasaporte_numero,
          "pasaporte_expide": this.modeloTrab.documentacion_pasaporte_expide,
          "pasaporte_vigencia": this.modeloTrab.documentacion_pasaporte_vigencia,
          "pasaporte_estado": "nuevo"
        });
        this.modeloTrab.documentacion_pasaporte_numero = '';
        this.validator.limpiaInputRow(trabDocsPasaporteNum);
        this.modeloTrab.documentacion_pasaporte_expide = '';
        this.validator.limpiaSelect(trabDocsPasaporteExpide);
        this.phoneForm.get('documentacion_pasaporte_expide')?.reset(); // limpia el control
        this.modeloTrab.documentacion_pasaporte_vigencia = '';
        this.validator.limpiaInputRow(trabDocsPasaporteVigencia);
      }
    });
  }

  changeTrabDocsPasaporteNewRemove(event: Event, num_lista: any) {
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        const index = this.modeloTrab.documentacion_pasaporte_list_new.findIndex((row: any) => row.num_lista === num_lista);
        this.modeloTrab.documentacion_pasaporte_list_new.splice(index, 1);
      }
    });
  }

  get trabDocsPasaporteRegistradosEliminados() {
    const reg = this.modeloTrab.documentacion_pasaporte_list_registrados.filter((row: any) => row.pasaporte_estado === 'delete');
    return reg.length;
  }

  trabDocsPasaporteRegistradosdeshacerCambios(event: Event) {
    this.popUpAccept = this.translate.instant("swal_yes_restore");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_restore"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        this.modeloTrab.documentacion_pasaporte_list_registrados.forEach((row: any) => {
          row.pasaporte_estado = "";
        });
      }
    });
  }

  changeTrabDocsPasaporteRegistradosRemove(event: Event, num_lista: any) {
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        const reg = this.modeloTrab.documentacion_pasaporte_list_registrados.find((row: any) => row.num_lista === num_lista);
        reg.pasaporte_estado = "delete";
      }
    });
  }

  keyupTrabDocsVisa(event: any) {
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_visa_numero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabDocsVisaExpide(opcion: any) {
    var trabDocsVisaExpide = document.getElementById("trabEditDocsVisaExpide");
    const country = this.paises_lista.find((row: any) => row.token_pais === opcion.token_pais);
    const validacion = opcion.pais != '' && this.validator.filtroAlfaNumerico(opcion.pais) && typeof country !== 'undefined';
    this.modeloTrab.documentacion_visa_expide = validacion ? country.pais : '';
    validacion ? this.validator.correctoSelectBrowser(trabDocsVisaExpide) : this.validator.errorSelectBrowser(trabDocsVisaExpide);
  }

  changeTrabDocsVisaVigencia(event: any) {
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modeloTrab.documentacion_visa_vigencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validateVisaAdd(): Boolean {
    const validacion_visa_numero = this.modeloTrab.documentacion_visa_numero != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_visa_numero);
    const validacion_visa_expide = this.modeloTrab.documentacion_visa_expide != '';
    const validacion_visa_vigencia = this.modeloTrab.documentacion_visa_vigencia != '' && this.validator.filtroFecha(this.modeloTrab.documentacion_visa_vigencia);
    return validacion_visa_numero && validacion_visa_expide && validacion_visa_vigencia;
  }

  changeTrabDocsVisaAdd(event: Event) {
    var trabDocsVisaNum = document.getElementById("trabEditDocsVisaNum");
    var trabDocsVisaExpide = document.getElementById("trabEditDocsVisaExpide");
    var trabDocsVisaVigencia = document.getElementById("trabEditDocsVisaVigencia");

    this.popUpAccept = this.translate.instant("swal_yes_insert");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_insert"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        var num_lista = this.modeloTrab.documentacion_visa_list_new.length + 1;
        this.modeloTrab.documentacion_visa_list_new.push({
          "num_lista": num_lista,
          "visa_numero": this.modeloTrab.documentacion_visa_numero,
          "visa_expide": this.modeloTrab.documentacion_visa_expide,
          "visa_vigencia": this.modeloTrab.documentacion_visa_vigencia,
          "visa_estado": "nuevo"
        });
        this.modeloTrab.documentacion_visa_numero = '';
        this.validator.limpiaInputRow(trabDocsVisaNum);
        this.modeloTrab.documentacion_visa_expide = '';
        this.validator.limpiaSelect(trabDocsVisaExpide);
        this.phoneForm.get('documentacion_visa_expide')?.reset(); // limpia el control
        this.modeloTrab.documentacion_visa_vigencia = '';
        this.validator.limpiaInputRow(trabDocsVisaVigencia);
      }
    });
  }

  changeTrabDocsVisaNewRemove(event: Event, num_lista: any) {
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        const index = this.modeloTrab.documentacion_visa_list_new.findIndex((row: any) => row.num_lista === num_lista);
        this.modeloTrab.documentacion_visa_list_new.splice(index, 1);
      }
    });
  }

  get trabDocsVisaRegistradosEliminados() {
    const reg = this.modeloTrab.documentacion_visa_list_registrados.filter((row: any) => row.visa_estado === 'delete');
    return reg.length;
  }

  trabDocsVisaRegistradosdeshacerCambios(event: Event) {
    this.popUpAccept = this.translate.instant("swal_yes_restore");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_restore"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        this.modeloTrab.documentacion_visa_list_registrados.forEach((row: any) => {
          row.visa_estado = "";
        });
      }
    });
  }

  changeTrabDocsVisaRegistradosRemove(event: Event, num_lista: any) {
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        const reg = this.modeloTrab.documentacion_visa_list_registrados.find((row: any) => row.num_lista === num_lista);
        reg.visa_estado = "delete";
      }
    });
  }

  keyupTrabDocsNSS(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.documentacion_numero_de_seguridad_social = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modeloTrab.documentacion_numero_de_seguridad_social != trab_pers.numero_de_seguridad_social;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabLicenciaManejarClave(opcion: any) {
    var trabLicenciaClave = document.getElementById("trabEditLicenciaClave");
    let pgda = this.trab_licencia_tipos.find((row: any) => opcion.opcion != '' && row.opcion === opcion.opcion);
    const validacion = opcion.opcion != "" && this.validator.filtroAlfaNumerico(opcion.opcion) && typeof pgda !== 'undefined';
    this.modeloTrab.documentacion_licencia_nivel = validacion ? pgda.nivel : "";
    this.modeloTrab.documentacion_licencia_clase = validacion ? pgda.tipo : "";
    this.modeloTrab.documentacion_licencia_vigencia = validacion ? pgda.vigencia : null;
    this.modeloTrab.documentacion_licencia_permanente = validacion ? pgda.permanente : false;
    validacion ? this.validator.correctoSelectBrowser(trabLicenciaClave) : this.validator.errorSelectBrowser(trabLicenciaClave);
  }

  keyupTrabLicenciaManejarNumero(event: any) {
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_licencia_numero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabLicenciaManejarExpide(opcion: any) {
    var trabLicenciaExpide = document.getElementById("trabEditLicenciaExpide");
    const ent_expide = this.trab_entidades_federativas.find((row: any) => row.nombre === opcion.nombre);
    //{clave:'01', nombre:'Aguascalientes'},
    const validacion = opcion.nombre != '' && this.validator.filtroAlfaNumerico(opcion.nombre) && typeof ent_expide !== 'undefined';
    this.modeloTrab.documentacion_licencia_expide = validacion ? ent_expide.clave : '';
    validacion ? this.validator.correctoSelectBrowser(trabLicenciaExpide) : this.validator.errorSelectBrowser(trabLicenciaExpide);
  }

  changeTrabLicenciaFechaExpedicion(event: any) {
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modeloTrab.documentacion_licencia_fecha_expedicion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);

    //if (validacion && !this.modeloTrab.documentacion_licencia_permanente) {
    //  const fecha_expedicion = new Date(this.modeloTrab.documentacion_licencia_fecha_expedicion);
    //  fecha_expedicion.setFullYear(fecha_expedicion.getFullYear() + (this.modeloTrab.documentacion_licencia_vigencia || 0));
    //  this.fechaVencimientoInformativa = fecha_expedicion.toISOString().split('T')[0];
    //
    //  //const fechaVenc = new Date(this.fechaVencimientoInformativa);
    //  //const hoy = new Date();
    //  //return fechaVenc < hoy; // true si ya pasó la fecha
    //} else {
    //  this.fechaVencimientoInformativa = "";
    //}
  }

  get validateLicenciaAdd(): Boolean {
    const validacion_licencia_nivel = this.modeloTrab.documentacion_licencia_nivel != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_nivel);
    const validacion_licencia_clase = this.modeloTrab.documentacion_licencia_clase != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_clase);
    const validacion_licencia_vigencia = this.modeloTrab.documentacion_licencia_vigencia > 0 && this.validator.filtroNum(this.modeloTrab.documentacion_licencia_vigencia);
    const validacion_licencia_numero = this.modeloTrab.documentacion_licencia_numero != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_numero);
    const validacion_licencia_expide = this.modeloTrab.documentacion_licencia_expide != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_expide);
    const validacion_licencia_fecha_expedicion = this.modeloTrab.documentacion_licencia_fecha_expedicion != '' && this.validator.filtroFecha(this.modeloTrab.documentacion_licencia_fecha_expedicion);
    const validacion_licencia_permanente = this.modeloTrab.documentacion_licencia_permanente || (!this.modeloTrab.documentacion_licencia_permanente && validacion_licencia_vigencia);
    return validacion_licencia_nivel && validacion_licencia_clase && validacion_licencia_numero && validacion_licencia_expide && validacion_licencia_fecha_expedicion && validacion_licencia_permanente;
  }

  changeTrabDocsLicenciaAdd(event: Event) {
    var trabEditLicenciaClave = document.getElementById("trabEditLicenciaClave");
    var trabLicenciaNum = document.getElementById("trabEditLicenciaNum");
    var trabLicenciaExpide = document.getElementById("trabEditLicenciaExpide");
    var trabLicenciaExpedicionDate = document.getElementById("trabEditLicenciaExpedicionDate");

    this.popUpAccept = this.translate.instant("swal_yes_insert");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_insert"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        const ent_expide = this.trab_entidades_federativas.find((row: any) => row.clave === this.modeloTrab.documentacion_licencia_expide);
        var num_lista = this.modeloTrab.documentacion_licencia_list_new.length + 1;
        this.modeloTrab.documentacion_licencia_list_new.push({
          "num_lista": num_lista,
          "licencia_nivel": this.modeloTrab.documentacion_licencia_nivel,
          "licencia_clase": this.modeloTrab.documentacion_licencia_clase,
          "licencia_numero": this.modeloTrab.documentacion_licencia_numero,
          "licencia_expide": this.modeloTrab.documentacion_licencia_expide,
          "licencia_expide_show": ent_expide.nombre,
          "licencia_fecha_expedicion": this.modeloTrab.documentacion_licencia_fecha_expedicion,
          "licencia_vigencia": !this.modeloTrab.documentacion_licencia_permanente ? this.modeloTrab.documentacion_licencia_vigencia : 0,
          "licencia_permanente": this.modeloTrab.documentacion_licencia_permanente ? true : false,
          "licencia_estado": "nuevo"
        });

        this.modeloTrab.documentacion_licencia_nivel = '';
        this.modeloTrab.documentacion_licencia_clase = '';
        this.modeloTrab.documentacion_licencia_vigencia = 0;
        this.modeloTrab.documentacion_licencia_permanente = false;
        this.validator.limpiaSelect(trabEditLicenciaClave);
        this.phoneForm.get('documentacion_licencia_clave')?.reset(); // limpia el control
        this.modeloTrab.documentacion_licencia_numero = '';
        this.validator.limpiaInputRow(trabLicenciaNum);
        this.modeloTrab.documentacion_licencia_expide = '';
        this.validator.limpiaSelect(trabLicenciaExpide);
        this.phoneForm.get('documentacion_licencia_expide')?.reset(); // limpia el control
        this.modeloTrab.documentacion_licencia_fecha_expedicion = '';
        this.validator.limpiaInputRow(trabLicenciaExpedicionDate);
      }
    });
  }

  changeTrabDocsLicenciaNewRemove(event: Event, num_lista: any) {
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        const index = this.modeloTrab.documentacion_licencia_list_new.findIndex((row: any) => row.num_lista === num_lista);
        this.modeloTrab.documentacion_licencia_list_new.splice(index, 1);
      }
    });
  }

  get trabDocsLicenciaRegistradasEliminadas() {
    const reg = this.modeloTrab.documentacion_licencia_list_registrados.filter((row: any) => row.licencia_estado === 'delete');
    return reg.length;
  }

  trabDocsLicenciaRegistradasdeshacerCambios(event: Event) {
    this.popUpAccept = this.translate.instant("swal_yes_restore");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_restore"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        this.modeloTrab.documentacion_licencia_list_registrados.forEach((row: any) => {
          row.licencia_estado = "";
        });
      }
    });
  }

  changeTrabDocsLicenciaRegistradasRemove(event: Event, num_lista: any) {
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: { label: 'Save' },
      accept: () => {
        const reg = this.modeloTrab.documentacion_licencia_list_registrados.find((row: any) => row.num_lista === num_lista);
        reg.licencia_estado = "delete";
      }
    });
  }

  changeTrabCBancariaBanco(bancos_nombre: any, token_empleado_vhum: any) {
    console.log(bancos_nombre)
    var trabEditCBancariaBanco = document.getElementById("trabEditCBancariaBanco");
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    const bank = this.lista_bancos.find((row: any) => row.nombre_comercial === bancos_nombre);
    this.modeloTrab.cbancaria_banco_token = bank !== 'undefined' ? bank.token_bancos : '';
    this.modeloTrab.cbancaria_banco_clave = bank !== 'undefined' ? bank.clave : '';
    this.modeloTrab.cbancaria_banco_nombre_comercial = bank !== 'undefined' ? bank.nombre_comercial : '';
    const validacion = bancos_nombre != "" && typeof bank !== 'undefined' && this.modeloTrab.cbancaria_banco_token != trab_pers.bancCuentaBancoToken &&
      this.modeloTrab.cbancaria_banco_clave != trab_pers.bancCuentaBancoClave && this.modeloTrab.cbancaria_banco_nombre_comercial != trab_pers.bancCuentaBancoNombreComercial;

    validacion ? this.validator.correctoSelectBrowser(trabEditCBancariaBanco) : this.validator.errorSelectBrowser(trabEditCBancariaBanco);
  }

  changeTrabCBancariaCuenta(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.cbancaria_cuenta = event.value;
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && this.modeloTrab.cbancaria_cuenta != trab_pers.bancCuentaCuenta;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verCuenta(token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    trab_pers.cuenta_view = trab_pers.cuenta_view ? false : true;
    var cuenta: any = document.getElementById("trabEditCBancariaCuenta");
    cuenta.type = cuenta.type === "password" ? "text" : "password";
  }

  changeTrabCBancariaClabeInter(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.cbancaria_clabe_inter = event.value;
    this.modeloTrab.cbancaria_sucursal = event.value.substring(3, 6);
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value) && this.modeloTrab.cbancaria_clabe_inter != trab_pers.bancCuentaClabeInter && this.modeloTrab.cbancaria_sucursal != trab_pers.bancCuentaSucursal;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verClabeInter(token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    trab_pers.clabe_inter_view = trab_pers.clabe_inter_view ? false : true;
    var interbank: any = document.getElementById("trabEditCBancariaClabeInter");
    interbank.type = interbank.type === "password" ? "text" : "password";
  }

  selectTrabajoCentro(event: any, centrotrab_uuid: string, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    let c_trab = this.catalogo_centros_trabajo.find((row: any) => row.centrotrab_uuid === centrotrab_uuid);

    if (!trab_pers || !c_trab) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "No se encontró información válida del trabajador o centro de trabajo." });
      return;
    }

    c_trab.select_for_trabajador = event.checked;

    if (event.checked) {
      if (trab_pers.centro_de_trabajo_uuid !== c_trab.centrotrab_uuid) {
        this.modeloTrab.centro_de_trabajo = c_trab.centrotrab_uuid;
      } else {
        c_trab.select_for_trabajador = false;
        this.modeloTrab.centro_de_trabajo = '';
        this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "El trabajador ya pertenece a este centro de trabajo." });
      }
    } else {
      this.modeloTrab.centro_de_trabajo = '';
    }
  }

  keyupTrabDepartamento(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.departamento = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modeloTrab.departamento != trab_pers.departamento;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabPuesto(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.puesto = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modeloTrab.puesto != trab_pers.puesto;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabTipoSalario(salario_tipo: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabEditTipoSalario = document.getElementById("trabEditTipoSalario");
    const sal_tipo = this.trab_lista_tipos_salario.find((sal: any) => sal.nombre === salario_tipo);
    console.log(sal_tipo.clave);
    this.modeloTrab.salario_tipo = salario_tipo;
    const valid_main = salario_tipo != "" && this.validator.filtroAlfaNumerico(salario_tipo) && sal_tipo.clave != "" && this.validator.filtroAlfaNumerico(sal_tipo.clave);
    const validacion = valid_main && this.modeloTrab.salario_tipo != trab_pers.salario_tipo;
    validacion ? this.validator.correctoSelectBrowser(trabEditTipoSalario) : this.validator.errorSelectBrowser(trabEditTipoSalario);
  }

  changeTrabContratacionTipo(contrato_tipo: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabEditContratoTipo = document.getElementById("trabEditContratoTipo");
    const contrato_tipos = this.trab_lista_tipos_contrato.find((tipc: any) => tipc.tipo === contrato_tipo);
    this.modeloTrab.contratacion_tipo = contrato_tipos.clave;
    const valid_main = contrato_tipo != "" && this.validator.filtroAlfaNumerico(contrato_tipo) && contrato_tipos.clave != "" && this.validator.filtroAlfaNumerico(contrato_tipos.clave);
    const validacion = valid_main && this.modeloTrab.contratacion_tipo != trab_pers.contratacion_tipo;
    validacion ? this.validator.correctoSelectBrowser(trabEditContratoTipo) : this.validator.errorSelectBrowser(trabEditContratoTipo);
  }

  changeTrabContratacionFecha(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.contratacion_fecha = event.value;
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && this.modeloTrab.contratacion_fecha != trab_pers.contratacion_fecha;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabAltaEnEmpresaFecha(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    this.modeloTrab.fecha_alta_en_empresa = event.value;
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && this.modeloTrab.fecha_alta_en_empresa != trab_pers.alta_en_empresa;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeNominaPeriodicidad(periodicidad: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabEditNominaPeriodicidad = document.getElementById("trabEditNominaPeriodicidad");
    let nper = this.nomina_periodos.find((row: any) => periodicidad != '' && row.periodicidad === periodicidad);
    this.modeloTrab.nomina_periodicidad = nper.periodicidad;
    const validacion = periodicidad != '' && this.validator.filtroAlfaNumerico(periodicidad) && typeof nper !== 'undefined' && this.modeloTrab.nomina_periodicidad != trab_pers.nomina_periodicidad;
    validacion ? this.validator.correctoSelectBrowser(trabEditNominaPeriodicidad) : this.validator.errorSelectBrowser(trabEditNominaPeriodicidad);
  }

  changeMonedaNomina(moneda_code: any, token_empleado_vhum: any) {
    console.log(moneda_code)
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabEditNominaMoneda = document.getElementById("trabEditNominaMoneda");
    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === moneda_code);
    this.modeloTrab.nomina_moneda = mnd.code;
    this.modeloTrab.nomina_moneda_decimales = mnd.decimales;
    const validacion = moneda_code != '' && this.validator.filtroAlfaNumerico(moneda_code) && typeof mnd !== 'undefined' && this.modeloTrab.nomina_moneda != trab_pers.nomina_moneda;
    validacion ? this.validator.correctoSelectBrowser(trabEditNominaMoneda) : this.validator.errorSelectBrowser(trabEditNominaMoneda);
  }

  keyupNominaDiasJornada(jornada: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabEditNominaDiasJornada = document.getElementById("trabEditNominaDiasJornada");
    let njor = this.nomina_jornadas.find((row: any) => jornada != '' && row.jornada === jornada);
    this.modeloTrab.tipo_jornada = njor.jornada;
    const validacion = jornada != "" && this.validator.filtroAlfaNumerico(jornada) && typeof njor !== 'undefined' && this.modeloTrab.tipo_jornada != trab_pers.nomina_jornada;
    validacion ? this.validator.correctoSelectBrowser(trabEditNominaDiasJornada) : this.validator.errorSelectBrowser(trabEditNominaDiasJornada);
  }

  keyupNominaTurno(turno: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    var trabEditNominaTurno = document.getElementById("trabEditNominaTurno");
    let ntur = this.nomina_turnos.find((row: any) => turno != '' && row.turno === turno);
    this.modeloTrab.turno = ntur.turno;
    const validacion = turno != "" && this.validator.filtroAlfaNumerico(turno) && typeof ntur !== 'undefined' && this.modeloTrab.turno != trab_pers.nomina_turno;
    validacion ? this.validator.correctoSelectBrowser(trabEditNominaTurno) : this.validator.errorSelectBrowser(trabEditNominaTurno);
  }

  validaUpdateTrabajador(token_empleado_vhum: any): Boolean {
    //console.log(this.trab_informacion_personal);
    if (this.trab_informacion_personal.length > 0) {
      const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
      //trab_informacion_personal direcciones dir.c_postal_edit;
      //trab_informacion_personal direcciones dir.colonia_edit;
      //trab_informacion_personal direcciones dir.municipio_edit;
      //trab_informacion_personal direcciones dir.estado_edit;

      const OKPaterno = this.modeloTrab.apePaterno != "" && this.validator.strFilter(this.modeloTrab.apePaterno) && this.modeloTrab.apePaterno.length >= 4 && this.modeloTrab.apePaterno != trab_pers.paterno;

      const OKMaterno = this.modeloTrab.apeMaterno != "" && this.validator.strFilter(this.modeloTrab.apeMaterno) && this.modeloTrab.apeMaterno.length >= 4 && this.modeloTrab.apeMaterno != trab_pers.materno;

      const OKNombres = this.modeloTrab.nombres != "" && this.validator.strFilter(this.modeloTrab.nombres) && this.modeloTrab.nombres.length >= 3 && this.modeloTrab.nombres != trab_pers.nombres;

      const OKEdad = this.modeloTrab.edad > 0 && this.validator.filtroNum(this.modeloTrab.edad) && this.modeloTrab.edad != trab_pers.edad;

      const OKSexo = this.modeloTrab.sexo != "" && this.validator.strFilter(this.modeloTrab.sexo) && this.modeloTrab.sexo != trab_pers.sexo;

      const OKEstCivil = this.modeloTrab.estado_civil != "" && this.validator.strFilter(this.modeloTrab.estado_civil) && this.modeloTrab.estado_civil != trab_pers.estado_civil;

      const valid_dir_calle = this.modeloTrab.domicilio_CalleNumero != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_CalleNumero);
      const OKDomiCalle = trab_pers?.direcciones?.length > 0 ? valid_dir_calle && this.modeloTrab.domicilio_CalleNumero != trab_pers.direcciones[0].calle : valid_dir_calle;

      const valid_dir_cp = this.modeloTrab.domicilio_cod_postal != "" && this.validator.filtroNumericoCPostal(this.modeloTrab.domicilio_cod_postal) && this.modeloTrab.domicilio_cod_postal.length == 5;
      const OKDomiCP = trab_pers?.direcciones?.length > 0 ? valid_dir_cp && this.modeloTrab.domicilio_cod_postal != trab_pers.direcciones[0].c_postal_edit : valid_dir_cp;

      const valid_dir_col = this.modeloTrab.domicilio_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_colonia_vinculada);
      const OKDomiCol = trab_pers?.direcciones?.length > 0 ? valid_dir_col && this.modeloTrab.domicilio_colonia_vinculada != trab_pers.direcciones[0].colonia_edit : valid_dir_col;

      const valid_dir_muni = this.modeloTrab.domicilio_municipio != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_municipio);
      const OKDomiMuni = trab_pers?.direcciones?.length > 0 ? valid_dir_muni && this.modeloTrab.domicilio_municipio != trab_pers.direcciones[0].municipio_edit : valid_dir_muni;

      const valid_dir_est = this.modeloTrab.domicilio_estado != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_estado);
      const OKDomiestado = trab_pers?.direcciones?.length > 0 ? valid_dir_est && this.modeloTrab.domicilio_estado != trab_pers.direcciones[0].estado_edit : valid_dir_est;

      const OKNacimDecha = this.modeloTrab.origen_nacimiento_fecha != "" && this.validator.filtroFecha(this.modeloTrab.origen_nacimiento_fecha) && this.modeloTrab.origen_nacimiento_fecha != trab_pers.fecha_nacimiento;

      const OKNacimLugar = this.modeloTrab.origen_nacimiento_lugar != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.origen_nacimiento_lugar) && this.modeloTrab.origen_nacimiento_lugar != trab_pers.lugar_nacimiento;

      const OKNacionalidad = this.modeloTrab.origen_nacionalidad != "" && this.modeloTrab.origen_nacionalidad != trab_pers.nacionalidad_token;

      const OKContTelTipo = this.modeloTrab.contacto_telefono_tipo != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.contacto_telefono_tipo) && this.modeloTrab.contacto_telefono_tipo != trab_pers.telefono_tipo;

      const OKContTelNumero = this.phoneForm.valid && this.modeloTrab.contacto_telefono_numero.length >= 5 && this.validator.filtroPhone(this.modeloTrab.contacto_telefono_numero) && this.modeloTrab.contacto_telefono_numero != trab_pers.telefono_numero;

      const OKContEmail = this.modeloTrab.contacto_email != "" && this.validator.filtroCorreo(this.modeloTrab.contacto_email) && this.modeloTrab.contacto_email != trab_pers.correo;

      const OKDocsCurp = this.modeloTrab.documentacion_curp != "" && this.validator.filtroCURP(this.modeloTrab.documentacion_curp) && this.modeloTrab.documentacion_curp != trab_pers.curp;

      const OKDocsRfc = this.modeloTrab.documentacion_rfc != "" && this.validator.filtroRfcPersFisica(this.modeloTrab.documentacion_rfc) && this.modeloTrab.documentacion_rfc != trab_pers.rfc;

      const valida_pass_new = this.modeloTrab.documentacion_pasaporte_list_new;
      const valida_pass_delete = this.modeloTrab.documentacion_pasaporte_list_registrados.filter((row: any) => row.pasaporte_estado === 'delete');
      const OKDocsPasaporte = valida_pass_new.length > 0 || valida_pass_delete.length > 0;

      const valida_visa_new = this.modeloTrab.documentacion_visa_list_new;
      const valida_visa_delete = this.modeloTrab.documentacion_visa_list_registrados.filter((row: any) => row.visa_estado === 'delete');
      const OKDocsVisa = valida_visa_new.length > 0 || valida_visa_delete.length > 0;

      const OKDocsNSS = this.modeloTrab.documentacion_numero_de_seguridad_social != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_numero_de_seguridad_social) && this.modeloTrab.documentacion_numero_de_seguridad_social != trab_pers.numero_de_seguridad_social;

      const valida_licen_new = this.modeloTrab.documentacion_licencia_list_new;
      const valida_licen_delete = this.modeloTrab.documentacion_licencia_list_registrados.filter((row: any) => row.licencia_estado === 'delete');
      const OKDocsLicencia = valida_licen_new.length > 0 || valida_licen_delete.length > 0;

      const OKCBankBanco = this.modeloTrab.cbancaria_banco_token != "" && this.modeloTrab.cbancaria_banco_token != trab_pers.bancCuentaBancoToken &&
        this.modeloTrab.cbancaria_banco_clave != trab_pers.bancCuentaBancoClave && this.modeloTrab.cbancaria_banco_nombre_comercial != trab_pers.bancCuentaBancoNombreComercial;

      const OKCBankCuenta = this.modeloTrab.cbancaria_cuenta != '' && this.validator.filtroCuenta(this.modeloTrab.cbancaria_cuenta) && this.modeloTrab.cbancaria_cuenta != trab_pers.bancCuentaCuenta;
      const OKCBankClabeInter = this.modeloTrab.cbancaria_clabe_inter != '' && this.validator.filtroCuenta(this.modeloTrab.cbancaria_clabe_inter) && this.modeloTrab.cbancaria_clabe_inter != trab_pers.bancCuentaClabeInter && this.modeloTrab.cbancaria_sucursal != trab_pers.bancCuentaSucursal;

      const OKTrab_cent = this.modeloTrab.centro_de_trabajo != '' && this.modeloTrab.centro_de_trabajo != trab_pers.centro_de_trabajo_uuid;

      const OKDepartamento = this.modeloTrab.departamento != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.departamento) && this.modeloTrab.departamento != trab_pers.departamento;
      const OKPuesto = this.modeloTrab.puesto != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.puesto) && this.modeloTrab.puesto != trab_pers.puesto;

      const OKSalarioTipo = this.modeloTrab.salario_tipo != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.salario_tipo) && this.modeloTrab.salario_tipo != trab_pers.salario_tipo;
      //const OKSalarioActual = this.modeloTrab.salario_actual > 0 && this.validator.filtroNum(this.modeloTrab.salario_actual) && this.modeloTrab.salario_actual != trab_pers.salario_actual;
      const OKContratacionTipo = this.modeloTrab.contratacion_tipo != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.contratacion_tipo) && this.modeloTrab.contratacion_tipo != trab_pers.contratacion_tipo;
      const OKContratacionFecha = this.modeloTrab.contratacion_fecha != "" && this.validator.filtroFecha(this.modeloTrab.contratacion_fecha) && this.modeloTrab.contratacion_fecha != trab_pers.contratacion_fecha;
      const OKAltaEnEmpresaFecha = this.modeloTrab.fecha_alta_en_empresa != "" && this.validator.filtroFecha(this.modeloTrab.fecha_alta_en_empresa) && this.modeloTrab.fecha_alta_en_empresa != trab_pers.alta_en_empresa;

      let nper = this.nomina_periodos.find((row: any) => row.periodicidad === this.modeloTrab.nomina_periodicidad);
      const vNominaPeriodicidad = this.modeloTrab.nomina_periodicidad != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.nomina_periodicidad) && typeof nper !== 'undefined' && this.modeloTrab.nomina_periodicidad != trab_pers.nomina_periodicidad;

      const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.modeloTrab.nomina_moneda);
      const vNominaMoneda = this.modeloTrab.nomina_moneda != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.nomina_moneda) && typeof mnd !== 'undefined' && this.modeloTrab.nomina_moneda != trab_pers.nomina_moneda;

      let njor = this.nomina_jornadas.find((row: any) => this.modeloTrab.tipo_jornada != '' && row.jornada === this.modeloTrab.tipo_jornada);
      const vNominaDiasJornada = this.modeloTrab.tipo_jornada != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.tipo_jornada) && typeof njor !== 'undefined' && this.modeloTrab.tipo_jornada != trab_pers.nomina_jornada;

      let ntur = this.nomina_turnos.find((row: any) => this.modeloTrab.turno != '' && row.turno === this.modeloTrab.turno);
      const vNominaDiasTurno = this.modeloTrab.turno != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.turno) && typeof ntur !== 'undefined' && this.modeloTrab.turno != trab_pers.nomina_turno;

      const vNominaSalarioDiario = Number(this.trab_sueldo_salario_diario) > 0 && this.validator.filtroNum(this.trab_sueldo_salario_diario) && this.trab_sueldo_salario_diario != trab_pers.nomina_salario_diario;
      const vNominaSalarioIntegrado = Number(this.trab_sueldo_salario_integrado) > 0 && this.validator.filtroNum(this.trab_sueldo_salario_integrado) && this.trab_sueldo_salario_integrado != trab_pers.nomina_salario_integrado;

      const vNominaSalarioEntraEnVigor = this.trab_sueldo_entra_en_vigor != "" && this.validator.filtroFecha(this.trab_sueldo_entra_en_vigor);
      const vNominaSalarioObservacion = this.trab_sueldo_observacion != "" && this.validator.filtroAlfaNumerico(this.trab_sueldo_observacion) && this.trab_sueldo_observacion.length >= 4;

      const vNominaSalarioValida = vNominaSalarioDiario && vNominaSalarioIntegrado && vNominaSalarioEntraEnVigor && vNominaSalarioObservacion;

      return OKPaterno || OKMaterno || OKNombres || OKEdad || OKSexo || OKEstCivil || OKDomiCalle || OKDomiCP || OKDomiCol || OKDomiMuni || OKDomiestado || OKNacimDecha ||
        OKNacimLugar || OKNacionalidad || OKContTelTipo || OKContTelNumero || OKContEmail || OKDocsCurp || OKDocsRfc || OKDocsPasaporte || OKDocsVisa || OKDocsNSS ||
        OKDocsLicencia || OKCBankBanco || OKCBankCuenta || OKCBankClabeInter || OKTrab_cent || OKDepartamento || OKPuesto || OKSalarioTipo || OKContratacionTipo ||
        OKContratacionFecha || OKAltaEnEmpresaFecha || vNominaPeriodicidad || vNominaMoneda || vNominaDiasJornada || vNominaDiasTurno || vNominaSalarioValida;
    } else {
      return false;
    }
  }

  limpia_trabajador() {
    this.validator.limpiaInputRow(document.getElementById("trabEditApellidoPaterno"));
    this.validator.limpiaInputRow(document.getElementById("trabEditApellidoMaterno"));
    this.validator.limpiaInputRow(document.getElementById("trabEditNombres"));
    this.validator.limpiaInputRow(document.getElementById("trabEditEdad"));
    this.validator.limpiaSelect(document.getElementById("trabEditSexo"));
    this.validator.limpiaSelect(document.getElementById("trabEditEstadoCivil"));
    this.validator.limpiaInputRow(document.getElementById("trabEditRegimenFiscal"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDomicilioCalleNumero"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDomicilioCPostal"));
    if (this.modeloTrab.domicilio_colonias_por_cp.length <= 1) {
      this.validator.limpiaInputRow(document.getElementById("trabEditDomicilioColonia"));
    } else {
      this.validator.limpiaSelect(document.getElementById("trabEditDomicilioColonia"));
    }
    this.validator.limpiaInputRow(document.getElementById("trabEditDomicilioMunicipio"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDomicilioEstado"));
    this.validator.limpiaInputRow(document.getElementById("trabEditOrigenNacimFecha"));
    this.validator.limpiaInputRow(document.getElementById("trabEditOrigenNacimLugar"));
    this.validator.limpiaSelect(document.getElementById("trabEditOrigenNacionalidad"));
    this.validator.limpiaSelect(document.getElementById("trabEditContTipoTel"));
    this.validator.limpiaInputTelefonos(document.getElementById("trabEditContTelefono"));
    this.validator.limpiaInputRow(document.getElementById("trabEditContEmail"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDocsCURP"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDocsRFC"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDocsNSS"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDocsPasaporteNum"));
    this.validator.limpiaSelect(document.getElementById("trabEditDocsPasaporteExpide"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDocsPasaporteVigencia"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDocsVisaNum"));
    this.validator.limpiaSelect(document.getElementById("trabEditDocsVisaExpide"));
    this.validator.limpiaInputRow(document.getElementById("trabEditDocsVisaVigencia"));

    this.validator.limpiaSelect(document.getElementById("trabEditLicenciaClave"));
    this.validator.limpiaInputRow(document.getElementById("trabEditLicenciaNum"));
    this.validator.limpiaSelect(document.getElementById("trabEditLicenciaExpide"));
    this.validator.limpiaInputRow(document.getElementById("trabEditLicenciaExpedicionDate"));

    this.validator.limpiaInputRow(document.getElementById("trabEditNominaPeriodicidad"));
    this.nomina_periodicidad = null;
    this.validator.limpiaInputRow(document.getElementById("trabEditNominaMoneda"));
    this.nomina_moneda = null;
  }

  actualizarTrabajador(form: { reset: () => void; }, token_empleado_vhum: any): void {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
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
        this.trab_serv.actualizarTrabajador(
          this.modeloTrab,
          this.trab_sueldo_salario_diario,
          this.trab_sueldo_salario_integrado,
          this.trab_sueldo_entra_en_vigor,
          this.trab_sueldo_observacion,
          token_empleado_vhum).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
                form.reset();
                //this.viewFormulario = true;
                this.trab_sueldo_salario_diario = "";
                this.trab_sueldo_salario_integrado = "";
                this.trab_sueldo_entra_en_vigor = "";
                this.trab_sueldo_observacion = "";
                this.validator.limpiaInputRow(document.getElementById("trabEditNominaSalarioDiario"));
                this.validator.limpiaInputRow(document.getElementById("trabEditNominaSalarioIntegrado"));
                this.validator.limpiaInputRow(document.getElementById("trabEditNominaEntraEnVigor"));
                this.validator.limpiaInputRow(document.getElementById("new_nomina_observaciones"));
                this.limpia_trabajador();
                this.modeloTrab = new trabajadoresModelo('', '', '', 0, '', '', [], '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', [], [], '', '', '', [], [], '', false, '', '', '', '', '', 0, false, [], [], '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 2, '', '', '', '');
                this.verDetalleEmpleado(token_empleado_vhum);
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
    });
  }

  keyupNominaSalarioDiario(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value != trab_pers.nomina_salario_diario;
    this.trab_sueldo_salario_diario = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaSalarioIntegrado(event: any, token_empleado_vhum: any) {
    const trab_pers = this.trab_informacion_personal.find((trab: any) => trab.token_empleado_vhum === token_empleado_vhum);
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && event.value != trab_pers.nomina_salario_integrado;
    this.trab_sueldo_salario_integrado = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeNominaSalarioEntraEnVigor(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.trab_sueldo_entra_en_vigor = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.trab_sueldo_entra_en_vigor);
  }

  keyupNominaSalarioObservacion(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.trab_sueldo_observacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  deleteEmpleado(token_empleado_vhum: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.trab_serv.valorHumanoTrabajadorEliminar(token_empleado_vhum).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.listando_catalogo_trabajadores();
              this.listando_catalogo_trab_activos();
              this.listando_catalogo_trab_inactivos();
              this.listando_catalogo_trab_eliminados();
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
    });
  }

  listando_catalogo_trab_eliminados() {
    this.trab_serv.catalogoTrabajadoresEliminados().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogo_trabajadores_eliminados_list = response.empleados;
        }
      }, error => { console.log(error); }
    );
  }

  restauraTrabajador(token_empleado_vhum: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        //this.viewFormulario = false;
        this.trab_serv.valorHumanoTrabajadorRestaurar(token_empleado_vhum).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.listando_catalogo_trabajadores();
              this.listando_catalogo_trab_activos();
              this.listando_catalogo_trab_inactivos();
              this.listando_catalogo_trab_eliminados();
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
    });
  }

  eliminapermTrabajador(token_empleado_vhum: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.trab_serv.valorHumanoTrabajadorDeletePermanente(token_empleado_vhum).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.listando_catalogo_trabajadores();
              this.listando_catalogo_trab_activos();
              this.listando_catalogo_trab_inactivos();
              this.listando_catalogo_trab_eliminados();
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
    });
  }
}
