import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ProyectosService } from '../../../../../servicios/ssic/proyectos-service.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { proyectosUpdateModelo } from '../../../../../modelos/proyectos_gestion/proyectosUpdateModelo';
import { tareasModelo } from '../../../../../modelos/proyectos_gestion/tareasModelo';
import { tareasUpdateModelo } from '../../../../../modelos/proyectos_gestion/tareasUpdateModelo';
import { informesModelo } from '../../../../../modelos/proyectos_gestion/informesModelo';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'proy_block_lista_proyectos',
  templateUrl: './proyectos_list.component.html',
  standalone:false,
  styleUrls: [
    './proyectos_list.component.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/switches.css',
    //'~jsgantt-improved/dist/jsgantt.css'
  ]
})
export class CatalogoProyectosComponent implements OnInit, OnDestroy {
  options = {};
  isCollapsed = true;

  opcionesTooltip = {
    'placement': 'left',
    'showDelay': 500
  };

  public usuario: Usuarios;
  //personal
  searchPersonal: any;
  pagePersonal: number = 1;
  arrayEmpleados:any = [];

  //proyectos
  public boolean_permiso_proyectos: boolean = false;
  public boolean_permiso_tareas: boolean = false;
  public boolean_permiso_informes: boolean = false;
  public boolean_permiso_eliminar: boolean = false;
  public boolean_permiso_ver_docs: boolean = false;
  public edit_proyecto: proyectosUpdateModelo;

  public tipo_filtro_listas: string;
  public clase_filtro_listas: string = "teal_darken_2";
  public proyResponse: boolean;
  proyBuscar: string = '';
  proyTotalRecords: number = 0;
  proyFirstFilter: number = 0;
  proyRows: number = 10;
  pageProy: number = 1;
  searchProySide: any;
  pageProySide: number = 1;
  arrayProyectos:any = [];
  arrayProyectosPag:any = [];

  searchDelProy: any;
  arrayDeletedProyectos:any = [];
  pageDelProy: number = 1;

  public style_select_resp: string = "width: 100%!important;";
  listEquipoTrabajo:any = [];

  public string_proy_manager: string;
  public string_proy_teamwork: string;
  public validate_project_update: boolean;
  public validate_last_project_created: boolean;
  edit_EquipoTrabajo:any = [];
  detalleProyecto:any = [];

  //recalendarización de proyecto
  public txt_fecha_recal_proyecto: string;
  searchRecalendarProy: any;
  pageRecalendarProy: number = 1;

  //tareas
  public tareasModelo: tareasModelo;
  public tareasUpdateModelo: tareasUpdateModelo;

  searchTar: string = '';
  //searchTar: any = { folio_tar: '' };
  pageTar: number = 1;
  searchTarNewReg: any;
  buscarTareaAntList: any;
  pageTarNewReg: number = 1;
  searchDelTar: any;
  pageDelTar: number = 1;
  arrayDetalleTareas:any = [];

  //informes
  public informesModelo: informesModelo;
  searchInf: any;
  pageInformes: number = 1;

  searchDelInf: any;
  pageDelInformes: number = 1;

  //registro de informes
  public files: NgxFileDropEntry[] = [];

  //lista de informes
  public progBarUpdateInformes: boolean;
  public pdfEvidencia: any;
  public observaciones_revision: string;
  listaArchivosInforme:any = [];

  constructor(
    private validator: ValidatorServService,
    private _proyServ: ProyectosService,
    private _persServ: EmpleadosService,
    private translate: TranslateService
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.edit_proyecto = new proyectosUpdateModelo("", "", "", "", "", "", "", "", false, false, "", [], [], []);
    this.tareasModelo = new tareasModelo("", "", "", "", [], []);
    this.tareasUpdateModelo = new tareasUpdateModelo("", "", "", "", "", [], [], "");
    this.informesModelo = new informesModelo("", "", 0, [], [], false);
    this.boolean_permiso_proyectos = false;
    this.boolean_permiso_tareas = false;
    this.boolean_permiso_informes = false;
    this.boolean_permiso_eliminar = false;
    this.boolean_permiso_ver_docs = false;
    this.validate_project_update = false;
    this.validate_last_project_created = false;
    this.proyResponse = false;
    this.tipo_filtro_listas = "";
    this.string_proy_manager = "";
    this.string_proy_teamwork = "";
    this.txt_fecha_recal_proyecto = "";
    this.progBarUpdateInformes = false;
    this.observaciones_revision = "";
  }

  ngOnInit(): void {
    this.listen();
    this.permisos_settings();
    this.string_proy_manager = this.translate.instant("proy_manager");
    this.string_proy_teamwork = this.translate.instant("proy_teamwork");
    //console.log(this.informesModelo.informe_evidencias_files);

    this._persServ.catalogoGeneralTrabajadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayEmpleados = response.empleados;
          console.log(this.arrayEmpleados);
        }
      },
      error => {
        console.log(error);
      }
    );

    //this.toolTipsBS();
    this.listaProyectosTrue();
    this.proyUpdatePaginated();
  }

  public paginarData(array: any[]): any[] {
    const inicio = (this.pagePersonal -1) * 10;
    const fin = inicio + 10;
    return array.slice(inicio,fin);
  }

  cambiaPagina(pagina:number){
    this.pagePersonal = pagina;
  }

  proyectoPag() {
    this.proyTotalRecords = this.arrayProyectos.length;
    this.arrayProyectosPag = this.arrayProyectos.slice(0,10);
  }

  proyectoOnPageChange(event: any) {
    this.proyFirstFilter = event.first;
    this.proyRows = event.rows;
    this.proyUpdatePaginated();
  }

  proyUpdatePaginated() {
    const filteredItems = this.arrayProyectos.filter((item:any) => 
      item.abrev_cliente.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.creat_lider.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.date_end_proy_epoc.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.fecha_inicio.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.folio_proy.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.nombre_cliente.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.nombre_lider.toLowerCase().includes(this.proyBuscar.toLowerCase()) ||
      item.proyecto.toLowerCase().includes(this.proyBuscar.toLowerCase()));
    this.proyTotalRecords = filteredItems.length;
    this.arrayProyectosPag = filteredItems.slice(this.proyFirstFilter, this.proyFirstFilter + this.proyRows);
  }

  duplicaTareaOnPageChange(event: any) {
    const first = event.first;
    const rows = event.rows;
    this.arrayProyectosPag = this.arrayProyectos.slice(first, first + rows);
  }

  tareaOnPageChange(event:any,token_proyecto:any) {
    const ind_inicio = this.arrayProyectos.findIndex((row:any) => row.token_proyecto == token_proyecto);
    this.arrayProyectos[ind_inicio]["detalle_proyecto"][0]['tarFirstFilter'] = event.first;
    this.arrayProyectos[ind_inicio]["detalle_proyecto"][0]['tarRows'] = event.rows;
    this.tareaUpdatePaginated(token_proyecto);
  }

  tareaUpdatePaginated(token_proyecto:any) {
    const ind_inicio = this.arrayProyectos.findIndex((row:any) => row.token_proyecto == token_proyecto);
    const pryIndex = this.arrayProyectos[ind_inicio]["detalle_proyecto"][0];
    const filteredItems = pryIndex['tarea_list'].filter((item:any) => 
      item.fin_tarea.toLowerCase().includes(this.searchTar.toLowerCase()) ||
      item.folio_tar.toLowerCase().includes(this.searchTar.toLowerCase()) ||
      item.inicio_tarea.toLowerCase().includes(this.searchTar.toLowerCase()) ||
      item.tarea_descripcion.toLowerCase().includes(this.searchTar.toLowerCase()) ||
      item.tarea_nombre.toLowerCase().includes(this.searchTar.toLowerCase()));



      //fin_tarea
      //folio_tar
      //inicio_tarea
      //tarea_descripcion
      //tarea_nombre
    console.log(filteredItems.length);
    pryIndex['tarTotalRecords'] = filteredItems.length;
    pryIndex['tarea_list_pag'] = filteredItems.slice(pryIndex['tarFirstFilter'],pryIndex['tarFirstFilter'] + pryIndex['tarRows']);
  }
  //funciones generales
  toolTipsBS(){
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();   
    });
  }

  lastProjectCreated() {
    this._proyServ.lastProjectCreated().subscribe(
      response => {
        if (response.status == 'success') {
          for (let i = 0; i < this.arrayProyectos.length; i++) {
            const proy = this.arrayProyectos[i];
            if (proy["folio_proy"] == response.proyectos[0]["folio_proy"]) {
              this.validate_last_project_created = true;
            }
          }
          if (this.validate_last_project_created == false) {
            this.arrayProyectos.unshift(response.proyectos[0]);
            this.proyectoPag();
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listen() {
    //const messaging = getMessaging();
    //onMessage(messaging, (payload) => {
    //  Swal.fire({
    //    position: 'bottom-end',
    //    icon: 'info',
    //    title: payload.notification?.title,
    //    text: payload.notification?.body,
    //    showConfirmButton: false,
    //    timer: 5000
    //  });
    //  this.permisos_settings();
    //});
  }

  permisos_settings() {
    this._proyServ.permisos_proyectos().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.boolean_permiso_proyectos = response.permisos_proyectos;
          this.boolean_permiso_tareas = response.permisos_tareas;
          console.log(this.boolean_permiso_tareas);
          this.boolean_permiso_informes = response.permisos_informes;
          this.boolean_permiso_eliminar = response.permisos_eliminar;
          this.boolean_permiso_ver_docs = response.permisos_ver_docs;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cerrarModal(modal: any) {
    $(modal).removeClass("open");
  }

//proyectos
  selectBusqueda(event: any) {
    if (event.value != "") {
      this.clase_filtro_listas = event.value; 
      if (event.value == "buscar_listas_generales") {
        this.clase_filtro_listas = "teal_darken_2";
        this.listaProyectosTrue();
      } else {
        this.tipo_filtro_listas = event.value;  
        //public clase_filtro_listas: string = "teal_darken_2";
        if (event.value == "buscar_por_fechas") {this.clase_filtro_listas = "light_blue_darken_4";} 
        else if (event.value == "buscar_por_pvacios") {this.clase_filtro_listas = "grey_darken_4";}
        else if (event.value == "buscar_por_pnuevos") {this.clase_filtro_listas = "green_darken_4";}
        else if (event.value == "buscar_por_pporvencer") {this.clase_filtro_listas = "orange_darken_1";}
        else if (event.value == "buscar_por_pvencidos") {this.clase_filtro_listas = "red_darken_4";}
        else if (event.value == "buscar_por_pfinished") {this.clase_filtro_listas = "grey_darken_1";}
      }
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: "seleccione filtro de busqueda",
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  filtroProyBusqueda(value: any) {
    if (value != "") {
      if (value == "ASC") {
        if (this.tipo_filtro_listas == "buscar_por_fechas") {this.listaProyectosAscFecha();} 
        else if (this.tipo_filtro_listas == "buscar_por_pvacios") {this.listaProyectosAscBlack();}
        else if (this.tipo_filtro_listas == "buscar_por_pnuevos") {this.listaProyectosAscGreen();}
        else if (this.tipo_filtro_listas == "buscar_por_pporvencer") {this.listaProyectosAscYellow();}
        else if (this.tipo_filtro_listas == "buscar_por_pvencidos") {this.listaProyectosAscRed();}
        else if (this.tipo_filtro_listas == "buscar_por_pfinished") {this.listaProyectosAscFinish();}
      } else {
        if (this.tipo_filtro_listas == "buscar_por_fechas") {this.listaProyectosDescFecha();} 
        else if (this.tipo_filtro_listas == "buscar_por_pvacios") {this.listaProyectosDescBlack();}
        else if (this.tipo_filtro_listas == "buscar_por_pnuevos") {this.listaProyectosDescGreen();}
        else if (this.tipo_filtro_listas == "buscar_por_pporvencer") {this.listaProyectosDescYellow();}
        else if (this.tipo_filtro_listas == "buscar_por_pvencidos") {this.listaProyectosDescRed();}
        else if (this.tipo_filtro_listas == "buscar_por_pfinished") {this.listaProyectosDescFinish();}
      }
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: "seleccione busqueda ascendente o descendente",
        showConfirmButton: false,
        timer: 3000
      })
    }
  }

  listaProyectosTrue() {
    this.arrayProyectos = [];
    this.proyResponse = false;
    this._proyServ.proyectosList().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosFalse() {
    this._proyServ.proyectosDeleted().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayDeletedProyectos = response.proyectos;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosAscFecha() {
    this._proyServ.listaProyectosAscFecha().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosDescFecha() {
    this._proyServ.listaProyectosDescFecha().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosAscBlack() {
    this._proyServ.listaProyectosAscBlack().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosDescBlack() {
    this._proyServ.listaProyectosDescBlack().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosAscGreen() {
    this._proyServ.listaProyectosAscGreen().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosDescGreen() {
    this._proyServ.listaProyectosDescGreen().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosAscYellow() {
    this._proyServ.listaProyectosAscYellow().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosDescYellow() {
    this._proyServ.listaProyectosDescYellow().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosAscRed() {
    this._proyServ.listaProyectosAscRed().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosDescRed() {
    this._proyServ.listaProyectosDescRed().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.arrayDeletedProyectos = response.proyectosDeleted;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosAscFinish() {
    this._proyServ.listaProyectosAscFinish().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosDescFinish() {
    this._proyServ.listaProyectosDescFinish().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayProyectos = response.proyectos;
          this.proyectoPag();
          this.proyResponse = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  recarga_listas_proyectos_general() {
    this.listaProyectosTrue();
    this.listaProyectosFalse();
  }

  recoverProyectoItem(token_proyecto: any) {
    this._proyServ.recoverProyecto(token_proyecto).subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayProyectos.unshift(response.proyectos[0]);
        }
        if (response.status == 'error') {
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

  recoverProyectoData(token_proyecto: any) {
    this._proyServ.recoverProyecto(token_proyecto).subscribe(
      response => {
        if (response.status == 'success') {
          for (let i = 0; i < this.arrayProyectos.length; i++) {
            const proy = this.arrayProyectos[i];
            if (proy["token_proyecto"] == token_proyecto) {
              proy["folio_proy"] = response.proyectos[0]["folio_proy"];
              proy["proyecto"] = response.proyectos[0]["proyecto"];
              proy["descripcion"] = response.proyectos[0]["descripcion"];
              proy["abrev_cliente"] = response.proyectos[0]["abrev_cliente"];
              proy["nombre_cliente"] = response.proyectos[0]["nombre_cliente"];
              proy["upload_evidencias"] = response.proyectos[0]["upload_evidencias"];
              proy["evd_delete_perm"] = response.proyectos[0]["evd_delete_perm"];
              proy["simple_prioridad_proyecto"] = response.proyectos[0]["simple_prioridad_proyecto"];
              proy["text_prioridad_proyecto"] = response.proyectos[0]["text_prioridad_proyecto"];
              proy["fecha_inicio"] = response.proyectos[0]["fecha_inicio"];
              proy["date_end_proy_epoc"] = response.proyectos[0]["date_end_proy_epoc"];
              proy["date_end_proy_html"] = response.proyectos[0]["date_end_proy_html"];
              proy["recalendarizacion"] = response.proyectos[0]["recalendarizacion"];
              this.edit_proyecto.arrayRecalendar = response.proyectos[0]["recalendarizacion"];
              proy["creat_lider"] = response.proyectos[0]["creat_lider"];
              proy["token_lider"] = response.proyectos[0]["token_lider"];
              proy["nombre_lider"] = response.proyectos[0]["nombre_lider"];
              proy["listProyToLeader"] = response.proyectos[0]["listProyToLeader"];
              proy["equipo_trabajo_min"] = response.proyectos[0]["equipo_trabajo_min"];
              proy["equipo_trabajo_max"] = response.proyectos[0]["equipo_trabajo_max"];
              this.edit_proyecto.arrayEquipoTrabajo = response.proyectos[0]["equipo_trabajo_max"];
              proy["tareas"] = response.proyectos[0]["tareas"];
              proy["proyecto_status"] = response.proyectos[0]["proyecto_status"];
              proy["paloma_proyecto"] = response.proyectos[0]["paloma_proyecto"];

              if (proy["status_detalle"] == true) {
                proy["detalle_proyecto"][0]["equipoTrabajoDetalle"].length = 0;
                proy["detalle_proyecto"][0]["equipoTrabajoDetalle"] = response.proyectos[0]["equipo_trabajo_min"];
              }

            }
          }
        }
        if (response.status == 'error') {
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

  nuevo_nombre_proyecto(token_proyecto: any) {
    this._proyServ.nuevoNombreProyecto(token_proyecto).subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          for (let index = 0; index < this.arrayProyectos.length; index++) {
            const proy = this.arrayProyectos[index];
            if (proy['token_proyecto'] == token_proyecto) {
              proy['proyecto'] = response.proyecto;
              proy['stado_tarea'] = response.stado_tarea;
              proy['paloma'] = response.paloma;
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  detalle_proyecto_new_tarea(token_proyecto: any) {
    const proy_row = this.arrayProyectos.find((proy:any) => proy["token_proyecto"] === token_proyecto);
    this._proyServ.detalleProyecto(token_proyecto).subscribe(
      response => {
        if (response.status == 'success') {
          proy_row["detalle_proyecto"] = response.proyecto;
          proy_row["detalle_proyecto"][0]["equipoTrabajoDetallePag"] = proy_row["detalle_proyecto"][0]["equipoTrabajoDetalle"].slice(0,10);
          proy_row["detalle_proyecto"][0]['tarea_list_pag'] = proy_row["detalle_proyecto"][0]['tarea_list'].slice(0,10);
          console.log(response.proyecto);
        }
        if (response.status == 'error') {
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

  trabajoTeamOnPageChange(event: any,token_proyecto:any) {
    const ind_inicio = this.arrayProyectos.findIndex((row:any) => row.token_proyecto == token_proyecto);
    const first = event.first;
    const rows = event.rows;
    this.arrayProyectos[ind_inicio]["detalle_proyecto"][0]['equipoTrabajoDetallePag'] = this.arrayProyectos[ind_inicio]["detalle_proyecto"][0]['equipoTrabajoDetalle'].slice(first, first + rows);
  }

  detalle_proyecto_main(token_proyecto: any) {
    for (let b = 0; b < this.arrayProyectos.length; b++) {
      const proy = this.arrayProyectos[b];
      if (proy["token_proyecto"] == token_proyecto) {
        this.edit_EquipoTrabajo = [];
        this._proyServ.detalleProyecto(token_proyecto).subscribe(
          response => {
            if (response.status == 'success') {
              console.log(response.proyecto);
              proy["detalle_proyecto"] = response.proyecto;
              this.detalleProyecto = response.proyecto;
              this.tareasModelo.responsable_tarea = proy["detalle_proyecto"][0]['token_lider'];
              proy["status_detalle"] = true;
              for (let i = 0; i < this.arrayEmpleados.length; i++) {
                const pers = this.arrayEmpleados[i];
                if (pers['token_empleado_inside'] != proy["detalle_proyecto"][0]['token_lider']) {
                  this.edit_EquipoTrabajo.push(pers);
                }
              }
              this.tablas_tareas_render(proy["detalle_proyecto"][0]['folio_proy'], proy["detalle_proyecto"][0]['tarea_list']);

              proy["detalle_proyecto"][0]['tarea_list_pag'] = proy["detalle_proyecto"][0]['tarea_list'].slice(0,10);
              proy["detalle_proyecto"][0]['tarTotalRecords'] = proy["detalle_proyecto"][0]['tarea_list'].length;

              for (let a = 0; a < this.edit_EquipoTrabajo.length; a++) {
                const equipo = this.edit_EquipoTrabajo[a];
                if (proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length != 0) {
                  for (let b = 0; b < proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length; b++) {
                    const equipoSelected = proy["detalle_proyecto"][0]['equipoTrabajoDetalle'][b];
                    if (equipoSelected['token_pers_equipo'] == equipo['token_empleado_inside']) {
                      equipo['selected'] = true;
                    }
                  }
                } else {
                  equipo['selected'] = false;
                }
              }
            }
            if (response.status == 'error') {
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
      } else {
        $("#card_proyecto_"+proy["folio_proy"]).removeClass("card_proyecto_abierto");
        proy["status_detalle"] = false;
      }
    }
  }

  detalle_proyecto_inside(token_proyecto: any) {
    for (let b = 0; b < this.arrayProyectos.length; b++) {
      const proy = this.arrayProyectos[b];
      if (proy["token_proyecto"] == token_proyecto) {
        this.edit_EquipoTrabajo = [];
        this._proyServ.detalleProyecto(token_proyecto).subscribe(
          response => {
            if (response.status == 'success') {
              console.log(response.proyecto);
              proy["detalle_proyecto"] = response.proyecto;
              this.detalleProyecto = response.proyecto;
              this.tareasModelo.responsable_tarea = proy["detalle_proyecto"][0]['token_lider'];
              proy["status_detalle"] = true;
              for (let i = 0; i < this.arrayEmpleados.length; i++) {
                const pers = this.arrayEmpleados[i];
                if (pers['token_empleado_inside'] != proy["detalle_proyecto"][0]['token_lider']) {
                  this.edit_EquipoTrabajo.push(pers);
                }
              }
              this.tablas_tareas_render(proy["detalle_proyecto"][0]['folio_proy'], proy["detalle_proyecto"][0]['tarea_list']);
              for (let a = 0; a < this.edit_EquipoTrabajo.length; a++) {
                const equipo = this.edit_EquipoTrabajo[a];
                if (proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length != 0) {
                  for (let b = 0; b < proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length; b++) {
                    const equipoSelected = proy["detalle_proyecto"][0]['equipoTrabajoDetalle'][b];
                    if (equipoSelected['token_pers_equipo'] == equipo['token_empleado_inside']) {
                      equipo['selected'] = true;
                    }
                  }
                } else {
                  equipo['selected'] = false;
                }
              }
            }
            if (response.status == 'error') {
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
    }
  }

  tablas_tareas_render(folio_proy: any, tarea_list: any) {
    for (let i = 1; i < tarea_list.length; i++) {
      const tar = tarea_list[i];
      const tabla = document.getElementById('table_out_tar_listCRLI' + tar["folio_tar"] + folio_proy);
      if (tar["folio_tar"] != "TAR-000000001") {
        console.log('table_out_tar_listCRLI' + tar["folio_tar"] + folio_proy)
      }
    }
  }

  proyecto_detail_data(token_proyecto: any) {
    for (let b = 0; b < this.arrayProyectos.length; b++) {
      const proy = this.arrayProyectos[b];
      if (proy["token_proyecto"] == token_proyecto) {
        console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);

        this.edit_EquipoTrabajo = [];
        this._proyServ.detalleProyecto(token_proyecto).subscribe(
          response => {
            if (response.status == 'success') {
              //proy["detalle_proyecto"][0]['tarea_list'] = response.proyecto[0]['tarea_list'];
              proy["detalle_proyecto"][0]['tar_green'] = response.proyecto[0]['tar_green'];
              proy["detalle_proyecto"][0]['tar_yellow'] = response.proyecto[0]['tar_yellow'];
              proy["detalle_proyecto"][0]['tar_red'] = response.proyecto[0]['tar_red'];
              proy["detalle_proyecto"][0]['tarea_back'] = response.proyecto[0]['tarea_back'];
              proy["detalle_proyecto"][0]['deletedTareas'] = response.proyecto[0]['deletedTareas'];
            }
            if (response.status == 'error') {
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
    }
  }

  reload_matIze() {}

  detail_proy_open_close(status_detalle:any,token_proyecto: any,card_proyecto:any) {
    const proy_row = this.arrayProyectos.find((proy:any) => proy["token_proyecto"] === token_proyecto);
    if (status_detalle == false) {
      proy_row["status_detalle"] = true;
      this.detalle_proyecto_main(token_proyecto)
      $(card_proyecto).addClass("card_proyecto_abierto");
    } else {
      proy_row["status_detalle"] = false;
      proy_row["detalle_proyecto"] = [];
      $(card_proyecto).removeClass("card_proyecto_abierto");
    }
  }

  proyecto_prepare(token_proyecto: any, proyecto: any, descripcion: any, abrev_cliente: any, nombre_cliente: any, simple_prioridad_proyecto: any, date_end_proy_epoc: any, date_end_proy_html: any, upload_evidencias: any,
    evd_delete_perm: any, token_lider: any, equipo_trabajo_max: any,recalendarizacion: any,listProyToLeader:any) {
    this.edit_proyecto = new proyectosUpdateModelo("", "", "", "", "", "", "", "", false, false, "", [], [], []);
    this.edit_proyecto.token_proyecto = token_proyecto;
    this.edit_proyecto.name_proyecto = proyecto;
    this.edit_proyecto.descrip_proyecto = descripcion;
    this.edit_proyecto.abrev_cliente_proyecto = abrev_cliente;
    this.edit_proyecto.cliente_proyecto = nombre_cliente;
    this.edit_proyecto.prioridad = simple_prioridad_proyecto;
    this.edit_proyecto.fecha_fin_proyecto_epoc = date_end_proy_epoc;
    this.edit_proyecto.fecha_fin_proyecto_html = date_end_proy_html;
    this.edit_proyecto.upload_evid = upload_evidencias;
    this.edit_proyecto.delete_evid_uploaded = evd_delete_perm;
    this.edit_proyecto.responsable_proyecto = token_lider;
    this.edit_proyecto.arrayEquipoTrabajo = equipo_trabajo_max;
    this.edit_proyecto.listProyToLeader = listProyToLeader;
    this.validate_project_update = false;
    this.validator.limpiaInputRow(document.getElementById("editNameProyecto"))

    for (let i = 0; i < this.arrayEmpleados.length; i++) {
      const pers = this.arrayEmpleados[i];
      if (pers['token_empleado_inside'] != token_lider) {
        this.edit_EquipoTrabajo.push(pers);
      }
    }

    for (let a = 0; a < this.edit_EquipoTrabajo.length; a++) {
      const equipo = this.edit_EquipoTrabajo[a];
      if (this.edit_proyecto.arrayEquipoTrabajo.length != 0) {
        for (let b = 0; b < this.edit_proyecto.arrayEquipoTrabajo.length; b++) {
          const equipoSelected = this.edit_proyecto.arrayEquipoTrabajo[b];
          if (equipoSelected['token_pers_equipo'] == equipo['token_empleado_inside']) {
            equipo['selected'] = true;
          }
        }
      } else {
        equipo['selected'] = false;
      }
    }

    this.edit_proyecto.arrayRecalendar = recalendarizacion;
  }

  proyecto_prepare_(token_proyecto: any, proyecto: any, descripcion: any, abrev_cliente: any, nombre_cliente: any, simple_prioridad_proyecto: any, date_end_proy_epoc: any, date_end_proy_html: any, upload_evidencias: any,
    evd_delete_perm: any, token_lider: any, equipo_trabajo_max: any,recalendarizacion: any,modal_ident: any) {
    this.edit_proyecto.token_proyecto = token_proyecto;
    this.edit_proyecto.name_proyecto = proyecto;
    this.edit_proyecto.descrip_proyecto = descripcion;
    this.edit_proyecto.abrev_cliente_proyecto = abrev_cliente;
    this.edit_proyecto.cliente_proyecto = nombre_cliente;
    this.edit_proyecto.prioridad = simple_prioridad_proyecto;
    this.edit_proyecto.fecha_fin_proyecto_epoc = date_end_proy_epoc;
    this.edit_proyecto.fecha_fin_proyecto_html = date_end_proy_html;
    this.edit_proyecto.upload_evid = upload_evidencias;
    this.edit_proyecto.delete_evid_uploaded = evd_delete_perm;
    this.edit_proyecto.responsable_proyecto = token_lider;
    this.edit_proyecto.arrayEquipoTrabajo = equipo_trabajo_max;

    for (let i = 0; i < this.arrayEmpleados.length; i++) {
      const pers = this.arrayEmpleados[i];
      if (pers['token_empleado_inside'] != token_lider) {
        this.edit_EquipoTrabajo.push(pers);
      }
    }

    for (let a = 0; a < this.edit_EquipoTrabajo.length; a++) {
      const equipo = this.edit_EquipoTrabajo[a];
      if (this.edit_proyecto.arrayEquipoTrabajo.length != 0) {
        for (let b = 0; b < this.edit_proyecto.arrayEquipoTrabajo.length; b++) {
          const equipoSelected = this.edit_proyecto.arrayEquipoTrabajo[b];
          if (equipoSelected['token_pers_equipo'] == equipo['token_empleado_inside']) {
            equipo['selected'] = true;
          }
        }
      } else {
        equipo['selected'] = false;
      }
    }

    this.edit_proyecto.arrayRecalendar = recalendarizacion;
    $(modal_ident).modal('show');
  }

  validaEditNamePry(event: any, token_proyecto: any) {
    this.edit_proyecto.name_proyecto = event.value;
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value != proy["proyecto"]) {
          this.validator.correctoInputRow(event);
          this.validate_project_update = true;
        } else {
          this.validator.errorInputRow(event);
          this.validate_project_update = false;
        }
      }
    }
  }

  validaEditDescPry(event: any, token_proyecto: any) {
    this.edit_proyecto.descrip_proyecto = event.value;
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value != proy["descripcion"]) {
          this.validator.correctoTextareaRow(event);
          this.validate_project_update = true;
        } else {
          this.validator.errorTextareaRow(event);
          this.validate_project_update = false;
        }
      }
    }
  }

  validaEditAbrevClientePry(event: any, token_proyecto: any) {
    this.edit_proyecto.abrev_cliente_proyecto = event.value;
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (event.value != "" && this.validator.strFilEmp(event.value) == true && (event.value.length == 3 || event.value.length == 4) && event.value != proy["abrev_cliente"]) {
          this.validator.correctoInputRow(event);
          this.validate_project_update = true;
        } else {
          this.validator.errorInputRow(event);
          this.validate_project_update = false;
        }
      }
    }
  }

  validaEditClientePry(event: any, token_proyecto: any) {
    this.edit_proyecto.cliente_proyecto = event.value;
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (event.value != "" && this.validator.strFilEmp(event.value) == true && event.value != proy["nombre_cliente"]) {
          this.validator.correctoInputRow(event);
          this.validate_project_update = true;
        } else {
          this.validator.errorInputRow(event);
          this.validate_project_update = false;
        }
      }
    }
  }

  validaEditPrioridadProyecto(event: any, token_proyecto: any) {
    this.edit_proyecto.prioridad = event.value;
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (event.value != "" && event.value != proy["simple_prioridad_proyecto"]) {
          this.validator.correctoInputRow(event);
          this.validate_project_update = true;
        } else {
          this.validator.errorInputRow(event);
          this.validate_project_update = false;
        }
      }
    }
  }

  evidUploadEditCheck(token_proyecto: any) {
    if (this.edit_proyecto.upload_evid == false) {
      this.edit_proyecto.upload_evid = true;
      $("#radioEditUploadEvid").prop("checked", true);
    } else {
      this.edit_proyecto.upload_evid = false;
      $("#radioEditUploadEvid").prop("checked", false);
    }

    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (this.edit_proyecto.upload_evid != proy["upload_evidencias"]) {
          this.validate_project_update = true;
        } else {
          this.validate_project_update = false;
        }
      }
    }
  }

  evidDeleteUploadedEditCheck(token_proyecto: any) {
    if (this.edit_proyecto.delete_evid_uploaded == false) {
      this.edit_proyecto.delete_evid_uploaded = true;
      $("#radioEditDeleteUploadedEvid").prop("checked", true);
    } else {
      this.edit_proyecto.delete_evid_uploaded = false;
      $("#radioEditDeleteUploadedEvid").prop("checked", false);
    }

    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (this.edit_proyecto.delete_evid_uploaded != proy["evd_delete_perm"]) {
          this.validate_project_update = true;
        } else {
          this.validate_project_update = false;
        }
      }
    }
  }

  validaEditFechaFinPry(event: any, token_proyecto: any) {
    this.edit_proyecto.fecha_fin_proyecto_html = event.value;
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (event.value != "" && this.validator.filtroFecha(event.value) == true && event.value != proy["date_end_proy_html"]) {
          this.validator.correctoInputRow(event);
          this.validate_project_update = true;
        } else {
          this.validator.errorInputRow(event);
          this.validate_project_update = false;
        }
      }
    }
  }

  validaEditResponsablePry(event: any, token_proyecto: any) {
    this.edit_proyecto.responsable_proyecto = event.value;
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        if (event.value != "" && event.value != proy["token_lider"]) {
          this.validator.correctoSelectRow(event);
          this.edit_EquipoTrabajo = [];
          for (let i = 0; i < this.arrayEmpleados.length; i++) {
            const pers = this.arrayEmpleados[i];
            if (pers['token_empleado_inside'] != event.value) {
              this.edit_EquipoTrabajo.push(pers);
            }
          }
          this.validate_project_update = true;
        } else {
          this.validator.errorSelectRow(event);
          this.validate_project_update = false;
        }
      }
    }
  }

  quitaLideresProyecto(token_proyecto: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar los lideres de este proyecto?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.quitarLideresProyecto(token_proyecto).subscribe(
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
                this.recoverProyectoData(token_proyecto);
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
      }
    );
  }

  actualizarProyecto(token_proyecto: any) {
    var editNameProyecto = document.getElementById("editNameProyecto");
    var editDescripProyecto = document.getElementById("editDescripProyecto");
    var editClienteProyecto = document.getElementById("editClienteProyecto");
    var editAbrevClienteProyecto = document.getElementById("editAbrevClienteProyecto");
    var editResponsableProyecto = document.getElementById("editResponsableProyecto");

    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar este proyecto?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.arrayProyectos.length; i++) {
            const proy = this.arrayProyectos[i];
            if (proy["token_proyecto"] == token_proyecto) {
              if (
                (this.edit_proyecto.name_proyecto != "" && this.validator.filtroAlfaNumerico(this.edit_proyecto.name_proyecto) == true && this.edit_proyecto.name_proyecto != proy["proyecto"]) ||
                (this.edit_proyecto.descrip_proyecto != "" && this.validator.filtroAlfaNumerico(this.edit_proyecto.descrip_proyecto) == true && this.edit_proyecto.descrip_proyecto != proy["descripcion"]) ||
                (this.edit_proyecto.abrev_cliente_proyecto != "" && this.validator.strFilEmp(this.edit_proyecto.abrev_cliente_proyecto) == true &&
                  (this.edit_proyecto.abrev_cliente_proyecto.length == 3 || this.edit_proyecto.abrev_cliente_proyecto.length == 4) &&
                  this.edit_proyecto.abrev_cliente_proyecto != proy["abrev_cliente"]) ||
                (this.edit_proyecto.cliente_proyecto != "" && this.validator.strFilEmp(this.edit_proyecto.cliente_proyecto) == true && this.edit_proyecto.cliente_proyecto != proy["nombre_cliente"]) ||
                (this.edit_proyecto.prioridad != "" && this.edit_proyecto.prioridad != proy["simple_prioridad_proyecto"]) ||
                (this.edit_proyecto.upload_evid != proy["upload_evidencias"]) ||
                (this.edit_proyecto.delete_evid_uploaded != proy["evd_delete_perm"]) ||
                this.edit_proyecto.responsable_proyecto != "" && this.edit_proyecto.responsable_proyecto != proy["token_lider"]
              ) {

                this._proyServ.actualizaProyecto(token_proyecto,
                  this.edit_proyecto.name_proyecto,
                  this.edit_proyecto.descrip_proyecto,
                  this.edit_proyecto.abrev_cliente_proyecto,
                  this.edit_proyecto.cliente_proyecto,
                  this.edit_proyecto.prioridad,
                  this.edit_proyecto.responsable_proyecto,
                  this.edit_proyecto.upload_evid,
                  this.edit_proyecto.delete_evid_uploaded).subscribe(
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
                        this.recoverProyectoData(token_proyecto);
                        //this.listaProyectosTrue();
                        this.validate_project_update = false;
                        this.validator.limpiaInputRow(editNameProyecto);
                        this.validator.limpiaInputRow(editDescripProyecto);
                        this.validator.limpiaInputRow(editClienteProyecto);
                        this.validator.limpiaInputRow(editAbrevClienteProyecto);
                        this.validator.limpiaInputRow(editResponsableProyecto);
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

              } else {
                if (this.edit_proyecto.name_proyecto == "" || this.validator.filtroAlfaNumerico(this.edit_proyecto.name_proyecto) == false || this.edit_proyecto.name_proyecto == this.detalleProyecto[0]['proyecto']) {
                  this.validator.errorInputRow(editNameProyecto);
                }

                if (this.edit_proyecto.descrip_proyecto == "" || this.validator.filtroAlfaNumerico(this.edit_proyecto.descrip_proyecto) == false || this.edit_proyecto.descrip_proyecto == this.detalleProyecto[0]['descripcion']) {
                  this.validator.errorInputRow(editDescripProyecto);
                }

                if (this.edit_proyecto.cliente_proyecto == "" || this.validator.strFilEmp(this.edit_proyecto.cliente_proyecto) == false || this.edit_proyecto.cliente_proyecto == this.detalleProyecto[0]['cliente']) {
                  this.validator.errorInputRow(editClienteProyecto);
                }

                if (this.edit_proyecto.abrev_cliente_proyecto == "" || this.validator.strFilEmp(this.edit_proyecto.abrev_cliente_proyecto) == false ||
                  (this.edit_proyecto.abrev_cliente_proyecto.length != 3 && this.edit_proyecto.abrev_cliente_proyecto.length != 4) ||
                  this.edit_proyecto.abrev_cliente_proyecto == this.detalleProyecto[0]['abrev_cliente']) {
                  this.validator.errorInputRow(editAbrevClienteProyecto);
                }

                if (this.edit_proyecto.responsable_proyecto == "" || this.edit_proyecto.responsable_proyecto == this.detalleProyecto[0]['token_lider']) {
                  this.validator.errorSelectRow(editResponsableProyecto);
                }
              }
            }
          }
        }
      }
    );
  }

  registraEquipoPry(event: any, token_proyecto: any, token_empleado_inside: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar al personal seleccionado como equipo de trabajo para este proyecto?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.agregaProyEqTrabajo(token_proyecto, token_empleado_inside).subscribe(
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
                this.recoverProyectoData(token_proyecto);
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
      }
    );
  }

  eliminaEditEquipoPry(event: any, token_proyecto: any, token_empleado_inside: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar al personal seleccionado del equipo de trabajo para este proyecto?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.eliminaProyEqTrabajo(token_proyecto, token_empleado_inside).subscribe(
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
                this.recoverProyectoData(token_proyecto);
                //this.detalle_proyectoDos(token_proyecto);
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
      }
    );
  }

  abreRecalendarProyecto(token_proyecto: any, proyecto: any, date_end_proy_epoc: any, date_end_proy_html: any,recalendarizacion: any,isProyDetalleCollapsed:any) {
    console.log(isProyDetalleCollapsed);
    this.edit_proyecto.token_proyecto = token_proyecto;
    this.edit_proyecto.name_proyecto = proyecto;
    this.edit_proyecto.fecha_fin_proyecto_epoc = date_end_proy_epoc;
    this.edit_proyecto.fecha_fin_proyecto_html = date_end_proy_html;
    this.edit_proyecto.arrayRecalendar = recalendarizacion;
    this.validator.limpiaInputRow(document.getElementById("txtFecharecalProy"));
    this.txt_fecha_recal_proyecto = "";
  }

  eliminarProyecto(token_proyecto: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este proyecto?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $("#btnDeleteProyecto").addClass("boton_recarga");
          this._proyServ.eliminarProyecto(token_proyecto).subscribe(
            response => {
              $("#btnDeleteProyecto").removeClass("boton_recarga");
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
                //this.listaProyectosTrue();
                for (let i = 0; i < this.arrayProyectos.length; i++) {
                  const proy = this.arrayProyectos[i];
                  if (proy["token_proyecto"] == token_proyecto) {
                    this.arrayProyectos.splice(i, 1);
                  }
                }
                this.listaProyectosFalse();
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
      }
    );
  }

  restaurarProyecto(event: any, token_proyecto: any) {
    var btnRestauraProyecto = $(event).parents("td").find("a.btnRestauraProyecto");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $(btnRestauraProyecto).addClass("boton_recarga");
          this._proyServ.restaurarProyecto(token_proyecto).subscribe(
            response => {
              $(btnRestauraProyecto).removeClass("boton_recarga");
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
                //this.listaProyectosTrue();
                this.recoverProyectoItem(token_proyecto);
                this.listaProyectosFalse();
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
      }
    );
  }

  removerProyecto(event: any, token_proyecto: any) {
    var eliminaProyectoPerm = $(event).parents("td").find("a.eliminaProyectoPerm");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar definitivamente este proyecto?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $(eliminaProyectoPerm).addClass("boton_recarga");
          this._proyServ.removerProyecto(token_proyecto).subscribe(
            response => {
              $(eliminaProyectoPerm).removeClass("boton_recarga");
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
                this.listaProyectosFalse();
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
      }
    );
  }

  validaRecalendProyecto(event: any) {
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.txt_fecha_recal_proyecto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.txt_fecha_recal_proyecto = "";
      this.validator.errorInputRow(event);
    }

    this.txt_fecha_recal_proyecto = event.value != "" && this.validator.filtroFecha(event.value) == true ? event.value : "";
  }

  recalendarizaProy(token_proyecto: any) {
    var txtFecharecalProy = document.getElementById("txtFecharecalProy");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea ajustar la fecha de finalizacion de este proyecto?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (this.txt_fecha_recal_proyecto != "" && this.validator.filtroFecha(this.txt_fecha_recal_proyecto)) {
            this._proyServ.recalendarizaProyecto(token_proyecto, this.txt_fecha_recal_proyecto).subscribe(
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
                  this.recoverProyectoData(token_proyecto);
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
          } else {
            this.validator.errorInputRow(txtFecharecalProy);
          }
        }
      }
    );
  }

  //tareas
  abreModalNuevaTarea(modal_ident:any){
    $(modal_ident).modal('show');
  }

  componentes() {}

  download_last_tarea(token_proyecto: any, creat_lider: any) {
    for (let b = 0; b < this.arrayProyectos.length; b++) {
      const proy = this.arrayProyectos[b];
      if (proy["token_proyecto"] == token_proyecto) {
        console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);

        this._proyServ.ultimaTareaRegistrada(token_proyecto, creat_lider).subscribe(
          response => {
            if (response.status == 'success') {
              var tarea_list = [];
              proy["detalle_proyecto"][0]["tarea_list"].unshift(response.tarea_list[0]);
              proy["detalle_proyecto"][0]["tar_green"].unshift(response.tar_green[0]);
              proy["detalle_proyecto"][0]["tar_yellow"].unshift(response.tar_yellow[0]);
              proy["detalle_proyecto"][0]["tar_red"].unshift(response.tar_red[0]);
              proy["detalle_proyecto"][0]["tarea_back"].unshift(response.tarea_back[0]);
            }
            if (response.status == 'error') {
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
    }
  }

  //registro
  validaNameNewTarea(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.tareasModelo.name_tarea = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.tareasModelo.name_tarea = "";
      this.validator.errorInputRow(event);
    }
  }

  validaDescNewTarea(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.tareasModelo.descrip_tarea = event.value;
      this.validator.correctoTextareaRow(event);
    } else {
      this.tareasModelo.descrip_tarea = "";
      this.validator.errorTextareaRow(event);
    }
  }

  validaFechaFinNewTarea(event: any) {
    var fecha = event.value.split('T')[0];
    var hora = event.value.split('T')[1];
    if (event.value != "" && this.validator.filtroFecha(fecha) == true && this.validator.filtroHora(hora) == true) {
      this.tareasModelo.fecha_fin_tarea = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.tareasModelo.fecha_fin_tarea = "";
      this.validator.errorInputRow(event);
    }
  }

  addResponsableTarea(token_proyecto: any, token_pers_equipo: any) {
    console.log(token_proyecto + " " + token_pers_equipo);
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length; j++) {
          const team = proy["detalle_proyecto"][0]['equipoTrabajoDetalle'][j];
          if (team["token_pers_equipo"] == token_pers_equipo) {
            team["selected"] = true;
            this.tareasModelo.array_responsables_tarea.push(token_pers_equipo);
          }
        }
      }
    }
  }

  deleteResponsableTarea(token_proyecto: any, token_pers_equipo: any) {
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length; j++) {
          const team = proy["detalle_proyecto"][0]['equipoTrabajoDetalle'][j];
          if (team["token_pers_equipo"] == token_pers_equipo) {
            team["selected"] = false;
          }
        }
      }
    }

    for (let i = 0; i < this.tareasModelo.array_responsables_tarea.length; i++) {
      const team = this.tareasModelo.array_responsables_tarea[i];
      if (team == token_pers_equipo) {
        this.tareasModelo.array_responsables_tarea.splice(i, 1);
      }
    }
  }

  addDependeTarea(event: any) {
    console.log("event.checked " + event.checked);
    if (event.checked == true) {
      this.tareasModelo.array_depende_tarea.push(event.value);
    } else {
      for (let i = 0; i < this.tareasModelo.array_depende_tarea.length; i++) {
        if (this.tareasModelo.array_depende_tarea[i] == event.value) {
          this.tareasModelo.array_depende_tarea.splice(i, 1);
        }
      }
    }
    console.log("array_depende_tarea " + this.tareasModelo.array_depende_tarea.length);
  }

  cancelaTareaRegistro(token_proyecto: any) {
    var txtNameTar = document.getElementById("txtNameTar");
    var txtDescripTar = document.getElementById("txtDescripTar");
    var txtFechaFinTar = document.getElementById("txtFechaFinTar");

    this.validator.limpiaInputRow(txtNameTar);
    this.validator.limpiaTextarea(txtDescripTar);
    this.validator.limpiaInputRow(txtFechaFinTar);
    $("#txtResponsableTar").val("");

    this.tareasModelo.name_tarea = "";
    this.tareasModelo.descrip_tarea = "";
    this.tareasModelo.fecha_fin_tarea = "";
    this.tareasModelo.responsable_tarea = "";
    this.tareasModelo.array_responsables_tarea.length = 0;
    this.tareasModelo.array_depende_tarea.length = 0;

    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length; j++) {
          const team = proy["detalle_proyecto"][0]['equipoTrabajoDetalle'][j];
          team["selected"] = false;
        }
      }
    }
  }

  registraTarea(token_proyecto: any, creat_lider: any) {
    var txtNameTar = document.getElementById("txtNameTar");
    var txtDescripTar = document.getElementById("txtDescripTar");
    var txtFechaFinTar = document.getElementById("txtFechaFinTar");
    var txtResponsableTar = document.getElementById("txtResponsableTar");

    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          var fecha = this.tareasModelo.fecha_fin_tarea.split('T')[0];
          var hora = this.tareasModelo.fecha_fin_tarea.split('T')[1];
          if (this.tareasModelo.name_tarea != "" && this.validator.filtroAlfaNumerico(this.tareasModelo.name_tarea) == true &&
            this.tareasModelo.descrip_tarea != "" && this.validator.filtroAlfaNumerico(this.tareasModelo.descrip_tarea) == true &&
            this.tareasModelo.fecha_fin_tarea != "" && this.validator.filtroFecha(fecha) == true && this.validator.filtroHora(hora) == true) {
            this._proyServ.registraTarea(token_proyecto, this.tareasModelo.name_tarea, this.tareasModelo.descrip_tarea, this.tareasModelo.fecha_fin_tarea,
              this.tareasModelo.responsable_tarea, this.tareasModelo.array_responsables_tarea, this.tareasModelo.array_depende_tarea).subscribe(
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
                    this.cancelaTareaRegistro(token_proyecto);
                    this.nuevo_nombre_proyecto(token_proyecto);
                    this.download_last_tarea(token_proyecto, creat_lider);
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

          } else {
            if (this.tareasModelo.name_tarea == "" || this.validator.filtroAlfaNumerico(this.tareasModelo.name_tarea) == false) {
              this.validator.errorInputRow(txtNameTar);
            }

            if (this.tareasModelo.descrip_tarea == "" || this.validator.filtroAlfaNumerico(this.tareasModelo.descrip_tarea) == false) {
              this.validator.errorInputRow(txtDescripTar);
            }

            if (this.tareasModelo.fecha_fin_tarea == "" || this.validator.filtroFecha(fecha) == false || this.validator.filtroHora(hora) == false) {
              this.validator.errorInputRow(txtFechaFinTar);
            }

            if (this.tareasModelo.responsable_tarea == "") {
              this.validator.errorSelectRow(txtResponsableTar);
            }
          }
        }
      }
    );
  }

  //listas
  recargaListaTareas(token_proyecto: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);
        proy["detalle_proyecto"][0]["tarea_list"] = proy["detalle_proyecto"][0]["tarea_back"];
      }
    }
  }

  listaTareasGreen(token_proyecto: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);
        proy["detalle_proyecto"][0]["tarea_list"] = proy["detalle_proyecto"][0]["tar_green"];
      }
    }
  }

  listaTareasYellow(token_proyecto: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);
        proy["detalle_proyecto"][0]["tarea_list"] = proy["detalle_proyecto"][0]["tar_yellow"];
      }
    }
  }

  listaTareasRed(token_proyecto: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);
        proy["detalle_proyecto"][0]["tarea_list"] = proy["detalle_proyecto"][0]["tar_red"];
      }
    }
  }

  select_tarea(token_proyecto: any, token_tarea: any) {
    //console.log("http://localhost:4200/gestion_de_proyectos/proyectos_tarea/"+token_tarea);
    ////window.open("https://sos-mexico.com.mx/gestion_de_proyectos/home", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    //window.open("http://localhost:4200/gestion_de_proyectos/proyectos_tarea/"+token_tarea, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let b = 0; b < proy["detalle_proyecto"][0]['tarea_list'].length; b++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][b];
          console.log(proy["detalle_proyecto"][0]['tarea_list'][b]);
          if (tar["token_tarea"] == token_tarea) {
            tar["tareaRecalendarPag"] = tar["tareaRecalendar"].slice(0,10);
            tar["equipoResponsableMaxPag"] = tar["equipoResponsableMax"].slice(0,10);
            if (proy["creat_lider"] == "EQ") {
              this._proyServ.revisionTareaAcceso(token_proyecto, token_tarea).subscribe(
                response => {
                  if (response.status == 'success') {
                    if (response.aceptado_en_tarea == true) {
                      tar["open_inside_tarea"] = true;
                      console.log(proy["folio_proy"] + tar["folio_tar"]);
                      var segundos = 0;
                      var intervalo = setInterval(() => {
                        segundos = segundos + 1;
                        if (segundos == 10) {
                          clearInterval(intervalo);
                          segundos = 0;
                        }
                      }, 10);
                    } else if (response.aceptado_en_tarea == false) {
                      let translate_response = this.translate.instant(response.message);
                      Swal.fire({
                        position: 'center',
                        icon: 'info',
                        title: translate_response,
                        showConfirmButton: false,
                        timer: 5000
                      })
                      proy["detalle_proyecto"][0]['tarea_list'].splice(b, 1);
                    }
                  }
                  if (response.status == 'error') {
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
            } else {
              tar["open_inside_tarea"] = true;
              console.log(proy["folio_proy"] + tar["folio_tar"]);
              var segundos = 0;
              var intervalo = setInterval(() => {
                segundos = segundos + 1;
                if (segundos == 10) {
                  clearInterval(intervalo);
                  segundos = 0;
                }
              }, 10);
            }
          }
        }
        console.log(this.arrayProyectos);
      }
    }
  }

  open_tarea_pag(token_proyecto: any, token_tarea: any) {
    const index_proy = this.arrayProyectos.findIndex((row:any) => row.token_proyecto == token_proyecto);
    const index_tar = this.arrayProyectos[index_proy]["detalle_proyecto"][0]['tarea_list'].findIndex((row:any) => row.token_tarea == token_tarea);
    this.arrayProyectos[index_proy]["detalle_proyecto"][0]['tarea_list'][index_tar]["tareas_enabled_listPag"] = this.arrayProyectos[index_proy]["detalle_proyecto"][0]['tarea_list'][index_tar]["tareas_enabled_list"].slice(0,10);
  }

  recalTareaOnPageChange(event: any,token_proyecto: any, token_tarea: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        const ind_inicio = proy["detalle_proyecto"][0]['tarea_list'].findIndex((row:any) => row.token_tarea == token_tarea);
        const first = event.first;
        const rows = event.rows;
        proy["detalle_proyecto"][0]['tarea_list_pag'][ind_inicio]["tareaRecalendarPag"] = proy["detalle_proyecto"][0]['tarea_list_pag'][ind_inicio]["tareaRecalendar"].slice(first, first + rows);
      }
    }
  }

  teamTareaOnPageChange(event: any,token_proyecto: any, token_tarea: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        const ind_inicio = proy["detalle_proyecto"][0]['tarea_list'].findIndex((row:any) => row.token_tarea == token_tarea);
        const first = event.first;
        const rows = event.rows;
        proy["detalle_proyecto"][0]['tarea_list_pag'][ind_inicio]["equipoResponsableMaxPag"] = proy["detalle_proyecto"][0]['tarea_list_pag'][ind_inicio]["equipoResponsableMax"].slice(first, first + rows);
      }
    }
  }

  enabledTareaOnPageChange(event: any,token_proyecto: any, token_tarea: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        const ind_inicio = proy["detalle_proyecto"][0]['tarea_list'].findIndex((row:any) => row.token_tarea == token_tarea);
        const first = event.first;
        const rows = event.rows;
        proy["detalle_proyecto"][0]['tarea_list_pag'][ind_inicio]["tareas_enabled_listPag"] = proy["detalle_proyecto"][0]['tarea_list_pag'][ind_inicio]["tareas_enabled_list"].slice(first, first + rows);
      }
    }
  }

  add_tarea_dependiente(token_proyecto: any, token_tarea_pendiente: any, token_tarea_anterior: any, folio_tar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar la dependencia de la tarea con folio " + folio_tar + "?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.tareaDependienteAgregar(token_proyecto, token_tarea_pendiente, token_tarea_anterior).subscribe(
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
                this.detalle_proyecto_inside(token_proyecto);
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
      }
    );
  }

  remove_tarea_dependiente(token_proyecto: any, token_tarea_pendiente: any, token_tarea_anterior: any, folio_tar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar la dependencia de la tarea con folio " + folio_tar + "?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.tareaDependienteRemover(token_proyecto, token_tarea_pendiente, token_tarea_anterior).subscribe(
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
                this.detalle_proyecto_inside(token_proyecto);
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
      }
    );
  }

  close_tarea_selected(token_proyecto: any, token_tarea: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);

        for (let b = 0; b < proy["detalle_proyecto"][0]['tarea_list'].length; b++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][b];
          if (tar["token_tarea"] == token_tarea) {
            console.log("detalle_proyecto.length " + proy["detalle_proyecto"].length);
            tar["open_inside_tarea"] = false;
          }
        }

      }
    }
  }

  clonaPerfilTarea(token_proyecto: any, token_tarea: any) {
    this.tareasUpdateModelo.teamProyectoTarea.length = 0;

    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        if (proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length != 0) {
          for (let b = 0; b < proy["detalle_proyecto"][0]['equipoTrabajoDetalle'].length; b++) {
            const equipoSelected = proy["detalle_proyecto"][0]['equipoTrabajoDetalle'][b];
            this.tareasUpdateModelo.teamProyectoTarea.push(equipoSelected);
          }
        }

        for (let b = 0; b < proy["detalle_proyecto"][0]['tarea_list'].length; b++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][b];
          console.log(proy["detalle_proyecto"][0]['tarea_list'][b]);
          if (tar["token_tarea"] == token_tarea) {
            this.tareasUpdateModelo.token_proyecto = token_proyecto;
            this.tareasUpdateModelo.tkn_tarea = token_tarea;
            this.tareasUpdateModelo.name_tarea = tar['tarea_nombre'];
            this.tareasUpdateModelo.descrip_tarea = tar['tarea_descripcion'];
            this.tareasUpdateModelo.fecha_fin_tarea = tar['html_fin_tarea'];
            this.tareasUpdateModelo.equipoResponsable = tar['equipoResponsableMin'];
            this.tareasUpdateModelo.creat_lider = proy['creat_lider'];
            for (let a = 0; a < this.tareasUpdateModelo.teamProyectoTarea.length; a++) {
              const equipo = this.tareasUpdateModelo.teamProyectoTarea[a];
              equipo['selected'] = false;
              if (this.tareasUpdateModelo.equipoResponsable.length != 0) {
                for (let b = 0; b < this.tareasUpdateModelo.equipoResponsable.length; b++) {
                  const equipoSelected = this.tareasUpdateModelo.equipoResponsable[b];
                  if (equipo['token_pers_equipo'] == equipoSelected['pers_token']) {
                    equipo['selected'] = true;
                  }
                }
              }
            }
          }
        }
        console.log(this.arrayProyectos);
      }
    }
  }

  validaEditNameTarea(event: any, token_proyecto: any, token_tarea: any) {
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
          if (tar["token_tarea"] == token_tarea) {
            tar["tarea_nombre_back"] = event.value;
            if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value != tar["tarea_nombre"]) {
              this.validator.correctoTextareaRow(event);
            } else {
              this.validator.errorTextareaRow(event);
            }
          }
        }
      }
    }
  }

  changeEditNameTarea(event: any, token_proyecto: any, token_tarea: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.arrayProyectos.length; i++) {
            const proy = this.arrayProyectos[i];
            if (proy["token_proyecto"] == token_proyecto) {
              for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
                const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
                if (tar["token_tarea"] == token_tarea) {
                  tar["tarea_nombre_back"] = event.value;
                  if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value != tar["tarea_nombre"]) {
                    this._proyServ.actualizaNameTarea(token_proyecto, token_tarea, tar["tarea_nombre_back"]).subscribe(
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
                          tar["tarea_nombre"] = tar["tarea_nombre_back"];
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
                  } else {
                    this.validator.errorTextareaRow(event);
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  validaEditDescTarea(event: any, token_proyecto: any, token_tarea: any) {
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
          if (tar["token_tarea"] == token_tarea) {
            tar["tarea_descripcion_back"] = event.value;
            if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value != tar["tarea_descripcion"]) {
              this.validator.correctoTextareaRow(event);
            } else {
              this.validator.errorTextareaRow(event);
            }
          }
        }
      }
    }
  }

  changeEditDescTarea(event: any, token_proyecto: any, token_tarea: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.arrayProyectos.length; i++) {
            const proy = this.arrayProyectos[i];
            if (proy["token_proyecto"] == token_proyecto) {
              for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
                const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
                if (tar["token_tarea"] == token_tarea) {
                  tar["tarea_descripcion_back"] = event.value;
                  if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value != tar["tarea_descripcion"]) {
                    this._proyServ.actualizaDescripTarea(token_proyecto, token_tarea, tar["tarea_descripcion_back"]).subscribe(
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
                          tar["tarea_descripcion"] = tar["tarea_descripcion_back"];
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
                  } else {
                    this.validator.errorTextareaRow(event);
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  validaEditResponsableTarea(event: any) {
    if (event.value != "") {
      this.tareasModelo.responsable_tarea = event.value;
      this.validator.correctoSelectRow(event);
    } else {
      this.tareasModelo.responsable_tarea = "";
      this.validator.errorSelectRow(event);
    }
  }

  validaDuplicNameTarea(event: any) {
    this.tareasUpdateModelo.name_tarea = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  validaDuplicDescTarea(event: any) {
    this.tareasUpdateModelo.descrip_tarea = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoTextareaRow(event);
    } else {
      this.validator.errorTextareaRow(event);
    }
  }

  validaDuplicFechaFinTarea(event: any) {
    this.tareasUpdateModelo.fecha_fin_tarea = event.value;
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  duplicaTarea(token_proyecto: any, token_tarea: any, equipoResponsable: any) {
    var txtNameDuplicateTar = document.getElementById("txtNameDuplicateTar");
    var txtDescripDuplicateTar = document.getElementById("txtDescripDuplicateTar");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea duplicar esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (this.tareasUpdateModelo.name_tarea != "" && this.validator.filtroAlfaNumerico(this.tareasUpdateModelo.name_tarea) == true &&
            this.tareasUpdateModelo.descrip_tarea != "" && this.validator.filtroAlfaNumerico(this.tareasUpdateModelo.descrip_tarea) == true &&
            this.tareasUpdateModelo.fecha_fin_tarea != "" && this.validator.filtroFecha(this.tareasUpdateModelo.fecha_fin_tarea) == true) {
            this._proyServ.duplicarTarea(token_proyecto, token_tarea, this.tareasUpdateModelo.name_tarea, this.tareasUpdateModelo.descrip_tarea, this.tareasUpdateModelo.fecha_fin_tarea, equipoResponsable).subscribe(
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
                  this.nuevo_nombre_proyecto(token_proyecto);
                  this.cerrarModal('#modalDuplicarTarea');
                  this.download_last_tarea(token_proyecto, this.tareasUpdateModelo.creat_lider);
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

          } else {
            if (this.tareasModelo.name_tarea == "" || this.validator.filtroAlfaNumerico(this.tareasModelo.name_tarea) == false) {
              this.validator.errorInputRow(txtNameDuplicateTar);
            }

            if (this.tareasModelo.descrip_tarea == "" || this.validator.filtroAlfaNumerico(this.tareasModelo.descrip_tarea) == false) {
              this.validator.errorInputRow(txtDescripDuplicateTar);
            }
          }
        }
      }
    );
  }

  validaEditFechaFinTarea(event: any, token_proyecto: any, token_tarea: any) {
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
          if (tar["token_tarea"] == token_tarea) {
            this.tareasUpdateModelo.fecha_fin_tarea = event.value;
            if (event.value != "" && this.validator.filtroFecha(event.value) == true && event.value != tar['html_fin_tarea']) {
              this.validator.correctoInputRow(event);
            } else {
              this.validator.errorInputRow(event);
            }
          }
        }
      }
    }
  }

  recoverTareaItem(token_proyecto: any, token_tarea: any) {
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        this._proyServ.recoverTarea(token_proyecto, token_tarea).subscribe(
          response => {
            if (response.status == 'success') {
              proy["detalle_proyecto"][0]['tarea_list'].unshift(response.tarea_list[0]);
            }
            if (response.status == 'error') {
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
    }
  }

  recoverTareaData(token_proyecto: any, token_tarea: any) {
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
          if (tar["token_tarea"] == token_tarea) {
            this._proyServ.recoverTarea(token_proyecto, token_tarea).subscribe(
              response => {
                if (response.status == 'success') {
                  tar["tarea_nombre"] = response.tarea_list[0]["tarea_nombre"];
                  tar["tarea_nombre_back"] = response.tarea_list[0]["tarea_nombre_back"];
                  tar["tarea_descripcion"] = response.tarea_list[0]["tarea_descripcion"];
                  tar["tarea_descripcion_back"] = response.tarea_list[0]["tarea_descripcion_back"];
                  tar["inicio_tarea"] = response.tarea_list[0]["inicio_tarea"];
                  tar["fin_tarea"] = response.tarea_list[0]["fin_tarea"];
                  tar["fin_tarea_original"] = response.tarea_list[0]["fin_tarea_original"];
                  tar["html_fin_tarea"] = response.tarea_list[0]["html_fin_tarea"];
                  tar["tareaRecalendar"] = response.tarea_list[0]["tareaRecalendar"];
                  tar["realizacion"] = response.tarea_list[0]["realizacion"];
                  tar["equipoResponsableMin"] = response.tarea_list[0]["equipoResponsableMin"];
                  tar["equipoResponsableMax"] = [];
                  for (let a = 0; a < response.tarea_list[0]["equipoResponsableMax"].length; a++) {
                    tar["equipoResponsableMax"].push(response.tarea_list[0]["equipoResponsableMax"][a]);
                  }
                  tar["tottal_actividades"] = response.tarea_list[0]["tottal_actividades"];
                  tar["detalle_inside_tarea"] = response.tarea_list[0]["detalle_inside_tarea"];
                  //tar["informeArray"] = response.tarea_list[0]["informeArray"];
                  tar["informeArray"] = [];
                  tar["informeArray"] = response.tarea_list[0]["informeArray"];
                  
                  console.log(tar["informeArray"].length+" "+response.tarea_list[0]["informeArray"].length);
                  tar["informeDelArray"] = response.tarea_list[0]["informeDelArray"];
                  //this.matIzeServ.cargaSelectSpecific("selectTeam" + proy["folio_proy"] + tar["folio_tar"]);
                }
                if (response.status == 'error') {
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
        }
      }
    }
  }

  recalendarizaTarea(token_proyecto: any, token_tarea: any) {
    var txtFecharecalTar = document.getElementById("txtFecharecalTar");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea ajustar la fecha de finalizacion de esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.arrayProyectos.length; i++) {
            const proy = this.arrayProyectos[i];
            if (proy["token_proyecto"] == token_proyecto) {
              for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
                const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
                if (tar["token_tarea"] == token_tarea) {
                  if (this.tareasUpdateModelo.fecha_fin_tarea != "" &&
                    this.validator.filtroFecha(this.tareasUpdateModelo.fecha_fin_tarea) == true &&
                    this.tareasUpdateModelo.fecha_fin_tarea != tar['html_fin_tarea']) {
                    this._proyServ.recalendarizaTarea(token_proyecto, token_tarea, this.tareasUpdateModelo.fecha_fin_tarea).subscribe(
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
                          this.recoverTareaData(token_proyecto, token_tarea);
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
                  } else {
                    this.validator.errorInputRow(txtFecharecalTar);
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  registraEditRespTarPry(token_proyecto: any, token_tarea: any, token_empleado_inside: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar al personal seleccionado como responsable de esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.agrega_resp_tarea(token_proyecto, token_tarea, token_empleado_inside).subscribe(
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
                this.recoverTareaData(token_proyecto, token_tarea);
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
      }
    );
  }

  eliminaEditRespTarPry(token_proyecto: any, token_tarea: any, token_empleado_inside: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar al personal seleccionado de los responsables de esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.elimina_resp_tarea(token_proyecto, token_tarea, token_empleado_inside).subscribe(
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
                this.recoverTareaData(token_proyecto, token_tarea);
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
      }
    );
  }

  deleteEditRespTarPry(event: any, token_proyecto: any, token_tarea: any, token_empleado_inside: any) {
    var btnDeleteEditRespTarPry = $(event).parents("td").find("a.btnDeleteEditRespTarPry");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar al personal seleccionado de los responsables de esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $(btnDeleteEditRespTarPry).addClass("boton_recarga");
          this._proyServ.elimina_resp_tarea(token_proyecto, token_tarea, token_empleado_inside).subscribe(
            response => {
              $(btnDeleteEditRespTarPry).removeClass("boton_recarga");
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
                this.recoverTareaData(token_proyecto, token_tarea);
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
      }
    );
  }

  terminarTarea(token_proyecto: any, token_tarea: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea dar por terminada esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, terminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $("#btnFinishTarea").addClass("boton_recarga");
          this._proyServ.terminarTarea(token_proyecto, token_tarea).subscribe(
            response => {
              $("#btnFinishTarea").removeClass("boton_recarga");
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
                //console.log(response);
                this.nuevo_nombre_proyecto(token_proyecto);
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
      }
    );
  }

  terminarParticipacionTarea(token_proyecto: any, token_tarea: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea dar por terminada su participación en esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, terminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $("#btnFinishTarea").addClass("boton_recarga");
          this._proyServ.terminarParticipacionTarea(token_proyecto, token_tarea).subscribe(
            response => {
              $("#btnFinishTarea").removeClass("boton_recarga");
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
                //console.log(response);
                this.nuevo_nombre_proyecto(token_proyecto);
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
      }
    );
  }

  terminarParticipacionTareaCRLI(token_proyecto: any, token_tarea: any) {
    $("#btnFinishTarea").addClass("boton_recarga");
    this._proyServ.terminarParticipacionTarea(token_proyecto, token_tarea).subscribe(
      response => {
        $("#btnFinishTarea").removeClass("boton_recarga");
        let translate_response = this.translate.instant(response.message);
        if (response.status == 'success') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: translate_response,
            showConfirmButton: false,
            timer: 3000
          })
          //console.log(response);
          this.nuevo_nombre_proyecto(token_proyecto);
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

  lastTareaDeleted(token_proyecto: any, token_tarea: any) {
    for (let a = 0; a < this.arrayProyectos.length; a++) {
      const proy = this.arrayProyectos[a];
      if (proy["token_proyecto"] == token_proyecto) {
        this._proyServ.lastTareaDeleted(token_proyecto, token_tarea).subscribe(
          response => {
            if (response.status == 'success') {
              proy["detalle_proyecto"][0]['deletedTareas'].unshift(response.deletedTareas[0]);
            }
            if (response.status == 'error') {
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
    }
  }

  eliminarTarea(token_proyecto: any, token_tarea: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $("#btnDeleteTarea").addClass("boton_recarga");
          this._proyServ.eliminarTarea(token_proyecto, token_tarea).subscribe(
            response => {
              //this.nuevo_nombre_proyecto(token_proyecto);
              $("#btnDeleteTarea").removeClass("boton_recarga");
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
                for (let a = 0; a < this.arrayProyectos.length; a++) {
                  const proy = this.arrayProyectos[a];
                  if (proy["token_proyecto"] == token_proyecto) {
                    for (let b = 0; b < proy["detalle_proyecto"][0]['tarea_list'].length; b++) {
                      const tar = proy["detalle_proyecto"][0]['tarea_list'][b];
                      if (tar["token_tarea"] == token_tarea) {
                        proy["detalle_proyecto"][0]['tarea_list'].splice(b, 1);
                        this.lastTareaDeleted(token_proyecto, token_tarea);
                      }
                    }
                    console.log(this.arrayProyectos);
                  }
                }
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
      }
    );
  }

  restaurarTarea(event: any, token_proyecto: any, token_tarea: any) {
    var btnRestauraTarea = $(event).parents("td").find("a.btnRestauraTarea");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $(btnRestauraTarea).addClass("boton_recarga");
          this._proyServ.restaurarTarea(token_proyecto, token_tarea).subscribe(
            response => {
              this.nuevo_nombre_proyecto(token_proyecto);
              $(btnRestauraTarea).removeClass("boton_recarga");
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                for (let a = 0; a < this.arrayProyectos.length; a++) {
                  const proy = this.arrayProyectos[a];
                  if (proy["token_proyecto"] == token_proyecto) {
                    for (let b = 0; b < proy["detalle_proyecto"][0]['deletedTareas'].length; b++) {
                      const tar = proy["detalle_proyecto"][0]['deletedTareas'][b];
                      if (tar["token_tarea"] == token_tarea) {
                        proy["detalle_proyecto"][0]['deletedTareas'].splice(b, 1);
                        //this.proyecto_detail_data(token_proyecto);
                      }
                    }
                    console.log(this.arrayProyectos);
                  }
                }

                this.recoverTareaItem(token_proyecto, token_tarea);
                //this.detalle_proyectoDos(token_proyecto);
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
      }
    );
  }

  removerTarea(event: any, token_proyecto: any, token_tarea: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar definitivamente esta tarea?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._proyServ.removerTarea(token_proyecto, token_tarea).subscribe(
            response => {
              this.nuevo_nombre_proyecto(token_proyecto);
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
                this.detalle_proyecto_inside(token_proyecto);
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
      }
    );
  }

  //informes
  //registro
  validateNewInforme(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.informesModelo.informe_titulo = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.informesModelo.informe_titulo = "";
      this.validator.errorInputRow(event);
    }
  }

  validateObservNewInforme(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.informesModelo.informe_observaciones = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.informesModelo.informe_observaciones = "";
      this.validator.errorInputRow(event);
    }
  }

  validateHActivasInforme(event: any) {
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      this.informesModelo.informe_horas_activas = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.informesModelo.informe_horas_activas = 0;
      this.validator.errorInputRow(event);
    }
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(typoElement) == true) {
            this.informesModelo.informe_evidencias_files.push(file);
            console.log(this.validator.devuelveTipoArchivo(typoElement));
            this.informesModelo.informe_evidencias_nombres.push({ "tipo": this.validator.devuelveTipoArchivo(typoElement), "nameFile": nameFile });
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (this.validator.filtroTipoArchivo(typoElement) == false) {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, jpg, png o paqueteria office';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.informesModelo.informe_evidencias_files.splice(i, 1);
            this.files.splice(i, 1);
            return;
          }

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  /*public droppedReem(files: NgxFileDropEntry[],posicion:any) {
    this.filesReem = files;
    this.docsReemAnexos = [];
    this.reemAnexosNames = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsReemAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement+" "+nameFile)
 
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(typoElement) == true) {
            var typo_documento = "";
            if (typoElement == "application/pdf") {
              typo_documento = "pdf";
            } else if (typoElement == "text/xml") {
              typo_documento = "xml";
            } else if (typoElement == "image/jpeg") {
              typo_documento = "jpg";
            } else if (typoElement == "image/jpg") {
              typo_documento = "jpg";
            } else if (typoElement == "image/png") {
              typo_documento = "png";
            }
 
            this.reemAnexosNames.push({"typoElement":typo_documento,"nameFile":nameFile});
            this.docsReemAnexos.push(file);
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo '+nameFile+' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo '+nameFile+' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton:false,
              timer: 3000
            })
            this.filesReem.splice(i,1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log("docsReemAnexos.length "+this.docsReemAnexos.length);
  }*/

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  deleteEvidencias(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo seleccionado?" + posicion,
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.informesModelo.informe_evidencias_files.splice(posicion, 1);
          this.files.splice(posicion, 1);
          console.log(this.informesModelo.informe_evidencias_files.length);
        }
      }
    );
  }

  validaEvidenciaLink(event: any) {
    if (event.value != "" && this.validator.filtroUrl(event.value) == true) {
      this.informesModelo.informe_bool_urls = true;
      this.validator.correctoInputRow(event);
    } else {
      this.informesModelo.informe_bool_urls = false;
      this.validator.errorInputRow(event);
    }
  }

  cancelaRegistroInforme(folio_tar: any) {
    this.validator.limpiaInputRow(document.getElementById("txtNuevoInforme" + folio_tar));
    this.validator.limpiaInputRow(document.getElementById("txtDescripTar" + folio_tar));

    this.informesModelo.informe_titulo = "";
    this.informesModelo.informe_observaciones = "";
    this.informesModelo.informe_evidencias_files.length = 0;
    this.informesModelo.informe_evidencias_nombres.length = 0;
    this.informesModelo.informe_bool_urls = false;
  }

  recover_tarea_by_importes(proyecto:any,tarea:any,tabla:any) {
    console.log(tabla);
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
          if (tar["token_tarea"] == tarea) {
            this._proyServ.recoverTarea(proyecto,tarea).subscribe(
              response => {
                if (response.status == 'success') {
                  tar["informeArray"] = [];
                  tar["informeArray"] = response.tarea_list[0]["informeArray"];
                  //this.matIzeServ.cargaSelectSpecific("selectTeam" + proy["folio_proy"] + tar["folio_tar"]);
                  console.log(tar["informeArray"].length+" "+response.tarea_list[0]["informeArray"].length);
                }
                if (response.status == 'error') {
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
        }
      }
    }
  }

  registrarInforme(token_proyecto: any, upload_evidencias: any, token_tarea: any, folio_tar: any,creat_lider:any,tabla:any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar el informe descrito?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (this.informesModelo.informe_titulo != "" && this.validator.filtroAlfaNumerico(this.informesModelo.informe_titulo) == true &&
            this.informesModelo.informe_observaciones != "" && this.validator.filtroAlfaNumerico(this.informesModelo.informe_observaciones) == true) {
            if (upload_evidencias == false || (upload_evidencias == true && (this.informesModelo.informe_evidencias_files.length > 0 || this.informesModelo.informe_evidencias_nombres.length > 0))) {
              this._proyServ.registrarInforme(token_proyecto, token_tarea, this.informesModelo.informe_titulo, this.informesModelo.informe_observaciones,this.informesModelo.informe_horas_activas, this.informesModelo.informe_evidencias_files, this.informesModelo.informe_evidencias_nombres).subscribe(
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
                    if (creat_lider == "CR" || creat_lider == "LI") {this.terminarParticipacionTareaCRLI(token_proyecto,token_tarea);}
                    this.recoverTareaData(token_proyecto,token_tarea);
                    this.informesModelo.informe_evidencias_files = [];
                    this.files = [];
                    this.informesModelo.informe_titulo = "";
                    this.informesModelo.informe_observaciones = "";
                    console.log(tabla);
                    this.cancelaRegistroInforme(folio_tar);
                    this.cerrarModal('#modalNeWwInforme');
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
            } else {
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: this.translate.instant("upload_evid"),
                showConfirmButton: false,
                timer: 3000
              })
            }
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: "llene los campos vacios",
              showConfirmButton: false,
              timer: 3000
            })
          }
        }
      }
    );
  }



  lastInformeCreated(token_proyecto: any, token_tarea: any) {
    for (let i = 0; i < this.arrayProyectos.length; i++) {
      const proy = this.arrayProyectos[i];
      if (proy["token_proyecto"] == token_proyecto) {
        for (let j = 0; j < proy["detalle_proyecto"][0]['tarea_list'].length; j++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][j];
          if (tar["token_tarea"] == token_tarea) {
            this._proyServ.lastInformeCreated(token_proyecto, token_tarea).subscribe(
              response => {
                if (response.status == 'success') {
                  tar["informeArray"].unshift(response.informe[0]);
                }
                if (response.status == 'error') {
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
        }
      }
    }
  }

  //listas
  recarga_informe(proyecto:any,tarea:any,informe:any) {
    for (let p = 0; p < this.arrayProyectos.length; p++) {
      const proy = this.arrayProyectos[p];
      if (proy["token_proyecto"] == proyecto) {
        for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
          if (tar["token_tarea"] == tarea) {
            for (let i = 0; i < tar["informeArray"].length; i++) {
              const inf = tar["informeArray"][i];
              if (inf["token_informe"] == informe) {
                this._proyServ.detalleInforme(proyecto,tarea,informe).subscribe(
                  response => {
                    if (response.status == 'success') {
                      inf["observaciones_revision"] = response.observaciones_revision;
                      inf["informe"] = response.informe;
                      inf["observaciones"] = response.observaciones;
                      inf["aprobaciones"] = response.aprobaciones;
                      inf["status_aprob"] = response.status_aprob;
                      inf["rev_aprob"] = response.rev_aprob;
                      inf["comentarios_aprob"] = response.comentarios_aprob;
                      inf["evidencias_true"] = response.evidencias_true;
                      inf["evidencias_false"] = response.evidencias_false;
                    }
                    if (response.status == 'error') {
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
            }
          }
        }
      }
    }
  }

  confirmaRevision(token_proyecto: any, token_tarea: any, token_informe: any) {
    this._proyServ.revisarInforme(token_proyecto, token_tarea, token_informe).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.status);
        }
        if (response.status == 'error') {
          console.log(response.status);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  viewDocumento(event:any) {
    window.open(event.value, '_blank');
  }

  guardaListaArchivosInformeModal(token_proyecto:any,token_tarea:any,token_informe:any){
    this._proyServ.informeListaEvidencias(token_proyecto,token_tarea,token_informe).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.evidencias);
          //this.listaArchivosInforme = [];
          this.listaArchivosInforme = response.evidencias;
        }
        if (response.status == 'error') {
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

  viewDocumentoLink(url:any){
    window.open(url,'_blank');
  }

  viewDocumentoInf(proyecto:any,tarea:any,informe:any,token_documento: any) {
    for (let p = 0; p < this.arrayProyectos.length; p++) {
      const proy = this.arrayProyectos[p];
      if (proy["token_proyecto"] == proyecto) {
        for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
          if (tar["token_tarea"] == tarea) {
            for (let i = 0; i < tar["informeArray"].length; i++) {
              const inf = tar["informeArray"][i];
              if (inf["token_informe"] == informe) {
                for (let d = 0; d < inf["evidencias_true"].length; d++) {
                  const doc = inf["evidencias_true"][d];
                  if (doc["token_documento"] == token_documento) {
                    Swal.fire({
                      title: "¿Que desea realizar?",
                      showDenyButton: true,
                      showCancelButton: true,
                      confirmButtonText: "ver documento en el navegador",
                      denyButtonText: "Eliminar documento"
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        window.open(doc["url"], '_blank');
                      } else if (result.isDenied) {
                        Swal.fire({
                          title: this.translate.instant("swal_attenc"),
                          text: "¿Desea eliminar la evidencia seleccionada?",
                          icon: 'question',
                          confirmButtonColor: '#388E3C',
                          confirmButtonText: this.translate.instant("swal_yes_delete"),
                          showCancelButton: true,
                          cancelButtonColor: '#D32F2F',
                          cancelButtonText: this.translate.instant("swal_cancel"),
                        }).then(
                          (result) => {
                            if (result.isConfirmed) {
                              //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
                              console.log("token_evidencia" + doc["token_documento"]);
                              this._proyServ.deleteEvidencia(proyecto,tarea,informe,doc["token_documento"]).subscribe(
                                response => {
                                  let translate_response = this.translate.instant(response.message);
                                  if (response.status == 'success') {
                                    this.recarga_informe(proyecto,tarea,informe);
                                    Swal.fire({
                                      position: 'center',
                                      icon: 'success',
                                      title: translate_response,
                                      showConfirmButton: false,
                                      timer: 3000
                                    });
                                    this.recoverTareaData(proyecto,tarea);
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
                          }
                        );
                      }
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  eliminarInforme(event: any, token_proyecto: any, token_tarea: any, token_informe: any) {
    var btnDeleteInforme = $(event).parents("td").find("a.btnDeleteInforme");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este informe?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $(btnDeleteInforme).addClass("boton_recarga");
          this._proyServ.eliminarInforme(token_proyecto, token_tarea, token_informe).subscribe(
            response => {
              $(btnDeleteInforme).removeClass("boton_recarga");
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.recoverTareaData(token_proyecto, token_tarea);
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
      }
    );
  }

  restaurarInforme(event: any, token_proyecto: any, token_tarea: any, token_informe: any) {
    var btnRestauraInforme = $(event).parents("td").find("a.btnRestauraInforme");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar este informe?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $(btnRestauraInforme).addClass("boton_recarga");
          this._proyServ.restaurarInforme(token_proyecto, token_tarea, token_informe).subscribe(
            response => {
              $(btnRestauraInforme).removeClass("boton_recarga");
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.recoverTareaData(token_proyecto, token_tarea);
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
      }
    );
  }

  removerInforme(event: any, token_proyecto: any, token_tarea: any, token_informe: any) {
    var btnRemoveaInforme = $(event).parents("td").find("a.btnRemoveaInforme");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar definitivamente este informe?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          $(btnRemoveaInforme).addClass("boton_recarga");
          this._proyServ.removerInforme(token_proyecto, token_tarea, token_informe).subscribe(
            response => {
              $(btnRemoveaInforme).removeClass("boton_recarga");
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.recoverTareaData(token_proyecto, token_tarea);
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
      }
    );
  }

  validateObservRevision(proyecto: any,tarea: any,informe: any, event: any) {
    for (let p = 0; p < this.arrayProyectos.length; p++) {
      const proy = this.arrayProyectos[p];
      if (proy["token_proyecto"] == proyecto) {
        for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
          if (tar["token_tarea"] == tarea) {
            for (let i = 0; i < tar["informeArray"].length; i++) {
              const inf = tar["informeArray"][i];
              if (inf["token_informe"] == informe) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  inf["observaciones_revision"] = event.value;
                  this.validator.correctoTextareaRow(event);
                } else {
                  inf["observaciones_revision"] = "";
                  this.validator.errorTextareaRow(event);
                }
              }
            }
          }
        }
      }
    }

  }

  aprobarInforme(token_proyecto:any,token_tarea:any,token_informe:any,revision_boolean:any,observaciones_revision:any,textarea:any) {
    console.log(observaciones_revision);
    var text_alerta = "";
    var text_confirm = "";
    if (revision_boolean == "true") {
      text_alerta = "¿Desea aprobar el informe seleccionado?";
      text_confirm = "Sí, aprobar";
    }

    if (revision_boolean == "false") {
      text_alerta = "¿Desea desaprobar el informe seleccionado?";
      text_confirm = "Sí, desaprobar";
    }

    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: text_alerta,
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: text_confirm,
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (revision_boolean != "" && observaciones_revision != "" && this.validator.filtroAlfaNumerico(observaciones_revision) == true) {
            this._proyServ.aprobarInforme(token_proyecto, token_tarea, token_informe, revision_boolean,observaciones_revision).subscribe(
              response => {
                let translate_response = this.translate.instant(response.message);
                if (response.status == 'success') {
                  this.recarga_informe(token_proyecto,token_tarea,token_informe);
                  this.validator.limpiaTextarea(document.getElementById(textarea));
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
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
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: 'Seleccione si aprueba o desaprueba informe, redacte observaciones',
              showConfirmButton: false,
              timer: 3000
            })
          }
        }
      }
    );
  }

  validateInformeList(proyecto: any, tarea: any, informe: any, event: any) {
    for (let p = 0; p < this.arrayProyectos.length; p++) {
      const proy = this.arrayProyectos[p];
      if (proy["token_proyecto"] == proyecto) {
        for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
          if (tar["token_tarea"] == tarea) {
            for (let i = 0; i < tar["informeArray"].length; i++) {
              const inf = tar["informeArray"][i];
              if (inf["token_informe"] == informe) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  inf['informe_dos'] = event.value;
                  this.validator.correctoTextareaRow(event);
                } else {
                  inf['informe_dos'] = "";
                  this.validator.errorTextareaRow(event);
                }
              }
            }
          }
        }
      }
    }
  }

  actualizarInforme(proyecto: any, tarea: any, informe: any, tabla: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar el informe seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          for (let p = 0; p < this.arrayProyectos.length; p++) {
            const proy = this.arrayProyectos[p];
            if (proy["token_proyecto"] == proyecto) {
              for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
                const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
                if (tar["token_tarea"] == tarea) {
                  for (let i = 0; i < tar["informeArray"].length; i++) {
                    const inf = tar["informeArray"][i];
                    if (inf["token_informe"] == informe) {
                      if (inf["informe_dos"] != "" && this.validator.filtroAlfaNumerico(inf["informe_dos"]) == true) {
                        this.progBarUpdateInformes = true;
                        this._proyServ.actualizarInforme(proyecto, tarea, informe, inf["informe_dos"]).subscribe(
                          response => {
                            this.progBarUpdateInformes = false;
                            let translate_response = this.translate.instant(response.message);
                            if (response.status == 'success') {
                              Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: translate_response,
                                showConfirmButton: false,
                                timer: 3000
                              })
                              //console.log(response);
                              this.recoverTareaData(proyecto, tarea);
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
                      } else {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'warning',
                          title: 'Redacte informe',
                          showConfirmButton: false,
                          timer: 3000
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  validateObserLInfList(proyecto: any, tarea: any, informe: any, event: any) {
    for (let p = 0; p < this.arrayProyectos.length; p++) {
      const proy = this.arrayProyectos[p];
      if (proy["token_proyecto"] == proyecto) {
        for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
          if (tar["token_tarea"] == tarea) {
            for (let i = 0; i < tar["informeArray"].length; i++) {
              const inf = tar["informeArray"][i];
              if (inf["token_informe"] == informe) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  inf['observaciones_dos'] = event.value;
                  this.validator.correctoTextareaRow(event);
                } else {
                  inf['observaciones_dos'] = "";
                  this.validator.errorTextareaRow(event);
                }
              }
            }
          }
        }
      }
    }
  }

  actualizarObservacionesInforme(proyecto:any,tarea:any,informe:any,tabla:any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar las observaciones el informe seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {

          for (let p = 0; p < this.arrayProyectos.length; p++) {
            const proy = this.arrayProyectos[p];
            if (proy["token_proyecto"] == proyecto) {
              for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
                const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
                if (tar["token_tarea"] == tarea) {
                  for (let i = 0; i < tar["informeArray"].length; i++) {
                    const inf = tar["informeArray"][i];
                    if (inf["token_informe"] == informe) {
                      if (inf["observaciones_dos"] != "" && this.validator.filtroAlfaNumerico(inf["observaciones_dos"]) == true) {
                        this.progBarUpdateInformes = true;
                        this._proyServ.actualizarObservacionesInforme(proyecto, tarea, informe, inf["observaciones_dos"]).subscribe(
                          response => {
                            this.progBarUpdateInformes = false;
                            let translate_response = this.translate.instant(response.message);
                            if (response.status == 'success') {
                              Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: translate_response,
                                showConfirmButton: false,
                                timer: 3000
                              })
                              //console.log(response);
                              //this.recarga_informe(proyecto,tarea,informe);
                              this.recoverTareaData(proyecto, tarea);
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
                      } else {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'warning',
                          title: 'Redacte informe',
                          showConfirmButton: false,
                          timer: 3000
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  validateHActivasLInfList(proyecto: any, tarea: any, informe: any, event: any) {
    for (let p = 0; p < this.arrayProyectos.length; p++) {
      const proy = this.arrayProyectos[p];
      if (proy["token_proyecto"] == proyecto) {
        for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
          const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
          if (tar["token_tarea"] == tarea) {
            for (let i = 0; i < tar["informeArray"].length; i++) {
              const inf = tar["informeArray"][i];
              if (inf["token_informe"] == informe) {
                if (event.value != "" && this.validator.filtroNum(event.value) == true) {
                  inf['horas_activas_dos'] = event.value;
                  this.validator.correctoInputRow(event);
                } else {
                  inf['horas_activas_dos'] = "";
                  this.validator.errorInputRow(event);
                }
              }
            }
          }
        }
      }
    }
  }

  actualizarHorasActivasInforme(proyecto:any,tarea:any,informe:any,tabla:any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar el tiempo activo en el informe seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {

          for (let p = 0; p < this.arrayProyectos.length; p++) {
            const proy = this.arrayProyectos[p];
            if (proy["token_proyecto"] == proyecto) {
              for (let t = 0; t < proy["detalle_proyecto"][0]['tarea_list'].length; t++) {
                const tar = proy["detalle_proyecto"][0]['tarea_list'][t];
                if (tar["token_tarea"] == tarea) {
                  for (let i = 0; i < tar["informeArray"].length; i++) {
                    const inf = tar["informeArray"][i];
                    if (inf["token_informe"] == informe) {
                      if (inf["horas_activas_dos"] != "" && this.validator.filtroAlfaNumerico(inf["horas_activas_dos"]) == true) {
                        this.progBarUpdateInformes = true;
                        this._proyServ.actualizarHorasActivasInforme(proyecto, tarea, informe, inf["horas_activas_dos"]).subscribe(
                          response => {
                            this.progBarUpdateInformes = false;
                            let translate_response = this.translate.instant(response.message);
                            if (response.status == 'success') {
                              Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: translate_response,
                                showConfirmButton: false,
                                timer: 3000
                              })
                              //console.log(response);
                              //this.recarga_informe(proyecto,tarea,informe);
                              this.recoverTareaData(proyecto, tarea);
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
                      } else {
                        Swal.fire({
                          position: 'top-end',
                          icon: 'warning',
                          title: 'Redacte informe',
                          showConfirmButton: false,
                          timer: 3000
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    );
  }

  cargaEvidenciasInforme(proyecto:any,tarea:any,informe:any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea cargar mas evidencias al informe seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (this.informesModelo.informe_evidencias_files.length != 0) {
            this.progBarUpdateInformes = true;
            this._proyServ.cargaEvidenciasInforme(proyecto,tarea,informe,this.informesModelo.informe_evidencias_files).subscribe(
                response => {
                  this.progBarUpdateInformes = false;
                  let translate_response = this.translate.instant(response.message);
                  if (response.status == 'success') {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton: false,
                      timer: 3000
                    })
                    //console.log(response);
                    this.informesModelo.informe_evidencias_files = [];
                    this.files = [];
                    this.recarga_informe(proyecto,tarea,informe);
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
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: 'cargue evidencias',
              showConfirmButton: false,
              timer: 3000
            })
          }
        }
      }
    );
  }

  descargaEvidencia(proyecto:any,tarea:any,informe:any,token_evidencia: any, name_evidencia: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar la evidencia seleccionada?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
          this._proyServ.descargaEvidencia(token_evidencia, name_evidencia).subscribe(
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
                this.recoverTareaData(proyecto,tarea);
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
      }
    );
  }

  restaurarEvidencia(token_proyecto: any, token_tarea: any, token_informe: any, token_evidencia: any, posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar la evidencia seleccionada?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
          this._proyServ.restauraEvidencia(token_proyecto, token_tarea, token_informe, token_evidencia).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.recarga_informe(token_proyecto, token_tarea, token_informe);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.recoverTareaData(token_proyecto,token_tarea);
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
      }
    );
  }

  deletePermEvidencia(token_proyecto: any, token_tarea: any, token_informe: any, token_evidencia: any, posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar la evidencia seleccionada?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
          this._proyServ.deleteEvidenciaPerm(token_proyecto, token_tarea, token_informe, token_evidencia).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.recarga_informe(token_proyecto, token_tarea, token_informe);
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.recoverTareaData(token_proyecto,token_tarea);
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
      }
    );
  }

  ngOnDestroy() {
    console.log("destruyendo");
    this.arrayProyectos = [];
    this.arrayProyectos = [];
    this.proyResponse = false;
    this._proyServ.proyectosList().subscribe().unsubscribe();
    this._proyServ.proyectosDeleted().subscribe().unsubscribe();

    this._proyServ.listaProyectosAscFecha().subscribe().unsubscribe();
    this._proyServ.listaProyectosDescFecha().subscribe().unsubscribe();

    this._proyServ.listaProyectosAscBlack().subscribe().unsubscribe();
    this._proyServ.listaProyectosDescBlack().subscribe().unsubscribe();

    this._proyServ.listaProyectosAscGreen().subscribe().unsubscribe();
    this._proyServ.listaProyectosDescGreen().subscribe().unsubscribe();

    this._proyServ.listaProyectosAscYellow().subscribe().unsubscribe();
    this._proyServ.listaProyectosDescYellow().subscribe().unsubscribe();

    this._proyServ.listaProyectosAscRed().subscribe().unsubscribe();
    this._proyServ.listaProyectosDescRed().subscribe().unsubscribe();

    this._proyServ.listaProyectosAscFinish().subscribe().unsubscribe();
    this._proyServ.listaProyectosDescFinish().subscribe().unsubscribe();
  }
}
