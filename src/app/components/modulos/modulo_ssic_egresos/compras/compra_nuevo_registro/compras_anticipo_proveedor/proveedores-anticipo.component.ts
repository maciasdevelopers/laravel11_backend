import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { subscribe } from 'diagnostics_channel';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { FormaPagoService } from '../../../../../../servicios/ssic/forma-pago.service';
import { NgForm } from '@angular/forms';
import numeral from 'numeral';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app_compras_proveedores_anticipo',
  standalone: false,
  
  templateUrl: './proveedores-anticipo.component.html',
  styleUrls: [
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/proveedores.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/div_busqueda.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/ubicaciones.css',
    '../../../../../../styles/buscador.css',
    '../../../egresos.css',
    './proveedores-anticipo.component.css'
  ]
})
export class ProveedoresAnticipoComponent implements OnInit, OnDestroy {
  provBuscar:string = '';
  search_solicitudes_anticipos_list:any = [];
  solicitudes_anticipos_list:any = [];
  indicadorAnticiposList:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoAnticiposList: Date[] | undefined;


  search_anticipos_autorizados_list:string = "";
  anticipos_autorizados_list:any = [];

  desglose_anticipo_folio:string = '';
  info_anticipo_desglose:any = [];
  lista_proveedores:any = [];
  expandedRowsProveedores: { [s: string]: boolean } = {};
  listaForma_pago:any = [];
  catalogo_monedas_api:any = [];
  public btnVerAnticipFormulario:boolean = true;
  public proveedorSeleccionado:string = "";
  public moneda_selected_codigo:string = "";
  public moneda_selected_decimales:number = 2;
  public tipo_cambio_numerico:number = 1;
  public tipo_cambio_string:string = "1.00";
  public cantidad_anticipo:number = 0;
  public cantidad_anticipo_resultante:string = "0.00";
  public observaciones:string = "";
  public forma_pago_selec:string = "";
  public token_cat_proveedores:string = "";
  public fecha_contabilizacion:string = "";
  @ViewChild('formAddAnticipoNuevo') formAddAnticipoNuevo!: NgForm;

  private destruir$ = new Subject<void>();

  constructor(
    private provSer:ProveedoresService,
    private provMon:MonedasService,
    private validator:ValidatorServService,
    private translate: TranslateService,
    private formPag: FormaPagoService,
    private cd: ChangeDetectorRef
  ){
  }

  ngOnInit():void{
    this.ver_solicitudes_anticipo_proveedor('hoy');
    this.listar_anticipos_proveedor();
    this.lista_Prov();
    this.monedasCatalogoApi();
    this.forma_pagocat_API();
    this.search_solicitudes_anticipos_list = [
      'anticipo_uuid',
      'anticipo_folio',
      'proveedor_folio',
			'proveedor_nombre',
			'proveedor_nombre_comercial',
			'anticipo_fecha_contabilizacion',
			'anticipo_forma_pago',
			'anticipo_tipo_cambio_format',
			'anticipo_cantidad_anticipo_format',
			'anticipo_observaciones'
    ];
  }

  listar_solicitudes_anticipo_proveedor(){
    this.ver_solicitudes_anticipo_proveedor(this.indicadorAnticiposList);
  }

  ver_solicitudes_anticipo_proveedor(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorAnticiposList = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    
    if (filtro == 'otras_fechas') {
      var anticipos_otras_fechas = document.getElementById("anticipos_otras_fechas");
      if (this.rangoPeriodoAnticiposList && this.rangoPeriodoAnticiposList.length === 2) {
        const dateInicio = this.rangoPeriodoAnticiposList[0];
        const dateFin = this.rangoPeriodoAnticiposList[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(anticipos_otras_fechas);
          } else {
            this.validator.errorInputRow(anticipos_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(anticipos_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(anticipos_otras_fechas);
        return;
      }
    }
 
    this.provSer.listarAnticiposProvSolicitudes(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    if (response.status === 'success') {
      this.solicitudes_anticipos_list = response.anticipos_registrados;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.solicitudes_anticipos_list = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    console.error('Error al cargar anticipos:', error);
    this.solicitudes_anticipos_list = [];
  }

  listar_anticipos_proveedor(){
    this.provSer.listarAnticiposProvCatalogoGeneral('all_partidas','','').subscribe(
      response => {
        if (response.status == "success") {
          console.log("data");
          console.log(response);
          this.anticipos_autorizados_list = response.anticipos_registrados;
        }
      }
    );
  }

  anticipo_desglose(anticipo_uuid:any){
    this.provSer.desgloseAnticipo(anticipo_uuid).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response);
          const folio_ant = this.solicitudes_anticipos_list.find((ant:any) => ant.anticipo_uuid === anticipo_uuid);
          this.desglose_anticipo_folio = typeof folio_ant !== 'undefined' ? folio_ant.anticipo_folio : '';
          this.info_anticipo_desglose = response.anticipos_registrados;
        }
      }
    );
  }

  lista_Prov(){
    this.provSer.catalogoProveedoresForProcesos().subscribe(
      response => {
        if(response.status == 'success'){
          this.lista_proveedores = response.proveedores;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedasCatalogoApi(){
    this.provMon.getApiMonedasCatalogo().subscribe(
      response => {
        if(response.status == 'success'){
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  forma_pagocat_API(){
    this.formPag.getApiFormaPago().subscribe(
      response => {
        if(response.status == 'success') {
          this.listaForma_pago = response.forma_pago;
          console.log(this.listaForma_pago);
        }
      }
    )
  }

  selectCatProv(opcion:any){
    var selectedCatProv = document.getElementById("selectedCatProv");
    let prv = this.lista_proveedores.find((row:any) => opcion.token_cat_proveedores != '' && row.token_cat_proveedores == opcion.token_cat_proveedores);  
    this.token_cat_proveedores = typeof prv !== 'undefined' ? prv.token_cat_proveedores : '';
    typeof prv !== 'undefined' ? this.validator.correctoSelectBrowser(selectedCatProv) : this.validator.errorSelectBrowser(selectedCatProv);
  }

  validar_fecha_anticipo(object:any){
    const validacion = object.value != "" && this.validator.filtroFecha(object.value);
    this.fecha_contabilizacion = validacion ? object.value : "";
    validacion ? this.validator.correctoInputRow(object) : this.validator.errorInputRow(object);
  }

  validaForma_pago(opcion:any){
    var selectedForma_pago = document.getElementById("selectedForma_pago");
    const fpag = this.listaForma_pago.find((fp:any) => fp.descripcion === opcion.descripcion);
    const validacion = opcion.descripcion != "" && this.validator.filtroAlfaNumerico(opcion.descripcion) && typeof fpag !== 'undefined';
    this.forma_pago_selec = validacion ? fpag.descripcion : '';
    validacion ? this.validator.correctoInputRow(selectedForma_pago) : this.validator.errorInputRow(selectedForma_pago);
  }

  valMoned(opcion:any){
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    const validar = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) && typeof mnd !== 'undefined';
    console.log(mnd.code);
    this.moneda_selected_codigo = validar ? mnd.code : '';
    this.moneda_selected_decimales = validar ? mnd.decimales : '';
    this.tipo_cambio_numerico = typeof mnd !== 'undefined' && mnd.code == "MXN" ? 1 : 0;
    this.tipo_cambio_string = typeof mnd !== 'undefined' && mnd.code == "MXN" ? "1.00" : "0.00";
    typeof mnd !== 'undefined'  ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  activaTipoCambio(){
    return (this.moneda_selected_codigo == "MXN");
  }

  keyupImporteAnticipo(object:any){
    const validacion = object.value != '' && this.validator.filtroNum(object.value);
    this.cantidad_anticipo = validacion ? object.value : 0;
    validacion ? this.validator.correctoInputRow(object) : this.validator.errorInputRow(object);
    this.multiplica_anticip_resultante();
  }

  editTipoCambio(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.tipo_cambio_numerico = validacion ? event.value : 1;
    this.tipo_cambio_string = validacion ? event.value : "1.00";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.multiplica_anticip_resultante();
  }

  multiplica_anticip_resultante(){
    var operacion = parseFloat(this.cantidad_anticipo.toString()) * parseFloat(this.tipo_cambio_numerico.toString()); 
    this.cantidad_anticipo_resultante = numeral(operacion).format('0,0.'+'0'.repeat(this.moneda_selected_decimales));
  }

  keyupObservaciones(object:any){
    const validacion = object.value != '' && this.validator.filtroAlfaNumerico(object.value) == true && object.value.length >= 4;
    this.observaciones = validacion ? object.value : "";
    validacion ? this.validator.correctoInputRow(object) : this.validator.errorInputRow(object);
  }

  get autoriza_registro():Boolean{
    const valida_proveedor = this.token_cat_proveedores != "";
    const valida_fecha_contabilizacion = this.fecha_contabilizacion != "" && this.validator.filtroFecha(this.fecha_contabilizacion);
    const valida_forma_pago = this.forma_pago_selec != "" && this.validator.filtroAlfaNumerico(this.forma_pago_selec);
    const valida_moneda = this.moneda_selected_codigo != '' && this.validator.filtroAlfaNumerico(this.moneda_selected_codigo);
    const valida_tipo_cambio = this.tipo_cambio_string != '' && this.validator.filtroNum(this.tipo_cambio_string) && ((this.moneda_selected_codigo == "MXN" && this.tipo_cambio_string == "1.00") || (this.moneda_selected_codigo != "MXN" && this.tipo_cambio_string != "1.00"));
    const valida_cantidad_anticipo = this.cantidad_anticipo != 0 && this.validator.filtroNum(this.cantidad_anticipo); 
    const valida_observaciones = this.observaciones != "" && this.validator.filtroAlfaNumerico(this.observaciones) && this.observaciones.length >= 4;
    return valida_proveedor && valida_fecha_contabilizacion && valida_forma_pago && valida_moneda && valida_tipo_cambio && valida_cantidad_anticipo && valida_observaciones;
  }

  anticipo_limpiar_form(){
    this.fecha_contabilizacion = "";
    this.forma_pago_selec = "";
    this.moneda_selected_codigo = "MXN";
    this.moneda_selected_decimales = 0;
    this.tipo_cambio_numerico = 1;
    this.tipo_cambio_string = "1.00";
    this.cantidad_anticipo = 0;
    this.observaciones = "";
  }

  guardaAnticipoProveedor(form:NgForm){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.btnVerAnticipFormulario = false;
          this.provSer.registraAnticipoProveedor(this.token_cat_proveedores,this.fecha_contabilizacion,this.forma_pago_selec,this.moneda_selected_codigo,this.moneda_selected_decimales,this.tipo_cambio_string,this.cantidad_anticipo,this.observaciones).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
                this.lista_Prov();
                form.reset();
                form.resetForm();
                this.formAddAnticipoNuevo.resetForm();
                this.anticipo_limpiar_form();
                this.listar_anticipos_proveedor();
                this.btnVerAnticipFormulario = true;
              }
              if (response.status == 'error') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton: false,
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
    );
  }

  onpresNumer(e:KeyboardEvent){
    this.validator.key_press_numbers(e);
  }

  onpresAlpha(e:KeyboardEvent){
    this.validator.key_press_alfa(e);
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}

