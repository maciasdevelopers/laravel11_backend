import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { SentinelArkManager } from "../../../../../servicios/sentinel-ark-manager.js";
import { CatSatServService } from '../../../../../servicios/ssic/cat-sat-serv.service';
import { UniMedServService } from "../../../../../servicios/uni-med-serv.service";
import { FormaPagoService } from "../../../../../servicios/ssic/forma-pago.service";
import { InterfPagoForma } from "../../../../../interfaces/interf-pago-forma";
import { MetodoPagoServService } from '../../../../../servicios/ssic/metodo-pago-serv.service';
import { InterfMetodoPago } from '../../../../../interfaces/interf-metodo-pago';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';
import { InterfUsoCFDI } from '../../../../../interfaces/interf-uso-cfdi';
import { TranslateService } from '@ngx-translate/core';
import { soliCfdiAngularModelo } from "../../../../../modelos/soliCfdiAngularModelo";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { ActivatedRoute } from '@angular/router';
declare var zxcvbn: any;
import '../../../../../../assets/js/zxcvbn.js';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { DomSanitizer } from "@angular/platform-browser";
// To use Html5Qrcode (more info below)
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
declare var zxcvbn: any;

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/modalFixed.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/div_busqueda.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/notificaciones.css',
    '../../../../../styles/breadcrumb.css',
    '../../ingresos.css',
    './detalle-factura.component.css',
  ]
})
export class DetalleFacturaComponent implements OnInit {
  optionTool = {
    "placement": "top",
    //"showDelay":"500"
  };

  searchSoliCancel: any;
  pageSoliCancel: number = 1;

  searchPrevCancelation: any;
  pagePrevCancel: number = 1;

  searchVersions: any;
  pageVersions: number = 1;

  public identidad: any;
  public tokenCFDI: any;
  public tkn_solicitud_cfdi: string;
  public area_window: string;
  public folio_soli_cfdi: string;
  public tkn_emisor: string;
  public tkn_receptor: string;
  public name_cliente: string;
  public email_cliente: string;
  //solicitudes de factura
  public soliCfdiModelo: soliCfdiAngularModelo;
  public files: NgxFileDropEntry[] = [];

  public docsAnexos: any[] = [];
  public docsRespuesta: any[] = [];
  arrayClientes: any = [];
  arrayCatSat: any = [];
  arrayCatUMedida: any = [];
  arraYFormaPago: InterfPagoForma[] = [];
  arraYMetodoPago: InterfMetodoPago[] = [];
  arraUsoCFDI: InterfUsoCFDI[] = [];

  arrayCFDIDet: any = [];
  arraMCancelacionCFDI: any = [];

  //emision
  public resultXml: string;
  public emision_serie: string;
  public emision_folio: string;
  public emision_fecha: string;
  public emision_monto: string;

  public explain_motivo_cancelacion: string;
  public folio_fiscal_sustituto: string;
  public html_view_documento: any;

  public htmlToolInfoCfdi: string;
  public htmlToolEmiFact: string;
  public htmlToolCancel: string;
  public htmlToolVersions: string;

  @Output() emitter = new EventEmitter<string>();
  constructor(
    private sentinela: SentinelArkManager,
    private _catSat: CatSatServService,
    private _medidasCat: UniMedServService,
    private _fpago: FormaPagoService,
    private _metPago: MetodoPagoServService,
    private cfdiServ: CFDIService,
    private act_rute: ActivatedRoute,
    private translate: TranslateService,
    private sanitizer: DomSanitizer
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.tokenCFDI = "";
    this.tkn_solicitud_cfdi = "";
    this.area_window = "";
    this.folio_soli_cfdi = "";
    this.soliCfdiModelo = new soliCfdiAngularModelo("", "", "", "", false, "", "", "0.00", "");
    this.tkn_emisor = "";
    this.tkn_receptor = "";
    this.name_cliente = "";
    this.email_cliente = "";

    this.resultXml = "";
    this.emision_serie = "";
    this.emision_folio = "";
    this.emision_fecha = "";
    this.emision_monto = "";

    this.explain_motivo_cancelacion = "";
    this.folio_fiscal_sustituto = "";
    this.htmlToolInfoCfdi = "";
    this.htmlToolEmiFact = "";
    this.htmlToolCancel = "";
    this.htmlToolVersions = "";
  }

  ngOnInit(): void {




    var porcentajeCarga = 0;
    var intervalo = setInterval(() => {
      porcentajeCarga = porcentajeCarga + 1;
      var porcentDiv = porcentajeCarga + '%';
      $(".h6loadingBlue").html('cargando... ' + porcentDiv);
      if (porcentajeCarga == 100) {
        clearInterval(intervalo);
        $("#iContent").removeClass("noneView");
        setTimeout(function () {
          $("#loadingSeccion").fadeOut("slow");
        }, 3000);
      }
    }, 30);

    this.tokenCFDI = this.act_rute.snapshot.paramMap.get("tknCFDI");
    console.log(this.tokenCFDI);
    this.detalleSolicitudCFDI(this.tokenCFDI);

    this.clientesLista();
    this.catSatProdServLimit();
    this.listaUnidadesMedida();
    this.listFormaPago();
    this.listMetodoPago();
    this.listUsoCFDI();
    this.cfdiCancelacionMotivos();
    this.htmlToolInfoCfdi = this.translate.instant("cfdi_info");
    this.htmlToolEmiFact = this.translate.instant("cfdi_emision");
    this.htmlToolCancel = this.translate.instant("cfdi_can");
    this.htmlToolVersions = this.translate.instant("old_versions");
  }

  area_ventana(origen: any) {
    if (origen == "tab_cancelacion") {
      this.area_window = "window_cancel";
    }
  }

  detalleSolicitudCFDI(token_cfdi: any) {
    this.cfdiServ.detalle_soli_facturacion(token_cfdi).subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayCFDIDet = response.cfdi;
          console.log(this.arrayCFDIDet);
          this.folio_soli_cfdi = this.arrayCFDIDet[0]["folio_cfdi"];
          this.tkn_solicitud_cfdi = this.arrayCFDIDet[0]["token_solicitud_cfdi"];
          this.tkn_emisor = this.arrayCFDIDet[0]["tkn_emisor"];
          this.tkn_receptor = this.arrayCFDIDet[0]["tkn_receptor"];

          this.name_cliente = this.arrayCFDIDet[0]["last_version_principal"][0]["name_cliente"];
          this.email_cliente = this.arrayCFDIDet[0]["last_version_principal"][0]["email_referencia"];

          //this.docsRespuesta = this.arrayCFDIDet[0]["docsRespuesta"];



        }
      },
      error => {
        console.log(error);
      }
    );
  }

  clientesLista() {
    /*this.mainTerAssociatesServ.listaclientes().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayClientes = response.clientes;
          console.log(this.arrayClientes);
        }
      },
      error => {
        console.log(error);
      }
    );*/
  }

  catSatProdServLimit() {
    this._catSat.catSatProdServLimit().subscribe(
      response => {
        if (response.status == 'success') {
          //this.arrayCatSat = response.catSat;
          console.log(this.arrayCatSat);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  listaUnidadesMedida() {
    this._medidasCat.getClassifUmedida().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listMedidas);
          this.arrayCatUMedida = response.listMedidas;

        }
      },
      error => {
        console.log(error);
      }
    )
  }

  listFormaPago() {
    this._fpago.getformapago().subscribe((data: InterfPagoForma[]) => {
      this.arraYFormaPago = data;
    });
  }

  listMetodoPago() {
    this._metPago.getMetodo().subscribe((data: InterfMetodoPago[]) => {
      this.arraYMetodoPago = data;
    });
  }

  listUsoCFDI() {
    this.cfdiServ.usoCFDIGet().subscribe((data: InterfUsoCFDI[]) => {
      this.arraUsoCFDI = data;
    });
  }

  cfdiCancelacionMotivos() {
    this.cfdiServ.motivosCancelacionCfdi().subscribe((data) => {
      this.arraMCancelacionCFDI = data;
      console.log(this.arraMCancelacionCFDI);
    });
  }

  cerrarModal(modal: any) {
    $(modal).removeClass("open");
    //
    //
    //
  }

  viewDocumento(token_documento: any) {
    for (let i = 0; i < this.docsAnexos.length; i++) {
      const doc = this.docsAnexos[i];
      if (doc["token_doc_soli"] == token_documento) {
        console.log(doc["html"]);
        this.html_view_documento = this.sanitizer.bypassSecurityTrustHtml(doc["html"]);
      }
    }
  }

  deleteDocumento(token_documento: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.cfdiServ.deleteDocumentoFact(this.tokenCFDI, token_documento).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
              } else {
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
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

  deleteAnexos(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.docsAnexos.splice(posicion, 1);
          this.files.splice(posicion, 1);
          console.log(this.docsAnexos.length);
        }
      }
    );
  }

  //emision de facturas
  public droppedEmision(files: NgxFileDropEntry[], tkn_cliente: any) {
    this.docsRespuesta.length = 0;
    this.files = files;
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.docsRespuesta.push(file);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(droppedFile.fileEntry, file);
          console.log(typoElement + " " + nameFile);
          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml')) {
            if (typoElement == 'text/xml') {
              this.cfdiServ.validaEstructXmlIngresos(file, this.tkn_emisor, tkn_cliente).subscribe(
                response => {
                  let translate_response = this.translate.instant(response.message);
                  if (response.status == 'success') {
                    console.log(response);
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton: false,
                      timer: 3000
                    })
                    this.resultXml = 'validoXml';

                    console.log(response.version + " " + response.serie + " " + response.Folio + " " + response.Fecha + " " + response.SubTotal);
                    this.emision_serie = response.serie;
                    this.emision_folio = response.Folio;
                    this.emision_fecha = response.Fecha;
                    this.emision_monto = response.SubTotal;
                  }
                  if (response.status == 'errorValidate') {
                    console.log(response)
                    Swal.fire({
                      position: 'top-end',
                      icon: 'warning',
                      title: translate_response,
                      showConfirmButton: false,
                      timer: 3000
                    })
                    console.log(translate_response);
                  }
                  if (response.status == 'error') {
                    console.log(response)
                    Swal.fire({
                      position: 'top-end',
                      icon: 'warning',
                      title: translate_response,
                      showConfirmButton: false,
                      timer: 3000
                    })
                    console.log(translate_response);
                  }
                },
                error => {
                  console.log(error);
                }
              );
            }
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml') {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf o xml';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.docsRespuesta.splice(i, 1);
            this.files.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
      console.log(this.docsRespuesta.length);
    }
  }

  public fileOverEmision(event: any) {
    console.log(event);
  }

  public fileLeaveEmision(event: any) {
    console.log(event);
  }

  onEmiteFactura() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea guardar los cambios de esta factura?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.emision_serie != "" && this.emision_folio != "" && this.emision_fecha != "" && this.emision_monto != "") {
          this.cfdiServ.emitir_factura(this.docsRespuesta, this.tokenCFDI, this.tkn_solicitud_cfdi, this.emision_serie, this.emision_folio, this.emision_fecha, this.emision_monto).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                let mensaje_serv = translate_response;
                const parametros = {
                  from_name: 'SOPORTE SOS',
                  from_email: 'soporte@sos-mexico.com.mx',
                  to_name: this.name_cliente,
                  to_email: this.email_cliente,
                  access_code: this.emision_serie,
                  //access_code:this.emision_serie,
                  //access_code:this.emision_serie,
                  //access_code:this.emision_serie,
                  //access_code:this.emision_serie,
                  link: 'https://sos-mexico.com.mx'
                };

                //emailjs.send(user['email'],contenidoHtml,parametros,'')
                emailjs.send('service_dejznyj', 'template_jpadj0q', parametros, 'H1Nl6vkZbsBm1MtNF')
                  .then((response) => {
                    console.log("success", response.status, response.text);
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: mensaje_serv,
                      showConfirmButton: false,
                      timer: 3000
                    });
                  }, (err) => {
                    console.log("falla", err);
                    Swal.fire({
                      position: 'top-end',
                      icon: 'warning',
                      title: "falla " + err,
                      showConfirmButton: false,
                      timer: 3000
                    })
                  });
              }
              if (response.status == 'error') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
            },
            error => {
              //console.log(error);
            }
          )
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "motivo de cancelacion no definido",
            showConfirmButton: false,
            timer: 3000
          })

        }
      }
    })
  }

  //cancelacion
  onCancelSolicitudFactura() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea cancelar esta solicitud de factura?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        /*if (this.token_motivo_cancelacion != "") {
          this.cfdiServ.cancelSolicitudFactura(this.docsAnexos,this.tokenCFDI,this.tkn_solicitud_cfdi,this.token_motivo_cancelacion).subscribe(
            response => {
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
              //console.log(error);
            }
          )

        } else {
          var mensaje:any = "";
          if (this.token_motivo_cancelacion == "") {
            mensaje = "motivo de cancelacion no definido";
          }
          if (this.soliCfdiModelo.rfc_soli == "") {
            mensaje = "rfc es incorrecto";
          }
          if (this.soliCfdiModelo.emp_soli == "") {
            mensaje = "Información de a quien le factura es incorrecta";
          }
          if (this.soliCfdiModelo.email_referencia == "") {
            mensaje = "Email de referencia incorrecto";
          }
          if (this.soliCfdiModelo.listXmlSoli.length == 0) {
            mensaje = "Lista de facturas esta vacia";
          }
          Swal.fire({
            position:'top-end',
            icon: 'warning',
            title: mensaje,
            showConfirmButton:false,
            timer: 3000
          })
        }*/
      }
    })
  }
}
