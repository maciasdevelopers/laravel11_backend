import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { DeudoresService } from '../../../../../../servicios/deudores.service';
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
  selector: 'fnzs_reportes_estado_movimientos_financieros_deudor',
  standalone: false,
  templateUrl: './est-movim-financ-deudor-component.html',
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
    './est-movim-financ-deudor-component.css',
  ]
})
export class EstadoMovimientosFinancierosDeudorComponent implements OnInit {
  public identidad: any;
  public name_deudor:string = "";
  objectDeudor = null;
  
  list_deudores_general:any = [];
  public token_deudor:string = "";
  public mov_deudor_periodo_inicio:string = "";
  public mov_deudor_periodo_fin:string = "";
  rangoPeriodoMovimientos: Date[] | undefined;
  deudorMovimientos:any = [];
  public movimientos_saldo_inicial:string = numeral("0.00").format('$0,0.00');
  public movimientos_deposito_deudor:string = numeral("0.00").format('$0,0.00');
  public movimientos_retiro_deudor:string = numeral("0.00").format('$0,0.00');
  public saldo_deudor:string = numeral("0.00").format('$0,0.00');
  public moneda_movimientos:string = "";
  @ViewChild('reporte_estado_cuent_deudor',{static: false}) el!: ElementRef;

  constructor(
    private sentinela: SentinelArkManager,
    public deudorServ:DeudoresService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private servXlsx: DescargaExcel,
    private readonly loaderServ:LoaderServService,
    private mov_finan:MovimientosFinancierosService
  ) { 
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.lista_deudores();
  }

  lista_deudores(){
    this.deudorServ.catalogoDeudoresGeneral('all_partidas','','').subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          //response.deudores.sort((a:any,b:any) => a.deu_titular.localeCompare(b.deu_titular));
          this.list_deudores_general = response.deudores;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectDeudor(deudr:any){
    var estMovFinanDeudor = document.getElementById("estMovFinanDeudor");
    const cDeudor = this.list_deudores_general.find((row: any) => row.token_cat_deudores === deudr.token_cat_deudores);
    this.token_deudor = typeof cDeudor !== 'undefined' ? cDeudor.token_cat_deudores : '';
    typeof cDeudor !== 'undefined' ? this.validator.correctoSelectBrowser(estMovFinanDeudor) : this.validator.errorSelectBrowser(estMovFinanDeudor);
  }

  seleccion_deudor_periodo() {
    var estMovFinanDeudorPeriodo = document.getElementById("estMovFinanDeudorPeriodo");
    if (this.rangoPeriodoMovimientos && this.rangoPeriodoMovimientos[1]) {
      const dateInicio = this.rangoPeriodoMovimientos[0];
      const dateFin = this.rangoPeriodoMovimientos[1];
      if (dateInicio && dateFin) {
        const periodo_inicio = dateInicio.toISOString().split('T')[0];
        const periodo_fin = dateFin.toISOString().split('T')[0];
        const validacionInicio = dateInicio && this.validator.filtroFecha(periodo_inicio);
        const validacionFin = dateFin && this.validator.filtroFecha(periodo_fin);
        if (validacionInicio && validacionFin) {
          this.validator.correctoInputRow(estMovFinanDeudorPeriodo);
          this.mov_deudor_periodo_inicio = periodo_inicio;
          this.mov_deudor_periodo_fin = periodo_fin;
        } else {
          this.validator.errorInputRow(estMovFinanDeudorPeriodo);
          this.mov_deudor_periodo_inicio = "";
          this.mov_deudor_periodo_fin = "";
        }
      } else {
        this.validator.errorInputRow(estMovFinanDeudorPeriodo);
        return;
      }
    } else {
      this.validator.errorInputRow(estMovFinanDeudorPeriodo);
      this.mov_deudor_periodo_inicio = "";
      this.mov_deudor_periodo_fin = "";
    }
  }

  get validaDeudorMovimPeriod():Boolean{
    const OKDeuTKN = this.token_deudor != '';
    const OKPeriodoInicio = this.mov_deudor_periodo_inicio != '';
    const OKPeriodoFin = this.mov_deudor_periodo_fin != '';
    return OKDeuTKN && OKPeriodoInicio && OKPeriodoFin;
  }

  verMovimientosDeudor(){
    this.mov_finan.listMovimFinanDeudor(this.token_deudor,this.mov_deudor_periodo_inicio,this.mov_deudor_periodo_fin).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          const cDeudor = this.list_deudores_general.find((row: any) => row.token_cat_deudores === this.token_deudor);
          this.name_deudor = cDeudor.nombre_comercial;
          
          this.movimientos_saldo_inicial = response.movimientos_saldo_inicial;
          this.movimientos_deposito_deudor = response.movimientos_deposito;
          this.movimientos_retiro_deudor = response.movimientos_retiro;
          this.saldo_deudor = response.saldo_final;
          
          this.deudorMovimientos = response.movimientos;
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
      documento.save('estado_de_cuenta_deudor.pdf');
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
      "Deudor",
      this.name_deudor,//Número de cuenta bancaria
      "",//Banco
      //Resumen de Saldo
      this.movimientos_saldo_inicial,//Saldo inicial
      this.movimientos_deposito_deudor,//Depósitos y adiciones
      this.movimientos_retiro_deudor,//Retiros y deducciones
      this.saldo_deudor,//Saldo final
      //movimientos
      this.deudorMovimientos, 
      //Totales
      this.movimientos_deposito_deudor,//Depósitos y adiciones
      this.movimientos_retiro_deudor,//Retiros y deducciones
      this.saldo_deudor,//Saldo final
      columnas, 
      'Estado de cuenta', 
      'estado_de_cuenta_deudor.xlsx'
    );
  }
}
