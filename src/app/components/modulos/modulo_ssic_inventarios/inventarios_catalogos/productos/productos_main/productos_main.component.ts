import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input, HostListener, signal, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ProductosService } from '../../../../../../servicios/ssic/productos.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
//import * as XLSX from "xlsx";
import { productoAngularModelo } from '../../../../../../modelos/productoAngularModelo';
import { ClasificacionService } from '../../../../../../servicios/ssic/clasificacion.service';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { UniMedServService } from '../../../../../../servicios/uni-med-serv.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import numeral from 'numeral';
import convert from 'convert';
import { Table } from 'primeng/table';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-interno-egresos-catalogos-listaprod',
  templateUrl: './productos_main.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
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
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/navegador.css',
    '../../../inventarios.css',
    './productos_main.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class ProductosInventariosMainComponent implements OnInit, OnDestroy {
  loading_prod = false;
  
  public usuario: Usuarios;
  public prdCategoriasWindow:boolean = false;
  public registroPrdInventarioWindow:boolean = false;
  public registroPrdMostradorWindow:boolean = false;
  public modelProd: productoAngularModelo;

  //productos
  buscarProductosTRUE:any = [];
  listaProductosTRUE:any = [];
  indicadorProductosList:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoProductos: Date[] | undefined;
  public prodGeneralesWindow:boolean = false;
  productoDetalleInfo:any = [];
  public prodMostradorWindow:boolean = false;
  productoMostradorDetalle:any = [];

  public prodAlmacenWindow:boolean = false;
  productoAlmacenDetalle:any = [];

  listaProductosFALSE:any = [];
  public listaPrdDeletedWindow:boolean = false;

  listaProductosTimeline:any = [];

  //detalle
  arrayClasifProductos:any = [];
  arrayGeneroClass:any = [];
  catalogoMonedasApi:any = [];
  arrayCatProv:any = [];
  listaCaracteristicasProdNEW:any = [];
  listaCaracteristicasProdOLD:any = [];
  listaClaveProdNEW:any = [];
  listaClaveProdOLD:any = [];
  clavesDeleted:number = 0;
  arrayProvForVinc:any = [];
  arrayClaveProvProd:any = [];
  public new_caract_clave: string = "";
  public new_caract_valor: string = "";
  public classProdAlta: string = "";
  public arrayClassFullClass:string = '####-####-####';
  public boolValidacionStock:boolean = false;
  unidadMedidaCatalogoApi:any = [];
  public new_clave_registro: string = "";
  public new_clave_valor: string = "";
  public anexosRegistrados:any = [];
  public filesProd: NgxFileDropEntry[] = [];
  public docsProdAnexos:any [] = [];
  public validateProducto:boolean = false;
  public successMensajes:any []= [];
  @ViewChild('productosTrueList') table_prod_gral!: Table;
  
  private destruir$ = new Subject<void>();

  constructor(
    private sanitizer:DomSanitizer,
    private translate:TranslateService,
    private productoServ: ProductosService,
    private relInterna:ComunicacionInternaService,
    private _clasifServ: ClasificacionService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private validator:ValidatorServService,
    private _medidasCat:UniMedServService,
    private servXlsx:DescargaExcel,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.modelProd = new productoAngularModelo('','','','','','','','','',0,0,'','','','','','','',false,false,false,'',0,'','','','',[]);
  }

  ngOnInit(): void {
    this.getRespuestaRegistroINVENT();
    this.getRespuestaRegistroMostrador();
    this.getRespuestaProductoGeneralesVer();
    this.getRespuestaProductoAlmacenamientoVer();
    this.getRespuestaMoveToPapelera();
    this.monedasCatalogoApi();
    this.proveedores_lista();
    this.lista_general_productos();
    this.buscarProductosTRUE = [
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
  }
  
  verWindowProdCategorias(){
    this.prdCategoriasWindow = true;
  }

  verWindowRegistroProdInventario(){
    this.registroPrdInventarioWindow = true;
  }
  
  verWindowRegistroProdMostrador(){
    this.registroPrdMostradorWindow = true;
  } 

  getRespuestaRegistroINVENT(){
    this.relInterna.mensajeProdInvent$.subscribe(
      (mensaje:any) => {
        if (mensaje == "producto registrado") {
          this.lista_general_productos();
          $('#modalPrdInventarioReg').modal('hide');
          $('.modal-backdrop').remove();
        }
      }
    );
  }

  getRespuestaProductoGeneralesVer(){
    this.relInterna.mensajeVerGeneralesProd$.subscribe(
      (mensaje:any) => {
        console.log(mensaje)
        if (mensaje == "ver producto mostra_vent") {
          this.relInterna.token_cat_productos$.subscribe(
            (mensaje_prod:any) => {
              this.verGeneralesMostraVentProd(mensaje_prod);
            }
          );
        } else if (mensaje == "ver producto") {
          this.relInterna.token_cat_productos$.subscribe(
            (mensaje_prod:any) => {
              this.verGeneralesProd(mensaje_prod);
            }
          );
        }
      }
    );
  }

  getRespuestaProductoAlmacenamientoVer(){
    this.relInterna.mensajeVerAlmacenamientoProd$.subscribe(
      (mensaje:any) => {
        console.log(mensaje)
        if (mensaje == "ver producto") {
          this.relInterna.token_cat_productos$.subscribe(
            (mensaje_prod:any) => {
              this.verAlmacenamientoProd(mensaje_prod);
            }
          );
        }
      }
    );
  }

  getRespuestaRegistroMostrador(){
    this.relInterna.mensajeProdVMostrador$.subscribe(
      (mensaje:any) => {
        mensaje == "registro aprobado" ? this.lista_general_productos() : null;
      }
    );
  }

  getRespuestaMoveToPapelera(){
    this.relInterna.mensajeMoveToPepelera$.subscribe(
      (mensaje:any) => {
        mensaje == "registro eliminado" ? this.lista_general_productos() : null;
        mensaje == "registro eliminado" ? this.lista_productos_eliminados() : null;
      }
    );
  }

  listarClasificacionProductos(){
    this._clasifServ.getClassifProd().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayClasifProductos = response.listClass;
          console.log(this.arrayClasifProductos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedasCatalogoApi(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.catalogoMonedasApi = response.monedas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  catalogoUnidadDeMedidaApi(){
    this._medidasCat.inventUnidadesMedidaCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.unidades_medida);
          this.unidadMedidaCatalogoApi = response.unidades_medida;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  proveedores_lista(){
    this._provServ.catalogoProvedoresForClaves().subscribe(
      response => {
        this.arrayCatProv = response.status == 'success'? response.proveedores : [];
      },
      error => {
        console.log(error);
      }
    );
  }

  lista_general_productos(){
    this.listProductosGeneral(this.indicadorProductosList);
  }

  listProductosGeneral(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorProductosList = filtro;
    this.loading_prod = true; // Recomendado activar loading_prod
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var prod_gral_otras_fechas = document.getElementById("prod_gral_otras_fechas");
      if (this.rangoPeriodoProductos && this.rangoPeriodoProductos.length === 2) {
        const dateInicio = this.rangoPeriodoProductos[0];
        const dateFin = this.rangoPeriodoProductos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(prod_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(prod_gral_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(prod_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(prod_gral_otras_fechas);
        return;
      }
    }
    
    this.productoServ.productosCatGeneral(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_producto(response),
      error: (err) => this.error_alerta_producto(err)
    });
  }

  procesar_respuesta_producto(response: any){
    this.loading_prod = false;
    if (response.status === 'success') {
      this.listaProductosTRUE = response.listado;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listaProductosTRUE = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_producto(error: any){
    this.loading_prod = false;
    console.error('Error al cargar compras:', error);
    this.listaProductosTRUE = [];
  }

  descarga_excel_lgeneral(){
    const columnas:ExcelColumnas[] = [
      {label: "Folio", field: "folio_prod", align: "center"},
      {label: "Producto", field: "producto", align: "center"},
      {label: "Familia", field: "familia", align: "center"},
      {label: "Clasificación", field: "clasificacion", align: "center"},
      {label: "Genero", field: "genero", align: "center"},
      {label: "Marca", field: "marca", align: "center"},
      {label: "Stock actual", field: "stock_actual", align: "center"},
      {label: "Stock mínimo registrado", field: "stock_minimo_registrado", align: "center"},
      {label: "Stock máximo registrado", field: "stock_maximo_registrado", align: "center"},
      {label: "Método de costeo", field: "metodo_costeo", align: "center"},
      {label: "Unidad de medida de entrada", field: "unidad_medida_entrada_clave", align: "center"},
      {label: "Unidad de medida de salida", field: "unidad_medida_salida_clave", align: "center"},
      {label: "Moneda", field: "moneda_aplicable_clave", align: "center"},
      {label: "Uso del producto", field: "uso_producto", align: "center"},
      {label: "Clasificación en almacen por serie", field: "num_serie", align: "center",translate: true},
      {label: "Clasificación en almacen por lote", field: "num_lote", align: "center",translate: true},
      {label: "Clasificación en almacen por pedimento aduanal", field: "importado", align: "center",translate: true},
      {label: "Catálogo de sat", field: "sat_clave_code", align: "center"},
      {label: "Costo aplicable", field: "costo_aplicable", align: "center"},
      {label: "Cuenta contable", field: "cuenta-contable", align: "center"},
      {label: "Módulo", field: "modulo_destino", align: "center",translate: true},
    ];
    this.servXlsx.descarga_xlsx_documento(this.listaProductosTRUE,columnas,'Productos','catálogo de productos.xlsx');
  }
//ssic_menu_inven
  verGeneralesProd(token_cat_productos:any){
    this.productoDetalleInfo = [];
    this.successMensajes = [];
    this.arrayProvForVinc = [];
    this.filesProd = [];
    this.docsProdAnexos = [];

    this.productoServ.inventariosDetalleProducto(token_cat_productos).subscribe(
      response => {
        console.log(response);
        if (response.status === 'success') {
          this.productoDetalleInfo = response.producto;
          this.prodGeneralesWindow = true;
          /*if (this.arrayClasifProductos.length === 0) {
            this.listarClasificacionProductos();
          }
  
          if (this.unidadMedidaCatalogoApi.length === 0) {
            this.catalogoUnidadDeMedidaApi();
          }*/
          
          this.productoDetalleInfo.forEach((product_v:any) => {
            console.log(product_v);
            console.log(product_v.clasificacion);
            this.obtenGeneroProducto(product_v.clasificacion);
            this.modelProd.concepto = product_v.producto;
            this.modelProd.familia = product_v.familia;
            this.modelProd.clasificacion = product_v.clasificacion;
            this.modelProd.genero = product_v.genero;
            this.modelProd.marca = product_v.marca;
            this.modelProd.stock_min = product_v.stock_minimo_registrado;
            this.modelProd.stock_max = product_v.stock_maximo_registrado;
            this.modelProd.costeo = product_v.metodo_costeo;
            this.modelProd.unidad_entrada_clave = product_v.unidad_medida_entrada_clave;
            this.modelProd.unidad_salida_clave = product_v.unidad_medida_salida_clave;
            this.modelProd.moneda_codigo = product_v.moneda_aplicable_clave;
            this.modelProd.cuenta_contable = product_v.cuenta_contable;
            this.modelProd.uso_prod = product_v.uso_producto;
            this.modelProd.num_serie = product_v.num_serie;
            this.modelProd.num_lote = product_v.num_lote;
            this.modelProd.pedimentoAduanal = product_v.importado;
            this.modelProd.sat_clave_code = product_v.sat_clave_code;
            this.listaCaracteristicasProdNEW = [];
            this.listaCaracteristicasProdOLD = product_v.caracteristicas;
            this.listaClaveProdNEW = [];
            this.listaClaveProdOLD = product_v.clavesInternas;
            this.anexosRegistrados = product_v.anexos;
    
            this.arrayCatProv.forEach((prv:any) => {
              let coinciden:any = product_v.rel_proveedores.find((rel:any) => rel.token_cat_proveedores === prv.token_cat_proveedores);
              if (!coinciden) {
                console.log(prv)
                this.arrayProvForVinc.push(prv);
              } else {
                let relacion:any = product_v.rel_proveedores.findIndex((rel:any) => rel.token_cat_proveedores === prv.token_cat_proveedores);
                product_v.rel_proveedores[relacion]["folio"] = prv.folio;
                product_v.rel_proveedores[relacion]["rfc_prov"] = prv.rfc_prov;
                product_v.rel_proveedores[relacion]["nombre"] = prv.nombre;
                console.log(coinciden.folio);
              }
            });
          });
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  obtenGeneroProducto(clasificacion:any){
    this._clasifServ.getGeneroProd(clasificacion).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.arrayGeneroClass = response.genero;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyupProdConcepto(event:any,product_v:any){
    this.modelProd.concepto = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.concepto != product_v.producto;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectFamiliaProd(event:any,product_v:any){
    this.modelProd.familia = event.value;
    const validacion = event.value != "" && this.modelProd.familia != product_v.familia;
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
  }

  selectClassProd(event:any,product_v:any){
    this.modelProd.clasificacion = event.value;
    const validacion = event.value != "" && this.modelProd.clasificacion != product_v.clasificacion;
    this.classProdAlta = event.value != '' ? event.value : '';
    validacion ? this.obtenGeneroProducto(this.modelProd.clasificacion) : null;
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
  }

  selectGeneroProd(event:any,product_v:any){
    this.modelProd.genero = event.value;
    const validacion = event.value != "" && this.modelProd.genero != product_v.genero;
    console.log(event.value);
    if (validacion) {
      this._clasifServ.getClasificacionCompleta(this.classProdAlta,event.value).subscribe(
        response => {
          if (response.status == 'success' && validacion) {
            this.arrayClassFullClass = response.FullClass;
          }
        },
        error => {
          console.log(error);
        }
      )
      this.validator.correctoSelectBrowser(event);
    } else {
      this.modelProd.genero = "";
      this.validator.errorSelectBrowser(event);
    }
  }

  keyupProdMarca(event:any,product_v:any){
    this.modelProd.marca = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.marca != product_v.marca;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupStockMinProd(event:any,product_v:any){
    this.modelProd.stock_min = event.value;
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true && this.modelProd.stock_min != product_v.stock_minimo_registrado;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaStockProd();
  }

  keyupStockMaxProd(event:any,product_v:any){
    this.modelProd.stock_max = event.value;
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true && this.modelProd.stock_max != product_v.stock_maximo_registrado;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaStockProd();
  }

  validaStockProd(){
    var textStockmin = document.getElementById("textStockmin");
    var textStockmax = document.getElementById("textStockmax");
    console.log(this.modelProd.stock_min+" < "+this.modelProd.stock_max);
    const validacion = parseInt(""+this.modelProd.stock_min) > 0 && parseInt(""+this.modelProd.stock_max) > 0 && parseInt(""+this.modelProd.stock_max) > parseInt(""+this.modelProd.stock_min);
    this.boolValidacionStock = validacion ? true : false;
    validacion ? this.validator.correctoInputRow(textStockmin) : this.validator.errorInputRow(textStockmin);
    validacion ? this.validator.correctoInputRow(textStockmax) : this.validator.errorInputRow(textStockmax);
  }

  selectCosteoProd(event:any,product_v:any){
    this.modelProd.costeo = event.value;
    const valicacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.costeo != product_v.metodo_costeo;
    valicacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
  }

  keyupUnidadMedidaEntradaApiProd(event:any,product_v:any){
    const medUni = this.unidadMedidaCatalogoApi.find((row:any) => row.nombre === event.value);
    this.modelProd.unidad_entrada_clave = medUni.nombre;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.unidad_entrada_clave != product_v.unidad_medida_entrada_clave;
    validacion && medUni ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupUnidadMedidaSalidaApiProd(event:any,product_v:any){
    const medUni = this.unidadMedidaCatalogoApi.find((row:any) => row.nombre === event.value);
    this.modelProd.unidad_salida_clave = medUni.nombre;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.unidad_salida_clave != product_v.unidad_medida_entrada_clave;
    validacion && medUni ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupValidateMonedaApi(event:any,product_v:any){
    const monData = this.catalogoMonedasApi.find((row:any) => row.langEN === event.value || row.code === event.value);
    this.modelProd.moneda_codigo = monData.code;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.moneda_codigo != product_v.moneda_aplicable_clave;
    validacion && monData ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelProd.moneda_codigo);
  }

  keyupValidateCuentaContable(event:any,product_v:any){
    this.modelProd.cuenta_contable = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.cuenta_contable != product_v.cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelProd.cuenta_contable);
  }

  checkUsoDestinoProducto(tipo_uso:any,product_v:any){
    this.modelProd.uso_prod = tipo_uso;
    const validacion = tipo_uso != "" && this.validator.filtroAlfaNumerico(tipo_uso) == true && this.modelProd.uso_prod != product_v.uso_producto;
  }

  vincProductoToSerie(event:any){
    this.modelProd.num_serie = event.checked == true ? true : false;
  }

  vincProductoToLote(event:any){
    this.modelProd.num_lote = event.checked == true ? true : false;
  }

  vincProductoToPedimento(event:any){
    this.modelProd.pedimentoAduanal = event.checked == true ? true : false;
  }

  keyupSatApi(event:any,product_v:any){
    this.modelProd.sat_clave_code = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true && (event.value.length == 7 || event.value.length == 8) && this.modelProd.sat_clave_code != product_v.sat_clave_code; 
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCaracteristicasClave(event:any){
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.new_caract_clave = validar ? event.value : "";
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCaracteristicasValor(event:any){
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.new_caract_valor = validar ? event.value : "";
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  agregaCaracteristica(){
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
        var nclave_caract = document.getElementById("nClaveCaractAltaProdProv");
        var nvalor_caract = document.getElementById("nValorCaractAltaProdProv");
        this.listaCaracteristicasProdNEW.push({"clave_caract":this.new_caract_clave,"valor_caract":this.new_caract_valor});
        this.new_caract_clave = "";
        this.new_caract_valor = "";
        this.validator.limpiaInputRow(nclave_caract);
        this.validator.limpiaInputRow(nvalor_caract);
      }
    });
  }

  eliminaCaracteristica(seccion:any,token_caracteristicas:any){
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
        if (seccion == "new") {
          this.listaCaracteristicasProdNEW.splice(token_caracteristicas,1);
        } else {
          let index = this.listaCaracteristicasProdOLD.findIndex((row:any) => row.token_caracteristicas === token_caracteristicas);
          this.listaCaracteristicasProdOLD[index]["eliminacion_proceso"] = true;
        }
        ++this.clavesDeleted;
      }
    });
  }

  keyupListaClaveInternaClaveNew(objetoTextClave:any){
    const validar = objetoTextClave.value != '' && this.validator.filtroAlfaNumerico(objetoTextClave.value) == true;
    this.new_clave_registro = validar ? objetoTextClave.value : '';
    validar ? this.validator.correctoInputRow(objetoTextClave) : this.validator.errorInputRow(objetoTextClave);
  }

  keyupListaClaveInternaValorNew(objetoTextClave:any){
    const validar = objetoTextClave.value != '' && this.validator.filtroAlfaNumerico(objetoTextClave.value) == true;
    this.new_clave_valor = validar ? objetoTextClave.value : '';
    validar ? this.validator.correctoInputRow(objetoTextClave) : this.validator.errorInputRow(objetoTextClave);
  }
  
  agregaClave(){
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
        var clave_nw = document.getElementById("claveNewAlta");
        var clave_Inter = document.getElementById("claveInterna");
        this.listaClaveProdNEW.push({"clave_name":this.new_clave_registro,"valor_name":this.new_clave_valor});
        this.new_clave_registro = "";
        this.new_clave_valor = "";
        this.validator.limpiaInputRow(clave_nw);
        this.validator.limpiaInputRow(clave_Inter);
      }
    });
  }

  eliminaClave(seccion:any,token_alta_clave:any){
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
        if (seccion == "new") {
          this.listaClaveProdNEW.splice(token_alta_clave,1);
        } else {
          let index = this.listaClaveProdOLD.findIndex((row:any) => row.token_alta_clave === token_alta_clave);
          this.listaClaveProdOLD[index]["eliminacion_proceso"] = true;
        }
        ++this.clavesDeleted;
      }
    });
  }

  restaurarClavesDeleted(){
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
        this.listaCaracteristicasProdOLD.map((row:any) => row.eliminacion_proceso = false);
        console.log(this.listaCaracteristicasProdOLD);
        this.listaClaveProdOLD.map((row:any) => row.eliminacion_proceso = false);
        this.clavesDeleted = 0;
      }
    });
  }

//proveedores vinculados
  vinc_encendido(event:any,detalle_info:any,token_cat_proveedores:any){
    detalle_info.forEach((det:any) => {
      const prov_row = det.rel_proveedores.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
      prov_row.encendido = event.checked == true ? true : false;
      prov_row.tiene_clave = event.checked == false ? false : null;
      prov_row.asigned_clave = event.checked == false ? '' : null;
    });
  }

  vinc_EnableClave(event:any,detalle_info:any,token_cat_proveedores:any){
    detalle_info.forEach((det:any) => {
      const prov_row = det.rel_proveedores.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
      prov_row.tiene_clave = event.checked == true ? true : false;
    });
  }

  vinc_AsignedClave(event:any,detalle_info:any,token_cat_proveedores:any){
    detalle_info.forEach((det:any) => {
      const prov_row = det.rel_proveedores.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
      prov_row.asigned_clave = event.value;
      const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && prov_row.asigned_clave != prov_row.asigned_clave_background;
      validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      console.log(prov_row);
    });
  }

  actionBotonVinc(event:any,detalle_info:any,token_cat_proveedores:any){
    detalle_info.forEach((det:any) => {
      const prov_row = det.rel_proveedores.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
      prov_row.eliminacion_proceso = event.checked ? true : false;
      console.log(prov_row);
    });
  }

//proveedores para vincular
  apagar_encender(event:any,token_cat_proveedores:any){
    const prov_row = this.arrayCatProv.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.encendido = event.checked == true ? true : false;
    prov_row.tiene_clave = event.checked == false ? 'false' : null;
    prov_row.asigned_clave = event.checked == false ? '' : null;
  }

  decideHabilitaClave(event:any,token_cat_proveedores:any){
    const prov_row = this.arrayCatProv.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.tiene_clave = event.checked == true ? 'true' : 'false';
  }

  keyupProvProdClave(event:any,token_cat_proveedores:any){
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    const prov_row = this.arrayCatProv.find((row:any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.asigned_clave = validar ? event.value : '';
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(prov_row);
  }

  keypressProvProdClave(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (this.validator.strFilter(clave) == false) {
      this.validator.deten(event);
    }
  }

//anexos
  deleteAnexo(event:any,detalle_info:any,token_documento:any){
    detalle_info.forEach((det:any) => {
      const doc = det.anexos.find((row:any) => row.token_documento === token_documento);
      doc.eliminacion_proceso = event.checked ? true : false;
      console.log(doc);
    });
  }

  public droppedProd(files: NgxFileDropEntry[]) {
    this.filesProd = files;
    this.docsProdAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsReemAnexos.push(file,droppedFile.relativePath);
          var nameFile = file.name;
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(file.type) == true) {
            this.docsProdAnexos.push(file);
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo '+nameFile+' excede el tamaño permitido (2MB)';
            }
            if (this.validator.filtroTipoArchivo(file.type) == false) {
              mensajeError = 'El archivo '+nameFile+' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton:false,
              timer: 3000
            })
            this.filesProd.splice(i,1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log("docsReemAnexos.length "+this.docsProdAnexos.length);
  }
  
  public fileOverProd(event:any){
    console.log(event);
  }
  
  public fileLeaveProd(event:any){
    console.log(event);
  }

  deleteAnexosProd(name:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_file_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          const index_doc = this.docsProdAnexos.findIndex((row:any) => row.name === name);
          this.docsProdAnexos.splice(index_doc,1);
          this.filesProd.splice(index_doc,1);
          //console.log(this.docsProdAnexos.length);
        }
      }
    );
  }

  validaUpdateProd(product_v:any):boolean{
    if (this.productoDetalleInfo.length == 1) {
      const validacion_concepto = this.modelProd.concepto != "" && this.validator.filtroAlfaNumerico(this.modelProd.concepto) && this.modelProd.concepto != product_v.producto;
      const validacion_familia = this.modelProd.familia != "" && this.modelProd.familia != product_v.familia;
      const validacion_clasificacion = this.modelProd.clasificacion != "" && this.modelProd.clasificacion != product_v.clasificacion;
      const validacion_genero = this.modelProd.genero != "" && this.modelProd.genero != product_v.genero;
      const validacion_marca = this.modelProd.marca != "" && this.validator.filtroAlfaNumerico(this.modelProd.marca) && this.modelProd.marca != product_v.marca;
      const validacion_stock_min = this.modelProd.stock_min != 0 && this.validator.filtroNum(this.modelProd.stock_min) && this.modelProd.stock_min != product_v.stock_minimo_registrado;
      const validacion_stock_max = this.modelProd.stock_max != 0 && this.validator.filtroNum(this.modelProd.stock_max) && this.modelProd.stock_max != product_v.stock_maximo_registrado;
      const valicacion_costeo = this.modelProd.costeo != "" && this.validator.filtroAlfaNumerico(this.modelProd.costeo) && this.modelProd.costeo != product_v.metodo_costeo;
      const validacion_unidad_entrada = this.modelProd.unidad_entrada_clave != "" && this.validator.filtroAlfaNumerico(this.modelProd.unidad_entrada_clave) && this.modelProd.unidad_entrada_clave != product_v.unidad_medida_entrada_clave;
      const validacion_unidad_salida = this.modelProd.unidad_salida_clave != "" && this.validator.filtroAlfaNumerico(this.modelProd.unidad_salida_clave) && this.modelProd.unidad_salida_clave != product_v.unidad_medida_salida_clave;
      const validacion_moneda_codigo = this.modelProd.moneda_codigo != "" && this.modelProd.moneda_codigo != product_v.moneda_aplicable_clave;
      const validacion_cuenta_contable = this.modelProd.cuenta_contable != "" && this.validator.filtroAlfaNumerico(this.modelProd.cuenta_contable) && this.modelProd.cuenta_contable != product_v.cuenta_contable;
      const validacion_uso_prod = this.modelProd.uso_prod != null && this.modelProd.uso_prod != "" && this.validator.filtroAlfaNumerico(this.modelProd.uso_prod) && this.modelProd.uso_prod != product_v.uso_producto;
      const validacion_serie = this.modelProd.num_serie != product_v.num_serie;
      const validacion_lote = this.modelProd.num_lote != product_v.num_lote;
      const valicacion_ped = this.modelProd.pedimentoAduanal != product_v.importado;
      const validacion_sat = this.modelProd.sat_clave_code != '' && this.validator.filtroNum(this.modelProd.sat_clave_code) && (this.modelProd.sat_clave_code.length == 7 || this.modelProd.sat_clave_code.length == 8) && this.modelProd.sat_clave_code != product_v.sat_clave_code;
      const deleted_caract = this.listaCaracteristicasProdOLD.filter((row:any) => row.eliminacion_proceso === true);
      const deleted_clavInside = this.listaClaveProdOLD.filter((row:any) => row.eliminacion_proceso === true);
      //proveedores vinculados
      const prvklav_hasClav = product_v.rel_proveedores.filter((row:any) => row.tiene_clave != row.tiene_clave_background && ((row.tiene_clave && row.asigned_clave != '') || !row.tiene_clave));
      const prvklav_asigned_clave = product_v.rel_proveedores.filter((row:any) => row.asigned_clave != row.asigned_clave_background);
      const deleted_prvklav = product_v.rel_proveedores.filter((row:any) => row.eliminacion_proceso === true);
      //proveedores para vincular
      const new_prvklav = this.arrayProvForVinc.filter((row:any) => row.encendido === true);
      //anexos
      const docs_delete = product_v.anexos.filter((row:any) => row.eliminacion_proceso === true);

      const validacion_main = validacion_concepto || validacion_familia || validacion_clasificacion || validacion_genero || validacion_marca || validacion_stock_min || 
        validacion_stock_max || valicacion_costeo || validacion_unidad_entrada || validacion_unidad_salida || validacion_moneda_codigo || validacion_cuenta_contable || validacion_uso_prod || validacion_serie || 
        validacion_lote || valicacion_ped || validacion_sat || this.listaCaracteristicasProdNEW.length > 0 || deleted_caract.length > 0 || this.listaClaveProdNEW.length > 0 || deleted_clavInside.length > 0 ||
        prvklav_hasClav.length > 0 || prvklav_asigned_clave.length > 0 || deleted_prvklav.length > 0 || new_prvklav.length > 0 || docs_delete.length > 0 || this.docsProdAnexos.length > 0;
      return validacion_main; 
    } else {
      return false;
    }
  }

  updatesProductos(product_v:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          //var translate_response_error = "";

          let MPconcepto = this.modelProd.concepto;
          let MPfamilia = this.modelProd.familia;
          let MPclasificacion = this.modelProd.clasificacion;
          let MPgenero = this.modelProd.genero;
          let MPmarca = this.modelProd.marca;
          let MPstock_min = this.modelProd.stock_min;
          let MPstock_max = this.modelProd.stock_max;
          let MPcosteo = this.modelProd.costeo;
          let MPunidad_entrada_clave = this.modelProd.unidad_entrada_clave;
          let MPunidad_salida_clave = this.modelProd.unidad_salida_clave;
          let MPmoneda_codigo = this.modelProd.moneda_codigo;
          let MPcuenta_contable = this.modelProd.cuenta_contable;
          let MPuso_prod = this.modelProd.uso_prod;
          let MPnum_serie = this.modelProd.num_serie;
          let MPnum_lote = this.modelProd.num_lote;
          let MPpedimentoAduanal = this.modelProd.pedimentoAduanal;
          let MPsat_clave_code = this.modelProd.sat_clave_code;

          const validaciones = {
            concepto: this.modelProd.concepto != "" && this.validator.filtroAlfaNumerico(this.modelProd.concepto) && this.modelProd.concepto != product_v.producto,
            familia: this.modelProd.familia != "" && this.modelProd.familia != product_v.familia,
            clasificacion: this.modelProd.clasificacion != "" && this.modelProd.clasificacion != product_v.clasificacion,
            genero: this.modelProd.genero != "" && this.modelProd.genero != product_v.genero,
            marca: this.modelProd.marca != "" && this.validator.filtroAlfaNumerico(this.modelProd.marca) && this.modelProd.marca != product_v.marca,
            stock_min: this.modelProd.stock_min != 0 && this.validator.filtroNum(this.modelProd.stock_min) && this.modelProd.stock_min != product_v.stock_minimo_registrado,
            stock_max: this.modelProd.stock_max != 0 && this.validator.filtroNum(this.modelProd.stock_max) && this.modelProd.stock_max != product_v.stock_maximo_registrado,
            costeo: this.modelProd.costeo != "" && this.validator.filtroAlfaNumerico(this.modelProd.costeo) && this.modelProd.costeo != product_v.metodo_costeo,
            unidad_entrada: this.modelProd.unidad_entrada_clave != "" && this.validator.filtroAlfaNumerico(this.modelProd.unidad_entrada_clave) && this.modelProd.unidad_entrada_clave != product_v.unidad_medida_entrada_clave,
            unidad_salida: this.modelProd.unidad_salida_clave != "" && this.validator.filtroAlfaNumerico(this.modelProd.unidad_salida_clave) && this.modelProd.unidad_salida_clave != product_v.unidad_medida_salida_clave,
            moneda_codigo: this.modelProd.moneda_codigo != "" && this.modelProd.moneda_codigo != product_v.moneda_aplicable_clave,
            cuenta_contable: this.modelProd.cuenta_contable != "" && this.validator.filtroAlfaNumerico(this.modelProd.cuenta_contable) == true && this.modelProd.cuenta_contable != product_v.cuenta_contable,
            uso_prod: this.modelProd.uso_prod != null && this.modelProd.uso_prod != "" && this.validator.filtroAlfaNumerico(this.modelProd.uso_prod) && this.modelProd.uso_prod != product_v.uso_producto,
            num_serie: this.modelProd.num_serie != product_v.num_serie,
            num_lote: this.modelProd.num_lote != product_v.num_lote,
            pedimento: this.modelProd.pedimentoAduanal != product_v.importado,
            sat_clave: this.modelProd.sat_clave_code != "" && this.validator.filtroNum(this.modelProd.sat_clave_code) && (this.modelProd.sat_clave_code.length == 7 || this.modelProd.sat_clave_code.length == 8) && this.modelProd.sat_clave_code != product_v.sat_clave_code,
          };

          const deleted_caract = this.listaCaracteristicasProdOLD.filter((row:any) => row.eliminacion_proceso === true);
          const deleted_clavInside = this.listaClaveProdOLD.filter((row:any) => row.eliminacion_proceso === true);

          //proveedores vinculados
          const prvklav_hasClav = product_v.rel_proveedores.filter((row:any) => row.tiene_clave != row.tiene_clave_background && ((row.tiene_clave && row.asigned_clave != '') || !row.tiene_clave));
          const prvklav_asigned_clave = product_v.rel_proveedores.filter((row:any) => row.asigned_clave != row.asigned_clave_background);
          const deleted_prvklav = product_v.rel_proveedores.filter((row:any) => row.eliminacion_proceso === true);
          //proveedores para vincular
          const new_prvklav = this.arrayProvForVinc.filter((row:any) => row.encendido === true);
          //anexos
          const docs_delete = product_v.anexos.filter((row:any) => row.eliminacion_proceso === true);

          if (Object.values(validaciones).some(Boolean)) {
            this.productoServ.updateGeneralesProducto(
              product_v.token_cat_productos,MPconcepto,MPfamilia,MPclasificacion,MPgenero,MPmarca,
              MPstock_min,MPstock_max,MPcosteo,MPunidad_entrada_clave,MPunidad_salida_clave,
              MPmoneda_codigo,MPcuenta_contable,MPuso_prod,MPnum_serie,MPnum_lote,MPpedimentoAduanal,MPsat_clave_code
            ).subscribe(
              response => {
                console.log(response.status+" "+this.translate.instant(response.message))
                if (response.status === 'success') {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position:'top-end',
                    icon: 'warning',
                    title: this.translate.instant(response.message),
                    showConfirmButton:false,
                    timer: 3000
                  });
                  return;
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (this.listaCaracteristicasProdNEW.length > 0) {
            this.productoServ.agregaCaracterisicasProd(product_v.token_cat_productos,this.listaCaracteristicasProdNEW).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (deleted_caract.length > 0) {
            this.productoServ.eliminaCaracterisicasProd(product_v.token_cat_productos,deleted_caract).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (this.listaClaveProdNEW.length > 0) {
            this.productoServ.agregaClavesProd(product_v.token_cat_productos,this.listaClaveProdNEW).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (deleted_clavInside.length > 0) {
            this.productoServ.eliminaClavesProd(product_v.token_cat_productos,deleted_clavInside).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (prvklav_hasClav.length > 0) {
            this.productoServ.updateClaveProdProv(product_v.token_cat_productos,prvklav_hasClav).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (prvklav_asigned_clave.length > 0) {
            this.productoServ.updateClaveProdProv(product_v.token_cat_productos,prvklav_asigned_clave).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (deleted_prvklav.length > 0) {
            this.productoServ.eliminaClaveProdProv(product_v.token_cat_productos,deleted_prvklav).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (new_prvklav.length > 0) {
            this.productoServ.nuevoClaveProdProv(product_v.token_cat_productos,new_prvklav).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (docs_delete.length > 0) {
            this.productoServ.deleteDocProducto(product_v.token_cat_productos,docs_delete).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (this.docsProdAnexos.length > 0) {
            this.productoServ.registraNuevoDocProducto(product_v.token_cat_productos,this.docsProdAnexos).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }
          
          setTimeout(() => {
            console.log(this.successMensajes);
            if (this.successMensajes.length > 0) {
              this.verGeneralesProd(product_v.token_cat_productos);
              this.lista_general_productos();
              this.relInterna.mensajeRegistroProdInvent("registro aprobado");
              this.relInterna.mensajeRegistroProdVentasMostrador("registro aprobado");
              Swal.fire({
                position: "center",
                icon: "success",
                title: this.successMensajes.join("\n"),
                showConfirmButton: false,
                timer: 3000,
              });
            }
          }, 3000);
        }
      }
    );
  }

  verAlmacenamientoProd(token_cat_productos:any){
    this.successMensajes = [];
    this.arrayProvForVinc = [];
    this.filesProd = [];
    this.docsProdAnexos = [];
    this.productoAlmacenDetalle = [];
    this.productoServ.verAlmacenProducto(token_cat_productos).subscribe(
      response => {
        if (response.status === 'success') {
          this.productoAlmacenDetalle = response.producto;
          this.productoAlmacenDetalle.forEach((product_v:any) => {
            console.log(product_v);
            product_v.almacen_materia_prima.forEach((row:any) => {
              row.datosDir.forEach((estab:any) => {
                estab.desgloseAlm1.forEach((desg:any) => {
                  desg.existencia_convert = convert(desg.existencia, desg.unidad_entrada_abrev).to(desg.unidad_salida_abrev);
                });
              });
            });
    
            product_v.almacen_produccion.forEach((row:any) => {
              row.datosDir.forEach((estab:any) => {
                estab.desgloseAlm2.forEach((desg:any) => {
                  desg.existencia_convert = convert(desg.existencia, desg.unidad_entrada_abrev).to(desg.unidad_salida_abrev);
                });
              });
            });
    
            product_v.almacen_producto_final.forEach((row:any) => {
              row.datosDir.forEach((estab:any) => {
                estab.desgloseAlm3.forEach((desg:any) => {
                  desg.existencia_convert = convert(desg.existencia, desg.unidad_entrada_abrev).to(desg.unidad_salida_abrev);
                });
              });
            });
            //const resultado = convert(5, 'miles').to('km');
            //console.log(resultado); // Salida: 8.04672
          });
          this.prodAlmacenWindow = true;
        }
        
      },
      error => {
        console.log(error);
      }
    );
  }

  inpCambiaAlmacen(token_cat_productos:any,almacen_origen:any,almacen_destino:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea mover de almacen este producto?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, mover',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServ.cambiaAlmacenProd(token_cat_productos,almacen_origen,almacen_destino).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.verAlmacenamientoProd(token_cat_productos);
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
        );
      }
    });
  }

//mostra_vent
  verGeneralesMostraVentProd(token_cat_productos:any){
    this.successMensajes = [];
    this.listaClaveProdNEW = [];
    this.productoServ.mostradorDetalleProducto(token_cat_productos).subscribe(
      response => {        
        if (response.status === 'success') {
          this.productoMostradorDetalle = response.producto;
          this.prodMostradorWindow = true;
          
          /*if (this.arrayClasifProductos.length === 0) {
            this.listarClasificacionProductos();
          }
  
          if (this.unidadMedidaCatalogoApi.length === 0) {
            this.catalogoUnidadDeMedidaApi();
          }*/
          
          this.productoMostradorDetalle.forEach((product_v:any) => {
            console.log(product_v);
            this.modelProd.concepto = product_v.producto;
            this.modelProd.precio_aplicable = product_v.precio_aplicable
            this.modelProd.unidad_salida_clave = product_v.unidad_medida_salida_clave;
            this.modelProd.moneda_codigo = product_v.moneda_aplicable_clave;
            this.modelProd.moneda_decimales = product_v.moneda_aplicable_clave_decimales;
            this.listaClaveProdOLD = product_v.clavesInternas;
          });
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyupPrecioAplicableProd(event:any,product_v:any){
    this.modelProd.precio_aplicable = event.value;
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true && this.modelProd.precio_aplicable != product_v.precio_aplicable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    product_v.precio_aplicable_format = numeral(this.modelProd.precio_aplicable).format('$0,0.'+'0'.repeat(parseInt(this.modelProd.moneda_decimales)))+" "+this.modelProd.moneda_codigo;
  }

  keyupMostraVentProdValidateMonedaApi(event:any,product_v:any){
    const monData = this.catalogoMonedasApi.find((row:any) => row.langEN === event.value || row.code === event.value);
    this.modelProd.moneda_codigo = monData.code;
    this.modelProd.moneda_decimales = monData.decimales;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && this.modelProd.moneda_codigo != product_v.moneda_aplicable_clave;
    validacion && monData ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelProd.moneda_codigo);
    product_v.precio_aplicable_format = numeral(this.modelProd.precio_aplicable).format('$0,0.'+'0'.repeat(parseInt(this.modelProd.moneda_decimales)))+" "+this.modelProd.moneda_codigo;
  }

  validaUpdateMostraVentProd(product_v:any):boolean{
    if (this.productoMostradorDetalle.length == 1) {
      const validacion_concepto = this.modelProd.concepto != "" && this.validator.filtroAlfaNumerico(this.modelProd.concepto) == true && this.modelProd.concepto != product_v.producto;
      const validacion_precio_aplicable = this.modelProd.precio_aplicable != 0 && this.validator.filtroNum(this.modelProd.precio_aplicable) == true && this.modelProd.precio_aplicable != product_v.precio_aplicable;
      const validacion_unidad_salida = this.modelProd.unidad_salida_clave != "" && this.validator.filtroAlfaNumerico(this.modelProd.unidad_salida_clave) == true && this.modelProd.unidad_salida_clave != product_v.unidad_medida_salida_clave;
      const validacion_moneda_codigo = this.modelProd.moneda_codigo != "" && this.modelProd.moneda_codigo != product_v.moneda_aplicable_clave;
      const deleted_clavInside = this.listaClaveProdOLD.filter((row:any) => row.eliminacion_proceso === true);

      const validacion_main = validacion_concepto || validacion_precio_aplicable || validacion_unidad_salida || validacion_moneda_codigo || this.listaClaveProdNEW.length > 0 || deleted_clavInside.length > 0;
      return validacion_main; 
    } else {
      return false;
    }
  }

  updatesMostraVentProductos(product_mostrador:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          //var translate_response_error = "";
          let MPconcepto = this.modelProd.concepto;
          let MPPrecioAplicable = this.modelProd.precio_aplicable;
          let MPunidad_salida_clave = this.modelProd.unidad_salida_clave;
          let MPmoneda_codigo = this.modelProd.moneda_codigo;

          const validaciones = {
            concepto: this.modelProd.concepto != "" && this.validator.filtroAlfaNumerico(this.modelProd.concepto) && this.modelProd.concepto != product_mostrador.producto,
            precio_aplicable: this.modelProd.precio_aplicable != 0 && this.validator.filtroNum(this.modelProd.precio_aplicable) == true && this.modelProd.precio_aplicable != product_mostrador.precio_aplicable,
            unidad_salida: this.modelProd.unidad_salida_clave != "" && this.validator.filtroAlfaNumerico(this.modelProd.unidad_salida_clave) && this.modelProd.unidad_salida_clave != product_mostrador.unidad_medida_salida_clave,
            moneda_codigo: this.modelProd.moneda_codigo != "" && this.modelProd.moneda_codigo != product_mostrador.moneda_aplicable_clave,
          };
          const deleted_clavInside = this.listaClaveProdOLD.filter((row:any) => row.eliminacion_proceso === true);

          if (Object.values(validaciones).some(Boolean)) {
            this.productoServ.updateGeneralesMostraVentProducto(product_mostrador.token_cat_productos,MPconcepto,MPPrecioAplicable,MPunidad_salida_clave,MPmoneda_codigo).subscribe(
              response => {
                console.log(response.status+" "+this.translate.instant(response.message))
                if (response.status === 'success') {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position:'top-end',
                    icon: 'warning',
                    title: this.translate.instant(response.message),
                    showConfirmButton:false,
                    timer: 3000
                  });
                  return;
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (this.listaClaveProdNEW.length > 0) {
            this.productoServ.agregaClavesProd(product_mostrador.token_cat_productos,this.listaClaveProdNEW).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }

          if (deleted_clavInside.length > 0) {
            this.productoServ.eliminaClavesProd(product_mostrador.token_cat_productos,deleted_clavInside).subscribe(
              response => {
                if (response.status === "success") {
                  this.successMensajes.push(this.translate.instant(response.message));
                } else {
                  Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: this.translate.instant(response.message),
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              },
              error => {
                console.log(error);
              }
            )
          }
          
          setTimeout(() => {
            console.log(this.successMensajes);
            if (this.successMensajes.length > 0) {
              this.verGeneralesMostraVentProd(product_mostrador.token_cat_productos);
              this.lista_general_productos();
              this.relInterna.mensajeRegistroProdVentasMostrador("registro aprobado");
              Swal.fire({
                position: "center",
                icon: "success",
                title: this.successMensajes.join("\n"),
                showConfirmButton: false,
                timer: 3000,
              });
            }
          }, 3000);
        }
      }
    );
  }


//otros procesos
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
              this.lista_general_productos();
              this.lista_productos_eliminados();
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

  lista_productos_eliminados(){
    this.productoServ.prodInventariosEliminados().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaProductosFALSE = response.listado;
          this.listaPrdDeletedWindow = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  btnRestProdListaPap(event:any,token_cat_productos:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar este producto?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServ.restauraProducto(token_cat_productos).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.lista_general_productos();
              this.lista_productos_eliminados();
              this.relInterna.mensajeRestaurandoProd("registro restaurado");
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

  btnDelProdListaPap(event:any,token_cat_productos:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar definitivamente este producto?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServ.eliminaDefProducto(token_cat_productos).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.lista_general_productos();
              this.lista_productos_eliminados();
              this.relInterna.mensajeProdEliminando("registro eliminado");
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
