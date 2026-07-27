import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ProductosService } from '../../../../../../servicios/ssic/productos.service';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app_productos_inventarios_catalogo',
  standalone: false,
  templateUrl: './productos-inventarios-catalogo.component.html',
  styleUrl: './productos-inventarios-catalogo.component.css'
})
export class ProductosInventariosCatalogoComponent implements OnInit, OnDestroy {
  loading = false;
  indicadorProductosList:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoProductos: Date[] | undefined;
  buscList_prod:any = [];
  listaProductosInventarios:any = [];
  public mensajeRegistro:string = "";

  private destruir$ = new Subject<void>();

  constructor(
    private relInterna:ComunicacionInternaService,
    private cd: ChangeDetectorRef,
    private sanitizer:DomSanitizer,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private productoServ: ProductosService,
    private renderer: Renderer2
  ){
  }

  ngOnInit(): void {
    this.getRespuestaRegistro();
    this.getRespuestaMoveToPapelera();
    this.getRespuestaRestaurarProd();
    this.mostrar_productos_inventario('hoy');
    this.buscList_prod = [
      'folio_prod',
      'producto',
      'familia',
      'clasificacion',
      'genero',
      'marca',
      'stock_actual',
      'stock_minimo_registrado',
      'stock_maximo_registrado',
      'metodo_costeo',
      'unidad_medida_entrada_clave',
      'unidad_medida_salida_clave',
      'moneda_aplicable_clave',
      'uso_producto',
      'num_serie',
      'num_lote',
      'importado',
      'sat_clave_code',
      'costo_aplicable',
      'ventanas',
      'token_cat_productos',
      'authorized',
      'authorized_fecha',
      'utilizado'
    ];
  }

  getRespuestaRegistro(){
    this.relInterna.mensajeProdInvent$.subscribe(
      (mensaje:any) => {
        mensaje == "producto registrado" ? this.listar_productos_inventario() : null;
      }
    );
  }

  getRespuestaMoveToPapelera(){
    this.relInterna.mensajeMoveToPepelera$.subscribe(
      (mensaje:any) => {
        mensaje == "registro eliminado" ? this.listar_productos_inventario() : null;
      }
    );
  }

  getRespuestaRestaurarProd(){
    this.relInterna.mensajeRestaurarProd$.subscribe(
      (mensaje:any) => {
        mensaje == "registro restaurado" ? this.listar_productos_inventario() : null;
      }
    );
  }

  listar_productos_inventario(){
    this.mostrar_productos_inventario(this.indicadorProductosList);
  }

  mostrar_productos_inventario(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorProductosList = filtro;
    this.loading = true; // Recomendado activar loading
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var prod_inventario_otras_fechas = document.getElementById("prod_inventario_otras_fechas");
      if (this.rangoPeriodoProductos && this.rangoPeriodoProductos.length === 2) {
        const dateInicio = this.rangoPeriodoProductos[0];
        const dateFin = this.rangoPeriodoProductos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(prod_inventario_otras_fechas);
          } else {
            this.validator.errorInputRow(prod_inventario_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(prod_inventario_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(prod_inventario_otras_fechas);
        return;
      }
    }

    this.productoServ.productosInventariosCat(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_producto(response),
      error: (err) => this.error_alerta_producto(err)
    });
  }

  procesar_respuesta_producto(response: any){
    this.loading = false;
    if (response.status === 'success') {
      this.listaProductosInventarios = response.listado;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listaProductosInventarios = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_producto(error: any){
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.listaProductosInventarios = [];
  }

  verGeneralesProd(token_cat_productos:any){
    this.relInterna.mensajeVerGeneralesProd("ver producto",token_cat_productos);
  }

  verAlmacenamientoProd(token_cat_productos:any){
    this.relInterna.mensajeVerAlmacenamientoProd("ver producto",token_cat_productos);
  }

  verKardexProd(token_cat_productos:any){
    this.relInterna.mensajeVerKardexProd("ver producto",token_cat_productos);
  }

  solicita_auth_producto(token_cat_productos:any){
    console.log(token_cat_productos);
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
        this.productoServ.solicitarValidateProducto(token_cat_productos).subscribe(
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
  
  btnDeleteProducto(token_cat_productos:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este producto?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServ.moverPapeleraProducto(token_cat_productos).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.listar_productos_inventario();
              //this.lista_productos_eliminados();
              this.relInterna.mensajeMoviendoProdToPapalera("registro eliminado");
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
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

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
