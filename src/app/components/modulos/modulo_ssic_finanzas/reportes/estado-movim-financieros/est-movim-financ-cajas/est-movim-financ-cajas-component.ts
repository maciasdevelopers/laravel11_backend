import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import numeral from 'numeral';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { MovimientosFinancierosService } from '../../../../../../servicios/ssic/movimientos-financieros-service';
import { LoaderServService } from '../../../../../../servicios/ssic/loader-serv.service';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';

@Component({
  selector: 'fnzs_reportes_estado_movimientos_financieros_cajas',
  standalone: false,
  templateUrl: './est-movim-financ-cajas-component.html',
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
    './est-movim-financ-cajas-component.css',
  ]
})
export class EstadoMovimientosFinancierosCajasComponent implements OnInit {
  public identidad: any;
  public alias_caja:string = "";
  objectCaja = null;
  
  catalogoCajas:any = [];
  public token_caja:string = "";
  public mov_caja_periodo_inicio:string = "";
  public mov_caja_periodo_fin:string = "";
  rangoPeriodoMovimientos: Date[] | undefined;
  cajaMovimientos:any = [];
  public movimientos_saldo_inicial:string = numeral("0.00").format('$0,0.00');
  public movimientos_deposito_caja:string = numeral("0.00").format('$0,0.00');
  public movimientos_retiro_caja:string = numeral("0.00").format('$0,0.00');
  public saldo_caja:string = numeral("0.00").format('$0,0.00');
  public moneda_movimientos:string = "";
  @ViewChild('reporte_estado_cuent_caja',{static: false}) el!: ElementRef;

  constructor(
    private sentinela: SentinelArkManager,
    private cajaServ:CajaServService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private servXlsx: DescargaExcel,
    private readonly loaderServ:LoaderServService,
    private mov_finan:MovimientosFinancierosService
  ) { 
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.listadoCajas();
  }

  listadoCajas(){
    this.cajaServ.verListaCajas('all_partidas','','').subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogoCajas = response.caja;
          console.log(this.catalogoCajas);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  selectCaja(caja:any){
    console.log(caja);
    var estMovFinanCaja = document.getElementById("estMovFinanCaja");
    const fcaja = this.catalogoCajas.find((row: any) => row.token_caja === caja.token_caja);
    this.token_caja = typeof fcaja !== 'undefined' ? fcaja.token_caja : '';
    typeof fcaja !== 'undefined' ? this.validator.correctoSelectBrowser(estMovFinanCaja) : this.validator.errorSelectBrowser(estMovFinanCaja);
  }

  lista_estado_caja_periodo() {
    var estMovFinanPeriodoCaja = document.getElementById("estMovFinanPeriodoCaja");
    if (this.rangoPeriodoMovimientos && this.rangoPeriodoMovimientos[1]) {
      const dateInicio = this.rangoPeriodoMovimientos[0];
      const dateFin = this.rangoPeriodoMovimientos[1];
      if (dateInicio && dateFin) {
        const periodo_inicio = dateInicio.toISOString().split('T')[0];
        const periodo_fin = dateFin.toISOString().split('T')[0];
        const validacionInicio = dateInicio && this.validator.filtroFecha(periodo_inicio);
        const validacionFin = dateFin && this.validator.filtroFecha(periodo_fin);
        if (validacionInicio && validacionFin) {
          this.validator.correctoInputRow(estMovFinanPeriodoCaja);
          this.mov_caja_periodo_inicio = periodo_inicio;
          this.mov_caja_periodo_fin = periodo_fin;
        } else {
          this.validator.errorInputRow(estMovFinanPeriodoCaja);
          this.mov_caja_periodo_inicio = "";
          this.mov_caja_periodo_fin = "";
        }
      } else {
        this.validator.errorInputRow(estMovFinanPeriodoCaja);
        return;
      }
    } else {
      this.validator.errorInputRow(estMovFinanPeriodoCaja);
      this.mov_caja_periodo_inicio = "";
      this.mov_caja_periodo_fin = "";
    }
  }

  get validaCajaMovimPeriod():Boolean{
    const OKCaja = this.token_caja != '';
    const OKPeriodoInicio = this.mov_caja_periodo_inicio != '';
    const OKPeriodoFin = this.mov_caja_periodo_fin != '';
    return OKCaja && OKPeriodoInicio && OKPeriodoFin;
  }

  verMovimientosCaja(){
    this.mov_finan.listMovimFinanCaja(this.token_caja,this.mov_caja_periodo_inicio,this.mov_caja_periodo_fin).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          const fcaja = this.catalogoCajas.find((row: any) => row.token_caja === this.token_caja);
          this.alias_caja = fcaja.caja_folio+' '+fcaja.caja_alias;
          
          this.movimientos_saldo_inicial = response.movimientos_saldo_inicial;
          this.movimientos_deposito_caja = response.movimientos_deposito;
          this.movimientos_retiro_caja = response.movimientos_retiro;
          this.saldo_caja = response.saldo_final;
          
          this.cajaMovimientos = response.movimientos;
          this.moneda_movimientos = response.mov_moneda;
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  async descargarPdfEstadoCaja(){
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
      documento.save('estado_de_cuenta_caja.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      this.loaderServ.desaparecer();
    }
  }

  descargarExcelEstadoCuentaCaja(){
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
      "Caja",
      this.alias_caja,//Número de cuenta bancaria
      "",
      //Resumen de Saldo
      this.movimientos_saldo_inicial,//Saldo inicial
      this.movimientos_deposito_caja,//Depósitos y adiciones
      this.movimientos_retiro_caja,//Retiros y deducciones
      this.saldo_caja,//Saldo final
      //movimientos
      this.cajaMovimientos, 
      //Totales
      this.movimientos_deposito_caja,//Depósitos y adiciones
      this.movimientos_retiro_caja,//Retiros y deducciones
      this.saldo_caja,//Saldo final
      columnas, 
      'Estado de cuenta', 
      'estado_de_cuenta_cajas.xlsx'
    );
  }
}
