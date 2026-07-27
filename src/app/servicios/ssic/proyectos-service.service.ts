import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  public url: string;

  public tag_diagon: any;
  public tag_porcent: any;
  public tag_ampersand: any;
  public tag_pessos: any;

  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
    this.tag_diagon = /\//gi;
    this.tag_porcent = /%/gi;
    this.tag_ampersand = /&/gi;
    this.tag_pessos = /'$'/gi;
  }

  registraPlantilla(
    titulo:any,
    bool_upload_evid:any,
    bool_delete_evid_uploaded:any,
    responsable:any,
    equipo_trabajo:any,
    lista_tareas:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras

    let titulo_plantilla = titulo.replace(this.tag_diagon,".diagon.");
    titulo_plantilla = titulo_plantilla.replace(this.tag_porcent,".porcent.");
    titulo_plantilla = titulo_plantilla.replace(this.tag_ampersand,".ampersand.");
    titulo_plantilla = titulo_plantilla.replace(this.tag_pessos,".pessos.");

    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "plantilla_titulo":titulo_plantilla,
      "plantilla_upload_evidencias":bool_upload_evid,
      "plantilla_delete_evidencias":bool_delete_evid_uploaded,
      "plantilla_responsable":responsable,
      "plantilla_team":equipo_trabajo,
      "plantilla_lista_tareas":lista_tareas,
    });
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'registrar_plantilla',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  catalogoPlantillas():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'catalogo_plantillas',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  permisos_proyectos():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'permisos_proyectos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  proyectosList():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  lastProjectCreated():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'last_proyect_created',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  proyectosDeleted():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_eliminados',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosAscFecha():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_fecha_asc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosDescFecha():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_fecha_desc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosAscBlack():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_black_asc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosDescBlack():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_black_desc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosAscGreen():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_green_asc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosDescGreen():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_green_desc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosAscYellow():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_yellow_asc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosDescYellow():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_yellow_desc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosAscRed():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_red_asc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosDescRed():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_red_desc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosAscFinish():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_finish_asc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  listaProyectosDescFinish():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'lista_proyectos_finish_desc',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  calendar_proyectos():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'calendar_proyectos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  gantt_proyectos_outside(large_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":large_token});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'gantt_proyectos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  gantt_proyectos():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'gantt_proyectos',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  calendarPorProyecto():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'calendar_por_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  calendarPorTarea():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code')});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'calendar_por_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  calendarAllPorProyPers(pers_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"pers_token":pers_token});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'calendar_all_por_proy_pers',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  calendarPorProyPers(pers_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"pers_token":pers_token});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'calendar_por_proy_pers',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  calendarPorTarePers(pers_token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"pers_token":pers_token});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'calendar_por_tare_pers',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  /*
  this.new_proyectos.new_name_proyecto,
  this.new_proyectos.new_descrip_proyecto,
  this.new_proyectos.new_abrev_cliente_proyecto,
  this.new_proyectos.new_cliente_proyecto,
  this.new_proyectos.prioridad,
  this.new_proyectos.new_fecha_fin_proyecto,
  this.new_proyectos.bool_upload_evid,
  this.new_proyectos.bool_delete_evid_uploaded,
  this.new_proyectos.new_responsable_proyecto,
  this.new_proyectos.new_equipo_trabajo*/
  registraProyecto(
    new_name_proyecto:any,
    new_descrip_proyecto:any,
    new_abrev_cliente_proyecto:any,
    new_cliente_proyecto:any,
    prioridad:any,
    new_fecha_fin_proyecto:any,
    bool_upload_evid:any,
    bool_delete_evid_uploaded:any,
    new_responsable_proyecto:any,
    new_equipo_trabajo:any,
    depende_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras

    let name_proyecto = new_name_proyecto.replace(this.tag_diagon,".diagon.");
    name_proyecto = name_proyecto.replace(this.tag_porcent,".porcent.");
    name_proyecto = name_proyecto.replace(this.tag_ampersand,".ampersand.");
    name_proyecto = name_proyecto.replace(this.tag_pessos,".pessos.");
    //console.log(name_proyecto);

    let descrip_proyecto = new_descrip_proyecto.replace(this.tag_diagon,".diagon.");
    descrip_proyecto = descrip_proyecto.replace(this.tag_porcent,".porcent.");
    descrip_proyecto = descrip_proyecto.replace(this.tag_ampersand,".ampersand.");
    descrip_proyecto = descrip_proyecto.replace(this.tag_pessos,".pessos.");
    //console.log(descrip_proyecto);

    let json = JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "nameProyecto":name_proyecto,
      "descripProyecto":descrip_proyecto,
      "abrev_cliente":new_abrev_cliente_proyecto,
      "clienteProyecto":new_cliente_proyecto,
      "prioridad_proy":prioridad,
      "fechaFinProyecto":new_fecha_fin_proyecto,
      "upload_evidencias":bool_upload_evid,
      "delete_evidencias":bool_delete_evid_uploaded,
      "token_empleado_inside":new_responsable_proyecto,
      "personalEquipo":new_equipo_trabajo,
      "depende_proyecto":depende_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'registrar_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  quitarLideresProyecto(token_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'quita_lider_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaProyecto(token_proyecto:any,
    txt_name_proyecto:any,
    txt_descrip_proyecto:any,
    txt_abrev_cliente_proyecto:any,
    txt_cliente_proyecto:any,
    prioridad:any,
    txt_responsable_proyecto:any,
    bool_upload_evid:any,
    bool_edit_delete_evid_uploaded:any):Observable<any>{

    let name_proyecto = txt_name_proyecto.replace(this.tag_diagon,".diagon.");
    name_proyecto = name_proyecto.replace(this.tag_porcent,".porcent.");
    name_proyecto = name_proyecto.replace(this.tag_ampersand,".ampersand.");
    name_proyecto = name_proyecto.replace(this.tag_pessos,".pessos.");
    //console.log(name_proyecto);

    let descrip_proyecto = txt_descrip_proyecto.replace(this.tag_diagon,".diagon.");
    descrip_proyecto = descrip_proyecto.replace(this.tag_porcent,".porcent.");
    descrip_proyecto = descrip_proyecto.replace(this.tag_ampersand,".ampersand.");
    descrip_proyecto = descrip_proyecto.replace(this.tag_pessos,".pessos.");
    //console.log(descrip_proyecto);

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"nameProyecto":name_proyecto,
      "descripProyecto":descrip_proyecto,"clienteProyecto":txt_cliente_proyecto,"abrev_cliente":txt_abrev_cliente_proyecto,"prioridad":prioridad,
      "token_empleado_inside":txt_responsable_proyecto,"upload_evidencias":bool_upload_evid,"delete_evidencias":bool_edit_delete_evid_uploaded});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'actualizar_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  agregaProyEqTrabajo(token_proyecto:any,token_empleado_inside:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_empleado_inside":token_empleado_inside});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'agregar_proyecto_eqtrabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  eliminaProyEqTrabajo(token_proyecto:any,token_empleado_inside:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_empleado_inside":token_empleado_inside});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'eliminar_proyecto_eqtrabajo',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  eliminarProyecto(token_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'eliminar_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  restaurarProyecto(token_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'restaurar_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  recoverProyecto(token_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'recover_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  removerProyecto(token_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'remover_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  recalendarizaProyecto(token_proyecto:any,txt_fecha_recal_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"fecha_recalendariza":txt_fecha_recal_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'proyecto_recalendarizar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  nuevoNombreProyecto(token_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'nuevo_nombre_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  detalleProyecto(token_proyecto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'detalle_proyecto',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

//tareas
  registraTarea(token_proyecto:any,txt_name_tarea:any,txt_descrip_tarea:any,txt_fecha_fin_tarea:any,
    txt_responsable_tarea:any,array_responsables_tarea:any,array_depende_tarea:any):Observable<any>{
    let name_tarea = txt_name_tarea.replace(this.tag_diagon,".diagon.");
    name_tarea = name_tarea.replace(this.tag_porcent,".porcent.");
    name_tarea = name_tarea.replace(this.tag_ampersand,".ampersand.");
    name_tarea = name_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(name_tarea);

    let descrip_tarea = txt_descrip_tarea.replace(this.tag_diagon,".diagon.");
    descrip_tarea = descrip_tarea.replace(this.tag_porcent,".porcent.");
    descrip_tarea = descrip_tarea.replace(this.tag_ampersand,".ampersand.");
    descrip_tarea = descrip_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(descrip_tarea);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"nameTarea":name_tarea,
      "descripTarea":descrip_tarea,"fecha_fin_tareaNew":txt_fecha_fin_tarea,"token_empleado_inside":txt_responsable_tarea,
      "array_responsables_tarea":array_responsables_tarea,"array_depende_tarea":array_depende_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'registrar_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  revisionTareaAcceso(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'revision_tarea_acceso',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  tareaDependienteAgregar(token_proyecto:any,token_tarea_pendiente:any,token_tarea_anterior:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea_pendiente":token_tarea_pendiente,"token_tarea_anterior":token_tarea_anterior});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'proyecto_dependiente_tar_agregar',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  tareaDependienteRemover(token_proyecto:any,token_tarea_pendiente:any,token_tarea_anterior:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea_pendiente":token_tarea_pendiente,"token_tarea_anterior":token_tarea_anterior});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'proyecto_dependiente_tar_remover',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  ultimaTareaRegistrada(token_proyecto:any,creat_lider:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"creat_lider":creat_lider});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'last_tarea_created',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  recoverTarea(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'recover_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  detalleTarea(token_proyecto:any,token_tarea:any):Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'detalle_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  duplicarTarea(token_proyecto:any,token_tarea:any,txt_name_tarea:any,txt_descrip_tarea:any,edit_fecha_fin_tarea:any,equipoResponsable:any):Observable<any>{
    let name_tarea = txt_name_tarea.replace(this.tag_diagon,".diagon.");
    name_tarea = name_tarea.replace(this.tag_porcent,".porcent.");
    name_tarea = name_tarea.replace(this.tag_ampersand,".ampersand.");
    name_tarea = name_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(name_tarea);

    let descrip_tarea = txt_descrip_tarea.replace(this.tag_diagon,".diagon.");
    descrip_tarea = descrip_tarea.replace(this.tag_porcent,".porcent.");
    descrip_tarea = descrip_tarea.replace(this.tag_ampersand,".ampersand.");
    descrip_tarea = descrip_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(descrip_tarea);

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"nameTarea":name_tarea,"descripTarea":descrip_tarea,"fecha_fin_tareaNew":edit_fecha_fin_tarea,"equipoResponsable":equipoResponsable});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'duplica_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaNameTarea(token_proyecto:any,token_tarea:any,txt_name_tarea:any):Observable<any>{
    let name_tarea = txt_name_tarea.replace(this.tag_diagon,".diagon.");
    name_tarea = name_tarea.replace(this.tag_porcent,".porcent.");
    name_tarea = name_tarea.replace(this.tag_ampersand,".ampersand.");
    name_tarea = name_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(name_tarea);

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"nameTarea":name_tarea});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'actualiza_name_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaDescripTarea(token_proyecto:any,token_tarea:any,txt_descrip_tarea:any):Observable<any>{
    let descrip_tarea = txt_descrip_tarea.replace(this.tag_diagon,".diagon.");
    descrip_tarea = descrip_tarea.replace(this.tag_porcent,".porcent.");
    descrip_tarea = descrip_tarea.replace(this.tag_ampersand,".ampersand.");
    descrip_tarea = descrip_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(descrip_tarea);

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"descripTarea":descrip_tarea});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'actualiza_descrip_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizaTarea(token_proyecto:any,token_tarea:any,txt_name_tarea:any,txt_descrip_tarea:any):Observable<any>{
    let name_tarea = txt_name_tarea.replace(this.tag_diagon,".diagon.");
    name_tarea = name_tarea.replace(this.tag_porcent,".porcent.");
    name_tarea = name_tarea.replace(this.tag_ampersand,".ampersand.");
    name_tarea = name_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(name_tarea);

    let descrip_tarea = txt_descrip_tarea.replace(this.tag_diagon,".diagon.");
    descrip_tarea = descrip_tarea.replace(this.tag_porcent,".porcent.");
    descrip_tarea = descrip_tarea.replace(this.tag_ampersand,".ampersand.");
    descrip_tarea = descrip_tarea.replace(this.tag_pessos,".pessos.");
    //console.log(descrip_tarea);

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"nameTarea":name_tarea,"descripTarea":descrip_tarea});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'actualiza_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  agrega_resp_tarea(token_proyecto:any,token_tarea:any,token_empleado_inside:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_empleado_inside":token_empleado_inside});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'agrega_responsable_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  recalendarizaTarea(token_proyecto:any,token_tarea:any,edit_fecha_fin_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"fecha_recalendariza":edit_fecha_fin_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'recalendarizar_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  elimina_resp_tarea(token_proyecto:any,token_tarea:any,token_empleado_inside:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_empleado_inside":token_empleado_inside});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'elimina_responsable_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  terminarTarea(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'terminar_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  terminarParticipacionTarea(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'terminar_perticipacion_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  eliminarTarea(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'eliminar_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  lastTareaDeleted(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'last_tarea_deleted',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  restaurarTarea(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'restaurar_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  removerTarea(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'remove_perm_tarea',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

//informes
  registrarInforme(token_proyecto:any,token_tarea:any,informe_encab:any,informe_observ:any,horas_activas:any,informe_evidencias_files:any,informe_evidencias_nombres:any):Observable<any>{
    let informe_titulo = informe_encab.replace(this.tag_diagon,".diagon.");
    informe_titulo = informe_titulo.replace(this.tag_porcent,".porcent.");
    informe_titulo = informe_titulo.replace(this.tag_ampersand,".ampersand.");
    informe_titulo = informe_titulo.replace(this.tag_pessos,".pessos.");

    let informe_observaciones = informe_observ.replace(this.tag_diagon,".diagon.");
    informe_observaciones = informe_observaciones.replace(this.tag_porcent,".porcent.");
    informe_observaciones = informe_observaciones.replace(this.tag_ampersand,".ampersand.");
    informe_observaciones = informe_observaciones.replace(this.tag_pessos,".pessos.");

    //console.log(nuevo_informe);
    const formData = new FormData();
    for (var i = 0; i < informe_evidencias_files.length; i++) {
      formData.append("imgEvidencias[]", informe_evidencias_files[i]);
    }
    formData.append('json',JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_proyecto":token_proyecto,
      "token_tarea":token_tarea,
      "txt_informe":informe_titulo,
      "observ_informe":informe_observaciones,
      "horas_activas":horas_activas,
      "informe_evidencias_nombres":informe_evidencias_nombres,
    }));
    console.log(formData);
    return this._httpClient.post(this.url+'registra_informe',formData).pipe(
      catchError(this.handlerError)
    );
  }

  lastInformeCreated(token_proyecto:any,token_tarea:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'last_informe_created',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  recoverInforme(token_proyecto:any,token_tarea:any,token_informe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_informe":token_informe});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'recover_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  detalleInforme(token_proyecto:any,token_tarea:any,token_informe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_informe":token_informe});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'detalle_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  informeListaEvidencias(token_proyecto:any,token_tarea:any,token_informe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_informe":token_informe});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'informe_evidencias_lista',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  revisarInforme(token_proyecto:any,token_tarea:any,token_informe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_informe":token_informe});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'revisar_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  aprobarInforme(token_proyecto:any,token_tarea:any,token_informe:any,boolean_revision:any,observaciones_revision:any):Observable<any>{
    let informe_list = observaciones_revision.replace(this.tag_diagon,".diagon.");
    informe_list = informe_list.replace(this.tag_porcent,".porcent.");
    informe_list = informe_list.replace(this.tag_ampersand,".ampersand.");
    informe_list = informe_list.replace(this.tag_pessos,".pessos.");
    //console.log(informe_list);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea,
      "token_informe":token_informe,"decision":boolean_revision,"txt_observaciones":informe_list});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'aprobar_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizarInforme(token_proyecto:any,token_tarea:any,token_informe:any,txt_informe_list:any):Observable<any>{
    let informe_list = txt_informe_list.replace(this.tag_diagon,".diagon.");
    informe_list = informe_list.replace(this.tag_porcent,".porcent.");
    informe_list = informe_list.replace(this.tag_ampersand,".ampersand.");
    informe_list = informe_list.replace(this.tag_pessos,".pessos.");
    //console.log(informe_list);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea,
      "token_informe":token_informe,"txt_informe":informe_list});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'actualiza_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizarObservacionesInforme(token_proyecto:any,token_tarea:any,token_informe:any,observaciones_dos:any):Observable<any>{
    let informe_list = observaciones_dos.replace(this.tag_diagon,".diagon.");
    informe_list = informe_list.replace(this.tag_porcent,".porcent.");
    informe_list = informe_list.replace(this.tag_ampersand,".ampersand.");
    informe_list = informe_list.replace(this.tag_pessos,".pessos.");
    //console.log(informe_list);
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea,
      "token_informe":token_informe,"txt_observaciones":informe_list});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'actualiza_observaciones_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  actualizarHorasActivasInforme(token_proyecto:any,token_tarea:any,token_informe:any,horas_activas:any):Observable<any>{ //no existe
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea,
      "token_informe":token_informe,"horas_activas":horas_activas});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'actualiza_tiempo_activo_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  cargaEvidenciasInforme(token_proyecto:any,token_tarea:any,token_informe:any,imagenEvidenciasInformes:any):Observable<any>{
    const formData = new FormData();
    for (var i = 0; i < imagenEvidenciasInformes.length; i++) {
      formData.append("imgEvidencias[]", imagenEvidenciasInformes[i]);
    }
    formData.append('json',JSON.stringify({
      "user_token":sessionStorage.getItem('inside_session_code'),
      "token_proyecto":token_proyecto,
      "token_tarea":token_tarea,
      "token_informe":token_informe,
    }));
    //console.log(formData);
    return this._httpClient.post(this.url+'carga_evidencias_informe',formData).pipe(
      catchError(this.handlerError)
    );
  }

  eliminarInforme(token_proyecto:any,token_tarea:any,token_informe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_informe":token_informe});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'elimina_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  descargaEvidencia(token_documento:any,name_evidencia:any):Observable<any>{
    return this._httpClient.get(this.url+'ver_en_browser/'+token_documento+'/'+name_evidencia)
    .pipe(catchError(this.handlerError))
  }

  deleteEvidencia(token_proyecto:any,token_tarea:any,token_informe:any,token_documento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea,
      "token_informe":token_informe,"token_documento":token_documento});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'proy_eliminar_evidencia',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  restauraEvidencia(token_proyecto:any,token_tarea:any,token_informe:any,token_documento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea,
      "token_informe":token_informe,"token_documento":token_documento});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'proy_restaura_evidencia',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  deleteEvidenciaPerm(token_proyecto:any,token_tarea:any,token_informe:any,token_documento:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,"token_tarea":token_tarea,
      "token_informe":token_informe,"token_documento":token_documento});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'proy_delete_evid_perman',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  restaurarInforme(token_proyecto:any,token_tarea:any,token_informe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_informe":token_informe});
    //console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'restaurar_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  removerInforme(token_proyecto:any,token_tarea:any,token_informe:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'); //cabeceras
    let json = JSON.stringify({"user_token":sessionStorage.getItem('inside_session_code'),"token_proyecto":token_proyecto,
      "token_tarea":token_tarea,"token_informe":token_informe});
    console.log(json);
    let parametros = 'json='+json;
    return this._httpClient.post(this.url+'elimina_perm_informe',parametros, {headers: headers}).pipe(
      catchError(this.handlerError)
    );
  }

  handlerError(error: { error: { message: string; }; status: any; message: any; }){
		let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
		if(error.error instanceof ErrorEvent){
			errorMessage = `Error: ${error.error.message}`;
		} else {
      errorMessage = error.error.message;
		}
		return throwError(errorMessage);
	}
}
