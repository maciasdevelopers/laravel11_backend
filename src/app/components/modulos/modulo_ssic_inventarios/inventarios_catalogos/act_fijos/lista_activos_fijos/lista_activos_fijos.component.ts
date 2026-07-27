import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { CatSatServService } from '../../../../../../servicios/ssic/cat-sat-serv.service';
import { ActFijosService } from '../../../../../../servicios/ssic/act-fijos.service';
import { activoFijoAngularModelo } from '../../../../../../modelos/activoFijoAngularModelo';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
import { TranslateService } from '@ngx-translate/core';

import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-interno-egresos-catalogos-listaactivofijo',
  templateUrl: './lista_activos_fijos.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/file_input.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/navegador.css',
    '../../../inventarios.css',
    './lista_activos_fijos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class ListaActivoFijoEgresosComponent implements OnInit, OnDestroy {
  //registro
  public usuario: Usuarios;
  public modeloActFijo: activoFijoAngularModelo;
  public porccoutact: string = '';
  public view_proveedores: boolean = false;
  @ViewChild('formRegActfijos') formRegActfijos!: NgForm;

  public modal_registro_activo_familia: boolean = false;

  listActivosTrue: any = [];
  rangoPeriodoActivos: Date[] | undefined;
  indicadorActivosGeneral:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  loading = false;

  public modal_activo_familia_detalle: boolean = false;
  actInfoForm: FormGroup;
  detalleActivoFijo: any = [];
  public view_form_reg_act_fijo: boolean = true;
  categorias_list: any = [];
  depreciacion_tipos: any = [];
  depreciacion_periodos: any = [];

  categorias_array = [
    { valor: "Terrenos y edificios industriales" },
    { valor: "Maquinaria y equipo de producción" },
    { valor: "Vehículos de transporte y distribución" },
    { valor: "Mobiliario y enseres industriales" },
    { valor: "Equipos de control de calidad y laboratorio" },
    { valor: "Sistemas de energía y utilidades" },
    { valor: "Activos intangibles relacionados con la producción" },
  ];

  public modal_activo_familia_deleted: boolean = false;
  listActivosDeleted: any = [];

  private destruir$ = new Subject<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private validator: ValidatorServService,
    private _catSat: CatSatServService,
    private _actFijo: ActFijosService,
    private translate: TranslateService,
    private _provServ: ProveedoresService,
    private primeAlerts: MessageService,
    private cd: ChangeDetectorRef, 
    private fb: FormBuilder
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.modeloActFijo = new activoFijoAngularModelo('', '', '', '', '', '', '', '', '', '', '', '', '');
    this.actInfoForm = this.fb.group({
      categoria: [''],
      depreciacionContableTipo: [''],
      depreciacionContablePeriodo: [''],
      depreciacionFiscalTipo: [''],
      depreciacionFiscalPeriodo: ['']
    });
  }

  ngOnInit(): void {
    this.depreciacion_tipos = [
      { clave: "porcentaje", valor: "Porcentaje" },
      { clave: "cuota", valor: "Cuota" }
    ];
    this.depreciacion_periodos = [
      { clave: "86400", valor: "Por día" },//clave:"periodDay",
      { clave: "604800", valor: "Por semana" },//clave:"periodWeek",
      { clave: "2629743", valor: "Por mes" },//clave:"periodMonth",
      { clave: "31556926", valor: "Por año" }//clave:"periodYear",
    ];
    this.listFamActFijosTrue('hoy');
  }

  verRegistroFamiliaActivos() {
    this.modal_registro_activo_familia = true;
  }

  listFamActFijosTrue(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorActivosGeneral = filtro;
    this.loading = true; // Recomendado activar loading
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var act_otras_fechas = document.getElementById("act_otras_fechas");
      if (this.rangoPeriodoActivos && this.rangoPeriodoActivos.length === 2) {
        const dateInicio = this.rangoPeriodoActivos[0];
        const dateFin = this.rangoPeriodoActivos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(act_otras_fechas);
          } else {
            this.validator.errorInputRow(act_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(act_otras_fechas);
        return;
      }
    }
    
    this._actFijo.activosFijosCatalogo(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_activo(response),
      error: (err) => this.error_alerta_activo(err)
    });
  }

  procesar_respuesta_activo(response: any){
    console.log(response)
    this.loading = false;
    if (response.status === 'success') {
      this.listActivosTrue = response.datosActivo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listActivosTrue = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_activo(error: any){
    console.log(error)
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.listActivosTrue = [];
  }

  recargar_lista_activos() {
    this.listFamActFijosTrue(this.indicadorActivosGeneral);
  }

  descarga_excel_activos_fijos() { }

  funcViewActivoFijo(token_act_fijo: any) {
    this._actFijo.viewActivoFijo(token_act_fijo).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosActivo);
          this.modal_activo_familia_detalle = true;
          this.detalleActivoFijo = response.datosActivo;
          this.detalleActivoFijo.forEach((act: any) => {
            this.modeloActFijo.categoria = act.categoria;
            this.modeloActFijo.categoriaCuentaContable = act.categoria_cuenta_contable;

            this.modeloActFijo.depreciacionContableTipo = act.deprec_contable_tipo;
            this.modeloActFijo.depreciacionContablePeriodo = act.deprec_contable_periodo;
            this.modeloActFijo.depreciacionContableImporte = act.deprec_contable_importe;
            this.modeloActFijo.depreciacionContableCuentaUno = act.deprec_contable_cuenta;
            this.modeloActFijo.depreciacionContableCuentaDos = act.deprec_contable_cuenta_dos;

            this.modeloActFijo.depreciacionFiscalTipo = act.deprec_fiscal_tipo;
            this.modeloActFijo.depreciacionFiscalPeriodo = act.deprec_fiscal_periodo;
            this.modeloActFijo.depreciacionFiscalImporte = act.deprec_fiscal_importe;
            this.modeloActFijo.depreciacionFiscalCuentaUno = act.deprec_fiscal_cuenta;
            this.modeloActFijo.depreciacionFiscalCuentaDos = act.deprec_fiscal_cuenta_dos;
            this.modeloActFijo.observaciones = act.activo_observaciones;

            this.actInfoForm.patchValue({ categoria: act.categoria });
            this.actInfoForm.patchValue({ depreciacionContableTipo: act.deprec_contable_tipo });
            this.actInfoForm.patchValue({ depreciacionContablePeriodo: act.deprec_contable_periodo });
            this.actInfoForm.patchValue({ depreciacionFiscalTipo: act.deprec_fiscal_tipo });
            this.actInfoForm.patchValue({ depreciacionFiscalPeriodo: act.deprec_fiscal_periodo });
          });
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  filtrar(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.categorias_array as any[]).length; i++) {
      let country = (this.categorias_array as any[])[i];
      if (country.valor.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.categorias_list = filtered;
    console.log(this.categorias_list);
  }

  keypressProvServClave(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (this.validator.strFilter(clave) == false) {
      this.validator.deten(event);
    }
  }

  keyPressNumerico(objetoKeyPress: KeyboardEvent) {
    this.validator.key_press_numbers_clave_sat(objetoKeyPress);
  }

  activoCategoriaInput(event: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    console.log(event.value)
    this.modeloActFijo.categoria = event.value;
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof actdata !== 'undefined' && this.modeloActFijo.categoria != actdata.categoria;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActFijo.categoria);
  }

  activoCategoriaSelect(event: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    console.log(event.valor)
    let categoria = event.valor;
    var new_actf_categoria = document.getElementById("new_actf_categoria");
    this.modeloActFijo.categoria = categoria;
    let validacion = categoria != '' && this.validator.filtroAlfaNumerico(categoria) && typeof actdata !== 'undefined' && this.modeloActFijo.categoria != actdata.categoria;
    validacion ? this.validator.correctoInputRow(new_actf_categoria) : this.validator.errorInputRow(new_actf_categoria);
    console.log(this.modeloActFijo.categoria);
  }

  catCuentaContable(event:any,token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    this.modeloActFijo.categoriaCuentaContable = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof actdata !== 'undefined' && this.modeloActFijo.categoriaCuentaContable != actdata.categoria_cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActFijo);
  }

  depreciacionContableTipo(clave: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    var new_actf_depcont_tipo = document.getElementById("new_actf_depcont_tipo");
    let dctipo = this.depreciacion_tipos.find((row: any) => clave != '' && row.clave === clave);
    this.modeloActFijo.depreciacionContableTipo = clave;
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dctipo !== 'undefined' && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionContableTipo != actdata.deprec_contable_tipo;
    validacion ? this.validator.correctoSelectBrowser(new_actf_depcont_tipo) : this.validator.errorSelectBrowser(new_actf_depcont_tipo);
    console.log(this.modeloActFijo);
  }

  depreciacionContablePeriodo(clave: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    var new_actf_depcont_periodo = document.getElementById("new_actf_depcont_periodo");
    let dcperiod = this.depreciacion_periodos.find((row: any) => clave != '' && row.clave === clave);
    this.modeloActFijo.depreciacionContablePeriodo = clave;
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined' && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionContablePeriodo != actdata.deprec_contable_periodo;
    validacion ? this.validator.correctoSelectBrowser(new_actf_depcont_periodo) : this.validator.errorSelectBrowser(new_actf_depcont_periodo);
    console.log(this.modeloActFijo);
  }

  depreciacionContableImporte(event: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    const valida_dep_porcentaje = this.modeloActFijo.depreciacionContableTipo == 'porcentaje' && this.validator.filtroPorcentaje(event.value);
    const valida_dep_cuota = this.modeloActFijo.depreciacionContableTipo == 'cuota' && this.validator.filtroCosto(event.value);
    this.modeloActFijo.depreciacionContableImporte = event.value;
    const validacion = event.value != '' && (valida_dep_porcentaje || valida_dep_cuota) && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionContableImporte != actdata.deprec_contable_importe;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionContableCuenta(event: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    this.modeloActFijo.depreciacionContableCuentaUno = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionContableCuentaUno != actdata.deprec_contable_cuenta;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionContableCuentaDos(event:any,token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    this.modeloActFijo.depreciacionContableCuentaDos = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionContableCuentaDos != actdata.deprec_contable_cuenta_dos;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //depreciacionFiscal
  depreciacionFiscalTipo(clave: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    var new_actf_depfiscal_tipo = document.getElementById("new_actf_depfiscal_tipo");
    let dctipo = this.depreciacion_tipos.find((row: any) => clave != '' && row.clave === clave);
    this.modeloActFijo.depreciacionFiscalTipo = clave;
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dctipo !== 'undefined' && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionFiscalTipo != actdata.deprec_fiscal_tipo;
    validacion ? this.validator.correctoSelectBrowser(new_actf_depfiscal_tipo) : this.validator.errorSelectBrowser(new_actf_depfiscal_tipo);
  }

  depreciacionFiscalPeriodo(clave: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    var new_actf_depfiscal_periodo = document.getElementById("new_actf_depfiscal_periodo");
    let dcperiod = this.depreciacion_periodos.find((row: any) => clave != '' && row.clave === clave);
    this.modeloActFijo.depreciacionFiscalPeriodo = clave;
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined' && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionFiscalPeriodo != actdata.deprec_fiscal_periodo;
    validacion ? this.validator.correctoSelectBrowser(new_actf_depfiscal_periodo) : this.validator.errorSelectBrowser(new_actf_depfiscal_periodo);
    console.log(this.modeloActFijo);
  }

  depreciacionFiscalImporte(event: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    const valida_dep_porcentaje = this.modeloActFijo.depreciacionFiscalTipo == 'porcentaje' && this.validator.filtroPorcentaje(event.value);
    const valida_dep_cuota = this.modeloActFijo.depreciacionFiscalTipo == 'cuota' && this.validator.filtroCosto(event.value);
    this.modeloActFijo.depreciacionFiscalImporte = event.value;
    const validacion = event.value != '' && (valida_dep_porcentaje || valida_dep_cuota) && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionFiscalImporte != actdata.deprec_fiscal_importe;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionFiscalCuenta(event: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    this.modeloActFijo.depreciacionFiscalCuentaUno = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionFiscalCuentaUno != actdata.deprec_fiscal_cuenta;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionFiscalCuentaDos(event:any,token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    this.modeloActFijo.depreciacionFiscalCuentaDos = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof actdata !== 'undefined' && this.modeloActFijo.depreciacionFiscalCuentaDos != actdata.deprec_fiscal_cuenta_dos;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activoObservaciones(event: any, token_act_fijos: string) {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    this.modeloActFijo.observaciones = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && typeof actdata !== 'undefined' && this.modeloActFijo.observaciones != actdata.activo_observaciones;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validateUpdateActivo(token_act_fijos: string): Boolean {
    const actdata = this.detalleActivoFijo.find((act: any) => act.token_act_fijos === token_act_fijos);
    if (typeof actdata !== 'undefined') {
      const maf = this.modeloActFijo;
      const OKCategoria = maf.categoria != '' && this.validator.filtroAlfaSimbolos(maf.categoria) && this.modeloActFijo.categoria != actdata.categoria;
      const OKCategoriaCuenta = maf.categoriaCuentaContable != '' && this.validator.filtroAlfaNumerico(maf.categoriaCuentaContable) && maf.categoriaCuentaContable != actdata.categoria_cuenta_contable;

      //depreciacionContable
      const OKDeprecContTipo = maf.depreciacionContableTipo != '' && this.validator.filtroAlfaNumerico(maf.depreciacionContableTipo) && maf.depreciacionContableTipo != actdata.deprec_contable_tipo;
      const OKDeprecContPeriodo = maf.depreciacionContablePeriodo != '' && this.validator.filtroAlfaNumerico(maf.depreciacionContablePeriodo) && maf.depreciacionContablePeriodo != actdata.deprec_contable_periodo;
      const OKDeprecContPorcentaje = maf.depreciacionContableTipo == 'porcentaje' && this.validator.filtroPorcentaje(maf.depreciacionContableImporte);
      const OKDeprecContCuota = maf.depreciacionContableTipo == 'cuota' && this.validator.filtroCosto(maf.depreciacionContableImporte);
      const OKDeprecContImporte = maf.depreciacionContableImporte != '' && (OKDeprecContPorcentaje || OKDeprecContCuota) && maf.depreciacionContableImporte != actdata.deprec_contable_importe;
      const OKDeprecContCuenta = maf.depreciacionContableCuentaUno != '' && this.validator.filtroAlfaNumerico(maf.depreciacionContableCuentaUno) && maf.depreciacionContableCuentaUno != actdata.deprec_contable_cuenta;
      const OKDeprecContCuentaDos = maf.depreciacionContableCuentaDos != '' && this.validator.filtroAlfaNumerico(maf.depreciacionContableCuentaDos) && maf.depreciacionContableCuentaDos != actdata.deprec_contable_cuenta_dos;

      //depreciacionContable
      const OKDeprecFiscalTipo = maf.depreciacionFiscalTipo != '' && this.validator.filtroAlfaNumerico(maf.depreciacionFiscalTipo) && maf.depreciacionFiscalTipo != actdata.deprec_fiscal_tipo;
      const OKDeprecFiscalPeriodo = maf.depreciacionFiscalPeriodo != '' && this.validator.filtroAlfaNumerico(maf.depreciacionFiscalPeriodo) && maf.depreciacionFiscalPeriodo != actdata.deprec_fiscal_periodo;
      const OKDeprecFiscalPorcentaje = maf.depreciacionFiscalTipo == 'porcentaje' && this.validator.filtroPorcentaje(maf.depreciacionFiscalImporte);
      const OKDeprecFiscalCuota = maf.depreciacionFiscalTipo == 'cuota' && this.validator.filtroCosto(maf.depreciacionFiscalImporte);
      const OKDeprecFiscalImporte = maf.depreciacionFiscalImporte != '' && (OKDeprecFiscalPorcentaje || OKDeprecFiscalCuota) && maf.depreciacionFiscalImporte != actdata.deprec_fiscal_importe;
      const OKDeprecFiscalCuenta = maf.depreciacionFiscalCuentaUno != '' && this.validator.filtroAlfaNumerico(maf.depreciacionFiscalCuentaUno) && maf.depreciacionFiscalCuentaUno != actdata.deprec_fiscal_cuenta;
      const OKDeprecFiscalCuentaDos = maf.depreciacionFiscalCuentaDos != '' && this.validator.filtroAlfaNumerico(maf.depreciacionFiscalCuentaDos) && maf.depreciacionFiscalCuentaDos != actdata.deprec_fiscal_cuenta_dos;

      const OKDeprecObservaciones = maf.observaciones != '' && this.validator.filtroAlfaNumerico(maf.observaciones) && maf.observaciones != actdata.activo_observaciones;
      return OKCategoria || OKCategoriaCuenta || OKDeprecContTipo || OKDeprecContPeriodo || OKDeprecContImporte || OKDeprecContCuenta || OKDeprecContCuentaDos || 
        OKDeprecFiscalTipo || OKDeprecFiscalPeriodo || OKDeprecFiscalImporte || OKDeprecFiscalCuenta || OKDeprecFiscalCuentaDos || OKDeprecObservaciones;
    } else {
      return false;
    }
  }

  updateActivoFijo(form: { reset: () => void; }, token_act_fijos: string): void {
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
        this.view_form_reg_act_fijo = false;
        this._actFijo.actualizaGeneralesActivo(token_act_fijos, this.modeloActFijo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            const ok = response.status === 'success';
            this.primeAlerts.add({ severity: ok ? 'success' : 'error', summary: 'SOS-México informa: ', detail: translate_response });
            if (response.status == 'success') {
              form.reset();
              this.view_form_reg_act_fijo = true;
              this.recargar_lista_activos();
              this.funcViewActivoFijo(token_act_fijos);
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    });
  }

  funcDeleteActivoFijo(token_act_fijo: any) {
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
        this._actFijo.deletepapeleraactivofijo(token_act_fijo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            const ok = response.status === 'success';
            this.primeAlerts.add({ severity: ok ? 'success' : 'error', summary: 'SOS-México informa: ', detail: translate_response });
            if (response.status == 'success') {
              this.recargar_lista_activos();
              this.listFamActFijosDeleted();
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    });
  }

  verDeletedFamActFijos() {
    this.modal_activo_familia_deleted = false;
    this.listFamActFijosDeleted();
  }

  listFamActFijosDeleted(){
    this._actFijo.listaActivosFijosDeleted().subscribe(
      response => {
        if (response.status == 'success') {
          this.listActivosDeleted = response.datosActivo;
          this.modal_activo_familia_deleted = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  funcRestoreActivoFijo(token_act_fijos: any) {
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
        this._actFijo.restartActivosFijos(token_act_fijos).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            const ok = response.status === 'success';
            this.primeAlerts.add({ severity: ok ? 'success' : 'error', summary: 'SOS-México informa: ', detail: translate_response });
            if (response.status == 'success') {
              this.recargar_lista_activos();
              this.listFamActFijosDeleted();
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    });
  }

  funcDeleteTotalActivoFijo(token_act_fijos: any) {
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
        this._actFijo.deleteDeadActivosFijos(token_act_fijos).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            const ok = response.status === 'success';
            this.primeAlerts.add({ severity: ok ? 'success' : 'error', summary: 'SOS-México informa: ', detail: translate_response });
            if (response.status == 'success') {
              this.recargar_lista_activos();
              this.listFamActFijosDeleted();
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
