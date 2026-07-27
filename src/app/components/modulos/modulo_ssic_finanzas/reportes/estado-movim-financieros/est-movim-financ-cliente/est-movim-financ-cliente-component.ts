import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { ClientesService } from '../../../../../../servicios/ssic/clientes.service';
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
  selector: 'fnzs_reportes_estado_movimientos_financieros_cliente',
  standalone: false,
  templateUrl: './est-movim-financ-cliente-component.html',
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
    './est-movim-financ-cliente-component.css',
  ]
})
export class EstadoMovimientosFinancierosClienteComponent implements OnInit {
  public identidad: any;
  public name_cliente:string = "";
  objectCliente = null;
  
  catalogoClientes:any = [];
  public token_cliente:string = "";
  public mov_client_periodo_inicio:string = "";
  public mov_client_periodo_fin:string = "";
  rangoPeriodoMovimientos: Date[] | undefined;
  clienteMovimientos:any = [];
  public movimientos_saldo_inicial:string = numeral("0.00").format('$0,0.00');
  public movimientos_deposito_client:string = numeral("0.00").format('$0,0.00');
  public movimientos_retiro_client:string = numeral("0.00").format('$0,0.00');
  public saldo_client:string = numeral("0.00").format('$0,0.00');
  public moneda_movimientos:string = "";
  @ViewChild('reporte_estado_cuent_cliente',{static: false}) el!: ElementRef;

  constructor(
    private sentinela: SentinelArkManager,
    private clientServ: ClientesService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private servXlsx: DescargaExcel,
    private readonly loaderServ:LoaderServService,
    private mov_finan:MovimientosFinancierosService
  ) { 
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.lista_clientes();
    
  }

  lista_clientes(){
    this.clientServ.catalogoClientesGeneral('all_partidas','','').subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogoClientes = response.clientes;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectCliente(client_data:any){
    var estMovFinanCliente = document.getElementById("estMovFinanCliente");
    const client = this.catalogoClientes.find((row: any) => row.token_cat_clientes === client_data.token_cat_clientes);
    this.token_cliente = typeof client !== 'undefined' ? client.token_cat_clientes : '';
    typeof client !== 'undefined' ? this.validator.correctoSelectBrowser(estMovFinanCliente) : this.validator.errorSelectBrowser(estMovFinanCliente);
  }

  selecciona_cliente_periodo() {
    var estMovFinanClientePeriodo = document.getElementById("estMovFinanClientePeriodo");
    if (this.rangoPeriodoMovimientos && this.rangoPeriodoMovimientos[1]) {
      const dateInicio = this.rangoPeriodoMovimientos[0];
      const dateFin = this.rangoPeriodoMovimientos[1];
      if (dateInicio && dateFin) {
        const periodo_inicio = dateInicio.toISOString().split('T')[0];
        const periodo_fin = dateFin.toISOString().split('T')[0];
        const validacionInicio = dateInicio && this.validator.filtroFecha(periodo_inicio);
        const validacionFin = dateFin && this.validator.filtroFecha(periodo_fin);
        if (validacionInicio && validacionFin) {
          this.validator.correctoInputRow(estMovFinanClientePeriodo);
          this.mov_client_periodo_inicio = periodo_inicio;
          this.mov_client_periodo_fin = periodo_fin;
        } else {
          this.validator.errorInputRow(estMovFinanClientePeriodo);
          this.mov_client_periodo_inicio = "";
          this.mov_client_periodo_fin = "";
        }
      } else {
        this.validator.errorInputRow(estMovFinanClientePeriodo);
        return;
      }
    } else {
      this.validator.errorInputRow(estMovFinanClientePeriodo);
      this.mov_client_periodo_inicio = "";
      this.mov_client_periodo_fin = "";
    }
  }

  get validaClientMovimPeriod():Boolean{
    const OKClientTKN = this.token_cliente != '';
    const OKPeriodoInicio = this.mov_client_periodo_inicio != '';
    const OKPeriodoFin = this.mov_client_periodo_fin != '';
    return OKClientTKN && OKPeriodoInicio && OKPeriodoFin;
  }

  verMovimientosCliente(){
    this.mov_finan.listMovimFinanCliente(this.token_cliente,this.mov_client_periodo_inicio,this.mov_client_periodo_fin).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          const prv = this.catalogoClientes.find((row: any) => row.token_cat_clientes === this.token_cliente);
          this.name_cliente = prv.nombre_comercial;
          
          this.movimientos_saldo_inicial = response.movimientos_saldo_inicial;
          this.movimientos_deposito_client = response.movimientos_deposito;
          this.movimientos_retiro_client = response.movimientos_retiro;
          this.saldo_client = response.saldo_final;
          
          this.clienteMovimientos = response.movimientos;
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
      documento.save('estado_de_cuenta_cliente.pdf');
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
      "Cliente",
      this.name_cliente,//Número de cuenta bancaria
      "",//Banco
      //Resumen de Saldo
      this.movimientos_saldo_inicial,//Saldo inicial
      this.movimientos_deposito_client,//Depósitos y adiciones
      this.movimientos_retiro_client,//Retiros y deducciones
      this.saldo_client,//Saldo final
      //movimientos
      this.clienteMovimientos, 
      //Totales
      this.movimientos_deposito_client,//Depósitos y adiciones
      this.movimientos_retiro_client,//Retiros y deducciones
      this.saldo_client,//Saldo final
      columnas, 
      'Estado de cuenta', 
      'estado_de_cuenta_cliente.xlsx'
    );
  }
}


