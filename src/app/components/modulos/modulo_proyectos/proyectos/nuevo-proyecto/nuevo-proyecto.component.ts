import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';
import { ProyectosService } from '../../../../../servicios/ssic/proyectos-service.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { proyectosModelo } from '../../../../../modelos/proyectos_gestion/proyectosModelo';
import Swal from 'sweetalert2';
import { CargaPaginaService } from '../../../../../servicios/carga-pagina.service';

@Component({
  selector: 'proy_block_nuevo_proyecto',
  templateUrl: './nuevo-proyecto.component.html',
  standalone:false,
  styleUrls: [
    './nuevo-proyecto.component.css',
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
export class NuevoProyectoComponent implements OnInit {
  public isProyectosCollapsed = false;
  public isTeamProjectCollapsed = false;

  public boolean_permiso_proyectos: boolean = false;
  public boolean_permiso_tareas: boolean = false;
  public boolean_permiso_informes: boolean = false;
  public boolean_permiso_eliminar: boolean = false;
  public boolean_permiso_ver_docs: boolean = false;

  listadoPlantillas:any = [];
  public new_proyectos: proyectosModelo;
  listEquipoTrabajo:any = [];
  arrayEmpleados:any = [];
  public style_select_resp:string = "width: 100%!important;";
  arrayProyectos:any = [];
  constructor(
    private validator:ValidatorServService,
    private translate:TranslateService,
    private _persServ:EmpleadosService,
    private _proyServ:ProyectosService,
    private loadPageServ: CargaPaginaService) { 
    this.new_proyectos = new proyectosModelo("","","","","","",false,false,"",[],[]);
  }

  ngOnInit(): void {
    this.loadPageServ.comienza_contador_carga();
    this.permisos_settings();
    this.catalogoEmpleados();
    this.catalogoPlantillas();
    this.listaProyectosTrue();
  }

  permisos_settings() {
    this._proyServ.permisos_proyectos().subscribe(
      response => {
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

  cerrarModal(modal:any){}

  catalogoEmpleados(){
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

  catalogoPlantillas(){
    this._proyServ.catalogoPlantillas().subscribe(
      response => {
        if (response.status == 'success') {
          this.listadoPlantillas = response.templates;
          console.log(this.listadoPlantillas);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listaProyectosTrue(){
    this.arrayProyectos.length = 0;
    this._proyServ.proyectosList().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.arrayProyectos = response.proyectos;
          if (this.boolean_permiso_proyectos == true) {
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
      },
      error => {
        console.log(error);
      }
    );
  }

  validaNameProyecto(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.new_proyectos.new_name_proyecto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.new_proyectos.new_name_proyecto = "";
      this.validator.errorInputRow(event);
    }
  }

  validaDescProyecto(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.new_proyectos.new_descrip_proyecto = event.value;
      this.validator.correctoTextareaRow(event);
    } else {
      this.new_proyectos.new_descrip_proyecto = "";
      this.validator.errorTextareaRow(event);
    }
  }

  validaClienteProyecto(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.new_proyectos.new_cliente_proyecto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.new_proyectos.new_cliente_proyecto = "";
      this.validator.errorInputRow(event);
    }
  }

  validaAbrevClienteProyecto(event:any){
    if (event.value != "" && this.validator.strFilEmp(event.value) == true && (event.value.length == 3 || event.value.length == 4)) {
      this.new_proyectos.new_abrev_cliente_proyecto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.new_proyectos.new_abrev_cliente_proyecto = "";
      this.validator.errorInputRow(event);
    }
  }

  validaPrioridadProyecto(event:any){
    if (event.value != "") {
      this.new_proyectos.prioridad = event.value;
      this.validator.correctoSelectRow(event);
    } else {
      this.new_proyectos.prioridad = "";
      this.validator.errorSelectRow(event);
    }
  }

  validaFechaFinProyecto(event:any){
    var fecha = event.value.split('T')[0];
    var hora = event.value.split('T')[1];
    console.log(fecha+" "+hora);
    if (event.value != "" && this.validator.filtroFecha(fecha) == true && this.validator.filtroHora(hora) == true) {
      this.new_proyectos.new_fecha_fin_proyecto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.new_proyectos.new_fecha_fin_proyecto = "";
      this.validator.errorInputRow(event);
    }
  }

  evidUploadCheck(){
    console.log(this.new_proyectos.bool_upload_evid);
    if (this.new_proyectos.bool_upload_evid == false) {
      this.new_proyectos.bool_upload_evid = true;
      $("#radioUploadEvid").prop("checked",true);
    } else {
      this.new_proyectos.bool_upload_evid = false;
      $("#radioUploadEvid").prop("checked",false);
    }
  }

  evidDeleteUploadedCheck(){
    console.log(this.new_proyectos.bool_delete_evid_uploaded);
    if (this.new_proyectos.bool_delete_evid_uploaded == false) {
      this.new_proyectos.bool_delete_evid_uploaded = true;
      $("#radioDeletedUploadedEvid").prop("checked",true);
      //M.toast({html: this.translate.instant("evid_del_allowed"), classes: 'rounded'});
    } else {
      this.new_proyectos.bool_delete_evid_uploaded = false;
      $("#radioDeletedUploadedEvid").prop("checked",false);
      //M.toast({html: this.translate.instant("evid_del_not_allowed"), classes: 'rounded'});
    }
  }

  validaResponsableProyecto(event:any){
    this.listEquipoTrabajo.length = 0;
    //console.log(this.arrayEmpleados);
    //console.log(event.value);
    if (event.value != "") {
      this.style_select_resp = "width: calc(100% - 230px) !important;";
      this.new_proyectos.new_responsable_proyecto = event.value;
      this.validator.correctoSelectRow(event);
      for (let i = 0; i < this.arrayEmpleados.length; i++) {
        const pers = this.arrayEmpleados[i];
        if (pers['token_empleado_inside'] != event.value) {
          this.listEquipoTrabajo.push(pers);
        }
      }
    } else {
      this.new_proyectos.new_responsable_proyecto = "";
      this.validator.errorSelectRow(event);
    }
  }

  validaEquipoProyecto(event:any){
    if (event.value != "") {
      //console.log(event.checked);
      for (let a = 0; a < this.listEquipoTrabajo.length; a++) {
        const pers = this.listEquipoTrabajo[a];
        if (pers['token_empleado_inside'] == event.value) {
          if (event.checked == true) {
            this.new_proyectos.new_equipo_trabajo.push(pers['token_empleado_inside']);
          } else {
            for (let b = 0; b < this.new_proyectos.new_equipo_trabajo.length; b++) {
              const selected = this.new_proyectos.new_equipo_trabajo[b];
              if (selected == pers['token_empleado_inside']) {
                this.new_proyectos.new_equipo_trabajo.splice(b,1);
              }
            }
          }
        }
      }
    } else {
      this.validator.errorBtn(event);
    }
  }

  addDependeProyecto(event:any){
    console.log("event.checked "+event.checked);
    if (event.checked == true) {
      this.new_proyectos.depende_proyecto.push(event.value);
    } else {
      for (let i = 0; i < this.new_proyectos.depende_proyecto.length; i++) {
        if (this.new_proyectos.depende_proyecto[i] == event.value) {
          this.new_proyectos.depende_proyecto.splice(i,1);
        }
      }
    }
    console.log("depende_proyecto "+this.new_proyectos.depende_proyecto.length);
  }

  get listoToCancel(): boolean {
    return (
      this.new_proyectos.new_name_proyecto === '' &&
      this.new_proyectos.new_descrip_proyecto === '' &&
      this.new_proyectos.new_cliente_proyecto === '' &&
      this.new_proyectos.new_abrev_cliente_proyecto === '' &&
      this.new_proyectos.prioridad === '' &&
      this.new_proyectos.new_fecha_fin_proyecto === '' &&
      this.new_proyectos.new_responsable_proyecto === ''
    );
  }

  get listoToRegistro(): boolean {
    return (
      this.new_proyectos.new_name_proyecto != '' &&
      this.new_proyectos.new_descrip_proyecto != '' &&
      this.new_proyectos.new_cliente_proyecto != '' &&
      this.new_proyectos.new_abrev_cliente_proyecto != '' &&
      this.new_proyectos.prioridad != '' &&
      this.new_proyectos.new_fecha_fin_proyecto != '' &&
      this.new_proyectos.new_responsable_proyecto != ''
    );
  }

  cancelaRegistro(){
    var txtNameProyecto:any = document.getElementById("txtNameProyecto");
    var txtDescripProyecto:any = document.getElementById("txtDescripProyecto");
    var txtClienteProyecto:any = document.getElementById("txtClienteProyecto");
    var txtAbrevClienteProyecto:any = document.getElementById("txtAbrevClienteProyecto");
    var txtPrioridadProyecto:any = document.getElementById("txtPrioridadProyecto");
    var txtFechaFinProyecto:any = document.getElementById("txtFechaFinProyecto");
    var txtResponsableProyecto:any = document.getElementById("txtResponsableProyecto");
    var radioUploadEvid:any = document.getElementById("radioUploadEvid");
    var radioDeletedUploadedEvid:any = document.getElementById("radioDeletedUploadedEvid");
  
    this.validator.limpiaInputRow(txtNameProyecto);
    this.validator.limpiaTextarea(txtDescripProyecto);
    this.validator.limpiaInputRow(txtClienteProyecto);
    this.validator.limpiaInputRow(txtAbrevClienteProyecto);
    this.validator.limpiaInputRow(txtFechaFinProyecto);
    $("#txtResponsableProyecto").val("");
    txtPrioridadProyecto.selectedIndex = 0;
    txtResponsableProyecto.selectedIndex = 0;
    radioUploadEvid.checked = false;
    radioDeletedUploadedEvid.checked = false;
  
    this.new_proyectos.new_name_proyecto = "";
    this.new_proyectos.new_descrip_proyecto = "";
    this.new_proyectos.new_cliente_proyecto = "";
    this.new_proyectos.new_abrev_cliente_proyecto = "";
    this.new_proyectos.prioridad = "";
    this.new_proyectos.new_fecha_fin_proyecto = "";
    this.new_proyectos.new_responsable_proyecto = "";
    this.new_proyectos.bool_upload_evid = false;
    this.new_proyectos.bool_delete_evid_uploaded = false;
  
    this.listEquipoTrabajo.length = 0;
    this.new_proyectos.new_equipo_trabajo.length = 0;
    for (let i = 0; i < this.arrayEmpleados.length; i++) {
      const pers = this.arrayEmpleados[i];
      pers['selected'] = false;
    }
  }

  registrarProyecto(){
    var txtNameProyecto = document.getElementById("txtNameProyecto");
    var txtDescripProyecto = document.getElementById("txtDescripProyecto");
    var txtClienteProyecto = document.getElementById("txtClienteProyecto");
    var txtAbrevClienteProyecto = document.getElementById("txtAbrevClienteProyecto");
    var txtPrioridadProyecto = document.getElementById("txtPrioridadProyecto");
    var txtFechaFinProyecto = document.getElementById("txtFechaFinProyecto");
    var txtResponsableProyecto = document.getElementById("txtResponsableProyecto");
  
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

          var fecha = this.new_proyectos.new_fecha_fin_proyecto.split('T')[0];
          var hora = this.new_proyectos.new_fecha_fin_proyecto.split('T')[1];
          console.log(fecha+" "+hora);

          if (this.new_proyectos.new_name_proyecto != "" && this.validator.filtroAlfaNumerico(this.new_proyectos.new_name_proyecto) == true &&
            this.new_proyectos.new_descrip_proyecto != "" && this.validator.filtroAlfaNumerico(this.new_proyectos.new_descrip_proyecto) == true &&
            this.new_proyectos.new_cliente_proyecto != "" && this.validator.filtroAlfaNumerico(this.new_proyectos.new_cliente_proyecto) == true &&
            this.new_proyectos.new_abrev_cliente_proyecto != "" && this.validator.strFilEmp(this.new_proyectos.new_abrev_cliente_proyecto) == true &&
            (this.new_proyectos.new_abrev_cliente_proyecto.length == 3 || this.new_proyectos.new_abrev_cliente_proyecto.length == 4) &&
            this.new_proyectos.prioridad != "" &&
            this.new_proyectos.new_fecha_fin_proyecto != "" && this.validator.filtroFecha(fecha) == true && this.validator.filtroHora(hora) == true &&
            this.new_proyectos.new_responsable_proyecto != "") {
            this._proyServ.registraProyecto(
              this.new_proyectos.new_name_proyecto,
              this.new_proyectos.new_descrip_proyecto,
              this.new_proyectos.new_abrev_cliente_proyecto,
              this.new_proyectos.new_cliente_proyecto,
              this.new_proyectos.prioridad,
              this.new_proyectos.new_fecha_fin_proyecto,
              this.new_proyectos.bool_upload_evid,
              this.new_proyectos.bool_delete_evid_uploaded,
              this.new_proyectos.new_responsable_proyecto,
              this.new_proyectos.new_equipo_trabajo,
              this.new_proyectos.depende_proyecto
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
            if (this.new_proyectos.new_name_proyecto == "" || this.validator.filtroAlfaNumerico(this.new_proyectos.new_name_proyecto) == false) {
              this.validator.errorInputRow(txtNameProyecto);
            }
          
            if (this.new_proyectos.new_descrip_proyecto == "" || this.validator.filtroAlfaNumerico(this.new_proyectos.new_descrip_proyecto) == false) {
              this.validator.errorInputRow(txtDescripProyecto);
            }
          
            if (this.new_proyectos.new_cliente_proyecto == "" || this.validator.filtroAlfaNumerico(this.new_proyectos.new_cliente_proyecto) == false) {
              this.validator.errorInputRow(txtClienteProyecto);
            }
          
            if (this.new_proyectos.new_abrev_cliente_proyecto == "" || this.validator.strFilEmp(this.new_proyectos.new_abrev_cliente_proyecto) == true ||
              this.new_proyectos.new_abrev_cliente_proyecto.length != 3 && this.new_proyectos.new_abrev_cliente_proyecto.length != 4) {
              this.validator.errorInputRow(txtAbrevClienteProyecto);
            }
          
            if (this.new_proyectos.prioridad == "") {
              this.validator.errorSelectRow(txtPrioridadProyecto);
            }
          
            if (this.new_proyectos.new_fecha_fin_proyecto == "" || this.validator.filtroFecha(fecha) == false || this.validator.filtroHora(hora) == false) {
              this.validator.errorInputRow(txtFechaFinProyecto);
            }
          
            if (this.new_proyectos.new_responsable_proyecto == "") {
              this.validator.errorSelectRow(txtResponsableProyecto);
            }
          }
        }
      }
    );
  }

}
