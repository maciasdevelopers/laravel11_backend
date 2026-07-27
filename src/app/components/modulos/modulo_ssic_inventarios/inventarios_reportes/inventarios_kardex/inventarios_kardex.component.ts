import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ProductosService } from '../../../../../servicios/ssic/productos.service';
import { ActFijosService } from '../../../../../servicios/ssic/act-fijos.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-kardex',
  templateUrl: './inventarios_kardex.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
    './inventarios_kardex.component.css'
  ]
})
export class InventKardexComponent implements OnInit, OnDestroy {
  public usuario: Usuarios;
  loading = false;
  
  listActivosKardex:any = [];
  indicadorActivosList:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoActivos: Date[] | undefined;
  deprec_registradas_activo:any = [];
  public modal_activo_kardex_detalle: boolean = false;

  listaProductosKardex:any = [];
  indicadorProductosList:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoProductos: Date[] | undefined;
  buscarProductosKardex:any = [];
  infoProductoKardex:any = [];
  public modal_producto_kardex_detalle: boolean = false;

  private destruir$ = new Subject<void>();

  constructor(
    private validator:ValidatorServService,
    private actFijo: ActFijosService,
    private translate: TranslateService,
    private primeAlerts: MessageService,
    private productoServ: ProductosService,
    private cd: ChangeDetectorRef
  ) { 
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.buscarProductosKardex = [
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
			'cuenta_contable',
			'modulo_destino',
      'modulo_mostrador',
      'ventanas',
      'token_cat_productos',
      'authorized',
      'authorized_fecha',
      'utilizado'
    ];
    this.listActFijosKardex('hoy');
    this.listProductosKardex('hoy');
  }
  
  //activos fijos
  listActFijosKardex(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorActivosList = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true; // Recomendado activar loading

    if (filtro == 'otras_fechas') {
      var act_kardex_otras_fechas = document.getElementById("act_kardex_otras_fechas");
      if (this.rangoPeriodoActivos && this.rangoPeriodoActivos.length === 2) {
        const dateInicio = this.rangoPeriodoActivos[0];
        const dateFin = this.rangoPeriodoActivos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(act_kardex_otras_fechas);
          } else {
            this.validator.errorInputRow(act_kardex_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_kardex_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(act_kardex_otras_fechas);
        return;
      }
    }

    this.actFijo.contabActFijosCat(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_activo(response),
      error: (err) => this.error_alerta_activo(err)
    });
  }

  procesar_respuesta_activo(response: any){
    this.loading = false;
    if (response.status === 'success') {
      this.listActivosKardex = response.datosActivo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listActivosKardex = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_activo(error: any){
    this.loading = false;
    console.error('Error al cargar el catálogo de activos:', error);
    this.listActivosKardex = [];
  }

  verActivoFijoToDeprec(token_activof_unidad: any) {
    this.deprec_registradas_activo = [];
    this.actFijo.activoFijoDeprecionesRegistradas(token_activof_unidad).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.deprec_registradas_activo = response.depreciaciones;
          this.modal_activo_kardex_detalle = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //productos
  listProductosKardex(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorProductosList = filtro;
    this.loading = true; // Recomendado activar loading
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var act_prod_otras_fechas = document.getElementById("act_prod_otras_fechas");
      if (this.rangoPeriodoProductos && this.rangoPeriodoProductos.length === 2) {
        const dateInicio = this.rangoPeriodoProductos[0];
        const dateFin = this.rangoPeriodoProductos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(act_prod_otras_fechas);
          } else {
            this.validator.errorInputRow(act_prod_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_prod_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(act_prod_otras_fechas);
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
      this.listaProductosKardex = response.listado;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listaProductosKardex = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_producto(error: any){
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.listaProductosKardex = [];
  }

  verKardexProd(token_cat_productos:any){
    this.infoProductoKardex = [];
    this.productoServ.verKardexProducto(token_cat_productos).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.infoProductoKardex = response.producto_kardex;
          this.modal_producto_kardex_detalle = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
