import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ComprasServService } from '../../../../../servicios/ssic/compras-serv.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { Subject, takeUntil } from 'rxjs';
import { OrdenesDevengacionService } from '../../../../../servicios/ssic/ordenes-devengacion-service';

@Component({
  selector: 'app-contabilidad-devengacion-servicios',
  standalone: false,
  templateUrl: './contabilidad_ordenes_devengacion.component.html',
  styleUrls: [
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/navegador.css',
    '../../contabilidad.css',
    './contabilidad_ordenes_devengacion.component.css'
  ]
})
export class ContabilidadOrdenesDevengacionComponent implements OnInit, OnDestroy {
  indicadorDevengacion:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoDevengacion: Date[] | undefined;
  arrayOrdenesDevengacion:any = [];

  public desglose_orden_folio:string = "";
  public ver_seccion_desglose:boolean = false;
  arrayDetalleCompra:any = [];
  servicios_lista:any = [];
  activos_diferidos_lista:any = [];

  public filesDevengacion: NgxFileDropEntry[] = [];
  public docsDevengacionAnexos:any [] = [];
  public docsDevengacionNames:any = [];

  private destruir$ = new Subject<void>();

  constructor(
    private _comprServ: ComprasServService,
    private devengacionServ: OrdenesDevengacionService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private cd: ChangeDetectorRef
  ){
  }

  ngOnInit(): void {
    this.listGeneralDevengacion('hoy');
  }

  listGeneralDevengacion(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDevengacion = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var dev_otras_fechas = document.getElementById("dev_otras_fechas");
      if (this.rangoPeriodoDevengacion && this.rangoPeriodoDevengacion.length === 2) {
        const dateInicio = this.rangoPeriodoDevengacion[0];
        const dateFin = this.rangoPeriodoDevengacion[1];
        if (dateInicio && dateFin) {
          periodo_inicio = dateInicio.toISOString().split('T')[0];
          periodo_fin = dateFin.toISOString().split('T')[0];
          this.validator.correctoInputRow(dev_otras_fechas);
        } else {
          this.validator.errorInputRow(dev_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(dev_otras_fechas);
        return;
      }
    }

    this.devengacionServ.listaDevengacionOrden(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_deveng(response),
      error: (err) => this.error_alerta_deveng(err)
    });
  }

  procesar_respuesta_deveng(response: any){
    if (response.status === 'success') {
      this.arrayOrdenesDevengacion = response.ordenes;
      this.cd.detectChanges();
    } else {
      this.arrayOrdenesDevengacion = [];
    }
  }

  error_alerta_deveng(error: any){
    console.error('Error al cargar órdenes de devengación:', error);
    this.arrayOrdenesDevengacion = [];
  }

  verDesgloseDevengacion(uuid_orden_devengacion:any,folio_devengacion:any){
    this.ver_seccion_desglose = true;
    this.desglose_orden_folio = folio_devengacion;
    this.arrayDetalleCompra = [];
    this.compraDesgloseDevengacion(uuid_orden_devengacion);
  }

  compraDesgloseDevengacion(uuid_orden_devengacion:any){
    this.arrayDetalleCompra = [];
    this.devengacionServ.detalleDevengacion(uuid_orden_devengacion).subscribe({
      next: (response) => {
        if (response.status == 'success') {
          this.arrayDetalleCompra = response.compras;
          this.arrayDetalleCompra.forEach((row:any) => {
            this.servicios_lista = row.servicios;
            this.activos_diferidos_lista = row.activos_diferidos;
          });
        }
      },
      error: (err) => console.log(err)
    });
  }

  validaFechaDevengado(event:any,token_activof_unidad:any,token_detcompra:any, es_servicio:boolean){
    const list = es_servicio ? this.servicios_lista : this.activos_diferidos_lista;
    const item = list.find((row:any) => row.token_activof_unidad === token_activof_unidad && row.token_detcompra === token_detcompra);
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) == true && typeof item !== 'undefined';
    item.fecha_devengado = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  observacionesKeyup(event:any,token_activof_unidad:any,token_detcompra:any, es_servicio:boolean){
    const list = es_servicio ? this.servicios_lista : this.activos_diferidos_lista;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    const item = list.find((row:any) => row.token_activof_unidad === token_activof_unidad && row.token_detcompra === token_detcompra);
    item.observaciones = validacion ? event.value : '';
  }

  validateRegistroDevengar(token_activof_unidad:any,token_detcompra:any, es_servicio:boolean): boolean {
    const list = es_servicio ? this.servicios_lista : this.activos_diferidos_lista;
    const item = list.find((row:any) => row.token_activof_unidad === token_activof_unidad && row.token_detcompra === token_detcompra);
    return item && item.fecha_devengado && item.fecha_devengado != '' && item.observaciones && item.observaciones != '';
  }

  public droppedFiles(files: NgxFileDropEntry[],token_activof_unidad:any, es_servicio:boolean) {
    const list = es_servicio ? this.servicios_lista : this.activos_diferidos_lista;
    const art = list.find((row:any) => row.token_activof_unidad === token_activof_unidad);
    art.archivos_cargados_names = [];
    art.archivos_cargados_files = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i];
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          var nameFile = file.name;
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(file.type) == true) {
            art.archivos_cargados_names.push({"typoElement":this.validator.devuelveTipoArchivo(file.type),"nameFile":nameFile});
            art.archivos_cargados_files.push(file);
          } else {
            let mensajeError = file.size > 2000000 ? 'El archivo '+nameFile+' excede el tamaño permitido (2MB)' : 'El archivo '+nameFile+' debe ser en formato pdf, xml, png o jpg';
            Swal.fire({ position:'top-end', icon: 'warning', title: mensajeError, showConfirmButton:false, timer: 3000 });
          }
        });
      }
    }
  }

  guardaDevengacion(uuid_orden_devengacion:any,token_compras:any,token_detcompra:any,token_activof_unidad:any, es_servicio:boolean){
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
        const list = es_servicio ? this.servicios_lista : this.activos_diferidos_lista;
        const filtered = list.filter((row:any) => row.token_activof_unidad === token_activof_unidad && row.token_detcompra === token_detcompra);

        let archivos_files: File[] = [];
        let archivos_names: any[] = [];

        filtered.forEach((item:any) => {
          if (Array.isArray(item.archivos_cargados_files)) { archivos_files.push(...item.archivos_cargados_files); }
          if (Array.isArray(item.archivos_cargados_names)) { archivos_names.push(...item.archivos_cargados_names); }
        });

        this.devengacionServ.guardarDevengacionServicio(token_compras,filtered,archivos_files,archivos_names).subscribe({
          next: (response) => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({ position:'center', icon: 'success', title: translate_response, showConfirmButton:false, timer: 3000 });
              this.listGeneralDevengacion(this.indicadorDevengacion);
              this.compraDesgloseDevengacion(uuid_orden_devengacion);
            } else {
              Swal.fire({ position:'top-end', icon: 'warning', title: translate_response, showConfirmButton:false, timer: 3000 });
            }
          },
          error: (err) => console.log(err)
        });
      }
    })
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
