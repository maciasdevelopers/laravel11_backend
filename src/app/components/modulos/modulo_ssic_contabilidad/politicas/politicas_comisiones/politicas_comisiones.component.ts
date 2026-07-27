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
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { DomSanitizer } from "@angular/platform-browser";
import xmlFormat from 'xml-formatter';

@Component({
  selector: 'contab_seccion_polit_comi',
  templateUrl: './politicas_comisiones.component.html',
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
    '../../../../../styles/dropdown.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../contabilidad.css',
    './politicas_comisiones.component.css'
  ]
})

export class ContabPoliticComiComponent implements OnInit {
  public usuario: Usuarios;
  list_politicas_cont_comi:any = [];

  public html_view_documento:any;
  public name_view_documento:string = "";
  public html_type_documento:string = "";

  public new_politica_comi_concepto:string = "";
  public new_politica_comi_files: NgxFileDropEntry[] = [];
  public new_politica_comi_anexos:any [] = [];
  public bool_list_comi:boolean = false;

  constructor(
    public renderer: Renderer2,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private poli_serv: ContabilidadPoliticasService,
    private sanitizer:DomSanitizer
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.lista_politicas_cont_comi();
    //
  }

  cerrarModal(modal:any){
    $(modal).removeClass("open");
  }

  lista_politicas_cont_comi() {
    this.bool_list_comi = false;
    this.poli_serv.lista_politicas_comisiones().subscribe(
      response => {
        if (response.status == "success") {
          this.list_politicas_cont_comi = response.politicas_list;
          console.log(this.list_politicas_cont_comi);
          this.bool_list_comi = true;
        } else {this.bool_list_comi = true;}
      },
      error => {
        //console.log(error);
      }
    );
    
  }

  viewDocumento(name_documento:any,extension:any,html_doc:any){
    console.log(extension);
    this.name_view_documento = name_documento;
    this.html_type_documento = extension;
    if (extension == "pdf") {
      this.html_view_documento = this.sanitizer.bypassSecurityTrustHtml(html_doc);
    } else if (extension == "xml") {    
      this.html_view_documento = xmlFormat(html_doc);
    }
  }

  keyupConceptoPoliticaComi(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.new_politica_comi_concepto = event.value;
      this.validator.correctoInput(event,this.translate.instant("observ"));
    } else {
      this.new_politica_comi_concepto = "";
      this.validator.errorInput(event,this.translate.instant("observ_fail"));
    }
  }

  public droppedPolitComi(files: NgxFileDropEntry[]) {
    this.new_politica_comi_files = files;
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.new_politica_comi_anexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement+" "+nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            if (this.new_politica_comi_anexos.length > 0) {
              for (let j = 0; j < this.new_politica_comi_anexos.length; j++) {
                const row = this.new_politica_comi_anexos[j];
                if (row["name"] != nameFile) {
                  this.new_politica_comi_anexos.push(file);
                }
              }
            } else {
              this.new_politica_comi_anexos.push(file);
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
            this.new_politica_comi_files.splice(i,1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.new_politica_comi_anexos.length);
  }

  public fileOverPolitComi(event:any){console.log(event);}
  public fileLeavePolitComi(event:any){console.log(event);}

  deleteAnexosPolitComi(posicion:any){
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
          //this.new_politica_comi_anexos.splice(posicion,1);
          this.new_politica_comi_files.splice(posicion,1);
          console.log(this.new_politica_comi_anexos.length);
        }
      }
    );
  }

  onSavePoliticaComi(){
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
        if ((this.new_politica_comi_concepto != "" && this.validator.strFilter(this.new_politica_comi_concepto) == true && this.new_politica_comi_concepto.length >= 4) && this.new_politica_comi_anexos.length > 0) {
          this.poli_serv.save_new_politica(this.new_politica_comi_concepto,"TEC",this.new_politica_comi_anexos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response+" "+response.folio_polit,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_politicas_cont_comi();
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
          if (this.new_politica_comi_concepto == "" || this.validator.strFilter(this.new_politica_comi_concepto) == false || this.new_politica_comi_concepto.length < 4) {
            this.validator.errorInput(document.getElementById("concepto_comi_polit"),this.translate.instant("observ"));
          }
          if (this.new_politica_comi_anexos.length == 0) {
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
