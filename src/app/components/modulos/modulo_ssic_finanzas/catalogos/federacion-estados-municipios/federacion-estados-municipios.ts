import { Component, OnInit } from '@angular/core';
import { FedEstMunService } from '../../../../../servicios/ssic/fed-est-mun-service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { TranslateService } from '@ngx-translate/core';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { FormBuilder, NgForm } from '@angular/forms';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { estadosMunicipiosModelo } from '../../../../../modelos/estadosMunicipiosModelo';
import Swal from 'sweetalert2';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';

@Component({
  selector: 'app-federacion-estados-municipios',
  standalone: false,
  templateUrl: './federacion-estados-municipios.html',
  styleUrls: [
    '../../../../../styles/loading.css',
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
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/navegador.css',
    '../../finanzas.css',
    './federacion-estados-municipios.css']
})
export class FederacionEstadosMunicipios implements OnInit {
  public usuario:Usuarios;
  public modelFedEstMun: estadosMunicipiosModelo;
  public modelDetFedEstMun: estadosMunicipiosModelo;
  public fed_nuevo_registro:any = [];
  public fed_ver_registro_form:boolean = false;
  public fed_registro_form:boolean = true;

//catalogo
  fed_catalogo_activo:any = [];

  public ver_ventana_fed_detalle:boolean = false;
  fed_detalle:any = [];
  public ver_info_fed_form:boolean = false;

  public ver_ventana_fed_deleted:boolean = false;
  fed_catalogo_eliminados:any = [];

  constructor(
    private fedEstMunServ:FedEstMunService,
    private validator:ValidatorServService,
    private relInterna:ComunicacionInternaService,
    private translate:TranslateService,
    private servXlsx:DescargaExcel,
    private fb: FormBuilder) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.modelFedEstMun = new estadosMunicipiosModelo('','','','');
    this.modelDetFedEstMun = new estadosMunicipiosModelo('','','','');
  }

  ngOnInit(): void {
    this.fed_nuevo_registro = [{"id":1}];
    this.listadoCatalogo();
    this.listadoDeletedCatalogo();
  }
  
  fedVerFormReg(){
    this.fed_ver_registro_form = true; 
  }

  changeFechaContabilizacion(event:any){
    const validacion = event.value != '' && this.validator.filtroFecha(event.value);
    this.modelFedEstMun.fed_est_mun_fecha_cont = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupFedEstMunName(event:any){
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 3;
    this.modelFedEstMun.fed_est_mun_name = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupFedEstMunRfc(event:any){
    const validacion = event.value != "" && this.validator.filtroRfcPersMoral(event.value) && event.value.length == 12;
    this.modelFedEstMun.fed_est_mun_rfc = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupFedEstMunObservacion(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4;
    this.modelFedEstMun.fed_est_mun_observaciones = validacion ? event.value : "";
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  get validaFedEstMunRegistro():Boolean {
    const validaFedEstMunFechaCont = this.modelFedEstMun.fed_est_mun_fecha_cont != "" && this.validator.filtroFecha(this.modelFedEstMun.fed_est_mun_fecha_cont);
    const validaFedEstMunName = this.modelFedEstMun.fed_est_mun_name != "" && this.validator.filtroAlfaNumerico(this.modelFedEstMun.fed_est_mun_name) && this.modelFedEstMun.fed_est_mun_name.length >= 3;
    const validaFedEstMunRfc = this.modelFedEstMun.fed_est_mun_rfc != '' && this.validator.filtroRfcPersMoral(this.modelFedEstMun.fed_est_mun_rfc) && this.modelFedEstMun.fed_est_mun_rfc.length == 12;
    const validaFedEstMunObservacion = this.modelFedEstMun.fed_est_mun_observaciones != '' && this.validator.filtroAlfaNumerico(this.modelFedEstMun.fed_est_mun_observaciones) && this.modelFedEstMun.fed_est_mun_observaciones.length >= 4; 

    return validaFedEstMunFechaCont && validaFedEstMunName && validaFedEstMunRfc && validaFedEstMunObservacion;
  }

  fedEstMunRegistro(form:NgForm):void{
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
        this.fed_registro_form = false;
        this.fedEstMunServ.fedEstMunRegistro(this.modelFedEstMun).subscribe(
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
              form.reset();
              form.resetForm();
              this.fed_registro_form = true;
              this.listadoCatalogo();
              this.modelFedEstMun = new estadosMunicipiosModelo('','','','');
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
            //console.log(error);
          }
        );
      }
    })
  }

  descarga_excel_federaciones(){ 
    const columnas:ExcelColumnas[] = [
      {label: "No. caja", field: "caja_folio", align: "center"},
      {label: "Alias", field: "caja_alias", align: "center"},
      {label: "Almacen (Alias)", field: "establecimiento", align: "right"}
    ];
    this.servXlsx.descarga_xlsx_documento(this.fed_catalogo_activo,columnas,'Cajas','catálogo de cajas.xlsx');
  }

  listadoCatalogo(){
    this.fedEstMunServ.fedEstMunCatalogoActivo().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.fed_catalogo_activo = response.federaciones;
          console.log(this.fed_catalogo_activo);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  detalleFedEstMun(fed_est_mun_token:string){
    this.fedEstMunServ.fedEstMunDetalle(fed_est_mun_token).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.ver_ventana_fed_detalle = true;
          this.ver_info_fed_form = true;
          this.fed_detalle = response.federaciones;
          this.fed_detalle.forEach((fed:any) => {
            this.modelDetFedEstMun.fed_est_mun_fecha_cont = fed.fed_est_mun_fecha_contabilizacion_edit;
            this.modelDetFedEstMun.fed_est_mun_name = fed.fed_est_mun_entidad;
            this.modelDetFedEstMun.fed_est_mun_rfc = fed.fed_est_mun_rfc;
            this.modelDetFedEstMun.fed_est_mun_observaciones = fed.fed_est_mun_observaciones;
          });
          console.log(this.fed_detalle);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  detFedEstMunFechaCont(event:any,fed_est_mun_token:string){
    const fed_info = this.fed_detalle.find((fed:any) => fed.fed_est_mun_token === fed_est_mun_token);
    this.modelDetFedEstMun.fed_est_mun_fecha_cont = event.value;
    const validacion = event.value != '' && this.validator.filtroFecha(event.value) && typeof fed_info !== 'undefined' && this.modelDetFedEstMun.fed_est_mun_fecha_cont != fed_info.fed_est_mun_fecha_contabilizacion_edit;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  detFedEstMunName(event:any,fed_est_mun_token:string){
    const fed_info = this.fed_detalle.find((fed:any) => fed.fed_est_mun_token === fed_est_mun_token);
    this.modelDetFedEstMun.fed_est_mun_name = event.value;
    const validacion = event.value != '' && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 3 && typeof fed_info !== 'undefined' && this.modelDetFedEstMun.fed_est_mun_name != fed_info.fed_est_mun_entidad;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  detFedEstMunRfc(event:any,fed_est_mun_token:string){
    const fed_info = this.fed_detalle.find((fed:any) => fed.fed_est_mun_token === fed_est_mun_token);
    this.modelDetFedEstMun.fed_est_mun_rfc = event.value;
    const validacion = event.value != "" && this.validator.filtroRfcPersMoral(event.value) && event.value.length == 12 && typeof fed_info !== 'undefined' && this.modelDetFedEstMun.fed_est_mun_rfc != fed_info.fed_est_mun_rfc;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  detFedEstMunObservacion(event:any,fed_est_mun_token:string){
    const fed_info = this.fed_detalle.find((fed:any) => fed.fed_est_mun_token === fed_est_mun_token);
    this.modelDetFedEstMun.fed_est_mun_observaciones = event.value;
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && event.value.length >= 4 && typeof fed_info !== 'undefined' && this.modelDetFedEstMun.fed_est_mun_observaciones != fed_info.fed_est_mun_observaciones;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  validaFedEstMunUpdate(fed_est_mun_token:string):Boolean {
    const fed_info = this.fed_detalle.find((fed:any) => fed.fed_est_mun_token === fed_est_mun_token);
    if (typeof fed_info !== 'undefined') {
      const fed_fcon = this.modelDetFedEstMun.fed_est_mun_fecha_cont;
      const fed_name = this.modelDetFedEstMun.fed_est_mun_name;
      const fed_rrfc = this.modelDetFedEstMun.fed_est_mun_rfc;
      const fed_obse = this.modelDetFedEstMun.fed_est_mun_observaciones;
      
      const validaFedEstMunFechaCont = fed_fcon != "" && this.validator.filtroFecha(fed_fcon) && fed_fcon != fed_info.fed_est_mun_fecha_contabilizacion_edit;
      const validaFedEstMunName = fed_name != "" && this.validator.filtroAlfaNumerico(fed_name) && fed_name.length >= 3 && fed_name != fed_info.fed_est_mun_entidad;
      const validaFedEstMunRfc = fed_rrfc != '' && this.validator.filtroRfcPersMoral(fed_rrfc) && fed_rrfc.length == 12 && fed_rrfc != fed_info.fed_est_mun_rfc;
      const validaFedEstMunObservacion = fed_obse != '' && this.validator.filtroAlfaNumerico(fed_obse) && fed_obse.length >= 4 && fed_obse != fed_info.fed_est_mun_observaciones; 
  
      return validaFedEstMunFechaCont || validaFedEstMunName || validaFedEstMunRfc || validaFedEstMunObservacion;
    } else {
      return false;
    }
  }

  actualizaFedEstMun(fed_est_mun_token:string){
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
        this.ver_info_fed_form = false;
        this.fedEstMunServ.fedEstMunUpdate(fed_est_mun_token,this.modelDetFedEstMun).subscribe(
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
              this.ver_info_fed_form = true;
              this.detalleFedEstMun(fed_est_mun_token);
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

  deleteFedEstMun(fed_est_mun_token:string){
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
        this.fedEstMunServ.fedEstMunDelete(fed_est_mun_token).subscribe(
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
              this.listadoCatalogo();
              this.listadoDeletedCatalogo();
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
  
  verVentanaFedEliminados(){
    this.ver_ventana_fed_deleted = true;
  }

  listadoDeletedCatalogo(){
    this.fedEstMunServ.fedEstMunCatalogoEliminados().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.fed_catalogo_eliminados = response.federaciones;
          console.log(this.fed_catalogo_eliminados);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  restoreFedEstMun(fed_est_mun_token:string){
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
        this.fedEstMunServ.fedEstMunRestaurar(fed_est_mun_token).subscribe(
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
              this.listadoCatalogo();
              this.listadoDeletedCatalogo();
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

  deletePermFedEstMun(fed_est_mun_token:string){
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
        this.fedEstMunServ.fedEstMunPermDelete(fed_est_mun_token).subscribe(
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
              this.listadoCatalogo();
              this.listadoDeletedCatalogo();
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
