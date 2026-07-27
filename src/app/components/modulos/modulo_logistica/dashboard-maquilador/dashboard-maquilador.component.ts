import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';
import { OrdenesProduccionService } from '../../../../servicios/logistica/ordenes-produccion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientesLanding',
  templateUrl: './dashboard-maquilador.component.html',
  standalone:false,
  styleUrls: [
    './dashboard-maquilador.component.css',
    '../logistica.css'
  ],
  providers:[]
})
export class DashboardMaquiladorComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  arrayNotificaciones:any = [];
  public number_notificaciones:number;
  public reload_notificaciones:number;

  maquiladorarrayOrdenes:any = [];
  maquiladorarrayOrdenesCompleted:any = [];
  maquiladorarrayOrdenesProdDel:any = [];

  maquiladorpageProd:number = 1;
  maquiladorpageProdCompleted:number = 1;
  maquiladorprodDeletedPage:number = 1;

  maquiladorsearchProd:any;
  maquiladorsearchProdCompleted:any;
  maquiladorsearchProdDeleted:any;


  public orden_conf_chofer:string;
  public orden_conf_camion:string;
  public orden_conf_placas:string;
  public imagenEvidenciasReceptAduana:string [] = [];
  public cantidad_descarga:string;
  public cantidad_descarga_back:string;
  public cantidad_entrega:string;
  public cantidad_entrega_back:string;

  public imagenEvidenciasDescarga:string [] = [];
  public imagenEvidenciasEntregaToMaq:string [] = [];
  public txt_fecha_salida_final:string;

  constructor(
    private routerr:Router,
    private translate:TranslateService,
    private sentinela:SentinelArkManager,
    private validator:ValidatorServService,
    private prodservice:OrdenesProduccionService
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
    this.number_notificaciones = 0;
    this.reload_notificaciones = 0;
    this.orden_conf_chofer = "";
    this.orden_conf_camion = "";
    this.orden_conf_placas = "";
    this.cantidad_descarga = "";
    this.cantidad_descarga_back = "";
    this.cantidad_entrega = "";
    this.cantidad_entrega_back = "";
    this.txt_fecha_salida_final = "";
  }
  ngOnInit(): void {
    this.cargaOrdenesMaquilador();

    this.prodservice.totalNotificaciones().subscribe(
      response => {
        if (response.status == 'success') {
          this.number_notificaciones = response.total;
          console.log(this.number_notificaciones);
        }
      },
      error => {
        console.log(error);
      }
    );

    setInterval(this.recargaNotificaciones.bind(this),10000);
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

  cargaOrdenesMaquilador(){
    this.prodservice.listaOrdenesProduccMaquilador().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.maquiladorarrayOrdenes = response.ordenes;
          //this.cantidad_entrega = response.ordenes[0]['qantidad_descarga'];
          //this.cantidad_entrega_back = response.ordenes[0]['qantidad_descarga'];
          this.maquiladorarrayOrdenesCompleted = response.completed;
          this.maquiladorarrayOrdenesProdDel = response.deleted;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  valida_cantidad_entrega_maaquila(event:any,cantidad:any){
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      if (event.value <= cantidad) {
        this.cantidad_entrega = event.value;
        this.validator.correctoInput(event,"Cantidad");
      } else {
        this.cantidad_entrega = "";
        this.validator.errorInput(event,"Error en cantidad");
      }
    } else {
      this.cantidad_entrega = "";
      this.validator.errorInput(event,"Error en cantidad");
    }
  }

  solicita_entrega_maaquila(token_produccion:any,cantidad:any){
    if (this.cantidad_entrega != "" && this.cantidad_entrega <= cantidad && this.validator.filtroNum(this.cantidad_entrega) == true) {
      this.prodservice.solicitaEntregaMaquilador(token_produccion,this.cantidad_entrega).subscribe(
        response => {
          console.log(response);
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
            //this.cargaOrdenesOrigen();
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
      this.cantidad_entrega = "";
      this.validator.errorInput(event,"Error en cantidad");
    }
  }

  cerrarColecctionsLogistica(position:any,boton:any,div:any){
    var btnDataGeneral = document.getElementById("btnDataGeneral"+position);
    var btnConfirmaRecept = document.getElementById("btnConfirmaRecept"+position);
    var btnDescargarOrd = document.getElementById("btnDescargarOrd"+position);
    var btnConfirmaEntrega = document.getElementById("btnConfirmaEntrega"+position);
    var btnEstadoOrden = document.getElementById("btnEstadoOrden"+position);

    if(btnDataGeneral?.classList.contains("active")){btnDataGeneral?.classList.remove("active");}
    if(btnConfirmaRecept?.classList.contains("active")){btnConfirmaRecept?.classList.remove("active");}
    if(btnDescargarOrd?.classList.contains("active")){btnDescargarOrd?.classList.remove("active");}
    if(btnConfirmaEntrega?.classList.contains("active")){btnConfirmaEntrega?.classList.remove("active");}
    if(btnEstadoOrden?.classList.contains("active")){btnEstadoOrden?.classList.remove("active");}
    var activaBoton = "#"+boton+position;
    $(activaBoton).addClass("active");

    var viewDataGeneral = document.getElementById('viewDataGeneral'+position);
    var viewSaveConfirmRecept = document.getElementById('viewSaveConfirmRecept'+position);
    var viewSaveDescargarOrd = document.getElementById('viewSaveDescargarOrd'+position);
    var viewSaveConfirmEntrega = document.getElementById('viewSaveConfirmEntrega'+position);
    var viewEstadoOrden = document.getElementById('viewEstadoOrden'+position);

    if(!viewDataGeneral?.classList.contains("noneView")){viewDataGeneral?.classList.add("noneView");}
    if(!viewSaveConfirmRecept?.classList.contains("noneView")){viewSaveConfirmRecept?.classList.add("noneView");}
    if(!viewSaveDescargarOrd?.classList.contains("noneView")){viewSaveDescargarOrd?.classList.add("noneView");}
    if(!viewSaveConfirmEntrega?.classList.contains("noneView")){viewSaveConfirmEntrega?.classList.add("noneView");}
    if(!viewEstadoOrden?.classList.contains("noneView")){viewEstadoOrden?.classList.add("noneView");}
    var abreDiv = "#"+div+position;
    $(abreDiv).removeClass("noneView");
  }

  changeFileEvidencias(e:any){
    var numEvidencias = e.target.files.length;
    //lectura de archivo subido y pasar al reader
    for (let i = 0; i < numEvidencias; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      var typoElement = e.target.files[i].type;
      if (e.target.files[i].size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
        this.imagenEvidenciasReceptAduana.push(e.target.files[i]);
      } else {
        this.imagenEvidenciasReceptAduana = [];
        let mensajeError = '';
        if (e.target.files[i].size > 2000000) {
          mensajeError = 'La imagen excede el tamaño permitido (2MB)';
        }
        if (typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
          mensajeError = 'La imagen debe ser en formato jpg o png';
        }
        Swal.fire({
          position:'top-end',
          icon: 'warning',
          title: mensajeError,
          showConfirmButton:false,
          timer: 3000
        })
        return;
      }
    }
  }

  valida_cantidad_descarga(event:any){
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      if (event.value <= this.cantidad_descarga_back) {
        this.cantidad_descarga = event.value;
        this.validator.correctoInput(event,"Cantidad");
      } else {
        this.cantidad_descarga = "";
        this.validator.errorInput(event,"Error en cantidad");
      }
    } else {
      this.cantidad_descarga = "";
      this.validator.errorInput(event,"Error en cantidad");
    }
  }

  changeFileDescargaEvidencias(e:any){
    var numEvidencias = e.target.files.length;
    //lectura de archivo subido y pasar al reader
    for (let i = 0; i < numEvidencias; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      var typoElement = e.target.files[i].type;
      if (e.target.files[i].size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
        this.imagenEvidenciasDescarga.push(e.target.files[i]);
      } else {
        this.imagenEvidenciasDescarga = [];
        let mensajeError = '';
        if (e.target.files[i].size > 2000000) {
          mensajeError = 'La imagen excede el tamaño permitido (2MB)';
        }
        if (typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
          mensajeError = 'La imagen debe ser en formato jpg o png';
        }
        Swal.fire({
          position:'top-end',
          icon: 'warning',
          title: mensajeError,
          showConfirmButton:false,
          timer: 3000
        })
        return;
      }
    }
  }

  confirmarDescargaLogistica(token_produccion:any,position:any){
    var txtFechaSalidafinal = document.getElementById("txtFechaSalidafinal"+position);
    if (this.cantidad_descarga != "" && this.validator.filtroNum(this.cantidad_descarga) == true) {
      this.prodservice.confirmarDescargaLogistica(token_produccion,"JJHJHJHJHJH",this.cantidad_descarga,this.imagenEvidenciasDescarga).subscribe(
        response => {
          console.log(response);
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
            //this.cargaOrdenesOrigen();
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

  validaFechaSalidaFinal(event:any){
    if (event.value != "" && this.validator.filtroFecha(event.value) == true) {
      this.txt_fecha_salida_final = event.value;
      this.validator.correctoInput(event,"Fecha de salida estimada");
    } else {
      this.txt_fecha_salida_final = "";
      this.validator.errorInput(event,"Error en fecha de salida estimada");
    }
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
            //this.cargaOrdenesOrigen();
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

}
