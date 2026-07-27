import { Component, OnInit } from '@angular/core';
import { DireccionesService } from '../../../../../../../servicios/ssic/direcciones.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import { ComunicacionInternaService } from '../../../../../../../servicios/comunicacion-interna.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';
import { NominaService } from '../../../../../../../servicios/ssic/nomina-service';
import { CentrosTrabajoService } from '../../../../../../../servicios/ssic/centros-trabajo-service';
import { aportacionesIMSSModelo } from '../../../../../../../modelos/aportacionesIMSSModelo';
import { ImssService } from '../../../../../../../servicios/ssic/imss-service';

interface Row {
  type: 'section' | 'label' | 'label_aport' | 'input' | 'subtotal';
  label: string;
  patronal?: null | number;
  obrera?: null | number;
  total?: null | number;
}

@Component({
  selector: 'vhum_aportaciones_de_seguridad_social_registro',
  standalone: false,
  
  templateUrl: './aport_seg_social_registro.component.html',
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
    './aport_seg_social_registro.component.css']
})
export class AportacionesSeguridadSocialRegistroComponent implements OnInit{
  public modelIMSSAport: aportacionesIMSSModelo;
  public aportaciones_ssocial_form:boolean = true;
  catalogo_registros_patronales:any = [];
  nomina_registro_patronal:any = null;
  periodo_pago_seguros_imss:any = null;
  bimestre_pago_rcv_infonavit:any = null;
  desglose_total_cuotas: Row[] = [];
  totales = { patronal: 0, obrera: 0, total: 0 };
  public AporSSOCIALAnexosNames:any = [];
  public docsAporSSOCIALAnexos:any [] = [];
  public filesAporSSOCIAL: NgxFileDropEntry[] = [];

  constructor(
    private dirServ:DireccionesService,
    private translate:TranslateService,
    public validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private nominaServ:NominaService,
    private imssServ:ImssService,
    private ctraserv:CentrosTrabajoService,
    private fb: FormBuilder
  ) { 
    this.modelIMSSAport = new aportacionesIMSSModelo('','','','','','','','','','','','','','0','0','0','0','');
  }

  ngOnInit(): void {
    this.descarga_centros_de_trabajo();
    this.inicializa_total_cuotas();
    this.recalcularTodo();
  }

  inicializa_total_cuotas(){
    // Inicializa las filas en el mismo orden que tu HTML original
    // si quieres, precarga algunos valores ejemplo:
    // this.rows[1].patronal = 1000; this.rows[1].obrera = 100; this.rows[1].total = 1100;
    this.desglose_total_cuotas = [
      { type: 'section', label: 'ENFERMEDADES Y MATERNIDAD' },
      { type: 'input', label: '- CUOTA FIJA', patronal: null, obrera: null, total: null },
      { type: 'input', label: '- EXCEDENTE -CUOTA', patronal: null, obrera: null, total: null },
      { type: 'input', label: '- PRESTACIONES EN DINERO', patronal: null, obrera: null, total: null },
      { type: 'input', label: '- GASTOS MÉDICOS PENSIONADOS ART. 25', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'RIESGOS DE TRABAJO', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'INVALIDEZ Y VIDA', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'GUARDERÍAS Y PRESTACIONES SOCIALES', patronal: null, obrera: null, total: null },
      { type: 'subtotal', label: 'SUBTOTAL', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'ACTUALIZACIÓN', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'RECARGOS', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'MULTA IMSS', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'ACTUALIZACIÓN MULTA IMSS', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'MULTA RCV', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'ACTUALIZACIÓN MULTA RCV', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'OTROS INGRESOS', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'GASTOS DE EJECUCIÓN', patronal: null, obrera: null, total: null },
      { type: 'subtotal', label: 'SUBTOTAL SEGUROS IMSS', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'RETIRO', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'CESANTÍA EN EDAD AVANZADA Y VEJEZ', patronal: null, obrera: null, total: null },
      { type: 'subtotal', label: 'SUBTOTAL', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'ACTUALIZACIÓN', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'RECARGOS', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'APORTACIONES VOLUNTARIAS', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'APORTACIONES COMPLEMENTARIAS', patronal: null, obrera: null, total: null },
      { type: 'subtotal', label: 'SUBTOTAL RCV', patronal: null, obrera: null, total: null },
      // Bloque Aportaciones / Amortización
      { type: 'label_aport', label: '' }, // fila con las cabeceras AP PATRONAL / AMORTIZACION
      { type: 'input', label: 'APORTACIÓN PATRONAL SIN CRÉDITO', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'APORTACIÓN PATRONAL CON CRÉDITO', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'AMORTIZACIÓN', patronal: null, obrera: null, total: null },
      { type: 'subtotal', label: 'SUBTOTAL', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'ACTUALIZACIÓN DE APORTACIONES Y AMORTIZACIONES', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'RECARGOS DE APORTACIONES Y AMORTIZACIONES', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'MULTA', patronal: null, obrera: null, total: null },
      { type: 'input', label: 'DONATIVO FUNDEMEX', patronal: null, obrera: null, total: null },
      { type: 'subtotal', label: 'SUBTOTAL VIVIENDA Y ACV', patronal: null, obrera: null, total: null }
    ];
  }

  descarga_centros_de_trabajo() {
    this.ctraserv.catalogoGeneralCentrosTrabajo().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.catalogo_registros_patronales = response.cent_trab;
          console.log(this.catalogo_registros_patronales);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  changeFechaContabilizacion(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelIMSSAport.fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeFechaPresentacion(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelIMSSAport.fecha_presentacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeNominaRPIMSS(registro_patronal_imss:any){
    var new_nomina_rpimss = document.getElementById("new_nomina_rpimss");
    let rpimss = this.catalogo_registros_patronales.find((row:any) => registro_patronal_imss != '' && row.clave_registro_patronal_imss === registro_patronal_imss);
    const validacion = registro_patronal_imss != "" && this.validator.filtroAlfaNumerico(registro_patronal_imss) && typeof rpimss !== 'undefined';
    this.modelIMSSAport.registro_patronal = validacion ? rpimss.clave_registro_patronal_imss : '';
    validacion ? this.validator.correctoSelectBrowser(new_nomina_rpimss) : this.validator.errorSelectBrowser(new_nomina_rpimss);
  }

  selectPeriodoPagoSegurosIMSS(){
    var periodo_imss = document.getElementById("periodo_imss");
    console.log(this.periodo_pago_seguros_imss);
    const anio = this.periodo_pago_seguros_imss.getFullYear();
    const mes = this.periodo_pago_seguros_imss.getMonth() + 1;
    const validacion = anio != '' && this.validator.filtroNum(anio) && mes != '' && this.validator.filtroNum(mes);
    this.modelIMSSAport.periodo_pago_seguros_imss_anio = validacion ? anio : '';
    this.modelIMSSAport.periodo_pago_seguros_imss_mes = validacion ? mes : '';
    validacion ? this.validator.correctoInputRow(periodo_imss) : this.validator.errorInputRow(periodo_imss);
    //console.log(this.modelIMSSAport);
  }

  selectBimestrePagoRcv(){
    var bimestre_rcv = document.getElementById("bimestre_rcv");
    if (this.bimestre_pago_rcv_infonavit && this.bimestre_pago_rcv_infonavit.length === 2) {
      const fechaInicio = this.bimestre_pago_rcv_infonavit[0];
      const fechaFin = this.bimestre_pago_rcv_infonavit[1];

      const validacionInicio = fechaInicio && this.validator.filtroFecha(fechaInicio.toISOString().split('T')[0]);
      const validacionFin = fechaFin && this.validator.filtroFecha(fechaFin.toISOString().split('T')[0]);

      if (validacionInicio && validacionFin) {
        const inicioDate = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
        const finDate = new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
        // Convertimos las fechas a formato yyyy-mm-dd
        const inicio = inicioDate.toISOString().split('T')[0];
        const fin = finDate.toISOString().split('T')[0];
  
        // Guardamos en tus variables de nómina
        this.modelIMSSAport.pago_rcv_infonavit_inicio = inicio;
        this.modelIMSSAport.pago_rcv_infonavit_fin = fin;
  
        // Indicas al validador visual que está correcto
        this.validator.correctoInputRow(bimestre_rcv);
      } else {
        // Si algo está mal, limpias y marcas error
        this.modelIMSSAport.pago_rcv_infonavit_inicio = '';
        this.modelIMSSAport.pago_rcv_infonavit_fin = '';
        this.validator.errorInputRow(bimestre_rcv);
      }
    } else {
      // Si sólo hay una fecha o no hay nada
      this.modelIMSSAport.pago_rcv_infonavit_inicio = '';
      this.modelIMSSAport.pago_rcv_infonavit_fin = '';
      this.validator.errorInputRow(bimestre_rcv);
    }
    //console.log(this.modelIMSSAport);
  }

  keyupFolioSUA(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelIMSSAport.folio_sua = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupClaveRecepcionArchivoPago(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelIMSSAport.clave_recepcion_archivo_pago = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changePropuestaFechaLimitePago(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelIMSSAport.propuesta_fecha_limite_pago = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaReferenciaDEPagoLineaSIPARE(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modelIMSSAport.linea_captura_sipare = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaSMGDF(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelIMSSAport.propuesta_s_m_g_d_f = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changePropuestaFechaSalarioMinimoPago(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelIMSSAport.propuesta_fecha_salario_minimo_pago = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaValorUMA(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelIMSSAport.propuesta_valor_uma = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaNumCotizantes(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelIMSSAport.propuesta_num_de_cotizantes = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaNumDiasCotizar(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelIMSSAport.propuesta_num_dias_a_cotizar = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPropuestaNumAcreditados(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modelIMSSAport.propuesta_num_de_acreditados = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  onCantidadChange(rowIndex: number, field: 'patronal' | 'obrera' | 'total', event:any) {
    const inputDom = event.originalEvent.target;
    const value = inputDom.value;
    const cleanValue = value.replace(/,/g, '');
    
    if (cleanValue === '') {
      this.desglose_total_cuotas[rowIndex][field] = 0;
  
      // Quitar estilo de error porque borrar no es un error
      this.validator.correctoInputRow(inputDom);
  
      // Recalcular total patronal + obrera si aplica
      const p = Number(this.desglose_total_cuotas[rowIndex].patronal || 0);
      const o = Number(this.desglose_total_cuotas[rowIndex].obrera || 0);
      this.desglose_total_cuotas[rowIndex].total = this.roundToCents(p + o);
  
      this.recalcularTodo();
      return;
    }

    const validacion = cleanValue !== '' && this.validator.filtroNumPrime(Number(cleanValue));
    validacion ? this.validator.correctoInputRow(inputDom) : this.validator.errorInputRow(inputDom);
    if (validacion) {
      const v = this.parseNumber(cleanValue);
      this.desglose_total_cuotas[rowIndex][field] = v;
      if (field === 'patronal' || field === 'obrera') {
        // Si tienes la regla que total = patronal + obrera, la aplicamos:
        const p = Number(this.desglose_total_cuotas[rowIndex].patronal || 0);
        const o = Number(this.desglose_total_cuotas[rowIndex].obrera || 0);
        this.desglose_total_cuotas[rowIndex].total = this.roundToCents(p + o);
      }
    }
    console.log(this.desglose_total_cuotas);
    this.recalcularTodo();
  }

  // recalcula subtotales y totales globales
  recalcularTodo() {
    // lógica de ejemplo: recalcular subtotales para cada fila tipo 'subtotal' sumando las filas input entre subtotales.
    let globalP = 0, globalO = 0, globalT = 0;
    let localP = 0, localO = 0, localT = 0;

    for (let i = 0; i < this.desglose_total_cuotas.length; i++) {
      const r = this.desglose_total_cuotas[i];

      if (r.type === 'input') {
        localP += Number(r.patronal || 0);
        localO += Number(r.obrera || 0);
        localT += Number(r.total || 0);
      } else if (r.type === 'subtotal') {
        // asigna el subtotal calculado
        r.patronal = this.roundToCents(localP);
        r.obrera = this.roundToCents(localO);
        r.total = this.roundToCents(localT);

        // acumula al global
        globalP += localP;
        globalO += localO;
        globalT += localT;

        // reset local
        localP = 0; localO = 0; localT = 0;
      }
      // si es sección o label, nada; seguimos acumulando inputs hasta encontrar subtotal
    }

    // si hay inputs al final sin subtotal, los agregamos igual
    globalP += localP;
    globalO += localO;
    globalT += localT;

    this.totales.patronal = this.roundToCents(globalP);
    this.totales.obrera = this.roundToCents(globalO);
    this.totales.total = this.roundToCents(globalT);
  }

  // util: formatea número (usa Intl)
  formatNumber(v: number | undefined): string {
    const n = Number(v || 0);
    return new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }

  // util: parsea valor de p-inputNumber (puede venir como number)
  parseNumber(v: any): number {
    if (v === null || v === undefined || v === '') return 0;
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  roundToCents(n: number): number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  keyupObservacionApSegSocial(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.modelIMSSAport.observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public async droppedApSegSocial(files: NgxFileDropEntry[]) {
    this.filesAporSSOCIAL = files;
    this.AporSSOCIALAnexosNames = [];
    this.docsAporSSOCIALAnexos = [];
    const extensionesPermitidas = ['pdf', 'xml', 'jpg', 'jpeg', 'png', 'sua'];
    const tiposPermitidos = ['application/pdf','text/xml','image/jpeg','image/jpg','image/png'];
    
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i];
  
      if (!droppedFile.fileEntry.isFile) continue;
  
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      const file: File = await this.obtenerArchivo(fileEntry);
  
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const mime = file.type;
  
      // Validación principal
      const esValido =
        file.size <= 2000000 &&
        (tiposPermitidos.includes(mime) || extensionesPermitidas.includes(extension));
  
      if (!esValido) {
        let mensajeError = '';
  
        if (file.size > 2000000)
          mensajeError = `El archivo ${file.name} excede el tamaño permitido (2MB)`;
  
        if (!extensionesPermitidas.includes(extension))
          mensajeError = `El archivo ${file.name} debe ser pdf, xml, png, jpg o sua`;
  
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: mensajeError,
          showConfirmButton: false,
          timer: 3000
        });
  
        // Eliminar archivo no válido
        this.filesAporSSOCIAL.splice(i, 1);
        continue;
      }
  
      // Evita duplicados
      if (this.docsAporSSOCIALAnexos.some(f => f.name === file.name)) continue;
  
      // Guardar archivo
      this.AporSSOCIALAnexosNames.push({
        typoElement: mime,
        nameFile: file.name
      });
  
      this.docsAporSSOCIALAnexos.push(file);
    }

    console.log(this.docsAporSSOCIALAnexos.length);
  }
  
  private obtenerArchivo(entry: FileSystemFileEntry): Promise<File> {
    return new Promise(resolve => entry.file(resolve));
  }

  public fileOverApSegSocial(event:any){
    console.log(event);
  }

  public fileLeaveApSegSocial(event:any){
    console.log(event);
  }

  deleteAnexosApSegSocial(posicion:any){
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
          this.filesAporSSOCIAL.splice(posicion,1);
          this.docsAporSSOCIALAnexos.splice(posicion,1);
          this.AporSSOCIALAnexosNames.splice(posicion,1);
          console.log(this.docsAporSSOCIALAnexos.length);
        }
      }
    );
  }

  get validate_reporte_associal_registro():Boolean {
    const validaFechaContabilizacion = this.modelIMSSAport.fecha_contabilizacion != "" && this.validator.filtroFecha(this.modelIMSSAport.fecha_contabilizacion);
    const validaFechaPresentacion = this.modelIMSSAport.fecha_presentacion != "" && this.validator.filtroFecha(this.modelIMSSAport.fecha_presentacion);
    const validaRegistroPatronal = this.modelIMSSAport.registro_patronal != "" && this.validator.filtroAlfaNumerico(this.modelIMSSAport.registro_patronal);

    //const validaPeriodoPagoSegIMSSAnio = this.modelIMSSAport.periodo_pago_seguros_imss_anio != '' && this.validator.filtroNum(this.modelIMSSAport.periodo_pago_seguros_imss_anio);
    //const validaPeriodoPagoSegIMSSMes = this.modelIMSSAport.periodo_pago_seguros_imss_mes != '' && this.validator.filtroNum(this.modelIMSSAport.periodo_pago_seguros_imss_mes);
    //const validaPeriodoPagoSegIMSS = validaPeriodoPagoSegIMSSAnio && validaPeriodoPagoSegIMSSMes;

    //const validacionInicio = this.modelIMSSAport.pago_rcv_infonavit_inicio && this.validator.filtroFecha(this.modelIMSSAport.pago_rcv_infonavit_inicio);
    //const validacionFin = this.modelIMSSAport.pago_rcv_infonavit_fin && this.validator.filtroFecha(this.modelIMSSAport.pago_rcv_infonavit_fin);
    //const validaPagoRCVInfonavit = validacionInicio && validacionFin;
    
    const validaFolioSUA = this.modelIMSSAport.folio_sua != '' && this.validator.filtroAlfaNumerico(this.modelIMSSAport.folio_sua);
    const validaClaveRecepcionArchivoPago = this.modelIMSSAport.clave_recepcion_archivo_pago != '' && this.validator.filtroAlfaNumerico(this.modelIMSSAport.clave_recepcion_archivo_pago);
    const validaPropuestaFechaLimitePago = this.modelIMSSAport.propuesta_fecha_limite_pago != '' && this.validator.filtroFecha(this.modelIMSSAport.propuesta_fecha_limite_pago);
    const validaPropuestaRefDEPagoSIPARE = this.modelIMSSAport.linea_captura_sipare != '' && this.validator.filtroAlfaNumerico(this.modelIMSSAport.linea_captura_sipare);
    const validaPropuestaSMGDF = this.modelIMSSAport.propuesta_s_m_g_d_f != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_s_m_g_d_f);
    const validaPropuestaFechaSalarioMinimoPago = this.modelIMSSAport.propuesta_fecha_salario_minimo_pago != '' && this.validator.filtroFecha(this.modelIMSSAport.propuesta_fecha_salario_minimo_pago);
    
    const validaPropuestaValorUMA = this.modelIMSSAport.propuesta_valor_uma != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_valor_uma);
    const validaPropuestaNumCotizantes = this.modelIMSSAport.propuesta_num_de_cotizantes != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_num_de_cotizantes);
    const validaPropuestaNumDiasCotizar = this.modelIMSSAport.propuesta_num_dias_a_cotizar != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_num_dias_a_cotizar);
    const validaPropuestaNumAcreditados = this.modelIMSSAport.propuesta_num_de_acreditados != '' && this.validator.filtroNum(this.modelIMSSAport.propuesta_num_de_acreditados);

    const validaTotales = this.totales.patronal > 0 && this.totales.obrera > 0 && this.totales.total > 0;

    const validacion_observacion = this.modelIMSSAport.observaciones != "" && this.validator.strFilter(this.modelIMSSAport.observaciones) && this.modelIMSSAport.observaciones.length >= 4;
    const validacion_documents = this.AporSSOCIALAnexosNames.length > 0; 

    return validaFechaContabilizacion && validaFechaPresentacion && validaRegistroPatronal && validaFolioSUA && validaClaveRecepcionArchivoPago && validaPropuestaFechaLimitePago && validaPropuestaRefDEPagoSIPARE && 
      validaPropuestaSMGDF && validaPropuestaFechaSalarioMinimoPago && validaPropuestaValorUMA && validaPropuestaNumCotizantes && validaPropuestaNumDiasCotizar && 
      validaPropuestaNumAcreditados && validaTotales && validacion_observacion && validacion_documents;
  }

  aportacionSegSocialReporteRegistro(form:NgForm):void{
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
        this.aportaciones_ssocial_form = false;
        this.imssServ.registra_aportacion_seg_social(this.modelIMSSAport,this.desglose_total_cuotas,this.docsAporSSOCIALAnexos).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              this.relInterna.mensajeVHAportaSEGSocialIMSS("aportacion_imss_registrada");
              form.reset();
              form.resetForm();
              this.aportaciones_ssocial_form = true;
              this.modelIMSSAport = new aportacionesIMSSModelo('','','','','','','','','','','','','','0','0','0','0','');
              this.inicializa_total_cuotas();
              this.totales = { patronal: 0, obrera: 0, total: 0 };
              
              this.nomina_registro_patronal = null;
              this.periodo_pago_seguros_imss = null;
              this.bimestre_pago_rcv_infonavit = null;
            
              this.AporSSOCIALAnexosNames = [];
              this.docsAporSSOCIALAnexos = [];
              this.filesAporSSOCIAL = [];
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
            //console.log(error);
          }
        );
      }
    })
  }
}
