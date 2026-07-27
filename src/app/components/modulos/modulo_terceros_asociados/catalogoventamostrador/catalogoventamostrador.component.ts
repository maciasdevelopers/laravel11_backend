import { Component, OnInit } from '@angular/core';
import { VentasServService } from '../../../../servicios/ssic/ventas-serv.service';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { ToWords } from 'to-words';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../servicios/sentinel-ark-manager';

const toWords = new ToWords({
  localeCode: 'es-MX',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Peso',
      plural: 'Pesos',
      symbol: '$',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
        symbol: '',
      },
    },
  },
});

const toIngles = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Peso',
      plural: 'Pesos',
      symbol: '$',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
        symbol: '',
      },
    },
  },
});

@Component({
  selector: 'app-catalogoventamostrador',
  templateUrl: './catalogoventamostrador.component.html',
  standalone:false,
  styleUrls: [
    './catalogoventamostrador.component.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/loading.css',
    '../../../../styles/landing.css',
    '../../../../styles/navegador.css',
    '../../../../styles/colores.css',
    '../../../../styles/parallax.css',
    '../../../../styles/div_explain.css',
    '../../../../styles/switches.css',
  ]
})
export class CatalogoVentasMostradorComponent implements OnInit {
  public identidad: any;
  public usuario: Usuarios;

  catalogoVentasTrue:any = [];
  public view_true_ventas:boolean = false;
  catalogoVentasFalse:any = [];
  public view_cancel_ventas:boolean = false;
  catalogoVentasDetail:any = [];

  constructor(
    private _ventServ: VentasServService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private sentinela: SentinelArkManager
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.listarVentasMostrador();
    this.listarVentasMostradorCanceladas();
  }

  abreventana_modal(modal_ident:any){
    $(modal_ident).modal('show');
  }

  listarVentasMostrador(){
    this.view_true_ventas = false;
    this._ventServ.ventaMostradorCatalogo().subscribe(
      response => {
        this.view_true_ventas = true;
        if (response.status == 'success') {
          this.catalogoVentasTrue = response.datosVenta;
          console.log(this.catalogoVentasTrue);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verDetalleVenta(token_ventas:any){
    this._ventServ.ventaMostradorDetalleInside(token_ventas).subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogoVentasDetail = response.dataVenta;
          console.log(this.catalogoVentasDetail);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  writeMotivosCancelacion(event:any,posicion:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.catalogoVentasTrue[posicion]["razon_cancelar"] = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.catalogoVentasTrue[posicion]["razon_cancelar"] = "";
      this.validator.errorInputRow(event);
    }
    console.log(posicion+" "+this.catalogoVentasTrue[posicion]["razon_cancelar"]);
  }

  cancelarVenta(token_ventas:any,razon_cancelar:any){
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
        this._ventServ.ventaMostradorCancelar(token_ventas,razon_cancelar).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
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

              this.listarVentasMostrador();
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
        );
      }
    });
  }

  listarVentasMostradorCanceladas(){
    this.view_cancel_ventas = false;
    this._ventServ.ventaMostradorCanceladasCatalogo().subscribe(
      response => {
        this.view_cancel_ventas = true;
        if (response.status == 'success') {
          this.catalogoVentasFalse = response.datosVenta;
          console.log(this.catalogoVentasFalse);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
