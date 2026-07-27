import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { ProveedoresService } from '../../../../../../servicios/proveedores.service';
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
  selector: 'fnzs_reportes_estado_movimientos_financieros_proveedor',
  standalone: false,
  templateUrl: './est-movim-financ-proveedor-component.html',
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
    './est-movim-financ-proveedor-component.css',
  ]
})
export class EstadoMovimientosFinancierosProveedorComponent implements OnInit {
  public identidad: any;
  public name_proveedor:string = "";
  objectProveedor = null;
  
  catalogoProveedores:any = [];
  public token_proveedor:string = "";
  public mov_prov_periodo_inicio:string = "";
  public mov_prov_periodo_fin:string = "";
  rangoPeriodoMovimientos: Date[] | undefined;
  proveedorMovimientos:any = [];
  public movimientos_saldo_inicial:string = numeral("0.00").format('$0,0.00');
  public movimientos_deposito_prov:string = numeral("0.00").format('$0,0.00');
  public movimientos_retiro_prov:string = numeral("0.00").format('$0,0.00');
  public saldo_prov:string = numeral("0.00").format('$0,0.00');
  public moneda_movimientos:string = "";
  @ViewChild('reporte_estado_cuent_proveedor',{static: false}) el!: ElementRef;

  constructor(
    private sentinela: SentinelArkManager,
    private provServ: ProveedoresService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private servXlsx: DescargaExcel,
    private readonly loaderServ:LoaderServService,
    private mov_finan:MovimientosFinancierosService
  ) { 
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.lista_proveedores();
  }

  lista_proveedores() {
    this.provServ.catalogoProveedoresGeneral('all_partidas','','').subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          response.proveedores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
          this.catalogoProveedores = response.proveedores;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectProveedor(prov_data:any){
    var estMovFinanProveedor = document.getElementById("estMovFinanProveedor");
    const prv = this.catalogoProveedores.find((row: any) => row.token_cat_proveedores === prov_data.token_cat_proveedores);
    this.token_proveedor = typeof prv !== 'undefined' ? prv.token_cat_proveedores : '';
    typeof prv !== 'undefined' ? this.validator.correctoSelectBrowser(estMovFinanProveedor) : this.validator.errorSelectBrowser(estMovFinanProveedor);
  }

  selecciona_proveedor_periodo() {
    var estMovFinanProveedorPeriodo = document.getElementById("estMovFinanProveedorPeriodo");
    if (this.rangoPeriodoMovimientos && this.rangoPeriodoMovimientos[1]) {
      const dateInicio = this.rangoPeriodoMovimientos[0];
      const dateFin = this.rangoPeriodoMovimientos[1];
      if (dateInicio && dateFin) {
        const periodo_inicio = dateInicio.toISOString().split('T')[0];
        const periodo_fin = dateFin.toISOString().split('T')[0];
        const validacionInicio = dateInicio && this.validator.filtroFecha(periodo_inicio);
        const validacionFin = dateFin && this.validator.filtroFecha(periodo_fin);
        if (validacionInicio && validacionFin) {
          this.validator.correctoInputRow(estMovFinanProveedorPeriodo);
          this.mov_prov_periodo_inicio = periodo_inicio;
          this.mov_prov_periodo_fin = periodo_fin;
        } else {
          this.validator.errorInputRow(estMovFinanProveedorPeriodo);
          this.mov_prov_periodo_inicio = "";
          this.mov_prov_periodo_fin = "";
        }
      } else {
        this.validator.errorInputRow(estMovFinanProveedorPeriodo);
        return;
      }
    } else {
      this.validator.errorInputRow(estMovFinanProveedorPeriodo);
      this.mov_prov_periodo_inicio = "";
      this.mov_prov_periodo_fin = "";
    }
  }

  get validaProvMovimPeriod():Boolean{
    const OKProvTKN = this.token_proveedor != '';
    const OKPeriodoInicio = this.mov_prov_periodo_inicio != '';
    const OKPeriodoFin = this.mov_prov_periodo_fin != '';
    return OKProvTKN && OKPeriodoInicio && OKPeriodoFin;
  }

  verMovimientosProveedor(){
    this.mov_finan.listMovimFinanProveedor(this.token_proveedor,this.mov_prov_periodo_inicio,this.mov_prov_periodo_fin).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          const prv = this.catalogoProveedores.find((row: any) => row.token_cat_proveedores === this.token_proveedor);
          this.name_proveedor = prv.nombre_comercial;
          
          this.movimientos_saldo_inicial = response.movimientos_saldo_inicial;
          this.movimientos_deposito_prov = response.movimientos_deposito;
          this.movimientos_retiro_prov = response.movimientos_retiro;
          this.saldo_prov = response.saldo_final;
          
          this.proveedorMovimientos = response.movimientos;
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
      documento.save('estado_de_cuenta_proveedor.pdf');
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
      "Proveedor",
      this.name_proveedor,//Número de cuenta bancaria
      "",//Banco
      //Resumen de Saldo
      this.movimientos_saldo_inicial,//Saldo inicial
      this.movimientos_deposito_prov,//Depósitos y adiciones
      this.movimientos_retiro_prov,//Retiros y deducciones
      this.saldo_prov,//Saldo final
      //movimientos
      this.proveedorMovimientos, 
      //Totales
      this.movimientos_deposito_prov,//Depósitos y adiciones
      this.movimientos_retiro_prov,//Retiros y deducciones
      this.saldo_prov,//Saldo final
      columnas, 
      'Estado de cuenta', 
      'estado_de_cuenta_proveedor.xlsx'
    );
  }
}
