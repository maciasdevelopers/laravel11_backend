import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { LotesServService } from '../../../../../servicios/ssic/lotes-serv.service';
import { loteDetailAngularModelo } from '../../../../../modelos/loteDetailAngularModelo';
import { global } from '../../../../../servicios/global_ssic';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { loteAngularModelo } from '../../../../../modelos/loteAngularModelo';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-interno-egresos-catalogos-listaprod',
  templateUrl: './lotes_cat_component.component.html',
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
    './lotes_cat_component.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class CatalogoLoteInventComponent implements OnInit {
  @ViewChild('formRegistroLote') formLoteReg!: NgForm;
  public usuario: Usuarios;
  public modelLote: loteAngularModelo;
  public modelLoteDetail: loteDetailAngularModelo;

  public view_lista_lotes:boolean = false;
  listLotesTrue:any = [];
  loteSelected:any;
  datosDetalleLote:any = [];
  
  public view_lotes_deleted:boolean = false;
  arrayLotesDel:any = [];

  public imagenAltaPdfevidencialote:any;
  public htmlPdfevidencialote:any;

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    public validator:ValidatorServService,
    public loteServ:LotesServService,
    private translate:TranslateService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.modelLote = new loteAngularModelo('','','','');
    this.modelLoteDetail = new loteDetailAngularModelo('','','','',[]);
  }

  ngOnInit(): void {
    this.listaLotesTrue();
    this.listaLotesDeleted();
  }

  listaLotesTrue(){
    this.view_lista_lotes = false;
    this.loteServ.listaLotesvigentes().subscribe(
      response => {
        this.view_lista_lotes = true;
        if (response.status == 'success') {
          this.listLotesTrue = response.datosLote;
          console.log(this.listLotesTrue);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verLote(row:any,token_lote:any) {
    this.loteSelected = this.loteSelected === row ? null : row;
    this.loteSelected === row ? this.verModalLote(token_lote) : null;
  }

  verModalLote(token_lote:any){
    //alert(dattknprod);o
    this.loteServ.listaLotesDetalle(token_lote).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosLote);
          this.datosDetalleLote = response.datosLote;
          const pos_index = this.listLotesTrue.findIndex((row:any) => row.token_lote == token_lote);
          this.listLotesTrue[pos_index]["contenido"] = response.datosLote;
          console.log(this.listLotesTrue[pos_index]);

          this.modelLoteDetail.token_lote = response.datosLote[0]['token_lote'];
          this.modelLoteDetail.fechaLote = response.datosLote[0]['fecha_lote'];
          this.modelLoteDetail.numeroLote = response.datosLote[0]['numero_lote'];
          this.modelLoteDetail.comentarios = response.datosLote[0]['comentarios'];
          this.modelLoteDetail.evidencias = response.datosLote[0]['evidencia_file'];
          for (let i = 0; i < this.modelLoteDetail.evidencias.length; i++) {
            const file = this.modelLoteDetail.evidencias[i];
            this.htmlPdfevidencialote = this.sanitizer.bypassSecurityTrustResourceUrl(file["url"]);
          }
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
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.loteServ.loteseliminacion(token_lote).subscribe(
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
              this.listaLotesTrue();
              this.listaLotesDeleted();
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

  listaLotesDeleted(){
    this.view_lotes_deleted = false;
    this.loteServ.listaLotesdeleted().subscribe(
      response => {
        this.view_lotes_deleted = true;
        if (response.status == 'success') {
          this.arrayLotesDel = response.datosLote;
          console.log(this.arrayLotesDel);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  btnRestLoteListaPap(token_lote:any){
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
        this.loteServ.lotesrestauracion(token_lote).subscribe(
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
              this.listaLotesTrue();
              this.listaLotesDeleted();
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
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.loteServ.loteseliminacionperm(token_lote).subscribe(
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
              this.listaLotesTrue();
              this.listaLotesDeleted();
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

//registro
  checkFechaLote(event:any){
    let validacion = event.value != '' && this.validator.filtroFecha(event.value) == true;
    this.modelLote.fechaLote = validacion ? event.value : '';
    console.log(this.modelLote.fechaLote)
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkNumeroLote(event:any){
    let validacion = event.value != '' && this.validator.strFilter(event.value) == true;
    this.modelLote.numeroLote = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  checkComentariosLote(event:any){
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelLote.comentarios = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeEscannersitfiscal(e:any){
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    var typoElement = e.target.files[0].type;
    if (e.target.files[0].size <= 2000000 && (typoElement == 'application/pdf')) {
      this.imagenAltaPdfevidencialote = e.target.files[0];
      if (typoElement == 'application/pdf') {
        this.modelLote.nameEvidencia = e.target.files[0].name;
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

  get verificaData(): boolean{
    //console.log("validarty "+this.modelLote.fechaLote+" "+this.modelLote.numeroLote)
    // && this.modelLote.nameEvidencia != '';
    return (this.modelLote.fechaLote != '' && this.modelLote.numeroLote != '' && this.modelLote.comentarios != '');
  }

  registraLote(form:NgForm):void{
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
        this.loteServ.registroLotes(this.imagenAltaPdfevidencialote,this.modelLote).subscribe(
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
                this.validator.limpiaInputRow(document.getElementById("dataLoteFecha"));
                this.validator.limpiaInputRow(document.getElementById("dataLoteNumero"));
                this.validator.limpiaInputRow(document.getElementById("dataLoteComentarios"));
                this.validator.limpiaInputRow(document.getElementById("dataLoteDocs"));

                this.formLoteReg.resetForm();
                this.listaLotesTrue();
                this.listaLotesDeleted();
              },1000);
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
}
