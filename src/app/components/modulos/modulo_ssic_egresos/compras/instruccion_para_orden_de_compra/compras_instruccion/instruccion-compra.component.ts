import { Component,OnInit,OnDestroy,ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { DomSanitizer } from '@angular/platform-browser';
import { UsuariosService } from '../../../../../../servicios/serv_user.service';
import { ServNavSuperiorService } from '../../../../../../servicios/ssic/serv-nav-superior.service';
import { HttpCancelService } from '../../../../../../servicios/ssic/http-cancel.service';
import { CotizacionesService } from '../../../../../../servicios/ssic/cotizaciones.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ProductosService } from '../../../../../../servicios/ssic/productos.service';
import { CFDIService } from '../../../../../../servicios/xml/cfdi.service';
import { ComprasServService } from '../../../../../../servicios/ssic/compras-serv.service';
import { SeriesService } from '../../../../../../servicios/ssic/series-service.service';
import { LotesServService } from '../../../../../../servicios/ssic/lotes-serv.service';
import { PedimentosService } from '../../../../../../servicios/ssic/pedimentos-serv.service';
import { FormaPagoService } from '../../../../../../servicios/ssic/forma-pago.service';
import { MetodoPagoServService } from '../../../../../../servicios/ssic/metodo-pago-serv.service';
import { ActFijosService } from '../../../../../../servicios/ssic/act-fijos.service';
import { ActIntangiblesService } from '../../../../../../servicios/ssic/act-intangibles.service';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { SessionContextService } from '../../../../../../servicios/session-context';

@Component({
  selector: 'app_interno_egresos_compras_instruccion',
  standalone: false,
  templateUrl: './instruccion-compra.component.html',
  styleUrls: [
    '../../../../../../styles/explain.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/pushpin.css',
    '../../../../../../styles/collection.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/switches.css',
    '../../../egresos.css',
    './instruccion-compra.component.css',
  ],
})
export class InstruccionCompraComponent implements OnInit{
  public identidad: any;
  lista_cotizaciones_auth:any = [];
  cotizacion_selected:any = [];
  public view_lista_cotizaciones:boolean = false;
  contactoSeleccionadoPhone:string = "";
  contactoSeleccionadoEmails:string = "";
  nuevo_contacto_form:any = [{"paterno":"","materno":"","nombre":"","area":"","cargo":"","emails":"","telefonos":""}]; 

  constructor(
    private _provServ: ProveedoresService,
    private _cotService: CotizacionesService,
    private sentinela: SentinelArkManager,
    private translate:TranslateService,
    private sessionContext: SessionContextService) {
      this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.cotizaciones_lista();
  }

  get permiso_consulta() {
    return this.sessionContext.privilegio_consulta;
  }
  
  cerrarModal(modal:any){
    $(modal).removeClass("open");
  }

  cotizaciones_lista(){
    this.view_lista_cotizaciones = false;
    this._cotService.cotizaciones_autorizadas().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.view_lista_cotizaciones = true;
          this.lista_cotizaciones_auth = response.lista_cotizaciones;
          console.log(this.lista_cotizaciones_auth);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cotizacion_seleccionar(requisicion_tkn:any,cotizacion_tkn:any,coti_token_detalle_cotizacion:any,coti_token_desc_detalle_cotiza:any){
    this.cotizacion_selected = [];
    for (let a = 0; a < this.lista_cotizaciones_auth.length; a++) {
      const row = this.lista_cotizaciones_auth[a];
      if (row["requisicion_tkn"] == requisicion_tkn && row["cotizacion_tkn"] == cotizacion_tkn && row["coti_token_detalle_cotizacion"] == coti_token_detalle_cotizacion && row["coti_token_desc_detalle_cotiza"] == coti_token_desc_detalle_cotiza) {
        this._provServ.verDetalleProveedor(row["token_cat_proveedores"]).subscribe(
          response => {
            if (response.status == 'success') {
              console.log(response);
              row["proveedor_data"] = response.proveedor;
              console.log(row["proveedor_data"]);
            }
          },
          error => {
            console.log(error);
          }
        )
        this.cotizacion_selected.push(row);
        console.log(this.cotizacion_selected);
      }
    }
  }

  decideocupaContacto(event:any){
    event.checked == true ? $("#decideinfocontacto").removeClass("noneView") : $("#decideinfocontacto").addClass("noneView");
  }

  verEmails(contacto:any) {
    this.contactoSeleccionadoEmails = this.contactoSeleccionadoEmails === contacto ? null : contacto;
  }

  verTelefonos(contacto:any) {
    this.contactoSeleccionadoPhone = this.contactoSeleccionadoPhone === contacto ? null : contacto;
  }

  aceptaCreditoProv(event:any){
    event.checked == true ? $("#decidecredito").removeClass("noneView") : $("#decidecredito").addClass("noneView");
  }

  tieneFormaPagoProv(event:any){
    event.checked == true ? $("#decideformapagoDetail").removeClass("noneView") : $("#decideformapagoDetail").addClass("noneView");
  }

  cotizacion_confirmar_contactoProv(cotizacion_tkn:any,coti_token_detalle_cotizacion:any,coti_token_desc_detalle_cotiza:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._cotService.cotizacion_confirmar_contactoProv(cotizacion_tkn,coti_token_detalle_cotizacion,coti_token_desc_detalle_cotiza).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              this.cotizaciones_lista();
              setTimeout(function(){
                Swal.fire({
                  position:"center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          }, error => {console.log(error);}
        );
      }
    });
  }

  viewDocumentoLink(event:any){
    window.open(event, '_blank');
  }
}
