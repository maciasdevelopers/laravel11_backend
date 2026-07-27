import { Component, OnInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input } from "@angular/core";
import { Usuarios } from "../../../../../../modelos/Usuarios.js";
import { SentinelArkManager } from "../../../../../../servicios/sentinel-ark-manager.js";
import { UsuariosService } from "../../../../../../servicios/serv_user.service";
import { SSICReembolsosService } from "../../../../../../servicios/ssic/ssic_reembolsos.service";
import { EmpresasServService } from '../../../../../../servicios/ssic/empresas-serv.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from "../../../../../../servicios/ssic/serv-encrypt.service";
import { FormaPagoService } from "../../../../../../servicios/ssic/forma-pago.service";
import { InterfPagoForma } from "../../../../../../interfaces/interf-pago-forma";
import { MetodoPagoServService } from '../../../../../../servicios/ssic/metodo-pago-serv.service';
import { InterfMetodoPago } from '../../../../../../interfaces/interf-metodo-pago';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { TranslateService } from '@ngx-translate/core';

import Swal from "sweetalert2";
import { Router, ActivatedRoute } from '@angular/router';
declare var zxcvbn: any;
import { HttpCancelService } from '../../../../../../servicios/ssic/http-cancel.service';
import '../../../../../../../assets/js/zxcvbn.js';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { DomSanitizer } from "@angular/platform-browser";
import { ServNavSuperiorService } from "../../../../../../servicios/ssic/serv-nav-superior.service";
import { global } from "../../../../../../servicios/global_ssic";
import xmlFormat from 'xml-formatter';
import { EmpleadosService } from "../../../../../../servicios/ssic/empleados.service";
import { interval } from "rxjs";
import { SessionContextService } from "../../../../../../servicios/session-context.js";

@Component({
  selector: 'app-vh-reembolsos',
  templateUrl: './det-reembolsos.component.html',
  standalone: false,
  styleUrls: [
    './det-reembolsos.component.css',
    '../../../vhumano.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/file_input.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/modalFixed.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/breadcrumb.css',
  ]
})
export class VHumReemDetComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  public tokenReembolso: any;
  public min_date: string;
  public max_date: string;

  searchReem: any;
  pageReem: number = 1;

  arraYFormaPago: InterfPagoForma[] = [];
  arraYMetodoPago: InterfMetodoPago[] = [];

  public vhum_privilegio_consulta: boolean = false;
  public vhum_privilegio_crear: boolean = false;
  public vhum_privilegio_editar: boolean = false;
  public vhum_privilegio_elimina: boolean = false;
  public vhum_privilegio_ver_docs: boolean = false;

  //reembolsos
  public filesReem: NgxFileDropEntry[] = [];
  public docsReemAnexos: any = [];
  arrayReembolsosDetalle: any = [];
  solicitudSeleccionadaDocs: string = "";
  solicitudSeleccionadaHistorial: string = "";
  public folio_reem: string;
  public html_view_documento: any;
  public name_view_documento: string = "";
  public html_type_documento: string = "";
  public reem_validate_to_save: boolean;
  public reem_observacion: string;
  arrayreembolsosSave: any = [];

  //proveedores
  arrayProveedores: any = [];

  constructor(
    private navSupServ: ServNavSuperiorService,
    private routerr: Router,
    private _provServ: ProveedoresService,
    private sentinela: SentinelArkManager,
    private reem_serv: SSICReembolsosService,
    private translate: TranslateService,
    private sessionContext: SessionContextService,
    private validator: ValidatorServService,
    private act_rute: ActivatedRoute,
    private userServ: UsuariosService,
    private sanitizer: DomSanitizer
  ) {
    this.tokenReembolso = "";
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");

    this.min_date = "";
    this.max_date = "";

    this.identidad = this.sentinela.getIdentifUsuario();
    this.folio_reem = "";

    //reembolsos
    this.reem_validate_to_save = false;
    this.reem_observacion = "";
  }

  ngOnInit(): void {
    this.tokenReembolso = this.act_rute.snapshot.paramMap.get("tknReem");
    if (this.identidad.vhum_privilegio_consulta == true) {
      this.navSupServ.acceso_vhum_reembolsos().subscribe(
        response => {
          if (response.status == 'success') {
            var token_superadmin = "ZnRNZzFSSUQ1OE1VM0hYNkxZTjEyQT09OjoxMjM0NTY3ODEyMzQ1Njc4";
            var token_admin_sos = "WXJpMDJObHVlL1pYSS81RCttUk5SUGx6UWl1NjEvVG1YSlR1Y1puYWk5RFk1T3d3VjFMRExZN3hOTlBxcGE0U3p1ZUM2UTRHVWp4UkFuR241aUxKbHdLU1JLZmFMeXpvK1p3WmZRemkyendCZGY1M0UwM0h2OGhyclRDMytMMnJRRENUUXB4RlRpOWpZeEVpYVR6Nis4b01VaXV0WHpVZ3JzWGg1Q3pGa3lzY0E1VGE2MzM2TjdGU1U0azMvMXFwTVM3YmJMM3p3QTdvYlAxQ3FjUDJVWlRyd09xYWJhUFBLRm1BdXpaVVpXc1Z0UUcxVWtJNDVVTjBjcE1Lb2hIRGpMT2NjYTlNMEtyUW01ZkQ2ckEyWWJTaThxNTZYQkFVTGJVakFVWDFPdVk9OjoxMjM0NTY3ODEyMzQ1Njc4";
            if (this.identidad['user_token'] == token_superadmin || this.identidad['user_token'] == token_admin_sos || response.acceso_reembolsos == true) {
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
              this.cambia_permisos();
            } else {
              global.url_denegado_name = "reembolsos (valor humano)";
              global.url_denegado_link = "sos_inside/valor_humano/reembolsos";
              global.home_link = "/sos_inside/home";
              this.routerr.navigate(['./plataformas/permission_denied']);
            }
          }
        },
        error => {
          console.log(error);
        }
      );

      this.lista_proveedores();
      this.reembolsos_detalle(this.tokenReembolso);
      const contadorReloj = interval(1000);
      contadorReloj.subscribe((n: any) => {
        if (localStorage.getItem('module_working') == "bEIxeFFKY2k4RnFEbWtnWDE5c1dKMGN5TFUwSW5EY0pTditvM3drV3FzTnFCZVhZN3A5aDREM3ZLRHF1YjFGUmNhY1pacDJDS3JsTm9RSXF6SkVTS2c9PTo6MTIzNDU2NzgxMjM0NTY3OA==") {
          this.cambia_permisos();
        }
      });
    } else {
      this.routerr.navigate(['./sos_inside/valor_humano/reembolsos']);
    }
  }

  listen() {
    //const messaging = getMessaging();
    //onMessage(messaging, (payload) => {
    //  this.lista_proveedores();
    //  this.cambia_permisos();
    //  this.reembolsos_detalle(this.tokenReembolso);
    //});
  }

  private async cambia_permisos() {
    this.identidad = this.sentinela.getIdentifUsuario();
    if (this.vhum_privilegio_consulta != this.identidad.vhum_privilegio_consulta) {
      this.vhum_privilegio_consulta = this.identidad.vhum_privilegio_consulta;
    }

    if (this.vhum_privilegio_crear != this.identidad.vhum_privilegio_crear) {
      this.vhum_privilegio_crear = this.identidad.vhum_privilegio_crear;
    }

    if (this.vhum_privilegio_editar != this.identidad.vhum_privilegio_editar) {
      this.vhum_privilegio_editar = this.identidad.vhum_privilegio_editar;
    }

    if (this.vhum_privilegio_elimina != this.identidad.vhum_privilegio_elimina) {
      this.vhum_privilegio_elimina = this.identidad.vhum_privilegio_elimina;
    }

    if (this.vhum_privilegio_ver_docs != this.identidad.vhum_privilegio_ver_docs) {
      this.vhum_privilegio_ver_docs = this.identidad.vhum_privilegio_ver_docs;
    }
  }

  cerrarModal(modal: any) {
    $(modal).removeClass("open");
  }

  lista_proveedores() {
    this._provServ.catalogoProveedoresForProcesos().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.arrayProveedores = response.proveedores;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //reembolsos
  reembolsos_detalle(tokenReembolso: any) {
    this.reem_serv.reembolso_vh_detalle(tokenReembolso).subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.arrayReembolsosDetalle = response.reem_det;
          this.folio_reem = this.arrayReembolsosDetalle[0]["folio_reem"];
          this.arrayReembolsosDetalle[0]["soliReemPag"] = this.arrayReembolsosDetalle[0]["soliReem"].slice(0, 10);
          console.log(this.arrayReembolsosDetalle);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verDocumentos(row: any) {
    this.solicitudSeleccionadaDocs = this.solicitudSeleccionadaDocs === row ? null : row;
  }

  verHistorial(row: any) {
    this.solicitudSeleccionadaHistorial = this.solicitudSeleccionadaHistorial === row ? null : row;
  }

  reemOnPageChange(event: any) {
    const first = event.first;
    const rows = event.rows;
    this.arrayReembolsosDetalle[0]["soliReemPag"] = this.arrayReembolsosDetalle[0]["soliReem"].slice(first, first + rows);
    console.log(this.arrayReembolsosDetalle);
  }

  modalDocumento(posicion: any) {
    this.docsReemAnexos = this.arrayReembolsosDetalle[0]["soliReem"][posicion]["anexos"];
    if (this.arrayReembolsosDetalle[0]["soliReem"][posicion]["anexos"].length == 1) {
      var html_doc = this.arrayReembolsosDetalle[0]["soliReem"][posicion]["anexos"][0]["html"];
      this.html_view_documento = this.sanitizer.bypassSecurityTrustHtml(html_doc);
      this.name_view_documento = this.arrayReembolsosDetalle[0]["soliReem"][posicion]["anexos"][0]["name_documento"];
    }
  }

  alertaViewDocs() {
    Swal.fire({
      timer: 3000,
      position: "center",
      icon: "info",
      title: this.translate.instant("perm_vdfiles"),
      text: this.translate.instant("perm_denied"),
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("perm_solicita"),
      showCancelButton: true,
      cancelButtonText: this.translate.instant("swal_cancel"),
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        const empresaToken = this.sessionContext.empresa_data?.empresa_token;
        this.userServ.user_solicitar_permiso_ver_docs(empresaToken, this.identidad.user_token, "vhum").subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  viewDocumento(token_reem: any, token_solicitud_reem: any, token_docs: any) {
    if (this.vhum_privilegio_ver_docs == true) {
      for (let a = 0; a < this.arrayReembolsosDetalle.length; a++) {
        const row = this.arrayReembolsosDetalle[a];
        if (row["token_reem"] == token_reem) {
          for (let b = 0; b < row["soliReem"].length; b++) {
            const soli = row["soliReem"][b];
            if (soli["token_solicitud_reem"] == token_solicitud_reem) {
              for (let c = 0; c < soli["anexos"].length; c++) {
                const doc = soli["anexos"][c];
                if (doc["token_docs"] == token_docs) {
                  console.log(doc["ext_doc"])
                  this.name_view_documento = doc["name_documento"];
                  this.html_type_documento = doc["ext_doc"];
                  if (doc["ext_doc"] == "pdf" || doc["ext_doc"] == "jpg" || doc["ext_doc"] == "png") {
                    this.html_view_documento = this.sanitizer.bypassSecurityTrustHtml(doc["html"]);
                  } else if (doc["ext_doc"] == "xml") {
                    this.html_view_documento = xmlFormat(doc["html"]);
                  }
                }
              }
            }
          }
        }
      };
    } else {
      this.alertaViewDocs();
    }
  }

  keyupObservaReem(event: any, posicion: any) {
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.arrayReembolsosDetalle[0]["soliReem"][posicion]["comments_auth_vh_write"] = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.arrayReembolsosDetalle[0]["soliReem"][posicion]["comments_auth_vh_write"] = "";
      this.validator.errorInputRow(event);
    }
    console.log(this.arrayReembolsosDetalle[0]["soliReem"][posicion]["comments_auth_vh_write"]);
    console.log(this.arrayReembolsosDetalle);
  }

  authorizarReem(token_solicitud_reem: any, autorizacion_vh: any, observaciones: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonText: this.translate.instant("swal_cancel"),
      cancelButtonColor: '#D32F2F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reem_serv.reembolso_vh_auth(this.tokenReembolso, token_solicitud_reem, autorizacion_vh, observaciones).subscribe(
          response => {
            if (response.status == 'success') {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.reembolsos_detalle(this.tokenReembolso);
                setTimeout(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
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
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    })
  }
}
