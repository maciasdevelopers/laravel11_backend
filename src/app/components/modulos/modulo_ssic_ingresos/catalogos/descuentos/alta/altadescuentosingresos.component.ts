import { Component,OnInit, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { descuentosAngularModelo } from '../../../../../../modelos/descuentosAngularModelo';
import { DescuentosService } from '../../../../../../servicios/ssic/descuentos.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';

@Component({
  selector: 'app-interno-ingresos-catalogos',
  templateUrl: './altadescuentosingresos.component.html',
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
    '../../../../../../styles/colores.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/landing.css',
    '../../../ingresos.css',
    './altadescuentosingresos.component.css']
})

export class AltaDescuentosIngresosComponent implements OnInit {
  options = {};
  public descuentosModelo: descuentosAngularModelo;
  public boolRegistro:boolean = false;
  public usuario: Usuarios;

  @ViewChild('buscaClaveSat') buscaClaveSat: ElementRef = {} as ElementRef;

  constructor(
    private renderer: Renderer2,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private _descServ: DescuentosService) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.descuentosModelo = new descuentosAngularModelo('','','','','','','');
    }

  ngOnInit(): void {}

  aliasServDesc(event:any){
    if (event.value != '' && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.validator.correctoInputRow(event);
      this.descuentosModelo.alias = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.descuentosModelo.alias = '';
    }
    this.validaRegistro();
  }

  conceptoServDesc(event:any){
    if (event.value != '' && this.validator.strFilter(event.value) == true && event.value.length >= 5) {
      this.descuentosModelo.concepto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
      this.descuentosModelo.concepto = '';
    }
    this.validaRegistro();
  }

  cuotaPorcServDesc(event:any){
    console.log(event.value);
    if (event.value != '' && this.validator.strFilter(event.value) == true) {
      this.validator.correctoSelectRow(event);
      this.descuentosModelo.aplicacion = event.value;
    } else {
      this.validator.errorSelectRow(event);
      this.descuentosModelo.aplicacion = '';
    }
    this.validaRegistro();
  }

  cantidadBaseKeyUp(event:any){
    const valida_aplicacion = (this.descuentosModelo.aplicacion == 'cuota' && this.validator.filtroCosto(event.value) == true) || (this.descuentosModelo.aplicacion == 'porcentaje' && this.validator.filtroPorcentaje(event.value) == true); 
    if (event.value != '' && valida_aplicacion) {
      this.validator.correctoInputRow(event);
      this.descuentosModelo.monto = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.descuentosModelo.monto = '';
    }
    this.validaRegistro();
  }

  tipoDescuentoServDesc(event:any){
    if (event.value != '' && this.validator.strFilter(event.value) == true) {
      this.validator.correctoSelectRow(event);
      this.descuentosModelo.tipo = event.value;
    } else {
      this.validator.errorSelectRow(event);
      this.descuentosModelo.tipo = '';
    }
    this.validaRegistro();
    /*fechaInicio.value = '';
    fechaFin.value = '';
    if (tipoDescuento.value === 'eventual' || !strFilter.test(tipoDescuento.value)) {
      $(fechaInicio).attr("disabled",true);
      $(fechaFin).attr("disabled",true);
      $(btnRegistro).removeAttr('disabled');
    } else if(tipoDescuento.value === 'pIndeterminado' || !strFilter.test(tipoDescuento.value)){
      $(fechaInicio).removeAttr("disabled");
      $(fechaFin).attr("disabled",true);
      $(btnRegistro).attr("disabled",true);
    } else if(tipoDescuento.value === 'pDeterminado' || !strFilter.test(tipoDescuento.value)){
      $(fechaInicio).removeAttr("disabled");
      $(fechaFin).attr("disabled",true);
      $(btnRegistro).attr("disabled",true);
    }*/
  }

  fechaInicioServDesc(event:any){
    if (event.value != '' && this.validator.filtroFecha(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.descuentosModelo.fecha_inicia = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.descuentosModelo.fecha_inicia = '';
      /*fechaInicio.classList.remove("error");
      if (tipoDescuento.value === 'eventual' || !strFilter.test(tipoDescuento.value)) {
          $(fechaInicio).attr("disabled",true);
          fechaInicio.value = '';
          $(btnRegistro).removeAttr('disabled');
      } else if(tipoDescuento.value === 'pIndeterminado' || !strFilter.test(tipoDescuento.value)){
          $(fechaFin).attr("disabled",true);
          $(btnRegistro).removeAttr('disabled');
      } else if(tipoDescuento.value === 'pDeterminado' || !strFilter.test(tipoDescuento.value)){
          $(fechaFin).removeAttr("disabled");
          $(btnRegistro).attr("disabled",true);
      }*/
    }
    this.validaRegistro();
  }

  fechaFinServDesc(event:any){
    if (event.value != '' && this.validator.filtroFecha(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.descuentosModelo.fecha_termina = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.descuentosModelo.fecha_termina = '';
      /*if (tipoDescuento.value === 'eventual' || !strFilter.test(tipoDescuento.value)) {
          $(fechaFin).attr("disabled",true);
          fechaFin.value = '';
          $(btnRegistro).removeAttr('disabled');
      } else if(tipoDescuento.value === 'pIndeterminado' || !strFilter.test(tipoDescuento.value)){
          $(fechaFin).attr("disabled",true);
          fechaFin.value = '';
          $(btnRegistro).removeAttr('disabled');
      } else if(tipoDescuento.value === 'pDeterminado' || !strFilter.test(tipoDescuento.value)){
          $(btnRegistro).removeAttr('disabled');
      }*/
    }
    this.validaRegistro();
  }

  validaRegistro(){
    const valido_alias = this.descuentosModelo.alias != '' && this.validator.strFilter(this.descuentosModelo.alias) == true && this.descuentosModelo.alias.length >= 4;
    const valido_concepto = this.descuentosModelo.concepto != '' && this.validator.strFilter(this.descuentosModelo.concepto) == true && this.descuentosModelo.concepto.length >= 5;
    const valido_aplicacion = this.descuentosModelo.aplicacion != '' && this.validator.strFilter(this.descuentosModelo.aplicacion) == true;
    const valido_monto = this.descuentosModelo.monto != '' && (
      (this.descuentosModelo.aplicacion == 'cuota' && this.validator.filtroCosto(this.descuentosModelo.monto) == true) || 
      (this.descuentosModelo.aplicacion == 'porcentaje' && this.validator.filtroPorcentaje(this.descuentosModelo.monto) == true)
    );
    const valido_tipo = this.descuentosModelo.tipo != '' && this.validator.strFilter(this.descuentosModelo.tipo) == true; 
    const valido_fecha_inicia = this.descuentosModelo.fecha_inicia != '' && this.validator.filtroFecha(this.descuentosModelo.fecha_inicia) == true;
    const valido_fecha_termina = this.descuentosModelo.fecha_termina != '' && this.validator.filtroFecha(this.descuentosModelo.fecha_termina) == true;
    const valido_pIndeterminado = this.descuentosModelo.tipo == 'pIndeterminado' && valido_fecha_inicia;
    const valido_pDeterminado = this.descuentosModelo.tipo == 'pDeterminado' && valido_fecha_inicia && valido_fecha_termina;
    //boolRegistro validaRegistro
    this.boolRegistro = valido_alias && valido_concepto && valido_aplicacion && valido_monto && valido_tipo && (this.descuentosModelo.tipo == 'eventual' || valido_pIndeterminado || valido_pDeterminado);
  }

  guardaDescuentoEnArray(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar este descuento?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.registraDescuento(
          this.descuentosModelo.alias,
          this.descuentosModelo.concepto,
          this.descuentosModelo.aplicacion,
          this.descuentosModelo.monto,
          this.descuentosModelo.tipo,
          this.descuentosModelo.fecha_inicia,
          this.descuentosModelo.fecha_termina
        ).subscribe(
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

              this.descuentosModelo.alias = '';
              this.descuentosModelo.concepto = '';
              this.descuentosModelo.aplicacion = '';
              this.descuentosModelo.monto = '';
              this.descuentosModelo.tipo = '';
              this.descuentosModelo.fecha_inicia = '';
              this.descuentosModelo.fecha_termina = '';
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
    })

  }

}
