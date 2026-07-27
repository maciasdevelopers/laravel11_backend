//import { Component, OnInit } from '@angular/core';
import { Component,OnInit, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { PromocionesService } from '../../../../../../servicios/ssic/promociones.service';
import { promocionesAngularModelo } from '../../../../../../modelos/promocionesAngularModelo';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';

@Component({
  selector: 'app-interno-ingresos-catalogos',
  templateUrl: './altapromocionesingresos.component.html',
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
    '../../../../../../styles/landing.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/colores.css',
    '../../../ingresos.css',
    './altapromocionesingresos.component.css']
})

export class AltaPromocionesIngresosComponent implements OnInit {
  options = {};
  public promocionesModelo: promocionesAngularModelo;
  public boolRegistro:boolean = false;
  public usuario: Usuarios;

  constructor(
    private renderer: Renderer2,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private _promoServ: PromocionesService) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.promocionesModelo = new promocionesAngularModelo('','','','','','','');
    }

  ngOnInit(): void {
    //$('.tooltipped').tooltip();
    var elems = document.querySelectorAll('.tooltipped');
    //var instances = M.Tooltip.init(elems, this.options);
  }

  aliasServPromo(event:any){
    if (event.value != '' && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.validator.correctoInputRow(event);
      this.promocionesModelo.alias = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.promocionesModelo.alias = '';
    }
    this.validaRegistro();
  }

  conceptoServPromo(event:any){
    if (event.value != '' && this.validator.strFilter(event.value) == true && event.value.length >= 5) {
      this.promocionesModelo.concepto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
      this.promocionesModelo.concepto = '';
    }
    this.validaRegistro();
  }

  cuotaPorcServPromo(event:any){
    if (event.value != '' && this.validator.strFilter(event.value) == true) {
      this.validator.correctoSelectRow(event);
      this.promocionesModelo.aplicacion = event.value;
    } else {
      this.validator.errorSelectRow(event);
      this.promocionesModelo.aplicacion = '';
    }
    this.validaRegistro();
  }

  cantidadBaseKeyUp(event:any){
    const valida_aplicacion = (this.promocionesModelo.aplicacion == 'cuota' && this.validator.filtroCosto(event.value) == true) || (this.promocionesModelo.aplicacion == 'porcentaje' && this.validator.filtroPorcentaje(event.value) == true); 
    if (event.value != '' && valida_aplicacion) {
      this.validator.correctoInputRow(event);
      this.promocionesModelo.monto = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.promocionesModelo.monto = '';
    }
    this.validaRegistro();
  }

  tipoDescuentoServPromo(event:any){
    if (event.value != '' && this.validator.strFilter(event.value) == true) {
      this.validator.correctoSelectRow(event);
      this.promocionesModelo.tipo = event.value;
    } else {
      this.validator.errorSelectRow(event);
      this.promocionesModelo.tipo = '';
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

  fechaInicioServPromo(event:any){
    if (event.value != '' && this.validator.filtroFecha(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.promocionesModelo.fecha_inicia = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.promocionesModelo.fecha_inicia = '';
    }   
    this.validaRegistro();
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

  fechaFinServPromo(event:any){
    if (event.value != '' && this.validator.filtroFecha(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.promocionesModelo.fecha_termina = event.value;
    } else {
      this.validator.errorInputRow(event);
      this.promocionesModelo.fecha_termina = '';
    }
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
    this.validaRegistro();
  }

  validaRegistro(){
    const valido_alias = this.promocionesModelo.alias != '' && this.validator.strFilter(this.promocionesModelo.alias) == true && this.promocionesModelo.alias.length >= 4;
    const valido_concepto = this.promocionesModelo.concepto != '' && this.validator.strFilter(this.promocionesModelo.concepto) == true && this.promocionesModelo.concepto.length >= 5;
    const valido_aplicacion = this.promocionesModelo.aplicacion != '' && this.validator.strFilter(this.promocionesModelo.aplicacion) == true;
    const valido_monto = this.promocionesModelo.monto != '' && (
      (this.promocionesModelo.aplicacion == 'cuota' && this.validator.filtroCosto(this.promocionesModelo.monto) == true) || 
      (this.promocionesModelo.aplicacion == 'porcentaje' && this.validator.filtroPorcentaje(this.promocionesModelo.monto) == true)
    );
    const valido_tipo = this.promocionesModelo.tipo != '' && this.validator.strFilter(this.promocionesModelo.tipo) == true; 
    const valido_fecha_inicia = this.promocionesModelo.fecha_inicia != '' && this.validator.filtroFecha(this.promocionesModelo.fecha_inicia) == true;
    const valido_fecha_termina = this.promocionesModelo.fecha_termina != '' && this.validator.filtroFecha(this.promocionesModelo.fecha_termina) == true;
    const valido_pIndeterminado = this.promocionesModelo.tipo == 'pIndeterminado' && valido_fecha_inicia;
    const valido_pDeterminado = this.promocionesModelo.tipo == 'pDeterminado' && valido_fecha_inicia && valido_fecha_termina;
    //boolRegistro validaRegistro
    this.boolRegistro = valido_alias && valido_concepto && valido_aplicacion && valido_monto && valido_tipo && (this.promocionesModelo.tipo == 'eventual' || valido_pIndeterminado || valido_pDeterminado);
  }

  guardaPromocionEnArray(){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea registrar esta promoción?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, desviuncular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._promoServ.registraPromocion(
          this.promocionesModelo.alias,
          this.promocionesModelo.concepto,
          this.promocionesModelo.aplicacion,
          this.promocionesModelo.monto,
          this.promocionesModelo.tipo,
          this.promocionesModelo.fecha_inicia,
          this.promocionesModelo.fecha_termina
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

              this.promocionesModelo.alias = '';
              this.promocionesModelo.concepto = '';
              this.promocionesModelo.aplicacion = '';
              this.promocionesModelo.monto = '';
              this.promocionesModelo.tipo = '';
              this.promocionesModelo.fecha_inicia = '';
              this.promocionesModelo.fecha_termina = '';
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
