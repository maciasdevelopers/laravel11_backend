import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ServiciosService } from '../../../../../servicios/ssic/servicios.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { servicioAngularModelo } from '../../../../../modelos/servicioAngularModelo';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ClasificacionService } from '../../../../../servicios/ssic/clasificacion.service';
import { UniMedServService } from '../../../../../servicios/uni-med-serv.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { Table } from 'primeng/table';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-invent-serv-main',
  templateUrl: './servicios-main.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/switches.css',
    '../../inventarios.css',
    './servicios-main.component.css'
  ],
})
export class InventServiciosMainComponent implements OnInit {
  public usuario: Usuarios;
  public servicioModelo: servicioAngularModelo;
  public modelServ: servicioAngularModelo;
  public modelServBack: servicioAngularModelo;
  listaServClasificacion:any = [];
  catalogoUnidadesMedINVENT:any = [];

  listaGeneralServiciosTRUE:any = [];
  datosDetalleServCompras:any = [];
  datosDetalleServVentas:any = [];
  datosDetalleServMostrador:any = [];
  buscarSRVPrvVinc:any = [];
  buscarSRVPrvList:any = [];
  catalogoMonedasApi:any = [];

  catProvLista:any = [];
  catProvNewClaves:any = [];

  listaServiciosDeleted:any = [];

  viewServBitacora:boolean = false;
  arrayBitacoraServ:any = [];

  public viewSeccionServInventComprasReg:boolean = false;
  public viewSeccionServInventVentasReg:boolean = false;
  public viewSeccionServInventMostradorVentasReg:boolean = false;
  public data_moneda:string = "";
  public data_moneda_back:string = "";
  @ViewChild('servGralListaTRUE') table_serv_gral!: Table;
  infoForm: FormGroup;

  constructor(
    private translate:TranslateService,
    private _servicioServ:ServiciosService,
    public _clasifServ: ClasificacionService,
    public validator:ValidatorServService,
    public uni_med:UniMedServService,
    public _monedasServ: MonedasService,
    private relInterna:ComunicacionInternaService,
    private servXlsx:DescargaExcel,
    public _provServ: ProveedoresService,
    private fb: FormBuilder) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.servicioModelo = new servicioAngularModelo('','','L1IzLzhPMTFRSmhMeDMvY1E3ZnhkZz09OjoxMjM0NTY3ODEyMzQ1Njc4','','','ZG5IOHVYOU13QjlqaW1McmwvZ0E5Zz09OjoxMjM0NTY3ODEyMzQ1Njc4','',[],0.00,'','','');
    this.modelServ = new servicioAngularModelo('','','L1IzLzhPMTFRSmhMeDMvY1E3ZnhkZz09OjoxMjM0NTY3ODEyMzQ1Njc4','','','','',[],0.00,'','','');
    this.modelServBack = new servicioAngularModelo('','','L1IzLzhPMTFRSmhMeDMvY1E3ZnhkZz09OjoxMjM0NTY3ODEyMzQ1Njc4','','','','',[],0.00,'','','');

    this.infoForm = this.fb.group({
      serv_medida_unidad: [this.servicioModelo.unidad_medida_clave || null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaRegistroINVENT();
    this.getRespuestaServicioComprasVer();
    this.getRespuestaServicioVentasVer();
    this.getRespuestaServicioMostradorVer();

    this.listaGeneralServicios();
    this.listaEliminadosServicios();
    this.listaClasificacionServicios();
    this.unidadMedidaCatalogoGeneral();
    this.monedasCatalogoApi();
    this.buscarSRVPrvVinc = ['folio','rfc_prov','nombre','tiene_clave','eliminacion_proceso','token_serv_claves','encendido'];
    this.buscarSRVPrvList = ['folio','rfc_prov','nombre','encendido','token_cat_proveedores','tiene_clave','asigned_clave'];
  }

  verSeccionServiciosInventarioComprasReg(){
    this.viewSeccionServInventComprasReg = true;
  }

  verSeccionServiciosInventarioVentasReg(){
    this.viewSeccionServInventVentasReg = true;
  }

  verSeccionServiciosInventarioMostradorVentasReg(){
    this.viewSeccionServInventMostradorVentasReg = true;
  }

  getRespuestaRegistroINVENT(){
    this.relInterna.mensajeInsertServCompras$.subscribe(
      (mensaje:any) => {
        if (mensaje == "servicio registrado") {
          this.listaGeneralServicios();
          this.viewSeccionServInventComprasReg = false;
        }
      }
    );
  }

  getRespuestaServicioComprasVer(){
    this.relInterna.mensajeVerServCompras$.subscribe(
      (mensaje:any) => {
        console.log(mensaje)
        this.relInterna.token_cat_servicios_compras$.subscribe(
          (mensaje_serv:any) => {
            this.verServicioCompras(mensaje_serv);
          }
        );
      }
    );
  }

  getRespuestaServicioVentasVer(){
    this.relInterna.mensajeVerServVentas$.subscribe(
      (mensaje:any) => {
        console.log(mensaje)
        this.relInterna.token_cat_servicios_ventas$.subscribe(
          (mensaje_serv:any) => {
            this.verServicioVentasAll(mensaje_serv);
          }
        );
      }
    );
  }

  getRespuestaServicioMostradorVer(){
    this.relInterna.mensajeVerServMostrador$.subscribe(
      (mensaje:any) => {
        console.log(mensaje)
        this.relInterna.token_cat_servicios_mostrador$.subscribe(
          (mensaje_serv:any) => {
            this.verServicioVentasMostrador(mensaje_serv);
          }
        );
      }
    );
  }

  monedasCatalogoApi(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
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

  listaClasificacionServicios(){
    this._clasifServ.getGeneroClassifServ().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaServClasificacion = response.listClass;
          console.log(this.listaServClasificacion);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  unidadMedidaCatalogoGeneral(){
    this.uni_med.inventUnidadesMedidaCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogoUnidadesMedINVENT = response.listaUMedida;
          console.log(this.catalogoUnidadesMedINVENT);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyPressNumerico(objetoKeyPress:KeyboardEvent){
    this.validator.key_press_numbers_clave_sat(objetoKeyPress);
  }

  keypressProvServClave(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (this.validator.strFilter(clave) == false) {
      this.validator.deten(event);
    }
  }

  listaGeneralServicios(){
    this._servicioServ.serviciosCatalogoGeneral().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaGeneralServiciosTRUE = response.datosServicio;
          console.log(this.listaGeneralServiciosTRUE);
          this.arrayBitacoraServ = response.bitacora;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  descarga_excel_servicios(){
    const columnas:ExcelColumnas[] = [
      {label: "folio", field: "folio_sistema", align: "left"},
      {label: "servicio", field: "servicio", align: "left"},
      {label: "catalogo de sat", field: "catalogo_sat", align: "center"},
      {label: "Cuenta contable", field: "cuenta_contable", align: "center"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.listaGeneralServiciosTRUE,columnas,'Servicios','catálogo de servicios.xlsx');
  }

  verServicioCompras(token_cat_servicios:any){
    this._servicioServ.viewServEgresosVigentes(token_cat_servicios).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosServicio);
          this.datosDetalleServCompras = response.datosServicio;
          this.datosDetalleServCompras.forEach((row:any) => {
            this.servicioModelo.concepto = row.servicio;
            this.servicioModelo.clasificacion = row.clasificacion_token;
            this.servicioModelo.genero = row.genero_token;
            console.log(this.servicioModelo.genero);
            this.servicioModelo.unidad_medida_clave = row.unidad_medida_clave;

            this.infoForm.patchValue({serv_medida_unidad: row.unidad_medida_clave});
            //this.infoForm = this.fb.group({
            //  serv_medida_unidad: [this.modeloTrab.contratacion_tipo || null],
            //});
            
            this.servicioModelo.unidad_medida_homologada = row.unidad_medida_homologada;
            this.servicioModelo.clave_sat = row.sat_clave_code;
            this.servicioModelo.proveedor = row.proveedores;
            console.log(this.catProvLista);
          });
          this.llenarProvClavesNuevasList();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verServicioVentasAll(token_cat_servicios:any){
    this._servicioServ.viewServEgresosVigentes(token_cat_servicios).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosServicio);
          this.datosDetalleServVentas = response.datosServicio;
          this.datosDetalleServVentas.forEach((row:any) => {
            this.servicioModelo.concepto = row.servicio;
            this.servicioModelo.clasificacion = row.clasificacion_token;
            this.servicioModelo.genero = row.genero_token;
            console.log(this.servicioModelo.genero);
            this.servicioModelo.unidad_medida_clave = row.unidad_medida_clave;
            this.servicioModelo.unidad_medida_homologada = row.unidad_medida_homologada;
            this.servicioModelo.clave_sat = row.sat_clave_code;
            this.servicioModelo.proveedor = row.proveedores;
            console.log(this.catProvLista);
          });
          this.llenarProvClavesNuevasList();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  verServicioVentasMostrador(token_cat_servicios:any){
    this._servicioServ.InventariosCatalogosMostradorServicioPerfil(token_cat_servicios).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosServicio);
          this.datosDetalleServMostrador = response.datosServicio;
          this.modelServ.concepto = response.datosServicio[0]['servicio'];
          this.modelServ.fechaAlta = response.datosServicio[0]['fechaAlta'];
          this.modelServ.precio_aplicable = response.datosServicio[0]['precioBase'];          
          this.modelServ.unidad_medida_clave = response.datosServicio[0]['unidad_medida_clave'];
          this.modelServ.moneda_codigo = response.datosServicio[0]['moneda_clave_code'];
          this.modelServBack.moneda_codigo = response.datosServicio[0]['moneda_clave_code'];
          this.modelServBack.concepto = response.datosServicio[0]['servicio'];
          this.modelServBack.fechaAlta = response.datosServicio[0]['fechaAlta'];
          this.modelServBack.precio_aplicable = response.datosServicio[0]['precioBase'];
          this.modelServBack.unidad_medida_clave = response.datosServicio[0]['unidad_medida_clave'];

          const persona = this.catalogoMonedasApi.find((p:any) => p.code === 'MXN');
          this.data_moneda = persona.langEN;
          this.data_moneda_back = persona.langEN;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  conceptoKeyup(event:any){
    const r_content = this.datosDetalleServCompras[0];
    this.servicioModelo.concepto = event.value; 
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.servicioModelo.concepto != r_content["servicio"];
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.servicioValidate();
  }

  selectGeneroServ(event:any){
    const r_content = this.datosDetalleServCompras[0];
    this.servicioModelo.genero = event.value;
    let validacion = event.value != '' && this.servicioModelo.genero != r_content["genero_token"];
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
    //this.servicioValidate();
  }

  keyupUnidadMedidaSalidaApiServ(nombre:any){
    var selectedInfoUnidadMedidaSAT = document.getElementById("selectedInfoUnidadMedidaSAT");
    const indMed = this.catalogoUnidadesMedINVENT.find((row:any) => row.nombre == nombre);
    const validacion = nombre != "" && this.validator.filtroAlfaNumerico(nombre) == true && typeof indMed !== 'undefined'; 
    this.servicioModelo.unidad_medida_clave = validacion ? indMed.nombre : "";
    validacion ? this.validator.correctoSelectBrowser(selectedInfoUnidadMedidaSAT) : this.validator.errorSelectBrowser(selectedInfoUnidadMedidaSAT);
  }

  keyupSat(event:any){
    const r_content = this.datosDetalleServCompras[0];
    this.servicioModelo.clave_sat = event.value;
    let validacion = event.value != '' && this.validator.filtroNumericoSat(event.value) == true && (event.value.length == 7 || event.value.length == 8) && this.servicioModelo.clave_sat != r_content["sat_clave_code"];
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.servicioValidate();
  }

  llenarProvClavesNuevasList(){
    this.catProvNewClaves = [];
    this._provServ.catalogoProveedoresForProcesos().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.proveedores);
          this.catProvLista = response.proveedores;
          this.catProvLista.forEach((rowMax:any) => {
            let coinciden:any = this.servicioModelo.proveedor.find((rowMin:any) => rowMin.token_cat_proveedores === rowMax.token_cat_proveedores);
            if (!coinciden) {
              //console.log(rowMax)
              this.catProvNewClaves.push(rowMax);
            }
          });
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  habilitarClave_vinc(object:any,ident_serv_claves:any){
    const r_content = this.datosDetalleServCompras[0];
    const proveedores_list = r_content["proveedores"];
    proveedores_list.forEach((row:any) => {
      if (row.token_serv_claves == ident_serv_claves) {
        row.tiene_clave = object.checked == true ? 'true' : 'false';
        row.asigned_clave = object.checked == true ? row.asigned_clave_respaldo : '';
      }
    });
    //this.servicioValidate();
  }

  ediClav_asigVinc(object:any,ident_serv_claves:any){
    const r_content = this.datosDetalleServCompras[0];
    const proveedores_list = r_content["proveedores"];
    const indPrv = proveedores_list.findIndex((row:any) => row.token_serv_claves == ident_serv_claves);
    const prvfound = proveedores_list[indPrv];
    prvfound['asigned_clave'] = object.value;
    const validacion = object.value != '' && this.validator.filtroAlfaNumerico(object.value) == true && prvfound['asigned_clave'] != prvfound['asigned_clave_respaldo'];
    validacion ? this.validator.correctoInputRow(object) : this.validator.errorInputRow(object);
    //this.servicioValidate();
  }

  actionBotonVinc(object:any,ident_serv_claves:any){
    const r_content = this.datosDetalleServCompras[0];
    const proveedores_lista = r_content["proveedores"];
    const indprv = proveedores_lista.findIndex((row:any) => row.token_serv_claves == ident_serv_claves);
    const prvfound = proveedores_lista[indprv];
    prvfound['eliminacion_proceso'] = object.checked ? true : false;
    //this.servicioValidate();
  }

  apagar_encender(event:any,token_cat_proveedores:any){
    this.catProvNewClaves.forEach((rowMax:any) => {
      if (rowMax.token_cat_proveedores === token_cat_proveedores) {
        rowMax.encendido = event.checked == true ? true : false;
        rowMax.tiene_clave = 'false';
        rowMax.asigned_clave = '';
      }
    });
    //this.servicioValidate();
  }

  decideHabilitaClave(event:any,token_cat_proveedores:any){
    this.catProvNewClaves.forEach((rowMax:any) => {
      if (rowMax.token_cat_proveedores === token_cat_proveedores) {
        rowMax.tiene_clave = event.checked == true ? 'true' : 'false';
      }
    });
    console.log(token_cat_proveedores);
    //this.servicioValidate();
  }

  keyupProvServClave(event:any,token_cat_proveedores:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    const indPrv = this.catProvNewClaves.findIndex((row:any) => row.token_cat_proveedores == token_cat_proveedores);
    const prvfind = this.catProvNewClaves[indPrv];
    prvfind['asigned_clave'] = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.servicioValidate();
  }

  get servicioValidate():Boolean{
    const r_content = this.datosDetalleServCompras[0];
    //console.log(this.servicioModelo);
    let validacion_concepto = this.servicioModelo.concepto != '' && this.validator.filtroAlfaNumerico(this.servicioModelo.concepto) == true && this.servicioModelo.concepto != r_content["servicio"];
    let validacion_genero = this.servicioModelo.genero != '' && this.servicioModelo.genero != r_content["genero_token"];
    let validacion_unidad_medida_clave = this.servicioModelo.unidad_medida_clave != "" && this.validator.filtroAlfaNumerico(this.servicioModelo.unidad_medida_clave) == true && this.servicioModelo.unidad_medida_clave != r_content["unidad_medida_clave"];
    let validacion_clave_sat = this.servicioModelo.clave_sat != '' && this.validator.filtroNumericoSat(this.servicioModelo.clave_sat) == true && (this.servicioModelo.clave_sat.length == 7 || this.servicioModelo.clave_sat.length == 8) && this.servicioModelo.clave_sat != r_content["sat_clave_code"];
    //proveedores vinculados
    const proveedores_lista = r_content["proveedores"];
    let valida_prov_vinc_deletProcess = proveedores_lista.filter((row:any) => row.eliminacion_proceso == true);
    let valida_prov_vinc_hasClave = proveedores_lista.filter((row:any) => row.tiene_clave != row.tiene_clave_respaldo);
    let valida_prov_vinc_clav_asig = proveedores_lista.filter((row:any) => row.asigned_clave != row.asigned_clave_respaldo);
    //console.log(valida_prov_vinc_clav_asig);
    let valida_prov_vinc_general = valida_prov_vinc_deletProcess.length > 0 || valida_prov_vinc_hasClave.length > 0 || valida_prov_vinc_clav_asig.length > 0; 
    //proveedores no vinculados
    let validar_prov_new = this.catProvNewClaves.filter((row:any) => row.encendido == true);

    return validacion_concepto || validacion_genero || validacion_unidad_medida_clave || validacion_clave_sat || valida_prov_vinc_general || validar_prov_new.length > 0;
  }

  actualizaGeneralesServ(form:{reset:() => void;},token_cat_servicios:any):void{
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea actualizar este servicio?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        //alert(this.tokenServicioLink);
        const r_content = this.datosDetalleServCompras[0];
        const claveProvServ = this.catProvNewClaves.filter((row:any) => row.encendido == true).map((row:any) => ({token_cat_proveedores:row.token_cat_proveedores,encendido:row.encendido,tiene_clave:row.tiene_clave,clave:row.asigned_clave}));
        this._servicioServ.actualizaServCompras(token_cat_servicios,this.servicioModelo.concepto,this.servicioModelo.clasificacion,this.servicioModelo.genero,
          this.servicioModelo.clave_sat,
          this.servicioModelo.unidad_medida_clave,
          r_content["proveedores"],
          claveProvServ).subscribe(
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
              this.verServicioCompras(token_cat_servicios);
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

  conceptoMostradorKeyup(event:any){
    this.modelServBack.concepto = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && this.modelServBack.concepto != this.modelServ.concepto;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.servicioValidate();
  }

  keyupPrecioAplicableServ(event:any){
    this.modelServBack.precio_aplicable = event.value;
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true && this.modelServBack.precio_aplicable != this.modelServ.precio_aplicable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.servicioValidate();
  }

  keyupValidateMoneda(event:any){
    const monData = this.catalogoMonedasApi.find((row:any) => row.langEN === event.value || row.code === event.value);
    this.modelServBack.moneda_codigo = monData.code;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof monData !== 'undefined' && this.modelServBack.moneda_codigo != this.modelServ.moneda_codigo;
    validacion && monData ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelServBack.moneda_codigo);
    //this.servicioValidate();
  }

  keyupUnidadMedidaServMostrador(event:any){
    const indMed = this.catalogoUnidadesMedINVENT.find((row:any) => row.nombre == event.value);
    this.servicioModelo.unidad_medida_clave = indMed.nombre;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof indMed !== 'undefined' && this.modelServBack.unidad_medida_clave != this.modelServ.unidad_medida_clave; 
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    //this.servicioValidate();
    //this.servicioValidate();
  }

  get servicioMostradorValidate():Boolean{
    const validacion_concepto = this.modelServBack.concepto != '' && this.validator.filtroAlfaNumerico(this.modelServBack.concepto) == true && this.modelServBack.concepto != this.modelServ.concepto;
    const validacion_precio_aplicable = this.modelServBack.precio_aplicable != 0 && this.validator.filtroNum(this.modelServBack.precio_aplicable) == true && this.modelServBack.precio_aplicable != this.modelServ.precio_aplicable;
    const validacion_moneda_codigo = this.modelServBack.moneda_codigo != "" && this.validator.filtroAlfaNumerico(this.modelServBack.moneda_codigo) == true && this.modelServBack.moneda_codigo != this.modelServ.moneda_codigo;
    const validacion_unidad_medida_clave = this.modelServBack.unidad_medida_clave != "" && this.validator.filtroAlfaNumerico(this.modelServBack.unidad_medida_clave) == true && this.modelServBack.unidad_medida_clave != this.modelServ.unidad_medida_clave;

    return validacion_concepto || validacion_precio_aplicable || validacion_moneda_codigo || validacion_unidad_medida_clave;
  }


  actualizaServicioMostrador(form:{reset:() => void;},token_cat_servicios:any):void{
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
        //alert(this.tokenServicioLink);
        this._servicioServ.InventariosCatalogosMostradorServicioActualiza(token_cat_servicios,this.modelServBack.concepto,
          this.modelServBack.precio_aplicable,this.modelServBack.moneda_codigo,this.modelServBack.unidad_medida_clave).subscribe(
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
              this.listaGeneralServicios();
              this.verServicioCompras(token_cat_servicios);
              this.verServicioVentasAll(token_cat_servicios);
              this.verServicioVentasMostrador(token_cat_servicios);
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
      } else {

      }
    });
  }

  listaEliminadosServicios(){
    this._servicioServ.servEgresosEliminados().subscribe(
      response => {
        console.log(response)
        if (response.status == 'success') {
          this.listaServiciosDeleted = response.datosServicio;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  funcDeleteServEgr(token_cat_servicios:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este servicio?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        //alert(dattknprod);
        this._servicioServ.moveToPapServEgresos(token_cat_servicios).subscribe(
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
              this.listaGeneralServicios();
              this.listaEliminadosServicios();
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

  funcRestoreServEgr(token_cat_servicios:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar este servicio?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        //alert(dattknprod);
        this._servicioServ.restartServEgresos(token_cat_servicios).subscribe(
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
              this.listaGeneralServicios();
              this.listaEliminadosServicios();
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

  funcDeleteTotalServEgr(event:any,token_cat_servicios:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar definitivamente este servicio?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        //alert(dattknprod);
        this._servicioServ.deadPapServEgresos(token_cat_servicios).subscribe(
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
              this.listaGeneralServicios();
              this.listaEliminadosServicios();
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
}
