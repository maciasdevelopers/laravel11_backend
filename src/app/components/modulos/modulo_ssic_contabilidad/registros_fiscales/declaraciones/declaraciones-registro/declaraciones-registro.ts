import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { declaracionesModelo } from '../../../../../../modelos/declaraciones/declaracionesModelo';
import { declaracionPagarModelo } from '../../../../../../modelos/declaraciones/declaracionPagarModelo';
import { ImpuestosServService } from '../../../../../../servicios/ssic/impuestos-serv.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DeclaracionesService } from '../../../../../../servicios/ssic/declaraciones-service';

@Component({
  selector: 'contabilidad_declaraciones_registro',
  standalone: false,
  templateUrl: './declaraciones-registro.html',
  styleUrls: [
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
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
    '../../../../../../styles/switches.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/explain.css',
    '../../../contabilidad.css',
    './declaraciones-registro.css'
  ],
})
export class DeclaracionesRegistroComponent {
  public identidad: any;
  public modelDeclaraciones: declaracionesModelo;
  public modelDeclaracionPagar: declaracionPagarModelo;
  public declaracion_form: boolean = true;
  declaracionForm!: FormGroup;
  ejercicio: any = null;
  min_ejercicio: any = null;
  max_ejercicio: any = null;
  periodo: any = null;
  tipos_declaracion: any = [];
  tipos_periodicidad: any = [];
  medios_presentacion: any = [];

  impuestos_list_declaracion: any = [];
  impuesto_selected: any = null;
  public DeclaracionAnexosNames: any = [];
  public docsDeclaracionAnexos: any[] = [];
  public filesDeclaracion: NgxFileDropEntry[] = [];

  constructor(
    private sentinela: SentinelArkManager,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private _catImp: ImpuestosServService,
    private relInterna: ComunicacionInternaService,
    private decla_serv: DeclaracionesService,
    private cd: ChangeDetectorRef
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.modelDeclaraciones = new declaracionesModelo('','','','','','','','','','0','','','MXN',2,[],[],'',[]);
    this.modelDeclaracionPagar = new declaracionPagarModelo('','',0,0,0,0,0,0,0);
  }

  ngOnInit(): void { // al menos uno
    this.catalogoImpuestosDeclaracion();
    this.tipos_declaracion = [
      { valor: 'normal', tipo: 'Normal' },
      { valor: 'comple', tipo: 'Complementaria' }
    ];
    this.tipos_periodicidad = [
      { periodicidad: 'semanal' },
      { periodicidad: 'catorcenal' },
      { periodicidad: 'quincenal' },
      { periodicidad: 'mensual' },
      { periodicidad: 'bimestral' },
      { periodicidad: 'trimestral' },
      { periodicidad: 'cuatrimestral' },
      { periodicidad: 'semestral' },
      { periodicidad: 'anual' }
    ];
    this.medios_presentacion = [
      { valor: 'internet', medio: 'Internet' },
      { valor: 'ventanilla', medio: 'Ventanilla' }
    ];
  }

  catalogoImpuestosDeclaracion() {
    this._catImp.catalogoImpuestosTrueDeclaracion().subscribe(
      response => {
        if (response.status == 'success') {
          this.impuestos_list_declaracion = response.impuestos;
          console.log(this.impuestos_list_declaracion);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  select_fecha_contabilizacion(event: any) {
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelDeclaraciones.fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTipoDeclaracion(opcion: any) {
    console.log(opcion);
    var declaTipo = document.getElementById("declaTipo");
    const tdec = this.tipos_declaracion.find((row: any) => row.tipo === opcion.tipo);
    const validacion = opcion.tipo != '' && typeof tdec !== 'undefined';
    this.modelDeclaraciones.tipo_declaracion = validacion ? tdec.valor : '';
    validacion ? this.validator.correctoInputRow(declaTipo) : this.validator.errorInputRow(declaTipo);
  }

  changePeriodicidad(opcion: any) {
    console.log(opcion);
    var declaPeriodicidad = document.getElementById("declaPeriodicidad");
    let nper = this.tipos_periodicidad.find((row: any) => row.periodicidad === opcion.periodicidad);
    const validacion = opcion.periodicidad != '' && typeof nper !== 'undefined';
    this.modelDeclaraciones.periodicidad = validacion ? nper.periodicidad : '';
    validacion ? this.validator.correctoSelectBrowser(declaPeriodicidad) : this.validator.errorSelectBrowser(declaPeriodicidad);
  }

  selectEjercicio() {
    console.log(this.ejercicio.getFullYear());
    var declaEjercicio = document.getElementById("declaEjercicio");
    const validacion = this.ejercicio.getFullYear() && this.validator.filtroNum(this.ejercicio.getFullYear());
    this.modelDeclaraciones.ejercicio = validacion ? this.ejercicio.getFullYear() : '';
    validacion ? this.validator.correctoInputRow(declaEjercicio) : this.validator.errorInputRow(declaEjercicio);
    if (validacion) {
      this.min_ejercicio = new Date(parseInt(this.modelDeclaraciones.ejercicio), 0, 1);
      this.max_ejercicio = new Date(parseInt(this.modelDeclaraciones.ejercicio), 11, 31);
    }
    console.log(this.modelDeclaraciones);
  }

  selectEjercicioPeriodo() {
    var declaPeriodo = document.getElementById("declaPeriodo");
    if (this.periodo && this.periodo.length === 2) {
      const dateInicio = this.periodo[0];
      const dateFin = this.periodo[1];
      if (dateInicio && dateFin) {
        const validacionInicio = dateInicio && this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
        const validacionFin = dateFin && this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
        if (validacionInicio && validacionFin) {
          const inicioDate = new Date(dateInicio.getFullYear(), dateInicio.getMonth(), 1);
          const finDate = new Date(dateFin.getFullYear(), dateFin.getMonth() + 1, 0);
          // Convertimos las fechas a formato yyyy-mm-dd
          const inicio = inicioDate.toISOString().split('T')[0];
          const fin = finDate.toISOString().split('T')[0];
  
          // Guardamos en tus variables de nómina
          this.modelDeclaraciones.periodo_inicio = inicio;
          this.modelDeclaraciones.periodo_fin = fin;
  
          // Indicas al validador visual que está correcto
          this.validator.correctoInputRow(declaPeriodo);
        } else {
          // Si algo está mal, limpias y marcas error
          this.modelDeclaraciones.periodo_inicio = '';
          this.modelDeclaraciones.periodo_fin = '';
          this.validator.errorInputRow(declaPeriodo);
        }
      } else {
        this.validator.errorInputRow(declaPeriodo);
        return;
      }
    } else {
      // Si sólo hay una fecha o no hay nada
      this.modelDeclaraciones.periodo_inicio = '';
      this.modelDeclaraciones.periodo_fin = '';
      this.validator.errorInputRow(declaPeriodo);
    }
    console.log(this.modelDeclaraciones);
  }

  select_fecha_presentacion(event: any) {
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelDeclaraciones.fecha_presentacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeMedioPresentacion(opcion: any) {
    console.log(opcion);
    var declaMedioPresent = document.getElementById("declaMedioPresent");
    let med_present = this.medios_presentacion.find((row: any) => row.valor === opcion.valor);
    const validacion = opcion.valor != '' && typeof med_present !== 'undefined';
    this.modelDeclaraciones.medio_presentacion = validacion ? med_present.valor : '';
    validacion ? this.validator.correctoSelectBrowser(declaMedioPresent) : this.validator.errorSelectBrowser(declaMedioPresent);
  }

  select_vencimiento_obligacion(event: any) {
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelDeclaraciones.fecha_vencimiento = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_version(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaraciones.version = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_numero_operacion(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaraciones.numero_operacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyup_linea_de_captura(event: any) {
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelDeclaraciones.linea_de_captura = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  /* ================= DESGLOSE ================= */
  changeDesgPayConcepto(token_catalogo_impuesto: any) {
    console.log(token_catalogo_impuesto);
    var desgPayConcepto = document.getElementById("desgPayConcepto");
    let impList = this.impuestos_list_declaracion.find((row: any) => row.token_catalogo_impuesto === token_catalogo_impuesto);
    const validacion = token_catalogo_impuesto != '' && typeof impList !== 'undefined';
    this.modelDeclaracionPagar.concepto_de_pago_token = validacion ? impList.token_catalogo_impuesto : '';
    this.modelDeclaracionPagar.concepto_de_pago_name = validacion ? impList.folio_impuesto + ' ' + impList.concepto_impuesto + ' (' + impList.abreviacion_impuesto + ')' : '';
    validacion ? this.validator.correctoSelectBrowser(desgPayConcepto) : this.validator.errorSelectBrowser(desgPayConcepto);
  }

  keyupDesgPayImporteAFavor(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.importe_a_favor = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayACargo(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.a_cargo = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayActualizaciones(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.actualizaciones = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayRecargos(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.recargos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayOtrosCargos(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.otros_cargos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupDesgPayOtrosAbonos(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelDeclaracionPagar.otros_abonos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get desgPayCantidadACargo() {
    const decp = this.modelDeclaracionPagar;
    let suman = Number(decp.a_cargo || 0) + Number(decp.actualizaciones || 0) + Number(decp.recargos || 0) + Number(decp.otros_cargos || 0);
    let suma_total = suman - Number(decp.otros_abonos || 0);
    decp.cantidad_a_cargo = suma_total;
    return suma_total;
  }

  get validaDesglose(): Boolean {
    let impList = this.impuestos_list_declaracion.find((row: any) => row.token_catalogo_impuesto === this.modelDeclaracionPagar.concepto_de_pago_token);
    const validaConcepto = this.modelDeclaracionPagar.concepto_de_pago_token != '' && typeof impList !== 'undefined';
    const validaImporteAFavor = this.modelDeclaracionPagar.importe_a_favor >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.importe_a_favor);
    const validaACargo = this.modelDeclaracionPagar.a_cargo >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.a_cargo);
    const validaRecargos = this.modelDeclaracionPagar.recargos >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.recargos);
    const validaCantidadACargo = this.modelDeclaracionPagar.cantidad_a_cargo >= 0 && this.validator.filtroNum(this.modelDeclaracionPagar.cantidad_a_cargo);
    return validaConcepto && validaACargo && validaCantidadACargo;
  }

  addImpuestosDeclarar() {
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
        this.modelDeclaraciones.declaraciones_lista_pagar.push({
          "concepto_pago_token": this.modelDeclaracionPagar.concepto_de_pago_token,
          "concepto_pago_name": this.modelDeclaracionPagar.concepto_de_pago_name,
          "importe_a_favor": parseInt(this.modelDeclaracionPagar.importe_a_favor.toString()),
          "a_cargo": parseInt(this.modelDeclaracionPagar.a_cargo.toString()),
          "actualizaciones": parseInt(this.modelDeclaracionPagar.actualizaciones.toString()),
          "recargos": parseInt(this.modelDeclaracionPagar.recargos.toString()),
          "otros_cargos": parseInt(this.modelDeclaracionPagar.otros_cargos.toString()),
          "otros_abonos": parseInt(this.modelDeclaracionPagar.otros_abonos.toString()),
          "cantidad_a_pagar": parseInt(this.modelDeclaracionPagar.cantidad_a_cargo.toString()),
        });
        //this.recalcularNewTotales();
        this.modelDeclaracionPagar = new declaracionPagarModelo('','',0,0,0,0,0,0,0);
        this.validator.limpiaInputRow(document.getElementById("desgPayConcepto"));
        this.validator.limpiaInputRow(document.getElementById("desgPayImporteAFavor"));
        this.validator.limpiaInputRow(document.getElementById("desgPayACargo"));
        this.validator.limpiaInputRow(document.getElementById("desgPayActualizaciones"));
        this.validator.limpiaInputRow(document.getElementById("desgPayRecargos"));
        this.validator.limpiaInputRow(document.getElementById("desgPayOtrosCargos"));
        this.validator.limpiaInputRow(document.getElementById("desgPayOtrosAbonos"));

        this.impuesto_selected = null;
        this.cd.detectChanges();
      }
    })
  }

  /* ================= CALCULOS ================= */
  get calculo_importe_a_favor() {
    const importe_a_favor = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.importe_a_favor || 0), 0);
    return this.formatNumber(importe_a_favor);
  }

  get calculo_total_a_cargo() {
    const total_a_cargo = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.a_cargo || 0), 0);
    return this.formatNumber(total_a_cargo);
  }

  get calculo_total_actualizaciones() {
    const total_actualizaciones = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.actualizaciones || 0), 0);
    return this.formatNumber(total_actualizaciones);
  }

  get calculo_total_recargos() {
    const total_recargos = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.recargos || 0), 0);
    return this.formatNumber(total_recargos);
  }

  get calculo_total_otros_cargos() {
    const total_otros_cargos = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.otros_cargos || 0), 0);
    return this.formatNumber(total_otros_cargos);
  }

  get calculo_total_otros_abonos() {
    const total_otros_abonos = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.otros_abonos || 0), 0);
    return this.formatNumber(total_otros_abonos);
  }

  get calculo_total_cantidad_a_pagar() {
    const total_cantidad_a_pagar = this.modelDeclaraciones.declaraciones_lista_pagar.reduce((desp: any, item: any) => desp + Number(item.cantidad_a_pagar || 0), 0);
    return this.formatNumber(total_cantidad_a_pagar);
  }

  formatNumber(v: number | undefined): string {
    const n = Number(v || 0);
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }

  roundToCents(n: number): number {
    console.log(n);
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  deleteDeclaracion(posicion: number) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.modelDeclaraciones.declaraciones_lista_pagar.splice(posicion, 1);
          console.log(this.modelDeclaraciones.declaraciones_lista_pagar.length);
          //this.recalcularNewTotales();
          this.cd.detectChanges();
        }
      }
    );
  }

  keyupObservacionDeclaracion(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.modelDeclaraciones.observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedDeclaracion(files: NgxFileDropEntry[]) {
    this.filesDeclaracion = files;
    this.DeclaracionAnexosNames = [];
    this.docsDeclaracionAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsDeclaracionAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.DeclaracionAnexosNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.docsDeclaracionAnexos.length > 0) {
              for (let j = 0; j < this.docsDeclaracionAnexos.length; j++) {
                const row = this.docsDeclaracionAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsDeclaracionAnexos.push(file);
                }
              }
            } else {
              this.docsDeclaracionAnexos.push(file);
            }
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El event.value ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.filesDeclaracion.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsDeclaracionAnexos.length);
  }

  public fileOverDeclaracion(event: any) {
    console.log(event);
  }

  public fileLeaveDeclaracion(event: any) {
    console.log(event);
  }

  deleteAnexosDeclaracion(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionedo?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.filesDeclaracion.splice(posicion, 1);
          this.docsDeclaracionAnexos.splice(posicion, 1);
          this.DeclaracionAnexosNames.splice(posicion, 1);
          console.log(this.docsDeclaracionAnexos.length);
        }
      }
    );
  }

  get validate_declaracion_reg(): Boolean {
    const dec = this.modelDeclaraciones;
    const validaFechaCont = dec.fecha_contabilizacion != '' && this.validator.filtroFecha(dec.fecha_contabilizacion);

    const tdec = this.tipos_declaracion.find((row: any) => row.valor === dec.tipo_declaracion);
    const validaTipoDeclaracion = dec.tipo_declaracion != '' && typeof tdec !== 'undefined';

    let nper = this.tipos_periodicidad.find((row: any) => row.periodicidad === dec.periodicidad);
    const validaPeriodicidad = dec.periodicidad != '' && typeof nper !== 'undefined';

    const validaEjercicio = dec.ejercicio != '' && this.validator.filtroNum(dec.ejercicio);

    const validaPeriodoInicio = dec.periodo_inicio != '' && this.validator.filtroFecha(dec.periodo_inicio);
    const validaPeriodoFin = dec.periodo_fin != '' && this.validator.filtroFecha(dec.periodo_fin);
    const validaFechaPresentacion = dec.fecha_presentacion != '' && this.validator.filtroFecha(dec.fecha_presentacion);

    let med_present = this.medios_presentacion.find((row: any) => row.valor === dec.medio_presentacion);
    const validaMedioPresentacion = dec.medio_presentacion != '' && typeof med_present !== 'undefined';

    const validaVencimientoObligacion = dec.fecha_vencimiento != '' && this.validator.filtroFecha(dec.fecha_vencimiento);
    const validaVersion = dec.version != '' && this.validator.filtroNum(dec.version);
    const validaNumeroOperacion = dec.numero_operacion != '' && this.validator.filtroNum(dec.numero_operacion);
    const validaLineaCaptura = dec.linea_de_captura != '' && this.validator.filtroAlfaNumerico(dec.linea_de_captura);
    const validaDesglose = dec.declaraciones_lista_pagar.length > 0;

    const validaObservacion = dec.observaciones != "" && this.validator.filtroAlfaNumerico(dec.observaciones) && dec.observaciones.length >= 4;
    const validacion_documents = this.DeclaracionAnexosNames.length > 0;

    return validaFechaCont && validaTipoDeclaracion && validaPeriodicidad && validaEjercicio && validaPeriodoInicio && validaPeriodoFin && validaFechaPresentacion &&
      validaMedioPresentacion && validaVencimientoObligacion && validaVersion && validaNumeroOperacion && validaLineaCaptura && validaDesglose && validaObservacion && validacion_documents;
  }

  declaracionRegistro(form: NgForm): void {
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
        this.declaracion_form = false;
        this.decla_serv.registra_declaracion(this.modelDeclaraciones, this.docsDeclaracionAnexos).subscribe(
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
              this.relInterna.mensajeDeclaracionesRegistro("declaracion_registrada");
              form.reset();
              form.resetForm();
              this.declaracion_form = true;
              this.modelDeclaraciones = new declaracionesModelo('','','','','','','','','','0','','','MXN',2,[],[],'',[]);

              this.periodo = null;

              this.DeclaracionAnexosNames = [];
              this.docsDeclaracionAnexos = [];
              this.filesDeclaracion = [];
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
            //console.log(error);
          }
        );
      }
    })
  }
}
