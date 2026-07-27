import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SSICReembolsosService } from '../../../../../servicios/ssic/ssic_reembolsos.service';
import { TranslateService } from '@ngx-translate/core';
import { ComprasServService } from '../../../../../servicios/ssic/compras-serv.service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import Swal from 'sweetalert2';
import { SessionContextService } from '../../../../../servicios/session-context';
import { DomSanitizer } from '@angular/platform-browser';
import xmlFormat from 'xml-formatter';
import { UsuariosService } from '../../../../../servicios/serv_user.service';

@Component({
  selector: 'fnzs_op_detalle_factura_informative',
  standalone: false,
  templateUrl: './op-detalle-factura-informative.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/breadcrumb.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/canvas.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../finanzas.css',
    './op-detalle-factura-informative.css',
  ]
})
export class OpDetalleFacturaInformative implements OnChanges{
  public identidad: any;
  @Input() factura_token: string = '';
  @Input() factura_typo: string = '';

  public isLoading: boolean = false;
  data_compra_detalle:any = [];
  public compra_info_view: boolean = false;

  data_venta_detalle:any = [];
  public venta_info_view: boolean = false;

  data_reembolso_detalle: any = [];
  public reembolso_info_view: boolean = false;

  data_anticipo_detalle: any = [];  
  public anticipo_info_view: boolean = false;

  data_nominas_especie_detalle: any = [];  
  public nominas_especie_info_view: boolean = false;

  data_nominas_detalle: any = [];  
  public nominas_info_view: boolean = false;

  data_impuestos_sobre_nomina_detalle: any = [];  
  public impuestos_sobre_nomina_info_view: boolean = false;

  data_aportaciones_de_seguridad_social_detalle: any = [];  
  public aportaciones_de_seguridad_social_info_view: boolean = false;

  data_declaraciones_impuestos_federales_detalle: any = [];  
  public declaraciones_impuestos_federales_info_view: boolean = false;

  //html_view
  public html_type_documento: any;
  public html_view_documento: any;
  solicitudSeleccionadaDocs: string = "";
  //xml
  public code_xml: any;

  constructor(
    private reem_serv: SSICReembolsosService,
    private translate: TranslateService,
    private buyServ: ComprasServService,
    private sanitizer: DomSanitizer,
    private sessionContext: SessionContextService,
    private userServ: UsuariosService,
    private sentinela: SentinelArkManager,
    private cdRef: ChangeDetectorRef
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { factura_token, factura_typo } = changes;
    if (this.factura_token && this.factura_typo && (factura_token || factura_typo)) {
      this.resetData();
      setTimeout(() => {
        this.cargaInformacion();
      });
    }
  }

  private resetData(){
    this.data_compra_detalle = [];
    this.data_reembolso_detalle = [];
    this.data_anticipo_detalle = [];
    this.data_nominas_especie_detalle = [];
    this.data_nominas_detalle = [];
    this.data_impuestos_sobre_nomina_detalle = [];
    this.data_aportaciones_de_seguridad_social_detalle = [];
    this.data_declaraciones_impuestos_federales_detalle = [];
    this.html_type_documento = null;
    this.html_view_documento = null;
    this.code_xml = null;
  }

  private cargaInformacion(){
    const accion: Record<string, () => void> = {//Record mapea el tipo de factura
      'compras': () => this.ver_detalle_compra(),
      'ventas': () => this.ver_detalle_venta(),
      'reembolsos': () => this.ver_detalle_reembolso(),
      'anticipos': () => this.ver_detalle_anticipo(),
      'nominas_especie': () => this.ver_detalle_nominas_especie(),
      'nominas': () => this.ver_detalle_nominas(),
      'impuestos sobre nómina': () => this.ver_detalle_impuestos_sobre_nomina(),
      'aportaciones de seguridad social': () => this.ver_detalle_aportaciones_de_seguridad_social(),
      'declaraciones de impuestos federales': () => this.ver_detalle_declaraciones_impuestos_federales()
    }

    if (accion[this.factura_typo]) {
      this.isLoading = true;
      this.cdRef.detectChanges();
      accion[this.factura_typo]();
    }
  }

  private ver_detalle_compra() {
    this.compra_info_view = false;
    this.buyServ.detalleComprasAutorizadas(this.factura_token).subscribe({
      next: (resp) => {
        console.log(resp);
        if (resp.status === 'success') {
          this.data_compra_detalle = resp.compras;
          this.compra_info_view = true;
        } else {
          this.mostrarNotificacion(resp.message, 'warning');
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  private ver_detalle_venta() {
    this.venta_info_view = false;
    this.buyServ.detalleComprasAutorizadas(this.factura_token).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          console.log(resp.compras);
          this.data_venta_detalle = resp.compras;
          this.venta_info_view = true;
        } else {
          this.mostrarNotificacion(resp.message, 'warning');
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  private ver_detalle_reembolso() {
    this.reembolso_info_view = false;
    this.reem_serv.op_reembolso_detalle(this.factura_token).subscribe({
      next: (resp) => {
        console.log(resp);
        if (resp.status === 'success') {
          this.data_reembolso_detalle = resp.reem_det;
          this.reembolso_info_view = true;
        } else {
          this.mostrarNotificacion(resp.message, 'warning');
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  private ver_detalle_anticipo() {
    this.anticipo_info_view = false;
    //this.reem_serv.op_reembolso_detalle(this.factura_token).subscribe({
    //  next: (resp) => {
    //    console.log(resp);
    //    if (resp.status === 'success') {
    //      this.data_anticipo_detalle = resp.reem_det;
    //      this.anticipo_info_view = true;
    //    } else {
    //      this.mostrarNotificacion(resp.message, 'warning');
    //    }
    //    this.isLoading = false;
    //  },
    //  error: () => this.isLoading = false
    //});
  }

  private ver_detalle_nominas_especie() {
    this.nominas_especie_info_view = false;
    //this.reem_serv.op_reembolso_detalle(this.factura_token).subscribe({
    //  next: (resp) => {
    //    console.log(resp);
    //    if (resp.status === 'success') {
    //      this.data_nominas_especie_detalle = resp.reem_det;
    //      this.nominas_especie_info_view = true;
    //    } else {
    //      this.mostrarNotificacion(resp.message, 'warning');
    //    }
    //    this.isLoading = false;
    //  },
    //  error: () => this.isLoading = false
    //});
  }

  private ver_detalle_nominas() {
    this.nominas_info_view = false;
    //this.reem_serv.op_reembolso_detalle(this.factura_token).subscribe({
    //  next: (resp) => {
    //    console.log(resp);
    //    if (resp.status === 'success') {
    //      this.data_nominas_detalle = resp.reem_det;
    //      this.nominas_info_view = true;
    //    } else {
    //      this.mostrarNotificacion(resp.message, 'warning');
    //    }
    //    this.isLoading = false;
    //  },
    //  error: () => this.isLoading = false
    //});
  }

  private ver_detalle_impuestos_sobre_nomina() {
    this.impuestos_sobre_nomina_info_view = false;
    //this.reem_serv.op_reembolso_detalle(this.factura_token).subscribe({
    //  next: (resp) => {
    //    console.log(resp);
    //    if (resp.status === 'success') {
    //      this.data_impuestos_sobre_nomina_detalle = resp.reem_det;
    //      this.impuestos_sobre_nomina_info_view = true;
    //    } else {
    //      this.mostrarNotificacion(resp.message, 'warning');
    //    }
    //    this.isLoading = false;
    //  },
    //  error: () => this.isLoading = false
    //});
  }

  private ver_detalle_aportaciones_de_seguridad_social() {
    this.aportaciones_de_seguridad_social_info_view = false;
    //this.reem_serv.op_reembolso_detalle(this.factura_token).subscribe({
    //  next: (resp) => {
    //    console.log(resp);
    //    if (resp.status === 'success') {
    //      this.data_aportaciones_de_seguridad_social_detalle = resp.reem_det;
    //      this.aportaciones_de_seguridad_social_info_view = true;
    //    } else {
    //      this.mostrarNotificacion(resp.message, 'warning');
    //    }
    //    this.isLoading = false;
    //  },
    //  error: () => this.isLoading = false
    //});
  }

  private ver_detalle_declaraciones_impuestos_federales() {
    this.declaraciones_impuestos_federales_info_view = false;
    //this.reem_serv.op_reembolso_detalle(this.factura_token).subscribe({
    //  next: (resp) => {
    //    console.log(resp);
    //    if (resp.status === 'success') {
    //      this.data_declaraciones_impuestos_federales_detalle = resp.reem_det;
    //      this.declaraciones_impuestos_federales_info_view = true;
    //    } else {
    //      this.mostrarNotificacion(resp.message, 'warning');
    //    }
    //    this.isLoading = false;
    //  },
    //  error: () => this.isLoading = false
    //});
  }

  private mostrarNotificacion(msg: string, icon: any = 'success') {
    Swal.fire({
      icon,
      title: this.translate.instant(msg),
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
  
  verDocumentos(data: any) {
    this.solicitudSeleccionadaDocs = this.solicitudSeleccionadaDocs === data ? null : data;
  }

  viewDocumento(token_reem: any, token_solicitud_reem: any, event: any) {
    const conf_finanzas = this.sessionContext.empresa_data?.conf_finanzas;
    const fnzs_perm_ver_docs = conf_finanzas.reduce((item: any) => item.bool_fnzs_perm_ver_docs);
    if (fnzs_perm_ver_docs) {
      for (let a = 0; a < this.data_reembolso_detalle.length; a++) {
        const row = this.data_reembolso_detalle[a];
        if (row["token_reem"] == token_reem) {
          for (let b = 0; b < row["solicitudes_general"].length; b++) {
            const soli = row["solicitudes_general"][b];
            if (soli["token_solicitud_reem"] == token_solicitud_reem) {
              for (let c = 0; c < soli["anexos"].length; c++) {
                const doc = soli["anexos"][c];
                if (doc["token_docs"] == event.value) {
                  console.log(doc["ext_doc"])
                  this.html_type_documento = doc["ext_doc"];
                  if (doc["ext_doc"] == "pdf" || doc["ext_doc"] == "jpg" || doc["ext_doc"] == "png") {
                    this.html_view_documento = this.sanitizer.bypassSecurityTrustHtml(doc["html"]);
                  } else if (doc["ext_doc"] == "xml") {
                    this.code_xml = xmlFormat(doc["html"]);
                    //this.captureScreen();
                  }
                }
              }
            }
          }
        }
      }
    } else {
      this.alertaViewDocs();
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
}
