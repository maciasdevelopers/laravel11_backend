import { Component,OnInit, Input, ElementRef, Renderer2, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { InterfPais } from '../../../../../../interfaces/interf-pais';
import { PaisService } from '../../../../../../servicios/ssic/pais.service';
import { ServiciosService } from '../../../../../../servicios/ssic/servicios.service';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { InterfUmedida } from '../../../../../../interfaces/interf-umedida';
import { UniMedServService } from '../../../../../../servicios/uni-med-serv.service';
import { DescuentosService } from '../../../../../../servicios/ssic/descuentos.service';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { PromocionesService } from '../../../../../../servicios/ssic/promociones.service';
import { CatSatServService } from '../../../../../../servicios/ssic/cat-sat-serv.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { DomSanitizer } from '@angular/platform-browser';
import { InterfPagoForma } from '../../../../../../interfaces/interf-pago-forma';
import { FormaPagoService } from '../../../../../../servicios/ssic/forma-pago.service';
import { ClientesService } from '../../../../../../servicios/ssic/clientes.service';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
// To use Html5Qrcode (more info below)
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
//import { parsePhoneNumber } from 'libphonenumber-js';
import { RegimenFiscalService } from '../../../../../../servicios/regimen-fiscal.service';
import { Subject, takeUntil } from 'rxjs';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';

@Component({
  selector: 'app-interno-ingresos-catalogos',
  templateUrl: './listaclientesingresos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/cards.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/div_busqueda.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/ubicaciones.css',
    '../../../ingresos.css',
    './listaclientesingresos.component.css']
})

export class ListaClientesIngresosComponent implements OnInit, OnDestroy {
  public usuario: Usuarios;
  searchTelefonos:any;
  searchEmails:any;
  searchDocs:any;
  arrayMonedas:any = [];
  arrayUmedida: InterfUmedida[] = [];
  arraYpais: InterfPais[] = [];
  arraycolonias:any = [];
  arraycpostales:any = [];

  public validateQRcodeCliente:boolean = false;
  list_clientes_general:any = [];
  indicador_clientes_general:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoClientesGeneral: Date[] | undefined;

  list_clientes_mx:any = [];
  indicador_clientes_mx:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoClientesMX: Date[] | undefined;

  list_clientes_ext:any = [];
  indicador_clientes_ext:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoClientesEXT: Date[] | undefined;

  detalleClienteArray:any = [];
  //contacto
    separateDialCode = false;
    CountryISO = CountryISO.Mexico;
    preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
    formPhone: FormGroup;
  public view_bool_deleted_catalogos:boolean = false;
  catClientEliminados:any = [];
  listaFormasCobroIn: InterfPagoForma[] = [];

  public imagenPerfilPdfFiscal:any;
  public imagenPerfilPdfEstCuenta:any;
  existingPhoneNumber: string = '+1234567890';
  @ViewChild('buscaClaveSat') buscaClaveSat: ElementRef = {} as ElementRef;

  public txtEtiquetaPersonal:string = "";
  public txtPhonePersonalAll:string = "";
  public txtPhoneExtPersonal:string = "";
  public txtMailPersonalClient_reg:string = "";

  public decideaceptcredito:boolean = false; 

  public decideformacobroDetail:boolean = false;
  public bool_valida_creditos:boolean = false;

  //ubicacion
  public cod_postal:string = "";
  //dipomex
  public dipomex_cod_postal_estado:string = "---";
  public dipomex_cod_postal_municipio:string = "---";
  public dipomex_cod_postal_cp:string = "---";
  public dipomex_cod_postal_colonias:any = [];
  public dipomex_cod_postal_colonia_vinculada:string = "";
  public validaCPNew:boolean = false;
  listnewdireccionNac:any = [];
  options = {};
  public validateDipoMexUbica:boolean = false;

  AllRegFisArray:any = [];
  PfAllRegFisArray:any = [];
  PmAllRegFisArray:any = [];

  nuevoRegistro = { apellidoPaterno: '', apellidoMaterno: '', nombres: '', area: '', cargo: '' };
  
  nuevo_contacto_form:any = [{"paterno":"","materno":"","nombre":"","area":"","cargo":"","emails":"","telefonos":""}]; 
  public personal_contacto_paterno:string = "";
  public personal_contacto_materno:string = "";
  public personal_contacto_nombres:string = "";
  public personal_contacto_area:string = "";
  public personal_contacto_cargo:string = "";
  public personal_contacto_email:string = "";
  personal_contacto_email_lista:any = []; 

  public personal_contacto_phone_etiqueta:string = "";
  public personal_contacto_phone_numero:string = "";
  public personal_contacto_phone_extension:string = "";
  personal_contacto_telefono_lista:any = []; 
  
  nuevoContactoPhone:string = "";
  nuevoContactoEmails:string = "";

  contactoSeleccionadoPhone:string = "";
  contactoSeleccionadoEmails:string = "";

  editUbicacionSeccion:string = "";

  private destruir$ = new Subject<void>();

  constructor(
    private renderer: Renderer2,
    private dirServ:DireccionesService,
    private _pais:PaisService,
    private _servicioServ:ServiciosService,
    private monedasServ: MonedasService,
    private _medidasServ: UniMedServService,
    private _descServ: DescuentosService,
    private _promoServ: PromocionesService,
    private _catSat: CatSatServService,
    private _fpago: FormaPagoService,
    private sanitizer:DomSanitizer,
    private translate:TranslateService,
    private _clientServ: ClientesService,
    private validator: ValidatorServService,
    private _monedasServ: MonedasService,
    private _regimen:RegimenFiscalService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
      this.formPhone = this.fb.group({
        phone: ['', [Validators.required]]
      });
    }

  ngOnInit(): void {
    this.verCatGeneralClientes('hoy');
    this.verMXClientes('hoy');
    this.verEXTClientes('hoy');
    this.listaClientesEliminados();
    this.listFormaCobro();
    this.listarMonedas();
    this.reg_fiscal_all();
    this.reg_fiscal_pf()
    this.reg_fiscal_pm();
  }

  reg_fiscal_all(){
    this._regimen.getAllRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.AllRegFisArray = data.listRegFisc;
      }
      console.log(this.AllRegFisArray);
    });
  }

  reg_fiscal_pf(){
    this._regimen.getPfRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PfAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PfAllRegFisArray);
    });
  }

  reg_fiscal_pm(){
    this._regimen.getPmRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PmAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PmAllRegFisArray);
      //
    });
  }

  listFormaCobro(){
    this._fpago.getformapago().subscribe((data:InterfPagoForma[]) => {
      this.listaFormasCobroIn = data;
      console.log(this.listaFormasCobroIn);
    })
  }

  listaGeneralClientes(){
    this.verCatGeneralClientes(this.indicador_clientes_general);
  }

  verCatGeneralClientes(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_clientes_general = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var client_gral_otras_fechas = document.getElementById("client_gral_otras_fechas");
      if (this.rangoPeriodoClientesGeneral && this.rangoPeriodoClientesGeneral.length === 2) {
        const dateInicio = this.rangoPeriodoClientesGeneral[0];
        const dateFin = this.rangoPeriodoClientesGeneral[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(client_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(client_gral_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(client_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(client_gral_otras_fechas);
        return;
      }
    }

    this._clientServ.catalogoClientesGeneral(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaGralClient(response),
      error: (err) => this.manejarErrorGralClient(err)
    });
  }

  private procesarRespuestaGralClient(response: any) {
    if (response.status === 'success') {
      response.clientes.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.list_clientes_general = response.clientes;
      console.log(this.list_clientes_general)
      this.cd.detectChanges();
    } else {
      this.list_clientes_general = [];
    }
  }

  private manejarErrorGralClient(error: any) {
    console.error('Error al cargar la lista de clientes:', error);
    this.list_clientes_general = [];
  }

  listaMXClientes(){
    this.verMXClientes(this.indicador_clientes_mx);
  }

  verMXClientes(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_clientes_mx = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var mx_client_otras_fechas = document.getElementById("mx_client_otras_fechas");
      if (this.rangoPeriodoClientesMX && this.rangoPeriodoClientesMX.length === 2) {
        const dateInicio = this.rangoPeriodoClientesMX[0];
        const dateFin = this.rangoPeriodoClientesMX[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(mx_client_otras_fechas);
          } else {
            this.validator.errorInputRow(mx_client_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(mx_client_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(mx_client_otras_fechas);
        return;
      }
    }

    this._clientServ.catalogoClientesMX(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaMXClientList(response),
      error: (err) => this.manejarErrorMXClientList(err)
    });
  }

  private procesarRespuestaMXClientList(response: any) {
    if (response.status === 'success') {
      response.clientes.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.list_clientes_mx = response.clientes;
      this.cd.detectChanges();
    } else {
      this.list_clientes_mx = [];
    }
  }

  private manejarErrorMXClientList(error: any) {
    console.error('Error al cargar la lista de clientes:', error);
    this.list_clientes_mx = [];
  }

  listaEXTClientes(){
    this.verEXTClientes(this.indicador_clientes_ext);
  }

  verEXTClientes(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_clientes_ext = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var ext_client_otras_fechas = document.getElementById("ext_client_otras_fechas");
      if (this.rangoPeriodoClientesEXT && this.rangoPeriodoClientesEXT.length === 2) {
        const dateInicio = this.rangoPeriodoClientesEXT[0];
        const dateFin = this.rangoPeriodoClientesEXT[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(ext_client_otras_fechas);
          } else {
            this.validator.errorInputRow(ext_client_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(ext_client_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(ext_client_otras_fechas);
        return;
      }
    }

    this._clientServ.catalogoClientesExtranjeros(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaEXTClientList(response),
      error: (err) => this.manejarErrorEXTClientList(err)
    });
  }

  private procesarRespuestaEXTClientList(response: any) {
    if (response.status === 'success') {
      response.clientes.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.list_clientes_ext = response.clientes;
      this.cd.detectChanges();
    } else {
      this.list_clientes_ext = [];
    }
  }

  private manejarErrorEXTClientList(error: any) {
    console.error('Error al cargar la lista de clientes:', error);
    this.list_clientes_ext = [];
  }

  buscarScannRfcCliente(){
    var cameraId:any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config:any = {fps:10,qrbox: { width: 250, height: 250 }};
    let codeQrstfiscal:any = new Html5QrcodeScanner("viewScannerQrRfcProv",config,false);
    codeQrstfiscal.render(this.scanYesRfcCliente,this.onScanErrorRfcCliente);
  }

  scanYesRfcCliente(decodedText:any, decodedResult:any) {
    let funciones:any = this;
    console.log(`Scan result: ${decodedText}`, decodedResult);
    this.validateQRcodeCliente = true;
    this._clientServ.getViewcliente(decodedText).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.detalleClienteArray = response.proveedor;
          this.imagenPerfilPdfFiscal = this.sanitizer.bypassSecurityTrustHtml(this.detalleClienteArray[0]['const_sit_fiscal']);
          this.imagenPerfilPdfEstCuenta = this.sanitizer.bypassSecurityTrustHtml(this.detalleClienteArray[0]['forma_cobro_preferencial'][0]['doc_estado_cuenta']);
          console.log(this.detalleClienteArray[0]['direccion_fiscal_vig'][0]['cod_postal']);
          this.dirServ.buscaColonias(this.detalleClienteArray[0]['direccion_fiscal_vig'][0]['cod_postal']).subscribe(
            response => {
              if (response.status == 'success') {
                console.log(response);
                this.arraycolonias = response.colonias;
              }
            },
            error => {
              console.log(error);
            }
          )
          console.log(this.detalleClienteArray[0]['arrayNombreProv'].length);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  onScanErrorRfcCliente(errorMessage:any) {console.log(`Code scan error = ${errorMessage}`);}

  functViewClienteData(token_cliente:any){
    const phoneUtil = PhoneNumberUtil.getInstance();
    const parsedPhone = phoneUtil.parseAndKeepRawInput(this.existingPhoneNumber);
    const formattedPhone = phoneUtil.format(parsedPhone, PhoneNumberFormat.E164);
    this.detalleClienteArray = [];
    this._clientServ.getViewcliente(token_cliente).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.datosCliente);
          this.detalleClienteArray = response.datosCliente;
          console.log(this.detalleClienteArray[0]['nombre_cliente_edit'].length);
          for (let a = 0; a < this.detalleClienteArray[0]["contacto_registrado"].length; a++) {
            const cont = this.detalleClienteArray[0]["contacto_registrado"][a];
            for (let b = 0; b < cont.telefonos.length; b++) {
              const tel = cont.telefonos[b];
              console.log(tel["telefono"]);
              tel["phoneForm"] = this.fb.group({phone: [formattedPhone, [Validators.required]]});
              tel["phoneForm"].get('phone')?.setValue(tel["telefono"]);
            }
          }

          this.detalleClienteArray[0]["tiene_contacto_registrado"] == true ? $("#decideinfocontacto").removeClass("noneView") : $("#decideinfocontacto").addClass("noneView");
          this.detalleClienteArray[0]["tieneCreditoAsignado"] == true ? $("#decidecredito").removeClass("noneView") : $("#decidecredito").addClass("noneView");
          this.detalleClienteArray[0]["forma_cobro_pref_tiene"] == true ? $("#decideformacobroDetail").removeClass("noneView") : $("#decideformacobroDetail").addClass("noneView");

          for (let a = 0; a < this.detalleClienteArray[0]["ubicaciones"].length; a++) {
            const ubica = this.detalleClienteArray[0]["ubicaciones"][a];
            if (ubica["adicional"] == "api") {
              this.dipomex_cod_postal_colonias.length = 0;
              this.dipomex_cod_postal_estado = "";
              this.dipomex_cod_postal_municipio = "";
              this.dipomex_cod_postal_cp = "";
              this.dipomex_cod_postal_colonia_vinculada = "";
              this.dirServ.postCodPostalDipomex(ubica["c_postal_edit"]).subscribe(
                response => {
                  if (response.status == "success") {
                    console.log(response.cod_postal);
                    this.dipomex_cod_postal_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
                    this.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
                    this.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
  
                    for (let b = 0; b < response.cod_postal["colonias"].length; b++) {
                      const col = response.cod_postal["colonias"][b];
                      if (col == ubica["colonia_edit"]) {
                        this.dipomex_cod_postal_colonia_vinculada = col;
                      }
                    }
  
                    this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
                    if (response.cod_postal["colonias"].length == 1) {
                      this.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
                      this.validateDipoMexUbica = true;
                    } else {
                      this.validateDipoMexUbica = false;
                    }
                  } else {
                    this.validateDipoMexUbica = false;
                    Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
                    if (response.message == "postal_empty") {
                      this.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
                      this.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
                      this.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
                    }
                  }
                },
                error => {
                  //console.log(error);
                }
              );
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  validaNewNombreClient(valor:any){
    let pos_cero = this.detalleClienteArray[0];
    pos_cero["nombre_cliente_edit"] = valor.value;
    if (valor.value != "" && valor.value.length >= 4 && this.validator.strFilter(valor.value) == true && valor.value != pos_cero.nombre_cliente) {
      this.validator.correctoInput(valor,"Nombre completo / razón social del cliente");
    } else {
      this.validator.errorInput(valor,"Ingresa nombre completo / razón social del cliente");
    }
  }

  validaNewRfcClient(event:any){
    console.log(event.value.length);
    let pos_cero = this.detalleClienteArray[0];
    if (pos_cero["subClasificacionSimple"] == "PF") {
      pos_cero["rfc_client_edit"] = event.value;
      if (event.value != "" && this.validator.filtroRFCGeneral(event.value) == true && event.value.length == 13 && event.value != pos_cero["rfc_client"]) {
        this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
      } else {
        this.validator.errorInput(event,"Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
      }
    }
    if (pos_cero["subClasificacionSimple"] == "PM") {
      pos_cero["rfc_client_edit"] = event.value;
      if (event.value != "" && this.validator.filtroRFCGeneral(event.value) == true && event.value.length == 12 && event.value != pos_cero["rfc_client"]) {
        this.validator.correctoInput(event,"Escriba su rfc con Homoclave");
      }
      else{
        this.validator.errorInput(event,"Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
      }
    }
  }

  validaNewTaxIdClient(event:any){
    let pos_cero = this.detalleClienteArray[0];
    pos_cero["tax_id_client_edit"] = event.value;
    if (event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value) == true && event.value != pos_cero["tax_id_client"]) {
      this.validator.correctoInput(event,"Escriba Tax ID del cliente");
    } else {
      this.validator.errorInput(event,"Tax ID del cliente no es correcto");
    }
  }

  keyupComercialName(event:any){
    let pos_cero = this.detalleClienteArray[0];
    pos_cero["nombre_comercial_edit"] = event.value;
    if (event.value != "" && this.validator.strFilEmp(event.value) == true && event.value != pos_cero["nombre_comercial"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  changeSitioWeb(event:any){
    let pos_cero = this.detalleClienteArray[0];
    pos_cero["sitio_web_edit"] = event.value;
    if (event.value != "" && this.validator.filtroUrl("https://"+event.value) == true && event.value != pos_cero["sitio_web"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  changeRegimenFiscal(event:any){
    let pos_cero = this.detalleClienteArray[0];
    if (event.value != "") {
      for (let i = 0; i < this.AllRegFisArray.length; i++) {
        const row = this.AllRegFisArray[i];
        if (row["token_regimen_fiscal"] == event.value) {
          pos_cero["regimen_fiscal_token_edit"] = row["token_regimen_fiscal"];
          if (pos_cero["regimen_fiscal_token_edit"] != pos_cero["regimen_fiscal_token"]) {
            this.validator.correctoSelectBrowser(event);
          } else {
            this.validator.errorSelectBrowser(event);            
          }
        }
      }
    } else {
      this.validator.errorSelectBrowser(event);
    }
  }

  validaGeneralesCliente(){
    let pos_client = this.detalleClienteArray[0];
    return (
      (pos_client["nombre_cliente_edit"] == '' || pos_client["nombre_cliente_edit"] == pos_client["nombre_cliente"]) &&
      (pos_client["rfc_client"] == pos_client["rfc_client_edit"]) && 
      (pos_client["id_tax_back"] == '' || pos_client["id_tax"] == pos_client["id_tax_back"]) &&
      (pos_client["nombre_comercial_edit"] == '' || pos_client["nombre_comercial_edit"] == pos_client["nombre_comercial"]) &&
      (pos_client["sitio_web_edit"] == '' || pos_client["sitio_web_edit"] == pos_client["sitio_web"]) &&
      (pos_client["regimen_fiscal_token_edit"] == '' || pos_client["regimen_fiscal_token_edit"] == pos_client["regimen_fiscal_token"])
    );
  }

  guardaNew_DataCliente(token_cliente:any,clasificacion:any,subClasificacion:any,rfc_client:any,tax_id_client:any,nombre_cliente_edit:any,nombre_comercial_edit:any,sitio_web_edit:any,regimen_fiscal_token_edit:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._clientServ.updateGeneralesCliente(token_cliente,clasificacion,subClasificacion,rfc_client,tax_id_client,nombre_cliente_edit,nombre_comercial_edit,sitio_web_edit,regimen_fiscal_token_edit).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        )
      }
    })  
  }

  decideocupaContacto(event:any){
    event.checked == true ? $("#decideinfocontacto").removeClass("noneView") : $("#decideinfocontacto").addClass("noneView");
    this.detalleClienteArray[0]["tiene_contacto_registrado_edit"] = event.checked == true ? true : false;
  }

  keyupPersNewContPaterno(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.personal_contacto_paterno = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_paterno = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContMaterno(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.personal_contacto_materno = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_materno = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContNombres(event:any){
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3) {
      this.personal_contacto_nombres = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_nombres = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContArea(event:any){
    if (event.value != '' && this.validator.strFilEmp(event.value) == true) {
      this.personal_contacto_area = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_area = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContCargo(event:any){
    if (event.value != '' && this.validator.strFilEmp(event.value) == true) {
      this.personal_contacto_cargo = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_cargo = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContEmail(event:any){
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
      this.personal_contacto_email = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_email = "";
      this.validator.errorInputRow(event);
    }
  }

  addMailNewContacto(){
    var contPersEmail:any = document.getElementById("contPersClientNewEmail");
    if (this.personal_contacto_email != '' && this.validator.filtroCorreo(this.personal_contacto_email) == true) {
      this.personal_contacto_email_lista.push(this.personal_contacto_email);
      console.log(this.personal_contacto_email_lista);
      this.personal_contacto_email = '';
      this.validator.limpiaInputRow(contPersEmail);
      this.validaMailTelContacto();
    } else {
      this.validator.errorInputRow(contPersEmail);
      this.validaMailTelContacto();
    }
  }

  deleteMailNewContacto(position:any) {
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
        this.personal_contacto_email_lista.splice(position,1);
        if (this.personal_contacto_email_lista.length == 0) {
          this.validaMailTelContacto();
        }
      }
    });
  }

  contNewTelefonoTipoChange(event:any){
    this.personal_contacto_phone_etiqueta = event.value != '' && this.validator.filtroAlfaNumerico(event.value) ? event.value : "";
  }

  probarNewTextPhone(){
    if (this.formPhone.valid) {
      const phoneNumber = this.formPhone.get('phone')?.value;
      console.log('Número de teléfono registrado:',phoneNumber);
    }
  }

  contNewTelefonoNumero(event:any){
    if (event.value != "" && event.value.length >= 5 && this.validator.filtroPhone(event.value) == true && this.formPhone.valid) {
      const phoneNumber = this.formPhone.get('phone')?.value;
      this.validator.correctoInputRow(event);
      this.personal_contacto_phone_numero = phoneNumber;
      console.log(this.personal_contacto_phone_numero);
    } else {
      this.personal_contacto_phone_numero = "";
      this.validator.errorInputRow(event);
    }
  }

  contNewTelefonoExtension(event:any){
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.personal_contacto_phone_extension = event.value;
    } else {
      this.personal_contacto_phone_extension = "";
      this.validator.errorInputRow(event);
    }
  }

  addPhoneNewContacto() {
    var etiquetaCont_regClient:any = document.getElementById("etiquetaNewCont_regClient");
    var txtTelefonoCont_reg:any = document.getElementById("txtTelefonoNewCont_regClient");
    var txtExtension_reg:any = document.getElementById("txtExtensionNewCont_regClient");
    if ((this.personal_contacto_phone_etiqueta != '' && this.validator.strFilter(this.personal_contacto_phone_etiqueta) == true) && this.personal_contacto_phone_numero != '') {
      this.validaMailTelContacto();
      if ((this.personal_contacto_phone_extension == '') || (this.personal_contacto_phone_extension != '' && this.personal_contacto_phone_extension.length >= 1 && this.validator.filtroNum(this.personal_contacto_phone_extension) == true)) {
        this.personal_contacto_telefono_lista.push({
          "etiqueta":this.personal_contacto_phone_etiqueta,
          "telefono_complete":this.personal_contacto_phone_numero,
          "extension":this.personal_contacto_phone_extension,
        });
        this.personal_contacto_phone_etiqueta = '';
        this.personal_contacto_phone_numero = '';
        this.personal_contacto_phone_extension = '';
        this.validator.limpiaSelect(etiquetaCont_regClient);
        this.validator.limpiaInputRow(txtTelefonoCont_reg);
        this.validator.limpiaInputRow(txtExtension_reg);
      } else {
        this.validator.errorInputRow(txtExtension_reg);
      }
      console.log(this.personal_contacto_telefono_lista);
    } else {
      this.validaMailTelContacto();
      //M.toast({html: "Complete los campos vacios", classes: 'rounded'});
      if(this.personal_contacto_phone_etiqueta == '' || this.validator.strFilter(this.personal_contacto_phone_etiqueta) == false){
        this.validator.errorInputRow(etiquetaCont_regClient);
      }
      if(this.personal_contacto_phone_numero == ''){
        this.validator.errorInputRow(txtTelefonoCont_reg);
      }
    }
  }

  deleteNewPhoneContacto(position:any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.personal_contacto_telefono_lista.splice(position,1);
        if (this.personal_contacto_telefono_lista.length == 0) {
          this.validaMailTelContacto();
        }
      }
    });
  }

  enableBtnContacto(){
    return (
      (this.personal_contacto_paterno != '' && this.validator.strFilter(this.personal_contacto_paterno) == true && this.personal_contacto_paterno.length >= 4) &&
      (this.personal_contacto_materno != '' && this.validator.strFilter(this.personal_contacto_materno) == true && this.personal_contacto_materno.length >= 4) &&
      (this.personal_contacto_nombres != '' && this.validator.strFilter(this.personal_contacto_nombres) == true && this.personal_contacto_nombres.length >= 3) &&
      (this.personal_contacto_area != '' && this.validator.strFilter(this.personal_contacto_area) == true && this.personal_contacto_area.length >= 5) &&
      (this.personal_contacto_cargo != '' && this.validator.strFilter(this.personal_contacto_cargo) == true && this.personal_contacto_cargo.length >= 5) &&
      (this.personal_contacto_email_lista.length > 0 || this.personal_contacto_telefono_lista.length > 0)
    );
  }

  validaMailTelContacto(){
    if (this.personal_contacto_email_lista.length > 0 && this.personal_contacto_telefono_lista.length > 0) {
      $("#btnModalPersMailTelMain").removeClass("btnError");
    } else {
      $("#btnModalPersMailTelMain").addClass("btnError");
    }
  }

  registraNuevoContacto(token_cliente:any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea agregar este personal de contacto?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        if ((this.personal_contacto_paterno != '' && this.validator.strFilter(this.personal_contacto_paterno) == true && this.personal_contacto_paterno.length >= 4) &&
          (this.personal_contacto_materno != '' && this.validator.strFilter(this.personal_contacto_materno) == true && this.personal_contacto_materno.length >= 4) &&
          (this.personal_contacto_nombres != '' && this.validator.strFilter(this.personal_contacto_nombres) == true && this.personal_contacto_nombres.length >= 3) &&
          (this.personal_contacto_area != '' && this.validator.strFilter(this.personal_contacto_area) == true && this.personal_contacto_area.length >= 5) &&
          (this.personal_contacto_cargo != '' && this.validator.strFilter(this.personal_contacto_cargo) == true && this.personal_contacto_cargo.length >= 5) &&
          (this.personal_contacto_email_lista.length != 0 || this.personal_contacto_telefono_lista.length != 0)) {
          
          this._clientServ.registraNuevoContactoCliente(
            token_cliente,
            this.personal_contacto_paterno,
            this.personal_contacto_materno,
            this.personal_contacto_nombres,
            this.personal_contacto_area,
            this.personal_contacto_cargo,
            this.personal_contacto_email_lista,
            this.personal_contacto_telefono_lista).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                Swal.fire({
                  position:"center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.listaGeneralClientes();
                this.listaMXClientes();
                this.listaEXTClientes();
                this.functViewClienteData(token_cliente);

                this.personal_contacto_paterno = "";
                this.personal_contacto_materno = "";
                this.personal_contacto_nombres = "";
                this.personal_contacto_area = "";
                this.personal_contacto_cargo = "";
                this.personal_contacto_email_lista = []; 
                this.personal_contacto_telefono_lista = [];
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {console.log(error);}
          );

        } else {
          Swal.fire({
            position:'top-end',
            icon: 'warning',
            title: 'complete los campos vacios',
            showConfirmButton:false,
            timer: 3000
          })
        }
      }
    })
  }

  verNewTelefonosReg(contacto:any) {
    this.nuevoContactoPhone = this.nuevoContactoPhone === contacto ? null : contacto;
  }

  verNewEmailsReg(contacto:any) {
    this.nuevoContactoEmails = this.nuevoContactoEmails === contacto ? null : contacto;
  }

  verTelefonos(contacto:any) {
    this.contactoSeleccionadoPhone = this.contactoSeleccionadoPhone === contacto ? null : contacto;
  }

  verEmails(contacto:any) {
    this.contactoSeleccionadoEmails = this.contactoSeleccionadoEmails === contacto ? null : contacto;
  }

  keyupPersListContPaterno(token_contacto:any,event:any){
    const index = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][index];
    pos_contacto["paterno_edit"] = event.value;
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4 && event.value != pos_contacto["paterno"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContMaterno(token_contacto:any,event:any){
    const index = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][index];
    pos_contacto["materno_edit"] = event.value;
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4 && event.value != pos_contacto["materno"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContNombres(token_contacto:any,event:any){
    const index = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][index];
    pos_contacto["nombre_edit"] = event.value;
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3 && event.value != pos_contacto["nombre"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContArea(token_contacto:any,event:any){
    const index = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][index];
    pos_contacto["area_contacto_edit"] = event.value;
    if (event.value != '' && this.validator.strFilEmp(event.value) == true && event.value != pos_contacto["area_contacto"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContCargo(token_contacto:any,event:any){
    const index = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][index];
    pos_contacto["cargo_contacto_edit"] = event.value;
    if (event.value != '' && this.validator.strFilEmp(event.value) == true && event.value != pos_contacto["cargo_contacto"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  validaBtnUpdateContPers(token_contacto:any): boolean{
    const index = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][index];
    return (
      pos_contacto["paterno_edit"] != pos_contacto["paterno"] ||
      pos_contacto["materno_edit"] != pos_contacto["materno"] ||
      pos_contacto["nombre_edit"] != pos_contacto["nombre"] ||
      pos_contacto["area_contacto_edit"] != pos_contacto["area_contacto"] ||
      pos_contacto["cargo_contacto_edit"] != pos_contacto["cargo_contacto"]
    );
  }

  guardaNombresContacto(token_cliente:any,token_contacto:any,paterno_edit:any,materno_edit:any,nombre_edit:any,area_contacto_edit:any,cargo_contacto_edit:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._clientServ.updateGeneralesContactoCliente(token_cliente,token_contacto,paterno_edit,materno_edit,nombre_edit,area_contacto_edit,cargo_contacto_edit).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    })  
  }

  telefonoTipoNewCont_regChange(event:any){
    this.txtEtiquetaPersonal = event.value != '' && this.validator.filtroAlfaNumerico(event.value) ? event.value : "";
  }

  probarTextNewPhone(){
    if (this.formPhone.valid) {
      const phoneNumber = this.formPhone.get('phone')?.value;
      console.log('Número de teléfono registrado:',phoneNumber);
    }
  }

  telefonoKeyupNewNumeroCont_reg(event:any){
    if (event.value != "" && event.value.length >= 5 && this.validator.filtroPhone(event.value) == true && this.formPhone.valid) {
      const phoneNumber = this.formPhone.get('phone')?.value;
      this.validator.correctoInputRow(event);
      this.txtPhonePersonalAll = phoneNumber;
      console.log(this.txtPhonePersonalAll);
    } else {
      this.txtPhonePersonalAll = "";
      this.validator.errorInputRow(event);
    }
  }

  telefonoKeyupNewExtension_reg(event:any){
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.txtPhoneExtPersonal = event.value;
    } else {
      this.txtPhoneExtPersonal = "";
      this.validator.errorInputRow(event);
    }
  }

  addPhoneContacto(token_cliente:any,token_contacto:any) {
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
        var etiquetaCont_regClient:any = document.getElementById("etiquetaCont_regClient");
        var txtTelefonoCont_reg:any = document.getElementById("txtTelefonoCont_regClient");
        var txtExtension_reg:any = document.getElementById("txtExtension_regClient");
        if ((this.txtEtiquetaPersonal != '' && this.validator.strFilter(this.txtEtiquetaPersonal) == true) && this.txtPhonePersonalAll != '' && 
          ((this.txtPhoneExtPersonal == '') || (this.txtPhoneExtPersonal != '' && this.txtPhoneExtPersonal.length >= 1 && this.validator.filtroNum(this.txtPhoneExtPersonal) == true))) {

          this._clientServ.agregaPhoneContactoCliente(token_cliente,token_contacto,this.txtEtiquetaPersonal,this.txtPhonePersonalAll,this.txtPhoneExtPersonal).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                Swal.fire({
                  position:"center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.txtEtiquetaPersonal = '';
                this.txtPhonePersonalAll = '';
                this.txtPhoneExtPersonal = '';
                this.validator.limpiaSelect(etiquetaCont_regClient);
                this.validator.limpiaInputRow(txtTelefonoCont_reg);
                this.validator.limpiaInputRow(txtExtension_reg);
                this.listaGeneralClientes();
                this.listaMXClientes();
                this.listaEXTClientes();
                this.functViewClienteData(token_cliente);
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              //console.log(error);
            }
          );

        } else {
          if(this.txtEtiquetaPersonal == '' || this.validator.strFilter(this.txtEtiquetaPersonal) == false){
            this.validator.errorInputRow(etiquetaCont_regClient);
          }
          if(this.txtPhonePersonalAll == ''){
            this.validator.errorInputRow(txtTelefonoCont_reg);
          }
        }
      }
    });
  }

  telefonoTipoCont_regChange(token_contacto:any,token_telefono:any,event:any){
    const p = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel:any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    tel["etiqueta_edit"] = event.value;
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroAlfaNumerico(event.value) && event.value != tel["etiqueta"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  probarTextPhone(token_contacto:any,token_telefono:any){
    const p = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel:any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    const phoneNumber = tel["phoneForm"].get('phone')?.value;
    tel["telefono_edit"] = phoneNumber;

    if (tel["phoneForm"].valid) {
      const phoneNumber = tel["phoneForm"].get('phone')?.value;
      console.log('Número de teléfono registrado:',phoneNumber);
    }
  }

  telefonoKeyupNumeroCont_reg(token_contacto:any,token_telefono:any,event:any){
    const p = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel:any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    const phoneNumber = tel["phoneForm"].get('phone')?.value;
    tel["telefono_edit"] = phoneNumber;
    if (event.value != "" && event.value.length >= 5 && this.validator.filtroPhone(event.value) == true && tel["phoneForm"].valid && tel["telefono_edit"] != tel["telefono"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  telefonoKeyupExtension_reg(token_contacto:any,token_telefono:any,event:any){
    const p = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel:any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    tel["extension_edit"] = event.value;
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true && event.value != tel["extension"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  validaBtnUpdateTelContPers(token_contacto:any,token_telefono:any): boolean{
    const p = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel:any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    return (
      tel["etiqueta_edit"] != tel["etiqueta"] ||
      tel["telefono_edit"] != tel["telefono"] ||
      tel["extension_edit"] != tel["extension"]
    );
  }

  updatePhoneContacto(token_cliente:any,token_contacto:any,token_telefono:any,etiqueta:any,numero_telefono:any,extension:any) {
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
        this._clientServ.updatePhoneContactoCliente(token_cliente,token_contacto,token_telefono,etiqueta,numero_telefono,extension).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

  deletePhoneContacto(token_cliente:any,token_contacto:any,token_telefono:any) {
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
        this._clientServ.deletePhoneContactoCliente(token_cliente,token_contacto,token_telefono).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

  keyupPersContNewEmail(event:any){
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
      this.txtMailPersonalClient_reg = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  addMailContacto(token_cliente:any,token_contacto:any) {
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

        /* &&
          (this.txtMailPersonalClient_reg.toLowerCase().includes('gmail.com') || this.txtMailPersonalClient_reg.toLowerCase().includes('hotmail.com') ||
          this.txtMailPersonalClient_reg.toLowerCase().includes('outlook.com') || this.txtMailPersonalClient_reg.toLowerCase().includes('yahoo.com') )*/

        var contPersEmail:any = document.getElementById("contPersClientEmail");
        if (this.txtMailPersonalClient_reg != '' && this.validator.filtroCorreo(this.txtMailPersonalClient_reg) == true) {
          this._clientServ.agregaEMailContactoCliente(token_cliente,token_contacto,this.txtMailPersonalClient_reg).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                Swal.fire({
                  position:"center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.listaGeneralClientes();
                this.listaMXClientes();
                this.listaEXTClientes();
                this.functViewClienteData(token_cliente);
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              //console.log(error);
            }
          );
        } else {
          this.validator.errorInputRow(contPersEmail);
        }
      }
    });
  }

  keyupPersContEmail(token_contacto:any,token_correo:any,event:any){
    const p = this.detalleClienteArray[0]["contacto_registrado"].findIndex((cont:any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.detalleClienteArray[0]["contacto_registrado"][p];
    const m = pos_contacto["correos"].findIndex((tel:any) => tel.token_correo === token_correo);
    let mail = pos_contacto["correos"][m];
    mail["correo_edit"] = event.value;
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true && event.value != mail["correo"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  updateEMailContacto(token_cliente:any,token_contacto:any,token_correo:any,correo:any) {
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
        this._clientServ.updateEMailContactoCliente(token_cliente,token_contacto,token_correo,correo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

  deleteEMailContacto(token_cliente:any,token_contacto:any,token_correo:any) {
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
        this._clientServ.deleteEMailContactoCliente(token_cliente,token_contacto,token_correo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              });
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

//creditos
  aceptaCreditoClient(event:any){
    event.checked == true ? $("#decidecredito").removeClass("noneView") : $("#decidecredito").addClass("noneView");
    this.detalleClienteArray[0]["tieneCreditoAsignado_edit"] = event.checked == true ? true : false;
  }

  listarMonedas(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.arrayMonedas = response.monedas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  keypressLimiteCredito(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (!(/^[0-9$.,]+$/.test(clave))) {
      this.validator.deten(event);
    }
  }

  keypressDiasPagoCredito(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (!(/^[0-9$.,]+$/.test(clave))) {
      this.validator.deten(event);
    }
  }

  credMonedaChange(event:any){
    const index = this.detalleClienteArray[0];
    console.log(event.value);
    if(event.value != "" && this.validator.filtroAlfaNumerico(event.value)){
      for (let i = 0; i < this.arrayMonedas.length; i++) {
        const money = this.arrayMonedas[i];
        if (money['langEN'] == event.value) {
          this.validator.correctoInputRow(event);
          console.log(money["code"]);
          index["creditos_moneda_code_edit"] = money['code'];
          index["creditos_moneda_decimales_edit"] = money['decimales'];
          this.creditosValidate();
          return;
        } else {
          this.validator.errorInputRow(event);
          index["creditos_moneda_code_edit"] = '';
          index["creditos_moneda_decimales_edit"] = 0;
          this.creditosValidate();
        }
      }
    } else {
      this.validator.errorInputRow(event);
      index["creditos_moneda_code_edit"] = '';
      index["creditos_moneda_decimales_edit"] = 0;
      this.creditosValidate();
    }
  }

  credLimiteCredito(event:any){
    const index = this.detalleClienteArray[0];
    index["creditos_limite_edit"] = numeral(event.value).format('$0,0.00');
    if (event.value != "" && this.validator.filtroNum(event.value) == true && index["creditos_limite_edit"] != index["creditos_limite"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
    this.creditosValidate();
  }

  credDiasPagoCredito(event:any){
    const index = this.detalleClienteArray[0];
    index["creditos_dias_edit"] = event.value;
    if (event.value != '' && this.validator.filtroNum(event.value) == true && index["creditos_dias_edit"] != index["creditos_dias"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
    this.creditosValidate();
  }

  credComienzaPagoClient(event:any){
    const index = this.detalleClienteArray[0];
    index["creditos_comienza_edit"] = event.value;
    if (event.value != '' && this.validator.strFilEmp(event.value) == true && index["creditos_comienza_edit"] != index["creditos_comienza"]) {
      this.validator.correctoSelectBrowser(event);
    } else {
      this.validator.errorSelectBrowser(event);
    }
    this.creditosValidate();
  }

  creditosValidate(){
    const index = this.detalleClienteArray[0];

    this.bool_valida_creditos = index["creditos_token_creditos"] != "" && ((index["creditos_moneda_code_edit"] != "" && this.validator.filtroAlfaNumerico(index["creditos_moneda_code_edit"]) == true && index["creditos_moneda_code_edit"] != index["creditos_moneda_code"]) ||
      (index["creditos_limite_edit"] != "" && this.validator.filtroNum(index["creditos_limite_edit"]) == true && index["creditos_limite_edit"] != index["creditos_limite"]) ||
      (index["creditos_dias_edit"] != 0 && this.validator.filtroNum(index["creditos_dias_edit"]) == true && index["creditos_dias_edit"] != index["creditos_dias"]) ||
      (index["creditos_comienza_edit"] != "" && this.validator.strFilEmp(index["creditos_comienza_edit"]) == true && index["creditos_comienza_edit"] != index["creditos_comienza"])) || 
    
      index["creditos_token_creditos"] == "" && (index["creditos_moneda_code_edit"] != "" && this.validator.filtroAlfaNumerico(index["creditos_moneda_code_edit"]) == true && 
      index["creditos_moneda_decimales_edit"] != 0 && this.validator.filtroAlfaNumerico(index["creditos_moneda_decimales_edit"]) == true &&
      index["creditos_limite_edit"] != "" && this.validator.filtroNum(index["creditos_limite_edit"]) == true && 
      index["creditos_dias_edit"] != 0 && this.validator.filtroNum(index["creditos_dias_edit"]) == true &&
      index["creditos_comienza_edit"] != "" && this.validator.strFilEmp(index["creditos_comienza_edit"]) == true) ? true : false;
  }

  seccionCreditosCliente(token_cliente:any){
    const index = this.detalleClienteArray[0];

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

        if (index["creditos_token_creditos"] != "") {
          console.log(index["creditos_dias_edit"]);
          this._clientServ.actualizaCreditosCliente(
            token_cliente,
            index["creditos_token_creditos"],
            index["creditos_moneda_code_edit"],
            index["creditos_moneda_decimales_edit"],
            index["creditos_limite_edit"],
            index["creditos_dias_edit"],
            index["creditos_comienza_edit"],
          ).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function(){
                  Swal.fire({
                    position:"center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.listaGeneralClientes();
                this.listaMXClientes();
                this.listaEXTClientes();
                this.bool_valida_creditos = false;
                this.functViewClienteData(token_cliente);
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              //console.log(error);
            }
          )
        } else {
          this._clientServ.registraCreditosCliente(
            token_cliente,
            this.decideaceptcredito,
            index["creditos_moneda_code_edit"],
            index["creditos_moneda_decimales_edit"],
            index["creditos_limite_edit"],
            index["creditos_dias_edit"],
            index["creditos_comienza_edit"],
          ).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function(){
                  Swal.fire({
                    position:"center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.listaGeneralClientes();
                this.listaMXClientes();
                this.listaEXTClientes();
                this.bool_valida_creditos = false;
                this.functViewClienteData(token_cliente);
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              //console.log(error);
            }
          )
        }
      }
    })
  }

  elimninaCreditosCliente(token_cliente:any,creditos_token_creditos:any){
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
        this._clientServ.eliminaCreditosCliente(token_cliente,creditos_token_creditos).subscribe(
          response => {
            console.log(response.message);
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function(){
                Swal.fire({
                  position:"center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.bool_valida_creditos = false;
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    })
  }

//forma de cobro
  tieneFormaCobroClient(event:any){
    event.checked == true ? $("#decideformacobroDetail").removeClass("noneView") : $("#decideformacobroDetail").addClass("noneView");
    this.detalleClienteArray[0]["forma_cobro_pref_tiene_edit"] = event.checked == true ? true : false;
  }

  changeFormaCobroAltaClient(event:any){
    if (this.detalleClienteArray[0]["forma_cobro_pref_tiene_edit"] == true) {
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
        for (let i = 0; i < this.listaFormasCobroIn.length; i++) {
          const row = this.listaFormasCobroIn[i];
          if (row["forma"] == event.value) {
            this.validator.correctoInputRow(event);
            this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] = row["token_formapago"];
            return;
          } else {
            this.validator.errorInputRow(event);
            this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] = "";
          }
        } 
      } else {
        this.validator.errorInputRow(event);
        this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] = "";
        //M.toast({html: "forma de pago invalida, revisa tu información o comunicate a soporte", classes: 'rounded'});
      }
    } else {
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
        for (let i = 0; i < this.listaFormasCobroIn.length; i++) {
          const row = this.listaFormasCobroIn[i];
          if (row["forma"] == event.value) {
            this.validator.correctoInputRow(event);
            this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] = row["token_formapago"];
            return;
          } else {
            this.validator.errorInputRow(event);
            this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] = "";
          }
        } 
      } else {
        this.validator.errorInputRow(event);
        this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] = "";
        //M.toast({html: "forma de pago invalida, revisa tu información o comunicate a soporte", classes: 'rounded'});
      }
    }
  }

  validaFormaCobro(){
    return (
      (this.detalleClienteArray[0]["forma_cobro_pref_tiene"] == true && this.detalleClienteArray[0]["forma_cobro_pref_tiene_edit"] == false) ||
      (this.detalleClienteArray[0]["forma_cobro_pref_tiene"] == false && this.detalleClienteArray[0]["forma_cobro_pref_tiene_edit"] == true && this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] != this.detalleClienteArray[0]["forma_cobro_pref_token"]) ||
      (this.detalleClienteArray[0]["forma_cobro_pref_tiene"] == true && this.detalleClienteArray[0]["forma_cobro_pref_tiene_edit"] == true && this.detalleClienteArray[0]["forma_cobro_pref_token_edit"] != this.detalleClienteArray[0]["forma_cobro_pref_token"])
    );
  }

  saveFormaCobroCliente(token_cliente:any){
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
        this._clientServ.actualizaFormaCobroCliente(token_cliente,this.detalleClienteArray[0]["forma_cobro_pref_tiene_edit"],this.detalleClienteArray[0]["forma_cobro_pref_token_edit"]).subscribe(
          response => {
            console.log(response.message);
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function(){
                Swal.fire({
                  position:"center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
              this.functViewClienteData(token_cliente);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            //console.log(error);
          }
        );
      }
    })
  }

  //facturacion
  emitirFactAntesDespues(token_cliente:any,event:any){
    console.log(event.checked);
    if (event.checked == true) {
      this._clientServ.habilitaEmitirFacturaAntesCobro(token_cliente).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function(){
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            },1000);
            this.listaGeneralClientes();
            this.listaMXClientes();
            this.listaEXTClientes();
            this.functViewClienteData(token_cliente);
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
      this._clientServ.deshabilitaEmitirFacturaAntesCobro(token_cliente).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function(){
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            },1000);
            this.listaGeneralClientes();
            this.listaMXClientes();
            this.listaEXTClientes();
            this.functViewClienteData(token_cliente);
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
    //
  }

  entregaDeProdAntesDespues(token_cliente:any,event:any){
    console.log(event.checked);
    if (event.checked == true) {
      this._clientServ.habilitaEntregaDeProdAntesCobro(token_cliente).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function(){
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            },1000);
            this.listaGeneralClientes();
            this.listaMXClientes();
            this.listaEXTClientes();
            this.functViewClienteData(token_cliente);
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
      this._clientServ.deshabilitaEntregaDeProdAntesCobro(token_cliente).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function(){
              Swal.fire({
                position:'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            },1000);
            this.listaGeneralClientes();
            this.listaMXClientes();
            this.listaEXTClientes();
            this.functViewClienteData(token_cliente);
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
  }

  //ubicacion nacional
  verEditUbicacion(ubicacion:any) {
    this.editUbicacionSeccion = this.editUbicacionSeccion === ubicacion ? null : ubicacion;
  }

    buscaCodPostalDipomex(event:any){
      if (event.value != "" && event.value.length == 5) {
        this.validator.correctoInputRow(event);
        this.dipomex_cod_postal_colonias.length = 0;
        this.dipomex_cod_postal_estado = "";
        this.dipomex_cod_postal_municipio = "";
        this.dipomex_cod_postal_cp = "";
        this.dipomex_cod_postal_colonia_vinculada = "";
        this.dirServ.postCodPostalDipomex(event.value).subscribe(
          response => {
            if (response.status == "success") {
              console.log(response.cod_postal);
              this.dipomex_cod_postal_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
              this.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
              this.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
              this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
              if (response.cod_postal["colonias"].length == 1) {
                this.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
                this.validateDipoMexUbica = true;
              } else {
                this.validateDipoMexUbica = false;
              }
            } else {
              this.validateDipoMexUbica = false;
              Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
              if (response.message == "postal_empty") {
                this.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
                this.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
                this.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
              }
            }
          },
          error => {
            //console.log(error);
          }
        )
      } else {
        this.validator.errorInputRow(event)
      }
    }
  
    seleccionaColoniaCPDipomex(colonia_name:any){
      if (colonia_name != "") {
        for (let i = 0; i < this.dipomex_cod_postal_colonias.length; i++) {
          if (this.dipomex_cod_postal_colonias[i] == colonia_name) {
            this.dipomex_cod_postal_colonia_vinculada = colonia_name;
            this.validateDipoMexUbica = true;
          }
        }
      } else {
        this.validateDipoMexUbica = false;
      }
    }
  
    actualizaUbicaDipoMexCliente(token_cliente:any,token_direccion:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_update"),
        icon: "warning",
        confirmButtonColor: "#388E3C",
        confirmButtonText: this.translate.instant("swal_yes_update"),
        showCancelButton: true,
        cancelButtonColor: "#D32F2F",
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._clientServ.dipoMexUpdateUbicaCliente(token_cliente,token_direccion,this.dipomex_cod_postal_estado,this.dipomex_cod_postal_municipio,this.dipomex_cod_postal_cp,this.dipomex_cod_postal_colonia_vinculada).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.listaGeneralClientes();
                this.listaMXClientes();
                this.listaEXTClientes();
                this.functViewClienteData(token_cliente);
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
          );
        }
      });
    }

    keyupCPostal_EstName(event:any,token_direccion:any){
      const index = this.detalleClienteArray[0]["ubicaciones"].findIndex((dir:any) => dir.token_direccion === token_direccion);
      let pos_dir = this.detalleClienteArray[0]["ubicaciones"][index];
      pos_dir["estado_edit"] = event.value;
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && pos_dir["estado_edit"] != pos_dir["estado_main"]) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
  
    keyupCPostal_Municipio(event:any,token_direccion:any){
      const index = this.detalleClienteArray[0]["ubicaciones"].findIndex((dir:any) => dir.token_direccion === token_direccion);
      let pos_dir = this.detalleClienteArray[0]["ubicaciones"][index];
      pos_dir["municipio_edit"] = event.value;
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && pos_dir["municipio_edit"] != pos_dir["municipio_main"]) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
  
    keyupCPostal_CP(event:any,token_direccion:any){
      const index = this.detalleClienteArray[0]["ubicaciones"].findIndex((dir:any) => dir.token_direccion === token_direccion);
      let pos_dir = this.detalleClienteArray[0]["ubicaciones"][index];
      pos_dir["c_postal_edit"] = event.value;
      if (event.value != "" && this.validator.filtroNum(event.value) == true && event.value.length == 5 && pos_dir["c_postal_edit"] != pos_dir["c_postal_main"]) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
  
    keyupCPostal_Colonia(event:any,token_direccion:any){
      const index = this.detalleClienteArray[0]["ubicaciones"].findIndex((dir:any) => dir.token_direccion === token_direccion);
      let pos_dir = this.detalleClienteArray[0]["ubicaciones"][index];
      pos_dir["colonia_edit"] = event.value;
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && pos_dir["colonia_edit"] != pos_dir["colonia_main"]) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
    }
  
    validatecPostal(token_direccion:any){
      const index = this.detalleClienteArray[0]["ubicaciones"].findIndex((dir:any) => dir.token_direccion === token_direccion);
      let pos_dir = this.detalleClienteArray[0]["ubicaciones"][index];
      return (
        (pos_dir["estado_edit"] != "" && this.validator.filtroAlfaNumerico(pos_dir["estado_edit"]) == true && pos_dir["estado_edit"] != pos_dir["estado_main"]) ||
        (pos_dir["municipio_edit"] != "" && this.validator.filtroAlfaNumerico(pos_dir["municipio_edit"]) == true && pos_dir["estado_edit"] != pos_dir["estado_main"]) ||
        (pos_dir["c_postal_edit"] != "" && this.validator.filtroNum(pos_dir["c_postal_edit"]) == true && pos_dir["c_postal_edit"].length == 5 && pos_dir["c_postal_edit"] != pos_dir["c_postal_main"]) ||
        (pos_dir["colonia_edit"] != "" && this.validator.filtroAlfaNumerico(pos_dir["colonia_edit"]) == true && pos_dir["colonia_edit"] != pos_dir["colonia_main"])
      );
    }
  
    actualizaUbicacionCliente(token_cliente:any,token_direccion:any){
      const index = this.detalleClienteArray[0]["ubicaciones"].findIndex((dir:any) => dir.token_direccion === token_direccion);
      let pos_dir = this.detalleClienteArray[0]["ubicaciones"][index];
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_update"),
        icon: "warning",
        confirmButtonColor: "#388E3C",
        confirmButtonText: this.translate.instant("swal_yes_update"),
        showCancelButton: true,
        cancelButtonColor: "#D32F2F",
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._clientServ.noApiUpdateUbicaCliente(token_cliente,token_direccion,pos_dir["estado_edit"],pos_dir["municipio_edit"],pos_dir["c_postal_edit"],pos_dir["colonia_edit"]).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.listaGeneralClientes();
                this.listaMXClientes();
                this.listaEXTClientes();
                this.functViewClienteData(token_cliente);

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
          );
        }
      });
    }

    deleteListCPostal(posicion:any){
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
          this.listnewdireccionNac.splice(posicion,1);
          if (this.listnewdireccionNac.length == 0) {
            this.validateDipoMexUbica = false;
            //this.activaFunctionRegistro();
          }
        }
      });
    }

  solicitarValidacionCliente(token_cat_clientes:any){
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
        this._clientServ.solicitaValidacionCliente(token_cat_clientes).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
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

  savePapeleraCliente(token_cat_clientes:any){
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
        this._clientServ.eliminaCliente(token_cat_clientes).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
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

  listaClientesEliminados(){
    this.view_bool_deleted_catalogos = false;
    this._clientServ.catalogoEliminadosClientes().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.view_bool_deleted_catalogos = true;
          this.catClientEliminados = response.clientes;
          console.log(response.clientes);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  restauraCliente(token_cat_clientes:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._clientServ.restaurarCliente(token_cat_clientes).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              this.listaGeneralClientes();
              this.listaClientesEliminados();
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

  eliminaPermCliente(token_cat_clientes:any){
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
        this._clientServ.eliminacionPermanenteCliente(token_cat_clientes).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function(){
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              },1000);
              this.listaGeneralClientes();
              this.listaClientesEliminados();
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

  viewDocumentoLink(event:any){
    window.open(event, '_blank');
  }

  matarCliente(token_cat_clientes: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._clientServ.eliminaCliente(token_cat_clientes).subscribe(
          (response: any) => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.listaGeneralClientes();
              this.listaMXClientes();
              this.listaEXTClientes();
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    })
  }

  verClientesEliminados(){
    this.view_bool_deleted_catalogos = true;
    this.listaClientesEliminados();
  }

  verBitacoraCliente(){
    // TODO: Implementar vista de bitácora de cliente
    console.log("Ver bitácora de cliente");
  }

  descarga_excel_clientes_general() {
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "folio", align: "center" },
      { label: this.translate.instant("client"), field: "nombre", align: "left" },
      { label: this.translate.instant("comercial_name"), field: "nombre_comercial", align: "left" },
      { label: "pais", field: "pais", align: "center" },
      { label: "rfc generico", field: "rfc_generico", align: "center" },
      { label: "rfc", field: "rfc_client", align: "center" },
      { label: "idTax", field: "tax_id_client", align: "center" },
      { label: "Cuenta contable", field: "cuenta_contable", align: "center" },
      { label: this.translate.instant("yes_auth"), field: "autorizado_translate", align: "center", translate: true },
      { label: "fecha de autorización", field: "auth_fecha", align: "center" }
    ];
    // TODO: Implementar servicio de descarga de Excel para clientes
    // this.servXlsx.descarga_xlsx_documento(this.list_clientes_general, columnas, 'clientes', 'Catálogo de clientes.xlsx');
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
