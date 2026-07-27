import { Component, OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { global } from '../../../../../servicios/global_ssic';
import { InterfUmedida } from '../../../../../interfaces/interf-umedida';
import { InterfPais } from '../../../../../interfaces/interf-pais';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { InterfPagoForma } from '../../../../../interfaces/interf-pago-forma';
import { FormaPagoService } from '../../../../../servicios/ssic/forma-pago.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import numeral from 'numeral';
import { QRCodeComponent } from 'angularx-qrcode';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';
import { RegimenFiscalService } from '../../../../../servicios/regimen-fiscal.service';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-interno-egresos-catalogos-proveedores-lista',
  templateUrl: './listaprovegresos.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/proveedores.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/div_busqueda.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/ubicaciones.css',
    '../../egresos.css',
    './listaprovegresos.component.css'
  ]
})

export class ListaProvEgresosComponent implements OnInit, OnDestroy {
  declare Instascan: any;
  options = {};
  public usuario: Usuarios;
  arrayCatUMedida: InterfUmedida[] = [];
  classifmedidaArray: any = [];

  public window_prov_by_qr_view: boolean = false;
  public window_prov_auth_soli_view: boolean = false;
  public window_prov_user_vinc_view: boolean = false;
  public window_prov_detalle_view: boolean = false;

  public validateQRcodeProv: boolean = false;
  arraybitacoraProv: any = [];
  public window_prov_bitacora_view: boolean = false;

  list_proveedores_general: any = [];
  indicador_proveedores_general:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoProveedoresGeneral: Date[] | undefined;

  list_proveedores_mx: any = [];
  indicador_proveedores_mx:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoProveedoresMX: Date[] | undefined;

  list_proveedores_ext: any = [];
  indicador_proveedores_ext:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoProveedoresEXT: Date[] | undefined;

  arrayCatProvDeleted: any = [];
  public window_prov_deleted_view: boolean = false;

  provDetalleData: any = [];
  provDetalleSaldoTotalAFavor: string = "";
  provDetalleSaldoAFavor: any = [];
  provDetalleAnticipoTotal: string = "";
  provDetalleAnticipo: any = [];
  listaFormasPagoIn: InterfPagoForma[] = [];

  listaMonedas: any = [];
  arrayUmedida: InterfUmedida[] = [];
  arraYpais: InterfPais[] = [];

  //contacto
  separateDialCode = false;
  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  formPhone: FormGroup;
  public view_bool_deleted_catalogos: boolean = false;
  catClientEliminados: any = [];

  public imagenPerfilPdfFiscal: any;
  public imagenPerfilPdfEstCuenta: any;
  existingPhoneNumber: string = '+1234567890';
  @ViewChild('buscaClaveSat') buscaClaveSat: ElementRef = {} as ElementRef;

  public txtEtiquetaPersonal: string = "";
  public txtPhonePersonalAll: string = "";
  public txtPhoneExtPersonal: string = "";
  public txtMailPersonalClient_reg: string = "";

  public decideaceptcredito: boolean = false;

  public decideformapagoDetail: boolean = false;
  public bool_valida_creditos: boolean = false;

  //ubicacion
  public cod_postal: string = "";
  //dipomex
  public dipomex_cod_postal_estado: string = "---";
  public dipomex_cod_postal_municipio: string = "---";
  public dipomex_cod_postal_cp: string = "---";
  public dipomex_cod_postal_colonias: any = [];
  public dipomex_cod_postal_colonia_vinculada: string = "";
  public validaCPNew: boolean = false;
  listnewdireccionNac: any = [];
  public validateDipoMexUbica: boolean = false;

  AllRegFisArray: any = [];
  PfAllRegFisArray: any = [];
  PmAllRegFisArray: any = [];

  nuevoRegistro = { apellidoPaterno: '', apellidoMaterno: '', nombres: '', area: '', cargo: '' };

  nuevo_contacto_form: any = [{ "paterno": "", "materno": "", "nombre": "", "area": "", "cargo": "", "emails": "", "telefonos": "" }];
  public personal_contacto_paterno: string = "";
  public personal_contacto_materno: string = "";
  public personal_contacto_nombres: string = "";
  public personal_contacto_area: string = "";
  public personal_contacto_cargo: string = "";
  public personal_contacto_email: string = "";
  personal_contacto_email_lista: any = [];

  public personal_contacto_phone_etiqueta: string = "";
  public personal_contacto_phone_numero: string = "";
  public personal_contacto_phone_extension: string = "";
  personal_contacto_telefono_lista: any = [];

  nuevoContactoPhone: string = "";
  nuevoContactoEmails: string = "";

  contactoSeleccionadoPhone: string = "";
  contactoSeleccionadoEmails: string = "";

  public docEstadoCuenta: any;
  public htmlEstadoCuenta: any = "";
  public typoEstadoCuenta: any;
  public clabeInterbancariaBanco: string = "";
  public clabeInterbancariaPlaza: string = "";
  public clabeInterbancariaCuenta: string = "";
  public clabeInterbancariaControl: string = "";
  public clabeInterbancariaPago: string = "000-000-00000000000-0";

  editUbicacionSeccion: string = "";
  decision_para_reembolsos: boolean = false;
  email_para_reembolsos: string = "";

  private destruir$ = new Subject<void>();

  constructor(
    private validator: ValidatorServService,
    private dirServ: DireccionesService,
    private monedasServ: MonedasService,
    private formaPagoServ: FormaPagoService,
    private sanitizer: DomSanitizer,
    private proveedorServ: ProveedoresService,
    private translate: TranslateService,
    private fiscalRegimenServ: RegimenFiscalService,
    private servXlsx: DescargaExcel,
    private relInterna: ComunicacionInternaService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.formPhone = this.fb.group({
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getRespuestaRegistroProveed();
    this.listaBitacoraProv();
    this.lista_proveedores('hoy');
    this.lista_proveedores_mx('hoy');
    this.lista_proveedores_ext('hoy');
  }

  getRespuestaRegistroProveed() {
    this.relInterna.mensajeProveedorEgresos$.subscribe(
      (mensaje: any) => {
        $('#windowProveedorRegistro').modal('hide');
        $('.modal-backdrop').remove();
        mensaje == "registro aprobado" ? this.listaBitacoraProv() : null;
        mensaje == "registro aprobado" ? this.lista_proveedores('hoy') : null;
        mensaje == "registro aprobado" ? this.lista_proveedores_mx('hoy') : null;
        mensaje == "registro aprobado" ? this.lista_proveedores_ext('hoy') : null;
        mensaje == "registro aprobado" ? this.listaProveedoresDeleted() : null;
      }
    );
  }

  provAuthSoliVer(){
    this.window_prov_auth_soli_view = true;
  }

  provUserVincVer(){
    this.window_prov_user_vinc_view = true;
  }

  listFormaPago() {
    this.formaPagoServ.getformapago().subscribe((data: InterfPagoForma[]) => {
      this.listaFormasPagoIn = data;
      console.log(this.listaFormasPagoIn);
    })
  }

  reg_fiscal_all() {
    this.fiscalRegimenServ.getAllRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.AllRegFisArray = data.listRegFisc;
      }
      console.log(this.AllRegFisArray);
    });
  }

  reg_fiscal_pf() {
    this.fiscalRegimenServ.getPfRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PfAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PfAllRegFisArray);
    });
  }

  reg_fiscal_pm() {
    this.fiscalRegimenServ.getPmRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.PmAllRegFisArray = data.listRegFisc;
      }
      console.log(this.PmAllRegFisArray);
      //
    });
  }

  verBitacoraProveedor(){
    this.window_prov_bitacora_view = true;
    if (this.arraybitacoraProv.length === 0) this.listaBitacoraProv();
  }

  listaBitacoraProv() {
    this.proveedorServ.catalogoProveedoresBitacora().subscribe(
      response => {
        if (response.status == 'success') {
          //this.arraybitacoraProv = response.bitacora;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  recargar_lista_proveedores() {
    this.lista_proveedores(this.indicador_proveedores_general);
  }

  lista_proveedores(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_proveedores_general = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var prov_gral_otras_fechas = document.getElementById("prov_gral_otras_fechas");
      if (this.rangoPeriodoProveedoresGeneral && this.rangoPeriodoProveedoresGeneral.length === 2) {
        const dateInicio = this.rangoPeriodoProveedoresGeneral[0];
        const dateFin = this.rangoPeriodoProveedoresGeneral[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(prov_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(prov_gral_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(prov_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(prov_gral_otras_fechas);
        return;
      }
    }

    this.proveedorServ.catalogoProveedoresGeneral(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaGralProv(response),
      error: (err) => this.manejarErrorGralProv(err)
    });
  }
  
  private procesarRespuestaGralProv(response: any) {
    if (response.status === 'success') {
      response.proveedores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.list_proveedores_general = response.proveedores;
      this.cd.detectChanges();
    } else {
      this.list_proveedores_general = [];
    }
  }

  private manejarErrorGralProv(error: any) {
    console.error('Error al cargar la lista de proveedores:', error);
    this.list_proveedores_general = [];
  }

  recargar_proveedores_mx() {
    this.lista_proveedores_mx(this.indicador_proveedores_mx);
  }

  lista_proveedores_mx(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_proveedores_mx = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var mx_prov_otras_fechas = document.getElementById("mx_prov_otras_fechas");
      if (this.rangoPeriodoProveedoresMX && this.rangoPeriodoProveedoresMX.length === 2) {
        const dateInicio = this.rangoPeriodoProveedoresMX[0];
        const dateFin = this.rangoPeriodoProveedoresMX[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(mx_prov_otras_fechas);
          } else {
            this.validator.errorInputRow(mx_prov_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(mx_prov_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(mx_prov_otras_fechas);
        return;
      }
    }

    this.proveedorServ.catalogoProveedoresMX(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaMXPRVList(response),
      error: (err) => this.manejarErrorMXPRVList(err)
    });
  }
  
  private procesarRespuestaMXPRVList(response: any) {
    if (response.status === 'success') {
      response.proveedores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.list_proveedores_mx = response.proveedores;
      this.cd.detectChanges();
    } else {
      this.list_proveedores_mx = [];
    }
  }

  private manejarErrorMXPRVList(error: any) {
    console.error('Error al cargar la lista de proveedores:', error);
    this.list_proveedores_mx = [];
  }

  recargar_lista_proveedores_ext() {
    this.lista_proveedores_ext(this.indicador_proveedores_ext);
  }

  lista_proveedores_ext(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicador_proveedores_ext = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var ext_prv_otras_fechas = document.getElementById("ext_prv_otras_fechas");
      if (this.rangoPeriodoProveedoresEXT && this.rangoPeriodoProveedoresEXT.length === 2) {
        const dateInicio = this.rangoPeriodoProveedoresEXT[0];
        const dateFin = this.rangoPeriodoProveedoresEXT[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(ext_prv_otras_fechas);
          } else {
            this.validator.errorInputRow(ext_prv_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(ext_prv_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(ext_prv_otras_fechas);
        return;
      }
    }

    this.proveedorServ.catalogoProveedoresExtranjeros(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuestaEXTPRVList(response),
      error: (err) => this.manejarErrorEXTPRVList(err)
    });
  }
  
  private procesarRespuestaEXTPRVList(response: any) {
    if (response.status === 'success') {
      response.proveedores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
      this.list_proveedores_ext = response.proveedores;
      this.cd.detectChanges();
    } else {
      this.list_proveedores_ext = [];
    }
  }

  private manejarErrorEXTPRVList(error: any) {
    console.error('Error al cargar la lista de proveedores:', error);
    this.list_proveedores_ext = [];
  }

  verProveedoresEliminados(){
    this.window_prov_deleted_view = true
    if (this.arrayCatProvDeleted.length === 0) this.listaProveedoresDeleted();
  }

  listaProveedoresDeleted() {
    this.proveedorServ.provEliminados().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayCatProvDeleted = response.proveedor;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  descarga_excel_provs_general() {
    const columnas: ExcelColumnas[] = [
      { label: "folio", field: "folio", align: "center" },
      { label: this.translate.instant("prov"), field: "nombre", align: "left" },
      { label: this.translate.instant("comercial_name"), field: "nombre_comercial", align: "left" },
      { label: "pais", field: "pais", align: "center" },
      { label: "rfc generico", field: "rfc_generico", align: "center" },
      { label: "rfc", field: "rfc_prov", align: "center" },
      { label: "idTax", field: "tax_id_prov", align: "center" },
      { label: "Cuenta contable", field: "cuenta_contable", align: "center" },
      { label: this.translate.instant("yes_auth"), field: "autorizado_translate", align: "center", translate: true },
      { label: "fecha de autorización", field: "auth_fecha", align: "center" }
    ];
    this.servXlsx.descarga_xlsx_documento(this.list_proveedores_general, columnas, 'proveedores', 'Catálogo de proveedores.xlsx');
  }

  buscarScannRfcProv() {
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("viewScannerQrRfcProv", config, false);
    codeQrstfiscal.render(this.scanYesRfcProv, this.onScanErrorRfcProv);
    this.window_prov_by_qr_view = true;
  }

  scanYesRfcProv(decodedText: any, decodedResult: any) {
    console.log(`Scan result: ${decodedText}`, decodedResult);
    this.validateQRcodeProv = true;
    this.proveedorServ.verDetalleProveedor(decodedText).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.provDetalleData = response.proveedor;
          this.reg_fiscal_all();
          this.reg_fiscal_pf();
          this.reg_fiscal_pm();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  onScanErrorRfcProv(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }

  solicita_auth_prov(token_proveedor: any) {
    console.log(token_proveedor);
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
        this.proveedorServ.solicitarValidateProveedor(token_proveedor).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
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
          }, error => { console.log(error); }
        );
      }
    })
  }

  infoProvDetalle(token_cat_proveedores: any) {
    this.verDetalleProveedor(token_cat_proveedores);
    this.infoProvDetalleSaldoAFavor(token_cat_proveedores);
    this.listar_anticipos_proveedor(token_cat_proveedores);
    this.window_prov_detalle_view = true;
  }

  verDetalleProveedor(token_cat_proveedores: any) {
    this.proveedorServ.verDetalleProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.provDetalleData = response.proveedor;
          this.provDetalleData.forEach((prv: any) => {
            this.decision_para_reembolsos = prv.habilitado_para_reembolsos;
            prv.habilitado_para_reembolsos ? $("#infoemail_det_reembolsos").removeClass("noneView") : $("#infoemail_det_reembolsos").addClass("noneView");
          });
          this.reg_fiscal_all();
          this.reg_fiscal_pf();
          this.reg_fiscal_pm();
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  infoProvDetalleSaldoAFavor(token_cat_proveedores: any) {
    this.proveedorServ.listarSaldosProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response);
          this.provDetalleSaldoTotalAFavor = response.saldo_total;
          this.provDetalleSaldoAFavor = response.saldos_registrados;
        }
      }
    );
  }

  listar_anticipos_proveedor(token_cat_proveedores: any) {
    this.proveedorServ.listarAnticiposProveedor(token_cat_proveedores).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response);
          this.provDetalleAnticipoTotal = response.anticipo_total;
          this.provDetalleAnticipo = response.anticipos_registrados;
        }
      }
    );
  }

  habilita_para_reembolsos(event: any) {
    this.decision_para_reembolsos = event.checked ? true : false;
    event.checked ? $("#infoemail_det_reembolsos").removeClass("noneView") : $("#infoemail_det_reembolsos").addClass("noneView");
  }

  keyupEmailForReembolsos(event: any) {
    const validacion = event.value != '' && this.validator.filtroCorreo(event.value);
    this.email_para_reembolsos = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  habilitar_prov_para_reembolsos(token_cat_proveedores: any) {
    if (this.decision_para_reembolsos) {
      this.proveedorServ.habilitaProvForReembolsos(token_cat_proveedores, this.email_para_reembolsos).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function () {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }, 1000);
            this.recargar_lista_proveedores();
            this.recargar_proveedores_mx();
            this.recargar_lista_proveedores_ext();
            this.infoProvDetalle(token_cat_proveedores);
          }
          if (response.status == 'error') {
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
    } else {
      this.proveedorServ.deshabilitaProvForReembolsos(token_cat_proveedores).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function () {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }, 1000);
            this.recargar_lista_proveedores();
            this.recargar_proveedores_mx();
            this.recargar_lista_proveedores_ext();
            this.infoProvDetalle(token_cat_proveedores);
          }
          if (response.status == 'error') {
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
  }

  validaNewNombreProv(valor: any) {
    let prvIndex = this.provDetalleData[0];
    prvIndex["nombre_proveedor_edit"] = valor.value;
    const validacion = valor.value != "" && valor.value.length >= 4 && this.validator.strFilter(valor.value) && valor.value != prvIndex.nombre_proveedor;
    validacion ? this.validator.correctoInput(valor, "Nombre completo / razón social del proveedor") : this.validator.errorInput(valor, "Ingresa nombre completo / razón social del proveedor");
  }

  validaNewRfcProv(event: any) {
    console.log(event.value.length);
    let prvIndex = this.provDetalleData[0];
    prvIndex["rfc_prov_edit"] = event.value;
    if (prvIndex["subClasificacionSimple"] == "PF") {
      const validacion = event.value != "" && this.validator.filtroRFCGeneral(event.value) && event.value.length == 13 && event.value != prvIndex["rfc_prov"];
      validacion ? this.validator.correctoInput(event, "Escriba su rfc con Homoclave") : this.validator.errorInput(event, "Rfc incorrecto (13 caracteres Ej. ABCD000000XXX)");
    }
    if (prvIndex["subClasificacionSimple"] == "PM") {
      const validacion = event.value != "" && this.validator.filtroRFCGeneral(event.value) && event.value.length == 12 && event.value != prvIndex["rfc_prov"];
      validacion ? this.validator.correctoInput(event, "Escriba su rfc con Homoclave") : this.validator.errorInput(event, "Rfc incorrecto (12 caracteres Ej. ABC000000XXX)");
    }
  }

  validaNewTaxIdProv(event: any) {
    let prvIndex = this.provDetalleData[0];
    prvIndex["tax_id_prov_edit"] = event.value;
    const validacion = event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value) && event.value != prvIndex["tax_id_prov"];
    validacion ? this.validator.correctoInput(event, "Escriba Tax ID del proveedor") : this.validator.errorInput(event, "Tax ID del proveedor no es correcto");
  }

  keyupComercialName(event: any) {
    let prvIndex = this.provDetalleData[0];
    prvIndex["nombre_comercial_edit"] = event.value;
    const validacion = event.value != "" && this.validator.strFilEmp(event.value) && event.value != prvIndex["nombre_comercial"];
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeSitioWeb(event: any) {
    let prvIndex = this.provDetalleData[0];
    prvIndex["sitio_web_edit"] = event.value;
    const validacion = event.value != "" && this.validator.filtroUrl("https://" + event.value) && event.value != prvIndex["sitio_web"];
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupValidateCuentaContable(event: any) {
    let prvIndex = this.provDetalleData[0];
    prvIndex["cuenta_contable_edit"] = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value != prvIndex["cuenta_contable"];
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeRegimenFiscal(event: any) {
    let prvIndex = this.provDetalleData[0];
    const rfisc = this.AllRegFisArray.find((row: any) => row.tokenfiscalRegimenServ_fiscal === event.value);
    prvIndex["regimen_fiscal_token_edit"] = rfisc.tokenfiscalRegimenServ_fiscal;
    const validar = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof rfisc !== 'undefined' && prvIndex["regimen_fiscal_token_edit"] != prvIndex["regimen_fiscal_token"];
    validar ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
  }

  validaGeneralesPrv() {
    let prvIndex = this.provDetalleData[0];
    const valid_prv_name = prvIndex["nombre_proveedor_edit"] == '' || prvIndex["nombre_proveedor_edit"] == prvIndex["nombre_proveedor"];
    const valid_prv_frc = prvIndex["rfc_prov"] == prvIndex["rfc_prov_edit"];
    const valid_prv_id_tax = prvIndex["id_tax_back"] == '' || prvIndex["id_tax"] == prvIndex["id_tax_back"];
    const valid_prv_nombre_comercial = prvIndex["nombre_comercial_edit"] == '' || prvIndex["nombre_comercial_edit"] == prvIndex["nombre_comercial"];
    const valid_prv_sitio_web = prvIndex["sitio_web_edit"] == '' || prvIndex["sitio_web_edit"] == prvIndex["sitio_web"];
    const valid_prvfiscalRegimenServ_fiscal = prvIndex["regimen_fiscal_token_edit"] == '' || prvIndex["regimen_fiscal_token_edit"] == prvIndex["regimen_fiscal_token"];
    const valid_prv_ccontable = prvIndex["cuenta_contable_edit"] == '' || prvIndex["cuenta_contable_edit"] == prvIndex["cuenta_contable"];

    return (valid_prv_name && valid_prv_frc && valid_prv_id_tax && valid_prv_nombre_comercial && valid_prv_sitio_web && valid_prvfiscalRegimenServ_fiscal && valid_prv_ccontable);
  }

  guardaNew_DataPrv(token_cat_proveedores: any, clasificacion: any, subClasificacion: any, rfc_prov: any, tax_id_prov: any, nombre_proveedor_edit: any, nombre_comercial_edit: any, sitio_web_edit: any, regimen_fiscal_token_edit: any, cuenta_contable_edit: any) {
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
        this.proveedorServ.updateGeneralesProveedor(
          token_cat_proveedores,
          clasificacion,
          subClasificacion == "PF" ? "provFisica" : "provMoral",
          rfc_prov,
          tax_id_prov,
          nombre_proveedor_edit,
          nombre_comercial_edit,
          sitio_web_edit,
          regimen_fiscal_token_edit,
          cuenta_contable_edit
        ).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    })
  }

  decideocupaContacto(event: any) {
    event.checked == true ? $("#decideinfocontacto").removeClass("noneView") : $("#decideinfocontacto").addClass("noneView");
    this.provDetalleData[0]["tiene_contacto_registrado_edit"] = event.checked == true ? true : false;
  }

  keyupPersNewContPaterno(event: any) {
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.personal_contacto_paterno = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_paterno = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContMaterno(event: any) {
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
      this.personal_contacto_materno = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_materno = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContNombres(event: any) {
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3) {
      this.personal_contacto_nombres = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_nombres = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContArea(event: any) {
    if (event.value != '' && this.validator.strFilEmp(event.value) == true) {
      this.personal_contacto_area = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_area = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContCargo(event: any) {
    if (event.value != '' && this.validator.strFilEmp(event.value) == true) {
      this.personal_contacto_cargo = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_cargo = "";
      this.validator.errorInputRow(event);
    }
  }

  keyupPersNewContEmail(event: any) {
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
      this.personal_contacto_email = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.personal_contacto_email = "";
      this.validator.errorInputRow(event);
    }
  }

  addMailNewContacto() {
    var contPersEmail: any = document.getElementById("contPersClientNewEmail");
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

  deleteMailNewContacto(position: any) {
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
        this.personal_contacto_email_lista.splice(position, 1);
        if (this.personal_contacto_email_lista.length == 0) {
          this.validaMailTelContacto();
        }
      }
    });
  }

  contNewTelefonoTipoChange(event: any) {
    this.personal_contacto_phone_etiqueta = event.value != '' && this.validator.filtroAlfaNumerico(event.value) ? event.value : "";
  }

  probarNewTextPhone() {
    if (this.formPhone.valid) {
      const phoneNumber = this.formPhone.get('phone')?.value;
      console.log('Número de teléfono registrado:', phoneNumber);
    }
  }

  contNewTelefonoNumero(event: any) {
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

  contNewTelefonoExtension(event: any) {
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.personal_contacto_phone_extension = event.value;
    } else {
      this.personal_contacto_phone_extension = "";
      this.validator.errorInputRow(event);
    }
  }

  addPhoneNewContacto() {
    var etiquetaCont_regClient: any = document.getElementById("etiquetaNewCont_regClient");
    var txtTelefonoCont_reg: any = document.getElementById("txtTelefonoNewCont_regClient");
    var txtExtension_reg: any = document.getElementById("txtExtensionNewCont_regClient");
    if ((this.personal_contacto_phone_etiqueta != '' && this.validator.strFilter(this.personal_contacto_phone_etiqueta) == true) && this.personal_contacto_phone_numero != '') {
      this.validaMailTelContacto();
      if ((this.personal_contacto_phone_extension == '') || (this.personal_contacto_phone_extension != '' && this.personal_contacto_phone_extension.length >= 1 && this.validator.filtroNum(this.personal_contacto_phone_extension) == true)) {
        this.personal_contacto_telefono_lista.push({
          "etiqueta": this.personal_contacto_phone_etiqueta,
          "telefono_complete": this.personal_contacto_phone_numero,
          "extension": this.personal_contacto_phone_extension,
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
      if (this.personal_contacto_phone_etiqueta == '' || this.validator.strFilter(this.personal_contacto_phone_etiqueta) == false) {
        this.validator.errorInputRow(etiquetaCont_regClient);
      }
      if (this.personal_contacto_phone_numero == '') {
        this.validator.errorInputRow(txtTelefonoCont_reg);
      }
    }
  }

  deleteNewPhoneContacto(position: any) {
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
        this.personal_contacto_telefono_lista.splice(position, 1);
        if (this.personal_contacto_telefono_lista.length == 0) {
          this.validaMailTelContacto();
        }
      }
    });
  }

  enableBtnContacto() {
    return (
      (this.personal_contacto_paterno != '' && this.validator.strFilter(this.personal_contacto_paterno) == true && this.personal_contacto_paterno.length >= 4) &&
      (this.personal_contacto_materno != '' && this.validator.strFilter(this.personal_contacto_materno) == true && this.personal_contacto_materno.length >= 4) &&
      (this.personal_contacto_nombres != '' && this.validator.strFilter(this.personal_contacto_nombres) == true && this.personal_contacto_nombres.length >= 3) &&
      (this.personal_contacto_area != '' && this.validator.strFilter(this.personal_contacto_area) == true && this.personal_contacto_area.length >= 5) &&
      (this.personal_contacto_cargo != '' && this.validator.strFilter(this.personal_contacto_cargo) == true && this.personal_contacto_cargo.length >= 5) &&
      (this.personal_contacto_email_lista.length > 0 || this.personal_contacto_telefono_lista.length > 0)
    );
  }

  validaMailTelContacto() {
    if (this.personal_contacto_email_lista.length > 0 && this.personal_contacto_telefono_lista.length > 0) {
      $("#btnModalPersMailTelMain").removeClass("btnError");
    } else {
      $("#btnModalPersMailTelMain").addClass("btnError");
    }
  }

  registraNuevoContacto(token_cat_proveedores: any) {
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

          this.proveedorServ.registraNuevoContactoProv(
            token_cat_proveedores,
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
                    position: "center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  });
                  this.recargar_lista_proveedores();
                  this.recargar_proveedores_mx();
                  this.recargar_lista_proveedores_ext();
                  this.infoProvDetalle(token_cat_proveedores);

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
                    position: "top-end",
                    icon: "warning",
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }
              },
              error => { console.log(error); }
            );

        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'complete los campos vacios',
            showConfirmButton: false,
            timer: 3000
          })
        }
      }
    })
  }

  verNewTelefonosReg(contacto: any) {
    this.nuevoContactoPhone = this.nuevoContactoPhone === contacto ? null : contacto;
  }

  verNewEmailsReg(contacto: any) {
    this.nuevoContactoEmails = this.nuevoContactoEmails === contacto ? null : contacto;
  }

  verTelefonos(contacto: any) {
    this.contactoSeleccionadoPhone = this.contactoSeleccionadoPhone === contacto ? null : contacto;
  }

  verEmails(contacto: any) {
    this.contactoSeleccionadoEmails = this.contactoSeleccionadoEmails === contacto ? null : contacto;
  }

  keyupPersListContPaterno(token_contacto: any, event: any) {
    const index = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][index];
    pos_contacto["paterno_edit"] = event.value;
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4 && event.value != pos_contacto["paterno"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContMaterno(token_contacto: any, event: any) {
    const index = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][index];
    pos_contacto["materno_edit"] = event.value;
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4 && event.value != pos_contacto["materno"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContNombres(token_contacto: any, event: any) {
    const index = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][index];
    pos_contacto["nombre_edit"] = event.value;
    if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 3 && event.value != pos_contacto["nombre"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContArea(token_contacto: any, event: any) {
    const index = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][index];
    pos_contacto["area_contacto_edit"] = event.value;
    if (event.value != '' && this.validator.strFilEmp(event.value) == true && event.value != pos_contacto["area_contacto"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupPersListContCargo(token_contacto: any, event: any) {
    const index = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][index];
    pos_contacto["cargo_contacto_edit"] = event.value;
    if (event.value != '' && this.validator.strFilEmp(event.value) == true && event.value != pos_contacto["cargo_contacto"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  validaBtnUpdateContPers(token_contacto: any): boolean {
    const index = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][index];
    return (
      pos_contacto["paterno_edit"] != pos_contacto["paterno"] ||
      pos_contacto["materno_edit"] != pos_contacto["materno"] ||
      pos_contacto["nombre_edit"] != pos_contacto["nombre"] ||
      pos_contacto["area_contacto_edit"] != pos_contacto["area_contacto"] ||
      pos_contacto["cargo_contacto_edit"] != pos_contacto["cargo_contacto"]
    );
  }

  guardaNombresContacto(token_cat_proveedores: any, token_contacto: any, paterno_edit: any, materno_edit: any, nombre_edit: any, area_contacto_edit: any, cargo_contacto_edit: any) {
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
        this.proveedorServ.updateGeneralesContactoProv(token_cat_proveedores, token_contacto, paterno_edit, materno_edit, nombre_edit, area_contacto_edit, cargo_contacto_edit).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    })
  }

  telefonoTipoNewCont_regChange(event: any) {
    this.txtEtiquetaPersonal = event.value != '' && this.validator.filtroAlfaNumerico(event.value) ? event.value : "";
  }

  probarTextNewPhone() {
    if (this.formPhone.valid) {
      const phoneNumber = this.formPhone.get('phone')?.value;
      console.log('Número de teléfono registrado:', phoneNumber);
    }
  }

  telefonoKeyupNewNumeroCont_reg(event: any) {
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

  telefonoKeyupNewExtension_reg(event: any) {
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true) {
      this.validator.correctoInputRow(event);
      this.txtPhoneExtPersonal = event.value;
    } else {
      this.txtPhoneExtPersonal = "";
      this.validator.errorInputRow(event);
    }
  }

  addPhoneContacto(token_cat_proveedores: any, token_contacto: any) {
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
        var etiquetaCont_regClient: any = document.getElementById("etiquetaCont_regClient");
        var txtTelefonoCont_reg: any = document.getElementById("txtTelefonoCont_regClient");
        var txtExtension_reg: any = document.getElementById("txtExtension_regClient");
        if ((this.txtEtiquetaPersonal != '' && this.validator.strFilter(this.txtEtiquetaPersonal) == true) && this.txtPhonePersonalAll != '' &&
          ((this.txtPhoneExtPersonal == '') || (this.txtPhoneExtPersonal != '' && this.txtPhoneExtPersonal.length >= 1 && this.validator.filtroNum(this.txtPhoneExtPersonal) == true))) {

          this.proveedorServ.agregaPhoneContactoProv(token_cat_proveedores, token_contacto, this.txtEtiquetaPersonal, this.txtPhonePersonalAll, this.txtPhoneExtPersonal).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.txtEtiquetaPersonal = '';
                this.txtPhonePersonalAll = '';
                this.txtPhoneExtPersonal = '';
                this.validator.limpiaSelect(etiquetaCont_regClient);
                this.validator.limpiaInputRow(txtTelefonoCont_reg);
                this.validator.limpiaInputRow(txtExtension_reg);
                this.recargar_lista_proveedores();
                this.recargar_proveedores_mx();
                this.recargar_lista_proveedores_ext();
                this.infoProvDetalle(token_cat_proveedores);
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
            error => {
              //console.log(error);
            }
          );

        } else {
          if (this.txtEtiquetaPersonal == '' || this.validator.strFilter(this.txtEtiquetaPersonal) == false) {
            this.validator.errorInputRow(etiquetaCont_regClient);
          }
          if (this.txtPhonePersonalAll == '') {
            this.validator.errorInputRow(txtTelefonoCont_reg);
          }
        }
      }
    });
  }

  telefonoTipoCont_regChange(token_contacto: any, token_telefono: any, event: any) {
    const p = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel: any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    tel["etiqueta_edit"] = event.value;
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroAlfaNumerico(event.value) && event.value != tel["etiqueta"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  probarTextPhone(token_contacto: any, token_telefono: any) {
    const p = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel: any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    const phoneNumber = tel["phoneForm"].get('phone')?.value;
    tel["telefono_edit"] = phoneNumber;

    if (tel["phoneForm"].valid) {
      const phoneNumber = tel["phoneForm"].get('phone')?.value;
      console.log('Número de teléfono registrado:', phoneNumber);
    }
  }

  telefonoKeyupNumeroCont_reg(token_contacto: any, token_telefono: any, event: any) {
    const p = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel: any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    const phoneNumber = tel["phoneForm"].get('phone')?.value;
    tel["telefono_edit"] = phoneNumber;
    if (event.value != "" && event.value.length >= 5 && this.validator.filtroPhone(event.value) == true && tel["phoneForm"].valid && tel["telefono_edit"] != tel["telefono"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  telefonoKeyupExtension_reg(token_contacto: any, token_telefono: any, event: any) {
    const p = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel: any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    tel["extension_edit"] = event.value;
    if (event.value != "" && event.value.length >= 1 && this.validator.filtroNum(event.value) == true && event.value != tel["extension"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  validaBtnUpdateTelContPers(token_contacto: any, token_telefono: any): boolean {
    const p = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][p];
    const t = pos_contacto["telefonos"].findIndex((tel: any) => tel.token_telefono === token_telefono);
    let tel = pos_contacto["telefonos"][t];
    return (
      tel["etiqueta_edit"] != tel["etiqueta"] ||
      tel["telefono_edit"] != tel["telefono"] ||
      tel["extension_edit"] != tel["extension"]
    );
  }

  updatePhoneContacto(token_cat_proveedores: any, token_contacto: any, token_telefono: any, etiqueta: any, numero_telefono: any, extension: any) {
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
        this.proveedorServ.updatePhoneContactoProv(token_cat_proveedores, token_contacto, token_telefono, etiqueta, numero_telefono, extension).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

  deletePhoneContacto(token_cat_proveedores: any, token_contacto: any, token_telefono: any) {
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
        this.proveedorServ.deletePhoneContactoProv(token_cat_proveedores, token_contacto, token_telefono).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

  keyupPersContNewEmail(event: any) {
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true) {
      this.txtMailPersonalClient_reg = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  addMailContacto(token_cat_proveedores: any, token_contacto: any) {
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
        var contPersEmail: any = document.getElementById("contPersClientEmail");
        if (this.txtMailPersonalClient_reg != '' && this.validator.filtroCorreo(this.txtMailPersonalClient_reg) == true) {
          this.proveedorServ.agregaEMailContactoProv(token_cat_proveedores, token_contacto, this.txtMailPersonalClient_reg).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                });
                this.recargar_lista_proveedores();
                this.recargar_proveedores_mx();
                this.recargar_lista_proveedores_ext();
                this.infoProvDetalle(token_cat_proveedores);
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

  keyupPersContEmail(token_contacto: any, token_correo: any, event: any) {
    const p = this.provDetalleData[0]["contacto_registrado"].findIndex((cont: any) => cont.token_contacto === token_contacto);
    let pos_contacto = this.provDetalleData[0]["contacto_registrado"][p];
    const m = pos_contacto["correos"].findIndex((tel: any) => tel.token_correo === token_correo);
    let mail = pos_contacto["correos"][m];
    mail["correo_edit"] = event.value;
    if (event.value != '' && this.validator.filtroCorreo(event.value) == true && event.value != mail["correo"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  updateEMailContacto(token_cat_proveedores: any, token_contacto: any, token_correo: any, correo: any) {
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
        this.proveedorServ.updateEMailContactoProv(token_cat_proveedores, token_contacto, token_correo, correo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

  deleteEMailContacto(token_cat_proveedores: any, token_contacto: any, token_correo: any) {
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
        this.proveedorServ.deleteEMailContactoProv(token_cat_proveedores, token_contacto, token_correo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              });
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    });
  }

  decide_docs_fiscales(event: any) {
    this.provDetalleData[0]["tiene_docs_fiscales"] = event.checked ? true : false;
    event.checked ? $("#decidedocs_fiscales").removeClass("noneView") : $("#decidedocs_fiscales").addClass("noneView");
    //this.activaFunctionRegistro();
  }

  //creditos
  aceptaCreditoProv(event: any) {
    event.checked == true ? $("#decidecredito").removeClass("noneView") : $("#decidecredito").addClass("noneView");
    this.provDetalleData[0]["tieneCreditoAsignado_edit"] = event.checked == true ? true : false;
    if (this.provDetalleData[0]["tieneCreditoAsignado_edit"] && this.listaMonedas.length === 0) this.listarMonedas();
  }

  listarMonedas() {
    this.monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.listaMonedas = response.monedas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  keypressLimiteCredito(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[0-9$.,]+$/.test(clave))) {
      this.validator.deten(event);
    }
  }

  keypressDiasPagoCredito(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[0-9$.,]+$/.test(clave))) {
      this.validator.deten(event);
    }
  }

  credMonedaChange(token_creditos: any, event: any) {
    const cred = this.provDetalleData[0]["creditos"].find((row: any) => row.token_creditos === token_creditos);
    const money = this.listaMonedas.find((row: any) => row.langEN === event.value || row.code === event.value);
    cred.moneda_code = money.code;
    cred.moneda_decimales = money.decimales;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof money !== 'undefined' && cred.moneda_code != cred.moneda_code_resp;
    console.log(cred.moneda_code);
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  credLimiteCredito(token_creditos: any, event: any) {
    const cred = this.provDetalleData[0]["creditos"].find((row: any) => row.token_creditos === token_creditos);
    cred.limite = numeral(event.value).format('$0,0.00');
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true && cred.limite != cred.limite_resp;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  credDiasPagoCredito(token_creditos: any, event: any) {
    const cred = this.provDetalleData[0]["creditos"].find((row: any) => row.token_creditos === token_creditos);
    cred.dias = event.value;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true && cred.dias != cred.dias_resp;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  credComienzaPagoProv(token_creditos: any, event: any) {
    const cred = this.provDetalleData[0]["creditos"].find((row: any) => row.token_creditos === token_creditos);
    cred.comienza = event.value;
    const validacion = event.value != '' && this.validator.strFilEmp(event.value) == true && cred.comienza != cred.comienza_resp;
    validacion ? this.validator.correctoSelectBrowser(event) : this.validator.errorSelectBrowser(event);
  }

  creditosValidate(token_creditos: any): Boolean {
    const cred = this.provDetalleData[0]["creditos"].find((row: any) => row.token_creditos === token_creditos);
    const money = this.listaMonedas.find((row: any) => row.code === cred.moneda_code);
    const validacion_moneda_code = cred.moneda_code != "" && this.validator.filtroAlfaNumerico(cred.moneda_code) == true && typeof money !== 'undefined' && cred.moneda_code != cred.moneda_code_resp;
    const validacion_limite = cred.limite != "" && this.validator.filtroNum(cred.limite) == true && cred.limite != cred.limite_resp;
    const validacion_dias = cred.dias != '' && this.validator.filtroNum(cred.dias) == true && cred.dias != cred.dias_resp;
    const validacion_comienza = cred.comienza != '' && this.validator.strFilEmp(cred.comienza) == true && cred.comienza != cred.comienza_resp;
    return validacion_moneda_code || validacion_limite || validacion_dias || validacion_comienza;
  }

  seccionCreditosProv(token_cat_proveedores: any, creditos: any) {
    const index = this.provDetalleData[0];
    console.log(creditos.token_creditos);
    //return;
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

        if (creditos.token_creditos != "") {
          console.log(creditos.dias);
          this.proveedorServ.actualizaCreditosProv(
            token_cat_proveedores,
            creditos.token_creditos,
            creditos.acepta,
            creditos.moneda_code,
            creditos.moneda_decimales,
            creditos.limite,
            creditos.dias,
            creditos.comienza,
          ).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function () {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
                this.recargar_lista_proveedores();
                this.recargar_proveedores_mx();
                this.recargar_lista_proveedores_ext();
                this.bool_valida_creditos = false;
                this.infoProvDetalle(token_cat_proveedores);
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
            error => {
              //console.log(error);
            }
          )
        } else {
          this.proveedorServ.registraCreditosProv(
            token_cat_proveedores,
            this.decideaceptcredito,
            creditos.moneda_code,
            creditos.moneda_decimales,
            creditos.limite,
            creditos.dias,
            creditos.comienza,
          ).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function () {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
                this.recargar_lista_proveedores();
                this.recargar_proveedores_mx();
                this.recargar_lista_proveedores_ext();
                this.bool_valida_creditos = false;
                this.infoProvDetalle(token_cat_proveedores);
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
            error => {
              //console.log(error);
            }
          )
        }
      }
    })
  }

  elimninaCreditosProv(token_cat_proveedores: any, creditos_token_creditos: any) {
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
        this.proveedorServ.eliminaCreditosProv(token_cat_proveedores, creditos_token_creditos).subscribe(
          response => {
            console.log(response.message);
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.bool_valida_creditos = false;
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    })
  }

  //forma de cobro
  tieneFormaPagoProv(event: any) {
    event.checked == true ? $("#decideformapagoDetail").removeClass("noneView") : $("#decideformapagoDetail").addClass("noneView");
    this.provDetalleData[0]["forma_pago_tiene_edit"] = event.checked == true ? true : false;
    if (this.provDetalleData[0]["forma_pago_tiene_edit"] && this.listaFormasPagoIn.length === 0) this.listFormaPago();
  }

  changeFormaPagoAltaProv(event: any) {
    if (this.provDetalleData[0]["forma_pago_tiene_edit"] == true) {
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
        for (let i = 0; i < this.listaFormasPagoIn.length; i++) {
          const row = this.listaFormasPagoIn[i];
          if (row["forma"] == event.value) {
            this.validator.correctoInputRow(event);
            this.provDetalleData[0]["forma_pago_token_edit"] = row["token_formapago"];
            return;
          } else {
            this.validator.errorInputRow(event);
            this.provDetalleData[0]["forma_pago_token_edit"] = "";
          }
        }
      } else {
        this.validator.errorInputRow(event);
        this.provDetalleData[0]["forma_pago_token_edit"] = "";
        //M.toast({html: "forma de pago invalida, revisa tu información o comunicate a soporte", classes: 'rounded'});
      }
    } else {
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
        for (let i = 0; i < this.listaFormasPagoIn.length; i++) {
          const row = this.listaFormasPagoIn[i];
          if (row["forma"] == event.value) {
            this.validator.correctoInputRow(event);
            this.provDetalleData[0]["forma_pago_token_edit"] = row["token_formapago"];
            return;
          } else {
            this.validator.errorInputRow(event);
            this.provDetalleData[0]["forma_pago_token_edit"] = "";
          }
        }
      } else {
        this.validator.errorInputRow(event);
        this.provDetalleData[0]["forma_pago_token_edit"] = "";
        //M.toast({html: "forma de pago invalida, revisa tu información o comunicate a soporte", classes: 'rounded'});
      }
    }
  }

  cargaDocsEstadoCuenta(e: any) {
    var local = this;
    for (let i = 0; i < e.target.files.length; i++) {
      const document = e.target.files[i];
      let reader = new FileReader();
      reader.readAsDataURL(document);
      if (document.size <= 2000000 && this.validator.filtroTipoArchivo(document.type) == true) {
        this.typoEstadoCuenta = document.type;
        this.validator.correctoTR("#trDocEstadoCuenta");
        this.docEstadoCuenta = document;

        reader.onload = function (this) {
          //let imgPerfil = '<img class="responsive-img" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'">';
          //let imgPerfil = '<iframe id="framedocSituacionFiscal" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="'+reader.result+'" frameborder="0"></iframe>';
          local.regresaHtmlEstadoCuenta(reader.result);
        }
      } else {
        this.validator.errorTR("#trDocEstadoCuenta");
        this.typoEstadoCuenta = "";
        this.htmlEstadoCuenta = "";
        if (e.target.files[0].size > 2000000) {
          //M.toast({html: "Este documento excede el tamaño permitido (2MB)", classes: 'rounded'});
        }
        if (document.type != 'image/jpeg' && document.type != 'image/jpg' && document.type != 'image/png') {
          //M.toast({html: "Formato de documento es incorrecto, debe ser Pdf ó imagenes tipo jpg o png", classes: 'rounded'});
        }
      }
      console.log(this.htmlEstadoCuenta);
    }
  }

  regresaHtmlEstadoCuenta(text_document: any) {
    this.htmlEstadoCuenta = this.sanitizer.bypassSecurityTrustResourceUrl(text_document);
  }

  deleteDocEstadoCuenta() {
    var file_estado_cuenta = document.getElementById("file_estado_cuenta");
    this.htmlEstadoCuenta = "";
    this.docEstadoCuenta = "";
    this.validator.limpiaTR("#trDocCumplimientoObFiscales");
    this.validator.limpiaInputRow(file_estado_cuenta);
  }

  clickEscannerEstadoCuenta() {//readerSitFiscalProv
    var cameraId: any = '';
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        cameraId = devices[0].id;
        //console.log(cameraId);
      }
    }).catch(err => {
      // handle err
    });
    let config: any = { fps: 10, qrbox: { width: 250, height: 250 } };
    let codeQrstfiscal: any = new Html5QrcodeScanner("readerEstadoCuenta", config, false);
    codeQrstfiscal.render(this.scanYesEstadoCuenta, this.onScanErrorEstadoCuenta);
  }

  scanYesEstadoCuenta(decodedText: any, decodedResult: any) {//console.log(`Scan result: ${decodedText}`, decodedResult);
    global.imagenUrlClFrvQrEstcuenta = decodedText;
    $("#divImgClassEstadoCuenta").removeClass("btnError");
    let imgPerfil = '<iframe id="frameimagenAltaCumplimientoObFiscalProv" style="width: 100%!important; height: 100%!important;border-radius: 8px;position: relative;z-index: 0;" src="' + decodedText + '" frameborder="0"></iframe>';
    $("#divImgClassEstadoCuenta").html(imgPerfil);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'escaneo completado',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'my-swal-zindex'
      }
    })
  }

  onScanErrorEstadoCuenta(errorMessage: any) { console.log(`Code scan error = ${errorMessage}`); }

  decideTipoReferenciaPago(event: any, referenciaPago: any) {
    const prv = this.provDetalleData[0];
    $("#txtClabeInt").prop("checked", false);
    $("#txtConvenio").prop("checked", false);
    $("#txtLineaCap").prop("checked", false);

    if (referenciaPago != '' && this.validator.strFilEmp(referenciaPago) == true) {
      if (referenciaPago == "clabeInterbancaria") {
        prv.forma_pago_tipo_referencia = 'ci';
      } else if (referenciaPago == "convenio") {
        prv.forma_pago_tipo_referencia = 'co';
        prv.clabeInterbancariaPago = "000-000-00000000000-0";
      } else if (referenciaPago == "lineaCaptura") {
        prv.forma_pago_tipo_referencia = 'lc';
        prv.clabeInterbancariaPago = "000-000-00000000000-0";
      }
      $(event).prop("checked", true);
    } else {
      prv.forma_pago_tipo_referencia = "";
    }
  }

  keyupClabeIntBanc_banco(event: any) {
    if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 3) {
      this.clabeInterbancariaBanco = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.clabeInterbancariaBanco = "";
      this.validator.errorInputRow(event);
    }
    this.llenaClabeInterbancaria();
  }

  keyupClabeIntBanc_plaza(event: any) {
    if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 3) {
      this.clabeInterbancariaPlaza = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.clabeInterbancariaPlaza = "";
      this.validator.errorInputRow(event);
    }
    this.llenaClabeInterbancaria();
  }

  keyupClabeIntBanc_cuenta(event: any) {
    if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 11) {
      this.clabeInterbancariaCuenta = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.clabeInterbancariaCuenta = "";
      this.validator.errorInputRow(event);
    }
    this.llenaClabeInterbancaria();
  }

  keyupClabeIntBanc_control(event: any) {
    if (event.value != '' && this.validator.filtroCuenta(event.value) == true && event.value.length == 1) {
      this.clabeInterbancariaControl = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.clabeInterbancariaControl = "";
      this.validator.errorInputRow(event);
    }
    this.llenaClabeInterbancaria();
  }

  llenaClabeInterbancaria() {
    if ((this.clabeInterbancariaBanco != '' && this.validator.filtroCuenta(this.clabeInterbancariaBanco) == true && this.clabeInterbancariaBanco.length == 3) &&
      (this.clabeInterbancariaPlaza != '' && this.validator.filtroCuenta(this.clabeInterbancariaPlaza) == true && this.clabeInterbancariaPlaza.length == 3) &&
      (this.clabeInterbancariaCuenta != '' && this.validator.filtroCuenta(this.clabeInterbancariaCuenta) == true && this.clabeInterbancariaCuenta.length == 11) &&
      (this.clabeInterbancariaControl != '' && this.validator.filtroCuenta(this.clabeInterbancariaControl) == true && this.clabeInterbancariaControl.length == 1)) {
      this.clabeInterbancariaPago = this.clabeInterbancariaBanco + '-' + this.clabeInterbancariaPlaza + '-' + this.clabeInterbancariaCuenta + '-' + this.clabeInterbancariaControl;
    } else {
      this.clabeInterbancariaPago = "000-000-00000000000-0";
    }
  }

  keypressClabeIntBanc(event: any) {
    var clave = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!/^[0-9]*$/.test(clave)) {
      this.validator.deten(event);
    }
  }

  validaFormaPago(token_proveedor: any) {
    const prv = this.provDetalleData.find((row: any) => row.token_proveedor === token_proveedor);

    return ((prv.forma_pago_tiene && !prv.forma_pago_tiene_edit) ||
      (!prv.forma_pago_tiene && prv.forma_pago_tiene_edit && prv.forma_pago_token_edit != prv.forma_pago_token) ||
      (prv.forma_pago_tiene && prv.forma_pago_tiene_edit && prv.forma_pago_token_edit != prv.forma_pago_token)
    );
  }

  saveFormaPagoProv(token_cat_proveedores: any) {
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
        this.proveedorServ.actualizaFormaPagoProv(token_cat_proveedores, this.provDetalleData[0]["forma_pago_tiene_edit"], this.provDetalleData[0]["forma_pago_token_edit"]).subscribe(
          response => {
            console.log(response.message);
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
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
          error => {
            //console.log(error);
          }
        );
      }
    })
  }

  //facturacion
  recibeFactAntesDespues(token_cat_proveedores: any, event: any) {
    console.log(event.checked);
    if (event.checked == true) {
      this.proveedorServ.habilitaEmitirFacturaAntesPago(token_cat_proveedores).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function () {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }, 1000);
            this.recargar_lista_proveedores();
            this.recargar_proveedores_mx();
            this.recargar_lista_proveedores_ext();
            this.infoProvDetalle(token_cat_proveedores);
          }
          if (response.status == 'error') {
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
    } else {
      this.proveedorServ.deshabilitaEmitirFacturaAntesPago(token_cat_proveedores).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function () {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }, 1000);
            this.recargar_lista_proveedores();
            this.recargar_proveedores_mx();
            this.recargar_lista_proveedores_ext();
            this.infoProvDetalle(token_cat_proveedores);
          }
          if (response.status == 'error') {
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
    //
  }

  recibeProdAntesDespues(token_cat_proveedores: any, event: any) {
    console.log(event.checked);
    if (event.checked == true) {
      this.proveedorServ.habilitaEntregaDeProdAntesPago(token_cat_proveedores).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function () {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }, 1000);
            this.recargar_lista_proveedores();
            this.recargar_proveedores_mx();
            this.recargar_lista_proveedores_ext();
            this.infoProvDetalle(token_cat_proveedores);
          }
          if (response.status == 'error') {
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
    } else {
      this.proveedorServ.deshabilitaEntregaDeProdAntesPago(token_cat_proveedores).subscribe(
        response => {
          let translate_response = this.translate.instant(response.message);
          if (response.status == 'success') {
            setTimeout(function () {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }, 1000);
            this.recargar_lista_proveedores();
            this.recargar_proveedores_mx();
            this.recargar_lista_proveedores_ext();
            this.infoProvDetalle(token_cat_proveedores);
          }
          if (response.status == 'error') {
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
  }

  //ubicacion nacional
  verEditUbicacion(ubicacion: any) {
    this.editUbicacionSeccion = this.editUbicacionSeccion === ubicacion ? null : ubicacion;
  }

  buscaCodPostalDipomex(event: any) {
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
            this.dipomex_cod_postal_estado = response.cod_postal["estado"] + " (" + response.cod_postal["estado_abreviatura"] + ")";
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
            Swal.fire({ position: "top-end", icon: "warning", title: this.translate.instant(response.message), showConfirmButton: false, timer: 3000 })
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

  seleccionaColoniaCPDipomex(colonia_name: any) {
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

  actualizaUbicaDipoMexProv(token_cat_proveedores: any, token_direccion: any) {
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
        this.proveedorServ.dipoMexUpdateUbicaProv(token_cat_proveedores, token_direccion, this.dipomex_cod_postal_estado, this.dipomex_cod_postal_municipio, this.dipomex_cod_postal_cp, this.dipomex_cod_postal_colonia_vinculada).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
            }
            if (response.status == 'error') {
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
        );
      }
    });
  }

  keyupCPostal_EstName(event: any, token_direccion: any) {
    const index = this.provDetalleData[0]["ubicaciones"].findIndex((dir: any) => dir.token_direccion === token_direccion);
    let pos_dir = this.provDetalleData[0]["ubicaciones"][index];
    pos_dir["estado_edit"] = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && pos_dir["estado_edit"] != pos_dir["estado_main"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupCPostal_Municipio(event: any, token_direccion: any) {
    const index = this.provDetalleData[0]["ubicaciones"].findIndex((dir: any) => dir.token_direccion === token_direccion);
    let pos_dir = this.provDetalleData[0]["ubicaciones"][index];
    pos_dir["municipio_edit"] = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && pos_dir["municipio_edit"] != pos_dir["municipio_main"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupCPostal_CP(event: any, token_direccion: any) {
    const index = this.provDetalleData[0]["ubicaciones"].findIndex((dir: any) => dir.token_direccion === token_direccion);
    let pos_dir = this.provDetalleData[0]["ubicaciones"][index];
    pos_dir["c_postal_edit"] = event.value;
    if (event.value != "" && this.validator.filtroNum(event.value) == true && event.value.length == 5 && pos_dir["c_postal_edit"] != pos_dir["c_postal_main"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  keyupCPostal_Colonia(event: any, token_direccion: any) {
    const index = this.provDetalleData[0]["ubicaciones"].findIndex((dir: any) => dir.token_direccion === token_direccion);
    let pos_dir = this.provDetalleData[0]["ubicaciones"][index];
    pos_dir["colonia_edit"] = event.value;
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value) && pos_dir["colonia_edit"] != pos_dir["colonia_main"]) {
      this.validator.correctoInputRow(event);
    } else {
      this.validator.errorInputRow(event);
    }
  }

  validatecPostal(token_direccion: any) {
    const index = this.provDetalleData[0]["ubicaciones"].findIndex((dir: any) => dir.token_direccion === token_direccion);
    let pos_dir = this.provDetalleData[0]["ubicaciones"][index];
    return (
      (pos_dir["estado_edit"] != "" && this.validator.filtroAlfaNumerico(pos_dir["estado_edit"]) == true && pos_dir["estado_edit"] != pos_dir["estado_main"]) ||
      (pos_dir["municipio_edit"] != "" && this.validator.filtroAlfaNumerico(pos_dir["municipio_edit"]) == true && pos_dir["estado_edit"] != pos_dir["estado_main"]) ||
      (pos_dir["c_postal_edit"] != "" && this.validator.filtroNum(pos_dir["c_postal_edit"]) == true && pos_dir["c_postal_edit"].length == 5 && pos_dir["c_postal_edit"] != pos_dir["c_postal_main"]) ||
      (pos_dir["colonia_edit"] != "" && this.validator.filtroAlfaNumerico(pos_dir["colonia_edit"]) == true && pos_dir["colonia_edit"] != pos_dir["colonia_main"])
    );
  }

  actualizaUbicacionProv(token_cat_proveedores: any, token_direccion: any) {
    const index = this.provDetalleData[0]["ubicaciones"].findIndex((dir: any) => dir.token_direccion === token_direccion);
    let pos_dir = this.provDetalleData[0]["ubicaciones"][index];
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
        this.proveedorServ.noApiUpdateUbicaProv(token_cat_proveedores, token_direccion, pos_dir["estado_edit"], pos_dir["municipio_edit"], pos_dir["c_postal_edit"], pos_dir["colonia_edit"]).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(function () {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
              this.infoProvDetalle(token_cat_proveedores);
            }
            if (response.status == 'error') {
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
        );
      }
    });
  }

  deleteListCPostal(posicion: any) {
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
        this.listnewdireccionNac.splice(posicion, 1);
        if (this.listnewdireccionNac.length == 0) {
          this.validateDipoMexUbica = false;
          //this.activaFunctionRegistro();
        }
      }
    });
  }

  matarProveedor(token_cat_proveedores: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar este proveedor?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorServ.movetorecycleprov(token_cat_proveedores).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
            }
            if (response.status == 'error') {
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
      } else {

      }
    });
  }

  reviveProveedor(token_cat_proveedores: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea restaurar este proveedor?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorServ.reviveProveedor(token_cat_proveedores).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
            }
            if (response.status == 'error') {
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
      } else {

      }
    });
  }

  rematarProveedor(token_cat_proveedores: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar permanentemente este proveedor?",
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: 'Sí, actualizar',
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorServ.remataProveedor(token_cat_proveedores).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
              this.recargar_lista_proveedores();
              this.recargar_proveedores_mx();
              this.recargar_lista_proveedores_ext();
            }
            if (response.status == 'error') {
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
      } else {

      }
    });
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
