import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import numeral from 'numeral';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MovimientosFinancierosService } from '../../../../../../servicios/ssic/movimientos-financieros-service';
import { LoaderServService } from '../../../../../../servicios/ssic/loader-serv.service';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';

@Component({
  selector: 'fnzs_reportes_estado_movimientos_financieros_cuentas_bank',
  standalone: false,
  templateUrl: './est-movim-financ-cuenta-bank-component.html',
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
    '../../../finanzas.css',
    '../../estado-movim-financieros/estado-movimientos-financieros.component.css',
    './est-movim-financ-cuenta-bank-component.css',
  ]
  
})
export class EstadoMovimientosFinancierosCuentasBankComponent implements OnInit {
  public identidad: any;
  public name_cuenta_banc:string = "";
  public name_banc:string = "";
  objectCuentBanc = null;
  
  arrayCuentBanc:any = [];
  public token_cuenta_banc:string = "";
  public mov_cuenta_periodo_inicio:string = "";
  public mov_cuenta_periodo_fin:string = "";
  rangoPeriodoMovimientos: Date[] | undefined;
  cuentaBancariaMovimientos:any = [];
  public movimientos_saldo_inicial:string = numeral("0.00").format('$0,0.00');
  public movimientos_deposito_cuenta_banc:string = numeral("0.00").format('$0,0.00');
  public movimientos_retiro_cuenta_banc:string = numeral("0.00").format('$0,0.00');
  public saldo_cuenta_banc:string = numeral("0.00").format('$0,0.00');
  public moneda_movimientos:string = "";
  @ViewChild('reporte_estado_cuenta_cuentBank',{static: false}) el!: ElementRef;

  constructor(
    private sentinela: SentinelArkManager,
    private cuentaBan:CuentbancService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private servXlsx: DescargaExcel,
    private readonly loaderServ:LoaderServService,
    private mov_finan:MovimientosFinancierosService
  ) { 
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.recargaListaCuentaBancaria();
  }

  recargaListaCuentaBancaria(){
    this.cuentaBan.catCuentasBancariasCompras('all_partidas','','').subscribe(
      response =>{
        console.log(response);
        if (response.status == 'success') {
          this.arrayCuentBanc = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectCuentaBancaria(cuenta_banc:any){
    var estMovFinanCuenta = document.getElementById("estMovFinanCuenta");
    const cbank = this.arrayCuentBanc.find((row: any) => row.token_cuenta === cuenta_banc.token_cuenta);
    this.token_cuenta_banc = typeof cbank !== 'undefined' ? cbank.token_cuenta : '';
    typeof cbank !== 'undefined' ? this.validator.correctoSelectBrowser(estMovFinanCuenta) : this.validator.errorSelectBrowser(estMovFinanCuenta);
  }

  lista_estado_cuenta_periodo() {
    var estMovFinanPeriodo = document.getElementById("estMovFinanPeriodo");
    if (this.rangoPeriodoMovimientos && this.rangoPeriodoMovimientos[1]) {
      const dateInicio = this.rangoPeriodoMovimientos[0];
      const dateFin = this.rangoPeriodoMovimientos[1];
      if (dateInicio && dateFin) {
        const periodo_inicio = dateInicio.toISOString().split('T')[0];
        const periodo_fin = dateFin.toISOString().split('T')[0];
        const validacionInicio = dateInicio && this.validator.filtroFecha(periodo_inicio);
        const validacionFin = dateFin && this.validator.filtroFecha(periodo_fin);
        if (validacionInicio && validacionFin) {
          this.validator.correctoInputRow(estMovFinanPeriodo);
          this.mov_cuenta_periodo_inicio = periodo_inicio;
          this.mov_cuenta_periodo_fin = periodo_fin;
        } else {
          this.validator.errorInputRow(estMovFinanPeriodo);
          this.mov_cuenta_periodo_inicio = "";
          this.mov_cuenta_periodo_fin = "";
        }
      } else {
        this.validator.errorInputRow(estMovFinanPeriodo);
        return;
      }
    } else {
      this.validator.errorInputRow(estMovFinanPeriodo);
        this.mov_cuenta_periodo_inicio = "";
        this.mov_cuenta_periodo_fin = "";
    }
  }

  get validaCuentaMovimPeriod():Boolean{
    const OKCuenta = this.token_cuenta_banc != '';
    const OKPeriodoInicio = this.mov_cuenta_periodo_inicio != '';
    const OKPeriodoFin = this.mov_cuenta_periodo_fin != '';
    return OKCuenta && OKPeriodoInicio && OKPeriodoFin;
  }

  verMovimientosCuenta(){
    this.mov_finan.listMovimFinanCuentaBancaria(this.token_cuenta_banc,this.mov_cuenta_periodo_inicio,this.mov_cuenta_periodo_fin).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          const cuenta_banc = this.arrayCuentBanc.find((row: any) => row.token_cuenta === this.token_cuenta_banc);
          this.name_cuenta_banc = cuenta_banc.cuenta_bancaria;
          this.name_banc = cuenta_banc.banco_clave+" "+cuenta_banc.banco_nombre_comercial;
          
          this.movimientos_saldo_inicial = response.movimientos_saldo_inicial;
          this.movimientos_deposito_cuenta_banc = response.movimientos_deposito;
          this.movimientos_retiro_cuenta_banc = response.movimientos_retiro;
          this.saldo_cuenta_banc = response.saldo_final;
          
          this.cuentaBancariaMovimientos = response.movimientos;
          this.moneda_movimientos = response.mov_moneda;
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  async descargarPdfEstadoCuenta(){
    this.loaderServ.mostrar();
    await new Promise(resolve => setTimeout(resolve, 300));
    const pdf_data = this.el.nativeElement;
    try {
      // 1. Convertir el HTML a Canvas
      const canvas = await html2canvas(pdf_data,{
        scale:1.5,
        useCORS:true,
        logging:false,
        backgroundColor: '#ffffff'
      });

      //2.- Dimensiones
      const imgWidth = 210;// Ancho A4 en mm (dejando margen)
      const pageHeight = 297;//alto A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      //3. Crear el PDF con jsPDF
      const documento = new jsPDF('p','mm','a4')
      
      let heightLeft = imgHeight;
      let posicion = 0;
      
      const imgData = canvas.toDataURL('image/jpeg', 0.6);

      //4. Manejo de múltiples páginas
      documento.addImage(imgData, 'JPEG', 0, posicion, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
        posicion = heightLeft - imgHeight;
        documento.addPage();
        documento.addImage(imgData,'JPEG',0,posicion,imgWidth,imgHeight,undefined,'FAST');
        heightLeft -= pageHeight;
      }

      //5. Descarga
      documento.save('estado_de_cuenta_cbancaria.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      this.loaderServ.desaparecer();
    }
  }

  descargarExcelEstadoCuenta(){
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "folio_movimiento", align: "center" },
      { label: this.translate.instant("fecha_cont"), field: "fecha_movimiento_excel", align: "center" },
      { label: this.translate.instant("doc_ant"), field: "documento_anterior_asociado", align: "center" },
      { label: "Parte relacionada", field: "parte_relacionada", align: "left" },
      { label: "debe (+)", field: "mov_monto_debe_format", align: "right" },
      { label: "haber (-)", field: "mov_monto_haber_format", align: "right" },
      { label: "saldo (=)", field: "mov_monto_saldo_format", align: "right" }
    ];
    this.servXlsx.descarga_xlsx_documento_estado_cuenta(
      "Número de cuenta",
      this.name_cuenta_banc,//Número de cuenta bancaria
      this.name_banc,//Banco
      //Resumen de Saldo
      this.movimientos_saldo_inicial,//Saldo inicial
      this.movimientos_deposito_cuenta_banc,//Depósitos y adiciones
      this.movimientos_retiro_cuenta_banc,//Retiros y deducciones
      this.saldo_cuenta_banc,//Saldo final
      //movimientos
      this.cuentaBancariaMovimientos, 
      //Totales
      this.movimientos_deposito_cuenta_banc,//Depósitos y adiciones
      this.movimientos_retiro_cuenta_banc,//Retiros y deducciones
      this.saldo_cuenta_banc,//Saldo final
      columnas, 
      'Estado de cuenta', 
      'estado_de_cuenta_cbancaria.xlsx'
    );
  }
}