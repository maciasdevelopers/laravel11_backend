import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ServiciosService } from '../../../../../../servicios/ssic/servicios.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
@Component({
  selector: 'app-invent-serv-compras-lista',
  templateUrl: './invent-serv-compras-lista.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
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
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/colores.css',
    '../../../inventarios.css',
    './invent-serv-compras-lista.component.css'
  ],
})
export class InventServComprasListaComponent implements OnInit {
  public usuario: Usuarios;
  listaServiciosComprasTrue:any = [];

  constructor(private translate:TranslateService,private relInterna:ComunicacionInternaService,public _servicioServ:ServiciosService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.listaServicios();
  }

  listaServicios(){
    this._servicioServ.servEgresosCompras().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaServiciosComprasTrue = response.datosServicio;
          console.log(this.listaServiciosComprasTrue);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //mensajeVerServCompras(mensaje:any,cat_servicios:any){
  //  this.respuestaVerServCompras.next(mensaje);
  //  this.respuestaVerServToken.next(cat_servicios);
  //  private respuestaVerServToken = new Subject<string>();
  //  token_cat_servicios$ = this.respuestaVerServToken.asObservable();
  //}

  verServicioCompras(token_cat_servicios:any){
    this.relInterna.mensajeVerServCompras("ver servicio",token_cat_servicios);
  }

  funcDeleteServEgr(token_cat_servicios:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este servicio?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._servicioServ.moveToPapServEgresos(token_cat_servicios).subscribe(
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
              this.listaServicios();
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
}
