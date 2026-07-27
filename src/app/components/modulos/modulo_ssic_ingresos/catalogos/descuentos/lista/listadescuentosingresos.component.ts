//import { Component, OnInit } from '@angular/core';
import { Component,OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { descuentosAngularModelo } from '../../../../../../modelos/descuentosAngularModelo';
import { InterfServicios } from '../../../../../../interfaces/intef-servicios';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import { InterfMonedas } from '../../../../../../interfaces/interf-monedas';
import { InterfUmedida } from '../../../../../../interfaces/interf-umedida';
import { InterfDescuentos } from '../../../../../../interfaces/descuentos';
import { DescuentosService } from '../../../../../../servicios/ssic/descuentos.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interno-ingresos-catalogos',
  templateUrl: './listadescuentosingresos.component.html',
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
    '../../../ingresos.css',
    './listadescuentosingresos.component.css']
})

export class ListaDescuentosIngresosComponent implements OnInit {
  options = {};

  listaDescuentos: InterfDescuentos[] = [];
  public view_lista_descuentos:boolean = false;
  listaDescuentosDeshabilitados: InterfDescuentos[] = [];
  public view_lista_descuentos_deshabilitados:boolean = false;
  listaDescuentosEliminados: InterfDescuentos[] = [];
  public view_lista_descuentos_eliminados:boolean = false;

  public mayusAccess:boolean = false;
  public numberAccess:boolean = false;
  public symbolAccess:boolean = false;

  public accessCode:any;
  public enabledAccess:any;
  public validateVinculo:boolean = false;

  public descuentosModelo: descuentosAngularModelo;

  public usuario: Usuarios;
  arrayServiciosVig : InterfServicios[] = [];

  datosDetalleDesc:any = [];

  servDetalleDesc:any = []; pageservDetalleDesc:number = 1;
  servDetalleVinculados:any = []; pageservDetalleVinculados:number = 1;
  servDetalleDeleted:any = []; pageservDetalleDeleted:number = 1;

  prodDetalleDesc:any = []; pageprodDetalleDesc:number = 1;
  prodDetalleVinculados:any = []; pageprodDetalleVinculados:number = 1;
  prodDetalleDeleted:any = []; pageprodDetalleDeleted:number = 1;

  arrayServiciosDel : InterfServicios[] = [];

  arrayMonedas: InterfMonedas[] = [];
  arrayUmedida: InterfUmedida[] = [];

  constructor(
    private _descServ: DescuentosService,
    private validator:ValidatorServService,
    private encryptor:ServEncryptService,
    private translate:TranslateService) {
      this.descuentosModelo = new descuentosAngularModelo('','','','','','','');
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    //$('.tooltipped').tooltip();
    var elems = document.querySelectorAll('.tooltipped');
    //var instances = M.Tooltip.init(elems, this.options);
    this.listasDescuentosVigentes();
    this.listasDescuentosDeshabilitados();
    this.listasDescuentosEliminados();
  }

  listasDescuentosVigentes(){
    this.view_lista_descuentos = false;
    this._descServ.getListaDescuentos().subscribe((data: any) => {
      this.view_lista_descuentos = true;
      console.log(data);
      if (data.status == 'success') {        
        this.listaDescuentos = Object.values(data.descuentos);
      }
    });
  }

  listasDescuentosDeshabilitados(){
    this.view_lista_descuentos_deshabilitados = false;
    this._descServ.getListadescuentosdesac().subscribe((data: any) => {
      this.view_lista_descuentos_deshabilitados = true;
      console.log(data);
      if (data.status == 'success') {        
        this.listaDescuentosDeshabilitados = Object.values(data.descuentos);
      }
    });
  }

  listasDescuentosEliminados(){
    this.view_lista_descuentos_eliminados = false;
    this._descServ.getListadescuentosdelete().subscribe((data: any) => {
      this.view_lista_descuentos_eliminados = true;
      console.log(data);
      if (data.status == 'success') {        
        this.listaDescuentosEliminados = Object.values(data.descuentos);
      }
    });
  }

  cerrarModal(modal:any){
    $(modal).removeClass("open");
    this.datosDetalleDesc = [];
    this.enabledAccess = null;
  }

  validateaccessCode(event:any){
    if (event.value != '') {

      if (this.validator.filterPasswordMayus(event.value[0]) == true) {
        this.mayusAccess = true;//correctobtn(mayusConfirmacion);
      } else {
        this.mayusAccess = false;//correctobtn(mayusPrimera);
      }

      if (this.validator.filterPasswordNumber(event.value.trim()) == true) {
        this.numberAccess = true;//correctobtn(numberConfirmacion);
      } else {
        this.numberAccess = false;//correctobtn(numberPrimera);
      }

      if (this.validator.filterPasswordSymbol(event.value) == true) {
        this.symbolAccess = true;//correctobtn(symbolConfirmacion);
      } else {
        this.symbolAccess = false;//correctobtn(symbolConfirmacion);
      }

      if (this.mayusAccess == true && this.numberAccess == true && this.symbolAccess == true) {
        if (this.validator.filterPassword(event.value) == true && event.value.length == 8) {
          this.validator.correctoInput2(event,'&nbsp;&#xf023; Contraseña incorrecta');
          this.accessCode = this.encryptor.santoEncryptPass(event.value);
          //console.log(this.encryptor.)
        } else {
          this.accessCode = '';
          this.validator.errorInput2(event,'&nbsp;&#xf023; Número de caracteres invalido');
        }
      } else {
        this.accessCode = '';
        this.validator.errorInput2(event,'&nbsp;&#xf023; código de acceso invalida');
      }

    } else {
      this.accessCode = '';
      this.validator.errorInput2(event,'&nbsp;&#xf023; Ingrese código de acceso');
      this.mayusAccess = false;//errorbtn(mayusPrimera);
      this.numberAccess = false;//errorbtn(numberPrimera);
      this.symbolAccess = false;//errorbtn(symbolPrimera);
    }
  }

  functViewDescuento(token_descuento:any){
    this._descServ.getViewDescuento(token_descuento).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosDescuento);
          this.datosDetalleDesc = response.datosDescuento;
          this.descuentosModelo.alias = response.datosDescuento[0]['alias_descuento'];
					this.descuentosModelo.concepto = response.datosDescuento[0]['concepto_descuento'];
					this.descuentosModelo.aplicacion = response.datosDescuento[0]['cuo_porc'];
					this.descuentosModelo.monto = response.datosDescuento[0]['cantidad_base'];
					this.descuentosModelo.tipo = response.datosDescuento[0]['aplicacion'];
					this.descuentosModelo.fecha_inicia = response.datosDescuento[0]['periodo_inicio'];
					this.descuentosModelo.fecha_termina = response.datosDescuento[0]['periodo_fin'];
          this.validateVinculo = response.datosDescuento[0]['validateVinculo'];
          console.log(this.descuentosModelo.alias+" + "+response.datosDescuento[0]['alias_descuento']);

          this.servDetalleDesc = response.datosDescuento[0]['servicios'];
          this.servDetalleVinculados = response.datosDescuento[0]['serviciosVinculados'];
          this.servDetalleDeleted = response.datosDescuento[0]['serviciosDeleted'];
          this.prodDetalleDesc = response.datosDescuento[0]['productos'];
          this.prodDetalleVinculados = response.datosDescuento[0]['productosVinculados'];
          this.prodDetalleDeleted = response.datosDescuento[0]['productosDeleted'];
          var porcentajeCarga = 0;
          var intervalo = setInterval(() => {
            porcentajeCarga = porcentajeCarga +1;
            var porcentDiv = porcentajeCarga+'%';
            $(".h6CargaModalDesc").html('cargando... '+porcentDiv);
            if (porcentajeCarga == 100) {
              clearInterval(intervalo);
              setTimeout(function(){
                $("#loadingmodalDescuento").fadeOut("slow");
              },3000);
            }
          },30);

        }
      },
      error => {
        console.log(error);
      }
    )
  }

  aliasServDesc(event:any){
    if (event.value === '' || !this.validator.strFilter(event.value) == true || event.value.length < 4) {
      this.validator.errorInputRow(event);
      this.descuentosModelo.alias = '';
    } else {
      //$(btnDelete).removeAttr('disabled');
      this.validator.correctoInputRow(event);
      this.descuentosModelo.alias = event.value;
    }
  }

  conceptoServDesc(event:any){
    if (event.value == '' || !this.validator.strFilter(event.value) == true || event.value.length < 5) {
      this.validator.errorInputRow(event);
      this.descuentosModelo.concepto = '';
    } else {
      
      this.descuentosModelo.concepto = event.value;
      this.validator.correctoInputRow(event);
    }
  }

  cuotaPorcServDesc(event:any){
    if (event.value == '' || !this.validator.strFilter(event.value) == true) {
      this.validator.errorSelectRow(event);
      this.descuentosModelo.aplicacion = '';
    } else {
      this.validator.correctoSelectRow(event);
      this.descuentosModelo.aplicacion = event.value;
    }
  }

  cantidadBaseKeyUp(event:any){
    if (this.descuentosModelo.aplicacion == 'cuota') {
      if (event.value == '' || !this.validator.filtroCosto(event.value) == true) {
        this.validator.errorInputRow(event);
        this.descuentosModelo.monto = '';
        
      } else {
        this.validator.correctoInputRow(event);
        this.descuentosModelo.monto = event.value;
        
      }
    }

    if (this.descuentosModelo.aplicacion == 'porcentaje') {
      if (event.value == '' || !this.validator.filtroPorcentaje(event.value) == true) {
        this.validator.errorInputRow(event);
        this.descuentosModelo.monto = '';
        
      } else {
        this.validator.correctoInputRow(event);
        this.descuentosModelo.monto = event.value;
        
      }
    }
  }

  tipoDescuentoServDesc(event:any){
    if (event.value == '' || !this.validator.strFilter(event.value) == true) {
      this.validator.errorSelectRow(event);
      this.descuentosModelo.tipo = '';
    } else {
      this.validator.correctoSelectRow(event);
      this.descuentosModelo.tipo = event.value;
    }
  }

  fechaInicioServDesc(event:any){
    if (event.value == '' || !this.validator.filtroFecha(event.value) == true) {
      this.validator.errorInputRow(event);
      this.descuentosModelo.fecha_inicia = '';
    } else {
      this.validator.correctoInputRow(event);
      this.descuentosModelo.fecha_inicia = event.value;
    }
  }

  fechaFinServDesc(event:any){
    if (event.value == '' || !this.validator.filtroFecha(event.value) == true) {
      this.validator.errorInputRow(event);
      this.descuentosModelo.fecha_termina = '';
    } else {
      this.validator.correctoInputRow(event);
      this.descuentosModelo.fecha_termina = event.value;
    }
  }

  updateDescuento(event:any,token_descuentos:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar los datos generales de este descuento?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.updateDescuento(
          this.descuentosModelo.alias,
          this.descuentosModelo.concepto,
          this.descuentosModelo.aplicacion,
          this.descuentosModelo.monto,
          this.descuentosModelo.tipo,
          this.descuentosModelo.fecha_inicia,
          this.descuentosModelo.fecha_termina,
          token_descuentos
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

              this.functViewDescuento(token_descuentos);
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  activaDescuento(event:any,token_descuento:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea desactivar el descuento seleccionado?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.activarDescuento(token_descuento).subscribe(
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
              this.functViewDescuento(token_descuento);
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  desactivaDescuento(event:any,token_descuento:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea activar el descuento seleccionado?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.desactivarDescuento(token_descuento).subscribe(
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
              this.functViewDescuento(token_descuento);
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  vincdescproddescuento(token_descuento:any,token_producto:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea vincular este descuento con el producto seleccionado?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.vincularProductoDesc(token_descuento,token_producto).subscribe(
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
              this.functViewDescuento(token_descuento);
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  unVincdescproddescuento(token_descuento:any,tokenDescDetalle:any,token_producto:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea desvincular este producto con el descuento seleccionado?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, desviuncular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.desvincularProductoDesc(token_descuento,tokenDescDetalle,token_producto).subscribe(
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
              this.functViewDescuento(token_descuento);
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  vincdescservdescuento(token_descuento:any,token_servicio:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea vincular este servicio con el descuento seleccionado?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.vincularServicioDesc(token_descuento,token_servicio).subscribe(
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
              this.functViewDescuento(token_descuento);
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  unVincdescservdescuento(token_descuento:any,tokenDescDetalle:any,token_servicio:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea desvincular este descuento con el servicio seleccionado?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, desvincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.desvincularServicioDesc(token_descuento,tokenDescDetalle,token_servicio).subscribe(
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
              this.functViewDescuento(token_descuento);
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  eliminaDescuento(token_descuento:any){
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
        this._descServ.eliminarDescuento(token_descuento).subscribe(
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
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  restauraDescuento(token_descuento:any){
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
        this._descServ.restaurarDescuento(token_descuento).subscribe(
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
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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

  eliminaPermDescuento(token_descuento:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el descuento seleccionado?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._descServ.eliminarPermDescuento(token_descuento).subscribe(
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
              this.listasDescuentosVigentes();
              this.listasDescuentosDeshabilitados();
              this.listasDescuentosEliminados();
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
