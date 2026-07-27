import { Component, OnInit } from '@angular/core';
import { DireccionesService } from '../../../../../../../servicios/ssic/direcciones.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import { ComunicacionInternaService } from '../../../../../../../servicios/comunicacion-interna.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { nominaImpuestoModelo } from '../../../../../../../modelos/nominas/nominaImpuestoModelo';
import { NgxFileDropEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';
import { NominaService } from '../../../../../../../servicios/ssic/nomina-service';
import { FedEstMunService } from '../../../../../../../servicios/ssic/fed-est-mun-service';

@Component({
  selector: 'vhum_impuesto_sobre_nomina_registro',
  standalone: false,

  templateUrl: './imp_sobre_nomi_registro.component.html',
  styleUrls: [
    '../../../../../../../styles/loading.css',
    '../../../../../../../styles/listas_ps.css',
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
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/explain.css',
    '../../../../../../../styles/switches.css',
    '../../../../../../../styles/navegador.css',
    '../../../../vhumano.css',
    './imp_sobre_nomi_registro.component.css']
})
export class IsnRegistroComponent implements OnInit {
  public modelNominaImp: nominaImpuestoModelo;

  fed_catalogo_activo: any = [];
  tipos_declaracion: any = [];
  ejercicio: any = null;
  min_ejercicio: any = null;
  max_ejercicio: any = null;
  periodo: any = null;
  public imp_sobre_nomina_form: boolean = true;

  public ImpNominaAnexosNames: any = [];
  public docsImpNominaAnexos: any[] = [];
  public filesImpNomina: NgxFileDropEntry[] = [];
  constructor(
    private dirServ: DireccionesService,
    private translate: TranslateService,
    public validator: ValidatorServService,
    private relInterna: ComunicacionInternaService,
    private nominaServ: NominaService,
    private fedEstMunServ: FedEstMunService,
    private fb: FormBuilder
  ) {
    this.modelNominaImp = new nominaImpuestoModelo('', '', '', '', '', '', '', '', '', '', '', 2, 0, 0, 0, 0, 0, 0, '0.00', 0, 0, 0, 0, 0, 0, 0, 0, '');
  }

  ngOnInit(): void {
    this.descarga_estados_mexico();
    this.tipos_declaracion = [
      { valor: 'normal', tipo: 'Normal' },
      { valor: 'comple', tipo: 'Complementaria' }
    ];
  }

  descarga_estados_mexico() {
    this.fedEstMunServ.fedEstMunCatalogoActivo().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.fed_catalogo_activo = response.federaciones;
          console.log(this.fed_catalogo_activo);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  select_fecha_contabilizacion(event: any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.modelNominaImp.fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.fecha_contabilizacion);
  }

  select_fecha_vencimiento(event: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.modelNominaImp.fecha_vencimiento = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.fecha_vencimiento);
  }

  select_fecha_presentacion(event: any) {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.modelNominaImp.fecha_presentacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.fecha_vencimiento);
  }

  changeEstadoNomina(opcion: any) {
    console.log(opcion);
    var contribNominaEstado = document.getElementById("contribNominaEstado");
    const entFed = this.fed_catalogo_activo.find((row: any) => row.fed_est_mun_token === opcion.fed_est_mun_token);
    const validacion = opcion.fed_est_mun_token != '' && typeof entFed !== 'undefined';
    this.modelNominaImp.estado = validacion ? entFed.fed_est_mun_token : '';
    validacion ? this.validator.correctoInputRow(contribNominaEstado) : this.validator.errorInputRow(contribNominaEstado);
  }

  selectEjercicio() {
    console.log(this.ejercicio.getFullYear());
    var contribNominaEjercicio = document.getElementById("contribNominaEjercicio");
    const validacion = this.ejercicio.getFullYear() && this.validator.filtroNum(this.ejercicio.getFullYear());
    this.modelNominaImp.ejercicio = validacion ? this.ejercicio.getFullYear() : '';
    validacion ? this.validator.correctoInputRow(contribNominaEjercicio) : this.validator.errorInputRow(contribNominaEjercicio);
    if (validacion) {
      this.min_ejercicio = new Date(parseInt(this.modelNominaImp.ejercicio), 0, 1);
      this.max_ejercicio = new Date(parseInt(this.modelNominaImp.ejercicio), 11, 31);
    }
    console.log(this.modelNominaImp);
  }

  selectEjercicioPeriodo() {
    var contribNominaEjercicioPeriodo = document.getElementById("contribNominaEjercicioPeriodo");
    if (this.periodo && this.periodo.length === 2) {
      const fechaInicio = this.periodo[0];
      const fechaFin = this.periodo[1];

      const validacionInicio = fechaInicio && this.validator.filtroFecha(fechaInicio.toISOString().split('T')[0]);
      const validacionFin = fechaFin && this.validator.filtroFecha(fechaFin.toISOString().split('T')[0]);

      if (validacionInicio && validacionFin) {
        const inicioDate = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
        const finDate = new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
        // Convertimos las fechas a formato yyyy-mm-dd
        const inicio = inicioDate.toISOString().split('T')[0];
        const fin = finDate.toISOString().split('T')[0];

        // Guardamos en tus variables de nómina
        this.modelNominaImp.periodo_inicio = inicio;
        this.modelNominaImp.periodo_fin = fin;

        // Indicas al validador visual que está correcto
        this.validator.correctoInputRow(contribNominaEjercicioPeriodo);
      } else {
        // Si algo está mal, limpias y marcas error
        this.modelNominaImp.periodo_inicio = '';
        this.modelNominaImp.periodo_fin = '';
        this.validator.errorInputRow(contribNominaEjercicioPeriodo);
      }
    } else {
      // Si sólo hay una fecha o no hay nada
      this.modelNominaImp.periodo_inicio = '';
      this.modelNominaImp.periodo_fin = '';
      this.validator.errorInputRow(contribNominaEjercicioPeriodo);
    }
    console.log(this.modelNominaImp);
  }

  changeTipoDeclaracion(opcion: any) {
    console.log(opcion);
    var contribNominaTipoDeclaracion = document.getElementById("contribNominaTipoDeclaracion");
    const tdec = this.tipos_declaracion.find((row: any) => row.tipo === opcion.tipo);
    const validacion = opcion.tipo != '' && typeof tdec !== 'undefined';
    this.modelNominaImp.tipo_declaracion = validacion ? tdec.valor : '';
    validacion ? this.validator.correctoInputRow(contribNominaTipoDeclaracion) : this.validator.errorInputRow(contribNominaTipoDeclaracion);
    if (validacion) {
      this.modelNominaImp.tipo_declaracion == 'comple' ? $("#impuesto_complementarias").removeClass("noneView") : $("#impuesto_complementarias").addClass("noneView");
    } else {
      $("#impuesto_complementarias").addClass("noneView");
    }
  }

  //total_remuneraciones_erogadas
  importeTotalRemuneracionesErogadas(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.total_remuneraciones_erogadas = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //Porcentage_total_remuneraciones_erogadas
  porcentageTRemuneracuinesErogadas(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //Calculo
  get calculoPorcentageTREnrogadas() {
    const caM = this.modelNominaImp;
    caM.importe_sobre_total_remuneraciones_erogadas = caM.total_remuneraciones_erogadas * (caM.porcent_sobre_total_remuneraciones_erogadas / 100);
    return caM.importe_sobre_total_remuneraciones_erogadas;
  }

  //porcent_sobre_total_remuneraciones_erogadas
  importePorcentSobreTotalRemuneracionesErogadas(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.importe_sobre_total_remuneraciones_erogadas = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //complementarias_impuesto_a_cargo
  importeComplementariasImpuestoACargo(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.complementarias_impuesto_a_cargo = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //complementarias_saldo_a_favor
  importeComplementariasSaldoAFavor(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.complementarias_saldo_a_favor = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_actualizado
  importeImpuestoActualizado(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.impuesto_actualizado = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelNominaImp.impuesto_actualizado);
  }

  //impuesto_descuento
  importeImpuestoDescuento(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.impuesto_descuento = validacion ? event.value : '0.00';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_recargos
  importeImpuestoRecargos(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.impuesto_recargos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_recargos_condonados
  importeImpuestoRecargosCondonados(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.impuesto_recargos_condonados = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //subsi_n_resolu_impuesto_pagar
  importeSubsiNResoluImpuestoPagar(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.subsi_n_resolu_impuesto_pagar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //subsi_n_resolu_recargos
  importeSubsiNResoluRecargos(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.subsi_n_resolu_recargos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //compensa_n_resolucion
  importeCompensaNResolucion(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.compensa_n_resolucion = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //compensa_n_resolu_recargos
  importeCompensaNResolucionRecargos(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.compensa_n_resolu_recargos = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_total_a_pagar
  importeImpuestoTotalAPagar(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.impuesto_total_a_pagar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //impuesto_saldo_a_favor
  importeImpuestoSaldoAFavor(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelNominaImp.impuesto_saldo_a_favor = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calculando_totales() {
    //var subsidios = parseFloat(this.modelNominaImp.subsi_n_resolu_impuesto_pagar.toString()) + parseFloat(this.modelNominaImp.subsi_n_resolu_recargos.toString());
    //var compensaciones = parseFloat(this.modelNominaImp.compensa_n_resolucion.toString()) + parseFloat(this.modelNominaImp.compensa_n_resolu_recargos.toString());
    //var total_calculo = parseFloat(this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas.toString())
    //+ parseFloat(this.modelNominaImp.complementarias_impuesto_a_cargo.toString())//Complementarias impuesto a cargo
    //+ parseFloat(this.modelNominaImp.impuesto_actualizado.toString())//Impuesto actualizado
    //+ parseFloat(this.modelNominaImp.impuesto_recargos.toString())//Recargos
    ////------------------------------------------------
    //- parseFloat(this.modelNominaImp.complementarias_saldo_a_favor.toString())//Complementarias saldo a favor
    //- parseFloat(this.modelNominaImp.impuesto_descuento.toString())//Descuento
    //- parseFloat(this.modelNominaImp.impuesto_recargos_condonados.toString())//Recargos condonados
    //- subsidios
    //- compensaciones;
    //console.log(total_calculo);
    ////------------------------------------------------
    ////= J) Total a pagar (si positivo)
    ////= K) Saldo a favor (si negativo)
  }

  keyupObservacionContribucionNomina(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.modelNominaImp.observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedImpNomina(files: NgxFileDropEntry[]) {
    this.filesImpNomina = files;
    this.ImpNominaAnexosNames = [];
    this.docsImpNominaAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsImpNominaAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.ImpNominaAnexosNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            if (this.docsImpNominaAnexos.length > 0) {
              for (let j = 0; j < this.docsImpNominaAnexos.length; j++) {
                const row = this.docsImpNominaAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsImpNominaAnexos.push(file);
                }
              }
            } else {
              this.docsImpNominaAnexos.push(file);
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
            this.filesImpNomina.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsImpNominaAnexos.length);
  }

  public fileOverImpNomina(event: any) {
    console.log(event);
  }

  public fileLeaveImpNomina(event: any) {
    console.log(event);
  }

  deleteAnexosImpNomina(posicion: any) {
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
          this.filesImpNomina.splice(posicion, 1);
          this.docsImpNominaAnexos.splice(posicion, 1);
          this.ImpNominaAnexosNames.splice(posicion, 1);
          console.log(this.docsImpNominaAnexos.length);
        }
      }
    );
  }

  get validate_reporteISN_registro(): Boolean {
    const validaFechaContabilizacion = this.modelNominaImp.fecha_contabilizacion != "" && this.validator.filtroFecha(this.modelNominaImp.fecha_contabilizacion);
    const validaFechaPresentacion = this.modelNominaImp.fecha_presentacion != "" && this.validator.filtroFecha(this.modelNominaImp.fecha_presentacion);
    const validaFechaVencimiento = this.modelNominaImp.fecha_vencimiento != "" && this.validator.filtroFecha(this.modelNominaImp.fecha_vencimiento);

    const entFed = this.fed_catalogo_activo.find((row: any) => row.fed_est_mun_token === this.modelNominaImp.estado);
    const validaEstado = this.modelNominaImp.estado != '' && typeof entFed !== 'undefined';

    const validaEjercicio = this.modelNominaImp.ejercicio != '';// && this.modelNominaImp.periodo != '';
    const vNominaPeriodoInicio = this.modelNominaImp.periodo_inicio != '' && this.validator.filtroFecha(this.modelNominaImp.periodo_inicio);
    const vNominaPeriodoFin = this.modelNominaImp.periodo_fin != '' && this.validator.filtroFecha(this.modelNominaImp.periodo_fin);

    const tdec = this.tipos_declaracion.find((row: any) => row.valor === this.modelNominaImp.tipo_declaracion);
    const validaTipoDeclaracion = this.modelNominaImp.tipo_declaracion != '' && typeof tdec !== 'undefined';

    //total_remuneraciones_erogadas
    const validaTotalRemuneracionesErogadas = this.modelNominaImp.total_remuneraciones_erogadas > 0 && this.validator.filtroNum(this.modelNominaImp.total_remuneraciones_erogadas);

    //porcent_sobre_total_remuneraciones_erogadas
    const validaPorcentSobreTotalRemuneracionesErogadas = this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas > 0 && this.validator.filtroNum(this.modelNominaImp.porcent_sobre_total_remuneraciones_erogadas);

    //complementarias_impuesto_a_cargo
    const complemenImpuestoACargo = this.modelNominaImp.complementarias_impuesto_a_cargo > 0 && this.validator.filtroNum(this.modelNominaImp.complementarias_impuesto_a_cargo);
    const validaComplementariasImpuestoACargo = this.modelNominaImp.tipo_declaracion == 'normal' || (this.modelNominaImp.tipo_declaracion == 'comple' && complemenImpuestoACargo);

    //impuesto_actualizado
    const validaImpuestoActualizado = this.modelNominaImp.impuesto_actualizado >= 0 && this.validator.filtroNum(this.modelNominaImp.impuesto_actualizado);

    //impuesto_descuento
    const validaImpuestoDescuento = this.modelNominaImp.impuesto_descuento != '' && (this.modelNominaImp.impuesto_descuento == '0.00' || this.modelNominaImp.impuesto_descuento != '0.00') && this.validator.filtroNum(this.modelNominaImp.impuesto_descuento);

    //impuesto_total_a_pagar
    const validaImpuestoTotalAPagar = this.modelNominaImp.impuesto_total_a_pagar > 0 && this.validator.filtroNum(this.modelNominaImp.impuesto_total_a_pagar);

    const validacion_observacion = this.modelNominaImp.observaciones != "" && this.validator.strFilter(this.modelNominaImp.observaciones) && this.modelNominaImp.observaciones.length >= 4;
    const validacion_documents = this.ImpNominaAnexosNames.length > 0;

    return validaFechaContabilizacion && validaFechaVencimiento && validaFechaPresentacion && validaEstado && validaEjercicio && vNominaPeriodoInicio && vNominaPeriodoFin && validaTipoDeclaracion &&
      validaTotalRemuneracionesErogadas && validaPorcentSobreTotalRemuneracionesErogadas && validaComplementariasImpuestoACargo && validaImpuestoActualizado && validaImpuestoDescuento &&
      validaImpuestoTotalAPagar && validacion_observacion && validacion_documents;
  }

  isnReporteRegistro(form: NgForm): void {
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
        this.imp_sobre_nomina_form = false;
        this.nominaServ.registra_impuesto_sobre_nomina(this.modelNominaImp, this.docsImpNominaAnexos).subscribe(
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
              this.relInterna.mensajeNominaImpuestoRegistro("nomina_impuestos_registrada");
              form.reset();
              form.resetForm();
              this.imp_sobre_nomina_form = true;
              this.modelNominaImp = new nominaImpuestoModelo('', '', '', '', '', '', '', '', '', '', '', 2, 0, 0, 0, 0, 0, 0, '0.00', 0, 0, 0, 0, 0, 0, 0, 0, '');

              this.periodo = null;

              this.ImpNominaAnexosNames = [];
              this.docsImpNominaAnexos = [];
              this.filesImpNomina = [];
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
