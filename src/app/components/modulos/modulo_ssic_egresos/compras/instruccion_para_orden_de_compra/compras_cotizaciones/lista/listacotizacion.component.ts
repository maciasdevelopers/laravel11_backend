import { Component,OnInit } from '@angular/core';
import { Usuarios } from '../../../../../../../modelos/Usuarios';
import { RequisicionesService } from '../../../../../../../servicios/ssic/requisiciones.service';
import { CotizacionesService } from '../../../../../../../servicios/ssic/cotizaciones.service';
import Swal from 'sweetalert2';
import { SentinelArkManager } from '../../../../../../../servicios/sentinel-ark-manager';
import DataTable from 'datatables.net-dt';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SessionContextService } from '../../../../../../../servicios/session-context';

@Component({
  selector: 'app_interno_egresos_compras_cotizacion_lista',
  templateUrl: './listacotizacion.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/datatable.css',
    '../../../../../../../styles/dropdown.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/file_input.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/landing.css',
    '../../../../../../../styles/switches.css',
    '../../../../../../../styles/colores.css',
    '../../../../egresos.css',
    './listacotizacion.component.css'],
  //providers: [RequisicionesService,ServClientesService]
})
export class ListaCotizacionComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  lista_cotizaciones:any = [];
  cotizacion_content:any = [];
  searchCotizacion: any;
  pageCotizacion: number = 1;
  public view_lista_cotizaciones:boolean = false;
  public class_lista_cotizaciones:string = "col-12";
  public class_moore_cotizaciones:string = "col-12 noneView";
  public adicionales_header:string = "";
  adicionales_content:any = [];
  public requi_tipo_front:string = "";
  requi_caracteristicas_list:any = [];
  public requi_caracteristicas_other:string = "";
  public requi_cantidad_autorizada:string = "";
  public requi_unidad_medida_name:string = "";
  public requi_marca:string = "";
  reqDetalle:any = [];
  cotiSelToAuth:any = [];
  url_activa:string = "";

  constructor(
    private _reqService: RequisicionesService,
    private _cotService: CotizacionesService,
    private sessionContext: SessionContextService,
    private sentinela: SentinelArkManager,
    private router:Router,
    private translate:TranslateService
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.url_activa = this.router.url;
    this.cotizaciones_lista();
  }

  get permiso_consulta() {
    return this.sessionContext.privilegio_consulta;
  }

  cerrarModal(modal:any){
    console.log(modal);
    $(modal).removeClass("open");
  }

  cotizaciones_lista(){
    this.view_lista_cotizaciones = false;
    this._cotService.solicitudesCotizacionCotizadas().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.view_lista_cotizaciones = true;
          this.lista_cotizaciones = response.solicitudes;
          console.log(this.lista_cotizaciones);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cotizaciones_recargar(){
    this.view_lista_cotizaciones = false;
    this._cotService.solicitudesCotizacionCotizadas().subscribe(
      response => {
        if (response.status == 'success') {
          this.view_lista_cotizaciones = true;
          console.log(response);
          this.lista_cotizaciones = response.solicitudes;
          new DataTable('#buy_table_cotizaciones').ajax.reload();
          //setInterval(function () {table_cotizaciones.ajax.reload();}, 30000);
          console.log(this.lista_cotizaciones);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cotizacion_detalle(token_solicitud_cotizacion:any){
    //this.lista_cotizaciones = response.lista_cotizaciones;'#tableCotizacionList{{lCot.modal_cotizacion}}'
    this._cotService.solicitud_cotizacion_detalle(token_solicitud_cotizacion).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.cotizacion_content = response.solicitudes;
          for (let c = 0; c < this.cotizacion_content.length; c++) {
            const inside = this.cotizacion_content[c];
            console.log("#tableCotizacionList"+inside["modal_cotizacion"]);
          }
          console.log(this.cotizacion_content);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cotiShowAdicionales(token_solicitud_cotizacion:any,token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        for (let d = 0; d < inside["cotizacionesDetalle"].length; d++) {
          const det = inside["cotizacionesDetalle"][d];
          if (det["token_cotizacion"] == token_cotizacion && det["token_detalle_cotizacion"] == token_detalle_cotizacion && det["token_desc_detalle_cotiza"] == token_desc_detalle_cotiza) {
            //adicionales_header
            var bool_desicion = det["coti_desc_open"] == false ? true : false;
            det["coti_especificaciones_open"] = false;
            this.adicionales_content = bool_desicion == true ? det["adicionales"] : [];
            this.requi_tipo_front = "";
            this.requi_caracteristicas_list = [];
            this.requi_caracteristicas_other = "";
            this.requi_cantidad_autorizada = "";
            this.requi_unidad_medida_name = "";
            this.requi_marca = "";
            det["coti_desc_open"] = bool_desicion;
            this.class_lista_cotizaciones = bool_desicion == true ? "col-12 m8 l9 xl9" : "col-12";
            this.class_moore_cotizaciones = bool_desicion == true ? "col-12 m4 l3 xl3" : "col-12 noneView";
          } else {
            det["coti_desc_open"] = false;
            det["coti_especificaciones_open"] = false;
          }
        }
      }
    }
  }

  cotiShowEspecificaciones(token_solicitud_cotizacion:any,token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        for (let d = 0; d < inside["cotizacionesDetalle"].length; d++) {
          const det = inside["cotizacionesDetalle"][d];
          if (det["token_cotizacion"] == token_cotizacion && det["token_detalle_cotizacion"] == token_detalle_cotizacion && det["token_desc_detalle_cotiza"] == token_desc_detalle_cotiza) {
            det["coti_desc_open"] = false;
            var bool_desicion = det["coti_especificaciones_open"] == false ? true : false;
            this.adicionales_content = [];
            console.log(inside["cotizacionesDetalle"][d]);

            this.requi_tipo_front = det["requi_tipo_front"];
            this.requi_caracteristicas_list = det["requi_caracteristicas_list"];
            this.requi_caracteristicas_other = det["requi_caracteristicas_other"] != null && det["requi_caracteristicas_other"] != "" ? det["requi_caracteristicas_other"] : "";
            this.requi_cantidad_autorizada = det["requi_cantidad_autorizada"];
            this.requi_unidad_medida_name = det["requi_unidad_medida_name"];
            this.requi_marca = det["requi_marca"];

            det["coti_especificaciones_open"] = bool_desicion;
            this.class_lista_cotizaciones = bool_desicion == true ? "col-12 m8 l9 xl9" : "col-12";
            this.class_moore_cotizaciones = bool_desicion == true ? "col-12 m4 l3 xl3" : "col-12 noneView";
          } else {
            det["coti_desc_open"] = false;
            det["coti_especificaciones_open"] = false;
          }
        }
      }
    }
  }

  cotiAuthSelect(token_solicitud_cotizacion:any,token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any,event:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        for (let d = 0; d < inside["cotizacionesDetalle"].length; d++) {
          const det = inside["cotizacionesDetalle"][d];
          if (det["token_cotizacion"] == token_cotizacion && det["token_detalle_cotizacion"] == token_detalle_cotizacion && det["token_desc_detalle_cotiza"] == token_desc_detalle_cotiza) {
            det["select_to_auth"] = event.checked == true ? true : false;
            this.cotiAuthValidate(token_solicitud_cotizacion);
          }
        }
      }
    }
  }

  cotiAuthValidate(token_solicitud_cotizacion:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        inside["cotizacionesvalidate"] = inside["cotizacionesDetalle"].some((row:any) => row.select_to_auth == true);
      }
    }
  }

  cotiShowMejorOpcionAdicionales(token_solicitud_cotizacion:any,token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        for (let d = 0; d < inside["cotizacionesDetalleMejorOpcion"].length; d++) {
          const det = inside["cotizacionesDetalleMejorOpcion"][d];
          if (det["token_cotizacion"] == token_cotizacion && det["token_detalle_cotizacion"] == token_detalle_cotizacion && det["token_desc_detalle_cotiza"] == token_desc_detalle_cotiza) {
            //adicionales_header
            var bool_desicion = det["coti_desc_open"] == false ? true : false;
            this.adicionales_content = bool_desicion == true ? det["adicionales"] : [];
            det["coti_desc_open"] = bool_desicion;
            this.class_lista_cotizaciones = bool_desicion == true ? "col-12 m8 l9 xl9" : "col-12";
            this.class_moore_cotizaciones = bool_desicion == true ? "col-12 m4 l3 xl3" : "col-12 noneView";
          } else {
            det["coti_desc_open"] = false;
            det["coti_especificaciones_open"] = false;
          }
        }
      }
    }
  }

  cotiShowMejorOpcionEspecificaciones(token_solicitud_cotizacion:any,token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
       for (let d = 0; d < inside["cotizacionesDetalleMejorOpcion"].length; d++) {
        const det = inside["cotizacionesDetalleMejorOpcion"][d];
        if (det["token_cotizacion"] == token_cotizacion && det["token_detalle_cotizacion"] == token_detalle_cotizacion && det["token_desc_detalle_cotiza"] == token_desc_detalle_cotiza) {
          det["coti_des_open"] = false;
          var bool_desicion = det["coti_especificaciones_open"] == false ? true : false;
          this.adicionales_content = [];
          console.log(inside["cotizacionesDetalle"][d]);

          this.requi_tipo_front = det["requi_tipo_front"];
          this.requi_caracteristicas_list = det["requi_caracteristicas_list"];
          this.requi_caracteristicas_other = det["requi_caracteristicas_other"] != null && det["requi_caracteristicas_other"] != "" ? det["requi_caracteristicas_other"] : "";
          this.requi_cantidad_autorizada = det["requi_cantidad_autorizada"];
          this.requi_unidad_medida_name = det["requi_unidad_medida_name"];
          this.requi_marca = det["requi_marca"];

          det["coti_especificaciones_open"] = bool_desicion;
          this.class_lista_cotizaciones = bool_desicion == true ? "col-12 m8 l9 xl9" : "col-12";
          this.class_moore_cotizaciones = bool_desicion == true ? "col-12 m4 l3 xl3" : "col-12 noneView";
        } else {
          det["coti_desc_open"] = false;
          det["coti_especificaciones_open"] = false;
        }
       } 
      }
    }
  }

  cotizacion_verMejorOpcion(token_solicitud_cotizacion:any,event:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        console.log(inside["token_solicitud_cotizacion"]);
        this.class_lista_cotizaciones = "col-12";
        this.class_moore_cotizaciones = "col-12 noneView";
        if (event.checked == true) {
          inside["cotizaciones_ver_mejor_opcion"] = true;
          $("#seccionCotizacionDetalle"+inside["modal_cotizacion"]).addClass("noneView");
          $("#seccionCotizacionDetalleMOpcion"+inside["modal_cotizacion"]).removeClass("noneView");
        } else {
          inside["cotizaciones_ver_mejor_opcion"] = false;
          console.log("#tableCotizacionList"+inside["modal_cotizacion"]);
          $("#seccionCotizacionDetalle"+inside["modal_cotizacion"]).removeClass("noneView");
          $("#seccionCotizacionDetalleMOpcion"+inside["modal_cotizacion"]).addClass("noneView");
        }

        for (let d = 0; d < inside["cotizacionesDetalle"].length; d++) {
          const det = inside["cotizacionesDetalle"][d];
          det["coti_desc_open"] = false;
          det["coti_especificaciones_open"] = false;
        }

        for (let mo = 0; mo < inside["cotizacionesDetalleMejorOpcion"].length; mo++) {
          const dtMop = inside["cotizacionesDetalleMejorOpcion"][mo];
          dtMop["coti_desc_open"] = false;
          dtMop["coti_especificaciones_open"] = false;
        }

      }
    }
  }

  cotiAuthMejorOpcionSelectToAuthAll(token_solicitud_cotizacion:any,event:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        for (let d = 0; d < inside["cotizacionesDetalleMejorOpcion"].length; d++) {
          const det = inside["cotizacionesDetalleMejorOpcion"][d];
          det["select_to_auth"] = event.checked == true ? true : false;
          this.cotiAuthMejorOpcionValidateToAuth(token_solicitud_cotizacion);
        }
      }
    }
  }

  cotiAuthMejorOpcionSelectToAuth(token_solicitud_cotizacion:any,token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any,event:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        for (let d = 0; d < inside["cotizacionesDetalleMejorOpcion"].length; d++) {
          const det = inside["cotizacionesDetalleMejorOpcion"][d];
          if (det["token_cotizacion"] == token_cotizacion && det["token_detalle_cotizacion"] == token_detalle_cotizacion && det["token_desc_detalle_cotiza"] == token_desc_detalle_cotiza) {
            det["select_to_auth"] = event.checked == true ? true : false;
            this.cotiAuthMejorOpcionValidateToAuth(token_solicitud_cotizacion);
          }
        }
      }
    }
  }

  cotiAuthMejorOpcionValidateToAuth(token_solicitud_cotizacion:any){
    for (let c = 0; c < this.cotizacion_content.length; c++) {
      const inside = this.cotizacion_content[c];
      if (inside["token_solicitud_cotizacion"] == token_solicitud_cotizacion) {
        inside["cotizacionesvalidateMejorOpcion"] = inside["cotizacionesDetalleMejorOpcion"].some((row:any) => row.select_to_auth == true);
      }
    }
  }

  cotiAuthToComprarAll(token_solicitud_cotizacion:any,listado:any){
    this.cotiSelToAuth = [];
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("req_auth"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("yes"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          for (let d = 0; d < listado.length; d++) {
            const det = listado[d];
            if (det["select_to_auth"] == true) {
              this.cotiSelToAuth.push(det);
            }
          }
          console.log(this.cotiSelToAuth);

          this._cotService.cotAuthByList(token_solicitud_cotizacion,this.cotiSelToAuth).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.cotizacion_detalle(token_solicitud_cotizacion);
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },3000);
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
        }
      }
    );
  }

  cotiAuthToComprar(token_cotizacion:any,token_detalle_cotizacion:any,token_desc_detalle_cotiza:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("req_auth"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("yes"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._cotService.cotAuth(token_cotizacion,token_detalle_cotizacion,token_desc_detalle_cotiza).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.cotizacion_detalle(token_cotizacion);
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },3000);
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
        }
      }
    );
  }

  abre_cotizacion(token_cotizacion:any){
    for (let i = 0; i < this.lista_cotizaciones.length; i++) {
      const rowMain = this.lista_cotizaciones[i];
      if (rowMain["token_cotizacion"] == token_cotizacion) {
        rowMain["abierto"] = true;
      } else {
        rowMain["abierto"] = false;
      }
    }
  }

  openRequiDetail(token_requisicion:any){
    this._reqService.detalleRequisicion(token_requisicion).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.reqDetalle = response.desglose_true;
        }
        if (response.status == 'error') {
          let translate_response = this.translate.instant(response.message);
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
  }

  viewDocumento(event: any){
    window.open(event.value, '_blank');
  }
}