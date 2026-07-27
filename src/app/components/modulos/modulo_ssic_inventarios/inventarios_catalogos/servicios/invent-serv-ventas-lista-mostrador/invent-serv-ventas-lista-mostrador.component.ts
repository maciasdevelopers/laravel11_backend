import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ServiciosService } from '../../../../../../servicios/ssic/servicios.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';

@Component({
  selector: 'app-invent-serv-mostrador-ventas-lista',
  templateUrl: './invent-serv-ventas-lista-mostrador.component.html',
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
    './invent-serv-ventas-lista-mostrador.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class InventServVentasMostradorListaComponent implements OnInit {
  //buscadores
  public usuario: Usuarios;
  buscarServTrueMostrador:any;
  listaServTrueMostrador:any = [];

  constructor(private translate:TranslateService,private relInterna:ComunicacionInternaService,public _servicioServ:ServiciosService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.listaServiciosMostrador();
    this.buscarServTrueMostrador = [			
      'token_cat_servicios',
      'folio_sistema',
      'servicio',
      'authorized',
      'authorized_fecha',
      'utilizado'
    ];
  }

  listaServiciosMostrador(){
    this._servicioServ.InventariosCatalogosMostradorCatalogoServ().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaServTrueMostrador = response.datosServicio;
          console.log(this.listaServTrueMostrador);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  verServicioMostrador(token_cat_servicios:any){
    this.relInterna.mensajeVerServMostrador("ver servicio",token_cat_servicios);
  }
  
  solicita_auth_servicio(token_cat_servicios:any){
    console.log(token_cat_servicios);
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
        this._servicioServ.solicitarValidateServicio(token_cat_servicios).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
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
        //alert(dattknprod);
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
              });
              this.listaServiciosMostrador();
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
