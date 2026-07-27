import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { PublicacionesService } from '../../../../../servicios/ssic/publicaciones.service';
import { publicacionesModelo } from '../../../../../modelos/publicacionesModelo';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones_lista.component.html',
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
    '../../../../../styles/switches.css',
    '../../tec_info.css',
    './publicaciones_lista.component.css',
  ],
})
export class PublicacionesListaComponent implements OnInit {
  public newsModel: publicacionesModelo;
  public window_news_publicacion:boolean = false;
  lista_publicaciones:any = [];

  public window_ver_publicacion:boolean = false;
  public edit_publicacion:boolean = false;
  publicacion_completa:any = [];

  public subtitulo_text:string = "";
  public parrafo_text:string = "";

  public fuente_text: string = "";
  public detalle_fuente_text: string = "";
  @ViewChild('formDataNews') formAddNews!: NgForm;

  constructor(
    private relInterna: ComunicacionInternaService,
    private translate: TranslateService,
    private validator:ValidatorServService,
    private cd: ChangeDetectorRef,
    private newService: PublicacionesService,
  ) {
    this.newsModel = new publicacionesModelo("","",[],[]);
  }

  ngOnInit(): void {
    this.listadoPublicaciones();
  }

  verRegistroPublocacion(){
    this.window_news_publicacion = true;
  }

  listadoPublicaciones(){
    this.newService.publicacionesCatalogo().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.lista_publicaciones = response.arrayPublicaciones;
          console.log(this.lista_publicaciones);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  desglosePublicacion(pub:any){
    this.newService.detallePublicacion(pub.token_publicacion).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.publicacion_completa = response.publicacion;
          console.log(this.publicacion_completa);
          this.publicacion_completa.forEach((dPub:any) => {
            this.newsModel.titulo = dPub.encabezado;
            this.newsModel.resena = dPub.resena_contenido;
            this.newsModel.desglose = dPub.contenido;
            this.newsModel.fuentes_de_consulta = dPub.bibliografia;
            this.edit_publicacion = false;
          });
          this.window_ver_publicacion = true;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  publicacionEditar(event: any) {
    this.edit_publicacion = event.checked ? true : false; 
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
            "subtitulo":this.subtitulo_text,
            "parrafo":this.parrafo_text 
          });
          console.log(this.newsModel.desglose);
          this.subtitulo_text = "";
          this.parrafo_text = "";
          this.cd.detectChanges();
          this.validator.limpiaInputRow(document.getElementById("subtituloNews"));
          this.validator.limpiaInputRow(document.getElementById("informacionNews"));
          //this.desglose_view = true;
        }
      })
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
          //this.fuentes_view = false;
          this.newsModel.fuentes_de_consulta.push({
            "fuente": this.fuente_text,
            "detalle_fuente": this.detalle_fuente_text
          });
          this.cd.detectChanges();
          this.fuente_text = "";
          this.detalle_fuente_text = "";
          this.validator.limpiaInputRow(document.getElementById("fuenteName"));
          this.validator.limpiaInputRow(document.getElementById("detalleFuente"));
          //this.fuentes_view = true;
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
