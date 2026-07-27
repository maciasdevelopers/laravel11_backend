import { Component, OnInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input } from "@angular/core";
import { Usuarios } from "../../../../../modelos/Usuarios";
import { global } from "../../../../../servicios/global_ssic"; 
import { HttpCancelService } from "../../../../../servicios/ssic/http-cancel.service";
import { ClientesService } from "../../../../../servicios/ssic/clientes.service";
import { ContabilidadPoliticasService } from "../../../../../servicios/ssic/contabilidad-politicas.service";
import { ValidatorServService } from "../../../../../servicios/validator-serv.service";
import { ServEncryptService } from "../../../../../servicios/ssic/serv-encrypt.service";
import { TranslateService } from "@ngx-translate/core";
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import xmlFormat from 'xml-formatter';
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'contab_seccion_polit_detalle',
  templateUrl: './politicas_detalle.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/breadcrumb.css',
    '../../../../../styles/landing.css',
    '../../contabilidad.css',
    '../../contabilidad.css',
    './politicas_detalle.component.css'
  ]
})

export class ContabPoliticDetalleComponent implements OnInit {
  public usuario: Usuarios;
  public tokenPolitica:any;
  list_politicas_cont_detalle:any = [];

  public html_view_documento:any;
  public name_view_documento:string = "";
  public html_type_documento:string = "";

  public update_politica_concepto:string = "";
  public update_politica_files: NgxFileDropEntry[] = [];
  public update_politica_anexos:any [] = [];

  constructor(
    public renderer: Renderer2,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private poli_serv: ContabilidadPoliticasService,
    private act_rute:ActivatedRoute,
    private sanitizer:DomSanitizer
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.tokenPolitica = this.act_rute.snapshot.paramMap.get("tknPolit");
    this.lista_politicas_cont_detalle();
  }

  lista_politicas_cont_detalle() {
    this.poli_serv.lista_politicas_detalle(this.tokenPolitica).subscribe(
      response => {
        if (response.status == "success") {
          this.list_politicas_cont_detalle = response.politica_info;
          for (let i = 0; i < this.list_politicas_cont_detalle.length; i++) {
            const p_det = this.list_politicas_cont_detalle[i];
            this.update_politica_concepto = p_det["concepto_politica"];
          }
        }
      },
      error => {
        //console.log(error);
      }
    )
  }

  viewDocumento(caja_file:any,anexos_num_list:any,name_documento:any,extension:any,html_doc:any){
    $("#"+caja_file+anexos_num_list).addClass("card_file_clicked");
    console.log(extension);
    this.name_view_documento = name_documento;
    this.html_type_documento = extension;
    if (extension != "xml") {
      this.html_view_documento = this.sanitizer.bypassSecurityTrustHtml(html_doc);
    } else if (extension == "xml") {    
      this.html_view_documento = xmlFormat(html_doc);
    }
    setTimeout(() => {$("#"+caja_file+anexos_num_list).removeClass("card_file_clicked");},1000);
  }

  keyupConceptoPoliticaUPDT(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.update_politica_concepto = event.value;
      this.validator.correctoInput(event,this.translate.instant("observ"));
    } else {
      this.update_politica_concepto = "";
      this.validator.errorInput(event,this.translate.instant("observ_fail"));
    }
  }

  public droppedPolitUPDT(files: NgxFileDropEntry[]) {
    this.update_politica_files = files;
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.update_politica_anexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement+" "+nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            if (this.update_politica_anexos.length > 0) {
              for (let j = 0; j < this.update_politica_anexos.length; j++) {
                const row = this.update_politica_anexos[j];
                if (row["name"] != nameFile) {
                  this.update_politica_anexos.push(file);
                }
              }
            } else {
              this.update_politica_anexos.push(file);
            }
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo '+nameFile+' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo '+nameFile+' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton:false,
              timer: 3000
            })
            this.update_politica_files.splice(i,1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.update_politica_anexos.length);
  }

  public fileOverPolitUPDT(event:any){console.log(event);}
  public fileLeavePolitUPDT(event:any){console.log(event);}

  deleteAnexosPolitUPDT(posicion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionedo?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          //this.update_politica_anexos.splice(posicion,1);
          this.update_politica_files.splice(posicion,1);
          console.log(this.update_politica_anexos.length);
        }
      }
    );
  }

  onUpdatePolitica(tipo_politica:any){
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
        if ((this.update_politica_concepto != "" && this.validator.strFilter(this.update_politica_concepto) == true && this.update_politica_concepto.length >= 4) && this.update_politica_anexos.length > 0) {
          this.poli_serv.politica_update(this.tokenPolitica,tipo_politica,this.update_politica_concepto,this.update_politica_anexos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response+" "+response.folio_just,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.update_politica_concepto = "";
                this.update_politica_files.length = 0;
                this.update_politica_anexos.length = 0;
                this.lista_politicas_cont_detalle();
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
              //console.log(error);
            }
          )
        } else {
          if (this.update_politica_concepto == "" || this.validator.strFilter(this.update_politica_concepto) == false || this.update_politica_concepto.length < 4) {
            this.validator.errorInput(document.getElementById("concepto_comi_polit"),this.translate.instant("observ"));
          }
          if (this.update_politica_anexos.length == 0) {
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: "cargue los archivos que desea subir",
              showConfirmButton:false,
              timer: 3000
            })
          }
        }
      }
    })
  }
}
