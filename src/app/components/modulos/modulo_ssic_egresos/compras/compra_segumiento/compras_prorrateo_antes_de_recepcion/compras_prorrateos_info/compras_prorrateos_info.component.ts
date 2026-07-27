import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { ComprasServService } from '../../../../../../../servicios/ssic/compras-serv.service';
import { ProductosService } from '../../../../../../../servicios/ssic/productos.service';
import { ActFijosService } from '../../../../../../../servicios/ssic/act-fijos.service';
import { ActIntangiblesService } from '../../../../../../../servicios/ssic/act-intangibles.service';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import { MonedasService } from '../../../../../../../servicios/monedas.service';
import { TranslateService } from '@ngx-translate/core';
import { prorrateoModelo } from '../../../../../../../modelos/prorrateoModelo';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app_egresos_compras_prorrateos_info',
  templateUrl: './compras_prorrateos_info.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/datatable.css',
    '../../../../../../../styles/dropdown.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/file_input.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/landing.css',
    '../../../../../../../styles/explain.css',
    '../../../../../../../styles/switches.css',
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/diseños_contables.css',
    '../../../../egresos.css',
    './compras_prorrateos_info.component.css'
  ]
})
export class ComprasProrrateosInfoComponent implements OnInit, OnDestroy {
  public prorratModelo: prorrateoModelo;
  public tokenProrrateoCompra: string = '';
  public porcentajeTotal: string = '100.00';
  public prorrateoTotal: number = 0;
  public calculaTotalProrrateo: number = 0; // Se volvió variable común para optimizar rendimiento
  public boolCalcular: boolean = false;

  private subs: Subscription = new Subscription();

  detalleProrrateo: any = [];
  gastosADistribuir: any = [];
  prorrateoVerHistorial: any;
  historialProrrateo: any = [];

  listaOpcion: any = [
    { clave: "mercancias", valor: "Mercancias" },
    { clave: "actFijos", valor: "Activos fijos" },
    { clave: "actDiferidos", valor: "Activos Diferidos" }
  ];
  public opcionProrrateoSelect: string = '';

  arrayMercancias: any = [];
  arrayActivosFijos: any = [];
  arrayActivosDiferidos: any = [];
  arraySelectedProrrateos: any = [];
  listaverticalProrrat: any = [];
  
  public prorrateo_fecha_contabilizacion: string = "";
  catalogo_monedas_api: any = [];
  prorrateo_moneda_opcion = null;
  public moneda_monedaOrden: string = '';
  public decimales_monedaOrden: number = 0;
  public prorrateo_moneda_code: string = "";
  public prorrateo_moneda_decimales: number = 0;

  constructor(
    private validator: ValidatorServService,
    private _comprServ: ComprasServService,
    private prodServ: ProductosService,
    private actFijosServ: ActFijosService,
    private _intanServ: ActIntangiblesService,
    private servicioMonedas: MonedasService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.prorratModelo = new prorrateoModelo("", 0, "", 0, 0, "", "", "", "", "", "", "", "", 0);
  }

  @Input() set tokenProrrateo(value: string) {
    if (value) {
      this.tokenProrrateoCompra = value;
      this.verfInfoProrrateo();
    }
  }

  ngOnInit(): void {
    this.monedas_lista();
    this.monedaEmpresa();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  public parseNum(value: any): number {
    return parseFloat(value) || 0;
  }


  monedas_lista() {
    this.subs.add(
      this.servicioMonedas.getApiMonedasCatalogo().subscribe(response => {
        if (response.status === 'success') {
          this.catalogo_monedas_api = response.monedas;
        }
      })
    );
  }

  monedaEmpresa() {
    this.subs.add(
      this.servicioMonedas.monedaEmpresa().subscribe(response => {
        if (response.status === 'success') {
          this.moneda_monedaOrden = response.moneda;
          this.decimales_monedaOrden = response.decimales;
        }
      })
    );
  }

  verfInfoProrrateo() {
    this.subs.add(
      this._comprServ.detailProrrateos(this.tokenProrrateoCompra).subscribe(response => {
        if (response.status === 'success') {
          this.detalleProrrateo = response.datosProrrateo;
          this.gastosADistribuir = [];
          response.datosProrrateo.forEach((prt: any) => {
            this.gastosADistribuir = prt.detcompra.map((g: any) => {
              g.resta = g.resta !== undefined ? parseFloat(g.resta) : parseFloat(g.total || 0);
              g.restaFormat = g.resta.toFixed(this.decimales_monedaOrden);
              g.viewPrort = g.resta <= 0 ? 'pointer-events: none; opacity: 0.6;' : '';
              g.selected = false;
              g.cant_art_prorrateo = 0;
              return g;
            });
          });
          this.cd.detectChanges();
        }
      })
    );
  }

  prodMercanciasProcessBuyFaceProrrateos() {
    this.subs.add(
      this.prodServ.prodMercanciasProcessBuyFaceProrrateos(0).subscribe(response => {
        if (response.status === 'success') {
          this.arrayMercancias = response.listado.map((m: any) => ({ ...m, merc_selected: false }));
        }
      })
    );
  }

  activoscomprasFijosGet() {
    this.subs.add(
      this.actFijosServ.activoscomprasFijosGet(0).subscribe(response => {
        if (response.status === 'success') {
          this.arrayActivosFijos = response.datosActivo.map((a: any) => ({ ...a, act_fijo_selected: false }));
        }
      })
    );
  }

  activoscomprasdiferidosGet() {
    this.subs.add(
      this._intanServ.activoscomprasdiferidosGet(0).subscribe(response => {
        if (response.status === 'success') {
          this.arrayActivosDiferidos = response.datosActivo.map((a: any) => ({ ...a, act_fijo_selected: false }));
        }
      })
    );
  }

  select_fecha_contabilizacion(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.prorrateo_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupMonedaPagoSave(opcion: any) {
    const selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    this.prorrateo_moneda_code = typeof mnd !== 'undefined' ? mnd.code : '';
    this.prorrateo_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    typeof mnd !== 'undefined' ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  verHistorialProrrateo(itemGasto: any, token_prorrateo: any) {
    this.prorrateoVerHistorial = this.prorrateoVerHistorial === itemGasto ? null : itemGasto;
    if (this.prorrateoVerHistorial === itemGasto) {
      this.descargarHistorialProrrateo(token_prorrateo, itemGasto);
    }
  }

  descargarHistorialProrrateo(token_prorrateo: any, itemGasto: any) {
    this.subs.add(
      this._comprServ.historialegresosprorrateos(token_prorrateo, itemGasto.token_detalle_prorrt).subscribe(response => {
        if (response.status === 'success') {
          this.historialProrrateo = response.datosProrrateo;
        }
      })
    );
  }

  deleteHistorialProrrateo(token_prorrateo: any, token_detalle_prorrt: any, token_rel_prort: any, token_detcompra: any) {
    this.subs.add(
      this._comprServ.deletehistorialegresosprorrateos(token_prorrateo, token_detalle_prorrt, token_rel_prort, token_detcompra).subscribe(response => {
        let translate_response = this.translate.instant(response.message);
        if (response.status === 'success') {
          Swal.fire({ position: 'center', icon: 'success', title: translate_response, showConfirmButton: false, timer: 2000 });
          this.verfInfoProrrateo();
        } else {
          Swal.fire({ position: 'top-end', icon: 'warning', title: translate_response, showConfirmButton: false, timer: 3000 });
        }
      })
    );
  }

  cantProrrateo(event: any, itemGasto: any) {
    const val = parseFloat(event.value) || 0;
    const validacion = event.value != '' && this.validator.filtroCosto(event.value) && val <= itemGasto.resta && val > 0;
    itemGasto.cant_art_prorrateo = validacion ? val : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  enableSelectGasto(itemGasto: any): boolean {
    return itemGasto.resta > 0 && itemGasto.cant_art_prorrateo > 0;
  }

  selectProrratea(event: any, itemGasto: any) {
    const montoConfirmado = parseFloat(itemGasto.cant_art_prorrateo) || 0;
    if (event.checked && montoConfirmado > 0) {
      itemGasto.selected = true;
      itemGasto.resta = parseFloat((itemGasto.resta - montoConfirmado).toFixed(this.decimales_monedaOrden));
      itemGasto.restaFormat = itemGasto.resta.toFixed(this.decimales_monedaOrden);

      this.listaverticalProrrat.push({
        "name": itemGasto.articulo,
        "token_detalle_prorrt": itemGasto.token_detalle_prorrt,
        "token_prorrateo": this.tokenProrrateoCompra,
        "cant_art_prorrateo_contable": montoConfirmado.toFixed(this.decimales_monedaOrden),
        "cant_art_prorrateo_fiscal": montoConfirmado.toFixed(this.decimales_monedaOrden),
        "total_prorrateo": 0,
        "aplica_contable": true, // Gasto Contable por defecto activo e independiente
        "aplica_fiscal": true    // Gasto Fiscal por defecto activo e independiente
      });

      if (itemGasto.resta <= 0) {
        itemGasto.viewPrort = 'pointer-events: none; opacity: 0.6;';
      }
    } else {
      event.checked = false;
      const itemEliminar = this.listaverticalProrrat.findIndex((rowVert: any) => rowVert.token_detalle_prorrt === itemGasto.token_detalle_prorrt);
      if (itemEliminar !== -1) {
        this.listaverticalProrrat.splice(itemEliminar, 1);
      }
      itemGasto.viewPrort = '';
      itemGasto.selected = false;
      itemGasto.resta = parseFloat(itemGasto.total || 0);
      itemGasto.restaFormat = itemGasto.resta.toFixed(this.decimales_monedaOrden);
      itemGasto.cant_art_prorrateo = 0;
    }
    this.recorreSelectedProrrateos();
    this.calcularProrrateoPorc();
  }

  // Permite activar/desactivar dinámicamente si el gasto aplica a nivel contable o fiscal
  toggleGastoOpcional(tipo: 'contable' | 'fiscal', indexGastoVertical: number) {
    if (this.listaverticalProrrat[indexGastoVertical]) {
      if (tipo === 'contable') {
        this.listaverticalProrrat[indexGastoVertical].aplica_contable = !this.listaverticalProrrat[indexGastoVertical].aplica_contable;
      } else {
        this.listaverticalProrrat[indexGastoVertical].aplica_fiscal = !this.listaverticalProrrat[indexGastoVertical].aplica_fiscal;
      }
      this.calcularProrrateoPorc();
    }
  }

  prorrateoAplicarA(clave: any) {
    var prorrateables = document.getElementById("prorrateables");
    let option = this.listaOpcion.find((row: any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof option !== 'undefined';
    this.opcionProrrateoSelect = validacion ? option.clave : '';
    validacion ? this.validator.correctoSelectBrowser(prorrateables) : this.validator.errorSelectBrowser(prorrateables);
    if (validacion) {
      if (clave === 'mercancias' && this.arrayMercancias.length === 0) this.prodMercanciasProcessBuyFaceProrrateos();
      if (clave === 'actFijos' && this.arrayActivosFijos.length === 0) this.activoscomprasFijosGet();
    }
  }

  extraeDetalleInterior(prtMerc: any, gastos: any) {
    return gastos.map((gasto: any) => ({
      "costo_ajustado": prtMerc.costo_ajustado,
      "totalDetCompFormat": prtMerc.totalDetCompFormat || prtMerc.costo_ajustado_format,
      "numero_articulos_prorratea": prtMerc.cantidad,
      "cant_art_prorrateo_contable": gasto.cant_art_prorrateo_contable,
      "cant_art_prorrateo_fiscal": gasto.cant_art_prorrateo_fiscal,
      "porcentaje_juega": parseFloat('0').toFixed(this.decimales_monedaOrden),
      "result_porcentaje_contable_juega": parseFloat('0').toFixed(this.decimales_monedaOrden),
      "result_porcentaje_fiscal_juega": parseFloat('0').toFixed(this.decimales_monedaOrden),
      "total_prorrateo": prtMerc.totalProrrateo || 0,
      "desv_art_prorrateo": prtMerc.desvioProrrateo || 0,
      "token_prorrateo": gasto.token_prorrateo,
      "token_detalle_prorrt": gasto.token_detalle_prorrt,
      "token_art_detbuy_prorrateo": prtMerc.token_detcompra,
      "total_detalle": prtMerc.costo_ajustado,
      "totalCompra": prtMerc.totalCompra || 1,
    }));
  }

  recorreSelectedProrrateos() {
    this.arraySelectedProrrateos.forEach((prtSel: any) => {
      const detallePrevio = prtSel.detalle || [];
      // Regeneramos el mapeo interno basado en los elementos vigentes de la tabla vertical
      const nuevoDetalle = this.extraeDetalleInterior({
        costo_ajustado: prtSel.costo_ajustado,
        totalDetCompFormat: prtSel.costo_ajustado_format,
        cantidad: prtSel.detalle[0]?.numero_articulos_prorratea || 1,
        token_detcompra: prtSel.token_art_detbuy_prorrateo
      }, this.listaverticalProrrat);
      
      prtSel.detalle = nuevoDetalle.map((nuevoDet: any) => {
        const matchPrevio = detallePrevio.find((prevDet: any) => prevDet.token_detalle_prorrt === nuevoDet.token_detalle_prorrt);
        if (matchPrevio && matchPrevio.is_fiscal_manual === true) {
          nuevoDet.is_fiscal_manual = true;
          nuevoDet.result_porcentaje_fiscal_juega = matchPrevio.result_porcentaje_fiscal_juega;
        }
        return nuevoDet;
      });

      if (this.arraySelectedProrrateos.length === 1) {
        prtSel.trPorcentaje_juega = parseFloat('100').toFixed(this.decimales_monedaOrden);
        prtSel.detalle.forEach((selDet: any) => { selDet.porcentaje_juega = parseFloat('100').toFixed(this.decimales_monedaOrden); });
        this.porcentajeTotal = parseFloat('100').toFixed(this.decimales_monedaOrden);
        this.boolCalcular = true;
      } else {
        prtSel.trPorcentaje_juega = parseFloat('0').toFixed(this.decimales_monedaOrden);
        prtSel.detalle.forEach((selDet: any) => { selDet.porcentaje_juega = parseFloat('0').toFixed(this.decimales_monedaOrden); });
      }
    });
  }

  calcularProrrateoPorc() {
    let sumatoria_total_prorrat: number = 0;
    this.listaverticalProrrat.forEach((gasto: any) => gasto.total_prorrateo = 0);

    this.arraySelectedProrrateos.forEach((prtSel: any) => {
      let acumuladoTrTotales: number = 0;
      const total_precio_unitario = parseFloat(prtSel.costo_ajustado) || 0;

      prtSel.detalle.forEach((detSelectos: any, index: number) => {
        const gastoVertical = this.listaverticalProrrat[index];
        if (!gastoVertical) return;

        const total_detalle = parseFloat(detSelectos.total_detalle) || 0;
        const totalCompra = parseFloat(detSelectos.totalCompra) || 1;
        const porcentaje = (parseFloat(detSelectos.porcentaje_juega) || 0) / 100;
        const resultCantProrrateoContable = (parseFloat(detSelectos.cant_art_prorrateo_contable) || 0) * porcentaje;
        const resultCantProrrateoFiscal = (parseFloat(detSelectos.cant_art_prorrateo_fiscal) || 0) * porcentaje;

        // Se evalúa dinámicamente si el cálculo contable o fiscal está activo por el usuario
        detSelectos.result_porcentaje_contable_juega = gastoVertical.aplica_contable ? resultCantProrrateoContable.toFixed(this.decimales_monedaOrden) : (0).toFixed(this.decimales_monedaOrden);
        if (detSelectos.is_fiscal_manual === true) {
          detSelectos.result_porcentaje_fiscal_juega = parseFloat(detSelectos.result_porcentaje_fiscal_juega).toFixed(this.decimales_monedaOrden);
        } else {
          detSelectos.result_porcentaje_fiscal_juega = gastoVertical.aplica_fiscal ? resultCantProrrateoFiscal.toFixed(this.decimales_monedaOrden) : (0).toFixed(this.decimales_monedaOrden);
        }
        
        gastoVertical.cant_art_prorrateo_contable = gastoVertical.aplica_contable ? detSelectos.result_porcentaje_contable_juega : (0).toFixed(this.decimales_monedaOrden);
        gastoVertical.cant_art_prorrateo_fiscal = gastoVertical.aplica_fiscal ? detSelectos.result_porcentaje_fiscal_juega : (0).toFixed(this.decimales_monedaOrden);

        const prorrateoUno = resultCantProrrateoContable * (total_detalle / totalCompra);
        const prorrateoDos = prorrateoUno / (parseFloat(detSelectos.numero_articulos_prorratea) || 1);

        detSelectos.total_prorrateo = prorrateoUno.toFixed(this.decimales_monedaOrden);

        if (prtSel.tipo_art_prorrateo === 'mercancia') {
          acumuladoTrTotales += prorrateoDos;
          detSelectos.desv_art_prorrateo = prorrateoDos.toFixed(this.decimales_monedaOrden);
          gastoVertical.total_prorrateo += prorrateoDos;
        } else {
          detSelectos.desv_art_prorrateo = 'NA';
          acumuladoTrTotales += resultCantProrrateoContable;
          gastoVertical.total_prorrateo += resultCantProrrateoContable;
        }
      });

      sumatoria_total_prorrat += (total_precio_unitario + acumuladoTrTotales);
      prtSel.trTotales = acumuladoTrTotales.toFixed(this.decimales_monedaOrden);
    });

    let localSumProrrateo = 0;
    this.listaverticalProrrat.forEach((gasto: any) => {
      localSumProrrateo += gasto.total_prorrateo;
      gasto.total_prorrateo = gasto.total_prorrateo.toFixed(this.decimales_monedaOrden);
    });

    this.calculaTotalProrrateo = localSumProrrateo;
    this.prorrateoTotal = sumatoria_total_prorrat;
  }

  selectMercanciaProrrateada(event: any, prtMerc: any) {
    this.boolCalcular = false;
    if (event.checked) {
      prtMerc.merc_selected = true;
      this.arraySelectedProrrateos.push({
        "tipo_art_prorrateo": 'mercancia',
        "name_art_prorrateo": prtMerc.producto,
        "token_art_detbuy_prorrateo": prtMerc.token_detcompra,
        "token_art_prorrateo": prtMerc.token_cat_productos,
        "costo_ajustado": prtMerc.costo_ajustado,
        "costo_ajustado_format": prtMerc.costo_ajustado_format,
        "trTotales": (0).toFixed(this.decimales_monedaOrden),
        "trPorcentaje_juega": (0).toFixed(this.decimales_monedaOrden),
        "detalle": []
      });
    } else {
      prtMerc.merc_selected = false;
      const idx = this.arraySelectedProrrateos.findIndex((p: any) => p.token_art_prorrateo === prtMerc.token_cat_productos);
      if (idx !== -1) this.arraySelectedProrrateos.splice(idx, 1);
    }
    this.recorreSelectedProrrateos();
    this.calcularProrrateoPorc();
  }

  selectActivoFijoProrrateado(event: any, actfList: any) {
    this.boolCalcular = false;
    if (event.checked) {
      actfList.act_fijo_selected = true;
      this.arraySelectedProrrateos.push({
        "tipo_art_prorrateo": 'activo fijo',
        "name_art_prorrateo": actfList.activo + " - " + actfList.folio_activof_unidad,
        "token_art_detbuy_prorrateo": actfList.token_detcompra,
        "token_art_prorrateo": actfList.token_act_fijos,
        "token_activof_unidad": actfList.token_activof_unidad,
        "costo_ajustado": actfList.costo_ajustado,
        "costo_ajustado_format": actfList.costo_ajustado_format + " " + actfList.moneda,
        "trTotales": (0).toFixed(this.decimales_monedaOrden),
        "trPorcentaje_juega": (0).toFixed(this.decimales_monedaOrden),
        "detalle": []
      });
    } else {
      actfList.act_fijo_selected = false;
      const idx = this.arraySelectedProrrateos.findIndex((p: any) => p.token_activof_unidad === actfList.token_activof_unidad);
      if (idx !== -1) this.arraySelectedProrrateos.splice(idx, 1);
    }
    this.recorreSelectedProrrateos();
    this.calcularProrrateoPorc();
  }

  selectActivoDiferidoProrrateado(event: any, actfList: any) {
    this.boolCalcular = false;
    if (event.checked) {
      actfList.act_diferido_selected = true;
      this.arraySelectedProrrateos.push({
        "tipo_art_prorrateo": 'activo diferido',
        "name_art_prorrateo": actfList.activo + " - " + actfList.folio_activod_unidad,
        "token_art_detbuy_prorrateo": actfList.token_detcompra,
        "token_art_prorrateo": actfList.token_act_intang,
        "token_activof_unidad": actfList.token_activod_unidad,
        "costo_ajustado": actfList.costo_ajustado,
        "costo_ajustado_format": actfList.costo_ajustado_format + " " + actfList.moneda,
        "trTotales": (0).toFixed(this.decimales_monedaOrden),
        "trPorcentaje_juega": (0).toFixed(this.decimales_monedaOrden),
        "detalle": []
      });
    } else {
      actfList.act_diferido_selected = false;
      const idx = this.arraySelectedProrrateos.findIndex((p: any) => p.token_activod_unidad === actfList.token_activod_unidad);
      if (idx !== -1) this.arraySelectedProrrateos.splice(idx, 1);
    }
    this.recorreSelectedProrrateos();
    this.calcularProrrateoPorc();
  }

  percentProrrateo(event: any, iPosition: any, token_art_detbuy_prorrateo: any) {
    const selectos = this.arraySelectedProrrateos[iPosition];
    let percentFor: number = 0;
    const valInput = parseFloat(event.value) || 0;

    if (event.value != '' && this.validator.filtroCosto(event.value) && selectos['token_art_detbuy_prorrateo'] === token_art_detbuy_prorrateo) {
      selectos['trPorcentaje_juega'] = valInput;
      selectos['detalle'].forEach((d: any) => d.porcentaje_juega = valInput.toFixed(this.decimales_monedaOrden));

      this.arraySelectedProrrateos.forEach((dSel: any) => {
        if (dSel['trPorcentaje_juega'] != "" && this.validator.filtroCosto(dSel['trPorcentaje_juega'])) {
          percentFor += parseFloat(dSel['trPorcentaje_juega']) || 0;
        }
      });

      this.porcentajeTotal = percentFor.toFixed(this.decimales_monedaOrden);

      if (percentFor < 100) {
        this.validator.correctoInputRow(event);
        this.boolCalcular = false;
      } else if (percentFor === 100) {
        this.validator.correctoInputRow(event);
        this.boolCalcular = true;
      } else {
        this.validator.errorInputRow(event);
        this.boolCalcular = false;
      }
    } else {
      this.validator.errorInputRow(event);
      this.boolCalcular = false;
      selectos['trPorcentaje_juega'] = 0;
      selectos['detalle'].forEach((d: any) => d.porcentaje_juega = (0).toFixed(this.decimales_monedaOrden));
      
      this.arraySelectedProrrateos.forEach((dSel: any) => {
        percentFor += parseFloat(dSel['trPorcentaje_juega']) || 0;
      });
      this.porcentajeTotal = percentFor.toFixed(this.decimales_monedaOrden);
    }
    this.calcularProrrateoPorc();
  }

gastoFiscalManual(event: any, detalle: any) {
  const valorInput = parseFloat(event.value);
  console.log(valorInput);
  
  if (detalle) {
    // Validamos que sea un número válido y que no sea negativo
    if (!isNaN(valorInput) && valorInput >= 0) {
      this.validator.correctoInputRow(event);
      
      // Activamos la bandera para que calcularProrrateoPorc() no lo sobreescriba con el porcentaje
      detalle.is_fiscal_manual = true; 
      detalle.result_porcentaje_fiscal_juega = valorInput.toFixed(this.decimales_monedaOrden);
    } else {
      // Si el usuario borra el campo o mete un valor inválido, quitamos la bandera manual
      this.validator.errorInputRow(event);
      detalle.is_fiscal_manual = false;
    }
    console.log(detalle);
    console.log(this.arraySelectedProrrateos);
    
    // Forzamos el recálculo global de las sumatorias horizantales y verticales
    this.calcularProrrateoPorc();
    this.cd.detectChanges();
  }
}

  btnDeleteProrrateoVertical(selectHead: any) {
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
        const index_eliminar = this.listaverticalProrrat.findIndex((row: any) => row.token_detalle_prorrt === selectHead.token_detalle_prorrt);
        if (index_eliminar !== -1) {
          const elementoAEliminar = this.listaverticalProrrat[index_eliminar];
          const del_cant_art_prorrateo = parseFloat(elementoAEliminar?.cant_art_prorrateo) || 0;
          this.listaverticalProrrat.splice(index_eliminar, 1);

          this.gastosADistribuir.forEach((compraProrrateo: any) => {
            if (compraProrrateo.token_detalle_prorrt === selectHead.token_detalle_prorrt) {
              compraProrrateo.viewPrort = '';
              compraProrrateo.selected = false;
              compraProrrateo.resta = parseFloat((compraProrrateo.resta + del_cant_art_prorrateo).toFixed(this.decimales_monedaOrden));
              compraProrrateo.restaFormat = compraProrrateo.resta.toFixed(this.decimales_monedaOrden);
              compraProrrateo.cant_art_prorrateo = 0;
            }
          });
        }

        if (this.listaverticalProrrat.length === 0) {
          this.arraySelectedProrrateos = [];
          this.porcentajeTotal = (0).toFixed(this.decimales_monedaOrden);
          this.boolCalcular = false;
        } else {
          this.recorreSelectedProrrateos();
        }

        this.calcularProrrateoPorc();
        this.cd.detectChanges();
      }
    });
  }

  btnDeleteProrrateoHorizontal(iPosition: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este prorrateo?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete") || 'Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        const itemRemovido = this.arraySelectedProrrateos[iPosition];
        
        // Desmarcar en las tablas de origen de selección para que puedan volver a seleccionarse
        if(itemRemovido.tipo_art_prorrateo === 'mercancia') {
          const target = this.arrayMercancias.find((m:any) => m.token_detcompra === itemRemovido.token_art_detbuy_prorrateo);
          if(target) target.merc_selected = false;
        } else if(itemRemovido.tipo_art_prorrateo === 'activo fijo') {
          const target = this.arrayActivosFijos.find((a:any) => a.token_activof_unidad === itemRemovido.token_activof_unidad);
          if(target) target.act_fijo_selected = false;
        }

        this.arraySelectedProrrateos.splice(iPosition, 1);
        this.boolCalcular = this.arraySelectedProrrateos.length === 1;

        this.recorreSelectedProrrateos();
        this.calcularProrrateoPorc();
        this.cd.detectChanges();
      }
    });
  }

  get validaSaveProrrateo(): boolean {
    const validacion_fecha_contabilizacion = this.prorrateo_fecha_contabilizacion != "" && this.validator.filtroFecha(this.prorrateo_fecha_contabilizacion);
    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.prorrateo_moneda_code);
    const validacion_moneda = this.prorrateo_moneda_code != '' && this.validator.filtroAlfaNumerico(this.prorrateo_moneda_code) && typeof mnd !== 'undefined';
    const porcentajeTotalNum = parseFloat(this.porcentajeTotal);

    return !!(validacion_fecha_contabilizacion && validacion_moneda && 
           this.arraySelectedProrrateos?.length > 0 && 
           this.listaverticalProrrat?.length > 0 && 
           porcentajeTotalNum === 100);
  }

  btnGuardarProrrateoAffect() {
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
        if (this.arraySelectedProrrateos.length !== 0) {
          // Inyección final: Mapeamos los estados opcionales contables/fiscales al payload antes de enviar
          const payloadFinal = this.arraySelectedProrrateos.map((prt: any) => {
            const clon = { ...prt };
            clon.detalle = clon.detalle.map((det: any, index: number) => {
              const vConfig = this.listaverticalProrrat[index];
              return {
                ...det,
                aplica_contable: vConfig ? vConfig.aplica_contable : true,
                aplica_fiscal: vConfig ? vConfig.aplica_fiscal : true
              };
            });
            return clon;
          });

          this.subs.add(
            this._comprServ.guardarprorrateos(this.prorrateo_fecha_contabilizacion, this.prorrateo_moneda_code, payloadFinal).subscribe(response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status === 'success') {
                Swal.fire({ position: 'center', icon: 'success', title: translate_response, showConfirmButton: false, timer: 2500 });
                
                // Reseteo limpio de estados de prorrateo sin recargar la SPA completa
                this.arraySelectedProrrateos = [];
                this.listaverticalProrrat = [];
                this.porcentajeTotal = (0).toFixed(this.decimales_monedaOrden);
                this.verfInfoProrrateo();
              } else {
                Swal.fire({ position: 'top-end', icon: 'warning', title: translate_response, showConfirmButton: false, timer: 3000 });
              }
            })
          );
        } else {
          Swal.fire({ position: 'top-end', icon: 'warning', title: 'debe seleccionar productos en compras autorizadas para hacer el prorrateo correspondiente', showConfirmButton: false, timer: 3000 });
        }
      }
    });
  }
}