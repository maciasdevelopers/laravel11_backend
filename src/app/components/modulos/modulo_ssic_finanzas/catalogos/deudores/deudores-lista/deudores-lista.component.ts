import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DeudoresService } from '../../../../../../servicios/deudores.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { deudoresModelo } from '../../../../../../modelos/deudoresModelo';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { ServEncryptService } from '../../../../../../servicios/ssic/serv-encrypt.service';
import Swal from 'sweetalert2';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { Table } from 'primeng/table';
import { DescargaExcel } from '../../../../../../servicios/descarga-excel';
import { ExcelColumnas } from '../../../../../../interfaces/ExcelColumnas';
import { RegimenFiscalService } from '../../../../../../servicios/regimen-fiscal.service';

@Component({
  selector: 'app-deudores-lista',
  standalone: false,
  
  templateUrl: './deudores-lista.component.html',
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
    './deudores-lista.component.css']
})
export class DeudoresListaComponent implements OnInit{
  search_deu_filtro:any = [];
  list_deudores_general:any = [];
  indicadorDeudores:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoDeudores: Date[] | undefined;
  
  list_deudores_mx:any = [];
  indicadorMXDeudores:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoMXDeudores: Date[] | undefined;

  list_deudores_ext:any = [];
  indicadorEXTDeudores:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoEXTDeudores: Date[] | undefined;

  arrayCatdeuDeleted:any = [];

  listaRelationsNombres:any = [];
  listaRelationsTrab:any = [];
  listaRelationsProv:any = [];
  listaRelationsAcr:any = [];

  AllRegFisArray:any = [];
  PfAllRegFisArray:any = [];
  PmAllRegFisArray:any = [];
  public deu_reg_fiscal:string = "";

  deudorDetalleData:any = [];
  formDeudor!: FormGroup;
  public deudorModelo: deudoresModelo;

  arrayEmpleados:any = [];
  selectedEmpleado:any;
  @ViewChild('deuGralList') table_deu!: Table;

  constructor(
    private translate:TranslateService,
    public validator:ValidatorServService,
    public deudorServ:DeudoresService,
    private _persServ:EmpleadosService,
    private encryptor:ServEncryptService,
    private relInterna:ComunicacionInternaService,
    private servXlsx:DescargaExcel,
    private _regimen:RegimenFiscalService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ){
    this.deudorModelo = new deudoresModelo("","","","","","","",false,"","","","","");
    this.formDeudor = this.fb.group({
      regimen_fiscal: [this.deudorModelo.regimen_fiscal || null],
    });
  }

  ngOnInit(): void {
    this.getRespuestaDeudorRegistro();
    this.ver_lista_deudores('hoy');
    this.ver_deudores_mx('hoy');
    this.ver_deudores_ext('hoy');
    //this.listando_personal();
    //this.lista_deudores_eliminados();
    //this.getRegimenesFiscales();
    this.search_deu_filtro = ['token_cat_deudores','folio','deu_rfc','deu_taxId','deu_titular','nombre_comercial','cuenta_contable','trab_folio','trab_nombre',
      'prov_folio','prov_nombre','acr_folio','acr_nombre','deuda_al_deudor','utilizado'];
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
    this.deudorServ.deudoresNombresRelacionados().subscribe(
      response => {
        this.listaRelationsNombres = response.status == 'success' ? response.nombres_relacionados : [];
        this.listaRelationsTrab = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "TRAB");
        this.listaRelationsProv = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "PROV");
        this.listaRelationsAcr = this.listaRelationsNombres.filter((row:any) => row.people_relacionado_tipo === "ACREE");
        response.status == 'success' ? console.log(this.listaRelationsNombres) : null;
      },
      error => {
        console.log(error);
      }
    );
  }

  getRespuestaDeudorRegistro(){
    this.relInterna.mensajeInsertDeudores$.subscribe(
      (mensaje:any) => {
        if (mensaje == "nuevo deudor registrado") {
          this.lista_deudores();
          this.lista_deudores_mx();
          this.lista_deudores_ext();
        }
      }
    );
  }

  lista_deudores() {
    this.ver_lista_deudores(this.indicadorDeudores);
  }

  ver_lista_deudores(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorDeudores = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var deu_gral_otras_fechas = document.getElementById("deu_gral_otras_fechas");
      if (this.rangoPeriodoDeudores && this.rangoPeriodoDeudores[1]) {
        const dateInicio = this.rangoPeriodoDeudores[0];
        const dateFin = this.rangoPeriodoDeudores[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(deu_gral_otras_fechas);
          } else {
            this.validator.errorInputRow(deu_gral_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(deu_gral_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(deu_gral_otras_fechas);
      }
    }

    this.deudorServ.catalogoDeudoresGeneral(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaDeudores(response),
      error: (err) => this.manejarErrorDeudores(err)
    });
  }

  private procesarRespuestaDeudores(response: any) {
    if (response.status === 'success') {
      response.deudores.sort((a:any,b:any) => a.deu_titular.localeCompare(b.deu_titular));
      this.list_deudores_general = response.deudores;
      this.cd.detectChanges();
    } else {
      this.list_deudores_general = [];
    }
  }

  private manejarErrorDeudores(error: any) {
    console.error('Error al cargar deudores:', error);
    this.list_deudores_general = [];
  }

  lista_deudores_mx() {
    this.ver_deudores_mx(this.indicadorMXDeudores);
  }

  ver_deudores_mx(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorMXDeudores = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var deu_mx_otras_fechas = document.getElementById("deu_mx_otras_fechas");
      if (this.rangoPeriodoMXDeudores && this.rangoPeriodoMXDeudores.length === 2) {
        const dateInicio = this.rangoPeriodoMXDeudores[0];
        const dateFin = this.rangoPeriodoMXDeudores[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(deu_mx_otras_fechas);
          } else {
            this.validator.errorInputRow(deu_mx_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(deu_mx_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(deu_mx_otras_fechas);
      }
    }
    
    this.deudorServ.catalogoDeudoresMX(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaDeuMX(response),
      error: (err) => this.manejarErrorDeuMX(err)
    });
  }

  private procesarRespuestaDeuMX(response: any) {
    if (response.status === 'success') {
      response.deudores.sort((a:any,b:any) => a.deu_titular.localeCompare(b.deu_titular));
      this.list_deudores_mx = response.deudores;
      this.cd.detectChanges();
    } else {
      this.list_deudores_mx = [];
    }
  }

  private manejarErrorDeuMX(error: any) {
    console.error('Error al cargar deudores:', error);
    this.list_deudores_mx = [];
  }

  lista_deudores_ext() {
    this.ver_deudores_ext(this.indicadorEXTDeudores);
  }

  ver_deudores_ext(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorEXTDeudores = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var deu_ext_otras_fechas = document.getElementById("deu_ext_otras_fechas");
      if (this.rangoPeriodoEXTDeudores && this.rangoPeriodoEXTDeudores.length === 2) {
        const dateInicio = this.rangoPeriodoEXTDeudores[0];
        const dateFin = this.rangoPeriodoEXTDeudores[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(deu_ext_otras_fechas);
          } else {
            this.validator.errorInputRow(deu_ext_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(deu_ext_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(deu_ext_otras_fechas);
        return;
      }
    }
    
    this.deudorServ.catalogoDeudoresExtranjeros(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaDeuEXT(response),
      error: (err) => this.manejarErrorDeuEXT(err)
    });
  }

  private procesarRespuestaDeuEXT(response: any) {
    if (response.status === 'success') {
      response.deudores.sort((a:any,b:any) => a.deu_titular.localeCompare(b.deu_titular));
      this.list_deudores_ext = response.deudores;
      this.cd.detectChanges();
    } else {
      this.list_deudores_ext = [];
    }
  }

  private manejarErrorDeuEXT(error: any) {
    console.error('Error al cargar deudores:', error);
    this.list_deudores_ext = [];
  }

  descarga_excel_deudores(){ 
    const columnas:ExcelColumnas[] = [
      {label: "folio", field: "folio", align: "center"},
      {label: "rfc", field: "rfc_deu", align: "center"},
      {label: "idTax", field: "tax_id_deu", align: "center"},
      {label: "deudor", field: "deu_titular", align: "left"},
      {label: this.translate.instant("comercial_name"), field: "nombre_comercial", align: "left"},
      {label: "cuenta_contable", field: "cuenta_contable", align: "center"},
      {label: "empleado vinculado", field: "trab_complete_nombre", align: "left"},
      {label: "proveedor vinculado", field: "prov_complete_nombre", align: "left"},
      {label: "acreedor vinculado", field: "acr_complete_nombre", align: "left"},
      {label: "Deuda al deudor", field: "deuda_al_deudor", align: "right"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.list_deudores_general,columnas,'Deudores','catálogo de deudores.xlsx');
  }

  infodeuDetalle(token_cat_deudores:any){
    this.deudorServ.verDetalleDeudorGenerales(token_cat_deudores).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.deudorDetalleData = response.deudor;
          this.deudorDetalleData.forEach((row:any) => {
            console.log(row.habilita_reembolsos);
            this.formDeudor.get('tipoDeudor')?.setValue(row.tipo);
            this.formDeudor.get('subtipoDeudor')?.setValue(row.subtipo);
            this.formDeudor.get('rfc')?.setValue(row.rfc_ddr);
            this.formDeudor.get('taxID')?.setValue(row.tax_id_ddr);
            this.formDeudor.get('nombre')?.setValue(row.nombre);
            this.formDeudor.get('nombre_comercial')?.setValue(row.nombre_comercial);
            this.formDeudor.get('correo_electronico')?.setValue(row.email);
            this.formDeudor.get('empleado_vinculado')?.setValue(row.empleado_vinculado);
            this.formDeudor.get('habilita_deudor_reembolsos')?.setValue(row.habilita_reembolsos);
            this.formDeudor.get('cuenta_contable')?.setValue(row.cuenta_contable);
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  letreroRFCNacional():string{
    var letrero = "";
    if (this.deudorModelo.tipoDeudor == 'extranjero' || this.deudorModelo.subtipoDeudor == '') {
      letrero = "Escriba su rfc con Homoclave";
    } else {
      switch (this.deudorModelo.subtipoDeudor) {
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

  tipoSeleccionado(tipo: string, subtipo: string) {
    console.log(tipo);
    this.formDeudor.patchValue({ tipoDeudor: tipo, subtipoDeudor: subtipo });
  }

  get esVacio():Boolean {
    return this.formDeudor.get('tipoDeudor')?.value === '';
  }

  get esNacional():Boolean {
    return this.formDeudor.get('tipoDeudor')?.value === 'nacional';
  }

  get esExtranjero():Boolean {
    return this.formDeudor.get('tipoDeudor')?.value === 'extranjero';
  }

  limitarLongitudRfc(event: any, max: number): void {
    const input = event.target;
    if (input.value.length > max) {
      input.value = input.value.slice(0, max);
    }
  }

  validaDeudorRfc(event:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    this.deudorModelo.rfc = event.value;
    const v_rfc_fis = this.deudorModelo.subtipoDeudor === 'deudorFisica' && this.validator.filtroRfcPersFisica(event.value);
    const v_rfc_mor = this.deudorModelo.subtipoDeudor === 'deudorMoral' && this.validator.filtroRfcPersMoral(event.value);
    const validacion = event.value != '' && (v_rfc_fis || v_rfc_mor) && typeof deuD !== 'undefined' && this.deudorModelo.rfc != deuD.rfc_ddr;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupverif_TaxIdDeudor(){
    var verif_taxIDDeudor = document.getElementById("verif_taxIDDeudor");
    const taxID = this.formDeudor.get('taxID')?.value;
    const validacion = taxID != "" && taxID.length >= 9 && taxID.length <= 40 && this.validator.strFilEmp(taxID);
    validacion ? this.validator.correctoInputRow(verif_taxIDDeudor) : this.validator.errorInputRow(verif_taxIDDeudor);
  }

  keyupNombreDeudor(event:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    this.deudorModelo.nombre = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof deuD !== 'undefined' && this.deudorModelo.nombre != deuD.nombre;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNombreComercialDeudor(event:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    this.deudorModelo.nombre_comercial = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof deuD !== 'undefined' && this.deudorModelo.nombre_comercial != deuD.nombre_comercial;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupMailDeudor(event:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    this.deudorModelo.correo_electronico = event.value;
    const validacion = event.value != "" && this.validator.filtroCorreo(event.value) && typeof deuD !== 'undefined' && this.deudorModelo.correo_electronico != deuD.correo_electronico;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupCuentaContableDeudor(event:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    this.deudorModelo.cuenta_contable = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length > 4 && typeof deuD !== 'undefined' && this.deudorModelo.cuenta_contable != deuD.cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  selectHabilitaReembolsos(event:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    this.deudorModelo.habilita_reembolsos = event.checked ? true : false;
  }

  changeRegimenFiscal(opcion:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    var selectedFiscalRegimen = document.getElementById("selectedFiscalRegimen");
    const regfis = this.AllRegFisArray.find((row:any) => row.token_regimen_fiscal === opcion.token_regimen_fiscal);
    this.deudorModelo.regimen_fiscal = regfis.token_regimen_fiscal;
    const validacion = opcion.token_regimen_fiscal != '' && typeof regfis !== 'undefined' && typeof deuD !== 'undefined' && this.deudorModelo.regimen_fiscal != deuD.regimen_fiscal_token;
    validacion ? this.validator.correctoInputRow(selectedFiscalRegimen) : this.validator.errorInputRow(selectedFiscalRegimen);
  }

  decideVinculaTrab(event:any){
    event.checked ? $("#decideinfoDetWorker").removeClass("noneView") : $("#decideinfoDetWorker").addClass("noneView");
  }

  vincula_select_trabajador(people_relacionado_token:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsTrab.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    this.deudorModelo.trabajador_vinculado = names.people_relacionado_token;
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined' && typeof deuD !== 'undefined' && this.deudorModelo.trabajador_vinculado != deuD.trabajador_vinculado;
    if (validacion) {
      this.listaRelationsTrab.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  decideVinculaProv(event:any){
    event.checked ? $("#decideinfoDetProv").removeClass("noneView") : $("#decideinfoDetProv").addClass("noneView");
  }

  vincula_select_proveedor(people_relacionado_token:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsProv.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    this.deudorModelo.proveedor_vinculado = names.people_relacionado_token;
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined' && typeof deuD !== 'undefined' && this.deudorModelo.proveedor_vinculado != deuD.proveedor_vinculado;
    if (validacion) {
      this.listaRelationsProv.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  decideocupaAcreedor(event:any){
    event.checked ? $("#decideinfoDetAcree").removeClass("noneView") : $("#decideinfoDetAcree").addClass("noneView");
  }

  vincula_select_acreedor(people_relacionado_token:any,token_cat_deudores:string){
    const deuD = this.deudorDetalleData.find((deu:any) => deu.token_cat_deudores === token_cat_deudores);
    const names = this.listaRelationsNombres.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    const trab = this.listaRelationsAcr.find((row:any) => row.people_relacionado_token === people_relacionado_token);
    this.deudorModelo.acreedor_vinculado = names.people_relacionado_token;
    const validacion = typeof names !== 'undefined' && typeof trab !== 'undefined' && typeof deuD !== 'undefined' && this.deudorModelo.acreedor_vinculado != deuD.acreedor_vinculado;
    if (validacion) {
      this.listaRelationsAcr.forEach((trab:any) => {
        trab.selected = trab.people_relacionado_token === people_relacionado_token ? true : false;
      });
    } 
  }

  validaDeudorRegistro(token_cat_deudores:any):Boolean{
    const deu_row = this.deudorDetalleData.find((row:any) => row.token_cat_deudores === token_cat_deudores);
    const tipoDeudor = this.deudorModelo.tipoDeudor;
    const subtipoDeudor = this.deudorModelo.subtipoDeudor;
    const rfc = this.deudorModelo.rfc;
    const taxID = this.deudorModelo.taxID;
    const nombre = this.deudorModelo.nombre;
    const nombre_comercial = this.deudorModelo.nombre_comercial;
    const correo_electronico = this.deudorModelo.correo_electronico;
    const cuenta_contable = this.deudorModelo.cuenta_contable;
    const habilita_reembolsos = this.deudorModelo.habilita_reembolsos;
    const regimen_fiscal = this.deudorModelo.regimen_fiscal;
    const trabajador_vinculado = this.deudorModelo.trabajador_vinculado;
    const proveedor_vinculado = this.deudorModelo.proveedor_vinculado;
    const acreedor_vinculado = this.deudorModelo.acreedor_vinculado;

    const valida_tipoDeudor = tipoDeudor != "" && tipoDeudor != deu_row.tipo;
    const valida_subtipoDeudor = subtipoDeudor != "" && subtipoDeudor != deu_row.subtipo;
    const valida_rfc = rfc != '' && ((subtipoDeudor === 'deudorFisica' && this.validator.filtroRfcPersFisica(rfc)) || subtipoDeudor === 'deudorMoral' && this.validator.filtroRfcPersMoral(rfc)) && rfc != deu_row.rfc_acr;
    const valida_taxID = taxID != "" && taxID.length >= 9 && taxID.length <= 40 && this.validator.strFilEmp(taxID) && taxID != deu_row.tax_id_acr;
    const valida_nombre = nombre != "" && this.validator.filtroAlfaNumerico(nombre) && nombre.length > 4 && nombre != deu_row.nombre;
    const valida_nombre_comercial = nombre_comercial != "" && this.validator.filtroAlfaNumerico(nombre_comercial) && nombre_comercial.length > 4 && nombre_comercial != deu_row.nombre_comercial;
    const valida_correo_electronico = correo_electronico != "" && this.validator.filtroCorreo(correo_electronico) && correo_electronico != deu_row.email;
    const valida_cuenta_contable = cuenta_contable != "" && this.validator.filtroAlfaNumerico(cuenta_contable) && cuenta_contable != deu_row.cuenta_contable;
    const valida_habilita_reembolsos = habilita_reembolsos != deu_row.habilita_reembolsos;
    const valida_regimen_fiscal = regimen_fiscal != "" && regimen_fiscal != deu_row.regimen_fiscal_token;
    const valida_vinc_trabajador = trabajador_vinculado != "" && trabajador_vinculado != deu_row.trabajador_vinculado;
    const valida_vinc_proveedor = proveedor_vinculado != "" && proveedor_vinculado != deu_row.proveedor_vinculado;
    const valida_vinc_deudor = acreedor_vinculado != "" && acreedor_vinculado != deu_row.acreedor_vinculado;
    return valida_tipoDeudor || valida_subtipoDeudor || valida_rfc || valida_taxID || valida_nombre || valida_nombre_comercial || valida_correo_electronico || valida_cuenta_contable || valida_habilita_reembolsos || 
    valida_regimen_fiscal || valida_vinc_trabajador || valida_vinc_proveedor || valida_vinc_deudor;
  }

  actualizarDeudor(token_cat_deudores:any){
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
        this.deudorServ.actualizaDeudor(token_cat_deudores,this.deudorModelo).subscribe(
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
              this.lista_deudores();
              this.lista_deudores_mx();
              this.lista_deudores_ext();
              this.infodeuDetalle(token_cat_deudores);
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

  matarDeudor(token_cat_deudores:any){
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
        this.deudorServ.moverAPapeleraDeudor(token_cat_deudores).subscribe(
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
              this.lista_deudores();
              this.lista_deudores_mx();
              this.lista_deudores_ext();
              this.lista_deudores_eliminados();
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

  lista_deudores_eliminados(){
    this.deudorServ.deudoresEliminados().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.arrayCatdeuDeleted = response.deudores;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  reviveDeudor(token_cat_deudores:any){
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
        this.deudorServ.restaurarDeudor(token_cat_deudores).subscribe(
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
              this.lista_deudores();
              this.lista_deudores_mx();
              this.lista_deudores_ext();
              this.lista_deudores_eliminados();
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
              
  rematarDeudor(token_cat_deudores:any){
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
        this.deudorServ.eliminarDeudor(token_cat_deudores).subscribe(
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
              this.lista_deudores();
              this.lista_deudores_mx();
              this.lista_deudores_ext();
              this.lista_deudores_eliminados();
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
