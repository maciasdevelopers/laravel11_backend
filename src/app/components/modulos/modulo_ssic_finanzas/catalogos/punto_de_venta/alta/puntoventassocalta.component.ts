import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';

import { InterfPais } from '../../../../../../interfaces/interf-pais';
import { PaisService } from '../../../../../../servicios/ssic/pais.service';
import { PuntoVentaService } from '../../../../../../servicios/punto-venta.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';

import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-nuevo-punto-venta-finanzas',
  templateUrl: './puntoventassocalta.component.html',
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
  './puntoventassocalta.component.css']
})
export class PuntoVentaAltaComponent implements OnInit {
  pageAltaEstabPostal:number = 1;
  declare Instascan: any;
  options = {};
  public usuario: Usuarios;

  public puntoVenta_alias:string = "";
  public puntoVenta_nombre:string = "";
  public puntoVenta_responsable:string = "";
  public puntoVenta_observaciones:string = "";
  public validateToRegistro:boolean = false;

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    public validator:ValidatorServService,
    public encryptor:ServEncryptService,
    private translate:TranslateService,
    public pvserv:PuntoVentaService,
    public _pais:PaisService,
    public _personal:EmpleadosService) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {}

  onKeyPressAlfa(e:KeyboardEvent) {
    this.validator.key_press_alfa(e);
  }

  keyupPuntoVentaAlias(event:any){
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.puntoVenta_alias = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.puntoVenta_alias = "";
      this.validator.errorInputRow(event);
    }
    this.validarRegistroPV();
  }

  keyupPuntoVentaNombre(event:any){
    if (event.value != "" && this.validator.filtroDom(event.value) == true) {
      this.puntoVenta_nombre = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.puntoVenta_nombre = "";
      this.validator.errorInputRow(event);
    }
    this.validarRegistroPV();
  }

  keyupPuntoVentaResponsable(event:any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.puntoVenta_responsable = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.puntoVenta_responsable = '';
      this.validator.errorInputRow(event);
    }
    this.validarRegistroPV();
  }

  keyupPuntoVentaObservaciones(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.puntoVenta_observaciones = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.puntoVenta_observaciones = "";
      this.validator.errorInputRow(event);
    }
    this.validarRegistroPV();
  }

  validarRegistroPV(){
    if ((this.puntoVenta_alias != "" && this.validator.filtroAlfaNumerico(this.puntoVenta_alias) == true) &&
      (this.puntoVenta_nombre != "" && this.validator.filtroDom(this.puntoVenta_nombre) == true) &&
      (this.puntoVenta_responsable != "" && this.validator.filtroAlfaNumerico(this.puntoVenta_responsable) == true) &&
      (this.puntoVenta_observaciones != "" && this.validator.strFilter(this.puntoVenta_observaciones) == true && this.puntoVenta_observaciones.length >= 4)) {
      this.validateToRegistro = true;
    } else {
      this.validateToRegistro = false;
    }
  }

  registrarPuntoVenta(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Deseas registrar este punto de venta?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.pvserv.newPuntoVentaAsociados(
          this.puntoVenta_alias, 
          this.puntoVenta_nombre,
          this.puntoVenta_responsable,
          this.puntoVenta_observaciones).subscribe(
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
              });
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
