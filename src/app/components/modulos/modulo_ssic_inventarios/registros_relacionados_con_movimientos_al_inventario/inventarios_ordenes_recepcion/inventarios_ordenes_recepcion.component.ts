import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { EstablecimientosService } from '../../../../../servicios/establecimientos';
import { ActFijosService } from '../../../../../servicios/ssic/act-fijos.service';
import { Subject, takeUntil } from 'rxjs';
import { OrdenesRecepcionService } from '../../../../../servicios/ssic/ordenes-recepcion-service';

@Component({
  selector: 'app_interno_egresos_compras_ordenes_recepcion',
  standalone: false,
  templateUrl: './inventarios_ordenes_recepcion.component.html',
  styleUrls: [
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/proveedores.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/ubicaciones.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
    './inventarios_ordenes_recepcion.component.css'
  ]
})
export class InventariosOrdenesRecepcionComponent implements OnInit, OnDestroy {
  //recepción de articulos
  indicadorRecepcionOrdenes:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoRecepcionOrdenes: Date[] | undefined;
  arrayOrdenesRecepcion:any = [];

  public desglose_orden_recept_folio:string = "";
  public ver_seccion_orden_recept_desglose:boolean = false;
  arrayDetalleCompra:any = [];
  establecimientos_registrados:any = [];
  establecimiento_ngm = null;
  productos_lista:any = [];
  servicios_lista:any = [];
  activos_fijos_lista:any = [];
  activos_diferidos_lista:any = [];

  public filesDevengacion: NgxFileDropEntry[] = [];
  public docsDevengacionAnexos:any [] = [];
  public docsDevengacionNames:any = [];
  public reem_saved:boolean = false;

  private destruir$ = new Subject<void>();

  constructor(
    private recepcionServ: OrdenesRecepcionService,
    private _almService:DireccionesService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private actFijo: ActFijosService,
    private estabServ:EstablecimientosService,
    private cd: ChangeDetectorRef
  ){
  }

  ngOnInit(): void {
    this.listGeneralReceptCompras('hoy');
    this.recargaEstablecimientos();
  }

  listGeneralReceptCompras(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorRecepcionOrdenes = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var ord_recep_otras_fechas = document.getElementById("ord_recep_otras_fechas");
      if (this.rangoPeriodoRecepcionOrdenes && this.rangoPeriodoRecepcionOrdenes.length === 2) {
        const dateInicio = this.rangoPeriodoRecepcionOrdenes[0];
        const dateFin = this.rangoPeriodoRecepcionOrdenes[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(ord_recep_otras_fechas);
          } else {
            this.validator.errorInputRow(ord_recep_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(ord_recep_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(ord_recep_otras_fechas);
        return;
      }
    }
    
    this.recepcionServ.listaComprasRecepcionOrden(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_ordrecep(response),
      error: (err) => this.error_alerta_ordrecep(err)
    });
  }

  procesar_respuesta_ordrecep(response: any){
    if (response.status === 'success') {
      this.arrayOrdenesRecepcion = response.ordenes;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayOrdenesRecepcion = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_ordrecep(error: any){
    console.error('Error al cargar ordesnes de recepción:', error);
    this.arrayOrdenesRecepcion = [];
  }

  recargaEstablecimientos(){
    this.estabServ.listaEstablecimientoscomplete().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.establecimientos_registrados = response.listaEstablecimientos;
          console.log(this.establecimientos_registrados);
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  verDesgloseRecepcionYDevengacion(uuid_orden_recepcion:any,folio_recepcion:any){
    this.ver_seccion_orden_recept_desglose = true;
    this.desglose_orden_recept_folio = folio_recepcion;
    this.arrayDetalleCompra = [];
    this.compraDesgloseRecepcion(uuid_orden_recepcion);
  }

  compraDesgloseRecepcion(uuid_orden_recepcion:any){
    this.arrayDetalleCompra = [];
    this.recepcionServ.detalleOrdenRecepcion(uuid_orden_recepcion).subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayDetalleCompra = response.compras;
          //this.rfcProveedor = response.compras[0]['rfc'];
          //console.log(response.compras[0]['validaTimerFact']);
          console.log(this.arrayDetalleCompra);
          this.arrayDetalleCompra.forEach((row:any) => {
            this.productos_lista = row.productos;
            this.activos_fijos_lista = row.activos_fijos;
            this.servicios_lista = row.servicios;
            this.activos_diferidos_lista = row.activos_diferidos;
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

//productos
  productoFechaCont(event:any,prodList:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && prodList;
    prodList.prod_recep_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  productoEsLoPedido(event:any,prodList:any){
    prodList.lo_pedido = event.value == 'si' ? true : false;
  }
  
  productoLlegoATiempo(event:any,prodList:any){
    prodList.llegoTiempo = event.value == 'si' ? true : false;
  }

  productoLlegoEnBuenEstado(event:any,prodList:any){
    prodList.buenEstado = event.value == 'si' ? true : false;
  }

  productoCalidadEsperada(event:any,prodList:any){
    prodList.calidadRecepcion = event.value == 'si' ? true : false;
  }
    
  productoObservaciones(event:any,prodList:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    prodList.observaciones = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }
    
  productoValidateCheck(prodList:any): boolean {
    return prodList.lo_pedido != null && prodList.llegoTiempo != null && prodList.buenEstado != null && prodList.calidadRecepcion != null && prodList.observaciones != null;
  }

  productoCheckRecep(event:any,prodList:any){
    prodList.checked_recept = event.value == 'si' ? true : false;      
    prodList.recept = event.value == 'si' ? 'true' : 'false';
  }

  productoEstablecimiento(opcion:any,prodList:any){
    var recept_estab = document.getElementById('new_ord_recept_estab_'+prodList.token_articulo);
    const estab = this.establecimientos_registrados.find((row:any) => row.estab_folio === opcion.estab_folio);
    const validacion = opcion.estab_folio != '' && this.validator.filtroAlfaNumerico(opcion.estab_folio) && typeof estab !== 'undefined'; 
    prodList.establecimiento = validacion ? estab.token_establecimiento : '';
    validacion ? this.validator.correctoSelectBrowser(recept_estab) : this.validator.errorSelectBrowser(recept_estab);
    console.log(prodList)
  }

  productoValidaRegistroRecep(prodList:any): boolean {
    return prodList.lo_pedido != null && prodList.llegoTiempo != null && prodList.buenEstado != null && prodList.calidadRecepcion != null && prodList.observaciones != null && (prodList.recept == 'false' || (prodList.recept == 'true' && prodList.establecimiento != ""));
  }

  productoGuardaRecepcion(uuid_orden_recepcion:any,token_compras:any,prodList:any){
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
        this.recepcionServ.guardarRecepcionProductos(uuid_orden_recepcion,token_compras,prodList).subscribe(
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
              this.compraDesgloseRecepcion(uuid_orden_recepcion);
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
  
//activos fijos
  activoFijoFechaCont(event:any,actfList:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && actfList;
    actfList.act_ivo_recep_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activoFijoEsLoPedido(event:any,actfList:any){
    actfList.lo_pedido = event.value == 'si' ? true : false;
  }
  
  activoFijoLlegoATiempo(event:any,actfList:any){
    actfList.llegoTiempo = event.value == 'si' ? true : false;
  }

  activoFijoLlegoEnBuenEstado(event:any,actfList:any){
    actfList.buenEstado = event.value == 'si' ? true : false;
  }

  activoFijoCalidadEsperada(event:any,actfList:any){
    actfList.calidadRecepcion = event.value == 'si' ? true : false;
  }
    
  activoFijoFoliadoSerie(event:any,actfList:any) {
    console.log(event.value);
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && actfList;
    actfList.unidad_serie = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(actfList);
  }

  activoFijoFoliadoOtros(event:any,actfList:any) {
    console.log(event.value);
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && actfList;
    actfList.unidad_otros = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(actfList);
  }

  activoFijoObservacionesFinales(event:any,actfList:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    actfList.observaciones = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }
    
  activoFijoCheckValida(actfList:any): boolean {
    return actfList.lo_pedido != null && actfList.llegoTiempo != null && actfList.buenEstado != null && actfList.calidadRecepcion != null && actfList.observaciones != null;
  }

  activoFijoCheckRecept(event:any,actfList:any){
    actfList.checked_recept = event.value == 'si' ? true : false;      
    actfList.recept = event.value == 'si' ? 'true' : 'false';
  }

  activoFijoEstablecimiento(opcion:any,actfList:any){
    console.log(opcion);
    var recept_estab = document.getElementById('new_ord_recept_estab_'+actfList.token_activof_unidad);
    const estab = this.establecimientos_registrados.find((row:any) => row.estab_folio === opcion.estab_folio);
    const validacion = opcion.estab_folio != '' && this.validator.filtroAlfaNumerico(opcion.estab_folio) && typeof estab !== 'undefined'; 
    actfList.establecimiento = validacion ? estab.token_establecimiento : '';
    validacion ? this.validator.correctoSelectBrowser(recept_estab) : this.validator.errorSelectBrowser(recept_estab);
    console.log(actfList.establecimiento)
  }

  activoFijoValidaRegistroRecep(actfList:any): boolean {
    return !actfList.recibido && actfList.lo_pedido != null && actfList.llegoTiempo != null && actfList.buenEstado != null && actfList.calidadRecepcion != null && actfList.observaciones != null && (actfList.recept == 'false' || (actfList.recept == 'true' && actfList.establecimiento != ""));
  }

  activoFijoGuardaRecepcion(uuid_orden_recepcion:any,token_compras:any,actfList:any){
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
        console.log(actfList.token_activof_unidad);
        const art_activo = this.activos_fijos_lista.filter((row:any) => row.token_activof_unidad === actfList.token_activof_unidad);//token_activof_unidad
        this.actFijo.guardarRecepcionActivos(token_compras,art_activo).subscribe(
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
              this.compraDesgloseRecepcion(uuid_orden_recepcion);
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

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
