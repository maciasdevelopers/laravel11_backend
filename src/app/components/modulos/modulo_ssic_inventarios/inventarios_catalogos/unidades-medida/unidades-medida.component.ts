import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { LotesServService } from '../../../../../servicios/ssic/lotes-serv.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UniMedServService, UnidadMedida } from '../../../../../servicios/uni-med-serv.service';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-unidades-medida',
  standalone: false,
  templateUrl: './unidades-medida.component.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
    './unidades-medida.component.css'
  ],
})
export class UnidadesMedidaComponent implements OnInit {
  @ViewChild('formRegistroUMedida') formUMEDReg!: NgForm;
  public usuario: Usuarios;
  sat_unidades_de_medida:any = [];
  catalogoUnidadesMedINVENT:any = [];

  info_unidad_medida_desglose:any = [];
  desglose_unidad_medida_folio:string = "";
  public edit_u_medida_nombre:string = "";
  public edit_u_medida_simbolo:string = "";
  public edit_u_medida_categoria:string = "";
  public edit_u_medida_sat_vinculo:string = "";

  catalogoDeletedUnidadesMedINVENT:any = [];

  public new_u_medida_nombre:string = "";
  public new_u_medida_simbolo:string = "";
  public new_u_medida_categoria:string = "";
  public new_u_medida_sat_vinculo:string = "";

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    public validator:ValidatorServService,
    public loteServ:LotesServService,
    public uni_med:UniMedServService,
    private translate:TranslateService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.listaUMedTrue();
    this.listaUMedDeleted();
    this.inventSATUnidadesMedida();
  }

//catalogos
  listaUMedTrue(){
    this.uni_med.inventUnidadesMedidaCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogoUnidadesMedINVENT = response.listaUMedida;
          console.log(this.catalogoUnidadesMedINVENT);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  desglosaUMedida(token_unidad_medida:any){
    const desglose = this.catalogoUnidadesMedINVENT.find((row:any) => row.token_unidad_medida === token_unidad_medida);
    this.info_unidad_medida_desglose = [];
    this.info_unidad_medida_desglose.push(desglose);
    console.log(this.info_unidad_medida_desglose);
    this.desglose_unidad_medida_folio = desglose.folio_unidad_medida;
    this.edit_u_medida_nombre = desglose.nombre;
    this.edit_u_medida_simbolo = desglose.simbolo;
    this.edit_u_medida_categoria = desglose.categoria;
    this.edit_u_medida_sat_vinculo = desglose.sat_vinculo;
  }

  editUmed_nombre(token_unidad_medida:any,event:any){
    const desg = this.info_unidad_medida_desglose.find((row:any) => row.token_unidad_medida === token_unidad_medida);
    this.edit_u_medida_nombre = event.value;
    const validacion = this.edit_u_medida_nombre != "" && this.validator.filtroAlfaNumerico(this.edit_u_medida_nombre) && typeof desg !== 'undefined' && this.edit_u_medida_nombre != desg.nombre;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  editUmed_simbolo(token_unidad_medida:any,event:any){
    const desg = this.info_unidad_medida_desglose.find((row:any) => row.token_unidad_medida === token_unidad_medida);
    this.edit_u_medida_simbolo = event.value;
    const validacion = this.edit_u_medida_simbolo != "" && this.validator.filtroAlfaNumerico(this.edit_u_medida_simbolo) && typeof desg !== 'undefined' && this.edit_u_medida_simbolo != desg.simbolo;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  editUmed_categoria(token_unidad_medida:any,event:any){
    const desg = this.info_unidad_medida_desglose.find((row:any) => row.token_unidad_medida === token_unidad_medida);
    this.edit_u_medida_categoria = event.value;
    const validacion = this.edit_u_medida_categoria != "" && this.validator.filtroAlfaNumerico(this.edit_u_medida_categoria) && typeof desg !== 'undefined' && this.edit_u_medida_categoria != desg.categoria;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  editUmed_sat_homologa(token_unidad_medida:any,opcion:any){
    const desg = this.info_unidad_medida_desglose.find((row:any) => row.token_unidad_medida === token_unidad_medida);
    var selectedSATMed = document.getElementById("selectedSATEditMed");
    let sat = this.sat_unidades_de_medida.find((row:any) => opcion.sat_clave != '' && row.sat_clave == opcion.sat_clave);  
    this.edit_u_medida_sat_vinculo = typeof sat !== 'undefined' ? sat.sat_clave : '';
    const validacion = typeof sat !== 'undefined' && typeof desg !== 'undefined' && this.edit_u_medida_sat_vinculo != desg.sat_vinculo;
    validacion ? this.validator.correctoSelectBrowser(selectedSATMed) : this.validator.errorSelectBrowser(selectedSATMed);
  }

  editUmed_valida_update(token_unidad_medida:any):Boolean{
    const desg = this.info_unidad_medida_desglose.find((row:any) => row.token_unidad_medida === token_unidad_medida);
    const validacion_nombre = typeof desg !== 'undefined' && this.edit_u_medida_nombre != "" && this.validator.filtroAlfaNumerico(this.edit_u_medida_nombre) && this.edit_u_medida_nombre != desg.nombre;
    const validacion_simbolo = typeof desg !== 'undefined' && this.edit_u_medida_simbolo != "" && this.validator.filtroAlfaNumerico(this.edit_u_medida_simbolo) && this.edit_u_medida_simbolo != desg.simbolo;
    const validacion_categoria = typeof desg !== 'undefined' && this.edit_u_medida_categoria != "" && this.validator.filtroAlfaNumerico(this.edit_u_medida_categoria) && this.edit_u_medida_categoria != desg.categoria;
    const validacion_sat_vinculo = typeof desg !== 'undefined' && this.edit_u_medida_sat_vinculo != "" && this.edit_u_medida_sat_vinculo != desg.sat_vinculo;
    return !desg.unidad_utilizada && (validacion_nombre || validacion_simbolo || validacion_categoria || validacion_sat_vinculo);
  }

  updateUMedida(token_unidad_medida:any):void{
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
        this.uni_med.uniMedCatalogoUpdateGenerales(token_unidad_medida,this.edit_u_medida_nombre,this.edit_u_medida_simbolo,this.edit_u_medida_categoria,this.edit_u_medida_sat_vinculo).subscribe(
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
                })
              },1000);
              this.desglosaUMedida(token_unidad_medida);
              this.listaUMedTrue();
              this.listaUMedDeleted();
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
    })
  }

  habilitaUMedida(token_unidad_medida:any):void{
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
        this.uni_med.unidadesMedidaHabilitar(token_unidad_medida).subscribe(
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
                })
              },1000);
              this.listaUMedTrue();
              this.listaUMedDeleted();
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
    })
  }

  deshabilitaUMedida(token_unidad_medida:any):void{
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
        this.uni_med.unidadesMedidaDeshabilitar(token_unidad_medida).subscribe(
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
                })
              },1000);
              this.listaUMedTrue();
              this.listaUMedDeleted();
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
    })
  }

  sendtoPapeleraUMedida(token_unidad_medida:any):void{
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
        this.uni_med.unidadesMedidaEliminarPapelera(token_unidad_medida).subscribe(
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
                })
              },1000);
              this.listaUMedTrue();
              this.listaUMedDeleted();
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
    })
  }

  listaUMedDeleted(){
    this.uni_med.inventUnidadesMedidaEliminadasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogoDeletedUnidadesMedINVENT = response.listaUMedida;
          console.log(this.catalogoDeletedUnidadesMedINVENT);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  restaurarUMedida(token_unidad_medida:any):void{
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
        this.uni_med.unidadesMedidaRestaurar(token_unidad_medida).subscribe(
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
                })
              },1000);
              this.listaUMedTrue();
              this.listaUMedDeleted();
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
    })
  }

  eliminacionPermanenteUMedida(token_unidad_medida:any):void{
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
        this.uni_med.unidadesMedidaEliminacionPermanente(token_unidad_medida).subscribe(
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
                })
              },1000);
              this.listaUMedTrue();
              this.listaUMedDeleted();
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
    })
  }

//registro
  inventSATUnidadesMedida() {
    this.uni_med.inventSATUnidadesMedida().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response.listMedidas);
          this.sat_unidades_de_medida = response.unidades_medida_sat;
          console.log(this.sat_unidades_de_medida);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  regUmed_nombre(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_u_medida_nombre = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  regUmed_simbolo(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_u_medida_simbolo = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  regUmed_categoria(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.new_u_medida_categoria = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  regUmed_sat_homologa(opcion:any){
    var selectedSATMed = document.getElementById("selectedSATMed");
    let sat = this.sat_unidades_de_medida.find((row:any) => opcion.sat_clave != '' && row.sat_clave == opcion.sat_clave);  
    this.new_u_medida_sat_vinculo = typeof sat !== 'undefined' ? sat.sat_clave : '';
    typeof sat !== 'undefined' ? this.validator.correctoSelectBrowser(selectedSATMed) : this.validator.errorSelectBrowser(selectedSATMed);
  }

  get regUmed_valida_registro():Boolean{
    const validacion_nombre = this.new_u_medida_nombre != "" && this.validator.filtroAlfaNumerico(this.new_u_medida_nombre);
    const validacion_simbolo = this.new_u_medida_simbolo != "" && this.validator.filtroAlfaNumerico(this.new_u_medida_simbolo);
    const validacion_categoria = this.new_u_medida_categoria != "" && this.validator.filtroAlfaNumerico(this.new_u_medida_categoria);
    return validacion_nombre && validacion_simbolo && validacion_categoria;
  }

  registraUMedida(form:NgForm):void{
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
        this.uni_med.uniMedCatalogoRegistrar(this.new_u_medida_nombre,this.new_u_medida_simbolo,this.new_u_medida_categoria,this.new_u_medida_sat_vinculo).subscribe(
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
                })
              },1000);
              form.resetForm();
              this.validator.limpiaInputRow(document.getElementById("dataMedNombre"));
              this.validator.limpiaInputRow(document.getElementById("dataMedSimbolo"));
              this.validator.limpiaInputRow(document.getElementById("dataMedCategoria"));
              this.validator.limpiaInputRow(document.getElementById("selectedSATMed"));
              this.new_u_medida_nombre = "";
              this.new_u_medida_simbolo = "";
              this.new_u_medida_categoria = "";
              this.new_u_medida_sat_vinculo = "";

              this.formUMEDReg.resetForm();
              this.listaUMedTrue();
              this.listaUMedDeleted();
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
    })
  }
}
