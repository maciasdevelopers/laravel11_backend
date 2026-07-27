import { FormBuilder, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { InterfClasificacion } from '../../../../../interfaces/interf-clasificacion';
import { CatSatServService } from '../../../../../servicios/ssic/cat-sat-serv.service';
import { global } from '../../../../../servicios/global_ssic';
import { InterfUmedida } from '../../../../../interfaces/interf-umedida';

import { InterfActIntangibles } from '../../../../../interfaces/interf-act-intangibles';
import { ActIntangiblesService } from '../../../../../servicios/ssic/act-intangibles.service';
import { InterfUsoCFDI } from '../../../../../interfaces/interf-uso-cfdi';
import { activoIntangibleAngularModelo } from '../../../../../modelos/activoIntangibleAngularModelo';

import { InterfPais } from '../../../../../interfaces/interf-pais';
import { PaisService } from '../../../../../servicios/ssic/pais.service';

import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';
import { ServEncryptService } from '../../../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';

import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import numeral from 'numeral';
import { QRCodeComponent } from 'angularx-qrcode';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-interno-egresos-catalogos-listaactivointang',
  templateUrl: './listaactivointangegresos.component.html',
  standalone: false,
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
    './listaactivointangegresos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class ListaActivoDiferidoInventariosComponent implements OnInit, OnDestroy {
  //registro
  public usuario: Usuarios;
  public modeloActIntangible: activoIntangibleAngularModelo;
  public porccoutact: string = '';
  public view_proveedores: boolean = false;
  public validateRegistroActivo: boolean = false;
  @ViewChild('formRegActIntang') formRegActIntang!: NgForm;
  public modal_registro_activo_familia: boolean = false;

  listActivosTrue: any = [];
  rangoPeriodoActivos: Date[] | undefined;
  indicadorActivosGeneral:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  loading = false;

  public modal_activo_familia_detalle: boolean = false;
  detalleActivoDiferido: any = [];
  amortizacion_periodos:any = [];
  public view_form_reg_act_diferido: boolean = true;
  actInfoForm: FormGroup;

  public modal_activo_familia_deleted: boolean = false;
  listDeletedActivos: any = [];
  private destruir$ = new Subject<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private _catSat: CatSatServService,
    private _intanServ: ActIntangiblesService,
    private _usoCFDI: CFDIService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef, 
    private _provServ: ProveedoresService,
    private primeAlerts: MessageService,
    private fb: FormBuilder
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.modeloActIntangible = new activoIntangibleAngularModelo('','','','','','','','','','','');
    this.actInfoForm = this.fb.group({
      categoria: [''],
      amortizacionContablePeriodo: [''],
      amortizacionFiscalPeriodo: ['']
    });
  }

  ngOnInit(): void {
    this.amortizacion_periodos = [
      {clave:"86400", valor:"Por día"},//clave:"periodDay",
      {clave:"604800", valor:"Por semana"},//clave:"periodWeek",
      {clave:"2629743", valor:"Por mes"},//clave:"periodMonth",
      {clave:"31556926",valor:"Por año"}//clave:"periodYear",
    ];
    this.ver_activos_intang_true('hoy');
    this.listar_activos_intang_deleted();
  }

  verRegistroFamiliaActivos() {
    this.modal_registro_activo_familia = true;
  }

  descarga_excel_activos_diferidos() { }

  listar_activos_intang_true(){
    this.ver_activos_intang_true(this.indicadorActivosGeneral);
  }

  ver_activos_intang_true(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
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
    
    this._intanServ.activosIntangGet(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_activo(response),
      error: (err) => this.error_alerta_activo(err)
    });
  }

  procesar_respuesta_activo(response: any){
    this.loading = false;
    if (response.status === 'success') {
      this.listActivosTrue = response.datosActivo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listActivosTrue = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_activo(error: any){
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.listActivosTrue = [];
  }

  funcViewActivoIntangible(token_act_intang: any) {
    this._intanServ.viewActivoIntan(token_act_intang).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosActivo);
          this.modal_activo_familia_detalle = true;
          this.view_form_reg_act_diferido = true;
          this.detalleActivoDiferido = response.datosActivo;
          this.detalleActivoDiferido.forEach((act: any) => {
            this.modeloActIntangible.categoria = act.categoria;
            this.modeloActIntangible.categoriaCuentaContable = act.categoria_cuenta_contable;

            this.modeloActIntangible.amortizacionContablePeriodo = act.amortizacion_contable_periodo;
            this.modeloActIntangible.amortizacionContableTiempoEjecucion = act.amortizacion_contable_tiempo_ejecucion;
            this.modeloActIntangible.amortizacionContableCuentaUno = act.amortizacion_contable_cuenta;
            this.modeloActIntangible.amortizacionContableCuentaDos = act.amortizacion_contable_cuenta_dos;

            this.modeloActIntangible.amortizacionFiscalPeriodo = act.amortizacion_fiscal_periodo;
            this.modeloActIntangible.amortizacionFiscalTiempoEjecucion = act.amortizacion_fiscal_tiempo_ejecucion;
            this.modeloActIntangible.amortizacionFiscalCuentaUno = act.amortizacion_fiscal_cuenta;
            this.modeloActIntangible.amortizacionFiscalCuentaDos = act.amortizacion_fiscal_cuenta_dos;
            this.modeloActIntangible.observaciones = act.activo_observaciones;

            this.actInfoForm.patchValue({ categoria: act.categoria });
            this.actInfoForm.patchValue({ amortizacionContablePeriodo: act.amortizacion_contable_periodo });
            this.actInfoForm.patchValue({ amortizacionFiscalPeriodo: act.amortizacion_fiscal_periodo });
          });
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyPressNumerico(objetoKeyPress: KeyboardEvent) {
    this.validator.key_press_numbers_clave_sat(objetoKeyPress);
  }

  activoCategoria(event:any,activo:any){
    this.modeloActIntangible.categoria = event.value;
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modeloActIntangible.categoria != activo.categoria;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActIntangible);
  }

  catCuentaContable(event:any,activo:any) {
    this.modeloActIntangible.categoriaCuentaContable = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modeloActIntangible.categoriaCuentaContable != activo.categoria_cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActIntangible);
  }

  amortizacionContablePeriodo(clave: any,activo:any) {
    var edit_actd_amort_cont_periodo = document.getElementById("edit_actd_amort_cont_periodo");
    let dcperiod = this.amortizacion_periodos.find((row: any) => clave != '' && row.clave === clave);
    this.modeloActIntangible.amortizacionContablePeriodo = clave;
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined' && this.modeloActIntangible.amortizacionContablePeriodo != activo.amortizacion_contable_periodo;
    validacion ? this.validator.correctoSelectBrowser(edit_actd_amort_cont_periodo) : this.validator.errorSelectBrowser(edit_actd_amort_cont_periodo);
    console.log(this.modeloActIntangible);
  }

  amortizacionContableTiempoEjecucion(event:any,activo:any) {
    this.modeloActIntangible.amortizacionContableTiempoEjecucion = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && this.modeloActIntangible.amortizacionContableTiempoEjecucion != activo.amortizacion_contable_tiempo_ejecucion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionContableCuenta(event:any,activo:any) {
    this.modeloActIntangible.amortizacionContableCuentaUno = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modeloActIntangible.amortizacionContableCuentaUno != activo.amortizacion_contable_cuenta;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionContableCuentaDos(event:any,activo:any) {
    this.modeloActIntangible.amortizacionContableCuentaDos = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modeloActIntangible.amortizacionContableCuentaDos != activo.amortizacion_contable_cuenta_dos;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //depreciacionFiscal
  amortizacionFiscalPeriodo(clave:any,activo:any) {
    var edit_actd_amort_fiscal_periodo = document.getElementById("edit_actd_amort_fiscal_periodo");
    let dcperiod = this.amortizacion_periodos.find((row: any) => clave != '' && row.clave === clave);
    this.modeloActIntangible.amortizacionFiscalPeriodo = clave;
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined' && this.modeloActIntangible.amortizacionFiscalPeriodo != activo.amortizacion_fiscal_periodo;
    validacion ? this.validator.correctoSelectBrowser(edit_actd_amort_fiscal_periodo) : this.validator.errorSelectBrowser(edit_actd_amort_fiscal_periodo);
    console.log(this.modeloActIntangible);
  }

  amortizacionFiscalTiempoEjecucion(event:any,activo:any) {
    this.modeloActIntangible.amortizacionFiscalTiempoEjecucion = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && this.modeloActIntangible.amortizacionFiscalTiempoEjecucion != activo.amortizacion_fiscal_tiempo_ejecucion;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionFiscalCuenta(event:any,activo:any) {
    this.modeloActIntangible.amortizacionFiscalCuentaUno = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modeloActIntangible.amortizacionFiscalCuentaUno != activo.amortizacion_fiscal_cuenta;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionFiscalCuentaDos(event:any,activo:any) {
    this.modeloActIntangible.amortizacionFiscalCuentaDos = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modeloActIntangible.amortizacionFiscalCuentaDos != activo.amortizacion_fiscal_cuenta_dos;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activoObservaciones(event:any,activo:any) {
    this.modeloActIntangible.observaciones = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && this.modeloActIntangible.observaciones != activo.activo_observaciones;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validateUpdateActivo(activo:any): Boolean {
    if (activo) {
      const mad = this.modeloActIntangible;
      const OKCategoria = mad.categoria != '' && this.validator.filtroAlfaSimbolos(mad.categoria) && mad.categoria != activo.categoria;
      const OKCategoriaCuenta = mad.categoriaCuentaContable != '' && this.validator.filtroAlfaNumerico(mad.categoriaCuentaContable) && mad.categoriaCuentaContable != activo.categoria_cuenta_contable;

      //depreciacionContable
      const OKDeprecContPeriodo = mad.amortizacionContablePeriodo != '' && this.validator.filtroAlfaNumerico(mad.amortizacionContablePeriodo) && mad.amortizacionContablePeriodo != activo.amortizacion_contable_periodo;
      const OKDeprecContImporte = mad.amortizacionContableTiempoEjecucion != '' && this.validator.filtroNum(mad.amortizacionContableTiempoEjecucion) && mad.amortizacionContableTiempoEjecucion != activo.amortizacion_contable_tiempo_ejecucion;
      const OKDeprecContCuenta = mad.amortizacionContableCuentaUno != '' && this.validator.filtroAlfaNumerico(mad.amortizacionContableCuentaUno) && mad.amortizacionContableCuentaUno != activo.amortizacion_contable_cuenta;
      const OKDeprecContCuentaDos = mad.amortizacionContableCuentaDos != '' && this.validator.filtroAlfaNumerico(mad.amortizacionContableCuentaDos) && mad.amortizacionContableCuentaDos != activo.amortizacion_contable_cuenta_dos;

      //depreciacionContable
      const OKDeprecFiscalPeriodo = mad.amortizacionFiscalPeriodo != '' && this.validator.filtroAlfaNumerico(mad.amortizacionFiscalPeriodo) && mad.amortizacionFiscalPeriodo != activo.amortizacion_fiscal_periodo;
      const OKDeprecFiscalImporte = mad.amortizacionFiscalTiempoEjecucion != '' && this.validator.filtroNum(mad.amortizacionFiscalTiempoEjecucion) && mad.amortizacionFiscalTiempoEjecucion != activo.amortizacion_fiscal_tiempo_ejecucion;
      const OKDeprecFiscalCuenta = mad.amortizacionFiscalCuentaUno != '' && this.validator.filtroAlfaNumerico(mad.amortizacionFiscalCuentaUno) && mad.amortizacionFiscalCuentaUno != activo.amortizacion_fiscal_cuenta;
      const OKDeprecFiscalCuentaDos = mad.amortizacionFiscalCuentaDos != '' && this.validator.filtroAlfaNumerico(mad.amortizacionFiscalCuentaDos) && mad.amortizacionFiscalCuentaDos != activo.amortizacion_fiscal_cuenta_dos;

      const OKDeprecObservaciones = mad.observaciones != '' && this.validator.filtroAlfaNumerico(mad.observaciones) && mad.observaciones != activo.activo_observaciones;
      return OKCategoria || OKCategoriaCuenta || OKDeprecContPeriodo || OKDeprecContImporte || OKDeprecContCuenta || OKDeprecContCuentaDos || 
        OKDeprecFiscalPeriodo || OKDeprecFiscalImporte || OKDeprecFiscalCuenta || OKDeprecFiscalCuentaDos || OKDeprecObservaciones;
    } else {
      return false;
    }
  }

  updateActivoFijo(form: { reset: () => void; }, activo:any): void {
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
        this.view_form_reg_act_diferido = false;
        this._intanServ.actualizaGeneralesActivoIntan(activo.token_act_intang, this.modeloActIntangible).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            const ok = response.status === 'success';
            this.primeAlerts.add({ severity: ok ? 'success' : 'error', summary: 'SOS-México informa: ', detail: translate_response });
            if (response.status == 'success') {
              form.reset();
              this.view_form_reg_act_diferido = true;
              this.listar_activos_intang_true();
              this.funcViewActivoIntangible(activo.token_act_intang);
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    });
  }

  funcDeleteActivoIntangible(token_act_intang: any) {
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
        this._intanServ.deletepapeleraactivointang(token_act_intang).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.listar_activos_intang_true();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
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
        )
      }
    });
  }

  verDeletedFamActFijos() {
    this.modal_activo_familia_deleted = true;
    this.listar_activos_intang_deleted();
  }

  listar_activos_intang_deleted() {
    this._intanServ.listaActivosIntanDeleted().pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesar_respuesta_deleted_activo(response),
      error: (err) => this.error_alerta_deleted_activo(err)
    });
  }

  procesar_respuesta_deleted_activo(response: any){
    this.loading = false;
    if (response.status === 'success') {
      this.listDeletedActivos = response.datosActivo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listDeletedActivos = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_deleted_activo(error: any){
    this.loading = false;
    console.error('Error al cargar compras:', error);
    this.listDeletedActivos = [];
  }

  funcRestoreActivoIntangible(token_act_intang: any) {
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
        //alert(dattknprod);
        this._intanServ.restartActivosIntang(token_act_intang).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
              this.listar_activos_intang_deleted();
              this.listar_activos_intang_true();
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
        )
      }
    });
  }

  funcDeleteTotalActivoIntangible(token_act_intang: any) {
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
        //alert(dattknprod);
        this._intanServ.deleteDeadActivosIntang(token_act_intang).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.listar_activos_intang_true();
              this.listar_activos_intang_deleted();
              this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
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
        )
      }
    });
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
