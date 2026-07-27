import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import { cajaAngularModelo } from '../../../../../../modelos/cajaAngularModelo';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { MonederoElectService } from '../../../../../../servicios/ssic/monedero-elect.service';
import { DispositivosServService } from '../../../../../../servicios/ssic/dispositivos-serv.service';
import { TranslateService } from '@ngx-translate/core';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { Table } from 'primeng/table';
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { EstablecimientosService } from '../../../../../../servicios/establecimientos';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-interno-tesoreria-catalogos',
  templateUrl: './tes_listacajas.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
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
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/navegador.css',
    '../../../finanzas.css',
    './tes_listacajas.component.css']
})
export class ListaCajasTesoreriaComponent implements OnInit, OnDestroy {
  public usuario:Usuarios;
  
  public caja_ver_form_reg:boolean = false;

  public caja:cajaAngularModelo;
  listaCajasRegistradas:any = [];
  indicador_cajas_registradas:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoCajasRegistradas: Date[] | undefined;
  formCaja!: FormGroup;

  caja_token_informacion:string = "";
  caja_informacion:any = [];
  public ver_ventana_caja_detalle:boolean = false;
  public ver_info_caja:boolean = false;
  arrayEstablecimientos:any = [];  
  arrayListRespons:any = [];
  catalogoMonedasApi:any = [];

  listaCajasEliminadas:any = [];
  public ver_ventana_cajas_deleted:boolean = false;

  private destruir$ = new Subject<void>();

  @ViewChild('btnStopVincAlm') btnStopVincAlm: ElementRef = {} as ElementRef;
  @ViewChild('btnDesvincAlmacen') btnDesvincAlmacen: ElementRef = {} as ElementRef;
  @ViewChild('divRows') divRows: ElementRef = {} as ElementRef;
  @ViewChild('tabListaDirAlmacen') tabListaDirAlmacen: ElementRef = {} as ElementRef;
  @ViewChild('tabListaResponsAlm') tabListaResponsAlm: ElementRef = {} as ElementRef;
  @ViewChild('divFormUpdateCaja') divFormUpdateCaja: ElementRef = {} as ElementRef;
  @ViewChild('listCajasTable') table_cajas!: Table;

  constructor(
    private monedasServ:MonedasService,
    private renderer:Renderer2,
    private cuentaBan:CuentbancService,
    private bancos:BancosServService,
    private cajaServ:CajaServService,
    private dirServ:DireccionesService,
    private employServ:EmpleadosService,
    private monedero:MonederoElectService,
    private dispositivo:DispositivosServService,
    private validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private translate:TranslateService,
    private servXlsx:DescargaExcel,
    private estabServ:EstablecimientosService,
    private encryptor:ServEncryptService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.caja = new cajaAngularModelo('','','','','','','',false,false,false,false,false,false,'');
    this.formCaja = this.fb.group({
      establecimiento: [this.caja.establecimiento_alias || null],
      moneda: [this.caja.moneda_code || null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaRegistro();
    this.listadoCajas('hoy');
    this.listadoDeletedCajas();
    this.listarEstablecimientos();
    this.getListaMonedasAPI();
    this.listaResponsableAlmacen("---");
  }

  cajaVerFormReg(){
    this.caja_ver_form_reg = true; 
  }

  getRespuestaRegistro(){
    this.relInterna.mensajeInsertCAJA$.subscribe(
      (mensaje:any) => {
        mensaje == "registro aprobado" ? this.recargar_listadoCajas() : null;
      }
    );
  }

  listarEstablecimientos(){
    this.estabServ.listaEstablecimientoscomplete().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayEstablecimientos = response.listaEstablecimientos;
          console.log(this.arrayEstablecimientos);
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  listaResponsableAlmacen(folio_establecimiento:any){
    if (folio_establecimiento != "---") {
      const estab = this.arrayEstablecimientos.find((row:any) => row.estab_folio === folio_establecimiento);
      this.employServ.listaResponsables(estab.token_establecimiento).subscribe(
        response => {
          console.log(response);
          if (response.status == 'success') {
            this.arrayListRespons = response.personal;
            //console.log(this.arrayListRespons);
          }
        },
        error =>{
          console.log(error);
        }
      ); 
    } else {
      this.employServ.catalogoGeneralTrabajadores().subscribe(
        response => {
          if (response.status == 'success') {
            this.arrayListRespons = response.empleados;
            console.log(this.arrayListRespons);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getListaMonedasAPI(){
    this.monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.catalogoMonedasApi = response.monedas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  recargar_listadoCajas() {
    this.listadoCajas(this.indicador_cajas_registradas);
  }

  listadoCajas(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicador_cajas_registradas = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var caja_list_otras_fechas = document.getElementById("caja_list_otras_fechas");
      if (this.rangoPeriodoCajasRegistradas && this.rangoPeriodoCajasRegistradas.length === 2) {
        const dateInicio = this.rangoPeriodoCajasRegistradas[0];
        const dateFin = this.rangoPeriodoCajasRegistradas[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(caja_list_otras_fechas);
          } else {
            this.validator.errorInputRow(caja_list_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(caja_list_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(caja_list_otras_fechas);
        return;
      }
    }

    this.cajaServ.verListaCajas(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaCajaList(response),
      error: (err) => this.manejarErrorCajaList(err)
    });
  }

  private procesarRespuestaCajaList(response: any) {
    if (response.status === 'success') {
      this.listaCajasRegistradas = response.caja;
      this.cd.detectChanges();
    } else {
      this.listaCajasRegistradas = [];
    }
  }

  private manejarErrorCajaList(error: any) {
    console.error('Error al cargar la lista de cajas:', error);
    this.listaCajasRegistradas = [];
  }

  descarga_excel_cajas(){ 
    const columnas:ExcelColumnas[] = [
			{label: "No. caja", field: "caja_folio", align: "center"},
			{label: "Alias", field: "caja_alias", align: "center"},
			{label: "Almacen (Alias)", field: "establecimiento", align: "right"}
    ];
    this.servXlsx.descarga_xlsx_documento(this.listaCajasRegistradas,columnas,'Cajas','catálogo de cajas.xlsx');
  }

  functViewCaja(token_caja:any){
    this.ver_info_caja = false;
    this.caja_token_informacion = "";
    this.caja_informacion = [];
    this.cajaServ.detalleCaja(token_caja).subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          console.log(response.caja);
          this.caja_informacion = response.caja;
          this.caja_informacion.forEach((row:any) => {
            console.log(row.token_caja);
            this.caja_token_informacion = row.token_caja;
            this.caja.descripcion = row.alias;
            this.caja.establecimiento_token = row.establecimiento_token;
            const estab = this.arrayEstablecimientos.find((estab:any) => estab.token_establecimiento === row.establecimiento_token);
            //this.caja.establecimiento_alias = estab.estab_folio+' '+estab.estab_alias;
            this.caja.establecimiento_alias = estab.estab_alias;
            console.log(this.caja.establecimiento_alias);
            //this.formCaja.patchValue({establecimiento: estab.estab_folio+' '+estab.estab_alias});
            this.formCaja.patchValue({establecimiento: estab.estab_alias});
            this.caja.vendedor = row.responsable;
            this.caja.moneda = row.moneda;
            
            const mon_data = this.catalogoMonedasApi.find((mon:any) => mon.code === row.moneda);
            this.caja.moneda_code = mon_data.code;
            this.formCaja.patchValue({moneda: mon_data.code});
            console.log(this.caja.moneda_code);

            this.caja.cuenta_contable = row.cuenta_contable;

            this.caja.servegresos = row.serv_egresos;
            this.caja.servingresos = row.serv_ingresos;
            this.caja.servpropias = row.serv_interno;
            this.caja.capt_cliente = row.capt_cliente;
            this.caja.capt_precio_x_articulo = row.capt_precio_x_articulo;
            this.caja.capt_primero_cantidad = row.capt_primero_cantidad;
          });
          this.ver_info_caja = true;
          this.ver_ventana_caja_detalle = true;
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  validaDescripcion(event:any){
    this.caja.descripcion = event.value;
    const caj_det = this.caja_informacion.find((row:any) => row.token_caja === this.caja_token_informacion);
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof caj_det !== 'undefined' && this.caja.descripcion != caj_det.alias;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validaEstablecimiento(estab_alias:any){
    var editEstabLista = document.getElementById("editEstabLista");
    const estab = this.arrayEstablecimientos.find((row:any) => row.estab_alias === estab_alias);
    const caj_det = this.caja_informacion.find((row:any) => row.token_caja === this.caja_token_informacion);

    this.caja.establecimiento_token = estab.token_establecimiento;
    const validacion = estab_alias != '' && this.validator.filtroAlfaNumerico(estab_alias) && typeof estab !== 'undefined' && typeof caj_det !== 'undefined' && this.caja.establecimiento_token != caj_det.establecimiento_token;
    validacion ? this.validator.correctoInputRow(editEstabLista) : this.validator.errorInputRow(editEstabLista);
    //console.log(event.value);
    //const estab = this.arrayEstablecimientos.find((row:any) => row.estab_folio === event.value);
    //const caj_det = this.caja_informacion.find((row:any) => row.token_caja === this.caja_token_informacion);
    //const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof estab !== 'undefined' && typeof caj_det !== 'undefined' && this.caja.establecimiento != caj_det.establecimiento_token;
    //validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.listaResponsableAlmacen(estab.token_establecimiento);
  }

  validaVendedor(event:any){
    this.caja.vendedor = event.value;
    const caj_det = this.caja_informacion.find((row:any) => row.token_caja === this.caja_token_informacion);
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && typeof caj_det !== 'undefined' && this.caja.vendedor != caj_det.responsable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.listaResponsableAlmacen(estab.token_establecimiento);
  }

  validaMonedaCaja(code:any){
    var selectedMonedaCode = document.getElementById("selectedMonedaCode");
    console.log(code);
    const caj_det = this.caja_informacion.find((row:any) => row.token_caja === this.caja_token_informacion);
    const mnd = this.catalogoMonedasApi.find((row: any) => row.code === code);
    this.caja.moneda = mnd.code;
    const validacion = code != '' && this.validator.filtroAlfaNumerico(code) == true && typeof mnd !== 'undefined' && typeof caj_det !== 'undefined' && this.caja.moneda != caj_det.moneda;
    validacion ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  validaCuentaContable(event:any){
    const caj_det = this.caja_informacion.find((row:any) => row.token_caja === this.caja_token_informacion);
    this.caja.cuenta_contable = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof caj_det !== 'undefined' && this.caja.cuenta_contable != caj_det.cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validaAreaServicioEgresos(event:any){
    this.caja.servegresos = event.checked ? true : false;
  }

  validaAreaServicioIngresos(event:any){
    this.caja.servingresos = event.checked ? true : false;
  }

  validaAreaServicioPropias(event:any){
    this.caja.servpropias = event.checked ? true : false;
  }

//Configuración para ventas
  validaVentasCaptCliente(event:any){
    this.caja.capt_cliente = event.checked ? true : false;
  }
  
  validaVentasCaptPrecioXArticulo(event:any){
    this.caja.capt_precio_x_articulo = event.checked ? true : false;
  }
  
  validaVentasCaptPrimeroCantidad(event:any){
    this.caja.capt_primero_cantidad = event.checked ? true : false;
  }

  get validaFormCaja():boolean{
    const caj_det = this.caja_informacion.find((row:any) => row.token_caja === this.caja_token_informacion);

    const validaDesc = this.caja.descripcion != '' && this.validator.filtroAlfaNumerico(this.caja.descripcion) == true && typeof caj_det !== 'undefined' && this.caja.descripcion != caj_det.alias;
    
    const estab = this.arrayEstablecimientos.find((row:any) => row.token_establecimiento === this.caja.establecimiento_token);
    const validaEstab = this.caja.establecimiento_token != '' && typeof estab !== 'undefined' && typeof caj_det !== 'undefined' && this.caja.establecimiento_token != caj_det.establecimiento_token;
    
    const vendedor = this.arrayListRespons.find((row:any) => row.token_empleado_vhum === this.caja.vendedor);
    const validaVendedor = this.caja.vendedor != '' && typeof vendedor !== 'undefined' && typeof caj_det !== 'undefined' && this.caja.vendedor != caj_det.responsable;
    
    const mon_data = this.catalogoMonedasApi.find((row:any) => row.code === this.caja.moneda); 
    const validaMoneda = this.caja.moneda != '' && typeof mon_data !== 'undefined' && typeof caj_det !== 'undefined' && this.caja.moneda != caj_det.moneda;

    const validaCContable = this.caja.cuenta_contable != '' && typeof mon_data !== 'undefined' && typeof caj_det !== 'undefined' && this.caja.cuenta_contable != caj_det.cuenta_contable;
    
    const validacion_serv_egresos = this.caja.servegresos != caj_det.serv_egresos;
    const validacion_serv_ingresos = this.caja.servingresos != caj_det.serv_ingresos;
    const validacion_serv_interno = this.caja.servpropias != caj_det.serv_interno;
    const validacion_capt_cliente = this.caja.capt_cliente != caj_det.capt_cliente;
    const validacion_capt_precio_x_articulo = this.caja.capt_precio_x_articulo != caj_det.capt_precio_x_articulo;
    const validacion_capt_primero_cantidad = this.caja.capt_primero_cantidad != caj_det.capt_primero_cantidad;

    return validaDesc || validaEstab || validaVendedor || validaMoneda || validaCContable || validacion_serv_egresos || validacion_serv_ingresos || validacion_serv_interno || validacion_capt_cliente || validacion_capt_precio_x_articulo || validacion_capt_primero_cantidad;
  }

  actualizaDataCaja(token_caja:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.ver_info_caja = false;
        this.cajaServ.updateCaja(this.caja,token_caja).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
              this.ver_info_caja = true;
              this.functViewCaja(token_caja);
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
            console.log(error);

          }
        )
      }
    });
  }

  functDelCaja(token_caja:any){
    //alert("funciona");
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
        this.cajaServ.deleteCaja(token_caja).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.recargar_listadoCajas();
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })

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
          error =>{
            console.log(error);
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: error,
              showConfirmButton: false,
              timer: 3000
            });
          }
        );
      }
    });
  }

  listadoDeletedCajas(){
    this.cajaServ.verListaDeleteCaja().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.listaCajasEliminadas = response.caja;
          console.log(this.listaCajasEliminadas);
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  verVentanaCajasEliminadas(){
    this.ver_ventana_cajas_deleted = true;
  }

  restauraCaja(token_caja:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar esta caja?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.cajaServ.restaurarCaja(token_caja).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.recargar_listadoCajas();
              this.listadoDeletedCajas();
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })

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
          error =>{
            console.log(error);
          }
        );
      }
    });
  }

  eliminapermCaja(token_caja:any){
    //alert("funciona");
     Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar permanentemente esta caja?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, aliminar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.cajaServ.deletePermCaja(token_caja).subscribe(
          response => {
            console.log(response.status);
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.recargar_listadoCajas();
              this.listadoDeletedCajas();
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })

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
          error =>{
            console.log(error);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
