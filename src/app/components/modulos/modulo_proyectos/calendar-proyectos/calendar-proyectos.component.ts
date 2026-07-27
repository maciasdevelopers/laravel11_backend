import { Component,OnInit,OnDestroy,Renderer2,ChangeDetectorRef} from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ProyectosService } from '../../../../servicios/ssic/proyectos-service.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { EmpleadosService } from '../../../../servicios/ssic/empleados.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServNavSuperiorService } from '../../../../servicios/ssic/serv-nav-superior.service';
import { Router } from '@angular/router';
import { HttpCancelService } from '../../../../servicios/ssic/http-cancel.service';
import { UsuariosService } from '../../../../servicios/serv_user.service';
//fullcalendar
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';

//const messaging = getMessaging();

@Component({
  selector: 'proy_block_calendar',
  templateUrl: './calendar-proyectos.component.html',
  standalone:false,
  styleUrls: [
    './calendar-proyectos.component.css',
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
export class CalendarProyectosComponent implements OnInit,OnDestroy{
  public usuario: Usuarios;
  public identidad: any;

  searchPersonal:any;
  pagePersonal:number = 1;
  arrayEmpleados:any = [];
  public boolean_permiso_proyectos:boolean = false; 
  public boolean_permiso_tareas:boolean = false;
  public boolean_permiso_informes:boolean = false;
  public boolean_permiso_eliminar:boolean = false;
  public boolean_permiso_ver_docs:boolean = false;
  public visitcalendar:boolean;
  arrayEventosProy:any = [];
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      multiMonthPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'listWeek,timeGridDay,timeGridWeek,dayGridMonth,dayGridYear'
    },
    
    height: 800,
    contentHeight: 780,
    aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio

    nowIndicator: true,
    views: {
      timeGridDay: { buttonText: 'day' },
      timeGridWeek: { buttonText: 'week' },
      dayGridMonth: { buttonText: 'month' },
      dayGridYear: { buttonText: 'year' }
    },

    //initialDate: TODAY,
    initialView: 'listWeek',
    navLinks: true,

    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];
  public token_leader_proy_cal:any;
  public personalSelectedCalendar:string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private sentinela:SentinelArkManager,
    private _proyServ:ProyectosService,
    private translate:TranslateService,
    private _persServ:EmpleadosService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    //calendars
    this.boolean_permiso_proyectos = false;
    this.boolean_permiso_tareas = false;
    this.boolean_permiso_informes = false;
    this.boolean_permiso_eliminar = false;
    this.boolean_permiso_ver_docs = false;
    this.visitcalendar = false;
    this.token_leader_proy_cal = "";
    this.personalSelectedCalendar = "";
    this.calendarOptions.rerenderDelay;
  }

  ngOnInit(): void {
    this.listen();
    this.permisos_settings();
    this.token_leader_proy_cal = this.identidad.user_token;//tokenUsuario
    console.log(this.token_leader_proy_cal);
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
    this.listaCalendarProyectos();
  }

  listen(){
  //  const messaging = getMessaging();
  //  onMessage(messaging, (payload) => {
  //    Swal.fire({
  //      position:'bottom-end',
  //      icon: 'info',
  //      title: payload.notification?.title,
  //      text: payload.notification?.body,
  //      showConfirmButton:false,
  //      timer: 5000
  //    });
  //    this.permisos_settings();
  //  });
  }

  permisos_settings(){
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

  //fullcalendar
    listaCalendarProyectos(){
      console.log("calendar");
      if (this.visitcalendar == false) {
        this.arrayEventosProy.length = 0;
        this._proyServ.calendar_proyectos().subscribe(
          response => {
            if (response.status == 'success') {
              this.arrayEventosProy = response.calendar_proyectos;
              console.log(this.arrayEventosProy);
              this.visitcalendar = true;
              this.calendarOptions = {
                plugins: [
                  interactionPlugin,
                  dayGridPlugin,
                  timeGridPlugin,
                  listPlugin,
                  multiMonthPlugin,
                ],
                headerToolbar: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'listWeek,timeGridDay,timeGridWeek,dayGridMonth,dayGridYear'
                },
                
                height: 800,
                contentHeight: 780,
                aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio
            
                nowIndicator: true,
                views: {
                  timeGridDay: { buttonText: 'day' },
                  timeGridWeek: { buttonText: 'week' },
                  dayGridMonth: { buttonText: 'month' },
                  dayGridYear: { buttonText: 'year' }
                },
            
                //initialDate: TODAY,
                initialView: 'listWeek',
                navLinks: true,
            
                weekends: true,
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                select: this.handleDateSelect.bind(this),
                eventClick: this.handleEventClick.bind(this),
                eventsSet: this.handleEvents.bind(this)
              };
              this.calendarOptions.rerenderDelay;
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    }

    recargaEventosProyFunct(){
      this.arrayEventosProy.length = 0;
      this._proyServ.calendar_proyectos().subscribe(
        response => {
            if (response.status == 'success') {
              this.arrayEventosProy = response.calendar_proyectos;
              console.log(this.arrayEventosProy);
              this.calendarOptions = {
                initialView: 'dayGridMonth',
                events: this.arrayEventosProy,
              };
              this.calendarOptions.rerenderDelay;
              if (this.identidad.user_token != 'WXJpMDJObHVlL1pYSS81RCttUk5SUGx6UWl1NjEvVG1YSlR1Y1puYWk5RFk1T3d3VjFMRExZN3hOTlBxcGE0U3p1ZUM2UTRHVWp4UkFuR241aUxKbHdLU1JLZmFMeXpvK1p3WmZRemkyendCZGY1M0UwM0h2OGhyclRDMytMMnJRRENUUXB4RlRpOWpZeEVpYVR6Nis4b01VaXV0WHpVZ3JzWGg1Q3pGa3lzY0E1VGE2MzM2TjdGU1U0azMvMXFwTVM3YmJMM3p3QTdvYlAxQ3FjUDJVWlRyd09xYWJhUFBLRm1BdXpaVVpXc1Z0UUcxVWtJNDVVTjBjcE1Lb2hIRGpMT2NjYTlNMEtyUW01ZkQ2ckEyWWJTaThxNTZYQkFVTGJVakFVWDFPdVk9OjoxMjM0NTY3ODEyMzQ1Njc4' &&
              this.identidad.user_token != 'ZnRNZzFSSUQ1OE1VM0hYNkxZTjEyQT09OjoxMjM0NTY3ODEyMzQ1Njc4') {
                $("#radioEvtMeAll").prop("checked",true);
                $("#radioEvtMeProyecto").prop("checked",false);
                $("#radioEvtMeTarea").prop("checked",false);
              }
            }
        },
        error => {
          console.log(error);
        }
      );
    }

    listaEventosMeFunctPorProyecto(){
      $("#radioEvtMeAll").prop("checked",false);
      $("#radioEvtMeProyecto").prop("checked",true);
      $("#radioEvtMeTarea").prop("checked",false);

      this.arrayEventosProy.length = 0;
      this._proyServ.calendarPorProyecto().subscribe(
        response => {
            if (response.status == 'success') {
              this.arrayEventosProy = response.calendar_proyectos;
              console.log(this.arrayEventosProy);

              this.calendarOptions = {
                initialView: 'dayGridMonth',
                events: this.arrayEventosProy,
              };
              this.calendarOptions.rerenderDelay;
            }
        },
        error => {
          console.log(error);
        }
      );
    }

    listaEventosMeFunctPorTarea(){
      $("#radioEvtMeAll").prop("checked",false);
      $("#radioEvtMeProyecto").prop("checked",false);
      $("#radioEvtMeTarea").prop("checked",true);

      this.arrayEventosProy.length = 0;
      this._proyServ.calendarPorTarea().subscribe(
        response => {
            if (response.status == 'success') {
              this.arrayEventosProy = response.calendar_proyectos;
              console.log(this.arrayEventosProy);

              this.calendarOptions = {
                initialView: 'dayGridMonth',
                events: this.arrayEventosProy,
              };
              this.calendarOptions.rerenderDelay;
            }
        },
        error => {
          console.log(error);
        }
      );
    }

    //por seleccion de personal
    selectPersonalCalendar(event:any){
      this.token_leader_proy_cal = event.value;

      for (let i = 0; i < this.arrayEmpleados.length; i++) {
        const pers = this.arrayEmpleados[i];
        if (pers["token_empleado_inside"] == event.value) {
          this.personalSelectedCalendar = pers["nombre_completo"];
        }
      }

      console.log(this.token_leader_proy_cal);
      this.listaEventosAllPorProyPersFunct();
    }

    listaEventosAllPorProyPersFunct(){
      $("#radioEvtProyPers").prop("checked",false);
      $("#radioEvtTarePers").prop("checked",false);

      this.arrayEventosProy.length = 0;
      this._proyServ.calendarAllPorProyPers(this.token_leader_proy_cal).subscribe(
        response => {
            if (response.status == 'success') {
              this.arrayEventosProy = response.calendar_proyectos;
              console.log(this.arrayEventosProy);

              this.calendarOptions = {
                initialView: 'dayGridMonth',
                events: this.arrayEventosProy,
              };
              this.calendarOptions.rerenderDelay;
            }
        },
        error => {
          console.log(error);
        }
      );
    }

    listaEventosPorProyPersFunct(){
      $("#radioEvtProyPers").prop("checked",true);
      $("#radioEvtTarePers").prop("checked",false);

      this.arrayEventosProy.length = 0;
      this._proyServ.calendarPorProyPers(this.token_leader_proy_cal).subscribe(
        response => {
            if (response.status == 'success') {
              this.arrayEventosProy = response.calendar_proyectos;
              console.log(this.arrayEventosProy);

              this.calendarOptions = {
                initialView: 'dayGridMonth',
                events: this.arrayEventosProy,
              };
              this.calendarOptions.rerenderDelay;
            }
        },
        error => {
          console.log(error);
        }
      );
    }

    listaEventosPorTarePersFunct(){
      $("#radioEvtTarePers").prop("checked",true);
      $("#radioEvtProyPers").prop("checked",false);

      this.arrayEventosProy.length = 0;
      this._proyServ.calendarPorTarePers(this.token_leader_proy_cal).subscribe(
        response => {
            if (response.status == 'success') {
              this.arrayEventosProy = response.calendar_proyectos;
              console.log(this.arrayEventosProy);

              this.calendarOptions = {
                initialView: 'dayGridMonth',
                events: this.arrayEventosProy,
              };
              this.calendarOptions.rerenderDelay;
            }
        },
        error => {
          console.log(error);
        }
      );
    }

    handleCalendarToggle() {
      this.calendarVisible = !this.calendarVisible;
    }

    handleWeekendsToggle() {
      const { calendarOptions } = this;
      calendarOptions.weekends = !calendarOptions.weekends;
    }

    handleDateSelect(selectInfo: DateSelectArg) {
      const title = prompt('Por favor escriba el titulo del evento');
      const calendarApi = selectInfo.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        });
      }
    }

    handleEventClick(clickInfo: EventClickArg) {
      Swal.fire({
        position:'top-end',
        icon: 'info',
        title: "Evento seleccionado: "+clickInfo.event.id,
        showConfirmButton:false,
        timer: 10000
      });
    }

    handleEvents(events: EventApi[]) {
      this.currentEvents = events;
      this.changeDetector.detectChanges();
    }

    ngOnDestroy() {
      this._proyServ.proyectosList().subscribe().unsubscribe();
    }   
}
