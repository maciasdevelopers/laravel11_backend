import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { GastosService } from '../../../../../../servicios/ssic/gastos-serv.service';
import { loteDetailAngularModelo } from '../../../../../../modelos/loteDetailAngularModelo';
import { global } from '../../../../../../servicios/global_ssic';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interno-egresos-catalogos-listaprod',
  templateUrl: './listagastoegresos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/file_input.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/navegador.css',
    '../../../inventarios.css',
    './listagastoegresos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class ListaGastoEgresosComponent implements OnInit {
  public view_lista_gastos:boolean = false;
  declare Instascan: any;
  options = {};
  pageLote:number = 1;
  loteDeletedPage:number = 1;
  public usuario: Usuarios;
  public modelLote: loteDetailAngularModelo;

  arrayGastosVig:any = [];
  datosDetalleGasto:any = [];
  arrayGastosDel:any = [];
  public imagenAltaPdfevidencialote:any;
  public htmlPdfevidencialote:any;

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    private validator:ValidatorServService,
    private gastoServ:GastosService,
    private translate:TranslateService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.modelLote = new loteDetailAngularModelo('','','','',[]);
  }

  ngOnInit(): void {
    this.listagastostrue();
    this.listagastosdeleted();
  }

  listagastostrue(){
    this.gastoServ.listagastosvigentes().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayGastosVig = response.datosGasto;
          console.log(this.arrayGastosVig);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listagastosdeleted(){
    this.gastoServ.listagastosdeleted().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayGastosDel = response.datosGasto;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //productos
    recargaGastos(){
      this.gastoServ.listagastosvigentes().subscribe(
        response => {
          if (response.status == 'success') {
            this.arrayGastosVig = response.datosLote;
          }
        },
        error => {
          console.log(error);
        }
      );

      this.gastoServ.listagastosdeleted().subscribe(
        response => {
          if (response.status == 'success') {
            this.arrayGastosDel = response.datosLote;
          }
        },
        error => {
          console.log(error);
        }
      );
    }

    verModalLote(token_lote:any){
      //alert(dattknprod);o
      this.gastoServ.listagastosDetalle(token_lote).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(response.datosLote);
            this.datosDetalleGasto = response.datosLote;
            this.modelLote.token_lote = response.datosLote[0]['token_lote'];
            this.modelLote.fechaLote = response.datosLote[0]['fecha_lote'];
            this.modelLote.numeroLote = response.datosLote[0]['numero_lote'];
            this.modelLote.comentarios = response.datosLote[0]['comentarios'];
            this.modelLote.evidencias = response.datosLote[0]['nameDocEvidencia'];
            //this.imagenAltaPdfevidencialote = response.datosLote[0]['evidencias'];
            this.htmlPdfevidencialote = this.sanitizer.bypassSecurityTrustHtml('<iframe src="'+response.datosLote[0]['evidencias']+'" width="100%" height="300px"></iframe>');
          }
        },
        error => {
          console.log(error);
        }
      )
    }

    btnDeleteLote(token_lote:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea eliminar este lote?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.gastoServ.gastoseliminacion(token_lote).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.recargaGastos();
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
          )
        }
      })
      console.log(this.modelLote)
    }

    btnRestLoteListaPap(token_lote:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea restaurar este lote?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_restore"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.gastoServ.gastosrestauracion(token_lote).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.recargaGastos();
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
          )
        }
      })
      console.log(this.modelLote)
    }

    btnDelLoteListaPape(token_lote:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea eliminar este lote?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.gastoServ.gastoseliminacionperm(token_lote).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.recargaGastos();
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
          )
        }
      })
      console.log(this.modelLote)
    }

    checkFechaLote(event:any){
      console.log(event.value);
      if (event.value == '') {
        this.validator.errorInput(event,'Inserta fecha de lote');
        this.modelLote.fechaLote = '';
      } else {
        if (this.validator.filtroFecha(event.value) == false) {
          this.validator.errorInput(event,'Fecha de lote invalido');
          this.modelLote.fechaLote = '';
        } else {
          this.validator.correctoInput(event,'Fecha de lote');
          this.modelLote.fechaLote = event.value;
        }
      }
    }

    checkNumeroLote(event:any){
      if (event.value == '') {
        this.validator.errorInput(event,'Inserta número de lote');
        this.modelLote.numeroLote = '';
      } else {
        if (this.validator.strFilter(event.value) == false) {
          this.validator.errorInput(event,'Número de lote invalido');
          this.modelLote.numeroLote = '';
        } else {
          this.validator.correctoInput(event,'Número de lote');
          this.modelLote.numeroLote = event.value;
        }
      }
    }

    checkComentariosLote(event:any){
      if (event.value == '') {
        this.validator.errorInput(event,'Inserta comentarios');
        this.modelLote.comentarios = '';
      } else {
        if (this.validator.strFilter(event.value) == false) {
          this.validator.errorInput(event,'Número de lote invalido');
          this.modelLote.comentarios = '';
        } else {
          this.validator.correctoInput(event,'Comentarios');
          this.modelLote.comentarios = event.value;
        }
      }
    }

    changeEscannersitfiscal(e:any){
      //imgActClassCaarga public imgActClassIntanCaarga:any;
      //objeto de la clase reader
      let reader = new FileReader();
      //lectura de archivo subido y pasar al reader
      reader.readAsDataURL(e.target.files[0]);
      var typoElement = e.target.files[0].type;
      if (e.target.files[0].size <= 2000000 && (typoElement == 'application/pdf')) {
        this.imagenAltaPdfevidencialote = e.target.files[0];
        if (typoElement == 'application/pdf') {
          this.modelLote.evidencias = e.target.files[0].name;
          reader.onload =  function(){
            $("#divImgClassSitfiscalProv").removeClass("btnError");
            let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
            $("#divImgClassSitfiscalProv").html(imgPerfil);
          };
        }
      } else {
        let mensajeError = '';
        if (e.target.files[0].size > 2000000) {
          mensajeError = 'La imagen excede el tamaño permitido (2MB)';
        }
        if (typoElement != 'application/pdf') {
          mensajeError = 'La evidencia debe ser en formato pdf';
        }
        Swal.fire({
          position:'top-end',
          icon: 'warning',
          title: mensajeError,
          showConfirmButton:false,
          timer: 3000
        })
      }
    }

    clickEscannerEvidenciaLote(){//readerEvidenciaLote
      var cameraId:any = '';
      Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
          cameraId = devices[0].id;
          //console.log(cameraId);
        }
      }).catch(err => {
        // handle err
      });
      let config:any = {fps:10,qrbox: { width: 250, height: 250 }};
      let codeQrstfiscal:any = new Html5QrcodeScanner("readerEvidenciaLote",config,false);
      codeQrstfiscal.render(this.scanYesEvidencia,this.onScanError);
    }

    scanYesEvidencia(decodedText:any, decodedResult:any) {
      global.imagenUrlEvidenciaLote = decodedText;
      $("#divImgClassSitfiscalProv").removeClass("btnError");
      let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+decodedText+'" frameborder="0"></iframe>';
      $("#divImgClassSitfiscalProv").html(imgPerfil);
      Swal.fire({
        position:'center',
        icon: 'success',
        title: 'escaneo completado',
        showConfirmButton:false,
        timer: 3000
      })
    }

    onScanError(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}

    /*actualizaLote(form:{reset:() => void;}):void{
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea actualizar este lote?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.modelLote.fechaLote != '' && this.modelLote.numeroLote != '' &&
          this.modelLote.comentarios != '' && this.modelLote.nameEvidencia != '') {
            this.gastoServ.updateGastosDetalle(this.imagenAltaPdfevidencialote,this.modelLote).subscribe(
              response => {
                if (response.status == 'success') {
                  let translate_response = this.translate.instant(response.message);
                  form.reset();
                  setTimeout(function(){
                    Swal.fire({
                      position:'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton:false,
                      timer: 3000
                    })
                  },1000);
                  setTimeout(function(){
                    window.location.reload();
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
            )
          } else {
            let mensajeError = '';
            if (this.modelLote.fechaLote == '') {
              mensajeError = 'Ingrese fecha de lote';
            }
            if (this.modelLote.numeroLote == '') {
              mensajeError = 'Ingrese número de lote';
            }
            if (this.modelLote.comentarios == '') {
              mensajeError = 'Ingrese comentarios';
            }
            if (this.modelLote.nameEvidencia == '') {
              mensajeError = 'Ingrese o escanee el documento de evidencia para este lote';
            }
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton:false,
              timer: 3000
            })
          }
        }
      })
      console.log(this.modelLote)
    }*/



}
