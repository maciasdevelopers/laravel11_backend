import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { CatSatServService } from '../../../../servicios/ssic/cat-sat-serv.service';
import { InterfUmedida } from '../../../../interfaces/interf-umedida';
import { ActIntangiblesService } from '../../../../servicios/ssic/act-intangibles.service';
import { InterfUsoCFDI } from '../../../../interfaces/interf-uso-cfdi';
import { activoIntangibleAngularModelo } from '../../../../modelos/activoIntangibleAngularModelo';
import { ProveedoresService } from '../../../../servicios/proveedores.service';
import { CFDIService } from '../../../../servicios/xml/cfdi.service';
import { ServEncryptService } from '../../../../servicios/ssic/serv-encrypt.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import numeral from 'numeral';
import { QRCodeComponent } from 'angularx-qrcode';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'inventarios_registro_fam_activos_diferidos',
  templateUrl: './registro-fam-activos-diferidos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../styles/listas_ps.css',
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
    './registro-fam-activos-diferidos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class RegistroFamActivosDiferidosComponent implements OnInit {
  public view_form_reg_act_diferido:boolean = true;
  public modeloActIntangible: activoIntangibleAngularModelo;
  amortizacion_periodos:any = [];

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    public validator:ValidatorServService,
    public encryptor:ServEncryptService,
    public _catSat: CatSatServService,
    public _intanServ:ActIntangiblesService,
    public _usoCFDI:CFDIService,
    private translate:TranslateService,
    public _provServ: ProveedoresService) {
    this.modeloActIntangible = new activoIntangibleAngularModelo('','','','','','','','','','','');
  }

  ngOnInit(): void {
    this.amortizacion_periodos = [
      {clave:"86400", valor:"Por día"},//clave:"periodDay",
      {clave:"604800", valor:"Por semana"},//clave:"periodWeek",
      {clave:"2629743", valor:"Por mes"},//clave:"periodMonth",
      {clave:"31556926",valor:"Por año"}//clave:"periodYear",
    ];
  }

  activoCategoria(event:any){
    console.log(event.value)
    let validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActIntangible.categoria = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActIntangible.categoria);
  }

  catCuentaContable(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActIntangible.categoriaCuentaContable = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.modeloActIntangible);
  }

  amortizacionContablePeriodo(clave:any){
    var new_actf_depcont_periodo = document.getElementById("new_actf_depcont_periodo");
    let dcperiod = this.amortizacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    this.modeloActIntangible.amortizacionContablePeriodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(new_actf_depcont_periodo) : this.validator.errorSelectBrowser(new_actf_depcont_periodo);
    console.log(this.modeloActIntangible);
  }

  amortizacionContableTiempoEjecucion(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modeloActIntangible.amortizacionContableTiempoEjecucion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionContableCuenta(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActIntangible.amortizacionContableCuentaUno = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionContableCuentaDos(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActIntangible.amortizacionContableCuentaDos = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //amortizacionFiscal
  amortizacionFiscalPeriodo(clave:any){
    var new_actf_depfiscal_periodo = document.getElementById("new_actf_depfiscal_periodo");
    let dcperiod = this.amortizacion_periodos.find((row:any) => clave != '' && row.clave === clave);
    const validacion = clave != "" && this.validator.filtroAlfaNumerico(clave) && typeof dcperiod !== 'undefined';
    this.modeloActIntangible.amortizacionFiscalPeriodo = validacion ? clave : "";
    validacion ? this.validator.correctoSelectBrowser(new_actf_depfiscal_periodo) : this.validator.errorSelectBrowser(new_actf_depfiscal_periodo);
    console.log(this.modeloActIntangible);
  }

  amortizacionFiscalTiempoEjecucion(event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value);
    this.modeloActIntangible.amortizacionFiscalTiempoEjecucion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionFiscalCuenta(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActIntangible.amortizacionFiscalCuentaUno = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  amortizacionFiscalCuentaDos(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloActIntangible.amortizacionFiscalCuentaDos = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  activoObservaciones(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.modeloActIntangible.observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validateRegistroActivo():Boolean{
    const OKCategoria = this.modeloActIntangible.categoria != '' && this.validator.filtroAlfaSimbolos(this.modeloActIntangible.categoria);
    const OKCategoriaCuenta = this.modeloActIntangible.categoriaCuentaContable != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.categoriaCuentaContable);
    //amortizacionContable
    const OKDeprecContPeriodo = !this.modeloActIntangible.amortizacionContablePeriodo || (this.modeloActIntangible.amortizacionContablePeriodo != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.amortizacionContablePeriodo));
    const OKDeprecContImporte = !this.modeloActIntangible.amortizacionContableTiempoEjecucion || (this.modeloActIntangible.amortizacionContableTiempoEjecucion != '' && this.validator.filtroNum(this.modeloActIntangible.amortizacionContableTiempoEjecucion));
    const OKDeprecContCuenta = this.modeloActIntangible.amortizacionContableCuentaUno != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.amortizacionContableCuentaUno);
    const OKDeprecContCuentaDos = this.modeloActIntangible.amortizacionContableCuentaDos != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.amortizacionContableCuentaDos);

    //depreciacionContable
    const OKDeprecFiscalPeriodo = this.modeloActIntangible.amortizacionFiscalPeriodo == '' || (this.modeloActIntangible.amortizacionFiscalPeriodo != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.amortizacionFiscalPeriodo));
    const OKDeprecFiscalImporte = this.modeloActIntangible.amortizacionFiscalTiempoEjecucion == '' || (this.modeloActIntangible.amortizacionFiscalTiempoEjecucion != '' && this.validator.filtroNum(this.modeloActIntangible.amortizacionFiscalTiempoEjecucion));
    const OKDeprecFiscalCuenta = this.modeloActIntangible.amortizacionFiscalCuentaUno != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.amortizacionFiscalCuentaUno);
    const OKDeprecFiscalCuentaDos = this.modeloActIntangible.amortizacionFiscalCuentaDos != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.amortizacionFiscalCuentaDos);

    const OKDeprecObservaciones = this.modeloActIntangible.observaciones != '' && this.validator.filtroAlfaNumerico(this.modeloActIntangible.observaciones);
    return OKCategoria && OKCategoriaCuenta && OKDeprecContPeriodo && OKDeprecContImporte && OKDeprecContCuenta && OKDeprecContCuentaDos &&
      OKDeprecFiscalPeriodo && OKDeprecFiscalImporte && OKDeprecFiscalCuenta && OKDeprecFiscalCuentaDos && OKDeprecObservaciones;
  }

  registroActivoIntangible(form:NgForm):void{
    this.view_form_reg_act_diferido = false;
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
        this._intanServ.registraActivoIntangible(this.modeloActIntangible).subscribe(
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
              form.reset();
              //this.recargaActivosFijos();
              this.view_form_reg_act_diferido = true;
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
