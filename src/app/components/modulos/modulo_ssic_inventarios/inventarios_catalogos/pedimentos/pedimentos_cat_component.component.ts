import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { PedimentosService } from '../../../../../servicios/ssic/pedimentos-serv.service';
import { pedimentoAngularModelo } from '../../../../../modelos/pedimentoAngularModelo';
import { pedimentoDetailAngularModelo } from '../../../../../modelos/pedimentoDetailAngularModelo';
import { global } from '../../../../../servicios/global_ssic';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import numeral from 'numeral';
import { QRCodeComponent } from 'angularx-qrcode';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-interno-egresos-catalogos-listaprod',
  templateUrl: './pedimentos_cat_component.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
    './pedimentos_cat_component.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class ListaPedimentoEgresosComponent implements OnInit {
  @ViewChild('formRegistroPedAduanal') formPedAduanalReg!: NgForm;
  public view_lista_pedimentos:boolean = false;
  declare Instascan: any;
  options = {};
  listaPedimentosTrue:any = [];
  pedimentoSelected:any;
  listaPedimentosDeleted:any = [];
  public usuario: Usuarios;
  public modelPedim: pedimentoAngularModelo;
  public modelDetailPedim: pedimentoDetailAngularModelo;
  imagenAltaPdfevidenciapedim:any;
  htmlPdfevidenciapedim:any;

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    public validator:ValidatorServService,
    public pedimServ:PedimentosService,
    private translate:TranslateService) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.modelPedim = new pedimentoAngularModelo('','','','','');
      this.modelDetailPedim = new pedimentoDetailAngularModelo('','','','','',[]);
  }

  ngOnInit(): void {
    this.pedimentosTrueList();
    this.pedimentosDeletedList();
  }

  pedimentosTrueList(){
    this.pedimServ.listapedimentosvigentes().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPedimentosTrue = response.datosPedimento;
          console.log(this.listaPedimentosTrue);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verPedimento(row:any,token_pedimento:any){
    this.pedimentoSelected = this.pedimentoSelected === row ? null : row;
    this.pedimentoSelected === row ? this.descargarDataPedimento(token_pedimento) : null; 
  }
  
  descargarDataPedimento(token_pedimento:any){
    this.pedimServ.listapedimentosDetalle(token_pedimento).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosPedimento);
          const index_ped = this.listaPedimentosTrue.findIndex((row:any) => row.token_pedimento === token_pedimento);
          this.listaPedimentosTrue[index_ped]["detalle"] = response.datosPedimento;
          this.modelDetailPedim.token_pedimento = response.datosPedimento[0]['token_pedimento'];
          this.modelDetailPedim.fechaPedim = response.datosPedimento[0]['fecha_importacion'];
          this.modelDetailPedim.numeroPedim = response.datosPedimento[0]['numero_pedimento'];
          this.modelDetailPedim.aduana = response.datosPedimento[0]['aduana'];
          this.modelDetailPedim.comentarios = response.datosPedimento[0]['comentarios'];
          this.modelDetailPedim.evidencias = response.datosPedimento[0]['evidencia_file'];
          for (let i = 0; i < this.modelDetailPedim.evidencias.length; i++) {
            const file = this.modelDetailPedim.evidencias[i];
            this.htmlPdfevidenciapedim = this.sanitizer.bypassSecurityTrustResourceUrl(file["url"]);
          }
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  btnDeletePedimento(token_pedimento:any){
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
        this.pedimServ.pedimentoseliminacion(token_pedimento).subscribe(
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
              this.pedimentosTrueList();
              this.pedimentosDeletedList();
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
    console.log(this.modelPedim)
  }

  pedimentosDeletedList(){
    this.pedimServ.listapedimentosdeleted().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPedimentosDeleted = response.datosPedimento;
          console.log(this.listaPedimentosDeleted);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  btnRestPedimListaPap(token_pedimento:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedimServ.pedimentosrestauracion(token_pedimento).subscribe(
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
              this.pedimentosTrueList();
              this.pedimentosDeletedList();
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
    console.log(this.modelPedim)
  }

  btnDelPedimListaPape(token_pedimento:any){
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
        this.pedimServ.pedimentoseliminacionperm(token_pedimento).subscribe(
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
              this.pedimentosTrueList();
              this.pedimentosDeletedList();
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
    console.log(this.modelPedim)
  }

//registro
  checkFechaPedim(event:any){
    let validacion = event.value != '' && this.validator.filtroFecha(event.value) == true;
    this.modelPedim.fechaPedim = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkNumeroImportacion(event:any){
    let validacion = event.value != '' && this.validator.strFilter(event.value) == true;
    this.modelPedim.numeroPedim = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkPedimAduana(event:any){
    let validacion = event.value != '' && this.validator.strFilter(event.value) == true;
    this.modelPedim.aduana = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkComentariosPedim(event:any){
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelPedim.comentarios = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeEscannerEvidPed(e:any){
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    var typoElement = e.target.files[0].type;
    if (e.target.files[0].size <= 2000000 && (typoElement == 'application/pdf')) {
      this.imagenAltaPdfevidenciapedim = e.target.files[0];
      if (typoElement == 'application/pdf') {
        this.modelPedim.nameEvidencia = e.target.files[0].name;
        reader.onload =  function(){
          $("#divImgClassEvidPedim").removeClass("btnError");
          let imgPerfil = '<iframe style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
          $("#divImgClassEvidPedim").html(imgPerfil);
        };
      }
    } else {
      let mensajeError = '';
      if (e.target.files[0].size > 2000000) {
        mensajeError = 'La evidencia excede el tamaño permitido (2MB)';
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

  clickEscannerEvidenciaPedim(){//readerEvidenciaPedim
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
    let codeQrstfiscal:any = new Html5QrcodeScanner("readerEvidenciaPedim",config,false);
    codeQrstfiscal.render(this.scanYesEvidencia,this.onScanError);
  }

  scanYesEvidencia(decodedText:any, decodedResult:any) {
    global.imagenUrlEvidenciaLote = decodedText;
    $("#divImgClassEvidPedim").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaPdfFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+decodedText+'" frameborder="0"></iframe>';
    $("#divImgClassEvidPedim").html(imgPerfil);
    Swal.fire({
      position:'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton:false,
      timer: 3000
    })
  }

  onScanError(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}

  get verificaData(): boolean{
    return (this.modelPedim.fechaPedim != '' && this.modelPedim.numeroPedim != '' && this.modelPedim.aduana != '' && this.modelPedim.comentarios != '');
  }

  registraPedimento(form:NgForm):void{
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
        this.pedimServ.registropedimentos(this.imagenAltaPdfevidenciapedim,this.modelPedim).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(() => {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
                form.resetForm();
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdFecha"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdNumeroPed"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdAduana"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdComentarios"));
                this.validator.limpiaInputRow(document.getElementById("dataPedimAdDocs"));

                this.formPedAduanalReg.resetForm();
                this.pedimentosTrueList();
                this.pedimentosDeletedList();
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
      }
    })
    console.log(this.modelPedim)
  }
}
