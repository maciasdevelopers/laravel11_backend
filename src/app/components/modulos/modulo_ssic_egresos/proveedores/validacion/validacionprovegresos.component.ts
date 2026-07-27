import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { global } from '../../../../../servicios/global_ssic';
import { InterfUmedida } from '../../../../../interfaces/interf-umedida';
import { UniMedServService } from '../../../../../servicios/uni-med-serv.service';
import { InterfPais } from '../../../../../interfaces/interf-pais';
import { PaisService } from '../../../../../servicios/ssic/pais.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { InterfMonedas } from '../../../../../interfaces/interf-monedas';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { InterfPagoForma } from '../../../../../interfaces/interf-pago-forma';
import { FormaPagoService } from '../../../../../servicios/ssic/forma-pago.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { ServEncryptService } from '../../../../../servicios/ssic/serv-encrypt.service';
import numeral from 'numeral';
import { QRCodeComponent } from 'angularx-qrcode';
// To use Html5Qrcode (more info below)
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interno-egresos-catalogos-proveedores-autorizacion',
  templateUrl: './validacionprovegresos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
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
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/telefonos.css',
    '../../egresos.css',
    './validacionprovegresos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class ValidacionProvEgresosComponent implements OnInit {
  public prov_view:boolean = false;
  list_proveedores_out:any = [];

  constructor(
    private renderer:Renderer2,
    public validator:ValidatorServService,
    public _medidasCat:UniMedServService,
    private dirServ:DireccionesService,
    public _pais:PaisService,
    public _monedasServ: MonedasService,
    public _fpago: FormaPagoService,
    private sanitizer:DomSanitizer,
    public _provServ: ProveedoresService,
    private translate:TranslateService,
    public encryptor:ServEncryptService) {
  }

  ngOnInit(): void {
    this.listaProveedores();
  }

  listaProveedores(){
    this.prov_view = false;
    this._provServ.catalogo_prov_no_autorizados().subscribe(
      response => {
        this.prov_view = true;
          if (response.status == 'success') {
            console.log(response);
            this.list_proveedores_out = response.listado;
          }
      },
      error => {
        console.log(error);
      }
    );
  }

  validarProveedor(token_proveedor:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._provServ.validarProveedor(token_proveedor).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
              this.listaProveedores();
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

      }
    });
  }

}
