import { Component,OnInit, ElementRef, Renderer2, ViewChild, Input } from '@angular/core';
import { ListaPreciosServiceService } from '../../../../../servicios/ssic/lista-precios-service.service';
import { ProductosService } from '../../../../../servicios/ssic/productos.service';
import { ServiciosService } from '../../../../../servicios/ssic/servicios.service';
import { ActivatedRoute } from '@angular/router';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ImpuestosServService } from '../../../../../servicios/ssic/impuestos-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-precios',
  templateUrl: './lista-precios.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
    './lista-precios.component.css'
  ]
})
export class ListaPreciosComponent implements OnInit {
  pageProd:number = 1;
  pageServ:number = 1;
  arrayListaPrecios:any = [];
  arrayMercancias:any = [];
  arrayServiciosVig:any = [];
  impuestosVigentesArray:any = [];


  constructor(
    private router:ActivatedRoute,
    private precServ:ListaPreciosServiceService,
    private _prodService:ProductosService,
    private validator:ValidatorServService,
    private _catImp: ImpuestosServService,
    private translate:TranslateService,
    private _servicioServ:ServiciosService) {
  }

  ngOnInit(): void {
    this.getListaPrecios();
    this.getProductosLista();
    this.getServiciosLista();
    this.getCatalogoGeneralImpuestos();
  }

  getListaPrecios(){
    this.precServ.getListaPrecios().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayListaPrecios = response.price_list;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getProductosLista(){
    this._prodService.prodMercancias().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayMercancias = response.datosProducto;
          console.log(this.arrayMercancias);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getServiciosLista(){
    this._servicioServ.servVigentes().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayServiciosVig = response.datosServicio;
          console.log(this.arrayServiciosVig);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getCatalogoGeneralImpuestos(){
    this._catImp.catalogoGeneralImpuestosTrue('all_partidas','','').subscribe(
      response => {
        if (response.status == 'success') {
          this.impuestosVigentesArray = response.catImpuesto;
          console.log(this.impuestosVigentesArray); 
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //mercancias
    vinculaImpuestoproducto(event:any,token_cat_impuestos:any,token_cat_productos:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea vincular este impuesto con la mercancia seleccionada?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: 'Sí, vincular',
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.arrayMercancias.length; i++) {
            const mercancia = this.arrayMercancias[i];
            if (mercancia['c_token'] == token_cat_productos) {
              //var simulated = mercancia['simulated'];
              for (let position2 = 0; position2 < mercancia['arrayListaPrecios'].length; position2++) {
                var precio_detalle = mercancia['arrayListaPrecios'][position2]['precio_detalle'];
                var simulacion = mercancia['arrayListaPrecios'][position2]['simulacion'];

                if (simulacion == '0.00') {
                  if (precio_detalle != '') {
                    simulacion = precio_detalle;
                  } else {
                    simulacion = 10.00;
                  }
                }

                for (let index = 0; index < this.impuestosVigentesArray.length; index++) {
                  const impuestoo = this.impuestosVigentesArray[index];
                  if (impuestoo['c_token'] == token_cat_impuestos) {
                    var tipo = '';

                    if (impuestoo['tipo'] == '001'){
                      tipo = 'impuestos Federales';
                    }
                    if (impuestoo['tipo'] == '002'){
                      tipo = 'impuestos Estatales';
                    }
                    if (impuestoo['tipo'] == '003'){
                      tipo = 'impuestos Locales';
                    }

                    var importe_imp:any = 0;
                    if (impuestoo['por_cuo'] == 'cuota') {
                      importe_imp = impuestoo['importe'];
                    } else {
                      importe_imp = simulacion * (impuestoo['importe'] / 100);
                    }

                    mercancia['arrayListaPrecios'][position2]['impuestoArray'].push({
                      "token_cat_impuestos":impuestoo['c_token'],
                      "tipo":tipo,
                      "concepto":impuestoo['concepto']+ '('+impuestoo['alias']+')',
                      "ret_tras":impuestoo['ret_tras'],
                      "importe":impuestoo['importe']+' ('+impuestoo['por_cuo']+')',
                      "formatTotalImp":"$"+parseFloat(importe_imp),
                    })

                    if (impuestoo['ret_tras'] == 'retenido') {
                      simulacion = parseFloat(simulacion) - parseFloat(importe_imp);
                    }

                    if (impuestoo['ret_tras'] == 'trasladado') {
                      simulacion = parseFloat(simulacion) + parseFloat(importe_imp);
                    }

                    mercancia['arrayListaPrecios'][position2]['simulacion'] = simulacion;
                    mercancia['simulated'] = simulacion;
                  }
                }
              }
              event.checked = true;
              event.disabled = true;
            }
          }
        } else {
          event.checked = false;
          event.disabled = false;
        }
      })
    }

    unVincImpuestoproducto(event:any,token_cat_impuestos:any,token_cat_productos:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea desvincular este impuesto de la mercancia seleccionada?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: 'Sí, desvincular',
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          var modalContentImpuestos = $(event).parents(".modalContentImpuestos").find(".tabimpuestosLista");
          for (let index = 0; index < this.impuestosVigentesArray.length; index++) {
            const impuestoo = this.impuestosVigentesArray[index];
            if (impuestoo['c_token'] == token_cat_impuestos) {
              var radioButton = $(modalContentImpuestos).find("input.checkboxImp").eq(index);
              radioButton.attr("checked");
              radioButton.removeAttr("disabled");

              for (let i = 0; i < this.arrayMercancias.length; i++) {
                const mercancia = this.arrayMercancias[i];
                if (mercancia['c_token'] == token_cat_productos) {

                  for (let position2 = 0; position2 < mercancia['arrayListaPrecios'].length; position2++) {
                    for (let im = 0; im < mercancia['arrayListaPrecios'][position2]['impuestoArray'].length; im++) {
                      const inside = mercancia['arrayListaPrecios'][position2]['impuestoArray'][im];
                      if (inside['token_cat_impuestos'] == token_cat_impuestos) {
                        mercancia['arrayListaPrecios'][position2]['impuestoArray'].splice(im,1);
                      }
                    }

                    if (mercancia['arrayListaPrecios'][position2]['impuestoArray'].length > 0) {
                      this.revinculaImpproducto(token_cat_productos,position2);
                    } else {
                      mercancia['arrayListaPrecios'][position2]['simulacion'] = '0.00';
                    }
                  }

                }
              }

            }
          }
        }
      })
    }

    validaPrecioLista(event:any,token_cat_productos:any,position2:any){
      if (event.value != '' && this.validator.filtroCosto(event.value) == true) {
        this.validator.correctoInputRow(event);
        for (let i = 0; i < this.arrayMercancias.length; i++) {
          const mercancia = this.arrayMercancias[i];
          if (mercancia['c_token'] == token_cat_productos) {
            mercancia['arrayListaPrecios'][position2]['precio_detalle'] = event.value;

            var precio_detalle = mercancia['arrayListaPrecios'][position2]['precio_detalle'];
            var simulacion = mercancia['arrayListaPrecios'][position2]['simulacion'];
            simulacion = precio_detalle;

            for (let imp = 0; imp <  mercancia['arrayListaPrecios'][position2]['impuestoArray'].length; imp++) {
              const implist =  mercancia['arrayListaPrecios'][position2]['impuestoArray'][imp];
              for (let index = 0; index < this.impuestosVigentesArray.length; index++) {
                const impuestoo = this.impuestosVigentesArray[index];
                if (impuestoo['c_token'] == implist['token_cat_impuestos']) {
                  var importe_imp:any = 0;
                  if (impuestoo['por_cuo'] == 'cuota') {
                    importe_imp = impuestoo['importe'];
                  } else {
                    importe_imp = simulacion * (impuestoo['importe'] / 100);
                  }

                  if (impuestoo['ret_tras'] == 'retenido') {
                    simulacion = parseFloat(simulacion) - parseFloat(importe_imp);
                  }

                  if (impuestoo['ret_tras'] == 'trasladado') {
                    simulacion = parseFloat(simulacion) + parseFloat(importe_imp);
                  }

                  mercancia['arrayListaPrecios'][position2]['simulacion'] = simulacion;
                }
              }
            }

            
            
          }
        }
        console.log(this.arrayMercancias);
      } else {
        this.validator.errorInputRow(event);
        for (let i = 0; i < this.arrayMercancias.length; i++) {
          const mercancia = this.arrayMercancias[i];
          if (mercancia['c_token'] == token_cat_productos) {
            mercancia['arrayListaPrecios'][position2]['precio_detalle'] = '';
          }
        }
      }
    }

    vinculaImpuestoproducto2(event:any,token_cat_impuestos:any,token_cat_productos:any,position2:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea vincular este impuesto con la mercancia seleccionada?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: 'Sí, vincular',
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.arrayMercancias.length; i++) {
            const mercancia = this.arrayMercancias[i];
            if (mercancia['c_token'] == token_cat_productos) {
              var precio_detalle = mercancia['arrayListaPrecios'][position2]['precio_detalle'];
              var simulacion = mercancia['arrayListaPrecios'][position2]['simulacion'];

              if (simulacion == '0.00') {
                if (precio_detalle != '') {
                  simulacion = precio_detalle;
                } else {
                  simulacion = 10.00;
                }
              }

              for (let index = 0; index < this.impuestosVigentesArray.length; index++) {
                const impuestoo = this.impuestosVigentesArray[index];
                if (impuestoo['c_token'] == token_cat_impuestos) {
                  var tipo = '';

                  if (impuestoo['tipo'] == '001'){
                    tipo = 'impuestos Federales';
                  }
                  if (impuestoo['tipo'] == '002'){
                    tipo = 'impuestos Estatales';
                  }
                  if (impuestoo['tipo'] == '003'){
                    tipo = 'impuestos Locales';
                  }

                  var importe_imp:any = 0;
                  if (impuestoo['por_cuo'] == 'cuota') {
                    importe_imp = impuestoo['importe'];
                  } else {
                    importe_imp = simulacion * (impuestoo['importe'] / 100);
                  }

                  mercancia['arrayListaPrecios'][position2]['impuestoArray'].push({
                    "token_cat_impuestos":impuestoo['c_token'],
                    "tipo":tipo,
                    "concepto":impuestoo['concepto']+ '('+impuestoo['alias']+')',
                    "ret_tras":impuestoo['ret_tras'],
                    "importe":impuestoo['importe']+' ('+impuestoo['por_cuo']+')',
                    "formatTotalImp":"$"+parseFloat(importe_imp),
                  })

                  if (impuestoo['ret_tras'] == 'retenido') {
                    simulacion = parseFloat(simulacion) - parseFloat(importe_imp);
                  }

                  if (impuestoo['ret_tras'] == 'trasladado') {
                    simulacion = parseFloat(simulacion) + parseFloat(importe_imp);
                  }

                  mercancia['arrayListaPrecios'][position2]['simulacion'] = simulacion;

                }
              }

              event.checked = true;
              event.disabled = true;
            }
          }
        } else {
          event.checked = false;
          event.disabled = false;
        }
      })
    }

    unVincImpuestoproducto2(event:any,token_cat_impuestos:any,token_cat_productos:any,position2:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea desvincular este impuesto de la mercancia seleccionada?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: 'Sí, desvincular',
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          var modalContentImpuestos = $(event).parents(".modalContentImpuestos").find(".tabimpuestosLista");
          for (let index = 0; index < this.impuestosVigentesArray.length; index++) {
            const impuestoo = this.impuestosVigentesArray[index];
            if (impuestoo['c_token'] == token_cat_impuestos) {
              var radioButton = $(modalContentImpuestos).find("input.checkboxImp").eq(index);
              radioButton.attr("checked");
              radioButton.removeAttr("disabled");

              for (let i = 0; i < this.arrayMercancias.length; i++) {
                const mercancia = this.arrayMercancias[i];
                if (mercancia['c_token'] == token_cat_productos) {

                  for (let im = 0; im < mercancia['arrayListaPrecios'][position2]['impuestoArray'].length; im++) {
                    const inside = mercancia['arrayListaPrecios'][position2]['impuestoArray'][im];
                    if (inside['token_cat_impuestos'] == token_cat_impuestos) {
                      mercancia['arrayListaPrecios'][position2]['impuestoArray'].splice(im,1);
                    }
                  }

                  if (mercancia['arrayListaPrecios'][position2]['impuestoArray'].length > 0) {
                    this.revinculaImpproducto(token_cat_productos,position2);
                  } else {
                    mercancia['arrayListaPrecios'][position2]['simulacion'] = '0.00';
                  }
                }
              }

            }
          }
        }
      })
    }

    revinculaImpproducto(token_cat_productos:any,position2:any){
      for (let i = 0; i < this.arrayMercancias.length; i++) {
        const mercancia = this.arrayMercancias[i];
        if (mercancia['c_token'] == token_cat_productos) {
          var precio_detalle = mercancia['arrayListaPrecios'][position2]['precio_detalle'];
          var simulacion = mercancia['arrayListaPrecios'][position2]['simulacion'];

          simulacion = precio_detalle;

          for (let ar = 0; ar < mercancia['arrayListaPrecios'][position2]['impuestoArray'].length; ar++) {
            const relista = mercancia['arrayListaPrecios'][position2]['impuestoArray'][ar];
            for (let index = 0; index < this.impuestosVigentesArray.length; index++) {
              const impuestoo = this.impuestosVigentesArray[index];
              if (impuestoo['c_token'] == relista['token_cat_impuestos']) {
                var importe_imp:any = 0;
                if (impuestoo['por_cuo'] == 'cuota') {
                  importe_imp = impuestoo['importe'];
                } else {
                  importe_imp = simulacion * (impuestoo['importe'] / 100);
                }

                relista['formatTotalImp'] = "$"+parseFloat(importe_imp);

                if (impuestoo['ret_tras'] == 'retenido') {
                  simulacion = parseFloat(simulacion) - parseFloat(importe_imp);
                }

                if (impuestoo['ret_tras'] == 'trasladado') {
                  simulacion = parseFloat(simulacion) + parseFloat(importe_imp);
                }

                mercancia['arrayListaPrecios'][position2]['simulacion'] = simulacion;
              }
            }
          }
        }
      }
    }

    registraPrecioLista(event:any,token_cat_productos:any,token_lista_precios:any,position2:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea guardar el precio de este producto?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < this.arrayMercancias.length; i++) {
            const mercancias = this.arrayMercancias[i];
            if (mercancias['c_token'] == token_cat_productos && mercancias['arrayListaPrecios'][position2]['token_lista_precios'] == token_lista_precios) {
              var precio_detalle = mercancias['arrayListaPrecios'][position2]['precio_detalle'];
              var arrayImpuestos = mercancias['arrayListaPrecios'][position2]['impuestoArray'];
              this.precServ.registraListaPrecios(token_cat_productos,token_lista_precios,precio_detalle,arrayImpuestos).subscribe(
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
                    this.getListaPrecios();
                    this.getProductosLista();
                    this.getServiciosLista();
                    this.getCatalogoGeneralImpuestos();
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
          }
        }
      })
    }

    actualizaPrecioLista(event:any,token_lista_precios:any,tkn_detalle_lista:any,position1:any,position2:any){
      if (event.value != '' && this.validator.filtroCosto(event.value) == true) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }

  //servicios
    validaServicioPrecioLista(event:any,token_cat_servicios:any,position2:any){
      if (event.value != '' && this.validator.filtroCosto(event.value) == true) {
        this.validator.correctoInputRow(event);

        for (let i = 0; i < this.arrayServiciosVig.length; i++) {
          const serv = this.arrayServiciosVig[i];
          if (serv['c_token'] == token_cat_servicios) {
            this.arrayServiciosVig[i]['arrayListaPrecios'][position2]['precio_detalle'] = event.value;
            console.log(this.arrayServiciosVig[i]);
            this.precServ.simulaprecioservicio(this.arrayServiciosVig[i]['c_token'],event.value).subscribe(
              response => {
                if (response.status == 'success') {
                  this.arrayServiciosVig[i]['arrayListaPrecios'][position2]['simulacion'] = response.simulacion;
                }
                if (response.status == 'error') {
                  let translate_response = this.translate.instant(response.message);
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
        }
      } else {
        this.validator.errorInputRow(event);
        for (let i = 0; i < this.arrayServiciosVig.length; i++) {
          const serv = this.arrayServiciosVig[i];
          if (serv['c_token'] == token_cat_servicios) {
            this.arrayServiciosVig[i]['arrayListaPrecios'][position2]['precio_detalle'] = '';
            console.log(this.arrayServiciosVig[i]);
          }
        }
      }
    }

    registraServicioPrecioLista(event:any,token_cat_servicios:any,token_lista_precios:any,position1:any,position2:any){

      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea guardar los cambios realizados?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {

          if (token_cat_servicios != '') {
            for (let i = 0; i < this.arrayServiciosVig.length; i++) {
              const serv = this.arrayServiciosVig[i];
              if (serv['c_token'] == token_cat_servicios && this.arrayServiciosVig[i]['arrayListaPrecios'][position2]['token_lista_precios'] == token_lista_precios) {
                var precio_detalle = this.arrayServiciosVig[i]['arrayListaPrecios'][position2]['precio_detalle'];
                this.precServ.registraListaPreciosServ(token_cat_servicios,token_lista_precios,precio_detalle).subscribe(
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
                      this.getListaPrecios();
                      this.getProductosLista();
                      this.getServiciosLista();
                      this.getCatalogoGeneralImpuestos();
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
            }
          } else {
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: 'error en servicio seleccionado',
              showConfirmButton:false,
              timer: 3000
            })
          }
        }
      })
    }

    actualizaServicioPrecioLista(event:any,token_cat_servicios:any,token_lista_precios:any,tkn_detalle_lista:any,position2:any){
      if (event.value != '' && this.validator.filtroCosto(event.value) == true) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
}
