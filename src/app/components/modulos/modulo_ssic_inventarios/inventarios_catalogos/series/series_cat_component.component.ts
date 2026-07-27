import { Component,OnInit } from '@angular/core';
import { RequisicionesService } from '../../../../../servicios/ssic/requisiciones.service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from '../../../../../servicios/ssic/series-service.service';
import { tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-serie-listas',
  standalone: false,
  templateUrl: './series_cat_component.component.html',
  styleUrls: [
    './series_cat_component.component.css',
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
    '../../../../../styles/explain.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/sat_web_page.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
  ],
  providers: [RequisicionesService,SentinelArkManager]
})
export class SeriesCatalogoComponent implements OnInit{
  seriesCatalogoTrue:any = [];
  serieSelected:any;
  seriesCatalogoPapalera:any = [];

  public serie_nueva:string = "";
  public serie_uso_unico:boolean = false;
  public serie_comentarios:string = "";

  constructor(
    private validator:ValidatorServService,
    private serieServ:SeriesService,
    private translate:TranslateService
  ){}

  ngOnInit(): void {
    this.lista_series_catalogo_true();
    this.lista_series_catalogo_false();
  }
  
  //catalogo
    lista_series_catalogo_true(){
      this.serieServ.listaSeriesvigentes().pipe(
        tap(response => {
          if (response?.status === 'success') {
            this.seriesCatalogoTrue = response.series;
            console.log(this.seriesCatalogoTrue);
          }
        })
      ).subscribe({error: error => console.log(error)});
    }

    verSerie(row:any,serie_token:any){
      this.serieSelected = this.serieSelected === row ? null : row;
      this.serieSelected === row ? this.descargaDetalleSerie(serie_token) : null;
    }

    descargaDetalleSerie(serie_token:any){
      //alert(dattknprod);o
      this.serieServ.infoSerieDetail(serie_token).subscribe(
        response => {
          if (response.status == 'success') {
            const index_s = this.seriesCatalogoTrue.findIndex((row:any) => row.serie_token == serie_token);
            this.seriesCatalogoTrue[index_s]["detalle"] = response.serie;
            console.log(response);
          }
        },
        error => {
          console.log(error);
        }
      )
    }

    enviaSerieToPapalera(serie_token:any){
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
          this.serieServ.eliminaSeriePapelera(serie_token).subscribe(
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
                this.lista_series_catalogo_true();
                this.lista_series_catalogo_false();
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
      })
    }

  //eliminadas
    lista_series_catalogo_false(){
      this.serieServ.listaSeriesDeleted().pipe(
        tap(response => {
          if (response.status === 'success') {
            this.seriesCatalogoPapalera = response.series;
          }
        })
      ).subscribe({error: error => console.log(error)});
    }

    serieRestaurar(serie_token:any){
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
          this.serieServ.serieRestaurar(serie_token).subscribe(
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
                this.lista_series_catalogo_true();
                this.lista_series_catalogo_false();
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
      })
    }

    seriePapaleraDelete(serie_token:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: "¿Desea eliminar este lote?",
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this.serieServ.serieDeletePerm(serie_token).subscribe(
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
                this.lista_series_catalogo_true();
                this.lista_series_catalogo_false();
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
      })
    }

  //registro
    validaNuevaSerie(event:any){
      var validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.serie_nueva = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    decideUsoUnico(event:any){
      this.serie_uso_unico = event.checked == true ? true : false;
    }

    serieComentariosLoteKeyUp(event:any){
      let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
      this.serie_comentarios = validacion ? event.value : '';
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    registraSerie(form:NgForm):void{
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
          this.serieServ.registroSeries(this.serie_nueva,this.serie_uso_unico,this.serie_comentarios).subscribe(
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
                this.validator.limpiaInputRow(document.getElementById("txt_new_serie"));
                this.serie_nueva = "";
                this.serie_uso_unico = false;
                this.serie_comentarios = "";
                this.lista_series_catalogo_true();
                this.lista_series_catalogo_false();
                form.resetForm();
                //this.formAddProducto.resetForm();
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
