import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { trabajadoresModelo } from '../../../../../../modelos/trabajadoresModelo';
import { DireccionesService } from '../../../../../../servicios/ssic/direcciones.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InterfPais } from '../../../../../../interfaces/interf-pais';
import { PaisService } from '../../../../../../servicios/ssic/pais.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { EmpleadosService } from '../../../../../../servicios/ssic/empleados.service';
import { ComunicacionInternaService } from '../../../../../../servicios/comunicacion-interna.service';
import { RegimenFiscalService } from '../../../../../../servicios/regimen-fiscal.service';
import { CentrosTrabajoService } from '../../../../../../servicios/ssic/centros-trabajo-service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import { SentinelArkManager } from '../../../../../../servicios/sentinel-ark-manager';
import { MonedasService } from '../../../../../../servicios/monedas.service';

@Component({
  selector: 'vhumano_trabajadores_registro',
  templateUrl: './trabajadores_registro.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/tabs.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/cabecera.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/buscador.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/paginador.css',
    '../../../../../../styles/breadcrumb.css',
    '../../../../../../styles/dropdown.css',
    '../../../../../../styles/canvas.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/navegador.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/explain.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/cards.css',
    '../../../vhumano.css',
    './trabajadores_registro.component.css']
})
export class VHTrabajadoresRegistroComponent implements OnInit {
  public identidad:any;

  public modeloTrab: trabajadoresModelo;
  paises_lista:any = [];
  regimenes_fiscales_list:any = [];
  catalogo_centros_trabajo:any = [];
  trab_sexo:any = [];
  trab_estado_civil:any = [];
  trab_entidades_federativas:any = [];
  trab_lista_tipos_salario:any = [];
  trab_lista_tipos_contrato:any = [];
  trab_tipo_telefonos:any = [];
  trab_licencia_tipos:any = [];
  trab_empleo_act_ant:any = [];
  trab_referencias_personales:any = [];
  lista_bancos:any = [];
  viewFormulario:boolean = true;

  separateDialCode = false;
  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  phoneForm: FormGroup;
  fechaVencimientoInformativa: string = '';
  public popUpAccept:string = "";
  public popUpReject:string = ""; 
  public viewCuenta:boolean = false;
  public viewClabeInterbanc:boolean = false;

  nomina_jornadas:any = [];
  nomina_jornada_empleado = null;
  nomina_turnos:any = [];
  nomina_turno_empleado = null;
  nomina_periodos:any = [];
  nomina_periodicidad = null;
  catalogo_monedas_api:any = [];
  nomina_moneda = null;

  constructor(
    private translate:TranslateService,
    private sentinela: SentinelArkManager,
    private ctraserv:CentrosTrabajoService,
    private validator:ValidatorServService,
    private trab_serv:EmpleadosService,
    private bancos:BancosServService,
    private dirServ:DireccionesService,
    private primeAlerts: MessageService,
    private _regimen:RegimenFiscalService,
    private _pais:PaisService,
    private relInterna:ComunicacionInternaService,
    private _monedasServ: MonedasService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.modeloTrab = new trabajadoresModelo('','','',0,'','',[],'','','','','','','','','','','','','','','','','','','',[],[],'','','',[],[],'',false,'','','','','',0,false,[],[],'','','','','','','','','','','','','','','',2,'','','','');
    this.phoneForm = this.fb.group({
      telefono: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listandoPaises();
    this.listandoRegimenFiscal();
    this.descarga_centros_de_trabajo();
    this.getCatalogoBancos();
    this.monedasCatalogoApi();
    this.translate.get(['sex_m','sex_f','sex_o','soltero','casado','divorciado','viudo','union_lib']).subscribe(translations => {
      this.trab_sexo = [
        {key:'0',label:translations['sex_m'],opcion:'M'},
        {key:'1',label:translations['sex_f'],opcion:'F'},
        {key:'2',label:translations['sex_o'],opcion:'Otro'}
      ];
      this.trab_estado_civil = [
        {key:'0',label:translations['soltero'],opcion:'Soltero'},
        {key:'1',label:translations['casado'],opcion:'Casado'},
        {key:'2',label:translations['divorciado'],opcion:'Divorciado'},
        {key:'3',label:translations['viudo'],opcion:'Viudo'},
        {key:'4',label:translations['union_lib'],opcion:'Unión libre'}
      ];
    });

    this.trab_tipo_telefonos = [
      {key:'0',label:'casa',opcion:'casa'},
      {key:'1',label:'movil',opcion:'movil'},
      {key:'2',label:'Trabajo',opcion:'trabajo'},
      {key:'3',label:'fax',opcion:'fax'},
      {key:'4',label:'otro',opcion:'otro'},
    ];          

    this.trab_licencia_tipos = [
      {key:'0',nivel:'federal',tipo:'A',opcion:'federal tipo A: Pasajeros, turismo y carga (básica para chóferes de carretera).', vigencia:5, permanente:false},
      {key:'1',nivel:'federal',tipo:'B',opcion:'federal tipo B: Servicio de autotransporte federal de pasajeros en autobuses (foráneos)', vigencia:3, permanente:false},
      {key:'2',nivel:'federal',tipo:'C',opcion:'federal tipo C: Servicio de autotransporte federal de carga en camiones unitarios y tractocamiones.', vigencia:3, permanente:false},
      {key:'3',nivel:'federal',tipo:'D',opcion:'federal tipo D: Servicio de autotransporte de pasajeros en turismo (camiones de excursión).', vigencia:3, permanente:false},
      {key:'4',nivel:'federal',tipo:'E',opcion:'federal tipo E: Servicio de doble remolque (tractocamiones de dos remolques en carreteras federales).', vigencia:3, permanente:false},
      {key:'5',nivel:'federal',tipo:'F',opcion:'federal tipo F: Para conducir ferrocarriles', vigencia:3, permanente:false},
      {key:'6',nivel:'estatal',tipo:'A',opcion:'estatal tipo A: Automovilista particular.', vigencia:3, permanente:false},
      {key:'7',nivel:'estatal',tipo:'B',opcion:'estatal tipo B: Chofer particular o transporte público/taxi.', vigencia:3, permanente:false},
      {key:'8',nivel:'estatal',tipo:'C',opcion:'estatal tipo C: Vehículos de carga.', vigencia:3, permanente:false},
      {key:'9',nivel:'estatal',tipo:'D',opcion:'estatal tipo D: Transporte de pasajeros (camiones urbanos, microbuses).', vigencia:3, permanente:false},
      {key:'10',nivel:'estatal',tipo:'E',opcion:'estatal tipo E: Vehículos de emergencia o especiales.', vigencia:3, permanente:false},
      {key:'11',nivel:'federal',tipo:'A',opcion:'federal tipo A: Pasajeros, turismo y carga (licencia permanente).', vigencia:null, permanente:true},
      {key:'12',nivel:'estatal',tipo:'A',opcion:'estatal tipo A: Automovilista particular (licencia permanente).', vigencia:null, permanente:true},
    ];
    
    this.trab_entidades_federativas = [
      {clave:'aguascalientes', nombre:'Aguascalientes'},
      {clave:'bajacalifornia', nombre:'Baja California'},
      {clave:'bajacaliforniasur', nombre:'Baja California Sur'},
      {clave:'campeche', nombre:'Campeche'},
      {clave:'coahuila', nombre:'Coahuila'},
      {clave:'colima', nombre:'Colima'},
      {clave:'chiapas', nombre:'Chiapas'},
      {clave:'chihuahua', nombre:'Chihuahua'},
      {clave:'ciudaddemexico', nombre:'Ciudad de México'},
      {clave:'durango', nombre:'Durango'},
      {clave:'guanajuato', nombre:'Guanajuato'},
      {clave:'guerrero', nombre:'Guerrero'},
      {clave:'hidalgo', nombre:'Hidalgo'},
      {clave:'jalisco', nombre:'Jalisco'},
      {clave:'mexico', nombre:'México'},
      {clave:'michoacan', nombre:'Michoacán'},
      {clave:'morelos', nombre:'Morelos'},
      {clave:'nayarit', nombre:'Nayarit'},
      {clave:'nuevoleon', nombre:'Nuevo León'},
      {clave:'oaxaca', nombre:'Oaxaca'},
      {clave:'puebla', nombre:'Puebla'},
      {clave:'queretaro', nombre:'Querétaro'},
      {clave:'quintanaroo', nombre:'Quintana Roo'},
      {clave:'sanluispotosi', nombre:'San Luis Potosí'},
      {clave:'sinaloa', nombre:'Sinaloa'},
      {clave:'sonora', nombre:'Sonora'},
      {clave:'tabasco', nombre:'Tabasco'},
      {clave:'tamaulipas', nombre:'Tamaulipas'},
      {clave:'tlaxcala', nombre:'Tlaxcala'},
      {clave:'veracruz', nombre:'Veracruz'},
      {clave:'yucatan', nombre:'Yucatán'},
      {clave:'zacatecas', nombre:'Zacatecas'}
    ];

    this.trab_empleo_act_ant = [
      {key:'0',concepto:'Tiempo que prestó sus servicios',ant1:'',ant2:'',ant3:''},
      {key:'1',concepto:'Nombre de la Empresa',ant1:'',ant2:'',ant3:''},
      {key:'2',concepto:'Domicilio',ant1:'',ant2:'',ant3:''},
      {key:'3',concepto:'Teléfono',ant1:'',ant2:'',ant3:''},
      {key:'4',concepto:'Puesto',
        ant1:[{inicial:'',final:''}],
        ant2:[{inicial:'',final:''}],
        ant3:[{inicial:'',final:''}]},
      {key:'4',concepto:'Sueldos',
        ant1:[{inicial:'',final:''}],
        ant2:[{inicial:'',final:''}],
        ant3:[{inicial:'',final:''}]},
      {key:'4',concepto:'Motivos de su separación',ant1:'',ant2:'',ant3:''},
      {key:'4',concepto:'Nombre de su jefe inmediato',ant1:'',ant2:'',ant3:''},
      {key:'4',concepto:'Actividades Desempeñadas',ant1:'',ant2:'',ant3:''},
    ];

    this.trab_lista_tipos_salario = [
      {clave:'Salario fijo', nombre:'Salario fijo'},
      {clave:'Salario variable', nombre:'Salario variable'},
      {clave:'Salario mixto', nombre:'Salario mixto'}
    ];

    this.trab_lista_tipos_contrato = [
      {clave:'contrattimeindet', tipo:'Por tiempo indeterminado'},
      {clave:'contrattimedet', tipo:'Por tiempo determinado'},
      //{clave:'contratobratimedet', tipo:'Por obra o tiempo determinado'},
      {clave:'contratpertest', tipo:'Periodo de prueba'},
      {clave:'contratcapacinicial', tipo:'Capacitación inicial'},
      //{clave:'contratoutsourcing', tipo:'Outsourcing (Servicios especializados)'},
      //{clave:'contratjornreductimeparc', tipo:'Jornada reducida o tiempo parcial'},
      {clave:'contrattemporada', tipo:'Temporada'},
      {clave:'honorarios', tipo:'Honorarios'},
      //{clave:'contratteletrabajo', tipo:'Teletrabajo (home office)'},
    ];

    this.nomina_periodos = [
      {periodicidad:'semanal'},
      {periodicidad:'catorcenal'},
      {periodicidad:'quincenal'},
      {periodicidad:'mensual'},
      {periodicidad:'bimestral'},
      {periodicidad:'trimestral'},
      {periodicidad:'cuatrimestral'},
      {periodicidad:'semestral'},
      {periodicidad:'anual'}
    ];

    this.nomina_jornadas = [
      {jornada:'Completa'},
      {jornada:'Reducida'}
    ];

    this.nomina_turnos = [
      {turno:'Matutino'},
      {turno:'Vespertino'},
      {turno:'Nocturno'}
    ];

    console.log(this.trab_sexo);
    console.log(this.trab_estado_civil);
  }

  monedasCatalogoApi(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if(response.status == 'success'){
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  listandoRegimenFiscal(){
    this._regimen.getAllRegimenFiscal().subscribe((data) => {
      if (data.status == 'success') {
        this.regimenes_fiscales_list = data.listRegFisc;
      }
      console.log(this.regimenes_fiscales_list);
    });
  }

  descarga_centros_de_trabajo(){
    this.ctraserv.catalogoCentrosTrabajoActivos().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.catalogo_centros_trabajo = response.cent_trab;
          console.log(this.catalogo_centros_trabajo);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  listandoPaises(){
    this._pais.getListaPais().subscribe((data:InterfPais[]) => {
      this.paises_lista = data;
      console.log(this.paises_lista);
    });
  }

  getCatalogoBancos(){
    this.bancos.getListaBancos().subscribe(
      response => {
         if (response.status == 'success') {
          console.log(response);
          this.lista_bancos = response.banco;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  keyupTrabPaterno(event:any){
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
    this.modeloTrab.apePaterno = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabMaterno(event:any){
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
    this.modeloTrab.apeMaterno = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabNombres(event:any){
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 3;
    this.modeloTrab.nombres = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabEdad(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modeloTrab.edad = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabSexo(opcion:any){
    var trabSexo = document.getElementById("trabSexo");
    let pgda = this.trab_sexo.find((row:any) => opcion.opcion != '' && row.opcion === opcion.opcion);
    const validacion = opcion.opcion != "" && this.validator.strFilter(opcion.opcion) && typeof pgda !== 'undefined';
    this.modeloTrab.sexo = validacion ? pgda.opcion : "";
    validacion ? this.validator.correctoSelectBrowser(trabSexo) : this.validator.errorSelectBrowser(trabSexo);
  }

  keyupTrabEstadoCivil(opcion:any){
    var trabEstadoCivil = document.getElementById("trabEstadoCivil");
    let pgda = this.trab_estado_civil.find((row:any) => opcion.opcion != '' && row.opcion === opcion.opcion);  
    const validacion = opcion.opcion != "" && this.validator.strFilter(opcion.opcion) && typeof pgda !== 'undefined';
    this.modeloTrab.estado_civil = validacion ? pgda.opcion : "";
    validacion ? this.validator.correctoSelectBrowser(trabEstadoCivil) : this.validator.errorSelectBrowser(trabEstadoCivil);
  }

  keyupTrabDomicilioCalleNumero(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.domicilio_CalleNumero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  buscaCodPostalDipomex(event:any){
    var trabDomicilioColonia = document.getElementById("trabDomicilioColonia");
    var trabDomicilioMunicipio = document.getElementById("trabDomicilioMunicipio");
    var trabDomicilioEstado = document.getElementById("trabDomicilioEstado");
    const validacion_cp = event.value != "" && this.validator.filtroNumericoCPostal(event.value) && event.value.length == 5;
    validacion_cp ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    if (validacion_cp) {
      this.modeloTrab.domicilio_colonias_por_cp = [];
      this.modeloTrab.domicilio_estado = "";
      this.modeloTrab.domicilio_municipio = "";
      this.modeloTrab.domicilio_cod_postal = "";
      this.modeloTrab.domicilio_colonia_vinculada = "";

      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.modeloTrab.domicilio_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
            this.validator.correctoInputRow(trabDomicilioEstado);
            this.modeloTrab.domicilio_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.validator.correctoInputRow(trabDomicilioMunicipio);
            this.modeloTrab.domicilio_cod_postal = response.cod_postal["codigo_postal"];
            this.modeloTrab.domicilio_colonias_por_cp = response.cod_postal["colonias"];
            this.modeloTrab.domicilio_colonia_vinculada = response.cod_postal["colonias"].length == 1 ? response.cod_postal["colonias"][0] : "";
            response.cod_postal["colonias"].length == 1 ? this.validator.correctoInputRow(trabDomicilioColonia) : this.validator.errorSelectBrowser(trabDomicilioColonia);
          } else {
            this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: this.translate.instant(response.message) });
            if (response.message == "postal_empty") {
              this.validator.errorInputRow(trabDomicilioEstado);
              this.validator.errorInputRow(trabDomicilioMunicipio);
              this.validator.errorInputRow(trabDomicilioColonia);
              this.modeloTrab.domicilio_estado = this.translate.instant("unk_nown");
              this.modeloTrab.domicilio_municipio = this.translate.instant("unk_nown");
              this.modeloTrab.domicilio_cod_postal = this.translate.instant("unk_nown");
            }
          }
        },
        error => {
          //console.log(error);
        }
      )
    }
  }

  seleccionaColoniatrab(colonia_name:any){
    console.log(colonia_name);
    var trabDomicilioColonia = document.getElementById("trabDomicilioColonia");
    const col_vinc = this.modeloTrab.domicilio_colonias_por_cp.find((col:any) => col === colonia_name);
    console.log(col_vinc);
    const validacion = colonia_name != "" && this.validator.filtroAlfaNumerico(colonia_name) && col_vinc != "" && this.validator.filtroAlfaNumerico(col_vinc); 
    this.modeloTrab.domicilio_colonia_vinculada = validacion ? colonia_name : '';
    validacion ? this.validator.correctoSelectBrowser(trabDomicilioColonia) : this.validator.errorSelectBrowser(trabDomicilioColonia);
  }

  keyupTrabOrigenNacimFecha(object:any){
    const validacion = object.value != "" && this.validator.filtroFecha(object.value);
    this.modeloTrab.origen_nacimiento_fecha = validacion ? object.value : "";
    validacion ? this.validator.correctoInputRow(object) : this.validator.errorInputRow(object);
  }

  keyupTrabOrigenNacimLugar(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.origen_nacimiento_lugar = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabOrigenPais(opcion:any){
    var trabOrigenNacionalidad = document.getElementById("trabOrigenNacionalidad");
    const country = this.paises_lista.find((row:any) => row.token_pais === opcion.token_pais);
    const validacion = opcion.pais != '' && this.validator.filtroAlfaNumerico(opcion.pais) && typeof country !== 'undefined';
    this.modeloTrab.origen_nacionalidad = validacion ? country.token_pais : '';
    validacion ? this.validator.correctoSelectBrowser(trabOrigenNacionalidad) : this.validator.errorSelectBrowser(trabOrigenNacionalidad);
  }

  changeTrabContTelefonoTipo(opcion:any){
    var trabContTipoTel = document.getElementById("trabContTipoTel");
    let pgda = this.trab_tipo_telefonos.find((row:any) => opcion.opcion != '' && row.opcion === opcion.opcion);
    const validacion = opcion.opcion != "" && this.validator.filtroAlfaNumerico(opcion.opcion) && typeof pgda !== 'undefined';
    this.modeloTrab.contacto_telefono_tipo = validacion ? pgda.opcion : "";
    validacion ? this.validator.correctoSelectBrowser(trabContTipoTel) : this.validator.errorSelectBrowser(trabContTipoTel);
  }

  probarTextPhone(){
    if (this.phoneForm.valid) {
      console.log(this.phoneForm);
      //const phone = this.phoneForm.get('telefono')?.value;
      console.log(this.phoneForm.value.telefono);
      const phone = this.phoneForm.value.telefono;
      if (phone) {
        console.log('Número internacional:', phone.internationalNumber);
        console.log('Número nacional:', phone.nationalNumber);
        console.log('Código de país:', phone.countryCode);
        console.log('Dial code:', phone.dialCode);
      }
    }
  }

  keyupTrabContTelefonoNumero(event:any){
    var trabContTelefono = document.getElementById("trabContTelefono");
    const phone = this.phoneForm.value.telefono;
    const validacion =  this.phoneForm.valid && phone.length >= 5 && this.validator.filtroPhone(phone);
    this.modeloTrab.contacto_telefono_numero = validacion ? phone : '';
    validacion ? this.validator.correctoTelefonos(trabContTelefono) : this.validator.errorTelefonos(trabContTelefono);
  }

  keyupTrabContMail(event:any){
    const validacion = event.value != "" && this.validator.filtroCorreo(event.value);
    this.modeloTrab.contacto_email = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabDocsCurp(event:any){ //txt_curp
    const validacion = event.value != "" && this.validator.filtroCURP(event.value); 
    this.modeloTrab.documentacion_curp = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabDocsAfore(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_afore = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabDocsRfc(event:any){
    const validacion = event.value != '' && this.validator.filtroRfcPersFisica(event.value);
    this.modeloTrab.documentacion_rfc = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabDocsPasaporte(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_pasaporte_numero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabDocsPasaporteExpide(opcion:any){
    var trabDocsPasaporteExpide = document.getElementById("trabDocsPasaporteExpide");
    const country = this.paises_lista.find((row:any) => row.token_pais === opcion.token_pais);
    const validacion = opcion.pais != '' && this.validator.filtroAlfaNumerico(opcion.pais) && typeof country !== 'undefined';
    this.modeloTrab.documentacion_pasaporte_expide = validacion ? country.token_pais : '';
    validacion ? this.validator.correctoSelectBrowser(trabDocsPasaporteExpide) : this.validator.errorSelectBrowser(trabDocsPasaporteExpide);
  }

  changeTrabDocsPasaporteVigencia(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modeloTrab.documentacion_pasaporte_vigencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validatePasaporteAdd():Boolean{
    const validacion_pasaporte_numero = this.modeloTrab.documentacion_pasaporte_numero != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_pasaporte_numero);
    const validacion_pasaporte_expide = this.modeloTrab.documentacion_pasaporte_expide != '';
    const validacion_pasaporte_vigencia = this.modeloTrab.documentacion_pasaporte_vigencia != '' && this.validator.filtroFecha(this.modeloTrab.documentacion_pasaporte_vigencia);
    return validacion_pasaporte_numero && validacion_pasaporte_expide && validacion_pasaporte_vigencia;
  }

  changeTrabDocsPasaporteAdd(event: Event){
    var trabDocsPasaporteNum = document.getElementById("trabDocsPasaporteNum");
    var trabDocsPasaporteExpide = document.getElementById("trabDocsPasaporteExpide");
    var trabDocsPasaporteVigencia = document.getElementById("trabDocsPasaporteVigencia");
    
    this.popUpAccept = this.translate.instant("swal_yes_insert");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_insert"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {label: 'Save'},
      accept: () => {
        var num_lista = this.modeloTrab.documentacion_pasaporte_list_new.length + 1;
        this.modeloTrab.documentacion_pasaporte_list_new.push({
          "num_lista":num_lista,
          "pasaporte_numero":this.modeloTrab.documentacion_pasaporte_numero,
          "pasaporte_expide":this.modeloTrab.documentacion_pasaporte_expide,
          "pasaporte_vigencia":this.modeloTrab.documentacion_pasaporte_vigencia,
          "pasaporte_estado":"nuevo"
        });
        this.modeloTrab.documentacion_pasaporte_numero = '';
        this.validator.limpiaInputRow(trabDocsPasaporteNum);
        this.modeloTrab.documentacion_pasaporte_expide = '';
        this.validator.limpiaSelect(trabDocsPasaporteExpide);
        this.phoneForm.get('documentacion_pasaporte_expide')?.reset(); // limpia el control
        this.modeloTrab.documentacion_pasaporte_vigencia = '';
        this.validator.limpiaInputRow(trabDocsPasaporteVigencia);
      }
    });
  }

  changeTrabDocsPasaporteNewRemove(event: Event,num_lista:any){
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {label: 'Save'},
      accept: () => {
        const index = this.modeloTrab.documentacion_pasaporte_list_new.findIndex((row:any) => row.num_lista === num_lista);
        this.modeloTrab.documentacion_pasaporte_list_new.splice(index, 1);
      }
    });
  }

  keyupTrabDocsVisa(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_visa_numero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabDocsVisaExpide(opcion:any){
    var trabDocsVisaExpide = document.getElementById("trabDocsVisaExpide");
    const country = this.paises_lista.find((row:any) => row.token_pais === opcion.token_pais);
    const validacion = opcion.pais != '' && this.validator.filtroAlfaNumerico(opcion.pais) && typeof country !== 'undefined';
    this.modeloTrab.documentacion_visa_expide = validacion ? country.token_pais : '';
    validacion ? this.validator.correctoSelectBrowser(trabDocsVisaExpide) : this.validator.errorSelectBrowser(trabDocsVisaExpide);
  }

  changeTrabDocsVisaVigencia(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modeloTrab.documentacion_visa_vigencia = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validateVisaAdd():Boolean{
    const validacion_visa_numero = this.modeloTrab.documentacion_visa_numero != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_visa_numero);
    const validacion_visa_expide = this.modeloTrab.documentacion_visa_expide != '';
    const validacion_visa_vigencia = this.modeloTrab.documentacion_visa_vigencia != '' && this.validator.filtroFecha(this.modeloTrab.documentacion_visa_vigencia);
    return validacion_visa_numero && validacion_visa_expide && validacion_visa_vigencia;
  }

  changeTrabDocsVisaAdd(event: Event){
    var trabDocsVisaNum = document.getElementById("trabDocsVisaNum");
    var trabDocsVisaExpide = document.getElementById("trabDocsVisaExpide");
    var trabDocsVisaVigencia = document.getElementById("trabDocsVisaVigencia");
    
    this.popUpAccept = this.translate.instant("swal_yes_insert");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_insert"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {label: 'Save'},
      accept: () => {
        var num_lista = this.modeloTrab.documentacion_visa_list_new.length + 1;
        this.modeloTrab.documentacion_visa_list_new.push({
          "num_lista":num_lista,
          "visa_numero":this.modeloTrab.documentacion_visa_numero,
          "visa_expide":this.modeloTrab.documentacion_visa_expide,
          "visa_vigencia":this.modeloTrab.documentacion_visa_vigencia,
          "visa_estado":"nuevo"
        });
        this.modeloTrab.documentacion_visa_numero = '';
        this.validator.limpiaInputRow(trabDocsVisaNum);
        this.modeloTrab.documentacion_visa_expide = '';
        this.validator.limpiaSelect(trabDocsVisaExpide);
        this.phoneForm.get('documentacion_visa_expide')?.reset(); // limpia el control
        this.modeloTrab.documentacion_visa_vigencia = '';
        this.validator.limpiaInputRow(trabDocsVisaVigencia);
      }
    });
  }

  changeTrabDocsVisaNewRemove(event: Event,num_lista:any){
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {label: 'Save'},
      accept: () => {
        const index = this.modeloTrab.documentacion_visa_list_new.findIndex((row:any) => row.num_lista === num_lista);
        this.modeloTrab.documentacion_visa_list_new.splice(index, 1);
      }
    });
  }

  keyupTrabDocsNSS(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_numero_de_seguridad_social = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabLicenciaManejarClave(opcion:any){
    var trabLicenciaClave = document.getElementById("trabLicenciaClave");
    let pgda = this.trab_licencia_tipos.find((row:any) => opcion.opcion != '' && row.opcion === opcion.opcion);  
    const validacion = opcion.opcion != "" && this.validator.filtroAlfaNumerico(opcion.opcion) && typeof pgda !== 'undefined';
    this.modeloTrab.documentacion_licencia_nivel = validacion ? pgda.nivel : "";
    this.modeloTrab.documentacion_licencia_clase = validacion ? pgda.tipo : "";
    this.modeloTrab.documentacion_licencia_vigencia = validacion ? pgda.vigencia : "";
    this.modeloTrab.documentacion_licencia_permanente = validacion ? pgda.permanente : false;
    validacion ? this.validator.correctoSelectBrowser(trabLicenciaClave) : this.validator.errorSelectBrowser(trabLicenciaClave);
  }

  keyupTrabLicenciaManejarNumero(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.documentacion_licencia_numero = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabLicenciaManejarExpide(opcion:any){
    var trabLicenciaExpide = document.getElementById("trabLicenciaExpide");
    const ent_expide = this.trab_entidades_federativas.find((row:any) => row.nombre === opcion.nombre);
    //{clave:'01', nombre:'Aguascalientes'},
    const validacion = opcion.nombre != '' && this.validator.filtroAlfaNumerico(opcion.nombre) && typeof ent_expide !== 'undefined';
    this.modeloTrab.documentacion_licencia_expide = validacion ? ent_expide.clave : '';
    validacion ? this.validator.correctoSelectBrowser(trabLicenciaExpide) : this.validator.errorSelectBrowser(trabLicenciaExpide);
  }

  changeTrabLicenciaFechaExpedicion(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modeloTrab.documentacion_licencia_fecha_expedicion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);

    if (validacion && !this.modeloTrab.documentacion_licencia_permanente) {
      const fecha_expedicion = new Date(this.modeloTrab.documentacion_licencia_fecha_expedicion);
      fecha_expedicion.setFullYear(fecha_expedicion.getFullYear() + (this.modeloTrab.documentacion_licencia_vigencia || 0));
      this.fechaVencimientoInformativa = fecha_expedicion.toISOString().split('T')[0];

      //const fechaVenc = new Date(this.fechaVencimientoInformativa);
      //const hoy = new Date();
      //return fechaVenc < hoy; // true si ya pasó la fecha
    } else {
      this.fechaVencimientoInformativa = "";
    }
  }

  get validateLicenciaAdd():Boolean{
    const validacion_licencia_nivel = this.modeloTrab.documentacion_licencia_nivel != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_nivel);
    const validacion_licencia_clase = this.modeloTrab.documentacion_licencia_clase != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_clase);
    const validacion_licencia_vigencia = this.modeloTrab.documentacion_licencia_vigencia > 0 && this.validator.filtroNum(this.modeloTrab.documentacion_licencia_vigencia);
    const validacion_licencia_numero = this.modeloTrab.documentacion_licencia_numero != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_numero);
    const validacion_licencia_expide = this.modeloTrab.documentacion_licencia_expide != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_licencia_expide);
    const validacion_licencia_fecha_expedicion = this.modeloTrab.documentacion_licencia_fecha_expedicion != '' && this.validator.filtroFecha(this.modeloTrab.documentacion_licencia_fecha_expedicion);
    const validacion_licencia_permanente = this.modeloTrab.documentacion_licencia_permanente || (!this.modeloTrab.documentacion_licencia_permanente && validacion_licencia_vigencia);
    return validacion_licencia_nivel && validacion_licencia_clase && validacion_licencia_numero && validacion_licencia_expide && validacion_licencia_fecha_expedicion && validacion_licencia_permanente;
  }

  changeTrabDocsLicenciaAdd(event: Event){
    var trabEditLicenciaClave = document.getElementById("trabLicenciaClave");
    var trabLicenciaNum = document.getElementById("trabLicenciaNum");
    var trabLicenciaExpide = document.getElementById("trabLicenciaExpide");
    var trabLicenciaExpedicionDate = document.getElementById("trabLicenciaExpedicionDate");
    
    this.popUpAccept = this.translate.instant("swal_yes_insert");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_insert"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {label: 'Save'},
      accept: () => {
        const ent_expide = this.trab_entidades_federativas.find((row:any) => row.clave === this.modeloTrab.documentacion_licencia_expide);
        var num_lista = this.modeloTrab.documentacion_licencia_list_new.length + 1;
        this.modeloTrab.documentacion_licencia_list_new.push({
          "num_lista":num_lista,
          "licencia_nivel":this.modeloTrab.documentacion_licencia_nivel,
          "licencia_clase":this.modeloTrab.documentacion_licencia_clase,
          "licencia_numero":this.modeloTrab.documentacion_licencia_numero,
          "licencia_expide":this.modeloTrab.documentacion_licencia_expide,
          "licencia_expide_show":ent_expide.nombre,
          "licencia_fecha_expedicion":this.modeloTrab.documentacion_licencia_fecha_expedicion,
          "licencia_vigencia":!this.modeloTrab.documentacion_licencia_permanente ? this.modeloTrab.documentacion_licencia_vigencia : 0,
          "licencia_permanente":this.modeloTrab.documentacion_licencia_permanente ? true : false,
          "licencia_estado":"nuevo"
        });

        this.modeloTrab.documentacion_licencia_nivel = '';
        this.modeloTrab.documentacion_licencia_clase = '';
        this.modeloTrab.documentacion_licencia_vigencia = 0;
        this.modeloTrab.documentacion_licencia_permanente = false;
        this.validator.limpiaSelect(trabEditLicenciaClave);
        this.phoneForm.get('documentacion_licencia_clave')?.reset(); // limpia el control
        this.modeloTrab.documentacion_licencia_numero = '';
        this.validator.limpiaInputRow(trabLicenciaNum);
        this.modeloTrab.documentacion_licencia_expide = '';
        this.validator.limpiaSelect(trabLicenciaExpide);
        this.phoneForm.get('documentacion_licencia_expide')?.reset(); // limpia el control
        this.modeloTrab.documentacion_licencia_fecha_expedicion = '';
        this.validator.limpiaInputRow(trabLicenciaExpedicionDate);
      }
    });
  }

  changeTrabDocsLicenciaNewRemove(event: Event,num_lista:any){
    this.popUpAccept = this.translate.instant("swal_yes_delete");
    this.popUpReject = this.translate.instant("swal_cancel");
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: this.translate.instant("swal_delete"),
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {label: 'Save'},
      accept: () => {
        const index = this.modeloTrab.documentacion_licencia_list_new.findIndex((row:any) => row.num_lista === num_lista);
        this.modeloTrab.documentacion_licencia_list_new.splice(index, 1);
      }
    });
  }

  changeTrabCBancariaBanco(token_bancos:any){
    var trabEditCBancariaBanco = document.getElementById("trabCBancariaBanco");
    const bank = this.lista_bancos.find((row:any) => row.token_bancos === token_bancos);
    const validacion = token_bancos != "" && typeof bank !== 'undefined';

    this.modeloTrab.cbancaria_banco_token = validacion ? bank.token_bancos : '';
    this.modeloTrab.cbancaria_banco_clave = validacion ? bank.clave : '';
    this.modeloTrab.cbancaria_banco_nombre_comercial = validacion ? bank.nombre_comercial : '';

    validacion ? this.validator.correctoSelectBrowser(trabEditCBancariaBanco) : this.validator.errorSelectBrowser(trabEditCBancariaBanco);
  }

  changeTrabCBancariaCuenta(event:any){
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value);
    this.modeloTrab.cbancaria_cuenta = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verCuenta(){
    var cuenta:any = document.getElementById("trabCBancariaCuenta");
    cuenta.type = cuenta.type === "password" ? "text" : "password";
    this.viewCuenta = cuenta.type === "text" ? true : false;
  }

  changeTrabCBancariaClabeInter(event:any){
    const validacion = event.value != '' && this.validator.filtroCuenta(event.value);
    this.modeloTrab.cbancaria_clabe_inter = validacion ? event.value : '';
    this.modeloTrab.cbancaria_sucursal = validacion ? event.value.substring(3,6) : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  verClabeInter(){
    var interbank:any = document.getElementById("trabCBancariaClabeInter");
    interbank.type = interbank.type === "password" ? "text" : "password";
    this.viewClabeInterbanc = interbank.type === "text" ? true : false;
  }

  selectTrabajoCentro(event:any,centrotrab_uuid:string){
    let c_trab = this.catalogo_centros_trabajo.find((row:any) => row.centrotrab_uuid === centrotrab_uuid);
    const validacion = centrotrab_uuid != "" && typeof c_trab !== 'undefined';
    if (validacion) {
      c_trab.select_for_trabajador = validacion && event.checked == true ? true : false;
      this.modeloTrab.centro_de_trabajo = event.checked ? c_trab.centrotrab_uuid : ''; 
    } else {
      this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa: ', detail: "El centro de trabajo seleccionado no se encuentra registrado"});
      this.modeloTrab.centro_de_trabajo = '';
    }
  }

  keyupTrabDepartamento(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.departamento = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupTrabPuesto(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modeloTrab.puesto = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabTipoSalario(salario_tipo:any){
    var trabEditTipoSalario = document.getElementById("trabTipoSalario");
    const sal_tipo = this.trab_lista_tipos_salario.find((sal:any) => sal.nombre === salario_tipo);
    const validacion = salario_tipo != "" && this.validator.filtroAlfaNumerico(salario_tipo) && sal_tipo.clave != "" && this.validator.filtroAlfaNumerico(sal_tipo.clave);
    this.modeloTrab.salario_tipo = validacion ? salario_tipo : '';
    validacion ? this.validator.correctoSelectBrowser(trabEditTipoSalario) : this.validator.errorSelectBrowser(trabEditTipoSalario);
  }

  changeTrabContratacionTipo(contrato_tipo:any){
    console.log(contrato_tipo);
    var trabEditContratoTipo = document.getElementById("trabContratoTipo");
    const contrato_tipos = this.trab_lista_tipos_contrato.find((tipc:any) => tipc.tipo === contrato_tipo);
    const validacion = contrato_tipo != "" && this.validator.filtroAlfaNumerico(contrato_tipo) && contrato_tipos.clave != "" && this.validator.filtroAlfaNumerico(contrato_tipos.clave);
    this.modeloTrab.contratacion_tipo = validacion ? contrato_tipos.clave : '';
    validacion ? this.validator.correctoSelectBrowser(trabEditContratoTipo) : this.validator.errorSelectBrowser(trabEditContratoTipo);
  }

  changeTrabContratacionFecha(event:any){
    const validacion = event.value != "" && this.validator.filtroFecha(event.value)
    this.modeloTrab.contratacion_fecha = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeTrabAltaEnEmpresaFecha(event:any){
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    this.modeloTrab.fecha_alta_en_empresa = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changeNominaPeriodicidad(opcion:any){
    var trabEditNominaPeriodicidad = document.getElementById("trabEditNominaPeriodicidad");
    let nper = this.nomina_periodos.find((row:any) => opcion.periodicidad != '' && row.periodicidad === opcion.periodicidad);
    this.modeloTrab.nomina_periodicidad = typeof nper !== 'undefined' ? nper.periodicidad : '';
    typeof nper !== 'undefined' ? this.validator.correctoSelectBrowser(trabEditNominaPeriodicidad) : this.validator.errorSelectBrowser(trabEditNominaPeriodicidad);
  }

  changeMonedaNomina(opcion:any){
    var trabEditNominaMoneda = document.getElementById("trabEditNominaMoneda");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    const validacion = opcion._filtro_busqueda != '' && this.validator.filtroAlfaNumerico(opcion._filtro_busqueda) && typeof mnd !== 'undefined';
    this.modeloTrab.nomina_moneda = typeof mnd !== 'undefined' ? mnd.code : '';
    this.modeloTrab.nomina_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : 0;
    validacion ? this.validator.correctoSelectBrowser(trabEditNominaMoneda) : this.validator.errorSelectBrowser(trabEditNominaMoneda);
  }

  keyupNominaSalarioDiario(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modeloTrab.nomina_salario_diario = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaSalarioIntegrado(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value);
    this.modeloTrab.nomina_salario_integrado = validacion ? event.value : 0.00;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupNominaDiasJornada(opcion:any){
    var trabNominaDiasJornada = document.getElementById("trabNominaDiasJornada");
    let njor = this.nomina_jornadas.find((row:any) => opcion.jornada != '' && row.jornada === opcion.jornada);
    const validacion = opcion.jornada != "" && this.validator.filtroAlfaNumerico(opcion.jornada) && typeof njor !== 'undefined';
    this.modeloTrab.tipo_jornada = validacion ? opcion.jornada : '';
    validacion ? this.validator.correctoSelectBrowser(trabNominaDiasJornada) : this.validator.errorSelectBrowser(trabNominaDiasJornada);
  }

  keyupNominaTurno(opcion:any){
    var trabNominaTurno = document.getElementById("trabNominaTurno");
    let ntur = this.nomina_turnos.find((row:any) => opcion.turno != '' && row.turno === opcion.turno);
    const validacion = opcion.turno != "" && this.validator.filtroAlfaNumerico(opcion.turno) && typeof ntur !== 'undefined';
    this.modeloTrab.turno = validacion ? opcion.turno : '';
    validacion ? this.validator.correctoSelectBrowser(trabNominaTurno) : this.validator.errorSelectBrowser(trabNominaTurno);
  }

  get validaRegistroTrabajador():Boolean{
    const OKPaterno = this.modeloTrab.apePaterno != "" && this.validator.strFilter(this.modeloTrab.apePaterno) && this.modeloTrab.apePaterno.length >= 4;
    const OKMaterno = this.modeloTrab.apeMaterno != "" && this.validator.strFilter(this.modeloTrab.apeMaterno) && this.modeloTrab.apeMaterno.length >= 4;
    const OKNombres = this.modeloTrab.nombres != "" && this.validator.strFilter(this.modeloTrab.nombres) && this.modeloTrab.nombres.length >= 3;
    const OKEdad = this.modeloTrab.edad > 0 && this.validator.filtroNum(this.modeloTrab.edad);
    const OKSexo = this.modeloTrab.sexo != "" && this.validator.strFilter(this.modeloTrab.sexo);
    const OKEstCivil = this.modeloTrab.estado_civil != "" && this.validator.strFilter(this.modeloTrab.estado_civil);
    const OKDomiCalle = this.modeloTrab.domicilio_CalleNumero != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_CalleNumero);
    const OKDomiCP = this.modeloTrab.domicilio_cod_postal != "" && this.validator.filtroNumericoCPostal(this.modeloTrab.domicilio_cod_postal) && this.modeloTrab.domicilio_cod_postal.length == 5;
    const OKDomiCol = this.modeloTrab.domicilio_colonia_vinculada != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_colonia_vinculada);
    const OKDomiMuni = this.modeloTrab.domicilio_municipio != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_municipio);
    const OKDomiestado = this.modeloTrab.domicilio_estado != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.domicilio_estado);
    const OKNacimDecha = this.modeloTrab.origen_nacimiento_fecha != "" && this.validator.filtroFecha(this.modeloTrab.origen_nacimiento_fecha);
    const OKNacimLugar = this.modeloTrab.origen_nacimiento_lugar != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.origen_nacimiento_lugar);
    const OKNacionalidad = this.modeloTrab.origen_nacionalidad != "";
    const OKContTelTipo = this.modeloTrab.contacto_telefono_tipo != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.contacto_telefono_tipo);
    const OKContTelNumero = this.phoneForm.valid && this.modeloTrab.contacto_telefono_numero.length >= 5 && this.validator.filtroPhone(this.modeloTrab.contacto_telefono_numero);
    const OKContEmail = this.modeloTrab.contacto_email != "" && this.validator.filtroCorreo(this.modeloTrab.contacto_email);
    const OKDocsCurp = this.modeloTrab.documentacion_curp != "" && this.validator.filtroCURP(this.modeloTrab.documentacion_curp);
    const OKDocsRfc = this.modeloTrab.documentacion_rfc != "" && this.validator.filtroRfcPersFisica(this.modeloTrab.documentacion_rfc);
    const OKDocsNSS = this.modeloTrab.documentacion_numero_de_seguridad_social != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.documentacion_numero_de_seguridad_social);
    //const OKDocsPassVisaLiv = this.modeloTrab.documentacion_pasaporte_list_new.length > 0 || this.modeloTrab.documentacion_visa_list_new.length > 0 || this.modeloTrab.documentacion_licencia_list_new.length > 0;

    const OKCBankBanco = this.modeloTrab.cbancaria_banco_token != "" && this.modeloTrab.cbancaria_banco_clave != "" && this.modeloTrab.cbancaria_banco_nombre_comercial != "";
    const OKCBankCuenta = this.modeloTrab.cbancaria_cuenta != '' && this.validator.filtroCuenta(this.modeloTrab.cbancaria_cuenta);
    const OKCBankClabeInter = this.modeloTrab.cbancaria_clabe_inter != '' && this.validator.filtroCuenta(this.modeloTrab.cbancaria_clabe_inter) && this.modeloTrab.cbancaria_sucursal != "";

    const OKCTrabajo = this.modeloTrab.centro_de_trabajo != '';

    const OKDepartamento = this.modeloTrab.departamento != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.departamento);
    const OKPuesto = this.modeloTrab.puesto != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.puesto);

    const OKSalarioTipo = this.modeloTrab.salario_tipo != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.salario_tipo);
    const OKContratacionTipo = this.modeloTrab.contratacion_tipo != "" && this.validator.filtroAlfaNumerico(this.modeloTrab.contratacion_tipo);
    const OKContratacionFecha = this.modeloTrab.contratacion_fecha != "" && this.validator.filtroFecha(this.modeloTrab.contratacion_fecha);
    const OKAltaEnEmpresaFecha = this.modeloTrab.fecha_alta_en_empresa != "" && this.validator.filtroFecha(this.modeloTrab.fecha_alta_en_empresa);
    
    let nper = this.nomina_periodos.find((row:any) => row.periodicidad === this.modeloTrab.nomina_periodicidad);
    const vNominaPeriodicidad = this.modeloTrab.nomina_periodicidad != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.nomina_periodicidad) && typeof nper !== 'undefined';
      
    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === this.modeloTrab.nomina_moneda);
    const vNominaMoneda = this.modeloTrab.nomina_moneda != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.nomina_moneda) && typeof mnd !== 'undefined';
      
    const vNominaSalarioDiario = Number(this.modeloTrab.nomina_salario_diario) == 0 || (Number(this.modeloTrab.nomina_salario_diario) > 0 && this.validator.filtroNum(this.modeloTrab.nomina_salario_diario));
    const vNominaSalarioIntegrado = Number(this.modeloTrab.nomina_salario_integrado) == 0 || (Number(this.modeloTrab.nomina_salario_integrado) > 0 && this.validator.filtroNum(this.modeloTrab.nomina_salario_integrado));
    const vNominaDiasJornada = this.modeloTrab.tipo_jornada != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.tipo_jornada);
    const vNominaTurno = this.modeloTrab.turno != '' && this.validator.filtroAlfaNumerico(this.modeloTrab.turno);

    return OKPaterno && OKMaterno && OKNombres && OKEdad && OKSexo && OKEstCivil && OKDomiCalle && OKDomiCP && OKDomiCol && OKDomiMuni && OKDomiestado && OKNacimDecha && OKNacimLugar && OKNacionalidad && 
      OKContTelTipo && OKContTelNumero && OKContEmail && OKDocsCurp && OKDocsRfc && OKDocsNSS && OKCBankBanco && OKCBankCuenta && OKCTrabajo && OKDepartamento && OKPuesto && OKSalarioTipo && OKContratacionTipo && 
      OKContratacionFecha && OKAltaEnEmpresaFecha && vNominaPeriodicidad && vNominaMoneda && vNominaSalarioDiario && vNominaSalarioIntegrado && vNominaDiasJornada && vNominaTurno;
  }

  registrarTrabajador(form:{reset:() => void;}):void{
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
        this.viewFormulario = false;
        this.trab_serv.registroTrabajador(this.modeloTrab).subscribe(
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
              this.viewFormulario = true;
              this.modeloTrab = new trabajadoresModelo('','','',0,'','',[],'','','','','','','','','','','','','','','','','','','',[],[],'','','',[],[],'',false,'','','','','',0,false,[],[],'','','','','','','','','','','','','','','',2,'','','','');
              this.descarga_centros_de_trabajo();
              this.validator.limpiaInputRow(document.getElementById("new_nomina_dias_jornada"));
              this.nomina_jornada_empleado = null;
              this.relInterna.mensajeTrabajadorRegistro("trabajador_registrado");
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
          error=> {
            console.log(error);
          }
        );
      }
    });
  }
}
