import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { OrdenesProduccionService } from '../../../../servicios/logistica/ordenes-produccion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-clientesLanding',
  templateUrl: './dashboard-principal.component.html',
  standalone:false,
  styleUrls: [
    './dashboard-principal.component.css',
    '../logistica.css'
  ],
  providers:[]
})
export class DashboardPrincipalComponent implements OnInit {
  public usuario: Usuarios;
  arrayNotificaciones:any = [];
  public number_notificaciones:number;
  public reload_notificaciones:number;

  public identidad: any;
  array_unidad_medida:any = [];

  origenarrayOrdenes:any = [];
  arrayDetalleBitacora:any = [];
  origenarrayOrdenesCompleted:any = [];
  origenarrayOrdenesDeleted:any = [];

  arrayDetalleOrden:any = [];
  public tkn_orden_produccion:string;

  origenpageOrden:number = 1;
  origenpageProdCompleted:number = 1;
  origenprodDeletedPage:number = 1;

  origensearchProd:any;
  origensearchProdCompleted:any;
  origensearchProdDeleted:any;

  public orden_descripcion:string;
  public orden_upc:string;
  public orden_sku:string;
  public orden_cantidad:string;
  public orden_unidad_medida:string;
  public orden_procedencia:string;
  public orden_destino:string;
  public txt_fecha_salida_tentativa:string;
  public txt_fecha_salida_final:string;
  public txt_fecha_llegada_tentativa:string;
  public txt_fecha_llegada_final:string;
  public orden_observaciones_maquila:string;

  constructor(
    private routerr:Router,
    private translate:TranslateService,
    private sentinela:SentinelArkManager,
    private validator:ValidatorServService,
    private prodservice:OrdenesProduccionService,
    private sanitizer:DomSanitizer) {

    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
    this.tkn_orden_produccion = "";
    this.orden_descripcion = "";
    this.orden_upc = "";
    this.orden_sku = "";
    this.orden_cantidad = "";
    this.orden_unidad_medida = "";
    this.orden_procedencia = "";
    this.orden_destino = "";
    this.txt_fecha_salida_tentativa = "";
    this.txt_fecha_salida_final = "";
    this.txt_fecha_llegada_tentativa = "";
    this.txt_fecha_llegada_final = "";
    this.orden_observaciones_maquila = "";
    //this.orden_conf_chofer = "";
    //this.orden_conf_camion = "";
    //this.orden_conf_placas = "";
    this.number_notificaciones = 0;
    this.reload_notificaciones = 0;
  }
  ngOnInit(): void {
    this.cargaOrdenesOrigen();

    this.prodservice.totalNotificaciones().subscribe(
      response => {
        if (response.status == 'success') {
          this.number_notificaciones = response.total;
        }
      },
      error => {
        console.log(error);
      }
    );

    setInterval(this.recargaNotificaciones.bind(this),10000);

    this.prodservice.listaMedidas().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listMedidas);
          this.array_unidad_medida = response.listMedidas;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  recargaNotificaciones(){
    this.prodservice.totalNotificaciones().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response.notificaciones.length);
          this.reload_notificaciones = response.total;

          if (this.number_notificaciones < this.reload_notificaciones) {
            this.number_notificaciones = this.reload_notificaciones;
            this.prodservice.verUltimaNotificacion().subscribe(
              response => {
                if (response.status == 'success') {
                  Swal.fire({
                    position:'top-end',
                    icon: 'info',
                    title: response.notificaciones[0]["mensaje_completo"],
                    showConfirmButton:false,
                    timer: 3000
                  })
                  if (this.arrayNotificaciones.length <= 5) {
                    this.notificacionesMin();
                  } else {
                    this.notificacionesAll();
                  }
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (this.number_notificaciones > this.reload_notificaciones) {
            this.number_notificaciones = this.reload_notificaciones;
          }
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  notificacionesMin(){
    this.prodservice.notificacionesMin().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.notificaciones);
          this.arrayNotificaciones = response.notificaciones;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  notificacionesAll(){
    this.prodservice.notificacionesAll().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.notificaciones);
          this.arrayNotificaciones = response.notificaciones;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verListNotificaciones(){
    var dropdownNotificaciones = document.getElementById("listNotificaciones");
    if (dropdownNotificaciones?.classList.contains("active-listNotificaciones")) {
      this.arrayNotificaciones.length = 0;
      console.log(this.arrayNotificaciones);
      dropdownNotificaciones?.classList.remove("active-listNotificaciones");
    } else {
      this.notificacionesMin();
      dropdownNotificaciones?.classList.add("active-listNotificaciones");
    }
  }

  verNotificacion(token_notificacion:any){
    this.prodservice.verNotificacion(token_notificacion).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.respuesta);
          if (this.arrayNotificaciones.length <= 5) {
            this.notificacionesMin();
          } else {
            this.notificacionesAll();
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  lgoutFunct(identidad:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_logout"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_logout"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      var enrutador = this.routerr;
      if (result.isConfirmed) {

        setTimeout(function(e:any){
          localStorage.clear();
          sessionStorage.clear();
          identidad = [];
          enrutador.navigate(['./logistica/login']);
        },3000);
        //window.location.reload();
      }
    });
  }

  cerrarModal(modal:any){
    $(modal).removeClass("open");
  }

  cargaOrdenesOrigen(){
    this.prodservice.listaOrdenesProduccOrigen().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.origenarrayOrdenes = response.ordenes;
          this.origenarrayOrdenesCompleted = response.completed;
          this.origenarrayOrdenesDeleted = response.deleted;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  recollapsible(event:any){
    //console.log(event.target.className);
    //this.arrayDetalleOrden = [];
  }

  detalleOrdenesOrigen(token_produccion:any){
    if (this.tkn_orden_produccion != token_produccion) {
      this.arrayDetalleOrden.length = 0;
      this.prodservice.detalleOrdenesProduccOrigen(token_produccion).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(response);
            this.arrayDetalleOrden = response.orden;
            this.tkn_orden_produccion = token_produccion;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  cerrarColecctionsOrigen(position:any,boton:any,div:any){
    var btnDataGeneral = document.getElementById("btnDataGeneral"+position);
    var btnSaveFechaSalida = document.getElementById("btnSaveFechaSalida"+position);
    var btnEstadoOrden = document.getElementById("btnEstadoOrden"+position);

    if(btnDataGeneral?.classList.contains("active")){btnDataGeneral?.classList.remove("active");}
    if(btnSaveFechaSalida?.classList.contains("active")){btnSaveFechaSalida?.classList.remove("active");}
    if(btnEstadoOrden?.classList.contains("active")){btnEstadoOrden?.classList.remove("active");}
    var activaBoton = "#"+boton+position;
    $(activaBoton).addClass("active");

    var viewDataGeneral = document.getElementById('viewDataGeneral'+position);
    var viewSaveFechaSalida = document.getElementById('viewSaveFechaSalida'+position);
    var viewEstadoOrden = document.getElementById('viewEstadoOrden'+position);

    if(!viewDataGeneral?.classList.contains("noneView")){viewDataGeneral?.classList.add("noneView");}
    if(!viewSaveFechaSalida?.classList.contains("noneView")){viewSaveFechaSalida?.classList.add("noneView");}
    if(!viewEstadoOrden?.classList.contains("noneView")){viewEstadoOrden?.classList.add("noneView");}
    var abreDiv = "#"+div+position;
    $(abreDiv).removeClass("noneView");
  }

  registraOrdenSalidaFinal(token_produccion:any,position:any){
    var txtFechaSalidafinal = document.getElementById("txtFechaSalidafinal"+position);
    if (this.txt_fecha_salida_final != "" && this.validator.filtroFecha(this.txt_fecha_salida_final) == true) {

      this.prodservice.registrarFsalidaOrdenP(token_produccion,this.txt_fecha_salida_final).subscribe(
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
            this.cargaOrdenesOrigen();
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
      this.validator.errorInput(txtFechaSalidafinal,"Error en fecha de salida final");
    }
  }

  verBitacoraDetalle(token_produccion:any,token_bitacora:any){
    this.arrayDetalleBitacora.length = 0;
    this.prodservice.detalleBitacoraOrdenProducc(token_produccion,token_bitacora).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.arrayDetalleBitacora = response.statusOrden;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verEvidenciasolicitud(convert:any,confPos:any){
    //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
    for (let b = 0; b < this.arrayDetalleBitacora.length; b++) {
      const det = this.arrayDetalleBitacora[b];
      det['confirmacion'][confPos]['embbed'] = this.sanitizer.bypassSecurityTrustHtml(convert);
    }
  }

  verEvidenciaConfirm(convert:any,confPos:any){
    //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
    for (let b = 0; b < this.arrayDetalleBitacora.length; b++) {
      const det = this.arrayDetalleBitacora[b];
      det['confirmacion'][confPos]['embbed'] = this.sanitizer.bypassSecurityTrustHtml(convert);
    }
  }

  verEvidenciaProduccion(convert:any,confPos:any){
    //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
    for (let b = 0; b < this.arrayDetalleBitacora.length; b++) {
      const det = this.arrayDetalleBitacora[b];
      det['confirmacion'][confPos]['embbed'] = this.sanitizer.bypassSecurityTrustHtml(convert);
    }
  }

  verEvidenciaExportacion(convert:any,confPos:any){
    //this.pdfEvidencia = this.sanitizer.bypassSecurityTrustHtml(convert);
    for (let b = 0; b < this.arrayDetalleBitacora.length; b++) {
      const det = this.arrayDetalleBitacora[b];
      det['confirmacion'][confPos]['embbed'] = this.sanitizer.bypassSecurityTrustHtml(convert);
    }
  }

  deleteOrden(token_produccion:any){
    this.prodservice.eliminaOrdenP(token_produccion).subscribe(
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
          this.cargaOrdenesOrigen();
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
  restaurarOrden(token_produccion:any){
    this.prodservice.restauraOrdenP(token_produccion).subscribe(
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
          this.cargaOrdenesOrigen();
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
  deletePermOrden(token_produccion:any){
    this.prodservice.deletepermOrdenP(token_produccion).subscribe(
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
          this.cargaOrdenesOrigen();
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

  cerrarColecctionTerm(position:any,boton:any,div:any){
    var btntDataGeneral = document.getElementById("btntDataGeneral"+position);
    var btntEstadoOrden = document.getElementById("btntEstadoOrden"+position);

    if(btntDataGeneral?.classList.contains("active")){btntDataGeneral?.classList.remove("active");}
    if(btntEstadoOrden?.classList.contains("active")){btntEstadoOrden?.classList.remove("active");}
    var activaBoton = "#"+boton+position;
    $(activaBoton).addClass("active");

    var viewtDataGeneral = document.getElementById('viewtDataGeneral'+position);
    var viewtEstadoOrden = document.getElementById('viewtEstadoOrden'+position);

    if(!viewtDataGeneral?.classList.contains("noneView")){viewtDataGeneral?.classList.add("noneView");}
    if(!viewtEstadoOrden?.classList.contains("noneView")){viewtEstadoOrden?.classList.add("noneView");}
    var abreDiv = "#"+div+position;
    $(abreDiv).removeClass("noneView");
  }

  valida_orden_desc(event:any){
    if (event.value != "" && this.validator.strFilEmp(event.value) == true) {
      this.orden_descripcion = event.value;
      this.validator.correctoInput(event,"Descripción de orden");
    } else {
      this.orden_descripcion = "";
      this.validator.errorInput(event,"Error en descripción de orden");
    }
  }

  valida_orden_upc(event:any){
    if (event.value != "" && this.validator.strFilEmp(event.value) == true) {
      this.orden_upc = event.value;
      this.validator.correctoInput(event,"Upc");
    } else {
      this.orden_upc = "";
      this.validator.errorInput(event,"Error en upc");
    }
  }

  valida_orden_sku(event:any){
    if (event.value != "" && this.validator.strFilEmp(event.value) == true) {
      this.orden_sku = event.value;
      this.validator.correctoInput(event,"Sku");
    } else {
      this.orden_sku = "";
      this.validator.errorInput(event,"Error en sku");
    }
  }

  valida_orden_cantidad(event:any){
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      this.orden_cantidad = event.value;
      this.validator.correctoInput(event,"Cantidad");
    } else {
      this.orden_cantidad = "";
      this.validator.errorInput(event,"Error en cantidad");
    }
  }

  valida_orden_unidad_medida(event:any){
    if (event.value != "") {
      this.orden_unidad_medida = event.value;
      this.validator.correctoSelect(event,"Unidad de medida");
    } else {
      this.orden_unidad_medida = "";
      this.validator.errorSelect(event,"Error en unidad de medida");
    }
  }

  valida_orden_procedencia(event:any){
    if (event.value != "") {
      this.orden_procedencia = event.value;
      this.validator.correctoInput(event,"Procedencia");
    } else {
      this.orden_procedencia = "";
      this.validator.errorSelect(event,"Error en procedencia");
    }
  }

  valida_orden_destino(event:any){
    if (event.value != "") {
      this.orden_destino = event.value;
      this.validator.correctoInput(event,"Destino");
    } else {
      this.orden_destino = "";
      this.validator.errorSelect(event,"Error en destino");
    }
  }

  validaFechaSalidaEst(event:any){
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.txt_fecha_salida_tentativa = event.value;
      this.validator.correctoInput(event,"Fecha de salida estimada");
    } else {
      this.txt_fecha_salida_tentativa = "";
      this.validator.errorInput(event,"Error en fecha de salida estimada");
    }
  }

  validaFechaSalidaFinal(event:any){
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.txt_fecha_salida_final = event.value;
      this.validator.correctoInput(event,"Fecha de salida estimada");
    } else {
      this.txt_fecha_salida_final = "";
      this.validator.errorInput(event,"Error en fecha de salida estimada");
    }
  }

  validaFechaLlegadaEst(event:any){
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.txt_fecha_llegada_tentativa = event.value;
      this.validator.correctoInput(event,"Fecha de llegada estimada");
    } else {
      this.txt_fecha_llegada_tentativa = "";
      this.validator.errorInput(event,"Error en fecha de llegada estimada");
    }
  }

  validaFechaLlegadaFinal(event:any){
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.txt_fecha_llegada_final = event.value;
      this.validator.correctoInput(event,"Fecha de llegada estimada");
    } else {
      this.txt_fecha_llegada_final = "";
      this.validator.errorInput(event,"Error en fecha de llegada estimada");
    }
  }

  valida_orden_observaciones_maquila(event:any){
    if (event.value != "" && this.validator.strFilEmp(event.value) == true) {
      this.orden_observaciones_maquila = event.value;
      this.validator.correctoInput(event,"Observaciones de maquila");
    } else {
      this.orden_observaciones_maquila = "";
      this.validator.errorInput(event,"Error en observaciones de maquila");
    }
  }

  registraOrdenProduccion(){
    var descOrden = document.getElementById("descOrden");
    var upc_orden = document.getElementById("upc_orden");
    var sku_orden = document.getElementById("sku_orden");
    var cantidad_orden = document.getElementById("cantidad_orden");
    var unidad_medida_orden = document.getElementById("unidad_medida_orden");
    var procedencia_orden = document.getElementById("procedencia_orden");
    var destino_orden = document.getElementById("destino_orden");
    var observaciones_maquila_orden = document.getElementById("observaciones_maquila_orden");
    var fechaSalida_orden = document.getElementById("txtFechaSalidaOrden");
    var fechaLlegada_orden = document.getElementById("txtFechaLlegadaOrden");

    if (this.orden_descripcion != "" && this.validator.strFilEmp(this.orden_descripcion) == true &&
      this.orden_upc != "" && this.validator.strFilEmp(this.orden_upc) == true &&
      this.orden_sku != "" && this.validator.strFilEmp(this.orden_sku) == true &&
      this.orden_cantidad != "" && this.validator.filtroNum(this.orden_cantidad) == true &&
      this.orden_unidad_medida != "" && this.orden_procedencia != "" && this.orden_destino != "" &&
      this.orden_observaciones_maquila != "" && this.validator.strFilEmp(this.orden_observaciones_maquila) == true &&
      this.txt_fecha_salida_tentativa != "" && this.validator.filtroFecha(this.txt_fecha_salida_tentativa) == true &&
      this.txt_fecha_llegada_tentativa != "" && this.validator.filtroFecha(this.txt_fecha_llegada_tentativa) == true) {

      this.prodservice.registrarOrdenesProducc(this.orden_descripcion,this.orden_upc,this.orden_sku,
        this.orden_cantidad,this.orden_unidad_medida,this.orden_procedencia,this.orden_destino,
        this.txt_fecha_salida_tentativa,this.txt_fecha_llegada_tentativa,this.orden_observaciones_maquila).subscribe(
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

            $("#descOrden").val(""); //= document.getElementById("descOrden");
            $("#upc_orden").val(""); //= document.getElementById("upc_orden");
            $("#sku_orden").val(""); //= document.getElementById("sku_orden");
            $("#cantidad_orden").val(""); //= document.getElementById("cantidad_orden");
            unidad_medida_orden //= document.getElementById("unidad_medida_orden");
            procedencia_orden //= document.getElementById("procedencia_orden");
            destino_orden //= document.getElementById("destino_orden");
            $("#observaciones_maquila_orden").val(""); //= document.getElementById("observaciones_maquila_orden");
            $("#fechaSalida_orden").val(""); //= document.getElementById("txtFechaSalidaOrden");
            $("#fechaLlegada_orden").val(""); //= document.getElementById("txtFechaLlegadaOrden");

            this.cargaOrdenesOrigen();
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
      if (this.orden_descripcion == "" || this.validator.strFilEmp(this.orden_descripcion) == false) {
        this.validator.errorInput(descOrden,"Error en descripción de orden");
      }
      if (this.orden_upc == "" || this.validator.strFilEmp(this.orden_upc) == false) {
        this.validator.errorInput(upc_orden,"Error en upc");
      }
      if (this.orden_sku == "" || this.validator.strFilEmp(this.orden_sku) == false) {
        this.validator.errorInput(sku_orden,"Error en sku");
      }
      if (this.orden_cantidad == "" || this.validator.filtroNum(this.orden_cantidad) == false) {
        this.validator.errorInput(cantidad_orden,"Error en cantidad");
      }
      if (this.orden_unidad_medida == "") {
        this.validator.errorSelect(unidad_medida_orden,"Error en unidad de medida");
      }
      if (this.orden_procedencia == "") {
        this.validator.errorSelect(procedencia_orden,"Error en procedencia");
      }
      if (this.orden_destino == "") {
        this.validator.errorSelect(destino_orden,"Error en destino");
      }
      if (this.txt_fecha_salida_tentativa == "" || this.validator.filtroFecha(this.txt_fecha_salida_tentativa) == false) {
        this.validator.errorInput(fechaSalida_orden,"Error en fecha de salida estimada");
      }
      if (this.txt_fecha_llegada_tentativa == "" || this.validator.filtroFecha(this.txt_fecha_llegada_tentativa) == false) {
        this.validator.errorInput(fechaLlegada_orden,"Error en fecha de llegada estimada");
      }
      if (this.orden_observaciones_maquila == "" || this.validator.strFilEmp(this.orden_observaciones_maquila) == false) {
        this.validator.errorInput(observaciones_maquila_orden,"Error en observaciones de maquila");
      }
    }
  }

}
