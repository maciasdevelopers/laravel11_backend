import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { productoAngularModelo } from '../../../../modelos/productoAngularModelo';
import { ClasificacionService } from '../../../../servicios/ssic/clasificacion.service';
import { UniMedServService } from '../../../../servicios/uni-med-serv.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ProveedoresService } from '../../../../servicios/proveedores.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ProductosService } from '../../../../servicios/ssic/productos.service';
import { MonedasService } from '../../../../servicios/monedas.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app_productos_inventarios_registro',
  standalone: false,
  templateUrl: './productos-inventarios-registro.component.html',
  styleUrls: [
    './productos-inventarios-registro.component.css',
    '../../../../styles/logotypo.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/explain.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/landing.css',
    '../../../../styles/div_explain.css',
    '../../../../styles/switches.css',
    '../../modulo_ssic_inventarios/inventarios.css',
  ],
  //imports: [ButtonModule, ToastModule, ConfirmPopupModule],
  providers: [ConfirmationService]
})
export class ProductosInventariosRegistroComponent implements OnInit {
  public modelProd: productoAngularModelo;
  public familiasProducto: any = [
    { clave: 'u_i', valor: 'Uso interno' },
    { clave: 'i_i', valor: 'Inventarios (uso interno)' },
    { clave: 'i_v', valor: 'Inventarios para ventas' },
    { clave: 'a_f', valor: 'Activos fijos' },
    { clave: 'a_i', valor: 'Activos intangibles' }
  ];
  public controlDeInventarios: any = [
    { clave: 'UEPS', valor: 'UEPS' },
    { clave: 'PEPS', valor: 'PEPS' }
  ];
  public costeoMetodos: any = [
    { clave: 'UEPS', valor: 'UEPS' },
    { clave: 'PEPS', valor: 'PEPS' },
    { clave: 'Promedio', valor: 'Promedio' }
  ];
  unidadMedidaCatalogoApi: any = [];
  catalogoMonedasApi: any = [];
  buscarCatProv: any = [];
  arrayCatProv: any = [];
  arrayClaveProvProd: any = [];

  arrayClasifProductos: any = [];
  public classProdAlta: string = "";
  selectedCountry: string | undefined;

  public arrayClassFullClass: string = '####-####-####';
  public btnVerFormulario: boolean = true;
  public boolValidacionStock: boolean = false;
  public btnAlmacenClasiff: boolean = false;
  listaCaracteristicasProd: any = [];
  public new_caract_clave: string = "";
  public new_caract_valor: string = "";
  listaClaveProd: any = [];
  public new_clave_registro: string = "";
  public new_clave_valor: string = "";

  public productosFiles: NgxFileDropEntry[] = [];
  public docsProdAnexos: any[] = [];
  public prodAnexosNames: any = [];

  public progressBarRegistro: boolean = false;
  @ViewChild('formAddProdCat') formAddProducto!: NgForm;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private relInterna: ComunicacionInternaService,
    private validator: ValidatorServService,
    private _medidasCat: UniMedServService,
    private translate: TranslateService,
    private _provServ: ProveedoresService,
    private _prodService: ProductosService,
    private _monedasServ: MonedasService,
    private _clasifServ: ClasificacionService) {
    this.modelProd = new productoAngularModelo('', '', '', '', '', '', '', '', '', 0, 0, '', '', '', '', '', '', '', false, false, false, '', 0, '', '', '', '', []);
  }

  ngOnInit(): void {
    if (this.arrayClasifProductos.length === 0) this.listarClasificacionProductos();
    if (this.unidadMedidaCatalogoApi.length === 0) this.catalogoUnidadDeMedidaApi();
    if (this.catalogoMonedasApi.length === 0) this.monedasCatalogoApi();
    if (this.arrayCatProv.length === 0) this.proveedores_lista();
    this.buscarCatProv = ['folio', 'rfc_prov', 'nombre', 'encendido', 'tiene_clave'];
  }

  listarClasificacionProductos() {
    this._clasifServ.getClassifProdCompleta().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayClasifProductos = response.categorias;
          console.log(this.arrayClasifProductos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  catalogoUnidadDeMedidaApi() {
    this._medidasCat.inventUnidadesMedidaEnabledCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listaUMedida);
          this.unidadMedidaCatalogoApi = response.listaUMedida;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedasCatalogoApi() {
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

  proveedores_lista() {
    this._provServ.catalogoProvedoresForClaves().subscribe(
      response => {
        this.arrayCatProv = response.status == 'success' ? response.proveedores : [];
      },
      error => {
        console.log(error);
      }
    );
  }

  keyupProdConcepto(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modelProd.concepto = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectFamiliaProd(clave: any) {
    var familiaProducto = document.getElementById("familiaProducto");
    let fam = this.familiasProducto.find((row: any) => row.clave == clave);
    const validacion = clave != '' && typeof fam !== 'undefined'; 
    this.modelProd.familia = validacion ? fam.clave : '';
    validacion ? this.validator.correctoSelectBrowser(familiaProducto) : this.validator.errorSelectBrowser(familiaProducto);
  }

  selectClassProd(opcion: any) {
    console.log(opcion.token_genero);
    var selectedCatProd = document.getElementById("selectedCatProd");
    let prd = this.arrayClasifProductos.find((row: any) => opcion.token_genero != '' && row.token_genero == opcion.token_genero);
    this.classProdAlta = typeof prd !== 'undefined' ? prd.clasificacion_token : '';
    this.modelProd.clasificacion = typeof prd !== 'undefined' ? prd.clasificacion_token : '';
    this.modelProd.genero = typeof prd !== 'undefined' ? prd.token_genero : '';
    typeof prd !== 'undefined' ? this.selectClasificacionCompleta() : null;
    typeof prd !== 'undefined' ? this.validator.correctoSelectBrowser(selectedCatProd) : this.validator.errorSelectBrowser(selectedCatProd);
  }

  selectClasificacionCompleta() {
    this._clasifServ.getClasificacionCompleta(this.classProdAlta, this.modelProd.genero).subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayClassFullClass = response.FullClass;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  keyupProdMarca(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modelProd.marca = validacion ? event.value : this.modelProd.marca = "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupStockMinProd(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
    this.modelProd.stock_min = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaStockProd();
  }

  keyupStockMaxProd(event: any) {
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
    this.modelProd.stock_max = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.validaStockProd();
  }

  validaStockProd() {
    var textStockmin = document.getElementById("textStockmin");
    var textStockmax = document.getElementById("textStockmax");
    console.log(this.modelProd.stock_min + " < " + this.modelProd.stock_max);
    const validacion = parseInt("" + this.modelProd.stock_min) > 0 && parseInt("" + this.modelProd.stock_max) > 0 && parseInt("" + this.modelProd.stock_max) > parseInt("" + this.modelProd.stock_min);
    this.boolValidacionStock = validacion ? true : false;
    validacion ? this.validator.correctoInputRow(textStockmin) : this.validator.errorInputRow(textStockmin);
    validacion ? this.validator.correctoInputRow(textStockmax) : this.validator.errorInputRow(textStockmax);
  }

  selectControlInventariosProd(clave: any) {
    var inventariosControlDe = document.getElementById("inventariosControlDe");
    let cti = this.controlDeInventarios.find((row: any) => row.clave == clave);
    const validacion = clave != '' && typeof cti !== 'undefined'; 
    this.modelProd.control_inventarios = validacion ? cti.clave : '';
    validacion ? this.validator.correctoSelectBrowser(inventariosControlDe) : this.validator.errorSelectBrowser(inventariosControlDe);
  }

  selectCosteoProd(clave: any) {
    var metodosDeCosteoList = document.getElementById("metodosDeCosteoList");
    let cost = this.costeoMetodos.find((row: any) => row.clave == clave);
    const validacion = clave != '' && typeof cost !== 'undefined'; 
    this.modelProd.costeo = validacion ? cost.clave : '';
    validacion ? this.validator.correctoSelectBrowser(metodosDeCosteoList) : this.validator.errorSelectBrowser(metodosDeCosteoList);
  }

  keyupUnidadMedidaEntradaApiProd(simbolo: any) {
    var unidadDeMedidaDeEntrada = document.getElementById("unidadDeMedidaDeEntrada");
    const medUni = this.unidadMedidaCatalogoApi.find((row: any) => row.simbolo === simbolo);//Unidad
    const validacion = simbolo != '' && typeof medUni !== 'undefined'; 
    this.modelProd.unidad_entrada_clave = validacion && medUni ? medUni.nombre : "";
    validacion ? this.validator.correctoSelectBrowser(unidadDeMedidaDeEntrada) : this.validator.errorSelectBrowser(unidadDeMedidaDeEntrada);
  }

  keyupUnidadMedidaSalidaApiProd(simbolo: any) {
    var unidadDeMedidaDeSalida = document.getElementById("unidadDeMedidaDeSalida");
    const medUni = this.unidadMedidaCatalogoApi.find((row: any) => row.simbolo === simbolo);//Unidad
    const validacion = simbolo != '' && typeof medUni !== 'undefined'; 
    this.modelProd.unidad_salida_clave = validacion && medUni ? medUni.nombre : "";
    validacion ? this.validator.correctoSelectBrowser(unidadDeMedidaDeSalida) : this.validator.errorSelectBrowser(unidadDeMedidaDeSalida);
  }

  keyupValidateMonedaApi(code:any){
    var monedasProducto = document.getElementById("monedasProducto");
    const mnd = this.catalogoMonedasApi.find((row: any) => row.code === code);
    const validacion = code != '' && this.validator.filtroAlfaNumerico(code) && typeof mnd !== 'undefined';
    this.modelProd.moneda_codigo = validacion ? mnd.code : '';
    validacion ? this.validator.correctoSelectBrowser(monedasProducto) : this.validator.errorSelectBrowser(monedasProducto);
  }

  keyupValidateCuentaContable(event: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modelProd.cuenta_contable = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modelProd.moneda_codigo);
  }

  checkUsoDestinoProducto(tipo_uso: any) {
    const validacion = tipo_uso != "" && this.validator.filtroAlfaNumerico(tipo_uso) == true;
    this.modelProd.uso_prod = validacion ? tipo_uso : '';
  }

  vincProductoToSerie(event: any) { this.modelProd.num_serie = event.checked == true ? true : false; }

  vincProductoToLote(event: any) { this.modelProd.num_lote = event.checked == true ? true : false; }

  vincProductoToPedimento(event: any) { this.modelProd.pedimentoAduanal = event.checked == true ? true : false; }

  checkNivelAlmProducto(tipo_uso: any) {
    const validacion = tipo_uso != "" && this.validator.filtroAlfaNumerico(tipo_uso) == true;
    this.modelProd.nivel_alm = validacion ? tipo_uso : '';
  }

  keyupSatApi(event: any) {
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true && (event.value.length == 7 || event.value.length == 8);
    this.modelProd.sat_clave_code = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCaracteristicasClave(event: any) {
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.new_caract_clave = validar ? event.value : "";
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCaracteristicasValor(event: any) {
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.new_caract_valor = validar ? event.value : "";
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  agregaCaracteristica() {
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
        var nclave_caract = document.getElementById("nClaveCaractAltaProdProv");
        var nvalor_caract = document.getElementById("nValorCaractAltaProdProv");
        this.listaCaracteristicasProd.push({ "clave_caract": this.new_caract_clave, "valor_caract": this.new_caract_valor });
        this.new_caract_clave = "";
        this.new_caract_valor = "";
        this.validator.limpiaInputRow(nclave_caract);
        this.validator.limpiaInputRow(nvalor_caract);
      }
    });
  }

  eliminaCaracteristica(position: any) {
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
        this.listaCaracteristicasProd.splice(position, 1);
      }
    });
  }

  keyupListaClaveInternaClaveNew(objetoTextClave: any) {
    const validar = objetoTextClave.value != '' && this.validator.filtroAlfaNumerico(objetoTextClave.value) == true;
    this.new_clave_registro = validar ? objetoTextClave.value : '';
    validar ? this.validator.correctoInputRow(objetoTextClave) : this.validator.errorInputRow(objetoTextClave);
  }

  keyupListaClaveInternaValorNew(objetoTextClave: any) {
    const validar = objetoTextClave.value != '' && this.validator.filtroAlfaNumerico(objetoTextClave.value) == true;
    this.new_clave_valor = validar ? objetoTextClave.value : '';
    validar ? this.validator.correctoInputRow(objetoTextClave) : this.validator.errorInputRow(objetoTextClave);
  }

  agregaClave() {
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
        var clave_nw = document.getElementById("claveNewAlta");
        var clave_Inter = document.getElementById("claveInterna");
        this.listaClaveProd.push({
          "clave_name": this.new_clave_registro,
          "valor_name": this.new_clave_valor
        });
        this.new_clave_registro = "";
        this.new_clave_valor = "";
        this.validator.limpiaInputRow(clave_nw);
        this.validator.limpiaInputRow(clave_Inter);
      }
    });
  }

  eliminaClave(position: any) {
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
        this.listaClaveProd.splice(position, 1);
      }
    });
  }

  apagar_encender(event: any, token_cat_proveedores: any) {
    const prov_row = this.arrayCatProv.find((row: any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.encendido = event.checked;
    prov_row.tiene_clave = event.checked ? 'false' : null;
    prov_row.asigned_clave = event.checked ? '' : null;
  }

  decideHabilitaClave(event: any, token_cat_proveedores: any) {
    const prov_row = this.arrayCatProv.find((row: any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.tiene_clave = event.checked == true ? 'true' : 'false';
  }

  keyupProvProdClave(event: any, token_cat_proveedores: any) {
    const validar = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    const prov_row = this.arrayCatProv.find((row: any) => row.token_cat_proveedores === token_cat_proveedores);
    prov_row.asigned_clave = validar ? event.value : '';
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(prov_row);
  }

  keypressProvProdClave(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (this.validator.strFilter(clave) == false) {
      this.validator.deten(event);
    }
  }

  public droppedProd(files: NgxFileDropEntry[]) {
    this.productosFiles = files;
    this.docsProdAnexos = [];
    this.prodAnexosNames = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsReemAnexos.push(file,droppedFile.relativePath);
          var nameFile = file.name;
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(file.type) == true) {
            this.prodAnexosNames.push({ "typoElement": this.validator.devuelveTipoArchivo(file.type), "nameFile": nameFile });
            this.docsProdAnexos.push(file);
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (this.validator.filtroTipoArchivo(file.type) == false) {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.productosFiles.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log("docsReemAnexos.length " + this.docsProdAnexos.length);
  }

  public fileOverProd(event: any) {
    console.log(event);
  }

  public fileLeaveProd(event: any) {
    console.log(event);
  }

  deleteAnexosProd(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_file_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.docsProdAnexos.splice(posicion, 1);
          this.productosFiles.splice(posicion, 1);
          console.log(this.docsProdAnexos.length);
        }
      }
    );
  }

  get validaRegistroProd(): boolean {
    //modelProd.concepto == '' || modelProd.familia == '' || modelProd.clasificacion == '' || modelProd.genero == '' || boolValidacionStock == false || modelProd.unidad_entrada_clave == '' || modelProd.unidad_salida_clave == ''
    return (
      this.modelProd.concepto != '' &&
      this.modelProd.familia != '' &&
      this.modelProd.clasificacion != '' &&
      this.modelProd.genero != '' &&
      //this.modelProd.stock_min != 0 &&
      //this.modelProd.stock_max != 0 &&
      this.modelProd.control_inventarios != '' &&
      this.modelProd.costeo != '' &&
      this.modelProd.unidad_entrada_clave != '' &&
      this.modelProd.unidad_salida_clave != '' &&
      this.modelProd.moneda_codigo != '' &&
      this.modelProd.nivel_alm != ''
    );
  }

  registraProducto(form: NgForm): void {
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
        this.btnVerFormulario = false;
        this.progressBarRegistro = true;
        const filterPrv = this.arrayCatProv.filter((row: any) => row.encendido === true);
        console.log(filterPrv);
        for (let i = 0; i < filterPrv.length; i++) {
          const proveedor = filterPrv[i];
          this.arrayClaveProvProd.push({
            "token_cat_proveedores": proveedor['token_cat_proveedores'],
            "encendido": proveedor['encendido'],
            "tiene_clave": proveedor['tiene_clave'],
            "clave": proveedor['asigned_clave']
          });
        }

        this._prodService.registraNewProducto(this.modelProd, this.listaCaracteristicasProd, this.listaClaveProd, this.arrayClaveProvProd, this.docsProdAnexos, this.prodAnexosNames
        ).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.progressBarRegistro = false;
              this.arrayClaveProvProd = [];
              this.proveedores_lista();
              this.btnVerFormulario = true;
              form.resetForm();
              //this.formAddProducto.resetForm();
              setTimeout(() => {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.relInterna.mensajeRegistroProdInvent("producto registrado");
              }, 3000);
            }
            if (response.status == 'error') {
              this.progressBarRegistro = false;
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton: false,
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
