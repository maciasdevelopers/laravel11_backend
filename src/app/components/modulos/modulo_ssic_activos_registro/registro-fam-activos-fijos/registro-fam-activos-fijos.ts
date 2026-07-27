import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { CatSatServService } from '../../../../servicios/ssic/cat-sat-serv.service';
import { ActFijosService } from '../../../../servicios/ssic/act-fijos.service';
import { TranslateService } from '@ngx-translate/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { activoFijoAngularModelo } from '../../../../modelos/activoFijoAngularModelo';
import { FormBuilder, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'inventarios_registro_fam_activos_fijos',
  standalone: false,
  templateUrl: './registro-fam-activos-fijos.html',
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/landing.css',
    './registro-fam-activos-fijos.css'
  ],
})
export class RegistroFamActivosFijosComponent implements OnInit{
  public usuario: Usuarios;
  public modeloActFijo: activoFijoAngularModelo;
  public act_categoria: any;
  categorias_list:any = [];
  depreciacion_tipos:any = [];
  depreciacion_periodos:any = [];

  categorias_array = [
    {valor:"Terrenos y edificios industriales"},
    {valor:"Maquinaria y equipo de producción"},
    {valor:"Vehículos de transporte y distribución"},
    {valor:"Mobiliario y enseres industriales"},
    {valor:"Equipos de control de calidad y laboratorio"},
    {valor:"Sistemas de energía y utilidades"},
    {valor:"Activos intangibles relacionados con la producción"},
  ];

  public view_form_reg_act_fijo:boolean = true;

  constructor(
    public validator:ValidatorServService,
    public _catSat: CatSatServService,
    public _actFijo: ActFijosService,
    private primeAlerts: MessageService,
    private translate:TranslateService
  ){
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.modeloActFijo = new activoFijoAngularModelo('','','','','','','','','','','','','');
  }

  ngOnInit(): void {
    this.depreciacion_tipos = [
      {clave:"porcentaje", valor:"Porcentaje"},
      {clave:"cuota",valor:"Cuota"}
    ];
    this.depreciacion_periodos = [
      {clave:"86400", valor:"Por día"},//clave:"periodDay",
      {clave:"604800", valor:"Por semana"},//clave:"periodWeek",
      {clave:"2629743", valor:"Por mes"},//clave:"periodMonth",
      {clave:"31556926",valor:"Por año"}//clave:"periodYear",
    ];
  }
  
  filtrar(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.categorias_array as any[]).length; i++) {
      let country = (this.categorias_array as any[])[i];
      if (country.valor.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.categorias_list = filtered;
    console.log(this.categorias_list);
  }

  keypressProvServClave(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (this.validator.strFilter(clave) == false) {
      this.validator.deten(event);
    }
  }

  keyPressNumerico(objetoKeyPress:KeyboardEvent){
    this.validator.key_press_numbers_clave_sat(objetoKeyPress);
  }

  activoCategoriaInput(event:any){
    console.log(event.value)
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActFijo.categoria = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActFijo.categoria);
  }

  activoCategoriaSelect(event:any){
    console.log(event.valor)
    let categoria = event.valor;
    var new_actf_categoria = document.getElementById("new_actf_categoria");
    let validacion = categoria != '' && this.validator.filtroAlfaNumerico(categoria);
    this.modeloActFijo.categoria = validacion ? categoria : '';
    validacion ? this.validator.correctoInputRow(new_actf_categoria) : this.validator.errorInputRow(new_actf_categoria);
    console.log(this.modeloActFijo.categoria);
  }

  catCuentaContable(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActFijo.categoriaCuentaContable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActFijo);
  }

  depreciacionContableTipo(clave:any){
    var new_actf_depcont_tipo = document.getElementById("new_actf_depcont_tipo");
    let dctipo = this.depreciacion_tipos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dctipo !== 'undefined';
    this.modeloActFijo.depreciacionContableTipo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(new_actf_depcont_tipo) : this.validator.errorSelectBrowser(new_actf_depcont_tipo);
    console.log(this.modeloActFijo);
  }

  depreciacionContablePeriodo(clave:any){
    var new_actf_depcont_periodo = document.getElementById("new_actf_depcont_periodo");
    let dcperiod = this.depreciacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    this.modeloActFijo.depreciacionContablePeriodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(new_actf_depcont_periodo) : this.validator.errorSelectBrowser(new_actf_depcont_periodo);
    console.log(this.modeloActFijo);
  }

  depreciacionContableImporte(event:any){
    const valida_dep_porcentaje = this.modeloActFijo.depreciacionContableTipo == 'porcentaje' && this.validator.filtroPorcentaje(event.value);
    const valida_dep_cuota = this.modeloActFijo.depreciacionContableTipo == 'cuota' && this.validator.filtroCosto(event.value);
    const validacion = event.value != '' && (valida_dep_porcentaje || valida_dep_cuota);
    this.modeloActFijo.depreciacionContableImporte = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionContableCuenta(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActFijo.depreciacionContableCuentaUno = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionContableCuentaDos(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActFijo.depreciacionContableCuentaDos = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //depreciacionFiscal
  depreciacionFiscalTipo(clave:any){
    var new_actf_depfiscal_tipo = document.getElementById("new_actf_depfiscal_tipo");
    let dctipo = this.depreciacion_tipos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dctipo !== 'undefined';
    this.modeloActFijo.depreciacionFiscalTipo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(new_actf_depfiscal_tipo) : this.validator.errorSelectBrowser(new_actf_depfiscal_tipo);
  }

  depreciacionFiscalPeriodo(clave:any){
    var new_actf_depfiscal_periodo = document.getElementById("new_actf_depfiscal_periodo");
    let dcperiod = this.depreciacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    this.modeloActFijo.depreciacionFiscalPeriodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(new_actf_depfiscal_periodo) : this.validator.errorSelectBrowser(new_actf_depfiscal_periodo);
    console.log(this.modeloActFijo);
  }

  depreciacionFiscalImporte(event:any){
    const valida_dep_porcentaje = this.modeloActFijo.depreciacionFiscalTipo == 'porcentaje' && this.validator.filtroPorcentaje(event.value);
    const valida_dep_cuota = this.modeloActFijo.depreciacionFiscalTipo == 'cuota' && this.validator.filtroCosto(event.value);
    const validacion = event.value != '' && (valida_dep_porcentaje || valida_dep_cuota);
    this.modeloActFijo.depreciacionFiscalImporte = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionFiscalCuenta(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActFijo.depreciacionFiscalCuentaUno = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  depreciacionFiscalCuentaDos(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActFijo.depreciacionFiscalCuentaDos = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activoObservaciones(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.modeloActFijo.observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validateRegistroActivo():Boolean{
    const OKCategoria = this.modeloActFijo.categoria != '' && this.validator.filtroAlfaSimbolos(this.modeloActFijo.categoria);
    const OKCategoriaCuenta = this.modeloActFijo.categoriaCuentaContable != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.categoriaCuentaContable);
    //depreciacionContable
    const OKDeprecContTipo = this.modeloActFijo.depreciacionContableTipo != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionContableTipo);
    const OKDeprecContPeriodo = this.modeloActFijo.depreciacionContablePeriodo != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionContablePeriodo);
    const OKDeprecContPorcentaje = this.modeloActFijo.depreciacionContableTipo == 'porcentaje' && this.validator.filtroPorcentaje(this.modeloActFijo.depreciacionContableImporte);
    const OKDeprecContCuota = this.modeloActFijo.depreciacionContableTipo == 'cuota' && this.validator.filtroCosto(this.modeloActFijo.depreciacionContableImporte);
    const OKDeprecContImporte = this.modeloActFijo.depreciacionContableImporte != '' && (OKDeprecContPorcentaje || OKDeprecContCuota);
    const OKDeprecContCuenta = this.modeloActFijo.depreciacionContableCuentaUno != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionContableCuentaUno);
    const OKDeprecContCuentaDos = this.modeloActFijo.depreciacionContableCuentaDos != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionContableCuentaDos);

    //depreciacionContable
    const OKDeprecFiscalTipo = this.modeloActFijo.depreciacionFiscalTipo != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionFiscalTipo);
    const OKDeprecFiscalPeriodo = this.modeloActFijo.depreciacionFiscalPeriodo != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionFiscalPeriodo);
    const OKDeprecFiscalPorcentaje = this.modeloActFijo.depreciacionFiscalTipo == 'porcentaje' && this.validator.filtroPorcentaje(this.modeloActFijo.depreciacionFiscalImporte);
    const OKDeprecFiscalCuota = this.modeloActFijo.depreciacionFiscalTipo == 'cuota' && this.validator.filtroCosto(this.modeloActFijo.depreciacionFiscalImporte);
    const OKDeprecFiscalImporte = this.modeloActFijo.depreciacionFiscalImporte != '' && (OKDeprecFiscalPorcentaje || OKDeprecFiscalCuota);
    const OKDeprecFiscalCuenta = this.modeloActFijo.depreciacionFiscalCuentaUno != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionFiscalCuentaUno);
    const OKDeprecFiscalCuentaDos = this.modeloActFijo.depreciacionFiscalCuentaDos != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.depreciacionFiscalCuentaDos);
    const OKDeprecObservaciones = this.modeloActFijo.observaciones != '' && this.validator.filtroAlfaNumerico(this.modeloActFijo.observaciones);
    return OKCategoria && OKCategoriaCuenta && OKDeprecContTipo && OKDeprecContPeriodo && OKDeprecContImporte && OKDeprecContCuenta && OKDeprecContCuentaDos &&
      OKDeprecFiscalTipo && OKDeprecFiscalPeriodo && OKDeprecFiscalImporte && OKDeprecFiscalCuenta && OKDeprecFiscalCuentaDos && OKDeprecObservaciones;
  }

  registraActivoFijo(form:NgForm):void{
    this.view_form_reg_act_fijo = false;
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
        this._actFijo.registraActivoFijo(this.modeloActFijo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            const ok = response.status === 'success';
            this.primeAlerts.add({ severity: ok ? 'success' : 'error', summary: 'SOS-México informa: ', detail: translate_response });
            if (response.status == 'success') {
              form.reset();
              form.resetForm();
              //this.listFamActFijosTrue();
              this.view_form_reg_act_fijo = true;
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
