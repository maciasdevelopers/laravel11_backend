import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { CuentasContablesService } from '../../../../../../servicios/ssic/cuentas-contables-service.service';
import { CuentbancService } from '../../../../../../servicios/ssic/cuentbanc.service';

@Component({
  selector: 'app_contabilidad_catalogo_cuentas_contables_registro',
  templateUrl: './cuentas_contables_registro.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
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
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/telefonos.css',
    '../../../../../../styles/explain.css',
    '../../../contabilidad.css',
    './cuentas_contables_registro.component.css'
  ]
})
export class CuentasContablesRegistroComponent implements OnInit {
  //cuentas_bancarias
  cuentas_bancarias_lista:any = [];
  cuenta_contable_cbancaria:any = null;

  public cuenta_contable_nombre:string = "";

  cuentaContableClasificacionNivelUno:any = [];
  public cuenta_contable_niveluno_uuid:string = "";
  public cuenta_contable_niveluno_code:string = "0000";
  public cuenta_contable_niveluno_clasificacion:any = null;

  cuentaContableClasificacionNivelDos:any = [];
  public cuenta_contable_niveldos_uuid:string = "";
  public cuenta_contable_niveldos_code:string = "000";
  public cuenta_contable_niveldos_clasificacion:any = null;

  public cuenta_contable_numero:string = "000";

  //catalogos_aplicados
  catalogo_aplicado_tipo:string = "";  
  catalogo_aplicado_token:string = ""; 
  
  listTipoCuentaContable:any = [];
  public cuenta_contable_tipo:string = "";

  listaNaturalezaCuentaContable:any = [];
  public cuenta_contable_naturaleza:string = "";
  
  public cuenta_contable_codigo_completo:string = "0000-000-000";
  public cuenta_contable_observaciones:string = "";

  constructor(
    private validator:ValidatorServService,
    private translate:TranslateService,
    private c_contable_serv:CuentasContablesService,
    private cuentaBan:CuentbancService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.ver_cuentas_bancarias();
    this.listar_cuenta_contable_clasificacion_nivel_uno();
    this.listar_tipos_cuenta_contable();
    this.listar_naturaleza_cuenta_contable();
  }

  ver_cuentas_bancarias(){
    this.cuentaBan.catCuentasBancariasMain('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          console.log(response);
          this.cuentas_bancarias_lista = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  keyupValidateCContableNombre(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value); 
    this.cuenta_contable_nombre = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  listar_cuenta_contable_clasificacion_nivel_uno(){
    //this.cuentaContableClasificacionNivelUno = [
      //{codigo:'1000',abreb:'actcirc',nombre:'Activo Circulante'}, 
      //{codigo:'2000',abreb:'actncirc',nombre:'Activo No Circulante'}, 
      //{codigo:'3000',abreb:'actintan',nombre:'Activo Intangible'}, 
      //{codigo:'4000',abreb:'totaldact',nombre:'Total de Activo'}, 
      //{codigo:'5000',abreb:'pascirc',nombre:'Pasivo Circulante'}, 
      //{codigo:'6000',abreb:'pasncirc',nombre:'Pasivo No Circulante'}, 
      //{codigo:'7000',abreb:'capital',nombre:'Capital'}, 
      //{codigo:'8000',abreb:'resultado',nombre:'Resultado'}, 
      //{codigo:'9000',abreb:'ingresos',nombre:'Ingresos'}, 
      //{codigo:'10000',abreb:'devoluciones',nombre:'Devoluciones'}, 
      //{codigo:'11000',abreb:'descuentos',nombre:'Descuentos'}, 
      //{codigo:'12000',abreb:'gastos',nombre:'Gastos'}, 
      //{codigo:'13000',abreb:'impuestos',nombre:'Impuestos'}, 
      //{codigo:'14000',abreb:'orden',nombre:'Orden'},

      //{codigo:'1000',/*codigo:'1000-000-000',*/abreb:'1000-efe-equivalentes',nombre:'EFECTIVO Y EQUIVALENTES EN EFECTIVO'},
      //{codigo:'1010',/*codigo:'1010-000-000',*/abreb:'1010-ban-monederos',nombre:'BANCOS Y MONEDEROS ELECTRÓNICOS'},
      //{codigo:'1015',/*codigo:'1015-000-000',*/abreb:'1015-clientes',nombre:'CLIENTES'},
      //{codigo:'1020',/*codigo:'1020-000-000',*/abreb:'1020-inv-valores',nombre:'INVERSIONES EN VALORES'},
      //{codigo:'1030',/*codigo:'1030-000-000',*/abreb:'1030-fideicomisos',nombre:'FIDEICOMISOS'},
      //{codigo:'1050',/*codigo:'1050-000-000',*/abreb:'1050-almacen',nombre:'ALMACEN'},
      //{codigo:'1060',/*codigo:'1060-000-000',*/abreb:'1060-doc-por-cobrar',nombre:'DOCUMENTOS POR COBRAR'},
      //{codigo:'1070',/*codigo:'1070-000-000',*/abreb:'1070-deudores',nombre:'DEUDORES'},
      //{codigo:'1080',/*codigo:'1080-000-000',*/abreb:'1080-imp-acreditables',nombre:'IMPUESTOS ACREDITABLES'},
      //{codigo:'1090',/*codigo:'1090-000-000',*/abreb:'1090-contrib-anticipadas',nombre:'CONTRIBUCIONES ANTICIPADAS'},
      //{codigo:'1500',/*codigo:'1500-000-000',*/abreb:'1500-terrenos',nombre:'TERRENOS'},
      //{codigo:'1501',/*codigo:'1501-000-000',*/abreb:'1501-update-de-terrenos',nombre:'ACTUALIZACION DE TERRENOS'},
      //{codigo:'1600',/*codigo:'1600-000-000',*/abreb:'1600-edificios',nombre:'EDIFICIOS'},
      //{codigo:'1605',/*codigo:'1605-000-000',*/abreb:'1605-equipo-de-transporte',nombre:'EQUIPO DE TRANSPORTE'},
      //{codigo:'1608',/*codigo:'1608-000-000',*/abreb:'1608-equipo-de-computo',nombre:'EQUIPO DE COMPUTO Y TI'},
      //{codigo:'1610',/*codigo:'1610-000-000',*/abreb:'1610-equipo-de-oficina',nombre:'EQUIPO DE OFICINA'},
      //{codigo:'1615',/*codigo:'1615-000-000',*/abreb:'1615-maquin-equipo-operacion',nombre:'MAQUINARIA Y EQUIPO PARA OPERACIÓN'},
      //{codigo:'1620',/*codigo:'1620-000-000',*/abreb:'1620-otros-activos-fijos',nombre:'OTROS ACTIVOS FIJOS'},
      //{codigo:'1700',/*codigo:'1700-000-000',*/abreb:'1700-deprec-edificios',nombre:'DEPRECIACIÓN DE EDIFICIOS'},
      //{codigo:'1705',/*codigo:'1705-000-000',*/abreb:'1705-deprec-eq-transporte',nombre:'DEPRECIACIÓN DE EQ TRANSPORTE'},
      //{codigo:'1708',/*codigo:'1708-000-000',*/abreb:'1708-deprec-equipo-de-computo',nombre:'DEPRECIACIÓN EQUIPO DE COMPUTO'},
      //{codigo:'1710',/*codigo:'1710-000-000',*/abreb:'1710-deprec-equipo-de-oficina',nombre:'DEPRECIACIÓN EQUIPO DE OFICINA'},
      //{codigo:'1715',/*codigo:'1715-000-000',*/abreb:'1715-deprec-maq-eq-para-operación',nombre:'DEPRECIACIÓN MAQ Y EQ PARA OPERACIÓN'},
      //{codigo:'1720',/*codigo:'1720-000-000',*/abreb:'1720-deprec-otros-activos-fijos',nombre:'DEPRECIACIÓN OTROS ACTIVOS FIJOS'},
      //{codigo:'1900',/*codigo:'1900-000-000',*/abreb:'1900-seguros-y-fianzas',nombre:'SEGUROS Y FIANZAS'},
      //{codigo:'1902',/*codigo:'1902-000-000',*/abreb:'1902-marcas-y-patentes',nombre:'MARCAS Y PATENTES'},
      //{codigo:'1905',/*codigo:'1905-000-000',*/abreb:'1905-softwares',nombre:'SOFTWARES'},
      //{codigo:'1920',/*codigo:'1920-000-000',*/abreb:'1920-preoperativos',nombre:'PREOPERATIVOS'},
      
      /*{codigo:'1925',/*codigo:'1925-000-000',abreb:'1925-amortizacion-marcas',nombre:'AMORTIZACIÓN DE MARCAS'},*/
      /*{codigo:'1930',/*codigo:'1930-000-000',abreb:'1930-amortizacion-patentes',nombre:'AMORTIZACIÓN DE PATENTES'},*/
      /*{codigo:'1935',/*codigo:'1935-000-000',abreb:'1935-amortizacion-software',nombre:'AMORTIZACIÓN DE SOFTWARE'},*/
      /*{codigo:'1940',/*codigo:'1940-000-000',abreb:'1940-amortizacion-planeacion-exploracion',nombre:'AMORTIZACION DE PLANEACIÓN Y EXPLORACIÓN'},*/

      //{codigo:'1950',/*codigo:'1950-000-000',*/abreb:'1950-depositos-garantia-otorgados',nombre:'DEPOSITOS EN GARANTIA OTORGADOS'},
      //{codigo:'1990',/*codigo:'1990-000-000',*/abreb:'1990-anticipo-proveedores',nombre:'ANTICIPO A PROVEEDORES'},
      //{codigo:'1999',/*codigo:'1999-000-000',*/abreb:'1999-compromisos-diferibles-a-favor-de-prov',nombre:'COMPROMISOS DIFERIBLES A FAVOR DE PROV'},
      //{codigo:'2000',/*codigo:'2000-000-000',*/abreb:'2000-proveedores',nombre:'PROVEEDORES'},
      //{codigo:'2200',/*codigo:'2200-000-000',*/abreb:'2200-acreedores',nombre:'ACREEDORES'},
      //{codigo:'2300',/*codigo:'2300-000-000',*/abreb:'2300-2300-fideicomisos',nombre:'FIDEICOMISOS'},
      //{codigo:'2400',/*codigo:'2400-000-000',*/abreb:'2400-depositos-en-garantia-recibidos',nombre:'DEPOSITOS EN GARANTIA RECIBIDOS'},
      //{codigo:'2500',/*codigo:'2500-000-000',*/abreb:'2500-anticipo-de-clientes',nombre:'ANTICIPO DE CLIENTES'},
      //{codigo:'2599',/*codigo:'2599-000-000',*/abreb:'2599-compromisos-diferibles-aplic-a-clientes',nombre:'COMPROMISOS DIFERIBLES APLIC A CLIENTES'},
      //{codigo:'2600',/*codigo:'2600-000-000',*/abreb:'2600-contribuciones',nombre:'CONTRIBUCIONES'},
      //{codigo:'2700',/*codigo:'2700-000-000',*/abreb:'2700-provisiones',nombre:'PROVISIONES'},
      //{codigo:'2900',/*codigo:'2900-000-000',*/abreb:'2900-proveedores',nombre:'PROVEEDORES'},
      //{codigo:'2901',/*codigo:'2901-000-000',*/abreb:'2901-acreedores',nombre:'ACREEDORES'},
      //{codigo:'2911',/*codigo:'2911-000-000',*/abreb:'2911-fideicomisos',nombre:'FIDEICOMISOS'},
      //{codigo:'3000',/*codigo:'3000-000-000',*/abreb:'3000-capital-contable-patrimonio',nombre:'CAPITAL CONTABLE Y/O PATRIMONIO'},
      //{codigo:'3002',/*codigo:'3002-000-000',*/abreb:'3002-reservas',nombre:'RESERVAS'},
      //{codigo:'3500',/*codigo:'3500-000-000',*/abreb:'3500-perdida-de-ejercicios-anteriores',nombre:'PERDIDA DE EJERCICIOS ANTERIORES'},
      //{codigo:'3600',/*codigo:'3600-000-000',*/abreb:'3600-utilidad-de-ejercicios-anteriores',nombre:'UTILIDAD DE EJERCICIOS ANTERIORES'},
      //{codigo:'3700',/*codigo:'3700-000-000',*/abreb:'3700-resultado-del-ejercicio-en-curso',nombre:'RESULTADO DEL EJERCICIO EN CURSO'},
      //{codigo:'4000',/*codigo:'4000-000-000',*/abreb:'4000-ingresos-por-ventas-brutas',nombre:'INGRESOS POR VENTAS BRUTAS'},
      //{codigo:'4005',/*codigo:'4005-000-000',*/abreb:'4005-ingresos-por-servicios-brutos',nombre:'INGRESOS POR SERVICIOS BRUTOS'},
      //{codigo:'4010',/*codigo:'4010-000-000',*/abreb:'4010-devoluciones-sobre-ventas-brutas',nombre:'DEVOLUCIONES SOBRE VENTAS BRUTAS'},
      //{codigo:'4015',/*codigo:'4015-000-000',*/abreb:'4015-descuento-sobre-servicios-brutos-ofertad',nombre:'DESCUENTO SOBRE SERVICIOS BRUTOS OFERTAD'},
      //{codigo:'5000',/*codigo:'5000-000-000',*/abreb:'5000-costo-sobre-ventas',nombre:'COSTO SOBRE VENTAS'},
      //{codigo:'6000',/*codigo:'6000-000-000',*/abreb:'6000-gastos-de-administracion',nombre:'GASTOS DE ADMINISTRACIÓN'},
      //{codigo:'6300',/*codigo:'6300-000-000',*/abreb:'6300-gastos-de-venta',nombre:'GASTOS DE VENTA'},
      //{codigo:'6500',/*codigo:'6500-000-000',*/abreb:'6500-gastos-de-investigacion',nombre:'GASTOS DE INVESTIGACIÓN'},
      //{codigo:'7000',/*codigo:'7000-000-000',*/abreb:'7000-resultado-integral-de-financiamiento',nombre:'RESULTADO INTEGRAL DE FINANCIAMIENTO'},
      //{codigo:'8000',/*codigo:'8000-000-000',*/abreb:'8000-impuestos-reparto-sobre-utilidades',nombre:'IMPUESTOS Y REPARTO SOBRE UTILIDADES'},
      //{codigo:'9000',/*codigo:'9000-000-000',*/abreb:'9000-cuentas-de-orden',nombre:'CUENTAS DE ORDEN'},
    //];

    this.c_contable_serv.catalogoCuentaNivelUno().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.cuentaContableClasificacionNivelUno = response.nivel_uno;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectCuentaClasificacionNivelUno(opcion:any){
    var selectcContabNivelUno = document.getElementById("selectcContabNivelUno");
    let cc_class = this.cuentaContableClasificacionNivelUno.find((row:any) => opcion.abreb != '' && row.abreb == opcion.abreb);
    this.cuenta_contable_niveluno_uuid = typeof cc_class !== 'undefined' ? cc_class.uuid_nivel_uno : '';
    this.cuenta_contable_niveluno_code = typeof cc_class !== 'undefined' ? cc_class.codigo : '';
    typeof cc_class !== 'undefined' ? this.validator.correctoSelectBrowser(selectcContabNivelUno) : this.validator.errorSelectBrowser(selectcContabNivelUno);
    typeof cc_class !== 'undefined' ? this.forma_cuenta_contable_code_completo() : null;
    typeof cc_class !== 'undefined' ? this.listar_cuenta_contable_clasificacion_nivel_dos(cc_class.uuid_nivel_uno) : null;
  }

  listar_cuenta_contable_clasificacion_nivel_dos(uuid_nivel_uno:any){
    this.c_contable_serv.catalogoCuentaNivelDos(uuid_nivel_uno).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.cuenta_contable_niveldos_clasificacion = null;
          this.cuentaContableClasificacionNivelDos = response.nivel_dos;
        }
      },
      error => {
        console.log(error);
      }
    );
  }  

  selectCuentaClasificacionNivelDos(opcion:any){
    var selectcContabNivelDos = document.getElementById("selectcContabNivelDos");
    let cc_class = this.cuentaContableClasificacionNivelDos.find((row:any) => opcion.nivel_dos_abreb != '' && row.nivel_dos_abreb == opcion.nivel_dos_abreb);
    this.cuenta_contable_niveldos_uuid = typeof cc_class !== 'undefined' ? cc_class.uuid_nivel_dos : '';
    this.cuenta_contable_niveldos_code = typeof cc_class !== 'undefined' ? cc_class.nivel_dos_codigo : '';
    typeof cc_class !== 'undefined' ? this.validator.correctoSelectBrowser(selectcContabNivelDos) : this.validator.errorSelectBrowser(selectcContabNivelDos);
    typeof cc_class !== 'undefined' ? this.forma_cuenta_contable_code_completo() : null;
  }  

  select_cuenta_bancaria(opcion:any){
    var cuentas_bancarias_id = document.getElementById("cuentas_bancarias_id");
    const cbanc = this.cuentas_bancarias_lista.find((row:any) => row.token_cuenta === opcion.token_cuenta);
    this.catalogo_aplicado_tipo = typeof cbanc !== 'undefined' ? 'bancos' : '';
    this.catalogo_aplicado_token = typeof cbanc !== 'undefined' ? cbanc.token_cuenta : '';
    typeof cbanc !== 'undefined' ? this.validator.correctoSelectBrowser(cuentas_bancarias_id) : this.validator.errorSelectBrowser(cuentas_bancarias_id);
  }

  keyupValidateCuentaContable(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value); 
    this.cuenta_contable_numero = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.forma_cuenta_contable_code_completo() : null;
  }

  listar_tipos_cuenta_contable(){
    this.listTipoCuentaContable = [
      {tipo:'Acumulativa'},
      {tipo:'Detalle'},
    ];
  }

  selectCuentaContableTipo(opcion:any){
    var selectedcContabTipo = document.getElementById("selectedcContabTipo");
    let tcc = this.listTipoCuentaContable.find((row:any) => opcion.tipo != '' && row.tipo == opcion.tipo);
    this.cuenta_contable_tipo = typeof tcc !== 'undefined' ? tcc.tipo : '';
    typeof tcc !== 'undefined' ? this.validator.correctoSelectBrowser(selectedcContabTipo) : this.validator.errorSelectBrowser(selectedcContabTipo);
  }

  listar_naturaleza_cuenta_contable(){
    this.listaNaturalezaCuentaContable = [
      {nat:'Deudora'},
      {nat:'Acreedora'},
    ];
  }

  selectCuentaNaturaleza(opcion:any){
    var selectedcContabNat = document.getElementById("selectedcContabNat");
    let ncc = this.listaNaturalezaCuentaContable.find((row:any) => opcion.nat != '' && row.nat == opcion.nat);  
    this.cuenta_contable_naturaleza = typeof ncc !== 'undefined' ? ncc.nat : '';
    typeof ncc !== 'undefined' ? this.validator.correctoSelectBrowser(selectedcContabNat) : this.validator.errorSelectBrowser(selectedcContabNat);
  }

  forma_cuenta_contable_code_completo(){
    this.cuenta_contable_codigo_completo = this.cuenta_contable_niveluno_code+"-"+this.cuenta_contable_niveldos_code+"-"+this.cuenta_contable_numero;
  }
  
  keyupObservacionCuentaContable(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cuenta_contable_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaCuentaContableRegistro():Boolean{
    const valida_ccontable_nombre = this.cuenta_contable_nombre != "" && this.validator.filtroAlfaNumerico(this.cuenta_contable_nombre);
    const valida_ccontable_clasificacion = this.cuenta_contable_niveluno_uuid != "" && this.cuenta_contable_niveluno_code != "0000" && this.cuenta_contable_niveldos_uuid != "" && this.cuenta_contable_niveldos_code != "0000";
    const valida_ccontable_catalogo_aplicado = this.catalogo_aplicado_tipo != "" && this.catalogo_aplicado_token != "";
    const valida_ccontable_numero = this.cuenta_contable_numero != "" && this.validator.filtroAlfaNumerico(this.cuenta_contable_numero);
    const valida_ccontable_tipo = this.cuenta_contable_tipo != "" && this.validator.filtroAlfaNumerico(this.cuenta_contable_tipo);
    const valida_ccontable_naturaleza = this.cuenta_contable_naturaleza != "" && this.validator.filtroAlfaNumerico(this.cuenta_contable_naturaleza);
    const valida_ccontable_observaciones = this.cuenta_contable_observaciones != "" && this.validator.filtroAlfaNumerico(this.cuenta_contable_observaciones);
    return valida_ccontable_nombre && valida_ccontable_clasificacion && valida_ccontable_catalogo_aplicado && valida_ccontable_numero && valida_ccontable_tipo && valida_ccontable_naturaleza && valida_ccontable_observaciones;
  }

  registrarCuenta() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      customClass: {popup: 'my-swal-zindex'}
    }).then((result) => {
      if (result.isConfirmed) {
        this.c_contable_serv.registrarCuentaContable(
          this.cuenta_contable_nombre,
          this.cuenta_contable_niveluno_uuid,
          this.cuenta_contable_niveldos_uuid,
          this.cuenta_contable_numero,
          this.cuenta_contable_tipo,
          this.cuenta_contable_naturaleza,
          this.catalogo_aplicado_tipo,
          this.catalogo_aplicado_token,
          this.cuenta_contable_observaciones).subscribe(
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
}
