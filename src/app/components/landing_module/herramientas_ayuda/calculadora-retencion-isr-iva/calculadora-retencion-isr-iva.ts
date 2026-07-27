import { Component, OnInit } from '@angular/core';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { DocumentsService } from '../../../../servicios/documents.service';
import numeral from 'numeral';

@Component({
  selector: 'tools_calculadora_retencion_isr_iva',
  standalone: false,
  templateUrl: './calculadora-retencion-isr-iva.html',
  styleUrls: [
    '../../../../styles/landing.css',
    '../../../../styles/parallax.css',
    '../../../../styles/images.css',
    '../../../../styles/cards.css',
    '../../../../styles/input_group.css',
    '../../../../styles/switches.css',
    '../../../../styles/explain.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/page_landing_index.css',
    './calculadora-retencion-isr-iva.css'
  ],
})
export class CalculadoraRetencionIsrIva implements OnInit {
 arraydescargables:any = [];
  //retenciones a terceros
  public factor:number = 1;
  responseText = '';
  public seccionCalculo:string = '';
  //Calculo origen
    public calculo_retencionOrigen:string = '';
    public calculo_retencionEfectua_pago:string = '';
  //perfiles
    perfilesMain:any = [];
    perfilesCalculo:any = [];
    perfil_selected:string = 'nap';
  //decimales
    public retencion_decimales:string = '2';
  //IVA
    opcionesIVA = [
      { id: 1, name: '16%' },
      { id: 2, name: '8%' },
      { id: 3, name: '0%' },
      { id: 4, name: 'Exento'}
    ];
    ivaConfigurado: any;
    public iva_establecido_percent:number = 0.16;
    public iva_establecido_cant:number = 0.00;
    public iva_establecido_view:string = '';
    public estatusIVA:boolean = false;

  //Ley del IVA
    public retencion_iva_liva_percent:number = 0.00;//(100 / 3) * 2
    public retencion_iva_liva_cant:number = 0.00;
    public retencion_iva_liva_view:string = ''

  //ISR
    public retencion_isr_porcentaje = 0.0125;
    public retencion_isr:number = 0.00;
    public retencion_isr_view:string = '';
      
  //Importe 
    public retencion_importe:number = 0.00;
    public retencion_importe_view:string = '';
    
  //subtotal
    public retencion_subtotal:number = 0.00;
    public retencion_subtotal_view:string = '';

  //Total
    public retencion_total:number = 0.00;
    public retencion_total_view:string = '';

  constructor(
    private validator:ValidatorServService,
    private docs_serv:DocumentsService
  ) {
  }


  ngOnInit(): void {
    this.indexPerfil(); 
  }

  //Calculo Origen
    selecPersonaOrigen(event:any){
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && event.value.length == 4;
      this.calculo_retencionOrigen = validacion ? event.value : '';
      validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
      if (validacion) {
        let aplicantePF = this.perfilesMain.filter((row:any) => row.aplicante === "PF");
        let aplicantePM = this.perfilesMain.filter((row:any) => row.aplicante === "PM");
        switch (this.calculo_retencionOrigen) {
          case 'perf':
            this.perfilesCalculo = aplicantePF[0]['listado'];
            break;
          case 'perm':
            this.perfilesCalculo = aplicantePM[0]['listado'];
            break;
          default:
            this.perfilesCalculo = [];
            break;
        }
        console.log(this.perfilesCalculo);
      }
    }

    selecPersonaEfectuaPago(event:any){
      const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && event.value.length == 4;
      this.calculo_retencionEfectua_pago = validacion ? event.value : '';
      validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
      if (validacion) {
        let aplicante = this.calculo_retencionOrigen == 'perf' ? this.perfilesMain.filter((row:any) => row.aplicante === "PF") : this.perfilesMain.filter((row:any) => row.aplicante === "PM");
        switch (this.calculo_retencionEfectua_pago) {
          case 'perf':
            let efectuaPF = aplicante[0]['listado'].filter((row:any) => row.efectuaPF === true);
            this.perfilesCalculo = efectuaPF;
            break;
          case 'perm':
            let efectuaPM = aplicante[0]['listado'].filter((row:any) => row.efectuaPM === true);
            this.perfilesCalculo = efectuaPM;
            break;
          default:
            this.perfilesCalculo = [];
            break;
        }
        console.log(this.perfilesCalculo);
      }
    }

    get validatePersonasCalc():Boolean{
      const validacioncalculo_retencionOrigen = this.calculo_retencionOrigen != '' && this.validator.filtroAlfaNumerico(this.calculo_retencionOrigen) == true && this.calculo_retencionOrigen.length == 4;
      const validacioncalculo_retencionEfectua_pago = this.calculo_retencionEfectua_pago != '' && this.validator.filtroAlfaNumerico(this.calculo_retencionEfectua_pago) == true && this.calculo_retencionEfectua_pago.length == 4;
      return validacioncalculo_retencionOrigen && validacioncalculo_retencionEfectua_pago;
    } 

  //perfiles
    indexPerfil(){
      this.perfilesMain = [
        {aplicante: 'NP', name:'No Aplica', clave:'nap',explicacion:''},//PF -ISR: 20% -LIVA:
        {aplicante:"PF",
          listado:[
            {efectuaPF:true,efectuaPM:true,clave: 'ate', name: 'Adquisición o arrendamiento de bienes tangibles a residentes en el extranjero sin establecimiento permanente'},//PM -ISR: -LIVA: 100%
            {efectuaPF:true,efectuaPM:true,clave: 'pfg', name: 'Persona física general'},
          ]
        },
        {aplicante:"PM",
          listado:[
            {efectuaPF:true,efectuaPM:false,clave: 'hon', name: 'Honorarios'}, //PF -ISR: 10% -LVA: 2/3
            {efectuaPF:true,efectuaPM:false,clave: 'ari', name: 'Arrendamiento'},//PF -ISR: -LIVA: 2/3
            {efectuaPF:true,efectuaPM:false,clave: 'reg', name: 'RESICO'},//PF -ISR: 1.25-1.50-2% -LIVA:
            {efectuaPF:true,efectuaPM:false,clave: 'spe', name: 'Servicios profesionales de residentes en el extranjero'},//PF -ISR:25% -LIVA:
            {efectuaPF:true,efectuaPM:false,clave: 'com', name: 'Comisiones'},//PF -ISR: -LIVA: 2/3
            {efectuaPF:true,efectuaPM:true,clave: 'fts', name: 'Fletes'},//PM -ISR: -LIVA: 4%IMPt
            {efectuaPF:true,efectuaPM:false,clave: 'ade', name: 'Adquicición de desperdicios'},//PF -ISR: -LIVA: 100%
            {efectuaPF:true,efectuaPM:true,clave: 'ate', name: 'Adquisición o arrendamiento de bienes tangibles a residentes en el extranjero sin establecimiento permanente'},//PM -ISR: -LIVA: 100%
            {efectuaPF:true,efectuaPM:false,clave: 'sdp', name: 'Servicios digitales a traves de plataformas tecnológicas'},//PF -ISR: -LIVA: 50-100%
            {efectuaPF:true,efectuaPM:true,clave: 'pmg', name: 'Persona moral general'}
          ]
        },
      ]; 
      //console.log(this.perfilesMain);
    }

    perfilSeleccionado(objeto:any){
      $("#porcentajeISR_ID").prop("disabled",false);
      $("#retencionLIVA_ID").prop("disabled",false);
      const perfil = this.perfilesCalculo.find((row:any) => row.clave === objeto.value);
      const validacion = objeto.value != "" && this.validator.filtroAlfaNumerico(objeto.value) && typeof perfil !== 'undefined';
      console.log(perfil.name)
      this.perfil_selected = validacion ? perfil.clave : '';
      validacion ? this.validator.correctoSelectBrowser(objeto) : this.validator.errorSelectBrowser(objeto);
      this.retencion_isr_porcentaje = 0.0;
      $("#porcentajeISR_ID").val("0"); 
      this.retencion_iva_liva_percent = 0.0;   
      if (validacion) {
        switch (perfil.clave) {
          case 'nap':
            this.retencion_isr_porcentaje = 0.0; 
            this.retencion_iva_liva_percent = 0.0;
            $("#porcentajeISR_ID").val("0");
            this.calculoRetencionGeneral();
            break;
          case 'hon': //PF -ISR: 10% -LVA: 2/3 Honorarios
            this.retencion_isr_porcentaje = 0.10; 
            this.retencion_iva_liva_percent = 0.66;
            $("#porcentajeISR_ID").prop("disabled",true);
            $("#porcentajeISR_ID").val("10");
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          case 'ari': //ISR: 10% -LIVA: 2/3 Arrendamiento de inmuebles
            this.retencion_isr_porcentaje = 0.10; 
            this.retencion_iva_liva_percent = 0.66;
            $("#porcentajeISR_ID").prop("disabled",true);
            $("#porcentajeISR_ID").val("10");
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          case 'reg'://PF -ISR: 1.25-1.50-2% -LIVA RESICO
            this.retencion_isr_porcentaje = 0.0125; 
            $("#porcentajeISR_ID").prop("disabled",true);
            $("#porcentajeISR_ID").val("1.25");
            this.calculoRetencionGeneral();
            break;
          case 'spe': //PF -ISR:25% -LIVA: Servicios profesionales de residentes en el extranjero
            this.retencion_isr_porcentaje = 0.25; 
            $("#porcentajeISR_ID").prop("disabled",true);
            $("#porcentajeISR_ID").val("25");
            this.calculoRetencionGeneral();
            break;
          case 'com': //PF -ISR: -LIVA: 2/3 Comisiones
            this.retencion_iva_liva_percent = 0.66;
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          case 'fts': //PM -ISR: -LIVA: 4%IMPt Fletes
            this.retencion_iva_liva_percent = 0.04;
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          case 'ade': //PF -ISR: -LIVA: 100%
            this.retencion_iva_liva_percent = 1;
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          case 'ate': //PM -ISR: -LIVA: 100%
            this.retencion_iva_liva_percent = 1;
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          case 'sdp': //PF -ISR: -LIVA: 50-100%
          $("#retencionLIVA_ID").prop("disabled",false);
            this.retencion_iva_liva_percent = 0;
            break;
          case 'pfg': //PF -ISR: -LIVA: 50-100%
            this.retencion_iva_liva_percent = 0.00;
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          case 'pmg': //PF -ISR: -LIVA: 50-100%
            this.retencion_iva_liva_percent = 0.00;
            $("#retencionLIVA_ID").prop("disabled",true);
            this.calculoRetencionGeneral();
            break;
          default:
        break;
        }
      }
    }

  //Decimales
    validarRetencionDecimales(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
      this.retencion_decimales = validacion ? event.value : 0;
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  //IVA
    ivaPorcentaje(){
      var selectorIVA = document.getElementById("selectorIVA");
      console.log(this.ivaConfigurado.name);
      const validacion = this.ivaConfigurado.name != "" && ((this.ivaConfigurado.name.includes('%') && this.validator.filtroCuoPorc(this.ivaConfigurado.name) == true) || (this.ivaConfigurado.name <= 99 && this.validator.filtroAlfaNumerico(this.ivaConfigurado.name) == true) || this.ivaConfigurado.name == 'Exento');
      if (this.ivaConfigurado.name == 'Exento' || this.ivaConfigurado.name == '0%') {
        this.iva_establecido_percent = validacion ? 0 : 0;
      } else {
        this.iva_establecido_percent = validacion ? parseInt(this.ivaConfigurado.name) / 100 : 0;
      }
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(selectorIVA) : this.validator.errorInputRow(selectorIVA);
      this.estatusIVA = true;
    }

    validarRetencionIVA(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
      this.iva_establecido_cant = validacion ? event.value : 0;
      this.seccionCalculo = 'seccionIVA';
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  //Ley del IVA
    porcentajeLIVA(event:any){
      const validacion = event.value != "" && this.validator.filtroCosto(event.value);
      this.retencion_iva_liva_percent = validacion ? event.value : 0; //0.66;..(100 / 3) * 2
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    validarRetencionLIVA(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
      this.retencion_iva_liva_cant = validacion ? event.value : 0;
      this.seccionCalculo = 'seccionLIVA';
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  //ISR
    porcentajeISR(event:any){
      const actualizaV = parseFloat(event.value)
      const validacion = event.value != "" && this.validator.filtroCuoPorc(event.value) == true && event.value <= 99;
      this.retencion_isr_porcentaje = validacion ? actualizaV / 100 : 0;
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    validarRetencionISR(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
      this.retencion_isr = validacion ? event.value : 0;
      this.seccionCalculo = 'seccionISR';
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  //Importe
    validarRetencionImporte(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
      this.retencion_importe = validacion ? event.value : 0;
      this.seccionCalculo = 'importeUno';
      validacion ? this.calculoRetencionGeneral() : null;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

  //Total
    validarInversoImporte(event:any){
      const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
      this.retencion_total = validacion ? event.value : 0;
      this.seccionCalculo = 'importeInverso';
      validacion ? this.calculoRetencionGeneral() : 0;
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    formatNumerics(registro:any){
      if (typeof registro === 'string') {
        let limpiar =registro.replace(/,/g,'');
        let numero = parseFloat(limpiar);
        if (!isNaN(numero)) {
          registro = numero.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits: 2 });
        }
      }
    }

  calculoRetencionGeneral(){
    const factor_operacion_liva = 2 / 3; 
    let factor_redondeo = Math.pow(10,2);
    const importebyIVA = parseFloat(this.iva_establecido_cant.toString()) / parseFloat(this.iva_establecido_percent.toString());
    const percent = this.retencion_iva_liva_percent.toString();
    const calculos: { [key: string]: () => number } = {
      '0.66': () => this.iva_establecido_cant * (2 / 3),
      '0.04': () => this.retencion_importe * 0.04,
      '0.5':  () => this.iva_establecido_cant / 2,
      '1':    () => this.iva_establecido_cant
    };
    //this.retencion_iva_liva_cant = (calculos[percent]?.() ?? 0);
        
    switch (this.seccionCalculo) {
      case 'importeUno':
        //IVA
        this.iva_establecido_cant = (this.retencion_importe * this.iva_establecido_percent) * factor_redondeo / factor_redondeo;
        this.iva_establecido_view = numeral(this.iva_establecido_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //LIVA
        this.retencion_iva_liva_cant = (calculos[percent]?.() ?? 0);
        this.retencion_iva_liva_view = numeral(this.retencion_iva_liva_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        console.log(this.retencion_iva_liva_cant)
        //subtotal
        this.retencion_subtotal = parseFloat(this.retencion_importe.toString()) + parseFloat(this.iva_establecido_cant.toString());
        this.retencion_subtotal_view = numeral(this.retencion_subtotal).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //ISR
        this.retencion_isr = this.retencion_importe * this.retencion_isr_porcentaje;
        this.retencion_isr_view = numeral(this.retencion_isr).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //Total
        this.retencion_total = this.retencion_subtotal - this.retencion_isr - this.retencion_iva_liva_cant;
        this.retencion_total_view = numeral(this.retencion_total).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        console.log(this.retencion_total+" "+this.retencion_total_view);
        break;
      case 'seccionIVA':
        //importe
        this.retencion_importe = importebyIVA/this.iva_establecido_percent;
        this.retencion_importe_view = numeral(this.retencion_importe).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //LIVA
        this.retencion_iva_liva_cant = (calculos[percent]?.() ?? 0);
        this.retencion_iva_liva_view = numeral(this.retencion_iva_liva_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        console.log(this.retencion_iva_liva_cant)
        //subtotal
        this.retencion_subtotal = parseFloat(this.retencion_importe.toString()) + parseFloat(this.iva_establecido_cant.toString());
        this.retencion_subtotal_view = numeral(this.retencion_subtotal).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //ISR
        this.retencion_isr = this.retencion_importe * this.retencion_isr_porcentaje;
        this.retencion_isr_view = numeral(this.retencion_isr).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //Total
        this.retencion_total = this.retencion_subtotal - this.retencion_isr - this.retencion_iva_liva_cant;
        this.retencion_total_view = numeral(this.retencion_total).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        break;
      case 'seccionLIVA':
        //Importe
        if (this.retencion_iva_liva_percent == 0.04) {
          this.retencion_importe = this.retencion_iva_liva_cant / 0.04;
        } else if (this.retencion_iva_liva_percent == 0.5) {
          this.iva_establecido_cant = this.retencion_iva_liva_cant * 2;
          this.retencion_importe = this.iva_establecido_cant / this.iva_establecido_percent;
        } else if (this.retencion_iva_liva_percent == 0.66) {
          var calculo_inicial = this.retencion_iva_liva_cant / 2;
          this.iva_establecido_cant = calculo_inicial * 3;
          this.retencion_importe = this.iva_establecido_cant / this.iva_establecido_percent;
        } else if (this.retencion_iva_liva_percent == 1) {
          this.iva_establecido_cant = this.retencion_iva_liva_cant;
          this.retencion_importe = this.iva_establecido_cant / this.iva_establecido_percent;
        }
        this.retencion_importe_view = numeral(this.retencion_importe).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //IVA
        this.iva_establecido_cant = (this.retencion_importe * this.iva_establecido_percent) * factor_redondeo / factor_redondeo;
        this.iva_establecido_view = numeral(this.iva_establecido_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //subtotal
        this.retencion_subtotal = parseFloat(this.retencion_importe.toString()) + parseFloat(this.iva_establecido_cant.toString());
        this.retencion_subtotal_view = numeral(this.retencion_subtotal).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //ISR
        this.retencion_isr = this.retencion_importe * this.retencion_isr_porcentaje;
        this.retencion_isr_view = numeral(this.retencion_isr).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //Total
        this.retencion_total = this.retencion_subtotal - this.retencion_isr - this.retencion_iva_liva_cant;
        this.retencion_total_view = numeral(this.retencion_total).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        break;
      case 'seccionISR':
        //Importe
        this.retencion_importe = parseFloat(this.retencion_isr.toString())/ parseFloat(this.retencion_isr_porcentaje.toString());
        this.retencion_importe_view = numeral(this.retencion_importe).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //IVA
        this.iva_establecido_cant = (this.retencion_importe * this.iva_establecido_percent) * factor_redondeo / factor_redondeo;
        this.iva_establecido_view = numeral(this.iva_establecido_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //LIVA
        this.retencion_iva_liva_cant = (calculos[percent]?.() ?? 0);
        this.retencion_iva_liva_view = numeral(this.retencion_iva_liva_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //subtotal
        this.retencion_subtotal = parseFloat(this.retencion_importe.toString()) + parseFloat(this.iva_establecido_cant.toString());
        this.retencion_subtotal_view = numeral(this.retencion_subtotal).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //Total
        this.retencion_total = this.retencion_subtotal - this.retencion_isr - this.retencion_iva_liva_cant;
        this.retencion_total_view = numeral(this.retencion_total).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        break;
      case 'importeInverso':
        //Importe
        this.retencion_importe = parseFloat(this.retencion_total.toString()) / (parseFloat(this.iva_establecido_percent.toString()) - parseFloat(this.retencion_isr_porcentaje.toString()) + parseFloat(this.factor.toString()));
        this.retencion_importe_view = numeral(this.retencion_importe).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        console.log(this.retencion_total);
        console.log(this.iva_establecido_percent);
        console.log(this.retencion_isr_porcentaje);
        console.log(this.factor);
        //IVA
        this.iva_establecido_cant = (this.retencion_importe * this.iva_establecido_percent) * factor_redondeo / factor_redondeo;
        this.iva_establecido_view = numeral(this.iva_establecido_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //LIVA
        this.retencion_iva_liva_cant = (calculos[percent]?.() ?? 0);
        this.retencion_iva_liva_view = numeral(this.retencion_iva_liva_cant).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        console.log(this.retencion_iva_liva_cant)
        //subtotal
        this.retencion_subtotal = parseFloat(this.retencion_importe.toString()) + parseFloat(this.iva_establecido_cant.toString());
        this.retencion_subtotal_view = numeral(this.retencion_subtotal).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        //ISR
        this.retencion_isr = this.retencion_importe * this.retencion_isr_porcentaje;
        this.retencion_isr_view = numeral(this.retencion_isr).format('0,0.'+'0'.repeat(parseInt(this.retencion_decimales)));
        break;
      default:
        break;
    }
  }

  //PDF
    get activar_descargaPDF():Boolean{
      const validacion_retencion_importe = this.retencion_importe != 0 && this.validator.filtroNum(this.retencion_importe) == true;
      const validacion_retencion_subtotal = this.retencion_subtotal != 0 && this.validator.filtroNum(this.retencion_subtotal) == true;
      const validacion_total = this.retencion_total != 0 && this.validator.filtroNum(this.retencion_total) == true;

      const validacion_retencion_ISR = (this.retencion_isr_porcentaje != 0 && this.retencion_isr != 0 && this.validator.filtroNum(this.retencion_isr) == true) || this.retencion_isr_porcentaje == 0;
      const validacion_iva = (this.iva_establecido_percent != 0 && this.iva_establecido_cant != 0 && this.validator.filtroNum(this.iva_establecido_cant) == true) || this.iva_establecido_percent == 0;
      const validacion_LIVA = (this.retencion_iva_liva_percent != 0 && this.retencion_iva_liva_cant != 0 && this.validator.filtroNum(this.retencion_iva_liva_cant) == true) || this.retencion_iva_liva_percent == 0; 
      return validacion_retencion_importe && validacion_retencion_subtotal && validacion_retencion_ISR && validacion_total && validacion_iva && validacion_LIVA;
    }

    descarga_servis_PDF(){
      const perfil = this.perfilesCalculo.find((row:any) => row.clave === this.perfil_selected);
      var resultante_iva_establecido = (this.iva_establecido_percent * 100)+'%';
      this.docs_serv.retencionesPDF(
        this.retencion_decimales,
        perfil ? perfil.name : 'No Aplica', 
        perfil ? perfil.clave : 'nap',
        resultante_iva_establecido,
        this.retencion_iva_liva_percent == 0.00 ? 'No aplica' : (this.retencion_iva_liva_percent == 0.66 ? 'de 2/3 del IVA' : 'de 4% del Importe'),
        (this.retencion_isr_porcentaje *100)+'%',
        this.retencion_importe,
        this.iva_establecido_cant,
        this.retencion_iva_liva_cant,
        this.retencion_subtotal,
        this.retencion_isr,
        this.retencion_total).subscribe((data: Blob) => {
            // Crear un objeto Blob para el archivo PDF
            const blob = new Blob([data], { type: 'application/pdf' });
        
            // Crear una URL para el Blob
            const url = window.URL.createObjectURL(blob);
        
            // Crear un enlace dinámico para simular la descarga
            const a = document.createElement('a');
            a.href = url;
            a.download = 'calculo de retenciones.pdf';  // Nombre del archivo a descargar
            a.click();  // Simula el clic en el enlace para descargar
        
            // Liberar el objeto URL después de la descarga
            window.URL.revokeObjectURL(url);
          }, (error) => {
            console.error('Error al descargar el PDF:', error);
            // Puedes agregar un manejo de errores si es necesario
          }
        );
    }
}
