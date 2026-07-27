import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { publicacionesModelo } from '../../../../../modelos/publicacionesModelo';
import { PublicacionesService } from '../../../../../servicios/ssic/publicaciones.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'control_panel_publicaciones_registro',
  templateUrl: './publicaciones_registro.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/explain.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../tec_info.css',
    './publicaciones_registro.component.css',
  ],

})
export class PublicacionesRegistroComponent implements OnInit {
  public newsModel: publicacionesModelo;

  public subtitulo_text:string = "";
  public parrafo_text:string = "";
  public subtitulo_edit:string = "";
  public parrafo_edit:string = "";

  public fuente_text: string = "";
  public detalle_fuente_text: string = "";
  public fuente_edit: string = "";
  public detalle_fuente_edit: string = "";
  @ViewChild('formDataNews') formAddNews!: NgForm;
  
  constructor(
    private newService: PublicacionesService,
    private translate: TranslateService,
    private validator:ValidatorServService,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef,
  ) { 
    this.newsModel = new publicacionesModelo("","",[],[]);
  }

  ngOnInit(): void {
  }

  publicacionTitulo(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.newsModel.titulo = validacion ? event.value : '';
    if (validacion) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    } 
  }

  publicacionResena(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.newsModel.resena = validacion ? event.value : '';
    if (validacion) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
    console.log(this.newsModel);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  //Contenido
    publicacionSubtitulo(event:any){
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
      this.subtitulo_text = validacion ? event.value : '';
      if (validacion) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
    
    publicacionInformacion(event:any){
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
      this.parrafo_text = validacion ? event.value: '';
      if (validacion) {
        this.validator.correctoInputRow(event)
      } else {
        this.validator.errorInputRow(event)
      }
    }
    
    get valida_contenido_publicacion():boolean{
      const valida_sub = this.subtitulo_text != '' && this.validator.filtroAlfaNumerico(this.subtitulo_text);
      const valida_parrafo = this.parrafo_text != '' && this.validator.filtroAlfaNumerico(this.parrafo_text);
      return valida_sub && valida_parrafo;
    }
  
    redactaContenido(){
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
          //this.desglose_view = false;
          this.newsModel.desglose.push({
            "activaEdicion":false,
            "subtitulo":this.subtitulo_text,
            "parrafo":this.parrafo_text 
          });
          console.log(this.newsModel.desglose);
          this.subtitulo_text = "";
          this.parrafo_text = "";
          this.validator.limpiaInputRow(document.getElementById("subtituloNews"));
          this.validator.limpiaInputRow(document.getElementById("informacionNews"));
          this.cd.detectChanges();
          //this.desglose_view = true;
        }
      })
    }

    activarEdicionContenido(content:any){
      if (!content.activaEdicion) {
        content.activaEdicion = true;
        this.subtitulo_edit = content.subtitulo;
        this.parrafo_edit = content.parrafo
      } else {
        content.activaEdicion = false;
        this.subtitulo_edit = "";
        this.parrafo_edit = '';
      }
    }

    edicionContenidoSubtitulo(content:any, event:any){
      this.subtitulo_edit = event.value;
      console.log(this.subtitulo_edit);
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico (event.value) && this.subtitulo_edit != content.subtitulo;
      if (validacion) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }

    edicionContenidoParrafo(content:any, event:any){
      this.parrafo_edit = event.value;
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico (event.value) && this.parrafo_edit != content.parrafo;
      if (validacion) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
  
    valida_edicion_contenido(content:any):boolean{
      const valida_sub = this.subtitulo_edit != '' && this.validator.filtroAlfaNumerico (this.subtitulo_edit) && this.subtitulo_edit != content.subtitulo;
      const valida_parrafo = this.parrafo_edit != '' && this.validator.filtroAlfaNumerico (this.parrafo_edit) && this.parrafo_edit != content.parrafo;
      const validacion = valida_sub || valida_parrafo;
      return validacion;
    }

    actualizaContenido(content:any){
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
          content.subtitulo = this.subtitulo_edit;
          content.parrafo = this.parrafo_edit;
          this.subtitulo_edit = "";
          this.parrafo_edit = "";
          this.validator.limpiaInputRow(document.getElementById("subtituloEditNews"));
          this.validator.limpiaInputRow(document.getElementById("informacionNews"));
          content.activaEdicion = false;
          this.cd.detectChanges();
        }
      })
    }

    eliminacionContenido(posicion:number){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.newsModel.desglose.splice(posicion, 1);
          this.cd.detectChanges();
        }
      });
    }
  
  //Fuente
    publicacionFuente(event:any){
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
      this.fuente_text = validacion ? event.value : '';
      if (validacion) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
    
    publicacionFuentDetalle(event:any){
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
      this.detalle_fuente_text = validacion ? event.value : '';
      if (validacion) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      } 
    }
    
    get valida_fuente_publicacion(): boolean {
      const valida_fuent = this.fuente_text != '' && this.validator.filtroAlfaNumerico(this.fuente_text);
      const valida_DetalleFuen = this.detalle_fuente_text != '' && this.validator.filtroAlfaNumerico(this.detalle_fuente_text);
      return valida_fuent && valida_DetalleFuen;
    }
    
    redactaFuente() {
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Deseas agregar esta fuente de consulta?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.newsModel.fuentes_de_consulta.push({
            "activaEdicion": false,
            "fuente": this.fuente_text,
            "detalle_fuente": this.detalle_fuente_text
          });
          this.fuente_text = "";
          this.detalle_fuente_text = "";
          this.validator.limpiaInputRow(document.getElementById("fuenteName"));
          this.validator.limpiaInputRow(document.getElementById("detalleFuente"));
          this.cd.detectChanges();
        }
      });
    }

    activarEdicionFuente(fuente:any){
      if (!fuente.activaEdicion) {
        fuente.activaEdicion = true;
        this.fuente_edit = fuente.fuente;
        this.detalle_fuente_edit = fuente.detalle_fuente
      } else {
        fuente.activaEdicion = false;
        this.fuente_edit = "";
        this.detalle_fuente_edit = '';
      }
    }

    edicionFuenteFuente(fuente:any, event:any){
      this.fuente_edit = event.value;
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico (event.value) && this.fuente_edit != fuente.fuente;
      if (validacion) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }

    edicionFuenteDetalle(fuente:any, event:any){
      this.detalle_fuente_edit = event.value;
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico (event.value) && this.detalle_fuente_edit != fuente.detalle_fuente;
      if (validacion) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
  
    valida_edicion_fuentes(fuente:any):boolean{
      const valida_fuent = this.fuente_edit != '' && this.validator.filtroAlfaNumerico (this.fuente_edit) && this.fuente_edit != fuente.fuente;
      const valida_dety_fuent = this.detalle_fuente_edit != '' && this.validator.filtroAlfaNumerico (this.detalle_fuente_edit) && this.detalle_fuente_edit != fuente.detalle_fuente;
      return valida_fuent || valida_dety_fuent;
    }

    actualizaFuentes(fuente:any){
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
          fuente.fuente = this.fuente_edit;
          fuente.detalle_fuente = this.detalle_fuente_edit;
          this.fuente_edit = "";
          this.detalle_fuente_edit = "";
          this.validator.limpiaInputRow(document.getElementById("fuenteEditName"));
          this.validator.limpiaInputRow(document.getElementById("detalleEditFuente"));
          fuente.activaEdicion = false;
          this.cd.detectChanges();
        }
      })
    }

    eliminacionFuente(posicion:number){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.newsModel.fuentes_de_consulta.splice(posicion, 1);
          this.cd.detectChanges();
        }
      });
    }
    
  get OKRegPublic():boolean{
    const pub_titulo = this.newsModel.titulo != '' && this.validator.filtroAlfaNumerico(this.newsModel.titulo);
    const pub_resena = this.newsModel.resena != '' && this.validator.filtroAlfaNumerico(this.newsModel.resena);
    const pub_desglose = this.newsModel.desglose.length > 0;
    const fuentes = this.newsModel.fuentes_de_consulta.length > 0;
    return pub_titulo && pub_resena && pub_desglose && fuentes;
  }

  registraNews(form:{reset:() => void;}){
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
          this.newService.publicacion_registrar(
            this.newsModel.titulo,
            this.newsModel.resena,
            this.newsModel.desglose,
            this.newsModel.fuentes_de_consulta
          ).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function () {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000,
                    customClass: {
                      popup: 'my-swal-zindex'
                    }
                  })
                }, 1000);
                form.reset();
                this.formAddNews.resetForm();
                this.newsModel = new publicacionesModelo("","",[],[]);
                this.relInterna.mensajePublicacionRegistro("publicacion_registrada");
              }
              if (response.status == "error") {
                Swal.fire({
                  position: "top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000,
                  customClass: {
                    popup: 'my-swal-zindex'
                  }
                })
              }
            },
            error => {
              //console.log(error);
            }
          )
      }
    })
  }
}