import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ActFijosService } from '../../../../../servicios/ssic/act-fijos.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cont-act-fijos-component',
  standalone: false,
  templateUrl: './cont-act-fijos-component.html',
  //styleUrl: './cont-act-fijos-component.css'

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
    '../../contabilidad.css',
    './cont-act-fijos-component.css'
  ]
})
export class ContActFijosComponent implements OnInit,OnDestroy{
  listActivosCont: any = [];
  rangoPeriodoActivos: Date[] | undefined;
  indicadorActivosGeneral:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  loading = false;

  public modal_activo_deprec_detalle: boolean = false;
  deprec_pendientes_activo: any = [];
  deprec_registradas_activo: any = [];
  mejoras_registradas_activo: any = [];
  public view_form_reg_act_fijo: boolean = true;
  categorias_list: any = [];
  depreciacion_tipos: any = [];
  depreciacion_periodos: any = [];

  public lock_deprec_view_form:boolean = false;
  public lock_deprec_fecha_contabilizacion:string = "";

  public unlock_deprec_view_form:boolean = false;
  public unlock_deprec_fecha_de_desbloqueo:string = "";
  public unlock_deprec_fecha_proximo_corte:string = "";

  public new_deprec_view_form_registro:boolean = false;
  public new_deprec_fecha_contabilizacion:string = "";
  public new_deprec_gasto_contable:number = 0;
  public new_deprec_deduccion_de_inversion:number = 0;
  public new_deprec_observaciones:string = "";

  private destruir$ = new Subject<void>();

  constructor(
    public validator: ValidatorServService,
    public actFijo: ActFijosService,
    private translate: TranslateService,
    private primeAlerts: MessageService,
    private cd: ChangeDetectorRef
  ){
  }
  
  ngOnInit(): void {
    this.listActFijosTrue('hoy');
  }
  
  listActFijosTrue(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorActivosGeneral = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true; // Recomendado activar loading

    if (filtro == 'otras_fechas') {
      var act_contab_otras_fechas = document.getElementById("act_contab_otras_fechas");
      if (this.rangoPeriodoActivos && this.rangoPeriodoActivos.length === 2) {
        const dateInicio = this.rangoPeriodoActivos[0];
        const dateFin = this.rangoPeriodoActivos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(act_contab_otras_fechas);
          } else {
            this.validator.errorInputRow(act_contab_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(act_contab_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(act_contab_otras_fechas);
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
      this.listActivosCont = response.datosActivo;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.listActivosCont = []; // O manejar mensaje de "sin datos"
    }
  }

  error_alerta_activo(error: any){
    this.loading = false;
    console.error('Error al cargar el catálogo de activos:', error);
    this.listActivosCont = [];
  }

  recargar_lista_activos() {
    this.listActFijosTrue(this.indicadorActivosGeneral);
  }

  descarga_excel_activos_fijos() { }

///////////////////////////////////// desglose de activo fijo ////////////////////////////////////////////////
  verActivoFijoToDeprec(token_activof_unidad: any) {
    this.deprec_pendientes_activo = [];
    this.deprec_registradas_activo = [];
    this.mejoras_registradas_activo = [];

    forkJoin({
      detalle: this.actFijo.activoFijoDetalleToDeprec(token_activof_unidad),
      depreciaciones: this.actFijo.activoFijoDeprecionesRegistradas(token_activof_unidad),
      mejoras: this.actFijo.activoFijoMejorasRegistradas(token_activof_unidad)
    }).subscribe({
      next: (res:any) => {
        if (res.detalle.status === 'success' && res.depreciaciones.status === 'success') {
          this.deprec_pendientes_activo = res.detalle.lista_pendientes;
          this.deprec_registradas_activo = res.depreciaciones.depreciaciones;
          this.mejoras_registradas_activo = res.mejoras.mejoras;
          this.modal_activo_deprec_detalle = true;
          console.log("Datos cargados correctamente para el activo:", token_activof_unidad);
        }
      },
      error: (err) => {
        console.error("Fallo en la comunicación con el servidor contable", err);
      },
    });
  }

  open_form_lock_deprec(){
    this.lock_deprec_view_form = this.lock_deprec_view_form ? false :true;
  }

  changeLockDeprecFechaCont(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.lock_deprec_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activo_det_lock_deprec(actf:any,form:{reset:() => void;}){
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
        this.actFijo.bloqueaDepreciacionActivos(actf.token_activof_unidad,this.lock_deprec_fecha_contabilizacion).subscribe(
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
              form.reset();
              this.verActivoFijoToDeprec(actf.token_activof_unidad);
              //this.ejecuta_depreciacion_guardar(actf.token_activof_unidad,this.lock_deprec_fecha_contabilizacion);
              this.recargar_lista_activos();
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

  open_form_unlock_deprec(){
    this.unlock_deprec_view_form = this.unlock_deprec_view_form ? false :true;
  }

  changeUnlockDeprecFechaDeDesbloqueo(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.unlock_deprec_fecha_de_desbloqueo = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeUnlockDeprecFechaProximoCorte(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.unlock_deprec_fecha_proximo_corte = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaUnlockDeprecFecha():boolean{
    const validaFechaDesbloqueo = this.unlock_deprec_fecha_de_desbloqueo != '' && this.validator.filtroFecha(this.unlock_deprec_fecha_de_desbloqueo);
    const validaFechaProximoCorte = this.unlock_deprec_fecha_proximo_corte != '' && this.validator.filtroFecha(this.unlock_deprec_fecha_proximo_corte);
    return validaFechaDesbloqueo && validaFechaProximoCorte;
  }

  activo_det_unlock_deprec(actf:any,form:{reset:() => void;}){
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
        this.actFijo.desbloqueaDepreciacionActivos(actf.token_activof_unidad,this.unlock_deprec_fecha_de_desbloqueo,this.unlock_deprec_fecha_proximo_corte).subscribe(
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
              form.reset();
              this.verActivoFijoToDeprec(actf.token_activof_unidad);
              this.recargar_lista_activos();
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

  open_form_new_deprec(){
    this.new_deprec_view_form_registro = this.new_deprec_view_form_registro ? false :true;
  }

  changeDeprecFechaContabilizacion(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.new_deprec_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeDeprecGastoContable(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.new_deprec_gasto_contable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeDeprecDeduccionInversion(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.new_deprec_deduccion_de_inversion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDeprecObservaciones(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.new_deprec_observaciones = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaDeprecNew():boolean{
    const validaFechaContabilizacion = this.new_deprec_fecha_contabilizacion != '' && this.validator.filtroFecha(this.new_deprec_fecha_contabilizacion);
    const validaObservaciones = this.new_deprec_observaciones != "" && this.validator.filtroAlfaNumerico(this.new_deprec_observaciones) && this.new_deprec_observaciones.length >= 4;
    return validaFechaContabilizacion && validaObservaciones;
  }

  activo_guarda_depreciacion(actf:any,form:{reset:() => void;}){
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
        this.ejecuta_depreciacion_guardar(actf.token_activof_unidad,this.new_deprec_fecha_contabilizacion,this.new_deprec_observaciones,this.new_deprec_gasto_contable,this.new_deprec_deduccion_de_inversion);
        form.reset();
        this.new_deprec_view_form_registro = false;
        this.recargar_lista_activos();
      }
    })
  }

  ejecuta_depreciacion_guardar(token_activof_unidad:string,fecha_contabilizacion:string,observaciones:string,gasto_contable_manual:number,deduccion_de_inversion_manual:number){
    this.actFijo.activoFijoDepreciar(token_activof_unidad,fecha_contabilizacion,observaciones,gasto_contable_manual,deduccion_de_inversion_manual).subscribe(
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
          this.recargar_lista_activos();
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

///////////////////////////////////// depreciacion masiva de activos ////////////////////////////////////////////////
  iniciar_deprec_fecha(event:any,actf:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && actf;
    actf.fecha_iniciar_depreciacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activo_valida_deprec_save_fecha(actf:any): boolean {
    return actf.fecha_iniciar_depreciacion != "";
  }

  activo_guarda_deprec_fecha(actf:any){
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
        this.actFijo.guardarFechaDepreciacionActivos(actf.token_activof_unidad,actf.fecha_iniciar_depreciacion).subscribe(
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
              this.recargar_lista_activos();
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

  activo_lock_deprec(actf:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      input: 'date',
      inputLabel: 'Fecha de bloqueo',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        const fechaSeleccionada = result.value;
        this.actFijo.bloqueaDepreciacionActivos(actf.token_activof_unidad,fechaSeleccionada).subscribe(
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
              this.recargar_lista_activos();
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

  activo_unlock_deprec(actf:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      html: `
        <div class="col-12 input-group" style="text-align: left;">
          <label for="swal_det_fecha_de_desbloqueo" style="line-height: 20px;color: #1f2937 !important;justify-content: center;align-items: center;font-family: 'roboto_cr', fontAwesome;font-size: smaller;margin-bottom: 0 !important;height: 20px;width: 100%;" 
            class="swal2-label">Fecha de desbloqueo</label>
          <input type="date" id="swal_det_fecha_de_desbloqueo" name="swal_det_fecha_de_desbloqueo" class="swal2-input">
        </div>
        <div class="col-12 input-group" style="text-align: left;">
          <label for="swal_det_fecha_proximo_corte" style="line-height: 20px;color: #1f2937 !important;justify-content: center;align-items: center;font-family: 'roboto_cr', fontAwesome;font-size: smaller;margin-bottom: 0 !important;height: 20px;width: 100%;" 
            class="swal2-label" style="margin-top: 15px; display: block;">Fecha de reinicio de depreciación</label>
          <input type="date" id="swal_det_fecha_proximo_corte" name="swal_det_fecha_proximo_corte" class="swal2-input">
        </div>
      `,
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        const fecha_de_desbloqueo = (document.getElementById('swal_det_fecha_de_desbloqueo') as HTMLInputElement).value;
        const fecha_proximo_corte = (document.getElementById('swal_det_fecha_proximo_corte') as HTMLInputElement).value;
        this.actFijo.desbloqueaDepreciacionActivos(actf.token_activof_unidad,fecha_de_desbloqueo,fecha_proximo_corte).subscribe(
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
              this.recargar_lista_activos();
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
