import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CargaPaginaService } from '../../../../../servicios/carga-pagina.service';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';
import { ProyectosService } from '../../../../../servicios/ssic/proyectos-service.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'proy_block_nueva_plantilla',
  templateUrl: './nueva-plantilla.component.html',
  standalone:false,
  styleUrls: [
    './nueva-plantilla.component.css',
    '../../../../../styles/loading.css',
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
    '../../../../../styles/div_busqueda.css',
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
export class NuevaPlantillaComponent implements OnInit {
  arrayEmpleados:any = [];
  public plantilla_proy_titulo:string = "";
  public plantilla_proy_bool_upload_evid:boolean = false;
  public plantilla_proy_bool_delete_evid_uploaded:boolean = false;
  public plantilla_proy_lider_ktn:string = "";
  public plantilla_proy_lider_nombre:string = "";

  public plantilla_proy_tarea_inicial:string = "";
  public plantilla_proy_tarea_desc:string = "";
  public plantilla_proy_tarea_lider_ktn:string = "";
  public plantilla_proy_tarea_lider_nombre:string = "";

  public plantilla_proy_tarea_repeticion:number = 0;
  plantilla_equipo_trabajo:any = [];
  plantilla_equipo_trabajo_selected:any = [];
  plantilla_lista_tareas:any = [];
  public plantilla_proy_validate_tareas:boolean = false;
  public style_select_resp:string = "width: 100%!important;";
  constructor(
    private _persServ:EmpleadosService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private _proyServ:ProyectosService,
    private loadPageServ: CargaPaginaService) { }

  ngOnInit(): void {
    this.loadPageServ.comienza_contador_carga();
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
  }

  cerrarModal(modal:any){}

  validaNamePlantilla(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.plantilla_proy_titulo = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.plantilla_proy_titulo = "";
      this.validator.errorInputRow(event);
    }
  }

  evidUploadCheck(){
    console.log(this.plantilla_proy_bool_upload_evid);
    if (this.plantilla_proy_bool_upload_evid == false) {
      this.plantilla_proy_bool_upload_evid = true;
      $("#radioUploadEvid").prop("checked",true);
    } else {
      this.plantilla_proy_bool_upload_evid = false;
      $("#radioUploadEvid").prop("checked",false);
    }
  }

  evidDeleteUploadedCheck(){
    console.log(this.plantilla_proy_bool_delete_evid_uploaded);
    if (this.plantilla_proy_bool_delete_evid_uploaded == false) {
      this.plantilla_proy_bool_delete_evid_uploaded = true;
      $("#radioDeletedUploadedEvid").prop("checked",true);
      //M.toast({html: this.translate.instant("evid_del_allowed"), classes: 'rounded'});
    } else {
      this.plantilla_proy_bool_delete_evid_uploaded = false;
      $("#radioDeletedUploadedEvid").prop("checked",false);
      //M.toast({html: this.translate.instant("evid_del_not_allowed"), classes: 'rounded'});
    }
  }

  validaResponsablePlantilla(event:any){
    this.plantilla_equipo_trabajo.length = 0;
    //console.log(this.arrayEmpleados);
    //console.log(event.value);
    if (event.value != "") {
      this.style_select_resp = "width: calc(100% - 230px) !important;";
      this.validator.correctoSelectRow(event);
      for (let i = 0; i < this.arrayEmpleados.length; i++) {
        const pers = this.arrayEmpleados[i];
        if (pers['token_empleado_inside'] == event.value) {
          this.plantilla_proy_lider_ktn = pers['token_empleado_inside'];
          this.plantilla_proy_lider_nombre = pers['nombre_completo'];

          this.plantilla_proy_tarea_lider_ktn = pers['token_empleado_inside'];
          this.plantilla_proy_tarea_lider_nombre = pers['nombre_completo'];
        } else {
          this.plantilla_equipo_trabajo.push(pers);
        }
      }
    } else {
      this.plantilla_proy_lider_ktn = "";
      this.plantilla_proy_lider_nombre = "";
      this.plantilla_proy_tarea_lider_ktn = "";
      this.plantilla_proy_tarea_lider_nombre = "";
      this.validator.errorSelectRow(event);
    }
  }

  validaEquipoProyecto(event:any){
    if (event.value != "") {
      //console.log(event.checked);
      for (let a = 0; a < this.plantilla_equipo_trabajo.length; a++) {
        const pers = this.plantilla_equipo_trabajo[a];
        if (pers['token_empleado_inside'] == event.value) {
          if (event.checked == true) {
            this.plantilla_equipo_trabajo_selected.push({"token_empleado_inside":pers['token_empleado_inside'],"nombre_completo":pers['nombre_completo'],"selected":false});
          } else {
            for (let b = 0; b < this.plantilla_equipo_trabajo_selected.length; b++) {
              const selected = this.plantilla_equipo_trabajo_selected[b];
              if (selected == pers['token_empleado_inside']) {
                this.plantilla_equipo_trabajo_selected.splice(b,1);
              }
            }
          }
        }
      }
    } else {
      this.validator.errorBtn(event);
    }
  }

  validaPlantillaTarNombre(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.plantilla_proy_tarea_inicial = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.plantilla_proy_tarea_inicial = "";
      this.validator.errorInputRow(event);
    }
  }

  validaPlantillaTarDesc(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.plantilla_proy_tarea_desc = event.value;
      this.validator.correctoTextareaRow(event);
    } else {
      this.plantilla_proy_tarea_desc = "";
      this.validator.errorTextareaRow(event);
    }
  }

  validaPlantillaTarResponsable(event:any){
    //console.log(event.value);
    if (event.value != "") {
      this.validator.correctoSelectRow(event);
      for (let i = 0; i < this.plantilla_equipo_trabajo_selected.length; i++) {
        const pers = this.plantilla_equipo_trabajo_selected[i];
        if (pers['token_empleado_inside'] == event.value) {
          this.plantilla_proy_tarea_lider_ktn = pers['token_empleado_inside'];
          this.plantilla_proy_tarea_lider_nombre = pers['nombre_completo'];
        } else {
          this.plantilla_equipo_trabajo.push(pers);
        }
      }
    } else {
      this.plantilla_proy_tarea_lider_ktn = "";
      this.plantilla_proy_tarea_lider_nombre = "";
      this.validator.errorSelectRow(event);
    }
  }

  validaDescNewTarea(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      //this.tareasModelo.descrip_tarea = event.value;
      this.validator.correctoTextareaRow(event);
    } else {
      //this.tareasModelo.descrip_tarea = "";
      this.validator.errorTextareaRow(event);
    }
  }

  validaTarRepeticionPlantilla(event:any){
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      this.plantilla_proy_tarea_repeticion = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.plantilla_proy_tarea_repeticion = 0;
      this.validator.errorInputRow(event);
    }
  }

  llenarTablaTareasPlantilla(){
    if (this.plantilla_proy_tarea_inicial != "" && this.validator.filtroAlfaNumerico(this.plantilla_proy_tarea_inicial) == true && 
    this.plantilla_proy_tarea_desc != "" && this.validator.filtroAlfaNumerico(this.plantilla_proy_tarea_desc) == true && 
    this.plantilla_proy_tarea_repeticion > 0 || this.validator.filtroNum(this.plantilla_proy_tarea_repeticion) == false) {
      for (let i = 0; i < this.plantilla_proy_tarea_repeticion; i++) {
        this.plantilla_lista_tareas.push({
          "posicion":i,
          "tarea":this.plantilla_proy_tarea_inicial,
          "descripcion":this.plantilla_proy_tarea_desc,
          "lider_ktn":this.plantilla_proy_tarea_lider_ktn,
          "lider_nombre":this.plantilla_proy_tarea_lider_nombre,
          "team":[],
        });
      }
      this.plantilla_proy_validate_tareas = true;
    } else {
      this.plantilla_proy_validate_tareas = false;
      if (this.plantilla_proy_tarea_inicial == "" || this.validator.filtroAlfaNumerico(this.plantilla_proy_tarea_inicial) == false) {
        this.validator.errorInputRow("#txtPlantillaTareaInicial");
      }
      if (this.plantilla_proy_tarea_repeticion == 0 || this.validator.filtroNum(this.plantilla_proy_tarea_repeticion) == false) {
        this.validator.errorInputRow("#txtPlantillaTareaIterar");
      }
    }
  }

  addResponsableTarea(posicion:any,token_pers_equipo:any){
    console.log(posicion+" "+token_pers_equipo);

    for (let a = 0; a < this.plantilla_equipo_trabajo_selected.length; a++) {
      const tar_plant = this.plantilla_equipo_trabajo_selected[a];
      if (tar_plant["token_empleado_inside"] == token_pers_equipo) {
        for (let b = 0; b < this.plantilla_lista_tareas.length; b++) {
          const tar_plant = this.plantilla_lista_tareas[b];
          if (tar_plant["posicion"] == posicion) {
            this.plantilla_equipo_trabajo_selected[a]["selected"] = true; 
            this.plantilla_lista_tareas[b]["team"].push(token_pers_equipo); 
          }
        }
      }
    }
    console.log(this.plantilla_lista_tareas);
  }

  deleteResponsableTarea(posicion:any,token_pers_equipo:any){
    console.log(posicion+" "+token_pers_equipo);

    for (let a = 0; a < this.plantilla_equipo_trabajo_selected.length; a++) {
      const tar_plant = this.plantilla_equipo_trabajo_selected[a];
      if (tar_plant["token_empleado_inside"] == token_pers_equipo) {
        for (let b = 0; b < this.plantilla_lista_tareas.length; b++) {
          const tar_plant = this.plantilla_lista_tareas[b];
          if (tar_plant["posicion"] == posicion) {
            for (let c = 0; c < this.plantilla_lista_tareas[b]["team"].length; c++) {
              const row_team = this.plantilla_lista_tareas[b]["team"][c];
              if (row_team == token_pers_equipo) {
                this.plantilla_lista_tareas[b]["team"].splice(c,1); 
                this.plantilla_equipo_trabajo_selected[a]["selected"] = false; 
              }
            }
          }
        }
      }
    }
    console.log(this.plantilla_lista_tareas);
  }

  validaTarListados(event:any,posicion:any){
    this.plantilla_lista_tareas[posicion]["tarea"] = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validator.correctoInputRow(event);
      this.plantilla_proy_validate_tareas = true;
    } else {
      this.validator.errorInputRow(event);
      this.plantilla_proy_validate_tareas = false;
    }
  }

  removerTarea(posicion:any){
    console.log(posicion);
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
          console.log(posicion+1);
          for (let i = 0; i < this.plantilla_lista_tareas.length; i++) {
            const tar_plant = this.plantilla_lista_tareas[i];
            if (tar_plant["posicion"] == posicion) {
              this.plantilla_lista_tareas.splice(i,1); 
            }
          }
          console.log("plantilla_lista_tareas.length "+this.plantilla_lista_tareas.length);
          if (this.plantilla_lista_tareas.length == 0) {
            this.plantilla_proy_validate_tareas = false;
          }
        }
      }
    );
  }

  cancelaRegistro(){
    var txtPlantillaTitulo:any = document.getElementById("txtPlantillaTitulo");
    var radioPlantillaUploadEvid:any = document.getElementById("radioPlantillaUploadEvid");
    var radioPlantillaDeleteEvidPerm:any = document.getElementById("radioPlantillaDeleteEvidPerm");
    var txtPlantillaResponsable:any = document.getElementById("txtPlantillaResponsable");
  
    this.validator.limpiaInputRow(txtPlantillaTitulo);
    $("#txtPlantillaTitulo").val("");
    txtPlantillaResponsable.selectedIndex = 0;
    radioPlantillaUploadEvid.checked = false;
    radioPlantillaDeleteEvidPerm.checked = false;

    this.plantilla_equipo_trabajo = [];
    for (let i = 0; i < this.arrayEmpleados.length; i++) {
      const pers = this.arrayEmpleados[i];
      pers['selected'] = false;
    }
  }

  registrarProyecto(){
    var txtPlantillaTitulo = document.getElementById("txtPlantillaTitulo");
    var txtPlantillaResponsable = document.getElementById("txtPlantillaResponsable");
  
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (this.plantilla_proy_titulo != "" && this.validator.filtroAlfaNumerico(this.plantilla_proy_titulo) == true &&
            this.plantilla_proy_lider_ktn != "" && this.plantilla_equipo_trabajo.length > 0) {

            this._proyServ.registraPlantilla(
              this.plantilla_proy_titulo,
              this.plantilla_proy_bool_upload_evid,
              this.plantilla_proy_bool_delete_evid_uploaded,
              this.plantilla_proy_lider_ktn,
              this.plantilla_equipo_trabajo_selected,
              this.plantilla_lista_tareas
              ).subscribe(
              response => {
                let translate_response = this.translate.instant(response.message);
                if (response.status == 'success') {
                  setTimeout(function(){
                    Swal.fire({
                      position:'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton:false,
                      timer: 3000
                    })
                  },1000);
                  this.cancelaRegistro();
                  //this.listaProyectosTrue();
                  //this.recibePush("Fv9yVMOdtQ50fB9kYaGoa8p0XyRx3r03wlPQRHZDn6Y");
                }
                if (response.status == 'error') {
                  Swal.fire({
                    position:'top-end',
                    icon: 'warning',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                }
              },
              error => {
                console.log(error);
              }
            );
            
          } else {
            if (this.plantilla_proy_titulo == "" || this.validator.filtroAlfaNumerico(this.plantilla_proy_titulo) == false) {
              this.validator.errorInputRow(txtPlantillaTitulo);
            }
          
            if (this.plantilla_proy_lider_ktn == "") {
              this.validator.errorSelectRow(txtPlantillaResponsable);
            }
          }
        }
      }
    );
  }

}
