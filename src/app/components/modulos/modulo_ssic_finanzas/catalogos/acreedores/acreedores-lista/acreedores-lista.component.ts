import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { AcreedoresService } from '../../../../../../servicios/acreedores.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { acreedoresModelo } from '../../../../../../modelos/acreedoresModelo';
import Swal from 'sweetalert2';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import emailjs from '@emailjs/browser';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { Table } from 'primeng/table';
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { RegimenFiscalService } from '../../../../../../servicios/regimen-fiscal.service';

@Component({
  selector: 'app-acreedores-lista',
  standalone: false,
  
  templateUrl: './acreedores-lista.component.html',
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
    './acreedores-lista.component.css']
})
export class AcreedoresListaComponent implements OnInit{
  search_acree_filtro:any = [];
  list_acreedores_general:any = [];
  indicadorAcree:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoAcree: Date[] | undefined;

  list_acreedores_mx:any = [];
  indicadorMXAcree:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoMXAcree: Date[] | undefined;

  list_acreedores_ext:any = [];
  indicadorEXTAcree:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoEXTAcree: Date[] | undefined;
  
  arrayCatacreeDeleted:any = [];

  listaRelationsNombres:any = [];
  listaRelationsTrab:any = [];
  listaRelationsProv:any = [];
  listaRelationsDeu:any = [];

  AllRegFisArray:any = [];
  PfAllRegFisArray:any = [];
  PmAllRegFisArray:any = [];
  public acree_reg_fiscal:string = "";

  acreeDetalleData:any = [];
  formAcreedor!: FormGroup;
  public acreeModelo: acreedoresModelo;

  public vClasificacionProv:string = "";
  public vSubClasificacionProv:string = "";
  public validateRfcExtBool:boolean = true;
  public validateIdTaxBool:boolean = true;
  public validateFoundProv:boolean = false;
  arrayEmpleados:any = [];

  //rfcs
  public rfcGenericoPF:string = "xaxx010101000";
  public rfcGenericoPM:string = "xax010101000";
  public rfcGenericoExt:string = "xexx010101000";
  @ViewChild('acrGralList') table_acr!: Table;

  constructor(
    private translate:TranslateService,
    public validator:ValidatorServService,
    public acreedServ:AcreedoresService,
    private encryptor:ServEncryptService,
    private _persServ:EmpleadosService,
    private relInterna:ComunicacionInternaService,
    private servXlsx:DescargaExcel,
    private _regimen:RegimenFiscalService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ){
    this.acreeModelo = new acreedoresModelo("","","","","","","",false,"","","","","","");
    this.formAcreedor = this.fb.group({
      regimen_fiscal: [this.acreeModelo.regimen_fiscal_desc || null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaAcrRegistro();
    this.catalogo_acreedores('hoy');
    this.ver_acreedores_mx('hoy');
    this.ver_acreedores_ext('hoy');
    this.lista_acredores_eliminados();
    this.search_acree_filtro = ['token_cat_acreedores','folio','acr_rfc','acr_taxId','acr_titular','nombre_comercial','cuenta_contable','trab_folio','trab_nombre',
      'prov_folio','prov_nombre','deu_folio','deu_nombre','deuda_al_acreedor','eliminacion_activa','utilizado'];
  }

  getRegimenesFiscales(){
    this._regimen.getAllRegimenFiscal().subscribe((data) => {
      this.AllRegFisArray = data.status == 'success' ? data.listRegFisc : [];
      data.status == 'success' ? console.log(this.AllRegFisArray) : null;
    });
    this._regimen.getPfRegimenFiscal().subscribe((data) => {
      this.PfAllRegFisArray = data.status == 'success' ? data.listRegFisc : [];
      data.status == 'success' ? console.log(this.PfAllRegFisArray) : null;
    });
    this._regimen.getPmRegimenFiscal().subscribe((data) => {
      this.PmAllRegFisArray = data.status == 'success' ? data.listRegFisc : [];
      data.status == 'success' ? console.log(this.PmAllRegFisArray) : null;
    });
  }

  listando_personal(){
    this.acreedServ.acreedoresNombresRelacionados().subscribe(
      response => {
        this.listaRelationsNombres = response.status == 'success' ? response.nombres_relacionados : [];
        this.listaRelationsTrab = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "TRAB");
        this.listaRelationsProv = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "PROV");
        this.listaRelationsDeu = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "DEU");
        response.status == 'success' ? console.log(this.listaRelationsNombres) : null;
      },
      error => {
        console.log(error);
      }
    );
  }

  getRespuestaAcrRegistro(){
    this.relInterna.mensajeInsertAcreedor$.subscribe(
      (mensaje:any) => {
        if (mensaje == "nuevo acreedor registrado") {
          this.lista_acreedores();
          this.lista_acreedores_mx();
          this.lista_acreedores_ext();
        }
      }
    );
  }

  lista_acreedores() {
    this.catalogo_acreedores(this.indicadorAcree);
  }

  catalogo_acreedores(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorAcree = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var acree_gral_otras_fechas = document.getElementById("acree_gral_otras_fechas");
      if (this.rangoPeriodoAcree && this.rangoPeriodoAcree[1]) {
        const dateInicio = this.rangoPeriodoAcree[0];
        const dateFin = this.rangoPeriodoAcree[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(acree_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(acree_gral_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(acree_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(acree_gral_otras_fechas);
      }
    }

    this.acreedServ.catalogoAcreedoresGeneral(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaAcree(response),
      error: (err) => this.manejarErrorAcree(err)
    });
  }

  private procesarRespuestaAcree(response: any) {
    if (response.status === 'success') {
      console.log(response);
      response.acreedores.sort((a:any,b:any) => a.acr_titular.localeCompare(b.acr_titular));
      this.list_acreedores_general = response.acreedores;
      this.cd.detectChanges();
    } else {
      this.list_acreedores_general = [];
    }
  }

  private manejarErrorAcree(error: any) {
    console.error('Error al cargar acreedores:', error);
    this.list_acreedores_general = [];
  }

  lista_acreedores_mx() {
    this.ver_acreedores_mx(this.indicadorMXAcree);
  }

  ver_acreedores_mx(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorMXAcree = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var acree_mx_otras_fechas = document.getElementById("acree_mx_otras_fechas");
      if (this.rangoPeriodoMXAcree && this.rangoPeriodoMXAcree.length === 2) {
        const dateInicio = this.rangoPeriodoMXAcree[0];
        const dateFin = this.rangoPeriodoMXAcree[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(acree_mx_otras_fechas);
          } else {
            this.validator.errorInputRow(acree_mx_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(acree_mx_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(acree_mx_otras_fechas);
      }
    }
    
    this.acreedServ.catalogoAcreedoresMX(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaMXAcree(response),
      error: (err) => this.manejarErrorMXAcree(err)
    });
  }

  private procesarRespuestaMXAcree(response: any) {
    if (response.status === 'success') {
      response.acreedores.sort((a:any,b:any) => a.acr_titular.localeCompare(b.acr_titular));
      this.list_acreedores_mx = response.acreedores;
      this.cd.detectChanges();
    } else {
      this.list_acreedores_mx = [];
    }
  }

  private manejarErrorMXAcree(error: any) {
    console.error('Error al cargar acreedores:', error);
    this.list_acreedores_mx = [];
  }

  lista_acreedores_ext() {
    this.ver_acreedores_ext(this.indicadorEXTAcree);
  }

  ver_acreedores_ext(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorEXTAcree = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var ext_acree_otras_fechas = document.getElementById("ext_acree_otras_fechas");
      if (this.rangoPeriodoEXTAcree && this.rangoPeriodoEXTAcree.length === 2) {
        const dateInicio = this.rangoPeriodoEXTAcree[0];
        const dateFin = this.rangoPeriodoEXTAcree[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(ext_acree_otras_fechas);
          } else {
            this.validator.errorInputRow(ext_acree_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(ext_acree_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(ext_acree_otras_fechas);
      }
    }
    
    this.acreedServ.catalogoAcreedoresExtranjeros(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaExtAcree(response),
      error: (err) => this.manejarErrorExtAcree(err)
    });
  }

  private procesarRespuestaExtAcree(response: any) {
    if (response.status === 'success') {
      response.acreedores.sort((a:any,b:any) => a.acr_titular.localeCompare(b.acr_titular));
      this.list_acreedores_ext = response.acreedores;
      this.cd.detectChanges();
    } else {
      this.list_acreedores_ext = [];
    }
  }

  private manejarErrorExtAcree(error: any) {
    console.error('Error al cargar acreedores:', error);
    this.list_acreedores_ext = [];
  }

  descarga_excel_acreedores(){ 
    const columnas:ExcelColumnas[] = [
      {label: "folio", field: "folio", align: "center"},
      {label: "rfc", field: "acr_rfc", align: "center"},
      {label: "idTax", field: "acr_taxId", align: "center"},
      {label: "acreedor", field: "acr_titular", align: "left"},
      {label: this.translate.instant("comercial_name"), field: "nombre_comercial", align: "left"},
      {label: "cuenta_contable", field: "cuenta_contable", align: "center"},
      {label: "empleado vinculado", field: "trab_nombre", align: "left"},
      {label: "proveedor vinculado", field: "prov_nombre", align: "left"},
      {label: "deudor vinculado", field: "deu_nombre", align: "left"},
      {label: "Deuda al acreedor", field: "deuda_al_acreedor", align: "right"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.list_acreedores_general,columnas,'Acreedores','catálogo de acreedores.xlsx');
  }

  infoAcreeDetalle(token_cat_acreedores:any){
    this.acreedServ.verDetalleAcreedorGenerales(token_cat_acreedores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.acreeDetalleData = response.acreedor;
          this.acreeDetalleData.forEach((row:any) => {
            console.log(row.habilita_reembolsos);
            //this.formAcreedor.get('tipoAcree')?.setValue(row.tipo);
            this.acreeModelo.tipoAcree = row.tipo;
            //this.formAcreedor.get('subtipoAcree')?.setValue(row.subtipo);
            this.acreeModelo.subtipoAcree = row.subtipo;
            //this.formAcreedor.get('rfc')?.setValue(row.rfc_acr);
            this.acreeModelo.rfc = row.rfc_acr;
            //this.formAcreedor.get('taxID')?.setValue(row.tax_id_acr);
            this.acreeModelo.taxID = row.tax_id_acr;
            //this.formAcreedor.get('nombre')?.setValue(row.nombre);
            this.acreeModelo.nombre = row.nombre;
            //this.formAcreedor.get('nombre_comercial')?.setValue(row.nombre_comercial);
            this.acreeModelo.nombre_comercial = row.nombre_comercial;
            //this.formAcreedor.get('correo_electronico')?.setValue(row.email);
            this.acreeModelo.correo_electronico = row.email;
            //this.formAcreedor.get('habilita_reembolsos')?.setValue(row.habilita_reembolsos);
            this.acreeModelo.habilita_reembolsos = row.habilita_reembolsos;
            //this.formAcreedor.get('habilita_reembolsos')?.setValue(row.habilita_reembolsos);
            this.acreeModelo.regimen_fiscal = row.regimen_fiscal_token;
            this.acreeModelo.regimen_fiscal_desc = row.regimen_fiscal_desc;
            this.formAcreedor.patchValue({regimen_fiscal: row.regimen_fiscal_desc});
            //this.formAcreedor.get('cuenta_contable')?.setValue(row.cuenta_contable);
            this.acreeModelo.cuenta_contable = row.cuenta_contable;
            this.acreeModelo.trabajador_vinculado = row.trabajador_vinculado;
            this.acreeModelo.proveedor_vinculado = row.proveedor_vinculado;
            this.acreeModelo.deudor_vinculado = row.deudor_vinculado;
          });
          if (this.listaRelationsNombres.length === 0) this.listando_personal();
          if (this.AllRegFisArray.length === 0) this.getRegimenesFiscales();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  letreroRFCNacional():string{
    var letrero = "";
    if (this.acreeModelo.tipoAcree == 'extranjero' || this.acreeModelo.subtipoAcree == '') {
      letrero = "Escriba su rfc con Homoclave";
    } else {
      switch (this.acreeModelo.subtipoAcree) {
        case 'provFisica':
          letrero = "Escriba su rfc con Homoclave (13 caracteres)";
          break;
        case 'provMoral':
          letrero = "Escriba su rfc con Homoclave (12 caracteres)";
          break;
        default:
          letrero = "";
          break;
      }
    }
    return letrero;
  }

  tipoSeleccionado(tipo: string) {
    //this.formAcreedor.patchValue({ tipoAcree: tipo, subtipoAcree: subtipo });
    this.acreeModelo.tipoAcree = tipo;
    this.acreeModelo.subtipoAcree = ''; 
  }

  get esVacio():Boolean {
    return this.acreeModelo.tipoAcree === '';
  }

  get esNacional():Boolean {
    return this.acreeModelo.tipoAcree === 'nacional';
  }

  get esExtranjero():Boolean {
    return this.acreeModelo.tipoAcree === 'extranjero';
  }

  limitarLongitudRfc(event: any, max: number): void {
    const input = event.target;
    if (input.value.length > max) {
      input.value = input.value.slice(0, max);
    }
  }

  validaAcreeRfc(event:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    this.acreeModelo.rfc = event.value;
    const v_rfc_fis = this.acreeModelo.subtipoAcree === 'acreeFisica' && this.validator.filtroRfcPersFisica(event.value);
    const v_rfc_mor = this.acreeModelo.subtipoAcree === 'acreeMoral' && this.validator.filtroRfcPersMoral(event.value);
    const validacion = event.value != '' && (v_rfc_fis || v_rfc_mor) && typeof acreD !== 'undefined' && this.acreeModelo.rfc != acreD.rfc_acr;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupverif_TaxIdAcree(event:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    this.acreeModelo.taxID = event.value;
    const validacion = event.value != "" && event.value.length >= 9 && event.value.length <= 40 && this.validator.strFilEmp(event.value) && typeof acreD !== 'undefined' && this.acreeModelo.taxID != acreD.tax_id_acr;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNombreAcree(event:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    this.acreeModelo.nombre = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof acreD !== 'undefined' && this.acreeModelo.nombre != acreD.nombre;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNombreComercialAcree(event:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    this.acreeModelo.nombre_comercial = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof acreD !== 'undefined' && this.acreeModelo.nombre_comercial != acreD.nombre_comercial;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupMailAcree(event:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    this.acreeModelo.correo_electronico = event.value;
    const validacion = event.value != "" && this.validator.filtroCorreo(event.value) && typeof acreD !== 'undefined' && this.acreeModelo.correo_electronico != acreD.correo_electronico;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCuentaContableAcree(event:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    this.acreeModelo.cuenta_contable = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof acreD !== 'undefined' && this.acreeModelo.cuenta_contable != acreD.cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectHabilitaReembolsos(event:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    this.acreeModelo.habilita_reembolsos = event.checked ? true : false;
  }

  changeRegimenFiscal(opcion:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    var selectedFiscalRegimen = document.getElementById("selectedFiscalRegimen");
    const regfis = this.AllRegFisArray.find((row:any) => row.token_regimen_fiscal === opcion.token_regimen_fiscal);
    this.acreeModelo.regimen_fiscal = regfis.token_regimen_fiscal;
    const validacion = opcion.token_regimen_fiscal != '' && typeof regfis !== 'undefined' && typeof acreD !== 'undefined' && this.acreeModelo.regimen_fiscal != acreD.regimen_fiscal_token;
    validacion ? this.validator.correctoInputRow(selectedFiscalRegimen) : this.validator.errorInputRow(selectedFiscalRegimen);
  }

  decideVinculaTrab(event:any){
    event.checked ? $("#decideinfoDetWorker").removeClass("noneView") : $("#decideinfoDetWorker").addClass("noneView");
  }

  vincula_select_trabajador(people_relacionado_token:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsTrab.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    this.acreeModelo.trabajador_vinculado = names.people_relacionado_token;
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined' && typeof acreD !== 'undefined' && this.acreeModelo.trabajador_vinculado != acreD.trabajador_vinculado;
    if (validacion) {
      this.listaRelationsTrab.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  decideVinculaProv(event:any){
    event.checked ? $("#decideinfoDetProv").removeClass("noneView") : $("#decideinfoDetProv").addClass("noneView");
  }

  vincula_select_proveedor(people_relacionado_token:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsProv.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    this.acreeModelo.proveedor_vinculado = names.people_relacionado_token;
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined' && typeof acreD !== 'undefined' && this.acreeModelo.proveedor_vinculado != acreD.proveedor_vinculado;
    if (validacion) {
      this.listaRelationsProv.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  decideocupaDeudor(event:any){
    event.checked ? $("#decideinfoDetDeu").removeClass("noneView") : $("#decideinfoDetDeu").addClass("noneView");
  }

  vincula_select_deudor(people_relacionado_token:any,token_cat_acreedores:string){
    const acreD = this.acreeDetalleData.find((acr:any) => acr.token_cat_acreedores === token_cat_acreedores);
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsDeu.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    this.acreeModelo.deudor_vinculado = names.people_relacionado_token;
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined' && typeof acreD !== 'undefined' && this.acreeModelo.deudor_vinculado != acreD.deudor_vinculado;
    if (validacion) {
      this.listaRelationsDeu.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  validaAcreedorRegistro(token_cat_acreedores:any):Boolean{
    const acre_row = this.acreeDetalleData.find((row:any) => row.token_cat_acreedores === token_cat_acreedores);
    const tipoAcree = this.acreeModelo.tipoAcree;
    const subtipoAcree = this.acreeModelo.subtipoAcree;
    const rfc = this.acreeModelo.rfc;
    const taxID = this.acreeModelo.taxID;
    const nombre = this.acreeModelo.nombre;
    const nombre_comercial = this.acreeModelo.nombre_comercial;
    const correo_electronico = this.acreeModelo.correo_electronico;
    const cuenta_contable = this.acreeModelo.cuenta_contable;
    const habilita_reembolsos = this.acreeModelo.habilita_reembolsos;
    const regimen_fiscal = this.acreeModelo.regimen_fiscal;
    const trabajador_vinculado = this.acreeModelo.trabajador_vinculado;
    const proveedor_vinculado = this.acreeModelo.proveedor_vinculado;
    const deudor_vinculado = this.acreeModelo.deudor_vinculado;

    const valida_tipoAcree = tipoAcree != "" && tipoAcree != acre_row.tipo;
    const valida_subtipoAcree = subtipoAcree != "" && subtipoAcree != acre_row.subtipo;
    const valida_rfc = rfc != '' && ((subtipoAcree === 'acreeFisica' && this.validator.filtroRfcPersFisica(rfc)) || subtipoAcree === 'acreeMoral' && this.validator.filtroRfcPersMoral(rfc)) && rfc != acre_row.rfc_acr;
    const valida_taxID = taxID != "" && taxID.length >= 9 && taxID.length <= 40 && this.validator.strFilEmp(taxID) && taxID != acre_row.tax_id_acr;
    const valida_nombre = nombre != "" && this.validator.filtroAlfaNumerico(nombre) && nombre.length > 4 && nombre != acre_row.nombre;
    const valida_nombre_comercial = nombre_comercial != "" && this.validator.filtroAlfaNumerico(nombre_comercial) && nombre_comercial.length > 4 && nombre_comercial != acre_row.nombre_comercial;
    const valida_correo_electronico = correo_electronico != "" && this.validator.filtroCorreo(correo_electronico) && correo_electronico != acre_row.email;
    const valida_cuenta_contable = cuenta_contable != "" && this.validator.filtroAlfaNumerico(cuenta_contable) && cuenta_contable != acre_row.cuenta_contable;
    const valida_habilita_reembolsos = habilita_reembolsos != acre_row.habilita_reembolsos;
    const valida_regimen_fiscal = regimen_fiscal != "" && regimen_fiscal != acre_row.regimen_fiscal_token;
    const valida_vinc_trabajador = trabajador_vinculado != "" && trabajador_vinculado != acre_row.trabajador_vinculado;
    const valida_vinc_proveedor = proveedor_vinculado != "" && proveedor_vinculado != acre_row.proveedor_vinculado;
    const valida_vinc_deudor = deudor_vinculado != "" && deudor_vinculado != acre_row.deudor_vinculado;
    return valida_tipoAcree || valida_subtipoAcree || valida_rfc || valida_taxID || valida_nombre || valida_nombre_comercial || valida_correo_electronico || valida_cuenta_contable || valida_habilita_reembolsos || 
    valida_regimen_fiscal || valida_vinc_trabajador || valida_vinc_proveedor || valida_vinc_deudor;
  }

  actualizarAcreedor(token_cat_acreedores:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.acreedServ.actualizaAcreedor(token_cat_acreedores,this.acreeModelo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              Swal.fire({
                position:"center",
                icon: "success",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000,
                customClass: {
                  popup: 'my-swal-zindex'
                }
              });
              this.lista_acreedores();
              this.lista_acreedores_mx();
              this.lista_acreedores_ext();
              this.infoAcreeDetalle(token_cat_acreedores);
            }
            if (response.status == "error") {
              Swal.fire({
                position:"top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton:false,
                timer: 3000,
                customClass: {
                  popup: 'my-swal-zindex'
                }
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

  mataracreedor(token_cat_acreedores:any){
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
        this.acreedServ.moverAPapeleraAcree(token_cat_acreedores).subscribe(
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
              this.lista_acreedores();
              this.lista_acreedores_mx();
              this.lista_acreedores_ext();
              this.lista_acredores_eliminados();
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

  lista_acredores_eliminados(){
    this.acreedServ.acredoresEliminados().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          response.acreedores.sort((a:any,b:any) => a.acr_titular.localeCompare(b.acr_titular));
          this.arrayCatacreeDeleted = response.acreedores;
          //arrayCatacreeDeleted:any = [];
          //search_acree_deleted_view:any;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  reviveAcreedor(token_cat_acreedores:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_restore"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_restore"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.acreedServ.restaurarAcreedor(token_cat_acreedores).subscribe(
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
              this.lista_acreedores();
              this.lista_acreedores_mx();
              this.lista_acreedores_ext();
              this.lista_acredores_eliminados();
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
							
  rematarAcreedor(token_cat_acreedores:any){
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
        this.acreedServ.eliminarAcreedor(token_cat_acreedores).subscribe(
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
              this.lista_acreedores();
              this.lista_acreedores_mx();
              this.lista_acreedores_ext();
              this.lista_acredores_eliminados();
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
