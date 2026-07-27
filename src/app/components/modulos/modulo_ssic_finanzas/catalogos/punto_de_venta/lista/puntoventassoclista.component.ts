import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { PuntoVentaService } from '../../../../../../servicios/punto-venta.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './puntoventassoclista.component.html',
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
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/parallax.css',
    './puntoventassoclista.component.css']
})
export class PuntoVentaListaComponent implements OnInit {
  public usuario:Usuarios;
  puntoVentaListaTrue:any = [];
  puntoVentaListaFalse:any = [];
  @ViewChild('listpVentaTable') table_pv!: Table;

  constructor(
    private monedasServ:MonedasService,
    private renderer:Renderer2,
    private pvserv:PuntoVentaService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private servXlsx:DescargaExcel,
    private encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.catalogo_puntos_de_venta_true();
    this.catalogo_puntos_de_venta_false();
  }

  catalogo_puntos_de_venta_true(){
    this.pvserv.catalogoPuntoDeVenta().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.puntoVentaListaTrue = response.catalogo;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  descarga_excel_pventa(){ 
    const columnas:ExcelColumnas[] = [
      {label: "folio", field: "folio_puntodeventa", align: "center"},
      {label: "alias", field: "pv_alias", align: "left"},
      {label: "Establecimiento", field: "pv_direccion", align: "center"},
      {label: "Responsable", field: "pv_responsable", align: "center"},
      {label: this.translate.instant("observ"), field: "pv_observaciones", align: "left"}
    ];
    this.servXlsx.descarga_xlsx_documento(this.puntoVentaListaTrue,columnas,'Punto de venta','catálogo de puntos de venta.xlsx');
  }

  catalogo_puntos_de_venta_false(){
    this.pvserv.catalogoPuntoVentaEliminadosAsociados().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.puntoVentaListaFalse = response.catalogo;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  actualizaPuntoVenta(token_puntodeventa:any,pv_alias:any,pv_tipo:any,pv_tasa_tarifa:any,pv_importe:any):void{
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
        this.pvserv.actualizarPuntoVentaAsociados(token_puntodeventa,pv_alias,pv_tipo,pv_tasa_tarifa,pv_importe).subscribe(
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
              this.catalogo_puntos_de_venta_true();
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
    });
  }

  eliminaPuntoVenta(token_puntodeventa:any){
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
        this.pvserv.papeleraSavePuntoVentaAsociados(token_puntodeventa).subscribe(
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
              this.catalogo_puntos_de_venta_true();
              this.catalogo_puntos_de_venta_false();
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
    });
  }

  restauraPuntoVenta(token_puntodeventa:any){
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
        this.pvserv.restaurarPuntoVentaAsociados(token_puntodeventa).subscribe(
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
              this.catalogo_puntos_de_venta_true();
              this.catalogo_puntos_de_venta_false();
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
    });
  }

  eliminaPermPuntoVenta(token_puntodeventa:any){
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
        this.pvserv.eliminarPermPuntoVentaAsociados(token_puntodeventa).subscribe(
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
              this.catalogo_puntos_de_venta_true();
              this.catalogo_puntos_de_venta_false();
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
    });
  }
}
