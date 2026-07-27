import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { centroTrabajoModelo } from '../../../../../../modelos/centroTrabajoModelo';
import { CentrosTrabajoService } from '../../../../../../servicios/ssic/centros-trabajo-service';
import Swal from 'sweetalert2';
import { CatalogoActividadesRiesgoIMSS } from '../../../../../../servicios/catalogo-actividades-riesgo-imss';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';

@Component({
  selector: 'vhumano_centros_de_trabajo_registro',
  templateUrl: './alta_centros_de_trabajo.component.html',
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
    './alta_centros_de_trabajo.component.css'
  ],
  providers: [ConfirmationService]
})
export class VHCentrosTrabajoAltaComponent implements OnInit {
  public centTrabModel: centroTrabajoModelo;
  public registrar_establecimiento: boolean = false;
  public popUpAccept: string = "";
  public popUpReject: string = "";
  catalogo_establecimientos: any = [];
  riesgos_de_trabajo_clasificacion_lista: any = [];
  actividades_riesgo_divisiones: any = [];
  actividades_riesgo_grupos: any = [];
  actividades_riesgo_fracciones: any = [];

  constructor(
    private ctraserv: CentrosTrabajoService,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private dirServ: DireccionesService,
    private primeAlerts: MessageService,
    private relInterna: ComunicacionInternaService,
    private confirmationService: ConfirmationService,
    private imssRiesgAct: CatalogoActividadesRiesgoIMSS,
    private estabServ: EstablecimientosService,
  ) {
    this.centTrabModel = new centroTrabajoModelo('', '', '', '---', '', '---', '', '---', '---', '', '', false, '', '');
  }

  ngOnInit(): void {
    this.descarga_establecimientos();
    /*Clasificación de los riesgos de trabajo 
    Cuando hablamos de la seguridad laboral en México, el Instituto Mexicano del Seguro Social desempeña un importante papel para clasificar los riesgos de trabajo. El IMSS analiza la actividad económica de la empresa y la siniestralidad histórica para asignarle una clase de riesgo. A mayor riesgo, mayor es la prima que la empresa debe pagar al IMSS.*/
    this.riesgos_de_trabajo_clasificacion_lista = [
      {
        data_db: 'I',
        clase: 'Clase I: Riesgo mínimo',
        observacion: 'Incluye actividades consideradas seguras con baja probabilidad de accidentes o enfermedades laborales como oficinas administrativas, servicios educativos o actividades de consultoría y asesoría.'
      },
      {
        data_db: 'II',
        clase: 'Clase II: Riesgo bajo',
        observacion: 'Agrupa ocupaciones con un ligero aumento en la probabilidad de accidentes, aunque siguen siendo moderadamente seguras como comercio al por menor, restaurantes y servicios de alimentos, y servicios de atención médica en consultorios.'
      },
      {
        data_db: 'III',
        clase: 'Clase III: Riesgo medio',
        observacion: 'Corresponde a ocupaciones donde existe un riesgo moderado, generalmente relacionado con el uso frecuente de herramientas o maquinaria, aunque sin exposición constante a condiciones peligrosas extremas.'
      },
      {
        data_db: 'IV',
        clase: 'Clase IV: Riesgo alto',
        observacion: 'Incluye actividades con una alta probabilidad de accidentes o enfermedades de trabajo, como la industria minera, la construcción de grandes obras, y la fabricación de productos químicos peligrosos.'
      },
      {
        data_db: 'V',
        clase: 'Clase V: Riesgo máximo',
        observacion: 'Corresponde a las actividades con los niveles más altos de peligrosidad, donde los trabajadores están expuestos a condiciones extremas, sustancias tóxicas o riesgos severos como minería, industria química o trabajo en plataformas petroleras.'
      }
    ];
    this.descarga_riesgo_actividades();
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

  abre_registrar_establecimiento() {
    this.registrar_establecimiento = true;
  }

  keyupCenTrabRPatronalIMSS(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.centTrabModel.centrotrab_clave_registro_patronal_imss = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCenTrabLatitude(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.centTrabModel.latitude = validacion ? parseFloat(event.value) : null;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCenTrabLongitude(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.centTrabModel.longitude = validacion ? parseFloat(event.value) : null;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  onNodeSelected(event: any): void {
    console.log(event.node.link);
  }

  onNodeExpand(event: any) {
    const node = event.node;
    //// 🔒 Cierra todos los demás nodos
    //this.expandedKeys = {};
    //// ✅ Solo deja abierto el nodo expandido
    //this.expandedKeys[node.key] = true;
  }

  onNodeCollapse(event: any) {
    const node = event.node;
    //delete this.expandedKeys[node.key];
  }

  changeCenTrabActRiesDivision(opcion: any) {
    var cenTrabActRiesDiv = document.getElementById("cenTrabActRiesDiv");
    console.log(opcion);
    const riesdiv = this.actividades_riesgo_divisiones.find((row: any) => row.division_id === opcion.division_id);
    const validacion = opcion.division_id != "" && this.validator.filtroNum(opcion.division_id) == true && typeof riesdiv !== 'undefined';
    this.centTrabModel.riesgo_division = validacion ? riesdiv.division_id : "";
    this.centTrabModel.riesgo_grupo = "---";
    this.centTrabModel.riesgo_fraccion = "---";
    this.centTrabModel.riesgo_clave = "---";
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

  changeCenTrabActRiesGrupos(opcion: any) {
    var cenTrabActRiesGrupo = document.getElementById("cenTrabActRiesGrupo");
    console.log(opcion);
    const riesgrupo = this.actividades_riesgo_grupos.find((row: any) => row.key === opcion.key);
    const validacion = opcion.key != "" && this.validator.filtroAlfaNumerico(opcion.key) == true && typeof riesgrupo !== 'undefined';
    this.centTrabModel.riesgo_grupo = validacion ? riesgrupo.grupo : "";
    this.centTrabModel.riesgo_fraccion = "---";
    this.centTrabModel.riesgo_clave = "---";
    validacion ? this.validator.correctoSelectBrowser(cenTrabActRiesGrupo) : this.validator.errorSelectBrowser(cenTrabActRiesGrupo);
    if (validacion) {
      this.descarga_riesgo_fracciones(riesgrupo.key);
      //
    }
  }

  descarga_riesgo_fracciones(grupo_key: string) {
    this.actividades_riesgo_fracciones = this.imssRiesgAct.getActividadesPorGrupo(this.centTrabModel.riesgo_division, grupo_key);
    console.log(this.actividades_riesgo_fracciones);
  }

  changeCenTrabActRiesFracciones(opcion: any) {
    var cenTrabActRiesFraccion = document.getElementById("cenTrabActRiesFraccion");
    console.log(opcion);
    const riesfracc = this.actividades_riesgo_fracciones.find((row: any) => row.key === opcion.key);
    const validacion = opcion.key != "" && this.validator.filtroAlfaNumerico(opcion.key) == true && typeof riesfracc !== 'undefined';
    this.centTrabModel.riesgo_fraccion = validacion ? riesfracc.fraccion : "";
    this.centTrabModel.riesgo_clave = validacion ? riesfracc.clave : "";
    validacion ? this.validator.correctoSelectBrowser(cenTrabActRiesFraccion) : this.validator.errorSelectBrowser(cenTrabActRiesFraccion);
  }

  //changeCenTrabDivision(opcion:any){
  //  var cenTrabDivision = document.getElementById("cenTrabDivision");
  //  console.log(opcion);
  //  const riesgo = this.riesgos_de_trabajo_clasificacion_lista.find((row:any) => row.clase === opcion.clase);
  //  const validacion = opcion.clase != "" && this.validator.filtroAlfaNumerico(opcion.clase) == true && typeof riesgo !== 'undefined'; 
  //  this.centTrabModel.division = validacion ? riesgo.data_db : "";
  //  validacion ? this.validator.correctoSelectBrowser(cenTrabDivision) : this.validator.errorSelectBrowser(cenTrabDivision);
  //}

  keyupCenTrabDescripcion(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.centTrabModel.centrotrab_descripcion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectEstablecimiento(event: any, token_establecimiento: string) {
    let estab = this.catalogo_establecimientos.find((row: any) => row.token_establecimiento === token_establecimiento);
    const validacion = token_establecimiento != "" && typeof estab !== 'undefined';
    if (validacion) {
      estab.select_for_centrotrab = validacion && event.checked == true ? true : false;
      this.centTrabModel.centrotrab_ubicacion = event.checked ? estab.token_establecimiento : '';
    } else {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "El establecimiento seleccionado no se encuentra registrado" });
      this.centTrabModel.centrotrab_ubicacion = '';
    }
  }

  get validaRegistroCentroTrabajo(): boolean {
    const validacion_descripcion = this.centTrabModel.centrotrab_descripcion != "" && this.validator.filtroAlfaNumerico(this.centTrabModel.centrotrab_descripcion) && this.centTrabModel.centrotrab_descripcion.length >= 4;
    const validacion_rpatronal_imss = this.centTrabModel.centrotrab_clave_registro_patronal_imss != "" && this.validator.filtroAlfaNumerico(this.centTrabModel.centrotrab_clave_registro_patronal_imss) && this.centTrabModel.centrotrab_clave_registro_patronal_imss.length >= 4;
    const validacion_ubicacion = this.centTrabModel.centrotrab_ubicacion != '';
    return validacion_descripcion && validacion_rpatronal_imss && validacion_ubicacion;
  }

  registrarCentroTrabajo(form: { reset: () => void; }): void {
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
        //this.viewFormulario = false;
        this.ctraserv.registroCentroTrabajo(this.centTrabModel).subscribe(
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
              this.centTrabModel = new centroTrabajoModelo('', '', '', '---', '', '---', '', '---', '---', '', '', false, '', '');
              this.validator.limpiaInputRow(document.getElementById("cenTrabRPImss"));
              this.validator.limpiaInputRow(document.getElementById("cenTrabLat"));
              this.validator.limpiaInputRow(document.getElementById("cenTrabLong"));
              this.validator.limpiaInputRow(document.getElementById("cenTrabDesc"));
              this.descarga_establecimientos();
              this.relInterna.mensajeTrabajoCentroRegistro("centro_trabajo_registrado");
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
