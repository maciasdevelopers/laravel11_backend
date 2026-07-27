import { Component,OnInit,OnDestroy,ElementRef, ViewEncapsulation,Renderer2,ViewChild,Input,ChangeDetectorRef,HostListener} from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ProyectosService } from '../../../../servicios/ssic/proyectos-service.service';
import { GanttItem } from '@worktile/gantt';

//const messaging = getMessaging();

@Component({
  selector: 'proy_block_gantt',
  templateUrl: './gantt-proyectos.component.html',
  standalone:false,
  styleUrls: [
    './gantt-proyectos.component.css',
    '../../../../styles/loading.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/tabs.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/div_busqueda.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    //'~jsgantt-improved/dist/jsgantt.css'
  ]
})
export class GanttProyectosComponent implements OnInit,OnDestroy{
  public usuario: Usuarios;
  public listaGantt: GanttItem[] = [];

  public taskSettings?: object;
  public timelineSettings?: object;
  public boolean_permiso_proyectos:boolean = false; 
  public boolean_permiso_tareas:boolean = false;
  public boolean_permiso_informes:boolean = false;
  public boolean_permiso_eliminar:boolean = false;
  public boolean_permiso_ver_docs:boolean = false;

  constructor(
    private _proyServ:ProyectosService
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.permisos_settings();
    this.listaGanttProyectos();
  }

  permisos_settings(){
    this._proyServ.permisos_proyectos().subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.boolean_permiso_proyectos = response.permisos_proyectos;
          this.boolean_permiso_tareas = response.permisos_tareas;
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

  //gantt
    listaGanttProyectos(){
      this.listaGantt = [];
      this._proyServ.gantt_proyectos().subscribe(
        response => {
          console.log(response);
          if (response.status == 'success') {
            //this.listaGantt = response.gantt_proyectos; https://www.angular-gantt.com/configuration/data/
            this.listaGantt = [
              { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197 },
              { id: '000001', title: 'Task 1', start: 1617361997, end: 1735607093 }
            ];
          }
        },
        error => {
          console.log(error);
        }
      );
    }

  ngOnDestroy() {
    //this._proyServ.proyectosList().subscribe().unsubscribe();
  }    
}
