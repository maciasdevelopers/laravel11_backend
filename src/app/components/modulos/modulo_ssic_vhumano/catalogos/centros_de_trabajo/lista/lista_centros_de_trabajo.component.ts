import { Component, OnInit } from '@angular/core';
import { CentrosTrabajoService } from '../../../../../../servicios/ssic/centros-trabajo-service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { centroTrabajoModelo } from '../../../../../../modelos/centroTrabajoModelo';
import Swal from 'sweetalert2';
import { ctraBajaModelo } from '../../../../../../modelos/ctrabBajaModelo';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';
import { CatalogoActividadesRiesgoIMSS } from '../../../../../../servicios/catalogo-actividades-riesgo-imss';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'vhumano_centros_de_trabajo_catalogos',
  templateUrl: './lista_centros_de_trabajo.component.html',
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
    './lista_centros_de_trabajo.component.css'
  ],
  providers: [ConfirmationService]
})
export class VHCentrosTrabajoListaComponent implements OnInit {
  public cTrabBajaModel: ctraBajaModelo;
  public centTrabModel: centroTrabajoModelo;
  public popUpAccept: string = "";
  public popUpReject: string = "";
  catalogo_centros_trabajo: any = [];
  centros_trabajo_aactivos_: any = [];
  inactivos_centros_trabajo: any = [];
  deleted_centros_trabajo: any = [];
  catalogo_establecimientos: any = [];

  public ctrab_alta_ver: boolean = false;
  public ctrab_baja_ver: boolean = false;
  public ctrab_detver: boolean = false;
  public viewFormulario: boolean = false;
  public ctrab_detfolio: string = "";
  centro_trabajo_detalle: any = [];

  actividades_riesgo_divisiones: any = [];
  actividades_riesgo_grupos: any = [];
  actividades_riesgo_fracciones: any = [];
  info_form: FormGroup;

  constructor(
    private ctraserv: CentrosTrabajoService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private dirServ: DireccionesService,
    private servXlsx: DescargaExcel,
    private primeAlerts: MessageService,
    private relInterna: ComunicacionInternaService,
    private estabServ: EstablecimientosService,
    private imssRiesgAct: CatalogoActividadesRiesgoIMSS,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.cTrabBajaModel = new ctraBajaModelo('', '', '');
    this.centTrabModel = new centroTrabajoModelo('', '', '', '---', '', '---', '', '---', '---', '', '', false, '', '', null, null);
    this.info_form = this.fb.group({
      riesgo_division: [this.centTrabModel.riesgo_division_label || null],
      riesgo_grupo: [this.centTrabModel.riesgo_grupo_label || null],
      riesgo_fraccion: [this.centTrabModel.riesgo_fraccion_label || null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaTrabajoCentroRegistro();
    this.descarga_centros_de_trabajo();
    this.descarga_centros_de_trabajo_activos();
    this.descarga_centros_de_trabajo_inactivos();
    this.descarga_centros_de_trabajo_eliminados();
    this.descarga_establecimientos();
    this.descarga_riesgo_actividades();
  }

  getRespuestaTrabajoCentroRegistro() {
    this.relInterna.mensajeVHTrabajoCentroRegistro$.subscribe(
      (mensaje: any) => {
        if (mensaje == "centro_trabajo_registrado") {
          this.descarga_centros_de_trabajo();
          this.descarga_centros_de_trabajo_activos();
          this.descarga_centros_de_trabajo_inactivos();
          this.descarga_centros_de_trabajo_eliminados();
        }
      }
    );
  }

  descarga_excel_centros_de_trabajo() {
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "folio_centro_trab", align: "center" },
      { label: this.translate.instant("fecha_cont"), field: "fecha_contabilizacion", align: "center" },
      { label: "Registro patronal del IMSS", field: "clave_registro_patronal_imss", align: "center" },
      { label: this.translate.instant("ubica_loca"), field: "ubicacion_alias", align: "center" },
      { label: this.translate.instant("desc"), field: "descripcion", align: "left" }
    ];
    this.servXlsx.descarga_xlsx_documento(this.catalogo_centros_trabajo, columnas, 'Centros de trabajo', 'centros_de_trabajo.xlsx');
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

  verDetalleCentroTrabajo(centrotrab_uuid: any) {
    const ctrab = this.catalogo_centros_trabajo.find((row: any) => row.centrotrab_uuid === centrotrab_uuid);
    if (typeof ctrab !== 'undefined') {
      this.ctraserv.detalleCentroTrabajo(centrotrab_uuid).subscribe(
        response => {
          console.log(response.status);
          if (response.status == 'success') {
            this.viewFormulario = true;
            this.centro_trabajo_detalle = response.cent_trab;
            console.log(this.centro_trabajo_detalle);
            this.centro_trabajo_detalle.forEach((ctr: any) => {
              this.centTrabModel.centrotrab_fecha_contabilizacion = ctr.fecha_contabilizacion;
              this.centTrabModel.centrotrab_descripcion = ctr.descripcion;
              this.centTrabModel.centrotrab_clave_registro_patronal_imss = ctr.clave_registro_patronal_imss;

              this.centTrabModel.riesgo_division = ctr.riesgo_trabajo_division;
              this.centTrabModel.riesgo_division_label = this.imssRiesgAct.getDivisionNombre(ctr.riesgo_trabajo_division);
              if (ctr.riesgo_trabajo_division != '---') this.descarga_riesgo_grupos(ctr.riesgo_trabajo_division);
              this.info_form.patchValue({ riesgo_division: this.imssRiesgAct.getDivisionNombre(ctr.riesgo_trabajo_division) });
              //console.log(this.imssRiesgAct.getDivisionNombre(ctr.riesgo_trabajo_division));

              this.centTrabModel.riesgo_grupo = ctr.riesgo_trabajo_grupo;
              this.centTrabModel.riesgo_grupo_label = this.imssRiesgAct.getActividadesPorGrupoNombre(ctr.riesgo_trabajo_division, ctr.riesgo_trabajo_grupo);
              if (ctr.riesgo_trabajo_grupo != '---') this.descarga_riesgo_fraccionesGR(ctr.riesgo_trabajo_grupo);
              this.info_form.patchValue({ riesgo_grupo: this.imssRiesgAct.getActividadesPorGrupoNombre(ctr.riesgo_trabajo_division, ctr.riesgo_trabajo_grupo) });
              //console.log(this.imssRiesgAct.getActividadesPorGrupoNombre(ctr.riesgo_trabajo_division,ctr.riesgo_trabajo_grupo));

              this.centTrabModel.riesgo_fraccion = ctr.riesgo_trabajo_fraccion;
              this.centTrabModel.riesgo_fraccion_label = this.imssRiesgAct.getActividadesPorFraccionNombre(ctr.riesgo_trabajo_division, ctr.riesgo_trabajo_grupo, ctr.riesgo_trabajo_fraccion);
              this.info_form.patchValue({ riesgo_fraccion: this.imssRiesgAct.getActividadesPorFraccionNombre(ctr.riesgo_trabajo_division, ctr.riesgo_trabajo_grupo, ctr.riesgo_trabajo_fraccion) });
              //console.log(this.imssRiesgAct.getActividadesPorFraccionNombre(ctr.riesgo_trabajo_division,ctr.riesgo_trabajo_grupo,ctr.riesgo_trabajo_fraccion));
              this.centTrabModel.riesgo_clave = ctr.riesgo_trabajo_clave;

              this.centTrabModel.centrotrab_ubicacion = ctr.ubicacion_token;
            });
            this.ctrab_detver = true;
            this.ctrab_detfolio = ctrab.folio_centro_trab;
          }
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "El centro de trabajo seleccionado no se encuentra registrado" });
    }
  }

  descarga_riesgo_actividades() {
    this.actividades_riesgo_divisiones = this.imssRiesgAct.getDivisiones();
    console.log(this.actividades_riesgo_divisiones);
  }

  descarga_establecimientos() {
    this.estabServ.listaEstablecimientosNoTrabCentros().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.catalogo_establecimientos = response.establecimientos;
          console.log(this.catalogo_establecimientos);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyupCenTrabRPatronalIMSS(event: any, centrotrab_uuid: string) {
    const ctrab = this.centro_trabajo_detalle.find((row: any) => row.centrotrab_uuid === centrotrab_uuid);
    this.centTrabModel.centrotrab_clave_registro_patronal_imss = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && this.centTrabModel.centrotrab_clave_registro_patronal_imss != ctrab.clave_registro_patronal_imss;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeCenTrabActRiesDivision(division_nombre: any) {
    var cenTrabActRiesDiv = document.getElementById("cenTrabActRiesDiv");
    console.log(division_nombre);
    const riesdiv = this.actividades_riesgo_divisiones.find((row: any) => row.division_nombre === division_nombre);
    this.centTrabModel.riesgo_division = riesdiv.division_id;
    this.centTrabModel.riesgo_grupo = "---";
    this.centTrabModel.riesgo_fraccion = "---";
    this.centTrabModel.riesgo_clave = "---";
    const validacion = division_nombre != "" && this.validator.filtroAlfaNumerico(division_nombre) && typeof riesdiv !== 'undefined';
    validacion ? this.validator.correctoSelectBrowser(cenTrabActRiesDiv) : this.validator.errorSelectBrowser(cenTrabActRiesDiv);
    if (validacion) {
      this.descarga_riesgo_grupos(riesdiv.division_id);
      //actividades_riesgo_grupos
      //actividades_riesgo_fracciones
    }
  }

  descarga_riesgo_grupos(division_id: string) {
    this.actividades_riesgo_grupos = this.imssRiesgAct.getGruposPorDivision(division_id);
    console.log(this.actividades_riesgo_grupos);
  }

  changeCenTrabActRiesGrupos(grupo: any) {
    var cenTrabActRiesGrupo = document.getElementById("cenTrabActRiesGrupo");
    console.log(grupo);
    const riesgrupo = this.actividades_riesgo_grupos.find((row: any) => row.label === grupo);
    this.centTrabModel.riesgo_grupo = riesgrupo.grupo;
    this.centTrabModel.riesgo_fraccion = "---";
    this.centTrabModel.riesgo_clave = "---";
    const validacion = grupo != "" && this.validator.filtroAlfaNumerico(grupo) && typeof riesgrupo !== 'undefined';
    validacion ? this.validator.correctoSelectBrowser(cenTrabActRiesGrupo) : this.validator.errorSelectBrowser(cenTrabActRiesGrupo);
    if (validacion) {
      this.descarga_riesgo_fracciones(riesgrupo.key);
    }
  }

  descarga_riesgo_fracciones(grupo_key: string) {
    this.actividades_riesgo_fracciones = this.imssRiesgAct.getActividadesPorGrupo(this.centTrabModel.riesgo_division, grupo_key);
    console.log(this.actividades_riesgo_fracciones);
  }

  descarga_riesgo_fraccionesGR(grupo_key: string) {
    this.actividades_riesgo_fracciones = this.imssRiesgAct.getActividadesPorGrupoGR(this.centTrabModel.riesgo_division, grupo_key);
    console.log(this.actividades_riesgo_fracciones);
  }

  changeCenTrabActRiesFracciones(actividad: any) {
    var cenTrabActRiesFraccion = document.getElementById("cenTrabActRiesFraccion");
    console.log(actividad);
    const riesfracc = this.actividades_riesgo_fracciones.find((row: any) => row.actividad === actividad);
    this.centTrabModel.riesgo_fraccion = riesfracc.fraccion;
    this.centTrabModel.riesgo_clave = riesfracc.clave;
    const validacion = actividad != "" && this.validator.filtroAlfaNumerico(actividad) && typeof riesfracc !== 'undefined';
    validacion ? this.validator.correctoSelectBrowser(cenTrabActRiesFraccion) : this.validator.errorSelectBrowser(cenTrabActRiesFraccion);
  }

  keyupCenTrabDescripcion(event: any, centrotrab_uuid: string) {
    const ctrab = this.centro_trabajo_detalle.find((row: any) => row.centrotrab_uuid === centrotrab_uuid);
    this.centTrabModel.centrotrab_descripcion = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && this.centTrabModel.centrotrab_descripcion != ctrab.descripcion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectEstablecimiento(event: any, token_establecimiento: string, centrotrab_uuid: string) {
    const ctrab = this.centro_trabajo_detalle.find((row: any) => row.centrotrab_uuid === centrotrab_uuid);
    let estab = this.catalogo_establecimientos.find((row: any) => row.token_establecimiento === token_establecimiento);
    this.centTrabModel.centrotrab_ubicacion = event.checked ? estab.token_establecimiento : '';
    estab.select_for_centrotrab = event.checked == true ? true : false;
    const validacion = token_establecimiento != "" && typeof estab !== 'undefined' && this.centTrabModel.centrotrab_ubicacion != ctrab.ubicacion_token;
    if (!validacion) {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "El establecimiento seleccionado no se encuentra registrado" });
    }
  }

  validaUpdateCentroTrabajo(centrotrab_uuid: string): boolean {
    const ctrab = this.centro_trabajo_detalle.find((row: any) => row.centrotrab_uuid === centrotrab_uuid);

    const centrotrab_claveRPImss = this.centTrabModel.centrotrab_clave_registro_patronal_imss;
    const validacion_rpatronal_imss = centrotrab_claveRPImss != "" && this.validator.filtroAlfaNumerico(centrotrab_claveRPImss) && centrotrab_claveRPImss.length >= 4 && centrotrab_claveRPImss != ctrab.clave_registro_patronal_imss;

    const validacion_riesgo_division = this.centTrabModel.riesgo_division != "" && this.centTrabModel.riesgo_division != ctrab.riesgo_trabajo_division;
    const validacion_riesgo_grupo = this.centTrabModel.riesgo_grupo != "" && this.centTrabModel.riesgo_grupo != ctrab.riesgo_trabajo_grupo;
    const validacion_riesgo_fraccion = this.centTrabModel.riesgo_fraccion != "" && this.centTrabModel.riesgo_fraccion != ctrab.riesgo_trabajo_fraccion;
    const validacion_riesgo_clave = this.centTrabModel.riesgo_clave != "" && this.centTrabModel.riesgo_clave != ctrab.riesgo_trabajo_clave;

    const centrotrab_descripcion = this.centTrabModel.centrotrab_descripcion;
    const validacion_descripcion = centrotrab_descripcion != "" && this.validator.filtroAlfaNumerico(centrotrab_descripcion) && centrotrab_descripcion.length >= 4 && centrotrab_descripcion != ctrab.descripcion;

    const validacion_ubicacion = this.centTrabModel.centrotrab_ubicacion != '' && this.centTrabModel.centrotrab_ubicacion != ctrab.ubicacion_token;
    return validacion_rpatronal_imss || validacion_riesgo_division || validacion_riesgo_grupo || validacion_riesgo_fraccion || validacion_riesgo_clave || validacion_descripcion || validacion_ubicacion;
  }

  limpia_campos() {
    //this.validator.limpiaInputRowClases(document.getElementById("cenTrabEditRPImss"));
    //this.validator.limpiaInputRowClases(document.getElementById("cenTrabEditDesc"));
  }

  actualizarCentroTrabajo(form: { reset: () => void; }, centrotrab_uuid: string): void {
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
        this.viewFormulario = false;
        this.ctraserv.actualizaCentroTrabajo(centrotrab_uuid, this.centTrabModel).subscribe(
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
              this.descarga_establecimientos();
              //this.limpia_campos();
              this.viewFormulario = true;
              this.centTrabModel = new centroTrabajoModelo('', '', '', '---', '', '---', '', '---', '---', '', '', false, '', '', null, null);
              this.verDetalleCentroTrabajo(centrotrab_uuid);
              this.descarga_centros_de_trabajo();
              this.descarga_centros_de_trabajo_activos();
              this.descarga_centros_de_trabajo_inactivos();
              this.descarga_centros_de_trabajo_eliminados();
              //this.relInterna.mensajeTrabajadorRegistro("centro_trabajo_registrado");
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

  descarga_centros_de_trabajo_activos() {
    this.ctraserv.catalogoCentrosTrabajoActivos().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.centros_trabajo_aactivos_ = response.cent_trab;
          console.log(this.centros_trabajo_aactivos_);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  altaTrabajoCentro(centrotrab_uuid: any, baja_motivo: any, baja_fecha: any) {
    this.cTrabBajaModel.centrotrab_uuid = centrotrab_uuid;
    this.cTrabBajaModel.baja_motivo = baja_motivo;
    this.cTrabBajaModel.baja_fecha_contabilizacion = baja_fecha;
    this.ctrab_alta_ver = true;
  }

  dardealtaTrabajoCentro(centrotrab_uuid: any) {
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
        this.ctraserv.altaCentroTrabajo(centrotrab_uuid).subscribe(
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
              this.ctrab_alta_ver = false;
              this.cTrabBajaModel = new ctraBajaModelo('', '', '');
              this.descarga_centros_de_trabajo();
              this.descarga_centros_de_trabajo_activos();
              this.descarga_centros_de_trabajo_inactivos();
              this.descarga_centros_de_trabajo_eliminados();
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

  bajaTrabajoCentro(centrotrab_uuid: any) {
    this.cTrabBajaModel.centrotrab_uuid = centrotrab_uuid;
    this.ctrab_baja_ver = true;
  }

  keyupCenTrabBajaMotivo(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cTrabBajaModel.baja_motivo = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCenTrabBajaFecha(event: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.cTrabBajaModel.baja_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  dardebajaTrabajoCentro(centrotrab_uuid: any) {
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
        this.ctraserv.bajaCentroTrabajo(centrotrab_uuid, this.cTrabBajaModel.baja_motivo, this.cTrabBajaModel.baja_fecha_contabilizacion).subscribe(
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
              this.validator.limpiaInputRow(document.getElementById("cenTrabBajaMotivo"));
              this.validator.limpiaInputRow(document.getElementById("cenTrabBajaFecha"));
              this.ctrab_baja_ver = false;
              this.cTrabBajaModel = new ctraBajaModelo('', '', '');
              this.descarga_centros_de_trabajo();
              this.descarga_centros_de_trabajo_activos();
              this.descarga_centros_de_trabajo_inactivos();
              this.descarga_centros_de_trabajo_eliminados();
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

  descarga_centros_de_trabajo_inactivos() {
    this.ctraserv.catalogoCentrosTrabajoInactivos().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.inactivos_centros_trabajo = response.cent_trab;
          console.log(this.inactivos_centros_trabajo);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteTrabajoCentro(centrotrab_uuid: any) {
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
        this.ctraserv.eliminaCentroTrabajo(centrotrab_uuid).subscribe(
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
              this.descarga_centros_de_trabajo();
              this.descarga_centros_de_trabajo_activos();
              this.descarga_centros_de_trabajo_inactivos();
              this.descarga_centros_de_trabajo_eliminados();
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

  descarga_centros_de_trabajo_eliminados() {
    this.ctraserv.catalogoCentrosTrabajoEliminados().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.deleted_centros_trabajo = response.cent_trab;
          console.log(this.deleted_centros_trabajo);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  restauraTrabajoCentro(centrotrab_uuid: any) {
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
        this.ctraserv.restauraCentroTrabajo(centrotrab_uuid).subscribe(
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
              this.descarga_centros_de_trabajo();
              this.descarga_centros_de_trabajo_activos();
              this.descarga_centros_de_trabajo_inactivos();
              this.descarga_centros_de_trabajo_eliminados();
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

  eliminapermTrabajoCentro(centrotrab_uuid: any) {
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
        this.ctraserv.eliminacionPermanenteCentroTrabajo(centrotrab_uuid).subscribe(
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
              this.descarga_centros_de_trabajo();
              this.descarga_centros_de_trabajo_activos();
              this.descarga_centros_de_trabajo_inactivos();
              this.descarga_centros_de_trabajo_eliminados();
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
