import { Component,OnInit, Renderer2 } from '@angular/core';
import { InterfServicios } from '../../../../../../interfaces/intef-servicios';
import Swal from 'sweetalert2';
import { IntefPromociones } from '../../../../../../interfaces/intef-promociones';
import { PromocionesService } from '../../../../../../servicios/ssic/promociones.service';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { promocionesAngularModelo } from '../../../../../../modelos/promocionesAngularModelo';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interno-ingresos-catalogos',
  templateUrl:
  './listapromocionesingresos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/explain.css',
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
    './listapromocionesingresos.component.css']
})

export class ListaPromocionesIngresosComponent implements OnInit {
  options = {};

  public isTrueCollapsed:boolean = true;
  public isDisabledCollapsed:boolean = false;
  public isDeletedCollapsed:boolean = false;

  pagePromoVigentes:number = 1;
  pagePromoDesact:number = 1;
  pagePromoDeleted:number = 1;

  public mayusAccess:boolean;
  public numberAccess:boolean;
  public symbolAccess:boolean;
  public accessCode:any;
  public enabledAccess:any;

  public promocionesModelo: promocionesAngularModelo;

  public usuario: Usuarios;
  arrayServiciosVig : InterfServicios[] = [];
  public tknPromocion:string;

  datosDetallePromo:any = [];

  servDetallePromo:any = []; pageservDetallePromo:number = 1;
  servDetalleVinculados:any = []; pageservDetalleVinculados:number = 1;
  servDetalleDeleted:any = []; pageservDetalleDeleted:number = 1;

  prodDetallePromo:any = []; pageprodDetallePromo:number = 1;
  prodDetalleVinculados:any = []; pageprodDetalleVinculados:number = 1;
  prodDetalleDeleted:any = []; pageprodDetalleDeleted:number = 1;

  arrayServiciosDel : InterfServicios[] = [];

  arrayPromociones: IntefPromociones[] = [];
  arrayPromocionesdesact: IntefPromociones[] = [];
  arrayPromocionesdelete: IntefPromociones[] = [];
  public view_lista_promociones:boolean = false;
  public view_lista_promociones_deshabilitadas:boolean = false;
  public view_lista_promociones_eliminadas:boolean = false;

  constructor(
    private renderer: Renderer2,
    private _promoServ: PromocionesService,
    private validator:ValidatorServService,
    private sentinela:SentinelArkManager,
    private encryptor:ServEncryptService,
    private translate:TranslateService) {
      this.promocionesModelo = new promocionesAngularModelo('','','','','','','');
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.tknPromocion = '';
      this.mayusAccess = false;
      this.numberAccess = false;
      this.symbolAccess = false;
      this.accessCode = null;
      this.enabledAccess = null;
    }

  ngOnInit(): void {
    var elems = document.querySelectorAll('.tooltipped');
    this.listasPromociones();
    this.listasDesactPromociones();
    this.listasDeletedPromociones();
  }

  listasPromociones(){
    this.view_lista_promociones = false;
    this._promoServ.getListaPromociones().subscribe((data: any) => {
      this.view_lista_promociones = true;
      console.log(data);
      if (data.status == 'success') {        
        this.arrayPromociones = Object.values(data.promociones);
      }
    });
  }

  listasDesactPromociones(){
    this.view_lista_promociones_deshabilitadas = false;
    this._promoServ.getListapromocionesdesac().subscribe((data: any) => {
      this.view_lista_promociones_deshabilitadas = true;
      console.log(data);
      if (data.status == 'success') {        
        this.arrayPromocionesdesact = Object.values(data.promociones);
      }
    });
  }

  listasDeletedPromociones(){
    this.view_lista_promociones_eliminadas = false;
    this._promoServ.getListapromocionesdelete().subscribe((data: any) => {
      this.view_lista_promociones_eliminadas = true;
      console.log(data);
      if (data.status == 'success') {        
        this.arrayPromocionesdelete = Object.values(data.promociones);
      }
    });
  }

  cerrarModal(modal:any){
    $(modal).removeClass("open");
    this.datosDetallePromo = [];
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

  functViewPromocion(token_promocion:any){
    this._promoServ.getViewPromociones(token_promocion).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosPromocion);
          this.datosDetallePromo = response.datosPromocion;
          this.tknPromocion = response.datosPromocion[0]['token_promocion'];
          this.promocionesModelo.alias = response.datosPromocion[0]['alias_promocion'];
					this.promocionesModelo.concepto = response.datosPromocion[0]['concepto_promocion'];
					this.promocionesModelo.aplicacion = response.datosPromocion[0]['cuo_porc'];
					this.promocionesModelo.monto = response.datosPromocion[0]['cantidad_base'];
					this.promocionesModelo.tipo = response.datosPromocion[0]['aplicacion'];
					this.promocionesModelo.fecha_inicia = response.datosPromocion[0]['periodo_inicio'];
					this.promocionesModelo.fecha_termina = response.datosPromocion[0]['periodo_fin'];

          console.log(this.promocionesModelo.alias+" + "+response.datosPromocion[0]['alias_promocion']);

          this.servDetallePromo = response.datosPromocion[0]['servicios'];
          this.servDetalleVinculados = response.datosPromocion[0]['serviciosVinculados'];
          this.servDetalleDeleted = response.datosPromocion[0]['serviciosDeleted'];
          this.prodDetallePromo = response.datosPromocion[0]['productos'];
          this.prodDetalleVinculados = response.datosPromocion[0]['productosVinculados'];
          this.prodDetalleDeleted = response.datosPromocion[0]['productosDeleted'];

          var porcentajeCarga = 0;
          var intervalo = setInterval(() => {
            porcentajeCarga = porcentajeCarga +1;
            var porcentDiv = porcentajeCarga+'%';
            $(".h6CargaModalPromo").html('cargando... '+porcentDiv);
            if (porcentajeCarga == 100) {
              clearInterval(intervalo);
              setTimeout(function(){
                $("#loadingmodalPromocion").fadeOut("slow");
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

  aliasServPromo(event:any){
    if (event.value === '' || !this.validator.strFilter(event.value) == true || event.value.length < 4) {
      this.validator.errorInputRow(event);
      this.promocionesModelo.alias = '';
    } else {
        //$(btnDelete).removeAttr('disabled');
        this.validator.correctoInputRow(event);
        this.promocionesModelo.alias = event.value;
    }
  }

  conceptoServPromo(event:any){
    if (event.value == '' || !this.validator.strFilter(event.value) == true || event.value.length < 5) {
      this.validator.errorInputRow(event);
      this.promocionesModelo.concepto = '';
      
    } else {
      
      this.promocionesModelo.concepto = event.value;
      this.validator.correctoInputRow(event);
    }
  }

  cuotaPorcServPromo(event:any){
    if (event.value == '' || !this.validator.strFilter(event.value) == true) {
      this.validator.errorSelectRow(event);
      this.promocionesModelo.aplicacion = '';
    } else {
      this.validator.correctoSelectRow(event);
      this.promocionesModelo.aplicacion = event.value;
    }
  }

  cantidadBaseKeyUp(event:any){
    if (this.promocionesModelo.aplicacion == 'cuota') {
      if (event.value == '' || !this.validator.filtroCosto(event.value) == true) {
        this.validator.errorInputRow(event);
        this.promocionesModelo.monto = '';
        
      } else {
        this.validator.correctoInputRow(event);
        this.promocionesModelo.monto = event.value;
        
      }
    }

    if (this.promocionesModelo.aplicacion == 'porcentaje') {
      if (event.value == '' || !this.validator.filtroPorcentaje(event.value) == true) {
        this.validator.errorInputRow(event);
        this.promocionesModelo.monto = '';
        
      } else {
        this.validator.correctoInputRow(event);
        this.promocionesModelo.monto = event.value;
        
      }
    }
  }

  tipoDescuentoServPromo(event:any){
    if (event.value == '' || !this.validator.strFilter(event.value) == true) {
      this.validator.errorSelectRow(event);
      this.promocionesModelo.tipo = '';
    } else {
      this.validator.correctoSelectRow(event);
      this.promocionesModelo.tipo = event.value;
    }

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
    if (event.value == '' || !this.validator.filtroFecha(event.value) == true) {
      this.validator.errorInputRow(event);
      this.promocionesModelo.fecha_inicia = '';
    } else {
      this.validator.correctoInputRow(event);
      this.promocionesModelo.fecha_inicia = event.value;
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
  }

  fechaFinServPromo(event:any){
    if (event.value == '' || !this.validator.filtroFecha(event.value) == true) {
      this.validator.errorInputRow(event);
      this.promocionesModelo.fecha_termina = '';
    } else {
      this.validator.correctoInputRow(event);
      this.promocionesModelo.fecha_termina = event.value;
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
  }

  validaBtnUpdatePromo(): boolean{
    return (
      this.promocionesModelo.alias != this.datosDetallePromo[0]["alias_promocion"] ||
      this.promocionesModelo.concepto != this.datosDetallePromo[0]["concepto_promocion"] ||
      this.promocionesModelo.aplicacion != this.datosDetallePromo[0]["cuo_porc"] ||
      this.promocionesModelo.monto != this.datosDetallePromo[0]["cantidad_base"] ||
      this.promocionesModelo.tipo != this.datosDetallePromo[0]["aplicacion"] ||
      this.promocionesModelo.fecha_inicia != this.datosDetallePromo[0]["periodo_inicio"] ||
      this.promocionesModelo.fecha_termina != this.datosDetallePromo[0]["periodo_fin"]
    );
  }

  updatePromocion(event:any,token_promocion:any){
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
        this._promoServ.updatePromocion(
          this.promocionesModelo.alias,
          this.promocionesModelo.concepto,
          this.promocionesModelo.aplicacion,
          this.promocionesModelo.monto,
          this.promocionesModelo.tipo,
          this.promocionesModelo.fecha_inicia,
          this.promocionesModelo.fecha_termina,
          token_promocion
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

              this.functViewPromocion(token_promocion);
              this.listasPromociones();
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

  activaPromocion(event:any,token_promocion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea activar la promoción seleccionada?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._promoServ.activarPromocion(token_promocion).subscribe(
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
              this.functViewPromocion(this.tknPromocion);
              this.listasPromociones();
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

  desactivaPromocion(event:any,token_promocion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea desactivar la promoción seleccionada?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._promoServ.desactivarPromocion(token_promocion).subscribe(
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
              this.functViewPromocion(this.tknPromocion);
              this.listasPromociones();
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

  vincproductopromocion(event:any,token_producto:any){
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
        this._promoServ.vincularProductoPromo(this.tknPromocion,token_producto).subscribe(
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
              this.functViewPromocion(this.tknPromocion);
              this.listasPromociones();
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

  unVincproductopromocion(event:any,tokenPromoDetalle:any,token_producto:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea desvincular este producto con la promoción seleccionada?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, desviuncular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._promoServ.desvincularProductoPromo(this.tknPromocion,tokenPromoDetalle,token_producto).subscribe(
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
              this.functViewPromocion(this.tknPromocion);
              this.listasPromociones();
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

  vincserviciopromocion(event:any,token_servicio:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea vincular este servicio con la promoción seleccionada?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, vincular',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._promoServ.vincularServicioPromo(this.tknPromocion,token_servicio).subscribe(
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
              this.functViewPromocion(this.tknPromocion);
              this.listasPromociones();
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

  unVincserviciopromocion(event:any,tokenPromoDetalle:any,token_servicio:any){
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
        this._promoServ.desvincularServicioPromo(this.tknPromocion,tokenPromoDetalle,token_servicio).subscribe(
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
              this.functViewPromocion(this.tknPromocion);
              this.listasPromociones();
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

  eliminaPromocion(token_promocion:any){
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
        this._promoServ.eliminarPromocion(token_promocion).subscribe(
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
              this.listasPromociones();
              this.listasDesactPromociones();
              this.listasDeletedPromociones();
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

  restauraPromocion(token_promocion:any){
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
        this._promoServ.restaurarPromocion(token_promocion).subscribe(
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
              this.listasPromociones();
              this.listasDesactPromociones();
              this.listasDeletedPromociones();
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

  eliminaPermPromocion(token_promocion:any){
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
        this._promoServ.eliminarPermPromocion(token_promocion).subscribe(
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
              this.listasPromociones();
              this.listasDesactPromociones();
              this.listasDeletedPromociones();
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
