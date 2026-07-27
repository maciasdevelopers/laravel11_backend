import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { nominaModelo } from '../../../../../../modelos/nominas/nominaModelo';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RegimenFiscalService } from '../../../../../../servicios/regimen-fiscal.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import Swal from 'sweetalert2';
import { NominaService } from '../../../../../../servicios/ssic/nomina-service';
import { response } from 'express';
import { CentrosTrabajoService } from '../../../../../../servicios/ssic/centros-trabajo-service';
import { nominaTotalesModelo } from '../../../../../../modelos/nominas/nominaTotalesModelo';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import numeral from 'numeral';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import * as ExcelJS from 'exceljs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'vhumano_reportes_nomina_nuevo_reporte',
  standalone: false,
  templateUrl: './nuevo-reporte-nomina.html',
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/breadcrumb.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/canvas.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/cards.css',
    '../../../vhumano.css',
    './nuevo-reporte-nomina.css'
  ]
})
export class NuevoReporteNomina implements OnInit{
  public borrador_nomina:boolean = false; 
  nomina_arreglo_vacio:any = [];
  catalogo_registros_patronales:any = [];
  catalogo_monedas_api:any = [];
  nomina_busqueda_filtro:any = [];
  nomina_periodos:any = [];
  list_nomina_empleados:any = [];
  public modelNomina: nominaModelo;
  public nomina_totales: nominaTotalesModelo;
  public popUpAccept:string = "";
  public popUpReject:string = "";
  
  public numero_de_nomina:number = 0;
  @ViewChild('newNominaNumero') newNominaNumero!: ElementRef;
  public nomina_fecha_contabilizacion:string = "";
  @ViewChild('newNominaFechaCont') newNominaFechaCont!: ElementRef;
  public nomina_observacion:string = "";
  @ViewChild('newNominaObservaciones') newNominaObservaciones!: ElementRef;
  nomina_registro_patronal = null;
  nomina_empleado = null;
  nomina_periodicidad = null;
  rangoPeriodoNomina: Date[] | undefined;
  nomina_moneda = null;
  lista_nomina_reportada:any = [];

  public viewNewNominaFormulario: boolean = true;
  constructor(
    private translate:TranslateService,
    private ctraserv:CentrosTrabajoService,
    private validator:ValidatorServService,
    private trab_serv:EmpleadosService,
    private nominaServ:NominaService,
    private dirServ:DireccionesService,
    private primeAlerts: MessageService,
    private _regimen:RegimenFiscalService,
    private relInterna:ComunicacionInternaService,
    private _monedasServ: MonedasService,
    private servXlsx:DescargaExcel,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef, 
    private indexEd: NgxIndexedDBService
  ){
    this.modelNomina = new nominaModelo('','','','---','','','---',2,'','','0.00','0.00',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'');//,0.00
    this.nomina_totales = new nominaTotalesModelo('0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00');
    //'0.00',
  }

  ngOnInit(): void {
    this.descarga_centros_de_trabajo();
    this.monedasCatalogoApi();
    
    this.nomina_arreglo_vacio = [{"id":1}];
    this.nomina_busqueda_filtro = [
      'nomina_clave',
      'nomina_registro_patronal',
      'nomina_empleado_nombre',
      'nomina_periodicidad',
      'nomina_periodo_inicio',
      'nomina_moneda',
      'nomina_empleado_cbankBanco',
      'nomina_empleado_nss',
      'nomina_empleado_rfc',
      'nomina_empleado_curp',
      'nomina_empleado_fecha_alta',
      'nomina_empleado_departamento',
      'nomina_empleado_puesto',
      'nomina_empleado_tipo_salario',
      'nomina_salario_diario',
      'nomina_salario_integrado',
      'nomina_dias_trabajados',
      'nomina_faltas',
      'nomina_sueldo',
      'nomina_horas_extras_dobles',
      'nomina_aguinaldo',
      'nomina_horas_extras_triples',
      'nomina_vacaciones',
      'nomina_prima_vacacional',
      'nomina_reparto_de_utilidades',
      'nomina_despensa',
      'nomina_premios_de_asistencia',
      'nomina_premios_de_puntualidad',
      'nomina_prima_dominical',
      'nomina_bno_extra_x_comision_otro_edo',
      'nomina_indemnizacion',
      'nomina_prima_de_antiguedad',
      'nomina_otras_percepciones',
      'nomina_otros_pagos',
      'nomina_total_percepciones',
      'nomina_isr_ajustado_por_subsidio',
      'nomina_total_isr',
      'nomina_total_imss',
      'nomina_credito_fonacot',
      'nomina_credito_infonavit',
      'nomina_subsidio_empleo',
      //'nomina_subsidio_empleo_aplicado',
      'nomina_otras_deducciones',
      'nomina_total_deducciones',
      'nomina_total_efectivo',
      'nomina_total_en_especie',
      'nomina_neto_pagado',
      'nomina_horas_por_dia',
      'nomina_salario_por_hora',
      'nomina_dias_jornada',
    ];
    this.nomina_periodos = [
      {periodicidad:'semanal'},
      {periodicidad:'catorcenal'},
      {periodicidad:'quincenal'},
      {periodicidad:'mensual'},
      {periodicidad:'bimestral'},
      {periodicidad:'trimestral'},
      {periodicidad:'cuatrimestral'},
      {periodicidad:'semestral'},
      {periodicidad:'anual'}
    ];
    this.cargarBorrador();
    this.calculaNominaTotales();
  }
  
  borrarBorrador() {
    this.indexEd.clear('borrador_nomina').subscribe(() => {
      console.log("Store `borrador_nomina` limpiada por completo");
    });
  }
  
  get existeBorrador():Boolean {
    this.indexEd.getByKey('borrador_nomina', 1).subscribe((data: any) => {
      this.borrador_nomina = data ? true : false;
    });
    //console.log(this.borrador_nomina);
    return this.borrador_nomina;
  }

  cargarBorrador() {
    this.indexEd.getByKey('borrador_nomina', 1).subscribe((data: any) => {
      if (data) {
        console.log(data);
        const cont = data.contenido; // ← ya es un objeto
        console.log(cont.numero_nomina);
        this.numero_de_nomina = cont.numero_nomina;
        this.nomina_fecha_contabilizacion = cont.fecha_contabilizacion;
        this.nomina_observacion = cont.observacion;
        this.modelNomina.registro_patronal = cont.registro_patronal;
        this.lista_nomina_reportada = cont.nomina_reportada;
        console.log('Borrador cargado:', this.lista_nomina_reportada);
        this.calculaNominaTotales();
        setTimeout(() => {
          this.newNominaNumero.nativeElement.value = cont.numero_nomina;
          this.newNominaNumero.nativeElement.classList.add('correcto');
          
          this.newNominaFechaCont.nativeElement.value = cont.fecha_contabilizacion;
          this.newNominaFechaCont.nativeElement.classList.add('correcto');
    
          this.newNominaObservaciones.nativeElement.value = cont.observacion;
          this.newNominaObservaciones.nativeElement.classList.add('correcto');
    
          //newNominaRPImss
          this.modelNomina.registro_patronal = cont.registro_patronal;
          this.nomina_registro_patronal = cont.registro_patronal;
        });
        this.cd.detectChanges();
      } else {
        console.log('No existe borrador guardado');
      }
    });
  }

  monedasCatalogoApi(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if(response.status == 'success'){
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
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

  keyupNominaNumero(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.numero_de_nomina = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  select_fecha_contabilizacion(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.nomina_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.nomina_fecha_contabilizacion);
  }
  
  formateoFechaExcel(valor: any){
    if (!valor) return '';
    let fecha: Date;

    if (valor instanceof Date) {
      fecha = valor;
    }
    else if (typeof valor === 'number') {
      fecha = new Date((valor - 25569) * 86400 * 1000);
    }
    else {
      return '';
    }

    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async cargarNominaExcel(event:any,objeto:any) {
    const file = event.target.files[0];
    if (!file) return;
  
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);
    console.log(workbook.worksheets.map(s => s.name));
    //const worksheet:any = workbook.getWorksheet('PlantillaNomina'); // tu hoja
    const worksheet:any = workbook.worksheets[0];
    const START_ROW = 2;

    //for (let i = 1; i <= 9; i++) {
    //  const row = worksheet.getRow(i);
    //  const values = row.values;
    //
    //  // Encontrar el primer valor útil (ignorando el índice 0)
    //  const valor = values.find((v:any, idx:any) => idx > 0 && v && v.toString().trim() !== "");
    //
    //  console.log("Fila", i, ":", valor);
    //  
    //  switch (i) {
    //    case 4:
    //      //this.numero_de_nomina = valor;
    //      //$("#new_nomina_numero").val(valor);
    //      break;
    //  
    //    default:
    //      break;
    //  }
    //}

    worksheet.eachRow((row:any, rowNumber:any) => {
      if (rowNumber === 1) return; // saltar encabezados
      if (rowNumber < START_ROW) return; // saltar encabezados y basura previa
      const data = row.values; // row.values[1] = col 1
      if (!data[1] || data[1] === "") return;
      console.log(data);
      this.llena_tabla_desde_excel(data,objeto);
    });
  }

  llena_tabla_desde_excel(data:any,objeto:any){
    console.log(data[1]+" CLAVE");	
    console.log(data[2]+" REGISTRO PATRONAL DEL IMSS");
    console.log(data[3]+" NOMBRE DEL TRABAJADOR");
    console.log(data[4]+" PERIODICIDAD");
    console.log(data[5]+" PERIODO DE PAGO (INICIO)");
    console.log(data[6]+" PERIODO DE PAGO (FIN)");
    console.log(data[7]+" MONEDA");
    console.log(data[8]+" NSS");
    console.log(data[9]+" RFC");
    console.log(data[10]+" CURP");
    console.log(data[11]+" FECHA DE ALTA");
    console.log(data[12]+" DEPARTAMENTO");
    console.log(data[13]+" PUESTO");
    console.log(data[14]+" TIPO DE SALARIO");
    console.log(data[15]+" SALARIO DIARIO");
    console.log(data[16]+" SDI");
    console.log(data[17]+" DÍAS TRABAJADOS");
    console.log(data[18]+" FALTAS");
    console.log(data[19]+" SUELDO");
    console.log(data[20]+" HORAS EXTRAS DOBLES");
    console.log(data[21]+" AGUINALDO");
    console.log(data[22]+" HORAS EXTRAS TRIPLES");
    console.log(data[23]+" VACACIONES");
    console.log(data[24]+" PRIMA VACACIONAL");
    console.log(data[25]+" REPARTO DE UTILIDADES");
    console.log(data[26]+" DESPENSA*");
    console.log(data[27]+" PREMIOS DE ASISTENCIA");
    console.log(data[28]+" PREMIOS DE PUNTUALIDAD");
    console.log(data[29]+" PRIMA DOMINICAL");
    console.log(data[30]+" BNO EXTRA X COMISION OTRO EDO");
    console.log(data[31]+" INDEMNIZACION");
    console.log(data[32]+" PRIMA DE ANTIGUEDAD");
    console.log(data[33]+" ISR AJUSTADO POR SUBSIDIO");
    console.log(data[34]+" ISR");
    console.log(data[35]+" IMSS");
    console.log(data[36]+" CREDITO FONACOT");
    console.log(data[37]+" CREDITO INFONAVIT");
    console.log(data[38]+" SUBSIDIO PARA EL EMPLEO");
    console.log(data[39]+" SUBS. PARA EL EMPLEO APLICADO");
    console.log(data[40]+" OTRAS PERCEPCIONES");
    console.log(data[41]+" TOTAL PERCEPCIONES");
    console.log(data[42]+" OTRAS DEDUCCIONES");
    console.log(data[43]+" TOTAL DEDUCCIONES");
    console.log(data[44]+" TOTAL EFECTIVO");
    console.log(data[45]+" TOTAL EN ESPECIE");
    console.log(data[46]+" NETO PAGADO");
    console.log(data[47]+" SALARIO POR HORA");
    console.log(data[48]+" HORAS POR DIA");
    console.log(data[49]+" JORNADA");


    const vNominaRPImss = data[2] != '' && this.validator.filtroAlfaNumerico(data[2]);

    let nper = this.nomina_periodos.find((row:any) => row.periodicidad === data[4]);
    const vNominaPeriodicidad = data[4] != '' && this.validator.filtroAlfaNumerico(data[4]) && typeof nper !== 'undefined';

    const vNominaPeriodoInicio = this.formateoFechaExcel(data[5]) != '' && this.validator.filtroFecha(this.formateoFechaExcel(data[5]));
    const vNominaPeriodoFin = this.formateoFechaExcel(data[6]) != '' && this.validator.filtroFecha(this.formateoFechaExcel(data[6]));

    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === data[7]);
    //const vNominaMoneda = data[6] != '' && this.validator.filtroAlfaNumerico(data[6]) && typeof mnd !== 'undefined';

    const vNominaDiasTrabajados = data[17] > 0 && this.validator.filtroNum(data[17]);
    const vNominaSueldo = data[19] > 0 && this.validator.filtroNum(data[19]);
    
    const otras_percepciones = Number(data[40]);
    const vNominaOtrasPercepciones = otras_percepciones == 0 || (otras_percepciones > 0 && this.validator.filtroNum(otras_percepciones));
    const total_percepciones = Number(data[41]);
    const vNominaTotalPercepciones = total_percepciones == 0 || (total_percepciones > 0 && this.validator.filtroNum(total_percepciones));

    const vNominaNetoPagado = data[46] > 0 && this.validator.filtroNum(data[46]);
    const vNominaTotalEnEspecie = data[45] == 0 || (data[45] > 0 && this.validator.filtroNum(data[45]));
    const vNominaSalarioXHora = data[47] > 0 && this.validator.filtroNum(data[47]);
    const vNominaTotalImss = data[35] > 0 && this.validator.filtroNum(data[35]);
    const vNominaHorasXDia = data[48] > 0 && this.validator.filtroNum(data[48]);
    const vNominaTotalIsr = data[34] > 0 && this.validator.filtroNum(data[34]);
    
    const subsidio_empleo = Number(data[38]);
    const vNominaSubsidioEmpleo = subsidio_empleo == 0 || (subsidio_empleo > 0 || this.validator.filtroNum(subsidio_empleo));

    const otras_deducciones = Number(data[42]);
    const vNominaOtrasDeducciones = otras_deducciones == 0 || (otras_deducciones > 0 && this.validator.filtroNum(otras_deducciones));
    const total_deducciones = Number(data[43]);
    const vNominaTotalDeducciones = total_deducciones === 0 || (total_deducciones > 0 && this.validator.filtroNum(total_deducciones));

    const vNominaTotalEfectivo = data[44] > 0 && this.validator.filtroNum(data[44]);
    const vNominaSalarioDiario = data[15] > 0 && this.validator.filtroNum(data[15]);
    const vNominaSalarioIntegrado = data[16] > 0 && this.validator.filtroNum(data[16]);
    const vNominaDiasJornada = data[49] != '' && this.validator.filtroAlfaNumerico(data[49]);
    const vNominaFaltas = data[18] == 0 || (data[18] > 0 && this.validator.filtroNum(data[18]));

    const validacion_gral = vNominaRPImss && vNominaPeriodicidad && vNominaPeriodoInicio && vNominaPeriodoFin && /*vNominaMoneda &&*/ vNominaDiasTrabajados && vNominaSueldo && vNominaOtrasPercepciones && 
      vNominaTotalPercepciones && vNominaNetoPagado &&  vNominaTotalEnEspecie &&  vNominaSalarioXHora && vNominaTotalImss && vNominaHorasXDia && vNominaTotalIsr && vNominaSubsidioEmpleo &&
      vNominaOtrasDeducciones && vNominaTotalDeducciones && vNominaTotalEfectivo && vNominaSalarioDiario && vNominaSalarioIntegrado && vNominaDiasJornada && vNominaFaltas;

    if (validacion_gral) {
      this.trab_serv.valorHumanoTrabajadoresInfoNominasByNSS(data[8]).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            const nomina_empleado_fecha_alta = response.fecha_alta || "";
            const nomina_empleado_salario_tipo = response.salario_tipo || "";

            //"bancCuentaCuenta": "121234567890098765435",
            const nomina_empleado_cbankBanco = response.bancCuentaBancoClave+" "+response.bancCuentaBancoNombreComercial || "";
            const nomina_empleado_cbankCuenta = response.bancCuentaCuentaMin || "";
            var errores = 0;
            if (response.registro_patronal_imss != data[2]) {
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "Rsgistro patronal del documento cargado es incorrecto para el trabajador "+data[3]});
              this.validator.errorInputRow(objeto);
              ++errores;
            }
            
            this.lista_nomina_reportada.push({
              "errores":errores,
              "nomina_clave":data[1].trim(),
              "nomina_registro_patronal":response.registro_patronal_imss,
              "nomina_empleado_token":response.empleado_token,
              "nomina_empleado_nombre": data[3],
              "nomina_periodicidad": data[4],
              "nomina_periodo_inicio": this.formateoFechaExcel(data[5]),
              "nomina_periodo_fin": this.formateoFechaExcel(data[6]),
              "nomina_moneda": data[7],
              "nomina_empleado_cbankBanco":nomina_empleado_cbankBanco,
              "nomina_empleado_cbankCuenta":nomina_empleado_cbankCuenta,
              "nomina_empleado_nss": data[8],
              "nomina_empleado_rfc": data[9],
              "nomina_empleado_curp": data[10],
              "nomina_empleado_fecha_alta":nomina_empleado_fecha_alta,
              "nomina_empleado_departamento":data[12],
              "nomina_empleado_puesto":data[13],
              "nomina_empleado_tipo_salario":nomina_empleado_salario_tipo,
              "nomina_salario_diario": data[15],
              "nomina_salario_integrado": data[16],
              "nomina_dias_trabajados": data[17],
              "nomina_faltas": data[18],
              "nomina_sueldo": data[19],
              "nomina_horas_extras_dobles": data[20],
              "nomina_aguinaldo": data[21],
              "nomina_horas_extras_triples": data[22],
              "nomina_vacaciones": data[23],
              "nomina_prima_vacacional": data[24],
              "nomina_reparto_de_utilidades": data[25],
              "nomina_despensa": data[26],
              "nomina_premios_de_asistencia": data[27],
              "nomina_premios_de_puntualidad": data[28],
              "nomina_prima_dominical": data[29],
              "nomina_bno_extra_x_comision_otro_edo": data[30],
              "nomina_indemnizacion": data[31],
              "nomina_prima_de_antiguedad": data[32],
              "nomina_isr_ajustado_por_subsidio": data[33],
              "nomina_total_isr": data[34],
              "nomina_total_imss": data[35],
              "nomina_credito_fonacot": data[36],
              "nomina_credito_infonavit": data[37],
              "nomina_subsidio_empleo": data[38],
              //"nomina_subsidio_empleo_aplicado": data[39],
              "nomina_otros_pagos": data[40],
              "nomina_otras_percepciones": data[41],
              "nomina_total_percepciones": data[42],
              "nomina_otras_deducciones": data[43],
              "nomina_total_deducciones": data[44],
              "nomina_total_efectivo": data[45],
              "nomina_total_en_especie": data[46],
              "nomina_neto_pagado": data[47],
              "nomina_salario_por_hora": data[48],
              "nomina_horas_por_dia": data[49],
              "nomina_dias_jornada": data[50],
            });
            this.cd.detectChanges();
            this.limpiaNominaEmpleado();
            this.calculaNominaTotales();
            console.log("Empleado agregado a nómina:", this.lista_nomina_reportada);
            this.validator.correctoInputRow(objeto);
          } else {
            this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "No se pudo obtener la información del trabajador"});
            this.validator.errorInputRow(objeto);
          }
        },
        error: (err) => {
          console.error(err);
          this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "Ocurrió un error al consultar el trabajador"});
          this.validator.errorInputRow(objeto);
        }
      });
    } else {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "Hay errores en la validación de los datos del trabajador y su nómina"});
      this.validator.errorInputRow(objeto);
    }
  }

  keyupObservacionNomina(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.nomina_observacion = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeNominaRPIMSS(registro_patronal_imss:any){
    var new_nomina_rpimss = document.getElementById("new_nomina_rpimss");
    let rpimss = this.catalogo_registros_patronales.find((row:any) => registro_patronal_imss != '' && row.clave_registro_patronal_imss === registro_patronal_imss);
    this.modelNomina.registro_patronal = typeof rpimss !== 'undefined' ? rpimss.clave_registro_patronal_imss : '';
    typeof rpimss !== 'undefined' ? this.validator.correctoSelectBrowser(new_nomina_rpimss) : this.validator.errorSelectBrowser(new_nomina_rpimss);
    if (typeof rpimss !== 'undefined') {
      this.listando_empleados_lista();
    }
  }

  listando_empleados_lista(){
    this.trab_serv.catalogoGeneralTrabajadoresXRegistroPatronal(this.modelNomina.registro_patronal).subscribe(
      response => {
        if (response.status == 'success') {
          this.list_nomina_empleados = response.empleados;
          if (this.list_nomina_empleados.length < response.list_empleados) {
            this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "Del total de empleados, hay algunos que no cumplen con los requisitos para registro de nóminas (Periodicidad, moneda, salario diario y SDI)"});
          }
          console.log(this.list_nomina_empleados);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  changeEmpleadoNomina(opcion:any){
    console.log(opcion);
    var new_nomina_empleado = document.getElementById("new_nomina_empleado");
    let trab = this.list_nomina_empleados.find((row:any) => opcion.token_empleado_vhum != '' && row.token_empleado_vhum === opcion.token_empleado_vhum);
    this.modelNomina.trabajador_token = typeof trab !== 'undefined' ? trab.token_empleado_vhum : '';
    this.modelNomina.trabajador_nombre = typeof trab !== 'undefined' ? trab.nombre_completo : '';

    this.modelNomina.periodicidad = typeof trab !== 'undefined' ? trab.nomina_periodicidad : '';
    this.modelNomina.moneda = typeof trab !== 'undefined' ? trab.nomina_moneda : '';
    this.modelNomina.moneda_decimales = typeof trab !== 'undefined' ? trab.nomina_moneda_decimales : '';
    this.modelNomina.salario_diario = typeof trab !== 'undefined' ? trab.nomina_salario_diario : '';
    this.modelNomina.salario_integrado = typeof trab !== 'undefined' ? trab.nomina_salario_integrado : '';
    typeof trab !== 'undefined' ? this.validator.correctoSelectBrowser(new_nomina_empleado) : this.validator.errorSelectBrowser(new_nomina_empleado);
  }

  changeNominaPeriodicidad(opcion:any){
    var new_nomina_period = document.getElementById("new_nomina_periodicidad");
    let nper = this.nomina_periodos.find((row:any) => opcion.periodicidad != '' && row.periodicidad === opcion.periodicidad);
    this.modelNomina.periodicidad = typeof nper !== 'undefined' ? nper.periodicidad : '';
    typeof nper !== 'undefined' ? this.validator.correctoSelectBrowser(new_nomina_period) : this.validator.errorSelectBrowser(new_nomina_period);
  }

  changeNominaPeriodo(event:any){
    var nomina_periodo_de = document.getElementById("nomina_periodo_de");
    if (this.rangoPeriodoNomina && this.rangoPeriodoNomina.length === 2) {
      const dateInicio = this.rangoPeriodoNomina[0];
      const dateFin = this.rangoPeriodoNomina[1];
      
      if (dateInicio && dateFin) {
        const validacionInicio = dateInicio && this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
        const validacionFin = dateFin && this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
        if (validacionInicio && validacionFin) {
          // Guardamos en tus variables de nómina
          this.modelNomina.periodo_inicio = dateInicio.toISOString().split('T')[0];
          this.modelNomina.periodo_fin = dateFin.toISOString().split('T')[0];
    
          // Indicas al validador visual que está correcto
          this.validator.correctoInputRow(nomina_periodo_de);
        } else {
          // Si algo está mal, limpias y marcas error
          this.modelNomina.periodo_inicio = '';
          this.modelNomina.periodo_fin = '';
          this.validator.errorInputRow(nomina_periodo_de);
        }
      } else {
        this.validator.errorInputRow(nomina_periodo_de);
        return;
      }
    } else {
      // Si sólo hay una fecha o no hay nada
      this.modelNomina.periodo_inicio = '';
      this.modelNomina.periodo_fin = '';
      this.validator.errorInputRow(nomina_periodo_de);
    }
  }
  
  formatoFecha(fecha: Date): string {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  
  changeMonedaNomina(opcion:any){
    var selectedMonedaNomina = document.getElementById("selectedMonedaNomina");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    const validacion = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) && typeof mnd !== 'undefined';
    this.modelNomina.moneda = typeof mnd !== 'undefined' ? mnd.code : '';
    this.modelNomina.moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : 0;
    validacion ? this.validator.correctoSelectBrowser(selectedMonedaNomina) : this.validator.errorSelectBrowser(selectedMonedaNomina);
  }

	//salario diario
  keyupNominaSalarioDiario(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.salario_diario = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

	//salario integrado
  keyupNominaSalarioIntegrado(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.salario_integrado = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDiasTrabajados(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.dias_trabajados = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

	//faltas
  keyupNominaFaltas(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.faltas = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaSueldo(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.sueldo = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaHorasExtrasDobles(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.horas_extras_dobles = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaAguinaldo(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.aguinaldo = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaHorasExtrasTriples(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.horas_extras_triples = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaVacaciones(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.vacaciones = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaPrimaVacacional(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.prima_vacacional = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaRepartoDeUtilidades(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.reparto_de_utilidades = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDespensa(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.despensa = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaPremiosAsistencia(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.premios_de_asistencia = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaPremiosPuntualidad(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.premios_de_puntualidad = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaPrimaDominical(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.prima_dominical = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaBnoExtraXComisionOtroEdo(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.bno_extra_x_comision_otro_edo = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaIndemnizacion(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.indemnizacion = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaPrimaAntiguedad(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.prima_de_antiguedad = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

	//percepciones
  keyupNominaOtrosPagos(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.otros_pagos = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaOtrasPercepciones(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.otras_percepciones = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaTotalPercepciones(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.total_percepciones = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calculoTotalPercepciones(){
    var new_nomina_total_percepciones = document.getElementById("new_nomina_total_percepciones");
    var calculo = parseFloat(this.modelNomina.sueldo.toString()) + parseFloat(this.modelNomina.horas_extras_dobles.toString()) + parseFloat(this.modelNomina.aguinaldo.toString()) + parseFloat(this.modelNomina.horas_extras_triples.toString()) + 
    parseFloat(this.modelNomina.vacaciones.toString()) + parseFloat(this.modelNomina.prima_vacacional.toString()) + parseFloat(this.modelNomina.reparto_de_utilidades.toString()) + parseFloat(this.modelNomina.despensa.toString()) + 
    parseFloat(this.modelNomina.premios_de_asistencia.toString()) + parseFloat(this.modelNomina.premios_de_puntualidad.toString()) + parseFloat(this.modelNomina.prima_dominical.toString()) + 
    parseFloat(this.modelNomina.bno_extra_x_comision_otro_edo.toString()) + parseFloat(this.modelNomina.indemnizacion.toString()) + parseFloat(this.modelNomina.prima_de_antiguedad.toString()) + 
    parseFloat(this.modelNomina.otras_percepciones.toString());
    console.log(calculo);

    this.modelNomina.total_percepciones = Number(numeral(calculo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales)));
    $("#new_nomina_total_percepciones").val(this.modelNomina.total_percepciones);
    this.validator.correctoInputRow(new_nomina_total_percepciones);
  }

  keyupNominaIsrAjustadoPorSubsidio(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.isr_ajustado_por_subsidio = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaTotalIsr(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.total_isr = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaTotalImss(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.total_imss = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaCreditoFonacot(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.credito_fonacot = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaCreditoInfonavit(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.credito_infonavit = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaSubsidioEmpleo(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.subsidio_empleo = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  /*keyupNominaSubsidioEmpleoAplicado(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.subsidio_empleo_aplicado = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }*/

  keyupNominaOtrasDeducciones(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.otras_deducciones = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaTotalDeducciones(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.total_deducciones = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calculoTotalDeducciones(){
    var new_nomina_total_deducciones = document.getElementById("new_nomina_total_deducciones");
    
    var calculo = parseFloat(this.modelNomina.isr_ajustado_por_subsidio.toString()) + parseFloat(this.modelNomina.total_isr.toString()) + parseFloat(this.modelNomina.total_imss.toString()) + 
      parseFloat(this.modelNomina.credito_fonacot.toString()) + parseFloat(this.modelNomina.credito_infonavit.toString()) + parseFloat(this.modelNomina.subsidio_empleo.toString()) + 
      parseFloat(this.modelNomina.otras_deducciones.toString());
      //parseFloat(this.modelNomina.subsidio_empleo_aplicado.toString()) + parseFloat(this.modelNomina.otras_deducciones.toString());
    console.log(calculo);

    this.modelNomina.total_deducciones = Number(numeral(calculo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales)));
    $("#new_nomina_total_deducciones").val(this.modelNomina.total_deducciones);
    this.validator.correctoInputRow(new_nomina_total_deducciones);
  }

	//total efectivo
  keyupNominaTotalEfectivo(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.total_efectivo = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calculoTotalEfectivo(){
    var new_nomina_total_efectivo = document.getElementById("new_nomina_total_efectivo");
    var calculo = parseFloat(this.modelNomina.total_percepciones.toString()) - parseFloat(this.modelNomina.despensa.toString());

    this.modelNomina.total_efectivo = Number(numeral(calculo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales)));
    $("#new_nomina_total_efectivo").val(this.modelNomina.total_efectivo);
    this.validator.correctoInputRow(new_nomina_total_efectivo);
  }

	//total en especie
  keyupNominaTotalEnEspecie(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.total_en_especie = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

	//neto pagado
  keyupNominaNetoPagado(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.neto_pagado = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calculoNetoPagado(){
    var new_nomina_neto_pagado = document.getElementById("new_nomina_neto_pagado");
    var calculo = parseFloat(this.modelNomina.total_efectivo.toString()) - parseFloat(this.modelNomina.total_en_especie.toString());

    this.modelNomina.neto_pagado = Number(numeral(calculo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales)));
    $("#new_nomina_neto_pagado").val(this.modelNomina.neto_pagado);
    this.validator.correctoInputRow(new_nomina_neto_pagado);
  }

	//horas por dia
  keyupNominaHorasPorDia(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.horas_por_dia = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

	//salario por hora
  keyupNominaSalarioPorHora(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modelNomina.salario_por_hora = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  calculoSalarioPorHora(){
    if (this.modelNomina.horas_extras_dobles == 0 && this.modelNomina.horas_extras_triples == 0) {      
      var new_nomina_salario_por_hora = document.getElementById("new_nomina_salario_por_hora");
      var calculo = parseFloat(this.modelNomina.salario_diario.toString()) / parseFloat(this.modelNomina.horas_por_dia.toString());
  
      this.modelNomina.salario_por_hora = Number(numeral(calculo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales)));
      $("#new_nomina_salario_por_hora").val(this.modelNomina.salario_por_hora);
      this.validator.correctoInputRow(new_nomina_salario_por_hora);
    }
  }

  get validaDatosNominaReport():Boolean{
    const vNominaRPImss = this.modelNomina.registro_patronal != '' && this.validator.filtroAlfaNumerico(this.modelNomina.registro_patronal);
    const vNominaEmpleado = this.modelNomina.trabajador_token != '';

    let nper = this.nomina_periodos.find((row:any) => row.periodicidad === this.modelNomina.periodicidad);
    const vNominaPeriodicidad = this.modelNomina.periodicidad != '' && this.validator.filtroAlfaNumerico(this.modelNomina.periodicidad) && typeof nper !== 'undefined';

    const vNominaPeriodoInicio = this.modelNomina.periodo_inicio != '' && this.validator.filtroFecha(this.modelNomina.periodo_inicio);
    const vNominaPeriodoFin = this.modelNomina.periodo_fin != '' && this.validator.filtroFecha(this.modelNomina.periodo_fin);
    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.modelNomina.moneda);
    const vNominaMoneda = this.modelNomina.moneda != '' && this.validator.filtroAlfaNumerico(this.modelNomina.moneda) && typeof mnd !== 'undefined';

    const vNominaSalarioDiario = Number(this.modelNomina.salario_diario) == 0 || (Number(this.modelNomina.salario_diario) > 0 && this.validator.filtroNum(this.modelNomina.salario_diario));
    
    const vNominaSalarioIntegrado = Number(this.modelNomina.salario_integrado) == 0 || (Number(this.modelNomina.salario_integrado) > 0 && this.validator.filtroNum(this.modelNomina.salario_integrado));
    
    const vNominaDiasTrabajados = this.modelNomina.dias_trabajados == 0 || (this.modelNomina.dias_trabajados > 0 && this.validator.filtroNum(this.modelNomina.dias_trabajados));
    
    const vNominaFaltas = this.modelNomina.faltas == 0 || (this.modelNomina.faltas > 0 && this.validator.filtroNum(this.modelNomina.faltas));
    
    const vNominaSueldo = this.modelNomina.sueldo == 0 || (this.modelNomina.sueldo > 0 && this.validator.filtroNum(this.modelNomina.sueldo));
    
    const vNominaHorasExtrasDobles = this.modelNomina.horas_extras_dobles == 0 || (this.modelNomina.horas_extras_dobles > 0 && this.validator.filtroNum(this.modelNomina.horas_extras_dobles));
    
    const vNominaAguinaldo = this.modelNomina.aguinaldo == 0 || (this.modelNomina.aguinaldo > 0 && this.validator.filtroNum(this.modelNomina.aguinaldo));
    
    const vNominaHorasExtrasTriples = this.modelNomina.horas_extras_triples == 0 || (this.modelNomina.horas_extras_triples > 0 && this.validator.filtroNum(this.modelNomina.horas_extras_triples));
    
    const vNominaVacaciones = this.modelNomina.vacaciones == 0 || (this.modelNomina.vacaciones > 0 && this.validator.filtroNum(this.modelNomina.vacaciones));
    
    const vNominaPrimaVacacional = this.modelNomina.prima_vacacional == 0 || (this.modelNomina.prima_vacacional > 0 && this.validator.filtroNum(this.modelNomina.prima_vacacional));
    
    const vNominaRepartoDeUtilidades = this.modelNomina.reparto_de_utilidades == 0 || (this.modelNomina.reparto_de_utilidades > 0 && this.validator.filtroNum(this.modelNomina.reparto_de_utilidades));
    
    const vNominaDespensa = this.modelNomina.despensa == 0 || (this.modelNomina.despensa > 0 && this.validator.filtroNum(this.modelNomina.despensa));
    
    const vNominaPremiosAsistencia = this.modelNomina.premios_de_asistencia == 0 || (this.modelNomina.premios_de_asistencia > 0 && this.validator.filtroNum(this.modelNomina.premios_de_asistencia));
    
    const vNominaPremiosPuntualidad = this.modelNomina.premios_de_puntualidad == 0 || (this.modelNomina.premios_de_puntualidad > 0 && this.validator.filtroNum(this.modelNomina.premios_de_puntualidad));
    
    const vNominaPrimaDominical = this.modelNomina.prima_dominical == 0 || (this.modelNomina.prima_dominical > 0 && this.validator.filtroNum(this.modelNomina.prima_dominical));
    
    const vNominaBnoExtraXComisionOtroEdo = this.modelNomina.bno_extra_x_comision_otro_edo == 0 || (this.modelNomina.bno_extra_x_comision_otro_edo > 0 && this.validator.filtroNum(this.modelNomina.bno_extra_x_comision_otro_edo));
    
    const vNominaIndemnizacion = this.modelNomina.indemnizacion == 0 || (this.modelNomina.indemnizacion > 0 && this.validator.filtroNum(this.modelNomina.indemnizacion));
    
    const vNominaPrimaAntiguedad = this.modelNomina.prima_de_antiguedad == 0 || (this.modelNomina.prima_de_antiguedad > 0 && this.validator.filtroNum(this.modelNomina.prima_de_antiguedad));
    
    const vNominaIsrAjustadoPorSubsidio = this.modelNomina.isr_ajustado_por_subsidio == 0 || (this.modelNomina.isr_ajustado_por_subsidio > 0 && this.validator.filtroNum(this.modelNomina.isr_ajustado_por_subsidio));
    
    const vNominaTotalIsr = this.modelNomina.total_isr == 0 || (this.modelNomina.total_isr > 0 && this.validator.filtroNum(this.modelNomina.total_isr));
    
    const vNominaTotalImss = this.modelNomina.total_imss == 0 || (this.modelNomina.total_imss > 0 && this.validator.filtroNum(this.modelNomina.total_imss));
    
    const vNominaCreditoFonacot = this.modelNomina.credito_fonacot == 0 || (this.modelNomina.credito_fonacot > 0 && this.validator.filtroNum(this.modelNomina.credito_fonacot));
    
    const vNominaCreditoInfonavit = this.modelNomina.credito_infonavit == 0 || (this.modelNomina.credito_infonavit > 0 && this.validator.filtroNum(this.modelNomina.credito_infonavit));
    
    const subsidio_empleo = Number(this.modelNomina.subsidio_empleo);
    const vNominaSubsidioEmpleo = subsidio_empleo == 0 || (subsidio_empleo > 0 && this.validator.filtroNum(subsidio_empleo));
    
    //const subsidio_empleo_aplicado = Number(this.modelNomina.subsidio_empleo_aplicado);
    //const vNominaSubsidioEmpleoAplicado = subsidio_empleo_aplicado == 0 || (subsidio_empleo_aplicado > 0 && this.validator.filtroNum(subsidio_empleo_aplicado));

    const otras_percepciones = Number(this.modelNomina.otras_percepciones);
    const vNominaOtrasPercepciones = otras_percepciones == 0 || (otras_percepciones > 0 && this.validator.filtroNum(otras_percepciones));
    const total_percepciones = Number(this.modelNomina.total_percepciones);
    const vNominaTotalPercepciones = total_percepciones == 0 || (total_percepciones > 0 && this.validator.filtroNum(total_percepciones));
    const otras_deducciones = Number(this.modelNomina.otras_deducciones);
    const vNominaOtrasDeducciones = otras_deducciones == 0 || (otras_deducciones > 0 && this.validator.filtroNum(otras_deducciones));
    const total_deducciones = Number(this.modelNomina.total_deducciones);
    const vNominaTotalDeducciones = total_deducciones === 0 || (total_deducciones > 0 && this.validator.filtroNum(total_deducciones));
    
    const vNominaTotalEfectivo = this.modelNomina.total_efectivo > 0 && this.validator.filtroNum(this.modelNomina.total_efectivo);
    const vNominaTotalEnEspecie = this.modelNomina.total_en_especie == 0 || (this.modelNomina.total_en_especie > 0 && this.validator.filtroNum(this.modelNomina.total_en_especie));
    const vNominaNetoPagado = this.modelNomina.neto_pagado > 0 && this.validator.filtroNum(this.modelNomina.neto_pagado);
    const vNominaSalarioXHora = this.modelNomina.salario_por_hora > 0 && this.validator.filtroNum(this.modelNomina.salario_por_hora);
    const vNominaHorasXDia = this.modelNomina.horas_por_dia > 0 && this.validator.filtroNum(this.modelNomina.horas_por_dia);

    return vNominaRPImss && 
      vNominaEmpleado &&
      vNominaPeriodicidad && 
      vNominaPeriodoInicio && 
      vNominaPeriodoFin && 
      vNominaMoneda && 

      vNominaSalarioDiario && 
      vNominaSalarioIntegrado && 
      vNominaDiasTrabajados && 
      vNominaFaltas && 
      vNominaSueldo && 
      vNominaHorasExtrasDobles && 
      vNominaAguinaldo && 
      vNominaHorasExtrasTriples && 
      vNominaVacaciones && 
      vNominaPrimaVacacional && 
      vNominaRepartoDeUtilidades && 
      vNominaDespensa && 
      vNominaPremiosAsistencia && 
      vNominaPremiosPuntualidad &&
      vNominaPrimaDominical &&
      vNominaBnoExtraXComisionOtroEdo &&
      vNominaIndemnizacion &&
      vNominaPrimaAntiguedad &&
      vNominaIsrAjustadoPorSubsidio &&
      vNominaTotalIsr && 
      vNominaTotalImss && 
      vNominaCreditoFonacot && 
      vNominaCreditoInfonavit &&
      vNominaSubsidioEmpleo &&
      //vNominaSubsidioEmpleoAplicado &&

      vNominaOtrasPercepciones &&
      vNominaTotalPercepciones &&
      vNominaOtrasDeducciones &&
      vNominaTotalDeducciones &&
      vNominaTotalEfectivo &&
      vNominaTotalEnEspecie &&
      vNominaNetoPagado &&
      vNominaSalarioXHora &&
      vNominaHorasXDia;
  }

  limpiaNominaEmpleado(){
    this.validator.limpiaInputRow(document.getElementById("new_nomina_empleado"));
    this.nomina_empleado = null;
    this.validator.limpiaInputRow(document.getElementById("nomina_periodo_de"));
    this.rangoPeriodoNomina = undefined;
    this.validator.limpiaInputRow(document.getElementById("new_nomina_dias_trabajados"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_faltas"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_sueldo"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_horas_extras_dobles"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_aguinaldo"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_horas_extras_triples"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_vacaciones"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_prima_vacacional"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_reparto_de_utilidades"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_despensa"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_premios_de_asistencia"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_premios_de_puntualidad"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_prima_dominical"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_bno_extra_x_comision_otro_edo"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_indemnizacion"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_prima_de_antiguedad"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_isr_ajustado_por_subsidio"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_total_isr"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_total_imss"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_credito_fonacot"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_credito_infonavit"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_subsidio_empleo"));
    //this.validator.limpiaInputRow(document.getElementById("new_nomina_subsidio_empleo_aplicado"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_otras_percepciones"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_otros_pagos"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_total_percepciones"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_otras_deducciones"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_total_deducciones"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_total_efectivo"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_total_en_especie"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_neto_pagado"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_salario_por_hora"));
    this.validator.limpiaInputRow(document.getElementById("new_nomina_horas_por_dia"));
    this.modelNomina = new nominaModelo(this.modelNomina.registro_patronal,'','','','','','',2,'','','0.00','0.00',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'');//,0.00
    console.log(this.modelNomina);

    //this.validator.limpiaInputRow(document.getElementById("new_nomina_rpimss"));
    //this.nomina_registro_patronal = null;
    //this.validator.limpiaInputRow(document.getElementById("new_nomina_periodicidad"));
    //this.nomina_periodicidad = null;
    //this.validator.limpiaInputRow(document.getElementById("selectedMonedaNomina"));
    //this.nomina_moneda = null;
    
    //this.validator.limpiaInputRow(document.getElementById("new_nomina_salario_diario"));
    //this.validator.limpiaInputRow(document.getElementById("new_nomina_salario_integrado"));
  }

  agregaEmpleadoNomina(){
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
        this.trab_serv.valorHumanoTrabajadoresInfoNominas(this.modelNomina.trabajador_token).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              const nomina_empleado_nss = response.numero_de_seguridad_social || "";
              const nomina_empleado_rfc = response.rfc || "";
              const nomina_empleado_curp = response.curp || "";
              const nomina_empleado_fecha_alta = response.fecha_alta || "";
              const nomina_empleado_departamento = response.departamento || "";
              const nomina_empleado_puesto = response.puesto || "";
              const nomina_empleado_salario_tipo = response.salario_tipo || "";

              const nomina_empleado_cbankBanco = response.bancCuentaBancoClave+" "+response.bancCuentaBancoNombreComercial || "";
              const nomina_empleado_cbankCuenta = response.bancCuentaCuentaMin || "";
              
              const num_lista = this.lista_nomina_reportada.length + 1;
              this.lista_nomina_reportada.push({
                "nomina_clave":num_lista,
                "nomina_registro_patronal":this.modelNomina.registro_patronal,
                "nomina_empleado_token":this.modelNomina.trabajador_token,
                "nomina_empleado_nombre":this.modelNomina.trabajador_nombre,
                "nomina_periodicidad":this.modelNomina.periodicidad,
                "nomina_periodo_inicio":this.modelNomina.periodo_inicio,
                "nomina_periodo_fin":this.modelNomina.periodo_fin,

                "nomina_moneda":this.modelNomina.moneda,
                "nomina_empleado_cbankBanco":nomina_empleado_cbankBanco,
                "nomina_empleado_cbankCuenta":nomina_empleado_cbankCuenta,

                "nomina_empleado_nss":nomina_empleado_nss,
                "nomina_empleado_rfc":nomina_empleado_rfc,
                "nomina_empleado_curp":nomina_empleado_curp,

                "nomina_empleado_fecha_alta":nomina_empleado_fecha_alta,
                "nomina_empleado_departamento":nomina_empleado_departamento,
                "nomina_empleado_puesto":nomina_empleado_puesto,
                
                "nomina_empleado_tipo_salario":nomina_empleado_salario_tipo,
                "nomina_salario_diario":this.modelNomina.salario_diario,
                "nomina_salario_integrado":this.modelNomina.salario_integrado,
                "nomina_dias_trabajados":this.modelNomina.dias_trabajados,
                "nomina_faltas":this.modelNomina.faltas,
                "nomina_sueldo":this.modelNomina.sueldo,

                "nomina_horas_extras_dobles":this.modelNomina.horas_extras_dobles,
                "nomina_aguinaldo":this.modelNomina.aguinaldo,
                "nomina_horas_extras_triples":this.modelNomina.horas_extras_triples,
                "nomina_vacaciones":this.modelNomina.vacaciones,
                "nomina_prima_vacacional":this.modelNomina.prima_vacacional,
                "nomina_reparto_de_utilidades":this.modelNomina.reparto_de_utilidades,
                "nomina_despensa":this.modelNomina.despensa,
                "nomina_premios_de_asistencia":this.modelNomina.premios_de_asistencia,
                "nomina_premios_de_puntualidad":this.modelNomina.premios_de_puntualidad,
                "nomina_prima_dominical":this.modelNomina.prima_dominical,
                "nomina_bno_extra_x_comision_otro_edo":this.modelNomina.bno_extra_x_comision_otro_edo,
                "nomina_indemnizacion":this.modelNomina.indemnizacion,
                "nomina_prima_de_antiguedad":this.modelNomina.prima_de_antiguedad,
                "nomina_isr_ajustado_por_subsidio":this.modelNomina.isr_ajustado_por_subsidio,

                "nomina_total_isr":this.modelNomina.total_isr,
                "nomina_total_imss":this.modelNomina.total_imss,

                "nomina_credito_fonacot":this.modelNomina.credito_fonacot,
                "nomina_credito_infonavit":this.modelNomina.credito_infonavit,
                
                "nomina_subsidio_empleo":this.modelNomina.subsidio_empleo,
                //"nomina_subsidio_empleo_aplicado":this.modelNomina.subsidio_empleo_aplicado,
                "nomina_otras_percepciones":this.modelNomina.otras_percepciones,
                "nomina_otros_pagos":this.modelNomina.otros_pagos,
                "nomina_total_percepciones":this.modelNomina.total_percepciones,
                "nomina_otras_deducciones":this.modelNomina.otras_deducciones,
                "nomina_total_deducciones":this.modelNomina.total_deducciones,
                "nomina_total_efectivo":this.modelNomina.total_efectivo,
                "nomina_total_en_especie":this.modelNomina.total_en_especie,
                "nomina_neto_pagado":this.modelNomina.neto_pagado,
                "nomina_salario_por_hora":this.modelNomina.salario_por_hora,
                "nomina_horas_por_dia":this.modelNomina.horas_por_dia,
              });
              this.limpiaNominaEmpleado();
              this.calculaNominaTotales();
              console.log("Empleado agregado a nómina:", this.lista_nomina_reportada);
              
            } else {
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "No se pudo obtener la información del trabajador"});
            }
          },
          error: (err) => {
            console.error(err);
            this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "Ocurrió un error al consultar el trabajador"});
          }
        });
      }
    });
  }

	//salario diario
  keyupNominaDesglosePeriodoInicio(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroFecha(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_periodo_inicio = validacion ? valor : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(lNomRep);
  }

  keyupNominaDesglosePeriodoFin(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroFecha(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_periodo_fin = validacion ? valor : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseSalarioDiario(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_salario_diario = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseSalarioIntegrado(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_salario_integrado = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseDiasTrabajados(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_dias_trabajados = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseFaltas(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_faltas = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseSueldo(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_sueldo = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseHoraExtrasDobles(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_horas_extras_dobles = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseAguinaldo(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_aguinaldo = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseHorasExtrasTriples(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_horas_extras_triples = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseVacaciones(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_vacaciones = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesglosePrimaVacacional(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_prima_vacacional = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseRepartoDeUtilidades(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_reparto_de_utilidades = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseDespensa(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_despensa = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesglosePremiosDeAsistencia(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_premios_de_asistencia = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesglosePremiosDePuntualidad(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_premios_de_puntualidad = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesglosePrimaDominical(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_prima_dominical = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseBnoExtraXComisionOtroDdo(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_bno_extra_x_comision_otro_edo = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseIndemnizacion(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_indemnizacion = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesglosePrimaDeAntiguedad(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_prima_de_antiguedad = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseOtrasPercepciones(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_otras_percepciones = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseOtrosPagos(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_otros_pagos = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseTotalPercepciones(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_total_percepciones = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseIsrAjustadoXSubsidio(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_isr_ajustado_por_subsidio = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseTotalIsr(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_total_isr = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseTotalImss(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_total_imss = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseCreditoFonacot(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_credito_fonacot = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseCreditoInfonavit(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_credito_infonavit = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseSubsidioEmpleo(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_subsidio_empleo = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  /*keyupNominaDesgloseSubsidioEmpleoAplicado(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_subsidio_empleo_aplicado = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }*/

  keyupNominaDesgloseOtrasDeducciones(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_otras_deducciones = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseTotalDeducciones(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_total_deducciones = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseTotalEfectivo(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_total_efectivo = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseTotalEspecie(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_total_en_especie = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseNetoPagado(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_neto_pagado = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseHorasXDia(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_horas_por_dia = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDesgloseSalarioXHora(event:any,nomina_empleado_token:any){
    const lNomRep = this.lista_nomina_reportada.find((row:any) => row.nomina_empleado_token === nomina_empleado_token);
    const valor = event.innerText.trim();
    console.log(valor);
    const validacion = valor != "" && this.validator.filtroNum(valor) && typeof lNomRep !== 'undefined';
    lNomRep.nomina_salario_por_hora = validacion ? valor : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  deleteNominaPartida(nomina_clave:any){
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
        const index = this.lista_nomina_reportada.findIndex((row:any) => row.nomina_clave === nomina_clave);
        this.lista_nomina_reportada.splice(index, 1);
        this.calculaNominaTotales();
        this.cd.detectChanges();
      }
    });
  }

  calculaNominaTotales(){
    var totales_nomi_salario_diario = 0;
    var totales_nomi_salario_integrado = 0;
    var totales_nomi_dias_trabajados = 0;
    var totales_nomi_faltas = 0;
    var totales_nomi_sueldo = 0;
    var totales_nomi_horas_extras_dobles = 0;
    var totales_nomi_aguinaldo = 0;
    var totales_nomi_horas_extras_triples = 0;
    var totales_nomi_vacaciones = 0;
    var totales_nomi_prima_vacacional = 0;
    var totales_nomi_reparto_de_utilidades = 0;
    var totales_nomi_despensa = 0;
    var totales_nomi_premios_de_asistencia = 0;
    var totales_nomi_premios_de_puntualidad = 0;
    var totales_nomi_prima_dominical = 0;
    var totales_nomi_bno_extra_x_comision_otro_edo = 0;
    var totales_nomi_indemnizacion = 0;
    var totales_nomi_prima_de_antiguedad = 0;
    var totales_nomi_isr_ajustado_por_subsidio = 0;
    var totales_nomi_total_isr = 0;
    var totales_nomi_total_imss = 0;
    var totales_nomi_credito_fonacot = 0;
    var totales_nomi_credito_infonavit = 0;
    var totales_nomi_subsidio_empleo = 0;
    //var totales_nomi_subsidio_empleo_aplicado = 0;
    var totales_nomi_otras_percepciones = 0;
    var totales_nomi_nomina_otros_pagos = 0;
    var totales_nomi_total_percepciones = 0;
    var totales_nomi_otras_deducciones = 0;
    var totales_nomi_total_deducciones = 0;
    var totales_nomi_total_efectivo = 0;
    var totales_nomi_total_en_especie = 0;
    var totales_nomi_neto_pagado = 0;
    var totales_nomi_salario_por_hora = 0;
    var totales_nomi_horas_por_dia = 0;
    var totales_nomi_u_t_laboradas = 0;

    this.lista_nomina_reportada.forEach((nom:any) => {
      totales_nomi_salario_diario += parseFloat(nom.nomina_salario_diario) || 0;
      totales_nomi_salario_integrado += parseFloat(nom.nomina_salario_integrado) || 0;
      totales_nomi_dias_trabajados += parseFloat(nom.nomina_dias_trabajados) || 0;
      totales_nomi_faltas += parseFloat(nom.nomina_faltas) || 0;
      totales_nomi_sueldo += parseFloat(nom.nomina_sueldo) || 0;
      totales_nomi_horas_extras_dobles += parseFloat(nom.nomina_horas_extras_dobles) || 0;
      totales_nomi_aguinaldo += parseFloat(nom.nomina_aguinaldo) || 0;
      totales_nomi_horas_extras_triples += parseFloat(nom.nomina_horas_extras_triples) || 0;
      totales_nomi_vacaciones += parseFloat(nom.nomina_vacaciones) || 0;
      totales_nomi_prima_vacacional += parseFloat(nom.nomina_prima_vacacional) || 0;
      totales_nomi_reparto_de_utilidades += parseFloat(nom.nomina_reparto_de_utilidades) || 0;
      totales_nomi_despensa += parseFloat(nom.nomina_despensa) || 0;
      totales_nomi_premios_de_asistencia += parseFloat(nom.nomina_premios_de_asistencia) || 0;
      totales_nomi_premios_de_puntualidad += parseFloat(nom.nomina_premios_de_puntualidad) || 0;
      totales_nomi_prima_dominical += parseFloat(nom.nomina_prima_dominical) || 0;
      totales_nomi_bno_extra_x_comision_otro_edo += parseFloat(nom.nomina_bno_extra_x_comision_otro_edo) || 0;
      totales_nomi_indemnizacion += parseFloat(nom.nomina_indemnizacion) || 0;
      totales_nomi_prima_de_antiguedad += parseFloat(nom.nomina_prima_de_antiguedad) || 0;
      totales_nomi_isr_ajustado_por_subsidio += parseFloat(nom.nomina_isr_ajustado_por_subsidio) || 0;
      totales_nomi_total_isr += parseFloat(nom.nomina_total_isr) || 0;
      totales_nomi_total_imss += parseFloat(nom.nomina_total_imss) || 0;
      totales_nomi_credito_fonacot += parseFloat(nom.nomina_credito_fonacot) || 0;
      totales_nomi_credito_infonavit += parseFloat(nom.nomina_credito_infonavit) || 0;
      totales_nomi_subsidio_empleo += parseFloat(nom.nomina_subsidio_empleo) || 0;
      //totales_nomi_subsidio_empleo_aplicado += parseFloat(nom.nomina_subsidio_empleo_aplicado) || 0;
      totales_nomi_otras_percepciones += parseFloat(nom.nomina_otras_percepciones) || 0;
      totales_nomi_nomina_otros_pagos += parseFloat(nom.nomina_otros_pagos) || 0;
      totales_nomi_total_percepciones += parseFloat(nom.nomina_total_percepciones) || 0;
      totales_nomi_otras_deducciones += parseFloat(nom.nomina_otras_deducciones) || 0;
      totales_nomi_total_deducciones += parseFloat(nom.nomina_total_deducciones) || 0;
      totales_nomi_total_efectivo += parseFloat(nom.nomina_total_efectivo) || 0;
      totales_nomi_total_en_especie += parseFloat(nom.nomina_total_en_especie) || 0;
      totales_nomi_neto_pagado += parseFloat(nom.nomina_neto_pagado) || 0;
      totales_nomi_salario_por_hora += parseFloat(nom.nomina_salario_por_hora) || 0;
      totales_nomi_horas_por_dia += parseFloat(nom.nomina_horas_por_dia) || 0;
    });

    this.nomina_totales.salario_diario = numeral(totales_nomi_salario_diario).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.salario_integrado = numeral(totales_nomi_salario_integrado).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.dias_trabajados = totales_nomi_dias_trabajados.toString();
    this.nomina_totales.faltas = totales_nomi_faltas.toString();
    this.nomina_totales.sueldo = numeral(totales_nomi_sueldo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.horas_extras_dobles = numeral(totales_nomi_horas_extras_dobles).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.aguinaldo = numeral(totales_nomi_aguinaldo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.horas_extras_triples = numeral(totales_nomi_horas_extras_triples).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.vacaciones = numeral(totales_nomi_vacaciones).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.prima_vacacional = numeral(totales_nomi_prima_vacacional).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.reparto_de_utilidades = numeral(totales_nomi_reparto_de_utilidades).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.despensa = numeral(totales_nomi_despensa).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.premios_de_asistencia = numeral(totales_nomi_premios_de_asistencia).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.premios_de_puntualidad = numeral(totales_nomi_premios_de_puntualidad).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.prima_dominical = numeral(totales_nomi_prima_dominical).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.bno_extra_x_comision_otro_edo = numeral(totales_nomi_bno_extra_x_comision_otro_edo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.indemnizacion = numeral(totales_nomi_indemnizacion).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.prima_de_antiguedad = numeral(totales_nomi_prima_de_antiguedad).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.isr_ajustado_por_subsidio = numeral(totales_nomi_isr_ajustado_por_subsidio).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.total_isr = numeral(totales_nomi_total_isr).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.total_imss = numeral(totales_nomi_total_imss).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.credito_fonacot = numeral(totales_nomi_credito_fonacot).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.credito_infonavit = numeral(totales_nomi_credito_infonavit).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.subsidio_empleo = numeral(totales_nomi_subsidio_empleo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    //this.nomina_totales.subsidio_empleo_aplicado = numeral(totales_nomi_subsidio_empleo_aplicado).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.otras_percepciones = numeral(totales_nomi_otras_percepciones).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.otros_pagos = numeral(totales_nomi_nomina_otros_pagos).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.total_percepciones = numeral(totales_nomi_total_percepciones).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.otras_deducciones = numeral(totales_nomi_otras_deducciones).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.total_deducciones = numeral(totales_nomi_total_deducciones).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.total_efectivo = numeral(totales_nomi_total_efectivo).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.total_en_especie = numeral(totales_nomi_total_en_especie).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.neto_pagado = numeral(totales_nomi_neto_pagado).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.salario_por_hora = numeral(totales_nomi_salario_por_hora).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
    this.nomina_totales.horas_por_dia = numeral(totales_nomi_horas_por_dia).format('0,0.'+'0'.repeat(this.modelNomina.moneda_decimales));
  }

  get validaRegistroNominaReport():Boolean{
    const vNominaNumero = this.numero_de_nomina > 0 && this.validator.filtroNum(this.numero_de_nomina);
    const vNominaFCont = this.nomina_fecha_contabilizacion != "" && this.validator.filtroFecha(this.nomina_fecha_contabilizacion);
    const vNominaObservacion = this.nomina_observacion != "" && this.validator.filtroAlfaNumerico(this.nomina_observacion) && this.nomina_observacion.length >= 4;

    const vNominaReportada = this.lista_nomina_reportada.length > 0;
    return vNominaNumero && vNominaFCont && vNominaObservacion && vNominaReportada;
  }

  guardarBorrador() {
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
        console.log(this.modelNomina.registro_patronal);
        const data_to_save = {
          numero_nomina:this.numero_de_nomina,
          fecha_contabilizacion:this.nomina_fecha_contabilizacion,
          observacion:this.nomina_observacion,
          registro_patronal:this.modelNomina.registro_patronal,
          nomina_reportada:this.lista_nomina_reportada
        };
        
        const id = 1;
        this.indexEd.getByKey('borrador_nomina',id).subscribe((registro:any) => {
          if (registro) {
            this.indexEd.update('borrador_nomina', { id, contenido: data_to_save }).subscribe(() => {
              console.log("Actualizado correctamente");
              window.location.reload();
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "El borrador de nómina ha sido actualizado"});
            });
          } else {
            this.viewNewNominaFormulario = false;
            this.indexEd.add('borrador_nomina', { id, contenido: data_to_save }).subscribe(() => {
              console.log("Guardado por primera vez");
              window.location.reload();
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "Un nuevo borrador de nómina ha sido registrado"});
            });
          }
        });
      }
    });
  }

  registraNominaReporte():void{
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
        this.viewNewNominaFormulario = false;
        //nomina_total_en_especie
        let nomina_en_especie = this.lista_nomina_reportada.filter((row:any) => row.nomina_total_en_especie > 0 && row.nomina_total_en_especie > 0.00).map((row:any) => ({
          nomina_empleado_token: row.nomina_empleado_token,
          nomina_total_en_especie: row.nomina_total_en_especie,
          nomina_moneda: row.nomina_moneda
        }));
        this.nominaServ.registra_reporte_nomina(this.numero_de_nomina,this.nomina_fecha_contabilizacion,this.nomina_observacion,this.lista_nomina_reportada,nomina_en_especie).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });

              this.viewNewNominaFormulario = true;
              this.numero_de_nomina = 0;
              //this.validator.limpiaInputRow(document.getElementById("new_nomina_numero"));
              this.nomina_observacion = "";
              //this.validator.limpiaInputRow(document.getElementById("new_nomina_observaciones"));
              this.lista_nomina_reportada = [];
              
              //this.centTrabModel = new centroTrabajoModelo('','','','',false,'','');
              this.relInterna.mensajeNominaRegistro("nomina_registrada");
              this.modelNomina = new nominaModelo(this.modelNomina.registro_patronal,'','','','','','',2,'','','0.00','0.00',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0,'');//,0.00
              this.nomina_registro_patronal = null;
    
              this.borrarBorrador();
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
          error=> {
            console.log(error);
          }
        );
      }
    });
  }
}
