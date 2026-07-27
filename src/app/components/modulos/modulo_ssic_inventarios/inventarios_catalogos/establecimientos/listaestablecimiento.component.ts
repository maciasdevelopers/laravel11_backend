import { FormBuilder, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { PaisService } from '../../../../../servicios/ssic/pais.service';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { ServEncryptService } from '../../../../../servicios/ssic/serv-encrypt.service';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service'; 
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import numeral from 'numeral';
import { QRCodeComponent } from 'angularx-qrcode';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO } from 'ngx-material-intl-tel-input';
import { establecimientoModelo } from '../../../../../modelos/establecimientoModelo';
import { findIndex, Subject, takeUntil } from 'rxjs';
import { EstablecimientosService } from '../../../../../servicios/establecimientos';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-interno-egresos-catalogos',
  templateUrl: './listaestablecimiento.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
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
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/dirpostales.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
    './listaestablecimiento.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class EstablecimientosInventariosComponent implements OnInit, OnDestroy {
  public usuario: Usuarios;
//registro
  listaEmpleados:any = [];
  separateDialCode = false;
  CountryISO = CountryISO.Mexico;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  dataForm: FormGroup;
  public estabModel:establecimientoModelo;
  paisesLista:any = [];
  dipomex_cod_postal_colonias:any = [];
  secciones_de_trabajo:any = [];
  secciones_de_trabajo_selected:any = [];
//catalogos
  tipos_establecimiento:any = [];

  arrayEstablecimientosTRUE:any = [];
  indicadorEstablecimientosTRUE:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoEstablecimientosTRUE: Date[] | undefined;

  establecimientoDetalle:any = [];
  establecimientoModal:boolean = false;
  establecimientoFolioAlias:string = "";
  arrayEstablecimientosFALSE:any = [];
  viewFormulario:boolean = true;

  loading = false;
  private destruir$ = new Subject<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private dirServ: DireccionesService,
    private translate:TranslateService,
    private _pais: PaisService,
    private _personal: EmpleadosService,
    private estabServ:EstablecimientosService,
    private relInterna:ComunicacionInternaService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.estabModel = new establecimientoModelo("","","","",false,false,false,false,"","","","","","","","","",null,null);
    this.dataForm = this.fb.group({
      telefono: ['', Validators.required],
      tipo_estab: [this.estabModel.tipo || null],
      pais_ubicacion: [this.estabModel.ubicacion_pais || null],
      secciones:[this.secciones_de_trabajo_selected || []]
    });
  }
  ngOnInit(): void {
    this.catalogoEmpleados();
    this.listar_paises();
    this.verEstablecimientos('hoy');
    this.getRespuestaRegistroEstablecimiento();
    this.listarEstablecimientosDeleted();
    this.listar_establecimientos_tipo();
    this.listar_secciones_de_trabajo();
  }

  getRespuestaRegistroEstablecimiento(){
    this.relInterna.mensajeInsertEstablecimiento$.subscribe(
      (mensaje:any) => {
        mensaje == "establecimiento_registrado" ? this.listarEstablecimientos() : null;
      }
    );
  }

  listar_secciones_de_trabajo(){
    this.secciones_de_trabajo = [
      {clave:'aplicaIngresos', name:'Ingresos'},
      {clave:'aplicaEgresos', name:'Egresos'},
      {clave:'aplicaProcesosInternos', name:'Procesos internos'},
    ];
  }

  listar_establecimientos_tipo(){
    this.tipos_establecimiento = [
      {data_db:'matriz', tipo:'Matriz'},
      {data_db:'sucursal', tipo:'Sucursal'},
      {data_db:'puntoVenta', tipo:'Puntos de Venta'},
      {data_db:'Filial', tipo:'Filiales'},
      {data_db:'Franqui', tipo:'Franquicias'},
      {data_db:'Connet', tipo:'Conecciones'},
    ];
  }

  bindPressAlpha(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (this.validator.filtroAlfaNumerico(clave) == false) {
      this.validator.deten(event);
    }
  }

  catalogoEmpleados(){
    this._personal.catalogoGeneralTrabajadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaEmpleados = response.empleados;
          console.log(this.listaEmpleados);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listar_paises(){
    this._pais.getApiPaisCatalogo().subscribe(
      response => {
        this.paisesLista = response.status == 'success' ? response.paises : [];
      },
      error => {
        console.log(error);
      }
    );
  }

  listarEstablecimientos() {
    this.verEstablecimientos(this.indicadorEstablecimientosTRUE);
  }

  verEstablecimientos(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas'){
    this.indicadorEstablecimientosTRUE = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';
    this.loading = true;

    if (filtro == 'otras_fechas') {
      var estab_otras_fechas = document.getElementById("estab_otras_fechas");
      if (this.rangoPeriodoEstablecimientosTRUE && this.rangoPeriodoEstablecimientosTRUE.length === 2) {
        const dateInicio = this.rangoPeriodoEstablecimientosTRUE[0];
        const dateFin = this.rangoPeriodoEstablecimientosTRUE[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(estab_otras_fechas);
          } else {
            this.validator.errorInputRow(estab_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(estab_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(estab_otras_fechas);
        return;
      }
    }

    this.estabServ.listaEstablecimientos(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
      next: (response) => this.procesarRespuesta(response),
      error: (err) => this.manejarError(err)
    });
  }

  private procesarRespuesta(response: any) {
    this.loading = false;
    if (response.status === 'success') {
      this.arrayEstablecimientosTRUE = response.establecimientos;
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.arrayEstablecimientosTRUE = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarError(error: any) {
    this.loading = false;
    console.error('Error al cargar establecimientos:', error);
    this.arrayEstablecimientosTRUE = [];
  }

  infEstabView(token_establecimiento: any) { 
    this.estabServ.detalleEstablecimientos(token_establecimiento).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.establecimientoModal = true;
          this.establecimientoDetalle = response.status == 'success' ? response.arrayAlmacen : [];
          this.estabModel = new establecimientoModelo("","","","",false,false,false,false,"","","","","","","","","",null,null);
          this.dipomex_cod_postal_colonias = [];
          this.establecimientoDetalle.forEach((row:any) => {
            this.establecimientoFolioAlias = row.estab_folio+" "+row.estab_alias;

            this.estabModel.alias = row.estab_alias; 
            this.estabModel.tipo = row.estab_tipo;
            this.dataForm.patchValue({tipo_estab: row.estab_tipo});
            this.estabModel.descripcion = row.estab_desc;

            this.estabModel.aplica_almacen = row.aplica_almacen;

            this.estabModel.encargado = row.estab_encargado_token;
            this.estabModel.phoneAll = row.telefono;
            this.dataForm.patchValue({telefono: row.telefono});
            this.estabModel.cuenta_contable = row.cuenta_contable

            this.estabModel.aplica_ingresos = row.aplica_ingresos;
            this.estabModel.aplica_egresos = row.aplica_egresos;
            this.estabModel.aplica_procesos_internos = row.aplica_interno;
            this.secciones_de_trabajo_selected = [];
            if(row.aplica_ingresos) this.secciones_de_trabajo_selected.push('aplicaIngresos');
            if(row.aplica_egresos) this.secciones_de_trabajo_selected.push('aplicaEgresos');
            if(row.aplica_interno) this.secciones_de_trabajo_selected.push('aplicaProcesosInternos');
            console.log(this.secciones_de_trabajo_selected);
            this.dataForm.patchValue({secciones: this.secciones_de_trabajo_selected});

            this.estabModel.ubicacion_pais = row.estab_ubicacion_pais;
            this.dataForm.patchValue({pais_ubicacion: row.estab_ubicacion_pais});

            if (row.estab_ubicacion_pais == "MEX") {
              this.estabModel.dipomex_cod_postal_estado = row.estado_main;
              this.estabModel.dipomex_cod_postal_municipio = row.municipio_main;
              this.estabModel.dipomex_cod_postal_cp = row.c_postal_main;
              this.estabModel.dipomex_cod_postal_colonia_vinculada = row.colonia_main;
              
              if (this.estabModel.dipomex_cod_postal_cp != '') {
                this.dirServ.postCodPostalDipomex(row.c_postal_main).subscribe(
                  response => {
                    if (response.status == "success") {
                      this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
                    } else {
                      Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
                      if (response.message == "postal_empty") {
                        this.dipomex_cod_postal_colonias = [];
                      }
                    }
                  },
                  error => {
                    console.log(error);
                  }
                );
              }
            } else {
              this.estabModel.ext_direccion_completa = row.cod_postalext;
            }
  
          });
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  keyupfunctiontxtAlias(event:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    this.estabModel.alias = event.value;
    const validar = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof estab !== 'undefined' && this.estabModel.alias != estab.estab_alias; 
    validar ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  changefunctiontxtTipo(tipo:any,token_establecimiento:any){
    var estabEditTipos = document.getElementById("estabEditTipos");
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    let tpEstab = this.tipos_establecimiento.find((row:any) => tipo.tipo != '' && row.tipo === tipo.tipo);
    this.estabModel.tipo = tipo.data_db;
    const validacion = tipo.tipo != "" && this.validator.filtroAlfaNumerico(tipo.tipo) && typeof tpEstab !== 'undefined' && typeof estab !== 'undefined' && this.estabModel.tipo != estab.estab_tipo;
    validacion ? this.validator.correctoSelectBrowser(estabEditTipos) : this.validator.errorSelectBrowser(estabEditTipos);
  }

  keyupfunctiontxtDescripcion(event:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    this.estabModel.descripcion = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof estab !== 'undefined' && this.estabModel.descripcion != estab.estab_desc;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }
  
  functionAplicaAlmacen(event:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    this.estabModel.aplica_almacen = event.checked ? true : false;
  }

  probarTextPhone(){
    if (this.dataForm.valid) {
      console.log(this.dataForm);
      //const phone = this.dataForm.get('telefono')?.value;
      console.log(this.dataForm.value.telefono);
      const phone = this.dataForm.value.telefono;
      if (phone) {
        console.log('Número internacional:', phone.internationalNumber);
        console.log('Número nacional:', phone.nationalNumber);
        console.log('Código de país:', phone.countryCode);
        console.log('Dial code:', phone.dialCode);
      }
    }
  }

  telefonoKeyupNumeroCont_reg(event:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    var estabTelefonos = document.getElementById("estabTelefonos");
    const phone = this.dataForm.value.telefono;
    this.estabModel.phoneAll = phone;
    const validacion = this.dataForm.valid && phone.length >= 5 && this.validator.filtroPhone(phone) && this.estabModel.phoneAll != estab.telefono;
    validacion ? this.validator.correctoTelefonos(estabTelefonos) : this.validator.errorTelefonos(estabTelefonos);
  }

  keyupfunctionCuentaContable(event:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    this.estabModel.cuenta_contable = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof estab !== 'undefined' && this.estabModel.cuenta_contable != estab.cuenta_contable;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  functionAplicaMultiple(aplican:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    var estabEditSeccionTrabajo = document.getElementById("estabEditSeccionTrabajo");
    const values = aplican.map((item: any) => item.clave);
    this.estabModel.aplica_ingresos = values.includes('aplicaIngresos');
    this.estabModel.aplica_egresos = values.includes('aplicaEgresos');
    this.estabModel.aplica_procesos_internos = values.includes('aplicaProcesosInternos');

    const _valid_ing = this.estabModel.aplica_ingresos != estab.aplica_ingresos;
    const _valid_egr = this.estabModel.aplica_egresos != estab.aplica_egresos;
    const _valid_pri = this.estabModel.aplica_procesos_internos != estab.aplica_interno;

    const validacion = aplican.length > 0 && typeof estab !== 'undefined' && (_valid_ing || _valid_egr || _valid_pri);
    validacion ? this.validator.correctoSelectBrowser(estabEditSeccionTrabajo) : this.validator.errorSelectBrowser(estabEditSeccionTrabajo);
  }

  changePais(pais:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    console.log(pais)
    var estabEditPaises = document.getElementById("estabEditPaises");
    const registro = this.paisesLista.find((row:any) => row.alpha3 === pais);
    this.estabModel.ubicacion_pais = registro.alpha3;
    const validacion = pais != "" && this.validator.filtroAlfaNumerico(pais) && typeof estab !== 'undefined' && this.estabModel.ubicacion_pais != estab.estab_ubicacion_pais;
    validacion ? this.validator.correctoSelectBrowser(estabEditPaises) : this.validator.errorSelectBrowser(estabEditPaises);
  }

  //diraccion nacional
  buscaCodPostalDipomex(event:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    if (event.value != "" && event.value.length == 5) {
      this.validator.correctoInputRow(event);
      this.dipomex_cod_postal_colonias.length = 0;
      this.estabModel.dipomex_cod_postal_cp = "";
      this.estabModel.dipomex_cod_postal_estado = "";
      this.estabModel.dipomex_cod_postal_municipio = "";
      this.estabModel.dipomex_cod_postal_colonia_vinculada = "";
      this.dirServ.postCodPostalDipomex(event.value).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response.cod_postal);
            this.estabModel.dipomex_cod_postal_estado = response.cod_postal["estado"]+" ("+response.cod_postal["estado_abreviatura"]+")";
            this.estabModel.dipomex_cod_postal_municipio = response.cod_postal["municipio"] != '---' ? response.cod_postal["municipio"] : this.translate.instant("unk_nown");
            this.estabModel.dipomex_cod_postal_cp = response.cod_postal["codigo_postal"];
            this.dipomex_cod_postal_colonias = response.cod_postal["colonias"];
            if (response.cod_postal["colonias"].length == 1) {
              this.estabModel.dipomex_cod_postal_colonia_vinculada = response.cod_postal["colonias"][0];
            }
          } else {
            Swal.fire({position:"top-end",icon: "warning",title: this.translate.instant(response.message),showConfirmButton:false,timer: 3000})
            if (response.message == "postal_empty") {
              this.estabModel.dipomex_cod_postal_estado = this.translate.instant("unk_nown");
              this.estabModel.dipomex_cod_postal_municipio = this.translate.instant("unk_nown");
              this.estabModel.dipomex_cod_postal_cp = this.translate.instant("unk_nown");
            }
          }
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.validator.errorInputRow(event)
    }
  }

  seleccionaColoniaCPDipomex(colonia_name:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    const find_colonia = this.dipomex_cod_postal_colonias.find((row:any) => row === colonia_name);
    this.estabModel.dipomex_cod_postal_colonia_vinculada = find_colonia;
    const validacion = colonia_name != "" && this.validator.filtroAlfaNumerico(colonia_name) && typeof find_colonia !== 'undefined';
    //validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  //diraccion extranjero
  keyupfunctionEstablecimExtCompleto(event:any,token_establecimiento:any){
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    this.estabModel.ext_direccion_completa = event.value;
    const validacion = event.value != "" && this.validator.filtroDomNum(event.value) && typeof estab !== 'undefined' && this.estabModel.ext_direccion_completa != estab.ext_direccion_completa;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  bindPressDireccEstabExt(event:any){
    var clave = String.fromCharCode(!event.charCode ? event.which :event.charCode);
    if (this.validator.filtroDom(clave) == false) {
      this.validator.deten(event);
    }
  }

  validateActualizacion(token_establecimiento:string):boolean {
    const estab = this.establecimientoDetalle.find((row:any) => row.token_establecimiento === token_establecimiento);
    if (typeof estab !== 'undefined') {
      const validacion_alias = this.estabModel.alias != "" && this.validator.filtroAlfaNumerico(this.estabModel.alias) && this.estabModel.alias != estab.estab_alias;
      const validacion_tipo  = this.estabModel.tipo != "" && this.validator.filtroAlfaNumerico(this.estabModel.tipo) && this.estabModel.tipo != estab.estab_tipo;
      const validacion_descripcion = this.estabModel.descripcion != "" && this.validator.filtroAlfaNumerico(this.estabModel.descripcion) && this.estabModel.descripcion != estab.estab_desc;
      const validacion_almc_aplica = this.estabModel.aplica_almacen != estab.aplica_almacen;
      const validacion_telefonos = this.estabModel.phoneAll != "" && this.estabModel.phoneAll != estab.telefono;
      const validacion_cuenta_contable = this.estabModel.cuenta_contable != "" && this.estabModel.cuenta_contable != estab.cuenta_contable;
      const valicacion_aplica_ing = this.estabModel.aplica_ingresos != estab.aplica_ingresos;
      const valicacion_aplica_egr = this.estabModel.aplica_egresos != estab.aplica_egresos;
      const valicacion_aplica_pin = this.estabModel.aplica_procesos_internos != estab.aplica_interno;
      const validacion_ubicacion_pais = this.estabModel.ubicacion_pais != "" && this.validator.filtroAlfaNumerico(this.estabModel.ubicacion_pais) && this.estabModel.ubicacion_pais != estab.estab_ubicacion_pais;
      //const validacion_ubicacion_mx = this.estabModel.ubicacion_pais == "Mx" && this.estabModel.dipomex_cod_postal_cp != "" && this.estabModel.dipomex_cod_postal_estado != "" && this.estabModel.dipomex_cod_postal_municipio != "" && this.estabModel.dipomex_cod_postal_colonia_vinculada != "";
      //const validacion_ubicacion_ext = this.estabModel.ubicacion_pais == "Ext" && this.estabModel.ext_direccion_pais != "" && this.estabModel.ext_direccion_completa != "" && this.validator.filtroDom(this.estabModel.ext_direccion_completa);
      return validacion_alias || validacion_tipo || validacion_descripcion || validacion_almc_aplica || validacion_telefonos || validacion_cuenta_contable || 
        valicacion_aplica_ing || valicacion_aplica_egr || valicacion_aplica_pin || validacion_ubicacion_pais;// && (validacion_ubicacion_mx || validacion_ubicacion_ext);// && validacion_cuenta_contable;
    } else {
      return false
    }
  }

  actualizarEstablecimiento(token_establecimiento:string,form:{reset:() => void;}){
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
        //this.estabModel.descripcion
        this.estabServ.updateEstablecimiento(token_establecimiento,this.estabModel).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              setTimeout(() => {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
              },3000);
              this.viewFormulario = true;
              this.estabModel = new establecimientoModelo("","","","",false,false,false,false,"","","","","","","","","",null,null);
              form.reset();
              this.infEstabView(token_establecimiento);
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
    })
  }

  funcDeleteEstablecimiento(token_establecimiento: any) {
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
        this.estabServ.deleteEstablecimiento(token_establecimiento).subscribe(
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
              this.listarEstablecimientos();
              this.listarEstablecimientosDeleted();
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
    })
  }

  listarEstablecimientosDeleted() {
    this.estabServ.listaEstablecimientosDeleted().subscribe(
      response => {
        console.log(response.status);
        if (response.status == 'success') {
          this.arrayEstablecimientosFALSE = response.establecimientos;
          console.log(this.arrayEstablecimientosFALSE);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  funcRestartEstablecimiento(token_establecimiento: any) {
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
        this.estabServ.restoreEstablecimiento(token_establecimiento).subscribe(
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
              this.listarEstablecimientos();
              this.listarEstablecimientosDeleted();
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
    })
  }

  funcDeleteDefinitivamenteEstablecimiento(token_establecimiento: any) {
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
        this.estabServ.permdeleteEstablecimiento(token_establecimiento).subscribe(
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
              this.listarEstablecimientos();
              this.listarEstablecimientosDeleted();
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
    })
  }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
