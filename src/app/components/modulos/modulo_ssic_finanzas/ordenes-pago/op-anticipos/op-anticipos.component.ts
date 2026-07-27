import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { CuentbancService } from '../../../../../servicios/ssic/cuentbanc.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import { TranslateService } from '@ngx-translate/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'finanzas_op_anticipos',
  standalone: false,
  
  templateUrl: './op-anticipos.component.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/breadcrumb.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/canvas.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../finanzas.css',
    './op-anticipos.component.css',
  ]
})
export class OpAnticiposComponent implements OnInit{
//monedas
  catalogo_monedas_api:any = [];
//cajas
  search_cajas_registradas:any = [];
  listaCajasRegistradas:any = [];
//cuentas
  search_cuentas_bancarias:any = [];
  listaCuentasBancarias:any = [];
//monederos
  search_cuentas_monedero_electronico:any = [];
  listaCuentasMonederoElectronico:any = [];

  info_anticipo_auth:any = [];
  search_anticipos_list:any = [];

  anticipos_autorizar_list:any = [];
  indicadorAutorizarAnticipos:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoAutorizarAnticipos: Date[] | undefined;

  anticipos_cat_autorizados:any = [];
  indicadorAnticiposAutorizados:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoAnticiposAutorizados: Date[] | undefined;

  desglose_anticipo_folio:string = '';
  info_anticipo_desglose:any = [];

  public filesAnticipo: NgxFileDropEntry[] = [];
  public docsAnticipoAnexos:any [] = [];
  public docsAnticipoAnexosNames:any = [];
  public ver_antitipos_autorizar:boolean = false;
  private destruir$ = new Subject<void>();

  public anticipo_window_cancelacion:boolean = false;
  public viewNewCancelacionForm:boolean = false;
  public cancelacion_anticipo_uuid: string = "";
  public cancelacion_anticipo_folio: string = "";
  public cancelacion_fecha_contabilizacion: string = "";
  public cancelacion_observaciones: string = "";

  constructor(
    private provSer:ProveedoresService,
    private validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private _cajServ: CajaServService,
    private _monedasServ: MonedasService,
    private cuentaBan:CuentbancService,
    private monedero:MonederoElectService,
    private translate:TranslateService,
    private cd: ChangeDetectorRef
  ){
  }

  ngOnInit(): void {
    this.getRespuestaOrdSeccionModule();
    this.search_anticipos_list = ['anticipo_uuid','anticipo_folio','proveedor_folio','proveedor_nombre','proveedor_nombre_comercial','anticipo_fecha_contabilizacion','anticipo_forma_pago',
      'anticipo_cantidad_anticipo_format','anticipo_tipo_cambio_format','anticipo_cantidad_anticipo_real_format','anticipo_observaciones'];
    this.search_cajas_registradas = ['caja_folio','caja_alias','establecimiento','salDoCaja','select_for_pagos','token_caja'];
    this.search_cuentas_bancarias = ['select_for_pagos','folio_cuenta','banco_clave','banco_nombre_comercial','token_cuenta','cuenta_bancaria','cuenta_view','cuenta_time','saldo_cuenta_format'];
    this.search_cuentas_monedero_electronico = ['select_for_pagos','token_cuentaMon','folio_cuenta','monedero','cuenta_frontend','saldo_cuenta_format'];
  }

  getRespuestaOrdSeccionModule() {
    this.relInterna.mensajeOrdPagoSeccionModule$.subscribe(
      (mensaje: any) => {
        if (mensaje == "seccion_op_anticipos") {
          console.log(mensaje);
          if (this.anticipos_cat_autorizados.length === 0) this.ver_anticipos_catalogo_autorizados('hoy');
        }
      }
    );
  }
  
  monedas_lista(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if(response.status == 'success'){
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }
  
  getCajasRegistradas(){
    this._cajServ.verListaCajas('all_partidas','','').subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.listaCajasRegistradas = response.caja;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  
  getCuentasBancarias(){
    this.cuentaBan.catCuentasBancariasMain('all_partidas','','').subscribe(
      response =>{
        if (response.status == 'success') {
          this.listaCuentasBancarias = response.cuentas;
        }
      },
      error => {
        console.log(error);
      }
    )
  }
  
  getMonederosElectronicos(){
    this.monedero.catalogoMonederosElect('all_partidas','','').subscribe(
      response =>{
        console.log(response)
        if (response.status == 'success') {
          this.listaCuentasMonederoElectronico = response.monedero;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  open_window_anticipos_autorizar(){
    this.ver_antitipos_autorizar = true;
  }

  lista_anticipos_para_autorizar(){
    this.ver_anticipos_para_autorizar(this.indicadorAutorizarAnticipos);
  }

  ver_anticipos_para_autorizar(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorAutorizarAnticipos = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var pag_soli_anticipos_otras_fechas = document.getElementById("pag_soli_anticipos_otras_fechas");
      if (this.rangoPeriodoAutorizarAnticipos && this.rangoPeriodoAutorizarAnticipos[1]) {
        const dateInicio = this.rangoPeriodoAutorizarAnticipos[0];
        const dateFin = this.rangoPeriodoAutorizarAnticipos[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(pag_soli_anticipos_otras_fechas);
          } else {
            this.validator.errorInputRow(pag_soli_anticipos_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(pag_soli_anticipos_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(pag_soli_anticipos_otras_fechas);
      }
    }

    this.provSer.listarAnticiposProvSolicitudes(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.anticipos_autorizar_list = response.anticipos_registrados;
          this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
        } else {
          this.anticipos_autorizar_list = []; // O manejar mensaje de "sin datos"
        }
      },
      error: (err) => {
        console.error('Error al cargar anticipos:', err);
        this.anticipos_autorizar_list = [];
      }
    });
  }

  anticipo_autorizacion_ventana(ant:any){
    if (this.catalogo_monedas_api.length === 0) this.monedas_lista();
    if (this.listaCajasRegistradas.length === 0) this.getCajasRegistradas();
    if (this.listaCuentasBancarias.length === 0) this.getCuentasBancarias();
    if (this.listaCuentasMonederoElectronico.length === 0) this.getMonederosElectronicos();

    this.info_anticipo_auth = [];
    console.log("autorizar "+ant.anticipo_folio);
    ant.visible_for_autorizar = true;
    this.info_anticipo_auth.push(ant);
  }

  anticipo_autorizacion_fecha_contab(ant:any,event:any){
    const validacion = event.value != "" && this.validator.filtroFecha(event.value) && typeof ant !== 'undefined' && ant.visible_for_autorizar; 
    ant.anticipo_procesos_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  anticipo_autorizacion_moneda(ant:any,opcion:any){
    console.log(opcion._filtro_busqueda);
    var selectedMonedaCode = document.getElementById("selectedAntMonedaCode");
    const mnd = this.catalogo_monedas_api.find((row: any) => row._filtro_busqueda === opcion._filtro_busqueda);
    ant.anticipo_procesos_moneda = typeof mnd !== 'undefined' ? mnd.code : '';
    ant.anticipo_procesos_moneda_decimales = typeof mnd !== 'undefined' ? mnd.decimales : '';
    ant.anticipo_procesos_tipo_cambio_number = typeof mnd !== 'undefined' && mnd.code == "MXN" ? 1 : 0;
    ant.anticipo_procesos_tipo_cambio_string = typeof mnd !== 'undefined' && mnd.code == "MXN" ? "1.00" : "";
    typeof mnd !== 'undefined'  ? this.validator.correctoSelectBrowser(selectedMonedaCode) : this.validator.errorSelectBrowser(selectedMonedaCode);
  }

  anticipo_autorizacion_importe(ant:any,event:any){
    if (!ant) return;
    console.log(ant);

    const valorIngresado = Number(event.value);
    const valorReferencia = Number(ant.anticipo_cantidad_anticipo);
    const tipoCambio = Number(ant.anticipo_procesos_tipo_cambio_number || 1);

    const esNumeroValido = !isNaN(valorIngresado) && event.value !== '';
    const esImporteCorrecto = valorIngresado.toFixed(ant.anticipo_procesos_moneda_decimales) === valorReferencia.toFixed(ant.anticipo_procesos_moneda_decimales);

    //const validacion = event.value != '' && this.validator.filtroNum(event.value) && event.value == ant.anticipo_cantidad_anticipo && parseFloat(event.value) * parseFloat(ant.anticipo_procesos_tipo_cambio_number) == ant.anticipo_cantidad_anticipo_real;
    const validacion = event.value != '' && this.validator.filtroNum(event.value) && esNumeroValido && esImporteCorrecto;
    ant.anticipo_procesos_importe = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.anticipo_autorizacion_importe_resultante_text(ant);
  }

  anticipo_autorizacion_tipo_cambio(ant:any,event:any){
    const validacion = event.value != '' && this.validator.filtroNum(event.value) == true && parseFloat(ant.anticipo_procesos_importe) * parseFloat(event.value) == ant.anticipo_cantidad_anticipo_real;
    ant.anticipo_procesos_tipo_cambio_number = validacion ? event.value : 0;
    ant.anticipo_procesos_tipo_cambio_string = validacion ? event.value : '0.00';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    this.anticipo_autorizacion_importe_resultante_text(ant);
  }

  anticipo_autorizacion_importe_resultante_text(ant:any){
    ant.anticipo_procesos_importe_resultante = parseFloat(ant.anticipo_procesos_importe) * parseFloat(ant.anticipo_procesos_tipo_cambio_number);
    ant.anticipo_procesos_importe_resultante_string = numeral(ant.anticipo_procesos_importe_resultante).format('0,0.'+'0'.repeat(parseInt(ant.anticipo_procesos_moneda_decimales)))+" "+ant.anticipo_procesos_moneda;
  }

  anticipo_autorizacion_forma_pago(ant:any,event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    ant.anticipo_procesos_f_pago = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  select_anticipo_autorizacion_caja(ant:any,event:any,token_caja:string){
    let caja = this.listaCajasRegistradas.find((row:any) => row.token_caja === token_caja);
    const validacion = token_caja != "" && typeof caja !== 'undefined';
    caja.select_for_pagos = validacion ? event.checked : false;
    caja.monto_aplicar = validacion && caja.saldofloat < ant.anticipo_monto_real ? caja.saldofloat : 0;
    console.log(caja);
    this.aumenta_importe_acree();
  }

  anticipo_autorizacion_importe_by_caja(event:any,token_caja:any){
    const caja_list = this.listaCajasRegistradas.find((row:any) => row.token_caja === token_caja);
    const validacion = event.value != "" && this.validator.filtroNum(event.value) && typeof token_caja !== 'undefined';
    caja_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_acree() : null;
    console.log(caja_list);
  }

  select_anticipo_autorizacion_cuenta(ant:any,event:any,token_cuenta:any){
    const cuent = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === token_cuenta);
    const validacion = token_cuenta != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    cuent.monto_aplicar = validacion && cuent.saldofloat < ant.anticipo_monto_real ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumenta_importe_acree();
  }

  functCuentaNumber(token_cuenta:any){
    let account = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === token_cuenta);
    account.cuenta_view = account.cuenta_view ? false : true;
    var intervalo:any = null;
    if (account.cuenta_view) {
      this.cuentaBan.verCuentaBancariaCompleta(token_cuenta).subscribe(
        response => {
          if (response.status == 'success') {
            account.cuenta_bancaria = response.cuenta_bancaria;
            account.cuenta_time = 30;
            intervalo = setInterval(() => {
              account.cuenta_time = account.cuenta_time - 1;
              if (account.cuenta_time == 0 || !account.cuenta_view) {
                account.cuenta_view = false;
                account.cuenta_time = 0;
                clearInterval(intervalo);
                this.cuentaBan.verCuentaBancaria4Digitos(token_cuenta).subscribe(
                  response => {
                    if (response.status == 'success') {
                      account.cuenta_bancaria = response.cuenta_bancaria;
                    }
                  },
                  error =>{
                    console.log(error);
                  }
                );
              }
            },1000);
          }
        },
        error =>{
          console.log(error);
        }
      );
    } else {
      this.cuentaBan.verCuentaBancaria4Digitos(token_cuenta).subscribe(
        response => {
          if (response.status == 'success') {
            account.cuenta_bancaria = response.cuenta_bancaria;
          }
        },
        error =>{
          console.log(error);
        }
      );
      return;
    }
  }

  acree_importe_by_cuenta(event:any,token_cuenta:any){
    const cuent_list = this.listaCuentasBancarias.find((row:any) => row.token_cuenta === token_cuenta);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof cuent_list !== 'undefined';
    cuent_list.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_acree() : null;
    console.log(cuent_list);
  }

  select_anticipo_autorizacion_electronico(ant:any,event:any,token_cuentaMon:any){
    const cuent = this.listaCuentasMonederoElectronico.find((row:any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = token_cuentaMon != "" && typeof cuent !== 'undefined';
    cuent.select_for_pagos = validacion ? event.checked : false;
    cuent.monto_aplicar = validacion && cuent.saldofloat < ant.anticipo_monto_real ? cuent.saldofloat : 0;
    console.log(cuent);
    this.aumenta_importe_acree();
  }

  acree_importe_by_monedero(event:any,token_cuentaMon:any){
    const moned = this.listaCuentasMonederoElectronico.find((row:any) => row.token_cuentaMon === token_cuentaMon);
    const validacion = event.value != 0 && this.validator.filtroNum(event.value) && typeof moned !== 'undefined';
    moned.monto_aplicar = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.aumenta_importe_acree() : null;
    console.log(moned);
  }

  aumenta_importe_acree(){
    var suma_order_importe = 0;    
    const caja_list = this.listaCajasRegistradas.filter((row:any) => row.select_for_pagos === true);
    caja_list.forEach((caj:any) => {
      const aplicar = caj.monto_aplicar ? parseFloat(caj.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    const cuent_list = this.listaCuentasBancarias.filter((row:any) => row.select_for_pagos === true);
    console.log(cuent_list.length);
    cuent_list.forEach((account:any) => {
      const aplicar = account.monto_aplicar ? parseFloat(account.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });

    const moned_list = this.listaCuentasMonederoElectronico.filter((row:any) => row.select_for_pagos === true);
    moned_list.forEach((account:any) => {
      const aplicar = account.monto_aplicar ? parseFloat(account.monto_aplicar.toString()) : 0;
      suma_order_importe += aplicar;
    });
  }

  anticipo_autorizacion_observacion(ant:any,event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && typeof ant !== 'undefined' && ant.visible_for_autorizar;
    ant.anticipo_procesos_comentarios = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedDocsAnticipo(files: NgxFileDropEntry[]) {
    this.filesAnticipo = files;
    this.docsAnticipoAnexosNames = [];
    this.docsAnticipoAnexos = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.docsAnticipoAnexos.push(file,droppedFile.relativePath);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement+" "+nameFile)

          if (file.size <= 2000000 && (typoElement == 'application/pdf' || typoElement == 'text/xml' || typoElement == 'image/jpeg' || typoElement == 'image/jpg' || typoElement == 'image/png')) {
            this.docsAnticipoAnexosNames.push({"typoElement":typoElement,"nameFile":nameFile});
            if (this.docsAnticipoAnexos.length > 0) {
              for (let j = 0; j < this.docsAnticipoAnexos.length; j++) {
                const row = this.docsAnticipoAnexos[j];
                if (row["name"] != nameFile) {
                  this.docsAnticipoAnexos.push(file);
                }
              }
            } else {
              this.docsAnticipoAnexos.push(file);
            }
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El event.value '+nameFile+' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/pdf' && typoElement != 'text/xml' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo '+nameFile+' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position:'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton:false,
              timer: 3000
            })
            this.filesAnticipo.splice(i,1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.docsAnticipoAnexos.length);
  }

  public fileOverDocsAnticipo(event:any){
    console.log(event);
  }

  public fileLeaveDocsAnticipo(event:any){
    console.log(event);
  }

  deleteAnexosDocsAnticipo(posicion:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionedo?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.filesAnticipo.splice(posicion,1);
          this.docsAnticipoAnexos.splice(posicion,1);
          this.docsAnticipoAnexosNames.splice(posicion,1);
          console.log(this.docsAnticipoAnexos.length);
        }
      }
    );
  }

  anticipo_autorizacion_validate(ant:any):Boolean {
    if (!ant) return false;
    if (!ant.visible_for_autorizar) return false;

    const numDecimals = Number(ant.anticipo_procesos_moneda_decimales) || 2;
    const valorReferencia = Number(ant.anticipo_cantidad_anticipo).toFixed(numDecimals);

    const compararMonto = (monto: any) => {
      if (monto === undefined || monto === null) return false;
      return Number(monto).toFixed(numDecimals) === valorReferencia;
    };

    const validacion_fecha_contabilizacion = ant.anticipo_procesos_fecha_contabilizacion != "" && this.validator.filtroFecha(ant.anticipo_procesos_fecha_contabilizacion);

    const mnd = this.catalogo_monedas_api.find((row: any) => row.code === ant.anticipo_procesos_moneda);
    const validacion_moneda = ant.anticipo_procesos_moneda != '' && this.validator.filtroAlfaNumerico(ant.anticipo_procesos_moneda) == true && typeof mnd !== 'undefined';
    const validacion_tipo_cambio = ant.anticipo_procesos_tipo_cambio_number > 0 && this.validator.filtroNum(ant.anticipo_procesos_tipo_cambio_number);

    const caja_list = this.listaCajasRegistradas.filter((row:any) => 
      row.select_for_pagos === true && Number(row.monto_aplicar) > 0 && compararMonto(row.monto_aplicar)
    );
    const cuent_list = this.listaCuentasBancarias.filter((row:any) => 
      row.select_for_pagos === true && Number(row.monto_aplicar) > 0 && compararMonto(row.monto_aplicar)
    );
    const moned_list = this.listaCuentasMonederoElectronico.filter((row:any) => 
      row.select_for_pagos === true && Number(row.monto_aplicar) > 0 && compararMonto(row.monto_aplicar)
    );
    const validacion_salida_dinero = (typeof caja_list !== 'undefined' && caja_list.length > 0) || (typeof cuent_list !== 'undefined' && cuent_list.length > 0) || 
      (typeof moned_list !== 'undefined' && moned_list.length > 0);// || (typeof ant_list !== 'undefined' && ant_list.length > 0) || (sald_list !== 'undefined' && sald_list.length > 0);

    const validacion_pagando = ant.anticipo_cantidad_anticipo > 0;

    const validacion_observacion = ant.anticipo_procesos_comentarios != "" && this.validator.strFilter(ant.anticipo_procesos_comentarios) == true && ant.anticipo_procesos_comentarios.length >= 4;
    const validacion_documents = this.docsAnticipoAnexosNames.length > 0; 

    return validacion_fecha_contabilizacion && validacion_moneda && validacion_tipo_cambio && validacion_salida_dinero && validacion_pagando && validacion_observacion;// && validacion_documents;
  }

  anticipo_autorizar(ant:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          const caja_list = this.listaCajasRegistradas.filter((row:any) => row.select_for_pagos && row.monto_aplicar > 0 && row.monto_aplicar <= ant.anticipo_cantidad_anticipo);
          const cuent_list = this.listaCuentasBancarias.filter((row:any) => row.select_for_pagos && row.monto_aplicar > 0 && row.monto_aplicar <= ant.anticipo_cantidad_anticipo);
          const moned_list = this.listaCuentasMonederoElectronico.filter((row:any) => row.select_for_pagos && row.monto_aplicar > 0 && row.monto_aplicar <= ant.anticipo_cantidad_anticipo);
          this.provSer.autorizarAnticipo(
            ant,
            caja_list,
            cuent_list,
            moned_list,
            this.docsAnticipoAnexos).subscribe(
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
                this.getCajasRegistradas();
                this.getCuentasBancarias();
                this.getMonederosElectronicos();
                this.lista_anticipos_para_autorizar();
                this.lista_anticipos_catalogo_autorizados();
                this.relInterna.mensajeAnticipoDeudorInsert("anticipo_autorizado");
                this.filesAnticipo = [];
                this.docsAnticipoAnexos = [];
                this.docsAnticipoAnexosNames = [];
                ant.visible_for_autorizar = false;
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
      }
    );
  }

//solicitudes de anticipos
  lista_anticipos_catalogo_autorizados(){
    this.ver_anticipos_catalogo_autorizados(this.indicadorAnticiposAutorizados);
  }

  ver_anticipos_catalogo_autorizados(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorAnticiposAutorizados = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var pag_anticipos_otras_fechas = document.getElementById("pag_anticipos_otras_fechas");
      if (this.rangoPeriodoAnticiposAutorizados && this.rangoPeriodoAnticiposAutorizados[1]) {
        const dateInicio = this.rangoPeriodoAnticiposAutorizados[0];
        const dateFin = this.rangoPeriodoAnticiposAutorizados[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(pag_anticipos_otras_fechas);
          } else {
            this.validator.errorInputRow(pag_anticipos_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(pag_anticipos_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(pag_anticipos_otras_fechas);
      }
    }

    this.provSer.listarAnticiposAutorizadosProvCatalogo(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.anticipos_cat_autorizados = response.anticipos_registrados;
          this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
        } else {
          this.anticipos_cat_autorizados = []; // O manejar mensaje de "sin datos"
        }
      },
      error: (err) => {
        console.error('Error al cargar anticipos:', err);
        this.anticipos_cat_autorizados = [];
      }
    });
  }

  anticipo_desglose(ant:any){
    this.provSer.desgloseAnticipo(ant.anticipo_uuid).subscribe(
      response => {
        if (response.status == "success") {
          console.log(response);
          //const folio_ant = this.anticipos_cat_autorizados.find((ant:any) => ant.anticipo_uuid === anticipo_uuid);
          this.desglose_anticipo_folio = typeof ant !== 'undefined' ? ant.anticipo_folio : '';
          this.info_anticipo_desglose = response.anticipos_registrados;
        }
      }
    );
  }

  anticipo_solicitar_cancelacion(ant: any) {
    this.anticipo_window_cancelacion = true;
    this.cancelacion_anticipo_uuid = ant.anticipo_uuid;
    this.cancelacion_anticipo_folio = ant.anticipo_folio;
    this.limpia_form_cancelacion();
  }

  limpia_form_cancelacion() {
    this.viewNewCancelacionForm = true;
    this.cancelacion_fecha_contabilizacion = "";
    this.cancelacion_observaciones = "";
  }

  cancel_fecha_contabilizacion(event:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value); 
    this.cancelacion_fecha_contabilizacion = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    console.log(this.cancelacion_fecha_contabilizacion);
  }

  keyupObservacionCancelacion(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.cancelacion_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaRegistroCancelacionAnticipo():Boolean{
    const OKFechaCont = this.cancelacion_fecha_contabilizacion != "" && this.validator.filtroFecha(this.cancelacion_fecha_contabilizacion);
    const OKObservaciones = this.cancelacion_observaciones != '' && this.validator.filtroAlfaNumerico(this.cancelacion_observaciones);

    return this.cancelacion_anticipo_uuid != '' && OKFechaCont && OKObservaciones;
  }

  anticipo_enviar_solicitud_cancelacion(form: { reset: () => void; }):void{
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
        this.viewNewCancelacionForm = false;
        this.provSer.anticipoSolicitarCancelacion(this.cancelacion_anticipo_uuid,this.cancelacion_fecha_contabilizacion,this.cancelacion_observaciones).subscribe(
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
              form.reset();
              this.anticipo_window_cancelacion = false;
              this.limpia_form_cancelacion();
              this.relInterna.mensajeFNZSSoliCancelacion("seccion_fnzs_soli_cancelacion");
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
          error => { console.log(error); }
        );
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
